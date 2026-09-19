/**
 * PHỤ ĐỀ VIDEO BÀI GIẢNG — nguồn cho màn "học tiếng Anh bằng video".
 *
 * Video là link YouTube của người khác; ta chỉ NHÚNG bằng trình phát chính
 * thức, không tải về và không bóc luồng. Đó vừa là điều kiện của YouTube,
 * vừa là điều kiện để qua App Review.
 */
import { prisma } from '../../config/database.js';
import { NotFoundError, BadRequestError } from '../../middleware/errorHandler.js';
import { transcribeWithGroq } from '../interview/voice/stt.js';

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

// ════════════════════════════════════════════════════════════════
// NHẠI THEO (shadowing)
// ════════════════════════════════════════════════════════════════

/**
 * Chỉ PHIÊN ÂM, không chấm bằng LLM.
 *
 * ⚠️ Nhại theo là việc làm hàng chục lần mỗi buổi — mỗi câu một lời gọi
 * LLM thì một buổi học tốn hơn cả ngày dùng chat. Việc cần ở đây không
 * phải "chấm bốn tiêu chí IELTS" mà là một câu hỏi đơn giản: người học có
 * nói ra đúng những từ đó không. Câu hỏi ấy chỉ cần bản phiên âm, và so
 * từ do máy khách làm — vừa rẻ, vừa hiện ngay không phải chờ.
 *
 * ⚠️ AUDIO KHÔNG BAO GIỜ ĐƯỢC LƯU: đi thẳng từ RAM sang Whisper rồi bỏ.
 * Cùng lý lẽ với `chamNoi.service` — giọng nói là dữ liệu sinh trắc học.
 */
export async function nhaiTheo(input: {
  audio: Buffer; filename: string; mimetype: string; cauDich: string;
}) {
  if (!input.audio?.length) throw new BadRequestError('Thiếu audio');

  const tr = await transcribeWithGroq(input.audio, input.filename, input.mimetype, {
    language: 'en',
    // Đưa câu đích làm gợi ý: Whisper bớt phiên âm nhầm tên riêng và thuật
    // ngữ. KHÔNG phải là mớm đáp án — nó vẫn chép đúng cái tai nghe được,
    // gợi ý chỉ thu hẹp không gian từ vựng.
    hints: input.cauDich.slice(0, 400),
    detail: true,
  });

  const chu = (tr.text ?? '').trim();
  const im = (tr as { noSpeechProb?: number }).noSpeechProb;
  const imLang = chu.length < 2 || (typeof im === 'number' && im > 0.6);

  return { chu, imLang };
}
