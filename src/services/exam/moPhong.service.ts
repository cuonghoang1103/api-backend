/**
 * Phòng thi mô phỏng — phần CSDL (22/11/2026). Mở rộng Exam Room, không phải hệ thống riêng:
 *  - lượt mô phỏng là dòng `exam_attempts` (mode MOCK_EXAM | MOCK_PRACTICE) ⇒ hiện chung tab Lịch sử,
 *    xem lại bằng đúng trang `/exam/attempt/:id` (buildReview rẽ sang `xemLaiMoPhong`);
 *  - lượt cần một `examId` ⇒ đề FE trộn / PE lấy từ Code Lab gắn vào một đề NEO ẩn của môn
 *    (code `__MOCK_FE__` / `__MOCK_PE__`, isPublished=false, không câu hỏi — không hiện ở sảnh);
 *  - PE lấy từ đề PE của Exam Room gắn thẳng `examId` của đề đó (lượt STANDARD của đề không bị ảnh
 *    hưởng: startAttempt/listExamsForCourse chỉ nhìn mode STANDARD).
 *
 * KHÔNG chạy mã người học trên máy chủ. Chấm PE tự động chỉ có khi đề lấy từ Code Lab có máy chấm
 * TRÌNH DUYỆT (iframe sandbox ở máy người học — cùng cơ chế Code Lab); máy chủ kiểm hình dạng kết quả
 * rồi tính điểm (`chuanHoaKetQuaClient` + `tinhDiem`). Còn lại: checklist tự chấm + AI nhận xét TĨNH.
 */
import AdmZip from 'adm-zip';
import { prisma } from '../../config/database.js';
import { putObject } from '../../config/r2.js';
import { AppError } from '../../middleware/errorHandler.js';
import { chuanHoaKetQuaClient, coMayChamTrinhDuyet, testsDayDu, tinhDiem } from '../codeLab.cham.js';
import { nhanXetTinhPe, NHAN_XET_TINH_TRAN_MA } from '../exam.grading.service.js';
import { cauHinhMon, MO_PHONG_MON, type CauHinhMonMoPhong } from './moPhongConfig.js';
import {
  bocDe, chamPaperFe, chuongTuTieuDe, diemTuCham, idCauQuiz, khuTrung, kiemTenTepZip, locTraLoi, NHOM_KHAC,
  quizSangCau, thongKe, type CauNganHang, type CauPaper, type NguonNganHang, type PaperFe, type PaperPe,
} from './moPhong.js';

export const MODE_STANDARD = 'STANDARD';
export const MODE_THI = 'MOCK_EXAM';
export const MODE_LUYEN = 'MOCK_PRACTICE';
const MODES_MO_PHONG = [MODE_THI, MODE_LUYEN];

/** Ân hạn khi nộp sau giờ (mạng chậm, đồng hồ máy lệch). */
const AN_HAN_MS = 90_000;
/** Zip PE: trần như phòng thi thật hay dùng — dự án React không node_modules chỉ vài trăm KB. */
export const ZIP_TRAN_BYTE = 20 * 1024 * 1024;
const ZIP_TRAN_GIAI_NEN = 60 * 1024 * 1024;
const ZIP_TRAN_TEP = 4000;
/** AI nhận xét tĩnh: số lượt mỗi người mỗi ngày (0 = tắt). */
const AI_LUOT_NGAY = () => Math.max(0, Number(process.env.EXAM_MO_PHONG_AI_NGAY ?? 3) || 0);

const num = (v: unknown) => (v == null ? 0 : Number(v));
const laMoPhong = (mode: string | null | undefined) => !!mode && MODES_MO_PHONG.includes(mode);

// ── Môn & đề neo ──────────────────────────────────────────────────────
async function layMon(courseCode: string) {
  const cfg = cauHinhMon(courseCode);
  if (!cfg) throw new AppError('Môn này chưa có phòng thi mô phỏng', 404);
  const course = await prisma.course.findFirst({
    where: { courseCode: cfg.courseCode, academyType: 'FPT' },
    select: { id: true, title: true, slug: true, courseCode: true },
  });
  if (!course) throw new AppError('Không tìm thấy môn học', 404);
  return { cfg, course };
}

async function layDeNeo(courseId: number, kind: 'FE' | 'PE', courseCode: string) {
  const code = kind === 'FE' ? '__MOCK_FE__' : '__MOCK_PE__';
  const co = await prisma.exam.findFirst({ where: { courseId, kind, code }, select: { id: true } });
  if (co) return co.id;
  const tao = await prisma.exam.create({
    data: {
      courseId, kind, code, peType: kind === 'PE' ? 'CODE' : null,
      title: kind === 'FE'
        ? `${courseCode} — Mock FE (mixed from the bank)|||${courseCode} — Đề FE mô phỏng (trộn từ ngân hàng)`
        : `${courseCode} — Mock PE|||${courseCode} — Đề PE mô phỏng`,
      description: 'Anchor for mock attempts — never published.|||Đề neo cho lượt mô phỏng — không bao giờ công khai.',
      isPublished: false, source: 'SAMPLE', sortOrder: 9999,
    },
    select: { id: true },
  });
  return tao.id;
}

