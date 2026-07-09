'use client';

/**
 * Global "Search Facebook"-style people search for the top Navbar.
 *
 * Debounced (250ms) query → GET /users/discover → dropdown of user
 * cards with the correct quick-action per relationship (Kết bạn /
 * Theo dõi / Nhắn tin). Enter (or clicking "Xem tất cả") navigates to
 * /friends?q=<query> which renders the full search results.
 *
 * Purely additive: this is dropped into the Navbar's center area and
 * does not touch any existing nav logic. On <md screens the field
 * collapses to a single magnifier button that expands an overlay.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, Loader2, UserPlus, UserCheck, Clock, MessageSquare } from 'lucide-react';
import SafeAvatar from '@/components/ui/SafeAvatar';
import { socialUserApi, friendApi, type DiscoverUser, type FriendStatus } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useMessagingStore } from '@/store/messagingStore';
import toast from 'react-hot-toast';

function friendLabel(status: FriendStatus): { text: string; icon: typeof UserPlus } | null {
  switch (status) {
    case 'none':
      return { text: 'Kết bạn', icon: UserPlus };
    case 'pending_outgoing':
      return { text: 'Đã gửi', icon: Clock };
    case 'pending_incoming':
      return { text: 'Phản hồi', icon: UserCheck };
    case 'friends':
      return { text: 'Bạn bè', icon: UserCheck };
    default:
      return null;
  }
}

export default function UserSearchBox() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DiscoverUser[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // Per-row in-flight guard so one action button shows a spinner
  // without freezing the others.
  const [busy, setBusy] = useState<Record<number, boolean>>({});
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Mobile overlay toggle.
  const [expanded, setExpanded] = useState(false);

  // Debounced search.
  useEffect(() => {
    const q = query.trim();
    if (q.length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await socialUserApi.discover(q, 8);
        setResults(res.data.data.users ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  // Close on outside click.
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const goToResults = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    setExpanded(false);
    router.push(`/friends?q=${encodeURIComponent(q)}`);
  }, [query, router]);

  const patchRow = (id: number, friendStatus: FriendStatus) =>
    setResults((prev) => prev.map((u) => (u.id === id ? { ...u, friendStatus } : u)));

  const handleFriend = async (u: DiscoverUser) => {
    if (busy[u.id]) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setBusy((b) => ({ ...b, [u.id]: true }));
    try {
      if (u.friendStatus === 'none') {
        const res = await friendApi.sendRequest(u.id);
        patchRow(u.id, res.data.data.status);
      } else if (u.friendStatus === 'pending_outgoing') {
        await friendApi.cancel(u.id);
        patchRow(u.id, 'none');
      } else if (u.friendStatus === 'pending_incoming') {
        await friendApi.respond(u.id, true);
        patchRow(u.id, 'friends');
      } else if (u.friendStatus === 'friends') {
        // Friends → go to their profile rather than unfriend by accident.
        router.push(`/profile/${u.id}`);
      }
    } catch {
      toast.error('Không thực hiện được, thử lại sau');
    } finally {
      setBusy((b) => ({ ...b, [u.id]: false }));
    }
  };

  const handleMessage = async (u: DiscoverUser) => {
    if (!isAuthenticated) {
      router.push(`/login?next=/messages?peer=${u.id}`);
      return;
    }
    try {
      await useMessagingStore.getState().startUserThread(u.id);
    } catch {
      /* navigate anyway */
    }
    setOpen(false);
    setExpanded(false);
    router.push(`/messages?peer=${u.id}`);
  };

  const dropdown = open && query.trim().length > 0 && (
    <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1218] shadow-[0_16px_48px_rgba(0,0,0,0.55)]">
      {loading ? (
        <div className="flex items-center justify-center py-6 text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : results.length === 0 ? (
        <div className="px-4 py-5 text-center text-xs text-text-muted">
          Không tìm thấy người dùng nào khớp “{query.trim()}”.
        </div>
      ) : (
        <>
          <ul className="max-h-[60vh] overflow-y-auto py-1">
            {results.map((u) => {
              const name = u.displayName?.trim() || u.fullName?.trim() || u.username;
              const fl = friendLabel(u.friendStatus);
              const FlIcon = fl?.icon ?? UserPlus;
              return (
                <li key={u.id} className="flex items-center gap-2.5 px-3 py-2 hover:bg-white/[0.04]">
                  <Link
                    href={`/profile/${u.id}`}
                    onClick={() => { setOpen(false); setExpanded(false); }}
                    className="relative shrink-0"
                  >
                    <SafeAvatar src={u.avatarUrl} alt={name} seed={u.username} size={36} rounded="full" />
                    {u.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0e1218] bg-emerald-400" />
                    )}
                  </Link>
                  <Link
                    href={`/profile/${u.id}`}
                    onClick={() => { setOpen(false); setExpanded(false); }}
                    className="min-w-0 flex-1"
                  >
                    <p className="truncate text-sm font-medium text-text-primary">{name}</p>
                    <p className="truncate text-[11px] text-text-muted">@{u.username}</p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleFriend(u)}
                    disabled={busy[u.id]}
                    className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors disabled:opacity-50 ${
                      u.friendStatus === 'friends'
                        ? 'bg-white/[0.06] text-text-secondary'
                        : u.friendStatus === 'pending_outgoing'
                          ? 'bg-white/[0.04] text-text-muted'
                          : 'bg-neon-violet/20 text-neon-violet hover:bg-neon-violet/30'
                    }`}
                    title={fl?.text}
                  >
                    {busy[u.id] ? <Loader2 className="h-3 w-3 animate-spin" /> : <FlIcon className="h-3 w-3" />}
                    <span className="hidden xl:inline">{fl?.text}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMessage(u)}
                    className="flex shrink-0 items-center justify-center rounded-lg bg-white/[0.04] p-1.5 text-text-secondary hover:bg-white/[0.08] hover:text-text-primary transition-colors"
                    title="Nhắn tin"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={goToResults}
            className="block w-full border-t border-white/[0.06] px-4 py-2.5 text-center text-xs font-medium text-neon-violet hover:bg-white/[0.03]"
          >
            Xem tất cả kết quả cho “{query.trim()}”
          </button>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop / tablet inline field */}
      <div ref={boxRef} className="relative hidden md:block w-[200px] lg:w-[260px]">
        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 focus-within:border-neon-violet/40">
          <Search className="h-4 w-4 shrink-0 text-text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => { if (e.key === 'Enter') goToResults(); if (e.key === 'Escape') setOpen(false); }}
            placeholder="Tìm bạn bè, người dùng…"
            className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted/70"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(''); inputRef.current?.focus(); }} className="text-text-muted hover:text-text-primary">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {dropdown}
      </div>

      {/* Mobile: magnifier button → expanding overlay. The overlay is
          PORTALED to <body> so it escapes the top-nav's z-40 stacking
          context (otherwise the results were trapped/covered). */}
      <div className="md:hidden">
        {!expanded && (
          <button
            type="button"
            onClick={() => { setExpanded(true); setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
            aria-label="Tìm kiếm"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary hover:bg-white/[0.06]"
          >
            <Search className="h-4 w-4" />
          </button>
        )}
      </div>
      {expanded && typeof document !== 'undefined' && createPortal(
        <div
          ref={boxRef}
          className="fixed inset-x-0 top-0 z-[130] border-b border-white/[0.06] bg-[#0d0f18]/95 p-2 backdrop-blur-xl md:hidden"
          style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}
        >
          <div className="relative">
            <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onKeyDown={(e) => { if (e.key === 'Enter') goToResults(); if (e.key === 'Escape') { setExpanded(false); setOpen(false); } }}
                placeholder="Tìm bạn bè, người dùng…"
                className="w-full bg-transparent text-base text-text-primary outline-none placeholder:text-text-muted/70"
              />
              <button type="button" onClick={() => { setExpanded(false); setOpen(false); setQuery(''); }} className="text-text-muted hover:text-text-primary">
                <X className="h-4 w-4" />
              </button>
            </div>
            {dropdown}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
