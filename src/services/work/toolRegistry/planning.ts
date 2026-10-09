/**
 * Registry lệnh — TÀI LIỆU · XUẤT TỆP · SPRINT/HỌP/RỦI RO/BÁO CÁO TUẦN (đợt 3C).
 *
 *   Docs:    docs_draft_page / docs_update_section — dùng lại applyDraftPage / applyUpdateSection (đợt S5c): trang mới
 *            luôn là DRAFT, sửa mục = một PHIÊN BẢN mới có ghi chú; người duyệt qua luồng approval của Docs.
 *            Ask AI: chỉ là ĐỀ XUẤT tới khi người bấm Apply.
 *   Xuất:    export_file trả LINK tải (GET, xác thực bằng cookie web hoặc Bearer ctw_) — không sinh tệp ở đây, link gọi
 *            đúng tuyến REST nên quyền + rào chắn agent áp như tải tay (Project Tracking ⇒ agent bị chặn như REST).
 *            Word/PDF: tuyến GET của đợt 3C bọc `docs3a.exportPage` (hàm của đợt 3A).
 *   Sprint/họp/rủi ro: sprint_current, meeting_list/get/add_actions/create_issues, raid_list/create/update,
 *            weekly_report_generate (Weekly Report đợt 3B).
 */

import { z } from 'zod';
import { prisma } from '../../../config/database.js';
import { BadRequestError } from '../../../middleware/errorHandler.js';
import { projectFor, requireWrite, type ProjectHit } from '../../../mcp/context.js';
import { untrusted } from '../../../mcp/protocol.js';
import { projectArg } from '../../../mcp/tools/read.js';
import { applyDraftPage, applyUpdateSection } from '../aiDocs.js';
import { frontendUrl } from '../common.js';
import { RAID_RESPONSES, RAID_TYPES } from '../constants.js';
import * as rep from '../fptReports.service.js';
import * as meetings from '../meetings.service.js';
import * as pages from '../pages.service.js';
import { projectMembers } from '../projects.service.js';
import { TRACKING_VARIANTS } from '../projectTracking.service.js';
import * as raid from '../raid.service.js';
import { activeSprintPace } from '../sprintPace.js';
import { listSprints, vnDay } from '../sprints.service.js';
import { tiptapToText } from '../tiptapText.js';
import { defineTool, type ToolDef } from './types.js';

