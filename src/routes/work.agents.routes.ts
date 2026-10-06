/**
 * CT Work — AI AGENT thành viên (CTW-28, GĐ1 A2–A8). Gắn VÀO work.routes.ts (một dòng `router.use` ở cuối, sau
 * apiTokenAuth + authenticate + chốt /projects/:pid). Thiết kế: docs/ct-work-ai-agents-thiet-ke.md.
 *
 *   Quản lý (NGƯỜI — admin không gian, hoặc owner của agent; token agent bị chặn ở apiTokenAuth VÀ trong service):
 *     GET/POST  /workspaces/:wsId/agents                       · POST /workspaces/:wsId/agents/convert (bot fp_* ⇒ agent)
 *     GET/PATCH /workspaces/:wsId/agents/:agentId               · POST …/:agentId/(pause|resume|retire)
 *     GET/POST  /workspaces/:wsId/agents/:agentId/tokens        · DELETE …/tokens/:tokenId
 *     GET/POST  /workspaces/:wsId/agents/:agentId/webhooks      · PATCH/DELETE …/webhooks/:hid · POST …/webhooks/:hid/test
 *     GET       /workspaces/:wsId/agents/:agentId/inbox         (50 dòng gần nhất)
 *     GET/PUT   /projects/:pid/agent-settings                   (Done⇒Review, reviewStatusId, … — ADMIN dự án)
 *
 *   Agent (token ctw_ của agent):
 *     GET  /agents/me · GET /agents/me/leases
 *     POST /projects/:pid/issues/:num/claim { minutes? }
 *     POST /agents/me/leases/:id/heartbeat { progress?, progressPct?, extendMinutes? } · POST …/:id/release { reason? }
 *     GET  /agents/me/inbox?after=&limit=   (poll)  · GET /agents/me/events?after= (SSE, ping 20 s, 1 kết nối/token)
 *     POST /agents/me/events/ack { lastId }
 *
 * Quyền kiểm TRONG service — route chỉ kiểm đầu vào.
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, UnauthorizedError } from '../middleware/errorHandler.js';
import { AGENT_PROJECT_ROLES } from '../services/work/constants.js';
import * as agents from '../services/work/agents.service.js';
import * as webhooks from '../services/work/webhooks.service.js';
import { ackInbox, agentBus, listInbox } from '../services/work/agentEvents.js';

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

/** Tuyến /agents/me/** chỉ cho token agent. */
function meAgent(req: Request) {
  if (!req.agent) throw new AppError('This endpoint is for AI agent tokens', 403, 'WORK_NOT_AGENT');
  return req.agent;
}

// ─── Quản lý agent (người) ───────────────────────────────────────

const tokenInput = z.object({
  name: z.string().max(100).optional(),
  scopes: z.array(z.enum(['read', 'write'])).max(2).optional(),
  projectIds: z.array(id).max(50).optional(),
  expiresInDays: z.number().int().min(1).max(3650).nullable().optional(),
}).strict();

const capabilities = z.record(z.string().max(40), z.boolean()).refine((v) => Object.keys(v).length <= 30, 'Too many capabilities');

router.get('/workspaces/:wsId/agents', asyncHandler(async (req, res) => {
  ok(res, await agents.listAgents(callerId(req), P(req, 'wsId'), { includeRetired: req.query.includeRetired === '1' || req.query.includeRetired === 'true' }));
}));

router.post('/workspaces/:wsId/agents', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().min(1).max(100),
    model: z.string().min(1).max(80),
    ownerId: id.optional(),
    roleText: z.string().max(300).nullable().optional(),
    capabilities: capabilities.optional(),
    runtime: z.enum(['EXTERNAL', 'BUILTIN']).optional(),
    parallelSlots: z.number().int().min(1).max(10).optional(),
    projectIds: z.array(id).max(50).optional(),
    projectRole: z.enum(AGENT_PROJECT_ROLES).optional(),
    token: tokenInput.nullable().optional(),
  }).strict(), req.body);
  ok(res, await agents.createAgent(callerId(req), P(req, 'wsId'), body), 201);
}));

router.post('/workspaces/:wsId/agents/convert', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    userId: id, ownerId: id, model: z.string().min(1).max(80), roleText: z.string().max(300).nullable().optional(),
    token: tokenInput.nullable().optional(),
  }).strict(), req.body);
  ok(res, await agents.convertUser(callerId(req), P(req, 'wsId'), body));
}));

router.get('/workspaces/:wsId/agents/:agentId', asyncHandler(async (req, res) => {
  ok(res, await agents.getAgent(callerId(req), P(req, 'wsId'), P(req, 'agentId')));
}));

