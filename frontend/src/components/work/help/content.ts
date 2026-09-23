/**
 * CT Work — nội dung Trung tâm trợ giúp (song ngữ Anh / Việt).
 *
 * Dữ liệu có cấu trúc, KHÔNG phải markdown: mỗi bài có id, nhóm, tiêu đề hai
 * thứ tiếng, từ khoá tìm kiếm, danh sách khối (đoạn, bước, mẹo, cảnh báo,
 * bảng, phím tắt, mã) và bài liên quan. Mọi nhãn nút ghi ĐÚNG như trên giao
 * diện (tiếng Anh) để người đọc tìm được nút — đọc từ mã thật ngày 23/09/2026
 * (permissions.ts, jql.ts, automation.service.ts, exchange.service.ts,
 * github.service.ts, share.service.ts, apiTokens.service.ts, templates.ts…).
 * Đổi hành vi ở mã thì sửa bài tương ứng ở đây.
 *
 * Định dạng trong chuỗi: **đậm** · {{mã}} · [[phím]].
 * Tiếng Anh dùng dấu ’ thay cho ' để chuỗi bọc nháy đơn không phải thoát.
 */

export type HelpLang = 'en' | 'vi';
export type LText = { en: string; vi: string };
type Pair = [string, string];

export type HelpBlock =
  | { t: 'p'; text: LText }
  | { t: 'h'; text: LText }
  | { t: 'steps'; items: LText[] }
  | { t: 'list'; items: LText[] }
  | { t: 'tip'; text: LText }
  | { t: 'warn'; text: LText }
  | { t: 'table'; head: LText[]; rows: LText[][] }
  | { t: 'kbd'; items: Array<{ keys: string[]; label: LText }> }
  | { t: 'code'; text: string };

/** Nút "Open this page": project = trong dự án đang mở, workspace = trong không gian đang mở, global = đường tuyệt đối. */
export interface HelpPageLink { scope: 'project' | 'workspace' | 'global'; path: string; label: LText }

export type HelpCategory = 'start' | 'people' | 'plan' | 'track' | 'quality' | 'ai' | 'connect' | 'reference';

export interface HelpArticle {
  id: string;
  category: HelpCategory;
  title: LText;
  summary: LText;
  keywords: string[];
  blocks: HelpBlock[];
  related: string[];
  pages?: HelpPageLink[];
}

export const HELP_CATEGORIES: Array<{ id: HelpCategory; label: LText }> = [
  { id: 'start', label: { en: 'Getting started', vi: 'Bắt đầu' } },
  { id: 'people', label: { en: 'Workspaces & people', vi: 'Không gian & thành viên' } },
  { id: 'plan', label: { en: 'Planning work', vi: 'Lập kế hoạch' } },
  { id: 'track', label: { en: 'Tracking & reports', vi: 'Theo dõi & báo cáo' } },
  { id: 'quality', label: { en: 'Testing', vi: 'Kiểm thử' } },
  { id: 'ai', label: { en: 'AI & automation', vi: 'AI & tự động hoá' } },
  { id: 'connect', label: { en: 'Integrations & data', vi: 'Tích hợp & dữ liệu' } },
  { id: 'reference', label: { en: 'Reference & help', vi: 'Tra cứu & hỏi đáp' } },
];

// ─── Hàm dựng khối (cho gọn) ─────────────────────────────────────

const L = ([en, vi]: Pair): LText => ({ en, vi });
const p = (en: string, vi: string): HelpBlock => ({ t: 'p', text: { en, vi } });
const h = (en: string, vi: string): HelpBlock => ({ t: 'h', text: { en, vi } });
const tip = (en: string, vi: string): HelpBlock => ({ t: 'tip', text: { en, vi } });
const warn = (en: string, vi: string): HelpBlock => ({ t: 'warn', text: { en, vi } });
const steps = (...items: Pair[]): HelpBlock => ({ t: 'steps', items: items.map(L) });
const list = (...items: Pair[]): HelpBlock => ({ t: 'list', items: items.map(L) });
const code = (text: string): HelpBlock => ({ t: 'code', text });
/** Ô bảng: chuỗi đơn = giống nhau ở hai thứ tiếng; cặp = [en, vi]. */
type Cell = string | Pair;
const cell = (c: Cell): LText => (typeof c === 'string' ? { en: c, vi: c } : L(c));
const table = (head: Cell[], rows: Cell[][]): HelpBlock => ({ t: 'table', head: head.map(cell), rows: rows.map((r) => r.map(cell)) });
const kbd = (...items: Array<[string[], string, string]>): HelpBlock => ({ t: 'kbd', items: items.map(([keys, en, vi]) => ({ keys, label: { en, vi } })) });
const page = (scope: HelpPageLink['scope'], path: string, en: string, vi: string): HelpPageLink => ({ scope, path, label: { en, vi } });

const YES = '✓';
const NO = '—';

// ─── Bài viết ────────────────────────────────────────────────────

