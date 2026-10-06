/**
 * CT Work — webhook RA NGOÀI cho AI agent (CTW-28 §4.5, việc A8).
 *
 *   POST <url>  Content-Type: application/json
 *     X-CTWork-Event:     issue.assigned | comment.mention | … | ping
 *     X-CTWork-Delivery:  <id dòng work_agent_inbox>   (ping: "ping-<ms>")
 *     X-CTWork-Timestamp: <giây epoch>
 *     X-CTWork-Signature: sha256=<hex HMAC-SHA256(secret, timestamp + "." + body)>
 *
 * Bên nhận: tính lại HMAC trên ĐÚNG chuỗi body nhận được, so thời gian hằng, và từ chối timestamp lệch > 5 phút
 * (chống phát lại). Body KHÔNG mang mô tả/bình luận — chỉ khoá thẻ + tóm tắt; agent gọi API để đọc.
 *
 * Gửi: dispatcher 5 s/lần (agents.startAgentJobs) lấy inbox `delivery = PENDING`, tới hạn `nextTryAt`. Lỗi ⇒ thử lại
 * sau 1 m / 5 m / 30 m / 2 h; lần lỗi thứ 5 ⇒ FAILED. Một webhook có 20 lần FAILED liên tiếp ⇒ tự tắt + báo owner.
 *
 * CHỐNG SSRF: chỉ https, cổng 443, không user:pass trong URL; tên miền phải trỏ TOÀN BỘ về IP công khai (kiểm lúc
 * tạo VÀ mỗi lần gửi); không theo redirect (3xx = lỗi). Luật IP dùng chung resourceRules.blockedAddress.
 * "Test" chỉ gửi `{type:"ping"}` — KHÔNG gửi sự kiện thật (bài học CTW-7).
 */

import crypto from 'node:crypto';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { audit } from './audit.js';
import { AGENT_INBOX_TYPES } from './constants.js';
import { loadWorkspaceAccess, agentForbidden } from './permissions.js';
import { blockedAddress, blockedHostname } from './resourceRules.js';

export const WEBHOOK_EVENTS = AGENT_INBOX_TYPES;
const MAX_WEBHOOKS_PER_AGENT = 5;
/** Chờ trước lần thử thứ 2, 3, 4, 5. Lần lỗi thứ MAX_ATTEMPTS ⇒ FAILED. */
const BACKOFF_MS = [60_000, 5 * 60_000, 30 * 60_000, 2 * 3600_000];
export const MAX_ATTEMPTS = 5;
export const AUTO_DISABLE_AFTER = 20;
const TIMEOUT_MS = 10_000;

// ─── Mạng (thay được trong test) ─────────────────────────────────

interface NetHooks {
  fetch?: (url: string, init: RequestInit) => Promise<Response>;
  lookup?: (host: string) => Promise<Array<{ address: string }>>;
}
let net: NetHooks = {};
/** Test: máy test không có mạng ngoài, và server test ở 127.0.0.1 — bị chặn đúng luật. */
export function _setWebhookNetForTests(h: NetHooks | null): void { net = h ?? {}; }

/** Kiểm cú pháp URL (hàm thuần — test bằng bảng). Trả URL chuẩn hoá hoặc ném 400. */
export function parseWebhookUrl(raw: string): URL {
  let u: URL;
  try { u = new URL(raw.trim()); } catch { throw new BadRequestError('Enter a valid https URL', 'WORK_WEBHOOK_URL'); }
  if (u.protocol !== 'https:') throw new BadRequestError('Webhook URLs must use https', 'WORK_WEBHOOK_URL');
  if (u.port && u.port !== '443') throw new BadRequestError('Webhook URLs must use the default https port (443)', 'WORK_WEBHOOK_URL');
  if (u.username || u.password) throw new BadRequestError('Do not put credentials in the webhook URL', 'WORK_WEBHOOK_URL');
  const host = u.hostname.replace(/^\[|\]$/g, '');
  if (blockedHostname(host) || (isIP(host) && blockedAddress(host))) {
    throw new BadRequestError('Webhook URLs cannot point to internal or private addresses', 'WORK_WEBHOOK_URL');
  }
  if (raw.length > 600) throw new BadRequestError('Webhook URL is too long', 'WORK_WEBHOOK_URL');
  u.hash = '';
  return u;
}

