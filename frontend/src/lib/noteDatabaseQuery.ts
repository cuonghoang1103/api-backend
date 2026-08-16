/**
 * Lọc · sắp xếp · nhóm cho database của Notes.
 *
 * ─── Vì sao chạy ở TRÌNH DUYỆT chứ không ở máy chủ ───
 * Ô được lưu theo kiểu mỗi (dòng, cột) một bản ghi với giá trị JSONB. Lọc và
 * sắp xếp thứ đó bằng SQL đòi hỏi một phép nối cho MỖI điều kiện, cộng với
 * ép kiểu bằng tay ở từng phép so sánh — và cột `value` không có chỉ mục theo
 * kiểu, nên vẫn quét toàn bảng.
 *
 * Trong khi đó `getDatabase` VỐN ĐÃ trả về mọi dòng (trần 5.000). Lọc ở đây
 * không thêm một byte nào lên đường truyền, không thêm một truy vấn nào, và
 * đổi lại bộ lọc phản hồi tức thì thay vì một vòng gọi mạng cho mỗi lần gõ.
 *
 * ⚠️ Trần 5.000 dòng là của `getDatabase`, không phải của tệp này. Nếu sau
 * này bảng vượt qua ngưỡng đó thì phải chuyển cả phân trang LẪN bộ lọc xuống
 * máy chủ cùng lúc — lọc ở client trên một trang dữ liệu đã bị cắt sẽ cho ra
 * kết quả SAI mà trông vẫn hợp lý.
 *
 * Mọi hàm ở đây THUẦN: cùng đầu vào cho cùng đầu ra, không đụng mạng, không
 * đụng DOM. Nhờ vậy kiểm được bằng cách gọi thẳng.
 */

import type { NoteDatabaseProperty, NoteDatabaseRow } from '@/lib/api';
import { asFiles, asPersonIds, displayValue, type CellContext } from '@/lib/noteDatabaseValues';

export type FilterOperator =
  | 'contains' | 'notContains' | 'is' | 'isNot' | 'startsWith'
  | 'gt' | 'gte' | 'lt' | 'lte'
  | 'before' | 'after' | 'onOrBefore' | 'onOrAfter'
  | 'isEmpty' | 'isNotEmpty';

export interface ViewFilter {
  propertyId: number;
  operator: FilterOperator;
  /** Không dùng với `isEmpty` / `isNotEmpty`. */
  value?: string;
}

export interface ViewSort {
  propertyId: number;
  direction: 'asc' | 'desc';
}

export interface ViewConfig {
  filters: ViewFilter[];
  /** `and` = mọi điều kiện phải đúng; `or` = chỉ cần một. */
  filterJoin: 'and' | 'or';
  sorts: ViewSort[];
  groupPropertyId: number | null;
  hiddenPropertyIds: number[];
  /** Tìm nhanh trong mọi cột, độc lập với bộ lọc. */
  search: string;
  /**
   * Cột ngày mà khung nhìn Dòng thời gian dùng để vẽ thanh.
   *
   * Nằm trong cùng một `config` với bộ lọc chứ không tách ra chỗ khác: cả hai
   * đều là "khung nhìn này đang được cấu hình thế nào", và tách ra sẽ thành
   * hai đường lưu cho một thứ.
   *
   * ⚠️ Khoá này phải được liệt kê trong `sanitizeViewConfig()` ở backend, nếu
   * không nó bị vứt âm thầm lúc ghi.
   */
  timeline: { startPropertyId: number | null; endPropertyId: number | null } | null;
}

export const EMPTY_VIEW_CONFIG: ViewConfig = {
  filters: [], filterJoin: 'and', sorts: [], groupPropertyId: null, hiddenPropertyIds: [], search: '',
  timeline: null,
};

