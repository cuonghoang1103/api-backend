/**
 * Nhãn & nhóm công nghệ của Dự án — CHÉP từ `frontend/src/lib/projectI18n.ts`.
 *
 * Vì sao chép chứ không import `@/lib/projectI18n`: tệp đó kéo theo hook
 * `useTranslation` của web (cookie `locale`), và trình kiểm kiểu của app chỉ
 * biết những mô-đun web đã khai trong `shims/web-modules.d.ts`. Đây chỉ là bảng
 * hằng — đổi bên web thì chép lại; giá trị khoá (COMPLETED, Web, BEGINNER…) là
 * enum của API nên không trôi được mà không ai thấy.
 */
export type Lang = 'vi' | 'en';

export function pickLang<T extends string | null | undefined>(
  lang: Lang,
  vi: T,
  en: T,
): string {
  if (lang === 'en') {
    const trimmed = typeof en === 'string' ? en.trim() : '';
    if (trimmed) return trimmed;
  }
  return typeof vi === 'string' ? vi : '';
}

export const LEVEL_LABELS_I18N: Record<string, { vi: string; en: string }> = {
  BEGINNER: { vi: 'Cơ bản', en: 'Beginner' },
  INTERMEDIATE: { vi: 'Trung bình', en: 'Intermediate' },
  ADVANCED: { vi: 'Nâng cao', en: 'Advanced' },
  EXPERT: { vi: 'Chuyên sâu', en: 'Expert' },
};

export const STATUS_LABELS_I18N: Record<string, { vi: string; en: string }> = {
  COMPLETED: { vi: 'Hoàn thành', en: 'Completed' },
  IN_PROGRESS: { vi: 'Đang làm', en: 'In progress' },
  PLANNING: { vi: 'Lên kế hoạch', en: 'Planning' },
  MAINTENANCE: { vi: 'Bảo trì', en: 'Maintenance' },
  ON_HOLD: { vi: 'Tạm dừng', en: 'On hold' },
};

export const CATEGORY_LABELS_I18N: Record<string, { vi: string; en: string }> = {
  Web: { vi: 'Web', en: 'Web' },
  Mobile: { vi: 'Di động', en: 'Mobile' },
  AI: { vi: 'AI', en: 'AI' },
  DevOps: { vi: 'DevOps', en: 'DevOps' },
  Game: { vi: 'Game', en: 'Game' },
  IoT: { vi: 'IoT', en: 'IoT' },
  Data: { vi: 'Dữ liệu', en: 'Data' },
  Tooling: { vi: 'Công cụ', en: 'Tooling' },
  Systems: { vi: 'Hệ thống', en: 'Systems' },
  Backend: { vi: 'Backend', en: 'Backend' },
};

export const PHASE_LABELS_I18N: Record<string, { vi: string; en: string }> = {
  IDEATION: { vi: 'Ý tưởng', en: 'Ideation' },
  PLANNING: { vi: 'Lên kế hoạch', en: 'Planning' },
  DESIGN: { vi: 'Thiết kế', en: 'Design' },
  SETUP: { vi: 'Khởi tạo', en: 'Setup' },
  BACKEND: { vi: 'Backend', en: 'Backend' },
  FRONTEND: { vi: 'Frontend', en: 'Frontend' },
  DATABASE: { vi: 'Cơ sở dữ liệu', en: 'Database' },
  MOBILE: { vi: 'Di động', en: 'Mobile' },
  AI: { vi: 'AI', en: 'AI' },
  TESTING: { vi: 'Kiểm thử', en: 'Testing' },
  DEVOPS: { vi: 'DevOps', en: 'DevOps' },
  SECURITY: { vi: 'Bảo mật', en: 'Security' },
  SCALING: { vi: 'Mở rộng', en: 'Scaling' },
  LAUNCH: { vi: 'Ra mắt', en: 'Launch' },
};

export const TECH_GROUPS: {
  id: string;
  label: string;
  match: RegExp;
}[] = [
  { id: 'typescript', label: 'TypeScript',   match: /typescript/ },
  { id: 'node',       label: 'Node.js',      match: /node\.?js|express|nestjs|socket\.io|bullmq/ },
  { id: 'react',      label: 'React / Next', match: /(^|[^a-z])react(?!\s*native)|next\.js/ },
  { id: 'java',       label: 'Java',         match: /(^|[^a-z])java(\s|$|\d)|jvm|netty|hibernate/ },
  { id: 'spring',     label: 'Spring Boot',  match: /spring/ },
  { id: 'python',     label: 'Python',       match: /python|fastapi|django|flask|pytorch|httpx/ },
  { id: 'dotnet',     label: '.NET / C#',    match: /\.net|c#|asp\.net|entity framework/ },
  { id: 'go',         label: 'Go',           match: /(^|[^a-z])go($|[^a-z])|golang|gin(\s|$)/ },
  { id: 'rust',       label: 'Rust',         match: /rust|tokio|axum/ },
  { id: 'kotlin',     label: 'Kotlin',       match: /kotlin|jetpack compose|room(\s|$)/ },
  { id: 'swift',      label: 'Swift',        match: /swift/ },
  { id: 'flutter',    label: 'Flutter/Dart', match: /flutter|dart|riverpod/ },
  { id: 'rn',         label: 'React Native', match: /react native|expo/ },
  { id: 'postgres',   label: 'PostgreSQL',   match: /postgres|prisma|pgvector|btree_gist/ },
  { id: 'redis',      label: 'Redis',        match: /redis/ },
  { id: 'kafka',      label: 'Kafka',        match: /kafka/ },
  { id: 'docker',     label: 'Docker',       match: /docker/ },
  { id: 'k8s',        label: 'Kubernetes',   match: /kubernetes|k8s|helm|terraform/ },
  { id: 'llm',        label: 'LLM / AI',     match: /llm|openai|embedding|pgvector|pytorch|nccl|tree-sitter|anthropic/ },
];

export function labelOf(
  table: Record<string, { vi: string; en: string }>,
  key: string | null | undefined,
  lang: Lang,
): string {
  if (!key) return '';
  const entry = table[key];
  if (!entry) return key;
  return lang === 'en' ? entry.en : entry.vi;
}

export function matchesTechGroup(
  technologies: string[] | null | undefined,
  groupId: string,
): boolean {
  if (!groupId) return true;
  const group = TECH_GROUPS.find((g) => g.id === groupId);
  if (!group) return true;
  return (technologies ?? []).some((t) => group.match.test(t.toLowerCase()));
}
