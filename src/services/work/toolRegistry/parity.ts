/**
 * Registry lệnh — 21/10/2026: CUONGMINI NGANG QUYỀN NGƯỜI (phần còn thiếu sau personOps 19/10).
 *
 * Sự cố gốc (người dùng là chủ dự án, nối CuongMini bằng token CÁ NHÂN đọc + ghi): "CT Work chưa cho mình cách điền
 * Executed By hoặc xoá các dòng đó" — token của NGƯỜI, không phải agent, nên không có rào nào chặn; chỉ đơn giản là
 * KHÔNG CÓ LỆNH. File này bù các việc thường ngày còn thiếu (bảng đối chiếu: docs/cuongmini-ctwork-parity.md):
 *
 *   Thẻ:       issue_delete / issue_restore · issue_clone · comment_edit / comment_delete · attachment_delete ·
 *              issue_web_link_remove · issue_custom_fields_set · worklog_delete
 *   Sprint:    sprint_update / sprint_delete
 *   Docs:      docs_page_update (tiêu đề, thay trọn nội dung Markdown, trạng thái) / docs_page_move / docs_page_delete /
 *              docs_page_restore
 *   Xray:      test_update · test_cycle_update / test_cycle_delete · test_run_defect
 *   Khác:      raid_delete · meeting_create / meeting_update / meeting_delete · qna_update / qna_delete · diagram_delete ·
 *              chat_edit / chat_delete · resource_add / resource_update / resource_delete
 *   Mã nguồn:  project_repos — repo của dự án (kết nối GitHub/GitLab + link repo trong Resources) kèm URL clone + nhánh
 *              mặc định, để CuongMini tự clone khi thư mục đang mở không phải checkout của dự án.
 *
 * Luật như mọi lệnh registry: `requireWrite` + `projectFor` với TUYẾN REST TƯƠNG ĐƯƠNG (rào agent, cổng khách) rồi gọi
 * THẲNG service của tuyến đó ⇒ quyền y hệt web. Lệnh XOÁ: `destructive` (client luôn hỏi người dùng, kể cả khi bật tự
 * ghi) + `personOnly` + `requirePerson` (agent thành viên không xoá — AGENT_DENIED_ROUTES chặn thêm ở tầng tuyến).
 * Việc PHẢI do người tự bấm (không có lệnh): quyết định duyệt, đặt trang Docs = APPROVED, cho khách thấy (CLIENT), tài
 * chính, gửi ra ngoài, xoá dự án/không gian — xem docs/cuongmini-ctwork-parity.md mục "Chỉ người".
 */

import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../../middleware/errorHandler.js';
import { issueIdOf, issueNumber, projectFor, requirePerson, requireWrite, touchLease, type McpCtx, type ProjectHit } from '../../../mcp/context.js';
import { untrusted } from '../../../mcp/protocol.js';
import { issueArg, projectArg } from '../../../mcp/tools/read.js';
import { auditProject } from '../audit.js';
import * as chat from '../chat.service.js';
import { MEETING_STATUSES, MEETING_TYPES, PRIORITY_MAX, PRIORITY_MIN, QUESTION_STATUSES } from '../constants.js';
import * as custom from '../customize.service.js';
import * as dg from '../diagrams.service.js';
import { markdownToTiptap } from '../docMarkdown.js';
import * as issues from '../issues.service.js';
import * as meetings from '../meetings.service.js';
import * as pageTrash from '../pageTrash.service.js';
import * as pages from '../pages.service.js';
import * as planning from '../planning.service.js';
import * as qna from '../qna.service.js';
import { QA_PRIORITIES } from '../qna.service.js';
import * as raid from '../raid.service.js';
import * as resources from '../resources.service.js';
import { githubMeta } from '../resources.service.js';
import { githubRepoOf } from '../resourceRules.js';
import * as sprints from '../sprints.service.js';
import * as srs from '../srs.service.js';
import * as tests from '../tests.service.js';
import * as trash from '../trash.service.js';
import { assigneeIdOf, sprintIdOf, sprintRefArg } from './personOps.js';
import { defineTool, mcpOnly, type ToolDef } from './types.js';

const json = (v: unknown) => JSON.stringify(v, null, 2);
const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const docOf = (markdown: string) => markdownToTiptap(markdown).doc as unknown as Prisma.InputJsonValue;
/** Lệnh XOÁ: không ở Ask AI (web có nút riêng), không ở agent dựng sẵn. */
const DEL = { write: true, destructive: true, personOnly: true, surfaces: { ask: false, builtin: false } } as const;

/** Thẻ + chốt tầng tuyến (như issueCtx của write.ts). */
async function issueHit(ctx: McpCtx, project: string, issue: unknown, routes: (n: number) => Array<[string, string]>): Promise<{ p: ProjectHit; n: number; key: string }> {
  requireWrite(ctx);
  const head = String(project ?? '').trim();
  const n = issueNumber((head.includes('/') ? head.split('/')[1] : head).toUpperCase(), issue);
  const p = await projectFor(ctx, project, routes(n));
  return { p, n, key: `${p.key}-${n}` };
}

/** "Q-4" / "R-3" / 4 ⇒ 4. */
function numOf(ref: number | string, what: string): number {
  const n = typeof ref === 'number' ? ref : Number(/(\d+)\s*$/.exec(ref)?.[1] ?? NaN);
  if (!Number.isInteger(n) || n <= 0) throw new BadRequestError(`"${String(ref)}" is not a ${what}`, 'VALIDATION_ERROR');
  return n;
}
const numRef = (what: string) => z.union([z.number().int().positive(), z.string().min(1).max(20)]).describe(`${what} number or key`);

// ═══ Thẻ ═════════════════════════════════════════════════════════

const issueDelete = defineTool({
  name: 'issue_delete', title: 'Delete an issue (to trash)', group: 'issues',
  description: 'DESTRUCTIVE: moves an issue to the project trash (needs the delete permission of your role, as on the web). It can be restored with issue_restore until the trash is emptied. The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, issue: issueArg }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete issues');
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [['DELETE', `/issues/${n}`]]);
    const row = await prisma.workIssue.findFirst({ where: { projectId: p.id, number: n, deletedAt: null }, select: { title: true } });
    await issues.deleteIssueAs(ctx.userId, p.id, n);
    await auditProject(p.id, { actorId: ctx.userId, action: 'issue.delete', targetType: 'issue', summary: `Moved issue #${n} to trash` });
    return { deleted: key, title: row?.title ?? null, restore: `issue_restore {issue: "${key}"}` };
  },
});

