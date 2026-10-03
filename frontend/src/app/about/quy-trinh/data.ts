/**
 * Dữ liệu trang /about/quy-trinh — "Quy trình nhận & làm dự án".
 *
 * ─── LUẬT CỦA FILE NÀY (giống luật đầu `app/about/page.tsx`) ───────────────
 *   · KHÔNG số liệu bịa: không "N khách hàng", không logo, không lời khen.
 *     Trang này mô tả QUY TRÌNH tôi áp dụng, không khoe thành tích.
 *   · Tiêu chuẩn tham chiếu phải là tài liệu CÓ THẬT, ghi đúng mã hiệu.
 *   · Link "Học ở đâu" chỉ được trỏ vào slug có thật:
 *       - môn trường  → content/academy/<MÃ>.mjs   → /academy/courses/<slug>
 *       - khoá học    → content/courses/<slug>.mjs  → /courses/<slug>
 *     Thêm link mới thì kiểm slug trong đúng file đó trước.
 *   · Ví dụ (`example`) chỉ kể chuyện ĐÃ XẢY RA thật trên cuongthai.com (có
 *     ghi trong CLAUDE.md của repo) hoặc mô tả CÁCH ÁP DỤNG cho LabFlow AI —
 *     không bịa kết quả.
 *
 * ─── BẢN 2 (01/10/2026) ─────────────────────────────────────────────────────
 *   · 21 giai đoạn. `n` KHÔNG gõ tay — tính bằng vị trí trong mảng, nên chèn
 *     giai đoạn mới chỉ cần đặt đúng chỗ. 15 slug cũ giữ nguyên (link ngoài).
 *   · Mỗi giai đoạn có thêm: đội tham gia (`team`), RACI theo bộ phận, đầu
 *     vào, entry/exit criteria, checklist, mẫu tài liệu (`templates` →
 *     `frontend/public/quy-trinh/mau/*.md`), sai lầm hay gặp, ví dụ thật.
 *   · Mẫu dự án CT Work (`content/quy-trinh/client-project-template.json`)
 *     được DỰNG từ file này + `content/quy-trinh/viec-theo-giai-doan.mjs`
 *     bằng `npx tsx content/quy-trinh/dung-mau-du-an.mts` — sửa ở đây thì
 *     dựng lại JSON, đừng sửa JSON bằng tay.
 *   · Chi tiết từng bộ phận + RACI tổng: `departments.ts`.
 *
 * Chuỗi song ngữ dùng bộ đôi [vi, en] cho gọn; component đọc bằng `pick()`.
 */

export type Bi = readonly [vi: string, en: string];
export const pick = (b: Bi, lang: 'vi' | 'en'): string => (lang === 'en' ? b[1] : b[0]);

export interface LearnLink {
  href: string;
  label: string;
  kind: 'academy' | 'course';
}

export interface Standard {
  name: string;
  note: Bi;
}

export type PhaseKey = 'discover' | 'define' | 'design' | 'build' | 'verify' | 'ship' | 'run';

export interface Phase {
  key: PhaseKey;
  label: Bi;
  color: string;
}

/**
 * Vai trò trong ma trận RACI.
 *   R — Responsible: người trực tiếp làm.
 *   A — Accountable: người chịu trách nhiệm giải trình / duyệt cuối. MỖI hoạt
 *       động có ĐÚNG MỘT A. Nếu không có R riêng thì A tự làm.
 *   C — Consulted: được hỏi ý kiến TRƯỚC khi làm (hai chiều).
 *   I — Informed: được báo SAU khi xong (một chiều).
 */
export type RaciRole = 'R' | 'A' | 'C' | 'I';

/**
 * Bộ phận / chức năng. Đây là VAI, không phải số người: dự án nhỏ một người
 * có thể kiêm nhiều vai, nhưng mỗi vai vẫn có đầu ra riêng và — khi có thể —
 * người làm (R) tách khỏi người duyệt (A). Chi tiết: `departments.ts`.
 */
export type DeptKey =
  | 'sales'
  | 'ba'
  | 'ux'
  | 'arch'
  | 'pm'
  | 'dev'
  | 'qa'
  | 'sec'
  | 'devops'
  | 'infra'
  | 'data'
  | 'support'
  | 'legal'
  | 'pmo'
  | 'client';

export const DEPT_KEYS: readonly DeptKey[] = [
  'sales', 'ba', 'ux', 'arch', 'pm', 'dev', 'qa', 'sec', 'devops', 'infra', 'data', 'support', 'legal', 'pmo', 'client',
];

/** Tên ngắn của bộ phận (bản đầy đủ ở `departments.ts`). */
export const DEPT_NAMES: Record<DeptKey, Bi> = {
  sales: ['Kinh doanh & Tiền bán hàng', 'Sales & Presales'],
  ba: ['Phân tích nghiệp vụ (BA)', 'Business Analysis (BA)'],
  ux: ['Thiết kế UX/UI', 'UX/UI Design'],
  arch: ['Kiến trúc giải pháp', 'Solution Architecture'],
  pm: ['Quản lý dự án / Scrum Master', 'Project Management / Scrum Master'],
  dev: ['Phát triển (FE · BE · Mobile)', 'Engineering (FE · BE · Mobile)'],
  qa: ['Đảm bảo chất lượng (QA/QC)', 'Quality Assurance (QA/QC)'],
  sec: ['Bảo mật ứng dụng (AppSec)', 'Application Security (AppSec)'],
  devops: ['DevOps / SRE', 'DevOps / SRE'],
  infra: ['Hạ tầng & Mạng', 'Infrastructure & Network'],
  data: ['Dữ liệu & AI', 'Data & AI'],
  support: ['Hỗ trợ & Chăm sóc khách hàng', 'Support & Customer Success'],
  legal: ['Pháp lý & Tài chính', 'Legal & Finance'],
  pmo: ['Văn phòng quản lý dự án (PMO)', 'Project Management Office (PMO)'],
  client: ['Khách hàng (Product Owner / nhà tài trợ)', 'Client (Product Owner / sponsor)'],
};

/** Mẫu tài liệu tải về / xem được (bản 2). */
export interface DocTemplate {
  name: Bi;
  href?: string;
}

/** Một dòng trong ma trận RACI của giai đoạn. */
export interface RaciRow {
  activity: Bi;
  roles: Partial<Record<DeptKey, RaciRole>>;
}

export interface Stage {
  n: number;
  /** Slug CỐ ĐỊNH, không dấu — sẽ thành /about/quy-trinh/<slug> ở bản 2.
   *  Đã công bố thì KHÔNG đổi (link ngoài trỏ vào). */
  slug: string;
  phase: PhaseKey;
  title: Bi;
  short: Bi;
  goal: Bi;
  activities: Bi[];
  deliverables: Bi[];
  client: Bi[];
  tools: string[];
  standards: Standard[];
  learn: LearnLink[];
  /** Cổng chất lượng — điều kiện để sang giai đoạn sau (tóm tắt một câu). */
  gate: Bi;

  // ── Trường TUỲ CHỌN cho bản 2 (trang con /about/quy-trinh/<slug>) ──
  /** Bộ phận tham gia + vai trò trong giai đoạn này. */
  team?: { dept: DeptKey; role: Bi }[];
  /** Bộ phận / vai trò phụ trách — dạng chữ, TỰ SINH từ `team`. */
  departments?: Bi[];
  /** Ma trận RACI: hoạt động → bộ phận → R/A/C/I. */
  raci?: RaciRow[];
  /** Đầu vào cần có (đầu ra = `deliverables`). */
  inputs?: Bi[];
  /** Điều kiện vào / ra chi tiết (cổng chất lượng đầy đủ). */
  entryCriteria?: Bi[];
  exitCriteria?: Bi[];
  /** Checklist làm việc trong giai đoạn. */
  checklist?: Bi[];
  /** Mẫu tài liệu của giai đoạn. */
  templates?: DocTemplate[];
  /** Sai lầm hay gặp. */
  pitfalls?: Bi[];
  /** Ví dụ thật (vd áp dụng cho LabFlow AI / cuongthai.com). */
  example?: Bi;
}

/** Đường dẫn trang chi tiết của giai đoạn (bản 2). */
export const stageHref = (s: Stage): string => `/about/quy-trinh/${s.slug}`;
/** Bật khi các trang con /about/quy-trinh/<slug> đã tồn tại. */
export const STAGE_PAGES_ENABLED = true;

// ─── Link học ───────────────────────────────────────────────────────────────
const A = (slug: string, label: string): LearnLink => ({ href: `/academy/courses/${slug}`, label, kind: 'academy' });
const C = (slug: string, label: string): LearnLink => ({ href: `/courses/${slug}`, label, kind: 'course' });

export const LEARN = {
  SWE201c: A('introduction-to-software-engineering', 'SWE201c · Software Engineering'),
  SWR302: A('software-requirements', 'SWR302 · Software Requirements'),
  SWD392: A('software-architecture-and-design', 'SWD392 · Architecture & Design'),
  DBI202: A('introduction-to-databases', 'DBI202 · Databases'),
  SWT301: A('software-testing', 'SWT301 · Software Testing'),
  PRJ301: A('java-web-application-development', 'PRJ301 · Java Web'),
  SWP391: A('software-development-project', 'SWP391 · Dev Project'),
  SEP490: A('sep490-se-capstone-project', 'SEP490 · Capstone'),
  PMG201c: A('project-management', 'PMG201c · Project Management'),
  LAW102: A('law102-business-law-and-ethics-fundamentals', 'LAW102 · Business Law & Ethics'),
  IAA202: A('iaa202-risk-management-in-information-systems', 'IAA202 · IS Risk Management'),
  ITE302c: A('it-and-data-ethics', 'ITE302c · Ethics in IT'),
  SSG104: A('communication-and-in-group-working-skills', 'SSG104 · Communication & Teamwork'),
  agile: C('agile-teamwork', 'Agile & Teamwork'),
  api: C('api-design', 'API Design'),
  websec: C('web-security', 'Web Security'),
  auth: C('authentication', 'Authentication'),
  testing: C('testing', 'Testing'),
  docker: C('docker', 'Docker'),
  deploy: C('deploy-vps', 'Deploy VPS'),
  nginx: C('nginx', 'Nginx'),
  gha: C('github-actions', 'GitHub Actions'),
  obs: C('observability-monitoring', 'Observability'),
  sysdesign: C('system-design', 'System Design'),
  ux: C('ux-ui-for-developers', 'UX/UI for Developers'),
  threat: C('threat-modeling', 'Threat Modeling'),
  devsecops: C('devsecops', 'DevSecOps'),
  incident: C('incident-response', 'Incident Response'),
  perf: C('performance-load-testing', 'Performance & Load'),
  iac: C('infrastructure-as-code', 'Infrastructure as Code'),
  privacy: C('privacy-data-law', 'Privacy & Data Law'),
  payments: C('online-payments', 'Online Payments'),
  seo: C('seo-analytics', 'SEO & Analytics'),
  solo: C('solo-product', 'Solo Product'),
  llm: C('llm-apps', 'LLM Apps'),
  rag: C('rag-vector-search', 'RAG & Vector Search'),
  agents: C('ai-agents', 'AI Agents'),
  rn: C('react-native', 'React Native'),
  spring: C('spring-boot', 'Spring Boot'),
  node: C('nodejs', 'Node.js'),
  next: C('nextjs', 'Next.js'),
  react: C('react', 'React'),
  ts: C('typescript', 'TypeScript'),
  pg: C('postgresql', 'PostgreSQL'),
  prisma: C('prisma-orm', 'Prisma ORM'),
  git: C('git', 'Git'),
  linux: C('linux-bash', 'Linux & Bash'),
  net: C('networking-for-developers', 'Networking'),
  selfhost: C('self-hosting', 'Self-hosting'),
  tailwind: C('tailwind-css', 'Tailwind CSS'),
  fullstack: C('fullstack-project', 'Full-stack Project'),
  dataeng: C('data-engineering', 'Data Engineering'),
  netsec: C('network-security', 'Network Security'),
} satisfies Record<string, LearnLink>;

const L = LEARN;

// ─── Mẫu tài liệu (frontend/public/quy-trinh/mau/<file>.md) ────────────────
const T = (file: string, vi: string, en: string): DocTemplate => ({ name: [vi, en], href: `/quy-trinh/mau/${file}.md` });

export const DOCS = {
  intake: T('phieu-tiep-nhan-yeu-cau', 'Phiếu tiếp nhận yêu cầu', 'Project intake form'),
  qualification: T('checklist-danh-gia-phu-hop', 'Bảng đánh giá phù hợp & go/no-go', 'Qualification scorecard & go/no-go'),
  ba: T('tai-lieu-phan-tich-nghiep-vu', 'Tài liệu phân tích nghiệp vụ (BA)', 'Business analysis document'),
  proposal: T('de-xuat-giai-phap', 'Đề xuất giải pháp & ước lượng', 'Solution proposal & estimate'),
  msa: T('hop-dong-khung', 'Hợp đồng khung (MSA) — mẫu tham khảo', 'Master services agreement — reference'),
  sow: T('sow', 'Phạm vi công việc (SOW)', 'Statement of work (SOW)'),
  kickoff: T('bien-ban-kick-off', 'Biên bản họp kick-off', 'Kick-off meeting minutes'),
  srs: T('srs', 'Đặc tả yêu cầu phần mềm (SRS)', 'Software requirements specification (SRS)'),
  usability: T('kiem-thu-kha-dung', 'Kế hoạch & kết quả kiểm thử khả dụng', 'Usability test plan & findings'),
  sdd: T('sdd', 'Tài liệu thiết kế phần mềm (SDD)', 'Software design description (SDD)'),
  adr: T('adr', 'Ghi quyết định kiến trúc (ADR)', 'Architecture decision record (ADR)'),
  pmp: T('ke-hoach-du-an', 'Kế hoạch quản lý dự án', 'Project management plan'),
  risk: T('so-dang-ky-rui-ro', 'Sổ đăng ký rủi ro', 'Risk register'),
  weekly: T('bao-cao-tuan', 'Báo cáo tiến độ tuần', 'Weekly status report'),
  cr: T('phieu-yeu-cau-thay-doi', 'Phiếu yêu cầu thay đổi (CR)', 'Change request form'),
  migration: T('ke-hoach-chuyen-du-lieu', 'Kế hoạch chuyển dữ liệu & đối soát', 'Data migration & reconciliation plan'),
  testPlan: T('ke-hoach-kiem-thu', 'Kế hoạch kiểm thử', 'Test plan'),
  testCase: T('test-case', 'Bộ test case', 'Test cases'),
  testReport: T('bao-cao-kiem-thu', 'Báo cáo kiểm thử', 'Test summary report'),
  security: T('checklist-bao-mat', 'Checklist bảo mật trước phát hành', 'Pre-release security checklist'),
  runbook: T('runbook-trien-khai', 'Runbook triển khai & quay lui', 'Deployment & rollback runbook'),
  releaseNotes: T('release-notes', 'Ghi chú phát hành (release notes)', 'Release notes'),
  uat: T('bien-ban-nghiem-thu-uat', 'Kế hoạch UAT & biên bản nghiệm thu', 'UAT plan & acceptance certificate'),
  handover: T('bien-ban-ban-giao', 'Biên bản bàn giao', 'Handover record'),
  retro: T('retrospective', 'Retrospective & bài học kinh nghiệm', 'Retrospective & lessons learned'),
  closure: T('bien-ban-dong-du-an', 'Biên bản đóng dự án', 'Project closure record'),
  sla: T('sla-bao-tri', 'Thoả thuận mức dịch vụ (SLA) bảo trì', 'Maintenance SLA'),
  postmortem: T('bao-cao-su-co-postmortem', 'Báo cáo sự cố (postmortem)', 'Incident postmortem'),
  decommission: T('ke-hoach-ngung-he-thong', 'Kế hoạch ngừng hệ thống & biên bản xoá dữ liệu', 'Decommissioning plan & data deletion record'),
  nda: T('nda', 'Thoả thuận bảo mật thông tin hai chiều (NDA) — mẫu tham khảo', 'Mutual non-disclosure agreement (NDA) — reference'),
  dpa: T('dpa', 'Thoả thuận xử lý dữ liệu cá nhân (DPA) — mẫu tham khảo', 'Data processing agreement (DPA) — reference'),
  quote: T('bao-gia', 'Báo giá — mẫu tham khảo', 'Quotation — reference'),
  warranty: T('chinh-sach-bao-hanh', 'Chính sách bảo hành sau bàn giao', 'Post-delivery warranty policy'),
  liquidation: T('bien-ban-thanh-ly-hop-dong', 'Biên bản thanh lý hợp đồng — mẫu tham khảo', 'Contract liquidation record — reference'),
  comms: T('ke-hoach-giao-tiep', 'Kế hoạch giao tiếp & leo thang', 'Communication & escalation plan'),
} satisfies Record<string, DocTemplate>;

const D = DOCS;

// ─── Nhóm giai đoạn ─────────────────────────────────────────────────────────
export const PHASES: Phase[] = [
  { key: 'discover', label: ['Khám phá', 'Discover'], color: '#6366f1' },
  { key: 'define', label: ['Xác định', 'Define'], color: '#8b5cf6' },
  { key: 'design', label: ['Thiết kế', 'Design'], color: '#d946ef' },
  { key: 'build', label: ['Xây dựng', 'Build'], color: '#0ea5e9' },
  { key: 'verify', label: ['Kiểm chứng', 'Verify'], color: '#f43f5e' },
  { key: 'ship', label: ['Bàn giao', 'Ship'], color: '#10b981' },
  { key: 'run', label: ['Vận hành', 'Run'], color: '#f59e0b' },
];

export const phaseOf = (k: PhaseKey): Phase => PHASES.find((p) => p.key === k)!;

// ─── 21 giai đoạn (n = vị trí trong mảng) ───────────────────────────────────
type StageInput = Omit<Stage, 'n' | 'departments'>;

