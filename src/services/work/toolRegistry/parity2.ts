/**
 * Registry lệnh — 21/10/2026 đợt 2: CUONGMINI NGANG QUYỀN NGƯỜI (phần còn thiếu của docs/cuongmini-ctwork-parity.md §5).
 *
 *   SWR302:     swr_glossary_update · swr_dictionary_update · swr_priority_update · swr_survey_update · swr_mockup_update ·
 *               swr_delete (feature, liên kết feature, hàng ưu tiên, glossary, dictionary, stakeholder, elicitation, nguồn yêu cầu,
 *               khảo sát, mockup, NFR)
 *   RTM:        trace_links (có id) · trace_link_remove
 *   CR:         change_requests (đọc) · change_request_manage (tạo/sửa/nộp/liên kết/gửi duyệt) · change_request_delete
 *               — QUYẾT ĐỊNH (APPROVED / REJECTED / UNDER_REVIEW) vẫn là việc của người duyệt.
 *   Chat:       chat_channel_manage (tạo/sửa/lưu trữ/thành viên) · chat_message_act (ghim, react, thành thẻ)
 *   Docs:       docs_comments (đọc, có id + đoạn neo) · docs_comment_resolve · docs_comment_delete
 *               (bình luận neo vào đoạn văn cần neo trong nội dung trang ⇒ thêm mới qua web; bình luận trang: docs_comment)
 *   Họp:        meeting_attendees_set · meeting_agenda_set
 *   Test:       test_plans · test_plan_manage · test_plan_delete · test_designs · test_design_save · test_design_export ·
 *               test_design_delete · fpt_import_excel (tệp .xlsx base64; replace = ghi đè ⇒ destructive)
 *   Agile:      poker_session (facilitator: tạo, thêm thẻ, bắt đầu, lật, bỏ phiếu lại, chốt, bỏ qua, đóng) · retro_session (tạo, sửa,
 *               khoá, sửa thẻ, action) · agile_delete
 *   Khác:       reviews · review_manage · review_delete (QUYẾT ĐỊNH review — `decision` — là của người) · versions ·
 *               version_manage (tạo/sửa/release) · version_delete
 *   Lớp học:    class_content (đọc stream/tài liệu) · class_post · class_material · class_assignment · class_content_delete
 *               — CHẤM ĐIỂM / trả bài / sổ điểm / điểm danh / làm quiz: KHÔNG có lệnh (giảng viên tự làm).
 *
 * Luật như parity.ts: `mcpOnly`, lệnh xoá `destructive + personOnly + requirePerson`, `projectFor` với tuyến REST tương đương
 * (tuyến ngoài dự án ⇒ `topRoute` như memberOps: agent bị chặn theo danh sách trắng `agentTopRouteAllowed`).
 */

import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../../config/database.js';
import { BadRequestError, NotFoundError } from '../../../middleware/errorHandler.js';
import { issueNumber, projectFor, requirePerson, requireWrite, type McpCtx, type ProjectHit } from '../../../mcp/context.js';
import { untrusted } from '../../../mcp/protocol.js';
import { issueArg, projectArg } from '../../../mcp/tools/read.js';
import * as chat from '../chat.service.js';
import type { ChannelKind } from '../chatRules.js';
import * as crs from '../changeRequests.service.js';
import * as stream from '../classStream.service.js';
import { MATERIAL_KINDS } from '../classStreamRules.js';
import * as mats from '../classMaterials.service.js';
import * as classwork from '../classwork.service.js';
import * as cal from '../classCalendar.service.js';
import * as classroom from '../classroom.service.js';
import * as quiz from '../quiz.service.js';
import { CR_LINK_ROLES, CR_URGENCY } from '../constants.js';
import { markdownToTiptap } from '../docMarkdown.js';
import * as fpt from '../fptTests.service.js';
import { agendaItemSchema } from '../meetingRules.js';
import * as meetings from '../meetings.service.js';
import * as rec from '../meetingRec.service.js';
import * as pages from '../pages.service.js';
import * as collab from '../collab.service.js';
import { agentForbidden, agentTopRouteAllowed } from '../permissions.js';
import * as planning from '../planning.service.js';
import * as poker from '../poker.service.js';
import * as q from '../quality.service.js';
import * as retro from '../retro.service.js';
import { ITEM_RESULTS, REVIEW_KINDS, REVIEW_METHODS, REVIEW_ROLES, REVIEW_STATUSES } from '../reviewRules.js';
import * as rtm from '../rtm.service.js';
import * as deep from '../srsDeep.service.js';
import * as swr from '../swr.service.js';
import * as elic from '../swrElic.service.js';
import { TECHNIQUES } from '../testDesign.js';
import * as t from '../testMgmt.service.js';
import * as tests from '../tests.service.js';
import { assigneeIdOf } from './personOps.js';
import { defineTool, mcpOnly, type ToolDef } from './types.js';

const json = (v: unknown) => JSON.stringify(v, null, 2);
const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const docOf = (markdown: string) => markdownToTiptap(markdown).doc as unknown as Prisma.InputJsonValue;
const DEL = { write: true, destructive: true, personOnly: true } as const;
const W = (ctx: McpCtx) => requireWrite(ctx);

/** "SV-3" / "ELC-2" / 3 ⇒ 3. */
function numOf(ref: number | string, what: string): number {
  const n = typeof ref === 'number' ? ref : Number(/(\d+)\s*$/.exec(ref)?.[1] ?? NaN);
  if (!Number.isInteger(n) || n <= 0) throw new BadRequestError(`"${String(ref)}" is not a ${what}`, 'VALIDATION_ERROR');
  return n;
}
const ref = (what: string) => z.union([z.number().int().positive(), z.string().min(1).max(200)]).describe(what);

/** Bỏ khoá điều hướng + undefined; rỗng ⇒ 400. */
function patchOf(a: Record<string, unknown>, drop: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(a)) if (!drop.includes(k) && v !== undefined) out[k] = v;
  if (!Object.keys(out).length) throw new BadRequestError('Nothing to change — pass at least one field', 'VALIDATION_ERROR');
  return out;
}

/** Username(s) ⇒ id thành viên không gian của dự án ("me" = mình). */
async function userIds(ctx: McpCtx, p: ProjectHit, names: string[]): Promise<number[]> {
  const out: number[] = [];
  for (const n of names) { const id = await assigneeIdOf(ctx, p, n); if (id) out.push(id); }
  return out;
}

/** Tuyến NGOÀI /projects/:pid (lớp học): agent theo danh sách trắng (mặc định cấm) — như memberOps. */
async function topRoute(ctx: McpCtx, method: string, path: string, verb: string): Promise<void> {
  if (ctx.agent && !agentTopRouteAllowed(method, path, !!ctx.agent.projectIds)) throw await agentForbidden(ctx.agent.userId, verb);
}

// ═══ SWR302 — sửa từng mục ═══════════════════════════════════════

async function byName(model: 'glossary' | 'dictionary', projectId: number, r: number | string): Promise<number> {
  if (typeof r === 'number') return r;
  if (/^\d+$/.test(r.trim())) return Number(r.trim());
  const rows = model === 'glossary'
    ? await prisma.workGlossaryTerm.findMany({ where: { projectId, term: { equals: r.trim(), mode: 'insensitive' } }, select: { id: true } })
    : await prisma.workDataElement.findMany({ where: { projectId, name: { equals: r.trim(), mode: 'insensitive' } }, select: { id: true } });
  if (rows.length !== 1) throw new NotFoundError(`${rows.length ? 'Several' : 'No'} ${model} entries called "${r}" — use the id from swr_${model}`);
  return rows[0].id;
}

