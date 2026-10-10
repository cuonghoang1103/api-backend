/**
 * CT Work đợt 8c (12/10/2026) — dọn việc treo. Gắn trong work.routes.ts (đã qua apiTokenAuth + authenticate + chốt
 * /projects/:pid + chốt cổng khách + rào agent). Quyền chi tiết TRONG service.
 *
 *   Họp định kỳ    GET  /projects/:pid/meeting-templates
 *                  GET|POST /projects/:pid/meeting-series · GET|PATCH|DELETE /projects/:pid/meeting-series/:sid
 *                  POST /projects/:pid/meetings/:num/apply-template
 *   Cổng khách     POST /projects/:pid/portal/meetings/:num/rsvp            (khách thật được mời; trong danh sách trắng /portal/**)
 *   Sơ đồ          POST /projects/:pid/diagram-renders                      (trình duyệt gửi SVG/PNG vừa vẽ)
 *                  GET  /projects/:pid/diagrams/:n/image.(svg|png)?version=
 *   Phân tích tĩnh POST /projects/:pid/tests/automation/static              (token `tests:write`; SARIF / JaCoCo / lizard CSV)
 *                  GET  /projects/:pid/static-analysis · POST …/findings/:id/(ignore|reopen|issue) · POST …/vg
 *   SWR302         GET|PUT /projects/:pid/swr/estimation · GET /projects/:pid/swr/export/estimation.xlsx       (R13)
 *                  GET /projects/:pid/swr/status-report · GET /projects/:pid/swr/export/status-report.xlsx    (R24)
 *                  GET /projects/:pid/swr/package.zip                                                         (R26)
 *                  POST|DELETE /projects/:pid/swr/elicitation/:elc/ai-stakeholder                             (R28)
 */

import express, { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, UnauthorizedError } from '../middleware/errorHandler.js';
import * as series from '../services/work/meetingSeries.service.js';
import { portalRsvp } from '../services/work/meetings.service.js';
import * as renders from '../services/work/diagramRender.service.js';
import * as stat from '../services/work/staticAnalysis.service.js';
import * as pack from '../services/work/swrPack.service.js';
import { askStakeholder, clearStakeholderTranscript, stakeholderAskInput } from '../services/work/swrElic.service.js';

const router = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}
const ok = (r: Response, data: unknown, status = 200) => r.status(status).json({ success: true, data });
function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  try {
    return schema.parse(value);
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0];
      throw new AppError(`${first?.path.length ? `${first.path.join('.')}: ` : ''}${first?.message ?? 'Invalid input'}`, 400, 'VALIDATION_ERROR');
    }
    throw err;
  }
}
const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);
const MIME_XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
function fileOut(res: Response, out: { buffer: Buffer; file: string }, mime: string) {
  res.setHeader('Content-Type', mime);
  res.setHeader('Content-Disposition', `attachment; filename="${out.file.replace(/[^\w.\- ]+/g, '_')}"`);
  res.setHeader('Cache-Control', 'no-store');
  res.end(out.buffer);
}

// ═══ Họp định kỳ + mẫu ═════════════════════════════════════════════

