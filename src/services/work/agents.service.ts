/**
 * CT Work — AI agent là thành viên hạng nhất (CTW-28, 06/10/2026). Thiết kế: docs/ct-work-ai-agents-thiet-ke.md.
 *
 * Agent LÀ một User kind=AGENT + hồ sơ WorkAgent (1:1). Mọi khoá ngoại sẵn có (assignee, author, actor, worklog…)
 * trỏ users.id ⇒ không bảng nào mọc cột thứ hai, và bot `fp_*` chuyển thành agent GIỮ NGUYÊN id (convertUser).
 *
 *   - Quản lý (tạo / sửa / tạm dừng / retire / convert / token): OWNER/ADMIN không gian (`workspace.members`), hoặc
 *     người chịu trách nhiệm (owner) với agent của mình (trừ đổi chủ + convert + tạo — chỉ admin).
 *   - Agent KHÔNG BAO GIỜ đăng nhập: password NULL, provider 'agent', email `<username>@agents.invalid` (RFC 2606 —
 *     không bao giờ gửi được), emailVerified sẵn, thông báo email OFF. Xác thực DUY NHẤT bằng token ctw_ gắn agent.
 *   - Lease (claim/heartbeat/release) = "đang làm" — khoá mềm, mỗi thẻ một lease ACTIVE (UNIQUE active_issue_id).
 *     Sweeper 60 s: hết hạn ⇒ EXPIRED + cờ Blocked + báo owner + inbox `lease.expired`. KHÔNG tự bỏ giao.
 *   - Cài đặt dự án `settings.agents` (Done⇒Review…) đọc bằng permissions.agentOptionsOf.
 *
 * Mọi hàm quản trị đi qua `scopeOf` — người gọi là AGENT ⇒ 403 WORK_AGENT_FORBIDDEN: token agent không tự nhân bản
 * (tạo token/agent/webhook) được, kể cả khi tuyến quên chặn.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { getIO } from '../../socket/messaging.socket.js';
import { audit, auditProject } from './audit.js';
import { displayName, PUBLIC_USER, slugify } from './common.js';
import { AGENT_PROJECT_ROLES, AGENT_RUNTIMES } from './constants.js';
import { emitWorkEvent, projectRoom } from './events.js';
import { applyIssueChange } from './issueChange.js';
import { agentForbidden, agentOptionsOf, loadWorkspaceAccess, requireProject, type AgentOptions } from './permissions.js';
import { issueAgentToken, tokenProjectIds } from './apiTokens.service.js';
import { invalidateAgentCache, recordInbox } from './agentEvents.js';

type Tx = Prisma.TransactionClient;

const MAX_AGENTS_PER_WORKSPACE = 50;
const LEASE_MAX_MINUTES = 240;

export const AGENT_SELECT = {
  id: true, userId: true, workspaceId: true, ownerId: true, model: true, roleText: true, capabilities: true, runtime: true,
  status: true, parallelSlots: true, dailyCostCapUsd: true, lastSeenAt: true, createdAt: true, updatedAt: true, retiredAt: true,
  user: { select: PUBLIC_USER },
  owner: { select: PUBLIC_USER },
} satisfies Prisma.WorkAgentSelect;

type AgentRow = Prisma.WorkAgentGetPayload<{ select: typeof AGENT_SELECT }>;

// ─── Quyền quản lý ───────────────────────────────────────────────

interface Scope { isAdmin: boolean }

/** Người gọi trong không gian: phải là NGƯỜI (token agent không quản lý agent), không phải khách. */
async function scopeOf(callerId: number, workspaceId: number, need: 'view' | 'admin'): Promise<Scope> {
  const a = await loadWorkspaceAccess(callerId, workspaceId);
  if (!a) throw new NotFoundError('Workspace not found');
  if (a.principal === 'AGENT') throw await agentForbidden(callerId, 'manage AI agents');
  if (a.role === 'GUEST') throw new ForbiddenError('Guests cannot see the workspace agents');
  const isAdmin = a.role === 'OWNER' || a.role === 'ADMIN';
  if (need === 'admin' && !isAdmin) throw new ForbiddenError('Only workspace owners and admins can do this');
  return { isAdmin };
}

async function findAgent(workspaceId: number, agentId: number): Promise<AgentRow> {
  const a = await prisma.workAgent.findFirst({ where: { id: agentId, workspaceId }, select: AGENT_SELECT });
  if (!a) throw new NotFoundError('Agent not found');
  return a;
}

/** Quản lý một agent: admin không gian, hoặc người chịu trách nhiệm agent đó. */
async function manageable(callerId: number, workspaceId: number, agentId: number): Promise<{ agent: AgentRow; scope: Scope }> {
  const scope = await scopeOf(callerId, workspaceId, 'view');
  const agent = await findAgent(workspaceId, agentId);
  if (!scope.isAdmin && agent.ownerId !== callerId) throw new ForbiddenError("Only the agent's owner or a workspace admin can do this");
  return { agent, scope };
}

/** Người chịu trách nhiệm: NGƯỜI, còn bật, thành viên không gian (không phải khách). */
async function assertOwnerCandidate(workspaceId: number, ownerId: number) {
  const m = await prisma.workMember.findFirst({
    where: { workspaceId, userId: ownerId },
    select: { role: true, user: { select: { kind: true, enabled: true } } },
  });
  if (!m || m.role === 'GUEST' || m.user.kind !== 'HUMAN' || !m.user.enabled) {
    throw new BadRequestError('The owner must be a person who is a member of this workspace (not a guest or another agent)', 'WORK_AGENT_BAD_OWNER');
  }
}

