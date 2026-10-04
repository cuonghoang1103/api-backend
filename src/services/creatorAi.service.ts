/**
 * Content Creator — AI soạn gói quay (04/10/2026).
 *
 * Phần THUẦN (lời dặn, chuẩn hoá, dựng kịch bản) ở `creatorAi.prompt.ts`. File
 * này lo ba việc có DB/mạng:
 *   1. Danh mục khoá học (Academy + Courses gộp một danh sách) và mục lục từng
 *      khoá cho bộ chọn "Quay khoá học".
 *   2. Dựng NGỮ CẢNH THẬT cho model: nội dung bài (đúng một thứ tiếng), mô tả
 *      chương, mục lục khoá, bài trước/sau để nối mạch, quiz, hình trong bài.
 *   3. Việc chạy NỀN: Cloudflare cắt yêu cầu > 100 giây (524), mà một gói quay
 *      15 phút mất 1–3 phút để sinh. Nên: POST tạo việc → GET hỏi lại (mẫu
 *      `voVe.service.ts`). Map trong bộ nhớ — một tiến trình backend; deploy tráo
 *      container thì việc đang chạy mất, giao diện báo lỗi và người dùng bấm lại.
 *
 * Mọi lời gọi đi `llmComplete` với purpose `creator_script` ⇒ qua cầu dao ngân
 * sách (interactive) + nhật ký chi phí; trước mỗi lời gọi kiểm trần token ngày.
 */
import { randomUUID } from 'node:crypto';
import { ContentStatus, ContentType, Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { llmComplete, checkTokenQuota } from './interview/llm/index.js';
import { chonNgu, quizTuDuLieuBai, vanBanBai, plain } from './courseTutor.context.js';
import { ensureUniqueContentSlug } from './content.service.js';
import { createScriptVersion } from './content.script.service.js';
import {
  bocJson,
  canhTuGoi,
  chuanHoaGoi,
  deGocYTuong,
  deGoiYTuong,
  deHook,
  deShorts,
  deTieuDe,
  deVietLai,
  heThongGoiBaiGiang,
  heThongGoiYTuong,
  heThongViecNho,
  khoiYeuCau,
  kichBanTuGoi,
  maxTokenGoi,
  moTaYoutube,
  phutGoiY,
  tongGiay,
  type BoiCanhDuAn,
  type GoiQuay,
  type NgonNguQuay,
  type PhongCachQuay,
  type YeuCauQuay,
} from './creatorAi.prompt.js';

/** Đánh dấu ngày quay do AI dựng — soạn lại thì thay đúng ngày này, không đụng ngày người dùng tự thêm. */
export const NHAN_NGAY_AI = 'Gói quay AI';

// ─── Danh mục khoá học ───────────────────────────────────────────────────────

export interface KhoaHocMuc {
  slug: string;
  ma: string | null;
  ten: string;
  tenEn: string;
  nguon: 'ACADEMY' | 'COURSES';
  hocKy: string | null;
  daXuatBan: boolean;
  soChuong: number;
  soBai: number;
  soDuAn: number;
}

export async function danhMucKhoaHoc(): Promise<KhoaHocMuc[]> {
  const [khoa, duAn] = await Promise.all([
    prisma.course.findMany({
      orderBy: [{ academyType: 'asc' }, { courseCode: 'asc' }, { title: 'asc' }],
      select: {
        slug: true, title: true, courseCode: true, academyType: true, isPublished: true,
        semester: { select: { name: true } },
        sections: { select: { _count: { select: { lessons: true } } } },
      },
    }),
    prisma.contentProject.groupBy({ by: ['courseSlug'], _count: { _all: true }, where: { courseSlug: { not: null } } }),
  ]);
  const demDuAn = new Map(duAn.map((d) => [d.courseSlug, d._count._all]));
  return khoa
    .map((k) => ({
      slug: k.slug,
      ma: k.courseCode,
      ten: chonNgu(k.title, false),
      tenEn: chonNgu(k.title, true),
      nguon: (k.academyType === 'GENERAL' ? 'COURSES' : 'ACADEMY') as KhoaHocMuc['nguon'],
      hocKy: k.semester?.name ?? null,
      daXuatBan: k.isPublished,
      soChuong: k.sections.length,
      soBai: k.sections.reduce((s, x) => s + x._count.lessons, 0),
      soDuAn: demDuAn.get(k.slug) ?? 0,
    }))
    .filter((k) => k.soBai > 0);
}

export interface BaiMuc {
  id: number;
  ten: string;
  loai: string;
  soKyTu: number;
  coQuiz: boolean;
  thuTu: number;
  duAn: { id: number; status: string; updatedAt: Date } | null;
}

export async function mucLucKhoaHoc(slug: string) {
  const k = await prisma.course.findUnique({
    where: { slug },
    select: {
      id: true, slug: true, title: true, courseCode: true, academyType: true, shortDescription: true,
      semester: { select: { name: true } },
      sections: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true, title: true, description: true,
          lessons: {
            orderBy: { sortOrder: 'asc' },
            select: { id: true, title: true, lessonType: true, content: true, details: { select: { quizData: true } } },
          },
        },
      },
    },
  });
  if (!k) throw new AppError('Không tìm thấy khoá học', 404, 'COURSE_NOT_FOUND');

  const duAn = await prisma.contentProject.findMany({
    where: { courseSlug: slug },
    select: { id: true, tags: true, status: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });
  const theoThe = new Map<string, { id: number; status: string; updatedAt: Date }>();
  for (const d of duAn) for (const t of d.tags) if (!theoThe.has(t)) theoThe.set(t, { id: d.id, status: d.status, updatedAt: d.updatedAt });

  let thuTu = 0;
  return {
    slug: k.slug,
    ma: k.courseCode,
    ten: chonNgu(k.title, false),
    tenEn: chonNgu(k.title, true),
    nguon: k.academyType === 'GENERAL' ? 'COURSES' : 'ACADEMY',
    hocKy: k.semester?.name ?? null,
    moTa: k.shortDescription,
    gioiThieu: theoThe.get(theKhoa(k.id)) ?? null,
    chuong: k.sections.map((s, i) => ({
      id: s.id,
      soThuTu: i + 1,
      ten: chonNgu(s.title, false),
      duAn: theoThe.get(theChuong(s.id)) ?? null,
      bai: s.lessons.map((l): BaiMuc => {
        thuTu += 1;
        return {
          id: l.id,
          ten: chonNgu(l.title, false),
          loai: l.lessonType,
          soKyTu: vanBanBai(l.content, false, Number.MAX_SAFE_INTEGER).length,
          coQuiz: Array.isArray((l.details?.quizData as { questions?: unknown[] } | null)?.questions),
          thuTu,
          duAn: theoThe.get(theBai(l.id)) ?? null,
        };
      }),
    })),
  };
}

