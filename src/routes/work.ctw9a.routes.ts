/**
 * CT Work — CTW ĐỢT 9a (13/10/2026): LỚP HỌC — bảng tin, tài liệu lớp, lịch lớp + điểm danh. Gắn trong work.routes.ts
 * (sau authenticate). Mọi tuyến là top-level `/classes/...` ⇒ KHÔNG nằm trong danh sách trắng của token agent
 * (agentTopRouteAllowed) ⇒ agent 403; trong service classCtx() cũng chặn agent ở mọi lệnh. Quyền lớp kiểm TRONG service.
 *
 *   Cài đặt      GET|PATCH /classes/:id/classroom-settings          { streamComments?, absenceThreshold?, lateAfterMin? }
 *   Stream       GET  /classes/:id/stream?before=&limit=  ·  POST /classes/:id/stream
 *                GET|PATCH|DELETE /classes/:id/stream/:pid  ·  POST /classes/:id/stream/:pid/comments { body }
 *                PATCH /classes/:id/stream-comments/:cid { hidden }  ·  DELETE /classes/:id/stream-comments/:cid
 *   Tệp          POST /classes/:id/stream-files (multipart `file`, ≤ 25 MB)  ·  DELETE /classes/:id/stream-files/:fid (nháp)
 *                GET  /classes/:id/stream-files/:fid/url?inline=1
 *   Tài liệu     GET|POST /classes/:id/materials  ·  GET|PATCH|DELETE /classes/:id/materials/:mid
 *                POST /classes/:id/materials/:mid/view  ·  GET /classes/:id/materials/:mid/viewers
 *                PUT  /classes/:id/materials-order { topicId, ids }
 *                POST /classes/:id/topics  ·  PATCH|DELETE /classes/:id/topics/:tid  ·  PUT /classes/:id/topics-order { ids }
 *   Lịch         GET  /classes/:id/calendar?from=&to=  ·  GET /classes/:id/calendar.ics
 *                POST /classes/:id/schedules  ·  DELETE /classes/:id/schedules/:sid
 *                POST /classes/:id/sessions  ·  PATCH|DELETE /classes/:id/sessions/:sid
 *   Điểm danh    POST|DELETE /classes/:id/sessions/:sid/checkin   mở (bấm lại = mã mới) / đóng
 *                GET|PUT /classes/:id/sessions/:sid/attendance      bảng của buổi / sửa tay { rows }
 *                POST /classes/:id/checkin { code }                 SV nhập mã / quét QR
 *                GET  /classes/:id/attendance (GV) · /classes/:id/attendance/me (SV) · /classes/:id/attendance.xlsx (GV)
 */

import { Router, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as cal from '../services/work/classCalendar.service.js';
import * as mats from '../services/work/classMaterials.service.js';
import * as stream from '../services/work/classStream.service.js';
import { ATTENDANCE_STATUSES, MATERIAL_KINDS } from '../services/work/classStreamRules.js';
import { MAX_COMMENT_FILE_BYTES } from '../services/work/commentFiles.service.js';

const router = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}
const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ success: true, data });
function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  try {
    return schema.parse(value);
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0];
      throw new BadRequestError(`${first?.path.length ? `${first.path.join('.')}: ` : ''}${first?.message ?? 'Invalid input'}`, 'VALIDATION_ERROR');
    }
    throw err;
  }
}
const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);
const C = (req: Request) => P(req, 'id');

function receive(field: string, maxBytes: number) {
  const up = multer({ storage: multer.memoryStorage(), limits: { fileSize: maxBytes, files: 1 } });
  return (req: Request, res: Response, next: NextFunction) => {
    up.single(field)(req, res, (err: unknown) => {
      if (!err) { next(); return; }
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') { next(new AppError('Files must be 25 MB or smaller', 413, 'WORK_FILE_TOO_LARGE')); return; }
      next(new BadRequestError('Could not read the uploaded file', 'WORK_BAD_UPLOAD'));
    });
  };
}
const utf8Name = (n: string) => { try { return Buffer.from(n, 'latin1').toString('utf8'); } catch { return n; } };

