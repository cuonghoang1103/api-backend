/**
 * Nhãn tiếng Việt cho 105 danh mục của kho AI Templates.
 *
 * Dữ liệu gốc chỉ có slug tiếng Anh (`devops-infrastructure`, `web-data`…).
 * Bảng này là phần dịch thủ công — KHÔNG sinh tự động, vì nhiều slug là tên
 * riêng (Sentry, Railway, PocketBase, DoorDash) hoặc thuật ngữ mà dịch ra
 * tiếng Việt lại khó hiểu hơn (MCP, LSP, statusline).
 *
 * Quy ước: giữ nguyên tên riêng và thuật ngữ đã quen; chỉ dịch phần mô tả
 * lĩnh vực. Slug nào chưa có trong bảng thì `categoryLabel()` tự đổi
 * `kebab-case` thành chữ hoa đầu từ, nên thiếu một mục không làm vỡ giao diện.
 */

const LABELS: Record<string, string> = {
  // ── Lập trình & công cụ ──────────────────────────────────────────────
  development: 'Lập trình',
  'development-team': 'Đội phát triển',
  'development-tools': 'Công cụ lập trình',
  'programming-languages': 'Ngôn ngữ lập trình',
  'web-development': 'Lập trình web',
  'web-tools': 'Công cụ web',
  'api-graphql': 'API & GraphQL',
  database: 'Cơ sở dữ liệu',
  'devops-infrastructure': 'DevOps & hạ tầng',
  deployment: 'Triển khai',
  modernization: 'Hiện đại hoá mã cũ',
  performance: 'Hiệu năng',
  'performance-testing': 'Kiểm thử hiệu năng',
  testing: 'Kiểm thử',
  'quality-gates': 'Chốt chất lượng',
  git: 'Git',
  'git-workflow': 'Quy trình Git',
  setup: 'Khởi tạo dự án',
  utilities: 'Tiện ích',
  automation: 'Tự động hoá',
  'workflow-automation': 'Tự động hoá quy trình',
  orchestration: 'Điều phối',
  simulation: 'Mô phỏng',
  engineering: 'Kỹ thuật phần mềm',
  operations: 'Vận hành',
  evaluation: 'Đánh giá & đo lường',
  documentation: 'Tài liệu',
  analysis: 'Phân tích mã',
  analytics: 'Phân tích số liệu',
  cleanup: 'Dọn dẹp',
  sync: 'Đồng bộ',
  team: 'Làm việc nhóm',
  'project-management': 'Quản lý dự án',

  // ── AI & dữ liệu ─────────────────────────────────────────────────────
  'ai-specialists': 'Chuyên gia AI',
  'ai-research': 'Nghiên cứu AI',
  'ai-maestro': 'AI Maestro',
  'data-ai': 'Dữ liệu & AI',
  deepresearch: 'Nghiên cứu chuyên sâu',
  'deep-research-team': 'Đội nghiên cứu chuyên sâu',
  deepgraph: 'DeepGraph',
  research: 'Nghiên cứu',
  scientific: 'Khoa học',
  'mcp-dev-team': 'Đội phát triển MCP',
  mcp: 'MCP',
  mcps: 'MCP',
  lsps: 'Language Server',
  agents: 'Agent',
  commands: 'Lệnh',
  skills: 'Skill',
  hooks: 'Hook',
  model: 'Mô hình',

  // ── Bảo mật & tuân thủ ───────────────────────────────────────────────
  security: 'Bảo mật',
  authentication: 'Xác thực',
  permissions: 'Quyền hạn',
  telemetry: 'Telemetry',
  monitoring: 'Giám sát',

  // ── Kinh doanh, nội dung, sáng tạo ───────────────────────────────────
  'business-marketing': 'Kinh doanh & marketing',
  marketing: 'Marketing',
  finance: 'Tài chính',
  career: 'Nghề nghiệp',
  'creative-design': 'Sáng tạo & thiết kế',
  design: 'Thiết kế',
  'ui-analysis': 'Phân tích giao diện',
  media: 'Đa phương tiện',
  video: 'Video',
  audio: 'Âm thanh',
  'ffmpeg-clip-team': 'Đội dựng clip FFmpeg',
  'podcast-creator-team': 'Đội làm podcast',
  'document-processing': 'Xử lý tài liệu',
  'ocr-extraction-team': 'Đội trích xuất OCR',
  'enterprise-communication': 'Giao tiếp doanh nghiệp',
  productivity: 'Năng suất',
  'google-workspace': 'Google Workspace',
  'obsidian-ops-team': 'Đội vận hành Obsidian',
  sports: 'Thể thao',

  // ── Nền tảng & nhà cung cấp ──────────────────────────────────────────
  'browser_automation': 'Tự động hoá trình duyệt',
  web: 'Web',
  'web-data': 'Dữ liệu web',
  filesystem: 'Hệ thống tệp',
  devtools: 'Công cụ lập trình',
  integration: 'Tích hợp',
  cloudflare: 'Cloudflare',
  docker: 'Docker',
  e2b: 'E2B',
  azure: 'Azure',
  'nextjs-vercel': 'Next.js & Vercel',
  svelte: 'Svelte',
  railway: 'Railway',
  sentry: 'Sentry',
  pocketbase: 'PocketBase',
  doordash: 'DoorDash',
  blockchain: 'Blockchain',
  'blockchain-web3': 'Blockchain & Web3',
  realtime: 'Thời gian thực',
  'game-development': 'Làm game',
  accessibility: 'Khả năng tiếp cận',
  'expert-advisors': 'Cố vấn chuyên môn',
  partnerships: 'Đối tác',

  // ── Cấu hình ─────────────────────────────────────────────────────────
  api: 'API',
  environment: 'Biến môi trường',
  global: 'Cấu hình toàn cục',
  statusline: 'Dòng trạng thái',
  'post-tool': 'Sau khi gọi công cụ',
  'pre-tool': 'Trước khi gọi công cụ',

  // ── Template ─────────────────────────────────────────────────────────
  frameworks: 'Framework',
  languages: 'Ngôn ngữ',

  other: 'Khác',
};

/** Đổi slug danh mục thành nhãn hiển thị. Chưa dịch thì trả về dạng đọc được. */
export function categoryLabel(slug: string): string {
  const hit = LABELS[slug];
  if (hit) return hit;
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Có bản dịch tay hay không — dùng để quyết định có hiện slug gốc kèm theo. */
export function hasVietnameseLabel(slug: string): boolean {
  return slug in LABELS;
}