const theBai = (id: number) => `bai-${id}`;
const theChuong = (id: number) => `chuong-${id}`;
const theKhoa = (id: number) => `khoa-${id}-gioi-thieu`;

// ─── Ngữ cảnh bài học ────────────────────────────────────────────────────────

export type PhamVi = 'bai' | 'chuong' | 'khoa';

interface NguonQuay {
  phamVi: PhamVi;
  /** Khối ngữ cảnh đưa cho model. */
  nguCanh: string;
  soKyTuNguon: number;
  khoa: { id: number; slug: string; ma: string | null; ten: string };
  /** Tiêu đề dự án + "Chương · bài" để gắn vào ContentProject. */
  tieuDeDuAn: string;
  lessonRef: string;
  the: string;
  thuTu: number | null;
  /** Hiển thị ở đầu kịch bản. */
  nhan: string;
}

const TRAN_NOI_DUNG_BAI = 26_000;
const TRAN_MUC_LUC = 6_000;

function anhTrongBai(html: string | null | undefined): string[] {
  const ra: string[] = [];
  const re = /<img\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(String(html || ''))) && ra.length < 25) {
    const alt = m[0].match(/\balt\s*=\s*["']([^"']*)["']/i)?.[1]?.trim();
    const src = m[0].match(/\bsrc\s*=\s*["']([^"']*)["']/i)?.[1]?.trim();
    const ten = src ? src.split('/').pop()?.split('?')[0] : '';
    if (alt || ten) ra.push(`${alt || '(không chú thích)'}${ten ? ` — ${ten}` : ''}`);
  }
  return ra;
}

type KhoaDayDu = Prisma.CourseGetPayload<{
  select: {
    id: true; slug: true; title: true; courseCode: true; academyType: true; shortDescription: true;
    description: true; whatYouLearn: true; requirements: true; level: true;
    semester: { select: { name: true } };
    sections: {
      select: { id: true; title: true; description: true; lessons: { select: { id: true; title: true; lessonType: true } } };
    };
  };
}>;

async function napKhoa(where: Prisma.CourseWhereUniqueInput): Promise<KhoaDayDu> {
  const k = await prisma.course.findUnique({
    where,
    select: {
      id: true, slug: true, title: true, courseCode: true, academyType: true, shortDescription: true,
      description: true, whatYouLearn: true, requirements: true, level: true,
      semester: { select: { name: true } },
      sections: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true, title: true, description: true,
          lessons: { orderBy: { sortOrder: 'asc' }, select: { id: true, title: true, lessonType: true } },
        },
      },
    },
  });
  if (!k) throw new AppError('Không tìm thấy khoá học', 404, 'COURSE_NOT_FOUND');
  return k;
}

function khoiKhoa(k: KhoaDayDu, en: boolean, danhDau?: { sectionId?: number; lessonId?: number }): string {
  const dong: string[] = [
    '# KHOÁ HỌC',
    `- Mã: ${k.courseCode ?? '(không có)'} · Tên: ${chonNgu(k.title, en)}`,
    `- Nguồn: ${k.academyType === 'GENERAL' ? 'Khoá học tự soạn (Courses)' : `Academy ${k.academyType}${k.semester ? ` · ${k.semester.name}` : ''}`} · Trình độ: ${k.level}`,
  ];
  if (k.shortDescription) dong.push(`- Mô tả ngắn: ${plain(k.shortDescription, 600)}`);
  // Mục lục — để model nối mạch và không giảng trùng bài khác.
  const ml: string[] = ['## Mục lục khoá (▶ = phần đang quay)'];
  k.sections.forEach((s, i) => {
    // Tiêu đề chương đã tự đánh số ("Chương 3 — …", "Mục 0 — …") — không đánh số lại.
    const dang = danhDau?.sectionId === s.id;
    const bai = s.lessons.map((l) => `${danhDau?.lessonId === l.id ? '▶ ' : ''}${chonNgu(l.title, en)}`).join('; ');
    ml.push(`${dang ? '▶ ' : ''}${chonNgu(s.title, en) || `Phần ${i + 1}`} — ${bai}`);
  });
  let mlText = ml.join('\n');
  if (mlText.length > TRAN_MUC_LUC) mlText = mlText.slice(0, TRAN_MUC_LUC) + '\n[… mục lục còn tiếp]';
  dong.push(mlText);
  return dong.join('\n');
}

