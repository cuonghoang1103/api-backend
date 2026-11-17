/**
 * "Tải trên máy này": khi trạm không tải được link, app tải bằng yt-dlp CHÍNH THỨC trên máy người dùng rồi gửi lên
 * như một tệp. Không có mẹo vượt chặn nào ở đây (không cookie trình duyệt, không giả trình duyệt, không proxy):
 * tải được bằng mạng của máy này thì dùng, không được thì báo lỗi.
 *
 * Nhị phân yt-dlp tải lần đầu dùng từ bản phát hành GitHub chính thức vào `<dữ liệu app>/bin/`, KIỂM SHA-256 theo
 * tệp `SHA2-256SUMS` của cùng bản phát hành, rồi chạy thử `--version`. Hỏng bất kỳ bước nào ⇒ xoá tệp, báo lỗi.
 *
 * ffmpeg (ghép hình 1080p + tiếng): bản gói kèm (`ffmpeg-static`) ⇒ ffmpeg trong PATH ⇒ không có thì chỉ tải
 * định dạng ĐÃ GHÉP SẴN (thường tối đa 720p) và nói rõ cho người dùng.
 */
import { app } from 'electron';
import { spawn, execFile } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { docDongYtDlp } from '../shared/hoiDinhKy';

const GOC_PHAT_HANH = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download';

function tenNhiPhan(): string {
  if (process.platform === 'darwin') return 'yt-dlp_macos';
  if (process.platform === 'win32') return 'yt-dlp.exe';
  return process.arch === 'arm64' ? 'yt-dlp_linux_aarch64' : 'yt-dlp_linux';
}

const thuMucBin = () => path.join(app.getPath('userData'), 'bin');

function chayThu(file: string, args: string[], hetGio = 60_000): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(file, args, { timeout: hetGio, windowsHide: true }, (err, out) => (err ? reject(err) : resolve(String(out).trim())));
  });
}

