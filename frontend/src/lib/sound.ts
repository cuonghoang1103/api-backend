/**
 * Notification sound service.
 *
 * Two-tier playback:
 *   1. DEFAULT  — bundled MP3 file served from /sounds/default-*.mp3
 *                 (placed in `frontend/public/sounds/`). These were
 *                 chosen by the site owner; they're cached by the
 *                 browser after the first visit and play without any
 *                 localStorage / IndexedDB dependency.
 *   2. CUSTOM   — user-uploaded audio file (mp3/wav/ogg/m4a) loaded
 *                 from IndexedDB. The user picks these in
 *                 /settings/notifications. Falls back to DEFAULT
 *                 silently if the blob can't be decoded.
 *
 * AudioContext lifetime:
 *   Most browsers refuse to start an AudioContext before a user
 *   gesture (autoplay policy). `ensureContext()` is called on every
 *   play() — if the context is suspended it gets resumed, which is a
 *   no-op on browsers that already accepted the gesture and a
 *   graceful failure on browsers that haven't (we just won't hear
 *   anything until the user clicks something). The SoundInitializer
 *   component makes the first click anywhere count as the unlock
 *   gesture.
 *
 * Volume:
 *   Master volume is read fresh from the preferences store on every
 *   play() call, so the user can adjust the slider in /settings and
 *   hear the change immediately without restarting the app.
 */

import { getSound, type SoundKind } from './soundStorage';

// Static URL for each default sound. These live in
// frontend/public/sounds/ and are served as static assets by Next.js
// (the `/sounds/...` path maps to `public/sounds/...`). The browser
// caches the response after the first hit, so subsequent plays are
// instant.
const DEFAULT_URLS: Record<SoundKind, string> = {
  message: '/sounds/default-message.mp3',
  notification: '/sounds/default-notification.mp3',
  login: '/sounds/default-notification.mp3', // unused — kept for type completeness
  post: '/sounds/default-post.mp3',
  like: '/sounds/default-like.mp3',
  'admin-notification': '/sounds/default-admin-notification.mp3',
};

// ── AudioContext singleton (used for both default and custom) ────────────
let ctx: AudioContext | null = null;
let ctxReady = false;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;
  const AC: typeof AudioContext | undefined =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
  } catch {
    ctx = null;
  }
  return ctx;
}

async function ensureContext(): Promise<AudioContext | null> {
  const c = getCtx();
  if (!c) return null;
  if (c.state === 'suspended') {
    try { await c.resume(); } catch { /* ignore */ }
  }
  ctxReady = true;
  return c;
}

// ── Audio element cache (per kind) ───────────────────────────────────────
// We keep one HTMLAudioElement per (kind, source) so the browser can
// stream-decode once and replay cheaply. Caching per kind means the
// same kind played in quick succession (e.g. 5 notifications in a
// row) won't each trigger a fresh network fetch or file decode.
type Source = 'default' | `custom:${SoundKind}`;

interface CachedAudio {
  element: HTMLAudioElement;
  source: Source;
}

const cache: Partial<Record<SoundKind, CachedAudio>> = {};

function buildAudioElement(src: string): HTMLAudioElement {
  const audio = new Audio(src);
  audio.preload = 'auto';
  return audio;
}

function getOrBuildAudio(kind: SoundKind, src: string, source: Source): HTMLAudioElement {
  const cached = cache[kind];
  if (cached && cached.source === source) return cached.element;
  if (cached) {
    try { cached.element.pause(); } catch { /* ignore */ }
  }
  const el = buildAudioElement(src);
  cache[kind] = { element: el, source };
  return el;
}

