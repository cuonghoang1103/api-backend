/**
 * ============================================================
 * PHÍM MEDIA TOÀN CỤC
 * ============================================================
 *
 * Play/Pause · Next · Prev trên bàn phím chạy được KỂ CẢ khi app không ở trước
 * — đó là thứ một app nhạc trên máy tính phải có, và là điểm khác biệt thật so
 * với nghe trên trình duyệt.
 *
 * ⚠️ `globalShortcut` CƯỚP phím khỏi mọi ứng dụng khác trên máy. Nếu người dùng
 * đang nghe Spotify và mở app này, phím Play sẽ điều khiển app này chứ không
 * phải Spotify. Vì thế:
 *   • chỉ đăng ký KHI có cửa sổ, và gỡ ngay khi app thoát;
 *   • đăng ký hỏng thì BỎ QUA lặng lẽ — hệ điều hành hoặc app khác đã giữ phím
 *     đó, và ném lỗi ở đây sẽ chặn cả lượt khởi động vì một tiện ích nhỏ.
 */
import { BrowserWindow, globalShortcut } from 'electron';

const PHIM: Array<{ ma: string; viec: 'toggle' | 'sau' | 'truoc' }> = [
  { ma: 'MediaPlayPause', viec: 'toggle' },
  { ma: 'MediaNextTrack', viec: 'sau' },
  { ma: 'MediaPreviousTrack', viec: 'truoc' },
];

/**
 * Đăng ký. Trả về số phím GIỮ ĐƯỢC.
 *
 * ⚠️ `globalShortcut.register()` TRẢ VỀ `false` khi hỏng, KHÔNG ném. Bản đầu
 * tôi chỉ bọc `try/catch` — nên mọi thất bại đều im lặng, và đo trên bản đóng
 * gói mới thấy cả ba phím đều không được giữ.
 *
 * Trên macOS, phím media đòi quyền **Trợ năng** (Accessibility). App chưa được
 * cấp thì `register` trả `false`; đó là trạng thái BÌNH THƯỜNG, không phải lỗi
 * — nên ghi một dòng WARN rồi đi tiếp, đừng làm phiền người chỉ muốn nghe nhạc
 * bằng chuột.
 */
export function dangKyPhimMedia(): number {
  let duoc = 0;
  for (const p of PHIM) {
    try {
      const ok = globalShortcut.register(p.ma, () => {
        /* Gửi cho cửa sổ CHÍNH (`index.html`), không phải `getAllWindows()[0]`
           — app có thêm cửa sổ robot, và thứ tự mảng đó không cố định. Đã trả
           giá đúng bài học này với luồng đăng nhập OAuth. */
        const cua = BrowserWindow.getAllWindows()
          .find((w) => w.webContents.getURL().includes('index.html'));
        if (cua && !cua.isDestroyed()) cua.webContents.send('nhac:phim', { viec: p.viec });
      });
      if (ok) duoc++;
    } catch {
      /* phím đã bị app khác giữ — bỏ qua, đừng làm hỏng khởi động */
    }
  }
  if (duoc < PHIM.length) {
    console.warn(
      `[nhạc] chỉ giữ được ${duoc}/${PHIM.length} phím media. `
      + 'Trên macOS cần cấp quyền Trợ năng cho app (Cài đặt hệ thống → Quyền riêng tư & Bảo mật → Trợ năng); '
      + 'hoặc một app khác đang giữ phím đó.',
    );
  }
  return duoc;
}

export function goPhimMedia(): void {
  try { globalShortcut.unregisterAll(); } catch { /* thoát rồi thì thôi */ }
}
