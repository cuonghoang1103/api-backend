/**
 * CT Work — THÔNG BÁO CHO KHÁCH (cổng khách đợt S2b, mô-đun `clientPortal`).
 *
 * Hai việc:
 *   1. `routeForClient()` — CỬA CUỐI của mọi thông báo (notify.ts notifyWork gọi
 *      trước khi đẩy chuông + gửi email). Người nhận là khách bị cách ly ⇒ chỉ cho
 *      qua đúng các loại khách được biết, và VIẾT LẠI thành thông báo cổng khách
 *      (link /portal, không tiêu đề nội bộ). Loại khác ⇒ bỏ. Nhờ vậy một tính năng
 *      sau này quên lọc khách cũng không làm lộ gì qua chuông/email.
 *   2. Sự kiện riêng cho khách: có trả lời PUBLIC, giai đoạn hoàn thành, bàn giao
 *      mới — `notifyClientsOfProject()`.
 *
 * Email cho khách: giọng chuyên nghiệp, tiếng Anh, thương hiệu "<Dự án> · Client
 * portal", KHÔNG bao giờ kèm ghi chú nội bộ. Khách tắt/bật bằng cài đặt email có
 * sẵn (INSTANT / DIGEST / OFF + giờ im lặng) — notify.ts emailFor tôn trọng.
 */

import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { onWorkEvent } from './events.js';
import { isClientScoped, loadProjectAccess } from './permissions.js';
import { modulesOf } from './studio.js';

export type PortalSection = 'overview' | 'requests' | 'approvals' | 'documents' | 'deliverables' | 'activity' | 'meetings';
export type PortalKind = 'reply' | 'approval' | 'stage' | 'deliverable' | 'uat' | 'request' | 'meeting' | 'csat';

export interface WorkNotifyLike {
  receiverId: number;
  senderId: number;
  type: 'WORK_INVITE' | 'WORK_ASSIGN' | 'WORK_COMMENT' | 'WORK_MENTION' | 'WORK_ALERT';
  entityId: number;
  secondaryEntityId?: number | null;
  payload: Record<string, unknown>;
}

export function portalPath(slug: string, key: string, section?: PortalSection, issueNumber?: number | null): string {
  const q = new URLSearchParams();
  if (section && section !== 'overview') q.set('tab', section);
  if (issueNumber) q.set('issue', String(issueNumber));
  const s = q.toString();
  return `/work/${slug}/${key}/portal${s ? `?${s}` : ''}`;
}

/** Khách bị cách ly của một dự án (vai CLIENT có dòng dự án, không phải OWNER/ADMIN không gian, cổng khách bật). */
export async function clientMemberIds(projectId: number): Promise<number[]> {
  const p = await prisma.workProject.findUnique({
    where: { id: projectId },
    select: {
      settings: true, workspaceId: true,
      members: { where: { role: 'CLIENT' }, select: { userId: true } },
    },
  });
  if (!p || !modulesOf(p.settings).clientPortal || !p.members.length) return [];
  const ws = await prisma.workMember.findMany({
    where: { workspaceId: p.workspaceId, userId: { in: p.members.map((m) => m.userId) }, role: { in: ['MEMBER', 'GUEST'] } },
    select: { userId: true },
  });
  return ws.map((m) => m.userId);
}

