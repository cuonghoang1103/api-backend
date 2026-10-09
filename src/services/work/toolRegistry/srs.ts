/**
 * Registry lệnh — CTW đợt 4 (09/10/2026): SRS có cấu trúc · RTM · defect log · Q&A · giờ theo Activity · Report 3/7.
 * Có trên cả MCP (AI ngoài) lẫn Ask AI (web) — lệnh GHI ở Ask AI chỉ là ĐỀ XUẤT tới khi người bấm Apply.
 *
 *   Đọc:  srs_get · srs_use_case_get · rtm_get · defect_log · qna_list · time_by_activity
 *   Ghi:  srs_propose_use_case / srs_propose_business_rule / srs_suggest_use_cases — UC/BR luôn vào trạng thái PROPOSED
 *         (người ADMIN/MEMBER/TEACHER duyệt ở trang Requirements; PROPOSED không bao giờ vào bản xuất);
 *         srs_add_actor · srs_add_screen · srs_set_screen_access · srs_add_non_ui_function · trace_link_add ·
 *         defect_set · spec_finding_to_bug · qna_ask · qna_answer · worklog_set_activity · report3_fill_page ·
 *         final_report_assemble.
 * Mỗi lệnh: `projectFor` với tuyến REST tương đương (rào chắn agent + cổng khách như REST) rồi gọi THẲNG service.
 */

import { z } from 'zod';
import { prisma } from '../../../config/database.js';
import { BadRequestError, NotFoundError } from '../../../middleware/errorHandler.js';
import { issueNumber, projectFor, requireWrite } from '../../../mcp/context.js';
import { untrusted } from '../../../mcp/protocol.js';
import { issueArg, projectArg } from '../../../mcp/tools/read.js';
import { QUESTION_STATUSES } from '../constants.js';
import * as defects from '../defects.service.js';
import * as final from '../finalReport.service.js';
import { DEFECT_ACTIVITIES, PRODUCTS, TL_ACTIVITIES } from '../fptReports.js';
import * as qna from '../qna.service.js';
import { GAP_CODES } from '../rtm.js';
import * as rtm from '../rtm.service.js';
import { refNumber, SEVERITIES, SRS_FILL_SECTIONS, UC_PRIORITIES } from '../srs.js';
import * as srs from '../srs.service.js';
import * as time from '../timeActivity.service.js';
import { defineTool, type ToolDef } from './types.js';

const json = (v: unknown) => JSON.stringify(v, null, 2);
const dateArg = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const ucRef = z.union([z.number().int().positive(), z.string().min(1).max(12)]).describe('Use case number (3) or ID ("UC-03")');
const ucNo = (ref: number | string) => {
  const n = refNumber(ref, 'UC');
  if (!n) throw new BadRequestError(`"${String(ref)}" is not a use case (use 3 or "UC-03")`, 'VALIDATION_ERROR');
  return n;
};

/** Tên actor ⇒ id (chưa có ⇒ tạo actor mới — danh sách phụ, người sửa/xoá được). */
async function actorIds(userId: number, projectId: number, names: Array<string | null | undefined>) {
  const out: number[] = [];
  for (const raw of names) {
    const n = (raw ?? '').trim().slice(0, 120);
    if (!n) continue;
    const hit = await prisma.workSrsActor.findFirst({ where: { projectId, name: { equals: n, mode: 'insensitive' } }, select: { id: true } });
    out.push(hit ? hit.id : (await srs.createActor(userId, projectId, { name: n })).id);
  }
  return out;
}

// ─── Đọc ─────────────────────────────────────────────────────────

const srsGet = defineTool({
  name: 'srs_get', title: 'Read the structured SRS', group: 'srs',
  description: 'Reads the project\'s structured requirements (FPT Report 3): actors, use cases (UC-nn with status PROPOSED/DRAFT/APPROVED and missing spec fields), business rules (BR-nn), screens with flow and screen authorization, non-UI functions.',
  write: false,
  input: z.object({ project: projectArg }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/srs']]);
    const s = await srs.getSrs(ctx.userId, p.id);
    const actor = new Map(s.actors.map((x) => [x.id, x.name]));
    const screen = new Map(s.screens.map((x) => [x.id, x.name]));
    return untrusted('structured SRS', json({
      actors: s.actors.map((x) => ({ name: x.name, kind: x.kind, description: x.description })),
      useCases: s.useCases.map((u) => ({ id: u.key, name: u.name, feature: u.feature, status: u.status, priority: u.priority, primaryActor: u.primaryActorId ? actor.get(u.primaryActorId) : null, issue: u.issue?.key ?? null, section: u.section, missing: u.missing, rules: u.ruleNumbers.map((n) => `BR-${String(n).padStart(2, '0')}`) })),
      businessRules: s.rules.map((r) => ({ id: r.key, name: r.name, definition: r.definition, status: r.status, usedIn: r.usedIn })),
      screens: s.screens.map((x) => ({ name: x.name, feature: x.feature, goesTo: s.links.filter((l) => l.fromId === x.id).map((l) => screen.get(l.toId)), actors: s.auth.filter(([sid]) => sid === x.id).map(([, aid]) => actor.get(aid)) })),
      nonUiFunctions: s.functions.map((f) => ({ feature: f.feature, name: f.name, description: f.description })),
      report3Page: s.report3Page,
    }));
  },
});

