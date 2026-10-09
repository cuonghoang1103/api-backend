/**
 * CT Work K-3 (10/10/2026) — KÊNH CHAT DỰ ÁN (thay Zalo/Messenger của nhóm): #general tự có, kênh chủ đề
 * PUBLIC/PRIVATE, kênh CLIENT với khách (mặc định không có), tin markdown + @nhắc + luồng + ghim + cảm xúc + tìm kiếm,
 * đếm chưa đọc theo người, tắt tiếng theo kênh/toàn bộ (đồng bộ web ↔ app desktop), gọi nhóm (Jitsi/Meet), tạo thẻ /
 * chuyển tiếp từ tin, thẻ xem trước cho liên kết nội bộ (dựng LÚC ĐỌC theo quyền người xem).
 *
 * Quyền: luật thuần ở chatRules.ts trên ProjectAccess của permissions.ts (requireProject / loadProjectAccess). Mọi
 * đường (REST, registry MCP/Ask AI/agent BUILTIN, socket) đi qua đúng các hàm ở đây.
 *
 * Thời gian thực (KHÔNG dùng phòng `work:project:<id>` cho nội dung — phòng đó có người không thấy kênh PRIVATE):
 *   - phòng `work:chat:<dự án>:<kênh>` (vào bằng `work:chat:join`, kiểm quyền) ⇒ `work:chat:event` cho màn đang mở kênh;
 *   - phòng riêng `user:<id>` của TỪNG người thấy kênh ⇒ `work:chat:notify` (badge, âm, thông báo hệ thống) — kèm cờ
 *     `alert` máy chủ đã tính theo cài đặt tắt tiếng / chế độ báo / giờ im lặng của chính người đó.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { getIO, getOnlineUserIds } from '../../socket/messaging.socket.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { displayName, PUBLIC_USER, type PublicUser } from './common.js';
import type { ProjectRole, ProjectVisibility, WorkspaceRole } from './constants.js';
import { newJitsiUrl } from './governance.js';
import { notifyWork } from './notify.js';
import {
  canViewPage, effectiveProjectRole, effectiveWorkspaceRole, governanceAccess, isClientScoped, loadProjectAccess,
  portalOnlyUserIds, requireProject, type ProjectAccess,
} from './permissions.js';
import {
  badgeCount, CALL_REUSE_MS, canCreateChannel, canManageChannel, canModerate, canPin, canPostInChannel, canViewChannel,
  chatAudience, channelSlug, cleanBody, effectiveMode, extractRefs, GENERAL, inQuiet, isMuted, isMutedForever,
  MAX_CHANNELS_PER_PROJECT, MAX_FILES_PER_MESSAGE, mentionNames, muteUntilFor, plainText, shouldAlert, validEmoji,
  type ChannelKind, type ChatActor, type ChatRef, type MuteChoice, type NotifyMode,
} from './chatRules.js';

// ─── Phòng socket ────────────────────────────────────────────────

export const chatRoom = (projectId: number, channelId: number) => `work:chat:${projectId}:${channelId}`;

function emitChannel(projectId: number, channelId: number, payload: Record<string, unknown>) {
  getIO()?.to(chatRoom(projectId, channelId)).emit('work:chat:event', { projectId, channelId, ...payload });
}

/** Đuổi một người khỏi phòng chat (mất quyền dự án / bị gỡ khỏi kênh riêng). */
export function evictFromChat(projectId: number, userId: number, channelId?: number): void {
  const io = getIO();
  if (!io) return;
  if (channelId) { io.in(`user:${userId}`).socketsLeave(chatRoom(projectId, channelId)); return; }
  void io.in(`user:${userId}`).fetchSockets().then((ss) => {
    for (const s of ss) for (const r of s.rooms) if (r.startsWith(`work:chat:${projectId}:`)) s.leave(r);
  }).catch(() => undefined);
}

// ─── Ngữ cảnh người gọi ──────────────────────────────────────────

export interface ChatCtx { userId: number; access: ProjectAccess; actor: ChatActor }

async function ctxOf(userId: number, projectId: number): Promise<ChatCtx> {
  const access = await requireProject(userId, projectId, 'project.view');
  const actor: ChatActor = { role: access.role, workspaceRole: access.workspaceRole, principal: access.principal };
  if (!chatAudience(actor)) throw new NotFoundError('Project not found');
  return { userId, access, actor };
}

const CHANNEL_SELECT = {
  id: true, projectId: true, name: true, topic: true, kind: true, isGeneral: true, createdById: true, callUrl: true,
  callStartedAt: true, lastMessageAt: true, archivedAt: true, createdAt: true,
} satisfies Prisma.WorkChannelSelect;
type ChannelRow = Prisma.WorkChannelGetPayload<{ select: typeof CHANNEL_SELECT }>;

/** #general của dự án — tạo lần đầu có người mở chat (không đụng luồng tạo dự án). */
export async function ensureGeneral(projectId: number): Promise<void> {
  await prisma.workChannel.upsert({
    where: { projectId_name: { projectId, name: GENERAL } },
    create: { projectId, name: GENERAL, kind: 'PUBLIC', isGeneral: true, topic: 'Team-wide announcements and conversation' },
    update: {},
  }).catch(async (err) => {
    // Hai tab mở cùng lúc ⇒ một bên trúng khoá duy nhất — kênh đã có, bỏ qua.
    if (!(await prisma.workChannel.findFirst({ where: { projectId, name: GENERAL } }))) throw err;
  });
}

async function explicitSet(userId: number, channelIds: number[]): Promise<Set<number>> {
  if (!channelIds.length) return new Set();
  const rows = await prisma.workChannelMember.findMany({ where: { userId, channelId: { in: channelIds }, explicit: true }, select: { channelId: true } });
  return new Set(rows.map((r) => r.channelId));
}

/** Kênh + kiểm thấy được (404 nếu không — không lộ kênh riêng tồn tại). */
async function channelFor(ctx: ChatCtx, channelId: number): Promise<{ ch: ChannelRow; member: boolean }> {
  const ch = await prisma.workChannel.findFirst({ where: { id: channelId, projectId: ctx.access.projectId }, select: CHANNEL_SELECT });
  if (!ch) throw new NotFoundError('Channel not found');
  const member = (await explicitSet(ctx.userId, [ch.id])).has(ch.id);
  if (!canViewChannel(ctx.actor, ch, member)) throw new NotFoundError('Channel not found');
  return { ch, member };
}

async function postableChannel(ctx: ChatCtx, channelId: number) {
  const r = await channelFor(ctx, channelId);
  if (r.ch.archivedAt) throw new BadRequestError('This channel is archived', 'WORK_CHANNEL_ARCHIVED');
  if (!canPostInChannel(ctx.actor, r.ch, r.member)) throw new ForbiddenError('You can read this channel but not post in it');
  return r;
}

// ─── Ai thấy một kênh (thông báo, @nhắc, chưa đọc) ───────────────

interface Viewer { id: number; username: string; kind: string; role: ProjectRole; workspaceRole: WorkspaceRole }

/** Mọi người vào được dự án + vai hiệu lực (cùng luật loadProjectAccess, một lượt truy vấn). */
async function projectPeople(projectId: number): Promise<Viewer[]> {
  const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { workspaceId: true, visibility: true } });
  if (!p) return [];
  const [ws, pm, portalOnly] = await Promise.all([
    prisma.workMember.findMany({ where: { workspaceId: p.workspaceId }, select: { role: true, user: { select: { id: true, username: true, kind: true } } } }),
    prisma.workProjectMember.findMany({ where: { projectId }, select: { userId: true, role: true } }),
    portalOnlyUserIds(p.workspaceId),
  ]);
  const explicit = new Map(pm.map((m) => [m.userId, m.role as ProjectRole]));
  const out: Viewer[] = [];
  for (const m of ws) {
    const wsRole = effectiveWorkspaceRole(m.role as WorkspaceRole, portalOnly.has(m.user.id));
    const role = effectiveProjectRole({ workspaceRole: wsRole, projectRole: explicit.get(m.user.id) ?? null, visibility: p.visibility as ProjectVisibility });
    if (role) out.push({ id: m.user.id, username: m.user.username, kind: m.user.kind, role, workspaceRole: wsRole });
  }
  return out;
}

export async function channelViewers(ch: { id: number; projectId: number; kind: string }): Promise<Viewer[]> {
  const people = await projectPeople(ch.projectId);
  const members = ch.kind === 'PRIVATE'
    ? new Set((await prisma.workChannelMember.findMany({ where: { channelId: ch.id, explicit: true }, select: { userId: true } })).map((r) => r.userId))
    : new Set<number>();
  return people.filter((v) => canViewChannel({ role: v.role, workspaceRole: v.workspaceRole, principal: v.kind === 'AGENT' ? 'AGENT' : 'HUMAN' }, ch, members.has(v.id)));
}