/** Mọi IP của tên miền phải công khai. Ném AppError 400 (lúc tạo) — dispatcher bắt và ghi lỗi. */
async function assertPublicTarget(u: URL): Promise<void> {
  const host = u.hostname.replace(/^\[|\]$/g, '');
  if (isIP(host)) return; // đã kiểm ở parseWebhookUrl
  let addrs: Array<{ address: string }>;
  try {
    addrs = net.lookup ? await net.lookup(host) : await lookup(host, { all: true });
  } catch {
    throw new BadRequestError(`The domain ${host} does not resolve`, 'WORK_WEBHOOK_URL');
  }
  if (!addrs.length) throw new BadRequestError(`The domain ${host} does not resolve`, 'WORK_WEBHOOK_URL');
  if (addrs.some((a) => blockedAddress(a.address))) throw new BadRequestError('This domain points to an internal address', 'WORK_WEBHOOK_URL');
}

// ─── Chữ ký ──────────────────────────────────────────────────────

export function signWebhook(secret: string, timestamp: string, body: string): string {
  return `sha256=${crypto.createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex')}`;
}

/** Cho bên nhận (và test): kiểm chữ ký + độ lệch thời gian. */
export function verifyWebhook(secret: string, headers: { signature: string; timestamp: string }, body: string, nowSec = Math.floor(Date.now() / 1000), toleranceSec = 300): boolean {
  const ts = Number(headers.timestamp);
  if (!Number.isFinite(ts) || Math.abs(nowSec - ts) > toleranceSec) return false;
  const want = Buffer.from(signWebhook(secret, headers.timestamp, body));
  const got = Buffer.from(headers.signature);
  return want.length === got.length && crypto.timingSafeEqual(want, got);
}

