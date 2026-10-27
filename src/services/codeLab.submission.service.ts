/**
 * Code Lab — lượt NỘP + bộ kiểm đủ + demo đề lớn (đợt Academy 28/10/2026).
 *
 * Máy chấm chạy trong TRÌNH DUYỆT; máy chủ chỉ: (1) đưa bộ kiểm đủ lúc Nộp, (2) nhận kết quả,
 * kiểm hình dạng, tính điểm, lưu `code_submissions`, (3) đánh dấu SOLVED khi đạt 100%.
 * Loại tĩnh (choice/order/table) thì máy chủ CHẤM LẠI từ câu trả lời — không tin client.
 * Ghi chú toàn vẹn + lý do: xem đầu tệp codeLab.cham.ts.
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';
import {
  STATIC_GRADE_KINDS,
  BROWSER_GRADE_KINDS,
  chamTinh,
  chuanHoaKetQuaClient,
  gradeKindOf,
  testsDayDu,
  tinhDiem,
  type KetQuaKiem,
} from './codeLab.cham.js';
import { normalizeCodeBlocks, upsertProgress } from './codeLab.service.js';

const DE_SELECT = {
  id: true,
  status: true,
  testsJson: true,
  gradeKind: true,
  language: true,
  track: { select: { status: true } },
} satisfies Prisma.CodeExerciseSelect;

async function layDe(id: number, admin = false) {
  const ex = await prisma.codeExercise.findUnique({ where: { id }, select: DE_SELECT });
  if (!ex) throw new NotFoundError('Exercise not found.');
  if (!admin && (ex.status !== 'PUBLISHED' || ex.track?.status !== 'PUBLISHED')) throw new NotFoundError('Exercise not found.');
  return ex;
}

/** Bộ kiểm đủ (cả kiểm ẩn) cho lúc Nộp. */
export async function getTestsForSubmit(id: number, opts: { admin?: boolean } = {}) {
  const ex = await layDe(id, opts.admin);
  const tests = testsDayDu(ex.testsJson, ex.id);
  if (!tests) throw new NotFoundError('Bài này chưa có bộ kiểm.');
  return { id: ex.id, gradeKind: gradeKindOf(ex.testsJson, ex.gradeKind), testsJson: tests };
}

/** Trang demo của đề lớn (HTML tự chứa — chạy trong iframe sandbox ở trình duyệt). */
export async function getDemo(id: number, opts: { admin?: boolean } = {}) {
  const ex = await prisma.codeExercise.findUnique({
    where: { id },
    select: { id: true, status: true, demoHtml: true, track: { select: { status: true } } },
  });
  if (!ex || (!opts.admin && (ex.status !== 'PUBLISHED' || ex.track?.status !== 'PUBLISHED'))) throw new NotFoundError('Exercise not found.');
  if (!ex.demoHtml?.trim()) throw new NotFoundError('Bài này không có demo.');
  return { id: ex.id, html: ex.demoHtml };
}

export interface SubmissionInput {
  /** Bài làm (loại code): [{ name, language, code }]. */
  code?: unknown;
  /** Loại code: kết quả trình duyệt [{ dat, thay?, ms? }] theo thứ tự kiểm. */
  results?: unknown;
  /** Loại tĩnh: câu trả lời — máy chủ tự chấm. */
  answers?: unknown;
  /** Tổng thời gian chấm (ms) đo ở trình duyệt. */
  ms?: unknown;
}

const TRAN_CODE_BYTES = 400_000;

