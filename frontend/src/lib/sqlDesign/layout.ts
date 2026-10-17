// ⛔ BẢN CHÉP — sửa ở src/services/work/sqlDesign/ rồi chạy scripts/dong-bo-sql-design.mjs
/**
 * Database designer — XẾP CHỖ ERD tự động (thuần, không DOM): bảng cha một cột, bảng con cột kế bên (LR) hoặc tầng dưới
 * (TB); thứ tự trong mỗi tầng giảm giao cắt bằng trọng tâm (barycenter); mỗi bảng kéo về gần các bảng nó nối; các cụm
 * rời nhau xếp kệ (shelf). Bảng người đã kéo tay (`fixed`) giữ nguyên chỗ, bảng mới xếp bên phải chúng.
 */

export interface LayoutNode { id: string; w: number; h: number }
export interface LayoutEdge { from: string; to: string }
export interface LayoutOptions { direction?: 'LR' | 'TB'; gapX?: number; gapY?: number; fixed?: Record<string, [number, number]> }
export type Positions = Record<string, { x: number; y: number }>;

export function layoutErd(nodes: LayoutNode[], edges: LayoutEdge[], opts: LayoutOptions = {}): Positions {
  const dir = opts.direction ?? 'LR';
  const gapX = opts.gapX ?? (dir === 'LR' ? 96 : 48);
  const gapY = opts.gapY ?? (dir === 'LR' ? 36 : 80);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const fixed = opts.fixed ?? {};
  const out: Positions = {};
  for (const n of nodes) if (fixed[n.id]) out[n.id] = { x: fixed[n.id][0], y: fixed[n.id][1] };
  const free = nodes.filter((n) => !out[n.id]);
  if (!free.length) return out;
  const freeSet = new Set(free.map((n) => n.id));
  const es = edges.filter((e) => e.from !== e.to && freeSet.has(e.from) && freeSet.has(e.to));

  // Thành phần liên thông
  const parent = new Map(free.map((n) => [n.id, n.id]));
  const find = (x: string): string => { let r = x; while (parent.get(r) !== r) r = parent.get(r)!; parent.set(x, r); return r; };
  for (const e of es) { const a = find(e.from); const b = find(e.to); if (a !== b) parent.set(a, b); }
  const comps = new Map<string, string[]>();
  for (const n of free) { const r = find(n.id); comps.set(r, [...(comps.get(r) ?? []), n.id]); }
  const singles: string[] = [];
  const blocks: Array<{ pos: Positions; w: number; h: number }> = [];
  for (const ids of comps.values()) {
    if (ids.length === 1) { singles.push(ids[0]); continue; }
    blocks.push(layoutComponent(ids, es.filter((e) => ids.includes(e.from)), byId, dir, gapX, gapY));
  }
  // Bảng đứng riêng: lưới gọn
  if (singles.length) {
    const cols = Math.max(1, Math.ceil(Math.sqrt(singles.length)));
    const pos: Positions = {};
    let x = 0; let y = 0; let rowH = 0; let w = 0;
    singles.forEach((id, i) => {
      const n = byId.get(id)!;
      if (i % cols === 0 && i) { x = 0; y += rowH + gapY; rowH = 0; }
      pos[id] = { x, y };
      x += n.w + 48; rowH = Math.max(rowH, n.h); w = Math.max(w, x - 48);
    });
    blocks.push({ pos, w, h: y + rowH });
  }
  // Xếp kệ các cụm (lớn trước)
  blocks.sort((a, b) => b.w * b.h - a.w * a.h);
  const totalArea = blocks.reduce((s, b) => s + (b.w + gapX) * (b.h + gapY), 0);
  const maxRow = Math.max(blocks[0]?.w ?? 0, Math.sqrt(totalArea) * 1.7);
  const fx = Object.values(out);
  const originX = fx.length ? Math.max(...fx.map((p, i) => p.x + (byId.get(Object.keys(out)[i])?.w ?? 0))) + gapX * 1.5 : 0;
  const originY = fx.length ? Math.min(...fx.map((p) => p.y)) : 0;
  let cx = 0; let cy = 0; let rowH = 0;
  for (const b of blocks) {
    if (cx > 0 && cx + b.w > maxRow) { cx = 0; cy += rowH + gapY * 2; rowH = 0; }
    for (const [id, p] of Object.entries(b.pos)) out[id] = { x: Math.round(originX + cx + p.x), y: Math.round(originY + cy + p.y) };
    cx += b.w + gapX * 1.5; rowH = Math.max(rowH, b.h);
  }
  return out;
}

