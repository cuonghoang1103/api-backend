/**
 * CT Work — CTW đợt 7b (C14 / CTW-26): KÊNH NGOÀI ⇒ ĐỀ XUẤT THẺ CHỜ DUYỆT. Luật thuần (chữ ký, payload) ở intakeRules.ts.
 *
 *   EMAIL   Một địa chỉ nhận thư cho mỗi dự án (vd req-abc@inbound.<tên miền của bạn>). Hạ tầng nhận thư = Resend Inbound:
 *           tên miền nhận thư có bản ghi MX trỏ về Resend; webhook "email.received" trỏ về URL riêng của kênh
 *           (/api/v1/work/intake/email/<token>); dán "Signing secret" (whsec_…) của webhook vào cài đặt kênh. Một webhook
 *           Resend nhận thư của CẢ tên miền ⇒ kênh chỉ lấy thư gửi ĐÚNG địa chỉ của nó (to/cc), thư khác trả 200 "ignored".
 *   DISCORD Ứng dụng Discord của nhóm: Interactions Endpoint URL = /api/v1/work/intake/discord/<token>, dán Public Key; đăng
 *           ký lệnh "/ctwork new title:<…> details:<…>" (hướng dẫn + lệnh curl trong trang cài đặt). Discord gửi PING khi
 *           lưu URL — kênh trả PONG sau khi kiểm chữ ký Ed25519.
 *   ZALO    Zalo Official Account (người dùng TỰ đăng ký + xác thực OA ở oa.zalo.me, tạo app ở developers.zalo.me): webhook
 *           URL = /api/v1/work/intake/zalo/<token>, bật sự kiện "user_send_text", dán App ID + OA Secret Key. Chỉ tin bắt
 *           đầu bằng tiền tố (mặc định "#task") mới thành đề xuất.
 *
 * Bất biến:
 *   - KHÔNG kênh nào tạo thẻ thẳng: mọi thứ thành work_intake_proposals (PENDING) ⇒ người trong dự án bấm Nhận (tạo thẻ)
 *     hoặc Bỏ. Agent không nhận/bỏ được (đối ngoại — người quyết).
 *   - Sai chữ ký / quá hạn / không có kênh ⇒ CÙNG 401 (người lạ không dò được kênh nào tồn tại).
 *   - Chống phát lại: id sự kiện (svix-id, interaction id, msg_id) ghi vào work_intake_nonces (UNIQUE) trong CÙNG giao dịch
 *     với đề xuất ⇒ gửi lại gói cũ ⇒ 409 WORK_INTAKE_REPLAY; thêm cửa sổ ±5 phút theo dấu giờ đã ký.
 *   - Bí mật (whsec_, OA secret) mã hoá AES-GCM, không bao giờ trả về client (chỉ "đã đặt" + bản che).
 *   - Chế độ GIẢ LẬP: ADMIN bấm "Send a test message" ⇒ đề xuất `simulated` đi đúng đường duyệt — thử khi chưa có OA/tên miền.
 */

import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { config } from '../../config/env.js';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { displayName, frontendUrl } from './common.js';
import { emitWorkEvent } from './events.js';
import { createIssue } from './issueChange.js';
import { can, isClientScoped, loadProjectAccess, requireProject } from './permissions.js';
import { projectMembers } from './projects.service.js';
import {
  discordPublicKey, INTAKE_KINDS, maskSecret, openSecret, proposalFromDiscord, proposalFromEmail, proposalFromZalo, sealSecret,
  verifyDiscord, verifySvix, verifyZalo, type IntakeKind, type ProposalDraft,
} from './intakeRules.js';

const newToken = () => crypto.randomBytes(18).toString('base64url');
const aadOf = (token: string) => `ctw-intake:${token}`;
const seal = (plain: string, token: string) => sealSecret(plain, aadOf(token), config.jwtSecret);
const unseal = (enc: string | null, token: string) => openSecret(enc, aadOf(token), config.jwtSecret);

