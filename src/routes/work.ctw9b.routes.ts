/**
 * CT Work — CTW ĐỢT 9b (13/10/2026): LỚP HỌC — BÀI TẬP + NỘP BÀI + TRẢ BÀI + SỔ ĐIỂM. Mọi tuyến sau authenticate (gắn
 * trong work.routes.ts); quyền kiểm TRONG service (classwork / classGradebook). Tuyến top-level `/classes/**` KHÔNG nằm
 * trong danh sách trắng của token agent (agentTopRouteAllowed) ⇒ agent 403; service chặn lần hai (classCtx: agent ⇒ 403
 * cả lệnh đọc). Khách cổng: không có trong danh sách trắng ⇒ 403.
 *
 *   Bài tập (giảng viên ghi, sinh viên đọc bài đã giao cho mình)
 *   GET    /classes/:id/assignments                      danh sách (GV: + nháp/lên lịch + số liệu · SV: + trạng thái của tôi)
 *   POST   /classes/:id/assignments                      tạo { title, description, kind, category, topic, maxPoints, rubricId, dueAt, publish, publishAt, allowLate, latePenaltyPct, latePenaltyMaxPct, targetAll, targetGroupIds, targetStudentIds }
 *   GET    /classes/:id/assignments/:aid                 chi tiết (SV: + bài nộp của tôi, điểm ĐÃ TRẢ)
 *   PATCH  /classes/:id/assignments/:aid · DELETE …
 *   POST   /classes/:id/assignments/:aid/files           multipart `file` (tệp đề) · DELETE …/files/:fid
 *   GET    /classes/:id/files/:fid                       { url } ký sẵn 5 phút (kiểm quyền trước)
 *
 *   Sinh viên nộp
 *   PUT    /classes/:id/assignments/:aid/my              { text?, links? } — bản nháp
 *   POST   /classes/:id/assignments/:aid/my/files        multipart `file` · DELETE …/my/files/:fid
 *   POST   /classes/:id/assignments/:aid/my/turn-in · POST …/my/unsubmit
 *
 *   Giảng viên chấm + trả
 *   GET    /classes/:id/assignments/:aid/submissions                 danh sách theo SV/nhóm
 *   GET    /classes/:id/assignments/:aid/submissions/:owner          một bài (owner = U<userId> | G<groupId>)
 *   PUT    /classes/:id/assignments/:aid/grade                       { ownerKey, points?, scores?, memberPoints?, penaltyPct? } — NHÁP
 *   POST   /classes/:id/assignments/:aid/return                      { ownerKeys[] } — trả theo lô
 *   POST   /classes/:id/submission-comments                          { submissionId? | assignmentId?, body } — riêng tư hai chiều
 *
 *   Sổ điểm
 *   GET    /classes/:id/gradebook · PUT /classes/:id/gradebook/settings { mode, weights, missingAsZero }
 *   GET    /classes/:id/gradebook.xlsx
 *   POST   /classes/:id/gradebook/import/preview  { xlsxBase64? | csv? } — chỉ đọc
 *   POST   /classes/:id/gradebook/import          { …, confirm: true }
 *   GET    /classes/:id/deadlines?from=&to=       hạn bài cho lịch lớp (9a)
 */

import { Router, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as classwork from '../services/work/classwork.service.js';
import * as gradebook from '../services/work/classGradebook.service.js';
import { GRADEBOOK_MODES, MAX_SUBMISSION_FILE_BYTES } from '../services/work/classworkRules.js';

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
const ownerKey = z.string().regex(/^[UG]\d{1,10}$/, 'Bad submission key');

/** Tệp chỉ nằm trong RAM rồi đẩy thẳng lên kho trong service (kiểm cỡ/đuôi/chữ ký ở đó). */
const up = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_SUBMISSION_FILE_BYTES, files: 1 } });
function receive(req: Request, res: Response, next: NextFunction) {
  up.single('file')(req, res, (err: unknown) => {
    if (!err) { next(); return; }
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      next(new AppError(`Files must be ${Math.round(MAX_SUBMISSION_FILE_BYTES / 1024 / 1024)} MB or smaller`, 413, 'WORK_CLASS_FILE_TOO_BIG'));
      return;
    }
    next(new BadRequestError('Could not read the uploaded file', 'WORK_BAD_UPLOAD'));
  });
}
/** multer đọc tên tệp theo latin1 ⇒ trả lại UTF-8 (tên tiếng Việt). */
const utf8Name = (n: string) => { try { return Buffer.from(n, 'latin1').toString('utf8'); } catch { return n; } };
function fileOf(req: Request) {
  const f = req.file;
  if (!f?.buffer?.length) throw new BadRequestError('Choose a file to upload', 'WORK_CLASS_FILE_EMPTY');
  return { buffer: f.buffer, fileName: utf8Name(f.originalname || 'file') };
}

