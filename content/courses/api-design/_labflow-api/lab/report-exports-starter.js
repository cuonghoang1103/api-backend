// lab/report-exports-starter.js — Lab 10 (BẢN KHỞI ĐẦU): báo cáo dùng phòng cả trường, ĐỒNG BỘ.
// Chạy được, đúng số liệu — nhưng 92 ngày mất ~30 s: client giữ kết nối suốt, proxy 100 s cắt khi dữ liệu lớn hơn,
// người dùng bấm lại là tính lại từ đầu, và không ai được báo khi xong. Nhiệm vụ: đổi thành việc nền 202 + webhook.
//   cp lab/report-exports-starter.js src/routes/reportExports.js   (sao lưu lời giải trước)
import { Router } from 'express';
import { z } from 'zod';
import { onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { usageReport } from '../reportTask.js';

const Body = z.strictObject({ from: z.iso.date(), days: z.number().int().min(1).max(92).default(30) });
export const reportExportsRouter = Router();
reportExportsRouter.use(requireAuth, requireRole('LAB_MANAGER'));
reportExportsRouter.route('/')
  .post(validate('body', Body), async (req, res) => {
    const json = await usageReport(req.valid.body);              // ngồi chờ tới khi xong
    res.type('application/json').send(json);
  })
  .all(onlyAllow('POST'));
