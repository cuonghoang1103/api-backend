'use client';

/**
 * Gõ vào ô tìm của hộp thư ⇒ ngoài lọc các cuộc trò chuyện, còn tìm NGƯỜI DÙNG trên
 * cả hệ thống, mỗi người một nút "Nhắn tin" (04/10/2026 — người dùng app desktop xin).
 * Dùng chung đường tìm người của "Tin nhắn mới" (socialUserApi.discover) và
 * startUserThread + openThread của kho tin nhắn — không cần API mới.
 */
import { useEffect, useState } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { socialUserApi, type DiscoverUser } from '@/lib/api';
import { useMessagingStore } from '@/store/messagingStore';
import SafeAvatar from '@/components/ui/SafeAvatar';

export default function TimNguoiDeNhan({ query, onDaMo }: { query: string; onDaMo: () => void }) {
  const store = useMessagingStore();
  const [ketQua, setKetQua] = useState<DiscoverUser[]>([]);
  const [dangTim, setDangTim] = useState(false);
  const [dangMo, setDangMo] = useState<number | null>(null);
  const q = query.trim();

  useEffect(() => {
    if (q.length < 2) { setKetQua([]); setDangTim(false); return; }
    let con = true;
    setDangTim(true);
    const hen = setTimeout(async () => {
      try {
        const res = await socialUserApi.discover(q.replace(/^@/, ''), 8);
        if (con) setKetQua(res.data.data.users ?? []);
      } catch {
        if (con) setKetQua([]);
      } finally {
        if (con) setDangTim(false);
      }
    }, 300);
    return () => { con = false; clearTimeout(hen); };
  }, [q]);

  const nhan = async (u: DiscoverUser) => {
    if (dangMo) return;
    setDangMo(u.id);
    try {
      const threadId = await store.startUserThread(u.id);
      await store.openThread(threadId);
      onDaMo();
    } catch (e: any) {
      toast.error(
        e?.response?.data?.code === 'MESSAGES_DISABLED'
          ? 'Người dùng này không nhận tin nhắn từ người lạ'
          : e?.userFriendlyMessage ?? e?.message ?? 'Không thể mở cuộc trò chuyện',
      );
    } finally {
      setDangMo(null);
    }
  };

  if (q.length < 2 || (!dangTim && ketQua.length === 0)) return null;

  return (
    <div className="mb-1 border-b border-white/[0.06] pb-1.5">
      <p className="flex items-center gap-1.5 px-2 pb-1 pt-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-text-muted">
        Người dùng {dangTim && <Loader2 className="h-3 w-3 animate-spin" />}
      </p>
      {ketQua.map((u) => {
        const ten = u.displayName?.trim() || u.fullName?.trim() || u.username;
        return (
          <div key={u.id} className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-white/[0.04]">
            <div className="relative shrink-0">
              <SafeAvatar src={u.avatarUrl} alt={ten} seed={u.username} size={36} rounded="full" />
              {u.isOnline && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0e1218] bg-emerald-400" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-text-primary">{ten}</p>
              <p className="truncate text-[11px] text-text-muted">@{u.username}</p>
            </div>
            <button
              type="button"
              onClick={() => void nhan(u)}
              disabled={dangMo !== null}
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-cyan-500/15 px-2.5 py-1 text-[11.5px] font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/25 disabled:opacity-60"
            >
              {dangMo === u.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <MessageCircle className="h-3 w-3" />}
              Nhắn tin
            </button>
          </div>
        );
      })}
    </div>
  );
}