const issueRestore = defineTool({
  name: 'issue_restore', title: 'Restore an issue from the trash', group: 'issues',
  description: 'Restores an issue that was deleted (moved to the project trash).',
  write: true, personOnly: true, surfaces: { ask: false, builtin: false },
  input: z.object({ project: projectArg, issue: issueArg }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'restore issues');
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [['POST', `/trash/${n}/restore`]]);
    await trash.restoreIssue(ctx.userId, p.id, n);
    return { restored: key, url: `/work/${p.workspaceSlug}/${p.key}/issues/${n}` };
  },
});

const issueClone = defineTool({
  name: 'issue_clone', title: 'Clone an issue', group: 'issues',
  description: 'Copies an issue (title "CLONE – …", description, type, fields, labels) as a new issue — the "Clone" item of the issue menu.',
  write: true,
  input: z.object({ project: projectArg, issue: issueArg }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [['POST', `/issues/${n}/clone`]]);
    const c = await issues.cloneIssueAs(ctx.userId, p.id, n);
    return { cloned: key, created: `${p.key}-${c.number}`, url: `/work/${p.workspaceSlug}/${p.key}/issues/${c.number}` };
  },
});

const commentEdit = defineTool({
  name: 'comment_edit', title: 'Edit a comment', group: 'issues',
  description: 'Replaces the text (markdown) of one of YOUR comments on an issue. comment = the id shown as "comment #<id>" in get_issue.',
  write: true,
  input: z.object({ project: projectArg, issue: issueArg, comment: z.number().int().positive(), markdown: z.string().min(1).max(20_000) }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [['PATCH', `/issues/${n}/comments/${a.comment}`]]);
    await issues.editComment(ctx.userId, p.id, n, a.comment, docOf(a.markdown));
    await touchLease(ctx, await issueIdOf(p.id, n));
    return { issue: key, edited: a.comment };
  },
});

const commentDelete = defineTool({
  name: 'comment_delete', title: 'Delete a comment', group: 'issues',
  description: 'DESTRUCTIVE: deletes a comment of an issue (your own; project admins may delete others\' as on the web). comment = "comment #<id>" from get_issue. The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, issue: issueArg, comment: z.number().int().positive() }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete comments');
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [['DELETE', `/issues/${n}/comments/${a.comment}`]]);
    await issues.deleteComment(ctx.userId, p.id, n, a.comment);
    return { issue: key, deleted: a.comment };
  },
});

const attachmentDelete = defineTool({
  name: 'attachment_delete', title: 'Delete an attachment', group: 'issues',
  description: 'DESTRUCTIVE: deletes a file attached to an issue (id "#<id>" from the Attachments section of get_issue). The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, attachment: z.number().int().positive() }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete files');
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['DELETE', `/attachments/${a.attachment}`]]);
    const f = await prisma.workAttachment.findFirst({ where: { id: a.attachment, issue: { projectId: p.id } }, select: { fileName: true } });
    await issues.deleteAttachment(ctx.userId, p.id, a.attachment);
    return { deleted: a.attachment, file: f?.fileName ?? null };
  },
});

const webLinkRemove = defineTool({
  name: 'issue_web_link_remove', title: 'Remove a web link from an issue', group: 'issues',
  description: 'Removes a web link from the issue\'s Web links — by its URL (or link id).',
  write: true,
  input: z.object({ project: projectArg, issue: issueArg, url: z.string().min(4).max(2100).optional(), id: z.number().int().positive().optional() }),
  run: async (ctx, a) => {
    if (!a.url && !a.id) throw new BadRequestError('Pass the url (or id) of the link', 'VALIDATION_ERROR');
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [['DELETE', `/issues/${n}/web-links/1`]]);
    let id = a.id;
    if (!id) {
      const want = a.url!.trim().replace(/\/+$/, '');
      const rows = await prisma.workIssueWebLink.findMany({ where: { issue: { projectId: p.id, number: n, deletedAt: null } }, select: { id: true, url: true } });
      const hit = rows.filter((r) => r.url.replace(/\/+$/, '') === want);
      if (hit.length !== 1) throw new NotFoundError(`No web link ${a.url} on ${key}`);
      id = hit[0].id;
    }
    await resources.deleteWebLink(ctx.userId, p.id, n, id);
    return { issue: key, removed: id };
  },
});

const customFieldsSet = defineTool({
  name: 'issue_custom_fields_set', title: 'Set custom fields of an issue', group: 'issues',
  description: 'Sets custom fields of an issue by field NAME (as shown under "Custom fields" in get_issue, e.g. "Acceptance criteria"). null clears a field. Values follow the field type (text, number, date YYYY-MM-DD, option name, list).',
  write: true,
  input: z.object({
    project: projectArg, issue: issueArg,
    fields: z.array(z.object({ field: z.string().min(1).max(120).describe('Field name'), value: z.union([z.string().max(20_000), z.number(), z.boolean(), z.array(z.string().max(200)).max(50)]).nullable() })).min(1).max(30),
  }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [['PUT', `/issues/${n}/custom-values`]]);
    const defs = await prisma.workCustomField.findMany({ where: { projectId: p.id }, select: { id: true, name: true } });
    const values: Record<string, unknown> = {};
    for (const { field: name, value: v } of a.fields) {
      const f = defs.find((d) => d.name.trim().toLowerCase() === name.trim().toLowerCase()) ?? (/^\d+$/.test(name) ? defs.find((d) => d.id === Number(name)) : undefined);
      if (!f) throw new AppError(`Unknown custom field "${name}". Fields: ${defs.map((d) => d.name).join(', ') || '(none)'}`, 400, 'WORK_BAD_FIELD');
      values[String(f.id)] = v;
    }
    if (!Object.keys(values).length) throw new BadRequestError('Pass at least one field', 'VALIDATION_ERROR');
    await custom.setCustomValues(ctx.userId, p.id, n, values);
    await touchLease(ctx, await issueIdOf(p.id, n));
    return { issue: key, set: a.fields.map((f) => f.field) };
  },
});

