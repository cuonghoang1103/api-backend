'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useMusicStore } from '@/store/musicStore';
import { setAudioAnalyser } from '@/hooks/useAudioAnalyser';
import { loadYouTubeAPI, isYouTubeUrl } from '@/lib/youtube-player';
import { getMediaUrl } from '@/lib/utils';

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
  loadVideoById: (videoId: string | { videoId: string; startSeconds?: number }, startSeconds?: number) => void;
  cueVideoById?: (videoId: string | { videoId: string; startSeconds?: number }, startSeconds?: number) => void;
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
  // Phase 1: playback speed. YouTube IFrame API supports 0.25–2.
  setPlaybackRate?: (rate: number) => void;
}

let ytPlayerInstance: YouTubePlayerInstance | null = null;
let ytContainerMounted = false;
// Flag: true once the YouTube IFrame API has loaded and we've created
// the hidden player. This player stays alive for the entire session,
// which is critical for mobile: every new YouTube iframe starts in a
// "no gesture yet" state and needs a user tap before it can autoplay.
// By creating ONE hidden player on app load (or on first music interaction)
// and keeping it alive, all subsequent track changes via loadVideoById()
// inherit that gesture context — no more "ấn play nhiều lần mới nghe được".
let ytPlayerWarmedUp = false;

// Export for use by other components
export function getYouTubePlayer(): YouTubePlayerInstance | null {
  return ytPlayerInstance;
}

function mountYouTubeContainer() {
  if (typeof window === 'undefined' || ytContainerMounted) return;
  if (!document.getElementById('youtube-player-container')) {
    const container = document.createElement('div');
    container.id = 'youtube-player-container';
    // MUST stay INSIDE the viewport: iOS Safari throttles/pauses media in
    // iframes positioned off-screen (the old `left:-9999px` was the root
    // cause of YouTube tracks cutting out mid-play on phones). A 2×2px
    // corner box is visually invisible but counts as on-screen.
    container.style.cssText = 'position:fixed;width:2px;height:2px;bottom:0;left:0;pointer-events:none;overflow:hidden;z-index:1;';
    container.innerHTML = '<div id="youtube-player"></div>';
    document.body.appendChild(container);
  }
  ytContainerMounted = true;
}

/**
 * Nudge a YouTube player that *should* be playing but silently isn't —
 * mobile browsers sometimes swallow the first `playVideo()` after a
 * load when it lands outside the user-gesture window. Polls briefly,
 * then forces the pause→play cycle the user otherwise does by hand.
 */
