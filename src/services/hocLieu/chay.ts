/**
 * Bộ chạy action HỌC LIỆU + TIẾN ĐỘ (24/11/2026) — dùng chung cho lệnh MCP `hoc_tap` (các action đọc học liệu) và REST
 * `/api/v1/hoc-lieu`. CHỈ ĐỌC; quyền = người gọi (xem hocLieu.service.ts, tienDo.service.ts).
 */
import { BadRequestError } from '../../middleware/errorHandler.js';
import * as hl from './hocLieu.service.js';
import { tinhTienDo } from './tienDo.service.js';

const bad = (m: string) => new BadRequestError(m, 'VALIDATION_ERROR');
export const HOC_LIEU_ACTIONS = ['search', 'outline', 'lesson', 'exercises', 'exam', 'links', 'progress'] as const;

/** Chạy một action — dùng chung cho MCP và REST (`/api/v1/hoc-lieu`). */
export async function chayHocLieu(userId: number, a: Record<string, any>): Promise<unknown> {
  const so = (v: unknown) => (v === undefined || v === null || v === '' ? undefined : Number(v));
  switch (a.action) {
    case 'search': if (!a.q) throw bad('search needs q'); return hl.timKiem(userId, String(a.q));
    case 'outline':
      if (a.book) return hl.mucLucSach(String(a.book), so(a.bai));
      if (a.course) return hl.mucLucKhoa(userId, String(a.course));
      throw bad('outline needs course (slug) or book (dekiru|jp|ch|ielts|ielts-tap2..5|en-giao-tiep)');
    case 'lesson':
      if (a.book) { if (so(a.bai) === undefined) throw bad('lesson with book needs bai'); return hl.noiDungMucSach(String(a.book), so(a.bai)!, a.item ? String(a.item) : undefined, { offset: so(a.offset), maxChars: so(a.maxChars), dapAn: a.answers !== false }); }
      if (a.course && a.lesson !== undefined) return hl.noiDungBaiKhoa(userId, String(a.course), a.lesson, { offset: so(a.offset), maxChars: so(a.maxChars), english: a.english === true });
      throw bad('lesson needs (course + lesson) or (book + bai [+ item])');
    case 'exercises': return hl.baiTapCode(userId, { course: a.course, lesson: a.lesson !== undefined ? String(a.lesson) : undefined, exercise: a.exercise });
    case 'exam': return hl.deThi(userId, { course: a.course, subject: a.subject, attempt: so(a.attempt) });
    case 'links': if (!a.course || a.lesson === undefined) throw bad('links needs course + lesson'); return hl.lienKet(userId, String(a.course), String(a.lesson));
    case 'progress': { const r = await tinhTienDo(userId); return a.format === 'json' ? r : { baoCao: r.baoCao, deXuat: r.deXuat }; }
    default: throw bad(`action must be one of ${HOC_LIEU_ACTIONS.join(', ')}`);
  }
}
