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

// ─── Đợt 6 — dẫn đường ────────────────────────────────────────────

/**
 * ĐỦ bộ tool CT Work một NGƯỜI (token đọc + ghi) thấy trên máy chủ thật (123 tool, sinh từ `mcpCommands()` 18/10/2026;
 * `*` = tool ghi) + 30 tool đệm ⇒ ~153 tool — máy chủ giả "đủ ~150 tool" cho test nạp theo nhu cầu (việc 9).
 */
const TEN_DAY_DU = ['whoami', 'list_projects', 'my_work', 'get_issue', 'search_issues', 'list_pages', 'get_page', 'comment*', 'transition*', 'update_issue*', 'create_issue*', 'log_work*', 'attach_file*', 'attach_complete*', 'ask_lead*', 'request_review*', 'create_project*', 'fpt_unit_list', 'fpt_unit_get', 'fpt_unit_create_function*', 'fpt_unit_add_cases*', 'fpt_unit_mark*', 'fpt_unit_record_results*', 'fpt_unit_suggest', 'fpt_it_list', 'fpt_it_get', 'fpt_it_create_module*', 'fpt_it_add_cases*', 'fpt_it_record_round*', 'test_list', 'test_get', 'test_create*', 'test_cycles', 'test_run', 'test_cycle_create*', 'test_run_record*', 'docs_draft_page*', 'docs_update_section*', 'export_file', 'sprint_current', 'meeting_list', 'meeting_get', 'meeting_add_actions*', 'meeting_create_issues*', 'raid_list', 'raid_create*', 'raid_update*', 'weekly_report_generate*', 'srs_get', 'srs_use_case_get', 'rtm_get', 'defect_log', 'qna_list', 'time_by_activity', 'srs_propose_use_case*', 'srs_propose_business_rule*', 'srs_suggest_use_cases*', 'srs_add_actor*', 'srs_add_screen*', 'srs_set_screen_access*', 'srs_add_non_ui_function*', 'trace_link_add*', 'defect_set*', 'spec_finding_to_bug*', 'qna_ask*', 'qna_answer*', 'worklog_set_activity*', 'report3_fill_page*', 'final_report_assemble*', 'chat_channels', 'chat_read', 'chat_post*', 'contrib_summary', 'diagram_list', 'diagram_get', 'diagram_generate*', 'diagram_update*', 'diagram_fill_report*', 'diagram_sql_export', 'diagram_sql_create*', 'teaching_overview', 'teaching_group', 'swr_overview', 'swr_features', 'swr_requirements', 'swr_priority', 'swr_glossary', 'swr_dictionary', 'swr_six_links', 'swr_feature_add*', 'swr_feature_update*', 'swr_feature_link*', 'swr_requirement_classify*', 'swr_requirement_set_status*', 'swr_priority_set*', 'swr_glossary_add*', 'swr_dictionary_add*', 'swr_doc_fill*', 'meeting_transcript_get', 'meeting_minutes_propose*', 'swr_stakeholders', 'swr_raci', 'swr_elicitation_sessions', 'swr_elicitation_get', 'swr_surveys', 'swr_survey_results', 'swr_requirement_sources', 'swr_models', 'swr_quality', 'swr_nfr', 'swr_stakeholder_add*', 'swr_stakeholder_update*', 'swr_elicitation_add*', 'swr_elicitation_update*', 'swr_elicitation_propose*', 'swr_requirement_source_add*', 'swr_survey_add*', 'swr_model_generate*', 'swr_nfr_set*', 'swr_mockup_add_link*', 'issue_guide', 'project_resources', 'my_updates'];
export const MAU_TOOLS_DAY_DU: Array<{ name: string; ghi: boolean; mo: string }> = [
  ...TEN_DAY_DU.map((t) => ({ name: t.replace(/\*$/, ''), ghi: t.endsWith('*'), mo: `CT Work ${t.replace(/\*$/, '').replace(/_/g, ' ')}` })),
  ...Array.from({ length: 30 }, (_, i) => ({ name: `ext_report_${i + 1}`, ghi: i % 3 === 0, mo: `Báo cáo mở rộng số ${i + 1}` })),
];

