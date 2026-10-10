/**
 * CT Work đợt 7c (C17) — chính sách bảo mật của không gian: ép 2FA, ai chưa bật, nhắc, nhật ký quản trị.
 * Luật chặn nằm ở twoFactor.ts (cổng theo request); tệp này chỉ là phần quản trị + trạng thái của chính mình.
 *
 * Quyền:
 *   - Xem/đổi chính sách + danh sách tuân thủ: OWNER/ADMIN không gian (`workspace.settings`), NGƯỜI, qua PHIÊN
 *     (route chặn token — token không đổi được chính sách bảo mật).
 *   - Bật ép 2FA: người bật phải ĐÃ bật 2FA cho chính mình (không tự khoá mình ra ngoài, và người đặt luật phải theo luật).
 *   - Mọi lần bật/tắt/đổi ân hạn/nhắc ⇒ audit `workspace.security.*`.
 */

import { prisma } from '../../config/database.js';
import { AppError, BadRequestError } from '../../middleware/errorHandler.js';
import type { MfaClaims } from '../mfa/adminMfa.js';
import { audit } from './audit.js';
import { displayName, PUBLIC_USER } from './common.js';
import { notifyWork } from './notify.js';
import { assertHumanActor, requireWorkspace } from './permissions.js';
import { GRACE_DAYS_MAX, graceUntilFrom, loadGate, twoFactorState, WORK_2FA_SETUP_URL, workTwoFactorEnabled } from './twoFactor.js';

export interface PolicyView {
  workspaceId: number;
  require2fa: boolean;
  graceDays: number;
  enforcedAt: Date | null;
  graceUntil: Date | null;
  updatedAt: Date | null;
  updatedBy: { id: number; username: string; displayName: string | null; fullName: string | null } | null;
}

async function policyOf(workspaceId: number): Promise<PolicyView> {
  const p = await prisma.workSecurityPolicy.findUnique({ where: { workspaceId } });
  const by = p?.updatedById ? await prisma.user.findUnique({ where: { id: p.updatedById }, select: { id: true, username: true, displayName: true, fullName: true } }) : null;
  return {
    workspaceId, require2fa: !!p?.require2fa, graceDays: p?.graceDays ?? 7, enforcedAt: p?.enforcedAt ?? null, graceUntil: p?.graceUntil ?? null,
    updatedAt: p?.updatedAt ?? null, updatedBy: by,
  };
}

/** Thành viên NGƯỜI của không gian + trạng thái 2FA (agent liệt kê riêng: miễn trừ). */
async function complianceRows(workspaceId: number, now = new Date()) {
  const policy = await prisma.workSecurityPolicy.findUnique({ where: { workspaceId } });
  const members = await prisma.workMember.findMany({
    where: { workspaceId },
    orderBy: { joinedAt: 'asc' },
    select: { role: true, joinedAt: true, user: { select: { ...PUBLIC_USER, kind: true, mfaEnabled: true, mfaEnabledAt: true } } },
  });
  const humans = members.filter((m) => m.user.kind !== 'AGENT');
  const agents = members.filter((m) => m.user.kind === 'AGENT');
  const rows = humans.map((m) => {
    // Trạng thái "tài khoản" (không xét phiên): đã bật ⇒ đạt khi xác minh; chưa bật ⇒ GRACE / SETUP_REQUIRED.
    const state = m.user.mfaEnabled ? 'ENABLED' : policy?.require2fa ? twoFactorState(policy, { mfaEnabled: false, mfaEnabledAt: null }, null, { now }) : 'NOT_ENABLED';
    return {
      user: { id: m.user.id, username: m.user.username, fullName: m.user.fullName, displayName: m.user.displayName, avatarUrl: m.user.avatarUrl },
      role: m.role, joinedAt: m.joinedAt, mfaEnabled: !!m.user.mfaEnabled, mfaEnabledAt: m.user.mfaEnabledAt,
      state: state as 'ENABLED' | 'NOT_ENABLED' | 'GRACE' | 'SETUP_REQUIRED',
    };
  });
  return {
    rows,
    agents: agents.map((m) => ({ id: m.user.id, username: m.user.username, displayName: m.user.displayName, fullName: m.user.fullName })),
  };
}

export async function getSecurity(userId: number, workspaceId: number) {
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  const [policy, c, me] = await Promise.all([
    policyOf(workspaceId),
    complianceRows(workspaceId),
    prisma.user.findUnique({ where: { id: userId }, select: { mfaEnabled: true } }),
  ]);
  const missing = c.rows.filter((r) => !r.mfaEnabled);
  return {
    policy,
    summary: { members: c.rows.length, enabled: c.rows.length - missing.length, missing: missing.length },
    members: c.rows,
    exempt: { agents: c.agents, note: 'API tokens, AI agent tokens, calendar (.ics) links and public share links are not affected by this policy.' },
    youHave2fa: !!me?.mfaEnabled,
    setupUrl: WORK_2FA_SETUP_URL,
    graceDaysMax: GRACE_DAYS_MAX,
  };
}

