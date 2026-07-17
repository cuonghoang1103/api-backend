/**
 * EXP_Hub — comments + emoji reactions service.
 *
 * Comments are flat with one level of replies (a reply-to-a-reply is
 * re-parented onto the top-level comment, so threads never nest deeper than 2)
 * — the same shape as the Tech Trends reader comments. Reactions are
 * GitHub-style: a logged-in user can add several distinct emoji to a snippet
 * or a comment, each (target, user, emoji) unique; reacting again with the
 * same emoji removes it. Reading is public; writing requires a login;
 * edit/delete is owner-only, with admins allowed to delete for moderation.
 */
import { prisma } from '../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../middleware/errorHandler.js';

const MAX_LEN = 4_000;

// The curated reaction palette. Server-validated so callers can't store
// arbitrary strings.
export const ALLOWED_EMOJI = ['👍', '❤️', '😄', '🎉', '🚀', '👀'] as const;
export type ReactionEmoji = (typeof ALLOWED_EMOJI)[number];

function assertEmoji(emoji: string): asserts emoji is ReactionEmoji {
  if (!ALLOWED_EMOJI.includes(emoji as ReactionEmoji)) {
    throw new BadRequestError('Emoji không hợp lệ');
  }
}

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

// ─── Reaction summaries ────────────────────────────────────────────────

export interface ReactionSummary {
  emoji: string;
  count: number;
  mine: boolean;
}

// Order the summary by the canonical palette so the bar is stable.
function orderSummary(map: Map<string, { count: number; mine: boolean }>): ReactionSummary[] {
  return ALLOWED_EMOJI
    .map((emoji) => ({ emoji, ...(map.get(emoji) ?? { count: 0, mine: false }) }))
    .filter((r) => r.count > 0);
}

export async function summarizeSnippetReactions(snippetId: number, viewerId?: number | null): Promise<ReactionSummary[]> {
  const rows = await prisma.snippetReaction.findMany({
    where: { snippetId },
    select: { emoji: true, userId: true },
  });
  const map = new Map<string, { count: number; mine: boolean }>();
  for (const r of rows) {
    const e = map.get(r.emoji) ?? { count: 0, mine: false };
    e.count += 1;
    if (viewerId && r.userId === viewerId) e.mine = true;
    map.set(r.emoji, e);
  }
  return orderSummary(map);
}

// ─── Comments ──────────────────────────────────────────────────────────

interface CommentDto {
  id: number;
  parentId: number | null;
  content: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: { id: number; username: string; displayName: string | null; fullName: string | null; avatarUrl: string | null } | null;
  reactions: ReactionSummary[];
  replies: CommentDto[];
}

export async function listComments(snippetId: number, viewerId?: number | null) {
  const rows = await prisma.snippetComment.findMany({
    where: { snippetId },
    orderBy: { createdAt: 'asc' },
    include: { user: authorSelect },
  });

  // All reactions for these comments in one query, grouped per comment+emoji.
  const reactionRows = await prisma.snippetCommentReaction.findMany({
    where: { comment: { snippetId } },
    select: { commentId: true, emoji: true, userId: true },
  });
  const byComment = new Map<number, Map<string, { count: number; mine: boolean }>>();
  for (const r of reactionRows) {
    let m = byComment.get(r.commentId);
    if (!m) { m = new Map(); byComment.set(r.commentId, m); }
    const e = m.get(r.emoji) ?? { count: 0, mine: false };
    e.count += 1;
    if (viewerId && r.userId === viewerId) e.mine = true;
    m.set(r.emoji, e);
  }

  const dtos: CommentDto[] = rows.map((r) => ({
    id: r.id,
    parentId: r.parentId,
    content: r.content,
    isEdited: r.isEdited,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    author: r.user,
    reactions: orderSummary(byComment.get(r.id) ?? new Map()),
    replies: [],
  }));

  const byId = new Map(dtos.map((d) => [d.id, d]));
  const top: CommentDto[] = [];
  for (const d of dtos) {
    if (d.parentId && byId.has(d.parentId)) byId.get(d.parentId)!.replies.push(d);
    else top.push(d);
  }
  // Top-level newest-first; replies stay oldest-first (already sorted).
  top.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return { comments: top, total: rows.length };
}

