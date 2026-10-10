/**
 * CT Work — CTW đợt 8b: SLACK. Luật thuần (chữ ký v0, lệnh, Block Kit, unfurl) ở slackRules.ts.
 *
 *   Cài app   — OAuth v2 qua khung 8a (nhà cung cấp "slack", ctw8bProviders.ts): người OWNER/ADMIN không gian bấm "Add to
 *               Slack" ⇒ kết nối OAuth của CHÍNH họ giữ token bot ⇒ `linkInstall` nối không gian CT Work ↔ workspace Slack đó
 *               (work_slack_installs). Không có bảng token thứ hai.
 *   Kênh      — ADMIN dự án chọn kênh Slack (conversations.list) + sự kiện muốn nhận; kênh đó cũng nhận `/ctwork new`.
 *   Thông báo — nghe onWorkEvent, dựng tin bằng CÙNG hàm với webhook chat (chatHooks.toMessage) ⇒ chat.postMessage.
 *               Trần 30 tin/phút/kênh; gửi hỏng không làm hỏng thao tác của người dùng (chỉ ghi lastError).
 *   /ctwork   — POST /api/v1/work/intake/slack/commands (thân RAW — index.ts đã gắn express.raw cho /intake): kiểm chữ ký
 *               (CTW_SLACK_SIGNING_SECRET, lệch > 5 phút ⇒ 401), nonce chống phát lại (work_ext_nonces ⇒ 409), rồi tạo
 *               ĐỀ XUẤT chờ duyệt (work_intake_proposals, source SLACK) — không bao giờ tạo thẻ thẳng (như Discord của 7b).
 *   Unfurl    — POST /api/v1/work/intake/slack/events: url_verification + link_shared ⇒ chat.unfurl cho link thẻ của không
 *               gian ĐÃ nối với workspace Slack đó (link thẻ của không gian khác ⇒ bỏ qua, không lộ).
 *
 * Test: `_setOAuthFetchForTests` của 8a (mọi lời gọi Slack đi qua oauthFetch) — không gọi Slack thật.
 */

import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { displayName, frontendUrl, PUBLIC_USER } from './common.js';
import { emitWorkEvent, onWorkEvent } from './events.js';
import { liveConnection, oauthFetch, providerClient, getProvider } from './oauth/index.js';
import { registerCtw8bProviders, SLACK_API } from './ctw8bProviders.js';
import { requireProject, requireWorkspace } from './permissions.js';
import {
  cleanSlackEvents, issueUnfurl, parseForm, parseIssueLink, parseSlash, SLACK_CHANNEL_RE, SLACK_EVENTS, SLASH_USAGE, slackNoticeBlocks, verifySlack,
  type SlackEvent, type SlackNotice,
} from './slackRules.js';

registerCtw8bProviders();

const PRIORITY = ['', 'Highest', 'High', 'Medium', 'Low', 'Lowest'];

// ─── Gọi Slack API (luôn qua oauthFetch của 8a ⇒ test thay được) ─

export class SlackApiError extends Error {}

