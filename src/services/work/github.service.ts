/**
 * CT Work — tích hợp GitHub qua webhook (đợt 7.1).
 *
 * Người dùng dán URL webhook + secret vào repo (Settings → Webhooks, gửi
 * push / create / pull_request). Mỗi commit, nhánh, PR có nhắc mã thẻ
 * `KEY-123` (trong message, tên nhánh, tiêu đề/nội dung PR) được gắn vào thẻ
 * đó và hiện ở panel "Development". Tuỳ chọn: PR mở ⇒ chuyển trạng thái X,
 * PR merge ⇒ chuyển trạng thái Y (đi qua cửa ghi chung, tôn trọng quy trình).
 *
 * Bảo mật: chữ ký HMAC-SHA256 trên THÂN GỐC (raw body) kiểm bằng so sánh
 * thời gian hằng. Sai chữ ký ⇒ 401, không tiết lộ dự án có tồn tại hay không.
 * Vì phải tính HMAC nên secret giữ nguyên văn trong DB (không băm được).
 */

import crypto from 'node:crypto';
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { frontendUrl } from './common.js';
import { emitWorkEvent } from './events.js';
import { applyIssueChange } from './issueChange.js';
import { requireProject } from './permissions.js';

interface GithubConfig { prOpenedStatusId?: number | null; prMergedStatusId?: number | null }

function webhookUrl(projectId: number): string {
  // Cùng tên miền với web (nginx chuyển /api sang backend).
  return frontendUrl(`/api/v1/work/github/webhook/${projectId}`);
}

export async function getConnection(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const c = await prisma.workGithubConnection.findUnique({ where: { projectId } });
  if (!c) return { connected: false as const, webhookUrl: webhookUrl(projectId) };
  const isAdmin = access.role === 'ADMIN';
  return {
    connected: true as const,
    webhookUrl: webhookUrl(projectId),
    // Secret chỉ ADMIN dự án thấy — ai có nó là giả được sự kiện GitHub.
    secret: isAdmin ? c.secret : null,
    repoFullName: c.repoFullName,
    config: c.config as GithubConfig,
    lastEventAt: c.lastEventAt,
  };
}

/** Bật kết nối (hoặc xoay secret mới). */
export async function connect(userId: number, projectId: number, rotate = false) {
  await requireProject(userId, projectId, 'project.settings');
  const secret = crypto.randomBytes(24).toString('hex');
  const existing = await prisma.workGithubConnection.findUnique({ where: { projectId } });
  if (existing && !rotate) return getConnection(userId, projectId);
  await prisma.workGithubConnection.upsert({ where: { projectId }, create: { projectId, secret }, update: { secret } });
  await auditProject(projectId, { actorId: userId, action: existing ? 'github.rotate_secret' : 'github.connect', targetType: 'project', targetId: projectId, summary: existing ? 'Rotated the GitHub webhook secret' : 'Connected GitHub' });
  return getConnection(userId, projectId);
}

export async function updateConnection(userId: number, projectId: number, input: { repoFullName?: string | null; prOpenedStatusId?: number | null; prMergedStatusId?: number | null }) {
  await requireProject(userId, projectId, 'project.settings');
  const c = await prisma.workGithubConnection.findUnique({ where: { projectId } });
  if (!c) throw new NotFoundError('GitHub is not connected');
  for (const sid of [input.prOpenedStatusId, input.prMergedStatusId]) {
    if (sid && !(await prisma.workStatus.findFirst({ where: { id: sid, workflow: { projectId } } }))) throw new BadRequestError('Status not found in this project', 'WORK_BAD_STATUS');
  }
  if (input.repoFullName && !/^[\w.-]+\/[\w.-]+$/.test(input.repoFullName)) throw new BadRequestError('Use the "owner/repo" format', 'WORK_BAD_REPO');
  const cfg = { ...(c.config as GithubConfig) };
  if (input.prOpenedStatusId !== undefined) cfg.prOpenedStatusId = input.prOpenedStatusId;
  if (input.prMergedStatusId !== undefined) cfg.prMergedStatusId = input.prMergedStatusId;
  await prisma.workGithubConnection.update({
    where: { projectId },
    data: { config: cfg as object, ...(input.repoFullName !== undefined ? { repoFullName: input.repoFullName || null } : {}) },
  });
  return getConnection(userId, projectId);
}

export async function disconnect(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.settings');
  await prisma.workGithubConnection.deleteMany({ where: { projectId } });
  await auditProject(projectId, { actorId: userId, action: 'github.disconnect', targetType: 'project', targetId: projectId, summary: 'Disconnected GitHub' });
}

/** Commit / nhánh / PR của một thẻ cho panel Development. */
export async function devActivity(userId: number, projectId: number, number: number) {
  await requireProject(userId, projectId, 'project.view');
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true } });
  if (!issue) throw new NotFoundError('Issue not found');
  const rows = await prisma.workDevActivity.findMany({ where: { issueId: issue.id }, orderBy: { updatedAt: 'desc' }, take: 100 });
  return {
    branches: rows.filter((r) => r.kind === 'BRANCH'),
    commits: rows.filter((r) => r.kind === 'COMMIT'),
    pullRequests: rows.filter((r) => r.kind === 'PR'),
  };
}

// ─── Nhận webhook ────────────────────────────────────────────────

