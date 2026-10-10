/**
 * DataTable (UX-C, 11/10/2026) — LÕI THUẦN (không React, không DOM) để test bằng `tsx --test` từ gốc repo:
 * so sánh/sắp xếp, lọc nhanh, cửa sổ cuộn ảo, phân trang, hợp nhất lựa chọn cột đã lưu, chọn dải bằng Shift.
 */

export type SortDir = 'asc' | 'desc';
export interface SortState { col: string; dir: SortDir }
export type CellValue = string | number | boolean | Date | null | undefined;

/** null/'' luôn xếp CUỐI (cả khi đảo chiều) — như Jira/Excel. Số so số, chữ so tự nhiên theo locale ("Iter2" < "Iter10"). */
export function compareValues(a: CellValue, b: CellValue, collator?: Intl.Collator): number {
  const empty = (v: CellValue) => v === null || v === undefined || v === '' || (typeof v === 'number' && Number.isNaN(v));
  if (empty(a)) return empty(b) ? 0 : 1;
  if (empty(b)) return -1;
  const x = a instanceof Date ? a.getTime() : typeof a === 'boolean' ? Number(a) : a;
  const y = b instanceof Date ? b.getTime() : typeof b === 'boolean' ? Number(b) : b;
  if (typeof x === 'number' && typeof y === 'number') return x - y;
  const c = collator ?? new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  return c.compare(String(x), String(y));
}

/** Sắp ổn định; ô trống cuối bất kể chiều. `value` trả giá trị so sánh của một cột. */
export function sortRows<T>(rows: readonly T[], sort: SortState | null, value: (row: T, col: string) => CellValue): T[] {
  if (!sort) return rows.slice();
  const c = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  const sign = sort.dir === 'desc' ? -1 : 1;
  return rows
    .map((r, i) => ({ r, i, v: value(r, sort.col) }))
    .sort((p, q) => {
      const pe = p.v === null || p.v === undefined || p.v === '';
      const qe = q.v === null || q.v === undefined || q.v === '';
      if (pe !== qe) return pe ? 1 : -1;
      return sign * compareValues(p.v, q.v, c) || p.i - q.i;
    })
    .map((x) => x.r);
}