const swrGlossaryUpdate = defineTool({
  name: 'swr_glossary_update', title: 'Edit a glossary term', group: 'srs',
  description: 'Edits a SWR302 glossary term (by id or the term itself): term, definition, aliases (replaces the list), source.',
  write: true,
  input: swr.glossaryInput.partial().extend({ project: projectArg, item: ref('Term id or the term') }),
  run: async (ctx, a) => {
    W(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const id = await byName('glossary', p0.id, a.item);
    const p = await projectFor(ctx, a.project, [['PATCH', `/swr/glossary/${id}`]]);
    await swr.updateTerm(ctx.userId, p.id, id, patchOf(a, ['project', 'item']));
    return { updated: `glossary #${id}` };
  },
});

const swrDictionaryUpdate = defineTool({
  name: 'swr_dictionary_update', title: 'Edit a data dictionary element', group: 'srs',
  description: 'Edits a data dictionary element (by id or name): name, description, kind PRIMITIVE/STRUCTURE, composition, data type, length, values, key flag, position.',
  write: true,
  input: swr.dataElementInput.partial().extend({ project: projectArg, item: ref('Element id or name') }),
  run: async (ctx, a) => {
    W(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const id = await byName('dictionary', p0.id, a.item);
    const p = await projectFor(ctx, a.project, [['PATCH', `/swr/dictionary/${id}`]]);
    await swr.updateElement(ctx.userId, p.id, id, patchOf(a, ['project', 'item']));
    return { updated: `data element #${id}` };
  },
});

const swrPriorityUpdate = defineTool({
  name: 'swr_priority_update', title: 'Edit a priority row', group: 'srs',
  description: 'Edits a row of the Wiegers priority matrix by row id (from swr_priority): benefit, penalty, cost, risk (1–9), note, position.',
  write: true,
  input: swr.priorityPatch.extend({ project: projectArg, row: z.number().int().positive() }),
  run: async (ctx, a) => {
    W(ctx);
    const p = await projectFor(ctx, a.project, [['PATCH', `/swr/priority/rows/${a.row}`]]);
    await swr.updatePriorityRow(ctx.userId, p.id, a.row, patchOf(a, ['project', 'row']));
    return { updated: `priority row #${a.row}` };
  },
});

const swrSurveyUpdate = defineTool({
  name: 'swr_survey_update', title: 'Edit a survey', group: 'srs',
  description: 'Edits an elicitation survey (SV-3): title, description, questions (replaces the list), collect names, closing time, max responses, session. Opening/closing the public link is done by a person on the web.',
  write: true,
  input: elic.surveyInput.partial().extend({ project: projectArg, survey: ref('Survey number or "SV-3"'), closesAt: z.string().max(40).nullable().optional().describe('ISO date-time, null = no closing time') }),
  run: async (ctx, a) => {
    W(ctx);
    const n = numOf(a.survey, 'survey');
    const p = await projectFor(ctx, a.project, [['PATCH', `/swr/surveys/${n}`]]);
    const patch = patchOf(a, ['project', 'survey']);
    if (typeof patch.closesAt === 'string') patch.closesAt = new Date(patch.closesAt);
    await elic.updateSurvey(ctx.userId, p.id, n, patch);
    return { updated: `SV-${n}` };
  },
});

const swrMockupUpdate = defineTool({
  name: 'swr_mockup_update', title: 'Edit a prototype / mockup link', group: 'srs',
  description: 'Edits a screen mockup (id from swr_models / the Prototype tab): title, url (Figma/image link).',
  write: true,
  input: z.object({ project: projectArg, mockup: z.number().int().positive(), title: z.string().max(200).nullable().optional(), url: z.string().max(1000).nullable().optional() }),
  run: async (ctx, a) => {
    W(ctx);
    const p = await projectFor(ctx, a.project, [['PATCH', `/swr/mockups/${a.mockup}`]]);
    await deep.updateMockup(ctx.userId, p.id, a.mockup, patchOf(a, ['project', 'mockup']));
    return { updated: `mockup #${a.mockup}` };
  },
});

const SWR_DEL = ['feature', 'feature_link', 'priority_row', 'glossary', 'dictionary', 'stakeholder', 'elicitation', 'origin', 'survey', 'mockup', 'nfr', 'raci_activity'] as const;
const swrDelete = defineTool({
  name: 'swr_delete', title: 'Delete a SWR302 item', group: 'srs',
  description: 'DESTRUCTIVE: deletes a SWR302 item — kind feature (FE-3) | feature_link (link id, with feature) | priority_row (row id) | glossary / dictionary (id or name) | stakeholder (SH-2) | elicitation (ELC-1) | origin (requirement source id) | survey (SV-1) | mockup (id) | nfr (requirement issue number) | raci_activity (activity id). The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, kind: z.enum(SWR_DEL), item: ref('Id / number / key / name of the item'), feature: ref('feature_link: the feature (FE-3)').optional() }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete requirements data');
    W(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const n = (what: string) => numOf(a.item, what);
    const route: Record<(typeof SWR_DEL)[number], () => Promise<[string, () => Promise<unknown>]>> = {
      feature: async () => [`/swr/features/${n('feature')}`, () => swr.deleteFeature(ctx.userId, p0.id, n('feature'))],
      feature_link: async () => {
        if (a.feature === undefined) throw new BadRequestError('Pass feature (FE-3) with the link id', 'VALIDATION_ERROR');
        const fe = numOf(a.feature, 'feature');
        return [`/swr/features/${fe}/links/${n('link')}`, () => swr.unlinkFeature(ctx.userId, p0.id, fe, n('link'))];
      },
      priority_row: async () => [`/swr/priority/rows/${n('row')}`, () => swr.removePriorityRow(ctx.userId, p0.id, n('row'))],
      glossary: async () => { const id = await byName('glossary', p0.id, a.item); return [`/swr/glossary/${id}`, () => swr.deleteTerm(ctx.userId, p0.id, id)]; },
      dictionary: async () => { const id = await byName('dictionary', p0.id, a.item); return [`/swr/dictionary/${id}`, () => swr.deleteElement(ctx.userId, p0.id, id)]; },
      stakeholder: async () => [`/swr/stakeholders/${n('stakeholder')}`, () => elic.deleteStakeholder(ctx.userId, p0.id, n('stakeholder'))],
      elicitation: async () => [`/swr/elicitation/${n('session')}`, () => elic.deleteSession(ctx.userId, p0.id, n('session'))],
      origin: async () => [`/swr/origins/${n('source')}`, () => elic.removeOrigin(ctx.userId, p0.id, n('source'))],
      survey: async () => [`/swr/surveys/${n('survey')}`, () => elic.deleteSurvey(ctx.userId, p0.id, n('survey'))],
      mockup: async () => [`/swr/mockups/${n('mockup')}`, () => deep.deleteMockup(ctx.userId, p0.id, n('mockup'))],
      nfr: async () => { const num = issueNumber(p0.key, a.item); return [`/swr/nfr/${num}`, () => deep.deleteNfr(ctx.userId, p0.id, num)]; },
      raci_activity: async () => [`/swr/raci/activities/${n('activity')}`, () => elic.deleteRaciActivity(ctx.userId, p0.id, n('activity'))],
    };
    const [path, go] = await route[a.kind]();
    await projectFor(ctx, a.project, [['DELETE', path]]);
    await go();
    return { deleted: { kind: a.kind, item: a.item } };
  },
});

// ═══ RTM: trace link có id ═══════════════════════════════════════

const traceLinks = defineTool({
  name: 'trace_links', title: 'List traceability links (with ids)', group: 'srs',
  description: 'Lists the manual traceability links (id, source UC/BR/issue, target SRS/SDS section, unit/integration/system test, code). Filter by source ("UC-03", "BR-02", "FP-12"). Remove one with trace_link_remove.',
  write: false,
  input: z.object({ project: projectArg, source: z.string().max(30).optional() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/trace-links']]);
    let src: Parameters<typeof rtm.listTraceLinks>[2];
    if (a.source) {
      const s = a.source.trim().toUpperCase();
      src = /^UC-?\d+$/.test(s) ? { kind: 'UC', ref: s } : /^BR-?\d+$/.test(s) ? { kind: 'BR', ref: s } : { kind: 'ISSUE', ref: issueNumber(p.key, s) };
    }
    return untrusted('trace links', json(await rtm.listTraceLinks(ctx.userId, p.id, src)));
  },
});

const traceLinkRemove = defineTool({
  name: 'trace_link_remove', title: 'Remove a traceability link', group: 'srs',
  description: 'Removes a traceability link by id (from trace_links or trace_link_add). Only the link goes — the requirement and the target stay.',
  write: true,
  input: z.object({ project: projectArg, id: z.number().int().positive() }),
  run: async (ctx, a) => {
    W(ctx);
    const p = await projectFor(ctx, a.project, [['DELETE', `/trace-links/${a.id}`]]);
    await rtm.removeTraceLink(ctx.userId, p.id, a.id);
    return { removed: a.id };
  },
});

// ═══ Change Request ══════════════════════════════════════════════

const changeRequests = defineTool({
  name: 'change_requests', title: 'Change requests', group: 'planning',
  description: 'Without number: lists the change requests (CR-n, status, urgency). With number: one CR — reason, impact (scope, schedule days, cost, risk), alternatives, links, approval.',
  write: false,
  input: z.object({ project: projectArg, number: ref('CR number or "CR-3"').optional() }),
  run: async (ctx, a) => {
    if (a.number === undefined) {
      const p = await projectFor(ctx, a.project, [['GET', '/changes']]);
      return untrusted('change requests', json(await crs.listChangeRequests(ctx.userId, p.id)));
    }
    const n = numOf(a.number, 'change request');
    const p = await projectFor(ctx, a.project, [['GET', `/changes/${n}`]]);
    return untrusted(`change request ${n}`, json(await crs.getChangeRequest(ctx.userId, p.id, n)));
  },
});

const CR_ACTIONS = ['create', 'update', 'submit', 'withdraw', 'implemented', 'link', 'unlink', 'request_approval'] as const;
const crManage = defineTool({
  name: 'change_request_manage', title: 'Create / edit / submit a change request', group: 'planning',
  description: 'action create (title + fields) | update (fields) | submit (DRAFT ⇒ SUBMITTED) | withdraw (back to DRAFT) | implemented (after approval) | link / unlink an issue (role AFFECTED or IMPLEMENTS; unlink by link id) | request_approval (approvers by username). Fields: description (Markdown), reason, urgency, impactScope, scheduleDays, costAmount, costCurrency, impactRisk, alternatives, owner. Approving or rejecting is done by the approver.',
  write: true, personOnly: true,
  input: z.object({
    project: projectArg, action: z.enum(CR_ACTIONS), number: ref('CR number (all actions except create)').optional(),
    title: z.string().min(1).max(255).optional(), description: z.string().max(30_000).nullable().optional(), reason: z.string().max(10_000).nullable().optional(),
    urgency: z.enum(CR_URGENCY).optional(), impactScope: z.string().max(10_000).nullable().optional(), scheduleDays: z.number().int().min(-3650).max(3650).nullable().optional(),
    costAmount: z.number().min(-1e12).max(1e12).nullable().optional(), costCurrency: z.string().max(16).nullable().optional(),
    impactRisk: z.string().max(10_000).nullable().optional(), alternatives: z.string().max(10_000).nullable().optional(), owner: z.string().max(254).optional().describe('"me" | username'),
    issue: issueArg.optional().describe('link: the issue'), role: z.enum(CR_LINK_ROLES).optional(), linkId: z.number().int().positive().optional(),
    approvers: z.array(z.string().min(1).max(254)).max(10).optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'manage change requests');
    W(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const fields = async (): Promise<crs.CrInput> => ({
      ...(a.title !== undefined ? { title: a.title } : {}), ...(a.description !== undefined ? { descriptionJson: a.description === null ? null : docOf(a.description) } : {}),
      ...(a.reason !== undefined ? { reason: a.reason } : {}), ...(a.urgency ? { urgency: a.urgency } : {}), ...(a.impactScope !== undefined ? { impactScope: a.impactScope } : {}),
      ...(a.scheduleDays !== undefined ? { scheduleDays: a.scheduleDays } : {}), ...(a.costAmount !== undefined ? { costAmount: a.costAmount } : {}),
      ...(a.costCurrency !== undefined ? { costCurrency: a.costCurrency } : {}), ...(a.impactRisk !== undefined ? { impactRisk: a.impactRisk } : {}),
      ...(a.alternatives !== undefined ? { alternatives: a.alternatives } : {}), ...(a.owner !== undefined ? { ownerId: await assigneeIdOf(ctx, p0, a.owner) } : {}),
    });
    if (a.action === 'create') {
      if (!a.title) throw new BadRequestError('create needs a title', 'VALIDATION_ERROR');
      const p = await projectFor(ctx, a.project, [['POST', '/changes']]);
      const cr = await crs.createChangeRequest(ctx.userId, p.id, { ...(await fields()), title: a.title }) as { number: number };
      return { created: `CR-${cr.number}`, number: cr.number };
    }
    if (a.number === undefined) throw new BadRequestError(`${a.action} needs the CR number`, 'VALIDATION_ERROR');
    const n = numOf(a.number, 'change request');
    switch (a.action) {
      case 'update': {
        const p = await projectFor(ctx, a.project, [['PATCH', `/changes/${n}`]]);
        const f = await fields();
        if (!Object.keys(f).length) throw new BadRequestError('Nothing to change', 'VALIDATION_ERROR');
        await crs.updateChangeRequest(ctx.userId, p.id, n, f);
        return { updated: `CR-${n}`, fields: Object.keys(f) };
      }
      case 'submit': case 'withdraw': case 'implemented': {
        const to = a.action === 'submit' ? 'SUBMITTED' : a.action === 'withdraw' ? 'DRAFT' : 'IMPLEMENTED';
        const p = await projectFor(ctx, a.project, [['POST', `/changes/${n}/status`]]);
        await crs.setChangeRequestStatus(ctx.userId, p.id, n, to);
        return { cr: `CR-${n}`, status: to };
      }
      case 'link': {
        if (a.issue === undefined) throw new BadRequestError('link needs the issue', 'VALIDATION_ERROR');
        const p = await projectFor(ctx, a.project, [['POST', `/changes/${n}/links`]]);
        await crs.addChangeRequestLink(ctx.userId, p.id, n, { role: a.role, issueNumber: issueNumber(p.key, a.issue) });
        return { cr: `CR-${n}`, linked: a.issue };
      }
      case 'unlink': {
        if (!a.linkId) throw new BadRequestError('unlink needs linkId (from change_requests)', 'VALIDATION_ERROR');
        const p = await projectFor(ctx, a.project, [['DELETE', `/changes/${n}/links/${a.linkId}`]]);
        await crs.removeChangeRequestLink(ctx.userId, p.id, n, a.linkId);
        return { cr: `CR-${n}`, unlinked: a.linkId };
      }
      case 'request_approval': {
        if (!a.approvers?.length) throw new BadRequestError('request_approval needs approvers (usernames)', 'VALIDATION_ERROR');
        const p = await projectFor(ctx, a.project, [['POST', `/changes/${n}/approval`]]);
        const { createCrApproval } = await import('../approvals.service.js');
        await createCrApproval(ctx.userId, p.id, n, { approverIds: await userIds(ctx, p, a.approvers) });
        return { cr: `CR-${n}`, sentForApproval: a.approvers };
      }
    }
    throw new BadRequestError('Unknown action', 'VALIDATION_ERROR');
  },
});

const crDelete = defineTool({
  name: 'change_request_delete', title: 'Delete a change request', group: 'planning',
  description: 'DESTRUCTIVE: deletes a change request (CR-3) with its links. The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, number: ref('CR number or "CR-3"') }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete change requests');
    W(ctx);
    const n = numOf(a.number, 'change request');
    const p = await projectFor(ctx, a.project, [['DELETE', `/changes/${n}`]]);
    await crs.deleteChangeRequest(ctx.userId, p.id, n);
    return { deleted: `CR-${n}` };
  },
});

// ═══ Chat ════════════════════════════════════════════════════════

const channelArg = z.string().max(60).optional().describe('Channel name (default "general")');

const chatChannelManage = defineTool({
  name: 'chat_channel_manage', title: 'Create / edit / archive a chat channel', group: 'chat',
  description: 'action create (name, topic, kind PUBLIC/PRIVATE, members) | update (new name, topic) | archive | unarchive | add_members / remove_members (usernames). Rights as on the web (channel owner / project admin).',
  write: true, personOnly: true,
  input: z.object({
    project: projectArg, action: z.enum(['create', 'update', 'archive', 'unarchive', 'add_members', 'remove_members']), channel: channelArg,
    name: z.string().min(1).max(60).optional(), topic: z.string().max(250).nullable().optional(), kind: z.enum(['PUBLIC', 'PRIVATE']).optional(),
    members: z.array(z.string().min(1).max(254)).max(200).optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'manage chat channels');
    W(ctx);
    const p = await projectFor(ctx, a.project, []);
    if (a.action === 'create') {
      if (!a.name) throw new BadRequestError('create needs a name', 'VALIDATION_ERROR');
      const ch = await chat.createChannel(ctx.userId, p.id, { name: a.name, topic: a.topic ?? null, kind: (a.kind ?? 'PUBLIC') as ChannelKind, memberIds: a.members ? await userIds(ctx, p, a.members) : undefined }) as { id: number; name: string };
      return { created: ch.name, id: ch.id };
    }
    const ch = await chat.channelByName(ctx.userId, p.id, a.channel);
    if (a.action === 'add_members' || a.action === 'remove_members') {
      if (!a.members?.length) throw new BadRequestError('Pass members (usernames)', 'VALIDATION_ERROR');
      const ids = await userIds(ctx, p, a.members);
      await chat.setChannelMembers(ctx.userId, p.id, ch.id, a.action === 'add_members' ? { add: ids } : { remove: ids });
      return { channel: ch.name, [a.action === 'add_members' ? 'added' : 'removed']: a.members };
    }
    const input = a.action === 'update' ? patchOf({ name: a.name, topic: a.topic }, []) : { archived: a.action === 'archive' };
    await chat.updateChannel(ctx.userId, p.id, ch.id, input);
    return { channel: ch.name, [a.action]: true };
  },
});

const chatMessageAct = defineTool({
  name: 'chat_message_act', title: 'Pin / react to / turn a chat message into an issue', group: 'chat',
  description: 'On a chat message (id "#<id>" from chat_read): pin / unpin, react / unreact with an emoji (e.g. "👍"), or to_issue (creates an issue of type, default TASK, from the message).',
  write: true,
  input: z.object({
    project: projectArg, channel: channelArg, message: z.number().int().positive(), action: z.enum(['pin', 'unpin', 'react', 'unreact', 'to_issue']),
    emoji: z.string().min(1).max(16).optional(), type: z.string().max(20).optional().describe('to_issue: issue type key (TASK, BUG…)'), title: z.string().max(255).optional(),
  }),
  run: async (ctx, a) => {
    W(ctx);
    const p = await projectFor(ctx, a.project, []);
    const ch = await chat.channelByName(ctx.userId, p.id, a.channel);
    if (a.action === 'pin' || a.action === 'unpin') { await chat.setPinned(ctx.userId, p.id, ch.id, a.message, a.action === 'pin'); return { message: a.message, pinned: a.action === 'pin' }; }
    if (a.action === 'react' || a.action === 'unreact') {
      if (!a.emoji) throw new BadRequestError('Pass the emoji', 'VALIDATION_ERROR');
      await chat.toggleReaction(ctx.userId, p.id, ch.id, a.message, a.emoji, a.action === 'react');
      return { message: a.message, [a.action]: a.emoji };
    }
    const key = (a.type ?? 'TASK').toUpperCase();
    const type = await prisma.workIssueType.findFirst({ where: { projectId: p.id, key }, select: { id: true } });
    if (!type) throw new BadRequestError(`No issue type ${key} in ${p.key}`, 'WORK_BAD_TYPE');
    const r = await chat.createIssueFromMessage(ctx.userId, p.id, ch.id, a.message, { typeId: type.id, title: a.title ?? null }) as { number?: number; key?: string };
    return { message: a.message, created: r.key ?? (r.number ? `${p.key}-${r.number}` : r) };
  },
});

// ═══ Docs: bình luận (kể cả neo đoạn văn) ════════════════════════

const docsComments = defineTool({
  name: 'docs_comments', title: 'Comments of a Docs page', group: 'docs',
  description: 'Lists the comments of a Docs page with ids, author, replies and — for inline comments — the quoted passage and whether it is resolved.',
  write: false,
  input: z.object({ project: projectArg, page: z.number().int().positive() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', `/pages/${a.page}/comments`]]);
    const rows = await pages.listComments(ctx.userId, p.id, a.page);
    return untrusted(`comments of page ${a.page}`, json(rows.map((c) => ({
      id: c.id, parent: c.parentId, author: c.author ? `@${(c.author as { username: string }).username}` : null, at: c.createdAt, text: c.bodyText,
      inline: c.anchor ? { quote: c.anchor.quote, resolved: !!c.anchor.resolvedAt } : null, canDelete: c.canDelete,
    }))));
  },
});

const docsCommentResolve = defineTool({
  name: 'docs_comment_resolve', title: 'Resolve / reopen an inline comment', group: 'docs',
  description: 'Marks an inline (passage) comment of a Docs page resolved, or reopens it with resolved=false. Id from docs_comments.',
  write: true,
  input: z.object({ project: projectArg, page: z.number().int().positive(), comment: z.number().int().positive(), resolved: z.boolean().optional() }),
  run: async (ctx, a) => {
    W(ctx);
    const p = await projectFor(ctx, a.project, [['POST', `/pages/${a.page}/inline-comments/${a.comment}/resolve`]]);
    await collab.resolveInlineComment(ctx.userId, p.id, a.page, a.comment, a.resolved !== false);
    return { comment: a.comment, resolved: a.resolved !== false };
  },
});

const docsCommentDelete = defineTool({
  name: 'docs_comment_delete', title: 'Delete a Docs comment', group: 'docs',
  description: 'DESTRUCTIVE: deletes a comment of a Docs page (your own; admins any, as on the web). Id from docs_comments. The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, page: z.number().int().positive(), comment: z.number().int().positive() }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete comments');
    W(ctx);
    const p = await projectFor(ctx, a.project, [['DELETE', `/pages/${a.page}/comments/${a.comment}`]]);
    await pages.deleteComment(ctx.userId, p.id, a.page, a.comment);
    return { deleted: a.comment };
  },
});

