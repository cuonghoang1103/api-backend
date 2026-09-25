/**
 * CT Work — tích hợp GitLab qua webhook (25/09/2026). Cùng ý với github.service:
 * commit / nhánh / merge request nhắc `KEY-123` ⇒ gắn vào panel Development của
 * thẻ đó. Tuỳ chọn: MR mở ⇒ chuyển trạng thái X, MR merge ⇒ chuyển Y.
 *
 * SWP391 cho phép GitLab (nhiều lớp dùng gitlab.com hoặc GitLab của trường).
 * Chạy được với cả GitLab tự host: GitLab gọi tới CT Work, CT Work không gọi đi.
 *
 * Bảo mật: GitLab gửi token NGUYÊN VĂN trong header `X-Gitlab-Token` (không ký
 * HMAC như GitHub) ⇒ so bằng timingSafeEqual. Không có kết nối và sai token trả
 * CÙNG một lỗi 401 — người lạ không dò được dự án nào tồn tại. Token chỉ ADMIN thấy.
 */

import crypto from 'node:crypto';
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { frontendUrl } from './common.js';
import { emitWorkEvent } from './events.js';
import { issueNumbersIn } from './github.service.js';
import { applyIssueChange } from './issueChange.js';
import { requireProject } from './permissions.js';

interface GitlabConfig { mrOpenedStatusId?: number | null; mrMergedStatusId?: number | null }

const webhookUrl = (projectId: number) => frontendUrl(`/api/v1/work/gitlab/webhook/${projectId}`);

export async function getConnection(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const c = await prisma.workGitlabConnection.findUnique({ where: { projectId } });
  if (!c) return { connected: false as const, webhookUrl: webhookUrl(projectId) };
  return {
    connected: true as const,
    webhookUrl: webhookUrl(projectId),
    token: access.role === 'ADMIN' ? c.token : null,
    repoPath: c.repoPath,
    config: c.config as GitlabConfig,
    lastEventAt: c.lastEventAt,
  };
}

export async function connect(userId: number, projectId: number, rotate = false) {
  await requireProject(userId, projectId, 'project.settings');
  const existing = await prisma.workGitlabConnection.findUnique({ where: { projectId } });
  if (existing && !rotate) return getConnection(userId, projectId);
  const token = crypto.randomBytes(24).toString('hex');
  await prisma.workGitlabConnection.upsert({ where: { projectId }, create: { projectId, token }, update: { token } });
  await auditProject(projectId, { actorId: userId, action: existing ? 'gitlab.rotate_token' : 'gitlab.connect', targetType: 'project', targetId: projectId, summary: existing ? 'Rotated the GitLab webhook token' : 'Connected GitLab' });
  return getConnection(userId, projectId);
}

export async function updateConnection(userId: number, projectId: number, input: { repoPath?: string | null; mrOpenedStatusId?: number | null; mrMergedStatusId?: number | null }) {
  await requireProject(userId, projectId, 'project.settings');
  const c = await prisma.workGitlabConnection.findUnique({ where: { projectId } });
  if (!c) throw new NotFoundError('GitLab is not connected');
  for (const sid of [input.mrOpenedStatusId, input.mrMergedStatusId]) {
    if (sid && !(await prisma.workStatus.findFirst({ where: { id: sid, workflow: { projectId } } }))) throw new BadRequestError('Status not found in this project', 'WORK_BAD_STATUS');
  }
  if (input.repoPath && !/^[\w.-]+(\/[\w.-]+)+$/.test(input.repoPath)) throw new BadRequestError('Use the "group/project" path', 'WORK_BAD_REPO');
  const cfg = { ...(c.config as GitlabConfig) };
  if (input.mrOpenedStatusId !== undefined) cfg.mrOpenedStatusId = input.mrOpenedStatusId;
  if (input.mrMergedStatusId !== undefined) cfg.mrMergedStatusId = input.mrMergedStatusId;
  await prisma.workGitlabConnection.update({
    where: { projectId },
    data: { config: cfg as object, ...(input.repoPath !== undefined ? { repoPath: input.repoPath || null } : {}) },
  });
  return getConnection(userId, projectId);
}

export async function disconnect(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.settings');
  await prisma.workGitlabConnection.deleteMany({ where: { projectId } });
  await auditProject(projectId, { actorId: userId, action: 'gitlab.disconnect', targetType: 'project', targetId: projectId, summary: 'Disconnected GitLab' });
}