function layoutComponent(ids: string[], edges: LayoutEdge[], byId: Map<string, LayoutNode>, dir: 'LR' | 'TB', gapX: number, gapY: number) {
  // Cạnh cha → con; bỏ cạnh ngược (vòng) bằng DFS theo thứ tự viết.
  const kids = new Map<string, string[]>(ids.map((i) => [i, []]));
  const parentsOf = new Map<string, string[]>(ids.map((i) => [i, []]));
  const state = new Map<string, number>();
  const dag: LayoutEdge[] = [];
  const adj = new Map<string, string[]>(ids.map((i) => [i, []]));
  for (const e of edges) adj.get(e.to)!.push(e.from); // to = cha, from = con
  const visit = (u: string) => {
    state.set(u, 1);
    for (const v of adj.get(u) ?? []) {
      if (state.get(v) === 1) continue; // cạnh ngược
      dag.push({ from: v, to: u });
      if (!state.get(v)) visit(v);
    }
    state.set(u, 2);
  };
  const roots = ids.filter((i) => !edges.some((e) => e.from === i));
  for (const r of [...roots, ...ids]) if (!state.get(r)) visit(r);
  const seen = new Set<string>();
  for (const e of dag) { const k = `${e.to}>${e.from}`; if (seen.has(k)) continue; seen.add(k); kids.get(e.to)!.push(e.from); parentsOf.get(e.from)!.push(e.to); }
  // Tầng = đường dài nhất từ gốc
  const layer = new Map<string, number>();
  const indeg = new Map(ids.map((i) => [i, parentsOf.get(i)!.length]));
  const q = ids.filter((i) => indeg.get(i) === 0);
  for (const i of q) layer.set(i, 0);
  while (q.length) {
    const u = q.shift()!;
    for (const v of kids.get(u)!) {
      layer.set(v, Math.max(layer.get(v) ?? 0, (layer.get(u) ?? 0) + 1));
      indeg.set(v, indeg.get(v)! - 1);
      if (indeg.get(v) === 0) q.push(v);
    }
  }
  // Kéo gốc sát con của nó (gốc chỉ có con ở tầng xa ⇒ đứng ngay trước con gần nhất)
  for (const i of ids) if (!parentsOf.get(i)!.length && kids.get(i)!.length) layer.set(i, Math.max(0, Math.min(...kids.get(i)!.map((k) => layer.get(k)!)) - 1));
  const nLayers = Math.max(...ids.map((i) => layer.get(i)!)) + 1;
  const layers: string[][] = Array.from({ length: nLayers }, () => []);
  for (const i of ids) layers[layer.get(i)!].push(i);
  const order = new Map<string, number>();
  const reindex = () => layers.forEach((L) => L.forEach((id, k) => order.set(id, k)));
  reindex();
  const neigh = (id: string, up: boolean) => (up ? parentsOf.get(id)! : kids.get(id)!);
  for (let pass = 0; pass < 8; pass++) {
    const down = pass % 2 === 0;
    const seq = down ? layers.slice(1) : layers.slice(0, -1).reverse();
    for (const L of seq) {
      const bc = new Map(L.map((id) => {
        const ns = neigh(id, down);
        return [id, ns.length ? ns.reduce((s, x) => s + order.get(x)!, 0) / ns.length : order.get(id)!] as [string, number];
      }));
      L.sort((a, b) => bc.get(a)! - bc.get(b)! || order.get(a)! - order.get(b)!);
      L.forEach((id, k) => order.set(id, k));
    }
  }
  // Toạ độ: trục tầng (main) + trục trong tầng (cross)
  const size = (id: string) => byId.get(id)!;
  const mainLen = (id: string) => (dir === 'LR' ? size(id).w : size(id).h);
  const crossLen = (id: string) => (dir === 'LR' ? size(id).h : size(id).w);
  const gapMain = dir === 'LR' ? gapX : gapY;
  const gapCross = dir === 'LR' ? gapY : gapX;
  const mainPos: number[] = [];
  let acc = 0;
  for (const L of layers) { mainPos.push(acc); acc += Math.max(...L.map(mainLen)) + gapMain; }
  const cross = new Map<string, number>();
  for (const L of layers) { let c = 0; for (const id of L) { cross.set(id, c); c += crossLen(id) + gapCross; } }
  const center = (id: string) => cross.get(id)! + crossLen(id) / 2;
  for (let pass = 0; pass < 6; pass++) {
    const seq = pass % 2 === 0 ? layers : [...layers].reverse();
    for (const L of seq) {
      const want = L.map((id) => {
        const ns = [...parentsOf.get(id)!, ...kids.get(id)!];
        return ns.length ? ns.reduce((s, x) => s + center(x), 0) / ns.length - crossLen(id) / 2 : cross.get(id)!;
      });
      // giữ thứ tự, không chồng: đẩy xuôi, rồi dời cả tầng về trung bình độ lệch so với chỗ mong muốn
      const pos = [...want];
      for (let k = 1; k < L.length; k++) pos[k] = Math.max(pos[k], pos[k - 1] + crossLen(L[k - 1]) + gapCross);
      const shift = L.length ? want.reduce((s2, w, k) => s2 + (w - pos[k]), 0) / L.length : 0;
      L.forEach((id, k) => cross.set(id, pos[k] + shift));
    }
  }
  const minC = Math.min(...ids.map((i) => cross.get(i)!));
  const pos: Positions = {};
  let w = 0; let h = 0;
  layers.forEach((L, li) => L.forEach((id) => {
    const c = cross.get(id)! - minC;
    const p = dir === 'LR' ? { x: mainPos[li], y: c } : { x: c, y: mainPos[li] };
    pos[id] = p;
    w = Math.max(w, p.x + size(id).w); h = Math.max(h, p.y + size(id).h);
  }));
  return { pos, w, h };
}

/** Kiểm hai bảng có chồng lên nhau không (dùng trong test + khi người kéo thả). */
export function overlaps(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }, pad = 0): boolean {
  return a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad;
}
