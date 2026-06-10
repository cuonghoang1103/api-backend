import { Router, type Response } from 'express';
import type { ApiResponse } from '../types/index.js';
import { prisma } from '../config/database.js';

const router = Router();

// ─── GET /api/v1/system/health ────────────────────────
router.get('/health', async (_req, res: Response<ApiResponse>) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// ─── GET /api/v1/system/db-test ──────────────────────
router.get('/db-test', async (_req, res: Response<ApiResponse>) => {
  try {
    const url = process.env.DATABASE_URL || '';
    const maskedUrl = url.replace(/:[^:@]+@/, ':***@');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    res.json({ success: true, data: { dbUrl: maskedUrl, result, timestamp: new Date().toISOString() } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const code = (error as { code?: string }).code;
    res.json({ success: false, message, data: { code, dbUrl: (process.env.DATABASE_URL || '').replace(/:[^:@]+@/, ':***@') } });
  }
});

export default router;