const worklogDelete = defineTool({
  name: 'worklog_delete', title: 'Delete a work log', group: 'planning',
  description: 'DESTRUCTIVE: deletes a work log of an issue (id from worklog_list) — yours, or anyone\'s if your role allows it on the web. Weeks already submitted in a timesheet are locked. The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, issue: issueArg, worklog: z.number().int().positive() }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete work logs');
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [['DELETE', `/issues/${n}/worklogs/${a.worklog}`]]);
    await planning.deleteWorklog(ctx.userId, p.id, n, a.worklog);
    return { issue: key, deleted: a.worklog };
  },
});

// ═══ Sprint ══════════════════════════════════════════════════════

async function sprintOf(ctx: McpCtx, projectId: number, ref: string | number): Promise<number> {
  const id = await sprintIdOf(ctx, projectId, ref);
  if (!id) throw new BadRequestError('Name a sprint (not the backlog)', 'VALIDATION_ERROR');
  return id;
}

const sprintUpdate = defineTool({
  name: 'sprint_update', title: 'Edit a sprint', group: 'planning',
  description: 'Edits a sprint that is not completed: name, goal, start/end date. Needs sprint management (project admin, or members when the project allows it).',
  write: true, personOnly: true, surfaces: { builtin: false },
  input: z.object({
    project: projectArg, sprint: sprintRefArg.describe('"active" | "next" | sprint name | id'),
    name: z.string().min(1).max(100).optional(), goal: z.string().max(5000).nullable().optional(), startDate: ymd.nullable().optional(), endDate: ymd.nullable().optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'manage sprints');
    requireWrite(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const sid = await sprintOf(ctx, p0.id, a.sprint);
    const p = await projectFor(ctx, a.project, [['PATCH', `/sprints/${sid}`]]);
    const d = (v: string | null | undefined) => (v === undefined ? undefined : v === null ? null : new Date(`${v}T00:00:00.000Z`));
    const s = await sprints.updateSprint(ctx.userId, p.id, sid, { name: a.name, goal: a.goal, startAt: d(a.startDate), endAt: d(a.endDate) });
    return { sprint: { id: sid, name: (s as { name?: string }).name ?? a.name ?? null } };
  },
});

const sprintDelete = defineTool({
  name: 'sprint_delete', title: 'Delete a sprint', group: 'planning',
  description: 'DESTRUCTIVE: deletes a sprint that has not started; its issues go back to the backlog. The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, sprint: sprintRefArg }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'manage sprints');
    requireWrite(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const sid = await sprintOf(ctx, p0.id, a.sprint);
    const p = await projectFor(ctx, a.project, [['DELETE', `/sprints/${sid}`]]);
    await sprints.deleteSprint(ctx.userId, p.id, sid);
    return { deleted: sid };
  },
});

// ═══ Docs ════════════════════════════════════════════════════════

const pageUpdate = defineTool({
  name: 'docs_page_update', title: 'Edit a Docs page', group: 'docs',
  description: 'Edits a Docs page: new title, and/or REPLACES the whole content with Markdown (for one section use docs_update_section), and/or status DRAFT / IN_REVIEW / ARCHIVED (approving a page is done by a person in Approvals). Saves a new page version; the old one can be restored from the page history.',
  write: true,
  input: z.object({
    project: projectArg, page: z.number().int().positive(),
    title: z.string().min(1).max(255).optional(), markdown: z.string().min(1).max(60_000).optional(),
    status: z.enum(['DRAFT', 'IN_REVIEW', 'ARCHIVED']).optional(), versionNote: z.string().max(500).optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    if (a.title === undefined && a.markdown === undefined && a.status === undefined) throw new BadRequestError('Pass title, markdown or status', 'VALIDATION_ERROR');
    const p = await projectFor(ctx, a.project, [['PATCH', `/pages/${a.page}`]]);
    const cur = await pages.getPage(ctx.userId, p.id, a.page) as { title: string; version: number };
    const content = a.markdown !== undefined ? markdownToTiptap(a.markdown, { dropTitle: /^\s*#\s+/.test(a.markdown) && (a.title ?? cur.title).trim() === (/^\s*#\s+(.+?)\s*#*\s*$/m.exec(a.markdown)?.[1] ?? '').trim() }).doc : undefined;
    const r = await pages.updatePage(ctx.userId, p.id, a.page, {
      ...(a.title !== undefined ? { title: a.title } : {}), ...(content ? { contentJson: content } : {}), ...(a.status ? { status: a.status } : {}),
      baseVersion: cur.version, ...(a.versionNote ? { versionNote: a.versionNote } : {}), aiAssisted: true,
    }) as { version?: number; status?: string; title?: string };
    return { page: a.page, title: r.title ?? a.title ?? cur.title, status: r.status ?? null, version: r.version ?? null, url: `/work/${p.workspaceSlug}/${p.key}/docs/${a.page}` };
  },
});

const pageMove = defineTool({
  name: 'docs_page_move', title: 'Move a Docs page', group: 'docs',
  description: 'Moves a Docs page in the page tree: parent = page number to nest it under (null = top level), position = 1-based place among its siblings (default last).',
  write: true,
  input: z.object({ project: projectArg, page: z.number().int().positive(), parent: z.number().int().positive().nullable(), position: z.number().int().min(1).max(10_000).optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', `/pages/${a.page}/move`]]);
    await pages.movePage(ctx.userId, p.id, a.page, { parentNumber: a.parent, index: a.position !== undefined ? a.position - 1 : 10_000 });
    return { moved: a.page, parent: a.parent };
  },
});

const pageDelete = defineTool({
  name: 'docs_page_delete', title: 'Delete a Docs page (to trash)', group: 'docs',
  description: 'DESTRUCTIVE: moves a Docs page (and its sub-pages) to the Docs trash — only the page owner or a project admin, as on the web. Restore with docs_page_restore. The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, page: z.number().int().positive() }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete pages');
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['DELETE', `/pages/${a.page}`]]);
    const r = await pages.deletePage(ctx.userId, p.id, a.page);
    return { deleted: a.page, result: r ?? null, restore: `docs_page_restore {page: ${a.page}}` };
  },
});

const pageRestore = defineTool({
  name: 'docs_page_restore', title: 'Restore a Docs page from the trash', group: 'docs',
  description: 'Restores a deleted Docs page from the Docs trash.',
  write: true, personOnly: true, surfaces: { ask: false, builtin: false },
  input: z.object({ project: projectArg, page: z.number().int().positive() }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'restore pages');
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', `/trash/pages/${a.page}/restore`]]);
    await pageTrash.restorePage(ctx.userId, p.id, a.page);
    return { restored: a.page, url: `/work/${p.workspaceSlug}/${p.key}/docs/${a.page}` };
  },
});

