// schemas.js — hợp đồng đầu vào viết thành CODE: mỗi request phải khớp đúng một lược đồ
import { z } from 'zod';

// KHÔNG viết câu báo lỗi riêng: câu tự viết không được dịch — để Zod dùng câu theo ngôn ngữ của request
const id = (prefix) => z.string().regex(new RegExp(`^${prefix}_\\d+$`));
const instant = z.iso.datetime({ offset: true });   // bắt buộc Z hoặc ±hh:mm, kiểm cả ngày có thật
// Chữ người gõ: bỏ khoảng trắng hai đầu + chuẩn hoá Unicode về NFC ("ò" luôn là MỘT ký tự)
const text = (min, max) => z.string().trim().normalize('NFC').min(min).max(max);

export const DEVICE_TYPES = ['ROUTER', 'SWITCH', 'BOARD', 'PC', 'OTHER'];
export const DEVICE_STATUSES = ['AVAILABLE', 'IN_USE', 'MAINTENANCE'];

// strictObject: trường lạ (status, userId, isAdmin…) ⇒ lỗi, không lặng lẽ bỏ qua
export const BookingCreate = z.strictObject({
  labId: id('lab'),
  startAt: instant,
  endAt: instant,
  purpose: text(1, 200).optional(),
});
// v2 (bài 4.2): body dùng period { start, end } — handler đổi về dạng nội bộ startAt/endAt
export const BookingCreateV2 = z.strictObject({
  labId: id('lab'),
  period: z.strictObject({ start: instant, end: instant }),
  purpose: text(1, 200).optional(),
});

const deviceFields = {
  labId: id('lab'),
  name: text(1, 100),
  type: z.enum(DEVICE_TYPES),
  serialNo: z.string().regex(/^[A-Z0-9-]{6,20}$/),
  status: z.enum(DEVICE_STATUSES),
  note: text(0, 500).nullable().optional(),
};
export const DeviceCreate = z.strictObject(deviceFields);          // POST: đủ trường bắt buộc
export const DeviceReplace = DeviceCreate;                         // PUT = thay toàn bộ ⇒ cùng luật
export const DevicePatch = z.strictObject(deviceFields).partial(); // PATCH: trường nào cũng tuỳ chọn
// Lab 4 — v2: cùng luật, chỉ khác TÊN trường số serial
const { serialNo, ...rest } = deviceFields;
const deviceFieldsV2 = { ...rest, serialNumber: serialNo };
export const DeviceCreateV2 = z.strictObject(deviceFieldsV2);
export const DevicePatchV2 = z.strictObject(deviceFieldsV2).partial();

// Lab 2 — báo hỏng
export const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH'];
export const IssueCreate = z.strictObject({
  title: text(3, 120),
  severity: z.enum(SEVERITIES),
  description: text(1, 1000).optional(),
});
export const IssueResolve = z.strictObject({ resolution: text(1, 500).optional() });
export const IssuesQuery = z.strictObject({
  status: z.enum(['OPEN', 'RESOLVED']).optional(),
  severity: z.enum(SEVERITIES).optional(),
  // Lab 3 — danh sách lớn: con trỏ, lọc thêm theo thiết bị, sắp theo mức độ, nhúng thiết bị
  deviceId: id('dev').optional(),
  sort: z.enum(['-createdAt', 'createdAt', '-severity']).default('-createdAt'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().min(1).max(200).optional(),
  include: z.enum(['device']).optional(),
});

export const LabsQuery = z.strictObject({
  building: text(1, 50).optional(),
  q: text(1, 50).optional(),                                       // tìm theo tên, không phân biệt dấu
  minCapacity: z.coerce.number().int().min(1).optional(),         // query luôn là chuỗi ⇒ ép sang số
});

// Chương 3 — phân trang bằng con trỏ: limit mặc định 20, tối đa 100 (quá ⇒ 400, không lặng lẽ cắt)
export const BOOKING_STATUSES = ['PENDING', 'CANCELLED'];
export const BOOKING_STATUSES_V2 = ['PENDING', 'CHECKED_IN', 'CANCELLED'];   // bài 4.4
export const BOOKING_FIELDS = ['id', 'labId', 'userId', 'startAt', 'endAt', 'purpose', 'status', 'createdAt', 'cancelledAt'];
export const BOOKING_FIELDS_V2 = ['id', 'labId', 'userId', 'period', 'purpose', 'status', 'createdAt', 'cancelledAt', 'checkedInAt'];
const bookingsQuery = (fieldNames, sorts, statuses) => z.strictObject({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().min(1).max(200).optional(),   // chuỗi mờ do server phát; offset đã bỏ (bài 3.2)
  // Bài 3.3 — bộ lọc: tên rõ nghĩa, mỗi tham số một kiểu, kết hợp bằng AND
  labId: id('lab').optional(),
  status: z.string()                                // "PENDING,CANCELLED" ⇒ ['PENDING', 'CANCELLED']
    .transform((s) => s.split(','))
    .pipe(z.array(z.enum(statuses)).min(1))
    .optional(),
  from: instant.optional(),                         // lượt đặt CHỒNG LÊN khoảng [from, to)
  to: instant.optional(),
  q: text(2, 50).optional(),                        // tìm trong purpose, không phân biệt dấu
  // Bài 3.4 — sắp xếp, chọn trường, nhúng quan hệ: chỉ những giá trị có trong danh sách cho phép
  sort: z.enum(Object.keys(sorts)).default('-createdAt').transform((s) => sorts[s]),   // tên công khai ⇒ khoá nội bộ
  fields: z.string()
    .transform((s) => s.split(','))
    .pipe(z.array(z.enum(fieldNames)).min(1))
    .optional(),
  include: z.enum(['lab']).optional(),
}).refine((x) => {
  // luật nhiều trường: chỉ phán khi CẢ HAI đã đúng định dạng (Zod có thể chạy refine trên giá trị còn sai)
  const a = Date.parse(x.from ?? ''), b = Date.parse(x.to ?? '');
  return Number.isNaN(a) || Number.isNaN(b) || a < b;
}, { path: ['to'], message: 'TO_AFTER_FROM' });   // mã luật — câu chữ dịch ở i18n.js
export const BookingsQuery = bookingsQuery(BOOKING_FIELDS,
  { '-createdAt': '-createdAt', createdAt: 'createdAt', startAt: 'startAt', '-startAt': '-startAt' }, BOOKING_STATUSES);
export const BookingsQueryV2 = bookingsQuery(BOOKING_FIELDS_V2,     // v2: sort=start thay cho startAt
  { '-createdAt': '-createdAt', createdAt: 'createdAt', start: 'startAt', '-start': '-startAt' }, BOOKING_STATUSES_V2);
