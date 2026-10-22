/**
 * CT Work — BẢNG TIN NHÓM (Team Feed, 21/10/2026). Hợp đồng: docs/ctw-feed-hop-dong-api.md.
 *
 * Hai cấp: bài cấp KHÔNG GIAN (projectId NULL) và bài của DỰ ÁN. Quyền thuần ở feedRules.ts, tầng DB ở feedAccess.ts,
 * tệp + thẻ link ở feedMedia.service.ts. Mọi đường (REST, socket, MCP tool `feed`, POST /work/report) đi qua các hàm ở đây.
 *
 *   - Không thấy bài ⇒ 404 (không lộ là có). Agent ⇒ 403 ở cửa mọi lệnh.
 *   - Bộ đếm reactionCount / commentCount / replyCount cập nhật trong CÙNG transaction với dòng con.
 *   - Người mình chặn (user_blocks): bài không vào bảng tin; bình luận trả `hiddenForMe`.
 *   - Thời gian thực: phòng `work:feed:ws:<id>` / `work:feed:p:<id>` — sự kiện chỉ mang id + bộ đếm (client tải lại qua REST).
 *   - Thông báo chạy NỀN sau commit (feedBackground) — lệnh của người dùng không chờ hàng trăm chuông.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { getIO } from '../../socket/messaging.socket.js';
import { logger } from '../../utils/logger.js';
import { chanNoiDungXau } from '../locNoiDung.js';
import type { ChatRef } from './chatRules.js';
import { displayName, PUBLIC_USER, type PublicUser } from './common.js';
import { accessFor, assertFeedPerson, authorRoles, feedScopesFor, scopeReaders, type FeedScopes } from './feedAccess.js';
import {
  ATT_SELECT, buildStoredPreview, claimableDrafts, dropObjects, feedBackground, presentAttachment, presentPreview, type AttRow, type StoredPreview,
} from './feedMedia.service.js';
import {
  attachmentMixError, canCommentOn, canDelete, canEditOwn, cleanBody, COMMENT_BODY_MAX, COMMENTS_PER_MINUTE, decodeCursor, encodeCursor,
  excerptOf, firstWebLink, hashtagsIn, MAX_PINNED_PER_SCOPE, mentionsIn, NO_ACCESS, normalizePoll, notifyMention, notifyNewPost, pollClosed,
  pollOf, POST_BODY_MAX, postUrl, POSTS_PER_MINUTE, REACTION_NOTIFY_WINDOW_MS, reactionMessage, reactionSummary, refsIn, scopeKey, validVote,
  visibleModerated, type AttachmentKind, type FeedAccess, type FeedFilter, type FollowLevel, type ReactionKind,
} from './feedRules.js';
import { blockersOf, notifyWork } from './notify.js';

// ─── Phòng socket ────────────────────────────────────────────────

export const feedRoom = (workspaceId: number, projectId: number | null): string => (projectId ? `work:feed:p:${projectId}` : `work:feed:ws:${workspaceId}`);

export type FeedEventType = 'post.created' | 'post.updated' | 'post.deleted' | 'comment.created' | 'comment.updated' | 'comment.deleted' | 'reaction' | 'poll';

function emitFeed(scope: { workspaceId: number; projectId: number | null }, type: FeedEventType, data: Record<string, unknown>): void {
  getIO()?.to(feedRoom(scope.workspaceId, scope.projectId)).emit('work:feed:event', {
    type, workspaceId: scope.workspaceId, projectId: scope.projectId, at: new Date().toISOString(), ...data,
  });
}

/** Phòng mà một người được vào (socket `work:feed:subscribe`). */
export async function feedRoomsFor(userId: number): Promise<string[]> {
  const s = await feedScopesFor(userId);
  return [
    ...[...s.workspaces.keys()].map((id) => feedRoom(id, null)),
    ...[...s.projects.keys()].map((id) => feedRoom(0, id)),
  ].slice(0, 300);
}

// ─── Chọn cột ────────────────────────────────────────────────────

const POST_SELECT = {
  id: true, workspaceId: true, projectId: true, authorId: true, body: true, mentions: true, hashtags: true, refs: true, linkPreview: true, poll: true,
  commentsOff: true, pinnedAt: true, reactionCount: true, commentCount: true, editedAt: true, hiddenAt: true, deletedAt: true, createdAt: true,
  author: { select: PUBLIC_USER },
  workspace: { select: { id: true, slug: true, name: true, logoUrl: true } },
  project: { select: { id: true, key: true, name: true, visibility: true } },
  attachments: { where: { status: 'READY' }, orderBy: [{ position: 'asc' as const }, { id: 'asc' as const }], select: ATT_SELECT },
} satisfies Prisma.WorkFeedPostSelect;
type PostRow = Prisma.WorkFeedPostGetPayload<{ select: typeof POST_SELECT }>;

const COMMENT_SELECT = {
  id: true, postId: true, parentId: true, authorId: true, body: true, mentions: true, reactionCount: true, replyCount: true,
  editedAt: true, hiddenAt: true, createdAt: true, author: { select: PUBLIC_USER },
} satisfies Prisma.WorkFeedCommentSelect;
type CommentRow = Prisma.WorkFeedCommentGetPayload<{ select: typeof COMMENT_SELECT }>;

// ─── Ngữ cảnh một bài ────────────────────────────────────────────

export interface PostCtx { post: PostRow; access: FeedAccess; role: string | null }

/**
 * Bài mà `userId` THẤY được (404 nếu không): còn sống, phạm vi đọc được, chưa bị gỡ (trừ tác giả/quản trị), tác giả không
 * bị người xem chặn (trừ chính mình).
 */
export async function visiblePost(userId: number, postId: number): Promise<PostCtx> {
  await assertFeedPerson(userId);
  const post = await prisma.workFeedPost.findFirst({
    where: { id: postId, deletedAt: null, workspace: { deletedAt: null }, OR: [{ projectId: null }, { project: { deletedAt: null } }] }, select: POST_SELECT,
  });
  if (!post) throw new NotFoundError('Post not found');
  const { access, role } = await accessFor(userId, post.workspaceId, post.projectId);
  if (!access.read) throw new NotFoundError('Post not found');
  if (!visibleModerated(!!post.hiddenAt, userId, post.authorId, access)) throw new NotFoundError('Post not found');
  if (post.authorId !== userId) {
    const blocked = await prisma.userBlock.findFirst({ where: { blockerId: userId, blockedId: post.authorId }, select: { id: true } });
    if (blocked) throw new NotFoundError('Post not found');
  }
  return { post, access, role };
}

const forbid = (msg = 'You cannot do this on the team feed') => new ForbiddenError(msg);

// ─── Trình bày ───────────────────────────────────────────────────

interface MentionUser { id: number; username: string; name: string }

async function mentionUsers(ids: number[]): Promise<Map<number, MentionUser>> {
  const uniq = [...new Set(ids)].filter((x) => Number.isInteger(x) && x > 0);
  if (!uniq.length) return new Map();
  const rows = await prisma.user.findMany({ where: { id: { in: uniq } }, select: { id: true, username: true, displayName: true, fullName: true } });
  return new Map(rows.map((u) => [u.id, { id: u.id, username: u.username, name: displayName(u) }]));
}

async function blockedSet(viewerId: number, authorIds: number[]): Promise<Set<number>> {
  const ids = [...new Set(authorIds)].filter((x) => x !== viewerId);
  if (!ids.length) return new Set();
  const rows = await prisma.userBlock.findMany({ where: { blockerId: viewerId, blockedId: { in: ids } }, select: { blockedId: true } });
  return new Set(rows.map((r) => r.blockedId));
}

async function reactionMaps<K extends 'postId' | 'commentId'>(field: K, ids: number[], viewerId: number) {
  if (!ids.length) return { mine: new Map<number, ReactionKind>(), summary: new Map<number, Array<{ kind: ReactionKind; count: number }>>() };
  const [mine, grouped] = field === 'postId'
    ? await Promise.all([
      prisma.workFeedReaction.findMany({ where: { postId: { in: ids }, userId: viewerId }, select: { postId: true, kind: true } }),
      prisma.workFeedReaction.groupBy({ by: ['postId', 'kind'], where: { postId: { in: ids } }, _count: { _all: true } }),
    ]).then(([m, g]) => [m.map((x) => ({ id: x.postId, kind: x.kind })), g.map((x) => ({ id: x.postId, kind: x.kind, count: x._count._all }))] as const)
    : await Promise.all([
      prisma.workFeedCommentReaction.findMany({ where: { commentId: { in: ids }, userId: viewerId }, select: { commentId: true, kind: true } }),
      prisma.workFeedCommentReaction.groupBy({ by: ['commentId', 'kind'], where: { commentId: { in: ids } }, _count: { _all: true } }),
    ]).then(([m, g]) => [m.map((x) => ({ id: x.commentId, kind: x.kind })), g.map((x) => ({ id: x.commentId, kind: x.kind, count: x._count._all }))] as const);
  const byId = new Map<number, Array<{ kind: string; count: number }>>();
  for (const g of grouped) byId.set(g.id, [...(byId.get(g.id) ?? []), { kind: g.kind, count: g.count }]);
  return {
    mine: new Map(mine.map((m) => [m.id, m.kind as ReactionKind])),
    summary: new Map([...byId].map(([id, rows]) => [id, reactionSummary(rows)])),
  };
}

interface CommentCtx { access: FeedAccess; commentsOff: boolean }