async function assertProjectsInWorkspace(workspaceId: number, ids: number[]) {
  if (!ids.length) return;
  const n = await prisma.workProject.count({ where: { id: { in: ids }, workspaceId, deletedAt: null } });
  if (n !== new Set(ids).size) throw new BadRequestError('Some projects are not in this workspace', 'WORK_BAD_PROJECT');
}

function shape(a: AgentRow, extra: Record<string, unknown> = {}) {
  return { ...a, user: { ...a.user, kind: 'AGENT' }, ...extra };
}

// ─── Tạo / đọc / sửa ─────────────────────────────────────────────

async function freeUsername(name: string, workspaceId: number): Promise<string> {
  const base = slugify(name, 24).replace(/-/g, '_');
  for (let i = 0; i < 50; i++) {
    const u = `agent_${base}_${workspaceId}${i ? `_${i + 1}` : ''}`.slice(0, 50);
    if (!(await prisma.user.findUnique({ where: { username: u }, select: { id: true } }))) return u;
  }
  return `agent_${Date.now().toString(36)}_${workspaceId}`.slice(0, 50);
}

export interface CreateAgentInput {
  name: string;
  model: string;
  ownerId?: number;
  roleText?: string | null;
  capabilities?: Record<string, boolean>;
  runtime?: (typeof AGENT_RUNTIMES)[number];
  parallelSlots?: number;
  /** Thêm agent vào các dự án này (vai MEMBER mặc định). Dự án WORKSPACE vốn đã thấy được với vai MEMBER. */
  projectIds?: number[];
  projectRole?: (typeof AGENT_PROJECT_ROLES)[number];
  /** Token đầu tiên — mặc định read+write mọi dự án; null = không tạo. */
  token?: { name?: string; scopes?: Array<'read' | 'write'>; projectIds?: number[]; expiresInDays?: number | null } | null;
}

export async function createAgent(callerId: number, workspaceId: number, input: CreateAgentInput) {
  await scopeOf(callerId, workspaceId, 'admin');
  const name = input.name.trim().slice(0, 100);
  if (!name) throw new BadRequestError('Give the agent a name', 'WORK_NAME_REQUIRED');
  const model = input.model.trim().slice(0, 80);
  if (!model) throw new BadRequestError('Say which model the agent runs on', 'WORK_AGENT_MODEL');
  if (input.runtime === 'BUILTIN') throw new BadRequestError('Built-in agents arrive in phase 2', 'WORK_AGENT_RUNTIME');
  const ownerId = input.ownerId ?? callerId;
  await assertOwnerCandidate(workspaceId, ownerId);
  const projectIds = [...new Set(input.projectIds ?? [])];
  await assertProjectsInWorkspace(workspaceId, projectIds);
  await assertProjectsInWorkspace(workspaceId, input.token?.projectIds ?? []);
  const count = await prisma.workAgent.count({ where: { workspaceId, status: { not: 'RETIRED' } } });
  if (count >= MAX_AGENTS_PER_WORKSPACE) throw new BadRequestError(`A workspace can have at most ${MAX_AGENTS_PER_WORKSPACE} agents`, 'WORK_LIMIT');
  const username = await freeUsername(name, workspaceId);
  const now = new Date();

  const { agentId, token } = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        username, email: `${username}@agents.invalid`, password: null, provider: 'agent',
        emailVerified: true, emailVerifiedAt: now, kind: 'AGENT', fullName: name, displayName: name,
      },
      select: { id: true },
    });
    await tx.workMember.create({ data: { workspaceId, userId: user.id, role: 'MEMBER' } });
    await tx.workNotifySetting.create({ data: { userId: user.id, emailMode: 'OFF' } });
    const agent = await tx.workAgent.create({
      data: {
        userId: user.id, workspaceId, ownerId, model, roleText: input.roleText?.trim().slice(0, 300) || null,
        capabilities: (input.capabilities ?? {}) as Prisma.InputJsonValue, runtime: 'EXTERNAL',
        parallelSlots: Math.min(Math.max(input.parallelSlots ?? 1, 1), 10), createdById: callerId,
      },
      select: { id: true, userId: true },
    });
    for (const projectId of projectIds) {
      await tx.workProjectMember.create({ data: { projectId, userId: user.id, role: input.projectRole ?? 'MEMBER' } });
    }
    const tok = input.token === null ? null : await issueAgentToken(agent, {
      name: input.token?.name ?? 'Default', scopes: input.token?.scopes ?? ['read', 'write'],
      projectIds: input.token?.projectIds, expiresInDays: input.token?.expiresInDays ?? null,
    }, tx);
    return { agentId: agent.id, token: tok };
  });
  invalidateAgentCache();
  await audit({
    workspaceId, actorId: callerId, action: 'agent.create', targetType: 'agent', targetId: agentId,
    summary: `Created AI agent @${username} (${model})`, detail: { ownerId, projectIds },
  });
  if (token) await audit({ workspaceId, actorId: callerId, action: 'agent.token.create', targetType: 'agent', targetId: agentId, summary: `Created token "${token.name}" for @${username}`, detail: { tokenId: token.id } });
  return { agent: shape(await findAgent(workspaceId, agentId)), token };
}