// ═══ Họp: người dự + chương trình ════════════════════════════════

const meetingAttendeesSet = defineTool({
  name: 'meeting_attendees_set', title: 'Set meeting attendees', group: 'planning',
  description: 'Sets who is invited to a project meeting (usernames, "me"; REPLACES the list). Team members only — no outside invites.',
  write: true,
  input: z.object({ project: projectArg, meeting: ref('Meeting number'), attendees: z.array(z.string().min(1).max(254)).max(100) }),
  run: async (ctx, a) => {
    W(ctx);
    const n = numOf(a.meeting, 'meeting');
    const p = await projectFor(ctx, a.project, [['PUT', `/meetings/${n}/attendees`]]);
    await meetings.setAttendees(ctx.userId, p.id, n, await userIds(ctx, p, a.attendees));
    return { meeting: n, attendees: a.attendees };
  },
});

const meetingAgendaSet = defineTool({
  name: 'meeting_agenda_set', title: 'Set the agenda items of a meeting', group: 'planning',
  description: 'Sets the timed agenda of a meeting (REPLACES the list): each item title, presenter (username), minutes, reference (issue key / link).',
  write: true,
  input: z.object({
    project: projectArg, meeting: ref('Meeting number'),
    items: z.array(z.object({ title: z.string().min(1).max(300), presenter: z.string().max(254).optional(), minutes: z.number().int().min(0).max(600).optional(), ref: z.string().max(500).optional() })).max(50),
  }),
  run: async (ctx, a) => {
    W(ctx);
    const n = numOf(a.meeting, 'meeting');
    const p = await projectFor(ctx, a.project, [['PUT', `/meetings/${n}/agenda-items`]]);
    const items = await Promise.all(a.items.map(async (i) => agendaItemSchema.parse({ title: i.title, presenterId: i.presenter ? await assigneeIdOf(ctx, p, i.presenter) : null, minutes: i.minutes ?? null, ref: i.ref ?? null })));
    await rec.setAgendaItems(ctx.userId, p.id, n, items);
    return { meeting: n, items: items.length };
  },
});