// ─── Lấy thân thư khi webhook chỉ có siêu dữ liệu (thay được trong test) ──

type BodyFetcher = (emailId: string) => Promise<string | null>;
const realFetcher: BodyFetcher = async (emailId) => {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`https://api.resend.com/emails/receiving/${encodeURIComponent(emailId)}`, { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const j = (await res.json()) as { text?: string; html?: string };
    return j.text ?? (j.html ? (await import('./intakeRules.js')).htmlToText(j.html) : null);
  } catch { return null; }
};
let bodyFetcher: BodyFetcher = realFetcher;
export function _setEmailBodyFetcherForTests(f: BodyFetcher | null) { bodyFetcher = f ?? realFetcher; }

// ─── Cấu hình kênh ───────────────────────────────────────────────

export const channelInput = z.object({
  kind: z.enum(INTAKE_KINDS),
  name: z.string().trim().min(1).max(80).optional(),
  enabled: z.boolean().optional(),
  /** EMAIL: địa chỉ nhận · DISCORD: publicKey, applicationId · ZALO: appId, oaId, prefix */
  address: z.string().trim().max(200).optional(),
  publicKey: z.string().trim().max(80).optional(),
  applicationId: z.string().trim().max(40).optional(),
  appId: z.string().trim().max(60).optional(),
  oaId: z.string().trim().max(60).optional(),
  prefix: z.string().max(20).optional(),
  /** EMAIL: whsec_… · ZALO: OA Secret Key. Chuỗi rỗng ⇒ xoá. */
  secret: z.string().max(300).optional(),
});
export type ChannelInput = z.infer<typeof channelInput>;

type ChannelRow = Prisma.WorkIntakeChannelGetPayload<object>;
interface ChannelConfig { address?: string; publicKey?: string; applicationId?: string; appId?: string; oaId?: string; prefix?: string }
const cfgOf = (c: ChannelRow) => (c.config ?? {}) as ChannelConfig;

function buildConfig(kind: IntakeKind, input: Partial<ChannelInput>, cur: ChannelConfig = {}): ChannelConfig {
  const out: ChannelConfig = { ...cur };
  if (kind === 'EMAIL' && input.address !== undefined) {
    const a = input.address.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a)) throw new BadRequestError('Enter the receiving address, e.g. requests-abc@inbound.example.com', 'WORK_INTAKE_BAD_CONFIG');
    out.address = a;
  }
  if (kind === 'DISCORD') {
    if (input.publicKey !== undefined) {
      try { discordPublicKey(input.publicKey); } catch (e) { throw new BadRequestError((e as Error).message, 'WORK_INTAKE_BAD_CONFIG'); }
      out.publicKey = input.publicKey.toLowerCase();
    }
    if (input.applicationId !== undefined) {
      if (input.applicationId && !/^\d{15,22}$/.test(input.applicationId)) throw new BadRequestError('The Discord application ID is a long number', 'WORK_INTAKE_BAD_CONFIG');
      out.applicationId = input.applicationId || undefined;
    }
  }
  if (kind === 'ZALO') {
    if (input.appId !== undefined) { if (input.appId && !/^\d{5,30}$/.test(input.appId)) throw new BadRequestError('The Zalo App ID is a number', 'WORK_INTAKE_BAD_CONFIG'); out.appId = input.appId || undefined; }
    if (input.oaId !== undefined) out.oaId = input.oaId || undefined;
    if (input.prefix !== undefined) out.prefix = input.prefix.trim();
    if (out.prefix === undefined) out.prefix = '#task';
  }
  return out;
}

