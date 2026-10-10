/**
 * CT Work đợt 6 — R21/R22: BASELINE bộ yêu cầu/tài liệu (hàm thuần).
 *
 * Một baseline = danh sách mục {kind, refId, ref, title, version, hash}; hash từng mục tính trên nội dung có nghĩa
 * (không tính updatedAt/thứ tự), hash baseline = sha256 của các hash mục đã sắp xếp ⇒ hai lần chụp cùng nội dung ra cùng
 * hash (người ký biết chính xác mình ký cái gì). So sánh baseline ↔ baseline hoặc baseline ↔ hiện tại theo (kind, refId).
 */
import crypto from 'node:crypto';

export const BASELINE_KINDS = ['REQ', 'UC', 'BR', 'DOC'] as const;
export type BaselineKind = (typeof BASELINE_KINDS)[number];
export const BASELINE_STATUSES = ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'SUPERSEDED'] as const;

export interface BaselineItem { kind: BaselineKind; refId: number; ref: string; title: string; version: string | null; hash: string }

/** JSON ổn định (khoá sắp xếp) — để hash không phụ thuộc thứ tự khoá. */
export function stableJson(v: unknown): string {
  if (v === null || typeof v !== 'object') return JSON.stringify(v ?? null);
  if (Array.isArray(v)) return `[${v.map(stableJson).join(',')}]`;
  return `{${Object.keys(v as object).sort().map((k) => `${JSON.stringify(k)}:${stableJson((v as Record<string, unknown>)[k])}`).join(',')}}`;
}
export const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex');
export const itemHash = (content: unknown) => sha256(stableJson(content)).slice(0, 32);

export function baselineHash(items: BaselineItem[]): string {
  return sha256(items.map((i) => `${i.kind}:${i.refId}:${i.hash}`).sort().join('\n'));
}

export interface BaselineDiffRow { kind: BaselineKind; refId: number; ref: string; title: string; change: 'ADDED' | 'REMOVED' | 'CHANGED'; fromVersion: string | null; toVersion: string | null; fromTitle?: string }

export function diffBaselines(from: BaselineItem[], to: BaselineItem[]) {
  const k = (i: BaselineItem) => `${i.kind}:${i.refId}`;
  const a = new Map(from.map((i) => [k(i), i]));
  const b = new Map(to.map((i) => [k(i), i]));
  const rows: BaselineDiffRow[] = [];
  for (const [key, x] of b) {
    const y = a.get(key);
    if (!y) rows.push({ kind: x.kind, refId: x.refId, ref: x.ref, title: x.title, change: 'ADDED', fromVersion: null, toVersion: x.version });
    else if (y.hash !== x.hash) rows.push({ kind: x.kind, refId: x.refId, ref: x.ref, title: x.title, change: 'CHANGED', fromVersion: y.version, toVersion: x.version, ...(y.title !== x.title ? { fromTitle: y.title } : {}) });
  }
  for (const [key, y] of a) if (!b.has(key)) rows.push({ kind: y.kind, refId: y.refId, ref: y.ref, title: y.title, change: 'REMOVED', fromVersion: y.version, toVersion: null });
  const order = { REQ: 0, UC: 1, BR: 2, DOC: 3 } as const;
  rows.sort((p, q) => order[p.kind] - order[q.kind] || p.refId - q.refId);
  const unchanged = to.filter((i) => a.get(k(i))?.hash === i.hash).length;
  // Volatility (Wiegers Ch27): (thêm + bỏ + đổi) / số mục baseline gốc.
  const volatility = from.length ? Math.round((rows.length / from.length) * 1000) / 10 : null;
  return {
    rows, unchanged,
    counts: { added: rows.filter((r) => r.change === 'ADDED').length, removed: rows.filter((r) => r.change === 'REMOVED').length, changed: rows.filter((r) => r.change === 'CHANGED').length },
    volatility,
  };
}

/** Kết quả chữ ký: mọi người ký APPROVED ⇒ APPROVED; một người REJECTED ⇒ REJECTED; còn lại PENDING. */
export function signoffOutcome(decisions: string[]): 'PENDING' | 'APPROVED' | 'REJECTED' {
  if (decisions.some((d) => d === 'REJECTED')) return 'REJECTED';
  if (decisions.length && decisions.every((d) => d === 'APPROVED')) return 'APPROVED';
  return 'PENDING';
}

/** Trạng thái CR cho phép sửa mục đã baseline (đã duyệt, chưa đóng). */
export const CR_EDIT_ALLOWED = new Set(['APPROVED']);
