/**
 * ============================================================
 * Embed Queue Admin Routes
 *
 * Endpoints:
 * GET /api/v1/admin/embed-jobs — list recent jobs
 * GET /api/v1/admin/embed-jobs/stats — aggregate stats
 * POST /api/v1/admin/embed-jobs/flush — force process queue
 * POST /api/v1/admin/embed-jobs/reembed — manual re-embed trigger
 * POST /api/v1/admin/embed-jobs/cleanup — manual cleanup trigger
 *
 * Auth: inline `requireAdmin` (JWT verify + DB role lookup). We do NOT
 * mount `authenticate` + `requireAdmin` as Express middleware here even
 * though all other admin routes do, because this router is mounted at
 * `/api/v1/admin/embed-jobs` which is a prefix-overlap of `/api/v1/admin`
 * (mounted below with the other adminRoutes). Express 4 runs each
 * matched mount point's middleware stack, so adding `authenticate`
 * here would run it TWICE for the same request — two concurrent
 * Prisma transactions reading the same `users` row → deadlock that
 * hangs the request indefinitely with no error response.
 *
 * Instead we replicate the auth flow inline: jwt.verify + a single
 * Prisma `findUnique` that joins roles + checks `enabled` /
 * `accountNonLocked` and the role name. Same security guarantees as
 * the shared middleware, but the Prisma call only happens once.
 * ============================================================
 */

import { Router, type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
 listJobs,
 getJobStats,
 enqueueJob,
 flushQueue,
} from '../services/embedQueue.service.js';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { extractToken } from '../middleware/auth.js';
import {
 UnauthorizedError,
 ForbiddenError,
} from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

interface JwtPayload {
 userId: number;
 username: string;
 email: string;
 roles: string[];
 roleVersion: number;
}

/**
 * Verify JWT and admin role in one shot, without going through
 * `authenticate` + `requireAdmin` middleware (see file header for why).
 *
 * Throws `UnauthorizedError` / `ForbiddenError` via `next(err)` so the
 * global error handler produces the standard response shape used by the
 * rest of the admin API.
 */
async function requireAdminInline(
 req: Request,
 _res: Response,
 next: NextFunction,
): Promise<void> {
  try {
 const token = extractToken(req);
 if (!token) {
 throw new UnauthorizedError('No authentication token provided');
 }

 let decoded: JwtPayload;
 try {
 decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
 } catch (err) {
 if (err instanceof jwt.TokenExpiredError) {
 throw new UnauthorizedError('Token has expired');
 }
 if (err instanceof jwt.JsonWebTokenError) {
 throw new UnauthorizedError('Invalid token');
 }
 throw err;
 }

 // Single DB lookup: user + roles + status flags. Joins on
 // user_roles so we can check the role name in one round-trip
 // and avoid running `authenticate` + `requireAdmin` separately
 // (each of which would do its own findUnique — that's the
 // deadlock we are avoiding).
 const user = await prisma.user.findUnique({
 where: { id: decoded.userId },
 select: {
 enabled: true,
 accountNonLocked: true,
 roles: {
 select: {
 role: { select: { name: true } },
 },
 },
 },
 });

 if (!user) throw new UnauthorizedError('User not found');
 if (!user.enabled) throw new ForbiddenError('Account is disabled');
 if (!user.accountNonLocked) throw new ForbiddenError('Account is locked');

 const isAdmin = user.roles.some((ur) => {
 const name = (ur.role?.name ?? '').toUpperCase();
 return name === 'ADMIN' || name === 'ROLE_ADMIN';
 });
 if (!isAdmin) throw new ForbiddenError('Admin access required');

 // Stash on req for downstream handlers if they need it (matches
 // `authenticate`/`requireAdmin` convention).
 req.user = decoded;
 req.userId = decoded.userId;

 next();
 } catch (err) {
 next(err);
  }
}

// ─── GET / — list recent jobs ───────────────────────────
router.get('/', requireAdminInline, async (req: Request, res: Response, next: NextFunction) => {
 try {
  const { status, type, limit } = req.query;
 const jobs = listJobs({
 status: status as any,
 type: type as any,
 limit: limit ? parseInt(limit as string, 10) : 50,
 });
 const response: ApiResponse = {
 success: true,
 data: { jobs, count: jobs.length },
 };
 res.json(response);
 } catch (err) {
 next(err);
 }
});

// ─── GET /stats — aggregate stats ──────────────────────
router.get('/stats', requireAdminInline, async (_req: Request, res: Response, next: NextFunction) => {
 try {
 const stats = getJobStats();
 const response: ApiResponse = {
 success: true,
 data: stats,
 };
 res.json(response);
 } catch (err) {
  next(err);
 }
});

// ─── POST /flush — force process queue ─────────────────
router.post('/flush', requireAdminInline, async (_req: Request, res: Response, next: NextFunction) => {
 try {
 await flushQueue();
 const response: ApiResponse = {
 success: true,
 message: 'Queue flushed',
 };
 res.json(response);
 } catch (err) {
 next(err);
 }
});

// ─── POST /reembed — manual re-embed trigger ───────────
router.post('/reembed', requireAdminInline, async (_req: Request, res: Response, next: NextFunction) => {
 try {
 const job = enqueueJob('reembed_all', { triggeredBy: 'admin', at: new Date().toISOString() });
 const response: ApiResponse = {
 success: true,
 data: { jobId: job.id },
 message: 'Re-embed job enqueued',
 };
 res.json(response);
 } catch (err) {
  next(err);
 }
});

// ─── POST /cleanup — manual cleanup trigger ────────────
router.post('/cleanup', requireAdminInline, async (_req: Request, res: Response, next: NextFunction) => {
 try {
 const job = enqueueJob('cleanup_garbage', { triggeredBy: 'admin', at: new Date().toISOString() });
 const response: ApiResponse = {
 success: true,
 data: { jobId: job.id },
 message: 'Cleanup job enqueued',
 };
 res.json(response);
 } catch (err) {
  next(err);
 }
});

export default router;
