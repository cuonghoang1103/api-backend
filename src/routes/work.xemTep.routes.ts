/**
 * CT Work — trình xem tệp trong trang (20/10/2026). Hai tuyến cho MỖI nơi có tệp tải lên:
 *
 *   GET …/content   byte CHỮ (≤ 2 MB, quá thì cắt + `X-Preview-Truncated: 1`) — LUÔN `text/plain; charset=utf-8`,
 *                   kể cả tệp .html/.svg/.js: xem dạng chữ, không bao giờ để trình duyệt chạy nó từ origin của mình.
 *   GET …/preview   JSON xem trước Office: docx ⇒ HTML (mammoth), xlsx ⇒ bảng giá trị. Loại khác ⇒ 415.
 *
 * Nơi có tệp:
 *   /projects/:pid/attachments/:aid/…       đính kèm thẻ + tệp bình luận + bằng chứng test (issues.readableAttachment)
 *   /projects/:pid/chat/files/:fid/…        tệp kênh chat (chatFiles.readableChatFile)
 *   /classes/:id/stream-files/:fid/…        tệp bảng tin / tài liệu lớp (classStream.readableClassStreamFile)
 *   /classes/:id/files/:fid/…               tệp đề + bài nộp (classwork.readableClassFile)
 *
 * Quyền = ĐÚNG hàm mà tuyến `/url` cùng nơi dùng (khách cổng chỉ tệp đã chia sẻ / bình luận PUBLIC; kênh khách; bài
 * nộp chỉ giảng viên + chủ bài). Cổng khách: tuyến thẻ khai trong CLIENT_ROUTES, tuyến chat nằm sẵn dưới `/chat`.
 * Agent: tuyến thẻ là tuyến ĐỌC ⇒ mở như `/url` (AGENT_DENIED_ROUTES không đổi); `/chat/**` và `/classes/**` vẫn cấm agent.
 */

import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { AppError, asyncHandler, UnauthorizedError } from '../middleware/errorHandler.js';
import * as classStream from '../services/work/classStream.service.js';
import * as classwork from '../services/work/classwork.service.js';
import * as chatFiles from '../services/work/chatFiles.service.js';
import * as issues from '../services/work/issues.service.js';
import { dispositionInline, noiDungChu, xemTruocOffice, type TepNguon } from '../services/work/xemTep.js';

const router = Router();

function callerId(req: Request): number {
  const v = req.userId ?? req.user?.userId;
  if (!v) throw new UnauthorizedError();
  return v;
}
const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => {
  const r = id.safeParse(req.params[name]);
  if (!r.success) throw new AppError(`${name}: invalid id`, 400, 'VALIDATION_ERROR');
  return r.data;
};

/** Dựng xem trước tốn CPU (giải nén, mammoth) ⇒ trần theo NGƯỜI. */
const xemLimiter = rateLimit({
  windowMs: 60_000,
  max: () => Number(process.env.WORK_PREVIEW_RPM || 60),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `work-preview:${req.userId ?? req.user?.userId ?? req.ip}`,
  validate: false,
  message: { success: false, message: 'Too many previews — wait a moment and try again.', code: 'RATE_LIMIT_EXCEEDED' },
});

async function guiChu(res: Response, f: TepNguon) {
  const { buf, truncated } = await noiDungChu(f);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Disposition', dispositionInline(f.fileName));
  // Mở thẳng tuyến này trong tab: không script, không tài nguyên, không nhúng được.
  res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox; frame-ancestors 'none'");
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Preview-Truncated', truncated ? '1' : '0');
  res.setHeader('X-File-Size', String(f.size));
  res.setHeader('Access-Control-Expose-Headers', 'X-Preview-Truncated, X-File-Size');
  res.status(200).end(buf);
}
async function guiXemTruoc(res: Response, f: TepNguon) {
  const data = await xemTruocOffice(f);
  res.setHeader('Cache-Control', 'private, no-store');
  res.json({ success: true, data });
}

type TimTep = (req: Request) => Promise<TepNguon>;
function haiTuyen(base: string, tim: TimTep) {
  router.get(`${base}/content`, xemLimiter, asyncHandler(async (req, res) => guiChu(res, await tim(req))));
  router.get(`${base}/preview`, xemLimiter, asyncHandler(async (req, res) => guiXemTruoc(res, await tim(req))));
}

haiTuyen('/projects/:pid/attachments/:aid', async (req) => (await issues.readableAttachment(callerId(req), P(req, 'pid'), P(req, 'aid'))).att);
haiTuyen('/projects/:pid/chat/files/:fid', async (req) => (await chatFiles.readableChatFile(callerId(req), P(req, 'pid'), P(req, 'fid'))).f);
haiTuyen('/classes/:id/stream-files/:fid', (req) => classStream.readableClassStreamFile(callerId(req), P(req, 'id'), P(req, 'fid')));
haiTuyen('/classes/:id/files/:fid', (req) => classwork.readableClassFile(callerId(req), P(req, 'id'), P(req, 'fid')));

export default router;