// ─── Trạng thái đọc / chưa đọc ───────────────────────────────────

/**
 * Dòng trạng thái của người với các kênh — tạo lần đầu. Người MỚI thấy kênh không bị đổ cả lịch sử thành "chưa đọc":
 * mốc đọc = tin cuối cùng cũ hơn 24 giờ (tin trong ngày vẫn hiện là mới).
 */
async function ensureStates(userId: number, channelIds: number[]): Promise<void> {
  if (!channelIds.length) return;
  const have = new Set((await prisma.workChannelMember.findMany({ where: { userId, channelId: { in: channelIds } }, select: { channelId: true } })).map((r) => r.channelId));
  const missing = channelIds.filter((c) => !have.has(c));
  if (!missing.length) return;
  const cutoff = new Date(Date.now() - 86_400_000);
  const marks = await prisma.workChannelMessage.groupBy({ by: ['channelId'], where: { channelId: { in: missing }, createdAt: { lt: cutoff } }, _max: { id: true } });
  const m = new Map(marks.map((x) => [x.channelId, x._max.id ?? 0]));
  await prisma.workChannelMember.createMany({ data: missing.map((channelId) => ({ channelId, userId, lastReadId: m.get(channelId) ?? 0 })), skipDuplicates: true });
}

type Counts = Map<number, { unread: number; mentions: number }>;

async function unreadCounts(userId: number, channelIds: number[]): Promise<Counts> {
  const out: Counts = new Map();
  if (!channelIds.length) return out;
  const rows = await prisma.$queryRaw<Array<{ channelId: number; unread: bigint; mentions: bigint }>>`
    SELECT m.channel_id AS "channelId",
           COUNT(*) FILTER (WHERE m.parent_id IS NULL) AS unread,
           COUNT(*) FILTER (WHERE ${userId}::int = ANY(m.mentions)) AS mentions
      FROM work_channel_messages m
      LEFT JOIN work_channel_members cm ON cm.channel_id = m.channel_id AND cm.user_id = ${userId}
     WHERE m.channel_id = ANY(${channelIds}::int[])
       AND m.deleted_at IS NULL
       AND m.id > COALESCE(cm.last_read_id, 0)
       AND (m.author_id IS NULL OR m.author_id <> ${userId})
     GROUP BY m.channel_id`;
  for (const r of rows) out.set(Number(r.channelId), { unread: Number(r.unread), mentions: Number(r.mentions) });
  return out;
}

// ─── Cài đặt chat của người (đồng bộ web ↔ app) ──────────────────

export async function getPrefs(userId: number) {
  const [p, quiet] = await Promise.all([
    prisma.workChatPref.findUnique({ where: { userId } }),
    prisma.workNotifySetting.findUnique({ where: { userId }, select: { quietStart: true, quietEnd: true } }),
  ]);
  const now = new Date();
  const mutedUntil = p?.mutedUntil && isMuted(p.mutedUntil, now) ? p.mutedUntil : null;
  return {
    mutedUntil, mutedForever: isMutedForever(mutedUntil),
    notify: (p?.notify === 'MENTIONS' ? 'MENTIONS' : 'ALL') as NotifyMode,
    sound: p?.sound ?? true, desktop: p?.desktop ?? true, emailDigest: p?.emailDigest ?? false,
    quietStart: quiet?.quietStart ?? null, quietEnd: quiet?.quietEnd ?? null,
    quietNow: inQuiet(quiet?.quietStart, quiet?.quietEnd, now),
  };
}

export async function setPrefs(userId: number, input: { mute?: MuteChoice; until?: string | null; notify?: NotifyMode; sound?: boolean; desktop?: boolean; emailDigest?: boolean }) {
  const data: Prisma.WorkChatPrefUncheckedUpdateInput = {};
  if (input.mute) {
    try { data.mutedUntil = muteUntilFor(input.mute, new Date(), input.until); } catch (e) { throw new BadRequestError((e as Error).message, 'WORK_BAD_MUTE'); }
  }
  if (input.notify) data.notify = input.notify;
  if (input.sound !== undefined) data.sound = input.sound;
  if (input.desktop !== undefined) data.desktop = input.desktop;
  if (input.emailDigest !== undefined) data.emailDigest = input.emailDigest;
  await prisma.workChatPref.upsert({ where: { userId }, create: { ...(data as Prisma.WorkChatPrefUncheckedCreateInput), userId }, update: data });
  const prefs = await getPrefs(userId);
  getIO()?.to(`user:${userId}`).emit('work:chat:prefs', { scope: 'global' });
  return prefs;
}

export async function setChannelNotify(userId: number, projectId: number, channelId: number, input: { mute?: MuteChoice; until?: string | null; notify?: 'DEFAULT' | 'ALL' | 'MENTIONS' }) {
  const ctx = await ctxOf(userId, projectId);
  await channelFor(ctx, channelId);
  await ensureStates(userId, [channelId]);
  const data: Prisma.WorkChannelMemberUpdateInput = {};
  if (input.mute) {
    try { data.mutedUntil = muteUntilFor(input.mute, new Date(), input.until); } catch (e) { throw new BadRequestError((e as Error).message, 'WORK_BAD_MUTE'); }
  }
  if (input.notify) data.notify = input.notify;
  const r = await prisma.workChannelMember.update({ where: { channelId_userId: { channelId, userId } }, data, select: { mutedUntil: true, notify: true } });
  getIO()?.to(`user:${userId}`).emit('work:chat:prefs', { scope: 'channel', projectId, channelId });
  return { channelId, mutedUntil: isMuted(r.mutedUntil, new Date()) ? r.mutedUntil : null, mutedForever: isMutedForever(r.mutedUntil), notify: r.notify };
}

// ─── Danh sách kênh ──────────────────────────────────────────────

export interface ChannelView {
  id: number; name: string; topic: string | null; kind: string; isGeneral: boolean; archived: boolean;
  lastMessageAt: Date | null; unread: number; mentions: number; badge: number; lastReadId: number;
  muted: boolean; mutedUntil: Date | null; mutedForever: boolean; notify: string;
  member: boolean; canPost: boolean; canManage: boolean; call: { url: string; startedAt: Date } | null;
}

async function visibleChannels(ctx: ChatCtx, opts: { includeArchived?: boolean } = {}): Promise<{ rows: ChannelRow[]; members: Set<number> }> {
  if (chatAudience(ctx.actor) === 'TEAM') await ensureGeneral(ctx.access.projectId);
  const all = await prisma.workChannel.findMany({
    where: { projectId: ctx.access.projectId, ...(opts.includeArchived ? {} : { archivedAt: null }) },
    orderBy: [{ isGeneral: 'desc' }, { name: 'asc' }], select: CHANNEL_SELECT,
  });
  const members = await explicitSet(ctx.userId, all.map((c) => c.id));
  return { rows: all.filter((c) => canViewChannel(ctx.actor, c, members.has(c.id))), members };
}

export async function listChannels(userId: number, projectId: number, opts: { includeArchived?: boolean } = {}) {
  const ctx = await ctxOf(userId, projectId);
  const { rows, members } = await visibleChannels(ctx, opts);
  const ids = rows.map((r) => r.id);
  await ensureStates(userId, ids);
  const [counts, states] = await Promise.all([
    unreadCounts(userId, ids),
    prisma.workChannelMember.findMany({ where: { userId, channelId: { in: ids } }, select: { channelId: true, lastReadId: true, mutedUntil: true, notify: true } }),
  ]);
  const st = new Map(states.map((s) => [s.channelId, s]));
  const now = new Date();
  const channels: ChannelView[] = rows.map((c) => {
    const s = st.get(c.id);
    const n = counts.get(c.id) ?? { unread: 0, mentions: 0 };
    const muted = isMuted(s?.mutedUntil, now);
    const member = members.has(c.id);
    return {
      id: c.id, name: c.name, topic: c.topic, kind: c.kind, isGeneral: c.isGeneral, archived: !!c.archivedAt,
      lastMessageAt: c.lastMessageAt, unread: n.unread, mentions: n.mentions, badge: badgeCount({ ...n, channelMuted: muted }),
      lastReadId: s?.lastReadId ?? 0, muted, mutedUntil: muted ? s!.mutedUntil : null, mutedForever: muted && isMutedForever(s?.mutedUntil), notify: s?.notify ?? 'DEFAULT',
      member, canPost: canPostInChannel(ctx.actor, c, member), canManage: canManageChannel(ctx.actor, userId, c, member),
      call: c.callUrl && c.callStartedAt && now.getTime() - c.callStartedAt.getTime() < CALL_REUSE_MS ? { url: c.callUrl, startedAt: c.callStartedAt } : null,
    };
  });
  return {
    channels,
    total: channels.reduce((a, c) => a + c.badge, 0),
    me: {
      audience: chatAudience(ctx.actor),
      canCreate: canCreateChannel(ctx.actor, 'PUBLIC'),
      canCreateClient: canCreateChannel(ctx.actor, 'CLIENT'),
      canModerate: canModerate(ctx.actor),
    },
  };
}