function channelView(c: ChannelRow, pending: number) {
  const cfg = cfgOf(c);
  const secret = unseal(c.secretEnc, c.token);
  return {
    id: c.id, kind: c.kind as IntakeKind, name: c.name, enabled: c.enabled,
    webhookUrl: frontendUrl(`/api/v1/work/intake/${c.kind.toLowerCase()}/${c.token}`),
    address: cfg.address ?? null, publicKey: cfg.publicKey ?? null, applicationId: cfg.applicationId ?? null, appId: cfg.appId ?? null, oaId: cfg.oaId ?? null,
    prefix: cfg.prefix ?? null, secretSet: !!secret, secretMasked: maskSecret(secret),
    ready: c.kind === 'EMAIL' ? !!cfg.address && !!secret : c.kind === 'DISCORD' ? !!cfg.publicKey : !!cfg.appId && !!secret,
    lastEventAt: c.lastEventAt, lastError: c.lastError, pending, createdAt: c.createdAt,
  };
}

async function adminCtx(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.settings');
  if (access.principal === 'AGENT') throw new ForbiddenError('Only a person can configure outside channels');
  return access;
}

async function teamCtx(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  if (isClientScoped(access) || access.role === 'CLIENT') throw new ForbiddenError('Only the project team can see intake');
  return access;
}

async function channelOf(projectId: number, id: number) {
  const c = await prisma.workIntakeChannel.findFirst({ where: { id, projectId } });
  if (!c) throw new NotFoundError('Channel not found');
  return c;
}

export async function listChannels(userId: number, projectId: number) {
  const access = await teamCtx(userId, projectId);
  const isAdmin = can(access.role, 'project.settings') && access.principal !== 'AGENT';
  const rows = await prisma.workIntakeChannel.findMany({ where: { projectId }, orderBy: { id: 'asc' } });
  const pend = await prisma.workIntakeProposal.groupBy({ by: ['channelId'], where: { projectId, status: 'PENDING' }, _count: { _all: true } });
  const pendBy = new Map(pend.map((p) => [p.channelId, p._count._all]));
  // Người không phải ADMIN chỉ thấy tên + loại + số chờ (URL/khoá là cấu hình).
  return {
    canConfigure: isAdmin,
    channels: rows.map((c) => (isAdmin ? channelView(c, pendBy.get(c.id) ?? 0) : { id: c.id, kind: c.kind, name: c.name, enabled: c.enabled, pending: pendBy.get(c.id) ?? 0 })),
  };
}

export async function createChannel(userId: number, projectId: number, input: ChannelInput) {
  await adminCtx(userId, projectId);
  if ((await prisma.workIntakeChannel.count({ where: { projectId } })) >= 10) throw new BadRequestError('A project can have up to 10 channels', 'WORK_LIMIT');
  const token = newToken();
  const cfg = buildConfig(input.kind, input);
  const c = await prisma.workIntakeChannel.create({
    data: {
      projectId, kind: input.kind, name: input.name ?? ({ EMAIL: 'Email', DISCORD: 'Discord', ZALO: 'Zalo OA' } as const)[input.kind], enabled: input.enabled ?? true,
      token, config: cfg as Prisma.InputJsonValue, secretEnc: input.secret ? seal(input.secret.trim(), token) : null, createdById: userId,
    },
  });
  await auditProject(projectId, { actorId: userId, action: 'intake.channel_create', targetType: 'project', targetId: projectId, summary: `Added a ${input.kind} intake channel` });
  return channelView(c, 0);
}

export async function updateChannel(userId: number, projectId: number, id: number, input: Partial<ChannelInput>) {
  await adminCtx(userId, projectId);
  const c = await channelOf(projectId, id);
  const cfg = buildConfig(c.kind as IntakeKind, input, cfgOf(c));
  const u = await prisma.workIntakeChannel.update({
    where: { id: c.id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}), ...(input.enabled !== undefined ? { enabled: input.enabled } : {}),
      config: cfg as Prisma.InputJsonValue,
      ...(input.secret !== undefined ? { secretEnc: input.secret.trim() ? seal(input.secret.trim(), c.token) : null } : {}),
    },
  });
  await auditProject(projectId, { actorId: userId, action: 'intake.channel_update', targetType: 'project', targetId: projectId, summary: `Updated the ${c.kind} intake channel "${u.name}"${input.secret !== undefined ? ' (secret changed)' : ''}` });
  return channelView(u, await prisma.workIntakeProposal.count({ where: { channelId: u.id, status: 'PENDING' } }));
}

