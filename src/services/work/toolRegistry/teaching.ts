/**
 * Registry lệnh — HUB GIẢNG VIÊN (CTW đợt 5, 10/10/2026). CHỈ ĐỌC.
 *
 *   teaching_overview — mọi nhóm mà người gọi hướng dẫn (vai TEACHER, xuyên không gian) + sức khoẻ có LÝ DO, để AI ngoài
 *                       (Claude Desktop / Cursor… qua token CÁ NHÂN của giảng viên) tóm tắt tình hình các nhóm. Không có
 *                       tham số `project` ⇒ chỉ đi đường MCP (Ask AI / BUILTIN luôn ở trong MỘT dự án).
 *   teaching_group    — một nhóm (dự án) cho giảng viên đang ở trong dự án đó: hỏi Ask AI "nhóm này đang thế nào?".
 * Token agent: 403 (tool tự chặn + `projectFor` chặn `/grades` cho agent). Không lệnh ghi nào — chấm điểm, công bố điểm
 * chỉ làm trên web bởi NGƯỜI.
 */

import { z } from 'zod';
import { AppError } from '../../../middleware/errorHandler.js';
import { projectFor } from '../../../mcp/context.js';
import { projectArg } from '../../../mcp/tools/read.js';
import { factsOf, groupForTeacher, overview } from '../teaching.service.js';
import { defineTool, type ToolDef } from './types.js';

const denyAgent = (ctx: { agent: unknown }) => {
  if (ctx.agent) throw new AppError('AI agents cannot read the lecturer hub', 403, 'WORK_AGENT_FORBIDDEN');
};

const teachingOverview = defineTool({
  name: 'teaching_overview', title: 'Lecturer hub — all supervised groups', group: 'planning',
  description: 'For lecturers: every student group (project) you supervise with the Teacher role, across workspaces — health (red/amber/green) with concrete reasons, stage and sprint progress, overdue work, FPT documents submitted or missing (Report 1–7, 5.1/5.2/5.3, Weekly, AI usage), unanswered Q&A, open risks and members flagged by contribution signals. Filter by subject, class code or term. Read-only. Counts are activity, not quality — never label a student.',
  write: false,
  surfaces: { ask: false, builtin: false },
  input: z.object({
    subject: z.string().max(16).optional().describe('SWP391 | SWT301 | SWR302 | SEP490 | ISP490 | OTHER'),
    classCode: z.string().max(32).optional().describe('e.g. SE1840'),
    term: z.string().max(16).optional().describe('e.g. FA26'),
  }),
  run: async (ctx, a) => {
    denyAgent(ctx);
    const o = await overview(ctx.userId, { subject: a.subject, classCode: a.classCode, term: a.term });
    return {
      totals: o.totals, facets: o.facets,
      groups: o.groups.map((g) => ({
        project: g.key, name: g.name, class: g.classCode, term: g.term, subject: g.subject, group: g.groupCode, url: g.href,
        health: g.health.status, reasons: g.health.reasons, members: g.members.length,
        stage: g.stage, sprint: g.sprint, issues: g.issues, qna: g.qna, risks: g.risks,
        docs: { submitted: g.docsSubmitted, expected: g.docsExpected, states: g.docs }, grades: g.grades,
        flaggedMembers: g.members.filter((m) => m.signals.length).map((m) => ({ name: m.name, signals: m.signals })),
      })),
      facts: factsOf(o.groups),
    };
  },
});

const teachingGroup = defineTool({
  name: 'teaching_group', title: 'Lecturer view of this group', group: 'planning',
  description: 'For the lecturer (Teacher role) of this project: group health with reasons, stage/sprint progress, overdue work, FPT documents submitted/missing, unanswered Q&A, open risks, members flagged by contribution signals and how many grades are published. Read-only.',
  write: false,
  surfaces: { builtin: false },
  input: z.object({ project: projectArg }),
  run: async (ctx, a) => {
    denyAgent(ctx);
    const p = await projectFor(ctx, a.project, [['GET', '/grades']]);
    const g = await groupForTeacher(ctx.userId, p.id);
    return { ...g, facts: factsOf([g]) };
  },
});

export const TEACHING_COMMANDS: ToolDef[] = [teachingOverview, teachingGroup];
