/**
 * CT Work — "Ask AI how to use" (trợ lý hướng dẫn trong ứng dụng).
 *
 * KHÁC trợ lý dự án (`ai.service.ts`): trợ lý này KHÔNG đọc dữ liệu dự án và
 * KHÔNG đề xuất thao tác. Nó chỉ trả lời "làm thế nào để dùng CT Work" dựa trên
 * một kho chủ đề có sẵn (`HELP_TOPICS`) và trả về các liên kết sâu tới trang.
 *
 * Nguyên tắc an toàn: **mã sở hữu các liên kết**. Model chỉ được chọn id chủ đề
 * ở dòng cuối (`TOPICS: id1,id2`); mã ánh xạ id → `pages` trong kho này. KHÔNG
 * bao giờ lấy một `path` do model sinh ra.
 *
 * Lời gọi model dùng LẠI đúng cách của `ai.service.ts` (`llmComplete` +
 * `checkTokenQuota`), purpose `work_assistant` — không thêm purpose mới ở
 * gateway.ts.
 */

import { AppError } from '../../middleware/errorHandler.js';
import { checkTokenQuota, isAiAvailable, llmComplete } from '../interview/llm/index.js';

export type HelpLang = 'en' | 'vi';
export interface LText { en: string; vi: string }
export type HelpScope = 'project' | 'workspace' | 'global';
export interface HelpTopicLink { scope: HelpScope; path: string; label: LText }

export interface HelpTopic {
  id: string;
  title: LText;
  summary: LText;
  pages: HelpTopicLink[];
  keywords: string[];
}

const l = (en: string, vi: string): LText => ({ en, vi });
const link = (scope: HelpScope, path: string, en: string, vi: string): HelpTopicLink => ({ scope, path, label: l(en, vi) });

/**
 * Kho chủ đề hướng dẫn CT Work. Mỗi chủ đề có liên kết sâu tới đúng trang; quy
 * ước `scope/path` khớp với `usePageHref` ở frontend (HelpPanel): project =
 * đường trần trong dự án đang mở ('board'…), workspace = đường trần trong không
 * gian ('agents'…), global = đường tuyệt đối ('/work/classes'…).
 */
