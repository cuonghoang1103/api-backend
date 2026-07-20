'use client';

// The teaching resources an admin attaches to a single exercise: a walkthrough
// video, the repository, and a downloadable source archive. Rendered as a row
// of branded buttons so they are findable at a glance rather than buried in a
// list of links.
//
// The video deliberately does NOT autoload: an iframe per exercise page costs a
// request to YouTube on every visit even when nobody watches. It mounts when the
// learner asks for it, and the "open on YouTube" escape hatch is always there.

import { useState } from 'react';
import { Download, Play, X } from 'lucide-react';

/** Accepts a watch URL, a youtu.be short link, or a bare id. */
export function youtubeId(url: string): string | null {
  const s = url.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m =
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(s);
  return m ? m[1] : null;
}

function YoutubeGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.5 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  );
}

function GithubGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2 0-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0C17.5 4.6 18.5 5 18.5 5c.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.2c0 .4.2.7.8.6A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

const BTN =
  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-85';

export function ExerciseResources({
  youtubeUrl,
  githubUrl,
  sourceUrl,
}: {
  youtubeUrl?: string | null;
  githubUrl?: string | null;
  sourceUrl?: string | null;
}) {
  const [playing, setPlaying] = useState(false);
  const videoId = youtubeUrl ? youtubeId(youtubeUrl) : null;

  if (!videoId && !youtubeUrl && !githubUrl && !sourceUrl) return null;

  return (
    <div className="mb-5">
      <div className="flex flex-wrap items-center gap-2">
        {youtubeUrl && (
          <>
            {videoId && (
              <button
                onClick={() => setPlaying((v) => !v)}
                className={BTN}
                style={{ background: '#ff0000', color: '#fff' }}
              >
                <YoutubeGlyph /> {playing ? 'Hide video' : 'Watch here'}
              </button>
            )}
            <a
              href={videoId ? `https://www.youtube.com/watch?v=${videoId}` : youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={BTN}
              style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            >
              <YoutubeGlyph size={15} /> Open on YouTube
            </a>
          </>
        )}

        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={BTN}
            style={{ background: '#24292f', color: '#fff' }}
          >
            <GithubGlyph /> GitHub
          </a>
        )}

        {sourceUrl && (
          <a
            href={sourceUrl}
            download
            className={BTN}
            style={{ background: '#2563eb', color: '#fff' }}
          >
            <Download size={15} /> Download source
          </a>
        )}
      </div>

      {playing && videoId && (
        <div className="mt-3 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center justify-between px-3 py-1.5" style={{ background: 'var(--bg-surface)' }}>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              <Play size={12} /> Walkthrough video
            </span>
            <button onClick={() => setPlaying(false)} aria-label="Close video" style={{ color: 'var(--text-muted)' }}>
              <X size={15} />
            </button>
          </div>
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
              title="Walkthrough video"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 0 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