async function nguonBai(lessonId: number, en: boolean): Promise<NguonQuay> {
  const l = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true, title: true, description: true, content: true, lessonType: true, videoDurationSeconds: true,
      details: { select: { teachingNotes: true, quizData: true } },
      section: { select: { id: true, courseId: true } },
    },
  });
  if (!l) throw new AppError('Không tìm thấy bài học', 404, 'LESSON_NOT_FOUND');
  const k = await napKhoa({ id: l.section.courseId });
  const iChuong = k.sections.findIndex((s) => s.id === l.section.id);
  const chuong = k.sections[iChuong];
  const tatCa = k.sections.flatMap((s) => s.lessons);
  const viTri = tatCa.findIndex((x) => x.id === l.id);
  const truoc = viTri > 0 ? tatCa[viTri - 1] : null;
  const sau = viTri >= 0 && viTri < tatCa.length - 1 ? tatCa[viTri + 1] : null;

  let tomTatTruoc = '';
  if (truoc) {
    const t = await prisma.lesson.findUnique({ where: { id: truoc.id }, select: { content: true } });
    tomTatTruoc = vanBanBai(t?.content, en, 700);
  }

  const noiDung = vanBanBai(l.content, en, TRAN_NOI_DUNG_BAI);
  const anh = anhTrongBai(l.content);
  const quiz = quizTuDuLieuBai(l.details?.quizData, en, 15);
  const tenBai = chonNgu(l.title, en);
  const tenChuong = chuong ? chonNgu(chuong.title, en) : '';

  const nguCanh = [
    khoiKhoa(k, en, { sectionId: chuong?.id, lessonId: l.id }),
    '',
    `# CHƯƠNG ĐANG QUAY: ${tenChuong}`,
    chuong?.description ? `Mô tả chương: ${plain(chuong.description, 1500)}` : '',
    truoc ? `# BÀI TRƯỚC: ${chonNgu(truoc.title, en)}${tomTatTruoc ? `\nTóm lược: ${tomTatTruoc}` : ''}` : '# BÀI TRƯỚC: (đây là bài đầu khoá)',
    sau ? `# BÀI SAU: ${chonNgu(sau.title, en)}` : '# BÀI SAU: (đây là bài cuối khoá)',
    '',
    `# BÀI ĐANG QUAY: ${tenBai}`,
    `Loại bài: ${l.lessonType}${l.videoDurationSeconds ? ` · video cũ dài ${Math.round(l.videoDurationSeconds / 60)} phút` : ''}`,
    l.description ? `Mô tả bài: ${plain(l.description, 1500)}` : '',
    l.details?.teachingNotes ? `Ghi chú giảng dạy của giảng viên: ${plain(l.details.teachingNotes, 3000)}` : '',
    '## NỘI DUNG BÀI (nguồn sự thật — bám đúng phần này)',
    noiDung || '(Bài này KHÔNG có nội dung văn bản — chỉ có tiêu đề. Soạn khung và đánh dấu [CẦN BỔ SUNG] ở mọi chỗ cần kiến thức cụ thể.)',
    anh.length ? `## HÌNH / SLIDE CÓ TRONG BÀI (dùng làm "manHinh")\n${anh.map((a) => `- ${a}`).join('\n')}` : '',
    quiz.length
      ? `## QUIZ CỦA BÀI\n${quiz.map((q) => `${q.n}. ${q.prompt}\n${q.options.map((o, i) => `   ${String.fromCharCode(65 + i)}. ${o}${q.correctIndexes.includes(i) ? ' ✓' : ''}`).join('\n')}${q.explanation ? `\n   Giải thích: ${q.explanation}` : ''}`).join('\n')}`
      : '',
  ].filter(Boolean).join('\n');

  const tenVi = chonNgu(l.title, false);
  return {
    phamVi: 'bai',
    nguCanh,
    soKyTuNguon: noiDung.length,
    khoa: { id: k.id, slug: k.slug, ma: k.courseCode, ten: chonNgu(k.title, false) },
    tieuDeDuAn: `${k.courseCode ? `${k.courseCode} · ` : ''}${tenVi}`.slice(0, 200),
    lessonRef: `${chonNgu(chuong?.title ?? '', false)} · ${tenVi}`.slice(0, 255),
    the: theBai(l.id),
    thuTu: viTri >= 0 ? viTri + 1 : null,
    nhan: `${k.courseCode ?? chonNgu(k.title, false)} · ${chonNgu(chuong?.title ?? '', false)} · ${tenVi}`,
  };
}

async function nguonChuong(sectionId: number, en: boolean): Promise<NguonQuay> {
  const s = await prisma.courseSection.findUnique({ where: { id: sectionId }, select: { courseId: true } });
  if (!s) throw new AppError('Không tìm thấy chương', 404, 'SECTION_NOT_FOUND');
  const k = await napKhoa({ id: s.courseId });
  const i = k.sections.findIndex((x) => x.id === sectionId);
  const chuong = k.sections[i]!;
  const bai = await prisma.lesson.findMany({
    where: { sectionId },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, title: true, content: true },
  });
  // Chia đều trần cho các bài để bài cuối không bị cắt mất.
  const moiBai = Math.max(2500, Math.floor(TRAN_NOI_DUNG_BAI / Math.max(1, bai.length)));
  const khoi = bai.map((b, j) => `### Bài ${j + 1}: ${chonNgu(b.title, en)}\n${vanBanBai(b.content, en, moiBai) || '(không có nội dung văn bản)'}`);
  const noiDung = khoi.join('\n\n');
  const ten = chonNgu(chuong.title, false);
  return {
    phamVi: 'chuong',
    nguCanh: [
      khoiKhoa(k, en, { sectionId }),
      '',
      `# VIDEO TỔNG QUAN CHƯƠNG: ${chonNgu(chuong.title, en)}`,
      'Một video đi qua TOÀN BỘ chương: bức tranh lớn, mạch nối giữa các bài, những ý cốt lõi nhất của từng bài — không thay thế video từng bài.',
      chuong.description ? `Mô tả chương: ${plain(chuong.description, 1500)}` : '',
      '## NỘI DUNG CÁC BÀI TRONG CHƯƠNG (nguồn sự thật)',
      noiDung,
    ].filter(Boolean).join('\n'),
    soKyTuNguon: noiDung.length,
    khoa: { id: k.id, slug: k.slug, ma: k.courseCode, ten: chonNgu(k.title, false) },
    tieuDeDuAn: `${k.courseCode ? `${k.courseCode} · ` : ''}Tổng quan · ${ten}`.slice(0, 200),
    lessonRef: `${ten} · Tổng quan chương`.slice(0, 255),
    the: theChuong(sectionId),
    thuTu: null,
    nhan: `${k.courseCode ?? chonNgu(k.title, false)} · Tổng quan · ${ten}`,
  };
}

