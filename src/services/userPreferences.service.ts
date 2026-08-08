/**
 * User preferences service (added 2026-08-08)
 * ===========================================
 *
 * Owns the `users.preferences` JSONB column — the cross-device home for
 * every /settings toggle that doesn't already have its own column.
 *
 * Three rules this module exists to enforce:
 *
 *   1. STRICT ALLOWLIST. The column is JSONB, so without validation a
 *      client could PATCH a 10MB blob of arbitrary keys into every row.
 *      `sanitize()` rebuilds the object from scratch from known keys —
 *      anything unrecognised is dropped, never merged through.
 *
 *   2. DEEP MERGE, NOT REPLACE. The settings UI saves one section at a
 *      time (the appearance page doesn't know or care about sound
 *      settings). A shallow `{...old, ...new}` would wipe `sound` the
 *      moment the appearance page saved `ui`. We merge per-section.
 *
 *   3. LAST WRITE WINS, EXPLICITLY. Every write stamps `updatedAt`. The
 *      client compares it against its own localStorage copy on login and
 *      keeps whichever is newer, so opening a second browser doesn't
 *      silently clobber settings made on the first.
 *
 * Custom notification MP3s are NOT stored here — the blobs stay in the
 * browser's IndexedDB (they're up to 5MB each). Only the file NAME
 * round-trips, so a second device can show "this kind has a custom sound
 * on your other browser" instead of pretending it's the default.
 */

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/** Sound slots the client can play. Mirrors SoundKind in
 *  frontend/src/lib/soundStorage.ts — keep the two in sync. */
export const SOUND_KINDS = [
  'message',
  'notification',
  'admin-notification',
  'login',
  'post',
  'like',
] as const;
export type SoundKind = (typeof SOUND_KINDS)[number];

/** Bell notification categories the user can mute individually.
 *  Superset of NOTIFICATION_TYPES in notification.service.ts — it also
 *  includes ADMIN_ANNOUNCEMENT, which is delivered by broadcast. */
export const NOTIFY_TYPES = [
  'NEW_POST',
  'NEW_REACTION',
  'NEW_COMMENT',
  'NEW_REPLY',
  'NEW_MENTION',
  'NEW_MESSAGE',
  'FRIEND_REQUEST',
  'FRIEND_ACCEPT',
  'NEW_FOLLOW',
  'NOTE_SHARE',
  'HUB_SHARE',
  'ADMIN_ANNOUNCEMENT',
] as const;
export type NotifyType = (typeof NOTIFY_TYPES)[number];

export interface UserPreferences {
  sound: {
    masterEnabled: boolean;
    volume: number;
    enabled: Record<SoundKind, boolean>;
    /** Display-only. The blob itself lives in the browser's IndexedDB. */
    customFileName: Record<SoundKind, string>;
  };
  notify: {
    types: Record<NotifyType, boolean>;
    /** Whether the user opted into Web Notifications (the browser
     *  permission itself is per-device and is NOT stored here). */
    browserPush: boolean;
  };
  ui: {
    locale: 'vi' | 'en';
    reduceMotion: boolean;
  };
  /** ISO timestamp of the last successful write. Drives the
   *  newest-wins reconciliation on the client. */
  updatedAt: string | null;
}

const boolMap = <K extends string>(keys: readonly K[], value: boolean): Record<K, boolean> =>
  Object.fromEntries(keys.map((k) => [k, value])) as Record<K, boolean>;

const strMap = <K extends string>(keys: readonly K[]): Record<K, string> =>
  Object.fromEntries(keys.map((k) => [k, ''])) as Record<K, string>;

export function defaultPreferences(): UserPreferences {
  return {
    sound: {
      masterEnabled: true,
      volume: 0.5,
      enabled: boolMap(SOUND_KINDS, true),
      customFileName: strMap(SOUND_KINDS),
    },
    notify: {
      types: boolMap(NOTIFY_TYPES, true),
      browserPush: false,
    },
    ui: {
      locale: 'vi',
      reduceMotion: false,
    },
    updatedAt: null,
  };
}

/* ─── Validation helpers ─────────────────────────────────────────── */

function asBool(v: unknown, fallback: boolean): boolean {
  return typeof v === 'boolean' ? v : fallback;
}

function asVolume(v: unknown, fallback: number): number {
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  // Round to 2dp — the slider has 100 steps, storing 0.5300000000000001
  // just makes the JSON noisy and the newest-wins diff jittery.
  return Math.round(Math.min(1, Math.max(0, n)) * 100) / 100;
}

/** File names are display-only, but they're still user input landing in a
 *  shared column — cap the length and strip control characters. */