async function slackCall<T = Record<string, unknown>>(token: string, method: string, body: Record<string, unknown> | URLSearchParams, http: 'POST' | 'GET' = 'POST'): Promise<T> {
  const isForm = body instanceof URLSearchParams;
  const url = http === 'GET' ? `${SLACK_API}/${method}?${(isForm ? body : new URLSearchParams(Object.entries(body).map(([k, v]) => [k, String(v)]))).toString()}` : `${SLACK_API}/${method}`;
  const res = await oauthFetch(url, http === 'GET'
    ? { method: 'GET', headers: { Authorization: `Bearer ${token}` } }
    : { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': isForm ? 'application/x-www-form-urlencoded' : 'application/json; charset=utf-8' }, body: isForm ? body.toString() : JSON.stringify(body) });
  const j = (await res.json().catch(() => ({ ok: false, error: `http_${res.status}` }))) as { ok?: boolean; error?: string } & T;
  // Slack trả HTTP 200 kèm { ok: false, error } ⇒ phải đọc `ok`.
  if (!res.ok || !j.ok) throw new SlackApiError(String(j.error ?? `http_${res.status}`).slice(0, 120));
  return j;
}

/** Token bot của không gian: kết nối OAuth "slack" của người đã cài. */
async function botToken(install: { installedById: number }): Promise<string> {
  const c = await liveConnection(install.installedById, 'slack');
  return c.accessToken;
}

export function slackConfigured() {
  registerCtw8bProviders();
  return { oauth: !!providerClient(getProvider('slack')!), signing: !!(process.env.CTW_SLACK_SIGNING_SECRET ?? '').trim() };
}

// ─── Cài app cho không gian ──────────────────────────────────────

export async function workspaceStatus(userId: number, workspaceId: number) {
  const role = await requireWorkspace(userId, workspaceId, 'workspace.view');
  const install = await prisma.workSlackInstall.findUnique({ where: { workspaceId } });
  const mine = await prisma.workOAuthConnection.findUnique({ where: { userId_provider: { userId, provider: 'slack' } }, select: { accountId: true, accountName: true, status: true } });
  const by = install ? await prisma.user.findUnique({ where: { id: install.installedById }, select: PUBLIC_USER }) : null;
  return {
    configured: slackConfigured(),
    canManage: role === 'OWNER' || role === 'ADMIN',
    install: install ? { teamId: install.teamId, teamName: install.teamName, installedBy: by ? displayName(by) : null, createdAt: install.createdAt } : null,
    myConnection: mine ? { teamId: mine.accountId, teamName: mine.accountName, status: mine.status } : null,
    commandUrl: frontendUrl('/api/v1/work/intake/slack/commands'),
    eventsUrl: frontendUrl('/api/v1/work/intake/slack/events'),
  };
}

/** Sau khi người dùng đã "Add to Slack" (kết nối OAuth), nối không gian này với workspace Slack đó. */
export async function linkInstall(userId: number, workspaceId: number) {
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  const c = await prisma.workOAuthConnection.findUnique({ where: { userId_provider: { userId, provider: 'slack' } } });
  if (!c || c.status !== 'ACTIVE' || !c.accountId) throw new AppError('Add CT Work to Slack first', 409, 'INTEGRATION_NOT_CONNECTED');
  const data = { connectionId: c.id, installedById: userId, teamId: c.accountId.slice(0, 32), teamName: (c.accountName ?? 'Slack').slice(0, 160) };
  const prev = await prisma.workSlackInstall.findUnique({ where: { workspaceId } });
  // Đổi sang workspace Slack KHÁC ⇒ kênh cũ trỏ vào workspace cũ: bỏ hết.
  if (prev && prev.teamId !== data.teamId) await prisma.workSlackChannel.deleteMany({ where: { installId: prev.id } });
  const row = await prisma.workSlackInstall.upsert({ where: { workspaceId }, create: { workspaceId, ...data }, update: data });
  return { teamId: row.teamId, teamName: row.teamName };
}

export async function unlinkInstall(userId: number, workspaceId: number) {
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  await prisma.workSlackInstall.deleteMany({ where: { workspaceId } });
  return { ok: true };
}

// ─── Kênh của dự án ──────────────────────────────────────────────

async function projectInstall(projectId: number) {
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { workspaceId: true } });
  return prisma.workSlackInstall.findUnique({ where: { workspaceId: p.workspaceId } });
}

async function adminCtx(userId: number, projectId: number) {
  const a = await requireProject(userId, projectId, 'project.settings');
  if (a.principal === 'AGENT') throw new ForbiddenError('Only a person can configure Slack');
  return a;
}

