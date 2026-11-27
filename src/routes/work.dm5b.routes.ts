/**
 * CT Work — dm5 G2 (27/11/2026): hồ sơ SRS/SDS/Report 2-3-4-6-7 & truy vết. Gắn vào work.routes.ts bằng MỘT dòng `router.use`
 * (sau authenticate + chốt cổng khách + khoá chỉnh sửa) ⇒ khách bị cách ly không gọi được tuyến nào ở đây.
 *
 *   SM (B9)        GET|POST /projects/:pid/srs/messages · PATCH|DELETE /srs/messages/:ref (SM-03 | 3)
 *   SDS (B16/B17)  GET /sds/db-design?diagram=&fromRepo= · POST /sds/db-design/fill · POST /sds/report4/fill {parts, diagram, fromRepo}
 *   Report 6 (B20) POST /report6/fill {page?, version?}
 *   Report 7 (B19) GET /final-report/checks
 *   Nộp (B14)      GET /submit-check
 *   ADR (B15)      POST /pages/:num/adr/supersede {by}
 *   Q&A (B5)       POST /swr/elicitation/:ref/questions/:qid/qna {targetRef?, askedTo?, due?, proposal?}
 *   RACI (B2)      POST /swr/stakeholders/seed-hats · POST /swr/raci/activities/preset {preset: requirements|report2}
 *   PlantUML (B18) POST /diagrams/plantuml/render {source} ⇒ SVG · GET /diagrams/:n/plantuml.svg · POST /diagrams/import-repo {path}
 *
 * Quyền kiểm TRONG service — route chỉ kiểm đầu vào.
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as dm5b from '../services/work/dm5b.service.js';
import * as final from '../services/work/finalReport.service.js';
import * as sds from '../services/work/sds.service.js';
import * as sm from '../services/work/srsMessages.service.js';
import * as elic from '../services/work/swrElic.service.js';
import * as dgx from '../services/work/plantumlDiagrams.service.js';

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
const ref = (req: Request, name: string) => parse(z.string().trim().min(1).max(12), req.params[name]);
const version = z.number().int().nonnegative().optional();
const dateArg = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

// ─── System Messages ─────────────────────────────────────────────

router.get('/projects/:pid/srs/messages', asyncHandler(async (req, res) => ok(res, await sm.listSystemMessages(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/srs/messages', asyncHandler(async (req, res) => ok(res, await sm.createSystemMessage(callerId(req), P(req, 'pid'), parse(sm.systemMessageInput, req.body)), 201)));
router.patch('/projects/:pid/srs/messages/:ref', asyncHandler(async (req, res) => ok(res, await sm.updateSystemMessage(callerId(req), P(req, 'pid'), ref(req, 'ref'), parse(sm.systemMessageInput.partial().extend({ version: z.number().int().min(0).optional() }), req.body ?? {})))));
router.delete('/projects/:pid/srs/messages/:ref', asyncHandler(async (req, res) => ok(res, await sm.deleteSystemMessage(callerId(req), P(req, 'pid'), ref(req, 'ref')))));

// ─── Report 4 (SDS) ──────────────────────────────────────────────

const dbSource = z.object({ diagram: z.coerce.number().int().positive().nullable().optional(), fromRepo: z.union([z.boolean(), z.enum(['true', 'false', '1', '0'])]).optional() });
const truthy = (v: unknown) => v === true || v === 'true' || v === '1';
router.get('/projects/:pid/sds/db-design', asyncHandler(async (req, res) => {
  const q = parse(dbSource, req.query);
  ok(res, await sds.dbDesign(callerId(req), P(req, 'pid'), { diagram: q.diagram ?? null, fromRepo: truthy(q.fromRepo) }));
}));
router.post('/projects/:pid/sds/db-design/fill', asyncHandler(async (req, res) => {
  const b = parse(dbSource.extend({ page: z.number().int().positive().nullable().optional(), version }), req.body ?? {});
  ok(res, await sds.fillDbDesignPage(callerId(req), P(req, 'pid'), { diagram: b.diagram ?? null, fromRepo: truthy(b.fromRepo), page: b.page ?? null, version: b.version }));
}));
router.post('/projects/:pid/sds/report4/fill', asyncHandler(async (req, res) => {
  const b = parse(dbSource.extend({ parts: z.array(z.enum(sds.REPORT4_PARTS)).max(3).optional(), page: z.number().int().positive().nullable().optional(), version }), req.body ?? {});
  ok(res, await sds.fillReport4(callerId(req), P(req, 'pid'), { parts: b.parts, diagram: b.diagram ?? null, fromRepo: truthy(b.fromRepo), page: b.page ?? null, version: b.version }));
}));

// ─── Report 6 · Report 7 · soát trước nộp ────────────────────────

router.post('/projects/:pid/report6/fill', asyncHandler(async (req, res) => {
  const b = parse(z.object({ page: z.number().int().positive().nullable().optional(), version }), req.body ?? {});
  ok(res, await dm5b.fillReport6(callerId(req), P(req, 'pid'), { page: b.page ?? null, version: b.version }));
}));
router.get('/projects/:pid/final-report/checks', asyncHandler(async (req, res) => ok(res, await final.checkFinal(callerId(req), P(req, 'pid')))));
router.get('/projects/:pid/submit-check', asyncHandler(async (req, res) => ok(res, await dm5b.submitCheck(callerId(req), P(req, 'pid')))));

// ─── ADR ─────────────────────────────────────────────────────────

router.post('/projects/:pid/pages/:num/adr/supersede', asyncHandler(async (req, res) => {
  const b = parse(z.object({ by: z.number().int().positive() }), req.body);
  ok(res, await dm5b.supersedeAdr(callerId(req), P(req, 'pid'), P(req, 'num'), b.by));
}));

// ─── Elicitation → Q&A · RACI theo vai ───────────────────────────

router.post('/projects/:pid/swr/elicitation/:ref/questions/:qid/qna', asyncHandler(async (req, res) => {
  const b = parse(z.object({ targetRef: z.string().max(60).nullable().optional(), askedTo: z.string().max(120).nullable().optional(), due: dateArg.nullable().optional(), proposal: z.string().max(10_000).nullable().optional() }), req.body ?? {});
  const r = await elic.questionToQna(callerId(req), P(req, 'pid'), ref(req, 'ref'), parse(z.string().regex(/^q\d{1,4}$/), req.params.qid), b);
  ok(res, r, r.created ? 201 : 200);
}));
router.post('/projects/:pid/swr/stakeholders/seed-hats', asyncHandler(async (req, res) => ok(res, await elic.seedHats(callerId(req), P(req, 'pid')), 201)));
router.post('/projects/:pid/swr/raci/activities/preset', asyncHandler(async (req, res) => {
  const b = parse(z.object({ preset: z.enum(['requirements', 'report2']) }), req.body);
  ok(res, await elic.addRaciActivity(callerId(req), P(req, 'pid'), { preset: b.preset }), 201);
}));

// ─── PlantUML (B18) ──────────────────────────────────────────────

const svgOut = (res: Response, svg: string) => { res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'"); res.send(svg); };
router.post('/projects/:pid/diagrams/plantuml/render', asyncHandler(async (req, res) => {
  const b = parse(z.object({ source: z.string().min(1).max(60_000) }), req.body);
  svgOut(res, await dgx.renderSource(callerId(req), P(req, 'pid'), b.source));
}));
router.get('/projects/:pid/diagrams/:n/plantuml.svg', asyncHandler(async (req, res) => {
  const v = parse(z.coerce.number().int().positive().optional(), req.query.v);
  svgOut(res, await dgx.renderDiagram(callerId(req), P(req, 'pid'), P(req, 'n'), v));
}));
router.post('/projects/:pid/diagrams/import-repo', asyncHandler(async (req, res) => {
  const b = parse(z.object({ path: z.string().trim().min(1).max(500), title: z.string().max(255).nullable().optional(), to: z.enum(['mermaid', 'native']).optional() }), req.body);
  ok(res, await dgx.importFromRepo(callerId(req), P(req, 'pid'), b), 201);
}));

export default router;
