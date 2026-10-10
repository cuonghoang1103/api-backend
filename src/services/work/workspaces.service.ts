/**
 * CT Work — không gian làm việc, thành viên, lời mời.
 *
 * Mời bằng email:
 *   - Email đã có tài khoản ⇒ thêm thẳng vào không gian + thông báo + email
 *     (giống Jira Cloud: quản trị thêm người, không phải chờ chấp nhận).
 *   - Chưa có tài khoản ⇒ tạo lời mời có token, gửi email kèm link. Người đó
 *     đăng ký/đăng nhập rồi mở link là vào.
 * Link mời chung: nhiều lượt, có hạn, thu hồi được.
 *
 * Mọi hàm nhận `userId` người gọi và tự kiểm quyền qua permissions.ts.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { notifyWorkInvite } from './notify.js';
import {
  displayName, frontendUrl, PUBLIC_USER, randomToken, sha256, slugify,
} from './common.js';
import type { ProjectRole, WorkspaceRole } from './constants.js';
import { evictFromProject } from './events.js';
import { clientPeopleIds } from './clientPeople.js';
import { inviteCardOf } from './publicCards.service.js'; // UX-D
import { buildInviteEmail, deliverWorkEmail } from './workEmail.js'; // UX-D
import { assertHumanActor, clientScopedProjectIds, loadProjectAccess, principalOf, requireWorkspace } from './permissions.js';

const INVITE_TTL_DAYS = 7;
const MAX_WORKSPACES_PER_USER = 30;
const MAX_MEMBERS_PER_WORKSPACE = 200;

// ─── Không gian ──────────────────────────────────────────────────

/** Đoạn đường dẫn tĩnh dưới /work — không gian mang tên này sẽ bị trang tĩnh che mất. */
const RESERVED_SLUGS = new Set(['invite', 'share', 'developer', 'search', 'new', 'settings', 'api', 'me', 'teaching', 'classes', 'form', 'survey', 'mockup-review']); // CTW đợt 5: + teaching, classes · đợt 7b: + form (và survey, mockup-review của 6b — trang tĩnh thắng slug)

async function uniqueSlug(name: string): Promise<string> {
  const base = slugify(name, 40);
  for (let i = 0; i < 50; i++) {
    const slug = i === 0 ? base : `${base}-${i + 1}`;
    if (RESERVED_SLUGS.has(slug)) continue;
    const hit = await prisma.workSpace.findUnique({ where: { slug }, select: { id: true } });
    if (!hit) return slug;
  }
  return `${base}-${randomToken().slice(0, 6).toLowerCase().replace(/[^a-z0-9]/g, 'x')}`;
}

