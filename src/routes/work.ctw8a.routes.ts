/**
 * CT Work — CTW đợt 8a (12/10/2026): kết nối Microsoft 365 / Google Workspace theo NGƯỜI. Gắn vào work.routes.ts:
 *   `ctw8aPublicRoutes` TRƯỚC authenticate — chỉ callback OAuth (nhà cung cấp chuyển trình duyệt về; tin state ký HMAC +
 *   cookie gắn trình duyệt, không tin phiên). Redirect URI cố định: /api/v1/work/integrations/<provider>/callback.
 *   `router` SAU authenticate. Agent: tuyến ngoài /projects bị agentTopRouteAllowed chặn (fail-closed); tuyến
 *   /projects/:pid/cloud/** nằm trong AGENT_DENIED_ROUTES; service chặn lần nữa (assertHuman).
 *
 *   Kết nối  GET /integrations · GET /integrations/:provider/start[?returnTo=&format=json] · GET /integrations/:provider/callback
 *            DELETE /integrations/:provider[?removeEvents=1]
 *   Lịch     GET /integrations/:provider/calendars · PUT /integrations/:provider/calendar · POST /integrations/:provider/sync
 *   Tệp      GET /integrations/microsoft/files · GET /integrations/google/picker
 *   Dự án    GET|POST /projects/:pid/cloud/issues/:num/files · DELETE …/files/:id · GET /projects/:pid/cloud/files/:id/preview
 *            POST /projects/:pid/cloud/meetings/:num/online
 *            GET|POST /projects/:pid/cloud/sheets · POST /projects/:pid/cloud/sheets/:id/sync · DELETE /projects/:pid/cloud/sheets/:id
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, AppError, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import { escapeHtml, frontendUrl } from '../services/work/common.js';
import {
  completeAuthorization, disconnect, listConnections, requireProviderDef, startAuthorization, STATE_COOKIE, STATE_TTL_MS,
} from '../services/work/oauth/index.js';
import * as cal from '../services/work/cloud/calendarSync.js';
import * as cloud from '../services/work/cloud/cloud.service.js';

cal.registerCalendarSync();
cal.startCalendarJobs();

const router = Router();
export const ctw8aPublicRoutes = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}
const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ success: true, data });
function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  try {
    return schema.parse(value);
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0];
      throw new BadRequestError(`${first?.path.length ? `${first.path.join('.')}: ` : ''}${first?.message ?? 'Invalid input'}`, 'VALIDATION_ERROR');
    }
    throw err;
  }
}
const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);
const provider = (req: Request) => parse(z.string().regex(/^[a-z][a-z0-9-]{1,23}$/, 'Unknown integration'), req.params.provider);
const noAgent = (req: Request) => {
  if (req.agent) throw new AppError('AI agents cannot use a person\'s Microsoft or Google connection', 403, 'AGENT_NO_OAUTH');
};
const cookiePath = '/api/v1/work/integrations';

function readCookie(req: Request, name: string): string | undefined {
  const fromParser = (req as Request & { cookies?: Record<string, string> }).cookies?.[name];
  if (fromParser) return fromParser;
  for (const part of String(req.headers.cookie ?? '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return undefined;
}

// ═══ Callback (công khai) ═════════════════════════════════════════

ctw8aPublicRoutes.get('/integrations/:provider/callback', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.setHeader('Referrer-Policy', 'no-referrer');
  try {
    const p = provider(req);
    const out = await completeAuthorization(p, req.query as Record<string, unknown>, readCookie(req, STATE_COOKIE));
    res.clearCookie(STATE_COOKIE, { path: cookiePath });
    res.redirect(302, out.redirect);
  } catch (err) {
    const e = err instanceof AppError ? err : new AppError('Could not finish connecting', 500, 'INTEGRATION_ERROR');
    const back = frontendUrl('/work/connections');
    const body = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Connection failed · CT Work</title>
<style>body{font:15px/1.5 system-ui,sans-serif;background:#f7f7f8;color:#1f2328;display:grid;place-items:center;min-height:100vh;margin:0;padding:16px}main{max-width:440px;background:#fff;border:1px solid #d0d7de;border-radius:8px;padding:24px}a{color:#0969da}@media (prefers-color-scheme:dark){body{background:#0d1117;color:#e6edf3}main{background:#161b22;border-color:#30363d}a{color:#4493f8}}</style></head>
<body><main><h1 style="font-size:18px;margin:0 0 8px">Could not connect</h1><p>${escapeHtml(e.message)}</p><p style="color:#656d76;font-size:13px">Code: ${escapeHtml(e.code ?? 'ERROR')}</p><p><a href="${escapeHtml(back)}">Back to My connections</a></p></main></body></html>`;
    res.status(e.statusCode >= 400 && e.statusCode < 500 ? e.statusCode : 500).type('html').send(body);
  }
});

// ═══ Kết nối của tôi ══════════════════════════════════════════════

router.get('/integrations', asyncHandler(async (req, res) => { noAgent(req); ok(res, await listConnections(callerId(req))); }));

router.get('/integrations/:provider/start', asyncHandler(async (req, res) => {
  noAgent(req);
  const p = provider(req);
  requireProviderDef(p);
  const out = await startAuthorization(callerId(req), p, req.query.returnTo);
  res.cookie(STATE_COOKIE, out.nonce, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: cookiePath, maxAge: STATE_TTL_MS });
  res.setHeader('Cache-Control', 'no-store');
  if (req.query.format === 'json') { ok(res, { url: out.url, expiresAt: out.expiresAt }); return; }
  res.redirect(302, out.url);
}));

router.delete('/integrations/:provider', asyncHandler(async (req, res) => {
  noAgent(req);
  const p = provider(req);
  const removeEvents = req.query.removeEvents === '1' || req.query.removeEvents === 'true';
  ok(res, await disconnect(callerId(req), p, removeEvents ? { beforeDelete: async (cid) => { await cal.removePushedEvents(cid); } } : {}));
}));

router.get('/integrations/:provider/calendars', asyncHandler(async (req, res) => { noAgent(req); ok(res, await cal.listCalendars(callerId(req), provider(req))); }));
router.put('/integrations/:provider/calendar', asyncHandler(async (req, res) => {
  noAgent(req);
  const b = parse(z.object({
    enabled: z.boolean().optional(),
    calendarId: z.string().max(500).nullable().optional(),
    calendarName: z.string().max(200).nullable().optional(),
    syncIssues: z.boolean().optional(),
    syncMeetings: z.boolean().optional(),
    resync: z.boolean().optional(),
  }), req.body ?? {});
  ok(res, await cal.saveCalendarSettings(callerId(req), provider(req), b));
}));
router.post('/integrations/:provider/sync', asyncHandler(async (req, res) => {
  noAgent(req);
  const p = provider(req);
  cal.assertCloud(p);
  ok(res, await cal.syncConnection(callerId(req), p));
}));

router.get('/integrations/microsoft/files', asyncHandler(async (req, res) => { noAgent(req); ok(res, await cloud.browseMicrosoft(callerId(req), parse(cloud.browseInput, req.query))); }));
router.get('/integrations/google/picker', asyncHandler(async (req, res) => {
  noAgent(req);
  res.setHeader('Cache-Control', 'no-store');
  ok(res, await cloud.googlePickerConfig(callerId(req)));
}));

// ═══ Theo dự án ═══════════════════════════════════════════════════

router.get('/projects/:pid/cloud/issues/:num/files', asyncHandler(async (req, res) => ok(res, await cloud.listIssueFiles(callerId(req), P(req, 'pid'), P(req, 'num')))));
router.post('/projects/:pid/cloud/issues/:num/files', asyncHandler(async (req, res) => { noAgent(req); ok(res, await cloud.attachFile(callerId(req), P(req, 'pid'), P(req, 'num'), parse(cloud.attachInput, req.body)), 201); }));
router.delete('/projects/:pid/cloud/issues/:num/files/:id', asyncHandler(async (req, res) => ok(res, await cloud.removeFile(callerId(req), P(req, 'pid'), P(req, 'num'), P(req, 'id')))));
router.get('/projects/:pid/cloud/files/:id/preview', asyncHandler(async (req, res) => { res.setHeader('Cache-Control', 'no-store'); ok(res, await cloud.filePreview(callerId(req), P(req, 'pid'), P(req, 'id'))); }));

router.post('/projects/:pid/cloud/meetings/:num/online', asyncHandler(async (req, res) => {
  noAgent(req);
  const b = parse(z.object({ provider: cloud.providerEnum }), req.body);
  ok(res, await cloud.createOnlineMeeting(callerId(req), P(req, 'pid'), P(req, 'num'), b.provider));
}));

router.get('/projects/:pid/cloud/sheets', asyncHandler(async (req, res) => ok(res, await cloud.listSheets(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/cloud/sheets', asyncHandler(async (req, res) => { noAgent(req); ok(res, await cloud.createSheet(callerId(req), P(req, 'pid'), parse(cloud.sheetInput, req.body)), 201); }));
router.post('/projects/:pid/cloud/sheets/:id/sync', asyncHandler(async (req, res) => { noAgent(req); ok(res, await cloud.resyncSheet(callerId(req), P(req, 'pid'), P(req, 'id'))); }));
router.delete('/projects/:pid/cloud/sheets/:id', asyncHandler(async (req, res) => ok(res, await cloud.deleteSheet(callerId(req), P(req, 'pid'), P(req, 'id')))));

export default router;