// ── Ngân hàng câu FE ─────────────────────────────────────────────────
export async function layNganHang(courseId: number) {
  const sections = await prisma.courseSection.findMany({ where: { courseId }, select: { id: true, title: true, sortOrder: true } });
  const sec = new Map(sections.map((s) => [s.id, s]));
  const nhomCua = (sectionId: number | null) => {
    const s = sectionId != null ? sec.get(sectionId) : undefined;
    if (!s) return { nhom: NHOM_KHAC, nhomTen: 'Unclassified (real-exam mix)|||Chưa phân chương (câu đề thật)', chuong: null, thuTu: 9999 };
    return { nhom: `s${s.id}`, nhomTen: s.title, chuong: chuongTuTieuDe(s.title), thuTu: s.sortOrder };
  };

  const that = await prisma.examQuestion.findMany({
    where: { kind: 'MCQ', exam: { courseId, kind: 'FE', isPublished: true } },
    select: { id: true, prompt: true, imageUrl: true, options: true, correctIndexes: true, explanation: true, sectionId: true },
    orderBy: [{ examId: 'asc' }, { sortOrder: 'asc' }],
  });
  const cauThat: CauNganHang[] = [];
  const trongSo: Record<string, number> = {};
  let daPhan = 0;
  for (const q of that) {
    const opts = Array.isArray(q.options) ? (q.options as Array<{ text?: string }>).map((o) => ({ text: String(o?.text ?? '') })) : [];
    if (opts.length < 2 || !q.correctIndexes?.length) continue;
    const m = nhomCua(q.sectionId);
    trongSo[m.nhom] = (trongSo[m.nhom] ?? 0) + 1;
    if (m.nhom !== NHOM_KHAC) daPhan += 1;
    cauThat.push({ id: q.id, nguon: 'DE_THAT', prompt: q.prompt, imageUrl: q.imageUrl, options: opts, correctIndexes: q.correctIndexes, explanation: q.explanation, ...m });
  }

  // Quiz chương Academy — chỉ chương đánh số ("Chapter N"): Mục 0, Progress Test, Nâng cao, ôn thi bỏ qua.
  const chuong = sections.filter((s) => chuongTuTieuDe(s.title) != null);
  const quizLessons = chuong.length
    ? await prisma.lesson.findMany({
      where: { sectionId: { in: chuong.map((s) => s.id) }, lessonType: 'QUIZ' },
      select: { id: true, sectionId: true, details: { select: { quizData: true } } },
    })
    : [];
  const cauQuiz: CauNganHang[] = [];
  for (const l of quizLessons) {
    const qs = (l.details?.quizData as { questions?: unknown } | null)?.questions;
    if (!Array.isArray(qs)) continue;
    const m = nhomCua(l.sectionId);
    qs.forEach((q, i) => {
      const c = q && typeof q === 'object' ? quizSangCau(q as Record<string, unknown>, { idAm: idCauQuiz(l.id, i), ...m }) : null;
      if (c) cauQuiz.push(c);
    });
  }

  return {
    cauThat, cauQuiz, trongSoThat: trongSo,
    nguonPhanBo: (daPhan > 0 ? 'DE_THAT' : 'DEU') as 'DE_THAT' | 'DEU',
    sections,
  };
}

function chonNganHang(nh: Awaited<ReturnType<typeof layNganHang>>, nguon: NguonNganHang, nhomChon?: string[]) {
  let cau = nguon === 'real' ? nh.cauThat : nguon === 'quiz' ? nh.cauQuiz : [...nh.cauThat, ...nh.cauQuiz];
  cau = khuTrung(cau);
  if (nhomChon?.length) cau = cau.filter((c) => nhomChon.includes(c.nhom));
  // Trọng số theo đề thật; chưa có câu thật nào phân chương ⇒ theo SỐ CÂU ngân hàng mỗi nhóm (các chương
  // ngang nhau vì mỗi chương có bộ quiz cỡ tương đương; câu đề thật chưa phân chương thành một nhóm riêng
  // nên vẫn chiếm phần tương xứng — chia đều theo nhóm thì 200 câu đề thật chỉ còn 1/13 đề).
  const trongSo: Record<string, number> = {};
  const demNhom: Record<string, number> = {};
  for (const c of cau) demNhom[c.nhom] = (demNhom[c.nhom] ?? 0) + 1;
  const nhom = Object.keys(demNhom);
  for (const k of nhom) trongSo[k] = nh.nguonPhanBo === 'DE_THAT' ? (nh.trongSoThat[k] ?? 0) : demNhom[k];
  // Nhóm chỉ có câu quiz (đề thật chưa từng ra) vẫn được ít nhất một phần nhỏ khi người học tự chọn nhóm.
  if (nhomChon?.length) for (const k of nhom) if (!trongSo[k]) trongSo[k] = 1;
  return { cau, trongSo };
}

// ── Tổng quan cho trang sảnh mô phỏng ────────────────────────────────
export async function tongQuan(courseCode: string, userId?: number) {
  const { cfg, course } = await layMon(courseCode);
  const nh = await layNganHang(course.id);
  const tatCa = khuTrung([...nh.cauThat, ...nh.cauQuiz]);
  const nhom = new Map<string, { nhom: string; ten: string; chuong: number | null; thuTu: number; deThat: number; nganHang: number; quiz: number }>();
  for (const c of tatCa) {
    const a = nhom.get(c.nhom) ?? { nhom: c.nhom, ten: c.nhomTen, chuong: c.chuong, thuTu: c.thuTu, deThat: nh.trongSoThat[c.nhom] ?? 0, nganHang: 0, quiz: 0 };
    a.nganHang += 1; if (c.nguon === 'QUIZ') a.quiz += 1;
    nhom.set(c.nhom, a);
  }

  const dePe = await prisma.exam.findMany({
    where: { courseId: course.id, kind: 'PE', isPublished: true },
    select: { id: true, code: true, title: true, durationMinutes: true, attachmentUrl: true, _count: { select: { questions: true } } },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  });
  const peCodeLab = await prisma.codeExercise.findMany({
    where: { kind: 'pe', status: 'PUBLISHED', track: { slug: `${cfg.courseCode.toLowerCase()}-practice`, status: 'PUBLISHED' } },
    select: { id: true, slug: true, title: true, estimatedMinutes: true, gradeKind: true, testsJson: true },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  });

  let dangDo: Array<{ id: number; mode: string; loai: string; tieuDe: string; startedAt: Date; expiresAt: Date | null }> = [];
  if (userId) {
    const rows = await prisma.examAttempt.findMany({
      where: { userId, status: 'IN_PROGRESS', mode: { in: MODES_MO_PHONG }, exam: { courseId: course.id } },
      select: { id: true, mode: true, startedAt: true, expiresAt: true, paper: true },
      orderBy: { id: 'desc' }, take: 10,
    });
    dangDo = rows.map((r) => {
      const p = r.paper as { loai?: string; title?: string; cau?: unknown[] } | null;
      return { id: r.id, mode: r.mode, loai: p?.loai ?? 'FE', tieuDe: p?.loai === 'PE' ? String(p.title ?? '') : `FE · ${Array.isArray(p?.cau) ? p!.cau.length : 0}`, startedAt: r.startedAt, expiresAt: r.expiresAt };
    });
  }

  return {
    courseCode: cfg.courseCode,
    course: { id: course.id, title: course.title, slug: course.slug },
    fe: cfg.fe,
    pe: cfg.pe,
    cloTen: cfg.cloTen,
    cloTheoChuong: cfg.cloTheoChuong,
    huongDanMoiTruong: cfg.huongDanMoiTruong,
    nganHang: {
      deThat: nh.cauThat.length,
      quiz: nh.cauQuiz.length,
      sauKhuTrung: tatCa.length,
      nguonPhanBo: nh.nguonPhanBo,
      nhom: [...nhom.values()].sort((a, b) => a.thuTu - b.thuTu),
    },
    dePe: [
      ...peCodeLab.map((e) => ({
        nguon: 'CODELAB' as const, id: e.id, slug: e.slug, tieuDe: e.title, phut: e.estimatedMinutes || cfg.pe.phut,
        coGiven: true, coMayCham: coMayChamTrinhDuyet(e.testsJson, e.gradeKind), soCau: null as number | null,
      })),
      ...dePe.map((e) => ({
        nguon: 'EXAM' as const, id: e.id, slug: null as string | null, tieuDe: e.title, phut: e.durationMinutes,
        coGiven: !!e.attachmentUrl, coMayCham: false, soCau: e._count.questions as number | null, code: e.code,
      })),
    ],
    dangDo,
  };
}

