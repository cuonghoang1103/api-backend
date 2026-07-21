/**
 * ============================================================
 * Code Lab — REST routes  (mounted at /api/v1/code-lab)
 * ============================================================
 *
 * Public:
 *  - GET  /groups                       — full group ▸ track tree
 *  - GET  /tracks/:slug                 — track roadmap (modules + exercises)
 *  - GET  /exercises/:slug              — one exercise (full)
 *  - GET  /exercises                    — list/filter/paginate
 *  - GET  /search  ? q=                 — full-text search
 *  - GET  /autocomplete ? q=            — search suggestions
 *  - GET  /stats
 * Authenticated (any logged-in user):
 *  - POST /exercises/:id/progress       — save attempt / mark solved
 *  - GET  /progress/mine ? trackId=
 * Admin / Editor:
 *  - CRUD groups / tracks / modules / exercises
 *  - POST /admin/ai/roadmap             — AI roadmap proposal (preview)
 *  - POST /admin/ai/exercises/generate  — AI exercise batch (preview)
 *  - POST /admin/ai/exercises/commit    — persist reviewed exercises
 *  - POST /bulk-import                  — import an array of exercises
 */
import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js';
import { BadRequestError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import * as codeLab from '../services/codeLab.service.js';
import * as explainService from '../services/codeLab.explain.service.js';
import * as coachService from '../services/codeLab.coach.service.js';
import * as workspace from '../services/codeLab.workspace.service.js';
import { generateRoadmap, generateExercises, commitExercises } from '../services/codeLab.ai.service.js';
import { generateLesson, commitLesson, getModuleLesson, clearLesson } from '../services/codeLab.lesson.service.js';

const router = Router();

// Soft admin/editor check from the (optional) JWT — used only to reveal DRAFT
// content in admin views. Mutations are hard-gated by requireRole below.
function isEditor(req: Request): boolean {
  const roles = req.user?.roles || [];
  return roles.some((r) => ['ADMIN', 'EDITOR'].includes(r.toUpperCase().replace('ROLE_', '')));
}

// ════════════════════════════ Public ════════════════════════════

// GET /groups — group ▸ track tree (published tracks for anon; all for editors)
router.get('/groups', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await codeLab.getGroupsTree({ admin: isEditor(req) });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// GET /stats
router.get('/stats', async (_req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await codeLab.getStats() });
  } catch (e) { next(e); }
});