/** Bình luận đã lọc sẵn (sống, thấy được) ⇒ dạng FeedComment. `replies` gắn sau bởi người gọi. */
async function presentComments(viewerId: number, rows: CommentRow[], ctxOf: (postId: number) => CommentCtx) {
  if (!rows.length) return [];
  const ids = rows.map((c) => c.id);
  const [react, blocked, reported, users] = await Promise.all([
    reactionMaps('commentId', ids, viewerId),
    blockedSet(viewerId, rows.map((c) => c.authorId)),
    prisma.workFeedReport.findMany({ where: { reporterId: viewerId, targetKey: { in: ids.map((id) => `c:${id}`) } }, select: { commentId: true } }),
    mentionUsers(rows.flatMap((c) => c.mentions)),
  ]);
  const rep = new Set(reported.map((r) => r.commentId));
  return rows.map((c) => {
    const ctx = ctxOf(c.postId);
    const mine = c.authorId === viewerId;
    const authorBlocked = !mine && blocked.has(c.authorId);
    const reportedByMe = rep.has(c.id);
    return {
      id: c.id, postId: c.postId, parentId: c.parentId, author: c.author, body: c.body,
      mentions: c.mentions.map((id) => users.get(id)).filter((x): x is MentionUser => !!x),
      reactionCount: c.reactionCount, reactions: react.summary.get(c.id) ?? [], myReaction: react.mine.get(c.id) ?? null,
      replyCount: c.parentId ? 0 : c.replyCount, replies: [] as unknown[],
      hidden: !!c.hiddenAt, hiddenForMe: authorBlocked || reportedByMe, authorBlocked, reportedByMe,
      editedAt: c.editedAt, createdAt: c.createdAt,
      can: {
        edit: mine, delete: canDelete(viewerId, c.authorId, ctx.access), moderate: ctx.access.moderate, report: !mine,
        reply: canCommentOn(ctx.access, ctx.commentsOff),
      },
    };
  });
}
export type FeedCommentOut = Awaited<ReturnType<typeof presentComments>>[number];

/** Bình luận đọc được: sống; bị gỡ thì chỉ tác giả + quản trị phạm vi. */
function commentVisibleWhere(viewerId: number, access: FeedAccess): Prisma.WorkFeedCommentWhereInput {
  return access.moderate ? { deletedAt: null } : { deletedAt: null, OR: [{ hiddenAt: null }, { authorId: viewerId }] };
}

/** Hai bình luận GỐC mới nhất của mỗi bài (xem trước trên thẻ bài), xếp cũ → mới. */
async function latestComments(viewerId: number, posts: Array<{ id: number; access: FeedAccess }>): Promise<CommentRow[]> {
  if (!posts.length) return [];
  const modIds = posts.filter((p) => p.access.moderate).map((p) => p.id);
  const ids = posts.map((p) => p.id);
  const rows = await prisma.$queryRaw<Array<{ id: number }>>`
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY post_id ORDER BY created_at DESC, id DESC) AS rn
      FROM work_feed_comments
      WHERE post_id IN (${Prisma.join(ids)}) AND parent_id IS NULL AND deleted_at IS NULL
        AND (hidden_at IS NULL OR author_id = ${viewerId} ${modIds.length ? Prisma.sql`OR post_id IN (${Prisma.join(modIds)})` : Prisma.empty})
    ) t WHERE rn <= 2`;
  if (!rows.length) return [];
  return prisma.workFeedComment.findMany({ where: { id: { in: rows.map((r) => r.id) } }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }], select: COMMENT_SELECT });
}

/** Trang bài ⇒ FeedPost[] (một lượt truy vấn cho cả trang). */
async function presentPosts(viewerId: number, rows: PostRow[], accessOf: (p: PostRow) => { access: FeedAccess; role?: string | null }) {
  if (!rows.length) return [];
  const ids = rows.map((p) => p.id);
  const pollIds = rows.filter((p) => p.poll).map((p) => p.id);
  const acc = new Map(rows.map((p) => [p.id, accessOf(p).access]));
  const [react, saves, hides, voteCounts, voterRows, myVotes, roles, previews, comments] = await Promise.all([
    reactionMaps('postId', ids, viewerId),
    prisma.workFeedSave.findMany({ where: { postId: { in: ids }, userId: viewerId }, select: { postId: true } }),
    prisma.workFeedHide.findMany({ where: { postId: { in: ids }, userId: viewerId }, select: { postId: true } }),
    pollIds.length ? prisma.workFeedPollVote.groupBy({ by: ['postId', 'optionId'], where: { postId: { in: pollIds } }, _count: { _all: true } }) : [],
    pollIds.length ? prisma.workFeedPollVote.groupBy({ by: ['postId', 'userId'], where: { postId: { in: pollIds } } }) : [],
    pollIds.length ? prisma.workFeedPollVote.findMany({ where: { postId: { in: pollIds }, userId: viewerId }, select: { postId: true, optionId: true } }) : [],
    authorRoles(rows.map((p) => ({ workspaceId: p.workspaceId, projectId: p.projectId, authorId: p.authorId, projectVisibility: p.project?.visibility ?? null }))),
    import('./chat.service.js').then((m) => m.resolveRefPreviews(viewerId, rows.map((p) => (Array.isArray(p.refs) ? (p.refs as unknown as ChatRef[]) : []).filter((r) => r.t !== 'web')))),
    latestComments(viewerId, rows.map((p) => ({ id: p.id, access: acc.get(p.id)! }))),
  ]);
  const users = await mentionUsers(rows.flatMap((p) => p.mentions));
  const commentOut = await presentComments(viewerId, comments, (pid) => ({ access: acc.get(pid) ?? NO_ACCESS, commentsOff: rows.find((r) => r.id === pid)?.commentsOff ?? false }));
  const saved = new Set(saves.map((s) => s.postId));
  const hidden = new Set(hides.map((h) => h.postId));
  const votes = new Map<string, number>(voteCounts.map((v) => [`${v.postId}:${v.optionId}`, v._count._all]));
  const voters = new Map<number, number>();
  for (const v of voterRows) voters.set(v.postId, (voters.get(v.postId) ?? 0) + 1);
  const mineVotes = new Map<number, string[]>();
  for (const v of myVotes) mineVotes.set(v.postId, [...(mineVotes.get(v.postId) ?? []), v.optionId]);

  const out = [];
  for (const p of rows) {
    const { access } = accessOf(p);
    const mine = p.authorId === viewerId;
    const def = pollOf(p.poll);
    const poll = def ? {
      options: def.options.map((o) => ({ id: o.id, text: o.text, votes: votes.get(`${p.id}:${o.id}`) ?? 0 })),
      multi: def.multi, closesAt: def.closesAt, closed: pollClosed(def),
      totalVotes: def.options.reduce((n, o) => n + (votes.get(`${p.id}:${o.id}`) ?? 0), 0), voters: voters.get(p.id) ?? 0, myVotes: mineVotes.get(p.id) ?? [],
    } : null;
    const refs = (Array.isArray(p.refs) ? (p.refs as unknown as ChatRef[]) : []).flatMap((r) => {
      if (r.t === 'web') return [];
      const hit = previews.get(`${r.t}:${r.ws ?? p.workspace.slug}:${r.key}:${r.n}`);
      return hit ? [hit] : [];
    });
    out.push({
      id: p.id,
      workspace: { id: p.workspace.id, slug: p.workspace.slug, name: p.workspace.name, logoUrl: p.workspace.logoUrl },
      project: p.project ? { id: p.project.id, key: p.project.key, name: p.project.name } : null,
      author: p.author,
      authorRole: roles.get(`${p.workspaceId}:${p.projectId ?? 0}:${p.authorId}`) ?? null,
      body: p.body,
      mentions: p.mentions.map((id) => users.get(id)).filter((x): x is MentionUser => !!x),
      hashtags: p.hashtags,
      attachments: await Promise.all(p.attachments.map((a) => presentAttachment(a as AttRow))),
      linkPreview: await presentPreview(p.linkPreview),
      refs,
      poll,
      reactionCount: p.reactionCount, reactions: react.summary.get(p.id) ?? [], myReaction: react.mine.get(p.id) ?? null,
      commentCount: p.commentCount,
      comments: commentOut.filter((c) => c.postId === p.id),
      commentsOff: p.commentsOff,
      pinned: !!p.pinnedAt, pinnedAt: p.pinnedAt,
      saved: saved.has(p.id), hiddenForMe: hidden.has(p.id),
      hidden: !!p.hiddenAt,
      editedAt: p.editedAt, createdAt: p.createdAt,
      url: postUrl(p.workspace.slug, p.id),
      can: {
        edit: canEditOwn(viewerId, p.authorId), delete: canDelete(viewerId, p.authorId, access), pin: access.moderate, moderate: access.moderate,
        comment: canCommentOn(access, p.commentsOff), react: access.read, report: !mine,
      },
    });
  }
  return out;
}
export type FeedPostOut = Awaited<ReturnType<typeof presentPosts>>[number];

async function presentOne(userId: number, postId: number): Promise<FeedPostOut> {
  const ctx = await visiblePost(userId, postId);
  return (await presentPosts(userId, [ctx.post], () => ({ access: ctx.access, role: ctx.role })))[0];
}

export async function getPost(userId: number, postId: number) {
  return presentOne(userId, postId);
}

// ─── Phạm vi + theo dõi + người @nhắc được ──────────────────────