// ── FE: tạo đề trộn ───────────────────────────────────────────────────
export interface TuyChonFe { soCau?: number; phut?: number; cheDo?: 'thi' | 'luyen'; nguon?: NguonNganHang; nhom?: string[] }

export async function batDauFe(userId: number, courseCode: string, o: TuyChonFe, rand: () => number = Math.random) {
  const { cfg, course } = await layMon(courseCode);
  const soCau = Math.min(Math.max(Math.floor(Number(o.soCau) || cfg.fe.soCau), 5), 100);
  const phut = Math.min(Math.max(Math.floor(Number(o.phut) || cfg.fe.phut), 5), 180);
  const cheDo = o.cheDo === 'luyen' ? 'luyen' : 'thi';
  const nguon: NguonNganHang = o.nguon === 'real' || o.nguon === 'quiz' ? o.nguon : 'mix';
  const nhomChon = Array.isArray(o.nhom) ? o.nhom.map(String).filter((x) => /^(s\d+|khac)$/.test(x)).slice(0, 40) : undefined;

  const nh = await layNganHang(course.id);
  const { cau, trongSo } = chonNganHang(nh, nguon, nhomChon);
  if (cau.length < 3) throw new AppError('Ngân hàng chưa đủ câu cho lựa chọn này (cần ít nhất 3 câu).', 400);
  const boc = bocDe(cau, trongSo, soCau, rand);
  const paper: PaperFe = {
    loai: 'FE', courseCode: cfg.courseCode, nguonNganHang: nguon,
    nguonPhanBo: nh.nguonPhanBo, phanBo: boc.phanBo,
    thangDiem: cfg.fe.thangDiem, diemDat: cfg.fe.diemDat,
    cau: boc.cau.map((c): CauPaper => ({ ...c, clo: c.chuong != null ? (cfg.cloTheoChuong[c.chuong] ?? []) : [], points: 1 })),
  };
  const examId = await layDeNeo(course.id, 'FE', cfg.courseCode);
  const now = Date.now();
  const a = await prisma.examAttempt.create({
    data: {
      userId, examId, status: 'IN_PROGRESS', startedAt: new Date(now),
      expiresAt: cheDo === 'thi' ? new Date(now + phut * 60_000) : null,
      answers: {}, gradingMode: 'AUTO',
      mode: cheDo === 'thi' ? MODE_THI : MODE_LUYEN,
      paper: paper as object,
      progress: { flags: [], idx: 0, daKiem: [] },
    },
    select: { id: true },
  });
  return { attemptId: a.id, soCau: paper.cau.length, phanBo: paper.phanBo, nguonPhanBo: paper.nguonPhanBo };
}

async function layLuotMoPhong(attemptId: number, userId: number) {
  const a = await prisma.examAttempt.findUnique({ where: { id: attemptId } });
  if (!a || a.userId !== userId) throw new AppError('Không tìm thấy bài thi', 404);
  if (!laMoPhong(a.mode) || !a.paper) throw new AppError('Đây không phải lượt thi mô phỏng', 400);
  return a;
}

type Progress = { flags?: number[]; idx?: number; daKiem?: number[]; [k: string]: unknown };

/** Câu cho lúc làm bài: ẩn đáp án (luyện: câu đã kiểm thì kèm đáp án + giải thích). */
function cauDeLam(paper: PaperFe, daKiem: Set<number>) {
  return paper.cau.map((c) => ({
    id: c.id, prompt: c.prompt, imageUrl: c.imageUrl, options: c.options,
    selectCount: Math.max(1, c.correctIndexes.length), multiSelect: c.correctIndexes.length > 1,
    nhomTen: c.nhomTen, chuong: c.chuong,
    ...(daKiem.has(c.id) ? { correctIndexes: c.correctIndexes, explanation: c.explanation } : {}),
  }));
}

export async function layDeFe(attemptId: number, userId: number) {
  let a = await layLuotMoPhong(attemptId, userId);
  const paper = a.paper as unknown as PaperFe;
  if (paper.loai !== 'FE') throw new AppError('Lượt này là PE', 400);
  // Hết giờ mà chưa nộp ⇒ máy chủ tự nộp bằng bài đã tự lưu (như phòng thi thật thu bài).
  if (a.status === 'IN_PROGRESS' && a.expiresAt && Date.now() > a.expiresAt.getTime() + AN_HAN_MS) {
    await chotFe(a.id, paper, (a.answers ?? {}) as Record<string, number[]>, { tuNop: 'may-chu' }, Math.floor((a.expiresAt.getTime() - a.startedAt.getTime()) / 1000));
    a = await layLuotMoPhong(attemptId, userId);
  }
  const progress = (a.progress ?? {}) as Progress;
  return {
    attempt: {
      id: a.id, mode: a.mode, status: a.status, startedAt: a.startedAt, expiresAt: a.expiresAt, serverNow: new Date(),
    },
    paper: { courseCode: paper.courseCode, thangDiem: paper.thangDiem, diemDat: paper.diemDat, phanBo: paper.phanBo, nguonPhanBo: paper.nguonPhanBo, nguonNganHang: paper.nguonNganHang },
    questions: cauDeLam(paper, new Set((progress.daKiem ?? []).map(Number))),
    answers: (a.answers ?? {}) as Record<string, number[]>,
    progress: { flags: (progress.flags ?? []).map(Number), idx: Number(progress.idx) || 0 },
  };
}

