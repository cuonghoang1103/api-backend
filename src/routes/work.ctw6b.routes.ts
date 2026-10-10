/**
 * CT Work — CTW đợt 6b (11/10/2026): SWR-3 "SRS chuyên sâu" + SWR-4 "Elicitation & stakeholder". Gắn vào work.routes.ts bằng
 * `router.use` (sau authenticate + chốt cổng khách + khoá chỉnh sửa) ⇒ khách cổng bị cách ly không gọi được tuyến nào ở đây.
 * `ctw6bPublicRoutes` (gắn TRƯỚC authenticate) = khảo sát công khai + link xác nhận prototype cho khách — chỉ tin token, có trần.
 *
 *   Stakeholder   GET|POST /swr/stakeholders · PATCH|DELETE /swr/stakeholders/:sh · POST /swr/stakeholders/seed-actors
 *   RACI          GET /swr/raci · POST /swr/raci/activities · DELETE /swr/raci/activities/:id · PUT /swr/raci/cells
 *   Phiên         GET|POST /swr/elicitation · GET|PATCH|DELETE /swr/elicitation/:elc · POST /swr/elicitation/:elc/meeting
 *                 POST /swr/elicitation/:elc/propose (AI) · POST /swr/elicitation/:elc/proposals · POST …/proposals/:id/decide
 *   Truy vết      GET /swr/trace · POST /swr/origins · DELETE /swr/origins/:id
 *   Khảo sát      GET|POST /swr/surveys · GET|PATCH|DELETE /swr/surveys/:sv · POST /swr/surveys/:sv/(status|rotate)
 *                 GET /swr/surveys/:sv/export.xlsx
 *   Báo cáo       GET /swr/elicitation-report.(docx|pdf)
 *   Mô hình       GET /swr/models · POST /swr/models/:kind/generate · GET /swr/export/event-response.xlsx
 *   Prototype     GET|POST /swr/mockups · PATCH|DELETE /swr/mockups/:id · POST /swr/mockups/:id/(submit|review)
 *   Chất lượng    GET /swr/quality · PUT /swr/quality/:num · POST /swr/quality/:num/ai-fix · GET /swr/export/quality.xlsx
 *   NFR           GET /swr/nfr · PUT|DELETE /swr/nfr/:num · POST /swr/nfr/from-template
 *   Công khai     GET /public/surveys/:token · POST /public/surveys/:token/responses
 *                 GET /public/mockup-review/:token · GET …/image · POST …/decision
 *
 * Quyền kiểm TRONG service — route chỉ kiểm đầu vào.
 */

import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as elic from '../services/work/swrElic.service.js';
import * as deep from '../services/work/srsDeep.service.js';
import { MODEL_KINDS } from '../services/work/srsModels.js';
import { RACI_ROLES, SURVEY_STATUSES } from '../services/work/swr6b.js';
import { clientIp } from './work.uxd.routes.js';