// ─── Bài tập ─────────────────────────────────────────────────────

const isoDate = z.string().max(40);
const assignmentBody = z.object({
  title: z.string().max(200).optional(),
  description: z.record(z.unknown()).nullable().optional(),
  kind: z.enum(['INDIVIDUAL', 'GROUP']).optional(),
  category: z.string().max(40).optional(),
  topic: z.string().max(80).nullable().optional(),
  maxPoints: z.number().positive().max(1000).optional(),
  rubricId: id.nullable().optional(),
  dueAt: isoDate.nullable().optional(),
  publish: z.enum(['NOW', 'SCHEDULE', 'DRAFT']).optional(),
  publishAt: isoDate.nullable().optional(),
  allowLate: z.boolean().optional(),
  latePenaltyPct: z.number().min(0).max(100).optional(),
  latePenaltyMaxPct: z.number().min(0).max(100).optional(),
  targetAll: z.boolean().optional(),
  targetGroupIds: z.array(id).max(200).optional(),
  targetStudentIds: z.array(id).max(500).optional(),
}).strict();

router.get('/classes/:id/assignments', asyncHandler(async (req, res) => ok(res, await classwork.listAssignments(callerId(req), P(req, 'id')))));
router.post('/classes/:id/assignments', asyncHandler(async (req, res) => ok(res, await classwork.createAssignment(callerId(req), P(req, 'id'), parse(assignmentBody, req.body ?? {})), 201)));
router.get('/classes/:id/assignments/:aid', asyncHandler(async (req, res) => ok(res, await classwork.getAssignment(callerId(req), P(req, 'id'), P(req, 'aid')))));
router.patch('/classes/:id/assignments/:aid', asyncHandler(async (req, res) => ok(res, await classwork.updateAssignment(callerId(req), P(req, 'id'), P(req, 'aid'), parse(assignmentBody, req.body ?? {})))));
router.delete('/classes/:id/assignments/:aid', asyncHandler(async (req, res) => { await classwork.deleteAssignment(callerId(req), P(req, 'id'), P(req, 'aid')); ok(res, { deleted: true }); }));
router.post('/classes/:id/assignments/:aid/files', receive, asyncHandler(async (req, res) => ok(res, await classwork.uploadAssignmentFile(callerId(req), P(req, 'id'), P(req, 'aid'), fileOf(req)), 201)));
router.delete('/classes/:id/assignments/:aid/files/:fid', asyncHandler(async (req, res) => { await classwork.removeAssignmentFile(callerId(req), P(req, 'id'), P(req, 'aid'), P(req, 'fid')); ok(res, { deleted: true }); }));
router.get('/classes/:id/files/:fid', asyncHandler(async (req, res) => ok(res, await classwork.fileUrl(callerId(req), P(req, 'id'), P(req, 'fid')))));

// ─── Sinh viên nộp ───────────────────────────────────────────────

const draftBody = z.object({
  text: z.string().max(50_000).nullable().optional(),
  links: z.array(z.union([z.string().max(2000), z.object({ url: z.string().max(2000), label: z.string().max(80).optional() })])).max(20).optional(),
}).strict();

router.put('/classes/:id/assignments/:aid/my', asyncHandler(async (req, res) => ok(res, await classwork.saveDraft(callerId(req), P(req, 'id'), P(req, 'aid'), parse(draftBody, req.body ?? {})))));
router.post('/classes/:id/assignments/:aid/my/files', receive, asyncHandler(async (req, res) => ok(res, await classwork.uploadSubmissionFile(callerId(req), P(req, 'id'), P(req, 'aid'), fileOf(req)), 201)));
router.delete('/classes/:id/assignments/:aid/my/files/:fid', asyncHandler(async (req, res) => { await classwork.removeSubmissionFile(callerId(req), P(req, 'id'), P(req, 'aid'), P(req, 'fid')); ok(res, { deleted: true }); }));
router.post('/classes/:id/assignments/:aid/my/turn-in', asyncHandler(async (req, res) => ok(res, await classwork.turnIn(callerId(req), P(req, 'id'), P(req, 'aid')))));
router.post('/classes/:id/assignments/:aid/my/unsubmit', asyncHandler(async (req, res) => ok(res, await classwork.unsubmit(callerId(req), P(req, 'id'), P(req, 'aid')))));