/** Badge cho mọi dự án của người (sidebar + tiêu đề tab). Dự án không có kênh nào ⇒ bỏ qua, không tạo #general. */
export async function unreadAll(userId: number) {
  const chans = await prisma.workChannel.findMany({
    where: { archivedAt: null, lastMessageAt: { not: null }, project: { deletedAt: null, workspace: { deletedAt: null, members: { some: { userId } } } } },
    select: { id: true, projectId: true, kind: true },
  });
  const byProject = new Map<number, typeof chans>();
  for (const c of chans) byProject.set(c.projectId, [...(byProject.get(c.projectId) ?? []), c]);
  const members = await explicitSet(userId, chans.map((c) => c.id));
  const visible: number[] = [];
  const projOf = new Map<number, number>();
  for (const [pid, list] of byProject) {
    const access = await loadProjectAccess(userId, pid);
    if (!access) continue;
    const actor: ChatActor = { role: access.role, workspaceRole: access.workspaceRole, principal: access.principal };
    for (const c of list) if (canViewChannel(actor, c, members.has(c.id))) { visible.push(c.id); projOf.set(c.id, pid); }
  }
  await ensureStates(userId, visible);
  const [counts, states] = await Promise.all([
    unreadCounts(userId, visible),
    prisma.workChannelMember.findMany({ where: { userId, channelId: { in: visible } }, select: { channelId: true, mutedUntil: true } }),
  ]);
  const now = new Date();
  const muted = new Map(states.map((s) => [s.channelId, isMuted(s.mutedUntil, now)]));
  const projects = new Map<number, { projectId: number; unread: number; mentions: number }>();
  for (const cid of visible) {
    const n = counts.get(cid);
    if (!n) continue;
    const pid = projOf.get(cid)!;
    const cur = projects.get(pid) ?? { projectId: pid, unread: 0, mentions: 0 };
    cur.unread += badgeCount({ ...n, channelMuted: muted.get(cid) ?? false });
    cur.mentions += n.mentions;
    projects.set(pid, cur);
  }
  const list = [...projects.values()].filter((p) => p.unread > 0 || p.mentions > 0);
  return { total: list.reduce((a, p) => a + p.unread, 0), projects: list };
}

// ─── Tạo / sửa kênh ──────────────────────────────────────────────

export async function createChannel(userId: number, projectId: number, input: { name: string; topic?: string | null; kind: ChannelKind; memberIds?: number[] }) {
  const ctx = await ctxOf(userId, projectId);
  if (!canCreateChannel(ctx.actor, input.kind)) {
    throw new ForbiddenError(input.kind === 'CLIENT' ? 'Only project admins can open a client channel' : 'You cannot create channels in this project');
  }
  const name = channelSlug(input.name);
  if (!name) throw new BadRequestError('Channel names need 2–40 letters, numbers or dashes', 'WORK_BAD_CHANNEL_NAME');
  if (await prisma.workChannel.count({ where: { projectId } }) >= MAX_CHANNELS_PER_PROJECT) throw new BadRequestError('This project has too many channels', 'WORK_LIMIT');
  if (input.kind === 'CLIENT' && await prisma.workChannel.count({ where: { projectId, kind: 'CLIENT', archivedAt: null } })) {
    throw new BadRequestError('This project already has a client channel', 'WORK_CHANNEL_EXISTS');
  }
  if (await prisma.workChannel.findFirst({ where: { projectId, name } })) throw new BadRequestError(`#${name} already exists`, 'WORK_CHANNEL_EXISTS');
  const ch = await prisma.workChannel.create({
    data: { projectId, name, topic: input.topic?.trim().slice(0, 250) || null, kind: input.kind, createdById: userId },
    select: CHANNEL_SELECT,
  });
  if (input.kind === 'PRIVATE') {
    const people = await projectPeople(projectId);
    const ok = new Set(people.filter((p) => chatAudience({ role: p.role, workspaceRole: p.workspaceRole }) === 'TEAM').map((p) => p.id));
    const ids = [...new Set([userId, ...(input.memberIds ?? [])])].filter((id) => ok.has(id)).slice(0, 200);
    await prisma.workChannelMember.createMany({ data: ids.map((u) => ({ channelId: ch.id, userId: u, explicit: true })), skipDuplicates: true });
  }
  await auditProject(projectId, { actorId: userId, action: 'chat.channel.create', targetType: 'channel', targetId: ch.id, summary: `Created ${input.kind.toLowerCase()} channel #${name}` });
  await systemMessage(ch, userId, `created #${name}${input.topic ? ` — ${input.topic.trim().slice(0, 120)}` : ''}`, { type: 'created' });
  return { id: ch.id, name: ch.name, kind: ch.kind };
}

export async function updateChannel(userId: number, projectId: number, channelId: number, input: { name?: string; topic?: string | null; archived?: boolean }) {
  const ctx = await ctxOf(userId, projectId);
  const { ch, member } = await channelFor(ctx, channelId);
  if (!canManageChannel(ctx.actor, userId, ch, member)) throw new ForbiddenError('Only the channel creator or a project admin can change this channel');
  const data: Prisma.WorkChannelUpdateInput = {};
  if (input.name !== undefined && !ch.isGeneral) {
    const name = channelSlug(input.name);
    if (!name) throw new BadRequestError('Channel names need 2–40 letters, numbers or dashes', 'WORK_BAD_CHANNEL_NAME');
    if (name !== ch.name && await prisma.workChannel.findFirst({ where: { projectId, name } })) throw new BadRequestError(`#${name} already exists`, 'WORK_CHANNEL_EXISTS');
    data.name = name;
  }
  if (input.topic !== undefined) data.topic = input.topic?.trim().slice(0, 250) || null;
  if (input.archived !== undefined) {
    if (ch.isGeneral) throw new BadRequestError('#general cannot be archived', 'WORK_CHANNEL_GENERAL');
    data.archivedAt = input.archived ? new Date() : null;
  }
  const next = await prisma.workChannel.update({ where: { id: ch.id }, data, select: CHANNEL_SELECT });
  const what = input.archived !== undefined ? (input.archived ? 'archived' : 'unarchived') : data.name ? `renamed to #${next.name}` : 'updated the topic';
  await auditProject(projectId, { actorId: userId, action: `chat.channel.${input.archived !== undefined ? (input.archived ? 'archive' : 'unarchive') : 'update'}`, targetType: 'channel', targetId: ch.id, summary: `#${ch.name}: ${what}` });
  emitChannel(projectId, ch.id, { type: 'channel' });
  await broadcastToViewers(next, { type: 'channel' });
  return { id: next.id, name: next.name, topic: next.topic, archived: !!next.archivedAt };
}

/** Thành viên của kênh (kênh riêng: danh sách tường minh; kênh khác: mọi người thấy kênh) + trạng thái online. */
export async function channelMembers(userId: number, projectId: number, channelId: number) {
  const ctx = await ctxOf(userId, projectId);
  const { ch } = await channelFor(ctx, channelId);
  const viewers = await channelViewers(ch);
  const users = await prisma.user.findMany({ where: { id: { in: viewers.map((v) => v.id) } }, select: PUBLIC_USER });
  const online = new Set(getOnlineUserIds());
  const roles = new Map(viewers.map((v) => [v.id, v.role]));
  return users
    .map((u) => ({ ...u, role: roles.get(u.id) ?? null, online: u.kind === 'AGENT' ? null : online.has(u.id) }))
    .sort((a, b) => Number(b.online ?? 0) - Number(a.online ?? 0) || displayName(a).localeCompare(displayName(b)));
}

