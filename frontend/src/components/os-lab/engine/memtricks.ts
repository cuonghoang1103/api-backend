/**
 * Hai mẹo bộ nhớ của kernel mà lập trình viên đụng hằng ngày:
 *  1) Copy-on-write sau fork(): con dùng CHUNG khung trang với cha, cả hai bảng trang bị đánh dấu chỉ-đọc; ai ghi trước
 *     thì lỗi trang ⇒ kernel chép ĐÚNG MỘT trang. Redis BGSAVE / fork của Python multiprocessing / Android zygote sống nhờ
 *     điều này — và tốn RAM theo số trang bị ghi trong lúc con còn sống (huge page 2 MiB ⇒ mỗi lần ghi chép 2 MiB).
 *  2) Page cache + read-ahead: đọc file đi qua cache trong RAM; đọc tuần tự ⇒ kernel đoán và đọc trước cửa sổ lớn dần
 *     (4 → 8 → 16 → 32 trang = 128 KiB, như ondemand readahead của Linux); đọc ngẫu nhiên ⇒ mỗi trang một lần chờ đĩa.
 *     read() chép dữ liệu từ cache sang bộ đệm của bạn; mmap() ánh xạ thẳng trang cache (lỗi trang minor, không chép).
 */

// ───────────────────────── copy-on-write ─────────────────────────
export interface CowFrame { id: number; refs: number; data: string }
export interface CowState {
  frames: CowFrame[]; parent: number[]; child: number[] | null; childExec: boolean;
  copies: number; faults: number; last: { who: 'parent' | 'child'; page: number; copied: boolean } | null; en: string; vi: string;
}
export function cowInit(pages = 16): CowState {
  return { frames: Array.from({ length: pages }, (_, k) => ({ id: k, refs: 1, data: 'A' })), parent: Array.from({ length: pages }, (_, k) => k), child: null, childExec: false, copies: 0, faults: 0, last: null,
    en: 'One process, 16 pages of heap, each in its own physical frame.', vi: 'Một tiến trình, 16 trang heap, mỗi trang một khung vật lý riêng.' };
}
const cc = (s: CowState): CowState => ({ ...s, frames: s.frames.map((f) => ({ ...f })), parent: [...s.parent], child: s.child && [...s.child] });