/** URL mới (URL cũ chết ngay). Bí mật mã hoá theo token ⇒ mã hoá lại. */
export async function rotateChannel(userId: number, projectId: number, id: number) {
  await adminCtx(userId, projectId);
  const c = await channelOf(projectId, id);
  const secret = unseal(c.secretEnc, c.token);
  const token = newToken();
  const u = await prisma.workIntakeChannel.update({ where: { id: c.id }, data: { token, secretEnc: secret ? seal(secret, token) : null } });
  await auditProject(projectId, { actorId: userId, action: 'intake.channel_rotate', targetType: 'project', targetId: projectId, summary: `New webhook URL for the ${c.kind} channel "${c.name}"` });
  return channelView(u, 0);
}

export async function deleteChannel(userId: number, projectId: number, id: number) {
  await adminCtx(userId, projectId);
  const c = await channelOf(projectId, id);
  await prisma.workIntakeChannel.delete({ where: { id: c.id } });
  await auditProject(projectId, { actorId: userId, action: 'intake.channel_delete', targetType: 'project', targetId: projectId, summary: `Removed the ${c.kind} intake channel "${c.name}"` });
  return { ok: true };
}

/** Chế độ giả lập: đề xuất đi đúng đường duyệt mà không cần OA/tên miền thật. */
export async function simulate(userId: number, projectId: number, id: number, input: { title: string; body?: string | null; senderName?: string | null; senderHandle?: string | null }) {
  await adminCtx(userId, projectId);
  const c = await channelOf(projectId, id);
  const p = await saveProposal(c, { externalId: `sim:${crypto.randomUUID()}`, title: input.title.trim().slice(0, 255), body: input.body?.trim() || null, senderName: input.senderName?.trim() || 'Test sender', senderHandle: input.senderHandle?.trim() || null, meta: { simulatedBy: userId } }, null, true);
  return p ? proposalView(p, await peopleMap(projectId), (await projectKey(projectId))) : null;
}

// ─── Webhook (công khai — không phiên) ───────────────────────────

const unauthorized = () => new AppError('Invalid signature', 401, 'WORK_INTAKE_UNAUTHORIZED');

async function liveChannel(kind: IntakeKind, token: string) {
  const c = await prisma.workIntakeChannel.findFirst({ where: { token, kind }, include: { project: { select: { deletedAt: true } } } });
  if (!c || c.project.deletedAt || !c.enabled) throw unauthorized();
  return c;
}

async function markError(id: number, msg: string | null) {
  await prisma.workIntakeChannel.update({ where: { id }, data: { lastError: msg?.slice(0, 300) ?? null, ...(msg ? {} : { lastEventAt: new Date() }) } }).catch(() => {});
}