/**
 * Đọc cấu hình từ JSON tự do của `NoteDatabaseView.config`.
 *
 * Chấp nhận thiếu và bỏ qua rác thay vì ném lỗi: config là JSON tự do đã lưu
 * trong cơ sở dữ liệu, có thể do một phiên bản cũ hơn ghi ra. Một khung nhìn
 * có cấu hình lạ phải hiện ra như khung nhìn KHÔNG lọc, chứ không được làm vỡ
 * cả bảng — người dùng còn sửa được cái sai, chứ không sửa được màn hình trắng.
 */
export function parseViewConfig(raw: unknown): ViewConfig {
  const c = (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw as Record<string, unknown> : {};
  const num = (v: unknown): number | null => {
    const n = Number(v);
    return Number.isInteger(n) && n > 0 ? n : null;
  };
  return {
    filters: Array.isArray(c.filters)
      ? c.filters.flatMap((f) => {
          if (!f || typeof f !== 'object') return [];
          const o = f as Record<string, unknown>;
          const propertyId = num(o.propertyId);
          if (propertyId === null || typeof o.operator !== 'string') return [];
          return [{
            propertyId,
            operator: o.operator as FilterOperator,
            value: typeof o.value === 'string' ? o.value : undefined,
          }];
        })
      : [],
    filterJoin: c.filterJoin === 'or' ? 'or' : 'and',
    sorts: Array.isArray(c.sorts)
      ? c.sorts.flatMap((s) => {
          if (!s || typeof s !== 'object') return [];
          const o = s as Record<string, unknown>;
          const propertyId = num(o.propertyId);
          if (propertyId === null) return [];
          return [{ propertyId, direction: o.direction === 'desc' ? 'desc' as const : 'asc' as const }];
        })
      : [],
    groupPropertyId: num(c.groupPropertyId),
    hiddenPropertyIds: Array.isArray(c.hiddenPropertyIds)
      ? c.hiddenPropertyIds.map(num).filter((n): n is number => n !== null)
      : [],
    search: typeof c.search === 'string' ? c.search : '',
    timeline: (c.timeline && typeof c.timeline === 'object' && !Array.isArray(c.timeline))
      ? {
          startPropertyId: num((c.timeline as Record<string, unknown>).startPropertyId),
          endPropertyId: num((c.timeline as Record<string, unknown>).endPropertyId),
        }
      : null,
  };
}

/** Toán tử hợp lệ cho từng kiểu cột — dùng để dựng danh sách chọn. */
export function operatorsFor(type: NoteDatabaseProperty['type']): FilterOperator[] {
  switch (type) {
    case 'NUMBER':
      return ['is', 'isNot', 'gt', 'gte', 'lt', 'lte', 'isEmpty', 'isNotEmpty'];
    case 'DATE':
    case 'CREATED_TIME':
    case 'LAST_EDITED_TIME':
      return ['is', 'before', 'after', 'onOrBefore', 'onOrAfter', 'isEmpty', 'isNotEmpty'];
    case 'CHECKBOX':
      return ['is'];
    case 'SELECT':
    case 'STATUS':
      return ['is', 'isNot', 'isEmpty', 'isNotEmpty'];
    case 'MULTI_SELECT':
    case 'PERSON':
      return ['contains', 'notContains', 'isEmpty', 'isNotEmpty'];
    case 'FILE':
      return ['isEmpty', 'isNotEmpty'];
    default:
      return ['contains', 'notContains', 'is', 'isNot', 'startsWith', 'isEmpty', 'isNotEmpty'];
  }
}

export const OPERATOR_LABEL: Record<FilterOperator, string> = {
  contains: 'chứa', notContains: 'không chứa', is: 'là', isNot: 'không là',
  startsWith: 'bắt đầu bằng',
  gt: '>', gte: '≥', lt: '<', lte: '≤',
  before: 'trước', after: 'sau', onOrBefore: 'trước hoặc bằng', onOrAfter: 'sau hoặc bằng',
  isEmpty: 'đang trống', isNotEmpty: 'không trống',
};

/** Toán tử không cần ô nhập giá trị. */
export function isUnaryOperator(operator: FilterOperator): boolean {
  return operator === 'isEmpty' || operator === 'isNotEmpty';
}

function isBlank(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/** Bỏ dấu tiếng Việt để "de an" khớp "Đề án". */
function fold(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

/** Giá trị so sánh dạng chuỗi, phù hợp cho `contains` / `is` trên mọi kiểu. */
function comparableText(property: NoteDatabaseProperty, value: unknown, ctx: CellContext): string {
  if (property.type === 'PERSON') return fold(displayValue(property, value, ctx));
  if (property.type === 'MULTI_SELECT') return fold(Array.isArray(value) ? value.join(' ') : String(value ?? ''));
  if (property.type === 'FILE') return fold(asFiles(value).map((f) => f.name || f.url).join(' '));
  return fold(String(value ?? ''));
}

function timeOf(value: unknown): number {
  const t = new Date(String(value)).getTime();
  return Number.isNaN(t) ? Number.NaN : t;
}

export function matchesFilter(
  property: NoteDatabaseProperty,
  value: unknown,
  filter: ViewFilter,
  ctx: CellContext = {},
): boolean {
  const blank = isBlank(value);
  if (filter.operator === 'isEmpty') return blank;
  if (filter.operator === 'isNotEmpty') return !blank;

  const needle = (filter.value ?? '').trim();
  // Điều kiện chưa điền giá trị KHÔNG lọc gì cả. Coi nó là "không khớp" sẽ
  // làm bảng trống trơn ngay khoảnh khắc người dùng bấm "Thêm điều kiện" và
  // chưa kịp gõ — trông y hệt như dữ liệu vừa biến mất.
  if (needle === '') return true;

  if (property.type === 'CHECKBOX') {
    const want = ['true', '1', 'yes', 'có'].includes(needle.toLowerCase());
    return Boolean(value) === want;
  }

  if (property.type === 'NUMBER') {
    const a = Number(value);
    const b = Number(needle.replace(/[.\s]/g, '').replace(',', '.'));
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
    // So sánh theo NGÀY, không theo mili giây: người dùng chọn "17/08" là có ý
    // nói cả ngày hôm đó, còn ô lại lưu "17/08 lúc 14:32". So thẳng thì
    // "bằng 17/08" không bao giờ khớp một dòng nào.
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

/** Khoá sắp xếp của một ô: số cho kiểu số/ngày, chuỗi đã bỏ dấu cho phần còn lại. */
function sortKey(property: NoteDatabaseProperty, value: unknown, ctx: CellContext): number | string {
  switch (property.type) {
    case 'NUMBER': {
      const n = Number(value);
      return Number.isFinite(n) ? n : Number.NEGATIVE_INFINITY;
    }
    case 'DATE':
    case 'CREATED_TIME':
    case 'LAST_EDITED_TIME': {
      const t = timeOf(value);
      return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
    }
    case 'CHECKBOX':
      return value ? 1 : 0;
    case 'PERSON':
      return asPersonIds(value).length;
    case 'FILE':
      return asFiles(value).length;
    default:
      return comparableText(property, value, ctx);
  }
}

export function applyFilters(
  rows: NoteDatabaseRow[],
  properties: NoteDatabaseProperty[],
  config: ViewConfig,
  ctx: CellContext = {},
): NoteDatabaseRow[] {
  const byId = new Map(properties.map((p) => [p.id, p]));
  const active = config.filters.filter((f) => byId.has(f.propertyId));
  const search = fold(config.search.trim());

  return rows.filter((row) => {
    if (search !== '') {
      // Tìm nhanh quét MỌI cột và độc lập với bộ lọc: hai thứ trả lời hai câu
      // hỏi khác nhau ("thu hẹp theo luật" và "tôi nhớ mang máng chữ này").
      const hit = properties.some((p) => comparableText(p, row.values[p.id] ?? null, ctx).includes(search));
      if (!hit) return false;
    }
    if (active.length === 0) return true;
    const results = active.map((f) => matchesFilter(byId.get(f.propertyId)!, row.values[f.propertyId] ?? null, f, ctx));
    return config.filterJoin === 'or' ? results.some(Boolean) : results.every(Boolean);
  });
}

export function applySorts(
  rows: NoteDatabaseRow[],
  properties: NoteDatabaseProperty[],
  config: ViewConfig,
  ctx: CellContext = {},
): NoteDatabaseRow[] {
  const byId = new Map(properties.map((p) => [p.id, p]));
  const active = config.sorts.filter((s) => byId.has(s.propertyId));
  if (active.length === 0) return rows;

  // Sao chép trước khi sắp: `sort` sửa TẠI CHỖ, và mảng vào đây là mảng đang
  // nằm trong state của React — sắp thẳng lên nó là sửa state ngoài luồng.
  return [...rows].sort((rowA, rowB) => {
    for (const sort of active) {
      const property = byId.get(sort.propertyId)!;
      const a = sortKey(property, rowA.values[property.id] ?? null, ctx);
      const b = sortKey(property, rowB.values[property.id] ?? null, ctx);
      let cmp = 0;
      if (typeof a === 'number' && typeof b === 'number') cmp = a - b;
      else cmp = String(a).localeCompare(String(b), 'vi');
      if (cmp !== 0) return sort.direction === 'desc' ? -cmp : cmp;
    }
    // Hoà thì giữ thứ tự người dùng đã kéo tay. Trả 0 cũng ổn với `sort` ổn
    // định của JS hiện đại, nhưng nói rõ ra thì không phụ thuộc vào điều đó.
    return rowA.sortOrder - rowB.sortOrder;
  });
}

export interface RowGroup {
  key: string;
  label: string;
  rows: NoteDatabaseRow[];
}

export const UNGROUPED_KEY = '__unset__';

export function applyGrouping(
  rows: NoteDatabaseRow[],
  properties: NoteDatabaseProperty[],
  config: ViewConfig,
  ctx: CellContext = {},
): RowGroup[] | null {
  if (config.groupPropertyId === null) return null;
  const property = properties.find((p) => p.id === config.groupPropertyId);
  if (!property) return null;

  const groups = new Map<string, NoteDatabaseRow[]>();
  for (const row of rows) {
    const value = row.values[property.id] ?? null;
    const key = isBlank(value) ? UNGROUPED_KEY : displayValue(property, value, ctx) || UNGROUPED_KEY;
    const bucket = groups.get(key);
    if (bucket) bucket.push(row); else groups.set(key, [row]);
  }
  return [...groups.entries()].map(([key, groupRows]) => ({
    key,
    label: key === UNGROUPED_KEY ? 'Chưa đặt' : key,
    rows: groupRows,
  }));
}

/** Chạy cả ba bước theo đúng thứ tự: lọc → sắp xếp → nhóm. */
export function applyViewConfig(
  rows: NoteDatabaseRow[],
  properties: NoteDatabaseProperty[],
  config: ViewConfig,
  ctx: CellContext = {},
): { rows: NoteDatabaseRow[]; groups: RowGroup[] | null; visibleProperties: NoteDatabaseProperty[] } {
  const filtered = applyFilters(rows, properties, config, ctx);
  const sorted = applySorts(filtered, properties, config, ctx);
  const hidden = new Set(config.hiddenPropertyIds);
  return {
    rows: sorted,
    groups: applyGrouping(sorted, properties, config, ctx),
    // Cột tiêu đề KHÔNG bao giờ ẩn được: ẩn nó thì mọi dòng mất nhãn và bảng
    // thành một lưới số không đọc nổi.
    visibleProperties: properties.filter((p) => p.isTitle || !hidden.has(p.id)),
  };
}
