// paging.js — thứ tự ỔN ĐỊNH + con trỏ (cursor) cho danh sách
import { createHash } from 'node:crypto';
import { HttpError } from './http.js';

export const idNum = (id) => Number(id.slice(id.indexOf('_') + 1));

// sort = 'createdAt' | '-createdAt' | 'startAt' | '-startAt'  ('-' = giảm dần).
// Luôn thêm id làm khoá phụ cùng chiều ⇒ không bao giờ có hai bản ghi "ngang hàng" ⇒ trang không trùng, không sót.
// ranks: thứ tự NGHIỆP VỤ cho trường enum, ví dụ { severity: { LOW: 1, MEDIUM: 2, HIGH: 3 } } (Lab 3) —
// so chữ cái sẽ cho HIGH < LOW < MEDIUM, sai nghĩa.
export function orderBy(sort, ranks = {}) {
  const desc = sort.startsWith('-'), key = sort.replace('-', '');
  const dir = desc ? -1 : 1;
  const val = (r) => (ranks[key] ? ranks[key][r[key]] : r[key]);
  const cmp = (a, b) => {
    const x = val(a), y = val(b);
    return dir * ((typeof x === 'number' ? x - y : x.localeCompare(y)) || idNum(a.id) - idNum(b.id));
  };
  return { key, cmp };
}
export const newestFirst = orderBy('-createdAt').cmp;

// Dấu vân tay của bộ lọc + thứ tự: con trỏ chỉ dùng được với ĐÚNG truy vấn đã sinh ra nó
export const fingerprint = (params) =>
  createHash('sha256').update(JSON.stringify(Object.entries(params).filter(([, v]) => v !== undefined).sort())).digest('hex').slice(0, 8);

// Con trỏ = giá trị khoá sắp xếp + id của phần tử CUỐI trang trước + vân tay, gói thành chuỗi mờ (base64url của JSON)
export const encodeCursor = (b, key, f) => Buffer.from(JSON.stringify({ v: b[key], id: b.id, f })).toString('base64url');

export function decodeCursor(s, key, f) {
  let c;
  try { c = JSON.parse(Buffer.from(s, 'base64url').toString('utf8')); } catch { c = null; }
  if (!c || typeof c.v !== 'string' || !/^[a-z]+_\d+$/.test(c.id ?? ''))
    throw new HttpError(400, 'INVALID_CURSOR');        // client không được tự chế hay sửa con trỏ
  if (c.f !== f) throw new HttpError(400, 'CURSOR_MISMATCH');   // đổi bộ lọc/thứ tự giữa chừng ⇒ bắt đầu lại
  return { [key]: c.v, id: c.id };                     // một "bản ghi giả" đứng đúng vị trí con trỏ
}
