'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Hash,
  MessageCircle,
  Sparkles,
  ExternalLink,
  Flame,
  MessageSquare,
  X,
} from 'lucide-react';
import { Component, type ReactNode, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useMessagingStore } from '@/store/messagingStore';
import toast from 'react-hot-toast';

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

class SocialRightWidgetErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
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
function SocialRightWidgetInner() {
  const router = useRouter();
  const auth = useAuthStore();
  const [trending, setTrending] = useState<TrendingTopic[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);

  const handleHashtagClick = (tag: string) => {
    const next = activeHashtag === tag ? null : tag;
    setActiveHashtag(next);
    // Notify the feed page to filter by this hashtag.
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('social:filter-hashtag', { detail: { hashtag: next } }),
      );
    }
  };
  // Per-user "starting conversation" state so the button on one
  // row can show a spinner without freezing the others.
  const [starting, setStarting] = useState<Record<number, boolean>>({});

  /**
   * Open a DM thread with a suggested user.
   *
   * Flow:
   *  1. If the viewer is not signed in, bounce to /login with a
   *     `next` param that takes them straight into /messages
   *     pre-opened on the right thread.
   *  2. Otherwise ask the backend to (idempotently) create the
   *     thread and store the id on the messaging store, then
   *     navigate to /messages?peer=<id> so the page can
   *     select it on mount.
   *
   * The navigate step runs even if the API call fails — same
   * pattern as MessageButton on the profile page — so the user
   * always lands somewhere useful. Errors surface as toasts.
   */
  const handleMessage = async (userId: number) => {
    if (starting[userId]) return;
    if (!auth.isAuthenticated) {
      router.push(`/login?next=/messages?peer=${userId}`);
      return;
    }
    setStarting((s) => ({ ...s, [userId]: true }));
    try {
      await useMessagingStore.getState().startUserThread(userId);
    } catch (e: any) {
      const msg =
        e?.response?.data?.code === 'MESSAGES_DISABLED'
          ? 'Người dùng này không nhận tin nhắn từ người lạ'
          : e?.userFriendlyMessage ?? e?.message ?? 'Không thể mở cuộc trò chuyện';
      toast.error(msg);
    } finally {
      setStarting((s) => ({ ...s, [userId]: false }));
    }
    // Always navigate so the user lands in /messages even if the
    // pre-create failed (the page retries on mount).
    router.push(`/messages?peer=${userId}`);
  };

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

        {activeHashtag && (
          <div className="mb-2 flex items-center gap-1.5 rounded-lg px-2 py-1" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
            <Hash className="h-3 w-3 text-neon-violet shrink-0" />
            <span className="flex-1 text-xs text-neon-violet font-medium truncate">#{activeHashtag}</span>
            <button
              type="button"
              onClick={() => handleHashtagClick(activeHashtag)}
              className="text-text-muted hover:text-text-primary transition-colors"
              title="Xoá bộ lọc"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        {!loaded ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              // Phase 5 home upgrade: shimmer skeleton instead
              // of the flat animate-pulse. Matches the post
              // loading skeleton for a consistent feel.
              <div key={i} className="shimmer h-9 rounded-lg" />
            ))}
          </div>
        ) : trending.length > 0 ? (
          <ul className="space-y-1">
            {trending.map((t, idx) => {
              const isActive = activeHashtag === t.tag;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => handleHashtagClick(t.tag)}
                    className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors group text-left ${
                      isActive
                        ? 'bg-neon-violet/10 text-neon-violet'
                        : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="text-text-muted font-mono w-5 text-right">{idx + 1}.</span>
                    <Hash className={`h-3 w-3 shrink-0 ${isActive ? 'text-neon-violet' : 'text-text-muted'}`} />
                    <span className={`truncate ${isActive ? 'text-neon-violet font-medium' : 'text-text-secondary group-hover:text-text-primary'}`}>{t.tag}</span>
                    <span className="ml-auto text-text-muted">{t.postsCount}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          // Phase 5 home upgrade: friendlier empty state with a
          // subtle CTA hint.
          <div className="rounded-lg px-2 py-3 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[12px] leading-relaxed" style={{ color: '#64748b' }}>
              Chưa có chủ đề thịnh hành.
            </p>
            <p className="mt-1 text-[11px]" style={{ color: '#475569' }}>
              Đăng bài với <span style={{ color: '#a78bfa' }}>#hashtag</span> để tạo xu hướng.
            </p>
          </div>
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
            {suggestions.map((u) => {
              const isStarting = !!starting[u.id];
              return (
                <li key={u.id} className="flex items-center gap-2.5">
                  <Link
                    href={`/profile/${u.id}`}
                    className="flex flex-1 items-center gap-2.5 min-w-0 rounded-lg px-1 py-1 -mx-1 hover:bg-white/[0.04] transition-colors"
                  >
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center text-xs font-bold text-white">
                        {(u.displayName || u.fullName || u.username || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-primary truncate">
                        {u.displayName || u.fullName || u.username}
                      </p>
                      <p className="text-[10px] text-text-muted truncate">@{u.username}</p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleMessage(u.id)}
                    disabled={isStarting}
                    aria-label={`Nhắn tin với ${u.displayName || u.fullName || u.username}`}
                    className="rounded-lg px-3 py-2.5 sm:px-2.5 sm:py-1 min-h-[44px] sm:min-h-0 text-[10px] font-medium text-white transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-1 shrink-0"
                    style={{ background: 'linear-gradient(90deg, #06B6D4, #6366F1)' }}
                  >
                    <MessageSquare className="h-2.5 w-2.5" />
                    {isStarting ? 'Đang mở…' : 'Nhắn tin'}
                  </button>
                  <Link
                    href={`/profile/${u.id}`}
                    aria-label={`Xem hồ sơ của ${u.displayName || u.fullName || u.username}`}
                    className="rounded-lg px-3 py-2.5 sm:px-2.5 sm:py-1 min-h-[44px] sm:min-h-0 text-[10px] font-medium text-text-secondary hover:text-text-primary border border-white/[0.08] hover:border-white/[0.2] transition-colors flex items-center justify-center gap-1 shrink-0"
                  >
                    Xem
                    <ExternalLink className="h-2.5 w-2.5" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p className="text-[10px] text-text-muted text-center px-2">
        © CuongHoangDev · Social feed
      </p>
    </aside>
  );
}

export default function SocialRightWidget() {
  return (
    <SocialRightWidgetErrorBoundary>
      <SocialRightWidgetInner />
    </SocialRightWidgetErrorBoundary>
  );
}