async function nguonKhoa(slug: string, en: boolean): Promise<NguonQuay> {
  const k = await napKhoa({ slug });
  const dau = k.sections[0]?.lessons[0];
  const baiDau = dau ? await prisma.lesson.findUnique({ where: { id: dau.id }, select: { title: true, content: true } }) : null;
  const moTa = [
    k.description ? `## Mô tả khoá\n${plain(k.description, 6000)}` : '',
    k.whatYouLearn ? `## Học xong làm được\n${plain(k.whatYouLearn, 3000)}` : '',
    k.requirements ? `## Yêu cầu đầu vào\n${plain(k.requirements, 2000)}` : '',
    baiDau ? `## Bài mở đầu khoá: ${chonNgu(baiDau.title, en)}\n${vanBanBai(baiDau.content, en, 9000)}` : '',
  ].filter(Boolean).join('\n\n');
  return {
    phamVi: 'khoa',
    nguCanh: [
      khoiKhoa(k, en),
      '',
      '# VIDEO GIỚI THIỆU KHOÁ HỌC (trailer + định hướng)',
      'Mục đích: người xem hiểu khoá này dạy gì, học xong làm được gì, lộ trình các chương, cách học hiệu quả — và muốn bắt đầu ngay. Chỉ hứa những gì có trong mục lục.',
      moTa,
    ].filter(Boolean).join('\n'),
    soKyTuNguon: moTa.length,
    khoa: { id: k.id, slug: k.slug, ma: k.courseCode, ten: chonNgu(k.title, false) },
    tieuDeDuAn: `${k.courseCode ? `${k.courseCode} · ` : ''}Giới thiệu khoá học`.slice(0, 200),
    lessonRef: 'Giới thiệu khoá học',
    the: theKhoa(k.id),
    thuTu: 0,
    nhan: `${k.courseCode ?? chonNgu(k.title, false)} · Giới thiệu khoá`,
  };
}

// ─── Gọi AI ──────────────────────────────────────────────────────────────────

interface TheoDoi {
  onToken?: (d: string) => void;
}

async function goiAi(userId: number, p: { system: string; user: string; maxTokens: number; timeoutMs?: number } & TheoDoi) {
  if (!(await checkTokenQuota(userId))) {
    throw new AppError('Đã chạm trần token AI hôm nay — mai thử lại, hoặc tăng INTERVIEW_DAILY_TOKEN_CAP.', 429, 'TOKEN_QUOTA');
  }
  const r = await llmComplete({
    step: 'generation',
    feature: 'creator',
    purpose: 'creator_script',
    system: p.system,
    messages: [{ role: 'user', content: p.user }],
    maxTokens: p.maxTokens,
    timeoutMs: p.timeoutMs ?? 300_000,
    maxRetries: 1,
    userId,
    onToken: p.onToken,
  });
  return r;
}

async function sinhGoi(userId: number, system: string, user: string, phut: number, theo: TheoDoi): Promise<GoiQuay> {
  const r = await goiAi(userId, { system, user, maxTokens: maxTokenGoi(phut), onToken: theo.onToken });
  try {
    return chuanHoaGoi(bocJson(r.text));
  } catch (e) {
    logger.warn('creatorAi: gói quay không đọc được', { biCat: r.biCat, kyTu: r.text?.length, loi: e instanceof Error ? e.message : String(e) });
    if (r.biCat) throw new AppError('Gói quay quá dài, AI bị cắt giữa chừng — giảm thời lượng mục tiêu hoặc tách bài rồi thử lại.', 502, 'AI_CUT');
    throw new AppError('AI trả về gói quay không đọc được — bấm soạn lại.', 502, 'AI_BAD_JSON');
  }
}

// ─── Lưu gói thành dự án ─────────────────────────────────────────────────────

export interface BanVa {
  script: string;
  mainHook: string | null;
  concept: string | null;
  ngayQuay: {
    dayNumber: number; date: null; location: string; notes: string | null; order: number;
    scenes: ReturnType<typeof canhTuGoi>;
  };
  youtube: { caption: string; hashtags: string[] };
  targetDurationSec: number;
}