export async function setChannelMembers(userId: number, projectId: number, channelId: number, input: { add?: number[]; remove?: number[] }) {
  const ctx = await ctxOf(userId, projectId);
  const { ch, member } = await channelFor(ctx, channelId);
  if (ch.kind !== 'PRIVATE') throw new BadRequestError('Only private channels have a member list', 'WORK_CHANNEL_NOT_PRIVATE');
  if (!canManageChannel(ctx.actor, userId, ch, member)) throw new ForbiddenError('Only the channel creator or a project admin can change members');
  const people = await projectPeople(projectId);
  const team = new Set(people.filter((p) => chatAudience({ role: p.role, workspaceRole: p.workspaceRole }) === 'TEAM').map((p) => p.id));
  const add = [...new Set(input.add ?? [])].filter((u) => team.has(u));
  const remove = [...new Set(input.remove ?? [])];
  for (const u of add) {
    await prisma.workChannelMember.upsert({ where: { channelId_userId: { channelId, userId: u } }, create: { channelId, userId: u, explicit: true }, update: { explicit: true } });
  }
  if (remove.length) {
    await prisma.workChannelMember.updateMany({ where: { channelId, userId: { in: remove } }, data: { explicit: false } });
    for (const u of remove) evictFromChat(projectId, u, channelId);
  }
  if (add.length || remove.length) {
    await auditProject(projectId, { actorId: userId, action: 'chat.channel.members', targetType: 'channel', targetId: ch.id, summary: `#${ch.name}: +${add.length} / −${remove.length} members`, detail: { add, remove } });
  }
  return channelMembers(userId, projectId, channelId);
}

// ─── Tin nhắn: đọc ───────────────────────────────────────────────

const MESSAGE_SELECT = {
  id: true, channelId: true, authorId: true, kind: true, body: true, parentId: true, replyCount: true, lastReplyAt: true,
  mentions: true, refs: true, meta: true, pinnedAt: true, pinnedById: true, clientKey: true, editedAt: true, deletedAt: true, createdAt: true,
  author: { select: PUBLIC_USER },
  reactions: { select: { emoji: true, userId: true, user: { select: { id: true, username: true, displayName: true, fullName: true } } }, orderBy: { id: 'asc' } },
  files: {
    select: { id: true, fileName: true, mime: true, size: true, durationMs: true, transcriptStatus: true, transcript: true, language: true, createdAt: true },
    orderBy: { id: 'asc' },
  },
} satisfies Prisma.WorkChannelMessageSelect;
type MessageRow = Prisma.WorkChannelMessageGetPayload<{ select: typeof MESSAGE_SELECT }>;

export interface RefPreview {
  t: 'issue' | 'test' | 'doc' | 'meeting';
  key: string; n: number; url: string; title: string;
  status?: { name: string; category: string } | null;
  assignee?: { id: number; name: string; avatarUrl: string | null } | null;
  type?: { key: string; name: string; color: string } | null;
  when?: Date | null;
  project?: string;
}

/**
 * Thẻ xem trước cho liên kết nội bộ, dựng THEO QUYỀN NGƯỜI XEM: không vào được dự án / không thấy thẻ (khách: thẻ chưa
 * chia sẻ) / không thấy trang (trang INTERNAL với khách) / không thấy họp ⇒ BỎ HẲN (không nói "có nhưng bị khoá" — không
 * lộ là tồn tại). Một lượt cho cả trang tin.
 */
async function resolvePreviews(viewerId: number, home: ProjectAccess & { wsSlug: string }, refsList: ChatRef[][]): Promise<Map<string, RefPreview>> {
  const out = new Map<string, RefPreview>();
  const want = new Map<string, { ws: string; key: string; t: string; n: number }>();
  for (const refs of refsList) {
    for (const r of refs) {
      if (r.t === 'web') continue;
      const ws = r.ws ?? home.wsSlug;
      want.set(`${r.t}:${ws}:${r.key}:${r.n}`, { ws, key: r.key, t: r.t, n: r.n });
    }
  }
  if (!want.size) return out;
  const projKeys = new Map<string, { ws: string; key: string }>();
  for (const w of want.values()) projKeys.set(`${w.ws}/${w.key}`, { ws: w.ws, key: w.key });
  const projects = await prisma.workProject.findMany({
    where: { deletedAt: null, OR: [...projKeys.values()].map((p) => ({ key: p.key, workspace: { slug: p.ws, deletedAt: null } })) },
    select: { id: true, key: true, name: true, workspace: { select: { slug: true } } },
  });
  for (const p of projects) {
    const access = p.id === home.projectId ? home : await loadProjectAccess(viewerId, p.id);
    if (!access) continue;
    const scoped = isClientScoped(access);
    const mine = [...want.values()].filter((w) => w.ws === p.workspace.slug && w.key === p.key);
    const base = `/work/${p.workspace.slug}/${p.key}`;
    const issueNums = mine.filter((w) => w.t === 'issue' || w.t === 'test').map((w) => w.n);
    if (issueNums.length) {
      const issues = await prisma.workIssue.findMany({
        where: { projectId: p.id, number: { in: issueNums }, deletedAt: null, ...(scoped ? { clientVisible: true } : {}) },
        select: {
          number: true, title: true, status: { select: { name: true, category: true } }, type: { select: { key: true, name: true, color: true } },
          assignee: { select: { id: true, username: true, displayName: true, fullName: true, avatarUrl: true } },
        },
      });
      for (const i of issues) {
        for (const t of ['issue', 'test'] as const) {
          out.set(`${t}:${p.workspace.slug}:${p.key}:${i.number}`, {
            t, key: `${p.key}-${i.number}`, n: i.number, title: i.title, status: i.status, type: i.type, project: p.name,
            assignee: i.assignee ? { id: i.assignee.id, name: displayName(i.assignee), avatarUrl: i.assignee.avatarUrl } : null,
            url: t === 'test' ? `${base}/tests/${i.number}` : `${base}/issue/${i.number}`,
          });
        }
      }
    }
    const docNums = mine.filter((w) => w.t === 'doc').map((w) => w.n);
    if (docNums.length && access.modules.docs) {
      const pages = await prisma.workPage.findMany({
        where: { projectId: p.id, number: { in: docNums }, deletedAt: null },
        select: { number: true, title: true, status: true, visibility: true, owner: { select: { id: true, username: true, displayName: true, fullName: true, avatarUrl: true } } },
      });
      for (const pg of pages) {
        if (!canViewPage(access.role, access.workspaceRole, pg.visibility)) continue;
        out.set(`doc:${p.workspace.slug}:${p.key}:${pg.number}`, {
          t: 'doc', key: `Doc ${pg.number}`, n: pg.number, title: pg.title, status: { name: pg.status, category: pg.status === 'PUBLISHED' || pg.status === 'APPROVED' ? 'DONE' : 'TODO' }, project: p.name,
          assignee: pg.owner ? { id: pg.owner.id, name: displayName(pg.owner), avatarUrl: pg.owner.avatarUrl } : null, url: `${base}/docs/${pg.number}`,
        });
      }
    }
    const meetNums = mine.filter((w) => w.t === 'meeting').map((w) => w.n);
    if (meetNums.length && governanceAccess(access.role, access.workspaceRole).view) {
      const ms = await prisma.workMeeting.findMany({ where: { projectId: p.id, number: { in: meetNums }, deletedAt: null }, select: { number: true, title: true, status: true, startsAt: true } });
      for (const m of ms) {
        out.set(`meeting:${p.workspace.slug}:${p.key}:${m.number}`, {
          t: 'meeting', key: `Meeting ${m.number}`, n: m.number, title: m.title, status: { name: m.status, category: m.status === 'DONE' || m.status === 'HELD' ? 'DONE' : 'TODO' },
          when: m.startsAt, project: p.name, url: `${base}/meetings/${m.number}`,
        });
      }
    }
  }
  return out;
}

function reactionSummary(rows: MessageRow['reactions'], me: number) {
  const map = new Map<string, { emoji: string; count: number; mine: boolean; users: Array<{ id: number; name: string }> }>();
  for (const r of rows) {
    const cur = map.get(r.emoji) ?? { emoji: r.emoji, count: 0, mine: false, users: [] };
    cur.count += 1;
    if (r.userId === me) cur.mine = true;
    if (cur.users.length < 10) cur.users.push({ id: r.user.id, name: displayName(r.user) });
    map.set(r.emoji, cur);
  }
  return [...map.values()];
}