export async function createWorkspace(userId: number, input: { name: string; description?: string | null }) {
  await assertHumanActor(userId, 'create workspaces'); // CTW-28: tầng hành động
  const name = input.name.trim();
  if (!name) throw new BadRequestError('Workspace name is required', 'WORK_NAME_REQUIRED');
  const owned = await prisma.workSpace.count({ where: { ownerId: userId, deletedAt: null } });
  if (owned >= MAX_WORKSPACES_PER_USER) {
    throw new BadRequestError(`You can own at most ${MAX_WORKSPACES_PER_USER} workspaces`, 'WORK_LIMIT');
  }
  const slug = await uniqueSlug(name);
  try {
    return await prisma.workSpace.create({
      data: {
        name: name.slice(0, 100),
        slug,
        description: input.description?.trim() || null,
        ownerId: userId,
        members: { create: { userId, role: 'OWNER' } },
      },
      select: { id: true, name: true, slug: true, description: true },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new ConflictError('That workspace URL is taken, try another name');
    }
    throw err;
  }
}

export async function resolveWorkspaceSlug(userId: number, slug: string) {
  const ws = await prisma.workSpace.findFirst({ where: { slug, deletedAt: null }, select: { id: true } });
  if (!ws) throw new NotFoundError('Workspace not found');
  await requireWorkspace(userId, ws.id, 'workspace.view');
  return ws.id;
}

export async function getWorkspace(userId: number, workspaceId: number) {
  const role = await requireWorkspace(userId, workspaceId, 'workspace.view');
  const ws = await prisma.workSpace.findUniqueOrThrow({
    where: { id: workspaceId },
    select: { id: true, name: true, slug: true, description: true, ownerId: true, createdAt: true, logoUrl: true },
  });
  return { ...ws, role };
}

export async function updateWorkspace(userId: number, workspaceId: number, input: { name?: string; description?: string | null; logoUrl?: null }) {
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  const data: Prisma.WorkSpaceUpdateInput = {};
  if (input.name !== undefined) {
    const n = input.name.trim();
    if (!n) throw new BadRequestError('Workspace name is required', 'WORK_NAME_REQUIRED');
    data.name = n.slice(0, 100);
  }
  if (input.description !== undefined) data.description = input.description?.trim() || null;
  // CTW-23: logo tải lên qua /logo/presign + /logo/complete; ở đây chỉ gỡ.
  if (input.logoUrl === null) data.logoUrl = null;
  return prisma.workSpace.update({ where: { id: workspaceId }, data, select: { id: true, name: true, slug: true, description: true, logoUrl: true } });
}

/** Xoá mềm. Dữ liệu còn nguyên trong DB, khôi phục được bằng tay. */
export async function deleteWorkspace(userId: number, workspaceId: number, confirmName: string) {
  await requireWorkspace(userId, workspaceId, 'workspace.delete');
  const ws = await prisma.workSpace.findUniqueOrThrow({ where: { id: workspaceId }, select: { name: true } });
  if (confirmName.trim() !== ws.name) throw new BadRequestError('Type the workspace name exactly to confirm', 'WORK_CONFIRM_NAME');
  await prisma.workSpace.update({ where: { id: workspaceId }, data: { deletedAt: new Date() } });
  // CTW-28: không gian xoá (mềm) ⇒ agent của nó RETIRED theo (token chết ngay).
  const { retireAgentsOfWorkspace } = await import('./agents.service.js');
  await retireAgentsOfWorkspace(workspaceId, userId);
}

// ─── Thành viên ──────────────────────────────────────────────────

/**
 * Cổng khách (S2b): người mà một KHÁCH của không gian được thấy. `wsRole` là vai
 * HIỆU LỰC (requireWorkspace — MEMBER chỉ là khách cổng đã bị hạ thành GUEST).
 * Gộp theo từng dự án khách vào được:
 *   - dự án khách bị cách ly ⇒ `clientPeopleIds` (mình, khách cùng dự án, lead, người
 *     có tương tác công khai — clientPeople.ts);
 *   - dự án khác có dòng tường minh (vd dự án khách CŨ, cổng tắt) ⇒ thành viên dự án
 *     như trước ("dự án cũ y nguyên").
 * null = không giới hạn (không phải khách của cổng).
 */
export async function guestPeopleScope(userId: number, workspaceId: number, wsRole: string): Promise<number[] | null> {
  if (wsRole !== 'GUEST') return null;
  const scoped = await clientScopedProjectIds(userId, workspaceId);
  if (!scoped.size) return null;
  const { listProjects, projectMembers } = await import('./projects.service.js');
  const ids = new Set<number>([userId]);
  for (const p of await listProjects(userId, workspaceId)) {
    const people = scoped.has(p.id) ? [...(await clientPeopleIds(p.id, userId))] : (await projectMembers(p.id)).map((m) => m.id);
    for (const id of people) ids.add(id);
  }
  return [...ids];
}

export async function listMembers(userId: number, workspaceId: number, q?: string) {
  const role = await requireWorkspace(userId, workspaceId, 'workspace.view');
  const term = q?.trim();
  // Khách của cổng chỉ thấy người trong dự án của mình — không thấy khách/nhân sự khác của không gian.
  const only = await guestPeopleScope(userId, workspaceId, role);
  const rows = await prisma.workMember.findMany({
    where: {
      workspaceId,
      ...(only ? { userId: { in: only } } : {}),
      ...(term ? { user: { OR: [
        { username: { contains: term, mode: 'insensitive' } },
        { fullName: { contains: term, mode: 'insensitive' } },
        { displayName: { contains: term, mode: 'insensitive' } },
      ] } } : {}),
    },
    orderBy: { joinedAt: 'asc' },
    take: 200,
    select: { role: true, joinedAt: true, user: { select: PUBLIC_USER } },
  });
  return rows.map((r) => ({ ...r.user, role: r.role, joinedAt: r.joinedAt }));
}

export async function updateMemberRole(userId: number, workspaceId: number, targetUserId: number, role: WorkspaceRole) {
  await requireWorkspace(userId, workspaceId, 'workspace.members');
  const target = await prisma.workMember.findFirst({ where: { workspaceId, userId: targetUserId } });
  if (!target) throw new NotFoundError('Member not found');
  // Chuyển quyền chủ sở hữu là thao tác riêng (transferOwnership), không đi đường này.
  if (role === 'OWNER' || target.role === 'OWNER') {
    throw new ForbiddenError('Use "Transfer ownership" to change the owner');
  }
  // CTW-28: AI agent luôn là MEMBER của không gian (không ADMIN, không GUEST).
  if (role !== 'MEMBER' && (await principalOf(targetUserId)) === 'AGENT') {
    throw new BadRequestError('An AI agent is always a workspace member', 'WORK_AGENT_ROLE');
  }
  await prisma.workMember.update({ where: { id: target.id }, data: { role } });
  // Khách (GUEST) không thuộc bộ phận nào của studio.
  if (role === 'GUEST') await prisma.workTeamMember.deleteMany({ where: { userId: targetUserId, team: { workspaceId } } });
  // Hạ xuống GUEST có thể mất quyền xem dự án — đuổi khỏi phòng, client vào lại với quyền mới.
  const projects = await prisma.workProject.findMany({ where: { workspaceId }, select: { id: true } });
  for (const p of projects) evictFromProject(p.id, targetUserId);
}

export async function removeMember(userId: number, workspaceId: number, targetUserId: number) {
  const self = userId === targetUserId;
  if (!self) await requireWorkspace(userId, workspaceId, 'workspace.members');
  const target = await prisma.workMember.findFirst({ where: { workspaceId, userId: targetUserId } });
  if (!target) throw new NotFoundError('Member not found');
  if (target.role === 'OWNER') throw new ForbiddenError('The owner cannot leave. Transfer ownership first.');
  // CTW-28: agent rời không gian bằng Retire (giữ id + lịch sử, thu hồi token), không bằng xoá thành viên.
  if ((await principalOf(targetUserId)) === 'AGENT') {
    throw new BadRequestError('Retire the AI agent instead of removing it', 'WORK_AGENT_RETIRE_INSTEAD');
  }
  // Người còn chịu trách nhiệm cho agent chưa retire ⇒ phải chuyển chủ trước (agent không được mồ côi).
  const owned = await prisma.workAgent.findMany({ where: { workspaceId, ownerId: targetUserId, status: { not: 'RETIRED' } }, select: { user: { select: { username: true } } } });
  if (owned.length) {
    throw new BadRequestError(
      `This person is responsible for ${owned.length} AI agent(s) (${owned.map((a) => `@${a.user.username}`).join(', ')}). Give them a new owner or retire them first.`,
      'WORK_AGENT_HAS_OWNER',
    );
  }

  const projects = await prisma.workProject.findMany({ where: { workspaceId }, select: { id: true } });
  await prisma.$transaction([
    prisma.workProjectMember.deleteMany({ where: { userId: targetUserId, project: { workspaceId } } }),
    // Rời không gian thì rời luôn các bộ phận của không gian (lớp studio).
    prisma.workTeamMember.deleteMany({ where: { userId: targetUserId, team: { workspaceId } } }),
    prisma.workMember.delete({ where: { id: target.id } }),
  ]);
  // Rời không gian là mất quyền ngay — đuổi khỏi mọi phòng socket của không gian.
  for (const p of projects) evictFromProject(p.id, targetUserId);
}

export async function transferOwnership(userId: number, workspaceId: number, newOwnerId: number) {
  await requireWorkspace(userId, workspaceId, 'workspace.delete');
  const target = await prisma.workMember.findFirst({ where: { workspaceId, userId: newOwnerId } });
  if (!target) throw new NotFoundError('Member not found');
  if (target.role === 'GUEST') throw new BadRequestError('A guest cannot become the owner', 'WORK_BAD_ROLE');
  if ((await principalOf(newOwnerId)) === 'AGENT') throw new BadRequestError('An AI agent cannot own a workspace', 'WORK_AGENT_ROLE');
  await prisma.$transaction([
    prisma.workMember.updateMany({ where: { workspaceId, userId }, data: { role: 'ADMIN' } }),
    prisma.workMember.update({ where: { id: target.id }, data: { role: 'OWNER' } }),
    prisma.workSpace.update({ where: { id: workspaceId }, data: { ownerId: newOwnerId } }),
  ]);
}

// ─── Lời mời ─────────────────────────────────────────────────────

async function addMember(
  tx: Prisma.TransactionClient,
  workspaceId: number,
  userId: number,
  role: WorkspaceRole,
  project?: { id: number; role: ProjectRole } | null,
) {
  const count = await tx.workMember.count({ where: { workspaceId } });
  const existing = await tx.workMember.findFirst({ where: { workspaceId, userId } });
  if (!existing && count >= MAX_MEMBERS_PER_WORKSPACE) {
    throw new BadRequestError(`A workspace can have at most ${MAX_MEMBERS_PER_WORKSPACE} members`, 'WORK_LIMIT');
  }
  if (!existing) await tx.workMember.create({ data: { workspaceId, userId, role } });
  if (project) {
    await tx.workProjectMember.upsert({
      where: { uk_work_project_member: { projectId: project.id, userId } },
      create: { projectId: project.id, userId, role: project.role },
      update: { role: project.role },
    });
  }
  return !existing;
}

export interface InviteInput {
  emails?: string[];
  role: WorkspaceRole;
  projectId?: number | null;
  projectRole?: ProjectRole | null;
}

/**
 * Mời theo danh sách email. Trả về từng email đã được thêm thẳng hay đã gửi
 * lời mời — giao diện hiện đúng kết quả cho từng người.
 */
export async function inviteByEmail(userId: number, workspaceId: number, input: InviteInput) {
  await requireWorkspace(userId, workspaceId, 'workspace.members');
  if (input.role === 'OWNER') throw new BadRequestError('Cannot invite someone as owner', 'WORK_BAD_ROLE');
  const project = await checkInviteProject(userId, workspaceId, input);
  // Khách của dự án luôn vào không gian với vai GUEST — không bao giờ thấy dự án WORKSPACE khác.
  if (project?.role === 'CLIENT') input = { ...input, role: 'GUEST' };
  const clientPortal = project?.role === 'CLIENT' ? await clientPortalInfo(project.id) : null;

  const emails = [...new Set((input.emails ?? []).map((e) => e.trim().toLowerCase()).filter(Boolean))].slice(0, 50);
  if (!emails.length) throw new BadRequestError('Enter at least one email', 'WORK_EMAIL_REQUIRED');

  const [ws, inviter, inviterMail, brand] = await Promise.all([
    prisma.workSpace.findUniqueOrThrow({ where: { id: workspaceId }, select: { name: true, slug: true } }),
    prisma.user.findUniqueOrThrow({ where: { id: userId }, select: PUBLIC_USER }),
    prisma.user.findUnique({ where: { id: userId }, select: { email: true } }),
    // UX-D: thư mời có bìa + tên dự án.
    project ? prisma.workProject.findUnique({ where: { id: project.id }, select: { name: true, coverUrl: true, color: true } }) : null,
  ]);
  const results: Array<{ email: string; status: 'ADDED' | 'ALREADY_MEMBER' | 'INVITED' }> = [];
  // UX-D (09/10/2026): thư mời có thương hiệu, song ngữ (workEmail.ts) — From "CT Work · CuongThai", Reply-To = người mời.
  const sendInvite = (to: string, kind: 'INVITE' | 'ADDED', url: string, expiresAt: Date | null) => {
    const mail = buildInviteEmail({
      kind, portal: !!clientPortal, to,
      inviter: { name: displayName(inviter), avatarUrl: inviter.avatarUrl },
      workspace: ws.name, project: brand ? { name: brand.name, coverUrl: brand.coverUrl, color: brand.color } : null,
      role: project?.role ?? input.role, url, expiresAt,
    });
    void deliverWorkEmail({ to, ...mail, replyTo: inviterMail?.email ?? null, refId: `ctw-invite-${workspaceId}-${Date.now().toString(36)}` });
  };

  for (const email of emails) {
    const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } }, select: { id: true, email: true, kind: true } });
    // CTW-28: agent không vào không gian bằng lời mời (tạo/convert ở trang Agents) — @agents.invalid không bao giờ nhận thư.
    if (user?.kind === 'AGENT') throw new BadRequestError('AI agents are added from the Agents page, not by invitation', 'WORK_AGENT_ROLE');
    if (user) {
      const added = await prisma.$transaction((tx) => addMember(tx, workspaceId, user.id, input.role, project));
      results.push({ email, status: added ? 'ADDED' : 'ALREADY_MEMBER' });
      if (added) {
        await notifyWorkInvite(user.id, userId, workspaceId, ws.name, ws.slug);
        // Khách cổng ⇒ vào thẳng cổng khách (không nhắc "workspace"); còn lại ⇒ không gian.
        sendInvite(user.email, 'ADDED', frontendUrl(clientPortal ? clientPortal.path : `/work/${ws.slug}`), null);
      }
      continue;
    }
    const token = randomToken();
    const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 86_400_000);
    await prisma.workInvite.create({
      data: {
        workspaceId, email, role: input.role, projectId: project?.id ?? null, projectRole: project?.role ?? null,
        tokenHash: sha256(token), invitedById: userId, maxUses: 1, expiresAt,
      },
    });
    sendInvite(email, 'INVITE', frontendUrl(`/work/invite/${token}`), expiresAt);
    results.push({ email, status: 'INVITED' });
  }
  return results;
}

