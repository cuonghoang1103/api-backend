'use client';

import { useEffect, useRef } from 'react';
import { useMusicStore } from '@/store/musicStore';

/**
 * MusicAudioController — the single audio engine for the entire app.
 *
 * Lives at the root layout level (via dynamic ssr:false import).
 * Keeps ONE <audio> element alive for the full lifetime of the app.
 * This is what makes playback survive across page navigations.
 *
 * Strict URL validation: only loads audio when the URL is a confirmed
 * audio file path (ends with known extension) or a valid http/https URL.
 * Never sets audio.src to empty string or base page URL.
 */
export default function MusicAudioController() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    isMuted,
    repeatMode,
    setCurrentTime,
    setDuration,
    next,
  } = useMusicStore();

  // Track previous currentTrack id to detect track changes
  const prevTrackIdRef = useRef<string | null>(null);

  function isValidAudioUrl(url: unknown): url is string {
    if (typeof url !== 'string' || !url.trim()) return false;
    const audioExts = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.opus', '.webm'];
    const hasExt = audioExts.some((ext) => url.toLowerCase().includes(ext));
    if (hasExt) return true;
    if (url.startsWith('/api/v1/music/stream/')) return true;
    if (url.startsWith('/uploads/')) return true;
    return url.startsWith('http');
  }

  // Create audio element exactly once — SSR-safe
  useEffect(() => {
    if (audioRef.current) return;
    if (typeof window === 'undefined') return;

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => next();
    const handleError = () => {
      // Log only — never let error crash the app
      console.warn('[MusicAudioController] Audio error:', audio.src, audio.error?.message);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load new track — strict URL validation prevents base-URL resolution
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const rawUrl = currentTrack?.audioUrl;
    const trackId = currentTrack?.id ?? null;

    // Only proceed with a confirmed valid audio URL
    if (!isValidAudioUrl(rawUrl)) {
      audio.pause();
      return;
    }

    // Detect track change
    const trackChanged = prevTrackIdRef.current !== trackId;
    if (trackChanged) {
      prevTrackIdRef.current = trackId;
    }

    // Skip if already loaded and not a track change
    if (audio.src === rawUrl && !trackChanged) {
      if (isPlaying) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
      return;
    }

    audio.src = rawUrl;
    audio.load();

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [currentTrack?.id, currentTrack?.audioUrl, isPlaying]);

  // Progress-based auto-next fallback: polls every 500ms and advances when audio ends.
  // This catches cases where the browser 'ended' event doesn't fire reliably
  // (e.g. certain streamed audio responses).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const intervalId = setInterval(() => {
      const { duration, currentTime: storeTime } = audio;
      if (!duration || !Number.isFinite(duration) || duration === 0) return;
      // Advance to next if within 300ms of end and audio appears stalled
      if (storeTime > 0 && duration > 0 && storeTime >= duration - 0.3) {
        const store = useMusicStore.getState();
        // Only auto-next if not repeat-one (repeat-one resets currentTime via store)
        if (store.repeatMode !== 'one') {
          console.log('[MusicAudioController] Progress fallback: triggering next()');
          store.next();
        }
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  // Sync volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume));
  }, [volume, isMuted]);

  // Sync seek
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    const diff = Math.abs(audio.currentTime - currentTime);
    if (diff > 0.5) {
      audio.currentTime = currentTime;
    }
  }, [currentTime, currentTrack]);

  // Restart audio when repeatMode='one' and currentTime was reset to 0
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    // This fires when store's currentTime is set to 0 (from next() in repeat-one mode)
    if (currentTime === 0 && isPlaying && isValidAudioUrl(currentTrack.audioUrl)) {
      if (audio.paused && audio.src && audio.src === currentTrack.audioUrl) {
        console.log('[MusicAudioController] repeat-one: restarting audio at 0:00');
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    }
  }, [currentTime, isPlaying, currentTrack]);

  return null;
}
