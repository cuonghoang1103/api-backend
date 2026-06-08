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
 *      → Server: HTTP 416 + Content-Range: bytes */{totalSize}
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
  const getStreamUrl = useCallback((track: AudioTrack): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    // Ưu tiên local file path
    if (track.localPath) {
      return `${baseUrl}/uploads/${track.localPath}`;
    }

    // Backend streaming endpoint (hỗ trợ Range request)
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
