/**
 * CT Work MCP — ngữ cảnh một lời gọi tool + các CHỐT dùng chung.
 *
 * Tool gọi THẲNG service (không HTTP tự gọi mình) ⇒ chốt tầng tuyến của REST (middleware `/projects/:pid` trong
 * work.routes.ts) KHÔNG tự chạy. Vì vậy mỗi tool khai "tuyến REST tương đương" và `projectFor()` chạy lại ĐÚNG các
 * chốt đó, cùng hàm, cùng mã lỗi:
 *   - token agent: phạm vi dự án của token ⇒ 404, `agentRouteAllowed` ⇒ 403 WORK_AGENT_FORBIDDEN;
 *   - token người: khách cổng bị cách ly ⇒ `clientPortalRouteAllowed` ⇒ 403 CLIENT_PORTAL_ONLY.
 * Tầng hành động (requireProject / assertHumanActor trong service) vẫn chặn lần hai như mọi đường gọi khác.
 * Tool GHI: `requireWrite()` — scope 'write' + agent PAUSED ⇒ 423 (thay cho chốt theo method của REST, vì MCP
 * luôn là POST).
 */

import { prisma } from '../config/database.js';
import { AppError, BadRequestError, ForbiddenError } from '../middleware/errorHandler.js';
import type { ReqAgent, TokenScope } from '../services/work/apiTokens.service.js';
import {
  agentForbidden, agentRouteAllowed, clientPortalRouteAllowed, isClientScoped, loadProjectAccess, type ProjectAccess,
} from '../services/work/permissions.js';

export interface McpCtx {
  userId: number;
  agent: ReqAgent | null;
  scopes: TokenScope[];
  tokenId: number;
  /** Huỷ khi client đóng kết nối (wait_events dùng). */
  signal: AbortSignal;
}

export interface ProjectHit {
  id: number;
  key: string;
  workspaceId: number;
  workspaceSlug: string;
  access: ProjectAccess;
}

const notFound = (ref: string) => new AppError(`Project "${ref}" not found. Call list_projects to see the project keys you can use.`, 404, 'WORK_PROJECT_NOT_FOUND');

/**
 * Mã dự án ("FP", hoặc "slug-khong-gian/FP" khi người dùng ở nhiều không gian trùng mã) ⇒ dự án + chốt tầng tuyến.
 * KHÔNG nhận id số (CTW-15: người và agent nói bằng mã).
 */
export async function projectFor(ctx: McpCtx, ref: string, routes: Array<[method: string, sub: string]>): Promise<ProjectHit> {
  const raw = String(ref ?? '').trim();
  const [slug, keyPart] = raw.includes('/') ? raw.split('/', 2) : [undefined, raw];
  const key = (keyPart ?? '').trim().toUpperCase();
  if (!/^[A-Z][A-Z0-9_]{0,19}$/.test(key)) throw new BadRequestError(`"${raw}" is not a project key (e.g. "FP")`, 'VALIDATION_ERROR');
  const rows = await prisma.workProject.findMany({
    where: {
      key, deletedAt: null,
      ...(ctx.agent ? { workspaceId: ctx.agent.workspaceId } : {}),
      workspace: { deletedAt: null, ...(slug ? { slug: slug.trim() } : {}), ...(ctx.agent ? {} : { members: { some: { userId: ctx.userId } } }) },
    },
    take: 3,
    select: { id: true, key: true, workspaceId: true, workspace: { select: { slug: true } } },
  });
  if (!rows.length) throw notFound(raw);
  if (rows.length > 1) {
    throw new AppError(
      `Several of your workspaces have a project ${key}. Use "<workspace>/${key}", one of: ${rows.map((r) => `${r.workspace.slug}/${r.key}`).join(', ')}`,
      400, 'WORK_PROJECT_AMBIGUOUS',
    );
  }
  const p = rows[0];
  if (ctx.agent?.projectIds && !ctx.agent.projectIds.includes(p.id)) throw notFound(raw);
  if (ctx.agent) {
    for (const [method, sub] of routes) {
      if (!agentRouteAllowed(method, sub)) {
        throw await agentForbidden(ctx.agent.userId, 'use this part of a project (client, finance, settings, deletion or approvals)');
      }
    }
  }
  const access = await loadProjectAccess(ctx.userId, p.id);
  if (!access) throw notFound(raw);
  if (!ctx.agent && isClientScoped(access) && routes.some(([m, sub]) => !clientPortalRouteAllowed(m, sub))) {
    throw new AppError('This part of the project is not available in the client portal', 403, 'CLIENT_PORTAL_ONLY');
  }
  return { id: p.id, key: p.key, workspaceId: p.workspaceId, workspaceSlug: p.workspace.slug, access };
}

/** Số thẻ từ `12` / `"12"` / `"FP-12"` (mã phải khớp dự án — không lặng lẽ đổi sang thẻ dự án khác). */
export function issueNumber(projectKey: string, ref: unknown): number {
  if (typeof ref === 'number' && Number.isInteger(ref) && ref > 0) return ref;
  const s = String(ref ?? '').trim().toUpperCase();
  const m = /^(?:([A-Z][A-Z0-9_]*)-)?(\d{1,9})$/.exec(s);
  if (!m || Number(m[2]) <= 0) throw new BadRequestError(`"${String(ref)}" is not an issue (use 12 or "${projectKey}-12")`, 'VALIDATION_ERROR');
  if (m[1] && m[1] !== projectKey) throw new BadRequestError(`${s} is not in project ${projectKey} — pass project "${m[1]}" instead`, 'WORK_ISSUE_OTHER_PROJECT');
  return Number(m[2]);
}

/** Tool ghi: token phải có scope 'write'; agent PAUSED ⇒ 423 (đúng mã của REST). */
export function requireWrite(ctx: McpCtx): void {
  if (ctx.agent?.status === 'PAUSED') {
    throw new AppError('This AI agent is paused. Its owner must resume it before it can make changes.', 423, 'WORK_AGENT_PAUSED');
  }
  if (!ctx.scopes.includes('write')) throw new ForbiddenError('This API token is read-only');
}

/** Tool chỉ dành cho token agent. */
export function requireAgent(ctx: McpCtx): ReqAgent {
  if (!ctx.agent) throw new AppError('This tool is for AI agent tokens (people just assign issues to themselves)', 403, 'WORK_NOT_AGENT');
  return ctx.agent;
}

/** Id thẻ (đã kiểm quyền ở service trước đó) — cho heartbeat ngầm / tra lease. */
export async function issueIdOf(projectId: number, number: number): Promise<number | null> {
  return (await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true } }))?.id ?? null;
}

/**
 * §4.2 "mọi tool ghi heartbeat ngầm nếu agent đang giữ lease thẻ đó": gia hạn lease ACTIVE tới ít nhất now + 30 phút
 * (không rút ngắn hạn agent đã xin). Không phát socket — heartbeat chủ động mới đổi tiến độ trên board.
 */
export async function touchLease(ctx: McpCtx, issueId: number | null): Promise<void> {
  if (!ctx.agent || !issueId) return;
  const now = new Date();
  const l = await prisma.workAgentLease.findFirst({ where: { agentId: ctx.agent.id, activeIssueId: issueId, status: 'ACTIVE' }, select: { id: true, expiresAt: true } });
  if (!l || l.expiresAt < now) return;
  const min = new Date(now.getTime() + 30 * 60_000);
  await prisma.workAgentLease.update({ where: { id: l.id }, data: { heartbeatAt: now, ...(l.expiresAt < min ? { expiresAt: min } : {}) } }).catch(() => undefined);
}
