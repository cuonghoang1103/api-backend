'use client';

/**
 * The rive-style conveyor: cards scroll right→left in an endless loop, pausing on
 * hover. Data comes from the LandingPromo API (admin-uploaded clips); until an
 * admin adds any, it falls back to the static feature placeholders. Performance:
 * one CSS transform drives the whole strip (GPU); videos are muted/looped/
 * playsInline and are PAUSED whenever the strip scrolls out of view (one
 * IntersectionObserver on the container). Reduced-motion: no auto-scroll, the
 * strip becomes a normal horizontal scroll area and videos don't autoplay.
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Briefcase, GraduationCap, FileText, Gamepad2, Sparkles, Music, ArrowUpRight } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/useIsTouch';
import { landingApi } from '@/lib/landing-api';
import { LANDING_FEATURES } from './landingData';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  interview: Briefcase, language: GraduationCap, cv: FileText, games: Gamepad2, chat: Sparkles, music: Music,
};

interface Card {
  key: string;
  title: string;
  tagline: string;
  href: string;
  accent: string;
  videoUrl: string | null;
  posterUrl: string | null;
}

function FeatureCard({ f, autoplay }: { f: Card; autoplay: boolean }) {
  const Icon = ICONS[f.key] ?? Sparkles;
  return (
    <Link
      href={f.href}
      className="group relative block w-[300px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: `0 12px 40px -8px ${f.accent}66, inset 0 0 0 1px ${f.accent}55` }} />
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#0d0d1a]">
        {f.videoUrl ? (
          <video
            className="h-full w-full object-cover"
            src={f.videoUrl}
            poster={f.posterUrl ?? undefined}
            muted loop playsInline preload="metadata"
            autoPlay={autoplay}
            data-promo-video
          />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${f.accent}33, #0d0d1a 60%)` }}>
            <div className="absolute inset-0 animate-[shine_3.5s_linear_infinite] opacity-40" style={{ background: `linear-gradient(115deg, transparent 30%, ${f.accent}55 50%, transparent 70%)`, backgroundSize: '200% 100%' }} />
            <div className="absolute inset-0 flex items-center justify-center"><Icon className="h-10 w-10 text-white/80" /></div>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2 px-1 pb-1">
        <div className="min-w-0">
          <div className="truncate font-semibold text-white">{f.title}</div>
          <div className="mt-0.5 truncate text-sm text-slate-400">{f.tagline}</div>
        </div>
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-white" />
      </div>
    </Link>
  );
}

const PLACEHOLDERS: Card[] = LANDING_FEATURES.map((f) => ({
  key: f.key, title: f.title, tagline: f.tagline, href: f.href, accent: f.accent, videoUrl: f.videoUrl, posterUrl: null,
}));

export default function FeatureMarquee() {
  const reduced = usePrefersReducedMotion();
  const [cards, setCards] = useState<Card[]>(PLACEHOLDERS);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load admin promos; keep placeholders if none/error.
  useEffect(() => {
    let alive = true;
    landingApi.getPromos()
      .then((res) => {
        const promos = res.data.data || [];
        if (!alive || promos.length === 0) return;
        setCards(promos.map((p) => ({
          key: p.featureKey || `promo-${p.id}`,
          title: p.title,
          tagline: p.tagline || '',
          href: p.href || '#',
          accent: p.accent || '#8b5cf6',
          videoUrl: p.videoUrl,
          posterUrl: p.posterUrl,
        })));
      })
      .catch(() => { /* keep placeholders */ });
    return () => { alive = false; };
  }, []);

  // Pause videos when the strip scrolls out of view (saves CPU/battery).
  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(([entry]) => {
      el.querySelectorAll<HTMLVideoElement>('video[data-promo-video]').forEach((v) => {
        if (entry.isIntersecting) { v.play().catch(() => {}); } else { v.pause(); }
      });
    }, { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, cards]);

  const items = [...cards, ...cards]; // duplicated for a seamless loop

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#0a0a14] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#0a0a14] to-transparent" />

      <div className={reduced ? 'flex gap-5 overflow-x-auto px-4 pb-2' : 'marquee-mask overflow-hidden'}>
        <div className={reduced ? 'flex gap-5' : 'marquee-track flex w-max gap-5'}>
          {(reduced ? cards : items).map((f, i) => (
            <FeatureCard key={`${f.key}-${i}`} f={f} autoplay={!reduced} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes shine { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        .marquee-track { animation: marquee-scroll 40s linear infinite; }
        .marquee-mask:hover .marquee-track { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
