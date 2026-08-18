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
  duplicateNote,
  getNote,
  updateNote,
  deleteNote,
  restoreDeletedNote,
  permanentlyDeleteNote,
  listNoteVersions,
  getNoteVersion,
  createManualNoteVersion,
  restoreNoteVersion,
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
  listFlashcards,
  gradeFlashcard,
  resetFlashcard,
  listFilteredNotes,
  type NoteFilter,
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
// Phase 3d: filter endpoint for the sidebar pills. Accepts
// `?f=all|favorites|archive|needs-review` (default `all`). Returned
// shape matches NoteSummary so the sidebar can render rows directly.
router.get('/notes/filter', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const raw = String(req.query.f ?? 'all').toLowerCase();
    const filter: NoteFilter = (['all', 'favorites', 'archive', 'needs-review', 'trash'] as const).includes(raw as NoteFilter)
      ? (raw as NoteFilter)
      : 'all';
    const notes = await listFilteredNotes(req.userId!, filter);
    res.json({ success: true, data: { filter, notes } });
  } catch (err) { next(err); }
});

router.post('/notes', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const note = await createNote(req.userId!, req.body ?? {});
    res.status(201).json({ success: true, data: note });
  } catch (err) { next(err); }
});

router.post('/notes/:id/duplicate', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const note = await duplicateNote(req.userId!, Number(req.params.id));
    res.status(201).json({ success: true, data: note });
  } catch (err) { next(err); }
});

router.patch('/notes/reorder', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const result = await reorderNotes(req.userId!, req.body?.orderedIds);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.post('/notes/:id/restore', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const note = await restoreDeletedNote(req.userId!, Number(req.params.id));
    res.json({ success: true, data: note });
  } catch (err) { next(err); }
});

router.delete('/notes/:id/permanent', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const result = await permanentlyDeleteNote(req.userId!, Number(req.params.id));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// ─── Sub-pages, backlinks and the reference graph (Phase 6) ──

router.get('/graph', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const { referenceGraph } = await import('../services/notesHierarchy.service.js');
    res.json({ success: true, data: await referenceGraph(req.userId!) });
  } catch (err) { next(err); }
});

router.patch('/notes/:id/parent', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const { setNoteParent } = await import('../services/notesHierarchy.service.js');
    const raw = req.body?.parentNoteId;
    const parentNoteId = raw === null || raw === undefined || raw === '' ? null : Number(raw);
    const note = await setNoteParent(req.userId!, Number(req.params.id), parentNoteId);
    res.json({ success: true, data: note });
  } catch (err) { next(err); }
});

router.get('/notes/:id/children', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const { childrenOf } = await import('../services/notesHierarchy.service.js');
    res.json({ success: true, data: await childrenOf(req.userId!, Number(req.params.id)) });
  } catch (err) { next(err); }
});

router.get('/notes/:id/backlinks', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const { ancestorsOf, backlinksOf, outgoingLinksOf } = await import('../services/notesHierarchy.service.js');
    const id = Number(req.params.id);
    const [breadcrumb, backlinks, outgoing] = await Promise.all([
      ancestorsOf(req.userId!, id),
      backlinksOf(req.userId!, id),
      outgoingLinksOf(req.userId!, id),
    ]);
    res.json({ success: true, data: { breadcrumb, backlinks, outgoing } });
  } catch (err) { next(err); }
});

router.get('/notes/:id/versions', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const versions = await listNoteVersions(req.userId!, Number(req.params.id));
    res.json({ success: true, data: versions });
  } catch (err) { next(err); }
});

router.get('/notes/:id/versions/:version', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const snapshot = await getNoteVersion(req.userId!, Number(req.params.id), Number(req.params.version));
    res.json({ success: true, data: snapshot });
  } catch (err) { next(err); }
});

router.post('/notes/:id/versions', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const snapshot = await createManualNoteVersion(req.userId!, Number(req.params.id));
    res.status(201).json({ success: true, data: snapshot });
  } catch (err) { next(err); }
});

router.post('/notes/:id/versions/:version/restore', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const note = await restoreNoteVersion(req.userId!, Number(req.params.id), Number(req.params.version));
    res.json({ success: true, data: note });
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

// Phase 3d — PDF/print export. Returns the title + contentHtml
// straight from the DB so the client can render it (the editor's
// in-flight edits stay out of the export, and there's no need to
// ship Tiptap to the server).
router.get('/notes/:id/export', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const note = await getNote(req.userId!, Number(req.params.id));
    res.json({
      success: true,
      data: {
        id: note.id,
        title: note.title,
        // contentHtml is generated server-side from contentJson on
        // every read so we never serve stale HTML.
        contentHtml: note.contentHtml ?? '',
        updatedAt: note.updatedAt instanceof Date ? note.updatedAt.toISOString() : String(note.updatedAt),
      },
    });
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
// ─── AI trong trình soạn thảo ────────────────────────────────

router.get('/ai/actions', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    const { listAiActions } = await import('../services/noteAiAssist.service.js');
    res.json({ success: true, data: listAiActions() });
  } catch (err) { next(err); }
});

router.post('/ai/assist', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const { runAiAssist } = await import('../services/noteAiAssist.service.js');
    const data = await runAiAssist(req.userId!, req.body?.action, req.body?.selection);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

/**
 * Hỏi trợ lý về TOÀN BỘ ghi chú của mình.
 *
 * Khác `/ai/assist` (chỉ thấy đoạn đang bôi đen): endpoint này tự đi tìm ghi
 * chú liên quan rồi trả lời KÈM TRÍCH DẪN — mỗi ý ghi rõ lấy từ ghi chú nào,
 * để người đọc kiểm chứng được thay vì phải tin.
 */
router.post('/ai/hoi', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const { hoiTroLyGhiChu } = await import('../services/noteAssistant.service.js');
    const data = await hoiTroLyGhiChu(req.userId!, req.body?.question);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

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

// ─── Flashcards (Phase 3b) ─────────────────────────────────────
router.get('/flashcards', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const deck = await listFlashcards(req.userId!, Number(req.query.noteId));
    res.json({ success: true, data: deck });
  } catch (err) { next(err); }
});

router.post('/flashcards/grade', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const vocabId = Number(req.body?.vocabId);
    const known = Boolean(req.body?.known);
    const updated = await gradeFlashcard(req.userId!, vocabId, known);
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
});

router.post('/flashcards/reset', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const vocabId = Number(req.body?.vocabId);
    const result = await resetFlashcard(req.userId!, vocabId);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

export default router;