function present(m: MessageRow, me: number, previews: Map<string, RefPreview>, wsSlug: string) {
  const refs = (Array.isArray(m.refs) ? m.refs : []) as ChatRef[];
  const deleted = !!m.deletedAt;
  return {
    id: m.id, channelId: m.channelId, kind: m.kind, parentId: m.parentId, replyCount: m.replyCount, lastReplyAt: m.lastReplyAt,
    createdAt: m.createdAt, editedAt: m.editedAt, deleted, clientKey: m.authorId === me ? m.clientKey : null,
    body: deleted ? '' : m.body,
    author: m.author as PublicUser | null,
    mentions: deleted ? [] : m.mentions,
    meta: deleted ? null : m.meta,
    pinned: m.pinnedAt && !deleted ? { at: m.pinnedAt, byId: m.pinnedById } : null,
    reactions: deleted ? [] : reactionSummary(m.reactions, me),
    files: deleted ? [] : m.files.map((f) => ({
      id: f.id, fileName: f.fileName, mime: f.mime, size: f.size, createdAt: f.createdAt,
      voice: f.durationMs !== null ? { durationMs: f.durationMs, transcriptStatus: f.transcriptStatus ?? 'PENDING', transcript: f.transcriptStatus === 'DONE' ? f.transcript : null, language: f.language } : null,
    })),
    links: deleted ? [] : refs.filter((r): r is Extract<ChatRef, { t: 'web' }> => r.t === 'web').map((r) => ({ url: r.url, domain: r.domain, title: r.title })),
    previews: deleted ? [] : refs.flatMap((r) => (r.t === 'web' ? [] : [previews.get(`${r.t}:${r.ws ?? wsSlug}:${r.key}:${r.n}`)].filter((x): x is RefPreview => !!x))),
  };
}
export type ChatMessage = ReturnType<typeof present>;

async function presentMany(ctx: ChatCtx, rows: MessageRow[]): Promise<ChatMessage[]> {
  const ws = await prisma.workSpace.findUnique({ where: { id: ctx.access.workspaceId }, select: { slug: true } });
  const wsSlug = ws?.slug ?? '';
  const previews = await resolvePreviews(ctx.userId, { ...ctx.access, wsSlug }, rows.filter((r) => !r.deletedAt).map((r) => (Array.isArray(r.refs) ? r.refs : []) as ChatRef[]));
  return rows.map((r) => present(r, ctx.userId, previews, wsSlug));
}

export async function listMessages(userId: number, projectId: number, channelId: number, q: { before?: number; after?: number; around?: number; limit?: number } = {}) {
  const ctx = await ctxOf(userId, projectId);
  await channelFor(ctx, channelId);
  const limit = Math.min(Math.max(q.limit ?? 50, 1), 100);
  const where: Prisma.WorkChannelMessageWhereInput = { channelId, parentId: null, OR: [{ deletedAt: null }, { replyCount: { gt: 0 } }] };
  let rows: MessageRow[];
  let hasMoreBefore = false;
  let hasMoreAfter = false;
  if (q.around) {
    const half = Math.floor(limit / 2);
    const [older, newer] = await Promise.all([
      prisma.workChannelMessage.findMany({ where: { ...where, id: { lt: q.around } }, orderBy: { id: 'desc' }, take: half + 1, select: MESSAGE_SELECT }),
      prisma.workChannelMessage.findMany({ where: { ...where, id: { gte: q.around } }, orderBy: { id: 'asc' }, take: half + 1, select: MESSAGE_SELECT }),
    ]);
    hasMoreBefore = older.length > half;
    hasMoreAfter = newer.length > half;
    rows = [...older.slice(0, half).reverse(), ...newer.slice(0, half)];
  } else if (q.after) {
    const r = await prisma.workChannelMessage.findMany({ where: { ...where, id: { gt: q.after } }, orderBy: { id: 'asc' }, take: limit + 1, select: MESSAGE_SELECT });
    hasMoreAfter = r.length > limit;
    rows = r.slice(0, limit);
  } else {
    const r = await prisma.workChannelMessage.findMany({ where: { ...where, ...(q.before ? { id: { lt: q.before } } : {}) }, orderBy: { id: 'desc' }, take: limit + 1, select: MESSAGE_SELECT });
    hasMoreBefore = r.length > limit;
    rows = r.slice(0, limit).reverse();
  }
  return { messages: await presentMany(ctx, rows), hasMoreBefore, hasMoreAfter };
}

export async function getMessage(userId: number, projectId: number, channelId: number, messageId: number) {
  const ctx = await ctxOf(userId, projectId);
  await channelFor(ctx, channelId);
  const row = await prisma.workChannelMessage.findFirst({ where: { id: messageId, channelId }, select: MESSAGE_SELECT });
  if (!row) throw new NotFoundError('Message not found');
  return (await presentMany(ctx, [row]))[0];
}

export async function getThread(userId: number, projectId: number, channelId: number, rootId: number) {
  const ctx = await ctxOf(userId, projectId);
  await channelFor(ctx, channelId);
  const root = await prisma.workChannelMessage.findFirst({ where: { id: rootId, channelId, parentId: null }, select: MESSAGE_SELECT });
  if (!root) throw new NotFoundError('Message not found');
  const replies = await prisma.workChannelMessage.findMany({ where: { parentId: rootId, deletedAt: null }, orderBy: { id: 'asc' }, take: 500, select: MESSAGE_SELECT });
  const [r, ...rest] = await presentMany(ctx, [root, ...replies]);
  return { root: r, replies: rest };
}

export async function listPinned(userId: number, projectId: number, channelId: number) {
  const ctx = await ctxOf(userId, projectId);
  await channelFor(ctx, channelId);
  const rows = await prisma.workChannelMessage.findMany({ where: { channelId, pinnedAt: { not: null }, deletedAt: null }, orderBy: { pinnedAt: 'desc' }, take: 50, select: MESSAGE_SELECT });
  return presentMany(ctx, rows);
}

/** Tìm trong kênh (chữ tin + tên tệp + phiên âm voice note). */
export async function searchMessages(userId: number, projectId: number, channelId: number, qRaw: string) {
  const ctx = await ctxOf(userId, projectId);
  await channelFor(ctx, channelId);
  const q = qRaw.trim().slice(0, 100);
  if (q.length < 2) return [];
  const rows = await prisma.workChannelMessage.findMany({
    where: {
      channelId, deletedAt: null,
      OR: [
        { body: { contains: q, mode: 'insensitive' } },
        { files: { some: { OR: [{ fileName: { contains: q, mode: 'insensitive' } }, { transcript: { contains: q, mode: 'insensitive' } }] } } },
      ],
    },
    orderBy: { id: 'desc' }, take: 40, select: MESSAGE_SELECT,
  });
  return presentMany(ctx, rows);
}

// ─── Tin nhắn: ghi ───────────────────────────────────────────────

async function ownHosts(): Promise<string[]> {
  try { return [new URL(process.env.FRONTEND_URL ?? '').host].filter(Boolean); } catch { return []; }
}

/** Người được @nhắc: đối chiếu tên với NGƯỜI THẤY KÊNH (không ai khác — kể cả khi gõ đúng tên). */
function resolveMentions(body: string, viewers: Viewer[]): number[] {
  const names = new Set(mentionNames(body));
  if (!names.size) return [];
  return viewers.filter((v) => names.has(v.username.toLowerCase())).map((v) => v.id);
}

async function projectInfo(projectId: number) {
  return prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, name: true, workspace: { select: { slug: true } } } });
}

export const chatUrl = (p: { key: string; workspace: { slug: string } }, channelId: number, messageId?: number, threadId?: number | null) =>
  `/work/${p.workspace.slug}/${p.key}/chat?c=${channelId}${messageId ? `&m=${messageId}` : ''}${threadId ? `&t=${threadId}` : ''}`;

async function systemMessage(ch: { id: number; projectId: number }, actorId: number, text: string, meta: Record<string, unknown>, parentId: number | null = null) {
  const m = await prisma.workChannelMessage.create({ data: { channelId: ch.id, authorId: actorId, kind: 'SYSTEM', body: text.slice(0, 1000), meta: meta as Prisma.InputJsonValue, parentId }, select: { id: true } });
  if (parentId) await prisma.workChannelMessage.update({ where: { id: parentId }, data: { replyCount: { increment: 1 }, lastReplyAt: new Date() } });
  await prisma.workChannel.update({ where: { id: ch.id }, data: { lastMessageAt: new Date() } });
  emitChannel(ch.projectId, ch.id, { type: 'message', messageId: m.id, parentId });
  return m.id;
}

export interface PostInput { body: string; parentId?: number | null; fileIds?: number[]; clientKey?: string | null; meta?: Record<string, unknown> | null }