export const HELP_ARTICLES: HelpArticle[] = [
  // ═══ BẮT ĐẦU ═══
  {
    id: 'getting-started',
    category: 'start',
    title: { en: 'Quick start: your first project in 5 minutes', vi: 'Bắt đầu nhanh: dự án đầu tiên trong 5 phút' },
    summary: {
      en: 'Create a workspace, start a project from a template, invite your team, add issues, then plan and run a sprint.',
      vi: 'Tạo không gian làm việc, tạo dự án từ mẫu, mời nhóm, tạo việc (issue), rồi lập kế hoạch và chạy một sprint.',
    },
    keywords: ['start', 'tour', 'begin', 'onboarding', 'first', 'bat dau', 'huong dan', 'lam quen', 'workspace', 'project', 'sprint'],
    pages: [page('global', '/work?tab=workspaces', 'Workspaces', 'Danh sách không gian')],
    blocks: [
      p(
        'CT Work is a project tool in the style of Jira: a **workspace** holds your team, each **project** holds **issues** (tasks, stories, bugs…), and you move issues across a **board** as work progresses. Scrum projects plan work in **sprints**.',
        'CT Work là công cụ quản lý dự án giống Jira: **không gian làm việc (workspace)** chứa nhóm của bạn, mỗi **dự án (project)** chứa các **issue** (việc, user story, bug…), và bạn kéo issue qua các cột trên **board** khi công việc tiến triển. Dự án Scrum chia việc theo từng **sprint** (thường 1–2 tuần).',
      ),
      h('1. Create a workspace', '1. Tạo không gian làm việc'),
      steps(
        ['Open **CT Work** (/work) and click **"New workspace"** (or **"Create a workspace"** on the welcome screen).', 'Mở **CT Work** (/work) và bấm **"New workspace"** (hoặc **"Create a workspace"** ở màn hình chào).'],
        ['Type a **Name**, e.g. "SE1801 Group 3", and an optional description. You become the **Owner**.', 'Nhập **Name**, ví dụ "SE1801 Group 3", mô tả thì tuỳ. Bạn sẽ là **Owner** (chủ) của không gian.'],
      ),
      h('2. Create a project from a template', '2. Tạo dự án từ mẫu'),
      steps(
        ['Inside the workspace click **"Create project"**.', 'Trong không gian, bấm **"Create project"**.'],
        ['Pick a **Template** — e.g. **"Software project (SWP391)"** for a Scrum team project. See the Templates article for what each one sets up.', 'Chọn **Template** — ví dụ **"Software project (SWP391)"** cho đồ án nhóm theo Scrum. Xem bài "Mẫu dự án" để biết mỗi mẫu tạo sẵn gì.'],
        ['Enter a **Name**. The **Key** is filled in for you (2–10 letters or digits, starting with a letter). It becomes the prefix of every issue: {{SWP-12}}. The key cannot be changed later.', 'Nhập **Name**. **Key** tự điền (2–10 chữ cái hoặc số, bắt đầu bằng chữ). Key là tiền tố của mọi issue: {{SWP-12}}. Key **không đổi được** về sau, nên chọn cẩn thận.'],
        ['Choose **Type**: **Scrum** (backlog + sprints) or **Kanban** (continuous flow, no sprints). Choose **Access**: **"Everyone in the workspace"** or **"Only invited members"**.', 'Chọn **Type**: **Scrum** (có backlog + sprint) hoặc **Kanban** (làm liên tục, không có sprint). Chọn **Access**: **"Everyone in the workspace"** (mọi người trong không gian thấy) hoặc **"Only invited members"** (chỉ người được thêm).'],
        ['Click **"Create project"**. You land on the project’s Board.', 'Bấm **"Create project"**. Bạn được đưa tới Board của dự án.'],
      ),
      h('3. Invite your team', '3. Mời nhóm'),
      steps(
        ['In the sidebar open **"Members & settings"** → tab **"Invitations"**.', 'Ở sidebar mở **"Members & settings"** → tab **"Invitations"**.'],
        ['Either type emails under **"Invite by email"**, or create an **"Invite link"** and paste it in your team chat.', 'Hoặc nhập email ở **"Invite by email"**, hoặc tạo **"Invite link"** rồi dán vào nhóm chat.'],
      ),
      h('4. Create issues', '4. Tạo issue'),
      steps(
        ['On the Board or Backlog click **"Create"** or press [[C]].', 'Ở Board hoặc Backlog bấm **"Create"** hoặc nhấn phím [[C]].'],
        ['Start with a few **Epics** (big features, e.g. "User accounts"), then **Stories** inside them ("As a user, I want to log in…"), and **Sub-tasks** for the small steps.', 'Bắt đầu bằng vài **Epic** (tính năng lớn, vd "Tài khoản người dùng"), rồi các **Story** bên trong ("Là người dùng, tôi muốn đăng nhập…"), và **Sub-task** cho các bước nhỏ.'],
        ['Give each story an estimate (story points) — sprint planning uses it.', 'Ước lượng mỗi story (story point) — lập kế hoạch sprint dựa vào con số này.'],
      ),
      h('5. Plan a sprint (Scrum)', '5. Lập kế hoạch sprint (Scrum)'),
      steps(
        ['Open **Backlog** and click **"Create sprint"**.', 'Mở **Backlog** và bấm **"Create sprint"**.'],
        ['Drag issues from the backlog into the sprint (or use **"Plan with AI"**).', 'Kéo issue từ backlog vào sprint (hoặc dùng **"Plan with AI"**).'],
        ['Click **"Start sprint"**, choose the **Duration** and write a one-sentence **Sprint goal**.', 'Bấm **"Start sprint"**, chọn **Duration** (thời lượng) và viết **Sprint goal** (mục tiêu) một câu.'],
      ),
      h('6. Run the sprint', '6. Chạy sprint'),
      steps(
        ['Everyone drags their cards across the **Board**: To Do → In Progress → In Review → Done.', 'Mọi người kéo thẻ của mình trên **Board**: To Do → In Progress → In Review → Done.'],
        ['Check **Reports → Health** every day for overdue or stuck work.', 'Mỗi ngày xem **Reports → Health** để thấy việc quá hạn hoặc bị kẹt.'],
        ['At the end click **"Complete sprint"**, move unfinished issues to the next sprint, and look at **Reports → Sprint report**.', 'Cuối sprint bấm **"Complete sprint"**, dời việc chưa xong sang sprint sau, rồi xem **Reports → Sprint report**.'],
      ),
      tip(
        'Press [[?]] anywhere in CT Work to open this guide, and [[⌘]] [[K]] (Ctrl + K on Windows) to jump to any project, issue or action.',
        'Nhấn [[?]] ở bất cứ đâu trong CT Work để mở hướng dẫn này, và [[⌘]] [[K]] (Ctrl + K trên Windows) để nhảy nhanh tới dự án, issue hoặc thao tác bất kỳ.',
      ),
      warn(
        'Only a project **Admin** can create, start and complete sprints. If you lead the team, make sure you are Admin of the project (workspace Owners and Admins are Admin of every project automatically).',
        'Chỉ **Admin** của dự án mới tạo, bắt đầu và kết thúc sprint được. Nếu bạn là trưởng nhóm, hãy đảm bảo mình là Admin dự án (Owner/Admin của không gian tự động là Admin mọi dự án).',
      ),
    ],
    related: ['templates', 'workspaces', 'backlog-sprints', 'student-guide'],
  },

  {
    id: 'student-guide',
    category: 'start',
    title: { en: 'Guide for student team leads (SWP391 · SWT301 · SWR302)', vi: 'Hướng dẫn cho trưởng nhóm sinh viên (SWP391 · SWT301 · SWR302)' },
    summary: {
      en: 'A week-by-week way to run a university team project in CT Work, and exactly what to show your lecturer.',
      vi: 'Cách chạy đồ án nhóm ở trường theo từng tuần bằng CT Work, và chính xác cần đưa gì cho giảng viên xem.',
    },
    keywords: ['student', 'lecturer', 'teacher', 'swp391', 'swt301', 'swr302', 'sinh vien', 'giang vien', 'truong nhom', 'do an', 'fpt', 'bao cao', 'team lead'],
    pages: [
      page('project', 'reports?tab=weekly', 'Weekly report', 'Báo cáo tuần'),
      page('project', 'reports?tab=contributions', 'Contributions', 'Đóng góp thành viên'),
      page('project', 'settings?tab=share', 'Public links', 'Link công khai'),
    ],
    blocks: [
      p(
        'This is a proven routine for a 10-week team project. Adjust the weeks to your course schedule.',
        'Đây là nhịp làm việc gợi ý cho một đồ án nhóm khoảng 10 tuần. Điều chỉnh số tuần theo lịch môn học của bạn.',
      ),
      h('Week 0 — set up (30 minutes)', 'Tuần 0 — thiết lập (30 phút)'),
      steps(
        ['Create a workspace named after your class and group, e.g. "SE1801 – Group 3".', 'Tạo không gian đặt tên theo lớp và nhóm, vd "SE1801 – Group 3".'],
        ['Create the project with the matching template: **"Software project (SWP391)"**, **"Software testing (SWT301)"** or **"Requirements (SWR302)"**.', 'Tạo dự án bằng đúng mẫu: **"Software project (SWP391)"**, **"Software testing (SWT301)"** hoặc **"Requirements (SWR302)"**.'],
        ['Create an **"Invite link"** (Members & settings → Invitations), Workspace role **Member**, and paste it in the group chat.', 'Tạo **"Invite link"** (Members & settings → Invitations), Workspace role **Member**, rồi dán vào nhóm chat.'],
        ['Invite your lecturer by email with Workspace role **Guest**, **"Add to project"** = your project, Project role **Teacher**. A teacher can view everything and comment, but cannot change issues.', 'Mời giảng viên qua email với Workspace role **Guest**, **"Add to project"** = dự án của nhóm, Project role **Teacher**. Giảng viên xem được mọi thứ và bình luận, nhưng không sửa được issue.'],
        ['Add **Labels** (frontend, backend, database…) and **Components** (modules or screens) in Project settings.', 'Thêm **Labels** (frontend, backend, database…) và **Components** (module hoặc màn hình) trong Project settings.'],
      ),
      h('Week 1 — build the product backlog', 'Tuần 1 — xây product backlog'),
      list(
        ['One **Epic** per feature group (Authentication, Booking, Payment, Admin…).', 'Mỗi nhóm chức năng một **Epic** (Authentication, Booking, Payment, Admin…).'],
        ['**Stories** in the form "As a …, I want …, so that …". **"Draft with AI"** in the create dialog writes the story and acceptance criteria from one sentence.', '**Story** theo mẫu "As a …, I want …, so that …". Nút **"Draft with AI"** trong hộp tạo issue viết story và acceptance criteria từ một câu mô tả.'],
        ['Estimate every story with **Story points** (1, 2, 3, 5, 8). Unestimated stories are skipped by "Plan with AI".', 'Ước lượng mọi story bằng **Story points** (1, 2, 3, 5, 8). Story chưa ước lượng sẽ bị "Plan with AI" bỏ qua.'],
        ['Order the backlog by dragging: most important on top.', 'Sắp xếp backlog bằng cách kéo: việc quan trọng nhất lên đầu.'],
      ),
      h('Every sprint (usually 2 weeks)', 'Mỗi sprint (thường 2 tuần)'),
      steps(
        ['**Planning:** Backlog → **"Create sprint"** → **"Plan with AI"** (proposes issues from your velocity) → **"Start sprint"** with a goal.', '**Lập kế hoạch:** Backlog → **"Create sprint"** → **"Plan with AI"** (đề xuất việc theo tốc độ nhóm) → **"Start sprint"** kèm mục tiêu.'],
        ['**Daily:** each member moves their own cards on the Board and comments with @mentions when blocked. You check **Reports → Health** and press **"Generate brief"** for a stand-up summary.', '**Hằng ngày:** mỗi thành viên tự kéo thẻ của mình trên Board và bình luận @tên khi bị kẹt. Bạn xem **Reports → Health** và bấm **"Generate brief"** để có bản tin họp nhanh.'],
        ['**Weekly:** **Reports → Weekly report**, Audience **Lecturer**, Language **Tiếng Việt** → **"Generate"** → **"Copy"** and send it.', '**Hằng tuần:** **Reports → Weekly report**, Audience **Lecturer**, Language **Tiếng Việt** → **"Generate"** → **"Copy"** rồi gửi.'],
        ['**Review & retro:** **"Complete sprint"**, then **Reports → Sprint report** → **"Generate retro"** (paste the team’s sticky notes first). Apply the proposed action items as issues.', '**Review & retro:** **"Complete sprint"**, rồi **Reports → Sprint report** → **"Generate retro"** (dán ý kiến của nhóm vào trước). Áp dụng các action item đề xuất thành issue.'],
      ),
      h('Course-specific tips', 'Mẹo theo từng môn'),
      table(
        [['Course', 'Môn'], ['What to use', 'Nên dùng gì']],
        [
          ['SWP391', [
            'Scrum board, sprints, burndown, velocity, the Bug lifecycle (Open → In Progress → Fixed → Retest → Closed), GitHub integration so commits show on issues.',
            'Board Scrum, sprint, burndown, velocity, vòng đời Bug (Open → In Progress → Fixed → Retest → Closed), tích hợp GitHub để commit hiện trên issue.',
          ]],
          ['SWT301', [
            'Tests tab: test cases → test plan → one test cycle per test round → run steps with P/F/B/S → **"Create bug"** from failed steps → Retest → **Traceability** → **"Export cycle report"** (Excel).',
            'Tab Tests: test case → test plan → mỗi vòng test một test cycle → chạy từng bước bằng P/F/B/S → **"Create bug"** từ bước Fail → Retest → **Traceability** → **"Export cycle report"** (Excel).',
          ]],
          ['SWR302', [
            'Requirement issues with acceptance criteria, **"Review story quality"** (INVEST check), a custom field "MoSCoW", and Traceability to show which requirements are covered by tests.',
            'Issue loại Requirement có acceptance criteria, **"Review story quality"** (chấm theo INVEST), trường tuỳ chỉnh "MoSCoW", và Traceability để chứng minh yêu cầu nào đã có test.',
          ]],
        ],
      ),
      h('What to show your lecturer', 'Cần đưa gì cho giảng viên xem'),
      table(
        [['Evidence', 'Bằng chứng'], ['Where', 'Ở đâu']],
        [
          [['Live progress without an account', 'Tiến độ trực tiếp, không cần tài khoản'], ['Project settings → **Public links** → **"Create public link"** (Board, Backlog, Reports, Tests)', 'Project settings → **Public links** → **"Create public link"** (Board, Backlog, Reports, Tests)']],
          [['Who did what', 'Ai làm gì'], ['Reports → **Contributions** → **"Export CSV"** or **"Copy as text"**', 'Reports → **Contributions** → **"Export CSV"** hoặc **"Copy as text"**']],
          [['Weekly status', 'Tình hình hằng tuần'], ['Reports → **Weekly report** (Audience: Lecturer)', 'Reports → **Weekly report** (Audience: Lecturer)']],
          [['Scrum process', 'Quy trình Scrum'], ['Reports → **Burndown**, **Velocity**, **Sprint report**', 'Reports → **Burndown**, **Velocity**, **Sprint report**']],
          [['Test results (SWT301)', 'Kết quả kiểm thử (SWT301)'], ['Tests → Test cycles → open a cycle → **"Export cycle report"** → Excel/PDF', 'Tests → Test cycles → mở cycle → **"Export cycle report"** → Excel/PDF']],
        ],
      ),
      warn(
        'Contributions count real work: issues completed, points, sub-tasks, issues created, comments and updates. Changes applied from an AI proposal are recorded as **AI** in the history and are **not** credited to a member — so each person should do their own work.',
        'Báo cáo đóng góp đếm công việc thật: số issue hoàn thành, point, sub-task, issue đã tạo, bình luận và cập nhật. Thay đổi áp dụng từ đề xuất của AI được ghi là **AI** trong lịch sử và **không** tính công cho ai — nên mỗi người phải tự làm phần của mình.',
      ),
      tip(
        'Freelance or company project? Use the **"Client project"** template, invite the customer as **Client** (they can view, comment and report issues), send the Weekly report with Audience **Client**, and use **Releases** with release notes for each delivery.',
        'Làm dự án freelance hoặc ở công ty? Dùng mẫu **"Client project"**, mời khách với vai trò **Client** (xem, bình luận và báo lỗi được), gửi Weekly report với Audience **Client**, và dùng **Releases** kèm release notes cho mỗi lần bàn giao.',
      ),
    ],
    related: ['getting-started', 'roles', 'reports', 'testing', 'public-links'],
  },

  // ═══ KHÔNG GIAN & NGƯỜI ═══
  {
    id: 'workspaces',
    category: 'people',
    title: { en: 'Workspaces, members & invitations', vi: 'Không gian làm việc, thành viên & lời mời' },
    summary: {
      en: 'How workspaces group projects and people, how to invite by email or link, and how to manage members.',
      vi: 'Không gian làm việc gom dự án và người thế nào, cách mời bằng email hoặc link, và cách quản lý thành viên.',
    },
    keywords: ['workspace', 'invite', 'invitation', 'link', 'email', 'member', 'owner', 'guest', 'transfer', 'moi', 'thanh vien', 'khong gian', 'loi moi'],
    pages: [
      page('workspace', 'settings?tab=invitations', 'Invitations', 'Lời mời'),
      page('workspace', 'settings?tab=members', 'Members', 'Thành viên'),
    ],
    blocks: [
      p(
        'A **workspace** is your team, class or company. It holds projects and members. You can belong to several workspaces and switch between them with the switcher at the top of the sidebar.',
        '**Không gian làm việc (workspace)** là nhóm, lớp hoặc công ty của bạn. Nó chứa các dự án và thành viên. Bạn có thể ở nhiều không gian và đổi qua lại bằng nút chọn ở đầu sidebar.',
      ),
      h('Workspace roles', 'Vai trò trong không gian'),
      table(
        [['Role', 'Vai trò'], ['What it means', 'Ý nghĩa']],
        [
          ['Owner', ['Created the workspace. Full control, the only one who can delete the workspace or transfer ownership.', 'Người tạo không gian. Toàn quyền, là người duy nhất xoá được không gian hoặc chuyển quyền chủ.']],
          ['Admin', ['Manages members and every project. Automatically **Admin of every project**.', 'Quản lý thành viên và mọi dự án. Tự động là **Admin của mọi dự án**.']],
          ['Member', ['Works in shared projects (those with Access "Everyone in the workspace") and can create projects.', 'Làm việc trong các dự án chung (Access "Everyone in the workspace") và tạo được dự án.']],
          ['Guest', ['Only sees projects they are added to — for teachers and clients.', 'Chỉ thấy các dự án được thêm vào — dành cho giảng viên và khách hàng.']],
        ],
      ),
      h('Invite by email', 'Mời bằng email'),
      steps(
        ['Open **"Members & settings"** → **"Invitations"** (only Owners and Admins see this tab).', 'Mở **"Members & settings"** → **"Invitations"** (chỉ Owner và Admin thấy tab này).'],
        ['Type one or more **Email addresses**, separated by commas or new lines.', 'Nhập một hoặc nhiều **Email addresses**, cách nhau bằng dấu phẩy hoặc xuống dòng.'],
        ['Choose the **Workspace role**. Optionally pick **"Add to project"** and a **Project role** to put them straight into one project.', 'Chọn **Workspace role**. Có thể chọn thêm **"Add to project"** và **Project role** để đưa họ vào thẳng một dự án.'],
        ['Click **"Send invitation"**. People who already have an account are **added immediately** (status "Added"). Others receive an email with a link that works **once** and expires after **7 days**.', 'Bấm **"Send invitation"**. Ai đã có tài khoản sẽ được **thêm ngay** (trạng thái "Added"). Người chưa có tài khoản nhận email kèm link dùng **một lần**, hết hạn sau **7 ngày**.'],
      ),
      h('Invite link (best for a class or group chat)', 'Link mời (tiện cho lớp hoặc nhóm chat)'),
      list(
        ['Under **"Invite link"** set **Max uses** (1–200, default 30) and **Expires in (days)** (1–30, default 7), then copy the link.', 'Ở **"Invite link"** đặt **Max uses** (1–200, mặc định 30) và **Expires in (days)** (1–30, mặc định 7), rồi sao chép link.'],
        ['Anyone with the link can join until it expires or runs out of uses. The newcomer signs in (or creates a free account) and lands in the workspace.', 'Ai có link đều vào được cho tới khi hết hạn hoặc hết lượt. Người mới đăng nhập (hoặc tạo tài khoản miễn phí) rồi vào thẳng không gian.'],
        ['**"Pending invitations"** lists open invitations and links; click **"Revoke"** to cancel one.', '**"Pending invitations"** liệt kê lời mời và link còn hiệu lực; bấm **"Revoke"** để huỷ.'],
      ),
      h('Manage members', 'Quản lý thành viên'),
      list(
        ['**Members** tab: change someone’s role or **"Remove from workspace"**. Removed people lose access to all projects; their issues stay.', 'Tab **Members**: đổi vai trò hoặc **"Remove from workspace"**. Người bị xoá mất quyền vào mọi dự án; issue họ tạo vẫn giữ nguyên.'],
        ['**"Transfer ownership"** (Owner only): the new owner gets full control and you become an Admin. Guests cannot become owner.', '**"Transfer ownership"** (chỉ Owner): chủ mới có toàn quyền, bạn trở thành Admin. Guest không thể làm chủ.'],
        ['Project-level access is set per project in **Project settings → Members** (see Roles & permissions).', 'Quyền trong từng dự án đặt ở **Project settings → Members** (xem bài Vai trò & quyền).'],
      ),
      table(
        [['Limit', 'Giới hạn'], ['Value', 'Giá trị']],
        [
          [['Workspaces per person', 'Không gian mỗi người'], '30'],
          [['Members per workspace', 'Thành viên mỗi không gian'], '200'],
          [['Projects per workspace', 'Dự án mỗi không gian'], '100'],
        ],
      ),
      tip(
        'Deleted a workspace by mistake? The Owner can bring it back from **/work → Workspaces → "Recently deleted workspaces" → "Restore"** — every project and member returns.',
        'Lỡ xoá không gian? Owner khôi phục được ở **/work → Workspaces → "Recently deleted workspaces" → "Restore"** — mọi dự án và thành viên quay lại.',
      ),
    ],
    related: ['roles', 'getting-started', 'trash-audit'],
  },

  {
    id: 'roles',
    category: 'people',
    title: { en: 'Roles & permissions', vi: 'Vai trò & quyền hạn' },
    summary: {
      en: 'The five project roles — Admin, Member, Viewer, Teacher, Client — and exactly what each one can do.',
      vi: 'Năm vai trò trong dự án — Admin, Member, Viewer, Teacher, Client — và chính xác mỗi vai trò làm được gì.',
    },
    keywords: ['role', 'permission', 'access', 'admin', 'member', 'viewer', 'teacher', 'client', 'private', 'quyen', 'vai tro', 'giang vien', 'khach hang', 'forbidden', '403'],
    pages: [page('project', 'settings?tab=members', 'Project members', 'Thành viên dự án')],
    blocks: [
      p(
        'Every person has one **role in each project**. The server checks this role on every action — hiding a button is never the only protection, and the AI assistant can never do more than the person asking.',
        'Mỗi người có một **vai trò trong từng dự án**. Máy chủ kiểm vai trò này ở mọi thao tác — không chỉ ẩn nút, và trợ lý AI không bao giờ làm được nhiều hơn quyền của người đang hỏi.',
      ),
      table(
        [['Action', 'Thao tác'], 'Admin', 'Member', 'Viewer', 'Teacher', 'Client'],
        [
          [['View board, backlog, reports, tests', 'Xem board, backlog, báo cáo, test'], YES, YES, YES, YES, YES],
          [['Comment', 'Bình luận'], YES, YES, NO, YES, YES],
          [['Create issues', 'Tạo issue'], YES, YES, NO, NO, YES],
          [['Attach files', 'Đính kèm file'], YES, YES, NO, NO, YES],
          [['Edit issues, move cards, log time, run tests', 'Sửa issue, kéo thẻ, ghi giờ, chạy test'], YES, YES, NO, NO, NO],
          [['Delete own issues', 'Xoá issue mình tạo'], YES, YES, NO, NO, NO],
          [['Delete any issue, delete others’ comments, open Trash', 'Xoá issue bất kỳ, xoá bình luận người khác, mở Trash'], YES, NO, NO, NO, NO],
          [['Create/start/complete sprints, rank backlog, manage versions', 'Tạo/bắt đầu/kết thúc sprint, xếp hạng backlog, quản lý version'], YES, NO, NO, NO, NO],
          [['Use the AI assistant', 'Dùng trợ lý AI'], YES, YES, NO, NO, NO],
          [['Project settings, members, workflow, automation, GitHub, public links, import', 'Cài đặt dự án, thành viên, workflow, tự động hoá, GitHub, link công khai, import'], YES, NO, NO, NO, NO],
        ],
      ),
      h('How your project role is decided', 'Vai trò trong dự án được quyết định thế nào'),
      list(
        ['Workspace **Owner** or **Admin** ⇒ always **Admin** in every project.', '**Owner** hoặc **Admin** của không gian ⇒ luôn là **Admin** ở mọi dự án.'],
        ['If a project admin set a role for you in **Project settings → Members** ("Set for this project"), that role is used.', 'Nếu Admin dự án đặt vai trò riêng cho bạn ở **Project settings → Members** ("Set for this project"), dùng vai trò đó.'],
        ['Otherwise a workspace **Member** is a project **Member** in projects with Access **"Everyone in the workspace"** ("Default from workspace").', 'Nếu không, **Member** của không gian là **Member** trong các dự án có Access **"Everyone in the workspace"** ("Default from workspace").'],
        ['A workspace **Guest** sees nothing until added to a project. Projects with **"Only invited members"** are visible only to people added to them (and workspace admins).', '**Guest** không thấy gì cho tới khi được thêm vào dự án. Dự án **"Only invited members"** chỉ người được thêm (và admin không gian) mới thấy.'],
      ),
      steps(
        ['Open **Project settings → Members**.', 'Mở **Project settings → Members**.'],
        ['Use **"Add a workspace member to this project…"** and pick a **Project role**, or change the role next to an existing person.', 'Dùng **"Add a workspace member to this project…"** và chọn **Project role**, hoặc đổi vai trò cạnh người đã có.'],
        ['The reset button (**"Use the role this person gets from the workspace"**) removes a project-specific role.', 'Nút đặt lại (**"Use the role this person gets from the workspace"**) bỏ vai trò riêng của dự án.'],
      ),
      tip(
        'Teacher vs Client: both can view and comment. A **Client** can also create issues (report bugs, send requests) and attach files; a **Teacher** cannot, so every issue in a student project stays the students’ work.',
        'Teacher và Client: cả hai xem và bình luận được. **Client** còn tạo được issue (báo lỗi, gửi yêu cầu) và đính kèm file; **Teacher** thì không, để mọi issue trong đồ án là công của sinh viên.',
      ),
      warn(
        'Only **Admin** manages sprints. In a student team, the team lead (or Scrum Master) should be Admin; other members stay Member.',
        'Chỉ **Admin** quản lý sprint. Trong nhóm sinh viên, trưởng nhóm (hoặc Scrum Master) nên là Admin; các bạn khác để Member.',
      ),
    ],
    related: ['workspaces', 'faq', 'public-links'],
  },

  // ═══ LẬP KẾ HOẠCH ═══
  {
    id: 'templates',
    category: 'plan',
    title: { en: 'Project templates', vi: 'Mẫu dự án' },
    summary: {
      en: 'What BLANK, SWP391, SWR302, SWT301, Client and Team templates set up — statuses, issue types, estimates, sprint length.',
      vi: 'Mẫu Blank, SWP391, SWR302, SWT301, Client và Team tạo sẵn gì — trạng thái, loại issue, cách ước lượng, độ dài sprint.',
    },
    keywords: ['template', 'blank', 'swp391', 'swr302', 'swt301', 'freelance', 'client project', 'company', 'team project', 'kanban', 'scrum', 'mau du an', 'tao du an'],
    pages: [page('workspace', '', 'Projects', 'Danh sách dự án')],
    blocks: [
      p(
        'A template only decides the **starting configuration**. Right after creation everything is copied into your project, and you can change statuses, workflows, issue types and fields in Project settings. Changing a template later never affects existing projects.',
        'Mẫu chỉ quyết định **cấu hình ban đầu**. Ngay khi tạo, mọi thứ được chép vào dự án, và bạn đổi trạng thái, workflow, loại issue, trường trong Project settings được. Mẫu thay đổi về sau không ảnh hưởng dự án cũ.',
      ),
      table(
        [['Template', 'Mẫu'], ['Issue types', 'Loại issue'], ['Special setup', 'Thiết lập riêng']],
        [
          ['Blank project', 'Epic, Story, Task, Bug, Sub-task', ['Points; 2-week sprints.', 'Story point; sprint 2 tuần.']],
          ['Software project (SWP391)', 'Epic, Story, Task, Bug, Sub-task', ['**Bug lifecycle** workflow with Retest; points; 2-week sprints.', 'Workflow **Bug lifecycle** có Retest; story point; sprint 2 tuần.']],
          ['Requirements (SWR302)', 'Epic, Requirement, Story, Task, Sub-task', ['**Requirement** issue type (no Bug type); points; 2-week sprints.', 'Loại issue **Requirement** (không có Bug); story point; sprint 2 tuần.']],
          ['Software testing (SWT301)', 'Epic, Story, Task, Bug, Sub-task, Test', ['**Test** type (Tests tab ready), Bug lifecycle, estimates in **hours**.', 'Loại **Test** (tab Tests dùng ngay), Bug lifecycle, ước lượng bằng **giờ**.']],
          ['Client project', 'Epic, Story, Task, Bug, Sub-task', ['Estimates in **hours**; **1-week** sprints.', 'Ước lượng bằng **giờ**; sprint **1 tuần**.']],
          ['Team project', 'Epic, Story, Task, Bug, Sub-task, Test', ['Columns **To Do → In Progress → Code Review → QA → Done**, Bug lifecycle, Test type.', 'Cột **To Do → In Progress → Code Review → QA → Done**, Bug lifecycle, loại Test.']],
        ],
      ),
      h('Statuses', 'Trạng thái'),
      list(
        ['Scrum projects start with **To Do → In Progress → In Review → Done**.', 'Dự án Scrum bắt đầu với **To Do → In Progress → In Review → Done**.'],
        ['Kanban projects start with **Backlog → Selected → In Progress → Done**, and have no sprints.', 'Dự án Kanban bắt đầu với **Backlog → Selected → In Progress → Done**, và không có sprint.'],
        ['The **Bug lifecycle** (SWP391, SWT301, Team) is **Open → In Progress → Fixed → Retest → Closed**, with **Reopened** when a retest fails. It only allows these moves: Open→In Progress, In Progress→Fixed, Fixed→Retest, Retest→Closed, Retest→Reopened, Reopened→In Progress, Open→Closed (invalid/duplicate), Closed→Reopened.', '**Bug lifecycle** (SWP391, SWT301, Team) là **Open → In Progress → Fixed → Retest → Closed**, và **Reopened** khi test lại thất bại. Chỉ cho phép các bước: Open→In Progress, In Progress→Fixed, Fixed→Retest, Retest→Closed, Retest→Reopened, Reopened→In Progress, Open→Closed (bug không hợp lệ/trùng), Closed→Reopened.'],
      ),
      tip(
        'Need MoSCoW for SWR302? Add a custom field: Project settings → **Fields** → **"New field"** → Field type **"Select list"** with options Must, Should, Could, Won’t. Priority itself stays Highest–Lowest.',
        'Cần MoSCoW cho SWR302? Thêm trường tuỳ chỉnh: Project settings → **Fields** → **"New field"** → Field type **"Select list"** với các lựa chọn Must, Should, Could, Won’t. Priority vẫn giữ Highest–Lowest.',
      ),
      tip(
        'Roles are not part of a template: invite your lecturer as **Teacher** or your customer as **Client** yourself.',
        'Vai trò không nằm trong mẫu: bạn tự mời giảng viên với vai trò **Teacher** hoặc khách hàng với vai trò **Client**.',
      ),
      warn(
        'A project that has no **Test** issue type shows "Test management is not enabled" in the Tests tab. A project Admin can click **"Enable test management"** at any time.',
        'Dự án chưa có loại issue **Test** sẽ hiện "Test management is not enabled" ở tab Tests. Admin dự án bấm **"Enable test management"** lúc nào cũng được.',
      ),
    ],
    related: ['getting-started', 'workflow', 'testing'],
  },

  {
    id: 'issues',
    category: 'plan',
    title: { en: 'Issues: types, fields, sub-tasks, links & comments', vi: 'Issue: loại, trường, sub-task, liên kết & bình luận' },
    summary: {
      en: 'Everything about a single issue — creating it, every field, parent/sub-tasks, links, watchers, attachments, @mentions, history and custom fields.',
      vi: 'Mọi thứ về một issue — cách tạo, từng trường, cha/sub-task, liên kết, người theo dõi, đính kèm, @nhắc tên, lịch sử và trường tuỳ chỉnh.',
    },
    keywords: ['issue', 'story', 'task', 'bug', 'epic', 'subtask', 'sub-task', 'priority', 'assignee', 'label', 'component', 'estimate', 'points', 'link', 'blocks', 'watch', 'attachment', 'comment', 'mention', 'history', 'custom field', 'duplicate', 'the', 'viec', 'binh luan', 'dinh kem'],
    pages: [page('project', 'list', 'Issues', 'Danh sách issue')],
    blocks: [
      h('Issue types', 'Các loại issue'),
      table(
        [['Type', 'Loại'], ['Use it for', 'Dùng cho']],
        [
          ['Epic', ['A big feature that groups stories (epic level).', 'Tính năng lớn, gom nhiều story (cấp epic).']],
          ['Story', ['Something a user needs: "As a …, I want …, so that …".', 'Điều người dùng cần: "As a …, I want …, so that …".']],
          ['Task', ['Technical or other work that is not a user story.', 'Việc kỹ thuật hoặc việc khác không phải user story.']],
          ['Bug', ['Something broken. May follow the Bug lifecycle workflow.', 'Lỗi cần sửa. Có thể theo workflow Bug lifecycle.']],
          ['Sub-task', ['A small step inside a Story, Task or Bug.', 'Bước nhỏ bên trong Story, Task hoặc Bug.']],
          ['Requirement', ['A requirement (SWR302 template).', 'Một yêu cầu phần mềm (mẫu SWR302).']],
          ['Test', ['A test case with steps (Tests tab).', 'Test case có các bước (tab Tests).']],
        ],
      ),
      p(
        'Project admins can add, rename or archive types in **Project settings → Issue types** (levels: Epic level, Standard, Subtask).',
        'Admin dự án thêm, đổi tên hoặc lưu trữ loại issue ở **Project settings → Issue types** (cấp: Epic level, Standard, Subtask).',
      ),
      h('Create an issue', 'Tạo issue'),
      steps(
        ['Click **"Create"** (Board, Backlog, Issues) or press [[C]], or use [[⌘]] [[K]] → **"Create issue"**.', 'Bấm **"Create"** (ở Board, Backlog, Issues) hoặc nhấn [[C]], hoặc [[⌘]] [[K]] → **"Create issue"**.'],
        ['Pick the type and write a title. While you type, **"Possible duplicates"** warns about similar issues (free, no AI).', 'Chọn loại và gõ tiêu đề. Trong lúc gõ, **"Possible duplicates"** cảnh báo issue giống nhau (miễn phí, không dùng AI).'],
        ['Optional: **"Draft with AI"** turns a short idea into a user story with acceptance criteria and a suggested estimate (uses 1 AI request).', 'Tuỳ chọn: **"Draft with AI"** biến một ý ngắn thành user story có acceptance criteria và gợi ý ước lượng (tốn 1 lượt AI).'],
        ['Set Assignee, Priority, Labels, Sprint (and the parent for a sub-task), then press **"Create"** or [[⌘]] [[↵]]. Tick **"Create another"** to keep the dialog open.', 'Chọn Assignee, Priority, Labels, Sprint (và issue cha nếu là sub-task), rồi bấm **"Create"** hoặc [[⌘]] [[↵]]. Tích **"Create another"** để hộp thoại mở tiếp.'],
      ),
      p(
        'Every issue gets a key like {{SWP-12}}. Click a card anywhere to open it in a side panel; the **"Open full page"** icon gives it its own URL, and **"Copy link"** copies it.',
        'Mỗi issue có mã như {{SWP-12}}. Bấm thẻ ở đâu cũng mở ngăn chi tiết bên phải; biểu tượng **"Open full page"** mở trang riêng có URL, **"Copy link"** chép link.',
      ),
      h('Fields', 'Các trường'),
      table(
        [['Field', 'Trường'], ['Notes', 'Ghi chú']],
        [
          ['Assignee', ['Who does it. **"Assign to me"** is one click.', 'Người làm. **"Assign to me"** chỉ một chạm.']],
          ['Reporter', ['Who created it.', 'Người tạo.']],
          ['Priority', ['Highest, High, Medium (default), Low, Lowest.', 'Highest, High, Medium (mặc định), Low, Lowest.']],
          ['Labels', ['Free tags; type a new name to create one.', 'Nhãn tự do; gõ tên mới để tạo.']],
          ['Epic / Parent', ['Epic for standard issues; Parent for sub-tasks.', 'Epic cho issue thường; Parent cho sub-task.']],
          ['Sprint', ['Active or planned sprint, or backlog.', 'Sprint đang chạy/đã lên kế hoạch, hoặc backlog.']],
          ['Fix version', ['The release it ships in.', 'Bản phát hành sẽ chứa issue này.']],
          [['Story points / Estimate (h)', 'Story points / Estimate (h)'], ['Points in most templates; hours in SWT301 and Client projects.', 'Point ở phần lớn mẫu; giờ ở mẫu SWT301 và Client.']],
          ['Start date · Due date', ['Used by the Timeline, My work and reminders.', 'Dùng cho Timeline, My work và nhắc việc.']],
          ['Components', ['Module or area of the product.', 'Module hoặc khu vực của sản phẩm.']],
        ],
      ),
      h('Sub-tasks and links', 'Sub-task và liên kết'),
      list(
        ['**"Add sub-task"** under the description splits work into small steps. Sub-task points are not counted in sprint commitment (the parent’s are).', '**"Add sub-task"** dưới phần mô tả để tách việc nhỏ. Point của sub-task không tính vào cam kết sprint (point của issue cha mới tính).'],
        ['**"Link issue"** connects two issues: **blocks / is blocked by**, **relates to**, **duplicates**, **clones**, **tests / is tested by**. "Blocks" links drive Timeline dependencies and the critical path.', '**"Link issue"** nối hai issue: **blocks / is blocked by** (chặn), **relates to** (liên quan), **duplicates** (trùng), **clones** (nhân bản), **tests / is tested by** (kiểm thử). Liên kết "blocks" tạo phụ thuộc và đường găng trên Timeline.'],
      ),
      h('Watchers, attachments, comments', 'Người theo dõi, đính kèm, bình luận'),
      list(
        ['The eye icon (**"Watch — get notified about changes"**) follows an issue. Reporter and assignee watch automatically when it is created. Watchers get a notification for each new comment.', 'Biểu tượng con mắt (**"Watch — get notified about changes"**) để theo dõi issue. Reporter và assignee tự theo dõi khi issue được tạo. Người theo dõi nhận thông báo mỗi bình luận mới.'],
        ['**"Attach"** or drag files onto the issue — max **25 MB** per file, **50 files** per issue.', '**"Attach"** hoặc kéo file vào issue — tối đa **25 MB** mỗi file, **50 file** mỗi issue.'],
        ['Comments: type **@** to mention someone (they get a notification), [[⌘]] [[↵]] to send. You can edit or delete your own comments; admins can delete any. **"Report comment"** flags abuse to project admins.', 'Bình luận: gõ **@** để nhắc tên (người đó nhận thông báo), [[⌘]] [[↵]] để gửi. Sửa/xoá được bình luận của mình; admin xoá được mọi bình luận. **"Report comment"** báo bình luận xấu cho admin dự án.'],
        ['Tabs under the issue: **Comments**, **History** (every field change, including changes by AI and Automation), **Work log**.', 'Các tab dưới issue: **Comments**, **History** (mọi thay đổi trường, kể cả do AI và Automation), **Work log**.'],
      ),
      h('Custom fields', 'Trường tuỳ chỉnh'),
      p(
        'Project settings → **Fields** → **"New field"**. Types: **Text, Number, Date, Select list, Multi-select, User, URL, Checkbox**. Use **"Applies to"** to show a field only on some issue types. Custom fields can be searched in JQL by name, e.g. {{"Browser" = Chrome}}.',
        'Project settings → **Fields** → **"New field"**. Kiểu: **Text, Number, Date, Select list, Multi-select, User, URL, Checkbox**. Dùng **"Applies to"** để trường chỉ hiện ở một số loại issue. Tìm theo trường tuỳ chỉnh trong JQL bằng tên, vd {{"Browser" = Chrome}}.',
      ),
      warn(
        'If you see **"Someone else just changed this issue. Showing the latest version."**, another person saved first. Your screen was refreshed — re-apply your change if it is still needed.',
        'Nếu thấy **"Someone else just changed this issue. Showing the latest version."**, nghĩa là người khác lưu trước bạn. Màn hình đã tải bản mới — làm lại thay đổi của bạn nếu vẫn cần.',
      ),
      tip(
        'Deleting an issue (**"More actions" → Delete**) moves it and its sub-tasks to the project **Trash**, where an admin can restore it.',
        'Xoá issue (**"More actions" → Delete**) sẽ chuyển nó và sub-task vào **Trash** của dự án, admin khôi phục được.',
      ),
      h('Description templates', 'Mẫu mô tả sẵn'),
      p(
        'When you create a **Bug, Story, Task, Epic or Requirement**, the description is pre-filled with a template (e.g. Bug: **Steps to reproduce · Expected result · Actual result · Environment · Evidence**; Story: **"As a … I want … so that …"** + an acceptance-criteria checklist). A hint **"Template: … · Clear"** sits above the editor — **Clear** empties it. Switching the type swaps the template only if you have not typed anything yet.',
        'Khi tạo **Bug, Story, Task, Epic hoặc Requirement**, phần mô tả được điền sẵn một mẫu (vd Bug: **Steps to reproduce · Expected result · Actual result · Environment · Evidence**; Story: **"As a … I want … so that …"** + checklist tiêu chí chấp nhận). Dòng **"Template: … · Clear"** nằm trên ô soạn — bấm **Clear** để xoá. Đổi loại issue thì mẫu đổi theo, miễn là bạn chưa gõ gì.',
      ),
      tip(
        'Project admins can edit each template in **Project settings → Issue types → Template** (Save / Reset to default). Leaving a template empty turns it off for that type.',
        'Admin dự án sửa từng mẫu ở **Project settings → Issue types → Template** (Save / Reset to default). Để mẫu trống là tắt mẫu cho loại đó.',
      ),
      h('Reactions on comments', 'Thả cảm xúc vào bình luận'),
      p(
        'Hover a comment (on phones it is always visible) and click the smiley to react with 👍 👎 😄 🎉 😕 ❤️ 🚀 👀. Click a reaction chip again to remove yours; hover a chip to see who reacted. Reactions never send notifications. Viewers can see reactions but cannot add them.',
        'Rê chuột vào bình luận (trên điện thoại nút luôn hiện) rồi bấm mặt cười để thả 👍 👎 😄 🎉 😕 ❤️ 🚀 👀. Bấm lại vào chip cảm xúc để gỡ của mình; rê vào chip để xem ai đã thả. Cảm xúc không gửi thông báo. Người chỉ xem (Viewer) thấy được nhưng không thả được.',
      ),
    ],
    related: ['board', 'issues-list-jql', 'time-capacity', 'ai', 'workflow'],
  },

  {
    id: 'board',
    category: 'plan',
    title: { en: 'Board', vi: 'Board (bảng Kanban)' },
    summary: {
      en: 'Columns, drag and drop, WIP limits, quick add, quick filters and the sprint header.',
      vi: 'Cột, kéo thả, giới hạn WIP, thêm nhanh, lọc nhanh và thanh thông tin sprint.',
    },
    keywords: ['board', 'kanban', 'column', 'drag', 'drop', 'wip', 'filter', 'only my issues', 'quick add', 'bang', 'cot', 'keo tha'],
    pages: [page('project', 'board', 'Board', 'Board')],
    blocks: [
      p(
        'The board shows each issue as a card in the column of its status. In a Scrum project it shows the **active sprint**; if no sprint is running it shows every open issue with the note "No sprint is running…". Changes from teammates appear live.',
        'Board hiển thị mỗi issue là một thẻ nằm trong cột ứng với trạng thái. Ở dự án Scrum, board hiện **sprint đang chạy**; nếu chưa có sprint nào chạy, board hiện mọi issue đang mở kèm dòng "No sprint is running…". Thay đổi của đồng đội hiện ngay lập tức.',
      ),
      h('Move work', 'Di chuyển công việc'),
      list(
        ['Drag a card to another column to change its status. Columns you cannot move to (because of the workflow) are not accepted and you get a message like "The Bug workflow does not allow moving from Open to Closed."', 'Kéo thẻ sang cột khác để đổi trạng thái. Cột không được phép (theo workflow) sẽ không nhận và bạn thấy thông báo như "The Bug workflow does not allow moving from Open to Closed."'],
        ['Drag within a column to reorder.', 'Kéo trong cùng cột để đổi thứ tự.'],
        ['Click a card to open it; [[Esc]] closes the panel.', 'Bấm thẻ để mở chi tiết; [[Esc]] để đóng.'],
        ['**Quick add**: the input at the bottom of a column (**"What needs to be done?"**) creates an issue directly in that column (not in Done columns).', '**Thêm nhanh**: ô ở cuối cột (**"What needs to be done?"**) tạo issue ngay trong cột đó (trừ cột Done).'],
      ),
      h('Filters', 'Bộ lọc'),
      list(
        ['**"Search board"** — press [[/]] to jump into it.', '**"Search board"** — nhấn [[/]] để nhảy vào ô tìm.'],
        ['Click avatars to show only those people’s cards.', 'Bấm ảnh đại diện để chỉ hiện thẻ của những người đó.'],
        ['**"Only my issues"** and **"Type"** filters; **"Clear"** resets. The count "x of y issues" shows how much is hidden.', 'Lọc **"Only my issues"** và **"Type"**; **"Clear"** để bỏ lọc. Dòng "x of y issues" cho biết đang ẩn bao nhiêu.'],
      ),
      h('WIP limits', 'Giới hạn WIP'),
      p(
        'A column header shows the card count, e.g. {{3 / 4}} when a WIP (work in progress) limit is set. Above the limit the number turns **red** — it is a warning to finish work before starting more; it does not block dragging. Set limits in **Project settings → Board** (per column) or **Workflow** (per status).',
        'Tiêu đề cột hiện số thẻ, vd {{3 / 4}} khi có giới hạn WIP (số việc đang làm cùng lúc). Vượt giới hạn thì con số chuyển **đỏ** — đây là lời nhắc làm xong việc trước khi nhận thêm, không chặn kéo thả. Đặt giới hạn ở **Project settings → Board** (theo cột) hoặc **Workflow** (theo trạng thái).',
      ),
      h('Sprint header', 'Thanh sprint'),
      p(
        'During a sprint the header shows the sprint name, **days left** (or days overdue), the **Sprint goal**, and — for admins — **"Complete sprint"**.',
        'Trong sprint, thanh tiêu đề hiện tên sprint, **số ngày còn lại** (hoặc số ngày quá hạn), **Sprint goal**, và — với admin — nút **"Complete sprint"**.',
      ),
      tip(
        'Want fewer columns? In **Project settings → Board** choose custom columns and map several statuses into one column (e.g. "In Review" + "QA" → "Checking").',
        'Muốn ít cột hơn? Ở **Project settings → Board** chọn cột tuỳ chỉnh và gộp nhiều trạng thái vào một cột (vd "In Review" + "QA" → "Checking").',
      ),
    ],
    related: ['workflow', 'backlog-sprints', 'shortcuts', 'faq'],
  },

  {
    id: 'backlog-sprints',
    category: 'plan',
    title: { en: 'Backlog & sprints', vi: 'Backlog & sprint' },
    summary: {
      en: 'Rank the backlog, create a sprint, plan it (by hand or with AI), start it, complete it, and read velocity.',
      vi: 'Xếp hạng backlog, tạo sprint, lên kế hoạch (tay hoặc bằng AI), bắt đầu, kết thúc và đọc velocity.',
    },
    keywords: ['backlog', 'sprint', 'plan', 'start sprint', 'complete sprint', 'velocity', 'goal', 'scrum', 'bulk', 'plan with ai', 'ke hoach', 'toc do'],
    pages: [page('project', 'backlog', 'Backlog', 'Backlog')],
    blocks: [
      p(
        'The **Backlog** (Scrum projects only) lists every open issue that is not done: sprints on top, then the backlog. Order means priority — the higher, the sooner.',
        '**Backlog** (chỉ dự án Scrum) liệt kê mọi issue chưa xong: các sprint ở trên, backlog ở dưới. Thứ tự chính là độ ưu tiên — càng cao càng làm sớm.',
      ),
      h('Work with the backlog', 'Làm việc với backlog'),
      list(
        ['Drag issues to reorder them or to move them into a sprint.', 'Kéo issue để đổi thứ tự hoặc đưa vào sprint.'],
        ['Type in **"What needs to be done? Press Enter to create"** to add issues fast.', 'Gõ vào **"What needs to be done? Press Enter to create"** để thêm issue nhanh.'],
        ['Click the points on a row to edit the estimate in place.', 'Bấm vào số point trên dòng để sửa ước lượng ngay tại chỗ.'],
        ['**"Show epics"** opens the epic panel: click an epic to filter, double-click to open it; **"Issues without epic"** finds orphans.', '**"Show epics"** mở bảng epic: bấm một epic để lọc, bấm đúp để mở; **"Issues without epic"** tìm issue chưa thuộc epic nào.'],
        ['Select many with [[⌘]]/[[⇧]] + click, then use the bar: **"Move to"** (Backlog or a sprint), **"Assign"**, **"Priority"**, **"Delete"**. [[Esc]] clears the selection.', 'Chọn nhiều bằng [[⌘]]/[[⇧]] + click, rồi dùng thanh công cụ: **"Move to"** (Backlog hoặc sprint), **"Assign"**, **"Priority"**, **"Delete"**. [[Esc]] để bỏ chọn.'],
      ),
      h('Create and start a sprint', 'Tạo và bắt đầu sprint'),
      steps(
        ['Click **"Create sprint"**. It appears above the backlog as a planned sprint.', 'Bấm **"Create sprint"**. Sprint mới hiện phía trên backlog ở trạng thái đã lên kế hoạch.'],
        ['Drag issues into it until the total points match what the team can finish.', 'Kéo issue vào tới khi tổng point vừa sức nhóm.'],
        ['Click **"Start sprint"**: check the **Sprint name**, choose **Duration** (1–4 weeks or Custom), **Start date**, **End date** and a **Sprint goal** ("One sentence the whole team can remember").', 'Bấm **"Start sprint"**: kiểm tra **Sprint name**, chọn **Duration** (1–4 tuần hoặc Custom), **Start date**, **End date** và **Sprint goal** ("một câu cả nhóm nhớ được").'],
      ),
      warn(
        'Only **one sprint can run at a time** — complete the current one first. An empty sprint cannot be started. Only planned (not started) sprints can be deleted; their issues go back to the backlog.',
        'Mỗi lúc chỉ **một sprint được chạy** — phải kết thúc sprint hiện tại trước. Sprint rỗng không bắt đầu được. Chỉ sprint chưa bắt đầu mới xoá được; issue của nó quay về backlog.',
      ),
      h('Plan with AI', 'Lập kế hoạch bằng AI'),
      p(
        'On a planned sprint click **"Plan with AI"** ("Propose issues for this sprint from your velocity"). CT Work calculates a **Target** = average completed points of your last 3 sprints (20 points or 60 hours if you have no history yet), then proposes issues from the top of the backlog until the target is reached. It skips unestimated issues and issues blocked by something outside the sprint, and tells you why. Untick what you don’t want and press **"Add N issues to sprint"**.',
        'Ở một sprint chưa bắt đầu, bấm **"Plan with AI"** ("Propose issues for this sprint from your velocity"). CT Work tính **Target** = trung bình point hoàn thành của 3 sprint gần nhất (20 point hoặc 60 giờ nếu chưa có lịch sử), rồi đề xuất issue từ đầu backlog tới khi đủ mục tiêu. Nó bỏ qua issue chưa ước lượng và issue đang bị chặn bởi việc ngoài sprint, kèm lý do. Bỏ tích những issue không muốn rồi bấm **"Add N issues to sprint"**.',
      ),
      tip(
        'The proposal itself is calculated by code and is free. Only **"AI coach notes"** (a short explanation of risks) uses 1 AI request.',
        'Phần đề xuất do mã tính nên miễn phí. Chỉ **"AI coach notes"** (giải thích ngắn về rủi ro) mới tốn 1 lượt AI.',
      ),
      h('Complete a sprint', 'Kết thúc sprint'),
      steps(
        ['Click **"Complete sprint"** on the Board (or from the sprint on the Backlog).', 'Bấm **"Complete sprint"** trên Board (hoặc ở sprint trong Backlog).'],
        ['Review the **Completed** and **Open** counts.', 'Xem số **Completed** và **Open**.'],
        ['Under **"Move open issues to"** choose **New sprint**, **Backlog** or another planned sprint. Unfinished sub-tasks move with their parent.', 'Ở **"Move open issues to"** chọn **New sprint**, **Backlog** hoặc một sprint đã lên kế hoạch. Sub-task chưa xong đi theo issue cha.'],
      ),
      h('Commitment and velocity', 'Cam kết và velocity'),
      p(
        'When you press Start, CT Work records the **committed** points (sub-tasks excluded). Issues added or removed later count as scope change on the burndown. **Velocity** is the points actually completed per sprint — see **Reports → Velocity**. Use it to decide how much to take into the next sprint.',
        'Khi bấm Start, CT Work ghi lại số point **cam kết** (không tính sub-task). Issue thêm/bớt sau đó được tính là thay đổi phạm vi trên burndown. **Velocity** là số point thực sự hoàn thành mỗi sprint — xem **Reports → Velocity**. Dùng nó để quyết định sprint sau nhận bao nhiêu việc.',
      ),
      warn(
        'Kanban projects have no Backlog page or sprints ("Kanban projects have no sprints"). Creating, starting and completing sprints requires the project **Admin** role.',
        'Dự án Kanban không có trang Backlog hay sprint ("Kanban projects have no sprints"). Tạo, bắt đầu và kết thúc sprint cần vai trò **Admin** dự án.',
      ),
    ],
    related: ['board', 'reports', 'ai', 'student-guide'],
  },

  {
    id: 'workflow',
    category: 'plan',
    title: { en: 'Workflows, board columns & project settings', vi: 'Workflow, cột board & cài đặt dự án' },
    summary: {
      en: 'Customize statuses and allowed transitions, map statuses to board columns, and manage labels, components, issue types and fields.',
      vi: 'Tuỳ biến trạng thái và luồng chuyển được phép, gộp trạng thái vào cột board, quản lý nhãn, component, loại issue và trường.',
    },
    keywords: ['workflow', 'status', 'transition', 'column', 'board settings', 'label', 'component', 'issue type', 'field', 'settings', 'quy trinh', 'trang thai', 'cai dat'],
    pages: [
      page('project', 'settings?tab=workflow', 'Workflow settings', 'Cài đặt workflow'),
      page('project', 'settings?tab=board', 'Board settings', 'Cài đặt board'),
    ],
    blocks: [
      p(
        'Project settings has these tabs: **Details, Members, Labels, Components, Workflow, Board, Issue types, Fields, Automation, GitHub, Public links, Import, Trash, Danger zone**. Everyone can look; only project admins can change ("You can view these settings, but only project admins can change them.").',
        'Project settings có các tab: **Details, Members, Labels, Components, Workflow, Board, Issue types, Fields, Automation, GitHub, Public links, Import, Trash, Danger zone**. Ai cũng xem được; chỉ admin dự án mới sửa được ("You can view these settings, but only project admins can change them.").',
      ),
      h('Statuses', 'Trạng thái'),
      list(
        ['Each status has a name, a **category** (To do / In progress / Done) and an optional WIP limit. The category drives reports: "Done" means resolved.', 'Mỗi trạng thái có tên, **category** (To do / In progress / Done) và giới hạn WIP tuỳ chọn. Category quyết định báo cáo: "Done" nghĩa là đã xong.'],
        ['Order with the up/down arrows — that is the board order. Every workflow needs at least one "To do" and one "Done" status.', 'Sắp thứ tự bằng mũi tên lên/xuống — đó cũng là thứ tự trên board. Mỗi workflow cần ít nhất một trạng thái "To do" và một "Done".'],
        ['Deleting a status asks where to move its issues (**"Move issues to"**).', 'Xoá trạng thái sẽ hỏi chuyển issue của nó đi đâu (**"Move issues to"**).'],
      ),
      h('Transitions', 'Luồng chuyển'),
      list(
        ['**"Allow any status to move to any status"** — free movement (default for normal workflows).', '**"Allow any status to move to any status"** — chuyển tự do (mặc định cho workflow thường).'],
        ['**"Only allow the moves checked below"** — tick cells in the **From ↓ / To →** grid. The row **"From any status"** allows entering a status from anywhere. Then **"Save transitions"**.', '**"Only allow the moves checked below"** — tích các ô trong bảng **From ↓ / To →**. Hàng **"From any status"** cho phép vào trạng thái đó từ bất kỳ đâu. Rồi **"Save transitions"**.'],
      ),
      h('Several workflows', 'Nhiều workflow'),
      p(
        '**"New workflow"** creates another one ("Start from" copies an existing one). Assign workflows to issue types in **Issue types** — e.g. Bugs use the Bug lifecycle, stories use the default workflow. The workflow of a type can only be changed while it has no issues.',
        '**"New workflow"** tạo thêm workflow ("Start from" chép từ workflow có sẵn). Gán workflow cho loại issue ở tab **Issue types** — vd Bug dùng Bug lifecycle, story dùng workflow mặc định. Chỉ đổi được workflow của một loại khi loại đó chưa có issue nào.',
      ),
      h('Board columns', 'Cột board'),
      p(
        '**Board** tab: keep one column per status, or define your own **Columns** (name + WIP limit) and use **Status mapping** to put several statuses into one column. Statuses of other workflows join the closest matching column.',
        'Tab **Board**: giữ mỗi trạng thái một cột, hoặc tự định nghĩa **Columns** (tên + giới hạn WIP) rồi dùng **Status mapping** để gộp nhiều trạng thái vào một cột. Trạng thái của workflow khác sẽ vào cột gần nghĩa nhất.',
      ),
      h('Other tabs', 'Các tab khác'),
      table(
        [['Tab', 'Tab'], ['What it does', 'Dùng để']],
        [
          ['Details', ['Name, description, Access, **Project lead**. The key cannot be changed.', 'Tên, mô tả, Access, **Project lead**. Key không đổi được.']],
          ['Labels', ['Colored tags; click a name to rename. Deleting removes it from every issue.', 'Nhãn có màu; bấm tên để đổi. Xoá nhãn sẽ gỡ khỏi mọi issue.']],
          ['Components', ['Parts of the product with an optional **Component lead**.', 'Các phần của sản phẩm, có thể chọn **Component lead**.']],
          ['Issue types', ['Add, rename, archive types; choose their workflow.', 'Thêm, đổi tên, lưu trữ loại issue; chọn workflow cho từng loại.']],
          ['Fields', ['Custom fields (Text, Number, Date, Select list, Multi-select, User, URL, Checkbox).', 'Trường tuỳ chỉnh (Text, Number, Date, Select list, Multi-select, User, URL, Checkbox).']],
          ['Danger zone', ['Archive (hide from the sidebar) or delete the project.', 'Lưu trữ (ẩn khỏi sidebar) hoặc xoá dự án.']],
        ],
      ),
      h('Workflow diagram', 'Sơ đồ workflow'),
      p(
        'The **Workflow** tab opens in **Diagram** view on a computer (**List** view is the classic list + checkbox grid). Each status is a box coloured by category; arrows are the allowed moves. An **ANY** badge means the status can be entered from any status.',
        'Tab **Workflow** mở ở chế độ **Diagram** trên máy tính (**List** là dạng danh sách + bảng tích cũ). Mỗi trạng thái là một ô tô màu theo category; mũi tên là các bước chuyển được phép. Nhãn **ANY** nghĩa là vào được trạng thái đó từ bất kỳ đâu.',
      ),
      steps(
        ['Hover a status and drag from one of its side handles to another status to add a transition (drop on empty space to cancel).', 'Rê chuột vào một trạng thái, kéo từ chấm tròn ở cạnh sang trạng thái khác để thêm luồng chuyển (thả ra chỗ trống để huỷ).'],
        ['Click an arrow to select it — tick **"Allow moving back"** or press **Delete** to remove it.', 'Bấm vào mũi tên để chọn — tích **"Allow moving back"** hoặc bấm **Delete** để xoá.'],
        ['Click a status to edit its name, category, colour, WIP limit or delete it (it asks where to move the issues).', 'Bấm vào trạng thái để sửa tên, category, màu, giới hạn WIP hoặc xoá (sẽ hỏi chuyển issue đi đâu).'],
        ['Press **Save** in the bar at the bottom. Box positions save by themselves; **Auto-arrange** lays everything out again.', 'Bấm **Save** ở thanh dưới cùng. Vị trí các ô tự lưu; **Auto-arrange** để xếp lại tự động.'],
      ),
      list(
        ['A **free** workflow shows a banner — drawing the first arrow switches it to restricted (you are asked first). **"Start from a linear flow"** creates To do → … → Done for you; **"Make free again"** removes all rules.', 'Workflow **tự do** có dải thông báo — vẽ mũi tên đầu tiên sẽ chuyển sang chế độ giới hạn (có hỏi trước). **"Start from a linear flow"** tạo sẵn To do → … → Done; **"Make free again"** bỏ hết luật.'],
        ['Yellow warnings: **Unreachable** (no arrow leads in) and **Dead end** (can never reach Done). They do not block saving.', 'Cảnh báo vàng: **Unreachable** (không mũi tên nào dẫn vào) và **Dead end** (không bao giờ tới được Done). Không chặn việc lưu.'],
        ['Zoom with ⌘/Ctrl + scroll or the − / + / Fit buttons; **Download PNG/SVG** to paste the diagram into your SWR302 report.', 'Phóng to/thu nhỏ bằng ⌘/Ctrl + cuộn hoặc nút − / + / Fit; **Download PNG/SVG** để dán sơ đồ vào báo cáo SWR302.'],
      ),
    ],
    related: ['board', 'templates', 'faq', 'issues'],
  },

  {
    id: 'timeline',
    category: 'plan',
    title: { en: 'Timeline & dependencies', vi: 'Timeline & phụ thuộc' },
    summary: {
      en: 'A Gantt view of epics and issues: drag to schedule, see blocking dependencies, conflicts and the critical path.',
      vi: 'Dạng Gantt cho epic và issue: kéo để xếp lịch, thấy phụ thuộc chặn nhau, xung đột lịch và đường găng.',
    },
    keywords: ['timeline', 'gantt', 'roadmap', 'dependency', 'critical path', 'blocks', 'schedule', 'lich', 'duong gang', 'phu thuoc'],
    pages: [page('project', 'timeline', 'Timeline', 'Timeline')],
    blocks: [
      p(
        'The Timeline shows epics with their issues on the left and a calendar on the right. Each bar runs from **Start date** to **Due date**.',
        'Timeline hiện epic cùng các issue bên trái và lịch bên phải. Mỗi thanh chạy từ **Start date** tới **Due date**.',
      ),
      list(
        ['**Zoom**: Weeks, Months or Quarters. **"Today"** scrolls back to today.', '**Zoom**: Weeks, Months hoặc Quarters. **"Today"** cuộn về hôm nay.'],
        ['Drag a bar to move it; drag its edges to change the start or due date. Changes snap to whole days and are saved immediately.', 'Kéo thanh để dời; kéo mép để đổi ngày bắt đầu hoặc hạn. Thay đổi bắt theo ngày và lưu ngay.'],
        ['An issue without dates shows **"Click a day to schedule this issue"** — click a day in its row.', 'Issue chưa có ngày hiện **"Click a day to schedule this issue"** — bấm vào một ngày trên dòng đó.'],
        ['Filter by assignee or by version; hide the issue column with **"Toggle issue column"**.', 'Lọc theo người làm hoặc version; ẩn cột issue bằng **"Toggle issue column"**.'],
      ),
      h('Dependencies', 'Phụ thuộc'),
      p(
        'Dependencies come from **"blocks"** links (open an issue → **"Link issue"** → blocks). If a blocked issue is scheduled to start before its blocker is due, the Timeline warns: **"A blocked issue is scheduled to start before its blocker is due"**.',
        'Phụ thuộc lấy từ liên kết **"blocks"** (mở issue → **"Link issue"** → blocks). Nếu issue bị chặn bắt đầu trước khi issue chặn nó tới hạn, Timeline cảnh báo: **"A blocked issue is scheduled to start before its blocker is due"**.',
      ),
      h('Critical path', 'Đường găng'),
      p(
        '**"Show critical path"** highlights the longest chain of unfinished, blocking issues (by duration). Any delay on this chain delays the whole project — watch these issues most. Circular links (A blocks B blocks A) are ignored.',
        '**"Show critical path"** tô sáng chuỗi issue chưa xong chặn nhau dài nhất (theo thời lượng). Chậm một việc trên chuỗi này là chậm cả dự án — hãy để mắt tới chúng nhất. Liên kết vòng (A chặn B chặn A) bị bỏ qua.',
      ),
    ],
    related: ['issues', 'releases', 'time-capacity'],
  },

  {
    id: 'releases',
    category: 'plan',
    title: { en: 'Releases & versions', vi: 'Release & version' },
    summary: {
      en: 'Group issues into versions, track progress to a release date, release, and write release notes with AI.',
      vi: 'Gom issue vào version, theo dõi tiến độ tới ngày phát hành, phát hành, và viết release notes bằng AI.',
    },
    keywords: ['release', 'version', 'fix version', 'release notes', 'milestone', 'phat hanh', 'moc'],
    pages: [page('project', 'releases', 'Releases', 'Releases')],
    blocks: [
      steps(
        ['Open **Releases** → **"Create version"**: Name (e.g. "v1.0" or "Milestone 2 – payment"), Start date, Release date, Description.', 'Mở **Releases** → **"Create version"**: Name (vd "v1.0" hoặc "Milestone 2 – thanh toán"), Start date, Release date, Description.'],
        ['On each issue set **Fix version**. The version shows progress: Done / In progress / To do, and **Overdue** after its release date.', 'Trên mỗi issue đặt **Fix version**. Version hiện tiến độ: Done / In progress / To do, và **Overdue** khi quá ngày phát hành.'],
        ['When it ships, open the version menu → **"Release"**. Unfinished issues can be moved to another version or removed from the version.', 'Khi bàn giao, mở menu version → **"Release"**. Issue chưa xong có thể dời sang version khác hoặc gỡ khỏi version.'],
        ['Other actions: **Edit**, **Unrelease**, **Archive/Unarchive**, **Delete** (issues are kept).', 'Thao tác khác: **Edit**, **Unrelease**, **Archive/Unarchive**, **Delete** (issue vẫn giữ nguyên).'],
      ),
      h('Release notes', 'Release notes'),
      p(
        'Open a version → **Release notes**. Choose **Audience** (For users / For the team) and **Language** (English / Vietnamese), then **"Generate with AI"** (1 AI request). The AI drafts notes from the version’s done issues — review, edit the Markdown and save.',
        'Mở một version → **Release notes**. Chọn **Audience** (For users / For the team) và **Language** (English / Vietnamese), rồi **"Generate with AI"** (1 lượt AI). AI soạn nháp từ các issue đã xong của version — xem lại, sửa Markdown rồi lưu.',
      ),
      tip(
        'Client projects: create one version per payment milestone and send the release notes to the client with each delivery.',
        'Dự án khách hàng: tạo mỗi mốc thanh toán một version và gửi release notes cho khách mỗi lần bàn giao.',
      ),
      warn(
        'Creating, releasing and deleting versions requires the project **Admin** role.',
        'Tạo, phát hành và xoá version cần vai trò **Admin** dự án.',
      ),
    ],
    related: ['timeline', 'ai', 'issues'],
  },

  // ═══ THEO DÕI & BÁO CÁO ═══
  {
    id: 'issues-list-jql',
    category: 'track',
    title: { en: 'Issues list, filters & JQL', vi: 'Danh sách issue, bộ lọc & JQL' },
    summary: {
      en: 'Filter the issue table in Basic mode or write JQL queries. Includes a full cheat sheet of fields, operators, functions and examples.',
      vi: 'Lọc bảng issue ở chế độ Basic hoặc viết truy vấn JQL. Có bảng tra đầy đủ trường, toán tử, hàm và ví dụ.',
    },
    keywords: ['jql', 'query', 'filter', 'search', 'list', 'issues', 'order by', 'currentuser', 'opensprints', 'truy van', 'loc', 'tim kiem'],
    pages: [page('project', 'list', 'Issues', 'Danh sách issue'), page('project', 'list?mode=jql', 'JQL search', 'Tìm bằng JQL')],
    blocks: [
      p(
        'The **Issues** page is a table of every issue. The switch at the top chooses **Basic** (search box + Type, Status, Assignee, Label filters, **"Show done"**) or **JQL** (a query language like Jira’s). Switching from Basic to JQL converts your current filters into a query. Filters live in the URL, so you can bookmark or share them.',
        'Trang **Issues** là bảng mọi issue. Công tắc phía trên chọn **Basic** (ô tìm + lọc Type, Status, Assignee, Label, **"Show done"**) hoặc **JQL** (ngôn ngữ truy vấn giống Jira). Chuyển từ Basic sang JQL sẽ đổi bộ lọc đang chọn thành câu truy vấn. Bộ lọc nằm trên URL nên lưu dấu trang hoặc gửi cho người khác được.',
      ),
      kbd(
        [['J'], 'Next row', 'Dòng dưới'],
        [['K'], 'Previous row', 'Dòng trên'],
        [['↵'], 'Open the highlighted issue', 'Mở issue đang chọn'],
        [['C'], 'Create issue', 'Tạo issue'],
        [['/'], 'Focus the search / JQL box', 'Nhảy vào ô tìm / JQL'],
        [['Tab'], 'Complete a JQL suggestion', 'Chọn gợi ý JQL'],
      ),
      h('JQL basics', 'Cơ bản về JQL'),
      p(
        'A query is one or more **clauses** {{field operator value}}, joined with **AND** / **OR**, grouped with brackets, negated with **NOT**, and optionally sorted with **ORDER BY**. Put values with spaces in quotes: {{status = "In Review"}}. Errors show the exact position.',
        'Một câu truy vấn gồm một hay nhiều **mệnh đề** {{trường toán_tử giá_trị}}, nối bằng **AND** / **OR**, nhóm bằng ngoặc, phủ định bằng **NOT**, và có thể sắp xếp bằng **ORDER BY**. Giá trị có khoảng trắng phải để trong ngoặc kép: {{status = "In Review"}}. Lỗi cú pháp báo đúng vị trí.',
      ),
      h('Fields', 'Trường'),
      table(
        [['Field', 'Trường'], ['Value', 'Giá trị']],
        [
          ['status', ['Status name', 'Tên trạng thái']],
          ['statusCategory', '"To Do" · "In Progress" · Done'],
          ['type', ['Issue type name, e.g. Bug, Story', 'Tên loại issue, vd Bug, Story']],
          ['priority', 'Highest · High · Medium · Low · Lowest (1–5)'],
          ['assignee · reporter · watcher', ['**Username** (not display name), currentUser(), EMPTY', '**Username** (không phải tên hiển thị), currentUser(), EMPTY']],
          ['labels · component', ['Label / component name', 'Tên nhãn / component']],
          ['sprint', ['Sprint name, openSprints(), closedSprints(), futureSprints()', 'Tên sprint, openSprints(), closedSprints(), futureSprints()']],
          ['parent (epic)', ['Parent or epic key, e.g. SWP-3', 'Mã issue cha hoặc epic, vd SWP-3']],
          ['points', ['Number (story points)', 'Số (story point)']],
          ['summary · description · text', ['Text search with ~ (text = title or description)', 'Tìm chữ bằng ~ (text = tiêu đề hoặc mô tả)']],
          ['key', ['Issue key, e.g. SWP-12 or 12', 'Mã issue, vd SWP-12 hoặc 12']],
          ['created · updated · due · resolved', ['Date: 2026-09-01, -7d, 2w, startOfWeek()…', 'Ngày: 2026-09-01, -7d, 2w, startOfWeek()…']],
          [['"Custom field name"', '"Tên trường tuỳ chỉnh"'], ['Value of a custom field, e.g. "Browser" = Chrome', 'Giá trị trường tuỳ chỉnh, vd "Browser" = Chrome']],
        ],
      ),
      h('Operators', 'Toán tử'),
      table(
        [['Operator', 'Toán tử'], ['Meaning', 'Nghĩa']],
        [
          ['=  !=', ['equals / does not equal', 'bằng / khác']],
          ['IN (…)  NOT IN (…)', ['any of / none of', 'thuộc / không thuộc danh sách']],
          ['~  !~', ['contains text / does not contain', 'chứa chữ / không chứa']],
          ['>  >=  <  <=', ['compare dates, numbers, priority', 'so sánh ngày, số, độ ưu tiên']],
          ['IS EMPTY  IS NOT EMPTY', ['has no value / has a value', 'không có giá trị / có giá trị']],
        ],
      ),
      tip(
        'Like Jira, {{priority > High}} means **more important** than High (i.e. Highest), and {{priority >= High}} means High or Highest.',
        'Giống Jira, {{priority > High}} nghĩa là **quan trọng hơn** High (tức Highest), còn {{priority >= High}} là High hoặc Highest.',
      ),
      h('Functions and dates', 'Hàm và ngày'),
      list(
        ['{{currentUser()}} — you. {{openSprints()}} / {{closedSprints()}} / {{futureSprints()}} — active, completed and planned sprints.', '{{currentUser()}} — chính bạn. {{openSprints()}} / {{closedSprints()}} / {{futureSprints()}} — sprint đang chạy, đã xong, sắp tới.'],
        ['{{now()}}, {{startOfDay()}}, {{endOfDay()}}, {{startOfWeek()}}, {{endOfWeek()}}, {{startOfMonth()}}, {{endOfMonth()}} — add an offset: {{startOfWeek(-1)}} is last week’s Monday.', '{{now()}}, {{startOfDay()}}, {{endOfDay()}}, {{startOfWeek()}}, {{endOfWeek()}}, {{startOfMonth()}}, {{endOfMonth()}} — thêm độ lệch: {{startOfWeek(-1)}} là thứ Hai tuần trước.'],
        ['Relative dates: {{-7d}} (7 days ago), {{2w}} (in two weeks), {{-4h}}, {{30m}}. Absolute: {{2026-09-01}}. {{due = 2026-09-01}} means the whole day.', 'Ngày tương đối: {{-7d}} (7 ngày trước), {{2w}} (hai tuần nữa), {{-4h}}, {{30m}}. Tuyệt đối: {{2026-09-01}}. {{due = 2026-09-01}} nghĩa là cả ngày đó.'],
        ['ORDER BY: key, rank, priority, created, updated, due, resolved, points, summary, status, assignee — add ASC or DESC.', 'ORDER BY: key, rank, priority, created, updated, due, resolved, points, summary, status, assignee — thêm ASC hoặc DESC.'],
      ),
      h('Examples', 'Ví dụ'),
      table(
        [['Query', 'Câu truy vấn'], ['Finds', 'Tìm']],
        [
          ['assignee = currentUser() AND statusCategory != Done', ['My open work', 'Việc của tôi chưa xong']],
          ['sprint IN openSprints() ORDER BY priority', ['Current sprint by priority', 'Sprint hiện tại theo độ ưu tiên']],
          ['created >= -7d ORDER BY created DESC', ['Created in the last 7 days', 'Tạo trong 7 ngày qua']],
          ['due < now() AND statusCategory != Done', ['Overdue', 'Quá hạn']],
          ['assignee IS EMPTY AND priority >= High', ['Urgent and unassigned', 'Gấp mà chưa ai nhận']],
          ['type = Bug AND status IN (Open, Reopened)', ['Bugs waiting for a fix', 'Bug đang chờ sửa']],
          ['text ~ "login" AND labels = frontend', ['Frontend issues about login', 'Issue frontend liên quan đăng nhập']],
          ['parent = SWP-3 AND points IS EMPTY', ['Unestimated issues in epic SWP-3', 'Issue chưa ước lượng trong epic SWP-3']],
        ],
      ),
      tip(
        'Save a query for later with **"Filters" → "Save current query as…"**, and download the results with **"Export current filter"** (CSV, Excel, PDF).',
        'Lưu câu truy vấn để dùng lại bằng **"Filters" → "Save current query as…"**, và tải kết quả bằng **"Export current filter"** (CSV, Excel, PDF).',
      ),
    ],
    related: ['filters-dashboards', 'import-export', 'automation'],
  },

  {
    id: 'global-search',
    category: 'track',
    title: { en: 'Search across all projects', vi: 'Tìm kiếm qua mọi dự án' },
    summary: {
      en: 'Find any issue in every project you can see — by words, by key, or with JQL and the new `project` field.',
      vi: 'Tìm bất kỳ issue nào trong mọi dự án bạn xem được — theo từ khoá, theo mã, hoặc bằng JQL với trường `project` mới.',
    },
    keywords: ['search', 'find', 'all projects', 'cross project', 'global', 'jql', 'project', 'command palette', 'cmd k', 'tim kiem', 'moi du an', 'tat ca'],
    pages: [page('global', '/work/search', 'Search', 'Tìm kiếm')],
    blocks: [
      h('Quick search (⌘K)', 'Tìm nhanh (⌘K)'),
      list(
        ['Press **⌘K** (Ctrl+K on Windows) anywhere in CT Work and type at least 2 characters. Issues from **all** your projects appear; the current project is listed first.', 'Bấm **⌘K** (Windows: Ctrl+K) ở bất kỳ đâu trong CT Work và gõ từ 2 ký tự. Issue của **mọi** dự án hiện ra; dự án đang mở được xếp trước.'],
        ['Type an exact key such as **QA-7** — a **"Jump to"** row takes you straight there.', 'Gõ đúng mã như **QA-7** — dòng **"Jump to"** đưa bạn tới thẳng thẻ đó.'],
        ['**"Search all issues for …"** opens the full Search page with your words.', '**"Search all issues for …"** mở trang Search đầy đủ với từ bạn vừa gõ.'],
      ),
      h('The Search page', 'Trang Search'),
      p(
        'Open **Search** in the sidebar (under **My work**). **Basic** mode has filters for **Project, Type, Status category, Assignee** (including **Me** and **Unassigned**) plus a text box. **JQL** mode accepts any query across projects. Click a column header to sort, **Group by project** to see results per project, **J/K** + **Enter** to open an issue. The address bar keeps your search, so you can bookmark or share it.',
        'Mở **Search** ở sidebar (dưới **My work**). Chế độ **Basic** có bộ lọc **Project, Type, Status category, Assignee** (có **Me** và **Unassigned**) và ô chữ. Chế độ **JQL** nhận mọi truy vấn qua nhiều dự án. Bấm tiêu đề cột để sắp xếp, **Group by project** để xem theo từng dự án, **J/K** + **Enter** để mở issue. Thanh địa chỉ giữ nguyên truy vấn nên bạn lưu bookmark hoặc gửi cho người khác được.',
      ),
      h('JQL across projects', 'JQL qua nhiều dự án'),
      table(
        [['Query', 'Truy vấn'], ['Finds', 'Tìm được']],
        [
          ['project = SHOP', ['Only issues of project SHOP', 'Chỉ issue của dự án SHOP']],
          ['project IN (SHOP, QA) AND type = Bug', ['Bugs in two projects', 'Bug của hai dự án']],
          ['assignee = me AND statusCategory != Done ORDER BY priority', ['Your open work everywhere, most important first', 'Việc đang mở của bạn ở mọi nơi, quan trọng nhất trước']],
          ['due < now() AND statusCategory != Done ORDER BY due', ['Everything overdue in all projects', 'Mọi việc quá hạn ở tất cả dự án']],
        ],
      ),
      tip(
        'Status, type and label names are looked up in each project separately — a status that exists only in one project simply matches nothing elsewhere. You only get an error (with a "did you mean") when the name exists in none of your projects.',
        'Tên trạng thái, loại và nhãn được tra riêng trong từng dự án — trạng thái chỉ có ở một dự án thì các dự án khác đơn giản là không khớp. Chỉ báo lỗi (kèm gợi ý "did you mean") khi tên đó không có trong dự án nào của bạn.',
      ),
      warn(
        'You only ever see issues from projects you can open. Archived projects are skipped unless you name them (**project = KEY**). If two workspaces use the same key, **project = KEY** matches both.',
        'Bạn chỉ thấy issue của dự án bạn được mở. Dự án đã lưu trữ bị bỏ qua trừ khi bạn ghi tên (**project = KEY**). Nếu hai không gian dùng cùng một mã, **project = KEY** khớp cả hai.',
      ),
    ],
    related: ['issues-list-jql', 'filters-dashboards', 'shortcuts'],
  },

  {
    id: 'filters-dashboards',
    category: 'track',
    title: { en: 'Saved filters & dashboards', vi: 'Bộ lọc đã lưu & dashboard' },
    summary: {
      en: 'Save and share JQL queries, and build dashboards from charts, counters and issue lists.',
      vi: 'Lưu và chia sẻ câu JQL, và dựng dashboard từ biểu đồ, bộ đếm và danh sách issue.',
    },
    keywords: ['filter', 'saved filter', 'share', 'dashboard', 'widget', 'chart', 'pie', 'bar', 'counter', 'bo loc', 'bieu do'],
    pages: [page('project', 'dashboards', 'Dashboards', 'Dashboards'), page('project', 'list?mode=jql', 'Issues (JQL)', 'Issues (JQL)')],
    blocks: [
      h('Saved filters', 'Bộ lọc đã lưu'),
      steps(
        ['On **Issues**, write a query (JQL mode) or pick Basic filters.', 'Ở trang **Issues**, viết câu truy vấn (chế độ JQL) hoặc chọn bộ lọc Basic.'],
        ['Open **"Filters"** → **"Save current query as…"**, give it a **Name**, and tick sharing if the whole project should see it.', 'Mở **"Filters"** → **"Save current query as…"**, đặt **Name**, và tích chia sẻ nếu muốn cả dự án thấy.'],
        ['Load it later from **"Filters"** (sections **"My filters"** and **"Shared with project"**). After editing a loaded filter, **"Save changes to …"** updates it.', 'Mở lại từ **"Filters"** (mục **"My filters"** và **"Shared with project"**). Sau khi sửa bộ lọc đang mở, **"Save changes to …"** để cập nhật.'],
      ),
      p(
        'A shared filter can be used by everyone in the project, but only you can change or delete it.',
        'Bộ lọc được chia sẻ thì cả dự án dùng được, nhưng chỉ bạn sửa hoặc xoá được.',
      ),
      h('Dashboards', 'Dashboard'),
      steps(
        ['Open **Dashboards** → **"Create dashboard"**. The recommended layout already contains open and overdue counts, status and assignee charts, created vs resolved, your open issues and project health.', 'Mở **Dashboards** → **"Create dashboard"**. Bố cục gợi ý có sẵn số việc mở và quá hạn, biểu đồ theo trạng thái và người làm, created vs resolved, việc của bạn và sức khoẻ dự án.'],
        ['Add or edit widgets: choose **Widget type**, **Title**, **Query (JQL)**, **Group by**, **Width**.', 'Thêm hoặc sửa widget: chọn **Widget type**, **Title**, **Query (JQL)**, **Group by**, **Width**.'],
        ['Reorder with **"Move up"** / **"Move down"**; **"Rename"** or **"Delete dashboard"** from the menu.', 'Đổi thứ tự bằng **"Move up"** / **"Move down"**; **"Rename"** hoặc **"Delete dashboard"** trong menu.'],
      ),
      table(
        [['Widget', 'Widget'], ['Shows', 'Hiển thị']],
        [
          ['Filter results', ['A list of issues matching a query', 'Danh sách issue khớp câu truy vấn']],
          ['Issue count', ['One big number for a query', 'Một con số lớn cho câu truy vấn']],
          ['Pie chart · Bar chart', ['Issues by Status, Status category, Assignee, Issue type, Priority, Label, Sprint or Component', 'Issue theo Status, Status category, Assignee, Issue type, Priority, Label, Sprint hoặc Component']],
          ['Created vs resolved', ['Daily created and resolved issues', 'Số issue tạo và xong mỗi ngày']],
          ['Sprint burndown', ['Remaining work in a sprint (Active sprint follows automatically)', 'Việc còn lại của sprint (Active sprint tự theo sprint đang chạy)']],
          ['My open issues', ['Open issues assigned to whoever is viewing', 'Việc đang mở giao cho người đang xem']],
          ['Project health', ['Overdue, due soon, stuck and unassigned work', 'Việc quá hạn, sắp tới hạn, bị kẹt và chưa ai nhận']],
          ['Text', ['Notes, links or team agreements', 'Ghi chú, link hoặc quy ước nhóm']],
        ],
      ),
      tip(
        'Everyone in the project can view a dashboard; only its creator and project admins can change it.',
        'Mọi người trong dự án xem được dashboard; chỉ người tạo và admin dự án sửa được.',
      ),
    ],
    related: ['issues-list-jql', 'reports'],
  },

  {
    id: 'reports',
    category: 'track',
    title: { en: 'Reports', vi: 'Báo cáo' },
    summary: {
      en: 'Health, weekly report, burndown, velocity, sprint report and retro, epics, member contributions, time and capacity.',
      vi: 'Health, báo cáo tuần, burndown, velocity, báo cáo sprint và retro, epic, đóng góp thành viên, thời gian và năng lực.',
    },
    keywords: ['report', 'burndown', 'burnup', 'velocity', 'sprint report', 'retro', 'retrospective', 'epic', 'contributions', 'weekly', 'health', 'brief', 'standup', 'bao cao', 'dong gop', 'ban tin'],
    pages: [
      page('project', 'reports', 'Reports', 'Báo cáo'),
      page('project', 'reports?tab=contributions', 'Contributions', 'Đóng góp'),
    ],
    blocks: [
      table(
        [['Tab', 'Tab'], ['What you get', 'Nội dung']],
        [
          ['Health', ['**Overdue**, **Due in 3 days**, **Stuck > 5 days** (in progress with no update), **Urgent & unassigned**, and **Workload** per member (highlighted when above 1.6× the team average). Free — calculated by code.', '**Overdue** (quá hạn), **Due in 3 days** (sắp tới hạn), **Stuck > 5 days** (đang làm mà 5 ngày không cập nhật), **Urgent & unassigned** (gấp mà chưa ai nhận), và **Workload** từng người (tô sáng khi hơn 1,6 lần trung bình nhóm). Miễn phí — do mã tính.']],
          ['Weekly report', ['A ready-to-send summary written by AI. Audience **Lecturer** / **Client** / **Team**, Language English / Tiếng Việt. **"Generate"** (1 AI request), **"Copy"**, **"Download .md"**. Shows the **facts used** so you can check nothing was invented.', 'Bản tóm tắt sẵn để gửi, do AI viết. Audience **Lecturer** / **Client** / **Team**, Language English / Tiếng Việt. **"Generate"** (1 lượt AI), **"Copy"**, **"Download .md"**. Kèm **dữ liệu đã dùng** để bạn kiểm AI không bịa.']],
          ['Burndown', ['Remaining vs the ideal **Guideline**, plus Completed and Scope (burnup chart type). Numbers are recorded once a day after the sprint starts.', 'Việc còn lại so với đường lý tưởng **Guideline**, cùng Completed và Scope (kiểu biểu đồ burnup). Số liệu ghi mỗi ngày một lần sau khi sprint bắt đầu.']],
          ['Velocity', ['Committed vs Completed per sprint and the **Average velocity**.', 'Cam kết và hoàn thành mỗi sprint, và **Average velocity** (tốc độ trung bình).']],
          ['Sprint report', ['Completed and open issues of a sprint, the goal, and **"Generate retro"** — paste the team’s notes, get What went well / What didn’t / Action items; action items come as proposals you Apply.', 'Issue đã xong và còn mở của sprint, mục tiêu, và **"Generate retro"** — dán ý kiến nhóm, nhận Went well / Didn’t go well / Action items; action item là đề xuất để bạn Apply.']],
          ['Epics', ['Progress, status and due date of every epic.', 'Tiến độ, trạng thái và hạn của từng epic.']],
          ['Contributions', ['Per member: Completed, Points, Sub-tasks, Created, Comments, Updates, Open now. Time range All time / Last 7 days / Last 30 days / a sprint. **"Copy as text"**, **"Export CSV"**.', 'Theo từng người: Completed, Points, Sub-tasks, Created, Comments, Updates, Open now. Khoảng thời gian All time / Last 7 days / Last 30 days / một sprint. **"Copy as text"**, **"Export CSV"**.']],
          ['Time', ['Hours logged per person per day (see Time tracking).', 'Số giờ đã ghi theo người theo ngày (xem bài Ghi thời gian).']],
          ['Capacity', ['Hours available vs assigned load per member (see Time tracking).', 'Giờ có thể làm so với khối lượng được giao của từng người (xem bài Ghi thời gian).']],
        ],
      ),
      h('Today’s brief (stand-up)', 'Bản tin hôm nay (stand-up)'),
      p(
        'On **Health**, **"Generate brief"** (or **"Refresh"**) writes 3–6 bullets for today’s stand-up from the facts above: what finished yesterday, what is overdue or stuck, who should look at what. It uses 1 AI request and is saved for the whole team to read.',
        'Ở tab **Health**, **"Generate brief"** (hoặc **"Refresh"**) viết 3–6 gạch đầu dòng cho buổi stand-up hôm nay từ các số liệu trên: hôm qua xong gì, việc nào quá hạn hay bị kẹt, ai nên xem gì. Tốn 1 lượt AI và được lưu cho cả nhóm cùng đọc.',
      ),
      tip(
        'All numbers in reports are calculated by code. The AI only puts them into words — that is why each AI report shows the facts it was given.',
        'Mọi con số trong báo cáo đều do mã tính. AI chỉ diễn đạt thành lời — vì vậy mỗi báo cáo AI đều kèm dữ liệu nó được cung cấp.',
      ),
      warn(
        'Contributions do not credit changes applied from AI proposals (they are recorded as AI). Teachers and clients can open every report, which makes Contributions a fair view of who did what.',
        'Báo cáo Contributions không tính công cho thay đổi áp dụng từ đề xuất AI (được ghi là AI). Giảng viên và khách hàng mở được mọi báo cáo, nên Contributions là cách nhìn công bằng về ai làm gì.',
      ),
    ],
    related: ['student-guide', 'backlog-sprints', 'time-capacity', 'ai'],
  },

  {
    id: 'time-capacity',
    category: 'track',
    title: { en: 'Time tracking & capacity', vi: 'Ghi thời gian & năng lực nhóm' },
    summary: {
      en: 'Log work on issues (1h 30m, 1d…), read the time report, and plan capacity with hours per day and time off.',
      vi: 'Ghi giờ làm trên issue (1h 30m, 1d…), xem báo cáo thời gian, và lập kế hoạch năng lực với số giờ mỗi ngày và ngày nghỉ.',
    },
    keywords: ['time', 'log', 'worklog', 'hours', 'estimate', 'remaining', 'capacity', 'time off', 'holiday', 'utilization', 'gio', 'ghi gio', 'nghi phep', 'nang luc'],
    pages: [page('project', 'reports?tab=time', 'Time report', 'Báo cáo thời gian'), page('project', 'reports?tab=capacity', 'Capacity', 'Năng lực')],
    blocks: [
      h('Log time on an issue', 'Ghi giờ trên issue'),
      steps(
        ['Open the issue → **Time tracking** → **"Log time"**.', 'Mở issue → **Time tracking** → **"Log time"**.'],
        ['**Time spent**: e.g. {{2h 30m}}, {{45m}}, {{1.5h}}, {{1d}} (= 8h), {{1w}} (= 5 days). A plain number means hours.', '**Time spent**: vd {{2h 30m}}, {{45m}}, {{1.5h}}, {{1d}} (= 8 giờ), {{1w}} (= 5 ngày). Chỉ gõ số nghĩa là giờ.'],
        ['**Date started**, then **Remaining estimate**: **"Adjust automatically"** (subtracts what you logged), **"Leave unchanged"**, or **"Set to"** a new value.', '**Date started**, rồi **Remaining estimate**: **"Adjust automatically"** (tự trừ phần vừa ghi), **"Leave unchanged"** (giữ nguyên), hoặc **"Set to"** giá trị mới.'],
        ['Optional **Work description**, then save. Entries appear in the **Work log** tab; you can delete your own.', '**Work description** tuỳ chọn, rồi lưu. Các lần ghi hiện ở tab **Work log**; bạn xoá được lần ghi của mình.'],
      ),
      p(
        'In projects that estimate in hours (SWT301, Client project) the issue shows **Estimate (h)** instead of Story points; logged time is compared against it.',
        'Ở dự án ước lượng bằng giờ (SWT301, Client project), issue hiện **Estimate (h)** thay cho Story points; giờ đã ghi được so với con số này.',
      ),
      h('Time report', 'Báo cáo thời gian'),
      p(
        '**Reports → Time**: pick **Previous week / This week / Next week** or a From–To range. You see **Total logged**, people, days with logs and a per-person, per-day table. Days are counted in Vietnam time (UTC+7).',
        '**Reports → Time**: chọn **Previous week / This week / Next week** hoặc khoảng From–To. Bạn thấy **Total logged**, số người, số ngày có ghi và bảng theo người theo ngày. Ngày tính theo giờ Việt Nam (UTC+7).',
      ),
      h('Capacity', 'Năng lực (capacity)'),
      list(
        ['**Reports → Capacity**: choose a sprint or a custom date range.', '**Reports → Capacity**: chọn một sprint hoặc khoảng ngày tuỳ chọn.'],
        ['Admins set **Hours / day** for each member (0–24; "Unset" means not planned).', 'Admin đặt **Hours / day** cho từng người (0–24; "Unset" là chưa tính).'],
        ['Add **Time off** (Person, From, To, Note — e.g. exams, Tết). Working days minus time off × hours per day = **Capacity**.', 'Thêm **Time off** (Person, From, To, Note — vd thi cử, Tết). Số ngày làm việc trừ ngày nghỉ × giờ mỗi ngày = **Capacity**.'],
        ['**Load** = open estimates assigned to the person; **Utilization** = Load ÷ Capacity. Above 100% turns red — rebalance work.', '**Load** = ước lượng của việc đang mở được giao; **Utilization** = Load ÷ Capacity. Trên 100% chuyển đỏ — nên chia lại việc.'],
      ),
      warn(
        'Logging time requires permission to edit issues (Admin or Member). One entry can be at most 24 hours.',
        'Ghi giờ cần quyền sửa issue (Admin hoặc Member). Mỗi lần ghi tối đa 24 giờ.',
      ),
    ],
    related: ['reports', 'backlog-sprints', 'api-tokens'],
  },

  // ═══ KIỂM THỬ ═══
  {
    id: 'testing',
    category: 'quality',
    title: { en: 'Testing (like Xray): cases, plans, cycles, bugs, traceability', vi: 'Kiểm thử (giống Xray): test case, plan, cycle, bug, truy vết' },
    summary: {
      en: 'Write test cases with steps or Gherkin, group them into plans, execute them in cycles, raise bugs from failed steps, retest, and export the cycle report for SWT301.',
      vi: 'Viết test case theo bước hoặc Gherkin, gom vào plan, chạy trong cycle, tạo bug từ bước Fail, test lại, và xuất báo cáo cycle cho SWT301.',
    },
    keywords: ['test', 'testing', 'xray', 'test case', 'step', 'gherkin', 'bdd', 'plan', 'cycle', 'run', 'execute', 'pass', 'fail', 'blocked', 'evidence', 'screenshot', 'bug', 'retest', 'traceability', 'coverage', 'swt301', 'kiem thu', 'truy vet', 'bang chung'],
    pages: [
      page('project', 'tests', 'Test library', 'Thư viện test'),
      page('project', 'tests?tab=cycles', 'Test cycles', 'Test cycle'),
      page('project', 'tests?tab=traceability', 'Traceability', 'Truy vết'),
    ],
    blocks: [
      p(
        'The **Tests** tab has four parts: **Test library** (test cases), **Test plans** (reusable sets), **Test cycles** (one round of execution) and **Traceability** (requirements ↔ tests ↔ bugs). A test case is an issue of type **Test**, so it also has comments, assignee, labels and links.',
        'Tab **Tests** có bốn phần: **Test library** (các test case), **Test plans** (bộ test dùng lại), **Test cycles** (một đợt chạy test) và **Traceability** (yêu cầu ↔ test ↔ bug). Test case là issue loại **Test**, nên cũng có bình luận, người phụ trách, nhãn và liên kết.',
      ),
      warn(
        'If the tab says **"Test management is not enabled"**, a project admin clicks **"Enable test management"** (it adds the Test issue type). SWT301 and Team templates have it already.',
        'Nếu tab báo **"Test management is not enabled"**, admin dự án bấm **"Enable test management"** (thêm loại issue Test). Mẫu SWT301 và Team đã bật sẵn.',
      ),
      h('1. Write test cases', '1. Viết test case'),
      steps(
        ['**"New test"**: Title, **Covers requirements** (issue keys, e.g. SWT-12, SWT-15), Priority, **Test type**: **Steps** or **Scenario (Gherkin)**.', '**"New test"**: Title, **Covers requirements** (mã issue yêu cầu, vd SWT-12, SWT-15), Priority, **Test type**: **Steps** (theo bước) hoặc **Scenario (Gherkin)**.'],
        ['Steps table: **Action**, **Test data**, **Expected result**. [[Tab]] moves to the next cell, [[⌘]] + [[↵]] adds a step below. Up to 100 steps.', 'Bảng bước: **Action** (thao tác), **Test data** (dữ liệu), **Expected result** (kết quả mong đợi). [[Tab]] sang ô kế, [[⌘]] + [[↵]] thêm bước bên dưới. Tối đa 100 bước.'],
        ['Gherkin: write {{Scenario / Given / When / Then}} lines.', 'Gherkin: viết các dòng {{Scenario / Given / When / Then}}.'],
        ['Add **Preconditions** (accounts, data, configuration). Save with [[⌘]] [[S]].', 'Thêm **Preconditions** (tài khoản, dữ liệu, cấu hình cần có). Lưu bằng [[⌘]] [[S]].'],
      ),
      code('Scenario: Successful login\n  Given a registered user\n  When they sign in with valid credentials\n  Then the dashboard is shown'),
      tip(
        'Faster: open a Story or Requirement → AI menu → **"Generate test cases"**, then Apply the proposals. Or **"Import CSV"** with columns Title, Preconditions, Step, Test data, Expected result, Requirement, Priority — one row per step; leave Title empty to add more steps to the test above (**"Download template"** gives an example; max 5 MB).',
        'Nhanh hơn: mở một Story hoặc Requirement → menu AI → **"Generate test cases"**, rồi Apply đề xuất. Hoặc **"Import CSV"** với các cột Title, Preconditions, Step, Test data, Expected result, Requirement, Priority — mỗi dòng một bước; để trống Title để thêm bước cho test phía trên (**"Download template"** có file mẫu; tối đa 5 MB).',
      ),
      h('2. Group tests into plans', '2. Gom test vào plan'),
      p(
        '**Test plans** → **"New plan"** (Name, Description: scope, target release, entry/exit criteria) → **"Manage tests"**. Or select tests in the library and choose **"Find or create a plan…"**. A plan can be run as many times as you need (**"Run this plan"**).',
        '**Test plans** → **"New plan"** (Name, Description: phạm vi, bản phát hành, tiêu chí vào/ra) → **"Manage tests"**. Hoặc chọn test trong library rồi **"Find or create a plan…"**. Một plan chạy lại bao nhiêu lần cũng được (**"Run this plan"**).',
      ),
      h('3. Run a test cycle', '3. Chạy test cycle'),
      steps(
        ['**Test cycles** → **"New cycle"**: Name (e.g. "Sprint 3 regression on Staging"), **Environment**, **Build / version**, optional **Test plan**. Each test gets a run with a **snapshot** of its current steps — editing the test later does not change old results.', '**Test cycles** → **"New cycle"**: Name (vd "Regression sprint 3 trên Staging"), **Environment**, **Build / version**, **Test plan** (tuỳ chọn). Mỗi test có một lượt chạy **chụp lại** các bước lúc đó — sửa test về sau không làm đổi kết quả cũ.'],
        ['Open the cycle; use **"Add tests"** to add more. Press [[J]]/[[K]] to move and [[↵]] to execute a test.', 'Mở cycle; **"Add tests"** để thêm test. Nhấn [[J]]/[[K]] để di chuyển và [[↵]] để chạy một test.'],
        ['In the run panel mark each step: [[P]] Pass, [[F]] Fail, [[B]] Blocked, [[S]] Skip. For Fail/Blocked, type the **Actual result** ([[↵]] or [[A]] jumps there).', 'Trong ngăn chạy test, đánh dấu từng bước: [[P]] Pass, [[F]] Fail, [[B]] Blocked, [[S]] Skip. Với Fail/Blocked, gõ **Actual result** (kết quả thực tế) ([[↵]] hoặc [[A]] để nhảy tới).'],
        ['Attach evidence: **"Add evidence"**, drag screenshots in, or paste with [[⌘]] [[V]] (max 25 MB each).', 'Đính kèm bằng chứng: **"Add evidence"**, kéo ảnh chụp màn hình vào, hoặc dán bằng [[⌘]] [[V]] (tối đa 25 MB mỗi file).'],
        ['Go to the next test with [[]]] (previous: [[[]]). The run status is derived from the steps (any Fail ⇒ Fail); **"Override run status"** sets it by hand.', 'Sang test kế bằng [[]]] (test trước: [[[]]). Trạng thái lượt chạy suy ra từ các bước (có bước Fail ⇒ Fail); **"Override run status"** để đặt tay.'],
        ['Set the cycle state (Planned → In progress → Done) when the round is finished.', 'Đặt trạng thái cycle (Planned → In progress → Done) khi xong đợt.'],
      ),
      h('4. Bugs and retest', '4. Bug và test lại'),
      list(
        ['On a failed run click **"Create bug"**: the summary, steps to reproduce and actual result are filled in; the bug is linked to the run under **Defects**. Or **"Link existing bug"** by key.', 'Ở lượt chạy Fail, bấm **"Create bug"**: tiêu đề, các bước tái hiện và kết quả thực tế được điền sẵn; bug được gắn vào lượt chạy ở mục **Defects**. Hoặc **"Link existing bug"** bằng mã issue.'],
        ['Developers fix the bug and move it Fixed → **Retest**. Every failed run linked to it becomes **RETEST** and shows "A linked bug was moved to Retest — run this test again."', 'Lập trình viên sửa bug và chuyển Fixed → **Retest**. Mọi lượt chạy Fail gắn với bug đó thành **RETEST** và hiện "A linked bug was moved to Retest — run this test again."'],
        ['Run it again: pass ⇒ close the bug (Retest → Closed); still failing ⇒ Retest → Reopened.', 'Chạy lại: Pass ⇒ đóng bug (Retest → Closed); vẫn Fail ⇒ Retest → Reopened.'],
      ),
      h('5. Traceability', '5. Truy vết'),
      p(
        '**Traceability** lists every Requirement/Story with the tests that cover it (links "tests"), the latest result and open bugs. Filter by **Not covered, Not run, Failing, Blocked, Passing**, and **"Export CSV"** for your report.',
        '**Traceability** liệt kê mọi Requirement/Story cùng các test phủ nó (liên kết "tests"), kết quả gần nhất và bug còn mở. Lọc theo **Not covered, Not run, Failing, Blocked, Passing**, và **"Export CSV"** cho báo cáo.',
      ),
      h('6. Export the cycle report', '6. Xuất báo cáo cycle'),
      p(
        'In a cycle open **"Export cycle report"**: **Excel (.xlsx)** — summary sheet plus every run; **PDF** — printable report to share or attach; **CSV** — raw results. This is what you submit for SWT301.',
        'Trong cycle mở **"Export cycle report"**: **Excel (.xlsx)** — sheet tổng hợp và mọi lượt chạy; **PDF** — báo cáo in được để gửi hoặc đính kèm; **CSV** — kết quả thô. Đây là file nộp cho môn SWT301.',
      ),
      warn(
        'Executing tests (marking steps, creating bugs) needs Admin or Member. Teachers, clients and viewers can see results only.',
        'Chạy test (đánh dấu bước, tạo bug) cần vai trò Admin hoặc Member. Teacher, Client và Viewer chỉ xem kết quả.',
      ),
    ],
    related: ['templates', 'student-guide', 'shortcuts', 'ai'],
  },

  // ═══ AI & TỰ ĐỘNG HOÁ ═══
  {
    id: 'ai',
    category: 'ai',
    title: { en: 'AI assistant', vi: 'Trợ lý AI' },
    summary: {
      en: 'What the assistant can do, how proposals and Apply work, the free daily quota and Pro.',
      vi: 'Trợ lý làm được gì, đề xuất và nút Apply hoạt động thế nào, hạn mức miễn phí mỗi ngày và gói Pro.',
    },
    keywords: ['ai', 'assistant', 'ask ai', 'chat', 'proposal', 'apply', 'quota', 'pro', 'upgrade', 'summarize', 'story', 'test cases', 'meeting notes', 'tro ly', 'han muc', 'nang cap'],
    pages: [page('global', '/pro', 'CT Pro', 'Gói Pro')],
    blocks: [
      p(
        'Click **"Ask AI"** in the project header to open the assistant on the right. It knows your project — issues, sprints, members and workload — and replies in the language you write in (Vietnamese or English).',
        'Bấm **"Ask AI"** ở thanh tiêu đề dự án để mở trợ lý bên phải. Trợ lý biết dự án của bạn — issue, sprint, thành viên và khối lượng việc — và trả lời bằng ngôn ngữ bạn viết (tiếng Việt hoặc tiếng Anh).',
      ),
      h('Things to ask', 'Có thể hỏi gì'),
      list(
        ['"What should I work on next?" · "Is our sprint on track?" · "Who is overloaded right now?"', '"Tôi nên làm gì tiếp theo?" · "Sprint có kịp không?" · "Ai đang bị quá tải?"'],
        ['"Write user stories for a login feature" · "Draft test cases for SWP-12"', '"Viết user story cho tính năng đăng nhập" · "Soạn test case cho SWP-12"'],
        ['"Turn these meeting notes into tasks:" + paste your notes.', '"Chuyển biên bản họp này thành việc:" + dán ghi chú họp.'],
      ),
      h('Proposals → Apply', 'Đề xuất → Apply'),
      p(
        'The AI **never changes anything by itself**. When it wants to create or update issues, add a comment, move issues to a sprint or create tests, it shows **proposal cards**. Nothing happens until you press **Apply**. The change is made **as you, with your permissions**, and the issue history marks it as AI.',
        'AI **không bao giờ tự sửa gì**. Khi muốn tạo/sửa issue, thêm bình luận, chuyển issue vào sprint hay tạo test, nó hiện các **thẻ đề xuất**. Không có gì xảy ra cho tới khi bạn bấm **Apply**. Thay đổi được thực hiện **dưới tên bạn, với đúng quyền của bạn**, và lịch sử issue ghi là AI.',
      ),
      h('AI on an issue', 'AI trên một issue'),
      table(
        [['Menu item', 'Mục'], ['Issue types', 'Loại issue'], ['Does', 'Làm gì']],
        [
          ['Summarize', ['All', 'Mọi loại'], ['Description + comments in a few lines', 'Tóm tắt mô tả + bình luận trong vài dòng']],
          ['Break into stories', 'Epic', ['Proposes stories for the epic', 'Đề xuất các story cho epic']],
          ['Split into sub-tasks', 'Story, Task, Bug', ['Proposes sub-tasks', 'Đề xuất sub-task']],
          ['Generate test cases', 'Story, Requirement', ['Proposes Test issues with steps', 'Đề xuất test case có bước']],
          ['Improve bug report', 'Bug', ['Steps to reproduce, expected vs actual, severity', 'Bước tái hiện, mong đợi và thực tế, mức độ']],
          ['Review story quality', 'Story, Requirement', ['Checks INVEST and whether acceptance criteria are testable', 'Chấm theo INVEST và acceptance criteria có kiểm được không']],
          ['Ask about this issue', ['All', 'Mọi loại'], ['Opens the chat about this issue', 'Mở khung chat về issue này']],
        ],
      ),
      p(
        'Other AI features: **"Draft with AI"** when creating an issue, **"AI coach notes"** in Plan with AI, **Weekly report**, **"Generate retro"**, **"Generate brief"**, and release notes (**"Generate with AI"**). Duplicate detection while typing a title is free and does not use AI.',
        'Các tính năng AI khác: **"Draft with AI"** khi tạo issue, **"AI coach notes"** trong Plan with AI, **Weekly report**, **"Generate retro"**, **"Generate brief"**, và release notes (**"Generate with AI"**). Phát hiện issue trùng khi gõ tiêu đề là miễn phí, không dùng AI.',
      ),
      h('Quota and Pro', 'Hạn mức và gói Pro'),
      table(
        [['Account', 'Tài khoản'], ['AI requests', 'Lượt AI']],
        [
          [['Free', 'Miễn phí'], ['**5 per day** by default (the site can change this number). Each question, quick action or AI report uses 1. Resets every day.', 'Mặc định **5 lượt/ngày** (web có thể chỉnh con số này). Mỗi câu hỏi, thao tác nhanh hay báo cáo AI tốn 1 lượt. Tự làm mới mỗi ngày.']],
          ['Pro', ['Unlimited use of the assistant, within the site’s normal daily usage cap.', 'Dùng trợ lý không giới hạn, trong mức sử dụng hằng ngày chung của web.']],
        ],
      ),
      p(
        'When the free requests run out you see **"You’re out of free AI requests"** with **"Upgrade to Pro"** (or **"Maybe later"**). Health and all other reports stay free.',
        'Khi hết lượt miễn phí bạn thấy **"You’re out of free AI requests"** kèm **"Upgrade to Pro"** (hoặc **"Maybe later"**). Health và mọi báo cáo khác vẫn miễn phí.',
      ),
      warn(
        'Only **Admin** and **Member** can use AI in a project. Viewers, teachers and clients don’t see the "Ask AI" button.',
        'Chỉ **Admin** và **Member** dùng được AI trong dự án. Viewer, Teacher và Client không thấy nút "Ask AI".',
      ),
      tip(
        'The conversation is kept per project in this browser tab and only the last 10 turns are sent to the AI. Start a fresh conversation when you change topic — answers get sharper.',
        'Cuộc trò chuyện được giữ theo từng dự án trong tab trình duyệt này và chỉ 10 lượt gần nhất được gửi cho AI. Đổi chủ đề thì xoá hội thoại để bắt đầu lại — câu trả lời sẽ chính xác hơn.',
      ),
    ],
    related: ['backlog-sprints', 'reports', 'automation', 'faq'],
  },

  {
    id: 'automation',
    category: 'ai',
    title: { en: 'Automation rules', vi: 'Luật tự động (Automation)' },
    summary: {
      en: 'When something happens → if the issue matches → then do something. Triggers, conditions, actions, templates, audit log and loop protection.',
      vi: 'Khi có chuyện xảy ra → nếu issue khớp điều kiện → thì làm gì đó. Trigger, điều kiện, hành động, mẫu, nhật ký và chống vòng lặp.',
    },
    keywords: ['automation', 'rule', 'trigger', 'condition', 'action', 'when', 'if', 'then', 'schedule', 'daily', 'loop', 'audit', 'tu dong', 'luat'],
    pages: [page('project', 'settings?tab=automation', 'Automation', 'Automation')],
    blocks: [
      p(
        '**Project settings → Automation** → **"Create rule"**, or start from **Templates**. A rule has three blocks: **When** (trigger), **If** (conditions), **Then** (actions). Everyone can view rules; only project admins create and edit them.',
        '**Project settings → Automation** → **"Create rule"**, hoặc bắt đầu từ **Templates**. Một luật có ba khối: **When** (khi nào), **If** (nếu), **Then** (thì làm gì). Ai cũng xem được luật; chỉ admin dự án mới tạo và sửa.',
      ),
      h('When — triggers', 'When — sự kiện kích hoạt'),
      table(
        [['Trigger', 'Trigger'], ['Fires when', 'Chạy khi']],
        [
          ['Issue created', ['A new issue is created', 'Có issue mới được tạo']],
          ['Issue transitioned', ['Status changes; optionally only **From status** / **To status**', 'Trạng thái đổi; có thể giới hạn **From status** / **To status**']],
          ['Issue assigned', ['The assignee changes', 'Người được giao thay đổi']],
          ['Field value changed', ['One of the **Fields to watch** changes: Priority, Assignee, Story points, Due date, Start date, Sprint, Fix version, Parent, Summary, Description', 'Một trong các **Fields to watch** đổi: Priority, Assignee, Story points, Due date, Start date, Sprint, Fix version, Parent, Summary, Description']],
          ['Comment added', ['Someone comments', 'Có người bình luận']],
          ['Scheduled — daily at 08:00', ['Every morning (Vietnam time) on the issues matching **"Run on issues matching"** (JQL)', 'Mỗi sáng (giờ Việt Nam) trên các issue khớp **"Run on issues matching"** (JQL)']],
        ],
      ),
      h('If — conditions', 'If — điều kiện'),
      p(
        '**"Add JQL condition"** (up to 10). The issue must match **every** condition. No conditions = the rule runs on every matching event. Example: {{type = Bug AND priority IS EMPTY}}.',
        '**"Add JQL condition"** (tối đa 10). Issue phải khớp **tất cả** điều kiện. Không có điều kiện = luật chạy mọi lần có sự kiện. Ví dụ: {{type = Bug AND priority IS EMPTY}}.',
      ),
      h('Then — actions (up to 10)', 'Then — hành động (tối đa 10)'),
      list(
        ['**Transition issue** (respects the workflow), **Assign issue** (a member, Reporter or Unassigned), **Set priority**, **Add label**.', '**Transition issue** (tuân theo workflow), **Assign issue** (một thành viên, Reporter hoặc Unassigned), **Set priority**, **Add label**.'],
        ['**Add comment** — posted as "Automation".', '**Add comment** — đăng dưới tên "Automation".'],
        ['**Move to active sprint** — standard issues only; skipped when no sprint is running.', '**Move to active sprint** — chỉ issue thường; bỏ qua nếu không có sprint đang chạy.'],
        ['**Send notification** — to assignee, reporter, watchers and/or specific people, with your message.', '**Send notification** — gửi tới assignee, reporter, watchers và/hoặc người cụ thể, kèm lời nhắn.'],
        ['**Create sub-task** with a title.', '**Create sub-task** với tiêu đề cho trước.'],
      ),
      h('Templates', 'Mẫu có sẵn'),
      table(
        [['Template', 'Mẫu'], ['What it does', 'Làm gì']],
        [
          ['Prioritise new bugs', ['When a bug is created → set priority to High', 'Khi tạo bug → đặt priority High']],
          ['Comment when resolved', ['When an issue moves to Done → comment "Resolved"', 'Khi issue sang Done → bình luận "Resolved"']],
          ['Start work on assignment', ['When an issue is assigned → move it to In Progress', 'Khi issue được giao → chuyển sang In Progress']],
          ['Daily overdue reminder', ['Every morning → notify the assignee of each overdue issue', 'Mỗi sáng → nhắc người làm của từng issue quá hạn']],
        ],
      ),
      h('Test and audit', 'Chạy thử và nhật ký'),
      list(
        ['**"Test on an issue"** runs the actions on one issue now, skipping the trigger but checking the conditions. The actions are applied for real.', '**"Test on an issue"** chạy hành động trên một issue ngay, bỏ qua trigger nhưng vẫn kiểm điều kiện. Hành động được áp dụng thật.'],
        ['The **Audit log** tab shows the last 100 runs with status **Success, No match, Failed, Loop blocked, Throttled**. Changes by rules show in issue history as "Automation".', 'Tab **Audit log** hiện 100 lần chạy gần nhất với trạng thái **Success, No match, Failed, Loop blocked, Throttled**. Thay đổi do luật hiện trong lịch sử issue là "Automation".'],
      ),
      warn(
        'Loop protection: a rule can never trigger itself; a chain of rules triggering each other stops after 3 steps ("Loop blocked"); and each rule runs at most 200 times per hour ("Throttled").',
        'Chống vòng lặp: một luật không bao giờ tự kích hoạt chính nó; chuỗi luật kích hoạt lẫn nhau dừng sau 3 bước ("Loop blocked"); và mỗi luật chạy tối đa 200 lần/giờ ("Throttled").',
      ),
    ],
    related: ['issues-list-jql', 'notifications', 'workflow'],
  },

  {
    id: 'notifications',
    category: 'ai',
    title: { en: 'Notifications & email', vi: 'Thông báo & email' },
    summary: {
      en: 'Which events notify you, where notifications appear, email modes (instant, daily digest, off), quiet hours and morning reminders.',
      vi: 'Sự kiện nào báo cho bạn, thông báo hiện ở đâu, chế độ email (ngay, gộp mỗi ngày, tắt), giờ im lặng và nhắc việc buổi sáng.',
    },
    keywords: ['notification', 'bell', 'email', 'digest', 'quiet hours', 'reminder', 'mention', 'watch', 'thong bao', 'gio im lang', 'nhac viec'],
    pages: [page('global', '/work?tab=my-work', 'My work', 'My work'), page('global', '/notifications', 'All notifications', 'Tất cả thông báo')],
    blocks: [
      h('You are notified when', 'Bạn nhận thông báo khi'),
      list(
        ['You are added to a workspace.', 'Bạn được thêm vào một không gian.'],
        ['An issue is assigned to you (by a person, the AI you applied, or a rule).', 'Một issue được giao cho bạn (bởi người, bởi AI mà ai đó Apply, hoặc bởi luật tự động).'],
        ['Someone **@mentions** you in a comment.', 'Có người **@nhắc tên** bạn trong bình luận.'],
        ['Someone comments on an issue you **watch** (reporters and assignees watch automatically).', 'Có bình luận mới trên issue bạn **theo dõi** (reporter và assignee tự theo dõi).'],
        ['An automation rule sends a notification, or an issue needs your attention.', 'Một luật tự động gửi thông báo, hoặc issue cần bạn chú ý.'],
      ),
      p(
        'You are never notified about your own actions, and a mention replaces the normal comment notification (no duplicates).',
        'Bạn không bao giờ nhận thông báo về việc chính mình làm, và nhắc tên thay cho thông báo bình luận thường (không bị trùng).',
      ),
      h('Where they appear', 'Thông báo hiện ở đâu'),
      list(
        ['On the CuongThai notifications page (**/notifications**, filter **"CT Work"**) and the site’s bell.', 'Trên trang thông báo của CuongThai (**/notifications**, bộ lọc **"CT Work"**) và chuông của web.'],
        ['In the desktop app as system notifications.', 'Trong app desktop dưới dạng thông báo hệ thống.'],
        ['By email, depending on your settings.', 'Qua email, tuỳ cài đặt của bạn.'],
      ),
      h('Email settings', 'Cài đặt email'),
      steps(
        ['Open **/work → My work** → **"Notification settings"**.', 'Mở **/work → My work** → **"Notification settings"**.'],
        ['**Email notifications**: **Instantly** (an email per notification), **Daily digest** (one summary email every morning at 08:00), or **Off** (in-app only).', '**Email notifications**: **Instantly** (mỗi thông báo một email), **Daily digest** (một email tổng hợp mỗi sáng lúc 08:00), hoặc **Off** (chỉ trong web).'],
        ['Turn on **Quiet hours** and choose From/To (Vietnam time). Emails during these hours wait for the next digest. Then **"Save"**.', 'Bật **Quiet hours** (giờ im lặng) và chọn From/To (giờ Việt Nam). Email trong khung giờ này sẽ dồn vào thư gộp kế tiếp. Rồi **"Save"**.'],
      ),
      tip(
        'Morning reminders: when the site has this feature switched on, people with issues **overdue or due today** get one email at 08:00 listing them. **My work** always shows the same list grouped by Overdue, Due today, Due soon, Later and No due date.',
        'Nhắc việc buổi sáng: khi web bật tính năng này, ai có issue **quá hạn hoặc tới hạn hôm nay** sẽ nhận một email lúc 08:00 liệt kê chúng. **My work** luôn hiện danh sách đó theo nhóm Overdue, Due today, Due soon, Later và No due date.',
      ),
    ],
    related: ['issues', 'automation', 'apps'],
  },

  // ═══ TÍCH HỢP & DỮ LIỆU ═══
  {
    id: 'github',
    category: 'connect',
    title: { en: 'GitHub integration', vi: 'Tích hợp GitHub' },
    summary: {
      en: 'Connect a repository with a webhook so branches, commits and pull requests appear on issues, and PRs can move issues automatically.',
      vi: 'Nối repository bằng webhook để nhánh, commit và pull request hiện trên issue, và PR tự chuyển trạng thái issue.',
    },
    keywords: ['github', 'git', 'webhook', 'commit', 'branch', 'pull request', 'pr', 'merge', 'development', 'secret', 'tich hop'],
    pages: [page('project', 'settings?tab=github', 'GitHub settings', 'Cài đặt GitHub')],
    blocks: [
      p(
        'CT Work uses a repository **webhook** — no GitHub app or personal token is needed. Only project admins can connect it.',
        'CT Work dùng **webhook** của repository — không cần GitHub App hay token cá nhân. Chỉ admin dự án mới kết nối được.',
      ),
      h('Set it up', 'Thiết lập'),
      steps(
        ['**Project settings → GitHub** → **"Connect GitHub"**. CT Work creates a **Payload URL** and a **Secret**.', '**Project settings → GitHub** → **"Connect GitHub"**. CT Work tạo **Payload URL** và **Secret**.'],
        ['Enter the **Repository name** as {{owner/repo}} to get a direct link to GitHub’s webhook settings.', 'Nhập **Repository name** dạng {{owner/repo}} để có link thẳng tới trang webhook của GitHub.'],
        ['In GitHub: repository **Settings → Webhooks → Add webhook**.', 'Trên GitHub: repository **Settings → Webhooks → Add webhook**.'],
        ['Paste the **Payload URL**, set **Content type** to {{application/json}}, paste the **Secret**.', 'Dán **Payload URL**, đặt **Content type** là {{application/json}}, dán **Secret**.'],
        ['Choose **"Let me select individual events"** and tick **Pushes**, **Branch or tag creation**, **Pull requests**. Save.', 'Chọn **"Let me select individual events"** và tích **Pushes**, **Branch or tag creation**, **Pull requests**. Lưu.'],
        ['Back in CT Work, the page shows when the first event arrives. If it doesn’t, open GitHub’s **Recent Deliveries** tab and click **Redeliver**.', 'Quay lại CT Work, trang sẽ báo khi nhận sự kiện đầu tiên. Nếu chưa, mở tab **Recent Deliveries** trên GitHub và bấm **Redeliver**.'],
      ),
      h('Link work to issues', 'Gắn code vào issue'),
      p(
        'Mention the issue key (any letter case) and it appears in the issue’s **Development** panel:',
        'Nhắc mã issue (hoa hay thường đều được) là nó hiện ở mục **Development** của issue:',
      ),
      table(
        [['Where', 'Ở đâu'], ['Example', 'Ví dụ']],
        [
          [['Branch name', 'Tên nhánh'], 'feature/swp-12-login'],
          [['Commit message', 'Commit message'], 'SWP-12 Validate the login form'],
          [['Pull request title or description', 'Tiêu đề hoặc mô tả PR'], 'SWP-12: Login page'],
        ],
      ),
      h('Automatic transitions', 'Tự chuyển trạng thái'),
      p(
        'Choose **"When a pull request is opened, move the issue to…"** and **"When a pull request is merged, move the issue to…"**. Moves follow the issue’s workflow — if a move isn’t allowed from the current status, it is skipped.',
        'Chọn **"When a pull request is opened, move the issue to…"** và **"When a pull request is merged, move the issue to…"**. Việc chuyển tuân theo workflow — nếu không được phép từ trạng thái hiện tại thì bỏ qua.',
      ),
      warn(
        '**"Rotate secret"** if the secret may have leaked — the old one stops working immediately, so paste the new one into GitHub. **"Disconnect"** stops accepting events (already linked items stay); also delete the webhook in GitHub.',
        '**"Rotate secret"** nếu secret có thể đã lộ — secret cũ hết hiệu lực ngay, nhớ dán secret mới vào GitHub. **"Disconnect"** ngừng nhận sự kiện (mục đã gắn vẫn giữ); nhớ xoá luôn webhook trên GitHub.',
      ),
    ],
    related: ['issues', 'workflow', 'api-tokens'],
  },

  {
    id: 'import-export',
    category: 'connect',
    title: { en: 'Import & export (CSV, Excel, PDF, Jira)', vi: 'Nhập & xuất dữ liệu (CSV, Excel, PDF, Jira)' },
    summary: {
      en: 'Export any filter to CSV, Excel or PDF, and import issues from a CT Work or Jira CSV or any spreadsheet.',
      vi: 'Xuất bộ lọc bất kỳ ra CSV, Excel hoặc PDF, và nhập issue từ CSV của CT Work, Jira hoặc bảng tính bất kỳ.',
    },
    keywords: ['import', 'export', 'csv', 'excel', 'xlsx', 'pdf', 'jira', 'spreadsheet', 'migrate', 'nhap', 'xuat'],
    pages: [page('project', 'settings?tab=import', 'Import', 'Nhập dữ liệu'), page('project', 'list', 'Issues (export)', 'Issues (xuất)')],
    blocks: [
      h('Export', 'Xuất'),
      p(
        'On **Issues**, the **"Export current filter"** button downloads exactly the issues matching your current filter or JQL (up to 5,000): **CSV** (re-importable, Jira-compatible columns), **Excel (.xlsx)** (all fields) or **PDF** (printable summary table).',
        'Ở trang **Issues**, nút **"Export current filter"** tải đúng các issue khớp bộ lọc hoặc JQL hiện tại (tối đa 5.000): **CSV** (nhập lại được, cột tương thích Jira), **Excel (.xlsx)** (mọi trường) hoặc **PDF** (bảng tóm tắt để in).',
      ),
      list(
        ['Other exports: Contributions (**"Export CSV"**), Traceability (**"Export CSV"**), test cycle (**"Export cycle report"**), Weekly report (**"Download .md"**).', 'Xuất khác: Contributions (**"Export CSV"**), Traceability (**"Export CSV"**), test cycle (**"Export cycle report"**), Weekly report (**"Download .md"**).'],
      ),
      h('Import issues', 'Nhập issue'),
      steps(
        ['**Project settings → Import** (project admins only).', '**Project settings → Import** (chỉ admin dự án).'],
        ['Drop a **.csv** file (UTF-8, header row, max 8 MB, up to 2,000 rows). Supported: a **CT Work export**; **Jira** (Filters → Export → **Export CSV (all fields)**); or any spreadsheet saved as CSV with a **Summary** column.', 'Thả file **.csv** (UTF-8, có dòng tiêu đề, tối đa 8 MB, tối đa 2.000 dòng). Hỗ trợ: file **xuất từ CT Work**; **Jira** (Filters → Export → **Export CSV (all fields)**); hoặc bảng tính bất kỳ lưu dạng CSV có cột **Summary**.'],
        ['Review the preview: rows with **errors** are skipped, rows with **warnings** are imported with the noted adjustments. Nothing is created yet.', 'Xem bản xem trước: dòng có **lỗi** bị bỏ qua, dòng có **cảnh báo** vẫn nhập kèm điều chỉnh đã ghi. Lúc này chưa tạo gì.'],
        ['Confirm **"Import N issues?"**. You get Created / Skipped / Failed counts and a list of failed rows.', 'Xác nhận **"Import N issues?"**. Bạn nhận số Created / Skipped / Failed và danh sách dòng lỗi.'],
      ),
      table(
        [['Column', 'Cột'], ['How it is read', 'Cách đọc']],
        [
          ['Summary', ['Required (also "Title")', 'Bắt buộc (hoặc "Title")']],
          ['Issue key', ['Links parents inside the file', 'Dùng để nối cha–con trong file']],
          ['Issue Type', ['Epic, Story, Task, Bug, Sub-task… (unknown ⇒ Task)', 'Epic, Story, Task, Bug, Sub-task… (lạ ⇒ Task)']],
          ['Status', ['By name (unknown ⇒ first status)', 'Theo tên (lạ ⇒ trạng thái đầu)']],
          ['Priority', ['Highest … Lowest, or Jira names like Blocker, Major, Minor', 'Highest … Lowest, hoặc tên kiểu Jira như Blocker, Major, Minor']],
          ['Assignee / Reporter', ['Username or display name of a project member', 'Username hoặc tên hiển thị của thành viên dự án']],
          ['Description', ['Plain text', 'Văn bản thường']],
          ['Labels', ['Repeated columns or comma-separated; missing labels are created', 'Nhiều cột hoặc cách nhau bằng dấu phẩy; nhãn chưa có sẽ được tạo']],
          ['Story Points', ['Number', 'Số']],
          ['Due date / Start date', '2026-09-23, 23/Sep/26, 23/09/2026'],
          ['Parent', ['Key in the file or an existing key like KEY-12 (also "Epic Link")', 'Mã trong file hoặc mã có sẵn như KEY-12 (hoặc "Epic Link")']],
          ['Sprint', ['Name of an open sprint (missing ⇒ backlog)', 'Tên sprint đang mở (không có ⇒ backlog)']],
          ['Original Estimate', ['Seconds (Jira) or hours with an "(h)" header', 'Giây (Jira) hoặc giờ nếu tiêu đề có "(h)"']],
          ['Created', ['Keeps the original creation date', 'Giữ nguyên ngày tạo gốc']],
        ],
      ),
      tip(
        'Have an Excel file? Save it as **"CSV UTF-8"** first so Vietnamese characters stay correct. Column names are not case-sensitive; other columns are ignored. Test cases have their own importer: Tests → **"Import CSV"**.',
        'Có file Excel? Lưu thành **"CSV UTF-8"** trước để giữ đúng tiếng Việt có dấu. Tên cột không phân biệt hoa thường; cột khác bị bỏ qua. Test case có bộ nhập riêng: Tests → **"Import CSV"**.',
      ),
    ],
    related: ['issues-list-jql', 'testing', 'api-tokens'],
  },

  {
    id: 'public-links',
    category: 'connect',
    title: { en: 'Public read-only links (for lecturers & clients)', vi: 'Link công khai chỉ đọc (cho giảng viên & khách hàng)' },
    summary: {
      en: 'Let someone follow the board, backlog, reports and test results without an account — safely.',
      vi: 'Cho người khác xem board, backlog, báo cáo và kết quả kiểm thử mà không cần tài khoản — an toàn.',
    },
    keywords: ['public', 'share', 'link', 'read only', 'lecturer', 'client', 'no account', 'chia se', 'cong khai', 'giang vien', 'khach hang'],
    pages: [page('project', 'settings?tab=share', 'Public links', 'Link công khai')],
    blocks: [
      steps(
        ['**Project settings → Public links** → **"Create public link"** (project admins only).', '**Project settings → Public links** → **"Create public link"** (chỉ admin dự án).'],
        ['**Label** — a private note such as "Lecturer — SWP391 review" (only admins see it).', '**Label** — ghi chú riêng như "Giảng viên — chấm SWP391" (chỉ admin thấy).'],
        ['**Sections to share**: **Board** (cards in the active sprint by status), **Backlog** (open issues grouped by sprint), **Reports** (progress totals, burndown and velocity), **Tests** (test cycles with pass rates).', '**Sections to share**: **Board** (thẻ trong sprint đang chạy theo trạng thái), **Backlog** (issue mở theo sprint), **Reports** (tổng tiến độ, burndown và velocity), **Tests** (test cycle kèm tỉ lệ pass).'],
        ['**"Include issue descriptions"** — off by default, because descriptions often contain internal notes.', '**"Include issue descriptions"** — mặc định tắt, vì mô tả hay chứa ghi chú nội bộ.'],
        ['**Expires**: Never, 7, 30 or 90 days → **"Create link"** → **"Copy"** and send it.', '**Expires**: Never, 7, 30 hoặc 90 ngày → **"Create link"** → **"Copy"** rồi gửi đi.'],
      ),
      p(
        'People opening the link see only what you chose, with names and avatars — **never** emails, comments, attachments or history. They don’t need an account.',
        'Người mở link chỉ thấy phần bạn chọn, kèm tên và ảnh đại diện — **không bao giờ** thấy email, bình luận, file đính kèm hay lịch sử. Họ không cần tài khoản.',
      ),
      warn(
        'Anyone who has the link can open it. **"Revoke"** stops it immediately (you can create a new one later). Revoked, expired and wrong links all show the same "not found" page. Creating and revoking links is recorded in the audit log.',
        'Ai có link đều mở được. **"Revoke"** vô hiệu hoá ngay lập tức (có thể tạo link mới sau). Link đã thu hồi, hết hạn hay sai đều hiện cùng một trang "không tìm thấy". Việc tạo và thu hồi link được ghi vào audit log.',
      ),
      tip(
        'If your lecturer has an account, inviting them with the **Teacher** role is better: they can also comment and see the Contributions report.',
        'Nếu giảng viên có tài khoản, mời với vai trò **Teacher** sẽ tốt hơn: họ còn bình luận được và xem báo cáo Contributions.',
      ),
    ],
    related: ['roles', 'student-guide', 'trash-audit'],
  },

  {
    id: 'api-tokens',
    category: 'connect',
    title: { en: 'API tokens & REST API', vi: 'API token & REST API' },
    summary: {
      en: 'Personal tokens for scripts, CI pipelines and tools like Claude Code — create, scope, revoke, and call the REST API.',
      vi: 'Token cá nhân cho script, CI và công cụ như Claude Code — tạo, giới hạn quyền, thu hồi, và gọi REST API.',
    },
    keywords: ['api', 'token', 'rest', 'bearer', 'script', 'ci', 'github actions', 'developer', 'curl', 'integration', 'ctw_'],
    pages: [page('global', '/work/developer', 'API tokens', 'API token')],
    blocks: [
      p(
        'Open **"API tokens"** at the bottom of the sidebar (/work/developer). A token acts **as you**, with exactly your permissions in each workspace and project. The CT Work apps sign in with your normal account — tokens are only for external tools.',
        'Mở **"API tokens"** ở cuối sidebar (/work/developer). Token hành động **như chính bạn**, đúng quyền của bạn ở từng không gian và dự án. App CT Work đăng nhập bằng tài khoản bình thường — token chỉ dành cho công cụ bên ngoài.',
      ),
      steps(
        ['**"Create token"** → **Name** (where it is used, e.g. "GitHub Actions").', '**"Create token"** → **Name** (dùng ở đâu, vd "GitHub Actions").'],
        ['**Access**: **Read only** (view, search, export — any change is rejected) or **Read & write** (also create/update issues, comment, log work).', '**Access**: **Read only** (xem, tìm, xuất — mọi thay đổi bị từ chối) hoặc **Read & write** (còn tạo/sửa issue, bình luận, ghi giờ).'],
        ['**Expires**: Never, 30 days, 90 days or 1 year.', '**Expires**: Never, 30 ngày, 90 ngày hoặc 1 năm.'],
        ['Copy the token (it starts with {{ctw_}}). **It is shown only once.**', 'Sao chép token (bắt đầu bằng {{ctw_}}). **Token chỉ hiện đúng một lần.**'],
      ),
      h('Call the API', 'Gọi API'),
      code('curl -H "Authorization: Bearer ctw_…" \\\n  "https://cuongthai.com/api/v1/work/projects/{projectId}/search?jql=sprint%20IN%20openSprints()"'),
      table(
        [['Endpoint', 'Endpoint'], ['Purpose', 'Dùng để']],
        [
          ['GET /workspaces', ['Your workspaces', 'Các không gian của bạn']],
          ['GET /workspaces/{id}/projects', ['Projects (id + key)', 'Dự án (id + key)']],
          ['GET /resolve/{slug}/{KEY}', ['Web URL → project id', 'URL web → project id']],
          ['GET /projects/{id}', ['Config: statuses, types, sprints, labels, members', 'Cấu hình: trạng thái, loại, sprint, nhãn, thành viên']],
          ['GET /projects/{id}/search?jql=', ['JQL search (limit ≤ 500)', 'Tìm bằng JQL (limit ≤ 500)']],
          ['GET /projects/{id}/issues/{number}', ['One issue', 'Một issue']],
          ['POST /projects/{id}/issues', ['Create (typeId + title required)', 'Tạo (cần typeId + title)']],
          ['PATCH /projects/{id}/issues/{number}', ['Update fields (send "version" to avoid overwriting, 409 on conflict)', 'Sửa trường (gửi "version" để không ghi đè, xung đột trả 409)']],
          ['POST …/issues/{number}/comments', ['Comment (bodyJson, TipTap JSON)', 'Bình luận (bodyJson, dạng TipTap JSON)']],
          ['POST …/issues/{number}/worklogs', ['Log minutes (1–1440)', 'Ghi phút (1–1440)']],
          ['GET /projects/{id}/export?format=csv&jql=', ['Download csv / xlsx / pdf', 'Tải csv / xlsx / pdf']],
        ],
      ),
      warn(
        'Treat tokens like passwords. Up to 20 active tokens per person; each shows when it was last used. **"Revoke"** stops a token immediately. A token only opens {{/api/v1/work/**}} and cannot create or revoke other tokens.',
        'Giữ token như mật khẩu. Mỗi người tối đa 20 token còn hiệu lực; mỗi token hiện lần dùng cuối. **"Revoke"** vô hiệu hoá ngay. Token chỉ mở được {{/api/v1/work/**}} và không tạo hay thu hồi token khác được.',
      ),
    ],
    related: ['github', 'import-export', 'issues-list-jql'],
  },

  {
    id: 'trash-audit',
    category: 'connect',
    title: { en: 'Trash, archive & audit log', vi: 'Thùng rác, lưu trữ & audit log' },
    summary: {
      en: 'Restore deleted issues, projects and workspaces, archive projects, and see who changed what administratively.',
      vi: 'Khôi phục issue, dự án và không gian đã xoá, lưu trữ dự án, và xem ai đã thay đổi gì ở mức quản trị.',
    },
    keywords: ['trash', 'restore', 'delete', 'archive', 'audit', 'log', 'undo', 'thung rac', 'khoi phuc', 'luu tru', 'nhat ky'],
    pages: [page('project', 'settings?tab=trash', 'Project trash', 'Thùng rác dự án'), page('workspace', 'settings?tab=audit', 'Audit log', 'Audit log')],
    blocks: [
      table(
        [['What was deleted', 'Thứ bị xoá'], ['Where to restore', 'Khôi phục ở đâu'], ['Who', 'Ai']],
        [
          [['Issue (with sub-tasks)', 'Issue (kèm sub-task)'], 'Project settings → Trash', ['Project admins', 'Admin dự án']],
          [['Project', 'Dự án'], 'Members & settings → Trash', ['Workspace owners/admins', 'Owner/Admin không gian']],
          [['Workspace', 'Không gian'], '/work → Workspaces → Recently deleted workspaces', ['Owner', 'Owner']],
        ],
      ),
      p(
        'Restoring an issue brings back its sub-tasks, comments, attachments and history. **"Delete permanently"** cannot be undone.',
        'Khôi phục issue sẽ mang lại sub-task, bình luận, file đính kèm và lịch sử. **"Delete permanently"** thì không hoàn tác được.',
      ),
      h('Archive a project', 'Lưu trữ dự án'),
      p(
        '**Project settings → Danger zone → Archive** hides a finished project from the sidebar without deleting anything. Members still find it in the **Archived** section of the workspace’s project list, and can unarchive it.',
        '**Project settings → Danger zone → Archive** ẩn dự án đã xong khỏi sidebar mà không xoá gì. Thành viên vẫn thấy ở mục **Archived** trong danh sách dự án của không gian, và có thể bỏ lưu trữ.',
      ),
      h('Audit log', 'Audit log'),
      p(
        '**Members & settings → Audit log** (owners and admins) records administrative changes: role changes and removals, deleted/restored/archived projects and workspaces, public links, GitHub connections, imports and issue deletions. Filter by project and action. Everyday edits are in each issue’s **History**.',
        '**Members & settings → Audit log** (Owner và Admin) ghi các thay đổi quản trị: đổi vai trò và xoá thành viên, dự án/không gian bị xoá/khôi phục/lưu trữ, link công khai, kết nối GitHub, lần import và xoá issue. Lọc theo dự án và loại hành động. Chỉnh sửa hằng ngày nằm trong **History** của từng issue.',
      ),
    ],
    related: ['workspaces', 'issues', 'public-links'],
  },

  // ═══ TRA CỨU ═══
  {
    id: 'apps',
    category: 'reference',
    title: { en: 'Desktop & mobile', vi: 'App desktop & điện thoại' },
    summary: {
      en: 'Use CT Work in the CuongThai desktop app or on your phone’s browser.',
      vi: 'Dùng CT Work trong app desktop CuongThai hoặc trên trình duyệt điện thoại.',
    },
    keywords: ['desktop', 'app', 'mac', 'windows', 'mobile', 'phone', 'iphone', 'ipad', 'android', 'ung dung', 'dien thoai'],
    pages: [page('global', '/download', 'Download the desktop app', 'Tải app desktop')],
    blocks: [
      h('Desktop app', 'App desktop'),
      list(
        ['Download the CuongThai desktop app (macOS, Windows, Linux) from **/download** and sign in with your usual account.', 'Tải app desktop CuongThai (macOS, Windows, Linux) ở **/download** và đăng nhập bằng tài khoản thường dùng.'],
        ['Open **CT Work** in the app’s sidebar. It is the same CT Work — every page, the AI assistant and this guide — plus system notifications.', 'Mở **CT Work** ở sidebar của app. Đó chính là CT Work — đủ mọi trang, trợ lý AI và hướng dẫn này — thêm thông báo hệ thống.'],
        ['Inside CT Work, [[⌘]] [[K]] opens CT Work’s own command palette; the app’s palette is still available from the title-bar button.', 'Trong CT Work, [[⌘]] [[K]] mở bảng lệnh riêng của CT Work; bảng lệnh của app vẫn mở được bằng nút trên thanh tiêu đề.'],
      ),
      h('Phone', 'Điện thoại'),
      list(
        ['Open cuongthai.com/work in your phone’s browser. The menu button at the top left opens the sidebar; panels such as this guide open full screen.', 'Mở cuongthai.com/work trên trình duyệt điện thoại. Nút menu góc trên bên trái mở sidebar; các ngăn như hướng dẫn này mở toàn màn hình.'],
        ['The iPhone/iPad app has a native **CT Work** tab: My Work, board with drag & drop, issue details, status/assignee changes, comments, and push notifications that open the right issue. It is in TestFlight (beta) now.', 'App iPhone/iPad có tab **CT Work** viết riêng: My Work, board kéo thả, chi tiết thẻ, đổi trạng thái/người làm, bình luận, và thông báo đẩy mở thẳng đúng thẻ. Hiện đang thử nghiệm qua TestFlight.'],
      ),
    ],
    related: ['notifications', 'shortcuts'],
  },

  {
    id: 'shortcuts',
    category: 'reference',
    title: { en: 'Keyboard shortcuts', vi: 'Phím tắt' },
    summary: {
      en: 'Every keyboard shortcut in CT Work, by page.',
      vi: 'Mọi phím tắt trong CT Work, theo từng trang.',
    },
    keywords: ['keyboard', 'shortcut', 'hotkey', 'key', 'phim tat', 'ban phim', 'cmd', 'ctrl'],
    blocks: [
      p(
        'On Windows and Linux use **Ctrl** where you see [[⌘]]. Single-letter shortcuts are ignored while you are typing in a text box.',
        'Trên Windows và Linux dùng **Ctrl** ở chỗ có [[⌘]]. Phím tắt một chữ không chạy khi bạn đang gõ trong ô nhập.',
      ),
      h('Everywhere', 'Mọi nơi'),
      kbd(
        [['⌘', 'K'], 'Command palette: search issues, projects, actions', 'Bảng lệnh: tìm issue, dự án, thao tác'],
        [['?'], 'Open or close this guide', 'Mở hoặc đóng hướng dẫn này'],
        [['Esc'], 'Close the open panel or dialog', 'Đóng ngăn hoặc hộp thoại đang mở'],
      ),
      h('Board & Backlog', 'Board & Backlog'),
      kbd(
        [['C'], 'Create issue', 'Tạo issue'],
        [['/'], 'Search the board / backlog', 'Tìm trên board / backlog'],
        [['⌘', 'click'], 'Select several issues (Backlog)', 'Chọn nhiều issue (Backlog)'],
        [['⇧', 'click'], 'Select a range (Backlog)', 'Chọn một dải (Backlog)'],
        [['Esc'], 'Clear the selection (Backlog)', 'Bỏ chọn (Backlog)'],
      ),
      h('Issues list', 'Danh sách issue'),
      kbd(
        [['J', 'K'], 'Move down / up (also ↓ / ↑)', 'Xuống / lên (cũng dùng ↓ / ↑)'],
        [['↵'], 'Open issue', 'Mở issue'],
        [['C'], 'Create issue', 'Tạo issue'],
        [['/'], 'Focus search or JQL', 'Nhảy vào ô tìm hoặc JQL'],
        [['Tab'], 'Accept JQL suggestion', 'Chọn gợi ý JQL'],
      ),
      h('Issues & comments', 'Issue & bình luận'),
      kbd(
        [['⌘', '↵'], 'Create (in Create issue) · Send comment', 'Tạo (trong Create issue) · Gửi bình luận'],
        [['↵'], 'Create from the title field', 'Tạo ngay từ ô tiêu đề'],
        [['@'], 'Mention someone in a comment', 'Nhắc tên ai đó trong bình luận'],
      ),
      h('Testing', 'Kiểm thử'),
      kbd(
        [['⌘', 'S'], 'Save test case', 'Lưu test case'],
        [['Tab'], 'Next cell in the steps table', 'Ô kế tiếp trong bảng bước'],
        [['⌘', '↵'], 'New step below', 'Thêm bước bên dưới'],
        [['J', 'K'], 'Move in a test cycle / between steps', 'Di chuyển trong test cycle / giữa các bước'],
        [['↵'], 'Execute test (cycle) · Actual result (run)', 'Chạy test (cycle) · Kết quả thực tế (lượt chạy)'],
        [['P', 'F', 'B', 'S'], 'Mark step Pass / Fail / Blocked / Skip', 'Đánh dấu bước Pass / Fail / Blocked / Skip'],
        [['A'], 'Jump to Actual result', 'Nhảy tới Actual result'],
        [['[', ']'], 'Previous / next test', 'Test trước / test sau'],
        [['⌘', 'V'], 'Paste a screenshot as evidence', 'Dán ảnh chụp làm bằng chứng'],
      ),
    ],
    related: ['board', 'issues-list-jql', 'testing'],
  },

  {
    id: 'faq',
    category: 'reference',
    title: { en: 'FAQ & troubleshooting', vi: 'Hỏi đáp & xử lý sự cố' },
    summary: {
      en: 'Quick answers to the problems people hit most: dragging, permissions, sprints, AI quota, invitations, GitHub and more.',
      vi: 'Trả lời nhanh các vấn đề hay gặp nhất: kéo thả, quyền, sprint, hạn mức AI, lời mời, GitHub và hơn nữa.',
    },
    keywords: ['faq', 'problem', 'error', 'cannot', 'can not', 'not working', 'help', 'troubleshoot', 'loi', 'khong duoc', 'sua loi', 'hoi dap'],
    blocks: [
      h('I can’t drag a card into a column', 'Không kéo được thẻ sang một cột'),
      p(
        'The workflow doesn’t allow that move (e.g. a Bug cannot jump from Open to Retest). Move it step by step, or ask an admin to allow the transition in **Project settings → Workflow → Transitions**. If you can’t drag anything, your role is Viewer, Teacher or Client.',
        'Workflow không cho phép bước đó (vd Bug không nhảy thẳng từ Open sang Retest). Chuyển từng bước, hoặc nhờ admin cho phép ở **Project settings → Workflow → Transitions**. Nếu không kéo được thẻ nào, vai trò của bạn là Viewer, Teacher hoặc Client.',
      ),
      h('Fields are greyed out / "You have view-only access"', 'Các trường bị mờ / "You have view-only access"'),
      p(
        'Your project role cannot edit. Ask a project admin to change it in **Project settings → Members**.',
        'Vai trò của bạn trong dự án không được sửa. Nhờ admin dự án đổi ở **Project settings → Members**.',
      ),
      h('No "Create sprint" / "Start sprint" / "Complete sprint" button', 'Không thấy nút "Create sprint" / "Start sprint" / "Complete sprint"'),
      list(
        ['Sprints are managed by project **Admins** only.', 'Chỉ **Admin** dự án quản lý sprint.'],
        ['Kanban projects have no sprints.', 'Dự án Kanban không có sprint.'],
        ['"… is still running" ⇒ complete the active sprint first. An empty sprint cannot start.', '"… is still running" ⇒ kết thúc sprint đang chạy trước. Sprint rỗng không bắt đầu được.'],
      ),
      h('The AI says I’m out of requests', 'AI báo hết lượt'),
      p(
        'Free accounts have a small number of AI requests per day (5 by default). Wait until tomorrow or **"Upgrade to Pro"**. If there is no **"Ask AI"** button at all, your role (Viewer, Teacher, Client) cannot use AI. "Temporarily unavailable" means the AI service is down — try again later.',
        'Tài khoản miễn phí có ít lượt AI mỗi ngày (mặc định 5). Chờ sang ngày mai hoặc **"Upgrade to Pro"**. Nếu hoàn toàn không có nút **"Ask AI"**, vai trò của bạn (Viewer, Teacher, Client) không dùng được AI. "Temporarily unavailable" nghĩa là dịch vụ AI đang gián đoạn — thử lại sau.',
      ),
      h('"Someone else just changed this issue"', '"Someone else just changed this issue"'),
      p(
        'Two people edited at the same time; the other person saved first. The latest version is shown — make your change again.',
        'Hai người sửa cùng lúc và người kia lưu trước. Màn hình đã hiện bản mới nhất — hãy sửa lại.',
      ),
      h('Burndown or velocity is empty', 'Burndown hoặc velocity trống'),
      p(
        'Burndown numbers are recorded once a day after the sprint starts — check again tomorrow. Velocity appears after your first completed sprint.',
        'Số liệu burndown ghi mỗi ngày một lần sau khi sprint bắt đầu — mai xem lại. Velocity chỉ có sau sprint hoàn thành đầu tiên.',
      ),
      h('An invitation link says expired or already used', 'Link mời báo hết hạn hoặc đã dùng'),
      p(
        'Email invitations work once and expire after 7 days; invite links expire after the chosen days or uses. Ask an admin for a new one.',
        'Lời mời qua email dùng một lần và hết hạn sau 7 ngày; link mời hết hạn theo số ngày hoặc số lượt đã đặt. Nhờ admin tạo link mới.',
      ),
      h('I can’t see a project', 'Không thấy một dự án'),
      p(
        'It is set to **"Only invited members"**, you are a workspace Guest, or it is archived (check **Archived** on the Projects page). Ask an admin to add you in Project settings → Members.',
        'Dự án đặt **"Only invited members"**, bạn là Guest của không gian, hoặc dự án đã lưu trữ (xem mục **Archived** ở trang Projects). Nhờ admin thêm bạn ở Project settings → Members.',
      ),
      h('The Tests tab says test management is not enabled', 'Tab Tests báo chưa bật quản lý kiểm thử'),
      p(
        'A project admin clicks **"Enable test management"** on that page.',
        'Admin dự án bấm **"Enable test management"** ngay trên trang đó.',
      ),
      h('GitHub commits don’t show up', 'Commit GitHub không hiện'),
      list(
        ['The commit message, branch or PR must contain the issue key, e.g. SWP-12.', 'Commit message, tên nhánh hoặc PR phải chứa mã issue, vd SWP-12.'],
        ['Check the webhook: Payload URL, Content type {{application/json}}, the current Secret, and the three events. Use **Recent Deliveries → Redeliver** in GitHub.', 'Kiểm tra webhook: Payload URL, Content type {{application/json}}, Secret hiện tại, và đủ ba sự kiện. Dùng **Recent Deliveries → Redeliver** trên GitHub.'],
      ),
      h('JQL error "No member …" or "No status …"', 'Lỗi JQL "No member …" hoặc "No status …"'),
      p(
        'Use the member’s **username** (not their display name), and put names with spaces in quotes: {{status = "In Review"}}.',
        'Dùng **username** của thành viên (không phải tên hiển thị), và để tên có khoảng trắng trong ngoặc kép: {{status = "In Review"}}.',
      ),
      h('I deleted something by mistake', 'Lỡ tay xoá nhầm'),
      p(
        'Issues, projects and workspaces go to a trash first — see "Trash, archive & audit log".',
        'Issue, dự án và không gian đều vào thùng rác trước — xem bài "Thùng rác, lưu trữ & audit log".',
      ),
      h('I don’t get emails', 'Không nhận được email'),
      p(
        'Check **My work → "Notification settings"** (mode Off? quiet hours?) and your spam folder. You are never notified about your own changes.',
        'Kiểm tra **My work → "Notification settings"** (chế độ Off? giờ im lặng?) và thư mục spam. Bạn không nhận thông báo về thay đổi của chính mình.',
      ),
      h('A WIP number is red', 'Số WIP chuyển đỏ'),
      p(
        'The column has more cards than its WIP limit. It is only a warning — finish something before pulling more work.',
        'Cột có nhiều thẻ hơn giới hạn WIP. Đây chỉ là cảnh báo — hãy làm xong việc trước khi nhận thêm.',
      ),
    ],
    related: ['roles', 'workflow', 'ai', 'github'],
  },
];

