'use client';

import { usePreferencesStore } from '@/store/preferencesStore';

/**
 * A single, clean UI "pop" — one short note with a soft pitch drop, like the
 * subtle sound Facebook plays on refresh / interactions. Synthesized via the
 * Web Audio API (no asset), fire-and-forget, and it respects the user's master
 * sound toggle. Deliberately ONE note (the old refresh used a two-note blip
 * that read as a "tạch tạch" ratchet).
 */
export function playPop(volume = 0.32): void {
  try {
    if (typeof window === 'undefined') return;
    if (!usePreferencesStore.getState().masterEnabled) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    // Quick downward "pop" — bright attack, soft tail.
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.11);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.02, volume), now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
    window.setTimeout(() => { ctx.close().catch(() => {}); }, 320);
  } catch {
    /* audio unavailable — ignore */
  }
}
