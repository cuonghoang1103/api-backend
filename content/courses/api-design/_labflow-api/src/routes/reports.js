// routes/reports.js — Lab 8 (BẢN THAM KHẢO): cùng câu trả lời với bản khởi đầu, nhưng
//   1) quét danh sách đặt phòng MỘT lần (O(N)) thay vì days × labs lần (O(days·labs·N)), không tạo Date trong vòng lặp
//   2) nhớ kết quả 60 s theo (from, days) — báo cáo không cần tươi từng giây; Age cho client biết dữ liệu cũ bao lâu
//   3) tối đa 2 lượt tính cùng lúc, dư ⇒ 503 + Retry-After (một báo cáo nặng không được kéo cả API chậm theo)
import { Router } from 'express';
import { z } from 'zod';
import { store } from '../store/index.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { onlyAllow } from '../http.js';
import { limitInflight } from '../resilience.js';

const Q = z.strictObject({
  from: z.iso.date(),
  days: z.coerce.number().int().min(1).max(92).default(30),
});
const TTL_MS = Number(process.env.REPORT_CACHE_MS ?? 60_000);   // REPORT_CACHE_MS=0 ⇒ tắt cache (để đo riêng phần tính)
const cache = new Map();                                       // "from|days" ⇒ { body, at }

// Chương 12: phần đếm do store làm — kho RAM quét mảng MỘT lần, kho pg là MỘT câu GROUP BY
async function usage(from, days) {
  const dayList = Array.from({ length: days }, (_, d) => new Date(Date.parse(from) + d * 86400000).toISOString().slice(0, 10));
  const [labs, cell] = await Promise.all([store.allLabs(), store.usageCells(from, days)]);   // "2026-11-02|lab_1" ⇒ { bookings, hours }
  const rows = [];
  for (const day of dayList) for (const lab of labs) rows.push({ day, labId: lab.id, ...(cell.get(`${day}|${lab.id}`) ?? { bookings: 0, hours: 0 }) });
  return { from, days, rows };
}

export const reportsRouter = Router();
reportsRouter.route('/usage')
  .get(requireAuth, requireRole('LAB_MANAGER'), limitInflight(2), validate('query', Q), async (req, res) => {
    const { from, days } = req.valid.query;
    const key = `${from}|${days}`;
    let hit = cache.get(key);
    if (!hit || Date.now() - hit.at > TTL_MS) {
      hit = { body: await req.timing.timeAsync('compute', () => usage(from, days)), at: Date.now() };
      cache.set(key, hit);
    }
    res.set('Cache-Control', 'private, max-age=60')
      .set('Age', String(Math.floor((Date.now() - hit.at) / 1000)))
      .json(hit.body);
  })
  .all(onlyAllow('GET'));
