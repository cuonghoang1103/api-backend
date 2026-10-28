/**
 * Tách bit địa chỉ ảo & cỡ bảng trang (bài 16.4, đợt mô phỏng #4) — các phép tính của `osgcalc.py addr / pagesize /
 * loglen / seg / eat` (lab/code/ch16), đối chiếu với lab/out/c164-bo-nho trong addr.test.ts. Dùng BigInt để chạy được cả
 * địa chỉ 48 bit của x86-64 / arm64 (4 mức 9/9/9/9/12).
 */
export interface AField { name: string; bits: number; value: number; bin: string; lo: number; hi: number }
export interface ASplit { total: number; va: bigint; bin: string; fields: AField[]; pageBytes: number; pages: bigint }

export function parseAddr(s: string): bigint | null {
  const t = s.trim().replace(/_/g, '').toLowerCase();
  try {
    if (/^0x[0-9a-f]+$/.test(t)) return BigInt(t);
    if (/^0b[01]+$/.test(t)) return BigInt(t);
    if (/^[0-9]+$/.test(t)) return BigInt(t);
  } catch { /* */ }
  return null;
}

/** bits = [PT1, PT2, …, offset] từ trái sang phải (bit cao trước), đúng như osgcalc `bits=10,10,12`. */
export function splitVA(va: bigint, bits: number[]): ASplit {
  const total = bits.reduce((a, b) => a + b, 0);
  const masked = va & ((BigInt(1) << BigInt(total)) - BigInt(1));
  const bin = masked.toString(2).padStart(total, '0');
  const fields: AField[] = [];
  let pos = 0;
  bits.forEach((w, k) => {
    const part = bin.slice(pos, pos + w);
    const name = k === bits.length - 1 ? 'offset' : bits.length === 2 ? 'page' : `PT${k + 1}`;
    fields.push({ name, bits: w, value: parseInt(part || '0', 2), bin: part, hi: total - 1 - pos, lo: total - pos - w });
    pos += w;
  });
  const off = bits[bits.length - 1];
  return { total, va: masked, bin, fields, pageBytes: 2 ** off, pages: BigInt(1) << BigInt(total - off) };
}

export const log2i = (n: number) => { let k = 0; while (2 ** (k + 1) <= n) k++; return k; };
export const isPow2 = (n: number) => n > 0 && 2 ** log2i(n) === n;

/** Bảng trang MỘT mức: số trang × cỡ PTE (osgcalc pagesize). */
export function pageTableSize(vaBits: number, pageBytes: number, pteBytes: number) {
  const off = log2i(pageBytes);
  const pages = BigInt(1) << BigInt(vaBits - off);
  return { offBits: off, vpnBits: vaBits - off, pages, bytes: pages * BigInt(pteBytes) };
}

/** Độ dài địa chỉ logic: số trang × số từ mỗi trang (osgcalc loglen). */
export const logicalBits = (pages: number, wordsPerPage: number) => ({ page: log2i(pages), off: log2i(wordsPerPage), total: log2i(pages) + log2i(wordsPerPage) });

/**
 * Bảng trang NHIỀU mức cho một tiến trình thưa: chỉ những bảng con có ít nhất một trang đang dùng mới phải tồn tại.
 * regions = các khoảng địa chỉ [đầu, cuối) tiến trình dùng. Trả số bảng cần ở mỗi mức và tổng byte (mỗi bảng = 2^bits mục).
 */
export function multiLevel(bits: number[], pteBytes: number, regions: Array<[bigint, bigint]>) {
  const total = bits.reduce((a, b) => a + b, 0);
  const levels = bits.slice(0, -1);
  const out: Array<{ level: number; tables: bigint; entries: number; bytesEach: number }> = [];
  let shiftAbove = BigInt(total);
  levels.forEach((w, k) => {
    // bảng ở mức k được đánh chỉ số bởi tiền tố các bit phía trên nó ⇒ đếm số tiền tố khác nhau mà các vùng chạm tới
    const shift = shiftAbove;
    let tables = BigInt(0);
    if (k === 0) tables = BigInt(1);
    else {
      const iv = regions.map(([a, b]) => [a >> shift, (b - BigInt(1)) >> shift] as [bigint, bigint]).sort((x, y) => (x[0] < y[0] ? -1 : 1));
      let curA = -BigInt(1), curB = -BigInt(2);
      for (const [a, b] of iv) {
        if (a > curB + BigInt(1)) { if (curB >= curA) tables += curB - curA + BigInt(1); curA = a; curB = b; } else if (b > curB) curB = b;
      }
      if (curB >= curA) tables += curB - curA + BigInt(1);
    }
    out.push({ level: k + 1, tables, entries: 2 ** w, bytesEach: 2 ** w * pteBytes });
    shiftAbove -= BigInt(w);
  });
  const bytes = out.reduce((s, l) => s + l.tables * BigInt(l.bytesEach), BigInt(0));
  return { levels: out, bytes };
}

/** Thời gian truy cập hiệu dụng có TLB (osgcalc eat): hit = TLB + mem; miss = TLB + levels×mem + mem. */
export function eat(tlbNs: number, memNs: number, hit: number, levels = 1) {
  const h = tlbNs + memNs, m = tlbNs + memNs * (levels + 1);
  return { hit: h, miss: m, eat: hit * h + (1 - hit) * m };
}

/** Phạm vi TLB (TLB reach) = số mục × cỡ trang. */
export const tlbReach = (entries: number, pageBytes: number) => entries * pageBytes;

/** Phân đoạn: (s, offset) ⇒ base + offset, hoặc TRAP khi offset ≥ limit (osgcalc seg). */
export function segTranslate(table: Array<[number, number]>, s: number, off: number): { ok: true; phys: number; base: number; limit: number } | { ok: false; base: number; limit: number } {
  const [base, limit] = table[s];
  return off >= limit ? { ok: false, base, limit } : { ok: true, phys: base + off, base, limit };
}

export const fmtBytes = (b: bigint | number) => {
  const n = typeof b === 'bigint' ? Number(b) : b;
  const u = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
  let k = 0, v = n;
  while (v >= 1024 && k < u.length - 1 && Number.isInteger(v / 1024)) { v /= 1024; k++; }
  if (k === 0 && n >= 1024) { while (v >= 1024 && k < u.length - 1) { v /= 1024; k++; } return `${v.toFixed(2)} ${u[k]}`; }
  return `${v.toLocaleString('en-US')} ${u[k]}`;
};
export const hex = (v: bigint | number, digits = 0) => '0x' + (typeof v === 'bigint' ? v : BigInt(v)).toString(16).toUpperCase().padStart(digits, '0');
