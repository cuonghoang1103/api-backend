/**
 * CT Work — thông báo ra kênh chat của nhóm (Discord / Slack / Google Chat), 25/09/2026.
 *
 * Nhóm sinh viên sống trên chat, không mở web cả ngày: thẻ mới, giao việc, xong
 * việc, bình luận mới đổ thẳng vào kênh nhóm. Zalo KHÔNG có incoming webhook công
 * khai (phải có Official Account + API riêng) nên không nằm trong danh sách.
 *
 * An toàn:
 *   • URL webhook là bí mật (ai có nó gửi được tin vào kênh) ⇒ chỉ ADMIN dự án
 *     xem/sửa; mọi chỗ trả về cho client đều che (…/xxxx).
 *   • CHỐNG SSRF: chỉ nhận https tới đúng máy chủ của dịch vụ (discord.com,
 *     hooks.slack.com, chat.googleapis.com). Không bao giờ gọi một URL tuỳ ý.
 *   • Discord: `allowed_mentions: { parse: [] }` — tiêu đề thẻ có "@everyone"
 *     không được ping cả server. Slack: thoát & < > theo quy định của Slack.
 *   • Trần 30 tin/phút/webhook: thao tác hàng loạt (nhập CSV, sửa 200 thẻ) không
 *     biến kênh chat thành bãi rác, và không bị Discord khoá webhook vì spam.
 *   • Gửi lỗi KHÔNG làm hỏng thao tác của người dùng — chỉ ghi lastError để
 *     admin thấy trong cài đặt.
 */

import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { displayName, frontendUrl, PUBLIC_USER } from './common.js';
import { onWorkEvent, type WorkEvent } from './events.js';
import { requireProject } from './permissions.js';

export const CHAT_KINDS = ['DISCORD', 'SLACK', 'GOOGLE_CHAT'] as const;
export type ChatKind = (typeof CHAT_KINDS)[number];
export const CHAT_EVENTS = ['issue.created', 'issue.assigned', 'issue.done', 'comment.created'] as const;
export type ChatEvent = (typeof CHAT_EVENTS)[number];

const HOSTS: Record<ChatKind, { hosts: string[]; path: RegExp; example: string }> = {
  DISCORD: { hosts: ['discord.com', 'discordapp.com', 'ptb.discord.com', 'canary.discord.com'], path: /^\/api\/webhooks\/\d+\/[\w-]+\/?$/, example: 'https://discord.com/api/webhooks/…' },
  SLACK: { hosts: ['hooks.slack.com'], path: /^\/services\/[\w/]+$/, example: 'https://hooks.slack.com/services/…' },
  GOOGLE_CHAT: { hosts: ['chat.googleapis.com'], path: /^\/v1\/spaces\/[\w-]+\/messages$/, example: 'https://chat.googleapis.com/v1/spaces/…/messages?key=…' },
};

/** Chỉ URL đúng dịch vụ mới được lưu — chặn SSRF từ gốc. */
export function validateHookUrl(kind: ChatKind, raw: string): string {
  let u: URL;
  try { u = new URL(raw.trim()); } catch { throw new BadRequestError('That is not a valid URL', 'WORK_BAD_HOOK_URL'); }
  const rule = HOSTS[kind];
  if (u.protocol !== 'https:' || u.username || u.password || u.port || !rule.hosts.includes(u.hostname.toLowerCase()) || !rule.path.test(u.pathname)) {
    throw new BadRequestError(`Paste the webhook URL from ${kind === 'GOOGLE_CHAT' ? 'Google Chat' : kind === 'SLACK' ? 'Slack' : 'Discord'} (${rule.example})`, 'WORK_BAD_HOOK_URL');
  }
  return u.toString();
}

const mask = (url: string) => { try { const u = new URL(url); return `${u.hostname}/…${u.pathname.slice(-4)}`; } catch { return '…'; } };
const cleanEvents = (list: unknown): ChatEvent[] => (Array.isArray(list) ? [...new Set(list.filter((e): e is ChatEvent => (CHAT_EVENTS as readonly string[]).includes(e as string)))] : []);

function view(h: { id: number; kind: string; name: string; url: string; events: unknown; enabled: boolean; lastSentAt: Date | null; lastError: string | null; createdAt: Date }) {
  return { id: h.id, kind: h.kind as ChatKind, name: h.name, urlMasked: mask(h.url), events: cleanEvents(h.events), enabled: h.enabled, lastSentAt: h.lastSentAt, lastError: h.lastError, createdAt: h.createdAt };
}

// ─── Quản lý (ADMIN dự án) ───────────────────────────────────────

export async function listHooks(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.settings');
  const rows = await prisma.workChatHook.findMany({ where: { projectId }, orderBy: { id: 'asc' } });
  return rows.map(view);
}