router.patch('/workspaces/:wsId/agents/:agentId', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().min(1).max(100).optional(),
    model: z.string().min(1).max(80).optional(),
    roleText: z.string().max(300).nullable().optional(),
    capabilities: capabilities.optional(),
    ownerId: id.optional(),
    parallelSlots: z.number().int().min(1).max(10).optional(),
    dailyCostCapUsd: z.number().min(0).max(10_000).nullable().optional(),
  }).strict(), req.body);
  ok(res, await agents.updateAgent(callerId(req), P(req, 'wsId'), P(req, 'agentId'), body));
}));

for (const action of ['pause', 'resume', 'retire'] as const) {
  router.post(`/workspaces/:wsId/agents/:agentId/${action}`, asyncHandler(async (req, res) => {
    ok(res, await agents.setAgentStatus(callerId(req), P(req, 'wsId'), P(req, 'agentId'), action));
  }));
}

router.get('/workspaces/:wsId/agents/:agentId/tokens', asyncHandler(async (req, res) => {
  ok(res, await agents.listAgentTokens(callerId(req), P(req, 'wsId'), P(req, 'agentId')));
}));
router.post('/workspaces/:wsId/agents/:agentId/tokens', asyncHandler(async (req, res) => {
  const body = parse(tokenInput.extend({ name: z.string().min(1).max(100) }), req.body);
  ok(res, await agents.createAgentToken(callerId(req), P(req, 'wsId'), P(req, 'agentId'), { ...body, scopes: body.scopes ?? ['read', 'write'] }), 201);
}));
router.delete('/workspaces/:wsId/agents/:agentId/tokens/:tokenId', asyncHandler(async (req, res) => {
  await agents.revokeAgentToken(callerId(req), P(req, 'wsId'), P(req, 'agentId'), P(req, 'tokenId'));
  ok(res, { revoked: true });
}));

router.get('/workspaces/:wsId/agents/:agentId/inbox', asyncHandler(async (req, res) => {
  ok(res, await agents.agentInboxForAdmin(callerId(req), P(req, 'wsId'), P(req, 'agentId')));
}));

// ─── Webhook (A8) ────────────────────────────────────────────────

const hookEvents = z.array(z.string().max(40)).max(20);
router.get('/workspaces/:wsId/agents/:agentId/webhooks', asyncHandler(async (req, res) => {
  ok(res, await webhooks.listWebhooks(callerId(req), P(req, 'wsId'), P(req, 'agentId')));
}));
router.post('/workspaces/:wsId/agents/:agentId/webhooks', asyncHandler(async (req, res) => {
  const body = parse(z.object({ url: z.string().min(1).max(600), events: hookEvents.optional() }).strict(), req.body);
  ok(res, await webhooks.createWebhook(callerId(req), P(req, 'wsId'), P(req, 'agentId'), body), 201);
}));
router.patch('/workspaces/:wsId/agents/:agentId/webhooks/:hid', asyncHandler(async (req, res) => {
  const body = parse(z.object({ url: z.string().min(1).max(600).optional(), events: hookEvents.optional(), enabled: z.boolean().optional() }).strict(), req.body);
  ok(res, await webhooks.updateWebhook(callerId(req), P(req, 'wsId'), P(req, 'agentId'), P(req, 'hid'), body));
}));
router.delete('/workspaces/:wsId/agents/:agentId/webhooks/:hid', asyncHandler(async (req, res) => {
  await webhooks.deleteWebhook(callerId(req), P(req, 'wsId'), P(req, 'agentId'), P(req, 'hid'));
  ok(res, { deleted: true });
}));
router.post('/workspaces/:wsId/agents/:agentId/webhooks/:hid/test', asyncHandler(async (req, res) => {
  ok(res, await webhooks.testWebhook(callerId(req), P(req, 'wsId'), P(req, 'agentId'), P(req, 'hid')));
}));

// ─── Cài đặt agent của dự án (A5) ────────────────────────────────

router.get('/projects/:pid/agent-settings', asyncHandler(async (req, res) => {
  ok(res, await agents.getAgentSettings(callerId(req), P(req, 'pid')));
}));
router.put('/projects/:pid/agent-settings', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    doneToReview: z.boolean().optional(),
    reviewStatusId: id.nullable().optional(),
    allowCreateIssues: z.boolean().optional(),
    allowSelfAssign: z.boolean().optional(),
    maxOpenLeases: z.number().int().min(1).max(20).optional(),
    leaseMinutes: z.number().int().min(5).max(240).optional(),
    reviewerIds: z.array(id).max(10).optional(),
  }).strict(), req.body);
  ok(res, await agents.updateAgentSettings(callerId(req), P(req, 'pid'), body));
}));

