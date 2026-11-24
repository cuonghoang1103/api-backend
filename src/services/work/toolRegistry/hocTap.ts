/**
 * Registry lệnh — 24/11/2026: HỌC TẬP & LỊCH CÁ NHÂN (CT Work → Của tôi → Học tập & Lịch). MỘT lệnh `hoc_tap` gộp theo
 * `action` (mục lục MCP cho token người có trần — registry.test giữ ≤ 280).
 *
 * Dữ liệu là của CHÍNH người cầm token (kỳ, môn, việc học, việc cá nhân) — không thuộc dự án nào, không lộ cho ai.
 * personOnly (agent thành viên không có lịch học); chỉ MCP (CuongMini CLI/app/VS Code, Claude Code…) — Ask AI trên web
 * đứng trong MỘT dự án nên không cần.
 *
 * Luật "không tự tích" của /hoc-tap giữ nguyên: lệnh này KHÔNG đặt trạng thái/điểm việc HỌC — chỉ `bat_dau` (bấm giờ).
 * Việc học xong bằng cách nộp bằng chứng trên web để AI chấm. Việc CÁ NHÂN thì tự đánh dấu xong được.
 * Không có xoá ở đây (xoá trên web) — khỏi phải qua hàng duyệt xoá của lệnh destructive.
 */

import { z } from 'zod';
import { BadRequestError } from '../../../middleware/errorHandler.js';
import { requirePerson, requireWrite } from '../../../mcp/context.js';
import * as svc from '../../hocTap/hocTap.service.js';
import * as caNhan from '../../hocTap/viecCaNhan.js';
import { docMaViec, veHomNay, veTuan } from '../../hocTap/veHocTap.js';
import { defineTool, mcpOnly, type ToolDef } from './types.js';

const bad = (m: string) => new BadRequestError(m, 'VALIDATION_ERROR');
const ACTIONS = ['today', 'week', 'list_personal', 'start', 'add', 'edit', 'done', 'undone'] as const;
const WRITES = new Set<string>(['start', 'add', 'edit', 'done', 'undone']);

