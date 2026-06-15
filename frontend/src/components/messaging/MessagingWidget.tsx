'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ShieldCheck, Users, ArrowLeft } from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import ThreadList from './ThreadList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function MessagingWidget() {
  const auth = useAuthStore();
  const store = useMessagingStore();
  const [mounted, setMounted] = useState(false);

  // Mount the socket only on the client (the lib uses `io()` which
  // touches `window`). This is the standard SSR-safe dance.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (auth.isAuthenticated) {
      store.init();
    } else {
      store.shutdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, auth.isAuthenticated]);

  // Don't render the widget until after the first client render —
  // prevents hydration mismatch on pages where the auth state
  // isn't yet populated.
  if (!mounted) return null;
  if (!auth.isAuthenticated) return null;

  return (
    <>
      {/* Floating launcher */}
      <div className="fixed bottom-6 right-24 z-[100] flex flex-col items-end gap-3 print:hidden">
        <AnimatePresence>
          {!store.isWidgetOpen && (
            <motion.button
              key="launcher"
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 20 }}
              transition={{ type: 'spring', damping: 18, stiffness: 240 }}
              onClick={() => store.setWidgetOpen(true)}
              className="group relative flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #06B6D4, #6366F1)',
                boxShadow: '0 8px 32px rgba(6, 182, 212, 0.35)',
              }}
              aria-label="Mở tin nhắn"
            >
              <MessageCircle className="h-6 w-6" />
              {/* Unread badge */}
              {store.unreadTotal > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
                  style={{ boxShadow: '0 0 0 2px #03020c' }}
                >
                  {store.unreadTotal > 9 ? '9+' : store.unreadTotal}
                </span>
              )}
              {/* Connection indicator */}
              <span
                className={cn(
                  'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2',
                  store.isConnected
                    ? 'bg-emerald-400 border-[#03020c]'
                    : 'bg-amber-400 border-[#03020c]',
                )}
                title={store.isConnected ? 'Đã kết nối' : 'Đang kết nối...'}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {store.isWidgetOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="fixed bottom-24 right-6 z-[120] flex h-[600px] w-[400px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl shadow-2xl print:hidden"
            style={{
              background: 'rgba(15, 15, 25, 0.92)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
            }}
            role="dialog"
            aria-label="Hộp thư tin nhắn"
          >
            <Header />
            {store.currentThreadId ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1">
                  <MessageList />
                </div>
                <MessageInput />
              </div>
            ) : (
              <ThreadList />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Header() {
  const store = useMessagingStore();
  const auth = useAuthStore();
  const currentThread = store.threads.find((t) => t.id === store.currentThreadId);

  return (
    <div
      className="flex shrink-0 items-center gap-3 border-b border-white/[0.06] px-4 py-3"
      style={{ background: 'linear-gradient(90deg, rgba(6,182,212,0.08), rgba(99,102,241,0.08))' }}
    >
      {store.currentThreadId ? (
        <button
          onClick={() => store.closeThread()}
          className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/[0.06] hover:text-text-primary"
          aria-label="Quay lại danh sách"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}>
          <MessageCircle className="h-4 w-4 text-white" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-primary">
          {currentThread?.peer?.displayName ?? 'Tin nhắn'}
        </p>
        <p className="flex items-center gap-1.5 text-[10px] text-text-muted">
          {currentThread ? (
            currentThread.type === 'ADMIN' ? (
              <>
                <ShieldCheck className="h-3 w-3" /> Hỗ trợ từ admin
              </>
            ) : (
              <>
                <Users className="h-3 w-3" /> Trò chuyện riêng
              </>
            )
          ) : store.isConnected ? (
            'Đã kết nối'
          ) : (
            'Đang kết nối...'
          )}
        </p>
      </div>
      <button
        onClick={() => store.setWidgetOpen(false)}
        className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/[0.06] hover:text-text-primary"
        aria-label="Đóng"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