// ─── Cài đặt ─────────────────────────────────────────────────────

router.get('/classes/:id/classroom-settings', asyncHandler(async (req, res) => ok(res, await stream.getClassroomSettings(callerId(req), C(req)))));
router.patch('/classes/:id/classroom-settings', asyncHandler(async (req, res) => {
  ok(res, await stream.updateClassroomSettings(callerId(req), C(req), parse(z.object({
    streamComments: z.boolean().optional(), absenceThreshold: z.number().int().min(1).max(100).optional(), lateAfterMin: z.number().int().min(0).max(240).optional(),
  }).strict(), req.body ?? {})));
}));

// ─── Stream ──────────────────────────────────────────────────────

const link = z.object({ url: z.string().min(1).max(2000), title: z.string().max(200).optional() });
const postBody = z.object({
  bodyJson: z.unknown().optional(), title: z.string().max(255).nullable().optional(), links: z.array(link).max(10).optional(),
  fileIds: z.array(id).max(10).optional(), removeFileIds: z.array(id).max(50).optional(), audienceGroupIds: z.array(id).max(200).optional(),
  publishAt: z.string().max(40).nullable().optional(), pinned: z.boolean().optional(), commentsOff: z.boolean().optional(),
}).strict();

router.get('/classes/:id/stream', asyncHandler(async (req, res) => {
  const q = parse(z.object({ before: z.string().max(40).optional(), limit: z.coerce.number().int().min(1).max(100).optional() }), req.query);
  ok(res, await stream.listStream(callerId(req), C(req), q));
}));
router.post('/classes/:id/stream', asyncHandler(async (req, res) => ok(res, await stream.createPost(callerId(req), C(req), parse(postBody, req.body ?? {})), 201)));
router.get('/classes/:id/stream/:pid', asyncHandler(async (req, res) => ok(res, await stream.getPost(callerId(req), C(req), P(req, 'pid')))));
router.patch('/classes/:id/stream/:pid', asyncHandler(async (req, res) => ok(res, await stream.updatePost(callerId(req), C(req), P(req, 'pid'), parse(postBody, req.body ?? {})))));
router.delete('/classes/:id/stream/:pid', asyncHandler(async (req, res) => ok(res, await stream.deletePost(callerId(req), C(req), P(req, 'pid')))));
router.post('/classes/:id/stream/:pid/comments', asyncHandler(async (req, res) => {
  ok(res, await stream.addComment(callerId(req), C(req), P(req, 'pid'), parse(z.object({ body: z.string().min(1).max(4000) }).strict(), req.body ?? {}).body), 201);
}));
router.patch('/classes/:id/stream-comments/:cid', asyncHandler(async (req, res) => {
  ok(res, await stream.setCommentHidden(callerId(req), C(req), P(req, 'cid'), parse(z.object({ hidden: z.boolean() }).strict(), req.body ?? {}).hidden));
}));
router.delete('/classes/:id/stream-comments/:cid', asyncHandler(async (req, res) => ok(res, await stream.deleteComment(callerId(req), C(req), P(req, 'cid')))));

// ─── Tệp ─────────────────────────────────────────────────────────

router.post('/classes/:id/stream-files', receive('file', MAX_COMMENT_FILE_BYTES), asyncHandler(async (req, res) => {
  const f = req.file;
  if (!f?.buffer?.length) throw new BadRequestError('Choose a file', 'WORK_FILE_EMPTY');
  ok(res, await stream.uploadClassFile(callerId(req), C(req), { buffer: f.buffer, fileName: utf8Name(f.originalname || 'file'), mime: f.mimetype }), 201);
}));
router.delete('/classes/:id/stream-files/:fid', asyncHandler(async (req, res) => ok(res, await stream.deleteDraftFile(callerId(req), C(req), P(req, 'fid')))));
router.get('/classes/:id/stream-files/:fid/url', asyncHandler(async (req, res) => {
  ok(res, { url: await stream.classFileUrl(callerId(req), C(req), P(req, 'fid'), req.query.inline === '1') });
}));

