/**
 * My Language — routes.
 *
 * Exposes two routers:
 *   publicRouter → mounted at /api/v1/my-language     (public reads + authed SRS)
 *   adminRouter  → mounted at /api/v1/admin/my-language (ADMIN-only CRUD + uploads)
 *
 * Envelope { success, data, pagination? }; handlers try/catch → next(error).
 * Uploads reuse ../storage/uploadService (images → url, audio → key).
 */
import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js';
import { AppError, BadRequestError } from '../middleware/errorHandler.js';
import { uploadImage, uploadAudio, UploadError } from '../storage/uploadService.js';
import type { ApiResponse } from '../types/index.js';
import * as svc from '../services/myLanguage.service.js';
import * as aiSvc from '../services/myLanguage.ai.service.js';
import * as aiGen from '../services/myLanguage.aiGen.service.js';
import * as notebook from '../services/langNotebook.service.js';
import * as langAnalytics from '../services/langAnalytics.service.js';
import * as roadmap from '../services/myLanguage.roadmap.service.js';
import * as practice from '../services/myLanguage.practice.service.js';
import * as achievements from '../services/myLanguage.achievements.service.js';
import { isAiAvailable } from '../services/interview/llm/index.js';
import { isProEffective } from '../services/pro.service.js';

// ─── Public + authed-user router ─────────────────────────────────
const publicRouter = Router();

publicRouter.get('/', optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.getLanguages(req.user?.userId) });
  } catch (err) { next(err); }
});

// Authed-user learning engine (SRS / quiz / stats). Declared BEFORE '/:code'
// so these fixed paths are not captured by the dynamic language-code param.
publicRouter.post('/progress', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.recordProgress(req.userId!, req.body) });
  } catch (err) { next(err); }
});

publicRouter.get('/review-queue', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.getReviewQueue(req.userId!, req.query.languageCode as string | undefined) });
  } catch (err) { next(err); }
});

publicRouter.post('/quiz-result', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.status(201).json({ success: true, data: await svc.recordQuizResult(req.userId!, req.body) });
  } catch (err) { next(err); }
});

publicRouter.get('/stats', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.getStats(req.userId!, req.query.languageCode as string | undefined) });
  } catch (err) { next(err); }
});

// Favorites & collections (per-user vocab playlists). Fixed paths — must
// stay above the '/:code' wildcard like the SRS routes.
publicRouter.post('/favorites/toggle', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.toggleFavorite(req.userId!, req.body) });
  } catch (err) { next(err); }
});

publicRouter.get('/favorites/:code', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.getFavorites(req.userId!, req.params.code) });
  } catch (err) { next(err); }
});

publicRouter.get('/favorites/:code/ids', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.getFavoriteIds(req.userId!, req.params.code) });
  } catch (err) { next(err); }
});

publicRouter.get('/collections', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.listCollections(req.userId!, String(req.query.code ?? '')) });
  } catch (err) { next(err); }
});

publicRouter.post('/collections', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.status(201).json({ success: true, data: await svc.createCollection(req.userId!, req.body) });
  } catch (err) { next(err); }
});

publicRouter.put('/collections/:id', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.updateCollection(req.userId!, Number(req.params.id), req.body) });
  } catch (err) { next(err); }
});

publicRouter.delete('/collections/:id', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.deleteCollection(req.userId!, Number(req.params.id)) });
  } catch (err) { next(err); }
});

publicRouter.get('/collections/:id/words', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.getCollectionWords(req.userId!, Number(req.params.id)) });
  } catch (err) { next(err); }
});

publicRouter.post('/collections/:id/words', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.addWordsToCollection(req.userId!, Number(req.params.id), req.body) });
  } catch (err) { next(err); }
});

publicRouter.delete('/collections/:id/words/:wordId', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.removeWordFromCollection(req.userId!, Number(req.params.id), Number(req.params.wordId)) });
  } catch (err) { next(err); }
});

// AI tutor (Pro/Max) — gia sư giải thích ngữ pháp/từ vựng. Fixed paths, must
// stay above the '/:code' wildcard.
publicRouter.post('/ai/explain', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await aiSvc.explainConcept(req.userId!, req.body) });
  } catch (err) { next(err); }
});

