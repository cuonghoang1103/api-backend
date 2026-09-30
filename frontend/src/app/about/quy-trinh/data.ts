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

/** Vai trò trong ma trận RACI. */
export type RaciRole = 'R' | 'A' | 'C' | 'I';

/** Mẫu tài liệu tải về / xem được (bản 2). */
export interface DocTemplate {
  name: Bi;
  href?: string;
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
  /** Bộ phận / vai trò phụ trách (BA, PM, Dev, QA, DevOps…). */
  departments?: Bi[];
  /** Ma trận RACI: hoạt động → vai trò → R/A/C/I. */
  raci?: { activity: Bi; roles: Record<string, RaciRole> }[];
  /** Điều kiện vào / ra chi tiết (cổng chất lượng đầy đủ). */
  entryCriteria?: Bi[];
  exitCriteria?: Bi[];
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
export const STAGE_PAGES_ENABLED = false;

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
} satisfies Record<string, LearnLink>;

const L = LEARN;

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

// ─── 15 giai đoạn ───────────────────────────────────────────────────────────
export const STAGES: Stage[] = [
  {
    n: 0,
    slug: 'tiep-nhan',
    phase: 'discover',
    title: ['Tiếp nhận & tư vấn ban đầu', 'Intake & first consultation'],
    short: ['Nghe đúng vấn đề', 'Hear the real problem'],
    goal: [
      'Hiểu khách đang gặp vấn đề gì, vì sao là bây giờ, và dự án có hợp với năng lực của tôi không — trước khi hứa bất cứ điều gì.',
      'Understand the problem, why it matters now, and whether the project fits what I can actually deliver — before promising anything.',
    ],
    activities: [
      ['Buổi gọi 30–45 phút: bối cảnh, người dùng, mục tiêu kinh doanh, hạn chót, ngân sách dự kiến', '30–45 min call: context, users, business goal, deadline, budget range'],
      ['Hỏi "vì sao" nhiều lần để tách nhu cầu thật khỏi giải pháp khách đã nghĩ sẵn', 'Ask "why" repeatedly to separate the real need from a pre-imagined solution'],
      ['Đánh giá sơ bộ: khả thi, rủi ro lớn, phần nào tôi làm được, phần nào cần người khác', 'Quick fit check: feasibility, big risks, what I can own and what needs a partner'],
      ['Nói thẳng nếu không phù hợp và gợi ý hướng khác', 'Say so plainly if it is not a fit, and point to alternatives'],
    ],
    deliverables: [
      ['Biên bản buổi tư vấn (1 trang): vấn đề, mục tiêu, ràng buộc, câu hỏi còn mở', 'One-page call notes: problem, goals, constraints, open questions'],
      ['Quyết định đi tiếp / không đi tiếp, kèm lý do', 'Go / no-go decision with reasons'],
    ],
    client: [
      ['Kể vấn đề bằng lời của mình, cho ví dụ thật', 'Describe the problem in their own words, with real examples'],
      ['Chỉ ra người ra quyết định và người sẽ dùng sản phẩm', 'Name the decision-maker and the actual users'],
    ],
    tools: ['Google Meet / Zoom', 'Email', 'Google Docs / Notion'],
    standards: [
      { name: 'PMI — PMBOK® Guide 7th ed.', note: ['Miền hiệu suất "Stakeholders": xác định & hiểu các bên liên quan', 'Stakeholders performance domain: identify and understand stakeholders'] },
      { name: 'ISO 21502:2020', note: ['Hướng dẫn quản lý dự án — khởi động dự án', 'Project management guidance — project initiation'] },
    ],
    learn: [L.SWE201c, L.solo, L.agile],
    gate: ['Hai bên thống nhất vấn đề cần giải và đồng ý bước khảo sát.', 'Both sides agree on the problem to solve and on a discovery step.'],
  },
  {
    n: 1,
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
      ['Liệt kê hệ thống sẵn có cần tích hợp (kế toán, CRM, thanh toán…)', 'List existing systems to integrate with (accounting, CRM, payments…)'],
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
  },
  {
    n: 2,
    slug: 'de-xuat',
    phase: 'define',
    title: ['Đề xuất giải pháp, ước lượng & hợp đồng', 'Proposal, estimate & contract'],
    short: ['Giải pháp · báo giá · NDA', 'Solution · quote · NDA'],
    goal: [
      'Đưa ra một hướng giải quyết cụ thể (thường 2–3 phương án), ước lượng trung thực kèm khoảng sai số, và chốt khung pháp lý trước khi làm.',
      'Propose a concrete approach (usually 2–3 options), an honest estimate with its uncertainty, and the legal frame before work starts.',
    ],
    activities: [
      ['Phác ý tưởng giải pháp, so sánh phương án (tự làm / dùng SaaS / kết hợp)', 'Sketch solution ideas and compare options (build / buy SaaS / hybrid)'],
      ['Chia nhỏ công việc (WBS) và ước lượng ba điểm: lạc quan – khả dĩ – bi quan', 'Break down work (WBS) and three-point estimate: optimistic – likely – pessimistic'],
      ['Xác định MVP: phần tối thiểu mang lại giá trị trước', 'Define the MVP: the smallest slice that delivers value first'],
      ['Soạn báo giá theo mốc, điều khoản thanh toán, sở hữu mã nguồn, bảo hành', 'Draft milestone-based quote, payment terms, IP ownership, warranty'],
      ['Ký NDA nếu khách chia sẻ dữ liệu hoặc ý tưởng nhạy cảm', 'Sign an NDA if sensitive data or ideas are shared'],
    ],
    deliverables: [
      ['Tài liệu đề xuất (proposal): giải pháp, phạm vi, ngoài phạm vi, giả định', 'Proposal: solution, scope, out-of-scope, assumptions'],
      ['Bảng ước lượng + lịch mốc (milestone)', 'Estimate sheet + milestone schedule'],
      ['Báo giá, hợp đồng dịch vụ, NDA, phụ lục phạm vi', 'Quote, service contract, NDA, scope appendix'],
    ],
    client: [
      ['Chọn phương án và mức ưu tiên tính năng (MoSCoW)', 'Choose an option and prioritise features (MoSCoW)'],
      ['Duyệt và ký hợp đồng / NDA', 'Review and sign contract / NDA'],
    ],
    tools: ['Google Sheets (WBS)', 'Google Docs', 'Chữ ký số / e-sign'],
    standards: [
      { name: 'PMBOK® — Three-point estimating (PERT)', note: ['Ước lượng (O + 4M + P) / 6, ghi rõ độ bất định', 'Estimate (O + 4M + P) / 6 and state the uncertainty'] },
      { name: 'Bộ luật Dân sự 2015 (VN)', note: ['Khung pháp lý cho hợp đồng dịch vụ', 'Legal basis for service contracts in Vietnam'] },
      { name: 'Nghị định 13/2023/NĐ-CP', note: ['Bảo vệ dữ liệu cá nhân — áp dụng khi hệ thống xử lý dữ liệu người dùng', 'Personal data protection — applies when the system processes personal data'] },
    ],
    learn: [L.SWE201c, L.solo, L.privacy, L.payments],
    gate: ['Hợp đồng đã ký, phạm vi MVP được chốt bằng văn bản.', 'Contract signed and MVP scope agreed in writing.'],
  },
  {
    n: 3,
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
    tools: ['Jira / GitHub Projects', 'Google Docs', 'Gherkin'],
    standards: [
      { name: 'ISO/IEC/IEEE 29148:2018', note: ['Kỹ nghệ yêu cầu — cấu trúc và đặc tính của một SRS tốt', 'Requirements engineering — structure and qualities of a good SRS'] },
      { name: 'ISO/IEC 25010:2023', note: ['Mô hình chất lượng sản phẩm — khung để liệt kê NFR', 'Product quality model — a checklist for NFRs'] },
      { name: 'INVEST (Bill Wake)', note: ['Tiêu chí user story tốt: độc lập, thương lượng được, có giá trị, ước lượng được, nhỏ, kiểm thử được', 'Good user stories: Independent, Negotiable, Valuable, Estimable, Small, Testable'] },
    ],
    learn: [L.SWR302, L.SWP391, L.agile],
    gate: ['SRS được duyệt; mọi story trong sprint đầu có acceptance criteria.', 'SRS approved; every first-sprint story has acceptance criteria.'],
  },
  {
    n: 4,
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
  },
  {
    n: 5,
    slug: 'kien-truc',
    phase: 'design',
    title: ['Kiến trúc & thiết kế kỹ thuật', 'Architecture & technical design'],
    short: ['SDS · ERD · API · ADR', 'SDS · ERD · API · ADR'],
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
      ['SDS / SAD: sơ đồ C4 (ngữ cảnh, container, component), sơ đồ triển khai', 'SDS / SAD: C4 diagrams (context, container, component), deployment view'],
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
  },
  {
    n: 6,
    slug: 'lap-ke-hoach',
    phase: 'build',
    title: ['Lập kế hoạch & thiết lập dự án', 'Planning & project setup'],
    short: ['Sprint · repo · CI/CD', 'Sprints · repo · CI/CD'],
    goal: [
      'Dựng "đường ray" trước khi chạy tàu: kế hoạch sprint, kho mã, pipeline kiểm tra tự động và ba môi trường tách biệt.',
      'Lay the rails before running the train: sprint plan, repository, automated checks and three separate environments.',
    ],
    activities: [
      ['Chia backlog thành sprint 1–2 tuần, đặt Definition of Done', 'Slice the backlog into 1–2 week sprints, agree a Definition of Done'],
      ['Tạo repo, quy ước nhánh, mẫu PR, bảo vệ nhánh main', 'Create the repo, branch conventions, PR template, protect main'],
      ['Dựng CI: lint, kiểm kiểu, test, build image trên mỗi PR', 'Set up CI: lint, type-check, tests, image build on every PR'],
      ['Tạo môi trường dev / staging / production, tách biến môi trường và bí mật', 'Create dev / staging / production, with separated env vars and secrets'],
      ['Lập sổ rủi ro (risk register) ban đầu', 'Start the risk register'],
    ],
    deliverables: [
      ['Kế hoạch dự án + lịch sprint + Definition of Done', 'Project plan + sprint calendar + Definition of Done'],
      ['Repo có README, CONTRIBUTING, .env.example, pipeline CI chạy xanh', 'Repo with README, CONTRIBUTING, .env.example and a green CI pipeline'],
      ['Môi trường staging truy cập được cho khách', 'A staging environment the client can open'],
    ],
    client: [
      ['Chỉ định một đầu mối duyệt (product owner phía khách)', 'Appoint one approver (client-side product owner)'],
      ['Được mời vào board công việc để theo dõi', 'Get access to the work board to follow progress'],
    ],
    tools: ['GitHub / GitLab', 'GitHub Actions', 'Docker Compose', 'Jira / GitHub Projects'],
    standards: [
      { name: 'The Scrum Guide (2020)', note: ['Sự kiện, vai trò, artefact của Scrum', 'Scrum events, roles and artefacts'] },
      { name: 'The Twelve-Factor App', note: ['Cấu hình qua env, tách build/release/run, dev ≈ prod', 'Config in env, separate build/release/run, dev/prod parity'] },
      { name: 'Conventional Commits 1.0', note: ['Quy ước thông điệp commit đọc được bằng máy', 'Machine-readable commit message convention'] },
    ],
    learn: [L.agile, L.git, L.gha, L.docker, L.SWP391],
    gate: ['CI xanh trên nhánh main; staging chạy được bản "hello world" end-to-end.', 'CI green on main; staging serves an end-to-end "hello world".'],
  },
  {
    n: 7,
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
      ['Demo cuối sprint; cập nhật tài liệu cùng lúc với mã', 'End-of-sprint demo; docs updated alongside code'],
    ],
    deliverables: [
      ['Mã nguồn trong repo, lịch sử commit sạch', 'Source code in the repo with a clean history'],
      ['Bản build staging sau mỗi sprint + ghi chú phát hành', 'Staging build every sprint + release notes'],
      ['Tài liệu API cập nhật, sổ tay dev', 'Updated API docs, developer handbook'],
    ],
    client: [
      ['Dự demo cuối sprint, thử trên staging, phản hồi trong 2–3 ngày', 'Attend sprint demos, try staging, reply within 2–3 days'],
      ['Ưu tiên lại backlog khi cần', 'Re-prioritise the backlog when needed'],
    ],
    tools: ['TypeScript · Node.js · Next.js', 'Java · Spring Boot', 'React Native', 'PostgreSQL · Prisma', 'VS Code · Claude Code'],
    standards: [
      { name: 'Google Engineering Practices — Code Review', note: ['Hướng dẫn review mã: người review nhìn gì, PR nhỏ thế nào', 'What reviewers look for, how to keep PRs small'] },
      { name: 'GitHub Flow / trunk-based', note: ['Nhánh ngắn, merge thường xuyên, main luôn deploy được', 'Short-lived branches, frequent merges, main always deployable'] },
      { name: 'Semantic Versioning 2.0.0', note: ['Đánh số phiên bản MAJOR.MINOR.PATCH', 'MAJOR.MINOR.PATCH version numbers'] },
    ],
    learn: [L.PRJ301, L.spring, L.node, L.next, L.react, L.rn, L.ts, L.prisma, L.llm, L.fullstack],
    gate: ['Mỗi story đạt Definition of Done: review xong, có test, chạy trên staging.', 'Each story meets DoD: reviewed, tested, running on staging.'],
  },
  {
    n: 8,
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
  },
  {
    n: 9,
    slug: 'bao-mat',
    phase: 'verify',
    title: ['Bảo mật', 'Security'],
    short: ['ASVS · quét · bí mật', 'ASVS · scans · secrets'],
    goal: [
      'Bảo mật là yêu cầu, không phải bước trang trí: kiểm theo danh mục có sẵn, quét tự động, và không để lộ bí mật.',
      'Security is a requirement, not decoration: verify against a checklist, scan automatically, never leak secrets.',
    ],
    activities: [
      ['Rà soát mã tập trung vào xác thực, phân quyền, nhập liệu, upload', 'Security-focused code review: authn, authz, input, uploads'],
      ['Quét phụ thuộc (SCA) và mã tĩnh (SAST) trong CI', 'Dependency (SCA) and static (SAST) scans in CI'],
      ['Kiểm tra theo OWASP ASVS mức phù hợp (thường L1–L2)', 'Verify against OWASP ASVS at a fitting level (usually L1–L2)'],
      ['Quản lý bí mật: không commit khoá, xoay vòng khoá, quyền tối thiểu', 'Secrets management: nothing in git, key rotation, least privilege'],
      ['Quét động (DAST) trên staging trước go-live', 'Dynamic scan (DAST) on staging before go-live'],
    ],
    deliverables: [
      ['Checklist ASVS đã đánh dấu + bằng chứng', 'Completed ASVS checklist + evidence'],
      ['Báo cáo quét & danh sách lỗ hổng đã xử lý', 'Scan reports & remediation list'],
      ['Chính sách quản lý bí mật và phân quyền', 'Secrets & access policy'],
    ],
    client: [
      ['Cho biết yêu cầu tuân thủ (dữ liệu cá nhân, thanh toán…)', 'State compliance needs (personal data, payments…)'],
      ['Tự giữ tài khoản gốc (root) của các dịch vụ', 'Keep ownership of root accounts for all services'],
    ],
    tools: ['npm audit / Dependabot', 'Semgrep', 'gitleaks', 'Trivy', 'OWASP ZAP'],
    standards: [
      { name: 'OWASP ASVS 5.0', note: ['Tiêu chuẩn kiểm chứng bảo mật ứng dụng', 'Application Security Verification Standard'] },
      { name: 'OWASP Top 10', note: ['10 nhóm rủi ro web phổ biến nhất', 'Most common web application risks'] },
      { name: 'NIST SP 800-218 (SSDF)', note: ['Khung phát triển phần mềm an toàn', 'Secure Software Development Framework'] },
      { name: 'CWE Top 25', note: ['Các điểm yếu phần mềm nguy hiểm nhất', 'Most dangerous software weaknesses'] },
    ],
    learn: [L.websec, L.auth, L.devsecops, L.threat],
    gate: ['Không còn lỗ hổng mức cao; mọi bí mật nằm ngoài repo.', 'No high-severity findings; all secrets outside the repo.'],
  },
  {
    n: 10,
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
    learn: [L.deploy, L.docker, L.nginx, L.gha, L.iac, L.obs, L.net, L.linux, L.selfhost],
    gate: ['Staging giống production; đã thử khôi phục từ backup thành công.', 'Staging mirrors production; a restore from backup has succeeded.'],
  },
  {
    n: 11,
    slug: 'uat-nghiem-thu',
    phase: 'ship',
    title: ['UAT & nghiệm thu', 'UAT & acceptance'],
    short: ['Khách kiểm thử & ký', 'Client tests & signs'],
    goal: [
      'Khách tự kiểm tra sản phẩm theo đúng tiêu chí chấp nhận đã ký ở giai đoạn 3 — không phải theo cảm giác.',
      'The client verifies the product against the acceptance criteria signed in stage 3 — not against gut feeling.',
    ],
    activities: [
      ['Chuẩn bị kịch bản UAT từ acceptance criteria, dữ liệu gần thật', 'Prepare UAT scripts from acceptance criteria, with near-real data'],
      ['Hướng dẫn người dùng chính thao tác trên staging', 'Walk key users through staging'],
      ['Ghi nhận lỗi / góp ý, phân loại: lỗi, thay đổi yêu cầu, cải tiến sau', 'Log findings and triage: defect, change request, later improvement'],
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
    tools: ['Staging', 'Google Sheets / Jira', 'Loom (quay lỗi)'],
    standards: [
      { name: 'ISTQB® — Acceptance testing', note: ['Kiểm thử chấp nhận người dùng / vận hành / hợp đồng', 'User, operational and contractual acceptance testing'] },
      { name: 'ISO/IEC 25010:2023', note: ['Dùng lại mô hình chất lượng để đối chiếu NFR', 'Reuse the quality model to check NFRs'] },
    ],
    learn: [L.SWT301, L.SWP391, L.testing],
    gate: ['Biên bản nghiệm thu đã ký.', 'Acceptance certificate signed.'],
  },
  {
    n: 12,
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
      ['Chuyển dữ liệu từ hệ thống cũ, đối soát số lượng bản ghi', 'Migrate data from the old system and reconcile record counts'],
      ['Đào tạo người dùng & quản trị viên, quay video hướng dẫn', 'Train users & admins, record how-to videos'],
      ['Bàn giao mã nguồn, tài khoản, khoá, tên miền — chuyển quyền sở hữu', 'Hand over source code, accounts, keys, domains — transfer ownership'],
      ['Theo dõi sát 72 giờ đầu (hypercare)', 'Close watch for the first 72 hours (hypercare)'],
    ],
    deliverables: [
      ['Bản phát hành production + ghi chú phát hành (CHANGELOG)', 'Production release + release notes (CHANGELOG)'],
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
      { name: 'Keep a Changelog 1.1', note: ['Quy ước ghi thay đổi cho người đọc', 'Human-readable changelog convention'] },
      { name: 'Semantic Versioning 2.0.0', note: ['Đánh số bản phát hành', 'Release numbering'] },
    ],
    learn: [L.deploy, L.pg, L.gha, L.SEP490],
    gate: ['Production ổn định sau hypercare; biên bản bàn giao đã ký.', 'Production stable after hypercare; handover record signed.'],
  },
  {
    n: 13,
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
  },
  {
    n: 14,
    slug: 'cai-tien',
    phase: 'run',
    title: ['Cải tiến liên tục', 'Continuous improvement'],
    short: ['Số liệu → v2', 'Data → v2'],
    goal: [
      'Dùng số liệu và phản hồi thật để quyết định làm gì tiếp — thay vì thêm tính năng theo cảm hứng.',
      'Use real data and feedback to decide what comes next — instead of adding features on a hunch.',
    ],
    activities: [
      ['Đo sản phẩm: phễu chuyển đổi, tỉ lệ dùng tính năng, Core Web Vitals', 'Measure: conversion funnels, feature adoption, Core Web Vitals'],
      ['Thu phản hồi người dùng (khảo sát ngắn, phỏng vấn)', 'Collect user feedback (short surveys, interviews)'],
      ['Họp nhìn lại (retrospective) cả dự án', 'Whole-project retrospective'],
      ['Đề xuất lộ trình v2 có ưu tiên, quay lại giai đoạn 2', 'Propose a prioritised v2 roadmap — loop back to stage 2'],
    ],
    deliverables: [
      ['Báo cáo số liệu sản phẩm', 'Product metrics report'],
      ['Biên bản retrospective + bài học', 'Retrospective notes + lessons learned'],
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
    gate: ['Lộ trình v2 được duyệt → bắt đầu vòng mới từ giai đoạn 2.', 'v2 roadmap approved → new cycle starts at stage 2.'],
  },
];

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
      ['Một kênh chính (email / nhóm chat) + board công việc chung', 'One main channel (email / chat group) + a shared board'],
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
    body: ['Mỗi giai đoạn có điều kiện ra rõ ràng — không đạt thì không sang bước sau.', 'Every stage has explicit exit criteria — no pass, no next step.'],
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
      ['Với người làm solo: rủi ro "một người" (ốm, bận thi) được nói trước và có kế hoạch dự phòng', 'Working solo: the "single person" risk (illness, exams) is stated up front with a fallback plan'],
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
      ['Dự án nhỏ: gộp tài liệu cho gọn, nhưng không bỏ bước', 'Small projects: merge documents, never skip steps'],
    ],
  },
];

// ─── Loại sản phẩm ──────────────────────────────────────────────────────────
export interface ProductType {
  id: string;
  title: Bi;
  emphasis: Bi;
  points: Bi[];
  heavy: number[]; // số thứ tự giai đoạn được nhấn mạnh
  learn: LearnLink[];
}

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
    heavy: [4, 8, 10, 14],
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
    heavy: [4, 8, 12],
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
    heavy: [1, 3, 5, 12],
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
    heavy: [3, 5, 8, 9, 13],
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
    heavy: [5, 8, 9, 10, 13],
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