const router = Router();
export const ctw6bPublicRoutes = Router();

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
const ref = (req: Request, name: string, prefix: string) => parse(z.string().regex(new RegExp(`^(?:${prefix}-?)?\\d{1,6}$`, 'i'), `Use a number or "${prefix}-3"`), req.params[name]);
const fileOut = (res: Response, out: { buffer: Buffer; file: string }, type: string) => {
  res.setHeader('Content-Type', type);
  res.setHeader('Content-Disposition', `attachment; filename="${out.file.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(out.file)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.buffer);
};
const MIME = { docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', pdf: 'application/pdf', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' } as const;
const lang = z.object({ language: z.enum(['vi', 'en']).optional() });

// ═══ Stakeholder + RACI ══════════════════════════════════════════

router.get('/projects/:pid/swr/stakeholders', asyncHandler(async (req, res) => ok(res, await elic.listStakeholders(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/swr/stakeholders', asyncHandler(async (req, res) => ok(res, await elic.createStakeholder(callerId(req), P(req, 'pid'), parse(elic.stakeholderInput, req.body)), 201)));
router.post('/projects/:pid/swr/stakeholders/seed-actors', asyncHandler(async (req, res) => ok(res, await elic.seedFromActors(callerId(req), P(req, 'pid')))));
router.patch('/projects/:pid/swr/stakeholders/:sh', asyncHandler(async (req, res) => ok(res, await elic.updateStakeholder(callerId(req), P(req, 'pid'), ref(req, 'sh', 'SH'), parse(elic.stakeholderInput.partial().extend({ rev: z.number().int().min(0).optional() }), req.body ?? {})))));
router.delete('/projects/:pid/swr/stakeholders/:sh', asyncHandler(async (req, res) => ok(res, await elic.deleteStakeholder(callerId(req), P(req, 'pid'), ref(req, 'sh', 'SH')))));

router.get('/projects/:pid/swr/raci', asyncHandler(async (req, res) => ok(res, await elic.getRaci(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/swr/raci/activities', asyncHandler(async (req, res) => ok(res, await elic.addRaciActivity(callerId(req), P(req, 'pid'), parse(z.object({ name: z.string().trim().min(1).max(160).optional(), defaults: z.boolean().optional() }), req.body ?? {})), 201)));
router.delete('/projects/:pid/swr/raci/activities/:id', asyncHandler(async (req, res) => ok(res, await elic.deleteRaciActivity(callerId(req), P(req, 'pid'), P(req, 'id')))));
router.put('/projects/:pid/swr/raci/cells', asyncHandler(async (req, res) => ok(res, await elic.setRaciCell(callerId(req), P(req, 'pid'), parse(z.object({ activityId: z.number().int().positive(), stakeholder: z.union([z.number().int().positive(), z.string().max(12)]), role: z.enum(RACI_ROLES).nullable() }), req.body)))));

// ═══ Phiên elicitation ═══════════════════════════════════════════

router.get('/projects/:pid/swr/elicitation', asyncHandler(async (req, res) => ok(res, await elic.listSessions(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/swr/elicitation', asyncHandler(async (req, res) => ok(res, await elic.createSession(callerId(req), P(req, 'pid'), parse(elic.sessionInput, req.body)), 201)));
router.get('/projects/:pid/swr/elicitation/:elc', asyncHandler(async (req, res) => ok(res, await elic.getSession(callerId(req), P(req, 'pid'), ref(req, 'elc', 'ELC')))));
router.patch('/projects/:pid/swr/elicitation/:elc', asyncHandler(async (req, res) => ok(res, await elic.updateSession(callerId(req), P(req, 'pid'), ref(req, 'elc', 'ELC'), parse(elic.sessionInput.partial().extend({ rev: z.number().int().min(0).optional() }), req.body ?? {})))));
router.delete('/projects/:pid/swr/elicitation/:elc', asyncHandler(async (req, res) => ok(res, await elic.deleteSession(callerId(req), P(req, 'pid'), ref(req, 'elc', 'ELC')))));
router.post('/projects/:pid/swr/elicitation/:elc/meeting', asyncHandler(async (req, res) => ok(res, await elic.linkMeeting(callerId(req), P(req, 'pid'), ref(req, 'elc', 'ELC'), parse(z.object({ create: z.boolean().optional(), meeting: z.number().int().positive().nullable().optional() }), req.body ?? {})))));
router.post('/projects/:pid/swr/elicitation/:elc/propose', asyncHandler(async (req, res) => ok(res, await elic.proposeRequirements(callerId(req), P(req, 'pid'), ref(req, 'elc', 'ELC'), parse(lang, req.body ?? {})))));
router.post('/projects/:pid/swr/elicitation/:elc/proposals', asyncHandler(async (req, res) => {
  const b = parse(z.object({ title: z.string().trim().min(3).max(300), text: z.string().max(4000).nullable().optional(), reqType: z.enum(['BUSINESS', 'USER', 'FUNCTIONAL', 'QUALITY', 'CONSTRAINT', 'EXTERNAL_INTERFACE', 'DATA']).optional(), priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).nullable().optional(), stakeholder: z.union([z.number().int().positive(), z.string().max(12)]).nullable().optional() }), req.body);
  ok(res, await elic.addProposal(callerId(req), P(req, 'pid'), ref(req, 'elc', 'ELC'), b), 201);
}));
router.post('/projects/:pid/swr/elicitation/:elc/proposals/:id/decide', asyncHandler(async (req, res) => ok(res, await elic.decideProposal(callerId(req), P(req, 'pid'), ref(req, 'elc', 'ELC'), P(req, 'id'), parse(elic.decideInput, req.body)))));

router.get('/projects/:pid/swr/trace', asyncHandler(async (req, res) => ok(res, await elic.getTrace(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/swr/origins', asyncHandler(async (req, res) => ok(res, await elic.addOrigin(callerId(req), P(req, 'pid'), parse(elic.originInput, req.body)), 201)));
router.delete('/projects/:pid/swr/origins/:id', asyncHandler(async (req, res) => ok(res, await elic.removeOrigin(callerId(req), P(req, 'pid'), P(req, 'id')))));

router.get('/projects/:pid/swr/elicitation-report.:fmt(docx|pdf)', asyncHandler(async (req, res) => {
  const fmt = parse(z.enum(['docx', 'pdf']), req.params.fmt);
  fileOut(res, await elic.exportReport(callerId(req), P(req, 'pid'), fmt), MIME[fmt]);
}));

// ═══ Khảo sát ════════════════════════════════════════════════════

router.get('/projects/:pid/swr/surveys', asyncHandler(async (req, res) => ok(res, await elic.listSurveys(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/swr/surveys', asyncHandler(async (req, res) => ok(res, await elic.createSurvey(callerId(req), P(req, 'pid'), parse(elic.surveyInput, req.body)), 201)));
router.get('/projects/:pid/swr/surveys/:sv/export.xlsx', asyncHandler(async (req, res) => fileOut(res, await elic.exportSurvey(callerId(req), P(req, 'pid'), ref(req, 'sv', 'SV')), MIME.xlsx)));
router.get('/projects/:pid/swr/surveys/:sv', asyncHandler(async (req, res) => ok(res, await elic.getSurvey(callerId(req), P(req, 'pid'), ref(req, 'sv', 'SV')))));
router.patch('/projects/:pid/swr/surveys/:sv', asyncHandler(async (req, res) => ok(res, await elic.updateSurvey(callerId(req), P(req, 'pid'), ref(req, 'sv', 'SV'), parse(elic.surveyInput.partial().extend({ rev: z.number().int().min(0).optional() }), req.body ?? {})))));
router.delete('/projects/:pid/swr/surveys/:sv', asyncHandler(async (req, res) => ok(res, await elic.deleteSurvey(callerId(req), P(req, 'pid'), ref(req, 'sv', 'SV')))));
router.post('/projects/:pid/swr/surveys/:sv/status', asyncHandler(async (req, res) => ok(res, await elic.setSurveyStatus(callerId(req), P(req, 'pid'), ref(req, 'sv', 'SV'), parse(z.object({ status: z.enum(SURVEY_STATUSES) }), req.body).status))));
router.post('/projects/:pid/swr/surveys/:sv/rotate', asyncHandler(async (req, res) => ok(res, await elic.rotateSurveyLink(callerId(req), P(req, 'pid'), ref(req, 'sv', 'SV')))));

// ═══ Mô hình + event–response ════════════════════════════════════

router.get('/projects/:pid/swr/models', asyncHandler(async (req, res) => ok(res, await deep.listModels(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/swr/models/:kind/generate', asyncHandler(async (req, res) => {
  const kind = parse(z.enum(MODEL_KINDS), String(req.params.kind).toUpperCase().replace(/-/g, '_'));
  const b = parse(z.object({ subject: z.string().max(160).nullable().optional(), useCase: z.union([z.number().int().positive(), z.string().max(12)]).nullable().optional() }), req.body ?? {});
  ok(res, await deep.generateModel(callerId(req), P(req, 'pid'), kind, b), 201);
}));
router.get('/projects/:pid/swr/export/event-response.xlsx', asyncHandler(async (req, res) => fileOut(res, await deep.exportEvents(callerId(req), P(req, 'pid')), MIME.xlsx)));

// ═══ Prototype ═══════════════════════════════════════════════════

router.get('/projects/:pid/swr/mockups', asyncHandler(async (req, res) => ok(res, await deep.listMockups(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/swr/mockups', asyncHandler(async (req, res) => ok(res, await deep.addMockup(callerId(req), P(req, 'pid'), parse(deep.mockupInput, req.body)), 201)));
router.patch('/projects/:pid/swr/mockups/:id', asyncHandler(async (req, res) => ok(res, await deep.updateMockup(callerId(req), P(req, 'pid'), P(req, 'id'), parse(z.object({ title: z.string().max(200).nullable().optional(), url: z.string().trim().max(1000).nullable().optional(), imageId: z.number().int().positive().nullable().optional() }), req.body ?? {})))));
router.delete('/projects/:pid/swr/mockups/:id', asyncHandler(async (req, res) => ok(res, await deep.deleteMockup(callerId(req), P(req, 'pid'), P(req, 'id')))));
router.post('/projects/:pid/swr/mockups/:id/submit', asyncHandler(async (req, res) => ok(res, await deep.submitMockup(callerId(req), P(req, 'pid'), P(req, 'id'), parse(z.object({ share: z.boolean().optional() }), req.body ?? {})))));
router.post('/projects/:pid/swr/mockups/:id/review', asyncHandler(async (req, res) => ok(res, await deep.reviewMockup(callerId(req), P(req, 'pid'), P(req, 'id'), parse(deep.reviewInput, req.body)))));

// ═══ Checklist chất lượng + NFR ══════════════════════════════════

router.get('/projects/:pid/swr/quality', asyncHandler(async (req, res) => ok(res, await deep.qualityList(callerId(req), P(req, 'pid')))));
router.put('/projects/:pid/swr/quality/:num', asyncHandler(async (req, res) => ok(res, await deep.setManualQuality(callerId(req), P(req, 'pid'), P(req, 'num'), parse(deep.manualInput, req.body ?? {})))));
router.post('/projects/:pid/swr/quality/:num/ai-fix', asyncHandler(async (req, res) => ok(res, await deep.aiFix(callerId(req), P(req, 'pid'), P(req, 'num'), parse(lang, req.body ?? {})))));
router.get('/projects/:pid/swr/export/quality.xlsx', asyncHandler(async (req, res) => fileOut(res, await deep.exportQuality(callerId(req), P(req, 'pid')), MIME.xlsx)));

router.get('/projects/:pid/swr/nfr', asyncHandler(async (req, res) => ok(res, await deep.nfrList(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/swr/nfr/from-template', asyncHandler(async (req, res) => ok(res, await deep.createNfrFromTemplate(callerId(req), P(req, 'pid'), parse(z.object({ template: z.string().max(40), title: z.string().max(255).nullable().optional() }), req.body)), 201)));
router.put('/projects/:pid/swr/nfr/:num', asyncHandler(async (req, res) => ok(res, await deep.setNfr(callerId(req), P(req, 'pid'), P(req, 'num'), parse(deep.nfrInput, req.body)))));
router.delete('/projects/:pid/swr/nfr/:num', asyncHandler(async (req, res) => ok(res, await deep.deleteNfr(callerId(req), P(req, 'pid'), P(req, 'num')))));

// ═══ Công khai (TRƯỚC authenticate) ══════════════════════════════

const limiter = (envName: string, def: number) => rateLimit({
  windowMs: 60_000, max: () => Number(process.env[envName] || def), standardHeaders: true, legacyHeaders: false, keyGenerator: clientIp, validate: false,
  message: { success: false, message: 'Too many requests. Please try again in a minute.', code: 'RATE_LIMIT_EXCEEDED' },
});
const readLimit = limiter('WORK_PUBLIC_FORM_RPM', 60);
const writeLimit = limiter('WORK_PUBLIC_SUBMIT_RPM', 10);
const noStore = (res: Response) => { res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Robots-Tag', 'noindex'); };
const token = (req: Request) => parse(z.string().regex(/^[A-Za-z0-9_-]{16,48}$/, 'Bad link'), req.params.token);

ctw6bPublicRoutes.get('/public/surveys/:token', readLimit, asyncHandler(async (req, res) => { noStore(res); ok(res, await elic.publicSurvey(token(req))); }));
ctw6bPublicRoutes.post('/public/surveys/:token/responses', writeLimit, asyncHandler(async (req, res) => {
  noStore(res);
  ok(res, await elic.submitPublicSurvey(token(req), (req.body ?? {}) as { answers?: unknown; name?: unknown }, clientIp(req)), 201);
}));
ctw6bPublicRoutes.get('/public/mockup-review/:token', readLimit, asyncHandler(async (req, res) => { noStore(res); ok(res, await deep.publicMockup(token(req))); }));
ctw6bPublicRoutes.get('/public/mockup-review/:token/image', readLimit, asyncHandler(async (req, res) => {
  const img = await deep.publicMockupImage(token(req));
  res.setHeader('Content-Type', img.mime);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'private, max-age=300');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.send(img.buffer);
}));
ctw6bPublicRoutes.post('/public/mockup-review/:token/decision', writeLimit, asyncHandler(async (req, res) => { noStore(res); ok(res, await deep.publicMockupDecision(token(req), (req.body ?? {}) as Record<string, unknown>)); }));

export default router;
