/**
 * "Create with CuongMini" — đọc link người dùng dán: repo GitHub/GitLab (kèm nhánh), Google Docs/Sheets/Slides/Drive,
 * Figma… THUẦN: chỉ phân tích chuỗi; tải về nằm ở docNguon.ts.
 */

export interface RepoLink {
  provider: 'GITHUB' | 'GITLAB';
  /** owner/repo (GitHub) · group/sub/project (GitLab). */
  repo: string;
  /** Nhánh lấy từ URL (/tree/<nhánh>) hoặc người dùng nhập; null = nhánh mặc định. */
  branch: string | null;
  webBase: string;
  apiBase: string;
  webUrl: string;
}

const GH_RESERVED = new Set(['orgs', 'settings', 'marketplace', 'explore', 'topics', 'collections', 'sponsors', 'login', 'about', 'features', 'pricing', 'search']);

/**
 * "https://github.com/a/b", "github.com/a/b.git", "git@github.com:a/b.git", ".../tree/dev/src", "https://gitlab.com/g/sub/p/-/tree/main"
 * ⇒ RepoLink. Không phải repo ⇒ null. GitLab tự host: chỉ nhận https (host lạ đi qua safeGitlabBase ở lớp gọi).
 */
export function parseRepoUrl(raw: string, branchOverride?: string | null): RepoLink | null {
  let s = raw.trim();
  if (!s) return null;
  const ssh = /^git@([\w.-]+):(.+?)(?:\.git)?\/?$/.exec(s);
  if (ssh) s = `https://${ssh[1]}/${ssh[2]}`;
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  let u: URL;
  try { u = new URL(s); } catch { return null; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  const host = u.hostname.toLowerCase().replace(/^www\./, '');
  const parts = u.pathname.replace(/\.git$/i, '').split('/').filter(Boolean).map((p) => decodeURIComponent(p));
  const clean = (b: string | null | undefined) => {
    const t = (b ?? '').trim();
    return t && /^[\w./-]{1,120}$/.test(t) && !t.includes('..') ? t : null;
  };
  if (host === 'github.com') {
    if (parts.length < 2 || GH_RESERVED.has(parts[0].toLowerCase())) return null;
    const [owner, repo] = parts;
    if (!/^[\w.-]{1,100}$/.test(owner) || !/^[\w.-]{1,100}$/.test(repo)) return null;
    const branch = clean(branchOverride) ?? (parts[2] === 'tree' && parts[3] ? clean(parts.slice(3).join('/').split('/')[0]) : null);
    return { provider: 'GITHUB', repo: `${owner}/${repo}`, branch, webBase: 'https://github.com', apiBase: 'https://api.github.com', webUrl: `https://github.com/${owner}/${repo}` };
  }
  const isGitlab = host === 'gitlab.com' || host.startsWith('gitlab.') || parts.includes('-');
  if (isGitlab && u.protocol === 'https:') {
    const dash = parts.indexOf('-');
    const repoParts = dash >= 0 ? parts.slice(0, dash) : parts;
    if (repoParts.length < 2 || repoParts.some((p) => !/^[\w.-]{1,100}$/.test(p))) return null;
    const branch = clean(branchOverride) ?? (dash >= 0 && parts[dash + 1] === 'tree' && parts[dash + 2] ? clean(parts[dash + 2]) : null);
    const webBase = `https://${u.host}`;
    return { provider: 'GITLAB', repo: repoParts.join('/'), branch, webBase, apiBase: `${webBase}/api/v4`, webUrl: `${webBase}/${repoParts.join('/')}` };
  }
  return null;
}

export type LinkKind = 'repo' | 'gdoc' | 'gsheet' | 'gslide' | 'gdrive' | 'gfolder' | 'figma' | 'notion' | 'canva' | 'youtube' | 'web';

/** Phân loại nhanh (hiển thị chip + chọn cách đọc). */
export function classifyLink(raw: string): LinkKind | null {
  let u: URL;
  try { u = new URL(/^https?:\/\//i.test(raw.trim()) ? raw.trim() : `https://${raw.trim()}`); } catch { return null; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  const h = u.hostname.toLowerCase().replace(/^www\./, '');
  const p = u.pathname;
  if (parseRepoUrl(raw)) return 'repo';
  if (h === 'docs.google.com') {
    if (p.startsWith('/document/')) return 'gdoc';
    if (p.startsWith('/spreadsheets/')) return 'gsheet';
    if (p.startsWith('/presentation/')) return 'gslide';
    return 'gdrive';
  }
  if (h === 'drive.google.com') return p.includes('/folders/') ? 'gfolder' : 'gdrive';
  if (h.endsWith('figma.com')) return 'figma';
  if (h.endsWith('notion.so') || h.endsWith('notion.site')) return 'notion';
  if (h.endsWith('canva.com')) return 'canva';
  if (h === 'youtube.com' || h === 'youtu.be' || h === 'm.youtube.com') return 'youtube';
  return 'web';
}

/** Chuẩn hoá link để lưu (https, bỏ khoảng trắng); không hợp lệ ⇒ null. */
export function normalizeLink(raw: string): string | null {
  const t = raw.trim();
  if (!t || t.length > 2000) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    if (!u.hostname.includes('.')) return null;
    return u.toString();
  } catch {
    return null;
  }
}

/** Tệp đáng đọc trong một repo để hiểu stack + cấu trúc (thứ tự ưu tiên). */
export const REPO_KEY_FILES = [
  'README.md', 'readme.md', 'README', 'package.json', 'pom.xml', 'build.gradle', 'build.gradle.kts', 'requirements.txt', 'pyproject.toml',
  'composer.json', 'go.mod', 'Cargo.toml', 'Gemfile', '*.csproj', 'docker-compose.yml', 'Dockerfile', 'AGENTS.md', 'CLAUDE.md', 'CONTRIBUTING.md',
] as const;

/** Từ danh sách tệp gốc ⇒ đoán stack (hiển thị, model sửa được). */
export function detectStack(paths: string[], files: Record<string, string> = {}): string[] {
  const out = new Set<string>();
  const has = (re: RegExp) => paths.some((p) => re.test(p));
  const pkg = files['package.json'];
  if (pkg) {
    let deps: Record<string, unknown> = {};
    try { const j = JSON.parse(pkg); deps = { ...(j.dependencies ?? {}), ...(j.devDependencies ?? {}) }; } catch { /* bỏ */ }
    const d = (n: string) => n in deps;
    if (d('next')) out.add('Next.js');
    if (d('react')) out.add('React');
    if (d('vue')) out.add('Vue');
    if (d('@angular/core')) out.add('Angular');
    if (d('express')) out.add('Express');
    if (d('@nestjs/core')) out.add('NestJS');
    if (d('typescript')) out.add('TypeScript');
    if (d('prisma') || d('@prisma/client')) out.add('Prisma');
    if (d('mongoose')) out.add('MongoDB');
    if (d('tailwindcss')) out.add('Tailwind CSS');
    out.add('Node.js');
  }
  const pom = files['pom.xml'] ?? '';
  if (pom || has(/(^|\/)pom\.xml$/)) {
    out.add('Java');
    if (/spring-boot/.test(pom)) out.add('Spring Boot');
    if (/jakarta\.servlet|javax\.servlet/.test(pom)) out.add('Servlet/JSP');
    out.add('Maven');
  }
  if (has(/build\.gradle(\.kts)?$/)) { out.add('Java/Kotlin'); out.add('Gradle'); }
  if (has(/(requirements\.txt|pyproject\.toml)$/)) out.add('Python');
  if (/django/i.test(files['requirements.txt'] ?? '')) out.add('Django');
  if (/flask/i.test(files['requirements.txt'] ?? '')) out.add('Flask');
  if (/fastapi/i.test(files['requirements.txt'] ?? '')) out.add('FastAPI');
  if (has(/\.csproj$|\.sln$/)) out.add('.NET');
  if (has(/composer\.json$/)) out.add('PHP');
  if (has(/go\.mod$/)) out.add('Go');
  if (has(/Cargo\.toml$/)) out.add('Rust');
  if (has(/(^|\/)Dockerfile$|docker-compose\.ya?ml$/)) out.add('Docker');
  if (has(/\.jsp$/)) out.add('JSP');
  if (has(/\.sql$/)) out.add('SQL');
  return [...out];
}
