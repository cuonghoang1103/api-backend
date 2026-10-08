/**
 * CT Work — CTW-15 (08/10/2026): nhận SỐ THẺ / KHOÁ THẺ ở mọi chỗ trước đây chỉ nhận id NỘI BỘ.
 *
 * Trước: tạo story với `parentId: 1` (ý là FP-1) ⇒ 400 "Parent issue not found" — phải GET epic lấy id
 * nội bộ, trong khi chỗ khác (links `targetKey`, CR `issueNumber`) lại dùng số thẻ. Giờ mọi chỗ nhận cha
 * chấp nhận CẢ HAI, nhất quán:
 *   - `parentId`      — id nội bộ (giữ nguyên, tương thích ngược);
 *   - `parentNumber`  — số thẻ trong dự án (1 cho FP-1);
 *   - `parentKey`     — khoá thẻ "FP-1" (hoặc "#1", "1").
 * Loại thẻ: `typeId` (id) hoặc `typeKey` ("STORY"); gửi nhầm `typeId: "STORY"` cũng hiểu là typeKey.
 * Lỗi luôn nêu đúng trường + giá trị khách gửi, không "Expected number, received nan".
 */

import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';

/** "FP-12" / "fp-12" / "#12" / "12" / 12 ⇒ { key?: 'FP', number: 12 } — null khi không đọc được. */
export function parseIssueRef(v: unknown): { key?: string; number: number } | null {
  if (typeof v === 'number') return Number.isInteger(v) && v > 0 ? { number: v } : null;
  if (typeof v !== 'string') return null;
  const s = v.trim();
  const m = /^(?:([A-Za-z][A-Za-z0-9_]{0,19})-|#)?(\d{1,9})$/.exec(s);
  if (!m) return null;
  const number = Number(m[2]);
  if (!Number.isInteger(number) || number <= 0) return null;
  return m[1] ? { key: m[1].toUpperCase(), number } : { number };
}

export interface ParentRefInput {
  parentId?: number | null;
  parentNumber?: number | null;
  parentKey?: string | null;
}

/** Số thẻ (hoặc khoá) ⇒ id nội bộ trong dự án. Ném 400 nêu rõ trường khi không có. */
export async function issueIdFromRef(projectId: number, ref: unknown, field: string): Promise<number> {
  const parsed = parseIssueRef(ref);
  if (!parsed) throw new BadRequestError(`${field}: "${String(ref)}" is not an issue key — use e.g. "FP-12" or the number 12`, 'WORK_BAD_ISSUE_REF');
  const project = await prisma.workProject.findUnique({ where: { id: projectId }, select: { key: true } });
  if (parsed.key && project && parsed.key !== project.key.toUpperCase()) {
    throw new BadRequestError(`${field}: ${parsed.key}-${parsed.number} belongs to another project (this project is ${project.key})`, 'WORK_BAD_ISSUE_REF');
  }
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number: parsed.number, deletedAt: null }, select: { id: true } });
  if (!issue) throw new BadRequestError(`${field}: issue ${project?.key ?? ''}-${parsed.number} not found in this project`, 'WORK_BAD_ISSUE_REF');
  return issue.id;
}

/**
 * Gộp parentId / parentNumber / parentKey ⇒ parentId nội bộ.
 * - undefined: không ai gửi (không đổi);  null: gỡ cha (bất kỳ trường nào = null);
 * - gửi nhiều trường mà chỉ tới các thẻ KHÁC nhau ⇒ 400 (không đoán).
 */
export async function resolveParentId(projectId: number, input: ParentRefInput): Promise<number | null | undefined> {
  const picks: Array<{ field: string; id: number | null }> = [];
  if (input.parentId !== undefined) picks.push({ field: 'parentId', id: input.parentId });
  if (input.parentNumber !== undefined) {
    picks.push({ field: 'parentNumber', id: input.parentNumber === null ? null : await issueIdFromRef(projectId, input.parentNumber, 'parentNumber') });
  }
  if (input.parentKey !== undefined) {
    picks.push({ field: 'parentKey', id: input.parentKey === null || input.parentKey === '' ? null : await issueIdFromRef(projectId, input.parentKey, 'parentKey') });
  }
  if (!picks.length) return undefined;
  const ids = new Set(picks.map((p) => p.id));
  if (ids.size > 1) {
    throw new BadRequestError(`${picks.map((p) => p.field).join(' and ')} point to different issues — send only one of them`, 'WORK_BAD_ISSUE_REF');
  }
  return picks[0].id;
}

/** typeKey ("STORY", không phân biệt hoa thường) ⇒ id loại thẻ của dự án. */
export async function typeIdFromKey(projectId: number, typeKey: string, field = 'typeKey'): Promise<number> {
  const key = typeKey.trim().toUpperCase();
  const types = await prisma.workIssueType.findMany({ where: { projectId, archived: false }, select: { id: true, key: true } });
  const t = types.find((x) => x.key.toUpperCase() === key);
  if (!t) {
    throw new BadRequestError(`${field}: unknown issue type "${typeKey}" — this project has ${types.map((x) => x.key).join(', ')}`, 'WORK_BAD_TYPE');
  }
  return t.id;
}

/**
 * Chuẩn hoá thân tạo/sửa thẻ TRƯỚC zod: `typeId: "STORY"` (chữ, không phải số) ⇒ typeKey;
 * `parentId: "FP-1"` ⇒ parentKey. Giá trị số giữ nguyên. Trả bản sao, không đụng req.body gốc.
 */
export function normalizeIssueRefBody(body: unknown): unknown {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return body;
  const b = { ...(body as Record<string, unknown>) };
  const isText = (v: unknown) => typeof v === 'string' && v.trim() !== '' && !/^\d+$/.test(v.trim());
  if (isText(b.typeId) && b.typeKey === undefined) { b.typeKey = b.typeId; delete b.typeId; }
  if (isText(b.parentId) && b.parentKey === undefined) { b.parentKey = b.parentId; delete b.parentId; }
  return b;
}
