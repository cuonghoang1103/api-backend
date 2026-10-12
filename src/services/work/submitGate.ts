/**
 * CT Work — CỔNG NỘP BÀI / BÀN GIAO (CTW, 12/10/2026).
 *
 * Vấn đề: thành viên làm xong chỉ kéo thẻ sang Done; nhóm trưởng phải mở TỪNG thẻ,
 * tự tải đính kèm, tự xếp lại để làm slide/báo cáo — tốn công, dễ sót. Trang "Nộp bài"
 * gom tất cả vào MỘT chỗ: mỗi người × deliverable × trạng thái (đã nộp / thiếu / đúng giờ),
 * kèm nút "Tải tất cả" (zip). Và một CỔNG tuỳ chọn chặn Done khi chưa đính kèm.
 *
 * Thiết kế an toàn:
 *   - Cấu hình nằm ở `project.settings.submitGate`, **mặc định TẮT** ⇒ không dự án nào
 *     đang chạy bị đổi hành vi. Nhóm trưởng (ADMIN) tự bật.
 *   - `mode: 'soft'` — backend KHÔNG chặn Done; frontend hiện form check-out (đính kèm
 *     hoặc xác nhận "không cần nộp gì"). `mode: 'hard'` — backend CHẶN Done khi thiếu
 *     đính kèm (như Definition of Done), không bỏ qua được.
 *   - "Deliverable" = tệp đính kèm thật của thẻ (không tính tệp dán trong ô bình luận).
 */

import type { Prisma } from '@prisma/client';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import JSZip from 'jszip';
import { config } from '../../config/env.js';
import { prisma } from '../../config/database.js';
import { getR2Client } from '../../config/r2.js';
import { BadRequestError, ForbiddenError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { PUBLIC_USER, displayName } from './common.js';
import { loadProjectAccess } from './permissions.js';

export interface SubmitGateConfig {
  enabled: boolean;
  /** soft = frontend nhắc, backend cho qua · hard = backend chặn Done khi thiếu đính kèm. */
  mode: 'soft' | 'hard';
  /** Số tệp đính kèm tối thiểu để coi là "đã nộp" (1–20). */
  minAttachments: number;
  /** Chỉ áp cho các loại thẻ này (key). null = mọi thẻ không phải epic. */
  typeKeys: string[] | null;
}

export const DEFAULT_SUBMIT_GATE: SubmitGateConfig = { enabled: false, mode: 'soft', minAttachments: 1, typeKeys: null };

/** Đọc cấu hình từ settings JSON — thiếu/sai kiểu ⇒ mặc định TẮT (an toàn). */
export function submitGateOf(settings: unknown): SubmitGateConfig {
  const raw = (settings && typeof settings === 'object' ? (settings as Record<string, unknown>).submitGate : null) as
    | Partial<Record<keyof SubmitGateConfig, unknown>>
    | null
    | undefined;
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_SUBMIT_GATE };
  const min = raw.minAttachments;
  return {
    enabled: raw.enabled === true,
    mode: raw.mode === 'hard' ? 'hard' : 'soft',
    minAttachments: typeof min === 'number' && Number.isInteger(min) && min > 0 ? Math.min(min, 20) : 1,
    typeKeys: Array.isArray(raw.typeKeys) && raw.typeKeys.length ? raw.typeKeys.map((x) => String(x)) : null,
  };
}

/** Chuẩn hoá cấu hình người dùng gửi lên (Project settings → Nộp bài). */
export function cleanSubmitGate(input: unknown): SubmitGateConfig {
  return submitGateOf({ submitGate: input });
}

/**
 * Chặn vào cột DONE khi CỔNG bật ở chế độ `hard` mà thẻ chưa đủ tệp đính kèm.
 * Chạy TRONG cửa ghi chung (cạnh assertDoneRequirements) nên kéo board, sửa hàng loạt,
 * app, MCP đều bị chặn như nhau. Chế độ `soft` không chặn ở đây (frontend lo).
 */
export async function assertSubmitGate(
  tx: Prisma.TransactionClient,
  projectId: number,
  issueId: number,
  typeKey: string,
  issueKey: string,
) {
  const p = await tx.workProject.findUnique({ where: { id: projectId }, select: { settings: true } });
  const cfg = submitGateOf(p?.settings);
  if (!cfg.enabled || cfg.mode !== 'hard') return;
  if (cfg.typeKeys && !cfg.typeKeys.includes(typeKey)) return;
  const n = await tx.workAttachment.count({ where: { issueId, forComment: false } });
  if (n < cfg.minAttachments) {
    throw new BadRequestError(
      `Chưa nộp bài: hãy đính kèm ${cfg.minAttachments === 1 ? 'ít nhất 1 tệp' : `ít nhất ${cfg.minAttachments} tệp`} vào ${issueKey} trước khi kéo sang Done (cổng nộp bài đang bật). / Attach your deliverable to ${issueKey} before moving it to Done.`,
      'WORK_SUBMIT_INCOMPLETE',
    );
  }
}

const SCOPE_WHERE = (projectId: number, cfg: SubmitGateConfig): Prisma.WorkIssueWhereInput => ({
  projectId,
  deletedAt: null,
  type: { level: { not: 1 }, ...(cfg.typeKeys ? { key: { in: cfg.typeKeys } } : {}) }, // epic (level 1) là khung, không nộp
  assigneeId: { not: null },
});

function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