const channelView = (c: { id: number; channelId: string; channelName: string; events: unknown; intake: boolean; enabled: boolean; lastSentAt: Date | null; lastError: string | null; createdAt: Date }) => ({
  id: c.id, channelId: c.channelId, channelName: c.channelName, events: cleanSlackEvents(c.events), intake: c.intake, enabled: c.enabled,
  lastSentAt: c.lastSentAt, lastError: c.lastError, createdAt: c.createdAt,
});

export async function projectSlack(userId: number, projectId: number) {
  const a = await requireProject(userId, projectId, 'project.view');
  if (a.role === 'CLIENT') throw new ForbiddenError('Only the project team can see Slack settings');
  const install = await projectInstall(projectId);
  const rows = install ? await prisma.workSlackChannel.findMany({ where: { projectId, installId: install.id }, orderBy: { id: 'asc' } }) : [];
  return {
    configured: slackConfigured(), install: install ? { teamName: install.teamName } : null,
    canManage: a.role === 'ADMIN' && a.principal !== 'AGENT', events: SLACK_EVENTS, channels: rows.map(channelView),
  };
}

/** Kênh Slack bot thấy được (để chọn). */
export async function availableChannels(userId: number, projectId: number) {
  await adminCtx(userId, projectId);
  const install = await projectInstall(projectId);
  if (!install) throw new AppError('Connect Slack to this workspace first', 409, 'INTEGRATION_NOT_CONNECTED');
  const token = await botToken(install);
  try {
    const r = await slackCall<{ channels?: Array<{ id: string; name: string; is_private?: boolean; is_member?: boolean; is_archived?: boolean }> }>(token, 'conversations.list', { types: 'public_channel,private_channel', exclude_archived: 'true', limit: '500' }, 'GET');
    return (r.channels ?? []).filter((c) => !c.is_archived).map((c) => ({ id: c.id, name: c.name, private: !!c.is_private, member: !!c.is_member }));
  } catch (err) {
    throw new AppError(`Slack refused the request: ${(err as Error).message}`, 502, 'INTEGRATION_ERROR');
  }
}

export const channelInput = z.object({
  channelId: z.string().regex(SLACK_CHANNEL_RE, 'Pick a Slack channel'),
  channelName: z.string().trim().min(1).max(160),
  events: z.array(z.enum(SLACK_EVENTS)).max(SLACK_EVENTS.length).default(['issue.created', 'issue.done']),
  intake: z.boolean().default(true),
  enabled: z.boolean().default(true),
});

