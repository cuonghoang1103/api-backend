/**
 * Danh mục "Dự án mẫu" của /about/nhan-du-an — các gói sản phẩm cụ thể để khách
 * chọn thay vì chỉ 4 loại chung (web/app/tool/ai).
 *
 * ⛔ Luật của tệp này:
 *  · KHÔNG ghi giá — chủ site chưa đưa bảng giá; chi phí báo trong đề xuất.
 *  · Thời gian là KHOẢNG tuần, ước lượng sơ bộ cho MỘT kỹ sư chính, chốt sau
 *    khảo sát. Không phải cam kết.
 *  · `demos` CHỈ trỏ tới sản phẩm thật đang chạy trong repo này. Đường dẫn đã
 *    kiểm có thư mục trong `frontend/src/app/` (04/10/2026). Gói chưa có demo
 *    thì `demos: []` + `noDemoNote` — KHÔNG bịa. Bề mặt TMĐT (/shop, /cart…)
 *    đang bị tắt bằng cờ tính năng nên KHÔNG được dùng làm demo.
 *  · Không số khách, không lời khen, không logo.
 *
 * `id` đi vào phiếu yêu cầu (trường `source`, xem RequestForm) — đổi `id` thì
 * phiếu cũ vẫn giữ id cũ, nên chỉ thêm id mới, đừng đổi tên id đã phát hành.
 */
import type { ProjectRequestProductType } from '@/lib/api';

export type Bi = readonly [string, string];

export interface PackageDemo {
  href: string;
  label: Bi;
  /** Ghi chú trung thực: cần đăng nhập, chỉ gần giống, v.v. */
  note?: Bi;
  external?: boolean;
}

export interface ProjectPackage {
  /** Ngắn, a-z0-9-, ≤ 40 ký tự — được gửi kèm phiếu. */
  id: string;
  name: Bi;
  /** Một dòng tóm tắt hiện trên thẻ. */
  tagline: Bi;
  forWho: Bi;
  problem: Bi;
  standard: Bi[];
  optional: Bi[];
  tech: string[];
  /** Khoảng tuần [ít nhất, nhiều nhất] — ước lượng sơ bộ. */
  weeks: readonly [number, number];
  deliverables: Bi[];
  demos: PackageDemo[];
  /** Bắt buộc khi `demos` rỗng — nói thẳng là chưa có demo. */
  noDemoNote?: Bi;
  /** Loại sản phẩm tự chọn trong phiếu khi khách bấm "Chọn gói này". */
  productTypes: ProjectRequestProductType[];
}

const COMMON_DELIVERABLES: Bi[] = [
  ['Mã nguồn trong kho Git đứng tên bạn', 'Source code in a Git repository you own'],
  ['Tài liệu vận hành và hướng dẫn sử dụng', 'Operations runbook and user guide'],
];

