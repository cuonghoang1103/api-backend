/**
 * Amdahl · Gustafson · Karp–Flatt · lõi không đều (bài 4.1, 4.5 — đợt mô phỏng #4). Số đo thật lấy từ
 * lab/out/c45-amdahl và c41-c (máy lab: 10 lõi = 8 P + 2 E của M1 Max chạy Docker); kiểm trong amdahl.test.ts.
 */
export const amdahl = (s: number, n: number) => 1 / (s + (1 - s) / n);
export const gustafson = (s: number, n: number) => s + (1 - s) * n;
export const ceiling = (s: number) => (s > 0 ? 1 / s : Infinity);
/** Karp–Flatt: phần tuần tự "thấy được" từ một lần đo speedup S trên n lõi. */
export const karpFlatt = (S: number, n: number) => (1 / S - 1 / n) / (1 - 1 / n);
/**
 * Lõi không đều: P lõi nhanh (tốc độ 1) + lõi chậm tốc độ r. Phần tuần tự chạy trên một lõi P; phần song song chia
 * ĐỘNG (hàng đợi) nên dùng hết sức của mọi lõi: sức = min(n, P) + r·max(0, n − P). Mô hình — không phải số đo.
 */
export const capacity = (n: number, P: number, r: number) => Math.min(n, P) + r * Math.max(0, n - P);
export const hetero = (s: number, n: number, P: number, r: number) => 1 / (s + (1 - s) / capacity(n, P, r));
/** Chia khối CỐ ĐỊNH trên lõi không đều: mỗi luồng 1/n việc ⇒ chờ lõi chậm nhất. */
export const heteroStatic = (s: number, n: number, P: number, r: number) => 1 / (s + (1 - s) / (n > P ? n * r : n));

export interface SweepRow { cores: number; ms: number }
export interface KfRow { cores: number; ms: number; speedup: number; eff: number; e: number | null }
/** Bảng sweep (dòng đầu PHẢI là 1 lõi) ⇒ speedup, hiệu suất, Karp–Flatt từng mức. */
export function karpTable(rows: SweepRow[]): { rows: KfRow[]; e: number | null; predict: Array<{ cores: number; speedup: number }>; ceiling: number | null } {
  const base = rows.find((r) => r.cores === 1)?.ms;
  if (!base) return { rows: [], e: null, predict: [], ceiling: null };
  const out = rows.map((r) => {
    const S = base / r.ms;
    return { cores: r.cores, ms: r.ms, speedup: S, eff: S / r.cores, e: r.cores > 1 ? karpFlatt(S, r.cores) : null };
  });
  const last = [...out].reverse().find((r) => r.e !== null);
  const e = last?.e ?? null;
  return {
    rows: out, e,
    predict: e === null ? [] : [16, 32, 64].map((n) => ({ cores: n, speedup: amdahl(Math.max(0, e), n) })),
    ceiling: e === null || e <= 0 ? null : 1 / e,
  };
}

/** Phân tích chuỗi "1 3105\n2 1709…" (hoặc dán nguyên output của sweep.sh). */
export function parseSweep(text: string): SweepRow[] {
  const rows: SweepRow[] = [];
  for (const line of text.split(/\n/)) {
    const m = line.trim().match(/^(\d+)[\s,;:]+(\d+(?:[.,]\d+)?)/);
    if (m) rows.push({ cores: Number(m[1]), ms: Number(m[2].replace(',', '.')) });
  }
  return rows.filter((r) => r.cores > 0 && r.ms > 0);
}

// ───────── số đo thật (c45-amdahl, c41-c) ─────────
export const MEASURED: Record<'s0' | 's10' | 's25', { s: number; pts: Array<[number, number, number]> }> = {
  // [lõi, ms, speedup] — ./sweep.sh "./amdahl {k} S"
  s0: { s: 0, pts: [[1, 3059, 1], [2, 1561, 1.96], [4, 793, 3.86], [8, 406, 7.53], [10, 356, 8.59]] },
  s10: { s: 0.1, pts: [[1, 3105, 1], [2, 1709, 1.82], [4, 1022, 3.04], [8, 677, 4.59], [10, 625, 4.97]] },
  s25: { s: 0.25, pts: [[1, 3112, 1], [2, 1925, 1.62], [4, 1362, 2.28], [8, 1062, 2.93], [10, 1031, 3.02]] },
};
/** "grow": việc lớn theo số lõi (Gustafson) — đơn vị việc và ms, ./amdahl k 10 grow. */
export const GROW: Array<[number, number, number]> = [[1, 4000, 3048], [2, 7600, 3142], [4, 14800, 3298], [8, 29200, 3412], [10, 36400, 3612]];
/** c41: chia việc số nguyên tố (20 triệu) — khối cố định vs hàng đợi vs fork, 1…10 lõi. */
export const PRIMES: Record<'block' | 'queue' | 'fork', SweepRow[]> = {
  block: [[1, 2073], [2, 1294], [4, 705], [6, 480], [8, 370], [10, 338]].map(([cores, ms]) => ({ cores, ms })),
  queue: [[1, 2052], [2, 1050], [4, 532], [6, 354], [8, 272], [10, 259]].map(([cores, ms]) => ({ cores, ms })),
  fork: [[1, 2046], [2, 1294], [4, 712], [6, 489], [8, 375], [10, 315]].map(([cores, ms]) => ({ cores, ms })),
};
/** Thời gian bận từng luồng (ms), 4 luồng — số nguyên tố và Mandelbrot. */
export const BUSY = {
  primes: { block: [308, 498, 616, 706], queue: [535, 534, 535, 534], wall: { block: 706, queue: 535 } },
  mandel: { block: [91, 1199, 1201, 91], queue: [661, 661, 661, 661], wall: { block: 1201, queue: 661 } },
};
export const SWEEP_TEXT = '1 3105\n2 1709\n4 1022\n8 677\n10 625';
