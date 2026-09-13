/**
 * ============================================================
 * CHẠY LỆNH VỚI QUYỀN QUẢN TRỊ
 * ============================================================
 *
 * Người dùng báo: AI Code không cài được `npm i -g ...` trên Windows/Linux, và
 * lời khuyên duy nhất nó đưa được là "bạn tự mở CMD Admin rồi gõ tay" — thứ mà
 * họ làm mãi không xong.
 *
 * ─── BA LỚP CHẶN, VÀ KHÔNG LỚP NÀO BỎ ĐƯỢC ───
 *  1. Người dùng đọc NGUYÊN VĂN lệnh trong app rồi bấm duyệt. Lệnh quyền cao
 *     luôn xếp mức `nguyhiem` ⇒ không bao giờ tự duyệt, không bao giờ ghi nhớ.
 *  2. HỆ ĐIỀU HÀNH hỏi tiếp bằng hộp của chính nó: UAC trên Windows, hộp mật
 *     khẩu trên macOS, polkit trên Linux. App KHÔNG giữ mật khẩu, không thấy
 *     mật khẩu, và không có đường nào bỏ qua bước này.
 *  3. Lệnh chạy trong thư mục dự án như mọi lệnh khác, có trần thời gian.
 *
 * ─── ⚠️⚠️ VÌ SAO LỆNH ĐI QUA BIẾN MÔI TRƯỜNG, KHÔNG QUA CHUỖI ───
 * Cách hiển nhiên là nhồi chuỗi lệnh vào giữa một câu PowerShell/AppleScript.
 * Làm thế là dựng một chỗ tiêm lệnh NGAY BÊN TRONG đường chạy quyền root: chỉ
 * cần một dấu nháy không được thoát đúng, thứ chạy ra sẽ KHÁC thứ người dùng
 * vừa đọc và bấm duyệt. Mà lớp chặn số 1 ở trên đứng hay đổ hoàn toàn dựa vào
 * "cái hiện ra chính là cái chạy".
 *
 * Nên chuỗi lệnh KHÔNG bao giờ được nối vào script. Nó đi qua biến môi trường
 * `CT_LENH_QUYEN_CAO`, còn script chỉ đọc biến đó ra. Không có tầng thoát ký
 * tự nào ⇒ không có tầng nào để sai.
 */
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** Tên biến môi trường chở chuỗi lệnh sang tiến trình có quyền. */
export const BIEN_LENH = 'CT_LENH_QUYEN_CAO';
/** Tên biến chở đường dẫn tệp hứng đầu ra (chỉ Windows cần). */
export const BIEN_RA = 'CT_RA_QUYEN_CAO';

export type Nen = 'win32' | 'darwin' | 'linux';

export interface CachGoi {
  /** Chương trình chạy. Gọi bằng MẢNG tham số, không qua shell. */
  prog: string;
  args: string[];
  /**
   * Đầu ra có quay về `stdout` không.
   *
   * Windows thì KHÔNG: `Start-Process -Verb RunAs` mở một console MỚI ở phiên
   * có quyền, và console đó không nối vào tiến trình này. Phải cho nó ghi ra
   * tệp rồi đọc lại — xem `chayQuyenCao`.
   */
  raQuaTep: boolean;
}

/**
 * Cách gọi cho từng nền tảng.
 *
 * Hàm THUẦN: không chạy gì, chỉ dựng lời gọi — để phép kiểm ghim được đúng
 * hình dạng, nhất là điều quan trọng nhất: chuỗi lệnh KHÔNG xuất hiện trong
 * `args`.
 */
export function cachGoi(nen: Nen): CachGoi {
  if (nen === 'win32') {
    /* `Start-Process -Verb RunAs` là đường DUY NHẤT bật được UAC. Nó mở một
       tiến trình mới nên phải `-Wait`, và phải hứng đầu ra qua tệp.
       `cmd /c` bọc bên trong để chuỗi lệnh được hiểu y như người dùng gõ vào
       Command Prompt. */
    const ps = [
      '$ErrorActionPreference = "Stop"',
      `$l = [Environment]::GetEnvironmentVariable("${BIEN_LENH}")`,
      `$r = [Environment]::GetEnvironmentVariable("${BIEN_RA}")`,
      // `/c` nhận phần còn lại NGUYÊN VĂN, nên chuỗi lệnh không bị PowerShell
      // phân tích lần nữa.
      '$p = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "$l > `"$r`" 2>&1"'
        + ' -Verb RunAs -Wait -PassThru -WindowStyle Hidden',
      'exit $p.ExitCode',
    ].join('; ');
    return { prog: 'powershell.exe', args: ['-NoProfile', '-NonInteractive', '-Command', ps], raQuaTep: true };
  }

  if (nen === 'darwin') {
    /* `do shell script … with administrator privileges` hiện hộp mật khẩu của
       hệ thống và trả stdout về thẳng. `system attribute` đọc biến môi trường,
       nên chuỗi lệnh không phải đi qua dấu nháy của AppleScript. */
    const as = 'do shell script (system attribute "' + BIEN_LENH + '") '
      + 'with administrator privileges';
    return { prog: 'osascript', args: ['-e', as], raQuaTep: false };
  }

  /* Linux: `pkexec` hiện hộp của polkit. Nó nhận MẢNG tham số nên chuỗi lệnh
     không phải thoát gì cả — nhưng `pkexec` KHÔNG chuyển tiếp biến môi trường
     (đó là chủ đích của nó), nên ở đây lệnh buộc phải đi qua tham số. Vẫn an
     toàn: đây là mảng argv, không phải một chuỗi bị phân tích lại. */
  return { prog: 'pkexec', args: ['--disable-internal-agent', 'bash', '-lc', CHO_LENH], raQuaTep: false };
}

