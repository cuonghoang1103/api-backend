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
import multer from 'multer';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import * as stt from '../services/interview/voice/stt.js';
import * as taxonomy from '../services/interview/taxonomy.service.js';
import * as bank from '../services/interview/questionBank.service.js';
import * as session from '../services/interview/session.service.js';
import * as drill from '../services/interview/drill.service.js';
import { isAiAvailable, getUsageStats } from '../services/interview/llm/index.js';
import * as knowledge from '../services/interview/knowledge/knowledge.service.js';
import * as prompts from '../services/interview/promptTemplate.service.js';
import * as questionGen from '../services/interview/questionGen.service.js';
import { isProEffective } from '../services/pro.service.js';
import type { InterviewLevel, InterviewContentStatus } from '@prisma/client';

const VALID_LEVELS: InterviewLevel[] = ['INTERN', 'FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'PRINCIPAL'];
const parseLevel = (v: unknown): InterviewLevel | null => {
  const s = String(v ?? '').toUpperCase();
  return (VALID_LEVELS as string[]).includes(s) ? (s as InterviewLevel) : null;
};

const parseId = (v: string): number => {
  const n = parseInt(v, 10);
  return Number.isInteger(n) && n > 0 ? n : NaN;
};

// ═══════════════════════ USER ROUTER ════════════════════════════
const router = Router();
router.use(authenticate);

// Taxonomy for the setup wizard
router.get('/tracks', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const tax = await taxonomy.getTaxonomy();
    // aiAvailable = platform can do AI; aiAllowed = THIS user may use it (Pro/admin).
    const aiAllowed = await isProEffective(req.userId);
    // sttProvider tells the client whether to transcribe voice answers in the
    // browser (free) or via the server (Groq Whisper) — see voice/stt.ts.
    res.json({ success: true, data: { ...tax, aiAvailable: isAiAvailable(), aiAllowed, sttProvider: stt.sttProvider() } });
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

// ── Phase 9: server speech-to-text (Groq Whisper) ──
// Audio is held in memory only (never written to disk) — it is PII.
const audioUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
router.post('/stt', audioUpload.single('audio'), async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const file = (req as unknown as { file?: { buffer: Buffer; originalname?: string; mimetype?: string } }).file;
    if (!file?.buffer?.length) { res.status(400).json({ success: false, message: 'Thiếu audio' }); return; }
    const sessionId = parseId(String(req.body?.sessionId));
    const order = parseInt(String(req.body?.order), 10);
    if (Number.isNaN(sessionId) || !Number.isInteger(order)) { res.status(400).json({ success: false, message: 'sessionId/order không hợp lệ' }); return; }
    const language = String(req.body?.language ?? 'vi').toLowerCase() === 'en' ? 'en' : 'vi';
    const data = await stt.transcribeAnswerAudio({
      userId: req.userId!,
      sessionId,
      order,
      language,
      audio: file.buffer,
      filename: file.originalname || 'answer.webm',
      mimetype: file.mimetype || 'audio/webm',
    });
    res.json({ success: true, data });
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

// ── Phase 6: Knowledge base (RAG) ─────────────────────────────────
// Coverage/gaps come BEFORE /:id so they aren't shadowed by the param route.
adminRouter.get('/knowledge/coverage', async (_req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await knowledge.coverageHeatmap() }); } catch (err) { next(err); }
});
adminRouter.get('/knowledge/gaps', async (_req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await knowledge.knowledgeGaps() }); } catch (err) { next(err); }
});
adminRouter.get('/knowledge', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const q = req.query;
    res.json({ success: true, data: await knowledge.listDocuments({
      topicId: q.topicId ? parseId(String(q.topicId)) : undefined,
      trackId: q.trackId ? parseId(String(q.trackId)) : undefined,
      status: q.status ? (String(q.status) as InterviewContentStatus) : undefined,
      q: q.q ? String(q.q) : undefined,
    }) });
  } catch (err) { next(err); }
});
adminRouter.get('/knowledge/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await knowledge.getDocument(parseId(req.params.id)) }); } catch (err) { next(err); }
});
adminRouter.post('/knowledge', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await knowledge.createDocument({ ...(req.body ?? {}), authorId: req.userId ?? null }) }); } catch (err) { next(err); }
});
adminRouter.put('/knowledge/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await knowledge.updateDocument(parseId(req.params.id), req.body ?? {}) }); } catch (err) { next(err); }
});
adminRouter.delete('/knowledge/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await knowledge.deleteDocument(parseId(req.params.id)) }); } catch (err) { next(err); }
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

// ── Phase 7: Prompt template editor (versioned) ──────────────────
adminRouter.get('/prompts', async (_req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await prompts.listPrompts() }); } catch (err) { next(err); }
});
adminRouter.get('/prompts/:key/versions', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await prompts.getPromptVersions(req.params.key) }); } catch (err) { next(err); }
});
adminRouter.post('/prompts/:key', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const data = await prompts.savePrompt(req.params.key, String(req.body?.content ?? ''), req.body?.name);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
});
adminRouter.post('/prompts/:key/activate', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const version = parseInt(String(req.body?.version), 10);
    if (!Number.isInteger(version)) { res.status(400).json({ success: false, message: 'version không hợp lệ' }); return; }
    res.json({ success: true, data: await prompts.activateVersion(req.params.key, version) });
  } catch (err) { next(err); }
});
adminRouter.post('/prompts/:key/reset', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await prompts.resetPrompt(req.params.key) }); } catch (err) { next(err); }
});

// ── Phase 8: AI question generation (preview → commit) ────────────
adminRouter.post('/generate', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const b = req.body ?? {};
    const topicId = parseId(String(b.topicId));
    if (Number.isNaN(topicId)) { res.status(400).json({ success: false, message: 'topicId không hợp lệ' }); return; }
    const level = parseLevel(b.level);
    if (!level) { res.status(400).json({ success: false, message: 'level không hợp lệ' }); return; }
    const data = await questionGen.generateQuestions({
      userId: req.userId!,
      topicId,
      level,
      count: b.count ? parseInt(String(b.count), 10) : undefined,
      type: b.type ? String(b.type) : undefined,
      language: String(b.language ?? 'VI').toUpperCase() === 'EN' ? 'EN' : 'VI',
      useKnowledge: b.useKnowledge !== false,
    });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});
adminRouter.post('/generate/commit', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const b = req.body ?? {};
    const topicId = parseId(String(b.topicId));
    if (Number.isNaN(topicId)) { res.status(400).json({ success: false, message: 'topicId không hợp lệ' }); return; }
    const level = parseLevel(b.level);
    if (!level) { res.status(400).json({ success: false, message: 'level không hợp lệ' }); return; }
    const data = await questionGen.commitQuestions({
      authorId: req.userId!,
      topicId,
      level,
      questions: Array.isArray(b.questions) ? b.questions : [],
    });
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
});

export default router;
export { adminRouter };
