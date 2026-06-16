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
            // ytVolume is tracked on the 0-100 scale (matching YouTube
            // IFrame API). The store `volume` is 0-1, so convert before
            // calling setVolume. Without this, onReady always set
            // volume to whatever the last `volume` store value was,
            // which was the raw 0-1 number — YouTube then saw e.g. 0.7
            // and treated it as 0.7%.
            const ytVol = Math.round(Math.max(0, Math.min(1, useMusicStore.getState().volume)) * 100);
            ytPlayerInstance?.setVolume(ytVol);
            ytVolume = ytVol;
          }
          // Resume playback based on BOTH the explicit `shouldPlay`
          // argument AND the current store `isPlaying` flag.
          //
          // Why both: the load-track effect always passes
          // `shouldPlay=false` and relies on the play/pause toggle
          // effect to start the new video. But that effect only fires
          // when `isPlaying` *changes*. When the user picks a track
          // from search while another track is already playing,
          // `isPlaying` is already `true` so the toggle effect never
          // re-runs — the YouTube player stays paused, the UI keeps
          // showing the spinning disc (driven by `isPlaying`), and
          // the user has to click pause/play to force a re-render.
          // Checking `useMusicStore.getState().isPlaying` here covers
          // that case and makes the new track audible immediately.
          const wantPlay = shouldPlay || useMusicStore.getState().isPlaying;
          if (wantPlay) {
            const player = ytPlayerInstance!;
            player.playVideo();

            // ── Autoplay-block detection ──
            // Some browsers reject `playVideo()` from inside the
            // `onReady` callback if there hasn't been a recent user
            // gesture (e.g. user typed a search term in the input and
            // hit Enter, but no click event was registered against the
            // page body). YouTube silently swallows the rejection, the
            // player state stays in BUFFERING, the disc keeps spinning
            // because `isPlaying=true` in the store, but no audio comes
            // out. The user reported: "đĩa vẫn quay và đang phát nhưng
            // tôi không nghe thấy nhạc. Tôi phải ấn paused và ấn play
            // lại mới nghe được."
            //
            // Fix: poll the player state for ~1.5s. If it's still not
            // PLAYING, force a pause+play sequence which DOES count as
            // a programmatic re-trigger that YouTube accepts. The
            // pause+play also fires a state-change event, which the
            // play/pause toggle effect listens for.
            let attempts = 0;
            const probe = setInterval(() => {
              attempts++;
              try {
                const state = player.getPlayerState?.();
                if (state === window.YT?.PlayerState?.PLAYING) {
                  clearInterval(probe);
                  return;
                }
              } catch {
                // Player gone
                clearInterval(probe);
                return;
              }
              if (attempts >= 3) {
                clearInterval(probe);
                // Last resort: pause + play to force a re-trigger.
                // This is exactly what the user had to do manually
                // (click pause then play). The `playVideo()` here runs
                // from a setTimeout callback, which most browsers
                // consider a valid user-gesture follow-up because the
                // search-result click already counted as a gesture.
                try {
                  player.pauseVideo();
                  setTimeout(() => {
                    try { player.playVideo(); } catch { /* ignore */ }
                  }, 100);
                } catch {
                  /* ignore */
                }
              }
            }, 500);
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
      // YouTube IFrame API expects volume on a 0-100 integer scale.
      // Store `volume` is on 0-1 (matches the local <audio> element
      // volume property). Multiplying by 100 fixes the bug where
      // dragging the slider to ~0.2 made the YouTube player silent
      // (it was interpreting 0.2 as "0.2 out of 100" = effectively
      // muted) — see line 415 for the equivalent local-audio mapping.
      const ytVol = Math.round(Math.max(0, Math.min(1, volume)) * 100);
      ytPlayerInstance.setVolume(ytVol);
      ytVolume = ytVol;
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
      // and we should not call it again.
      triggered = true;
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
  // CRITICAL: this effect must NOT depend on `isPlaying` — that was
  // the root cause of "pause then play rewinds to 0". Previously, a
  // togglePlay() would flip isPlaying → effect re-ran → for YouTube
  // tracks it destroyed the player and recreated it from `currentTime`,
  // racing with the polling updater (which writes to currentTime every
  // 250ms). The recreated player sometimes started from 0 because the
  // startSeconds captured at the moment the effect ran was stale (the
  // store was updated just before the effect captured the new closure
  // but the polling callback also wrote to it).
  //
  // The fix: this effect only runs when the trackId or audioUrl
  // changes. Play/pause is handled by a SEPARATE effect below that
  // calls playVideo()/pauseVideo() on the existing player without
  // recreating it.
  useEffect(() => {
    const audio = audioRef.current;
    const rawUrl = currentTrack?.audioUrl;
    const trackId = currentTrack?.id ?? null;
    const { isYT, videoId } = isYouTubeUrl(rawUrl);

    if (!rawUrl) return;

    if (isYT) {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      // Always pass shouldPlay=false at load time. The play/pause
      // effect below will start playback once the player is ready.
      // The store's currentTime at this point is whatever was last
      // persisted — that's the resume position.
      handleYouTubeTrack(videoId, false, currentTime);
      return;
    }

    // Local track: stop YouTube (don't destroy — we may come back)
    if (ytPlayerInstance) {
      try { ytPlayerInstance.pauseVideo(); } catch { /* ignore */ }
    }

    if (!audio) return;

    const trackChanged = prevTrackIdRef.current !== trackId;
    if (trackChanged) prevTrackIdRef.current = trackId;

    if (audio.src === rawUrl && !trackChanged) {
      // Same track already loaded — no reload needed. The play/pause
      // effect below will start/stop playback as needed.
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
          // (debug log removed 2026-06-17)
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
      // Attach the same restore handler to loadedmetadata (no auto-play;
      // the play/pause effect will fire after this).
      audio.addEventListener('loadedmetadata', onLoadedMetadataForRestore);
    } else {
      audio.addEventListener('loadedmetadata', onLoadedMetadataForRestore, { once: true });
    }
  }, [
    currentTrack?.id,
    currentTrack?.audioUrl,
    // NOTE: isPlaying intentionally excluded — toggling play/pause must
    // NOT reload the track. See the new `play-pause toggle` effect below.
    // handleYouTubeTrack intentionally excluded — YouTube player is created
    // via handleYouTubeTrack which always runs on track change.
    // handleYouTubeTrack is stable (no setState in deps) so this is safe.
    // ensureAnalyser is in deps for first-play setup.
    ensureAnalyser,
    handleYouTubeTrack,
  ]);

  // ── Play / pause toggle effect ────────────────────────────────────
  // Runs whenever `isPlaying` flips. Does NOT reload the audio source
  // or recreate the YouTube player — it just calls play() / pause() on
  // the existing element / player. This is the fix for the bug where
  // pause-then-play rewound YouTube tracks to 0 (the previous code
  // destroyed and recreated the player on every isPlaying change,
  // racing the polling updater and sometimes restarting from 0).
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentTrack) return;
    const { isYT } = isYouTubeUrl(currentTrack.audioUrl);

    if (isYT) {
      const player = ytPlayerInstance;
      if (!player) return;
      try {
        if (isPlaying) {
          player.playVideo();
        } else {
          player.pauseVideo();
        }
      } catch {
        // Player may not be fully ready yet — that's fine, the
        // initial-load path will pick up the correct state via
        // its own play/pause decision.
      }
      return;
    }

    if (!audio) return;
    if (isPlaying) {
      ensureAnalyser();
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }
      audio.play().catch((err) => {
        console.warn('[MusicAudioController] play() rejected (toggle):', err?.message);
        // Retry on canplay in case the audio isn't ready yet
        // (e.g. user toggled play extremely fast after a track change).
        audio.addEventListener(
          'canplay',
          () => {
            audio.play().catch((e2) => {
              console.error('[MusicAudioController] play() failed twice (toggle):', e2?.message);
            });
          },
          { once: true },
        );
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack?.id, currentTrack?.audioUrl, ensureAnalyser]);

  // End-of-track auto-advance is handled in the audio-init effect above:
  //   - `timeupdate` fires `next()` once when currentTime >= duration - 0.3
  //   - `ended` is a safety net for browsers that don't fire timeupdate at
  //     the very end
  // We deliberately don't use a setInterval poll here — that raced with
  // the `ended` event and caused the repeat-all to skip the wrapped-around
  // track.
  useEffect(() => {
    // Intentionally empty. End-of-track detection lives in the
    // timeupdate/ended listeners attached in the audio-init effect.
  }, [currentTrack?.id]);

  return null;
}
