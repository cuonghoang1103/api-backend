/**
 * CT Work — API token cá nhân (đợt 7.6), giống "API token" của Jira.
 *
 *   Authorization: Bearer ctw_<prefix>_<bí mật>
 *
 * - Chỉ lưu sha256 của token; token nguyên văn hiện ĐÚNG MỘT LẦN lúc tạo.
 * - Phạm vi: "read" (chỉ GET) hoặc "read"+"write". Token hành động với đúng
 *   quyền của chủ token trong từng dự án — không hơn.
 * - Token chỉ mở /api/v1/work/** (router này), không mở phần còn lại của
 *   site, và không tự tạo/thu hồi token được (chặn leo quyền khi lộ token).
 * - Hạn dùng tuỳ chọn; ghi lần dùng cuối (tối đa 1 lần/phút để đỡ ghi DB).
 */

import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../../middleware/errorHandler.js';
import { sha256 } from './common.js';
import { agentTopRouteAllowed } from './permissions.js';

export const TOKEN_SCOPES = ['read', 'write', 'tests:write'] as const;
/**
 * CTW đợt 7c (TST-2): scope HẸP cho CI — chỉ được GHI đúng một tuyến: nhập kết quả test tự động. Mọi lệnh ghi khác ⇒ 403
 * như token chỉ đọc. MCP không coi nó là 'write' (context.ts kiểm `includes('write')` đúng chữ).
 */
export const TESTS_WRITE_ROUTE = /^\/projects\/\d+\/tests\/automation\/import\/?$/;
/** 'agent' chỉ có trên token gắn AI agent (CTW-28) — không có thì middleware từ chối gắn req.agent. */
export type TokenScope = (typeof TOKEN_SCOPES)[number] | 'agent';
const MAX_TOKENS = 20;
/** Trần token ACTIVE của một agent (ít hơn người — agent không cần nhiều). */
export const MAX_AGENT_TOKENS = 5;

/** Ngữ cảnh agent gắn vào request khi xác thực bằng token agent (§3.1). */
export interface ReqAgent {
  id: number;
  userId: number;
  workspaceId: number;
  ownerId: number;
  status: string;
  /** null = mọi dự án agent là thành viên; mảng = chỉ các dự án đó. */
  projectIds: number[] | null;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Có khi request xác thực bằng API token CT Work (không phải phiên web). */
      workToken?: { id: number; scopes: TokenScope[] };
      /** CTW-28: có khi token là token của AI agent. */
      agent?: ReqAgent;
    }
  }
}

/** Mảng id dự án hợp lệ từ cột JSON project_ids ([] hoặc rác ⇒ null = không giới hạn). */
export function tokenProjectIds(v: unknown): number[] | null {
  if (!Array.isArray(v)) return null;
  const ids = v.filter((x): x is number => typeof x === 'number' && Number.isInteger(x) && x > 0);
  return ids.length ? [...new Set(ids)] : null;
}

/**
 * Tạo token cho agent (gọi từ agents.service sau khi đã kiểm quyền người gọi). Scope luôn có 'agent'.
 * Không bao giờ có 'calendar'. Trả token nguyên văn ĐÚNG MỘT LẦN.
 */
export async function issueAgentToken(
  agent: { id: number; userId: number },
  input: { name: string; scopes: Array<'read' | 'write'>; projectIds?: number[]; expiresInDays?: number | null },
  db: Pick<typeof prisma, 'workApiToken'> = prisma,
) {
  const name = input.name.trim().slice(0, 100) || 'Agent token';
  const scopes: TokenScope[] = [...new Set<TokenScope>(['read', ...input.scopes.filter((s) => s === 'read' || s === 'write'), 'agent'])];
  const count = await db.workApiToken.count({ where: { agentId: agent.id, revokedAt: null } });
  if (count >= MAX_AGENT_TOKENS) throw new BadRequestError(`An agent can have at most ${MAX_AGENT_TOKENS} active tokens. Revoke one first.`, 'WORK_LIMIT');
  const prefix = crypto.randomBytes(4).toString('hex');
  const secret = crypto.randomBytes(24).toString('base64url');
  const token = `ctw_${prefix}_${secret}`;
  const row = await db.workApiToken.create({
    data: {
      userId: agent.userId, agentId: agent.id, name, prefix, tokenHash: sha256(token), scopes,
      projectIds: [...new Set(input.projectIds ?? [])],
      expiresAt: input.expiresInDays ? new Date(Date.now() + input.expiresInDays * 86_400_000) : null,
    },
    select: { id: true, name: true, prefix: true, scopes: true, projectIds: true, expiresAt: true, createdAt: true },
  });
  return { ...row, token };
}

