/**
 * Registry lệnh — 21/10/2026 đợt 3: CUONGMINI NGANG QUYỀN NGƯỜI — phần còn lại của docs/cuongmini-ctwork-parity.md.
 *
 * Gộp theo `action` (một lệnh / một khu) để mục lục MCP của token người không vượt trần (registry.test: ≤ 280):
 *   class_admin (lớp, roster, lịch/buổi, cài đặt, sắp xếp, vào lớp, bình luận stream) · class_quiz (ngân hàng câu hỏi + soạn quiz,
 *   KHÔNG làm bài / chấm) · swr_extras (RACI, seed, ước lượng, đánh dấu chất lượng, đề xuất từ elicitation, NFR từ mẫu, gửi mockup) ·
 *   issue_extras (ghi chú cá nhân, react bình luận, chuyển dự án, bàn giao, lưu web link vào Resources, huỷ yêu cầu duyệt) ·
 *   issue_bulk · service_desk · chat_extras (gửi tệp, chuyển tiếp, thông báo kênh, đã đọc, nhắn riêng) · docs_extras (bình luận NEO
 *   đoạn văn — chèn neo bằng bản sửa có baseVersion; bật/tắt đồng soạn) · meeting_extras (nhân bản, áp mẫu, link ghi hình, chuỗi họp) ·
 *   dashboard_save · exploratory_manage · wbs_manage · resource_extras · planning_extras (baseline, bộ lọc) · fpt_reports_manage
 *   (thông tin môn/nhóm, báo cáo tuần, AI usage) · contrib_manage (cài đặt, tác giả git, vòng đánh giá chéo, chấm chéo CỦA NGƯỜI
 *   DÙNG) · form_manage · governance_extras (liên kết RAID, rủi ro mẫu, Q&A ⇒ mục mới, phạm vi + thẻ thực hiện CR) · diagram_extras ·
 *   test_extras · ctwork_delete (xoá mọi thứ còn lại — destructive) · ctwork_read (đọc gom).
 * Vẫn KHÔNG có: chấm điểm / trả bài / sổ điểm / điểm danh / làm quiz; quyết định duyệt; nhận/bỏ đề xuất AI; gửi khách; tài chính.
 */

import { Prisma } from '@prisma/client';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { prisma } from '../../../config/database.js';
import { BadRequestError, NotFoundError } from '../../../middleware/errorHandler.js';
import { issueNumber, projectFor, requirePerson, requireWrite, type McpCtx, type ProjectHit } from '../../../mcp/context.js';
import { untrusted } from '../../../mcp/protocol.js';
import { issueArg, projectArg } from '../../../mcp/tools/read.js';
import * as approvals from '../approvals.service.js';
import { BASELINE_KINDS } from '../baselineRules.js';
import * as chat from '../chat.service.js';
import * as chatFiles from '../chatFiles.service.js';
import { CHANNEL_NOTIFY, MUTE_CHOICES } from '../chatRules.js';
import * as crs from '../changeRequests.service.js';
import * as cal from '../classCalendar.service.js';
import * as mats from '../classMaterials.service.js';
import * as classroom from '../classroom.service.js';
import * as classwork from '../classwork.service.js';
import * as stream from '../classStream.service.js';
import * as collab from '../collab.service.js';
import * as contrib from '../contrib.service.js';
import * as peer from '../contribPeer.service.js';
import * as dg from '../diagrams.service.js';
import { markdownToTiptap } from '../docMarkdown.js';
import * as forms from '../forms.service.js';
import { FORM_FIELD_KINDS } from '../formRules.js';
import * as rep from '../fptReports.service.js';
import * as handoffs from '../handoffs.service.js';
import { moveIssueToProject } from '../issueMove.service.js';
import * as issues from '../issues.service.js';
import * as meetings from '../meetings.service.js';
import * as rec from '../meetingRec.service.js';
import * as series from '../meetingSeries.service.js';
import * as noteLinks from '../noteLinks.service.js';
import * as pages from '../pages.service.js';
import { agentForbidden, agentTopRouteAllowed } from '../permissions.js';
import * as q from '../quality.service.js';
import * as qna from '../qna.service.js';
import * as quiz from '../quiz.service.js';
import * as raid from '../raid.service.js';
import * as resources from '../resources.service.js';
import * as search from '../search.service.js';
import * as desk from '../serviceDesk.service.js';
import { DESK_LEVELS, DESK_PRIORITIES, PROBLEM_STATUSES, REQUEST_TYPE_KEYS } from '../slaRules.js';
import * as sprints from '../sprints.service.js';
import * as deep from '../srsDeep.service.js';
import * as swr from '../swr.service.js';
import { RACI_ROLES } from '../swr6b.js';
import * as elic from '../swrElic.service.js';
import * as pack from '../swrPack.service.js';
import { CLASS_SUBJECTS } from '../teachingRules.js';
import * as autoTests from '../testAutomation.service.js';
import * as stat from '../staticAnalysis.service.js';
import * as okr from '../okr.service.js';
import { PHASES, ROOT_CAUSES, TEST_LEVELS } from '../testMetrics.js';
import * as t from '../testMgmt.service.js';
import * as tests from '../tests.service.js';
import * as uxc from '../uxc.service.js';
import { assigneeIdOf, sprintIdOf, sprintRefArg } from './personOps.js';
import { defineTool, mcpOnly, type ToolDef } from './types.js';

const json = (v: unknown) => JSON.stringify(v, null, 2);
const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const docOf = (markdown: string) => markdownToTiptap(markdown).doc as unknown as Prisma.InputJsonValue;
const W = (ctx: McpCtx) => requireWrite(ctx);
const bad = (m: string) => new BadRequestError(m, 'VALIDATION_ERROR');
const need = <T>(v: T | undefined | null, what: string): T => { if (v === undefined || v === null) throw bad(`This action needs ${what}`); return v; };

