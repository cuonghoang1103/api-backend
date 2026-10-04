/**
 * ============================================================
 * "BẠN KHÔNG CẦN TÔI NỮA Ư?" — robot hỏi trước khi app thoát
 * ============================================================
 *
 * Người dùng 04/10/2026: thoát/tắt app (⌘Q, menu Quit, đóng cửa sổ chính trên
 * Windows/Linux) ⇒ con robot hiện lên hỏi. "Có" = huỷ thoát, "Không" = thoát
 * thật. Câu hỏi hiện ở CON ROBOT NGƯỜI DÙNG ĐANG THẤY: con trong app nếu cửa
 * sổ chính đang có tiêu điểm, con nổi nếu không — vẫn là MỘT con robot.
 *
 * ─── KHÔNG HỎI KHI ───
 *  • cài bản cập nhật (`choPhepThoatThang()` trước `quitAndInstall`; `app.exit`
 *    của đường tự cập nhật macOS vốn không qua `before-quit`);
 *  • hệ điều hành tắt máy / đăng xuất (`powerMonitor` 'shutdown', Windows
 *    'session-end') — huỷ thoát ở đó là chặn cả việc tắt máy;
 *  • chạy kiểm thử/smoke: bản KHÔNG đóng gói mặc định không hỏi (bật bằng
 *    `CT_HOI_THOAT=1` để kiểm chính tính năng này), và `CT_KHONG_HOI_THOAT=1`
 *    tắt hẳn ở mọi bản;
 *  • người dùng tắt "Hỏi trước khi thoát" trong Cài đặt (`robotHoiThoat`).
 *
 * ─── KHÔNG BAO GIỜ KẸT ───
 * Robot phải BÁO ĐÃ NHẬN trong `HAN_NHAN_MS`; không báo (renderer treo, trang
 * đang nạp) ⇒ thoát luôn. Đã nhận mà người dùng bỏ đi ⇒ sau `HAN_TRA_LOI_MS`
 * cũng thoát. Đã chọn "Không" ⇒ cờ `choThoat` bật, `app.quit()` lần hai đi
 * thẳng — không vòng lặp.
 */
import { app, BrowserWindow, dialog, powerMonitor } from 'electron';
import { getSettings } from './store';
import { TU_DIEN } from '../renderer/i18n/tuDien';

export const HAN_NHAN_MS = 3000;
export const HAN_TRA_LOI_MS = 120_000;

let choThoat = false;
let demId = 0;
let dangHoi: { id: number; nhan: () => void; ket: (giuLai: boolean) => void } | null = null;

/** Thoát KHÔNG hỏi từ giờ trở đi (cập nhật, tắt máy, đã trả lời "Không"). */
export function choPhepThoatThang(): void { choThoat = true; }

/** Có hỏi hay không — thuần, kiểm được. */
export function nenHoiThoat(o: {
  daDongGoi: boolean;
  env: Record<string, string | undefined>;
  thietDat: { robotHoiThoat?: unknown };
}): boolean {
  if (o.env.CT_KHONG_HOI_THOAT === '1') return false;
  if (!o.daDongGoi && o.env.CT_HOI_THOAT !== '1') return false;
  return o.thietDat.robotHoiThoat !== false;
}

function nenHoi(): boolean {
  return !choThoat && nenHoiThoat({ daDongGoi: app.isPackaged, env: process.env, thietDat: getSettings() });
}

/** Dịch cho main (khoá có thể mang ngữ cảnh `thoat|…` — gỡ đi khi hiện). */
function d(cau: string): string {
  const tho = cau.replace(/^[a-z_]{2,20}\|/, '');
  return getSettings().ngonNgu === 'en' ? TU_DIEN[cau] ?? tho : tho;
}

/** Robot (renderer) báo đã hiện câu hỏi / người dùng đã chọn. */
export function traLoiThoat(p: { id: number; daNhan?: boolean | undefined; giuLai?: boolean | undefined }): void {
  if (!dangHoi || dangHoi.id !== p.id) return;
  if (typeof p.giuLai === 'boolean') dangHoi.ket(p.giuLai);
  else if (p.daNhan) dangHoi.nhan();
}

