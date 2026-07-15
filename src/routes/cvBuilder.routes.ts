/**
 * CV Builder routes (Phase 1 — master profile CRUD).
 * ────────────────────────────────────────────────────────────
 * Default export  → user router,  mounted at /api/v1/cv
 * Named `adminRouter` → admin router, mounted at /api/v1/admin/cv
 *
 * Every user route is scoped to req.userId inside the service layer (IDOR
 * guard enforced in the query), so there is no way to read or mutate another
 * user's CV data. Bodies are validated with zod in the service; a ZodError is
 * mapped to a 400 here (the global handler would otherwise treat it as 500).
 */
import { Router, type Request, type Response, type NextFunction } from 'express';
import { ZodError } from 'zod';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import { prisma } from '../config/database.js';
import * as profile from '../services/cv/profile.service.js';
import * as importSvc from '../services/cv/import.service.js';

const parseId = (v: string): number => {
  const n = parseInt(v, 10);
  return Number.isInteger(n) && n > 0 ? n : NaN;
};

/**
 * Wrap an async handler: run it, map ZodError → 400, forward the rest to the
 * global error handler. Keeps every route body a one-liner.
 */
type Handler = (req: Request, res: Response<ApiResponse>) => Promise<unknown>;
const h = (fn: Handler) =>
  async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
    try {
      const data = await fn(req, res);
      if (!res.headersSent) res.json({ success: true, data });
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: err.issues[0]?.message || 'Dữ liệu không hợp lệ',
          data: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
        });
        return;
      }
      next(err);
    }
  };

/** Parse an :id param or send 400. Returns NaN after responding. */
const idOr400 = (req: Request, res: Response<ApiResponse>): number => {
  const id = parseId(req.params.id);
  if (Number.isNaN(id)) res.status(400).json({ success: false, message: 'id không hợp lệ' });
  return id;
};

// ═══════════════════════ USER ROUTER ════════════════════════════
const router = Router();
router.use(authenticate);

// ── Master profile ──────────────────────────────────────────────
router.get('/profile', h((req) => profile.getOrCreateProfile(req.userId!)));
router.put('/profile', h((req) => profile.updateProfile(req.userId!, req.body ?? {})));
router.get('/profile/completeness', h((req) => profile.getProfileCompleteness(req.userId!)));

// ── Items (experience / project / education / …) ────────────────
router.post('/items', h((req) => profile.createItem(req.userId!, req.body ?? {})));
router.put('/items/:id', h((req, res) => {
  const id = idOr400(req, res); if (Number.isNaN(id)) return Promise.resolve();
  return profile.updateItem(req.userId!, id, req.body ?? {});
}));
router.delete('/items/:id', h((req, res) => {
  const id = idOr400(req, res); if (Number.isNaN(id)) return Promise.resolve();
  return profile.deleteItem(req.userId!, id);
}));

// ── Bullets ─────────────────────────────────────────────────────
router.post('/items/:id/bullets', h((req, res) => {
  const id = idOr400(req, res); if (Number.isNaN(id)) return Promise.resolve();
  return profile.createBullet(req.userId!, id, req.body ?? {});
}));
router.put('/bullets/:id', h((req, res) => {
  const id = idOr400(req, res); if (Number.isNaN(id)) return Promise.resolve();
  return profile.updateBullet(req.userId!, id, req.body ?? {});
}));
router.post('/bullets/:id/verify', h((req, res) => {
  const id = idOr400(req, res); if (Number.isNaN(id)) return Promise.resolve();
  return profile.verifyBullet(req.userId!, id, req.body?.verified !== false);
}));
router.delete('/bullets/:id', h((req, res) => {
  const id = idOr400(req, res); if (Number.isNaN(id)) return Promise.resolve();
  return profile.deleteBullet(req.userId!, id);
}));

// ── Skills ──────────────────────────────────────────────────────
router.post('/skills', h((req) => profile.createSkill(req.userId!, req.body ?? {})));
router.put('/skills/:id', h((req, res) => {
  const id = idOr400(req, res); if (Number.isNaN(id)) return Promise.resolve();
  return profile.updateSkill(req.userId!, id, req.body ?? {});
}));
router.delete('/skills/:id', h((req, res) => {
  const id = idOr400(req, res); if (Number.isNaN(id)) return Promise.resolve();
  return profile.deleteSkill(req.userId!, id);
}));

// ── Certifications ──────────────────────────────────────────────
router.post('/certifications', h((req) => profile.createCert(req.userId!, req.body ?? {})));
router.put('/certifications/:id', h((req, res) => {
  const id = idOr400(req, res); if (Number.isNaN(id)) return Promise.resolve();
  return profile.updateCert(req.userId!, id, req.body ?? {});
}));
router.delete('/certifications/:id', h((req, res) => {
  const id = idOr400(req, res); if (Number.isNaN(id)) return Promise.resolve();
  return profile.deleteCert(req.userId!, id);
}));

// ── Language skills ─────────────────────────────────────────────
router.post('/languages', h((req) => profile.createLang(req.userId!, req.body ?? {})));
router.put('/languages/:id', h((req, res) => {
  const id = idOr400(req, res); if (Number.isNaN(id)) return Promise.resolve();
  return profile.updateLang(req.userId!, id, req.body ?? {});
}));
router.delete('/languages/:id', h((req, res) => {
  const id = idOr400(req, res); if (Number.isNaN(id)) return Promise.resolve();
  return profile.deleteLang(req.userId!, id);
}));

// ── Import (Phase 2a: paste + JSON Resume; files/GitHub later) ──
router.get('/import', h((req) => importSvc.listImports(req.userId!)));
router.post('/import/paste', h((req) => importSvc.createPasteImport(req.userId!, req.body ?? {})));
router.post('/import/json-resume', h((req) => importSvc.createJsonResumeImport(req.userId!, req.body?.resume ?? req.body)));
router.get('/import/:id', h((req, res) => {
  const id = idOr400(req, res); if (Number.isNaN(id)) return Promise.resolve();
  return importSvc.getImport(req.userId!, id);
}));
router.post('/import/:id/commit', h((req, res) => {
  const id = idOr400(req, res); if (Number.isNaN(id)) return Promise.resolve();
  return importSvc.commitImport(req.userId!, id, req.body ?? {});
}));

// ═══════════════════════ ADMIN ROUTER ═══════════════════════════
const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin());

// Anonymized aggregate only — never exposes individual CV content.
adminRouter.get('/overview', h(async () => {
  const [profiles, documents, reviews] = await Promise.all([
    prisma.cvProfile.count(),
    prisma.cvDocument.count(),
    prisma.cvReview.count(),
  ]);
  return { profiles, documents, reviews };
}));

export default router;
export { adminRouter };
