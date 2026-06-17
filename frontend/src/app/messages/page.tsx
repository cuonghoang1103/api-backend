'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SafeImage } from '@/components/ui/SafeImage';
import {
  Loader2,
  RefreshCcw,
  Wifi,
  WifiOff,
  AlertCircle,
  Check,
  CheckCheck,
  LogIn,
  MessageCircle,
  Headphones,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useMessagingStore } from '@/store/messagingStore';
import { motion, AnimatePresence } from 'framer-motion';
import ThreadList from '@/components/messaging/ThreadList';
import MessageList from '@/components/messaging/MessageList';
import MessageInput from '@/components/messaging/MessageInput';
import NicknamePopover from '@/components/messaging/NicknamePopover';
import ThreadHeaderMenu from '@/components/messaging/ThreadHeaderMenu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

// iOS-like spring curve — used everywhere for hover/transitions
const IOS_SPRING = 'cubic-bezier(0.16, 1, 0.3, 1)';

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
  const startAdminThread = useMessagingStore((s) => s.startAdminThread);
  const openThread = useMessagingStore((s) => s.openThread);
  const [mounted, setMounted] = useState(false);

  const isAdmin = (auth.user?.roles ?? []).some(
    (r) => r.replace('ROLE_', '').toUpperCase() === 'ADMIN',
  );

  const handleStartAdmin = async () => {
    try {
      const id = await startAdminThread();
      await openThread(id);
    } catch {
      // The user is on an empty screen with no toast surface; the
      // ThreadList already shows this same banner with toasts wired
      // up. We swallow here so clicking from the empty state still
      // does the right thing (open the admin thread) without
      // duplicating the toast path.
    }
  };

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
    // Page background — deepest of the three layers (Sidebar > List > Content).
    // We use a near-black blue-tinted shade here, then brighten the inner
    // panels so the eye is pulled toward the conversation.
    <div
      className="min-h-screen pt-16"
      style={{
        background:
          'radial-gradient(ellipse at top, #0a0a18 0%, #03020c 60%, #020108 100%)',
      }}
    >
      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-6xl flex-col px-4 py-6">
        <header className="mb-4 flex items-center justify-between">
          <h1
            className="text-2xl font-bold tracking-tight text-text-primary"
            // iOS uses tighter letter-spacing on display text. -0.022em
            // matches Apple's San Francisco tracking on a 24px headline.
            style={{ letterSpacing: '-0.022em' }}
          >
            Tin nhắn
          </h1>
          <ConnectionPill
            isConnected={isConnected}
            isConnecting={isConnecting}
            initError={initError}
            onRetry={retry}
          />
        </header>

        <div
          // Outer panel: darkest of the three layers. Holds the whole
          // messenger surface with a subtle border + backdrop blur.
          className="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/[0.04] bg-black/30 shadow-2xl backdrop-blur-2xl"
        >
          {/* Sidebar: layer 2 — slightly lighter than the page, darker
              than the chat list. Stays as the "container" for the
              inbox header + admin support banner. */}
          <div
            className="hidden w-80 shrink-0 flex-col border-r border-white/[0.04] md:flex"
            style={{
              background:
                'linear-gradient(180deg, rgba(15,15,28,0.65) 0%, rgba(8,8,18,0.65) 100%)',
            }}
          >
            <div className="border-b border-white/[0.04] px-4 py-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">
                Hộp thư
              </h2>
            </div>
            <div className="min-h-0 flex-1">
              <ThreadList />
            </div>
          </div>

          {/* Main chat area: layer 3 (the brightest of the three). The
              extra +0.05 brightness on a deep navy tint makes the
              message list visually pop, mimicking the way iMessage
              lifts the active conversation off the sidebar. */}
          <AnimatePresence mode="wait">
            {currentThreadId && currentThread ? (
              <motion.div
                key={`thread-${currentThreadId}`}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.22, ease: IOS_SPRING as any }}
                className="flex min-w-0 flex-1 flex-col"
                style={{
                  background:
                    'linear-gradient(180deg, #11121f 0%, #0c0d18 100%)',
                }}
              >
                <ThreadHeader
                  thread={currentThread}
                  getPresence={getPresence}
                />
                <div className="min-h-0 flex-1">
                  <MessageList />
                </div>
                <MessageInput disabled={!isConnected} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: IOS_SPRING as any }}
                className="flex h-full min-w-0 flex-1 flex-col"
                style={{
                  background:
                    'linear-gradient(180deg, #11121f 0%, #0c0d18 100%)',
                }}
              >
                <EmptyChatState isAdmin={!!isAdmin} onStartAdmin={handleStartAdmin} />
              </motion.div>
            )}
          </AnimatePresence>
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
      <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.1)]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
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
      className="flex shrink-0 items-center gap-3 border-b border-white/[0.04] px-4 py-3.5"
      style={{
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 100%)',
      }}
    >
      <div className="relative shrink-0">
        {peer?.avatarUrl ? (
          <SafeImage
            src={peer.avatarUrl}
            alt={peer.displayName}
            label={peer.displayName || peer.username || 'User'}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}
          >
            {(peer?.displayName ?? peer?.username ?? '?').charAt(0).toUpperCase()}
          </div>
        )}
        {presence && (
          <span
            className={cn(
              'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-[#0c0d18]',
              presence.online
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                : 'bg-zinc-500',
            )}
            title={statusText}
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className="truncate text-[15px] font-semibold text-text-primary"
            style={{ letterSpacing: '-0.011em' }}
          >
            {peer?.displayName ?? peer?.username ?? 'Cuộc trò chuyện'}
            {thread?.type === 'ADMIN' && (
              <span className="ml-2 inline-flex items-center rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">ADMIN</span>
            )}
          </p>
          <NicknamePopover thread={thread!} />
        </div>
        <p
          className={cn(
            'truncate text-[11.5px]',
            presence?.online ? 'text-emerald-400' : 'text-text-muted/80',
          )}
          style={{ letterSpacing: '-0.003em' }}
        >
          {statusText}
        </p>
      </div>
      {peer && <ThreadHeaderMenu threadId={thread!.id} peerId={peer.id} />}
    </div>
  );
}

