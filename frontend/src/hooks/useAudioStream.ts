/**
 * ============================================================
 * useAudioStream — Next.js Hook cho Music Streaming
 *
 * How HTML5 Audio + Range requests work:
 *
 *   Browser gửi requests tự động khi <audio> src được set:
 *
 *   1. Initial load (metadata):
 *      GET /api/v1/music/stream/123
 *      Range: bytes=0-1
 *      → Server: HTTP 416 + Content-Range: bytes * / {totalSize}
 *      → Browser biết total file size
 *
 *   2. Buffer first chunk:
 *      GET /api/v1/music/stream/123
 *      Range: bytes=0-{chunkSize}
 *      → Server: HTTP 206 + audio/mpeg binary
 *
 *   3. User seeks (tua nhạc):
 *      GET /api/v1/music/stream/123
 *      Range: bytes={seekPos}-{totalSize-1}
 *      → Server: HTTP 206 + audio from seekPos
 * ============================================================
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export interface AudioTrack {
  id: number;
  title: string;
  artist: string;
  coverImage?: string;
  durationSeconds?: number;
  localPath?: string;
  audioUrl?: string;
}

export interface UseAudioStreamOptions {
  autoPlay?: boolean;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onError?: (error: Error) => void;
}

export function useAudioStream(options: UseAudioStreamOptions = {}) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [error, setError] = useState<Error | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // ─── Initialize audio element ───────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio();
    audio.preload = 'metadata'; // Chỉ load metadata, không load toàn bộ file
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
      setIsLoading(false);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
      options.onTimeUpdate?.(audio.currentTime, audio.duration);
    });

    audio.addEventListener('play', () => {
      setIsPlaying(true);
    });

    audio.addEventListener('pause', () => {
      setIsPlaying(false);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      options.onEnded?.();
    });

    audio.addEventListener('error', () => {
      const err = new Error(audio.error?.message ?? 'Audio playback error');
      setError(err);
      setIsPlaying(false);
      setIsLoading(false);
      options.onError?.(err);
    });

    audio.addEventListener('waiting', () => {
      setIsLoading(true);
    });

    audio.addEventListener('canplay', () => {
      setIsLoading(false);
    });

    audio.volume = volume;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // ─── Build stream URL ───────────────────────────────
  //
  // Three layouts co-exist in the DB during the migration
  // window, in order of preference:
  //
  //   1. `localPath` is a bucket key (e.g. "audio/songs/...").
  //      Build the public CDN URL — the browser streams
  //      directly from Cloudflare, no backend hop, native
  //      Range support.
  //   2. `localPath` is a legacy local path (starts with
  //      "uploads/" or "/"). Hit the backend stream endpoint,
  //      which still serves the file from local disk for the
  //      rare pre-migration track.
  //   3. `localPath` is missing but `audioUrl` is a remote
  //      (YouTube) URL. Use it directly.
  //   4. Otherwise fall through to the streaming endpoint so
  //      the backend can decide what to do (404, signed R2
  //      redirect, etc.).
  const getStreamUrl = useCallback((track: AudioTrack): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const cdnBase =
      process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.cuongthai.com';

    // (1) R2 key → CDN URL. Bucket keys never start with "/"
    // and never start with "uploads/".
    if (
      track.localPath &&
      !track.localPath.startsWith('/') &&
      !track.localPath.startsWith('uploads/') &&
      !track.localPath.startsWith('http')
    ) {
      return `${cdnBase}/${track.localPath}`;
    }

    // (2) Legacy local path.
    if (track.localPath && track.localPath.startsWith('uploads/')) {
      return `${baseUrl}/${track.localPath}`;
    }
    if (track.localPath && track.localPath.startsWith('/')) {
      return `${baseUrl}${track.localPath}`;
    }

    // (3) Remote audio URL.
    if (track.audioUrl && track.audioUrl.startsWith('http')) {
      return track.audioUrl;
    }

    // (4) Fallback — let the backend decide.
    return `${baseUrl}/api/v1/music/stream/${track.id}`;
  }, []);

  // ─── Play a track ──────────────────────────────────
  const play = useCallback(
    async (track: AudioTrack) => {
      const audio = audioRef.current;
      if (!audio) return;

      setError(null);
      setIsLoading(true);

      const streamUrl = getStreamUrl(track);

      // Chỉ reload nếu URL thay đổi
      if (audioUrlRef.current !== streamUrl) {
        audio.src = streamUrl;
        audioUrlRef.current = streamUrl;
      }

      setCurrentTrack(track);

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        setIsPlaying(false);
        const playbackError = err instanceof Error ? err : new Error('Playback failed');
        console.warn('[AudioStream] Autoplay blocked:', playbackError.message);
        setError(playbackError);
        options.onError?.(playbackError);
      }
    },
    [getStreamUrl, options],
  );

  // ─── Pause ──────────────────────────────────────────
  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  // ─── Resume ────────────────────────────────────────
  const resume = useCallback(async () => {
    try {
      await audioRef.current?.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, []);

  // ─── Toggle play/pause ───────────────────────────────
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [isPlaying, pause, resume]);

  // ─── Seek to position ───────────────────────────────
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // ─── Seek by percentage ────────────────────────────
  const seekPercent = useCallback(
    (percent: number) => {
      if (audioRef.current && duration > 0) {
        const time = (percent / 100) * duration;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      }
    },
    [duration],
  );

  // ─── Set volume ────────────────────────────────────
  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    setVolumeState(clamped);
  }, []);

  // ─── Mute/Unmute ─────────────────────────────────
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  }, []);

  return {
    currentTrack,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    error,
    play,
    pause,
    resume,
    togglePlay,
    seek,
    seekPercent,
    setVolume,
    toggleMute,
    progress: duration > 0 ? (currentTime / duration) * 100 : 0,
    formattedCurrentTime: formatTime(currentTime),
    formattedDuration: formatTime(duration),
  };
}

// ─── Helper: format seconds → MM:SS ────────────────────
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
