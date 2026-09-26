/**
 * DẤU HIỆU LỖI — rút một chuỗi ỔN ĐỊNH từ đầu ra của một lệnh hỏng.
 *
 * ─── VÌ SAO CẦN ───
 * Agent lặp lại lỗi cũ vì với nó mỗi lần `npm install` hỏng là một lần MỚI:
 * đường dẫn khác, số dòng khác, mã băm khác. Muốn nhận ra "lỗi này mình từng
 * gặp và đã có bài học" thì phải gọt đi mọi thứ thay đổi giữa các lần chạy,
 * chỉ giữ phần mô tả BẢN CHẤT lỗi (`error TS2345`, `code ERESOLVE`,
 * `port is already allocated`…). Chuỗi đó được so với `dau_hieu` của bài học
 * đã lưu — khớp thì app tự nhắc bài học, không tốn token mục lục.
 *
 * Module này KHÔNG đụng đĩa, không đụng electron — thuần hàm, test thẳng.
 */
import type { BaiHoc } from './boNho';

/** Bắt dòng "trông như lỗi". Cố ý rộng: bỏ sót tệ hơn bắt thừa vài dòng. */
const RE_DONG_LOI = /error|err!|failed|exception|cannot|could not|not found|not recognized|denied|refused|unauthorized|lỗi|traceback/i;
/*
 * `E[A-Z]{3,}` (ERESOLVE, EACCES, ENOENT…) tách riêng và PHÂN BIỆT hoa
 * thường: gộp vào regex `/i` ở trên thì nó khớp mọi từ bắt đầu bằng "e" dài
 * từ 4 chữ ("every", "exists", "expected") ⇒ gần như dòng nào cũng thành lỗi.
 */
const RE_MA_LOI_HOA = /\bE[A-Z]{3,}\b/;
/**
 * Dòng CÓ chữ "error" nhưng lại báo THÀNH CÔNG (`0 Error(s)`,
 * `found 0 vulnerabilities`). Không lọc thì một lần `dotnet build` xanh cũng
 * sinh ra dấu hiệu và đi khớp nhầm bài học.
 */
const RE_DONG_BAO_XANH = /\b0\s+(errors?|error\(s\)|failed|failures?)\b|\bno (errors?|failures?)\b|\bfound 0 vulnerabilities\b|\bwithout errors?\b/i;

