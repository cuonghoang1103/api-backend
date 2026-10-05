/**
 * CT Work — NGÔN NGỮ của dự án cho chữ máy chủ tự sinh (CTW-8 + CTW-14, 06/10/2026).
 *
 * Dự án tiếng Việt mà AI "polish" báo cáo khách ra tiếng Anh, tiêu đề phê duyệt là "Gate: 0. …"
 * ⇒ khách thấy trộn hai thứ tiếng. Thứ tự quyết định:
 *   1. `settings.language` ('vi' | 'en') — đặt trong Project settings;
 *   2. đoán từ dữ liệu: ≥ 30% tiêu đề thẻ gần đây có chữ tiếng Việt có dấu ⇒ 'vi';
 *   3. mặc định 'en' (giao diện CT Work là tiếng Anh).
 */

import { prisma } from '../../config/database.js';

export type ProjectLanguage = 'vi' | 'en';

/** Chữ cái có dấu đặc trưng tiếng Việt (không tính é/à… vốn cũng có ở tiếng Pháp — cần ít nhất một chữ riêng của tiếng Việt). */
const VI_RE = /[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i;

export const looksVietnamese = (s: string) => VI_RE.test(s);

export function languageSetting(settings: unknown): ProjectLanguage | null {
  const v = (settings as { language?: unknown } | null)?.language;
  return v === 'vi' || v === 'en' ? v : null;
}

export async function projectLanguage(projectId: number): Promise<ProjectLanguage> {
  const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { settings: true, name: true, description: true } });
  const set = languageSetting(p?.settings);
  if (set) return set;
  const rows = await prisma.workIssue.findMany({ where: { projectId, deletedAt: null }, orderBy: { id: 'desc' }, take: 40, select: { title: true } });
  const texts = [p?.name ?? '', p?.description ?? '', ...rows.map((r) => r.title)].filter(Boolean);
  if (!texts.length) return 'en';
  const vi = texts.filter(looksVietnamese).length;
  return vi / texts.length >= 0.3 ? 'vi' : 'en';
}
