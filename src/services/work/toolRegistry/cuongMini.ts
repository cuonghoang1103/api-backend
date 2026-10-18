/**
 * Registry lệnh — CUONGMINI DẪN ĐƯỜNG (đợt 6, 18/10/2026). CHỈ ĐỌC, CHỈ ĐƯỜNG MCP (`ask: false, builtin: false`):
 * CuongMini (CLI · app desktop · VS Code) dẫn đường thành viên nhóm không quen CT Work.
 *
 *   issue_guide        — MỘT thẻ đủ để LÀM: cùng cách đọc của trợ lý mentor web (`aiMentor.readIssueFull`): mô tả giữ link +
 *                        checklist, tiêu chí, bình luận, cha/con, liên kết (kèm PHỤ THUỘC chưa xong + người làm), web links,
 *                        trang Docs gắn thẻ, chữ tệp đính kèm — kèm đường dẫn trong app;
 *   project_resources  — thư viện link (Resources) của dự án (repo, thiết kế, slide…), lọc theo chữ;
 *   my_updates         — hộp thư của NGƯỜI (agent dùng wait_events): bị giao thẻ, được nhắc, bình luận mới trên thẻ của mình,
 *                        và thẻ CHẶN việc của mình vừa xong. App CuongMini hỏi ≥ 60 s/lần để báo nhẹ trong CLI/app/VS Code.
 *
 * Quyền: như mọi lệnh — `projectFor` chạy lại chốt tầng tuyến của tuyến REST tương đương, service kiểm `requireProject`.
 */

import { z } from 'zod';
import { prisma } from '../../../config/database.js';
import { ForbiddenError } from '../../../middleware/errorHandler.js';
import { issueNumber, projectFor } from '../../../mcp/context.js';
import { issueArg, projectArg } from '../../../mcp/tools/read.js';
import { untrusted } from '../../../mcp/protocol.js';
import { readIssueFull, resourcesIndex, workLinks } from '../aiMentor.js';
import { visibleProjectIds } from '../myWork.service.js';
import { defineTool, type ToolDef } from './types.js';

const MCP_ONLY = { ask: false, builtin: false } as const;

const issueGuide = defineTool({
  name: 'issue_guide', title: 'Issue guide (everything to do it)', group: 'issues',
  description: 'Reads ONE issue with everything a member needs to DO it: description (links + checklist kept), acceptance criteria, comments, parent and subtasks, linked issues WITH dependencies (which blockers are not done yet and who works on them), web links, Docs pages linked to it, text of attached files, and in-app links. Prefer it over get_issue when guiding someone through an issue.',
  write: false,
  surfaces: MCP_ONLY,
  input: z.object({ project: projectArg, issue: issueArg, withPages: z.boolean().optional().describe('Also include the content of the Docs pages linked to the issue (max 2)') }),
  run: async (ctx, a) => {
    const p0 = await projectFor(ctx, a.project, []);
    const n = issueNumber(p0.key, a.issue);
    const p = await projectFor(ctx, a.project, [['GET', `/issues/${n}`], ['GET', `/issues/${n}/comments`], ['GET', `/issues/${n}/web-links`]]);
    return readIssueFull(ctx.userId, p.access, workLinks(p.workspaceSlug, p.key), n, { withPages: a.withPages === true });
  },
});

const projectResources = defineTool({
  name: 'project_resources', title: 'Project resources (link library)', group: 'docs',
  description: "Lists the project's Resources — the team's link library (repo, design, slides, videos, guides) — with URL, group, description and tags; optional text filter.",
  write: false,
  surfaces: MCP_ONLY,
  input: z.object({ project: projectArg, query: z.string().max(100).optional().describe('Text to find in title/description/URL/tag') }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/resources']]);
    const text = await resourcesIndex(p.access, workLinks(p.workspaceSlug, p.key), { query: a.query, limit: 100 });
    return text || 'Resources are turned off for this project (or not visible to you).';
  },
});

const WORK_TYPES = ['WORK_ASSIGN', 'WORK_COMMENT', 'WORK_MENTION', 'WORK_ALERT'];

