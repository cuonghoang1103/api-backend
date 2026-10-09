/**
 * Màu biểu đồ theo NGHĨA (UX-B) — một chỗ, chỉ token `--w-*` (đổi theme sáng/tối tự theo).
 *
 *   · Trạng thái: TODO xám · IN_PROGRESS xanh dương · DONE xanh lá — TRÙNG màu glyph/badge trạng thái (CATEGORY_DOT).
 *     Nhiều trạng thái cùng nhóm (In progress, In review…) ⇒ cùng sắc, đậm nhạt khác nhau.
 *   · Đỏ CHỈ cho điều xấu (quá hạn, bị chặn, vượt tải). "Created" là màu trung tính (--w-chart-1), không đỏ.
 */

export const CATEGORY_COLOR = {
  TODO: 'var(--w-status-todo)',
  IN_PROGRESS: 'var(--w-status-progress)',
  DONE: 'var(--w-status-done)',
} as const;

export const SERIES = {
  created: 'var(--w-chart-1)',
  resolved: 'var(--w-status-done)',
  done: 'var(--w-status-done)',
  remaining: 'var(--w-chart-1)',
  scope: 'var(--w-text-2)',
  guideline: 'var(--w-text-3)',
  committed: 'var(--w-text-3)',
  completed: 'var(--w-chart-1)',
  average: 'var(--w-chart-3)',
  todo: 'var(--w-status-todo)',
  inProgress: 'var(--w-status-progress)',
  overdue: 'var(--w-red)',
  blocked: 'var(--w-orange)',
  capacity: 'var(--w-text-3)',
  labor: 'var(--w-chart-1)',
  other: 'var(--w-chart-3)',
  p50: 'var(--w-status-done)',
  p85: 'var(--w-orange)',
  p95: 'var(--w-red)',
} as const;

/**
 * Màu cho dải trạng thái (CFD, aging): theo nhóm, đậm nhạt theo thứ tự trong nhóm. Dùng color-mix với nền panel để
 * dải sau nhạt hơn mà vẫn cùng sắc ⇒ người xem đọc được "xanh dương = đang làm" bất kể có bao nhiêu trạng thái.
 */
export function bandColors(bands: Array<{ key: string; category: string }>): Record<string, string> {
  const seen: Record<string, number> = {};
  const count: Record<string, number> = {};
  for (const b of bands) count[b.category] = (count[b.category] ?? 0) + 1;
  const out: Record<string, string> = {};
  for (const b of bands) {
    const i = seen[b.category] ?? 0;
    seen[b.category] = i + 1;
    const base = CATEGORY_COLOR[b.category as keyof typeof CATEGORY_COLOR] ?? 'var(--w-chart-8)';
    const n = count[b.category] ?? 1;
    // 100% → 55%: đủ khác nhau, vẫn đủ đậm để đạt 3:1 với nền (đồ hoạ).
    const pct = n <= 1 ? 100 : Math.round(100 - (i * 45) / (n - 1));
    out[b.key] = pct === 100 ? base : `color-mix(in srgb, ${base} ${pct}%, var(--w-panel))`;
  }
  return out;
}

export const AXIS_TICK = { fill: 'var(--w-text-3)', fontSize: 11 };
export const GRID = 'var(--w-chart-grid)';
