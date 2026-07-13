/**
 * Interview Simulator routes.
 * ────────────────────────────────────────────────────────────
 * Default export  → user router,  mounted at /api/v1/interview
 * Named `adminRouter` → admin router, mounted at /api/v1/admin/interview
 *
 * Both apply `authenticate`; the admin router additionally applies
 * `requireAdmin()`. User handlers pass `req.userId!` into the service, which
 * scopes/guards every query by userId (IDOR protection). Phase 2 is STATIC —
 * no LLM is invoked here.
 */
import { Router, type Request, type Response } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import * as taxonomy from '../services/interview/taxonomy.service.js';
import * as bank from '../services/interview/questionBank.service.js';
import * as session from '../services/interview/session.service.js';
import * as drill from '../services/interview/drill.service.js';
import { isAiAvailable, getUsageStats } from '../services/interview/llm/index.js';
import type { InterviewLevel } from '@prisma/client';

const parseId = (v: string): number => {
  const n = parseInt(v, 10);
  return Number.isInteger(n) && n > 0 ? n : NaN;
};

// ═══════════════════════ USER ROUTER ════════════════════════════
const router = Router();
router.use(authenticate);

// Taxonomy for the setup wizard
router.get('/tracks', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    const tax = await taxonomy.getTaxonomy();
    res.json({ success: true, data: { ...tax, aiAvailable: isAiAvailable() } });
  } catch (err) { next(err); }
});

// Create a session (returns plan + first questions)
router.post('/sessions', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const data = await session.createSession(req.userId!, req.body ?? {});
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
});

// Session state
router.get('/sessions/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const data = await session.getSessionState(req.userId!, parseId(req.params.id));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// Submit an answer for a turn → deterministic Pass A + reveal reference/rubric
router.post('/sessions/:id/turns/:order/answer', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const data = await session.submitAnswer(req.userId!, parseId(req.params.id), parseInt(req.params.order, 10), req.body ?? {});
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// Self-assessment for a turn
router.post('/sessions/:id/turns/:order/self-assess', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const data = await session.selfAssess(req.userId!, parseId(req.params.id), parseInt(req.params.order, 10), req.body ?? {});
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// Finish → generate template report
router.post('/sessions/:id/finish', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const data = await session.finishSession(req.userId!, parseId(req.params.id));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// Fetch report (with per-turn explainability)
router.get('/sessions/:id/report', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const data = await session.getReport(req.userId!, parseId(req.params.id));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// History / progress trend
router.get('/history', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await session.listHistory(req.userId!) });
  } catch (err) { next(err); }
});

// Flag a turn's score as wrong → admin review queue (Phase 5 feedback loop)
router.post('/sessions/:id/turns/:order/flag', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const data = await session.flagTurn(req.userId!, parseId(req.params.id), parseInt(req.params.order, 10), req.body?.reason);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// ── Spaced-repetition drill (Phase 3) ──
router.get('/drill', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const lang = String(req.query.lang ?? 'VI').toUpperCase() === 'EN' ? 'EN' : 'VI';
    res.json({ success: true, data: await drill.getDrill(req.userId!, { lang }) });
  } catch (err) { next(err); }
});
router.post('/drill/:cardId/grade', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await drill.gradeCard(req.userId!, parseId(req.params.cardId), req.body ?? {}) });
  } catch (err) { next(err); }
});
router.get('/mastery', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await drill.getMastery(req.userId!) });
  } catch (err) { next(err); }
});

// ═══════════════════════ ADMIN ROUTER ═══════════════════════════
const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin());

// Taxonomy tree + bank health
adminRouter.get('/taxonomy', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await taxonomy.listDomains() });
  } catch (err) { next(err); }
});
adminRouter.get('/bank-health', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await taxonomy.getBankHealth() });
  } catch (err) { next(err); }
});
adminRouter.get('/llm-usage', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await getUsageStats() });
  } catch (err) { next(err); }
});
// Flagged-turn review queue (user "score seems wrong" + AI disagreement/injection)
adminRouter.get('/flagged', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await session.listFlaggedTurns() });
  } catch (err) { next(err); }
});
adminRouter.post('/flagged/:turnId/resolve', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await session.resolveFlag(parseId(req.params.turnId)) });
  } catch (err) { next(err); }
});

