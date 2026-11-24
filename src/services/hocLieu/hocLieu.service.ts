/**
 * HỌC LIỆU CHO CUONGMINI (24/11/2026) — đọc THẲNG nội dung mọi thứ người dùng học, thay cho việc mở trình duyệt ngầm cào
 * trang (bị "Log in", không bấm được mục bài). Một cửa cho công cụ `hoc_lieu` (MCP) và REST `/api/v1/hoc-lieu`.
 *
 * Nguồn:
 *   - Courses + Academy: CSDL (Course/CourseSection/Lesson/LessonDetail) — đã seed từ content/*.mjs mỗi deploy.
 *   - Khoá kiểu sách (Dekiru, JP, CH, IELTS, Giao tiếp): JSON công khai do frontend xuất lúc build (sachHoc.ts).
 *   - Lời giảng video: phụ đề (LessonTranscript / phụ đề video riêng) qua phuDe.service — cùng cửa trang học dùng.
 *   - Code Lab: codeLab.service (bộ luyện theo bài, đề theo slug) — cùng luật ẩn lời giải/kiểm ẩn của web.
 *   - Exam Room + Phòng thi mô phỏng PE/FE: exam.service / exam/moPhong.service — chỉ những gì web cho người này xem.
 *
 * QUYỀN: đúng luật web. Bài Courses/Academy ⇒ `xemTronBai` (services/course/quyenNoiDung.ts, cùng công thức trang học);
 * không đủ quyền ⇒ chỉ mục lục + mô tả, không có nội dung. Đáp án đề thi chỉ qua `buildReview` (sau khi nộp — như web).
 * Hàm nào cũng CHỈ ĐỌC.
 */
import { prisma } from '../../config/database.js';
import { config } from '../../config/env.js';
import { NotFoundError, BadRequestError } from '../../middleware/errorHandler.js';
import { xemTronBai, laAdminNguoiDung } from '../course/quyenNoiDung.js';
import { quizTuDuLieuBai } from '../courseTutor.context.js';
import * as phuDeSvc from '../video/phuDe.service.js';
import * as codeLab from '../codeLab.service.js';
import * as examSvc from '../exam.service.js';
import * as moPhong from '../exam/moPhong.service.js';
import { htmlSangMd, baiSachSangMd, phuDeSangVanBan, catTrang, chuanTim, chuNoiTuyen } from './veMarkdown.js';
import { SACH, khoaHopLe, mucLuc, timBuoi, noiDungBuoi, linkBuoi, nhomDekiru, TEN_NHOM, THU_TU_NHOM } from './sachHoc.js';

const WEB = () => (config.frontendUrl || 'https://cuongthai.com').replace(/\/+$/, '');
const viTieuDe = (t: string | null | undefined) => {
  const s = String(t || '');
  const i = s.indexOf('|||');
  return i >= 0 ? s.slice(i + 3).trim() || s.slice(0, i).trim() : s.trim();
};
export const linkBaiKhoa = (courseSlug: string, lessonSlug?: string | null) =>
  `${WEB()}/courses/${courseSlug}/learn${lessonSlug ? `?lessonSlug=${encodeURIComponent(lessonSlug)}` : ''}`;

/** Khoá Academy dạy cùng nội dung với khoá sách ⇒ dẫn chéo (tiếng Nhật học CHÍNH ở Dekiru). */
const KHOA_SANG_SACH: Record<string, { khoa: string; bai: number[] }> = {
  'elementary-japanese-1-a11': { khoa: 'dekiru', bai: [0, 1, 2, 3] },
  'elementary-japanese-1-a12': { khoa: 'dekiru', bai: [4, 5, 6, 7] },
};

async function khoaTheoSlug(slug: string, userId: number) {
  const c = await prisma.course.findUnique({
    where: { slug },
    select: {
      id: true, slug: true, title: true, shortDescription: true, isPublished: true, accessType: true, courseCode: true,
      sections: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true, title: true,
          lessons: {
            orderBy: { sortOrder: 'asc' },
            select: { id: true, slug: true, title: true, lessonType: true, videoDurationSeconds: true, isFreePreview: true, videoUrl: true },
          },
        },
      },
    },
  });
  if (!c || (!c.isPublished && !(await laAdminNguoiDung(userId)))) throw new NotFoundError(`Không có khoá "${slug}"`);
  return c;
}

