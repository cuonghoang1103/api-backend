/**
 * CT Work đợt 7c (11/10/2026) — bảo mật & quản trị + công cụ test tự động. Gắn trong work.routes.ts (đã qua apiTokenAuth +
 * authenticate + cổng 2FA + chốt /projects/:pid + chốt cổng khách). Quyền chi tiết TRONG service.
 *
 *   Bảo mật (C17)    GET /me/security · GET|PUT /workspaces/:wsId/security · POST /workspaces/:wsId/security/remind
 *                    (chỉ PHIÊN — token không xem/đổi được chính sách bảo mật)
 *   Tài sản (C25)    GET|POST /projects/:pid/assets · GET|PATCH|DELETE /projects/:pid/assets/:num · PUT …/:num/links
 *                    GET /projects/:pid/assets-export?kind=licenses|credits&format=md|txt|csv
 *                    GET /projects/:pid/issues/:num/assets
 *   Test tự động     POST /projects/:pid/tests/automation/import   (token scope `tests:write`; JSON hoặc thân thô XML/JSON + ?query)
 *   (TST-2)          GET  /projects/:pid/test-automation · POST /projects/:pid/test-automation/tests/:id/reset-flaky (tránh /tests/:num)
 *   Widget (C3)      GET  /projects/:pid/widgets-7c/(test-pass-rate|defects-by-severity|license-expiring|my-time)
 */

import express, { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, ForbiddenError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as security from '../services/work/security.service.js';
import * as assets from '../services/work/assets.service.js';
import * as autoTests from '../services/work/testAutomation.service.js';
import * as widgets from '../services/work/widgets7c.service.js';
import type { MfaClaims } from '../services/mfa/adminMfa.js';

const router = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}
const ok = (r: Response, data: unknown, status = 200) => r.status(status).json({ success: true, data });
function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  try {
    return schema.parse(value);
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0];
      throw new AppError(`${first?.path.length ? `${first.path.join('.')}: ` : ''}${first?.message ?? 'Invalid input'}`, 400, 'VALIDATION_ERROR');
    }
    throw err;
  }
}
const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);
/** Chính sách bảo mật chỉ đổi/xem qua PHIÊN web — token (kể cả token có quyền ghi) không được. */
function sessionOnly(req: Request) {
  if (req.workToken || req.agent) throw new ForbiddenError('Manage security settings from the CT Work website');
}

// ═══ Bảo mật (C17) ═════════════════════════════════════════════════

router.get('/me/security', asyncHandler(async (req, res) => {
  sessionOnly(req);
  ok(res, await security.mySecurity(callerId(req), req.user as MfaClaims | undefined));
}));
router.get('/workspaces/:wsId/security', asyncHandler(async (req, res) => {
  sessionOnly(req);
  ok(res, await security.getSecurity(callerId(req), P(req, 'wsId')));
}));
router.put('/workspaces/:wsId/security', asyncHandler(async (req, res) => {
  sessionOnly(req);
  const body = parse(z.object({ require2fa: z.boolean().optional(), graceDays: z.number().int().min(0).max(30).optional() }).strict(), req.body);
  ok(res, await security.setSecurity(callerId(req), P(req, 'wsId'), body));
}));
router.post('/workspaces/:wsId/security/remind', asyncHandler(async (req, res) => {
  sessionOnly(req);
  ok(res, await security.remindMissing(callerId(req), P(req, 'wsId')));
}));

// ═══ Sổ tài sản & giấy phép (C25) ══════════════════════════════════