export const HELP_BY_ID: Record<string, HelpArticle> = Object.fromEntries(HELP_ARTICLES.map((a) => [a.id, a]));

/** Thứ tự đọc: theo nhóm, rồi theo thứ tự khai báo — dùng cho "bài trước / bài sau". */
export const HELP_ORDER: string[] = HELP_CATEGORIES.flatMap((c) => HELP_ARTICLES.filter((a) => a.category === c.id).map((a) => a.id));

// ─── Tìm kiếm ────────────────────────────────────────────────────

/** Bỏ dấu tiếng Việt + chữ thường: "Đóng góp" ⇒ "dong gop". */
export function foldText(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase();
}

function blockText(b: HelpBlock): string[] {
  switch (b.t) {
    case 'p': case 'h': case 'tip': case 'warn': return [b.text.en, b.text.vi];
    case 'steps': case 'list': return b.items.flatMap((i) => [i.en, i.vi]);
    case 'table': return [...b.head, ...b.rows.flat()].flatMap((c) => [c.en, c.vi]);
    case 'kbd': return b.items.flatMap((i) => [i.keys.join(' '), i.label.en, i.label.vi]);
    case 'code': return [b.text];
  }
}

interface Indexed { id: string; title: string; head: string; body: string }
let INDEX: Indexed[] | null = null;
function index(): Indexed[] {
  if (!INDEX) {
    INDEX = HELP_ARTICLES.map((a) => ({
      id: a.id,
      title: foldText(`${a.title.en} ${a.title.vi}`),
      head: foldText(`${a.summary.en} ${a.summary.vi} ${a.keywords.join(' ')}`),
      body: foldText(a.blocks.flatMap(blockText).join(' ').replace(/\*\*|\{\{|\}\}|\[\[|\]\]/g, '')),
    }));
  }
  return INDEX;
}

