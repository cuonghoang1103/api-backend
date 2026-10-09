/**
 * CT Work — CTW ĐỢT 5 (10/10/2026): GIẢNG VIÊN & LỚP HỌC. Mọi tuyến sau authenticate (gắn trong work.routes.ts); quyền kiểm
 * TRONG service (teaching / classroom / recurring). Tuyến top-level (/teaching, /classes) KHÔNG nằm trong danh sách trắng của
 * token agent (agentTopRouteAllowed) ⇒ agent 403; tuyến dự án đi qua chốt `/projects/:pid` (agent: /grades + /automation
 * bị chặn; khách cổng: không có trong danh sách trắng ⇒ 403 CLIENT_PORTAL_ONLY).
 *
 *   Hub giảng viên
 *   GET    /teaching/access                                  { teaching, projects, classes } — để hiện link ở thanh bên
 *   GET    /teaching/overview?subject=&classCode=&term=&q=   các nhóm + sức khoẻ (403 WORK_TEACHING_ONLY nếu không dạy)
 *   GET    /teaching/overview.xlsx · /teaching/overview.pdf
 *   POST   /teaching/ai-summary                              { subject?, classCode?, term?, language? }
 *   GET|POST /teaching/rubrics · PATCH|DELETE /teaching/rubrics/:id
 *
 *   Lớp học
 *   GET    /classes                                          lớp tôi dạy / tôi học
 *   POST   /classes                                          tạo lớp
 *   GET    /classes/join/:code                               xem trước lớp theo mã (429 khi dò mã)
 *   POST   /classes/join/:code                               { action: JOIN | JOIN_GROUP | CREATE_GROUP | TEACH, groupId?, groupName?, projectKey?, studentCode? }
 *   GET|PATCH /classes/:id · POST /classes/:id/join-code
 *   POST   /classes/:id/roster/preview                       { csv? | xlsxBase64? } — chỉ đọc
 *   POST   /classes/:id/roster/import                        { csv? | xlsxBase64?, confirm: true }
 *   POST   /classes/:id/roster/invite                        { studentIds?, confirm? } — không confirm ⇒ chỉ xem trước
 *   DELETE /classes/:id/roster/:sid
 *
 *   Dự án
 *   GET    /projects/:pid/week1                              checklist "Tuần 1 làm gì"
 *   GET    /projects/:pid/grades · PUT /projects/:pid/grades · POST /projects/:pid/grades/publish
 *   GET    /projects/:pid/grades/:gid/history · DELETE /projects/:pid/grades/:gid
 *   GET|POST /projects/:pid/automation/recurring · PATCH|DELETE /projects/:pid/automation/recurring/:id
 *   POST   /projects/:pid/automation/recurring/preview · PUT /projects/:pid/automation/recurring/timezone
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as classroom from '../services/work/classroom.service.js';
import * as recurring from '../services/work/recurring.service.js';
import * as teaching from '../services/work/teaching.service.js';
import { CLASS_SUBJECTS } from '../services/work/teachingRules.js';

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
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const fileOut = (res: Response, out: { buf: Buffer; fileName: string }, type: string) => {
  res.setHeader('Content-Type', type);
  res.setHeader('Content-Disposition', `attachment; filename="${out.fileName.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(out.fileName)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.buf);
};

// ─── Hub giảng viên ──────────────────────────────────────────────

const filterQ = z.object({
  subject: z.string().max(16).optional(), classCode: z.string().max(32).optional(), term: z.string().max(16).optional(), q: z.string().max(100).optional(),
});

router.get('/teaching/access', asyncHandler(async (req, res) => ok(res, await teaching.teachingAccess(callerId(req)))));
router.get('/teaching/overview', asyncHandler(async (req, res) => ok(res, await teaching.overview(callerId(req), parse(filterQ, req.query)))));
router.get('/teaching/overview.xlsx', asyncHandler(async (req, res) => {
  fileOut(res, await teaching.exportOverviewXlsx(callerId(req), parse(filterQ, req.query)), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}));
router.get('/teaching/overview.pdf', asyncHandler(async (req, res) => {
  fileOut(res, await teaching.exportOverviewPdf(callerId(req), parse(filterQ, req.query)), 'application/pdf');
}));
router.post('/teaching/ai-summary', asyncHandler(async (req, res) => {
  ok(res, await teaching.aiSummary(callerId(req), parse(filterQ.extend({ language: z.enum(['en', 'vi']).optional() }), req.body ?? {})));
}));

const level = z.object({ score: z.number().min(0).max(100), label: z.string().max(60).default(''), description: z.string().max(500).default('') });
const criterion = z.object({ key: z.string().max(32).optional(), name: z.string().min(1).max(120), weight: z.number(), description: z.string().max(1000).default(''), levels: z.array(level).max(8).default([]) });
const rubricBody = z.object({
  templateKey: z.string().max(32).optional(), name: z.string().max(120).optional(), subject: z.string().max(16).nullable().optional(),
  description: z.string().max(4000).nullable().optional(), criteria: z.array(criterion).max(20).optional(), scaleMax: z.number().positive().max(100).optional(),
}).strict();

router.get('/teaching/rubrics', asyncHandler(async (req, res) => ok(res, await teaching.listRubrics(callerId(req)))));
router.post('/teaching/rubrics', asyncHandler(async (req, res) => ok(res, await teaching.createRubric(callerId(req), parse(rubricBody, req.body ?? {})), 201)));
router.patch('/teaching/rubrics/:id', asyncHandler(async (req, res) => ok(res, await teaching.updateRubric(callerId(req), P(req, 'id'), parse(rubricBody, req.body ?? {})))));
router.delete('/teaching/rubrics/:id', asyncHandler(async (req, res) => { await teaching.archiveRubric(callerId(req), P(req, 'id')); ok(res, { archived: true }); }));

// ─── Lớp học ─────────────────────────────────────────────────────

const classBody = z.object({
  name: z.string().max(120).nullable().optional(), subject: z.enum(CLASS_SUBJECTS), classCode: z.string().min(1).max(32), term: z.string().min(1).max(16),
  iAmTeacher: z.boolean().optional(), teacherEmail: z.string().max(100).nullable().optional(), maxGroupSize: z.number().int().min(1).max(10).optional(),
  joinExpiresInDays: z.number().int().min(1).max(180).nullable().optional(), week1Start: day.nullable().optional(), timezone: z.string().max(64).nullable().optional(),
}).strict();
const classPatch = z.object({
  name: z.string().max(120).optional(), maxGroupSize: z.number().int().min(1).max(10).optional(), joinOpen: z.boolean().optional(),
  teacherEmail: z.string().max(100).nullable().optional(), week1Start: day.nullable().optional(), archived: z.boolean().optional(), timezone: z.string().max(64).optional(),
}).strict();
const joinBody = z.object({
  action: z.enum(['JOIN', 'JOIN_GROUP', 'CREATE_GROUP', 'TEACH']), groupId: id.optional(), groupName: z.string().max(80).optional(),
  projectKey: z.string().max(10).optional(), studentCode: z.string().max(20).optional(),
}).strict();
const rosterSrc = z.object({ csv: z.string().max(1_000_000).optional(), xlsxBase64: z.string().max(3_000_000).optional(), confirm: z.boolean().optional() }).strict();
const code = (req: Request) => parse(z.string().min(1).max(32), req.params.code);

router.get('/classes', asyncHandler(async (req, res) => ok(res, await classroom.listMyClasses(callerId(req)))));
router.post('/classes', asyncHandler(async (req, res) => ok(res, await classroom.createClass(callerId(req), parse(classBody, req.body ?? {})), 201)));
router.get('/classes/join/:code', asyncHandler(async (req, res) => ok(res, await classroom.previewJoin(callerId(req), code(req)))));
router.post('/classes/join/:code', asyncHandler(async (req, res) => ok(res, await classroom.joinClass(callerId(req), code(req), parse(joinBody, req.body ?? {})))));
router.get('/classes/:id', asyncHandler(async (req, res) => ok(res, await classroom.getClass(callerId(req), P(req, 'id')))));
router.patch('/classes/:id', asyncHandler(async (req, res) => ok(res, await classroom.updateClass(callerId(req), P(req, 'id'), parse(classPatch, req.body ?? {})))));
router.post('/classes/:id/join-code', asyncHandler(async (req, res) => {
  ok(res, await classroom.regenerateJoinCode(callerId(req), P(req, 'id'), parse(z.object({ expiresInDays: z.number().int().min(1).max(180).nullable().optional() }).strict(), req.body ?? {})));
}));
router.post('/classes/:id/roster/preview', asyncHandler(async (req, res) => ok(res, await classroom.previewRoster(callerId(req), P(req, 'id'), parse(rosterSrc, req.body ?? {})))));
router.post('/classes/:id/roster/import', asyncHandler(async (req, res) => ok(res, await classroom.importRoster(callerId(req), P(req, 'id'), parse(rosterSrc, req.body ?? {})))));
router.post('/classes/:id/roster/invite', asyncHandler(async (req, res) => {
  ok(res, await classroom.inviteRoster(callerId(req), P(req, 'id'), parse(z.object({ studentIds: z.array(id).max(500).optional(), confirm: z.boolean().optional() }).strict(), req.body ?? {})));
}));
router.delete('/classes/:id/roster/:sid', asyncHandler(async (req, res) => { await classroom.removeStudent(callerId(req), P(req, 'id'), P(req, 'sid')); ok(res, { removed: true }); }));

// ─── Dự án: tuần 1 · điểm · việc định kỳ ─────────────────────────

router.get('/projects/:pid/week1', asyncHandler(async (req, res) => ok(res, await classroom.week1(callerId(req), P(req, 'pid')))));

const gradeBody = z.object({
  rubricId: id, milestone: z.string().min(1).max(80), stageId: id.nullable().optional(), subjectUserId: id.nullable().optional(),
  scores: z.record(z.union([z.number(), z.null()])), notes: z.record(z.string().max(2000)).optional(), comment: z.string().max(8000).nullable().optional(),
  publish: z.boolean().optional(),
}).strict();

router.get('/projects/:pid/grades', asyncHandler(async (req, res) => ok(res, await teaching.gradesView(callerId(req), P(req, 'pid')))));
router.put('/projects/:pid/grades', asyncHandler(async (req, res) => ok(res, await teaching.saveGrade(callerId(req), P(req, 'pid'), parse(gradeBody, req.body ?? {})))));
router.post('/projects/:pid/grades/publish', asyncHandler(async (req, res) => {
  ok(res, await teaching.setPublished(callerId(req), P(req, 'pid'), parse(z.object({ ids: z.array(id).min(1).max(200), published: z.boolean() }).strict(), req.body ?? {})));
}));
router.get('/projects/:pid/grades/:gid/history', asyncHandler(async (req, res) => ok(res, await teaching.gradeHistory(callerId(req), P(req, 'pid'), P(req, 'gid')))));
router.delete('/projects/:pid/grades/:gid', asyncHandler(async (req, res) => { await teaching.deleteGrade(callerId(req), P(req, 'pid'), P(req, 'gid')); ok(res, { deleted: true }); }));

const recurrence = z.object({
  freq: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']), interval: z.number().int().min(1).max(12).optional(), byWeekday: z.array(z.number().int().min(0).max(6)).max(7).optional(),
  byMonthDay: z.number().int().min(-1).max(31).nullable().optional(), hour: z.number().int().min(0).max(23).optional(), minute: z.number().int().min(0).max(59).optional(),
  startDate: day, endDate: day.nullable().optional(),
}).strict();
const recurringIssue = z.object({
  title: z.string().min(1).max(255), typeId: id, description: z.string().max(4000).nullable().optional(), assigneeId: id.nullable().optional(),
  priority: z.number().int().min(1).max(5).nullable().optional(), labelIds: z.array(id).max(10).optional(), dueInDays: z.number().int().min(0).max(60).nullable().optional(),
  addToActiveSprint: z.boolean().optional(),
}).strict();
const recurringBody = z.object({ name: z.string().min(1).max(100), enabled: z.boolean().optional(), recurrence, issue: recurringIssue }).strict();

router.get('/projects/:pid/automation/recurring', asyncHandler(async (req, res) => ok(res, await recurring.listRecurring(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/automation/recurring/preview', asyncHandler(async (req, res) => {
  ok(res, await recurring.previewRecurring(callerId(req), P(req, 'pid'), parse(z.object({ recurrence, title: z.string().max(255).optional() }).strict(), req.body ?? {})));
}));
router.put('/projects/:pid/automation/recurring/timezone', asyncHandler(async (req, res) => {
  ok(res, await recurring.setProjectTimezone(callerId(req), P(req, 'pid'), parse(z.object({ timezone: z.string().min(1).max(64) }).strict(), req.body ?? {}).timezone));
}));
router.post('/projects/:pid/automation/recurring', asyncHandler(async (req, res) => ok(res, await recurring.saveRecurring(callerId(req), P(req, 'pid'), parse(recurringBody, req.body ?? {})), 201)));
router.patch('/projects/:pid/automation/recurring/:id', asyncHandler(async (req, res) => {
  ok(res, await recurring.saveRecurring(callerId(req), P(req, 'pid'), { ...parse(recurringBody, req.body ?? {}), id: P(req, 'id') }));
}));
router.delete('/projects/:pid/automation/recurring/:id', asyncHandler(async (req, res) => { await recurring.deleteRecurring(callerId(req), P(req, 'pid'), P(req, 'id')); ok(res, { deleted: true }); }));

export default router;
