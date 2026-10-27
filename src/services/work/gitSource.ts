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

type FetchLike = (url: string, init: { method?: string; headers: Record<string, string>; signal?: AbortSignal; redirect?: RequestRedirect }) => Promise<Response>;
let fetchImpl: FetchLike = (url, init) => fetch(url, init);

/**
 * Gọi đi KHÔNG tự theo chuyển hướng (QA 18/10/2026): `fetch` mặc định theo 3xx tới BẤT KỲ đâu — kể cả `http://` và IP
 * nội bộ (169.254.169.254, container khác) — và mang theo header `PRIVATE-TOKEN` (undici chỉ gỡ `Authorization` khi đổi
 * nguồn). Một GitLab "tự host" do người cầm khoá webhook khai chỉ cần trả 302 là vượt được `safeGitlabBase`.
 * Nên: chỉ theo 3xx CÙNG nguồn với `apiBase` (GitHub đổi tên repo ⇒ 301 trong api.github.com), tối đa 3 bước; khác nguồn ⇒ 502.
 */
async function fetchCungNguon(t: RepoTarget, url: string, init: { method?: string; headers: Record<string, string>; signal?: AbortSignal }): Promise<Response> {
  const goc = new URL(t.apiBase).origin;
  let dich = url;
  for (let i = 0; i <= 3; i++) {
    const res = await fetchImpl(dich, { ...init, redirect: 'manual' });
    if (res.status < 300 || res.status >= 400 || res.status === 304) return res;
    const loc = res.headers.get('location');
    let next: URL | null = null;
    try { next = loc ? new URL(loc, dich) : null; } catch { next = null; }
    if (!next || next.origin !== goc) {
      throw new AppError(`${t.provider === 'GITHUB' ? 'GitHub' : 'GitLab'} redirected the request somewhere else — not followed`, 502, 'WORK_GIT_UPSTREAM');
    }
    dich = next.toString();
  }
  throw new AppError('Too many redirects from the code host', 502, 'WORK_GIT_UPSTREAM');
}
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
      res = await fetchCungNguon(t, `${t.apiBase}${path}`, { method: 'GET', headers: headersFor(t), signal: AbortSignal.timeout(12_000) });
    } catch (err) {
      if (err instanceof AppError) throw err;
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
    let data: T;
    try {
      data = (await res.json()) as T;
    } catch {
      // Trang HTML / thân cụt (proxy, GitLab đang bảo trì) ⇒ 502 rõ ràng thay vì 500 SyntaxError.
      throw new AppError(`${host} sent an unreadable answer — try again in a moment`, 502, 'WORK_GIT_UPSTREAM');
    }
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
    // Bỏ dấu chấm cuối: `localhost.` / `x.internal.` là cùng một tên với bản không chấm (QA 18/10/2026).
    const h = u.hostname.toLowerCase().replace(/\.+$/, '');
    if (!h || u.username || u.password) return null;
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

// ─── Pull request + so sánh nhánh (27/10/2026 — CuongMini đọc code để review) ─────────────

/** Map một file trong diff của GitHub (commit / PR files / compare dùng chung hình dạng). */
function ghFile(f: any): DiffFile {
  return {
    filename: String(f.filename), previous: f.previous_filename ? String(f.previous_filename) : null, status: String(f.status ?? 'modified'),
    additions: Number(f.additions) || 0, deletions: Number(f.deletions) || 0, patch: typeof f.patch === 'string' ? f.patch : null,
    truncated: typeof f.patch !== 'string' && (Number(f.changes) || 0) > 0,
  };
}
/** Map một mục diff của GitLab (commit diff / MR diffs / compare). Không có số +/− ⇒ đếm từ patch. */
function glDiff(d: any): DiffFile {
  const patch = typeof d.diff === 'string' && d.diff ? d.diff : null;
  const lines: string[] = patch ? patch.split('\n') : [];
  return {
    filename: String(d.new_path ?? d.old_path), previous: d.renamed_file ? String(d.old_path) : null,
    status: d.new_file ? 'added' : d.deleted_file ? 'removed' : d.renamed_file ? 'renamed' : 'modified',
    additions: lines.filter((l) => l.startsWith('+') && !l.startsWith('+++')).length, deletions: lines.filter((l) => l.startsWith('-') && !l.startsWith('---')).length,
    patch, truncated: !patch && (d.too_large === true || d.collapsed === true),
  };
}
function ghCommitSummary(t: RepoTarget, c: any): CommitSummary {
  return {
    sha: String(c.sha), message: String(c.commit?.message ?? '').slice(0, 2000), authorLogin: c.author?.login ? String(c.author.login) : null,
    authorName: c.commit?.author?.name ? String(c.commit.author.name) : null, authorEmail: c.commit?.author?.email ? String(c.commit.author.email) : null,
    at: c.commit?.author?.date ? String(c.commit.author.date) : null, url: String(c.html_url ?? `${t.webBase}/${t.repo}/commit/${c.sha}`),
  };
}
function glCommitSummary(t: RepoTarget, c: any): CommitSummary {
  return {
    sha: String(c.id), message: String(c.message ?? c.title ?? '').slice(0, 2000), authorLogin: null, authorName: c.author_name ? String(c.author_name) : null,
    authorEmail: c.author_email ? String(c.author_email) : null, at: c.authored_date ? String(c.authored_date) : null, url: String(c.web_url ?? `${t.webBase}/${t.repo}/-/commit/${c.id}`),
  };
}

export function cleanPrNumber(raw: unknown): number {
  const n = typeof raw === 'number' ? raw : Number(String(raw ?? '').trim().replace(/^[#!]/, ''));
  if (!Number.isInteger(n) || n <= 0 || n > 10_000_000) throw new BadRequestError('Invalid pull request number', 'VALIDATION_ERROR');
  return n;
}

export type PullState = 'open' | 'draft' | 'merged' | 'closed';
export interface PullDetail {
  number: number; title: string; body: string | null; state: PullState; draft: boolean; mergeable: boolean | null;
  headRef: string; headSha: string | null; baseRef: string; baseSha: string | null; authorLogin: string | null;
  additions: number | null; deletions: number | null; changedFiles: number | null; commits: number | null;
  createdAt: string | null; mergedAt: string | null; url: string;
}
const MAX_PR_BODY = 20_000;

/** Chi tiết MỘT PR (GitHub) / MR (GitLab). Đệm 60 s (PR còn đổi). */
export async function pull(t: RepoTarget, n: number): Promise<PullDetail> {
  if (t.provider === 'GITHUB') {
    const p = await getJson<any>(t, `/repos/${t.repo}/pulls/${n}`, 60_000);
    const merged = !!p.merged || !!p.merged_at;
    return {
      number: Number(p.number) || n, title: String(p.title ?? '').slice(0, 300), body: p.body ? String(p.body).slice(0, MAX_PR_BODY) : null,
      state: merged ? 'merged' : p.state === 'closed' ? 'closed' : p.draft ? 'draft' : 'open', draft: !!p.draft,
      mergeable: typeof p.mergeable === 'boolean' ? p.mergeable : null,
      headRef: String(p.head?.ref ?? ''), headSha: p.head?.sha ? String(p.head.sha) : null, baseRef: String(p.base?.ref ?? ''), baseSha: p.base?.sha ? String(p.base.sha) : null,
      authorLogin: p.user?.login ? String(p.user.login) : null,
      additions: Number.isFinite(Number(p.additions)) ? Number(p.additions) : null, deletions: Number.isFinite(Number(p.deletions)) ? Number(p.deletions) : null,
      changedFiles: Number.isFinite(Number(p.changed_files)) ? Number(p.changed_files) : null, commits: Number.isFinite(Number(p.commits)) ? Number(p.commits) : null,
      createdAt: p.created_at ? String(p.created_at) : null, mergedAt: p.merged_at ? String(p.merged_at) : null, url: String(p.html_url ?? `${t.webBase}/${t.repo}/pull/${n}`),
    };
  }
  const m = await getJson<any>(t, `/projects/${encodeURIComponent(t.repo)}/merge_requests/${n}`, 60_000);
  const st = String(m.state ?? 'opened');
  const draft = !!(m.draft ?? m.work_in_progress);
  const ms = String(m.detailed_merge_status ?? m.merge_status ?? '');
  const changes = Number(String(m.changes_count ?? '').replace(/\D/g, ''));
  return {
    number: Number(m.iid) || n, title: String(m.title ?? '').slice(0, 300), body: m.description ? String(m.description).slice(0, MAX_PR_BODY) : null,
    state: st === 'merged' ? 'merged' : st === 'closed' || st === 'locked' ? 'closed' : draft ? 'draft' : 'open', draft,
    mergeable: /^(can_be_merged|mergeable)$/.test(ms) ? true : /cannot|conflict|broken/.test(ms) ? false : null,
    headRef: String(m.source_branch ?? ''), headSha: m.sha ? String(m.sha) : m.diff_refs?.head_sha ? String(m.diff_refs.head_sha) : null,
    baseRef: String(m.target_branch ?? ''), baseSha: m.diff_refs?.base_sha ? String(m.diff_refs.base_sha) : null,
    authorLogin: m.author?.username ? String(m.author.username) : null, additions: null, deletions: null,
    changedFiles: Number.isFinite(changes) && changes > 0 ? changes : null, commits: null,
    createdAt: m.created_at ? String(m.created_at) : null, mergedAt: m.merged_at ? String(m.merged_at) : null, url: String(m.web_url ?? `${t.webBase}/${t.repo}/-/merge_requests/${n}`),
  };
}

const MAX_PR_FILES = 300;

/** Tệp đổi trong một PR/MR kèm patch (cùng trần với `commit`: 200 KB/tệp, 800 KB tổng; tối đa 300 tệp). */
export async function pullFiles(t: RepoTarget, n: number): Promise<{ files: DiffFile[]; truncated: boolean }> {
  if (t.provider === 'GITHUB') {
    const all: any[] = [];
    for (let page = 1; page <= 3; page++) {
      const r = await getJson<any[]>(t, `/repos/${t.repo}/pulls/${n}/files?per_page=100&page=${page}`, 60_000);
      const list = Array.isArray(r) ? r : [];
      all.push(...list);
      if (list.length < 100) break;
    }
    const capped = capPatches(all.slice(0, MAX_PR_FILES).map(ghFile));
    return { files: capped.files, truncated: capped.truncated || all.length >= MAX_PR_FILES };
  }
  const id = encodeURIComponent(t.repo);
  let diffs: any[];
  try {
    const r = await getJson<any[]>(t, `/projects/${id}/merge_requests/${n}/diffs?per_page=100`, 60_000);
    diffs = Array.isArray(r) ? r : [];
  } catch (err) {
    // GitLab < 15.7 không có /diffs ⇒ /changes (cùng dữ liệu, gói trong `changes`). MR không tồn tại ⇒ /changes cũng 404.
    if (!(err instanceof AppError) || err.statusCode !== 404) throw err;
    const r = await getJson<any>(t, `/projects/${id}/merge_requests/${n}/changes`, 60_000);
    diffs = Array.isArray(r?.changes) ? r.changes : [];
  }
  const capped = capPatches(diffs.slice(0, MAX_PR_FILES).map(glDiff));
  return { files: capped.files, truncated: capped.truncated || diffs.length > MAX_PR_FILES };
}

export interface CompareView {
  base: string; head: string; status: string | null; aheadBy: number; behindBy: number | null; totalCommits: number;
  commits: CommitSummary[]; files: DiffFile[]; truncated: boolean; url: string;
}
const MAX_COMPARE_COMMITS = 100;

/** So sánh `base...head` (điểm rẽ chung → head, như trang Compare / diff của PR). Hai đầu là sha ⇒ đệm 1 giờ. */
export async function compare(t: RepoTarget, base: string, head: string): Promise<CompareView> {
  const ttl = isSha(base) && isSha(head) ? 3_600_000 : 60_000;
  if (t.provider === 'GITHUB') {
    const c = await getJson<any>(t, `/repos/${t.repo}/compare/${enc(base)}...${enc(head)}`, ttl);
    const commitsAll = (Array.isArray(c.commits) ? c.commits : []) as any[];
    const filesAll = (Array.isArray(c.files) ? c.files : []) as any[];
    const capped = capPatches(filesAll.slice(0, MAX_PR_FILES).map(ghFile));
    return {
      base, head, status: c.status ? String(c.status) : null, aheadBy: Number(c.ahead_by) || 0, behindBy: Number.isFinite(Number(c.behind_by)) ? Number(c.behind_by) : null,
      totalCommits: Number(c.total_commits) || commitsAll.length,
      // GitHub trả cũ → mới; giữ 100 commit MỚI nhất.
      commits: commitsAll.slice(-MAX_COMPARE_COMMITS).map((x) => ghCommitSummary(t, x)),
      files: capped.files, truncated: capped.truncated || filesAll.length > MAX_PR_FILES || (Number(c.total_commits) || 0) > commitsAll.length,
      url: String(c.html_url ?? `${t.webBase}/${t.repo}/compare/${enc(base)}...${enc(head)}`),
    };
  }
  const c = await getJson<any>(t, `/projects/${encodeURIComponent(t.repo)}/repository/compare?from=${encodeURIComponent(base)}&to=${encodeURIComponent(head)}&straight=false`, ttl);
  const commitsAll = (Array.isArray(c.commits) ? c.commits : []) as any[];
  const diffs = (Array.isArray(c.diffs) ? c.diffs : []) as any[];
  const capped = capPatches(diffs.slice(0, MAX_PR_FILES).map(glDiff));
  return {
    base, head, status: c.compare_same_ref ? 'identical' : commitsAll.length ? 'ahead' : 'identical', aheadBy: commitsAll.length, behindBy: null,
    totalCommits: commitsAll.length, commits: commitsAll.slice(0, MAX_COMPARE_COMMITS).map((x) => glCommitSummary(t, x)),
    files: capped.files, truncated: capped.truncated || diffs.length > MAX_PR_FILES || c.compare_timeout === true,
    url: String(c.web_url ?? `${t.webBase}/${t.repo}/-/compare/${encodeURIComponent(base)}...${encodeURIComponent(head)}`),
  };
}

/** Kiểm một token chỉ đọc có đọc được repo không (gọi /repos hoặc /projects, không đệm). */
export async function verifyToken(t: RepoTarget): Promise<boolean> {
  const path = t.provider === 'GITHUB' ? `/repos/${t.repo}` : `/projects/${encodeURIComponent(t.repo)}`;
  try {
    const res = await fetchCungNguon(t, `${t.apiBase}${path}`, { method: 'GET', headers: headersFor(t), signal: AbortSignal.timeout(12_000) });
    if (res.status === 401) throw new AppError(`${t.provider === 'GITHUB' ? 'GitHub' : 'GitLab'} rejected this token — check it was copied in full and has not expired`, 400, 'WORK_GIT_TOKEN_INVALID');
    return res.ok;
  } catch (err) {
    if (err instanceof AppError) throw err;
    return false;
  }
}