// ═══ Xray ════════════════════════════════════════════════════════

const testNum = z.union([z.number().int().positive(), z.string().min(1).max(40)]).describe('Test issue number or key');

const testUpdate = defineTool({
  name: 'test_update', title: 'Edit a test case', group: 'tests',
  description: 'Edits a test case (TEST issue): title, preconditions, steps (REPLACES all steps), requirements it verifies (issue keys, replaces the set), priority 1–5. Only the fields you pass change.',
  write: true,
  input: z.object({
    project: projectArg, test: testNum, title: z.string().min(1).max(255).optional(), preconditions: z.string().max(10_000).nullable().optional(),
    steps: z.array(z.object({ action: z.string().min(1).max(5000), data: z.string().max(5000).nullable().optional(), expected: z.string().max(5000).nullable().optional() })).max(100).optional(),
    requirements: z.array(z.string().min(1).max(20)).max(50).optional().describe('Issue keys, e.g. ["FP-3"]'),
    priority: z.number().int().min(PRIORITY_MIN).max(PRIORITY_MAX).optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const head = String(a.project).trim();
    const n = issueNumber((head.includes('/') ? head.split('/')[1] : head).toUpperCase(), a.test);
    const p = await projectFor(ctx, a.project, [['PUT', `/tests/${n}`]]);
    const t = await tests.updateTest(ctx.userId, p.id, n, {
      title: a.title, preconditions: a.preconditions, priority: a.priority,
      ...(a.steps ? { steps: a.steps.map((s) => ({ action: s.action, data: s.data ?? null, expected: s.expected ?? null })) } : {}),
      ...(a.requirements ? { requirementKeys: a.requirements.map((k) => (/^\d+$/.test(k.trim()) ? `${p.key}-${k.trim()}` : k.trim().toUpperCase())) } : {}),
    });
    return { updated: `${p.key}-${n}`, steps: (t as { steps?: unknown[] }).steps?.length ?? null };
  },
});

const cycleUpdate = defineTool({
  name: 'test_cycle_update', title: 'Edit a test cycle', group: 'tests',
  description: 'Edits a test cycle: name, environment, build, state (e.g. ACTIVE / DONE), add tests (issue numbers ⇒ new runs) or remove runs (run ids from test_cycles).',
  write: true,
  input: z.object({
    project: projectArg, cycle: z.number().int().positive(), name: z.string().min(1).max(120).optional(), environment: z.string().max(120).nullable().optional(),
    build: z.string().max(80).nullable().optional(), state: z.enum(tests.CYCLE_STATES).optional(),
    addTests: z.array(z.number().int().positive()).max(500).optional(), removeRuns: z.array(z.number().int().positive()).max(500).optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['PATCH', `/test-cycles/${a.cycle}`]]);
    const r = await tests.updateCycle(ctx.userId, p.id, a.cycle, { name: a.name, environment: a.environment, build: a.build, state: a.state, addNumbers: a.addTests, removeRunIds: a.removeRuns });
    return { cycle: a.cycle, runs: r.runs };
  },
});

const cycleDelete = defineTool({
  name: 'test_cycle_delete', title: 'Delete a test cycle', group: 'tests',
  description: 'DESTRUCTIVE: deletes a test cycle with all its runs and step results (the test cases stay). The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, cycle: z.number().int().positive() }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete test data');
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['DELETE', `/test-cycles/${a.cycle}`]]);
    await tests.deleteCycle(ctx.userId, p.id, a.cycle);
    return { deleted: a.cycle };
  },
});

const runDefect = defineTool({
  name: 'test_run_defect', title: 'Create / link / unlink a defect of a test run', group: 'tests',
  description: 'action "create": files a new Bug from a failed test run (optional title, failed step id, priority, assignee) and links it. "link" / "unlink": links or unlinks an existing bug (issue number) to the run.',
  write: true,
  input: z.object({
    project: projectArg, run: z.number().int().positive(), action: z.enum(['create', 'link', 'unlink']),
    bug: issueArg.optional().describe('link/unlink: the bug issue'), title: z.string().max(255).optional(), step: z.number().int().positive().optional().describe('create: step result id'),
    priority: z.number().int().min(PRIORITY_MIN).max(PRIORITY_MAX).optional(), assignee: z.string().max(254).optional().describe('"me" | username'),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    if (a.action === 'create') {
      const p = await projectFor(ctx, a.project, [['POST', `/test-runs/${a.run}/defects`]]);
      const assigneeId = a.assignee !== undefined ? await assigneeIdOf(ctx, p, a.assignee) : undefined;
      const d = await tests.createDefect(ctx.userId, p.id, a.run, { title: a.title, stepResultId: a.step ?? null, priority: a.priority, assigneeId }) as { number?: number };
      return { created: d.number ? `${p.key}-${d.number}` : d, run: a.run };
    }
    if (a.bug === undefined) throw new BadRequestError('Pass the bug issue to link/unlink', 'VALIDATION_ERROR');
    const p0 = await projectFor(ctx, a.project, []);
    const n = issueNumber(p0.key, a.bug);
    const p = await projectFor(ctx, a.project, [[a.action === 'link' ? 'PUT' : 'DELETE', `/test-runs/${a.run}/defects/${n}`]]);
    if (a.action === 'link') await tests.linkDefect(ctx.userId, p.id, a.run, n);
    else await tests.unlinkDefect(ctx.userId, p.id, a.run, n);
    return { [a.action === 'link' ? 'linked' : 'unlinked']: `${p.key}-${n}`, run: a.run };
  },
});

// ═══ RAID · họp · Q&A · sơ đồ · chat ═════════════════════════════

const raidDelete = defineTool({
  name: 'raid_delete', title: 'Delete a RAID item', group: 'planning',
  description: 'DESTRUCTIVE: deletes a risk / assumption / issue / dependency from the RAID log (owner or project admin, as on the web). The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, item: numRef('RAID item') }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete RAID items');
    requireWrite(ctx);
    const n = numOf(a.item, 'RAID item');
    const p = await projectFor(ctx, a.project, [['DELETE', `/raid/${n}`]]);
    await raid.deleteRaid(ctx.userId, p.id, n);
    return { deleted: n };
  },
});