// ─── Tài liệu ────────────────────────────────────────────────────

const matBody = z.object({
  topicId: id.nullable().optional(), kind: z.enum(MATERIAL_KINDS).optional(), title: z.string().max(255).optional(),
  description: z.string().max(5000).nullable().optional(), links: z.array(link).max(10).optional(),
  fileIds: z.array(id).max(10).optional(), removeFileIds: z.array(id).max(50).optional(), draft: z.boolean().optional(),
}).strict();
const topicBody = z.object({ title: z.string().max(120).optional(), week: z.number().int().min(0).max(60).nullable().optional() }).strict();

router.get('/classes/:id/materials', asyncHandler(async (req, res) => ok(res, await mats.listMaterials(callerId(req), C(req)))));
router.post('/classes/:id/materials', asyncHandler(async (req, res) => ok(res, await mats.createMaterial(callerId(req), C(req), parse(matBody, req.body ?? {})), 201)));
router.put('/classes/:id/materials-order', asyncHandler(async (req, res) => {
  ok(res, await mats.reorderMaterials(callerId(req), C(req), parse(z.object({ topicId: id.nullable(), ids: z.array(id).max(400) }).strict(), req.body ?? {})));
}));
router.get('/classes/:id/materials/:mid', asyncHandler(async (req, res) => ok(res, await mats.getMaterial(callerId(req), C(req), P(req, 'mid')))));
router.patch('/classes/:id/materials/:mid', asyncHandler(async (req, res) => ok(res, await mats.updateMaterial(callerId(req), C(req), P(req, 'mid'), parse(matBody, req.body ?? {})))));
router.delete('/classes/:id/materials/:mid', asyncHandler(async (req, res) => ok(res, await mats.deleteMaterial(callerId(req), C(req), P(req, 'mid')))));
router.post('/classes/:id/materials/:mid/view', asyncHandler(async (req, res) => ok(res, await mats.markViewed(callerId(req), C(req), P(req, 'mid')))));
router.get('/classes/:id/materials/:mid/viewers', asyncHandler(async (req, res) => ok(res, await mats.materialViewers(callerId(req), C(req), P(req, 'mid')))));
router.post('/classes/:id/topics', asyncHandler(async (req, res) => ok(res, await mats.createTopic(callerId(req), C(req), parse(topicBody, req.body ?? {})), 201)));
router.put('/classes/:id/topics-order', asyncHandler(async (req, res) => {
  ok(res, await mats.reorderTopics(callerId(req), C(req), parse(z.object({ ids: z.array(id).max(60) }).strict(), req.body ?? {}).ids));
}));
router.patch('/classes/:id/topics/:tid', asyncHandler(async (req, res) => ok(res, await mats.updateTopic(callerId(req), C(req), P(req, 'tid'), parse(topicBody, req.body ?? {})))));
router.delete('/classes/:id/topics/:tid', asyncHandler(async (req, res) => ok(res, await mats.deleteTopic(callerId(req), C(req), P(req, 'tid')))));

// ─── Lịch + buổi học ─────────────────────────────────────────────

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const recurrence = z.object({
  freq: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']), interval: z.number().int().min(1).max(12).optional(), byWeekday: z.array(z.number().int().min(0).max(6)).max(7).optional(),
  byMonthDay: z.number().int().min(-1).max(31).nullable().optional(), hour: z.number().int().min(0).max(23), minute: z.number().int().min(0).max(59),
  startDate: day, endDate: day.nullable().optional(),
}).strict();
const sessionBody = z.object({
  title: z.string().max(120).optional(), startsAt: z.string().max(40).optional(), durationMin: z.number().int().min(5).max(600).optional(),
  location: z.string().max(255).nullable().optional(), meetingUrl: z.string().max(500).nullable().optional(), status: z.enum(['SCHEDULED', 'CANCELLED']).optional(),
}).strict();

