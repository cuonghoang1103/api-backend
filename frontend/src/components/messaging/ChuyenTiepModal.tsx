'use client';

/**
 * Chuyển tiếp một tin sang hội thoại khác — kiểu Messenger: danh sách hội
 * thoại + ô tìm, mỗi hàng một nút "Gửi" (gửi xong thành "Đã gửi").
 *
 * Không cần API mới: gửi lại đúng nội dung qua `POST /threads/:id/messages`
 * — chữ, GIF/nhãn dán (`media`), bài viết chia sẻ (`postShare`) và tệp đính
 * kèm (`fileIds` — tệp đã nằm trên kho, không tải lên lại).
 */
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Loader2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { messagingApi, type MessagingMessage } from '@/lib/api';
import { useMessagingStore } from '@/store/messagingStore';
import { cn } from '@/lib/utils';
import { MAU_TOI } from '@/lib/tinNhan/mauToi';

export default function ChuyenTiepModal({ tin, onDong }: { tin: MessagingMessage; onDong: () => void }) {
  const threads = useMessagingStore((s) => s.threads);
  const [q, datQ] = useState('');
  const [trangThai, datTrangThai] = useState<Record<number, 'dang' | 'xong'>>({});

  const ds = useMemo(() => {
    const k = q.trim().toLowerCase();
    return threads.filter((t) => {
      if (!t.peer || t.preferences?.archivedAt) return false;
      if (!k) return true;
      return [t.peer.alias, t.peer.displayName, t.peer.username].some((x) => x?.toLowerCase().includes(k));
    });
  }, [threads, q]);

  const gui = async (threadId: number) => {
    datTrangThai((s) => ({ ...s, [threadId]: 'dang' }));
    try {
      const media = tin.mediaUrl && (tin.mediaKind === 'gif' || tin.mediaKind === 'sticker')
        ? { url: tin.mediaUrl, kind: tin.mediaKind }
        : undefined;
      const fileIds = (tin.attachments ?? []).map((a) => a.fileId).filter((x) => Number.isFinite(x));
      await messagingApi.sendMessage(threadId, {
        content: tin.content ?? '',
        fileIds: fileIds.length ? fileIds : undefined,
        media,
        postShare: tin.postShare ? { postId: tin.postShare.postId } : undefined,
      });
      // Hàng của hội thoại đích tự đổi qua socket (`thread:new-message`, tin của chính mình).
      datTrangThai((s) => ({ ...s, [threadId]: 'xong' }));
    } catch (e) {
      datTrangThai((s) => { const n = { ...s }; delete n[threadId]; return n; });
      const err = e as { userFriendlyMessage?: string; message?: string };
      toast.error(err?.userFriendlyMessage ?? err?.message ?? 'Không chuyển tiếp được');
    }
  };

  if (typeof document === 'undefined') return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[270] flex items-center justify-center bg-black/60 p-4"
      style={MAU_TOI}
      onClick={(e) => { if (e.target === e.currentTarget) onDong(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Chuyển tiếp tin nhắn"
    >
      <div className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1c1d26] shadow-2xl">
        <div className="flex items-center border-b border-white/[0.08] px-4 py-3">
          <h3 className="flex-1 text-center text-[15px] font-semibold text-text-primary">Chuyển tiếp</h3>
          <button type="button" onClick={onDong} className="rounded-full p-1.5 text-text-muted hover:bg-white/10" aria-label="Đóng">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-4 pt-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              autoFocus
              value={q}
              onChange={(e) => datQ(e.target.value)}
              placeholder="Tìm người hoặc cuộc trò chuyện"
              className="w-full rounded-full bg-white/[0.06] py-2 pl-9 pr-3 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
          <p className="mt-2 line-clamp-2 rounded-lg bg-white/[0.04] px-3 py-2 text-[12px] text-text-muted">
            {tin.content || (tin.mediaKind === 'gif' ? '🎬 GIF' : tin.mediaKind === 'sticker' ? '🪄 Nhãn dán' : tin.attachments?.length ? `📎 ${tin.attachments[0]!.fileName}` : 'Tin nhắn')}
          </p>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
          {ds.length === 0 && <li className="px-3 py-6 text-center text-[13px] text-text-muted">Không tìm thấy cuộc trò chuyện nào.</li>}
          {ds.map((t) => {
            const ten = t.peer?.alias || t.peer?.displayName || t.peer?.username || 'Cuộc trò chuyện';
            const tt = trangThai[t.id];
            return (
              <li key={t.id} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/[0.04]">
                {t.peer?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.peer.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}>
                    {ten.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="min-w-0 flex-1 truncate text-[14px] text-text-primary">{ten}</span>
                <button
                  type="button"
                  disabled={!!tt}
                  onClick={() => void gui(t.id)}
                  className={cn(
                    'flex min-w-[72px] items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-semibold',
                    tt === 'xong' ? 'bg-white/[0.06] text-text-muted' : 'bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30',
                  )}
                >
                  {tt === 'dang' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : tt === 'xong' ? <><Check className="h-3.5 w-3.5" /> Đã gửi</> : 'Gửi'}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
