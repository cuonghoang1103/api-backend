/**
 * Mã web đang chạy ở ĐÂU — trình duyệt, app desktop CuongThai, hay app CT Work riêng.
 *
 * App desktop dùng lại nguyên cây `/work` (và nhiều cây khác) của web. Hai cờ do
 * app đặt lên `globalThis` trước khi dựng React:
 *   • `__ctWebOrigin` — có ⇒ đang trong một app desktop (bất kể biến thể).
 *   • `__ctBienThe`   — `'ctwork'` ⇒ app CT Work RIÊNG (13/10/2026), app không có
 *     trang chính nào khác ngoài CT Work.
 *
 * ⚠️ `__ctWebOrigin` được gán SAU một vòng IPC lúc khởi động, còn `__ctBienThe`
 * gán đồng bộ trong `main.tsx`. Hỏi "có phải app desktop" thì dùng cả hai.
 */
type CoApp = { __ctWebOrigin?: string; __ctBienThe?: string; cuongthai?: unknown };

export function trongAppDesktop(): boolean {
  if (typeof globalThis === 'undefined') return false;
  const g = globalThis as CoApp;
  return Boolean(g.__ctBienThe || g.__ctWebOrigin || g.cuongthai);
}

/** Đang chạy trong app desktop CT Work riêng. */
export function laAppCtWork(): boolean {
  return typeof globalThis !== 'undefined' && (globalThis as CoApp).__ctBienThe === 'ctwork';
}