/** Tự lưu giữa giờ — dùng chung cho lượt STANDARD (đề cố định) lẫn lượt mô phỏng FE. */
export async function luuTienDo(attemptId: number, userId: number, body: { answers?: unknown; codeAnswers?: unknown; flags?: unknown; idx?: unknown }) {
  const a = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: { exam: { select: { kind: true, questions: { select: { id: true, kind: true, options: true } } } } },
  });
  if (!a || a.userId !== userId) throw new AppError('Không tìm thấy bài thi', 404);
  if (a.status !== 'IN_PROGRESS') throw new AppError('Bài thi đã nộp rồi', 409);
  if (a.expiresAt && Date.now() > a.expiresAt.getTime() + AN_HAN_MS) throw new AppError('Đã hết giờ làm bài', 409);

  const paper = a.paper as unknown as PaperFe | PaperPe | null;
  if (paper && paper.loai === 'PE') throw new AppError('Lượt PE không tự lưu đáp án', 400);
  const cau = paper ? paper.cau.map((c) => ({ id: c.id, options: c.options })) : a.exam.questions.filter((q) => q.kind === 'MCQ').map((q) => ({ id: q.id, options: Array.isArray(q.options) ? q.options as unknown[] : [] }));
  let answers: Record<string, unknown> = locTraLoi(cau, body.answers);
  // Luyện: câu đã "Kiểm tra" thì khoá đáp án — không đổi được sau khi đã xem đúng/sai.
  const progressCu = (a.progress ?? {}) as Progress;
  if (a.mode === MODE_LUYEN) {
    const cu = (a.answers ?? {}) as Record<string, number[]>;
    for (const id of progressCu.daKiem ?? []) if (cu[String(id)]) answers[String(id)] = cu[String(id)];
  }
  // Câu lập trình trong đề Progress Test (lượt STANDARD): giữ code đang gõ (trần 20k ký tự/câu).
  if (!paper && body.codeAnswers && typeof body.codeAnswers === 'object') {
    const codeIds = new Set(a.exam.questions.filter((q) => q.kind === 'CODE').map((q) => String(q.id)));
    for (const [k, v] of Object.entries(body.codeAnswers as Record<string, unknown>)) {
      if (codeIds.has(k) && typeof v === 'string') answers = { ...answers, [k]: v.slice(0, 20_000) };
    }
  }
  const idsHopLe = new Set(cau.map((c) => c.id));
  const flags = Array.isArray(body.flags) ? [...new Set(body.flags.map(Number).filter((x) => idsHopLe.has(x) || (!paper && Number.isInteger(x))))].slice(0, 200) : progressCu.flags ?? [];
  const idx = Math.max(0, Math.min(500, Math.floor(Number(body.idx) || 0)));
  await prisma.examAttempt.update({
    where: { id: attemptId },
    data: { answers: answers as object, progress: { ...progressCu, flags, idx, savedAt: new Date().toISOString() } as object },
  });
  return { savedAt: new Date() };
}

/** Bài đã tự lưu của một lượt STANDARD (để "Tiếp tục bài thi" không mất đáp án). */
export async function baiDaLuu(attemptId: number) {
  const a = await prisma.examAttempt.findUnique({ where: { id: attemptId }, select: { answers: true, progress: true } });
  const p = (a?.progress ?? {}) as Progress;
  return { answers: (a?.answers ?? {}) as Record<string, unknown>, flags: (p.flags ?? []).map(Number), idx: Number(p.idx) || 0 };
}

/** Chế độ luyện: kiểm MỘT câu ngay (khoá đáp án câu đó, trả đáp án + giải thích). */
export async function kiemCauLuyen(attemptId: number, userId: number, questionId: number, selectedRaw: unknown) {
  const a = await layLuotMoPhong(attemptId, userId);
  if (a.mode !== MODE_LUYEN) throw new AppError('Chỉ chế độ luyện mới xem đáp án từng câu', 403);
  if (a.status !== 'IN_PROGRESS') throw new AppError('Bài đã nộp', 409);
  const paper = a.paper as unknown as PaperFe;
  const c = paper.cau.find((x) => x.id === questionId);
  if (!c) throw new AppError('Không có câu này trong đề', 404);
  const answers = (a.answers ?? {}) as Record<string, number[]>;
  const progress = (a.progress ?? {}) as Progress;
  const daKiem = new Set((progress.daKiem ?? []).map(Number));
  let selected = answers[String(questionId)] ?? [];
  if (!daKiem.has(questionId)) {
    selected = locTraLoi([{ id: c.id, options: c.options }], { [String(c.id)]: selectedRaw })[String(c.id)] ?? [];
    if (!selected.length) throw new AppError('Chọn đáp án trước khi kiểm tra', 400);
    daKiem.add(questionId);
    await prisma.examAttempt.update({
      where: { id: a.id },
      data: { answers: { ...answers, [String(questionId)]: selected } as object, progress: { ...progress, daKiem: [...daKiem] } as object },
    });
  }
  const correct = chamPaperFe({ ...paper, cau: [c] }, { [String(c.id)]: selected }).correctCount === 1;
  return { questionId, selected, correct, correctIndexes: c.correctIndexes, explanation: c.explanation };
}

async function chotFe(attemptId: number, paper: PaperFe, answers: Record<string, number[]>, integrity: unknown, timeSpentSeconds: number) {
  const traLoi = locTraLoi(paper.cau.map((c) => ({ id: c.id, options: c.options })), answers);
  const kq = chamPaperFe(paper, traLoi);
  const dungTheoId = new Map(kq.perQuestion.map((p) => [p.questionId, p.correct]));
  const tk = thongKe(paper.cau.map((c) => ({ nhom: c.nhom, nhomTen: c.nhomTen, thuTu: c.thuTu, clo: c.clo, dung: !!dungTheoId.get(c.id) })));
  await prisma.examAttempt.update({
    where: { id: attemptId },
    data: {
      status: 'GRADED', submittedAt: new Date(),
      timeSpentSeconds: Math.max(0, Math.floor(timeSpentSeconds)),
      score: kq.score, maxScore: paper.thangDiem, passed: kq.passed,
      answers: traLoi as object,
      feedback: { perQuestion: kq.perQuestion, correctCount: kq.correctCount, total: kq.total, thongKe: tk } as object,
      integritySignals: (integrity ?? undefined) as object | undefined,
    },
  });
}

export async function nopFe(attemptId: number, userId: number, body: { answers?: unknown; timeSpentSeconds?: unknown; integritySignals?: unknown }) {
  const a = await layLuotMoPhong(attemptId, userId);
  if (a.status !== 'IN_PROGRESS') throw new AppError('Bài thi đã nộp rồi', 409);
  const paper = a.paper as unknown as PaperFe;
  if (paper.loai !== 'FE') throw new AppError('Lượt này là PE', 400);
  // Quá giờ + ân hạn ⇒ chỉ nhận bản đã tự lưu (không nhận đáp án sửa sau giờ).
  const quaGio = !!a.expiresAt && Date.now() > a.expiresAt.getTime() + AN_HAN_MS;
  let answers = (quaGio ? a.answers : body.answers ?? a.answers) as Record<string, number[]>;
  if (a.mode === MODE_LUYEN) {
    const cu = (a.answers ?? {}) as Record<string, number[]>;
    const daKiem = ((a.progress ?? {}) as Progress).daKiem ?? [];
    answers = { ...(answers ?? {}) };
    for (const id of daKiem) if (cu[String(id)]) answers[String(id)] = cu[String(id)];
  }
  const tg = Math.floor(Number(body.timeSpentSeconds) || (Date.now() - a.startedAt.getTime()) / 1000);
  const sig = body.integritySignals && typeof body.integritySignals === 'object' ? { ...(body.integritySignals as object), ...(quaGio ? { quaGio: true } : {}) } : (quaGio ? { quaGio: true } : undefined);
  await chotFe(a.id, paper, answers ?? {}, sig, tg);
  return { attemptId: a.id };
}

