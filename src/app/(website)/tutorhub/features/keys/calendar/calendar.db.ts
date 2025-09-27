'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUserId } from '@/lib/auth/auth';

// ✅ Use node:crypto and the modern APIs
import {
  randomBytes,
  scryptSync,
  createCipheriv,
  createDecipheriv,
} from 'node:crypto';

// ===== Encryption helpers (AES-256-GCM) =====
const RAW_SECRET = process.env.SERVICE_ENCRYPTION_KEY ?? '';
if (RAW_SECRET.length < 12) {
  // keep it lenient, but do log loudly in dev
  console.warn(
    'SERVICE_ENCRYPTION_KEY is short. Use a strong secret in production!'
  );
}

// Derive a 32-byte key (AES-256) from your env secret.
// scrypt is stable and avoids "must be 32 bytes" pitfalls.
const KEY = scryptSync(RAW_SECRET || 'dev-fallback-secret', 'svc-keys', 32);
const ALGO = 'aes-256-gcm';

// Format: ivHex:cipherHex:authTagHex
function encrypt(plaintext: string): string {
  const iv = randomBytes(12); // 12 bytes recommended for GCM
  const cipher = createCipheriv(ALGO, KEY, iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${enc.toString('hex')}:${tag.toString('hex')}`;
}

function decrypt(packed: string): string {
  const parts = packed.split(':');

  if (parts.length === 3) {
    // New GCM format: iv:cipher:tag
    const [ivHex, dataHex, tagHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const data = Buffer.from(dataHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');

    const decipher = createDecipheriv(ALGO, KEY, iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(data), decipher.final()]);
    return dec.toString('utf8');
  }

  // (Optional) Back-compat:
  // If you previously stored "iv:cipher" with CBC, you could add a CBC branch here.
  // But since your old code never used IV correctly and is erroring before save,
  // you likely have no legacy data to support yet.
  throw new Error('Unsupported ciphertext format');
}

// ===== Types & user helper =====
export interface CalendarKeyData {
  apiKey: string;
  calendarId: string;
}


// ===== Calendar-specific helpers =====
export async function getCalendarKey(): Promise<CalendarKeyData | null> {
  try {
    const userId = await getCurrentUserId();

    const serviceKey = await prisma.serviceKey.findUnique({
      where: {
        userId_service: { userId, service: 'calendar' },
      },
    });
    if (!serviceKey) return null;

    const keys = serviceKey.keys as any;
    return {
      apiKey: decrypt(keys.apiKey),
      calendarId: decrypt(keys.calendarId),
    };
  } catch (err) {
    console.error('Error fetching calendar key:', err);
    throw new Error('Failed to retrieve calendar credentials');
  }
}

export async function saveCalendarKey(data: CalendarKeyData): Promise<void> {
  try {
    const userId = await getCurrentUserId();

    const encryptedKeys = {
      apiKey: encrypt(data.apiKey),
      calendarId: encrypt(data.calendarId),
    };

    const metadata = {
      lastUpdated: new Date().toISOString(),
      service: 'Google Calendar API',
    };

    await prisma.serviceKey.upsert({
      where: {
        userId_service: { userId, service: 'calendar' },
      },
      update: {
        keys: encryptedKeys,
        metadata,
        updatedAt: new Date(),
      },
      create: {
        userId,
        service: 'calendar',
        keys: encryptedKeys,
        metadata,
      },
    });

    revalidatePath('/');
  } catch (err) {
    console.error('Error saving calendar key:', err);
    throw new Error('Failed to save calendar credentials');
  }
}

// ===== Generic helpers (still work the same, now AES-GCM) =====
export async function getServiceKey(service: string): Promise<any | null> {
  try {
    const userId = await getCurrentUserId();

    const serviceKey = await prisma.serviceKey.findUnique({
      where: {
        userId_service: { userId, service },
      },
    });
    if (!serviceKey) return null;

    const keys = serviceKey.keys as Record<string, unknown>;
    const decrypted: Record<string, unknown> = {};

    for (const [k, v] of Object.entries(keys)) {
      decrypted[k] = typeof v === 'string' ? decrypt(v as string) : v;
    }

    return { ...decrypted, metadata: serviceKey.metadata };
  } catch (err) {
    console.error('Error fetching service key:', err);
    throw new Error(`Failed to retrieve ${service} credentials`);
  }
}

export async function saveServiceKey(
  service: string,
  keys: Record<string, any>,
  metadata?: any
): Promise<void> {
  try {
    const userId = await getCurrentUserId();

    const encrypted: Record<string, any> = {};
    for (const [k, v] of Object.entries(keys)) {
      encrypted[k] = typeof v === 'string' ? encrypt(v) : v;
    }

    const serviceMetadata = {
      ...metadata,
      lastUpdated: new Date().toISOString(),
      service,
    };

    await prisma.serviceKey.upsert({
      where: {
        userId_service: { userId, service },
      },
      update: {
        keys: encrypted,
        metadata: serviceMetadata,
        updatedAt: new Date(),
      },
      create: {
        userId,
        service,
        keys: encrypted,
        metadata: serviceMetadata,
      },
    });

    revalidatePath('/');
  } catch (err) {
    console.error('Error saving service key:', err);
    throw new Error(`Failed to save ${service} credentials`);
  }
}

export async function deleteServiceKey(service: string): Promise<void> {
  try {
    const userId = await getCurrentUserId();
    await prisma.serviceKey.delete({
      where: { userId_service: { userId, service } },
    });
    revalidatePath('/');
  } catch (err) {
    console.error('Error deleting service key:', err);
    throw new Error(`Failed to delete ${service} credentials`);
  }
}

export async function getAllServiceKeys(): Promise<
  Array<{ service: string; hasKeys: boolean; metadata?: any; updatedAt: Date }>
> {
  try {
    const userId = await getCurrentUserId();

    const serviceKeys = await prisma.serviceKey.findMany({
      where: { userId },
      select: { service: true, metadata: true, updatedAt: true },
    });

    return serviceKeys.map((k) => ({
      service: k.service,
      hasKeys: true,
      metadata: k.metadata,
      updatedAt: k.updatedAt,
    }));
  } catch (err) {
    console.error('Error fetching service keys:', err);
    throw new Error('Failed to retrieve service keys');
  }
}