async function followLevels(userId: number, keys: string[]): Promise<Map<string, FollowLevel>> {
  if (!keys.length) return new Map();
  const rows = await prisma.workFeedFollow.findMany({ where: { userId, scopeKey: { in: keys } }, select: { scopeKey: true, level: true } });
  return new Map(rows.map((r) => [r.scopeKey, r.level as FollowLevel]));
}

export async function listScopes(userId: number) {
  await assertFeedPerson(userId);
  const s = await feedScopesFor(userId);
  const keys = [...[...s.wsInfo.keys()].map((id) => scopeKey(id, null)), ...[...s.projects.keys()].map((id) => scopeKey(0, id))];
  const levels = await followLevels(userId, keys);
  const scopes = [...s.wsInfo.values()].map((ws) => {
    const w = s.workspaces.get(ws.id);
    const projects = [...s.projects.values()].filter((p) => p.workspaceId === ws.id).map((p) => ({
      id: p.id, key: p.key, name: p.name, role: p.role, canPost: p.access.post, canModerate: p.access.moderate, follow: levels.get(scopeKey(0, p.id)) ?? 'ALL',
    }));
    return {
      workspace: { id: ws.id, slug: ws.slug, name: ws.name, logoUrl: ws.logoUrl },
      role: w?.role ?? null, canPost: !!w?.access.post, canModerate: !!w?.access.moderate, follow: levels.get(scopeKey(ws.id, null)) ?? 'ALL',
      projects,
    };
  }).filter((x) => x.role || x.projects.length);
  const modWs = [...s.workspaces.values()].filter((w) => w.access.moderate).map((w) => w.id);
  const modProj = [...s.projects.values()].filter((p) => p.access.moderate).map((p) => p.id);
  const openReports = modWs.length || modProj.length
    ? await prisma.workFeedReport.count({ where: { status: 'OPEN', OR: [{ projectId: null, workspaceId: { in: modWs } }, ...(modProj.length ? [{ projectId: { in: modProj } }] : [])] } })
    : 0;
  return { scopes, openReports };
}

export async function setFollow(userId: number, input: { workspaceId: number; projectId?: number | null; level: FollowLevel }) {
  await assertFeedPerson(userId);
  const projectId = input.projectId ?? null;
  const { access } = await accessFor(userId, input.workspaceId, projectId);
  if (!access.read) throw new NotFoundError(projectId ? 'Project not found' : 'Workspace not found');
  const key = scopeKey(input.workspaceId, projectId);
  await prisma.workFeedFollow.upsert({
    where: { userId_scopeKey: { userId, scopeKey: key } },
    create: { userId, workspaceId: input.workspaceId, projectId, scopeKey: key, level: input.level },
    update: { level: input.level },
  });
  return { workspaceId: input.workspaceId, projectId, level: input.level };
}

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

export async function mentionable(userId: number, input: { workspaceId: number; projectId?: number | null; q?: string }) {
  await assertFeedPerson(userId);
  const projectId = input.projectId ?? null;
  const { access } = await accessFor(userId, input.workspaceId, projectId);
  if (!access.read) throw new NotFoundError(projectId ? 'Project not found' : 'Workspace not found');
  const q = fold(input.q?.trim() ?? '');
  const readers = await scopeReaders(input.workspaceId, projectId);
  const users = readers
    .filter((u) => !q || [u.username, u.displayName ?? '', u.fullName ?? ''].some((v) => fold(v).includes(q)))
    .sort((a, b) => (a.id === userId ? 1 : 0) - (b.id === userId ? 1 : 0) || displayName(a).localeCompare(displayName(b)))
    .slice(0, 20);
  return { users };
}

// ─── Bảng tin ────────────────────────────────────────────────────

export interface FeedQuery {
  workspaceId?: number | null;
  projectId?: number | null;
  level?: 'workspace' | null;
  filter?: FeedFilter;
  author?: number | null;
  q?: string | null;
  cursor?: string | null;
  limit?: number;
}

interface ScopeSel { wsIds: number[]; projIds: number[]; modWs: number[]; modProj: number[]; s: FeedScopes }

function selectScopes(s: FeedScopes, q: FeedQuery): ScopeSel {
  let wsIds: number[];
  let projIds: number[];
  if (q.projectId) {
    const p = s.projects.get(q.projectId);
    if (!p || (q.workspaceId && p.workspaceId !== q.workspaceId)) throw new NotFoundError('Project not found');
    wsIds = []; projIds = [p.id];
  } else if (q.workspaceId) {
    if (!s.wsInfo.has(q.workspaceId)) throw new NotFoundError('Workspace not found');
    wsIds = s.workspaces.has(q.workspaceId) ? [q.workspaceId] : [];
    projIds = q.level === 'workspace' ? [] : [...s.projects.values()].filter((p) => p.workspaceId === q.workspaceId).map((p) => p.id);
  } else {
    wsIds = [...s.workspaces.keys()];
    projIds = [...s.projects.keys()];
  }
  return {
    wsIds, projIds, s,
    modWs: wsIds.filter((id) => s.workspaces.get(id)?.access.moderate),
    modProj: projIds.filter((id) => s.projects.get(id)?.access.moderate),
  };
}

function scopeWhere(sel: ScopeSel): Prisma.WorkFeedPostWhereInput[] {
  const or: Prisma.WorkFeedPostWhereInput[] = [];
  if (sel.wsIds.length) or.push({ projectId: null, workspaceId: { in: sel.wsIds } });
  if (sel.projIds.length) or.push({ projectId: { in: sel.projIds } });
  return or;
}

async function baseWhere(userId: number, sel: ScopeSel): Promise<Prisma.WorkFeedPostWhereInput | null> {
  const scopes = scopeWhere(sel);
  if (!scopes.length) return null;
  const blocked = (await prisma.userBlock.findMany({ where: { blockerId: userId }, select: { blockedId: true } })).map((b) => b.blockedId);
  const modOr: Prisma.WorkFeedPostWhereInput[] = [{ hiddenAt: null }, { authorId: userId }];
  if (sel.modWs.length) modOr.push({ projectId: null, workspaceId: { in: sel.modWs } });
  if (sel.modProj.length) modOr.push({ projectId: { in: sel.modProj } });
  return {
    deletedAt: null,
    workspace: { deletedAt: null },
    AND: [{ OR: scopes }, { OR: modOr }, { OR: [{ projectId: null }, { project: { deletedAt: null } }] }],
    hides: { none: { userId } },
    reports: { none: { reporterId: userId } },
    ...(blocked.length ? { authorId: { notIn: blocked } } : {}),
  };
}

function accessFromScopes(s: FeedScopes) {
  return (p: { workspaceId: number; projectId: number | null }) => ({
    access: (p.projectId ? s.projects.get(p.projectId)?.access : s.workspaces.get(p.workspaceId)?.access) ?? NO_ACCESS,
  });
}

export async function listFeed(userId: number, q: FeedQuery = {}) {
  await assertFeedPerson(userId);
  const s = await feedScopesFor(userId);
  const sel = selectScopes(s, q);
  const base = await baseWhere(userId, sel);
  if (!base) return { posts: [], pinned: [], nextCursor: null };
  const limit = Math.min(Math.max(q.limit ?? 20, 1), 50);
  const filter = q.filter ?? 'all';
  const extra: Prisma.WorkFeedPostWhereInput[] = [];
  if (filter === 'mine') extra.push({ authorId: userId });
  if (filter === 'media') extra.push({ attachments: { some: { kind: { in: ['IMAGE', 'VIDEO'] }, status: 'READY' } } });
  if (filter === 'files') extra.push({ attachments: { some: { kind: 'FILE', status: 'READY' } } });
  if (filter === 'saved') extra.push({ saves: { some: { userId } } });
  if (q.author) extra.push({ authorId: q.author });
  const text = q.q?.trim().slice(0, 200);
  if (text) {
    const tag = /^#([\p{L}\p{N}_]{2,40})$/u.exec(text);
    extra.push(tag ? { hashtags: { has: tag[1].toLowerCase() } } : { body: { contains: text, mode: 'insensitive' } });
  }
  // Ghim: chỉ khi xem MỘT phạm vi, filter=all, không tìm/lọc người.
  const pinScope: Prisma.WorkFeedPostWhereInput | null = filter === 'all' && !text && !q.author
    ? q.projectId ? { projectId: q.projectId } : q.workspaceId && sel.wsIds.length ? { projectId: null, workspaceId: q.workspaceId } : null
    : null;
  const cursor = decodeCursor(q.cursor);
  const where: Prisma.WorkFeedPostWhereInput = {
    ...base,
    AND: [
      ...(base.AND as Prisma.WorkFeedPostWhereInput[]),
      ...extra,
      ...(pinScope ? [{ NOT: { AND: [pinScope, { pinnedAt: { not: null } }] } }] : []),
      ...(cursor ? [{ OR: [{ createdAt: { lt: cursor.createdAt } }, { createdAt: cursor.createdAt, id: { lt: cursor.id } }] }] : []),
    ],
  };
  const [rows, pinnedRows] = await Promise.all([
    prisma.workFeedPost.findMany({ where, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: limit + 1, select: POST_SELECT }),
    pinScope && !cursor
      ? prisma.workFeedPost.findMany({ where: { ...base, AND: [...(base.AND as Prisma.WorkFeedPostWhereInput[]), pinScope, { pinnedAt: { not: null } }] }, orderBy: { pinnedAt: 'desc' }, take: MAX_PINNED_PER_SCOPE, select: POST_SELECT })
      : Promise.resolve([] as PostRow[]),
  ]);
  const page = rows.slice(0, limit);
  const accessOf = accessFromScopes(s);
  const [posts, pinned] = await Promise.all([presentPosts(userId, page, accessOf), presentPosts(userId, pinnedRows, accessOf)]);
  const last = page[page.length - 1];
  return { posts, pinned, nextCursor: rows.length > limit && last ? encodeCursor(last.createdAt, last.id) : null };
}

