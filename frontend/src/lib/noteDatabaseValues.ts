/**
 * Cell value conversion for Notes Databases.
 *
 * Shared by the table grid, the row editor and the Board/Gallery/Calendar
 * views. Keeping one copy matters: if the grid and the row modal disagreed on
 * how a DATE or MULTI_SELECT round-trips, editing the same cell from two
 * places would produce two different stored shapes.
 */

import type { NoteDatabaseProperty } from '@/lib/api';

/** Người có thể gán vào cột PERSON — chủ môn + những người được chia sẻ. */
export interface DatabasePerson {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

/** Tệp lưu trong một ô kiểu FILE. */
export interface DatabaseFile {
  url: string;
  name: string;
  size: number | null;
  mime: string;
}

/**
 * Ngữ cảnh cho những kiểu không tự giải nghĩa được.
 *
 * Cột PERSON lưu MẢNG ID, không lưu tên — lưu tên sẽ đóng băng nó tại thời
 * điểm gán, và người dùng đổi tên là mọi dòng cũ vẫn gọi họ bằng tên cũ. Cái
 * giá phải trả là hàm hiển thị cần một bảng tra, và đó là thứ này.
 */
export interface CellContext {
  people?: DatabasePerson[];
}

export function personLabel(person: DatabasePerson): string {
  return person.displayName?.trim() || person.username;
}

/**
 * Kiểu chỉ ĐỌC: máy chủ tự tính từ `createdAt`/`updatedAt` của dòng và bỏ qua
 * mọi lượt ghi. Giao diện phải biết điều này, nếu không người dùng gõ vào ô
 * rồi thấy giá trị cũ quay lại mà không hiểu vì sao.
 */
export function isReadOnlyType(type: NoteDatabaseProperty['type']): boolean {
  return type === 'CREATED_TIME' || type === 'LAST_EDITED_TIME';
}

/** Cột nào cần giao diện riêng thay vì ô nhập chữ thường. */
export function needsCustomEditor(type: NoteDatabaseProperty['type']): boolean {
  return type === 'FILE' || type === 'PERSON' || isReadOnlyType(type);
}

/**
 * Tên các tuỳ chọn của một cột, bất kể `config.options` là mảng chuỗi (dạng
 * cũ của SELECT) hay mảng `{ name, group, color }` (dạng của STATUS).
 *
 * Có hàm này vì `tsc` vừa chỉ ra bốn chỗ đang duyệt thẳng `config.options` và
 * đưa từng phần tử vào `key`/`value` của React — với dạng mới thì đó là một
 * object, và React sẽ dựng ra `[object Object]` trong danh sách gợi ý.
 */
export function optionNames(property: NoteDatabaseProperty): string[] {
  const raw = property.config?.options;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((option) => (typeof option === 'string' ? option : option?.name))
    .filter((name): name is string => typeof name === 'string' && name.length > 0);
}

function formatDateTime(value: unknown): string {
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function asFiles(value: unknown): DatabaseFile[] {
  if (!Array.isArray(value)) return [];
  return value.filter((f): f is DatabaseFile => Boolean(f) && typeof f === 'object' && typeof (f as DatabaseFile).url === 'string');
}

export function asPersonIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value.map(Number).filter((id) => Number.isInteger(id) && id > 0);
}

/** Human-facing rendering. Never used as input to an <input>. */
export function displayValue(property: NoteDatabaseProperty, value: unknown, ctx: CellContext = {}): string {
  if (value === null || value === undefined) return '';
  switch (property.type) {
    case 'CHECKBOX':
      return value ? '✓' : '';
    case 'DATE': {
      const date = new Date(String(value));
      return Number.isNaN(date.getTime())
        ? ''
        : date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    // Hai cột thời gian hiện CẢ GIỜ, khác cột DATE do người dùng nhập: chúng
    // ghi lại một khoảnh khắc, và "sửa lúc 14:32" là thông tin có ích, còn
    // "sửa ngày 17/08" thì thường vô dụng vì hôm nay ai cũng sửa.
    case 'CREATED_TIME':
    case 'LAST_EDITED_TIME':
      return formatDateTime(value);
    case 'MULTI_SELECT':
      return Array.isArray(value) ? value.join(', ') : String(value);
    case 'NUMBER':
      return typeof value === 'number' ? value.toLocaleString('vi-VN') : String(value);
    case 'PERSON': {
      const ids = asPersonIds(value);
      if (ids.length === 0) return '';
      const byId = new Map((ctx.people ?? []).map((p) => [p.id, p]));
      // Người đã rời khỏi danh sách chia sẻ vẫn còn id trong ô. Hiện "#id" chứ
      // không bỏ qua: bỏ qua sẽ làm ô trông như chưa gán ai, và người dùng
      // tưởng việc đó chưa có người phụ trách.
      return ids.map((id) => { const p = byId.get(id); return p ? personLabel(p) : `#${id}`; }).join(', ');
    }
    case 'FILE': {
      const files = asFiles(value);
      if (files.length === 0) return '';
      return files.length === 1 ? (files[0]!.name || files[0]!.url) : `${files.length} tệp`;
    }
    default:
      return String(value);
  }
}

/** What the <input> should contain while editing. */
export function editableValue(property: NoteDatabaseProperty, value: unknown, ctx: CellContext = {}): string {
  if (value === null || value === undefined) return '';
  if (property.type === 'DATE') {
    const date = new Date(String(value));
    // <input type="date"> only accepts yyyy-mm-dd.
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
  }
  if (property.type === 'MULTI_SELECT') return Array.isArray(value) ? value.join(', ') : String(value);
  if (property.type === 'PERSON') return displayValue(property, value, ctx);
  return String(value);
}

/** What the user typed, in the shape the API expects. `null` clears the cell. */
export function outboundValue(property: NoteDatabaseProperty, raw: string, ctx: CellContext = {}): unknown {
  if (property.type === 'MULTI_SELECT') {
    const picked = raw.split(',').map((part) => part.trim()).filter(Boolean);
    return picked.length > 0 ? picked : null;
  }
  if (property.type === 'PERSON') {
    // Người dùng gõ TÊN (gợi ý bằng datalist), máy chủ nhận ID. Đối chiếu
    // không phân biệt hoa thường và chấp nhận cả username lẫn tên hiển thị,
    // vì datalist gợi ý tên hiển thị nhưng người dùng có thể gõ username.
    const people = ctx.people ?? [];
    const names = raw.split(',').map((part) => part.trim().toLowerCase()).filter(Boolean);
    const ids = names
      .map((name) => people.find((p) => personLabel(p).toLowerCase() === name || p.username.toLowerCase() === name)?.id)
      .filter((id): id is number => typeof id === 'number');
    return ids.length > 0 ? ids : null;
  }
  return raw === '' ? null : raw;
}

/** The row's title text, used as the card label in every non-table view. */
export function rowTitle(properties: NoteDatabaseProperty[], values: Record<number, unknown>): string {
  const titleProperty = properties.find((property) => property.isTitle);
  const raw = titleProperty ? values[titleProperty.id] : null;
  const text = raw === null || raw === undefined ? '' : String(raw);
  return text || 'Không có tiêu đề';
}

/**
 * Nhóm của một tuỳ chọn STATUS: `todo` | `doing` | `done`.
 *
 * Đây là điều khiến STATUS khác SELECT. Nhờ nhóm, Board biết xếp cột theo thứ
 * tự việc chứ không theo bảng chữ cái, và thanh tiến độ biết đâu là "xong" mà
 * không phải đoán từ tên tuỳ chọn (tên do người dùng đặt, có thể là "Ship
 * rồi" hay "Đã bàn giao").
 */
export type StatusGroup = 'todo' | 'doing' | 'done';

export const STATUS_GROUP_LABEL: Record<StatusGroup, string> = {
  todo: 'Chưa làm',
  doing: 'Đang làm',
  done: 'Xong',
};

/** Tuỳ chọn STATUS mặc định khi tạo cột mới. */
export const DEFAULT_STATUS_OPTIONS: { name: string; group: StatusGroup }[] = [
  { name: 'Chưa làm', group: 'todo' },
  { name: 'Đang làm', group: 'doing' },
  { name: 'Xong', group: 'done' },
];

export function statusGroupOf(property: NoteDatabaseProperty, optionName: unknown): StatusGroup | null {
  if (property.type !== 'STATUS' || typeof optionName !== 'string') return null;
  const raw = (property.config as { options?: unknown } | null)?.options;
  if (!Array.isArray(raw)) return null;
  for (const option of raw) {
    if (option && typeof option === 'object') {
      const o = option as { name?: unknown; group?: unknown };
      if (o.name === optionName && (o.group === 'todo' || o.group === 'doing' || o.group === 'done')) {
        return o.group;
      }
    }
  }
  return null;
}
