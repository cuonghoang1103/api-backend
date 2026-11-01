// routes/reportExports.js — Lab 10 (LỜI GIẢI): báo cáo dùng phòng thành VIỆC NỀN.
//   POST /v2/reports/usage/exports { from, days } ⇒ 202 + Location /v2/jobs/{id} + Retry-After (Idempotency-Key dùng được)
//   Worker tính xong ⇒ sự kiện labflow.report.ready.v1 ⇒ webhook tới đăng ký của CHÍNH người tạo (src/worker.js)
import { Router } from 'express';
import { z } from 'zod';
import { onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { idempotent } from '../idempotency.js';
import { createJob, toJob } from '../jobs.js';

const Body = z.strictObject({ from: z.iso.date(), days: z.number().int().min(1).max(92).default(30) });
export const reportExportsRouter = Router();
reportExportsRouter.use(requireAuth, requireRole('LAB_MANAGER'));
reportExportsRouter.route('/')
  .post(idempotent(), validate('body', Body), async (req, res) => {
    const job = await createJob('usage-report', req.valid.body, req.user.id);
    const base = `/v${req.apiVersion}/jobs`;
    res.status(202).location(`${base}/${job.id}`).set('Retry-After', process.env.JOB_POLL_SEC ?? '2').json(toJob(job, base));
  })
  .all(onlyAllow('POST'));