// ── Xem lại (gọi từ exam.service.buildReview khi lượt có paper) ──────
export function xemLaiMoPhong(attempt: {
  id: number; examId: number; status: string; startedAt: Date; submittedAt: Date | null; timeSpentSeconds: number;
  score: unknown; maxScore: unknown; passed: boolean | null; gradingMode: string; feedback: unknown; answers: unknown; mode: string; paper: unknown;
}, examHeader: Record<string, unknown>) {
  const paper = attempt.paper as PaperFe | PaperPe;
  const answers = (attempt.answers ?? {}) as Record<string, unknown>;
  const feedback = (attempt.feedback ?? {}) as Record<string, unknown>;
  const daNop = attempt.status !== 'IN_PROGRESS';
  const cfg = cauHinhMon(paper.courseCode);
  const base = {
    attempt: {
      id: attempt.id, examId: attempt.examId, status: attempt.status,
      startedAt: attempt.startedAt, submittedAt: attempt.submittedAt, timeSpentSeconds: attempt.timeSpentSeconds,
      score: attempt.score == null ? null : num(attempt.score), maxScore: attempt.maxScore == null ? null : num(attempt.maxScore),
      passed: attempt.passed, gradingMode: attempt.gradingMode, feedback,
    },
    mock: { mode: attempt.mode, loai: paper.loai, courseCode: paper.courseCode, cloTen: cfg?.cloTen ?? {} },
    examBookmarked: false,
  };
  if (paper.loai === 'FE') {
    return {
      ...base,
      exam: { ...examHeader, code: null, title: `${paper.courseCode} — Mock FE · ${paper.cau.length} questions|||${paper.courseCode} — FE mô phỏng · ${paper.cau.length} câu`, totalPoints: paper.thangDiem, passMark: paper.diemDat, kind: 'FE' },
      chapterStats: (feedback.thongKe as unknown) ?? null,
      questions: paper.cau.map((c, i) => ({
        id: c.id, kind: 'MCQ', sortOrder: i, points: c.points, prompt: c.prompt, imageUrl: c.imageUrl,
        options: c.options,
        correctIndexes: daNop ? c.correctIndexes : [],
        explanation: daNop ? c.explanation : null,
        language: null, starterCode: null, sampleSolution: null, expectedOutput: null, rubric: null, speakingPrompts: null,
        myAnswer: answers[String(c.id)] ?? null,
        // Câu quiz Academy không có dòng ExamQuestion (id âm) ⇒ không lưu sổ tay / bình luận được.
        bookmarked: false, bookmarkNote: null, canSave: c.id > 0,
        chapter: { key: c.nhom, title: c.nhomTen, clo: c.clo }, source: c.nguon,
      })),
    };
  }
  return {
    ...base,
    exam: { ...examHeader, title: paper.title, code: paper.code, totalPoints: paper.thangDiem, passMark: paper.diemDat, kind: 'PE', peType: 'CODE' },
    chapterStats: null,
    questions: paper.cau.map((c, i) => ({
      id: c.id, kind: 'CODE', sortOrder: i, points: c.points, prompt: c.prompt, imageUrl: c.imageUrl,
      options: null, correctIndexes: [], explanation: null, language: 'javascript', starterCode: null,
      sampleSolution: daNop ? c.sampleSolution : null, expectedOutput: null, rubric: c.rubric, speakingPrompts: null,
      myAnswer: null, bookmarked: false, bookmarkNote: null, canSave: false,
    })),
  };
}

/** Thống kê chương/CLO cho lượt FE STANDARD (đề thật) — từ sectionId của câu. */
export function thongKeDeThat(
  questions: Array<{ id: number; kind: string; sectionId: number | null }>,
  perQuestion: Array<{ questionId: number; correct?: boolean }>,
  sections: Array<{ id: number; title: string; sortOrder: number }>,
  courseCode: string | null,
) {
  const cfg = cauHinhMon(courseCode);
  const sec = new Map(sections.map((s) => [s.id, s]));
  const dung = new Map(perQuestion.map((p) => [p.questionId, !!p.correct]));
  const items = questions.filter((q) => q.kind === 'MCQ').map((q) => {
    const s = q.sectionId != null ? sec.get(q.sectionId) : undefined;
    const ch = s ? chuongTuTieuDe(s.title) : null;
    return {
      nhom: s ? `s${s.id}` : NHOM_KHAC,
      nhomTen: s?.title ?? 'Unclassified|||Chưa phân chương',
      thuTu: s?.sortOrder ?? 9999,
      clo: ch != null && cfg ? cfg.cloTheoChuong[ch] ?? [] : [],
      dung: !!dung.get(q.id),
    };
  });
  if (!items.some((i) => i.nhom !== NHOM_KHAC)) return null;
  return thongKe(items);
}