router.get('/projects/:pid/meeting-templates', asyncHandler(async (_req, res) => ok(res, series.templatesView())));
router.get('/projects/:pid/meeting-series', asyncHandler(async (req, res) => ok(res, await series.listSeries(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/meeting-series', asyncHandler(async (req, res) => ok(res, await series.createSeries(callerId(req), P(req, 'pid'), parse(series.seriesInput, req.body)), 201)));
router.get('/projects/:pid/meeting-series/:sid', asyncHandler(async (req, res) => ok(res, await series.getSeries(callerId(req), P(req, 'pid'), P(req, 'sid')))));
router.patch('/projects/:pid/meeting-series/:sid', asyncHandler(async (req, res) => ok(res, await series.updateSeries(callerId(req), P(req, 'pid'), P(req, 'sid'), parse(series.seriesPatch, req.body ?? {})))));
router.delete('/projects/:pid/meeting-series/:sid', asyncHandler(async (req, res) => {
  const q = parse(z.object({ scope: z.enum(['all', 'following']).default('all'), from: id.optional() }), req.query);
  ok(res, await series.deleteSeries(callerId(req), P(req, 'pid'), P(req, 'sid'), { scope: q.scope, fromMeeting: q.from }));
}));
router.post('/projects/:pid/meetings/:num/apply-template', asyncHandler(async (req, res) => {
  ok(res, await series.applyTemplate(callerId(req), P(req, 'pid'), P(req, 'num'), parse(z.object({ key: z.string().max(24), replace: z.boolean().optional() }), req.body)));
}));

// ═══ Cổng khách: RSVP ═══════════════════════════════════════════════

router.post('/projects/:pid/portal/meetings/:num/rsvp', asyncHandler(async (req, res) => {
  const b = parse(z.object({ rsvp: z.enum(['YES', 'NO', 'MAYBE']), note: z.string().max(300).nullable().optional() }), req.body);
  ok(res, await portalRsvp(callerId(req), P(req, 'pid'), P(req, 'num'), b));
}));

// ═══ Sơ đồ: ảnh vẽ sẵn ═══════════════════════════════════════════════

router.post('/projects/:pid/diagram-renders', express.json({ limit: '8mb' }), asyncHandler(async (req, res) => {
  const b = parse(z.object({ source: z.string().min(1).max(60_000), svg: z.string().max(2_200_000).nullable().optional(), png: z.string().max(5_600_000).nullable().optional() }), req.body);
  ok(res, await renders.putRender(callerId(req), P(req, 'pid'), b), 201);
}));
router.get('/projects/:pid/diagrams/:n/image.:fmt(svg|png)', asyncHandler(async (req, res) => {
  const q = parse(z.object({ version: id.optional(), download: z.enum(['0', '1']).optional() }), req.query);
  const out = await renders.diagramImage(callerId(req), P(req, 'pid'), P(req, 'n'), req.params.fmt === 'svg' ? 'svg' : 'png', q.version);
  res.setHeader('Content-Type', out.mime);
  // SVG đã làm sạch; thêm CSP để mở thẳng trong trình duyệt cũng không chạy được gì.
  res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Disposition', `${q.download === '1' ? 'attachment' : 'inline'}; filename="${out.file}"`);
  res.setHeader('Cache-Control', 'private, max-age=300');
  res.end(out.body);
}));

// ═══ Phân tích tĩnh (T3) + V(G) (T4) ══════════════════════════════

const rawText = express.text({ type: ['application/xml', 'text/xml', 'text/plain', 'text/csv', 'application/octet-stream', 'application/sarif+json'], limit: '15mb' });
const KIND = { sarif: 'SARIF', jacoco: 'JACOCO', lizard: 'LIZARD', auto: 'AUTO' } as const;
const staticQuery = z.object({
  kind: z.enum(['sarif', 'jacoco', 'lizard', 'auto']).optional(),
  build: z.string().max(80).optional(), branch: z.string().max(120).optional(), commit: z.string().max(64).optional(),
  createIssues: z.enum(['true', 'false', '1', '0']).optional(),
});
const staticJson = z.object({
  report: z.union([z.string().max(16_000_000), z.record(z.unknown())]),
  kind: z.enum(['sarif', 'jacoco', 'lizard', 'auto']).optional(),
  build: z.string().max(80).nullable().optional(), branch: z.string().max(120).nullable().optional(), commit: z.string().max(64).nullable().optional(),
  createIssues: z.boolean().optional(),
}).strict();

router.post('/projects/:pid/tests/automation/static', express.json({ limit: '16mb' }), rawText, asyncHandler(async (req, res) => {
  const meta = { source: (req.workToken ? 'API' : 'UPLOAD') as 'API' | 'UPLOAD', tokenId: req.workToken?.id ?? null };
  let input: stat.StaticInput;
  if (typeof req.body === 'string') {
    const q = parse(staticQuery, req.query);
    input = { report: req.body, kind: q.kind ? KIND[q.kind] : 'AUTO', build: q.build, branch: q.branch, commit: q.commit, createIssues: q.createIssues === 'true' || q.createIssues === '1' };
  } else if (req.body && typeof req.body === 'object' && 'runs' in req.body) {
    // Thân là CHÍNH tệp SARIF (curl --data-binary @results.sarif -H 'Content-Type: application/json').
    const q = parse(staticQuery, req.query);
    input = { report: req.body as object, kind: 'SARIF', build: q.build, branch: q.branch, commit: q.commit, createIssues: q.createIssues === 'true' || q.createIssues === '1' };
  } else {
    const b = parse(staticJson, req.body);
    input = { ...b, kind: b.kind ? KIND[b.kind] : 'AUTO' };
  }
  ok(res, await stat.importStatic(callerId(req), P(req, 'pid'), input, meta), 201);
}));
router.get('/projects/:pid/static-analysis', asyncHandler(async (req, res) => {
  const q = parse(z.object({ status: z.enum(['OPEN', 'FIXED', 'IGNORED', 'ISSUE', 'ALL']).optional(), tool: z.string().max(80).optional() }), req.query);
  ok(res, await stat.overview(callerId(req), P(req, 'pid'), q));
}));
router.post('/projects/:pid/static-analysis/findings/:id/:action(ignore|reopen|issue)', asyncHandler(async (req, res) => {
  const a = req.params.action;
  if (a === 'issue') ok(res, await stat.findingToIssue(callerId(req), P(req, 'pid'), P(req, 'id')), 201);
  else ok(res, await stat.setFindingStatus(callerId(req), P(req, 'pid'), P(req, 'id'), a === 'ignore' ? 'IGNORED' : 'OPEN'));
}));
router.post('/projects/:pid/static-analysis/vg', asyncHandler(async (req, res) => {
  const n = z.number().int().min(0).max(100_000);
  ok(res, stat.vgCalculator(parse(z.object({ edges: n.optional(), nodes: n.optional(), components: n.optional(), decisions: n.optional() }), req.body ?? {})));
}));

// ═══ SWR302 ═══════════════════════════════════════════════════════

router.get('/projects/:pid/swr/estimation', asyncHandler(async (req, res) => ok(res, await pack.getEstimation(callerId(req), P(req, 'pid')))));
router.put('/projects/:pid/swr/estimation', asyncHandler(async (req, res) => ok(res, await pack.updateEstimation(callerId(req), P(req, 'pid'), parse(pack.estimationInput, req.body ?? {})))));
router.get('/projects/:pid/swr/export/estimation.xlsx', asyncHandler(async (req, res) => fileOut(res, await pack.exportEstimation(callerId(req), P(req, 'pid')), MIME_XLSX)));
const daysQ = z.object({ days: z.coerce.number().int().min(7).max(365).optional() });
router.get('/projects/:pid/swr/status-report', asyncHandler(async (req, res) => ok(res, await pack.getStatusReport(callerId(req), P(req, 'pid'), parse(daysQ, req.query)))));
router.get('/projects/:pid/swr/export/status-report.xlsx', asyncHandler(async (req, res) => fileOut(res, await pack.exportStatusReport(callerId(req), P(req, 'pid'), parse(daysQ, req.query)), MIME_XLSX)));
router.get('/projects/:pid/swr/package.zip', asyncHandler(async (req, res) => fileOut(res, await pack.buildPackage(callerId(req), P(req, 'pid')), 'application/zip')));
router.post('/projects/:pid/swr/elicitation/:elc/ai-stakeholder', asyncHandler(async (req, res) => {
  ok(res, await askStakeholder(callerId(req), P(req, 'pid'), String(req.params.elc), parse(stakeholderAskInput, req.body)));
}));
router.delete('/projects/:pid/swr/elicitation/:elc/ai-stakeholder', asyncHandler(async (req, res) => {
  ok(res, await clearStakeholderTranscript(callerId(req), P(req, 'pid'), String(req.params.elc)));
}));

export default router;
