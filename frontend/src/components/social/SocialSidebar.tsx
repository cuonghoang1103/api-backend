'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  MessageCircle,
  User as UserIcon,
  Sparkles,
  Users,
  Music,
  Code2,
  Bookmark,
  BookmarkCheck,
  Plus,
  Loader2,
  UserPlus,
  UserCheck,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { socialApi } from '@/lib/api';
import { socialUserApi } from '@/lib/api';
import type { FeedCollection } from '@/types/social';
import SafeAvatar from '@/components/ui/SafeAvatar';

interface SocialSidebarProps {
  unreadNotifications?: number;
  unreadMessages?: number;
}

/** Fetches the user's collection list. Stale for 30s so the
 *  sidebar always shows fresh counts without hammering the API. */
function useCollections() {
  return useQuery({
    queryKey: ['sidebar-collections'] as const,
    queryFn: () =>
      socialApi
        .listCollectionsV2()
        .then((r: any) => r.data.data as {
          collections: FeedCollection[];
          uncategorized: number;
          total: number;
        }),
    staleTime: 30_000,
    retry: false,
    enabled: typeof window !== 'undefined',
  });
}

/**
 * Left navigation column of the 3-column social layout.
 * Compact icon-only on the rail; expands to icon+label on hover
 * (or always-expanded on >=lg screens). Active route is highlighted
 * with the violet accent so users can see where they are at a glance.
 *
 * Items here mirror the top-level destination of the social app.
 * They are decorative; the real navigation happens in the right
 * Navbar. We keep this rail small and consistent so the centre
 * column (the feed) keeps the visual focus.
 */