/** Dự án bật cổng khách ⇒ tên + đường vào cổng (để mời khách vào thẳng cổng). */
async function clientPortalInfo(projectId: number): Promise<{ name: string; path: string } | null> {
  const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { name: true, key: true, settings: true, workspace: { select: { slug: true } } } });
  if (!p) return null;
  const { modulesOf } = await import('./studio.js');
  if (!modulesOf(p.settings).clientPortal) return null;
  return { name: p.name, path: `/work/${p.workspace.slug}/${p.key}/portal` };
}

async function checkInviteProject(userId: number, workspaceId: number, input: InviteInput) {
  if (!input.projectId) return null;
  const access = await loadProjectAccess(userId, input.projectId);
  if (!access || access.workspaceId !== workspaceId || access.role !== 'ADMIN') {
    throw new ForbiddenError('You must be a project admin to invite people into this project');
  }
  return { id: input.projectId, role: input.projectRole ?? (input.role === 'GUEST' ? 'VIEWER' : 'MEMBER') } as { id: number; role: ProjectRole };
}

/** Link mời dùng chung (dán vào nhóm chat của lớp). Token chỉ trả về MỘT lần. */
export async function createInviteLink(
  userId: number,
  workspaceId: number,
  input: InviteInput & { maxUses?: number; expiresInDays?: number },
) {
  await requireWorkspace(userId, workspaceId, 'workspace.members');
  if (input.role === 'OWNER') throw new BadRequestError('Cannot invite someone as owner', 'WORK_BAD_ROLE');
  const project = await checkInviteProject(userId, workspaceId, input);
  if (project?.role === 'CLIENT') input = { ...input, role: 'GUEST' };
  const token = randomToken();
  const days = Math.min(Math.max(input.expiresInDays ?? INVITE_TTL_DAYS, 1), 30);
  const invite = await prisma.workInvite.create({
    data: {
      workspaceId, email: null, role: input.role, projectId: project?.id ?? null, projectRole: project?.role ?? null,
      tokenHash: sha256(token), invitedById: userId,
      maxUses: Math.min(Math.max(input.maxUses ?? 30, 1), 200),
      expiresAt: new Date(Date.now() + days * 86_400_000),
    },
    select: { id: true, expiresAt: true, maxUses: true },
  });
  return { ...invite, url: frontendUrl(`/work/invite/${token}`) };
}

