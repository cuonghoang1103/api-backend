/**
 * CT Work — báo cáo nội dung (App Store 1.2, 18/10/2026). MỘT cửa `POST /work/report {kind, id, reason, detail?}` cho
 * mọi nội dung do người dùng viết trong CT Work.
 *
 * Không thêm bảng: ghi vào HAI cơ chế sẵn có —
 *   1. hàng chờ BAO_CAO của quản trị site (`admin_notifications`, `baoAdmin`) — `khoaChongTrung` chống báo trùng
 *      (một người, một nội dung, một lần), cũng là chỗ app iOS cũ gửi qua `/academy/advisor/report-answer`;
 *   2. audit log của không gian (`content.report`) + WORK_ALERT cho ADMIN dự án — y như báo cáo bình luận thẻ có từ trước
 *      (`issues.reportComment`, giữ nguyên đường đó). Nội dung lớp học không thuộc không gian nào ⇒ báo GV + chủ lớp.
 *
 * Người báo cáo phải THẤY được nội dung (nội dung không thấy ⇒ 404, không lộ là có tồn tại). Khách cổng chỉ báo cáo được
 * thứ họ thấy trong cổng: bình luận PUBLIC trên thẻ đã chia sẻ, tin ở kênh họ đọc được, CR đã chia sẻ.
 * Agent không báo cáo (tuyến ngoài /projects/:pid ⇒ agentTopRouteAllowed chặn; service chặn lần nữa).
 */

import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { assertHumanActor, canViewPage, isClientScoped, loadProjectAccess, type ProjectAccess } from './permissions.js';
import { COMMENT_REPORT_REASONS } from './issues.service.js';

export const REPORT_KINDS = [
  'chat_message', 'issue_comment', 'page_comment', 'meeting_note', 'retro_card', 'change_request', 'raid_item',
  'review_item', 'approval_step', 'intake_message', 'form_answer', 'class_post', 'class_comment', 'diagram_comment',
  // 21/10/2026: Bảng tin nhóm — đi đường riêng của feed.service (hàng chờ báo cáo trong bảng tin + quản trị site).
  'feed_post', 'feed_comment',
] as const;
export type ReportKind = (typeof REPORT_KINDS)[number];
export const REPORT_REASONS = COMMENT_REPORT_REASONS;
export type ReportReason = (typeof REPORT_REASONS)[number];

interface Target {
  projectId: number | null;
  classId: number | null;
  authorId: number | null;
  /** Ẩn tác giả với ADMIN dự án (thẻ retro ẩn danh). Quản trị site vẫn thấy. */
  hideAuthor?: boolean;
  excerpt: string;
  /** "NW · chat #general" — đi vào tiêu đề audit/thông báo. */
  label: string;
  url: string | null;
}

const NF = () => new NotFoundError('Content not found');

async function projectRef(projectId: number) {
  return prisma.workProject.findUnique({ where: { id: projectId }, select: { key: true, workspace: { select: { slug: true } } } });
}

/** Người báo cáo vào được dự án; khách cổng chỉ khi `clientOk`. */
async function accessOrNotFound(userId: number, projectId: number, clientOk = false): Promise<ProjectAccess> {
  const a = await loadProjectAccess(userId, projectId);
  if (!a) throw NF();
  if (isClientScoped(a) && !clientOk) throw NF();
  return a;
}