const meetingFields = {
  type: z.enum(MEETING_TYPES).optional(), location: z.string().max(255).nullable().optional(), meetingUrl: z.string().max(500).nullable().optional(),
  agenda: z.string().max(30_000).nullable().optional().describe('Markdown'), minutes: z.string().max(60_000).nullable().optional().describe('Markdown'),
  decisions: z.array(z.string().max(500)).max(50).optional(), timezone: z.string().max(64).optional().describe('IANA, e.g. Asia/Ho_Chi_Minh'),
};
const dt = z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'ISO date-time, e.g. 2026-10-22T14:00:00+07:00');
function meetingInput(a: { type?: (typeof MEETING_TYPES)[number]; location?: string | null; meetingUrl?: string | null; agenda?: string | null; minutes?: string | null; decisions?: string[]; timezone?: string }): meetings.MeetingInput {
  return {
    ...(a.type ? { type: a.type } : {}), ...(a.location !== undefined ? { location: a.location } : {}), ...(a.meetingUrl !== undefined ? { meetingUrl: a.meetingUrl } : {}),
    ...(a.agenda !== undefined ? { agendaJson: a.agenda === null ? null : docOf(a.agenda) } : {}),
    ...(a.minutes !== undefined ? { minutesJson: a.minutes === null ? null : docOf(a.minutes) } : {}),
    ...(a.decisions ? { decisions: a.decisions } : {}), ...(a.timezone ? { timezone: a.timezone } : {}),
  };
}

const meetingCreate = defineTool({
  name: 'meeting_create', title: 'Schedule a meeting', group: 'planning',
  description: 'Schedules a project meeting (title, start/end ISO time, type, location or meeting URL, agenda in Markdown, attendees by username). sendInvites=true also notifies/e-mails the attendees (team members) — only when the user asked for it.',
  write: true, surfaces: { builtin: false },
  input: z.object({
    project: projectArg, title: z.string().min(1).max(255), start: dt, end: dt, ...meetingFields,
    attendees: z.array(z.string().min(1).max(254)).max(100).optional().describe('Usernames ("me" for yourself)'), sendInvites: z.boolean().optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/meetings']]);
    const attendeeIds = a.attendees ? (await Promise.all(a.attendees.map((u) => assigneeIdOf(ctx, p, u)))).filter((x): x is number => !!x) : undefined;
    const m = await meetings.createMeeting(ctx.userId, p.id, {
      ...meetingInput(a), title: a.title, startsAt: new Date(a.start), endsAt: new Date(a.end), attendeeIds, sendInvites: a.sendInvites === true,
    }) as { number: number };
    return { created: m.number, url: `/work/${p.workspaceSlug}/${p.key}/meetings/${m.number}` };
  },
});

const meetingUpdate = defineTool({
  name: 'meeting_update', title: 'Edit a meeting', group: 'planning',
  description: 'Edits a meeting: title, time, status (SCHEDULED / DONE / CANCELLED), type, location / URL, agenda or minutes (Markdown, replaces), decisions (replaces the list). Action items: meeting_add_actions.',
  write: true,
  input: z.object({ project: projectArg, meeting: numRef('Meeting'), title: z.string().min(1).max(255).optional(), start: dt.optional(), end: dt.optional(), status: z.enum(MEETING_STATUSES).optional(), ...meetingFields }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const n = numOf(a.meeting, 'meeting');
    const p = await projectFor(ctx, a.project, [['PATCH', `/meetings/${n}`]]);
    const input: meetings.MeetingInput = {
      ...meetingInput(a), ...(a.title ? { title: a.title } : {}), ...(a.status ? { status: a.status } : {}),
      ...(a.start ? { startsAt: new Date(a.start) } : {}), ...(a.end ? { endsAt: new Date(a.end) } : {}),
    };
    if (!Object.keys(input).length) throw new BadRequestError('Nothing to change', 'VALIDATION_ERROR');
    await meetings.updateMeeting(ctx.userId, p.id, n, input);
    return { updated: n, fields: Object.keys(input) };
  },
});

const meetingDelete = defineTool({
  name: 'meeting_delete', title: 'Delete a meeting', group: 'planning',
  description: 'DESTRUCTIVE: deletes a meeting with its agenda, minutes and action items (organizer or project admin). To keep the record use meeting_update status CANCELLED instead. The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, meeting: numRef('Meeting') }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete meetings');
    requireWrite(ctx);
    const n = numOf(a.meeting, 'meeting');
    const p = await projectFor(ctx, a.project, [['DELETE', `/meetings/${n}`]]);
    await meetings.deleteMeeting(ctx.userId, p.id, n);
    return { deleted: n };
  },
});

const qnaUpdate = defineTool({
  name: 'qna_update', title: 'Edit a Q&A question', group: 'planning',
  description: 'Edits a Q&A log entry: question, details, asked on/by/to, priority, due date, status, answer. Only the fields you pass change.',
  write: true,
  input: z.object({
    project: projectArg, question: numRef('Question'), text: z.string().min(1).max(255).optional().describe('The question itself'), details: z.string().max(10_000).nullable().optional(),
    askedOn: ymd.optional(), askedBy: z.string().max(120).nullable().optional(), askedTo: z.string().max(120).nullable().optional(),
    priority: z.enum(QA_PRIORITIES).optional(), due: ymd.nullable().optional(), status: z.enum(QUESTION_STATUSES).optional(), answer: z.string().max(20_000).nullable().optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const n = numOf(a.question, 'question');
    const p = await projectFor(ctx, a.project, [['PATCH', `/qna/${n}`]]);
    const { project: _p, question: _q, text, ...rest } = a;
    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rest)) if (v !== undefined) patch[k] = v;
    if (text !== undefined) patch.question = text;
    if (!Object.keys(patch).length) throw new BadRequestError('Nothing to change', 'VALIDATION_ERROR');
    const q = await qna.updateQuestion(ctx.userId, p.id, n, qna.questionInput.partial().parse(patch));
    return { question: q.key, status: q.statusText };
  },
});

