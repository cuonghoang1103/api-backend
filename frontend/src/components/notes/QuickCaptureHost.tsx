'use client';

/**
 * QuickCaptureHost — bộ nghe "Ghi nhanh" gắn MỘT lần ở layout gốc.
 *
 * Nó chỉ là một listener nhỏ; ô nổi thật (`QuickCapturePanel`) được tải lười
 * lần đầu mở, nên không nặng thêm trang nào.
 *
 * Cách mở:
 *   • Phím: Alt+Shift+N (Mac: ⌥⇧N) — chạy ở MỌI trình duyệt.
 *     Ctrl+Shift+N / ⌘⇧N cũng được nghe, nhưng Chrome/Edge (cửa sổ ẩn danh),
 *     Safari (cửa sổ riêng tư) GIỮ tổ hợp đó cho mình và không bao giờ giao
 *     cho trang web — `preventDefault` không cứu được. Nó chỉ tới được trang
 *     trong app desktop (Electron) và vài trình duyệt khác, nên chỉ là phụ.
 *   • Sự kiện: window.dispatchEvent(new CustomEvent('ghi-nhanh:mo', { detail? }))
 *     detail tuỳ chọn: { text?: string; title?: string; mode?: 'ghi-chu' | 'so-lenh' }
 *   • Ôn một Sổ lệnh bất kỳ bằng flashcard (nút đặt ở chỗ khác, vd trình soạn):
 *     window.dispatchEvent(new CustomEvent('so-lenh:on-the', { detail: { noteId } }))
 *     → đồng bộ thẻ từ bảng Lệnh/Nghĩa rồi mở màn ôn `FlashcardReview` có sẵn.
 *
 * So phím theo `e.code` ('KeyN'), không theo `e.key`: trên Mac ⌥⇧N cho ra
 * `e.key === '˜'`. Tổ hợp có phím bổ trợ nên bắt cả khi đang gõ trong ô nhập
 * (đó là ý của phím tắt), nhưng nhường khi bộ gõ đang ghép chữ (`isComposing`).
 */
import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { ghiNhanhApi } from '@/lib/api';

const QuickCapturePanel = dynamic(() => import('./QuickCapturePanel'), { ssr: false });
const FlashcardReview = dynamic(() => import('./FlashcardReview'), { ssr: false });

export type GhiNhanhMode = 'ghi-chu' | 'so-lenh';
export interface GhiNhanhMoDetail { text?: string; title?: string; mode?: GhiNhanhMode }

export function laPhimGhiNhanh(e: KeyboardEvent): boolean {
  if (e.isComposing || e.code !== 'KeyN' || !e.shiftKey) return false;
  const altOnly = e.altKey && !e.ctrlKey && !e.metaKey;
  const ctrlOrCmd = (e.ctrlKey || e.metaKey) && !e.altKey;
  return altOnly || ctrlOrCmd;
}

export default function QuickCaptureHost() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [open, setOpen] = useState(false);
  // Chỉ gắn panel sau lần mở đầu tiên — tải lười.
  const [daMo, setDaMo] = useState(false);
  const [prefill, setPrefill] = useState<GhiNhanhMoDetail | null>(null);
  const [onThe, setOnThe] = useState<number | null>(null);

  /** Sinh/đồng bộ thẻ từ bảng Sổ lệnh rồi mở màn ôn. Lỗi thì ném cho nơi gọi. */
  const onOnThe = useCallback(async (noteId: number) => {
    const r = await ghiNhanhApi.taoThe(noteId);
    const { soThe, taoMoi } = r.data.data;
    if (taoMoi > 0) toast.success(`Đã tạo ${taoMoi} thẻ mới · ${soThe} thẻ trong Sổ lệnh`);
    setOpen(false);
    setOnThe(noteId);
  }, []);

  const mo = useCallback((detail?: GhiNhanhMoDetail | null) => {
    setPrefill(detail ?? null);
    setDaMo(true);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!laPhimGhiNhanh(e)) return;
      if (!isAuthenticated) return; // khách: để phím đi tiếp như bình thường
      e.preventDefault();
      e.stopPropagation();
      mo(null);
    };
    const onEvent = (e: Event) => {
      if (!isAuthenticated) {
        toast('Đăng nhập để ghi nhanh vào sổ tay', {
          action: { label: 'Đăng nhập', onClick: () => { window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`; } },
        });
        return;
      }
      mo((e as CustomEvent<GhiNhanhMoDetail | undefined>).detail ?? null);
    };
    // Pha CAPTURE: trình soạn (ProseMirror) và các ô nhập xử lý keydown ngay
    // trên phần tử của chúng — nghe ở pha bubble thì có nơi đã nuốt mất.
    const onOnTheEvent = (e: Event) => {
      const noteId = Number((e as CustomEvent<{ noteId?: number }>).detail?.noteId);
      if (!isAuthenticated || !Number.isInteger(noteId) || noteId <= 0) return;
      onOnThe(noteId).catch((err: unknown) => {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        toast.error(msg || 'Không tạo được thẻ ôn từ Sổ lệnh');
      });
    };
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('ghi-nhanh:mo', onEvent);
    window.addEventListener('so-lenh:on-the', onOnTheEvent);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('ghi-nhanh:mo', onEvent);
      window.removeEventListener('so-lenh:on-the', onOnTheEvent);
    };
  }, [isAuthenticated, mo, onOnThe]);

  if (!isAuthenticated) return null;
  return (
    <>
      {daMo && <QuickCapturePanel open={open} prefill={prefill} onClose={() => setOpen(false)} onOnThe={onOnThe} />}
      {onThe && (
        // Ngoài /notes không có lớp `.dark` của Notes nên các `dark:` trong
        // FlashcardReview không bật — nền sáng cố định cho khớp.
        <div className="fixed inset-0 z-[80] flex flex-col bg-slate-50" role="dialog" aria-modal="true" aria-label="Ôn Sổ lệnh">
          <FlashcardReview noteId={onThe} onClose={() => setOnThe(null)} />
        </div>
      )}
    </>
  );
}