export async function listAgents(callerId: number, workspaceId: number, q: { includeRetired?: boolean } = {}) {
  await scopeOf(callerId, workspaceId, 'view');
  const rows = await prisma.workAgent.findMany({
    where: { workspaceId, ...(q.includeRetired ? {} : { status: { not: 'RETIRED' } }) },
    orderBy: { id: 'asc' },
    select: { ...AGENT_SELECT, leases: { where: { status: 'ACTIVE' }, select: { id: true, issueId: true, projectId: true, expiresAt: true, progressPct: true } } },
  });
  return rows.map(({ leases, ...a }) => shape(a, { activeLeases: leases }));
}

export async function getAgent(callerId: number, workspaceId: number, agentId: number) {
  const scope = await scopeOf(callerId, workspaceId, 'view');
  const agent = await findAgent(workspaceId, agentId);
  const canManage = scope.isAdmin || agent.ownerId === callerId;
  const [leases, projects] = await Promise.all([
    prisma.workAgentLease.findMany({ where: { agentId, status: 'ACTIVE' }, select: { id: true, issueId: true, projectId: true, claimedAt: true, expiresAt: true, progress: true, progressPct: true } }),
    prisma.workProjectMember.findMany({ where: { userId: agent.userId, project: { deletedAt: null } }, select: { role: true, project: { select: { id: true, key: true, name: true } } } }),
  ]);
  return shape(agent, { canManage, activeLeases: leases, projects: projects.map((p) => ({ ...p.project, role: p.role })) });
}

export interface UpdateAgentInput {
  name?: string;
  model?: string;
  roleText?: string | null;
  capabilities?: Record<string, boolean>;
  ownerId?: number;
  parallelSlots?: number;
  dailyCostCapUsd?: number | null;
}

export async function updateAgent(callerId: number, workspaceId: number, agentId: number, input: UpdateAgentInput) {
  const { agent, scope } = await manageable(callerId, workspaceId, agentId);
  if (agent.status === 'RETIRED') throw new BadRequestError('This agent is retired', 'WORK_AGENT_RETIRED');
  const data: Prisma.WorkAgentUpdateInput = {};
  if (input.model !== undefined) {
    const m = input.model.trim().slice(0, 80);
    if (!m) throw new BadRequestError('Say which model the agent runs on', 'WORK_AGENT_MODEL');
    data.model = m;
  }
  if (input.roleText !== undefined) data.roleText = input.roleText?.trim().slice(0, 300) || null;
  if (input.capabilities !== undefined) data.capabilities = input.capabilities as Prisma.InputJsonValue;
  if (input.parallelSlots !== undefined) data.parallelSlots = Math.min(Math.max(Math.round(input.parallelSlots), 1), 10);
  if (input.dailyCostCapUsd !== undefined) data.dailyCostCapUsd = input.dailyCostCapUsd === null ? null : Math.max(0, input.dailyCostCapUsd);
  if (input.ownerId !== undefined && input.ownerId !== agent.ownerId) {
    // Đổi chủ là việc của admin (owner không tự đẩy trách nhiệm sang người khác).
    if (!scope.isAdmin) throw new ForbiddenError('Only workspace owners and admins can change an agent\'s owner');
    await assertOwnerCandidate(workspaceId, input.ownerId);
    data.owner = { connect: { id: input.ownerId } };
  }
  const name = input.name?.trim().slice(0, 100);
  await prisma.$transaction(async (tx) => {
    if (Object.keys(data).length) await tx.workAgent.update({ where: { id: agentId }, data });
    if (name) await tx.user.update({ where: { id: agent.userId }, data: { fullName: name, displayName: name } });
  });
  await audit({
    workspaceId, actorId: callerId, action: 'agent.update', targetType: 'agent', targetId: agentId,
    summary: `Updated AI agent @${agent.user.username}`, detail: { ...input, ...(input.ownerId !== undefined ? { fromOwnerId: agent.ownerId } : {}) },
  });
  invalidateAgentCache();
  return getAgent(callerId, workspaceId, agentId);
}

// ─── Vòng đời ────────────────────────────────────────────────────

async function retireTx(tx: Tx, agent: { id: number; userId: number }, now: Date) {
  await tx.workAgent.update({ where: { id: agent.id }, data: { status: 'RETIRED', retiredAt: now } });
  await tx.workApiToken.updateMany({ where: { agentId: agent.id, revokedAt: null }, data: { revokedAt: now } });
  // Rời mọi dự án (vai tường minh). Dòng work_members GIỮ để danh sách agent vẫn hiện tên 🤖 + lịch sử đọc được.
  await tx.workProjectMember.deleteMany({ where: { userId: agent.userId } });
  await tx.user.update({ where: { id: agent.userId }, data: { enabled: false, roleVersion: { increment: 1 } } });
  await tx.workAgentLease.updateMany({ where: { agentId: agent.id, status: 'ACTIVE' }, data: { status: 'RELEASED', activeIssueId: null, releasedAt: now } });
  await tx.workWebhook.updateMany({ where: { agentId: agent.id }, data: { enabled: false } });
}