export async function createHook(userId: number, projectId: number, input: { kind: ChatKind; name?: string; url: string; events?: string[] }) {
  await requireProject(userId, projectId, 'project.settings');
  if ((await prisma.workChatHook.count({ where: { projectId } })) >= 10) throw new BadRequestError('A project can have up to 10 chat webhooks', 'WORK_TOO_MANY_HOOKS');
  const url = validateHookUrl(input.kind, input.url);
  const events = cleanEvents(input.events?.length ? input.events : [...CHAT_EVENTS]);
  const h = await prisma.workChatHook.create({
    data: { projectId, kind: input.kind, name: (input.name?.trim() || input.kind.replace('_', ' ')).slice(0, 80), url, events, createdById: userId },
  });
  invalidate(projectId);
  await auditProject(projectId, { actorId: userId, action: 'chat_hook.create', targetType: 'project', targetId: projectId, summary: `Added a ${input.kind} notification channel` });
  return view(h);
}

export async function updateHook(userId: number, projectId: number, hookId: number, input: { name?: string; url?: string; events?: string[]; enabled?: boolean }) {
  await requireProject(userId, projectId, 'project.settings');
  const h = await prisma.workChatHook.findFirst({ where: { id: hookId, projectId } });
  if (!h) throw new NotFoundError('Webhook not found');
  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name.trim().slice(0, 80) || h.name;
  if (input.url !== undefined && input.url.trim()) data.url = validateHookUrl(h.kind as ChatKind, input.url);
  if (input.events !== undefined) data.events = cleanEvents(input.events);
  if (input.enabled !== undefined) { data.enabled = input.enabled; if (input.enabled) data.lastError = null; }
  const saved = await prisma.workChatHook.update({ where: { id: hookId }, data });
  invalidate(projectId);
  return view(saved);
}

export async function deleteHook(userId: number, projectId: number, hookId: number) {
  await requireProject(userId, projectId, 'project.settings');
  await prisma.workChatHook.deleteMany({ where: { id: hookId, projectId } });
  invalidate(projectId);
  await auditProject(projectId, { actorId: userId, action: 'chat_hook.delete', targetType: 'project', targetId: projectId, summary: 'Removed a chat notification channel' });
  return { ok: true };
}

/** Gửi một tin thử để admin biết webhook chạy. */
export async function testHook(userId: number, projectId: number, hookId: number) {
  await requireProject(userId, projectId, 'project.settings');
  const h = await prisma.workChatHook.findFirst({ where: { id: hookId, projectId }, include: { project: { select: { key: true, name: true, workspace: { select: { slug: true } } } } } });
  if (!h) throw new NotFoundError('Webhook not found');
  const res = await deliver(h, {
    title: `CT Work is connected to ${h.project.name} (${h.project.key})`,
    text: 'You will get new issues, assignments, finished work and comments here.',
    url: frontendUrl(`/work/${h.project.workspace.slug}/${h.project.key}/board`),
    color: 0x5e6ad2, footer: 'Test message',
  }, true);
  if (!res.ok) throw new BadRequestError(`The chat service refused the message: ${res.error}`, 'WORK_HOOK_TEST_FAILED');
  return { ok: true };
}

// ─── Gửi ─────────────────────────────────────────────────────────

interface Message { title: string; text?: string; url: string; color: number; footer: string }

/** Nội dung theo định dạng từng dịch vụ. Chữ của người dùng luôn được thoát/khoá ping. */
export function formatPayload(kind: ChatKind, m: Message): unknown {
  if (kind === 'DISCORD') {
    return {
      username: 'CT Work',
      allowed_mentions: { parse: [] },
      embeds: [{ title: m.title.slice(0, 250), url: m.url, description: m.text?.slice(0, 1500) || undefined, color: m.color, footer: { text: m.footer.slice(0, 200) } }],
    };
  }
  const slackEsc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  if (kind === 'SLACK') {
    return { text: `<${m.url}|${slackEsc(m.title.slice(0, 250))}>${m.text ? `\n${slackEsc(m.text.slice(0, 1500))}` : ''}\n_${slackEsc(m.footer)}_` };
  }
  return { text: `*${m.title.slice(0, 250)}*${m.text ? `\n${m.text.slice(0, 1500)}` : ''}\n${m.url}\n_${m.footer}_` };
}

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const sent = new Map<number, number[]>();

type HookRow = { id: number; kind: string; url: string };

async function deliver(h: HookRow, m: Message, bypassLimit = false): Promise<{ ok: boolean; error?: string }> {
  const now = Date.now();
  const recent = (sent.get(h.id) ?? []).filter((t) => now - t < WINDOW_MS);
  if (!bypassLimit && recent.length >= MAX_PER_WINDOW) return { ok: false, error: 'rate limited' };
  recent.push(now);
  sent.set(h.id, recent);
  let error: string | undefined;
  try {
    const r = await fetch(h.url, {
      method: 'POST', headers: { 'content-type': 'application/json' }, redirect: 'error',
      body: JSON.stringify(formatPayload(h.kind as ChatKind, m)), signal: AbortSignal.timeout(6000),
    });
    if (!r.ok) error = `HTTP ${r.status} ${(await r.text().catch(() => '')).slice(0, 150)}`.trim();
  } catch (err) {
    error = err instanceof Error ? err.message.slice(0, 200) : 'network error';
  }
  await prisma.workChatHook.update({ where: { id: h.id }, data: error ? { lastError: error.slice(0, 300) } : { lastSentAt: new Date(), lastError: null } }).catch(() => undefined);
  if (error) logger.info('[work] chat hook lỗi', { hookId: h.id, error });
  return { ok: !error, error };
}