function numOf(ref: number | string, what: string): number {
  const n = typeof ref === 'number' ? ref : Number(/(\d+)\s*$/.exec(ref)?.[1] ?? NaN);
  if (!Number.isInteger(n) || n <= 0) throw bad(`"${String(ref)}" is not a ${what}`);
  return n;
}
function parseJson(s: string, what: string): unknown {
  try { return JSON.parse(s); } catch { throw bad(`${what} is not valid JSON`); }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- đã kiểm từng trường bằng zod của lệnh; service nhận kiểu riêng
function defined(o: Record<string, unknown>): any {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
}
async function userIds(ctx: McpCtx, p: ProjectHit, names: string[]): Promise<number[]> {
  const out: number[] = [];
  for (const n of names) { const id = await assigneeIdOf(ctx, p, n); if (id) out.push(id); }
  return out;
}
async function topRoute(ctx: McpCtx, method: string, path: string, verb: string): Promise<void> {
  if (ctx.agent && !agentTopRouteAllowed(method, path, !!ctx.agent.projectIds)) throw await agentForbidden(ctx.agent.userId, verb);
}
/** projectFor với tuyến tương đương + requireWrite. */
async function hit(ctx: McpCtx, project: string, method: string, path: string): Promise<ProjectHit> {
  if (method !== 'GET') W(ctx);
  return projectFor(ctx, project, [[method, path]]);
}

// ═══ Lớp học — quản trị (không chấm) ═════════════════════════════

const CLASS_ACTIONS = ['create_class', 'update_class', 'settings', 'join_code', 'join', 'roster_preview', 'roster_import', 'roster_invite', 'schedule_add', 'session_add', 'session_update', 'reorder_materials', 'reorder_topics', 'comment_add', 'comment_hide', 'comment_unhide', 'file_upload'] as const;
const classAdmin = defineTool({
  name: 'class_admin', title: 'Manage a class (roster, schedule, settings)', group: 'teaching',
  description: 'Classroom admin for teachers (and joining for students). action: create_class (subject, classCode, term, name, iAmTeacher, maxGroupSize, week1Start, timezone) | update_class (name, maxGroupSize, joinOpen, archived, week1Start, timezone, teacherEmail) | settings (streamComments, absenceThreshold, lateAfterMin) | join_code (new code; joinExpiresInDays) | join (code, joinAction JOIN/JOIN_GROUP/CREATE_GROUP/TEACH, groupId/groupName, studentCode) | roster_preview / roster_import (csv text or xlsxBase64; confirm) | roster_invite (studentIds, confirm) | schedule_add (title, recurrence {freq, interval, byWeekday, hour, minute, startDate, endDate}, durationMin, location, meetingUrl) | session_add / session_update (session id; title, startsAt ISO, durationMin, location, meetingUrl, status SCHEDULED/CANCELLED) | reorder_materials (topicId, ids) | reorder_topics (ids) | comment_add (post, text) | comment_hide / comment_unhide (comment) | file_upload (base64 ≤ 6 MB, fileName, mime; assignment id ⇒ attached to that assignment, else a stream file whose id goes in class_post fileIds). Grading, returning work and taking attendance stay with the teacher on the web; removals: class_content_delete.',
  write: true, personOnly: true,
  input: z.object({
    action: z.enum(CLASS_ACTIONS), classId: z.number().int().positive().optional(),
    subject: z.enum(CLASS_SUBJECTS).optional(), classCode: z.string().min(1).max(32).optional(), term: z.string().min(1).max(16).optional(), name: z.string().max(120).optional(),
    iAmTeacher: z.boolean().optional(), teacherEmail: z.string().max(100).nullable().optional(), maxGroupSize: z.number().int().min(1).max(10).optional(),
    joinOpen: z.boolean().optional(), archived: z.boolean().optional(), week1Start: ymd.nullable().optional(), timezone: z.string().max(64).optional(),
    joinExpiresInDays: z.number().int().min(1).max(180).nullable().optional(), streamComments: z.boolean().optional(),
    absenceThreshold: z.number().int().min(1).max(100).optional(), lateAfterMin: z.number().int().min(0).max(240).optional(),
    code: z.string().max(32).optional(), joinAction: z.enum(['JOIN', 'JOIN_GROUP', 'CREATE_GROUP', 'TEACH']).optional(), groupId: z.number().int().positive().optional(),
    groupName: z.string().max(80).optional(), studentCode: z.string().max(20).optional(), projectKey: z.string().max(10).optional(),
    csv: z.string().max(1_000_000).optional(), xlsxBase64: z.string().max(3_000_000).optional(), confirm: z.boolean().optional(), studentIds: z.array(z.number().int().positive()).max(500).optional(),
    title: z.string().max(120).optional(),
    recurrence: z.object({
      freq: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']), interval: z.number().int().min(1).max(12).optional(), byWeekday: z.array(z.number().int().min(0).max(6)).max(7).optional(),
      hour: z.number().int().min(0).max(23), minute: z.number().int().min(0).max(59), startDate: ymd, endDate: ymd.nullable().optional(),
    }).optional(),
    durationMin: z.number().int().min(5).max(600).optional(), location: z.string().max(255).nullable().optional(), meetingUrl: z.string().max(500).nullable().optional(),
    session: z.number().int().positive().optional(), startsAt: z.string().max(40).optional(), status: z.enum(['SCHEDULED', 'CANCELLED']).optional(),
    topicId: z.number().int().positive().nullable().optional(), ids: z.array(z.number().int().positive()).max(400).optional(),
    post: z.number().int().positive().optional(), comment: z.number().int().positive().optional(), text: z.string().min(1).max(4000).optional(),
    base64: z.string().max(8_500_000).optional(), fileName: z.string().max(255).optional(), mime: z.string().max(100).optional(), assignment: z.number().int().positive().optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'manage classes');
    W(ctx);
    if (a.action === 'create_class') {
      await topRoute(ctx, 'POST', '/classes', 'manage classes');
      const c = await classroom.createClass(ctx.userId, defined({ name: a.name, subject: need(a.subject, 'subject'), classCode: need(a.classCode, 'classCode'), term: need(a.term, 'term'), iAmTeacher: a.iAmTeacher, teacherEmail: a.teacherEmail, maxGroupSize: a.maxGroupSize, joinExpiresInDays: a.joinExpiresInDays, week1Start: a.week1Start, timezone: a.timezone }) as Parameters<typeof classroom.createClass>[1]) as { id: number; joinCode?: string };
      return { created: c.id, joinCode: c.joinCode ?? null };
    }
    if (a.action === 'join') {
      const code = need(a.code, 'code');
      await topRoute(ctx, 'POST', `/classes/join/${code}`, 'join classes');
      return { joined: await classroom.joinClass(ctx.userId, code, defined({ action: a.joinAction ?? 'JOIN', groupId: a.groupId, groupName: a.groupName, projectKey: a.projectKey, studentCode: a.studentCode }) as Parameters<typeof classroom.joinClass>[2]) };
    }
    const cid = need(a.classId, 'classId');
    const go = async (method: string, path: string) => topRoute(ctx, method, `/classes/${cid}${path}`, 'manage classes');
    switch (a.action) {
      case 'update_class': await go('PATCH', ''); return { updated: await classroom.updateClass(ctx.userId, cid, defined({ name: a.name, maxGroupSize: a.maxGroupSize, joinOpen: a.joinOpen, teacherEmail: a.teacherEmail, week1Start: a.week1Start, archived: a.archived, timezone: a.timezone }) as Parameters<typeof classroom.updateClass>[2]) };
      case 'settings': await go('PATCH', '/classroom-settings'); return { settings: await stream.updateClassroomSettings(ctx.userId, cid, defined({ streamComments: a.streamComments, absenceThreshold: a.absenceThreshold, lateAfterMin: a.lateAfterMin })) };
      case 'join_code': await go('POST', '/join-code'); return { joinCode: await classroom.regenerateJoinCode(ctx.userId, cid, { expiresInDays: a.joinExpiresInDays }) };
      case 'roster_preview': case 'roster_import': {
        await go('POST', `/roster/${a.action === 'roster_preview' ? 'preview' : 'import'}`);
        const src = defined({ csv: a.csv, xlsxBase64: a.xlsxBase64 }) as Parameters<typeof classroom.previewRoster>[2];
        return a.action === 'roster_preview' ? { preview: await classroom.previewRoster(ctx.userId, cid, src) } : { imported: await classroom.importRoster(ctx.userId, cid, { ...src, confirm: a.confirm }) };
      }
      case 'roster_invite': await go('POST', '/roster/invite'); return { invited: await classroom.inviteRoster(ctx.userId, cid, { studentIds: a.studentIds, confirm: a.confirm }) };
      case 'schedule_add': await go('POST', '/schedules'); return { schedule: await cal.createSeries(ctx.userId, cid, defined({ title: need(a.title, 'title'), recurrence: need(a.recurrence, 'recurrence'), durationMin: a.durationMin, location: a.location, meetingUrl: a.meetingUrl }) as Parameters<typeof cal.createSeries>[2]) };
      case 'session_add': case 'session_update': {
        const body = defined({ title: a.title, startsAt: a.startsAt, durationMin: a.durationMin, location: a.location, meetingUrl: a.meetingUrl, status: a.status }) as Parameters<typeof cal.createSession>[2];
        if (a.action === 'session_add') { await go('POST', '/sessions'); return { session: await cal.createSession(ctx.userId, cid, body) }; }
        const sid = need(a.session, 'session');
        await go('PATCH', `/sessions/${sid}`);
        return { session: await cal.updateSession(ctx.userId, cid, sid, body) };
      }
      case 'reorder_materials': await go('PUT', '/materials-order'); return { order: await mats.reorderMaterials(ctx.userId, cid, { topicId: a.topicId ?? null, ids: need(a.ids, 'ids') }) };
      case 'reorder_topics': await go('PUT', '/topics-order'); return { order: await mats.reorderTopics(ctx.userId, cid, need(a.ids, 'ids')) };
      case 'comment_add': { const pid = need(a.post, 'post'); await go('POST', `/stream/${pid}/comments`); return { comment: await stream.addComment(ctx.userId, cid, pid, need(a.text, 'text')) }; }
      case 'comment_hide': case 'comment_unhide': { const c = need(a.comment, 'comment'); await go('PATCH', `/stream-comments/${c}`); return { comment: await stream.setCommentHidden(ctx.userId, cid, c, a.action === 'comment_hide') }; }
      case 'file_upload': {
        const buffer = Buffer.from(need(a.base64, 'base64').replace(/^data:[^,]*,/, ''), 'base64');
        if (!buffer.length) throw bad('The file is empty');
        const fileName = need(a.fileName, 'fileName');
        if (a.assignment) { await go('POST', `/assignments/${a.assignment}/files`); return { file: await classwork.uploadAssignmentFile(ctx.userId, cid, a.assignment, { buffer, fileName }) }; }
        await go('POST', '/stream-files');
        return { file: await stream.uploadClassFile(ctx.userId, cid, { buffer, fileName, mime: a.mime ?? 'application/octet-stream' }), note: 'Pass this file id in class_post fileIds' };
      }
    }
    throw bad('Unknown action');
  },
});

const classQuiz = defineTool({
  name: 'class_quiz', title: 'Author class quizzes (question bank + quizzes)', group: 'teaching',
  description: 'Teachers author quizzes — never take or grade them. action: question_add (questionJson = {type SINGLE|MULTI|TRUE_FALSE|SHORT|MATCH, topic, prompt, options, answer {correct|value|accepted}, points, explanation}) | question_update (question id, questionJson) | question_approve (question id — approves a draft into the bank) | questions_import (format table|aiken|gift, text or xlsxBase64, topic, confirm) | quiz_create / quiz_update (quiz id; title, description, topic, items [{questionId, points} or {drawTopic, count}], openAt, closeAt, timeLimitMin, maxAttempts, shuffleQuestions, shuffleOptions) | quiz_publish / quiz_unpublish | question_image (imageBase64 ⇒ an image URL to use as imageUrl in questionJson). Remove: class_content_delete (question / quiz).',
  write: true, personOnly: true,
  input: z.object({
    action: z.enum(['question_add', 'question_update', 'question_approve', 'questions_import', 'question_image', 'quiz_create', 'quiz_update', 'quiz_publish', 'quiz_unpublish']),
    imageBase64: z.string().max(4_200_000).optional(),
    classId: z.number().int().positive(), question: z.number().int().positive().optional(), questionJson: z.string().max(40_000).optional(),
    format: z.enum(['table', 'aiken', 'gift']).optional(), text: z.string().max(1_000_000).optional(), xlsxBase64: z.string().max(4_000_000).optional(), topic: z.string().max(80).optional(), confirm: z.boolean().optional(),
    quiz: z.number().int().positive().optional(), title: z.string().max(200).optional(), description: z.string().max(8000).nullable().optional(),
    items: z.array(z.object({ questionId: z.number().int().positive().optional(), drawTopic: z.string().max(80).optional(), count: z.number().int().min(1).max(200).optional(), points: z.number().positive().max(100).nullable().optional() })).max(200).optional(),
    openAt: z.string().max(40).nullable().optional(), closeAt: z.string().max(40).nullable().optional(), timeLimitMin: z.number().int().min(1).max(600).nullable().optional(),
    maxAttempts: z.number().int().min(1).max(20).optional(), shuffleQuestions: z.boolean().optional(), shuffleOptions: z.boolean().optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'author quizzes');
    W(ctx);
    const cid = a.classId;
    const go = (m: string, p: string) => topRoute(ctx, m, `/classes/${cid}${p}`, 'author quizzes');
    switch (a.action) {
      case 'question_add': await go('POST', '/quiz-bank'); return { question: await quiz.createQuestion(ctx.userId, cid, parseJson(need(a.questionJson, 'questionJson'), 'questionJson')) };
      case 'question_update': case 'question_approve': {
        const qid = need(a.question, 'question');
        await go('PATCH', `/quiz-bank/${qid}`);
        return { question: await quiz.updateQuestion(ctx.userId, cid, qid, a.action === 'question_approve' ? { approve: true } : { question: parseJson(need(a.questionJson, 'questionJson'), 'questionJson') }) };
      }
      case 'question_image': await go('POST', '/quiz-bank/image'); return { image: await quiz.uploadImage(ctx.userId, cid, { dataBase64: need(a.imageBase64, 'imageBase64') }) };
      case 'questions_import': await go('POST', '/quiz-bank/import'); return { imported: await quiz.importQuestions(ctx.userId, cid, defined({ format: need(a.format, 'format'), text: a.text, xlsxBase64: a.xlsxBase64, topic: a.topic, confirm: a.confirm }) as Parameters<typeof quiz.importQuestions>[2]) };
      case 'quiz_create': case 'quiz_update': {
        const items = a.items?.map((i) => (i.questionId ? { kind: 'Q' as const, questionId: i.questionId, points: i.points ?? null } : { kind: 'DRAW' as const, topic: need(i.drawTopic, 'drawTopic'), count: i.count ?? 1, points: i.points ?? null }));
        const body = defined({ title: a.title, description: a.description, topic: a.topic, items, openAt: a.openAt, closeAt: a.closeAt, timeLimitMin: a.timeLimitMin, maxAttempts: a.maxAttempts, shuffleQuestions: a.shuffleQuestions, shuffleOptions: a.shuffleOptions }) as Parameters<typeof quiz.createQuiz>[2];
        if (a.action === 'quiz_create') { await go('POST', '/quizzes'); return { quiz: await quiz.createQuiz(ctx.userId, cid, body) }; }
        const qz = need(a.quiz, 'quiz');
        await go('PATCH', `/quizzes/${qz}`);
        return { quiz: await quiz.updateQuiz(ctx.userId, cid, qz, body) };
      }
      case 'quiz_publish': case 'quiz_unpublish': { const qz = need(a.quiz, 'quiz'); await go('POST', `/quizzes/${qz}/publish`); return { quiz: await quiz.publishQuiz(ctx.userId, cid, qz, a.action === 'quiz_publish') }; }
    }
    throw bad('Unknown action');
  },
});

// ═══ SWR302 phần phụ ═════════════════════════════════════════════

const swrExtras = defineTool({
  name: 'swr_extras', title: 'SWR302 extras (RACI, seeding, estimation, quality, proposals)', group: 'srs',
  description: 'action: raci_activity_add (name, or defaults=true for the standard activities) | raci_set (activityId, stakeholder SH-2, role R/A/C/I or null) | seed_priority (kind FE/UC — one priority row per feature/use case) | seed_stakeholders (from SRS actors) | estimation_set (estimationJson = {counts, project, factors, minutes} as on the Estimation tab) | quality_mark (requirement issue, criteria [{criterion, value true/false/null}]) | proposal_add (session ELC-1; title, text, reqType, priority, stakeholder) | nfr_from_template (template key, title) | mockup_submit (mockup id, share) | elicitation_meeting (session ELC-1; meeting number to link, or createMeeting=true).',
  write: true, personOnly: true,
  input: z.object({
    project: projectArg, action: z.enum(['raci_activity_add', 'raci_set', 'seed_priority', 'seed_stakeholders', 'estimation_set', 'quality_mark', 'proposal_add', 'nfr_from_template', 'mockup_submit', 'elicitation_meeting']),
    meeting: z.number().int().positive().nullable().optional(), createMeeting: z.boolean().optional(),
    name: z.string().max(160).optional(), defaults: z.boolean().optional(), activityId: z.number().int().positive().optional(),
    stakeholder: z.union([z.number().int().positive(), z.string().max(12)]).optional(), role: z.enum(RACI_ROLES).nullable().optional(), kind: z.enum(['FE', 'UC']).optional(),
    estimationJson: z.string().max(100_000).optional(), requirement: issueArg.optional(),
    criteria: z.array(z.object({ criterion: z.string().max(40), value: z.boolean().nullable() })).max(20).optional(),
    session: z.union([z.number().int().positive(), z.string().max(12)]).optional(), title: z.string().max(300).optional(), text: z.string().max(4000).nullable().optional(),
    reqType: z.enum(['BUSINESS', 'USER', 'FUNCTIONAL', 'QUALITY', 'CONSTRAINT', 'EXTERNAL_INTERFACE', 'DATA']).optional(), priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).nullable().optional(),
    template: z.string().max(40).optional(), mockup: z.number().int().positive().optional(), share: z.boolean().optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'edit requirements');
    const P = (m: string, p: string) => hit(ctx, a.project, m, p);
    switch (a.action) {
      case 'raci_activity_add': { const p = await P('POST', '/swr/raci/activities'); return { added: await elic.addRaciActivity(ctx.userId, p.id, defined({ name: a.name, defaults: a.defaults })) }; }
      case 'raci_set': { const p = await P('PUT', '/swr/raci/cells'); return { set: await elic.setRaciCell(ctx.userId, p.id, { activityId: need(a.activityId, 'activityId'), stakeholder: need(a.stakeholder, 'stakeholder'), role: a.role ?? null }) }; }
      case 'seed_priority': { const p = await P('POST', '/swr/priority/seed'); return { seeded: await swr.seedPriorityRows(ctx.userId, p.id, need(a.kind, 'kind')) }; }
      case 'seed_stakeholders': { const p = await P('POST', '/swr/stakeholders/seed-actors'); return { seeded: await elic.seedFromActors(ctx.userId, p.id) }; }
      case 'estimation_set': {
        const p = await P('PUT', '/swr/estimation');
        const r = pack.estimationInput.safeParse(parseJson(need(a.estimationJson, 'estimationJson'), 'estimationJson'));
        if (!r.success) throw bad(`estimationJson: ${r.error.issues[0]?.path.join('.')} ${r.error.issues[0]?.message}`);
        return { estimation: await pack.updateEstimation(ctx.userId, p.id, r.data) };
      }
      case 'quality_mark': {
        const p0 = await projectFor(ctx, a.project, []);
        const n = issueNumber(p0.key, need(a.requirement, 'requirement'));
        const p = await P('PUT', `/swr/quality/${n}`);
        const r = deep.manualInput.safeParse(Object.fromEntries(need(a.criteria, 'criteria').map((c) => [c.criterion, c.value])));
        if (!r.success) throw bad(`criteria: ${r.error.issues[0]?.message}`);
        return { quality: await deep.setManualQuality(ctx.userId, p.id, n, r.data) };
      }
      case 'proposal_add': {
        const s = numOf(need(a.session, 'session'), 'elicitation session');
        const p = await P('POST', `/swr/elicitation/${s}/proposals`);
        return { proposal: await elic.addProposal(ctx.userId, p.id, s, defined({ title: need(a.title, 'title'), text: a.text, reqType: a.reqType, priority: a.priority, stakeholder: a.stakeholder }) as Parameters<typeof elic.addProposal>[3]) };
      }
      case 'nfr_from_template': { const p = await P('POST', '/swr/nfr/from-template'); return { nfr: await deep.createNfrFromTemplate(ctx.userId, p.id, { template: need(a.template, 'template'), title: a.title ?? null }) }; }
      case 'elicitation_meeting': {
        const s = numOf(need(a.session, 'session'), 'elicitation session');
        const p = await P('POST', `/swr/elicitation/${s}/meeting`);
        return { linked: await elic.linkMeeting(ctx.userId, p.id, s, defined({ create: a.createMeeting, meeting: a.meeting })) };
      }
      case 'mockup_submit': { const m = need(a.mockup, 'mockup'); const p = await P('POST', `/swr/mockups/${m}/submit`); return { submitted: await deep.submitMockup(ctx.userId, p.id, m, { share: a.share }) }; }
    }
    throw bad('Unknown action');
  },
});

