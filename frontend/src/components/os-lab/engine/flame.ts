/**
 * Đọc flame graph (bài 15.2–15.4, đợt mô phỏng #4): dựng lại cây khung từ dữ liệu THẬT của 8 flame graph Chương 15
 * (flamedata.ts — sinh từ lab/code/ch15/fg/*.svg), tính SELF / TOTAL y như lab/code/ch15/folded.py, tìm tên, phóng một
 * nhánh, và đọc chế độ differential (độ rộng = bản SAU, màu = chênh lệch). Kiểm trong flame.test.ts với c152–c154.
 */
import { FLAME_RAW } from './flamedata';

export interface FNode { id: number; name: string; depth: number; start: number; n: number; self: number; delta: number; parent: number; kids: number[] }
export interface Flame { key: string; title: string; unit: 'samples' | 'us'; total: number; diff: boolean; nodes: FNode[] }

const cache = new Map<string, Flame>();
export const FLAME_KEYS = Object.keys(FLAME_RAW);

export function flame(key: string): Flame {
  const hit = cache.get(key);
  if (hit) return hit;
  const R = FLAME_RAW[key];
  const nodes: FNode[] = [];
  const px: Array<[number, number]> = [];
  for (let k = 0; k < R.f.length; k += 6) {
    nodes.push({ id: nodes.length, name: R.names[R.f[k]], depth: R.f[k + 1], start: 0, n: R.f[k + 4], self: 0, delta: R.f[k + 5] / 100, parent: -1, kids: [] });
    px.push([R.f[k + 2] / 10, R.f[k + 3] / 10]);
  }
  // cha = khung ở độ sâu d−1 HẸP NHẤT bao trọn khung con trên trục x của SVG (flamegraph.pl dùng cùng một thang)
  const byDepth = new Map<number, FNode[]>();
  for (const nd of nodes) { if (!byDepth.has(nd.depth)) byDepth.set(nd.depth, []); byDepth.get(nd.depth)!.push(nd); }
  for (const nd of nodes) {
    if (nd.depth === 0) continue;
    const [x, w] = px[nd.id];
    let best: FNode | undefined;
    for (const u of byDepth.get(nd.depth - 1) ?? []) {
      const [ux, uw] = px[u.id];
      if (ux - 0.06 <= x && x + w <= ux + uw + 0.06 && (!best || uw < px[best.id][1])) best = u;
    }
    if (best) { nd.parent = best.id; best.kids.push(nd.id); }
  }
  for (const nd of nodes) {
    nd.kids.sort((a, b) => px[a][0] - px[b][0]);
    nd.self = Math.max(0, nd.n - nd.kids.reduce((s, k) => s + nodes[k].n, 0));
  }
  // toạ độ theo MẪU: con nằm đúng chỗ tương đối như trong SVG, xếp liền nhau, kẹp trong khoảng của cha
  const place = (id: number) => {
    const nd = nodes[id];
    let x = nd.start;
    for (const k of nd.kids) {
      const c = nodes[k];
      const want = nd.start + Math.round(((px[k][0] - px[id][0]) / Math.max(1e-9, px[id][1])) * nd.n);
      c.start = Math.min(Math.max(want, x), nd.start + nd.n - c.n);
      x = c.start + c.n;
      place(k);
    }
  };
  nodes.filter((nd) => nd.depth === 0).forEach((r) => place(r.id));
  const F: Flame = { key, title: R.title, unit: R.unit, total: R.total, diff: R.diff, nodes };
  cache.set(key, F);
  return F;
}

/** SELF và TOTAL theo tên hàm — y như folded.py (TOTAL đếm mỗi ngăn xếp một lần dù hàm đệ quy). */
export function byName(F: Flame) {
  const self = new Map<string, number>(), total = new Map<string, number>();
  const anc = (nd: FNode, name: string) => { for (let p = nd.parent; p >= 0; p = F.nodes[p].parent) if (F.nodes[p].name === name) return true; return false; };
  for (const nd of F.nodes) {
    if (nd.name === 'all') continue;
    self.set(nd.name, (self.get(nd.name) ?? 0) + nd.self);
    if (!anc(nd, nd.name)) total.set(nd.name, (total.get(nd.name) ?? 0) + nd.n);
  }
  const rank = (m: Map<string, number>) => [...m.entries()].filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(([name, v]) => ({ name, v, pct: (100 * v) / F.total }));
  return { self: rank(self), total: rank(total) };
}