function ensureYouTubePlaying(player: YouTubePlayerInstance) {
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
      clearInterval(probe);
      return;
    }
    if (attempts >= 3) {
      clearInterval(probe);
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

/**
 * Create (or reuse) the hidden YouTube player so it can be "warmed up"
 * during the user-gesture window. Once created the iframe stays alive for
 * the session — every subsequent loadVideoById() call inherits its gesture
 * context, which eliminates the "ấn play nhiều lần mới nghe được" problem.
 *
 * On mobile, YouTube iframes require a user gesture before they can
 * autoplay. By creating this iframe while we're still inside a gesture
 * event (e.g. the user just tapped a search result), the iframe's
 * `activated` state is set and subsequent playVideo() calls succeed
 * even when they fire from setTimeout/requestAnimationFrame callbacks.
 *
 * NOTE: This function does NOT set up playback event listeners
 * (onStateChange, onEnded, onError). Those are set up by handleYouTubeTrack
 * when a real track is loaded. This keeps the warm-up player "dumb" —
 * it just creates the iframe in an activated state.
 */
function warmUpYouTubePlayer() {
  if (ytPlayerWarmedUp || !window.YT?.Player) return;

  mountYouTubeContainer();

  // If a player already exists, just mark as warmed.
  if (ytPlayerInstance) {
    ytPlayerWarmedUp = true;
    return;
  }

  const player = new window.YT.Player('youtube-player', {
    height: '1',
    width: '1',
    videoId: 'dQw4w9WgXcQ', // dummy placeholder — never visible
    playerVars: {
      autoplay: 0,
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
      onReady: () => {
        ytPlayerWarmedUp = true;
        // Set volume to the user's saved level so the warm-up iframe
        // doesn't blast audio if somehow play gets called on it.
        if (ytMuted) {
          ytPlayerInstance?.mute();
        } else {
          const ytVol = Math.round(Math.max(0, Math.min(1, useMusicStore.getState().volume)) * 100);
          ytPlayerInstance?.setVolume(ytVol);
          ytVolume = ytVol;
        }
      },
      // ONE delegating onStateChange/onError, registered here at
      // creation and NEVER again. They forward to the per-track
      // `ytOnStateChange` / `ytOnError` refs, which handleYouTubeTrack
      // swaps per track. This is the fix for the "queue jumps to the
      // last song after ~7 tracks" bug: previously every track called
      // player.addEventListener('onStateChange', ...) — and the YT
      // IFrame API ACCUMULATES listeners (it does NOT replace), so on
      // the Nth track all N handlers fired next() at once, skipping
      // ~N tracks per end event. A single delegating listener fires
      // exactly once.
      onStateChange: (e: unknown) => {
        const evt = e as { data: number };
        ytOnStateChange?.(evt.data);
      },
      onError: (e: unknown) => {
        ytOnError?.(e);
      },
    },
  });
  ytPlayerInstance = player;
}

function unmountYouTubeContainer() {
  if (typeof window === 'undefined') return;
  const container = document.getElementById('youtube-player-container');
  if (container) container.remove();
  ytContainerMounted = false;
  ytPlayerInstance = null;
  ytPlayerWarmedUp = false;
}

let ytVolume = 70;
let ytMuted = false;

// Module-level callback refs so warmUpYouTubePlayer can set them once
// and handleYouTubeTrack can update them per track without recreating
// the iframe. This is critical for mobile: destroying/recreating the
// iframe per track resets the gesture context and causes the
// "ấn play nhiều lần" problem.
let ytOnStateChange: ((state: number) => void) | null = null;
let ytOnEnded: (() => void) | null = null;
let ytOnError: ((err: unknown) => void) | null = null;

function createYouTubePlayer(
  videoId: string,
  startSeconds: number,
  onReady: () => void,
  onStateChange: (state: number) => void,
  onEnded: () => void,
  onError: (err: unknown) => void,
): YouTubePlayerInstance {
  // If we already have a warm player, we don't need to recreate it.
  // The caller (handleYouTubeTrack) will use loadVideoById on the
  // existing instance. This is the fix for the "ấn play nhiều lần"
  // bug: previously, every new track destroyed and recreated the
  // YouTube iframe, which reset its gesture context on mobile.
  if (ytPlayerInstance) {
    // Just swap the delegated callback refs — the player's SINGLE
    // onStateChange/onError listeners (registered once at creation)
    // already forward to these refs. Do NOT call addEventListener here:
    // the YT IFrame API accumulates listeners, which was the root cause
    // of the "queue jumps to the last song" bug.
    ytOnStateChange = onStateChange;
    ytOnEnded = onEnded;
    ytOnError = onError;

    // Invoke onReady to unblock the track-loading flow.
    // The warm player is already initialized, so this is synchronous.
    setTimeout(onReady, 0);
    return ytPlayerInstance;
  }

  // Store callbacks so the warm-up player can pick them up.
  // This allows handleYouTubeTrack to set up events even when
  // the iframe was created by warmUpYouTubePlayer.
  ytOnStateChange = onStateChange;
  ytOnEnded = onEnded;
  ytOnError = onError;

  mountYouTubeContainer();

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
      // Delegate to the module-level refs (set above + swapped per track
      // by handleYouTubeTrack) instead of the captured closures, so this
      // is the ONE and only onStateChange/onError listener for the life
      // of the player — no per-track accumulation.
      onStateChange: (e: unknown) => {
        const evt = e as { data: number };
        ytOnStateChange?.(evt.data);
      },
      onError: (e: unknown) => {
        ytOnError?.(e);
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
    isSeeking,
    volume,
    isMuted,
    repeatMode,
    setCurrentTime,
    setDuration,
    next,
  } = useMusicStore();

  const prevTrackIdRef = useRef<string | null>(null);
  const ytPollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Media Session: lock-screen / control-center transport ─────────────
  // Without this, the lock screen shows a play button that does nothing —
  // the <audio> element keeps playing in the background, but iOS/Android
  // have no handlers to control it. Handlers read the store via getState()
  // so they never go stale.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    const ms = navigator.mediaSession;
    const safeSet = (action: MediaSessionAction, handler: MediaSessionActionHandler | null) => {
      try {
        ms.setActionHandler(action, handler);
      } catch {
        /* action not supported on this platform — ignore */
      }
    };
    safeSet('play', () => useMusicStore.getState().play());
    safeSet('pause', () => useMusicStore.getState().pause());
    safeSet('nexttrack', () => useMusicStore.getState().next());
    safeSet('previoustrack', () => useMusicStore.getState().previous());
    safeSet('seekto', (d) => {
      const a = audioRef.current;
      if (a && d.seekTime != null && Number.isFinite(d.seekTime)) {
        a.currentTime = d.seekTime;
        useMusicStore.getState().setCurrentTime(d.seekTime);
      }
    });
    // Deliberately DO NOT register seekbackward/seekforward. On iOS, if
    // those handlers exist the lock screen shows ±10s skip buttons; with
    // them absent it shows prev/next TRACK buttons instead (which is what
    // the user wants). Track skipping is handled by nexttrack/previoustrack
    // above; the scrubber still works via seekto.
    return () => {
      (
        ['play', 'pause', 'nexttrack', 'previoustrack', 'seekto', 'seekbackward', 'seekforward'] as MediaSessionAction[]
      ).forEach((a) => safeSet(a, null));
    };
  }, []);

  // Lock-screen metadata (title / artist / cover art) per track.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      if (!currentTrack) {
        navigator.mediaSession.metadata = null;
        return;
      }
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title || 'CuongThai Music',
        artist: currentTrack.artist || '',
        artwork: currentTrack.coverImage
          ? [{ src: currentTrack.coverImage, sizes: '512x512', type: 'image/jpeg' }]
          : [],
      });
    } catch {
      /* MediaMetadata unavailable — ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);

  // Reflect play/pause into the lock-screen UI.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    } catch {
      /* ignore */
    }
  }, [isPlaying]);

  // Lazily creates AudioContext + AnalyserNode for local audio
  const ensureAnalyser = useCallback(() => {
    if (audioContextRef.current || !audioRef.current) return;
    // Skip Web Audio on touch / mobile devices. createMediaElementSource
    // captures the <audio> element's output INTO the AudioContext, and
    // mobile browsers SUSPEND the AudioContext when the app is
    // backgrounded / the screen locks — so the track keeps advancing but
    // goes SILENT until you refocus (the exact "no sound in background,
    // resumes when I reopen the app" bug). Playing the element natively
    // (no capture) lets lock-screen / background audio work like Spotify.
    // Trade-off: the frequency-reactive visualizer is desktop-only — on a
    // phone the screen is off in the background anyway.
    if (typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)')?.matches) {
      return;
    }
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
        // Also update duration in case it wasn't available when the track loaded.
        const d = player.getDuration?.() ?? 0;
        if (d > 0) setDuration(d);
      } catch {
        // Player may be destroyed
      }
      // 500ms (was 250ms): halves the store-update / re-render rate during
      // YouTube playback — lighter on mobile, still smooth enough for the
      // 1s-resolution progress bar.
    }, 500);
  }, [stopYouTubePolling, setCurrentTime, setDuration]);

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

  // ── Warm up YouTube player on first user interaction ─────────────────
  // This is the KEY fix for mobile: we create the hidden YouTube iframe
  // during a user gesture (click/touch) so it inherits the gesture context.
  // Once created, the iframe stays alive for the session. Every subsequent
  // loadVideoById() inherits that context and can autoplay without
  // additional taps. This eliminates the "ấn play nhiều lần mới nghe được"
  // problem entirely.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleFirstInteraction = () => {
      loadYouTubeAPI().then(() => {
        // Only warm up if we don't already have a player.
        // This is safe to call multiple times.
        if (!ytPlayerWarmedUp && !ytPlayerInstance) {
          warmUpYouTubePlayer();
        }
      });
      // Remove listener after first interaction — one warm-up is enough.
      document.removeEventListener('click', handleFirstInteraction, true);
      document.removeEventListener('touchstart', handleFirstInteraction, true);
    };

    // If API is already loaded, warm up immediately.
    if (window.YT?.Player) {
      warmUpYouTubePlayer();
    } else {
      document.addEventListener('click', handleFirstInteraction, true);
      document.addEventListener('touchstart', handleFirstInteraction, true);
    }

    return () => {
      document.removeEventListener('click', handleFirstInteraction, true);
      document.removeEventListener('touchstart', handleFirstInteraction, true);
    };
  }, []);

  // ── YouTube playback handler ──────────────────────────────────────
  const handleYouTubeTrack = useCallback(
    (videoId: string, shouldPlay: boolean, startSeconds = 0) => {
      if (!window.YT?.Player) {
        // API not ready — trigger warm-up (creates the iframe during the
        // current gesture context) and retry once the API loads.
        loadYouTubeAPI().then(() => {
          warmUpYouTubePlayer();
          // Use setTimeout 0 to let the iframe initialize, then load the track.
          // This gives YouTube's IFrame API time to be ready for loadVideoById.
          setTimeout(() => {
            handleYouTubeTrack(videoId, shouldPlay, startSeconds);
          }, 50);
        });
        return;
      }

      // Ensure iframe is created before we try to load the track.
      // This handles the case where the API is ready but warmUp hasn't run yet.
      if (!ytPlayerInstance) {
        warmUpYouTubePlayer();
        // Retry after warm-up — the iframe will be created synchronously
        // (or microtask-delayed) so this recursive call will hit the
        // ytPlayerInstance path below.
        setTimeout(() => {
          handleYouTubeTrack(videoId, shouldPlay, startSeconds);
        }, 50);
        return;
      }

      // Reuse the existing player whenever possible. Destroy+recreate per
      // track (the old behaviour) resets the iframe's user-gesture
      // activation on iOS — every new YouTube track needed fresh taps to
      // make sound ("ấn play nhiều lần mới nghe được") and the teardown/
      // reload churn caused mid-track dropouts. loadVideoById keeps the
      // same activated iframe alive, switches instantly, and autoplays.
      if (ytPlayerInstance && typeof ytPlayerInstance.loadVideoById === 'function') {
        const player = ytPlayerInstance;
        try {
          stopYouTubePolling();
          const wantPlay = shouldPlay || useMusicStore.getState().isPlaying;

          // Swap the delegated track-end handler (the player already has
          // its ONE onStateChange listener from creation, which forwards
          // the raw state number here). ENDED → advance exactly once.
          // We do NOT call addEventListener — that accumulates handlers on
          // the YT IFrame API and was the root cause of the queue jumping
          // to the last song. next() is read fresh from the store so it
          // can never fire on a stale index.
          ytOnStateChange = (state: number) => {
            const { ENDED } = window.YT?.PlayerState ?? {};
            if (state === ENDED) {
              stopYouTubePolling();
              setTimeout(() => useMusicStore.getState().next(), 0);
            }
          };
          ytOnError = (err: unknown) => {
            console.warn('[YouTube] Player error:', err);
          };

          if (wantPlay) {
            player.loadVideoById({ videoId, startSeconds });
          } else if (typeof player.cueVideoById === 'function') {
            player.cueVideoById({ videoId, startSeconds });
          } else {
            player.loadVideoById({ videoId, startSeconds });
            player.pauseVideo();
          }
          // Set duration immediately (YouTube may have it cached).
          // Also poll via the interval in case it loads async.
          const d = player.getDuration?.() ?? 0;
          if (d > 0) setDuration(d);
          // Re-apply audio settings — a load keeps them, but be explicit.
          if (ytMuted) {
            player.mute();
          } else {
            const ytVol = Math.round(Math.max(0, Math.min(1, useMusicStore.getState().volume)) * 100);
            player.setVolume(ytVol);
            ytVolume = ytVol;
          }
          const savedRate = useMusicStore.getState().playbackRate;
          if (player.setPlaybackRate && Number.isFinite(savedRate)) {
            try { player.setPlaybackRate(Math.max(0.5, Math.min(2, savedRate))); } catch { /* ignore */ }
          }
          startYouTubePolling(player);
          if (wantPlay) ensureYouTubePlaying(player);
          return;
        } catch {
          // Player wedged — fall through to a clean recreate below.
          try { player.destroy(); } catch { /* ignore */ }
          ytPlayerInstance = null;
          ytPlayerWarmedUp = false;
        }
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
            // Autoplay-block detection: some browsers reject playVideo()
            // from onReady when it lands outside the user-gesture window —
            // the disc spins but no audio. ensureYouTubePlaying probes for
            // ~1.5s and forces the pause→play cycle the user otherwise
            // does by hand.
            ensureYouTubePlaying(player);
          }
          const d = ytPlayerInstance?.getDuration?.() ?? 0;
          if (d > 0) setDuration(d);
          // Phase 1: apply the user's saved playback speed to a
          // freshly-created YouTube player so it doesn't always
          // start at 1.0 even if the user has 1.5× saved.
          const savedRate = useMusicStore.getState().playbackRate;
          if (ytPlayerInstance?.setPlaybackRate && Number.isFinite(savedRate)) {
            try {
              ytPlayerInstance.setPlaybackRate(Math.max(0.5, Math.min(2, savedRate)));
            } catch {
              /* ignore — player may not be fully ready */
            }
          }
          startYouTubePolling(ytPlayerInstance!);
        },
        (state) => {
          // onStateChange — handles track-end only here. We DON'T also
          // listen to onEnded because both fire for the same end event,
          // which caused next() to be called twice (skipping a track).
          const { PLAYING, PAUSED, ENDED } = window.YT?.PlayerState ?? {};
          if (state === ENDED) {
            stopYouTubePolling();
            // Defer so we don't fire `next` from inside the
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
          // onEnded — intentionally EMPTY. onStateChange with data=ENDED
          // already fires next() above. Having both handlers caused next()
          // to be called twice per track end (race between setTimeout and
          // synchronous call), skipping every other track in repeat-all mode.
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
    // Skip if user is dragging the seek bar — the polling loop will update
    // currentTime naturally once they release, so there's no need to
    // constantly re-seek and fight the feedback loop.
    if (isSeeking) return;
    const { isYT } = isYouTubeUrl(currentTrack.audioUrl);
    if (!isYT) return;
    const diff = Math.abs((ytPlayerInstance.getCurrentTime?.() ?? 0) - currentTime);
    if (diff > 1) {
      ytPlayerInstance.seekTo(currentTime, true);
    }
  }, [currentTime, currentTrack, isSeeking]);

  // Seek local audio (when user drags seek bar or restoring position)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    // Skip if user is dragging the seek bar
    if (isSeeking) return;
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
  }, [currentTime, currentTrack, isSeeking]);

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

      // Recovery: a single broken <audio> element stays broken
      // for the rest of its lifetime (subsequent audio.play()
      // calls reject with NotSupportedError, the one-shot canplay
      // retry in tryPlay() never fires because the element can't
      // progress). Previously this left the user stuck — pressing
      // play did nothing, the spinning disc kept spinning, and
      // the only fix was a hard reload. Now we rebuild the source:
      //  - clear src, then re-set the same URL and reload()
      //  - when canplay fires (only on a real recoverable failure),
      //    re-attempt audio.play() if the store still says we
      //    should be playing
      //  - guard against an infinite loop: only retry once per
      //    audio-element lifetime. A persistent 4xx/5xx on the
      //    source URL will still surface, but the user's manual
      //    next-track click will replace the src and try again.
      const currentSrc = audio.src;
      // Pull latest store state — handleError is bound to the
      // initial-load useEffect closure so isPlaying/currentTrack
      // may be stale; the store getters below always read fresh.
      const s = useMusicStore.getState();
      if (!currentSrc || !s.currentTrack || !s.isPlaying) return;
      if (audio.dataset.recovered === '1') return; // already retried
      audio.dataset.recovered = '1';
      try {
        audio.removeAttribute('src');
        audio.load();
        audio.src = currentSrc;
        audio.load();
      } catch {
        /* load() can throw synchronously on detached nodes; ignore */
      }
      const onCanPlay = () => {
        audio.removeEventListener('canplay', onCanPlay);
        // Re-check the store at canplay time — the user may have
        // paused or switched tracks during the recovery window.
        const s2 = useMusicStore.getState();
        if (!s2.isPlaying || !s2.currentTrack) return;
        audio.play().catch(() => {
          /* still blocked; the next user click will retry */
        });
      };
      audio.addEventListener('canplay', onCanPlay);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Media Session position (lock-screen scrubber). Throttled — the exact
    // position only needs to be re-synced every few seconds and on seeks.
    let lastPositionSync = 0;
    const syncPositionState = () => {
      if (!('mediaSession' in navigator)) return;
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      const now = Date.now();
      if (now - lastPositionSync < 4000) return;
      lastPositionSync = now;
      try {
        navigator.mediaSession.setPositionState({
          duration: audio.duration,
          position: Math.min(audio.currentTime, audio.duration),
          playbackRate: audio.playbackRate || 1,
        });
      } catch {
        /* ignore */
      }
    };
    const syncPositionNow = () => {
      lastPositionSync = 0;
      syncPositionState();
    };
    audio.addEventListener('timeupdate', syncPositionState);
    audio.addEventListener('seeked', syncPositionNow);
    audio.addEventListener('ratechange', syncPositionNow);
    audio.addEventListener('loadedmetadata', syncPositionNow);

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
      audio.removeEventListener('timeupdate', syncPositionState);
      audio.removeEventListener('seeked', syncPositionNow);
      audio.removeEventListener('ratechange', syncPositionNow);
      audio.removeEventListener('loadedmetadata', syncPositionNow);
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
    // iOS makes HTMLMediaElement.volume READ-ONLY (system/hardware controls
    // it), so setting `.volume` there — including `.volume = 0` for mute —
    // is silently ignored. `.muted` IS settable on iOS, so drive mute
    // through `.muted` (works everywhere) and still set `.volume` for the
    // level (works on Android/desktop; no-op on iOS where the on-screen
    // slider is hidden and the hardware buttons take over).
    audio.muted = isMuted;
    audio.volume = Math.max(0, Math.min(1, volume));
  }, [volume, isMuted]);

  // ── Phase 1: playback rate (speed) sync ─────────────────────────────
  // Separate effect so changing the speed must NOT trigger a track
  // reload (the existing load-track effect's dep array is carefully
  // tuned — adding `playbackRate` there would break "pause then play
  // rewinds YouTube to 0"). Subscribed via Zustand selector so the
  // effect re-runs only when the rate actually changes. Also depends
  // on `currentTrack?.id` so the rate is re-applied after a track
  // switch (in case the new player started at default 1.0).
  const playbackRate = useMusicStore((s) => s.playbackRate);
  useEffect(() => {
    const safeRate = Number.isFinite(playbackRate)
      ? Math.max(0.5, Math.min(2, playbackRate))
      : 1.0;

    // Local <audio>: property is `playbackRate`, valid range 0.0625–16.
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.playbackRate = safeRate;
      } catch {
        // Some browsers throw if the audio isn't ready yet — safe to ignore.
      }
    }

    // YouTube IFrame: setPlaybackRate(suggestedRate) is a stable method.
    if (ytPlayerInstance?.setPlaybackRate) {
      try {
        ytPlayerInstance.setPlaybackRate(safeRate);
      } catch {
        // Player may be mid-init — the onReady handler picks up the
        // current store rate on next mount.
      }
    }
  }, [playbackRate, currentTrack?.id]);

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
    // Resolve the playable URL. R2 CDN URLs fail CORS when the audio
    // element is created with `crossOrigin = 'anonymous'` (which we
    // need for the Web Audio AnalyserNode visualizer), so we route
    // R2 / uploaded tracks through the backend stream endpoint
    // which carries CORS headers via the global middleware.
    const rawUrl = currentTrack
      ? getMediaUrl(currentTrack.localPath, currentTrack.audioUrl, currentTrack.id)
      : undefined;
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

  // ── Persist playback position (Bug 3 fix) ────────────────────────
  // The store's `setCurrentTime` only triggers a debounced save (1s)
  // when called explicitly (e.g. user seeks). During normal playback
  // `currentTime` is updated every ~250ms by the audio element's
  // `timeupdate` handler (local audio) or by the YouTube polling loop,
  // but neither path calls setCurrentTime with a "user-initiated" flag,
  // so the debounced save never runs while you're just listening.
  // The result: a page reload mid-track always restores to whatever
  // was the last seek position, not the actual playback position.
  //
  // Fix: every 5s during active playback, force-flush a save that
  // includes the latest currentTime. Also flush on visibilitychange
  // (tab hidden / app backgrounded) so a quick tab-switch + reload
  // captures the true position. We use the store's `flushSave` helper
  // (which writes the same `cuong-music-v2` key the store already
  // reads on init), so reloads restore the position automatically.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!currentTrack) return;

    const flush = () => {
      const s = useMusicStore.getState();
      // Skip the flush if the user is at the very start of a track —
      // saves with currentTime=0 are fine, but we can save the
      // localStorage write churn.
      if (s.currentTime <= 0.5) return;
      try {
        const raw = localStorage.getItem('cuong-music-v2');
        const parsed = raw ? JSON.parse(raw) : {};
        const merged = {
          currentTrackId: s.currentTrack?.id ?? null,
          currentTime: s.currentTime,
          volume: s.volume,
          isMuted: s.isMuted,
          isShuffled: s.isShuffled,
          repeatMode: s.repeatMode,
          lastPlaylistId: s.lastPlaylistId,
          ...parsed,
        };
        // Always overwrite currentTime/currentTrackId with the live store
        merged.currentTime = s.currentTime;
        merged.currentTrackId = s.currentTrack?.id ?? null;
        localStorage.setItem('cuong-music-v2', JSON.stringify(merged));
      } catch {
        /* ignore quota / private mode */
      }
    };

    const interval = setInterval(flush, 5000);
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        flush();
        return;
      }
      // Tab became visible again. If the user expected music to be
      // playing (store.isPlaying === true) but the underlying <audio>
      // element was paused — typical after a long hidden-tab period
      // where the browser suspended playback, or after the user
      // navigated away and back while autoplay was blocked — restart
      // it. Without this, the user's reported symptom is 'the music
      // stops at the end of the previous track and won't resume until
      // I click play'. The store flag is the source of truth; the
      // <audio>.paused check makes this a no-op when playback is
      // already healthy.
      const audio = audioRef.current;
      const s = useMusicStore.getState();
      if (!s.isPlaying || !s.currentTrack) return;

      // Is the current track a YouTube track or a local/R2 <audio> one?
      const rawUrl = getMediaUrl(s.currentTrack.localPath, s.currentTrack.audioUrl, s.currentTrack.id);
      const { isYT } = isYouTubeUrl(rawUrl);

      if (isYT) {
        // YouTube tracks: mobile browsers suspend the hidden iframe when
        // the tab is backgrounded / screen locks. On refocus, nudge it
        // back to playing so the user doesn't have to hit play again.
        // (True lock-screen background playback is not possible for a
        // YouTube iframe — that requires a real <audio> element, i.e. an
        // R2-uploaded track.)
        try { ytPlayerInstance?.playVideo(); } catch { /* ignore */ }
        return;
      }

      if (audio && audio.paused) {
        // The current src should match s.currentTrack.id, but if a
        // track swap raced with the visibility flip, we let the
        // load-track effect do its thing instead of fighting it.
        const expectedId = String(s.currentTrack.id);
        if (audio.src && expectedId) {
          audio.play().catch(() => {
            // Silently swallow — the play() can still be blocked on
            // some mobile browsers right after the tab wakes up.
            // The next user click on the play button will retry.
          });
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    // Also flush on pagehide (closing tab / navigating away) so the
    // next session resumes at the right position even if visibilitychange
    // didn't fire.
    const onPageHide = () => flush();
    window.addEventListener('pagehide', onPageHide);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [currentTrack?.id, isPlaying]);

  return null;
}
