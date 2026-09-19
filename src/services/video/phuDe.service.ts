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
  // ⚠️ KHÔNG dùng SQL thô ở đây nữa.
  //
  // Bản đầu viết `SELECT ... c.thumbnail ...` — nhưng cột thật tên
  // `thumbnail_url`. `tsc` không soi được tên cột nằm trong chuỗi, nên nó
  // qua sạch mọi phép kiểm, qua cả smoke-test của deploy (route trả 500 vẫn
  // là "không phải 404"), và chỉ lộ ra khi người dùng bấm vào và thấy
  // "Không tải được". Truy vấn có kiểu thì đổi tên cột là `tsc` gãy ngay.
  //
  // Gom nhóm ở JS: 1.030 hàng nhỏ, rẻ hơn hẳn cái giá của một câu SQL mà
  // không công cụ nào kiểm hộ.
  const ds = await prisma.lessonTranscript.findMany({
    select: {
      lessonId: true,
      lesson: {
        select: {
          section: {
            select: {
              course: { select: { id: true, title: true, slug: true, thumbnailUrl: true } },
            },
          },
        },
      },
    },
  });

  const gom = new Map<number, { courseId: number; title: string; slug: string | null;
                                thumbnail: string | null; soVideo: number }>();
  for (const d of ds) {
    const c = d.lesson?.section?.course;
    if (!c) continue;
    const cu = gom.get(c.id);
    if (cu) cu.soVideo += 1;
    else gom.set(c.id, { courseId: c.id, title: c.title, slug: c.slug,
                         thumbnail: c.thumbnailUrl, soVideo: 1 });
  }
  return [...gom.values()].sort((a, b) => b.soVideo - a.soVideo);
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
