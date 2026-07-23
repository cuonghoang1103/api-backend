'use client';

/**
 * "What's new" — the modules added most recently: Code Lab, RoadMap, the
 * Algorithm Visualizer, Exp Hub and the AI news bulletin.
 *
 * Deliberately NOT another row in FeatureMarquee: that strip is driven by
 * admin-uploaded promo clips, so a feature without a clip shows an empty frame,
 * and a brand-new module is exactly the case where no clip exists yet. This
 * section carries its own weight instead — each card shows something true and
 * current (live track/roadmap counts, today's headline), which is both better
 * proof that the feature is alive and better copy than an adjective.
 *
 * Every fetch degrades to a static line rather than an error or a skeleton that
 * never resolves: a landing page must render fully even when the API is down.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpenText, Layers, Newspaper, Map as MapIcon, Binary } from 'lucide-react';

interface Live {
  tracks: number | null;
  roadmaps: number | null;
  headline: string | null;
  headlineSlug: string | null;
  headlineAt: string | null;
}

function timeAgo(iso: string | null): string | null {
  if (!iso) return null;
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export default function NewModulesSection() {
  const [live, setLive] = useState<Live>({
    tracks: null, roadmaps: null, headline: null, headlineSlug: null, headlineAt: null,
  });

  useEffect(() => {
    let alive = true;
    const base = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

    // Independent reads: one failing must not blank the other cards.
    fetch(`${base}/code-lab/groups`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!alive || !j) return;
        const groups = j.data ?? j;
        if (!Array.isArray(groups)) return;
        const tracks = groups.reduce(
          (n: number, g: { tracks?: unknown[] }) => n + (g.tracks?.length ?? 0), 0,
        );
        if (tracks > 0) setLive((s) => ({ ...s, tracks }));
      })
      .catch(() => undefined);

    fetch(`${base}/roadmap`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!alive || !j) return;
        const d = j.data ?? j;
        const count = (d?.role?.length ?? 0) + (d?.skill?.length ?? 0);
        if (count > 0) setLive((s) => ({ ...s, roadmaps: count }));
      })
      .catch(() => undefined);

    fetch(`${base}/tech-trends/articles?kind=NEWS&size=1`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!alive || !j?.data?.length) return;
        const a = j.data[0];
        setLive((s) => ({
          ...s, headline: a.title, headlineSlug: a.slug, headlineAt: a.publishedAt ?? a.createdAt,
        }));
      })
      .catch(() => undefined);

    return () => { alive = false; };
  }, []);

  const cards = [
    {
      key: 'code-lab',
      href: '/code-lab',
      icon: BookOpenText,
      accent: '#8b5cf6',
      eyebrow: 'Learn by building',
      title: 'Code Lab',
      body:
        'Zero-to-advanced tracks for every language and framework: a chapter-length bilingual lesson, then exercises you solve in the editor — each with an official solution you can check yourself against.',
      stat: live.tracks ? `${live.tracks} tracks · lessons + graded exercises` : 'Java · Python · SQL · React · Docker · Node.js',
    },
    {
      key: 'roadmap',
      href: '/roadmap',
      icon: MapIcon,
      accent: '#6366f1',
      eyebrow: 'Know what to learn next',
      title: 'RoadMap',
      body:
        'Step-by-step learning paths by role and skill. Follow a track from beginner to job-ready, mark your progress, and jump straight into the matching Code Lab lesson.',
      stat: live.roadmaps ? `${live.roadmaps} guided paths · role & skill` : 'Frontend · Backend · DevOps · Python · React · DSA',
    },
    {
      key: 'algorithms',
      href: '/algorithms',
      icon: Binary,
      accent: '#10b981',
      eyebrow: 'See it run',
      title: 'Algorithm Visualizer',
      body:
        'Watch sorting, searching and graph algorithms step through their state in real time, with the code running beside the animation — the fastest way to actually understand how they work.',
      stat: 'Sorting · searching · graphs · Monaco editor',
    },
    {
      key: 'exp-hub',
      href: '/exp-hub',
      icon: Layers,
      accent: '#06b6d4',
      eyebrow: 'Look it up fast',
      title: 'Exp Hub',
      body:
        'Snippets and reference docs per technology. Search a keyword, get the syntax and a runnable example — instead of ten Stack Overflow tabs.',
      stat: 'Snippets · notes · reference docs',
    },
    {
      key: 'news',
      href: '/tech-trends/news',
      icon: Newspaper,
      accent: '#f59e0b',
      eyebrow: 'Every morning',
      title: 'Tech Bulletin',
      body:
        'The day\'s official announcements from the engineering blogs of GitHub, Vercel, OpenAI, AWS and 50 more. Every item links straight to the source so you can check it yourself.',
      stat: live.headline
        ? `${timeAgo(live.headlineAt) ?? 'New'} — ${live.headline}`
        : 'A new bulletin every morning at 07:30',
    },
  ];

  return (
    <section className="relative z-10 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Just shipped
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            The newest ways to learn
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Build a skill, chart your path, watch an algorithm run, look something up, keep up with what changed — all open, no account needed.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.07, 0.35) }}
              >
                <Link
                  href={c.href}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
                  style={{ boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.04)` }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${c.accent}1f`, color: c.accent }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-slate-600 transition-colors group-hover:text-white" />
                  </div>

                  <p className="mt-5 text-xs font-medium uppercase tracking-widest" style={{ color: c.accent }}>
                    {c.eyebrow}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-white">{c.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{c.body}</p>

                  {/* The live line. `min-w-0` + line-clamp keeps a long headline
                      inside the card instead of stretching the grid column. */}
                  <div className="mt-5 min-w-0 border-t border-white/10 pt-4">
                    <p className="line-clamp-2 text-xs text-slate-500">{c.stat}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
