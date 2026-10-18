/**
 * MẪU KẾT QUẢ CT WORK cho test (đợt 5) — dựng ĐÚNG hình máy chủ trả (`src/mcp/tools/read.ts`,
 * `toolRegistry/planning.ts`, `src/mcp/issueView.ts`): chữ máy sinh ở ngoài, dữ liệu người viết trong
 * `<ctwork-content … untrusted="true">`. Không ai trong app import file này — chỉ test (desktop vitest,
 * CLI tsx + máy chủ giả của PTY).
 */

const boc = (nguon: string, than: string): string => `<ctwork-content source="${nguon}" untrusted="true">\n${than}\n</ctwork-content>`;
const json = (v: unknown): string => JSON.stringify(v, null, 2);

/** Ngày `n` hôm nữa (giờ máy) dạng ISO — để "còn N ngày" không phụ thuộc hôm chạy test. */
export function ngaySau(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00.000Z`;
}

export const MAU_LIST_PROJECTS = `1 project(s). Names are user data.\n${boc('project list', json([
  { key: 'LF', name: 'LabFlow AI', kind: 'SOFTWARE', myRole: 'ADMIN', archived: false, openIssues: 42, modules: ['sprints'], workspace: 'labflow-studio', id: 2, workspaceId: 3, workspaceName: 'LabFlow Studio' },
]))}`;

export function mauSprintCurrent(conNgay = 5): string {
  return `Active sprint "Sprint 2" (5 issues). Numbers are computed by CT Work.\n${boc('current sprint', json({
    sprint: { name: 'Sprint 2', goal: 'Đăng nhập + ERD v1', startAt: ngaySau(-9), endAt: ngaySau(conNgay) },
    pace: { remaining: 12, daysLeft: conNgay },
    issues: [
      { key: 'LF-12', title: 'Cài Spring Boot 4.1 + Flyway', type: 'TASK', status: 'Done', category: 'DONE', assignee: 'cuong', points: 2, blocked: false },
      { key: 'LF-18', title: 'Thiết kế ERD v1 (Lab, Booking, User)', type: 'TASK', status: 'In Progress', category: 'IN_PROGRESS', assignee: 'cuong', points: 3, blocked: false },
      { key: 'LF-19', title: 'API đăng nhập JWT', type: 'STORY', status: 'To Do', category: 'TODO', assignee: 'cuong', points: 5, blocked: false },
      { key: 'LF-20', title: 'Trang đăng nhập React', type: 'STORY', status: 'To Do', category: 'TODO', assignee: null, points: 3, blocked: true },
      { key: 'LF-21', title: 'Viết test đăng nhập', type: 'TASK', status: 'Review', category: 'IN_PROGRESS', assignee: '🤖 cuongmini', points: 1, blocked: false },
    ],
    planned: [{ name: 'Sprint 3', startAt: ngaySau(6), endAt: ngaySau(20) }],
  }))}`;
}

export const MAU_SPRINT_FOCUS = `No sprint is running. Focus = planned sprint "Sprint 1"; 2 issue(s).\n${boc('planned sprint', json({
  active: null,
  focus: { name: 'Sprint 1', goal: null, startAt: ngaySau(-1), endAt: ngaySau(13), denNgayChuaBatDau: true, issueCount: 2, issues: [
    { key: 'LF-1', title: 'Setup repo', status: 'To Do', assignee: 'cuong' }, { key: 'LF-2', title: 'README', status: 'To Do', assignee: null },
  ] },
  planned: [],
}))}`;

export const MAU_MY_WORK = `Counts: {"total":3,"inProgress":1,"overdue":1,"leased":0}. Titles are user data.\n${boc('my work', json([
  { key: 'LF-19', title: 'API đăng nhập JWT', type: 'STORY', status: 'To Do', statusCategory: 'TODO', priority: 2, points: 5, dueDate: ngaySau(4).slice(0, 10), overdue: false, blocked: false },
  { key: 'LF-18', title: 'Thiết kế ERD v1 (Lab, Booking, User)', type: 'TASK', status: 'In Progress', statusCategory: 'IN_PROGRESS', priority: 3, points: 3, dueDate: ngaySau(1).slice(0, 10), overdue: false, blocked: false },
  { key: 'LF-9', title: 'Daily log tuần 1', type: 'TASK', status: 'To Do', statusCategory: 'TODO', priority: 3, points: null, dueDate: ngaySau(-2).slice(0, 10), overdue: true, blocked: false },
  { key: 'LF-30', title: 'Ghi chú họp GV', type: 'TASK', status: 'To Do', statusCategory: 'TODO', priority: 4, points: null, dueDate: null, overdue: false, blocked: false },
]))}`;

export function mauGetIssue(key = 'LF-18'): string {
  const n = Number(key.split('-')[1]);
  const meta = [
    `Issue ${key} in project LF ("LabFlow AI" — name is user data) · version 7`,
    'Type: Task (TASK) · Status: In Progress [IN_PROGRESS] · Priority: Medium',
    'Assignee: @cuong "Cường" · Reporter: @cuong "Cường"',
    `Story points: 3 · Due: ${ngaySau(1).slice(0, 10)} · Time spent: 90 min · Remaining: — min`,
    'Allowed transitions from here: To Do [TODO], Review [IN_PROGRESS], Done [DONE]',
  ].join('\n');
  const than = [
    `## Title\n${n === 18 ? 'Thiết kế ERD v1 (Lab, Booking, User)' : `Thẻ số ${n}`}`,
    '## Description\n### Cần học trước\n- Thực thể, quan hệ 1-n, n-n\n\n### Các bước gợi ý\n1. Liệt kê thực thể từ use case\n2. Vẽ ERD bằng dbdiagram\n\n### Tự kiểm tra (Acceptance criteria)\n- [x] Có đủ 3 thực thể Lab, Booking, User\n- [ ] Khoá ngoại Booking → Lab, Booking → User đúng chiều\n- [ ] Giải thích được vì sao Booking tách bảng ≤ 40 giây\n\nGhi chú thêm: ERD đặt ở docs/erd.png.',
    '## Comments (2)',
    '### comment #101 · @cuong "Cường" · 2026-10-16T09:00:00.000Z · INTERNAL\nBắt đầu vẽ bản nháp.',
    '### comment #102 · @gv "Thầy Nam" · 2026-10-17T14:30:00.000Z · INTERNAL\nNhớ thêm bảng LabSlot để tránh đặt trùng giờ.',
  ].join('\n\n');
  return `${meta}\n\n${boc(`issue ${key}`, than)}\n\nDefinition of Done of project LF:\n${boc('project LF definition of done', '- Có test\n- Có bằng chứng')}`;
}

