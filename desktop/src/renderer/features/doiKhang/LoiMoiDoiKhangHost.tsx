/**
 * Lời mời Đối kháng trên app desktop (05/10/2026) — nghe `dk:loi-moi` trên socket CỦA APP
 * (`realtime/socket.ts`) và hiện toast có nút Nhận / Từ chối ở MỌI trang.
 *
 * Vì sao không gắn thẳng `LoiMoiDoiKhang` của web: thẻ đó đọc `useAuthStore` của cây web, mà
 * phiên web chỉ được nạp bên trong `TrangWebDon` (khi mở một trang dùng lại mã web). Ở trang
 * thuần app (Nhạc, Ghi chú…) nó sẽ coi như chưa đăng nhập và không bao giờ nghe.
 * Nhận ⇒ điều hướng tới `/games/doi-khang?phong=MÃ` (TroChoiNoiDung dựng DoiKhangClient).
 */
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAppState } from '../../app-state';
import { laySocket } from '../../realtime/socket';

const TEN_TRO: Record<string, string> = { 'co-vua': 'Cờ vua', 'co-tuong': 'Cờ tướng', 'tien-len': 'Tiến lên', caro: 'Caro' };
type LoiMoi = { maPhong: string; tro: string; tu?: { id: number; ten: string } };

export function LoiMoiDoiKhangHost() {
  const { navigate } = useAppState();
  useEffect(() => {
    let socket = laySocket();
    let huy: (() => void) | null = null;
    const gan = () => {
      socket = laySocket();
      if (!socket || huy) return;
      const s = socket;
      const nhan = (d: LoiMoi) => {
        if (!d?.maPhong) return;
        const ma = String(d.maPhong);
        let daTraLoi = false;
        toast(`${d.tu?.ten ?? 'Một người bạn'} mời bạn chơi ${TEN_TRO[d.tro] ?? 'đối kháng'}`, {
          id: `dk-${ma}`,
          description: `Phòng ${ma} · lời mời tự tắt sau 30 giây`,
          duration: 30_000,
          action: { label: 'Nhận', onClick: () => { daTraLoi = true; navigate(`/games/doi-khang?phong=${encodeURIComponent(ma)}`); } },
          cancel: { label: 'Từ chối', onClick: () => { daTraLoi = true; s.emit('dk:tra-loi-moi', { maPhong: ma, dongY: false }); } },
          onAutoClose: () => { if (!daTraLoi) s.emit('dk:tra-loi-moi', { maPhong: ma, dongY: false }); },
        });
      };
      s.on('dk:loi-moi', nhan);
      huy = () => s.off('dk:loi-moi', nhan);
    };
    gan();
    // Socket có thể nối SAU khi app mở (đăng nhập xong) — dò lại tới khi có.
    const t = window.setInterval(() => { if (!huy) gan(); else if (laySocket() !== socket) { huy(); huy = null; gan(); } }, 2000);
    return () => { window.clearInterval(t); huy?.(); };
  }, [navigate]);
  return null;
}
