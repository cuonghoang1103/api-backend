/**
 * CT Work ↔ Ghi chú (Notes) — CẦU NỐI HAI CHIỀU, chỉ THAM CHIẾU.
 *
 * Mô-đun Notes là ghi chú RIÊNG TƯ của mỗi người (Note.userId). CT Work là thẻ
 * việc trong dự án. Đây là chỗ DUY NHẤT nối hai thứ đó, không bao giờ sao chép
 * nội dung bên này sang bên kia:
 *
 *   Chiều A (ghi chú → thẻ): chip "@CT Work issue" nhúng trong trang ghi chú.
 *     - `searchIssuesForNote` cấp danh sách thẻ cho bộ chọn (DÙNG LẠI globalSearch,
 *       nên chỉ ra thẻ người gọi thật sự thấy — không tự viết lại luật quyền).
 *     - `resolveIssueChip` trả dữ liệu SỐNG của một chip (trạng thái + màu + URL);
 *       mất quyền ⇒ null (chip tự xám đi, không lộ gì).
 *     - Khi LƯU ghi chú, `syncNoteIssueLinks` đồng bộ bảng liên kết theo đúng các
 *       chip còn trong nội dung ⇒ chiều B luôn khớp chiều A.
 *
 *   Chiều B (thẻ → ghi chú): mục "Ghi chú liên kết" trên chi tiết thẻ.
 *     - `listIssueNotes` / `linkIssueNote` / `unlinkIssueNote`. Vì ghi chú riêng tư,
 *       mỗi người CHỈ thấy liên kết tới ghi chú CỦA MÌNH (lọc theo note.userId).
 *
 * Mọi hàm nhận `userId` người gọi và kiểm quyền hai đầu: thấy được THẺ (qua
 * loadProjectAccess/requireProject của CT Work) VÀ sở hữu GHI CHÚ (note.userId).
 */

import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { isClientScoped, loadProjectAccess, requireProject } from './permissions.js';
import { globalSearch } from './globalSearch.service.js';
import { visibleProjectIds } from './myWork.service.js';

/** Trần số thẻ một ghi chú được tham chiếu (giống trần 200 trang/thẻ ở docs). */
export const MAX_LINKS_PER_NOTE = 200;

export interface IssuePickerItem {
  id: number;
  key: string;
  number: number;
  title: string;
  status: { name: string; category: string; color: string };
  statusColor: string;
  typeKey: string;
  project: { key: string; name: string };
  workspace: { slug: string; name: string };
  url: string;
}

/**
 * Chiều A — bộ chọn thẻ cho chip trong ghi chú. DÙNG LẠI globalSearch: cùng một
 * luật quyền với trang /work/search (chỉ dự án người gọi có vai trò, loại dự án
 * lưu trữ + dự án khách bị cách ly). Trả về hình gọn đủ dựng chip.
 */
export async function searchIssuesForNote(userId: number, q: string, limit = 20): Promise<IssuePickerItem[]> {
  const res = await globalSearch(userId, { q: (q ?? '').trim().slice(0, 200), limit: Math.min(Math.max(limit, 1), 50) });
  return res.items.map((i) => ({
    id: i.id,
    key: i.key,
    number: i.number,
    title: i.title,
    status: { name: i.status.name, category: i.status.category, color: i.status.color },
    statusColor: i.status.color,
    typeKey: i.type.key,
    project: { key: i.project.key, name: i.project.name },
    workspace: { slug: i.workspace.slug, name: i.workspace.name },
    url: i.url,
  }));
}

export interface IssueChip {
  id: number;
  key: string;
  number: number;
  title: string;
  status: { name: string; category: string; color: string };
  statusColor: string;
  typeKey: string;
  url: string;
}

/**
 * Chiều A — dữ liệu SỐNG của một chip theo id thẻ. Kiểm quyền bằng CHÍNH luật của
 * CT Work (loadProjectAccess + lọc khách bị cách ly). Mất quyền / thẻ đã xoá ⇒ null
 * (route trả 404) để chip tự xám đi, không bao giờ lộ tiêu đề thẻ người gọi không thấy.
 */