export async function listTokens(userId: number) {
  return prisma.workApiToken.findMany({
    // Link lịch (calendar.service, scopes ["calendar"]) nằm cùng bảng nhưng KHÔNG phải token API.
    where: { userId, agentId: null, revokedAt: null, NOT: { scopes: { array_contains: ['calendar'] } } },
    orderBy: { id: 'desc' },
    select: { id: true, name: true, prefix: true, scopes: true, expiresAt: true, lastUsedAt: true, lastUsedIp: true, createdAt: true },
  });
}

export async function createToken(userId: number, input: { name: string; scopes: TokenScope[]; expiresInDays?: number | null }) {
  const name = input.name.trim().slice(0, 100);
  if (!name) throw new BadRequestError('Give the token a name', 'WORK_NAME_REQUIRED');
  const scopes = [...new Set<TokenScope>(['read', ...input.scopes.filter((s) => (TOKEN_SCOPES as readonly string[]).includes(s))])];
  const count = await prisma.workApiToken.count({ where: { userId, agentId: null, revokedAt: null, NOT: { scopes: { array_contains: ['calendar'] } } } });
  if (count >= MAX_TOKENS) throw new BadRequestError(`You can have at most ${MAX_TOKENS} active tokens`, 'WORK_LIMIT');
  const prefix = crypto.randomBytes(4).toString('hex');
  const secret = crypto.randomBytes(24).toString('base64url');
  const token = `ctw_${prefix}_${secret}`;
  const row = await prisma.workApiToken.create({
    data: { userId, name, prefix, tokenHash: sha256(token), scopes, expiresAt: input.expiresInDays ? new Date(Date.now() + input.expiresInDays * 86_400_000) : null },
    select: { id: true, name: true, prefix: true, scopes: true, expiresAt: true, createdAt: true },
  });
  return { ...row, token };
}

export async function revokeToken(userId: number, id: number) {
  const r = await prisma.workApiToken.updateMany({ where: { id, userId, agentId: null, revokedAt: null }, data: { revokedAt: new Date() } });
  if (!r.count) throw new NotFoundError('Token not found');
}

/**
 * Middleware đặt TRƯỚC authenticate của router. Không phải token ctw_ ⇒ đi
 * tiếp để JWT xử lý như cũ. Là token ctw_ ⇒ tự xác thực, gắn req.userId và
 * bỏ qua authenticate (đánh dấu req.workToken).
 */
export const apiTokenAuth = taoApiTokenAuth(agentTopRouteAllowed);

/**
 * Như apiTokenAuth nhưng với danh sách đường AGENT được đi do router tự truyền (mặc định là của CT Work).
 * Dùng cho router ngoài CT Work cần mở RẤT HẸP cho agent (vd. /flying-pencil/tts — user cho phép 07/10/2026).
 * Mọi rào chắn khác (token hợp lệ, chưa thu hồi/hết hạn, agent không RETIRED/PAUSED, scope write) giữ nguyên.
 */
export function taoApiTokenAuth(choPhepAgent: (method: string, path: string, scoped?: boolean) => boolean) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await xacThucTokenCtw(req, { choPhepAgent, ghi: req.method !== 'GET' && req.method !== 'HEAD' });
      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Lõi xác thực token ctw_ (dùng chung cho middleware REST ở trên VÀ cho MCP — src/mcp/server.ts).
 * Trả false nếu header không phải `Bearer ctw_…` (để lớp gọi tự quyết: REST rơi về JWT, MCP trả 401).
 *
 * `ghi` = lệnh này có ghi không. REST suy từ method. MCP luôn POST nên gọi với `ghi: false` ở tầng HTTP rồi
 * TỰ kiểm lại cho từng tool ghi (scope 'write' + agent PAUSED ⇒ 423) — rào chắn không nới, chỉ dời xuống đúng chỗ
 * biết lệnh nào là ghi.
 */