export async function addChannel(userId: number, projectId: number, input: z.infer<typeof channelInput>) {
  await adminCtx(userId, projectId);
  const install = await projectInstall(projectId);
  if (!install) throw new AppError('Connect Slack to this workspace first', 409, 'INTEGRATION_NOT_CONNECTED');
  if ((await prisma.workSlackChannel.count({ where: { projectId } })) >= 10) throw new BadRequestError('A project can post to up to 10 Slack channels', 'WORK_LIMIT');
  try {
    const row = await prisma.workSlackChannel.create({ data: { projectId, installId: install.id, channelId: input.channelId, channelName: input.channelName.replace(/^#/, ''), events: input.events, intake: input.intake, enabled: input.enabled, createdById: userId } });
    invalidate(projectId);
    await auditProject(projectId, { actorId: userId, action: 'slack.channel_add', targetType: 'project', targetId: projectId, summary: `Connected Slack channel #${row.channelName}` });
    return channelView(row);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new ConflictError('This channel is already connected');
    throw err;
  }
}

export async function updateChannel(userId: number, projectId: number, id: number, input: Partial<Pick<z.infer<typeof channelInput>, 'events' | 'intake' | 'enabled'>>) {
  await adminCtx(userId, projectId);
  const c = await prisma.workSlackChannel.findFirst({ where: { id, projectId } });
  if (!c) throw new NotFoundError('Channel not found');
  const row = await prisma.workSlackChannel.update({ where: { id }, data: { ...(input.events ? { events: input.events } : {}), ...(input.intake !== undefined ? { intake: input.intake } : {}), ...(input.enabled !== undefined ? { enabled: input.enabled } : {}) } });
  invalidate(projectId);
  return channelView(row);
}

export async function removeChannel(userId: number, projectId: number, id: number) {
  await adminCtx(userId, projectId);
  const c = await prisma.workSlackChannel.findFirst({ where: { id, projectId } });
  if (!c) throw new NotFoundError('Channel not found');
  await prisma.workSlackChannel.delete({ where: { id } });
  invalidate(projectId);
  await auditProject(projectId, { actorId: userId, action: 'slack.channel_remove', targetType: 'project', targetId: projectId, summary: `Disconnected Slack channel #${c.channelName}` });
  return { ok: true };
}

export async function testChannel(userId: number, projectId: number, id: number) {
  await adminCtx(userId, projectId);
  const c = await prisma.workSlackChannel.findFirst({ where: { id, projectId }, include: { install: true, project: { select: { name: true, key: true, workspace: { select: { slug: true } } } } } });
  if (!c) throw new NotFoundError('Channel not found');
  const r = await postNotice(c, { title: `CT Work is connected to ${c.project.name} (${c.project.key})`, text: 'Project updates will appear here. Type /ctwork new <summary> to send a request to the team.', url: frontendUrl(`/work/${c.project.workspace.slug}/${c.project.key}/board`), footer: 'Test message' }, true);
  if (!r.ok) throw new BadRequestError(`Slack refused the message: ${r.error}`, 'WORK_HOOK_TEST_FAILED');
  return { ok: true };
}

// ─── Gửi thông báo ───────────────────────────────────────────────

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const sent = new Map<number, number[]>();

type ChannelRow = { id: number; channelId: string; install: { installedById: number } };

export async function postNotice(c: ChannelRow, m: SlackNotice, bypassLimit = false): Promise<{ ok: boolean; error?: string }> {
  const now = Date.now();
  const recent = (sent.get(c.id) ?? []).filter((t) => now - t < WINDOW_MS);
  if (!bypassLimit && recent.length >= MAX_PER_WINDOW) return { ok: false, error: 'rate limited' };
  recent.push(now);
  sent.set(c.id, recent);
  let error: string | undefined;
  try {
    await slackCall(await botToken(c.install), 'chat.postMessage', { channel: c.channelId, ...slackNoticeBlocks(m) });
  } catch (err) {
    error = (err as Error).message.slice(0, 200);
  }
  await prisma.workSlackChannel.update({ where: { id: c.id }, data: error ? { lastError: error.slice(0, 300) } : { lastSentAt: new Date(), lastError: null } }).catch(() => undefined);
  if (error) logger.info('[work] slack gửi lỗi', { channel: c.id, error });
  return { ok: !error, error };
}

/** Đăng tệp báo cáo lên kênh (files.getUploadURLExternal ⇒ PUT byte ⇒ files.completeUploadExternal). */
export async function postFile(c: ChannelRow, file: { name: string; buffer: Buffer; title: string; comment: string }): Promise<{ ok: boolean; error?: string }> {
  try {
    const token = await botToken(c.install);
    const up = await slackCall<{ upload_url: string; file_id: string }>(token, 'files.getUploadURLExternal', { filename: file.name, length: String(file.buffer.length) }, 'GET');
    const res = await oauthFetch(up.upload_url, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: new Uint8Array(file.buffer) });
    if (!res.ok) throw new SlackApiError(`upload_http_${res.status}`);
    await slackCall(token, 'files.completeUploadExternal', { files: [{ id: up.file_id, title: file.title.slice(0, 250) }], channel_id: c.channelId, initial_comment: file.comment.slice(0, 3000) });
    await prisma.workSlackChannel.update({ where: { id: c.id }, data: { lastSentAt: new Date(), lastError: null } }).catch(() => undefined);
    return { ok: true };
  } catch (err) {
    const error = (err as Error).message.slice(0, 200);
    await prisma.workSlackChannel.update({ where: { id: c.id }, data: { lastError: error } }).catch(() => undefined);
    return { ok: false, error };
  }
}

const cache = new Map<number, { at: number; rows: Array<ChannelRow & { events: SlackEvent[] }> }>();
function invalidate(projectId: number) { cache.delete(projectId); }
async function channelsOf(projectId: number) {
  const c = cache.get(projectId);
  if (c && Date.now() - c.at < 30_000) return c.rows;
  const rows = (await prisma.workSlackChannel.findMany({ where: { projectId, enabled: true }, select: { id: true, channelId: true, events: true, install: { select: { installedById: true } } } }))
    .map((r) => ({ ...r, events: cleanSlackEvents(r.events) }));
  cache.set(projectId, { at: Date.now(), rows });
  return rows;
}

let registered = false;
/** Gọi một lần lúc nạp tuyến (work.ctw8b.routes.ts). */
export function registerSlackNotifications(): void {
  if (registered) return;
  registered = true;
  onWorkEvent(async (e) => {
    const rows = await channelsOf(e.projectId);
    if (!rows.length) return;
    const { toMessage } = await import('./chatHooks.service.js');
    const m = await toMessage(e);
    if (!m) return;
    await Promise.all(rows.filter((r) => r.events.includes(m.event as SlackEvent)).map((r) => postNotice(r, { title: m.msg.title, text: m.msg.text, url: m.msg.url, footer: m.msg.footer })));
  });
}

// ─── Webhook (công khai — chỉ tin chữ ký) ────────────────────────

const unauthorized = () => new AppError('Invalid signature', 401, 'WORK_SLACK_UNAUTHORIZED');

async function verified(headers: { signature?: string; timestamp?: string }, raw: Buffer, source: 'SLACK' | 'SLACKEV', dedupe = true) {
  const secret = (process.env.CTW_SLACK_SIGNING_SECRET ?? '').trim();
  const v = verifySlack(secret, headers, raw);
  if (!v.ok) throw unauthorized();
  if (dedupe) {
    try {
      await prisma.workExtNonce.create({ data: { source, nonce: v.nonce } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new AppError('This request was already received', 409, 'WORK_SLACK_REPLAY');
      throw err;
    }
    void prisma.workExtNonce.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 2 * 86_400_000) } } }).catch(() => {});
  }
  return v;
}

