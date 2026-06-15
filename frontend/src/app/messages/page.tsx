'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useMessagingStore } from '@/store/messagingStore';
import ThreadList from '@/components/messaging/ThreadList';
import MessageList from '@/components/messaging/MessageList';
import MessageInput from '@/components/messaging/MessageInput';

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
  const store = useMessagingStore();
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

  // Boot the socket + load threads
  useEffect(() => {
    if (!mounted || !auth.isAuthenticated) return;
    store.init();
  }, [mounted, auth.isAuthenticated, store]);

  // Optional: auto-open a thread if ?peer=<id> is set
  useEffect(() => {
    const peerId = searchParams.get('peer');
    if (!peerId || !auth.isAuthenticated) return;
    const pid = parseInt(peerId, 10);
    if (isNaN(pid)) return;
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
    <div className="min-h-screen" style={{ background: '#03020c' }}>
      <div className="mx-auto flex h-screen max-w-6xl flex-col px-4 py-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">Tin nhắn</h1>
          <p className="text-xs text-text-muted">
            {store.isConnected ? 'Đã kết nối' : 'Đang kết nối...'}
          </p>
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
            {store.currentThreadId ? (
              <>
                <div className="min-h-0 flex-1">
                  <MessageList />
                </div>
                <MessageInput />
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
