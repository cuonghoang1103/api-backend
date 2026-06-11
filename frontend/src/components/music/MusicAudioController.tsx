'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useMusicStore } from '@/store/musicStore';
import { setAudioAnalyser } from '@/hooks/useAudioAnalyser';
import { loadYouTubeAPI, isYouTubeUrl } from '@/lib/youtube-player';

// Declare the YouTube IFrame API global
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        opts: Record<string, unknown>,
      ) => YouTubePlayerInstance;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number; BUFFERING: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerInstance {
  loadVideoById: (videoId: string, startSeconds?: number) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy: () => void;
  addEventListener: (event: string, listener: (e: unknown) => void) => void;
  getVolume: () => number;
}

let ytPlayerInstance: YouTubePlayerInstance | null = null;
let ytContainerMounted = false;

// Export for use by other components
export function getYouTubePlayer(): YouTubePlayerInstance | null {
  return ytPlayerInstance;
}

function mountYouTubeContainer() {
  if (typeof window === 'undefined' || ytContainerMounted) return;
  if (!document.getElementById('youtube-player-container')) {
    const container = document.createElement('div');
    container.id = 'youtube-player-container';
    container.style.cssText = 'position:fixed;width:1px;height:1px;bottom:0;left:0;pointer-events:none;opacity:0.01;z-index:-1;';
    container.innerHTML = '<div id="youtube-player"></div>';
    document.body.appendChild(container);
  }
  ytContainerMounted = true;
}

function unmountYouTubeContainer() {
  if (typeof window === 'undefined') return;
  const container = document.getElementById('youtube-player-container');
  if (container) container.remove();
  ytContainerMounted = false;
  ytPlayerInstance = null;
}

let ytVolume = 70;
let ytMuted = false;

function createYouTubePlayer(
  videoId: string,
  startSeconds: number,
  onReady: () => void,
  onStateChange: (state: number) => void,
  onEnded: () => void,
  onError: (err: unknown) => void,
): YouTubePlayerInstance {
  const existing = document.getElementById('youtube-player');
  if (existing) existing.innerHTML = '';

  const player = new window.YT.Player('youtube-player', {
    height: '1',
    width: '1',
    videoId,
    playerVars: {
      autoplay: 0,
      start: startSeconds,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      origin: window.location.origin,
      playsinline: 1,
    },
    events: {
      onReady: (e: unknown) => {
        const evt = e as { target: YouTubePlayerInstance };
        ytVolume = evt.target.getVolume();
        onReady();
      },
      onStateChange: (e: unknown) => {
        const evt = e as { data: number };
        onStateChange(evt.data);
      },
      onError: (e: unknown) => {
        onError(e);
      },
    },
  });

  return player;
}

