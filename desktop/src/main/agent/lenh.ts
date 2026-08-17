/**
 * ============================================================
 * PHÂN LOẠI LỆNH — lõi an toàn của P3
 * ============================================================
 *
 * ─── VÌ SAO VẪN DÙNG SHELL, DÙ SHELL LÀ THỨ NGUY HIỂM NHẤT ───
 * Cách "an toàn" là `execFile(cmd, argv)` — không có shell, nên `;` và `$(…)`
 * chỉ là ký tự thường. Nhưng lúc đó agent không chạy được `npm test -- -t foo`,
 * không nối lệnh, không chuyển hướng, và nó sẽ quẫy quanh những thứ nó không
 * làm được thay vì làm việc. Một agent lập trình không chạy được bộ kiểm của
 * bạn thì không có vòng lặp sửa→chạy→sửa, mà vòng lặp đó chính là lý do P3 tồn
 * tại.
 *
 * Nên: CÓ shell, và an toàn đến từ chỗ khác — người dùng nhìn thấy ĐÚNG chuỗi
 * lệnh sắp chạy và phải bấm duyệt. Cái được canh không phải là "lệnh có hợp lệ
 * không" mà là "người dùng đã đọc chưa".
 *
 * ─── ⚠️ SỰ THẬT PHẢI NÓI THẲNG: SHELL VƯỢT QUA NHÀ TÙ FILE ───
 * `jail.ts` chặn agent ĐỌC `.env`. Nhưng `cat .env` là một lệnh shell, và shell
 * không biết gì về nhà tù đó. Cấp quyền chạy lệnh nghĩa là danh sách chặn file
 * tụt xuống hàng KHUYẾN CÁO, không còn là cái khoá.
 *
 * Không có cách nào vá kín chuyện này mà vẫn giữ được shell (`c""at .e""nv`,
 * `xxd $(printf '.env')`, `python -c ...` — vô số đường vòng). Thứ làm được là
 * KHÔNG BAO GIỜ tự động duyệt một lệnh có dính tới những tên file đó, và cảnh
 * báo to trên thẻ duyệt. Người dùng vẫn có thể đồng ý — đó là máy của họ — miễn
 * là họ đồng ý một cách CÓ NHÌN THẤY.
 */

export type MucNguyHiem = 'thuong' | 'cankiem' | 'nguyhiem';

export interface PhanLoaiLenh {
  muc: MucNguyHiem;
  /** Vì sao — hiện thẳng trên thẻ duyệt. Rỗng khi `muc === 'thuong'`. */
  lyDo: string[];
  /** Có được phép NHỚ để lần sau tự chạy không. Lệnh nguy hiểm thì KHÔNG BAO GIỜ. */
  choNho: boolean;
}

/**
 * Lệnh KHÔNG BAO GIỜ được nhớ, và luôn kèm cảnh báo.
 *
 * Tiêu chí vào đây không phải "nghe đáng sợ" mà là **không có đường lùi**:
 * xoá thật, đẩy lên máy chủ thật, đổi máy của người dùng, hoặc kéo mã lạ từ
 * Internet về chạy. Nút Hoàn tác của P2 không cứu được cái nào trong số đó.
 */
const NGUY_HIEM: ReadonlyArray<{ re: RegExp; lyDo: string }> = [
  { re: /(^|[\s;&|])rm\s/, lyDo: 'xoá file — không hoàn tác được' },
  { re: /(^|[\s;&|])(rmdir|unlink)\s/, lyDo: 'xoá — không hoàn tác được' },
  { re: /(^|[\s;&|])(sudo|su|doas)\s/, lyDo: 'chạy với quyền quản trị' },
  { re: /(^|[\s;&|])(chmod|chown|chgrp)\s/, lyDo: 'đổi quyền file' },
  { re: /(^|[\s;&|])(dd|mkfs|fdisk|diskutil)\s/, lyDo: 'thao tác đĩa ở mức thấp' },
  { re: /(^|[\s;&|])(shutdown|reboot|halt)\b/, lyDo: 'tắt/khởi động lại máy' },
  { re: /(^|[\s;&|])(kill|pkill|killall)\s/, lyDo: 'giết tiến trình khác' },
  { re: /git\s+push/, lyDo: 'đẩy lên kho từ xa — người khác thấy ngay' },
  { re: /git\s+(reset\s+--hard|clean\s+-|checkout\s+--\s|restore\s)/, lyDo: 'vứt bỏ thay đổi chưa lưu' },
  { re: /git\s+(commit|rebase|merge|cherry-pick|revert)\b/, lyDo: 'đổi lịch sử git' },
  { re: /(^|[\s;&|])(npm|yarn|pnpm)\s+publish/, lyDo: 'phát hành gói ra công khai' },
  { re: /(^|[\s;&|])(curl|wget|nc|ncat)\s/, lyDo: 'gọi ra Internet — có thể tải mã lạ về' },
  { re: /(^|[\s;&|])(ssh|scp|rsync|sftp)\s/, lyDo: 'nối tới máy khác' },
  { re: /(^|[\s;&|])(brew|apt|apt-get|yum|dnf|pacman|port)\s/, lyDo: 'cài/gỡ phần mềm của máy' },
  { re: /(^|[\s;&|])(launchctl|systemctl|service)\s/, lyDo: 'đổi dịch vụ chạy nền của máy' },
  { re: /(^|[\s;&|])(docker|kubectl)\s/, lyDo: 'điều khiển container/cụm máy' },
  { re: /(^|[\s;&|])(npm|yarn|pnpm)\s+(install|add|i)\b/, lyDo: 'cài gói mới — chạy script của gói đó' },
  { re: />\s*\/(etc|usr|bin|sbin|System)\b/, lyDo: 'ghi vào thư mục hệ thống' },
  { re: /:\(\)\s*\{.*\}\s*;?\s*:/, lyDo: 'fork bomb' },
];