/** Bỏ dấu tiếng Việt + thường hoá — "Nguyễn" khớp "nguyen". */
export function fold(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

/** Lọc nhanh: mọi từ (tách bằng khoảng trắng) phải xuất hiện ở ÍT NHẤT một cột (không dấu, không phân biệt hoa thường). */
export function filterRows<T>(rows: readonly T[], query: string, text: (row: T) => string[]): T[] {
  const words = fold(query.trim()).split(/\s+/).filter(Boolean);
  if (!words.length) return rows.slice();
  return rows.filter((r) => {
    const hay = fold(text(r).filter(Boolean).join(' \u0001 '));
    return words.every((w) => hay.includes(w));
  });
}

/** Cửa sổ hàng cần vẽ khi cuộn ảo: [start, end) + phần đệm trên/dưới (px). */
export function virtualWindow(opts: { scrollTop: number; viewport: number; rowHeight: number; count: number; overscan?: number }): { start: number; end: number; padTop: number; padBottom: number } {
  const { scrollTop, viewport, rowHeight, count } = opts;
  const over = opts.overscan ?? 8;
  if (count <= 0 || rowHeight <= 0) return { start: 0, end: 0, padTop: 0, padBottom: 0 };
  const first = Math.floor(Math.max(0, scrollTop) / rowHeight);
  const visible = Math.ceil(Math.max(viewport, rowHeight) / rowHeight) + 1;
  const start = Math.max(0, Math.min(count - 1, first - over));
  const end = Math.min(count, first + visible + over);
  return { start, end, padTop: start * rowHeight, padBottom: (count - end) * rowHeight };
}

export function pageCount(total: number, size: number): number {
  return Math.max(1, Math.ceil(total / Math.max(1, size)));
}
export function pageSlice<T>(rows: readonly T[], page: number, size: number): T[] {
  const p = Math.min(Math.max(0, page), pageCount(rows.length, size) - 1);
  return rows.slice(p * size, p * size + size);
}

// ─── Lựa chọn cột đã lưu ─────────────────────────────────────────

export interface TablePrefs {
  /** Cột bị ẩn (id). */
  hidden: string[];
  /** Cột được người dùng HIỆN dù mặc định ẩn. */
  shown: string[];
  widths: Record<string, number>;
  density: 'compact' | 'normal';
  sort: SortState | null;
  pageSize?: number;
}
export const DEFAULT_PREFS: TablePrefs = { hidden: [], shown: [], widths: {}, density: 'normal', sort: null };

/** Đọc bản lưu (có thể hỏng / từ phiên bản cũ) ⇒ luôn trả TablePrefs hợp lệ, bỏ id cột không còn tồn tại. */
export function normalizePrefs(raw: unknown, columnIds: readonly string[]): TablePrefs {
  const ids = new Set(columnIds);
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<TablePrefs>;
  const list = (x: unknown) => (Array.isArray(x) ? x.filter((s): s is string => typeof s === 'string' && ids.has(s)) : []);
  const widths: Record<string, number> = {};
  if (v.widths && typeof v.widths === 'object') {
    for (const [k, w] of Object.entries(v.widths)) if (ids.has(k) && typeof w === 'number' && w >= 40 && w <= 1200) widths[k] = Math.round(w);
  }
  const sort = v.sort && typeof v.sort === 'object' && ids.has((v.sort as SortState).col) && ((v.sort as SortState).dir === 'asc' || (v.sort as SortState).dir === 'desc') ? (v.sort as SortState) : null;
  return {
    hidden: list(v.hidden), shown: list(v.shown), widths,
    density: v.density === 'compact' ? 'compact' : 'normal',
    sort,
    ...(typeof v.pageSize === 'number' && [25, 50, 100, 200].includes(v.pageSize) ? { pageSize: v.pageSize } : {}),
  };
}

/** Cột đang hiện: mặc định trừ `hidden`, cộng `shown` (cột mặc định ẩn mà người dùng bật). Cột `required` luôn hiện. */
export function visibleColumnIds(cols: ReadonlyArray<{ id: string; defaultHidden?: boolean; required?: boolean }>, prefs: Pick<TablePrefs, 'hidden' | 'shown'>): string[] {
  return cols.filter((c) => c.required || (c.defaultHidden ? prefs.shown.includes(c.id) : !prefs.hidden.includes(c.id))).map((c) => c.id);
}

/** Bật/tắt một cột ⇒ prefs mới (ghi vào `hidden` hoặc `shown` tuỳ mặc định của cột). */
export function toggleColumn(prefs: TablePrefs, col: { id: string; defaultHidden?: boolean; required?: boolean }): TablePrefs {
  if (col.required) return prefs;
  if (col.defaultHidden) {
    const on = prefs.shown.includes(col.id);
    return { ...prefs, shown: on ? prefs.shown.filter((x) => x !== col.id) : [...prefs.shown, col.id] };
  }
  const off = prefs.hidden.includes(col.id);
  return { ...prefs, hidden: off ? prefs.hidden.filter((x) => x !== col.id) : [...prefs.hidden, col.id] };
}

/** Shift+bấm: chọn cả dải từ `anchor` tới `target` theo thứ tự đang hiện. */
export function rangeKeys<K>(order: readonly K[], anchor: K, target: K): K[] {
  const a = order.indexOf(anchor);
  const b = order.indexOf(target);
  if (a < 0 || b < 0) return [target];
  return order.slice(Math.min(a, b), Math.max(a, b) + 1);
}

/** Độ rộng mới khi kéo mép cột: kẹp [min, 1200]. */
export function clampWidth(w: number, min = 60): number {
  return Math.round(Math.min(1200, Math.max(min, w)));
}

/** Giá trị ô ⇒ chữ cho CSV/XLSX/lọc. Ngày ⇒ YYYY-MM-DD. */
export function cellText(v: CellValue): string {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? '' : v.toISOString().slice(0, 10);
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  return String(v);
}
