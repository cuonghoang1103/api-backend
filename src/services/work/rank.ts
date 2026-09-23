/**
 * Khoá thứ tự (rank) cho thẻ trên board/backlog — kiểu LexoRank.
 *
 * Kéo một thẻ vào giữa hai thẻ khác chỉ ghi ĐÚNG một dòng: thẻ đó nhận một
 * chuỗi nằm giữa chuỗi của hai hàng xóm. Không phải đánh số lại cả cột.
 *
 * Bảng chữ: [0-9a-z] (36 ký tự). Chỉ chữ thường và số để thứ tự của
 * collation Postgres (en_US) trùng với thứ tự so byte — thêm chữ hoa vào là
 * `ORDER BY rank` và phép so sánh trong JS sẽ bất đồng.
 *
 * Luật: khoá KHÔNG được kết thúc bằng '0'. Giữa "a" và "a0" không có chuỗi
 * nào, nên cho phép đuôi '0' là có lúc không chèn được.
 *
 * Thêm vào CUỐI (việc hay làm nhất: thẻ mới vào cuối backlog) không dùng
 * trung điểm — trung điểm dài thêm một ký tự sau vài lần, và 1000 thẻ sẽ
 * vượt 64 ký tự. Thay vào đó cộng 1 vào phần đầu dài 6 ký tự: ~2 tỉ lần
 * thêm mà độ dài vẫn là 6.
 */

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';
const BASE = DIGITS.length;
const HEAD = 6;
const HEAD_SPACE = BASE ** HEAD;
/** Cột schema là VarChar(64); vượt ngưỡng này thì nên xếp lại cả cột. */
export const RANK_REBALANCE_AT = 48;

const VALID_RE = /^[0-9a-z]*[1-9a-z]$/;

export function isValidRank(key: string): boolean {
  return key.length > 0 && key.length <= 64 && VALID_RE.test(key);
}

function digit(ch: string | undefined): number {
  if (ch === undefined) return 0;
  const i = DIGITS.indexOf(ch);
  if (i < 0) throw new Error(`Invalid rank character: ${ch}`);
  return i;
}

function headValue(key: string): number {
  let n = 0;
  for (let i = 0; i < HEAD; i++) n = n * BASE + digit(key[i]);
  return n;
}

function encodeHead(n: number): string {
  let s = '';
  for (let i = 0; i < HEAD; i++) {
    s = DIGITS[n % BASE] + s;
    n = Math.floor(n / BASE);
  }
  // Bỏ đuôi '0' để giữ luật (vd "i00000" → "i").
  return s.replace(/0+$/, '');
}

/**
 * Chuỗi nằm giữa a và b (a < b). a = '' nghĩa là "trước mọi thứ",
 * b = null nghĩa là "sau mọi thứ". Theo thuật toán fractional indexing.
 */
function midpoint(a: string, b: string | null): string {
  if (b !== null) {
    let n = 0;
    while ((a[n] ?? '0') === b[n]) n++;
    if (n > 0) return b.slice(0, n) + midpoint(a.slice(n), b.slice(n));
  }
  const da = a ? digit(a[0]) : 0;
  const db = b !== null ? digit(b[0]) : BASE;
  if (db - da > 1) return DIGITS[Math.round((da + db) / 2)];
  // Hai chữ số liền nhau.
  if (b !== null && b.length > 1) return b.slice(0, 1);
  return DIGITS[da] + midpoint(a.slice(1), null);
}

export function rankInitial(): string {
  return 'i';
}

/** Khoá ngay sau `key`, độ dài không tăng trong trường hợp thường. */
export function rankAfter(key: string): string {
  let n = headValue(key) + 1;
  while (n < HEAD_SPACE) {
    const s = encodeHead(n);
    if (s > key) return s;
    n++;
  }
  return midpoint(key, null);
}

/** Khoá ngay trước `key`. */
export function rankBefore(key: string): string {
  const head = headValue(key);
  // Khoá dài hơn 6 ký tự thì chính phần đầu của nó đã đứng trước nó.
  let n = key.length > HEAD ? head : head - 1;
  while (n > 0) {
    const s = encodeHead(n);
    if (s && s < key) return s;
    n--;
  }
  return midpoint('', key);
}

/**
 * Khoá cho một thẻ đặt giữa `before` và `after` (một trong hai có thể null).
 * Ném lỗi nếu before >= after — nghĩa là client gửi hàng xóm sai thứ tự,
 * và lặng lẽ "sửa" nó sẽ làm board nhảy thẻ lung tung.
 */
export function rankBetween(before: string | null, after: string | null): string {
  if (before !== null && !isValidRank(before)) throw new Error(`Invalid rank: ${before}`);
  if (after !== null && !isValidRank(after)) throw new Error(`Invalid rank: ${after}`);
  if (before === null && after === null) return rankInitial();
  if (before === null) return rankBefore(after!);
  if (after === null) return rankAfter(before);
  if (before >= after) throw new Error(`Rank out of order: ${before} >= ${after}`);
  return midpoint(before, after);
}

/** `count` khoá tăng dần, cách đều — dùng khi xếp lại cả cột hoặc nhập hàng loạt. */
export function rankSequence(count: number): string[] {
  if (count <= 0) return [];
  const step = Math.floor(HEAD_SPACE / (count + 1));
  const out: string[] = [];
  let prev = '';
  for (let i = 1; i <= count; i++) {
    let s = encodeHead(step * i);
    if (!s || s <= prev) s = prev ? rankAfter(prev) : rankInitial();
    out.push(s);
    prev = s;
  }
  return out;
}
