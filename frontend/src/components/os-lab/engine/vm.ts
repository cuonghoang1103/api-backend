/**
 * Bộ nhớ ảo rút gọn: địa chỉ ảo 16 bit = VPN 4 bit + offset 12 bit (trang 4 KiB), 16 trang ảo, N khung vật lý,
 * TLB 4 mục (LRU), lỗi trang minor (trang mới/zero-fill) và major (đọc lại từ swap/đĩa), thay trang FIFO/LRU/Clock/OPT.
 * Giá thời gian là CỠ ĐỘ LỚN để so sánh (RAM ~100 ns, lỗi trang minor ~1 µs, đọc swap trên SSD ~100 µs), không phải số đo.
 */
export type Algo = 'fifo' | 'lru' | 'clock' | 'opt';
export type Region = 'code' | 'data' | 'heap' | 'stack' | 'none';
export interface Acc { va: number; w: boolean; note?: string }
export interface PTE { present: boolean; frame: number; dirty: boolean; ref: boolean; swapped: boolean; touched: boolean; region: Region }
export interface VmSnap {
  i: number; acc: Acc | null; vpn: number; off: number;
  tlbHit: boolean | null; fault: 'none' | 'minor' | 'major' | 'segv' | null; frame: number | null; pa: number | null;
  victim: { vpn: number; dirty: boolean } | null;
  pt: PTE[]; tlb: Array<{ vpn: number; frame: number; age: number }>; frames: Array<number | null>; swap: number[];
  cost: number; total: number; counts: { tlbHit: number; tlbMiss: number; minor: number; major: number; swapOut: number; segv: number };
}
export const LAT = { ram: 100, minor: 1_000, major: 100_000, swapOut: 100_000 };
export const REGIONS: Region[] = ['code', 'code', 'data', 'heap', 'heap', 'heap', 'heap', 'none', 'none', 'none', 'none', 'none', 'none', 'stack', 'stack', 'stack'];

export function translate(accs: Acc[], nFrames: number, algo: Exclude<Algo, 'opt'> = 'lru'): VmSnap[] {
  const pt: PTE[] = REGIONS.map((r) => ({ present: false, frame: -1, dirty: false, ref: false, swapped: false, touched: false, region: r }));
  // code là trang file-backed: lần đầu đọc từ file ELF (major, trừ khi đã nằm trong page cache)
  const frames: Array<number | null> = Array(nFrames).fill(null);
  const loadedAt: number[] = Array(16).fill(-1), usedAt: number[] = Array(16).fill(-1);
  let hand = 0;
  const tlb: Array<{ vpn: number; frame: number; age: number }> = [];
  const swap: number[] = [];
  const counts = { tlbHit: 0, tlbMiss: 0, minor: 0, major: 0, swapOut: 0, segv: 0 };
  let total = 0;
  const snap = (i: number, acc: Acc | null, extra: Partial<VmSnap>): VmSnap => ({
    i, acc, vpn: acc ? acc.va >> 12 : 0, off: acc ? acc.va & 0xfff : 0, tlbHit: null, fault: null, frame: null, pa: null, victim: null,
    pt: pt.map((e) => ({ ...e })), tlb: tlb.map((e) => ({ ...e })), frames: [...frames], swap: [...swap], cost: 0, total, counts: { ...counts }, ...extra,
  });
  const out: VmSnap[] = [snap(0, null, {})];
  accs.forEach((acc, k) => {
    const t = k + 1, vpn = (acc.va >> 12) & 15, off = acc.va & 0xfff, e = pt[vpn];
    let cost = 0, fault: VmSnap['fault'] = 'none', victim: VmSnap['victim'] = null, tlbHit = false;
    if (e.region === 'none') {
      counts.segv++; fault = 'segv'; cost = LAT.minor;
      total += cost;
      out.push(snap(t, acc, { tlbHit: false, fault, cost, total, counts: { ...counts } }));
      return;
    }
    const hitIdx = tlb.findIndex((x) => x.vpn === vpn);
    if (hitIdx >= 0) { tlbHit = true; counts.tlbHit++; cost += 1; tlb[hitIdx].age = t; }
    else {
      counts.tlbMiss++; cost += 1 + LAT.ram; // tra TLB + đi bảng trang (1 cấp ở đây; x86-64 thật là 4 cấp)
      if (!e.present) {
        let f = frames.indexOf(null);
        if (f < 0) {
          // chọn nạn nhân
          const resident = frames.map((v, j) => [v as number, j] as const);
          if (algo === 'fifo') f = resident.reduce((a, b) => (loadedAt[b[0]] < loadedAt[a[0]] ? b : a))[1];
          else if (algo === 'lru') f = resident.reduce((a, b) => (usedAt[b[0]] < usedAt[a[0]] ? b : a))[1];
          else {
            for (;;) { const v = frames[hand] as number; if (pt[v].ref) { pt[v].ref = false; hand = (hand + 1) % nFrames; } else { f = hand; hand = (hand + 1) % nFrames; break; } }
          }
          const vv = frames[f] as number, ve = pt[vv];
          victim = { vpn: vv, dirty: ve.dirty || ve.region === 'heap' || ve.region === 'stack' };
          if (victim.dirty) { counts.swapOut++; cost += LAT.swapOut; if (!swap.includes(vv)) swap.push(vv); ve.swapped = true; }
          ve.present = false; ve.frame = -1; ve.dirty = false;
          const ti = tlb.findIndex((x) => x.vpn === vv); if (ti >= 0) tlb.splice(ti, 1); // TLB shootdown
        }
        // nạp trang
        if (e.swapped || (e.region === 'code' && !e.touched) || (e.region === 'data' && !e.touched)) { fault = 'major'; counts.major++; cost += LAT.major; }
        else { fault = 'minor'; counts.minor++; cost += LAT.minor; }
        if (e.swapped) { const si = swap.indexOf(vpn); if (si >= 0) swap.splice(si, 1); e.swapped = false; }
        frames[f] = vpn; e.present = true; e.frame = f; e.touched = true; loadedAt[vpn] = t;
      }
      tlb.push({ vpn, frame: e.frame, age: t });
      if (tlb.length > 4) tlb.splice(tlb.reduce((a, x, j) => (x.age < tlb[a].age ? j : a), 0), 1);
    }
    cost += LAT.ram; // truy cập dữ liệu thật
    e.ref = true; usedAt[vpn] = t; if (acc.w) e.dirty = true;
    total += cost;
    out.push(snap(t, acc, { vpn, off, tlbHit, fault, frame: e.frame, pa: e.frame * 4096 + off, victim, cost, total, counts: { ...counts } }));
  });
  return out;
}