const STAGES_RAW: StageInput[] = [
  // ══ 00 ═════════════════════════════════════════════════════════════════
  {
    slug: 'tiep-nhan',
    phase: 'discover',
    title: ['Tiếp nhận yêu cầu & tư vấn ban đầu', 'Intake & first consultation'],
    short: ['Phiếu yêu cầu · buổi tư vấn', 'Request form · first call'],
    goal: [
      'Ghi nhận yêu cầu vào một phiếu có mã, hiểu khách đang gặp vấn đề gì và vì sao là bây giờ — trước khi hứa bất cứ điều gì.',
      'Log the request as a numbered ticket and understand the problem and why it matters now — before promising anything.',
    ],
    activities: [
      ['Nhận yêu cầu qua biểu mẫu trên web hoặc email, cấp mã phiếu (vd YC-2026-0001), xác nhận đã nhận trong 1 ngày làm việc', 'Receive the request via the web form or email, assign a ticket ID (e.g. YC-2026-0001), acknowledge within 1 business day'],
      ['Ghi nhận sự đồng ý xử lý dữ liệu cá nhân của người liên hệ (thời điểm, phiên bản thông báo) trước khi lưu', 'Record the contact’s consent to personal-data processing (timestamp, notice version) before storing anything'],
      ['Buổi gọi 30–45 phút: bối cảnh, người dùng, mục tiêu kinh doanh, hạn chót, khoảng ngân sách', '30–45 min call: context, users, business goal, deadline, budget range'],
      ['Hỏi "vì sao" nhiều lần để tách nhu cầu thật khỏi giải pháp khách đã nghĩ sẵn', 'Ask "why" repeatedly to separate the real need from a pre-imagined solution'],
      ['Ký NDA (thoả thuận bảo mật) trước khi khách chia sẻ tài liệu hoặc dữ liệu nhạy cảm', 'Sign an NDA before the client shares sensitive documents or data'],
    ],
    deliverables: [
      ['Phiếu tiếp nhận yêu cầu có mã', 'Numbered intake ticket'],
      ['Biên bản buổi tư vấn (1 trang): vấn đề, mục tiêu, ràng buộc, câu hỏi còn mở', 'One-page call notes: problem, goals, constraints, open questions'],
      ['NDA đã ký (khi cần)', 'Signed NDA (when needed)'],
    ],
    client: [
      ['Kể vấn đề bằng lời của mình, cho ví dụ thật', 'Describe the problem in their own words, with real examples'],
      ['Chỉ ra người ra quyết định và người sẽ dùng sản phẩm', 'Name the decision-maker and the actual users'],
    ],
    tools: ['Biểu mẫu yêu cầu trên web', 'Email', 'Google Meet / Zoom', 'CT Work'],
    standards: [
      { name: 'PMI — PMBOK® Guide 7th ed.', note: ['Miền hiệu suất "Stakeholders": xác định & hiểu các bên liên quan', 'Stakeholders performance domain: identify and understand stakeholders'] },
      { name: 'ISO 21502:2020', note: ['Hướng dẫn quản lý dự án — các hoạt động trước và lúc khởi động dự án', 'Project management guidance — pre-project and initiation activities'] },
      { name: 'Luật Bảo vệ dữ liệu cá nhân 2025 (91/2025/QH15) và Nghị định 356/2025/NĐ-CP', note: ['Bảo vệ dữ liệu cá nhân — sự đồng ý của chủ thể dữ liệu trước khi xử lý', 'Personal data protection — data-subject consent before processing'] },
    ],
    learn: [L.SWE201c, L.SSG104, L.solo, L.privacy],
    gate: ['Phiếu đủ thông tin tối thiểu; hai bên thống nhất vấn đề cần giải và đồng ý chuyển sang đánh giá phù hợp.', 'Ticket has the minimum information; both sides agree on the problem and move to qualification.'],
    team: [
      { dept: 'sales', role: ['đầu mối tiếp nhận, chủ trì buổi tư vấn', 'single point of contact, leads the call'] },
      { dept: 'ba', role: ['dự buổi tư vấn, ghi nhận nhu cầu và câu hỏi mở', 'joins the call, captures needs and open questions'] },
      { dept: 'arch', role: ['tham vấn khi có câu hỏi khả thi kỹ thuật', 'consulted on technical feasibility questions'] },
      { dept: 'legal', role: ['NDA, thông báo xử lý dữ liệu', 'NDA, data-processing notice'] },
      { dept: 'client', role: ['mô tả vấn đề, chỉ ra người quyết định', 'describes the problem, names the decision-maker'] },
    ],
    raci: [
      { activity: ['Tiếp nhận yêu cầu, cấp mã phiếu, xác nhận đã nhận', 'Receive request, assign ID, acknowledge'], roles: { sales: 'A', pm: 'I' } },
      { activity: ['Ghi nhận đồng ý xử lý dữ liệu & ký NDA', 'Record consent & sign NDA'], roles: { legal: 'A', sales: 'R', client: 'C' } },
      { activity: ['Buổi tư vấn đầu tiên', 'First consultation call'], roles: { sales: 'A', ba: 'R', arch: 'C', client: 'C' } },
      { activity: ['Tóm tắt vấn đề & câu hỏi mở, gửi khách xác nhận', 'Summarise problem & open questions for client confirmation'], roles: { sales: 'A', ba: 'R', client: 'C' } },
    ],
    inputs: [
      ['Yêu cầu của khách (biểu mẫu, email, người giới thiệu)', 'Client request (form, email, referral)'],
      ['Thông tin công khai về tổ chức của khách', 'Public information about the client organisation'],
    ],
    entryCriteria: [
      ['Có kênh liên hệ hợp lệ và người gửi đã đồng ý xử lý dữ liệu liên hệ', 'A valid contact channel and the sender’s consent to process contact data'],
      ['Yêu cầu thuộc loại sản phẩm được nhận (web, mobile, tool nội bộ, AI, IoT)', 'The request is a product type we take on (web, mobile, internal tool, AI, IoT)'],
    ],
    exitCriteria: [
      ['Phiếu yêu cầu có mã, đủ các trường bắt buộc', 'Intake ticket has an ID and all mandatory fields'],
      ['Biên bản buổi tư vấn đã gửi và được khách xác nhận qua email', 'Call notes sent and confirmed by the client by email'],
      ['Đã biết người ra quyết định, người dùng cuối và hạn chót mong muốn', 'Decision-maker, end users and target deadline are known'],
      ['NDA đã ký nếu khách sẽ chia sẻ thông tin mật', 'NDA signed if confidential information will be shared'],
    ],
    checklist: [
      ['Phản hồi khách trong 1 ngày làm việc', 'Replied to the client within 1 business day'],
      ['Ghi nguồn yêu cầu (web, giới thiệu, sự kiện…)', 'Source of the request recorded (web, referral, event…)'],
      ['Kiểm trùng với phiếu cũ của cùng tổ chức', 'Checked for duplicates from the same organisation'],
      ['Lưu bằng chứng đồng ý xử lý dữ liệu (thời điểm, phiên bản thông báo)', 'Consent evidence stored (timestamp, notice version)'],
      ['Gửi biên bản tóm tắt trong 24 giờ sau buổi gọi', 'Summary sent within 24 hours of the call'],
      ['Mỗi câu hỏi mở có người phụ trách và hạn trả lời', 'Every open question has an owner and a due date'],
    ],
    templates: [D.intake, D.nda],
    pitfalls: [
      ['Báo giá ngay trong buổi gọi đầu khi chưa hiểu vấn đề', 'Quoting a price on the first call before understanding the problem'],
      ['Ghi chép rời rạc trong chat, không có phiếu → mất dấu yêu cầu', 'Notes scattered across chats, no ticket → requests get lost'],
      ['Chỉ nói chuyện với người đặt hàng, không biết ai quyết định và ai sẽ dùng', 'Talking only to the requester without knowing who decides and who uses it'],
      ['Nhận tài liệu mật trước khi có NDA', 'Accepting confidential documents before an NDA'],
    ],
    example: [
      'Trên cuongthai.com, yêu cầu gửi qua biểu mẫu "Trao đổi dự án" được lưu thành phiếu có mã YC-<năm>-<số>, kèm cờ đồng ý xử lý dữ liệu, thời điểm và phiên bản thông báo; phiếu được duyệt thì thành một dự án trên CT Work (/work) mà thẻ đầu tiên chính là phiếu yêu cầu.',
      'On cuongthai.com, a request sent through the "Discuss a project" form is stored as a ticket YC-<year>-<no.> with a consent flag, timestamp and notice version; once approved it becomes a CT Work (/work) project whose first card is the request itself.',
    ],
  },
  // ══ 01 ═════════════════════════════════════════════════════════════════
  {
    slug: 'tien-ban-hang',
    phase: 'discover',
    title: ['Tiền bán hàng & đánh giá phù hợp', 'Presales & qualification'],
    short: ['Chấm điểm · go / no-go', 'Scorecard · go / no-go'],
    goal: [
      'Quyết định có nên theo đuổi dự án hay không theo tiêu chí viết sẵn — nhu cầu, ngân sách, thẩm quyền, thời hạn, năng lực, rủi ro — và nói "không" sớm khi không phù hợp.',
      'Decide whether to pursue the project against written criteria — need, budget, authority, timeline, capability, risk — and say "no" early when it is not a fit.',
    ],
    activities: [
      ['Chấm bảng tiêu chí: nhu cầu, ngân sách, thẩm quyền quyết định, thời hạn (BANT), độ phù hợp kỹ thuật, rủi ro pháp lý/dữ liệu', 'Score the criteria: need, budget, authority, timeline (BANT), technical fit, legal/data risk'],
      ['Đánh giá năng lực và lịch nguồn lực: kỹ năng cần có, ai sẵn sàng, xung đột với dự án đang chạy', 'Assess capability and capacity: required skills, who is available, clashes with running projects'],
      ['Kiểm xung đột lợi ích và yêu cầu tuân thủ đặc thù (dữ liệu cá nhân, ngành có quản lý, lưu trữ trong nước)', 'Check conflicts of interest and special compliance needs (personal data, regulated sectors, data residency)'],
      ['Họp go/no-go nội bộ: theo đuổi, theo đuổi có điều kiện, hoặc từ chối — ghi lý do', 'Internal go/no-go: pursue, pursue with conditions, or decline — with reasons'],
      ['Phản hồi khách bằng văn bản; nếu từ chối thì gợi ý hướng khác', 'Reply to the client in writing; if declining, suggest alternatives'],
    ],
    deliverables: [
      ['Bảng đánh giá phù hợp (qualification scorecard)', 'Qualification scorecard'],
      ['Biên bản quyết định go/no-go kèm lý do và điều kiện', 'Go/no-go decision record with reasons and conditions'],
      ['Sổ rủi ro sơ bộ', 'Initial risk log'],
      ['Thư phản hồi khách', 'Written reply to the client'],
    ],
    client: [
      ['Trả lời câu hỏi về ngân sách, người quyết định, thời hạn', 'Answer questions on budget, decision-maker and timeline'],
      ['Cho biết ràng buộc pháp lý và tuân thủ của tổ chức', 'State the organisation’s legal and compliance constraints'],
    ],
    tools: ['CT Work', 'Google Sheets (bảng chấm điểm)', 'Email'],
    standards: [
      { name: 'PRINCE2® 7th ed. (2023)', note: ['Nguyên tắc "lý do kinh doanh tiếp tục chính đáng" và thực hành Business case', '"Continued business justification" principle and the Business case practice'] },
      { name: 'ISO/IEC/IEEE 12207:2017', note: ['Quy trình Cung cấp (Supply): bên cung cấp đánh giá đề nghị của bên mua và quyết định có phản hồi hay không', 'Supply process: the supplier evaluates the acquirer’s request and decides whether to respond'] },
      { name: 'BANT (IBM)', note: ['Khung sàng lọc cơ hội: Budget, Authority, Need, Timeline', 'Opportunity qualification: Budget, Authority, Need, Timeline'] },
    ],
    learn: [L.PMG201c, L.IAA202, L.SWE201c, L.solo],
    gate: ['Quyết định go/no-go đã ghi lại có người duyệt; nếu "go" — khách đồng ý tham gia khảo sát với phạm vi và thời lượng rõ.', 'Go/no-go decision recorded and approved; if "go", the client agrees to a discovery step with clear scope and duration.'],
    team: [
      { dept: 'sales', role: ['chủ trì chấm điểm và phản hồi khách', 'leads scoring and replies to the client'] },
      { dept: 'arch', role: ['đánh giá khả thi kỹ thuật', 'assesses technical feasibility'] },
      { dept: 'pm', role: ['đánh giá lịch và nguồn lực', 'assesses schedule and capacity'] },
      { dept: 'legal', role: ['rà soát rủi ro pháp lý và dữ liệu', 'reviews legal and data risk'] },
      { dept: 'pmo', role: ['quyết định go/no-go trong danh mục dự án', 'makes the go/no-go call within the portfolio'] },
      { dept: 'client', role: ['cung cấp thông tin sàng lọc', 'provides qualification information'] },
    ],
    raci: [
      { activity: ['Thu thập thông tin sàng lọc (BANT)', 'Gather qualification information (BANT)'], roles: { sales: 'A', ba: 'C', client: 'C' } },
      { activity: ['Đánh giá khả thi kỹ thuật', 'Technical feasibility assessment'], roles: { arch: 'A', dev: 'C', sec: 'C' } },
      { activity: ['Đánh giá năng lực và lịch nguồn lực', 'Capability and capacity assessment'], roles: { pmo: 'A', pm: 'R' } },
      { activity: ['Rà soát rủi ro pháp lý & dữ liệu', 'Legal & data risk review'], roles: { legal: 'A', sec: 'C' } },
      { activity: ['Quyết định go/no-go', 'Go/no-go decision'], roles: { pmo: 'A', sales: 'R', arch: 'C', pm: 'C', legal: 'C' } },
      { activity: ['Phản hồi khách bằng văn bản', 'Written reply to the client'], roles: { sales: 'A', client: 'I' } },
    ],
    inputs: [
      ['Phiếu yêu cầu và biên bản tư vấn', 'Intake ticket and call notes'],
      ['Danh mục dự án đang chạy, lịch nguồn lực', 'Running project portfolio and capacity calendar'],
    ],
    entryCriteria: [
      ['Phiếu ở trạng thái "Đã tiếp nhận", có biên bản tư vấn', 'Ticket is "Received" with call notes attached'],
      ['Đã biết người ra quyết định phía khách', 'The client-side decision-maker is known'],
    ],
    exitCriteria: [
      ['Bảng chấm điểm hoàn thành đủ tiêu chí', 'Scorecard completed for every criterion'],
      ['Quyết định go/no-go có người duyệt và lý do bằng văn bản', 'Go/no-go decision approved with written reasons'],
      ['Rủi ro lớn đã ghi vào sổ rủi ro sơ bộ, có người theo dõi', 'Major risks logged with an owner'],
      ['Khách đã nhận phản hồi bằng văn bản', 'Client has received a written reply'],
    ],
    checklist: [
      ['Ngân sách dự kiến nằm trong khoảng khả thi cho phạm vi đã nghe', 'Budget range is plausible for the scope heard so far'],
      ['Người quyết định phía khách tham gia hoặc được báo', 'Client decision-maker is involved or informed'],
      ['Thời hạn khả thi với nguồn lực hiện có', 'Timeline is feasible with current capacity'],
      ['Không có xung đột lợi ích', 'No conflict of interest'],
      ['Yêu cầu tuân thủ đặc thù đã được nêu và đánh giá', 'Special compliance needs stated and assessed'],
      ['Đã xét tiêu chí "không nhận" (kỹ năng ngoài tầm, rủi ro pháp lý, đạo đức)', '"Do not take" criteria considered (skills gap, legal risk, ethics)'],
    ],
    templates: [D.qualification, D.risk],
    pitfalls: [
      ['Nhận mọi dự án vì sợ mất khách → quá tải và trễ hạn', 'Taking every project for fear of losing the client → overload and delays'],
      ['Quyết định bằng cảm tính, không ghi lý do → không rút kinh nghiệm được', 'Gut-feel decisions with no written reasons → nothing to learn from'],
      ['Bỏ qua câu hỏi "ai trả tiền, ai quyết định"', 'Skipping "who pays, who decides"'],
      ['Hứa thời hạn trước khi kiểm lịch nguồn lực', 'Promising dates before checking capacity'],
    ],
    example: [
      'Áp dụng cho LabFlow AI (đồ án tốt nghiệp được chạy thử như một dự án khách): bảng tiêu chí được chấm ngay trên phiếu yêu cầu nhập vai. Phạm vi gồm đặt lịch phòng lab, mượn thiết bị, IoT và trợ lý AI — tiêu chí "thời hạn khả thi với nguồn lực" là chỗ cần cân nhắc nhất, và điều kiện "go" hợp lý là tách MVP thành từng đợt.',
      'Applied to LabFlow AI (a capstone run as if it were a client project): the scorecard is filled on the role-play request ticket. Scope spans lab booking, equipment loans, IoT and an AI assistant — "timeline feasible with capacity" is the criterion that needs most thought, and a sensible "go" condition is to split the MVP into increments.',
    ],
  },
  // ══ 02 ═════════════════════════════════════════════════════════════════
  {
    slug: 'khao-sat',
    phase: 'discover',
    title: ['Khảo sát & phân tích nghiệp vụ', 'Discovery & business analysis'],
    short: ['Hiểu quy trình hiện tại', 'Map how work is done today'],
    goal: [
      'Vẽ lại quy trình làm việc hiện tại của khách, tìm đúng chỗ đau, và xác định phạm vi phần mềm sẽ chạm tới.',
      'Map the client’s current workflow, find the real pain points and decide what the software will and will not touch.',
    ],
    activities: [
      ['Phỏng vấn các nhóm người dùng; quan sát họ làm việc thật nếu được', 'Interview each user group; shadow real work where possible'],
      ['Vẽ quy trình hiện trạng (as-is) và mong muốn (to-be)', 'Model the as-is and to-be processes'],
      ['Thu thập mẫu dữ liệu, biểu mẫu, báo cáo đang dùng', 'Collect sample data, forms and reports in use today'],
      ['Liệt kê hệ thống sẵn có cần tích hợp (kế toán, CRM, thanh toán…) và dữ liệu cần chuyển sang', 'List existing systems to integrate with (accounting, CRM, payments…) and data to migrate'],
    ],
    deliverables: [
      ['Tài liệu phân tích nghiệp vụ (BA document): bối cảnh, vai trò, quy trình as-is/to-be', 'Business analysis document: context, actors, as-is/to-be processes'],
      ['Sơ đồ ngữ cảnh + sơ đồ quy trình BPMN', 'Context diagram + BPMN process diagrams'],
      ['Bảng thuật ngữ (glossary) để hai bên nói cùng một ngôn ngữ', 'Glossary so both sides use the same words'],
    ],
    client: [
      ['Sắp xếp người dùng thật cho phỏng vấn', 'Make real users available for interviews'],
      ['Cung cấp dữ liệu mẫu (đã ẩn thông tin nhạy cảm)', 'Share sample data (with sensitive fields masked)'],
    ],
    tools: ['draw.io / Excalidraw', 'BPMN (Camunda Modeler)', 'Google Sheets', 'Miro / FigJam'],
    standards: [
      { name: 'IIBA — BABOK® Guide v3', note: ['Khung kỹ thuật phân tích nghiệp vụ: elicitation, phân tích, mô hình hoá', 'Business analysis body of knowledge: elicitation, analysis, modelling'] },
      { name: 'OMG BPMN 2.0.2', note: ['Ký pháp chuẩn cho sơ đồ quy trình nghiệp vụ', 'Standard notation for business process diagrams'] },
    ],
    learn: [L.SWR302, L.SWE201c, L.solo],
    gate: ['Khách xác nhận sơ đồ quy trình và danh sách vấn đề là đúng.', 'Client confirms the process maps and problem list are correct.'],
    team: [
      { dept: 'ba', role: ['chủ trì phỏng vấn, mô hình hoá quy trình', 'leads interviews and process modelling'] },
      { dept: 'ux', role: ['quan sát người dùng, ghi chỗ đau trải nghiệm', 'observes users, notes experience pain points'] },
      { dept: 'arch', role: ['khảo sát hệ thống hiện có và điểm tích hợp', 'surveys existing systems and integration points'] },
      { dept: 'data', role: ['đánh giá dữ liệu hiện có: khối lượng, chất lượng, dữ liệu cá nhân', 'assesses existing data: volume, quality, personal data'] },
      { dept: 'client', role: ['bố trí người dùng, xác nhận kết quả', 'provides users, confirms results'] },
    ],
    raci: [
      { activity: ['Kế hoạch khảo sát & danh sách người phỏng vấn', 'Discovery plan & interviewee list'], roles: { ba: 'A', pm: 'C', client: 'C' } },
      { activity: ['Phỏng vấn / quan sát người dùng', 'User interviews / shadowing'], roles: { ba: 'A', ux: 'R', client: 'C' } },
      { activity: ['Mô hình hoá as-is / to-be (BPMN)', 'As-is / to-be modelling (BPMN)'], roles: { ba: 'A', ux: 'C', client: 'C' } },
      { activity: ['Khảo sát hệ thống & dữ liệu hiện có', 'Existing systems & data survey'], roles: { arch: 'A', data: 'R', client: 'C' } },
      { activity: ['Xác nhận kết quả khảo sát', 'Confirm discovery results'], roles: { client: 'A', ba: 'R', pm: 'I' } },
    ],
    inputs: [
      ['Phiếu yêu cầu, quyết định go và các điều kiện kèm theo', 'Intake ticket, go decision and its conditions'],
      ['Tài liệu, biểu mẫu, báo cáo hiện có của khách', 'Client’s existing documents, forms and reports'],
      ['Dữ liệu mẫu đã ẩn danh', 'Anonymised sample data'],
    ],
    entryCriteria: [
      ['Quyết định "go" đã ghi lại', 'A recorded "go" decision'],
      ['NDA đã ký nếu cần xem dữ liệu thật', 'NDA signed if real data will be viewed'],
      ['Khách bố trí đầu mối và lịch phỏng vấn', 'Client has named a contact and booked interviews'],
    ],
    exitCriteria: [
      ['Tài liệu BA được khách xác nhận', 'BA document confirmed by the client'],
      ['Sơ đồ as-is/to-be đủ cho mọi luồng chính', 'As-is/to-be maps exist for every main flow'],
      ['Danh sách hệ thống tích hợp và dữ liệu cần chuyển (khối lượng ước tính)', 'List of integrations and data to migrate (estimated volume)'],
      ['Danh sách vấn đề có xếp hạng ưu tiên', 'Prioritised problem list'],
      ['Glossary có định nghĩa cho thuật ngữ nghiệp vụ', 'Glossary defines the business terms'],
    ],
    checklist: [
      ['Đã phỏng vấn đủ mọi nhóm người dùng chính, không chỉ quản lý', 'Every main user group interviewed, not only managers'],
      ['Mỗi luồng as-is có điểm đau được đánh dấu', 'Every as-is flow has its pain points marked'],
      ['Dữ liệu mẫu đã ẩn thông tin cá nhân', 'Sample data has personal information masked'],
      ['Biết hệ thống nguồn và chủ sở hữu dữ liệu', 'Source systems and data owners are known'],
      ['Ghi rõ phạm vi ngoài (out of scope) sơ bộ', 'Preliminary out-of-scope list written down'],
      ['Ghi nhận yêu cầu tuân thủ và báo cáo bắt buộc', 'Compliance and mandatory reporting needs captured'],
    ],
    templates: [D.ba],
    pitfalls: [
      ['Chỉ phỏng vấn quản lý, bỏ qua người dùng thật', 'Interviewing managers only, skipping real users'],
      ['Ghi giải pháp thay vì vấn đề ("cần nút X")', 'Recording solutions instead of problems ("we need button X")'],
      ['Không hỏi về dữ liệu cũ → bất ngờ ở bước chuyển dữ liệu', 'Not asking about legacy data → surprises at migration time'],
      ['Nhận dữ liệu thật chưa ẩn danh', 'Accepting real data that is not anonymised'],
    ],
    example: [
      'Áp dụng cho LabFlow AI: khảo sát xác định 7 tác nhân (Guest, Student, Lecturer, Lab Staff, Lab Manager, Admin, System) và các luồng chính — Đặt lịch → Check-in QR → Trả; Mượn & bảo trì thiết bị; Đo mức sử dụng qua IoT; Trợ lý AI cho phòng lab (RAG). Mỗi luồng có sơ đồ as-is/to-be riêng trong hồ sơ.',
      'Applied to LabFlow AI: discovery identifies 7 actors (Guest, Student, Lecturer, Lab Staff, Lab Manager, Admin, System) and the main flows — Reservation → QR check-in → Return; Equipment loan & maintenance; IoT usage metering; AI lab assistant (RAG). Each flow gets its own as-is/to-be map.',
    ],
  },
  // ══ 03 ═════════════════════════════════════════════════════════════════
  {
    slug: 'de-xuat',
    phase: 'define',
    title: ['Đề xuất giải pháp & ước lượng', 'Solution proposal & estimate'],
    short: ['Phương án · WBS · ước lượng', 'Options · WBS · estimate'],
    goal: [
      'Đưa ra một hướng giải quyết cụ thể (thường 2–3 phương án), ước lượng trung thực kèm khoảng sai số và lịch mốc — đủ để khách quyết định đầu tư.',
      'Propose a concrete approach (usually 2–3 options), an honest estimate with its uncertainty and a milestone plan — enough for the client to make an investment decision.',
    ],
    activities: [
      ['Phác giải pháp, so sánh phương án (tự xây / dùng SaaS / kết hợp) kèm chi phí vận hành hằng tháng', 'Sketch the solution and compare options (build / buy SaaS / hybrid) including monthly running cost'],
      ['Chia nhỏ công việc (WBS) và ước lượng ba điểm: lạc quan – khả dĩ – bi quan', 'Break down work (WBS) and three-point estimate: optimistic – likely – pessimistic'],
      ['Xác định MVP: phần tối thiểu mang lại giá trị trước; ưu tiên theo MoSCoW', 'Define the MVP: the smallest slice that delivers value first; prioritise with MoSCoW'],
      ['Ghi giả định, ràng buộc, rủi ro và phần ngoài phạm vi', 'Write down assumptions, constraints, risks and out-of-scope items'],
      ['Đề xuất lịch mốc và mô hình hợp tác (trọn gói / theo giờ / theo sprint)', 'Propose milestones and an engagement model (fixed scope / T&M / per sprint)'],
      ['Duyệt nội bộ rồi trình bày đề xuất, trả lời câu hỏi của khách', 'Internal review, then present the proposal and answer questions'],
    ],
    deliverables: [
      ['Tài liệu đề xuất (proposal): giải pháp, phạm vi, ngoài phạm vi, giả định, rủi ro', 'Proposal: solution, scope, out-of-scope, assumptions, risks'],
      ['Bảng WBS + ước lượng ba điểm', 'WBS + three-point estimate sheet'],
      ['Lịch mốc (milestone) và mô hình hợp tác đề xuất', 'Milestone schedule and proposed engagement model'],
      ['Báo giá theo mốc (gửi riêng cho khách, không công bố)', 'Milestone-based quote (sent privately, never published)'],
    ],
    client: [
      ['Chọn phương án và mức ưu tiên tính năng (MoSCoW)', 'Choose an option and prioritise features (MoSCoW)'],
      ['Xác nhận các giả định — sai giả định thì ước lượng được xem lại', 'Confirm the assumptions — if they change, the estimate is revisited'],
    ],
    tools: ['Google Sheets (WBS)', 'Google Docs / Slides', 'draw.io'],
    standards: [
      { name: 'PMBOK® — Three-point estimating (PERT)', note: ['Ước lượng (O + 4M + P) / 6, ghi rõ độ bất định', 'Estimate (O + 4M + P) / 6 and state the uncertainty'] },
      { name: 'PMI — PMBOK® Guide 7th ed.', note: ['Miền "Planning" và "Uncertainty": kế hoạch có giả định, ước lượng có khoảng', 'Planning and Uncertainty domains: plans with assumptions, estimates with ranges'] },
      { name: 'ISO/IEC/IEEE 12207:2017', note: ['Quy trình Cung cấp: chuẩn bị và gửi phản hồi cho bên mua', 'Supply process: prepare and submit a response to the acquirer'] },
      { name: 'MoSCoW (DSDM / Agile Business Consortium)', note: ['Must / Should / Could / Won’t — ưu tiên phạm vi theo giá trị', 'Must / Should / Could / Won’t — prioritising scope by value'] },
    ],
    learn: [L.SWE201c, L.PMG201c, L.solo, L.sysdesign],
    gate: ['Khách chọn phương án; phạm vi MVP, giả định và lịch mốc được chấp thuận bằng văn bản.', 'Client chooses an option; MVP scope, assumptions and milestones accepted in writing.'],
    team: [
      { dept: 'sales', role: ['đầu mối thương mại, trình bày đề xuất', 'commercial lead, presents the proposal'] },
      { dept: 'arch', role: ['xây dựng và so sánh phương án kỹ thuật', 'builds and compares technical options'] },
      { dept: 'ba', role: ['chốt phạm vi và MVP', 'shapes scope and MVP'] },
      { dept: 'pm', role: ['WBS, ước lượng, lịch mốc', 'WBS, estimate, milestones'] },
      { dept: 'pmo', role: ['duyệt nội bộ trước khi gửi', 'internal approval before sending'] },
      { dept: 'client', role: ['chọn phương án, ưu tiên phạm vi', 'chooses the option, prioritises scope'] },
    ],
    raci: [
      { activity: ['Xây dựng & so sánh phương án giải pháp', 'Build & compare solution options'], roles: { arch: 'A', ba: 'C', ux: 'C', dev: 'C' } },
      { activity: ['WBS & ước lượng ba điểm', 'WBS & three-point estimate'], roles: { pm: 'A', dev: 'R', arch: 'R', qa: 'C' } },
      { activity: ['Xác định MVP & ưu tiên MoSCoW', 'Define MVP & MoSCoW priorities'], roles: { client: 'A', ba: 'R', arch: 'C' } },
      { activity: ['Soạn & trình bày đề xuất', 'Write & present the proposal'], roles: { sales: 'A', arch: 'R', pm: 'R', client: 'I' } },
      { activity: ['Duyệt nội bộ (giá, rủi ro, cam kết)', 'Internal review (price, risk, commitments)'], roles: { pmo: 'A', sales: 'R', legal: 'C' } },
    ],
    inputs: [
      ['Tài liệu BA và danh sách vấn đề ưu tiên', 'BA document and prioritised problem list'],
      ['Quyết định go và điều kiện kèm theo', 'Go decision and its conditions'],
      ['Năng lực đội và đơn giá nội bộ', 'Team capability and internal rates'],
    ],
    entryCriteria: [
      ['Tài liệu BA đã được khách xác nhận', 'BA document confirmed by the client'],
      ['Biết khoảng ngân sách và thời hạn mong muốn', 'Budget range and target date are known'],
    ],
    exitCriteria: [
      ['Đề xuất có phạm vi, ngoài phạm vi, giả định, rủi ro', 'Proposal states scope, out-of-scope, assumptions and risks'],
      ['Ước lượng có khoảng (O–M–P) và mức tin cậy', 'Estimate has a range (O–M–P) and a confidence level'],
      ['Khách đã chọn phương án, MVP và thứ tự ưu tiên', 'Client has chosen the option, MVP and priorities'],
      ['Đề xuất đã qua duyệt nội bộ trước khi gửi', 'Proposal passed internal review before sending'],
    ],
    checklist: [
      ['Mỗi phương án có ưu/nhược và chi phí vận hành hằng tháng ước tính', 'Each option has pros/cons and estimated monthly running cost'],
      ['WBS phủ cả kiểm thử, bảo mật, triển khai, đào tạo, chuyển dữ liệu, quản lý dự án', 'WBS covers testing, security, deployment, training, migration and project management'],
      ['Dự phòng rủi ro (contingency) tách riêng, không giấu trong từng dòng', 'Contingency shown separately, not hidden in line items'],
      ['Chi phí bên thứ ba (cloud, giấy phép, API trả phí) liệt kê riêng', 'Third-party costs (cloud, licences, paid APIs) listed separately'],
      ['Đề xuất có ngày hết hiệu lực', 'Proposal has an expiry date'],
    ],
    templates: [D.proposal, D.quote],
    pitfalls: [
      ['Ước lượng một con số duy nhất, không có khoảng', 'Giving a single number with no range'],
      ['Quên phần không phải viết mã: kiểm thử, triển khai, đào tạo, chuyển dữ liệu, quản lý', 'Forgetting non-coding work: testing, deployment, training, migration, management'],
      ['Ẩn giả định → tranh cãi khi phạm vi thay đổi', 'Hidden assumptions → disputes when scope changes'],
      ['Báo giá thấp để thắng rồi bù bằng change request', 'Under-quoting to win, then recovering through change requests'],
    ],
    example: [
      'cuongthai.com: chi phí vận hành AI là một dòng riêng và được ước lượng bằng phép đo trên việc thật. Đo cùng một vòng lặp gọi tool cho thấy một model rẻ hơn theo bảng giá từng lượt lại đắt gấp khoảng 3 lần trong vòng lặp — vì cổng bọc thêm token ẩn mỗi vòng. Giá bảng không thay được phép đo.',
      'cuongthai.com: AI running cost is its own line and is estimated from measurements on real tasks. Measuring the same tool-calling loop showed a model that is cheaper per single call costing roughly 3× more inside the loop — the gateway adds hidden tokens every turn. List prices do not replace measurement.',
    ],
  },
  // ══ 04 ═════════════════════════════════════════════════════════════════
  {
    slug: 'phap-ly-tai-chinh',
    phase: 'define',
    title: ['Hợp đồng, pháp lý & khởi động', 'Contract, legal & kick-off'],
    short: ['MSA · SOW · IP · kick-off', 'MSA · SOW · IP · kick-off'],
    goal: [
      'Chốt khung pháp lý và tài chính trước khi làm: ai sở hữu gì, thanh toán theo mốc nào, nghiệm thu ra sao, dữ liệu được xử lý thế nào — rồi khởi động dự án với đúng người.',
      'Settle the legal and financial frame before work starts: who owns what, which milestones are paid, how acceptance works, how data is handled — then kick off with the right people.',
    ],
    activities: [
      ['Soạn hợp đồng khung (MSA) và phạm vi công việc (SOW): mốc, tiêu chí nghiệm thu, bảo hành, giới hạn trách nhiệm, chấm dứt', 'Draft the master services agreement (MSA) and statement of work (SOW): milestones, acceptance criteria, warranty, liability cap, termination'],
      ['Thoả thuận sở hữu trí tuệ: mã nguồn viết riêng chuyển giao khi thanh toán đủ; thư viện, công cụ có sẵn chỉ cấp quyền sử dụng', 'Agree intellectual property: bespoke code transfers on full payment; pre-existing libraries and tools are licensed, not transferred'],
      ['Lịch thanh toán theo mốc gắn với biên bản nghiệm thu từng mốc; xuất hoá đơn điện tử đúng quy định', 'Milestone payment schedule tied to each acceptance record; issue lawful e-invoices'],
      ['Kiểm kê giấy phép bên thứ ba (mã nguồn mở, font, ảnh, API trả phí) và nghĩa vụ đi kèm', 'Inventory third-party licences (open source, fonts, images, paid APIs) and their obligations'],
      ['Thoả thuận xử lý dữ liệu (DPA) khi hệ thống xử lý dữ liệu cá nhân thay mặt khách', 'Data processing agreement (DPA) when the system processes personal data on the client’s behalf'],
      ['Họp kick-off: giới thiệu đội, RACI, kênh liên lạc, lịch họp, quy trình thay đổi và leo thang', 'Kick-off meeting: team, RACI, channels, meeting cadence, change and escalation process'],
    ],
    deliverables: [
      ['Hợp đồng khung (MSA) + SOW đã ký', 'Signed MSA + SOW'],
      ['Phụ lục: lịch thanh toán theo mốc, tiêu chí nghiệm thu, điều khoản bảo hành', 'Appendices: milestone payments, acceptance criteria, warranty terms'],
      ['Danh mục giấy phép bên thứ ba (sơ bộ)', 'Third-party licence inventory (initial)'],
      ['Thoả thuận xử lý dữ liệu (nếu áp dụng)', 'Data processing agreement (if applicable)'],
      ['Biên bản họp kick-off', 'Kick-off minutes'],
    ],
    client: [
      ['Bộ phận pháp chế của khách rà soát và ký', 'Client’s legal team reviews and signs'],
      ['Cử Product Owner và nhà tài trợ dự án (sponsor)', 'Appoint a Product Owner and a project sponsor'],
      ['Dự họp kick-off với người có quyền quyết định', 'Attend the kick-off with decision-makers present'],
    ],
    tools: ['Google Docs (theo dõi sửa đổi)', 'Chữ ký số / e-sign', 'Phần mềm hoá đơn điện tử', 'CT Work'],
    standards: [
      { name: 'Bộ luật Dân sự 2015 (91/2015/QH13)', note: ['Khung pháp lý cho hợp đồng dịch vụ', 'Legal basis for service contracts in Vietnam'] },
      { name: 'Luật Sở hữu trí tuệ 2005 (sửa đổi 2009, 2019, 2022)', note: ['Chương trình máy tính được bảo hộ quyền tác giả như tác phẩm văn học', 'Computer programs are protected by copyright as literary works'] },
      { name: 'Luật Giao dịch điện tử 2023 (20/2023/QH15)', note: ['Giá trị pháp lý của hợp đồng và chữ ký điện tử', 'Legal validity of electronic contracts and signatures'] },
      { name: 'Nghị định 123/2020/NĐ-CP', note: ['Hoá đơn, chứng từ điện tử (kèm văn bản sửa đổi, bổ sung hiện hành)', 'E-invoices and vouchers (with current amendments)'] },
      { name: 'ISO/IEC 5230:2020 (OpenChain)', note: ['Chương trình tuân thủ giấy phép mã nguồn mở', 'Open-source licence compliance programme'] },
      { name: 'Luật Bảo vệ dữ liệu cá nhân 2025 (91/2025/QH15) và Nghị định 356/2025/NĐ-CP', note: ['Phân vai Bên Kiểm soát / Bên Xử lý dữ liệu cá nhân trong hợp đồng', 'Controller / processor roles for personal data in the contract'] },
    ],
    learn: [L.LAW102, L.privacy, L.payments, L.PMG201c],
    gate: ['MSA + SOW đã ký, lịch thanh toán và tiêu chí nghiệm thu đã chốt, kick-off đã họp với đủ người ra quyết định.', 'MSA + SOW signed, payment schedule and acceptance criteria fixed, kick-off held with decision-makers present.'],
    team: [
      { dept: 'legal', role: ['hợp đồng, sở hữu trí tuệ, DPA, hoá đơn', 'contracts, IP, DPA, invoicing'] },
      { dept: 'sales', role: ['đàm phán điều khoản thương mại', 'negotiates commercial terms'] },
      { dept: 'pm', role: ['viết SOW, chủ trì kick-off', 'writes the SOW, runs the kick-off'] },
      { dept: 'arch', role: ['danh mục giấy phép bên thứ ba', 'third-party licence inventory'] },
      { dept: 'pmo', role: ['duyệt điều khoản và người ký phía nhà cung cấp', 'approves terms and signs for the supplier'] },
      { dept: 'client', role: ['rà soát, ký, cử Product Owner', 'reviews, signs, appoints the Product Owner'] },
    ],
    raci: [
      { activity: ['Soạn MSA & SOW', 'Draft MSA & SOW'], roles: { legal: 'A', pm: 'R', sales: 'R', client: 'C' } },
      { activity: ['Điều khoản sở hữu trí tuệ & giấy phép bên thứ ba', 'IP terms & third-party licences'], roles: { legal: 'A', arch: 'R', client: 'C' } },
      { activity: ['Lịch thanh toán theo mốc & hoá đơn', 'Milestone payments & invoicing'], roles: { legal: 'A', sales: 'R', pm: 'C', client: 'C' } },
      { activity: ['Thoả thuận xử lý dữ liệu (DPA)', 'Data processing agreement (DPA)'], roles: { legal: 'A', sec: 'C', client: 'C' } },
      { activity: ['Ký hợp đồng (hai bên)', 'Contract signature (both parties)'], roles: { pmo: 'A', legal: 'R', client: 'R' } },
      { activity: ['Họp kick-off', 'Kick-off meeting'], roles: { pm: 'A', ba: 'R', arch: 'R', client: 'R', sales: 'I' } },
    ],
    inputs: [
      ['Đề xuất đã được chấp thuận', 'Accepted proposal'],
      ['Mẫu hợp đồng của hai bên', 'Both parties’ contract templates'],
      ['Thông tin pháp nhân và người ký', 'Legal entity details and signatories'],
    ],
    entryCriteria: [
      ['Khách đã chọn phương án và MVP bằng văn bản', 'Client chose the option and MVP in writing'],
      ['Có người có thẩm quyền ký phía khách', 'An authorised signatory exists on the client side'],
    ],
    exitCriteria: [
      ['MSA + SOW + phụ lục đã ký bởi người có thẩm quyền', 'MSA + SOW + appendices signed by authorised people'],
      ['Điều khoản sở hữu trí tuệ, bảo mật, dữ liệu cá nhân rõ ràng', 'IP, confidentiality and personal-data terms are explicit'],
      ['Lịch thanh toán gắn với mốc nghiệm thu', 'Payment schedule tied to acceptance milestones'],
      ['Kick-off đã họp, biên bản đã gửi', 'Kick-off held and minutes sent'],
      ['Danh sách đầu mối và kênh liên lạc được hai bên xác nhận', 'Contact list and channels confirmed by both sides'],
    ],
    checklist: [
      ['Phạm vi trong SOW khớp đề xuất đã duyệt', 'SOW scope matches the approved proposal'],
      ['Ghi rõ "ngoài phạm vi" và cách xử lý thay đổi (CR)', '"Out of scope" and the change-request process are explicit'],
      ['Tiêu chí nghiệm thu từng mốc đo được', 'Each milestone has measurable acceptance criteria'],
      ['Bảo hành: thời hạn, cái gì được và không được bảo hành', 'Warranty: duration, what is and is not covered'],
      ['Giới hạn trách nhiệm, bất khả kháng, chấm dứt hợp đồng và trả dữ liệu', 'Liability cap, force majeure, termination and data return'],
      ['Thời điểm chuyển giao quyền sở hữu mã nguồn', 'When source-code ownership transfers'],
      ['Mẫu hợp đồng đã qua luật sư rà soát', 'Contract template reviewed by a lawyer'],
    ],
    templates: [D.msa, D.sow, D.dpa, D.kickoff],
    pitfalls: [
      ['Dùng mẫu hợp đồng trên mạng không qua luật sư', 'Using an internet contract template without a lawyer'],
      ['Không ghi thời điểm chuyển giao sở hữu trí tuệ → tranh chấp mã nguồn', 'No IP transfer point → disputes over the code'],
      ['Hợp đồng trọn gói nhưng thanh toán theo thời gian thay vì theo mốc nghiệm thu', 'Fixed-scope contract paid by time instead of by acceptance milestones'],
      ['Quên giấy phép bên thứ ba (font, thư viện GPL, API trả phí) đi kèm sản phẩm', 'Forgetting third-party licences (fonts, GPL libraries, paid APIs) shipped with the product'],
      ['Kick-off thiếu người ra quyết định phía khách', 'Kick-off without the client’s decision-makers'],
    ],
    example: [
      'cuongthai.com, 02/07/2026: tính năng GIF chết vì khi thiếu biến môi trường, ứng dụng rơi về khoá beta công khai của GIPHY đã bị thu hồi (403). Dịch vụ bên thứ ba có điều khoản và khoá riêng — nên danh mục bên thứ ba trong hợp đồng ghi rõ: khoá đứng tên ai, gói nào, ai trả phí, hết hạn khi nào, và khoá nằm ở máy chủ chứ không trong mã phía trình duyệt.',
      'cuongthai.com, 2 Jul 2026: the GIF feature died because, with an env var missing, the app fell back to GIPHY’s public beta key, which had been revoked (403). Third-party services have their own terms and keys — so the contract’s third-party inventory states whose name the key is in, which plan, who pays, when it expires, and that it lives on the server, not in browser code.',
    ],
  },
  // ══ 05 ═════════════════════════════════════════════════════════════════
  {
    slug: 'dac-ta-yeu-cau',
    phase: 'define',
    title: ['Đặc tả yêu cầu', 'Requirements specification'],
    short: ['SRS · user story · AC', 'SRS · user stories · AC'],
    goal: [
      'Biến mong muốn thành yêu cầu kiểm chứng được: ai làm gì, trong điều kiện nào, và thế nào thì coi là "xong".',
      'Turn wishes into verifiable requirements: who does what, under which conditions, and what counts as "done".',
    ],
    activities: [
      ['Viết use case và user story theo vai trò', 'Write use cases and user stories per role'],
      ['Viết tiêu chí chấp nhận (acceptance criteria) dạng Given / When / Then', 'Write acceptance criteria in Given / When / Then form'],
      ['Chốt yêu cầu phi chức năng: hiệu năng, bảo mật, khả dụng, sao lưu, trình duyệt/thiết bị hỗ trợ', 'Pin down non-functional requirements: performance, security, availability, backup, supported devices'],
      ['Lập ma trận phân quyền theo vai trò và danh sách thông báo hệ thống', 'Build the role-permission matrix and the system message list'],
      ['Lập ma trận truy vết yêu cầu → thiết kế → test', 'Build a traceability matrix: requirement → design → test'],
    ],
    deliverables: [
      ['SRS (Software Requirements Specification)', 'SRS (Software Requirements Specification)'],
      ['Product backlog với user story + acceptance criteria', 'Product backlog with user stories + acceptance criteria'],
      ['Danh sách NFR có số đo (vd: trang chính < 2,5 s LCP trên 4G)', 'Measurable NFR list (e.g. main page LCP < 2.5 s on 4G)'],
      ['Ma trận truy vết (RTM)', 'Requirements traceability matrix (RTM)'],
    ],
    client: [
      ['Đọc và ký duyệt SRS / backlog', 'Review and sign off the SRS / backlog'],
      ['Xác nhận tiêu chí chấp nhận — đây là căn cứ nghiệm thu sau này', 'Confirm acceptance criteria — they become the basis for UAT'],
    ],
    tools: ['Jira / GitHub Projects / CT Work', 'Google Docs', 'Gherkin'],
    standards: [
      { name: 'ISO/IEC/IEEE 29148:2018', note: ['Kỹ nghệ yêu cầu — cấu trúc và đặc tính của một SRS tốt', 'Requirements engineering — structure and qualities of a good SRS'] },
      { name: 'ISO/IEC 25010:2023', note: ['Mô hình chất lượng sản phẩm — khung để liệt kê NFR', 'Product quality model — a checklist for NFRs'] },
      { name: 'INVEST (Bill Wake)', note: ['Tiêu chí user story tốt: độc lập, thương lượng được, có giá trị, ước lượng được, nhỏ, kiểm thử được', 'Good user stories: Independent, Negotiable, Valuable, Estimable, Small, Testable'] },
    ],
    learn: [L.SWR302, L.SWP391, L.agile],
    gate: ['SRS được duyệt; mọi story trong sprint đầu có acceptance criteria.', 'SRS approved; every first-sprint story has acceptance criteria.'],
    team: [
      { dept: 'ba', role: ['viết SRS, user story, RTM', 'writes SRS, user stories, RTM'] },
      { dept: 'qa', role: ['bảo đảm tiêu chí chấp nhận kiểm thử được', 'makes acceptance criteria testable'] },
      { dept: 'arch', role: ['chốt NFR có số đo', 'pins measurable NFRs'] },
      { dept: 'sec', role: ['yêu cầu bảo mật & dữ liệu cá nhân', 'security & personal-data requirements'] },
      { dept: 'ux', role: ['tham vấn luồng thao tác', 'consulted on user flows'] },
      { dept: 'client', role: ['ký duyệt SRS và tiêu chí chấp nhận', 'signs off SRS and acceptance criteria'] },
    ],
    raci: [
      { activity: ['Viết use case & user story', 'Write use cases & user stories'], roles: { ba: 'A', ux: 'C', client: 'C' } },
      { activity: ['Tiêu chí chấp nhận (Given/When/Then)', 'Acceptance criteria (Given/When/Then)'], roles: { ba: 'A', qa: 'R', client: 'C' } },
      { activity: ['Yêu cầu phi chức năng có số đo', 'Measurable non-functional requirements'], roles: { arch: 'A', ba: 'R', sec: 'R', devops: 'C' } },
      { activity: ['Ma trận truy vết (RTM)', 'Traceability matrix (RTM)'], roles: { ba: 'A', qa: 'R' } },
      { activity: ['Ký duyệt SRS & backlog', 'Sign off SRS & backlog'], roles: { client: 'A', ba: 'R', pm: 'I' } },
    ],
    inputs: [
      ['Tài liệu BA, SOW đã ký', 'BA document, signed SOW'],
      ['Biên bản kick-off', 'Kick-off minutes'],
    ],
    entryCriteria: [
      ['SOW đã ký', 'SOW signed'],
      ['Product Owner phía khách đã được chỉ định', 'Client-side Product Owner appointed'],
    ],
    exitCriteria: [
      ['SRS được ký duyệt, có số phiên bản và ngày', 'SRS signed off with version number and date'],
      ['Mọi story của sprint đầu có tiêu chí chấp nhận', 'Every first-sprint story has acceptance criteria'],
      ['Mỗi NFR có số đo và cách đo', 'Every NFR has a target and a measurement method'],
      ['RTM đã khởi tạo', 'RTM initialised'],
      ['Từ mốc này, mọi thay đổi đi qua phiếu CR', 'From here on, every change goes through a CR'],
    ],
    checklist: [
      ['Mỗi yêu cầu có ID duy nhất', 'Every requirement has a unique ID'],
      ['Không có từ mơ hồ ("nhanh", "thân thiện") thiếu số đo', 'No vague words ("fast", "friendly") without a number'],
      ['Ma trận phân quyền theo vai trò đầy đủ', 'Role-permission matrix complete'],
      ['Thông báo và lỗi hệ thống được liệt kê', 'System messages and errors listed'],
      ['Quy tắc nghiệp vụ (business rules) tách riêng, có ID', 'Business rules listed separately with IDs'],
      ['Ghi rõ dữ liệu cá nhân nào được thu thập, vì sao, giữ bao lâu', 'States which personal data is collected, why, and for how long'],
    ],
    templates: [D.srs, D.cr],
    pitfalls: [
      ['Yêu cầu không kiểm thử được', 'Requirements that cannot be tested'],
      ['Bỏ NFR đến cuối → kiến trúc phải làm lại', 'Leaving NFRs to the end → architecture rework'],
      ['SRS viết xong để đó, không cập nhật theo CR', 'SRS written once and never updated after CRs'],
      ['Trộn yêu cầu với giải pháp giao diện', 'Mixing requirements with UI solutions'],
    ],
    example: [
      'Áp dụng cho LabFlow AI: SRS theo khung SEP490 (Report 3) — Context Diagram, Main Workflows, Actors & Use Cases, Functional và Non-functional Requirements, Business Rules, System Messages — và mỗi yêu cầu được nối với thẻ việc trên CT Work qua ma trận truy vết (RTM).',
      'Applied to LabFlow AI: the SRS follows the SEP490 frame (Report 3) — Context Diagram, Main Workflows, Actors & Use Cases, Functional and Non-functional Requirements, Business Rules, System Messages — and each requirement is linked to a CT Work card through the RTM.',
    ],
  },
  // ══ 06 ═════════════════════════════════════════════════════════════════
  {
    slug: 'thiet-ke-ux-ui',
    phase: 'design',
    title: ['Thiết kế UX/UI', 'UX/UI design'],
    short: ['Wireframe · prototype', 'Wireframes · prototype'],
    goal: [
      'Cho khách "chạm" vào sản phẩm trước khi viết mã: luồng thao tác rõ, giao diện nhất quán, dùng được cho cả người khiếm thị và trên điện thoại.',
      'Let the client "touch" the product before any code: clear flows, consistent UI, usable on phones and with assistive tech.',
    ],
    activities: [
      ['Vẽ user flow và sitemap / sơ đồ màn hình', 'Draw user flows and sitemap / screen map'],
      ['Wireframe độ trung thực thấp → mockup độ trung thực cao', 'Low-fidelity wireframes → high-fidelity mockups'],
      ['Dựng prototype bấm được, thử với 3–5 người dùng thật', 'Clickable prototype, tested with 3–5 real users'],
      ['Lập design system nhỏ: màu, chữ, khoảng cách, component, trạng thái sáng/tối', 'Small design system: colour, type, spacing, components, light/dark'],
    ],
    deliverables: [
      ['Wireframe + mockup mọi màn hình chính (desktop & mobile)', 'Wireframes + mockups for all key screens (desktop & mobile)'],
      ['Prototype tương tác', 'Interactive prototype'],
      ['Ghi chú kiểm thử khả dụng & danh sách chỉnh sửa', 'Usability test notes & change list'],
      ['Design tokens / thư viện component', 'Design tokens / component library'],
    ],
    client: [
      ['Góp ý prototype theo từng vòng', 'Give feedback on each prototype round'],
      ['Cung cấp nhận diện thương hiệu (logo, màu, font)', 'Provide brand assets (logo, colours, fonts)'],
    ],
    tools: ['Figma', 'FigJam', 'Storybook', 'Lighthouse / axe'],
    standards: [
      { name: 'WCAG 2.2 (W3C, 2023)', note: ['Tiêu chuẩn truy cập nội dung web — mục tiêu mức AA', 'Web accessibility guidelines — target level AA'] },
      { name: 'ISO 9241-210:2019', note: ['Thiết kế lấy con người làm trung tâm', 'Human-centred design for interactive systems'] },
      { name: 'Nielsen — 10 Usability Heuristics', note: ['Bộ nguyên tắc đánh giá nhanh giao diện', 'Quick heuristic evaluation of an interface'] },
    ],
    learn: [L.ux, L.tailwind, L.react],
    gate: ['Khách duyệt prototype; không còn câu hỏi lớn về luồng thao tác.', 'Prototype approved; no open questions about main flows.'],
    team: [
      { dept: 'ux', role: ['thiết kế luồng, giao diện, kiểm thử khả dụng', 'designs flows and UI, runs usability tests'] },
      { dept: 'ba', role: ['đối chiếu thiết kế với yêu cầu', 'checks designs against requirements'] },
      { dept: 'dev', role: ['đánh giá khả thi, nhận design tokens', 'checks feasibility, receives design tokens'] },
      { dept: 'qa', role: ['rà truy cập (a11y) trên thiết kế', 'reviews accessibility on designs'] },
      { dept: 'client', role: ['góp ý và duyệt prototype', 'reviews and approves the prototype'] },
    ],
    raci: [
      { activity: ['User flow & sitemap', 'User flows & sitemap'], roles: { ux: 'A', ba: 'C' } },
      { activity: ['Wireframe → mockup', 'Wireframes → mockups'], roles: { ux: 'A', dev: 'C', client: 'C' } },
      { activity: ['Prototype & kiểm thử khả dụng', 'Prototype & usability testing'], roles: { ux: 'A', ba: 'R', client: 'R' } },
      { activity: ['Design system / design tokens', 'Design system / design tokens'], roles: { ux: 'A', dev: 'R', qa: 'C' } },
      { activity: ['Duyệt prototype', 'Approve the prototype'], roles: { client: 'A', ux: 'R', pm: 'I' } },
    ],
    inputs: [
      ['SRS và user story có tiêu chí chấp nhận', 'SRS and user stories with acceptance criteria'],
      ['Nhận diện thương hiệu', 'Brand assets'],
      ['Kết quả khảo sát người dùng (persona, chỗ đau)', 'Discovery results (personas, pain points)'],
    ],
    entryCriteria: [
      ['Luồng chính đã có user story và tiêu chí chấp nhận', 'Main flows have user stories with acceptance criteria'],
      ['Có nhận diện thương hiệu hoặc đã thống nhất làm mới', 'Brand assets exist or a refresh is agreed'],
    ],
    exitCriteria: [
      ['Mockup mọi màn hình chính trên desktop và mobile', 'Mockups for every key screen on desktop and mobile'],
      ['Prototype được khách duyệt bằng văn bản', 'Prototype approved in writing'],
      ['Kết quả kiểm thử khả dụng đã được áp dụng hoặc ghi lý do không áp dụng', 'Usability findings applied, or reasons recorded'],
      ['Design tokens bàn giao cho đội phát triển', 'Design tokens handed to engineering'],
      ['Thiết kế đạt kiểm tra WCAG 2.2 AA (tương phản, kích thước vùng chạm, thứ tự focus)', 'Designs pass WCAG 2.2 AA checks (contrast, target size, focus order)'],
    ],
    checklist: [
      ['Mỗi màn hình có trạng thái tải / lỗi / rỗng', 'Every screen has loading / error / empty states'],
      ['Tương phản chữ thường ≥ 4.5:1', 'Normal text contrast ≥ 4.5:1'],
      ['Vùng chạm tối thiểu 24×24 px (WCAG 2.2 — 2.5.8)', 'Touch targets at least 24×24 px (WCAG 2.2 — 2.5.8)'],
      ['Bố cục chạy được từ chiều rộng 360 px', 'Layout works from 360 px wide'],
      ['Dùng nội dung thật thay cho lorem ipsum', 'Real content instead of lorem ipsum'],
      ['Thông báo lỗi nói cách sửa, không chỉ nói "lỗi"', 'Error messages say how to fix, not just "error"'],
    ],
    templates: [D.usability],
    pitfalls: [
      ['Thiết kế chỉ cho desktop', 'Designing for desktop only'],
      ['Không có trạng thái lỗi / rỗng', 'No error / empty states'],
      ['Prototype đẹp nhưng không khả thi kỹ thuật', 'Beautiful prototype that is not technically feasible'],
      ['Duyệt bằng ảnh tĩnh thay vì cho người dùng bấm thử', 'Approving static images instead of letting users click through'],
    ],
    example: [
      'cuongthai.com: giao diện tối toàn trang dùng lớp `theme-dark`, còn biến thể `dark:` của Tailwind dành riêng cho Notes. Từng có lần đặt nhầm lớp `.dark` trên thẻ <html> làm vỡ bộ ba giao diện sáng/tối/nâu của Notes. Quy ước theme phải nằm trong design system có ghi chép, không trong trí nhớ.',
      'cuongthai.com: the site-wide dark theme uses the `theme-dark` class, while Tailwind’s `dark:` variant is reserved for Notes. Putting `.dark` on <html> once broke Notes’ light/dark/brown switcher. Theme conventions belong in a written design system, not in someone’s memory.',
    ],
  },
  // ══ 07 ═════════════════════════════════════════════════════════════════
  {
    slug: 'kien-truc',
    phase: 'design',
    title: ['Kiến trúc & thiết kế kỹ thuật', 'Architecture & technical design'],
    short: ['SDD · ERD · API · ADR', 'SDD · ERD · API · ADR'],
    goal: [
      'Quyết định hệ thống được chia thế nào, dữ liệu nằm ở đâu, các phần nói chuyện với nhau ra sao — và ghi lại vì sao chọn như vậy.',
      'Decide how the system is split, where data lives, how parts talk to each other — and write down why.',
    ],
    activities: [
      ['Chọn kiểu kiến trúc (monolith mô-đun, client–server, event-driven…) theo quy mô thật, không theo mốt', 'Pick an architecture style (modular monolith, client–server, event-driven…) for the real scale, not the trend'],
      ['Thiết kế cơ sở dữ liệu: ERD, chuẩn hoá, chỉ mục, chiến lược migration', 'Database design: ERD, normalisation, indexes, migration strategy'],
      ['Viết hợp đồng API (OpenAPI) trước khi code để FE và BE làm song song', 'Write the API contract (OpenAPI) first so FE and BE can work in parallel'],
      ['Mô hình hoá mối đe doạ (STRIDE) cho luồng dữ liệu nhạy cảm', 'Threat-model sensitive data flows (STRIDE)'],
      ['Ghi quyết định kiến trúc (ADR) cho mọi lựa chọn khó đảo ngược', 'Record architecture decisions (ADRs) for anything hard to reverse'],
    ],
    deliverables: [
      ['SDD / SAD: sơ đồ C4 (ngữ cảnh, container, component), sơ đồ triển khai', 'SDD / SAD: C4 diagrams (context, container, component), deployment view'],
      ['ERD + từ điển dữ liệu', 'ERD + data dictionary'],
      ['Đặc tả API OpenAPI 3.1', 'OpenAPI 3.1 API spec'],
      ['Danh sách ADR', 'ADR log'],
      ['Threat model + biện pháp giảm thiểu', 'Threat model + mitigations'],
    ],
    client: [
      ['Xác nhận ràng buộc hạ tầng / chi phí vận hành hằng tháng', 'Confirm infrastructure constraints / monthly running cost'],
      ['Cấp thông tin tích hợp bên thứ ba (API key thử nghiệm, tài liệu)', 'Provide third-party integration details (sandbox keys, docs)'],
    ],
    tools: ['PlantUML / Mermaid', 'dbdiagram / DBeaver', 'Swagger / Stoplight', 'OWASP Threat Dragon'],
    standards: [
      { name: 'ISO/IEC/IEEE 42010:2022', note: ['Mô tả kiến trúc: quan điểm, góc nhìn, bên liên quan', 'Architecture description: viewpoints, views, stakeholders'] },
      { name: 'IEEE 1016-2009', note: ['Cấu trúc tài liệu thiết kế phần mềm (SDD)', 'Software design description (SDD) structure'] },
      { name: 'OpenAPI Specification 3.1', note: ['Chuẩn mô tả REST API máy đọc được', 'Machine-readable REST API description'] },
      { name: 'C4 model · ADR (M. Nygard)', note: ['Sơ đồ kiến trúc 4 mức + ghi quyết định ngắn gọn', 'Four-level architecture diagrams + lightweight decision records'] },
      { name: 'STRIDE (Microsoft)', note: ['Phân loại mối đe doạ khi threat modeling', 'Threat categories for threat modeling'] },
    ],
    learn: [L.SWD392, L.DBI202, L.sysdesign, L.api, L.threat, L.pg],
    gate: ['Review thiết kế xong; ERD và API contract đã khoá cho sprint đầu.', 'Design review done; ERD and API contract frozen for the first sprint.'],
    team: [
      { dept: 'arch', role: ['chủ trì kiến trúc, ADR, review thiết kế', 'owns architecture, ADRs, design review'] },
      { dept: 'dev', role: ['thiết kế chi tiết, hợp đồng API', 'detailed design, API contract'] },
      { dept: 'data', role: ['ERD, từ điển dữ liệu, chiến lược migration', 'ERD, data dictionary, migration strategy'] },
      { dept: 'sec', role: ['threat model và biện pháp giảm thiểu', 'threat model and mitigations'] },
      { dept: 'devops', role: ['sơ đồ triển khai, ràng buộc vận hành', 'deployment view, operational constraints'] },
      { dept: 'client', role: ['duyệt chi phí vận hành, cấp thông tin tích hợp', 'approves running cost, provides integration details'] },
    ],
    raci: [
      { activity: ['Chọn kiểu kiến trúc & sơ đồ C4', 'Architecture style & C4 diagrams'], roles: { arch: 'A', dev: 'C', devops: 'C' } },
      { activity: ['Thiết kế CSDL (ERD, migration)', 'Database design (ERD, migrations)'], roles: { arch: 'A', data: 'R', dev: 'R' } },
      { activity: ['Hợp đồng API (OpenAPI)', 'API contract (OpenAPI)'], roles: { arch: 'A', dev: 'R', qa: 'C' } },
      { activity: ['Threat model (STRIDE)', 'Threat model (STRIDE)'], roles: { sec: 'A', arch: 'R', dev: 'C' } },
      { activity: ['ADR & review thiết kế', 'ADRs & design review'], roles: { arch: 'A', dev: 'C', sec: 'C', pm: 'I' } },
      { activity: ['Duyệt chi phí hạ tầng & vận hành', 'Approve infrastructure & running cost'], roles: { client: 'A', arch: 'R', infra: 'C' } },
    ],
    inputs: [
      ['SRS và NFR có số đo', 'SRS and measurable NFRs'],
      ['Prototype đã duyệt', 'Approved prototype'],
      ['Ràng buộc hạ tầng và ngân sách vận hành', 'Infrastructure constraints and running budget'],
    ],
    entryCriteria: [
      ['SRS đã được duyệt', 'SRS approved'],
      ['NFR có số đo', 'NFRs are measurable'],
    ],
    exitCriteria: [
      ['SDD có C4 mức 1–3 và sơ đồ triển khai', 'SDD has C4 levels 1–3 and a deployment view'],
      ['ERD, từ điển dữ liệu và chiến lược migration hoàn chỉnh', 'ERD, data dictionary and migration strategy complete'],
      ['OpenAPI cho sprint đầu đã khoá', 'OpenAPI for the first sprint frozen'],
      ['Biện pháp từ threat model đã vào backlog', 'Threat-model mitigations are in the backlog'],
      ['Mọi quyết định khó đảo ngược có ADR; review thiết kế có biên bản', 'Every hard-to-reverse decision has an ADR; design review minuted'],
    ],
    checklist: [
      ['Mỗi NFR có cơ chế đáp ứng trong thiết kế', 'Every NFR has a design mechanism that meets it'],
      ['Chiến lược xác thực / phân quyền rõ ràng', 'Authentication / authorisation strategy defined'],
      ['Định dạng lỗi và phản hồi API thống nhất', 'Uniform API error and response format'],
      ['Mục tiêu sao lưu & phục hồi (RPO / RTO) đã đặt', 'Backup & recovery targets (RPO / RTO) set'],
      ['Chi phí vận hành hằng tháng ước tính', 'Monthly running cost estimated'],
      ['Điểm tích hợp bên thứ ba có môi trường sandbox', 'Third-party integration points have sandboxes'],
    ],
    templates: [D.sdd, D.adr],
    pitfalls: [
      ['Microservices cho hệ thống nhỏ', 'Microservices for a small system'],
      ['Không ghi ADR → sau vài tháng không ai nhớ vì sao', 'No ADRs → nobody remembers why a few months later'],
      ['API thiết kế theo bảng CSDL thay vì theo use case', 'APIs shaped by database tables instead of use cases'],
      ['Threat model làm một lần rồi bỏ', 'Threat model done once and forgotten'],
    ],
    example: [
      'cuongthai.com: lời gọi AI được phân model theo VIỆC chứ không theo mô-đun, và AI Code đi một cổng riêng. Mỗi quyết định ghi kèm lý do và phép đo (giá trong vòng lặp gọi tool, model nào nhìn được ảnh thật, model nào bỏ qua trần token) — đó là ADR dạng sống, đi cùng mã nguồn.',
      'cuongthai.com: AI calls are routed to models by TASK, not by module, and AI Code uses its own gateway. Every decision is recorded with its reason and measurement (cost inside the tool loop, which models really see images, which ignore token caps) — a living ADR that travels with the code.',
    ],
  },
  // ══ 08 ═════════════════════════════════════════════════════════════════
  {
    slug: 'lap-ke-hoach',
    phase: 'build',
    title: ['Lập kế hoạch & thiết lập dự án', 'Planning & project setup'],
    short: ['Sprint · repo · CI/CD', 'Sprints · repo · CI/CD'],
    goal: [
      'Dựng "đường ray" trước khi chạy tàu: kế hoạch có baseline, kho mã, pipeline kiểm tra tự động, ba môi trường tách biệt và nhịp báo cáo.',
      'Lay the rails before running the train: a baselined plan, repository, automated checks, three separate environments and a reporting rhythm.',
    ],
    activities: [
      ['Chia backlog thành sprint 1–2 tuần, đặt Definition of Done', 'Slice the backlog into 1–2 week sprints, agree a Definition of Done'],
      ['Tạo repo, quy ước nhánh, mẫu PR, bảo vệ nhánh main', 'Create the repo, branch conventions, PR template, protect main'],
      ['Dựng CI: lint, kiểm kiểu, test, build image trên mỗi PR', 'Set up CI: lint, type-check, tests, image build on every PR'],
      ['Tạo môi trường dev / staging / production, tách biến môi trường và bí mật', 'Create dev / staging / production, with separated env vars and secrets'],
      ['Lập sổ rủi ro, kế hoạch truyền thông và mẫu báo cáo tuần', 'Start the risk register, communication plan and weekly report'],
    ],
    deliverables: [
      ['Kế hoạch dự án có baseline + lịch sprint + Definition of Done', 'Baselined project plan + sprint calendar + Definition of Done'],
      ['Repo có README, CONTRIBUTING, .env.example, pipeline CI chạy xanh', 'Repo with README, CONTRIBUTING, .env.example and a green CI pipeline'],
      ['Môi trường staging truy cập được cho khách', 'A staging environment the client can open'],
      ['Sổ rủi ro và kế hoạch truyền thông', 'Risk register and communication plan'],
    ],
    client: [
      ['Chỉ định một đầu mối duyệt (product owner phía khách)', 'Appoint one approver (client-side product owner)'],
      ['Được mời vào board công việc để theo dõi', 'Get access to the work board to follow progress'],
    ],
    tools: ['GitHub / GitLab', 'GitHub Actions', 'Docker Compose', 'Jira / GitHub Projects / CT Work'],
    standards: [
      { name: 'The Scrum Guide (2020)', note: ['Sự kiện, vai trò, artefact của Scrum', 'Scrum events, roles and artefacts'] },
      { name: 'The Twelve-Factor App', note: ['Cấu hình qua env, tách build/release/run, dev ≈ prod', 'Config in env, separate build/release/run, dev/prod parity'] },
      { name: 'Conventional Commits 1.0.0', note: ['Quy ước thông điệp commit đọc được bằng máy', 'Machine-readable commit message convention'] },
      { name: 'ISO 31000:2018', note: ['Quản lý rủi ro — nguyên tắc và hướng dẫn', 'Risk management — principles and guidelines'] },
    ],
    learn: [L.agile, L.PMG201c, L.git, L.gha, L.docker, L.SWP391],
    gate: ['CI xanh trên nhánh main; staging chạy được bản "hello world" end-to-end; kế hoạch có baseline.', 'CI green on main; staging serves an end-to-end "hello world"; plan baselined.'],
    team: [
      { dept: 'pm', role: ['kế hoạch, lịch sprint, sổ rủi ro, truyền thông', 'plan, sprint calendar, risks, communication'] },
      { dept: 'devops', role: ['CI/CD và các môi trường', 'CI/CD and environments'] },
      { dept: 'dev', role: ['repo, quy ước nhánh, khung dự án', 'repo, branching, project skeleton'] },
      { dept: 'qa', role: ['đồng thiết kế Definition of Done', 'co-designs the Definition of Done'] },
      { dept: 'pmo', role: ['duyệt baseline kế hoạch', 'approves the plan baseline'] },
      { dept: 'client', role: ['chỉ định Product Owner, theo dõi board', 'appoints the Product Owner, follows the board'] },
    ],
    raci: [
      { activity: ['Kế hoạch dự án & lịch sprint', 'Project plan & sprint calendar'], roles: { pm: 'A', dev: 'C', qa: 'C', pmo: 'C', client: 'C' } },
      { activity: ['Definition of Done', 'Definition of Done'], roles: { pm: 'A', qa: 'R', dev: 'R' } },
      { activity: ['Repo, quy ước nhánh, mẫu PR', 'Repo, branching, PR template'], roles: { dev: 'A', devops: 'C' } },
      { activity: ['CI & môi trường dev / staging / production', 'CI & dev / staging / production'], roles: { devops: 'A', infra: 'R', dev: 'C', sec: 'C' } },
      { activity: ['Sổ rủi ro & kế hoạch truyền thông', 'Risk register & communication plan'], roles: { pm: 'A', pmo: 'C', client: 'I' } },
    ],
    inputs: [
      ['SOW, SRS, SDD', 'SOW, SRS, SDD'],
      ['Backlog đã ưu tiên', 'Prioritised backlog'],
    ],
    entryCriteria: [
      ['SDD và API contract của sprint đầu đã khoá', 'SDD and first-sprint API contract frozen'],
      ['Đội và vai trò đã xác nhận', 'Team and roles confirmed'],
    ],
    exitCriteria: [
      ['Kế hoạch có baseline: phạm vi, lịch, nguồn lực, rủi ro', 'Baselined plan: scope, schedule, resources, risks'],
      ['Definition of Done đã thống nhất', 'Definition of Done agreed'],
      ['CI xanh trên main', 'CI green on main'],
      ['Staging chạy end-to-end bản "hello world"', 'Staging runs an end-to-end "hello world"'],
      ['Khách có quyền xem board công việc', 'Client has access to the work board'],
    ],
    checklist: [
      ['Nhánh main được bảo vệ: bắt buộc review và CI xanh', 'main protected: review and green CI required'],
      ['.env.example đủ biến; không có bí mật trong repo', '.env.example complete; no secrets in the repo'],
      ['Mỗi môi trường có cơ sở dữ liệu riêng', 'Each environment has its own database'],
      ['Lịch họp định kỳ đã gửi (daily, demo, retro, báo cáo tuần)', 'Recurring meetings scheduled (daily, demo, retro, weekly report)'],
      ['Mỗi rủi ro có người theo dõi và phương án', 'Each risk has an owner and a response'],
    ],
    templates: [D.pmp, D.comms, D.risk, D.weekly],
    pitfalls: [
      ['Bắt đầu code trước khi có CI → nợ kỹ thuật ngay từ đầu', 'Coding before CI exists → technical debt from day one'],
      ['Dùng chung CSDL giữa staging và production', 'Sharing a database between staging and production'],
      ['Definition of Done mơ hồ', 'A vague Definition of Done'],
      ['Không có baseline nên không đo được trễ bao nhiêu', 'No baseline, so slippage cannot be measured'],
    ],
    example: [
      'cuongthai.com: push lên nhánh main không còn tự động deploy. Hai workflow deploy chỉ chạy khi bấm tay, vì từng có lúc chúng chạy đua nhau trên mỗi lần push và gây sự cố thật (feed lỗi 500 khi schema chậm hơn ảnh, container bị tạo lại giữa chừng). Deploy là một script chạy có chủ đích, không phải tác dụng phụ của push.',
      'cuongthai.com: pushing to main no longer deploys. Both deploy workflows are manual-only because they once raced each other on every push and caused real outages (feed 500s while the schema lagged the image, containers recreated mid-flight). Deploying is a deliberate script, not a side effect of pushing.',
    ],
  },
  // ══ 09 ═════════════════════════════════════════════════════════════════
  {
    slug: 'phat-trien',
    phase: 'build',
    title: ['Phát triển', 'Development'],
    short: ['BE · FE · mobile · AI', 'BE · FE · mobile · AI'],
    goal: [
      'Làm ra phần mềm chạy được theo từng lát mỏng, mỗi sprint có thứ để khách bấm thử, mỗi dòng mã đều qua review.',
      'Ship working software in thin slices — something the client can click every sprint, every line reviewed.',
    ],
    activities: [
      ['Backend: API, nghiệp vụ, migration cơ sở dữ liệu có phiên bản', 'Backend: APIs, business logic, versioned DB migrations'],
      ['Frontend / mobile: giao diện theo design system, xử lý trạng thái tải / lỗi / rỗng', 'Frontend / mobile: UI from the design system, loading / error / empty states'],
      ['AI (nếu có): prompt có phiên bản, bộ đánh giá (eval), giới hạn chi phí', 'AI (if any): versioned prompts, eval sets, cost ceilings'],
      ['Nhánh ngắn theo tính năng → Pull Request → review → merge', 'Short feature branches → Pull Request → review → merge'],
      ['Demo cuối sprint; mọi thay đổi phạm vi đi qua phiếu CR', 'End-of-sprint demo; every scope change goes through a CR'],
    ],
    deliverables: [
      ['Mã nguồn trong repo, lịch sử commit sạch', 'Source code in the repo with a clean history'],
      ['Bản build staging sau mỗi sprint + ghi chú thay đổi', 'Staging build every sprint + change notes'],
      ['Tài liệu API cập nhật, sổ tay dev', 'Updated API docs, developer handbook'],
      ['Báo cáo tiến độ tuần', 'Weekly status reports'],
    ],
    client: [
      ['Dự demo cuối sprint, thử trên staging, phản hồi trong 2–3 ngày', 'Attend sprint demos, try staging, reply within 2–3 days'],
      ['Ưu tiên lại backlog; duyệt hoặc từ chối phiếu CR', 'Re-prioritise the backlog; approve or reject CRs'],
    ],
    tools: ['TypeScript · Node.js · Next.js', 'Java · Spring Boot', 'React Native', 'PostgreSQL · Prisma', 'VS Code · Claude Code'],
    standards: [
      { name: 'Google Engineering Practices — Code Review', note: ['Hướng dẫn review mã: người review nhìn gì, PR nhỏ thế nào', 'What reviewers look for, how to keep PRs small'] },
      { name: 'GitHub Flow / trunk-based', note: ['Nhánh ngắn, merge thường xuyên, main luôn deploy được', 'Short-lived branches, frequent merges, main always deployable'] },
      { name: 'ISO/IEC 27001:2022 — Annex A 8.25–8.28', note: ['Vòng đời phát triển an toàn và lập trình an toàn', 'Secure development life cycle and secure coding'] },
    ],
    learn: [L.PRJ301, L.spring, L.node, L.next, L.react, L.rn, L.ts, L.prisma, L.llm, L.fullstack],
    gate: ['Mỗi story đạt Definition of Done: review xong, có test, chạy trên staging.', 'Each story meets DoD: reviewed, tested, running on staging.'],
    team: [
      { dept: 'dev', role: ['viết mã, review chéo, migration', 'writes code, peer review, migrations'] },
      { dept: 'data', role: ['tính năng AI / dữ liệu: prompt, eval, trần chi phí', 'AI / data features: prompts, evals, cost caps'] },
      { dept: 'qa', role: ['viết test song song, kiểm story theo DoD', 'writes tests alongside, checks stories against DoD'] },
      { dept: 'arch', role: ['review thiết kế trong PR lớn', 'design review on larger PRs'] },
      { dept: 'pm', role: ['điều phối sprint, demo, CR', 'runs sprints, demos, CRs'] },
      { dept: 'client', role: ['dự demo, phản hồi, duyệt CR', 'attends demos, gives feedback, approves CRs'] },
    ],
    raci: [
      { activity: ['Phát triển backend & migration', 'Backend & migrations'], roles: { dev: 'A', arch: 'C' } },
      { activity: ['Phát triển frontend / mobile', 'Frontend / mobile'], roles: { dev: 'A', ux: 'C' } },
      { activity: ['Tính năng AI: prompt, eval, trần chi phí', 'AI features: prompts, evals, cost caps'], roles: { data: 'A', dev: 'R', sec: 'C' } },
      { activity: ['Code review & merge', 'Code review & merge'], roles: { dev: 'A', arch: 'C', sec: 'C' } },
      { activity: ['Demo cuối sprint', 'Sprint demo'], roles: { pm: 'A', dev: 'R', client: 'C' } },
      { activity: ['Xử lý yêu cầu thay đổi (CR)', 'Change request handling'], roles: { pm: 'A', ba: 'R', client: 'C' } },
    ],
    inputs: [
      ['Backlog sprint với tiêu chí chấp nhận', 'Sprint backlog with acceptance criteria'],
      ['Mockup, design tokens, API contract', 'Mockups, design tokens, API contract'],
      ['Definition of Done', 'Definition of Done'],
    ],
    entryCriteria: [
      ['CI xanh, môi trường staging sẵn sàng', 'Green CI, staging ready'],
      ['Story trong sprint có tiêu chí chấp nhận và thiết kế đã duyệt', 'Sprint stories have acceptance criteria and approved designs'],
    ],
    exitCriteria: [
      ['Mọi story hoàn thành đạt Definition of Done', 'Every completed story meets the Definition of Done'],
      ['Demo cuối sprint đã diễn ra, phản hồi đã ghi', 'Sprint demo held, feedback recorded'],
      ['Không còn lỗi mức nghiêm trọng mở trong phần đã làm', 'No open critical defects in delivered work'],
      ['Tài liệu API và sổ tay dev được cập nhật', 'API docs and developer handbook updated'],
    ],
    checklist: [
      ['PR nhỏ, có mô tả và liên kết tới story', 'Small PRs with a description and a link to the story'],
      ['Có unit test cho nghiệp vụ mới', 'Unit tests for new business logic'],
      ['Migration chạy được trên bản sao dữ liệu thật', 'Migrations run against a copy of real data'],
      ['Không ghi log dữ liệu cá nhân hay bí mật', 'No personal data or secrets in logs'],
      ['Tính năng AI có trần chi phí và đường lùi khi nhà cung cấp lỗi', 'AI features have a cost cap and a fallback when the provider fails'],
      ['Chạy đủ bộ kiểm trên bản cuối trước khi commit', 'Full checks run on the final version before committing'],
    ],
    templates: [D.cr, D.weekly],
    pitfalls: [
      ['PR khổng lồ, review cho có', 'Huge PRs reviewed superficially'],
      ['"Chạy trên máy tôi" nhưng chưa chạy trên staging', '"Works on my machine" but never ran on staging'],
      ['Sửa theo yêu cầu miệng, không qua CR', 'Changing scope on verbal requests without a CR'],
      ['Tin rằng kiểm kiểu xanh là build xanh', 'Assuming a green type-check means a green build'],
    ],
    example: [
      'cuongthai.com, 08/08/2026: đổi tên một giá trị enum đi qua hết danh sách kiểm mà vẫn làm vỡ script seed trên production — vì `tsc --noEmit` không kiểm thư mục seed, còn seed tự chép lại kiểu của riêng nó. Từ đó danh sách kiểm có thêm bước kiểm kiểu riêng cho seed và chạy seed thật. Kiểm bằng cách chạy, không chỉ bằng đọc.',
      'cuongthai.com, 8 Aug 2026: renaming an enum value passed the whole checklist yet broke the seed script in production — `tsc --noEmit` did not cover the seed folder, and the seed carried its own copy of the type. The checklist now has a separate seed type-check and a real seed run. Verify by running, not just by reading.',
    ],
  },
  // ══ 10 ═════════════════════════════════════════════════════════════════
  {
    slug: 'chuyen-du-lieu',
    phase: 'build',
    title: ['Chuyển đổi & di trú dữ liệu', 'Data migration'],
    short: ['Ánh xạ · chạy thử · đối soát', 'Mapping · rehearsal · reconciliation'],
    goal: [
      'Đưa dữ liệu từ hệ thống cũ sang hệ thống mới đầy đủ, đúng và hợp pháp — được tập dượt nhiều lần trước ngày thật và luôn có đường quay lui.',
      'Move data from the old system to the new one completely, correctly and lawfully — rehearsed several times before the real day, always with a way back.',
    ],
    activities: [
      ['Kiểm kê nguồn dữ liệu: bảng, khối lượng, chất lượng, chủ sở hữu, dữ liệu cá nhân', 'Inventory source data: tables, volume, quality, owners, personal data'],
      ['Lập bảng ánh xạ trường (field mapping), quy tắc làm sạch và chuyển đổi, cách xử lý trùng / thiếu', 'Build the field mapping, cleansing and transformation rules, duplicate / missing handling'],
      ['Viết script chuyển đổi chạy lại được (idempotent), ghi log từng lô', 'Write re-runnable (idempotent) migration scripts with per-batch logs'],
      ['Chạy thử (rehearsal) trên bản sao dữ liệu ít nhất hai lần, đo thời gian', 'Rehearse on a data copy at least twice and time it'],
      ['Đối soát: số bản ghi, tổng kiểm (checksum), mẫu ngẫu nhiên do người dùng nghiệp vụ kiểm', 'Reconcile: record counts, checksums, random samples checked by business users'],
      ['Lập kế hoạch cutover: đóng băng dữ liệu, thứ tự bước, điểm quyết định tiếp tục / quay lui', 'Plan the cutover: data freeze, step order, go / roll-back decision points'],
    ],
    deliverables: [
      ['Kế hoạch chuyển dữ liệu và bảng ánh xạ', 'Migration plan and field mapping'],
      ['Script chuyển đổi + log các lần chạy thử', 'Migration scripts + rehearsal logs'],
      ['Báo cáo đối soát có xác nhận của người dùng nghiệp vụ', 'Reconciliation report signed by business users'],
      ['Kế hoạch cutover và quay lui', 'Cutover and roll-back plan'],
    ],
    client: [
      ['Chỉ định chủ sở hữu dữ liệu', 'Name a data owner'],
      ['Quyết định dữ liệu nào giữ, dữ liệu nào bỏ', 'Decide which data to keep and which to drop'],
      ['Kiểm mẫu đối soát và bảo đảm cơ sở pháp lý khi chuyển dữ liệu cá nhân', 'Check reconciliation samples and ensure a lawful basis for moving personal data'],
    ],
    tools: ['pg_dump / pg_restore', 'SQL · Node.js · Python script', 'Google Sheets (bảng ánh xạ)', 'CSV / Excel'],
    standards: [
      { name: 'DAMA-DMBOK2 (DAMA International)', note: ['Khung tri thức quản lý dữ liệu: chất lượng, tích hợp, di trú dữ liệu', 'Data management body of knowledge: quality, integration, migration'] },
      { name: 'ISO/IEC 25012:2008', note: ['Mô hình chất lượng dữ liệu: chính xác, đầy đủ, nhất quán, kịp thời…', 'Data quality model: accuracy, completeness, consistency, currency…'] },
      { name: 'Luật Bảo vệ dữ liệu cá nhân 2025 (91/2025/QH15) và Nghị định 356/2025/NĐ-CP', note: ['Chuyển dữ liệu cá nhân sang hệ mới cũng là "xử lý" — cần cơ sở và mục đích hợp pháp', 'Moving personal data to a new system is "processing" — it needs a lawful basis and purpose'] },
    ],
    learn: [L.DBI202, L.pg, L.prisma, L.dataeng, L.privacy],
    gate: ['Ít nhất một lần chạy thử đầy đủ có đối soát khớp; kế hoạch cutover và quay lui được duyệt.', 'At least one full rehearsal reconciles; cutover and roll-back plan approved.'],
    team: [
      { dept: 'data', role: ['chủ trì ánh xạ, script, chạy thử', 'owns mapping, scripts, rehearsals'] },
      { dept: 'ba', role: ['quy tắc nghiệp vụ cho chuyển đổi', 'business rules for transformation'] },
      { dept: 'dev', role: ['viết và tối ưu script', 'writes and tunes scripts'] },
      { dept: 'qa', role: ['đối soát, kiểm mẫu', 'reconciliation, sampling'] },
      { dept: 'devops', role: ['kế hoạch cutover, sao lưu, quay lui', 'cutover plan, backups, roll-back'] },
      { dept: 'sec', role: ['bảo vệ dữ liệu cá nhân trong quá trình chuyển', 'protects personal data in transit'] },
      { dept: 'client', role: ['chủ sở hữu dữ liệu, xác nhận đối soát', 'data owner, signs off reconciliation'] },
    ],
    raci: [
      { activity: ['Kiểm kê & đánh giá chất lượng dữ liệu nguồn', 'Source data inventory & quality assessment'], roles: { data: 'A', ba: 'R', client: 'C' } },
      { activity: ['Bảng ánh xạ & quy tắc chuyển đổi', 'Field mapping & transformation rules'], roles: { data: 'A', ba: 'R', client: 'C' } },
      { activity: ['Script chuyển đổi & chạy thử', 'Migration scripts & rehearsals'], roles: { data: 'A', dev: 'R', sec: 'C' } },
      { activity: ['Đối soát & xác nhận kết quả', 'Reconciliation & sign-off'], roles: { client: 'A', qa: 'R', data: 'R' } },
      { activity: ['Kế hoạch cutover & quay lui', 'Cutover & roll-back plan'], roles: { devops: 'A', data: 'R', pm: 'C', client: 'C' } },
    ],
    inputs: [
      ['Danh sách hệ thống nguồn và dữ liệu cần chuyển (từ khảo sát)', 'Source systems and data to migrate (from discovery)'],
      ['ERD và migration schema của hệ thống mới', 'New system ERD and schema migrations'],
      ['Bản sao dữ liệu nguồn (ẩn danh khi cần)', 'Copy of source data (anonymised where needed)'],
    ],
    entryCriteria: [
      ['ERD và schema đã ổn định cho phạm vi cần chuyển', 'ERD and schema stable for the migrated scope'],
      ['Có quyền truy cập bản sao dữ liệu nguồn', 'Access to a copy of the source data'],
      ['Chủ sở hữu dữ liệu phía khách đã được chỉ định', 'Client data owner appointed'],
    ],
    exitCriteria: [
      ['Bảng ánh xạ phủ 100% trường trong phạm vi', 'Mapping covers 100% of in-scope fields'],
      ['Ít nhất một lần chạy thử đầy đủ: số lượng và checksum khớp', 'At least one full rehearsal with matching counts and checksums'],
      ['Lỗi dữ liệu còn lại được khách chấp nhận bằng văn bản', 'Remaining data issues accepted by the client in writing'],
      ['Thời gian cutover đo được và vừa cửa sổ bảo trì', 'Cutover time measured and fits the maintenance window'],
      ['Kế hoạch quay lui đã được thử', 'Roll-back plan tested'],
    ],
    checklist: [
      ['Chỉ chuyển những trường dữ liệu cá nhân thật sự cần (tối thiểu hoá)', 'Only personal-data fields that are truly needed are moved (minimisation)'],
      ['Script chạy lại không nhân đôi bản ghi', 'Re-running scripts never duplicates records'],
      ['Khoá ngoại và ràng buộc được kiểm sau khi nạp', 'Foreign keys and constraints checked after load'],
      ['Múi giờ, mã hoá ký tự, định dạng số / tiền tệ được xử lý', 'Time zones, character encoding, number / currency formats handled'],
      ['Có backup hệ thống cũ ngay trước cutover', 'Old system backed up right before cutover'],
      ['Bản sao dữ liệu dùng để thử được xoá sau khi xong', 'Rehearsal data copies deleted afterwards'],
    ],
    templates: [D.migration],
    pitfalls: [
      ['Chuyển dữ liệu ngay ngày go-live mà chưa tập dượt', 'Migrating on go-live day without a rehearsal'],
      ['Chỉ đếm số bản ghi mà không kiểm nội dung', 'Counting records without checking content'],
      ['Chép sang bảng mới mà không xử lý bảng cũ → dữ liệu trùng ở hai nơi', 'Copying into new tables without retiring the old ones → duplicates in two places'],
      ['Dùng dữ liệu thật chưa ẩn danh trên máy dev', 'Using real, non-anonymised data on developer machines'],
    ],
    example: [
      'cuongthai.com, 25/08/2026: đợt gộp blog sang bảng bài viết mới đã chép nội dung nhưng không xử lý bảng cũ, nên cùng một slug tồn tại ở cả hai nơi và cả hai đường dẫn đều trả 200. Đọc mã thì "không thể" xảy ra; dữ liệu thì có. Từ đó, đối soát sau chuyển dữ liệu luôn làm bằng truy vấn và lệnh gọi thật, không suy ra từ mã.',
      'cuongthai.com, 25 Aug 2026: merging the blog into a new articles table copied the content but left the old table in place, so the same slug existed in both and both URLs returned 200. The code said it "could not" happen; the data said it did. Since then post-migration reconciliation is done with real queries and requests, never inferred from code.',
    ],
  },
  // ══ 11 ═════════════════════════════════════════════════════════════════
  {
    slug: 'kiem-thu',
    phase: 'verify',
    title: ['Kiểm thử', 'Testing'],
    short: ['Unit → system → tải', 'Unit → system → load'],
    goal: [
      'Tìm lỗi trước khách hàng — ở mọi tầng, tự động hoá phần lặp lại, và đo được mức độ bao phủ.',
      'Find defects before the client does — at every level, automating what repeats, with measurable coverage.',
    ],
    activities: [
      ['Unit test cho nghiệp vụ; integration test cho API + cơ sở dữ liệu', 'Unit tests for logic; integration tests for API + database'],
      ['System / end-to-end test cho các luồng chính trên trình duyệt thật', 'System / end-to-end tests of key flows in a real browser'],
      ['Kiểm thử hiệu năng & tải theo NFR đã chốt', 'Performance & load tests against the agreed NFRs'],
      ['Kiểm thử hồi quy tự động trong CI', 'Automated regression in CI'],
      ['Kiểm tra truy cập (a11y) và nhiều thiết bị', 'Accessibility and cross-device checks'],
    ],
    deliverables: [
      ['Test plan + bộ test case (truy vết về yêu cầu)', 'Test plan + test cases (traced to requirements)'],
      ['Báo cáo kiểm thử: pass/fail, lỗi còn mở theo mức độ', 'Test report: pass/fail, open defects by severity'],
      ['Báo cáo tải: thông lượng, độ trễ p95', 'Load test report: throughput, p95 latency'],
    ],
    client: [
      ['Cung cấp dữ liệu và kịch bản thực tế để test', 'Provide realistic data and scenarios'],
      ['Thống nhất mức lỗi nào chặn phát hành', 'Agree which severity blocks a release'],
    ],
    tools: ['Vitest / Jest', 'JUnit 5', 'Playwright', 'Postman / Newman', 'k6'],
    standards: [
      { name: 'ISTQB® CTFL v4.0', note: ['Thuật ngữ, cấp độ và kỹ thuật thiết kế test', 'Test levels, types and design techniques'] },
      { name: 'ISO/IEC/IEEE 29119', note: ['Bộ chuẩn quy trình & tài liệu kiểm thử phần mềm', 'Software testing processes and documentation'] },
    ],
    learn: [L.SWT301, L.testing, L.perf],
    gate: ['Không còn lỗi mức nghiêm trọng/cao; NFR hiệu năng đạt.', 'No open critical/high defects; performance NFRs met.'],
    team: [
      { dept: 'qa', role: ['kế hoạch kiểm thử, test case, báo cáo', 'test plan, test cases, reporting'] },
      { dept: 'dev', role: ['unit / integration test, sửa lỗi', 'unit / integration tests, fixes'] },
      { dept: 'devops', role: ['môi trường và công cụ kiểm thử tải', 'load-test environment and tooling'] },
      { dept: 'ba', role: ['tham vấn kịch bản nghiệp vụ', 'consulted on business scenarios'] },
      { dept: 'client', role: ['dữ liệu thực tế, mức lỗi chặn phát hành', 'realistic data, release-blocking severity'] },
    ],
    raci: [
      { activity: ['Kế hoạch kiểm thử', 'Test plan'], roles: { qa: 'A', pm: 'C', ba: 'C' } },
      { activity: ['Thiết kế test case truy vết về yêu cầu', 'Test case design traced to requirements'], roles: { qa: 'A', ba: 'C' } },
      { activity: ['Unit & integration test', 'Unit & integration tests'], roles: { dev: 'A', qa: 'C' } },
      { activity: ['System / E2E, hồi quy, truy cập', 'System / E2E, regression, accessibility'], roles: { qa: 'A', dev: 'C' } },
      { activity: ['Kiểm thử hiệu năng & tải', 'Performance & load testing'], roles: { qa: 'A', devops: 'R', arch: 'C' } },
      { activity: ['Báo cáo & phân loại lỗi', 'Defect reporting & triage'], roles: { qa: 'A', dev: 'R', pm: 'I', client: 'I' } },
    ],
    inputs: [
      ['SRS, tiêu chí chấp nhận, RTM', 'SRS, acceptance criteria, RTM'],
      ['Bản build ổn định trên staging', 'Stable build on staging'],
    ],
    entryCriteria: [
      ['Build ổn định trên staging, smoke test xanh', 'Stable staging build with green smoke tests'],
      ['Test plan đã được duyệt', 'Test plan approved'],
      ['Dữ liệu kiểm thử đã sẵn sàng', 'Test data ready'],
    ],
    exitCriteria: [
      ['100% test case ưu tiên cao đã chạy', '100% of high-priority test cases executed'],
      ['Không còn lỗi Critical/High mở', 'No open Critical/High defects'],
      ['NFR hiệu năng đạt (vd độ trễ p95 theo cam kết)', 'Performance NFRs met (e.g. committed p95 latency)'],
      ['Báo cáo kiểm thử đã phát hành; RTM cập nhật kết quả', 'Test report issued; RTM updated with results'],
    ],
    checklist: [
      ['Mỗi yêu cầu có ít nhất một test case', 'Every requirement has at least one test case'],
      ['Mỗi lỗi có bước tái hiện, mức độ và ưu tiên', 'Every defect has repro steps, severity and priority'],
      ['Bộ hồi quy tự động chạy trong CI', 'Automated regression runs in CI'],
      ['Đã test trên các trình duyệt / thiết bị đã cam kết', 'Tested on the committed browsers / devices'],
      ['Dữ liệu kiểm thử không chứa dữ liệu cá nhân thật', 'Test data contains no real personal data'],
      ['Lỗi đã sửa được kiểm lại (re-test) và hồi quy', 'Fixed defects re-tested and regressed'],
    ],
    templates: [D.testPlan, D.testCase, D.testReport],
    pitfalls: [
      ['Chỉ test đường thuận lợi (happy path)', 'Testing only the happy path'],
      ['Dồn kiểm thử về cuối dự án', 'Leaving testing to the end'],
      ['Đo bao phủ dòng mã mà không đo bao phủ yêu cầu', 'Measuring line coverage but not requirement coverage'],
      ['Bộ kiểm "xanh" vì kiểm sai thứ', 'A "green" suite that checks the wrong thing'],
    ],
    example: [
      'cuongthai.com, 30/07/2026: một chốt kiểm HTTP trong script triển khai gọi `wget` bên trong container frontend — nơi không hề cài `wget`. Lệnh luôn thất bại, vòng lặp chạy đủ số lần thử, tốn khoảng 25 giây mỗi lần deploy và không kiểm được gì. Bài học cho kiểm thử: kiểm chính bộ kiểm trước khi tin kết quả của nó.',
      'cuongthai.com, 30 Jul 2026: an HTTP check in the deploy script called `wget` inside the frontend container, which has no `wget`. It always failed, looped through every retry, cost about 25 seconds per deploy and verified nothing. The testing lesson: test the checker before trusting its verdict.',
    ],
  },
  // ══ 12 ═════════════════════════════════════════════════════════════════
  {
    slug: 'bao-mat',
    phase: 'verify',
    title: ['Bảo mật', 'Security'],
    short: ['ASVS · quét · bí mật', 'ASVS · scans · secrets'],
    goal: [
      'Bảo mật là yêu cầu, không phải bước trang trí: kiểm theo danh mục có sẵn, quét tự động, không để lộ bí mật, và xử lý dữ liệu cá nhân đúng luật.',
      'Security is a requirement, not decoration: verify against a checklist, scan automatically, never leak secrets, and handle personal data lawfully.',
    ],
    activities: [
      ['Rà soát mã tập trung vào xác thực, phân quyền, nhập liệu, upload', 'Security-focused code review: authn, authz, input, uploads'],
      ['Quét phụ thuộc (SCA) và mã tĩnh (SAST) trong CI', 'Dependency (SCA) and static (SAST) scans in CI'],
      ['Kiểm tra theo OWASP ASVS mức phù hợp (thường L1–L2)', 'Verify against OWASP ASVS at a fitting level (usually L1–L2)'],
      ['Quản lý bí mật: không commit khoá, xoay vòng khoá, quyền tối thiểu', 'Secrets management: nothing in git, key rotation, least privilege'],
      ['Quét động (DAST) trên staging trước go-live', 'Dynamic scan (DAST) on staging before go-live'],
      ['Đánh giá tác động xử lý dữ liệu cá nhân khi hệ thống xử lý dữ liệu cá nhân', 'Personal-data processing impact assessment when the system handles personal data'],
    ],
    deliverables: [
      ['Checklist ASVS đã đánh dấu + bằng chứng', 'Completed ASVS checklist + evidence'],
      ['Báo cáo quét & danh sách lỗ hổng đã xử lý', 'Scan reports & remediation list'],
      ['Chính sách quản lý bí mật và phân quyền', 'Secrets & access policy'],
      ['Hồ sơ đánh giá tác động xử lý dữ liệu cá nhân (nếu áp dụng)', 'Personal-data impact assessment (if applicable)'],
    ],
    client: [
      ['Cho biết yêu cầu tuân thủ (dữ liệu cá nhân, thanh toán…)', 'State compliance needs (personal data, payments…)'],
      ['Tự giữ tài khoản gốc (root) của các dịch vụ', 'Keep ownership of root accounts for all services'],
      ['Ký chấp nhận rủi ro bằng văn bản với lỗ hổng chưa xử lý (nếu có)', 'Sign a written risk acceptance for any unresolved finding'],
    ],
    tools: ['npm audit / Dependabot', 'Semgrep', 'gitleaks', 'Trivy', 'OWASP ZAP'],
    standards: [
      { name: 'OWASP ASVS 5.0', note: ['Tiêu chuẩn kiểm chứng bảo mật ứng dụng', 'Application Security Verification Standard'] },
      { name: 'OWASP Top 10', note: ['10 nhóm rủi ro web phổ biến nhất', 'Most common web application risks'] },
      { name: 'NIST SP 800-218 (SSDF)', note: ['Khung phát triển phần mềm an toàn', 'Secure Software Development Framework'] },
      { name: 'CWE Top 25', note: ['Các điểm yếu phần mềm nguy hiểm nhất', 'Most dangerous software weaknesses'] },
      { name: 'Luật Bảo vệ dữ liệu cá nhân 2025 (91/2025/QH15) và Nghị định 356/2025/NĐ-CP', note: ['Biện pháp bảo vệ và hồ sơ đánh giá tác động xử lý dữ liệu cá nhân', 'Protection measures and personal-data processing impact assessment'] },
    ],
    learn: [L.websec, L.auth, L.devsecops, L.threat, L.privacy],
    gate: ['Không còn lỗ hổng mức cao; mọi bí mật nằm ngoài repo.', 'No high-severity findings; all secrets outside the repo.'],
    team: [
      { dept: 'sec', role: ['review bảo mật, ASVS, quét, DAST', 'security review, ASVS, scans, DAST'] },
      { dept: 'dev', role: ['vá lỗ hổng', 'fixes findings'] },
      { dept: 'devops', role: ['quản lý bí mật, quét trong CI', 'secrets management, CI scanning'] },
      { dept: 'infra', role: ['quyền tối thiểu trên hạ tầng', 'least privilege on infrastructure'] },
      { dept: 'legal', role: ['tuân thủ dữ liệu cá nhân', 'personal-data compliance'] },
      { dept: 'client', role: ['nêu yêu cầu tuân thủ, giữ tài khoản gốc', 'states compliance needs, keeps root accounts'] },
    ],
    raci: [
      { activity: ['Review mã tập trung bảo mật', 'Security code review'], roles: { sec: 'A', dev: 'R' } },
      { activity: ['SCA / SAST trong CI', 'SCA / SAST in CI'], roles: { sec: 'A', devops: 'R', dev: 'C' } },
      { activity: ['Kiểm theo OWASP ASVS', 'Verify against OWASP ASVS'], roles: { sec: 'A', qa: 'R', dev: 'C' } },
      { activity: ['Quản lý bí mật & quyền tối thiểu', 'Secrets & least privilege'], roles: { devops: 'A', infra: 'R', sec: 'C' } },
      { activity: ['DAST trên staging', 'DAST on staging'], roles: { sec: 'A', qa: 'C' } },
      { activity: ['Đánh giá tác động dữ liệu cá nhân', 'Personal-data impact assessment'], roles: { legal: 'A', sec: 'R', client: 'C' } },
    ],
    inputs: [
      ['Threat model và SDD', 'Threat model and SDD'],
      ['Bản build trên staging', 'Staging build'],
      ['Yêu cầu tuân thủ của khách', 'Client compliance requirements'],
    ],
    entryCriteria: [
      ['Tính năng chính đã chạy trên staging', 'Main features running on staging'],
      ['Threat model đã cập nhật theo thiết kế hiện tại', 'Threat model updated to the current design'],
    ],
    exitCriteria: [
      ['Không còn lỗ hổng Critical/High mở, hoặc có chấp nhận rủi ro bằng văn bản', 'No open Critical/High findings, or written risk acceptance'],
      ['Checklist ASVS ở mức đã thống nhất hoàn thành, có bằng chứng', 'ASVS checklist at the agreed level completed with evidence'],
      ['Không có bí mật trong lịch sử git', 'No secrets in git history'],
      ['Không còn CVE nghiêm trọng đã có bản vá trong phụ thuộc', 'No critical dependency CVEs that already have a fix'],
      ['Hồ sơ đánh giá tác động dữ liệu cá nhân đã lập (nếu áp dụng)', 'Personal-data impact assessment prepared (if applicable)'],
    ],
    checklist: [
      ['Mật khẩu băm bằng thuật toán chậm (Argon2id / bcrypt)', 'Passwords hashed with a slow algorithm (Argon2id / bcrypt)'],
      ['Phân quyền được kiểm ở server cho mọi API', 'Authorisation enforced server-side on every API'],
      ['Rate limit cho đăng nhập và API công khai', 'Rate limits on login and public APIs'],
      ['Header bảo mật (CSP, HSTS…) đã bật', 'Security headers (CSP, HSTS…) enabled'],
      ['Upload kiểm loại tệp, kích thước và lưu ngoài web root', 'Uploads checked for type and size, stored outside the web root'],
      ['Log không chứa bí mật hay dữ liệu cá nhân', 'Logs contain no secrets or personal data'],
    ],
    templates: [D.security],
    pitfalls: [
      ['Ẩn nút trên giao diện mà không chặn API', 'Hiding a button in the UI without blocking the API'],
      ['Khoá API bên thứ ba nằm trong mã gửi về trình duyệt', 'Third-party API keys shipped in browser code'],
      ['Quét một lần trước go-live rồi thôi', 'Scanning once before go-live and never again'],
      ['Chấp nhận rủi ro bằng lời', 'Accepting risk verbally'],
    ],
    example: [
      'cuongthai.com: khoá API bên thứ ba không bao giờ đặt trong biến `NEXT_PUBLIC_*` (bị nhúng vào gói JS gửi cho trình duyệt) — mọi dịch vụ bên thứ ba đi qua một route proxy có xác thực ở backend. SSH vào máy chủ chỉ bằng khoá; tắt đăng nhập mật khẩu được nghiệm thu bằng `sshd -T` (giá trị đang hiệu lực), không bằng việc đọc lại file vừa ghi.',
      'cuongthai.com: third-party API keys never go into `NEXT_PUBLIC_*` variables (they get baked into browser JavaScript) — every third-party service goes through an authenticated backend proxy route. SSH is key-only; disabling password login was verified with `sshd -T` (the effective value), not by re-reading the file just written.',
    ],
  },
  // ══ 13 ═════════════════════════════════════════════════════════════════
  {
    slug: 'ha-tang-devops',
    phase: 'verify',
    title: ['Hạ tầng, mạng & DevOps', 'Infrastructure, network & DevOps'],
    short: ['DNS · SSL · CDN · giám sát', 'DNS · TLS · CDN · monitoring'],
    goal: [
      'Chuẩn bị nơi sản phẩm sẽ sống: tên miền, chứng chỉ, CDN, container, giám sát và sao lưu — dựng lại được từ mã.',
      'Prepare where the product will live: domain, certificates, CDN, containers, monitoring and backups — reproducible from code.',
    ],
    activities: [
      ['Đăng ký / trỏ tên miền, cấu hình DNS, email (SPF/DKIM/DMARC)', 'Register / point the domain, DNS records, email auth (SPF/DKIM/DMARC)'],
      ['HTTPS tự gia hạn, CDN + tường lửa ứng dụng, reverse proxy', 'Auto-renewing HTTPS, CDN + WAF, reverse proxy'],
      ['Đóng gói container, pipeline triển khai có kiểm tra sau deploy (smoke test)', 'Containerise, deployment pipeline with post-deploy smoke tests'],
      ['Hạ tầng dưới dạng mã (IaC) để dựng lại nhanh', 'Infrastructure as Code for quick rebuilds'],
      ['Giám sát: log, số đo, cảnh báo; sao lưu 3-2-1 và thử khôi phục thật', 'Monitoring: logs, metrics, alerts; 3-2-1 backups with a real restore test'],
    ],
    deliverables: [
      ['Sơ đồ hạ tầng & mạng', 'Infrastructure & network diagram'],
      ['Script / IaC triển khai, runbook vận hành', 'Deployment scripts / IaC, operations runbook'],
      ['Dashboard giám sát + kênh cảnh báo', 'Monitoring dashboard + alert channel'],
      ['Kế hoạch sao lưu & biên bản thử khôi phục', 'Backup plan & restore-test record'],
    ],
    client: [
      ['Sở hữu tên miền và tài khoản cloud đứng tên mình', 'Own the domain and cloud accounts in their name'],
      ['Duyệt chi phí hạ tầng hằng tháng', 'Approve monthly infrastructure cost'],
    ],
    tools: ['Cloudflare (DNS, CDN, R2)', 'Docker · Nginx', 'Let’s Encrypt', 'GitHub Actions', 'Terraform / Ansible', 'Grafana · Sentry'],
    standards: [
      { name: 'RFC 8555 (ACME)', note: ['Giao thức cấp chứng chỉ TLS tự động', 'Automatic TLS certificate issuance'] },
      { name: 'Google SRE — SLI / SLO', note: ['Định nghĩa mức dịch vụ đo được', 'Measurable service level objectives'] },
      { name: 'DORA metrics', note: ['Tần suất deploy, lead time, tỉ lệ lỗi thay đổi, thời gian khôi phục', 'Deploy frequency, lead time, change failure rate, time to restore'] },
    ],
    learn: [L.deploy, L.docker, L.nginx, L.gha, L.iac, L.obs, L.net, L.linux, L.selfhost, L.netsec],
    gate: ['Staging giống production; đã thử khôi phục từ backup thành công.', 'Staging mirrors production; a restore from backup has succeeded.'],
    team: [
      { dept: 'devops', role: ['pipeline, container, giám sát, sao lưu', 'pipeline, containers, monitoring, backups'] },
      { dept: 'infra', role: ['DNS, TLS, CDN, mạng, tường lửa', 'DNS, TLS, CDN, network, firewall'] },
      { dept: 'sec', role: ['cấu hình an toàn, header, quyền', 'secure configuration, headers, access'] },
      { dept: 'dev', role: ['health check, cấu hình ứng dụng', 'health checks, app configuration'] },
      { dept: 'client', role: ['sở hữu tài khoản, duyệt chi phí', 'owns accounts, approves cost'] },
    ],
    raci: [
      { activity: ['Tên miền, DNS, xác thực email', 'Domain, DNS, email authentication'], roles: { infra: 'A', client: 'C' } },
      { activity: ['TLS, CDN / WAF, reverse proxy', 'TLS, CDN / WAF, reverse proxy'], roles: { infra: 'A', sec: 'C', devops: 'C' } },
      { activity: ['Container & pipeline triển khai', 'Containers & deployment pipeline'], roles: { devops: 'A', dev: 'C' } },
      { activity: ['Hạ tầng dưới dạng mã (IaC)', 'Infrastructure as Code'], roles: { devops: 'A', infra: 'R' } },
      { activity: ['Giám sát, cảnh báo, SLO', 'Monitoring, alerting, SLOs'], roles: { devops: 'A', dev: 'C', client: 'C' } },
      { activity: ['Sao lưu & thử khôi phục', 'Backups & restore test'], roles: { devops: 'A', infra: 'R', data: 'C' } },
    ],
    inputs: [
      ['Sơ đồ triển khai trong SDD', 'Deployment view from the SDD'],
      ['NFR về khả dụng, SLO, RPO / RTO', 'Availability NFRs, SLOs, RPO / RTO'],
      ['Ngân sách hạ tầng đã duyệt', 'Approved infrastructure budget'],
    ],
    entryCriteria: [
      ['Sơ đồ triển khai và ngân sách hạ tầng đã duyệt', 'Deployment view and infrastructure budget approved'],
      ['Tài khoản cloud và tên miền đứng tên khách', 'Cloud accounts and domain in the client’s name'],
    ],
    exitCriteria: [
      ['Staging tương đương production (cùng ảnh, khác dữ liệu)', 'Staging equivalent to production (same image, different data)'],
      ['Deploy tự động, có smoke test sau deploy', 'Automated deploy with post-deploy smoke tests'],
      ['Giám sát và cảnh báo tới đúng người', 'Monitoring and alerts reach the right people'],
      ['Sao lưu tự động + một lần khôi phục thử thành công có biên bản', 'Automated backups + a recorded successful restore'],
      ['Runbook vận hành hoàn chỉnh', 'Operations runbook complete'],
    ],
    checklist: [
      ['HTTPS tự gia hạn', 'HTTPS auto-renews'],
      ['SPF / DKIM / DMARC đã cấu hình', 'SPF / DKIM / DMARC configured'],
      ['Tường lửa chỉ mở các cổng cần thiết', 'Firewall opens only required ports'],
      ['Bí mật nằm trong biến môi trường / kho bí mật, không trong ảnh', 'Secrets in env / a secret store, never in images'],
      ['Có cảnh báo dung lượng đĩa', 'Disk-space alerts in place'],
      ['Sao lưu 3-2-1, có ít nhất một bản ngoài máy chủ', '3-2-1 backups with at least one off-server copy'],
    ],
    templates: [D.runbook],
    pitfalls: [
      ['Sao lưu nhưng chưa từng thử khôi phục', 'Backups never restore-tested'],
      ['Build ngay trên máy chủ production làm đầy đĩa', 'Building on the production server and filling its disk'],
      ['Cấu hình bind-mount nằm ngoài ảnh nên deploy ảnh không cập nhật nó', 'Bind-mounted config lives outside the image, so deploying the image never updates it'],
      ['Tài khoản cloud đứng tên người làm thay vì khách', 'Cloud accounts in the contractor’s name instead of the client’s'],
    ],
    example: [
      'cuongthai.com: ảnh được build ở máy riêng rồi đẩy qua registry; VPS chỉ kéo về và tráo — vì build ngay trên VPS từng làm đầy đĩa chứa PostgreSQL. Sau mỗi lần tráo có smoke test. Cấu hình nginx được ghi đè tại chỗ rồi so sha256 từ BÊN TRONG container, vì thay file bằng `mv` khiến container vẫn đọc bản cũ (bind-mount file đơn gắn theo inode).',
      'cuongthai.com: images are built on a separate machine and pushed to a registry; the VPS only pulls and swaps — building on the VPS once filled the disk holding PostgreSQL. Every swap is smoke-tested. The nginx config is overwritten in place and its sha256 checked from INSIDE the container, because replacing it with `mv` left the container reading the old file (single-file bind mounts follow the inode).',
    ],
  },
  // ══ 14 ═════════════════════════════════════════════════════════════════
  {
    slug: 'uat-nghiem-thu',
    phase: 'ship',
    title: ['UAT & nghiệm thu', 'UAT & acceptance'],
    short: ['Khách kiểm thử & ký', 'Client tests & signs'],
    goal: [
      'Khách tự kiểm tra sản phẩm theo đúng tiêu chí chấp nhận đã ký ở bước Đặc tả yêu cầu — không phải theo cảm giác.',
      'The client verifies the product against the acceptance criteria signed during Requirements specification — not against gut feeling.',
    ],
    activities: [
      ['Chuẩn bị kịch bản UAT từ acceptance criteria, dữ liệu gần thật', 'Prepare UAT scripts from acceptance criteria, with near-real data'],
      ['Hướng dẫn người dùng chính thao tác trên môi trường UAT / staging', 'Walk key users through the UAT / staging environment'],
      ['Ghi nhận phát hiện và phân loại: lỗi, thay đổi yêu cầu, cải tiến sau', 'Log findings and triage: defect, change request, later improvement'],
      ['Sửa lỗi và chạy lại vòng UAT', 'Fix and re-run UAT'],
    ],
    deliverables: [
      ['Kế hoạch & kịch bản UAT', 'UAT plan & scripts'],
      ['Danh sách phát hiện và trạng thái xử lý', 'Findings list with status'],
      ['Biên bản nghiệm thu có chữ ký', 'Signed acceptance certificate'],
    ],
    client: [
      ['Dành thời gian cho người dùng thật kiểm thử', 'Commit real users’ time to testing'],
      ['Ký biên bản nghiệm thu khi đạt tiêu chí', 'Sign the acceptance certificate once criteria are met'],
    ],
    tools: ['Môi trường UAT / staging', 'CT Work / Jira', 'Loom (quay lỗi)'],
    standards: [
      { name: 'ISTQB® — Acceptance testing', note: ['Kiểm thử chấp nhận người dùng / vận hành / hợp đồng', 'User, operational and contractual acceptance testing'] },
      { name: 'ISO/IEC 25010:2023', note: ['Dùng lại mô hình chất lượng để đối chiếu NFR', 'Reuse the quality model to check NFRs'] },
    ],
    learn: [L.SWT301, L.SWP391, L.testing],
    gate: ['Biên bản nghiệm thu đã ký.', 'Acceptance certificate signed.'],
    team: [
      { dept: 'client', role: ['thực hiện UAT và ký nghiệm thu', 'performs UAT and signs acceptance'] },
      { dept: 'ba', role: ['viết kịch bản UAT, hướng dẫn người dùng', 'writes UAT scripts, guides users'] },
      { dept: 'qa', role: ['hỗ trợ, ghi nhận và tái hiện lỗi', 'supports, logs and reproduces defects'] },
      { dept: 'pm', role: ['điều phối, phân loại phát hiện', 'coordinates, triages findings'] },
      { dept: 'dev', role: ['sửa lỗi trong vòng UAT', 'fixes defects during UAT'] },
      { dept: 'support', role: ['chuẩn bị tiếp nhận sau go-live', 'prepares post-go-live support'] },
    ],
    raci: [
      { activity: ['Kế hoạch & kịch bản UAT', 'UAT plan & scripts'], roles: { ba: 'A', qa: 'R', client: 'C' } },
      { activity: ['Chuẩn bị môi trường & dữ liệu UAT', 'UAT environment & data'], roles: { devops: 'A', data: 'R', qa: 'C' } },
      { activity: ['Thực hiện UAT', 'Execute UAT'], roles: { client: 'A', qa: 'C', ba: 'C' } },
      { activity: ['Phân loại phát hiện (lỗi / CR / cải tiến sau)', 'Triage findings (defect / CR / later)'], roles: { pm: 'A', ba: 'R', client: 'C' } },
      { activity: ['Sửa lỗi & chạy lại', 'Fix & re-run'], roles: { dev: 'A', qa: 'R' } },
      { activity: ['Ký biên bản nghiệm thu', 'Sign the acceptance certificate'], roles: { client: 'A', pm: 'R', legal: 'I' } },
    ],
    inputs: [
      ['Tiêu chí chấp nhận đã ký', 'Signed acceptance criteria'],
      ['Báo cáo kiểm thử và bảo mật', 'Test and security reports'],
      ['Môi trường UAT / staging', 'UAT / staging environment'],
    ],
    entryCriteria: [
      ['Kiểm thử hệ thống đạt cổng (không còn lỗi Critical/High)', 'System testing passed its gate (no Critical/High defects)'],
      ['Kịch bản UAT được khách duyệt', 'UAT scripts approved by the client'],
      ['Người dùng thật đã được bố trí', 'Real users are booked'],
    ],
    exitCriteria: [
      ['100% kịch bản UAT đã chạy', '100% of UAT scripts executed'],
      ['Không còn lỗi chặn nghiệm thu', 'No acceptance-blocking defects'],
      ['Phát hiện còn lại đã phân loại và có kế hoạch', 'Remaining findings triaged with a plan'],
      ['Biên bản nghiệm thu ký bởi người có thẩm quyền, ghi rõ phiên bản build', 'Certificate signed by an authorised person, stating the build version'],
      ['Mốc thanh toán tương ứng được kích hoạt', 'The matching payment milestone is triggered'],
    ],
    checklist: [
      ['Kịch bản viết bằng ngôn ngữ nghiệp vụ', 'Scripts written in business language'],
      ['Dữ liệu gần thật nhưng không dùng dữ liệu cá nhân thật chưa được đồng ý', 'Near-real data without unconsented real personal data'],
      ['Mỗi phát hiện có bằng chứng (ảnh, video)', 'Every finding has evidence (screenshot, video)'],
      ['Thay đổi yêu cầu không "sửa luôn" mà đi qua CR', 'Requirement changes go through a CR, not "quick fixes"'],
      ['Ghi số phiên bản build được nghiệm thu', 'The accepted build version is recorded'],
    ],
    templates: [D.uat, D.cr],
    pitfalls: [
      ['UAT biến thành vòng thu thập yêu cầu mới', 'UAT turning into a new requirements round'],
      ['Người kiểm là chính người làm ra sản phẩm', 'The builders doing the acceptance testing'],
      ['Không ghi phiên bản build được nghiệm thu', 'Not recording which build was accepted'],
      ['Nghiệm thu bằng lời', 'Verbal acceptance'],
    ],
    example: [
      'Áp dụng cho LabFlow AI: kịch bản UAT lấy thẳng từ tiêu chí chấp nhận trong SRS và chạy theo vai — Student đặt lịch, Lab Staff check-in bằng QR, Lab Manager duyệt — mỗi kịch bản là một thẻ trên CT Work để theo dõi đạt / không đạt và nối ngược về yêu cầu qua RTM.',
      'Applied to LabFlow AI: UAT scripts come straight from the SRS acceptance criteria and run per role — Student books, Lab Staff checks in by QR, Lab Manager approves — each script is a CT Work card tracking pass / fail and traced back to its requirement through the RTM.',
    ],
  },
  // ══ 15 ═════════════════════════════════════════════════════════════════
  {
    slug: 'quan-ly-phat-hanh',
    phase: 'ship',
    title: ['Quản lý phát hành', 'Release management'],
    short: ['SemVer · release notes · rollback', 'SemVer · notes · rollback'],
    goal: [
      'Mỗi bản phát hành có số hiệu, nội dung, người duyệt và đường lùi rõ ràng — để luôn biết chính xác đang chạy gì và quay lại được trong vài phút.',
      'Every release has a number, contents, an approver and a way back — so you always know exactly what is running and can roll back in minutes.',
    ],
    activities: [
      ['Đánh số phiên bản theo SemVer; gắn tag git trùng với bản build', 'Version with SemVer; tag git to match the build'],
      ['Viết release notes cho người dùng và CHANGELOG cho kỹ thuật', 'Write user-facing release notes and a technical CHANGELOG'],
      ['Đóng gói bản phát hành bất biến (ảnh container / bản cài có chữ ký), giữ bản trước để quay lui', 'Package an immutable release (container image / signed installer), keep the previous one for roll-back'],
      ['Đặt tính năng mới sau cờ (feature flag) để tách "triển khai" khỏi "phát hành"', 'Put new features behind feature flags to separate "deploy" from "release"'],
      ['Họp duyệt phát hành (go/no-go): kiểm thử, bảo mật, nghiệm thu, migration, kế hoạch quay lui', 'Release go/no-go: testing, security, acceptance, migrations, roll-back plan'],
      ['Diễn tập quay lui và quy định khi nào bắt buộc quay lui', 'Rehearse roll-back and define when it is mandatory'],
    ],
    deliverables: [
      ['Release notes + CHANGELOG', 'Release notes + CHANGELOG'],
      ['Bản phát hành có tag, checksum / chữ ký', 'Tagged release with checksum / signature'],
      ['Biên bản duyệt phát hành', 'Release approval record'],
      ['Kế hoạch và lệnh quay lui đã thử', 'Tested roll-back plan and commands'],
    ],
    client: [
      ['Duyệt nội dung và thời điểm phát hành', 'Approve release contents and timing'],
      ['Thông báo người dùng cuối', 'Notify end users'],
    ],
    tools: ['Git tag / GitHub Releases', 'Container registry (GHCR)', 'Feature flag (OpenFeature)', 'CHANGELOG.md'],
    standards: [
      { name: 'Semantic Versioning 2.0.0', note: ['MAJOR.MINOR.PATCH — đổi MAJOR khi phá vỡ tương thích', 'MAJOR.MINOR.PATCH — bump MAJOR on breaking changes'] },
      { name: 'Keep a Changelog 1.1.0', note: ['Quy ước ghi thay đổi cho người đọc', 'Human-readable changelog convention'] },
      { name: 'ITIL® 4 — Release management · Deployment management', note: ['Hai thực hành tách biệt: phát hành giá trị cho người dùng và đưa thay đổi lên môi trường', 'Two distinct practices: releasing value to users and moving changes into environments'] },
      { name: 'OpenFeature (CNCF)', note: ['Đặc tả mở, trung lập nhà cung cấp cho API feature flag', 'Open, vendor-neutral specification for feature-flag APIs'] },
      { name: 'DORA metrics', note: ['Tỉ lệ thay đổi gây lỗi và thời gian khôi phục', 'Change failure rate and time to restore'] },
    ],
    learn: [L.git, L.gha, L.docker, L.deploy],
    gate: ['Biên bản duyệt phát hành đã ký; bản trước còn sẵn để quay lui; release notes đã gửi.', 'Release approval signed; previous version kept for roll-back; release notes sent.'],
    team: [
      { dept: 'devops', role: ['đóng gói, gắn tag, quay lui', 'packaging, tagging, roll-back'] },
      { dept: 'pm', role: ['lịch phát hành, release notes, họp duyệt', 'release schedule, notes, approval meeting'] },
      { dept: 'qa', role: ['xác nhận chất lượng bản phát hành', 'confirms release quality'] },
      { dept: 'dev', role: ['feature flag, CHANGELOG kỹ thuật', 'feature flags, technical CHANGELOG'] },
      { dept: 'support', role: ['thông báo và chuẩn bị hỗ trợ người dùng', 'user communication and support readiness'] },
      { dept: 'client', role: ['duyệt nội dung và thời điểm', 'approves contents and timing'] },
    ],
    raci: [
      { activity: ['Đánh số & gắn tag phiên bản', 'Version numbering & tagging'], roles: { devops: 'A', dev: 'R' } },
      { activity: ['Release notes & CHANGELOG', 'Release notes & CHANGELOG'], roles: { pm: 'A', dev: 'R', support: 'C' } },
      { activity: ['Đóng gói & lưu bản quay lui', 'Packaging & keeping the roll-back version'], roles: { devops: 'A', sec: 'C' } },
      { activity: ['Feature flag & kế hoạch bật dần', 'Feature flags & progressive enablement'], roles: { dev: 'A', pm: 'C', client: 'C' } },
      { activity: ['Họp duyệt phát hành (go/no-go)', 'Release go/no-go'], roles: { pm: 'A', qa: 'R', sec: 'C', devops: 'C', client: 'C' } },
      { activity: ['Diễn tập quay lui', 'Roll-back rehearsal'], roles: { devops: 'A', qa: 'R' } },
    ],
    inputs: [
      ['Biên bản nghiệm thu (UAT)', 'UAT acceptance certificate'],
      ['Báo cáo kiểm thử và bảo mật', 'Test and security reports'],
      ['Danh sách thay đổi từ git', 'Change list from git'],
    ],
    entryCriteria: [
      ['Biên bản nghiệm thu (toàn phần hoặc theo mốc) đã ký', 'Acceptance (full or milestone) signed'],
      ['Không còn lỗi chặn phát hành', 'No release-blocking defects'],
    ],
    exitCriteria: [
      ['Số phiên bản nhất quán giữa git tag, ảnh / bản cài và release notes', 'Version consistent across git tag, image / installer and release notes'],
      ['Bản trước được giữ và lệnh quay lui đã thử', 'Previous version kept and roll-back commands tested'],
      ['Migration CSDL tương thích ngược hoặc có kịch bản khôi phục', 'Database migrations backward-compatible or with a restore script'],
      ['Biên bản duyệt phát hành đã ký', 'Release approval record signed'],
      ['Thông báo phát hành đã gửi', 'Release announcement sent'],
    ],
    checklist: [
      ['Số phiên bản chưa từng được công bố', 'Version number never published before'],
      ['Bản build dựng từ commit đã gắn tag, không từ cây làm việc dở', 'Built from the tagged commit, never from a dirty working tree'],
      ['Có checksum / chữ ký cho bản cài', 'Checksums / signatures for installers'],
      ['Release notes viết cho người dùng, không chỉ là commit log', 'Release notes written for users, not just a commit log'],
      ['Mỗi cờ tính năng có chủ sở hữu và ngày gỡ', 'Every feature flag has an owner and a removal date'],
      ['Sau phát hành, kiểm lại đúng phiên bản đang chạy', 'After release, verify the running version'],
    ],
    templates: [D.releaseNotes, D.runbook],
    pitfalls: [
      ['Tăng số phiên bản bằng tay rồi quên phát hành', 'Bumping the version by hand and never releasing it'],
      ['Hai lượt build ghi đè lên cùng một số phiên bản', 'Two builds overwriting the same version number'],
      ['Migration không đảo ngược được mà không có kế hoạch', 'Irreversible migrations without a plan'],
      ['Cờ tính năng để mãi thành nợ kỹ thuật', 'Feature flags left forever as technical debt'],
    ],
    example: [
      'cuongthai.com (app desktop), 19–20/08/2026: một số phiên bản đã được tăng nhưng không bao giờ được phát hành, và một phiên bản khác bị dựng hai lượt ghi đè lên nhau. Từ đó phát hành đi qua MỘT lệnh duy nhất: kiểm nhánh, kiểm cây làm việc sạch, chặn khi đang có lượt dựng khác, chặn số phiên bản đã công bố, và kiểm lại đủ các file tự cập nhật sau khi dựng.',
      'cuongthai.com (desktop app), 19–20 Aug 2026: one version number was bumped but never released, and another was built twice, the second overwriting the first. Releases now go through ONE command: check the branch, require a clean tree, block while another build runs, refuse already-published versions, and re-check the auto-update files after the build.',
    ],
  },
  // ══ 16 ═════════════════════════════════════════════════════════════════
  {
    slug: 'trien-khai-ban-giao',
    phase: 'ship',
    title: ['Triển khai & bàn giao', 'Go-live & handover'],
    short: ['Go-live · đào tạo · tài khoản', 'Go-live · training · accounts'],
    goal: [
      'Đưa lên production an toàn, có đường lùi, rồi trao tận tay mọi thứ khách cần để tự làm chủ sản phẩm.',
      'Go to production safely with a rollback path, then hand over everything the client needs to own the product.',
    ],
    activities: [
      ['Go-live checklist: backup trước, migration, bật giám sát, kế hoạch rollback', 'Go-live checklist: backup first, migrations, monitoring on, rollback plan'],
      ['Thực hiện cutover dữ liệu theo kế hoạch đã tập dượt, đối soát lại sau khi chạy', 'Run the rehearsed data cutover and reconcile afterwards'],
      ['Đào tạo người dùng & quản trị viên, quay video hướng dẫn', 'Train users & admins, record how-to videos'],
      ['Bàn giao mã nguồn, tài khoản, khoá, tên miền — chuyển quyền sở hữu', 'Hand over source code, accounts, keys, domains — transfer ownership'],
      ['Theo dõi sát 72 giờ đầu (hypercare)', 'Close watch for the first 72 hours (hypercare)'],
    ],
    deliverables: [
      ['Bản phát hành chạy trên production', 'Release running in production'],
      ['Tài liệu người dùng, tài liệu quản trị, runbook', 'User guide, admin guide, runbook'],
      ['Kho mã nguồn + quyền truy cập, danh sách tài khoản & bí mật (bàn giao an toàn)', 'Source repo + access, account & secret inventory (securely handed over)'],
      ['Biên bản bàn giao', 'Handover record'],
    ],
    client: [
      ['Chọn thời điểm go-live ít ảnh hưởng', 'Pick a low-impact go-live window'],
      ['Nhận và đổi mật khẩu mọi tài khoản được bàn giao', 'Receive and rotate every handed-over credential'],
    ],
    tools: ['Docker · CI/CD', 'pg_dump / pg_restore', 'Loom / OBS', 'Bitwarden (chia sẻ bí mật)'],
    standards: [
      { name: 'ITIL® 4 — Release & Deployment management', note: ['Thực hành phát hành và triển khai có kiểm soát', 'Controlled release and deployment practices'] },
      { name: 'ISO/IEC/IEEE 12207:2017', note: ['Quy trình Chuyển giao (Transition): đưa hệ thống vào môi trường vận hành', 'Transition process: moving the system into its operational environment'] },
      { name: 'Semantic Versioning 2.0.0', note: ['Đánh số bản phát hành', 'Release numbering'] },
    ],
    learn: [L.deploy, L.pg, L.gha, L.SEP490],
    gate: ['Production ổn định sau hypercare; biên bản bàn giao đã ký.', 'Production stable after hypercare; handover record signed.'],
    team: [
      { dept: 'devops', role: ['chủ trì go-live, hypercare', 'leads go-live and hypercare'] },
      { dept: 'data', role: ['cutover dữ liệu và đối soát', 'data cutover and reconciliation'] },
      { dept: 'support', role: ['đào tạo, tài liệu người dùng, tiếp nhận hỗ trợ', 'training, user docs, support intake'] },
      { dept: 'pm', role: ['điều phối bàn giao, biên bản', 'coordinates handover and records'] },
      { dept: 'sec', role: ['bàn giao bí mật an toàn', 'secure secret handover'] },
      { dept: 'client', role: ['chọn thời điểm, nhận bàn giao, đổi mật khẩu', 'picks the window, receives handover, rotates credentials'] },
    ],
    raci: [
      { activity: ['Go-live (backup, migration, giám sát, quay lui)', 'Go-live (backup, migrations, monitoring, roll-back)'], roles: { devops: 'A', dev: 'R', data: 'R', client: 'I' } },
      { activity: ['Cutover dữ liệu & đối soát sau go-live', 'Data cutover & post-go-live reconciliation'], roles: { data: 'A', qa: 'R', client: 'C' } },
      { activity: ['Đào tạo người dùng & quản trị', 'User & admin training'], roles: { support: 'A', ba: 'R', client: 'C' } },
      { activity: ['Bàn giao mã nguồn, tài khoản, bí mật', 'Hand over code, accounts, secrets'], roles: { pm: 'A', devops: 'R', client: 'R', sec: 'C' } },
      { activity: ['Hypercare 72 giờ', '72-hour hypercare'], roles: { devops: 'A', dev: 'R', support: 'R' } },
      { activity: ['Ký biên bản bàn giao', 'Sign the handover record'], roles: { client: 'A', pm: 'R' } },
    ],
    inputs: [
      ['Bản phát hành đã duyệt và runbook', 'Approved release and runbook'],
      ['Kế hoạch cutover đã tập dượt', 'Rehearsed cutover plan'],
      ['Tài liệu người dùng & quản trị', 'User & admin documentation'],
    ],
    entryCriteria: [
      ['Biên bản duyệt phát hành đã ký', 'Release approval signed'],
      ['Cửa sổ go-live được khách chấp thuận', 'Go-live window approved by the client'],
      ['Backup production mới nhất đã được kiểm', 'Latest production backup verified'],
    ],
    exitCriteria: [
      ['Production chạy đúng phiên bản, smoke test xanh', 'Production runs the right version; smoke tests green'],
      ['Đối soát dữ liệu sau cutover khớp', 'Post-cutover data reconciliation matches'],
      ['Người dùng và quản trị viên đã được đào tạo', 'Users and admins trained'],
      ['Mọi tài khoản và khoá đã bàn giao, khách đã đổi mật khẩu', 'All accounts and keys handed over; client rotated credentials'],
      ['Hết hypercare không còn sự cố P1/P2 mở; biên bản bàn giao đã ký', 'Hypercare ends with no open P1/P2 incidents; handover record signed'],
    ],
    checklist: [
      ['Go-live không đặt vào chiều thứ Sáu hay trước ngày nghỉ', 'Go-live not on a Friday afternoon or before a holiday'],
      ['Có người trực và kênh liên lạc khẩn trong 72 giờ', 'On-call person and emergency channel for 72 hours'],
      ['Bí mật bàn giao qua trình quản lý mật khẩu, không qua chat / email', 'Secrets handed over via a password manager, never chat / email'],
      ['Quyền sở hữu tên miền và tài khoản cloud đã chuyển cho khách', 'Domain and cloud account ownership transferred to the client'],
      ['Tài liệu người dùng khớp phiên bản đang chạy', 'User docs match the running version'],
    ],
    templates: [D.runbook, D.handover, D.warranty],
    pitfalls: [
      ['Go-live chiều thứ Sáu', 'Going live on a Friday afternoon'],
      ['Bàn giao mật khẩu qua chat', 'Handing over passwords in chat'],
      ['Quên chuyển quyền sở hữu tên miền / tài khoản cloud', 'Forgetting to transfer domain / cloud account ownership'],
      ['Không có người trực sau go-live', 'Nobody on call after go-live'],
    ],
    example: [
      'cuongthai.com, 18/08/2026: một lần tráo ảnh dùng nhầm Dockerfile (nền musl mang engine Prisma bản glibc) — build xanh, đẩy xanh, tráo xanh, rồi API trả 502 trong bảy phút. Sau sự cố có thêm chốt kiểm libc ↔ engine trước khi đẩy, và runbook ghi sẵn cách quay lui nhanh: gắn lại ảnh cũ còn trên máy (khoảng 40 giây thay vì dựng lại 15 phút). Build xanh không có nghĩa là ảnh chạy được.',
      'cuongthai.com, 18 Aug 2026: an image swap used the wrong Dockerfile (a musl base carrying a glibc Prisma engine) — green build, green push, green swap, then the API returned 502 for seven minutes. A libc ↔ engine check now runs before every push, and the runbook documents a fast roll-back: re-tag the previous image still on the host (about 40 seconds instead of a 15-minute rebuild). A green build does not mean a working image.',
    ],
  },
  // ══ 17 ═════════════════════════════════════════════════════════════════
  {
    slug: 'dong-du-an',
    phase: 'ship',
    title: ['Đóng dự án', 'Project closure'],
    short: ['Retro · lưu trữ · thu hồi quyền', 'Retro · archive · revoke access'],
    goal: [
      'Kết thúc dự án có chủ đích: xác nhận mọi nghĩa vụ đã xong, rút bài học, lưu trữ hồ sơ, thu hồi quyền truy cập và quyết toán — thay vì để dự án "tắt dần".',
      'End the project deliberately: confirm every obligation is met, capture lessons, archive records, revoke access and settle accounts — instead of letting it fade out.',
    ],
    activities: [
      ['Đối chiếu SOW: mọi đầu ra đã bàn giao và nghiệm thu; liệt kê hạng mục chuyển sang bảo hành', 'Check against the SOW: every deliverable handed over and accepted; list items moving to warranty'],
      ['Họp retrospective toàn dự án với đội và, nếu được, với khách', 'Whole-project retrospective with the team and, where possible, the client'],
      ['Lưu trữ hồ sơ: hợp đồng, tài liệu, biên bản, mã nguồn tại thời điểm bàn giao (tag)', 'Archive records: contracts, documents, minutes, source at the handover tag'],
      ['Thu hồi quyền truy cập của đội vào hệ thống khách; xoay vòng bí mật đội từng dùng', 'Revoke the team’s access to client systems; rotate secrets the team used'],
      ['Quyết toán: hoá đơn cuối, thanh lý hợp đồng hoặc chuyển sang hợp đồng bảo trì', 'Settle: final invoice, contract liquidation or move to a maintenance contract'],
      ['Cập nhật tài sản quy trình: mẫu, checklist, dữ liệu ước lượng thực tế so với kế hoạch', 'Update process assets: templates, checklists, actual-vs-planned estimates'],
    ],
    deliverables: [
      ['Biên bản đóng dự án / thanh lý hợp đồng', 'Project closure / contract liquidation record'],
      ['Báo cáo retrospective & bài học kinh nghiệm', 'Retrospective & lessons-learned report'],
      ['Hồ sơ dự án lưu trữ có mục lục', 'Indexed project archive'],
      ['Danh sách quyền truy cập đã thu hồi', 'List of revoked access'],
    ],
    client: [
      ['Xác nhận không còn hạng mục tồn đọng', 'Confirm there are no outstanding items'],
      ['Tham gia retrospective, góp ý thẳng thắn', 'Join the retrospective and give candid feedback'],
      ['Xác nhận đã thu hồi quyền của đội', 'Confirm the team’s access has been revoked'],
    ],
    tools: ['CT Work', 'Google Drive / OneDrive (lưu trữ)', 'Trình quản lý mật khẩu'],
    standards: [
      { name: 'PMBOK® Guide 6th ed. — Close Project or Phase (4.7)', note: ['Quy trình đóng dự án / giai đoạn: hoàn tất, chuyển giao, lưu trữ', 'Close Project or Phase process: finalise, transfer, archive'] },
      { name: 'ISO 21502:2020', note: ['Hướng dẫn đóng dự án và đánh giá sau dự án', 'Guidance on project closure and post-project evaluation'] },
      { name: 'CMMI (ISACA) — mức khái niệm', note: ['Bài học trở thành tài sản quy trình của tổ chức', 'Lessons become organisational process assets'] },
      { name: 'Retrospective Prime Directive (Norm Kerth, 2001)', note: ['Họp nhìn lại không đổ lỗi', 'Blameless retrospectives'] },
    ],
    learn: [L.PMG201c, L.agile, L.SWP391],
    gate: ['Biên bản đóng dự án đã ký; quyền truy cập của đội đã thu hồi; bài học đã đưa vào mẫu và quy trình.', 'Closure record signed; team access revoked; lessons fed into templates and process.'],
    team: [
      { dept: 'pm', role: ['chủ trì đóng dự án, retrospective', 'leads closure and the retrospective'] },
      { dept: 'pmo', role: ['lưu trữ, cập nhật tài sản quy trình', 'archiving, updating process assets'] },
      { dept: 'legal', role: ['thanh lý hợp đồng, hoá đơn cuối', 'contract liquidation, final invoice'] },
      { dept: 'devops', role: ['thu hồi quyền, xoay vòng bí mật', 'revokes access, rotates secrets'] },
      { dept: 'sec', role: ['xác nhận không còn quyền thừa', 'confirms no leftover access'] },
      { dept: 'client', role: ['xác nhận hoàn tất, tham gia retro', 'confirms completion, joins the retro'] },
    ],
    raci: [
      { activity: ['Đối chiếu đầu ra với SOW', 'Check deliverables against the SOW'], roles: { pm: 'A', ba: 'R', client: 'C' } },
      { activity: ['Retrospective toàn dự án', 'Whole-project retrospective'], roles: { pm: 'A', dev: 'C', qa: 'C', ba: 'C', client: 'C' } },
      { activity: ['Lưu trữ hồ sơ dự án', 'Archive project records'], roles: { pmo: 'A', pm: 'R' } },
      { activity: ['Thu hồi quyền & xoay vòng bí mật', 'Revoke access & rotate secrets'], roles: { devops: 'A', sec: 'R', client: 'I' } },
      { activity: ['Quyết toán & thanh lý hợp đồng', 'Settlement & contract liquidation'], roles: { legal: 'A', pm: 'C', client: 'R' } },
      { activity: ['Cập nhật mẫu & quy trình từ bài học', 'Update templates & process from lessons'], roles: { pmo: 'A', pm: 'R' } },
    ],
    inputs: [
      ['Biên bản bàn giao, SOW', 'Handover record, SOW'],
      ['Sổ rủi ro, nhật ký thay đổi (CR)', 'Risk register, change log'],
      ['Số liệu thực tế: công, lỗi, thời gian', 'Actuals: effort, defects, time'],
    ],
    entryCriteria: [
      ['Biên bản bàn giao đã ký', 'Handover record signed'],
      ['Hypercare đã kết thúc', 'Hypercare finished'],
    ],
    exitCriteria: [
      ['Không còn hạng mục SOW mở, hoặc đã chuyển sang bảo hành có danh sách', 'No open SOW items, or a listed transfer to warranty'],
      ['Retrospective có hành động cải tiến, mỗi hành động có người phụ trách', 'Retrospective produced improvement actions, each with an owner'],
      ['Hồ sơ lưu trữ đầy đủ', 'Archive complete'],
      ['Mọi quyền truy cập tạm thời của đội đã thu hồi và ghi nhận', 'All temporary team access revoked and recorded'],
      ['Hoá đơn cuối đã phát hành; hợp đồng thanh lý hoặc chuyển bảo trì', 'Final invoice issued; contract liquidated or moved to maintenance'],
    ],
    checklist: [
      ['So sánh ước lượng với thực tế cho từng hạng mục', 'Compare estimate with actuals per item'],
      ['Danh sách tài khoản đội từng có quyền và ngày thu hồi', 'List of team accounts that had access, with revocation dates'],
      ['Bản sao dữ liệu khách trên máy đội đã xoá', 'Copies of client data on team machines deleted'],
      ['Repo nội bộ chuyển chế độ lưu trữ, chỉ đọc', 'Internal repos archived as read-only'],
      ['Khách có bản sao tài liệu cuối cùng', 'Client holds the final copies of all documents'],
    ],
    templates: [D.retro, D.closure, D.liquidation],
    pitfalls: [
      ['Dự án "tắt dần", không có biên bản đóng', 'Projects that fade out with no closure record'],
      ['Quên thu hồi quyền → rủi ro bảo mật cho cả hai bên', 'Forgetting to revoke access → security risk for both sides'],
      ['Retrospective biến thành buổi đổ lỗi', 'Retrospectives turning into blame sessions'],
      ['Ghi bài học rồi không thay đổi gì', 'Writing lessons down and changing nothing'],
    ],
    example: [
      'cuongthai.com: tài liệu vận hành của repo có bảng "Known Error Patterns" — mỗi sự cố ghi ngày, triệu chứng và bài học, và bài học được đổi thành một bước kiểm cụ thể trong checklist hoặc script (vd chốt smoke test báo 404 sau sự cố chạy nhầm bản build cũ). Đó là phiên bản nhỏ của "bài học thành tài sản quy trình".',
      'cuongthai.com: the repo’s operating notes keep a "Known Error Patterns" table — each incident has a date, symptom and lesson, and each lesson becomes a concrete check in a checklist or script (e.g. the 404 smoke test added after a stale build went live). A small-scale version of "lessons become process assets".',
    ],
  },
  // ══ 18 ═════════════════════════════════════════════════════════════════
  {
    slug: 'bao-hanh-bao-tri',
    phase: 'run',
    title: ['Bảo hành, vận hành & bảo trì', 'Warranty, operations & maintenance'],
    short: ['SLA · sự cố · cập nhật', 'SLA · incidents · updates'],
    goal: [
      'Giữ sản phẩm sống khoẻ sau bàn giao: sửa lỗi trong thời hạn bảo hành, xử lý sự cố theo quy trình, vá bảo mật đều đặn.',
      'Keep the product healthy after handover: fix defects under warranty, handle incidents by the book, patch regularly.',
    ],
    activities: [
      ['Thời gian bảo hành lỗi theo hợp đồng (sửa lỗi so với đặc tả, miễn phí)', 'Contractual warranty period (defects against spec fixed free)'],
      ['Tiếp nhận sự cố theo mức độ, phản hồi và khắc phục theo SLA', 'Take incidents by severity; respond and resolve within SLA'],
      ['Viết postmortem không đổ lỗi sau mỗi sự cố lớn', 'Blameless postmortem after every major incident'],
      ['Cập nhật phụ thuộc, vá bảo mật, gia hạn chứng chỉ / tên miền', 'Dependency updates, security patches, cert / domain renewals'],
      ['Kiểm tra sao lưu định kỳ bằng cách khôi phục thử', 'Periodically verify backups by actually restoring'],
    ],
    deliverables: [
      ['Thoả thuận SLA (mức độ sự cố, thời gian phản hồi)', 'SLA (severity levels, response times)'],
      ['Nhật ký sự cố & postmortem', 'Incident log & postmortems'],
      ['Báo cáo bảo trì định kỳ', 'Periodic maintenance report'],
    ],
    client: [
      ['Báo sự cố qua kênh đã thống nhất, kèm ảnh / bước tái hiện', 'Report incidents via the agreed channel, with screenshots / repro steps'],
      ['Quyết định có gia hạn hợp đồng bảo trì sau bảo hành', 'Decide on a maintenance contract after warranty'],
    ],
    tools: ['Sentry', 'Uptime monitor', 'Dependabot', 'Status page'],
    standards: [
      { name: 'NIST SP 800-61 Rev. 3', note: ['Hướng dẫn ứng phó sự cố an ninh mạng', 'Incident response recommendations'] },
      { name: 'ISO/IEC/IEEE 14764:2022', note: ['Quy trình bảo trì phần mềm', 'Software maintenance processes'] },
      { name: 'ITIL® 4 — Incident management', note: ['Tiếp nhận, phân loại, khôi phục dịch vụ', 'Log, classify and restore service'] },
    ],
    learn: [L.incident, L.obs, L.deploy, L.pg],
    gate: ['Hết hạn bảo hành: bàn giao sang hợp đồng bảo trì hoặc kết thúc có biên bản.', 'Warranty ends: move to a maintenance contract or close formally.'],
    team: [
      { dept: 'support', role: ['tiếp nhận, phân loại, liên lạc khách', 'intake, triage, client communication'] },
      { dept: 'devops', role: ['xử lý sự cố, giám sát, sao lưu', 'incident handling, monitoring, backups'] },
      { dept: 'dev', role: ['sửa lỗi bảo hành', 'warranty fixes'] },
      { dept: 'sec', role: ['vá bảo mật, theo dõi CVE', 'security patches, CVE tracking'] },
      { dept: 'pm', role: ['báo cáo bảo trì, gia hạn hợp đồng', 'maintenance reports, renewals'] },
      { dept: 'client', role: ['báo sự cố, quyết định gia hạn', 'reports incidents, decides on renewal'] },
    ],
    raci: [
      { activity: ['Tiếp nhận & phân loại yêu cầu / sự cố', 'Intake & triage of requests / incidents'], roles: { support: 'A', client: 'R', devops: 'C' } },
      { activity: ['Khắc phục sự cố theo SLA', 'Resolve incidents within SLA'], roles: { devops: 'A', dev: 'R', support: 'C', client: 'I' } },
      { activity: ['Sửa lỗi bảo hành', 'Warranty defect fixes'], roles: { dev: 'A', qa: 'R' } },
      { activity: ['Postmortem không đổ lỗi', 'Blameless postmortem'], roles: { devops: 'A', dev: 'R', pm: 'C', client: 'I' } },
      { activity: ['Cập nhật & vá bảo mật định kỳ', 'Routine updates & security patches'], roles: { sec: 'A', dev: 'R', devops: 'R' } },
      { activity: ['Báo cáo bảo trì định kỳ', 'Periodic maintenance report'], roles: { pm: 'A', support: 'R', client: 'I' } },
    ],
    inputs: [
      ['Biên bản bàn giao, SLA, runbook', 'Handover record, SLA, runbook'],
      ['Hệ thống giám sát và cảnh báo', 'Monitoring and alerting'],
    ],
    entryCriteria: [
      ['Biên bản bàn giao đã ký', 'Handover record signed'],
      ['Kênh tiếp nhận và SLA có hiệu lực', 'Intake channel and SLA in force'],
    ],
    exitCriteria: [
      ['Hết thời hạn bảo hành, không còn lỗi bảo hành mở', 'Warranty period over, no open warranty defects'],
      ['Báo cáo tổng kết bảo hành đã gửi', 'Warranty summary report sent'],
      ['Khách đã quyết định: gia hạn bảo trì, chuyển giao, hoặc ngừng hệ thống', 'Client decided: renew maintenance, transfer, or decommission'],
    ],
    checklist: [
      ['Mỗi sự cố có mức độ, thời gian phản hồi và khắc phục so với SLA', 'Every incident has severity, response and resolution time vs. SLA'],
      ['Có postmortem cho mọi sự cố P1 / P2', 'Postmortem for every P1 / P2 incident'],
      ['Cập nhật phụ thuộc theo lịch (vd hằng tháng)', 'Dependency updates on a schedule (e.g. monthly)'],
      ['Chứng chỉ và tên miền không hết hạn', 'Certificates and domains never expire'],
      ['Khôi phục thử định kỳ có biên bản', 'Recorded periodic restore tests'],
      ['Theo dõi dung lượng đĩa và chi phí vận hành', 'Disk usage and running cost monitored'],
    ],
    templates: [D.sla, D.warranty, D.postmortem],
    pitfalls: [
      ['Không phân biệt lỗi bảo hành với yêu cầu mới', 'Not separating warranty defects from new requests'],
      ['Sửa nóng trên production không qua quy trình', 'Hot-fixing production outside the process'],
      ['Postmortem đổ lỗi cho cá nhân', 'Postmortems that blame individuals'],
      ['Quên dọn dẹp đĩa / log → sự cố', 'Forgetting disk / log cleanup → incidents'],
    ],
    example: [
      'cuongthai.com: một workflow chạy hằng tuần dọn dung lượng đĩa VPS — dựng sau sự cố đầy đĩa từng làm dừng PostgreSQL. Các bí mật mà workflow đó dùng được ghi chú "không được xoá", vì xoá thì việc dọn dẹp sẽ chết lặng lẽ và sự cố cũ quay lại.',
      'cuongthai.com: a weekly workflow reclaims VPS disk space — added after a disk-full incident stopped PostgreSQL. The secrets it uses are documented as "do not delete", because deleting them would silently kill the cleanup and bring the old incident back.',
    ],
  },
  // ══ 19 ═════════════════════════════════════════════════════════════════
  {
    slug: 'cai-tien',
    phase: 'run',
    title: ['Cải tiến liên tục', 'Continuous improvement'],
    short: ['Số liệu → v2', 'Data → v2'],
    goal: [
      'Dùng số liệu và phản hồi thật để quyết định làm gì tiếp — thay vì thêm tính năng theo cảm hứng.',
      'Use real data and feedback to decide what comes next — instead of adding features on a hunch.',
    ],
    activities: [
      ['Đo sản phẩm: phễu chuyển đổi, tỉ lệ dùng tính năng, Core Web Vitals, chi phí vận hành', 'Measure: conversion funnels, feature adoption, Core Web Vitals, running cost'],
      ['Thu phản hồi người dùng (khảo sát ngắn, phỏng vấn)', 'Collect user feedback (short surveys, interviews)'],
      ['Rà soát định kỳ với khách: số liệu, sự cố, chi phí, nợ kỹ thuật', 'Periodic review with the client: metrics, incidents, cost, technical debt'],
      ['Đề xuất lộ trình v2 có ưu tiên, quay lại bước Đề xuất giải pháp', 'Propose a prioritised v2 roadmap — loop back to the proposal stage'],
    ],
    deliverables: [
      ['Báo cáo số liệu sản phẩm', 'Product metrics report'],
      ['Tổng hợp phản hồi người dùng', 'User feedback summary'],
      ['Lộ trình v2 (roadmap)', 'v2 roadmap'],
    ],
    client: [
      ['Chia sẻ mục tiêu kinh doanh mới', 'Share new business goals'],
      ['Cùng ưu tiên lộ trình', 'Co-prioritise the roadmap'],
    ],
    tools: ['Google Analytics / Plausible', 'Search Console', 'PageSpeed Insights', 'Typeform / Google Forms'],
    standards: [
      { name: 'Core Web Vitals (Google)', note: ['LCP, INP, CLS — số đo trải nghiệm thực tế', 'LCP, INP, CLS — field experience metrics'] },
      { name: 'Build–Measure–Learn (Lean Startup)', note: ['Vòng lặp học từ số liệu', 'Learning loop driven by data'] },
    ],
    learn: [L.seo, L.solo, L.perf, L.SWP391],
    gate: ['Lộ trình v2 được duyệt → vòng mới bắt đầu từ bước Đề xuất giải pháp.', 'v2 roadmap approved → a new cycle starts at the proposal stage.'],
    team: [
      { dept: 'data', role: ['thu thập và phân tích số liệu', 'collects and analyses metrics'] },
      { dept: 'ux', role: ['phỏng vấn, khảo sát người dùng', 'user interviews and surveys'] },
      { dept: 'ba', role: ['tổng hợp nhu cầu, đề xuất lộ trình', 'consolidates needs, drafts the roadmap'] },
      { dept: 'pm', role: ['rà soát định kỳ với khách', 'runs periodic reviews with the client'] },
      { dept: 'sales', role: ['cơ hội hợp tác tiếp theo', 'next engagement opportunities'] },
      { dept: 'client', role: ['mục tiêu mới, duyệt lộ trình', 'new goals, approves the roadmap'] },
    ],
    raci: [
      { activity: ['Thu thập & phân tích số liệu sản phẩm', 'Collect & analyse product metrics'], roles: { data: 'A', dev: 'R' } },
      { activity: ['Phỏng vấn / khảo sát người dùng', 'User interviews / surveys'], roles: { ux: 'A', ba: 'R', client: 'C' } },
      { activity: ['Rà soát định kỳ với khách', 'Periodic client review'], roles: { pm: 'A', support: 'R', client: 'C' } },
      { activity: ['Duyệt lộ trình v2', 'Approve the v2 roadmap'], roles: { client: 'A', ba: 'R', arch: 'C', sales: 'C' } },
    ],
    inputs: [
      ['Số liệu sản phẩm và nhật ký sự cố', 'Product metrics and incident log'],
      ['Phản hồi người dùng', 'User feedback'],
      ['Mục tiêu kinh doanh mới', 'New business goals'],
    ],
    entryCriteria: [
      ['Sản phẩm chạy ổn định trên production', 'Product stable in production'],
      ['Có đo lường (analytics, giám sát) với sự đồng ý phù hợp', 'Measurement (analytics, monitoring) in place with appropriate consent'],
    ],
    exitCriteria: [
      ['Báo cáo số liệu và phản hồi đã gửi khách', 'Metrics and feedback report sent to the client'],
      ['Lộ trình v2 có ưu tiên được khách duyệt', 'Prioritised v2 roadmap approved by the client'],
      ['Hạng mục v2 đi vào bước Đề xuất như một vòng mới', 'v2 items enter the proposal stage as a new cycle'],
    ],
    checklist: [
      ['Analytics tuân thủ đồng ý cookie / dữ liệu', 'Analytics respects cookie / data consent'],
      ['Core Web Vitals đo trên dữ liệu thực địa', 'Core Web Vitals measured on field data'],
      ['Yêu cầu tính năng có nguồn và tần suất', 'Feature requests have a source and frequency'],
      ['Chi phí vận hành so với dự kiến', 'Running cost compared with the forecast'],
      ['Nợ kỹ thuật được liệt kê và ước lượng', 'Technical debt listed and estimated'],
    ],
    templates: [D.proposal, D.cr],
    pitfalls: [
      ['Thêm tính năng theo người nói to nhất', 'Building whatever the loudest voice asks for'],
      ['Đo mà không có câu hỏi cần trả lời', 'Measuring without a question to answer'],
      ['Bỏ qua nợ kỹ thuật', 'Ignoring technical debt'],
      ['Quên chi phí vận hành tăng theo người dùng', 'Forgetting that running cost grows with usage'],
    ],
    example: [
      'cuongthai.com: các việc AI chạy nền (sinh nội dung hàng loạt, bản tin tự động) mặc định TẮT, và có trần tiền theo ngày hai mức (mềm cắt việc nền, cứng cắt tất cả) — được thêm sau khi nhìn số liệu chi phí thật. Quyết định cải tiến dựa trên sổ của cổng, không dựa trên bảng giá.',
      'cuongthai.com: background AI jobs (bulk content generation, the automatic bulletin) are OFF by default, with a two-level daily spend cap (soft cuts background work, hard cuts everything) — added after looking at real cost data. Improvement decisions follow the gateway’s ledger, not the price list.',
    ],
  },
  // ══ 20 ═════════════════════════════════════════════════════════════════
  {
    slug: 'ngung-he-thong',
    phase: 'run',
    title: ['Ngừng & chuyển giao hệ thống', 'Decommissioning & exit'],
    short: ['Trả dữ liệu · xoá đúng luật', 'Return data · lawful deletion'],
    goal: [
      'Khi hệ thống hết vòng đời hoặc khách chuyển nhà cung cấp: trả dữ liệu ở định dạng dùng được, chuyển giao trơn tru, xoá dữ liệu cá nhân đúng luật và có bằng chứng — không để lại máy chủ "mồ côi".',
      'When the system reaches end of life or the client changes supplier: return data in a usable format, hand over cleanly, delete personal data lawfully with evidence — and leave no orphaned servers.',
    ],
    activities: [
      ['Lập kế hoạch ngừng: phạm vi, mốc thời gian, thông báo người dùng, phụ thuộc (tích hợp, DNS, email)', 'Plan the shutdown: scope, timeline, user notice, dependencies (integrations, DNS, email)'],
      ['Xuất và trả dữ liệu ở định dạng mở (CSV / JSON / SQL dump) kèm từ điển dữ liệu và checksum', 'Export and return data in open formats (CSV / JSON / SQL dump) with a data dictionary and checksums'],
      ['Chuyển giao cho nhà cung cấp mới (nếu có): tài liệu, mã nguồn, phiên làm việc chuyển giao', 'Transition to a new supplier (if any): documents, source, handover sessions'],
      ['Chuyển hệ thống sang chỉ đọc → tắt dịch vụ → chuyển hướng hoặc thu hồi tên miền theo thoả thuận', 'Switch to read-only → shut down → redirect or release domains as agreed'],
      ['Xoá dữ liệu cá nhân và bản sao lưu theo thời hạn lưu trữ đã thoả thuận; lập biên bản xoá', 'Delete personal data and backups per the agreed retention; record the deletion'],
      ['Huỷ tài khoản, khoá API, chứng chỉ, giấy phép bên thứ ba; dừng thanh toán định kỳ', 'Cancel accounts, API keys, certificates, third-party licences; stop recurring billing'],
    ],
    deliverables: [
      ['Kế hoạch ngừng hệ thống', 'Decommissioning plan'],
      ['Gói dữ liệu trả lại + từ điển dữ liệu + checksum', 'Returned data package + data dictionary + checksums'],
      ['Biên bản xoá / huỷ dữ liệu', 'Data deletion / destruction record'],
      ['Danh sách tài nguyên đã huỷ (máy chủ, tài khoản, khoá, tên miền)', 'List of retired resources (servers, accounts, keys, domains)'],
    ],
    client: [
      ['Quyết định dữ liệu nào phải giữ (nghĩa vụ kế toán, pháp lý) và dữ liệu nào xoá', 'Decide which data must be kept (accounting, legal duties) and which is deleted'],
      ['Thông báo người dùng cuối', 'Notify end users'],
      ['Xác nhận đã nhận đủ dữ liệu và ký biên bản', 'Confirm receipt of the data and sign the record'],
    ],
    tools: ['pg_dump / CSV export', 'sha256sum', 'Cloudflare / nhà đăng ký tên miền', 'Trình quản lý mật khẩu'],
    standards: [
      { name: 'ISO/IEC/IEEE 12207:2017', note: ['Quy trình Loại bỏ (Disposal): kết thúc hệ thống có kiểm soát', 'Disposal process: controlled end of a system'] },
      { name: 'Luật Bảo vệ dữ liệu cá nhân 2025 (91/2025/QH15)', note: ['Quyền xoá dữ liệu của chủ thể; xoá khi hết mục đích xử lý. Luật thông qua 26/06/2025, hiệu lực 01/01/2026 — đối chiếu cùng luật sư khi áp dụng', 'Law on Personal Data Protection No. 91/2025/QH15 — data subject’s right to deletion; delete when the purpose ends. Passed 26 Jun 2025, in force 1 Jan 2026 — confirm with counsel when applying'] },
      { name: 'Nghị định 356/2025/NĐ-CP', note: ['Quy định chi tiết Luật BVDLCN, hiệu lực 01/01/2026, thay thế Nghị định 13/2023/NĐ-CP — yêu cầu xoá hợp lệ: phản hồi trong 2 ngày làm việc, hoàn tất xoá trong 20 ngày', 'Decree 356/2025/ND-CP detailing the PDP Law, in force 1 Jan 2026 (replaces Decree 13/2023) — valid deletion request: respond within 2 working days, complete deletion within 20 days'] },
      { name: 'ISO/IEC 27001:2022 — Annex A 8.10', note: ['Xoá thông tin khi không còn cần', 'Information deletion when no longer required'] },
      { name: 'NIST SP 800-88', note: ['Hướng dẫn làm sạch phương tiện lưu trữ (media sanitization)', 'Guidelines for media sanitization'] },
    ],
    learn: [L.privacy, L.LAW102, L.pg, L.deploy],
    gate: ['Khách xác nhận đã nhận đủ dữ liệu; biên bản xoá dữ liệu và danh sách tài nguyên đã huỷ được ký.', 'Client confirms receipt of all data; deletion record and retired-resource list signed.'],
    team: [
      { dept: 'pm', role: ['điều phối kế hoạch ngừng', 'coordinates the decommissioning plan'] },
      { dept: 'data', role: ['xuất, kiểm và xoá dữ liệu', 'exports, verifies and deletes data'] },
      { dept: 'devops', role: ['tắt dịch vụ, huỷ tài nguyên', 'shuts down services, retires resources'] },
      { dept: 'legal', role: ['nghĩa vụ lưu trữ, biên bản xoá', 'retention duties, deletion record'] },
      { dept: 'sec', role: ['xoá an toàn, thu hồi khoá', 'secure deletion, key revocation'] },
      { dept: 'support', role: ['thông báo người dùng', 'user communication'] },
      { dept: 'client', role: ['quyết định giữ / xoá, xác nhận nhận dữ liệu', 'decides keep / delete, confirms receipt'] },
    ],
    raci: [
      { activity: ['Kế hoạch ngừng & thông báo người dùng', 'Shutdown plan & user notice'], roles: { pm: 'A', support: 'R', client: 'C' } },
      { activity: ['Xuất & trả dữ liệu', 'Export & return data'], roles: { data: 'A', qa: 'R', client: 'C' } },
      { activity: ['Chuyển giao cho nhà cung cấp mới', 'Transition to a new supplier'], roles: { pm: 'A', arch: 'R', dev: 'R', client: 'C' } },
      { activity: ['Tắt dịch vụ & huỷ tài nguyên', 'Shut down & retire resources'], roles: { devops: 'A', infra: 'R', sec: 'C' } },
      { activity: ['Xoá dữ liệu cá nhân & bản sao lưu', 'Delete personal data & backups'], roles: { legal: 'A', data: 'R', sec: 'R', client: 'C' } },
      { activity: ['Ký biên bản kết thúc', 'Sign the exit record'], roles: { client: 'A', pm: 'R' } },
    ],
    inputs: [
      ['Hợp đồng: điều khoản chấm dứt và trả dữ liệu', 'Contract: termination and data-return terms'],
      ['Danh mục tài sản, tài khoản, tích hợp', 'Inventory of assets, accounts, integrations'],
      ['Chính sách và thời hạn lưu trữ dữ liệu', 'Data retention policy and periods'],
    ],
    entryCriteria: [
      ['Quyết định ngừng hoặc chuyển giao bằng văn bản', 'Written decision to decommission or transfer'],
      ['Thời hạn lưu trữ từng loại dữ liệu đã thống nhất', 'Retention period agreed for each data category'],
    ],
    exitCriteria: [
      ['Dữ liệu đã trả kèm checksum, khách xác nhận đọc được', 'Data returned with checksums; client confirms it is readable'],
      ['Dữ liệu cá nhân và bản sao lưu đã xoá theo kế hoạch, có biên bản', 'Personal data and backups deleted per plan, with a record'],
      ['Không còn tài nguyên tính phí hay khoá còn hiệu lực', 'No billable resources or live keys remain'],
      ['DNS và tên miền đã xử lý theo thoả thuận', 'DNS and domains handled as agreed'],
      ['Biên bản kết thúc đã ký', 'Exit record signed'],
    ],
    checklist: [
      ['Liệt kê mọi nơi dữ liệu nằm: CSDL, file, bản sao lưu, log, máy dev, bên thứ ba', 'List every place data lives: DB, files, backups, logs, dev machines, third parties'],
      ['Thông báo người dùng trước theo thời hạn đã thoả thuận', 'Users notified in advance per the agreed notice period'],
      ['Dữ liệu phải giữ theo luật có thời hạn xoá cụ thể', 'Legally retained data has a concrete deletion date'],
      ['Gỡ bản ghi DNS trỏ vào dịch vụ đã huỷ (tránh bị chiếm tên miền con)', 'DNS records pointing at retired services removed (prevent subdomain takeover)'],
      ['Huỷ webhook và khoá API phía bên thứ ba', 'Webhooks and API keys revoked at third parties'],
      ['Dừng mọi khoản thanh toán định kỳ', 'All recurring billing stopped'],
    ],
    templates: [D.decommission],
    pitfalls: [
      ['Tắt máy chủ nhưng quên bản sao lưu ở nơi khác', 'Shutting the server but forgetting backups stored elsewhere'],
      ['Xoá dữ liệu mà luật buộc phải giữ (vd chứng từ kế toán)', 'Deleting data the law requires you to keep (e.g. accounting records)'],
      ['Bản ghi DNS còn trỏ vào dịch vụ đã huỷ → bị chiếm tên miền con', 'DNS still pointing at a retired service → subdomain takeover'],
      ['Quên huỷ thanh toán định kỳ', 'Forgetting to cancel recurring billing'],
    ],
    example: [
      'cuongthai.com: khi đổi cổng LLM, các model đời cũ `rb-*` ngừng hoạt động — tài liệu repo ghi rõ "thấy `rb-` ở đâu là chỗ đó đang trỏ vào đường chết", tức một danh sách để dò và gỡ. Hai workflow deploy cũ không bị xoá mà hạ xuống chỉ chạy bằng tay, có ghi lý do. Ngừng một đường vận hành cũng cần biên bản, không chỉ ngừng cả hệ thống.',
      'cuongthai.com: after the LLM gateway switch, the old `rb-*` models stopped working — the repo notes say "wherever you see `rb-`, that path is dead", giving a list to hunt down and remove. The two old deploy workflows were not deleted but demoted to manual-only, with the reason written down. Retiring one operating path needs a record too, not only retiring a whole system.',
    ],
  },
];

