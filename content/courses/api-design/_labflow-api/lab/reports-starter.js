// routes/reports.js — Lab 8 (BẢN KHỞI ĐẦU, cố ý chậm): báo cáo dùng phòng cho cô Lan
// GET /v2/reports/usage?from=2026-11-02&days=30 ⇒ mỗi ngày, mỗi phòng: số lượt đặt và số giờ (bỏ lượt đã huỷ)
import { Router } from 'express';
import { z } from 'zod';
import { labs, bookings } from '../db.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { onlyAllow } from '../http.js';

const Q = z.strictObject({
  from: z.iso.date(),
  days: z.coerce.number().int().min(1).max(92).default(30),
});

export const reportsRouter = Router();
reportsRouter.route('/usage')
  .get(requireAuth, requireRole('LAB_MANAGER'), validate('query', Q), (req, res) => {
    const { from, days } = req.valid.query;
    const out = [];
    for (let d = 0; d < days; d++) {
      const day = new Date(Date.parse(from) + d * 86400000).toISOString().slice(0, 10);
      for (const lab of labs) {
        // mỗi (ngày, phòng) lại quét TOÀN BỘ danh sách đặt phòng
        const mine = bookings.filter((b) => b.labId === lab.id && b.status !== 'CANCELLED'
          && new Date(b.startAt).toISOString().slice(0, 10) === day);
        const hours = mine.reduce((s, b) => s + (new Date(b.endAt) - new Date(b.startAt)) / 3600000, 0);
        out.push({ day, labId: lab.id, bookings: mine.length, hours });
      }
    }
    res.json({ from, days, rows: out });
  })
  .all(onlyAllow('GET'));