/** Folded stack (dạng "a;b;c N") dựng lại từ cây — chỉ những ngăn xếp có mẫu tự thân. */
export function folded(F: Flame): string[] {
  const out: string[] = [];
  const path = (nd: FNode): string[] => { const p: string[] = []; for (let x: FNode | undefined = nd; x && x.name !== 'all'; x = x.parent >= 0 ? F.nodes[x.parent] : undefined) p.unshift(x.name); return p; };
  for (const nd of F.nodes) if (nd.self > 0 && nd.name !== 'all') out.push(`${path(nd).join(';')} ${nd.self}`);
  return out.sort((a, b) => Number(b.split(' ').pop()) - Number(a.split(' ').pop()));
}

/** Tìm: mọi khung có tên chứa chuỗi (không phân biệt hoa thường); % = tổng TOTAL không đếm trùng tổ tiên khớp. */
export function search(F: Flame, q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return { ids: new Set<number>(), pct: 0 };
  const ids = new Set<number>();
  let sum = 0;
  for (const nd of F.nodes) {
    if (nd.name === 'all' || !nd.name.toLowerCase().includes(s)) continue;
    ids.add(nd.id);
    let covered = false;
    for (let p = nd.parent; p >= 0; p = F.nodes[p].parent) if (F.nodes[p].name.toLowerCase().includes(s)) { covered = true; break; }
    if (!covered) sum += nd.n;
  }
  return { ids, pct: (100 * sum) / F.total };
}

/** Đường từ gốc tới khung (để vẽ "breadcrumb" khi phóng). */
export function ancestry(F: Flame, id: number): FNode[] {
  const out: FNode[] = [];
  for (let x: number = id; x >= 0; x = F.nodes[x].parent) out.unshift(F.nodes[x]);
  return out;
}

/** Màu kiểu flamegraph.pl: on-CPU vàng–đỏ, off-CPU (io) xanh, diff đỏ/xanh theo chênh lệch. */
export function frameColor(F: Flame, nd: FNode, offCpu: boolean): string {
  if (F.diff) {
    if (nd.delta === 0) return 'rgb(222,222,222)';
    const k = Math.min(1, Math.abs(nd.delta) / 8);
    const v = Math.round(220 - 170 * k);
    return nd.delta > 0 ? `rgb(255,${v},${v})` : `rgb(${v},${v},255)`;
  }
  let h = 0;
  for (let i = 0; i < nd.name.length; i++) h = (h * 31 + nd.name.charCodeAt(i)) >>> 0;
  const r = (h % 1000) / 1000;
  if (offCpu) return `rgb(${Math.round(80 + 40 * r)},${Math.round(130 + 50 * r)},${Math.round(200 + 40 * r)})`;
  return `rgb(${Math.round(205 + 50 * r)},${Math.round(80 + 140 * r)},${Math.round(40 * r)})`;
}

/** Câu hỏi "hàm nóng nhất là gì?" với hàm bị JIT inline (c154: --cpu-prof của Node đo lại cùng chương trình). */
export const INLINE_TRAP = {
  cpuprofSelf: [['report orders.js:22', 4590, 83.2], ['(idle)', 631, 11.4], ['totals orders.js:16', 83, 1.5], ['uniqueCustomers orders.js:10', 38, 0.7]] as Array<[string, number, number]>,
  hotLine: ['orders.js:24', 91.3, 'const customers = uniqueCustomers(list);'] as [string, number, string],
  fixed: { before: { rps: 93, p99: 13.6 }, after: { rps: 1052, p99: 1.2 } },
};