export const PACKAGES: ProjectPackage[] = [
  {
    id: 'landing',
    name: ['Trang giới thiệu doanh nghiệp', 'Company website & landing page'],
    tagline: ['Vài trang giới thiệu, nhanh, chuẩn SEO, tự sửa nội dung.', 'A few fast, SEO-ready pages you can edit yourself.'],
    forWho: [
      'Doanh nghiệp nhỏ, studio, phòng khám, văn phòng dịch vụ cần một địa chỉ web đáng tin.',
      'Small businesses, studios, clinics and service offices that need a credible web presence.',
    ],
    problem: [
      'Khách tìm trên Google không thấy, hoặc thấy một trang cũ, chậm, không xem được trên điện thoại.',
      'Customers can’t find you on Google, or find an old, slow page that breaks on phones.',
    ],
    standard: [
      ['Tối đa ~6 trang: trang chủ, dịch vụ, giới thiệu, liên hệ…', 'Up to ~6 pages: home, services, about, contact…'],
      ['Responsive, sáng/tối, đạt WCAG 2.2 AA', 'Responsive, light/dark, WCAG 2.2 AA'],
      ['SEO kỹ thuật: sitemap, thẻ meta, ảnh chia sẻ mạng xã hội', 'Technical SEO: sitemap, meta tags, social share images'],
      ['Biểu mẫu liên hệ gửi về email', 'Contact form delivered to email'],
    ],
    optional: [
      ['Song ngữ Việt – Anh', 'Vietnamese – English'],
      ['Trang quản trị để tự sửa nội dung, đăng tin', 'Admin area to edit content and post news'],
      ['Blog / tin tức', 'Blog / news'],
    ],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    weeks: [2, 4],
    deliverables: [
      ...COMMON_DELIVERABLES,
      ['Tên miền và hosting đứng tên bạn', 'Domain and hosting in your name'],
    ],
    demos: [
      { href: '/about/studio', label: ['Chính trang Studio này', 'This Studio site itself'] },
    ],
    productTypes: ['WEB'],
  },
  {
    id: 'ban-hang-dat-lich',
    name: ['Web bán hàng / đặt lịch', 'Online store / booking site'],
    tagline: ['Giỏ hàng, thanh toán, hoặc đặt lịch hẹn có xác nhận.', 'Cart and payments, or appointment booking with confirmations.'],
    forWho: [
      'Cửa hàng, tiệm dịch vụ, cơ sở đào tạo muốn nhận đơn hoặc lịch hẹn trực tuyến.',
      'Shops, service businesses and training centres taking orders or bookings online.',
    ],
    problem: [
      'Đơn hàng và lịch hẹn đang nhận qua tin nhắn, dễ sót, trùng giờ, khó đối soát.',
      'Orders and bookings arrive by chat — easy to miss, double-book, and hard to reconcile.',
    ],
    standard: [
      ['Danh mục sản phẩm/dịch vụ, tìm kiếm, lọc', 'Product/service catalogue, search, filters'],
      ['Giỏ hàng hoặc lịch trống theo khung giờ', 'Cart, or availability by time slot'],
      ['Thanh toán qua cổng trong nước (VietQR / PayOS…)', 'Payment via a local gateway (VietQR / PayOS…)'],
      ['Email xác nhận, trang quản trị đơn/lịch', 'Confirmation emails, order/booking admin'],
    ],
    optional: [
      ['Mã giảm giá, chương trình khuyến mãi', 'Discount codes and promotions'],
      ['Nhắc lịch qua Zalo / Telegram / email', 'Reminders via Zalo / Telegram / email'],
      ['Kết nối đơn vị vận chuyển', 'Shipping-provider integration'],
    ],
    tech: ['Next.js', 'Node.js / Express', 'PostgreSQL', 'Prisma'],
    weeks: [6, 10],
    deliverables: [
      ...COMMON_DELIVERABLES,
      ['Kịch bản kiểm thử luồng thanh toán', 'Payment-flow test scenarios'],
    ],
    demos: [],
    noDemoNote: [
      'Chưa có demo công khai. Phần giỏ hàng/thanh toán của site này đã được dựng nhưng đang tắt (chưa đăng ký TMĐT), nên không mở cho xem.',
      'No public demo. This site’s cart/checkout was built but is switched off (e-commerce registration pending), so it isn’t open to view.',
    ],
    productTypes: ['WEB'],
  },
  {
    id: 'lms',
    name: ['Hệ thống học trực tuyến (LMS)', 'Online learning platform (LMS)'],
    tagline: ['Khoá học, bài giảng video, bài kiểm tra, theo dõi tiến độ.', 'Courses, video lessons, quizzes and progress tracking.'],
    forWho: [
      'Trung tâm đào tạo, phòng nhân sự đào tạo nội bộ, người dạy muốn có nền tảng riêng.',
      'Training centres, HR teams running internal training, educators wanting their own platform.',
    ],
    problem: [
      'Tài liệu rải rác trên Drive và nhóm chat; không biết ai đã học tới đâu, ai đã đạt.',
      'Material is scattered across Drive and chat groups; no one knows who has learned what or passed.',
    ],
    standard: [
      ['Khoá học → chương → bài; video, văn bản, tệp đính kèm', 'Course → chapter → lesson; video, text, attachments'],
      ['Bài kiểm tra trắc nghiệm chấm tự động', 'Auto-graded multiple-choice quizzes'],
      ['Tiến độ theo học viên, báo cáo cho người quản lý', 'Per-learner progress, reports for managers'],
      ['Phân quyền học viên / giảng viên / quản trị', 'Learner / instructor / admin roles'],
    ],
    optional: [
      ['Phòng thi thử có giờ, đề ngẫu nhiên', 'Timed mock exams with randomised papers'],
      ['Chứng chỉ hoàn thành', 'Completion certificates'],
      ['Mã kích hoạt khoá học', 'Course activation codes'],
      ['Gia sư AI trả lời theo nội dung bài', 'AI tutor answering from lesson content'],
    ],
    tech: ['Next.js', 'Node.js / Express', 'PostgreSQL', 'Cloudflare R2'],
    weeks: [8, 14],
    deliverables: [
      ...COMMON_DELIVERABLES,
      ['Hướng dẫn soạn khoá học cho giảng viên', 'Course-authoring guide for instructors'],
    ],
    demos: [
      { href: '/courses', label: ['Khoá học', 'Courses'] },
      { href: '/academy', label: ['Academy theo ngành', 'Academy by major'] },
      { href: '/exam', label: ['Phòng thi thử', 'Mock exam room'], note: ['Một số đề cần đăng nhập', 'Some papers need sign-in'] },
    ],
    productTypes: ['WEB'],
  },
  {
    id: 'quan-ly-noi-bo',
    name: ['Phần mềm quản lý nội bộ', 'Internal management software'],
    tagline: ['CRM, kho, nhân sự — thay bảng tính bằng một hệ thống.', 'CRM, inventory, HR — a system instead of spreadsheets.'],
    forWho: [
      'Doanh nghiệp 5–200 người đang vận hành bằng Excel và nhóm chat.',
      'Businesses of 5–200 people running on Excel and chat groups.',
    ],
    problem: [
      'Nhiều bản Excel lệch nhau, không biết ai sửa gì, báo cáo cuối tháng làm tay mất nhiều ngày.',
      'Diverging Excel copies, no record of who changed what, month-end reports built by hand over days.',
    ],
    standard: [
      ['Khảo sát quy trình hiện trạng và mong muốn', 'As-is and to-be process analysis'],
      ['Một phân hệ chính (khách hàng, kho, hoặc nhân sự)', 'One core module (customers, inventory, or HR)'],
      ['Nhập/xuất Excel, báo cáo, nhật ký thao tác', 'Excel import/export, reports, audit log'],
      ['Phân quyền theo vai trò', 'Role-based access'],
    ],
    optional: [
      ['Thêm phân hệ', 'Additional modules'],
      ['Chuyển dữ liệu cũ', 'Legacy data migration'],
      ['Đăng nhập một lần (SSO), tích hợp kế toán', 'Single sign-on (SSO), accounting integration'],
    ],
    tech: ['Next.js', 'Node.js / Express', 'PostgreSQL', 'Prisma'],
    weeks: [8, 16],
    deliverables: [
      ...COMMON_DELIVERABLES,
      ['Sơ đồ quy trình và mô hình dữ liệu', 'Process maps and data model'],
      ['Buổi đào tạo người dùng', 'User training session'],
    ],
    demos: [
      {
        href: '/finance',
        label: ['MoneyFlow — quản lý tài chính', 'MoneyFlow — finance management'],
        note: ['Cần đăng nhập. Là quản lý tài chính cá nhân, không phải CRM/kho', 'Sign-in required. Personal finance, not a CRM/inventory'],
      },
      {
        href: '/work',
        label: ['CT Work — quản lý công việc', 'CT Work — work management'],
        note: ['Cần đăng nhập', 'Sign-in required'],
      },
    ],
    productTypes: ['TOOL'],
  },
  {
    id: 'quan-ly-du-an',
    name: ['Cổng quản lý dự án kiểu Jira', 'Jira-style project portal'],
    tagline: ['Bảng việc, sprint, phân quyền, cổng xem cho khách hàng.', 'Boards, sprints, permissions, a client-facing view.'],
    forWho: [
      'Công ty phần mềm, agency, đội nội bộ muốn công cụ riêng thay vì thuê bao theo đầu người.',
      'Software firms, agencies and internal teams wanting their own tool instead of per-seat subscriptions.',
    ],
    problem: [
      'Việc nằm rải ở chat và bảng tính; khách hàng không thấy tiến độ nếu không hỏi.',
      'Work lives in chat and spreadsheets; clients can’t see progress without asking.',
    ],
    standard: [
      ['Không gian làm việc → dự án → việc (issue)', 'Workspace → project → issue'],
      ['Bảng Kanban, sprint, trạng thái tuỳ chỉnh', 'Kanban board, sprints, custom statuses'],
      ['Bình luận, đính kèm, thông báo', 'Comments, attachments, notifications'],
      ['Phân quyền thành viên, liên kết chia sẻ chỉ xem', 'Member permissions, read-only share links'],
    ],
    optional: [
      ['Báo cáo tiến độ, biểu đồ burndown', 'Progress reports, burndown charts'],
      ['Tích hợp GitLab/GitHub, lịch .ics', 'GitLab/GitHub integration, .ics calendar'],
      ['Trợ lý AI tóm tắt và soát yêu cầu', 'AI assistant to summarise and review requirements'],
    ],
    tech: ['Next.js', 'Node.js / Express', 'PostgreSQL', 'Socket.IO'],
    weeks: [8, 14],
    deliverables: [
      ...COMMON_DELIVERABLES,
      ['Mẫu quy trình dự án cấu hình sẵn', 'Pre-configured project workflow template'],
    ],
    demos: [
      { href: '/work', label: ['CT Work', 'CT Work'], note: ['Cần đăng nhập', 'Sign-in required'] },
    ],
    productTypes: ['WEB', 'TOOL'],
  },
  {
    id: 'tro-ly-ai-rag',
    name: ['Trợ lý AI trên tài liệu riêng (RAG)', 'AI assistant on your own documents (RAG)'],
    tagline: ['Hỏi đáp trên quy trình, hợp đồng, tài liệu nội bộ — có trích nguồn.', 'Q&A over your procedures, contracts and internal docs — with citations.'],
    forWho: [
      'Bộ phận chăm sóc khách hàng, nhân sự, pháp chế, kỹ thuật có nhiều tài liệu phải tra.',
      'Customer support, HR, legal and technical teams that look things up in many documents.',
    ],
    problem: [
      'Nhân viên mất thời gian tìm câu trả lời trong hàng trăm trang; câu trả lời mỗi người một kiểu.',
      'Staff spend time hunting through hundreds of pages; answers differ person to person.',
    ],
    standard: [
      ['Nạp tài liệu (PDF, Word, trang web), chia đoạn, tìm kiếm theo nghĩa', 'Ingest documents (PDF, Word, web pages), chunking, semantic search'],
      ['Trả lời kèm trích dẫn nguồn', 'Answers with source citations'],
      ['Bộ đánh giá bằng câu hỏi thật trước khi chọn model', 'Evaluation set of real questions before picking a model'],
      ['Trần chi phí theo ngày và theo người dùng', 'Daily and per-user cost ceilings'],
    ],
    optional: [
      ['Gắn vào website, Zalo, Telegram', 'Embed in a website, Zalo, Telegram'],
      ['Phân quyền tài liệu theo phòng ban', 'Per-department document permissions'],
      ['Chạy model trên máy chủ riêng', 'Self-hosted models'],
    ],
    tech: ['Node.js', 'PostgreSQL + pgvector', 'LLM API (OpenAI / Anthropic)'],
    weeks: [4, 8],
    deliverables: [
      ...COMMON_DELIVERABLES,
      ['Bộ câu hỏi đánh giá và kết quả đo', 'Evaluation question set and measured results'],
    ],
    demos: [
      {
        href: '/chat',
        label: ['Trợ lý AI chat', 'AI chat assistant'],
        note: ['Cần đăng nhập. Là trợ lý chat chung, chưa phải RAG trên tài liệu riêng của khách', 'Sign-in required. A general chat assistant, not RAG on a client’s own documents'],
      },
    ],
    productTypes: ['AI'],
  },
  {
    id: 'app-di-dong',
    name: ['Ứng dụng di động iOS / Android', 'iOS / Android mobile app'],
    tagline: ['App dùng chung API với hệ thống web, phát hành thử trước khi lên kho.', 'An app sharing one API with your web system, beta-tested before store release.'],
    forWho: [
      'Doanh nghiệp đã có (hoặc đang làm) hệ thống web và cần trải nghiệm trên điện thoại.',
      'Businesses that have (or are building) a web system and need a phone experience.',
    ],
    problem: [
      'Người dùng chủ yếu ở trên điện thoại; bản web trên di động không đủ (thông báo đẩy, máy ảnh, ngoại tuyến).',
      'Users live on their phones; the mobile web isn’t enough (push notifications, camera, offline).',
    ],
    standard: [
      ['Đăng nhập, các màn hình nghiệp vụ chính', 'Sign-in and the core business screens'],
      ['Thông báo đẩy', 'Push notifications'],
      ['Xử lý khi mất mạng', 'Offline handling'],
      ['Hồ sơ đăng kho và chính sách quyền riêng tư', 'Store listing and privacy policy'],
    ],
    optional: [
      ['Phiên bản Android', 'Android version'],
      ['Widget, đăng nhập Apple/Google', 'Widgets, Sign in with Apple/Google'],
      ['Phiên bản iPad / macOS', 'iPad / macOS version'],
    ],
    tech: ['Swift / SwiftUI', 'Kotlin', 'REST API dùng chung'],
    weeks: [8, 14],
    deliverables: [
      ...COMMON_DELIVERABLES,
      ['Bản phát hành thử (TestFlight) và hồ sơ đăng kho', 'Beta build (TestFlight) and store submission package'],
    ],
    demos: [],
    noDemoNote: [
      'Chưa có link công khai. App iOS của site đang phát hành thử qua TestFlight; có thể xem trực tiếp trong buổi trao đổi.',
      'No public link. This site’s iOS app is in TestFlight beta; it can be shown live during a call.',
    ],
    productTypes: ['APP'],
  },
  {
    id: 'app-desktop',
    name: ['App desktop đa nền tảng', 'Cross-platform desktop app'],
    tagline: ['Một mã nguồn chạy macOS, Windows, Linux, tự cập nhật.', 'One codebase for macOS, Windows and Linux, with auto-update.'],
    forWho: [
      'Đội cần công cụ chạy trên máy tính: làm việc với tệp cục bộ, ngoại tuyến, hoặc tích hợp phần cứng.',
      'Teams needing a computer-side tool: local files, offline work or hardware integration.',
    ],
    problem: [
      'Bản web không truy cập được tệp và thiết bị trên máy; cài đặt, cập nhật thủ công từng máy.',
      'A web app can’t reach local files and devices; installs and updates are done machine by machine.',
    ],
    standard: [
      ['Bản cài cho macOS, Windows, Linux', 'Installers for macOS, Windows, Linux'],
      ['Tự cập nhật qua kênh phát hành', 'Auto-update via a release channel'],
      ['Đồng bộ với hệ thống web qua API', 'Sync with the web system via API'],
      ['Quy trình dựng – phát hành tự động (CI)', 'Automated build-and-release pipeline (CI)'],
    ],
    optional: [
      ['Ký số bản cài (code signing)', 'Installer code signing'],
      ['Chạy ngoại tuyến hoàn toàn', 'Fully offline mode'],
      ['AI chạy trên máy', 'On-device AI'],
    ],
    tech: ['Electron', 'React', 'TypeScript', 'GitHub Actions'],
    weeks: [6, 12],
    deliverables: [
      ...COMMON_DELIVERABLES,
      ['Kênh phát hành và quy trình ra bản mới', 'Release channel and release procedure'],
    ],
    demos: [
      { href: '/download', label: ['App desktop CuongThai (có AI Code)', 'CuongThai desktop app (with AI Code)'] },
    ],
    productTypes: ['APP', 'TOOL'],
  },
  {
    id: 'tu-dong-hoa-api',
    name: ['Tự động hoá quy trình & tích hợp API', 'Process automation & API integration'],
    tagline: ['Nối các hệ thống đang dùng, bỏ thao tác chép tay lặp lại.', 'Connect the systems you use and drop repetitive copy-paste.'],
    forWho: [
      'Doanh nghiệp dùng nhiều phần mềm rời rạc (bán hàng, kế toán, chat, email) và chép dữ liệu qua lại bằng tay.',
      'Businesses using many disconnected tools (sales, accounting, chat, email) and copying data between them by hand.',
    ],
    problem: [
      'Cùng một dữ liệu nhập lại ở nhiều nơi, chậm và sai; không ai được báo khi có việc cần xử lý.',
      'The same data is re-entered in several places, slowly and with errors; no one is alerted when something needs action.',
    ],
    standard: [
      ['Khảo sát luồng dữ liệu giữa các hệ thống', 'Map data flows between systems'],
      ['Tích hợp 2–3 hệ thống qua API / webhook', 'Integrate 2–3 systems via API / webhooks'],
      ['Thông báo qua Telegram / email', 'Alerts via Telegram / email'],
      ['Nhật ký, thử lại khi lỗi, cảnh báo khi hỏng', 'Logging, retries on failure, alerts when broken'],
    ],
    optional: [
      ['Lịch chạy định kỳ, báo cáo tự động', 'Scheduled jobs, automatic reports'],
      ['Bước xử lý bằng AI (phân loại, trích xuất)', 'AI steps (classification, extraction)'],
      ['Bảng theo dõi trạng thái', 'Status dashboard'],
    ],
    tech: ['Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
    weeks: [3, 8],
    deliverables: [
      ...COMMON_DELIVERABLES,
      ['Sơ đồ tích hợp và danh sách khoá/quyền truy cập', 'Integration diagram and list of keys/access rights'],
    ],
    demos: [],
    noDemoNote: [
      'Chưa có demo công khai — các tích hợp của site này chạy ở phía máy chủ, không có trang để xem.',
      'No public demo — this site’s integrations run server-side, with no page to view.',
    ],
    productTypes: ['TOOL'],
  },
];

export const findPackage = (id: string | null | undefined): ProjectPackage | undefined =>
  id ? PACKAGES.find((p) => p.id === id) : undefined;
