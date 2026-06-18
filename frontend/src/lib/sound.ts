/**
 * Notification sound service.
 *
 * Two backends:
 *   1. DEFAULT  — synthesized in-browser via Web Audio API. No
 *                 network fetch, no asset, no permission popup. Each
 *                 SoundKind has a different tone pattern so they're
 *                 easy to tell apart by ear.
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

interface ToneSpec {
  /** oscillator frequency in Hz */
  freq: number;
  /** duration in seconds */
  dur: number;
  /** delay from previous tone (0 for first) */
  gap?: number;
  /** peak gain (0-1) */
  gain?: number;
  /** oscillator waveform */
  wave?: OscillatorType;
}

interface SoundPreset {
  /** list of tones, played in order. See ToneSpec. */
  tones: ToneSpec[];
}

const PRESETS: Record<SoundKind, SoundPreset> = {
  // 2-note "ding-dong" — messages
  message: {
    tones: [
      { freq: 880, dur: 0.12, gain: 0.25, wave: 'sine' },
      { freq: 660, dur: 0.18, gap: 0.04, gain: 0.22, wave: 'sine' },
    ],
  },
  // 3-note rising chime — notifications
  notification: {
    tones: [
      { freq: 660, dur: 0.10, gain: 0.22, wave: 'triangle' },
      { freq: 880, dur: 0.10, gap: 0.04, gain: 0.22, wave: 'triangle' },
      { freq: 1320, dur: 0.18, gap: 0.04, gain: 0.24, wave: 'triangle' },
    ],
  },
  // 4-note cheerful arpeggio — login
  login: {
    tones: [
      { freq: 523, dur: 0.10, gain: 0.22, wave: 'sine' }, // C5
      { freq: 659, dur: 0.10, gap: 0.03, gain: 0.22, wave: 'sine' }, // E5
      { freq: 784, dur: 0.10, gap: 0.03, gain: 0.22, wave: 'sine' }, // G5
      { freq: 1046, dur: 0.20, gap: 0.03, gain: 0.24, wave: 'sine' }, // C6
    ],
  },
  // 1-note subtle "pop" — post created
  post: {
    tones: [
      { freq: 1046, dur: 0.10, gain: 0.20, wave: 'sine' },
    ],
  },
};

// ── AudioContext singleton ────────────────────────────────────────────────
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

// ── Default (synthesized) playback ───────────────────────────────────────
function playDefault(kind: SoundKind, volume: number): void {
  const c = getCtx();
  if (!c) return;
  const preset = PRESETS[kind];
  if (!preset) return;

  const master = Math.max(0, Math.min(1, volume));
  let t = c.currentTime + 0.01;
  for (const tone of preset.tones) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = tone.wave ?? 'sine';
    osc.frequency.setValueAtTime(tone.freq, t);
    const peak = (tone.gain ?? 0.2) * master;
    // Quick attack / exponential release to avoid clicks
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + tone.dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + tone.dur + 0.02);
    t += tone.dur + (tone.gap ?? 0.05);
  }
}

// ── Custom (user-uploaded) playback ──────────────────────────────────────
// We cache HTMLAudioElement per SoundKind so the browser can keep
// them in memory and start playback without a fresh decode each
// time. Re-decoding 50KB MP3s on every message would be wasteful.
const customAudioCache: Partial<Record<SoundKind, HTMLAudioElement>> = {};

async function playCustom(kind: SoundKind, volume: number): Promise<boolean> {
  const rec = await getSound(kind);
  if (!rec) return false;

  let audio = customAudioCache[kind];
  if (!audio) {
    try {
      const url = URL.createObjectURL(rec.blob);
      audio = new Audio(url);
      audio.preload = 'auto';
      customAudioCache[kind] = audio;
    } catch {
      return false;
    }
  }

  audio.volume = Math.max(0, Math.min(1, volume));
  // currentTime=0 so a rapid-fire sequence of the same sound starts
  // from the beginning each time instead of resuming mid-play.
  try { audio.currentTime = 0; } catch { /* ignore */ }
  try {
    await audio.play();
    return true;
  } catch {
    // Autoplay blocked or decode error — fall back to default.
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

  // Try the user's custom file first; fall back to the synthesized
  // default if anything goes wrong (file deleted, decode error,
  // autoplay blocked on <audio>, etc.).
  const customOk = await playCustom(kind, volume);
  if (customOk) return true;

  try {
    playDefault(kind, volume);
    return true;
  } catch {
    return false;
  }
}

/** Test-play a specific kind, ignoring enabled flags. Used by the
 *  "Test" button in /settings/notifications. */
export async function testSound(kind: SoundKind, volume = 0.6): Promise<boolean> {
  await ensureContext();
  const customOk = await playCustom(kind, volume);
  if (customOk) return true;
  try { playDefault(kind, volume); return true; } catch { return false; }
}

/** Wipe cached <audio> elements so the next playSound() re-reads the
 *  blob from IndexedDB. Call this after a user replaces or deletes
 *  their custom sound. */
export function invalidateCustomSoundCache(kind?: SoundKind): void {
  if (kind) {
    const a = customAudioCache[kind];
    if (a) {
      try { a.pause(); } catch { /* ignore */ }
      try { URL.revokeObjectURL(a.src); } catch { /* ignore */ }
      delete customAudioCache[kind];
    }
  } else {
    for (const k of Object.keys(customAudioCache) as SoundKind[]) {
      const a = customAudioCache[k];
      if (a) {
        try { a.pause(); } catch { /* ignore */ }
        try { URL.revokeObjectURL(a.src); } catch { /* ignore */ }
      }
    }
    for (const k of Object.keys(customAudioCache)) delete customAudioCache[k as SoundKind];
  }
}

/** True after at least one play() successfully created the
 *  AudioContext. Used by SoundInitializer to know whether to attach
 *  the unlock listener (we don't want to keep listening forever if
 *  the user has never interacted with the page). */
export function isContextReady(): boolean {
  return ctxReady;
}