export function cowFork(s0: CowState): CowState {
  const s = cc(s0);
  if (s.child) return s0;
  s.child = [...s.parent];
  for (const f of s.parent) s.frames[f].refs++;
  s.childExec = false;
  s.en = `fork(): the child gets a COPY OF THE PAGE TABLE, not of the memory. All ${s.parent.length} pages are now shared (refcount 2) and marked read-only in both tables. Cost: microseconds, 0 bytes copied.`;
  s.vi = `fork(): con nhận một BẢN CHÉP BẢNG TRANG, không phải bản chép bộ nhớ. Cả ${s.parent.length} trang giờ dùng chung (refcount 2) và bị đánh dấu chỉ-đọc ở cả hai bảng. Giá: vài micro giây, 0 byte bị chép.`;
  return s;
}
export function cowWrite(s0: CowState, who: 'parent' | 'child', page: number): CowState {
  const s = cc(s0);
  const pt = who === 'parent' ? s.parent : s.child;
  if (!pt) return s0;
  const f = pt[page], fr = s.frames[f];
  const name = who === 'parent' ? 'Parent' : 'Child', nameVi = who === 'parent' ? 'Cha' : 'Con';
  if (fr.refs > 1) {
    const nf: CowFrame = { id: s.frames.length, refs: 1, data: who === 'parent' ? 'P' : 'C' };
    s.frames.push(nf); fr.refs--; pt[page] = nf.id; s.copies++; s.faults++;
    s.last = { who, page, copied: true };
    s.en = `${name} writes page ${page}: the page is read-only → page fault → the kernel sees refcount ${fr.refs + 1}, allocates a new frame, copies 4 KiB, points ${who}'s table at it (writable). The other process still sees the old data.`;
    s.vi = `${nameVi} ghi trang ${page}: trang chỉ-đọc → lỗi trang → kernel thấy refcount ${fr.refs + 1}, cấp khung mới, chép 4 KiB, trỏ bảng của ${nameVi.toLowerCase()} vào đó (ghi được). Tiến trình kia vẫn thấy dữ liệu cũ.`;
  } else {
    fr.data = who === 'parent' ? 'P' : 'C';
    s.last = { who, page, copied: false };
    s.en = `${name} writes page ${page}: it is the only user of that frame (refcount 1), so no copy — the write just happens.`;
    s.vi = `${nameVi} ghi trang ${page}: nó là người duy nhất dùng khung đó (refcount 1), nên không chép — ghi thẳng.`;
  }
  return s;
}
export function cowExec(s0: CowState): CowState {
  const s = cc(s0);
  if (!s.child) return s0;
  for (const f of s.child) s.frames[f].refs--;
  s.child = null; s.childExec = true;
  s.en = 'Child calls execve(): its whole address space is thrown away and replaced by the new program. The shared frames go back to refcount 1 — the fork copied nothing at all. This is why fork+exec is cheap.';
  s.vi = 'Con gọi execve(): cả không gian địa chỉ của nó bị vứt bỏ và thay bằng chương trình mới. Các khung dùng chung về lại refcount 1 — fork không chép gì cả. Vì thế fork+exec rẻ.';
  return s;
}
export function cowExit(s0: CowState): CowState {
  const s = cc(s0);
  if (!s.child) return s0;
  for (const f of s.child) s.frames[f].refs--;
  s.child = null;
  s.en = 'Child exits: its private copies are freed, shared frames drop back to refcount 1.';
  s.vi = 'Con thoát: các bản chép riêng của nó được trả, khung dùng chung về lại refcount 1.';
  return s;
}
/** Số khung vật lý đang được dùng (refcount > 0). */
export const framesInUse = (s: CowState) => s.frames.filter((f) => f.refs > 0).length;

/**
 * Redis BGSAVE: dữ liệu `dataGiB`, trong lúc con ghi snapshot (`seconds`) cha nhận `writesPerSec` lệnh ghi rải đều ngẫu
 * nhiên. Số trang bị đụng ít nhất một lần: n·(1 − (1 − 1/n)^W). Bộ nhớ thêm = số đó × cỡ trang.
 */
export function bgsave(dataGiB: number, writesPerSec: number, seconds: number, pageKiB: number, points = 30) {
  const n = (dataGiB * 1024 * 1024) / pageKiB;
  const out: Array<{ t: number; touched: number; extraMiB: number }> = [];
  for (let k = 0; k <= points; k++) {
    const t = (seconds * k) / points, W = writesPerSec * t;
    const touched = n * (1 - Math.exp(W * Math.log1p(-1 / n)));
    out.push({ t, touched, extraMiB: (touched * pageKiB) / 1024 });
  }
  return { pages: n, series: out, final: out[out.length - 1] };
}

// ───────────────────────── page cache + read-ahead ─────────────────────────
export interface PcCfg { filePages: number; cachePages: number; pattern: 'seq' | 'rand'; api: 'read' | 'mmap'; readahead: boolean; passes: number; warm: boolean; seed: number }
export interface PcAccess { page: number; hit: boolean; fetched: number[]; async: boolean; ns: number; kind: 'hit' | 'minor' | 'major' | 'miss' }
export interface PcResult { acc: PcAccess[]; requests: number; diskPages: number; hits: number; misses: number; copies: number; minor: number; major: number; totalUs: number; windows: number[]; cacheAt: Array<Set<number>> }

export const COST = { diskReqUs: 80, perPageUs: 2, copyUs: 0.6, syscallUs: 0.4, minorUs: 0.25 };