// ── Custom (user-uploaded) playback ──────────────────────────────────────
async function playCustom(kind: SoundKind, volume: number): Promise<boolean> {
  const rec = await getSound(kind);
  if (!rec) return false;
  const url = URL.createObjectURL(rec.blob);
  const audio = getOrBuildAudio(kind, url, `custom:${kind}`);
  audio.volume = Math.max(0, Math.min(1, volume));
  // currentTime=0 so a rapid-fire sequence of the same sound starts
  // from the beginning each time instead of resuming mid-play.
  try { audio.currentTime = 0; } catch { /* ignore */ }
  try {
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

// ── Default (bundled MP3) playback ───────────────────────────────────────
function playDefault(kind: SoundKind, volume: number): boolean {
  if (typeof window === 'undefined') return false;
  const url = DEFAULT_URLS[kind];
  if (!url) return false;
  const audio = getOrBuildAudio(kind, url, 'default');
  audio.volume = Math.max(0, Math.min(1, volume));
  try { audio.currentTime = 0; } catch { /* ignore */ }
  try {
    // play() returns a promise; we don't await it because we want
    // playSound() to be fire-and-forget from the caller's view.
    void audio.play();
    return true;
  } catch {
    return false;
  }
}

// ── Public API ───────────────────────────────────────────────────────────
export interface PlayOptions {
  /** Override master volume (0-1). If omitted, reads from
   *  preferences store via getMasterVolume(). */
  volume?: number;
}

let volumeGetter: () => number = () => 0.5;
let enabledGetter: (kind: SoundKind) => boolean = () => true;
let masterEnabledGetter: () => boolean = () => true;

/** Called by the preferences store to wire live getters. We use
 *  getters (not a stored copy) so changes to the slider take effect
 *  on the very next play() without needing a re-init. */
export function configureSoundSources(opts: {
  getMasterVolume: () => number;
  getMasterEnabled: () => boolean;
  getKindEnabled: (kind: SoundKind) => boolean;
}): void {
  volumeGetter = opts.getMasterVolume;
  masterEnabledGetter = opts.getMasterEnabled;
  enabledGetter = opts.getKindEnabled;
}

/** Play a sound. Resolves to true if a sound was actually played,
 *  false if it was suppressed (disabled, no audio backend, or
 *  custom file failed to decode and default also failed). */
export async function playSound(kind: SoundKind, opts: PlayOptions = {}): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!masterEnabledGetter()) return false;
  if (!enabledGetter(kind)) return false;

  await ensureContext();
  const volume = opts.volume ?? volumeGetter();

  // Try the user's custom file first; fall back to the bundled
  // default if anything goes wrong (file deleted, decode error,
  // autoplay blocked on <audio>, etc.).
  const customOk = await playCustom(kind, volume);
  if (customOk) return true;
  return playDefault(kind, volume);
}

/** Test-play a specific kind, ignoring enabled flags. Used by the
 *  "Test" button in /settings/notifications. */
export async function testSound(kind: SoundKind, volume = 0.7): Promise<boolean> {
  await ensureContext();
  const customOk = await playCustom(kind, volume);
  if (customOk) return true;
  return playDefault(kind, volume);
}

/** Wipe cached <audio> elements so the next playSound() re-reads the
 *  blob from IndexedDB. Call this after a user replaces or deletes
 *  their custom sound. */
export function invalidateCustomSoundCache(kind?: SoundKind): void {
  if (kind) {
    const c = cache[kind];
    if (c && c.source === `custom:${kind}`) {
      try { c.element.pause(); } catch { /* ignore */ }
      try { URL.revokeObjectURL(c.element.src); } catch { /* ignore */ }
      delete cache[kind];
    }
  } else {
    for (const k of Object.keys(cache) as SoundKind[]) {
      const c = cache[k];
      if (c && c.source.startsWith('custom:')) {
        try { c.element.pause(); } catch { /* ignore */ }
        try { URL.revokeObjectURL(c.element.src); } catch { /* ignore */ }
      }
    }
    for (const k of Object.keys(cache)) {
      if (cache[k as SoundKind]?.source.startsWith('custom:')) {
        delete cache[k as SoundKind];
      }
    }
  }
}

/** True after at least one play() successfully created the
 *  AudioContext. Used by SoundInitializer to know whether to attach
 *  the unlock listener (we don't want to keep listening forever if
 *  the user has never interacted with the page). */
export function isContextReady(): boolean {
  return ctxReady;
}

/** Pause every cached <audio> element immediately. Used by the
 *  master mute toggle — when the user flips the switch off we
 *  stop whatever is currently playing, not just suppress the next
 *  play(). The cache is preserved so flipping the switch back on
 *  resumes the same audio instances. */
export function stopAll(): void {
  for (const k of Object.keys(cache) as SoundKind[]) {
    const c = cache[k];
    if (!c) continue;
    try { c.element.pause(); } catch { /* ignore */ }
    try { c.element.currentTime = 0; } catch { /* ignore */ }
  }
}

/** Update the live volume of every cached <audio> element. We
 *  apply the value to BOTH default and custom sources so the
 *  slider in /settings/notifications takes effect on a sound
 *  that's already mid-play (the previous behaviour only changed
 *  the volume for the NEXT playSound call). */
export function applyVolume(volume: number): void {
  const v = Math.max(0, Math.min(1, volume));
  for (const k of Object.keys(cache) as SoundKind[]) {
    const c = cache[k];
    if (!c) continue;
    try { c.element.volume = v; } catch { /* ignore */ }
  }
}
