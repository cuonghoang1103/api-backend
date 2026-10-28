/**
 * Bộ nhớ đệm (cache) — hàm thuần, khớp CEA201 Chương 4 (Stallings): ánh xạ trực tiếp, kết hợp tập hợp k-way, kết hợp
 * toàn phần; thay thế LRU / FIFO. Địa chỉ tách thành tag | index (số tập) | offset (vị trí trong khối).
 */
export type Policy = 'lru' | 'fifo';
export interface CacheCfg {
  /** số bit địa chỉ (byte-addressed) */
  addrBits: number;
  /** byte mỗi khối (luỹ thừa 2) */
  blockSize: number;
  /** tổng số dòng cache (luỹ thừa 2) */
  lines: number;
  /** số đường mỗi tập: 1 = ánh xạ trực tiếp, = lines là kết hợp toàn phần */
  ways: number;
  policy: Policy;
}
export const log2 = (n: number) => Math.round(Math.log2(n));
export function geometry(c: CacheCfg) {
  const sets = Math.max(1, c.lines / c.ways);
  const offsetBits = log2(c.blockSize);
  const indexBits = log2(sets);
  const tagBits = c.addrBits - indexBits - offsetBits;
  return { sets, offsetBits, indexBits, tagBits };
}
export function split(addr: number, c: CacheCfg) {
  const g = geometry(c);
  const offset = addr % c.blockSize;
  const block = Math.floor(addr / c.blockSize);
  const index = block % g.sets;
  const tag = Math.floor(block / g.sets);
  return { ...g, offset, block, index, tag };
}

export interface Line { valid: boolean; tag: number; block: number; lastUsed: number; loadedAt: number }
export interface Access {
  addr: number; block: number; tag: number; index: number; offset: number;
  hit: boolean;
  way: number;
  /** khối bị đẩy ra (null nếu dòng còn trống) */
  evicted: number | null;
  /** loại trượt: lần đầu (compulsory) / xung đột hoặc dung lượng */
  missKind?: 'cold' | 'conflict';
}
export interface CacheSnap { i: number; acc: Access | null; sets: Line[][]; hits: number; misses: number }

const empty = (): Line => ({ valid: false, tag: 0, block: -1, lastUsed: -1, loadedAt: -1 });

export function simulate(addrs: number[], c: CacheCfg): CacheSnap[] {
  const g = geometry(c);
  let sets: Line[][] = Array.from({ length: g.sets }, () => Array.from({ length: c.ways }, empty));
  const seen = new Set<number>();
  const out: CacheSnap[] = [{ i: 0, acc: null, sets, hits: 0, misses: 0 }];
  let hits = 0, misses = 0;
  addrs.forEach((addr, t) => {
    const sp = split(addr, c);
    sets = sets.map((s) => s.map((l) => ({ ...l })));
    const set = sets[sp.index];
    let way = set.findIndex((l) => l.valid && l.tag === sp.tag);
    let evicted: number | null = null;
    const hit = way >= 0;
    let missKind: Access['missKind'];
    if (hit) { hits++; set[way].lastUsed = t; }
    else {
      misses++;
      missKind = seen.has(sp.block) ? 'conflict' : 'cold';
      way = set.findIndex((l) => !l.valid);
      if (way < 0) {
        // chọn nạn nhân: LRU = dùng lâu nhất; FIFO = nạp sớm nhất
        const key = (l: Line) => (c.policy === 'lru' ? l.lastUsed : l.loadedAt);
        way = set.reduce((best, l, k) => (key(l) < key(set[best]) ? k : best), 0);
        evicted = set[way].block;
      }
      set[way] = { valid: true, tag: sp.tag, block: sp.block, lastUsed: t, loadedAt: t };
    }
    seen.add(sp.block);
    out.push({ i: t + 1, acc: { addr, block: sp.block, tag: sp.tag, index: sp.index, offset: sp.offset, hit, way, evicted, missKind }, sets, hits, misses });
  });
  return out;
}

/** Thời gian truy cập trung bình: hit_time + miss_rate × miss_penalty (ns). */
export const amat = (hits: number, misses: number, hitNs = 1, penaltyNs = 100) => {
  const n = hits + misses;
  return n ? hitNs + (misses / n) * penaltyNs : 0;
};

