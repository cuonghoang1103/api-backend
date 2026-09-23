/**
 * CT Work — tốc độ sprint đang chạy, MỘT chỗ tính cho Health, bản tin AI,
 * ngữ cảnh chat và báo cáo tuần.
 *
 * Mốc giống Burndown: điểm cam kết lúc bấm Start (committedPoints). Trước
 * đây tốc độ chỉ lấy từ workSprintSnapshot nên ngày đầu / khi cron tắt nó
 * ra "0 pts/day" và báo AT RISK sai. Giờ:
 *   burned = max(cam kết − còn lại, điểm đã xong)   (thêm phạm vi giữa sprint
 *            không làm tốc độ về 0)
 *   recentPerDay = burned / số ngày đã qua (ngày VN, tính cả hôm nay)
 * Không báo rủi ro ở ngày đầu, và không báo khi chưa ước lượng gì.
 */

import { prisma } from '../../config/database.js';
import { estimateOf, estimationOf, vnDay, type EstimationMode } from './sprints.service.js';

const DAY = 86_400_000;
const round1 = (n: number) => Math.round(n * 10) / 10;

export type PaceStatus = 'NO_ESTIMATES' | 'TOO_EARLY' | 'DONE' | 'AT_RISK' | 'ON_TRACK';

export interface SprintPace {
  sprint: string;
  committed: number;
  total: number;
  remaining: number;
  done: number;
  daysLeft: number;
  elapsedDays: number;
  neededPerDay: number;
  recentPerDay: number;
  /** Có thẻ nào mang ước lượng không (0 ⇒ không đoán được tiến độ). */
  estimated: boolean;
  atRisk: boolean;
  status: PaceStatus;
  /** Một câu tiếng Anh dựng sẵn cho AI/báo cáo — cùng một kết luận ở mọi nơi. */
  summary: string;
}

/** Số ngày lịch VN từ ngày bắt đầu tới hôm nay, tính cả hai đầu (ngày đầu = 1). */
export function elapsedVnDays(startAt: Date, now: Date): number {
  const a = new Date(`${vnDay(startAt)}T12:00:00+07:00`).getTime();
  const b = new Date(`${vnDay(now)}T12:00:00+07:00`).getTime();
  return Math.max(1, Math.round((b - a) / DAY) + 1);
}

/** Phần thuần (không DB) — test được bằng số. */
export function computePace(input: {
  name: string;
  startAt: Date;
  endAt: Date;
  committedPoints: number | null;
  issues: Array<{ points: number; resolved: boolean }>;
  unit: EstimationMode;
  now?: Date;
}): SprintPace {
  const now = input.now ?? new Date();
  const total = round1(input.issues.reduce((s, i) => s + i.points, 0));
  const remaining = round1(input.issues.filter((i) => !i.resolved).reduce((s, i) => s + i.points, 0));
  const done = round1(total - remaining);
  const committed = input.committedPoints ?? total;
  const burned = Math.max(0, committed - remaining, done);
  const elapsedDays = elapsedVnDays(input.startAt, now);
  const daysLeft = Math.max(0, Math.ceil((input.endAt.getTime() - now.getTime()) / DAY));
  const recentPerDay = round1(burned / elapsedDays);
  const neededPerDay = daysLeft ? round1(remaining / daysLeft) : remaining;
  const estimated = total > 0 || committed > 0;

  let status: PaceStatus;
  if (!estimated) status = 'NO_ESTIMATES';
  else if (remaining <= 0) status = 'DONE';
  else if (daysLeft === 0) status = 'AT_RISK'; // hết hạn mà còn việc
  else if (elapsedDays < 2) status = 'TOO_EARLY';
  else status = neededPerDay > recentPerDay * 1.3 ? 'AT_RISK' : 'ON_TRACK';

  const u = input.unit === 'HOURS' ? 'h' : 'pts';
  const base = `Active sprint "${input.name}": ${remaining} ${u} left of ${total}, ${daysLeft} day${daysLeft === 1 ? '' : 's'} left`;
  const summary = {
    NO_ESTIMATES: `${base} — no issues are estimated, so progress cannot be forecast (not a risk signal).`,
    TOO_EARLY: `${base}, day ${elapsedDays} of the sprint — too early to forecast; ${done} ${u} done so far.`,
    DONE: `${base} — all estimated work is done.`,
    AT_RISK: daysLeft === 0
      ? `${base} — the end date has passed with work remaining → AT RISK.`
      : `${base}, needs ${neededPerDay} ${u}/day vs recent ${recentPerDay} ${u}/day → AT RISK.`,
    ON_TRACK: `${base}, needs ${neededPerDay} ${u}/day vs recent ${recentPerDay} ${u}/day → on track.`,
  }[status];

  return {
    sprint: input.name, committed: round1(committed), total, remaining, done, daysLeft, elapsedDays,
    neededPerDay, recentPerDay, estimated, atRisk: status === 'AT_RISK', status, summary,
  };
}

/** Tốc độ sprint đang chạy của dự án (null nếu không có sprint chạy có ngày). */
export async function activeSprintPace(projectId: number, now = new Date()): Promise<SprintPace | null> {
  const active = await prisma.workSprint.findFirst({
    where: { projectId, state: 'ACTIVE' },
    select: { id: true, name: true, startAt: true, endAt: true, committedPoints: true },
  });
  if (!active?.startAt || !active.endAt) return null;
  const unit = await estimationOf(projectId);
  const rows = await prisma.workIssue.findMany({
    where: { sprintId: active.id, deletedAt: null, type: { level: 0 } },
    select: { storyPoints: true, originalEstimateMin: true, resolvedAt: true },
  });
  return computePace({
    name: active.name, startAt: active.startAt, endAt: active.endAt, committedPoints: active.committedPoints,
    issues: rows.map((r) => ({ points: estimateOf(r, unit), resolved: !!r.resolvedAt })), unit, now,
  });
}
