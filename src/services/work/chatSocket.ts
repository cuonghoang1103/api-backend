/**
 * CT Work K-3 — chốt quyền cho socket kênh chat (work.socket.ts `work:chat:join`). Cùng luật với REST
 * (chatRules.canViewChannel trên loadProjectAccess). AI agent không vào phòng chat — agent đọc qua registry.
 */

import { prisma } from '../../config/database.js';
import { canViewChannel } from './chatRules.js';
import { loadProjectAccess } from './permissions.js';

export { chatRoom } from './chat.service.js';

export async function canJoinChannel(userId: number, projectId: number, channelId: number): Promise<boolean> {
  const access = await loadProjectAccess(userId, projectId);
  if (!access || access.principal === 'AGENT') return false;
  const ch = await prisma.workChannel.findFirst({ where: { id: channelId, projectId }, select: { kind: true } });
  if (!ch) return false;
  const member = !!(await prisma.workChannelMember.findFirst({ where: { channelId, userId, explicit: true }, select: { userId: true } }));
  return canViewChannel({ role: access.role, workspaceRole: access.workspaceRole, principal: access.principal }, ch, member);
}