// ── Lịch sử + tiến bộ ─────────────────────────────────────────────────
export async function lichSu(courseCode: string, userId: number) {
  const { cfg, course } = await layMon(courseCode);
  const rows = await prisma.examAttempt.findMany({
    where: { userId, status: { in: ['GRADED', 'SUBMITTED', 'EXPIRED'] }, aiAssisted: false, exam: { courseId: course.id } },
    select: { id: true, mode: true, status: true, score: true, maxScore: true, passed: true, submittedAt: true, timeSpentSeconds: true, feedback: true, exam: { select: { kind: true, code: true, title: true } }, paper: true },
    orderBy: { id: 'desc' }, take: 60,
  });
  const luot = rows.map((r) => {
    const p = r.paper as { loai?: string; title?: string; cau?: unknown[] } | null;
    const kind = p?.loai ?? r.exam.kind;
    return {
      id: r.id, mode: r.mode, kind, status: r.status,
      score: r.score == null ? null : num(r.score), maxScore: r.maxScore == null ? null : num(r.maxScore), passed: r.passed,
      at: r.submittedAt, timeSpentSeconds: r.timeSpentSeconds,
      tieuDe: p ? (p.loai === 'PE' ? String(p.title ?? '') : `Mock FE · ${Array.isArray(p.cau) ? p.cau.length : 0}`) : r.exam.title,
      code: r.exam.code,
    };
  }).reverse();

  // Điểm yếu theo chương: cộng dồn thống kê của ≤ 10 lượt FE mô phỏng gần nhất.
  const gop = new Map<string, { khoa: string; ten: string; dung: number; tong: number; thuTu: number }>();
  const gopClo = new Map<string, { khoa: string; ten: string; dung: number; tong: number; thuTu: number }>();
  let dem = 0;
  for (const r of rows) {
    const tk = (r.feedback as { thongKe?: { theoChuong?: Array<{ khoa: string; ten: string; dung: number; tong: number; thuTu: number }>; theoClo?: Array<{ khoa: string; ten: string; dung: number; tong: number; thuTu: number }> } } | null)?.thongKe;
    if (!tk?.theoChuong) continue;
    if (++dem > 10) break;
    for (const [m, ds] of [[gop, tk.theoChuong], [gopClo, tk.theoClo ?? []]] as const) {
      for (const x of ds) {
        const a = m.get(x.khoa) ?? { khoa: x.khoa, ten: x.ten, dung: 0, tong: 0, thuTu: x.thuTu };
        a.dung += x.dung; a.tong += x.tong; m.set(x.khoa, a);
      }
    }
  }
  const xong = (m: typeof gop) => [...m.values()].map((x) => ({ ...x, tiLe: x.tong ? Math.round((x.dung / x.tong) * 100) : 0 })).sort((a, b) => a.thuTu - b.thuTu);
  return { courseCode: cfg.courseCode, diemDatFe: cfg.fe.diemDat, diemDatPe: cfg.pe.diemDat, luot, theoChuong: xong(gop), theoClo: xong(gopClo), soLuotGop: Math.min(dem, 10) };
}

// ── PE ────────────────────────────────────────────────────────────────
type RubricRaw = Array<{ id?: string; criterion?: string; maxScore?: number; weight?: number }>;

function rubricChuan(r: unknown, points: number): Array<{ id: string; criterion: string; maxScore: number }> {
  const ds = Array.isArray(r) ? (r as RubricRaw) : [];
  const out = ds.map((c, i) => ({ id: String(c.id ?? `c${i + 1}`), criterion: String(c.criterion ?? ''), maxScore: Math.max(0, Number(c.maxScore ?? c.weight ?? 1) || 0) }))
    .filter((c) => c.criterion && c.maxScore > 0);
  return out.length ? out : [{ id: 'all', criterion: 'The question works as the paper describes|||Câu này chạy đúng như đề mô tả', maxScore: points }];
}

export async function batDauPe(userId: number, courseCode: string, o: { examId?: unknown; exerciseId?: unknown; cheDo?: unknown }) {
  const { cfg, course } = await layMon(courseCode);
  const cheDo = o.cheDo === 'luyen' ? 'luyen' : 'thi';
  let paper: PaperPe;
  let examId: number;
  if (o.exerciseId != null) {
    const e = await prisma.codeExercise.findFirst({
      where: { id: Number(o.exerciseId), kind: 'pe', status: 'PUBLISHED', track: { slug: `${cfg.courseCode.toLowerCase()}-practice` } },
      select: { id: true, slug: true, title: true, problemHtml: true, problemHtmlVi: true, estimatedMinutes: true, starterCodeJson: true, testsJson: true, gradeKind: true, solutionCodeJson: true },
    });
    if (!e) throw new AppError('Không tìm thấy đề PE', 404);
    const tj = (e.testsJson ?? {}) as { thangDiem?: Array<{ ma?: string; ten?: string; diem?: number; moTa?: string }>; jsonServer?: { db?: unknown } };
    const rubric = (tj.thangDiem ?? []).map((t) => ({ id: String(t.ma ?? ''), criterion: String(t.ten ?? t.ma ?? '') + (t.moTa ? ` — ${t.moTa}` : ''), maxScore: Number(t.diem) || 0 })).filter((t) => t.id && t.maxScore > 0);
    const tongDiem = rubric.reduce((s, r) => s + r.maxScore, 0) || cfg.pe.thangDiem;
    const prompt = `<div class="ml-en">${e.problemHtml ?? ''}</div><div class="ml-vi">${e.problemHtmlVi || e.problemHtml || ''}</div>`;
    const files = Array.isArray(e.starterCodeJson) ? (e.starterCodeJson as Array<{ name?: string; code?: string }>).map((f) => ({ name: String(f.name ?? ''), code: String(f.code ?? '') })).filter((f) => f.name) : [];
    const loiGiai = Array.isArray(e.solutionCodeJson) ? (e.solutionCodeJson as Array<{ name?: string; code?: string }>).map((f) => `// ===== ${f.name} =====\n${f.code ?? ''}`).join('\n\n') : null;
    paper = {
      loai: 'PE', courseCode: cfg.courseCode, nguon: 'CODELAB', examId: null, exerciseId: e.id, exerciseSlug: e.slug,
      title: e.title, code: null, durationMinutes: e.estimatedMinutes || cfg.pe.phut,
      thangDiem: cfg.pe.thangDiem, diemDat: cfg.pe.diemDat, attachmentUrl: null, attachmentName: `${e.slug}-given.zip`,
      given: { files, db: tj.jsonServer?.db ?? null },
      coMayCham: coMayChamTrinhDuyet(e.testsJson, e.gradeKind),
      cau: [{ id: 1, prompt, points: tongDiem, imageUrl: null, rubric: rubric.length ? rubric : rubricChuan(null, tongDiem), sampleSolution: loiGiai || null }],
    };
    examId = await layDeNeo(course.id, 'PE', cfg.courseCode);
  } else {
    const ex = await prisma.exam.findFirst({
      where: { id: Number(o.examId), courseId: course.id, kind: 'PE', isPublished: true },
      include: { questions: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] } },
    });
    if (!ex) throw new AppError('Không tìm thấy đề PE', 404);
    paper = {
      loai: 'PE', courseCode: cfg.courseCode, nguon: 'EXAM', examId: ex.id, exerciseId: null, exerciseSlug: null,
      title: ex.title, code: ex.code, durationMinutes: ex.durationMinutes || cfg.pe.phut,
      thangDiem: num(ex.totalPoints) || cfg.pe.thangDiem, diemDat: num(ex.passMark) || cfg.pe.diemDat,
      attachmentUrl: ex.attachmentUrl, attachmentName: ex.attachmentName, given: null, coMayCham: false,
      cau: ex.questions.map((q) => ({ id: q.id, prompt: q.prompt, points: num(q.points), imageUrl: q.imageUrl, rubric: rubricChuan(q.rubric, num(q.points)), sampleSolution: q.sampleSolution })),
    };
    examId = ex.id;
  }
  const now = Date.now();
  const a = await prisma.examAttempt.create({
    data: {
      userId, examId, status: 'IN_PROGRESS', startedAt: new Date(now),
      expiresAt: cheDo === 'thi' ? new Date(now + paper.durationMinutes * 60_000) : null,
      answers: {}, gradingMode: 'SELF', mode: cheDo === 'thi' ? MODE_THI : MODE_LUYEN,
      paper: paper as object, progress: {},
    },
    select: { id: true },
  });
  return { attemptId: a.id };
}

