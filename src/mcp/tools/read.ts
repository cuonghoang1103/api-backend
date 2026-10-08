/**
 * CT Work MCP — tool ĐỌC (A9): whoami, list_projects, my_work, get_issue, search_issues, list_pages, get_page.
 * Mỗi tool: chốt tầng tuyến qua `projectFor` (tuyến REST tương đương) rồi gọi THẲNG service (tầng hành động).
 */

import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { displayName } from '../../services/work/common.js';
import * as projects from '../../services/work/projects.service.js';
import * as pages from '../../services/work/pages.service.js';
import * as searchSvc from '../../services/work/search.service.js';
import { visibleProjectIds } from '../../services/work/myWork.service.js';
import { vnDay } from '../../services/work/sprints.service.js';
import { issueNumber, projectFor, type McpCtx } from '../context.js';
import { DEFAULT_INCLUDES, ISSUE_INCLUDES, issueMarkdown } from '../issueView.js';
import { untrusted } from '../protocol.js';
import { defineTool, type ToolDef } from './types.js';

export const projectArg = z.string().min(1).max(80).describe('Project key, e.g. "FP" (or "<workspace-slug>/FP" if you are in several workspaces with the same key)');
export const issueArg = z.union([z.number().int().positive(), z.string().min(1).max(40)]).describe('Issue number (12) or key ("FP-12")');

const json = (v: unknown) => JSON.stringify(v, null, 2);

/** Danh sách dự án token này thấy (đã lọc không gian + phạm vi token của agent). */
async function scopedProjects(ctx: McpCtx) {
  const wsIds = ctx.agent
    ? [ctx.agent.workspaceId]
    : (await prisma.workMember.findMany({ where: { userId: ctx.userId, workspace: { deletedAt: null } }, select: { workspaceId: true } })).map((m) => m.workspaceId);
  const out: Array<{ workspace: { id: number; slug: string; name: string }; project: Awaited<ReturnType<typeof projects.listProjects>>[number] }> = [];
  for (const wsId of wsIds) {
    const ws = await prisma.workSpace.findUnique({ where: { id: wsId }, select: { id: true, slug: true, name: true } });
    if (!ws) continue;
    for (const p of await projects.listProjects(ctx.userId, wsId)) {
      if (ctx.agent?.projectIds && !ctx.agent.projectIds.includes(p.id)) continue;
      out.push({ workspace: ws, project: p });
    }
  }
  return out;
}

const whoami = defineTool({
  name: 'whoami',
  surfaces: { ask: false, builtin: false },
  title: 'Who am I',
  description: 'Shows which CT Work account this token acts as: the user (kind HUMAN or AGENT), for agents the model, owner (the person responsible) and status, and the token scopes. Call this first.',
  write: false,
  input: z.object({}),
  run: async (ctx) => {
    const u = await prisma.user.findUniqueOrThrow({ where: { id: ctx.userId }, select: { id: true, username: true, fullName: true, displayName: true, kind: true } });
    const ag = ctx.agent
      ? await prisma.workAgent.findUnique({
        where: { id: ctx.agent.id },
        select: { id: true, model: true, status: true, roleText: true, runtime: true, parallelSlots: true, owner: { select: { username: true, fullName: true, displayName: true } }, workspace: { select: { id: true, slug: true, name: true } } },
      })
      : null;
    return {
      user: { id: u.id, username: u.username, name: displayName(u), kind: u.kind },
      ...(ag ? {
        agent: {
          id: ag.id, model: ag.model, status: ag.status, runtime: ag.runtime, parallelSlots: ag.parallelSlots,
          owner: { username: ag.owner.username, name: displayName(ag.owner) }, workspace: ag.workspace,
          projectScope: ctx.agent?.projectIds ?? 'all projects the agent is a member of', roleText: ag.roleText,
        },
      } : {}),
      scopes: ctx.scopes,
      rules: ctx.agent ? [
        'Work only on issues assigned to you: claim_issue → work → comment evidence → log_work → report_usage → transition "done" (it lands in review).',
        'You cannot approve, delete, change project settings, talk to clients or touch finance. Use ask_lead when blocked.',
      ] : undefined,
    };
  },
});

