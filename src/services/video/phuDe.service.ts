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
import { NHOM_CHU_DE, NHOM_LON, NHOM_LON_CO_CON, nhomCuaKhoa, nhomLonCuaKhoa, tachTieuDe } from './nhomChuDe.js';

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

/**
 * THƯ VIỆN — tất cả những gì màn duyệt video cần, trong MỘT lời gọi.
 *
 * Màn duyệt vẽ các HÀNG NGANG có ảnh bìa (như Netflix/YouTube), nên nó cần
 * video của nhiều khoá cùng lúc. Nếu để app gọi `/khoa/:id` cho từng khoá
 * thì mở màn hình là 48 lời gọi — chậm, và mỗi lần đổi chip lọc lại gọi
 * thêm. Gửi một cục: đo thật ~170 KB thô, nén gzip còn ~40 KB, đổi lấy việc
 * lọc/tìm/“xem tất cả” đều xảy ra tức thì và chạy được cả khi mất mạng.
 *
 * KHÔNG kèm ảnh bìa trong payload: ảnh lấy thẳng từ CDN của YouTube theo
 * `videoId` (`i.ytimg.com/vi/<id>/hqdefault.jpg`) — đo 24 ảnh ngẫu nhiên
 * 19/09/2026 đều là ảnh thật, không có ảnh xám placeholder nào.
 */
export async function thuVien(userId: number) {
  const ds = await prisma.lessonTranscript.findMany({
    select: {
      lessonId: true, videoId: true, soCau: true, soTu: true,
      lesson: {
        select: {
          title: true, videoDurationSeconds: true,
          section: {
            select: {
              course: {
                select: { id: true, title: true, slug: true, courseCode: true },
              },
            },
          },
        },
      },
    },
    orderBy: { lessonId: 'asc' },
  });

  type Video = {
    lessonId: number; videoId: string; tieuDe: string; tieuDeVi: string | null;
    giay: number | null; soCau: number; soTu: number;
  };
  type Khoa = {
    courseId: number; title: string; slug: string | null;
    nhomLon: string; nhom: string | null;
    soVideo: number; video: Video[];
  };

  const gom = new Map<number, Khoa>();
  for (const d of ds) {
    const c = d.lesson?.section?.course;
    if (!c) continue;
    let k = gom.get(c.id);
    if (!k) {
      k = {
        courseId: c.id,
        title: c.title,
        slug: c.slug,
        nhomLon: nhomLonCuaKhoa(c.courseCode, c.title),
        nhom: nhomCuaKhoa(c.courseCode, c.title),
        soVideo: 0,
        video: [],
      };
      gom.set(c.id, k);
    }
    const t = tachTieuDe(d.lesson.title);
    k.video.push({
      lessonId: d.lessonId,
      videoId: d.videoId,
      tieuDe: t.en,
      tieuDeVi: t.vi,
      giay: d.lesson.videoDurationSeconds || null,
      soCau: d.soCau,
      soTu: d.soTu,
    });
    k.soVideo += 1;
  }

  const khoa = [...gom.values()].sort((a, b) => b.soVideo - a.soVideo);

  // Chỉ trả nhóm THẬT SỰ có video — một chip lọc mở ra trống rỗng là thứ
  // người dùng bấm nhầm đúng một lần rồi thôi tin cả hàng chip.
  const nhom = NHOM_CHU_DE.map((n) => {
    // Chỉ đếm trong nhóm lớn CÓ danh mục con. Đếm cả EXE (đã chuyển sang
    // "Kinh doanh") thì chip con hiện 34 video mà bấm vào không ra hàng nào.
    const cua = khoa.filter((k) => k.nhomLon === NHOM_LON_CO_CON && k.nhom === n.ma);
    return {
      ...n,
      soKhoa: cua.length,
      soVideo: cua.reduce((t, k) => t + k.soVideo, 0),
    };
  }).filter((n) => n.soVideo > 0);

  // ── Video người dùng tự thêm ──
  // Trả ĐÚNG hình dạng của một video bài giảng để app không phải có hai
  // nhánh vẽ. Khác biệt duy nhất: `lessonId` ÂM (= -id trong bảng riêng) và
  // có `nguon`, nhờ đó app biết gọi endpoint phụ đề nào.
  const tuThem = await prisma.videoNguoiDung.findMany({
    where: { userId },
    select: { id: true, nguon: true, nhomLon: true, videoId: true, tieuDe: true,
              anhBia: true, giay: true, soCau: true, soTu: true, tacGia: true },
    orderBy: { createdAt: 'desc' },
  });
  const cuaToi = tuThem.map((v: (typeof tuThem)[number]) => ({
    lessonId: -v.id,
    videoId: v.videoId,
    nguon: v.nguon,
    nhomLon: v.nhomLon,
    tieuDe: v.tieuDe,
    tieuDeVi: v.tacGia,
    anhBiaUrl: v.anhBia,
    giay: v.giay,
    soCau: v.soCau,
    soTu: v.soTu,
  }));

  // Video tự thêm cũng thành các HÀNG như khoá học, gom theo nhóm lớn — để
  // màn duyệt chỉ có một cách vẽ, không phải hai nhánh.
  const theoNhomLon = new Map<string, typeof cuaToi>();
  for (const v of cuaToi) {
    const cu = theoNhomLon.get(v.nhomLon);
    if (cu) cu.push(v);
    else theoNhomLon.set(v.nhomLon, [v]);
  }
  for (const [ma, ds] of theoNhomLon) {
    const ten = NHOM_LON.find((n) => n.ma === ma)?.ten ?? 'Khác';
    khoa.push({
      courseId: -1000 - NHOM_LON.findIndex((n) => n.ma === ma),
      title: ten,
      slug: null,
      nhomLon: ma,
      nhom: null,
      soVideo: ds.length,
      video: ds,
    });
  }

  // Chỉ trả nhóm lớn THẬT SỰ có video.
  const nhomLon = NHOM_LON.map((n) => {
    const cua = khoa.filter((k) => k.nhomLon === n.ma);
    return { ...n, soKhoa: cua.length,
             soVideo: cua.reduce((t, k) => t + k.soVideo, 0) };
  }).filter((n) => n.soVideo > 0);

  // Mã video đã thích — app tự tô tim và tự dựng hàng "Yêu thích" từ danh
  // sách này, không cần thêm một lời gọi nữa.
  const yt = await prisma.videoYeuThich.findMany({
    where: { userId },
    select: { lessonId: true, videoTuThemId: true },
    orderBy: { createdAt: 'desc' },
  });
  const yeuThich = yt.map((d: (typeof yt)[number]) =>
    d.lessonId ?? -(d.videoTuThemId as number));

  return { nhomLon, nhom, khoa, cuaToi, yeuThich };
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
  return ds.map((d: (typeof ds)[number]) => {
    const t = tachTieuDe(d.lesson.title);
    return {
      lessonId: d.lessonId,
      videoId: d.videoId,
      tieuDe: t.en,
      tieuDeVi: t.vi,
      giay: d.lesson.videoDurationSeconds || null,
      soCau: d.soCau,
      soTu: d.soTu,
    };
  });
}

