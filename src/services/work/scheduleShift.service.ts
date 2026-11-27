/**
 * CT Work — Dời lịch dự án (27/11/2026).
 *
 * Dịch MỌI mốc ngày CÒN MỞ của một dự án đi cùng một số ngày, trong một giao dịch:
 *   thẻ chưa xong (start/due) · sprint chưa hoàn tất (startAt/endAt) · version chưa phát hành (start/release) ·
 *   vòng test (startAt/endAt) · giai đoạn chưa xong (plannedStart/End) · RAID chưa đóng (reviewDate) ·
 *   "Tuần 1" của báo cáo FPT (week1Start — để Weekly Report đánh số tuần đúng).
 * Thứ đã XONG (thẻ resolved, sprint completed, version released, giai đoạn completed) giữ nguyên — đó là lịch sử.
 * Cuộc họp KHÔNG dời (đã gửi lời mời/lịch cho người khác) — trả về số cuộc họp tương lai để người dùng tự xem.
 *
 * Hai cách nói số ngày: `days` (±) hoặc `firstSprintStart` (YYYY-MM-DD giờ VN) = ngày sprint mở sớm nhất sẽ bắt đầu.
 * `dryRun` ⇒ chỉ đếm, không ghi. Quyền: project.settings (ADMIN; agent bị chặn ở requireProject). Ghi audit.
 * Lý do có tính năng: kế hoạch dựng sẵn (vd LabFlow 20 tuần, 603 thẻ) lệch ngày bắt đầu thật ⇒ trước đây phải sửa từng thẻ.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { requireProject } from './permissions.js';
import { audit } from './audit.js';

const NGAY_MS = 86_400_000;
const VN_MS = 7 * 3_600_000;

export interface ShiftInput {
  days?: number;
  firstSprintStart?: string;
  dryRun?: boolean;
}

export interface ShiftResult {
  days: number;
  dryRun: boolean;
  firstSprint: { name: string; oldStart: string | null; newStart: string | null } | null;
  counts: { issues: number; sprints: number; versions: number; testCycles: number; stages: number; raid: number; reportDoc: number };
  meetingsNotMoved: number;
}

/** Ngày VN (YYYY-MM-DD) của một mốc UTC. */
const ngayVN = (d: Date) => new Date(d.getTime() + VN_MS).toISOString().slice(0, 10);

/** Số ngày từ ngày VN `a` tới ngày VN `b` (cả hai YYYY-MM-DD). */
export function soNgayGiua(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / NGAY_MS);
}

