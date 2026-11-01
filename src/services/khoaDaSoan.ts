/**
 * Khoá "ĐANG SOẠN" + "khoá gồm những gì" (01/11/2026, trang /courses làm lại).
 *
 * Nhiều khoá trong chương trình 15 kỳ mới có KHUNG: đủ chương, đủ tên bài, nhưng mỗi bài chỉ là một đoạn giới thiệu
 * ngắn (đo 01/11 trên prod: 46/75 khoá, bài dài nhất ≤ ~2.100 ký tự, không video, không quiz). Người học cần biết
 * khoá nào đã soạn trọn trước khi bấm vào — không thì mở `kubernetes` thấy 48 bài mà bài nào cũng trống.
 *
 * Luật "bài đã soạn": nội dung ≥ NGUONG_BYTE byte (bài thật ngắn nhất ~1.700 ký tự là bài Mục 0; bài thật thường
 * 10–90 nghìn) HOẶC có video. Khoá "đang soạn" khi bài đã soạn < 20% số bài — một hai bài mẫu không đủ gọi là xong.
 *
 * ⚠️ Dùng `octet_length`, không `length`: với cột TOAST, `octet_length` đọc kích thước sẵn có, không phải giải nén
 * cả nội dung bài (≈100 MB cho cả chương trình) mỗi lần /courses/chuong-trinh chạy.
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { practiceTrackSlugFor } from './codeLab.practice.js';

export const NGUONG_BYTE = 4000;
export const TI_LE_DA_SOAN = 0.2;

export interface SoLieuSoan {
  soBai: number;
  soBaiDaSoan: number;
}

export function laBaiDaSoan(bai: { content?: string | null; videoDurationSeconds?: number | null }): boolean {
  return Buffer.byteLength(bai.content ?? '', 'utf8') >= NGUONG_BYTE || (bai.videoDurationSeconds ?? 0) > 0;
}

/** Khoá có bài mà bài đã soạn < 20% ⇒ đang soạn. Không có số liệu / không có bài ⇒ KHÔNG gắn nhãn (không đoán). */
export function laDangSoan(s: SoLieuSoan | undefined): boolean {
  if (!s || s.soBai <= 0) return false;
  return s.soBaiDaSoan < s.soBai * TI_LE_DA_SOAN;
}

/** Một truy vấn cho cả danh sách khoá: số bài xuất bản + số bài đã soạn, theo khoá. */
export async function demBaiDaSoan(courseIds: number[]): Promise<Map<number, SoLieuSoan>> {
  const kq = new Map<number, SoLieuSoan>();
  if (courseIds.length === 0) return kq;
  const rows = await prisma.$queryRaw<Array<{ courseId: number; soBai: number; soBaiDaSoan: number }>>`
    SELECT cs.course_id AS "courseId",
           COUNT(*)::int AS "soBai",
           COUNT(*) FILTER (
             WHERE COALESCE(octet_length(l.content), 0) >= ${NGUONG_BYTE} OR l.video_duration_seconds > 0
           )::int AS "soBaiDaSoan"
    FROM lessons l
    JOIN course_sections cs ON cs.id = l.section_id
    WHERE l.is_published = true AND cs.course_id IN (${Prisma.join(courseIds)})
    GROUP BY cs.course_id`;
  for (const r of rows) kq.set(Number(r.courseId), { soBai: Number(r.soBai), soBaiDaSoan: Number(r.soBaiDaSoan) });
  return kq;
}

/** Bài có slide trường (khối `<div class="anh-slide">`, xem frontend `components/academy/docSlide.ts`). */
const CO_SLIDE = /class="anh-slide"/;

export interface BaoGomKhoa {
  soChuong: number;
  soBai: number;
  soBaiDaSoan: number;
  dangSoan: boolean;
  soQuiz: number;
  soBaiVideo: number;
  giayVideo: number;
  soBaiSlide: number;
  /** Số bài luyện Code Lab đã xuất bản trong track của khoá (0 = không có). */
  soBaiCodeLab: number;
  /** Đề thi đã xuất bản gắn khoá: FE = trắc nghiệm cuối khoá, PE = thi thực hành. */
  soDeFE: number;
  soDePE: number;
}

/**
 * "Khoá học này gồm" cho trang giới thiệu khoá. `sections` = chương kèm bài ĐÃ XUẤT BẢN (đúng include của
 * `GET /courses/:slug`, có `content`) — đếm trên đó, chỉ thêm hai truy vấn nhỏ (đề thi, Code Lab).
 */
export async function tinhBaoGom(
  course: { id: number; slug: string },
  sections: Array<{ lessons: Array<{ lessonType: string; content: string | null; videoDurationSeconds: number }> }>,
): Promise<BaoGomKhoa> {
  const bai = sections.flatMap((s) => s.lessons);
  const soBaiDaSoan = bai.filter(laBaiDaSoan).length;
  const [deThi, track] = await Promise.all([
    prisma.exam.groupBy({ by: ['kind'], where: { courseId: course.id, isPublished: true }, _count: { _all: true } }),
    prisma.codeTrack.findUnique({
      where: { slug: practiceTrackSlugFor(course.slug) },
      select: { status: true, _count: { select: { exercises: { where: { status: 'PUBLISHED' } } } } },
    }),
  ]);
  const de = (k: string) => deThi.find((d) => d.kind === k)?._count._all ?? 0;
  return {
    soChuong: sections.length,
    soBai: bai.length,
    soBaiDaSoan,
    dangSoan: laDangSoan({ soBai: bai.length, soBaiDaSoan }),
    soQuiz: bai.filter((b) => b.lessonType === 'QUIZ').length,
    soBaiVideo: bai.filter((b) => b.videoDurationSeconds > 0).length,
    giayVideo: bai.reduce((t, b) => t + (b.videoDurationSeconds || 0), 0),
    soBaiSlide: bai.filter((b) => CO_SLIDE.test(b.content ?? '')).length,
    soBaiCodeLab: track && track.status === 'PUBLISHED' ? track._count.exercises : 0,
    soDeFE: de('FE'),
    soDePE: de('PE'),
  };
}