export const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'getting-started',
    title: l('Get started: workspace, project, sprint', 'Bắt đầu: không gian, dự án, sprint'),
    summary: l(
      'Create a workspace, start a project from a template, invite your team, add issues, then plan and run a sprint.',
      'Tạo không gian làm việc, tạo dự án từ mẫu, mời nhóm, thêm issue, rồi lập kế hoạch và chạy một sprint.',
    ),
    pages: [link('global', '/work?tab=workspaces', 'Workspaces', 'Không gian'), link('project', 'board', 'Board', 'Board')],
    keywords: ['start', 'begin', 'workspace', 'project', 'sprint', 'bat dau', 'tao du an', 'onboarding'],
  },
  {
    id: 'workspaces-members',
    title: l('Workspaces, members & invitations', 'Không gian, thành viên & lời mời'),
    summary: l(
      'Workspaces group projects and people. Invite by email or an invite link, and manage roles.',
      'Không gian gom dự án và người. Mời bằng email hoặc link mời, và quản lý vai trò.',
    ),
    pages: [link('workspace', 'settings?tab=invitations', 'Invitations', 'Lời mời'), link('workspace', 'settings?tab=members', 'Members', 'Thành viên')],
    keywords: ['workspace', 'invite', 'member', 'owner', 'guest', 'moi', 'thanh vien', 'khong gian'],
  },
  {
    id: 'roles-permissions',
    title: l('Roles & permissions', 'Vai trò & quyền hạn'),
    summary: l(
      'Project roles — Admin, Member, Viewer, Teacher, Client — and exactly what each can do.',
      'Vai trò trong dự án — Admin, Member, Viewer, Teacher, Client — và mỗi vai trò làm được gì.',
    ),
    pages: [link('project', 'settings?tab=members', 'Project members', 'Thành viên dự án')],
    keywords: ['role', 'permission', 'admin', 'viewer', 'teacher', 'client', 'quyen', 'vai tro'],
  },
  {
    id: 'board',
    title: l('The board', 'Bảng (Board)'),
    summary: l(
      'Move cards across columns as work progresses: To Do → In Progress → In Review → Done. Filter, swimlanes and quick actions.',
      'Kéo thẻ qua các cột khi việc tiến triển: To Do → In Progress → In Review → Done. Lọc, swimlane và thao tác nhanh.',
    ),
    pages: [link('project', 'board', 'Board', 'Board')],
    keywords: ['board', 'column', 'card', 'drag', 'status', 'bang', 'keo the', 'cot'],
  },
  {
    id: 'backlog-sprints',
    title: l('Backlog & sprints', 'Backlog & sprint'),
    summary: l(
      'Order the backlog, create and start sprints, set a sprint goal, and complete a sprint (Scrum).',
      'Sắp xếp backlog, tạo và bắt đầu sprint, đặt mục tiêu sprint, và kết thúc sprint (Scrum).',
    ),
    pages: [link('project', 'backlog', 'Backlog', 'Backlog')],
    keywords: ['backlog', 'sprint', 'scrum', 'story point', 'velocity', 'plan', 'ke hoach'],
  },
  {
    id: 'issues',
    title: l('Issues: types, fields & sub-tasks', 'Issue: loại, trường & sub-task'),
    summary: l(
      'Create epics, stories, tasks and bugs; estimate, assign, link, attach files, log work and comment.',
      'Tạo epic, story, task và bug; ước lượng, giao việc, liên kết, đính kèm, ghi giờ và bình luận.',
    ),
    pages: [link('project', 'list', 'Issues', 'Danh sách issue')],
    keywords: ['issue', 'epic', 'story', 'task', 'bug', 'subtask', 'field', 'estimate', 'the', 'viec'],
  },
  {
    id: 'jql-filters',
    title: l('Search, JQL & filters', 'Tìm kiếm, JQL & bộ lọc'),
    summary: l(
      'The issue list with quick filters and the JQL query language; save filters and build dashboards.',
      'Danh sách issue với bộ lọc nhanh và ngôn ngữ truy vấn JQL; lưu bộ lọc và dựng dashboard.',
    ),
    pages: [link('project', 'list?mode=jql', 'JQL search', 'Tìm bằng JQL'), link('project', 'dashboards', 'Dashboards', 'Dashboard')],
    keywords: ['search', 'jql', 'filter', 'query', 'dashboard', 'tim kiem', 'loc', 'truy van'],
  },
  {
    id: 'reports',
    title: l('Reports & project health', 'Báo cáo & sức khoẻ dự án'),
    summary: l(
      'Health, burndown, velocity, the sprint report and AI weekly reports for lecturers or clients.',
      'Health, burndown, velocity, báo cáo sprint và báo cáo tuần AI cho giảng viên hoặc khách.',
    ),
    pages: [link('project', 'reports', 'Reports', 'Báo cáo'), link('project', 'reports?tab=weekly', 'Weekly report', 'Báo cáo tuần')],
    keywords: ['report', 'health', 'burndown', 'velocity', 'weekly', 'bao cao', 'suc khoe'],
  },
  {
    id: 'contributions',
    title: l('Contributions (who did what)', 'Đóng góp (ai làm gì)'),
    summary: l(
      'See each member’s real work — issues done, points, comments — and export it as CSV for your lecturer.',
      'Xem công việc thật của từng người — issue hoàn thành, point, bình luận — và xuất CSV cho giảng viên.',
    ),
    pages: [link('project', 'reports?tab=contributions', 'Contributions', 'Đóng góp')],
    keywords: ['contribution', 'who did what', 'csv', 'lecturer', 'dong gop', 'giang vien'],
  },
  {
    id: 'time-capacity',
    title: l('Time tracking & capacity', 'Ghi giờ & năng lực'),
    summary: l(
      'Log work in minutes, see time spent vs estimate, and plan each member’s capacity per sprint.',
      'Ghi giờ theo phút, so thời gian đã dùng với ước lượng, và lập năng lực mỗi người theo sprint.',
    ),
    pages: [link('project', 'reports?tab=time', 'Time report', 'Báo cáo giờ'), link('project', 'reports?tab=capacity', 'Capacity', 'Năng lực')],
    keywords: ['time', 'worklog', 'capacity', 'hours', 'gio', 'ghi gio', 'nang luc'],
  },
  {
    id: 'testing',
    title: l('Testing: cases, cycles & bugs', 'Kiểm thử: case, cycle & bug'),
    summary: l(
      'Write test cases, build a test plan, run cycles with P/F/B/S, raise bugs from failed steps and show traceability.',
      'Viết test case, dựng test plan, chạy cycle bằng P/F/B/S, tạo bug từ bước Fail và chứng minh traceability.',
    ),
    pages: [link('project', 'tests', 'Tests', 'Kiểm thử'), link('project', 'tests?tab=cycles', 'Test cycles', 'Test cycle')],
    keywords: ['test', 'test case', 'cycle', 'defect', 'bug', 'traceability', 'swt301', 'kiem thu'],
  },
  {
    id: 'ai-assistant',
    title: l('AI assistant in a project', 'Trợ lý AI trong dự án'),
    summary: l(
      'Ask AI about your project, draft stories and test cases; it proposes changes you apply with your own permissions.',
      'Hỏi AI về dự án, soạn story và test case; AI đề xuất thay đổi để bạn bấm Apply với quyền của chính mình.',
    ),
    pages: [link('project', 'board', 'Open a project', 'Mở một dự án')],
    keywords: ['ai', 'assistant', 'ask ai', 'chat', 'proposal', 'apply', 'tro ly', 'de xuat'],
  },
  {
    id: 'automation',
    title: l('Automation rules', 'Luật tự động hoá'),
    summary: l(
      'When something happens → if the issue matches → then do something: transitions, assignments, comments, reminders.',
      'Khi có sự kiện → nếu issue khớp → thì làm gì đó: chuyển trạng thái, giao việc, bình luận, nhắc hạn.',
    ),
    pages: [link('project', 'settings?tab=automation', 'Automation', 'Automation')],
    keywords: ['automation', 'rule', 'trigger', 'when', 'if', 'then', 'tu dong', 'luat'],
  },
  {
    id: 'github',
    title: l('GitHub integration', 'Tích hợp GitHub'),
    summary: l(
      'Connect a repo with a webhook so branches, commits and pull requests show on issues and PRs can move issues.',
      'Nối repo bằng webhook để nhánh, commit và pull request hiện trên issue và PR tự chuyển trạng thái.',
    ),
    pages: [link('project', 'settings?tab=github', 'GitHub settings', 'Cài đặt GitHub')],
    keywords: ['github', 'git', 'webhook', 'commit', 'pull request', 'pr', 'tich hop'],
  },
  {
    id: 'gitlab',
    title: l('GitLab integration', 'Tích hợp GitLab'),
    summary: l(
      'Connect a GitLab project with a webhook so pushes and merge requests show on issues and MRs can move issues.',
      'Nối project GitLab bằng webhook để push và merge request hiện trên issue và MR tự chuyển trạng thái.',
    ),
    pages: [link('project', 'settings?tab=github', 'Git settings', 'Cài đặt Git')],
    keywords: ['gitlab', 'git', 'webhook', 'merge request', 'mr', 'push', 'tich hop'],
  },
  {
    id: 'api-tokens',
    title: l('API tokens & REST API', 'API token & REST API'),
    summary: l(
      'Personal ctw_ tokens for scripts, CI and tools; create, scope, revoke and call the REST API.',
      'Token ctw_ cá nhân cho script, CI và công cụ; tạo, giới hạn quyền, thu hồi và gọi REST API.',
    ),
    pages: [link('global', '/work/developer', 'API tokens', 'API token')],
    keywords: ['api', 'token', 'rest', 'bearer', 'ctw_', 'script', 'ci'],
  },
  {
    id: 'import-export',
    title: l('Import & export', 'Nhập & xuất dữ liệu'),
    summary: l(
      'Import issues from CSV or Jira, and export the board, backlog or reports to CSV, Excel or PDF.',
      'Nhập issue từ CSV hoặc Jira, và xuất board, backlog hay báo cáo ra CSV, Excel hoặc PDF.',
    ),
    pages: [link('project', 'settings?tab=import', 'Import', 'Nhập'), link('project', 'settings?tab=export', 'Export', 'Xuất')],
    keywords: ['import', 'export', 'csv', 'excel', 'jira', 'pdf', 'nhap', 'xuat'],
  },
  {
    id: 'public-links',
    title: l('Public read-only links', 'Link công khai chỉ xem'),
    summary: l(
      'Share a read-only board, backlog, reports or tests with a lecturer or client — no account needed.',
      'Chia sẻ board, backlog, báo cáo hoặc test ở chế độ chỉ xem cho giảng viên hay khách — không cần tài khoản.',
    ),
    pages: [link('project', 'settings?tab=share', 'Public links', 'Link công khai')],
    keywords: ['public', 'link', 'share', 'read only', 'lecturer', 'client', 'cong khai', 'chia se'],
  },
  {
    id: 'trash-audit',
    title: l('Trash, archive & audit log', 'Thùng rác, lưu trữ & audit log'),
    summary: l(
      'Restore deleted issues, projects and workspaces, archive finished projects, and see administrative changes.',
      'Khôi phục issue, dự án và không gian đã xoá, lưu trữ dự án đã xong, và xem thay đổi quản trị.',
    ),
    pages: [link('project', 'settings?tab=trash', 'Project trash', 'Thùng rác'), link('workspace', 'settings?tab=audit', 'Audit log', 'Audit log')],
    keywords: ['trash', 'restore', 'archive', 'audit', 'undo', 'thung rac', 'khoi phuc'],
  },
  {
    id: 'docs',
    title: l('Project docs & SRS', 'Tài liệu dự án & SRS'),
    summary: l(
      'Write living documents (SRS, specs, notes) in the project, link them to issues, and draft with AI.',
      'Viết tài liệu sống (SRS, đặc tả, ghi chú) trong dự án, gắn vào issue, và soạn nháp bằng AI.',
    ),
    pages: [link('project', 'docs', 'Docs', 'Tài liệu')],
    keywords: ['docs', 'document', 'srs', 'spec', 'wiki', 'tai lieu', 'dac ta'],
  },
  {
    id: 'client-portal',
    title: l('Client portal & UAT sign-off', 'Cổng khách & nghiệm thu UAT'),
    summary: l(
      'Give a client a safe portal to follow progress, report requests, approve deliverables and sign off UAT.',
      'Cho khách một cổng an toàn để theo tiến độ, gửi yêu cầu, duyệt bàn giao và ký nghiệm thu UAT.',
    ),
    pages: [link('project', 'portal', 'Client portal', 'Cổng khách'), link('project', 'portal?tab=approvals', 'Approvals', 'Phê duyệt')],
    keywords: ['client', 'portal', 'uat', 'signoff', 'customer', 'khach', 'cong khach', 'nghiem thu'],
  },
  {
    id: 'approvals',
    title: l('Approvals & gates', 'Phê duyệt & cổng kiểm'),
    summary: l(
      'Request and record approvals on issues, documents, stages or releases, with a clear decision trail.',
      'Yêu cầu và ghi lại phê duyệt cho issue, tài liệu, giai đoạn hoặc release, có dấu vết quyết định rõ ràng.',
    ),
    pages: [link('project', 'approvals', 'Approvals', 'Phê duyệt')],
    keywords: ['approval', 'gate', 'review', 'sign off', 'phe duyet', 'cong kiem'],
  },
  {
    id: 'meetings',
    title: l('Meetings & agendas', 'Họp & chương trình họp'),
    summary: l(
      'Schedule recurring meetings, use agenda templates, collect RSVPs and turn notes into tasks.',
      'Lên lịch họp định kỳ, dùng mẫu chương trình, thu RSVP và biến ghi chú thành việc.',
    ),
    pages: [link('project', 'meetings', 'Meetings', 'Họp')],
    keywords: ['meeting', 'agenda', 'rsvp', 'minutes', 'hop', 'chuong trinh'],
  },
  {
    id: 'finance',
    title: l('Finance & timesheets', 'Tài chính & bảng công'),
    summary: l(
      'Track budget, rates, billable time and invoices for a client project.',
      'Theo dõi ngân sách, đơn giá, giờ tính phí và hoá đơn cho dự án khách.',
    ),
    pages: [link('project', 'finance', 'Finance', 'Tài chính')],
    keywords: ['finance', 'budget', 'invoice', 'timesheet', 'billable', 'tai chinh', 'bang cong'],
  },
  {
    id: 'raid',
    title: l('RAID log (risks, assumptions, issues, dependencies)', 'Sổ RAID (rủi ro, giả định, vấn đề, phụ thuộc)'),
    summary: l(
      'Track risks, assumptions, issues and dependencies for a project, with owners and status.',
      'Theo dõi rủi ro, giả định, vấn đề và phụ thuộc của dự án, có người chịu trách nhiệm và trạng thái.',
    ),
    pages: [link('project', 'raid', 'RAID log', 'Sổ RAID')],
    keywords: ['raid', 'risk', 'assumption', 'dependency', 'rui ro', 'phu thuoc'],
  },
  {
    id: 'releases',
    title: l('Releases & versions', 'Release & phiên bản'),
    summary: l(
      'Group issues into versions, track release progress and generate release notes.',
      'Gom issue theo phiên bản, theo dõi tiến độ release và sinh release notes.',
    ),
    pages: [link('project', 'releases', 'Releases', 'Release')],
    keywords: ['release', 'version', 'fix version', 'release notes', 'phien ban'],
  },
  {
    id: 'studio-teams-stages',
    title: l('Studio: teams, stages, handoffs', 'Studio: bộ phận, giai đoạn, bàn giao'),
    summary: l(
      'Organise a studio project into teams and delivery stages with gates, approvals and handoffs between teams.',
      'Tổ chức dự án studio thành bộ phận và giai đoạn bàn giao, có cổng kiểm, phê duyệt và bàn giao giữa các bộ phận.',
    ),
    pages: [link('workspace', 'teams', 'Teams', 'Bộ phận'), link('project', 'stages', 'Stages', 'Giai đoạn')],
    keywords: ['studio', 'team', 'stage', 'gate', 'handoff', 'bo phan', 'giai doan', 'ban giao'],
  },
  {
    id: 'classroom',
    title: l('Classroom: run a class', 'Lớp học: điều hành một lớp'),
    summary: l(
      'Create a class with a Stream, materials by topic, a calendar with QR attendance, classwork and a gradebook.',
      'Tạo lớp có bảng tin (Stream), tài liệu theo chủ đề, lịch có điểm danh QR, bài tập và sổ điểm.',
    ),
    pages: [link('global', '/work/classes', 'Classes', 'Lớp học')],
    keywords: ['class', 'classroom', 'stream', 'attendance', 'qr', 'lop hoc', 'bang tin', 'diem danh'],
  },
  {
    id: 'classwork-grading',
    title: l('Classwork, assignments & gradebook', 'Bài tập & sổ điểm'),
    summary: l(
      'Set assignments (file/link/text submissions, late penalties, rubrics), grade and return in bulk, and keep a weighted gradebook.',
      'Giao bài tập (nộp tệp/link/văn bản, trừ điểm muộn, rubric), chấm và trả theo lô, và giữ sổ điểm có trọng số.',
    ),
    pages: [link('global', '/work/classes', 'Classes', 'Lớp học')],
    keywords: ['assignment', 'classwork', 'rubric', 'gradebook', 'grade', 'submit', 'bai tap', 'so diem', 'cham bai'],
  },
  {
    id: 'quiz',
    title: l('Quizzes in a class', 'Quiz trong lớp'),
    summary: l(
      'Build auto-graded quizzes with five question types, a question bank with random draw, a server clock and item stats.',
      'Dựng quiz tự chấm với năm loại câu hỏi, ngân hàng câu hỏi rút ngẫu nhiên, đồng hồ phía máy chủ và thống kê câu hỏi.',
    ),
    pages: [link('global', '/work/classes', 'Classes', 'Lớp học')],
    keywords: ['quiz', 'question', 'bank', 'aiken', 'gift', 'auto grade', 'trac nghiem', 'ngan hang cau hoi'],
  },
  {
    id: 'ai-agents',
    title: l('AI agents (teammates)', 'AI agent (thành viên AI)'),
    summary: l(
      'An agent is a non-human teammate with an owner that never logs in; it has guardrails and its "Done" lands in Review.',
      'Agent là thành viên không phải người, có người chịu trách nhiệm, không bao giờ đăng nhập; có rào chắn và "Done" của nó rơi vào cột Review.',
    ),
    pages: [link('workspace', 'agents', 'AI agents', 'AI agent')],
    keywords: ['agent', 'ai agent', 'bot', 'owner', 'guardrail', 'thanh vien ai'],
  },
  {
    id: 'connect-claude-mcp',
    title: l('Connect Claude via MCP', 'Nối Claude qua MCP'),
    summary: l(
      'Issue an agent token and connect Claude Code or Claude Desktop to CT Work over MCP.',
      'Cấp token agent và nối Claude Code hoặc Claude Desktop vào CT Work qua MCP.',
    ),
    pages: [link('workspace', 'agents', 'AI agents', 'AI agent')],
    keywords: ['mcp', 'claude', 'claude code', 'claude desktop', 'token', 'ctw_', 'noi claude'],
  },
  {
    id: 'integrations-cloud',
    title: l('Microsoft 365 & Google Workspace', 'Microsoft 365 & Google Workspace'),
    summary: l(
      'Two-way calendar sync, Teams/Meet links, OneDrive/Drive files on cards, and export to Excel/Sheets.',
      'Đồng bộ lịch hai chiều, link Teams/Meet, tệp OneDrive/Drive trên thẻ, và xuất ra Excel/Sheets.',
    ),
    pages: [link('global', '/work/connections', 'My connections', 'Kết nối của tôi'), link('project', 'settings?tab=cloud', 'Export to Excel/Sheets', 'Xuất Excel/Sheets')],
    keywords: ['microsoft', 'office 365', 'outlook', 'teams', 'google', 'calendar', 'onedrive', 'drive', 'tich hop'],
  },
  {
    id: 'integrations-notion-slack',
    title: l('Notion & Slack', 'Notion & Slack'),
    summary: l(
      'Import/export Notion pages and turn databases into cards; get Slack notifications, use /ctwork and link unfurls.',
      'Nhập/xuất trang Notion và biến database thành thẻ; nhận thông báo Slack, dùng /ctwork và mở rộng link.',
    ),
    pages: [link('project', 'connect', 'Notion & Slack', 'Notion & Slack'), link('global', '/work/connections', 'My connections', 'Kết nối của tôi')],
    keywords: ['notion', 'slack', 'notification', 'ctwork', 'unfurl', 'tich hop'],
  },
  {
    id: 'okr',
    title: l('OKRs (objectives & key results)', 'OKR (mục tiêu & kết quả then chốt)'),
    summary: l(
      'Set objectives and measurable key results, link work to them and track progress as it rolls up.',
      'Đặt mục tiêu và kết quả then chốt đo được, gắn công việc vào, và theo dõi tiến độ khi nó cộng dồn.',
    ),
    pages: [link('project', 'okrs', 'OKRs', 'OKR'), link('workspace', 'okrs', 'Workspace OKRs', 'OKR không gian')],
    keywords: ['okr', 'objective', 'key result', 'goal', 'muc tieu', 'ket qua then chot'],
  },
  {
    id: 'planning-poker',
    title: l('Planning Poker (estimation)', 'Planning Poker (ước lượng)'),
    summary: l(
      'Estimate backlog items as a team: everyone picks a card, reveal together, then apply the agreed story points.',
      'Ước lượng backlog cả nhóm: mỗi người chọn một lá bài, lật cùng lúc, rồi áp story point đã thống nhất.',
    ),
    pages: [link('project', 'poker', 'Planning poker', 'Planning poker')],
    keywords: ['poker', 'planning poker', 'estimate', 'story point', 'uoc luong', 'danh bai'],
  },
  {
    id: 'retro',
    title: l('Sprint retrospective', 'Retro cuối sprint'),
    summary: l(
      'Run a retro with sticky notes and voting, then turn action items into issues for the next sprint.',
      'Chạy retro bằng sticky note và bỏ phiếu, rồi biến action item thành issue cho sprint sau.',
    ),
    pages: [link('project', 'retros', 'Retros', 'Retro')],
    keywords: ['retro', 'retrospective', 'sticky', 'action item', 'retro', 'hop rut kinh nghiem'],
  },
  {
    id: 'notifications',
    title: l('Notifications & shortcuts', 'Thông báo & phím tắt'),
    summary: l(
      'Control what you are notified about, and use the command palette and keyboard shortcuts to move fast.',
      'Chọn được báo về việc gì, và dùng bảng lệnh cùng phím tắt để thao tác nhanh.',
    ),
    pages: [link('global', '/notifications', 'Notifications', 'Thông báo')],
    keywords: ['notification', 'shortcut', 'command palette', 'keyboard', 'thong bao', 'phim tat'],
  },
];

