'use client';

/**
 * ============================================================
 * ShareTrackModal (Phase 3) — share a track/playlist
 * ============================================================
 *
 * Reuses the EXISTING systems with zero backend change:
 *   - Feed: useCreatePost (POST /social/posts). YouTube tracks pass
 *     youtubeUrl so the post card renders an embedded player.
 *   - Chat: useMessagingStore.sendMessage to a chosen conversation.
 *
 * Cyber theme; mobile-friendly (44px targets, 16px inputs).
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Send, MessageCircle, Rss, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useOptimisticPost } from '@/hooks/useSocialQueries';
import { useMessagingStore } from '@/store/messagingStore';
import { messagingApi } from '@/lib/api';
import { isYouTubeUrl } from '@/lib/youtube-player';

const C = {
  primary: '#8B5CF6',
  secondary: '#06b6d4',
  accent: '#ec4899',
  text: '#f8fafc',
  muted: '#94a3b8',
};

export interface ShareItem {
  kind: 'track' | 'playlist';
  title: string;
  artist?: string;
  /** Raw audio URL — used only to detect a YouTube track for embed. */
  audioUrl?: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  item: ShareItem | null;
}

const SITE = 'https://cuongthai.com/music';

function defaultCaption(item: ShareItem): string {
  if (item.kind === 'playlist') {
    return `🎶 Playlist: ${item.title}\n👉 Nghe trên CYBER_MUSIC: ${SITE}`;
  }
  return `🎵 Đang nghe: ${item.title}${item.artist ? ` — ${item.artist}` : ''}\n👉 Nghe trên CYBER_MUSIC: ${SITE}`;
}

export default function ShareTrackModal({ open, onClose, item }: Props) {
  const [tab, setTab] = useState<'feed' | 'chat'>('feed');
  const [caption, setCaption] = useState('');
  const [sentThreadId, setSentThreadId] = useState<number | null>(null);

  const [loadingThreads, setLoadingThreads] = useState(false);
  const [sendingThreadId, setSendingThreadId] = useState<number | null>(null);

  const createPost = useOptimisticPost();
  const threads = useMessagingStore((s) => s.threads);
  const loadThreads = useMessagingStore((s) => s.loadThreads);

  // Reset caption whenever a new item is shared.
  useEffect(() => {
    if (open && item) {
      setCaption(defaultCaption(item));
      setSentThreadId(null);
      setTab('feed');
    }
  }, [open, item]);

  // Lazily load conversations when the chat tab opens.
  useEffect(() => {
    if (open && tab === 'chat' && threads.length === 0) {
      setLoadingThreads(true);
      loadThreads().finally(() => setLoadingThreads(false));
    }
  }, [open, tab, threads.length, loadThreads]);

  if (!item) return null;

  const youtubeUrl = item.audioUrl && isYouTubeUrl(item.audioUrl).isYT ? item.audioUrl : undefined;

  const handlePostToFeed = async () => {
    const content = caption.trim();
    if (!content) {
      toast.error('Nhập nội dung chia sẻ');
      return;
    }
    try {
      await createPost.mutateAsync({
        content,
        ...(youtubeUrl ? { youtubeUrl, type: 'VIDEO' as const } : {}),
      });
      toast.success('Đã chia sẻ lên feed');
      onClose();
    } catch (e: any) {
      toast.error(e?.status === 401 ? 'Bạn cần đăng nhập' : e?.message || 'Chia sẻ thất bại');
    }
  };

  const handleSendToChat = async (threadId: number) => {
    const content = caption.trim();
    if (!content) {
      toast.error('Nhập nội dung chia sẻ');
      return;
    }
    // Call the REST API directly (not the store's optimistic sendMessage,
    // which silently returns if the auth user isn't hydrated and carries
    // chat-only side-effects). This is a reliable fire-and-forget send.
    setSendingThreadId(threadId);
    try {
      await messagingApi.sendMessage(threadId, { content });
      setSentThreadId(threadId);
      toast.success('Đã gửi vào cuộc trò chuyện');
    } catch (e: any) {
      const status = e?.response?.status;
      toast.error(status === 401 ? 'Bạn cần đăng nhập' : 'Gửi thất bại');
    } finally {
      setSendingThreadId(null);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[210] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: 'rgba(5,7,18,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-white/10 p-5 max-h-[85vh] overflow-y-auto"
            style={{ background: 'linear-gradient(160deg, #0f172a, #1e1b4b)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4" style={{ color: C.primary }} />
                <span className="text-sm font-mono font-bold uppercase tracking-widest" style={{ color: C.text }}>
                  Chia sẻ
                </span>
              </div>
              <button onClick={onClose} aria-label="Close" style={{ minHeight: 44, minWidth: 44 }} className="flex items-center justify-center">
                <X className="w-5 h-5" style={{ color: C.muted }} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {([
                { key: 'feed', label: 'FEED', icon: Rss },
                { key: 'chat', label: 'CHAT', icon: MessageCircle },
              ] as const).map(({ key, label, icon: Icon }) => {
                const active = tab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className="flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
                    style={{
                      minHeight: 44,
                      background: active ? `${C.primary}20` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${active ? `${C.primary}50` : 'rgba(255,255,255,0.08)'}`,
                      color: active ? C.primary : C.muted,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Caption */}
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="w-full rounded-xl bg-black/40 border border-white/10 p-3 outline-none font-mono mb-3"
              style={{ color: C.text, fontSize: 16, lineHeight: 1.6 }}
            />
            {youtubeUrl && (
              <p className="text-[11px] font-mono mb-3" style={{ color: C.secondary }}>
                ▸ Bài YouTube — sẽ hiện player nhúng trong bài đăng.
              </p>
            )}

            {tab === 'feed' ? (
              <button
                onClick={handlePostToFeed}
                disabled={createPost.isPending}
                className="w-full py-3 rounded-xl text-sm font-mono font-bold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ minHeight: 44, color: '#0a0a0a', background: C.primary }}
              >
                {createPost.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Đăng lên feed
              </button>
            ) : (
              <div className="space-y-1.5">
                <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: C.muted }}>
                  Chọn cuộc trò chuyện
                </p>
                {loadingThreads ? (
                  <p className="text-xs font-mono py-4 text-center flex items-center justify-center gap-2" style={{ color: C.muted }}>
                    <Loader2 className="w-4 h-4 animate-spin" /> Đang tải…
                  </p>
                ) : threads.length === 0 ? (
                  <p className="text-xs font-mono py-4 text-center" style={{ color: C.muted }}>
                    Chưa có cuộc trò chuyện nào. Hãy nhắn tin với ai đó trước rồi quay lại chia sẻ.
                  </p>
                ) : (
                  threads.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSendToChat(t.id)}
                      disabled={sentThreadId === t.id || sendingThreadId === t.id}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-all hover:bg-white/5 disabled:opacity-60"
                      style={{ minHeight: 44, border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <span className="text-sm truncate" style={{ color: C.text }}>
                        {t.peer?.displayName || t.peer?.username || `Cuộc trò chuyện #${t.id}`}
                      </span>
                      {sentThreadId === t.id ? (
                        <Check className="w-4 h-4 shrink-0" style={{ color: C.secondary }} />
                      ) : sendingThreadId === t.id ? (
                        <Loader2 className="w-4 h-4 shrink-0 animate-spin" style={{ color: C.muted }} />
                      ) : (
                        <Send className="w-4 h-4 shrink-0" style={{ color: C.muted }} />
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
