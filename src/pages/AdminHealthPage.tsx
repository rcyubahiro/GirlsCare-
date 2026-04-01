import { useMemo, useState } from 'react';
import {
  fetchMentorMessages,
  fetchMentors,
  fetchTypingStatus,
  markMentorMessagesRead,
  sendMentorMessage,
  sendTypingStatus,
} from '../api/mentorChatService';
import {
  isPushSupported,
  showReminderViaServiceWorker,
  subscribeToPushNotifications,
  syncPushSubscription,
  syncReminderSchedule,
} from '../api/reminderService';
import { API_BASE_URL } from '../api/httpClient';
import Button from '../components/Button';
import Card from '../components/Card';
import PageIllustration from '../components/PageIllustration';
import { WrenchScrewdriverIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { encryptMessage } from '../utils/chatCrypto';

interface TestResult {
  action: string;
  ok: boolean;
  details: string;
  at: string;
  response?: unknown;
}

function buildAlias(): string {
  return localStorage.getItem('girlcare-anon-alias') ?? 'Anonymous-Tester';
}

export default function AdminHealthPage() {
  const [mentorId, setMentorId] = useState('mentor-1');
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [expandedResponse, setExpandedResponse] = useState<string | null>(null);

  const latest = useMemo(() => results.slice().reverse(), [results]);
  const summary = useMemo(() => {
    const total = results.length;
    const passed = results.filter((r) => r.ok).length;
    const failed = total - passed;
    return { total, passed, failed };
  }, [results]);

  const addResult = (action: string, ok: boolean, details: string, response?: unknown) => {
    setResults((prev) => [
      ...prev,
      {
        action,
        ok,
        details,
        response,
        at: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const runAction = async (action: string, fn: () => Promise<unknown>) => {
    setRunning(true);
    try {
      const response = await fn();
      addResult(action, true, 'Success', response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      addResult(action, false, message, error);
    } finally {
      setRunning(false);
    }
  };

  const runPing = () =>
    runAction('Backend ping', async () => {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { Accept: 'application/json, text/plain, */*' },
      });

      if (!response.ok) {
        throw new Error(`Health endpoint failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    });

  const runMentorRead = () =>
    runAction('Mentor read simulation', async () => {
      const mentors = await fetchMentors();
      if (mentors.length === 0) {
        throw new Error('No mentors returned by backend');
      }
      const useMentorId = mentorId || mentors[0].id;
      const messages = await fetchMentorMessages(useMentorId);
      if (messages.length > 0) {
        await markMentorMessagesRead(useMentorId, messages[messages.length - 1].id);
      }
      return { mentors, messages };
    });

  const runMentorWrite = () =>
    runAction('Mentor write simulation', async () => {
      const encrypted = await encryptMessage(`Health-check message ${new Date().toISOString()}`);
      await sendMentorMessage({
        mentorId,
        alias: buildAlias(),
        encryptedContent: encrypted,
      });
      return { encrypted, mentorId };
    });

  const runTyping = () =>
    runAction('Typing status simulation', async () => {
      await sendTypingStatus(mentorId, true);
      await sendTypingStatus(mentorId, false);
      const typingStatus = await fetchTypingStatus(mentorId);
      return typingStatus;
    });

  const runReminderSync = () =>
    runAction('Reminder schedule sync', async () => {
      const reminderConfig = {
        reminderTime: '19:00',
        daysToNotify: 2,
        remindersEnabled: true,
      };
      await syncReminderSchedule(reminderConfig);
      return reminderConfig;
    });

  const runPushSubscription = () =>
    runAction('Push subscription sync', async () => {
      if (!isPushSupported()) {
        throw new Error('Push is not supported in this browser/environment');
      }
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error(`Notification permission is ${permission}`);
      }
      const subscription = await subscribeToPushNotifications();
      if (!subscription) {
        throw new Error('Missing VITE_PUSH_PUBLIC_KEY or subscription unavailable');
      }
      await syncPushSubscription(subscription);
      return subscription;
    });

  const runLocalSwNotification = () =>
    runAction('Service worker notification simulation', async () => {
      const ok = await showReminderViaServiceWorker('GirlCare Admin Test', 'Service worker notification works.');
      if (!ok) {
        throw new Error('Service worker notification failed');
      }
      return { success: ok };
    });

  const runAllChecks = async () => {
    setRunning(true);
    setResults([]);
    const tests = [
      { name: 'Backend ping', fn: runPing },
      { name: 'Mentor read', fn: runMentorRead },
      { name: 'Mentor write', fn: runMentorWrite },
      { name: 'Typing status', fn: runTyping },
      { name: 'Reminder sync', fn: runReminderSync },
      { name: 'Push subscription', fn: runPushSubscription },
      { name: 'Service worker notification', fn: runLocalSwNotification },
    ];

    for (const test of tests) {
      // Small delay between tests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 300));
      try {
        const testFn = test.fn;
        await testFn();
      } catch {
        // Error already captured by runAction
      }
    }
    setRunning(false);
  };

  return (
    <div className="space-y-4 pb-20 animate-fadeInUp">
      <PageIllustration
        badge="Admin"
        title="Integration Health Checks"
        subtitle="Quickly validate mentor chat and reminder backend integrations with one-click simulations."
        icon={WrenchScrewdriverIcon}
      />

      <Card>
        <h2 className="font-heading text-lg font-semibold text-textBase dark:text-slate-100">Test Controls</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Run ping/read/write simulations to validate backend wiring before production release.
        </p>

        <label className="mt-4 block text-sm font-semibold text-textBase dark:text-slate-100">
          Mentor ID
          <input
            value={mentorId}
            onChange={(event) => setMentorId(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800"
            placeholder="mentor-1"
          />
        </label>

        <div className="mt-4 flex gap-2">
          <Button variant="primary" onClick={runAllChecks} disabled={running} className="flex-1">
            {running ? 'Running checks...' : 'Run All Checks'}
          </Button>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <Button variant="ghost" onClick={runPing} disabled={running}>Ping backend</Button>
          <Button variant="ghost" onClick={runMentorRead} disabled={running}>Mentor read</Button>
          <Button variant="ghost" onClick={runMentorWrite} disabled={running}>Mentor write</Button>
          <Button variant="ghost" onClick={runTyping} disabled={running}>Typing status</Button>
          <Button variant="ghost" onClick={runReminderSync} disabled={running}>Reminder sync</Button>
          <Button variant="ghost" onClick={runPushSubscription} disabled={running}>Push subscription</Button>
          <Button variant="secondary" onClick={runLocalSwNotification} disabled={running}>SW notify</Button>
        </div>
      </Card>

      {results.length > 0 && (
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-textBase dark:text-slate-100">
              Test Summary
            </h2>
            <div className="flex gap-3 text-sm font-semibold">
              <span className="text-emerald-600 dark:text-emerald-400">
                ✓ Passed: {summary.passed}
              </span>
              {summary.failed > 0 && (
                <span className="text-red-600 dark:text-red-400">
                  ✗ Failed: {summary.failed}
                </span>
              )}
              <span className="text-slate-600 dark:text-slate-400">
                Total: {summary.total}
              </span>
            </div>
          </div>
          <progress
            className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 [&::-webkit-progress-bar]:bg-slate-200 dark:[&::-webkit-progress-bar]:bg-slate-700 [&::-webkit-progress-value]:bg-emerald-500 [&::-moz-progress-bar]:bg-emerald-500"
            max={summary.total}
            value={summary.passed}
            aria-label="Health check pass progress"
          />
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            {summary.passed === summary.total
              ? 'All checks passed! ✨'
              : `${summary.failed} check${summary.failed > 1 ? 's' : ''} need attention.`}
          </p>
        </Card>
      )}

      <Card>
        <h2 className="font-heading text-lg font-semibold text-textBase dark:text-slate-100">Test Results</h2>
        {latest.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">No tests run yet. Click "Run All Checks" or run individual tests.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {latest.map((result, index) => (
              <li
                key={`${result.at}-${result.action}-${index}`}
                className={[
                  'rounded-xl border px-3 py-2 text-sm overflow-hidden transition-all',
                  result.ok
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                    : 'border-red-200 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold">[{result.at}] {result.action}</p>
                    <p className="text-xs opacity-90">{result.details}</p>
                  </div>
                  {result.response !== undefined && (
                    <button
                      onClick={() =>
                        setExpandedResponse(
                          expandedResponse === `${result.at}-${result.action}-${index}`
                            ? null
                            : `${result.at}-${result.action}-${index}`,
                        )
                      }
                      className="flex-shrink-0 p-1 hover:opacity-75 transition-opacity"
                      title="Toggle response inspector"
                    >
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${
                          expandedResponse === `${result.at}-${result.action}-${index}` ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {expandedResponse === `${result.at}-${result.action}-${index}` && result.response !== undefined && (
                  <div className="mt-2 rounded bg-black bg-opacity-10 p-2">
                    <p className="text-xs font-mono font-bold opacity-75 mb-1">Response JSON:</p>
                    <pre className="text-xs overflow-x-auto max-h-32 opacity-90">
                      {JSON.stringify(result.response, null, 2)}
                    </pre>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