export async function handleCommand(headers: { signature?: string; timestamp?: string }, raw: Buffer) {
  await verified(headers, raw, 'SLACK');
  const f = parseForm(raw);
  const cmd = parseSlash(f.text);
  const eph = (text: string) => ({ response_type: 'ephemeral', text });
  if (cmd.kind === 'help') return eph(SLASH_USAGE);
  if (cmd.kind === 'unknown') return eph(`Unknown command “${cmd.text}”. ${SLASH_USAGE}`);
  const ch = await prisma.workSlackChannel.findFirst({
    where: { channelId: f.channel_id ?? '', enabled: true, intake: true, install: { teamId: f.team_id ?? '' }, project: { deletedAt: null } },
    include: { project: { select: { id: true, name: true } } },
    orderBy: { id: 'asc' },
  });
  if (!ch) return eph('This channel is not connected to a CT Work project. A project admin can connect it in CT Work → Notion & Slack → Slack.');
  const externalId = `slack:${(f.trigger_id || `${f.team_id}:${f.channel_id}:${headers.timestamp}:${cmd.title}`).slice(0, 180)}`;
  try {
    await prisma.workIntakeProposal.create({
      data: {
        projectId: ch.project.id, channelId: null, source: 'SLACK', externalId, senderName: (f.user_name ?? '').slice(0, 160) || null,
        senderHandle: f.user_id ? `slack:${f.user_id.slice(0, 40)}` : null, title: cmd.title, body: cmd.details,
        meta: { teamId: f.team_id ?? null, channelId: f.channel_id ?? null, channelName: f.channel_name ?? null } as Prisma.InputJsonValue,
      },
    });
  } catch (err) {
    if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')) throw err;
  }
  emitWorkEvent({ type: 'project.updated', projectId: ch.project.id, actor: { kind: 'SYSTEM', userId: null } });
  return eph(`Sent to *${ch.project.name}* for review: “${cmd.title.slice(0, 200)}”. The team will turn it into an issue if it fits.`);
}