// ───────────────────────────── search ─────────────────────────────
export async function timKiem(userId: number, q: string, gioiHan = 25) {
  const t = chuanTim(q).trim();
  if (t.length < 2) throw new BadRequestError('Từ khoá quá ngắn');
  const like = q.trim();
  const [khoa, bai, de] = await Promise.all([
    prisma.course.findMany({
      where: { isPublished: true, OR: [{ title: { contains: like, mode: 'insensitive' } }, { slug: { contains: like.toLowerCase() } }, { courseCode: { contains: like, mode: 'insensitive' } }] },
      select: { slug: true, title: true, courseCode: true }, take: 10,
    }),
    prisma.lesson.findMany({
      where: { title: { contains: like, mode: 'insensitive' }, section: { course: { isPublished: true } } },
      select: { id: true, slug: true, title: true, lessonType: true, section: { select: { course: { select: { slug: true, title: true } } } } },
      take: gioiHan,
    }),
    prisma.codeExercise.findMany({
      where: { status: 'PUBLISHED', title: { contains: like, mode: 'insensitive' } },
      select: { slug: true, title: true, difficulty: true, track: { select: { slug: true, name: true } } }, take: 10,
    }),
  ]);
  // Khoá sách: tìm trong mục lục (đã đệm) — tên buổi và tên từng mục.
  const sach: Array<{ khoa: string; bai: number | undefined; muc: string; ten: string; link: string }> = [];
  for (const k of ['dekiru', 'jp', 'ielts', 'en-giao-tiep']) {
    try {
      const ml = await mucLuc(k);
      for (const b of ml.buoi) for (const m of b.bai ?? []) {
        if (sach.length >= gioiHan) break;
        if (chuanTim(`${b.ten} ${m.title}`).includes(t)) sach.push({ khoa: k, bai: b.so ?? b.n, muc: m.id, ten: `${b.ten} · ${chuNoiTuyen(m.title)}`, link: linkBuoi(k, b) });
      }
    } catch { /* nguồn sách tạm không với tới — vẫn trả phần CSDL */ }
  }
  return {
    khoa: khoa.map((c) => ({ slug: c.slug, ma: c.courseCode, ten: viTieuDe(c.title), link: `${WEB()}/courses/${c.slug}` })),
    bai: bai.map((l) => ({ khoa: l.section.course.slug, baiId: l.id, slug: l.slug, ten: viTieuDe(l.title), loai: l.lessonType, link: linkBaiKhoa(l.section.course.slug, l.slug) })),
    codeLab: de.map((e) => ({ slug: e.slug, ten: e.title, doKho: e.difficulty, track: e.track?.slug, link: `${WEB()}/code-lab/${e.track?.slug ?? ''}` })),
    sach,
    goiY: 'Đọc nội dung: action "lesson" (course + lesson) hoặc (book + bai + item). Bài tập code: action "exercises".',
  };
}

// ───────────────────────────── outline ─────────────────────────────
export async function mucLucKhoa(userId: number, slug: string) {
  const c = await khoaTheoSlug(slug, userId);
  const duXem = await xemTronBai(userId, c.id, false);
  const sang = KHOA_SANG_SACH[slug];
  return {
    khoa: { slug: c.slug, ma: c.courseCode, ten: viTieuDe(c.title), moTa: c.shortDescription ? viTieuDe(c.shortDescription) : null, link: `${WEB()}/courses/${c.slug}` },
    quyen: duXem ? 'đọc trọn mọi bài' : 'chỉ bài xem thử (chưa ghi danh/chưa mua) — nội dung bài khác bị khoá như trên web',
    ...(sang ? { hocChinhO: { book: sang.khoa, bai: sang.bai, link: `${WEB()}${SACH[sang.khoa]!.trang}?bai=${sang.bai[1] ?? sang.bai[0]}`, ghiChu: 'Môn này học CHÍNH ở khoá sách — dùng action outline với book.' } } : {}),
    chuong: c.sections.map((s) => ({
      ten: viTieuDe(s.title),
      bai: s.lessons.map((l) => ({
        id: l.id, slug: l.slug, ten: viTieuDe(l.title), loai: l.lessonType,
        phutVideo: l.videoDurationSeconds ? Math.round(l.videoDurationSeconds / 60) : undefined,
        coVideo: !!l.videoUrl || undefined, mo: duXem || l.isFreePreview,
      })),
    })),
  };
}

