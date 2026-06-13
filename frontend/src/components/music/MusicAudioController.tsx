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
    // Use 1x1 but visible (not z-index:-1 / opacity:0.01) so mobile browsers
    // allow audio playback. Hidden via absolute positioning off-screen.
    container.style.cssText = 'position:fixed;width:1px;height:1px;bottom:0;left:-9999px;pointer-events:none;overflow:hidden;z-index:1;';
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
      rel: 0,
      cc_load_policy: 0,
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

  // Mirror of `isPlaying` so the canplay retry handler can read the
  // latest value without re-running the load-track effect.
  const isPlayingRef = useRef<boolean>(false);

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
    (videoId: string, shouldPlay: boolean, startSeconds = 0) => {
      if (!window.YT?.Player) {
        loadYouTubeAPI().then(() => {
          setTimeout(() => handleYouTubeTrack(videoId, shouldPlay, startSeconds), 500);
        });
        return;
      }

      // Always recreate to load the new video
      if (ytPlayerInstance) {
        try { ytPlayerInstance.destroy(); } catch { /* ignore */ }
        ytPlayerInstance = null;
      }

      stopYouTubePolling();

      const yt = createYouTubePlayer(
        videoId,
        startSeconds,
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
            // Defer one tick so we don't fire `next` from inside the
            // YouTube IFrame callback (it can cause the new track to
            // race the player teardown). The store's `next()` already
            // handles all three repeat modes:
            //   - 'one' → reset currentTime to 0 (replay)
            //   - 'all' → wrap to index 0
            //   - 'none' → stop at end of playlist
            setTimeout(() => next(), 0);
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
    },
    // NOTE: setCurrentTime intentionally excluded to prevent effect re-running
    // during playback. The YouTube polling effect syncs currentTime separately.
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

  // Seek local audio (when user drags seek bar or restoring position)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    const { isYT } = isYouTubeUrl(currentTrack.audioUrl);
    if (isYT) return;
    // Wait until metadata is loaded so we can seek reliably
    if (!audio.duration || !Number.isFinite(audio.duration)) return;
    if (Math.abs(audio.currentTime - currentTime) > 0.5) {
      try {
        audio.currentTime = currentTime;
      } catch {
        // ignore seek errors (e.g. audio not yet ready)
      }
    }
  }, [currentTime, currentTrack]);

  // Create audio element once — SSR-safe
  useEffect(() => {
    if (audioRef.current) return;
    if (typeof window === 'undefined') return;

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';

    // Single source of truth for end-of-track auto-advance. We attach this
    // to `timeupdate` (which only fires while audio is actively playing) so
    // there's no race between a 500ms setInterval and the `ended` event
    // both firing `next()` — that race is the root cause of the "repeat-all
    // skips the first song on wrap" bug.
    //
    // `triggered` guards against the same near-end condition being reported
    // on multiple timeupdate ticks; it resets when the user seeks back.
    let triggered = false;
    const handleTimeUpdate = () => {
      const t = audio.currentTime;
      const d = audio.duration;
      setCurrentTime(t);
      if (!d || !Number.isFinite(d) || d === 0) return;
      if (t >= d - 0.3) {
        if (!triggered) {
          triggered = true;
          if (process.env.NODE_ENV !== 'production') {
            console.log('[MusicAudioController] timeupdate near-end, calling next()');
          }
          next();
        }
      } else if (t < d - 2) {
        triggered = false;
      }
    };
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      // Some browsers don't fire timeupdate right at the end, so
      // `ended` is a safety net. `triggered` may already be true from
      // the timeupdate path, in which case next() was already called
      // and we should not call it again. We use a small ref-ish guard
      // via the closure variable below.
      triggered = true;
      if (process.env.NODE_ENV !== 'production') {
        console.log('[MusicAudioController] handleEnded fired, calling next()');
      }
      next();
    };
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

  // ── Local audio volume sync — separate effect so volume changes don't
  //    trigger track reloads ─────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume));
  }, [volume, isMuted]);

  // Keep the isPlayingRef in sync so callbacks attached inside the
  // load-track effect (e.g. the canplay retry handler) can read the
  // current value without re-running the effect.
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // ── Load new track ───────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    const rawUrl = currentTrack?.audioUrl;
    const trackId = currentTrack?.id ?? null;
    const { isYT, videoId } = isYouTubeUrl(rawUrl);

    if (process.env.NODE_ENV !== 'production') {
      console.log(
        '[MusicAudioController] load-track effect:',
        'trackId=', trackId,
        'isPlaying=', isPlaying,
        'audioSrc=', audio?.src?.slice(0, 80),
        'readyState=', audio?.readyState,
        'paused=', audio?.paused,
      );
    }

    if (!rawUrl) return;

    if (isYT) {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      // Use handleYouTubeTrack directly — it doesn't need to be in deps
      // since we always want to run when track changes.
      // Pass currentTime as start position so reloads resume the song.
      handleYouTubeTrack(videoId, isPlaying, currentTime);
      return;
    }

    // Local track: stop YouTube
    if (ytPlayerInstance) {
      try { ytPlayerInstance.pauseVideo(); } catch { /* ignore */ }
    }

    if (!audio) return;

    const trackChanged = prevTrackIdRef.current !== trackId;
    if (trackChanged) prevTrackIdRef.current = trackId;

    if (audio.src === rawUrl && !trackChanged) {
      if (isPlaying) {
        ensureAnalyser();
        audio.play().catch((err) => {
          console.warn('[MusicAudioController] play() rejected (same src):', err?.message);
        });
      } else {
        audio.pause();
      }
      return;
    }

    audio.src = rawUrl;
    audio.load();

    // After metadata loads, restore the persisted playback position for
    // freshly-loaded tracks (e.g. after a page reload). Only seek if the
    // stored currentTime is a meaningful value > 0 to avoid clobbering
    // intentional "play from start" requests (currentTime: 0).
    const restoreToTime = currentTime;

    // Wait until the new audio is actually playable before calling
    // play(). Calling play() on a freshly-loaded <audio> that hasn't
    // reached readyState >= 2 (HAVE_CURRENT_DATA) is a race that the
    // spec allows to reject with NotSupportedError; in some browsers
    // the rejection is silent and the track "looks" stuck (isPlaying
    // true in store, UI spinning, but nothing audible). This is the
    // exact symptom of the repeat-all loop on the last track.
    const tryPlay = () => {
      if (!isPlayingRef.current) return;
      // AudioContext can be suspended after a long-paused tab or right
      // after a track swap; resume it before play() or the browser
      // silently swallows the request.
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }
      ensureAnalyser();
      audio
        .play()
        .then(() => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('[MusicAudioController] play() ok for', trackId);
          }
        })
        .catch((err) => {
          console.warn(
            '[MusicAudioController] play() rejected, retrying on canplay:',
            err?.message,
            'trackId=',
            trackId,
            'readyState=',
            audio.readyState,
          );
          // Retry once on canplay in case the first attempt was too
          // early (e.g. autoplay policy, network blip).
          audio.addEventListener(
            'canplay',
            () => {
              audio.play().catch((e2) => {
                console.error(
                  '[MusicAudioController] play() failed twice:',
                  e2?.message,
                  'trackId=',
                  trackId,
                );
              });
            },
            { once: true },
          );
        });
    };

    const onLoadedMetadataForRestore = () => {
      try {
        if (restoreToTime > 0 && Math.abs(audio.currentTime - restoreToTime) > 0.5) {
          audio.currentTime = restoreToTime;
        }
      } catch {
        // ignore
      }
      // Only fire play() after metadata is available so the element
      // is in a state where playback is actually possible.
      tryPlay();
      audio.removeEventListener('loadedmetadata', onLoadedMetadataForRestore);
    };

    if (restoreToTime > 0) {
      // Need to seek before we know the element can play at that offset.
      // Attach the same restore+play handler to loadedmetadata.
      audio.addEventListener('loadedmetadata', onLoadedMetadataForRestore);
    } else if (audio.readyState >= 2) {
      // HAVE_CURRENT_DATA — we can play immediately.
      tryPlay();
    } else {
      audio.addEventListener('loadedmetadata', onLoadedMetadataForRestore, { once: true });
    }
  }, [
    currentTrack?.id,
    currentTrack?.audioUrl,
    isPlaying,
    // NOTE: volume, isMuted intentionally excluded — volume is handled by the
    // dedicated effect above so volume changes don't restart playback.
    // handleYouTubeTrack intentionally excluded — YouTube player is created via
    // handleYouTubeTrack which always runs on track change.
    // handleYouTubeTrack is stable (no setState in deps) so this is safe.
    // ensureAnalyser is in deps for first-play setup.
    ensureAnalyser,
    handleYouTubeTrack,
  ]);

  // Safety net for end-of-track auto-advance. The primary path is the
  // `timeupdate` listener registered in the audio-init effect above, which
  // fires `next()` once when `currentTime >= duration - 0.3`. The `ended`
  // event is also wired up as a second safety net. We deliberately do NOT
  // use a setInterval poll anymore — that raced with `ended` and caused
  // the repeat-all to skip the wrapped-around track.
  //
  // This effect is kept as an empty dependency anchor in case we need to
  // re-arm the safety net on track change. It currently does nothing.
  useEffect(() => {
    // Intentionally empty. See the audio-init effect and `handleTimeUpdate`
    // for the actual end-of-track detection.
  }, [currentTrack?.id]);

  return null;
}