const listProjects = defineTool({
  name: 'list_projects',
  surfaces: { ask: false, builtin: false },
  title: 'List projects',
  description: 'Lists the CT Work projects this token can use: key, name, kind, your role and enabled modules. Use the key as the "project" argument of other tools.',
  write: false,
  input: z.object({}),
  run: async (ctx) => {
    const rows = await scopedProjects(ctx);
    const many = new Set(rows.map((r) => r.workspace.id)).size > 1;
    const list = rows.map(({ workspace, project: p }) => ({
      key: many ? `${workspace.slug}/${p.key}` : p.key, name: p.name, kind: p.kind, myRole: p.role, archived: !!p.archivedAt,
      openIssues: p.openIssues, modules: Object.entries(p.modules ?? {}).filter(([, on]) => on).map(([k]) => k), workspace: workspace.slug,
    }));
    return `${list.length} project(s). Names are user data.\n${untrusted('project list', json(list))}`;
  },
});

const myWork = defineTool({
  name: 'my_work',
  surfaces: { ask: false, builtin: false },
  title: 'My work',
  description: 'Open issues assigned to you (optionally in one project), oldest due first, with your active leases. This is your work queue.',
  write: false,
  input: z.object({ project: projectArg.optional() }),
  run: async (ctx, a) => {
    let ids = await visibleProjectIds(ctx.userId);
    if (ctx.agent) {
      const inWs = await prisma.workProject.findMany({ where: { id: { in: ids }, workspaceId: ctx.agent.workspaceId }, select: { id: true } });
      ids = inWs.map((p) => p.id).filter((id) => !ctx.agent!.projectIds || ctx.agent!.projectIds.includes(id));
    }
    if (a.project) {
      const p = await projectFor(ctx, a.project, [['GET', '/issues']]);
      ids = ids.filter((id) => id === p.id);
    }
    const [rows, leases] = await Promise.all([
      prisma.workIssue.findMany({
        where: { assigneeId: ctx.userId, projectId: { in: ids }, deletedAt: null, resolvedAt: null, type: { level: { not: 1 } } },
        orderBy: [{ dueDate: { sort: 'asc', nulls: 'last' } }, { priority: 'asc' }, { updatedAt: 'desc' }],
        take: 200,
        select: { id: true, number: true, title: true, priority: true, dueDate: true, flaggedAt: true, storyPoints: true, type: { select: { key: true } }, status: { select: { name: true, category: true } }, project: { select: { key: true } } },
      }),
      ctx.agent ? prisma.workAgentLease.findMany({ where: { agentId: ctx.agent.id, status: 'ACTIVE' }, select: { id: true, issueId: true, expiresAt: true, progressPct: true } }) : Promise.resolve([]),
    ]);
    const today = vnDay();
    const items = rows.map((i) => {
      const l = leases.find((x) => x.issueId === i.id);
      const due = i.dueDate ? i.dueDate.toISOString().slice(0, 10) : null;
      return {
        key: `${i.project.key}-${i.number}`, title: i.title, type: i.type.key, status: i.status.name, statusCategory: i.status.category,
        priority: i.priority, points: i.storyPoints, dueDate: due, overdue: !!due && due < today, blocked: !!i.flaggedAt,
        ...(l ? { lease: { id: l.id, expiresAt: l.expiresAt, progressPct: l.progressPct } } : {}),
      };
    });
    const counts = { total: items.length, inProgress: items.filter((i) => i.statusCategory === 'IN_PROGRESS').length, overdue: items.filter((i) => i.overdue).length, leased: leases.length };
    return `Counts: ${JSON.stringify(counts)}. Titles are user data.\n${untrusted('my work', json(items))}`;
  },
});

