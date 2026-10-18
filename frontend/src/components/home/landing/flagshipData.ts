/**
 * Dữ liệu khối "Sản phẩm chủ lực" trên trang chủ — CT Work và AI Code (13/10/2026).
 *
 * ⚠️ MỌI con số và tính năng ở đây phải ĐO/ĐỐI CHIẾU được trong mã — một tính
 * năng ghi ra mà bấm vào không có còn tệ hơn không ghi. Cách đo lúc viết:
 *   • 68 màn hình CT Work  — `grep -c "{ mau:" desktop/src/renderer/features/web/tuyenCtWork.ts`
 *   • 123 lệnh cho agent    — `COMMANDS.length` trong src/services/work/toolRegistry/index.ts
 *   • 243 bảng dữ liệu      — `grep -cE "^model Work" prisma/schema.prisma`
 *   • 8 model AI Code       — `MODEL_AGENT` trong src/services/agent/models.ts khi cổng riêng đang bật (prod)
 *   • 46 công cụ AI Code    — số `name: '…'` khác nhau trong src/services/agent/tools.ts (sổ công cụ
 *                             gửi cho model: 41 chạy trong app + 5 chạy ở máy chủ). ĐỪNG đếm `case` trong
 *                             desktop/src/main/agent/tools.ts — tệp đó chỉ chứa một phần (ra 37, thiếu).
 * Đổi số thì đo lại bằng đúng lệnh đó, đừng ước.
 */

export interface FlagshipGroup { icon: string; title: string; items: string[] }
export interface FlagshipStat { value: string; label: string }
export interface FlagshipStrength { title: string; body: string }
export interface FlagshipAction { href: string; label: string; primary?: boolean; external?: boolean }
export interface FlagshipMedia {
  /** Video demo (R2/CDN), 1080p60. Chưa có ⇒ chỉ hiện poster. */
  video?: string;
  /** Bản 720p60 nhẹ hơn — dùng khi màn hẹp hoặc người dùng bật tiết kiệm dữ liệu. */
  videoNhe?: string;
  poster: string;
  /** Mốc chương trong video — bấm để tua. */
  chapters?: { t: number; label: string }[];
}

export interface Flagship {
  id: 'ct-work' | 'ai-code';
  logo: string;
  kicker: string;
  name: string;
  pitch: string;
  fits: string[];
  stats: FlagshipStat[];
  media: FlagshipMedia;
  actions: FlagshipAction[];
  groups: FlagshipGroup[];
  strengths: FlagshipStrength[];
}