/** 21 giai đoạn, `n` = vị trí, `departments` sinh từ `team`. */
export const STAGES: Stage[] = STAGES_RAW.map((s, i) => ({
  ...s,
  n: i,
  departments: s.team?.map((t): Bi => [
    `${DEPT_NAMES[t.dept][0]} — ${t.role[0]}`,
    `${DEPT_NAMES[t.dept][1]} — ${t.role[1]}`,
  ]),
}));

/** Số thứ tự của giai đoạn theo slug (ném lỗi nếu gõ sai slug — bắt ngay lúc build). */
export function nOf(slug: string): number {
  const i = STAGES.findIndex((s) => s.slug === slug);
  if (i < 0) throw new Error(`quy-trinh: không có giai đoạn "${slug}"`);
  return i;
}
export const stageBySlug = (slug: string): Stage => STAGES[nOf(slug)];

/** Vòng lặp của quy trình: Cải tiến liên tục → quay về Đề xuất giải pháp. */
export const LOOP = { from: nOf('cai-tien'), to: nOf('de-xuat') } as const;

// ─── Xuyên suốt dự án ───────────────────────────────────────────────────────
export interface CrossItem {
  id: string;
  title: Bi;
  body: Bi;
  points: Bi[];
}

export const CROSS_CUTTING: CrossItem[] = [
  {
    id: 'giao-tiep',
    title: ['Giao tiếp & báo cáo tuần', 'Communication & weekly reports'],
    body: ['Khách không phải đoán dự án đang ở đâu.', 'The client never has to guess where the project stands.'],
    points: [
      ['Báo cáo mỗi tuần: đã xong, tuần tới, rủi ro, cần khách quyết gì', 'Weekly report: done, next, risks, decisions needed'],
      ['Demo cuối sprint trên staging', 'End-of-sprint demo on staging'],
      ['Một kênh chính (email / nhóm chat) + board công việc chung, khách xem qua link chia sẻ', 'One main channel (email / chat group) + a shared board the client follows via a share link'],
    ],
  },
  {
    id: 'quan-tri',
    title: ['Quản trị & leo thang', 'Governance & escalation'],
    body: ['Ai quyết định cái gì, và khi vướng thì báo ai — viết ra từ ngày kick-off.', 'Who decides what, and whom to call when stuck — written down at kick-off.'],
    points: [
      ['Ma trận RACI cho mỗi giai đoạn: mỗi hoạt động có đúng một người chịu trách nhiệm giải trình', 'A RACI matrix per stage: every activity has exactly one accountable person'],
      ['Đường leo thang ba cấp: đầu mối hằng ngày → quản lý dự án → nhà tài trợ hai bên', 'Three-level escalation: day-to-day contacts → project managers → sponsors on both sides'],
      ['Cổng chất lượng có người duyệt ghi tên, không duyệt ngầm', 'Quality gates have named approvers — no implicit approval'],
    ],
  },
  {
    id: 'thay-doi',
    title: ['Quản lý thay đổi (Change request)', 'Change management'],
    body: ['Thay đổi là bình thường; thay đổi không kiểm soát mới là vấn đề.', 'Change is normal; uncontrolled change is the problem.'],
    points: [
      ['Mọi yêu cầu ngoài phạm vi đi qua phiếu CR', 'Every out-of-scope request goes through a CR form'],
      ['Mỗi CR có đánh giá ảnh hưởng: thời gian, chi phí, rủi ro', 'Each CR gets an impact assessment: time, cost, risk'],
      ['Chỉ làm khi khách duyệt bằng văn bản', 'Work starts only after written approval'],
    ],
  },
  {
    id: 'cong-chat-luong',
    title: ['Cổng chất lượng giữa các giai đoạn', 'Quality gates between stages'],
    body: ['Mỗi giai đoạn có điều kiện vào và ra rõ ràng — không đạt thì không sang bước sau.', 'Every stage has explicit entry and exit criteria — no pass, no next step.'],
    points: [
      ['Tài liệu được duyệt trước khi dựa vào nó', 'Documents are approved before anything builds on them'],
      ['CI xanh là điều kiện merge', 'Green CI is a merge requirement'],
      ['Nghiệm thu dựa trên tiêu chí đã ký, không dựa trên cảm giác', 'Acceptance is against signed criteria, not feelings'],
    ],
  },
  {
    id: 'rui-ro',
    title: ['Quản lý rủi ro', 'Risk management'],
    body: ['Rủi ro được viết ra sớm thì rẻ hơn rủi ro bị phát hiện muộn.', 'A risk written down early is cheaper than one discovered late.'],
    points: [
      ['Sổ rủi ro: khả năng × tác động, người theo dõi, phương án', 'Risk register: likelihood × impact, owner, response'],
      ['Xem lại mỗi sprint', 'Reviewed every sprint'],
      ['Với đội nhỏ: rủi ro "phụ thuộc một người" (ốm, bận) được nói trước và có kế hoạch dự phòng', 'Small teams: the "single person" dependency (illness, absence) is stated up front with a fallback plan'],
    ],
  },
  {
    id: 'du-lieu-ca-nhan',
    title: ['Dữ liệu cá nhân & bảo mật thông tin', 'Personal data & information security'],
    body: ['Dữ liệu của khách và người dùng của khách được bảo vệ ở mọi giai đoạn, không chỉ ở bước bảo mật.', 'Client and end-user data is protected at every stage, not only in the security stage.'],
    points: [
      ['Chỉ thu thập và chuyển những gì cần; dữ liệu thử nghiệm được ẩn danh', 'Collect and move only what is needed; test data is anonymised'],
      ['Phân vai bên kiểm soát / bên xử lý dữ liệu ghi trong hợp đồng', 'Controller / processor roles written into the contract'],
      ['Quyền truy cập của đội được cấp tối thiểu và thu hồi khi đóng dự án', 'Team access is least-privilege and revoked at closure'],
    ],
  },
  {
    id: 'ai',
    title: ['Dùng AI có trách nhiệm', 'Responsible use of AI'],
    body: ['Tôi dùng trợ lý AI để làm nhanh hơn — nhưng chịu trách nhiệm với từng dòng giao đi.', 'I use AI assistants to move faster — but I own every line I ship.'],
    points: [
      ['Mọi mã do AI gợi ý đều được đọc, chạy test và review như mã người viết', 'AI-suggested code is read, tested and reviewed like any other code'],
      ['Không đưa dữ liệu mật / dữ liệu cá nhân của khách vào dịch vụ AI công cộng khi chưa được đồng ý', 'No client secrets or personal data sent to public AI services without consent'],
      ['Nói rõ với khách phần nào có dùng AI', 'Be transparent with the client about where AI is used'],
    ],
  },
  {
    id: 'tai-lieu',
    title: ['Tài liệu sống & truy vết', 'Living docs & traceability'],
    body: ['Tài liệu đi cùng mã, không phải một đống giấy cuối dự án.', 'Docs travel with the code, not as a pile of paper at the end.'],
    points: [
      ['Yêu cầu ↔ thiết kế ↔ test ↔ commit nối được với nhau', 'Requirements ↔ design ↔ tests ↔ commits are linked'],
      ['Mỗi giai đoạn có mẫu tài liệu tải về; dự án nhỏ gộp tài liệu cho gọn, nhưng không bỏ bước', 'Every stage has downloadable templates; small projects merge documents but never skip steps'],
    ],
  },
];