export function banVaTuGoi(goi: GoiQuay, lang: NgonNguQuay, nhan?: string): BanVa {
  const hook = goi.canh.find((c) => c.loai === 'HOOK')?.loi || goi.canh[0]?.loi || '';
  const concept = [goi.tomTat, goi.mucTieu.length ? `🎯 ${goi.mucTieu.join(' · ')}` : '', goi.tieuDe.length ? `📝 Tiêu đề gợi ý: ${goi.tieuDe.join(' | ')}` : '']
    .filter(Boolean).join('\n\n');
  return {
    script: kichBanTuGoi(goi, { lang, nguon: nhan }),
    mainHook: hook ? hook.slice(0, 280) : null,
    concept: concept || null,
    ngayQuay: {
      dayNumber: 1,
      date: null,
      location: NHAN_NGAY_AI,
      notes: [goi.chuanBi.length ? `Chuẩn bị: ${goi.chuanBi.join('; ')}` : '', goi.thietLap.boCuc && `Bố cục: ${goi.thietLap.boCuc}`, goi.thietLap.anhSang && `Ánh sáng: ${goi.thietLap.anhSang}`, goi.thietLap.amThanh && `Âm thanh: ${goi.thietLap.amThanh}`]
        .filter(Boolean).join('\n') || null,
      order: 0,
      scenes: canhTuGoi(goi, lang),
    },
    youtube: { caption: moTaYoutube(goi, lang), hashtags: goi.youtube.the.slice(0, 15) },
    targetDurationSec: tongGiay(goi),
  };
}

interface LuuOpts {
  goi: GoiQuay;
  lang: NgonNguQuay;
  nhan: string;
  tieuDe: string;
  type: ContentType;
  the: string[];
  /** Thẻ định danh nguồn (bai-123…) để tìm lại dự án cũ khi soạn lại. */
  theNguon?: string;
  duAnId?: number | null;
  khoa?: { slug: string; ten: string; ma: string | null } | null;
  lessonRef?: string | null;
  thuTu?: number | null;
}

/**
 * Tạo dự án mới — hoặc CẬP NHẬT dự án cũ của đúng nguồn đó (soạn lại một bài
 * không đẻ ra bản sao). Kịch bản cũ được chụp thành phiên bản trước khi ghi đè,
 * nên "soạn lại" luôn hoàn tác được ở tab Kịch bản → Lịch sử.
 */
export async function luuGoiThanhDuAn(o: LuuOpts): Promise<{ id: number; taoMoi: boolean }> {
  const ba = banVaTuGoi(o.goi, o.lang, o.nhan);
  let cu: { id: number; status: ContentStatus; tags: string[] } | null = null;
  if (o.duAnId) {
    cu = await prisma.contentProject.findUnique({ where: { id: o.duAnId }, select: { id: true, status: true, tags: true } });
    if (!cu) throw new AppError('Không tìm thấy dự án', 404, 'CONTENT_NOT_FOUND');
  } else if (o.theNguon) {
    cu = await prisma.contentProject.findFirst({
      where: { tags: { has: o.theNguon } },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, status: true, tags: true },
    });
  }
  const seriesName = o.khoa ? [o.khoa.ma, o.khoa.ten].filter(Boolean).join(' · ').slice(0, 200) : null;

  if (cu) {
    const id = cu.id;
    await createScriptVersion(id, { origin: 'AUTO', label: 'Trước khi AI soạn lại' }).catch(() => null);
    await prisma.$transaction(async (tx) => {
      await tx.productionDay.deleteMany({ where: { contentProjectId: id, location: NHAN_NGAY_AI } });
      const soNgay = await tx.productionDay.count({ where: { contentProjectId: id } });
      await tx.contentProject.update({
        where: { id },
        data: {
          script: ba.script,
          mainHook: ba.mainHook,
          concept: ba.concept,
          targetDurationSec: ba.targetDurationSec,
          scriptLang: o.lang,
          status: cu!.status === 'IDEA' ? 'SCRIPTING' : cu!.status,
          tags: Array.from(new Set([...cu!.tags, ...o.the])),
          days: {
            create: [{
              dayNumber: soNgay + 1, location: ba.ngayQuay.location, notes: ba.ngayQuay.notes, order: soNgay,
              scenes: { create: ba.ngayQuay.scenes },
            }],
          },
        },
      });
      const yt = await tx.platformPost.findFirst({ where: { contentProjectId: id, platform: 'YOUTUBE' } });
      if (!yt) {
        await tx.platformPost.create({ data: { contentProjectId: id, platform: 'YOUTUBE', caption: ba.youtube.caption, hashtags: ba.youtube.hashtags, order: 0 } });
      } else if (!yt.isPublished) {
        await tx.platformPost.update({ where: { id: yt.id }, data: { caption: ba.youtube.caption, hashtags: ba.youtube.hashtags } });
      }
    });
    await createScriptVersion(id, { origin: 'AI', label: `AI · ${o.nhan}`.slice(0, 160) }).catch(() => null);
    return { id, taoMoi: false };
  }

  const slug = await ensureUniqueContentSlug(o.tieuDe);
  const tao = await prisma.contentProject.create({
    data: {
      title: o.tieuDe,
      slug,
      type: o.type,
      status: 'SCRIPTING',
      ideaDate: new Date(),
      script: ba.script,
      mainHook: ba.mainHook,
      concept: ba.concept,
      tags: o.the,
      courseSlug: o.khoa?.slug ?? null,
      courseTitle: o.khoa?.ten?.slice(0, 255) ?? null,
      lessonRef: o.lessonRef ?? null,
      seriesName,
      episodeNumber: o.thuTu && o.thuTu > 0 ? o.thuTu : null,
      targetDurationSec: ba.targetDurationSec,
      scriptLang: o.lang,
      performance: { create: {} },
      days: {
        create: [{
          dayNumber: 1, location: ba.ngayQuay.location, notes: ba.ngayQuay.notes, order: 0,
          scenes: { create: ba.ngayQuay.scenes },
        }],
      },
      platformPosts: { create: [{ platform: 'YOUTUBE', caption: ba.youtube.caption, hashtags: ba.youtube.hashtags, order: 0 }] },
    },
    select: { id: true },
  });
  await createScriptVersion(tao.id, { origin: 'AI', label: `AI · ${o.nhan}`.slice(0, 160) }).catch(() => null);
  return { id: tao.id, taoMoi: true };
}