async function hoiBangHopThoai(cha: BrowserWindow | null): Promise<boolean> {
  const tuyChon = {
    type: 'question' as const,
    message: d('Bạn không cần tôi nữa ư?'),
    buttons: [d('thoat|Có'), d('thoat|Không')],
    defaultId: 0,
    cancelId: 0,
  };
  const r = cha ? await dialog.showMessageBox(cha, tuyChon) : await dialog.showMessageBox(tuyChon);
  return r.response === 0;
}

/** Hỏi; trả `true` nếu người dùng muốn Ở LẠI. */
async function hoi(): Promise<boolean> {
  const { cuaSoChinh, cuaSoRobot, dangOTrongApp } = await import('./robotNoi');
  const chinh = cuaSoChinh();
  const rb = cuaSoRobot();

  /* Robot đang tắt ⇒ không có con nào để hỏi; hộp thoại hệ thống, cùng câu. */
  if (getSettings().robotEnabled === false) {
    return hoiBangHopThoai(chinh && chinh.isVisible() ? chinh : null);
  }

  let dich: BrowserWindow | null = null;
  if (chinh && chinh.isVisible() && !chinh.isMinimized() && dangOTrongApp()) dich = chinh;
  else if (rb) { rb.showInactive(); dich = rb; }
  else if (chinh) {
    if (chinh.isMinimized()) chinh.restore();
    chinh.show();
    chinh.focus();
    dich = chinh;
  }
  if (!dich || dich.isDestroyed()) return false;

  const id = ++demId;
  return new Promise<boolean>((xong) => {
    let hen: ReturnType<typeof setTimeout> = setTimeout(() => ket(false), HAN_NHAN_MS);
    function ket(giuLai: boolean): void {
      clearTimeout(hen);
      if (dangHoi?.id === id) dangHoi = null;
      xong(giuLai);
    }
    dangHoi = {
      id,
      nhan: () => { clearTimeout(hen); hen = setTimeout(() => ket(false), HAN_TRA_LOI_MS); },
      ket,
    };
    dich!.webContents.send('robot:hoiThoat', { id });
  });
}

/** Đang hỏi rồi mà lại có lệnh thoát nữa (bấm ⌘Q lần hai) ⇒ không hỏi chồng. */
function batDauHoi(khiThoat: () => void): void {
  if (dangHoi) return;
  void hoi().then((giuLai) => {
    if (giuLai) return;
    choThoat = true;
    khiThoat();
  }).catch(() => { choThoat = true; khiThoat(); });
}

/**
 * Gọi SỚM trong `bootstrap` (sau `whenReady`), trước mọi `before-quit` khác —
 * và mọi việc dọn dẹp lúc thoát phải nằm ở `will-quit` (chỉ bắn khi thoát
 * THẬT), không ở `before-quit` (bắn cả khi lần thoát bị huỷ).
 */
export function dangKyHoiThoat(): void {
  app.on('before-quit', (e) => {
    if (!nenHoi()) return;
    e.preventDefault();
    batDauHoi(() => app.quit());
  });
  try {
    powerMonitor.on('shutdown', () => { choThoat = true; });
  } catch { /* nền tảng không có */ }
}

/**
 * Windows/Linux: đóng cửa sổ chính = thoát app (xem `index.ts`). Hỏi TRƯỚC
 * khi cửa sổ đóng — hỏi sau thì "Có" để lại một app không còn cửa sổ chính.
 */
export function ganCuaSoChinh(w: BrowserWindow): void {
  w.on('session-end', () => { choThoat = true; });
  if (process.platform === 'darwin') return;
  w.on('close', (e) => {
    if (!nenHoi()) return;
    e.preventDefault();
    batDauHoi(() => { if (!w.isDestroyed()) w.close(); });
  });
}