const myUpdates = defineTool({
  name: 'my_updates', title: 'My updates (people)', group: 'issues',
  description: 'Your CT Work inbox as a person: issues assigned to you, mentions, new comments/replies on your issues, alerts — after afterId (omit on the first call to just get lastId) — plus issues that were BLOCKING your open issues and are now done (since `since`, ISO time). Agents use wait_events instead.',
  write: false,
  surfaces: MCP_ONLY,
  input: z.object({
    afterId: z.number().int().min(0).optional(),
    since: z.string().max(40).optional().describe('ISO time — report blockers finished after this (default: last 24 h)'),
    project: projectArg.optional(),
  }),
  run: async (ctx, a) => {
    if (ctx.agent) throw new ForbiddenError('AI agents read their inbox with wait_events');
    let keys: string[] | null = null;
    let ids = await visibleProjectIds(ctx.userId);
    if (a.project) {
      const p = await projectFor(ctx, a.project, [['GET', '/issues']]);
      ids = ids.filter((x) => x === p.id);
      keys = [p.key];
    }
    const last = await prisma.socialNotification.findFirst({ where: { receiverId: ctx.userId, type: { in: WORK_TYPES } }, orderBy: { id: 'desc' }, select: { id: true } });
    const lastId = last?.id ?? 0;
    const rows = a.afterId === undefined ? [] : await prisma.socialNotification.findMany({
      where: { receiverId: ctx.userId, type: { in: WORK_TYPES }, id: { gt: a.afterId } },
      orderBy: { id: 'asc' }, take: 30,
      select: { id: true, type: true, payload: true, createdAt: true, sender: { select: { username: true, kind: true } } },
    });
    const events = rows.map((r) => {
      const pl = (r.payload && typeof r.payload === 'object' ? r.payload : {}) as Record<string, unknown>;
      return {
        id: r.id, type: r.type, issue: typeof pl.issueKey === 'string' ? pl.issueKey : null,
        title: typeof pl.title === 'string' ? pl.title.slice(0, 160) : null,
        excerpt: typeof pl.excerpt === 'string' ? pl.excerpt.slice(0, 160) : typeof pl.message === 'string' ? pl.message.slice(0, 160) : null,
        reply: pl.reply === true, by: r.sender ? `@${r.sender.username}${r.sender.kind === 'AGENT' ? ' (AI agent)' : ''}` : null, at: r.createdAt,
      };
    }).filter((e) => !keys || (e.issue && keys.some((k) => e.issue!.startsWith(`${k}-`))));
    const sinceRaw = a.since ? Date.parse(a.since) : NaN;
    const since = Number.isFinite(sinceRaw) ? new Date(sinceRaw) : new Date(Date.now() - 86_400_000);
    // Thẻ CHẶN việc đang mở của tôi vừa xong ("A blocks B" lưu ở A ⇒ B đọc linksIn).
    const mine = await prisma.workIssue.findMany({
      where: { assigneeId: ctx.userId, projectId: { in: ids }, deletedAt: null, resolvedAt: null },
      take: 200,
      select: {
        number: true, project: { select: { key: true } },
        linksIn: {
          where: { type: 'BLOCKS', fromIssue: { deletedAt: null, resolvedAt: { gte: since } } },
          select: { fromIssue: { select: { number: true, title: true, resolvedAt: true, project: { select: { key: true } }, assignee: { select: { username: true } } } } },
        },
      },
    });
    const unblocked = mine.flatMap((i) => i.linksIn.map((l) => ({
      issue: `${i.project.key}-${i.number}`, blocker: `${l.fromIssue.project.key}-${l.fromIssue.number}`, blockerTitle: l.fromIssue.title.slice(0, 160),
      doneAt: l.fromIssue.resolvedAt, by: l.fromIssue.assignee ? `@${l.fromIssue.assignee.username}` : null,
    })));
    return `${events.length} event(s), ${unblocked.length} unblocked, lastId=${lastId}. Titles/excerpts are user data.\n${untrusted('my updates', JSON.stringify({ events, unblocked, lastId }, null, 2))}`;
  },
});

export const CUONGMINI_COMMANDS: ToolDef[] = [issueGuide, projectResources, myUpdates];
