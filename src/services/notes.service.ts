/**
 * Notes service — personal study notebooks (per-user).
 * ────────────────────────────────────────────────────────────
 * Every function takes `userId` as its first argument and every
 * query carries `userId` in its WHERE clause. Mutations use
 * `updateMany` / `deleteMany` with `{ id, userId }` so a user can
 * never touch another user's rows (the cross-tenant guard mirrors
 * `hub.service.ts`). There is no admin surface — each account
 * owns and manages its own notes.
 *
 * Hierarchy: NoteSubject → NoteChapter → Note. A Note may sit
 * directly under a Subject (chapterId = null) or inside a Chapter.
 *
 * Phase 1 covers: tree read, Subject/Chapter/Note CRUD, reorder,
 * and the Note content save (contentJson + cached contentHtml).
 * Attachments / links / vocab / search arrive in later phases.
 */
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { Prisma } from '@prisma/client';

// ─── Helpers ─────────────────────────────────────────────────

function assertId(id: number, label = 'id'): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(`${label} không hợp lệ`, 400, 'INVALID_ID');
  }
}

function cleanStr(v: unknown, max: number, label: string, { required = false } = {}): string | undefined {
  if (v === undefined) return undefined;
  const s = String(v ?? '').trim();
  if (required && s.length === 0) throw new AppError(`${label} không được để trống`, 400, 'INVALID_INPUT');
  if (s.length > max) throw new AppError(`${label} quá dài (tối đa ${max} ký tự)`, 400, 'INVALID_INPUT');
  return s;
}