export async function layDePe(attemptId: number, userId: number) {
  const a = await layLuotMoPhong(attemptId, userId);
  const paper = a.paper as unknown as PaperPe;
  if (paper.loai !== 'PE') throw new AppError('Lượt này là FE', 400);
  const daNop = a.status !== 'IN_PROGRESS';
  const fb = (a.feedback ?? {}) as Record<string, unknown>;
  const cfg = cauHinhMon(paper.courseCode);
  return {
    attempt: {
      id: a.id, mode: a.mode, status: a.status, startedAt: a.startedAt, expiresAt: a.expiresAt, submittedAt: a.submittedAt,
      serverNow: new Date(), score: a.score == null ? null : num(a.score), passed: a.passed, gradingMode: a.gradingMode,
    },
    paper: {
      nguon: paper.nguon, title: paper.title, code: paper.code, durationMinutes: paper.durationMinutes,
      thangDiem: paper.thangDiem, diemDat: paper.diemDat, attachmentUrl: paper.attachmentUrl, attachmentName: paper.attachmentName,
      given: paper.given, coMayCham: paper.coMayCham, exerciseId: paper.exerciseId, exerciseSlug: paper.exerciseSlug,
      cau: paper.cau.map((c) => ({
        id: c.id, prompt: c.prompt, points: c.points, imageUrl: c.imageUrl,
        // Rubric chi tiết + lời giải chỉ hiện SAU khi nộp (lúc thi chỉ có đề + điểm từng câu như tờ đề).
        rubric: daNop ? c.rubric : null, sampleSolution: daNop ? c.sampleSolution : null,
      })),
    },
    huongDanMoiTruong: cfg?.huongDanMoiTruong ?? [],
    nop: daNop ? (a.answers as Record<string, unknown>)?.nop ?? null : null,
    tuCham: fb.tuCham ?? null,
    chamTuDong: fb.chamTuDong ?? null,
    aiNhanXet: fb.aiNhanXet ?? null,
    aiConLuot: await aiConLuot(userId),
  };
}

/** Rút chữ mã nguồn từ zip (chỉ ĐỌC, không chạy) — để AI nhận xét tĩnh, trần 60k ký tự. */
export function rutMaNguon(zip: AdmZip, goc: string): { tep: string[]; ma: string } {
  const OK = /\.(js|jsx|ts|tsx|css|json|html|md)$/i;
  const BO = /(^|\/)(node_modules|\.git|build|dist|__MACOSX|coverage)\//;
  const tep: string[] = [];
  const phan: string[] = [];
  let tong = 0;
  for (const e of zip.getEntries()) {
    if (e.isDirectory) continue;
    const ten = e.entryName.replace(/\\/g, '/');
    if (!ten.startsWith(goc) || BO.test(ten) || /(^|\/)\._/.test(ten) || !OK.test(ten) || /package-lock\.json$|yarn\.lock$/.test(ten)) continue;
    const rel = ten.slice(goc.length);
    tep.push(rel);
    if (tong >= 60_000) continue;
    let s = '';
    try { s = e.getData().toString('utf8'); } catch { continue; }
    if (rel === 'database.json' || rel.endsWith('/database.json')) s = s.slice(0, 1500) + (s.length > 1500 ? '\n…' : '');
    if (s.length > 15_000) s = s.slice(0, 15_000) + '\n/* …truncated… */';
    tong += s.length;
    phan.push(`===== FILE: ${rel} =====\n${s}`);
  }
  // src/ trước để phần cắt (nếu có) rơi vào tệp phụ.
  phan.sort((a, b) => Number(!a.includes('FILE: src/')) - Number(!b.includes('FILE: src/')));
  return { tep, ma: phan.join('\n\n').slice(0, 60_000) };
}

export async function nopPeZip(attemptId: number, userId: number, file: { buffer: Buffer; originalname?: string; size?: number } | undefined, timeSpentSeconds: unknown) {
  const a = await layLuotMoPhong(attemptId, userId);
  const paper = a.paper as unknown as PaperPe;
  if (paper.loai !== 'PE') throw new AppError('Lượt này là FE', 400);
  if (a.status !== 'IN_PROGRESS') throw new AppError('Bài đã nộp rồi', 409);
  if (a.expiresAt && Date.now() > a.expiresAt.getTime() + AN_HAN_MS) {
    await prisma.examAttempt.update({ where: { id: a.id }, data: { status: 'EXPIRED', submittedAt: new Date(), score: 0, maxScore: paper.thangDiem, passed: false } });
    throw new AppError('Đã hết giờ — bài nộp sau giờ không được nhận (như phòng thi thật). Bạn vẫn xem đề + tự chấm được ở lượt mới.', 409);
  }
  if (!file?.buffer?.length) throw new AppError('Chưa chọn file .zip để nộp', 400);
  if (!/\.zip$/i.test(file.originalname || '')) throw new AppError('Chỉ nhận file .zip', 400);
  if (file.buffer.length > ZIP_TRAN_BYTE) throw new AppError(`File quá lớn (${(file.buffer.length / 1048576).toFixed(1)} MB > 20 MB) — thường là còn node_modules. Xoá node_modules rồi nén lại.`, 400);
  if (file.buffer.subarray(0, 2).toString('latin1') !== 'PK') throw new AppError('File không phải .zip hợp lệ (có thể là .rar/.7z đổi đuôi). Hãy nén lại bằng ZIP.', 400);
  let zip: AdmZip;
  try { zip = new AdmZip(file.buffer); } catch { throw new AppError('File .zip không đọc được. Hãy nén lại và thử lần nữa.', 400); }
  const entries = zip.getEntries();
  if (entries.length > ZIP_TRAN_TEP) throw new AppError(`Zip có ${entries.length} tệp — quá nhiều (thường là còn node_modules).`, 400);
  const giaiNen = entries.reduce((s, e) => s + (Number(e.header.size) || 0), 0);
  if (giaiNen > ZIP_TRAN_GIAI_NEN) throw new AppError('Zip giải nén ra quá lớn (> 60 MB).', 400);
  const kiem = kiemTenTepZip(entries.map((e) => e.entryName));
  if (kiem.loi.length) throw new AppError(kiem.loi.map((l) => l.split('|||')[1] ?? l).join(' '), 400);

  const { tep, ma } = rutMaNguon(zip, kiem.goc ?? '');
  const stored = await putObject(`documents/exam/${userId}/mock-${attemptId}-${Date.now()}.zip`, file.buffer, 'application/zip', 'private, max-age=0');
  const tg = Math.floor(Number(timeSpentSeconds) || (Date.now() - a.startedAt.getTime()) / 1000);
  const nop = { tenTep: String(file.originalname || 'bai.zip').slice(0, 120), kichThuoc: file.buffer.length, soTep: tep.length, tep: tep.slice(0, 300), canhBao: kiem.canhBao, zipKey: stored.key, luc: new Date().toISOString() };
  await prisma.examAttempt.update({
    where: { id: a.id },
    data: { status: 'SUBMITTED', submittedAt: new Date(), timeSpentSeconds: Math.max(0, tg), answers: { nop, ma } as object, maxScore: paper.thangDiem },
  });
  return { nop };
}