async function resolveTarget(userId: number, kind: ReportKind, id: number): Promise<Target> {
  switch (kind) {
    case 'chat_message': {
      const m = await prisma.workChannelMessage.findFirst({ where: { id, deletedAt: null }, select: { channelId: true, authorId: true, body: true, kind: true, channel: { select: { projectId: true, name: true } } } });
      if (!m) throw NF();
      // getMessage kiểm quyền thấy KÊNH (kênh riêng, kênh CLIENT với khách…) — ném 404/403 nếu không thấy.
      const { getMessage, chatUrl } = await import('./chat.service.js');
      await getMessage(userId, m.channel.projectId, m.channelId, id).catch(() => { throw NF(); });
      if (m.kind === 'SYSTEM') throw new BadRequestError('System messages cannot be reported', 'WORK_REPORT_SYSTEM');
      const p = await projectRef(m.channel.projectId);
      return { projectId: m.channel.projectId, classId: null, authorId: m.authorId, excerpt: m.body, label: `${p?.key ?? ''} · #${m.channel.name}`, url: p ? chatUrl(p, m.channelId, id) : null };
    }
    case 'page_comment': {
      const c = await prisma.workPageComment.findFirst({ where: { id, deletedAt: null }, select: { authorId: true, bodyText: true, page: { select: { projectId: true, number: true, title: true, visibility: true, deletedAt: true } } } });
      if (!c || c.page.deletedAt) throw NF();
      const a = await accessOrNotFound(userId, c.page.projectId);
      if (!canViewPage(a.role, a.workspaceRole, c.page.visibility)) throw NF();
      const p = await projectRef(c.page.projectId);
      return { projectId: c.page.projectId, classId: null, authorId: c.authorId, excerpt: c.bodyText, label: `${a.key} · page "${c.page.title}"`, url: p ? `/work/${p.workspace.slug}/${p.key}/pages/${c.page.number}` : null };
    }
    case 'meeting_note': {
      const m = await prisma.workMeeting.findFirst({ where: { id, deletedAt: null }, select: { projectId: true, number: true, title: true, organizerId: true, minutesText: true, agendaText: true } });
      if (!m) throw NF();
      const a = await accessOrNotFound(userId, m.projectId);
      const p = await projectRef(m.projectId);
      return { projectId: m.projectId, classId: null, authorId: m.organizerId, excerpt: [m.title, m.minutesText ?? m.agendaText ?? ''].join('\n'), label: `${a.key} · M-${m.number}`, url: p ? `/work/${p.workspace.slug}/${p.key}/meetings/${m.number}` : null };
    }
    case 'retro_card': {
      const c = await prisma.workRetroCard.findUnique({ where: { id }, select: { authorId: true, body: true, retro: { select: { id: true, projectId: true, title: true, anonymous: true } } } });
      if (!c) throw NF();
      const a = await accessOrNotFound(userId, c.retro.projectId);
      const p = await projectRef(c.retro.projectId);
      return { projectId: c.retro.projectId, classId: null, authorId: c.authorId, hideAuthor: c.retro.anonymous, excerpt: c.body, label: `${a.key} · retro "${c.retro.title}"`, url: p ? `/work/${p.workspace.slug}/${p.key}/retros/${c.retro.id}` : null };
    }
    case 'change_request': {
      const r = await prisma.workChangeRequest.findFirst({ where: { id, deletedAt: null }, select: { projectId: true, number: true, title: true, descriptionText: true, reason: true, createdById: true, requesterId: true, clientVisible: true } });
      if (!r) throw NF();
      const a = await accessOrNotFound(userId, r.projectId, true);
      if (isClientScoped(a) && !r.clientVisible) throw NF();
      const p = await projectRef(r.projectId);
      return { projectId: r.projectId, classId: null, authorId: r.requesterId ?? r.createdById, excerpt: [r.title, r.descriptionText ?? '', r.reason ?? ''].filter(Boolean).join('\n'), label: `${a.key} · CR-${r.number}`, url: p ? `/work/${p.workspace.slug}/${p.key}/changes/${r.number}` : null };
    }
    case 'raid_item': {
      const r = await prisma.workRaidItem.findFirst({ where: { id, deletedAt: null }, select: { projectId: true, number: true, title: true, description: true, ownerId: true } });
      if (!r) throw NF();
      const a = await accessOrNotFound(userId, r.projectId);
      const p = await projectRef(r.projectId);
      return { projectId: r.projectId, classId: null, authorId: r.ownerId, excerpt: [r.title, r.description ?? ''].filter(Boolean).join('\n'), label: `${a.key} · RAID-${r.number}`, url: p ? `/work/${p.workspace.slug}/${p.key}/raid` : null };
    }
    case 'review_item': {
      const r = await prisma.workReviewItem.findUnique({ where: { id }, select: { question: true, note: true, line: true, session: { select: { projectId: true, number: true, title: true, createdById: true, deletedAt: true } } } });
      if (!r || r.session.deletedAt) throw NF();
      const a = await accessOrNotFound(userId, r.session.projectId);
      const p = await projectRef(r.session.projectId);
      return { projectId: r.session.projectId, classId: null, authorId: r.session.createdById, excerpt: [r.question, r.note ?? '', r.line ?? ''].filter(Boolean).join('\n'), label: `${a.key} · review RV-${r.session.number}`, url: p ? `/work/${p.workspace.slug}/${p.key}/reviews/${r.session.number}` : null };
    }
    case 'approval_step': {
      const s = await prisma.workApprovalStep.findUnique({ where: { id }, select: { approverId: true, comment: true, approval: { select: { id: true, projectId: true, title: true, createdById: true, steps: { select: { approverId: true } } } } } });
      if (!s || !s.comment) throw NF();
      const a = await accessOrNotFound(userId, s.approval.projectId, true);
      // Khách chỉ thấy phê duyệt có tên họ trong danh sách duyệt (cổng khách lọc y như vậy).
      if (isClientScoped(a) && !s.approval.steps.some((x) => x.approverId === userId) && s.approval.createdById !== userId) throw NF();
      const p = await projectRef(s.approval.projectId);
      return { projectId: s.approval.projectId, classId: null, authorId: s.approverId, excerpt: s.comment, label: `${a.key} · approval "${s.approval.title}"`, url: p ? `/work/${p.workspace.slug}/${p.key}/approvals?approval=${s.approval.id}` : null };
    }
    case 'intake_message': {
      const r = await prisma.workIntakeProposal.findUnique({ where: { id }, select: { projectId: true, title: true, body: true, senderUserId: true, senderName: true } });
      if (!r) throw NF();
      const a = await accessOrNotFound(userId, r.projectId);
      const p = await projectRef(r.projectId);
      return { projectId: r.projectId, classId: null, authorId: r.senderUserId, excerpt: [r.senderName ? `${r.senderName}:` : '', r.title, r.body ?? ''].filter(Boolean).join('\n'), label: `${a.key} · intake`, url: p ? `/work/${p.workspace.slug}/${p.key}/intake` : null };
    }
    case 'form_answer': {
      const r = await prisma.workFormResponse.findUnique({ where: { id }, select: { answers: true, userId: true, respondentName: true, form: { select: { projectId: true, number: true, title: true, deletedAt: true } } } });
      if (!r || r.form.deletedAt) throw NF();
      const a = await accessOrNotFound(userId, r.form.projectId);
      const p = await projectRef(r.form.projectId);
      return { projectId: r.form.projectId, classId: null, authorId: r.userId, excerpt: `${r.respondentName ? `${r.respondentName}: ` : ''}${JSON.stringify(r.answers).slice(0, 1500)}`, label: `${a.key} · form F-${r.form.number}`, url: p ? `/work/${p.workspace.slug}/${p.key}/forms/F-${r.form.number}` : null };
    }
    case 'diagram_comment': {
      const c = await prisma.workDiagramComment.findFirst({ where: { id, deletedAt: null }, select: { authorId: true, body: true, diagram: { select: { projectId: true, number: true, title: true, deletedAt: true } } } });
      if (!c || c.diagram.deletedAt) throw NF();
      const a = await accessOrNotFound(userId, c.diagram.projectId);
      const p = await projectRef(c.diagram.projectId);
      return { projectId: c.diagram.projectId, classId: null, authorId: c.authorId, excerpt: c.body, label: `${a.key} · diagram "${c.diagram.title}"`, url: p ? `/work/${p.workspace.slug}/${p.key}/diagrams/${c.diagram.number}` : null };
    }
    case 'class_post':
    case 'class_comment': {
      const { getPost } = await import('./classStream.service.js');
      let postId = id;
      let authorId: number | null = null;
      let excerpt = '';
      if (kind === 'class_comment') {
        const c = await prisma.workClassComment.findFirst({ where: { id, deletedAt: null }, select: { postId: true, authorId: true, body: true } });
        if (!c) throw NF();
        postId = c.postId; authorId = c.authorId; excerpt = c.body;
      }
      const post = await prisma.workClassPost.findFirst({ where: { id: postId, deletedAt: null }, select: { classId: true, authorId: true, title: true, bodyText: true, class: { select: { classCode: true } } } });
      if (!post) throw NF();
      // getPost kiểm thành viên lớp + bài nhắm tới nhóm của SV — không thấy ⇒ 404.
      await getPost(userId, post.classId, postId).catch(() => { throw NF(); });
      if (kind === 'class_post') { authorId = post.authorId; excerpt = [post.title ?? '', post.bodyText ?? ''].filter(Boolean).join('\n'); }
      return { projectId: null, classId: post.classId, authorId, excerpt, label: `class ${post.class.classCode}`, url: `/work/classes?id=${post.classId}&tab=stream&post=${postId}` };
    }
    default:
      throw new BadRequestError('Unknown content kind', 'VALIDATION_ERROR');
  }
}

