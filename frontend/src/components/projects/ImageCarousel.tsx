'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  thumbnailUrl?: string;
  title?: string;
  videoUrl?: string;
  onVideoClick?: (url: string) => void;
}

function isSafeUrl(url: unknown): url is string {
  return typeof url === 'string' && url.trim().length > 0 && url.startsWith('http');
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function ImageCarousel({
  images,
  thumbnailUrl,
  title,
  videoUrl,
  onVideoClick,
}: ImageCarouselProps) {
  const allImages = isSafeUrl(thumbnailUrl)
    ? [thumbnailUrl, ...images.filter((u) => u !== thumbnailUrl)]
    : images;

  const [current, setCurrent] = useState(0);
  const hasImages = allImages.length > 0;

  const prev = () => setCurrent((c) => (c === 0 ? allImages.length - 1 : c - 1));
  const next = () => setCurrent((c) => (allImages.length === 0 ? 0 : c === allImages.length - 1 ? 0 : c + 1));

  const c = {
    primary: '#a855f7',
    secondary: '#ec4899',
    tertiary: '#22d3ee',
    glow: 'rgba(168,85,247,0.3)',
    text: '#f8fafc',
    textMuted: '#64748b',
  };

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
      {/* ── NO IMAGES STATE: gradient placeholder ── */}
      {!hasImages ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{
            background: `linear-gradient(135deg, #1a1040 0%, #0f0a20 40%, #1e0a30 70%, #0a0515 100%)`,
          }}
        >
          {/* Animated gradient orbs */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 30% 50%, ${c.primary}40 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(ellipse 50% 60% at 70% 50%, ${c.secondary}40 0%, transparent 70%)`,
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${c.primary}30, ${c.secondary}30)`,
                border: `1px solid ${c.primary}40`,
              }}
            >
              <Play className="w-7 h-7 text-neon-violet opacity-60" />
            </div>
            {title && (
              <p className="text-sm font-medium text-text-muted opacity-60 text-center max-w-xs px-4">
                {title}
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* ── IMAGE SLIDES ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {isSafeUrl(allImages[current]) ? (
                <Image
                  src={allImages[current]}
                  alt={`${title ?? 'Project'} — ảnh ${current + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={current === 0}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

          {/* ── YOUTUBE BADGE overlay (when has videoUrl) ── */}
          {videoUrl && isSafeUrl(videoUrl) && (
            <button
              onClick={() => onVideoClick?.(videoUrl)}
              className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white transition-all hover:scale-105"
              style={{
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8z" />
                <path d="M9.75 15.5V8.5l6.5 3.5-6.5 3.5z" fill="#fff" />
              </svg>
              Video Demo
            </button>
          )}

          {/* Navigation arrows — only when > 1 image */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: i === current ? '24px' : '6px',
                    background: i === current ? c.primary : 'rgba(255,255,255,0.4)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Image counter */}
          {allImages.length > 1 && (
            <div
              className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium z-10"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', color: '#fff' }}
            >
              {current + 1} / {allImages.length}
            </div>
          )}
        </>
      )}
    </div>
  );
}
