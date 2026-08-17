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
        orderBy: [{ isPinned: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
        select: {
          id: true, title: true, sortOrder: true, isPinned: true,
          notes: {
            // Sidebar default view hides archived; the user can flip to
            // the "Archive" filter pill to see them.
            where: { isArchived: false, deletedAt: null },
            orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
            select: { id: true, title: true, sortOrder: true, isPinned: true, isFavorite: true, isArchived: true, needsReview: true, updatedAt: true },
          },
        },
      },
      // Notes that live directly under the subject (no chapter).
      notes: {
        where: { chapterId: null, isArchived: false, deletedAt: null },
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
        select: { id: true, title: true, sortOrder: true, isPinned: true, isFavorite: true, isArchived: true, needsReview: true, updatedAt: true },
      },
    },
  });
  return subjects;
}

/** Recently-updated notes across all subjects (for the "Recent" rail). */
export async function getRecentNotes(userId: number, limit = 8) {
  return prisma.note.findMany({
    where: { userId, isArchived: false, deletedAt: null },
    orderBy: { updatedAt: 'desc' },
    take: Math.min(20, Math.max(1, limit)),
    select: { id: true, title: true, subjectId: true, chapterId: true, updatedAt: true, isPinned: true },
  });
}

// ─── Phase 3d — flag-filtered views (favorites / archive / needs review) ──
//
// The sidebar's filter pills use this so the user can flip between
// "All" (the default tree) and one of the special-purpose views
// without having to write a fresh Prisma query in the route.

export type NoteFilter = 'all' | 'favorites' | 'archive' | 'needs-review' | 'trash';

const FILTER_LIMIT = 200;