// ── Empty chat state (no thread selected) ───────────────────
// Shown on the right panel when the user hasn't picked a thread yet.
// The previous version was just two lines of muted text. The new
// version adds a soft outline icon as a visual anchor and a
// friendlier "Hỗ trợ từ Admin" call-to-action that doubles as a
// shortcut (the same button is in the sidebar, but here it's
// in-context).
function EmptyChatState({
  isAdmin,
  onStartAdmin,
}: {
  isAdmin: boolean;
  onStartAdmin: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
      <motion.div
        // Subtle float animation on the icon to draw the eye without
        // being distracting. iOS uses a similar effect on its empty
        // mailbox screen.
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: IOS_SPRING as any }}
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] shadow-inner"
      >
        <MessageCircle
          className="h-10 w-10 text-cyan-400/80"
          strokeWidth={1.5}
          aria-hidden
        />
      </motion.div>
      <h3
        className="mb-1.5 text-base font-semibold text-text-primary"
        style={{ letterSpacing: '-0.011em' }}
      >
        Chọn một cuộc trò chuyện
      </h3>
      <p
        className="mb-8 max-w-[280px] text-[13px] leading-relaxed text-text-muted"
        style={{ letterSpacing: '-0.003em' }}
      >
        Chọn một cuộc trò chuyện ở bên trái, hoặc bắt đầu thread mới
        với admin bằng nút bên dưới.
      </p>
      <button
        onClick={onStartAdmin}
        className="group flex items-center gap-2.5 rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.08] px-5 py-3 text-sm font-medium text-cyan-200 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:border-cyan-500/30 hover:bg-cyan-500/[0.12] hover:shadow-[0_8px_24px_rgba(6,182,212,0.2)] active:scale-[0.98]"
      >
        <Headphones className="h-4 w-4" strokeWidth={2} />
        <span>{isAdmin ? 'Mở thread hỗ trợ của bạn' : 'Chat với Admin'}</span>
      </button>
    </div>
  );
}