const ucGet = defineTool({
  name: 'srs_use_case_get', title: 'Read one use case specification', group: 'srs',
  description: 'Reads one use case in full: actors, trigger, description, pre/postconditions, normal/alternative/exception flows, priority, business rules, linked issue.',
  write: false,
  input: z.object({ project: projectArg, useCase: ucRef }),
  run: async (ctx, a) => {
    const n = ucNo(a.useCase);
    const p = await projectFor(ctx, a.project, [['GET', `/srs/use-cases/${n}`]]);
    const u = await srs.getUseCase(ctx.userId, p.id, n);
    const name = (id: number | null) => u.actors.find((x) => x.id === id)?.name ?? null;
    return untrusted(`use case ${u.key}`, json({
      id: u.key, name: u.name, status: u.status, feature: u.feature, primaryActor: name(u.primaryActorId), secondaryActors: u.secondaryActorIds.map(name),
      trigger: u.trigger, description: u.description, preconditions: u.preconditions, postconditions: u.postconditions,
      normalFlow: u.normalFlow, alternativeFlows: u.alternativeFlows, exceptionFlows: u.exceptionFlows, priority: u.priority,
      businessRules: u.rules.map((r) => ({ id: r.key, name: r.name, definition: r.definition })), issue: u.issue?.key ?? null, missing: u.missing,
    }));
  },
});

