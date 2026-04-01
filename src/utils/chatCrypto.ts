import type { EncryptedMessagePayload } from '../types';

const CHAT_KEY_STORAGE_KEY = 'girlcare-chat-aes-key';

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

async function loadOrCreateAesKey(): Promise<CryptoKey> {
  const existing = localStorage.getItem(CHAT_KEY_STORAGE_KEY);

  if (existing) {
    const rawKey = fromBase64(existing);
    return crypto.subtle.importKey('raw', toArrayBuffer(rawKey), { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
  }

  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  const exported = await crypto.subtle.exportKey('raw', key);
  localStorage.setItem(CHAT_KEY_STORAGE_KEY, toBase64(new Uint8Array(exported)));
  return key;
}

export async function encryptMessage(plainText: string): Promise<EncryptedMessagePayload> {
  const key = await loadOrCreateAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plainText);
  const cipherBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

  return {
    iv: toBase64(iv),
    cipherText: toBase64(new Uint8Array(cipherBuffer)),
  };
}

export async function decryptMessage(payload: EncryptedMessagePayload): Promise<string> {
  const key = await loadOrCreateAesKey();
  const iv = new Uint8Array(toArrayBuffer(fromBase64(payload.iv)));
  const cipherBytes = fromBase64(payload.cipherText);
  const plainBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, toArrayBuffer(cipherBytes));
  return new TextDecoder().decode(plainBuffer);
}