export async function newCount(userId: number, q: { since: Date; workspaceId?: number | null; projectId?: number | null }) {
  await assertFeedPerson(userId);
  const s = await feedScopesFor(userId);
  const sel = selectScopes(s, q);
  const base = await baseWhere(userId, sel);
  if (!base) return { count: 0 };
  const count = await prisma.workFeedPost.count({
    where: { ...base, AND: [...(base.AND as Prisma.WorkFeedPostWhereInput[]), { createdAt: { gt: q.since } }, { authorId: { not: userId } }] },
  });
  return { count: Math.min(count, 99) };
}

// ─── Đăng / sửa ──────────────────────────────────────────────────

async function ownHosts(): Promise<string[]> {
  try { return [new URL(process.env.FRONTEND_URL ?? '').host].filter(Boolean); } catch { return []; }
}

interface Parsed { body: string; mentionIds: number[]; hashtags: string[]; refs: ChatRef[]; webLink: string | null }

/** Nội dung ⇒ @nhắc (chỉ người ĐỌC ĐƯỢC phạm vi), #tag, ref (ws điền sẵn cho `KEY-12` trần). */
async function parseBody(raw: string, scope: { workspaceId: number; wsSlug: string; projectId: number | null; projectKey: string | null }, max: number, readers?: PublicUser[]): Promise<Parsed & { readers: PublicUser[] }> {
  const body = cleanBody(raw);
  if (body.length > max) throw new BadRequestError(`Keep it under ${max.toLocaleString('en-US')} characters`, 'WORK_TOO_LONG');
  // App Store 1.2: bài + bình luận (tạo và sửa đều qua đây) — từ nặng ⇒ 422 CONTENT_BLOCKED.
  chanNoiDungXau({ body });
  const names = new Set(mentionsIn(body));
  const rs = readers ?? (names.size ? await scopeReaders(scope.workspaceId, scope.projectId) : []);
  const mentionIds = names.size ? rs.filter((u) => names.has(u.username.toLowerCase())).map((u) => u.id) : [];
  const refs = refsIn(body, { projectKey: scope.projectKey, ownHosts: await ownHosts() }).map((r) => (r.t !== 'web' && !r.ws ? { ...r, ws: scope.wsSlug } : r));
  return { body, mentionIds, hashtags: hashtagsIn(body), refs, webLink: firstWebLink(refs), readers: rs };
}

export interface CreatePostInput {
  workspaceId: number;
  projectId?: number | null;
  body?: string;
  attachmentIds?: number[];
  poll?: { options: unknown[]; multi?: boolean; closesAt?: string | null } | null;
  commentsOff?: boolean;
  clientKey?: string | null;
}

export async function createPost(userId: number, input: CreatePostInput) {
  await assertFeedPerson(userId);
  const projectId = input.projectId ?? null;
  const ws = await prisma.workSpace.findFirst({ where: { id: input.workspaceId, deletedAt: null }, select: { id: true, slug: true, name: true } });
  if (!ws) throw new NotFoundError('Workspace not found');
  const project = projectId ? await prisma.workProject.findFirst({ where: { id: projectId, workspaceId: ws.id, deletedAt: null }, select: { id: true, key: true, name: true } }) : null;
  if (projectId && !project) throw new NotFoundError('Project not found');
  const { access } = await accessFor(userId, ws.id, projectId);
  if (!access.read) throw new NotFoundError(projectId ? 'Project not found' : 'Workspace not found');
  if (!access.post) throw forbid('You cannot post here');

  const clientKey = input.clientKey?.trim().slice(0, 40) || null;
  if (clientKey) {
    const dup = await prisma.workFeedPost.findFirst({ where: { authorId: userId, clientKey, createdAt: { gte: new Date(Date.now() - 10 * 60_000) }, deletedAt: null }, select: { id: true } });
    if (dup) return presentOne(userId, dup.id);
  }
  const recent = await prisma.workFeedPost.count({ where: { authorId: userId, createdAt: { gte: new Date(Date.now() - 60_000) } } });
  if (recent >= POSTS_PER_MINUTE) throw new BadRequestError('You are posting too fast — wait a moment', 'WORK_RATE');

  const parsed = await parseBody(input.body ?? '', { workspaceId: ws.id, wsSlug: ws.slug, projectId, projectKey: project?.key ?? null }, POST_BODY_MAX);
  const drafts = await claimableDrafts(userId, ws.id, (input.attachmentIds ?? []).map(Number));
  const mix = attachmentMixError(drafts.map((d) => d.kind as AttachmentKind));
  if (mix) throw new BadRequestError(mix, 'WORK_FEED_TOO_MANY_FILES');
  const poll = normalizePoll(input.poll ?? null);
  if (typeof poll === 'string') throw new BadRequestError(poll, 'WORK_FEED_POLL');
  if (poll) chanNoiDungXau(Object.fromEntries(poll.options.map((o) => [`poll.${o.id}`, o.text])));
  if (!parsed.body && !drafts.length && !poll) throw new BadRequestError('Write something, add a photo or a file, or create a poll', 'WORK_EMPTY');

  const post = await prisma.$transaction(async (tx) => {
    const p = await tx.workFeedPost.create({
      data: {
        workspaceId: ws.id, projectId, authorId: userId, body: parsed.body, mentions: parsed.mentionIds, hashtags: parsed.hashtags,
        refs: parsed.refs.length ? (parsed.refs as unknown as Prisma.InputJsonValue) : Prisma.DbNull,
        poll: poll ? (poll as unknown as Prisma.InputJsonValue) : Prisma.DbNull,
        commentsOff: !!input.commentsOff, clientKey,
      },
      select: { id: true },
    });
    for (const [i, d] of drafts.entries()) {
      const r = await tx.workFeedAttachment.updateMany({ where: { id: d.id, postId: null, uploaderId: userId }, data: { postId: p.id, position: i } });
      if (r.count !== 1) throw new BadRequestError('An attachment was already used', 'WORK_FEED_BAD_ATTACHMENT');
    }
    return p;
  });

  const scope = { workspaceId: ws.id, projectId };
  emitFeed(scope, 'post.created', { postId: post.id, actorId: userId });
  feedBackground((async () => {
    if (parsed.webLink) await refreshPreview(post.id, ws.id, parsed.webLink);
    await notifyPost({ postId: post.id, ws, project, authorId: userId, body: parsed.body, mentionIds: parsed.mentionIds, newPost: true });
  })());
  return presentOne(userId, post.id);
}

async function refreshPreview(postId: number, workspaceId: number, url: string | null): Promise<void> {
  const cur = await prisma.workFeedPost.findUnique({ where: { id: postId }, select: { linkPreview: true, workspaceId: true, projectId: true } });
  if (!cur) return;
  const old = cur.linkPreview as StoredPreview | null;
  if (old?.url === url && url) return;
  const next = url ? await buildStoredPreview(workspaceId, url) : null;
  await prisma.workFeedPost.update({ where: { id: postId }, data: { linkPreview: next ? (next as unknown as Prisma.InputJsonValue) : Prisma.DbNull } });
  if (old?.imageKey) dropObjects([old.imageKey]);
  if (next || old) emitFeed({ workspaceId: cur.workspaceId, projectId: cur.projectId }, 'post.updated', { postId });
}

export interface UpdatePostInput {
  body?: string;
  attachmentIds?: number[];
  removeAttachmentIds?: number[];
  alts?: Array<{ id: number; alt: string | null }>;
  commentsOff?: boolean;
}

