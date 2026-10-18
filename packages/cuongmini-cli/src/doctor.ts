/**
 * `cuongmini doctor` — kiểm phía MÁY (không cần lõi chạy): Node, nơi cài, PATH,
 * phiên đăng nhập, mạng tới máy chủ, trình duyệt cho tool web, clipboard ảnh,
 * thông báo, màu/Unicode của terminal. Trong phiên, `/doctor` gộp thêm phần
 * chẩn đoán của lõi.
 */
import { spawnSync } from 'node:child_process';
import { accessSync, constants, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { API_ORIGIN, lamMoi, LoiDangNhap } from '../../cuongmini-core/src/dangNhap';
import { timTrinhDuyet } from '../../cuongmini-core/src/timTrinhDuyet';
import { kiemWindows } from './doctorWin';
import { L } from './i18n';
import { capMau, doCapMau } from './mau';
import { laAscii } from './kyTu';
import { damBaoThuMuc, docPhien, tenHienThi, thuMucGoc } from './phien';

export interface MucKiem { ten: string; muc: 'ok' | 'canh' | 'loi'; chiTiet: string }

/** Có lệnh `ten` trong PATH không (where trên Windows, command -v nơi khác). */
export function coLenh(ten: string): string | null {
  const r = process.platform === 'win32'
    ? spawnSync('where', [ten], { encoding: 'utf8', windowsHide: true })
    : spawnSync('/bin/sh', ['-c', `command -v ${ten.replace(/[^\w.-]/g, '')}`], { encoding: 'utf8' });
  return r.status === 0 ? (r.stdout ?? '').split(/\r?\n/)[0]!.trim() || ten : null;
}

export async function kiemMay(phienBan: string): Promise<MucKiem[]> {
  const ds: MucKiem[] = [];
  const major = Number(process.versions.node.split('.')[0]);
  ds.push({ ten: 'Node', muc: major >= 20 ? 'ok' : 'loi', chiTiet: `${process.versions.node} (${process.execPath})${major >= 20 ? '' : L(' — cần ≥ 20, chạy lại lệnh cài để tự tải Node', ' — needs ≥ 20, re-run the installer to download Node')}` });
  ds.push({ ten: 'CuongMini', muc: 'ok', chiTiet: `${phienBan} · ${process.platform}/${process.arch} · ${path.dirname(path.dirname(fileURLToPath(import.meta.url)))}` });

  const tenPath = L('Lệnh trong PATH', 'Command on PATH');
  const lenh = coLenh('cuongmini');
  const binDir = process.platform === 'win32' ? '%LOCALAPPDATA%\\CuongMini\\bin' : '~/.local/bin';
  ds.push(lenh
    ? { ten: tenPath, muc: 'ok', chiTiet: lenh }
    : { ten: tenPath, muc: 'canh', chiTiet: L(`chưa thấy \`cuongmini\` trong PATH — mở terminal mới, hoặc thêm ${binDir} vào PATH`, `\`cuongmini\` is not on PATH yet — open a new terminal, or add ${binDir} to PATH`) });
  // Windows: PATH registry ↔ cửa sổ này, shell đang dùng, TTY — kèm lệnh sửa đúng shell (doctorWin.ts).
  if (process.platform === 'win32') ds.push(...kiemWindows(lenh));

  const tenDl = L('Thư mục dữ liệu', 'Data directory');
  try {
    damBaoThuMuc(thuMucGoc());
    accessSync(thuMucGoc(), constants.W_OK);
    ds.push({ ten: tenDl, muc: 'ok', chiTiet: `${thuMucGoc()} — ${L('ghi được', 'writable')}` });
  } catch (e) {
    ds.push({ ten: tenDl, muc: 'loi', chiTiet: `${thuMucGoc()} — ${(e as Error).message}` });
  }

  const tenDn = L('Đăng nhập', 'Sign-in');
  const p = docPhien();
  if (!p) ds.push({ ten: tenDn, muc: 'canh', chiTiet: L('chưa đăng nhập — chạy `cuongmini login`', 'not signed in — run `cuongmini login`') });
  else {
    try {
      const n = await lamMoi(p.token);
      ds.push({ ten: tenDn, muc: 'ok', chiTiet: L(`${tenHienThi(n)} — phiên còn hiệu lực`, `${tenHienThi(n)} — session valid`) });
    } catch (e) {
      ds.push(e instanceof LoiDangNhap && e.ma === 'hetHan'
        ? { ten: tenDn, muc: 'loi', chiTiet: L('phiên đã hết hạn — chạy `cuongmini login`', 'session expired — run `cuongmini login`') }
        : { ten: tenDn, muc: 'canh', chiTiet: L(`không kiểm được (${(e as Error).message})`, `could not check (${(e as Error).message})`) });
    }
  }

  const tenMang = L('Mạng tới máy chủ', 'Server reachability');
  const t0 = Date.now();
  try {
    const r = await fetch(`${API_ORIGIN}/api/v1/health`, { signal: AbortSignal.timeout(8000) });
    ds.push({ ten: tenMang, muc: r.status < 500 ? 'ok' : 'canh', chiTiet: L(`${API_ORIGIN} trả HTTP ${r.status} sau ${Date.now() - t0}ms`, `${API_ORIGIN} returned HTTP ${r.status} in ${Date.now() - t0}ms`) });
  } catch (e) {
    ds.push({ ten: tenMang, muc: 'loi', chiTiet: L(`không tới được ${API_ORIGIN} (${(e as Error).message})`, `cannot reach ${API_ORIGIN} (${(e as Error).message})`) });
  }

  const tenTd = L('Trình duyệt cho tool web', 'Browser for web tools');
  const td = timTrinhDuyet();
  ds.push(td
    ? { ten: tenTd, muc: 'ok', chiTiet: td }
    : { ten: tenTd, muc: 'canh', chiTiet: L('không thấy Chrome/Edge/Brave/Chromium — AI sẽ KHÔNG mở được web. Cài Google Chrome (google.com/chrome) hoặc Microsoft Edge, hoặc đặt CUONGMINI_TRINH_DUYET trỏ tới file chạy', 'no Chrome/Edge/Brave/Chromium found — the AI can NOT browse. Install Google Chrome (google.com/chrome) or Microsoft Edge, or set CUONGMINI_TRINH_DUYET to the executable') });

  const tenDan = L('Dán ảnh (ctrl+v)', 'Paste image (ctrl+v)');
  const clip = process.platform === 'darwin' ? (coLenh('pngpaste') ?? coLenh('osascript'))
    : process.platform === 'win32' ? coLenh('powershell.exe') ?? coLenh('pwsh')
      : coLenh('wl-paste') ?? coLenh('xclip');
  ds.push(clip ? { ten: tenDan, muc: 'ok', chiTiet: L(`dùng ${path.basename(clip)}`, `via ${path.basename(clip)}`) }
    : { ten: tenDan, muc: 'canh', chiTiet: process.platform === 'linux' ? L('cài wl-clipboard hoặc xclip để dán ảnh', 'install wl-clipboard or xclip to paste images') : L('không có công cụ đọc clipboard', 'no clipboard tool found') });

  const tenTb = L('Thông báo hệ điều hành', 'OS notifications');
  const tb = process.platform === 'darwin' ? coLenh('osascript') : process.platform === 'win32' ? coLenh('powershell.exe') : coLenh('notify-send');
  ds.push(tb ? { ten: tenTb, muc: 'ok', chiTiet: path.basename(tb) }
    : { ten: tenTb, muc: 'canh', chiTiet: process.platform === 'linux' ? L('không có notify-send (gói libnotify) — chỉ còn chuông', 'no notify-send (libnotify) — bell only') : L('không có — chỉ còn chuông', 'none — bell only') });

  const sh = process.platform === 'win32' ? (coLenh('pwsh') ? 'pwsh' : 'powershell.exe') : process.env.SHELL ?? '/bin/sh';
  ds.push({ ten: L('Shell cho lệnh !', 'Shell for !commands'), muc: 'ok', chiTiet: sh });
  /*
   * Đầu ra KHÔNG phải terminal (chạy qua ống `| cat`, hoặc agent gọi `cuongmini doctor` bằng tool) ⇒ màu tắt cho
   * RIÊNG lần chạy này, còn terminal thật vẫn có màu. Trước 18/10/2026 dòng này báo cảnh báo "không màu" trên
   * iTerm2 ⇒ người dùng tưởng terminal hỏng. Nay báo mức màu của TERMINAL (tính như thể là TTY) và nói rõ lý do.
   */
  const laTTY = Boolean(process.stdout.isTTY);
  const tenMau = [L('không màu', 'no color'), L('16 màu', '16 colors'), L('256 màu', '256 colors'), 'truecolor'];
  const mauChu = laTTY ? tenMau[capMau()]
    : `${tenMau[doCapMau(process.env, true)]} (${L('lần chạy này đầu ra đi qua ống/agent nên tắt màu — mở trực tiếp trong terminal vẫn có màu', 'this run is piped/run by an agent so color is off — color works when run directly in the terminal')})`;
  ds.push({
    ten: 'Terminal', muc: 'ok',
    chiTiet: `${process.env.TERM_PROGRAM ?? process.env.TERM ?? (process.env.WT_SESSION ? 'Windows Terminal' : L('không rõ', 'unknown'))} · ${mauChu} · ${laAscii() ? L('ký tự ASCII', 'ASCII characters') : 'Unicode'}`,
  });
  if (existsSync(path.join(thuMucGoc(), 'node'))) ds.push({ ten: L('Node riêng', 'Bundled Node'), muc: 'ok', chiTiet: path.join(thuMucGoc(), 'node') });
  return ds;
}

export function inKetQua(ds: readonly MucKiem[]): string {
  const dau = { ok: '✓', canh: '⚠', loi: '✗' };
  const be = Math.max(...ds.map((m) => m.ten.length));
  return ds.map((m) => `${dau[m.muc]} ${m.ten.padEnd(be)}  ${m.chiTiet}`).join('\n');
}
