'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Loader2, ArrowRight, Map as MapIcon, Sparkles, Layers } from 'lucide-react';
import { roadmapApi, type RoadmapListItemT } from '@/lib/api';
import { roadmapIcon } from './icons';

const EASE = [0.16, 1, 0.3, 1] as const;

// Roadmap is English-first with a per-visitor EN/VI toggle (persisted in
// localStorage). Only the static UI chrome is translated here; the roadmap
// titles/descriptions come from the API as data.
type Lang = 'en' | 'vi';
const T = {
  en: {
    badge: 'Learning paths',
    heroLead:
      'Step-by-step learning paths by ',
    heroRole: 'role',
    heroAnd: ' and ',
    heroSkill: 'skill',
    heroTail: ' — click any stage to see details, track your progress, and learn right inside Code Lab.',
    roleBadge: 'Role-based',
    roleTitle: 'By role',
    roleSubtitle: 'What do you want to become?',
    skillBadge: 'Skill-based',
    skillTitle: 'By skill',
    skillSubtitle: 'Go deep on one technology',
    steps: 'steps',
    view: 'View roadmap',
    empty: 'No roadmaps yet.',
  },
  vi: {
    badge: 'Lộ trình học',
    heroLead: 'Lộ trình học từng bước theo ',
    heroRole: 'vai trò',
    heroAnd: ' và ',
    heroSkill: 'kỹ năng',
    heroTail: ' — bấm từng chặng để xem chi tiết, đánh dấu tiến độ và học ngay trong Code Lab.',
    roleBadge: 'Theo vai trò',
    roleTitle: 'Theo vai trò',
    roleSubtitle: 'Bạn muốn trở thành gì?',
    skillBadge: 'Theo kỹ năng',
    skillTitle: 'Theo kỹ năng',
    skillSubtitle: 'Học sâu một công nghệ',
    steps: 'bước',
    view: 'Xem lộ trình',
    empty: 'Chưa có lộ trình nào.',
  },
} as const;

function RoadmapCard({ r, index, t }: { r: RoadmapListItemT; index: number; t: (typeof T)[Lang] }) {
  const reduce = useReducedMotion();
  const Icon = roadmapIcon(r.icon);
  const color = r.color || 'var(--accent-color, #6366f1)';
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ ease: EASE, duration: 0.45, delay: Math.min(index * 0.035, 0.3) }}
    >
      <Link
        href={`/roadmap/${r.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 backdrop-blur-sm transition-all hover:-translate-y-1.5 hover:shadow-2xl"
        style={{ borderColor: 'var(--border-color, rgba(127,127,127,0.16))', background: 'var(--bg-secondary, rgba(127,127,127,0.04))' }}
      >
        {/* corner glow on hover */}
        <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40" style={{ background: color }} />
        <div className="relative mb-3.5 flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md" style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}>
            <Icon size={24} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold" style={{ color: 'var(--text-primary)' }}>{r.title}</h3>
            <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary, #888)' }}>
              <Layers size={11} /> {r.nodeCount} {t.steps}
            </span>
          </div>
        </div>
        {r.description && (
          <p className="relative line-clamp-2 flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary, #888)' }}>{r.description}</p>
        )}
        <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2" style={{ color }}>
          {t.view} <ArrowRight size={15} />
        </span>
        {/* bottom accent bar */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      </Link>
    </motion.div>
  );
}

function Section({ title, subtitle, badge, items, t }: { title: string; subtitle: string; badge: string; items: RoadmapListItemT[]; t: (typeof T)[Lang] }) {
  if (!items.length) return null;
  return (
    <section className="mb-12">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <span className="mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide" style={{ background: 'var(--surface-3, rgba(127,127,127,0.12))', color: 'var(--text-secondary, #888)' }}>{badge}</span>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary, #888)' }}>{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((r, i) => <RoadmapCard key={r.slug} r={r} index={i} t={t} />)}
      </div>
    </section>
  );
}

// EN | VI segmented toggle
function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full border p-0.5 text-xs font-semibold"
      style={{ borderColor: 'var(--border-color, rgba(127,127,127,0.18))', background: 'var(--bg-secondary, rgba(127,127,127,0.05))' }}
      role="group"
      aria-label="Language"
    >
      {(['en', 'vi'] as const).map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => onChange(l)}
            aria-pressed={active}
            className="rounded-full px-3 py-1 transition-colors"
            style={
              active
                ? { background: 'var(--accent-color, #6366f1)', color: '#fff' }
                : { color: 'var(--text-secondary, #888)' }
            }
          >
            {l === 'en' ? 'EN' : 'VI'}
          </button>
        );
      })}
    </div>
  );
}

export default function RoadmapLanding() {
  const reduce = useReducedMotion();
  const [role, setRole] = useState<RoadmapListItemT[]>([]);
  const [skill, setSkill] = useState<RoadmapListItemT[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Lang>('en'); // English-first default

  // Restore the visitor's last choice (default stays English).
  useEffect(() => {
    try {
      const saved = localStorage.getItem('roadmap-lang');
      if (saved === 'en' || saved === 'vi') setLang(saved);
    } catch { /* ignore */ }
  }, []);

  const changeLang = (l: Lang) => {
    setLang(l);
    try { localStorage.setItem('roadmap-lang', l); } catch { /* ignore */ }
  };

  useEffect(() => {
    let alive = true;
    roadmapApi.list()
      .then((res) => { if (!alive) return; const d = res.data.data; setRole(d?.role ?? []); setSkill(d?.skill ?? []); })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const t = T[lang];
  const totalCount = role.length + skill.length;

  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20">
      {/* ambient hero glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-80 max-w-3xl rounded-full opacity-[0.16] blur-[100px]" style={{ background: 'var(--accent-color, #6366f1)' }} />

      <motion.header initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: EASE, duration: 0.5 }} className="mb-12 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" style={{ background: 'var(--accent-color, #6366f1)1f', color: 'var(--accent-color, #6366f1)' }}>
            <Sparkles size={13} /> {t.badge}
          </span>
          <LangToggle lang={lang} onChange={changeLang} />
        </div>
        <h1 className="flex items-center justify-center gap-2.5 text-4xl font-extrabold tracking-tight sm:text-5xl">
          <MapIcon className="hidden sm:block" size={38} style={{ color: 'var(--accent-color)' }} />
          <span style={{ backgroundImage: 'linear-gradient(120deg, var(--text-primary), var(--accent-color, #6366f1))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>RoadMap</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: 'var(--text-secondary, #888)' }}>
          {t.heroLead}<strong>{t.heroRole}</strong>{t.heroAnd}<strong>{t.heroSkill}</strong>{t.heroTail}
        </p>
      </motion.header>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="animate-spin" style={{ color: 'var(--accent-color)' }} /></div>
      ) : totalCount === 0 ? (
        <p className="py-24 text-center text-sm" style={{ color: 'var(--text-secondary, #888)' }}>{t.empty}</p>
      ) : (
        <>
          <Section badge={t.roleBadge} title={t.roleTitle} subtitle={t.roleSubtitle} items={role} t={t} />
          <Section badge={t.skillBadge} title={t.skillTitle} subtitle={t.skillSubtitle} items={skill} t={t} />
        </>
      )}
    </div>
  );
}