/**
 * MusicAudioController — the single audio engine for the entire app.
 *
 * Lives at the root layout level (via dynamic ssr:false import).
 * Keeps ONE audio element alive for local files.
 * Manages ONE YouTube IFrame player for YouTube tracks.
 *
 * AudioContext + AnalyserNode are shared globally for CyberAudioVisualizer.
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
    next,
  } = useMusicStore();

  const prevTrackIdRef = useRef<string | null>(null);
  const ytPollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Lazily creates AudioContext + AnalyserNode for local audio
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
      // Silently skip if AudioContext creation fails
    }
  }, []);

  // Stop YouTube polling
  const stopYouTubePolling = useCallback(() => {
    if (ytPollingRef.current) {
      clearInterval(ytPollingRef.current);
      ytPollingRef.current = null;
    }
  }, []);

  // Start YouTube time polling (syncs store state)
  const startYouTubePolling = useCallback((player: YouTubePlayerInstance) => {
    stopYouTubePolling();
    ytPollingRef.current = setInterval(() => {
      try {
        const state = player.getPlayerState?.() ?? -1;
        if (state === window.YT?.PlayerState?.PLAYING || state === window.YT?.PlayerState?.BUFFERING) {
          const t = player.getCurrentTime?.() ?? 0;
          setCurrentTime(t);
        }
      } catch {
        // Player may be destroyed
      }
    }, 250);
  }, [stopYouTubePolling, setCurrentTime]);

  // Mount YouTube container once
  useEffect(() => {
    mountYouTubeContainer();
    return () => {
      stopYouTubePolling();
      if (ytPlayerInstance) {
        try { ytPlayerInstance.destroy(); } catch { /* ignore */ }
        ytPlayerInstance = null;
      }
      unmountYouTubeContainer();
    };
  }, [stopYouTubePolling]);

  // Load YouTube API once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    loadYouTubeAPI();
    window.onYouTubeIframeAPIReady = () => {
      /* API ready */
    };
  }, []);

  // ── YouTube playback handler ──────────────────────────────────────
  const handleYouTubeTrack = useCallback(
    (videoId: string, shouldPlay: boolean) => {
      if (!window.YT?.Player) {
        loadYouTubeAPI().then(() => {
          setTimeout(() => handleYouTubeTrack(videoId, shouldPlay), 500);
        });
        return;
      }

      const isNewVideo = !ytPlayerInstance || true; // always recreate to load new video

      if (isNewVideo) {
        if (ytPlayerInstance) {
          try { ytPlayerInstance.destroy(); } catch { /* ignore */ }
          ytPlayerInstance = null;
        }

        stopYouTubePolling();

        const yt = createYouTubePlayer(
          videoId,
          0,
          () => {
            // onReady
            if (ytMuted) {
              ytPlayerInstance?.mute();
            } else {
              ytPlayerInstance?.setVolume(ytVolume);
            }
            if (shouldPlay) {
              ytPlayerInstance?.playVideo();
            }
            const d = ytPlayerInstance?.getDuration?.() ?? 0;
            if (d > 0) setDuration(d);
            startYouTubePolling(ytPlayerInstance!);
          },
          (state) => {
            // onStateChange
            const { PLAYING, PAUSED, ENDED } = window.YT?.PlayerState ?? {};
            if (state === ENDED) {
              stopYouTubePolling();
              if (repeatMode !== 'one') next();
            }
          },
          () => {
            // onEnded
            stopYouTubePolling();
            next();
          },
          (err) => {
            // onError
            console.warn('[YouTube] Player error:', err);
          },
        );
        ytPlayerInstance = yt;
      } else if (ytPlayerInstance) {
        if (shouldPlay) {
          ytPlayerInstance.playVideo();
        } else {
          ytPlayerInstance.pauseVideo();
        }
      }
    },
    [next, repeatMode, setDuration, startYouTubePolling, stopYouTubePolling],
  );

  // Seek local audio
  const seekLocalAudio = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (Math.abs(audio.currentTime - time) > 0.5) {
      audio.currentTime = time;
    }
  }, []);

  // Sync YouTube volume
  useEffect(() => {
    if (!ytPlayerInstance) return;
    if (isMuted) {
      ytPlayerInstance.mute();
      ytMuted = true;
    } else {
      ytPlayerInstance.unMute();
      ytPlayerInstance.setVolume(volume);
      ytVolume = volume;
      ytMuted = false;
    }
  }, [volume, isMuted]);

  // Seek YouTube
  useEffect(() => {
    if (!ytPlayerInstance || !currentTrack) return;
    const { isYT } = isYouTubeUrl(currentTrack.audioUrl);
    if (!isYT) return;
    const diff = Math.abs((ytPlayerInstance.getCurrentTime?.() ?? 0) - currentTime);
    if (diff > 1) {
      ytPlayerInstance.seekTo(currentTime, true);
    }
  }, [currentTime, currentTrack]);

  // Create audio element once — SSR-safe
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
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [setCurrentTime, setDuration, next]);

  // Load new track
  useEffect(() => {
    const audio = audioRef.current;
    const rawUrl = currentTrack?.audioUrl;
    const trackId = currentTrack?.id ?? null;
    const { isYT, videoId } = isYouTubeUrl(rawUrl);

    if (!rawUrl) return;

    if (isYT) {
      // YouTube track: stop local audio, load YouTube
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      handleYouTubeTrack(videoId, isPlaying);
      return;
    }

    // Local track: stop YouTube
    if (ytPlayerInstance) {
      try { ytPlayerInstance.pauseVideo(); } catch { /* ignore */ }
    }

    if (!audio) return;

    // Volume sync
    audio.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume));

    const trackChanged = prevTrackIdRef.current !== trackId;
    if (trackChanged) prevTrackIdRef.current = trackId;

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
  }, [currentTrack?.id, currentTrack?.audioUrl, isPlaying, volume, isMuted, ensureAnalyser, handleYouTubeTrack]);

  // Progress-based auto-next for local audio
  useEffect(() => {
    const intervalId = setInterval(() => {
      const { duration: dur, currentTime: ct, repeatMode: rm, currentTrack: ct2 } = useMusicStore.getState();
      const { isYT } = isYouTubeUrl(ct2?.audioUrl);
      if (isYT) return; // YouTube handles its own next
      if (!dur || !Number.isFinite(dur) || dur === 0) return;
      if (ct > 0 && dur > 0 && ct >= dur - 0.3) {
        if (rm !== 'one') {
          useMusicStore.getState().next();
        }
      }
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  return null;
}
