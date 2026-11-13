/**
 * Luật tệp đính kèm Messenger PHÍA CLIENT (web + app desktop dùng chung — app nhúng cây messenger của web).
 *
 * ─── Vì sao (13/11/2026) ───
 * Bản cũ lọc theo `file.type` với danh sách TRẮNG (ảnh/âm thanh/video/pdf/text/zip/Word/Excel) và
 * `if (!mime) return false`. Trên Windows, Chromium/Electron lấy MIME từ registry nên `.md`, `.rar`, `.7z`…
 * thường có `file.type === ""` (hoặc `application/x-rar-compressed`) ⇒ bị từ chối ngay ở client với
 * "định dạng không được hỗ trợ", và ô chọn tệp (`accept=…`) còn giấu luôn chúng khỏi hộp thoại.
 *
 * Nay: MIME rỗng/lạ KHÔNG phải lý do từ chối. Chỉ chặn tệp CHẠY ĐƯỢC theo ĐUÔI (danh sách ĐEN) và cỡ.
 * Máy chủ kiểm lại y hệt (`src/storage/chatAttachmentPolicy.ts` — có test so hai danh sách) và còn soi chữ ký
 * đầu tệp (exe đổi tên), nên đây chỉ là báo sớm cho người dùng, không phải hàng rào bảo mật.
 */

/** Trần cỡ một tệp — khớp `CHAT_MAX_BYTES` ở máy chủ. */
export const TRAN_CO_TEP = 25 * 1024 * 1024;

/** Đuôi bị chặn — BẢN SAO của `CHAT_BLOCKED_EXT` (máy chủ). Sửa thì sửa cả hai. */
export const DUOI_BI_CHAN: ReadonlySet<string> = new Set([
  // Windows — chạy thẳng
  'exe', 'com', 'scr', 'pif', 'cpl', 'msi', 'msp', 'mst', 'msix', 'msixbundle', 'appx', 'appxbundle', 'appinstaller',
  'dll', 'sys', 'drv', 'ocx', 'gadget', 'msc', 'application', 'jnlp',
  // Windows — script / lối tắt / cấu hình chạy được
  'bat', 'cmd', 'ps1', 'psm1', 'psd1', 'ps1xml', 'psc1', 'vb', 'vbs', 'vbe', 'js', 'jse', 'mjs', 'cjs', 'ws', 'wsf',
  'wsh', 'wsc', 'sct', 'hta', 'lnk', 'url', 'scf', 'inf', 'reg', 'chm', 'settingcontent-ms',
  // Ảnh đĩa (bọc .exe để né cảnh báo tải về của Windows)
  'iso', 'img', 'vhd', 'vhdx',
  // macOS / Linux / Android / Java
  'app', 'dmg', 'pkg', 'command', 'sh', 'bash', 'zsh', 'csh', 'ksh', 'deb', 'rpm', 'run', 'apk', 'jar',
  // Office có macro
  'docm', 'dotm', 'xlsm', 'xltm', 'xlam', 'pptm', 'potm', 'ppam', 'ppsm',
  // Nội dung web chạy được nếu trình duyệt hiển thị nó
  'html', 'htm', 'xhtml', 'shtml', 'svg', 'svgz', 'php', 'phtml',
]);

/**
 * Đuôi thật theo cách Windows hiểu: bỏ dấu chấm/khoảng trắng ở cuối ("a.exe." chạy như .exe);
 * đuôi kép "a.pdf.exe" ⇒ "exe".
 */
export function duoiTep(ten: string): string {
  const t = (ten || '').replace(/[.\s]+$/g, '');
  const cham = t.lastIndexOf('.');
  if (cham <= 0 || cham === t.length - 1) return '';
  const duoi = t.slice(cham + 1).toLowerCase();
  return /[\\/]/.test(duoi) ? '' : duoi;
}

export type KetQuaKiemTep = { ok: true } | { ok: false; lyDo: string };

/** Kiểm một tệp trước khi tải lên. KHÔNG dựa vào `file.type` (Windows hay để rỗng). */
export function kiemTepGui(tep: { name: string; size: number }): KetQuaKiemTep {
  if (!tep.size) return { ok: false, lyDo: `${tep.name}: tệp rỗng` };
  if (tep.size > TRAN_CO_TEP) {
    return { ok: false, lyDo: `${tep.name}: vượt quá ${TRAN_CO_TEP / 1024 / 1024}MB` };
  }
  const duoi = duoiTep(tep.name);
  if (DUOI_BI_CHAN.has(duoi)) {
    return { ok: false, lyDo: `${tep.name}: không gửi được tệp .${duoi} (tệp chạy được) — hãy nén vào .zip` };
  }
  return { ok: true };
}