// AI pronunciation scoring (Pro/Max). Audio held in memory only (PII), never
// persisted — dedicated multer, not the admin `upload` const defined below.
const aiAudioUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
publicRouter.post('/ai/pronounce', authenticate, aiAudioUpload.single('audio'), async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const f = req.file;
    if (!f?.buffer?.length) throw new BadRequestError('Thiếu audio');
    res.json({
      success: true,
      data: await aiSvc.scorePronunciation(req.userId!, {
        audio: f.buffer,
        filename: f.originalname || 'clip.webm',
        mimetype: f.mimetype || 'audio/webm',
        languageCode: String(req.body?.languageCode ?? ''),
        target: String(req.body?.target ?? ''),
        reading: req.body?.reading ? String(req.body.reading) : undefined,
      }),
    });
  } catch (err) { next(err); }
});

publicRouter.get('/ai/status', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: { available: isAiAvailable(), isPro: await isProEffective(req.userId!) } });
  } catch (err) { next(err); }
});

publicRouter.post('/ai/quiz', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await aiSvc.generateQuiz(req.userId!, req.body) });
  } catch (err) { next(err); }
});

publicRouter.post('/ai/grade', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await aiSvc.gradeAnswer(req.userId!, req.body) });
  } catch (err) { next(err); }
});

publicRouter.post('/ai/writing', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await aiSvc.gradeWriting(req.userId!, req.body) });
  } catch (err) { next(err); }
});

publicRouter.post('/ai/roleplay', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await aiSvc.rolePlayTurn(req.userId!, req.body) });
  } catch (err) { next(err); }
});

publicRouter.post('/ai/stt', authenticate, aiAudioUpload.single('audio'), async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const f = req.file;
    if (!f?.buffer?.length) throw new BadRequestError('Thiếu audio');
    res.json({
      success: true,
      data: await aiSvc.transcribe(req.userId!, {
        audio: f.buffer,
        filename: f.originalname || 'clip.webm',
        mimetype: f.mimetype || 'audio/webm',
        languageCode: String(req.body?.languageCode ?? ''),
      }),
    });
  } catch (err) { next(err); }
});

// ─── Roadmap (learning path). Fixed '/roadmap/*' mutation path declared
//     before the '/:code' wildcard; the per-language read is a '/:code/*' path.
publicRouter.post('/roadmap/:nodeId/done', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await roadmap.toggleDone(req.userId!, Number(req.params.nodeId)) });
  } catch (err) { next(err); }
});

// ─── Practice (Duolingo-style). Fixed '/practice/*' mutation paths declared
//     before the '/:code' wildcard; the per-language overview is a '/:code/*' path.
publicRouter.post('/practice/complete', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await practice.completeLesson(req.userId!, String(req.body?.languageCode ?? ''), req.body) });
  } catch (err) { next(err); }
});
publicRouter.post('/practice/reminder', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await practice.updateReminder(req.userId!, String(req.body?.languageCode ?? ''), req.body) });
  } catch (err) { next(err); }
});