/**
 * CÓ phụ đề hay không — chỉ đếm, KHÔNG kéo về cả mảng `cues`.
 *
 * Trang học gọi cái này mỗi lần đổi bài để quyết có mời vào "phòng học video
 * cùng AI" hay không. Đo 20/09/2026: 963 bài có phụ đề trên ~11.800 bài đã
 * xuất bản — mời ở bài không có phụ đề là mời vào một phòng mà gia sư không
 * đọc được gì, tức tệ hơn không mời.
 *
 * ⚠️ ĐỪNG dùng `phuDe()` cho việc này: bài dài có hàng nghìn `cues`, mỗi lần
 * đổi bài là kéo về vài trăm KB chỉ để hỏi một câu đúng/sai.
 */
export async function coPhuDe(lessonId: number) {
  const d = await prisma.lessonTranscript.findUnique({
    where: { lessonId },
    select: { videoId: true, soCau: true, dichVi: true },
  });
  return {
    co: !!d,
    videoId: d?.videoId ?? null,
    soCau: d?.soCau ?? 0,
    /* Có bản dịch tiếng Việt chưa — phòng học hiện được cột song ngữ hay
       không phụ thuộc chỗ này, và người học nên biết TRƯỚC khi bước vào. */
    coDich: Array.isArray(d?.dichVi) && (d!.dichVi as string[]).length > 0,
  };
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
  const tach = tachTieuDe(d.lesson.title);
  return {
    lessonId,
    videoId: d.videoId,
    tieuDe: tach.en,
    tieuDeVi: tach.vi,
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