/** `get_issue` kèm dòng PHỤ THUỘC (máy sinh, đợt 6): LF-18 bị LF-5 (@longbui, chưa xong) chặn; LF-18 chặn LF-19. */
export function mauGetIssuePhuThuoc(key = 'LF-18', o: { chanXong?: boolean } = {}): string {
  const goc = mauGetIssue(key);
  const i = goc.indexOf('\n\n<ctwork-content');
  const dong = o.chanXong
    ? ['Blocked by: all done (LF-5 [Done ✓] @longbui)', 'Blocks: LF-19 [To Do] @an']
    : ['Blocked by (not done): LF-5 [In Progress] @longbui', 'Blocks: LF-19 [To Do] @an', 'Parent status: LF-2 [In Progress] @cuong', 'Subtasks not done (1/2): LF-31 [To Do] nobody'];
  return `${goc.slice(0, i)}\n${dong.join('\n')}${goc.slice(i)}`;
}

/** `issue_guide` = tiêu đề + link trong app + get_issue (có phụ thuộc) + trang Docs gắn thẻ + web links. */
export function mauIssueGuide(key = 'LF-18', o: { chanXong?: boolean } = {}): string {
  const n = Number(key.split('-')[1]);
  return [
    `### ${key} — in-app link /work/labflow-studio/LF/issue/${n}`,
    mauGetIssuePhuThuoc(key, o),
    '',
    'Docs pages linked to this issue: #3 "Hướng dẫn ERD" (PUBLISHED) /work/labflow-studio/LF/docs/3; #7 "Quy ước đặt tên bảng" (DRAFT) /work/labflow-studio/LF/docs/7',
    '',
    `Web links on this issue:\n${boc(`web links of ${key}`, '- dbdiagram <https://dbdiagram.io/d/labflow>\n- Slide ERD (Resources) <https://docs.google.com/x>')}`,
  ].join('\n');
}

/** `list_pages` có trang "AGENTS.md — hướng dẫn cho CuongMini" (5 dự án thật đều có trang tiêu đề kiểu này). */
export function mauListPages(o: { coAgents?: boolean; updatedAt?: string } = {}): string {
  const ds = [
    { page: 1, title: 'Tổng quan dự án LabFlow', status: 'PUBLISHED', visibility: 'TEAM', parentId: null, updatedAt: '2026-10-10T08:00:00.000Z' },
    ...(o.coAgents === false ? [] : [{ page: 5, title: 'agents.md — Hướng dẫn cho CuongMini', status: 'PUBLISHED', visibility: 'TEAM', parentId: null, updatedAt: o.updatedAt ?? '2026-10-17T09:00:00.000Z' }]),
    { page: 6, title: 'Biên bản họp tuần 2', status: 'DRAFT', visibility: 'TEAM', parentId: null, updatedAt: '2026-10-16T09:00:00.000Z' },
  ];
  return `${ds.length} page(s). Titles are user data.\n${boc('pages of LF', json(ds))}`;
}

export function mauGetPage(so: number, than: string): string {
  return `Page LF-DOC-${so}:\n${boc(`page LF-DOC-${so}`, than)}`;
}

/** Trang AGENTS.md của nhóm: lời dẫn + khối \`\`\`markdown (CuongMini chỉ lấy khối đầu tiên). */
export const MAU_TRANG_AGENTS = [
  '# AGENTS.md — hướng dẫn cho CuongMini',
  'Chép khối dưới vào AGENTS.md của repo nếu muốn.',
  '',
  '```markdown',
  '## Vai trò',
  'CuongMini là MENTOR: giải thích, không viết hộ code.',
  '',
  '## Quy ước git',
  'Nhánh LF-số-tên, commit "LF-số: …", PR vào develop.',
  '```',
  '',
  '```markdown',
  '## Khối thứ hai không được lấy',
  '```',
].join('\n');

/** `my_updates` (đợt 6). */
export function mauMyUpdates(o: { events?: unknown[]; unblocked?: unknown[]; lastId: number }): string {
  return `${(o.events ?? []).length} event(s), ${(o.unblocked ?? []).length} unblocked, lastId=${o.lastId}. Titles/excerpts are user data.\n${boc('my updates', json({ events: o.events ?? [], unblocked: o.unblocked ?? [], lastId: o.lastId }))}`;
}