/** Ai được báo trong CT Work: ADMIN dự án, hoặc GV + chủ lớp. Không bao giờ chính người báo cáo / tác giả. */
async function moderatorsOf(t: Target, reporterId: number): Promise<number[]> {
  const ids = new Set<number>();
  if (t.projectId) {
    const { projectMembers } = await import('./projects.service.js');
    for (const m of await projectMembers(t.projectId)) if (m.role === 'ADMIN') ids.add(m.id);
  } else if (t.classId) {
    const c = await prisma.workClass.findUnique({ where: { id: t.classId }, select: { ownerId: true, teacherId: true } });
    if (c) { ids.add(c.ownerId); if (c.teacherId) ids.add(c.teacherId); }
  }
  ids.delete(reporterId);
  if (t.authorId) ids.delete(t.authorId);
  return [...ids];
}

export async function reportContent(userId: number, input: { kind: ReportKind; id: number; reason: ReportReason; detail?: string | null }) {
  await assertHumanActor(userId, 'report content');
  // Bình luận thẻ: đi đúng đường cũ (audit `comment.report`, cùng chống trùng) — app/web cũ và mới ra cùng một dòng.
  if (input.kind === 'issue_comment') {
    const c = await prisma.workComment.findFirst({ where: { id: input.id, deletedAt: null }, select: { issue: { select: { projectId: true, number: true } } } });
    if (!c) throw NF();
    const { reportComment } = await import('./issues.service.js');
    return reportComment(userId, c.issue.projectId, c.issue.number, input.id, { reason: input.reason, details: input.detail ?? null });
  }

  // Bảng tin nhóm: cùng một luật với POST /feed/posts/:id/report (hàng chờ kiểm duyệt của bảng tin + BAO_CAO của site).
  if (input.kind === 'feed_post' || input.kind === 'feed_comment') {
    const feed = await import('./feed.service.js');
    const body = { reason: input.reason, detail: input.detail ?? null };
    return input.kind === 'feed_post' ? feed.reportPost(userId, input.id, body) : feed.reportComment(userId, input.id, body);
  }
  const t = await resolveTarget(userId, input.kind, input.id);
  if (t.authorId === userId) throw new BadRequestError('You cannot report your own content', 'WORK_REPORT_SELF');
  const detail = input.detail?.trim().slice(0, 1000) || null;
  const excerpt = t.excerpt.slice(0, 600);

  const { baoAdmin } = await import('../thongBaoAdmin.service.js');
  const row = await baoAdmin({
    loai: 'BAO_CAO', mucDo: 'can_xu_ly',
    tieuDe: `Báo cáo nội dung CT Work: ${input.kind} · ${t.label}`.slice(0, 200),
    noiDung: [`Lý do: ${input.reason}`, detail && `Chi tiết: ${detail}`, t.authorId ? `Tác giả: user #${t.authorId}` : null, `Nội dung: ${excerpt}`].filter(Boolean).join('\n'),
    duongDan: t.url,
    userId,
    entityId: input.id,
    khoaChongTrung: `ctw-report:${input.kind}:${input.id}:${userId}`,
  });
  // baoAdmin trả null khi khoá chống trùng đã có (hoặc ghi hỏng — đã log ở đó) ⇒ coi là báo trùng, không báo lại admin dự án.
  if (!row) return { reported: true, duplicate: true };

  if (t.projectId) {
    const { auditProject } = await import('./audit.js');
    await auditProject(t.projectId, {
      actorId: userId, action: 'content.report', targetType: input.kind.slice(0, 24), targetId: input.id,
      summary: `Reported ${input.kind.replace(/_/g, ' ')} in ${t.label} (${input.reason})`.slice(0, 500),
      detail: { kind: input.kind, reason: input.reason, details: detail, authorId: t.hideAuthor ? null : t.authorId, excerpt: excerpt.slice(0, 300) },
    });
  }
  const { notifyWork } = await import('./notify.js');
  for (const uid of await moderatorsOf(t, userId)) {
    await notifyWork({
      receiverId: uid, senderId: userId, type: 'WORK_ALERT', entityId: t.projectId ?? t.classId ?? input.id, secondaryEntityId: input.id,
      payload: { issueKey: t.label.slice(0, 60), title: '', message: `Content was reported (${input.reason}). Review and remove it if needed.`, ...(t.url ? { url: t.url } : {}), report: { kind: input.kind, id: input.id } },
    }).catch((err) => logger.warn('[work] báo admin về nội dung bị báo cáo lỗi', { err: (err as Error).message }));
  }
  return { reported: true, duplicate: false };
}
