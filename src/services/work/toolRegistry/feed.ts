/**
 * Registry lệnh — 21/10/2026: BẢNG TIN NHÓM (Team Feed). MỘT lệnh gộp theo `action` (mục lục MCP cho token người có trần
 * — registry.test giữ ≤ 280). Xoá bài/bình luận đi qua `ctwork_delete` (kind feed_post / feed_comment — destructive).
 *
 * personOnly: bảng tin là chỗ của NGƯỜI — agent không thấy lệnh này (và /feed/** + service chặn agent). Chỉ MCP (không Ask
 * AI / agent BUILTIN — như các lệnh ngang quyền người khác). Nội dung trả về bọc `untrusted` (do thành viên viết).
 * Tệp đính kèm: đăng trên web/app (lệnh này chỉ chữ + bình chọn).
 */

import { z } from 'zod';
import { prisma } from '../../../config/database.js';
import { BadRequestError, NotFoundError } from '../../../middleware/errorHandler.js';
import { projectFor, requirePerson, requireWrite, type McpCtx } from '../../../mcp/context.js';
import { untrusted } from '../../../mcp/protocol.js';
import { projectArg } from '../../../mcp/tools/read.js';
import * as feed from '../feed.service.js';
import { FEED_FILTERS, REACTION_KINDS } from '../feedRules.js';
import { defineTool, mcpOnly, type ToolDef } from './types.js';

const bad = (m: string) => new BadRequestError(m, 'VALIDATION_ERROR');
const need = <T>(v: T | undefined | null, what: string): T => { if (v === undefined || v === null) throw bad(`This action needs ${what}`); return v; };
const json = (v: unknown) => JSON.stringify(v, null, 2);

const ACTIONS = ['list', 'get', 'post', 'edit_post', 'comment', 'edit_comment', 'react', 'save', 'unsave', 'vote'] as const;
const WRITES = new Set<string>(['post', 'edit_post', 'comment', 'edit_comment', 'react', 'save', 'unsave', 'vote']);

async function workspaceIdOf(ctx: McpCtx, slug: string): Promise<number> {
  const ws = await prisma.workSpace.findFirst({ where: { slug: slug.trim(), deletedAt: null, members: { some: { userId: ctx.userId } } }, select: { id: true } });
  if (!ws) throw new NotFoundError(`Workspace "${slug}" not found`);
  return ws.id;
}

/** Bài gọn cho model đọc: bỏ URL ký sẵn (sống 10 phút, vô ích với model), giữ tên tệp. */
function slimPost(p: feed.FeedPostOut) {
  return {
    id: p.id, workspace: p.workspace.slug, project: p.project?.key ?? null, author: p.author.username, authorRole: p.authorRole,
    body: p.body, hashtags: p.hashtags, attachments: p.attachments.map((a) => ({ id: a.id, kind: a.kind, fileName: a.fileName, alt: a.alt })),
    link: p.linkPreview ? { url: p.linkPreview.url, title: p.linkPreview.title } : null, refs: p.refs.map((r) => ({ key: r.key, title: r.title, url: r.url })),
    poll: p.poll, reactions: p.reactions, myReaction: p.myReaction, commentCount: p.commentCount, pinned: p.pinned, saved: p.saved,
    createdAt: p.createdAt, editedAt: p.editedAt, url: p.url,
    comments: p.comments.map((c) => ({ id: c.id, author: c.author.username, body: c.hiddenForMe ? '(hidden)' : c.body, replyCount: c.replyCount })),
  };
}