function asFileName(v: unknown): string {
  if (typeof v !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  return v.replace(/[\x00-\x1f\x7f]/g, '').trim().slice(0, 120);
}

function mergeBoolMap<K extends string>(
  keys: readonly K[],
  current: Record<K, boolean>,
  incoming: unknown,
): Record<K, boolean> {
  if (!incoming || typeof incoming !== 'object') return current;
  const src = incoming as Record<string, unknown>;
  const out = { ...current };
  for (const k of keys) {
    if (k in src) out[k] = asBool(src[k], current[k]);
  }
  return out;
}

/**
 * Rebuild a valid preferences object from (possibly hostile) input,
 * layered on top of `base`. Unknown keys are dropped entirely — this is
 * an allowlist, not a filter.
 */
export function sanitize(input: unknown, base: UserPreferences): UserPreferences {
  const out: UserPreferences = {
    sound: { ...base.sound, enabled: { ...base.sound.enabled }, customFileName: { ...base.sound.customFileName } },
    notify: { ...base.notify, types: { ...base.notify.types } },
    ui: { ...base.ui },
    updatedAt: base.updatedAt,
  };
  if (!input || typeof input !== 'object') return out;
  const src = input as Record<string, unknown>;

  if (src.sound && typeof src.sound === 'object') {
    const s = src.sound as Record<string, unknown>;
    if ('masterEnabled' in s) out.sound.masterEnabled = asBool(s.masterEnabled, out.sound.masterEnabled);
    if ('volume' in s) out.sound.volume = asVolume(s.volume, out.sound.volume);
    out.sound.enabled = mergeBoolMap(SOUND_KINDS, out.sound.enabled, s.enabled);
    if (s.customFileName && typeof s.customFileName === 'object') {
      const cf = s.customFileName as Record<string, unknown>;
      for (const k of SOUND_KINDS) {
        if (k in cf) out.sound.customFileName[k] = asFileName(cf[k]);
      }
    }
  }

  if (src.notify && typeof src.notify === 'object') {
    const n = src.notify as Record<string, unknown>;
    out.notify.types = mergeBoolMap(NOTIFY_TYPES, out.notify.types, n.types);
    if ('browserPush' in n) out.notify.browserPush = asBool(n.browserPush, out.notify.browserPush);
  }

  if (src.ui && typeof src.ui === 'object') {
    const u = src.ui as Record<string, unknown>;
    if (u.locale === 'vi' || u.locale === 'en') out.ui.locale = u.locale;
    if ('reduceMotion' in u) out.ui.reduceMotion = asBool(u.reduceMotion, out.ui.reduceMotion);
  }

  // Carry the stored stamp through. Without this, reading a row back
  // through sanitize(stored, defaults) returned defaults.updatedAt = null,
  // so the server copy always looked "never written" — the client's
  // newest-wins check could then never pick the server side, and
  // cross-device sync silently degraded to push-only. Only accept a
  // parseable date; a client is free to send garbage here.
  if (typeof src.updatedAt === 'string') {
    const t = Date.parse(src.updatedAt);
    if (Number.isFinite(t)) out.updatedAt = new Date(t).toISOString();
  }

  return out;
}

/* ─── Read / write ───────────────────────────────────────────────── */

export async function getPreferences(
  userId: number,
): Promise<{ theme: 'dark' | 'light'; preferences: UserPreferences }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { theme: true, preferences: true },
  });
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

  // A row written before this feature shipped has `preferences: null`;
  // sanitize() over defaults gives the client a complete object either
  // way, so it never has to null-check individual toggles.
  return {
    theme: user.theme === 'light' ? 'light' : 'dark',
    preferences: sanitize(user.preferences, defaultPreferences()),
  };
}

export async function updatePreferences(
  userId: number,
  patch: { theme?: unknown; preferences?: unknown },
): Promise<{ theme: 'dark' | 'light'; preferences: UserPreferences }> {
  const current = await getPreferences(userId);

  let theme = current.theme;
  if (patch.theme !== undefined) {
    if (patch.theme !== 'dark' && patch.theme !== 'light') {
      throw new AppError('Invalid theme value. Must be "dark" or "light"', 400, 'INVALID_THEME');
    }
    theme = patch.theme;
  }

  let next = current.preferences;
  if (patch.preferences !== undefined) {
    if (!patch.preferences || typeof patch.preferences !== 'object' || Array.isArray(patch.preferences)) {
      throw new AppError('preferences must be an object', 400, 'INVALID_PREFERENCES');
    }
    next = sanitize(patch.preferences, current.preferences);
  }

  if (patch.theme === undefined && patch.preferences === undefined) {
    throw new AppError('No preferences provided', 400, 'NO_PREFERENCES');
  }

  next.updatedAt = new Date().toISOString();

  await prisma.user.update({
    where: { id: userId },
    data: { theme, preferences: next as unknown as object },
  });

  return { theme, preferences: next };
}