export async function setAgentStatus(callerId: number, workspaceId: number, agentId: number, action: 'pause' | 'resume' | 'retire') {
  const { agent } = await manageable(callerId, workspaceId, agentId);
  if (agent.status === 'RETIRED') throw new BadRequestError('This agent is retired', 'WORK_AGENT_RETIRED');
  const now = new Date();
  if (action === 'pause') {
    if (agent.status !== 'PAUSED') await prisma.workAgent.update({ where: { id: agentId }, data: { status: 'PAUSED' } });
  } else if (action === 'resume') {
    if (agent.status !== 'ACTIVE') await prisma.workAgent.update({ where: { id: agentId }, data: { status: 'ACTIVE' } });
  } else {
    await prisma.$transaction((tx) => retireTx(tx, agent, now));
  }
  invalidateAgentCache();
  await audit({
    workspaceId, actorId: callerId, action: `agent.${action}`, targetType: 'agent', targetId: agentId,
    summary: `${action === 'pause' ? 'Paused' : action === 'resume' ? 'Resumed' : 'Retired'} AI agent @${agent.user.username}`,
  });
  return getAgent(callerId, workspaceId, agentId);
}

/** Không gian bị xoá (mềm) ⇒ agent RETIRED theo (workspaces.deleteWorkspace gọi). */
export async function retireAgentsOfWorkspace(workspaceId: number, actorId: number | null): Promise<number> {
  const agents = await prisma.workAgent.findMany({ where: { workspaceId, status: { not: 'RETIRED' } }, select: { id: true, userId: true, user: { select: { username: true } } } });
  const now = new Date();
  for (const a of agents) {
    await prisma.$transaction((tx) => retireTx(tx, a, now));
    await audit({ workspaceId, actorId, action: 'agent.retire', targetType: 'agent', targetId: a.id, summary: `Retired AI agent @${a.user.username} (workspace deleted)` });
  }
  if (agents.length) invalidateAgentCache();
  return agents.length;
}

// ─── Chuyển tài khoản có sẵn (bot fp_*) thành agent — §2.3 ────────

export interface ConvertInput { userId: number; ownerId: number; model: string; roleText?: string | null; token?: CreateAgentInput['token'] }

/**
 * Giữ nguyên users.id ⇒ assignee/bình luận/lịch sử/worklog/người duyệt… KHÔNG mất dòng nào. Một transaction:
 * kind AGENT, bỏ mật khẩu + MFA, roleVersion++ (mọi JWT cũ chết — middleware authenticate cũng chặn kind AGENT),
 * hồ sơ WorkAgent, hạ vai dự án khác MEMBER/VIEWER xuống MEMBER, thu hồi token cá nhân, cấp token agent mới.
 */
export async function convertUser(callerId: number, workspaceId: number, input: ConvertInput) {
  await scopeOf(callerId, workspaceId, 'admin');
  const model = input.model.trim().slice(0, 80);
  if (!model) throw new BadRequestError('Say which model the agent runs on', 'WORK_AGENT_MODEL');
  if (input.userId === callerId) throw new BadRequestError('You cannot convert your own account', 'WORK_AGENT_CONVERT_SELF');
  if (input.ownerId === input.userId) throw new BadRequestError('An agent cannot own itself', 'WORK_AGENT_BAD_OWNER');
  const target = await prisma.user.findUnique({
    where: { id: input.userId },
    select: {
      id: true, username: true, kind: true,
      workMemberships: { where: { workspace: { deletedAt: null } }, select: { workspaceId: true, role: true, workspace: { select: { name: true } } } },
      workAgentsOwned: { where: { status: { not: 'RETIRED' } }, select: { id: true } },
    },
  });
  const here = target?.workMemberships.find((m) => m.workspaceId === workspaceId);
  if (!target || !here) throw new NotFoundError('This person is not a member of the workspace');
  if (target.kind !== 'HUMAN') throw new BadRequestError('This account is already an AI agent', 'WORK_AGENT_ALREADY');
  if (here.role === 'OWNER' || here.role === 'ADMIN') throw new BadRequestError('Workspace owners and admins cannot be converted into agents', 'WORK_AGENT_CONVERT_ADMIN');
  if (target.workAgentsOwned.length) throw new BadRequestError('This person is responsible for other AI agents — give them a new owner first', 'WORK_AGENT_HAS_OWNER');
  // Agent thuộc ĐÚNG MỘT không gian: còn là thành viên nơi khác ⇒ 409 kê ra để gỡ trước (không đoán thay người dùng).
  const elsewhere = target.workMemberships.filter((m) => m.workspaceId !== workspaceId);
  if (elsewhere.length) {
    throw new AppError(
      `@${target.username} is also a member of ${elsewhere.map((m) => `"${m.workspace.name}"`).join(', ')}. An agent belongs to exactly one workspace — remove them there first.`,
      409, 'WORK_AGENT_CONVERT_OTHER_WS', { workspaces: elsewhere.map((m) => ({ id: m.workspaceId, name: m.workspace.name })) },
    );
  }
  await assertOwnerCandidate(workspaceId, input.ownerId);
  await assertProjectsInWorkspace(workspaceId, input.token?.projectIds ?? []);
  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: target.id },
      data: {
        kind: 'AGENT', password: null, provider: 'agent', providerId: null, emailVerified: true,
        mfaEnabled: false, mfaSecret: null, mfaRecoveryCodes: [], mfaEnabledAt: null, roleVersion: { increment: 1 },
      },
    });
    await tx.workNotifySetting.upsert({ where: { userId: target.id }, create: { userId: target.id, emailMode: 'OFF' }, update: { emailMode: 'OFF' } });
    if (here.role === 'GUEST') await tx.workMember.updateMany({ where: { workspaceId, userId: target.id }, data: { role: 'MEMBER' } });
    const agent = await tx.workAgent.create({
      data: { userId: target.id, workspaceId, ownerId: input.ownerId, model, roleText: input.roleText?.trim().slice(0, 300) || null, runtime: 'EXTERNAL', createdById: callerId },
      select: { id: true, userId: true },
    });
    const demoted = await tx.workProjectMember.updateMany({
      where: { userId: target.id, role: { notIn: [...AGENT_PROJECT_ROLES] } },
      data: { role: 'MEMBER' },
    });
    const revoked = await tx.workApiToken.updateMany({ where: { userId: target.id, agentId: null, revokedAt: null }, data: { revokedAt: now } });
    const token = input.token === null ? null : await issueAgentToken(agent, {
      name: input.token?.name ?? 'Converted', scopes: input.token?.scopes ?? ['read', 'write'],
      projectIds: input.token?.projectIds, expiresInDays: input.token?.expiresInDays ?? null,
    }, tx);
    return { agentId: agent.id, demoted: demoted.count, revokedTokens: revoked.count, token };
  });
  invalidateAgentCache();
  // Bước duyệt còn chờ đứng tên tài khoản này: từ nay agent không quyết được — kê ra để người tạo đổi người duyệt.
  const pendingApprovalSteps = await prisma.workApprovalStep.count({ where: { approverId: target.id, decision: 'PENDING', approval: { status: 'PENDING' } } });
  await audit({
    workspaceId, actorId: callerId, action: 'agent.convert', targetType: 'agent', targetId: result.agentId,
    summary: `Converted @${target.username} into an AI agent (${model})`,
    detail: { fromUsername: target.username, userId: target.id, ownerId: input.ownerId, demotedProjectRoles: result.demoted, revokedTokens: result.revokedTokens, pendingApprovalSteps },
  });
  return {
    agent: shape(await findAgent(workspaceId, result.agentId)),
    token: result.token, demotedProjectRoles: result.demoted, revokedTokens: result.revokedTokens, pendingApprovalSteps,
  };
}

