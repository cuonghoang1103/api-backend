'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, Map as MapIcon, Sparkles } from 'lucide-react';
import { roadmapApi, type RoadmapListItemT } from '@/lib/api';
import { roadmapIcon } from './icons';

function RoadmapCard({ r, index }: { r: RoadmapListItemT; index: number }) {
  const Icon = roadmapIcon(r.icon);
  const color = r.color || 'var(--accent-color, #6366f1)';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link
        href={`/roadmap/${r.slug}`}
        className="group flex h-full flex-col rounded-2xl border p-4 transition-all hover:-translate-y-1 hover:shadow-lg"
        style={{ borderColor: 'var(--border-color, rgba(127,127,127,0.2))', background: 'var(--bg-secondary, rgba(127,127,127,0.04))' }}
      >
        <div className="mb-3 flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ background: `${color}22`, color }}
          >
            <Icon size={22} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-semibold" style={{ color: 'var(--text-primary)' }}>{r.title}</h3>
            <span className="text-xs" style={{ color: 'var(--text-secondary, #888)' }}>{r.nodeCount} bước</span>
          </div>
        </div>
        {r.description && (
          <p className="line-clamp-2 flex-1 text-sm" style={{ color: 'var(--text-secondary, #888)' }}>{r.description}</p>
        )}
        <span
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium transition group-hover:gap-2"
          style={{ color }}
        >
          Xem lộ trình <ArrowRight size={15} />
        </span>
      </Link>
    </motion.div>
  );
}

function Section({ title, subtitle, items }: { title: string; subtitle: string; items: RoadmapListItemT[] }) {
  if (!items.length) return null;
  return (
    <section className="mb-10">
      <div className="mb-4">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary, #888)' }}>{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((r, i) => <RoadmapCard key={r.slug} r={r} index={i} />)}
      </div>
    </section>
  );
}

export default function RoadmapLanding() {
  const [role, setRole] = useState<RoadmapListItemT[]>([]);
  const [skill, setSkill] = useState<RoadmapListItemT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    roadmapApi
      .list()
      .then((res) => {
        if (!alive) return;
        const d = res.data.data;
        setRole(d?.role ?? []);
        setSkill(d?.skill ?? []);
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-20">
      <header className="mb-10 text-center">
        <span
          className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
          style={{ background: 'var(--accent-color, #6366f1)22', color: 'var(--accent-color, #6366f1)' }}
        >
          <Sparkles size={13} /> Lộ trình học
        </span>
        <h1 className="flex items-center justify-center gap-2 text-3xl font-extrabold sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
          <MapIcon className="hidden sm:block" style={{ color: 'var(--accent-color)' }} /> RoadMap
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base" style={{ color: 'var(--text-secondary, #888)' }}>
          Lộ trình học từng bước theo vai trò và kỹ năng — bấm từng chặng để xem chi tiết, đánh dấu hoàn thành và học ngay trong Code Lab.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="animate-spin" style={{ color: 'var(--accent-color)' }} /></div>
      ) : role.length + skill.length === 0 ? (
        <p className="py-24 text-center text-sm" style={{ color: 'var(--text-secondary, #888)' }}>Chưa có lộ trình nào.</p>
      ) : (
        <>
          <Section title="Theo vai trò" subtitle="Bạn muốn trở thành gì? (Role-based)" items={role} />
          <Section title="Theo kỹ năng" subtitle="Học sâu một công nghệ (Skill-based)" items={skill} />
        </>
      )}
    </div>
  );
}