/** Trang "Nộp bài": gom deliverable theo người + trạng thái + đúng giờ. Mọi thành viên xem được. */
export async function listSubmissions(userId: number, projectId: number) {
  const access = await loadProjectAccess(userId, projectId);
  if (!access) throw new ForbiddenError('You are not a member of this project');
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, name: true, settings: true } });
  const cfg = submitGateOf(project.settings);

  const issues = await prisma.workIssue.findMany({
    where: SCOPE_WHERE(projectId, cfg),
    orderBy: [{ assigneeId: 'asc' }, { number: 'asc' }],
    select: {
      number: true, title: true, dueDate: true, resolvedAt: true,
      status: { select: { name: true, category: true } },
      type: { select: { key: true, name: true } },
      assignee: { select: PUBLIC_USER },
      attachments: {
        where: { forComment: false },
        orderBy: { createdAt: 'asc' },
        select: { id: true, fileName: true, mime: true, size: true, createdAt: true, uploaderId: true },
      },
    },
  });

  type Row = (typeof issues)[number];
  const toItem = (it: Row) => {
    const done = it.status.category === 'DONE';
    const count = it.attachments.length;
    const onTime = it.resolvedAt && it.dueDate ? it.resolvedAt <= endOfDay(it.dueDate) : null;
    return {
      key: `${project.key}-${it.number}`,
      number: it.number,
      title: it.title,
      type: it.type.name,
      status: it.status.name,
      statusCategory: it.status.category,
      done,
      dueDate: it.dueDate,
      resolvedAt: it.resolvedAt,
      onTime,
      overdue: !done && it.dueDate ? endOfDay(it.dueDate) < new Date() : false,
      attachmentCount: count,
      submitted: count > 0,
      attachments: it.attachments.map((a) => ({ id: a.id, fileName: a.fileName, mime: a.mime, size: a.size })),
    };
  };

  // Gom theo người nhận.
  const byUser = new Map<number, { assignee: ReturnType<typeof present>; items: ReturnType<typeof toItem>[] }>();
  function present(u: Row['assignee']) {
    return { username: u?.username ?? null, name: u ? displayName(u) : 'Unassigned', kind: u?.kind ?? null };
  }
  for (const it of issues) {
    const uid = it.assignee?.id ?? 0;
    if (!byUser.has(uid)) byUser.set(uid, { assignee: present(it.assignee), items: [] });
    byUser.get(uid)!.items.push(toItem(it));
  }

  const members = [...byUser.values()].map((m) => {
    const total = m.items.length;
    const submitted = m.items.filter((i) => i.submitted).length;
    const doneCount = m.items.filter((i) => i.done).length;
    const withDue = m.items.filter((i) => i.onTime !== null);
    const onTime = withDue.filter((i) => i.onTime).length;
    const overdue = m.items.filter((i) => i.overdue).length;
    return {
      ...m.assignee,
      total,
      submitted,
      doneCount,
      onTime,
      onTimeOf: withDue.length,
      overdue,
      files: m.items.reduce((s, i) => s + i.attachmentCount, 0),
      items: m.items,
    };
  });

  const totals = {
    members: members.length,
    issues: issues.length,
    submitted: members.reduce((s, m) => s + m.submitted, 0),
    files: members.reduce((s, m) => s + m.files, 0),
    overdue: members.reduce((s, m) => s + m.overdue, 0),
  };

  return { project: { key: project.key, name: project.name }, gate: cfg, canConfig: access.role === 'ADMIN', totals, members };
}

/** Zip tất cả deliverable: AssigneeName/ISSUE-KEY/file. Trả Buffer + tên tệp. */
export async function zipSubmissions(userId: number, projectId: number): Promise<{ buffer: Buffer; fileName: string }> {
  const access = await loadProjectAccess(userId, projectId);
  if (!access) throw new ForbiddenError('You are not a member of this project');
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, settings: true } });
  const cfg = submitGateOf(project.settings);

  const issues = await prisma.workIssue.findMany({
    where: SCOPE_WHERE(projectId, cfg),
    orderBy: [{ assigneeId: 'asc' }, { number: 'asc' }],
    select: {
      number: true,
      assignee: { select: PUBLIC_USER },
      attachments: { where: { forComment: false }, orderBy: { createdAt: 'asc' }, select: { id: true, fileName: true, r2Key: true } },
    },
  });

  const zip = new JSZip();
  const safe = (s: string) => s.replace(/[\\/:*?"<>|]+/g, '_').slice(0, 80).trim() || 'unnamed';
  const used = new Set<string>();
  let added = 0;
  for (const it of issues) {
    const folder = `${safe(it.assignee ? displayName(it.assignee) : 'Unassigned')}/${project.key}-${it.number}`;
    for (const a of it.attachments) {
      try {
        const res = await getR2Client().send(new GetObjectCommand({ Bucket: config.r2.bucketName, Key: a.r2Key }));
        const bytes = await res.Body?.transformToByteArray();
        if (!bytes) continue;
        let path = `${folder}/${safe(a.fileName)}`;
        if (used.has(path)) path = `${folder}/${a.id}-${safe(a.fileName)}`;
        used.add(path);
        zip.file(path, Buffer.from(bytes));
        added += 1;
      } catch (e) {
        logger.warn('submit-gate zip: bỏ qua tệp không tải được', { err: e, attachmentId: a.id, projectId });
      }
    }
  }
  if (!added) throw new BadRequestError('No deliverables attached yet — nothing to download.', 'WORK_SUBMIT_EMPTY');
  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  return { buffer, fileName: `${project.key}-submissions.zip` };
}