// ─── Loại sản phẩm ──────────────────────────────────────────────────────────
export interface ProductType {
  id: string;
  title: Bi;
  emphasis: Bi;
  points: Bi[];
  heavy: number[]; // số thứ tự giai đoạn được nhấn mạnh (tính từ slug, không gõ tay)
  learn: LearnLink[];
}

const heavy = (...slugs: string[]): number[] => slugs.map(nOf);

export const PRODUCT_TYPES: ProductType[] = [
  {
    id: 'web',
    title: ['Web', 'Web'],
    emphasis: ['SEO, tốc độ tải và truy cập được là yêu cầu, không phải phần thêm.', 'SEO, load speed and accessibility are requirements, not extras.'],
    points: [
      ['Core Web Vitals và SEO kỹ thuật được chốt thành NFR', 'Core Web Vitals and technical SEO become NFRs'],
      ['Responsive từ 360px, sáng/tối, WCAG 2.2 AA', 'Responsive from 360px, light/dark, WCAG 2.2 AA'],
      ['CDN, cache và bảo mật header ở hạ tầng', 'CDN, caching and security headers at the edge'],
    ],
    heavy: heavy('thiet-ke-ux-ui', 'kiem-thu', 'ha-tang-devops', 'cai-tien'),
    learn: [L.next, L.react, L.seo, L.websec],
  },
  {
    id: 'mobile',
    title: ['Mobile app', 'Mobile app'],
    emphasis: ['Phát hành qua kho ứng dụng nên mỗi bản sai tốn nhiều ngày để sửa.', 'Store releases mean a bad build costs days to fix.'],
    points: [
      ['Thiết kế theo hướng dẫn iOS / Android, xử lý mất mạng', 'Follow iOS / Android guidelines, handle offline'],
      ['Beta qua TestFlight / Google Play testing trước khi lên kho', 'Beta via TestFlight / Play testing before store release'],
      ['Chuẩn bị chính sách quyền riêng tư, ảnh chụp, mô tả cho kho', 'Privacy policy, screenshots and store listing ready'],
    ],
    heavy: heavy('thiet-ke-ux-ui', 'kiem-thu', 'quan-ly-phat-hanh', 'trien-khai-ban-giao'),
    learn: [L.rn, L.ux, L.testing],
  },
  {
    id: 'tool',
    title: ['Tool / hệ thống nội bộ', 'Internal tools'],
    emphasis: ['Giá trị nằm ở việc khớp đúng quy trình làm việc thật của khách.', 'Value comes from fitting the client’s real workflow.'],
    points: [
      ['Khảo sát nghiệp vụ và phân quyền theo vai trò là trọng tâm', 'Business analysis and role-based access are central'],
      ['Nhập/xuất Excel, báo cáo, nhật ký thao tác (audit log)', 'Excel import/export, reports, audit logs'],
      ['Chuyển dữ liệu cũ và đào tạo kỹ', 'Careful data migration and training'],
    ],
    heavy: heavy('khao-sat', 'dac-ta-yeu-cau', 'kien-truc', 'chuyen-du-lieu', 'trien-khai-ban-giao'),
    learn: [L.SWR302, L.DBI202, L.spring, L.PRJ301],
  },
  {
    id: 'ai',
    title: ['AI / LLM', 'AI / LLM'],
    emphasis: ['Đầu ra không tất định: phải đo chất lượng và chặn chi phí từ đầu.', 'Outputs are non-deterministic: measure quality and cap cost from day one.'],
    points: [
      ['Bộ đánh giá (eval) với câu hỏi thật trước khi chọn model', 'An eval set of real questions before picking a model'],
      ['Trần chi phí theo ngày / người dùng, dự phòng khi nhà cung cấp lỗi', 'Daily / per-user cost ceilings, fallback when a provider fails'],
      ['Chống prompt injection, lọc dữ liệu cá nhân, ghi rõ AI có thể sai', 'Prompt-injection defence, PII filtering, clear "AI can be wrong" notices'],
    ],
    heavy: heavy('dac-ta-yeu-cau', 'kien-truc', 'kiem-thu', 'bao-mat', 'bao-hanh-bao-tri'),
    learn: [L.llm, L.rag, L.agents, L.privacy],
  },
  {
    id: 'iot',
    title: ['IoT', 'IoT'],
    emphasis: ['Phần cứng không "hotfix" được như web: thiết kế cập nhật từ xa và bảo mật thiết bị từ đầu.', 'Hardware can’t be hot-fixed like a web page: design OTA updates and device security up front.'],
    points: [
      ['Chọn giao thức (MQTT / WebSocket / HTTP) theo điện năng và mạng', 'Pick protocols (MQTT / WebSocket / HTTP) for power and network'],
      ['Cập nhật firmware từ xa (OTA) có ký số và đường lùi', 'Signed OTA firmware updates with rollback'],
      ['Kiểm thử trên thiết bị thật, cả khi mất mạng / mất nguồn', 'Test on real devices, including network and power loss'],
    ],
    heavy: heavy('kien-truc', 'kiem-thu', 'bao-mat', 'ha-tang-devops', 'quan-ly-phat-hanh', 'bao-hanh-bao-tri'),
    learn: [L.net, L.linux, L.sysdesign],
  },
];

