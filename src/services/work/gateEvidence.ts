/**
 * CT Work — BẰNG CHỨNG của phê duyệt cổng giai đoạn (CTW-1 + CTW-13, 06/10/2026).
 *
 * Trước đây khách là người duyệt cổng duy nhất mà KHÔNG thấy mình đang duyệt gì: cổng
 * khách xoá mô tả (ghi chú nội bộ) và không có thẻ/tệp nào đi kèm. Giờ một phê duyệt
 * STAGE_GATE mang theo:
 *   - `clientNote`  — lời nhắn người gửi viết CHO KHÁCH (description vẫn là ghi chú nội bộ);
 *   - tiêu chí      — thẻ cổng của giai đoạn (gateIssue: checklist điều kiện ra);
 *   - thẻ           — thẻ thuộc giai đoạn + thẻ người gửi ghim thêm (`evidence.issueIds`);
 *   - tệp           — tệp ghim (`evidence.attachmentIds`) + tệp bàn giao (deliverable) của thẻ giai đoạn;
 *   - tài liệu      — trang thuộc giai đoạn + trang ghim (`evidence.pageNumbers`);
 *   - việc còn mở   — số thẻ chưa xong lúc gửi + lý do người gửi ghi (CTW-13, CHỈ nội bộ).
 *
 * Luật "như khách" giữ nguyên một chỗ với cổng khách (portal.service.ts): thẻ phải
 * clientVisible, tệp phải clientVisible trên thẻ clientVisible, trang phải visibility CLIENT.
 * Thứ chưa chia sẻ KHÔNG hiện (cũng không lộ số lượng của riêng nó).
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';

/** Dữ liệu lưu ở work_approvals.evidence. */
export interface GateEvidenceStored {
  issueIds?: number[];
  pageNumbers?: number[];
  attachmentIds?: number[];
  /** Số thẻ còn mở của giai đoạn LÚC GỬI (CTW-13). */
  openIssues?: number;
  /** Lý do người gửi ghi khi gửi dù còn việc mở. */
  openReason?: string | null;
}

export interface GateEvidenceInput {
  issueNumbers?: number[];
  pageNumbers?: number[];
  attachmentIds?: number[];
}

const MAX_ITEMS = 100;

/** Kiểm + quy đổi bằng chứng người gửi ghim (số thẻ ⇒ id). Sai một cái ⇒ 400 nêu rõ cái nào. */
export async function resolveEvidence(projectId: number, input: GateEvidenceInput): Promise<Pick<GateEvidenceStored, 'issueIds' | 'pageNumbers' | 'attachmentIds'>> {
  const nums = [...new Set(input.issueNumbers ?? [])].slice(0, MAX_ITEMS);
  const pages = [...new Set(input.pageNumbers ?? [])].slice(0, MAX_ITEMS);
  const atts = [...new Set(input.attachmentIds ?? [])].slice(0, MAX_ITEMS);
  const [issueRows, pageRows, attRows] = await Promise.all([
    nums.length ? prisma.workIssue.findMany({ where: { projectId, number: { in: nums }, deletedAt: null }, select: { id: true, number: true } }) : [],
    pages.length ? prisma.workPage.findMany({ where: { projectId, number: { in: pages }, deletedAt: null }, select: { number: true } }) : [],
    atts.length ? prisma.workAttachment.findMany({ where: { id: { in: atts }, issue: { projectId, deletedAt: null } }, select: { id: true } }) : [],
  ]);
  const missIssue = nums.filter((n) => !issueRows.some((r) => r.number === n));
  if (missIssue.length) throw new BadRequestError(`Issue${missIssue.length > 1 ? 's' : ''} not found in this project: ${missIssue.join(', ')}`, 'WORK_BAD_EVIDENCE');
  const missPage = pages.filter((n) => !pageRows.some((r) => r.number === n));
  if (missPage.length) throw new BadRequestError(`Document${missPage.length > 1 ? 's' : ''} not found in this project: ${missPage.join(', ')}`, 'WORK_BAD_EVIDENCE');
  const missAtt = atts.filter((n) => !attRows.some((r) => r.id === n));
  if (missAtt.length) throw new BadRequestError(`Attachment${missAtt.length > 1 ? 's' : ''} not found in this project: ${missAtt.join(', ')}`, 'WORK_BAD_EVIDENCE');
  return { issueIds: issueRows.map((r) => r.id), pageNumbers: pages, attachmentIds: atts };
}

/** Thẻ còn mở của giai đoạn (CTW-13) — epic không tính (epic là khung, không phải việc). */
export async function openStageIssues(projectId: number, stageId: number) {
  const where: Prisma.WorkIssueWhereInput = { projectId, stageId, deletedAt: null, resolvedAt: null, type: { level: { not: 1 } } };
  const [count, sample] = await Promise.all([
    prisma.workIssue.count({ where }),
    prisma.workIssue.findMany({ where, orderBy: { number: 'asc' }, take: 20, select: { number: true, title: true, status: { select: { name: true } } } }),
  ]);
  return { count, sample };
}

const asNums = (v: unknown): number[] => (Array.isArray(v) ? v.filter((x): x is number => typeof x === 'number' && Number.isInteger(x)) : []);

