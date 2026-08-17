/**
 * Lọc / sắp xếp / phân trang cho database — bản chạy ở MÁY CHỦ.
 *
 * ⚠️⚠️ Tệp này PHẢI khớp từng luật với `frontend/src/lib/noteDatabaseQuery.ts`.
 * Hai bên lệch nhau thì cùng một khung nhìn cho ra hai tập dòng khác nhau tuỳ
 * đường đi, và người dùng thấy kết quả SAI MÀ TRÔNG HỢP LÝ — không có lỗi nào
 * để lần ra. Sửa luật ở đây thì sửa luôn bên kia, và ngược lại.
 *
 * Vì sao KHÔNG dịch sang SQL, dù đó mới là thứ nhanh nhất:
 *   · `fold()` khớp BỎ DẤU tiếng Việt — Postgres cần extension `unaccent`,
 *     hiện chưa cài, và cài rồi vẫn khác ở chữ `đ`.
 *   · Số kiểu Việt (`1.750,5`) nằm trong JSONB; ép kiểu trong SQL cho kết quả
 *     khác hàm phân tích của ta ở đúng những ca lắt léo.
 *   · Cột PERSON/RELATION lọc theo TÊN HIỂN THỊ, mà tên nằm ở bảng khác.
 *   · Cột ROLLUP/FORMULA không tồn tại trong bảng nào — máy chủ tính lúc đọc,
 *     nên KHÔNG có cột nào để `WHERE` lên cả.
 * Chuyển nguyên thuật toán xuống máy chủ giữ được ngữ nghĩa y hệt; dịch sang
 * SQL thì không.
 *
 * Cái được: trình duyệt không còn phải ôm cả bảng, và số tổng là số THẬT chứ
 * không phải "5.000" của một lượt cắt âm thầm.
 */

export type FilterOperator =
  | 'contains' | 'notContains' | 'is' | 'isNot' | 'startsWith'
  | 'gt' | 'gte' | 'lt' | 'lte'
  | 'before' | 'after' | 'onOrBefore' | 'onOrAfter'
  | 'isEmpty' | 'isNotEmpty';

export interface ViewFilter {
  propertyId: number;
  operator: FilterOperator;
  value: string;
}

export interface ViewSort {
  propertyId: number;
  direction: 'asc' | 'desc';
}

export interface QueryProperty {
  id: number;
  name: string;
  type: string;
}

export interface QueryRow {
  id: number;
  sortOrder: number;
  values: Record<string, unknown>;
}

/** Tra cứu cho những kiểu không tự giải nghĩa được (xem tệp frontend). */
export interface QueryContext {
  /** id người dùng → tên hiển thị, cho cột PERSON. */
  personNames?: Map<number, string>;
  /** id dòng bên bảng đích → nhãn, cho cột RELATION. */
  relationLabels?: Record<string, string>;
}

export interface DatabaseQuery {
  filters: ViewFilter[];
  filterJoin: 'and' | 'or';
  sorts: ViewSort[];
  search: string;
  page: number;
  pageSize: number;
}

export const DEFAULT_PAGE_SIZE = 100;
export const MAX_PAGE_SIZE = 500;

// ─── Nguyên thuỷ, sao y bản frontend ──────────────────────────