/** Tìm bài: mọi từ phải xuất hiện đâu đó; tiêu đề nặng hơn từ khoá, từ khoá nặng hơn thân bài. */
export function searchHelp(query: string): HelpArticle[] {
  const words = foldText(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored: Array<{ id: string; score: number }> = [];
  for (const x of index()) {
    let score = 0;
    let ok = true;
    for (const w of words) {
      const s = (x.title.includes(w) ? 10 : 0) + (x.head.includes(w) ? 4 : 0) + (x.body.includes(w) ? 1 : 0);
      if (!s) { ok = false; break; }
      score += s;
    }
    if (ok) scored.push({ id: x.id, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => HELP_BY_ID[s.id]);
}

/** Đoạn trích quanh từ tìm đầu tiên (theo ngôn ngữ đang đọc) để hiện dưới kết quả. */
export function helpSnippet(a: HelpArticle, query: string, lang: HelpLang, max = 150): string {
  const words = foldText(query).split(/\s+/).filter(Boolean);
  const texts = a.blocks.flatMap((b) => {
    switch (b.t) {
      case 'p': case 'h': case 'tip': case 'warn': return [b.text[lang]];
      case 'steps': case 'list': return b.items.map((i) => i[lang]);
      case 'table': return b.rows.map((r) => r.map((c) => c[lang]).join(' · '));
      case 'kbd': return b.items.map((i) => `${i.keys.join('+')} ${i.label[lang]}`);
      case 'code': return [b.text];
    }
  }).map((s) => s.replace(/\*\*|\{\{|\}\}|\[\[|\]\]/g, ''));
  for (const t of texts) {
    const f = foldText(t);
    const i = words.map((w) => f.indexOf(w)).find((n) => n >= 0);
    if (i !== undefined) {
      let start = Math.max(0, i - 40);
      // Bắt đầu ở đầu một từ, không cắt giữa chữ.
      if (start > 0) {
        const sp = t.indexOf(' ', start);
        if (sp >= 0 && sp < i) start = sp + 1;
      }
      const s = t.slice(start, start + max);
      return `${start > 0 ? '…' : ''}${s}${start + max < t.length ? '…' : ''}`;
    }
  }
  return a.summary[lang];
}

// ─── Bài theo trang đang mở ──────────────────────────────────────

const SETTINGS_TAB_ARTICLE: Record<string, string> = {
  members: 'roles', automation: 'automation', github: 'github', share: 'public-links',
  import: 'import-export', trash: 'trash-audit', danger: 'trash-audit', fields: 'issues',
};

/**
 * Bài hợp với trang đang mở (nút "?" ở header, phím ?). Nhận pathname và
 * chuỗi query (vd "?tab=automation") — đọc lúc bấm nên không cần useSearchParams.
 */
export function helpArticleForPath(pathname: string, search = ''): string {
  const parts = pathname.split('/').filter(Boolean); // ['work', ws, key, view, ...]
  const tab = new URLSearchParams(search).get('tab') ?? '';
  if (parts[0] !== 'work' || parts.length === 1) return 'getting-started';
  if (parts[1] === 'developer') return 'api-tokens';
  if (parts[1] === 'invite') return 'workspaces';
  if (parts[1] === 'share') return 'public-links';
  if (parts[1] === 'search') return 'global-search';
  if (parts.length === 2) return 'templates';
  if (parts[2] === 'settings') return tab === 'audit' || tab === 'trash' ? 'trash-audit' : 'workspaces';
  const view = parts[3] ?? 'board';
  switch (view) {
    case 'board': return 'board';
    case 'backlog': return 'backlog-sprints';
    case 'timeline': return 'timeline';
    case 'releases': return 'releases';
    case 'list': return 'issues-list-jql';
    case 'issue': return 'issues';
    case 'tests': return 'testing';
    case 'dashboards': return 'filters-dashboards';
    case 'reports': return tab === 'time' || tab === 'capacity' ? 'time-capacity' : 'reports';
    case 'settings': return SETTINGS_TAB_ARTICLE[tab] ?? 'workflow';
    default: return 'getting-started';
  }
}