const qnaDelete = defineTool({
  name: 'qna_delete', title: 'Delete a Q&A question', group: 'planning',
  description: 'DESTRUCTIVE: deletes a question from the Q&A log. The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, question: numRef('Question') }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete questions');
    requireWrite(ctx);
    const n = numOf(a.question, 'question');
    const p = await projectFor(ctx, a.project, [['DELETE', `/qna/${n}`]]);
    await qna.deleteQuestion(ctx.userId, p.id, n);
    return { deleted: n };
  },
});

const diagramDelete = defineTool({
  name: 'diagram_delete', title: 'Delete a diagram', group: 'docs',
  description: 'DESTRUCTIVE: deletes a diagram (ERD, use case, flow…) with its versions. The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, diagram: numRef('Diagram') }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete diagrams');
    requireWrite(ctx);
    const n = numOf(a.diagram, 'diagram');
    const p = await projectFor(ctx, a.project, [['DELETE', `/diagrams/${n}`]]);
    await dg.deleteDiagram(ctx.userId, p.id, n);
    return { deleted: n };
  },
});

const channelArg = z.string().max(60).optional().describe('Channel name (default "general")');

const chatEdit = defineTool({
  name: 'chat_edit', title: 'Edit a chat message', group: 'chat',
  description: 'Edits one of YOUR messages in a project chat channel (message id "#<id>" from chat_read).',
  write: true,
  input: z.object({ project: projectArg, channel: channelArg, message: z.number().int().positive(), text: z.string().min(1).max(8000) }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, []);
    const ch = await chat.channelByName(ctx.userId, p.id, a.channel);
    await chat.editMessage(ctx.userId, p.id, ch.id, a.message, a.text);
    return { edited: a.message, channel: ch.name };
  },
});

const chatDelete = defineTool({
  name: 'chat_delete', title: 'Delete a chat message', group: 'chat',
  description: 'DESTRUCTIVE: deletes a chat message (your own; channel/project admins as on the web). The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, channel: channelArg, message: z.number().int().positive() }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete chat messages');
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, []);
    const ch = await chat.channelByName(ctx.userId, p.id, a.channel);
    await chat.deleteMessage(ctx.userId, p.id, ch.id, a.message);
    return { deleted: a.message, channel: ch.name };
  },
});

// ═══ Resources ═══════════════════════════════════════════════════

async function resourceIdOf(projectId: number, ref: number | string): Promise<number> {
  if (typeof ref === 'number') return ref;
  const want = ref.trim().replace(/\/+$/, '');
  const rows = await prisma.workResource.findMany({ where: { projectId }, select: { id: true, url: true } });
  const hit = rows.filter((r) => r.url.replace(/\/+$/, '') === want);
  if (hit.length !== 1) throw new NotFoundError(`No resource with URL ${ref} — call project_resources`);
  return hit[0].id;
}
const resourceRef = z.union([z.number().int().positive(), z.string().min(4).max(2100)]).describe('Resource id or its URL');
const resourceFields = {
  title: z.string().max(300).nullable().optional(), description: z.string().max(4000).nullable().optional(),
  tags: z.array(z.string().min(1).max(40)).max(20).optional(), pinned: z.boolean().optional(),
};

const resourceAdd = defineTool({
  name: 'resource_add', title: 'Add a link to Resources', group: 'docs',
  description: 'Adds a link to the project Resources (the team link library): repo, Figma, slides, guide… Title is filled from the page when omitted.',
  write: true,
  input: z.object({ project: projectArg, url: z.string().min(4).max(2100), ...resourceFields }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/resources']]);
    const r = await resources.createResource(ctx.userId, p.id, { url: a.url, title: a.title, description: a.description, tags: a.tags, pinned: a.pinned }) as { id: number; title: string };
    return { created: r.id, title: r.title };
  },
});

const resourceUpdate = defineTool({
  name: 'resource_update', title: 'Edit a resource', group: 'docs',
  description: 'Edits a project resource (by id or URL): new URL, title, description, tags, pinned.',
  write: true,
  input: z.object({ project: projectArg, resource: resourceRef, url: z.string().min(4).max(2100).optional(), ...resourceFields }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const id = await resourceIdOf(p0.id, a.resource);
    const p = await projectFor(ctx, a.project, [['PATCH', `/resources/${id}`]]);
    const { project: _p, resource: _r, ...patch } = a;
    await resources.updateResource(ctx.userId, p.id, id, patch);
    return { updated: id };
  },
});

const resourceDelete = defineTool({
  name: 'resource_delete', title: 'Delete a resource', group: 'docs',
  description: 'DESTRUCTIVE: removes a link from the project Resources (by id or URL). The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, resource: resourceRef }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete resources');
    requireWrite(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const id = await resourceIdOf(p0.id, a.resource);
    const p = await projectFor(ctx, a.project, [['DELETE', `/resources/${id}`]]);
    await resources.deleteResource(ctx.userId, p.id, id);
    return { deleted: id };
  },
});

// ═══ Repo mã nguồn của dự án ═════════════════════════════════════

interface Repo { source: string; host: string; path: string; web: string; cloneHttps: string; cloneSsh: string; defaultBranch: string | null; description?: string | null }

function repoOfUrl(url: string, source: string): Repo | null {
  const gh = githubRepoOf(url);
  if (gh) return { source, host: 'github.com', path: `${gh.owner}/${gh.repo}`, web: gh.canonical, cloneHttps: `${gh.canonical}.git`, cloneSsh: `git@github.com:${gh.owner}/${gh.repo}.git`, defaultBranch: null };
  let u: URL;
  try { u = new URL(url); } catch { return null; }
  const host = u.hostname.toLowerCase().replace(/^www\./, '');
  if (host !== 'gitlab.com' && host !== 'bitbucket.org') return null;
  const parts = u.pathname.split('/').filter(Boolean);
  const cut = parts.indexOf('-');
  const segs = (cut >= 0 ? parts.slice(0, cut) : parts).map((s) => s.replace(/\.git$/i, ''));
  if (segs.length < 2 || (host === 'bitbucket.org' && segs.length !== 2)) return null;
  const path = (host === 'bitbucket.org' ? segs.slice(0, 2) : segs).join('/');
  return { source, host, path, web: `https://${host}/${path}`, cloneHttps: `https://${host}/${path}.git`, cloneSsh: `git@${host}:${path}.git`, defaultBranch: null };
}