export async function resolveIssueChip(userId: number, issueId: number): Promise<IssueChip | null> {
  if (!Number.isInteger(issueId) || issueId <= 0) return null;
  const issue = await prisma.workIssue.findFirst({
    where: { id: issueId, deletedAt: null },
    select: {
      id: true, number: true, title: true, clientVisible: true, projectId: true,
      status: { select: { name: true, category: true, color: true } },
      type: { select: { key: true } },
      project: { select: { key: true, workspace: { select: { slug: true } } } },
    },
  });
  if (!issue) return null;
  const access = await loadProjectAccess(userId, issue.projectId);
  if (!access) return null;
  // Khách bị cách ly: thẻ chưa chia sẻ ⇒ coi như không thấy.
  if (isClientScoped(access) && !issue.clientVisible) return null;
  return {
    id: issue.id,
    key: `${issue.project.key}-${issue.number}`,
    number: issue.number,
    title: issue.title,
    status: { name: issue.status.name, category: issue.status.category, color: issue.status.color },
    statusColor: issue.status.color,
    typeKey: issue.type.key,
    url: `/work/${issue.project.workspace.slug}/${issue.project.key}/issue/${issue.number}`,
  };
}

// ─── Chiều B: "Ghi chú liên kết" trên chi tiết thẻ ───────────────────

/** Thẻ (theo số) trong dự án, tôn trọng khách bị cách ly. Dùng sau requireProject. */
async function visibleIssueByNumber(access: { projectId: number; role: string | null; modules?: unknown }, issueNumber: number) {
  const i = await prisma.workIssue.findFirst({
    where: { projectId: access.projectId, number: issueNumber, deletedAt: null },
    select: { id: true, clientVisible: true },
  });
  if (!i) throw new NotFoundError('Issue not found');
  if (isClientScoped(access as Parameters<typeof isClientScoped>[0]) && !i.clientVisible) throw new NotFoundError('Issue not found');
  return i;
}

function noteUrl(noteId: number): string {
  return `/notes?note=${noteId}`;
}

export interface LinkedNote {
  linkId: number;
  id: number;
  title: string;
  subject: { id: number; name: string; color: string | null } | null;
  updatedAt: Date;
  url: string;
}

/**
 * Chiều B — ghi chú (CỦA NGƯỜI GỌI) tham chiếu tới một thẻ. Ghi chú riêng tư nên
 * chỉ trả về ghi chú note.userId = người gọi; người khác dù mở cùng thẻ cũng không
 * thấy ghi chú của ta.
 */
export async function listIssueNotes(userId: number, projectId: number, issueNumber: number): Promise<{ notes: LinkedNote[] }> {
  const access = await requireProject(userId, projectId, 'project.view');
  const issue = await visibleIssueByNumber(access, issueNumber);
  const rows = await prisma.noteWorkIssueLink.findMany({
    where: { workIssueId: issue.id, note: { userId, deletedAt: null } },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      note: { select: { id: true, title: true, updatedAt: true, subject: { select: { id: true, name: true, color: true } } } },
    },
  });
  return {
    notes: rows.map((r) => ({
      linkId: r.id,
      id: r.note.id,
      title: r.note.title,
      subject: r.note.subject ? { id: r.note.subject.id, name: r.note.subject.name, color: r.note.subject.color } : null,
      updatedAt: r.note.updatedAt,
      url: noteUrl(r.note.id),
    })),
  };
}

/** Ghi chú này có thật và thuộc người gọi không (kiểm quyền đầu GHI CHÚ). */
async function ownNote(userId: number, noteId: number) {
  const n = await prisma.note.findFirst({ where: { id: noteId, userId, deletedAt: null }, select: { id: true } });
  if (!n) throw new NotFoundError('Note not found or not yours');
  return n;
}

/**
 * Chiều B — nối một ghi chú của mình với một thẻ. Kiểm CẢ HAI đầu: thấy được thẻ
 * (requireProject) VÀ sở hữu ghi chú (ownNote). Idempotent (upsert theo khoá duy nhất).
 */
