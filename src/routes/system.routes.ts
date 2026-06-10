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
    const rawUrl = process.env.DATABASE_URL || '';
    const maskedUrl = rawUrl.replace(/:[^:@]+@/, ':***@');
    console.log(`[db-test] DATABASE_URL at request time: ${maskedUrl}`);
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    res.json({ success: true, data: { dbUrl: maskedUrl, result, timestamp: new Date().toISOString() } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const code = (error as { code?: string }).code;
    const rawUrl = process.env.DATABASE_URL || '';
    const maskedUrl = rawUrl.replace(/:[^:@]+@/, ':***@');
    console.log(`[db-test] DATABASE_URL at request time: ${maskedUrl}`);
    console.log(`[db-test] Error: ${message}`);
    res.json({ success: false, message, data: { code, dbUrl: maskedUrl } });
  }
});

// ─── GET /api/v1/system/prisma-debug ───────────────
router.get('/prisma-debug', async (_req, res: Response<ApiResponse>) => {
  const rawUrl = process.env.DATABASE_URL || '';
  const maskedUrl = rawUrl.replace(/:[^:@]+@/, ':***@');
  const prismaUrl = (prisma as unknown as { _clientDatasources?: { db?: { url?: string } } })._clientDatasources?.db?.url || 'N/A';
  const maskedPrismaUrl = prismaUrl.replace(/:[^:@]+@/, ':***@');
  res.json({ success: true, data: { envUrl: maskedUrl, prismaUrl: maskedPrismaUrl } });
});

export default router;
