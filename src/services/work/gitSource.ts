/**
 * CT Work — trang "Code" (18/10/2026): XEM MÃ NGUỒN repo đã nối, qua API của GitHub / GitLab (backend làm proxy).
 *
 * Quyền nằm ở code.service (thành viên dự án, không khách, không agent); file này chỉ lo gọi đi cho AN TOÀN:
 *   - Repo public ⇒ gọi KHÔNG token (GitHub cho 60 lượt/giờ mỗi IP) — có ĐỆM theo đường dẫn + ref (sha: 1 giờ, nhánh: 60 s)
 *     và gộp lượt gọi trùng đang bay; hết hạn mức (x-ratelimit-remaining = 0) ⇒ 429 tới hết giờ reset, KHÔNG gọi tiếp.
 *   - Repo private ⇒ token CHỈ ĐỌC do ADMIN dự án dán (fine-grained: Contents + Metadata: Read), lưu mã hoá
 *     (oauth/crypto.ts sealToken, AAD gắn đúng dự án + nhà cung cấp). Token KHÔNG BAO GIỜ trả về client, không vào log,
 *     không vào thông báo lỗi; đệm của repo dùng token tách theo dự án (dự án khác không đọc ké được qua đệm).
 *   - Trần: file > 1 MB ⇒ báo quá lớn; file nhị phân ⇒ báo không xem được; patch của một commit cắt ở ~800 KB.
 *   - GitLab tự host: chỉ https, không localhost / IP nội bộ (chặn SSRF qua URL lấy từ webhook).
 */

import { AppError, BadRequestError } from '../../middleware/errorHandler.js';
import { openToken, sealToken } from './oauth/crypto.js';

export type SourceProvider = 'GITHUB' | 'GITLAB';

export interface RepoTarget {
  provider: SourceProvider;
  /** owner/repo (GitHub) hoặc group/sub/project (GitLab). */
  repo: string;
  /** https://api.github.com hoặc https://gitlab.example.com/api/v4 */
  apiBase: string;
  /** https://github.com hoặc https://gitlab.example.com */
  webBase: string;
  token: string | null;
  projectId: number;
}

export const MAX_FILE_BYTES = 1_000_000;
const MAX_PATCH_TOTAL = 800_000;
const MAX_PATCH_FILE = 200_000;

// ─── Token ───────────────────────────────────────────────────────

export const tokenAadFor = (provider: SourceProvider, projectId: number) => `gitread:${provider}:${projectId}`;
export const sealReadToken = (provider: SourceProvider, projectId: number, token: string) => sealToken(token, tokenAadFor(provider, projectId));
export const openReadToken = (provider: SourceProvider, projectId: number, sealed: string | null | undefined) => openToken(sealed, tokenAadFor(provider, projectId));

/** Hình dạng token hợp lệ (không gọi đi): một chuỗi in được, không khoảng trắng, 20–255 ký tự. */
export function validReadTokenShape(t: string): boolean {
  return /^[\x21-\x7e]{20,255}$/.test(t);
}

// ─── Gọi đi (thay được trong test) ───────────────────────────────

type FetchLike = (url: string, init: { method?: string; headers: Record<string, string>; signal?: AbortSignal }) => Promise<Response>;
let fetchImpl: FetchLike = (url, init) => fetch(url, init);
/** Bỏ đệm + trạng thái hạn mức (đổi/xoá token chỉ đọc). */
export function clearSourceCache(): void {
  cache.clear();
  inflight.clear();
  limits.clear();
}
/** CHỈ cho test: thay `fetch` (mock) — `null` trả về fetch thật. Xoá luôn đệm + trạng thái hạn mức. */
export function __setGitFetchForTests(f: FetchLike | null): void {
  fetchImpl = f ?? ((url, init) => fetch(url, init));
  cache.clear();
  inflight.clear();
  limits.clear();
}

const cache = new Map<string, { exp: number; v: unknown }>();
const inflight = new Map<string, Promise<unknown>>();
const limits = new Map<string, { remaining: number; resetAt: number }>();
const CACHE_MAX = 600;