/** Đề xuất + nonce trong CÙNG giao dịch. Nonce trùng ⇒ 409 (phát lại); mã ngoài trùng ⇒ trả đề xuất cũ (dịch vụ gửi lại). */
async function saveProposal(c: ChannelRow, d: ProposalDraft, nonce: string | null, simulated = false) {
  const senderUserId = await senderUser(c.projectId, d.senderHandle);
  try {
    return await prisma.$transaction(async (tx) => {
      if (nonce) await tx.workIntakeNonce.create({ data: { channelId: c.id, nonce: nonce.slice(0, 200) } });
      const existing = await tx.workIntakeProposal.findFirst({ where: { projectId: c.projectId, source: c.kind, externalId: d.externalId.slice(0, 200) } });
      if (existing) return existing;
      const p = await tx.workIntakeProposal.create({
        data: {
          projectId: c.projectId, channelId: c.id, source: c.kind, externalId: d.externalId.slice(0, 200), senderName: d.senderName, senderHandle: d.senderHandle,
          senderUserId, title: d.title || '(untitled)', body: d.body, meta: d.meta as Prisma.InputJsonValue, simulated,
        },
      });
      await tx.workIntakeChannel.update({ where: { id: c.id }, data: { lastEventAt: new Date(), lastError: null } });
      return p;
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      if (String((err.meta as { target?: unknown })?.target ?? '').includes('nonce')) throw new AppError('This event was already received', 409, 'WORK_INTAKE_REPLAY');
      return prisma.workIntakeProposal.findFirst({ where: { projectId: c.projectId, source: c.kind, externalId: d.externalId.slice(0, 200) } });
    }
    throw err;
  } finally {
    emitWorkEvent({ type: 'project.updated', projectId: c.projectId, actor: { kind: 'SYSTEM', userId: null } });
    // Dọn nonce cũ (ngoài cửa sổ chữ ký thì nonce cũng vô dụng) — rẻ, chạy kèm.
    void prisma.workIntakeNonce.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 2 * 86_400_000) } } }).catch(() => {});
  }
}

/** Người gửi là thành viên dự án (khớp email) ⇒ đứng tên người báo khi nhận. */
async function senderUser(projectId: number, handle: string | null): Promise<number | null> {
  if (!handle || !handle.includes('@') || handle.includes(':')) return null;
  const u = await prisma.user.findFirst({ where: { email: { equals: handle, mode: 'insensitive' } }, select: { id: true } });
  if (!u) return null;
  return (await loadProjectAccess(u.id, projectId)) ? u.id : null;
}

export async function handleEmail(token: string, headers: { id?: string; timestamp?: string; signature?: string }, raw: Buffer) {
  const c = await liveChannel('EMAIL', token);
  const secret = unseal(c.secretEnc, c.token);
  const v = verifySvix(secret ?? '', headers, raw);
  if (!v.ok) { await markError(c.id, `Rejected a delivery: ${v.reason.toLowerCase().replace('_', ' ')}`); throw unauthorized(); }
  let payload: unknown;
  try { payload = JSON.parse(raw.toString('utf8')); } catch { throw new BadRequestError('Body is not JSON', 'WORK_INTAKE_BAD_BODY'); }
  const d = proposalFromEmail(payload, cfgOf(c).address ?? '');
  if (d === 'IGNORED') return { ok: true, ignored: true };
  if (!d) throw new BadRequestError('Not an inbound email event', 'WORK_INTAKE_BAD_BODY');
  if (!d.body && (d.meta as { bodyMissing?: boolean }).bodyMissing) d.body = (await bodyFetcher(d.externalId))?.slice(0, 20_000) ?? null;
  const p = await saveProposal(c, d, v.nonce);
  return { ok: true, proposal: p?.id ?? null };
}

export async function handleDiscord(token: string, headers: { signature?: string; timestamp?: string }, raw: Buffer) {
  const c = await liveChannel('DISCORD', token);
  const v = verifyDiscord(cfgOf(c).publicKey ?? '', headers, raw);
  if (!v.ok) { await markError(c.id, `Rejected an interaction: ${v.reason.toLowerCase().replace('_', ' ')}`); throw unauthorized(); }
  let it: Record<string, any>;
  try { it = JSON.parse(raw.toString('utf8')); } catch { throw new BadRequestError('Body is not JSON', 'WORK_INTAKE_BAD_BODY'); }
  if (it.type === 1) { await markError(c.id, null); return { type: 1 }; }
  const d = proposalFromDiscord(it);
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: c.projectId }, select: { name: true } });
  if (!d || !d.externalId) {
    return { type: 4, data: { flags: 64, content: 'Usage: `/ctwork new title:<short summary> details:<optional details>` — it becomes a proposal the team reviews in CT Work.' } };
  }
  const p = await saveProposal(c, d, `discord:${d.externalId}`);
  // allowed_mentions rỗng — tiêu đề có "@everyone" không ping cả server.
  return { type: 4, data: { flags: 64, allowed_mentions: { parse: [] }, content: `Sent to **${project.name}** for review: “${(p?.title ?? d.title).slice(0, 200)}”. The team will turn it into an issue if it fits.` } };
}

