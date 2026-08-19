/**
 * Ba cú bấm vào con robot NỔI NGOÀI APP.
 *
 * Người dùng 20/08/2026: "kéo được con robot trong app rồi, nhưng ẩn app đi,
 * qua app khác, thì ấn 3 lần vào nó không di chuyển + phóng to nhỏ được."
 *
 * HAI lỗi chồng lên nhau, và mỗi cái đủ để giết cử chỉ:
 *
 *  1. Cú bấm THỨ HAI bắn `onDoubleClick` → `moChinh('/chat')` → cửa sổ chính
 *     hiện lên và CƯỚP TIÊU ĐIỂM. Cú thứ ba rơi vào cửa sổ vừa hiện, không
 *     vào robot. Trong app không lộ vì ở đó nhấp đúp chỉ điều hướng, không
 *     mở cửa sổ mới.
 *  2. Mở khoá xong, `-webkit-app-region: drag` NUỐT sạch sự kiện chuột, nên
 *     ba cú bấm để KHOÁ LẠI không bao giờ tới nơi.
 *
 * Ở đây kiểm phần quyết định thuần: đếm bấm và lật khoá. Phần CSS đã đổi sang
 * kéo bằng `setBounds`, không còn `app-region`.
 */
import { describe, expect, it, vi } from 'vitest';

/** Bản rút gọn của bộ quyết định trong `robot.tsx`. */
function mayBam() {
  let khoaMo = false;
  let moChat = 0;
  let moChinh = 0;
  let henDup: ReturnType<typeof setTimeout> | null = null;
  let henDon: ReturnType<typeof setTimeout> | null = null;

  const huy = (): void => {
    if (henDon) { clearTimeout(henDon); henDon = null; }
    if (henDup) { clearTimeout(henDup); henDup = null; }
  };

  return {
    bam(detail: number) {
      if (detail >= 3) { huy(); khoaMo = !khoaMo; return; }
      if (henDon) return;
      henDon = setTimeout(() => { henDon = null; moChat += 1; }, 260);
    },
    bamDup() {
      if (henDon) { clearTimeout(henDon); henDon = null; }
      if (henDup) clearTimeout(henDup);
      henDup = setTimeout(() => { henDup = null; moChinh += 1; }, 260);
    },
    get trangThai() { return { khoaMo, moChat, moChinh }; },
  };
}

describe('ba cú bấm ở robot nổi', () => {
  it('bấm ba lần lật khoá VÀ không mở cửa sổ chính', () => {
    vi.useFakeTimers();
    const m = mayBam();
    m.bam(1);
    m.bam(2); m.bamDup();   // trình duyệt bắn cả hai ở cú thứ hai
    m.bam(3);
    vi.advanceTimersByTime(1000);
    // Đây là lỗi thật: trước bản vá, `moChinh` = 1 và cửa sổ chính cướp tiêu
    // điểm ngay giữa cử chỉ.
    expect(m.trangThai).toEqual({ khoaMo: true, moChat: 0, moChinh: 0 });
    vi.useRealTimers();
  });

  it('bấm ba lần LẦN NỮA thì khoá lại', () => {
    vi.useFakeTimers();
    const m = mayBam();
    for (const v of [1, 2, 3]) { m.bam(v); if (v === 2) m.bamDup(); }
    vi.advanceTimersByTime(1000);
    for (const v of [1, 2, 3]) { m.bam(v); if (v === 2) m.bamDup(); }
    vi.advanceTimersByTime(1000);
    expect(m.trangThai.khoaMo).toBe(false);
    vi.useRealTimers();
  });

  it('nhấp đúp thường VẪN mở cửa sổ chính', () => {
    vi.useFakeTimers();
    const m = mayBam();
    m.bam(1);
    m.bam(2); m.bamDup();
    vi.advanceTimersByTime(1000);
    expect(m.trangThai).toEqual({ khoaMo: false, moChat: 0, moChinh: 1 });
    vi.useRealTimers();
  });

  it('bấm một lần VẪN mở khung chat nhanh', () => {
    vi.useFakeTimers();
    const m = mayBam();
    m.bam(1);
    vi.advanceTimersByTime(1000);
    expect(m.trangThai).toEqual({ khoaMo: false, moChat: 1, moChinh: 0 });
    vi.useRealTimers();
  });
});