export const VM_PRESETS: Record<string, { en: string; vi: string; frames: number; accs: Acc[] }> = {
  walk: {
    en: 'Walk an array on the heap', vi: 'Duyệt một mảng trên heap', frames: 6,
    accs: [0x3000, 0x3004, 0x3008, 0x3ffc, 0x4000, 0x4004, 0x4ff8, 0x5000, 0x5010, 0x3010].map((va, k) => ({ va, w: k % 3 === 0 })),
  },
  program: {
    en: 'A program starts: code, data, heap, stack', vi: 'Một chương trình khởi động: code, data, heap, stack', frames: 6,
    accs: [
      { va: 0x0040, w: false, note: 'fetch main()' }, { va: 0xf3c0, w: true, note: 'push frame' }, { va: 0x2010, w: false, note: 'read global' },
      { va: 0x0180, w: false, note: 'call f()' }, { va: 0x3020, w: true, note: 'malloc + write' }, { va: 0xf3a0, w: true, note: 'local var' },
      { va: 0x0040, w: false }, { va: 0x3024, w: true }, { va: 0xe000, w: true, note: 'stack grows' }, { va: 0x8000, w: true, note: 'bad pointer' },
    ],
  },
  pressure: {
    en: 'RAM pressure: 5 pages, 3 frames', vi: 'Thiếu RAM: 5 trang, 3 khung', frames: 3,
    accs: [0x3000, 0x4000, 0x5000, 0x6000, 0xf000, 0x3000, 0x4000, 0x5000, 0x6000, 0xf000, 0x3000, 0x4000].map((va) => ({ va, w: true })),
  },
};

/* ── Thay trang trên chuỗi tham chiếu (dạng bài thi) ── */
export interface RepStep { ref: number; frames: Array<number | null>; hit: boolean; victim: number | null }
export function replace(refs: number[], n: number, algo: Algo): RepStep[] {
  const frames: Array<number | null> = Array(n).fill(null);
  const loaded = new Map<number, number>(), used = new Map<number, number>(), ref = new Map<number, boolean>();
  let hand = 0;
  return refs.map((r, t) => {
    let hit = frames.includes(r), victim: number | null = null;
    if (hit) { used.set(r, t); ref.set(r, true); return { ref: r, frames: [...frames], hit, victim }; }
    let f = frames.indexOf(null);
    if (f < 0) {
      if (algo === 'fifo') f = frames.reduce<number>((a, v, j) => ((loaded.get(v!) ?? 0) < (loaded.get(frames[a]!) ?? 0) ? j : a), 0);
      else if (algo === 'lru') f = frames.reduce<number>((a, v, j) => ((used.get(v!) ?? 0) < (used.get(frames[a]!) ?? 0) ? j : a), 0);
      else if (algo === 'opt') {
        let far = -1;
        frames.forEach((v, j) => { const nx = refs.indexOf(v!, t + 1); const d = nx < 0 ? Infinity : nx; if (d > far) { far = d; f = j; } });
      } else {
        for (;;) { const v = frames[hand]!; if (ref.get(v)) { ref.set(v, false); hand = (hand + 1) % n; } else { f = hand; hand = (hand + 1) % n; break; } }
      }
      victim = frames[f];
    }
    frames[f] = r; loaded.set(r, t); used.set(r, t); ref.set(r, true);
    hit = false;
    return { ref: r, frames: [...frames], hit, victim };
  });
}

export const REF_PRESETS: Record<string, { en: string; vi: string; refs: number[]; frames: number }> = {
  exam: { en: 'Exam string (Silberschatz)', vi: 'Chuỗi đề thi (Silberschatz)', refs: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], frames: 3 },
  belady: { en: 'Belady\'s anomaly (try FIFO with 3 then 4 frames)', vi: 'Nghịch lý Belady (thử FIFO với 3 rồi 4 khung)', refs: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], frames: 3 },
  loop: { en: 'A loop over 5 pages (working set = 5)', vi: 'Vòng lặp qua 5 trang (working set = 5)', refs: Array.from({ length: 4 }, () => [1, 2, 3, 4, 5]).flat(), frames: 4 },
};