export async function tuChamPe(attemptId: number, userId: number, chon: unknown) {
  const a = await layLuotMoPhong(attemptId, userId);
  const paper = a.paper as unknown as PaperPe;
  if (paper.loai !== 'PE') throw new AppError('Lượt này là FE', 400);
  if (a.status === 'IN_PROGRESS') throw new AppError('Nộp bài trước rồi mới tự chấm', 409);
  const kq = diemTuCham(paper, chon);
  const fb = (a.feedback ?? {}) as Record<string, unknown>;
  await prisma.examAttempt.update({
    where: { id: a.id },
    data: {
      status: 'GRADED', score: kq.score, maxScore: paper.thangDiem, passed: kq.passed, gradingMode: 'SELF',
      feedback: { ...fb, tuCham: { ...kq, chon, luc: new Date().toISOString() } } as object,
    },
  });
  return kq;
}

/** Kết quả máy chấm Code Lab (chạy trong TRÌNH DUYỆT người học) — máy chủ kiểm hình dạng + tự tính điểm. */
export async function ghiChamTuDong(attemptId: number, userId: number, ketQuaRaw: unknown) {
  const a = await layLuotMoPhong(attemptId, userId);
  const paper = a.paper as unknown as PaperPe;
  if (paper.loai !== 'PE' || paper.nguon !== 'CODELAB' || !paper.exerciseId || !paper.coMayCham) throw new AppError('Đề này không có máy chấm tự động', 400);
  if (a.status === 'IN_PROGRESS') throw new AppError('Nộp bài trước rồi mới chấm', 409);
  const e = await prisma.codeExercise.findUnique({ where: { id: paper.exerciseId }, select: { id: true, testsJson: true } });
  if (!e) throw new AppError('Đề Code Lab không còn', 404);
  const day = testsDayDu(e.testsJson, e.id);
  const chuan = chuanHoaKetQuaClient(day, ketQuaRaw);
  if ('loi' in chuan) throw new AppError(chuan.loi, 400);
  const d = tinhDiem(day, chuan.ketQua);
  const score = Math.round((d.score / (d.maxScore || 1)) * paper.thangDiem * 100) / 100;
  const fb = (a.feedback ?? {}) as Record<string, unknown>;
  const chamTuDong = {
    score, maxScore: paper.thangDiem, dat: chuan.ketQua.filter((k) => k.dat).length, tong: chuan.ketQua.length,
    nhom: d.nhom, luc: new Date().toISOString(),
    nguon: 'browser',
  };
  // Chưa tự chấm ⇒ điểm của lượt = điểm máy chấm. Đã tự chấm ⇒ giữ điểm tự chấm (người học chọn).
  const coTuCham = !!fb.tuCham;
  await prisma.examAttempt.update({
    where: { id: a.id },
    data: {
      feedback: { ...fb, chamTuDong } as object,
      ...(coTuCham ? {} : { status: 'GRADED', score, maxScore: paper.thangDiem, passed: score >= paper.diemDat, gradingMode: 'AUTO' }),
    },
  });
  return chamTuDong;
}

async function aiConLuot(userId: number): Promise<number> {
  const tran = AI_LUOT_NGAY();
  if (!tran) return 0;
  const dauNgay = new Date(); dauNgay.setHours(0, 0, 0, 0);
  const rows = await prisma.examAttempt.findMany({
    where: { userId, mode: { in: MODES_MO_PHONG }, updatedAt: { gte: dauNgay } },
    select: { feedback: true }, take: 200,
  });
  const da = rows.filter((r) => {
    const t = (r.feedback as { aiNhanXet?: { luc?: string } } | null)?.aiNhanXet?.luc;
    return t && new Date(t) >= dauNgay;
  }).length;
  return Math.max(0, tran - da);
}

export async function aiNhanXetPe(attemptId: number, userId: number) {
  const a = await layLuotMoPhong(attemptId, userId);
  const paper = a.paper as unknown as PaperPe;
  if (paper.loai !== 'PE') throw new AppError('Lượt này là FE', 400);
  if (a.status === 'IN_PROGRESS') throw new AppError('Nộp bài trước rồi mới nhờ AI nhận xét', 409);
  const fb = (a.feedback ?? {}) as Record<string, unknown>;
  if (fb.aiNhanXet) throw new AppError('Lượt này đã có nhận xét AI (mỗi lượt một lần).', 409);
  if ((await aiConLuot(userId)) <= 0) throw new AppError(`Hết lượt AI nhận xét hôm nay (${AI_LUOT_NGAY()} lượt/ngày). Quay lại ngày mai nhé.`, 429);
  const ma = String((a.answers as { ma?: string } | null)?.ma ?? '');
  if (ma.trim().length < 40) throw new AppError('Không có mã nguồn để nhận xét (zip không có tệp .js/.jsx?).', 400);
  const r = await nhanXetTinhPe({
    userId, title: paper.title, thangDiem: paper.thangDiem, ma,
    cau: paper.cau.map((c) => ({ id: c.id, points: c.points, prompt: c.prompt, rubric: c.rubric })),
  });
  const aiNhanXet = { ...r, catMa: ma.length > NHAN_XET_TINH_TRAN_MA, luc: new Date().toISOString() };
  await prisma.examAttempt.update({ where: { id: a.id }, data: { feedback: { ...fb, aiNhanXet } as object } });
  return aiNhanXet;
}

export function danhSachMon(): Array<Pick<CauHinhMonMoPhong, 'courseCode' | 'fe' | 'pe'>> {
  return Object.values(MO_PHONG_MON).map((m) => ({ courseCode: m.courseCode, fe: m.fe, pe: m.pe }));
}
