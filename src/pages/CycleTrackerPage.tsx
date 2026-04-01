import { useEffect, useMemo, useState } from 'react';
import { BellIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import {
  isPushSupported,
  showReminderViaServiceWorker,
  subscribeToPushNotifications,
  syncPushSubscription,
  syncReminderSchedule,
} from '../api/reminderService';
import Button from '../components/Button';
import Card from '../components/Card';
import PageIllustration from '../components/PageIllustration';
import type { CyclePhase, CycleSettings } from '../types';
import { loadCycleSettings, saveCycleSettings } from '../utils/storage';

const defaultSettings: CycleSettings = {
  cycleLength: 28,
  periodLength: 5,
  lastPeriodStart: new Date().toISOString().slice(0, 10),
  remindersEnabled: false,
  reminderTime: '19:00',
};

const DAY_MS = 24 * 60 * 60 * 1000;

function daysBetween(fromIso: string, toDate: Date): number {
  const from = new Date(`${fromIso}T00:00:00`);
  return Math.floor((toDate.getTime() - from.getTime()) / DAY_MS);
}

function addDays(isoDate: string, days: number): Date {
  const start = new Date(`${isoDate}T00:00:00`);
  return new Date(start.getTime() + days * DAY_MS);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

export default function CycleTrackerPage() {
  const [settings, setSettings] = useState<CycleSettings>(() => loadCycleSettings() ?? defaultSettings);
  const [saved, setSaved] = useState(false);
  const [pushReady, setPushReady] = useState(false);
  const [notificationState, setNotificationState] = useState<NotificationPermission | 'unsupported'>(() => {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  });

  const cycleInfo = useMemo(() => {
    const today = new Date();
    const elapsed = Math.max(0, daysBetween(settings.lastPeriodStart, today));
    const dayInCycle = (elapsed % settings.cycleLength) + 1;
    const nextPeriodDate = addDays(settings.lastPeriodStart, elapsed - (dayInCycle - 1) + settings.cycleLength);
    const ovulationDay = Math.max(1, settings.cycleLength - 14);
    const fertileStartDay = Math.max(1, ovulationDay - 4);
    const fertileEndDay = Math.min(settings.cycleLength, ovulationDay + 1);

    let phase: CyclePhase = 'luteal';
    if (dayInCycle <= settings.periodLength) {
      phase = 'menstrual';
    } else if (dayInCycle < fertileStartDay) {
      phase = 'follicular';
    } else if (dayInCycle <= fertileEndDay) {
      phase = 'ovulation';
    }

    const daysToNextPeriod = Math.max(0, Math.ceil((nextPeriodDate.getTime() - today.getTime()) / DAY_MS));

    return {
      dayInCycle,
      nextPeriodDate,
      daysToNextPeriod,
      ovulationDay,
      fertileStartDay,
      fertileEndDay,
      phase,
    };
  }, [settings]);

  useEffect(() => {
    saveCycleSettings(settings);
  }, [settings]);

  useEffect(() => {
    void syncReminderSchedule({
      reminderTime: settings.reminderTime,
      daysToNotify: 2,
      remindersEnabled: settings.remindersEnabled,
    }).catch(() => {
      // Keep UI usable when backend schedule sync is unavailable.
    });
  }, [settings.reminderTime, settings.remindersEnabled]);

  useEffect(() => {
    if (!settings.remindersEnabled || notificationState !== 'granted') {
      return;
    }

    const runReminderCheck = () => {
      const now = new Date();
      const [hour, minute] = settings.reminderTime.split(':').map((part) => Number(part));
      const isReminderMinute = now.getHours() === hour && now.getMinutes() === minute;

      if (!isReminderMinute || cycleInfo.daysToNextPeriod > 2) {
        return;
      }

      const reminderKey = `girlcare-reminder-${now.toISOString().slice(0, 10)}-${settings.reminderTime}`;
      if (localStorage.getItem(reminderKey)) {
        return;
      }

      const body = `Your next period is expected in ${cycleInfo.daysToNextPeriod} day(s). Prepare your supplies and plan ahead.`;
      void showReminderViaServiceWorker('GirlCare Cycle Reminder', body).then((shownBySw) => {
        if (!shownBySw) {
          new Notification('GirlCare Cycle Reminder', { body });
        }
      });
      localStorage.setItem(reminderKey, 'sent');
    };

    runReminderCheck();
    const timer = window.setInterval(runReminderCheck, 30 * 1000);
    return () => window.clearInterval(timer);
  }, [cycleInfo.daysToNextPeriod, notificationState, settings.remindersEnabled, settings.reminderTime]);

  const phaseTips: Record<CyclePhase, string> = {
    menstrual: 'Prioritize rest, hydration, and iron-rich foods. Track pain and flow level daily.',
    follicular: 'Energy may rise. This is a good phase for planning, exercise, and setting new goals.',
    ovulation: 'Fertile window is active. If avoiding pregnancy, use reliable protection and stay informed.',
    luteal: 'Mood and energy can shift. Keep routines gentle, sleep well, and reduce stress.',
  };

  const requestNotifications = async () => {
    if (!('Notification' in window)) {
      setNotificationState('unsupported');
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationState(permission);

    if (permission === 'granted' && isPushSupported()) {
      try {
        const subscription = await subscribeToPushNotifications();
        if (subscription) {
          await syncPushSubscription(subscription);
          setPushReady(true);
        }
      } catch {
        setPushReady(false);
      }
    }
  };

  const handleSave = () => {
    saveCycleSettings(settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="space-y-4 pb-20 animate-fadeInUp">
      <PageIllustration
        badge="Track"
        title="Menstrual Cycle Checker"
        subtitle="Calculate your cycle, understand regulation phases, and enable reminders."
        icon={CalendarDaysIcon}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-heading text-xl font-semibold text-textBase dark:text-slate-100">Cycle Settings</h2>

          <label className="mt-4 block text-sm font-semibold text-textBase dark:text-slate-100">
            Last period start date
            <input
              type="date"
              value={settings.lastPeriodStart}
              onChange={(event) => setSettings((prev) => ({ ...prev, lastPeriodStart: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </label>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-textBase dark:text-slate-100">
              Cycle length (days)
              <input
                type="number"
                min={21}
                max={40}
                value={settings.cycleLength}
                onChange={(event) =>
                  setSettings((prev) => ({ ...prev, cycleLength: Number(event.target.value) || prev.cycleLength }))
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </label>

            <label className="block text-sm font-semibold text-textBase dark:text-slate-100">
              Period length (days)
              <input
                type="number"
                min={2}
                max={10}
                value={settings.periodLength}
                onChange={(event) =>
                  setSettings((prev) => ({ ...prev, periodLength: Number(event.target.value) || prev.periodLength }))
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </label>
          </div>

          <label className="mt-3 block text-sm font-semibold text-textBase dark:text-slate-100">
            Daily reminder time
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(event) => setSettings((prev) => ({ ...prev, reminderTime: event.target.value || '19:00' }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </label>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={settings.remindersEnabled}
                onChange={(event) => setSettings((prev) => ({ ...prev, remindersEnabled: event.target.checked }))}
                className="h-4 w-4"
              />
              Enable reminders
            </label>

            <Button variant="ghost" onClick={handleSave}>Save Settings</Button>
          </div>

          {saved ? <p className="mt-2 text-sm font-semibold text-emerald-600">Saved successfully.</p> : null}

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="text-sm font-semibold text-textBase dark:text-slate-100">Browser notifications</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Status:{' '}
              <span className="font-semibold capitalize">{notificationState === 'unsupported' ? 'not supported' : notificationState}</span>
            </p>
            <button
              onClick={requestNotifications}
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary"
              disabled={notificationState === 'granted' || notificationState === 'unsupported'}
            >
              <BellIcon className="h-4 w-4" /> Allow Notifications
            </button>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Push sync: {pushReady ? 'Connected' : 'Not connected'}
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-b from-white to-primary/5 dark:from-slate-900 dark:to-primary/10">
          <h2 className="font-heading text-xl font-semibold text-textBase dark:text-slate-100">Cycle Insights</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-primary/10 p-3 dark:bg-primary/20">
              <p className="text-xs uppercase tracking-wide text-primary">Current day</p>
              <p className="mt-1 text-xl font-bold text-textBase dark:text-slate-100">Day {cycleInfo.dayInCycle}</p>
            </div>
            <div className="rounded-xl bg-secondary/10 p-3 dark:bg-secondary/20">
              <p className="text-xs uppercase tracking-wide text-secondary">Phase</p>
              <p className="mt-1 text-xl font-bold capitalize text-textBase dark:text-slate-100">{cycleInfo.phase}</p>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">
            Next expected period: <span className="font-semibold">{formatDate(cycleInfo.nextPeriodDate)}</span> ({cycleInfo.daysToNextPeriod} day(s) away)
          </p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            Estimated fertile window: Day {cycleInfo.fertileStartDay} to Day {cycleInfo.fertileEndDay}; ovulation around Day {cycleInfo.ovulationDay}.
          </p>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="text-sm font-semibold text-textBase dark:text-slate-100">Regulation Tip</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{phaseTips[cycleInfo.phase]}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