// ─── Token của agent ─────────────────────────────────────────────

export async function listAgentTokens(callerId: number, workspaceId: number, agentId: number) {
  await manageable(callerId, workspaceId, agentId);
  const rows = await prisma.workApiToken.findMany({
    where: { agentId, revokedAt: null },
    orderBy: { id: 'desc' },
    select: { id: true, name: true, prefix: true, scopes: true, projectIds: true, expiresAt: true, lastUsedAt: true, lastUsedIp: true, createdAt: true },
  });
  return rows.map((r) => ({ ...r, projectIds: tokenProjectIds(r.projectIds) ?? [] }));
}

export async function createAgentToken(
  callerId: number, workspaceId: number, agentId: number,
  input: { name: string; scopes: Array<'read' | 'write'>; projectIds?: number[]; expiresInDays?: number | null },
) {
  const { agent } = await manageable(callerId, workspaceId, agentId);
  if (agent.status === 'RETIRED') throw new BadRequestError('This agent is retired', 'WORK_AGENT_RETIRED');
  await assertProjectsInWorkspace(workspaceId, input.projectIds ?? []);
  const token = await issueAgentToken(agent, input);
  await audit({ workspaceId, actorId: callerId, action: 'agent.token.create', targetType: 'agent', targetId: agentId, summary: `Created token "${token.name}" for @${agent.user.username}`, detail: { tokenId: token.id, scopes: token.scopes, projectIds: input.projectIds ?? [] } });
  return token;
}

export async function revokeAgentToken(callerId: number, workspaceId: number, agentId: number, tokenId: number) {
  const { agent } = await manageable(callerId, workspaceId, agentId);
  const r = await prisma.workApiToken.updateMany({ where: { id: tokenId, agentId, revokedAt: null }, data: { revokedAt: new Date() } });
  if (!r.count) throw new NotFoundError('Token not found');
  await audit({ workspaceId, actorId: callerId, action: 'agent.token.revoke', targetType: 'agent', targetId: agentId, summary: `Revoked a token of @${agent.user.username}`, detail: { tokenId } });
}

// ─── Cài đặt agent của dự án (settings.agents) ───────────────────

export async function getAgentSettings(callerId: number, projectId: number) {
  const access = await requireProject(callerId, projectId, 'project.view');
  const statuses = await prisma.workStatus.findMany({
    where: { workflow: { projectId }, category: { not: 'DONE' } },
    orderBy: [{ workflowId: 'asc' }, { position: 'asc' }],
    select: { id: true, name: true, category: true, workflowId: true },
  });
  return { ...access.agentOptions, reviewStatusCandidates: statuses };
}

export async function updateAgentSettings(callerId: number, projectId: number, input: Partial<AgentOptions>) {
  const access = await requireProject(callerId, projectId, 'project.settings');
  if (input.reviewStatusId) {
    const st = await prisma.workStatus.findFirst({ where: { id: input.reviewStatusId, workflow: { projectId } }, select: { category: true } });
    if (!st || st.category === 'DONE') throw new BadRequestError('Pick a non-Done status of this project as the review status', 'WORK_BAD_STATUS');
  }
  if (input.reviewerIds?.length) {
    const ok = await prisma.user.count({ where: { id: { in: input.reviewerIds }, kind: 'HUMAN' } });
    if (ok !== new Set(input.reviewerIds).size) throw new BadRequestError('Reviewers must be people', 'WORK_BAD_APPROVER');
  }
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } });
  const settings = (p.settings ?? {}) as Record<string, unknown>;
  const before = agentOptionsOf(settings);
  const merged = { ...((settings.agents ?? {}) as Record<string, unknown>), ...Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined)) };
  const after = agentOptionsOf({ agents: merged });
  await prisma.workProject.update({ where: { id: projectId }, data: { settings: { ...settings, agents: after } as unknown as Prisma.InputJsonValue } });
  await auditProject(projectId, {
    actorId: callerId, action: 'project.agentSettings', targetType: 'project', targetId: projectId,
    summary: before.doneToReview && !after.doneToReview
      ? `Allowed AI agents to close issues directly in ${access.key} (Done no longer goes to review)`
      : `Changed AI agent settings of ${access.key}`,
    detail: { before, after },
  });
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId: callerId } });
  return after;
}

