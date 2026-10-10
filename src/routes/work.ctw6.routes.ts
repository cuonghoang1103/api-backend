/**
 * CT Work đợt 6 (11/10/2026) — chất lượng: RV review/inspection + baseline + CR ↔ yêu cầu; TST-1 quản lý test chuyên sâu.
 * Gắn trong work.routes.ts (đã qua apiTokenAuth + authenticate + chốt /projects/:pid + chốt cổng khách — khách cổng gọi
 * các tuyến này ⇒ 403 CLIENT_PORTAL_ONLY). Quyền chi tiết TRONG service (quality.service.ts, testMgmt.service.ts).
 *
 *   GET      /projects/:pid/review-checklists?lang=
 *   GET|POST /projects/:pid/reviews                       · GET|PATCH|DELETE /projects/:pid/reviews/:num
 *   PUT      /projects/:pid/reviews/:num/participants | items
 *   POST     /projects/:pid/reviews/:num/transition       { to }
 *   POST     /projects/:pid/reviews/:num/items/:itemId/defect
 *   GET      /projects/:pid/reviews/:num/export?format=docx|pdf&lang=
 *   GET|POST /projects/:pid/baselines                     · GET /projects/:pid/baselines/:num
 *   POST     /projects/:pid/baselines/:num/request-signoff | sign
 *   GET      /projects/:pid/baselines/:num/compare?against=current|<n>
 *   GET      /projects/:pid/baselines-locked · /projects/:pid/requirements-volatility
 *   GET      /projects/:pid/changes/:num/impact · PUT /projects/:pid/changes/:num/affected
 *   POST     /projects/:pid/test-designs/preview · GET|POST /projects/:pid/test-designs · GET|DELETE …/:num · POST …/:num/export
 *   GET|PATCH /projects/:pid/tests-attributes
 *   GET|PUT  /projects/:pid/test-plans/:planId/settings
 *   GET      /projects/:pid/test-quality?planId=&days=
 *   GET|POST /projects/:pid/test-risks
 *   GET      /projects/:pid/test-defects · PUT /projects/:pid/test-defects/:num · GET /projects/:pid/test-defects-report
 *   GET      /projects/:pid/test-summary-report?planId=&format=md|docx|pdf&lang=
 *   GET|POST /projects/:pid/exploratory · GET|PATCH|DELETE …/:num · POST …/:num/start|stop|notes
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, UnauthorizedError } from '../middleware/errorHandler.js';
import * as q from '../services/work/quality.service.js';
import * as t from '../services/work/testMgmt.service.js';
import { CHECKLIST_KEYS, ITEM_RESULTS, REVIEW_KINDS, REVIEW_METHODS, REVIEW_ROLES, REVIEW_STATUSES, REVIEW_DECISIONS } from '../services/work/reviewRules.js';
import { BASELINE_KINDS } from '../services/work/baselineRules.js';
import { TECHNIQUES } from '../services/work/testDesign.js';
import { PHASES, ROOT_CAUSES, TEST_LEVELS, TEST_TYPES } from '../services/work/testMetrics.js';
import { SEVERITIES } from '../services/work/srs.js';

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
const lang = z.enum(['vi', 'en']).optional();
const txt = (max: number) => z.string().max(max).nullable().optional();
const minutes = z.number().int().min(0).max(100_000).nullable().optional();

function sendFile(res: Response, out: { buffer: Buffer; file: string }, format: 'docx' | 'pdf') {
  res.setHeader('Content-Type', format === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${out.file.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(out.file)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.buffer);
}

// ═══ Review / inspection ═════════════════════════════════════════

router.get('/projects/:pid/review-checklists', asyncHandler(async (req, res) => {
  P(req, 'pid');
  ok(res, q.listChecklists(parse(z.object({ lang }), req.query).lang ?? 'en'));
}));
router.get('/projects/:pid/reviews', asyncHandler(async (req, res) => {
  ok(res, await q.listReviews(callerId(req), P(req, 'pid')));
}));
router.post('/projects/:pid/reviews', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    title: z.string().trim().min(1).max(200), kind: z.enum(REVIEW_KINDS), method: z.enum(REVIEW_METHODS), checklistKey: z.enum(CHECKLIST_KEYS),
    pageNumber: z.number().int().positive().nullable().optional(), workProduct: txt(200), prUrl: txt(500),
    size: z.number().min(0).max(1_000_000).nullable().optional(), meetingAt: z.coerce.date().nullable().optional(),
    entryCriteria: txt(4000), exitCriteria: txt(4000),
    participants: z.array(z.object({ userId: z.number().int().positive(), role: z.enum(REVIEW_ROLES) })).max(30).optional(), language: lang,
  }), req.body ?? {});
  ok(res, await q.createReview(callerId(req), P(req, 'pid'), body), 201);
}));
router.get('/projects/:pid/reviews/:num', asyncHandler(async (req, res) => {
  ok(res, await q.getReview(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.patch('/projects/:pid/reviews/:num', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    title: z.string().trim().min(1).max(200).optional(), method: z.enum(REVIEW_METHODS).optional(), workProduct: txt(200), prUrl: txt(500),
    size: z.number().min(0).max(1_000_000).nullable().optional(), meetingAt: z.coerce.date().nullable().optional(),
    meetingMinutes: minutes, reworkMinutes: minutes, entryCriteria: txt(4000), exitCriteria: txt(4000), notes: txt(10_000),
    decision: z.enum(REVIEW_DECISIONS).nullable().optional(),
  }), req.body ?? {});
  ok(res, await q.updateReview(callerId(req), P(req, 'pid'), P(req, 'num'), body));
}));
router.delete('/projects/:pid/reviews/:num', asyncHandler(async (req, res) => {
  ok(res, await q.deleteReview(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.put('/projects/:pid/reviews/:num/participants', asyncHandler(async (req, res) => {
  const { items } = parse(z.object({ items: z.array(z.object({ userId: z.number().int().positive(), role: z.enum(REVIEW_ROLES), prepMinutes: minutes })).min(1).max(30) }), req.body ?? {});
  ok(res, await q.setParticipants(callerId(req), P(req, 'pid'), P(req, 'num'), items));
}));
router.put('/projects/:pid/reviews/:num/items', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    items: z.array(z.object({ id: z.number().int().positive(), result: z.enum(ITEM_RESULTS).nullable().optional(), line: txt(60), note: txt(4000), severity: z.enum(SEVERITIES).nullable().optional() })).max(300).optional(),
    add: z.array(z.object({ section: z.string().trim().min(1).max(120), question: z.string().trim().min(1).max(1000) })).max(50).optional(),
  }), req.body ?? {});
  ok(res, await q.saveItems(callerId(req), P(req, 'pid'), P(req, 'num'), body));
}));
router.post('/projects/:pid/reviews/:num/transition', asyncHandler(async (req, res) => {
  const { to } = parse(z.object({ to: z.enum(REVIEW_STATUSES) }), req.body ?? {});
  ok(res, await q.transitionReview(callerId(req), P(req, 'pid'), P(req, 'num'), to));
}));
router.post('/projects/:pid/reviews/:num/items/:itemId/defect', asyncHandler(async (req, res) => {
  const body = parse(z.object({ severity: z.enum(SEVERITIES).nullable().optional(), title: txt(250) }), req.body ?? {});
  ok(res, await q.logReviewDefect(callerId(req), P(req, 'pid'), P(req, 'num'), P(req, 'itemId'), body), 201);
}));
router.get('/projects/:pid/reviews/:num/export', asyncHandler(async (req, res) => {
  const qq = parse(z.object({ format: z.enum(['docx', 'pdf']).default('docx'), lang: z.enum(['vi', 'en']).default('en') }), req.query);
  sendFile(res, await q.exportReviewMinutes(callerId(req), P(req, 'pid'), P(req, 'num'), qq.format, qq.lang), qq.format);
}));

// ═══ Baseline ════════════════════════════════════════════════════

router.get('/projects/:pid/baselines', asyncHandler(async (req, res) => {
  ok(res, await q.listBaselines(callerId(req), P(req, 'pid')));
}));
router.post('/projects/:pid/baselines', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().trim().min(1).max(160), description: txt(4000),
    scope: z.object({ requirements: z.boolean().optional(), useCases: z.boolean().optional(), businessRules: z.boolean().optional(), pageNumbers: z.array(z.number().int().positive()).max(100).optional() }),
    approverIds: z.array(z.number().int().positive()).max(20).optional(),
  }), req.body ?? {});
  ok(res, await q.createBaseline(callerId(req), P(req, 'pid'), body), 201);
}));
router.get('/projects/:pid/baselines-locked', asyncHandler(async (req, res) => {
  ok(res, await q.lockedRefs(callerId(req), P(req, 'pid')));
}));
router.get('/projects/:pid/requirements-volatility', asyncHandler(async (req, res) => {
  ok(res, await q.volatility(callerId(req), P(req, 'pid')));
}));
router.get('/projects/:pid/baselines/:num', asyncHandler(async (req, res) => {
  ok(res, await q.getBaseline(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.post('/projects/:pid/baselines/:num/request-signoff', asyncHandler(async (req, res) => {
  const { approverIds } = parse(z.object({ approverIds: z.array(z.number().int().positive()).min(1).max(20) }), req.body ?? {});
  ok(res, await q.requestSignoff(callerId(req), P(req, 'pid'), P(req, 'num'), approverIds));
}));
router.post('/projects/:pid/baselines/:num/sign', asyncHandler(async (req, res) => {
  const body = parse(z.object({ decision: z.enum(['APPROVE', 'REJECT']), comment: txt(2000) }), req.body ?? {});
  ok(res, await q.signBaseline(callerId(req), P(req, 'pid'), P(req, 'num'), body, { ip: req.ip ?? null }));
}));
router.get('/projects/:pid/baselines/:num/compare', asyncHandler(async (req, res) => {
  const { against } = parse(z.object({ against: z.union([z.literal('current'), z.coerce.number().int().positive()]).default('current') }), req.query);
  ok(res, await q.compareBaseline(callerId(req), P(req, 'pid'), P(req, 'num'), against));
}));
router.get('/projects/:pid/changes/:num/impact', asyncHandler(async (req, res) => {
  ok(res, await q.crImpact(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.put('/projects/:pid/changes/:num/affected', asyncHandler(async (req, res) => {
  const { items } = parse(z.object({ items: z.array(z.object({ kind: z.enum(BASELINE_KINDS), ref: z.string().trim().min(1).max(40) })).max(200) }), req.body ?? {});
  ok(res, await q.setCrRefs(callerId(req), P(req, 'pid'), P(req, 'num'), items));
}));

// ═══ Thiết kế test ═══════════════════════════════════════════════

const designBody = z.object({ technique: z.enum(TECHNIQUES), input: z.unknown() });
router.post('/projects/:pid/test-designs/preview', asyncHandler(async (req, res) => {
  P(req, 'pid');
  const b = parse(designBody, req.body ?? {});
  ok(res, t.previewDesign(b.technique, b.input));
}));
router.get('/projects/:pid/test-designs', asyncHandler(async (req, res) => {
  ok(res, await t.listDesigns(callerId(req), P(req, 'pid')));
}));
router.post('/projects/:pid/test-designs', asyncHandler(async (req, res) => {
  const b = parse(designBody.extend({ number: z.number().int().positive().nullable().optional(), name: z.string().trim().min(1).max(160), requirementKey: txt(40) }), req.body ?? {});
  ok(res, await t.saveDesign(callerId(req), P(req, 'pid'), { ...b, input: b.input }), b.number ? 200 : 201);
}));
router.get('/projects/:pid/test-designs/:num', asyncHandler(async (req, res) => {
  ok(res, await t.getDesign(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.delete('/projects/:pid/test-designs/:num', asyncHandler(async (req, res) => {
  ok(res, await t.deleteDesign(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.post('/projects/:pid/test-designs/:num/export', asyncHandler(async (req, res) => {
  const b = parse(z.object({
    target: z.enum(['XRAY', 'UNIT']), caseIds: z.array(z.string().max(20)).max(500).optional(),
    level: z.enum(TEST_LEVELS).nullable().optional(), testType: z.enum(TEST_TYPES).nullable().optional(),
    moduleName: txt(120), methodName: txt(120),
  }), req.body ?? {});
  ok(res, await t.exportDesign(callerId(req), P(req, 'pid'), P(req, 'num'), b), 201);
}));

// ═══ Thuộc tính test case + kế hoạch ═════════════════════════════

router.get('/projects/:pid/tests-attributes', asyncHandler(async (req, res) => {
  ok(res, await t.caseAttributes(callerId(req), P(req, 'pid')));
}));
router.patch('/projects/:pid/tests-attributes', asyncHandler(async (req, res) => {
  const b = parse(z.object({
    numbers: z.array(z.number().int().positive()).min(1).max(1000),
    level: z.enum(TEST_LEVELS).nullable().optional(), testType: z.enum(TEST_TYPES).nullable().optional(),
    technique: z.string().max(16).nullable().optional(), estimateMin: z.number().int().min(0).max(10_000).nullable().optional(),
  }), req.body ?? {});
  const { numbers, ...rest } = b;
  ok(res, await t.setCaseAttributes(callerId(req), P(req, 'pid'), numbers, rest));
}));
const criteria = z.object({
  passRate: z.number().min(0).max(100).nullable().optional(), maxOpenCritical: z.number().int().min(0).max(1000).nullable().optional(),
  maxOpenMajor: z.number().int().min(0).max(1000).nullable().optional(), reqCoverage: z.number().min(0).max(100).nullable().optional(),
  minExecuted: z.number().min(0).max(100).nullable().optional(),
});
const estimation = z.object({
  method: z.enum(['TEST_CASES', 'FUNCTION_POINTS']).optional(), size: z.number().min(0).max(1_000_000).optional(),
  designPerDay: z.number().min(0.1).max(10_000).optional(), executePerDay: z.number().min(0.1).max(10_000).optional(),
  cycles: z.number().int().min(1).max(50).optional(), retestPct: z.number().min(0).max(500).optional(), overheadPct: z.number().min(0).max(500).optional(),
  testers: z.number().int().min(1).max(500).optional(), hoursPerDay: z.number().min(1).max(24).optional(),
});
router.get('/projects/:pid/test-plans/:planId/settings', asyncHandler(async (req, res) => {
  ok(res, await t.getPlanSettings(callerId(req), P(req, 'pid'), P(req, 'planId')));
}));
router.put('/projects/:pid/test-plans/:planId/settings', asyncHandler(async (req, res) => {
  const s = (n: number) => z.string().max(n).optional();
  const b = parse(z.object({
    scopeIn: s(8000), scopeOut: s(8000), approach: s(8000), environment: s(4000), suspension: s(4000), resumption: s(4000),
    deliverables: s(4000), schedule: s(4000), risks: s(8000), variances: s(8000), criteria: criteria.optional(), estimation: estimation.optional(),
  }), req.body ?? {});
  ok(res, await t.savePlanSettings(callerId(req), P(req, 'pid'), P(req, 'planId'), b));
}));

// ═══ Giám sát, rủi ro, defect, TSR ═══════════════════════════════

router.get('/projects/:pid/test-quality', asyncHandler(async (req, res) => {
  const qq = parse(z.object({ planId: z.coerce.number().int().positive().optional(), days: z.coerce.number().int().min(7).max(90).optional() }), req.query);
  ok(res, await t.qualityDashboard(callerId(req), P(req, 'pid'), qq));
}));
router.get('/projects/:pid/test-risks', asyncHandler(async (req, res) => {
  ok(res, await t.riskMatrix(callerId(req), P(req, 'pid')));
}));
router.post('/projects/:pid/test-risks', asyncHandler(async (req, res) => {
  const b = parse(z.object({
    number: z.number().int().positive().nullable().optional(), title: z.string().trim().min(1).max(255).optional(),
    likelihood: z.number().int().min(1).max(5).nullable().optional(), impact: z.number().int().min(1).max(5).nullable().optional(),
    riskKind: z.enum(['PRODUCT', 'PROJECT']).nullable().optional(), mitigation: txt(4000), issueNumbers: z.array(z.number().int().positive()).max(200).optional(),
  }), req.body ?? {});
  ok(res, await t.saveRisk(callerId(req), P(req, 'pid'), b), b.number ? 200 : 201);
}));
router.get('/projects/:pid/test-defects', asyncHandler(async (req, res) => {
  ok(res, await t.defectTable(callerId(req), P(req, 'pid')));
}));
router.put('/projects/:pid/test-defects/:num', asyncHandler(async (req, res) => {
  const b = parse(z.object({
    rootCause: z.enum(ROOT_CAUSES).nullable().optional(), injectedPhase: z.enum(PHASES).nullable().optional(),
    detectedByTool: txt(120), testLevel: z.enum(TEST_LEVELS).nullable().optional(), fixNote: txt(8000),
  }), req.body ?? {});
  ok(res, await t.setDefectExtra(callerId(req), P(req, 'pid'), P(req, 'num'), b));
}));
router.get('/projects/:pid/test-defects-report', asyncHandler(async (req, res) => {
  const qq = parse(z.object({ format: z.enum(['docx', 'pdf']).default('docx'), lang: z.enum(['vi', 'en']).default('en') }), req.query);
  sendFile(res, await t.exportDefectReport(callerId(req), P(req, 'pid'), qq.format, qq.lang), qq.format);
}));
router.get('/projects/:pid/test-summary-report', asyncHandler(async (req, res) => {
  const qq = parse(z.object({ planId: z.coerce.number().int().positive().optional(), format: z.enum(['md', 'docx', 'pdf']).default('md'), lang }), req.query);
  const out = await t.summaryReport(callerId(req), P(req, 'pid'), { planId: qq.planId, format: qq.format, language: qq.lang });
  if (qq.format === 'md' || !('buffer' in out) || !out.buffer) { ok(res, out); return; }
  sendFile(res, out as { buffer: Buffer; file: string }, qq.format);
}));

// ═══ Kiểm thử thăm dò ════════════════════════════════════════════

const exploreBody = z.object({
  charter: z.string().trim().min(1).max(4000).optional(), area: txt(160), timeboxMin: z.number().int().min(5).max(480).optional(),
  testerId: z.number().int().positive().nullable().optional(), cycleId: z.number().int().positive().nullable().optional(), summary: txt(8000),
});
router.get('/projects/:pid/exploratory', asyncHandler(async (req, res) => {
  ok(res, await t.listExploratory(callerId(req), P(req, 'pid')));
}));
router.post('/projects/:pid/exploratory', asyncHandler(async (req, res) => {
  ok(res, await t.saveExploratory(callerId(req), P(req, 'pid'), parse(exploreBody, req.body ?? {})), 201);
}));
router.get('/projects/:pid/exploratory/:num', asyncHandler(async (req, res) => {
  ok(res, await t.getExploratory(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.patch('/projects/:pid/exploratory/:num', asyncHandler(async (req, res) => {
  ok(res, await t.saveExploratory(callerId(req), P(req, 'pid'), { ...parse(exploreBody, req.body ?? {}), number: P(req, 'num') }));
}));
router.delete('/projects/:pid/exploratory/:num', asyncHandler(async (req, res) => {
  ok(res, await t.deleteExploratory(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.post('/projects/:pid/exploratory/:num/start', asyncHandler(async (req, res) => {
  ok(res, await t.exploratoryAction(callerId(req), P(req, 'pid'), P(req, 'num'), 'start'));
}));
router.post('/projects/:pid/exploratory/:num/stop', asyncHandler(async (req, res) => {
  ok(res, await t.exploratoryAction(callerId(req), P(req, 'pid'), P(req, 'num'), 'stop'));
}));
router.post('/projects/:pid/exploratory/:num/notes', asyncHandler(async (req, res) => {
  const b = parse(z.object({ kind: z.enum(t.NOTE_KINDS), text: z.string().trim().min(1).max(2000), logBug: z.boolean().optional(), severity: z.enum(SEVERITIES).nullable().optional() }), req.body ?? {});
  ok(res, await t.addExploratoryNote(callerId(req), P(req, 'pid'), P(req, 'num'), b), 201);
}));

export default router;