const PROJECT_URL_RE = /^\/work\/([^/?#]+)\/([^/?#]+)(?:[/?#].*)?$/;

/**
 * Cửa cuối: trả bản thông báo AN TOÀN cho khách, hoặc `null` (không gửi).
 * Người nhận không phải khách bị cách ly ⇒ trả nguyên `args`.
 */
export async function routeForClient<T extends WorkNotifyLike>(args: T): Promise<T | null> {
  if (args.payload.portal === true) return args; // đã soạn riêng cho khách (notifyClientsOfProject)
  const url = typeof args.payload.url === 'string' ? args.payload.url : '';
  const m = PROJECT_URL_RE.exec(url);
  if (!m) return args;
  const project = await prisma.workProject.findFirst({
    where: { key: decodeURIComponent(m[2]).toUpperCase(), deletedAt: null, workspace: { slug: decodeURIComponent(m[1]), deletedAt: null } },
    select: { id: true, key: true, name: true, workspace: { select: { slug: true } } },
  });
  if (!project) return args;
  const access = await loadProjectAccess(args.receiverId, project.id);
  if (!access || !isClientScoped(access)) return args;

  const base = { issueKey: project.key, projectName: project.name, portal: true };
  const slug = project.workspace.slug;
  try {
    if (args.type === 'WORK_COMMENT' || args.type === 'WORK_MENTION') {
      const c = args.secondaryEntityId
        ? await prisma.workComment.findFirst({
          where: { id: args.secondaryEntityId, deletedAt: null, visibility: 'PUBLIC', issue: { projectId: project.id, clientVisible: true, deletedAt: null } },
          select: { bodyText: true, issue: { select: { number: true, title: true } } },
        })
        : null;
      if (!c) return null;
      return {
        ...args, type: 'WORK_COMMENT',
        payload: { ...base, issueKey: `${project.key}-${c.issue.number}`, title: c.issue.title, excerpt: c.bodyText.slice(0, 140), portalKind: 'reply', url: portalPath(slug, project.key, 'requests', c.issue.number) },
      };
    }
    if (args.type === 'WORK_ASSIGN') {
      const i = await prisma.workIssue.findFirst({ where: { id: args.entityId, projectId: project.id, clientVisible: true, deletedAt: null }, select: { number: true, title: true } });
      if (!i) return null;
      return { ...args, payload: { ...base, issueKey: `${project.key}-${i.number}`, title: i.title, portalKind: 'request', url: portalPath(slug, project.key, 'requests', i.number) } };
    }
    if (args.type === 'WORK_ALERT' && typeof args.payload.approvalId === 'number') {
      const a = await prisma.workApproval.findFirst({
        where: { id: args.payload.approvalId, projectId: project.id, steps: { some: { approverId: args.receiverId } } },
        select: { id: true, title: true, targetType: true },
      });
      if (!a) return null;
      const message = typeof args.payload.message === 'string' && /requested/i.test(args.payload.message)
        ? (a.targetType === 'UAT' ? 'Your UAT sign-off is requested' : 'Your approval is requested')
        : 'An approval request was updated';
      return { ...args, payload: { ...base, title: a.title, message, approvalId: a.id, portalKind: a.targetType === 'UAT' ? 'uat' : 'approval', url: `${portalPath(slug, project.key, 'approvals')}&approval=${a.id}` } };
    }
  } catch (err) {
    logger.warn('[work] lọc thông báo khách lỗi — bỏ thông báo', { err: (err as Error).message });
  }
  // Mọi loại khác (bàn giao, báo cáo bình luận, cảnh báo nội bộ…) không bao giờ tới khách.
  return null;
}

/** Thông báo cho MỌI khách của dự án (trừ người gửi). Lỗi chỉ ghi log. */
export async function notifyClientsOfProject(
  projectId: number,
  senderId: number,
  ev: { kind: PortalKind; title: string; section: PortalSection; message?: string; issueNumber?: number | null; excerpt?: string | null },
  only?: number[],
): Promise<number> {
  try {
    const ids = (only ?? (await clientMemberIds(projectId))).filter((id) => id !== senderId);
    if (!ids.length) return 0;
    const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, name: true, workspace: { select: { slug: true } } } });
    const { notifyWork } = await import('./notify.js');
    for (const receiverId of ids) {
      await notifyWork({
        receiverId, senderId, type: ev.kind === 'reply' ? 'WORK_COMMENT' : 'WORK_ALERT', entityId: projectId,
        payload: {
          portal: true, portalKind: ev.kind, projectName: p.name,
          issueKey: ev.issueNumber ? `${p.key}-${ev.issueNumber}` : p.key,
          title: ev.title.slice(0, 200), message: ev.message ?? null, excerpt: ev.excerpt ?? null,
          url: portalPath(p.workspace.slug, p.key, ev.section, ev.issueNumber),
        },
      });
    }
    return ids.length;
  } catch (err) {
    logger.warn('[work] báo khách lỗi', { projectId, err: (err as Error).message });
    return 0;
  }
}