export async function setSecurity(userId: number, workspaceId: number, input: { require2fa?: boolean; graceDays?: number }) {
  await assertHumanActor(userId, 'change workspace security settings');
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  const cur = await prisma.workSecurityPolicy.findUnique({ where: { workspaceId } });
  const graceDays = input.graceDays ?? cur?.graceDays ?? 7;
  if (!Number.isInteger(graceDays) || graceDays < 0 || graceDays > GRACE_DAYS_MAX) throw new BadRequestError(`Grace period must be 0–${GRACE_DAYS_MAX} days`, 'VALIDATION_ERROR');
  const turningOn = input.require2fa === true && !cur?.require2fa;
  if (input.require2fa === true && !workTwoFactorEnabled()) {
    throw new AppError('Two-factor enforcement is turned off on this site. / Tính năng ép 2FA đang tắt trên trang này.', 409, 'WORK_2FA_DISABLED');
  }
  const turningOff = input.require2fa === false && !!cur?.require2fa;
  if (turningOn) {
    const me = await prisma.user.findUnique({ where: { id: userId }, select: { mfaEnabled: true } });
    if (!me?.mfaEnabled) {
      throw new AppError('Turn on two-factor authentication for your own account before requiring it for the workspace.', 409, 'WORK_2FA_SELF_FIRST', { setupUrl: WORK_2FA_SETUP_URL });
    }
  }
  const now = new Date();
  const require2fa = input.require2fa ?? cur?.require2fa ?? false;
  // Ân hạn tính từ lúc BẬT (đổi số ngày khi đang bật ⇒ tính lại từ lúc bật ban đầu, không kéo dài vô hạn bằng cách bấm lại).
  const enforcedAt = require2fa ? (turningOn ? now : cur?.enforcedAt ?? now) : null;
  const graceUntil = require2fa && enforcedAt ? graceUntilFrom(enforcedAt, graceDays) : null;
  await prisma.workSecurityPolicy.upsert({
    where: { workspaceId },
    create: { workspaceId, require2fa, graceDays, enforcedAt, graceUntil, updatedById: userId },
    update: { require2fa, graceDays, enforcedAt, graceUntil, updatedById: userId },
  });
  const what = turningOn ? `Required two-factor authentication for all members (grace period ${graceDays} day${graceDays === 1 ? '' : 's'})`
    : turningOff ? 'Stopped requiring two-factor authentication'
      : require2fa ? `Changed the two-factor grace period to ${graceDays} day${graceDays === 1 ? '' : 's'}`
        : `Saved security settings (two-factor not required, grace period ${graceDays} days)`;
  await audit({
    workspaceId, actorId: userId,
    action: turningOn ? 'workspace.security.require_2fa_on' : turningOff ? 'workspace.security.require_2fa_off' : 'workspace.security.update',
    targetType: 'workspace', targetId: workspaceId, summary: what,
    detail: { require2fa, graceDays, graceUntil: graceUntil?.toISOString() ?? null },
  });
  return getSecurity(userId, workspaceId);
}

/** Gửi nhắc (chuông + email theo cài đặt) cho thành viên chưa bật 2FA. Trần 1 lần/giờ/không gian (audit làm sổ). */
export async function remindMissing(userId: number, workspaceId: number) {
  await assertHumanActor(userId, 'send security reminders');
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  const recent = await prisma.workAuditLog.count({ where: { workspaceId, action: 'workspace.security.remind_2fa', createdAt: { gte: new Date(Date.now() - 3600_000) } } });
  if (recent) throw new AppError('Reminders were sent less than an hour ago', 429, 'WORK_RATE_LIMIT');
  const ws = await prisma.workSpace.findUniqueOrThrow({ where: { id: workspaceId }, select: { name: true, slug: true } });
  const policy = await policyOf(workspaceId);
  const { rows } = await complianceRows(workspaceId);
  const missing = rows.filter((r) => !r.mfaEnabled && r.user.id !== userId);
  for (const r of missing) {
    await notifyWork({
      receiverId: r.user.id, senderId: userId, type: 'WORK_ALERT', entityId: workspaceId,
      payload: {
        issueKey: ws.name, title: 'Two-factor authentication',
        message: policy.require2fa && policy.graceUntil
          ? `${ws.name} requires two-factor authentication${policy.graceUntil > new Date() ? ` from ${policy.graceUntil.toISOString().slice(0, 10)}` : ''}. Turn it on in a minute.`
          : `Please turn on two-factor authentication for ${ws.name}.`,
        url: `${WORK_2FA_SETUP_URL}?ws=${encodeURIComponent(ws.slug)}`,
      },
    }).catch(() => undefined);
  }
  await audit({
    workspaceId, actorId: userId, action: 'workspace.security.remind_2fa', targetType: 'workspace', targetId: workspaceId,
    summary: `Reminded ${missing.length} member${missing.length === 1 ? '' : 's'} to turn on two-factor authentication`,
    detail: { userIds: missing.map((m) => m.user.id), names: missing.slice(0, 20).map((m) => displayName(m.user)) },
  });
  return { reminded: missing.length };
}

/** Trang /work/security: 2FA của tôi + không gian nào đang ép (kể cả khi đang bị chặn — tuyến này không thuộc không gian). */
export async function mySecurity(userId: number, claims: MfaClaims | null | undefined) {
  const [u, gate, policies] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { mfaEnabled: true, mfaEnabledAt: true } }),
    loadGate(userId, claims),
    prisma.workSecurityPolicy.findMany({
      where: { require2fa: true, workspace: { deletedAt: null, members: { some: { userId } } } },
      select: { workspaceId: true, graceUntil: true, workspace: { select: { name: true, slug: true } } },
    }),
  ]);
  return {
    mfaEnabled: !!u?.mfaEnabled,
    mfaEnabledAt: u?.mfaEnabledAt ?? null,
    workspaces: policies.map((p) => ({
      id: p.workspaceId, name: p.workspace.name, slug: p.workspace.slug, graceUntil: p.graceUntil,
      state: gate.get(p.workspaceId)?.state ?? 'OK',
    })),
  };
}
