/**
 * CHẾ ĐỘ `!` — chạy THẲNG một lệnh shell ở thư mục dự án (không qua AI), như
 * Claude Code. Đầu ra in ra màn hình và được đính vào câu hỏi KẾ TIẾP gửi model
 * (lõi không có kênh "thêm ngữ cảnh" riêng, nên đi kèm lượt sau là cách duy nhất
 * để model thấy nó — y như người dùng tự dán kết quả vào).
 *
 * Shell đúng hệ: `$SHELL` (zsh/bash) trên macOS/Linux, PowerShell trên Windows
 * (pwsh nếu có, không thì Windows PowerShell 5.1).
 */
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';

export interface LenhShell { file: string; args: string[] }

/** Chọn shell + tham số cho một dòng lệnh. `coPwsh` tiêm vào để test. */
export function lenhShell(cmd: string, nenTang: string = process.platform, env: NodeJS.ProcessEnv = process.env, coPwsh?: boolean): LenhShell {
  if (nenTang === 'win32') {
    const pwsh = coPwsh ?? spawnSync('where', ['pwsh'], { stdio: 'ignore', windowsHide: true }).status === 0;
    // Ép UTF-8 cho đầu ra: PowerShell 5.1 mặc định xuất theo bảng mã OEM ⇒ chữ tiếng Việt vỡ.
    const dau = '[Console]::OutputEncoding=[Text.Encoding]::UTF8; $OutputEncoding=[Text.Encoding]::UTF8; ';
    return { file: pwsh ? 'pwsh' : 'powershell.exe', args: ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', dau + cmd] };
  }
  const sh = env.SHELL && /(^|\/)(zsh|bash|sh|fish|dash|ksh)$/.test(env.SHELL) ? env.SHELL : '/bin/sh';
  return { file: sh, args: ['-c', cmd] };
}

export interface KetQuaShell { ma: number | null; ra: string; giay: number; biHuy: boolean }

const TRAN_RA = 200_000;

/** Chạy lệnh; `khiRa` nhận từng mẩu đầu ra (stdout + stderr gộp). `huy()` diệt cả cây tiến trình. */
export function chayShell(cmd: string, cwd: string, khiRa: (m: string) => void): { xong: Promise<KetQuaShell>; huy: () => void } {
  const { file, args } = lenhShell(cmd);
  const batDau = Date.now();
  let ra = '';
  let biHuy = false;
  let p: ChildProcess;
  const xong = new Promise<KetQuaShell>((tra) => {
    try {
      p = spawn(file, args, {
        cwd, env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1', CUONGMINI_SHELL: '1' },
        stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
        // Nhóm tiến trình riêng (Unix) ⇒ huỷ được cả lệnh con (`npm test` sinh node…).
        detached: process.platform !== 'win32',
      });
    } catch (e) {
      tra({ ma: 127, ra: (e as Error).message, giay: 0, biHuy: false });
      return;
    }
    const nhan = (b: Buffer) => { const m = b.toString('utf8'); ra = (ra + m).slice(-TRAN_RA); khiRa(m); };
    p.stdout?.on('data', nhan);
    p.stderr?.on('data', nhan);
    p.once('error', (e) => tra({ ma: 127, ra: `${ra}${e.message}`, giay: (Date.now() - batDau) / 1000, biHuy }));
    p.once('close', (ma) => tra({ ma, ra, giay: (Date.now() - batDau) / 1000, biHuy }));
  });
  const huy = () => {
    biHuy = true;
    if (!p?.pid) return;
    try {
      if (process.platform === 'win32') spawn('taskkill', ['/pid', String(p.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
      else process.kill(-p.pid, 'SIGTERM');
    } catch { /* đã thoát */ }
  };
  return { xong, huy };
}

/** Bỏ mã điều khiển terminal khỏi đầu ra (lệnh có thể tự tô màu dù đã đặt NO_COLOR). */
export const sachDauRa = (s: string): string => s.replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '').replace(/\x1b\][^\x07]*\x07/g, '').replace(/\r(?!\n)/g, '\n');

export interface LanChayShell { lenh: string; ma: number | null; ra: string }

/**
 * Đoạn ngữ cảnh đính vào câu hỏi kế tiếp. Trần ~3500 ký tự cho TẤT CẢ lần chạy
 * (câu gửi lõi tối đa 8000 ký tự) — giữ ĐUÔI đầu ra, nơi thường có lỗi/kết quả.
 */
export function dungNguCanhShell(ds: readonly LanChayShell[], tran = 3500): string {
  if (!ds.length) return '';
  const moiCai = Math.max(300, Math.floor(tran / ds.length));
  const khoi = ds.map((l) => {
    let ra = sachDauRa(l.ra).trim();
    if (ra.length > moiCai) ra = `… (đã cắt ${ra.length - moiCai} ký tự đầu)\n${ra.slice(-moiCai)}`;
    return `$ ${l.lenh}\n${ra || '(không có đầu ra)'}\n[mã thoát ${l.ma ?? '?'}]`;
  });
  return `[Tôi đã tự chạy trong terminal, ở thư mục dự án — kết quả để bạn tham khảo:]\n\`\`\`\n${khoi.join('\n\n').replace(/```/g, 'ˋˋˋ')}\n\`\`\`\n\n`;
}
