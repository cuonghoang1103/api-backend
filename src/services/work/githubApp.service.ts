/**
 * CT Work 27/10/2026 — GitHub App "CT Work by CuongThai": ĐƯỜNG CHÍNH nối GitHub (PAT + webhook dán tay giữ làm dự phòng;
 * GitLab giữ nguyên). Tài liệu: docs/ctw-github-app.md.
 *
 *   1. Tạo app MỘT LẦN (site ADMIN) bằng App Manifest flow: trang /admin/ctwork-github ⇒ form POST tới GitHub với manifest
 *      ⇒ GitHub chuyển về `GET /github-app/manifest/callback?code&state` ⇒ POST /app-manifests/{code}/conversions ⇒ lưu
 *      app id, slug, client id/secret, webhook secret, private key — MÃ HOÁ (sealToken, AAD 'github-app') trong
 *      app_settings `ctw.github_app`. Không bao giờ trả về client, không log. Env (GITHUB_APP_*) thắng nếu đã đặt.
 *   2. Cài theo dự án: Settings → GitHub ⇒ https://github.com/apps/<slug>/installations/new?state=<HMAC pid+userId+exp>
 *      ⇒ GitHub (request_oauth_on_install) chuyển về `GET /github-app/setup?code&installation_id&state` ⇒ đổi code lấy user
 *      token ⇒ GET /user/installations xác minh người cài thật sự có bản cài đó ⇒ BỎ token ⇒ vé chọn repo (HMAC, 30 phút)
 *      ⇒ UI chọn repo ⇒ POST /projects/:pid/github-app/link.
 *   3. Token: JWT RS256 ⇒ installation token (đệm tới gần hết hạn, giới hạn đúng repo) ⇒ gitSource ưu tiên token app.
 *   4. Webhook chung `POST /github/webhook/app`: kiểm chữ ký bằng secret app; installation deleted/suspend ⇒ đánh dấu ngắt;
 *      sự kiện repo ⇒ định tuyến theo repository.id ⇒ dự án ⇒ xử lý như webhook dán tay (processGithubEvent) + CI.
 *   5. Đăng review lên PR (event COMMENT — KHÔNG BAO GIỜ APPROVE/REQUEST_CHANGES tự động, không merge), bình luận inline chỉ
 *      trên dòng có trong diff.
 */

import { prisma } from '../../config/database.js';
import { config as envConfig } from '../../config/env.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { frontendUrl } from './common.js';
import { appJwt, appManifest, ciStateOf, inlineComments, normalizePem, readAppState, signAppState, webhookSignatureOk } from './githubAppRules.js';
import { openToken, sealToken } from './oauth/crypto.js';
import { requireProject } from './permissions.js';
import type { CodeFinding } from './codeReviewRules.js';

const SETTING_KEY = 'ctw.github_app';
const AAD = 'github-app';
const API = 'https://api.github.com';

export interface GithubAppCreds {
  appId: string; slug: string; clientId: string; clientSecret: string; webhookSecret: string; pem: string; htmlUrl: string | null; owner: string | null;
}

// ─── Gọi GitHub (thay được trong test) ────────────────────────────

type FetchLike = (url: string, init: { method?: string; headers: Record<string, string>; body?: string; signal?: AbortSignal; redirect?: RequestRedirect }) => Promise<Response>;
let fetchImpl: FetchLike = (url, init) => fetch(url, init);
export function __setAppFetchForTests(f: FetchLike | null): void {
  fetchImpl = f ?? ((url, init) => fetch(url, init));
  tokenCache.clear();
  credsCache = undefined;
}

