import { Router, type Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

const VALID_TYPES = new Set(['DISCOUNT', 'COURSE', 'OTHER']);

function serialize(c: {
  id: number; label: string; code: string; codeType: string; note: string | null;
  expiresAt: Date | null; source: string; createdAt: Date;
}) {
  return {
    id: c.id,
    label: c.label,
    code: c.code,
    codeType: c.codeType,
    note: c.note ?? undefined,
    expiresAt: c.expiresAt,
    source: c.source,
    createdAt: c.createdAt,
  };
}

/**
 * Auto-save a code into the user's wallet when they actually use one
 * (course-code activation, certificate → coupon redemption). Idempotent:
 * upserts on (userId, code) so re-using the same code never duplicates,
 * and a MANUAL entry the user already added is upgraded in place.
 * Never throws — a wallet write must not break the primary action.
 */
export async function saveUserCode(
  userId: number,
  data: { label: string; code: string; codeType?: string; note?: string | null; expiresAt?: Date | null; source?: 'MANUAL' | 'AUTO' },
): Promise<void> {
  try {
    if (!userId || !data.code) return;
    const codeType = data.codeType && VALID_TYPES.has(data.codeType) ? data.codeType : 'OTHER';
    await prisma.userSavedCode.upsert({
      where: { userId_code: { userId, code: data.code } },
      create: {
        userId,
        label: (data.label || 'Mã đã lưu').slice(0, 120),
        code: data.code.slice(0, 80),
        codeType,
        note: data.note ? data.note.slice(0, 255) : null,
        expiresAt: data.expiresAt ?? null,
        source: data.source ?? 'AUTO',
      },
      update: {
        // Keep the richer AUTO metadata but don't clobber a user's label.
        label: (data.label || undefined)?.slice(0, 120),
        codeType,
        ...(data.expiresAt ? { expiresAt: data.expiresAt } : {}),
      },
    });
  } catch {
    /* best-effort — never block the primary action */
  }
}

// ─── GET /api/v1/my-codes ──────────────────────────────
router.get('/', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const codes = await prisma.userSavedCode.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: codes.map(serialize) });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/my-codes (manual add) ────────────────
router.post('/', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const label = String(req.body?.label || '').trim();
    const code = String(req.body?.code || '').trim();
    if (!label || !code) throw new AppError('Tên mã và mã là bắt buộc', 400);
    const codeType = VALID_TYPES.has(String(req.body?.codeType)) ? String(req.body.codeType) : 'OTHER';
    const note = req.body?.note ? String(req.body.note).trim().slice(0, 255) : null;
    let expiresAt: Date | null = null;
    if (req.body?.expiresAt) {
      const d = new Date(req.body.expiresAt);
      if (!isNaN(d.getTime())) expiresAt = d;
    }

    const saved = await prisma.userSavedCode.upsert({
      where: { userId_code: { userId: req.userId, code: code.slice(0, 80) } },
      create: { userId: req.userId, label: label.slice(0, 120), code: code.slice(0, 80), codeType, note, expiresAt, source: 'MANUAL' },
      update: { label: label.slice(0, 120), codeType, note, expiresAt },
    });
    res.status(201).json({ success: true, data: serialize(saved) });
  } catch (error) { next(error); }
});

// ─── DELETE /api/v1/my-codes/:id ───────────────────────
router.delete('/:id', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid id', 400);
    const existing = await prisma.userSavedCode.findUnique({ where: { id }, select: { userId: true } });
    if (!existing || existing.userId !== req.userId) throw new AppError('Không tìm thấy mã', 404);
    await prisma.userSavedCode.delete({ where: { id } });
    res.json({ success: true, data: { id } });
  } catch (error) { next(error); }
});

export default router;
