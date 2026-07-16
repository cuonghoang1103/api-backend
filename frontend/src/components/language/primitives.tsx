'use client';
/**
 * My Language — shared UI primitives reused across every section page.
 * Theme-aware (CSS vars, never `dark:`); neon-violet accents; mobile-first.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Volume2, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { speakVocabEntry, detectVocabLang, type VocabLang } from '@/lib/notesTts';
import { useAuthStore } from '@/store/authStore';
import type { LangLearnStatus } from '@/types/language';

// ─── Auth helper ─────────────────────────────────────────────────
export function useLangUser() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return { user, isAuthenticated };
}

// ─── Reduced motion ──────────────────────────────────────────────
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

// ─── Speaker button (Web Speech TTS) ─────────────────────────────
export function SpeakerButton({
  text,
  reading,
  forceLang,
  audioUrl,
  rate,
  size = 18,
  className = '',
  label = 'Phát âm',
}: {
  text: string;
  reading?: string | null;
  forceLang?: VocabLang;
  audioUrl?: string | null;
  /** Speech rate override — full sentences read best around 0.85. */
  rate?: number;
  size?: number;
  className?: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(
    async (e?: React.MouseEvent) => {
      e?.stopPropagation();
      e?.preventDefault();
      if (audioUrl) {
        try {
          if (!audioRef.current) audioRef.current = new Audio();
          audioRef.current.src = audioUrl.startsWith('http') || audioUrl.startsWith('blob:') ? audioUrl : audioUrl;
          await audioRef.current.play();
          return;
        } catch {
          /* fall through to TTS */
        }
      }
      setBusy(true);
      try {
        // Pace is decided by speakVocabEntry, which keys it off the language it
        // actually resolves. Deciding it here meant guessing from `forceLang`,
        // so a button without one read Japanese at the English pace.
        await speakVocabEntry({ term: text, reading: reading ?? undefined }, { forceLang, rate });
      } finally {
        setBusy(false);
      }
    },
    [audioUrl, text, reading, forceLang, rate],
  );

  return (
    <button
      type="button"
      onClick={play}
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-neon-violet transition hover:bg-neon-violet/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet/50 ${className}`}
    >
      {busy ? <Loader2 size={size} className="animate-spin" /> : <Volume2 size={size} />}
    </button>
  );
}

export { detectVocabLang };

// ─── Status pill ─────────────────────────────────────────────────
const STATUS_STYLE: Record<LangLearnStatus, { label: string; cls: string }> = {
  NEW: { label: 'Mới', cls: 'bg-[var(--bg-surface)] text-text-muted ring-1 ring-[var(--border-color)]' },
  LEARNING: { label: 'Đang học', cls: 'bg-neon-orange/15 text-neon-orange ring-1 ring-neon-orange/30' },
  REVIEWING: { label: 'Ôn tập', cls: 'bg-neon-cyan/15 text-neon-cyan ring-1 ring-neon-cyan/30' },
  MASTERED: { label: 'Thành thạo', cls: 'bg-neon-green/15 text-neon-green ring-1 ring-neon-green/30' },
};
export function StatusPill({ status, onClick }: { status: LangLearnStatus; onClick?: () => void }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.NEW;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${s.cls} ${onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
    >
      {s.label}
    </button>
  );
}

// ─── Segmented control (List / Flashcards / Quiz etc.) ───────────
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  idBase = 'seg',
}: {
  options: { value: T; label: string; icon?: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  idBase?: string;
}) {
  return (
    <div role="tablist" className="inline-flex rounded-full bg-[var(--bg-surface)] p-1 ring-1 ring-[var(--border-color)]">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className="relative rounded-full px-2.5 py-2.5 text-sm font-medium transition sm:px-3.5 sm:py-1.5"
          >
            {active && (
              <motion.span
                layoutId={`${idBase}-indicator`}
                className="absolute inset-0 rounded-full bg-neon-violet/20 ring-1 ring-neon-violet/40"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className={`relative z-10 inline-flex items-center gap-1.5 ${active ? 'text-neon-violet' : 'text-text-muted'}`}>
              {o.icon}
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Chip (category / level filters) ─────────────────────────────
export function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-2.5 text-sm font-medium transition sm:py-1.5 ${
        active
          ? 'bg-neon-violet/20 text-neon-violet ring-1 ring-neon-violet/40'
          : 'bg-[var(--bg-surface)] text-text-secondary ring-1 ring-[var(--border-color)] hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );
}

// ─── Breadcrumb ──────────────────────────────────────────────────
export function Breadcrumb({ code, section }: { code: string; section?: string }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-text-muted" aria-label="Breadcrumb">
      <Link href="/language" className="hover:text-neon-violet">
        My Language
      </Link>
      <ChevronRight size={14} />
      <Link href={`/language/${code}`} className="uppercase hover:text-neon-violet">
        {code}
      </Link>
      {section && (
        <>
          <ChevronRight size={14} />
          <span className="text-text-secondary">{section}</span>
        </>
      )}
    </nav>
  );
}

// ─── Back button ─────────────────────────────────────────────────
/** Go back one step. Falls back to the language home when there is no history
 *  to pop — a page opened from a shared link or a fresh tab has none, and
 *  router.back() there either leaves the site or does nothing at all. */
export function BackButton({ code, className = '' }: { code?: string; className?: string }) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  useEffect(() => {
    setCanGoBack(typeof window !== 'undefined' && window.history.length > 1);
  }, []);

  const go = useCallback(() => {
    if (canGoBack) router.back();
    else router.push(code ? `/language/${code}` : '/language');
  }, [canGoBack, router, code]);

  return (
    <button
      type="button"
      onClick={go}
      aria-label="Quay lại trang trước"
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-muted transition hover:bg-[var(--bg-surface)] hover:text-neon-violet active:scale-95 ${className}`}
    >
      <ArrowLeft size={20} />
    </button>
  );
}

// ─── Section shell (header + breadcrumb) ─────────────────────────
export function SectionShell({
  code,
  title,
  icon,
  section,
  right,
  children,
}: {
  code: string;
  title: string;
  icon?: React.ReactNode;
  section?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    // pt only has to clear the nav's 4rem: this is in-flow content, and
    // .app-main already adds the notch inset for everything inside it. Reading
    // --app-nav-h here would count the inset twice.
    <div className="mx-auto max-w-5xl px-3 pb-8 pt-20 sm:px-5 sm:pt-24">
      <div className="flex items-center gap-2">
        <BackButton code={code} className="-ml-2" />
        <Breadcrumb code={code} section={section ?? title} />
      </div>
      <div className="mt-3 mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2.5 font-heading text-2xl font-bold text-text-primary sm:text-3xl">
          {icon}
          {title}
        </h1>
        {right}
      </div>
      {children}
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────
export function EmptyState({ emoji = '🌱', title, hint }: { emoji?: string; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-color)] py-16 text-center">
      <div className="mb-3 text-5xl">{emoji}</div>
      <p className="font-medium text-text-secondary">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-text-muted">{hint}</p>}
    </div>
  );
}

// ─── Loading grid ────────────────────────────────────────────────
export function CardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-[var(--bg-surface)]" />
      ))}
    </div>
  );
}

// ─── Progress ring (SVG) ─────────────────────────────────────────
export function ProgressRing({ value, size = 56, stroke = 6, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const dash = (pct / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-color)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#lang-ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
        <defs>
          <linearGradient id="lang-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-[11px] font-bold text-text-primary">{label ?? `${Math.round(pct)}%`}</span>
    </div>
  );
}