export async function postMessage(userId: number, projectId: number, channelId: number, input: PostInput): Promise<ChatMessage> {
  const ctx = await ctxOf(userId, projectId);
  const { ch } = await postableChannel(ctx, channelId);
  const body = cleanBody(input.body);
  const fileIds = [...new Set(input.fileIds ?? [])];
  if (!body && !fileIds.length) throw new BadRequestError('Write a message or attach a file', 'WORK_EMPTY_MESSAGE');
  if (fileIds.length > MAX_FILES_PER_MESSAGE) throw new BadRequestError(`A message can have at most ${MAX_FILES_PER_MESSAGE} files`, 'WORK_LIMIT');
  const clientKey = input.clientKey?.trim().slice(0, 64) || null;
  // Hàng chờ ngoại tuyến gửi lại cùng khoá ⇒ trả lại đúng tin đã lưu, không thêm tin trùng.
  if (clientKey) {
    const dup = await prisma.workChannelMessage.findFirst({ where: { authorId: userId, clientKey }, select: { id: true, channelId: true } });
    if (dup) return getMessage(userId, projectId, dup.channelId, dup.id);
  }
  let parentId: number | null = null;
  if (input.parentId) {
    const parent = await prisma.workChannelMessage.findFirst({ where: { id: input.parentId, channelId }, select: { id: true, parentId: true, deletedAt: true } });
    if (!parent) throw new BadRequestError('The message you replied to is gone', 'WORK_BAD_PARENT');
    parentId = parent.parentId ?? parent.id; // luồng MỘT cấp: trả lời một trả lời ⇒ gắn vào gốc
  }
  const viewers = await channelViewers(ch);
  const p = await projectInfo(projectId);
  const mentions = resolveMentions(body, viewers).filter((id) => id !== userId);
  const refs = extractRefs(body, { projectKey: p.key, ownHosts: await ownHosts() });
  const created = await prisma.$transaction(async (tx) => {
    const m = await tx.workChannelMessage.create({
      data: {
        channelId, authorId: userId, body, parentId, mentions, clientKey,
        refs: refs.length ? (refs as unknown as Prisma.InputJsonValue) : undefined,
        meta: input.meta ? (input.meta as Prisma.InputJsonValue) : undefined,
      },
      select: { id: true, createdAt: true },
    });
    if (fileIds.length) {
      const own = await tx.workChannelFile.findMany({ where: { id: { in: fileIds }, channelId, uploaderId: userId, messageId: null }, select: { id: true } });
      if (own.length !== fileIds.length) throw new BadRequestError('Some files are missing or were already sent — upload them again', 'WORK_BAD_ATTACHMENT');
      await tx.workChannelFile.updateMany({ where: { id: { in: fileIds } }, data: { messageId: m.id } });
    }
    if (parentId) await tx.workChannelMessage.update({ where: { id: parentId }, data: { replyCount: { increment: 1 }, lastReplyAt: m.createdAt } });
    await tx.workChannel.update({ where: { id: channelId }, data: { lastMessageAt: m.createdAt } });
    // Người gửi đã "đọc" tới tin của mình.
    await tx.workChannelMember.upsert({
      where: { channelId_userId: { channelId, userId } },
      create: { channelId, userId, lastReadId: parentId ? 0 : m.id, lastReadAt: m.createdAt },
      update: parentId ? {} : { lastReadId: m.id, lastReadAt: m.createdAt },
    });
    return m;
  });
  if (fileIds.length) {
    const { queueChatTranscriptions } = await import('./chatFiles.service.js');
    queueChatTranscriptions(created.id);
  }
  const msg = await getMessage(userId, projectId, channelId, created.id);
  emitChannel(projectId, channelId, { type: 'message', messageId: created.id, parentId, message: { ...msg, previews: [], clientKey: null }, hasPreviews: msg.previews.length > 0 });
  void fanOut({ ch, p, authorId: userId, messageId: created.id, parentId, body, mentions, viewers, hasFiles: fileIds.length > 0 }).catch((err) => logger.warn('[work] chat fan-out lỗi', { err: (err as Error).message }));
  return msg;
}

/**
 * Báo cho từng người thấy kênh: sự kiện `work:chat:notify` (badge/âm/thông báo hệ thống — cờ `alert` tính theo cài
 * đặt của CHÍNH người nhận), chuông cho người được @nhắc / được trả lời, hộp thư agent khi @nhắc agent.
 */
async function fanOut(a: {
  ch: ChannelRow; p: { key: string; name: string; workspace: { slug: string } }; authorId: number; messageId: number; parentId: number | null;
  body: string; mentions: number[]; viewers: Viewer[]; hasFiles: boolean;
}) {
  const author = await prisma.user.findUnique({ where: { id: a.authorId }, select: PUBLIC_USER });
  const authorName = author ? displayName(author) : 'Someone';
  const excerpt = plainText(a.body, 160) || (a.hasFiles ? 'Sent a file' : '');
  const url = chatUrl(a.p, a.ch.id, a.messageId, a.parentId);
  // Người được trả lời: tác giả gốc + người đã trả lời trước trong luồng.
  const replyTo = new Set<number>();
  if (a.parentId) {
    const [root, prior] = await Promise.all([
      prisma.workChannelMessage.findUnique({ where: { id: a.parentId }, select: { authorId: true } }),
      prisma.workChannelMessage.findMany({ where: { parentId: a.parentId, deletedAt: null, id: { not: a.messageId } }, distinct: ['authorId'], select: { authorId: true }, take: 50 }),
    ]);
    if (root?.authorId) replyTo.add(root.authorId);
    for (const r of prior) if (r.authorId) replyTo.add(r.authorId);
    replyTo.delete(a.authorId);
  }
  const humans = a.viewers.filter((v) => v.kind !== 'AGENT' && v.id !== a.authorId);
  const ids = humans.map((h) => h.id);
  const [prefs, states, quiet] = await Promise.all([
    prisma.workChatPref.findMany({ where: { userId: { in: ids } }, select: { userId: true, mutedUntil: true, notify: true, sound: true, desktop: true } }),
    prisma.workChannelMember.findMany({ where: { channelId: a.ch.id, userId: { in: ids } }, select: { userId: true, mutedUntil: true, notify: true } }),
    prisma.workNotifySetting.findMany({ where: { userId: { in: ids } }, select: { userId: true, quietStart: true, quietEnd: true } }),
  ]);
  const P = new Map(prefs.map((x) => [x.userId, x]));
  const S = new Map(states.map((x) => [x.userId, x]));
  const Q = new Map(quiet.map((x) => [x.userId, x]));
  const now = new Date();
  const io = getIO();
  const mentionSet = new Set(a.mentions);
  for (const h of humans) {
    const g = P.get(h.id);
    const c = S.get(h.id);
    const q = Q.get(h.id);
    const mention = mentionSet.has(h.id) || replyTo.has(h.id);
    const alert = shouldAlert({
      own: false, mention, globalMutedUntil: g?.mutedUntil, channelMutedUntil: c?.mutedUntil,
      mode: effectiveMode(c?.notify, g?.notify), quiet: inQuiet(q?.quietStart, q?.quietEnd, now), now,
    });
    io?.to(`user:${h.id}`).emit('work:chat:notify', {
      projectId: a.ch.projectId, projectKey: a.p.key, projectName: a.p.name, channelId: a.ch.id, channelName: a.ch.name,
      messageId: a.messageId, parentId: a.parentId, author: author ?? null, authorName, excerpt, url,
      mention, alert, sound: g?.sound ?? true, desktop: g?.desktop ?? true,
      // Tin trong luồng không cộng badge kênh (như Slack) — người liên quan đã có chuông.
      counts: !a.parentId && !(isMuted(c?.mutedUntil, now) && !mention),
    });
  }
  // Chuông (+ đẩy iOS): @nhắc ⇒ WORK_MENTION; trả lời luồng của mình ⇒ WORK_COMMENT (reply). Không email tức thì (notify.ts).
  const payload = { chat: true, issueKey: `#${a.ch.name}`, title: `${a.p.key} · ${a.p.name}`, url, excerpt };
  for (const uid of a.mentions) {
    if (humans.some((h) => h.id === uid)) {
      await notifyWork({ receiverId: uid, senderId: a.authorId, type: 'WORK_MENTION', entityId: a.ch.id, secondaryEntityId: a.messageId, payload });
    }
  }
  for (const uid of replyTo) {
    if (mentionSet.has(uid) || !humans.some((h) => h.id === uid)) continue;
    await notifyWork({ receiverId: uid, senderId: a.authorId, type: 'WORK_COMMENT', entityId: a.ch.id, secondaryEntityId: a.messageId, payload: { ...payload, reply: true } });
  }
  // AI agent được @nhắc ⇒ hộp thư của agent (SSE / poll / webhook) — chống tự kích: agent không nhận tin của chính nó.
  const agentIds = a.viewers.filter((v) => v.kind === 'AGENT' && mentionSet.has(v.id) && v.id !== a.authorId).map((v) => v.id);
  if (agentIds.length) {
    const { recordInbox } = await import('./agentEvents.js');
    const agents = await prisma.workAgent.findMany({ where: { userId: { in: agentIds }, status: { not: 'RETIRED' } }, select: { id: true } });
    for (const ag of agents) {
      await recordInbox({
        agentId: ag.id, projectId: a.ch.projectId, type: 'chat.mention', summary: `${authorName} mentioned you in #${a.ch.name}: ${excerpt}`.slice(0, 300),
        actor: { userId: a.authorId, kind: 'USER' }, extra: { channel: a.ch.name, channelId: a.ch.id, messageId: a.messageId, threadId: a.parentId, url },
      }).catch(() => undefined);
    }
  }
}