// ─── Notebook (per-user; authed). Fixed '/notebook/*' paths — declared
//     before the '/:code' wildcard; specific paths before '/notebook/:code'.
publicRouter.get('/notebook/languages', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await notebook.listLanguages(req.userId!) }); } catch (err) { next(err); }
});
publicRouter.get('/notebook/entry/:id', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await notebook.getEntry(req.userId!, Number(req.params.id)) }); } catch (err) { next(err); }
});
publicRouter.post('/notebook/folders', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await notebook.createFolder(req.userId!, req.body) }); } catch (err) { next(err); }
});
publicRouter.put('/notebook/folders/:id', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await notebook.renameFolder(req.userId!, Number(req.params.id), req.body) }); } catch (err) { next(err); }
});
publicRouter.patch('/notebook/folders/:id/move', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await notebook.moveFolder(req.userId!, Number(req.params.id), req.body) }); } catch (err) { next(err); }
});
publicRouter.delete('/notebook/folders/:id', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await notebook.deleteFolder(req.userId!, Number(req.params.id)) }); } catch (err) { next(err); }
});
publicRouter.post('/notebook/entries', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await notebook.createEntry(req.userId!, req.body) }); } catch (err) { next(err); }
});
publicRouter.patch('/notebook/entries/reorder', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await notebook.reorderEntries(req.userId!, req.body) }); } catch (err) { next(err); }
});
publicRouter.put('/notebook/entries/:id', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await notebook.updateEntry(req.userId!, Number(req.params.id), req.body) }); } catch (err) { next(err); }
});
publicRouter.patch('/notebook/entries/:id/move', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await notebook.moveEntry(req.userId!, Number(req.params.id), req.body) }); } catch (err) { next(err); }
});
publicRouter.patch('/notebook/entries/:id/review', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await notebook.reviewEntry(req.userId!, Number(req.params.id), req.body) }); } catch (err) { next(err); }
});
publicRouter.delete('/notebook/entries/:id', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await notebook.deleteEntry(req.userId!, Number(req.params.id)) }); } catch (err) { next(err); }
});
publicRouter.post('/notebook/save', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await notebook.saveFromAi(req.userId!, req.body) }); } catch (err) { next(err); }
});
publicRouter.get('/notebook/:code', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await notebook.getTree(req.userId!, req.params.code) }); } catch (err) { next(err); }
});

// Per-language public content
publicRouter.get('/:code', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.getLanguageOverview(req.params.code) });
  } catch (err) { next(err); }
});

publicRouter.get('/:code/alphabet', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.getAlphabet(req.params.code) });
  } catch (err) { next(err); }
});

publicRouter.get('/:code/vocab/categories', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.getVocabCategories(req.params.code) });
  } catch (err) { next(err); }
});

publicRouter.get('/:code/vocab/search', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.searchVocab(req.params.code, String(req.query.q ?? '')) });
  } catch (err) { next(err); }
});

publicRouter.get('/:code/vocab', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { items, pagination } = await svc.getVocab(req.params.code, req.query);
    res.json({ success: true, data: items, pagination });
  } catch (err) { next(err); }
});

publicRouter.get('/:code/dictionary', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.getDictionary(req.params.code) });
  } catch (err) { next(err); }
});

publicRouter.get('/:code/grammar', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { items, levels, pagination } = await svc.getGrammar(req.params.code, req.query);
    res.json({ success: true, data: { items, levels }, pagination });
  } catch (err) { next(err); }
});

publicRouter.get('/:code/listening', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { items, levels, pagination } = await svc.getListening(req.params.code, req.query);
    res.json({ success: true, data: items, levels, pagination } as never);
  } catch (err) { next(err); }
});

publicRouter.get('/:code/conversation', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { items, levels, pagination } = await svc.getConversation(req.params.code, req.query);
    res.json({ success: true, data: items, levels, pagination } as never);
  } catch (err) { next(err); }
});

publicRouter.get('/:code/reading', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { items, levels, pagination } = await svc.getReading(req.params.code, req.query);
    res.json({ success: true, data: items, levels, pagination } as never);
  } catch (err) { next(err); }
});

publicRouter.get('/:code/qna', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { items, levels, pagination } = await svc.getQna(req.params.code, req.query);
    res.json({ success: true, data: items, levels, pagination } as never);
  } catch (err) { next(err); }
});

// Roadmap — public read; optionalAuth so a logged-in user also gets doneNodeIds.
publicRouter.get('/:code/roadmap', optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await roadmap.getRoadmap(req.params.code, req.user?.userId) });
  } catch (err) { next(err); }
});

// Practice — per-user game state + lesson path (auth required, like Duolingo).
publicRouter.get('/:code/practice', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await practice.getOverview(req.userId!, req.params.code) });
  } catch (err) { next(err); }
});

// Weekly leaderboard for a language.
publicRouter.get('/:code/practice/leaderboard', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await practice.getLeaderboard(req.userId!, req.params.code) });
  } catch (err) { next(err); }
});

// Level + achievement badges (computed) for a language.
publicRouter.get('/:code/practice/achievements', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await achievements.getAchievements(req.userId!, req.params.code) });
  } catch (err) { next(err); }
});