export async function updatePost(userId: number, postId: number, input: UpdatePostInput) {
  const ctx = await visiblePost(userId, postId);
  const p = ctx.post;
  if (!canEditOwn(userId, p.authorId)) throw forbid('Only the author can edit this post');
  const data: Prisma.WorkFeedPostUpdateInput = {};
  let contentChanged = false;
  let newMentions: number[] = [];
  let webLink: string | null | undefined;
  if (input.body !== undefined) {
    const parsed = await parseBody(input.body, { workspaceId: p.workspaceId, wsSlug: p.workspace.slug, projectId: p.projectId, projectKey: p.project?.key ?? null }, POST_BODY_MAX);
    if (parsed.body !== p.body) {
      data.body = parsed.body; data.mentions = parsed.mentionIds; data.hashtags = parsed.hashtags;
      data.refs = parsed.refs.length ? (parsed.refs as unknown as Prisma.InputJsonValue) : Prisma.DbNull;
      newMentions = parsed.mentionIds.filter((id) => !p.mentions.includes(id));
      webLink = parsed.webLink;
      contentChanged = true;
    }
  }
  const removeIds = (input.removeAttachmentIds ?? []).map(Number);
  const remove = removeIds.length ? await prisma.workFeedAttachment.findMany({ where: { id: { in: removeIds }, postId }, select: { id: true, r2Key: true, thumbKey: true } }) : [];
  const add = await claimableDrafts(userId, p.workspaceId, (input.attachmentIds ?? []).map(Number));
  const keep = p.attachments.filter((a) => !remove.some((r) => r.id === a.id));
  const mix = attachmentMixError([...keep, ...add].map((a) => a.kind as AttachmentKind));
  if (mix) throw new BadRequestError(mix, 'WORK_FEED_TOO_MANY_FILES');
  if (remove.length || add.length) contentChanged = true;
  const finalBody = (data.body as string | undefined) ?? p.body;
  if (!finalBody && !keep.length && !add.length && !p.poll) throw new BadRequestError('A post cannot be empty — delete it instead', 'WORK_EMPTY');
  chanNoiDungXau(Object.fromEntries((input.alts ?? []).map((a) => [`alt.${a.id}`, a.alt])));
  if (input.commentsOff !== undefined) data.commentsOff = input.commentsOff;
  if (contentChanged) data.editedAt = new Date();
  // Thẻ link: hết link ⇒ bỏ thẻ NGAY (trả về đúng); link mới ⇒ dựng lại ở nền; cùng link ⇒ giữ.
  const oldPreview = p.linkPreview as StoredPreview | null;
  let refetch: string | null = null;
  if (webLink !== undefined) {
    if (!webLink && oldPreview) data.linkPreview = Prisma.DbNull;
    else if (webLink && oldPreview?.url !== webLink) refetch = webLink;
  }

  await prisma.$transaction(async (tx) => {
    if (Object.keys(data).length) await tx.workFeedPost.update({ where: { id: postId }, data });
    if (remove.length) await tx.workFeedAttachment.deleteMany({ where: { id: { in: remove.map((r) => r.id) } } });
    const base = keep.length ? Math.max(...keep.map((a) => a.position)) + 1 : 0;
    for (const [i, d] of add.entries()) await tx.workFeedAttachment.updateMany({ where: { id: d.id, postId: null, uploaderId: userId }, data: { postId, position: base + i } });
    for (const a of input.alts ?? []) await tx.workFeedAttachment.updateMany({ where: { id: a.id, postId }, data: { alt: a.alt?.trim().slice(0, 300) || null } });
  });
  for (const r of remove) dropObjects([r.r2Key, r.thumbKey]);
  if (data.linkPreview === Prisma.DbNull && oldPreview?.imageKey) dropObjects([oldPreview.imageKey]);
  emitFeed(p, 'post.updated', { postId, actorId: userId });
  feedBackground((async () => {
    if (refetch) await refreshPreview(postId, p.workspaceId, refetch);
    if (newMentions.length) {
      await notifyPost({ postId, ws: p.workspace, project: p.project, authorId: userId, body: finalBody, mentionIds: newMentions, newPost: false });
    }
  })());
  return presentOne(userId, postId);
}

export async function deletePost(userId: number, postId: number) {
  const { post: p, access } = await visiblePost(userId, postId);
  if (!canDelete(userId, p.authorId, access)) throw forbid('You can only delete your own posts');
  const atts = await prisma.workFeedAttachment.findMany({ where: { postId }, select: { id: true, r2Key: true, thumbKey: true } });
  await prisma.$transaction([
    prisma.workFeedPost.update({ where: { id: postId }, data: { deletedAt: new Date(), pinnedAt: null } }),
    prisma.workFeedAttachment.deleteMany({ where: { postId } }),
    prisma.workFeedReport.updateMany({ where: { postId, status: 'OPEN' }, data: { status: 'RESOLVED', action: 'remove', resolvedById: userId, resolvedAt: new Date() } }),
  ]);
  dropObjects([...atts.flatMap((a) => [a.r2Key, a.thumbKey]), (p.linkPreview as StoredPreview | null)?.imageKey]);
  emitFeed(p, 'post.deleted', { postId, actorId: userId });
  return { deleted: true };
}

export async function pinPost(userId: number, postId: number, pinned: boolean) {
  const { post: p, access } = await visiblePost(userId, postId);
  if (!access.moderate) throw forbid('Only admins can pin posts');
  if (pinned && !p.pinnedAt) {
    const n = await prisma.workFeedPost.count({ where: { deletedAt: null, pinnedAt: { not: null }, ...(p.projectId ? { projectId: p.projectId } : { projectId: null, workspaceId: p.workspaceId }) } });
    if (n >= MAX_PINNED_PER_SCOPE) throw new BadRequestError(`At most ${MAX_PINNED_PER_SCOPE} posts can be pinned here — unpin one first`, 'WORK_FEED_PIN_LIMIT');
  }
  if (pinned !== !!p.pinnedAt) {
    await prisma.workFeedPost.update({ where: { id: postId }, data: pinned ? { pinnedAt: new Date(), pinnedById: userId } : { pinnedAt: null, pinnedById: null } });
    emitFeed(p, 'post.updated', { postId, actorId: userId });
  }
  return presentOne(userId, postId);
}

export async function moderatePost(userId: number, postId: number, hidden: boolean) {
  const { post: p, access } = await visiblePost(userId, postId);
  if (!access.moderate) throw forbid('Only admins can remove posts');
  await prisma.workFeedPost.update({ where: { id: postId }, data: hidden ? { hiddenAt: new Date(), hiddenById: userId, pinnedAt: null } : { hiddenAt: null, hiddenById: null } });
  if (hidden) await prisma.workFeedReport.updateMany({ where: { targetKey: `p:${postId}`, status: 'OPEN' }, data: { status: 'RESOLVED', action: 'remove', resolvedById: userId, resolvedAt: new Date() } });
  emitFeed(p, 'post.updated', { postId, actorId: userId });
  return presentOne(userId, postId);
}

// ─── Cảm xúc, lưu, ẩn, bình chọn ─────────────────────────────────

async function postReactionState(userId: number, postId: number) {
  const [p, react] = await Promise.all([
    prisma.workFeedPost.findUnique({ where: { id: postId }, select: { reactionCount: true } }),
    reactionMaps('postId', [postId], userId),
  ]);
  return { reactionCount: p?.reactionCount ?? 0, reactions: react.summary.get(postId) ?? [], myReaction: react.mine.get(postId) ?? null };
}

export async function reactPost(userId: number, postId: number, kind: ReactionKind | null) {
  const { post: p, access } = await visiblePost(userId, postId);
  if (!access.read) throw new NotFoundError('Post not found');
  let added = false;
  if (kind === null) {
    await prisma.$transaction(async (tx) => {
      const r = await tx.workFeedReaction.deleteMany({ where: { postId, userId } });
      if (r.count) await tx.workFeedPost.update({ where: { id: postId }, data: { reactionCount: { decrement: r.count } } });
    });
  } else {
    try {
      await prisma.$transaction(async (tx) => {
        const cur = await tx.workFeedReaction.findUnique({ where: { postId_userId: { postId, userId } }, select: { id: true, kind: true } });
        if (cur) {
          if (cur.kind !== kind) await tx.workFeedReaction.update({ where: { id: cur.id }, data: { kind } });
          return;
        }
        await tx.workFeedReaction.create({ data: { postId, userId, kind } });
        await tx.workFeedPost.update({ where: { id: postId }, data: { reactionCount: { increment: 1 } } });
        added = true;
      });
    } catch (err) {
      // Hai lượt bấm song song ⇒ UNIQUE (bài, người) giữ đúng một dòng — lượt sau thành đổi loại.
      if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')) throw err;
      await prisma.workFeedReaction.updateMany({ where: { postId, userId }, data: { kind } });
    }
  }
  const state = await postReactionState(userId, postId);
  emitFeed(p, 'reaction', { postId, commentId: null, actorId: userId, reactionCount: state.reactionCount });
  if (added && p.authorId !== userId) feedBackground(notifyReaction(p, userId, kind!));
  return state;
}

export async function listReactions(userId: number, postId: number, q: { kind?: ReactionKind | null; cursor?: string | null; limit?: number } = {}) {
  await visiblePost(userId, postId);
  const limit = Math.min(Math.max(q.limit ?? 50, 1), 100);
  const c = decodeCursor(q.cursor);
  const rows = await prisma.workFeedReaction.findMany({
    where: { postId, ...(q.kind ? { kind: q.kind } : {}), ...(c ? { OR: [{ createdAt: { lt: c.createdAt } }, { createdAt: c.createdAt, id: { lt: c.id } }] } : {}) },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: limit + 1,
    select: { id: true, kind: true, createdAt: true, user: { select: PUBLIC_USER } },
  });
  const page = rows.slice(0, limit);
  const last = page[page.length - 1];
  const state = await postReactionState(userId, postId);
  return { items: page.map((r) => ({ user: r.user, kind: r.kind, createdAt: r.createdAt })), reactions: state.reactions, nextCursor: rows.length > limit && last ? encodeCursor(last.createdAt, last.id) : null };
}

export async function savePost(userId: number, postId: number, saved: boolean) {
  await visiblePost(userId, postId);
  if (saved) await prisma.workFeedSave.upsert({ where: { postId_userId: { postId, userId } }, create: { postId, userId }, update: {} });
  else await prisma.workFeedSave.deleteMany({ where: { postId, userId } });
  return { saved };
}

export async function hidePost(userId: number, postId: number, hidden: boolean) {
  await visiblePost(userId, postId);
  if (hidden) await prisma.workFeedHide.upsert({ where: { postId_userId: { postId, userId } }, create: { postId, userId }, update: {} });
  else await prisma.workFeedHide.deleteMany({ where: { postId, userId } });
  return { hidden };
}