/** Báo nhẹ cho mọi người thấy kênh (đổi tên/lưu trữ) — client tải lại danh sách kênh. */
async function broadcastToViewers(ch: { id: number; projectId: number; kind: string }, payload: Record<string, unknown>) {
  const io = getIO();
  if (!io) return;
  for (const v of await channelViewers(ch)) io.to(`user:${v.id}`).emit('work:chat:changed', { projectId: ch.projectId, channelId: ch.id, ...payload });
}

async function ownMessage(ctx: ChatCtx, channelId: number, messageId: number) {
  const m = await prisma.workChannelMessage.findFirst({ where: { id: messageId, channelId }, select: { id: true, authorId: true, kind: true, body: true, deletedAt: true, parentId: true, pinnedAt: true } });
  if (!m || m.deletedAt) throw new NotFoundError('Message not found');
  return m;
}

export async function editMessage(userId: number, projectId: number, channelId: number, messageId: number, bodyRaw: string) {
  const ctx = await ctxOf(userId, projectId);
  const { ch } = await postableChannel(ctx, channelId);
  const m = await ownMessage(ctx, channelId, messageId);
  if (m.authorId !== userId || m.kind !== 'USER') throw new ForbiddenError('You can only edit your own messages');
  const body = cleanBody(bodyRaw);
  const hasFiles = await prisma.workChannelFile.count({ where: { messageId } });
  if (!body && !hasFiles) throw new BadRequestError('A message cannot be empty — delete it instead', 'WORK_EMPTY_MESSAGE');
  if (body === m.body) return getMessage(userId, projectId, channelId, messageId);
  const viewers = await channelViewers(ch);
  const p = await projectInfo(projectId);
  const before = new Set((await prisma.workChannelMessage.findUnique({ where: { id: messageId }, select: { mentions: true } }))?.mentions ?? []);
  const mentions = resolveMentions(body, viewers).filter((id) => id !== userId);
  const refs = extractRefs(body, { projectKey: p.key, ownHosts: await ownHosts() });
  await prisma.workChannelMessage.update({ where: { id: messageId }, data: { body, mentions, refs: refs.length ? (refs as unknown as Prisma.InputJsonValue) : Prisma.DbNull, editedAt: new Date() } });
  emitChannel(projectId, channelId, { type: 'update', messageId, parentId: m.parentId });
  // Người MỚI được nhắc khi sửa vẫn nhận chuông (không báo lại người đã được nhắc).
  const fresh = mentions.filter((id) => !before.has(id));
  if (fresh.length) {
    const url = chatUrl(p, channelId, messageId, m.parentId);
    for (const uid of fresh) {
      if (viewers.some((v) => v.id === uid && v.kind !== 'AGENT')) {
        await notifyWork({ receiverId: uid, senderId: userId, type: 'WORK_MENTION', entityId: channelId, secondaryEntityId: messageId, payload: { chat: true, issueKey: `#${ch.name}`, title: `${p.key} · ${p.name}`, url, excerpt: plainText(body, 160) } });
      }
    }
  }
  return getMessage(userId, projectId, channelId, messageId);
}

export async function deleteMessage(userId: number, projectId: number, channelId: number, messageId: number) {
  const ctx = await ctxOf(userId, projectId);
  const { ch } = await channelFor(ctx, channelId);
  const m = await ownMessage(ctx, channelId, messageId);
  const own = m.authorId === userId;
  if (!own && !canModerate(ctx.actor)) throw new ForbiddenError('You can only delete your own messages');
  await prisma.workChannelMessage.update({ where: { id: messageId }, data: { deletedAt: new Date(), pinnedAt: null, pinnedById: null } });
  if (m.parentId) await prisma.workChannelMessage.update({ where: { id: m.parentId }, data: { replyCount: { decrement: 1 } } }).catch(() => undefined);
  // Tệp của tin bị xoá: gỡ khỏi R2 (dữ liệu cá nhân — voice note), giữ dòng để kiểm toán số lượng.
  const { purgeMessageFiles } = await import('./chatFiles.service.js');
  await purgeMessageFiles(messageId);
  await auditProject(projectId, {
    actorId: userId, action: own ? 'chat.message.delete' : 'chat.message.moderate', targetType: 'chat_message', targetId: messageId,
    summary: `${own ? 'Deleted own message' : 'Removed a message'} in #${ch.name}`,
    detail: { channelId, authorId: m.authorId, excerpt: plainText(m.body, 200) },
  });
  emitChannel(projectId, channelId, { type: 'delete', messageId, parentId: m.parentId });
  return { deleted: true };
}

export async function toggleReaction(userId: number, projectId: number, channelId: number, messageId: number, emojiRaw: string, active?: boolean) {
  const ctx = await ctxOf(userId, projectId);
  await postableChannel(ctx, channelId);
  await ownMessage(ctx, channelId, messageId);
  const emoji = decodeURIComponent(emojiRaw).trim();
  if (!validEmoji(emoji)) throw new BadRequestError('Pick an emoji', 'WORK_BAD_EMOJI');
  const cur = await prisma.workChannelReaction.findFirst({ where: { messageId, userId, emoji }, select: { id: true } });
  const want = active ?? !cur;
  if (want && !cur) {
    const distinct = await prisma.workChannelReaction.findMany({ where: { messageId }, distinct: ['emoji'], select: { emoji: true } });
    if (distinct.length >= 20 && !distinct.some((d) => d.emoji === emoji)) throw new BadRequestError('Too many different reactions on this message', 'WORK_LIMIT');
    await prisma.workChannelReaction.create({ data: { messageId, userId, emoji } }).catch(() => undefined);
  } else if (!want && cur) {
    await prisma.workChannelReaction.delete({ where: { id: cur.id } }).catch(() => undefined);
  }
  const rows = await prisma.workChannelReaction.findMany({ where: { messageId }, orderBy: { id: 'asc' }, select: { emoji: true, userId: true, user: { select: { id: true, username: true, displayName: true, fullName: true } } } });
  emitChannel(projectId, channelId, { type: 'reaction', messageId, userId });
  return { messageId, reactions: reactionSummary(rows, userId) };
}

export async function setPinned(userId: number, projectId: number, channelId: number, messageId: number, pinned: boolean) {
  const ctx = await ctxOf(userId, projectId);
  const { ch, member } = await channelFor(ctx, channelId);
  if (!canPin(ctx.actor, ch, member)) throw new ForbiddenError('You cannot pin messages in this channel');
  const m = await ownMessage(ctx, channelId, messageId);
  if (!!m.pinnedAt === pinned) return { messageId, pinned };
  if (pinned && await prisma.workChannelMessage.count({ where: { channelId, pinnedAt: { not: null }, deletedAt: null } }) >= 50) {
    throw new BadRequestError('A channel can have at most 50 pinned messages', 'WORK_LIMIT');
  }
  await prisma.workChannelMessage.update({ where: { id: messageId }, data: pinned ? { pinnedAt: new Date(), pinnedById: userId } : { pinnedAt: null, pinnedById: null } });
  await auditProject(projectId, { actorId: userId, action: pinned ? 'chat.message.pin' : 'chat.message.unpin', targetType: 'chat_message', targetId: messageId, summary: `${pinned ? 'Pinned' : 'Unpinned'} a message in #${ch.name}`, detail: { channelId, excerpt: plainText(m.body, 160) } });
  emitChannel(projectId, channelId, { type: 'pin', messageId, pinned });
  return { messageId, pinned };
}

// ─── Đã đọc ──────────────────────────────────────────────────────

export async function markRead(userId: number, projectId: number, channelId: number, messageId?: number) {
  const ctx = await ctxOf(userId, projectId);
  await channelFor(ctx, channelId);
  const latest = await prisma.workChannelMessage.findFirst({ where: { channelId, ...(messageId ? { id: { lte: messageId } } : {}) }, orderBy: { id: 'desc' }, select: { id: true } });
  const id = latest?.id ?? 0;
  await ensureStates(userId, [channelId]);
  // Chỉ tiến lên (hai tab mở cùng kênh không kéo mốc lùi lại).
  await prisma.workChannelMember.updateMany({ where: { channelId, userId, lastReadId: { lt: id } }, data: { lastReadId: id, lastReadAt: new Date() } });
  getIO()?.to(`user:${userId}`).emit('work:chat:read', { projectId, channelId, lastReadId: id });
  return { channelId, lastReadId: id };
}