export async function listInvites(userId: number, workspaceId: number) {
  await requireWorkspace(userId, workspaceId, 'workspace.members');
  return prisma.workInvite.findMany({
    where: { workspaceId, revokedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, email: true, role: true, projectId: true, projectRole: true, maxUses: true, usedCount: true,
      expiresAt: true, createdAt: true, invitedBy: { select: PUBLIC_USER },
    },
  });
}

export async function revokeInvite(userId: number, workspaceId: number, inviteId: number) {
  await requireWorkspace(userId, workspaceId, 'workspace.members');
  const r = await prisma.workInvite.updateMany({ where: { id: inviteId, workspaceId, revokedAt: null }, data: { revokedAt: new Date() } });
  if (!r.count) throw new NotFoundError('Invitation not found');
}

async function findUsableInvite(token: string) {
  const invite = await prisma.workInvite.findUnique({
    where: { tokenHash: sha256(token) },
    include: { workspace: { select: { id: true, name: true, slug: true, deletedAt: true } } },
  });
  if (!invite || invite.revokedAt || invite.workspace.deletedAt) throw new NotFoundError('This invitation is not valid');
  if (invite.expiresAt < new Date()) throw new BadRequestError('This invitation has expired', 'WORK_INVITE_EXPIRED');
  if (invite.usedCount >= invite.maxUses) throw new BadRequestError('This invitation has already been used', 'WORK_INVITE_USED');
  return invite;
}

