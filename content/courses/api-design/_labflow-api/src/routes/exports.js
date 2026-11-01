// routes/exports.js — bài 10.1: xuất lượt đặt ra CSV. Hai cách:
//   GET  /v2/exports/bookings.csv   ĐỒNG BỘ: client ngồi chờ tới khi xong (để thấy proxy cắt ở giây 100)
//   POST /v2/exports                BẤT ĐỒNG BỘ: 202 Accepted + Location tới /v2/jobs/{id} ngay lập tức
import { Router } from 'express';
import { z } from 'zod';
import { onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { idempotent } from '../idempotency.js';
import { exportBookings } from '../exportTask.js';
import { createJob, toJob } from '../jobs.js';

const ExportQuery = z.strictObject({
  labId: z.string().regex(/^lab_\d+$/).optional(),               // bỏ trống ⇒ cả trường
  from: z.iso.date(), to: z.iso.date(),
});
export const exportsRouter = Router();
exportsRouter.use(requireAuth, requireRole('LAB_MANAGER'));

exportsRouter.route('/bookings.csv')
  .get(validate('query', ExportQuery), async (req, res) => {
    const t0 = performance.now();
    res.on('close', () => { if (!res.writableFinished) console.log(`[sync] client bỏ đi sau ${((performance.now() - t0) / 1000).toFixed(1)} s — server VẪN làm tiếp`); });
    const csv = await exportBookings(req.valid.query);            // ngồi chờ: 2 phút cho cả trường một học kỳ
    console.log(`[sync] xong sau ${((performance.now() - t0) / 1000).toFixed(1)} s, ${csv.length} byte`);
    res.type('text/csv').send(csv);
  })
  .all(onlyAllow('GET', 'HEAD'));

exportsRouter.route('/')
  .post(idempotent(), validate('body', ExportQuery), async (req, res) => {
    const job = await createJob('bookings-export', req.valid.body, req.user.id);
    const base = `/v${req.apiVersion}/jobs`;
    res.status(202)                                                // 202: đã NHẬN, chưa LÀM — RFC 9110 §15.3.3
      .location(`${base}/${job.id}`)                               // theo dõi ở đây
      .set('Retry-After', process.env.JOB_POLL_SEC ?? '2')
      .json(toJob(job, base));
  })
  .all(onlyAllow('POST'));
