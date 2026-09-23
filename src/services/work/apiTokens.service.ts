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
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../../middleware/errorHandler.js';
import { sha256 } from './common.js';

export const TOKEN_SCOPES = ['read', 'write'] as const;
export type TokenScope = (typeof TOKEN_SCOPES)[number];
const MAX_TOKENS = 20;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Có khi request xác thực bằng API token CT Work (không phải phiên web). */
      workToken?: { id: number; scopes: TokenScope[] };
    }
  }
}

export async function listTokens(userId: number) {
  return prisma.workApiToken.findMany({
    where: { userId, revokedAt: null },
    orderBy: { id: 'desc' },
    select: { id: true, name: true, prefix: true, scopes: true, expiresAt: true, lastUsedAt: true, lastUsedIp: true, createdAt: true },
  });
}

export async function createToken(userId: number, input: { name: string; scopes: TokenScope[]; expiresInDays?: number | null }) {
  const name = input.name.trim().slice(0, 100);
  if (!name) throw new BadRequestError('Give the token a name', 'WORK_NAME_REQUIRED');
  const scopes = [...new Set<TokenScope>(['read', ...input.scopes.filter((s) => TOKEN_SCOPES.includes(s))])];
  const count = await prisma.workApiToken.count({ where: { userId, revokedAt: null } });
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
  const r = await prisma.workApiToken.updateMany({ where: { id, userId, revokedAt: null }, data: { revokedAt: new Date() } });
  if (!r.count) throw new NotFoundError('Token not found');
}

/**
 * Middleware đặt TRƯỚC authenticate của router. Không phải token ctw_ ⇒ đi
 * tiếp để JWT xử lý như cũ. Là token ctw_ ⇒ tự xác thực, gắn req.userId và
 * bỏ qua authenticate (đánh dấu req.workToken).
 */
export async function apiTokenAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const h = req.headers.authorization;
    if (!h?.startsWith('Bearer ctw_')) return next();
    const token = h.slice(7).trim();
    if (!/^ctw_[0-9a-f]{8}_[A-Za-z0-9_-]{20,64}$/.test(token)) throw new UnauthorizedError('Invalid API token');
    const row = await prisma.workApiToken.findUnique({
      where: { tokenHash: sha256(token) },
      select: { id: true, userId: true, scopes: true, expiresAt: true, revokedAt: true, lastUsedAt: true, user: { select: { enabled: true, accountNonLocked: true, username: true, email: true } } },
    });
    if (!row || row.revokedAt) throw new UnauthorizedError('Invalid API token');
    if (row.expiresAt && row.expiresAt < new Date()) throw new UnauthorizedError('This API token has expired');
    if (!row.user.enabled || !row.user.accountNonLocked) throw new ForbiddenError('Account is disabled');
    const scopes = (row.scopes as TokenScope[]) ?? ['read'];
    if (req.method !== 'GET' && req.method !== 'HEAD' && !scopes.includes('write')) throw new ForbiddenError('This API token is read-only');
    // Token không được quản lý token.
    if (req.path.startsWith('/me/api-tokens')) throw new ForbiddenError('Manage API tokens from the CT Work website');
    req.userId = row.userId;
    req.user = { userId: row.userId, username: row.user.username, email: row.user.email } as typeof req.user;
    req.workToken = { id: row.id, scopes };
    if (!row.lastUsedAt || Date.now() - row.lastUsedAt.getTime() > 60_000) {
      await prisma.workApiToken.update({ where: { id: row.id }, data: { lastUsedAt: new Date(), lastUsedIp: (req.ip ?? '').slice(0, 64) || null } }).catch(() => undefined);
    }
    next();
  } catch (err) {
    next(err);
  }
}