export const CACHE_PRESETS: Record<string, { en: string; vi: string; cfg: CacheCfg; addrs: number[]; noteEn: string; noteVi: string }> = {
  textbook: {
    en: 'Textbook: block addresses 0, 8, 0, 6, 8', vi: 'Sách giáo khoa: khối 0, 8, 0, 6, 8',
    cfg: { addrBits: 8, blockSize: 1, lines: 4, ways: 1, policy: 'lru' },
    addrs: [0, 8, 0, 6, 8],
    noteEn: 'The classic Patterson & Hennessy example (4 one-word blocks). Direct-mapped: 5 misses. Switch to 2-way: 4 misses. Fully associative: 3 misses.',
    noteVi: 'Ví dụ kinh điển của Patterson & Hennessy (4 khối 1 từ). Ánh xạ trực tiếp: 5 lần trượt. Đổi sang 2-way: 4 lần. Kết hợp toàn phần: 3 lần.',
  },
  sequential: {
    en: 'Walk an array in order (spatial locality)', vi: 'Duyệt mảng tuần tự (cục bộ không gian)',
    cfg: { addrBits: 16, blockSize: 16, lines: 8, ways: 1, policy: 'lru' },
    addrs: Array.from({ length: 32 }, (_, k) => 0x100 + 4 * k),
    noteEn: '4-byte ints, 16-byte blocks: one miss brings in 4 ints, so 3 of every 4 accesses hit (75%).',
    noteVi: 'int 4 byte, khối 16 byte: một lần trượt kéo về 4 int, nên 3 trên 4 lần truy cập trúng (75%).',
  },
  loop: {
    en: 'A loop re-reading a small array (temporal locality)', vi: 'Vòng lặp đọc lại mảng nhỏ (cục bộ thời gian)',
    cfg: { addrBits: 16, blockSize: 16, lines: 8, ways: 2, policy: 'lru' },
    addrs: [0, 1, 2].flatMap(() => Array.from({ length: 8 }, (_, k) => 0x200 + 8 * k)),
    noteEn: 'The array fits in the cache: the first pass misses, every later pass hits.',
    noteVi: 'Mảng vừa cache: lượt đầu trượt, mọi lượt sau đều trúng.',
  },
  conflict: {
    en: 'Two arrays that collide (conflict misses)', vi: 'Hai mảng đụng nhau (trượt xung đột)',
    cfg: { addrBits: 16, blockSize: 16, lines: 8, ways: 1, policy: 'lru' },
    addrs: Array.from({ length: 8 }, (_, k) => [0x000 + 4 * k, 0x080 + 4 * k]).flat(),
    noteEn: 'c[i] = a[i] + b[i] with a[] and b[] exactly 128 bytes apart = the cache size ⇒ same index, they evict each other every time: 0% hits even though each block holds 4 ints. Switch to 2-way and they coexist: 12 of 16 hit.',
    noteVi: 'c[i] = a[i] + b[i] với a[] và b[] cách nhau đúng 128 byte = dung lượng cache ⇒ cùng index, lần nào cũng đẩy nhau ra: 0% trúng dù mỗi khối chứa 4 int. Đổi sang 2-way là chúng ở chung được: 12/16 trúng.',
  },
  matrix: {
    en: 'Matrix: row order vs column order', vi: 'Ma trận: duyệt theo hàng vs theo cột',
    cfg: { addrBits: 16, blockSize: 16, lines: 2, ways: 1, policy: 'lru' },
    // int m[4][4] tại 0x400; duyệt theo CỘT (j ngoài, i trong): mỗi bước nhảy 16 byte
    addrs: Array.from({ length: 4 }, (_, j) => Array.from({ length: 4 }, (_, i) => 0x400 + 16 * i + 4 * j)).flat(),
    noteEn: 'int m[4][4], read column by column (m[i][j] with i in the inner loop). Each step jumps a whole row = a new block, and the 2-line cache keeps evicting: 0% hits. Read it row by row instead and 12 of 16 hit.',
    noteVi: 'int m[4][4], đọc theo cột (m[i][j] với i ở vòng trong). Mỗi bước nhảy cả một hàng = một khối mới, cache 2 dòng đẩy ra liên tục: 0% trúng. Đọc theo hàng thì 12/16 lần trúng.',
  },
};