export async function votePoll(userId: number, postId: number, optionIds: string[]) {
  const { post: p } = await visiblePost(userId, postId);
  const def = pollOf(p.poll);
  if (!def) throw new BadRequestError('This post has no poll', 'WORK_FEED_POLL');
  if (pollClosed(def)) throw new BadRequestError('This poll is closed', 'WORK_FEED_POLL_CLOSED');
  const ids = validVote(def, optionIds);
  if (typeof ids === 'string') throw new BadRequestError(ids, 'WORK_FEED_POLL');
  await prisma.$transaction([
    prisma.workFeedPollVote.deleteMany({ where: { postId, userId } }),
    ...(ids.length ? [prisma.workFeedPollVote.createMany({ data: ids.map((optionId) => ({ postId, userId, optionId })), skipDuplicates: true })] : []),
  ]);
  const out = await presentOne(userId, postId);
  emitFeed(p, 'poll', { postId, actorId: userId, totalVotes: out.poll?.totalVotes ?? 0 });
  return out.poll;
}

// ─── Bình luận ───────────────────────────────────────────────────

async function visibleComment(userId: number, commentId: number) {
  await assertFeedPerson(userId);
  const c = await prisma.workFeedComment.findFirst({ where: { id: commentId, deletedAt: null }, select: { ...COMMENT_SELECT, post: { select: { id: true } } } });
  if (!c) throw new NotFoundError('Comment not found');
  const ctx = await visiblePost(userId, c.postId).catch(() => { throw new NotFoundError('Comment not found'); });
  if (!visibleModerated(!!c.hiddenAt, userId, c.authorId, ctx.access)) throw new NotFoundError('Comment not found');
  return { c, ctx };
}

async function presentCommentOne(userId: number, commentId: number) {
  const { c, ctx } = await visibleComment(userId, commentId);
  return (await presentComments(userId, [c], () => ({ access: ctx.access, commentsOff: ctx.post.commentsOff })))[0];
}

export async function listComments(userId: number, postId: number, q: { parentId?: number | null; cursor?: string | null; limit?: number } = {}) {
  const { post: p, access } = await visiblePost(userId, postId);
  const limit = Math.min(Math.max(q.limit ?? 20, 1), 50);
  const c = decodeCursor(q.cursor);
  const where: Prisma.WorkFeedCommentWhereInput = {
    postId, parentId: q.parentId ?? null, ...commentVisibleWhere(userId, access),
    ...(c ? { AND: [{ OR: [{ createdAt: { gt: c.createdAt } }, { createdAt: c.createdAt, id: { gt: c.id } }] }] } : {}),
  };
  const rows = await prisma.workFeedComment.findMany({ where, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }], take: limit + 1, select: COMMENT_SELECT });
  const page = rows.slice(0, limit);
  let replies: CommentRow[] = [];
  if (!q.parentId && page.length) {
    const parentIds = page.map((x) => x.id);
    const ids = await prisma.$queryRaw<Array<{ id: number }>>`
      SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY parent_id ORDER BY created_at ASC, id ASC) AS rn
        FROM work_feed_comments
        WHERE parent_id IN (${Prisma.join(parentIds)}) AND deleted_at IS NULL
          ${access.moderate ? Prisma.empty : Prisma.sql`AND (hidden_at IS NULL OR author_id = ${userId})`}
      ) t WHERE rn <= 2`;
    replies = ids.length ? await prisma.workFeedComment.findMany({ where: { id: { in: ids.map((r) => r.id) } }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }], select: COMMENT_SELECT }) : [];
  }
  const ctxOf = () => ({ access, commentsOff: p.commentsOff });
  const [top, rep] = await Promise.all([presentComments(userId, page, ctxOf), presentComments(userId, replies, ctxOf)]);
  for (const t of top) t.replies = rep.filter((r) => r.parentId === t.id);
  const last = page[page.length - 1];
  return { comments: top, nextCursor: rows.length > limit && last ? encodeCursor(last.createdAt, last.id) : null };
}

export async function addComment(userId: number, postId: number, input: { body: string; parentId?: number | null; clientKey?: string | null }) {
  const { post: p, access } = await visiblePost(userId, postId);
  if (!canCommentOn(access, p.commentsOff)) throw forbid('Comments are turned off for this post');
  const clientKey = input.clientKey?.trim().slice(0, 40) || null;
  if (clientKey) {
    const dup = await prisma.workFeedComment.findFirst({ where: { postId, authorId: userId, clientKey, deletedAt: null, createdAt: { gte: new Date(Date.now() - 10 * 60_000) } }, select: { id: true } });
    if (dup) return presentCommentOne(userId, dup.id);
  }
  const recent = await prisma.workFeedComment.count({ where: { authorId: userId, createdAt: { gte: new Date(Date.now() - 60_000) } } });
  if (recent >= COMMENTS_PER_MINUTE) throw new BadRequestError('You are commenting too fast — wait a moment', 'WORK_RATE');
  let parent: { id: number; authorId: number } | null = null;
  if (input.parentId) {
    const pc = await prisma.workFeedComment.findFirst({ where: { id: input.parentId, postId, deletedAt: null }, select: { id: true, parentId: true, authorId: true, hiddenAt: true } });
    if (!pc || !visibleModerated(!!pc.hiddenAt, userId, pc.authorId, access)) throw new NotFoundError('Comment not found');
    // Một cấp trả lời: trả lời một trả lời ⇒ gắn vào bình luận gốc.
    if (pc.parentId) {
      const root = await prisma.workFeedComment.findFirst({ where: { id: pc.parentId, deletedAt: null }, select: { id: true, authorId: true } });
      if (!root) throw new NotFoundError('Comment not found');
      parent = { id: root.id, authorId: pc.authorId };
    } else parent = { id: pc.id, authorId: pc.authorId };
  }
  const parsed = await parseBody(input.body, { workspaceId: p.workspaceId, wsSlug: p.workspace.slug, projectId: p.projectId, projectKey: p.project?.key ?? null }, COMMENT_BODY_MAX);
  if (!parsed.body) throw new BadRequestError('Write a comment', 'WORK_EMPTY');
  const created = await prisma.$transaction(async (tx) => {
    const c = await tx.workFeedComment.create({ data: { postId, parentId: parent?.id ?? null, authorId: userId, body: parsed.body, mentions: parsed.mentionIds, clientKey }, select: { id: true } });
    const post = await tx.workFeedPost.update({ where: { id: postId }, data: { commentCount: { increment: 1 } }, select: { commentCount: true } });
    if (parent) await tx.workFeedComment.update({ where: { id: parent.id }, data: { replyCount: { increment: 1 } } });
    return { id: c.id, commentCount: post.commentCount };
  });
  emitFeed(p, 'comment.created', { postId, commentId: created.id, parentId: parent?.id ?? null, actorId: userId, commentCount: created.commentCount });
  feedBackground(notifyComment({ post: p, commentId: created.id, authorId: userId, body: parsed.body, mentionIds: parsed.mentionIds, replyTo: parent?.authorId ?? null }));
  return presentCommentOne(userId, created.id);
}

export async function editComment(userId: number, commentId: number, body: string) {
  const { c, ctx } = await visibleComment(userId, commentId);
  if (c.authorId !== userId) throw forbid('Only the author can edit this comment');
  const p = ctx.post;
  const parsed = await parseBody(body, { workspaceId: p.workspaceId, wsSlug: p.workspace.slug, projectId: p.projectId, projectKey: p.project?.key ?? null }, COMMENT_BODY_MAX);
  if (!parsed.body) throw new BadRequestError('Write a comment', 'WORK_EMPTY');
  if (parsed.body !== c.body) {
    await prisma.workFeedComment.update({ where: { id: commentId }, data: { body: parsed.body, mentions: parsed.mentionIds, editedAt: new Date() } });
    emitFeed(p, 'comment.updated', { postId: p.id, commentId, parentId: c.parentId, actorId: userId, commentCount: p.commentCount });
    const fresh = parsed.mentionIds.filter((id) => !c.mentions.includes(id));
    if (fresh.length) feedBackground(notifyComment({ post: p, commentId, authorId: userId, body: parsed.body, mentionIds: fresh, replyTo: null, mentionsOnly: true }));
  }
  return presentCommentOne(userId, commentId);
}

export async function deleteComment(userId: number, commentId: number) {
  const { c, ctx } = await visibleComment(userId, commentId);
  if (!canDelete(userId, c.authorId, ctx.access)) throw forbid('You can only delete your own comments');
  const now = new Date();
  const out = await prisma.$transaction(async (tx) => {
    let n = 1;
    await tx.workFeedComment.update({ where: { id: commentId }, data: { deletedAt: now } });
    if (!c.parentId) {
      const r = await tx.workFeedComment.updateMany({ where: { parentId: commentId, deletedAt: null }, data: { deletedAt: now } });
      n += r.count;
    } else {
      await tx.workFeedComment.updateMany({ where: { id: c.parentId, replyCount: { gt: 0 } }, data: { replyCount: { decrement: 1 } } });
    }
    const post = await tx.workFeedPost.update({ where: { id: c.postId }, data: { commentCount: { decrement: n } }, select: { commentCount: true } });
    if (post.commentCount < 0) await tx.workFeedPost.update({ where: { id: c.postId }, data: { commentCount: 0 } });
    await tx.workFeedReport.updateMany({ where: { commentId, status: 'OPEN' }, data: { status: 'RESOLVED', action: 'remove', resolvedById: userId, resolvedAt: now } });
    return Math.max(0, post.commentCount);
  });
  emitFeed(ctx.post, 'comment.deleted', { postId: c.postId, commentId, parentId: c.parentId, actorId: userId, commentCount: out });
  return { deleted: true };
}