/** Mã thẻ của dự án xuất hiện trong chuỗi (không phân biệt hoa thường: nhánh hay viết thường). */
export function issueNumbersIn(text: string, key: string): number[] {
  const re = new RegExp(`(?<![A-Za-z0-9])${key}-(\\d{1,7})(?![0-9])`, 'gi');
  const out = new Set<number>();
  for (const m of text.matchAll(re)) out.add(Number(m[1]));
  return [...out];
}

export function verifySignature(secret: string, raw: Buffer, header: string | undefined): boolean {
  if (!header?.startsWith('sha256=')) return false;
  const expected = Buffer.from(crypto.createHmac('sha256', secret).update(raw).digest('hex'));
  const got = Buffer.from(header.slice(7));
  return got.length === expected.length && crypto.timingSafeEqual(got, expected);
}

interface Activity { kind: 'COMMIT' | 'BRANCH' | 'PR'; externalId: string; title: string; url: string; state?: string | null; author?: string | null; text: string }

/** Rút các hoạt động từ một sự kiện GitHub. Sự kiện khác ⇒ mảng rỗng. */
export function extractActivities(event: string, body: any): Activity[] {
  const repo = body?.repository?.full_name ?? '';
  if (event === 'push' && Array.isArray(body.commits)) {
    const branch = String(body.ref ?? '').replace(/^refs\/heads\//, '');
    return body.commits.slice(0, 50).map((c: any) => ({
      kind: 'COMMIT' as const, externalId: String(c.id).slice(0, 200), title: String(c.message ?? '').split('\n')[0].slice(0, 500),
      url: String(c.url ?? '').slice(0, 500), author: String(c.author?.username ?? c.author?.name ?? '').slice(0, 100) || null,
      state: null, text: `${c.message ?? ''} ${branch}`,
    }));
  }
  if (event === 'create' && body.ref_type === 'branch') {
    const name = String(body.ref ?? '');
    return [{ kind: 'BRANCH', externalId: `${repo}:${name}`.slice(0, 200), title: name.slice(0, 500), url: `https://github.com/${repo}/tree/${encodeURIComponent(name)}`.slice(0, 500), author: String(body.sender?.login ?? '') || null, state: null, text: name }];
  }
  if (event === 'pull_request' && body.pull_request) {
    const pr = body.pull_request;
    const state = pr.merged ? 'merged' : pr.state === 'closed' ? 'closed' : pr.draft ? 'draft' : 'open';
    return [{
      kind: 'PR', externalId: `${repo}#${pr.number}`.slice(0, 200), title: `#${pr.number} ${pr.title ?? ''}`.slice(0, 500), url: String(pr.html_url ?? '').slice(0, 500),
      author: String(pr.user?.login ?? '') || null, state, text: `${pr.title ?? ''} ${pr.body ?? ''} ${pr.head?.ref ?? ''}`,
    }];
  }
  return [];
}

export async function handleWebhook(projectId: number, event: string | undefined, signature: string | undefined, raw: Buffer): Promise<{ ok: true; linked: number }> {
  const conn = await prisma.workGithubConnection.findUnique({ where: { projectId }, include: { project: { select: { key: true, deletedAt: true } } } });
  // Không có kết nối và sai chữ ký trả CÙNG một lỗi — người lạ không dò được dự án.
  if (!conn || conn.project.deletedAt || !verifySignature(conn.secret, raw, signature)) throw new UnauthorizedError('Invalid signature');
  let body: any;
  try { body = JSON.parse(raw.toString('utf8')); } catch { throw new BadRequestError('Invalid JSON payload', 'WORK_BAD_PAYLOAD'); }
  await prisma.workGithubConnection.update({ where: { projectId }, data: { lastEventAt: new Date(), ...(body?.repository?.full_name && !conn.repoFullName ? { repoFullName: String(body.repository.full_name).slice(0, 200) } : {}) } });
  if (!event || event === 'ping') return { ok: true, linked: 0 };

  const cfg = conn.config as GithubConfig;
  const repo = body?.repository?.full_name ? String(body.repository.full_name).slice(0, 200) : null;
  let linked = 0;
  for (const a of extractActivities(event, body)) {
    const numbers = issueNumbersIn(a.text, conn.project.key);
    if (!numbers.length) continue;
    const issues = await prisma.workIssue.findMany({ where: { projectId, number: { in: numbers }, deletedAt: null }, select: { id: true } });
    for (const issue of issues) {
      await prisma.workDevActivity.upsert({
        where: { uk_work_dev_activity: { issueId: issue.id, kind: a.kind, externalId: a.externalId } },
        create: { projectId, issueId: issue.id, kind: a.kind, externalId: a.externalId, title: a.title, url: a.url, state: a.state ?? null, author: a.author ?? null, repo },
        update: { title: a.title, url: a.url, state: a.state ?? null },
      });
      linked += 1;
      // PR mở / merge ⇒ chuyển trạng thái nếu đã cấu hình. Sai quy trình thì bỏ qua (ghi log), không làm hỏng webhook.
      const target = a.kind === 'PR' ? (a.state === 'merged' ? cfg.prMergedStatusId : a.state === 'open' && body.action === 'opened' ? cfg.prOpenedStatusId : null) : null;
      if (target) {
        try {
          await applyIssueChange(issue.id, { statusId: target }, { kind: 'SYSTEM', userId: null });
        } catch (err) {
          logger.info('[work] github: không chuyển được trạng thái', { issueId: issue.id, err: (err as Error).message });
        }
      } else {
        emitWorkEvent({ type: 'issue.updated', projectId, issueId: issue.id, actor: { kind: 'SYSTEM', userId: null }, changes: [] });
      }
    }
  }
  return { ok: true, linked };
}