const getIssue = defineTool({
  name: 'get_issue',
  title: 'Get issue',
  description: 'Reads one issue as markdown: status, allowed transitions, assignee, description, acceptance criteria, subtasks, links, attachments, comments (and history/work logs when asked), plus the project Definition of Done.',
  write: false,
  input: z.object({
    project: projectArg,
    issue: issueArg,
    include: z.array(z.enum(ISSUE_INCLUDES)).max(6).optional().describe(`Sections to include (default: ${DEFAULT_INCLUDES.join(', ')})`),
  }),
  run: async (ctx, a) => {
    const include = a.include?.length ? a.include : DEFAULT_INCLUDES;
    const p0 = await projectFor(ctx, a.project, []);
    const n = issueNumber(p0.key, a.issue);
    const routes: Array<[string, string]> = [['GET', `/issues/${n}`]];
    if (include.includes('comments')) routes.push(['GET', `/issues/${n}/comments`]);
    if (include.includes('history')) routes.push(['GET', `/issues/${n}/history`]);
    if (include.includes('worklogs')) routes.push(['GET', `/issues/${n}/worklogs`]);
    const p = await projectFor(ctx, a.project, routes);
    return issueMarkdown(ctx, p, n, include);
  },
});

const searchIssues = defineTool({
  name: 'search_issues',
  title: 'Search issues',
  description: 'Searches issues of a project with JQL (e.g. `assignee = currentUser() AND statusCategory != Done ORDER BY priority`) and/or plain text (accent-insensitive). Returns at most 50 rows.',
  write: false,
  input: z.object({
    project: projectArg,
    jql: z.string().max(2000).optional(),
    text: z.string().max(200).optional().describe('Plain text to find in title/description'),
    limit: z.number().int().min(1).max(50).optional(),
  }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/search']]);
    const parts: string[] = [];
    if (a.text?.trim()) parts.push(`text ~ "${a.text.trim().replace(/["\\]/g, ' ')}"`);
    let jql = a.jql?.trim() ?? '';
    let order = '';
    const m = /\border\s+by\b[\s\S]*$/i.exec(jql);
    if (m) { order = m[0]; jql = jql.slice(0, m.index).trim(); }
    if (jql) parts.push(`(${jql})`);
    const query = `${parts.join(' AND ')}${order ? ` ${order}` : ''}`.trim();
    const r = await searchSvc.search(ctx.userId, p.id, query, { limit: a.limit ?? 25 });
    const [statuses, users] = await Promise.all([
      prisma.workStatus.findMany({ where: { id: { in: [...new Set(r.items.map((i) => i.statusId))] } }, select: { id: true, name: true } }),
      prisma.user.findMany({ where: { id: { in: [...new Set(r.items.map((i) => i.assigneeId).filter((x): x is number => !!x))] } }, select: { id: true, username: true } }),
    ]);
    const rows = r.items.map((i) => ({
      key: `${p.key}-${i.number}`, title: i.title, status: statuses.find((s) => s.id === i.statusId)?.name ?? null,
      assignee: users.find((u) => u.id === i.assigneeId)?.username ?? null, priority: i.priority, points: i.storyPoints, blocked: !!i.flaggedAt,
    }));
    return `${r.total} match(es), showing ${rows.length}. Query: ${query || '(all)'}\n${untrusted(`search in ${p.key}`, json(rows))}`;
  },
});

const listPages = defineTool({
  name: 'list_pages',
  title: 'List docs pages',
  description: 'Lists the Docs pages of a project you can read (number, title, status). Read one with get_page.',
  write: false,
  input: z.object({ project: projectArg }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/pages']]);
    const r = await pages.listPages(ctx.userId, p.id);
    const rows = r.pages.map((x) => ({ page: x.number, title: x.title, status: x.status, visibility: x.visibility, parentId: x.parentId }));
    return `${rows.length} page(s). Titles are user data.\n${untrusted(`pages of ${p.key}`, json(rows))}`;
  },
});

const getPage = defineTool({
  name: 'get_page',
  title: 'Get docs page',
  description: 'Reads one Docs page of a project as markdown.',
  write: false,
  input: z.object({ project: projectArg, page: z.number().int().positive().describe('Page number from list_pages') }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', `/pages/${a.page}/markdown`]]);
    const r = await pages.exportMarkdown(ctx.userId, p.id, a.page);
    return `Page ${p.key}-DOC-${a.page}:\n${untrusted(`page ${p.key}-DOC-${a.page}`, r.markdown)}`;
  },
});

export const READ_TOOLS: ToolDef[] = [whoami, listProjects, myWork, getIssue, searchIssues, listPages, getPage];