export const HELP_TOPIC_BY_ID: Record<string, HelpTopic> = Object.fromEntries(HELP_TOPICS.map((t) => [t.id, t]));

// ─── Phân tích đầu ra của model (THUẦN, kiểm được, không mạng) ────────

const TOPICS_LINE = /^\s*TOPICS\s*:\s*(.*)$/im;

/**
 * Tách câu trả lời khỏi dòng `TOPICS: id1,id2` ở cuối. Trả về câu trả lời đã
 * bỏ dòng đó + danh sách id chủ đề HỢP LỆ (có trong kho), tối đa 3, không trùng.
 * Model có thể bịa id — mã lọc lại ở đây nên id lạ bị bỏ.
 */
export function parseTopics(text: string): { answer: string; ids: string[] } {
  const m = text.match(TOPICS_LINE);
  const answer = (m ? text.replace(m[0], '') : text).trim();
  const ids: string[] = [];
  if (m) {
    for (const raw of m[1].split(/[\s,]+/)) {
      const id = raw.trim();
      if (id && HELP_TOPIC_BY_ID[id] && !ids.includes(id)) ids.push(id);
      if (ids.length >= 3) break;
    }
  }
  return { answer, ids };
}

/** Thu các liên kết của các chủ đề (mã sở hữu liên kết), bỏ trùng theo scope+path. */
export function linksForTopics(ids: string[]): HelpTopicLink[] {
  const out: HelpTopicLink[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    const t = HELP_TOPIC_BY_ID[id];
    if (!t) continue;
    for (const pg of t.pages) {
      const k = `${pg.scope}|${pg.path}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(pg);
    }
  }
  return out;
}

// ─── Lời gọi model ───────────────────────────────────────────────────

function buildSystem(lang: HelpLang): string {
  const topics = HELP_TOPICS
    .map((t) => {
      const pages = t.pages.map((p) => `${p.scope}:${p.path}`).join(' ');
      return `- ${t.id} · ${t.title.en} / ${t.title.vi} · ${t.summary.en} · pages: ${pages}`;
    })
    .join('\n');
  const langLine = lang === 'vi'
    ? 'Answer in Vietnamese.'
    : 'Answer in English.';
  return [
    'You are the CT Work in-app help assistant. CT Work is a Jira-style project tool (workspaces, projects, issues, boards, sprints, reports, testing, a client portal, classrooms, AI agents and integrations).',
    'Answer ONLY about how to use CT Work, concisely and practically. If a question is not about using CT Work, say you can only help with CT Work and suggest the closest topic.',
    'Do NOT invent features, menus or URLs that are not supported by the help topics below. Do NOT output links yourself — the app adds the right links from the topic ids you pick.',
    langLine,
    '',
    'Help topics (id · title · summary · pages):',
    topics,
    '',
    'After your answer, output a final line exactly like `TOPICS: id1,id2` listing the 1–3 most relevant topic ids from the list above (ids only, comma-separated). If none fit, output `TOPICS:`.',
  ].join('\n');
}

export interface AskHelpResult {
  answer: string;
  links: HelpTopicLink[];
}

/**
 * Trả lời "làm thế nào để dùng CT Work". Áp đúng lưới hạn mức như `ai.service`
 * (token/ngày), gọi model qua `llmComplete` (purpose `work_assistant`), rồi ánh
 * xạ id chủ đề model chọn → liên kết TRONG MÃ. Giá khiêm tốn: prompt nhỏ,
 * `maxTokens` thấp.
 */
export async function askHelp(
  userId: number,
  input: { q: string; lang: HelpLang; page?: string },
): Promise<AskHelpResult> {
  if (!isAiAvailable('work')) {
    throw new AppError('The help assistant is temporarily unavailable. Please try again later.', 503, 'WORK_HELP_UNAVAILABLE');
  }
  if (!(await checkTokenQuota(userId))) {
    throw new AppError('You have reached today’s AI usage limit.', 429, 'WORK_AI_TOKEN_CAP');
  }

  const q = input.q.trim().slice(0, 500);
  const pageHint = input.page ? `\n\n(The user is currently on the page: ${input.page.slice(0, 200)})` : '';
  const user = `${q}${pageHint}`;

  const r = await llmComplete({
    step: 'report',
    system: buildSystem(input.lang),
    messages: [{ role: 'user', content: user }],
    maxTokens: 700,
    userId,
    feature: 'work',
    purpose: 'work_assistant',
    timeoutMs: 60_000,
    maxRetries: 2,
  });

  const { answer, ids } = parseTopics(r.text ?? '');
  return { answer, links: linksForTopics(ids) };
}