// ─── Agent tự làm việc (token agent) ─────────────────────────────

router.post('/projects/:pid/issues/:num/claim', asyncHandler(async (req, res) => {
  const body = parse(z.object({ minutes: z.number().int().min(5).max(240).optional() }).strict(), req.body ?? {});
  ok(res, await agents.claimIssue(callerId(req), P(req, 'pid'), P(req, 'num'), body), 201);
}));

router.get('/agents/me', asyncHandler(async (req, res) => {
  meAgent(req);
  ok(res, await agents.whoAmI(callerId(req), req.workToken?.id));
}));

router.get('/agents/me/leases', asyncHandler(async (req, res) => {
  meAgent(req);
  ok(res, await agents.myLeases(callerId(req)));
}));

router.post('/agents/me/leases/:id/heartbeat', asyncHandler(async (req, res) => {
  meAgent(req);
  const body = parse(z.object({
    progress: z.string().max(300).nullable().optional(),
    progressPct: z.number().int().min(0).max(100).nullable().optional(),
    extendMinutes: z.number().int().min(5).max(240).optional(),
  }).strict(), req.body ?? {});
  ok(res, await agents.heartbeat(callerId(req), P(req, 'id'), body));
}));

router.post('/agents/me/leases/:id/release', asyncHandler(async (req, res) => {
  meAgent(req);
  const body = parse(z.object({ reason: z.string().max(300).nullable().optional() }).strict(), req.body ?? {});
  ok(res, await agents.releaseLease(callerId(req), P(req, 'id'), body));
}));

const afterQ = z.object({ after: z.coerce.number().int().min(0).optional(), limit: z.coerce.number().int().min(1).max(200).optional() });

router.get('/agents/me/inbox', asyncHandler(async (req, res) => {
  const ag = meAgent(req);
  const q = parse(afterQ, req.query);
  ok(res, await listInbox(ag.id, { ...q, projectIds: ag.projectIds }));
}));

router.post('/agents/me/events/ack', asyncHandler(async (req, res) => {
  const ag = meAgent(req);
  const { lastId } = parse(z.object({ lastId: z.number().int().min(0) }).strict(), req.body);
  ok(res, await ackInbox(ag.id, lastId));
}));

/** Một kết nối SSE mỗi token — kết nối mới đuổi kết nối cũ. */
const sseByToken = new Map<number, () => void>();

router.get('/agents/me/events', asyncHandler(async (req, res) => {
  const ag = meAgent(req);
  const { after } = parse(afterQ, req.query);
  const lastEventId = Number(req.headers['last-event-id']);
  let cursor = Number.isInteger(lastEventId) && lastEventId > 0 ? lastEventId : (after ?? 0);
  const tokenId = req.workToken?.id ?? 0;
  sseByToken.get(tokenId)?.();

  res.status(200).set({
    'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', Connection: 'keep-alive', 'X-Accel-Buffering': 'no',
  });
  res.flushHeaders?.();
  const send = (row: { id: number; type: string; projectId: number; payload: unknown }) => {
    if (row.id <= cursor) return;
    if (ag.projectIds && !ag.projectIds.includes(row.projectId)) return;
    cursor = row.id;
    res.write(`id: ${row.id}\nevent: ${row.type}\ndata: ${JSON.stringify({ id: row.id, ...(row.payload as Record<string, unknown>) })}\n\n`);
  };
  // Đăng ký TRƯỚC khi đọc backlog — sự kiện chen giữa không rơi (cursor chặn trùng).
  const onRow = (row: { id: number; type: string; projectId: number; payload: unknown }) => send(row);
  agentBus.on(`agent:${ag.id}`, onRow);
  const ping = setInterval(() => res.write(': ping\n\n'), 20_000);
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    clearInterval(ping);
    agentBus.off(`agent:${ag.id}`, onRow);
    if (sseByToken.get(tokenId) === close) sseByToken.delete(tokenId);
    res.end();
  };
  sseByToken.set(tokenId, close);
  req.on('close', close);
  res.write('retry: 5000\n\n');
  for (;;) {
    const page = await listInbox(ag.id, { after: cursor, limit: 200, projectIds: ag.projectIds });
    for (const r of page.events) send(r);
    if (page.events.length < 200 || closed) break;
  }
}));

export default router;