// ═══ Thẻ: phần phụ · sửa hàng loạt · service desk ═════════════════

const issueExtras = defineTool({
  name: 'issue_extras', title: 'Issue extras (notes, reactions, move, handoffs)', group: 'issues',
  description: 'action: note_link / note_unlink (noteId of YOUR personal note) | comment_react (comment id, emoji, active) | move_project (target project key in the same workspace) | handoff (to user or team id, checklist, note) | handoff_accept (handoff id, checklist ticks) | handoff_return (handoff id, reason) | handoff_cancel (handoff id) | web_link_save (link id ⇒ project Resources, groupId, tags) | approval_cancel (YOUR approval request id, reason).',
  write: true,
  input: z.object({
    project: projectArg, action: z.enum(['note_link', 'note_unlink', 'comment_react', 'move_project', 'handoff', 'handoff_accept', 'handoff_return', 'handoff_cancel', 'web_link_save', 'approval_cancel']),
    issue: issueArg.optional(), noteId: z.number().int().positive().optional(), comment: z.number().int().positive().optional(), emoji: z.string().max(16).optional(), active: z.boolean().optional(),
    targetProject: z.string().max(80).optional(), toUser: z.string().max(254).optional(), toTeamId: z.number().int().positive().optional(),
    checklist: z.array(z.string().min(1).max(300)).max(30).optional(), ticks: z.array(z.boolean()).max(30).optional(), note: z.string().max(5000).optional(),
    handoff: z.number().int().positive().optional(), reason: z.string().max(5000).optional(), linkId: z.number().int().positive().optional(),
    groupId: z.number().int().positive().nullable().optional(), tags: z.array(z.string().max(40)).max(20).optional(), approval: z.number().int().positive().optional(),
  }),
  run: async (ctx, a) => {
    W(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const n = () => issueNumber(p0.key, need(a.issue, 'issue'));
    const P = (m: string, p: string) => projectFor(ctx, a.project, [[m, p]]);
    switch (a.action) {
      case 'note_link': case 'note_unlink': {
        const num = n(); const nid = need(a.noteId, 'noteId');
        const p = await P(a.action === 'note_link' ? 'POST' : 'DELETE', `/issues/${num}/notes${a.action === 'note_link' ? '' : `/${nid}`}`);
        return a.action === 'note_link' ? await noteLinks.linkIssueNote(ctx.userId, p.id, num, nid) : await noteLinks.unlinkIssueNote(ctx.userId, p.id, num, nid);
      }
      case 'comment_react': { const num = n(); const c = need(a.comment, 'comment'); const p = await P('PUT', `/issues/${num}/comments/${c}/reactions/x`); return { reactions: await issues.toggleReaction(ctx.userId, p.id, num, c, need(a.emoji, 'emoji'), a.active) }; }
      case 'move_project': {
        await requirePerson(ctx, 'move issues between projects');
        const num = n();
        const target = await projectFor(ctx, need(a.targetProject, 'targetProject'), [['POST', '/issues']]);
        const p = await P('POST', `/issues/${num}/move-project`);
        return { moved: await moveIssueToProject(ctx.userId, p.id, num, { targetProjectId: target.id }) };
      }
      case 'handoff': {
        const num = n();
        const p = await P('POST', `/issues/${num}/handoffs`);
        return { handoff: await handoffs.createHandoff(ctx.userId, p.id, num, { toUserId: a.toUser ? await assigneeIdOf(ctx, p, a.toUser) : null, toTeamId: a.toTeamId ?? null, checklist: a.checklist?.map((text) => ({ text })), note: a.note ?? null }) };
      }
      case 'handoff_accept': case 'handoff_return': case 'handoff_cancel': {
        const h = need(a.handoff, 'handoff');
        const verb = a.action.split('_')[1];
        const p = await P('POST', `/handoffs/${h}/${verb}`);
        if (verb === 'accept') return { handoff: await handoffs.acceptHandoff(ctx.userId, p.id, h, { checklist: a.ticks }) };
        if (verb === 'return') return { handoff: await handoffs.returnHandoff(ctx.userId, p.id, h, { reason: need(a.reason, 'reason') }) };
        return { handoff: await handoffs.cancelHandoff(ctx.userId, p.id, h) };
      }
      case 'web_link_save': { const num = n(); const l = need(a.linkId, 'linkId'); const p = await P('POST', `/issues/${num}/web-links/${l}/save`); return { saved: await resources.saveWebLinkToResources(ctx.userId, p.id, num, l, defined({ groupId: a.groupId, tags: a.tags })) }; }
      case 'approval_cancel': { const ap = need(a.approval, 'approval'); const p = await P('POST', `/approvals/${ap}/cancel`); return { cancelled: await approvals.cancelApproval(ctx.userId, p.id, ap, a.reason ?? null) }; }
    }
    throw bad('Unknown action');
  },
});

const issueBulk = defineTool({
  name: 'issue_bulk', title: 'Bulk edit issues', group: 'issues',
  description: 'Edits up to 200 issues at once (like the multi-select bar): sprint ("active" / "next" / "backlog" / name), assignee ("me" / "nobody" / username), priority 1–5, status (name from get_issue), parent issue, add labels. To delete issues use issue_delete one by one.',
  write: true,
  input: z.object({
    project: projectArg, issues: z.array(issueArg).min(1).max(200), sprint: sprintRefArg.optional(), assignee: z.string().max(254).optional(),
    priority: z.number().int().min(1).max(5).optional(), status: z.string().max(60).optional(), parent: issueArg.nullable().optional(), addLabels: z.array(z.string().min(1).max(60)).max(30).optional(),
  }),
  run: async (ctx, a) => {
    W(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/issues/bulk']]);
    const nums = a.issues.map((i) => issueNumber(p.key, i));
    const patch: sprints.BulkPatch = {};
    if (a.sprint !== undefined) patch.sprintId = await sprintIdOf(ctx, p.id, a.sprint, { allowBacklog: true });
    if (a.assignee !== undefined) patch.assigneeId = await assigneeIdOf(ctx, p, a.assignee);
    if (a.priority !== undefined) patch.priority = a.priority;
    if (a.status !== undefined) {
      const st = await prisma.workStatus.findFirst({ where: { workflow: { projectId: p.id }, name: { equals: a.status.trim(), mode: 'insensitive' } }, select: { id: true } });
      if (!st) throw bad(`No status "${a.status}" in ${p.key}`);
      patch.statusId = st.id;
    }
    if (a.parent !== undefined) {
      if (a.parent === null) patch.parentId = null;
      else { const pi = await prisma.workIssue.findFirst({ where: { projectId: p.id, number: issueNumber(p.key, a.parent), deletedAt: null }, select: { id: true } }); if (!pi) throw new NotFoundError('Parent issue not found'); patch.parentId = pi.id; }
    }
    if (a.addLabels?.length) {
      const labels = await prisma.workLabel.findMany({ where: { projectId: p.id, name: { in: a.addLabels } }, select: { id: true, name: true } });
      const missing = a.addLabels.filter((l) => !labels.some((x) => x.name === l));
      if (missing.length) throw bad(`Unknown labels: ${missing.join(', ')} (create them via update_issue on one issue first)`);
      patch.addLabelIds = labels.map((l) => l.id);
    }
    if (!Object.keys(patch).length) throw bad('Nothing to change');
    return { updated: nums.length, result: await sprints.bulkUpdate(ctx.userId, p.id, nums, patch) };
  },
});

const serviceDesk = defineTool({
  name: 'service_desk', title: 'Service desk (tickets, problems)', group: 'issues',
  description: 'action: ticket_create (requestType, impact, urgency, priority, title, description, requester, or issue to turn into a ticket) | ticket_update (issue; requestType, impact, urgency, priority) | waiting (issue, waiting true/false — pauses SLA while waiting on the customer) | problem_create / problem_update (problem number; title, description, status, rootCause, workaround, owner, incidents) | link_incidents / unlink_incident (problem, issues) | postmortem (problem ⇒ a postmortem Docs page). Reads: ctwork_read desk_queue / desk_problems. Delete a problem: ctwork_delete.',
  write: true,
  input: z.object({
    project: projectArg, action: z.enum(['ticket_create', 'ticket_update', 'waiting', 'problem_create', 'problem_update', 'link_incidents', 'unlink_incident', 'postmortem']),
    issue: issueArg.optional(), requestType: z.enum(REQUEST_TYPE_KEYS).optional(), impact: z.enum(DESK_LEVELS).optional(), urgency: z.enum(DESK_LEVELS).optional(),
    priority: z.enum(DESK_PRIORITIES).nullable().optional(), title: z.string().max(255).optional(), description: z.string().max(20_000).nullable().optional(), requester: z.string().max(254).optional(),
    waiting: z.boolean().optional(), problem: z.number().int().positive().optional(), status: z.enum(PROBLEM_STATUSES).optional(), rootCause: z.string().max(20_000).nullable().optional(),
    workaround: z.string().max(20_000).nullable().optional(), owner: z.string().max(254).optional(), incidents: z.array(issueArg).max(200).optional(),
  }),
  run: async (ctx, a) => {
    W(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const P = (m: string, p: string) => projectFor(ctx, a.project, [[m, p]]);
    const nums = (a.incidents ?? []).map((i) => issueNumber(p0.key, i));
    const problemBody = async () => defined({ title: a.title, description: a.description, status: a.status, rootCause: a.rootCause, workaround: a.workaround, ownerId: a.owner !== undefined ? await assigneeIdOf(ctx, p0, a.owner) : undefined, incidentNumbers: a.incidents ? nums : undefined });
    switch (a.action) {
      case 'ticket_create': {
        const p = await P('POST', '/desk/tickets');
        return { ticket: await desk.staffCreate(ctx.userId, p.id, defined({ requestType: need(a.requestType, 'requestType'), impact: need(a.impact, 'impact'), urgency: need(a.urgency, 'urgency'), priority: a.priority, title: a.title, description: a.description, requesterId: a.requester ? await assigneeIdOf(ctx, p0, a.requester) : undefined, issueNumber: a.issue !== undefined ? issueNumber(p0.key, a.issue) : undefined }) as Parameters<typeof desk.staffCreate>[2]) };
      }
      case 'ticket_update': { const num = issueNumber(p0.key, need(a.issue, 'issue')); const p = await P('PATCH', `/issues/${num}/desk`); return { ticket: await desk.updateTicket(ctx.userId, p.id, num, defined({ requestType: a.requestType, impact: a.impact, urgency: a.urgency, priority: a.priority }) as Parameters<typeof desk.updateTicket>[3]) }; }
      case 'waiting': { const num = issueNumber(p0.key, need(a.issue, 'issue')); const p = await P('POST', `/issues/${num}/desk/waiting`); return { ticket: await desk.setWaiting(ctx.userId, p.id, num, need(a.waiting, 'waiting')) }; }
      case 'problem_create': { const p = await P('POST', '/desk/problems'); return { problem: await desk.createProblem(ctx.userId, p.id, { ...(await problemBody()), title: need(a.title, 'title') } as Parameters<typeof desk.createProblem>[2]) }; }
      case 'problem_update': { const pr = need(a.problem, 'problem'); const p = await P('PATCH', `/desk/problems/${pr}`); return { problem: await desk.updateProblem(ctx.userId, p.id, pr, (await problemBody()) as Parameters<typeof desk.updateProblem>[3]) }; }
      case 'link_incidents': { const pr = need(a.problem, 'problem'); const p = await P('POST', `/desk/problems/${pr}/incidents`); return { problem: await desk.linkIncidents(ctx.userId, p.id, pr, nums) }; }
      case 'unlink_incident': { const pr = need(a.problem, 'problem'); const num = issueNumber(p0.key, need(a.issue, 'issue')); const p = await P('DELETE', `/desk/problems/${pr}/incidents/${num}`); return { problem: await desk.unlinkIncident(ctx.userId, p.id, pr, num) }; }
      case 'postmortem': { const pr = need(a.problem, 'problem'); const p = await P('POST', `/desk/problems/${pr}/postmortem`); return { postmortem: await desk.createPostmortem(ctx.userId, p.id, pr) }; }
    }
    throw bad('Unknown action');
  },
});

// ═══ Chat · Docs · họp ═══════════════════════════════════════════

const channelArg = z.string().max(60).optional().describe('Channel name (default "general")');

const chatExtras = defineTool({
  name: 'chat_extras', title: 'Chat extras (files, forward, DMs, notifications)', group: 'chat',
  description: 'action: send_file (base64 ≤ 6 MB, fileName, mime, optional text — posts the file to the channel) | forward (message id ⇒ toChannel, note) | notify (channel notifications: notify DEFAULT/ALL/MENTIONS, mute 30m/1h/8h/tomorrow/forever/off) | mark_read (channel) | read_all | dm (user + text — 1-on-1 chat with a project teammate inside this project).',
  write: true,
  input: z.object({
    project: projectArg, action: z.enum(['send_file', 'forward', 'notify', 'mark_read', 'read_all', 'dm']), channel: channelArg,
    base64: z.string().max(8_500_000).optional(), fileName: z.string().max(255).optional(), mime: z.string().max(100).optional(), text: z.string().max(8000).optional(),
    message: z.number().int().positive().optional(), toChannel: z.string().max(60).optional(), note: z.string().max(2000).optional(),
    notify: z.enum(CHANNEL_NOTIFY).optional(), mute: z.enum(MUTE_CHOICES).optional(), user: z.string().max(254).optional(),
  }),
  run: async (ctx, a) => {
    W(ctx);
    const p = await projectFor(ctx, a.project, []);
    if (a.action === 'read_all') return { read: await chat.markAllRead(ctx.userId, p.id) };
    if (a.action === 'dm') {
      const other = await assigneeIdOf(ctx, p, need(a.user, 'user'));
      if (!other) throw bad('Pick a teammate');
      const ch = await chat.openDm(ctx.userId, p.id, other) as { id: number; name: string };
      const m = a.text ? await chat.postMessage(ctx.userId, p.id, ch.id, { body: a.text, parentId: null }) : null;
      return { dm: ch.id, posted: m?.id ?? null };
    }
    const ch = await chat.channelByName(ctx.userId, p.id, a.channel);
    switch (a.action) {
      case 'send_file': {
        const buf = Buffer.from(need(a.base64, 'base64').replace(/^data:[^,]*,/, ''), 'base64');
        if (!buf.length) throw bad('The file is empty');
        const f = await chatFiles.uploadChatFile(ctx.userId, p.id, ch.id, { buffer: buf, fileName: need(a.fileName, 'fileName'), mime: a.mime ?? 'application/octet-stream' }) as { id: number };
        const m = await chat.postMessage(ctx.userId, p.id, ch.id, { body: a.text ?? '', parentId: null, fileIds: [f.id] } as Parameters<typeof chat.postMessage>[3]);
        return { channel: ch.name, message: m.id, file: f.id };
      }
      case 'forward': {
        const to = await chat.channelByName(ctx.userId, p.id, need(a.toChannel, 'toChannel'));
        return { forwarded: await chat.forwardMessage(ctx.userId, p.id, ch.id, need(a.message, 'message'), { toChannelId: to.id, note: a.note ?? null }) };
      }
      case 'notify': return { channel: ch.name, settings: await chat.setChannelNotify(ctx.userId, p.id, ch.id, defined({ notify: a.notify, mute: a.mute })) };
      case 'mark_read': return { channel: ch.name, read: await chat.markRead(ctx.userId, p.id, ch.id, a.message) };
    }
    throw bad('Unknown action');
  },
});

/** Bọc ĐÚNG MỘT lần xuất hiện của `quote` (trong một nút chữ) bằng mark commentAnchor — trả nội dung mới hoặc null. */
function anchorQuote(doc: unknown, quote: string, anchorId: string): unknown | null {
  let done = false;
  const walk = (node: Record<string, unknown>): Record<string, unknown> => {
    if (done || !Array.isArray(node.content)) return node;
    const out: unknown[] = [];
    for (const ch of node.content as Array<Record<string, unknown>>) {
      if (!done && ch.type === 'text' && typeof ch.text === 'string') {
        const i = ch.text.indexOf(quote);
        const marks = Array.isArray(ch.marks) ? (ch.marks as Array<{ type: string }>) : [];
        if (i >= 0 && !marks.some((m) => m.type === 'commentAnchor')) {
          if (i > 0) out.push({ ...ch, text: ch.text.slice(0, i) });
          out.push({ ...ch, text: quote, marks: [...marks, { type: 'commentAnchor', attrs: { id: anchorId } }] });
          if (i + quote.length < ch.text.length) out.push({ ...ch, text: ch.text.slice(i + quote.length) });
          done = true;
          continue;
        }
      }
      out.push(walk(ch));
    }
    return { ...node, content: out };
  };
  const r = walk(doc as Record<string, unknown>);
  return done ? r : null;
}

const docsExtras = defineTool({
  name: 'docs_extras', title: 'Docs extras (inline comments, live editing)', group: 'docs',
  description: 'action: inline_comment (page, quote = exact text inside ONE paragraph of the page, markdown = the comment) — highlights that passage and attaches the comment, like selecting text on the web | live_editing (page, enabled) — turns real-time co-editing of a page on/off (page owner or admin).',
  write: true,
  input: z.object({ project: projectArg, action: z.enum(['inline_comment', 'live_editing']), page: z.number().int().positive(), quote: z.string().min(1).max(500).optional(), markdown: z.string().min(1).max(10_000).optional(), enabled: z.boolean().optional() }),
  run: async (ctx, a) => {
    W(ctx);
    if (a.action === 'live_editing') {
      const p = await projectFor(ctx, a.project, [['PUT', `/pages/${a.page}/collab`]]);
      return { page: a.page, liveEditing: await collab.setPageCollab(ctx.userId, p.id, a.page, need(a.enabled, 'enabled')) };
    }
    const p = await projectFor(ctx, a.project, [['PATCH', `/pages/${a.page}`], ['POST', `/pages/${a.page}/inline-comments`]]);
    const quote = need(a.quote, 'quote');
    const cur = await pages.getPage(ctx.userId, p.id, a.page) as { contentJson: unknown; version: number };
    const anchorId = `cm${randomBytes(6).toString('hex')}`;
    const next = anchorQuote(cur.contentJson, quote, anchorId);
    if (!next) throw bad('That exact text was not found inside a single paragraph of the page (or it already has a comment) — quote a shorter passage exactly as written');
    await pages.updatePage(ctx.userId, p.id, a.page, { contentJson: next, baseVersion: cur.version });
    const c = await collab.addInlineComment(ctx.userId, p.id, a.page, { anchorId, quote, bodyJson: docOf(need(a.markdown, 'markdown')) });
    return { page: a.page, comment: (c as { id: number }).id, anchor: anchorId };
  },
});

const meetingExtras = defineTool({
  name: 'meeting_extras', title: 'Meeting extras (duplicate, templates, recording, series)', group: 'planning',
  description: 'action: duplicate (meeting, weeks later — default 1) | apply_template (meeting, key daily/sprint-planning/…, replace) | recording_link (meeting, url or null) | series_create (seriesJson = {title, type, templateKey, recurrence {freq, interval, byWeekday, hour, minute, startDate, endDate, count}, durationMin, timezone, location, meetingUrl, agendaItems; attendees as usernames in attendees}) | series_update (series id, seriesJson patch, scope all/following, fromMeeting). Team members get the normal bell; delete a series: ctwork_delete.',
  write: true, personOnly: true,
  input: z.object({
    project: projectArg, action: z.enum(['duplicate', 'apply_template', 'recording_link', 'series_create', 'series_update']), meeting: z.union([z.number().int().positive(), z.string().max(12)]).optional(),
    weeks: z.number().int().min(1).max(52).optional(), key: z.string().max(24).optional(), replace: z.boolean().optional(), url: z.string().max(500).nullable().optional(),
    series: z.number().int().positive().optional(), seriesJson: z.string().max(60_000).optional(), attendees: z.array(z.string().max(254)).max(100).optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'manage meetings');
    W(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const P = (m: string, p: string) => projectFor(ctx, a.project, [[m, p]]);
    const mt = () => numOf(need(a.meeting, 'meeting'), 'meeting');
    switch (a.action) {
      case 'duplicate': { const n = mt(); const p = await P('POST', `/meetings/${n}/duplicate`); return { duplicate: await meetings.duplicateMeeting(ctx.userId, p.id, n, a.weeks ?? 1) }; }
      case 'apply_template': { const n = mt(); const p = await P('POST', `/meetings/${n}/apply-template`); return { applied: await series.applyTemplate(ctx.userId, p.id, n, { key: need(a.key, 'key'), replace: a.replace }) }; }
      case 'recording_link': { const n = mt(); const p = await P('PUT', `/meetings/${n}/recording-link`); return { recording: await rec.setRecordingLink(ctx.userId, p.id, n, a.url ?? null) }; }
      case 'series_create': case 'series_update': {
        const raw = parseJson(need(a.seriesJson, 'seriesJson'), 'seriesJson') as Record<string, unknown>;
        if (a.attendees) raw.attendeeIds = await userIds(ctx, p0, a.attendees);
        if (a.action === 'series_create') {
          const r = series.seriesInput.safeParse(raw);
          if (!r.success) throw bad(`seriesJson: ${r.error.issues[0]?.path.join('.')} ${r.error.issues[0]?.message}`);
          const p = await P('POST', '/meeting-series');
          return { series: await series.createSeries(ctx.userId, p.id, r.data) };
        }
        const sid = need(a.series, 'series');
        const r = series.seriesPatch.safeParse(raw);
        if (!r.success) throw bad(`seriesJson: ${r.error.issues[0]?.path.join('.')} ${r.error.issues[0]?.message}`);
        const p = await P('PATCH', `/meeting-series/${sid}`);
        return { series: await series.updateSeries(ctx.userId, p.id, sid, r.data) };
      }
    }
    throw bad('Unknown action');
  },
});

// ═══ Dashboard · exploratory · WBS · Resources · baseline/bộ lọc ═══

const dashboardSave = defineTool({
  name: 'dashboard_save', title: 'Create / edit a project dashboard', group: 'planning',
  description: `Creates (no id) or replaces (id) a project dashboard: name, shared, widgets (REPLACES the list) — each {kind, title, query (JQL), groupBy, sprintId, versionId, days, text, size half/full}. Widget kinds: ${search.WIDGET_KINDS.join(', ')}. Current dashboards: ctwork_read dashboards; delete: ctwork_delete.`,
  write: true,
  input: z.object({
    project: projectArg, id: z.number().int().positive().optional(), name: z.string().min(1).max(100), shared: z.boolean().optional(),
    widgets: z.array(z.object({
      kind: z.enum(search.WIDGET_KINDS), title: z.string().max(80).optional(), query: z.string().max(4000).optional(), groupBy: z.enum(search.GROUP_BYS).optional(),
      sprintId: z.number().int().positive().nullable().optional(), versionId: z.number().int().positive().nullable().optional(), days: z.number().int().min(7).max(90).optional(),
      text: z.string().max(5000).optional(), size: z.enum(['half', 'full']).optional(),
    })).max(30),
  }),
  run: async (ctx, a) => {
    const p = await hit(ctx, a.project, 'POST', '/dashboards');
    const widgets = a.widgets.map((w) => ({ ...w, id: '', title: w.title ?? '' })) as unknown as Parameters<typeof search.saveDashboard>[2]['widgets'];
    const d = await search.saveDashboard(ctx.userId, p.id, { id: a.id, name: a.name, shared: a.shared, widgets }) as { id: number };
    return { dashboard: d.id ?? a.id };
  },
});

const exploratoryManage = defineTool({
  name: 'exploratory_manage', title: 'Exploratory test sessions', group: 'tests',
  description: 'action: create / update (number; charter, area, timeboxMin, tester, cycleId, summary) | start | stop | note (kind NOTE/BUG/QUESTION/IDEA/RISK, text, logBug, severity). List: ctwork_read exploratory; delete: ctwork_delete.',
  write: true,
  input: z.object({
    project: projectArg, action: z.enum(['create', 'update', 'start', 'stop', 'note']), number: z.number().int().positive().optional(),
    charter: z.string().max(4000).optional(), area: z.string().max(160).nullable().optional(), timeboxMin: z.number().int().min(5).max(480).optional(), tester: z.string().max(254).optional(),
    cycleId: z.number().int().positive().nullable().optional(), summary: z.string().max(8000).nullable().optional(),
    kind: z.enum(t.NOTE_KINDS).optional(), text: z.string().max(2000).optional(), logBug: z.boolean().optional(), severity: z.string().max(20).nullable().optional(),
  }),
  run: async (ctx, a) => {
    W(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const P = (m: string, p: string) => projectFor(ctx, a.project, [[m, p]]);
    if (a.action === 'create' || a.action === 'update') {
      const p = await P(a.action === 'create' ? 'POST' : 'PATCH', a.action === 'create' ? '/exploratory' : `/exploratory/${need(a.number, 'number')}`);
      return { session: await t.saveExploratory(ctx.userId, p.id, defined({ number: a.number ?? null, charter: a.charter, area: a.area, timeboxMin: a.timeboxMin, testerId: a.tester ? await assigneeIdOf(ctx, p0, a.tester) : undefined, cycleId: a.cycleId, summary: a.summary }) as Parameters<typeof t.saveExploratory>[2]) };
    }
    const n = need(a.number, 'number');
    if (a.action === 'note') { const p = await P('POST', `/exploratory/${n}/notes`); return { note: await t.addExploratoryNote(ctx.userId, p.id, n, { kind: need(a.kind, 'kind'), text: need(a.text, 'text'), logBug: a.logBug, severity: a.severity ?? null }) }; }
    const p = await P('POST', `/exploratory/${n}/${a.action}`);
    return { session: await t.exploratoryAction(ctx.userId, p.id, n, a.action) };
  },
});

const wbsManage = defineTool({
  name: 'wbs_manage', title: 'Edit WBS items', group: 'planning',
  description: 'action: item_update (issue; kind, complexity, fields, transactions, feature, subFeature, plannedDays, note — the WBS / estimation columns) | item_move (issue; parent issue or null, before / after issue). Read: ctwork_read wbs.',
  write: true,
  input: z.object({
    project: projectArg, action: z.enum(['item_update', 'item_move']), issue: issueArg,
    kind: z.string().max(20).nullable().optional(), complexity: z.string().max(20).nullable().optional(), fields: z.number().int().min(0).max(10_000).nullable().optional(),
    transactions: z.number().int().min(0).max(10_000).nullable().optional(), feature: z.string().max(120).nullable().optional(), subFeature: z.string().max(120).nullable().optional(),
    plannedDays: z.number().min(0).max(10_000).nullable().optional(), note: z.string().max(1000).nullable().optional(),
    parent: issueArg.nullable().optional(), before: issueArg.nullable().optional(), after: issueArg.nullable().optional(),
  }),
  run: async (ctx, a) => {
    W(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const n = issueNumber(p0.key, a.issue);
    const num = (v: number | string | null | undefined) => (v === undefined ? undefined : v === null ? null : issueNumber(p0.key, v));
    if (a.action === 'item_update') {
      const p = await projectFor(ctx, a.project, [['PUT', `/wbs/items/${n}`]]);
      const r = rep.wbsItemInput.safeParse(defined({ kind: a.kind, complexity: a.complexity, fields: a.fields, transactions: a.transactions, feature: a.feature, subFeature: a.subFeature, plannedDays: a.plannedDays, note: a.note }));
      if (!r.success) throw bad(`${r.error.issues[0]?.path.join('.')} ${r.error.issues[0]?.message}`);
      if (!Object.keys(r.data).length) throw bad('Nothing to change');
      return { item: await rep.updateWbsItem(ctx.userId, p.id, n, r.data) };
    }
    const p = await projectFor(ctx, a.project, [['PUT', `/wbs/items/${n}/move`]]);
    return { moved: await uxc.moveWbsItem(ctx.userId, p.id, n, { parentNumber: num(a.parent) ?? null, beforeNumber: num(a.before), afterNumber: num(a.after) }) };
  },
});

const resourceExtras = defineTool({
  name: 'resource_extras', title: 'Resources extras (groups, order, import, link check)', group: 'docs',
  description: 'action: group_create / group_update (group id; name, icon, color #rrggbb) | groups_reorder (ids) | reorder (groupId or null, ids — links inside a group) | import (text in markdown or CSV, format, groupId, dryRun) | check (re-checks every link) | refresh (resource id — re-reads a GitHub preview). Delete a group: ctwork_delete.',
  write: true,
  input: z.object({
    project: projectArg, action: z.enum(['group_create', 'group_update', 'groups_reorder', 'reorder', 'import', 'check', 'refresh']),
    group: z.number().int().positive().optional(), name: z.string().max(80).optional(), icon: z.string().max(16).nullable().optional(), color: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullable().optional(),
    groupId: z.number().int().positive().nullable().optional(), ids: z.array(z.number().int().positive()).max(2000).optional(),
    text: z.string().max(300_000).optional(), format: z.enum(['auto', 'markdown', 'csv']).optional(), dryRun: z.boolean().optional(), resource: z.number().int().positive().optional(),
  }),
  run: async (ctx, a) => {
    W(ctx);
    const P = (m: string, p: string) => projectFor(ctx, a.project, [[m, p]]);
    switch (a.action) {
      case 'group_create': { const p = await P('POST', '/resource-groups'); return { group: await resources.createGroup(ctx.userId, p.id, defined({ name: need(a.name, 'name'), icon: a.icon, color: a.color }) as Parameters<typeof resources.createGroup>[2]) }; }
      case 'group_update': { const g = need(a.group, 'group'); const p = await P('PATCH', `/resource-groups/${g}`); return { group: await resources.updateGroup(ctx.userId, p.id, g, defined({ name: a.name, icon: a.icon, color: a.color })) }; }
      case 'groups_reorder': { const p = await P('PUT', '/resource-groups/reorder'); return { order: await resources.reorderGroups(ctx.userId, p.id, need(a.ids, 'ids')) }; }
      case 'reorder': { const p = await P('PUT', '/resources/reorder'); return { order: await resources.reorderResources(ctx.userId, p.id, { groupId: a.groupId ?? null, ids: need(a.ids, 'ids') }) }; }
      case 'import': { const p = await P('POST', '/resources/import'); return { imported: await resources.importResources(ctx.userId, p.id, defined({ text: need(a.text, 'text'), format: a.format, groupId: a.groupId, dryRun: a.dryRun }) as Parameters<typeof resources.importResources>[2]) }; }
      case 'check': { const p = await P('POST', '/resources/check'); return { checked: await resources.checkProjectLinks(ctx.userId, p.id) }; }
      case 'refresh': { const r = need(a.resource, 'resource'); const p = await P('POST', `/resources/${r}/refresh`); return { resource: await resources.refreshResource(ctx.userId, p.id, r) }; }
    }
    throw bad('Unknown action');
  },
});

const planningExtras = defineTool({
  name: 'planning_extras', title: 'Timeline baselines and saved filters', group: 'planning',
  description: 'action: baseline_add (name, note — snapshots the timeline to compare later) | filter_save (id to replace; name, JQL query, shared) | okr_objective (project objective: cycleId, name = title, note = description, owner). Read: ctwork_read baselines / filters; delete: ctwork_delete.',
  write: true,
  input: z.object({
    project: projectArg, action: z.enum(['baseline_add', 'filter_save', 'okr_objective']), id: z.number().int().positive().optional(), name: z.string().min(1).max(200),
    note: z.string().max(5000).nullable().optional(), query: z.string().max(4000).optional(), shared: z.boolean().optional(), cycleId: z.number().int().positive().optional(), owner: z.string().max(254).optional(),
  }),
  run: async (ctx, a) => {
    if (a.action === 'baseline_add') { const p = await hit(ctx, a.project, 'POST', '/timeline/baselines'); return { baseline: await uxc.createBaseline(ctx.userId, p.id, { name: a.name.slice(0, 120), note: a.note?.slice(0, 500) ?? null }) }; }
    if (a.action === 'okr_objective') {
      const p = await hit(ctx, a.project, 'POST', '/okrs/objectives');
      const body = okr.objectiveInput.parse(defined({ cycleId: need(a.cycleId, 'cycleId'), title: a.name, description: a.note, ownerId: a.owner ? await assigneeIdOf(ctx, p, a.owner) : undefined }));
      return { objective: await okr.createObjective(ctx.userId, { projectId: p.id }, body) };
    }
    const p = await hit(ctx, a.project, 'POST', '/filters');
    return { filter: await search.saveFilter(ctx.userId, p.id, { id: a.id, name: a.name.slice(0, 100), query: need(a.query, 'query'), shared: a.shared }) };
  },
});

// ═══ Báo cáo FPT · đóng góp · form · quản trị dự án · sơ đồ · test ═══

const fptReportsManage = defineTool({
  name: 'fpt_reports_manage', title: 'FPT reports (course info, weekly, AI usage)', group: 'docs',
  description: 'action: doc_update (subjectCode, subjectName, classCode, semester, lecturer, groupCode, projectTitle, week1Start, students [{name, studentId, role…}]) | weekly_update (weekly id; updateJson = the editable fields of a weekly report) | weekly_refresh (weekly id — recompute from issues) | ai_usage_add / ai_usage_update (row id; usedAt, phase, task, tool, output, validation, evidence, measure) | ai_usage_sync (pull AI usage from CT Work\'s AI log). Weekly create: weekly_report_generate; delete rows: ctwork_delete.',
  write: true,
  input: z.object({
    project: projectArg, action: z.enum(['doc_update', 'weekly_update', 'weekly_refresh', 'ai_usage_add', 'ai_usage_update', 'ai_usage_sync']),
    docJson: z.string().max(60_000).optional().describe('doc_update: JSON of the course/group fields'), id: z.number().int().positive().optional(), updateJson: z.string().max(100_000).optional(),
    usedAt: ymd.optional(), phase: z.string().max(40).optional(), task: z.string().max(300).optional(), tool: z.string().max(120).optional(), output: z.string().max(4000).nullable().optional(),
    validation: z.string().max(4000).nullable().optional(), evidence: z.string().max(1000).nullable().optional(), measure: z.string().max(300).nullable().optional(),
  }),
  run: async (ctx, a) => {
    const R = '/fpt-reports';
    const parsed = <T extends z.ZodTypeAny>(s: T, v: unknown, what: string): z.infer<T> => { const r = s.safeParse(v); if (!r.success) throw bad(`${what}: ${r.error.issues[0]?.path.join('.')} ${r.error.issues[0]?.message}`); return r.data; };
    switch (a.action) {
      case 'doc_update': { const p = await hit(ctx, a.project, 'PUT', `${R}/doc`); return { doc: await rep.updateReportDoc(ctx.userId, p.id, parsed(rep.reportDocInput, parseJson(need(a.docJson, 'docJson'), 'docJson'), 'docJson')) }; }
      case 'weekly_update': { const id = need(a.id, 'id'); const p = await hit(ctx, a.project, 'PUT', `${R}/weekly/${id}`); return { weekly: await rep.updateWeekly(ctx.userId, p.id, id, parsed(rep.weeklyUpdateInput, parseJson(need(a.updateJson, 'updateJson'), 'updateJson'), 'updateJson')) }; }
      case 'weekly_refresh': { const id = need(a.id, 'id'); const p = await hit(ctx, a.project, 'POST', `${R}/weekly/${id}/refresh`); return { weekly: await rep.refreshWeekly(ctx.userId, p.id, id) }; }
      case 'ai_usage_sync': { const p = await hit(ctx, a.project, 'POST', `${R}/ai-usage/sync`); return { synced: await rep.syncAiUsage(ctx.userId, p.id) }; }
      case 'ai_usage_add': case 'ai_usage_update': {
        const row = defined({ usedAt: a.usedAt, phase: a.phase, task: a.task, tool: a.tool, output: a.output, validation: a.validation, evidence: a.evidence, measure: a.measure });
        if (a.action === 'ai_usage_add') { const p = await hit(ctx, a.project, 'POST', `${R}/ai-usage`); return { row: await rep.createAiUsage(ctx.userId, p.id, parsed(rep.aiUsageInput, row, 'row')) }; }
        const id = need(a.id, 'id');
        const p = await hit(ctx, a.project, 'PATCH', `${R}/ai-usage/${id}`);
        return { row: await rep.updateAiUsage(ctx.userId, p.id, id, parsed(rep.aiUsageInput.partial(), row, 'row')) };
      }
    }
    throw bad('Unknown action');
  },
});

const contribManage = defineTool({
  name: 'contrib_manage', title: 'Contribution settings and peer review', group: 'planning',
  description: 'action: settings (teamVisible, timezone, silentDays) | git_author (git identity "name <email>" ⇒ member username, or null to unmap) | round_create (title, scope SPRINT/STAGE/CUSTOM, sprintId, criteria [{label, description}] 3–6, closesAt) | round_update (round id; title, status OPEN/CLOSED, closesAt) | peer_review (round, teammate username, scores [{criterion key, score 1–5}], comment) — ONLY with the scores the user gave you; never invent a rating. Delete a round: ctwork_delete.',
  write: true, personOnly: true,
  input: z.object({
    project: projectArg, action: z.enum(['settings', 'git_author', 'round_create', 'round_update', 'peer_review']),
    teamVisible: z.boolean().optional(), timezone: z.string().max(64).optional(), silentDays: z.number().int().min(2).max(30).optional(),
    identity: z.string().max(200).optional(), member: z.string().max(254).nullable().optional(),
    round: z.number().int().positive().optional(), title: z.string().max(160).optional(), scope: z.enum(['SPRINT', 'STAGE', 'CUSTOM']).optional(), sprintId: z.number().int().positive().nullable().optional(),
    criteria: z.array(z.object({ key: z.string().max(32).optional(), label: z.string().min(1).max(60), description: z.string().max(300).optional() })).min(3).max(6).optional(),
    closesAt: z.string().max(40).nullable().optional(), status: z.enum(['OPEN', 'CLOSED']).optional(),
    teammate: z.string().max(254).optional(), scores: z.array(z.object({ criterion: z.string().max(32), score: z.number().int().min(1).max(5) })).max(6).optional(), comment: z.string().max(2000).nullable().optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'use contribution tools');
    const p0 = await projectFor(ctx, a.project, []);
    const date = (v: string | null | undefined) => (v === undefined ? undefined : v === null ? null : new Date(v));
    switch (a.action) {
      case 'settings': { const p = await hit(ctx, a.project, 'PUT', '/contrib/settings'); return { settings: await contrib.updateContribSettings(ctx.userId, p.id, defined({ teamVisible: a.teamVisible, timezone: a.timezone, silentDays: a.silentDays })) }; }
      case 'git_author': { const p = await hit(ctx, a.project, 'PUT', '/contrib/git-authors'); return { mapped: await contrib.setGitIdentity(ctx.userId, p.id, need(a.identity, 'identity'), a.member ? await assigneeIdOf(ctx, p0, a.member) : null) }; }
      case 'round_create': { const p = await hit(ctx, a.project, 'POST', '/contrib/peer/rounds'); return { round: await peer.createRound(ctx.userId, p.id, defined({ title: need(a.title, 'title'), scope: a.scope, sprintId: a.sprintId, criteria: a.criteria, closesAt: date(a.closesAt) }) as Parameters<typeof peer.createRound>[2]) }; }
      case 'round_update': { const r = need(a.round, 'round'); const p = await hit(ctx, a.project, 'PATCH', `/contrib/peer/rounds/${r}`); return { round: await peer.updateRound(ctx.userId, p.id, r, defined({ title: a.title, status: a.status, closesAt: date(a.closesAt) })) }; }
      case 'peer_review': {
        const r = need(a.round, 'round');
        const who = await assigneeIdOf(ctx, p0, need(a.teammate, 'teammate'));
        if (!who) throw bad('Pick a teammate');
        const p = await hit(ctx, a.project, 'PUT', `/contrib/peer/rounds/${r}/reviews/${who}`);
        return { review: await peer.submitReview(ctx.userId, p.id, r, who, { scores: Object.fromEntries(need(a.scores, 'scores').map((s) => [s.criterion, s.score])), comment: a.comment ?? null }) };
      }
    }
    throw bad('Unknown action');
  },
});

const formManage = defineTool({
  name: 'form_manage', title: 'Create / edit a project form', group: 'planning',
  description: `Creates (no form) or edits (form "F-2") a project form: formJson = {title, description, fields [{label, kind (${FORM_FIELD_KINDS.join('/')}), required, options, help}], confirmMessage, collectEmail, maxResponses, closesAt}. Opening the public link stays on the web; delete: ctwork_delete.`,
  write: true, personOnly: true,
  input: z.object({ project: projectArg, form: z.union([z.number().int().positive(), z.string().max(12)]).optional(), formJson: z.string().max(200_000) }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'manage forms');
    const raw = parseJson(a.formJson, 'formJson');
    if (a.form === undefined) {
      const r = forms.formInput.safeParse(raw);
      if (!r.success) throw bad(`formJson: ${r.error.issues[0]?.path.join('.')} ${r.error.issues[0]?.message}`);
      const p = await hit(ctx, a.project, 'POST', '/forms');
      return { form: await forms.createForm(ctx.userId, p.id, r.data) };
    }
    const r = forms.formInput.partial().safeParse(raw);
    if (!r.success) throw bad(`formJson: ${r.error.issues[0]?.path.join('.')} ${r.error.issues[0]?.message}`);
    const p = await hit(ctx, a.project, 'PATCH', `/forms/${numOf(a.form, 'form')}`);
    return { form: await forms.updateForm(ctx.userId, p.id, a.form, r.data) };
  },
});

const governanceExtras = defineTool({
  name: 'governance_extras', title: 'RAID links, starter risks, Q&A ⇒ issue, CR scope', group: 'planning',
  description: 'action: raid_link (RAID item; issue, stageId or CR number) | raid_unlink (RAID item, link id) | raid_starter (adds the standard starter risks) | qna_convert (old Q&A note ⇒ a proper Q&A entry) | cr_affected (CR; items [{kind REQ/UC/BR/DOC, ref}] — the baseline items the change touches) | cr_implement (CR; items [{title, description, type, assignee, dueDate}] ⇒ implementation issues).',
  write: true,
  input: z.object({
    project: projectArg, action: z.enum(['raid_link', 'raid_unlink', 'raid_starter', 'qna_convert', 'cr_affected', 'cr_implement']),
    item: z.union([z.number().int().positive(), z.string().max(12)]).optional(), issue: issueArg.optional(), stageId: z.number().int().positive().optional(), crNumber: z.number().int().positive().optional(), linkId: z.number().int().positive().optional(),
    refs: z.array(z.object({ kind: z.enum(BASELINE_KINDS), ref: z.string().min(1).max(40) })).max(200).optional(),
    items: z.array(z.object({ title: z.string().min(1).max(255), description: z.string().max(10_000).nullable().optional(), type: z.string().max(20).optional(), assignee: z.string().max(254).optional(), dueDate: ymd.nullable().optional() })).max(20).optional(),
  }),
  run: async (ctx, a) => {
    W(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const n = () => numOf(need(a.item, 'item'), 'number');
    switch (a.action) {
      case 'raid_link': { const r = n(); const p = await hit(ctx, a.project, 'POST', `/raid/${r}/links`); return { linked: await raid.addRaidLink(ctx.userId, p.id, r, defined({ issueNumber: a.issue !== undefined ? issueNumber(p0.key, a.issue) : undefined, stageId: a.stageId, crNumber: a.crNumber })) }; }
      case 'raid_unlink': { const r = n(); const l = need(a.linkId, 'linkId'); const p = await hit(ctx, a.project, 'DELETE', `/raid/${r}/links/${l}`); return { unlinked: await raid.removeRaidLink(ctx.userId, p.id, r, l) }; }
      case 'raid_starter': { const p = await hit(ctx, a.project, 'POST', '/raid/starter'); return { added: await raid.importStarterRisks(ctx.userId, p.id) }; }
      case 'qna_convert': { const r = n(); const p = await hit(ctx, a.project, 'POST', `/qna/${r}/convert`); return { converted: await qna.convertLegacy(ctx.userId, p.id, r) }; }
      case 'cr_affected': { const r = n(); const p = await hit(ctx, a.project, 'PUT', `/changes/${r}/affected`); return { affected: await q.setCrRefs(ctx.userId, p.id, r, need(a.refs, 'refs')) }; }
      case 'cr_implement': {
        const r = n();
        const p = await hit(ctx, a.project, 'POST', `/changes/${r}/implement`);
        const items = await Promise.all(need(a.items, 'items').map(async (i) => ({ title: i.title, description: i.description ?? null, typeKey: i.type, assigneeId: i.assignee ? await assigneeIdOf(ctx, p0, i.assignee) : null, dueDate: i.dueDate ?? null })));
        return { created: await crs.createImplementationIssues(ctx.userId, p.id, r, items as Parameters<typeof crs.createImplementationIssues>[3]) };
      }
    }
    throw bad('Unknown action');
  },
});

const diagramExtras = defineTool({
  name: 'diagram_extras', title: 'Diagram comments, versions, embed, import', group: 'docs',
  description: 'action: comment_add (diagram; text, parent comment, anchor) | comment_update (diagram, comment; text, resolved) | version_restore (diagram, version) | embed (diagram ⇒ Docs page, mode latest/pinned, heading) | import (fileName + content of a .drawio / .mmd / .puml file, base64 flag, to mermaid/native, title). Approving a diagram and accepting AI proposals stay on the web; delete a comment: ctwork_delete.',
  write: true,
  input: z.object({
    project: projectArg, action: z.enum(['comment_add', 'comment_update', 'version_restore', 'embed', 'import']), diagram: z.number().int().positive().optional(),
    text: z.string().max(10_000).optional(), parent: z.number().int().positive().optional(), anchor: z.string().max(160).nullable().optional(), comment: z.number().int().positive().optional(), resolved: z.boolean().optional(),
    version: z.number().int().positive().optional(), page: z.number().int().positive().optional(), mode: z.enum(['latest', 'pinned']).optional(), heading: z.string().max(255).nullable().optional(),
    fileName: z.string().max(255).optional(), content: z.string().max(9_000_000).optional(), base64: z.boolean().optional(), to: z.enum(['mermaid', 'native']).optional(), title: z.string().max(255).nullable().optional(),
  }),
  run: async (ctx, a) => {
    if (a.action === 'import') { const p = await hit(ctx, a.project, 'POST', '/diagrams/import'); return { imported: await dg.importDiagram(ctx.userId, p.id, defined({ fileName: need(a.fileName, 'fileName'), content: need(a.content, 'content'), base64: a.base64, to: a.to, title: a.title }) as Parameters<typeof dg.importDiagram>[2]) }; }
    const n = need(a.diagram, 'diagram');
    switch (a.action) {
      case 'comment_add': { const p = await hit(ctx, a.project, 'POST', `/diagrams/${n}/comments`); return { comment: await dg.addComment(ctx.userId, p.id, n, { body: need(a.text, 'text'), parentId: a.parent ?? null, anchor: a.anchor ?? null }) }; }
      case 'comment_update': { const c = need(a.comment, 'comment'); const p = await hit(ctx, a.project, 'PATCH', `/diagrams/${n}/comments/${c}`); return { comment: await dg.updateComment(ctx.userId, p.id, n, c, defined({ body: a.text, resolved: a.resolved })) }; }
      case 'version_restore': { const v = need(a.version, 'version'); const p = await hit(ctx, a.project, 'POST', `/diagrams/${n}/versions/${v}/restore`); return { restored: await dg.restoreVersion(ctx.userId, p.id, n, v) }; }
      case 'embed': { const p = await hit(ctx, a.project, 'POST', `/diagrams/${n}/embed`); return { embedded: await dg.embedInPage(ctx.userId, p.id, n, { page: need(a.page, 'page'), mode: a.mode, heading: a.heading ?? null }) }; }
    }
    throw bad('Unknown action');
  },
});

const testExtras = defineTool({
  name: 'test_extras', title: 'Test extras (import, risks, defect analysis, flaky)', group: 'tests',
  description: 'action: import_tests (rows [{title, preconditions, steps [{action, data, expected}], requirements}] ⇒ Xray test cases) | risk_save (number to edit; title, likelihood 1–5, impact 1–5, riskKind PRODUCT/PROJECT, mitigation, issues) | defect_analysis (bug issue; rootCause, injectedPhase, detectedByTool, testLevel, fixNote) | reset_flaky (automated test id) | finding (static-analysis finding id; findingAction ignore / reopen / issue = file a bug).',
  write: true,
  input: z.object({
    project: projectArg, action: z.enum(['import_tests', 'risk_save', 'defect_analysis', 'reset_flaky', 'finding']),
    finding: z.number().int().positive().optional(), findingAction: z.enum(['ignore', 'reopen', 'issue']).optional(),
    rows: z.array(z.object({ title: z.string().min(1).max(255), preconditions: z.string().max(10_000).nullable().optional(), steps: z.array(z.object({ action: z.string().max(5000), data: z.string().max(5000).nullable().optional(), expected: z.string().max(5000).nullable().optional() })).max(100).optional(), requirements: z.array(z.string().max(20)).max(50).optional() })).max(500).optional(),
    number: z.number().int().positive().optional(), title: z.string().max(255).optional(), likelihood: z.number().int().min(1).max(5).nullable().optional(), impact: z.number().int().min(1).max(5).nullable().optional(),
    riskKind: z.enum(['PRODUCT', 'PROJECT']).nullable().optional(), mitigation: z.string().max(4000).nullable().optional(), issues: z.array(issueArg).max(200).optional(),
    issue: issueArg.optional(), rootCause: z.enum(ROOT_CAUSES).nullable().optional(), injectedPhase: z.enum(PHASES).nullable().optional(), detectedByTool: z.string().max(120).nullable().optional(),
    testLevel: z.enum(TEST_LEVELS).nullable().optional(), fixNote: z.string().max(8000).nullable().optional(), autoTest: z.number().int().positive().optional(),
  }),
  run: async (ctx, a) => {
    const p0 = await projectFor(ctx, a.project, []);
    switch (a.action) {
      case 'import_tests': {
        const p = await hit(ctx, a.project, 'POST', '/tests/import');
        const rows = need(a.rows, 'rows').map((r) => ({ title: r.title, preconditions: r.preconditions ?? null, steps: r.steps?.map((s) => ({ action: s.action, data: s.data ?? null, expected: s.expected ?? null })), requirementKeys: r.requirements?.map((k) => (/^\d+$/.test(k) ? `${p.key}-${k}` : k.toUpperCase())) }));
        return { imported: await tests.importTests(ctx.userId, p.id, rows) };
      }
      case 'risk_save': { const p = await hit(ctx, a.project, 'POST', '/test-risks'); return { risk: await t.saveRisk(ctx.userId, p.id, defined({ number: a.number ?? null, title: a.title, likelihood: a.likelihood, impact: a.impact, riskKind: a.riskKind, mitigation: a.mitigation, issueNumbers: a.issues?.map((i) => issueNumber(p0.key, i)) })) }; }
      case 'defect_analysis': { const n = issueNumber(p0.key, need(a.issue, 'issue')); const p = await hit(ctx, a.project, 'PUT', `/test-defects/${n}`); return { defect: await t.setDefectExtra(ctx.userId, p.id, n, defined({ rootCause: a.rootCause, injectedPhase: a.injectedPhase, detectedByTool: a.detectedByTool, testLevel: a.testLevel, fixNote: a.fixNote }) as Parameters<typeof t.setDefectExtra>[3]) }; }
      case 'finding': {
        const f = need(a.finding, 'finding'); const act = need(a.findingAction, 'findingAction');
        const p = await hit(ctx, a.project, 'POST', `/static-analysis/findings/${f}/${act}`);
        return { finding: act === 'issue' ? await stat.findingToIssue(ctx.userId, p.id, f) : await stat.setFindingStatus(ctx.userId, p.id, f, act === 'ignore' ? 'IGNORED' : 'OPEN') };
      }
      case 'reset_flaky': { const id = need(a.autoTest, 'autoTest'); const p = await hit(ctx, a.project, 'POST', `/test-automation/tests/${id}/reset-flaky`); return { reset: await autoTests.resetFlaky(ctx.userId, p.id, id) }; }
    }
    throw bad('Unknown action');
  },
});

// ═══ Xoá gom + đọc gom ═══════════════════════════════════════════

const DEL_KINDS = ['dashboard', 'filter', 'baseline', 'exploratory', 'desk_problem', 'meeting_series', 'resource_group', 'form', 'weekly_report', 'ai_usage_row', 'peer_round', 'diagram_comment'] as const;
const ctworkDelete = defineTool({
  name: 'ctwork_delete', title: 'Delete other project items', group: 'planning',
  description: 'DESTRUCTIVE: deletes one item — kind dashboard | filter | baseline | exploratory (session number) | desk_problem (problem number) | meeting_series (series id; scope all/following, fromMeeting) | resource_group | form (F-2) | weekly_report | ai_usage_row | peer_round | diagram_comment (with diagram). Issues, pages, tests, SRS/SWR, CRs, reviews, versions, classes have their own *_delete tools. The user must confirm.',
  write: true, destructive: true, personOnly: true,
  input: z.object({
    project: projectArg, kind: z.enum(DEL_KINDS), id: z.union([z.number().int().positive(), z.string().max(12)]),
    diagram: z.number().int().positive().optional(), scope: z.enum(['all', 'following']).optional(), fromMeeting: z.number().int().positive().optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete project items');
    const id = numOf(a.id, a.kind);
    const D = (path: string) => hit(ctx, a.project, 'DELETE', path);
    switch (a.kind) {
      case 'dashboard': { const p = await D(`/dashboards/${id}`); await search.deleteDashboard(ctx.userId, p.id, id); break; }
      case 'filter': { const p = await D(`/filters/${id}`); await search.deleteFilter(ctx.userId, p.id, id); break; }
      case 'baseline': { const p = await D(`/timeline/baselines/${id}`); await uxc.deleteBaseline(ctx.userId, p.id, id); break; }
      case 'exploratory': { const p = await D(`/exploratory/${id}`); await t.deleteExploratory(ctx.userId, p.id, id); break; }
      case 'desk_problem': { const p = await D(`/desk/problems/${id}`); await desk.deleteProblem(ctx.userId, p.id, id); break; }
      case 'meeting_series': { const p = await D(`/meeting-series/${id}`); await series.deleteSeries(ctx.userId, p.id, id, { scope: a.scope ?? 'all', fromMeeting: a.fromMeeting }); break; }
      case 'resource_group': { const p = await D(`/resource-groups/${id}`); await resources.deleteGroup(ctx.userId, p.id, id); break; }
      case 'form': { const p = await D(`/forms/${id}`); await forms.deleteForm(ctx.userId, p.id, id); break; }
      case 'weekly_report': { const p = await D(`/fpt-reports/weekly/${id}`); await rep.deleteWeekly(ctx.userId, p.id, id); break; }
      case 'ai_usage_row': { const p = await D(`/fpt-reports/ai-usage/${id}`); await rep.deleteAiUsage(ctx.userId, p.id, id); break; }
      case 'peer_round': { const p = await D(`/contrib/peer/rounds/${id}`); await peer.deleteRound(ctx.userId, p.id, id); break; }
      case 'diagram_comment': { const n = need(a.diagram, 'diagram'); const p = await D(`/diagrams/${n}/comments/${id}`); await dg.deleteComment(ctx.userId, p.id, n, id); break; }
    }
    return { deleted: { kind: a.kind, id } };
  },
});

const READ_WHAT = ['dashboards', 'filters', 'baselines', 'exploratory', 'wbs', 'desk_queue', 'desk_problems', 'handoffs', 'peer_rounds', 'meeting_series', 'weekly_reports', 'ai_usage', 'report_doc', 'estimation', 'status_report'] as const;
const READ_ROUTE: Record<(typeof READ_WHAT)[number], string> = {
  dashboards: '/dashboards', filters: '/filters', baselines: '/timeline/baselines', exploratory: '/exploratory', wbs: '/wbs', desk_queue: '/desk/queue', desk_problems: '/desk/problems',
  handoffs: '/handoffs', peer_rounds: '/contrib/peer/rounds', meeting_series: '/meeting-series', weekly_reports: '/fpt-reports/weekly', ai_usage: '/fpt-reports/ai-usage',
  report_doc: '/fpt-reports/doc', estimation: '/swr/estimation', status_report: '/swr/status-report',
};
const ctworkRead = defineTool({
  name: 'ctwork_read', title: 'Read other project data', group: 'planning',
  description: 'Reads one list (with ids for the *_manage / ctwork_delete tools): dashboards | filters | baselines | exploratory (number = one session) | wbs | desk_queue | desk_problems (number = one problem) | handoffs | peer_rounds (number = one round) | meeting_series | weekly_reports | ai_usage | report_doc (course/group info) | estimation | status_report.',
  write: false,
  input: z.object({ project: projectArg, what: z.enum(READ_WHAT), number: z.number().int().positive().optional() }),
  run: async (ctx, a) => {
    const route = a.number && ['exploratory', 'desk_problems', 'peer_rounds'].includes(a.what) ? `${READ_ROUTE[a.what]}/${a.number}` : READ_ROUTE[a.what];
    const p = await projectFor(ctx, a.project, [['GET', route]]);
    const u = ctx.userId;
    const data: unknown = await ({
      dashboards: () => search.listDashboards(u, p.id), filters: () => search.listFilters(u, p.id), baselines: () => uxc.listBaselines(u, p.id),
      exploratory: () => (a.number ? t.getExploratory(u, p.id, a.number) : t.listExploratory(u, p.id)), wbs: () => rep.getWbs(u, p.id),
      desk_queue: () => desk.queue(u, p.id), desk_problems: () => (a.number ? desk.getProblem(u, p.id, a.number) : desk.listProblems(u, p.id)),
      handoffs: () => handoffs.listProjectHandoffs(u, p.id, {}), peer_rounds: () => (a.number ? peer.getRound(u, p.id, a.number) : peer.listRounds(u, p.id)),
      meeting_series: () => series.listSeries(u, p.id), weekly_reports: () => rep.listWeekly(u, p.id), ai_usage: () => rep.listAiUsage(u, p.id),
      report_doc: () => rep.getReportDoc(u, p.id), estimation: () => pack.getEstimation(u, p.id), status_report: () => pack.getStatusReport(u, p.id),
    } as Record<string, () => Promise<unknown>>)[a.what]();
    const text = json(data);
    return untrusted(a.what, text.length > 60_000 ? `${text.slice(0, 60_000)}\n… (cut)` : text);
  },
});

/** Chỉ MCP (như parity.ts / parity2.ts). */
export const PARITY3_COMMANDS: ToolDef[] = [
  classAdmin, classQuiz, swrExtras, issueExtras, issueBulk, serviceDesk, chatExtras, docsExtras, meetingExtras,
  dashboardSave, exploratoryManage, wbsManage, resourceExtras, planningExtras, fptReportsManage, contribManage, formManage,
  governanceExtras, diagramExtras, testExtras, ctworkDelete, ctworkRead,
].map(mcpOnly);
