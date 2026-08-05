/**
 * Kho AI Templates — bảng khai báo 10 loại component.
 *
 * Tệp này AN TOÀN cho client (không import JSON), nên cả trang server lẫn
 * component client đều dùng chung một nguồn sự thật về: slug URL, nhãn tiếng
 * Việt, màu, biểu tượng, cờ CLI và cách dựng đường dẫn tới tệp gốc trên GitHub.
 */

import type { ComponentType, TypeSlug } from './types';

/** Repo gốc của bộ component (MIT). Mọi liên kết "xem trên GitHub" trỏ về đây. */
export const SOURCE_REPO = 'https://github.com/davila7/claude-code-templates';
export const SOURCE_RAW = 'https://raw.githubusercontent.com/davila7/claude-code-templates/main';
export const SOURCE_TREE = `${SOURCE_REPO}/blob/main`;
/** Thư mục chứa toàn bộ component trong repo. */
export const COMPONENTS_DIR = 'cli-tool/components';

export interface TypeMeta {
  slug: TypeSlug;
  type: ComponentType;
  /** Tên hiển thị (giữ nguyên tiếng Anh — đây là thuật ngữ của Claude Code). */
  label: string;
  /** Một dòng tiếng Việt giải thích loại này là gì. */
  tagline: string;
  /** Đoạn dài hơn, hiện ở đầu trang danh sách. */
  blurb: string;
  /** Cờ truyền cho `npx claude-code-templates@latest`. Rỗng = không cài kiểu này. */
  flag: string;
  /** Tên biểu tượng lucide-react. */
  icon: string;
  /** Màu chủ đạo (hex) — dùng cho viền, chấm, nền nhạt. */
  color: string;
  /** Thư mục con trong repo. Rỗng = không có tệp nguồn để hiển thị. */
  dir: string;
  /**
   * Cách suy ra tệp nội dung từ `path`:
   * - `file`  : path đã là tên tệp (`security/auditor.md`)
   * - `folder`: path là thư mục, tệp thật là `<path>/SKILL.md`
   * - `none`  : không có tệp (template, plugin)
   */
  contentMode: 'file' | 'folder' | 'none';
}

export const TYPES: readonly TypeMeta[] = [
  {
    slug: 'skills',
    type: 'skill',
    label: 'Skills',
    tagline: 'Bộ kỹ năng đóng gói sẵn cho Claude Code',
    blurb:
      'Mỗi Skill là một tệp SKILL.md mô tả quy trình làm việc: khi nào kích hoạt, các bước phải theo, tệp tham chiếu kèm theo. Cài xong là Claude tự gọi khi gặp đúng ngữ cảnh.',
    flag: '--skill',
    icon: 'Layers',
    color: '#f59e0b',
    dir: 'skills',
    contentMode: 'folder',
  },
  {
    slug: 'agents',
    type: 'agent',
    label: 'Agents',
    tagline: 'Trợ lý chuyên trách một mảng việc',
    blurb:
      'Sub-agent có prompt hệ thống riêng và bộ công cụ riêng. Dùng để tách việc nặng ra khỏi cửa sổ ngữ cảnh chính: rà bảo mật, review code, nghiên cứu tài liệu…',
    flag: '--agent',
    icon: 'Bot',
    color: '#8b5cf6',
    dir: 'agents',
    contentMode: 'file',
  },
  {
    slug: 'commands',
    type: 'command',
    label: 'Commands',
    tagline: 'Lệnh gạch chéo gõ trực tiếp trong phiên',
    blurb:
      'Slash command là một prompt soạn sẵn gắn với cái tên ngắn. Gõ `/tên` là chạy — hợp cho việc lặp đi lặp lại: commit, review, sinh test, dựng migration.',
    flag: '--command',
    icon: 'TerminalSquare',
    color: '#22d3ee',
    dir: 'commands',
    contentMode: 'file',
  },
  {
    slug: 'mcps',
    type: 'mcp',
    label: 'MCPs',
    tagline: 'Cắm công cụ ngoài qua Model Context Protocol',
    blurb:
      'Cấu hình MCP server để Claude Code nói chuyện được với hệ thống bên ngoài: cơ sở dữ liệu, trình duyệt, Notion, Sentry, Figma… Mỗi mục là một tệp JSON cắm-là-chạy.',
    flag: '--mcp',
    icon: 'Plug',
    color: '#10b981',
    dir: 'mcps',
    contentMode: 'file',
  },
  {
    slug: 'settings',
    type: 'setting',
    label: 'Settings',
    tagline: 'Mảnh cấu hình cho settings.json',
    blurb:
      'Từng mảnh cấu hình rời: dòng trạng thái, quyền hạn, biến môi trường, xác thực, telemetry. Cài mảnh nào thì mảnh đó được trộn vào settings.json.',
    flag: '--setting',
    icon: 'Settings2',
    color: '#94a3b8',
    dir: 'settings',
    contentMode: 'file',
  },
  {
    slug: 'hooks',
    type: 'hook',
    label: 'Hooks',
    tagline: 'Tự động chạy quanh mỗi lượt gọi công cụ',
    blurb:
      'Hook chen vào vòng đời phiên làm việc — trước/sau khi gọi công cụ, lúc mở phiên, lúc kết thúc. Dùng để chặn lệnh nguy hiểm, tự format, tự chạy test, ghi nhật ký.',
    flag: '--hook',
    icon: 'Webhook',
    color: '#f43f5e',
    dir: 'hooks',
    contentMode: 'file',
  },
  {
    slug: 'loops',
    type: 'loop',
    label: 'Loops',
    tagline: 'Vòng lặp làm–kiểm–sửa cho tới khi đạt',
    blurb:
      'Quy trình tự lặp: đặt tiêu chí máy kiểm được, chạy, đo, sửa, lặp lại — kèm chốt chặn để dừng khi không còn tiến triển thay vì quay vòng vô ích.',
    flag: '--loop',
    icon: 'RefreshCw',
    color: '#fb923c',
    dir: 'loops',
    contentMode: 'file',
  },
  {
    slug: 'sandbox',
    type: 'sandbox',
    label: 'Sandbox',
    tagline: 'Chạy agent trong môi trường cách ly',
    blurb:
      'Công thức dựng hộp cát cho agent: Docker, Cloudflare Workers, E2B. Cho agent chạy lệnh thoải mái mà không đụng tới máy thật.',
    flag: '--sandbox',
    icon: 'Box',
    color: '#38bdf8',
    dir: 'sandbox',
    contentMode: 'file',
  },
  {
    slug: 'templates',
    type: 'template',
    label: 'Templates',
    tagline: 'Bộ khởi tạo trọn gói cho một stack',
    blurb:
      'Gói dựng sẵn cả thư mục `.claude/` cho một ngôn ngữ hoặc framework: CLAUDE.md, command, agent, cấu hình MCP. Chạy một lệnh là có nền để làm việc ngay.',
    flag: '',
    icon: 'Package',
    color: '#a3e635',
    dir: '',
    contentMode: 'none',
  },
  {
    slug: 'plugins',
    type: 'plugin',
    label: 'Plugins',
    tagline: 'Bộ sưu tập cộng đồng gói thành một',
    blurb:
      'Plugin do cộng đồng phát hành, mỗi cái gói sẵn nhiều skill/agent/command cùng chủ đề. Cài một lần là có cả bộ, cập nhật theo repo của tác giả.',
    flag: '',
    icon: 'Blocks',
    color: '#ec4899',
    dir: '',
    contentMode: 'none',
  },
] as const;

