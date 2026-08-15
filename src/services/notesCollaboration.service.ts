/**
 * Notes collaboration core: shared editing and page-level discussions.
 * Every entry point resolves the note's subject share on the server; UI labels
 * are never treated as authorization.
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  canCommentOnNote,
  canEditSharedNote,
  resolveNoteAccess,
} from './notesShare.service.js';
import { notifyNoteCollaboration } from './notification.service.js';

function assertPositiveInt(value: number, label: string) {
  if (!Number.isInteger(value) || value <= 0) throw new AppError(`${label} is invalid`, 400, 'INVALID_ID');
}

function cleanComment(value: unknown): string {
  const content = String(value ?? '').trim();
  if (!content) throw new AppError('Nội dung bình luận không được để trống', 400, 'EMPTY_COMMENT');
  if (content.length > 4000) throw new AppError('Bình luận tối đa 4000 ký tự', 400, 'COMMENT_TOO_LONG');
  return content;
}

const authorSelect = {
  id: true, username: true, displayName: true, fullName: true, avatarUrl: true,
} satisfies Prisma.UserSelect;

const replyInclude = {
  author: { select: authorSelect },
  resolvedBy: { select: authorSelect },
  mentions: { include: { user: { select: authorSelect } } },
} satisfies Prisma.NoteCommentInclude;

const threadInclude = {
  ...replyInclude,
  replies: { orderBy: { createdAt: 'asc' as const }, include: replyInclude },
} satisfies Prisma.NoteCommentInclude;

export async function updateSharedNoteContent(
  actorId: number,
  subjectId: number,
  noteId: number,
  input: {
    title?: unknown;
    contentJson?: Prisma.InputJsonValue | null;
    contentHtml?: unknown;
    tags?: unknown;
  },
) {
  assertPositiveInt(subjectId, 'subjectId');
  assertPositiveInt(noteId, 'noteId');
  const access = await resolveNoteAccess(actorId, noteId);
  if (access.subjectId !== subjectId) throw new AppError('Note does not belong to this subject', 400, 'SUBJECT_MISMATCH');
  if (!canEditSharedNote(access.permission)) throw new AppError('Bạn không có quyền chỉnh sửa ghi chú này', 403, 'EDIT_PERMISSION_REQUIRED');

  const data: Prisma.NoteUncheckedUpdateInput = {};
  if (input.title !== undefined) data.title = (String(input.title).trim() || 'Untitled').slice(0, 300);
  if (input.contentJson !== undefined) data.contentJson = input.contentJson === null ? Prisma.JsonNull : input.contentJson;
  if (input.contentHtml !== undefined) data.contentHtml = input.contentHtml === null ? null : String(input.contentHtml);
  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags)) throw new AppError('tags must be an array', 400, 'INVALID_TAGS');
    data.tags = [...new Set(input.tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean))].slice(0, 50);
  }
  if (Object.keys(data).length === 0) throw new AppError('No editable fields supplied', 400, 'EMPTY_UPDATE');

  return prisma.$transaction(async (tx) => {
    const note = await tx.note.findFirst({ where: { id: noteId, userId: access.ownerId, deletedAt: null } });
    if (!note) throw new AppError('Note not found', 404, 'NOTE_NOT_FOUND');
    const updated = await tx.note.update({ where: { id: noteId }, data });

    const latest = await tx.noteVersion.findFirst({
      where: { noteId }, orderBy: { version: 'desc' }, select: { id: true, origin: true, createdAt: true },
    });
    const withinWindow = latest?.origin === 'AUTO_SAVE'
      && Date.now() - latest.createdAt.getTime() < 5 * 60 * 1000;
    if (withinWindow) {
      // Overwrite the open autosave row so the newest history entry always
      // matches the live page, and so it is attributed to whoever actually
      // typed last rather than to whoever opened the window.
      await tx.noteVersion.update({
        where: { id: latest.id },
        data: {
          userId: actorId,
          title: updated.title,
          contentJson: updated.contentJson === null
            ? Prisma.JsonNull
            : updated.contentJson as Prisma.InputJsonValue,
          contentHtml: updated.contentHtml,
          tags: updated.tags,
        },
      });
    } else {
      const numbered = await tx.note.update({ where: { id: noteId }, data: { version: { increment: 1 } } });
      await tx.noteVersion.create({
        data: {
          noteId,
          userId: actorId,
          version: numbered.version,
          title: numbered.title,
          contentJson: numbered.contentJson === null ? Prisma.JsonNull : numbered.contentJson as Prisma.InputJsonValue,
          contentHtml: numbered.contentHtml,
          tags: numbered.tags,
          origin: 'AUTO_SAVE',
        },
      });
    }

    return tx.note.findUniqueOrThrow({
      where: { id: noteId },
      include: {
        attachments: { orderBy: { sortOrder: 'asc' } },
        links: { orderBy: { sortOrder: 'asc' } },
        vocabEntries: { orderBy: { sortOrder: 'asc' } },
      },
    });
  });
}

export async function listNoteComments(userId: number, noteId: number, includeResolved = true) {
  const access = await resolveNoteAccess(userId, noteId);
  const threads = await prisma.noteComment.findMany({
    where: {
      noteId,
      parentId: null,
      ...(includeResolved ? {} : { resolvedAt: null }),
    },
    orderBy: [{ resolvedAt: { sort: 'asc', nulls: 'first' } }, { createdAt: 'desc' }],
    include: threadInclude,
    take: 200,
  });
  return { permission: access.permission, threads };
}

async function allowedMentionIds(subjectId: number, ownerId: number, raw: unknown): Promise<number[]> {
  if (!Array.isArray(raw)) return [];
  const requested = [...new Set(raw.map(Number).filter((id) => Number.isInteger(id) && id > 0))].slice(0, 20);
  if (requested.length === 0) return [];
  const shares = await prisma.noteSubjectShare.findMany({
    where: { subjectId, recipientId: { in: requested } },
    select: { recipientId: true },
  });
  const allowed = new Set([ownerId, ...shares.map((share) => share.recipientId)]);
  return requested.filter((id) => allowed.has(id));
}

export async function createNoteComment(
  userId: number,
  noteId: number,
  input: { content?: unknown; parentId?: unknown; mentions?: unknown },
) {
  const access = await resolveNoteAccess(userId, noteId);
  if (!canCommentOnNote(access.permission)) throw new AppError('Bạn cần quyền bình luận', 403, 'COMMENT_PERMISSION_REQUIRED');
  const content = cleanComment(input.content);
  const requestedParentId = input.parentId == null ? null : Number(input.parentId);
  let parent: { id: number; authorId: number; parentId: number | null } | null = null;
  if (requestedParentId !== null) {
    assertPositiveInt(requestedParentId, 'parentId');
    parent = await prisma.noteComment.findFirst({
      where: { id: requestedParentId, noteId },
      select: { id: true, authorId: true, parentId: true },
    });
    if (!parent || parent.parentId !== null) throw new AppError('Chỉ hỗ trợ một cấp trả lời', 400, 'INVALID_COMMENT_PARENT');
  }
  const mentions = await allowedMentionIds(access.subjectId, access.ownerId, input.mentions);

  const comment = await prisma.$transaction(async (tx) => {
    const created = await tx.noteComment.create({
      data: { noteId, authorId: userId, parentId: parent?.id ?? null, content },
    });
    if (mentions.length > 0) {
      await tx.noteCommentMention.createMany({
        data: mentions.map((mentionedId) => ({ commentId: created.id, userId: mentionedId })),
        skipDuplicates: true,
      });
    }
    return tx.noteComment.findUniqueOrThrow({ where: { id: created.id }, include: replyInclude });
  });

  const notified = new Set<number>();
  if (parent && parent.authorId !== userId) {
    notified.add(parent.authorId);
    await notifyNoteCollaboration(parent.authorId, userId, 'NOTE_REPLY', noteId, comment.id, {
      parentId: parent.id, subjectId: access.subjectId, ownerId: access.ownerId,
    });
  } else if (!parent && access.ownerId !== userId) {
    notified.add(access.ownerId);
    await notifyNoteCollaboration(access.ownerId, userId, 'NOTE_COMMENT', noteId, comment.id, {
      subjectId: access.subjectId, ownerId: access.ownerId,
    });
  }
  for (const mentionedId of mentions) {
    if (mentionedId === userId || notified.has(mentionedId)) continue;
    await notifyNoteCollaboration(mentionedId, userId, 'NOTE_MENTION', noteId, comment.id, {
      subjectId: access.subjectId, ownerId: access.ownerId,
    });
  }
  return comment;
}

export async function updateNoteComment(userId: number, commentId: number, contentInput: unknown) {
  assertPositiveInt(commentId, 'commentId');
  const comment = await prisma.noteComment.findUnique({ where: { id: commentId }, select: { id: true, noteId: true, authorId: true } });
  if (!comment) throw new AppError('Comment not found', 404, 'COMMENT_NOT_FOUND');
  await resolveNoteAccess(userId, comment.noteId);
  if (comment.authorId !== userId) throw new AppError('Bạn chỉ có thể sửa bình luận của mình', 403, 'NOT_COMMENT_AUTHOR');
  return prisma.noteComment.update({ where: { id: commentId }, data: { content: cleanComment(contentInput) }, include: replyInclude });
}

export async function setNoteCommentResolved(userId: number, commentId: number, resolved: boolean) {
  assertPositiveInt(commentId, 'commentId');
  const comment = await prisma.noteComment.findUnique({ where: { id: commentId }, select: { id: true, noteId: true, authorId: true, parentId: true } });
  if (!comment || comment.parentId !== null) throw new AppError('Discussion thread not found', 404, 'COMMENT_THREAD_NOT_FOUND');
  const access = await resolveNoteAccess(userId, comment.noteId);
  if (!(access.permission === 'owner' || access.permission === 'editor' || comment.authorId === userId)) {
    throw new AppError('Bạn không có quyền đóng thảo luận này', 403, 'RESOLVE_PERMISSION_REQUIRED');
  }
  return prisma.noteComment.update({
    where: { id: commentId },
    data: resolved ? { resolvedAt: new Date(), resolvedById: userId } : { resolvedAt: null, resolvedById: null },
    include: threadInclude,
  });
}

export async function deleteNoteComment(userId: number, commentId: number) {
  assertPositiveInt(commentId, 'commentId');
  const comment = await prisma.noteComment.findUnique({ where: { id: commentId }, select: { id: true, noteId: true, authorId: true } });
  if (!comment) throw new AppError('Comment not found', 404, 'COMMENT_NOT_FOUND');
  const access = await resolveNoteAccess(userId, comment.noteId);
  if (comment.authorId !== userId && access.permission !== 'owner') {
    throw new AppError('Bạn không có quyền xóa bình luận này', 403, 'DELETE_COMMENT_FORBIDDEN');
  }
  await prisma.noteComment.delete({ where: { id: commentId } });
  return { id: commentId, deleted: true };
}
