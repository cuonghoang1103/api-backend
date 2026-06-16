'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, RefreshCcw, Wifi, WifiOff, AlertCircle, Check, CheckCheck, LogIn } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useMessagingStore } from '@/store/messagingStore';
import ThreadList from '@/components/messaging/ThreadList';
import MessageList from '@/components/messaging/MessageList';
import MessageInput from '@/components/messaging/MessageInput';
import NicknamePopover from '@/components/messaging/NicknamePopover';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
      </div>
    }>
      <MessagesPageInner />
    </Suspense>
  );
}

function MessagesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuthStore();
  const isConnected = useMessagingStore((s) => s.isConnected);
  const isConnecting = useMessagingStore((s) => s.isConnecting);
  const initError = useMessagingStore((s) => s.initError);
  const init = useMessagingStore((s) => s.init);
  const retry = useMessagingStore((s) => s.retryConnection);
  const currentThreadId = useMessagingStore((s) => s.currentThreadId);
  const currentThread = useMessagingStore((s) => s.currentThread);
  const getPresence = useMessagingStore((s) => s.getPresence);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth gate
  useEffect(() => {
    if (!mounted) return;
    if (!auth.isAuthenticated) {
      router.replace(`/login?next=/messages`);
    }
  }, [mounted, auth.isAuthenticated, router]);

  // Boot the socket + load threads.
  // Only run once on first authenticated mount. Reconnect is handled
  // by the socket itself; manual retry uses the retry button.
  useEffect(() => {
    if (!mounted || !auth.isAuthenticated) return;
    let cancelled = false;
    (async () => {
      await init();
      if (cancelled) return;

      // CRITICAL: if the auth cookie is stale (e.g. the JWT was
      // invalidated by a password change or `roleVersion` bump),
      // `init()` will succeed in opening the socket — the socket
      // doesn't know about roleVersion — but the very first REST
      // call (loadThreads) will return 401. The store's loader
      // silently swallows that error, leaving the user staring
      // at an empty inbox with a green "Đang hoạt động" pill.
      // We need to actively probe /profile (which goes through
      // the same auth middleware) and, if it 401s, force a
      // logout so the user can re-authenticate.
      try {
        const probe = await fetch('/api/v1/auth/profile', { credentials: 'include' });
        if (probe.status === 401 || probe.status === 403) {
          // Cookie is bad — log out and bounce to /login.
          await useAuthStore.getState().logout();
          return;
        }
      } catch {
        // Network error — let the socket reconnect logic handle it.
      }

      // Mirror any per-thread nicknames the user has set so the
      // sidebar shows the alias instead of the real username.
      try {
        await useMessagingStore.getState().loadNicknames();
      } catch {
        // ignore
      }
      // If still not connected after the first attempt, start a
      // single gentle background retry so the "Đang kết nối" state
      // does not sit there forever (e.g. cookie race after login).
      if (!useMessagingStore.getState().isConnected && !useMessagingStore.getState().isConnecting) {
        setTimeout(() => { if (!cancelled) retry(); }, 2500);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, auth.isAuthenticated]);

  // Optional: auto-open a thread if ?peer=<id> is set
  useEffect(() => {
    const peerId = searchParams.get('peer');
    if (!peerId || !auth.isAuthenticated) return;
    const pid = parseInt(peerId, 10);
    if (isNaN(pid)) return;
    const store = useMessagingStore.getState();
    (async () => {
      try {
        const id = await store.startUserThread(pid);
        await store.openThread(id);
      } catch {
        // ignore — user can pick from the sidebar
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, auth.isAuthenticated]);

  if (!mounted || !auth.isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ background: '#03020c' }}>
      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-6xl flex-col px-4 py-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">Tin nhắn</h1>
          <ConnectionPill
            isConnected={isConnected}
            isConnecting={isConnecting}
            initError={initError}
            onRetry={retry}
          />
        </header>

        <div
          className="flex min-h-0 flex-1 overflow-hidden rounded-2xl"
          style={{
            background: 'rgba(15, 15, 25, 0.6)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Sidebar */}
          <div
            className="hidden w-80 shrink-0 border-r border-white/[0.06] md:flex md:flex-col"
            style={{ background: 'rgba(0,0,0,0.2)' }}
          >
            <div className="border-b border-white/[0.06] px-4 py-3">
              <h2 className="text-sm font-semibold text-text-primary">Hộp thư</h2>
            </div>
                    <div className="min-h-0 flex-1">
                      <ThreadList />
                    </div>
                  </div>

                  {/* Main chat area */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    {currentThreadId && currentThread ? (
                      <>
                        <ThreadHeader
                          thread={currentThread}
                          getPresence={getPresence}
                        />
                <div className="min-h-0 flex-1">
                  <MessageList />
                </div>
                <MessageInput disabled={!isConnected} />
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-text-muted">
                <p className="text-sm">Chọn một cuộc trò chuyện ở bên trái</p>
                <p className="text-xs">hoặc bắt đầu thread mới với admin bằng nút phía trên.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Connection status pill (header right) ───────────────────
function ConnectionPill({
  isConnected,
  isConnecting,
  initError,
  onRetry,
}: {
  isConnected: boolean;
  isConnecting: boolean;
  initError: string | null;
  onRetry: () => void;
}) {
  if (isConnected) {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-400">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span>Đang hoạt động</span>
      </div>
    );
  }
  if (isConnecting) {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-400">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Đang kết nối...</span>
      </div>
    );
  }
  // 401-style errors get a "log in again" button so the user can
  // recover without having to clear cookies manually.
  const needsRelogin = initError && /hết hạn|invalid|unauthor/i.test(initError);
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex max-w-[260px] items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[11px] text-red-400"
        title={initError ?? ''}
      >
        <WifiOff className="h-3 w-3 shrink-0" />
        <span className="truncate">{initError || 'Ngoại tuyến'}</span>
      </div>
      {needsRelogin ? (
        <button
          onClick={() => useAuthStore.getState().logout()}
          className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-300 transition-colors hover:bg-amber-500/20"
          title="Đăng nhập lại"
        >
          <LogIn className="h-3 w-3" />
          <span>Đăng nhập lại</span>
        </button>
      ) : (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-text-secondary transition-colors hover:bg-white/[0.08] hover:text-text-primary"
          title="Thử kết nối lại"
        >
          <RefreshCcw className="h-3 w-3" />
          <span>Thử lại</span>
        </button>
      )}
    </div>
  );
}

// ── Thread header (chat top) ───────────────────────────────
function ThreadHeader({
  thread,
  getPresence,
}: {
  thread: ReturnType<typeof useMessagingStore.getState>['currentThread'];
  getPresence: (uid: number) => { online: boolean; lastSeen: number };
}) {
  const peer = thread?.peer;
  const presence = peer ? getPresence(peer.id) : null;

  const statusText = presence?.online
    ? 'Đang hoạt động'
    : presence && presence.lastSeen > 0
      ? `Hoạt động ${formatDistanceToNow(new Date(presence.lastSeen), { addSuffix: false, locale: vi })} trước`
      : 'Ngoại tuyến';

  return (
    <div
      className="flex shrink-0 items-center gap-3 border-b border-white/[0.06] px-4 py-3"
      style={{ background: 'rgba(0,0,0,0.15)' }}
    >
      <div className="relative shrink-0">
        {peer?.avatarUrl ? (
          <img src={peer.avatarUrl} alt={peer.displayName} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}
          >
            {(peer?.displayName ?? peer?.username ?? '?').charAt(0).toUpperCase()}
          </div>
        )}
        {presence && (
          <span
            className={cn(
              'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#0a0a14]',
              presence.online ? 'bg-emerald-400' : 'bg-zinc-500',
            )}
            title={statusText}
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-text-primary">
            {peer?.displayName ?? peer?.username ?? 'Cuộc trò chuyện'}
            {thread?.type === 'ADMIN' && (
              <span className="ml-2 inline-flex items-center rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">ADMIN</span>
            )}
          </p>
          <NicknamePopover thread={thread!} />
        </div>
        <p className={cn(
          'truncate text-[11px]',
          presence?.online ? 'text-emerald-400' : 'text-text-muted',
        )}>
          {statusText}
        </p>
      </div>
    </div>
  );
}