// ─── Nhận webhook ────────────────────────────────────────────────

export function verifyToken(expected: string, got: string | undefined): boolean {
  if (!got) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(got);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

interface Activity { kind: 'COMMIT' | 'BRANCH' | 'PR'; externalId: string; title: string; url: string; state?: string | null; author?: string | null; text: string }
const ZERO_SHA = /^0{40}$/;

/** Rút hoạt động từ một sự kiện GitLab (object_kind: push | merge_request). Khác ⇒ rỗng. */
export function extractGitlabActivities(body: any): Activity[] {
  const repo = String(body?.project?.path_with_namespace ?? '');
  const web = String(body?.project?.web_url ?? '').replace(/\/$/, '');
  if (body?.object_kind === 'push') {
    const branch = String(body.ref ?? '').replace(/^refs\/heads\//, '');
    const out: Activity[] = [];
    // Nhánh MỚI: GitLab gửi push có `before` toàn số 0.
    if (ZERO_SHA.test(String(body.before ?? '')) && branch) {
      out.push({ kind: 'BRANCH', externalId: `${repo}:${branch}`.slice(0, 200), title: branch.slice(0, 500), url: `${web}/-/tree/${encodeURIComponent(branch)}`.slice(0, 500), author: String(body.user_username ?? '') || null, state: null, text: branch });
    }
    for (const c of Array.isArray(body.commits) ? body.commits.slice(0, 50) : []) {
      out.push({
        kind: 'COMMIT', externalId: String(c.id).slice(0, 200), title: String(c.title ?? c.message ?? '').split('\n')[0].slice(0, 500),
        url: String(c.url ?? '').slice(0, 500), author: String(c.author?.name ?? '').slice(0, 100) || null, state: null, text: `${c.message ?? ''} ${branch}`,
      });
    }
    return out;
  }
  if (body?.object_kind === 'merge_request' && body.object_attributes) {
    const mr = body.object_attributes;
    const state = mr.state === 'merged' ? 'merged' : mr.state === 'closed' ? 'closed' : (mr.draft || mr.work_in_progress) ? 'draft' : 'open';
    return [{
      kind: 'PR', externalId: `${repo}!${mr.iid}`.slice(0, 200), title: `!${mr.iid} ${mr.title ?? ''}`.slice(0, 500), url: String(mr.url ?? '').slice(0, 500),
      author: String(body.user?.username ?? '') || null, state, text: `${mr.title ?? ''} ${mr.description ?? ''} ${mr.source_branch ?? ''}`,
    }];
  }
  return [];
}

export async function handleWebhook(projectId: number, token: string | undefined, body: any): Promise<{ ok: true; linked: number }> {
  const conn = await prisma.workGitlabConnection.findUnique({ where: { projectId }, include: { project: { select: { key: true, deletedAt: true } } } });
  if (!conn || conn.project.deletedAt || !verifyToken(conn.token, token)) throw new UnauthorizedError('Invalid token');
  if (!body || typeof body !== 'object') throw new BadRequestError('Invalid JSON payload', 'WORK_BAD_PAYLOAD');
  const repo = body?.project?.path_with_namespace ? String(body.project.path_with_namespace).slice(0, 200) : null;
  await prisma.workGitlabConnection.update({ where: { projectId }, data: { lastEventAt: new Date(), ...(repo && !conn.repoPath ? { repoPath: repo } : {}) } });

  const cfg = conn.config as GitlabConfig;
  let linked = 0;
  for (const a of extractGitlabActivities(body)) {
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
      const action = body.object_attributes?.action;
      const target = a.kind === 'PR' ? (a.state === 'merged' ? cfg.mrMergedStatusId : a.state === 'open' && (action === 'open' || action === 'reopen') ? cfg.mrOpenedStatusId : null) : null;
      if (target) {
        try {
          await applyIssueChange(issue.id, { statusId: target }, { kind: 'SYSTEM', userId: null });
        } catch (err) {
          logger.info('[work] gitlab: không chuyển được trạng thái', { issueId: issue.id, err: (err as Error).message });
        }
      } else {
        emitWorkEvent({ type: 'issue.updated', projectId, issueId: issue.id, actor: { kind: 'SYSTEM', userId: null }, changes: [] });
      }
    }
  }
  return { ok: true, linked };
}
