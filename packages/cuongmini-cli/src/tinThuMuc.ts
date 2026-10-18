/**
 * THƯ MỤC ĐÃ TIN (đợt 6, 18/10/2026) — mở `cuongmini` ở BẤT KỲ thư mục nào, như Claude Code: lần đầu ở một thư mục mới
 * thì hỏi "Accessing workspace: <path> — Quick safety check…" (Có, tôi tin thư mục này / Không, thoát), nhớ thư mục đã
 * tin. Tin một thư mục ⇒ tin luôn các thư mục con. Thư mục HOME (hoặc gốc ổ đĩa) ⇒ cảnh báo rõ hơn, con trỏ mặc định ở
 * "Không" — CuongMini đọc/sửa/chạy lệnh được trên TOÀN BỘ dữ liệu cá nhân.
 *
 * Lưu ở `~/.cuongmini/thu-muc-tin.json` (0600): `{ "tin": { "<đường dẫn tuyệt đối>": "<ISO>" } }`.
 * Không hỏi: chế độ in (`-p`), lệnh phụ, và `CUONGMINI_TIN_THU_MUC=1` (CI / kiểm thử tự động).
 */
import { readFileSync, realpathSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { damBaoThuMuc, thuMucGoc } from './phien';

const fileTin = (): string => path.join(thuMucGoc(), 'thu-muc-tin.json');

/** Chuẩn hoá đường dẫn (Windows: không phân biệt hoa thường). */
function chuan(p: string): string {
  /* Đường thật (symlink như /var ⇒ /private/var trên macOS): HOME và thư mục đang mở phải so được với nhau. */
  let r = path.resolve(p);
  try { r = realpathSync(r); } catch { /* chưa tồn tại ⇒ giữ đường đã resolve */ }
  return process.platform === 'win32' ? r.toLowerCase() : r;
}

function docTin(): Record<string, string> {
  try {
    const j = JSON.parse(readFileSync(fileTin(), 'utf8')) as { tin?: unknown };
    return j.tin && typeof j.tin === 'object' ? (j.tin as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/** Thư mục HOME hoặc gốc ổ đĩa — tin nó là tin MỌI THỨ của người dùng. */
export function laThuMucNhayCam(thuMuc: string): boolean {
  const p = chuan(thuMuc);
  return p === chuan(os.homedir()) || p === path.parse(p).root;
}

/** Đã tin thư mục này (hoặc một thư mục cha — trừ HOME/gốc ổ: tin HOME không có nghĩa tin mọi thư mục con). */
export function daTin(thuMuc: string, env: NodeJS.ProcessEnv = process.env): boolean {
  if (env.CUONGMINI_TIN_THU_MUC === '1') return true;
  const p = chuan(thuMuc);
  const ds = Object.keys(docTin()).map(chuan);
  if (ds.includes(p)) return true;
  return ds.some((t) => !laThuMucNhayCam(t) && (p.startsWith(`${t}${path.sep}`)));
}

/** Ghi nhận đã tin. Không ghi được (đĩa chỉ đọc…) ⇒ vẫn tin trong phiên này, không ném. */
export function ghiTin(thuMuc: string): void {
  try {
    const tin = { ...docTin(), [path.resolve(thuMuc)]: new Date().toISOString() };
    const giu = Object.entries(tin).sort((a, b) => (a[1] < b[1] ? 1 : -1)).slice(0, 500);
    damBaoThuMuc(thuMucGoc());
    writeFileSync(fileTin(), `${JSON.stringify({ tin: Object.fromEntries(giu) }, null, 2)}\n`, { mode: 0o600 });
  } catch { /* phiên này vẫn tin */ }
}

/** Đường dẫn hiện cho người đọc: `~` thay HOME. */
export function duongGon(thuMuc: string): string {
  const h = chuan(os.homedir());
  const p = chuan(thuMuc);
  return p === h ? '~' : p.startsWith(`${h}${path.sep}`) ? `~${path.sep}${p.slice(h.length + 1)}` : p;
}
