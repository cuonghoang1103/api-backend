/**
 * CT Work — dm5 G4 (D14, 27/11/2026): chốt ĐÓNG BĂNG version trong cửa ghi chung.
 *
 * `assertVersionFreeze` được gọi ở `issueChange.ts` (cửa ghi G1 sở hữu) tại HAI chỗ: tạo thẻ có `fixVersionId` và đổi
 * `fixVersionId` của thẻ — nên REST, sửa hàng loạt, MCP `update_issue`/`create_issue` và AI Apply bị chặn như nhau.
 * Luật thuần ở dm5g4Rules.ts › freezeVerdict. ADMIN dự án vượt được (ghi audit `version.freeze_override`); luật tự động /
 * hệ thống không bị chặn (cùng lý do Done rules: chặn im lặng thì luật trông như hỏng).
 */

import type { Prisma } from '@prisma/client';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { freezeVerdict } from './dm5g4Rules.js';

type Tx = Prisma.TransactionClient;

export async function assertVersionFreeze(
  tx: Tx,
  x: { projectId: number; versionId: number; typeId: number; priority: number; actor: { kind: string; userId?: number | null }; issueKey?: string },
): Promise<void> {
  if (x.actor.kind !== 'USER' && x.actor.kind !== 'AI' && x.actor.kind !== 'AGENT') return;
  const v = await tx.workVersion.findFirst({ where: { id: x.versionId, projectId: x.projectId }, select: { id: true, name: true, freezeLevel: true } });
  if (!v || !v.freezeLevel || v.freezeLevel === 'NONE') return;
  const type = await tx.workIssueType.findUnique({ where: { id: x.typeId }, select: { key: true } });
  const uid = x.actor.userId ?? null;
  // Agent không bao giờ vượt (không phải người chịu trách nhiệm phát hành).
  const member = uid && x.actor.kind !== 'AGENT' ? await tx.workProjectMember.findFirst({ where: { projectId: x.projectId, userId: uid }, select: { role: true } }) : null;
  const verdict = freezeVerdict(v.freezeLevel, { typeKey: type?.key ?? '', priority: x.priority, isAdmin: member?.role === 'ADMIN' });
  if (!verdict.ok) throw new BadRequestError(`${v.name}: ${verdict.reason}`, 'WORK_VERSION_FROZEN');
  if (verdict.override && uid) {
    const p = await tx.workProject.findUniqueOrThrow({ where: { id: x.projectId }, select: { workspaceId: true } });
    await tx.workAuditLog.create({
      data: {
        workspaceId: p.workspaceId, projectId: x.projectId, actorId: uid, action: 'version.freeze_override', targetType: 'version', targetId: v.id,
        summary: `Admin override of ${v.freezeLevel.toLowerCase()} freeze on ${v.name}${x.issueKey ? ` for ${x.issueKey}` : ''} (${type?.key ?? '?'})`.slice(0, 300),
      },
    });
  }
}