export async function mucLucSach(khoa: string, bai?: number) {
  if (!khoaHopLe(khoa)) throw new BadRequestError(`book phải là một trong: ${Object.keys(SACH).join(', ')}`);
  const ml = await mucLuc(khoa);
  if (bai === undefined) {
    return {
      book: khoa, ten: SACH[khoa]!.ten, donVi: ml.donVi, link: `${WEB()}${SACH[khoa]!.trang}`,
      buoi: ml.buoi.map((b) => ({ bai: b.so ?? b.n, ten: b.ten, phut: b.phut, soMuc: (b.bai ?? []).length, link: linkBuoi(khoa, b) })),
      goiY: 'Mục lục một bài: outline với book + bai. Nội dung một mục: lesson với book + bai + item.',
    };
  }
  const b = timBuoi(ml, bai);
  if (!b) throw new NotFoundError(`Không có ${ml.donVi ?? 'bài'} ${bai} trong ${khoa}`);
  const muc = (b.bai ?? []).map((m) => ({ id: m.id, ten: chuNoiTuyen(m.title), loai: m.kind, phut: m.minutes, mucTieu: m.goal ? chuNoiTuyen(m.goal) : undefined, soan: m.ready !== false }));
  const nhom = khoa === 'dekiru'
    ? THU_TU_NHOM.map((g) => ({ nhom: TEN_NHOM[g], muc: muc.filter((m) => nhomDekiru(m.id) === g) })).filter((x) => x.muc.length)
    : [{ nhom: b.ten, muc }];
  return { book: khoa, bai: b.so ?? b.n, ten: b.ten, phut: b.phut, link: linkBuoi(khoa, b), nhom };
}

// ───────────────────────────── lesson ─────────────────────────────
export async function noiDungBaiKhoa(userId: number, slug: string, lesson: string | number, o: { offset?: number; maxChars?: number; english?: boolean } = {}) {
  const c = await khoaTheoSlug(slug, userId);
  const l = await prisma.lesson.findFirst({
    where: { section: { courseId: c.id }, ...(typeof lesson === 'number' || /^\d+$/.test(String(lesson)) ? { id: Number(lesson) } : { slug: String(lesson) }) },
    include: { details: true, section: { select: { title: true } } },
  });
  if (!l) throw new NotFoundError(`Không có bài "${lesson}" trong khoá ${slug}`);
  const link = linkBaiKhoa(c.slug, l.slug);
  if (!(await xemTronBai(userId, c.id, l.isFreePreview))) {
    return { khoa: c.slug, bai: viTieuDe(l.title), link, khoa_noi_dung: true, moTa: l.description ? htmlSangMd(l.description) : null, ghiChu: 'Bài trả phí: người dùng chưa ghi danh/chưa mua khoá — trên web cũng bị khoá.' };
  }
  const en = !!o.english;
  const phan: string[] = [`# ${viTieuDe(l.title)}`, `_Khoá ${viTieuDe(c.title)} › ${viTieuDe(l.section.title)} · ${l.lessonType}_ · ${link}`];
  if (l.content) phan.push(htmlSangMd(l.content, en));
  const quiz = quizTuDuLieuBai((l.details as { quizData?: unknown } | null)?.quizData, en);
  if (quiz.length) {
    phan.push('## Câu hỏi của bài (kèm đáp án để chấm)\n' + quiz.map((q) => `${q.n}. ${q.prompt}\n${q.options.map((op, j) => `   ${String.fromCharCode(65 + j)}. ${op}`).join('\n')}${q.correctIndexes.length ? `\n   - Đáp án: ${q.correctIndexes.map((i) => String.fromCharCode(65 + i)).join(', ')}` : ''}${q.explanation ? `\n   - Giải thích: ${q.explanation}` : ''}`).join('\n'));
  }
  // Lời giảng video (phụ đề) — cùng cửa phòng học; không có thì bỏ qua.
  if (l.videoUrl) {
    try {
      const p = await phuDeSvc.phongHoc(l.id, 'auto') as { cues?: unknown };
      const vb = phuDeSangVanBan(p.cues, !en);
      if (vb) phan.push(`## Lời giảng video (phụ đề)\n${vb}`);
    } catch { phan.push('_(Bài có video nhưng chưa có phụ đề để đọc.)_'); }
  }
  const t = catTrang(phan.join('\n\n'), o.offset ?? 0, o.maxChars ?? 24_000);
  return { khoa: c.slug, baiId: l.id, slug: l.slug, link, noiDung: t.text, tiep: t.tiep, tongKyTu: t.tong };
}