// eslint-disable-next-line no-control-regex
const RE_ANSI = /\u001b\[[0-9;?]*[ -/]*[@-~]|\u001b\][^\u0007]*\u0007/g;
const RE_UUID = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
/** `C:\a\b.cs` hoặc `C:/a/b.cs` — dừng ở ký tự thường đứng SAU đường dẫn (`(12,5)`, `:12`). */
const RE_DUONG_WIN = /(?<![A-Za-z0-9])[A-Za-z]:[\\/][^\s'"()[\]<>:,;]*/g;
/** `/Users/a/b.ts` — phải đứng sau khoảng trắng/dấu mở, để `and/or`, `a/b` không bị nuốt. */
const RE_DUONG_POSIX = /(^|[\s'"(=[<,])\/[^\s'"()[\]<>:,;]+/g;
/**
 * Đường dẫn TƯƠNG ĐỐI tới file mã (`src/a.ts`, `Program.cs`). `tsc` in
 * đường dẫn tương đối — không gọt thì cùng một lỗi TS2345 ở hai file khác
 * nhau thành hai dấu hiệu khác nhau.
 */
const RE_FILE_MA = /(?<![\w<])(?:[\w.-]+[\\/])*[\w.-]+\.(?:tsx?|jsx?|mjs|cjs|py|cs|csproj|sln|java|kt|go|rs|c|cc|cpp|h|hpp|rb|php|swift|vue|svelte|json|ya?ml|toml|lock|gradle|xml)\b/gi;
/** Mã băm ≥7 ký tự hex — bắt buộc có cả số lẫn chữ để không nuốt từ tiếng Anh như "defaced". */
const RE_HEX = /\b(?=[0-9a-f]*[a-f])(?=[0-9a-f]*\d)[0-9a-f]{7,}\b/gi;
/** Chỉ số ĐỨNG RIÊNG: `TS2345`, `CS0246` giữ nguyên vì chúng là bản chất lỗi. */
const RE_SO = /\b\d+\b/g;

const TRAN_DAU_HIEU = 300;

/**
 * Chuẩn hoá một chuỗi lỗi về dạng so được: bỏ ANSI, đường dẫn → `<P>`,
 * số → `<N>`, hex → `<H>`, UUID → `<U>`, chữ thường, gộp khoảng trắng.
 * `boNho` dùng đúng hàm này khi LƯU `dau_hieu`, để phía lưu và phía khớp
 * không bao giờ lệch cách gọt.
 */
export function chuanHoaDauHieu(s: string): string {
  return s
    .replace(RE_ANSI, '')
    .replace(/\r\n?/g, '\n')
    .replace(RE_UUID, '<U>')
    .replace(RE_DUONG_WIN, '<P>')
    .replace(RE_DUONG_POSIX, (_m, truoc: string) => `${truoc}<P>`)
    .replace(RE_FILE_MA, '<P>')
    .replace(RE_HEX, '<H>')
    .replace(RE_SO, '<N>')
    .toLowerCase()
    // Chữ thường làm `<P>` thành `<p>` — trả lại để dấu hiệu đọc ra đúng ý.
    .replace(/<([punh])>/g, (_m, c: string) => `<${c.toUpperCase()}>`)
    .replace(/\s+/g, ' ')
    .trim();
}

/** Những lệnh "dọn đường" đứng trước lệnh thật: `cd x && npm install`. */
const LENH_DON_DUONG = new Set(['cd', 'pushd', 'export', 'set', 'source', '.', 'sudo', 'env', 'call']);

/**
 * Hai từ đầu của lệnh THẬT (`npm install`, `docker compose`, `dotnet build`).
 * Bỏ các đoạn `cd …`, biến môi trường `A=b`, cờ `-x`; không có tiền tố này
 * thì "Cannot find module" của `node` và của `tsc` gộp làm một.
 */
function tienToLenh(lenh: string): string {
  const doan = lenh.split(/&&|\|\||;|\r?\n/).map((d) => d.trim()).filter(Boolean);
  const chon = doan.find((d) => !LENH_DON_DUONG.has(d.split(/\s+/)[0]?.toLowerCase() ?? '')) ?? doan[0] ?? '';
  const tu: string[] = [];
  for (const t of chon.split(/\s+/)) {
    if (!t || t.startsWith('-') || /^[A-Za-z_][A-Za-z0-9_]*=/.test(t)) continue;
    if (LENH_DON_DUONG.has(t.toLowerCase()) && tu.length === 0) continue;
    // `C:\tools\npm.cmd` → `npm`; `./node_modules/.bin/tsc` → `tsc`.
    const ten = t.replace(/^['"]|['"]$/g, '').split(/[\\/]/).pop() ?? t;
    tu.push(ten.replace(/\.(exe|cmd|bat|ps1)$/i, ''));
    if (tu.length === 2) break;
  }
  return chuanHoaDauHieu(tu.join(' '));
}

/** Dòng lỗi mà bỏ chữ báo lỗi đi thì chẳng còn gì (`npm ERR!`, `Build FAILED.`) — vô ích để phân biệt. */
function dongRong(d: string): boolean {
  const conLai = d.replace(new RegExp(RE_DONG_LOI.source, 'gi'), ' ').replace(/\bE[A-Z]{3,}\b/g, ' ');
  return (conLai.match(/[\p{L}\p{N}]{2,}/gu) ?? []).length < 2;
}

/**
 * Rút dấu hiệu từ một lần chạy lệnh. `null` = không có gì đáng ghi nhớ
 * (lệnh xanh và không có dòng lỗi nào).
 *
 * Kết quả: `<tiền tố lệnh> :: <dòng1> | <dòng2> | <dòng3>`, ≤300 ký tự.
 */
export function dauHieuLoi(lenh: string, ra: string, ma: number | null): string | null {
  const sach = ra.replace(RE_ANSI, '').replace(/\r\n?/g, '\n');
  const dong: string[] = [];
  const daCo = new Set<string>();
  for (const d of sach.split('\n')) {
    if (dong.length >= 3) break;
    if (!(RE_DONG_LOI.test(d) || RE_MA_LOI_HOA.test(d))) continue;
    if (RE_DONG_BAO_XANH.test(d) || dongRong(d)) continue;
    const c = chuanHoaDauHieu(d);
    if (!c || daCo.has(c)) continue;
    daCo.add(c);
    dong.push(c);
  }
  if (dong.length === 0) {
    if (ma === 0 || ma === null) return null;
    // Hỏng mà không in dòng nào "trông như lỗi": lấy dòng cuối có chữ — thường
    // là câu chốt của công cụ. Không có luôn thì chỉ còn mã thoát.
    const cuoi = sach.split('\n').map((d) => d.trim()).filter((d) => /[\p{L}]{2,}/u.test(d)).pop();
    dong.push(cuoi ? chuanHoaDauHieu(cuoi) : `thoát mã ${ma}`);
  }
  const kq = `${tienToLenh(lenh)} :: ${dong.join(' | ')}`;
  return kq.length > TRAN_DAU_HIEU ? kq.slice(0, TRAN_DAU_HIEU).trimEnd() : kq;
}

// ─── SO GẦN ĐÚNG: Jaccard trên bộ-ba-ký-tự ──────────────────────────

/** Tập bộ-ba-ký-tự của một chuỗi (đã chuẩn hoá bởi người gọi). */
export function boBaKyTu(s: string): Set<string> {
  const t = ` ${s} `;
  const kq = new Set<string>();
  for (let i = 0; i + 3 <= t.length; i++) kq.add(t.slice(i, i + 3));
  return kq;
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let chung = 0;
  for (const x of a) if (b.has(x)) chung++;
  return chung / (a.size + b.size - chung);
}

/** Một bên chứa bên kia chỉ tính khi bên NGẮN đủ dài — không thì "error" khớp với mọi thứ. */
const DO_DAI_CHUA_TOI_THIEU = 12;
const NGUONG_JACCARD_KHOP = 0.5;

/**
 * Tìm bài học có `dauHieu` khớp nhất với dấu hiệu vừa rút. Ưu tiên "chứa
 * nhau" (bài lưu `npm err! code eresolve` nằm gọn trong dấu hiệu đầy đủ của
 * lệnh), rồi mới tới Jaccard ≥ 0,5.
 */
export function khopBoNho(dauHieu: string, ds: BaiHoc[]): BaiHoc | null {
  const a = chuanHoaDauHieu(dauHieu);
  if (!a) return null;
  const baA = boBaKyTu(a);
  let tot: BaiHoc | null = null;
  let diemTot = 0;
  for (const bai of ds) {
    if (!bai.dauHieu) continue;
    const b = chuanHoaDauHieu(bai.dauHieu);
    if (!b) continue;
    let diem = 0;
    const ngan = a.length <= b.length ? a : b;
    const dai = ngan === a ? b : a;
    if (ngan.length >= DO_DAI_CHUA_TOI_THIEU && dai.includes(ngan)) {
      // 1 + tỉ lệ độ dài: hai bài cùng "chứa" thì bài mô tả kỹ hơn thắng.
      diem = 1 + ngan.length / dai.length;
    } else {
      const j = jaccard(baA, boBaKyTu(b));
      if (j >= NGUONG_JACCARD_KHOP) diem = j;
    }
    if (diem > diemTot) { diemTot = diem; tot = bai; }
  }
  return tot;
}

// ─── ĐẾM LỖI LẶP TRONG MỘT VIỆC ────────────────────────────────────

/**
 * Sống trong bộ nhớ, MỘT cái cho mỗi việc agent đang làm. Cho biết một lỗi đã
 * gặp bao nhiêu lần và lần đầu ở bước nào — để vòng lặp nói được với model
 * "lỗi này bạn gặp lần thứ 3 rồi, từ bước 4" thay vì để nó thử lại mãi.
 */
export class BoDemLoiLap {
  private readonly dem = new Map<string, { lan: number; buocDau: number }>();

  ghi(dauHieu: string, buoc: number): { lanThu: number; buocDau: number } {
    const cu = this.dem.get(dauHieu);
    if (cu) {
      cu.lan++;
      return { lanThu: cu.lan, buocDau: cu.buocDau };
    }
    this.dem.set(dauHieu, { lan: 1, buocDau: buoc });
    return { lanThu: 1, buocDau: buoc };
  }
}
