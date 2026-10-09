/**
 * CT Work — CTW đợt 4 (09/10/2026): SRS CÓ CẤU TRÚC & TRUY VẾT. Gắn vào work.routes.ts bằng MỘT dòng `router.use` ở cuối
 * (sau authenticate + chốt cổng khách + khoá chỉnh sửa) ⇒ khách bị cách ly không gọi được tuyến nào ở đây.
 *
 *   SRS (A6+A7)   GET  /projects/:pid/srs                                  toàn bộ actor/UC/BR/màn/phân quyền/Non-UI
 *                 POST|PATCH|DELETE /srs/actors[/:id] · /srs/use-cases[/:n] · /srs/rules[/:n] · /srs/screens[/:id] · /srs/functions[/:id]
 *                 POST /srs/use-cases/:n/status {status}   PUT /srs/screen-auth {screenId, actorId, allowed}
 *                 POST /srs/suggest {issueNumber}  (AI ⇒ UC PROPOSED)   POST /srs/proposals/discard
 *                 POST /pages/:num/fill-srs {version?, sections?}      (điền trang Report 3 — một phiên bản mới)
 *                 GET  /srs/report3 (nội dung sẽ xuất, để client vẽ Mermaid) · POST /srs/report3/export {format, diagrams}
 *                 GET  /srs/report3/export.(docx|pdf)
 *   RTM (A19)     GET  /rtm?gap=&status=&q=&kind=   GET /rtm/export.xlsx   GET|POST /trace-links   DELETE /trace-links/:id
 *   Defect (A16)  GET|PUT /issues/:num/defect   GET /defects   POST /spec-reviews/:rid/findings/:fid/bug
 *   Q&A (A22)     GET|POST /qna   GET|PATCH|DELETE /qna/:n   POST /qna/:n/convert
 *   Report 7 (A18) GET /final-report · POST /final-report/assemble · POST /final-report/export · GET /final-report/export.(docx|pdf)
 *   Time (A24)    GET /issues/:num/worklog-defaults · PATCH /issues/:num/worklogs/:logId · GET /reports/time-by-activity
 *
 * Quyền kiểm TRONG service — route chỉ kiểm đầu vào.
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as defects from '../services/work/defects.service.js';
import * as final from '../services/work/finalReport.service.js';
import * as qna from '../services/work/qna.service.js';
import * as rtm from '../services/work/rtm.service.js';
import { SRS_FILL_SECTIONS } from '../services/work/srs.js';
import * as srs from '../services/work/srs.service.js';
import * as time from '../services/work/timeActivity.service.js';

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
const version = z.object({ version: z.number().int().min(0).optional() });
const fileOut = (res: Response, out: { buffer: Buffer; file: string }, type: string) => {
  res.setHeader('Content-Type', type);
  res.setHeader('Content-Disposition', `attachment; filename="${out.file.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(out.file)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.buffer);
};
const MIME = { docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', pdf: 'application/pdf', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' } as const;
const exportBody = z.object({ format: z.enum(['docx', 'pdf']), diagrams: z.array(z.string().max(6_000_000).nullable()).max(60).optional() });

// ─── SRS ─────────────────────────────────────────────────────────

router.get('/projects/:pid/srs', asyncHandler(async (req, res) => ok(res, await srs.getSrs(callerId(req), P(req, 'pid')))));

router.post('/projects/:pid/srs/actors', asyncHandler(async (req, res) => ok(res, await srs.createActor(callerId(req), P(req, 'pid'), parse(srs.actorInput, req.body)), 201)));
router.patch('/projects/:pid/srs/actors/:id', asyncHandler(async (req, res) => ok(res, await srs.updateActor(callerId(req), P(req, 'pid'), P(req, 'id'), parse(srs.actorInput.partial(), req.body ?? {})))));
router.delete('/projects/:pid/srs/actors/:id', asyncHandler(async (req, res) => ok(res, await srs.deleteActor(callerId(req), P(req, 'pid'), P(req, 'id')))));

router.get('/projects/:pid/srs/use-cases/:n', asyncHandler(async (req, res) => ok(res, await srs.getUseCase(callerId(req), P(req, 'pid'), P(req, 'n')))));
router.post('/projects/:pid/srs/use-cases', asyncHandler(async (req, res) => ok(res, await srs.createUseCase(callerId(req), P(req, 'pid'), parse(srs.useCaseInput, req.body)), 201)));
router.patch('/projects/:pid/srs/use-cases/:n', asyncHandler(async (req, res) => ok(res, await srs.updateUseCase(callerId(req), P(req, 'pid'), P(req, 'n'), parse(srs.useCaseInput.partial().merge(version), req.body ?? {})))));
router.delete('/projects/:pid/srs/use-cases/:n', asyncHandler(async (req, res) => ok(res, await srs.deleteUseCase(callerId(req), P(req, 'pid'), P(req, 'n')))));
router.post('/projects/:pid/srs/use-cases/:n/status', asyncHandler(async (req, res) => {
  const body = parse(z.object({ status: z.enum(['DRAFT', 'APPROVED']) }), req.body);
  ok(res, await srs.setUseCaseStatus(callerId(req), P(req, 'pid'), P(req, 'n'), body.status));
}));

router.post('/projects/:pid/srs/rules', asyncHandler(async (req, res) => ok(res, await srs.createRule(callerId(req), P(req, 'pid'), parse(srs.ruleInput, req.body)), 201)));
router.patch('/projects/:pid/srs/rules/:n', asyncHandler(async (req, res) => ok(res, await srs.updateRule(callerId(req), P(req, 'pid'), P(req, 'n'), parse(srs.ruleInput.partial().merge(version), req.body ?? {})))));
router.delete('/projects/:pid/srs/rules/:n', asyncHandler(async (req, res) => ok(res, await srs.deleteRule(callerId(req), P(req, 'pid'), P(req, 'n')))));

router.post('/projects/:pid/srs/screens', asyncHandler(async (req, res) => ok(res, await srs.createScreen(callerId(req), P(req, 'pid'), parse(srs.screenInput, req.body)), 201)));
router.patch('/projects/:pid/srs/screens/:id', asyncHandler(async (req, res) => ok(res, await srs.updateScreen(callerId(req), P(req, 'pid'), P(req, 'id'), parse(srs.screenInput.partial(), req.body ?? {})))));
router.delete('/projects/:pid/srs/screens/:id', asyncHandler(async (req, res) => ok(res, await srs.deleteScreen(callerId(req), P(req, 'pid'), P(req, 'id')))));
router.put('/projects/:pid/srs/screen-auth', asyncHandler(async (req, res) => {
  const body = parse(z.object({ screenId: id, actorId: id, allowed: z.boolean() }), req.body);
  ok(res, await srs.setScreenAuth(callerId(req), P(req, 'pid'), body));
}));

router.post('/projects/:pid/srs/functions', asyncHandler(async (req, res) => ok(res, await srs.createFunction(callerId(req), P(req, 'pid'), parse(srs.functionInput, req.body)), 201)));
router.patch('/projects/:pid/srs/functions/:id', asyncHandler(async (req, res) => ok(res, await srs.updateFunction(callerId(req), P(req, 'pid'), P(req, 'id'), parse(srs.functionInput.partial(), req.body ?? {})))));
router.delete('/projects/:pid/srs/functions/:id', asyncHandler(async (req, res) => ok(res, await srs.deleteFunction(callerId(req), P(req, 'pid'), P(req, 'id')))));

router.post('/projects/:pid/srs/suggest', asyncHandler(async (req, res) => {
  const body = parse(z.object({ issueNumber: id }), req.body);
  ok(res, await srs.suggestUseCases(callerId(req), P(req, 'pid'), body), 201);
}));
router.post('/projects/:pid/srs/proposals/discard', asyncHandler(async (req, res) => ok(res, await srs.discardProposals(callerId(req), P(req, 'pid')))));

router.post('/projects/:pid/pages/:num/fill-srs', asyncHandler(async (req, res) => {
  const body = parse(z.object({ version: z.number().int().nonnegative().optional(), sections: z.array(z.enum(SRS_FILL_SECTIONS)).max(10).optional() }), req.body ?? {});
  ok(res, await srs.fillReport3Page(callerId(req), P(req, 'pid'), P(req, 'num'), body));
}));
router.get('/projects/:pid/srs/report3', asyncHandler(async (req, res) => ok(res, await srs.report3Doc(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/srs/report3/export', asyncHandler(async (req, res) => {
  const body = parse(exportBody, req.body);
  fileOut(res, await srs.exportReport3(callerId(req), P(req, 'pid'), body), MIME[body.format]);
}));
router.get('/projects/:pid/srs/report3/export.:fmt(docx|pdf)', asyncHandler(async (req, res) => {
  const fmt = parse(z.enum(['docx', 'pdf']), req.params.fmt);
  fileOut(res, await srs.exportReport3(callerId(req), P(req, 'pid'), { format: fmt }), MIME[fmt]);
}));

// ─── RTM ─────────────────────────────────────────────────────────

router.get('/projects/:pid/rtm', asyncHandler(async (req, res) => ok(res, await rtm.getRtm(callerId(req), P(req, 'pid'), parse(rtm.rtmQuery, req.query)))));
router.get('/projects/:pid/rtm/export.xlsx', asyncHandler(async (req, res) => fileOut(res, await rtm.exportRtm(callerId(req), P(req, 'pid')), MIME.xlsx)));
router.get('/projects/:pid/trace-links', asyncHandler(async (req, res) => {
  const q = parse(z.object({ kind: z.enum(['UC', 'ISSUE', 'BR']).optional(), ref: z.string().max(30).optional() }), req.query);
  ok(res, await rtm.listTraceLinks(callerId(req), P(req, 'pid'), q.kind && q.ref ? { kind: q.kind, ref: q.ref } : undefined));
}));
router.post('/projects/:pid/trace-links', asyncHandler(async (req, res) => ok(res, await rtm.addTraceLink(callerId(req), P(req, 'pid'), parse(rtm.traceInput, req.body)), 201)));
router.delete('/projects/:pid/trace-links/:id', asyncHandler(async (req, res) => ok(res, await rtm.removeTraceLink(callerId(req), P(req, 'pid'), P(req, 'id')))));

// ─── Defect log ──────────────────────────────────────────────────

router.get('/projects/:pid/issues/:num/defect', asyncHandler(async (req, res) => ok(res, await defects.getDefect(callerId(req), P(req, 'pid'), P(req, 'num')))));
router.put('/projects/:pid/issues/:num/defect', asyncHandler(async (req, res) => ok(res, await defects.setDefect(callerId(req), P(req, 'pid'), P(req, 'num'), parse(defects.defectInput, req.body ?? {})))));
router.get('/projects/:pid/defects', asyncHandler(async (req, res) => {
  const q = parse(z.object({ severity: z.string().max(10).optional(), open: z.enum(['true', 'false']).optional() }), req.query);
  ok(res, await defects.defectLog(callerId(req), P(req, 'pid'), { severity: q.severity, open: q.open === 'true' }));
}));
router.post('/projects/:pid/spec-reviews/:rid/findings/:fid/bug', asyncHandler(async (req, res) => {
  const fid = parse(z.string().regex(/^[ar]\d{1,4}$/), req.params.fid);
  const r = await defects.bugFromFinding(callerId(req), P(req, 'pid'), P(req, 'rid'), fid);
  ok(res, r, r.created ? 201 : 200);
}));

// ─── Q&A log ─────────────────────────────────────────────────────

router.get('/projects/:pid/qna', asyncHandler(async (req, res) => {
  const q = parse(z.object({ status: z.enum(['open', 'closed', 'all']).optional() }), req.query);
  ok(res, await qna.listQuestions(callerId(req), P(req, 'pid'), q));
}));
router.post('/projects/:pid/qna', asyncHandler(async (req, res) => ok(res, await qna.createQuestion(callerId(req), P(req, 'pid'), parse(qna.questionInput, req.body)), 201)));
router.get('/projects/:pid/qna/:n', asyncHandler(async (req, res) => ok(res, await qna.getQuestion(callerId(req), P(req, 'pid'), P(req, 'n')))));
router.patch('/projects/:pid/qna/:n', asyncHandler(async (req, res) => ok(res, await qna.updateQuestion(callerId(req), P(req, 'pid'), P(req, 'n'), parse(qna.questionInput.partial().merge(version), req.body ?? {})))));
router.delete('/projects/:pid/qna/:n', asyncHandler(async (req, res) => ok(res, await qna.deleteQuestion(callerId(req), P(req, 'pid'), P(req, 'n')))));
router.post('/projects/:pid/qna/:n/convert', asyncHandler(async (req, res) => ok(res, await qna.convertLegacy(callerId(req), P(req, 'pid'), P(req, 'n')))));

// ─── Report 7 Final ──────────────────────────────────────────────

router.get('/projects/:pid/final-report', asyncHandler(async (req, res) => ok(res, await final.finalDoc(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/final-report/assemble', asyncHandler(async (req, res) => ok(res, await final.assembleFinalPage(callerId(req), P(req, 'pid'), parse(z.object({ version: z.number().int().nonnegative().optional() }), req.body ?? {})))));
router.post('/projects/:pid/final-report/export', asyncHandler(async (req, res) => {
  const body = parse(exportBody, req.body);
  fileOut(res, await final.exportFinal(callerId(req), P(req, 'pid'), body), MIME[body.format]);
}));
router.get('/projects/:pid/final-report/export.:fmt(docx|pdf)', asyncHandler(async (req, res) => {
  const fmt = parse(z.enum(['docx', 'pdf']), req.params.fmt);
  fileOut(res, await final.exportFinal(callerId(req), P(req, 'pid'), { format: fmt }), MIME[fmt]);
}));

// ─── Ghi giờ theo Activity ───────────────────────────────────────

router.get('/projects/:pid/issues/:num/worklog-defaults', asyncHandler(async (req, res) => ok(res, await time.worklogDefaults(callerId(req), P(req, 'pid'), P(req, 'num')))));
router.patch('/projects/:pid/issues/:num/worklogs/:logId', asyncHandler(async (req, res) => ok(res, await time.setWorklogMeta(callerId(req), P(req, 'pid'), P(req, 'num'), P(req, 'logId'), parse(time.worklogMetaInput, req.body ?? {})))));
router.get('/projects/:pid/reports/time-by-activity', asyncHandler(async (req, res) => {
  const q = parse(z.object({ from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }), req.query);
  ok(res, await time.hoursByActivity(callerId(req), P(req, 'pid'), q));
}));

export default router;
