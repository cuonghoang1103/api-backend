'use client';

/**
 * /friends — Facebook-style People page.
 *
 * Tabs:
 *   - Lời mời       (incoming friend requests — Confirm/Delete)
 *   - Gợi ý         (people you may know — discover with empty query)
 *   - Bạn bè        (accepted friends)
 *   - Đang theo dõi (following)
 *   - Người theo dõi (followers)
 *
 * A search box reads/writes ?q= so the Navbar search can deep-link
 * here. When a query is present we show the search-results view on
 * top regardless of the active tab.
 *
 * Purely additive new route — does not touch existing pages.
 */

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X, Loader2, Users, UserPlus, UserCheck, Heart } from 'lucide-react';
import PersonCard, { FriendRequestCard, type PersonCardData } from '@/components/social/friends/PersonCard';
import { friendApi, socialUserApi, type DiscoverUser, type FriendRequest, type FriendUser } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { LoginRequired } from '@/components/LoginRequired';

type TabKey = 'requests' | 'suggestions' | 'friends' | 'following' | 'followers';

const TABS: { key: TabKey; label: string; icon: typeof Users }[] = [
  { key: 'requests', label: 'Lời mời', icon: UserPlus },
  { key: 'suggestions', label: 'Gợi ý', icon: Users },
  { key: 'friends', label: 'Bạn bè', icon: UserCheck },
  { key: 'following', label: 'Đang theo dõi', icon: Heart },
  { key: 'followers', label: 'Người theo dõi', icon: Users },
];

function followUserToPerson(u: { id: number; username: string; displayName: string | null; avatarUrl: string | null; isOnline: boolean }, isFollowing: boolean): PersonCardData {
  return { id: u.id, username: u.username, displayName: u.displayName, avatarUrl: u.avatarUrl, isOnline: u.isOnline, isFollowing };
}

