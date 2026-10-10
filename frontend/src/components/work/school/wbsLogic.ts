/**
 * WBS (UX-C, 11/10/2026) — LÕI THUẦN cho giao diện cây: dòng đang hiện khi gập nhánh, khoảng ngày theo nhánh (Gantt
 * nhỏ), và kiểm một lần thả kéo-thả TRƯỚC khi gọi máy chủ (máy chủ vẫn kiểm lại — uxcRules.planWbsMove).
 * Test: frontend/src/components/work/table/tableLogic.test.ts.
 */

export interface TreeRow {
  issueId: number; number: number; depth: number; childCount: number;
  parentNumber?: number | null; level?: number;
  start?: string | null; due?: string | null;
}

/** Dòng đang hiện: bỏ con cháu của nhánh đang gập (dòng theo thứ tự cây, `depth` tăng 1 mỗi tầng). */
export function visibleTree<R extends TreeRow>(rows: readonly R[], collapsed: ReadonlySet<number>): R[] {
  const out: R[] = [];
  let hideBelow: number | null = null;
  for (const r of rows) {
    if (hideBelow !== null) {
      if (r.depth > hideBelow) continue;
      hideBelow = null;
    }
    out.push(r);
    if (r.childCount > 0 && collapsed.has(r.issueId)) hideBelow = r.depth;
  }
  return out;
}

/** Khoảng ngày của cả nhánh (gồm chính nó): min(start) … max(due); thẻ chỉ có một mốc thì dùng mốc đó cho cả hai đầu. */
export function branchSpans<R extends TreeRow>(rows: readonly R[]): Map<number, { start: string; end: string; own: boolean }> {
  const out = new Map<number, { start: string; end: string; own: boolean }>();
  const stack: Array<{ id: number; depth: number; start: string | null; end: string | null; own: boolean }> = [];
  const close = (toDepth: number) => {
    while (stack.length && stack[stack.length - 1].depth >= toDepth) {
      const d = stack.pop()!;
      if (d.start && d.end) out.set(d.id, { start: d.start, end: d.end, own: d.own });
      const p = stack[stack.length - 1];
      if (p && d.start && d.end) {
        if (!p.start || d.start < p.start) p.start = d.start;
        if (!p.end || d.end > p.end) p.end = d.end;
      }
    }
  };
  for (const r of rows) {
    close(r.depth);
    const s = r.start ?? r.due ?? null;
    const e = r.due ?? r.start ?? null;
    stack.push({ id: r.issueId, depth: r.depth, start: s, end: e && s && e < s ? s : e, own: !!(s || e) });
  }
  close(-1);
  return out;
}

export type DropPos = 'before' | 'after' | 'into';

function isDescendant<R extends TreeRow>(rows: readonly R[], ancestor: R, maybe: R): boolean {
  const byNum = new Map(rows.map((r) => [r.number, r]));
  for (let c: R | undefined = maybe; c; c = c.parentNumber != null ? byNum.get(c.parentNumber) : undefined) {
    if (c.number === ancestor.number) return true;
  }
  return false;
}

/**
 * Thả `drag` vào `target` ở vị trí `pos` có hợp lệ không, và gửi gì lên máy chủ.
 *   into   — `target` thành cha (cần target.level = drag.level + 1);
 *   before/after — cùng cha với `target` (cha null ⇒ gốc: sub-task không được đứng gốc).
 * Không thả vào chính mình / con cháu của mình. Thiếu `level` (máy chủ cũ) ⇒ không cho kéo.
 */
export function planDrop<R extends TreeRow>(rows: readonly R[], drag: R, target: R, pos: DropPos):
  { parentNumber: number | null; beforeNumber?: number; afterNumber?: number } | null {
  if (drag.level === undefined || target.level === undefined) return null;
  if (drag.number === target.number || isDescendant(rows, drag, target)) return null;
  if (pos === 'into') {
    if (target.level !== drag.level + 1) return null;
    const kids = rows.filter((r) => (r.parentNumber ?? null) === target.number && r.number !== drag.number);
    const last = kids[kids.length - 1];
    return last ? { parentNumber: target.number, afterNumber: last.number } : { parentNumber: target.number };
  }
  const parentNumber = target.parentNumber ?? null;
  if (parentNumber === null) {
    if (drag.level === -1) return null;
  } else {
    const parent = rows.find((r) => r.number === parentNumber);
    if (!parent || parent.level === undefined || parent.level !== drag.level + 1) return null;
  }
  return pos === 'before' ? { parentNumber, beforeNumber: target.number } : { parentNumber, afterNumber: target.number };
}

/** Anh em (cùng cha) của một dòng theo thứ tự đang hiện. */
export function siblingsOf<R extends TreeRow>(rows: readonly R[], r: R): R[] {
  return rows.filter((x) => (x.parentNumber ?? null) === (r.parentNumber ?? null));
}