export const TYPE_SLUGS = TYPES.map((t) => t.slug);

const BY_SLUG = new Map<string, TypeMeta>(TYPES.map((t) => [t.slug, t]));
const BY_TYPE = new Map<ComponentType, TypeMeta>(TYPES.map((t) => [t.type, t]));

export function getTypeBySlug(slug: string): TypeMeta | undefined {
  return BY_SLUG.get(slug);
}

export function getTypeMeta(type: ComponentType): TypeMeta {
  // Mọi ComponentType đều có mặt trong TYPES nên nhánh này không bao giờ chạy;
  // giữ lại để `strict` không phải nới lỏng ở chỗ gọi.
  return BY_TYPE.get(type) ?? TYPES[0];
}

/**
 * Bỏ đuôi tệp khỏi `path` để lấy định danh dùng cho lệnh cài.
 * `security/auditor.md` → `security/auditor`; skill vốn là thư mục nên giữ nguyên.
 */
export function toRef(path: string): string {
  return path.replace(/\.(md|json|ya?ml)$/i, '');
}

/**
 * Tách `path` thành [danh mục, tên] để dựng URL trang chi tiết.
 *
 * Với đa số loại, `path` đã có dạng `<danh-mục>/<tên>`. Riêng Templates và
 * Plugins thì `path` chỉ là một slug trần (`angular-app`) — lúc đó phải lấy
 * danh mục từ chính bản ghi, nếu không mọi URL của hai loại này đều rơi vào
 * `/other/` (`/ai-templates/templates/other/angular-app` — đúng, nhưng vô nghĩa
 * với người đọc và với Google).
 *
 * ⚠️ `findRecord` PHẢI gọi hàm này với cùng tham số `category` thì mới tìm lại
 * được bản ghi từ URL. Một bên truyền, một bên quên là trang chi tiết 404.
 */
export function splitRef(path: string, category?: string): { category: string; name: string } {
  const ref = toRef(path);
  const i = ref.indexOf('/');
  if (i === -1) return { category: category || 'other', name: ref };
  return { category: ref.slice(0, i), name: ref.slice(i + 1).replace(/\//g, '__') };
}

/** URL trang chi tiết của một component. */
export function detailHref(slug: TypeSlug, path: string, category?: string): string {
  const parts = splitRef(path, category);
  return `/ai-templates/${slug}/${encodeURIComponent(parts.category)}/${encodeURIComponent(parts.name)}`;
}

/**
 * `agent-management` → `Agent Management`.
 *
 * Từ viết tắt giữ nguyên chữ hoa: `ai-ethics-advisor` phải ra `AI Ethics
 * Advisor` chứ không phải `Ai Ethics Advisor` — đọc lướt danh sách 871 dòng thì
 * một chữ "Ai" lạc lõng đập vào mắt ngay.
 */
const ACRONYMS = new Set([
  'ai', 'api', 'cli', 'css', 'csv', 'db', 'dns', 'e2b', 'gcp', 'gpu', 'graphql',
  'html', 'http', 'id', 'io', 'ios', 'jwt', 'k8s', 'llm', 'lsp', 'mcp', 'ml',
  'ocr', 'orm', 'pdf', 'php', 'pr', 'qa', 'rag', 'sdk', 'seo', 'sql', 'ssh',
  'ssl', 'svg', 'tts', 'ui', 'ux', 'url', 'vpc', 'xml', 'yaml',
]);

export function prettyName(raw: string): string {
  return raw
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) =>
      ACRONYMS.has(w.toLowerCase())
        ? w.toUpperCase()
        : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(' ');
}

/** Đường dẫn tệp nguồn trong repo, hoặc null nếu loại này không có tệp. */
export function sourceFilePath(meta: TypeMeta, path: string): string | null {
  if (meta.contentMode === 'none' || !meta.dir) return null;
  const base = `${COMPONENTS_DIR}/${meta.dir}/${path}`;
  return meta.contentMode === 'folder' ? `${base}/SKILL.md` : base;
}