// ─── Lease: claim / heartbeat / release (CTW-32, §4.4) ───────────

/** Agent của userId (token agent đã được middleware xác thực; tầng này vẫn tự kiểm — fail-closed). */
async function agentOfUser(userId: number) {
  const a = await prisma.workAgent.findUnique({ where: { userId }, select: { id: true, userId: true, ownerId: true, status: true, parallelSlots: true, workspaceId: true, user: { select: { username: true } } } });
  if (!a) throw new AppError('Only AI agents claim issues — people just assign the issue to themselves', 403, 'WORK_NOT_AGENT');
  if (a.status === 'RETIRED') throw new AppError('This AI agent has been retired', 403, 'WORK_AGENT_RETIRED');
  if (a.status === 'PAUSED') throw new AppError('This AI agent is paused. Its owner must resume it before it can make changes.', 423, 'WORK_AGENT_PAUSED');
  return a;
}

const clampMinutes = (m: number | undefined, d: number) => Math.min(Math.max(Math.round(m ?? d), 5), LEASE_MAX_MINUTES);

function leaseView(l: { id: number; issueId: number; projectId: number; status: string; claimedAt: Date; heartbeatAt: Date; expiresAt: Date; progress: string | null; progressPct: number | null }) {
  return { id: l.id, issueId: l.issueId, projectId: l.projectId, status: l.status, claimedAt: l.claimedAt, heartbeatAt: l.heartbeatAt, expiresAt: l.expiresAt, progress: l.progress, progressPct: l.progressPct };
}

/** Board cập nhật chip "🤖 working · 72%" — chỉ socket, KHÔNG qua bus (không sinh thông báo/luật/chat hook). */
function emitLease(projectId: number, issueId: number, agentUserId: number, lease: { status: string; progress?: string | null; progressPct?: number | null; expiresAt?: Date }) {
  getIO()?.to(projectRoom(projectId)).emit('work:event', {
    type: 'issue.updated', projectId, issueId, actor: { kind: 'AGENT', userId: agentUserId },
    changes: [{ field: 'agentProgress', from: null, to: JSON.stringify({ status: lease.status, progress: lease.progress ?? null, pct: lease.progressPct ?? null, expiresAt: lease.expiresAt ?? null }) }],
  });
}