export async function handleZalo(token: string, signature: string | undefined, raw: Buffer) {
  const c = await liveChannel('ZALO', token);
  const cfg = cfgOf(c);
  const v = verifyZalo({ appId: cfg.appId ?? '', oaSecret: unseal(c.secretEnc, c.token) ?? '' }, signature, raw);
  if (!v.ok) { await markError(c.id, `Rejected an event: ${v.reason.toLowerCase().replace('_', ' ')}`); throw unauthorized(); }
  const ev = JSON.parse(raw.toString('utf8')) as Record<string, any>;
  const d = proposalFromZalo(ev, cfg.prefix ?? '#task');
  if (d === 'IGNORED' || !d) {
    // Vẫn ghi nonce: gói này đã được kiểm, gửi lại y nguyên cũng bị chặn.
    await prisma.workIntakeNonce.create({ data: { channelId: c.id, nonce: v.nonce.slice(0, 200) } }).catch((err) => {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new AppError('This event was already received', 409, 'WORK_INTAKE_REPLAY');
      throw err;
    });
    await markError(c.id, null);
    return { ok: true, ignored: true };
  }
  const p = await saveProposal(c, d, v.nonce);
  return { ok: true, proposal: p?.id ?? null };
}

// ─── Đề xuất: xem + duyệt ────────────────────────────────────────

type ProposalRow = Prisma.WorkIntakeProposalGetPayload<object>;
const projectKey = async (projectId: number) => (await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true } })).key;
const peopleMap = async (projectId: number) => new Map((await projectMembers(projectId)).map((m) => [m.id, displayName(m)]));

function proposalView(p: ProposalRow, people: Map<number, string>, key: string) {
  return {
    id: p.id, source: p.source, channelId: p.channelId, title: p.title, body: p.body, senderName: p.senderName, senderHandle: p.senderHandle,
    sender: p.senderUserId ? people.get(p.senderUserId) ?? null : null, status: p.status, simulated: p.simulated, createdAt: p.createdAt,
    issue: p.issueNumber ? { number: p.issueNumber, key: `${key}-${p.issueNumber}` } : null,
    decidedBy: p.decidedById ? people.get(p.decidedById) ?? null : null, decidedAt: p.decidedAt, decisionNote: p.decisionNote, meta: p.meta,
  };
}

export async function listProposals(userId: number, projectId: number, q: { status?: string } = {}) {
  const access = await teamCtx(userId, projectId);
  const status = q.status && ['PENDING', 'ACCEPTED', 'REJECTED'].includes(q.status) ? q.status : undefined;
  const [rows, counts, people, key] = await Promise.all([
    prisma.workIntakeProposal.findMany({ where: { projectId, ...(status ? { status } : {}) }, orderBy: { id: 'desc' }, take: 200 }),
    prisma.workIntakeProposal.groupBy({ by: ['status'], where: { projectId }, _count: { _all: true } }),
    peopleMap(projectId), projectKey(projectId),
  ]);
  return {
    proposals: rows.map((p) => proposalView(p, people, key)),
    counts: Object.fromEntries(counts.map((c) => [c.status, c._count._all])),
    canDecide: can(access.role, 'issue.create', access.options, access.principal) && access.principal !== 'AGENT',
  };
}

export const decideInput = z.object({
  decision: z.enum(['ACCEPT', 'REJECT']),
  title: z.string().trim().min(1).max(255).optional(),
  typeKey: z.string().regex(/^[A-Z][A-Z0-9_]{0,31}$/).optional(),
  assigneeId: z.number().int().positive().nullable().optional(),
  priority: z.number().int().min(1).max(5).optional(),
  note: z.string().max(300).nullable().optional(),
});

