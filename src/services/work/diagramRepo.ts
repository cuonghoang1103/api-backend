/**
 * CT Work — CTW Diagram (10/10/2026): ĐỌC MÃ NGUỒN của repo đã nối (GitHub / GitLab) để AI vẽ ERD / class / deployment
 * từ CHÍNH mã của đội — chỉ ĐỌC, chỉ những tệp cần (schema.prisma, Flyway SQL, @Entity, lớp Java/TS, docker-compose).
 *
 *   GitHub  repo = WorkGithubConnection.repoFullName; khoá API = GITHUB_API_TOKEN của máy chủ (nếu có — đọc được repo riêng
 *           mà token đó thấy; không có thì chỉ repo công khai). GitLab: WorkGitlabConnection.repoPath trên gitlab.com, công khai.
 *   Trần: cây ≤ 8.000 đường dẫn, mỗi tệp ≤ 400 KB, mỗi lần vẽ ≤ 80 tệp; cache 5 phút theo repo. Không ghi gì ra ngoài.
 *   Nội dung tệp là DỮ LIỆU — chỉ được phân tích bằng bộ đọc của diagramGen.ts, không bao giờ làm lời nhắc cho model.
 */

import { config } from '../../config/env.js';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export interface RepoHandle {
  provider: 'github' | 'gitlab';
  repo: string;
  branch: string;
  paths: string[];
  read(path: string): Promise<string | null>;
}

const MAX_FILE = 400_000;
const TTL = 5 * 60_000;
const cache = new Map<string, { at: number; handle: RepoHandle }>();

let override: ((projectId: number) => Promise<RepoHandle | null>) | null = null;
/** CHỈ cho test: thay repo thật bằng tệp giả. */
export function _setRepoForTests(fn: ((projectId: number) => Promise<RepoHandle | null>) | null): void { override = fn; cache.clear(); }

/** Repo giả từ một bảng đường dẫn ⇒ nội dung (test + "dán schema" tay). */
export function memoryRepo(files: Record<string, string>, repo = 'local/files'): RepoHandle {
  return { provider: 'github', repo, branch: 'main', paths: Object.keys(files), read: async (p) => files[p] ?? null };
}