export async function linkIssueNote(userId: number, projectId: number, issueNumber: number, noteId: number): Promise<{ notes: LinkedNote[] }> {
  const access = await requireProject(userId, projectId, 'project.view');
  const issue = await visibleIssueByNumber(access, issueNumber);
  await ownNote(userId, noteId);
  const count = await prisma.noteWorkIssueLink.count({ where: { noteId } });
  const exists = await prisma.noteWorkIssueLink.findUnique({ where: { uk_note_work_issue: { noteId, workIssueId: issue.id } }, select: { id: true } });
  if (!exists && count >= MAX_LINKS_PER_NOTE) throw new BadRequestError(`A note can link at most ${MAX_LINKS_PER_NOTE} issues`, 'WORK_LIMIT');
  await prisma.noteWorkIssueLink.upsert({
    where: { uk_note_work_issue: { noteId, workIssueId: issue.id } },
    create: { noteId, workIssueId: issue.id, createdById: userId },
    update: {},
  });
  return listIssueNotes(userId, projectId, issueNumber);
}

/** Chiều B — gỡ liên kết. Chỉ gỡ liên kết tới ghi chú của chính người gọi. */
export async function unlinkIssueNote(userId: number, projectId: number, issueNumber: number, noteId: number): Promise<{ notes: LinkedNote[] }> {
  const access = await requireProject(userId, projectId, 'project.view');
  const issue = await visibleIssueByNumber(access, issueNumber);
  await prisma.noteWorkIssueLink.deleteMany({ where: { workIssueId: issue.id, noteId, note: { userId } } });
  return listIssueNotes(userId, projectId, issueNumber);
}

// ─── Đồng bộ chiều A ⇒ chiều B khi lưu ghi chú ───────────────────────

/** Mọi id thẻ CT Work nhúng trong một tài liệu TipTap (node `ctworkIssue`, attr `issueId`). */
export function issueIdsInDoc(doc: unknown): number[] {
  const out = new Set<number>();
  const walk = (n: unknown): void => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) { n.forEach(walk); return; }
    const node = n as { type?: unknown; attrs?: unknown; content?: unknown };
    if (node.type === 'ctworkIssue' && node.attrs && typeof node.attrs === 'object') {
      const raw = (node.attrs as { issueId?: unknown }).issueId;
      const id = typeof raw === 'number' ? raw : Number(raw);
      if (Number.isInteger(id) && id > 0) out.add(id);
    }
    if (node.content) walk(node.content);
  };
  walk(doc);
  return [...out];
}

/**
 * Đồng bộ bảng liên kết của MỘT ghi chú theo các chip còn trong nội dung vừa lưu.
 * Gọi từ notes.service.updateNote (best-effort — không được làm hỏng lượt lưu).
 *
 * An toàn: chỉ tạo liên kết tới thẻ (1) có thật, chưa xoá, VÀ (2) nằm trong dự án
 * người gọi còn quyền xem (visibleProjectIds) — nên không ai nhét id thẻ lạ vào
 * JSON để tạo liên kết rác tới thẻ mình không thấy. Chip trỏ tới thẻ đã mất quyền
 * vẫn ở lại trong văn bản nhưng không sinh liên kết; resolveIssueChip trả null.
 */
export async function syncNoteIssueLinks(userId: number, noteId: number, doc: unknown): Promise<void> {
  const wanted = issueIdsInDoc(doc);
  const existing = await prisma.noteWorkIssueLink.findMany({ where: { noteId }, select: { workIssueId: true } });
  const have = new Set(existing.map((r) => r.workIssueId));

  // Thẻ hợp lệ để TẠO liên kết mới: có thật + người gọi còn thấy dự án.
  let allowed = new Set<number>();
  const toAdd = wanted.filter((id) => !have.has(id));
  if (toAdd.length) {
    const visible = new Set(await visibleProjectIds(userId));
    const rows = await prisma.workIssue.findMany({
      where: { id: { in: toAdd.slice(0, MAX_LINKS_PER_NOTE) }, deletedAt: null, projectId: { in: [...visible] } },
      select: { id: true },
    });
    allowed = new Set(rows.map((r) => r.id));
  }

  const wantedSet = new Set(wanted);
  const toRemove = [...have].filter((id) => !wantedSet.has(id));
  const toCreate = toAdd.filter((id) => allowed.has(id));

  if (toRemove.length) {
    await prisma.noteWorkIssueLink.deleteMany({ where: { noteId, workIssueId: { in: toRemove } } });
  }
  if (toCreate.length) {
    await prisma.noteWorkIssueLink.createMany({
      data: toCreate.map((workIssueId) => ({ noteId, workIssueId, createdById: userId })),
      skipDuplicates: true,
    });
  }
}