// ─── Mô hình hợp tác (KHÔNG ghi giá) ────────────────────────────────────────
export interface Engagement {
  id: string;
  title: Bi;
  body: Bi;
  fits: Bi;
  tradeoff: Bi;
}

export const ENGAGEMENTS: Engagement[] = [
  {
    id: 'tron-goi',
    title: ['Trọn gói (phạm vi cố định)', 'Fixed scope'],
    body: ['Chốt phạm vi, tiến độ và chi phí theo mốc trong hợp đồng.', 'Scope, timeline and cost agreed per milestone in the contract.'],
    fits: ['Yêu cầu rõ, ít thay đổi, cần biết trước ngân sách.', 'Clear requirements, few changes, fixed budget needed.'],
    tradeoff: ['Thay đổi phải qua change request.', 'Changes go through change requests.'],
  },
  {
    id: 'theo-gio',
    title: ['Theo giờ (Time & Materials)', 'Time & materials'],
    body: ['Tính theo thời gian làm thật, có nhật ký công việc minh bạch.', 'Billed by actual time, with a transparent work log.'],
    fits: ['Việc nhỏ lẻ, tư vấn, sửa lỗi, yêu cầu còn đang khám phá.', 'Small tasks, consulting, fixes, requirements still emerging.'],
    tradeoff: ['Linh hoạt nhưng tổng chi phí khó đoán trước.', 'Flexible, but the total is harder to predict.'],
  },
  {
    id: 'theo-sprint',
    title: ['Theo sprint', 'Per sprint'],
    body: ['Mỗi sprint 1–2 tuần là một đơn vị: cùng chọn việc đầu sprint, demo cuối sprint.', 'Each 1–2 week sprint is a unit: pick work together at the start, demo at the end.'],
    fits: ['Sản phẩm phát triển dần, ưu tiên thay đổi theo phản hồi.', 'Evolving products where priorities follow feedback.'],
    tradeoff: ['Cần khách tham gia đều đặn mỗi sprint.', 'Needs regular client involvement every sprint.'],
  },
  {
    id: 'bao-tri',
    title: ['Bảo trì định kỳ', 'Maintenance retainer'],
    body: ['Sau bảo hành: giám sát, cập nhật, vá bảo mật và một lượng giờ hỗ trợ mỗi tháng.', 'After warranty: monitoring, updates, security patches and support hours each month.'],
    fits: ['Sản phẩm đã chạy thật, cần người trông.', 'Live products that need someone watching them.'],
    tradeoff: ['Phạm vi hỗ trợ ghi rõ trong SLA.', 'Support scope is defined by the SLA.'],
  },
];
