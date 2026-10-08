/**
 * CT Work — CTW-9 (08/10/2026): "quá tải" trong Insights / bản tin hằng ngày.
 *
 * Trước: cộng MỌI thẻ mở được giao của MỌI sprint (kể cả sprint tháng 12 và năm 2027) rồi so
 * với trung bình nhóm ⇒ báo fp_server "68" quá tải; bản tin AI còn gọi đó là "68 items" (vì dữ
 * kiện không ghi đơn vị). Giờ:
 *   1. PHẠM VI: có sprint ACTIVE ⇒ chỉ thẻ trong sprint đang chạy. Không có (Kanban) ⇒ thẻ đang
 *      làm hoặc có hạn trong LOAD_WINDOW_DAYS ngày tới, bỏ thẻ đã xếp vào sprint PLANNED tương lai.
 *   2. SỨC CHỨA: người đã khai `capacityHours` (giờ/ngày cho dự án) ⇒ so với sức chứa trong phạm vi
 *      (giờ/ngày × ngày làm việc còn lại; chế độ điểm quy đổi HOURS_PER_POINT giờ/điểm — cùng hệ
 *      số với Workload của portfolio). Chưa khai ⇒ lùi về luật tương đối cũ (> 1,6× trung bình nhóm).
 *   3. ĐƠN VỊ đi kèm mọi con số (points | hours) để AI không đọc nhầm thành "items".
 * Phần thuần (không DB) ở đây để test bằng số; ai.service.insights lo phần truy vấn.
 */

import { WORKLOAD_RULES } from './portfolioRules.js';

/** Ngày lịch VN (YYYY-MM-DD) — chép từ sprints.service để tệp này không kéo theo DB (test thuần). */
const vnDay = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

export const LOAD_WINDOW_DAYS = 14;
const DAY = 86_400_000;

/** Số ngày làm việc (T2–T6, theo lịch VN) từ hôm nay tới `end`, tính cả hai đầu; tối thiểu 1. */
export function workingDaysLeft(now: Date, end: Date): number {
  const start = new Date(`${vnDay(now)}T12:00:00+07:00`).getTime();
  const last = new Date(`${vnDay(end)}T12:00:00+07:00`).getTime();
  let n = 0;
  for (let t = start; t <= last; t += DAY) {
    const dow = new Date(t).getUTCDay(); // 12:00 +07 = 05:00Z cùng ngày ⇒ thứ trong tuần đúng theo VN
    if (dow !== 0 && dow !== 6) n += 1;
  }
  return Math.max(1, n);
}

export interface LoadMember { id: number; username: string; capacityHours: number | null }
export interface LoadIssue { assigneeId: number | null; estimate: number }
export interface MemberLoad {
  username: string;
  /** Tổng ước lượng trong phạm vi — tên trường giữ "points" cho tương thích; đơn vị xem `unit`. */
  points: number;
  issues: number;
  unit: 'points' | 'hours';
  /** Sức chứa trong phạm vi (cùng đơn vị), null = người chưa khai giờ/ngày. */
  capacity: number | null;
  overloaded: boolean;
  /** Vì sao bị coi là quá tải — 'capacity' (vượt sức chứa) | 'relative' (> 1,6× trung bình nhóm). */
  basis: 'capacity' | 'relative';
}

const r1 = (n: number) => Math.round(n * 10) / 10;

export function computeLoads(input: { members: LoadMember[]; issues: LoadIssue[]; mode: 'POINTS' | 'HOURS'; daysLeft: number }): MemberLoad[] {
  const unit = input.mode === 'HOURS' ? 'hours' : 'points';
  const base = input.members.map((m) => {
    const mine = input.issues.filter((i) => i.assigneeId === m.id);
    const points = r1(mine.reduce((s, i) => s + i.estimate, 0));
    const capHours = m.capacityHours != null && m.capacityHours > 0 ? m.capacityHours * input.daysLeft : null;
    const capacity = capHours == null ? null : r1(input.mode === 'HOURS' ? capHours : capHours / WORKLOAD_RULES.DEFAULT_HOURS_PER_POINT);
    return { username: m.username, points, issues: mine.length, unit, capacity } as const;
  });
  const avg = base.length ? base.reduce((s, l) => s + l.points, 0) / base.length : 0;
  return base.map((l) => {
    if (l.capacity != null) return { ...l, overloaded: l.points > l.capacity, basis: 'capacity' as const };
    return { ...l, overloaded: avg > 0 && l.points > avg * 1.6 && l.points - avg >= 3, basis: 'relative' as const };
  });
}

/** Một dòng dữ kiện cho AI — luôn có đơn vị + phạm vi. */
export function overloadFact(loads: MemberLoad[], scopeLabel: string): string {
  const over = loads.filter((l) => l.overloaded);
  if (!over.length) return `Overloaded (${scopeLabel}): none.`;
  return `Overloaded (${scopeLabel}): ${over.map((l) => `@${l.username} ${l.points} ${l.unit} assigned${l.capacity != null ? ` vs capacity ${l.capacity} ${l.unit}` : ' (more than 1.6× the team average)'}`).join(', ')}.`;
}