export async function noiDungMucSach(khoa: string, bai: number, item: string | undefined, o: { offset?: number; maxChars?: number; dapAn?: boolean } = {}) {
  if (!khoaHopLe(khoa)) throw new BadRequestError(`book phải là một trong: ${Object.keys(SACH).join(', ')}`);
  const ml = await mucLuc(khoa);
  const b = timBuoi(ml, bai);
  if (!b) throw new NotFoundError(`Không có bài ${bai} trong ${khoa}`);
  const ds = await noiDungBuoi(khoa, b, ml.phienBan);
  const chon = item ? ds.filter((m) => m.id === item || chuanTim(m.title).includes(chuanTim(item))) : ds;
  if (!chon.length) throw new NotFoundError(`Không có mục "${item}" trong ${b.ten} — xem outline để lấy id mục`);
  const md = chon.map((m) => baiSachSangMd(m, { dapAn: o.dapAn !== false })).join('\n\n---\n\n');
  const t = catTrang(md, o.offset ?? 0, o.maxChars ?? 24_000);
  return { book: khoa, bai: b.so ?? b.n, ten: b.ten, link: linkBuoi(khoa, b), muc: chon.map((m) => m.id), noiDung: t.text, tiep: t.tiep, tongKyTu: t.tong };
}

// ───────────────────────────── exercises (Code Lab) ─────────────────────────────
const daGiai = (v: unknown) => (Array.isArray(v) ? v : []);
export async function baiTapCode(userId: number, o: { course?: string; lesson?: string; exercise?: string }) {
  const admin = await laAdminNguoiDung(userId);
  if (o.exercise) {
    const e = await codeLab.getExerciseBySlug(o.exercise, { admin, signedIn: true, userId }) as Record<string, any>;
    const vi = (a: unknown, b: unknown) => htmlSangMd(String(a || b || ''));
    const phan = [
      `# ${e.title} (${e.difficulty}, ${e.language})`,
      vi(e.problemHtmlVi, e.problemHtml),
      e.inputSpec ? `**Đầu vào:** ${e.inputSpec}` : '', e.outputSpec ? `**Đầu ra:** ${e.outputSpec}` : '', e.constraints ? `**Ràng buộc:** ${e.constraints}` : '',
      daGiai(e.examplesJson).length ? '## Ví dụ\n' + daGiai(e.examplesJson).map((x: any, i: number) => `${i + 1}. Vào: \`${JSON.stringify(x.input ?? x.in ?? x.vao ?? '')}\` → Ra: \`${JSON.stringify(x.output ?? x.out ?? x.ra ?? '')}\`${x.explanation ? ` — ${x.explanation}` : ''}`).join('\n') : '',
      daGiai(e.hintsJson).length ? '## Gợi ý (đưa từng cái khi người học kẹt)\n' + daGiai(e.hintsJson).map((h: any, i: number) => `${i + 1}. ${typeof h === 'string' ? h : h.text ?? h.vi ?? JSON.stringify(h)}`).join('\n') : '',
      e.starterCodeJson ? '## Code khởi đầu\n```\n' + (typeof e.starterCodeJson === 'string' ? e.starterCodeJson : JSON.stringify(e.starterCodeJson, null, 2)).slice(0, 6000) + '\n```' : '',
      `_Kiểm công khai: ${daGiai((e.testsJson as any)?.cases ?? e.testsJson).length || 'xem trên trang'} · kiểm ẩn giữ kín. Lời giải chính thức KHÔNG đưa — người học tự làm, nộp trên web để chấm._`,
      `Link: ${WEB()}/code-lab/${e.track?.slug ?? ''}/${e.slug}`,
    ].filter(Boolean).join('\n\n');
    const t = catTrang(phan, 0, 24_000);
    return { exercise: e.slug, noiDung: t.text, tiep: t.tiep };
  }
  if (!o.course || !o.lesson) throw new BadRequestError('exercises cần (course + lesson) hoặc exercise (slug)');
  const set = await codeLab.getPracticeSet(o.course, o.lesson, { admin, userId }) as unknown as Record<string, any>;
  return {
    course: o.course, lesson: o.lesson, coBoLuyen: set.coBoLuyen, phamVi: set.scope, tong: set.total, daGiai: set.solvedCount,
    phutUocTinh: set.estimatedMinutes, dangSoan: set.dangSoan || undefined,
    baiTap: daGiai(set.items).map((x: any) => ({ slug: x.slug, ten: x.title, doKho: x.difficulty, trangThai: x.myStatus ?? x.status ?? undefined, link: `${WEB()}/code-lab/${set.trackSlug}/${x.slug}` })),
    goiY: set.items?.length ? 'Đọc đề: exercises với exercise = slug.' : (set.goiY ? `Chưa có bộ riêng — luyện tạm track ${set.goiY.trackSlug}` : undefined),
  };
}