async function post(url: string, secret: string, event: string, deliveryId: string, payload: unknown): Promise<{ ok: boolean; status?: number; error?: string }> {
  let u: URL;
  try {
    u = parseWebhookUrl(url);
    await assertPublicTarget(u);
  } catch (err) {
    return { ok: false, error: (err as Error).message.slice(0, 200) };
  }
  const body = JSON.stringify(payload);
  const ts = String(Math.floor(Date.now() / 1000));
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const init: RequestInit = {
      method: 'POST', redirect: 'manual', signal: ctl.signal, body,
      headers: {
        'Content-Type': 'application/json', 'User-Agent': 'CTWork-Webhook/1.0',
        'X-CTWork-Event': event, 'X-CTWork-Delivery': deliveryId, 'X-CTWork-Timestamp': ts,
        'X-CTWork-Signature': signWebhook(secret, ts, body),
      },
    };
    const res = net.fetch ? await net.fetch(u.toString(), init) : await fetch(u.toString(), init);
    void res.body?.cancel().catch(() => undefined);
    if (res.status >= 200 && res.status < 300) return { ok: true, status: res.status };
    return { ok: false, status: res.status, error: res.status >= 300 && res.status < 400 ? `Redirects are not followed (HTTP ${res.status})` : `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, error: (err as Error).name === 'AbortError' ? 'Timed out after 10 s' : 'Could not reach the URL' };
  } finally {
    clearTimeout(timer);
  }
}

// ─── CRUD (admin không gian hoặc owner của agent) ────────────────

async function manageableAgent(callerId: number, workspaceId: number, agentId: number) {
  const a = await loadWorkspaceAccess(callerId, workspaceId);
  if (!a) throw new NotFoundError('Workspace not found');
  if (a.principal === 'AGENT') throw await agentForbidden(callerId, 'manage webhooks');
  const agent = await prisma.workAgent.findFirst({ where: { id: agentId, workspaceId }, select: { id: true, ownerId: true, status: true, user: { select: { username: true } } } });
  if (!agent) throw new NotFoundError('Agent not found');
  if (a.role !== 'OWNER' && a.role !== 'ADMIN' && agent.ownerId !== callerId) throw new ForbiddenError("Only the agent's owner or a workspace admin can do this");
  return agent;
}

const mask = (secret: string) => `${secret.slice(0, 6)}…${secret.slice(-4)}`;

const HOOK_SELECT = { id: true, url: true, secret: true, events: true, enabled: true, lastSentAt: true, lastError: true, failCount: true, createdAt: true } satisfies Prisma.WorkWebhookSelect;
type HookRow = Prisma.WorkWebhookGetPayload<{ select: typeof HOOK_SELECT }>;
const view = (h: HookRow) => ({ ...h, secret: mask(h.secret) });

function cleanEvents(events: string[] | undefined): string[] {
  const list = [...new Set(events ?? [])];
  const bad = list.filter((e) => !(WEBHOOK_EVENTS as readonly string[]).includes(e));
  if (bad.length) throw new BadRequestError(`Unknown event(s): ${bad.join(', ')}`, 'WORK_WEBHOOK_EVENTS');
  return list;
}

export async function listWebhooks(callerId: number, workspaceId: number, agentId: number) {
  await manageableAgent(callerId, workspaceId, agentId);
  const rows = await prisma.workWebhook.findMany({ where: { agentId }, orderBy: { id: 'asc' }, select: HOOK_SELECT });
  return rows.map(view);
}

/** Tạo — trả `secret` NGUYÊN VĂN đúng một lần (để bên nhận kiểm chữ ký). */
export async function createWebhook(callerId: number, workspaceId: number, agentId: number, input: { url: string; events?: string[] }) {
  const agent = await manageableAgent(callerId, workspaceId, agentId);
  if (agent.status === 'RETIRED') throw new BadRequestError('This agent is retired', 'WORK_AGENT_RETIRED');
  const u = parseWebhookUrl(input.url);
  await assertPublicTarget(u);
  const events = cleanEvents(input.events);
  if ((await prisma.workWebhook.count({ where: { agentId } })) >= MAX_WEBHOOKS_PER_AGENT) {
    throw new BadRequestError(`An agent can have at most ${MAX_WEBHOOKS_PER_AGENT} webhooks`, 'WORK_LIMIT');
  }
  const secret = `whsec_${crypto.randomBytes(24).toString('base64url')}`;
  const row = await prisma.workWebhook.create({
    data: { workspaceId, agentId, url: u.toString(), secret, events, createdById: callerId },
    select: HOOK_SELECT,
  });
  await audit({ workspaceId, actorId: callerId, action: 'agent.webhook.create', targetType: 'agent', targetId: agentId, summary: `Added a webhook for @${agent.user.username} → ${u.host}`, detail: { webhookId: row.id, events } });
  return { ...view(row), secret };
}

export async function updateWebhook(callerId: number, workspaceId: number, agentId: number, webhookId: number, input: { url?: string; events?: string[]; enabled?: boolean }) {
  const agent = await manageableAgent(callerId, workspaceId, agentId);
  const cur = await prisma.workWebhook.findFirst({ where: { id: webhookId, agentId }, select: { id: true } });
  if (!cur) throw new NotFoundError('Webhook not found');
  const data: Prisma.WorkWebhookUpdateInput = {};
  if (input.url !== undefined) {
    const u = parseWebhookUrl(input.url);
    await assertPublicTarget(u);
    data.url = u.toString();
  }
  if (input.events !== undefined) data.events = cleanEvents(input.events);
  if (input.enabled !== undefined) {
    data.enabled = input.enabled;
    if (input.enabled) { data.failCount = 0; data.lastError = null; }
  }
  const row = await prisma.workWebhook.update({ where: { id: webhookId }, data, select: HOOK_SELECT });
  await audit({ workspaceId, actorId: callerId, action: 'agent.webhook.update', targetType: 'agent', targetId: agentId, summary: `Updated a webhook of @${agent.user.username}`, detail: { webhookId, ...input, url: input.url ? '(changed)' : undefined } });
  return view(row);
}

export async function deleteWebhook(callerId: number, workspaceId: number, agentId: number, webhookId: number) {
  const agent = await manageableAgent(callerId, workspaceId, agentId);
  const r = await prisma.workWebhook.deleteMany({ where: { id: webhookId, agentId } });
  if (!r.count) throw new NotFoundError('Webhook not found');
  await audit({ workspaceId, actorId: callerId, action: 'agent.webhook.delete', targetType: 'agent', targetId: agentId, summary: `Removed a webhook of @${agent.user.username}`, detail: { webhookId } });
}

/** Gửi `{type:"ping"}` ký đúng như sự kiện thật — KHÔNG đụng hộp thư, không gửi sự kiện thật. */
export async function testWebhook(callerId: number, workspaceId: number, agentId: number, webhookId: number) {
  const agent = await manageableAgent(callerId, workspaceId, agentId);
  const h = await prisma.workWebhook.findFirst({ where: { id: webhookId, agentId }, select: { url: true, secret: true } });
  if (!h) throw new NotFoundError('Webhook not found');
  const at = new Date();
  const r = await post(h.url, h.secret, 'ping', `ping-${at.getTime()}`, { type: 'ping', agent: { username: agent.user.username }, at: at.toISOString() });
  return r;
}

// ─── Dispatcher ──────────────────────────────────────────────────

let running = false;

/** Một lượt gửi: lấy dòng inbox PENDING tới hạn, gửi tới mọi webhook bật của agent có nghe loại đó. */
export async function dispatchWebhooks(now = new Date(), limit = 100): Promise<{ sent: number; failed: number; retried: number; skipped: number }> {
  const out = { sent: 0, failed: 0, retried: 0, skipped: 0 };
  if (running) return out;
  running = true;
  try {
    const rows = await prisma.workAgentInbox.findMany({
      where: { delivery: 'PENDING', OR: [{ nextTryAt: null }, { nextTryAt: { lte: now } }] },
      orderBy: { id: 'asc' },
      take: limit,
      select: { id: true, agentId: true, type: true, payload: true, attempts: true },
    });
    const hooksBy = new Map<number, Array<{ id: number; url: string; secret: string; events: unknown; failCount: number }>>();
    for (const r of rows) {
      if (!hooksBy.has(r.agentId)) {
        hooksBy.set(r.agentId, await prisma.workWebhook.findMany({ where: { agentId: r.agentId, enabled: true }, select: { id: true, url: true, secret: true, events: true, failCount: true } }));
      }
      const hooks = hooksBy.get(r.agentId)!.filter((h) => !Array.isArray(h.events) || !(h.events as unknown[]).length || (h.events as unknown[]).includes(r.type));
      if (!hooks.length) {
        await prisma.workAgentInbox.update({ where: { id: r.id }, data: { delivery: 'SKIPPED', nextTryAt: null } });
        out.skipped += 1;
        continue;
      }
      const results = await Promise.all(hooks.map(async (h) => ({ h, r: await post(h.url, h.secret, r.type, String(r.id), { id: r.id, ...(r.payload as Record<string, unknown>) }) })));
      const attempts = r.attempts + 1;
      for (const { h, r: res } of results) {
        if (res.ok) await prisma.workWebhook.update({ where: { id: h.id }, data: { lastSentAt: now, lastError: null, failCount: 0 } });
        else await prisma.workWebhook.update({ where: { id: h.id }, data: { lastError: (res.error ?? 'Failed').slice(0, 300) } });
      }
      const failedHooks = results.filter((x) => !x.r.ok).map((x) => x.h);
      if (!failedHooks.length) {
        await prisma.workAgentInbox.update({ where: { id: r.id }, data: { delivery: 'SENT', attempts, nextTryAt: null } });
        out.sent += 1;
      } else if (attempts >= MAX_ATTEMPTS) {
        await prisma.workAgentInbox.update({ where: { id: r.id }, data: { delivery: 'FAILED', attempts, nextTryAt: null } });
        out.failed += 1;
        for (const h of failedHooks) await countFailure(h.id, r.agentId);
      } else {
        await prisma.workAgentInbox.update({ where: { id: r.id }, data: { attempts, nextTryAt: new Date(now.getTime() + BACKOFF_MS[attempts - 1]) } });
        out.retried += 1;
      }
    }
  } finally {
    running = false;
  }
  return out;
}

/** Một lần FAILED (hết lượt thử) của một webhook. Đủ AUTO_DISABLE_AFTER lần liên tiếp ⇒ tắt + báo owner. */
async function countFailure(webhookId: number, agentId: number) {
  const h = await prisma.workWebhook.update({ where: { id: webhookId }, data: { failCount: { increment: 1 } }, select: { failCount: true, enabled: true, url: true, workspaceId: true } });
  if (h.failCount < AUTO_DISABLE_AFTER || !h.enabled) return;
  await prisma.workWebhook.update({ where: { id: webhookId }, data: { enabled: false } });
  const agent = await prisma.workAgent.findUnique({ where: { id: agentId }, select: { userId: true, ownerId: true, user: { select: { username: true } } } });
  if (!agent) return;
  let host = h.url;
  try { host = new URL(h.url).host; } catch { /* giữ nguyên */ }
  await audit({ workspaceId: h.workspaceId, actorId: null, action: 'agent.webhook.disabled', targetType: 'agent', targetId: agentId, summary: `Turned off a webhook of @${agent.user.username} (${host}) after ${AUTO_DISABLE_AFTER} failed deliveries in a row`, detail: { webhookId } });
  try {
    const ws = await prisma.workSpace.findUnique({ where: { id: h.workspaceId }, select: { slug: true } });
    const { notifyWork } = await import('./notify.js');
    await notifyWork({
      receiverId: agent.ownerId, senderId: agent.userId, type: 'WORK_ALERT', entityId: agentId,
      payload: { issueKey: `🤖 @${agent.user.username}`, title: 'Webhook turned off', message: `webhook to ${host} was turned off after ${AUTO_DISABLE_AFTER} failed deliveries`, url: ws ? `/work/${ws.slug}/agents/${agentId}` : '/work' },
    });
  } catch (err) {
    logger.warn('[work] webhook: báo owner lỗi', { err: (err as Error).message });
  }
}

