/**
 * CT Work — MỘT định nghĩa "open issues" cho mọi chỗ hiện con số này (UX-A P0-2, 09/10/2026).
 *
 * Trước đây ba chỗ đếm ba kiểu cho cùng một dự án: thẻ dự án (Projects) đếm MỌI cấp
 * (27), Portfolio chỉ đếm `type.level = 0` (19 — bỏ cả epic lẫn sub-task), widget
 * Dashboard dùng JQL `statusCategory != Done` (27/30). Không chỗ nào ghi định nghĩa.
 *
 * Định nghĩa chốt: **thẻ chưa Done (chưa resolve), chưa xoá, KHÔNG tính sub-task**
 * (`type.level >= 0` ⇒ epic, story, task, bug, requirement, test đều tính).
 * Lý do:
 *   - Sub-task là mảnh của một thẻ cha đã được đếm — tính cả hai là đếm đôi, và một
 *     story chia 6 sub-task làm số "open" nhảy gấp 7 dù khối việc không đổi.
 *   - Epic và test VẪN tính: đó là cách Jira đếm "open issues" (người dùng/giảng viên
 *     quen số này), và với nhóm SWT301 test case là việc thật phải làm xong.
 *   - "Done" = `resolvedAt` khác null — đúng cột mà applyIssueChange đặt khi thẻ vào
 *     trạng thái nhóm DONE, nên không lệch với JQL `statusCategory != Done`.
 *
 * Phía giao diện hiện chú thích bằng `OPEN_ISSUES_DEFINITION` (bản sao ở
 * frontend/src/components/work/openIssues.ts — sửa thì sửa cả hai).
 */

import type { Prisma } from '@prisma/client';

export const OPEN_ISSUES_DEFINITION =
  'Open issues = every issue that is not Done yet, excluding sub-tasks (epics, stories, tasks, bugs, requirements and tests all count).';

/** JQL tương đương — dùng cho widget "Open issues" mặc định và link "View in Issues". */
export const OPEN_ISSUES_JQL = 'statusCategory != Done AND type != "Sub-task"';

/** Điều kiện Prisma cho một thẻ "open". Ghép thêm projectId / clientVisible… ở chỗ gọi. */
export function openIssueWhere(): Prisma.WorkIssueWhereInput {
  return { deletedAt: null, resolvedAt: null, type: { level: { gte: 0 } } };
}

/** Thẻ được tính vào số đếm (bỏ qua trạng thái Done) — dùng cho overdue/done-gần-đây cho cùng phạm vi. */
export function countedIssueWhere(): Prisma.WorkIssueWhereInput {
  return { deletedAt: null, type: { level: { gte: 0 } } };
}

/** Bản thuần (không DB) của cùng luật — để test và để lọc mảng đã tải sẵn. */
export function isOpenIssue(i: { deletedAt?: Date | null; resolvedAt: Date | null; typeLevel: number }): boolean {
  return !i.deletedAt && !i.resolvedAt && i.typeLevel >= 0;
}