export async function createSubmission(userId: number, exerciseId: number, input: SubmissionInput) {
  const ex = await layDe(exerciseId);
  const kind = gradeKindOf(ex.testsJson, ex.gradeKind);
  if (!kind || !BROWSER_GRADE_KINDS.has(kind)) {
    throw new BadRequestError('Bài này chưa có máy chấm trên web — chấm máy chủ (Java/SQL/Bash) sắp có.');
  }

  let ketQua: KetQuaKiem[];
  let code: Prisma.InputJsonValue | typeof Prisma.DbNull = Prisma.DbNull;
  if (STATIC_GRADE_KINDS.has(kind)) {
    if (input.answers == null || typeof input.answers !== 'object') throw new BadRequestError('Thiếu câu trả lời.');
    const raw = JSON.stringify(input.answers);
    if (raw.length > TRAN_CODE_BYTES) throw new BadRequestError('Câu trả lời quá lớn.');
    ketQua = chamTinh(ex.testsJson, input.answers);
    if (!ketQua.length) throw new BadRequestError('Đề này không có bộ kiểm.');
    code = input.answers as Prisma.InputJsonValue;
  } else {
    const r = chuanHoaKetQuaClient(ex.testsJson, input.results);
    if ('loi' in r) throw new BadRequestError(r.loi);
    ketQua = r.ketQua;
    const blocks = normalizeCodeBlocks(input.code, ex.language);
    if (JSON.stringify(blocks).length > TRAN_CODE_BYTES) throw new BadRequestError('Bài làm quá lớn (tối đa ~400 KB).');
    code = blocks as unknown as Prisma.InputJsonValue;
  }

  const passed = ketQua.filter((k) => k.dat).length;
  const total = ketQua.length;
  const diem = tinhDiem(ex.testsJson, ketQua);
  const accepted = total > 0 && passed === total;
  const ms = typeof input.ms === 'number' && Number.isFinite(input.ms) ? Math.max(0, Math.min(3_600_000, Math.round(input.ms))) : null;

  const sub = await prisma.codeSubmission.create({
    data: {
      userId,
      exerciseId,
      mode: 'submit',
      gradeKind: kind,
      code,
      results: ketQua as unknown as Prisma.InputJsonValue,
      passed,
      total,
      score: diem.score,
      maxScore: diem.maxScore,
      accepted,
      ms,
    },
  });

  // Tiến độ: đạt 100% ⇒ SOLVED (+ lưu bài làm). Chưa đạt ⇒ IN_PROGRESS, KHÔNG hạ bài đã giải.
  const prev = await prisma.codeProgress.findUnique({
    where: { uk_code_progress_user_exercise: { userId, exerciseId } },
    select: { status: true },
  });
  const savedCode = STATIC_GRADE_KINDS.has(kind) ? undefined : input.code;
  const progress = await upsertProgress(
    userId,
    exerciseId,
    { status: accepted ? 'SOLVED' : prev?.status === 'SOLVED' ? 'SOLVED' : 'IN_PROGRESS', ...(savedCode !== undefined ? { savedCode } : {}) },
    { quaMayCham: true },
  );

  return {
    submission: hienLuot(sub),
    diem,
    // loại tĩnh: kết quả chấm của MÁY CHỦ (đúng/sai từng câu) để trình duyệt hiện
    ketQua,
    status: progress.status,
  };
}

type SubRow = Prisma.CodeSubmissionGetPayload<object>;
function hienLuot(s: SubRow) {
  return {
    id: s.id,
    mode: s.mode,
    gradeKind: s.gradeKind,
    passed: s.passed,
    total: s.total,
    score: s.score,
    maxScore: s.maxScore,
    accepted: s.accepted,
    ms: s.ms,
    createdAt: s.createdAt,
    results: s.results,
    code: s.code,
  };
}

/** Lịch sử nộp của CHÍNH người dùng cho một bài (mới nhất trước). */
export async function listMySubmissions(userId: number, exerciseId: number, limit = 30) {
  const rows = await prisma.codeSubmission.findMany({
    where: { userId, exerciseId },
    orderBy: { createdAt: 'desc' },
    take: Math.min(100, Math.max(1, limit)),
  });
  return rows.map(hienLuot);
}

/** Tóm tắt tiến độ theo track cho trang chủ Code Lab: { trackId: { solved, inProgress } }. */
export async function getMyTrackSummary(userId: number) {
  const rows = await prisma.$queryRaw<Array<{ track_id: number; solved: bigint; dang: bigint }>>(Prisma.sql`
    SELECT e.track_id,
           COUNT(*) FILTER (WHERE p.status = 'SOLVED')::bigint AS solved,
           COUNT(*) FILTER (WHERE p.status = 'IN_PROGRESS')::bigint AS dang
    FROM code_progress p JOIN code_exercises e ON e.id = p.exercise_id
    WHERE p.user_id = ${userId}
    GROUP BY e.track_id
  `);
  const out: Record<number, { solved: number; inProgress: number }> = {};
  for (const r of rows) out[r.track_id] = { solved: Number(r.solved), inProgress: Number(r.dang) };
  return out;
}
