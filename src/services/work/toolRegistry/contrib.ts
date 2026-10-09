/**
 * Registry lệnh — ĐÓNG GÓP THÀNH VIÊN (CTW Đóng góp, 10/10/2026). CHỈ ĐỌC.
 *
 *   contrib_summary — bảng chỉ số từng người + tổng nhóm + tín hiệu cần chú ý trong một khoảng, để Ask AI / AI bên ngoài
 *                     (token CÁ NHÂN) tóm tắt cho trưởng nhóm / giảng viên. Quyền như trên web (contribGate): MEMBER chỉ
 *                     nhận dòng của mình + tổng nhóm. Token AGENT bị chặn ở `projectFor` (AGENT_DENIED_ROUTES `/contrib`)
 *                     và ở service — agent không đọc số liệu người. Không có trên đường BUILTIN.
 */

import { z } from 'zod';
import { projectFor } from '../../../mcp/context.js';
import { projectArg } from '../../../mcp/tools/read.js';
import { displayName } from '../common.js';
import { summary } from '../contrib.service.js';
import { RANGE_PRESETS } from '../contribRules.js';
import { defineTool, type ToolDef } from './types.js';

const dateArg = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

const contribSummary = defineTool({
  name: 'contrib_summary', title: 'Team contribution summary', group: 'planning',
  description: 'Per-member contribution numbers for a time range (completed issues, points, on-time rate, overdue, hours, comments/chat, reviews, commits, docs, tests, meetings, active days) plus team totals and "needs attention" signals with reasons. Read-only. Counts are activity, not quality — say so when summarising, and never label a person.',
  write: false,
  surfaces: { builtin: false },
  input: z.object({
    project: projectArg,
    preset: z.enum(RANGE_PRESETS).optional().describe('today | 7d | 30d | week | sprint | stage | project | custom (default 30d)'),
    from: dateArg.optional(), to: dateArg.optional(),
    sprintId: z.number().int().positive().optional(), stageId: z.number().int().positive().optional(),
  }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/contrib/summary']]);
    const s = await summary(ctx.userId, p.id, { preset: a.preset, from: a.from, to: a.to, sprintId: a.sprintId, stageId: a.stageId });
    return {
      range: { label: s.window.label, from: s.window.fromDay, to: s.window.toDay, timezone: s.window.tz, previous: s.previous },
      visibility: s.access.view === 'ALL' ? 'every member' : 'only you + team totals (other members are hidden)',
      unit: s.unit === 'HOURS' ? 'hours' : 'story points',
      team: { people: s.team.humans, agents: s.team.agents, totals: s.team.totals, changeVsPrevious: s.team.delta },
      members: s.members.map((r) => ({
        name: displayName(r.user), username: r.user.username, kind: r.user.isAgent ? 'AI agent' : 'person',
        completed: r.metrics.completed, points: r.metrics.points, onTimeRate: r.metrics.onTimeRate, overdueOpen: r.metrics.overdueOpen,
        cycleDays: r.metrics.cycleDays, hours: r.metrics.hours, comments: r.metrics.comments, chatMessages: r.metrics.chatMessages,
        replyHours: r.metrics.responseHours, reviewsDone: r.metrics.reviewsDone, commits: r.metrics.commits, prs: r.metrics.prs,
        docVersions: r.metrics.docVersions, testWork: r.metrics.testRuns + r.metrics.testCasesCreated + r.metrics.utcidExecuted + r.metrics.itExecuted,
        meetings: `${r.metrics.meetingsAttended}/${r.metrics.meetingsInvited}`, activeDays: `${r.metrics.activeDays}/${s.window.days}`,
        daysSilentNow: r.metrics.silentNow, signals: r.signals.map((x) => x.text), change: r.delta,
      })),
      hiddenMembers: s.hiddenMembers,
      note: s.note,
    };
  },
});

export const CONTRIB_COMMANDS: ToolDef[] = [contribSummary];