const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const assetBody = z.object({
  name: z.string().max(160).optional(),
  category: z.enum(assets.ASSET_CATEGORIES).optional(),
  licenseType: z.enum(assets.LICENSE_TYPES).optional(),
  licenseName: z.string().max(120).nullable().optional(),
  licenseUrl: z.string().max(500).nullable().optional(),
  source: z.string().max(300).nullable().optional(),
  sourceUrl: z.string().max(500).nullable().optional(),
  version: z.string().max(60).nullable().optional(),
  ownerId: id.nullable().optional(),
  status: z.enum(assets.ASSET_STATUSES).optional(),
  expiresAt: ymd.nullable().optional(),
  remindDays: z.number().int().min(0).max(365).optional(),
  cost: z.number().min(0).max(1e12).nullable().optional(),
  currency: z.string().length(3).optional(),
  billing: z.enum(assets.BILLING).optional(),
  seats: z.number().int().min(0).max(100000).nullable().optional(),
  attributionRequired: z.boolean().optional(),
  attribution: z.string().max(4000).nullable().optional(),
  notes: z.string().max(8000).nullable().optional(),
}).strict();

router.get('/projects/:pid/assets', asyncHandler(async (req, res) => {
  const q = parse(z.object({ category: z.enum(assets.ASSET_CATEGORIES).optional(), status: z.enum(assets.ASSET_STATUSES).optional(), expiring: z.enum(['1', 'true']).optional() }), req.query);
  ok(res, await assets.listAssets(callerId(req), P(req, 'pid'), { category: q.category, status: q.status, expiring: !!q.expiring }));
}));
router.post('/projects/:pid/assets', asyncHandler(async (req, res) => {
  const body = parse(assetBody.extend({ name: z.string().min(1).max(160) }), req.body);
  ok(res, await assets.createAsset(callerId(req), P(req, 'pid'), body), 201);
}));
router.get('/projects/:pid/assets-export', asyncHandler(async (req, res) => {
  const q = parse(z.object({ kind: z.enum(['licenses', 'credits']).default('licenses'), format: z.enum(['md', 'txt', 'csv']).default('md') }), req.query);
  const f = await assets.exportLicenses(callerId(req), P(req, 'pid'), q.kind, q.format);
  res.setHeader('Content-Type', f.mime);
  res.setHeader('Content-Disposition', `attachment; filename="${f.fileName}"; filename*=UTF-8''${encodeURIComponent(f.fileName)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(f.body);
}));
router.get('/projects/:pid/assets/:num', asyncHandler(async (req, res) => {
  ok(res, await assets.getAsset(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.patch('/projects/:pid/assets/:num', asyncHandler(async (req, res) => {
  ok(res, await assets.updateAsset(callerId(req), P(req, 'pid'), P(req, 'num'), parse(assetBody, req.body)));
}));
router.delete('/projects/:pid/assets/:num', asyncHandler(async (req, res) => {
  ok(res, await assets.deleteAsset(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.put('/projects/:pid/assets/:num/links', asyncHandler(async (req, res) => {
  const body = parse(z.object({ issues: z.array(z.union([z.string().max(30), z.number().int().positive()])).max(50).optional(), pages: z.array(z.number().int().positive()).max(50).optional() }).strict(), req.body);
  ok(res, await assets.setAssetLinks(callerId(req), P(req, 'pid'), P(req, 'num'), body));
}));
router.get('/projects/:pid/issues/:num/assets', asyncHandler(async (req, res) => {
  ok(res, await assets.assetsOfIssue(callerId(req), P(req, 'pid'), P(req, 'num')));
}));

// ═══ Kết quả test tự động (TST-2) ══════════════════════════════════

const importQuery = z.object({
  format: z.enum(['junit', 'playwright', 'jest', 'auto']).optional(),
  build: z.string().max(80).optional(), branch: z.string().max(120).optional(), commit: z.string().max(64).optional(),
  runUrl: z.string().max(500).optional(), environment: z.string().max(120).optional(), cycle: z.string().max(120).optional(),
  createBugs: z.enum(['true', 'false', '1', '0']).optional(),
  // CTW đợt 8c: cycle gộp tự đóng — close=true (job cuối) · jobs=N · closeAfterMin=M (0 = không tự đóng theo giờ)
  close: z.enum(['true', 'false', '1', '0']).optional(), jobs: z.coerce.number().int().min(1).max(200).optional(), closeAfterMin: z.coerce.number().int().min(0).max(10_080).optional(),
});
const importJson = z.object({
  report: z.union([z.string().max(11_000_000), z.record(z.unknown())]),
  format: z.enum(['junit', 'playwright', 'jest', 'auto']).optional(),
  build: z.string().max(80).nullable().optional(), branch: z.string().max(120).nullable().optional(), commit: z.string().max(64).nullable().optional(),
  runUrl: z.string().max(500).nullable().optional(), environment: z.string().max(120).nullable().optional(), cycle: z.string().max(120).nullable().optional(),
  createBugs: z.boolean().optional(),
  close: z.boolean().optional(), jobs: z.number().int().min(1).max(200).nullable().optional(), closeAfterMin: z.number().int().min(0).max(10_080).nullable().optional(),
  coverage: z.object({ report: z.string().max(11_000_000), format: z.enum(['lcov', 'jacoco', 'cobertura', 'istanbul', 'auto']).optional() }).nullable().optional(),
}).strict();
const FMT = { junit: 'JUNIT', playwright: 'PLAYWRIGHT', jest: 'JEST', auto: 'AUTO' } as const;
const CFMT = { lcov: 'LCOV', jacoco: 'JACOCO', cobertura: 'COBERTURA', istanbul: 'ISTANBUL', auto: 'AUTO' } as const;

// Thân thô (curl --data-binary @report.xml -H 'Content-Type: application/xml') — JSON vẫn đi express.json toàn cục.
const rawText = express.text({ type: ['application/xml', 'text/xml', 'text/plain', 'application/octet-stream'], limit: '10mb' });

router.post('/projects/:pid/tests/automation/import', rawText, asyncHandler(async (req, res) => {
  const meta = { source: (req.workToken ? 'API' : 'UPLOAD') as 'API' | 'UPLOAD', tokenId: req.workToken?.id ?? null };
  let input: autoTests.ImportInput;
  if (typeof req.body === 'string') {
    const q = parse(importQuery, req.query);
    input = {
      report: req.body, format: q.format ? FMT[q.format] : 'AUTO', build: q.build, branch: q.branch, commit: q.commit, runUrl: q.runUrl,
      environment: q.environment, cycle: q.cycle, createBugs: q.createBugs === undefined ? undefined : q.createBugs === 'true' || q.createBugs === '1',
      close: q.close === 'true' || q.close === '1', jobs: q.jobs, closeAfterMin: q.closeAfterMin === 0 ? null : q.closeAfterMin,
    };
  } else {
    const b = parse(importJson, req.body);
    input = {
      ...b, report: b.report, format: b.format ? FMT[b.format] : 'AUTO', closeAfterMin: b.closeAfterMin === 0 ? null : b.closeAfterMin,
      coverage: b.coverage ? { report: b.coverage.report, format: b.coverage.format ? CFMT[b.coverage.format] : 'AUTO' } : null,
    };
  }
  ok(res, await autoTests.importResults(callerId(req), P(req, 'pid'), input, meta), 201);
}));
router.get('/projects/:pid/test-automation', asyncHandler(async (req, res) => {
  ok(res, await autoTests.overview(callerId(req), P(req, 'pid')));
}));
router.post('/projects/:pid/test-automation/tests/:id/reset-flaky', asyncHandler(async (req, res) => {
  ok(res, await autoTests.resetFlaky(callerId(req), P(req, 'pid'), P(req, 'id')));
}));

// ═══ Widget (C3) ═══════════════════════════════════════════════════

router.get('/projects/:pid/widgets-7c/test-pass-rate', asyncHandler(async (req, res) => { ok(res, await widgets.testPassRate(callerId(req), P(req, 'pid'))); }));
router.get('/projects/:pid/widgets-7c/defects-by-severity', asyncHandler(async (req, res) => { ok(res, await widgets.defectsBySeverity(callerId(req), P(req, 'pid'))); }));
router.get('/projects/:pid/widgets-7c/license-expiring', asyncHandler(async (req, res) => { ok(res, await widgets.licenseExpiring(callerId(req), P(req, 'pid'))); }));
router.get('/projects/:pid/widgets-7c/my-time', asyncHandler(async (req, res) => { ok(res, await widgets.myTime(callerId(req), P(req, 'pid'))); }));

export default router;