export async function claimIssue(userId: number, projectId: number, number: number, input: { minutes?: number } = {}) {
  const access = await requireProject(userId, projectId, 'issue.edit');
  const agent = await agentOfUser(userId);
  const opts = access.agentOptions;
  const issue = await prisma.workIssue.findFirst({
    where: { projectId, number, deletedAt: null },
    select: { id: true, assigneeId: true, status: { select: { category: true } }, type: { select: { workflowId: true } } },
  });
  if (!issue) throw new NotFoundError('Issue not found');
  if (issue.status.category === 'DONE') throw new BadRequestError('This issue is already done', 'WORK_LEASE_DONE');

  const minutes = clampMinutes(input.minutes, opts.leaseMinutes);
  const now = new Date();
  const mine = await prisma.workAgentLease.findFirst({ where: { activeIssueId: issue.id, status: 'ACTIVE' }, select: { id: true, agentId: true } });
  if (mine && mine.agentId !== agent.id) throw new AppError(`${access.key}-${number} is being worked on by another agent`, 409, 'WORK_LEASE_TAKEN');
  if (mine) {
    // Claim lại thẻ mình đang giữ = gia hạn (idempotent — agent chạy lại sau khi sập không bị 409 với chính mình).
    const l = await prisma.workAgentLease.update({ where: { id: mine.id }, data: { heartbeatAt: now, expiresAt: new Date(now.getTime() + minutes * 60_000) } });
    return { lease: leaseView(l), issueKey: `${access.key}-${number}`, statusChanged: false, reclaimed: true };
  }

  if (issue.assigneeId !== userId) {
    if (issue.assigneeId === null && opts.allowSelfAssign) {
      await applyIssueChange(issue.id, { assigneeId: userId }, { kind: 'AGENT', userId });
    } else {
      throw new AppError(
        issue.assigneeId === null
          ? `${access.key}-${number} is not assigned to this agent. Ask the lead to assign it (or turn on "Agents can take unassigned issues").`
          : `${access.key}-${number} is assigned to someone else`,
        403, 'WORK_LEASE_NOT_ASSIGNED',
      );
    }
  }

  const [inProject, total] = await Promise.all([
    prisma.workAgentLease.count({ where: { agentId: agent.id, status: 'ACTIVE', projectId } }),
    prisma.workAgentLease.count({ where: { agentId: agent.id, status: 'ACTIVE' } }),
  ]);
  if (inProject >= opts.maxOpenLeases) {
    throw new BadRequestError(`This agent already works on ${inProject} issue(s) in this project (limit ${opts.maxOpenLeases}). Release one first.`, 'WORK_LEASE_LIMIT');
  }
  if (total >= agent.parallelSlots) {
    throw new BadRequestError(`This agent can work on ${agent.parallelSlots} issue(s) at a time. Release one first.`, 'WORK_LEASE_LIMIT');
  }

  let lease;
  try {
    lease = await prisma.workAgentLease.create({
      data: { agentId: agent.id, issueId: issue.id, projectId, activeIssueId: issue.id, claimedAt: now, heartbeatAt: now, expiresAt: new Date(now.getTime() + minutes * 60_000) },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(`${access.key}-${number} is being worked on by another agent`, 409, 'WORK_LEASE_TAKEN');
    }
    throw err;
  }

  // Thẻ còn ở cột TODO ⇒ sang trạng thái IN_PROGRESS đầu tiên (lịch sử ghi actor AGENT). Workflow chặn ⇒ giữ nguyên.
  let statusChanged = false;
  if (issue.status.category === 'TODO') {
    const wf = issue.type.workflowId ?? (await prisma.workWorkflow.findFirst({ where: { projectId, isDefault: true }, select: { id: true } }))?.id;
    const next = wf ? await prisma.workStatus.findFirst({ where: { workflowId: wf, category: 'IN_PROGRESS' }, orderBy: { position: 'asc' }, select: { id: true } }) : null;
    if (next) {
      try {
        await applyIssueChange(issue.id, { statusId: next.id }, { kind: 'AGENT', userId });
        statusChanged = true;
      } catch (err) {
        logger.info('[work] agent: claim không chuyển được sang In progress', { issueId: issue.id, err: (err as Error).message });
      }
    }
  }
  await auditProject(projectId, {
    actorId: userId, action: 'agent.claim', targetType: 'issue', targetId: issue.id,
    summary: `Started working on ${access.key}-${number}`, detail: { leaseId: lease.id, minutes },
  });
  emitLease(projectId, issue.id, userId, lease);
  return { lease: leaseView(lease), issueKey: `${access.key}-${number}`, statusChanged, reclaimed: false };
}

async function myActiveLease(userId: number, leaseId: number) {
  const agent = await agentOfUser(userId);
  const l = await prisma.workAgentLease.findFirst({ where: { id: leaseId, agentId: agent.id } });
  if (!l) throw new NotFoundError('Lease not found');
  if (l.status !== 'ACTIVE' || l.expiresAt < new Date()) {
    throw new AppError('This lease has ended. Claim the issue again to keep working on it.', 409, 'WORK_LEASE_EXPIRED');
  }
  return { agent, lease: l };
}

export async function heartbeat(userId: number, leaseId: number, input: { progress?: string | null; progressPct?: number | null; extendMinutes?: number } = {}) {
  const { lease } = await myActiveLease(userId, leaseId);
  const now = new Date();
  const pct = input.progressPct === undefined || input.progressPct === null ? undefined : Math.min(Math.max(Math.round(input.progressPct), 0), 100);
  const l = await prisma.workAgentLease.update({
    where: { id: lease.id },
    data: {
      heartbeatAt: now, expiresAt: new Date(now.getTime() + clampMinutes(input.extendMinutes, 30) * 60_000),
      ...(input.progress !== undefined ? { progress: input.progress?.trim().slice(0, 300) || null } : {}),
      ...(pct !== undefined ? { progressPct: pct } : {}),
    },
  });
  emitLease(l.projectId, l.issueId, userId, l);
  return leaseView(l);
}

export async function releaseLease(userId: number, leaseId: number, input: { reason?: string | null } = {}) {
  const agent = await agentOfUser(userId);
  const l = await prisma.workAgentLease.findFirst({ where: { id: leaseId, agentId: agent.id } });
  if (!l) throw new NotFoundError('Lease not found');
  if (l.status !== 'ACTIVE') return { released: false, status: l.status };
  const r = await prisma.workAgentLease.updateMany({ where: { id: l.id, status: 'ACTIVE' }, data: { status: 'RELEASED', activeIssueId: null, releasedAt: new Date(), ...(input.reason ? { progress: input.reason.trim().slice(0, 300) } : {}) } });
  emitLease(l.projectId, l.issueId, userId, { status: 'RELEASED' });
  return { released: r.count > 0, status: 'RELEASED' };
}

export async function myLeases(userId: number) {
  const agent = await prisma.workAgent.findUnique({ where: { userId }, select: { id: true } });
  if (!agent) throw new AppError('Only AI agents have leases', 403, 'WORK_NOT_AGENT');
  const rows = await prisma.workAgentLease.findMany({ where: { agentId: agent.id, status: 'ACTIVE' }, orderBy: { id: 'asc' } });
  return rows.map(leaseView);
}

/**
 * Sweeper (60 s, job nền — và test gọi tay): lease ACTIVE quá hạn ⇒ EXPIRED, thẻ GIỮ assignee (vẫn là việc của agent)
 * nhưng cắm cờ Blocked "Agent lease expired without heartbeat" + báo owner + inbox `lease.expired`.
 * Không tự bỏ giao — tự bỏ giao làm trưởng nhóm mất dấu ai đang làm gì.
 */
export async function sweepExpiredLeases(now = new Date()): Promise<number> {
  const due = await prisma.workAgentLease.findMany({
    where: { status: 'ACTIVE', expiresAt: { lt: now } },
    take: 200,
    select: { id: true, issueId: true, projectId: true, agent: { select: { id: true, userId: true, ownerId: true, user: { select: { username: true, displayName: true, fullName: true } } } } },
  });
  let n = 0;
  for (const l of due) {
    try {
      const reason = 'Agent lease expired without heartbeat';
      const done = await prisma.$transaction(async (tx) => {
        const r = await tx.workAgentLease.updateMany({ where: { id: l.id, status: 'ACTIVE' }, data: { status: 'EXPIRED', activeIssueId: null, releasedAt: now } });
        if (!r.count) return null;
        const i = await tx.workIssue.findFirst({ where: { id: l.issueId, deletedAt: null }, select: { number: true, title: true, flaggedAt: true, project: { select: { key: true, workspace: { select: { slug: true } } } } } });
        if (i && !i.flaggedAt) {
          await tx.workIssue.update({ where: { id: l.issueId }, data: { flaggedAt: now, flagReason: reason, flaggedById: null, version: { increment: 1 } } });
          await tx.workHistory.create({ data: { issueId: l.issueId, actorId: null, actorKind: 'SYSTEM', field: 'flagged', fromValue: null, toValue: reason } });
        }
        return i ? { ...i, newlyFlagged: !i.flaggedAt } : { number: 0, title: '', flaggedAt: null, project: null, newlyFlagged: false };
      });
      if (!done) continue;
      n += 1;
      const issueKey = done.project ? `${done.project.key}-${done.number}` : `#${l.issueId}`;
      if (done.newlyFlagged) {
        emitWorkEvent({ type: 'issue.updated', projectId: l.projectId, issueId: l.issueId, actor: { kind: 'SYSTEM', userId: null }, changes: [{ field: 'flagged', from: 'false', to: 'true' }] });
      }
      emitLease(l.projectId, l.issueId, l.agent.userId, { status: 'EXPIRED' });
      await recordInbox({ agentId: l.agent.id, projectId: l.projectId, issueId: l.issueId, type: 'lease.expired', summary: `Your lease on ${issueKey} expired without a heartbeat`, extra: { leaseId: l.id } });
      const name = displayName(l.agent.user);
      if (done.project) {
        const { notifyWork } = await import('./notify.js');
        await notifyWork({
          receiverId: l.agent.ownerId, senderId: l.agent.userId, type: 'WORK_ALERT', entityId: l.issueId,
          payload: { issueKey, title: done.title, message: `🤖 ${name} stopped responding on ${issueKey} (lease expired) — flagged as blocked`, url: `/work/${done.project.workspace.slug}/${done.project.key}/issue/${done.number}` },
        }).catch(() => undefined);
      }
      await auditProject(l.projectId, { actorId: null, action: 'agent.lease.expired', targetType: 'issue', targetId: l.issueId, summary: `Lease of 🤖 @${l.agent.user.username} on ${issueKey} expired without heartbeat`, detail: { leaseId: l.id, agentId: l.agent.id } });
    } catch (err) {
      logger.warn('[work] agent: sweeper lỗi một lease', { leaseId: l.id, err: (err as Error).message });
    }
  }
  return n;
}

// ─── Agent tự hỏi về mình ────────────────────────────────────────

export async function whoAmI(userId: number, tokenId?: number) {
  const a = await prisma.workAgent.findUnique({ where: { userId }, select: AGENT_SELECT });
  if (!a) throw new AppError('This token does not belong to an AI agent', 403, 'WORK_NOT_AGENT');
  const tok = tokenId ? await prisma.workApiToken.findUnique({ where: { id: tokenId }, select: { scopes: true, projectIds: true } }) : null;
  return shape(a, { token: tok ? { scopes: tok.scopes, projectIds: tokenProjectIds(tok.projectIds) } : null });
}

/** Hộp thư gần nhất của một agent — cho trang chi tiết agent (admin/owner). */
export async function agentInboxForAdmin(callerId: number, workspaceId: number, agentId: number, limit = 50) {
  await manageable(callerId, workspaceId, agentId);
  return prisma.workAgentInbox.findMany({ where: { agentId }, orderBy: { id: 'desc' }, take: Math.min(Math.max(limit, 1), 200) });
}

// ─── Job nền ─────────────────────────────────────────────────────

let jobsStarted = false;

/**
 * Sweeper lease 60 s + gửi webhook 5 s, trong tiến trình backend (một tiến trình — không cần hàng đợi ngoài).
 * Không chạy khi CRON_DISABLED=1 (backend phụ cùng DB) hoặc trong test (test gọi tay sweep/dispatch).
 */
export function startAgentJobs(): void {
  if (jobsStarted) return;
  if (process.env.CRON_DISABLED === '1' || process.env.NODE_ENV === 'test' || process.env.WORK_DB_TEST === '1' || process.env.WORK_AGENT_JOBS === 'off') return;
  jobsStarted = true;
  let sweeping = false;
  setInterval(() => {
    if (sweeping) return;
    sweeping = true;
    sweepExpiredLeases()
      .then((n) => { if (n) logger.info('[work] agent leases expired', { n }); })
      .catch((err) => logger.warn('[work] agent lease sweeper lỗi', { err: (err as Error).message }))
      .finally(() => { sweeping = false; });
  }, 60_000).unref();
  setInterval(() => {
    void import('./webhooks.service.js')
      .then((m) => m.dispatchWebhooks())
      .catch((err) => logger.warn('[work] webhook dispatcher lỗi', { err: (err as Error).message }));
  }, 5_000).unref();
}