export async function decideProposal(userId: number, projectId: number, id: number, input: z.infer<typeof decideInput>) {
  const access = await requireProject(userId, projectId, 'issue.create');
  if (access.principal === 'AGENT') throw new ForbiddenError('Only a person can accept or reject proposals from outside channels');
  if (isClientScoped(access) || access.role === 'CLIENT') throw new ForbiddenError('Only the project team can review intake');
  const p = await prisma.workIntakeProposal.findFirst({ where: { id, projectId } });
  if (!p) throw new NotFoundError('Proposal not found');
  if (p.status !== 'PENDING') throw new ConflictError(`This proposal was already ${p.status.toLowerCase()}`);
  // Giữ chỗ (PENDING ⇒ trạng thái mới) trước — hai người bấm cùng lúc chỉ một người thắng.
  const claimed = await prisma.workIntakeProposal.updateMany({ where: { id, status: 'PENDING' }, data: { status: input.decision === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED', decidedById: userId, decidedAt: new Date(), decisionNote: input.note ?? null } });
  if (!claimed.count) throw new ConflictError('Someone else just decided this proposal');
  if (input.decision === 'REJECT') {
    await auditProject(projectId, { actorId: userId, action: 'intake.reject', targetType: 'project', targetId: projectId, summary: `Rejected a ${p.source} proposal: ${p.title.slice(0, 120)}` });
    emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
    return proposalView((await prisma.workIntakeProposal.findUniqueOrThrow({ where: { id } })), await peopleMap(projectId), access.key);
  }
  try {
    const types = await prisma.workIssueType.findMany({ where: { projectId, archived: false, level: 0 }, select: { id: true, key: true } });
    const type = (input.typeKey && types.find((t) => t.key === input.typeKey)) || types.find((t) => t.key === 'TASK') || types[0];
    if (!type) throw new BadRequestError('This project has no issue type for requests', 'WORK_BAD_TYPE');
    const from = [p.senderName, p.senderHandle && !p.senderHandle.includes(':') ? `<${p.senderHandle}>` : p.senderHandle].filter(Boolean).join(' ') || 'unknown sender';
    const src = ({ EMAIL: 'email', DISCORD: 'Discord', ZALO: 'Zalo OA' } as Record<string, string>)[p.source] ?? p.source;
    const paras = [p.body ?? '', `Received via ${src} from ${from} on ${p.createdAt.toISOString().slice(0, 16).replace('T', ' ')} UTC${p.simulated ? ' (test message)' : ''}.`].filter((x) => x.trim());
    const doc = { type: 'doc', content: paras.flatMap((x) => x.split(/\n{2,}/)).map((x) => ({ type: 'paragraph', content: [{ type: 'text', text: x.slice(0, 20_000) }] })) };
    const issue = await createIssue({
      projectId, typeId: type.id, title: input.title ?? p.title, descriptionJson: doc as Prisma.InputJsonValue, priority: input.priority,
      assigneeId: input.assigneeId ?? null, reporterId: p.senderUserId ?? userId,
    }, { kind: 'USER', userId });
    await prisma.workIntakeProposal.update({ where: { id }, data: { issueId: issue.id, issueNumber: issue.number } });
    await auditProject(projectId, { actorId: userId, action: 'intake.accept', targetType: 'issue', targetId: issue.id, summary: `${access.key}-${issue.number} from a ${p.source} proposal` });
    return proposalView((await prisma.workIntakeProposal.findUniqueOrThrow({ where: { id } })), await peopleMap(projectId), access.key);
  } catch (err) {
    // Tạo thẻ hỏng ⇒ trả đề xuất về chờ (không mất).
    await prisma.workIntakeProposal.update({ where: { id }, data: { status: 'PENDING', decidedById: null, decidedAt: null, decisionNote: null } }).catch(() => {});
    logger.warn('[work] intake: nhận đề xuất lỗi', { id, err: (err as Error).message });
    throw err;
  }
}