const feedTool = defineTool({
  name: 'feed', title: 'Team feed (read, post, comment, react)', group: 'chat',
  description: 'The CT Work team feed — a private Facebook/LinkedIn-style feed per workspace and per project (clients never see it). action: '
    + 'list (workspace slug and/or project; filter all/mine/media/saved/files, q text or #hashtag, cursor) | get (post id ⇒ the post + its comments) | '
    + 'post (workspace slug, optional project; markdown with @username mentions, #hashtags and links; pollOptions 2–6 to add a poll) | edit_post (post, markdown) | '
    + 'comment (post, markdown; replyTo = comment id to reply) | edit_comment (comment, markdown) | react (post or comment; kind like/love/haha/wow/sad/celebrate or none) | '
    + 'save / unsave (post) | vote (post, optionIds a/b/…). Members get the normal notifications. Delete: ctwork_delete kind feed_post / feed_comment. Photos/files: post them on the web or app.',
  write: true, personOnly: true,
  input: z.object({
    action: z.enum(ACTIONS),
    workspace: z.string().max(60).optional().describe('Workspace slug (from list_projects)'),
    project: projectArg.optional(),
    post: z.number().int().positive().optional(), comment: z.number().int().positive().optional(), replyTo: z.number().int().positive().optional(),
    markdown: z.string().max(10_000).optional(),
    kind: z.enum([...REACTION_KINDS, 'none']).optional(),
    filter: z.enum(FEED_FILTERS).optional(), q: z.string().max(200).optional(), cursor: z.string().max(200).optional(),
    pollOptions: z.array(z.string().max(120)).min(2).max(6).optional(), pollMulti: z.boolean().optional(),
    optionIds: z.array(z.string().max(8)).max(10).optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'use the team feed');
    if (WRITES.has(a.action)) requireWrite(ctx);
    const u = ctx.userId;
    switch (a.action) {
      case 'list': {
        const projectId = a.project ? (await projectFor(ctx, a.project, [])).id : undefined;
        const workspaceId = a.workspace ? await workspaceIdOf(ctx, a.workspace) : undefined;
        const r = await feed.listFeed(u, { workspaceId, projectId, filter: a.filter, q: a.q, cursor: a.cursor, limit: 20 });
        return untrusted('team feed', json({ pinned: r.pinned.map(slimPost), posts: r.posts.map(slimPost), nextCursor: r.nextCursor }));
      }
      case 'get': {
        const postId = need(a.post, 'post');
        const [p, c] = await Promise.all([feed.getPost(u, postId), feed.listComments(u, postId, { limit: 50 })]);
        return untrusted(`feed post ${postId}`, json({ ...slimPost(p), comments: c.comments.map((x) => ({ id: x.id, author: x.author.username, body: x.hiddenForMe ? '(hidden)' : x.body, replies: (x.replies as typeof c.comments).map((y) => ({ id: y.id, author: y.author.username, body: y.hiddenForMe ? '(hidden)' : y.body })), replyCount: x.replyCount })) }));
      }
      case 'post': {
        let workspaceId: number;
        let projectId: number | null = null;
        if (a.project) {
          const p = await projectFor(ctx, a.project, []);
          projectId = p.id; workspaceId = p.workspaceId;
          if (a.workspace && (await workspaceIdOf(ctx, a.workspace)) !== workspaceId) throw bad('That project is not in this workspace');
        } else workspaceId = await workspaceIdOf(ctx, need(a.workspace, 'workspace'));
        const p = await feed.createPost(u, { workspaceId, projectId, body: a.markdown ?? '', poll: a.pollOptions ? { options: a.pollOptions, multi: a.pollMulti } : null });
        return { posted: p.id, url: p.url };
      }
      case 'edit_post': {
        const p = await feed.updatePost(u, need(a.post, 'post'), { body: need(a.markdown, 'markdown') });
        return { updated: p.id };
      }
      case 'comment': {
        const c = await feed.addComment(u, need(a.post, 'post'), { body: need(a.markdown, 'markdown'), parentId: a.replyTo ?? null });
        return { commented: c.id, post: c.postId, parentId: c.parentId };
      }
      case 'edit_comment': {
        const c = await feed.editComment(u, need(a.comment, 'comment'), need(a.markdown, 'markdown'));
        return { updated: c.id };
      }
      case 'react': {
        const kind = need(a.kind, 'kind');
        const k = kind === 'none' ? null : kind;
        if (a.comment) return { comment: a.comment, ...(await feed.reactComment(u, a.comment, k)) };
        return { post: need(a.post, 'post or comment'), ...(await feed.reactPost(u, a.post!, k)) };
      }
      case 'save':
      case 'unsave':
        return { post: need(a.post, 'post'), ...(await feed.savePost(u, a.post!, a.action === 'save')) };
      case 'vote':
        return { poll: await feed.votePoll(u, need(a.post, 'post'), a.optionIds ?? []) };
    }
    throw bad('Unknown action');
  },
});

export const FEED_COMMANDS: ToolDef[] = [feedTool].map(mcpOnly);