router.get('/classes/:id/calendar', asyncHandler(async (req, res) => {
  ok(res, await cal.listCalendar(callerId(req), C(req), parse(z.object({ from: day.optional(), to: day.optional() }), req.query)));
}));
router.get('/classes/:id/calendar.ics', asyncHandler(async (req, res) => {
  const out = await cal.classIcs(callerId(req), C(req));
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${out.fileName.replace(/[^\x20-\x7e]/g, '_')}"`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.body);
}));
router.post('/classes/:id/schedules', asyncHandler(async (req, res) => {
  ok(res, await cal.createSeries(callerId(req), C(req), parse(z.object({
    title: z.string().max(120), recurrence, durationMin: z.number().int().min(5).max(600).optional(), location: z.string().max(255).nullable().optional(), meetingUrl: z.string().max(500).nullable().optional(),
  }).strict(), req.body ?? {})), 201);
}));
router.delete('/classes/:id/schedules/:sid', asyncHandler(async (req, res) => ok(res, await cal.deleteSeries(callerId(req), C(req), P(req, 'sid')))));
router.post('/classes/:id/sessions', asyncHandler(async (req, res) => ok(res, await cal.createSession(callerId(req), C(req), parse(sessionBody, req.body ?? {})), 201)));
router.patch('/classes/:id/sessions/:sid', asyncHandler(async (req, res) => ok(res, await cal.updateSession(callerId(req), C(req), P(req, 'sid'), parse(sessionBody, req.body ?? {})))));
router.delete('/classes/:id/sessions/:sid', asyncHandler(async (req, res) => ok(res, await cal.deleteSession(callerId(req), C(req), P(req, 'sid')))));

// ─── Điểm danh ───────────────────────────────────────────────────

router.post('/classes/:id/sessions/:sid/checkin', asyncHandler(async (req, res) => {
  ok(res, await cal.openCheckin(callerId(req), C(req), P(req, 'sid'), parse(z.object({ minutes: z.number().int().min(1).max(30).optional() }).strict(), req.body ?? {})));
}));
router.delete('/classes/:id/sessions/:sid/checkin', asyncHandler(async (req, res) => ok(res, await cal.closeCheckin(callerId(req), C(req), P(req, 'sid')))));
router.get('/classes/:id/sessions/:sid/attendance', asyncHandler(async (req, res) => ok(res, await cal.sessionSheet(callerId(req), C(req), P(req, 'sid')))));
router.put('/classes/:id/sessions/:sid/attendance', asyncHandler(async (req, res) => {
  ok(res, await cal.setAttendance(callerId(req), C(req), P(req, 'sid'), parse(z.object({
    rows: z.array(z.object({ studentId: id, status: z.enum(ATTENDANCE_STATUSES).nullable(), note: z.string().max(255).nullable().optional() }).strict()).min(1).max(500),
  }).strict(), req.body ?? {})));
}));
router.post('/classes/:id/checkin', asyncHandler(async (req, res) => {
  ok(res, await cal.checkin(callerId(req), C(req), parse(z.object({ code: z.string().min(1).max(20) }).strict(), req.body ?? {}).code));
}));
router.get('/classes/:id/attendance', asyncHandler(async (req, res) => ok(res, await cal.attendanceStats(callerId(req), C(req)))));
router.get('/classes/:id/attendance/me', asyncHandler(async (req, res) => ok(res, await cal.myAttendance(callerId(req), C(req)))));
router.get('/classes/:id/attendance.xlsx', asyncHandler(async (req, res) => {
  const out = await cal.exportAttendanceXlsx(callerId(req), C(req));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${out.fileName.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(out.fileName)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.buf);
}));

export default router;