/** Verify a subject belongs to the user (throws 404 otherwise). */
async function assertSubjectOwnership(userId: number, subjectId: number): Promise<void> {
  assertId(subjectId, 'subjectId');
  const ok = await prisma.noteSubject.findFirst({ where: { id: subjectId, userId }, select: { id: true } });
  if (!ok) throw new AppError('Môn học không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
}

/** Verify a chapter belongs to the user and (optionally) to a subject. */
async function assertChapterOwnership(userId: number, chapterId: number, subjectId?: number): Promise<void> {
  assertId(chapterId, 'chapterId');
  const ch = await prisma.noteChapter.findFirst({ where: { id: chapterId, userId }, select: { id: true, subjectId: true } });
  if (!ch) throw new AppError('Chương không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  if (subjectId != null && ch.subjectId !== subjectId) {
    throw new AppError('Chương không thuộc môn học này', 400, 'CHAPTER_SUBJECT_MISMATCH');
  }
}

// ─── Tree (sidebar) ──────────────────────────────────────────
// Lightweight: subjects → chapters → notes with only the fields
// the sidebar needs. Note bodies (contentJson/Html) are NOT
// included — they're fetched on demand by getNote().

export async function getTree(userId: number) {
  const subjects = await prisma.noteSubject.findMany({
    where: { userId },
    orderBy: [{ isPinned: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true, name: true, color: true, emoji: true, description: true,
      sortOrder: true, isPinned: true,
      chapters: {
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        select: {
          id: true, title: true, sortOrder: true,
          notes: {
            where: { isArchived: false },
            orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
            select: { id: true, title: true, sortOrder: true, isPinned: true, isFavorite: true, needsReview: true, updatedAt: true },
          },
        },
      },
      // Notes that live directly under the subject (no chapter).
      notes: {
        where: { chapterId: null, isArchived: false },
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
        select: { id: true, title: true, sortOrder: true, isPinned: true, isFavorite: true, needsReview: true, updatedAt: true },
      },
    },
  });
  return subjects;
}

/** Recently-updated notes across all subjects (for the "Recent" rail). */
export async function getRecentNotes(userId: number, limit = 8) {
  return prisma.note.findMany({
    where: { userId, isArchived: false },
    orderBy: { updatedAt: 'desc' },
    take: Math.min(20, Math.max(1, limit)),
    select: { id: true, title: true, subjectId: true, chapterId: true, updatedAt: true, isPinned: true },
  });
}

// ─── Subjects ────────────────────────────────────────────────

export async function createSubject(
  userId: number,
  data: { name?: string; color?: string | null; emoji?: string | null; description?: string | null; sortOrder?: number },
) {
  const name = cleanStr(data.name, 150, 'Tên môn học', { required: true })!;
  return prisma.noteSubject.create({
    data: {
      userId,
      name,
      color: cleanStr(data.color ?? undefined, 20, 'Màu') ?? null,
      emoji: cleanStr(data.emoji ?? undefined, 20, 'Emoji') ?? null,
      description: cleanStr(data.description ?? undefined, 2000, 'Mô tả') ?? null,
      sortOrder: typeof data.sortOrder === 'number' ? Math.floor(data.sortOrder) : 0,
    },
  });
}

export async function updateSubject(
  userId: number,
  id: number,
  data: { name?: string; color?: string | null; emoji?: string | null; description?: string | null; sortOrder?: number; isPinned?: boolean },
) {
  assertId(id);
  const d: Prisma.NoteSubjectUpdateManyMutationInput = {};
  if (data.name !== undefined) d.name = cleanStr(data.name, 150, 'Tên môn học', { required: true })!;
  if (data.color !== undefined) d.color = cleanStr(data.color ?? undefined, 20, 'Màu') ?? null;
  if (data.emoji !== undefined) d.emoji = cleanStr(data.emoji ?? undefined, 20, 'Emoji') ?? null;
  if (data.description !== undefined) d.description = cleanStr(data.description ?? undefined, 2000, 'Mô tả') ?? null;
  if (data.sortOrder !== undefined) d.sortOrder = Math.floor(Number(data.sortOrder) || 0);
  if (data.isPinned !== undefined) d.isPinned = Boolean(data.isPinned);
  if (Object.keys(d).length === 0) throw new AppError('Không có trường hợp lệ để cập nhật', 400, 'EMPTY_UPDATE');

  const res = await prisma.noteSubject.updateMany({ where: { id, userId }, data: d });
  if (res.count === 0) throw new AppError('Môn học không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  return prisma.noteSubject.findUnique({ where: { id } });
}

export async function deleteSubject(userId: number, id: number) {
  assertId(id);
  // Cascade removes chapters, notes, attachments, links, vocab.
  const res = await prisma.noteSubject.deleteMany({ where: { id, userId } });
  if (res.count === 0) throw new AppError('Môn học không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  return { id, deleted: true };
}

// ─── Chapters ────────────────────────────────────────────────

export async function createChapter(userId: number, data: { subjectId?: number; title?: string; sortOrder?: number }) {
  const subjectId = Number(data.subjectId);
  await assertSubjectOwnership(userId, subjectId);
  const title = cleanStr(data.title, 200, 'Tiêu đề chương', { required: true })!;
  return prisma.noteChapter.create({
    data: { userId, subjectId, title, sortOrder: typeof data.sortOrder === 'number' ? Math.floor(data.sortOrder) : 0 },
  });
}

export async function updateChapter(userId: number, id: number, data: { title?: string; sortOrder?: number }) {
  assertId(id);
  const d: Prisma.NoteChapterUpdateManyMutationInput = {};
  if (data.title !== undefined) d.title = cleanStr(data.title, 200, 'Tiêu đề chương', { required: true })!;
  if (data.sortOrder !== undefined) d.sortOrder = Math.floor(Number(data.sortOrder) || 0);
  if (Object.keys(d).length === 0) throw new AppError('Không có trường hợp lệ để cập nhật', 400, 'EMPTY_UPDATE');

  const res = await prisma.noteChapter.updateMany({ where: { id, userId }, data: d });
  if (res.count === 0) throw new AppError('Chương không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  return prisma.noteChapter.findUnique({ where: { id } });
}

export async function deleteChapter(userId: number, id: number) {
  assertId(id);
  // Notes under this chapter have chapterId set to NULL (ON DELETE
  // SET NULL) so they survive under the subject rather than vanish.
  const res = await prisma.noteChapter.deleteMany({ where: { id, userId } });
  if (res.count === 0) throw new AppError('Chương không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  return { id, deleted: true };
}

// ─── Notes ───────────────────────────────────────────────────

export async function createNote(userId: number, data: { subjectId?: number; chapterId?: number | null; title?: string }) {
  const subjectId = Number(data.subjectId);
  await assertSubjectOwnership(userId, subjectId);
  let chapterId: number | null = null;
  if (data.chapterId != null) {
    chapterId = Number(data.chapterId);
    await assertChapterOwnership(userId, chapterId, subjectId);
  }
  const title = cleanStr(data.title, 300, 'Tiêu đề') ?? 'Ghi chú mới';
  return prisma.note.create({
    data: { userId, subjectId, chapterId, title: title.length ? title : 'Ghi chú mới' },
  });
}

/** Full note read (includes body + child collections for the editor). */
export async function getNote(userId: number, id: number) {
  assertId(id);
  const note = await prisma.note.findFirst({
    where: { id, userId },
    include: {
      attachments: { orderBy: { sortOrder: 'asc' } },
      links: { orderBy: { sortOrder: 'asc' } },
      vocabEntries: { orderBy: { sortOrder: 'asc' } },
    },
  });
  if (!note) throw new AppError('Ghi chú không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  return note;
}

/**
 * Update a note. Handles the auto-save path (title + contentJson +
 * contentHtml) as well as metadata flags and moving the note to a
 * different subject/chapter. Idempotent — repeated saves of the
 * same payload just overwrite the same row (no duplicates).
 */
export async function updateNote(
  userId: number,
  id: number,
  data: {
    title?: string;
    contentJson?: Prisma.InputJsonValue | null;
    contentHtml?: string | null;
    tags?: string[];
    isPinned?: boolean;
    isFavorite?: boolean;
    isArchived?: boolean;
    needsReview?: boolean;
    reviewDate?: string | null;
    sortOrder?: number;
    subjectId?: number;
    chapterId?: number | null;
  },
) {
  assertId(id);
  const d: Prisma.NoteUncheckedUpdateManyInput = {};

  if (data.title !== undefined) d.title = cleanStr(data.title, 300, 'Tiêu đề') || 'Untitled';
  if (data.contentJson !== undefined) d.contentJson = data.contentJson === null ? Prisma.JsonNull : data.contentJson;
  if (data.contentHtml !== undefined) d.contentHtml = data.contentHtml == null ? null : String(data.contentHtml);
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) throw new AppError('tags phải là mảng', 400, 'INVALID_TAGS');
    d.tags = data.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean).slice(0, 50);
  }
  if (data.isPinned !== undefined) d.isPinned = Boolean(data.isPinned);
  if (data.isFavorite !== undefined) d.isFavorite = Boolean(data.isFavorite);
  if (data.isArchived !== undefined) d.isArchived = Boolean(data.isArchived);
  if (data.needsReview !== undefined) d.needsReview = Boolean(data.needsReview);
  if (data.reviewDate !== undefined) {
    d.reviewDate = data.reviewDate ? new Date(data.reviewDate) : null;
  }
  if (data.sortOrder !== undefined) d.sortOrder = Math.floor(Number(data.sortOrder) || 0);

  // Moving the note: validate the new parent(s) belong to the user.
  if (data.subjectId !== undefined) {
    await assertSubjectOwnership(userId, Number(data.subjectId));
    d.subjectId = Number(data.subjectId);
  }
  if (data.chapterId !== undefined) {
    if (data.chapterId === null) {
      d.chapterId = null;
    } else {
      const targetSubject = data.subjectId !== undefined ? Number(data.subjectId) : undefined;
      await assertChapterOwnership(userId, Number(data.chapterId), targetSubject);
      d.chapterId = Number(data.chapterId);
    }
  }

  if (Object.keys(d).length === 0) throw new AppError('Không có trường hợp lệ để cập nhật', 400, 'EMPTY_UPDATE');

  const res = await prisma.note.updateMany({ where: { id, userId }, data: d });
  if (res.count === 0) throw new AppError('Ghi chú không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  return prisma.note.findUnique({ where: { id } });
}

export async function deleteNote(userId: number, id: number) {
  assertId(id);
  const res = await prisma.note.deleteMany({ where: { id, userId } });
  if (res.count === 0) throw new AppError('Ghi chú không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  return { id, deleted: true };
}

// ─── Reorder (drag-and-drop) ─────────────────────────────────
// Each accepts an ordered list of ids and writes sortOrder = index.
// Wrapped in a transaction; every update carries userId so a
// foreign id is simply a no-op (can't reorder another user's rows).

async function applyOrder(
  ids: unknown,
  run: (id: number, order: number) => Prisma.PrismaPromise<unknown>,
) {
  if (!Array.isArray(ids)) throw new AppError('orderedIds phải là mảng', 400, 'INVALID_ORDER');
  const clean = ids.map((x) => Number(x)).filter((n) => Number.isInteger(n) && n > 0);
  await prisma.$transaction(clean.map((id, i) => run(id, i)));
  return { reordered: clean.length };
}

export function reorderSubjects(userId: number, orderedIds: unknown) {
  return applyOrder(orderedIds, (id, order) =>
    prisma.noteSubject.updateMany({ where: { id, userId }, data: { sortOrder: order } }),
  );
}

export function reorderChapters(userId: number, subjectId: number, orderedIds: unknown) {
  return applyOrder(orderedIds, (id, order) =>
    prisma.noteChapter.updateMany({ where: { id, userId, subjectId }, data: { sortOrder: order } }),
  );
}

export function reorderNotes(userId: number, orderedIds: unknown) {
  return applyOrder(orderedIds, (id, order) =>
    prisma.note.updateMany({ where: { id, userId }, data: { sortOrder: order } }),
  );
}