// ─── Việc chạy nền ───────────────────────────────────────────────────────────

export const LOAI_VIEC = ['goi_bai', 'lo_bai', 'goc_y_tuong', 'goi_y_tuong', 'hook', 'tieu_de', 'shorts', 'viet_lai'] as const;
export type LoaiViec = (typeof LOAI_VIEC)[number];

interface BaiTrongLo {
  lessonId: number;
  ten: string;
  trangThai: 'cho' | 'dang' | 'xong' | 'bo_qua' | 'loi';
  duAnId?: number;
  loi?: string;
}

interface Viec {
  id: string;
  userId: number;
  loai: LoaiViec;
  luc: number;
  xongLuc?: number;
  trangThai: 'chay' | 'xong' | 'loi' | 'huy';
  kyTu: number;
  duoi: string;
  ketQua?: unknown;
  loi?: { thongDiep: string; ma: string; status: number };
  lo?: BaiTrongLo[];
  huy?: boolean;
}

const VIEC = new Map<string, Viec>();
const SONG_VIEC_MS = 45 * 60_000;
const TOI_DA_DANG_CHAY = 3;
const TOI_DA_LO = 40;

function donViec() {
  const han = Date.now() - SONG_VIEC_MS;
  for (const [id, v] of VIEC) if ((v.xongLuc ?? v.luc) < han && v.trangThai !== 'chay') VIEC.delete(id);
}

function theoDoi(v: Viec): TheoDoi {
  return {
    onToken: (d) => {
      v.kyTu += d.length;
      v.duoi = (v.duoi + d).slice(-600);
    },
  };
}

function soNguyen(v: unknown, macDinh: number, min: number, max: number): number {
  const n = typeof v === 'number' ? v : parseInt(String(v ?? ''), 10);
  if (!Number.isFinite(n)) return macDinh;
  return Math.min(max, Math.max(min, Math.round(n)));
}
function chuoiVao(v: unknown, tran: number): string {
  return typeof v === 'string' ? v.trim().slice(0, tran) : '';
}
function langVao(v: unknown): NgonNguQuay {
  return v === 'EN' ? 'EN' : 'VI';
}
function phongCachVao(v: unknown): PhongCachQuay {
  return v === 'man_hinh' || v === 'truoc_may' ? v : 'ket_hop';
}
function loaiNoiDungVao(v: unknown, macDinh: ContentType): ContentType {
  return typeof v === 'string' && (Object.values(ContentType) as string[]).includes(v) ? (v as ContentType) : macDinh;
}

/** Thời lượng: 0/thiếu = tự động theo độ dài nguồn. */
function phutVao(v: unknown, soKyTuNguon: number): number {
  const n = soNguyen(v, 0, 0, 40);
  return n > 0 ? n : phutGoiY(soKyTuNguon);
}

async function chayGoiBai(v: Viec, b: Record<string, unknown>) {
  const lang = langVao(b.lang);
  const en = lang === 'EN';
  const phamVi: PhamVi = b.phamVi === 'chuong' || b.phamVi === 'khoa' ? b.phamVi : 'bai';
  const nguon = phamVi === 'bai'
    ? await nguonBai(soNguyen(b.lessonId, 0, 0, Number.MAX_SAFE_INTEGER), en)
    : phamVi === 'chuong'
      ? await nguonChuong(soNguyen(b.sectionId, 0, 0, Number.MAX_SAFE_INTEGER), en)
      : await nguonKhoa(chuoiVao(b.courseSlug, 255), en);
  const yc: YeuCauQuay = {
    lang,
    phut: phutVao(b.phut, nguon.soKyTuNguon),
    phongCach: phongCachVao(b.phongCach),
    ghiChu: chuoiVao(b.ghiChu, 1500),
  };
  const goi = await sinhGoi(v.userId, heThongGoiBaiGiang(lang), `${nguon.nguCanh}\n\n${khoiYeuCau(yc)}\n\nSoạn GÓI QUAY hoàn chỉnh theo đúng mẫu JSON.`, yc.phut, theoDoi(v));

  const duAnId = soNguyen(b.duAnId, 0, 0, Number.MAX_SAFE_INTEGER) || null;
  // Trong trình sửa dự án: chỉ TRẢ VỀ bản vá — trình sửa tự áp vào form của nó
  // (ghi thẳng DB sẽ bị lượt tự lưu kế tiếp của trình sửa đè mất).
  if (b.luu === 'tra_ve') {
    return { goi, banVa: banVaTuGoi(goi, lang, nguon.nhan), nguon: { nhan: nguon.nhan, the: nguon.the, phut: yc.phut } };
  }
  const luu = await luuGoiThanhDuAn({
    goi, lang, nhan: nguon.nhan, tieuDe: nguon.tieuDeDuAn, type: ContentType.LECTURE,
    the: ['khoa-hoc', ...(nguon.khoa.ma ? [nguon.khoa.ma.toLowerCase()] : []), nguon.the],
    theNguon: nguon.the, duAnId,
    khoa: { slug: nguon.khoa.slug, ten: nguon.khoa.ten, ma: nguon.khoa.ma },
    lessonRef: nguon.lessonRef, thuTu: nguon.thuTu,
  });
  return { goi, duAnId: luu.id, taoMoi: luu.taoMoi, nguon: { nhan: nguon.nhan, the: nguon.the, phut: yc.phut } };
}

