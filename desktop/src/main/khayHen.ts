/**
 * KHAY HỆ THỐNG khi còn HẸN (đợt 4, 18/10/2026) — Windows/Linux.
 *
 * Trên Windows/Linux đóng cửa sổ chính = thoát app (xem `index.ts`). Agent đã
 * hẹn "9:00 mai kiểm CI" mà người dùng đóng cửa sổ thì hẹn chết theo. Nên: còn
 * hẹn ⇒ app chạy NỀN với một biểu tượng khay (Mở lại · Thoát và huỷ hẹn); hết
 * hẹn ⇒ tự thoát như bình thường. macOS không cần — đóng cửa sổ không thoát app.
 * Hẹn vẫn được lưu xuống đĩa (`choHen.ts`): người dùng chọn Thoát thì lần mở sau
 * được hỏi chạy bù.
 */
import { app, Menu, nativeImage, Tray } from 'electron';
import { getSettings } from './store';

let khay: Tray | null = null;
let nhip: ReturnType<typeof setInterval> | null = null;

export function khayDangBat(): boolean { return khay !== null; }

function L(vi: string, en: string): string {
  try { return (getSettings() as Record<string, unknown>).ngonNgu === 'en' ? en : vi; } catch { return vi; }
}

export function tatKhay(): void {
  if (nhip) { clearInterval(nhip); nhip = null; }
  khay?.destroy();
  khay = null;
}

/** Bật khay. `moLai` mở lại cửa sổ chính; `soHen` đếm hẹn còn chờ. */
export async function batKhayHen(moLai: () => void, soHen: () => number): Promise<void> {
  if (khay) return;
  const anh = await app.getFileIcon(process.execPath, { size: 'small' }).catch(() => nativeImage.createEmpty());
  khay = new Tray(anh);
  const ve = (): void => {
    const n = soHen();
    khay?.setToolTip(L(`CuongThai — ${n} hẹn của agent đang chờ`, `CuongThai — ${n} agent schedule(s) pending`));
    khay?.setContextMenu(Menu.buildFromTemplate([
      { label: L('Mở CuongThai', 'Open CuongThai'), click: () => { tatKhay(); moLai(); } },
      { type: 'separator' },
      { label: L(`Thoát (hẹn còn lại chạy bù ở lần mở sau)`, `Quit (remaining schedules can run next launch)`), click: () => { tatKhay(); app.quit(); } },
    ]));
  };
  ve();
  khay.on('click', () => { tatKhay(); moLai(); });
  nhip = setInterval(() => { if (soHen() === 0) { tatKhay(); app.quit(); } else ve(); }, 30_000);
}