const json = (v: unknown) => JSON.stringify(v, null, 2);
const dateArg = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n)}…` : s);

// ─── Docs ────────────────────────────────────────────────────────

const draftPage = defineTool({
  name: 'docs_draft_page', title: 'Draft a document page', group: 'docs',
  description: 'Creates a new Docs page in DRAFT from Markdown (## headings, lists, tables). A person reviews it (Docs approval) before it counts. Optional parent page number.',
  write: true,
  input: z.object({ project: projectArg, title: z.string().min(1).max(255), markdown: z.string().min(1).max(60_000), parent: z.number().int().positive().optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/pages']]);
    const r = await applyDraftPage(ctx.userId, p.id, { title: a.title, markdown: a.markdown, parent: a.parent ?? null });
    return { ...r, status: 'DRAFT', url: `/work/${p.workspaceSlug}/${p.key}/docs/${r.number}` };
  },
});

const updateSection = defineTool({
  name: 'docs_update_section', title: 'Rewrite one section of a page', group: 'docs',
  description: 'Replaces (or appends to) ONE section of a Docs page, found by its heading text — read the page with get_page first so the heading matches. Saves a new page version with a note; the old version can be restored.',
  write: true,
  input: z.object({
    project: projectArg, page: z.number().int().positive(), heading: z.string().min(1).max(200),
    markdown: z.string().min(1).max(30_000).describe('New content of the section only (no heading line)'), mode: z.enum(['replace', 'append']).optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['PATCH', `/pages/${a.page}`]]);
    const r = await applyUpdateSection(ctx.userId, p.id, { number: a.page, heading: a.heading, markdown: a.markdown, mode: a.mode ?? 'replace' });
    return { ...r, url: `/work/${p.workspaceSlug}/${p.key}/docs/${a.page}` };
  },
});

// ─── Xuất tệp: trả link tải ──────────────────────────────────────

export const EXPORT_KINDS = ['unit_test', 'integration_test', 'system_test', 'project_tracking', 'weekly_report', 'ai_usage', 'wbs', 'page_docx', 'page_pdf', 'rtm', 'report3_docx', 'report3_pdf', 'final_docx', 'final_pdf'] as const;

/** Tuyến REST (sau /projects/:pid) + mô tả của từng loại tệp. Một chỗ — export_file và test cùng đọc. */
export function exportRoute(kind: (typeof EXPORT_KINDS)[number], o: { module?: string; variant?: string; weeklyIds?: number[]; page?: number }): { path: string; file: string } {
  const q = (obj: Record<string, string | undefined>) => {
    const s = new URLSearchParams(Object.entries(obj).filter(([, v]) => v !== undefined && v !== '') as Array<[string, string]>).toString();
    return s ? `?${s}` : '';
  };
  switch (kind) {
    case 'unit_test': return { path: `/fpt-tests/export${q({ report: 'unit', module: o.module })}`, file: 'Report 5.1 Unit Test (.xlsx)' };
    case 'integration_test': return { path: `/fpt-tests/export${q({ report: 'integration' })}`, file: 'Report 5.2 Integration Test (.xlsx)' };
    case 'system_test': return { path: `/fpt-tests/export${q({ report: 'system' })}`, file: 'Report 5.3 System Test (.xlsx)' };
    case 'project_tracking': return { path: `/export/project-tracking${q({ variant: o.variant ?? 'SWP391' })}`, file: `Project Tracking ${o.variant ?? 'SWP391'} (.xlsx)` };
    case 'weekly_report': return { path: `/fpt-reports/weekly/export${q({ ids: o.weeklyIds?.length ? o.weeklyIds.join(',') : undefined })}`, file: 'Weekly Report (.xlsx)' };
    case 'ai_usage': return { path: '/fpt-reports/ai-usage/export', file: 'AI Usage Report (.xlsx)' };
    case 'wbs': return { path: '/wbs/export', file: 'WBS + estimation (.xlsx)' };
    // CTW đợt 4: RTM (Excel), Report 3 SRS sinh từ SRS có cấu trúc, Report 7 Final ghép Report 1–6 (Word/PDF).
    case 'rtm': return { path: '/rtm/export.xlsx', file: 'Requirement Traceability Matrix (.xlsx)' };
    case 'report3_docx': return { path: '/srs/report3/export.docx', file: 'Report 3 Software Requirement Specification (.docx)' };
    case 'report3_pdf': return { path: '/srs/report3/export.pdf', file: 'Report 3 Software Requirement Specification (.pdf)' };
    case 'final_docx': return { path: '/final-report/export.docx', file: 'Report 7 Final Project Report (.docx)' };
    case 'final_pdf': return { path: '/final-report/export.pdf', file: 'Report 7 Final Project Report (.pdf)' };
    case 'page_docx':
    case 'page_pdf': {
      if (!o.page) throw new BadRequestError('Say which page to export (page number)', 'VALIDATION_ERROR');
      return { path: `/pages/${o.page}/export.${kind === 'page_docx' ? 'docx' : 'pdf'}`, file: `Document #${o.page} (.${kind === 'page_docx' ? 'docx' : 'pdf'})` };
    }
  }
}

/** Đường dẫn chỉ để tải (bỏ query) — dùng để chạy chốt rào chắn agent đúng như REST. */
const routeOnly = (path: string) => path.replace(/\?.*$/, '');