export default function SocialSidebar({
  unreadNotifications = 0,
  unreadMessages = 0,
}: SocialSidebarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isAdmin = mounted && (user as any)?.roles?.some((r: string) =>
    ['admin', 'ADMIN', 'ROLE_ADMIN', 'SUPER_ADMIN'].includes(r)
  );

  const items = [
    { href: '/', label: 'Home', icon: Home, exact: true },
    { href: '/messages', label: 'Messages', icon: MessageCircle, badge: unreadMessages },
    { href: '/about', label: 'About', icon: UserIcon },
  ];

  const explore = [
    { href: '/blog', label: 'Blog', icon: Sparkles },
    { href: '/projects', label: 'Projects', icon: Code2 },
    { href: '/music', label: 'Music', icon: Music },
  ];

  return (
    <aside className="sticky top-20 self-start w-full">
      <div className="space-y-1">
        {items.map((it) => {
          const active = it.exact ? pathname === it.href : pathname?.startsWith(it.href);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active ? 'bg-white/[0.06] text-text-primary' : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="social-sidebar-active"
                  className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-gradient-to-b from-neon-violet to-neon-indigo"
                />
              )}
              <span className="relative">
                <Icon className="h-5 w-5" />
                {typeof it.badge === 'number' && it.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-1 rounded-full text-[10px] font-bold text-white bg-neon-fuchsia flex items-center justify-center">
                    {it.badge > 99 ? '99+' : it.badge}
                  </span>
                )}
              </span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>

      {/* ── Saved Collections ─────────────────────────────────── */}
      <CollectionsSection />

      {/* ── Online Users / Suggestions ─────────────────────────── */}
      <FriendsSection />

      <div className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
        Khám phá
      </div>
      <div className="mt-2 space-y-1">
        {explore.map((it) => {
          const active = pathname?.startsWith(it.href);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all ${
                active ? 'bg-white/[0.06] text-text-primary' : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>

      {mounted && isAdmin && (
        <>
          <div className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
            Quản trị
          </div>
          <div className="mt-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-yellow-400/80 hover:bg-yellow-500/10 hover:text-yellow-300 transition-all"
            >
              <Users className="h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </>
      )}
    </aside>
  );
}

// ─── CollectionsSection ─────────────────────────────────────────────
// Lives inside the sidebar. Shows "Đã lưu" link + the user's
// collection folders. Inline create so they never need to leave
// the feed to make a new folder. Only shown to logged-in users.

function CollectionsSection() {
  const pathname = usePathname();
  const qc = useQueryClient();
  const collectionsQuery = useCollections();
  const collections = collectionsQuery.data?.collections ?? [];
  const uncategorized = collectionsQuery.data?.uncategorized ?? 0;
  const total = collectionsQuery.data?.total ?? 0;
  const [showAll, setShowAll] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  // Active = on the saved page or any collection sub-page.
  const isActive = pathname?.startsWith('/saved');

  const createCollection = async () => {
    const name = newName.trim();
    if (!name || creating) return;
    setCreating(true);
    try {
      await socialApi.createCollectionV2(name);
      qc.invalidateQueries({ queryKey: ['sidebar-collections'] });
      setNewName('');
    } catch (err: any) {
      // ignore
    } finally {
      setCreating(false);
    }
  };

  const visible = showAll ? collections : collections.slice(0, 4);
  const hasMore = collections.length > 4;

  return (
    <>
      {/* Section header */}
      <div className="mt-4 px-3">
        <Link
          href="/saved"
          className={`group relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
            isActive
              ? 'bg-white/[0.06] text-text-primary'
              : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
          }`}
        >
          {total > 0 ? (
            <BookmarkCheck size={18} style={{ color: '#f59e0b' }} />
          ) : (
            <Bookmark size={18} className="text-text-muted" />
          )}
          <span className="flex-1">Đã lưu</span>
          {total > 0 && (
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] tabular-nums"
              style={{ background: 'rgba(245,158,11,0.2)', color: '#fcd34d' }}
            >
              {total > 99 ? '99+' : total}
            </span>
          )}
          {isActive && (
            <motion.span
              layoutId="social-sidebar-active"
              className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-gradient-to-b from-neon-violet to-neon-indigo"
            />
          )}
        </Link>
      </div>

      {/* Collection folders */}
      {collections.length > 0 && (
        <div className="mt-1 px-3">
          <div className="space-y-0.5">
            {/* Uncategorised bucket */}
            {uncategorized > 0 && (
              <Link
                href="/saved?tab=uncategorized"
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                  pathname === '/saved' ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <span className="text-[13px]">📥</span>
                <span className="flex-1 truncate">Chưa phân loại</span>
                <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] tabular-nums">
                  {uncategorized}
                </span>
              </Link>
            )}
            {visible.map((c) => (
              <Link
                key={c.id}
                href={`/saved?tab=${c.id}`}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                  pathname === '/saved' ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <span className="text-[13px]">{c.icon ?? '📁'}</span>
                <span className="flex-1 truncate">{c.name}</span>
                <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] tabular-nums">
                  {c.count}
                </span>
              </Link>
            ))}
          </div>

          {hasMore && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-1 w-full rounded-lg py-1 text-[10px] text-text-muted hover:text-text-secondary transition-colors"
            >
              +{collections.length - 4} thêm...
            </button>
          )}

          {/* Collapse */}
          {showAll && (
            <button
              onClick={() => setShowAll(false)}
              className="mt-1 w-full rounded-lg py-1 text-[10px] text-text-muted hover:text-text-secondary transition-colors"
            >
              Thu gọn
            </button>
          )}
        </div>
      )}

      {/* Inline create */}
      <div className="mt-2 px-3">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); void createCollection(); }
            }}
            maxLength={80}
            placeholder="+ Tạo bộ sưu tập mới"
            className="flex-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 text-xs text-text-primary outline-none placeholder:text-text-muted/60 transition-colors focus:border-amber-400/40"
          />
          {newName.trim() && (
            <button
              onClick={() => void createCollection()}
              disabled={creating}
              className="flex h-6 w-6 items-center justify-center rounded-md transition-colors disabled:opacity-40"
              style={{ background: 'rgba(245,158,11,0.2)', color: '#fcd34d' }}
              title="Tạo"
            >
              {creating ? <Loader2 size={10} className="animate-spin" /> : <Plus size={10} />}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Online Users / Suggestions Section ───────────────────────
// Shows suggested users with their online status and a quick-follow
// button. Appears in the left navigation sidebar of the social feed.

interface SuggestedUser {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  isOnline: boolean;
  followedAt: Date;
}

function FriendsSection() {
  const { user } = useAuthStore();
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [followingIds, setFollowingIds] = useState<ReadonlySet<number>>(new Set<number>());

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    socialUserApi.getSuggestions(10)
      .then((r: any) => setSuggestedUsers(r.data?.data ?? []))
      .catch(() => {/* ignore */})
      .finally(() => setLoading(false));
  }, [user]);

  const handleFollow = async (targetId: number) => {
    try {
      const res = await socialUserApi.toggleFollow(targetId);
      const data = res.data?.data;
      if (data?.isFollowing) {
        setFollowingIds(prev => new Set([...Array.from(prev), targetId]));
        setSuggestedUsers(prev => prev.filter(u => u.id !== targetId));
      }
    } catch { /* ignore */ }
  };

  if (!user) return null;

  return (
    <div className="mt-4">
      <div className="px-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
        Bạn bè
      </div>
      <div className="mt-2 space-y-1 max-h-[260px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {loading ? (
          <div className="px-3 py-3 text-center">
            <Loader2 size={14} className="animate-spin mx-auto text-text-muted" />
          </div>
        ) : suggestedUsers.length === 0 ? null : (
          suggestedUsers.map(u => {
            const isFollowing = followingIds.has(u.id);
            const displayName = u.displayName || u.username;
            return (
              <Link
                key={u.id}
                href={`/profile/${u.id}`}
                className="group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-all hover:bg-white/[0.04]"
              >
                <div className="relative shrink-0">
                  <SafeAvatar
                    src={u.avatarUrl}
                    alt={displayName}
                    seed={u.username}
                    size={32}
                    rounded="full"
                  />
                  {u.isOnline && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-darkbg bg-emerald-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                    {displayName}
                  </p>
                  <p className="truncate text-[10px] text-text-muted">
                    {u.isOnline ? (
                      <span className="text-emerald-400">Đang hoạt động</span>
                    ) : '@' + u.username}
                  </p>
                </div>
                {!isFollowing && (
                  <button
                    onClick={(e) => { e.preventDefault(); void handleFollow(u.id); }}
                    className="shrink-0 rounded-lg p-1 text-text-muted hover:text-neon-violet hover:bg-white/5 transition-all"
                    title="Theo dõi"
                  >
                    <UserPlus size={14} />
                  </button>
                )}
                {isFollowing && (
                  <span className="shrink-0 text-neon-violet">
                    <UserCheck size={14} />
                  </span>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