/** Chủ đề + nội dung email cho khách — KHÔNG chứa gì ngoài dữ liệu đã chia sẻ. */
export function clientEmailContent(payload: Record<string, unknown>): { subject: string; heading: string; lines: string[]; cta: string } {
  const key = String(payload.issueKey ?? '');
  const title = String(payload.title ?? '');
  const excerpt = typeof payload.excerpt === 'string' && payload.excerpt ? `“${payload.excerpt}”` : '';
  switch (payload.portalKind) {
    case 'reply':
      return { subject: `New reply on ${key}: ${title}`, heading: `The team replied on ${key}`, lines: [title, excerpt], cta: 'Read and reply' };
    case 'approval':
      return { subject: `Approval requested: ${title}`, heading: 'Your approval is requested', lines: [title, 'Please review it and approve or reject with a short note.'], cta: 'Review and decide' };
    case 'uat':
      return { subject: `UAT sign-off requested: ${title}`, heading: 'Your acceptance sign-off is requested', lines: [title, 'Please check the listed items and approve (optionally with conditions) or reject with the points you found.'], cta: 'Open UAT sign-off' };
    case 'stage':
      return { subject: `Milestone completed: ${title}`, heading: 'A project milestone was completed', lines: [`“${title}” is complete.`, typeof payload.message === 'string' ? payload.message : ''], cta: 'View project progress' };
    case 'meeting':
      return { subject: `Meeting: ${title}`, heading: typeof payload.message === 'string' && payload.message ? payload.message : 'You are invited to a meeting', lines: [title, excerpt], cta: 'Open meeting' };
    case 'deliverable':
      return { subject: `New deliverable: ${title}`, heading: 'A new deliverable is ready', lines: [`“${title}” has been delivered and is ready to download.`], cta: 'Open deliverables' };
    // Đợt S5a: mời người gửi yêu cầu chấm CSAT khi yêu cầu được giải quyết.
    case 'csat':
      return { subject: `How did we do? ${key}: ${title}`, heading: `Your request ${key} was resolved`, lines: [title, 'Please rate how we handled it — from 1 (poor) to 5 (excellent) — and add a comment if you like. It takes ten seconds.'], cta: 'Rate this request' };
    case 'request':
    default:
      return { subject: `Update on ${key}: ${title}`, heading: `Update on ${key}`, lines: [title, excerpt], cta: 'Open client portal' };
  }
}

let registered = false;

/** Sự kiện → thông báo khách. Gọi một lần (notify.ts registerWorkNotifications). */
export function registerPortalNotifications(): void {
  if (registered) return;
  registered = true;
  onWorkEvent(async (e) => {
    if (e.actor.userId === null) return;
    const sender = e.actor.userId;
    if (e.type === 'comment.created') {
      const c = await prisma.workComment.findUnique({
        where: { id: e.commentId },
        select: { visibility: true, bodyText: true, deletedAt: true, issue: { select: { number: true, title: true, clientVisible: true, deletedAt: true } } },
      });
      if (!c || c.deletedAt || c.visibility !== 'PUBLIC' || !c.issue.clientVisible || c.issue.deletedAt) return;
      await notifyClientsOfProject(e.projectId, sender, { kind: 'reply', title: c.issue.title, section: 'requests', issueNumber: c.issue.number, excerpt: c.bodyText.slice(0, 140) });
      return;
    }
    if (e.type === 'stage.updated' && e.status === 'DONE') {
      const s = await prisma.workStage.findUnique({ where: { id: e.stageId }, select: { name: true, n: true } });
      if (!s) return;
      await notifyClientsOfProject(e.projectId, sender, { kind: 'stage', title: `${s.n}. ${s.name}`, section: 'overview', message: 'You can follow the next stages in the client portal.' });
    }
  });
}