function FriendsPageInner() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  const myId = (user as any)?.id as number | undefined;

  const urlQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  const [activeTab, setActiveTab] = useState<TabKey>('requests');

  // ── Search results (shown when query non-empty) ──────────────
  const [searchResults, setSearchResults] = useState<DiscoverUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => { setQuery(urlQuery); }, [urlQuery]);

  useEffect(() => {
    const q = query.trim();
    if (q.length === 0) { setSearchResults([]); return; }
    setSearchLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await socialUserApi.discover(q, 24);
        setSearchResults(res.data.data.users ?? []);
      } catch { setSearchResults([]); }
      finally { setSearchLoading(false); }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  // Keep ?q in the URL so the view is shareable / refresh-safe.
  const syncUrl = (q: string) => {
    const url = new URL(window.location.href);
    if (q.trim()) url.searchParams.set('q', q.trim());
    else url.searchParams.delete('q');
    window.history.replaceState({}, '', url.toString());
  };

  // ── Per-tab data ─────────────────────────────────────────────
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [suggestions, setSuggestions] = useState<DiscoverUser[]>([]);
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [following, setFollowing] = useState<PersonCardData[]>([]);
  const [followers, setFollowers] = useState<PersonCardData[]>([]);
  const [tabLoading, setTabLoading] = useState(false);
  const loadedTabs = useRef<Set<TabKey>>(new Set());

  const loadTab = async (tab: TabKey) => {
    if (loadedTabs.current.has(tab)) return;
    setTabLoading(true);
    try {
      if (tab === 'requests') {
        const r = await friendApi.incoming(50);
        setRequests(r.data.data ?? []);
      } else if (tab === 'suggestions') {
        const r = await socialUserApi.discover('', 24);
        setSuggestions(r.data.data.users ?? []);
      } else if (tab === 'friends') {
        const r = await friendApi.listFriends(undefined, 50);
        setFriends(r.data.data.users ?? []);
      } else if (tab === 'following' && myId) {
        const r = await socialUserApi.getFollowing(myId, undefined, 50);
        setFollowing((r.data?.data?.users ?? []).map((u: any) => followUserToPerson(u, true)));
      } else if (tab === 'followers' && myId) {
        const r = await socialUserApi.getFollowers(myId, undefined, 50);
        setFollowers((r.data?.data?.users ?? []).map((u: any) => followUserToPerson(u, false)));
      }
      loadedTabs.current.add(tab);
    } catch { /* ignore */ }
    finally { setTabLoading(false); }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    loadTab(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAuthenticated, myId]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen pt-24" style={{ background: 'var(--bg-primary)' }}>
        <div className="mx-auto max-w-md px-6">
          <LoginRequired message="Đăng nhập để tìm và kết nối với bạn bè." />
        </div>
      </main>
    );
  }

  const showingSearch = query.trim().length > 0;

  return (
    <main className="min-h-screen pt-20 pb-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="bg-gradient-to-r from-violet-300 via-purple-300 to-cyan-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            Bạn bè
          </h1>
          <p className="mt-0.5 text-[13px] text-text-muted">Tìm kiếm, kết bạn và theo dõi mọi người</p>
        </div>

        {/* Search box */}
        <div className="relative mb-5">
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 focus-within:border-neon-violet/40">
            <Search className="h-4 w-4 shrink-0 text-text-muted" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); syncUrl(e.target.value); }}
              placeholder="Tìm theo tên hoặc @username…"
              className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted/70"
            />
            {query && (
              <button type="button" onClick={() => { setQuery(''); syncUrl(''); }} className="text-text-muted hover:text-text-primary">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {showingSearch ? (
          // ── Search results view ──────────────────────────────
          <section>
            <h2 className="mb-3 text-sm font-semibold text-text-secondary">
              Kết quả cho “{query.trim()}”
            </h2>
            {searchLoading ? (
              <Centered><Loader2 className="h-5 w-5 animate-spin text-text-muted" /></Centered>
            ) : searchResults.length === 0 ? (
              <Empty text="Không tìm thấy người dùng nào khớp." />
            ) : (
              <Grid>
                {searchResults.map((u) => <PersonCard key={u.id} person={u} />)}
              </Grid>
            )}
          </section>
        ) : (
          <>
            {/* Tabs */}
            <div className="mb-5 flex gap-1.5 overflow-x-auto scrollbar-thin">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.key;
                const badge = t.key === 'requests' && requests.length > 0 ? requests.length : undefined;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActiveTab(t.key)}
                    className={`flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      active ? 'bg-neon-violet/20 text-neon-violet' : 'text-text-secondary hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t.label}
                    {badge !== undefined && (
                      <span className="ml-0.5 rounded-full bg-neon-fuchsia px-1.5 text-[10px] font-bold text-white">{badge}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {tabLoading ? (
              <Centered><Loader2 className="h-5 w-5 animate-spin text-text-muted" /></Centered>
            ) : activeTab === 'requests' ? (
              requests.length === 0 ? (
                <Empty text="Bạn không có lời mời kết bạn nào." />
              ) : (
                <Grid>
                  {requests.map((r) => (
                    <FriendRequestCard
                      key={r.friendshipId}
                      requesterId={r.user.id}
                      username={r.user.username}
                      displayName={r.user.displayName}
                      avatarUrl={r.user.avatarUrl}
                      isOnline={r.user.isOnline}
                      onResolved={(id) => setRequests((prev) => prev.filter((x) => x.user.id !== id))}
                    />
                  ))}
                </Grid>
              )
            ) : activeTab === 'suggestions' ? (
              suggestions.length === 0 ? (
                <Empty text="Chưa có gợi ý nào." />
              ) : (
                <Grid>
                  {suggestions.map((u) => <PersonCard key={u.id} person={u} />)}
                </Grid>
              )
            ) : activeTab === 'friends' ? (
              friends.length === 0 ? (
                <Empty text="Bạn chưa có người bạn nào. Hãy gửi lời mời kết bạn!" />
              ) : (
                <Grid>
                  {friends.map((u) => (
                    <PersonCard
                      key={u.id}
                      person={{ ...u, friendStatus: 'friends' }}
                      onRemoved={(id) => setFriends((prev) => prev.filter((x) => x.id !== id))}
                    />
                  ))}
                </Grid>
              )
            ) : activeTab === 'following' ? (
              following.length === 0 ? (
                <Empty text="Bạn chưa theo dõi ai." />
              ) : (
                <Grid>{following.map((u) => <PersonCard key={u.id} person={u} />)}</Grid>
              )
            ) : (
              followers.length === 0 ? (
                <Empty text="Chưa có ai theo dõi bạn." />
              ) : (
                <Grid>{followers.map((u) => <PersonCard key={u.id} person={u} />)}</Grid>
              )
            )}
          </>
        )}
      </div>
    </main>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-center py-12">{children}</div>;
}
function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-14 text-center text-sm text-text-muted">
      {text}
    </div>
  );
}

export default function FriendsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen pt-24" style={{ background: 'var(--bg-primary)' }} />}>
      <FriendsPageInner />
    </Suspense>
  );
}
