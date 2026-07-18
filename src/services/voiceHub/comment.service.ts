/**
 * Voice Hub — viewer comments service.
 *
 * Flat comments with one level of replies (a reply to a reply is re-parented
 * onto the top-level comment, so threads never nest deeper than 2). Likes are
 * a denormalised counter kept in sync inside a transaction. Reading is public;
 * writing requires a logged-in user. Delete/edit is owner-only, with admins
 * allowed to delete for moderation.
 *
 * Mirrors src/services/techTrends/comment.service.ts (article → post).
 */
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

const MAX_LEN = 4_000;

const authorSelect = {
  select: { id: true, username: true, displayName: true, fullName: true, avatarUrl: true },
} as const;

async function userIsAdmin(userId: number): Promise<boolean> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { roles: { select: { role: { select: { name: true } } } } },
  });
  return !!u?.roles.some((r) => /admin/i.test(r.role.name));
}

interface CommentDto {
  id: number;
  parentId: number | null;
  content: string;
  likesCount: number;
  likedByMe: boolean;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: { id: number; username: string; displayName: string | null; fullName: string | null; avatarUrl: string | null };
  replies: CommentDto[];
}

function toDto(c: Record<string, unknown>, likedSet: Set<number>): CommentDto {
  return {
    id: c.id as number,
    parentId: (c.parentId as number | null) ?? null,
    content: c.content as string,
    likesCount: c.likesCount as number,
    likedByMe: likedSet.has(c.id as number),
    isEdited: c.isEdited as boolean,
    createdAt: c.createdAt as Date,
    updatedAt: c.updatedAt as Date,
    author: c.user as CommentDto['author'],
    replies: [],
  };
}

export async function listComments(postId: number, viewerId?: number | null) {
  const rows = await prisma.voiceComment.findMany({
    where: { postId },
    orderBy: { createdAt: 'asc' },
    include: { user: authorSelect },
  });

  // Which of these comments has the viewer liked?
  let likedSet = new Set<number>();
  if (viewerId) {
    const likes = await prisma.voiceCommentLike.findMany({
      where: { userId: viewerId, comment: { postId } },
      select: { commentId: true },
    });
    likedSet = new Set(likes.map((l) => l.commentId));
  }

  // Build a 2-level tree: top-level newest-first, replies oldest-first.
  const dtos = rows.map((r) => toDto(r as unknown as Record<string, unknown>, likedSet));
  const byId = new Map(dtos.map((d) => [d.id, d]));
  const top: CommentDto[] = [];
  for (const d of dtos) {
    if (d.parentId && byId.has(d.parentId)) byId.get(d.parentId)!.replies.push(d);
    else top.push(d);
  }
  top.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return { comments: top, total: rows.length };
}

export async function createComment(
  postId: number,
  userId: number,
  content: string,
  parentId?: number | null,
): Promise<CommentDto> {
  const text = String(content ?? '').trim();
  if (!text) throw new AppError('Nội dung bình luận không được trống', 400, 'EMPTY_COMMENT');
  if (text.length > MAX_LEN) throw new AppError(`Bình luận quá dài (tối đa ${MAX_LEN} ký tự)`, 400, 'COMMENT_TOO_LONG');

  const post = await prisma.voicePost.findUnique({ where: { id: postId }, select: { status: true } });
  if (!post || post.status !== 'PUBLISHED') throw new AppError('Post not found', 404, 'POST_NOT_FOUND');

  // Re-parent replies-to-replies onto the top-level comment (max depth 2).
  let effectiveParent: number | null = null;
  if (parentId) {
    const parent = await prisma.voiceComment.findUnique({ where: { id: parentId }, select: { id: true, postId: true, parentId: true } });
    if (!parent || parent.postId !== postId) throw new AppError('Bình luận gốc không tồn tại', 400, 'PARENT_NOT_FOUND');
    effectiveParent = parent.parentId ?? parent.id;
  }

  const created = await prisma.voiceComment.create({
    data: { postId, userId, content: text, parentId: effectiveParent },
    include: { user: authorSelect },
  });
  return toDto(created as unknown as Record<string, unknown>, new Set());
}

export async function editComment(commentId: number, userId: number, content: string): Promise<CommentDto> {
  const text = String(content ?? '').trim();
  if (!text) throw new AppError('Nội dung bình luận không được trống', 400, 'EMPTY_COMMENT');
  if (text.length > MAX_LEN) throw new AppError(`Bình luận quá dài (tối đa ${MAX_LEN} ký tự)`, 400, 'COMMENT_TOO_LONG');

  const existing = await prisma.voiceComment.findUnique({ where: { id: commentId }, select: { userId: true } });
  if (!existing) throw new AppError('Comment not found', 404, 'COMMENT_NOT_FOUND');
  if (existing.userId !== userId) throw new AppError('Không có quyền sửa bình luận này', 403, 'FORBIDDEN');

  const updated = await prisma.voiceComment.update({
    where: { id: commentId },
    data: { content: text, isEdited: true },
    include: { user: authorSelect },
  });
  return toDto(updated as unknown as Record<string, unknown>, new Set());
}

export async function deleteComment(commentId: number, userId: number): Promise<void> {
  const existing = await prisma.voiceComment.findUnique({ where: { id: commentId }, select: { userId: true } });
  if (!existing) throw new AppError('Comment not found', 404, 'COMMENT_NOT_FOUND');
  if (existing.userId !== userId && !(await userIsAdmin(userId))) {
    throw new AppError('Không có quyền xoá bình luận này', 403, 'FORBIDDEN');
  }
  await prisma.voiceComment.delete({ where: { id: commentId } });
}

export async function toggleLike(commentId: number, userId: number): Promise<{ liked: boolean; likesCount: number }> {
  const comment = await prisma.voiceComment.findUnique({ where: { id: commentId }, select: { id: true } });
  if (!comment) throw new AppError('Comment not found', 404, 'COMMENT_NOT_FOUND');

  const existing = await prisma.voiceCommentLike.findUnique({
    where: { uk_voice_comment_like: { commentId, userId } },
    select: { id: true },
  });

  if (existing) {
    const [, updated] = await prisma.$transaction([
      prisma.voiceCommentLike.delete({ where: { id: existing.id } }),
      prisma.voiceComment.update({ where: { id: commentId }, data: { likesCount: { decrement: 1 } }, select: { likesCount: true } }),
    ]);
    return { liked: false, likesCount: Math.max(0, updated.likesCount) };
  }

  try {
    const [, updated] = await prisma.$transaction([
      prisma.voiceCommentLike.create({ data: { commentId, userId } }),
      prisma.voiceComment.update({ where: { id: commentId }, data: { likesCount: { increment: 1 } }, select: { likesCount: true } }),
    ]);
    return { liked: true, likesCount: updated.likesCount };
  } catch {
    // Unique race: the like already exists — report current state.
    const c = await prisma.voiceComment.findUnique({ where: { id: commentId }, select: { likesCount: true } });
    return { liked: true, likesCount: c?.likesCount ?? 0 };
  }
}
