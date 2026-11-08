/**
 * Lời mời Đối kháng trên app desktop (05/10/2026, viết lại 08/11/2026) — nghe `dk:loi-moi` trên socket
 * CỦA APP (`realtime/socket.ts`) và hiện toast có nút Nhận / Từ chối ở MỌI trang.
 *
 * Vì sao không gắn thẳng `LoiMoiDoiKhang` của web: thẻ đó đọc `useAuthStore` của cây web, mà
 * phiên web chỉ được nạp bên trong `TrangWebDon` (khi mở một trang dùng lại mã web). Ở trang
 * thuần app (Nhạc, Ghi chú…) nó sẽ coi như chưa đăng nhập và không bao giờ nghe.
 *
 * ─── Ba lỗi đã sửa 08/11/2026 ───
 * 1. **Bấm "Nhận" không vào phòng.** Bản cũ gọi `navigate('/games/doi-khang?phong=X')` — `navigate` của
 *    app KHÔNG tách `?`, còn `useSearchParams` của cây web đọc truy vấn từ kho theo đường dẫn
 *    (`shims/next-navigation`), nên `DoiKhangClient` không thấy `phong` và hiện sảnh. Mọi lời mời tới
 *    app (từ web hay từ app khác) đều hỏng ở đây. Giờ: `datTruyVanCho` + `navigate(duong, truyVan)`.
 * 2. **"Từ chối" oan.** Hết giờ tự gửi `dongY:false` — người đã Nhận ở máy khác vẫn bị báo từ chối.
 *    Giờ máy chủ tự hết hạn lời mời; thẻ tắt ở mọi thiết bị theo `dk:loi-moi-xong`.
 * 3. **Không thấy lời mời khi app ở nền.** Toast nằm trong cửa sổ đang khuất — giờ thêm thông báo hệ
 *    điều hành (macOS / Windows / Linux) khi cửa sổ không được focus.
 */
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAppState } from '../../app-state';
import { laySocket } from '../../realtime/socket';
import { datTruyVanCho } from '../../shims/next-navigation';

const TEN_TRO: Record<string, string> = { 'co-vua': 'Cờ vua', 'co-tuong': 'Cờ tướng', 'tien-len': 'Tiến lên', caro: 'Caro' };
type LoiMoi = { id?: string; maPhong: string; tro: string; tu?: { id: number; ten: string }; hetLuc?: number };
type LoiMoiXong = { maPhong?: string };

/** Đường + truy vấn tới phòng — tách sẵn cho `navigate(duong, thamSo)` của app. */
export function duongPhong(maPhong: string): { duong: string; q: string } {
  return { duong: '/games/doi-khang', q: `phong=${encodeURIComponent(maPhong)}` };
}

export function LoiMoiDoiKhangHost() {
  const { navigate } = useAppState();
  useEffect(() => {
    let socket = laySocket();
    let huy: (() => void) | null = null;
    const vaoPhong = (ma: string) => {
      const { duong, q } = duongPhong(ma);
      datTruyVanCho(duong, q);
      navigate(duong, q);
    };
    const gan = () => {
      socket = laySocket();
      if (!socket || huy) return;
      const s = socket;
      const nhan = (d: LoiMoi) => {
        if (!d?.maPhong) return;
        const ma = String(d.maPhong);
        const tenTro = TEN_TRO[d.tro] ?? 'đối kháng';
        const conMs = Math.min(120_000, Math.max(5_000, d.hetLuc ? d.hetLuc - Date.now() : 60_000));
        toast(`${d.tu?.ten ?? 'Một người bạn'} mời bạn chơi ${tenTro}`, {
          id: `dk-${ma}`,
          description: `Phòng ${ma} · còn ${Math.round(conMs / 1000)} giây để nhận`,
          duration: conMs,
          action: { label: 'Nhận', onClick: () => vaoPhong(ma) },
          cancel: { label: 'Từ chối', onClick: () => { s.emit('dk:tra-loi-moi', { maPhong: ma, dongY: false }); } },
        });
        // Cửa sổ đang khuất ⇒ toast không ai thấy. Báo qua hệ điều hành; bấm vào là mở thẳng phòng.
        if (!document.hasFocus() && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          const n = new Notification(`🎮 ${d.tu?.ten ?? 'Một người bạn'} mời bạn chơi ${tenTro}`, {
            body: `Phòng ${ma} — bấm để vào`,
            tag: `dk-${ma}`,
          });
          n.onclick = () => { window.focus(); vaoPhong(ma); n.close(); };
        }
      };
      const xong = (d: LoiMoiXong) => { if (d?.maPhong) toast.dismiss(`dk-${d.maPhong}`); };
      s.on('dk:loi-moi', nhan);
      s.on('dk:loi-moi-xong', xong);
      huy = () => { s.off('dk:loi-moi', nhan); s.off('dk:loi-moi-xong', xong); };
    };
    gan();
    // Socket có thể nối SAU khi app mở (đăng nhập xong), hoặc bị THAY (nối lại bằng token mới) — dò lại.
    const t = window.setInterval(() => { if (!huy) gan(); else if (laySocket() !== socket) { huy(); huy = null; gan(); } }, 2000);
    return () => { window.clearInterval(t); huy?.(); };
  }, [navigate]);
  return null;
}
