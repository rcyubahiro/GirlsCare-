import { requestJson } from './httpClient';

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

function normalizeUint8Array(bytes: Uint8Array): Uint8Array {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Uint8Array(buffer);
}

export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    return null;
  }

  const vapidPublicKey = import.meta.env.VITE_PUSH_PUBLIC_KEY;
  if (!vapidPublicKey) {
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  if (existing) {
    return existing;
  }

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: normalizeUint8Array(base64UrlToUint8Array(vapidPublicKey)) as unknown as BufferSource,
  });
}

export async function syncPushSubscription(subscription: PushSubscription): Promise<void> {
  await requestJson<{ status: string }>('/reminders/push-subscriptions', {
    method: 'POST',
    body: subscription.toJSON(),
  });
}

export async function syncReminderSchedule(input: {
  reminderTime: string;
  daysToNotify: number;
  remindersEnabled: boolean;
}): Promise<void> {
  await requestJson<{ status: string }>('/reminders/schedule', {
    method: 'POST',
    body: input,
  });
}

export async function showReminderViaServiceWorker(title: string, body: string): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'girlcare-cycle-reminder',
    });
    return true;
  } catch {
    return false;
  }
}
