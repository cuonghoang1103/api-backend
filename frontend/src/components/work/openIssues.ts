/**
 * MỘT định nghĩa "open issues" cho Projects, Portfolio và widget Dashboard (UX-A P0-2).
 * Bản gốc + lý do: src/services/work/openIssues.ts — sửa thì sửa cả hai.
 */

export const OPEN_ISSUES_DEFINITION =
  'Open issues = every issue that is not Done yet, excluding sub-tasks (epics, stories, tasks, bugs, requirements and tests all count).';

/** JQL tương đương — widget "Open issues" mặc định. */
export const OPEN_ISSUES_JQL = 'statusCategory != Done AND type != "Sub-task"';

/** Chú thích cho một widget đếm theo JQL: định nghĩa chuẩn, hoặc nói rõ nó khác chỗ nào. */
export function counterHint(jql: string): string {
  const q = jql.trim();
  if (q === OPEN_ISSUES_JQL) return OPEN_ISSUES_DEFINITION;
  if (q === 'statusCategory != Done') return `${q} — counts sub-tasks too, so it can be higher than "open" on Projects and Portfolio. ${OPEN_ISSUES_DEFINITION}`;
  return q || 'All issues';
}