export async function createComment(
  snippetId: number,
  userId: number,
  content: string,
  parentId?: number | null,
): Promise<CommentDto> {
  const text = String(content ?? '').trim();
  if (!text) throw new BadRequestError('Nội dung bình luận không được trống');
  if (text.length > MAX_LEN) throw new BadRequestError(`Bình luận quá dài (tối đa ${MAX_LEN} ký tự)`);

  const snippet = await prisma.snippet.findUnique({ where: { id: snippetId }, select: { id: true } });
  if (!snippet) throw new NotFoundError('Snippet not found');

  // Re-parent replies-to-replies onto the top-level comment (max depth 2).
  let effectiveParent: number | null = null;
  if (parentId) {
    const parent = await prisma.snippetComment.findUnique({
      where: { id: parentId },
      select: { id: true, snippetId: true, parentId: true },
    });
    if (!parent || parent.snippetId !== snippetId) throw new BadRequestError('Bình luận gốc không tồn tại');
    effectiveParent = parent.parentId ?? parent.id;
  }

  const created = await prisma.snippetComment.create({
    data: { snippetId, userId, content: text, parentId: effectiveParent },
    include: { user: authorSelect },
  });
  return {
    id: created.id,
    parentId: created.parentId,
    content: created.content,
    isEdited: created.isEdited,
    createdAt: created.createdAt,
    updatedAt: created.updatedAt,
    author: created.user,
    reactions: [],
    replies: [],
  };
}

export async function editComment(commentId: number, userId: number, content: string): Promise<void> {
  const text = String(content ?? '').trim();
  if (!text) throw new BadRequestError('Nội dung bình luận không được trống');
  if (text.length > MAX_LEN) throw new BadRequestError(`Bình luận quá dài (tối đa ${MAX_LEN} ký tự)`);

  const existing = await prisma.snippetComment.findUnique({ where: { id: commentId }, select: { userId: true } });
  if (!existing) throw new NotFoundError('Comment not found');
  if (existing.userId !== userId) throw new ForbiddenError('Không có quyền sửa bình luận này');

  await prisma.snippetComment.update({ where: { id: commentId }, data: { content: text, isEdited: true } });
}

export async function deleteComment(commentId: number, userId: number): Promise<void> {
  const existing = await prisma.snippetComment.findUnique({ where: { id: commentId }, select: { userId: true } });
  if (!existing) throw new NotFoundError('Comment not found');
  if (existing.userId !== userId && !(await userIsAdmin(userId))) {
    throw new ForbiddenError('Không có quyền xoá bình luận này');
  }
  await prisma.snippetComment.delete({ where: { id: commentId } });
}

// ─── Reactions toggles ─────────────────────────────────────────────────

export async function toggleSnippetReaction(snippetId: number, userId: number, emoji: string): Promise<ReactionSummary[]> {
  assertEmoji(emoji);
  const snippet = await prisma.snippet.findUnique({ where: { id: snippetId }, select: { id: true } });
  if (!snippet) throw new NotFoundError('Snippet not found');

  const existing = await prisma.snippetReaction.findUnique({
    where: { uk_snippet_reaction: { snippetId, userId, emoji } },
    select: { id: true },
  });
  if (existing) {
    await prisma.snippetReaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.snippetReaction.create({ data: { snippetId, userId, emoji } }).catch(() => { /* unique race — ignore */ });
  }
  return summarizeSnippetReactions(snippetId, userId);
}

export async function toggleCommentReaction(commentId: number, userId: number, emoji: string): Promise<ReactionSummary[]> {
  assertEmoji(emoji);
  const comment = await prisma.snippetComment.findUnique({ where: { id: commentId }, select: { id: true } });
  if (!comment) throw new NotFoundError('Comment not found');

  const existing = await prisma.snippetCommentReaction.findUnique({
    where: { uk_snippet_comment_reaction: { commentId, userId, emoji } },
    select: { id: true },
  });
  if (existing) {
    await prisma.snippetCommentReaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.snippetCommentReaction.create({ data: { commentId, userId, emoji } }).catch(() => { /* unique race */ });
  }

  const rows = await prisma.snippetCommentReaction.findMany({ where: { commentId }, select: { emoji: true, userId: true } });
  const map = new Map<string, { count: number; mine: boolean }>();
  for (const r of rows) {
    const e = map.get(r.emoji) ?? { count: 0, mine: false };
    e.count += 1;
    if (r.userId === userId) e.mine = true;
    map.set(r.emoji, e);
  }
  return orderSummary(map);
}