// ═══ Test plan · test design · nhập Excel 5.x ════════════════════

const testPlans = defineTool({
  name: 'test_plans', title: 'Test plans', group: 'tests',
  description: 'Lists the Xray test plans (id, name, tests in the plan, progress).',
  write: false,
  input: z.object({ project: projectArg }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/test-plans']]);
    return untrusted('test plans', json(await tests.listPlans(ctx.userId, p.id)));
  },
});

const testPlanManage = defineTool({
  name: 'test_plan_manage', title: 'Create / edit a test plan', group: 'tests',
  description: 'Without plan: creates a test plan (name, description, tests). With plan (id): edits name/description, adds/removes tests (issue numbers), archives.',
  write: true,
  input: z.object({
    project: projectArg, plan: z.number().int().positive().optional(), name: z.string().min(1).max(120).optional(), description: z.string().max(5000).nullable().optional(),
    addTests: z.array(z.number().int().positive()).max(1000).optional(), removeTests: z.array(z.number().int().positive()).max(1000).optional(), archived: z.boolean().optional(),
  }),
  run: async (ctx, a) => {
    W(ctx);
    if (!a.plan) {
      if (!a.name) throw new BadRequestError('A new plan needs a name', 'VALIDATION_ERROR');
      const p = await projectFor(ctx, a.project, [['POST', '/test-plans']]);
      const r = await tests.createPlan(ctx.userId, p.id, { name: a.name, description: a.description ?? null, numbers: a.addTests }) as { id: number };
      return { created: r.id };
    }
    const p = await projectFor(ctx, a.project, [['PATCH', `/test-plans/${a.plan}`]]);
    await tests.updatePlan(ctx.userId, p.id, a.plan, { name: a.name, description: a.description, archived: a.archived, addNumbers: a.addTests, removeNumbers: a.removeTests });
    return { updated: a.plan };
  },
});

const testPlanDelete = defineTool({
  name: 'test_plan_delete', title: 'Delete a test plan', group: 'tests',
  description: 'DESTRUCTIVE: deletes a test plan (the test cases stay). The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, plan: z.number().int().positive() }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete test data');
    W(ctx);
    const p = await projectFor(ctx, a.project, [['DELETE', `/test-plans/${a.plan}`]]);
    await tests.deletePlan(ctx.userId, p.id, a.plan);
    return { deleted: a.plan };
  },
});