function allowedHosts(): string[] {
  const hosts = new Set(['cuongthai.com', 'www.cuongthai.com']);
  try { hosts.add(new URL(frontendUrl('/')).hostname.toLowerCase()); } catch { /* bỏ */ }
  return [...hosts];
}

export async function handleEvents(headers: { signature?: string; timestamp?: string; retryNum?: string }, raw: Buffer) {
  let body: Record<string, any>;
  // Chữ ký trước — kể cả url_verification (Slack ký cả lời thách này).
  const pre = (() => { try { return JSON.parse(raw.toString('utf8')) as Record<string, any>; } catch { return null; } })();
  if (pre?.type === 'url_verification') {
    await verified(headers, raw, 'SLACKEV', false);
    return { challenge: String(pre.challenge ?? '') };
  }
  await verified(headers, raw, 'SLACKEV');
  body = pre ?? {};
  if (body.type !== 'event_callback') return { ok: true };
  // Slack gửi lại (retry) cùng event_id với chữ ký mới ⇒ bỏ theo event_id.
  if (body.event_id) {
    try { await prisma.workExtNonce.create({ data: { source: 'SLACKEVID', nonce: String(body.event_id).slice(0, 200) } }); } catch { return { ok: true, duplicate: true }; }
  }
  const ev = body.event ?? {};
  if (ev.type !== 'link_shared') return { ok: true };
  const installs = await prisma.workSlackInstall.findMany({ where: { teamId: String(body.team_id ?? '') }, include: { workspace: { select: { id: true, slug: true, deletedAt: true } } } });
  if (!installs.length) return { ok: true };
  const unfurls: Record<string, unknown> = {};
  for (const l of (ev.links ?? []).slice(0, 5) as Array<{ url?: string }>) {
    const ref = l.url ? parseIssueLink(l.url, allowedHosts()) : null;
    if (!ref) continue;
    const inst = installs.find((i) => i.workspace.slug === ref.ws && !i.workspace.deletedAt);
    if (!inst) continue; // link thẻ của không gian KHÁC ⇒ không lộ
    const issue = await prisma.workIssue.findFirst({
      where: { number: ref.number, deletedAt: null, project: { key: ref.key, workspaceId: inst.workspaceId, deletedAt: null } },
      select: { number: true, title: true, priority: true, dueDate: true, status: { select: { name: true } }, type: { select: { name: true } }, assignee: { select: PUBLIC_USER }, project: { select: { key: true, name: true } } },
    });
    if (!issue) continue;
    unfurls[l.url!] = issueUnfurl({
      key: `${issue.project.key}-${issue.number}`, title: issue.title, status: issue.status.name, type: issue.type.name,
      assignee: issue.assignee ? displayName(issue.assignee) : null, priority: PRIORITY[issue.priority] || null, project: issue.project.name,
      due: issue.dueDate ? issue.dueDate.toISOString().slice(0, 10) : null,
    });
  }
  if (!Object.keys(unfurls).length) return { ok: true };
  try {
    const token = await botToken(installs[0]);
    await slackCall(token, 'chat.unfurl', { ...(ev.unfurl_id ? { unfurl_id: ev.unfurl_id, source: ev.source } : { channel: ev.channel, ts: ev.message_ts }), unfurls });
  } catch (err) {
    logger.info('[work] slack unfurl lỗi', { err: (err as Error).message });
  }
  return { ok: true, unfurled: Object.keys(unfurls).length };
}