export async function reactComment(userId: number, commentId: number, kind: ReactionKind | null) {
  const { c, ctx } = await visibleComment(userId, commentId);
  if (kind === null) {
    await prisma.$transaction(async (tx) => {
      const r = await tx.workFeedCommentReaction.deleteMany({ where: { commentId, userId } });
      if (r.count) await tx.workFeedComment.update({ where: { id: commentId }, data: { reactionCount: { decrement: r.count } } });
    });
  } else {
    try {
      await prisma.$transaction(async (tx) => {
        const cur = await tx.workFeedCommentReaction.findUnique({ where: { commentId_userId: { commentId, userId } }, select: { id: true, kind: true } });
        if (cur) { if (cur.kind !== kind) await tx.workFeedCommentReaction.update({ where: { id: cur.id }, data: { kind } }); return; }
        await tx.workFeedCommentReaction.create({ data: { commentId, userId, kind } });
        await tx.workFeedComment.update({ where: { id: commentId }, data: { reactionCount: { increment: 1 } } });
      });
    } catch (err) {
      if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')) throw err;
      await prisma.workFeedCommentReaction.updateMany({ where: { commentId, userId }, data: { kind } });
    }
  }
  const [row, react] = await Promise.all([
    prisma.workFeedComment.findUnique({ where: { id: commentId }, select: { reactionCount: true } }),
    reactionMaps('commentId', [commentId], userId),
  ]);
  emitFeed(ctx.post, 'reaction', { postId: c.postId, commentId, actorId: userId, reactionCount: row?.reactionCount ?? 0 });
  return { reactionCount: row?.reactionCount ?? 0, reactions: react.summary.get(commentId) ?? [], myReaction: react.mine.get(commentId) ?? null };
}

export async function moderateComment(userId: number, commentId: number, hidden: boolean) {
  const { ctx, c } = await visibleComment(userId, commentId);
  if (!ctx.access.moderate) throw forbid('Only admins can remove comments');
  await prisma.workFeedComment.update({ where: { id: commentId }, data: hidden ? { hiddenAt: new Date(), hiddenById: userId } : { hiddenAt: null, hiddenById: null } });
  if (hidden) await prisma.workFeedReport.updateMany({ where: { targetKey: `c:${commentId}`, status: 'OPEN' }, data: { status: 'RESOLVED', action: 'remove', resolvedById: userId, resolvedAt: new Date() } });
  emitFeed(ctx.post, 'comment.updated', { postId: c.postId, commentId, parentId: c.parentId, actorId: userId, commentCount: ctx.post.commentCount });
  return presentCommentOne(userId, commentId);
}

// ─── Báo cáo + kiểm duyệt ────────────────────────────────────────

export const FEED_REPORT_REASONS = ['spam', 'harassment', 'hate', 'sexual', 'violence', 'other'] as const;
export type FeedReportReason = (typeof FEED_REPORT_REASONS)[number];