/**
 * Tên file nhạy cảm. Dính là KHÔNG cho nhớ + cảnh báo, dù lệnh trông vô hại.
 *
 * `cat .env` không nằm trong danh sách nguy hiểm nào ở trên — nó chỉ đọc. Đó
 * chính là chỗ đáng sợ: nó vô hại với ĐĨA và tai hại với BÍ MẬT.
 */
const FILE_NHAY_CAM = /(^|[\s/'"=])\.?env(\.|[\s'"]|$)|\.(pem|key|p12|pfx|jks)\b|id_(rsa|dsa|ecdsa|ed25519)|\.npmrc|\.netrc|credentials|secret|token|password/i;

/** Ký tự khiến một chuỗi lệnh thành NHIỀU lệnh, hoặc đọc/ghi ra ngoài. */
const META = /[;&|><`]|\$\(|\bnewline\b|\n/;

export function phanLoaiLenh(lenh: string): PhanLoaiLenh {
  const s = lenh.trim();
  const lyDo: string[] = [];
  let nguyHiem = false;

  for (const { re, lyDo: ld } of NGUY_HIEM) {
    if (re.test(s)) { nguyHiem = true; lyDo.push(ld); }
  }
  if (FILE_NHAY_CAM.test(s)) {
    nguyHiem = true;
    lyDo.push('nhắc tới file có thể chứa khoá/mật khẩu — shell ĐỌC ĐƯỢC những file mà agent bị chặn');
  }

  if (nguyHiem) return { muc: 'nguyhiem', lyDo, choNho: false };

  // Nhiều lệnh nối nhau: chưa chắc xấu (`cd x && npm test` là chuyện thường),
  // nhưng KHÔNG cho nhớ. Nhớ một chuỗi nối nghĩa là lần sau cả chuỗi tự chạy,
  // mà mắt người đọc một chuỗi dài thì chỉ nhìn đoạn đầu.
  if (META.test(s)) {
    return { muc: 'cankiem', lyDo: ['gồm nhiều lệnh nối nhau hoặc có chuyển hướng'], choNho: false };
  }

  return { muc: 'thuong', lyDo: [], choNho: true };
}

/** Câu một dòng cho thẻ duyệt. */
export function tomTatNguyHiem(p: PhanLoaiLenh): string {
  if (p.muc === 'thuong') return '';
  return p.lyDo.join(' · ');
}

// ─── Chạy lệnh ─────────────────────────────────────────────────────

import { spawn } from 'node:child_process';

/** Trần mặc định và trần tuyệt đối cho một lệnh. */
export const TRAN_GIAY_MAC_DINH = 120;
export const TRAN_GIAY_TOI_DA = 600;

/**
 * Trần kết quả đưa vào hội thoại.
 *
 * `npm test` của một dự án lớn in ra hàng megabyte. Nhét cả vào hội thoại thì
 * nó được chở theo trong MỌI lượt gọi cổng sau đó — một lần chạy test đắt hơn
 * cả việc đọc mười file.
 */
const TRAN_KY_TU_RA = 24_000;

export interface KetQuaLenh {
  /** Mã thoát. `null` khi bị giết (hết giờ hoặc người dùng dừng). */
  ma: number | null;
  ra: string;
  catBot: boolean;
  hetGio: boolean;
  giay: number;
}

/**
 * Cắt phần GIỮA, giữ cả đầu lẫn đuôi.
 *
 * Đầu có bối cảnh (lệnh nào đang chạy, cấu hình gì), đuôi có kết luận (bao
 * nhiêu test hỏng, lỗi ở đâu). Cắt đuôi thì mất kết luận; cắt đầu thì mất bối
 * cảnh. Chỗ ít giá trị nhất luôn là khúc giữa — hàng nghìn dòng "✓ passed".
 */
function catGiua(s: string): { ra: string; catBot: boolean } {
  if (s.length <= TRAN_KY_TU_RA) return { ra: s, catBot: false };
  const dau = Math.floor(TRAN_KY_TU_RA * 0.35);
  const duoi = TRAN_KY_TU_RA - dau;
  return {
    ra: `${s.slice(0, dau)}\n\n[… đã cắt ${s.length - TRAN_KY_TU_RA} ký tự ở giữa …]\n\n${s.slice(-duoi)}`,
    catBot: true,
  };
}

/**
 * Chạy một lệnh trong thư mục dự án.
 *
 * ─── GIẾT CẢ NHÓM TIẾN TRÌNH, KHÔNG CHỈ TIẾN TRÌNH CON ───
 * `npm test` sinh ra node, node sinh ra vitest, vitest sinh ra worker. Giết
 * mỗi `npm` thì cả cây con vẫn chạy tiếp — vẫn ăn CPU, vẫn ghi file, và người
 * dùng vừa bấm Dừng thì tưởng đã dừng. `detached: true` cho tiến trình con một
 * nhóm riêng, rồi `kill(-pid)` giết cả nhóm.
 */
export function chayLenh(opts: {
  lenh: string;
  cwd: string;
  giay?: number;
  signal: AbortSignal;
  /** Đẩy từng mẩu ra màn hình khi lệnh còn đang chạy. */
  onRa?: (mau: string) => void;
}): Promise<KetQuaLenh> {
  const tran = Math.min(TRAN_GIAY_TOI_DA, Math.max(1, Math.floor(opts.giay || TRAN_GIAY_MAC_DINH)));
  const batDau = Date.now();

  return new Promise<KetQuaLenh>((resolve) => {
    let gom = '';
    let hetGio = false;
    let xong = false;

    const con = spawn(opts.lenh, {
      cwd: opts.cwd,
      shell: true,
      detached: process.platform !== 'win32',
      windowsHide: true,
      env: {
        ...process.env,
        // Nhiều công cụ đổi hẳn cách in khi thấy màn hình thật: thanh tiến
        // trình vẽ lại liên tục, mã màu ANSI, hỏi lại người dùng. Ba biến này
        // bảo chúng in như đang ghi vào file — vừa gọn cho model đọc, vừa
        // tránh một lệnh đứng chờ mãi một câu trả lời không bao giờ có.
        CI: '1',
        NO_COLOR: '1',
        FORCE_COLOR: '0',
        TERM: 'dumb',
      },
    });

    const giet = (): void => {
      if (!con.pid) return;
      try {
        if (process.platform === 'win32') spawn('taskkill', ['/pid', String(con.pid), '/T', '/F']);
        else process.kill(-con.pid, 'SIGKILL');
      } catch {
        // Tiến trình đã tự thoát giữa chừng — không phải lỗi.
      }
    };

    const dongHo = setTimeout(() => { hetGio = true; giet(); }, tran * 1000);
    const huy = (): void => giet();
    opts.signal.addEventListener('abort', huy, { once: true });

    const nhan = (mau: Buffer): void => {
      const chu = mau.toString('utf8');
      gom += chu;
      // Giữ bộ nhớ có trần ngay trong lúc chạy: một lệnh in vô hạn (ví dụ
      // `yes`) sẽ ăn hết RAM trước khi đồng hồ kịp nổ.
      if (gom.length > TRAN_KY_TU_RA * 6) gom = gom.slice(-TRAN_KY_TU_RA * 4);
      opts.onRa?.(chu);
    };
    con.stdout?.on('data', nhan);
    con.stderr?.on('data', nhan);

    const ketThuc = (ma: number | null): void => {
      if (xong) return;
      xong = true;
      clearTimeout(dongHo);
      opts.signal.removeEventListener('abort', huy);
      const { ra, catBot } = catGiua(gom);
      resolve({ ma, ra, catBot, hetGio, giay: (Date.now() - batDau) / 1000 });
    };

    con.on('close', (ma) => ketThuc(hetGio ? null : ma));
    con.on('error', (err) => {
      gom += `\n[không chạy được: ${err.message}]`;
      ketThuc(null);
    });
  });
}