const testDesigns = defineTool({
  name: 'test_designs', title: 'Test designs (EP/BVA, decision table…)', group: 'tests',
  description: 'Without number: lists the saved test designs (technique, requirement). With number: one design — its input and the generated cases.',
  write: false,
  input: z.object({ project: projectArg, number: z.number().int().positive().optional() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', a.number ? `/test-designs/${a.number}` : '/test-designs']]);
    return untrusted('test designs', json(a.number ? await t.getDesign(ctx.userId, p.id, a.number) : await t.listDesigns(ctx.userId, p.id)));
  },
});

const testDesignSave = defineTool({
  name: 'test_design_save', title: 'Save a test design', group: 'tests',
  description: 'Creates (no number) or replaces (number) a test design: technique EP_BVA | DECISION_TABLE | STATE_TRANSITION | PAIRWISE, name, requirement key, and inputJson = the technique input as JSON text (same shape as the Test design page; read an existing one with test_designs to copy the shape).',
  write: true,
  input: z.object({
    project: projectArg, number: z.number().int().positive().optional(), name: z.string().min(1).max(160), technique: z.enum(TECHNIQUES),
    requirement: z.string().max(40).optional(), inputJson: z.string().min(2).max(200_000),
  }),
  run: async (ctx, a) => {
    W(ctx);
    let input: unknown;
    try { input = JSON.parse(a.inputJson); } catch { throw new BadRequestError('inputJson is not valid JSON', 'VALIDATION_ERROR'); }
    const p = await projectFor(ctx, a.project, [['POST', '/test-designs']]);
    const d = await t.saveDesign(ctx.userId, p.id, { number: a.number ?? null, name: a.name, technique: a.technique, requirementKey: a.requirement ?? null, input }) as { number?: number };
    return { saved: d.number ?? a.number ?? null };
  },
});

const testDesignExport = defineTool({
  name: 'test_design_export', title: 'Turn a test design into test cases', group: 'tests',
  description: 'Exports the cases of a test design to Xray test cases (target XRAY) or to a Report 5.1 unit-test function (target UNIT with moduleName + methodName). caseIds = only some cases.',
  write: true,
  input: z.object({
    project: projectArg, number: z.number().int().positive(), target: z.enum(['XRAY', 'UNIT']), caseIds: z.array(z.string().max(20)).max(500).optional(),
    moduleName: z.string().max(120).optional(), methodName: z.string().max(120).optional(),
  }),
  run: async (ctx, a) => {
    W(ctx);
    const p = await projectFor(ctx, a.project, [['POST', `/test-designs/${a.number}/export`]]);
    return { exported: await t.exportDesign(ctx.userId, p.id, a.number, { target: a.target, caseIds: a.caseIds, moduleName: a.moduleName ?? null, methodName: a.methodName ?? null }) };
  },
});

const testDesignDelete = defineTool({
  name: 'test_design_delete', title: 'Delete a test design', group: 'tests',
  description: 'DESTRUCTIVE: deletes a saved test design (test cases already exported stay). The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, number: z.number().int().positive() }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete test data');
    W(ctx);
    const p = await projectFor(ctx, a.project, [['DELETE', `/test-designs/${a.number}`]]);
    await t.deleteDesign(ctx.userId, p.id, a.number);
    return { deleted: a.number };
  },
});