export function getFlagships(vi: boolean): Flagship[] {
  return [
    {
      id: 'ct-work',
      logo: '/images/ct-work/ct-work.svg',
      kicker: vi ? 'Quản lý dự án · đồ án · lớp học' : 'Projects · capstones · classrooms',
      name: 'CT Work',
      pitch: vi
        ? 'Một không gian làm việc kiểu Jira dựng cho cách sinh viên, giảng viên và team phần mềm Việt Nam thật sự làm việc — từ board và sprint tới hồ sơ SRS, báo cáo test theo mẫu FPT, lớp học và AI agent làm thẻ cùng bạn.'
        : 'A Jira-style workspace built around how Vietnamese students, lecturers and software teams actually work — boards and sprints, SRS documents, FPT-format test reports, classrooms, and AI agents that pick up cards with you.',
      fits: vi
        ? ['Nhóm đồ án SWP · SWR · SWT · SEP', 'Giảng viên & mentor', 'Team dự án ở công ty', 'Freelancer làm với khách']
        : ['Student capstone teams', 'Lecturers & mentors', 'Company project teams', 'Freelancers with clients'],
      stats: [
        { value: '68', label: vi ? 'màn hình' : 'screens' },
        { value: '123', label: vi ? 'lệnh cho AI agent (MCP)' : 'agent commands (MCP)' },
        { value: '3', label: vi ? 'nơi dùng: web · app · app riêng' : 'places: web · app · standalone' },
      ],
      media: {
        /* Video dựng từ thao tác THẬT (Remotion, ~/Documents/video-san-pham), người dùng ghép nhạc (13/10/2026).
           1:04, 1080p60 H.264 (SSIM 0,996 so với bản gốc HEVC). Mốc chương dò bằng so khung hình với bản dựng. */
        video: 'https://media.cuongthai.com/videos/flagship/ct-work-v2-1080p60.mp4',
        videoNhe: 'https://media.cuongthai.com/videos/flagship/ct-work-v2-720p60.mp4',
        poster: '/images/flagship/ct-work-poster.jpg',
        chapters: vi
          ? [{ t: 5.5, label: 'Việc của tôi' }, { t: 10.2, label: 'Sprint & board' }, { t: 20.9, label: 'SRS & sơ đồ' }, { t: 29.9, label: 'Kiểm thử' }, { t: 34.8, label: 'Hỏi AI' }, { t: 42.5, label: 'App desktop' }, { t: 49.1, label: 'Agent & MCP' }]
          : [{ t: 5.5, label: 'My work' }, { t: 10.2, label: 'Sprint & board' }, { t: 20.9, label: 'SRS & diagrams' }, { t: 29.9, label: 'Testing' }, { t: 34.8, label: 'Ask AI' }, { t: 42.5, label: 'Desktop app' }, { t: 49.1, label: 'Agents & MCP' }],
      },
      actions: [
        { href: '/work', label: vi ? 'Mở CT Work' : 'Open CT Work', primary: true },
        { href: '/download/ct-work', label: vi ? 'Tải app CT Work' : 'Get the CT Work app' },
        { href: '/tech-trends/xay-dung-ct-work-cong-cu-quan-ly-du-an-kieu-jira', label: vi ? 'Câu chuyện xây dựng' : 'How it was built' },
      ],
      groups: [
        {
          icon: 'kanban',
          title: vi ? 'Lập kế hoạch & theo dõi' : 'Plan & track',
          items: vi
            ? ['Board kéo-thả, backlog, danh sách', 'Sprint, timeline (Gantt), phát hành', 'JQL tìm thẻ, bộ lọc lưu sẵn', 'Đồng hồ bấm giờ, worklog, khối lượng việc']
            : ['Drag-and-drop board, backlog, list', 'Sprints, timeline (Gantt), releases', 'JQL search and saved filters', 'Timers, worklogs, workload'],
        },
        {
          icon: 'school',
          title: vi ? 'Đồ án & lớp học' : 'Capstones & classrooms',
          items: vi
            ? ['Mẫu dự án SWP391 · SWR302 · SWT301 · SEP490', 'Hub giảng viên, lớp, cổng nộp bài', 'Đóng góp từng thành viên, báo cáo tuần', 'Luyện bảo vệ, soát yêu cầu bằng AI']
            : ['SWP391 · SWR302 · SWT301 · SEP490 templates', 'Lecturer hub, classes, submission portal', 'Per-member contribution, weekly reports', 'Defense practice, AI requirement review'],
        },
        {
          icon: 'doc',
          title: vi ? 'Yêu cầu & tài liệu' : 'Requirements & docs',
          items: vi
            ? ['SRS có cấu trúc: use case, actor, business rule', 'Ma trận truy vết (RTM), hồ sơ Wiegers', 'Docs soạn chung thời gian thực', 'Diagram Studio: sơ đồ sinh từ dữ liệu']
            : ['Structured SRS: use cases, actors, rules', 'Traceability matrix (RTM), Wiegers set', 'Real-time collaborative docs', 'Diagram Studio: diagrams from your data'],
        },
        {
          icon: 'test',
          title: vi ? 'Kiểm thử & chất lượng' : 'Testing & quality',
          items: vi
            ? ['Test case kiểu Xray, chu kỳ test', 'Báo cáo unit/integration theo mẫu FPT', 'Review/inspection, baseline', 'Chấm độ khớp spec của thẻ']
            : ['Xray-style test cases and cycles', 'FPT-format unit/integration reports', 'Reviews, inspections, baselines', 'Spec-fidelity scoring for cards'],
        },
        {
          icon: 'agent',
          title: vi ? 'AI trong dự án' : 'AI in the project',
          items: vi
            ? ['Hỏi AI về dự án đang mở (⌘J)', 'AI agent là thành viên thật, có owner', 'Kết nối Claude Code qua MCP bằng một lệnh', 'Agent làm xong ⇒ thẻ vào Review, người duyệt']
            : ['Ask AI about the open project (⌘J)', 'AI agents as real members with an owner', 'Connect Claude Code over MCP in one command', 'Agent “done” lands in Review for a human'],
        },
        {
          icon: 'people',
          title: vi ? 'Cộng tác & giao tiếp' : 'Collaboration',
          items: vi
            ? ['Kênh chat dự án, luồng, nhắc tên', 'Cuộc họp, biên bản, việc phát sinh', 'Planning poker, retro board, OKR', 'Thông báo realtime, lịch .ics']
            : ['Project chat channels and threads', 'Meetings, minutes, action items', 'Planning poker, retros, OKRs', 'Real-time notifications, .ics calendar'],
        },
        {
          icon: 'briefcase',
          title: vi ? 'Làm với khách hàng' : 'Client delivery',
          items: vi
            ? ['Cổng khách, UAT, duyệt prototype', 'Change request, RAID, phê duyệt', 'Service desk với SLA', 'Tài chính dự án, chế độ thuyết trình']
            : ['Client portal, UAT, prototype review', 'Change requests, RAID, approvals', 'Service desk with SLAs', 'Project finance, presentation mode'],
        },
        {
          icon: 'plug',
          title: vi ? 'Kết nối & nhập liệu' : 'Integrations & import',
          items: vi
            ? ['Microsoft 365 · Google · Notion · Slack · GitLab', 'Nhập từ Trello · Asana · Jira · CSV', 'Biểu mẫu → thẻ, kênh ngoài → đề xuất', 'API token, xuất/nhập dự án, 2FA']
            : ['Microsoft 365 · Google · Notion · Slack · GitLab', 'Import from Trello · Asana · Jira · CSV', 'Forms → cards, external channels → intake', 'API tokens, project export/import, 2FA'],
        },
      ],
      strengths: vi
        ? [
            { title: 'Nói đúng ngôn ngữ đồ án FPT', body: 'Mẫu dự án, hồ sơ SRS, báo cáo test 5.1/5.2/5.3 theo đúng biểu mẫu của trường — không phải tự chế từ Jira.' },
            { title: 'AI làm việc như một thành viên', body: 'Agent có tài khoản riêng, có người chịu trách nhiệm, bị chặn ở máy chủ khỏi xoá, duyệt hay gửi khách.' },
            { title: 'Ở mọi nơi, cùng một dữ liệu', body: 'Web, app CuongThai và app CT Work riêng — sửa ở đâu cũng đồng bộ tức thì cho cả nhóm.' },
            { title: 'Song ngữ, miễn phí cho sinh viên', body: 'Mỗi thành viên tự chọn Tiếng Việt hoặc English; chữ AI viết ra theo ngôn ngữ của dự án.' },
          ]
        : [
            { title: 'Speaks the FPT capstone language', body: 'Project templates, SRS sets and 5.1/5.2/5.3 test reports in the school’s own formats — not a Jira workaround.' },
            { title: 'AI that works like a teammate', body: 'Agents have their own account and an accountable owner, and the server blocks them from deleting, approving or contacting clients.' },
            { title: 'Everywhere, one dataset', body: 'Web, the CuongThai app and the standalone CT Work app — edits sync live for the whole team.' },
            { title: 'Bilingual, free for students', body: 'Each member picks Vietnamese or English; AI-written text follows the project language.' },
          ],
    },
    {
      id: 'ai-code',
      logo: '/logos/ai-code.svg',
      kicker: vi ? 'Agent lập trình trong app desktop' : 'A coding agent in the desktop app',
      name: 'AI Code',
      pitch: vi
        ? 'Một agent lập trình chạy ngay trên máy bạn: đọc cả dự án, sửa nhiều tệp, chạy lệnh trong terminal thật, mở trình duyệt để tự kiểm, rồi dừng lại xin phép trước mọi việc có rủi ro.'
        : 'A coding agent that runs on your own machine: it reads the whole project, edits many files, runs commands in a real terminal, opens a browser to check its own work — and stops to ask before anything risky.',
      fits: vi
        ? ['Sinh viên làm lab & đồ án', 'Lập trình viên làm dự án thật', 'Người mới cần giải thích từng bước', 'Ai muốn agent mà không cài CLI']
        : ['Students doing labs & capstones', 'Developers on real projects', 'Beginners who want each step explained', 'Anyone who wants an agent without a CLI'],
      stats: [
        { value: '46', label: vi ? 'công cụ cho agent' : 'agent tools' },
        { value: '8', label: vi ? 'model để chọn theo việc' : 'models to pick per task' },
        { value: '3', label: vi ? 'hệ điều hành' : 'operating systems' },
      ],
      media: {
        video: 'https://media.cuongthai.com/videos/flagship/ai-code-v2-1080p60.mp4',
        videoNhe: 'https://media.cuongthai.com/videos/flagship/ai-code-v2-720p60.mp4',
        poster: '/images/flagship/ai-code-poster.jpg',
        chapters: vi
          ? [{ t: 3.5, label: 'Giao việc' }, { t: 9.3, label: 'Đọc dự án' }, { t: 16.6, label: 'Kế hoạch' }, { t: 21.2, label: 'Xin phép' }, { t: 25.1, label: 'Chạy test' }, { t: 31.3, label: 'Tự kiểm' }, { t: 35.9, label: 'Kết quả' }, { t: 52.4, label: 'Chọn model' }]
          : [{ t: 3.5, label: 'The task' }, { t: 9.3, label: 'Reading' }, { t: 16.6, label: 'Plan' }, { t: 21.2, label: 'Permission' }, { t: 25.1, label: 'Tests' }, { t: 31.3, label: 'Self-check' }, { t: 35.9, label: 'Result' }, { t: 52.4, label: 'Models' }],
      },
      actions: [
        { href: '/download', label: vi ? 'Tải app' : 'Get the app', primary: true },
        { href: '/tech-trends/ai-code-agent-lap-trinh-trong-app-desktop', label: vi ? 'Câu chuyện xây dựng' : 'How it was built' },
      ],
      groups: [
        {
          icon: 'files',
          title: vi ? 'Hiểu & sửa mã' : 'Read & edit code',
          items: vi
            ? ['Đọc cả dự án, tìm bằng glob/grep', 'Sửa nhiều chỗ, nhiều tệp một lượt', 'Xem diff trước khi nhận thay đổi', 'Đọc PDF, Word/Excel, notebook, ảnh, zip']
            : ['Reads the whole project with glob/grep', 'Multi-spot, multi-file edits in one pass', 'Review the diff before accepting', 'Reads PDF, Word/Excel, notebooks, images, zip'],
        },
        {
          icon: 'terminal',
          title: vi ? 'Chạy & kiểm' : 'Run & verify',
          items: vi
            ? ['Terminal thật (PTY), gõ được mật khẩu', 'Lệnh nền: dev server chạy song song', 'PATH thật từ shell — thấy node, docker, psql', 'Đọc lỗi rồi tự sửa tới khi xanh']
            : ['A real terminal (PTY), password prompts work', 'Background commands: dev servers alongside', 'Your real shell PATH — node, docker, psql', 'Reads failures and fixes until green'],
        },
        {
          icon: 'globe',
          title: vi ? 'Trình duyệt cho agent' : 'A browser for the agent',
          items: vi
            ? ['Mở trang, bấm, gõ như người dùng', 'Chụp màn hình, đọc console', 'Tải tài liệu, đọc nhiều trang một lúc', 'Tự kiểm giao diện vừa sửa']
            : ['Opens pages, clicks and types like a user', 'Screenshots and console logs', 'Downloads docs, reads many pages at once', 'Checks the UI it just changed'],
        },
        {
          icon: 'git',
          title: vi ? 'Git & bàn giao' : 'Git & hand-off',
          items: vi
            ? ['git status/diff/commit có kiểm soát', 'Tạo pull request', 'Worktree tách riêng cho việc thử', 'Ghi kết quả thẳng vào Ghi chú']
            : ['Controlled git status/diff/commit', 'Opens pull requests', 'Isolated worktrees for experiments', 'Writes results straight into Notes'],
        },
        {
          icon: 'plug',
          title: vi ? 'Mở rộng' : 'Extend it',
          items: vi
            ? ['Cắm server MCP (kể cả CT Work)', 'Kho kỹ năng (skills) dùng lại được', 'Agent phụ chia việc lớn', 'Bộ nhớ dự án giữa các phiên']
            : ['Plug in MCP servers (CT Work included)', 'A reusable skills library', 'Sub-agents for big tasks', 'Project memory across sessions'],
        },
        {
          icon: 'shield',
          title: vi ? 'An toàn & chi phí' : 'Safety & cost',
          items: vi
            ? ['5 chế độ quyền: lập kế hoạch → hỏi trước → tự sửa', 'Chặn lệnh phá huỷ, cấm thư mục nhạy cảm', 'Ví dùng AI theo ngày, trần chi phí', 'Cổng bận ⇒ tự chuyển model tương đương']
            : ['5 permission modes: plan → ask → auto-edit', 'Blocks destructive commands and secret dirs', 'Daily AI wallet with cost caps', 'Busy gateway ⇒ automatic switch to an equivalent model'],
        },
      ],
      strengths: vi
        ? [
            { title: 'Chạy trên máy bạn, với mã của bạn', body: 'Không tải dự án lên đâu cả; agent làm việc trong thư mục bạn chọn, bằng công cụ bạn đã cài.' },
            { title: 'Chọn model theo số đo, không theo quảng cáo', body: 'Mặc định là model rẻ nhất TRONG vòng lặp gọi tool — đo thật rẻ hơn model “cao cấp” 7 lần cho cùng việc.' },
            { title: 'Tự kiểm trước khi báo xong', body: 'Chạy test, mở trình duyệt, đọc console — báo “xong” kèm bằng chứng chứ không kèm hy vọng.' },
            { title: 'Nối thẳng vào CT Work', body: 'Nhận thẻ, làm, ghi worklog và chuyển sang Review qua MCP — người duyệt vẫn là bạn.' },
          ]
        : [
            { title: 'Runs on your machine, with your code', body: 'Nothing is uploaded; the agent works in the folder you choose, with the tools you already have.' },
            { title: 'Models picked by measurement', body: 'The default is the cheapest model inside the tool loop — measured 7× cheaper than the “premium” one for the same job.' },
            { title: 'Checks before it says done', body: 'Runs tests, opens the browser, reads the console — “done” comes with evidence, not hope.' },
            { title: 'Wired into CT Work', body: 'Picks up a card, does it, logs work and moves it to Review over MCP — you still approve.' },
          ],
    },
  ];
}
