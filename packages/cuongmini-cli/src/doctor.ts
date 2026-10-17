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
import { capMau } from './mau';
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
  ds.push({ ten: 'Node', muc: major >= 20 ? 'ok' : 'loi', chiTiet: `${process.versions.node} (${process.execPath})${major >= 20 ? '' : ' — cần ≥ 20, chạy lại lệnh cài để tự tải Node'}` });
  ds.push({ ten: 'CuongMini', muc: 'ok', chiTiet: `${phienBan} · ${process.platform}/${process.arch} · ${path.dirname(path.dirname(fileURLToPath(import.meta.url)))}` });

  const lenh = coLenh('cuongmini');
  ds.push(lenh
    ? { ten: 'Lệnh trong PATH', muc: 'ok', chiTiet: lenh }
    : { ten: 'Lệnh trong PATH', muc: 'canh', chiTiet: `chưa thấy \`cuongmini\` trong PATH — mở terminal mới, hoặc thêm ${process.platform === 'win32' ? '%LOCALAPPDATA%\\CuongMini\\bin' : '~/.local/bin'} vào PATH` });

  try {
    damBaoThuMuc(thuMucGoc());
    accessSync(thuMucGoc(), constants.W_OK);
    ds.push({ ten: 'Thư mục dữ liệu', muc: 'ok', chiTiet: `${thuMucGoc()} — ghi được` });
  } catch (e) {
    ds.push({ ten: 'Thư mục dữ liệu', muc: 'loi', chiTiet: `${thuMucGoc()} — ${(e as Error).message}` });
  }

  const p = docPhien();
  if (!p) ds.push({ ten: 'Đăng nhập', muc: 'canh', chiTiet: 'chưa đăng nhập — chạy `cuongmini login`' });
  else {
    try {
      const n = await lamMoi(p.token);
      ds.push({ ten: 'Đăng nhập', muc: 'ok', chiTiet: `${tenHienThi(n)} — phiên còn hiệu lực` });
    } catch (e) {
      ds.push(e instanceof LoiDangNhap && e.ma === 'hetHan'
        ? { ten: 'Đăng nhập', muc: 'loi', chiTiet: 'phiên đã hết hạn — chạy `cuongmini login`' }
        : { ten: 'Đăng nhập', muc: 'canh', chiTiet: `không kiểm được (${(e as Error).message})` });
    }
  }

  const t0 = Date.now();
  try {
    const r = await fetch(`${API_ORIGIN}/api/v1/health`, { signal: AbortSignal.timeout(8000) });
    ds.push({ ten: 'Mạng tới máy chủ', muc: r.status < 500 ? 'ok' : 'canh', chiTiet: `${API_ORIGIN} trả HTTP ${r.status} sau ${Date.now() - t0}ms` });
  } catch (e) {
    ds.push({ ten: 'Mạng tới máy chủ', muc: 'loi', chiTiet: `không tới được ${API_ORIGIN} (${(e as Error).message})` });
  }

  const td = timTrinhDuyet();
  ds.push(td
    ? { ten: 'Trình duyệt cho tool web', muc: 'ok', chiTiet: td }
    : { ten: 'Trình duyệt cho tool web', muc: 'canh', chiTiet: 'không thấy Chrome/Edge/Brave/Chromium — AI sẽ KHÔNG mở được web. Cài Google Chrome (google.com/chrome) hoặc Microsoft Edge, hoặc đặt CUONGMINI_TRINH_DUYET trỏ tới file chạy' });

  const clip = process.platform === 'darwin' ? (coLenh('pngpaste') ?? coLenh('osascript'))
    : process.platform === 'win32' ? coLenh('powershell.exe') ?? coLenh('pwsh')
      : coLenh('wl-paste') ?? coLenh('xclip');
  ds.push(clip ? { ten: 'Dán ảnh (ctrl+v)', muc: 'ok', chiTiet: `dùng ${path.basename(clip)}` }
    : { ten: 'Dán ảnh (ctrl+v)', muc: 'canh', chiTiet: process.platform === 'linux' ? 'cài wl-clipboard hoặc xclip để dán ảnh' : 'không có công cụ đọc clipboard' });

  const tb = process.platform === 'darwin' ? coLenh('osascript') : process.platform === 'win32' ? coLenh('powershell.exe') : coLenh('notify-send');
  ds.push(tb ? { ten: 'Thông báo hệ điều hành', muc: 'ok', chiTiet: path.basename(tb) }
    : { ten: 'Thông báo hệ điều hành', muc: 'canh', chiTiet: process.platform === 'linux' ? 'không có notify-send (gói libnotify) — chỉ còn chuông' : 'không có — chỉ còn chuông' });

  const sh = process.platform === 'win32' ? (coLenh('pwsh') ? 'pwsh' : 'powershell.exe') : process.env.SHELL ?? '/bin/sh';
  ds.push({ ten: 'Shell cho lệnh !', muc: 'ok', chiTiet: sh });
  ds.push({
    ten: 'Terminal', muc: process.stdout.isTTY ? 'ok' : 'canh',
    chiTiet: `${process.env.TERM_PROGRAM ?? process.env.TERM ?? (process.env.WT_SESSION ? 'Windows Terminal' : 'không rõ')} · ${['không màu', '16 màu', '256 màu', 'truecolor'][capMau()]} · ${laAscii() ? 'ký tự ASCII' : 'Unicode'}`,
  });
  if (existsSync(path.join(thuMucGoc(), 'node'))) ds.push({ ten: 'Node riêng', muc: 'ok', chiTiet: path.join(thuMucGoc(), 'node') });
  return ds;
}

export function inKetQua(ds: readonly MucKiem[]): string {
  const dau = { ok: '✓', canh: '⚠', loi: '✗' };
  const be = Math.max(...ds.map((m) => m.ten.length));
  return ds.map((m) => `${dau[m.muc]} ${m.ten.padEnd(be)}  ${m.chiTiet}`).join('\n');
}