/** Chỗ giữ trong `args` sẽ được thay bằng chuỗi lệnh. Chỉ Linux dùng. */
export const CHO_LENH = '\u0000cho-lenh';

/**
 * Ghép chuỗi lệnh vào lời gọi.
 *
 * Tách khỏi `cachGoi` để kiểm được RIÊNG: đây là chỗ duy nhất chuỗi lệnh chạm
 * vào `args`, và nó phải chạm đúng một kiểu — thay TRỌN một phần tử, không bao
 * giờ nối vào giữa một phần tử nào.
 */
export function ghepLenh(goi: CachGoi, lenh: string): string[] {
  return goi.args.map((a) => (a === CHO_LENH ? lenh : a));
}

/** Câu giải thích hộp mà người dùng SẮP thấy — để thẻ duyệt nói trước. */
export function hopSeHien(nen: Nen): string {
  if (nen === 'win32') return 'Windows sẽ hiện hộp UAC ("Do you want to allow…") — bấm Yes.';
  if (nen === 'darwin') return 'macOS sẽ hỏi mật khẩu máy của bạn.';
  return 'Linux sẽ hiện hộp xác thực của polkit.';
}

export interface KetQuaQuyenCao {
  ma: number | null;
  ra: string;
  /** Người dùng bấm Huỷ ở hộp của hệ điều hành. */
  nguoiDungHuy: boolean;
}

/** Mã thoát khi người dùng từ chối ở hộp của hệ điều hành. */
function laHuy(nen: Nen, ma: number | null, ra: string): boolean {
  if (nen === 'darwin') return /User cancell?ed|\(-128\)/i.test(ra);
  if (nen === 'linux') return ma === 126 || /dismissed|not authorized/i.test(ra);
  // PowerShell ném khi UAC bị từ chối; câu lỗi khác nhau theo ngôn ngữ Windows
  // nên bắt cả mã lẫn chữ.
  return /canceled by the user|The operation was canceled/i.test(ra);
}

export async function chayQuyenCao(opts: {
  lenh: string;
  cwd: string;
  nen?: Nen;
  giay?: number;
  signal: AbortSignal;
}): Promise<KetQuaQuyenCao> {
  const nen = opts.nen ?? (process.platform as Nen);
  const goi = cachGoi(nen);
  const tran = Math.min(600, Math.max(1, Math.floor(opts.giay || 300)));

  let thuMuc: string | null = null;
  let tepRa = '';
  if (goi.raQuaTep) {
    thuMuc = await mkdtemp(join(tmpdir(), 'ct-quyen-'));
    tepRa = join(thuMuc, 'ra.txt');
  }

  const args = ghepLenh(goi, opts.lenh);

  try {
    const kq = await new Promise<{ ma: number | null; ra: string }>((xong) => {
      const con = spawn(goi.prog, args, {
        cwd: opts.cwd,
        shell: false,          // ⚠️ KHÔNG shell — đó là cả điểm của cách này.
        windowsHide: true,
        env: { ...process.env, [BIEN_LENH]: opts.lenh, ...(tepRa ? { [BIEN_RA]: tepRa } : {}) },
      });
      let gom = '';
      let dungRoi = false;
      const dung = (): void => {
        if (dungRoi) return;
        dungRoi = true;
        try { con.kill('SIGTERM'); } catch { /* đã chết */ }
      };
      const hen = setTimeout(dung, tran * 1000);
      opts.signal.addEventListener('abort', dung, { once: true });

      con.stdout?.on('data', (d: Buffer) => { gom += d.toString(); });
      con.stderr?.on('data', (d: Buffer) => { gom += d.toString(); });
      con.on('error', (e) => { clearTimeout(hen); xong({ ma: null, ra: `${gom}\n${e.message}` }); });
      con.on('close', (ma) => { clearTimeout(hen); xong({ ma, ra: gom }); });
    });

    let ra = kq.ra;
    if (goi.raQuaTep && tepRa) {
      /* Console có quyền ghi ra tệp này. Đọc hỏng = lệnh chưa từng chạy (UAC bị
         từ chối) — giữ nguyên phần stderr của PowerShell, nó mới là chỗ nói lý
         do. */
      const tuTep = await readFile(tepRa, 'utf8').catch(() => '');
      if (tuTep.trim() !== '') ra = tuTep;
    }
    return { ma: kq.ma, ra: ra.trim(), nguoiDungHuy: laHuy(nen, kq.ma, ra) };
  } finally {
    if (thuMuc) await rm(thuMuc, { recursive: true, force: true }).catch(() => {});
  }
}