export async function xacThucTokenCtw(
  req: Request,
  opts: { choPhepAgent: (method: string, path: string, scoped?: boolean) => boolean; ghi: boolean },
): Promise<boolean> {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ctw_')) return false;
  const token = h.slice(7).trim();
  if (!/^ctw_[0-9a-f]{8}_[A-Za-z0-9_-]{20,64}$/.test(token)) throw new UnauthorizedError('Invalid API token');
  const row = await prisma.workApiToken.findUnique({
    where: { tokenHash: sha256(token) },
    select: {
      id: true, userId: true, scopes: true, expiresAt: true, revokedAt: true, lastUsedAt: true, agentId: true, projectIds: true,
      user: { select: { enabled: true, accountNonLocked: true, username: true, email: true, kind: true } },
      agent: { select: { id: true, userId: true, workspaceId: true, ownerId: true, status: true, lastSeenAt: true } },
    },
  });
  if (!row || row.revokedAt) throw new UnauthorizedError('Invalid API token');
  if (row.expiresAt && row.expiresAt < new Date()) throw new UnauthorizedError('This API token has expired');
  const scopes = (row.scopes as TokenScope[]) ?? ['read'];
  // Lịch (.ics) không phải token API.
  if (scopes.includes('calendar' as TokenScope)) throw new UnauthorizedError('Invalid API token');
  // ── CTW-28: token agent ⇒ gắn req.agent. Dữ liệu lệch (token agent trỏ user thường, token thường trỏ user agent,
  //    thiếu scope 'agent') ⇒ 401 — không bao giờ đoán.
  if (row.agentId || row.user.kind === 'AGENT') {
    const ag = row.agent;
    if (!ag || row.user.kind !== 'AGENT' || ag.userId !== row.userId || !scopes.includes('agent')) throw new UnauthorizedError('Invalid API token');
    if (ag.status === 'RETIRED') throw new AppError('This AI agent has been retired', 403, 'WORK_AGENT_RETIRED');
    req.agent = { id: ag.id, userId: ag.userId, workspaceId: ag.workspaceId, ownerId: ag.ownerId, status: ag.status, projectIds: tokenProjectIds(row.projectIds) };
    if (!opts.choPhepAgent(req.method, req.path, !!req.agent.projectIds)) {
      throw new AppError('AI agents cannot use this part of CT Work. Ask the agent\'s owner to do this.', 403, 'WORK_AGENT_FORBIDDEN');
    }
    // PAUSED: vẫn đọc được; mọi lệnh ghi ⇒ 423 (cùng mã khoá với editLockGuard).
    if (ag.status === 'PAUSED' && opts.ghi) {
      throw new AppError('This AI agent is paused. Its owner must resume it before it can make changes.', 423, 'WORK_AGENT_PAUSED');
    }
    if (!ag.lastSeenAt || Date.now() - ag.lastSeenAt.getTime() > 60_000) {
      await prisma.workAgent.update({ where: { id: ag.id }, data: { lastSeenAt: new Date() } }).catch(() => undefined);
    }
  }
  if (!row.user.enabled || !row.user.accountNonLocked) throw new ForbiddenError('Account is disabled');
  if (opts.ghi && !scopes.includes('write')) {
    // CTW đợt 7c: 'tests:write' chỉ mở POST nhập kết quả test (TESTS_WRITE_ROUTE) — không nới gì khác.
    const testsOnly = scopes.includes('tests:write') && req.method === 'POST' && TESTS_WRITE_ROUTE.test(req.path);
    if (!testsOnly) throw new ForbiddenError(scopes.includes('tests:write') ? 'This API token can only upload test results' : 'This API token is read-only');
  }
  // Token không được quản lý token.
  if (req.path.startsWith('/me/api-tokens') || req.path.startsWith('/me/calendar-link')) throw new ForbiddenError('Manage API tokens from the CT Work website');
  req.userId = row.userId;
  req.user = { userId: row.userId, username: row.user.username, email: row.user.email } as typeof req.user;
  req.workToken = { id: row.id, scopes };
  if (!row.lastUsedAt || Date.now() - row.lastUsedAt.getTime() > 60_000) {
    await prisma.workApiToken.update({ where: { id: row.id }, data: { lastUsedAt: new Date(), lastUsedIp: (req.ip ?? '').slice(0, 64) || null } }).catch(() => undefined);
  }
  return true;
}