// ─── Admin router (ADMIN only) ───────────────────────────────────
const adminRouter = Router();
adminRouter.use(authenticate, requireRole('ADMIN'));

// Learning analytics (per-user). ADMIN-gated by the router above.
adminRouter.get('/analytics/overview', async (_req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await langAnalytics.overview() }); } catch (err) { next(err); }
});
adminRouter.get('/analytics/users', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await langAnalytics.perUser({ keyword: req.query.keyword as string | undefined, limit: Number(req.query.limit) || undefined }) }); } catch (err) { next(err); }
});
adminRouter.get('/analytics/users/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await langAnalytics.userDetail(Number(req.params.id)) }); } catch (err) { next(err); }
});

// AI content generation (preview → commit). ADMIN-gated by the router above.
adminRouter.post('/ai/generate', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await aiGen.adminGenerate(req.userId!, req.body) });
  } catch (err) { next(err); }
});
adminRouter.post('/ai/commit', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await aiGen.adminCommit(req.userId!, req.body) });
  } catch (err) { next(err); }
});

// Roadmap admin: CRUD + reorder + one-click seed (English / Japanese starters).
adminRouter.get('/:code/roadmap/nodes', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await roadmap.adminListNodes(req.params.code) }); } catch (err) { next(err); }
});
adminRouter.post('/languages/:id/roadmap/nodes', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await roadmap.adminCreateNode(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.put('/roadmap/nodes/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await roadmap.adminUpdateNode(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.delete('/roadmap/nodes/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await roadmap.adminDeleteNode(toId(req)) }); } catch (err) { next(err); }
});
adminRouter.patch('/roadmap/reorder', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await roadmap.adminReorder(req.body?.items) }); } catch (err) { next(err); }
});
adminRouter.post('/roadmap/seed', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const force = !!req.body?.force;
    const data = req.body?.all
      ? await roadmap.seedAllRoadmaps({ force })
      : await roadmap.seedRoadmap(String(req.body?.code ?? ''), { force });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});
// Distribute vocab categories onto vocab nodes so Practice groups by stage.
adminRouter.post('/:code/roadmap/auto-assign', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await roadmap.autoAssignCategories(req.params.code, { force: !!req.body?.force }) });
  } catch (err) { next(err); }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const images = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const audios = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/m4a', 'audio/x-m4a', 'audio/webm', 'audio/ogg'];
    if (file.fieldname === 'image' && images.includes(file.mimetype)) return cb(null, true);
    if (file.fieldname === 'audio' && audios.includes(file.mimetype)) return cb(null, true);
    cb(new Error(`Định dạng không hỗ trợ: ${file.mimetype}`));
  },
});

function toId(req: Request, key = 'id'): number {
  return svc.toInt(req.params[key], key);
}

// Uploads → return url/key for the admin form to persist on a model
adminRouter.post('/upload/image', upload.single('image'), async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const file = req.file;
    if (!file) throw new BadRequestError('Thiếu file ảnh');
    if (file.size > 10 * 1024 * 1024) throw new BadRequestError('Ảnh quá lớn (tối đa 10MB)');
    const r = await uploadImage(
      { buffer: file.buffer, originalName: file.originalname, mimetype: file.mimetype, size: file.size },
      'images/thumbnails',
      { userId: req.userId },
    );
    res.status(201).json({ success: true, data: { url: r.url, key: r.key } });
  } catch (err) {
    if (err instanceof UploadError) return next(new AppError(err.message, err.status, err.code));
    next(err);
  }
});

adminRouter.post('/upload/audio', upload.single('audio'), async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const file = req.file;
    if (!file) throw new BadRequestError('Thiếu file audio');
    const r = await uploadAudio(
      { buffer: file.buffer, originalName: file.originalname, mimetype: file.mimetype, size: file.size },
      { userId: req.userId, kind: 'songs' },
    );
    res.status(201).json({ success: true, data: { key: r.key, url: r.url } });
  } catch (err) {
    if (err instanceof UploadError) return next(new AppError(err.message, err.status, err.code));
    next(err);
  }
});