const fptImport = defineTool({
  name: 'fpt_import_excel', title: 'Import a Report 5.1/5.2/5.3 Excel file', group: 'tests',
  description: 'Imports an FPT test report .xlsx (base64, ≤ 6 MB) into Report 5.1/5.2/5.3. ALWAYS run with dryRun=true first and show the user what would change. mode "append" adds; "replace" OVERWRITES the existing sheets of that report — destructive: it is never run directly, it becomes a deletion request the team lead approves on the web (old data goes to the 30-day trash).',
  write: true, destructive: true, personOnly: true,
  // 22/10/2026: chỉ "replace" thật mới là xoá (thành yêu cầu chờ trưởng nhóm duyệt); dryRun / append chạy ngay.
  destructiveWhen: (a) => a.mode === 'replace' && a.dryRun !== true,
  input: z.object({
    project: projectArg, base64: z.string().min(8).max(8_500_000), report: z.enum(['auto', 'unit', 'integration', 'system']).optional(),
    mode: z.enum(['append', 'replace']).optional(), dryRun: z.boolean().optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'import test reports');
    W(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/fpt-tests/import']]);
    const buf = Buffer.from(a.base64.replace(/^data:[^,]*,/, ''), 'base64');
    return { result: await fpt.importReport(ctx.userId, p.id, buf, { report: a.report ?? 'auto', mode: a.mode ?? 'append', dryRun: a.dryRun === true }) };
  },
});

// ═══ Planning poker / retro: điều phối phiên ═════════════════════

const POKER_ACTIONS = ['create', 'add_items', 'start', 'reveal', 'revote', 'finalize', 'skip', 'close', 'timer'] as const;
const pokerSession = defineTool({
  name: 'poker_session', title: 'Run a planning-poker session (facilitator)', group: 'planning',
  description: 'action create (title, deck FIBONACCI…, sprint id or issues) | add_items (issues) | start (issue ⇒ voting) | reveal | revote | finalize (value = the agreed estimate, written to the issue) | skip | close | timer (seconds: 30, 60, 90, 120, 180 or 300; 0 stops). Facilitator rights as on the web. Voting: poker_vote.',
  write: true, personOnly: true,
  input: z.object({
    project: projectArg, action: z.enum(POKER_ACTIONS), session: z.number().int().positive().optional(), title: z.string().min(1).max(120).optional(),
    deck: z.string().max(20).optional(), sprintId: z.number().int().positive().optional(), issues: z.array(issueArg).max(100).optional(),
    issue: issueArg.optional().describe('start/reveal/revote/finalize/skip: the issue (default: the one being voted)'), value: z.string().min(1).max(8).optional(),
    seconds: z.number().int().min(0).max(3600).optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'run planning poker');
    W(ctx);
    const p0 = await projectFor(ctx, a.project, [['GET', '/poker']]);
    const nums = (a.issues ?? []).map((i) => issueNumber(p0.key, i));
    if (a.action === 'create') {
      if (!a.title) throw new BadRequestError('create needs a title', 'VALIDATION_ERROR');
      await projectFor(ctx, a.project, [['POST', '/poker']]);
      const s = await poker.createSession(ctx.userId, p0.id, poker.sessionInput.parse({ title: a.title, deck: a.deck, sprintId: a.sprintId ?? null, issues: nums.length ? nums : undefined })) as { id: number };
      return { created: s.id };
    }
    if (!a.session) throw new BadRequestError(`${a.action} needs the session id`, 'VALIDATION_ERROR');
    const sid = a.session;
    if (a.action === 'add_items') { await projectFor(ctx, a.project, [['POST', `/poker/${sid}/items`]]); await poker.addItems(ctx.userId, p0.id, sid, { issues: nums }); return { session: sid, added: nums.length }; }
    if (a.action === 'close') { await projectFor(ctx, a.project, [['POST', `/poker/${sid}/close`]]); await poker.closeSession(ctx.userId, p0.id, sid); return { session: sid, closed: true }; }
    if (a.action === 'timer') { await projectFor(ctx, a.project, [['POST', `/poker/${sid}/timer`]]); await poker.setTimer(ctx.userId, p0.id, sid, poker.timerInput.parse({ seconds: a.seconds ?? 0 }).seconds); return { session: sid, timer: a.seconds ?? 0 }; }
    let item: { id: number } | null;
    if (a.issue !== undefined) {
      const n = issueNumber(p0.key, a.issue);
      item = await prisma.workPokerItem.findFirst({ where: { sessionId: sid, session: { projectId: p0.id }, issue: { number: n, projectId: p0.id } }, select: { id: true } });
    } else item = await prisma.workPokerItem.findFirst({ where: { sessionId: sid, session: { projectId: p0.id }, state: { in: ['VOTING', 'REVEALED'] } }, orderBy: { id: 'asc' }, select: { id: true } });
    if (!item) throw new NotFoundError('That issue is not in this poker session (or nothing is being voted)');
    await projectFor(ctx, a.project, [['POST', `/poker/${sid}/items/${item.id}/${a.action}`]]);
    if (a.action === 'start') await poker.startItem(ctx.userId, p0.id, sid, item.id);
    else if (a.action === 'reveal') await poker.reveal(ctx.userId, p0.id, sid, item.id);
    else if (a.action === 'revote') await poker.revote(ctx.userId, p0.id, sid, item.id);
    else if (a.action === 'skip') await poker.skipItem(ctx.userId, p0.id, sid, item.id);
    else {
      if (!a.value) throw new BadRequestError('finalize needs value', 'VALIDATION_ERROR');
      await poker.finalize(ctx.userId, p0.id, sid, item.id, a.value);
    }
    return { session: sid, item: item.id, [a.action]: a.value ?? true };
  },
});

const retroSession = defineTool({
  name: 'retro_session', title: 'Run a retro board', group: 'planning',
  description: 'action create (title, template SSC…, sprint id, anonymous, votes per person) | update (title, sprint, anonymous, votes, locked) | card_update (your card: body, column) | add_action (title, assignee, createIssue default true). Cards and votes: retro_card_add / retro_vote.',
  write: true, personOnly: true,
  input: z.object({
    project: projectArg, action: z.enum(['create', 'update', 'card_update', 'add_action']), retro: z.number().int().positive().optional(),
    title: z.string().min(1).max(255).optional(), template: z.string().max(20).optional(), sprintId: z.number().int().positive().nullable().optional(),
    anonymous: z.boolean().optional(), votesPerPerson: z.number().int().min(1).max(20).optional(), locked: z.boolean().optional(),
    card: z.number().int().positive().optional(), body: z.string().min(1).max(1000).optional(), column: z.string().max(16).optional(),
    assignee: z.string().max(254).optional(), createIssue: z.boolean().optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'run retros');
    W(ctx);
    const p0 = await projectFor(ctx, a.project, [['GET', '/retros']]);
    if (a.action === 'create') {
      await projectFor(ctx, a.project, [['POST', '/retros']]);
      const r = await retro.createRetro(ctx.userId, p0.id, retro.retroInput.parse({ title: a.title, template: a.template, sprintId: a.sprintId ?? null, anonymous: a.anonymous, votesPerPerson: a.votesPerPerson })) as { id: number };
      return { created: r.id };
    }
    if (!a.retro) throw new BadRequestError(`${a.action} needs the retro id`, 'VALIDATION_ERROR');
    if (a.action === 'update') {
      await projectFor(ctx, a.project, [['PATCH', `/retros/${a.retro}`]]);
      await retro.updateRetro(ctx.userId, p0.id, a.retro, retro.retroPatch.parse(patchOf({ title: a.title, sprintId: a.sprintId, anonymous: a.anonymous, votesPerPerson: a.votesPerPerson, locked: a.locked }, [])));
      return { updated: a.retro };
    }
    if (a.action === 'card_update') {
      if (!a.card) throw new BadRequestError('card_update needs card', 'VALIDATION_ERROR');
      await projectFor(ctx, a.project, [['PATCH', `/retros/${a.retro}/cards/${a.card}`]]);
      await retro.updateCard(ctx.userId, p0.id, a.retro, a.card, retro.cardPatch.parse(patchOf({ body: a.body, column: a.column }, [])));
      return { updated: `card #${a.card}` };
    }
    if (!a.title) throw new BadRequestError('add_action needs a title', 'VALIDATION_ERROR');
    await projectFor(ctx, a.project, [['POST', `/retros/${a.retro}/actions`]]);
    const r = await retro.addAction(ctx.userId, p0.id, a.retro, retro.actionInput.parse({ title: a.title, assigneeId: a.assignee ? await assigneeIdOf(ctx, p0, a.assignee) : null, createIssue: a.createIssue }));
    return { added: r };
  },
});

const agileDelete = defineTool({
  name: 'agile_delete', title: 'Delete a poker session / item or a retro / card / action', group: 'planning',
  description: 'DESTRUCTIVE: kind poker_session | poker_item (with session; item = issue) | retro | retro_card (with retro) | retro_action (with retro). The user must confirm.',
  ...DEL,
  input: z.object({
    project: projectArg, kind: z.enum(['poker_session', 'poker_item', 'retro', 'retro_card', 'retro_action']), id: z.number().int().positive().describe('Session / retro / card / action id'),
    session: z.number().int().positive().optional(), retro: z.number().int().positive().optional(), issue: issueArg.optional().describe('poker_item: the issue'),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete agile boards');
    W(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    switch (a.kind) {
      case 'poker_session': await projectFor(ctx, a.project, [['DELETE', `/poker/${a.id}`]]); await poker.deleteSession(ctx.userId, p0.id, a.id); break;
      case 'poker_item': {
        if (!a.session) throw new BadRequestError('poker_item needs session', 'VALIDATION_ERROR');
        let iid = a.id;
        if (a.issue !== undefined) {
          const n = issueNumber(p0.key, a.issue);
          const it = await prisma.workPokerItem.findFirst({ where: { sessionId: a.session, issue: { number: n, projectId: p0.id } }, select: { id: true } });
          if (!it) throw new NotFoundError('That issue is not in this session');
          iid = it.id;
        }
        await projectFor(ctx, a.project, [['DELETE', `/poker/${a.session}/items/${iid}`]]);
        await poker.removeItem(ctx.userId, p0.id, a.session, iid);
        break;
      }
      case 'retro': await projectFor(ctx, a.project, [['DELETE', `/retros/${a.id}`]]); await retro.deleteRetro(ctx.userId, p0.id, a.id); break;
      case 'retro_card': case 'retro_action': {
        if (!a.retro) throw new BadRequestError(`${a.kind} needs retro`, 'VALIDATION_ERROR');
        const seg = a.kind === 'retro_card' ? 'cards' : 'actions';
        await projectFor(ctx, a.project, [['DELETE', `/retros/${a.retro}/${seg}/${a.id}`]]);
        if (a.kind === 'retro_card') await retro.deleteCard(ctx.userId, p0.id, a.retro, a.id);
        else await retro.deleteAction(ctx.userId, p0.id, a.retro, a.id);
        break;
      }
    }
    return { deleted: { kind: a.kind, id: a.id } };
  },
});

// ═══ Review / inspection · version ═══════════════════════════════

const reviews = defineTool({
  name: 'reviews', title: 'Reviews / inspections', group: 'tests',
  description: 'Without number: lists document/code reviews (status, method, decision). With number: one review — participants, checklist items with ids and results, defects.',
  write: false,
  input: z.object({ project: projectArg, number: z.number().int().positive().optional() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', a.number ? `/reviews/${a.number}` : '/reviews']]);
    return untrusted('reviews', json(a.number ? await q.getReview(ctx.userId, p.id, a.number) : await q.listReviews(ctx.userId, p.id)));
  },
});

const reviewManage = defineTool({
  name: 'review_manage', title: 'Create / run a review', group: 'tests',
  description: 'action create (title, kind DOC/CODE, method, checklistKey, page or PR, participants {username, role}) | update (title, method, work product, PR, size, meeting time/minutes, rework minutes, criteria, notes) | participants (REPLACES list) | items (record checklist results by item id: OK/NG/NA + line/note/severity, or add questions) | transition (status) | defect (log a defect issue from an NG item) | ai_code_review (CuongMini reads PR `pr` or the PR/branch of `issue`, saves a CODE review with findings and comments on the issue; project admin, lead, team lead or lecturer; costs AI credit) | ai_review_queue (CuongMini reviews the issues in the Review column: per issue DONE / BACK / KEEP + drafted comment — apply them with transition + comment). The review DECISION (accept / reinspect) is the moderator\'s — set it on the web.',
  write: true, personOnly: true,
  input: z.object({
    project: projectArg, action: z.enum(['create', 'update', 'participants', 'items', 'transition', 'defect', 'ai_code_review', 'ai_review_queue']), number: z.number().int().positive().optional(),
    numbers: z.array(z.number().int().positive()).max(10).optional().describe('ai_review_queue: only these issues'),
    pr: z.number().int().positive().optional().describe('ai_code_review: pull request number'), issue: issueArg.optional().describe('ai_code_review: issue whose PR/branch to review'),
    notify: z.boolean().optional().describe('ai_code_review: also ping the member'),
    title: z.string().min(1).max(200).optional(), kind: z.enum(REVIEW_KINDS).optional(), method: z.enum(REVIEW_METHODS).optional(), checklistKey: z.string().max(40).optional(),
    page: z.number().int().positive().optional(), workProduct: z.string().max(200).optional(), prUrl: z.string().max(500).optional(), size: z.number().min(0).max(1_000_000).optional(),
    meetingAt: z.string().max(40).optional(), meetingMinutes: z.number().int().min(0).max(100_000).optional(), reworkMinutes: z.number().int().min(0).max(100_000).optional(),
    entryCriteria: z.string().max(4000).optional(), exitCriteria: z.string().max(4000).optional(), notes: z.string().max(10_000).optional(),
    participants: z.array(z.object({ user: z.string().min(1).max(254), role: z.enum(REVIEW_ROLES), prepMinutes: z.number().int().min(0).max(100_000).optional() })).max(30).optional(),
    items: z.array(z.object({ id: z.number().int().positive(), result: z.enum(ITEM_RESULTS).nullable().optional(), line: z.string().max(60).optional(), note: z.string().max(4000).optional(), severity: z.string().max(20).nullable().optional() })).max(300).optional(),
    addQuestions: z.array(z.object({ section: z.string().min(1).max(120), question: z.string().min(1).max(1000) })).max(50).optional(),
    to: z.enum(REVIEW_STATUSES).optional(), item: z.number().int().positive().optional().describe('defect: the NG item id'),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'run reviews');
    W(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const people = async () => Promise.all((a.participants ?? []).map(async (x) => ({ userId: (await assigneeIdOf(ctx, p0, x.user))!, role: x.role, prepMinutes: x.prepMinutes ?? null })));
    if (a.action === 'ai_review_queue') {
      const p = await projectFor(ctx, a.project, [['POST', '/code/review/queue']]);
      const { reviewQueue } = await import('../reviewHangLoat.service.js');
      return untrusted('review of issues in Review', json(await reviewQueue(ctx.userId, p.id, { numbers: a.numbers, max: 10 })));
    }
    if (a.action === 'ai_code_review') {
      if (!a.pr && a.issue === undefined) throw new BadRequestError('ai_code_review needs pr or issue', 'VALIDATION_ERROR');
      const p = await projectFor(ctx, a.project, [['POST', '/code/review']]);
      const { runCodeReview } = await import('../codeReview.service.js');
      return runCodeReview(ctx.userId, p.id, { pr: a.pr ?? null, issue: a.issue !== undefined ? issueNumber(p.key, a.issue) : null, notify: a.notify === true }) as unknown as Record<string, unknown>;
    }
    if (a.action === 'create') {
      if (!a.title || !a.kind || !a.method || !a.checklistKey) throw new BadRequestError('create needs title, kind, method and checklistKey', 'VALIDATION_ERROR');
      const p = await projectFor(ctx, a.project, [['POST', '/reviews']]);
      const r = await q.createReview(ctx.userId, p.id, {
        title: a.title, kind: a.kind, method: a.method, checklistKey: a.checklistKey, pageNumber: a.page ?? null, workProduct: a.workProduct ?? null, prUrl: a.prUrl ?? null,
        size: a.size ?? null, meetingAt: a.meetingAt ? new Date(a.meetingAt) : null, entryCriteria: a.entryCriteria ?? null, exitCriteria: a.exitCriteria ?? null,
        participants: a.participants ? (await people()).map(({ userId, role }) => ({ userId, role })) : undefined,
      } as Parameters<typeof q.createReview>[2]) as { number: number };
      return { created: r.number };
    }
    if (!a.number) throw new BadRequestError(`${a.action} needs the review number`, 'VALIDATION_ERROR');
    const n = a.number;
    switch (a.action) {
      case 'update': {
        const p = await projectFor(ctx, a.project, [['PATCH', `/reviews/${n}`]]);
        const patch = patchOf({ title: a.title, method: a.method, workProduct: a.workProduct, prUrl: a.prUrl, size: a.size, meetingAt: a.meetingAt ? new Date(a.meetingAt) : undefined, meetingMinutes: a.meetingMinutes, reworkMinutes: a.reworkMinutes, entryCriteria: a.entryCriteria, exitCriteria: a.exitCriteria, notes: a.notes }, []);
        await q.updateReview(ctx.userId, p.id, n, patch as Parameters<typeof q.updateReview>[3]);
        return { updated: n };
      }
      case 'participants': { const p = await projectFor(ctx, a.project, [['PUT', `/reviews/${n}/participants`]]); await q.setParticipants(ctx.userId, p.id, n, await people()); return { review: n, participants: a.participants?.length ?? 0 }; }
      case 'items': {
        const p = await projectFor(ctx, a.project, [['PUT', `/reviews/${n}/items`]]);
        await q.saveItems(ctx.userId, p.id, n, { items: a.items, add: a.addQuestions } as Parameters<typeof q.saveItems>[3]);
        return { review: n, items: a.items?.length ?? 0, added: a.addQuestions?.length ?? 0 };
      }
      case 'transition': {
        if (!a.to) throw new BadRequestError('transition needs to', 'VALIDATION_ERROR');
        const p = await projectFor(ctx, a.project, [['POST', `/reviews/${n}/transition`]]);
        await q.transitionReview(ctx.userId, p.id, n, a.to);
        return { review: n, status: a.to };
      }
      case 'defect': {
        if (!a.item) throw new BadRequestError('defect needs item', 'VALIDATION_ERROR');
        const p = await projectFor(ctx, a.project, [['POST', `/reviews/${n}/items/${a.item}/defect`]]);
        return { review: n, defect: await q.logReviewDefect(ctx.userId, p.id, n, a.item, { title: a.title ?? null }) };
      }
    }
    throw new BadRequestError('Unknown action', 'VALIDATION_ERROR');
  },
});

const reviewDelete = defineTool({
  name: 'review_delete', title: 'Delete a review', group: 'tests',
  description: 'DESTRUCTIVE: deletes a review / inspection record with its checklist results. The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, number: z.number().int().positive() }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete reviews');
    W(ctx);
    const p = await projectFor(ctx, a.project, [['DELETE', `/reviews/${a.number}`]]);
    await q.deleteReview(ctx.userId, p.id, a.number);
    return { deleted: a.number };
  },
});

async function versionIdOf(projectId: number, r: number | string): Promise<number> {
  if (typeof r === 'number') return r;
  const v = await prisma.workVersion.findFirst({ where: { projectId, name: { equals: r.trim(), mode: 'insensitive' } }, select: { id: true } });
  if (!v) throw new NotFoundError(`Version "${r}" not found — call versions`);
  return v.id;
}
const versionRef = ref('Version id or name');

const versions = defineTool({
  name: 'versions', title: 'Versions / releases', group: 'planning',
  description: 'Without version: lists the project versions (fix versions / releases) with status and progress. With version: its issues and release notes.',
  write: false,
  input: z.object({ project: projectArg, version: versionRef.optional() }),
  run: async (ctx, a) => {
    if (a.version === undefined) { const p = await projectFor(ctx, a.project, [['GET', '/versions']]); return untrusted('versions', json(await planning.listVersions(ctx.userId, p.id))); }
    const p0 = await projectFor(ctx, a.project, []);
    const id = await versionIdOf(p0.id, a.version);
    const p = await projectFor(ctx, a.project, [['GET', `/versions/${id}`]]);
    return untrusted(`version ${id}`, json(await planning.versionDetail(ctx.userId, p.id, id)));
  },
});

const versionManage = defineTool({
  name: 'version_manage', title: 'Create / edit / release a version', group: 'planning',
  description: 'action create (name, description, start/release date) | update (name, description, dates, release notes, status UNRELEASED/ARCHIVED) | release (unresolved issues move to moveTo version, or stay with none).',
  write: true, personOnly: true,
  input: z.object({
    project: projectArg, action: z.enum(['create', 'update', 'release']), version: versionRef.optional(), name: z.string().min(1).max(60).optional(),
    description: z.string().max(5000).nullable().optional(), startDate: ymd.nullable().optional(), releaseDate: ymd.nullable().optional(),
    releaseNotes: z.string().max(50_000).nullable().optional(), status: z.enum(['UNRELEASED', 'ARCHIVED']).optional(), moveTo: versionRef.optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'manage versions');
    W(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    if (a.action === 'create') {
      if (!a.name) throw new BadRequestError('create needs a name', 'VALIDATION_ERROR');
      const p = await projectFor(ctx, a.project, [['POST', '/versions']]);
      const v = await planning.createVersion(ctx.userId, p.id, { name: a.name, description: a.description ?? null, startDate: a.startDate ?? null, releaseDate: a.releaseDate ?? null }) as { id: number };
      return { created: v.id };
    }
    if (a.version === undefined) throw new BadRequestError(`${a.action} needs the version`, 'VALIDATION_ERROR');
    const id = await versionIdOf(p0.id, a.version);
    if (a.action === 'update') {
      const p = await projectFor(ctx, a.project, [['PATCH', `/versions/${id}`]]);
      await planning.updateVersion(ctx.userId, p.id, id, patchOf({ name: a.name, description: a.description, startDate: a.startDate, releaseDate: a.releaseDate, releaseNotes: a.releaseNotes, status: a.status }, []) as Parameters<typeof planning.updateVersion>[3]);
      return { updated: id };
    }
    const p = await projectFor(ctx, a.project, [['POST', `/versions/${id}/release`]]);
    await planning.releaseVersion(ctx.userId, p.id, id, { moveUnresolvedTo: a.moveTo !== undefined ? await versionIdOf(p0.id, a.moveTo) : null, releaseDate: a.releaseDate });
    return { released: id };
  },
});

const versionDelete = defineTool({
  name: 'version_delete', title: 'Delete a version', group: 'planning',
  description: 'DESTRUCTIVE: deletes a version; issues lose it as fix version. The user must confirm.',
  ...DEL,
  input: z.object({ project: projectArg, version: versionRef }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete versions');
    W(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const id = await versionIdOf(p0.id, a.version);
    const p = await projectFor(ctx, a.project, [['DELETE', `/versions/${id}`]]);
    await planning.deleteVersion(ctx.userId, p.id, id);
    return { deleted: id };
  },
});

// ═══ Lớp học — phía giảng viên (KHÔNG chấm điểm) ═════════════════

const linkArr = z.array(z.object({ url: z.string().min(1).max(2000), title: z.string().max(200).optional() })).max(10);

const classContent = defineTool({
  name: 'class_content', title: 'Class stream and materials', group: 'teaching',
  description: 'Reads a class: what = class (info, groups, roster with ids, join code for teachers) | stream (announcements with post + comment ids) | materials (topics + materials) | quiz_bank (questions with ids) | quizzes. Assignments: class_work.',
  write: false,
  input: z.object({ classId: z.number().int().positive(), what: z.enum(['class', 'stream', 'materials', 'quiz_bank', 'quizzes']) }),
  run: async (ctx, a) => {
    const seg = { class: '', stream: '/stream', materials: '/materials', quiz_bank: '/quiz-bank', quizzes: '/quizzes' }[a.what];
    await topRoute(ctx, 'GET', `/classes/${a.classId}${seg}`, 'use classes');
    const u = ctx.userId, c = a.classId;
    const data = a.what === 'class' ? await classroom.getClass(u, c) : a.what === 'stream' ? await stream.listStream(u, c, { limit: 30 }) : a.what === 'materials' ? await mats.listMaterials(u, c)
      : a.what === 'quiz_bank' ? await quiz.listBank(u, c, { drafts: true }) : await quiz.listQuizzes(u, c);
    return untrusted(`class ${a.what}`, json(data));
  },
});

const classPost = defineTool({
  name: 'class_post', title: 'Post / edit a class announcement', group: 'teaching',
  description: 'Teachers: posts an announcement to the class stream (Markdown text, title, links, pinned, scheduled publishAt ISO time), or edits post (id) — no post = new. Students get notified as on the web.',
  write: true, personOnly: true,
  input: z.object({
    classId: z.number().int().positive(), post: z.number().int().positive().optional(), title: z.string().max(255).nullable().optional(), markdown: z.string().max(30_000).optional(),
    links: linkArr.optional(), pinned: z.boolean().optional(), publishAt: z.string().max(40).nullable().optional(), commentsOff: z.boolean().optional(),
    fileIds: z.array(z.number().int().positive()).max(10).optional().describe('Files uploaded with class_admin file_upload'),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'post to classes');
    W(ctx);
    const input: stream.PostInput = patchOf({ title: a.title, bodyJson: a.markdown !== undefined ? docOf(a.markdown) : undefined, links: a.links, pinned: a.pinned, publishAt: a.publishAt, commentsOff: a.commentsOff, fileIds: a.fileIds }, []);
    if (a.post) {
      await topRoute(ctx, 'PATCH', `/classes/${a.classId}/stream/${a.post}`, 'post to classes');
      await stream.updatePost(ctx.userId, a.classId, a.post, input);
      return { updated: a.post };
    }
    await topRoute(ctx, 'POST', `/classes/${a.classId}/stream`, 'post to classes');
    const r = await stream.createPost(ctx.userId, a.classId, input) as { id: number };
    return { posted: r.id };
  },
});

const classMaterial = defineTool({
  name: 'class_material', title: 'Add / edit class materials and topics', group: 'teaching',
  description: 'Teachers: kind material — add (no id) or edit (id) a material: title, description, type SLIDE/SYLLABUS/FILE/LINK/VIDEO, links, topic id, draft. kind topic — add/edit a topic (title, week).',
  write: true, personOnly: true,
  input: z.object({
    classId: z.number().int().positive(), kind: z.enum(['material', 'topic']), id: z.number().int().positive().optional(),
    title: z.string().max(255).optional(), description: z.string().max(5000).nullable().optional(), type: z.enum(MATERIAL_KINDS).optional(),
    links: linkArr.optional(), topicId: z.number().int().positive().nullable().optional(), draft: z.boolean().optional(), week: z.number().int().min(0).max(60).nullable().optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'manage class materials');
    W(ctx);
    if (a.kind === 'topic') {
      const input = patchOf({ title: a.title, week: a.week }, []) as mats.TopicInput;
      await topRoute(ctx, a.id ? 'PATCH' : 'POST', `/classes/${a.classId}/topics${a.id ? `/${a.id}` : ''}`, 'manage class materials');
      const r = a.id ? await mats.updateTopic(ctx.userId, a.classId, a.id, input) : await mats.createTopic(ctx.userId, a.classId, input);
      return { [a.id ? 'updated' : 'created']: a.id ?? (r as { id?: number }).id ?? r };
    }
    const input = patchOf({ title: a.title, description: a.description, kind: a.type, links: a.links, topicId: a.topicId, draft: a.draft }, []) as mats.MaterialInput;
    await topRoute(ctx, a.id ? 'PATCH' : 'POST', `/classes/${a.classId}/materials${a.id ? `/${a.id}` : ''}`, 'manage class materials');
    const r = a.id ? await mats.updateMaterial(ctx.userId, a.classId, a.id, input) : await mats.createMaterial(ctx.userId, a.classId, input);
    return { [a.id ? 'updated' : 'created']: a.id ?? (r as { id?: number }).id ?? r };
  },
});

const classAssignment = defineTool({
  name: 'class_assignment', title: 'Create / edit a class assignment', group: 'teaching',
  description: 'Teachers: creates (no assignment) or edits an assignment — title, instructions (Markdown), INDIVIDUAL/GROUP, category, topic, max points, due date (ISO), publish NOW/SCHEDULE/DRAFT (+ publishAt), late rules. Grading and returning work stay with the teacher on the web.',
  write: true, personOnly: true,
  input: z.object({
    classId: z.number().int().positive(), assignment: z.number().int().positive().optional(), title: z.string().max(200).optional(), markdown: z.string().max(30_000).optional(),
    kind: z.enum(['INDIVIDUAL', 'GROUP']).optional(), category: z.string().max(40).optional(), topic: z.string().max(80).nullable().optional(),
    maxPoints: z.number().positive().max(1000).optional(), dueAt: z.string().max(40).nullable().optional(), publish: z.enum(['NOW', 'SCHEDULE', 'DRAFT']).optional(),
    publishAt: z.string().max(40).nullable().optional(), allowLate: z.boolean().optional(), latePenaltyPct: z.number().min(0).max(100).optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'manage assignments');
    W(ctx);
    const { classId, assignment, markdown, ...rest } = a;
    const input = patchOf({ ...rest, description: markdown !== undefined ? docOf(markdown) : undefined }, []) as classwork.AssignmentInput;
    await topRoute(ctx, assignment ? 'PATCH' : 'POST', `/classes/${classId}/assignments${assignment ? `/${assignment}` : ''}`, 'manage assignments');
    const r = assignment ? await classwork.updateAssignment(ctx.userId, classId, assignment, input) : await classwork.createAssignment(ctx.userId, classId, input);
    return { [assignment ? 'updated' : 'created']: assignment ?? (r as { id?: number }).id ?? r };
  },
});

const classContentDelete = defineTool({
  name: 'class_content_delete', title: 'Delete a class post / material / topic / assignment', group: 'teaching',
  description: 'DESTRUCTIVE: teachers delete a stream post, material, topic, assignment (takes its submissions with it), stream comment, student from the roster, schedule (future sessions), session, bank question (archived), quiz, uploaded stream file, assignment file, or a file of YOUR submission (my_file). The user must confirm.',
  ...DEL,
  input: z.object({ classId: z.number().int().positive(), kind: z.enum(['post', 'material', 'topic', 'assignment', 'stream_comment', 'student', 'schedule', 'session', 'question', 'quiz', 'stream_file', 'assignment_file', 'my_file']), id: z.number().int().positive(), assignment: z.number().int().positive().optional().describe('assignment_file / my_file: the assignment') }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete class content');
    W(ctx);
    const seg = { post: 'stream', material: 'materials', topic: 'topics', assignment: 'assignments', stream_comment: 'stream-comments', student: 'roster', schedule: 'schedules', session: 'sessions', question: 'quiz-bank', quiz: 'quizzes', stream_file: 'stream-files', assignment_file: `assignments/${a.assignment}/files`, my_file: `assignments/${a.assignment}/my/files` }[a.kind];
    if ((a.kind === 'assignment_file' || a.kind === 'my_file') && !a.assignment) throw new BadRequestError(`${a.kind} needs assignment`, 'VALIDATION_ERROR');
    await topRoute(ctx, 'DELETE', `/classes/${a.classId}/${seg}/${a.id}`, 'delete class content');
    const u = ctx.userId, c = a.classId, i = a.id;
    switch (a.kind) {
      case 'post': await stream.deletePost(u, c, i); break;
      case 'material': await mats.deleteMaterial(u, c, i); break;
      case 'topic': await mats.deleteTopic(u, c, i); break;
      case 'assignment': await classwork.deleteAssignment(u, c, i); break;
      case 'stream_comment': await stream.deleteComment(u, c, i); break;
      case 'student': await classroom.removeStudent(u, c, i); break;
      case 'schedule': await cal.deleteSeries(u, c, i); break;
      case 'session': await cal.deleteSession(u, c, i); break;
      case 'question': await quiz.archiveQuestion(u, c, i); break;
      case 'quiz': await quiz.deleteQuiz(u, c, i); break;
      case 'stream_file': await stream.deleteDraftFile(u, c, i); break;
      case 'assignment_file': await classwork.removeAssignmentFile(u, c, a.assignment!, i); break;
      case 'my_file': await classwork.removeSubmissionFile(u, c, a.assignment!, i); break;
    }
    return { deleted: { kind: a.kind, id: a.id } };
  },
});

/** Chỉ MCP (như parity.ts). */
export const PARITY2_COMMANDS: ToolDef[] = [
  swrGlossaryUpdate, swrDictionaryUpdate, swrPriorityUpdate, swrSurveyUpdate, swrMockupUpdate, swrDelete,
  traceLinks, traceLinkRemove,
  changeRequests, crManage, crDelete,
  chatChannelManage, chatMessageAct,
  docsComments, docsCommentResolve, docsCommentDelete,
  meetingAttendeesSet, meetingAgendaSet,
  testPlans, testPlanManage, testPlanDelete, testDesigns, testDesignSave, testDesignExport, testDesignDelete, fptImport,
  pokerSession, retroSession, agileDelete,
  reviews, reviewManage, reviewDelete, versions, versionManage, versionDelete,
  classContent, classPost, classMaterial, classAssignment, classContentDelete,
].map(mcpOnly);