const projectRepos = defineTool({
  name: 'project_repos', title: 'Code repositories of the project', group: 'issues',
  description: 'Lists the project\'s code repositories — the GitHub/GitLab repo connected on the Code page and repo links in Resources — with web URL, HTTPS/SSH clone URL and default branch. Use it when the folder you have open is not a checkout of this project: check `git remote -v`, then offer the user to clone it (git clone <cloneHttps>) instead of saying the code cannot be found.',
  write: false, surfaces: { ask: false, builtin: false },
  input: z.object({ project: projectArg }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/resources']]);
    const [gh, gl, res] = await Promise.all([
      prisma.workGithubConnection.findUnique({ where: { projectId: p.id }, select: { repoFullName: true } }),
      prisma.workGitlabConnection.findUnique({ where: { projectId: p.id }, select: { repoPath: true, config: true } }),
      prisma.workResource.findMany({ where: { projectId: p.id, kind: { in: ['github', 'gitlab', 'bitbucket'] } }, select: { url: true, title: true, meta: true }, take: 50 }),
    ]);
    const out: Repo[] = [];
    const seen = new Set<string>();
    const add = (r: Repo | null, meta?: unknown) => {
      if (!r) return;
      const k = `${r.host}/${r.path}`.toLowerCase();
      if (seen.has(k)) return;
      seen.add(k);
      const m = (meta as { github?: { defaultBranch?: string | null; description?: string | null } } | null)?.github;
      if (m?.defaultBranch) r.defaultBranch = m.defaultBranch;
      if (m?.description) r.description = m.description;
      out.push(r);
    };
    if (gh?.repoFullName) add(repoOfUrl(`https://github.com/${gh.repoFullName}`, 'Code page (GitHub connection)'));
    if (gl?.repoPath) {
      const webBase = String((gl.config as { webBase?: unknown } | null)?.webBase ?? 'https://gitlab.com').replace(/\/+$/, '');
      const host = (() => { try { return new URL(webBase).hostname; } catch { return 'gitlab.com'; } })();
      add({ source: 'Code page (GitLab connection)', host, path: gl.repoPath, web: `${webBase}/${gl.repoPath}`, cloneHttps: `${webBase}/${gl.repoPath}.git`, cloneSsh: `git@${host}:${gl.repoPath}.git`, defaultBranch: null });
    }
    for (const r of res) add(repoOfUrl(r.url, `Resources: ${r.title}`), r.meta);
    // Nhánh mặc định GitHub (repo công khai; có bộ đệm) — lỗi mạng thì để trống, không làm hỏng lệnh.
    await Promise.all(out.filter((r) => r.host === 'github.com' && !r.defaultBranch).slice(0, 5).map(async (r) => {
      const [o, n] = r.path.split('/');
      const m = await githubMeta(o, n).catch(() => null);
      if (m?.defaultBranch) r.defaultBranch = m.defaultBranch;
      if (m?.description && !r.description) r.description = m.description;
    }));
    if (!out.length) return `No code repository is linked to ${p.key} (no GitHub/GitLab connection on the Code page and no repo link in Resources). Ask the user for the repo URL; a project admin can add it in Resources or connect it on the Code page.`;
    return `${out.length} repo(s) of ${p.key}. If the open folder is not one of them (compare \`git remote -v\`), offer to clone: git clone <cloneHttps> (private repos need the user's own Git login).\n${untrusted('project repositories', json(out))}`;
  },
});

// ═══ SRS (Report 3): sửa / xoá actor, use case, business rule, màn hình, chức năng không UI ═══
// Trạng thái APPROVED KHÔNG có ở đây — duyệt yêu cầu là việc của người (nút Approve / Approvals).

async function srsIdByName(model: 'actor' | 'screen' | 'function', projectId: number, ref: number | string): Promise<number> {
  if (typeof ref === 'number') return ref;
  if (/^\d+$/.test(ref.trim())) return Number(ref.trim());
  const where = { projectId, name: { equals: ref.trim(), mode: 'insensitive' as const } };
  const hits = model === 'actor' ? await prisma.workSrsActor.findMany({ where, select: { id: true } })
    : model === 'screen' ? await prisma.workSrsScreen.findMany({ where, select: { id: true } })
      : await prisma.workSrsFunction.findMany({ where, select: { id: true } });
  if (hits.length !== 1) throw new NotFoundError(`${hits.length ? 'Several' : 'No'} SRS ${model}s called "${ref}" — use the id from srs_get`);
  return hits[0].id;
}
const nameOrId = (what: string) => z.union([z.number().int().positive(), z.string().min(1).max(200)]).describe(`${what} id (from srs_get) or exact name`);
const SRS_PATH = { actor: 'actors', use_case: 'use-cases', rule: 'rules', screen: 'screens', function: 'functions' } as const;

async function srsRef(projectId: number, kind: keyof typeof SRS_PATH, ref: number | string): Promise<number> {
  if (kind === 'use_case') return numOf(ref, 'use case (UC-03)');
  if (kind === 'rule') return numOf(ref, 'business rule (BR-02)');
  return srsIdByName(kind, projectId, ref);
}

function srsPatch(a: Record<string, unknown>, drop: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(a)) if (!drop.includes(k) && v !== undefined) out[k] = v;
  if (!Object.keys(out).length) throw new BadRequestError('Nothing to change — pass at least one field', 'VALIDATION_ERROR');
  return out;
}

const srsActorUpdate = defineTool({
  name: 'srs_actor_update', title: 'Edit an SRS actor', group: 'srs',
  description: 'Edits an actor of the SRS (Report 3): name, description, kind PERSON/SYSTEM, position.',
  write: true,
  input: srs.actorInput.partial().extend({ project: projectArg, actor: nameOrId('Actor') }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const id = await srsRef(p0.id, 'actor', a.actor);
    const p = await projectFor(ctx, a.project, [['PATCH', `/srs/actors/${id}`]]);
    await srs.updateActor(ctx.userId, p.id, id, srsPatch(a, ['project', 'actor']));
    return { updated: `actor #${id}` };
  },
});

