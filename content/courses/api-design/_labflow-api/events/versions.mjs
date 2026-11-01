// events/versions.mjs — bài 10.3: tiến hoá hợp đồng sự kiện. Hai consumer đọc data của labflow.booking.created:
//   strict  : z.strictObject — trường lạ là lỗi (giống cách ta kiểm REQUEST ở Chương 2)
//   tolerant: z.object — bỏ qua trường không biết ("tolerant reader")
// Ba đợt phát: v1 như cũ · v1 THÊM trường purposeCategory · v2 đổi period ⇒ startAt/endAt (phá vỡ ⇒ type mới .v2)
import { z } from 'zod';

const period = z.object({ start: z.iso.datetime(), end: z.iso.datetime() });
const strict = z.strictObject({ id: z.string(), labId: z.string(), period: z.strictObject({ start: z.iso.datetime(), end: z.iso.datetime() }), status: z.string(), version: z.number() });
const tolerant = z.object({ id: z.string(), labId: z.string(), period, status: z.string(), version: z.number() });
const base = { id: 'bk_1', labId: 'lab_1', period: { start: '2026-12-01T01:00:00.000Z', end: '2026-12-01T03:00:00.000Z' }, status: 'PENDING', version: 1 };
const waves = [
  ['v1 như cũ', 'labflow.booking.created.v1', base],
  ['v1 + trường mới purposeCategory', 'labflow.booking.created.v1', { ...base, purposeCategory: 'COURSE_LAB' }],
  ['v2 đổi hình dạng (startAt/endAt)', 'labflow.booking.created.v2', { id: 'bk_1', labId: 'lab_1', startAt: base.period.start, endAt: base.period.end, status: 'PENDING', version: 1 }],
];
const SUBSCRIBED = ['labflow.booking.created.v1'];            // consumer cũ chỉ đăng ký đúng type nó hiểu
for (const [name, type, data] of waves) {
  const r = [];
  for (const [who, schema] of [['strict', strict], ['tolerant', tolerant]]) {
    if (!SUBSCRIBED.includes(type)) { r.push(`${who}: không nhận (chưa đăng ký ${type.split('.').pop()})`); continue; }
    const p = schema.safeParse(data);
    r.push(`${who}: ${p.success ? 'OK' : 'LỖI ' + p.error.issues.map((i) => i.code + (i.keys ? ' ' + i.keys : '')).join(',')}`);
  }
  console.log(`${name.padEnd(34)} ${type.padEnd(27)} ${r.join(' · ')}`);
}
// Nhà sản xuất trong thời gian chuyển: phát CẢ v1 lẫn v2 cho tới khi không còn ai đăng ký v1
const v1 = (b) => ({ ...b, period: { start: b.startAt, end: b.endAt }, startAt: undefined, endAt: undefined });
console.log('phát song song khi chuyển:', JSON.stringify(v1({ id: 'bk_1', labId: 'lab_1', startAt: base.period.start, endAt: base.period.end, status: 'PENDING', version: 1 })).length, 'B (v1) +',
  JSON.stringify(waves[2][2]).length, 'B (v2) mỗi lượt đặt');
