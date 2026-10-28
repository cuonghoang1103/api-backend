/**
 * Lập lịch tay đĩa (bài 16.5, đợt mô phỏng #4): FCFS / SSTF / SCAN / LOOK / C-SCAN / C-LOOK — viết lại ĐÚNG luật của
 * `osgcalc.py disk` (lab/code/ch16), đối chiếu với lab/out/c165-banker-dia trong disk.test.ts.
 *
 * Quy ước (ghi rõ như Ch16 dặn):
 *   • SSTF hoà khoảng cách ⇒ chọn trụ NHỎ hơn;
 *   • SCAN / C-SCAN chỉ chạy tới mép (0 hoặc max) khi phía bên kia CÒN yêu cầu; hết yêu cầu thì dừng;
 *   • C-SCAN đi lên: tới max, nhảy về 0, quét lên tiếp. Cú nhảy max → 0 được TÍNH vào tổng (385 trụ ở đề 16.5) — vài
 *     sách/đề bỏ nó ra (186). `countReturn = false` ⇒ bỏ cú nhảy của C-SCAN và C-LOOK khỏi tổng (đường vẫn vẽ, nét đứt);
 *   • hướng "xuống" đối xứng.
 */
export type DAlgo = 'fcfs' | 'sstf' | 'scan' | 'look' | 'cscan' | 'clook';
export const D_ALGOS: DAlgo[] = ['fcfs', 'sstf', 'scan', 'look', 'cscan', 'clook'];
export const D_NAME: Record<DAlgo, [string, string]> = {
  fcfs: ['FCFS', 'FCFS'], sstf: ['SSTF (shortest seek first)', 'SSTF (gần nhất trước)'], scan: ['SCAN (elevator, to the edge)', 'SCAN (thang máy, tới mép)'],
  look: ['LOOK (turn at the last request)', 'LOOK (quay ở yêu cầu cuối)'], cscan: ['C-SCAN (to the edge, jump back)', 'C-SCAN (tới mép, nhảy về)'], clook: ['C-LOOK (jump back to the lowest request)', 'C-LOOK (nhảy về yêu cầu thấp nhất)'],
};
export interface DOpts { head: number; reqs: number[]; up: boolean; max: number; countReturn: boolean }
export interface DMove { from: number; to: number; dist: number; /** cú nhảy quay về của C-SCAN/C-LOOK (không phục vụ gì trên đường) */ jump: boolean; /** chạm mép không phải yêu cầu */ edge: boolean; counted: boolean }
export interface DResult { order: number[]; moves: DMove[]; total: number; totalWithJump: number; served: number[] }

export function diskSchedule(algo: DAlgo, o: DOpts): DResult {
  const { head, up, max } = o;
  const pend = [...o.reqs];
  const order = [head];
  const edges = new Set<number>();
  const jumps = new Set<number>(); // chỉ số trong order: bước tới order[k] là cú nhảy
  if (algo === 'fcfs') order.push(...pend);
  else if (algo === 'sstf') {
    let pos = head;
    while (pend.length) {
      let k = 0;
      for (let j = 1; j < pend.length; j++) {
        const a = Math.abs(pend[j] - pos), b = Math.abs(pend[k] - pos);
        if (a < b || (a === b && pend[j] < pend[k])) k = j;
      }
      pos = pend.splice(k, 1)[0]; order.push(pos);
    }
  } else {
    const asc = (a: number, b: number) => a - b;
    let hi = pend.filter((c) => c >= head).sort(asc);
    let lo = pend.filter((c) => c < head).sort((a, b) => b - a);
    if (!up) { hi = pend.filter((c) => c <= head).sort((a, b) => b - a); lo = pend.filter((c) => c > head).sort(asc); }
    const edgeA = up ? max : 0, edgeB = up ? 0 : max;
    const add = (xs: number[]) => order.push(...xs);
    if (algo === 'look') { add(hi); add(lo); }
    else if (algo === 'scan') { add(hi); if (lo.length) { order.push(edgeA); edges.add(order.length - 1); } add(lo); }
    else if (algo === 'clook') { add(hi); const back = up ? [...lo].sort(asc) : [...lo].sort((a, b) => b - a); if (back.length) jumps.add(order.length); add(back); }
    else if (algo === 'cscan') {
      add(hi);
      if (lo.length) { order.push(edgeA); edges.add(order.length - 1); order.push(edgeB); edges.add(order.length - 1); jumps.add(order.length - 1); }
      add(up ? [...lo].sort(asc) : [...lo].sort((a, b) => b - a));
    }
  }
  const moves: DMove[] = [];
  for (let k = 1; k < order.length; k++) {
    const jump = jumps.has(k);
    moves.push({ from: order[k - 1], to: order[k], dist: Math.abs(order[k] - order[k - 1]), jump, edge: edges.has(k), counted: !jump || o.countReturn });
  }
  const totalWithJump = moves.reduce((s, m) => s + m.dist, 0);
  return { order, moves, total: moves.reduce((s, m) => s + (m.counted ? m.dist : 0), 0), totalWithJump, served: order.slice(1).filter((_, k) => !edges.has(k + 1)) };
}

/** Đề 16.5 (c165): đầu đọc ở 80, đang đi lên, đĩa 0…199. */
export const DISK_165: DOpts = { head: 80, reqs: [45, 132, 12, 98, 181, 67, 140, 30], up: true, max: 199, countReturn: true };

/** Độ lệch trụ (cylinder skew) = ⌈thời gian chuyển trụ ÷ thời gian một sector đi qua⌉ (osgcalc skew). */
export function cylinderSkew(rpm: number, seekMs: number, sectors: number) {
  const rotMs = 60000 / rpm, perSector = rotMs / sectors;
  return { rotMs, perSector, passing: seekMs / perSector, skew: Math.ceil(seekMs / perSector - 1e-9) };
}

/** Nhận ra thuật toán từ thứ tự đi (bài K1.3): mọi thuật toán cho đúng thứ tự này với cùng đầu đọc + yêu cầu. */
export function whichAlgo(o: DOpts, visited: number[]): DAlgo[] {
  const want = visited.join(',');
  const out: DAlgo[] = [];
  for (const a of D_ALGOS) for (const up of [true, false]) {
    if ((a === 'fcfs' || a === 'sstf') && !up) continue;
    const r = diskSchedule(a, { ...o, up });
    if (r.order.join(',') === want && !out.includes(a)) out.push(a);
  }
  return out;
}