async function fileReport(userId: number, t: { kind: 'feed_post' | 'feed_comment'; postId: number; commentId: number | null; authorId: number; excerpt: string; post: PostRow }, input: { reason: FeedReportReason; detail?: string | null }) {
  if (t.authorId === userId) throw new BadRequestError('You cannot report your own content', 'WORK_REPORT_SELF');
  const detail = input.detail?.trim().slice(0, 1000) || null;
  const targetKey = t.commentId ? `c:${t.commentId}` : `p:${t.postId}`;
  try {
    await prisma.workFeedReport.create({
      data: {
        workspaceId: t.post.workspaceId, projectId: t.post.projectId, postId: t.postId, commentId: t.commentId, targetKey, reporterId: userId,
        reason: input.reason, detail,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') return { reported: true, duplicate: true };
    throw err;
  }
  const url = postUrl(t.post.workspace.slug, t.postId, t.commentId);
  const label = `${t.post.project ? t.post.project.key : t.post.workspace.name} · feed`;
  // Hàng chờ kiểm duyệt của quản trị site (App Store 1.2) — khoá chống trùng như POST /work/report.
  try {
    const { baoAdmin } = await import('../thongBaoAdmin.service.js');
    await baoAdmin({
      loai: 'BAO_CAO', mucDo: 'can_xu_ly',
      tieuDe: `Báo cáo nội dung CT Work: ${t.kind} · ${label}`.slice(0, 200),
      noiDung: [`Lý do: ${input.reason}`, detail && `Chi tiết: ${detail}`, `Tác giả: user #${t.authorId}`, `Nội dung: ${t.excerpt.slice(0, 600)}`].filter(Boolean).join('\n'),
      duongDan: url, userId, entityId: t.commentId ?? t.postId, khoaChongTrung: `ctw-report:${t.kind}:${t.commentId ?? t.postId}:${userId}`,
    });
  } catch (err) {
    logger.warn('[work] feed: báo admin site lỗi', { err: (err as Error).message });
  }
  feedBackground((async () => {
    const readers = await scopeReaders(t.post.workspaceId, t.post.projectId);
    const mods: number[] = [];
    for (const r of readers) {
      if (r.id === userId || r.id === t.authorId) continue;
      const { access } = await accessFor(r.id, t.post.workspaceId, t.post.projectId).catch(() => ({ access: NO_ACCESS }));
      if (access.moderate) mods.push(r.id);
      if (mods.length >= 20) break;
    }
    for (const uid of mods) {
      await notifyWork({
        receiverId: uid, senderId: userId, type: 'WORK_ALERT', entityId: t.postId, secondaryEntityId: t.commentId,
        payload: {
          issueKey: t.post.project?.key ?? t.post.workspace.name, title: 'Feed', message: `A ${t.commentId ? 'comment' : 'post'} was reported (${input.reason}). Review it in Feed → Reports.`,
          url: `/work/${t.post.workspace.slug}/feed?tab=reports`, report: { kind: t.kind, id: t.commentId ?? t.postId }, noEmail: true,
        },
      }).catch(() => undefined);
    }
  })());
  return { reported: true, duplicate: false };
}

export async function reportPost(userId: number, postId: number, input: { reason: FeedReportReason; detail?: string | null }) {
  const { post } = await visiblePost(userId, postId);
  return fileReport(userId, { kind: 'feed_post', postId, commentId: null, authorId: post.authorId, excerpt: post.body, post }, input);
}

export async function reportComment(userId: number, commentId: number, input: { reason: FeedReportReason; detail?: string | null }) {
  const { c, ctx } = await visibleComment(userId, commentId);
  return fileReport(userId, { kind: 'feed_comment', postId: c.postId, commentId, authorId: c.authorId, excerpt: c.body, post: ctx.post }, input);
}

export async function listReports(userId: number, q: { workspaceId?: number | null; status?: 'OPEN' | 'RESOLVED' | 'DISMISSED' | 'ALL'; cursor?: string | null; limit?: number } = {}) {
  await assertFeedPerson(userId);
  const s = await feedScopesFor(userId);
  const modWs = [...s.workspaces.values()].filter((w) => w.access.moderate && (!q.workspaceId || w.id === q.workspaceId)).map((w) => w.id);
  const modProj = [...s.projects.values()].filter((p) => p.access.moderate && (!q.workspaceId || p.workspaceId === q.workspaceId)).map((p) => p.id);
  if (!modWs.length && !modProj.length) return { reports: [], nextCursor: null, openCount: 0 };
  const scope: Prisma.WorkFeedReportWhereInput = { OR: [...(modWs.length ? [{ projectId: null, workspaceId: { in: modWs } }] : []), ...(modProj.length ? [{ projectId: { in: modProj } }] : [])] };
  const limit = Math.min(Math.max(q.limit ?? 30, 1), 100);
  const c = decodeCursor(q.cursor);
  const status = q.status ?? 'OPEN';
  const where: Prisma.WorkFeedReportWhereInput = {
    AND: [scope, ...(status === 'ALL' ? [] : [{ status }]), ...(c ? [{ OR: [{ createdAt: { lt: c.createdAt } }, { createdAt: c.createdAt, id: { lt: c.id } }] }] : [])],
  };
  const [rows, openCount] = await Promise.all([
    prisma.workFeedReport.findMany({
      where, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: limit + 1,
      select: {
        id: true, status: true, reason: true, detail: true, createdAt: true, resolvedAt: true, action: true, targetKey: true, postId: true, commentId: true,
        workspaceId: true, projectId: true,
        reporter: { select: PUBLIC_USER },
        workspace: { select: { id: true, slug: true, name: true } },
        post: { select: { id: true, body: true, hiddenAt: true, deletedAt: true, author: { select: PUBLIC_USER }, project: { select: { id: true, key: true, name: true } } } },
        comment: { select: { id: true, body: true, hiddenAt: true, deletedAt: true, author: { select: PUBLIC_USER } } },
      },
    }),
    prisma.workFeedReport.count({ where: { AND: [scope, { status: 'OPEN' }] } }),
  ]);
  const page = rows.slice(0, limit);
  const counts = page.length ? await prisma.workFeedReport.groupBy({ by: ['targetKey'], where: { targetKey: { in: [...new Set(page.map((r) => r.targetKey))] }, AND: [scope] }, _count: { _all: true } }) : [];
  const countOf = new Map(counts.map((x) => [x.targetKey, x._count._all]));
  const last = page[page.length - 1];
  return {
    reports: page.map((r) => {
      const isComment = !!r.commentId;
      const t = isComment ? r.comment : r.post;
      return {
        id: r.id, status: r.status, reason: r.reason, detail: r.detail, createdAt: r.createdAt, reporter: r.reporter, reportCount: countOf.get(r.targetKey) ?? 1,
        target: {
          type: isComment ? 'comment' : 'post', postId: r.postId, commentId: r.commentId,
          excerpt: excerptOf(t?.body ?? '', 280), author: t?.author ?? null, hidden: !!t?.hiddenAt, deleted: !t || !!t.deletedAt,
        },
        workspace: r.workspace, project: r.post?.project ?? null,
        resolvedAt: r.resolvedAt, action: r.action, url: postUrl(r.workspace.slug, r.postId ?? 0, r.commentId),
      };
    }),
    nextCursor: rows.length > limit && last ? encodeCursor(last.createdAt, last.id) : null,
    openCount,
  };
}

export async function resolveReport(userId: number, reportId: number, action: 'remove' | 'dismiss') {
  await assertFeedPerson(userId);
  const r = await prisma.workFeedReport.findUnique({ where: { id: reportId }, select: { id: true, workspaceId: true, projectId: true, postId: true, commentId: true, targetKey: true } });
  if (!r) throw new NotFoundError('Report not found');
  const { access } = await accessFor(userId, r.workspaceId, r.projectId);
  if (!access.moderate) throw new NotFoundError('Report not found');
  const now = new Date();
  if (action === 'remove') {
    if (r.commentId) await prisma.workFeedComment.updateMany({ where: { id: r.commentId }, data: { hiddenAt: now, hiddenById: userId } });
    else if (r.postId) await prisma.workFeedPost.updateMany({ where: { id: r.postId }, data: { hiddenAt: now, hiddenById: userId, pinnedAt: null } });
  }
  await prisma.workFeedReport.updateMany({
    where: { targetKey: r.targetKey, status: 'OPEN' },
    data: { status: action === 'remove' ? 'RESOLVED' : 'DISMISSED', action, resolvedById: userId, resolvedAt: now },
  });
  if (action === 'remove' && r.postId) emitFeed({ workspaceId: r.workspaceId, projectId: r.projectId }, r.commentId ? 'comment.updated' : 'post.updated', { postId: r.postId, commentId: r.commentId, actorId: userId });
  const row = await prisma.workFeedReport.findUnique({ where: { id: reportId }, select: { id: true, status: true, action: true, resolvedAt: true } });
  return row;
}

// ─── Thông báo (chạy nền) ────────────────────────────────────────

const MAX_NOTIFY = 500;

async function levelsFor(userIds: number[], key: string): Promise<Map<number, FollowLevel>> {
  if (!userIds.length) return new Map();
  const rows = await prisma.workFeedFollow.findMany({ where: { scopeKey: key, userId: { in: userIds } }, select: { userId: true, level: true } });
  return new Map(rows.map((r) => [r.userId, r.level as FollowLevel]));
}

async function nameOf(userId: number): Promise<string> {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { username: true, displayName: true, fullName: true } });
  return u ? displayName(u) : 'Someone';
}

interface ScopeRef { ws: { id: number; slug: string; name: string }; project: { id: number; key: string; name: string } | null }

function basePayload(s: ScopeRef, postId: number, commentId: number | null, event: string) {
  return {
    issueKey: s.project?.key ?? s.ws.name, title: s.project?.name ?? s.ws.name,
    url: postUrl(s.ws.slug, postId, commentId),
    feed: { postId, commentId, workspaceId: s.ws.id, projectId: s.project?.id ?? null, event },
  };
}

/** Bài mới (newPost) ⇒ WORK_ALERT cho người theo dõi ALL; @nhắc ⇒ WORK_MENTION (mức ≠ OFF). Người đăng không nhận. */
async function notifyPost(a: { postId: number; ws: { id: number; slug: string; name: string }; project: { id: number; key: string; name: string } | null; authorId: number; body: string; mentionIds: number[]; newPost: boolean }) {
  const readers = await scopeReaders(a.ws.id, a.project?.id ?? null);
  const readerIds = readers.map((r) => r.id).filter((id) => id !== a.authorId);
  const key = scopeKey(a.ws.id, a.project?.id ?? null);
  const [levels, blockers, name] = await Promise.all([levelsFor(readerIds, key), blockersOf(a.authorId, readerIds), nameOf(a.authorId)]);
  const s: ScopeRef = { ws: a.ws, project: a.project };
  const excerpt = excerptOf(a.body) || undefined;
  const mentioned = new Set(a.mentionIds.filter((id) => id !== a.authorId && readerIds.includes(id) && notifyMention(levels.get(id))));
  let sent = 0;
  for (const uid of mentioned) {
    if (sent++ >= MAX_NOTIFY) break;
    await notifyWork({ receiverId: uid, senderId: a.authorId, type: 'WORK_MENTION', entityId: a.postId, payload: { ...basePayload(s, a.postId, null, 'mention'), excerpt } })
      .catch((err) => logger.warn('[work] feed: thông báo @nhắc lỗi', { err: (err as Error).message }));
  }
  if (!a.newPost) return;
  const scopeName = a.project?.name ?? a.ws.name;
  for (const uid of readerIds) {
    if (mentioned.has(uid) || blockers.has(uid) || !notifyNewPost(levels.get(uid))) continue;
    if (sent++ >= MAX_NOTIFY) break;
    await notifyWork({
      receiverId: uid, senderId: a.authorId, type: 'WORK_ALERT', entityId: a.postId,
      payload: { ...basePayload(s, a.postId, null, 'post'), message: `${name} posted in ${scopeName}`, excerpt, noEmail: true },
    }).catch((err) => logger.warn('[work] feed: thông báo bài mới lỗi', { err: (err as Error).message }));
  }
}

/** Bình luận ⇒ @nhắc (WORK_MENTION) · tác giả bài (WORK_COMMENT) · người được trả lời (WORK_COMMENT reply). Mỗi người một thông báo. */
async function notifyComment(a: { post: PostRow; commentId: number; authorId: number; body: string; mentionIds: number[]; replyTo: number | null; mentionsOnly?: boolean }) {
  const p = a.post;
  const s: ScopeRef = { ws: p.workspace, project: p.project ? { id: p.project.id, key: p.project.key, name: p.project.name } : null };
  const readers = await scopeReaders(p.workspaceId, p.projectId);
  const readerIds = new Set(readers.map((r) => r.id));
  const levels = await levelsFor([...readerIds], scopeKey(p.workspaceId, p.projectId));
  const excerpt = excerptOf(a.body) || undefined;
  const done = new Set<number>([a.authorId]);
  for (const uid of a.mentionIds) {
    if (done.has(uid) || !readerIds.has(uid) || !notifyMention(levels.get(uid))) continue;
    done.add(uid);
    await notifyWork({ receiverId: uid, senderId: a.authorId, type: 'WORK_MENTION', entityId: p.id, secondaryEntityId: a.commentId, payload: { ...basePayload(s, p.id, a.commentId, 'mention'), excerpt } }).catch(() => undefined);
  }
  if (a.mentionsOnly) return;
  if (a.replyTo && !done.has(a.replyTo) && readerIds.has(a.replyTo)) {
    done.add(a.replyTo);
    await notifyWork({ receiverId: a.replyTo, senderId: a.authorId, type: 'WORK_COMMENT', entityId: p.id, secondaryEntityId: a.commentId, payload: { ...basePayload(s, p.id, a.commentId, 'reply'), excerpt, reply: true } }).catch(() => undefined);
  }
  if (!done.has(p.authorId) && readerIds.has(p.authorId)) {
    await notifyWork({ receiverId: p.authorId, senderId: a.authorId, type: 'WORK_COMMENT', entityId: p.id, secondaryEntityId: a.commentId, payload: { ...basePayload(s, p.id, a.commentId, 'comment'), excerpt } }).catch(() => undefined);
  }
}

/** Cảm xúc ⇒ báo tác giả bài, GỘP tối đa một lần / bài / 15 phút (chiếm bằng UPDATE … WHERE). */
async function notifyReaction(p: PostRow, actorId: number, kind: ReactionKind) {
  const now = new Date();
  const claimed = await prisma.workFeedPost.updateMany({
    where: { id: p.id, OR: [{ reactNotifiedAt: null }, { reactNotifiedAt: { lt: new Date(now.getTime() - REACTION_NOTIFY_WINDOW_MS) } }] },
    data: { reactNotifiedAt: now },
  });
  if (claimed.count !== 1) return;
  if ((await blockersOf(actorId, [p.authorId])).has(p.authorId)) return;
  const others = await prisma.workFeedReaction.count({ where: { postId: p.id, userId: { notIn: [actorId, p.authorId] } } });
  const s: ScopeRef = { ws: p.workspace, project: p.project ? { id: p.project.id, key: p.project.key, name: p.project.name } : null };
  await notifyWork({
    receiverId: p.authorId, senderId: actorId, type: 'WORK_ALERT', entityId: p.id,
    payload: { ...basePayload(s, p.id, null, 'reaction'), message: reactionMessage(await nameOf(actorId), others, kind), excerpt: excerptOf(p.body, 80) || undefined, noEmail: true },
  });
}