const srsUseCaseUpdate = defineTool({
  name: 'srs_use_case_update', title: 'Edit a use case', group: 'srs',
  description: 'Edits a use case (UC-03): name, feature, actors (ids), trigger, description, pre/postconditions, normal / alternative / exception flows (text), priority, linked issue, business rules. Approving a use case is done by a person on the web.',
  write: true,
  input: srs.useCaseInput.omit({ status: true }).partial().extend({ project: projectArg, useCase: numRef('Use case (UC-03)') }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const n = numOf(a.useCase, 'use case (UC-03)');
    const p = await projectFor(ctx, a.project, [['PATCH', `/srs/use-cases/${n}`]]);
    await srs.updateUseCase(ctx.userId, p.id, n, srsPatch(a, ['project', 'useCase']));
    return { updated: `UC-${String(n).padStart(2, '0')}` };
  },
});

const srsRuleUpdate = defineTool({
  name: 'srs_rule_update', title: 'Edit a business rule', group: 'srs',
  description: 'Edits a business rule (BR-02): name, definition, category. Approving it is done by a person on the web.',
  write: true,
  input: srs.ruleInput.omit({ status: true }).partial().extend({ project: projectArg, rule: numRef('Business rule (BR-02)') }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const n = numOf(a.rule, 'business rule (BR-02)');
    const p = await projectFor(ctx, a.project, [['PATCH', `/srs/rules/${n}`]]);
    await srs.updateRule(ctx.userId, p.id, n, srsPatch(a, ['project', 'rule']));
    return { updated: `BR-${String(n).padStart(2, '0')}` };
  },
});

const srsScreenUpdate = defineTool({
  name: 'srs_screen_update', title: 'Edit a screen', group: 'srs',
  description: 'Edits a screen of the SRS: name, feature, description, position, linked issue, next screens (linksTo, replaces the list) and actors allowed (actorIds, replaces the list).',
  write: true,
  input: srs.screenInput.partial().extend({ project: projectArg, screen: nameOrId('Screen') }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const id = await srsRef(p0.id, 'screen', a.screen);
    const p = await projectFor(ctx, a.project, [['PATCH', `/srs/screens/${id}`]]);
    await srs.updateScreen(ctx.userId, p.id, id, srsPatch(a, ['project', 'screen']));
    return { updated: `screen #${id}` };
  },
});

const srsFunctionUpdate = defineTool({
  name: 'srs_function_update', title: 'Edit a non-UI function', group: 'srs',
  description: 'Edits a non-UI function of the SRS (batch job, API, scheduler…): name, feature, description, position, linked issue.',
  write: true,
  input: srs.functionInput.partial().extend({ project: projectArg, fn: nameOrId('Non-UI function') }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const id = await srsRef(p0.id, 'function', a.fn);
    const p = await projectFor(ctx, a.project, [['PATCH', `/srs/functions/${id}`]]);
    await srs.updateFunction(ctx.userId, p.id, id, srsPatch(a, ['project', 'fn']));
    return { updated: `function #${id}` };
  },
});

const srsDelete = defineTool({
  name: 'srs_delete', title: 'Delete an SRS item', group: 'srs',
  description: 'DESTRUCTIVE: deletes an SRS item — kind actor | use_case (UC-03) | rule (BR-02) | screen | function (non-UI) — by id/number or exact name. The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, kind: z.enum(['actor', 'use_case', 'rule', 'screen', 'function']), item: z.union([z.number().int().positive(), z.string().min(1).max(200)]) }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete requirements');
    requireWrite(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const id = await srsRef(p0.id, a.kind, a.item);
    const p = await projectFor(ctx, a.project, [['DELETE', `/srs/${SRS_PATH[a.kind]}/${id}`]]);
    const fn = { actor: srs.deleteActor, use_case: srs.deleteUseCase, rule: srs.deleteRule, screen: srs.deleteScreen, function: srs.deleteFunction }[a.kind];
    await fn(ctx.userId, p.id, id);
    return { deleted: { kind: a.kind, id } };
  },
});

// ═══ Docs: liên kết thẻ, khôi phục phiên bản ═══

const pageLinkIssue = defineTool({
  name: 'docs_page_link_issue', title: 'Link / unlink an issue to a Docs page', group: 'docs',
  description: 'Links an issue to a Docs page (shows under "Linked issues" on both), or unlinks it with unlink=true.',
  write: true,
  input: z.object({ project: projectArg, page: z.number().int().positive(), issue: issueArg, unlink: z.boolean().optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const n = issueNumber(p0.key, a.issue);
    const p = await projectFor(ctx, a.project, [[a.unlink ? 'DELETE' : 'POST', a.unlink ? `/pages/${a.page}/issues/${n}` : `/pages/${a.page}/issues`]]);
    if (a.unlink) await pages.unlinkIssue(ctx.userId, p.id, a.page, n);
    else await pages.linkIssue(ctx.userId, p.id, a.page, n);
    return { page: a.page, [a.unlink ? 'unlinked' : 'linked']: `${p.key}-${n}` };
  },
});

const pageVersionRestore = defineTool({
  name: 'docs_page_version_restore', title: 'Restore an older version of a Docs page', group: 'docs',
  description: 'Restores version n of a Docs page (from the page history) as a new current version — the current text is kept in the history.',
  write: true,
  input: z.object({ project: projectArg, page: z.number().int().positive(), version: z.number().int().positive() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', `/pages/${a.page}/versions/${a.version}/restore`]]);
    await pages.restoreVersion(ctx.userId, p.id, a.page, a.version);
    return { page: a.page, restoredVersion: a.version };
  },
});

/** Chỉ MCP (xem `mcpOnly`): Ask AI / BUILTIN giữ nguyên bộ lệnh cũ. */
export const PARITY_COMMANDS: ToolDef[] = [
  issueDelete, issueRestore, issueClone, commentEdit, commentDelete, attachmentDelete, webLinkRemove, customFieldsSet, worklogDelete,
  sprintUpdate, sprintDelete,
  pageUpdate, pageMove, pageDelete, pageRestore, pageLinkIssue, pageVersionRestore,
  srsActorUpdate, srsUseCaseUpdate, srsRuleUpdate, srsScreenUpdate, srsFunctionUpdate, srsDelete,
  testUpdate, cycleUpdate, cycleDelete, runDefect,
  raidDelete, meetingCreate, meetingUpdate, meetingDelete, qnaUpdate, qnaDelete, diagramDelete, chatEdit, chatDelete,
  resourceAdd, resourceUpdate, resourceDelete,
  projectRepos,
].map(mcpOnly);
