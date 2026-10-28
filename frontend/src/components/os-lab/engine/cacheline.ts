/**
 * False sharing nhìn thấy được (bài 4.6, đợt mô phỏng #4): K lõi, mỗi lõi tăng bộ đếm RIÊNG của mình; các bộ đếm cách
 * nhau `gap` byte trong bộ nhớ. Giao thức MESI quyết định mỗi lần ghi tốn gì:
 *   • dòng đang M/E ở lõi mình ⇒ trúng (E → M, không ai biết);
 *   • dòng ở S ⇒ "nâng cấp": phát lệnh vô hiệu hoá các bản S ở lõi khác;
 *   • dòng ở I/không có ⇒ RFO (read-for-ownership): bản M ở lõi khác phải ghi trả rồi bị vô hiệu hoá ⇒ dòng "nhảy" sang.
 * Hai bộ đếm chung một dòng ⇒ dòng nhảy qua lại giữa các lõi dù hai luồng KHÔNG dùng chung biến nào.
 * Thời gian hiển thị là số ĐO THẬT (lab/out/c46-false, máy lab M1 Max: dòng cache THẬT 128 B dù getconf báo 64).
 */
export type Mesi = 'M' | 'E' | 'S' | 'I';
export type ClEvent = 'first' | 'hit' | 'upgrade' | 'rfo';
export interface ClStep {
  core: number; addr: number; line: number; event: ClEvent;
  from: number | null; // lõi đang giữ bản M/E trước đó (dòng nhảy từ đâu tới)
  invalidated: number[];
  states: Mesi[][]; // states[core][line] SAU bước này
  hits: number; misses: number; invalidations: number; bounces: number;
}
export interface ClCfg { cores: number; gap: number; line: number; rounds: number; local?: boolean }

export function lineOf(core: number, gap: number, line: number) { return Math.floor((core * gap) / line); }
export function linesUsed(cfg: ClCfg) { return cfg.local ? cfg.cores : lineOf(cfg.cores - 1, cfg.gap, cfg.line) + 1; }

/** Các lõi ghi lần lượt 0,1,…,K−1, lặp `rounds` vòng (xen kẽ dày nhất — đúng kiểu hai luồng chạy song song). */
export function simulateCl(cfg: ClCfg): ClStep[] {
  const K = cfg.cores, L = linesUsed(cfg);
  const st: Mesi[][] = Array.from({ length: K }, () => Array<Mesi>(L).fill('I'));
  const steps: ClStep[] = [];
  let hits = 0, misses = 0, inv = 0, bounces = 0;
  for (let r = 0; r < cfg.rounds; r++) {
    for (let c = 0; c < K; c++) {
      const ln = cfg.local ? c : lineOf(c, cfg.gap, cfg.line);
      const addr = cfg.local ? c * 4096 : c * cfg.gap;
      const mine = st[c][ln];
      let event: ClEvent, from: number | null = null;
      const invalidated: number[] = [];
      if (mine === 'M' || mine === 'E') { event = 'hit'; hits++; }
      else {
        const holders = st.map((row, k) => (k !== c && row[ln] !== 'I' ? k : -1)).filter((k) => k >= 0);
        if (mine === 'S') event = 'upgrade';
        else event = holders.length ? 'rfo' : 'first';
        const owner = holders.find((k) => st[k][ln] === 'M' || st[k][ln] === 'E');
        if (owner !== undefined) { from = owner; bounces++; }
        for (const k of holders) { st[k][ln] = 'I'; invalidated.push(k); }
        inv += invalidated.length;
        misses++;
      }
      st[c][ln] = 'M';
      steps.push({ core: c, addr, line: ln, event, from, invalidated, states: st.map((row) => [...row]), hits, misses, invalidations: inv, bounces });
    }
  }
  return steps;
}

/** Số đo thật c46-false (ms, best of 3): fs <luồng> <khoảng cách byte>; "local" = biến cục bộ, cộng một lần cuối. */
export const FS_MS: Record<4 | 8, Record<8 | 64 | 128 | 256, number> & { local?: number }> = {
  4: { 8: 398, 64: 209, 128: 179, 256: 179 },
  8: { 8: 777, 64: 269, 128: 192, 256: 201, local: 38 },
};
export const FS_ONE_THREAD = 172; // 1 luồng, mọi khoảng cách: 172–173 ms
export const PERF = { false: { taskClock: 1429.59, wall: 366 }, padded: { taskClock: 713.36, wall: 179 } };
export const JAVA = { adjacent: 6086, padded: 1064, adder: 385, local: 25 };
export const GETCONF = 64;
export const REAL_LINE = 128;