export function pageCache(c: PcCfg): PcResult {
  // thứ tự truy cập
  let x = c.seed >>> 0;
  const rnd = () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; };
  const order: number[] = [];
  for (let p = 0; p < c.passes; p++) {
    const a = Array.from({ length: c.filePages }, (_, k) => k);
    if (c.pattern === 'rand') for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; }
    order.push(...a);
  }
  // cache LRU (Map giữ thứ tự chèn ⇒ đầu Map = lâu nhất chưa dùng)
  const cache = new Map<number, boolean>(); // page → có cờ PG_readahead (mốc kích hoạt đọc trước bất đồng bộ)
  const mapped = new Set<number>();
  const touch = (p: number) => { const v = cache.get(p) ?? false; cache.delete(p); cache.set(p, v); };
  const insert = (p: number, mark: boolean) => {
    if (cache.has(p)) { touch(p); return; }
    cache.set(p, mark);
    while (cache.size > c.cachePages) { const old = cache.keys().next().value as number; cache.delete(old); mapped.delete(old); }
  };
  if (c.warm) for (let p = 0; p < Math.min(c.filePages, c.cachePages); p++) insert(p, false);
  let win = 0, raEnd = 0, last = -2, requests = 0, diskPages = 0, hits = 0, misses = 0, copies = 0, minor = 0, major = 0, totalUs = 0;
  const windows: number[] = [], acc: PcAccess[] = [], cacheAt: Array<Set<number>> = [];
  /** đọc [from, from+n) từ đĩa (bỏ trang đã có), gắn cờ PG_readahead lên trang `markAt` */
  const fetch = (from: number, n: number, markAt: number) => {
    const got: number[] = [];
    for (let p = from; p < Math.min(c.filePages, from + n); p++) if (!cache.has(p)) got.push(p);
    for (const p of got) insert(p, p === markAt);
    if (got.length) { requests++; diskPages += got.length; windows.push(got.length); }
    return got;
  };
  for (const p of order) {
    // đầu file hoặc ngay sau lần đọc trước = tuần tự (giống ondemand_readahead)
    const seq = p === last + 1 || p === 0;
    let a: PcAccess;
    if (cache.has(p)) {
      hits++;
      const marker = cache.get(p)!;
      touch(p);
      let fetched: number[] = [];
      if (marker && c.readahead) {
        // chạm mốc ⇒ đọc trước BẤT ĐỒNG BỘ cửa sổ kế, gấp đôi (tối đa 32 trang = 128 KiB)
        cache.set(p, false);
        win = Math.min(32, win * 2);
        fetched = fetch(raEnd, win, raEnd);
        raEnd += win;
      }
      const isMinor = c.api === 'mmap' && !mapped.has(p);
      if (c.api === 'mmap') { mapped.add(p); if (isMinor) minor++; } else copies++;
      const us = c.api === 'mmap' ? (isMinor ? COST.minorUs : 0.01) : COST.syscallUs + COST.copyUs;
      a = { page: p, hit: true, fetched, async: fetched.length > 0, ns: us * 1000, kind: isMinor ? 'minor' : 'hit' };
      totalUs += us;
    } else {
      misses++;
      if (c.api === 'mmap') major++;
      let fetched: number[];
      if (c.readahead && seq) { win = 4; fetched = fetch(p, win, p + 1); raEnd = p + win; }
      else fetched = fetch(p, 1, -1);
      if (c.api === 'mmap') mapped.add(p); else copies++;
      const us = COST.diskReqUs + COST.perPageUs * fetched.length + (c.api === 'mmap' ? COST.minorUs : COST.syscallUs + COST.copyUs);
      a = { page: p, hit: false, fetched, async: false, ns: us * 1000, kind: c.api === 'mmap' ? 'major' : 'miss' };
      totalUs += us;
    }
    acc.push(a); last = p;
    cacheAt.push(new Set(cache.keys()));
  }
  return { acc, requests, diskPages, hits, misses, copies, minor, major, totalUs, windows, cacheAt };
}