async function chayLoBai(v: Viec, b: Record<string, unknown>) {
  const lo = v.lo!;
  const boQuaDaCo = b.boQuaDaCo !== false;
  let soXong = 0;
  for (const bai of lo) {
    if (v.huy) break;
    if (boQuaDaCo) {
      const co = await prisma.contentProject.findFirst({ where: { tags: { has: theBai(bai.lessonId) } }, select: { id: true } });
      if (co) { bai.trangThai = 'bo_qua'; bai.duAnId = co.id; continue; }
    }
    bai.trangThai = 'dang';
    v.kyTu = 0;
    v.duoi = '';
    try {
      const kq = await chayGoiBai(v, { ...b, phamVi: 'bai', lessonId: bai.lessonId, luu: 'tao_du_an', duAnId: null });
      bai.trangThai = 'xong';
      bai.duAnId = (kq as { duAnId?: number }).duAnId;
      soXong += 1;
    } catch (e) {
      bai.trangThai = 'loi';
      bai.loi = e instanceof Error ? e.message : String(e);
      // Hết hạn mức (token/tiền) thì dừng cả lô — các bài sau chắc chắn cũng hỏng.
      const ma = (e as { code?: string; statusCode?: number })?.code;
      if (ma === 'TOKEN_QUOTA' || ma === 'BUDGET_EXCEEDED' || (e as { statusCode?: number })?.statusCode === 429) break;
    }
  }
  return { soXong, lo };
}

async function boiCanhDuAn(b: Record<string, unknown>): Promise<BoiCanhDuAn> {
  const id = soNguyen(b.duAnId, 0, 0, Number.MAX_SAFE_INTEGER);
  const p = id
    ? await prisma.contentProject.findUnique({
      where: { id },
      select: { title: true, concept: true, script: true, courseTitle: true, lessonRef: true, type: true },
    })
    : null;
  // Trình sửa gửi kèm bản ĐANG HIỆN trên màn hình (tự lưu trễ 1,2 giây).
  return {
    tieuDe: chuoiVao(b.tieuDe, 300) || p?.title || 'Video',
    khaiNiem: chuoiVao(b.khaiNiem, 3000) || p?.concept || null,
    kichBan: typeof b.kichBan === 'string' ? b.kichBan.slice(0, 40_000) : p?.script ?? null,
    khoaHoc: p?.courseTitle ?? null,
    bai: p?.lessonRef ?? null,
    loai: p?.type ?? null,
  };
}

async function chayViec(v: Viec, b: Record<string, unknown>): Promise<unknown> {
  const lang = langVao(b.lang);
  switch (v.loai) {
    case 'goi_bai':
      return chayGoiBai(v, b);
    case 'lo_bai':
      return chayLoBai(v, b);
    case 'goc_y_tuong': {
      const moTa = chuoiVao(b.moTa, 4000);
      if (moTa.length < 8) throw new AppError('Mô tả ý tưởng dài thêm chút nữa nhé', 400, 'IDEA_TOO_SHORT');
      const r = await goiAi(v.userId, {
        system: heThongViecNho(lang),
        user: deGocYTuong({ moTa, dinhDang: chuoiVao(b.dinhDang, 120) || 'Vlog', nenTang: chuoiVao(b.nenTang, 120) || 'YouTube', phut: soNguyen(b.phut, 8, 1, 60), giongDieu: chuoiVao(b.giongDieu, 200), lang }),
        maxTokens: 6000, timeoutMs: 150_000, ...theoDoi(v),
      });
      const o = bocJson<{ goc?: unknown[] }>(r.text);
      return { goc: Array.isArray(o.goc) ? o.goc.slice(0, 6) : [] };
    }
    case 'goi_y_tuong': {
      const moTa = chuoiVao(b.moTa, 6000);
      if (moTa.length < 8) throw new AppError('Mô tả ý tưởng dài thêm chút nữa nhé', 400, 'IDEA_TOO_SHORT');
      const dinhDang = chuoiVao(b.dinhDang, 120) || 'Vlog';
      const yc: YeuCauQuay = { lang, phut: soNguyen(b.phut, 8, 1, 60), phongCach: phongCachVao(b.phongCach), ghiChu: chuoiVao(b.ghiChu, 1500) };
      const goc = (b.goc && typeof b.goc === 'object' ? b.goc : null) as Parameters<typeof deGoiYTuong>[0]['goc'];
      const goi = await sinhGoi(v.userId, heThongGoiYTuong(lang), deGoiYTuong({ moTa, dinhDang, nenTang: chuoiVao(b.nenTang, 120) || 'YouTube', goc, yeuCau: yc }), yc.phut, theoDoi(v));
      const nhan = `${dinhDang} · ${goi.tieuDe[0] ?? moTa.slice(0, 60)}`;
      if (b.luu === 'tra_ve') return { goi, banVa: banVaTuGoi(goi, lang, nhan) };
      const tieuDe = (goc?.tieuDe || goi.tieuDe[0] || moTa.split('\n')[0] || 'Video mới').slice(0, 200);
      const luu = await luuGoiThanhDuAn({
        goi, lang, nhan, tieuDe, type: loaiNoiDungVao(b.loaiNoiDung, ContentType.VLOG),
        the: ['y-tuong-ai'], duAnId: soNguyen(b.duAnId, 0, 0, Number.MAX_SAFE_INTEGER) || null,
      });
      return { goi, duAnId: luu.id, taoMoi: luu.taoMoi };
    }
    case 'hook': {
      const r = await goiAi(v.userId, { system: heThongViecNho(lang), user: deHook(await boiCanhDuAn(b)), maxTokens: 5000, timeoutMs: 150_000, ...theoDoi(v) });
      return bocJson(r.text);
    }
    case 'tieu_de': {
      const r = await goiAi(v.userId, { system: heThongViecNho(lang), user: deTieuDe(await boiCanhDuAn(b)), maxTokens: 5000, timeoutMs: 150_000, ...theoDoi(v) });
      return bocJson(r.text);
    }
    case 'shorts': {
      const d = await boiCanhDuAn(b);
      if (!d.kichBan?.trim()) throw new AppError('Dự án chưa có kịch bản để cắt Shorts', 400, 'NO_SCRIPT');
      const r = await goiAi(v.userId, { system: heThongViecNho(lang), user: deShorts(d, lang), maxTokens: 8000, timeoutMs: 200_000, ...theoDoi(v) });
      return bocJson(r.text);
    }
    case 'viet_lai': {
      const doan = typeof b.doan === 'string' ? b.doan : '';
      if (!doan.trim()) throw new AppError('Chưa chọn đoạn cần viết lại', 400, 'NO_TEXT');
      const yeuCau = chuoiVao(b.yeuCau, 1500);
      if (!yeuCau) throw new AppError('Chưa có yêu cầu viết lại', 400, 'NO_INSTRUCTION');
      const r = await goiAi(v.userId, {
        system: heThongViecNho(lang),
        user: deVietLai({ doan, yeuCau, boiCanh: await boiCanhDuAn({ ...b, kichBan: '' }) }),
        maxTokens: Math.min(12_000, 2000 + Math.round(doan.length / 1.5)), timeoutMs: 200_000, ...theoDoi(v),
      });
      const text = (r.text || '').replace(/^```[a-z]*\n?|```$/gi, '').trim();
      if (!text) throw new AppError('AI chưa viết lại được đoạn này', 502, 'AI_EMPTY');
      return { text };
    }
    default:
      throw new AppError('Loại việc không hợp lệ', 400, 'BAD_JOB');
  }
}

