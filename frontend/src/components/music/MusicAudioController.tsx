'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useMusicStore } from '@/store/musicStore';
import { setAudioAnalyser } from '@/hooks/useAudioAnalyser';

/**
 * MusicAudioController — the single audio engine for the entire app.
 *
 * Lives at the root layout level (via dynamic ssr:false import).
 * Keeps ONE <audio> element alive for the full lifetime of the app.
 * This is what makes playback survive across page navigations.
 *
 * Also creates an AudioContext + AnalyserNode and shares it globally
 * so CyberAudioVisualizer can read real-time frequency data for reactive bars.
 */
export default function MusicAudioController() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    isMuted,
    repeatMode,
    setCurrentTime,
    setDuration,
    setAudioElement,
    setIsPlaying,
    next,
  } = useMusicStore();

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

  // Lazily creates AudioContext + AnalyserNode once audio starts playing.
  // Must be called from both the audio-setup effect and the track-loading effect
  // because the track-loading effect is what handles play() calls.
  const ensureAnalyser = useCallback(() => {
    if (audioContextRef.current || !audioRef.current) return;
    try {
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;
      const source = ctx.createMediaElementSource(audioRef.current);
      mediaSourceRef.current = source;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      setAudioAnalyser(analyser);
    } catch {
      // Silently skip if AudioContext creation fails (e.g. restricted environments).
    }
  }, []);

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
      console.warn('[MusicAudioController] Audio error:', audio.src, audio.error?.message);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    audioRef.current = audio;

    // Autoplay policy: resume AudioContext on first user interaction.
    const handleInteraction = () => {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
      setAudioElement(null);
      setIsPlaying(false);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [setCurrentTime, setDuration, setAudioElement, setIsPlaying, next]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load new track — strict URL validation prevents base-URL resolution.
  // Also calls ensureAnalyser before every play() to wire up the Web Audio graph.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const rawUrl = currentTrack?.audioUrl;
    const trackId = currentTrack?.id ?? null;

    if (!isValidAudioUrl(rawUrl)) {
      audio.pause();
      return;
    }

    const trackChanged = prevTrackIdRef.current !== trackId;
    if (trackChanged) {
      prevTrackIdRef.current = trackId;
    }

    if (audio.src === rawUrl && !trackChanged) {
      if (isPlaying) {
        ensureAnalyser();
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
      return;
    }

    audio.src = rawUrl;
    audio.load();

    if (isPlaying) {
      ensureAnalyser();
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [currentTrack?.id, currentTrack?.audioUrl, isPlaying, ensureAnalyser]);

  // Progress-based auto-next fallback: polls every 500ms and advances when audio ends.
  // This catches cases where the browser 'ended' event doesn't fire reliably
  // (e.g. certain streamed audio responses).
  // CRITICAL: this effect has ZERO dependencies to ensure only ONE interval ever runs.
  // Using useMusicStore.getState() inside the interval prevents stale closure issues.
  useEffect(() => {
    const intervalId = setInterval(() => {
      const { duration, currentTime, repeatMode } = useMusicStore.getState();
      if (!duration || !Number.isFinite(duration) || duration === 0) return;
      if (currentTime > 0 && duration > 0 && currentTime >= duration - 0.3) {
        if (repeatMode !== 'one') {
          useMusicStore.getState().next();
        }
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, []); // <-- ZERO deps: single interval for entire app lifetime

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