// Languages
adminRouter.get('/languages', async (_req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.adminListLanguages() }); } catch (err) { next(err); }
});
adminRouter.post('/languages', async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await svc.createLanguage(req.body) }); } catch (err) { next(err); }
});
adminRouter.put('/languages/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.updateLanguage(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.delete('/languages/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.deleteLanguage(toId(req)) }); } catch (err) { next(err); }
});

// Reorder (generic): body { model, items:[{id,order}] }
adminRouter.patch('/reorder', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { model, items } = req.body as { model: svc.ReorderModel; items: Array<{ id: number; order: number }> };
    res.json({ success: true, data: await svc.reorder(model, items) });
  } catch (err) { next(err); }
});

// Content fetch (all rows for a language section)
adminRouter.get('/:code/content/:section', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.adminGetLanguageContent(req.params.code, req.params.section) }); } catch (err) { next(err); }
});
adminRouter.get('/vocab/categories/:id/words', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { items, pagination } = await svc.adminGetVocabWords(toId(req), req.query);
    res.json({ success: true, data: items, pagination });
  } catch (err) { next(err); }
});

// Alphabet groups + items (languageId / groupId in path where needed)
adminRouter.post('/languages/:id/alphabet-groups', async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await svc.createAlphabetGroup(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.put('/alphabet-groups/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.updateAlphabetGroup(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.delete('/alphabet-groups/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.deleteAlphabetGroup(toId(req)) }); } catch (err) { next(err); }
});
adminRouter.post('/alphabet-groups/:id/items', async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await svc.createAlphabetItem(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.post('/alphabet-groups/:id/bulk', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.bulkAddAlphabetItems(toId(req), String(req.body?.text ?? '')) }); } catch (err) { next(err); }
});
adminRouter.put('/alphabet-items/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.updateAlphabetItem(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.delete('/alphabet-items/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.deleteAlphabetItem(toId(req)) }); } catch (err) { next(err); }
});

// Vocab categories / words / CSV
adminRouter.post('/languages/:id/vocab-categories', async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await svc.createVocabCategory(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.put('/vocab-categories/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.updateVocabCategory(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.delete('/vocab-categories/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.deleteVocabCategory(toId(req)) }); } catch (err) { next(err); }
});
adminRouter.post('/vocab-categories/:id/words', async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await svc.createVocabWord(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.put('/vocab-words/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.updateVocabWord(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.delete('/vocab-words/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.deleteVocabWord(toId(req)) }); } catch (err) { next(err); }
});
// CSV: preview (validate only) + import (commit)
adminRouter.post('/vocab-categories/:id/csv/preview', async (req, res: Response<ApiResponse>, next) => {
  try {
    toId(req); // validate id
    res.json({ success: true, data: svc.parseVocabCsv(String(req.body?.csv ?? '')).results });
  } catch (err) { next(err); }
});
adminRouter.post('/vocab-categories/:id/csv/import', async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await svc.importVocabCsv(toId(req), String(req.body?.csv ?? '')) }); } catch (err) { next(err); }
});

// Grammar
adminRouter.post('/languages/:id/grammar', async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await svc.createGrammar(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.put('/grammar/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.updateGrammar(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.delete('/grammar/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.deleteGrammar(toId(req)) }); } catch (err) { next(err); }
});

// Listening
adminRouter.post('/languages/:id/listening', async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await svc.createListening(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.put('/listening/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.updateListening(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.delete('/listening/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.deleteListening(toId(req)) }); } catch (err) { next(err); }
});

// Conversation
adminRouter.post('/languages/:id/conversation', async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await svc.createConversation(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.put('/conversation/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.updateConversation(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.delete('/conversation/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.deleteConversation(toId(req)) }); } catch (err) { next(err); }
});

// Reading
adminRouter.post('/languages/:id/reading', async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await svc.createReading(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.put('/reading/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.updateReading(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.delete('/reading/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.deleteReading(toId(req)) }); } catch (err) { next(err); }
});

// Q&A
adminRouter.post('/languages/:id/qna', async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await svc.createQna(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.put('/qna/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.updateQna(toId(req), req.body) }); } catch (err) { next(err); }
});
adminRouter.delete('/qna/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.deleteQna(toId(req)) }); } catch (err) { next(err); }
});

export { publicRouter, adminRouter };
