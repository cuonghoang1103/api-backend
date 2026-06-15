'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Hash,
  MessageCircle,
  Sparkles,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

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
 * Right rail of the 3-column social layout. Hosts three widgets:
 * 1. AI Assistant shortcut — mirrors the floating assistant and
 *    helps users discover the feature without scrolling to the
 *    bottom-right.
 * 2. Trending topics — pulled from GET /api/v1/social/trending
 *    (best-effort; falls back to a curated list if the endpoint
 *    isn't reachable so the layout never collapses).
 * 3. Suggested connections — a lightweight "people to follow"
 *    panel. The data comes from a lightweight /api/v1/social/suggestions
 *    call; on failure we just show a small note.
 */
export default function SocialRightWidget() {
  const [trending, setTrending] = useState<TrendingTopic[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [t, s] = await Promise.allSettled([
          api.get('/social/trending', { params: { limit: 5 } }),
          api.get('/social/suggestions', { params: { limit: 3 } }),
        ]);
        if (cancelled) return;
        if (t.status === 'fulfilled') {
          setTrending((t.value.data?.data as TrendingTopic[]) || []);
        }
        if (s.status === 'fulfilled') {
          setSuggestions((s.value.data?.data as SuggestedUser[]) || []);
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <aside className="sticky top-20 self-start w-full space-y-4">
      {/* AI Assistant shortcut */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.08))',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)' }}>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">AI Assistant</p>
            <p className="text-xs text-text-muted">Trợ lý thông minh 24/7</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-text-secondary leading-relaxed">
          Hỏi bất cứ điều gì về code, project, hoặc nội dung trên trang.
        </p>
        <Link
          href="/chat"
          className="mt-3 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(90deg, #8B5CF6, #6366F1)' }}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Mở chat ngay
        </Link>
      </div>

      {/* Trending topics */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-neon-cyan" />
            <h3 className="text-sm font-semibold text-text-primary">Xu hướng</h3>
          </div>
          <Flame className="h-3.5 w-3.5 text-neon-fuchsia" />
        </div>

        {!loaded ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : trending.length > 0 ? (
          <ul className="space-y-1">
            {trending.map((t, idx) => (
              <li key={t.id}>
                <Link
                  href={`/social/search?q=%23${encodeURIComponent(t.tag)}`}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-white/[0.04] transition-colors group"
                >
                  <span className="text-text-muted font-mono w-5 text-right">{idx + 1}.</span>
                  <Hash className="h-3 w-3 text-text-muted" />
                  <span className="text-text-secondary group-hover:text-text-primary truncate">{t.tag}</span>
                  <span className="ml-auto text-text-muted">{t.postsCount}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-text-muted">
            Chưa có chủ đề thịnh hành. Hãy đăng bài với hashtag để tạo xu hướng!
          </p>
        )}
      </div>

      {/* Suggested connections */}
      {loaded && suggestions.length > 0 && (
        <div
          className="rounded-2xl p-4"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <h3 className="text-sm font-semibold text-text-primary mb-3">Gợi ý kết nối</h3>
          <ul className="space-y-3">
            {suggestions.map((u) => (
              <li key={u.id} className="flex items-center gap-2.5">
                {u.avatarUrl ? (
                  <img src={u.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center text-xs font-bold text-white">
                    {(u.displayName || u.fullName || u.username).charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">
                    {u.displayName || u.fullName || u.username}
                  </p>
                  <p className="text-[10px] text-text-muted truncate">@{u.username}</p>
                </div>
                <Link
                  href={`/profile/${u.id}`}
                  className="rounded-lg px-2.5 py-1 text-[10px] font-medium text-text-secondary hover:text-text-primary border border-white/[0.08] hover:border-white/[0.2] transition-colors flex items-center gap-1"
                >
                  Xem
                  <ExternalLink className="h-2.5 w-2.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[10px] text-text-muted text-center px-2">
        © CuongHoangDev · Social feed
      </p>
    </aside>
  );
}