// ───────────────────────────── exam ─────────────────────────────
export async function deThi(userId: number, o: { course?: string; subject?: string; attempt?: number }) {
  if (o.attempt) {
    // Xem lại lượt thi ĐÃ NỘP của chính người này — buildReview tự chặn lượt của người khác / chưa nộp (như web).
    const r = await examSvc.buildReview(o.attempt, userId) as Record<string, any>;
    const t = catTrang(JSON.stringify(r, null, 1), 0, 24_000);
    return { attempt: o.attempt, review: t.text, tiep: t.tiep };
  }
  if (o.subject) {
    const tq = await moPhong.tongQuan(o.subject, userId);
    return { moPhong: tq, link: `${WEB()}/exam/mo-phong` };
  }
  if (o.course) {
    const ds = await examSvc.listExamsForCourse(o.course, userId);
    return { course: o.course, deThi: ds, link: `${WEB()}/exam`, goiY: 'Xem lại một lượt đã nộp: exam với attempt = id lượt (có đáp án như trang xem lại).' };
  }
  return { moPhong: await moPhong.danhSachMon(), link: `${WEB()}/exam/mo-phong`, goiY: 'Chi tiết một môn: exam với subject = mã môn (vd FER202).' };
}

// ───────────────────────────── links ─────────────────────────────
export async function lienKet(userId: number, slug: string, lesson: string) {
  const c = await khoaTheoSlug(slug, userId);
  const l = await prisma.lesson.findFirst({
    where: { section: { courseId: c.id }, ...(/^\d+$/.test(lesson) ? { id: Number(lesson) } : { slug: lesson }) },
    select: { id: true, slug: true, title: true, videoUrl: true },
  });
  if (!l) throw new NotFoundError(`Không có bài "${lesson}"`);
  const [pd, luyen, de] = await Promise.all([
    l.videoUrl ? phuDeSvc.coPhuDe(l.id).catch(() => null) : Promise.resolve(null),
    l.slug ? codeLab.getPracticeSet(c.slug, l.slug, { userId }).catch(() => null) : Promise.resolve(null),
    examSvc.listExamsForCourse(c.slug, userId).catch(() => []),
  ]);
  const sang = KHOA_SANG_SACH[c.slug];
  return {
    bai: viTieuDe(l.title), link: linkBaiKhoa(c.slug, l.slug),
    video: l.videoUrl ? { co: true, phuDe: !!(pd as { co?: boolean } | null)?.co } : { co: false },
    codeLab: luyen ? { tong: (luyen as any).total, daGiai: (luyen as any).solvedCount, baiTap: daGiai((luyen as any).items).slice(0, 8).map((x: any) => x.slug) } : null,
    deThi: daGiai(de).map((e: any) => ({ id: e.id, ten: e.title, loai: e.kind, soCau: e._count?.questions })),
    ...(sang ? { sach: { book: sang.khoa, bai: sang.bai, link: `${WEB()}${SACH[sang.khoa]!.trang}?bai=${sang.bai[1] ?? sang.bai[0]}` } } : {}),
  };
}