async function taiBuffer(url: string): Promise<Buffer> {
  const r = await fetch(url, { redirect: 'follow' });
  if (!r.ok) throw new Error(`HTTP ${r.status} khi tải ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

let dangChuanBi: Promise<string> | null = null;

/** Đường dẫn yt-dlp chạy được — tải + kiểm lần đầu. */
export function chuanBiYtDlp(baoBuoc: (s: string) => void): Promise<string> {
  dangChuanBi ??= (async () => {
    const ten = tenNhiPhan();
    const dich = path.join(thuMucBin(), process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');
    if (fs.existsSync(dich)) {
      try { await chayThu(dich, ['--version']); return dich; } catch { await fsp.rm(dich, { force: true }); }
    }
    baoBuoc('Tải công cụ yt-dlp (lần đầu)');
    await fsp.mkdir(thuMucBin(), { recursive: true });
    const [nhiPhan, tong] = await Promise.all([taiBuffer(`${GOC_PHAT_HANH}/${ten}`), taiBuffer(`${GOC_PHAT_HANH}/SHA2-256SUMS`)]);
    const mong = tong.toString('utf8').split('\n').map((d) => d.trim().split(/\s+/)).find((p) => p[1] === ten)?.[0];
    const that = crypto.createHash('sha256').update(nhiPhan).digest('hex');
    if (!mong || mong.toLowerCase() !== that) throw new Error('yt-dlp tải về không khớp mã kiểm SHA-256 — đã bỏ.');
    const tam = `${dich}.tai`;
    await fsp.writeFile(tam, nhiPhan, { mode: 0o755 });
    await fsp.rename(tam, dich);
    baoBuoc('Kiểm tra yt-dlp');
    try {
      await chayThu(dich, ['--version'], 120_000);
    } catch (e) {
      await fsp.rm(dich, { force: true });
      throw new Error(`yt-dlp không chạy được trên máy này: ${(e as Error).message}`);
    }
    return dich;
  })().finally(() => { dangChuanBi = null; });
  return dangChuanBi;
}

/** ffmpeg chạy được: bản gói kèm ⇒ PATH ⇒ null. */
export async function timFfmpeg(): Promise<string | null> {
  const exe = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  const ung: string[] = [
    path.join(app.getAppPath(), 'node_modules', 'ffmpeg-static', exe).replace(`app.asar${path.sep}`, `app.asar.unpacked${path.sep}`),
  ];
  if (process.platform !== 'win32') ung.push('/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg', '/usr/bin/ffmpeg');
  for (const p of (process.env.PATH ?? '').split(path.delimiter)) if (p) ung.push(path.join(p, exe));
  for (const f of ung) {
    if (!fs.existsSync(f)) continue;
    try { await chayThu(f, ['-version'], 15_000); return f; } catch { /* thử cái sau */ }
  }
  return null;
}

export interface KetQuaYtDlp {
  duongDan: string;
  tieuDe: string | null;
  /** Không có ffmpeg ⇒ chỉ tải được bản ghép sẵn (chất lượng có thể thấp hơn 1080p). */
  thieuFfmpeg: boolean;
}

export async function taiBangYtDlp(
  link: string,
  thuMucTam: string,
  baoTienDo: (phanTram: number | null, buoc: string) => void,
  signal: AbortSignal,
): Promise<KetQuaYtDlp> {
  const yt = await chuanBiYtDlp((b) => baoTienDo(null, b));
  const ffmpeg = await timFfmpeg();
  await fsp.mkdir(thuMucTam, { recursive: true });
  const args = [
    '--no-playlist', '--newline', '--progress', '--no-simulate', '--no-mtime',
    '--progress-template', 'download:CTLT|%(progress.downloaded_bytes)s|%(progress.total_bytes)s|%(progress.total_bytes_estimate)s',
    '--print', 'before_dl:CTLTTITLE|%(title)s',
    '--print', 'after_move:CTLTFILE|%(filepath)s',
    '-o', path.join(thuMucTam, '%(id)s.%(ext)s'),
  ];
  if (ffmpeg) {
    args.push('-f', 'bv*[height<=1080][ext=mp4]+ba[ext=m4a]/b[height<=1080][ext=mp4]/b[height<=1080]', '--merge-output-format', 'mp4', '--ffmpeg-location', ffmpeg);
  } else {
    args.push('-f', 'b[height<=1080][ext=mp4]/b[height<=1080]');
  }
  args.push('--', link);

  return new Promise<KetQuaYtDlp>((resolve, reject) => {
    const p = spawn(yt, args, { windowsHide: true });
    let tieuDe: string | null = null;
    let tep: string | null = null;
    let phan = 0;
    let loiCuoi = '';
    const huy = () => p.kill();
    signal.addEventListener('abort', huy, { once: true });
    let du = '';
    p.stdout.on('data', (c: Buffer) => {
      du += c.toString('utf8');
      const dong = du.split(/\r?\n/);
      du = dong.pop() ?? '';
      for (const d of dong) {
        if (d.startsWith('CTLTTITLE|')) { tieuDe = d.slice(10).trim() || null; phan += 1; continue; }
        if (d.startsWith('CTLTFILE|')) { tep = d.slice(9).trim(); continue; }
        const td = docDongYtDlp(d);
        if (td) {
          const pt = td.tong ? Math.min(100, Math.round((td.daNhan / td.tong) * 100)) : null;
          baoTienDo(pt, ffmpeg ? `Tải hình + tiếng (phần ${Math.max(1, phan)})` : 'Tải video');
        }
      }
    });
    p.stderr.on('data', (c: Buffer) => {
      const s = c.toString('utf8').trim();
      if (s) loiCuoi = s.split('\n').filter((d) => /error/i.test(d)).pop() ?? loiCuoi;
    });
    p.on('error', (e) => reject(e));
    p.on('close', (ma) => {
      signal.removeEventListener('abort', huy);
      if (signal.aborted) return reject(new Error('Đã huỷ.'));
      if (ma === 0 && tep && fs.existsSync(tep)) return resolve({ duongDan: tep, tieuDe, thieuFfmpeg: !ffmpeg });
      reject(new Error(loiCuoi.replace(/^ERROR:\s*/i, '') || `yt-dlp dừng với mã ${ma}.`));
    });
  });
}
