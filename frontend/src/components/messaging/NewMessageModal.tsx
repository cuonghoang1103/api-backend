'use client';

/**
 * "Tin nhắn mới" — start a chat by searching for a user.
 *
 * Reuses the friend-graph people search (socialUserApi.discover) and
 * the messaging store's idempotent startUserThread + openThread, so it
 * needs no new backend. Empty query shows "people you may know".
 */

import { useEffect, useRef, useState } from 'react';
import { Search, X, Loader2, PenSquare } from 'lucide-react';
import { socialUserApi, type DiscoverUser } from '@/lib/api';
import { useMessagingStore } from '@/store/messagingStore';
import SafeAvatar from '@/components/ui/SafeAvatar';
import toast from 'react-hot-toast';

export default function NewMessageModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const store = useMessagingStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DiscoverUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [startingId, setStartingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else { setQuery(''); setResults([]); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await socialUserApi.discover(query.trim(), 20);
        setResults(res.data.data.users ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, query.trim() ? 250 : 0);
    return () => clearTimeout(t);
  }, [query, open]);

  const startChat = async (u: DiscoverUser) => {
    if (startingId) return;
    setStartingId(u.id);
    try {
      const threadId = await store.startUserThread(u.id);
      await store.openThread(threadId);
      onClose();
    } catch (e: any) {
      const msg =
        e?.response?.data?.code === 'MESSAGES_DISABLED'
          ? 'Người dùng này không nhận tin nhắn từ người lạ'
          : e?.userFriendlyMessage ?? e?.message ?? 'Không thể mở cuộc trò chuyện';
      toast.error(msg);
    } finally {
      setStartingId(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/55 p-4 pt-24" onMouseDown={onClose}>
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1218] shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-2">
            <PenSquare className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-text-primary">Tin nhắn mới</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-text-muted hover:bg-white/[0.06] hover:text-text-primary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 focus-within:border-cyan-500/40">
            <Search className="h-4 w-4 shrink-0 text-text-muted" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm tên hoặc @username…"
              className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted/70"
            />
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto px-2 pb-3">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-text-muted" /></div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-muted">Không tìm thấy người dùng nào.</div>
          ) : (
            results.map((u) => {
              const name = u.displayName?.trim() || u.fullName?.trim() || u.username;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => startChat(u)}
                  disabled={startingId !== null}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-white/[0.05] disabled:opacity-60"
                >
                  <div className="relative shrink-0">
                    <SafeAvatar src={u.avatarUrl} alt={name} seed={u.username} size={40} rounded="full" />
                    {u.isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0e1218] bg-emerald-400" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">{name}</p>
                    <p className="truncate text-[11px] text-text-muted">@{u.username}</p>
                  </div>
                  {startingId === u.id && <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
