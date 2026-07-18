'use client';

/**
 * VoicePlayer — the media surface on the detail page.
 *
 *   - YOUTUBE  → responsive privacy-enhanced iframe embed. Chapter clicks
 *                reload the iframe at `?start=<sec>` (CSP-safe, no YT JS API).
 *   - R2_VIDEO → native <video>. Chapter clicks seek via ref.
 *   - AUDIO    → native <audio> over a poster. Chapter clicks seek via ref.
 *
 * Chapters render below the player as a clickable list.
 */

import { useRef, useState } from 'react';
import { Play, Clock } from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';
import type { PublicVoicePost } from '@/lib/api';
import { formatDuration, posterFor } from '../voiceMeta';

function chapterTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}:${String(m % 60).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function VoicePlayer({ post }: { post: PublicVoicePost }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ytStart, setYtStart] = useState(0);
  const [ytNonce, setYtNonce] = useState(0); // bump to force-reload the iframe at a new start
  const [activeChapter, setActiveChapter] = useState<number | null>(null);

  const chapters = Array.isArray(post.chapters) ? post.chapters : [];
  const poster = posterFor(post) ?? undefined;

  const seekTo = (t: number, idx: number) => {
    setActiveChapter(idx);
    if (post.mediaKind === 'YOUTUBE') {
      setYtStart(t);
      setYtNonce((n) => n + 1);
    } else if (post.mediaKind === 'R2_VIDEO' && videoRef.current) {
      videoRef.current.currentTime = t;
      videoRef.current.play().catch(() => {});
    } else if (post.mediaKind === 'AUDIO' && audioRef.current) {
      audioRef.current.currentTime = t;
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <div>
      {/* Player */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-darkborder bg-black aspect-video">
        {post.mediaKind === 'YOUTUBE' && post.youtubeId ? (
          <iframe
            key={ytNonce}
            src={`https://www.youtube-nocookie.com/embed/${post.youtubeId}?rel=0&modestbranding=1${ytStart ? `&start=${ytStart}&autoplay=1` : ''}`}
            title={post.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : post.mediaKind === 'R2_VIDEO' && post.videoUrl ? (
          <video
            ref={videoRef}
            src={getMediaUrl(post.videoUrl, null)}
            poster={poster}
            controls
            playsInline
            className="absolute inset-0 w-full h-full bg-black"
          />
        ) : post.mediaKind === 'AUDIO' && post.audioUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-br from-darksurface via-darkcard to-darksurface">
            {poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt={post.title} className="w-40 h-40 rounded-2xl object-cover shadow-2xl" />
            ) : (
              <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-neon-orange to-neon-fuchsia flex items-center justify-center text-6xl">🎙️</div>
            )}
            <audio ref={audioRef} src={getMediaUrl(post.audioUrl, null)} controls className="w-full max-w-lg" />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-muted">
            <Play className="w-10 h-10" />
          </div>
        )}
      </div>

      {/* Chapters */}
      {chapters.length > 0 && (
        <div className="mt-4 rounded-2xl border border-darkborder bg-darkcard/50 p-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Mốc thời gian
          </p>
          <ul className="space-y-1">
            {chapters.map((ch, i) => (
              <li key={i}>
                <button
                  onClick={() => seekTo(ch.t, i)}
                  className={[
                    'w-full flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-left text-sm transition-colors',
                    activeChapter === i ? 'bg-neon-violet/15 text-neon-violet' : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary',
                  ].join(' ')}
                >
                  <span className="font-mono text-xs text-neon-violet shrink-0 w-14">{chapterTime(ch.t)}</span>
                  <span className="min-w-0 truncate">{ch.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {post.durationSec ? (
        <p className="mt-2 text-xs text-text-muted">Thời lượng: {formatDuration(post.durationSec)}</p>
      ) : null}
    </div>
  );
}
