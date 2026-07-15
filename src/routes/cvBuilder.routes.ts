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
import multer from 'multer';
import { ZodError } from 'zod';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import { prisma } from '../config/database.js';
import * as profile from '../services/cv/profile.service.js';
import * as importSvc from '../services/cv/import.service.js';
import * as lintSvc from '../services/cv/lint.service.js';
import { exportProfile, type ExportFormat } from '../services/cv/export.service.js';
import * as critiqueSvc from '../services/cv/critique.service.js';

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

// ── Import (Phase 2a paste + JSON Resume; 2b PDF/DOCX upload) ──
// CV files are held in memory only (never written to disk) and processed then
// dropped — the extracted text is what persists, redactable and non-PII-logged.
const cvUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
router.get('/import', h((req) => importSvc.listImports(req.userId!)));
router.post('/import/paste', h((req) => importSvc.createPasteImport(req.userId!, req.body ?? {})));
router.post('/import/upload', cvUpload.single('file'), h((req) => {
  const f = (req as Request & { file?: { buffer: Buffer; originalname: string } }).file;
  if (!f) { throw new ZodError([{ code: 'custom', path: ['file'], message: 'Cần chọn file PDF hoặc DOCX' }]); }
  return importSvc.createFileImport(req.userId!, f.buffer, f.originalname);
}));
router.post('/import/json-resume', h((req) => importSvc.createJsonResumeImport(req.userId!, req.body?.resume ?? req.body)));
router.get('/import/:id', h((req, res) => {
  const id = idOr400(req, res); if (Number.isNaN(id)) return Promise.resolve();
  return importSvc.getImport(req.userId!, id);
}));
router.post('/import/:id/commit', h((req, res) => {
  const id = idOr400(req, res); if (Number.isNaN(id)) return Promise.resolve();
  return importSvc.commitImport(req.userId!, id, req.body ?? {});
}));

// ── Analysis (Phase 3: STATIC rules engine — free, instant, no LLM) ──
router.post('/lint', h((req) => lintSvc.lintProfile(req.userId!, req.body ?? {})));

// ── AI Critique (Phase 7) — quota-gated; degrades to STATIC when no key ──
router.get('/critique/status', h(async () => critiqueSvc.critiqueStatus()));
router.post('/critique', h((req) => critiqueSvc.critiqueProfile(req.userId!)));

// ── Export (Phase 4: PDF/DOCX/TXT/MD/JSON) — binary download, not JSON ──
router.get('/export/:format', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const format = String(req.params.format).toLowerCase() as ExportFormat;
    const { buffer, mime, filename, roundTripOk } = await exportProfile(req.userId!, format);
    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    if (roundTripOk !== null) res.setHeader('X-CV-RoundTrip', roundTripOk ? 'ok' : 'fail');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
});

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