/** POST /ai/viec — tạo việc chạy nền, trả `{ viec }` ngay. */
export async function batDauViec(userId: number, body: Record<string, unknown>) {
  donViec();
  const loai = body.loai as LoaiViec;
  if (!(LOAI_VIEC as readonly string[]).includes(loai)) throw new AppError('Loại việc không hợp lệ', 400, 'BAD_JOB');
  const dangChay = [...VIEC.values()].filter((v) => v.userId === userId && v.trangThai === 'chay');
  if (dangChay.length >= TOI_DA_DANG_CHAY) throw new AppError('Đang có 3 việc AI chạy — đợi một việc xong đã nhé.', 429, 'CREATOR_BUSY');
  if (loai === 'lo_bai' && dangChay.some((v) => v.loai === 'lo_bai')) throw new AppError('Đang chạy một lô rồi — đợi lô đó xong hoặc huỷ nó.', 429, 'CREATOR_BATCH_BUSY');

  const v: Viec = { id: randomUUID(), userId, loai, luc: Date.now(), trangThai: 'chay', kyTu: 0, duoi: '' };

  if (loai === 'lo_bai') {
    const ids = Array.isArray(body.lessonIds) ? (body.lessonIds as unknown[]).map((x) => soNguyen(x, 0, 0, Number.MAX_SAFE_INTEGER)).filter(Boolean) : [];
    const duyNhat = Array.from(new Set(ids));
    if (duyNhat.length === 0) throw new AppError('Chưa chọn bài nào', 400, 'NO_LESSONS');
    if (duyNhat.length > TOI_DA_LO) throw new AppError(`Mỗi lô tối đa ${TOI_DA_LO} bài`, 400, 'TOO_MANY_LESSONS');
    const bai = await prisma.lesson.findMany({ where: { id: { in: duyNhat } }, select: { id: true, title: true } });
    const ten = new Map(bai.map((x) => [x.id, chonNgu(x.title, false)]));
    v.lo = duyNhat.filter((id) => ten.has(id)).map((id) => ({ lessonId: id, ten: ten.get(id)!, trangThai: 'cho' as const }));
  }

  VIEC.set(v.id, v);
  chayViec(v, body).then(
    (kq) => {
      v.ketQua = kq;
      v.trangThai = v.huy ? 'huy' : 'xong';
      v.xongLuc = Date.now();
    },
    (e: { message?: string; code?: string; statusCode?: number }) => {
      logger.warn('creatorAi: việc hỏng', { loai, loi: e?.message });
      v.loi = { thongDiep: e?.message || 'AI chưa làm xong việc này', ma: e?.code || 'CREATOR_AI_ERROR', status: e?.statusCode || 502 };
      v.trangThai = 'loi';
      v.xongLuc = Date.now();
    },
  );
  return { viec: v.id };
}

/** GET /ai/viec/:id — hỏi lại. */
export function xemViec(userId: number, id: string) {
  const v = VIEC.get(id);
  if (!v || v.userId !== userId) {
    throw new AppError('Không tìm thấy việc AI này (máy chủ vừa khởi động lại hoặc đã quá 45 phút) — bấm làm lại nhé.', 404, 'CREATOR_JOB_GONE');
  }
  return {
    loai: v.loai,
    trangThai: v.trangThai,
    giay: Math.round(((v.xongLuc ?? Date.now()) - v.luc) / 1000),
    kyTu: v.kyTu,
    duoi: v.trangThai === 'chay' ? v.duoi : '',
    lo: v.lo ?? null,
    ketQua: v.trangThai === 'xong' || v.trangThai === 'huy' ? v.ketQua ?? null : null,
    loi: v.loi ?? null,
  };
}

/** DELETE /ai/viec/:id — huỷ lô (dừng sau bài đang chạy). Việc đơn không huỷ giữa chừng được. */
export function huyViec(userId: number, id: string) {
  const v = VIEC.get(id);
  if (!v || v.userId !== userId) throw new AppError('Không tìm thấy việc AI này', 404, 'CREATOR_JOB_GONE');
  v.huy = true;
  if (v.lo) for (const b of v.lo) if (b.trangThai === 'cho') b.trangThai = 'bo_qua';
  return { huy: true };
}
