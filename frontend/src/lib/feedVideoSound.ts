'use client';

// Global sound preference for autoplaying feed videos (Facebook-style).
//
// Browsers block UNMUTED autoplay until the user has interacted with the
// page, so the very first "sound on" requires a tap. Once the user enables
// sound on ANY feed video we remember it (localStorage) and every video that
// scrolls into view thereafter plays WITH sound — no need to tap the speaker
// again. Leaving the viewport pauses (and thus mutes) the clip.
//
// All feed <video> elements share this single preference via a custom event
// so toggling one updates them all.

const KEY = 'feedSoundOn';
const EVT = 'feed-sound-changed';

let soundOn = false;
if (typeof window !== 'undefined') {
  try { soundOn = localStorage.getItem(KEY) === '1'; } catch { /* private mode */ }
}

export function getFeedSound(): boolean {
  return soundOn;
}

export function setFeedSound(next: boolean): void {
  soundOn = next;
  if (typeof window !== 'undefined') {
    try { localStorage.setItem(KEY, next ? '1' : '0'); } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent(EVT, { detail: next }));
  }
}

export function subscribeFeedSound(cb: (on: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => cb((e as CustomEvent).detail as boolean);
  window.addEventListener(EVT, handler);
  return () => window.removeEventListener(EVT, handler);
}