async function getJson(url: string, headers: Record<string, string>): Promise<unknown> {
  const r = await fetch(url, { headers, signal: AbortSignal.timeout(15_000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

async function github(repo: string): Promise<RepoHandle> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'ct-work-diagrams', 'X-GitHub-Api-Version': '2022-11-28' };
  if (config.githubApiToken) headers.Authorization = `Bearer ${config.githubApiToken}`;
  const [owner, name] = repo.split('/');
  const base = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
  const meta = (await getJson(base, headers)) as { default_branch?: string };
  const branch = meta.default_branch ?? 'main';
  const tree = (await getJson(`${base}/git/trees/${encodeURIComponent(branch)}?recursive=1`, headers)) as { tree?: Array<{ path: string; type: string; size?: number }> };
  const paths = (tree.tree ?? []).filter((t) => t.type === 'blob' && (t.size ?? 0) <= MAX_FILE).map((t) => t.path).slice(0, 8000);
  return {
    provider: 'github', repo, branch, paths,
    read: async (p) => {
      const r = await fetch(`${base}/contents/${p.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(branch)}`, { headers: { ...headers, Accept: 'application/vnd.github.raw' }, signal: AbortSignal.timeout(15_000) });
      if (!r.ok) return null;
      const s = await r.text();
      return s.length > MAX_FILE ? s.slice(0, MAX_FILE) : s;
    },
  };
}

async function gitlab(path: string): Promise<RepoHandle> {
  const id = encodeURIComponent(path);
  const base = `https://gitlab.com/api/v4/projects/${id}`;
  const meta = (await getJson(base, {})) as { default_branch?: string };
  const branch = meta.default_branch ?? 'main';
  const paths: string[] = [];
  for (let page = 1; page <= 40 && paths.length < 8000; page++) {
    const rows = (await getJson(`${base}/repository/tree?recursive=true&per_page=100&page=${page}&ref=${encodeURIComponent(branch)}`, {})) as Array<{ path: string; type: string }>;
    paths.push(...rows.filter((x) => x.type === 'blob').map((x) => x.path));
    if (rows.length < 100) break;
  }
  return {
    provider: 'gitlab', repo: path, branch, paths,
    read: async (p) => {
      const r = await fetch(`${base}/repository/files/${encodeURIComponent(p)}/raw?ref=${encodeURIComponent(branch)}`, { signal: AbortSignal.timeout(15_000) });
      if (!r.ok) return null;
      const s = await r.text();
      return s.length > MAX_FILE ? s.slice(0, MAX_FILE) : s;
    },
  };
}

/** Repo đã nối của dự án (null = chưa nối / không đọc được — lý do ở `error`). */
export async function repoFor(projectId: number): Promise<{ handle: RepoHandle | null; error: string | null }> {
  if (override) return { handle: await override(projectId), error: null };
  const [gh, gl] = await Promise.all([
    prisma.workGithubConnection.findUnique({ where: { projectId }, select: { repoFullName: true } }),
    prisma.workGitlabConnection.findUnique({ where: { projectId }, select: { repoPath: true } }),
  ]);
  const target = gh?.repoFullName ? { kind: 'github' as const, repo: gh.repoFullName } : gl?.repoPath ? { kind: 'gitlab' as const, repo: gl.repoPath } : null;
  if (!target) return { handle: null, error: 'No repository connected (Settings › Integrations › GitHub/GitLab, with the "owner/repo" name filled in)' };
  const key = `${target.kind}:${target.repo}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return { handle: hit.handle, error: null };
  try {
    const handle = target.kind === 'github' ? await github(target.repo) : await gitlab(target.repo);
    cache.set(key, { at: Date.now(), handle });
    return { handle, error: null };
  } catch (err) {
    logger.warn('[work] diagrams: không đọc được repo', { repo: target.repo, err: (err as Error).message });
    return { handle: null, error: `Could not read ${target.repo} (${(err as Error).message}) — private repositories need the server's GitHub token to have access` };
  }
}

// ─── Tìm tệp theo loại ───────────────────────────────────────────

const SKIP = /(^|\/)(node_modules|vendor|dist|build|target|\.next|out|coverage|test|tests|__tests__|\.git)\//i;

export const findPrisma = (paths: string[]) => paths.filter((p) => /(^|\/)schema\.prisma$/.test(p) && !SKIP.test(p)).sort((a, b) => a.length - b.length);
/** Flyway (V1__init.sql…) hoặc thư mục migration SQL; sắp theo số phiên bản. */
export function findSqlMigrations(paths: string[]): string[] {
  const fly = paths.filter((p) => /(^|\/)V\d+(?:[._]\d+)*__[\w.-]+\.sql$/i.test(p) && !SKIP.test(p));
  const ver = (p: string) => (/V(\d+(?:[._]\d+)*)__/i.exec(p)?.[1] ?? '0').split(/[._]/).map(Number);
  if (fly.length) return fly.sort((a, b) => { const x = ver(a); const y = ver(b); for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] ?? 0) - (y[i] ?? 0); if (d) return d; } return 0; });
  return paths.filter((p) => /(^|\/)(db|database|sql|schema|migrations?)\/[^/]*\.sql$/i.test(p) && !SKIP.test(p) && !/seed|data|insert/i.test(p)).sort();
}
export const findEntityCandidates = (paths: string[]) => paths.filter((p) => /\.(java|kt)$/.test(p) && !SKIP.test(p) && /(entity|entities|model|models|domain)\//i.test(p));
export const findClassCandidates = (paths: string[], filter?: string | null) => {
  const f = (filter ?? '').toLowerCase();
  return paths.filter((p) => /\.(java|kt|ts)$/.test(p) && !/\.(d|test|spec)\.ts$/.test(p) && !SKIP.test(p) && (!f || p.toLowerCase().includes(f)))
    .sort((a, b) => Number(/(entity|model|domain|service|controller)/i.test(b)) - Number(/(entity|model|domain|service|controller)/i.test(a)) || a.length - b.length);
};
export const findCompose = (paths: string[]) => paths.filter((p) => /(^|\/)(docker-)?compose(\.[\w-]+)?\.ya?ml$/i.test(p) && !SKIP.test(p)).sort((a, b) => a.split('/').length - b.split('/').length || a.length - b.length);

export async function readMany(h: RepoHandle, paths: string[], max = 80): Promise<Array<{ path: string; text: string }>> {
  const out: Array<{ path: string; text: string }> = [];
  for (let i = 0; i < Math.min(paths.length, max); i += 8) {
    const chunk = paths.slice(i, Math.min(i + 8, max));
    const got = await Promise.all(chunk.map(async (p) => ({ path: p, text: await h.read(p).catch(() => null) })));
    for (const g of got) if (g.text) out.push({ path: g.path, text: g.text });
  }
  return out;
}
