'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Hash, ArrowLeft, TrendingUp, Flame, Users } from 'lucide-react';
import { api } from '@/lib/api';
import SocialBackground from '@/components/social/SocialBackground';
import SocialSidebar from '@/components/social/SocialSidebar';
import SocialRightWidget from '@/components/social/SocialRightWidget';

interface TrendingTopic {
  id: number;
  tag: string;
  postsCount: number;
}

interface SuggestedUser {
  id: number;
  username: string;
  displayName?: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
}

/**
 * /social/explore — discovery surface. Shows trending hashtags and
 * suggested users. The same data the right-rail widget uses is
 * surfaced here at a larger size; we re-fetch on mount so the page
 * feels alive.
 */
export default function ExplorePage() {
  const [trending, setTrending] = useState<TrendingTopic[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'trending' | 'people'>('trending');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const [t, s] = await Promise.allSettled([
          api.get('/social/trending', { params: { limit: 20 } }),
          api.get('/social/suggestions', { params: { limit: 12 } }),
        ]);
        if (cancelled) return;
        if (t.status === 'fulfilled') setTrending((t.value.data?.data as TrendingTopic[]) || []);
        if (s.status === 'fulfilled') setSuggestions((s.value.data?.data as SuggestedUser[]) || []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen" style={{ background: '#03020c' }}>
      <SocialBackground />
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 800px 600px at 50% 0%, rgba(139, 92, 246, 0.06) 0%, transparent 70%), radial-gradient(ellipse 600px 400px at 80% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
          <div className="hidden lg:block">
            <SocialSidebar />
          </div>

          <div className="mx-auto w-full max-w-[680px] min-w-0">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-3"
            >
              <Link
                href="/social"
                className="rounded-xl p-2 text-text-secondary transition-colors hover:bg-white/[0.04] hover:text-text-primary"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1
                  className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-3xl font-black tracking-tight text-transparent"
                >
                  Khám phá
                </h1>
                <p className="mt-1 text-xs" style={{ color: '#64748b' }}>
                  Hashtag thịnh hành và gợi ý kết nối
                </p>
              </div>
            </motion.div>

            {/* Tabs */}
            <div
              className="mb-4 flex gap-1 rounded-2xl p-1.5"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {[
                { id: 'trending', label: 'Xu hướng', icon: TrendingUp },
                { id: 'people', label: 'Mọi người', icon: Users },
              ].map((t) => {
                const Icon = t.icon;
                const active = tab === (t.id as any);
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id as any)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                      active
                        ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-14 animate-pulse rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  />
                ))}
              </div>
            ) : tab === 'trending' ? (
              <TrendingList items={trending} />
            ) : (
              <PeopleList items={suggestions} />
            )}
          </div>

          <div className="hidden lg:block">
            <SocialRightWidget />
          </div>
        </div>
      </div>
    </main>
  );
}

function TrendingList({ items }: { items: TrendingTopic[] }) {
  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl py-16 text-center"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Flame className="mb-3 h-10 w-10" style={{ color: '#475569' }} />
        <p className="text-sm" style={{ color: '#94a3b8' }}>
          Chưa có chủ đề thịnh hành
        </p>
        <p className="mt-1 text-xs" style={{ color: '#475569' }}>
          Hãy đăng bài với hashtag để tạo xu hướng!
        </p>
      </div>
    );
  }
  return (
    <ul
      className="overflow-hidden rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {items.map((t, idx) => (
        <li key={t.id}>
          <Link
            href={`/social/search?q=%23${encodeURIComponent(t.tag)}`}
            className="flex items-center gap-3 border-b border-white/[0.04] px-4 py-3 transition-colors hover:bg-white/[0.04] last:border-0"
          >
            <span className="w-6 text-right text-xs" style={{ color: '#475569' }}>
              {idx + 1}
            </span>
            <Hash className="h-4 w-4" style={{ color: '#22d3ee' }} />
            <span className="flex-1 text-sm font-medium text-text-primary truncate">
              {t.tag}
            </span>
            <span className="text-xs" style={{ color: '#64748b' }}>
              {t.postsCount} bài
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function PeopleList({ items }: { items: SuggestedUser[] }) {
  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl py-16 text-center"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Users className="mb-3 h-10 w-10" style={{ color: '#475569' }} />
        <p className="text-sm" style={{ color: '#94a3b8' }}>
          Chưa có gợi ý kết nối
        </p>
      </div>
    );
  }
  return (
    <ul
      className="overflow-hidden rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {items.map((u) => (
        <li key={u.id}>
          <Link
            href={`/profile/${u.id}`}
            className="flex items-center gap-3 border-b border-white/[0.04] px-4 py-3 transition-colors hover:bg-white/[0.04] last:border-0"
          >
            {u.avatarUrl ? (
              <img src={u.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-neon-indigo to-neon-violet text-sm font-bold text-white">
                {(u.displayName || u.fullName || u.username).charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">
                {u.displayName || u.fullName || u.username}
              </p>
              <p className="truncate text-xs" style={{ color: '#64748b' }}>
                @{u.username}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