export async function markAllRead(userId: number, projectId: number) {
  const ctx = await ctxOf(userId, projectId);
  const { rows } = await visibleChannels(ctx);
  for (const c of rows) await markRead(userId, projectId, c.id);
  return { channels: rows.length };
}

// ─── Gọi nhóm · tạo thẻ · chuyển tiếp ────────────────────────────

const MEET_HOSTS = /^(meet\.google\.com|meet\.jit\.si|[\w-]+\.zoom\.us|zoom\.us|teams\.microsoft\.com|teams\.live\.com)$/i;

/**
 * "Gọi nhóm": dùng lại cuộc gọi đang mở của kênh (≤ 4 giờ), không thì tạo phòng Jitsi mới (khó đoán — như Meetings)
 * hoặc nhận link Meet/Zoom/Teams người dùng dán. Đăng tin "đang gọi" vào kênh ⇒ mọi người bấm vào là vào phòng.
 */
export async function startCall(userId: number, projectId: number, channelId: number, input: { url?: string | null } = {}) {
  const ctx = await ctxOf(userId, projectId);
  if (ctx.access.principal === 'AGENT') throw new ForbiddenError('AI agents cannot start calls');
  const { ch } = await postableChannel(ctx, channelId);
  const now = new Date();
  let url = input.url?.trim() || null;
  if (url) {
    let host = '';
    try { const u = new URL(url); if (u.protocol !== 'https:') throw new Error(); host = u.hostname; } catch { throw new BadRequestError('Paste an https:// meeting link', 'WORK_BAD_URL'); }
    if (!MEET_HOSTS.test(host)) throw new BadRequestError('Use a Google Meet, Jitsi, Zoom or Teams link', 'WORK_BAD_URL');
  } else if (ch.callUrl && ch.callStartedAt && now.getTime() - ch.callStartedAt.getTime() < CALL_REUSE_MS) {
    url = ch.callUrl;
    return { url, reused: true, messageId: null };
  } else {
    url = newJitsiUrl();
  }
  await prisma.workChannel.update({ where: { id: ch.id }, data: { callUrl: url, callStartedAt: now } });
  const messageId = await systemMessage(ch, userId, 'started a call', { type: 'call', url });
  const p = await projectInfo(projectId);
  await fanOut({ ch, p, authorId: userId, messageId, parentId: null, body: '📞 started a call — join now', mentions: [], viewers: await channelViewers(ch), hasFiles: false });
  return { url, reused: false, messageId };
}

/** "Tạo thẻ" từ một tin: nội dung tin làm mô tả + link ngược về tin; trả lời trong luồng "Created KEY-n". */
export async function createIssueFromMessage(userId: number, projectId: number, channelId: number, messageId: number, input: { typeId: number; title?: string | null }) {
  const ctx = await ctxOf(userId, projectId);
  const { ch } = await channelFor(ctx, channelId);
  const m = await ownMessage(ctx, channelId, messageId);
  const p = await projectInfo(projectId);
  const author = m.authorId ? await prisma.user.findUnique({ where: { id: m.authorId }, select: PUBLIC_USER }) : null;
  const link = chatUrl(p, channelId, messageId, m.parentId);
  const title = (input.title?.trim() || plainText(m.body, 120) || `From #${ch.name}`).slice(0, 255);
  const { markdownToTiptap } = await import('./docMarkdown.js');
  const md = `${m.body}\n\n— ${author ? displayName(author) : 'Someone'} in [#${ch.name}](${link})`;
  const { createIssueAs } = await import('./issues.service.js');
  const issue = await createIssueAs(userId, projectId, { typeId: input.typeId, title, descriptionJson: markdownToTiptap(md).doc as unknown as Prisma.InputJsonValue });
  const root = m.parentId ?? m.id;
  await systemMessage(ch, userId, `created ${p.key}-${issue.number}: ${title}`, { type: 'issue', key: `${p.key}-${issue.number}`, number: issue.number, title, url: `/work/${p.workspace.slug}/${p.key}/issue/${issue.number}` }, root);
  return { number: issue.number, key: `${p.key}-${issue.number}`, url: `/work/${p.workspace.slug}/${p.key}/issue/${issue.number}` };
}

/** Chuyển tiếp một tin sang kênh khác CÙNG dự án (người gửi phải đăng được ở kênh đích). */
export async function forwardMessage(userId: number, projectId: number, channelId: number, messageId: number, input: { toChannelId: number; note?: string | null }) {
  const ctx = await ctxOf(userId, projectId);
  const { ch } = await channelFor(ctx, channelId);
  const m = await ownMessage(ctx, channelId, messageId);
  if (input.toChannelId === channelId) throw new BadRequestError('Pick another channel', 'WORK_BAD_CHANNEL');
  const target = await channelFor(ctx, input.toChannelId);
  // Không đưa tin kênh RIÊNG ra kênh rộng hơn mà không có người thấy — chặn chuyển từ PRIVATE/CLIENT sang loại khác.
  if (ch.kind === 'PRIVATE' && target.ch.kind !== 'PRIVATE') throw new BadRequestError('Messages from a private channel can only be forwarded to another private channel', 'WORK_FORWARD_PRIVATE');
  if (target.ch.kind === 'CLIENT' && ch.kind !== 'CLIENT') throw new BadRequestError('Internal messages cannot be forwarded to the client channel', 'WORK_FORWARD_CLIENT');
  const author = m.authorId ? await prisma.user.findUnique({ where: { id: m.authorId }, select: PUBLIC_USER }) : null;
  const note = cleanBody(input.note ?? '');
  const quoted = m.body.split('\n').map((l) => `> ${l}`).join('\n');
  const body = `${note ? `${note}\n\n` : ''}${quoted}`.slice(0, 8000);
  return postMessage(userId, projectId, input.toChannelId, {
    body,
    meta: { type: 'forward', from: { channelId, channel: ch.name, messageId, author: author ? displayName(author) : null } },
  });
}

// ─── Email tóm tắt tin chưa đọc (thư gộp 08:00 sẵn có; mặc định TẮT) ─

/** Gọi đầu `sendDigests` (notify.ts): người BẬT emailDigest ⇒ một dòng tóm tắt vào hàng đợi thư gộp. */
export async function queueChatDigests(): Promise<number> {
  const prefs = await prisma.workChatPref.findMany({ where: { emailDigest: true }, select: { userId: true, lastDigestAt: true } });
  let n = 0;
  for (const p of prefs) {
    try {
      const r = await unreadAll(p.userId);
      if (r.total > 0) {
        const mentions = r.projects.reduce((a, x) => a + x.mentions, 0);
        await prisma.workEmailQueue.create({
          data: { userId: p.userId, kind: 'WORK_CHAT', subject: `${r.total} unread chat ${r.total === 1 ? 'message' : 'messages'}${mentions ? ` (${mentions} mentioning you)` : ''} in ${r.projects.length} ${r.projects.length === 1 ? 'project' : 'projects'}`.slice(0, 240), url: '/work' },
        });
        n += 1;
      }
      await prisma.workChatPref.update({ where: { userId: p.userId }, data: { lastDigestAt: new Date() } });
    } catch (err) {
      logger.warn('[work] chat digest lỗi', { userId: p.userId, err: (err as Error).message });
    }
  }
  return n;
}

// ─── Cho registry (agent / MCP / Ask AI) ─────────────────────────

/** Kênh theo tên ("general", "#frontend") trong dự án — chỉ kênh người gọi thấy được. */
export async function channelByName(userId: number, projectId: number, nameRaw: string | null | undefined) {
  const ctx = await ctxOf(userId, projectId);
  const { rows } = await visibleChannels(ctx);
  const want = (nameRaw ?? GENERAL).replace(/^#/, '').trim().toLowerCase();
  const ch = rows.find((r) => r.name === want);
  if (!ch) throw new NotFoundError(`Channel #${want} not found. Channels you can use: ${rows.map((r) => `#${r.name}`).join(', ') || '(none)'}`);
  return ch;
}

export async function channelsForAgent(userId: number, projectId: number) {
  const r = await listChannels(userId, projectId);
  return r.channels.map((c) => ({ name: c.name, kind: c.kind, topic: c.topic, unread: c.unread, canPost: c.canPost }));
}