export async function shiftProjectSchedule(userId: number, projectId: number, input: ShiftInput): Promise<ShiftResult> {
  const access = await requireProject(userId, projectId, 'project.settings');
  const dryRun = input.dryRun ?? false;

  const firstSprint = await prisma.workSprint.findFirst({
    where: { projectId, completedAt: null, startAt: { not: null } },
    orderBy: { startAt: 'asc' },
    select: { name: true, startAt: true },
  });

  let days: number;
  if (input.firstSprintStart !== undefined) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.firstSprintStart)) throw new BadRequestError('firstSprintStart: use YYYY-MM-DD', 'VALIDATION_ERROR');
    if (!firstSprint?.startAt) throw new BadRequestError('This project has no open sprint with a start date — pass days instead', 'WORK_SHIFT_NO_SPRINT');
    days = soNgayGiua(ngayVN(firstSprint.startAt), input.firstSprintStart);
  } else if (input.days !== undefined) {
    days = input.days;
  } else {
    throw new BadRequestError('Pass days or firstSprintStart', 'VALIDATION_ERROR');
  }
  if (!Number.isInteger(days) || Math.abs(days) > 730) throw new BadRequestError('Shift must be a whole number of days within ±730', 'VALIDATION_ERROR');

  const iv = Prisma.sql`(${days}::int * interval '1 day')`;
  const counts = { issues: 0, sprints: 0, versions: 0, testCycles: 0, stages: 0, raid: 0, reportDoc: 0 };

  const dem = async (tx: Prisma.TransactionClient) => {
    const n = (r: Array<{ n: bigint }>) => Number(r[0]?.n ?? 0);
    counts.issues = n(await tx.$queryRaw`SELECT count(*)::bigint AS n FROM work_issues WHERE project_id = ${projectId} AND deleted_at IS NULL AND resolved_at IS NULL AND (start_date IS NOT NULL OR due_date IS NOT NULL)`);
    counts.sprints = n(await tx.$queryRaw`SELECT count(*)::bigint AS n FROM work_sprints WHERE project_id = ${projectId} AND completed_at IS NULL AND (start_at IS NOT NULL OR end_at IS NOT NULL)`);
    counts.versions = n(await tx.$queryRaw`SELECT count(*)::bigint AS n FROM work_versions WHERE project_id = ${projectId} AND status = 'UNRELEASED' AND (start_date IS NOT NULL OR release_date IS NOT NULL)`);
    counts.testCycles = n(await tx.$queryRaw`SELECT count(*)::bigint AS n FROM work_test_cycles WHERE project_id = ${projectId} AND (start_at IS NOT NULL OR end_at IS NOT NULL)`);
    counts.stages = n(await tx.$queryRaw`SELECT count(*)::bigint AS n FROM work_stages WHERE project_id = ${projectId} AND completed_at IS NULL AND (planned_start IS NOT NULL OR planned_end IS NOT NULL)`);
    counts.raid = n(await tx.$queryRaw`SELECT count(*)::bigint AS n FROM work_raid_items WHERE project_id = ${projectId} AND deleted_at IS NULL AND closed_at IS NULL AND review_date IS NOT NULL`);
    counts.reportDoc = n(await tx.$queryRaw`SELECT count(*)::bigint AS n FROM work_fpt_report_docs WHERE project_id = ${projectId} AND week1_start IS NOT NULL`);
  };

  const meetingsNotMoved = await prisma.workMeeting.count({ where: { projectId, startsAt: { gt: new Date() } } }).catch(() => 0);

  if (dryRun || days === 0) {
    await dem(prisma as unknown as Prisma.TransactionClient);
  } else {
    await prisma.$transaction(async (tx) => {
      await dem(tx);
      await tx.$executeRaw`UPDATE work_issues SET start_date = start_date + ${iv}, due_date = due_date + ${iv} WHERE project_id = ${projectId} AND deleted_at IS NULL AND resolved_at IS NULL AND (start_date IS NOT NULL OR due_date IS NOT NULL)`;
      await tx.$executeRaw`UPDATE work_sprints SET start_at = start_at + ${iv}, end_at = end_at + ${iv} WHERE project_id = ${projectId} AND completed_at IS NULL AND (start_at IS NOT NULL OR end_at IS NOT NULL)`;
      await tx.$executeRaw`UPDATE work_versions SET start_date = start_date + ${iv}, release_date = release_date + ${iv} WHERE project_id = ${projectId} AND status = 'UNRELEASED' AND (start_date IS NOT NULL OR release_date IS NOT NULL)`;
      await tx.$executeRaw`UPDATE work_test_cycles SET start_at = start_at + ${iv}, end_at = end_at + ${iv} WHERE project_id = ${projectId} AND (start_at IS NOT NULL OR end_at IS NOT NULL)`;
      await tx.$executeRaw`UPDATE work_stages SET planned_start = planned_start + ${iv}, planned_end = planned_end + ${iv} WHERE project_id = ${projectId} AND completed_at IS NULL AND (planned_start IS NOT NULL OR planned_end IS NOT NULL)`;
      await tx.$executeRaw`UPDATE work_raid_items SET review_date = review_date + ${iv} WHERE project_id = ${projectId} AND deleted_at IS NULL AND closed_at IS NULL AND review_date IS NOT NULL`;
      await tx.$executeRaw`UPDATE work_fpt_report_docs SET week1_start = week1_start + ${iv} WHERE project_id = ${projectId} AND week1_start IS NOT NULL`;
    }, { timeout: 60_000 });
    await audit({
      workspaceId: access.workspaceId, projectId, actorId: userId, action: 'project.schedule_shift', targetType: 'project', targetId: projectId,
      summary: `Shifted the open schedule by ${days} day(s)`, detail: { days, counts },
    });
  }

  const newStart = firstSprint?.startAt ? ngayVN(new Date(firstSprint.startAt.getTime() + days * NGAY_MS)) : null;
  return {
    days, dryRun: dryRun || days === 0,
    firstSprint: firstSprint ? { name: firstSprint.name, oldStart: firstSprint.startAt ? ngayVN(firstSprint.startAt) : null, newStart } : null,
    counts, meetingsNotMoved,
  };
}
