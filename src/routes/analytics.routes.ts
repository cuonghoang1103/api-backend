/**
 * Web analytics — one public write endpoint, the rest admin-only reads.
 *
 * The write path is intentionally the cheapest thing in the app: it must never
 * slow a page down or fail a navigation, so it validates, fires, and returns
 * 204 without waiting on anything the visitor cares about.
 */
import { Router, type Response } from 'express';
import { optionalAuth, authenticate, requireAdmin } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import {
  recordPageView, getOverview, getDailySeries, getTopPages, getBreakdown, getRecent,
} from '../services/analytics.service.js';

const publicRouter = Router();
const adminRouter = Router();

// POST /api/v1/analytics/pageview — called by the browser on every route change.
// `optionalAuth` so a logged-in view can be attributed without requiring auth.
publicRouter.post('/pageview', optionalAuth, async (req, res) => {
  try {
    // Respect an explicit opt-out. Cheap to honour, and a visitor who asked
    // not to be measured should not be measured.
    if (req.headers.dnt === '1' || req.headers['sec-gpc'] === '1') {
      res.status(204).end();
      return;
    }
    const { path, title, referrer, sessionId } = req.body as Record<string, unknown>;
    if (!path || !sessionId) { res.status(204).end(); return; }

    await recordPageView({
      path: String(path),
      title: title ? String(title) : null,
      referrer: referrer ? String(referrer) : null,
      sessionId: String(sessionId),
      userId: (req as { userId?: number }).userId ?? null,
      userAgent: req.headers['user-agent'],
    });
    res.status(204).end();
  } catch {
    // Analytics must never surface an error to a visitor mid-navigation.
    res.status(204).end();
  }
});

adminRouter.use(authenticate, requireAdmin('ROLE_ADMIN'));

adminRouter.get('/overview', async (_req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await getOverview() }); } catch (e) { next(e); }
});

adminRouter.get('/daily', async (req, res: Response<ApiResponse>, next) => {
  try {
    const days = Math.max(7, Math.min(90, Number(req.query.days) || 30));
    res.json({ success: true, data: await getDailySeries(days) });
  } catch (e) { next(e); }
});

adminRouter.get('/top-pages', async (req, res: Response<ApiResponse>, next) => {
  try {
    const days = Math.max(1, Math.min(90, Number(req.query.days) || 7));
    res.json({ success: true, data: await getTopPages(days, Number(req.query.limit) || 20) });
  } catch (e) { next(e); }
});

adminRouter.get('/breakdown', async (req, res: Response<ApiResponse>, next) => {
  try {
    const days = Math.max(1, Math.min(90, Number(req.query.days) || 7));
    res.json({ success: true, data: await getBreakdown(days) });
  } catch (e) { next(e); }
});

adminRouter.get('/recent', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await getRecent(Number(req.query.limit) || 30) }); }
  catch (e) { next(e); }
});

export { publicRouter, adminRouter };
export default publicRouter;