function isBlank(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/** Bỏ dấu + hạ chữ thường, để "Đường" khớp "duong". */
export function fold(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

function timeOf(value: unknown): number {
  const t = new Date(String(value)).getTime();
  return Number.isNaN(t) ? Number.NaN : t;
}

function fileNames(value: unknown): string {
  if (!Array.isArray(value)) return '';
  return value
    .map((f) => (f && typeof f === 'object' ? String((f as { name?: unknown; url?: unknown }).name ?? (f as { url?: unknown }).url ?? '') : ''))
    .filter(Boolean)
    .join(' ');
}

function personText(value: unknown, ctx: QueryContext): string {
  if (!Array.isArray(value)) return '';
  return value
    .map((raw) => {
      const id = Number(raw);
      if (!Number.isInteger(id) || id <= 0) return '';
      // Người đã rời danh sách chia sẻ vẫn còn id trong ô — dùng "#id" y như
      // giao diện, để lọc theo cái người dùng NHÌN THẤY.
      return ctx.personNames?.get(id) ?? `#${id}`;
    })
    .filter(Boolean)
    .join(' ');
}

function relationText(value: unknown, ctx: QueryContext): string {
  if (!Array.isArray(value)) return '';
  return value
    .map((raw) => {
      const id = Number(raw);
      if (!Number.isInteger(id) || id <= 0) return '';
      return ctx.relationLabels?.[String(id)] ?? `#${id}`;
    })
    .filter(Boolean)
    .join(' ');
}

function comparableText(property: QueryProperty, value: unknown, ctx: QueryContext): string {
  if (property.type === 'PERSON') return fold(personText(value, ctx));
  if (property.type === 'RELATION') return fold(relationText(value, ctx));
  if (property.type === 'MULTI_SELECT') return fold(Array.isArray(value) ? value.join(' ') : String(value ?? ''));
  if (property.type === 'FILE') return fold(fileNames(value));
  return fold(String(value ?? ''));
}

/** Số người Việt gõ: `1.750,5` → 1750.5. Khớp bản frontend từng ký tự. */
function parseNeedleNumber(needle: string): number {
  return Number(needle.replace(/[.\s]/g, '').replace(',', '.'));
}

// ─── Lọc ──────────────────────────────────────────────────────

export function matchesFilter(
  property: QueryProperty,
  value: unknown,
  filter: ViewFilter,
  ctx: QueryContext = {},
): boolean {
  const blank = isBlank(value);
  if (filter.operator === 'isEmpty') return blank;
  if (filter.operator === 'isNotEmpty') return !blank;

  const needle = (filter.value ?? '').trim();
  // Điều kiện chưa điền giá trị KHÔNG lọc gì cả. Coi là "không khớp" sẽ làm
  // bảng trống trơn ngay khoảnh khắc người dùng bấm "Thêm điều kiện" và chưa
  // kịp gõ — trông y hệt như dữ liệu vừa biến mất.
  if (needle === '') return true;

  if (property.type === 'CHECKBOX') {
    const want = ['true', '1', 'yes', 'có'].includes(needle.toLowerCase());
    return Boolean(value) === want;
  }

  if (property.type === 'NUMBER') {
    const a = Number(value);
    const b = parseNeedleNumber(needle);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
    switch (filter.operator) {
      case 'is': return a === b;
      case 'isNot': return a !== b;
      case 'gt': return a > b;
      case 'gte': return a >= b;
      case 'lt': return a < b;
      case 'lte': return a <= b;
      default: return false;
    }
  }

  if (property.type === 'DATE' || property.type === 'CREATED_TIME' || property.type === 'LAST_EDITED_TIME') {
    const a = timeOf(value);
    const b = timeOf(needle);
    if (Number.isNaN(a) || Number.isNaN(b)) return false;
    // So theo NGÀY chứ không theo mili giây: người dùng chọn "17/08" là có ý
    // nói cả ngày hôm đó, còn ô lại lưu "17/08 lúc 14:32".
    const dayA = Math.floor(a / 86400000);
    const dayB = Math.floor(b / 86400000);
    switch (filter.operator) {
      case 'is': return dayA === dayB;
      case 'before': return dayA < dayB;
      case 'after': return dayA > dayB;
      case 'onOrBefore': return dayA <= dayB;
      case 'onOrAfter': return dayA >= dayB;
      default: return false;
    }
  }

  const haystack = comparableText(property, value, ctx);
  const target = fold(needle);
  switch (filter.operator) {
    case 'contains': return haystack.includes(target);
    case 'notContains': return !haystack.includes(target);
    case 'is': return haystack === target;
    case 'isNot': return haystack !== target;
    case 'startsWith': return haystack.startsWith(target);
    default: return true;
  }
}

export function applyFilters(
  rows: QueryRow[],
  properties: QueryProperty[],
  filters: ViewFilter[],
  filterJoin: 'and' | 'or',
  ctx: QueryContext = {},
): QueryRow[] {
  const byId = new Map(properties.map((p) => [p.id, p]));
  const active = filters.filter((f) => byId.has(f.propertyId));
  if (active.length === 0) return rows;
  return rows.filter((row) => {
    const results = active.map((filter) => matchesFilter(
      byId.get(filter.propertyId)!,
      row.values[String(filter.propertyId)] ?? null,
      filter,
      ctx,
    ));
    return filterJoin === 'or' ? results.some(Boolean) : results.every(Boolean);
  });
}

/** Tìm nhanh: khớp bỏ dấu trên MỌI cột. */
export function applySearch(
  rows: QueryRow[],
  properties: QueryProperty[],
  search: string,
  ctx: QueryContext = {},
): QueryRow[] {
  const target = fold(search.trim());
  if (!target) return rows;
  return rows.filter((row) => properties.some((property) => (
    comparableText(property, row.values[String(property.id)] ?? null, ctx).includes(target)
  )));
}

// ─── Sắp xếp ──────────────────────────────────────────────────

function sortKey(property: QueryProperty, value: unknown, ctx: QueryContext): number | string {
  if (isBlank(value)) {
    // Ô trống xuống CUỐI khi tăng dần. Trả chuỗi rỗng sẽ đẩy chúng lên đầu và
    // người dùng sắp theo "Hạn" lại thấy toàn dòng chưa đặt hạn ở trên cùng.
    return Number.POSITIVE_INFINITY;
  }
  if (property.type === 'NUMBER' || property.type === 'ROLLUP') {
    const n = Number(value);
    return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
  }
  if (property.type === 'CHECKBOX') return value ? 1 : 0;
  if (property.type === 'DATE' || property.type === 'CREATED_TIME' || property.type === 'LAST_EDITED_TIME') {
    const t = timeOf(value);
    return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t;
  }
  if (property.type === 'FORMULA' && typeof value === 'number') return value;
  return comparableText(property, value, ctx);
}

export function applySorts(
  rows: QueryRow[],
  properties: QueryProperty[],
  sorts: ViewSort[],
  ctx: QueryContext = {},
): QueryRow[] {
  const byId = new Map(properties.map((p) => [p.id, p]));
  const active = sorts.filter((s) => byId.has(s.propertyId));
  if (active.length === 0) return rows;
  return [...rows].sort((rowA, rowB) => {
    for (const sort of active) {
      const property = byId.get(sort.propertyId)!;
      const a = sortKey(property, rowA.values[String(property.id)] ?? null, ctx);
      const b = sortKey(property, rowB.values[String(property.id)] ?? null, ctx);
      let cmp = 0;
      if (typeof a === 'number' && typeof b === 'number') {
        // Vô cực trừ vô cực ra NaN, và `sort` với NaN cho thứ tự ngẫu nhiên.
        cmp = a === b ? 0 : a - b;
      } else {
        cmp = String(a).localeCompare(String(b), 'vi');
      }
      if (cmp !== 0) return sort.direction === 'desc' ? -cmp : cmp;
    }
    // Hoà thì giữ thứ tự người dùng đã kéo tay.
    return rowA.sortOrder - rowB.sortOrder;
  });
}

// ─── Đọc tham số truy vấn ─────────────────────────────────────

/**
 * Đọc truy vấn từ query string. Cắt bỏ phần không hiểu thay vì ném lỗi, cùng
 * lý do với `sanitizeViewConfig`: đây là trạng thái giao diện, và một bộ lọc
 * bị bỏ đi thì bảng hiện nhiều dòng hơn dự kiến — thấy ngay và sửa được.
 */
export function parseDatabaseQuery(raw: unknown): DatabaseQuery {
  const q = (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw as Record<string, unknown> : {};

  let parsed: unknown = null;
  if (typeof q.view === 'string' && q.view.trim()) {
    // Gửi cấu hình khung nhìn dưới dạng JSON trong một tham số: bộ lọc là cây
    // lồng nhau, nhồi vào query string phẳng sẽ thành thứ không ai đọc nổi.
    try { parsed = JSON.parse(q.view); } catch { parsed = null; }
  }
  const view = (parsed && typeof parsed === 'object' && !Array.isArray(parsed))
    ? parsed as Record<string, unknown>
    : {};

  const id = (v: unknown): number | null => {
    const n = Number(v);
    return Number.isInteger(n) && n > 0 ? n : null;
  };

  const filters: ViewFilter[] = Array.isArray(view.filters)
    ? view.filters.flatMap((f) => {
      if (!f || typeof f !== 'object') return [];
      const o = f as Record<string, unknown>;
      const propertyId = id(o.propertyId);
      if (propertyId === null || typeof o.operator !== 'string') return [];
      return [{
        propertyId,
        operator: o.operator as FilterOperator,
        value: typeof o.value === 'string' ? o.value.slice(0, 200) : '',
      }];
    }).slice(0, 20)
    : [];

  const sorts: ViewSort[] = Array.isArray(view.sorts)
    ? view.sorts.flatMap((s) => {
      if (!s || typeof s !== 'object') return [];
      const o = s as Record<string, unknown>;
      const propertyId = id(o.propertyId);
      if (propertyId === null) return [];
      return [{ propertyId, direction: o.direction === 'desc' ? 'desc' as const : 'asc' as const }];
    }).slice(0, 10)
    : [];

  const page = Math.max(1, Math.floor(Number(q.page)) || 1);
  const rawSize = Math.floor(Number(q.pageSize)) || DEFAULT_PAGE_SIZE;
  const pageSize = Math.max(1, Math.min(MAX_PAGE_SIZE, rawSize));

  return {
    filters,
    filterJoin: view.filterJoin === 'or' ? 'or' : 'and',
    sorts,
    search: typeof view.search === 'string' ? view.search.slice(0, 200) : '',
    page,
    pageSize,
  };
}

/** Có yêu cầu lọc/sắp xếp/tìm gì không — dùng để bỏ qua việc thừa. */
export function queryIsEmpty(query: DatabaseQuery): boolean {
  return query.filters.length === 0 && query.sorts.length === 0 && query.search.trim() === '';
}