// Domains
adminRouter.post('/domains', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await taxonomy.createDomain(req.body ?? {}) }); } catch (err) { next(err); }
});
adminRouter.put('/domains/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await taxonomy.updateDomain(parseId(req.params.id), req.body ?? {}) }); } catch (err) { next(err); }
});
adminRouter.delete('/domains/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await taxonomy.deleteDomain(parseId(req.params.id)) }); } catch (err) { next(err); }
});

// Tracks
adminRouter.post('/tracks', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await taxonomy.createTrack(req.body ?? {}) }); } catch (err) { next(err); }
});
adminRouter.put('/tracks/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await taxonomy.updateTrack(parseId(req.params.id), req.body ?? {}) }); } catch (err) { next(err); }
});
adminRouter.delete('/tracks/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await taxonomy.deleteTrack(parseId(req.params.id)) }); } catch (err) { next(err); }
});

// Topics
adminRouter.post('/topics', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await taxonomy.createTopic(req.body ?? {}) }); } catch (err) { next(err); }
});
adminRouter.put('/topics/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await taxonomy.updateTopic(parseId(req.params.id), req.body ?? {}) }); } catch (err) { next(err); }
});
adminRouter.delete('/topics/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await taxonomy.deleteTopic(parseId(req.params.id)) }); } catch (err) { next(err); }
});

// Concepts
adminRouter.get('/concepts', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await taxonomy.listConcepts(req.query.topicId ? parseId(String(req.query.topicId)) : undefined) }); } catch (err) { next(err); }
});
adminRouter.post('/concepts', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await taxonomy.createConcept(req.body ?? {}) }); } catch (err) { next(err); }
});

// Company profiles
adminRouter.post('/company-profiles', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await taxonomy.createCompanyProfile(req.body ?? {}) }); } catch (err) { next(err); }
});
adminRouter.put('/company-profiles/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await taxonomy.updateCompanyProfile(parseId(req.params.id), req.body ?? {}) }); } catch (err) { next(err); }
});

// Questions
adminRouter.get('/questions', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const q = req.query;
    const data = await bank.listQuestions({
      topicId: q.topicId ? parseId(String(q.topicId)) : undefined,
      trackId: q.trackId ? parseId(String(q.trackId)) : undefined,
      level: q.level ? (String(q.level).toUpperCase() as InterviewLevel) : undefined,
      status: q.status ? String(q.status) : undefined,
      rubricReviewed: q.rubricReviewed === undefined ? undefined : String(q.rubricReviewed) === 'true',
      page: q.page ? parseInt(String(q.page), 10) : undefined,
      pageSize: q.pageSize ? parseInt(String(q.pageSize), 10) : undefined,
    });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});
adminRouter.get('/questions/search', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const data = await bank.searchQuestions(String(req.query.q ?? ''), {
      topicId: req.query.topicId ? parseId(String(req.query.topicId)) : undefined,
      level: req.query.level ? (String(req.query.level).toUpperCase() as InterviewLevel) : undefined,
    });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});
adminRouter.get('/questions/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await bank.getQuestion(parseId(req.params.id)) }); } catch (err) { next(err); }
});
adminRouter.post('/questions', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await bank.createQuestion(req.userId!, req.body ?? {}) }); } catch (err) { next(err); }
});
adminRouter.put('/questions/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await bank.updateQuestion(parseId(req.params.id), req.userId!, req.body ?? {}) }); } catch (err) { next(err); }
});
adminRouter.delete('/questions/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await bank.deleteQuestion(parseId(req.params.id)) }); } catch (err) { next(err); }
});

export default router;
export { adminRouter };