async function gh<T>(method: string, url: string, auth: string | null, body?: unknown, accept = 'application/vnd.github+json'): Promise<T> {
  let res: Response;
  try {
    res = await fetchImpl(url, {
      method, redirect: 'error', signal: AbortSignal.timeout(15_000),
      headers: { Accept: accept, 'User-Agent': 'CT-Work-GitHub-App', 'X-GitHub-Api-Version': '2022-11-28', ...(auth ? { Authorization: auth } : {}), ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new AppError('Could not reach GitHub — try again in a moment', 502, 'WORK_GIT_UPSTREAM');
  }
  const text = await res.text();
  if (!res.ok) {
    let msg = '';
    try { msg = String((JSON.parse(text) as { message?: unknown }).message ?? ''); } catch { /* không phải JSON */ }
    throw new AppError(`GitHub answered ${res.status}${msg ? `: ${msg.slice(0, 200)}` : ''}`, res.status === 404 ? 404 : res.status === 401 || res.status === 403 ? 400 : 502, 'WORK_GITHUB_APP_UPSTREAM');
  }
  try { return (text ? JSON.parse(text) : {}) as T; } catch { throw new AppError('GitHub sent an unreadable answer', 502, 'WORK_GIT_UPSTREAM'); }
}

// ─── Thông tin app (env thắng, rồi app_settings đã mã hoá) ──────────

let credsCache: { at: number; v: GithubAppCreds | null } | undefined;

export async function appCreds(): Promise<GithubAppCreds | null> {
  const e = process.env;
  if (e.GITHUB_APP_ID && e.GITHUB_APP_PRIVATE_KEY && e.GITHUB_APP_WEBHOOK_SECRET && e.GITHUB_APP_SLUG) {
    return {
      appId: e.GITHUB_APP_ID, slug: e.GITHUB_APP_SLUG, clientId: e.GITHUB_APP_CLIENT_ID ?? '', clientSecret: e.GITHUB_APP_CLIENT_SECRET ?? '',
      webhookSecret: e.GITHUB_APP_WEBHOOK_SECRET, pem: normalizePem(e.GITHUB_APP_PRIVATE_KEY), htmlUrl: null, owner: null,
    };
  }
  if (credsCache && Date.now() - credsCache.at < 60_000) return credsCache.v;
  const row = await prisma.appSetting.findUnique({ where: { key: SETTING_KEY } }).catch(() => null);
  const plain = openToken(row?.value ?? null, AAD);
  let v: GithubAppCreds | null = null;
  if (plain) { try { v = JSON.parse(plain) as GithubAppCreds; } catch { v = null; } }
  credsCache = { at: Date.now(), v };
  return v;
}

export async function saveCreds(c: GithubAppCreds): Promise<void> {
  const value = sealToken(JSON.stringify(c), AAD);
  await prisma.appSetting.upsert({ where: { key: SETTING_KEY }, create: { key: SETTING_KEY, value }, update: { value } });
  credsCache = undefined;
  tokenCache.clear();
}

/** Khoá ký state: không phụ thuộc app (state của manifest có trước khi có app). */
const stateSecret = () => `ctw-github-app-state|${envConfig.jwtSecret}`;

async function isSiteAdmin(userId: number): Promise<boolean> {
  const u = await prisma.user.findUnique({ where: { id: userId }, include: { roles: { include: { role: true } } } });
  return !!u && u.enabled && u.roles.some((r) => r.role.name === 'ROLE_ADMIN');
}

// ─── 1. Tạo app bằng manifest (site ADMIN) ────────────────────────

export async function appStatus() {
  const c = await appCreds();
  const fromEnv = !!process.env.GITHUB_APP_ID && !!process.env.GITHUB_APP_PRIVATE_KEY;
  return c
    ? { configured: true, source: fromEnv ? 'env' : 'db', appId: c.appId, slug: c.slug, htmlUrl: c.htmlUrl ?? `https://github.com/apps/${c.slug}`, owner: c.owner, oauthOnInstall: !!c.clientId && !!c.clientSecret }
    : { configured: false, source: null, appId: null, slug: null, htmlUrl: null, owner: null, oauthOnInstall: false };
}

/** Dữ liệu để trang admin tự POST form tới GitHub. `org` trống ⇒ app thuộc tài khoản cá nhân của người bấm. */
export function manifestForm(userId: number, org?: string | null) {
  const o = org?.trim() || null;
  if (o && !/^[A-Za-z0-9-]{1,39}$/.test(o)) throw new BadRequestError('Invalid organization name', 'VALIDATION_ERROR');
  const state = signAppState(stateSecret(), { k: 'manifest', u: userId }, 30 * 60);
  const action = `https://github.com/${o ? `organizations/${o}/` : ''}settings/apps/new?state=${encodeURIComponent(state)}`;
  return { action, manifest: JSON.stringify(appManifest(frontendUrl(''))), state };
}

/** GitHub chuyển về sau khi người dùng bấm "Create GitHub App". */
export async function manifestCallback(code: string, state: string): Promise<{ slug: string }> {
  const s = readAppState<{ k: string; u: number }>(stateSecret(), state);
  if (!s || s.k !== 'manifest' || typeof s.u !== 'number') throw new BadRequestError('This link has expired or was changed — start again from the admin page', 'WORK_GITHUB_APP_STATE');
  if (!(await isSiteAdmin(s.u))) throw new ForbiddenError('Only a site admin can create the CT Work GitHub App');
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(code)) throw new BadRequestError('Invalid code', 'VALIDATION_ERROR');
  const r = await gh<any>('POST', `${API}/app-manifests/${code}/conversions`, null, {});
  const c: GithubAppCreds = {
    appId: String(r.id), slug: String(r.slug), clientId: String(r.client_id ?? ''), clientSecret: String(r.client_secret ?? ''),
    webhookSecret: String(r.webhook_secret ?? ''), pem: String(r.pem ?? ''), htmlUrl: r.html_url ? String(r.html_url) : null, owner: r.owner?.login ? String(r.owner.login) : null,
  };
  if (!c.appId || !c.slug || !c.pem || !c.webhookSecret) throw new AppError('GitHub did not return the app credentials', 502, 'WORK_GITHUB_APP_UPSTREAM');
  await saveCreds(c);
  logger.info('[work] GitHub App đã tạo', { appId: c.appId, slug: c.slug, by: s.u });
  return { slug: c.slug };
}

// ─── 3. Token ─────────────────────────────────────────────────────

const tokenCache = new Map<string, { token: string; exp: number }>();

/** Installation token (đệm tới 5 phút trước hết hạn). `repoId` ⇒ giới hạn token vào đúng repo đó. */
export async function installationToken(installationId: number | bigint, repoId?: number | bigint | null): Promise<string> {
  const c = await appCreds();
  if (!c) throw new AppError('The CT Work GitHub App is not set up on this server', 409, 'WORK_GITHUB_APP_MISSING');
  const k = `${installationId}:${repoId ?? '*'}`;
  const hit = tokenCache.get(k);
  if (hit && hit.exp - Date.now() > 5 * 60_000) return hit.token;
  const r = await gh<{ token: string; expires_at: string }>('POST', `${API}/app/installations/${installationId}/access_tokens`, `Bearer ${appJwt(c.appId, c.pem)}`, repoId ? { repository_ids: [Number(repoId)] } : {});
  tokenCache.set(k, { token: r.token, exp: Date.parse(r.expires_at) || Date.now() + 50 * 60_000 });
  return r.token;
}

/** Token đọc của dự án qua app (null nếu dự án không dùng app / app chưa cài / bị treo). Lỗi ⇒ null (lùi PAT/ẩn danh). */
export async function appTokenForProject(projectId: number): Promise<string | null> {
  const conn = await prisma.workGithubConnection.findUnique({ where: { projectId }, select: { appInstallationId: true, appRepoId: true, appSuspendedAt: true } });
  if (!conn?.appInstallationId || conn.appSuspendedAt) return null;
  try {
    return await installationToken(conn.appInstallationId, conn.appRepoId);
  } catch (err) {
    logger.info('[work] GitHub App: không lấy được token cài đặt — lùi PAT/ẩn danh', { projectId, err: (err as Error).message });
    return null;
  }
}

// ─── 2. Cài theo dự án ────────────────────────────────────────────

export async function projectAppInfo(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const c = await appCreds();
  const conn = await prisma.workGithubConnection.findUnique({ where: { projectId }, select: { appInstallationId: true, appRepoId: true, appSuspendedAt: true, repoFullName: true, readToken: true } });
  const canManage = access.role === 'ADMIN';
  return {
    appConfigured: !!c, appSlug: c?.slug ?? null, canManage,
    installUrl: c && canManage ? `https://github.com/apps/${c.slug}/installations/new?state=${encodeURIComponent(signAppState(stateSecret(), { k: 'install', p: projectId, u: userId }, 30 * 60))}` : null,
    linked: conn?.appInstallationId ? { installationId: Number(conn.appInstallationId), repoId: conn.appRepoId ? Number(conn.appRepoId) : null, repoFullName: conn.repoFullName, suspended: !!conn.appSuspendedAt } : null,
    mode: conn?.appInstallationId && !conn.appSuspendedAt ? 'app' : conn?.readToken ? 'pat' : conn ? 'anonymous' : 'none',
  };
}

/**
 * GitHub chuyển về sau khi cài app (request_oauth_on_install ⇒ có `code`). Xác minh người cài thật sự thấy bản cài
 * `installation_id` (GET /user/installations bằng user token — rồi bỏ token), trả URL trang chọn repo kèm vé ký 30 phút.
 */
export async function setupCallback(q: { code?: string; installation_id?: string; setup_action?: string; state?: string }): Promise<string> {
  const s = readAppState<{ k: string; p: number; u: number }>(stateSecret(), q.state);
  const back = (pid: number | null, qs: string) => frontendUrl(pid ? `/work/github-app/done?p=${pid}&${qs}` : `/work/github-app/done?${qs}`);
  if (!s || s.k !== 'install') return back(null, 'error=state');
  const iid = Number(q.installation_id);
  if (!Number.isInteger(iid) || iid <= 0) return back(s.p, 'error=installation');
  const c = await appCreds();
  if (!c) return back(s.p, 'error=app');
  // Người bắt đầu cài vẫn phải là ADMIN dự án.
  try { await requireProject(s.u, s.p, 'project.settings'); } catch { return back(s.p, 'error=permission'); }
  if (!q.code || !c.clientId || !c.clientSecret) return back(s.p, 'error=oauth');
  let userToken: string | null = null;
  try {
    const t = await gh<{ access_token?: string; error?: string }>('POST', 'https://github.com/login/oauth/access_token', null, { client_id: c.clientId, client_secret: c.clientSecret, code: q.code }, 'application/json');
    userToken = t.access_token ?? null;
    if (!userToken) return back(s.p, 'error=oauth');
    const mine = await gh<{ installations?: Array<{ id: number }> }>('GET', `${API}/user/installations?per_page=100`, `Bearer ${userToken}`);
    if (!(mine.installations ?? []).some((x) => Number(x.id) === iid)) return back(s.p, 'error=not_yours');
  } catch (err) {
    logger.warn('[work] GitHub App: xác minh bản cài lỗi', { projectId: s.p, err: (err as Error).message });
    return back(s.p, 'error=verify');
  } finally {
    userToken = null; // không lưu, không log
  }
  const ticket = signAppState(stateSecret(), { k: 'pick', p: s.p, u: s.u, i: iid }, 30 * 60);
  return back(s.p, `ticket=${encodeURIComponent(ticket)}`);
}

function readTicket(userId: number, projectId: number, ticket: string): number {
  const t = readAppState<{ k: string; p: number; u: number; i: number }>(stateSecret(), ticket);
  if (!t || t.k !== 'pick' || t.p !== projectId || t.u !== userId || !Number.isInteger(t.i)) throw new BadRequestError('The install link expired — install the app again', 'WORK_GITHUB_APP_STATE');
  return t.i;
}

/** Repo của bản cài (cho UI chọn) — chỉ người đã cài, bằng vé. */
export async function installationRepos(userId: number, projectId: number, ticket: string) {
  await requireProject(userId, projectId, 'project.settings');
  const iid = readTicket(userId, projectId, ticket);
  const token = await installationToken(iid);
  const r = await gh<{ repositories?: Array<{ id: number; full_name: string; private: boolean; default_branch?: string }> }>('GET', `${API}/installation/repositories?per_page=100`, `Bearer ${token}`);
  return { installationId: iid, repos: (r.repositories ?? []).map((x) => ({ id: x.id, fullName: x.full_name, private: x.private, defaultBranch: x.default_branch ?? null })) };
}

export async function linkRepo(userId: number, projectId: number, ticket: string, repoId: number) {
  await requireProject(userId, projectId, 'project.settings');
  const iid = readTicket(userId, projectId, ticket);
  const { repos } = await installationRepos(userId, projectId, ticket);
  const repo = repos.find((r) => r.id === repoId);
  if (!repo) throw new NotFoundError('That repository is not part of this installation');
  const crypto = await import('node:crypto');
  await prisma.workGithubConnection.upsert({
    where: { projectId },
    create: { projectId, secret: crypto.randomBytes(24).toString('hex'), repoFullName: repo.fullName, appInstallationId: BigInt(iid), appRepoId: BigInt(repo.id), appLinkedById: userId },
    update: { repoFullName: repo.fullName, appInstallationId: BigInt(iid), appRepoId: BigInt(repo.id), appSuspendedAt: null, appLinkedById: userId },
  });
  const { clearSourceCache } = await import('./gitSource.js');
  clearSourceCache();
  await auditProject(projectId, { actorId: userId, action: 'github.app_link', targetType: 'project', targetId: projectId, summary: `Linked ${repo.fullName} through the CT Work GitHub App` });
  return { linked: true, repoFullName: repo.fullName };
}

export async function unlinkApp(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.settings');
  await prisma.workGithubConnection.updateMany({ where: { projectId }, data: { appInstallationId: null, appRepoId: null, appSuspendedAt: null } });
  tokenCache.clear();
  await auditProject(projectId, { actorId: userId, action: 'github.app_unlink', targetType: 'project', targetId: projectId, summary: 'Unlinked the CT Work GitHub App (PAT/webhook still work if set)' });
  return { linked: false };
}

// ─── 4. Webhook chung của app ─────────────────────────────────────

/** Dự án nào nhận sự kiện của repo này (một repo có thể nối nhiều dự án). */
export async function projectsForRepo(installationId: number, repoId: number): Promise<number[]> {
  const rows = await prisma.workGithubConnection.findMany({ where: { appRepoId: BigInt(repoId), appInstallationId: BigInt(installationId), appSuspendedAt: null, project: { deletedAt: null } }, select: { projectId: true } });
  return rows.map((r) => r.projectId);
}

export async function handleAppWebhook(event: string | undefined, signature: string | undefined, raw: Buffer): Promise<{ ok: true; projects: number }> {
  const c = await appCreds();
  if (!c || !webhookSignatureOk(c.webhookSecret, raw, signature)) throw new UnauthorizedError('Invalid signature');
  let body: any;
  try { body = JSON.parse(raw.toString('utf8')); } catch { throw new BadRequestError('Invalid JSON payload', 'WORK_BAD_PAYLOAD'); }
  const iid = Number(body?.installation?.id);
  if (!event || event === 'ping' || !Number.isInteger(iid)) return { ok: true, projects: 0 };
  if (event === 'installation') {
    const action = String(body.action ?? '');
    if (action === 'deleted' || action === 'suspend') {
      await prisma.workGithubConnection.updateMany({ where: { appInstallationId: BigInt(iid) }, data: action === 'deleted' ? { appInstallationId: null, appRepoId: null, appSuspendedAt: null } : { appSuspendedAt: new Date() } });
      tokenCache.clear();
    } else if (action === 'unsuspend') {
      await prisma.workGithubConnection.updateMany({ where: { appInstallationId: BigInt(iid) }, data: { appSuspendedAt: null } });
    }
    return { ok: true, projects: 0 };
  }
  if (event === 'installation_repositories') {
    const removed = (Array.isArray(body.repositories_removed) ? body.repositories_removed : []).map((r: any) => Number(r.id)).filter(Number.isInteger);
    if (removed.length) await prisma.workGithubConnection.updateMany({ where: { appInstallationId: BigInt(iid), appRepoId: { in: removed.map((x: number) => BigInt(x)) } }, data: { appInstallationId: null, appRepoId: null } });
    tokenCache.clear();
    return { ok: true, projects: 0 };
  }
  const repoId = Number(body?.repository?.id);
  if (!Number.isInteger(repoId)) return { ok: true, projects: 0 };
  const pids = await projectsForRepo(iid, repoId);
  const { processGithubEvent } = await import('./github.service.js');
  for (const pid of pids) {
    try { await processGithubEvent(pid, event, body); } catch (err) { logger.warn('[work] GitHub App: xử lý sự kiện lỗi', { projectId: pid, event, err: (err as Error).message }); }
  }
  return { ok: true, projects: pids.length };
}

/** CI + review của PR (dùng chung cho webhook app và webhook dán tay). Không ném. */
export async function recordPullExtras(projectId: number, event: string, body: any): Promise<void> {
  try {
    if (event === 'check_suite' || event === 'check_run') {
      const x = event === 'check_suite' ? body.check_suite : body.check_run;
      const prs = (Array.isArray(x?.pull_requests) ? x.pull_requests : []).map((p: any) => Number(p.number)).filter(Number.isInteger);
      if (!prs.length) return;
      const state = ciStateOf(x?.status, x?.conclusion);
      const url = String(x?.html_url ?? x?.details_url ?? '').slice(0, 500) || null;
      await prisma.workGitPull.updateMany({ where: { projectId, provider: 'GITHUB', number: { in: prs } }, data: { ciState: state, ciUrl: url, ciAt: new Date(), ...(x?.head_sha ? { headSha: String(x.head_sha).slice(0, 64) } : {}) } });
    } else if (event === 'pull_request' && body?.pull_request?.number) {
      const sha = body.pull_request.head?.sha;
      if (sha) await prisma.workGitPull.updateMany({ where: { projectId, provider: 'GITHUB', number: Number(body.pull_request.number) }, data: { headSha: String(sha).slice(0, 64) } });
    } else if ((event === 'pull_request_review' || event === 'pull_request_review_comment') && body?.pull_request?.number) {
      const login = String(body.review?.user?.login ?? body.comment?.user?.login ?? '').slice(0, 100);
      if (!login) return;
      const row = await prisma.workGitPull.findFirst({ where: { projectId, provider: 'GITHUB', number: Number(body.pull_request.number) }, select: { id: true, reviewers: true } });
      if (row && !row.reviewers.includes(login)) await prisma.workGitPull.update({ where: { id: row.id }, data: { reviewers: [...row.reviewers, login].slice(0, 30) } });
    }
  } catch (err) {
    logger.info('[work] GitHub: ghi CI/review của PR lỗi', { projectId, event, err: (err as Error).message });
  }
}

// ─── 5. Đăng review lên PR ────────────────────────────────────────

/**
 * Đăng một review COMMENT lên PR (dự án dùng app). KHÔNG BAO GIỜ APPROVE / REQUEST_CHANGES, không merge. Bình luận inline chỉ
 * trên dòng có trong diff; phần còn lại vào thân review. Trả link review hoặc null (dự án không dùng app / lỗi).
 */
export async function postPullReview(projectId: number, input: {
  prNumber: number; headSha: string | null; body: string; findings: CodeFinding[]; files: Array<{ filename: string; patch: string | null }>;
}): Promise<string | null> {
  const conn = await prisma.workGithubConnection.findUnique({ where: { projectId }, select: { appInstallationId: true, appRepoId: true, appSuspendedAt: true, repoFullName: true } });
  if (!conn?.appInstallationId || conn.appSuspendedAt || !conn.repoFullName || !/^[\w.-]+\/[\w.-]+$/.test(conn.repoFullName)) return null;
  const token = await installationToken(conn.appInstallationId, conn.appRepoId);
  const { inline, rest } = inlineComments(input.findings, input.files);
  const extra = rest.filter((f) => f.severity !== 'NIT').slice(0, 10).map((f) => `- **${f.severity}** \`${f.file}${f.line ? `:${f.line}` : ''}\` — ${f.message}`).join('\n');
  const r = await gh<{ html_url?: string }>('POST', `${API}/repos/${conn.repoFullName}/pulls/${input.prNumber}/reviews`, `Bearer ${token}`, {
    ...(input.headSha ? { commit_id: input.headSha } : {}), event: 'COMMENT', body: `${input.body}${extra ? `\n\n${extra}` : ''}`.slice(0, 60_000), comments: inline,
  });
  return r.html_url ?? null;
}