export const MAU_MEETINGS = boc('meetings', json([
  { key: 'M-3', title: 'Họp nhóm tuần 2', type: 'Weekly', status: 'SCHEDULED', startsAt: ngaySau(2), actionItems: 0, withoutIssue: 0 },
  { key: 'M-2', title: 'Gặp GV hướng dẫn', type: 'Mentor', status: 'DONE', startsAt: ngaySau(-3), actionItems: 4, withoutIssue: 2 },
]));

/** Danh sách tool CT Work (tên + readOnlyHint) như `tools/list` của máy chủ — đủ để test xếp ưu tiên/chiDoc. */
export const MAU_TOOLS: Array<{ name: string; ghi: boolean }> = [
  { name: 'whoami', ghi: false }, { name: 'list_projects', ghi: false }, { name: 'my_work', ghi: false }, { name: 'get_issue', ghi: false },
  { name: 'search_issues', ghi: false }, { name: 'list_pages', ghi: false }, { name: 'get_page', ghi: false },
  { name: 'comment', ghi: true }, { name: 'transition', ghi: true }, { name: 'update_issue', ghi: true }, { name: 'create_issue', ghi: true },
  { name: 'log_work', ghi: true }, { name: 'test_list', ghi: false }, { name: 'test_get', ghi: false },
  { name: 'sprint_current', ghi: false }, { name: 'meeting_list', ghi: false }, { name: 'weekly_report_generate', ghi: true },
];