function cacheGet(k: string): unknown {
  const hit = cache.get(k);
  if (!hit) return undefined;
  if (hit.exp < Date.now()) { cache.delete(k); return undefined; }
  return hit.v;
}
function cacheSet(k: string, v: unknown, ttl: number) {
  if (cache.size >= CACHE_MAX) {
    // Bỏ ~10% mục cũ nhất (Map giữ thứ tự chèn).
    let n = Math.ceil(CACHE_MAX / 10);
    for (const key of cache.keys()) { cache.delete(key); if (--n <= 0) break; }
  }
  cache.set(k, { exp: Date.now() + ttl, v });
}

/** Ngăn hạn mức: repo public đi chung ngăn "anon" (một IP máy chủ), repo có token tách theo dự án. */
const bucketOf = (t: RepoTarget) => (t.token ? `p${t.projectId}:${t.provider}` : `anon:${t.provider}`);

function headersFor(t: RepoTarget): Record<string, string> {
  if (t.provider === 'GITHUB') {
    return {
      Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'CT-Work-Code-Viewer',
      ...(t.token ? { Authorization: `Bearer ${t.token}` } : {}),
    };
  }
  return { Accept: 'application/json', 'User-Agent': 'CT-Work-Code-Viewer', ...(t.token ? { 'PRIVATE-TOKEN': t.token } : {}) };
}

function noteLimit(t: RepoTarget, res: Response) {
  const rem = res.headers.get('x-ratelimit-remaining') ?? res.headers.get('ratelimit-remaining');
  if (rem === null) return;
  const remaining = Number(rem);
  if (!Number.isFinite(remaining)) return;
  const reset = Number(res.headers.get('x-ratelimit-reset') ?? res.headers.get('ratelimit-reset'));
  limits.set(bucketOf(t), { remaining, resetAt: Number.isFinite(reset) && reset > 0 ? reset * 1000 : Date.now() + 60_000 });
}

function rateLimited(resetAt: number): AppError {
  const sec = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return new AppError(`The code host's rate limit is used up — try again in ${sec >= 120 ? `${Math.ceil(sec / 60)} minutes` : `${sec} seconds`}. Adding a read-only token raises the limit.`, 429, 'WORK_GIT_RATE_LIMIT', { retryAfter: sec });
}