const exportFile = defineTool({
  name: 'export_file', title: 'Get a download link', group: 'export',
  description: 'Returns a download link for a file CT Work generates in the official FPT templates: unit_test / integration_test / system_test (Reports 5.1–5.3, Excel), project_tracking (variant SWP391 | SEP490 | SWP391_T1 | ISSUES), weekly_report, ai_usage, wbs, page_docx / page_pdf (one Docs page as Word or PDF), rtm (traceability matrix, Excel), report3_docx / report3_pdf (Report 3 SRS from the structured requirements), final_docx / final_pdf (Report 7 Final). The link needs the same login (web cookie, or Authorization: Bearer <token>). LIMITATION of page_docx / page_pdf: Mermaid diagram blocks come out as their source code with a caption, not as pictures (the server cannot render Mermaid); Excalidraw diagrams and uploaded images are pictures. Tell the user to export from the page in the web app (Export → Word/PDF) when they need the Mermaid diagrams drawn.',
  write: false,
  input: z.object({
    project: projectArg, kind: z.enum(EXPORT_KINDS),
    module: z.string().max(120).optional().describe('unit_test: only this module'),
    variant: z.enum(TRACKING_VARIANTS).optional(), weeklyIds: z.array(z.number().int().positive()).max(60).optional(),
    page: z.number().int().positive().optional().describe('page_docx / page_pdf: page number'),
  }),
  run: async (ctx, a) => {
    const r = exportRoute(a.kind, a);
    const p = await projectFor(ctx, a.project, [['GET', routeOnly(r.path)]]);
    if (a.kind === 'page_docx' || a.kind === 'page_pdf') await pages.getPage(ctx.userId, p.id, a.page!); // không đọc được ⇒ 404 ngay, không phát link chết
    if (a.kind === 'weekly_report' && !(await prisma.workWeeklyReport.count({ where: { projectId: p.id } }))) {
      throw new BadRequestError('This project has no weekly report yet — create one with weekly_report_generate first', 'WORK_NOTHING_TO_DO');
    }
    const apiPath = `/api/v1/work/projects/${p.id}${r.path}`;
    return { file: r.file, url: frontendUrl(apiPath), path: apiPath, method: 'GET', auth: 'Signed-in browser session, or header Authorization: Bearer <CT Work token>' };
  },
});

// ─── Sprint ──────────────────────────────────────────────────────

const sprintCurrent = defineTool({
  name: 'sprint_current', title: 'Current sprint', group: 'planning',
  description: 'The active sprint: goal, dates, pace (remaining vs days left, computed by CT Work) and its issues with status, assignee and points. Also lists planned sprints.',
  write: false,
  input: z.object({ project: projectArg }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/sprints']]);
    const sprints = await listSprints(ctx.userId, p.id);
    const active = sprints.find((s) => s.state === 'ACTIVE') ?? null;
    const planned = sprints.filter((s) => s.state === 'PLANNED').map((s) => ({ name: s.name, startAt: s.startAt, endAt: s.endAt }));
    if (!active) return { active: null, planned, note: 'No sprint is running.' };
    const [issues, pace] = await Promise.all([
      prisma.workIssue.findMany({
        where: { projectId: p.id, sprintId: active.id, deletedAt: null },
        orderBy: [{ rank: 'asc' }, { id: 'asc' }], take: 300,
        select: { number: true, title: true, storyPoints: true, flaggedAt: true, type: { select: { key: true } }, status: { select: { name: true, category: true } }, assignee: { select: { username: true, kind: true } } },
      }),
      activeSprintPace(p.id),
    ]);
    const rows = issues.map((i) => ({ key: `${p.key}-${i.number}`, title: i.title, type: i.type.key, status: i.status.name, category: i.status.category, assignee: i.assignee ? `${i.assignee.kind === 'AGENT' ? '🤖 ' : ''}${i.assignee.username}` : null, points: i.storyPoints, blocked: !!i.flaggedAt }));
    return `Active sprint "${active.name}" (${rows.length} issues). Numbers are computed by CT Work.\n${untrusted('current sprint', json({ sprint: { name: active.name, goal: active.goal, startAt: active.startAt, endAt: active.endAt }, pace, issues: rows, planned }))}`;
  },
});