const hocTapTool = defineTool({
  name: 'hoc_tap', title: 'My study plan & personal schedule', group: 'planning',
  description: 'The caller\'s OWN study plan and personal schedule (CT Work → My → Study & Schedule; private, not part of any project). '
    + 'Use it when the user asks what to study/do today or this week, or wants to add/finish a personal to-do. Times are Vietnam time (UTC+7). '
    + 'Ids: "H<n>" = a STUDY task of a subject (graded by AI from submitted evidence — you can only START it, never mark it done), '
    + '"C<n>" = a PERSONAL task (can be marked done). action: '
    + 'today (classes + scheduled study blocks + personal tasks for today, overdue study tasks, fail-risk per subject) | week (next 7 days, by hour) | '
    + 'list_personal (from/to YYYY-MM-DD) | start (id H<n>: starts the study timer) | '
    + 'add (title; optional date YYYY-MM-DD, time HH:MM, minutes 5–600, note) | edit (id C<n>; any of title/date/time/minutes/note; time "" removes the time) | '
    + 'done / undone (id C<n>). Adding a timed personal task re-schedules overlapping study blocks automatically. Delete on the web.',
  write: true, personOnly: true,
  input: z.object({
    action: z.enum(ACTIONS),
    id: z.union([z.string().max(14), z.number().int().positive()]).optional().describe('"H12" study task or "C5" personal task'),
    title: z.string().max(255).optional(),
    date: z.string().max(10).optional().describe('YYYY-MM-DD (Vietnam date)'),
    time: z.string().max(5).optional().describe('HH:MM 24h Vietnam time; "" = no time'),
    minutes: z.number().int().min(5).max(600).optional(),
    note: z.string().max(4000).optional(),
    from: z.string().max(10).optional(), to: z.string().max(10).optional(),
  }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'use the personal study plan');
    if (WRITES.has(a.action)) requireWrite(ctx);
    const u = ctx.userId;
    switch (a.action) {
      case 'today': return veHomNay(await caNhan.homNayGop(u));
      case 'week': return veTuan(await caNhan.tuanGop(u));
      case 'list_personal': {
        const hn = caNhan.ngayVNChuoi(new Date());
        const ds = await caNhan.dsViecCaNhan(u, { tu: a.from ?? hn, den: a.to ?? a.from ?? hn, tonDong: !a.from });
        return { tasks: ds.map((v) => ({ id: `C${v.id}`, title: v.tieuDe, date: v.ngay, time: v.gioBatDau ? gioCua(v.gioBatDau) : null, minutes: v.thoiLuongPhut, done: v.xong, overdue: v.quaHan, note: v.ghiChu })) };
      }
      case 'start': {
        const m = docMaViec(a.id, 'H');
        if (!m) throw bad('start needs id "H<n>"');
        if (m.loai !== 'H') throw bad('Personal tasks have no timer — use done.');
        const v = await svc.batDauViec(u, m.id);
        return { started: `H${v.id}`, title: v.tieuDe, minutes: v.thoiLuongPhut, next: 'Do the task, then submit evidence on the web (Học tập & Lịch → open the task → Nộp) to get it graded.' };
      }
      case 'add': {
        if (!a.title?.trim()) throw bad('add needs title');
        const v = await caNhan.taoViecCaNhan(u, { tieuDe: a.title, ghiChu: a.note, thoiLuongPhut: a.minutes, ...thoiDiem(a.date, a.time) });
        await caNhan.xepLaiNeuChong(u, v.gioBatDau, v.thoiLuongPhut);
        return { added: `C${v.id}`, title: v.tieuDe, date: v.ngay, time: v.gioBatDau ? gioCua(v.gioBatDau) : null, minutes: v.thoiLuongPhut };
      }
      case 'edit': {
        const m = docMaViec(a.id, 'C');
        if (!m || m.loai !== 'C') throw bad('edit needs a personal task id "C<n>" (study tasks are changed by re-planning on the web)');
        const v = await caNhan.suaViecCaNhan(u, m.id, { tieuDe: a.title, ghiChu: a.note, thoiLuongPhut: a.minutes, ...thoiDiem(a.date, a.time, true) });
        await caNhan.xepLaiNeuChong(u, v.gioBatDau, v.thoiLuongPhut);
        return { updated: `C${v.id}`, title: v.tieuDe, date: v.ngay, time: v.gioBatDau ? gioCua(v.gioBatDau) : null, minutes: v.thoiLuongPhut };
      }
      case 'done':
      case 'undone': {
        const m = docMaViec(a.id, 'C');
        if (!m) throw bad(`${a.action} needs id "C<n>"`);
        if (m.loai === 'H') throw bad('Study tasks are completed by submitting evidence on the web and passing the AI grading — they cannot be ticked.');
        const v = await caNhan.danhDauXong(u, m.id, a.action === 'done');
        return { id: `C${v.id}`, title: v.tieuDe, done: v.xong };
      }
      default: throw bad('Unknown action');
    }
  },
});

const gioCua = (d: Date) => new Date(d.getTime() + 7 * 3_600_000).toISOString().slice(11, 16);

/**
 * (date?, time?) giờ VN ⇒ trường của viecCaNhan. Có giờ mà không ngày ⇒ hôm nay. `sua`: chỉ gửi trường người dùng đưa
 * (time "" = bỏ giờ, giữ ngày).
 */
export function thoiDiem(date: string | undefined, time: string | undefined, sua = false): { gioBatDau?: string | null; ngay?: string } {
  if (date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw bad('date must be YYYY-MM-DD');
  if (time === undefined || (time === '' && !sua)) return date ? { ngay: date } : {};
  if (time === '') return { gioBatDau: null, ...(date ? { ngay: date } : {}) };
  const m = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) throw bad('time must be HH:MM (24h)');
  const ngay = date ?? caNhan.ngayVNChuoi(new Date());
  const iso = new Date(Date.parse(`${ngay}T${m[1].padStart(2, '0')}:${m[2]}:00.000Z`) - 7 * 3_600_000).toISOString();
  return { gioBatDau: iso, ngay };
}

export const HOC_TAP_COMMANDS: ToolDef[] = [mcpOnly(hocTapTool)];