/** GET JSON có đệm + chặn hạn mức. `path` bắt đầu bằng '/'. Không bao giờ để token lọt vào lỗi. */
async function getJson<T>(t: RepoTarget, path: string, ttlMs: number): Promise<T> {
  const key = `${bucketOf(t)}|${t.repo}|${path}`;
  const hit = cacheGet(key);
  if (hit !== undefined) return hit as T;
  const flying = inflight.get(key);
  if (flying) return flying as Promise<T>;
  const lim = limits.get(bucketOf(t));
  if (lim && lim.remaining <= 0 && lim.resetAt > Date.now()) throw rateLimited(lim.resetAt);

  const p = (async () => {
    let res: Response;
    try {
      res = await fetchImpl(`${t.apiBase}${path}`, { method: 'GET', headers: headersFor(t), signal: AbortSignal.timeout(12_000) });
    } catch {
      throw new AppError(`Could not reach ${t.provider === 'GITHUB' ? 'GitHub' : 'GitLab'} — try again in a moment`, 502, 'WORK_GIT_UPSTREAM');
    }
    noteLimit(t, res);
    const host = t.provider === 'GITHUB' ? 'GitHub' : 'GitLab';
    if (res.status === 401) throw new AppError(`${host} rejected the read-only token — it may have expired or been revoked. A project admin can replace it in Settings → ${host}.`, 400, 'WORK_GIT_TOKEN_INVALID');
    if (res.status === 429 || (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0')) {
      const reset = Number(res.headers.get('x-ratelimit-reset') ?? res.headers.get('ratelimit-reset'));
      const at = Number.isFinite(reset) && reset > 0 ? reset * 1000 : Date.now() + 60_000;
      limits.set(bucketOf(t), { remaining: 0, resetAt: at });
      throw rateLimited(at);
    }
    if (res.status === 404 || res.status === 403) {
      throw new AppError(
        t.token
          ? `Not found on ${host} — check the path, or that the token can read ${t.repo}.`
          : `${host} did not return ${t.repo} — it may be private. A project admin can add a read-only token in Settings → ${host}.`,
        404, t.token ? 'WORK_GIT_NOT_FOUND' : 'WORK_GIT_PRIVATE',
      );
    }
    if (!res.ok) throw new AppError(`${host} answered ${res.status} — try again in a moment`, 502, 'WORK_GIT_UPSTREAM');
    const len = Number(res.headers.get('content-length'));
    if (Number.isFinite(len) && len > 12 * MAX_FILE_BYTES) throw new AppError('The response is too large to show here', 413, 'WORK_GIT_TOO_LARGE');
    const data = (await res.json()) as T;
    cacheSet(key, data, ttlMs);
    return data;
  })();
  inflight.set(key, p);
  try {
    return await p;
  } finally {
    inflight.delete(key);
  }
}

// ─── Kiểm đầu vào ────────────────────────────────────────────────

export function cleanPath(raw: unknown): string {
  const s = String(raw ?? '').trim().replace(/^\/+|\/+$/g, '');
  if (s.length > 500 || s.split('/').some((seg) => seg === '..' || seg === '.') || /[\0\\]/.test(s)) throw new BadRequestError('Invalid path', 'VALIDATION_ERROR');
  return s;
}
export function cleanRef(raw: unknown): string | null {
  const s = String(raw ?? '').trim();
  if (!s) return null;
  if (s.length > 200 || !/^[\w./@+-]+$/.test(s) || s.includes('..') || s.startsWith('/') || s.endsWith('/')) throw new BadRequestError('Invalid branch or commit', 'VALIDATION_ERROR');
  return s;
}
export function cleanSha(raw: unknown): string {
  const s = String(raw ?? '').trim();
  if (!/^[0-9a-f]{7,64}$/i.test(s)) throw new BadRequestError('Invalid commit id', 'VALIDATION_ERROR');
  return s.toLowerCase();
}
const enc = (p: string) => p.split('/').map(encodeURIComponent).join('/');
const isSha = (r: string) => /^[0-9a-f]{40,64}$/i.test(r);
const ttlFor = (ref: string) => (isSha(ref) ? 3_600_000 : 60_000);

/**
 * Gốc web của GitLab tự host (lấy từ `project.web_url` của webhook đã ký) — chỉ https, không localhost/IP nội bộ.
 * Không hợp lệ ⇒ null (dùng gitlab.com).
 */
export function safeGitlabBase(raw: unknown): string | null {
  try {
    const u = new URL(String(raw ?? ''));
    if (u.protocol !== 'https:') return null;
    const h = u.hostname.toLowerCase();
    if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') || h.endsWith('.internal')) return null;
    if (/^\d+\.\d+\.\d+\.\d+$/.test(h) || h.includes(':') || h.startsWith('[')) return null; // IP thô (v4/v6)
    return `https://${u.host}`;
  } catch {
    return null;
  }
}

// ─── API mức cao ─────────────────────────────────────────────────

export interface RepoMeta { defaultBranch: string; private: boolean; description: string | null; webUrl: string }

export async function repoMeta(t: RepoTarget): Promise<RepoMeta> {
  if (t.provider === 'GITHUB') {
    const r = await getJson<any>(t, `/repos/${t.repo}`, 300_000);
    return { defaultBranch: String(r.default_branch ?? 'main'), private: !!r.private, description: r.description ? String(r.description).slice(0, 300) : null, webUrl: String(r.html_url ?? `${t.webBase}/${t.repo}`) };
  }
  const r = await getJson<any>(t, `/projects/${encodeURIComponent(t.repo)}`, 300_000);
  return { defaultBranch: String(r.default_branch ?? 'main'), private: r.visibility ? r.visibility !== 'public' : false, description: r.description ? String(r.description).slice(0, 300) : null, webUrl: String(r.web_url ?? `${t.webBase}/${t.repo}`) };
}

export async function listRefs(t: RepoTarget): Promise<Array<{ name: string; sha: string | null }>> {
  if (t.provider === 'GITHUB') {
    const r = await getJson<any[]>(t, `/repos/${t.repo}/branches?per_page=100`, 60_000);
    return (Array.isArray(r) ? r : []).map((b) => ({ name: String(b.name), sha: b.commit?.sha ? String(b.commit.sha) : null }));
  }
  const r = await getJson<any[]>(t, `/projects/${encodeURIComponent(t.repo)}/repository/branches?per_page=100`, 60_000);
  return (Array.isArray(r) ? r : []).map((b) => ({ name: String(b.name), sha: b.commit?.id ? String(b.commit.id) : null }));
}

export interface TreeEntry { name: string; path: string; type: 'dir' | 'file' | 'symlink' | 'submodule'; size: number | null }

export async function tree(t: RepoTarget, ref: string, path: string): Promise<TreeEntry[]> {
  let out: TreeEntry[];
  if (t.provider === 'GITHUB') {
    const r = await getJson<any>(t, `/repos/${t.repo}/contents${path ? `/${enc(path)}` : ''}?ref=${encodeURIComponent(ref)}`, ttlFor(ref));
    if (!Array.isArray(r)) throw new BadRequestError('That path is a file, not a folder', 'WORK_GIT_NOT_DIR');
    out = r.map((e) => ({
      name: String(e.name), path: String(e.path),
      type: e.type === 'dir' ? 'dir' : e.type === 'symlink' ? 'symlink' : e.type === 'submodule' ? 'submodule' : 'file',
      size: typeof e.size === 'number' ? e.size : null,
    }));
  } else {
    const r = await getJson<any[]>(t, `/projects/${encodeURIComponent(t.repo)}/repository/tree?per_page=100&ref=${encodeURIComponent(ref)}${path ? `&path=${encodeURIComponent(path)}` : ''}`, ttlFor(ref));
    out = (Array.isArray(r) ? r : []).map((e) => ({ name: String(e.name), path: String(e.path), type: e.type === 'tree' ? 'dir' : e.type === 'commit' ? 'submodule' : 'file', size: null }));
  }
  return out.sort((a, b) => (a.type === 'dir') === (b.type === 'dir') ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1);
}

const BINARY_EXT = /\.(png|jpe?g|gif|webp|bmp|ico|icns|tiff?|psd|pdf|zip|gz|tgz|bz2|xz|7z|rar|jar|war|ear|class|exe|dll|so|dylib|o|a|lib|bin|dat|db|sqlite3?|mdb|accdb|woff2?|ttf|otf|eot|mp3|mp4|m4a|wav|ogg|mov|avi|mkv|webm|flac|docx?|xlsx?|pptx?|keystore|jks|p12|pfx)$/i;

/** Có ký tự NUL ở 8 KB đầu ⇒ nhị phân (cách git dùng). */
export function looksBinary(buf: Buffer, path = ''): boolean {
  if (BINARY_EXT.test(path)) return true;
  return buf.subarray(0, 8000).includes(0);
}

export interface BlobView { path: string; size: number; binary: boolean; tooLarge: boolean; content: string | null; webUrl: string }

export async function blob(t: RepoTarget, ref: string, path: string): Promise<BlobView> {
  if (!path) throw new BadRequestError('Pick a file', 'VALIDATION_ERROR');
  const webUrl = t.provider === 'GITHUB' ? `${t.webBase}/${t.repo}/blob/${encodeURIComponent(ref)}/${enc(path)}` : `${t.webBase}/${t.repo}/-/blob/${encodeURIComponent(ref)}/${enc(path)}`;
  let size = 0;
  let b64: string | null = null;
  if (t.provider === 'GITHUB') {
    const r = await getJson<any>(t, `/repos/${t.repo}/contents/${enc(path)}?ref=${encodeURIComponent(ref)}`, ttlFor(ref));
    if (Array.isArray(r) || r?.type !== 'file') throw new BadRequestError('That path is a folder, not a file', 'WORK_GIT_NOT_FILE');
    size = Number(r.size) || 0;
    b64 = r.encoding === 'base64' && typeof r.content === 'string' ? r.content : null;
  } else {
    const r = await getJson<any>(t, `/projects/${encodeURIComponent(t.repo)}/repository/files/${encodeURIComponent(path)}?ref=${encodeURIComponent(ref)}`, ttlFor(ref));
    size = Number(r.size) || 0;
    b64 = r.encoding === 'base64' && typeof r.content === 'string' ? r.content : null;
  }
  if (size > MAX_FILE_BYTES || (!b64 && size > 0)) return { path, size, binary: false, tooLarge: true, content: null, webUrl };
  const buf = Buffer.from(b64 ?? '', 'base64');
  if (looksBinary(buf, path)) return { path, size, binary: true, tooLarge: false, content: null, webUrl };
  return { path, size, binary: false, tooLarge: false, content: buf.toString('utf8'), webUrl };
}

export interface CommitSummary { sha: string; message: string; authorLogin: string | null; authorName: string | null; authorEmail: string | null; at: string | null; url: string }

export async function commits(t: RepoTarget, ref: string, path: string): Promise<CommitSummary[]> {
  if (t.provider === 'GITHUB') {
    const r = await getJson<any[]>(t, `/repos/${t.repo}/commits?per_page=30&sha=${encodeURIComponent(ref)}${path ? `&path=${encodeURIComponent(path)}` : ''}`, ttlFor(ref));
    return (Array.isArray(r) ? r : []).map((c) => ({
      sha: String(c.sha), message: String(c.commit?.message ?? '').slice(0, 2000), authorLogin: c.author?.login ? String(c.author.login) : null,
      authorName: c.commit?.author?.name ? String(c.commit.author.name) : null, authorEmail: c.commit?.author?.email ? String(c.commit.author.email) : null,
      at: c.commit?.author?.date ? String(c.commit.author.date) : null, url: String(c.html_url ?? `${t.webBase}/${t.repo}/commit/${c.sha}`),
    }));
  }
  const r = await getJson<any[]>(t, `/projects/${encodeURIComponent(t.repo)}/repository/commits?per_page=30&ref_name=${encodeURIComponent(ref)}${path ? `&path=${encodeURIComponent(path)}` : ''}`, ttlFor(ref));
  return (Array.isArray(r) ? r : []).map((c) => ({
    sha: String(c.id), message: String(c.message ?? c.title ?? '').slice(0, 2000), authorLogin: null, authorName: c.author_name ? String(c.author_name) : null,
    authorEmail: c.author_email ? String(c.author_email) : null, at: c.authored_date ? String(c.authored_date) : null, url: String(c.web_url ?? `${t.webBase}/${t.repo}/-/commit/${c.id}`),
  }));
}

export interface DiffFile { filename: string; previous: string | null; status: string; additions: number; deletions: number; patch: string | null; truncated: boolean }
export interface CommitDetail extends CommitSummary { parents: string[]; stats: { additions: number; deletions: number; files: number }; files: DiffFile[]; truncated: boolean }

/** Cắt patch theo trần từng tệp + tổng. HÀM THUẦN. */
export function capPatches(files: DiffFile[]): { files: DiffFile[]; truncated: boolean } {
  let total = 0;
  let truncated = false;
  const out = files.map((f) => {
    if (!f.patch) return f;
    if (total >= MAX_PATCH_TOTAL || f.patch.length > MAX_PATCH_FILE) { truncated = true; return { ...f, patch: null, truncated: true }; }
    total += f.patch.length;
    return f;
  });
  return { files: out, truncated };
}

export async function commit(t: RepoTarget, sha: string): Promise<CommitDetail> {
  if (t.provider === 'GITHUB') {
    const c = await getJson<any>(t, `/repos/${t.repo}/commits/${sha}`, 3_600_000);
    const files: DiffFile[] = (Array.isArray(c.files) ? c.files : []).slice(0, 300).map((f: any) => ({
      filename: String(f.filename), previous: f.previous_filename ? String(f.previous_filename) : null, status: String(f.status ?? 'modified'),
      additions: Number(f.additions) || 0, deletions: Number(f.deletions) || 0, patch: typeof f.patch === 'string' ? f.patch : null, truncated: typeof f.patch !== 'string' && (Number(f.changes) || 0) > 0,
    }));
    const capped = capPatches(files);
    return {
      sha: String(c.sha), message: String(c.commit?.message ?? '').slice(0, 5000), authorLogin: c.author?.login ? String(c.author.login) : null,
      authorName: c.commit?.author?.name ? String(c.commit.author.name) : null, authorEmail: c.commit?.author?.email ? String(c.commit.author.email) : null,
      at: c.commit?.author?.date ? String(c.commit.author.date) : null, url: String(c.html_url ?? `${t.webBase}/${t.repo}/commit/${c.sha}`),
      parents: (Array.isArray(c.parents) ? c.parents : []).map((p: any) => String(p.sha)),
      stats: { additions: Number(c.stats?.additions) || 0, deletions: Number(c.stats?.deletions) || 0, files: files.length },
      files: capped.files, truncated: capped.truncated || (Array.isArray(c.files) && c.files.length > 300),
    };
  }
  const id = encodeURIComponent(t.repo);
  const [c, diff] = await Promise.all([
    getJson<any>(t, `/projects/${id}/repository/commits/${sha}`, 3_600_000),
    getJson<any[]>(t, `/projects/${id}/repository/commits/${sha}/diff?per_page=100`, 3_600_000),
  ]);
  const files: DiffFile[] = (Array.isArray(diff) ? diff : []).map((d) => {
    const patch = typeof d.diff === 'string' ? d.diff : null;
    const lines: string[] = patch ? patch.split('\n') : [];
    return {
      filename: String(d.new_path ?? d.old_path), previous: d.renamed_file ? String(d.old_path) : null,
      status: d.new_file ? 'added' : d.deleted_file ? 'removed' : d.renamed_file ? 'renamed' : 'modified',
      additions: lines.filter((l) => l.startsWith('+') && !l.startsWith('+++')).length, deletions: lines.filter((l) => l.startsWith('-') && !l.startsWith('---')).length,
      patch, truncated: false,
    };
  });
  const capped = capPatches(files);
  return {
    sha: String(c.id), message: String(c.message ?? c.title ?? '').slice(0, 5000), authorLogin: null, authorName: c.author_name ? String(c.author_name) : null,
    authorEmail: c.author_email ? String(c.author_email) : null, at: c.authored_date ? String(c.authored_date) : null, url: String(c.web_url ?? `${t.webBase}/${t.repo}/-/commit/${c.id}`),
    parents: Array.isArray(c.parent_ids) ? c.parent_ids.map(String) : [],
    stats: { additions: Number(c.stats?.additions) || files.reduce((s, f) => s + f.additions, 0), deletions: Number(c.stats?.deletions) || files.reduce((s, f) => s + f.deletions, 0), files: files.length },
    files: capped.files, truncated: capped.truncated,
  };
}

/** Kiểm một token chỉ đọc có đọc được repo không (gọi /repos hoặc /projects, không đệm). */
export async function verifyToken(t: RepoTarget): Promise<boolean> {
  const path = t.provider === 'GITHUB' ? `/repos/${t.repo}` : `/projects/${encodeURIComponent(t.repo)}`;
  try {
    const res = await fetchImpl(`${t.apiBase}${path}`, { method: 'GET', headers: headersFor(t), signal: AbortSignal.timeout(12_000) });
    if (res.status === 401) throw new AppError(`${t.provider === 'GITHUB' ? 'GitHub' : 'GitLab'} rejected this token — check it was copied in full and has not expired`, 400, 'WORK_GIT_TOKEN_INVALID');
    return res.ok;
  } catch (err) {
    if (err instanceof AppError) throw err;
    return false;
  }
}