// ─── Họp ─────────────────────────────────────────────────────────

const meetingRef = z.union([z.number().int().positive(), z.string().min(1).max(20)]).describe('Meeting number (3) or key ("M-3")');
const meetingNo = (ref: number | string) => {
  const n = typeof ref === 'number' ? ref : Number(/(\d+)\s*$/.exec(ref)?.[1] ?? NaN);
  if (!Number.isInteger(n) || n <= 0) throw new BadRequestError(`"${String(ref)}" is not a meeting (use 3 or "M-3")`, 'VALIDATION_ERROR');
  return n;
};

const meetingList = defineTool({
  name: 'meeting_list', title: 'List meetings', group: 'planning',
  description: 'Lists project meetings (upcoming, past or all) with type, time and how many action items still have no issue.',
  write: false,
  input: z.object({ project: projectArg, scope: z.enum(['upcoming', 'past', 'all']).optional() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/meetings']]);
    const r = await meetings.listMeetings(ctx.userId, p.id, { scope: a.scope ?? 'all' });
    const rows = (Array.isArray(r) ? r : (r as { items?: unknown[] }).items ?? []) as Array<Record<string, unknown>>;
    return untrusted('meetings', json(rows.slice(0, 50).map((m) => ({ key: m.key, title: m.title, type: m.typeLabel, status: m.status, startsAt: m.startsAt, actionItems: m.actionCount, withoutIssue: m.actionsOpen }))));
  },
});

const meetingGet = defineTool({
  name: 'meeting_get', title: 'Read meeting minutes', group: 'planning',
  description: 'Reads one meeting: agenda, minutes, decisions and action items (with the issue each became, if any). Use it to turn minutes into issues.',
  write: false,
  input: z.object({ project: projectArg, meeting: meetingRef }),
  run: async (ctx, a) => {
    const n = meetingNo(a.meeting);
    const p = await projectFor(ctx, a.project, [['GET', `/meetings/${n}`]]);
    const m = await meetings.getMeeting(ctx.userId, p.id, n);
    const view = {
      key: m.key, title: m.title, type: m.typeLabel, status: m.status, startsAt: m.startsAt, attendees: m.attendees.map((x) => x.username),
      agenda: clip(tiptapToText(m.agendaJson), 6000), minutes: clip(tiptapToText(m.minutesJson), 12_000), decisions: m.decisions,
      actions: m.actions.map((x) => ({ id: x.id, text: x.text, owner: x.assignee?.username ?? null, dueDate: x.dueDate, issue: x.issue?.key ?? null })),
    };
    return untrusted(`meeting ${m.key}`, json(view));
  },
});

async function memberIdByUsername(projectId: number, username: string | null | undefined): Promise<number | null> {
  if (!username) return null;
  const want = username.replace(/^@/, '').toLowerCase();
  const m = (await projectMembers(projectId)).find((x) => x.username.toLowerCase() === want);
  if (!m) throw new BadRequestError(`@${username} is not a member of this project`, 'WORK_BAD_USER');
  return m.id;
}

const meetingAddActions = defineTool({
  name: 'meeting_add_actions', title: 'Add action items to a meeting', group: 'planning',
  description: 'Appends action items (text, optional owner username and due date) to a meeting\'s minutes. Existing action items are kept. Then meeting_create_issues turns them into issues.',
  write: true,
  input: z.object({
    project: projectArg, meeting: meetingRef,
    actions: z.array(z.object({ text: z.string().min(1).max(500), owner: z.string().max(60).nullable().optional(), dueDate: dateArg.nullable().optional() })).min(1).max(50),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const n = meetingNo(a.meeting);
    const p = await projectFor(ctx, a.project, [['PUT', `/meetings/${n}/actions`]]);
    const cur = await meetings.getMeeting(ctx.userId, p.id, n);
    const items = [
      ...cur.actions.map((x) => ({ id: x.id, text: x.text, assigneeId: x.assignee?.id ?? null, dueDate: x.dueDate ? new Date(`${x.dueDate}T00:00:00Z`) : null })),
      ...await Promise.all(a.actions.map(async (x) => ({ text: x.text, assigneeId: await memberIdByUsername(p.id, x.owner), dueDate: x.dueDate ? new Date(`${x.dueDate}T00:00:00Z`) : null }))),
    ];
    const m = await meetings.setActions(ctx.userId, p.id, n, items);
    return { meeting: m.key, actions: m.actions.map((x) => ({ id: x.id, text: x.text, issue: x.issue?.key ?? null })) };
  },
});

const meetingIssues = defineTool({
  name: 'meeting_create_issues', title: 'Create issues from meeting action items', group: 'planning',
  description: 'Creates one issue per action item that has no issue yet (all, or the given action ids). Owner and due date carry over; sprint/stage follow the meeting date. Running it twice does not duplicate.',
  write: true,
  input: z.object({ project: projectArg, meeting: meetingRef, actionIds: z.array(z.number().int().positive()).max(100).optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const n = meetingNo(a.meeting);
    const p = await projectFor(ctx, a.project, [['POST', `/meetings/${n}/actions/issues`]]);
    const r = await meetings.createIssuesFromActions(ctx.userId, p.id, n, a.actionIds);
    return { created: r.created.map((c) => ({ key: c.key, title: c.title })) };
  },
});

// ─── RAID ────────────────────────────────────────────────────────

const raidRef = z.union([z.number().int().positive(), z.string().min(1).max(20)]).describe('RAID number (4) or key ("R-4")');
const raidNo = (ref: number | string) => {
  const n = typeof ref === 'number' ? ref : Number(/(\d+)\s*$/.exec(ref)?.[1] ?? NaN);
  if (!Number.isInteger(n) || n <= 0) throw new BadRequestError(`"${String(ref)}" is not a RAID item`, 'VALIDATION_ERROR');
  return n;
};
const scale = z.number().int().min(1).max(5);
const raidFields = {
  description: z.string().max(10_000).nullable().optional(), category: z.string().max(60).nullable().optional(),
  owner: z.string().max(60).nullable().optional().describe('Owner username'), status: z.string().max(20).optional(),
  probability: scale.nullable().optional(), impact: scale.nullable().optional(), response: z.enum(RAID_RESPONSES).nullable().optional(),
  mitigation: z.string().max(5000).nullable().optional(), trigger: z.string().max(2000).nullable().optional(), reviewDate: dateArg.nullable().optional(),
};

async function raidInput(p: ProjectHit, a: { owner?: string | null; reviewDate?: string | null } & Record<string, unknown>) {
  const { owner, reviewDate, project: _p, item: _i, type: _t, title: _ti, ...rest } = a as Record<string, unknown> & { owner?: string | null; reviewDate?: string | null };
  return {
    ...(rest as raid.RaidInput),
    ...(owner !== undefined ? { ownerId: await memberIdByUsername(p.id, owner) } : {}),
    ...(reviewDate !== undefined ? { reviewDate: reviewDate ? new Date(`${reviewDate}T00:00:00Z`) : null } : {}),
  };
}

const raidList = defineTool({
  name: 'raid_list', title: 'List risks, assumptions, issues, dependencies', group: 'planning',
  description: 'Lists the RAID log (Risks, Assumptions, Issues, Dependencies) with score (probability × impact), level, owner and review date.',
  write: false,
  input: z.object({ project: projectArg, type: z.enum(RAID_TYPES).optional(), status: z.string().max(20).optional() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/raid']]);
    const r = await raid.listRaid(ctx.userId, p.id, { type: a.type, status: a.status });
    const rows = ((Array.isArray(r) ? r : (r as { items?: unknown[] }).items ?? []) as Array<Record<string, unknown>>).slice(0, 100)
      .map((x) => ({ key: x.key, type: x.type, title: x.title, status: x.status, score: x.score, level: x.level, owner: (x.owner as { username?: string } | null)?.username ?? null, mitigation: x.mitigation, reviewDate: x.reviewDate }));
    return untrusted('RAID log', json(rows));
  },
});

const raidCreate = defineTool({
  name: 'raid_create', title: 'Add a RAID item', group: 'planning',
  description: 'Adds a Risk / Assumption / Issue / Dependency. For a risk give probability and impact (1–5) and a mitigation.',
  write: true,
  input: z.object({ project: projectArg, type: z.enum(RAID_TYPES), title: z.string().min(1).max(255), ...raidFields }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/raid']]);
    const r = await raid.createRaid(ctx.userId, p.id, { ...(await raidInput(p, a)), type: a.type, title: a.title });
    return { created: (r as { key?: string }).key ?? null, item: r };
  },
});

const raidUpdate = defineTool({
  name: 'raid_update', title: 'Update a RAID item', group: 'planning',
  description: 'Updates fields of a RAID item (status, probability, impact, mitigation, owner, review date…). Only the fields you pass change.',
  write: true,
  input: z.object({ project: projectArg, item: raidRef, title: z.string().min(1).max(255).optional(), ...raidFields }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const n = raidNo(a.item);
    const p = await projectFor(ctx, a.project, [['PATCH', `/raid/${n}`]]);
    const input = await raidInput(p, a);
    if (a.title !== undefined) (input as raid.RaidInput).title = a.title;
    if (!Object.keys(input).length) throw new BadRequestError('Nothing to change — pass at least one field', 'VALIDATION_ERROR');
    const r = await raid.updateRaid(ctx.userId, p.id, n, input);
    return { updated: (r as { key?: string }).key ?? null, item: r };
  },
});

// ─── Báo cáo tuần (Weekly Report đợt 3B) ─────────────────────────

const weekly = defineTool({
  name: 'weekly_report_generate', title: 'Generate the weekly report', group: 'planning',
  description: 'Creates (or refreshes, if it already exists) the FPT Weekly Report for a week from the project data — done/planned work, issues, risks, hours — computed by CT Work. Returns the report and a download link.',
  write: true,
  input: z.object({ project: projectArg, weekStart: dateArg.optional().describe('Any day of the week (default: this week)') }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/fpt-reports/weekly'], ['POST', '/fpt-reports/weekly/0/refresh']]);
    const day = a.weekStart ?? vnDay();
    let w: Awaited<ReturnType<typeof rep.createWeekly>>;
    let refreshed = false;
    try {
      w = await rep.createWeekly(ctx.userId, p.id, day);
    } catch (err) {
      const id = (err as { code?: string; data?: { id?: number } }).code === 'WORK_DUPLICATE' ? (err as { data?: { id?: number } }).data?.id : undefined;
      if (!id) throw err;
      w = await rep.refreshWeekly(ctx.userId, p.id, id);
      refreshed = true;
    }
    const out = w as unknown as { id: number; weekStart: string; weekNo: number | null };
    const apiPath = `/api/v1/work/projects/${p.id}/fpt-reports/weekly/export?ids=${out.id}`;
    return { report: { id: out.id, weekStart: out.weekStart, weekNo: out.weekNo }, refreshed, download: frontendUrl(apiPath), data: w };
  },
});

export const PLANNING_COMMANDS: ToolDef[] = [
  draftPage, updateSection, exportFile, sprintCurrent,
  meetingList, meetingGet, meetingAddActions, meetingIssues,
  raidList, raidCreate, raidUpdate, weekly,
];
