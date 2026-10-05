/**
 * CT Work — RESOURCES (06/10/2026, mô-đun `resources`): thư viện link của dự án. Gắn VÀO work.routes.ts (một dòng
 * `router.use` ở cuối, sau authenticate + chốt cổng khách) ⇒ khách bị cách ly gọi tuyến nội bộ ⇒ 403
 * CLIENT_PORTAL_ONLY; khách đi qua /portal/resources (danh sách trắng `/portal/**` sẵn có).
 *
 *   - Link:     GET/POST /projects/:pid/resources · GET/PATCH/DELETE /projects/:pid/resources/:id
 *               POST /projects/:pid/resources/:id/open (tăng đếm + trả url) · POST …/:id/refresh (xem trước GitHub)
 *               PUT  /projects/:pid/resources/reorder { groupId, ids } · POST …/import { text, format?, dryRun? }
 *               POST /projects/:pid/resources/preview { url } (tự điền tiêu đề — chặn SSRF) · POST …/check (ADMIN)
 *               GET  /projects/:pid/resources/sidebar (link ghim lên sidebar)
 *   - Nhóm:     POST /projects/:pid/resource-groups · PATCH/DELETE …/:gid · PUT …/reorder { ids }
 *   - Thẻ:      GET/POST /projects/:pid/issues/:num/web-links · DELETE …/:lid · POST …/:lid/save
 *   - Cổng:     GET /projects/:pid/portal/resources · POST /projects/:pid/portal/resources/:id/open
 *
 * Quyền + mô-đun kiểm TRONG service (resources.service) — route chỉ kiểm đầu vào.
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, UnauthorizedError } from '../middleware/errorHandler.js';
import { RESOURCE_VISIBILITY } from '../services/work/constants.js';
import * as res from '../services/work/resources.service.js';

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
      const where = first?.path.length ? `${first.path.join('.')}: ` : '';
      throw new AppError(`${where}${first?.message ?? 'Invalid input'}`, 400, 'VALIDATION_ERROR', { errors: err.issues.slice(0, 20).map((i) => ({ path: i.path.join('.'), message: i.message })) });
    }
    throw err;
  }
}

const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);
const asClient = (req: Request) => req.query.asClient === '1' || req.query.asClient === 'true';

const tags = z.array(z.string().max(60)).max(30);
const resourceBody = z.object({
  title: z.string().max(300).nullable().optional(),
  url: z.string().min(1).max(2100),
  description: z.string().max(4000).nullable().optional(),
  tags: tags.optional(),
  groupId: id.nullable().optional(),
  pinned: z.boolean().optional(),
  pinnedToSidebar: z.boolean().optional(),
  visibility: z.enum(RESOURCE_VISIBILITY).optional(),
}).strict();
const groupBody = z.object({
  name: z.string().min(1).max(80),
  icon: z.string().max(16).nullable().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use #rrggbb').nullable().optional(),
}).strict();

// ─── Link ────────────────────────────────────────────────────────

router.get('/projects/:pid/resources', asyncHandler(async (req, r) => {
  const q = parse(z.object({
    q: z.string().max(200).optional(),
    group: z.union([id, z.literal('none')]).optional(),
    tag: z.string().max(60).optional(),
    kind: z.string().max(24).optional(),
    pinned: z.enum(['1', '0', 'true', 'false']).optional(),
    status: z.enum(['OK', 'BROKEN', 'UNKNOWN']).optional(),
  }), req.query);
  ok(r, await res.listResources(callerId(req), P(req, 'pid'), {
    q: q.q, tag: q.tag, kind: q.kind, status: q.status,
    groupId: q.group === undefined ? undefined : q.group === 'none' ? null : q.group,
    pinned: q.pinned === undefined ? undefined : q.pinned === '1' || q.pinned === 'true',
  }));
}));
router.get('/projects/:pid/resources/sidebar', asyncHandler(async (req, r) => {
  ok(r, await res.sidebarResources(callerId(req), P(req, 'pid')));
}));
router.post('/projects/:pid/resources', asyncHandler(async (req, r) => {
  ok(r, await res.createResource(callerId(req), P(req, 'pid'), parse(resourceBody, req.body ?? {})), 201);
}));
router.post('/projects/:pid/resources/preview', asyncHandler(async (req, r) => {
  const { url } = parse(z.object({ url: z.string().min(1).max(2100) }), req.body ?? {});
  ok(r, await res.previewUrl(callerId(req), P(req, 'pid'), url));
}));
router.post('/projects/:pid/resources/import', asyncHandler(async (req, r) => {
  const body = parse(z.object({
    text: z.string().min(1).max(300_000),
    format: z.enum(['auto', 'markdown', 'csv']).optional(),
    groupId: id.nullable().optional(),
    dryRun: z.boolean().optional(),
  }), req.body ?? {});
  ok(r, await res.importResources(callerId(req), P(req, 'pid'), body), body.dryRun ? 200 : 201);
}));
router.put('/projects/:pid/resources/reorder', asyncHandler(async (req, r) => {
  const body = parse(z.object({ groupId: id.nullable(), ids: z.array(id).max(2000) }), req.body ?? {});
  ok(r, await res.reorderResources(callerId(req), P(req, 'pid'), body));
}));
router.post('/projects/:pid/resources/check', asyncHandler(async (req, r) => {
  ok(r, await res.checkProjectLinks(callerId(req), P(req, 'pid')));
}));
router.get('/projects/:pid/resources/:id', asyncHandler(async (req, r) => {
  ok(r, await res.getResource(callerId(req), P(req, 'pid'), P(req, 'id')));
}));
router.patch('/projects/:pid/resources/:id', asyncHandler(async (req, r) => {
  ok(r, await res.updateResource(callerId(req), P(req, 'pid'), P(req, 'id'), parse(resourceBody.partial().strict(), req.body ?? {})));
}));
router.delete('/projects/:pid/resources/:id', asyncHandler(async (req, r) => {
  ok(r, await res.deleteResource(callerId(req), P(req, 'pid'), P(req, 'id')));
}));
router.post('/projects/:pid/resources/:id/open', asyncHandler(async (req, r) => {
  ok(r, await res.openResource(callerId(req), P(req, 'pid'), P(req, 'id')));
}));
router.post('/projects/:pid/resources/:id/refresh', asyncHandler(async (req, r) => {
  ok(r, await res.refreshResource(callerId(req), P(req, 'pid'), P(req, 'id')));
}));

// ─── Nhóm ────────────────────────────────────────────────────────

router.post('/projects/:pid/resource-groups', asyncHandler(async (req, r) => {
  ok(r, await res.createGroup(callerId(req), P(req, 'pid'), parse(groupBody, req.body ?? {})), 201);
}));
router.put('/projects/:pid/resource-groups/reorder', asyncHandler(async (req, r) => {
  const { ids } = parse(z.object({ ids: z.array(id).max(200) }), req.body ?? {});
  ok(r, await res.reorderGroups(callerId(req), P(req, 'pid'), ids));
}));
router.patch('/projects/:pid/resource-groups/:gid', asyncHandler(async (req, r) => {
  ok(r, await res.updateGroup(callerId(req), P(req, 'pid'), P(req, 'gid'), parse(groupBody.partial().strict(), req.body ?? {})));
}));
router.delete('/projects/:pid/resource-groups/:gid', asyncHandler(async (req, r) => {
  ok(r, await res.deleteGroup(callerId(req), P(req, 'pid'), P(req, 'gid')));
}));

// ─── Web links trên thẻ ──────────────────────────────────────────

router.get('/projects/:pid/issues/:num/web-links', asyncHandler(async (req, r) => {
  ok(r, await res.listWebLinks(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.post('/projects/:pid/issues/:num/web-links', asyncHandler(async (req, r) => {
  const body = parse(z.object({ resourceId: id.nullable().optional(), url: z.string().max(2100).nullable().optional(), title: z.string().max(300).nullable().optional() }).strict(), req.body ?? {});
  ok(r, await res.addWebLink(callerId(req), P(req, 'pid'), P(req, 'num'), body), 201);
}));
router.delete('/projects/:pid/issues/:num/web-links/:lid', asyncHandler(async (req, r) => {
  ok(r, await res.deleteWebLink(callerId(req), P(req, 'pid'), P(req, 'num'), P(req, 'lid')));
}));
router.post('/projects/:pid/issues/:num/web-links/:lid/save', asyncHandler(async (req, r) => {
  const body = parse(z.object({ groupId: id.nullable().optional(), tags: tags.optional() }).strict(), req.body ?? {});
  ok(r, await res.saveWebLinkToResources(callerId(req), P(req, 'pid'), P(req, 'num'), P(req, 'lid'), body));
}));

// ─── Cổng khách ──────────────────────────────────────────────────

router.get('/projects/:pid/portal/resources', asyncHandler(async (req, r) => {
  ok(r, await res.portalResources(callerId(req), P(req, 'pid'), { asClient: asClient(req) }));
}));
router.post('/projects/:pid/portal/resources/:id/open', asyncHandler(async (req, r) => {
  ok(r, await res.portalOpenResource(callerId(req), P(req, 'pid'), P(req, 'id')));
}));

export default router;