// GET /autocomplete?q=
router.get('/autocomplete', async (req, res: Response<ApiResponse>, next) => {
  try {
    const q = String(req.query.q || '');
    const data = await codeLab.autocomplete(q, Number(req.query.limit) || 8);
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// GET /search?q=
router.get('/search', async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await codeLab.listExercises({
      search: String(req.query.q || ''),
      trackId: req.query.trackId ? Number(req.query.trackId) : undefined,
      groupId: req.query.groupId ? Number(req.query.groupId) : undefined,
      language: req.query.language ? String(req.query.language) : undefined,
      difficulty: req.query.difficulty ? (String(req.query.difficulty) as any) : undefined,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// GET /exercises — list/filter
router.get('/exercises', async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await codeLab.listExercises({
      trackId: req.query.trackId ? Number(req.query.trackId) : undefined,
      moduleId: req.query.moduleId ? Number(req.query.moduleId) : undefined,
      groupId: req.query.groupId ? Number(req.query.groupId) : undefined,
      language: req.query.language ? String(req.query.language) : undefined,
      difficulty: req.query.difficulty ? (String(req.query.difficulty) as any) : undefined,
      search: req.query.q ? String(req.query.q) : undefined,
      sort: (req.query.sort as any) || 'newest',
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// GET /tracks/:slug — roadmap
router.get('/tracks/:slug', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await codeLab.getTrackBySlug(req.params.slug, { admin: isEditor(req) });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// GET /exercises/:slug — full exercise
router.get('/exercises/:slug', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await codeLab.getExerciseBySlug(req.params.slug, { admin: isEditor(req) });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// ══════════════════════ Authenticated user ══════════════════════

// POST /exercises/:id/progress — save attempt / mark solved
router.post('/exercises/:id(\\d+)/progress', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.user!.userId;
    const id = parseInt(req.params.id);
    const { status, savedCode } = req.body as { status?: 'IN_PROGRESS' | 'SOLVED'; savedCode?: unknown };
    const data = await codeLab.upsertProgress(userId, id, { status, savedCode });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// GET /progress/mine?trackId=
// ─── AI explanation of one exercise (Pro only) ──────────────────
// The cached explanation is readable by any signed-in user; GENERATING one and
// asking follow-ups costs tokens and is Pro-gated inside the service.
router.get('/exercises/:id(\\d+)/ai/explain', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const out = await explainService.readExplanation(Number(req.params.id));
    res.json({ success: true, data: out });
  } catch (e) { next(e); }
});

router.post('/exercises/:id(\\d+)/ai/explain', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const out = await explainService.explainExercise(Number(req.params.id), {
      userId: req.user!.userId,
      force: !!req.body?.force,
    });
    res.json({ success: true, data: out });
  } catch (e) { next(e); }
});

router.post('/exercises/:id(\\d+)/ai/ask', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const out = await explainService.askFollowUp(Number(req.params.id), {
      userId: req.user!.userId,
      question: String(req.body?.question || ''),
      history: Array.isArray(req.body?.history) ? req.body.history : [],
    });
    res.json({ success: true, data: out });
  } catch (e) { next(e); }
});

// ─── Practice coach: oral defence + spec compliance (Pro only) ──
router.post('/exercises/:id(\\d+)/coach/viva', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const mode = req.body?.mode === 'change' ? 'change' : 'explain';
    const out = await coachService.askViva(Number(req.params.id), {
      userId: req.user!.userId,
      mode,
      asked: Array.isArray(req.body?.asked) ? req.body.asked.map(String) : [],
    });
    res.json({ success: true, data: out });
  } catch (e) { next(e); }
});

router.post('/exercises/:id(\\d+)/coach/grade', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const out = await coachService.gradeViva(Number(req.params.id), {
      userId: req.user!.userId,
      question: String(req.body?.question || ''),
      answer: String(req.body?.answer || ''),
      mode: req.body?.mode === 'change' ? 'change' : 'explain',
    });
    res.json({ success: true, data: out });
  } catch (e) { next(e); }
});

router.post('/exercises/:id(\\d+)/coach/check', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const out = await coachService.checkAgainstBrief(Number(req.params.id), {
      userId: req.user!.userId,
      code: String(req.body?.code || ''),
    });
    res.json({ success: true, data: out });
  } catch (e) { next(e); }
});

// Whole-project review. The zip is read in memory and thrown away — nothing is
// stored, same as the paste box; 30MB matches the interview upload, and a LAB211
// submission is three orders of magnitude smaller than that.
const projectZipUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024, files: 1 },
});

router.post(
  '/exercises/:id(\\d+)/coach/check-zip',
  authenticate,
  projectZipUpload.single('file'),
  async (req, res: Response<ApiResponse>, next) => {
    try {
      if (!req.file?.buffer?.length) throw new BadRequestError('Hãy chọn file .zip của project.');
      const out = await coachService.checkProjectAgainstBrief(Number(req.params.id), {
        userId: req.user!.userId,
        zip: req.file.buffer,
        zipName: req.file.originalname,
      });
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  },
);

// ─── Workspace ↔ NetBeans ───────────────────────────────────────
// Export what the learner wrote as a project folder they can open in the IDE;
// import a project they built in the IDE back into the editor. Neither stores
// anything: the page saves through the normal progress endpoint.

router.post('/exercises/:id(\\d+)/workspace/export', authenticate, async (req, res, next) => {
  try {
    const buf = workspace.exportWorkspaceZip(req.body?.files, String(req.body?.name || 'project'));
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${String(req.body?.name || 'project').replace(/[^a-zA-Z0-9._-]+/g, '-')}.zip"`);
    res.send(buf);
  } catch (e) { next(e); }
});

router.post(
  '/exercises/:id(\\d+)/workspace/import',
  authenticate,
  projectZipUpload.single('file'),
  async (req, res: Response<ApiResponse>, next) => {
    try {
      if (!req.file?.buffer?.length) throw new BadRequestError('Hãy chọn file .zip của project.');
      res.json({ success: true, data: workspace.importWorkspaceZip(req.file.buffer) });
    } catch (e) { next(e); }
  },
);

router.get('/tracks/:slug/skills', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const out = await codeLab.getSkillCoverage(req.params.slug, req.user?.userId ?? null);
    res.json({ success: true, data: out });
  } catch (e) { next(e); }
});