/** Xem trước lời mời (trang /work/invite/:token hiện tên không gian trước khi bấm). */
export async function previewInvite(token: string) {
  const invite = await findUsableInvite(token);
  const inviter = await prisma.user.findUnique({ where: { id: invite.invitedById }, select: PUBLIC_USER });
  return {
    workspace: { name: invite.workspace.name, slug: invite.workspace.slug },
    role: invite.role,
    invitedBy: inviter ? displayName(inviter) : null,
    restrictedToEmail: !!invite.email,
    // UX-D: thẻ xem trước (bìa dự án, ảnh người mời, số thành viên) — cùng dữ liệu với ảnh OG của link mời.
    card: await inviteCardOf(invite),
  };
}

export async function acceptInvite(userId: number, token: string) {
  await assertHumanActor(userId, 'accept invitations'); // CTW-28
  const invite = await findUsableInvite(token);
  if (invite.email) {
    const me = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { email: true } });
    // Lời mời gửi đích danh thì chỉ đúng email đó dùng được — link lọt ra
    // ngoài (chuyển tiếp email) cũng không ai khác vào được.
    if (me.email.toLowerCase() !== invite.email.toLowerCase()) {
      throw new ForbiddenError(`This invitation was sent to ${invite.email}. Sign in with that email to accept it.`);
    }
  }
  const already = await prisma.workMember.findFirst({ where: { workspaceId: invite.workspaceId, userId }, select: { id: true } });
  // Lời mời KHÁCH vào dự án bật cổng khách ⇒ trang web chuyển thẳng vào cổng.
  const portal = invite.projectId && invite.projectRole === 'CLIENT' ? await clientPortalInfo(invite.projectId) : null;
  // Đã là thành viên và lời mời không kèm dự án ⇒ không tiêu một lượt của link chung.
  if (already && !invite.projectId) return { slug: invite.workspace.slug };
  await prisma.$transaction(async (tx) => {
    // Tăng lượt dùng có điều kiện: hai người bấm cùng lúc vào link còn 1 lượt thì chỉ một người vào.
    const used = await tx.workInvite.updateMany({
      where: { id: invite.id, usedCount: { lt: invite.maxUses } },
      data: { usedCount: { increment: 1 } },
    });
    if (!used.count) throw new BadRequestError('This invitation has already been used', 'WORK_INVITE_USED');
    const project = invite.projectId ? { id: invite.projectId, role: (invite.projectRole ?? 'MEMBER') as ProjectRole } : null;
    await addMember(tx, invite.workspaceId, userId, (invite.projectRole === 'CLIENT' ? 'GUEST' : invite.role) as WorkspaceRole, project);
  });
  return { slug: invite.workspace.slug, ...(portal ? { portalPath: portal.path } : {}) };
}
