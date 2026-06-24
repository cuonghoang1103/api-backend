/**
 * Notes routes — personal study notebooks (per-user).
 * ────────────────────────────────────────────────────────────
 * Mounted at /api/v1/notes. `router.use(authenticate)` makes every
 * route require a logged-in session; the handlers pass `req.userId!`
 * into the service, which scopes every query by userId. There is no
 * admin gate — each user manages only their own notes (mirrors the
 * Hub routes pattern).
 */
import { Router, type Response, type Request } from 'express';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import {
  getTree,
  getRecentNotes,
  createSubject,
  updateSubject,
  deleteSubject,
  reorderSubjects,
  createChapter,
  updateChapter,
  deleteChapter,
  reorderChapters,
  createNote,
  getNote,
  updateNote,
  deleteNote,
  reorderNotes,
  getSubject,
  addAttachment,
  deleteAttachment,
  addLink,
  updateLink,
  deleteLink,
  searchNotes,
  listTags,
  listVocab,
  addVocab,
  updateVocab,
  deleteVocab,
  reorderVocab,
} from '../services/notes.service.js';

const router = Router();
router.use(authenticate);

// ─── Tree + recent ───────────────────────────────────────────
router.get('/tree', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const [tree, recent] = await Promise.all([getTree(req.userId!), getRecentNotes(req.userId!)]);
    res.json({ success: true, data: { tree, recent } });
  } catch (err) { next(err); }
});

// ─── Subjects ────────────────────────────────────────────────
router.post('/subjects', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const subject = await createSubject(req.userId!, req.body ?? {});
    res.status(201).json({ success: true, data: subject });
  } catch (err) { next(err); }
});

router.patch('/subjects/reorder', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const result = await reorderSubjects(req.userId!, req.body?.orderedIds);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.patch('/subjects/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const subject = await updateSubject(req.userId!, Number(req.params.id), req.body ?? {});
    res.json({ success: true, data: subject });
  } catch (err) { next(err); }
});

router.get('/subjects/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const subject = await getSubject(req.userId!, Number(req.params.id));
    res.json({ success: true, data: subject });
  } catch (err) { next(err); }
});

router.delete('/subjects/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const result = await deleteSubject(req.userId!, Number(req.params.id));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// ─── Chapters ────────────────────────────────────────────────
router.post('/chapters', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const chapter = await createChapter(req.userId!, req.body ?? {});
    res.status(201).json({ success: true, data: chapter });
  } catch (err) { next(err); }
});

router.patch('/chapters/reorder', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const result = await reorderChapters(req.userId!, Number(req.body?.subjectId), req.body?.orderedIds);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.patch('/chapters/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const chapter = await updateChapter(req.userId!, Number(req.params.id), req.body ?? {});
    res.json({ success: true, data: chapter });
  } catch (err) { next(err); }
});

router.delete('/chapters/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const result = await deleteChapter(req.userId!, Number(req.params.id));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// ─── Notes ───────────────────────────────────────────────────
router.post('/notes', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const note = await createNote(req.userId!, req.body ?? {});
    res.status(201).json({ success: true, data: note });
  } catch (err) { next(err); }
});

router.patch('/notes/reorder', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const result = await reorderNotes(req.userId!, req.body?.orderedIds);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.get('/notes/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const note = await getNote(req.userId!, Number(req.params.id));
    res.json({ success: true, data: note });
  } catch (err) { next(err); }
});

router.patch('/notes/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const note = await updateNote(req.userId!, Number(req.params.id), req.body ?? {});
    res.json({ success: true, data: note });
  } catch (err) { next(err); }
});

router.delete('/notes/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const result = await deleteNote(req.userId!, Number(req.params.id));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// ─── Attachments (note OR subject level) ─────────────────────
router.post('/attachments', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const att = await addAttachment(req.userId!, req.body ?? {});
    res.status(201).json({ success: true, data: att });
  } catch (err) { next(err); }
});

router.delete('/attachments/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const result = await deleteAttachment(req.userId!, Number(req.params.id));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// ─── Links (note OR subject level) ───────────────────────────
router.post('/links', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const link = await addLink(req.userId!, req.body ?? {});
    res.status(201).json({ success: true, data: link });
  } catch (err) { next(err); }
});

router.patch('/links/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const link = await updateLink(req.userId!, Number(req.params.id), req.body ?? {});
    res.json({ success: true, data: link });
  } catch (err) { next(err); }
});

router.delete('/links/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const result = await deleteLink(req.userId!, Number(req.params.id));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// ─── Search + tags ───────────────────────────────────────────
router.get('/search', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const results = await searchNotes(req.userId!, {
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
      subjectId: req.query.subjectId ? Number(req.query.subjectId) : undefined,
      tag: typeof req.query.tag === 'string' ? req.query.tag : undefined,
    });
    res.json({ success: true, data: results });
  } catch (err) { next(err); }
});

router.get('/tags', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const tags = await listTags(req.userId!);
    res.json({ success: true, data: tags });
  } catch (err) { next(err); }
});

// ─── Vocabulary (per note) ───────────────────────────────────
router.get('/vocab', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const items = await listVocab(req.userId!, Number(req.query.noteId));
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

router.post('/vocab', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const entry = await addVocab(req.userId!, req.body ?? {});
    res.status(201).json({ success: true, data: entry });
  } catch (err) { next(err); }
});

router.patch('/vocab/reorder', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const result = await reorderVocab(req.userId!, Number(req.body?.noteId), req.body?.orderedIds);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.patch('/vocab/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const entry = await updateVocab(req.userId!, Number(req.params.id), req.body ?? {});
    res.json({ success: true, data: entry });
  } catch (err) { next(err); }
});

router.delete('/vocab/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const result = await deleteVocab(req.userId!, Number(req.params.id));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

export default router;