router.get('/progress/mine', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.user!.userId;
    const trackId = req.query.trackId ? Number(req.query.trackId) : undefined;
    const data = await codeLab.getMyProgress(userId, trackId);
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// ══════════════════════ Admin / Editor: Groups ══════════════════

router.post('/groups', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await codeLab.createGroup(req.body) }); } catch (e) { next(e); }
});
router.put('/groups/:id(\\d+)', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await codeLab.updateGroup(parseInt(req.params.id), req.body) }); } catch (e) { next(e); }
});
router.delete('/groups/:id(\\d+)', authenticate, requireRole('ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try { res.json((await codeLab.deleteGroup(parseInt(req.params.id)), { success: true, message: "Deleted" })); } catch (e) { next(e); }
});

// ══════════════════════ Admin / Editor: Tracks ══════════════════

router.post('/tracks', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await codeLab.createTrack(req.body) }); } catch (e) { next(e); }
});
router.put('/tracks/:id(\\d+)', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await codeLab.updateTrack(parseInt(req.params.id), req.body) }); } catch (e) { next(e); }
});
router.delete('/tracks/:id(\\d+)', authenticate, requireRole('ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try { res.json((await codeLab.deleteTrack(parseInt(req.params.id)), { success: true, message: "Deleted" })); } catch (e) { next(e); }
});

// ══════════════════════ Admin / Editor: Modules ═════════════════

router.post('/modules', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await codeLab.createModule(req.body) }); } catch (e) { next(e); }
});
router.put('/modules/:id(\\d+)', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await codeLab.updateModule(parseInt(req.params.id), req.body) }); } catch (e) { next(e); }
});
router.delete('/modules/:id(\\d+)', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try { res.json((await codeLab.deleteModule(parseInt(req.params.id)), { success: true, message: "Deleted" })); } catch (e) { next(e); }
});

// ══════════════════════ Admin / Editor: Exercises ═══════════════

// GET one exercise by id (editor — includes DRAFT) for the admin editor.
router.get('/admin/exercises/:id(\\d+)', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await codeLab.getExerciseById(parseInt(req.params.id)) }); } catch (e) { next(e); }
});
router.post('/exercises', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await codeLab.createExercise(req.body, req.user?.userId) }); } catch (e) { next(e); }
});
router.put('/exercises/:id(\\d+)', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await codeLab.updateExercise(parseInt(req.params.id), req.body) }); } catch (e) { next(e); }
});
router.delete('/exercises/:id(\\d+)', authenticate, requireRole('ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try { res.json((await codeLab.deleteExercise(parseInt(req.params.id)), { success: true, message: "Deleted" })); } catch (e) { next(e); }
});

// POST /bulk-import — array of exercises
router.post('/bulk-import', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { exercises, defaultModuleId } = req.body as { exercises: codeLab.BulkExerciseItem[]; defaultModuleId?: number };
    const data = await codeLab.bulkImportExercises(exercises || [], defaultModuleId, req.user?.userId);
    res.status(201).json({ success: true, data });
  } catch (e) { next(e); }
});

// ══════════════════════ Admin / Editor: AI ══════════════════════

router.post('/admin/ai/roadmap', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await generateRoadmap(req.user!.userId, req.body) }); } catch (e) { next(e); }
});
router.post('/admin/ai/exercises/generate', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await generateExercises(req.user!.userId, req.body) }); } catch (e) { next(e); }
});
router.post('/admin/ai/exercises/commit', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await commitExercises(req.user!.userId, req.body) }); } catch (e) { next(e); }
});

// ─── Module LESSON (NTU-style tutorial) ──────────────────────────
// Public: full lesson for one module (fetched on demand, not in the tree).
router.get('/modules/:id(\\d+)/lesson', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await getModuleLesson(parseInt(req.params.id)) }); } catch (e) { next(e); }
});
router.post('/admin/ai/lesson/generate', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await generateLesson(req.user!.userId, req.body) }); } catch (e) { next(e); }
});
router.post('/admin/ai/lesson/commit', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await commitLesson(req.user!.userId, req.body) }); } catch (e) { next(e); }
});
router.delete('/modules/:id(\\d+)/lesson', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try { await clearLesson(parseInt(req.params.id)); res.json({ success: true, message: 'Lesson cleared' }); } catch (e) { next(e); }
});

export default router;