// ─── Chấm + trả + nhận xét ───────────────────────────────────────

const gradeBody = z.object({
  ownerKey,
  points: z.number().min(0).max(2000).nullable().optional(),
  scores: z.record(z.union([z.number(), z.null()])).optional(),
  memberPoints: z.record(z.union([z.number().min(0).max(2000), z.null()])).optional(),
  penaltyPct: z.number().min(0).max(100).optional(),
}).strict();

router.get('/classes/:id/assignments/:aid/submissions', asyncHandler(async (req, res) => ok(res, await classwork.listSubmissions(callerId(req), P(req, 'id'), P(req, 'aid')))));
router.get('/classes/:id/assignments/:aid/submissions/:owner', asyncHandler(async (req, res) => {
  ok(res, await classwork.getSubmission(callerId(req), P(req, 'id'), P(req, 'aid'), parse(ownerKey, req.params.owner)));
}));
router.put('/classes/:id/assignments/:aid/grade', asyncHandler(async (req, res) => ok(res, await classwork.gradeSubmission(callerId(req), P(req, 'id'), P(req, 'aid'), parse(gradeBody, req.body ?? {})))));
router.post('/classes/:id/assignments/:aid/return', asyncHandler(async (req, res) => {
  ok(res, await classwork.returnSubmissions(callerId(req), P(req, 'id'), P(req, 'aid'), parse(z.object({ ownerKeys: z.array(ownerKey).min(1).max(500) }).strict(), req.body ?? {})));
}));
router.post('/classes/:id/submission-comments', asyncHandler(async (req, res) => {
  ok(res, await classwork.addComment(callerId(req), P(req, 'id'), parse(z.object({ submissionId: id.optional(), assignmentId: id.optional(), body: z.string().min(1).max(4000) }).strict(), req.body ?? {})), 201);
}));

// ─── Sổ điểm ─────────────────────────────────────────────────────

const importBody = z.object({ xlsxBase64: z.string().max(4_200_000).optional(), csv: z.string().max(2_000_000).optional(), confirm: z.boolean().optional() }).strict();

router.get('/classes/:id/gradebook', asyncHandler(async (req, res) => ok(res, await gradebook.gradebook(callerId(req), P(req, 'id')))));
router.put('/classes/:id/gradebook/settings', asyncHandler(async (req, res) => {
  ok(res, await gradebook.updateSettings(callerId(req), P(req, 'id'), parse(z.object({
    mode: z.enum(GRADEBOOK_MODES).optional(), weights: z.record(z.number().min(0).max(100)).optional(), missingAsZero: z.boolean().optional(),
  }).strict(), req.body ?? {})));
}));
router.get('/classes/:id/gradebook.xlsx', asyncHandler(async (req, res) => {
  const out = await gradebook.exportXlsx(callerId(req), P(req, 'id'));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${out.fileName.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(out.fileName)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.buf);
}));
router.post('/classes/:id/gradebook/import/preview', asyncHandler(async (req, res) => ok(res, await gradebook.previewImport(callerId(req), P(req, 'id'), parse(importBody, req.body ?? {})))));
router.post('/classes/:id/gradebook/import', asyncHandler(async (req, res) => ok(res, await gradebook.importGrades(callerId(req), P(req, 'id'), parse(importBody, req.body ?? {})))));

router.get('/classes/:id/deadlines', asyncHandler(async (req, res) => {
  const q = parse(z.object({ from: isoDate.optional(), to: isoDate.optional() }), req.query);
  const from = q.from ? new Date(q.from) : new Date(Date.now() - 31 * 86_400_000);
  const to = q.to ? new Date(q.to) : new Date(Date.now() + 120 * 86_400_000);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) throw new BadRequestError('from/to must be dates', 'VALIDATION_ERROR');
  ok(res, await classwork.assignmentDeadlines(callerId(req), P(req, 'id'), { from, to }));
}));

export default router;
