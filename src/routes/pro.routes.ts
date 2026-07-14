/**
 * Pro membership routes.
 * ────────────────────────────────────────────────────────────
 * Default export  → user router,  mounted at /api/v1/pro
 * Named `adminRouter` → admin router, mounted at /api/v1/admin/pro
 */
import { Router, type Request, type Response } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import * as pro from '../services/pro.service.js';

const parseId = (v: string): number => {
  const n = parseInt(v, 10);
  return Number.isInteger(n) && n > 0 ? n : NaN;
};

// ═══════════════════════ USER ROUTER ════════════════════════════
const router = Router();
router.use(authenticate);

router.get('/status', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await pro.getProStatus(req.userId!) });
  } catch (err) { next(err); }
});

router.post('/redeem', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const data = await pro.redeemProCode(req.userId!, String(req.body?.code ?? ''));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// ═══════════════════════ ADMIN ROUTER ═══════════════════════════
const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin());

adminRouter.get('/codes', async (_req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await pro.listProCodes() }); } catch (err) { next(err); }
});
adminRouter.post('/codes', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await pro.createProCode(req.body ?? {}, req.userId) }); } catch (err) { next(err); }
});
adminRouter.put('/codes/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = parseId(req.params.id);
    if (Number.isNaN(id)) { res.status(400).json({ success: false, message: 'id không hợp lệ' }); return; }
    res.json({ success: true, data: await pro.updateProCode(id, req.body ?? {}) });
  } catch (err) { next(err); }
});
adminRouter.delete('/codes/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = parseId(req.params.id);
    if (Number.isNaN(id)) { res.status(400).json({ success: false, message: 'id không hợp lệ' }); return; }
    res.json({ success: true, data: await pro.deleteProCode(id) });
  } catch (err) { next(err); }
});

// Users currently holding Pro
adminRouter.get('/users', async (_req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await pro.listProUsers() }); } catch (err) { next(err); }
});

// Grant Pro directly to a user (no code needed)
adminRouter.post('/grant', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = parseId(String(req.body?.userId));
    if (Number.isNaN(userId)) { res.status(400).json({ success: false, message: 'userId không hợp lệ' }); return; }
    const durationDays = req.body?.durationDays == null ? null : parseInt(String(req.body.durationDays), 10);
    const data = await pro.grantProToUser(userId, Number.isFinite(durationDays as number) && (durationDays as number) > 0 ? (durationDays as number) : null, 'ADMIN');
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// Revoke Pro from a user
adminRouter.post('/revoke', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = parseId(String(req.body?.userId));
    if (Number.isNaN(userId)) { res.status(400).json({ success: false, message: 'userId không hợp lệ' }); return; }
    res.json({ success: true, data: await pro.revokePro(userId) });
  } catch (err) { next(err); }
});

export default router;
export { adminRouter };