const rtmGet = defineTool({
  name: 'rtm_get', title: 'Requirement traceability matrix', group: 'srs',
  description: 'The full RTM computed by CT Work: each use case / requirement with SRS and SDS sections, screens, commits/PRs, tests (Xray, Unit 5.1, Integration 5.2, System 5.3), bugs, status and GAPS (e.g. NO_TEST, NOT_RUN, FAILING, NO_SDS). Filter by gap to find holes.',
  write: false,
  input: z.object({ project: projectArg, gap: z.enum([...GAP_CODES, 'ANY'] as [string, ...string[]]).optional(), text: z.string().max(200).optional() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/rtm']]);
    const r = await rtm.getRtm(ctx.userId, p.id, { gap: a.gap, q: a.text });
    const rows = r.rows.slice(0, 120).map((x) => ({
      id: x.reqId, requirement: x.requirement, issue: x.issueKey, status: x.status, gaps: x.gaps, srs: x.srs, sds: x.sds, screens: x.screens,
      code: x.code, unit: x.unit.map((s) => `${s.ref} ${s.passed}/${s.cases}`), integration: x.integration.map((s) => `${s.name} ${s.passed}/${s.cases}`),
      system: x.system.map((s) => `${s.name} ${s.passed}/${s.cases}`), xray: x.xray.map((t) => `${t.key}:${t.last ?? 'not run'}`), bugs: x.bugs.map((b) => `${b.key}${b.open ? ' (open)' : ''}`),
    }));
    return `RTM — numbers computed by CT Work (${r.rows.length} rows${r.rows.length > 120 ? ', first 120 shown' : ''}).\n${untrusted('traceability matrix', json({ summary: r.summary, rows, untracedTests: r.orphans.slice(0, 50) }))}`;
  },
});

const defectLog = defineTool({
  name: 'defect_log', title: 'Defect log', group: 'tests',
  description: 'Lists Bug issues with Severity (Critical/Major/Minor/Trivial — separate from Priority), Activity (Review/UT/IT/ST/AT), Product and Product details — the Defects sheet of Project Tracking.',
  write: false,
  input: z.object({ project: projectArg, severity: z.enum(SEVERITIES).optional(), openOnly: z.boolean().optional() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/defects']]);
    const rows = await defects.defectLog(ctx.userId, p.id, { severity: a.severity, open: a.openOnly });
    return untrusted('defect log', json(rows.slice(0, 200).map((d) => ({ key: d.key, title: d.title, severity: d.severity, priority: d.priority, activity: d.activity, product: d.product, details: d.productDetails, status: d.status, assignee: d.assignee }))));
  },
});

const qnaList = defineTool({
  name: 'qna_list', title: 'Q&A log', group: 'planning',
  description: 'Lists the project Q&A log (questions to the lecturer or client): date, question, asked by, asked to, priority, due date, status, answer.',
  write: false,
  input: z.object({ project: projectArg, status: z.enum(['open', 'closed', 'all']).optional() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/qna']]);
    const r = await qna.listQuestions(ctx.userId, p.id, { status: a.status ?? 'all' });
    return untrusted('Q&A log', json({ counts: r.counts, items: r.items.slice(0, 150).map((q) => ({ key: q.key, date: q.askedOn, question: q.question, by: q.askedBy, to: q.askedTo, priority: q.priorityText, due: q.due, status: q.statusText, answer: q.answer, legacy: q.legacy || undefined })) }));
  },
});

const timeByActivity = defineTool({
  name: 'time_by_activity', title: 'Hours by activity', group: 'planning',
  description: 'Logged hours grouped by activity (Training, Analyzing, Designing, Coding, Testing, Deploying) and by person, optionally between two dates. Computed by CT Work.',
  write: false,
  input: z.object({ project: projectArg, from: dateArg.optional(), to: dateArg.optional() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/reports/time-by-activity']]);
    return untrusted('hours by activity', json(await time.hoursByActivity(ctx.userId, p.id, { from: a.from, to: a.to })));
  },
});

// ─── Ghi: SRS (đề xuất) ──────────────────────────────────────────

const flow = z.string().max(20_000).optional();
const proposeUc = defineTool({
  name: 'srs_propose_use_case', title: 'Propose a use case', group: 'srs',
  description: 'Adds a use case as a PROPOSAL (status PROPOSED) for a person to review on the Requirements page. Give actors by name (new names become actors). Number flows like the FPT template: normal "1. …", alternative "2A. …", exception "3E. …"; reference rules as "BR-03".',
  write: true,
  input: z.object({
    project: projectArg, name: z.string().min(1).max(200), feature: z.string().max(120).optional(),
    primaryActor: z.string().max(120).optional(), secondaryActors: z.array(z.string().max(120)).max(10).optional(),
    trigger: z.string().max(4000).optional(), description: z.string().max(8000).optional(),
    preconditions: z.string().max(8000).optional(), postconditions: z.string().max(8000).optional(),
    normalFlow: flow, alternativeFlows: flow, exceptionFlows: flow, priority: z.enum(UC_PRIORITIES).optional(),
    issue: issueArg.optional().describe('Requirement/story/epic this use case specifies'),
    businessRules: z.array(z.string().max(12)).max(30).optional().describe('Existing rule IDs, e.g. ["BR-01"]'),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/srs/use-cases']]);
    const [primary] = await actorIds(ctx.userId, p.id, [a.primaryActor]);
    const secondary = await actorIds(ctx.userId, p.id, a.secondaryActors ?? []);
    const ruleNumbers = (a.businessRules ?? []).map((r) => refNumber(r, 'BR')).filter((n): n is number => !!n);
    const u = await srs.createUseCase(ctx.userId, p.id, {
      name: a.name, feature: a.feature ?? null, primaryActorId: primary ?? null, secondaryActorIds: secondary.filter((x) => x !== primary),
      trigger: a.trigger ?? null, description: a.description ?? null, preconditions: a.preconditions ?? null, postconditions: a.postconditions ?? null,
      normalFlow: a.normalFlow ?? null, alternativeFlows: a.alternativeFlows ?? null, exceptionFlows: a.exceptionFlows ?? null,
      priority: a.priority, issueNumber: a.issue !== undefined ? issueNumber(p.key, a.issue) : undefined, ruleNumbers,
    }, { propose: true, aiModel: ctx.agent ? 'agent' : 'ai-assistant' });
    return { proposed: u.key, name: u.name, status: u.status, review: `/work/${p.workspaceSlug}/${p.key}/requirements?tab=use-cases&uc=${u.number}` };
  },
});

const proposeRule = defineTool({
  name: 'srs_propose_business_rule', title: 'Propose a business rule', group: 'srs',
  description: 'Adds a business rule (BR-nn) as a PROPOSAL for a person to review. Every validation in a use case should be a rule.',
  write: true,
  input: z.object({ project: projectArg, name: z.string().min(1).max(200), definition: z.string().max(8000), category: z.string().max(60).optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/srs/rules']]);
    const r = await srs.createRule(ctx.userId, p.id, { name: a.name, definition: a.definition, category: a.category ?? null }, { propose: true, aiModel: ctx.agent ? 'agent' : 'ai-assistant' });
    return { proposed: r.key, name: r.name, status: r.status };
  },
});

const suggestUcs = defineTool({
  name: 'srs_suggest_use_cases', title: 'Draft use cases from an issue', group: 'srs',
  description: 'CT Work\'s AI reads an issue or epic (and its child issues) and writes use case specifications from it — saved as PROPOSED use cases (and proposed rules) linked to the issue, for a person to accept or discard.',
  write: true,
  surfaces: { builtin: false },
  input: z.object({ project: projectArg, issue: issueArg }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/srs/suggest']]);
    return srs.suggestUseCases(ctx.userId, p.id, { issueNumber: issueNumber(p.key, a.issue) });
  },
});

const addActor = defineTool({
  name: 'srs_add_actor', title: 'Add an actor', group: 'srs',
  description: 'Adds an actor (a user role, or an external system / timer) to the SRS actor list.',
  write: true,
  input: z.object({ project: projectArg, name: z.string().min(1).max(120), description: z.string().max(4000).optional(), kind: z.enum(['PERSON', 'SYSTEM']).optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/srs/actors']]);
    const r = await srs.createActor(ctx.userId, p.id, { name: a.name, description: a.description ?? null, kind: a.kind });
    return { actor: r.name, id: r.id };
  },
});

async function screenByName(projectId: number, name: string) {
  const s = await prisma.workSrsScreen.findFirst({ where: { projectId, name: { equals: name.trim(), mode: 'insensitive' } }, select: { id: true, name: true } });
  if (!s) throw new NotFoundError(`Screen "${name}" not found — add it with srs_add_screen`);
  return s;
}

const addScreen = defineTool({
  name: 'srs_add_screen', title: 'Add a screen', group: 'srs',
  description: 'Adds a screen to the Screens Flow, with the screens it leads to and the actors allowed to open it (Screen Authorization).',
  write: true,
  input: z.object({
    project: projectArg, name: z.string().min(1).max(160), feature: z.string().max(120).optional(), description: z.string().max(4000).optional(),
    goesTo: z.array(z.object({ screen: z.string().max(160), label: z.string().max(120).optional() })).max(30).optional(),
    actors: z.array(z.string().max(120)).max(30).optional(), issue: issueArg.optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/srs/screens']]);
    const linksTo = [];
    for (const g of a.goesTo ?? []) linksTo.push({ screenId: (await screenByName(p.id, g.screen)).id, label: g.label ?? null });
    const actorList = a.actors ? await actorIds(ctx.userId, p.id, a.actors) : undefined;
    const s = await srs.createScreen(ctx.userId, p.id, {
      name: a.name, feature: a.feature ?? null, description: a.description ?? null, linksTo, actorIds: actorList,
      issueNumber: a.issue !== undefined ? issueNumber(p.key, a.issue) : undefined,
    });
    return { screen: s.name, id: s.id };
  },
});

const setAccess = defineTool({
  name: 'srs_set_screen_access', title: 'Set screen authorization', group: 'srs',
  description: 'Marks whether an actor may use a screen (one cell of the Screen Authorization matrix).',
  write: true,
  input: z.object({ project: projectArg, screen: z.string().min(1).max(160), actor: z.string().min(1).max(120), allowed: z.boolean() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['PUT', '/srs/screen-auth']]);
    const s = await screenByName(p.id, a.screen);
    const act = await prisma.workSrsActor.findFirst({ where: { projectId: p.id, name: { equals: a.actor.trim(), mode: 'insensitive' } }, select: { id: true } });
    if (!act) throw new NotFoundError(`Actor "${a.actor}" not found`);
    return srs.setScreenAuth(ctx.userId, p.id, { screenId: s.id, actorId: act.id, allowed: a.allowed });
  },
});

const addFunction = defineTool({
  name: 'srs_add_non_ui_function', title: 'Add a non-UI function', group: 'srs',
  description: 'Adds a non-UI system function (scheduled job, background process, integration) — table 1.4.3 Non-UI Functions.',
  write: true,
  input: z.object({ project: projectArg, feature: z.string().max(120).optional(), name: z.string().min(1).max(200), description: z.string().max(4000).optional(), issue: issueArg.optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/srs/functions']]);
    const f = await srs.createFunction(ctx.userId, p.id, { feature: a.feature ?? null, name: a.name, description: a.description ?? null, issueNumber: a.issue !== undefined ? issueNumber(p.key, a.issue) : undefined });
    return { function: f.name, id: f.id };
  },
});

const traceAdd = defineTool({
  name: 'trace_link_add', title: 'Add a traceability link', group: 'srs',
  description: 'Links a use case (UC-03), issue (FP-12) or business rule (BR-02) to an SRS/SDS section (page number + heading), a unit-tested function (5.1 id), an integration module (5.2 id), a system-test workflow (5.3 id) or code ("Class.method"). Use it when the RTM shows a gap that the link would close.',
  write: true,
  input: z.object({
    project: projectArg,
    source: z.string().min(1).max(20).describe('"UC-03", "BR-02" or an issue key "FP-12"'),
    target: z.enum(['SRS', 'SDS', 'UNIT', 'IT', 'ST', 'CODE']),
    page: z.number().int().positive().optional(), heading: z.string().max(255).optional(), targetId: z.number().int().positive().optional(), ref: z.string().max(300).optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/trace-links']]);
    const s = a.source.trim().toUpperCase();
    const source = /^UC-?\d+$/.test(s) ? { kind: 'UC' as const, ref: s } : /^BR-?\d+$/.test(s) ? { kind: 'BR' as const, ref: s } : { kind: 'ISSUE' as const, ref: issueNumber(p.key, s) };
    const r = await rtm.addTraceLink(ctx.userId, p.id, { source, target: { kind: a.target, pageNumber: a.page, heading: a.heading, targetId: a.targetId, ref: a.ref } });
    return { linked: `${a.source} → ${a.target}`, id: r.id };
  },
});

// ─── Ghi: defect · Q&A · giờ · Report 3/7 ─────────────────────────

const defectSet = defineTool({
  name: 'defect_set', title: 'Set defect fields of a bug', group: 'tests',
  description: 'Sets Severity (CRITICAL/MAJOR/MINOR/TRIVIAL — how bad the defect is, not its priority), Activity (Review/UT/IT/ST/AT), Product and Product details on a Bug issue.',
  write: true,
  input: z.object({
    project: projectArg, issue: issueArg, severity: z.enum(SEVERITIES).nullable().optional(), activity: z.enum(DEFECT_ACTIVITIES).nullable().optional(),
    product: z.enum(PRODUCTS).nullable().optional(), productDetails: z.string().max(300).nullable().optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    // Đường REST tương đương để chốt rào chắn agent (số thẻ không đổi kết quả của chốt).
    const p = await projectFor(ctx, a.project, [['PUT', '/issues/0/defect']]);
    const n = issueNumber(p.key, a.issue);
    const r = await defects.setDefect(ctx.userId, p.id, n, { severity: a.severity, activity: a.activity, product: a.product, productDetails: a.productDetails });
    return { issue: `${p.key}-${n}`, ...r, options: undefined };
  },
});

const findingBug = defineTool({
  name: 'spec_finding_to_bug', title: 'Log a spec review finding as a bug', group: 'tests',
  description: 'Turns one finding of a spec review (Spec Fidelity) into a Bug in the defect log (Activity Review, Product = the report, Severity from the finding). Running it again returns the same bug.',
  write: true,
  input: z.object({ project: projectArg, review: z.number().int().positive(), finding: z.string().regex(/^[ar]\d{1,4}$/) }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', `/spec-reviews/${a.review}/findings/${a.finding}/bug`]]);
    return defects.bugFromFinding(ctx.userId, p.id, a.review, a.finding);
  },
});

const qnaAsk = defineTool({
  name: 'qna_ask', title: 'Log a question in the Q&A log', group: 'planning',
  description: 'Adds a question for the lecturer or client to the Q&A log (date, asked by, asked to, priority, due date).',
  write: true,
  input: z.object({ project: projectArg, question: z.string().min(1).max(255), details: z.string().max(10_000).optional(), askedTo: z.string().max(120).optional(), askedBy: z.string().max(120).optional(), priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(), due: dateArg.optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/qna']]);
    const q = await qna.createQuestion(ctx.userId, p.id, { question: a.question, details: a.details ?? null, askedTo: a.askedTo ?? null, askedBy: a.askedBy ?? null, priority: a.priority, due: a.due ?? null });
    return { asked: q.key, status: q.statusText };
  },
});

const qnaAnswer = defineTool({
  name: 'qna_answer', title: 'Record the answer to a question', group: 'planning',
  description: 'Records the answer to a Q&A question (marks it answered), or changes its status (OPEN / ANSWERED / CANCELLED).',
  write: true,
  input: z.object({ project: projectArg, question: z.union([z.number().int().positive(), z.string().min(1).max(12)]).describe('Number (4) or key ("Q-4")'), answer: z.string().max(20_000).optional(), status: z.enum(QUESTION_STATUSES).optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const n = typeof a.question === 'number' ? a.question : Number(/(\d+)\s*$/.exec(a.question)?.[1] ?? NaN);
    if (!Number.isInteger(n) || n <= 0) throw new BadRequestError(`"${String(a.question)}" is not a question`, 'VALIDATION_ERROR');
    const p = await projectFor(ctx, a.project, [['PATCH', `/qna/${n}`]]);
    if (a.answer === undefined && a.status === undefined) throw new BadRequestError('Give an answer or a status', 'VALIDATION_ERROR');
    const q = await qna.updateQuestion(ctx.userId, p.id, n, { ...(a.answer !== undefined ? { answer: a.answer } : {}), ...(a.status ? { status: a.status } : {}) });
    return { question: q.key, status: q.statusText, answer: q.answer };
  },
});

const worklogActivity = defineTool({
  name: 'worklog_set_activity', title: 'Set the activity of logged time', group: 'planning',
  description: 'Sets the Activity (Training/Analyzing/Designing/Coding/Testing/Deploying) and Work Product (e.g. "Report3 (SRS)" or a module) of one time log of an issue — the TimeLogs sheet. Without worklogId it updates your latest log on the issue.',
  write: true,
  input: z.object({ project: projectArg, issue: issueArg, worklogId: z.number().int().positive().optional(), activity: z.enum(TL_ACTIVITIES).optional(), workProduct: z.string().max(120).optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['PATCH', '/issues/0/worklogs/0']]);
    const n = issueNumber(p.key, a.issue);
    const id = a.worklogId ?? (await prisma.workWorklog.findFirst({ where: { userId: ctx.userId, issue: { projectId: p.id, number: n } }, orderBy: { createdAt: 'desc' }, select: { id: true } }))?.id;
    if (!id) throw new NotFoundError('No time logged by you on this issue');
    return time.setWorklogMeta(ctx.userId, p.id, n, id, { activity: a.activity, workProduct: a.workProduct });
  },
});

const fillReport3 = defineTool({
  name: 'report3_fill_page', title: 'Fill the Report 3 page from the structured SRS', group: 'docs',
  description: 'Writes the actors, use case list, screens flow, screen authorization, non-UI functions, use case specifications and business rules into the project\'s Report 3 (SRS) page, under the template headings. Saves one new page version (restorable from History).',
  write: true,
  input: z.object({ project: projectArg, sections: z.array(z.enum(SRS_FILL_SECTIONS)).max(10).optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/pages/0/fill-srs']]);
    const pg = await srs.findReportPage(p.id, 3);
    if (!pg) throw new NotFoundError('This project has no Report 3 page — create it from the "FPT Capstone" template');
    const r = await srs.fillReport3Page(ctx.userId, p.id, pg.number, { sections: a.sections });
    return { page: pg.number, filled: r.filled, version: (r.page as { currentVersion?: number }).currentVersion ?? null, url: `/work/${p.workspaceSlug}/${p.key}/docs/${pg.number}` };
  },
});

const assembleFinal = defineTool({
  name: 'final_report_assemble', title: 'Assemble the Report 7 final report', group: 'docs',
  description: 'Merges the latest Reports 1–6 of the project into the Report 7 Final page (acknowledgement and definitions kept), as one new page version. Export it with export_file kind final_docx / final_pdf.',
  write: true,
  input: z.object({ project: projectArg }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/final-report/assemble']]);
    const r = await final.assembleFinalPage(ctx.userId, p.id);
    return { merged: r.merged.map((n) => `Report ${n}`), missing: r.missing.map((n) => `Report ${n}`), changed: r.changed };
  },
});

export const SRS_COMMANDS: ToolDef[] = [
  srsGet, ucGet, rtmGet, defectLog, qnaList, timeByActivity,
  proposeUc, proposeRule, suggestUcs, addActor, addScreen, setAccess, addFunction, traceAdd,
  defectSet, findingBug, qnaAsk, qnaAnswer, worklogActivity, fillReport3, assembleFinal,
];