export async function listFilteredNotes(userId: number, filter: NoteFilter) {
  const where: Prisma.NoteWhereInput = { userId, deletedAt: null };
  switch (filter) {
    case 'favorites':
      where.isFavorite = true;
      where.isArchived = false;
      break;
    case 'archive':
      where.isArchived = true;
      break;
    case 'needs-review':
      where.needsReview = true;
      where.isArchived = false;
      break;
    case 'trash':
      delete where.deletedAt;
      where.deletedAt = { not: null };
      break;
    case 'all':
    default:
      // Include both archived and non-archived in the "All" view so
      // the user can see everything they own at a glance.
      break;
  }
  return prisma.note.findMany({
    where,
    orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
    take: FILTER_LIMIT,
    select: {
      id: true, title: true, subjectId: true, chapterId: true,
      isPinned: true, isFavorite: true, isArchived: true, needsReview: true,
      deletedAt: true, updatedAt: true,
    },
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

export async function updateChapter(userId: number, id: number, data: { title?: string; sortOrder?: number; isPinned?: boolean }) {
  assertId(id);
  const d: Prisma.NoteChapterUpdateManyMutationInput = {};
  if (data.title !== undefined) d.title = cleanStr(data.title, 200, 'Tiêu đề chương', { required: true })!;
  if (data.sortOrder !== undefined) d.sortOrder = Math.floor(Number(data.sortOrder) || 0);
  if (data.isPinned !== undefined) d.isPinned = !!data.isPinned;
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
  // Match `getNote`'s shape so the frontend can set `selected` directly
  // from a create response without a second round-trip. Without these
  // includes, child collections are undefined and the UI crashes the
  // first time the user opens the resource drawer on a freshly created
  // note (Phase 3a regression — attachments/length access blows up).
  return prisma.$transaction(async (tx) => {
    const note = await tx.note.create({
      data: { userId, subjectId, chapterId, title: title.length ? title : 'Ghi chú mới' },
    });
    await tx.noteVersion.create({
      data: {
        noteId: note.id, userId, version: 1, title: note.title,
        contentJson: Prisma.JsonNull, contentHtml: note.contentHtml,
        tags: note.tags, origin: 'INITIAL',
      },
    });
    return tx.note.findUniqueOrThrow({
      where: { id: note.id },
      include: {
        attachments: { orderBy: { sortOrder: 'asc' } },
        links: { orderBy: { sortOrder: 'asc' } },
        vocabEntries: { orderBy: { sortOrder: 'asc' } },
      },
    });
  });
}

/**
 * Duplicate a complete note inside the same subject/chapter.
 *
 * The operation is one transaction so the copied page never appears
 * half-populated. R2 objects are referenced by the new attachment rows
 * rather than uploaded again; deleting a note only deletes its database
 * rows, so the shared object URL remains valid for the copy.
 */
export async function duplicateNote(userId: number, id: number) {
  assertId(id);

  return prisma.$transaction(async (tx) => {
    const source = await tx.note.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        attachments: { orderBy: { sortOrder: 'asc' } },
        links: { orderBy: { sortOrder: 'asc' } },
        vocabEntries: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!source) {
      throw new AppError('Ghi chú không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
    }

    const last = await tx.note.findFirst({
      where: { userId, subjectId: source.subjectId, chapterId: source.chapterId, deletedAt: null },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });
    const copyTitle = `Bản sao — ${source.title}`.slice(0, 300);

    const copy = await tx.note.create({
      data: {
        userId,
        subjectId: source.subjectId,
        chapterId: source.chapterId,
        title: copyTitle,
        contentJson: source.contentJson === null
          ? Prisma.JsonNull
          : source.contentJson as Prisma.InputJsonValue,
        contentHtml: source.contentHtml,
        tags: source.tags,
        isPinned: false,
        isFavorite: source.isFavorite,
        isArchived: false,
        needsReview: source.needsReview,
        reviewDate: source.reviewDate,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
      select: { id: true },
    });

    await tx.noteVersion.create({
      data: {
        noteId: copy.id,
        userId,
        version: 1,
        title: copyTitle,
        contentJson: source.contentJson === null
          ? Prisma.JsonNull
          : source.contentJson as Prisma.InputJsonValue,
        contentHtml: source.contentHtml,
        tags: source.tags,
        origin: 'INITIAL',
      },
    });

    await Promise.all([
      source.attachments.length > 0
        ? tx.noteAttachment.createMany({
          data: source.attachments.map((item) => ({
            userId,
            noteId: copy.id,
            subjectId: null,
            chapterId: null,
            fileName: item.fileName,
            fileUrl: item.fileUrl,
            fileType: item.fileType,
            fileSizeBytes: item.fileSizeBytes,
            sortOrder: item.sortOrder,
          })),
        })
        : Promise.resolve(),
      source.links.length > 0
        ? tx.noteLink.createMany({
          data: source.links.map((item) => ({
            userId,
            noteId: copy.id,
            subjectId: null,
            chapterId: null,
            label: item.label,
            url: item.url,
            type: item.type,
            thumbnailUrl: item.thumbnailUrl,
            sortOrder: item.sortOrder,
          })),
        })
        : Promise.resolve(),
      source.vocabEntries.length > 0
        ? tx.noteVocabEntry.createMany({
          data: source.vocabEntries.map((item) => ({
            userId,
            noteId: copy.id,
            term: item.term,
            reading: item.reading,
            meaning: item.meaning,
            example: item.example,
            sortOrder: item.sortOrder,
            isKnown: item.isKnown,
            reviewCount: item.reviewCount,
            knownStreak: item.knownStreak,
            lastReviewedAt: item.lastReviewedAt,
          })),
        })
        : Promise.resolve(),
    ]);

    return tx.note.findUniqueOrThrow({
      where: { id: copy.id },
      include: {
        attachments: { orderBy: { sortOrder: 'asc' } },
        links: { orderBy: { sortOrder: 'asc' } },
        vocabEntries: { orderBy: { sortOrder: 'asc' } },
      },
    });
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
    d.tags = [...new Set(data.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean))].slice(0, 50);
  }
  if (data.isPinned !== undefined) d.isPinned = Boolean(data.isPinned);
  if (data.isFavorite !== undefined) d.isFavorite = Boolean(data.isFavorite);
  if (data.isArchived !== undefined) d.isArchived = Boolean(data.isArchived);
  if (data.needsReview !== undefined) d.needsReview = Boolean(data.needsReview);
  if (data.reviewDate !== undefined) {
    if (!data.reviewDate) {
      d.reviewDate = null;
    } else {
      const parsed = new Date(data.reviewDate);
      if (Number.isNaN(parsed.getTime())) {
        throw new AppError('Ngày ôn tập không hợp lệ', 400, 'INVALID_REVIEW_DATE');
      }
      d.reviewDate = parsed;
    }
  }
  if (data.sortOrder !== undefined) d.sortOrder = Math.floor(Number(data.sortOrder) || 0);

  // Moving the note: validate the new parent(s) belong to the user.
  if (data.subjectId !== undefined) {
    await assertSubjectOwnership(userId, Number(data.subjectId));
    d.subjectId = Number(data.subjectId);
    // A chapter belongs to exactly one subject. If a caller moves a
    // note to another subject without naming a target chapter, place
    // it at the new subject root instead of retaining a chapter from
    // the previous subject.
    if (data.chapterId === undefined) d.chapterId = null;
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

  const createsSnapshot = data.title !== undefined
    || data.contentJson !== undefined
    || data.contentHtml !== undefined
    || data.tags !== undefined;

  const realtimeReset = data.contentJson !== undefined
    ? await import('../socket/notes-collaboration.gateway.js')
    : null;
  await realtimeReset?.beginNoteCollaborationReset(id);
  try {
    return await prisma.$transaction(async (tx) => {
      const current = await tx.note.findFirst({ where: { id, userId, deletedAt: null } });
      if (!current) throw new AppError('Ghi chú không tồn tại, đã ở trong thùng rác hoặc không thuộc về bạn', 404, 'NOT_FOUND');

      if (data.contentJson !== undefined) {
        await tx.noteCollaborationDocument.deleteMany({ where: { noteId: id } });
      }

      const updated = await tx.note.update({ where: { id }, data: d });
      if (!createsSnapshot) return updated;

      // Immutable coalescing: the first content edit after a manual or
      // initial snapshot is saved immediately. Further autosaves within
      // five minutes update the page but do not create noisy history rows.
      const latest = await tx.noteVersion.findFirst({
        where: { noteId: id },
        orderBy: { version: 'desc' },
        select: { id: true, origin: true, createdAt: true },
      });
      const withinWindow = latest?.origin === 'AUTO_SAVE'
        && Date.now() - latest.createdAt.getTime() < 5 * 60 * 1000;
      if (withinWindow) {
        // Coalesce in place. Overwriting the open autosave row (instead of
        // leaving it frozen at the content it held when the window opened)
        // keeps the newest history entry equal to the live page, so
        // "restore the most recent version" can never silently roll the
        // user back past edits they already saw saved.
        await tx.noteVersion.update({
          where: { id: latest.id },
          data: {
            userId,
            title: updated.title,
            contentJson: updated.contentJson === null
              ? Prisma.JsonNull
              : updated.contentJson as Prisma.InputJsonValue,
            contentHtml: updated.contentHtml,
            tags: updated.tags,
          },
        });
        return updated;
      }

      const numbered = await tx.note.update({
        where: { id },
        data: { version: { increment: 1 } },
      });
      await tx.noteVersion.create({
        data: {
          noteId: id,
          userId,
          version: numbered.version,
          title: numbered.title,
          contentJson: numbered.contentJson === null
            ? Prisma.JsonNull
            : numbered.contentJson as Prisma.InputJsonValue,
          contentHtml: numbered.contentHtml,
          tags: numbered.tags,
          origin: 'AUTO_SAVE',
        },
      });
      return numbered;
    });
  } finally {
    realtimeReset?.endNoteCollaborationReset(id);
    if (data.contentJson !== undefined) {
      // Backlinks are a derived index — rebuild them after the content lands,
      // and never let a failure here fail the save itself.
      const { syncNoteReferences } = await import('./notesHierarchy.service.js');
      void syncNoteReferences(id);
    }
  }
}

export async function deleteNote(userId: number, id: number) {
  assertId(id);
  // Only `deletedAt` marks the trash. Every list/tree/search query already
  // filters on it, so there is no need to also force `isArchived` — doing
  // that destroyed the user's real archive flag, and restore could not tell
  // "was archived before deletion" from "archived by the delete itself".
  const res = await prisma.note.updateMany({
    where: { id, userId, deletedAt: null },
    data: { deletedAt: new Date(), isPinned: false },
  });
  if (res.count === 0) throw new AppError('Ghi chú không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  return { id, deleted: true, permanent: false };
}

export async function restoreDeletedNote(userId: number, id: number) {
  assertId(id);
  const res = await prisma.note.updateMany({
    where: { id, userId, deletedAt: { not: null } },
    data: { deletedAt: null },
  });
  if (res.count === 0) throw new AppError('Ghi chú không có trong thùng rác hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  return getNote(userId, id);
}

/**
 * Delete the R2 objects behind attachment URLs that nothing points at any more.
 *
 * MUST be called AFTER the owning rows are gone, and MUST re-check what is
 * still referenced. `duplicateNote` copies attachment rows that reuse the
 * SOURCE note's object URL — two rows, one file — so deleting "this note's
 * files" would silently empty every attachment in the copy. Asking the
 * database which URLs still have a row is the only way to tell a real orphan
 * from a shared file.
 *
 * Best effort by design: a failed object delete leaks storage, which is
 * cheap; failing the user's delete because a bucket call timed out is not.
 */
async function releaseOrphanedAttachmentUrls(candidates: Array<string | null | undefined>) {
  const unique = [...new Set(candidates.filter((url): url is string => Boolean(url)))];
  if (unique.length === 0) return 0;
  try {
    const stillReferenced = await prisma.noteAttachment.findMany({
      where: { fileUrl: { in: unique } },
      select: { fileUrl: true },
    });
    const kept = new Set(stillReferenced.map((row) => row.fileUrl));
    const orphans = unique.filter((url) => !kept.has(url));
    if (orphans.length === 0) return 0;
    const { deleteByUrls } = await import('../storage/uploadService.js');
    await deleteByUrls(orphans);
    return orphans.length;
  } catch {
    return 0;
  }
}

export async function permanentlyDeleteNote(userId: number, id: number) {
  assertId(id);
  // Read the URLs before the cascade removes the attachment rows.
  const attachments = await prisma.noteAttachment.findMany({
    where: { noteId: id },
    select: { fileUrl: true },
  });
  const res = await prisma.note.deleteMany({ where: { id, userId, deletedAt: { not: null } } });
  if (res.count === 0) throw new AppError('Chỉ có thể xóa vĩnh viễn ghi chú đang ở trong thùng rác', 409, 'NOT_IN_TRASH');
  const freed = await releaseOrphanedAttachmentUrls(attachments.map((row) => row.fileUrl));
  return { id, deleted: true, permanent: true, filesDeleted: freed };
}

/**
 * Nightly retention sweep. Child rows and versions cascade with the note; the
 * uploaded files behind them do not, so they are collected and released here.
 */
export async function purgeExpiredDeletedNotes(retentionDays = 30) {
  const safeDays = Math.max(1, Math.min(365, Math.floor(retentionDays)));
  const cutoff = new Date(Date.now() - safeDays * 24 * 60 * 60 * 1000);

  const expiring = await prisma.note.findMany({
    where: { deletedAt: { lt: cutoff } },
    select: { id: true },
  });
  if (expiring.length === 0) return { notes: 0, filesDeleted: 0 };

  const attachments = await prisma.noteAttachment.findMany({
    where: { noteId: { in: expiring.map((note) => note.id) } },
    select: { fileUrl: true },
  });
  const result = await prisma.note.deleteMany({ where: { deletedAt: { lt: cutoff } } });
  const freed = await releaseOrphanedAttachmentUrls(attachments.map((row) => row.fileUrl));
  return { notes: result.count, filesDeleted: freed };
}

// ─── Immutable version history ───────────────────────────────

async function ownedActiveNote(userId: number, noteId: number) {
  assertId(noteId, 'noteId');
  const note = await prisma.note.findFirst({ where: { id: noteId, userId, deletedAt: null } });
  if (!note) throw new AppError('Ghi chú không tồn tại, đã ở trong thùng rác hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  return note;
}

/**
 * Snapshot provenance. `NoteVersion.userId` is *who wrote the snapshot*,
 * which for a shared page is the collaborating editor rather than the
 * owner — so it must never be used as an access filter. Authorization is
 * `ownedActiveNote` above; the author is shown to the owner instead.
 */
const versionAuthorSelect = {
  select: { id: true, username: true, displayName: true, fullName: true, avatarUrl: true },
} as const;

export async function listNoteVersions(userId: number, noteId: number) {
  await ownedActiveNote(userId, noteId);
  return prisma.noteVersion.findMany({
    where: { noteId },
    orderBy: { version: 'desc' },
    select: {
      id: true, version: true, title: true, origin: true, createdAt: true,
      user: versionAuthorSelect,
    },
    take: 200,
  });
}

export async function getNoteVersion(userId: number, noteId: number, version: number) {
  await ownedActiveNote(userId, noteId);
  assertId(version, 'version');
  const snapshot = await prisma.noteVersion.findFirst({
    where: { noteId, version },
    include: { user: versionAuthorSelect },
  });
  if (!snapshot) throw new AppError('Phiên bản ghi chú không tồn tại', 404, 'VERSION_NOT_FOUND');
  return snapshot;
}

export async function createManualNoteVersion(userId: number, noteId: number) {
  assertId(noteId, 'noteId');
  return prisma.$transaction(async (tx) => {
    const note = await tx.note.findFirst({ where: { id: noteId, userId, deletedAt: null } });
    if (!note) throw new AppError('Ghi chú không tồn tại, đã ở trong thùng rác hoặc không thuộc về bạn', 404, 'NOT_FOUND');
    const numbered = await tx.note.update({ where: { id: noteId }, data: { version: { increment: 1 } } });
    return tx.noteVersion.create({
      data: {
        noteId, userId, version: numbered.version, title: numbered.title,
        contentJson: numbered.contentJson === null ? Prisma.JsonNull : numbered.contentJson as Prisma.InputJsonValue,
        contentHtml: numbered.contentHtml, tags: numbered.tags, origin: 'MANUAL',
      },
    });
  });
}

export async function restoreNoteVersion(userId: number, noteId: number, targetVersion: number) {
  assertId(noteId, 'noteId');
  assertId(targetVersion, 'version');
  const realtimeReset = await import('../socket/notes-collaboration.gateway.js');
  await realtimeReset.beginNoteCollaborationReset(noteId);
  try {
    return await prisma.$transaction(async (tx) => {
      const current = await tx.note.findFirst({ where: { id: noteId, userId, deletedAt: null } });
      if (!current) throw new AppError('Ghi chú không tồn tại, đã ở trong thùng rác hoặc không thuộc về bạn', 404, 'NOT_FOUND');
      const target = await tx.noteVersion.findFirst({ where: { noteId, version: targetVersion } });
      if (!target) throw new AppError('Phiên bản ghi chú không tồn tại', 404, 'VERSION_NOT_FOUND');

      // Claim both version numbers with one atomic increment before writing
      // either row. Deriving them from the value read at the top of the
      // transaction let two concurrent restores pick the same numbers and
      // collide on uk_note_version_note_number (a 500 instead of a restore).
      const claimed = await tx.note.update({
        where: { id: noteId },
        data: { version: { increment: 2 } },
        select: { version: true },
      });
      const restoredVersion = claimed.version;
      const beforeVersion = restoredVersion - 1;

      // Preserve the exact pre-restore page, then record the restored
      // state as another immutable version. Both are undoable later.
      await tx.noteVersion.create({
        data: {
          noteId, userId, version: beforeVersion, title: current.title,
          contentJson: current.contentJson === null ? Prisma.JsonNull : current.contentJson as Prisma.InputJsonValue,
          contentHtml: current.contentHtml, tags: current.tags, origin: 'BEFORE_RESTORE',
        },
      });
      const restored = await tx.note.update({
        where: { id: noteId },
        data: {
          title: target.title,
          contentJson: target.contentJson === null ? Prisma.JsonNull : target.contentJson as Prisma.InputJsonValue,
          contentHtml: target.contentHtml,
          tags: target.tags,
        },
      });
      await tx.noteCollaborationDocument.deleteMany({ where: { noteId } });
      await tx.noteVersion.create({
        data: {
          noteId, userId, version: restoredVersion, title: restored.title,
          contentJson: restored.contentJson === null ? Prisma.JsonNull : restored.contentJson as Prisma.InputJsonValue,
          contentHtml: restored.contentHtml, tags: restored.tags, origin: 'RESTORE',
        },
      });
      return restored;
    });
  } finally {
    realtimeReset.endNoteCollaborationReset(noteId);
  }
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
    prisma.note.updateMany({ where: { id, userId, deletedAt: null }, data: { sortOrder: order } }),
  );
}

// ════════════════════════════════════════════════════════════
// Phase 2 — attachments, links, search
// ════════════════════════════════════════════════════════════

/** Resolve which parent an attachment/link hangs off. Exactly one
 * of noteId / subjectId must be set, and it must belong to the user. */
async function resolveParent(userId: number, p: { noteId?: number | null; subjectId?: number | null }): Promise<{ noteId: number | null; subjectId: number | null }> {
  const hasNote = p.noteId != null;
  const hasSubject = p.subjectId != null;
  if (hasNote === hasSubject) {
    throw new AppError('Phải gắn vào đúng một ghi chú hoặc một môn học', 400, 'INVALID_PARENT');
  }
  if (hasNote) {
    const n = await prisma.note.findFirst({ where: { id: Number(p.noteId), userId, deletedAt: null }, select: { id: true } });
    if (!n) throw new AppError('Ghi chú không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
    return { noteId: n.id, subjectId: null };
  }
  await assertSubjectOwnership(userId, Number(p.subjectId));
  return { noteId: null, subjectId: Number(p.subjectId) };
}

// ─── Subject detail (for the subject resources view) ─────────
export async function getSubject(userId: number, id: number) {
  assertId(id);
  const subject = await prisma.noteSubject.findFirst({
    where: { id, userId },
    include: {
      attachments: { orderBy: { sortOrder: 'asc' } },
      links: { orderBy: { sortOrder: 'asc' } },
    },
  });
  if (!subject) throw new AppError('Môn học không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  return subject;
}

// ─── Attachments ─────────────────────────────────────────────
export async function addAttachment(
  userId: number,
  data: { noteId?: number | null; subjectId?: number | null; fileName?: string; fileUrl?: string; fileType?: string | null; fileSizeBytes?: number | null },
) {
  const parent = await resolveParent(userId, data);
  const fileName = cleanStr(data.fileName, 300, 'Tên tệp', { required: true })!;
  const fileUrl = cleanStr(data.fileUrl, 2000, 'Đường dẫn tệp', { required: true })!;
  // Next sortOrder within the parent.
  const last = await prisma.noteAttachment.findFirst({
    where: { userId, noteId: parent.noteId, subjectId: parent.subjectId },
    orderBy: { sortOrder: 'desc' }, select: { sortOrder: true },
  });
  return prisma.noteAttachment.create({
    data: {
      userId, noteId: parent.noteId, subjectId: parent.subjectId,
      fileName, fileUrl,
      fileType: cleanStr(data.fileType ?? undefined, 150, 'Loại tệp') ?? null,
      fileSizeBytes: typeof data.fileSizeBytes === 'number' ? Math.max(0, Math.floor(data.fileSizeBytes)) : null,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });
}

export async function deleteAttachment(userId: number, id: number) {
  assertId(id);
  const res = await prisma.noteAttachment.deleteMany({ where: { id, userId } });
  if (res.count === 0) throw new AppError('Tệp đính kèm không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  return { id, deleted: true };
}

// ─── Links ───────────────────────────────────────────────────

const YT_RE = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i;

/** Classify a URL and (for YouTube) keep the canonical type. */
export function detectLinkType(url: string): 'WEB' | 'YOUTUBE' | 'OTHER' {
  if (YT_RE.test(url)) return 'YOUTUBE';
  if (/^https?:\/\//i.test(url)) return 'WEB';
  return 'OTHER';
}

export async function addLink(
  userId: number,
  data: { noteId?: number | null; subjectId?: number | null; label?: string; url?: string; type?: string | null; thumbnailUrl?: string | null },
) {
  const parent = await resolveParent(userId, data);
  const url = cleanStr(data.url, 2000, 'URL', { required: true })!;
  const label = cleanStr(data.label, 500, 'Nhãn') || url;
  const type = (data.type && ['WEB', 'YOUTUBE', 'OTHER'].includes(String(data.type))) ? String(data.type) : detectLinkType(url);
  const last = await prisma.noteLink.findFirst({
    where: { userId, noteId: parent.noteId, subjectId: parent.subjectId },
    orderBy: { sortOrder: 'desc' }, select: { sortOrder: true },
  });
  return prisma.noteLink.create({
    data: {
      userId, noteId: parent.noteId, subjectId: parent.subjectId,
      label, url, type,
      thumbnailUrl: cleanStr(data.thumbnailUrl ?? undefined, 2000, 'Thumbnail') ?? null,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });
}

export async function updateLink(userId: number, id: number, data: { label?: string; url?: string; type?: string }) {
  assertId(id);
  const d: Prisma.NoteLinkUpdateManyMutationInput = {};
  if (data.label !== undefined) d.label = cleanStr(data.label, 500, 'Nhãn', { required: true })!;
  if (data.url !== undefined) { d.url = cleanStr(data.url, 2000, 'URL', { required: true })!; d.type = detectLinkType(d.url as string); }
  if (data.type !== undefined && ['WEB', 'YOUTUBE', 'OTHER'].includes(String(data.type))) d.type = String(data.type);
  if (Object.keys(d).length === 0) throw new AppError('Không có trường hợp lệ để cập nhật', 400, 'EMPTY_UPDATE');
  const res = await prisma.noteLink.updateMany({ where: { id, userId }, data: d });
  if (res.count === 0) throw new AppError('Liên kết không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  return prisma.noteLink.findUnique({ where: { id } });
}

export async function deleteLink(userId: number, id: number) {
 assertId(id);
 const res = await prisma.noteLink.deleteMany({ where: { id, userId } });
 if (res.count === 0) throw new AppError('Liên kết không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
 return { id, deleted: true };
}

// ─── Vocab (per note) ────────────────────────────────────────
// A vocabulary row is a single (term, reading, meaning, example)
// tuple owned by a note. We always scope reads / writes through
// the parent note's userId so foreign-note ids 404 silently.

/** Verify a note belongs to the user. Used before touching vocab. */
async function assertNoteOwnership(userId: number, noteId: number): Promise<void> {
 assertId(noteId, 'noteId');
 const ok = await prisma.note.findFirst({ where: { id: noteId, userId, deletedAt: null }, select: { id: true } });
 if (!ok) throw new AppError('Ghi chú không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
}

export async function listVocab(userId: number, noteId: number) {
 await assertNoteOwnership(userId, noteId);
 return prisma.noteVocabEntry.findMany({
 where: { userId, noteId },
 orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
 });
}

export async function addVocab(
 userId: number,
  data: { noteId?: number; term?: string; reading?: string | null; meaning?: string | null; example?: string | null },
) {
 const noteId = Number(data.noteId);
 await assertNoteOwnership(userId, noteId);
 // term is OPTIONAL on create: the UI may add a row before the user
 // has typed anything (Anki-style "draft placeholder"), then commit
 // the real term on first blur via updateVocab. updateVocab still
 // enforces required on term, so an abandoned empty row surfaces a
 // validation error when (or if) the user tries to save one.
 const term = cleanStr(data.term ?? undefined, 500, 'Từ vựng') ?? '';
 const reading = cleanStr(data.reading ?? undefined, 500, 'Phiên âm') ?? null;
 const meaning = cleanStr(data.meaning ?? undefined, 5000, 'Nghĩa') ?? null;
 const example = cleanStr(data.example ?? undefined, 5000, 'Ví dụ') ?? null;
  // Append to the end — last sortOrder + 1.
 const last = await prisma.noteVocabEntry.findFirst({
 where: { userId, noteId },
 orderBy: { sortOrder: 'desc' }, select: { sortOrder: true },
 });
 return prisma.noteVocabEntry.create({
 data: {
 userId, noteId, term, reading, meaning, example,
  sortOrder: (last?.sortOrder ?? -1) + 1,
 },
 });
}

export async function updateVocab(
 userId: number,
 id: number,
 data: { term?: string; reading?: string | null; meaning?: string | null; example?: string | null },
) {
 assertId(id);
 const d: Prisma.NoteVocabEntryUpdateManyMutationInput = {};
 if (data.term !== undefined) d.term = cleanStr(data.term, 500, 'Từ vựng', { required: true })!;
 if (data.reading !== undefined) d.reading = data.reading == null ? null : cleanStr(data.reading, 500, 'Phiên âm');
 if (data.meaning !== undefined) d.meaning = data.meaning == null ? null : cleanStr(data.meaning, 5000, 'Nghĩa');
 if (data.example !== undefined) d.example = data.example == null ? null : cleanStr(data.example, 5000, 'Ví dụ');
 if (Object.keys(d).length === 0) throw new AppError('Không có trường hợp lệ để cập nhật', 400, 'EMPTY_UPDATE');
 const res = await prisma.noteVocabEntry.updateMany({ where: { id, userId }, data: d });
 if (res.count === 0) throw new AppError('Từ vựng không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
 return prisma.noteVocabEntry.findUnique({ where: { id } });
}

export async function deleteVocab(userId: number, id: number) {
 assertId(id);
 const res = await prisma.noteVocabEntry.deleteMany({ where: { id, userId } });
 if (res.count === 0) throw new AppError('Từ vựng không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
 return { id, deleted: true };
}

/**
 * Reorder vocab rows for a single note. orderedIds MUST belong to
 * the same note (otherwise the WHERE would 0-row-update silently);
 * we scope by { id, userId, noteId } so a foreign id is a no-op,
 * matching the rest of the reorder endpoints.
 */
export function reorderVocab(userId: number, noteId: number, orderedIds: unknown) {
 return applyOrder(orderedIds, (id, order) =>
 prisma.noteVocabEntry.updateMany({ where: { id, userId, noteId }, data: { sortOrder: order } }),
 );
}

// ─── Global search ───────────────────────────────────────────
// Case-insensitive match across title + cached contentHtml, with
// optional subject + tag filters. Personal note volumes are small,
// so ILIKE is plenty fast; we return a short text snippet around
// the match for context. Archived notes are excluded by default.

/**
 * Bỏ thẻ HTML, còn lại chữ thuần.
 *
 * Xuất ra ngoài vì agent (`src/services/agent/serverTools.ts`) cần đúng phép
 * biến đổi NÀY chứ không phải một bản chép gần giống: gửi thẳng `contentHtml`
 * cho model là trả tiền cho hàng nghìn token thẻ `<p>` vô nghĩa, còn chép lại
 * hàm này ở chỗ khác thì hai bản sẽ trôi dạt.
 */
export function htmlToText(html: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

function snippet(text: string, q: string, radius = 60): string {
  if (!text) return '';
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text.slice(0, radius * 2);
  const start = Math.max(0, i - radius);
  return (start > 0 ? '…' : '') + text.slice(start, i + q.length + radius) + (i + q.length + radius < text.length ? '…' : '');
}

export async function searchNotes(
  userId: number,
  opts: { q?: string; subjectId?: number; tag?: string; includeArchived?: boolean },
) {
  const q = (opts.q ?? '').trim();
  const and: Prisma.NoteWhereInput[] = [{ userId, deletedAt: null }];
  if (!opts.includeArchived) and.push({ isArchived: false });
  if (opts.subjectId) and.push({ subjectId: Number(opts.subjectId) });
  if (opts.tag) and.push({ tags: { has: String(opts.tag).toLowerCase() } });
  if (q) and.push({ OR: [{ title: { contains: q, mode: 'insensitive' } }, { contentHtml: { contains: q, mode: 'insensitive' } }] });

  const notes = await prisma.note.findMany({
    where: { AND: and },
    orderBy: { updatedAt: 'desc' },
    take: 50,
    select: { id: true, title: true, subjectId: true, chapterId: true, tags: true, updatedAt: true, contentHtml: true },
  });

  return notes.map((n) => {
    const text = htmlToText(n.contentHtml);
    return {
      id: n.id, title: n.title, subjectId: n.subjectId, chapterId: n.chapterId,
      tags: n.tags, updatedAt: n.updatedAt,
      snippet: q ? snippet(text, q) : text.slice(0, 120),
    };
  });
}

/** Distinct tags across the user's notes (for the search tag filter). */
export async function listTags(userId: number): Promise<string[]> {
  const rows = await prisma.note.findMany({ where: { userId, deletedAt: null }, select: { tags: true } });
  const set = new Set<string>();
  rows.forEach((r) => r.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

// ─── Flashcards (Phase 3b) ──────────────────────────────────────
// A "flashcard deck" is just the vocab list for a note, projected to
// the fields the review UI needs. The review session is client-side
// state — we only persist per-vocab review outcomes (`isKnown`,
// `reviewCount`, `knownStreak`, `lastReviewedAt`) so progress
// survives reloads. No SRS scheduling here; Phase 3d if needed.

/**
 * Deck for a note: vocab rows sorted as the user left them, with only
 * the fields the front of the card needs (term is always the prompt;
 * reading / meaning / example populate the back). We strip the review
 * fields so the response stays compact.
 */
export async function listFlashcards(userId: number, noteId: number) {
  await assertNoteOwnership(userId, noteId);
  const rows = await prisma.noteVocabEntry.findMany({
    where: { userId, noteId },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true, term: true, reading: true, meaning: true, example: true,
      isKnown: true, reviewCount: true, knownStreak: true, lastReviewedAt: true,
    },
  });
  // Lightweight deck summary so the UI can show "0 / 12 known" etc.
  const total = rows.length;
  const known = rows.filter((r) => r.isKnown).length;
  const reviewed = rows.filter((r) => r.reviewCount > 0).length;
  return { cards: rows, summary: { total, known, reviewed } };
}

/**
 * Record a single review outcome for one vocab row.
 *
 *   known=true   → bump reviewCount, increment streak (cap 9999),
 *                   mark isKnown, stamp lastReviewedAt.
 *   known=false  → bump reviewCount, reset streak to 0, clear isKnown,
 *                   stamp lastReviewedAt. (Resetting on "again" mirrors
 *                   the most common Anki-like UX without the SRS math.)
 *
 * Cross-tenant guard: scope update by { id, userId } and verify count>0.
 */
export async function gradeFlashcard(
  userId: number,
  vocabId: number,
  known: boolean,
) {
  assertId(vocabId, 'vocabId');
  // Read current row to compute the new streak atomically. We do
  // updateMany + count guard for ownership (consistent with the rest
  // of the service), then a follow-up read to compute streak. Both
  // writes run in a transaction so the count check and the bump are
  // never racy with a delete.
  return prisma.$transaction(async (tx) => {
    const current = await tx.noteVocabEntry.findFirst({
      where: { id: vocabId, userId },
      select: { id: true, knownStreak: true, reviewCount: true },
    });
    if (!current) throw new AppError('Từ vựng không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');

    const nextStreak = known
      ? Math.min(9999, current.knownStreak + 1)
      : 0;

    const updated = await tx.noteVocabEntry.update({
      where: { id: vocabId },
      data: {
        isKnown: known,
        knownStreak: nextStreak,
        reviewCount: { increment: 1 },
        lastReviewedAt: new Date(),
      },
      select: {
        id: true, isKnown: true, reviewCount: true, knownStreak: true, lastReviewedAt: true,
      },
    });
    return updated;
  });
}

/**
 * Reset review state for one vocab row (user toggled "mark unknown").
 * Same ownership guard as grade.
 */
export async function resetFlashcard(userId: number, vocabId: number) {
  assertId(vocabId, 'vocabId');
  const res = await prisma.noteVocabEntry.updateMany({
    where: { id: vocabId, userId },
    data: { isKnown: false, knownStreak: 0, lastReviewedAt: new Date() },
  });
  if (res.count === 0) throw new AppError('Từ vựng không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  return { id: vocabId, reset: true };
}