// Webhook của từng dự án, cache ngắn — mọi sự kiện đều hỏi, không để mỗi lần kéo thẻ là một truy vấn.
const cache = new Map<number, { at: number; hooks: Array<HookRow & { events: ChatEvent[] }> }>();
function invalidate(projectId: number) { cache.delete(projectId); }
async function hooksOf(projectId: number) {
  const c = cache.get(projectId);
  if (c && Date.now() - c.at < 30_000) return c.hooks;
  const rows = await prisma.workChatHook.findMany({ where: { projectId, enabled: true }, select: { id: true, kind: true, url: true, events: true } });
  const hooks = rows.map((r) => ({ ...r, events: cleanEvents(r.events) }));
  cache.set(projectId, { at: Date.now(), hooks });
  return hooks;
}

/** Sự kiện CT Work ⇒ (loại tin, thẻ nào). Null = không gửi. */
async function toMessage(e: WorkEvent): Promise<{ event: ChatEvent; msg: Message } | null> {
  if (!('issueId' in e)) return null;
  // Việc do hệ thống / nhập hàng loạt tạo ra không đổ vào kênh chat.
  if (e.actor.kind === 'SYSTEM') return null;
  let event: ChatEvent | null = null;
  if (e.type === 'issue.created') event = 'issue.created';
  else if (e.type === 'comment.created') event = 'comment.created';
  else if (e.type === 'issue.updated') {
    if (e.changes.some((c) => c.field === 'statusId')) event = 'issue.done'; // xác nhận DONE bên dưới
    else if (e.changes.some((c) => c.field === 'assigneeId' && c.to)) event = 'issue.assigned';
  }
  if (!event) return null;

  const issue = await prisma.workIssue.findFirst({
    where: { id: e.issueId, deletedAt: null },
    select: {
      number: true, title: true, status: { select: { name: true, category: true } }, type: { select: { name: true } },
      assignee: { select: PUBLIC_USER }, project: { select: { key: true, name: true, workspace: { select: { slug: true } } } },
    },
  });
  if (!issue) return null;
  if (event === 'issue.done' && issue.status.category !== 'DONE') {
    // Đổi trạng thái nhưng không phải sang Done: nếu cũng vừa được giao thì báo "giao việc".
    if (e.type === 'issue.updated' && e.changes.some((c) => c.field === 'assigneeId' && c.to)) event = 'issue.assigned';
    else return null;
  }
  const actor = e.actor.userId ? await prisma.user.findUnique({ where: { id: e.actor.userId }, select: PUBLIC_USER }) : null;
  const who = actor ? displayName(actor) : e.actor.kind === 'AI' ? 'AI assistant' : 'Automation';
  const key = `${issue.project.key}-${issue.number}`;
  const url = frontendUrl(`/work/${issue.project.workspace.slug}/${issue.project.key}/issue/${issue.number}`);
  const footer = `${issue.project.name} · ${issue.type.name} · ${issue.status.name}`;
  if (event === 'issue.created') return { event, msg: { title: `🆕 ${key} ${issue.title}`, text: `${who} created this${issue.assignee ? ` · assigned to ${displayName(issue.assignee)}` : ''}`, url, color: 0x5e6ad2, footer } };
  if (event === 'issue.assigned') return { event, msg: { title: `👤 ${key} ${issue.title}`, text: `${who} assigned this to ${issue.assignee ? displayName(issue.assignee) : 'someone'}`, url, color: 0x2563eb, footer } };
  if (event === 'issue.done') return { event, msg: { title: `✅ ${key} ${issue.title}`, text: `${who} moved this to ${issue.status.name}`, url, color: 0x16a34a, footer } };
  const comment = e.type === 'comment.created'
    ? await prisma.workComment.findUnique({ where: { id: e.commentId }, select: { bodyText: true } })
    : null;
  return { event, msg: { title: `💬 ${key} ${issue.title}`, text: `${who}: ${(comment?.bodyText ?? '').replace(/\s+/g, ' ').trim().slice(0, 300)}`, url, color: 0x64748b, footer } };
}

let registered = false;

/** Gọi một lần lúc khởi động (work.routes.ts). */
export function registerChatHooks(): void {
  if (registered) return;
  registered = true;
  onWorkEvent(async (e) => {
    const hooks = await hooksOf(e.projectId);
    if (!hooks.length) return;
    const m = await toMessage(e);
    if (!m) return;
    await Promise.all(hooks.filter((h) => h.events.includes(m.event)).map((h) => deliver(h, m.msg)));
  });
}
