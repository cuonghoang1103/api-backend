/**
 * PHỤ ĐỀ VIDEO BÀI GIẢNG — nguồn cho màn "học tiếng Anh bằng video".
 *
 * Video là link YouTube của người khác; ta chỉ NHÚNG bằng trình phát chính
 * thức, không tải về và không bóc luồng. Đó vừa là điều kiện của YouTube,
 * vừa là điều kiện để qua App Review.
 */
import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../middleware/errorHandler.js';

export type CauPhuDe = { t: number; en: string };

/**
 * Danh mục = khoá học CÓ video kèm phụ đề. Chỉ trả khoá thực sự có, không
 * liệt kê khoá rỗng: một danh mục mở ra không có gì là thứ người dùng chỉ
 * bấm nhầm đúng một lần rồi thôi tin cả màn hình.
 */
export async function danhMuc() {
  const ds = await prisma.$queryRaw<
    { courseId: number; title: string; slug: string | null; thumbnail: string | null; soVideo: bigint }[]
  >`
    SELECT c.id AS "courseId", c.title, c.slug, c.thumbnail,
           COUNT(DISTINCT t.lesson_id) AS "soVideo"
    FROM lesson_transcripts t
    JOIN lessons         l ON l.id = t.lesson_id
    JOIN course_sections s ON s.id = l.section_id
    JOIN courses         c ON c.id = s.course_id
    GROUP BY c.id, c.title, c.slug, c.thumbnail
    ORDER BY COUNT(DISTINCT t.lesson_id) DESC
  `;
  // ⚠️ `COUNT` của Postgres về dạng BigInt, mà `JSON.stringify` NÉM trên
  // BigInt. Quên đổi là cả endpoint trả 500 với log chỉ nói "Do not know
  // how to serialize a BigInt" — không nhắc gì tới COUNT.
  return ds.map((d: (typeof ds)[number]) => ({ ...d, soVideo: Number(d.soVideo) }));
}

/** Danh sách video trong một khoá. */
export async function videoCuaKhoa(courseId: number) {
  const ds = await prisma.lessonTranscript.findMany({
    where: { lesson: { section: { courseId } } },
    select: {
      lessonId: true, videoId: true, soCau: true, soTu: true,
      lesson: { select: { title: true, videoDurationSeconds: true } },
    },
    orderBy: { lessonId: 'asc' },
  });
  return ds.map((d: (typeof ds)[number]) => ({
    lessonId: d.lessonId,
    videoId: d.videoId,
    tieuDe: d.lesson.title,
    giay: d.lesson.videoDurationSeconds || null,
    soCau: d.soCau,
    soTu: d.soTu,
  }));
}

/** Phụ đề đầy đủ của MỘT video. */
export async function phuDe(lessonId: number) {
  const d = await prisma.lessonTranscript.findUnique({
    where: { lessonId },
    select: {
      videoId: true, lang: true, cues: true, dichVi: true, soCau: true, soTu: true,
      lesson: { select: { title: true } },
    },
  });
  if (!d) throw new NotFoundError('Chưa có phụ đề cho bài này');
  return {
    lessonId,
    videoId: d.videoId,
    tieuDe: d.lesson.title,
    lang: d.lang,
    soCau: d.soCau,
    soTu: d.soTu,
    cues: d.cues as CauPhuDe[],
    dichVi: (d.dichVi as string[] | null) ?? null,
  };
}