/** Bằng chứng để HIỂN THỊ (nhân viên thấy đủ; khách chỉ thấy thứ đã chia sẻ). */
export async function gateEvidence(
  a: { targetType: string; stageId: number | null; projectId?: number; evidence?: Prisma.JsonValue | null },
  viewer: { projectId: number; projectKey: string; clientView: boolean },
) {
  if (a.targetType !== 'STAGE_GATE' || !a.stageId) return null;
  const ev = (a.evidence && typeof a.evidence === 'object' && !Array.isArray(a.evidence) ? a.evidence : {}) as Record<string, unknown>;
  const pinnedIssueIds = asNums(ev.issueIds);
  const pinnedPages = asNums(ev.pageNumbers);
  const pinnedAtts = asNums(ev.attachmentIds);
  const cv = viewer.clientView;
  const pid = viewer.projectId;
  const key = (n: number) => `${viewer.projectKey}-${n}`;

  const stage = await prisma.workStage.findFirst({
    where: { id: a.stageId, projectId: pid },
    select: { gateIssue: { select: { id: true, number: true, title: true, descriptionText: true, resolvedAt: true, clientVisible: true, deletedAt: true } } },
  });
  const issueSelect = { id: true, number: true, title: true, resolvedAt: true, status: { select: { name: true, category: true } }, type: { select: { name: true, level: true } } } as const;
  const shareIssue: Prisma.WorkIssueWhereInput = cv ? { clientVisible: true } : {};
  const [stageIssues, stageTotal, pinned, pages, files] = await Promise.all([
    prisma.workIssue.findMany({
      where: { projectId: pid, stageId: a.stageId, deletedAt: null, ...shareIssue, type: { level: { not: 1 } } },
      orderBy: [{ resolvedAt: { sort: 'desc', nulls: 'last' } }, { number: 'asc' }], take: MAX_ITEMS, select: issueSelect,
    }),
    prisma.workIssue.count({ where: { projectId: pid, stageId: a.stageId, deletedAt: null, ...shareIssue, type: { level: { not: 1 } } } }),
    pinnedIssueIds.length
      ? prisma.workIssue.findMany({ where: { id: { in: pinnedIssueIds }, projectId: pid, deletedAt: null, ...shareIssue }, orderBy: { number: 'asc' }, select: issueSelect })
      : Promise.resolve([]),
    prisma.workPage.findMany({
      where: { projectId: pid, deletedAt: null, OR: [{ stageId: a.stageId }, ...(pinnedPages.length ? [{ number: { in: pinnedPages } }] : [])], ...(cv ? { visibility: 'CLIENT' } : {}) },
      orderBy: { number: 'asc' }, take: MAX_ITEMS, select: { number: true, title: true, status: true, visibility: true },
    }),
    prisma.workAttachment.findMany({
      where: {
        issue: { projectId: pid, deletedAt: null, ...shareIssue },
        ...(cv ? { clientVisible: true } : {}),
        OR: [...(pinnedAtts.length ? [{ id: { in: pinnedAtts } }] : []), { deliverable: true, issue: { stageId: a.stageId } }],
      },
      orderBy: { id: 'asc' }, take: MAX_ITEMS,
      select: { id: true, fileName: true, mime: true, size: true, deliverable: true, clientVisible: true, issue: { select: { number: true } } },
    }),
  ]);
  const pinnedSet = new Set(pinnedIssueIds);
  const issueRow = (i: (typeof stageIssues)[number]) => ({
    number: i.number, key: key(i.number), title: i.title, done: !!i.resolvedAt, status: i.status, type: i.type.name, pinned: pinnedSet.has(i.id),
  });
  const byId = new Map<number, ReturnType<typeof issueRow>>();
  for (const i of pinned) byId.set(i.id, issueRow(i));
  for (const i of stageIssues) if (!byId.has(i.id)) byId.set(i.id, issueRow(i));
  const issues = [...byId.values()];
  const g = stage?.gateIssue;
  const criteria = g && !g.deletedAt && (!cv || g.clientVisible)
    ? { number: g.number, key: key(g.number), title: g.title, done: !!g.resolvedAt, text: g.descriptionText ? g.descriptionText.slice(0, 4000) : null }
    : null;
  const openReason = typeof ev.openReason === 'string' ? ev.openReason : null;
  return {
    criteria,
    issues,
    /** Tổng thẻ của giai đoạn (người xem thấy được) — danh sách có thể bị cắt ở 100. */
    issueTotal: Math.max(stageTotal, issues.length),
    issueDone: issues.filter((i) => i.done).length,
    pages: pages.map((p) => ({ number: p.number, title: p.title, status: p.status, ...(cv ? {} : { visibility: p.visibility }) })),
    files: files.map((f) => ({
      id: f.id, fileName: f.fileName, mime: f.mime, size: f.size, deliverable: f.deliverable, issueKey: key(f.issue.number),
      ...(cv ? {} : { clientVisible: f.clientVisible }),
    })),
    // CTW-13: việc còn mở lúc gửi + lý do — chỉ đội dự án thấy.
    ...(cv ? {} : { openAtRequest: typeof ev.openIssues === 'number' ? ev.openIssues : null, openReason }),
  };
}
