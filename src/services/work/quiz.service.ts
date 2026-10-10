/**
 * CT Work đợt 9c (13/10/2026) — LỚP HỌC: QUIZ TRẮC NGHIỆM TỰ CHẤM.
 *
 *   Giảng viên (OWNER/TEACHER của lớp): ngân hàng câu hỏi theo chủ đề (5 kiểu câu, ảnh, công thức KaTeX trong chữ,
 *   giải thích), nhập từ bảng xlsx/CSV theo mẫu + Aiken + GIFT (xem trước lỗi từng dòng ⇒ xác nhận), AI gợi ý câu hỏi
 *   từ tài liệu (luôn là NHÁP "AI draft", phải duyệt từng câu) ⇒ dựng quiz (câu cố định + rút ngẫu nhiên N câu/chủ đề),
 *   cấu hình giờ mở/đóng, thời gian làm, số lần, trộn, một câu/trang, khi nào hiện đáp án, cách lấy điểm ⇒ giao
 *   (đăng bảng tin 9a + lịch lớp) ⇒ kết quả, chấm tay/chỉnh câu điền ngắn, thống kê câu (độ khó, độ phân biệt, nhiễu),
 *   xuất xlsx. Điểm vào sổ điểm 9b qua nguồn `quiz` đăng ký ở cuối tệp (classGradebookSources.ts).
 *
 *   Sinh viên: bắt đầu lượt ⇒ máy chủ CHỤP đề (rút + trộn theo seed) và tính hạn (deadline_at) ⇒ lưu từng câu (PUT,
 *   ghi đè theo khoá câu) ⇒ nộp; hết giờ ⇒ máy chủ từ chối ghi (409 WORK_QUIZ_TIME_UP) và tự nộp phần đã lưu (lười: lần
 *   đọc/ghi kế tiếp, hoặc khi giảng viên mở kết quả / sổ điểm). Rời tab chỉ được ĐẾM (giảng viên xem), không cấm.
 *
 * BẢO MẬT ĐÁP ÁN: mọi đường trả dữ liệu cho sinh viên đi qua `studentAttemptView()` ⇒ `studentPaper()` (quizRules) — không
 * đáp án, không giải thích, không id phương án gốc, không cài đặt chấm — cho tới khi `answersVisible()` cho phép. Bảng
 * câu hỏi (có đáp án) chỉ giảng viên đọc được. Agent: 403 ở MỌI lệnh (kể cả đọc) — `assertHumanActor` dòng đầu.
 */

import { randomInt, randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { putObject } from '../../config/r2.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { checkTokenQuota, isAiAvailable, llmComplete } from '../interview/llm/index.js';
import { displayName, PUBLIC_USER } from './common.js';
import { registerGradebookSource, type GradebookCell, type GradebookCellState, type GradebookCtx, type GradebookItem } from './classGradebookSources.js';
import { postStreamItem, removeStreamItem } from './classStream.service.js';
import { assertHumanActor } from './permissions.js';
import { parseCsv } from './teachingRules.js';
import { readXlsx, writeXlsx, XSheet, type XStyle } from './xlsxStyled.js';
import {
  aggregateScore, answersVisible, attemptDeadline, buildPaper, cleanResponse, displayAnswer, gradePaper, LAYOUTS, LIMITS,
  parseAiken, parseAiQuestions, parseGift, parseQuestionTable, quizStats, SCORING, SHOW_ANSWERS, studentPaper, TEMPLATE_HEADERS,
  validateQuestion, type BankQuestion, type ImportRow, type PaperItem, type QuestionData, type QuizItem, type QuizLayout,
  type Response as QResponse, type Scoring, type ShowAnswers, type StatAttempt,
} from './quizRules.js';

/** Trễ mạng cho lần lưu/nộp cuối: chấp nhận tới 2 giây sau hạn, sau đó từ chối. */
export const SAVE_GRACE_MS = 2000;

// ─── Quyền trên lớp ─────────────────────────────────────────────

type Role = 'OWNER' | 'TEACHER' | 'STUDENT';

async function classAccess(userId: number, classId: number, opts: { manage?: boolean } = {}) {
  await assertHumanActor(userId, 'use class quizzes');
  const cls = await prisma.workClass.findUnique({ where: { id: classId }, select: { id: true, name: true, ownerId: true, teacherId: true, timezone: true, archivedAt: true } });
  if (!cls) throw new NotFoundError('Class not found');
  let role: Role | null = cls.ownerId === userId ? 'OWNER' : cls.teacherId === userId ? 'TEACHER' : null;
  if (!role) {
    const seat = await prisma.workClassStudent.findFirst({ where: { classId, userId }, select: { id: true } });
    if (seat) role = 'STUDENT';
  }
  if (!role) throw new NotFoundError('Class not found');
  if (opts.manage && role === 'STUDENT') throw new ForbiddenError('Only the lecturer and the class owner can do this');
  return { cls, role, manage: role !== 'STUDENT' };
}

/** Chỉ kiểm quyền giảng viên của lớp (cho tuyến tải mẫu). */
export async function assertManage(userId: number, classId: number) { await classAccess(userId, classId, { manage: true }); }

async function loadQuiz(classId: number, quizId: number) {
  const q = await prisma.workClassQuiz.findFirst({ where: { id: quizId, classId, deletedAt: null } });
  if (!q) throw new NotFoundError('Quiz not found');
  return q;
}
type QuizRow = Awaited<ReturnType<typeof loadQuiz>>;

const itemsOf = (raw: unknown): QuizItem[] => (Array.isArray(raw) ? raw as QuizItem[] : []);
const asPaper = (raw: unknown): PaperItem[] => (Array.isArray(raw) ? raw as PaperItem[] : []);
const asRec = <T,>(raw: unknown): Record<string, T> => (raw && typeof raw === 'object' && !Array.isArray(raw) ? raw as Record<string, T> : {});

// ═══ Ngân hàng câu hỏi ═══════════════════════════════════════════

const QUESTION_SELECT = {
  id: true, topic: true, type: true, prompt: true, imageUrl: true, points: true, explanation: true, options: true, answer: true,
  settings: true, aiDraft: true, approvedAt: true, createdAt: true, updatedAt: true,
} as const;

function toBank(r: { id: number; topic: string; type: string; prompt: string; imageUrl: string | null; points: number; explanation: string | null; options: unknown; answer: unknown; settings: unknown }): BankQuestion {
  return {
    id: r.id, topic: r.topic, type: r.type as BankQuestion['type'], prompt: r.prompt, imageUrl: r.imageUrl, points: r.points,
    explanation: r.explanation, options: (Array.isArray(r.options) ? r.options : []) as BankQuestion['options'],
    answer: asRec(r.answer), settings: asRec(r.settings),
  };
}

export async function listBank(userId: number, classId: number, f: { topic?: string; q?: string; drafts?: boolean } = {}) {
  await classAccess(userId, classId, { manage: true });
  const where: Prisma.WorkClassQuizQuestionWhereInput = { classId, archivedAt: null };
  if (f.topic) where.topic = { equals: f.topic, mode: 'insensitive' };
  if (f.q?.trim()) where.prompt = { contains: f.q.trim(), mode: 'insensitive' };
  if (f.drafts) where.approvedAt = null;
  const [rows, topics, used] = await Promise.all([
    prisma.workClassQuizQuestion.findMany({ where, orderBy: [{ topic: 'asc' }, { id: 'asc' }], select: QUESTION_SELECT, take: LIMITS.bankPerClass }),
    prisma.workClassQuizQuestion.groupBy({ by: ['topic'], where: { classId, archivedAt: null }, _count: { _all: true } }),
    prisma.workClassQuiz.findMany({ where: { classId, deletedAt: null }, select: { id: true, title: true, items: true } }),
  ]);
  const usage = new Map<number, number>();
  for (const qz of used) for (const it of itemsOf(qz.items)) if (it.kind === 'Q') usage.set(it.questionId, (usage.get(it.questionId) ?? 0) + 1);
  const drafts = await prisma.workClassQuizQuestion.count({ where: { classId, archivedAt: null, approvedAt: null } });
  return {
    questions: rows.map((r) => ({ ...r, draft: !r.approvedAt, usedIn: usage.get(r.id) ?? 0 })),
    topics: topics.map((t) => ({ topic: t.topic, count: t._count._all })).sort((a, b) => a.topic.localeCompare(b.topic)),
    drafts,
  };
}

function writableQuestion(input: unknown): QuestionData {
  const { q, errors } = validateQuestion(input);
  if (errors.length) throw new BadRequestError(errors.join(' · '), 'WORK_QUIZ_QUESTION_BAD');
  return q;
}
const qData = (q: QuestionData) => ({
  topic: q.topic, type: q.type, prompt: q.prompt, imageUrl: q.imageUrl, points: q.points, explanation: q.explanation,
  options: q.options as unknown as Prisma.InputJsonValue, answer: q.answer as Prisma.InputJsonValue, settings: q.settings as Prisma.InputJsonValue,
});

async function assertBankRoom(classId: number, adding: number) {
  const n = await prisma.workClassQuizQuestion.count({ where: { classId, archivedAt: null } });
  if (n + adding > LIMITS.bankPerClass) throw new BadRequestError(`A class bank holds at most ${LIMITS.bankPerClass} questions`, 'WORK_LIMIT');
}

export async function createQuestion(userId: number, classId: number, input: unknown) {
  await classAccess(userId, classId, { manage: true });
  const q = writableQuestion(input);
  await assertBankRoom(classId, 1);
  return prisma.workClassQuizQuestion.create({ data: { classId, authorId: userId, ...qData(q), approvedAt: new Date() }, select: QUESTION_SELECT });
}

/** Sửa câu (thay toàn bộ nội dung) và/hoặc duyệt nháp AI (`approve: true`). Lượt làm cũ giữ bản chụp — không đổi. */
export async function updateQuestion(userId: number, classId: number, questionId: number, input: { question?: unknown; approve?: boolean }) {
  await classAccess(userId, classId, { manage: true });
  const row = await prisma.workClassQuizQuestion.findFirst({ where: { id: questionId, classId, archivedAt: null }, select: { id: true } });
  if (!row) throw new NotFoundError('Question not found');
  const data: Prisma.WorkClassQuizQuestionUpdateInput = {};
  if (input.question !== undefined) Object.assign(data, qData(writableQuestion(input.question)));
  if (input.approve === true) data.approvedAt = new Date();
  return prisma.workClassQuizQuestion.update({ where: { id: questionId }, data, select: QUESTION_SELECT });
}

export async function archiveQuestion(userId: number, classId: number, questionId: number) {
  await classAccess(userId, classId, { manage: true });
  const r = await prisma.workClassQuizQuestion.updateMany({ where: { id: questionId, classId, archivedAt: null }, data: { archivedAt: new Date() } });
  if (!r.count) throw new NotFoundError('Question not found');
}

// ─── Ảnh câu hỏi ────────────────────────────────────────────────

const IMAGE_TYPES: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' };
const MAX_IMAGE = 3 * 1024 * 1024;

function sniffImage(buf: Buffer): string | null {
  if (buf.length > 8 && buf[0] === 0x89 && buf.toString('ascii', 1, 4) === 'PNG') return 'image/png';
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (buf.length > 6 && buf.toString('ascii', 0, 4) === 'GIF8') return 'image/gif';
  return null;
}

export async function uploadImage(userId: number, classId: number, input: { dataBase64: string }) {
  await classAccess(userId, classId, { manage: true });
  const b64 = input.dataBase64.replace(/^data:[^;]+;base64,/, '');
  const buf = Buffer.from(b64, 'base64');
  if (!buf.length) throw new BadRequestError('The image is empty', 'WORK_QUIZ_IMAGE_BAD');
  if (buf.length > MAX_IMAGE) throw new BadRequestError('Images can be at most 3 MB', 'WORK_QUIZ_IMAGE_BAD');
  // Kiểu lấy từ CHỮ KÝ tệp, không tin client (không có SVG ⇒ không có XSS qua ảnh).
  const mime = sniffImage(buf);
  if (!mime) throw new BadRequestError('Use a PNG, JPEG, WebP or GIF image', 'WORK_QUIZ_IMAGE_BAD');
  const key = `work/class/${classId}/quiz/${randomUUID()}.${IMAGE_TYPES[mime]}`;
  const out = await putObject(key, buf, mime);
  return { url: out.url, key };
}

// ─── Nhập câu hỏi ───────────────────────────────────────────────

export type ImportFormat = 'table' | 'aiken' | 'gift';
export interface ImportInput { format: ImportFormat; text?: string; xlsxBase64?: string; topic?: string; confirm?: boolean }

function parseImport(input: ImportInput): ImportRow[] {
  const topic = (input.topic ?? '').trim().slice(0, LIMITS.topic);
  if (input.format === 'aiken') return parseAiken(input.text ?? '', topic);
  if (input.format === 'gift') return parseGift(input.text ?? '', topic);
  let rows: string[][];
  if (input.xlsxBase64) {
    let sheets;
    try { sheets = readXlsx(Buffer.from(input.xlsxBase64, 'base64')); } catch { throw new BadRequestError('This file is not a valid .xlsx workbook', 'WORK_QUIZ_IMPORT_BAD'); }
    const sh = sheets.find((s) => /question|câu/i.test(s.name)) ?? sheets[0];
    if (!sh) throw new BadRequestError('The workbook is empty', 'WORK_QUIZ_IMPORT_BAD');
    rows = [];
    for (let r = 1; r <= Math.min(sh.maxRow, LIMITS.importRows + 20); r++) {
      const row: string[] = [];
      for (let c = 1; c <= Math.min(sh.maxCol, 20); c++) row.push(sh.text(r, c));
      rows.push(row);
    }
  } else rows = parseCsv(input.text ?? '');
  return parseQuestionTable(rows, topic);
}

export async function importQuestions(userId: number, classId: number, input: ImportInput) {
  await classAccess(userId, classId, { manage: true });
  const rows = parseImport(input);
  const ok = rows.filter((r) => r.question);
  const summary = { total: rows.length, valid: ok.length, invalid: rows.length - ok.length };
  const preview = rows.map((r) => ({ line: r.line, source: r.source, errors: r.errors, question: r.question }));
  if (!input.confirm) return { ...summary, rows: preview, imported: 0 };
  if (!ok.length) throw new BadRequestError('Nothing valid to import', 'WORK_QUIZ_IMPORT_BAD');
  await assertBankRoom(classId, ok.length);
  const now = new Date();
  await prisma.workClassQuizQuestion.createMany({ data: ok.map((r) => ({ classId, authorId: userId, ...qData(r.question!), approvedAt: now })) });
  return { ...summary, rows: preview, imported: ok.length };
}

/** Mẫu nhập xlsx: sheet Questions (tiêu đề + 5 ví dụ đủ kiểu) + sheet Guide. */
export function importTemplateXlsx() {
  const head: XStyle = { font: { b: true, color: 'FFFFFF' }, fill: '1F4E79', border: 'thin' };
  const sh = new XSheet('Questions');
  TEMPLATE_HEADERS.forEach((h, i) => sh.set(1, i + 1, h, head));
  const ex: string[][] = [
    ['single', 'Networking', 'Which layer of the OSI model routes packets?', 'Physical', 'Network', 'Transport', 'Session', '', '', 'B', '1', 'Routers work at layer 3 (Network).', ''],
    ['multi', 'Networking', 'Which of these are transport protocols?', 'TCP', 'IP', 'UDP', 'ARP', '', '', 'A,C', '2', 'TCP and UDP are layer-4 protocols.', ''],
    ['tf', 'Math', 'The derivative of $x^2$ is $2x$.', '', '', '', '', '', '', 'TRUE', '1', '', ''],
    ['short', 'Geography', 'Capital of Vietnam?', '', '', '', '', '', '', 'Hà Nội|Hanoi', '1', 'Accents and case are ignored unless you turn them on.', ''],
    ['match', 'Java', 'Match each keyword to its meaning.', 'final => cannot be changed', 'static => belongs to the class', 'abstract => has no body', '', '', '', '', '3', '', ''],
  ];
  ex.forEach((row, r) => row.forEach((v, c) => sh.set(r + 2, c + 1, v === '' ? null : (c === 10 ? Number(v) : v), { border: 'thin', align: { wrap: true, v: 'top' } })));
  [12, 14, 46, 22, 22, 22, 22, 14, 14, 12, 8, 36, 24].forEach((w, i) => sh.width(i + 1, w));
  sh.freeze = { col: 0, row: 1 };
  sh.listValidation('A2:A501', ['single', 'multi', 'tf', 'short', 'match']);
  const g = new XSheet('Guide');
  const lines = [
    'CT Work — question import template',
    'Type: single | multi | tf | short | match (Vietnamese aliases work too: một, nhiều, đúng/sai, điền, ghép).',
    'Options: columns A–F. For match, write each pair as "left => right".',
    'Answer: single = one letter (B); multi = letters separated by commas (A,C); tf = TRUE/FALSE (Đúng/Sai); short = accepted answers separated by | ; match = leave empty.',
    'Points: a number (default 1). Formulas: write LaTeX between $…$ (inline) or $$…$$ (block).',
    'Image URL: optional http(s) link. Upload images in CT Work for private hosting.',
    'Multi-answer partial credit and short-answer case/accent rules can be changed per question after import.',
  ];
  lines.forEach((l, i) => g.set(i + 1, 1, l, i === 0 ? { font: { b: true, sz: 13 } } : undefined));
  g.width(1, 120);
  return { buf: writeXlsx([sh, g], { title: 'CT Work quiz import template' }), fileName: 'ctwork-quiz-import-template.xlsx' };
}

// ─── AI gợi ý câu hỏi ───────────────────────────────────────────

type AskFn = (system: string, user: string) => Promise<string>;
let askOverride: AskFn | null = null;
/** CHỈ cho test: thay LLM bằng hàm giả. */
export function _setQuizAskForTests(fn: AskFn | null) { askOverride = fn; }

export async function aiSuggest(userId: number, classId: number, input: { source: string; count?: number; topic?: string; types?: string[]; language?: 'en' | 'vi' }) {
  await classAccess(userId, classId, { manage: true });
  const source = (input.source ?? '').trim().slice(0, 24_000);
  if (source.length < 80) throw new BadRequestError('Paste at least a paragraph of class material', 'WORK_QUIZ_AI_SHORT');
  const count = Math.min(Math.max(input.count ?? 5, 1), 15);
  const topic = (input.topic ?? '').trim().slice(0, LIMITS.topic) || 'AI draft';
  const types = (input.types ?? ['SINGLE', 'MULTI', 'TRUE_FALSE', 'SHORT']).filter((t) => ['SINGLE', 'MULTI', 'TRUE_FALSE', 'SHORT', 'MATCH'].includes(t));
  await assertBankRoom(classId, count);
  const system = [
    'You write quiz questions for a university lecturer, using ONLY the class material given. Never invent facts that are not in the material.',
    `Write ${count} questions. Allowed types: ${types.join(', ')}. Mix them. Each question tests one idea from the material.`,
    'Return ONLY JSON: {"questions":[{"type":"SINGLE|MULTI|TRUE_FALSE|SHORT|MATCH","prompt":"...","options":["..."],"correct":[0],"value":true,"accepted":["..."],"pairs":[{"left":"...","right":"..."}],"points":1,"explanation":"why, citing the material"}]}',
    'SINGLE: 4 options, correct = [index]. MULTI: 4-5 options, correct = indexes. TRUE_FALSE: value. SHORT: accepted = 1-3 short answers. MATCH: 3-5 pairs.',
    'Use LaTeX between $...$ for maths. Plausible wrong options (common misconceptions), no "all of the above".',
    input.language === 'vi' ? 'Write in Vietnamese.' : 'Write in English.',
  ].join('\n');
  let text: string;
  if (askOverride) text = await askOverride(system, source);
  else {
    if (!isAiAvailable('work')) throw new AppError('The AI assistant is temporarily unavailable. Please try again later.', 503, 'WORK_AI_UNAVAILABLE');
    if (!(await checkTokenQuota(userId))) throw new AppError('You have reached today’s AI usage limit.', 429, 'WORK_AI_TOKEN_CAP');
    const r = await llmComplete({ step: 'report', system, messages: [{ role: 'user', content: source }], maxTokens: 4000, userId, feature: 'work', purpose: 'work_assistant', timeoutMs: 120_000, maxRetries: 1 });
    text = r.text;
  }
  const rows = parseAiQuestions(text, topic);
  const ok = rows.filter((r) => r.question);
  if (ok.length) {
    await prisma.workClassQuizQuestion.createMany({
      // NHÁP: aiDraft + approvedAt null ⇒ không giao được tới khi giảng viên duyệt từng câu.
      data: ok.map((r) => ({ classId, authorId: userId, ...qData(r.question!), aiDraft: true, approvedAt: null })),
    });
  }
  return { created: ok.length, rejected: rows.length - ok.length, errors: rows.filter((r) => !r.question).map((r) => ({ line: r.line, errors: r.errors })) };
}

// ═══ Quiz ════════════════════════════════════════════════════════

export interface QuizInput {
  title?: string; description?: string | null; topic?: string | null; items?: QuizItem[];
  openAt?: string | null; closeAt?: string | null; timeLimitMin?: number | null; maxAttempts?: number;
  shuffleQuestions?: boolean; shuffleOptions?: boolean; layout?: QuizLayout; showAnswers?: ShowAnswers; scoring?: Scoring;
}

function cleanItems(raw: QuizItem[]): QuizItem[] {
  const out: QuizItem[] = [];
  const seen = new Set<number>();
  for (const it of raw.slice(0, LIMITS.questionsPerQuiz)) {
    const pts = it.points && it.points > 0 ? Math.min(LIMITS.maxPoints, Math.round(it.points * 100) / 100) : null;
    if (it.kind === 'Q' && Number.isInteger(it.questionId) && !seen.has(it.questionId)) { seen.add(it.questionId); out.push({ kind: 'Q', questionId: it.questionId, points: pts }); }
    if (it.kind === 'DRAW' && it.topic?.trim()) out.push({ kind: 'DRAW', topic: it.topic.trim().slice(0, LIMITS.topic), count: Math.min(Math.max(Math.round(it.count), 1), LIMITS.questionsPerQuiz), points: pts });
  }
  return out;
}
const dt = (s: string | null | undefined) => {
  if (s === null || s === undefined || s === '') return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) throw new BadRequestError('Invalid date', 'VALIDATION_ERROR');
  return d;
};

function quizData(input: QuizInput): Prisma.WorkClassQuizUncheckedUpdateInput {
  const d: Prisma.WorkClassQuizUncheckedUpdateInput = {};
  if (input.title !== undefined) { const t = input.title.trim(); if (!t) throw new BadRequestError('The quiz needs a title', 'WORK_QUIZ_BAD'); d.title = t.slice(0, 200); }
  if (input.description !== undefined) d.description = input.description?.trim().slice(0, 8000) || null;
  if (input.topic !== undefined) d.topic = input.topic?.trim().slice(0, 80) || null;
  if (input.items !== undefined) d.items = cleanItems(input.items) as unknown as Prisma.InputJsonValue;
  if (input.openAt !== undefined) d.openAt = dt(input.openAt);
  if (input.closeAt !== undefined) d.closeAt = dt(input.closeAt);
  if (input.timeLimitMin !== undefined) d.timeLimitMin = input.timeLimitMin ? Math.min(Math.max(Math.round(input.timeLimitMin), 1), 600) : null;
  if (input.maxAttempts !== undefined) d.maxAttempts = Math.min(Math.max(Math.round(input.maxAttempts), 1), 20);
  if (input.shuffleQuestions !== undefined) d.shuffleQuestions = input.shuffleQuestions;
  if (input.shuffleOptions !== undefined) d.shuffleOptions = input.shuffleOptions;
  if (input.layout !== undefined) { if (!LAYOUTS.includes(input.layout)) throw new BadRequestError('Unknown layout', 'WORK_QUIZ_BAD'); d.layout = input.layout; }
  if (input.showAnswers !== undefined) { if (!SHOW_ANSWERS.includes(input.showAnswers)) throw new BadRequestError('Unknown answer policy', 'WORK_QUIZ_BAD'); d.showAnswers = input.showAnswers; }
  if (input.scoring !== undefined) { if (!SCORING.includes(input.scoring)) throw new BadRequestError('Unknown scoring', 'WORK_QUIZ_BAD'); d.scoring = input.scoring; }
  return d;
}

/** Câu trong ngân hàng mà quiz có thể dùng (đã duyệt, chưa lưu trữ) — để dựng đề / kiểm khi giao. */
async function bankFor(classId: number, items: QuizItem[]): Promise<BankQuestion[]> {
  const ids = items.filter((i): i is Extract<QuizItem, { kind: 'Q' }> => i.kind === 'Q').map((i) => i.questionId);
  const topics = items.filter((i): i is Extract<QuizItem, { kind: 'DRAW' }> => i.kind === 'DRAW').map((i) => i.topic);
  if (!ids.length && !topics.length) return [];
  const rows = await prisma.workClassQuizQuestion.findMany({
    where: {
      classId, archivedAt: null, approvedAt: { not: null },
      OR: [...(ids.length ? [{ id: { in: ids } }] : []), ...topics.map((t) => ({ topic: { equals: t, mode: 'insensitive' as const } }))],
    },
    select: QUESTION_SELECT,
  });
  return rows.map(toBank);
}

/** Tổng điểm + số câu dự kiến (mục rút: điểm ghi đè × N, hoặc điểm TB của chủ đề × N). */
function planOf(items: QuizItem[], bank: BankQuestion[]) {
  let points = 0, questions = 0;
  const problems: string[] = [];
  const byId = new Map(bank.map((q) => [q.id, q]));
  const fixed = new Set(items.filter((i) => i.kind === 'Q').map((i) => (i as { questionId: number }).questionId));
  for (const it of items) {
    if (it.kind === 'Q') {
      const q = byId.get(it.questionId);
      if (!q) { problems.push(`Question #${it.questionId} is missing, archived or still an unapproved AI draft`); continue; }
      points += it.points ?? q.points; questions += 1;
    } else {
      const pool = bank.filter((q) => q.topic.toLowerCase() === it.topic.toLowerCase() && !fixed.has(q.id));
      if (pool.length < it.count) problems.push(`Topic "${it.topic}" has ${pool.length} approved questions, ${it.count} needed`);
      const avg = pool.length ? pool.reduce((s, q) => s + q.points, 0) / pool.length : 1;
      points += (it.points ?? avg) * it.count; questions += it.count;
    }
  }
  return { points: Math.round(points * 100) / 100, questions, problems };
}

export async function createQuiz(userId: number, classId: number, input: QuizInput) {
  await classAccess(userId, classId, { manage: true });
  if ((await prisma.workClassQuiz.count({ where: { classId, deletedAt: null } })) >= 300) throw new BadRequestError('A class can have at most 300 quizzes', 'WORK_LIMIT');
  const d = quizData({ title: input.title ?? 'Untitled quiz', ...input });
  checkWindow(d.openAt as Date | null | undefined, d.closeAt as Date | null | undefined);
  const row = await prisma.workClassQuiz.create({ data: { ...(d as Prisma.WorkClassQuizUncheckedCreateInput), classId, authorId: userId, title: (d.title as string) ?? 'Untitled quiz' }, select: { id: true } });
  return getQuiz(userId, classId, row.id);
}

function checkWindow(openAt: Date | null | undefined, closeAt: Date | null | undefined) {
  if (openAt && closeAt && closeAt <= openAt) throw new BadRequestError('The quiz must close after it opens', 'WORK_QUIZ_BAD');
}

export async function updateQuiz(userId: number, classId: number, quizId: number, input: QuizInput) {
  await classAccess(userId, classId, { manage: true });
  const quiz = await loadQuiz(classId, quizId);
  const d = quizData(input);
  const openAt = d.openAt !== undefined ? d.openAt as Date | null : quiz.openAt;
  const closeAt = d.closeAt !== undefined ? d.closeAt as Date | null : quiz.closeAt;
  checkWindow(openAt, closeAt);
  if (quiz.status === 'PUBLISHED' && d.items !== undefined) {
    const plan = planOf(d.items as unknown as QuizItem[], await bankFor(classId, d.items as unknown as QuizItem[]));
    if (plan.problems.length) throw new BadRequestError(plan.problems.join(' · '), 'WORK_QUIZ_NOT_READY');
    if (!plan.questions) throw new BadRequestError('Add at least one question', 'WORK_QUIZ_NOT_READY');
  }
  await prisma.workClassQuiz.update({ where: { id: quizId }, data: d });
  if (quiz.status === 'PUBLISHED' && d.title !== undefined) await syncStream(classId, quizId, userId);
  return getQuiz(userId, classId, quizId);
}

export async function deleteQuiz(userId: number, classId: number, quizId: number) {
  await classAccess(userId, classId, { manage: true });
  await loadQuiz(classId, quizId);
  await prisma.workClassQuiz.update({ where: { id: quizId }, data: { deletedAt: new Date() } });
  await syncStream(classId, quizId, userId);
}

/** Giao quiz: kiểm đủ câu (đã duyệt), đăng bảng tin (một lần), đưa hạn vào lịch lớp. `publish:false` ⇒ thu về nháp (chỉ khi chưa ai làm). */
export async function publishQuiz(userId: number, classId: number, quizId: number, publish = true) {
  await classAccess(userId, classId, { manage: true });
  const quiz = await loadQuiz(classId, quizId);
  if (!publish) {
    if (await prisma.workClassQuizAttempt.count({ where: { quizId } })) throw new AppError('Students have already started this quiz — close it instead (set the close time).', 409, 'WORK_QUIZ_HAS_ATTEMPTS');
    await prisma.workClassQuiz.update({ where: { id: quizId }, data: { status: 'DRAFT' } });
    await syncStream(classId, quizId, userId);
    return getQuiz(userId, classId, quizId);
  }
  const items = itemsOf(quiz.items);
  const plan = planOf(items, await bankFor(classId, items));
  if (!plan.questions) throw new BadRequestError('Add at least one question before assigning', 'WORK_QUIZ_NOT_READY');
  if (plan.problems.length) throw new BadRequestError(plan.problems.join(' · '), 'WORK_QUIZ_NOT_READY');
  const now = new Date();
  await prisma.workClassQuiz.update({ where: { id: quizId }, data: { status: 'PUBLISHED', publishedAt: quiz.publishedAt ?? now } });
  await prisma.workClassQuiz.updateMany({ where: { id: quizId, announcedAt: null }, data: { announcedAt: now } });
  await syncStream(classId, quizId, userId);
  return getQuiz(userId, classId, quizId);
}

// ─── Đọc quiz ───────────────────────────────────────────────────

const quizBrief = (q: QuizRow) => ({
  id: q.id, title: q.title, description: q.description, topic: q.topic, status: q.status, openAt: q.openAt, closeAt: q.closeAt,
  timeLimitMin: q.timeLimitMin, maxAttempts: q.maxAttempts, shuffleQuestions: q.shuffleQuestions, shuffleOptions: q.shuffleOptions,
  layout: q.layout as QuizLayout, showAnswers: q.showAnswers as ShowAnswers, scoring: q.scoring as Scoring, publishedAt: q.publishedAt,
  createdAt: q.createdAt, updatedAt: q.updatedAt,
});

function windowState(q: Pick<QuizRow, 'status' | 'openAt' | 'closeAt'>, now: Date): 'DRAFT' | 'SCHEDULED' | 'OPEN' | 'CLOSED' {
  if (q.status !== 'PUBLISHED') return 'DRAFT';
  if (q.openAt && now < q.openAt) return 'SCHEDULED';
  if (q.closeAt && now >= q.closeAt) return 'CLOSED';
  return 'OPEN';
}

export async function listQuizzes(userId: number, classId: number) {
  const { manage } = await classAccess(userId, classId);
  await finalizeExpired({ classId, ...(manage ? {} : { userId }) });
  const now = new Date();
  const rows = await prisma.workClassQuiz.findMany({
    where: { classId, deletedAt: null, ...(manage ? {} : { status: 'PUBLISHED' }) },
    orderBy: [{ closeAt: { sort: 'asc', nulls: 'last' } }, { createdAt: 'desc' }],
  });
  const ids = rows.map((r) => r.id);
  const attempts = ids.length ? await prisma.workClassQuizAttempt.findMany({
    where: { quizId: { in: ids }, ...(manage ? { status: 'SUBMITTED' } : { userId }) },
    orderBy: [{ number: 'asc' }],
    select: { id: true, quizId: true, userId: true, number: true, status: true, score: true, maxScore: true, deadlineAt: true },
  }) : [];
  const allBank = manage ? await prisma.workClassQuizQuestion.findMany({ where: { classId, archivedAt: null, approvedAt: { not: null } }, select: QUESTION_SELECT }) : null;
  const studentCount = manage ? await prisma.workClassStudent.count({ where: { classId, userId: { not: null } } }) : 0;
  return {
    manage,
    serverNow: now,
    quizzes: await Promise.all(rows.map(async (q) => {
      const items = itemsOf(q.items);
      const plan = planOf(items, allBank ? allBank.map(toBank) : await bankFor(classId, items));
      const mine = attempts.filter((a) => a.quizId === q.id);
      const base = { ...quizBrief(q), state: windowState(q, now), questionCount: plan.questions, totalPoints: plan.points };
      if (manage) {
        const users = new Set(mine.map((a) => a.userId));
        const counted = [...users].map((u) => aggregateScore(mine.filter((a) => a.userId === u).map((a) => ({ score: a.score ?? 0, max: a.maxScore })), q.scoring as Scoring)).filter(Boolean) as Array<{ score: number; max: number }>;
        const avg = counted.length ? counted.reduce((s, c) => s + (c.max ? c.score / c.max : 0), 0) / counted.length : null;
        return { ...base, problems: plan.problems, submittedStudents: users.size, students: studentCount, averagePct: avg === null ? null : Math.round(avg * 1000) / 10 };
      }
      return { ...base, me: myState(q, mine, now) };
    })),
  };
}

function myState(q: QuizRow, mine: Array<{ id: number; status: string; score: number | null; maxScore: number }>, now: Date) {
  const submitted = mine.filter((a) => a.status === 'SUBMITTED');
  const inProgress = mine.find((a) => a.status === 'IN_PROGRESS') ?? null;
  const state = windowState(q, now);
  const counted = aggregateScore(submitted.map((a) => ({ score: a.score ?? 0, max: a.maxScore })), q.scoring as Scoring);
  const canStart = state === 'OPEN' && !inProgress && mine.length < q.maxAttempts;
  return {
    attemptsUsed: mine.length, attemptsLeft: Math.max(0, q.maxAttempts - mine.length), inProgressId: inProgress?.id ?? null,
    lastAttemptId: mine.length ? mine[mine.length - 1].id : null,
    score: counted, canStart, canResume: !!inProgress,
  };
}

/** Giảng viên: quiz đủ cấu hình + mục + câu dùng; sinh viên: thông tin + trạng thái của mình (KHÔNG mục/câu hỏi). */
export async function getQuiz(userId: number, classId: number, quizId: number) {
  const { manage } = await classAccess(userId, classId);
  const quiz = await loadQuiz(classId, quizId);
  if (!manage && quiz.status !== 'PUBLISHED') throw new NotFoundError('Quiz not found');
  await finalizeExpired({ quizId, ...(manage ? {} : { userId }) });
  const now = new Date();
  const items = itemsOf(quiz.items);
  const bank = await bankFor(classId, items);
  const plan = planOf(items, bank);
  const base = { ...quizBrief(quiz), state: windowState(quiz, now), questionCount: plan.questions, totalPoints: plan.points, serverNow: now };
  if (!manage) {
    const mine = await prisma.workClassQuizAttempt.findMany({
      where: { quizId, userId }, orderBy: { number: 'asc' },
      select: { id: true, number: true, status: true, score: true, maxScore: true, startedAt: true, submittedAt: true, autoSubmitted: true },
    });
    return { ...base, manage: false as const, attempts: mine, me: myState(quiz, mine, now) };
  }
  const attemptCount = await prisma.workClassQuizAttempt.count({ where: { quizId } });
  const topics = await prisma.workClassQuizQuestion.groupBy({ by: ['topic'], where: { classId, archivedAt: null, approvedAt: { not: null } }, _count: { _all: true } });
  return {
    ...base, manage: true as const, items, problems: plan.problems, attemptCount,
    questions: bank.filter((q) => items.some((i) => i.kind === 'Q' && i.questionId === q.id)),
    topics: topics.map((t) => ({ topic: t.topic, count: t._count._all })),
  };
}

/** Giảng viên xem thử: một đề rút theo seed ngẫu nhiên, CÓ đáp án. */
export async function previewQuiz(userId: number, classId: number, quizId: number) {
  await classAccess(userId, classId, { manage: true });
  const quiz = await loadQuiz(classId, quizId);
  const items = itemsOf(quiz.items);
  const { paper, missing } = buildPaper(items, await bankFor(classId, items), quiz, randomInt(1, 2 ** 31 - 1));
  return { missing, paper: paper.map((p) => ({ ...studentPaper([p])[0], answer: displayAnswer(p), explanation: p.explanation, topic: p.topic, settings: p.settings })) };
}

// ═══ Lượt làm ════════════════════════════════════════════════════

type AttemptRow = NonNullable<Awaited<ReturnType<typeof prisma.workClassQuizAttempt.findFirst>>>;

/** Chấm + chốt một lượt (đang làm ⇒ đã nộp). Nguyên tử: chỉ một lời gọi thắng. */
async function finalize(a: AttemptRow, auto: boolean, at: Date) {
  const res = gradePaper(asPaper(a.paper), asRec<QResponse>(a.responses), asRec<number>(a.manual));
  const r = await prisma.workClassQuizAttempt.updateMany({
    where: { id: a.id, status: 'IN_PROGRESS' },
    data: {
      status: 'SUBMITTED', submittedAt: auto && a.deadlineAt ? a.deadlineAt : at, autoSubmitted: auto,
      score: res.score, maxScore: res.max, results: res.items as unknown as Prisma.InputJsonValue,
    },
  });
  return r.count > 0;
}

/** Tự nộp mọi lượt đã quá hạn (+ ân hạn) — lười, gọi ở mọi lối đọc. */
export async function finalizeExpired(scope: { quizId?: number; classId?: number; userId?: number }) {
  const cutoff = new Date(Date.now() - SAVE_GRACE_MS);
  const rows = await prisma.workClassQuizAttempt.findMany({
    where: {
      status: 'IN_PROGRESS', deadlineAt: { lt: cutoff },
      ...(scope.quizId ? { quizId: scope.quizId } : {}), ...(scope.userId ? { userId: scope.userId } : {}),
      ...(scope.classId ? { quiz: { classId: scope.classId } } : {}),
    },
    take: 500,
  });
  for (const a of rows) await finalize(a, true, new Date());
  return rows.length;
}

async function loadAttempt(classId: number, quizId: number, attemptId: number) {
  const a = await prisma.workClassQuizAttempt.findFirst({ where: { id: attemptId, quizId, quiz: { classId, deletedAt: null } } });
  if (!a) throw new NotFoundError('Attempt not found');
  return a;
}

const expired = (a: Pick<AttemptRow, 'deadlineAt'>, now: number) => !!a.deadlineAt && now > a.deadlineAt.getTime() + SAVE_GRACE_MS;

/** Bắt đầu (hoặc làm tiếp) một lượt. Chỉ sinh viên của lớp. */
export async function startAttempt(userId: number, classId: number, quizId: number) {
  const { role } = await classAccess(userId, classId);
  if (role !== 'STUDENT') throw new ForbiddenError('Lecturers preview the quiz instead of taking it');
  const quiz = await loadQuiz(classId, quizId);
  if (quiz.status !== 'PUBLISHED') throw new NotFoundError('Quiz not found');
  await finalizeExpired({ quizId, userId });
  const open = await prisma.workClassQuizAttempt.findFirst({ where: { quizId, userId, status: 'IN_PROGRESS' } });
  if (open) return studentAttemptView(quiz, open);
  const now = new Date();
  const state = windowState(quiz, now);
  if (state === 'SCHEDULED') throw new AppError('This quiz is not open yet', 409, 'WORK_QUIZ_NOT_OPEN');
  if (state === 'CLOSED') throw new AppError('This quiz is closed', 409, 'WORK_QUIZ_CLOSED');
  const used = await prisma.workClassQuizAttempt.count({ where: { quizId, userId } });
  if (used >= quiz.maxAttempts) throw new AppError('You have used all your attempts', 409, 'WORK_QUIZ_NO_ATTEMPTS');
  const items = itemsOf(quiz.items);
  const seed = randomInt(1, 2 ** 31 - 1);
  const { paper, missing } = buildPaper(items, await bankFor(classId, items), quiz, seed);
  if (missing || !paper.length) throw new AppError('This quiz is missing questions — tell your lecturer', 409, 'WORK_QUIZ_NOT_READY');
  const max = Math.round(paper.reduce((s, p) => s + p.points, 0) * 100) / 100;
  try {
    const a = await prisma.workClassQuizAttempt.create({
      data: {
        quizId, userId, number: used + 1, seed, paper: paper as unknown as Prisma.InputJsonValue, maxScore: max,
        startedAt: now, deadlineAt: attemptDeadline(now, quiz.timeLimitMin, quiz.closeAt),
      },
    });
    return studentAttemptView(quiz, a);
  } catch (err) {
    // Hai lần bấm "Bắt đầu" cùng lúc ⇒ trùng (quiz, người, số lượt): trả lượt đã tạo.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const again = await prisma.workClassQuizAttempt.findFirst({ where: { quizId, userId, status: 'IN_PROGRESS' } });
      if (again) return studentAttemptView(quiz, again);
      throw new AppError('You have used all your attempts', 409, 'WORK_QUIZ_NO_ATTEMPTS');
    }
    throw err;
  }
}

/**
 * Bản xem lượt làm CHO SINH VIÊN. Đang làm: đề đã lọc (không đáp án) + câu đã lưu + đồng hồ máy chủ.
 * Đã nộp: điểm; khi `answersVisible` ⇒ thêm đáp án đúng (id hiển thị), giải thích, đúng/sai từng câu.
 */
function studentAttemptView(quiz: QuizRow, a: AttemptRow) {
  const now = new Date();
  const paper = asPaper(a.paper);
  const responses = asRec<QResponse>(a.responses);
  const base = {
    id: a.id, quizId: quiz.id, number: a.number, status: a.status as 'IN_PROGRESS' | 'SUBMITTED', layout: quiz.layout as QuizLayout,
    title: quiz.title, startedAt: a.startedAt, deadlineAt: a.deadlineAt, serverNow: now, timeLimitMin: quiz.timeLimitMin,
    paper: studentPaper(paper), responses, lastSavedAt: a.lastSavedAt,
  };
  if (a.status !== 'SUBMITTED') return { ...base, submittedAt: null, score: null, maxScore: a.maxScore, autoSubmitted: false, reveal: false as const, review: null };
  const reveal = answersVisible(quiz.showAnswers as ShowAnswers, quiz.closeAt, true, now);
  const results = asRec<{ earned: number; max: number; correct: boolean; partial: boolean }>(a.results);
  return {
    ...base, submittedAt: a.submittedAt, score: a.score, maxScore: a.maxScore, autoSubmitted: a.autoSubmitted, reveal,
    revealAt: quiz.showAnswers === 'AFTER_DUE' && quiz.closeAt && !reveal ? quiz.closeAt : null,
    review: reveal
      ? Object.fromEntries(paper.map((p) => [p.key, { answer: displayAnswer(p), explanation: p.explanation, earned: results[p.key]?.earned ?? 0, max: p.points, correct: !!results[p.key]?.correct, partial: !!results[p.key]?.partial }]))
      : null,
  };
}

/** Bản xem lượt cho GIẢNG VIÊN: đủ đáp án, câu trả lời, điểm từng câu, chỉnh tay, rời tab. */
function teacherAttemptView(a: AttemptRow) {
  const paper = asPaper(a.paper);
  const results = asRec<{ earned: number; max: number; correct: boolean; partial: boolean; answered: boolean; manual?: number | null }>(a.results);
  const live = a.status === 'SUBMITTED' ? null : gradePaper(paper, asRec<QResponse>(a.responses), asRec<number>(a.manual)).items;
  return {
    id: a.id, userId: a.userId, number: a.number, status: a.status, score: a.score, maxScore: a.maxScore, startedAt: a.startedAt,
    deadlineAt: a.deadlineAt, submittedAt: a.submittedAt, autoSubmitted: a.autoSubmitted, blurCount: a.blurCount, blurLog: a.blurLog,
    manual: asRec<number>(a.manual), gradedAt: a.gradedAt,
    items: paper.map((p) => ({
      ...studentPaper([p])[0], questionId: p.questionId, topic: p.topic, explanation: p.explanation, settings: p.settings,
      answer: displayAnswer(p), response: asRec<QResponse>(a.responses)[p.key] ?? null, result: (live ?? results)[p.key] ?? null,
    })),
  };
}

export async function getAttempt(userId: number, classId: number, quizId: number, attemptId: number) {
  const { manage } = await classAccess(userId, classId);
  const quiz = await loadQuiz(classId, quizId);
  let a = await loadAttempt(classId, quizId, attemptId);
  // SV khác ⇒ 404 (không lộ sự tồn tại); giảng viên xem mọi lượt.
  if (!manage && a.userId !== userId) throw new NotFoundError('Attempt not found');
  if (a.status === 'IN_PROGRESS' && expired(a, Date.now())) { await finalize(a, true, new Date()); a = await loadAttempt(classId, quizId, attemptId); }
  if (manage) {
    const u = await prisma.user.findUnique({ where: { id: a.userId }, select: PUBLIC_USER });
    return { manage: true as const, quiz: quizBrief(quiz), student: u, attempt: teacherAttemptView(a) };
  }
  return { manage: false as const, attempt: studentAttemptView(quiz, a) };
}

async function ownOpenAttempt(userId: number, classId: number, quizId: number, attemptId: number) {
  const { role } = await classAccess(userId, classId);
  if (role !== 'STUDENT') throw new ForbiddenError('Only the student taking the quiz can do this');
  const quiz = await loadQuiz(classId, quizId);
  const a = await loadAttempt(classId, quizId, attemptId);
  if (a.userId !== userId) throw new NotFoundError('Attempt not found');
  return { quiz, a };
}

/** Lưu câu trả lời (gộp theo khoá câu). Quá hạn + ân hạn ⇒ tự nộp phần đã lưu và 409 WORK_QUIZ_TIME_UP. */
export async function saveAnswers(userId: number, classId: number, quizId: number, attemptId: number, input: { answers: Record<string, unknown> }) {
  const { a } = await ownOpenAttempt(userId, classId, quizId, attemptId);
  if (a.status !== 'IN_PROGRESS') throw new AppError('This attempt has already been submitted', 409, 'WORK_QUIZ_SUBMITTED');
  if (expired(a, Date.now())) {
    await finalize(a, true, new Date());
    throw new AppError('Time is up — your saved answers were submitted', 409, 'WORK_QUIZ_TIME_UP');
  }
  const paper = asPaper(a.paper);
  const keys = Object.keys(input.answers ?? {}).slice(0, LIMITS.questionsPerQuiz);
  const saved = await prisma.$transaction(async (tx) => {
    // Khoá dòng: hai lần lưu song song (hai câu khác nhau) không ghi đè mất câu của nhau.
    await tx.$queryRaw`SELECT id FROM work_class_quiz_attempts WHERE id = ${a.id} FOR UPDATE`;
    const cur = await tx.workClassQuizAttempt.findUnique({ where: { id: a.id }, select: { status: true, responses: true, deadlineAt: true } });
    if (!cur || cur.status !== 'IN_PROGRESS') return null;
    if (expired(cur, Date.now())) return 'EXPIRED' as const;
    const next = { ...asRec<QResponse>(cur.responses) };
    for (const k of keys) {
      const p = paper.find((x) => x.key === k);
      if (!p) continue;
      const r = cleanResponse(p, input.answers[k]);
      if (r) next[k] = r; else delete next[k];
    }
    const at = new Date();
    await tx.workClassQuizAttempt.update({ where: { id: a.id }, data: { responses: next as unknown as Prisma.InputJsonValue, lastSavedAt: at } });
    return { at, responses: next };
  });
  if (saved === null) throw new AppError('This attempt has already been submitted', 409, 'WORK_QUIZ_SUBMITTED');
  if (saved === 'EXPIRED') {
    const fresh = await loadAttempt(classId, quizId, attemptId);
    await finalize(fresh, true, new Date());
    throw new AppError('Time is up — your saved answers were submitted', 409, 'WORK_QUIZ_TIME_UP');
  }
  return { savedAt: saved.at, serverNow: new Date(), deadlineAt: a.deadlineAt, saved: Object.keys(saved.responses).length };
}

export async function submitAttempt(userId: number, classId: number, quizId: number, attemptId: number, input: { answers?: Record<string, unknown> } = {}) {
  const { quiz, a } = await ownOpenAttempt(userId, classId, quizId, attemptId);
  if (a.status === 'IN_PROGRESS') {
    let timeUp = false;
    if (input.answers && Object.keys(input.answers).length) {
      try { await saveAnswers(userId, classId, quizId, attemptId, { answers: input.answers }); } catch (err) {
        if ((err as AppError).code === 'WORK_QUIZ_TIME_UP') timeUp = true; else throw err;
      }
    }
    if (!timeUp) {
      const fresh = await loadAttempt(classId, quizId, attemptId);
      await finalize(fresh, expired(fresh, Date.now()), new Date());
    }
  }
  return studentAttemptView(quiz, await loadAttempt(classId, quizId, attemptId));
}

/** Rời tab / quay lại: chỉ ghi nhận cho giảng viên xem, không chặn gì. */
export async function logFocus(userId: number, classId: number, quizId: number, attemptId: number, input: { event: 'blur' | 'focus' }) {
  const { a } = await ownOpenAttempt(userId, classId, quizId, attemptId);
  if (a.status !== 'IN_PROGRESS' || expired(a, Date.now())) return { blurCount: a.blurCount };
  const log = (Array.isArray(a.blurLog) ? a.blurLog : []) as Array<{ t: string; e: string }>;
  const next = [...log, { t: new Date().toISOString(), e: input.event }].slice(-200);
  const r = await prisma.workClassQuizAttempt.update({
    where: { id: a.id },
    data: { blurLog: next as unknown as Prisma.InputJsonValue, ...(input.event === 'blur' ? { blurCount: { increment: 1 } } : {}) },
    select: { blurCount: true },
  });
  return r;
}

// ═══ Kết quả · chấm tay · thống kê · xuất ═════════════════════════

async function rosterUsers(classId: number) {
  return prisma.workClassStudent.findMany({
    where: { classId, userId: { not: null } },
    orderBy: [{ studentCode: 'asc' }, { id: 'asc' }],
    select: { id: true, userId: true, studentCode: true, fullName: true, email: true, user: { select: PUBLIC_USER } },
  });
}

export async function results(userId: number, classId: number, quizId: number) {
  await classAccess(userId, classId, { manage: true });
  const quiz = await loadQuiz(classId, quizId);
  await finalizeExpired({ quizId });
  const [roster, attempts] = await Promise.all([
    rosterUsers(classId),
    prisma.workClassQuizAttempt.findMany({
      where: { quizId }, orderBy: [{ userId: 'asc' }, { number: 'asc' }],
      select: { id: true, userId: true, number: true, status: true, score: true, maxScore: true, startedAt: true, submittedAt: true, autoSubmitted: true, blurCount: true, results: true, paper: true, manual: true },
    }),
  ]);
  const rows = roster.map((s) => {
    const mine = attempts.filter((a) => a.userId === s.userId);
    const done = mine.filter((a) => a.status === 'SUBMITTED');
    const counted = aggregateScore(done.map((a) => ({ score: a.score ?? 0, max: a.maxScore })), quiz.scoring as Scoring);
    // "Nên xem lại": câu điền ngắn đã trả lời nhưng chấm sai, chưa chỉnh tay.
    const review = done.reduce((n, a) => {
      const res = asRec<{ answered: boolean; correct: boolean }>(a.results);
      const man = asRec<number>(a.manual);
      return n + asPaper(a.paper).filter((p) => p.type === 'SHORT' && res[p.key]?.answered && !res[p.key]?.correct && man[p.key] === undefined).length;
    }, 0);
    return {
      studentId: s.id, userId: s.userId, studentCode: s.studentCode, name: s.user ? displayName(s.user) : s.fullName, user: s.user,
      attempts: mine.map((a) => ({
        id: a.id, number: a.number, status: a.status, score: a.score, maxScore: a.maxScore, startedAt: a.startedAt, submittedAt: a.submittedAt,
        autoSubmitted: a.autoSubmitted, blurCount: a.blurCount,
        durationSec: a.submittedAt ? Math.round((a.submittedAt.getTime() - a.startedAt.getTime()) / 1000) : null,
      })),
      counted, needsReview: review,
    };
  });
  return { quiz: quizBrief(quiz), rows };
}

/** Giảng viên chỉnh điểm một câu của một lượt đã nộp (null = bỏ chỉnh, về điểm tự chấm). */
export async function gradeItemManually(userId: number, classId: number, quizId: number, attemptId: number, input: { key: string; points: number | null }) {
  await classAccess(userId, classId, { manage: true });
  await loadQuiz(classId, quizId);
  const a = await loadAttempt(classId, quizId, attemptId);
  if (a.status !== 'SUBMITTED') throw new AppError('Grade after the student submits', 409, 'WORK_QUIZ_NOT_SUBMITTED');
  const paper = asPaper(a.paper);
  const item = paper.find((p) => p.key === input.key);
  if (!item) throw new NotFoundError('Question not found in this attempt');
  const manual = { ...asRec<number>(a.manual) };
  if (input.points === null) delete manual[input.key];
  else {
    if (!(input.points >= 0 && input.points <= item.points)) throw new BadRequestError(`Points must be between 0 and ${item.points}`, 'VALIDATION_ERROR');
    manual[input.key] = Math.round(input.points * 100) / 100;
  }
  const res = gradePaper(paper, asRec<QResponse>(a.responses), manual);
  await prisma.workClassQuizAttempt.update({
    where: { id: a.id },
    data: { manual: manual as Prisma.InputJsonValue, results: res.items as unknown as Prisma.InputJsonValue, score: res.score, maxScore: res.max, gradedById: userId, gradedAt: new Date() },
  });
  return getAttempt(userId, classId, quizId, attemptId);
}

/** Thống kê theo lượt ĐẦU TIÊN đã nộp của mỗi sinh viên (phân tích câu cổ điển: lượt sau đã "học đề"). */
export async function stats(userId: number, classId: number, quizId: number) {
  await classAccess(userId, classId, { manage: true });
  const quiz = await loadQuiz(classId, quizId);
  await finalizeExpired({ quizId });
  const rows = await prisma.workClassQuizAttempt.findMany({ where: { quizId, status: 'SUBMITTED' }, orderBy: [{ userId: 'asc' }, { number: 'asc' }] });
  const first = new Map<number, AttemptRow>();
  for (const r of rows) if (!first.has(r.userId)) first.set(r.userId, r);
  const input: StatAttempt[] = [...first.values()].map((a) => ({
    userId: a.userId, score: a.score ?? 0, max: a.maxScore, paper: asPaper(a.paper), responses: asRec<QResponse>(a.responses), items: asRec(a.results),
  }));
  const s = quizStats(input);
  const blur = [...first.values()].reduce((n, a) => n + a.blurCount, 0);
  const auto = [...first.values()].filter((a) => a.autoSubmitted).length;
  return { quiz: quizBrief(quiz), ...s, totalAttempts: rows.length, autoSubmitted: auto, blurEvents: blur };
}

export async function exportXlsx(userId: number, classId: number, quizId: number) {
  const r = await results(userId, classId, quizId);
  const st = await stats(userId, classId, quizId);
  const head: XStyle = { font: { b: true, color: 'FFFFFF' }, fill: '1F4E79', border: 'thin', align: { wrap: true, v: 'top' } };
  const cell: XStyle = { border: 'thin' };
  const maxAttempts = Math.max(1, ...r.rows.map((x) => x.attempts.length));
  const s1 = new XSheet('Scores');
  const h1 = ['Student code', 'Name', 'Counted score', 'Max', '%', ...Array.from({ length: maxAttempts }, (_, i) => `Attempt ${i + 1}`), 'Tab switches', 'Auto-submitted', 'Short answers to review'];
  h1.forEach((h, i) => s1.set(1, i + 1, h, head));
  r.rows.forEach((row, i) => {
    const y = i + 2;
    s1.set(y, 1, row.studentCode ?? '', cell).set(y, 2, row.name ?? '', cell);
    s1.set(y, 3, row.counted?.score ?? null, cell).set(y, 4, row.counted?.max ?? null, cell);
    s1.set(y, 5, row.counted && row.counted.max ? Math.round((row.counted.score / row.counted.max) * 1000) / 10 : null, cell);
    for (let k = 0; k < maxAttempts; k++) {
      const a = row.attempts[k];
      s1.set(y, 6 + k, a ? (a.status === 'SUBMITTED' ? a.score : 'in progress') : null, cell);
    }
    s1.set(y, 6 + maxAttempts, row.attempts.reduce((n, a) => n + a.blurCount, 0), cell);
    s1.set(y, 7 + maxAttempts, row.attempts.filter((a) => a.autoSubmitted).length, cell);
    s1.set(y, 8 + maxAttempts, row.needsReview, cell);
  });
  [14, 28, 12, 8, 8].forEach((w, i) => s1.width(i + 1, w));
  s1.freeze = { col: 2, row: 1 };
  const s2 = new XSheet('Item analysis');
  ['#', 'Question', 'Type', 'Answered', 'Blank', 'Difficulty (p)', 'Discrimination (D)', 'Top distractor', 'Distractor share', 'Option counts'].forEach((h, i) => s2.set(1, i + 1, h, head));
  st.questions.forEach((q, i) => {
    const y = i + 2;
    s2.set(y, 1, q.questionId, cell).set(y, 2, q.prompt.slice(0, 500), { ...cell, align: { wrap: true, v: 'top' } }).set(y, 3, q.type, cell).set(y, 4, q.n - q.blank, cell).set(y, 5, q.blank, cell);
    s2.set(y, 6, q.difficulty, cell).set(y, 7, q.discrimination, cell).set(y, 8, q.topDistractor?.text ?? '', cell).set(y, 9, q.topDistractor?.share ?? null, cell);
    s2.set(y, 10, q.choices.map((c) => `${c.correct ? '✓ ' : ''}${c.text}: ${c.count}`).join(' | '), { ...cell, align: { wrap: true, v: 'top' } });
  });
  [6, 60, 12, 10, 8, 14, 18, 30, 14, 60].forEach((w, i) => s2.width(i + 1, w));
  const s3 = new XSheet('Summary');
  const lines: Array<[string, string | number | null]> = [
    ['Quiz', r.quiz.title], ['Students with a submitted attempt', st.attempts], ['Submitted attempts (all)', st.totalAttempts],
    ['Mean %', st.mean === null ? null : Math.round(st.mean * 1000) / 10], ['Median %', st.median === null ? null : Math.round(st.median * 1000) / 10],
    ['Std dev %', st.sd === null ? null : Math.round(st.sd * 1000) / 10], ['Auto-submitted (time up)', st.autoSubmitted], ['Tab switches (first attempts)', st.blurEvents],
    ['Scoring', r.quiz.scoring], ['Statistics use', 'each student’s FIRST submitted attempt'],
  ];
  lines.forEach(([k, v], i) => { s3.set(i + 1, 1, k, { font: { b: true } }).set(i + 1, 2, v); });
  s3.set(lines.length + 2, 1, 'Score band', head).set(lines.length + 2, 2, 'Students', head);
  st.bins.forEach((b, i) => s3.set(lines.length + 3 + i, 1, `${b.from}–${b.to}%`, cell).set(lines.length + 3 + i, 2, b.count, cell));
  s3.width(1, 34).width(2, 40);
  const safe = r.quiz.title.replace(/[^\p{L}\p{N} _-]+/gu, '').trim().slice(0, 60) || 'quiz';
  return { buf: writeXlsx([s1, s2, s3], { title: r.quiz.title }), fileName: `${safe} - results.xlsx` };
}

// ═══ Chỗ giao nhau: Classwork (9b/9a), sổ điểm (9b), bảng tin + lịch (9a) ═══

const quizLink = (quizId: number) => ({ tab: 'classwork', q: String(quizId) });

/** Mục Classwork của quiz cho danh sách chung (gộp ở API/FE với bài tập 9b). Sinh viên chỉ thấy quiz đã giao. */
export async function quizClassworkItems(userId: number, classId: number) {
  const r = await listQuizzes(userId, classId);
  return r.quizzes.map((q) => ({
    kind: 'QUIZ' as const, refId: q.id, title: q.title, topic: q.topic, dueAt: q.closeAt, openAt: q.openAt, status: q.status, state: q.state,
    maxPoints: q.totalPoints, link: quizLink(q.id),
  }));
}

/** Hạn quiz cho LỊCH LỚP (9a) — cùng hình dạng với `assignmentDeadlines` của 9b. Sinh viên chỉ thấy quiz đã giao. */
export async function quizDeadlines(userId: number, classId: number, range: { from: Date; to: Date }) {
  const { manage } = await classAccess(userId, classId);
  const rows = await prisma.workClassQuiz.findMany({
    where: { classId, deletedAt: null, status: 'PUBLISHED', closeAt: { gte: range.from, lte: range.to } },
    orderBy: { closeAt: 'asc' }, select: { id: true, title: true, topic: true, closeAt: true, openAt: true },
  });
  void manage;
  return rows.map((q) => ({ kind: 'QUIZ' as const, refId: q.id, title: q.title, at: q.closeAt!, topic: q.topic, openAt: q.openAt, link: quizLink(q.id) }));
}

/**
 * Bảng tin (9a `postStreamItem` — upsert theo (lớp, 'QUIZ', id): gọi lại khi sửa là CẬP NHẬT dòng cũ; chuông + email cho
 * sinh viên ĐÚNG MỘT LẦN do 9a lo) ⇒ quiz không tự gửi thông báo riêng. Lịch lớp: 9a KÉO `quizDeadlines` — không đẩy.
 * Quiz thu về nháp / bị xoá ⇒ `removeStreamItem`. Lỗi bảng tin không làm hỏng thao tác quiz.
 */
async function syncStream(classId: number, quizId: number, actorId: number) {
  try {
    const q = await prisma.workClassQuiz.findUnique({ where: { id: quizId } });
    if (!q || q.deletedAt || q.status !== 'PUBLISHED') { await removeStreamItem(classId, 'QUIZ', quizId); return; }
    await postStreamItem({ classId, kind: 'QUIZ', refType: 'QUIZ', refId: quizId, title: q.title, link: quizLink(quizId), actorId });
  } catch (err) { logger.warn('[quiz] bảng tin lỗi', { err: (err as Error).message }); }
}

// ─── Nguồn điểm của sổ điểm 9b (classGradebookSources.ts) ────────

registerGradebookSource({
  kind: 'quiz',
  async items(ctx: GradebookCtx): Promise<GradebookItem[]> {
    const quizzes = await prisma.workClassQuiz.findMany({
      where: { classId: ctx.classId, deletedAt: null, status: 'PUBLISHED' }, orderBy: [{ closeAt: { sort: 'asc', nulls: 'last' } }, { id: 'asc' }],
    });
    return Promise.all(quizzes.map(async (q) => {
      const items = itemsOf(q.items);
      const plan = planOf(items, await bankFor(ctx.classId, items));
      return {
        key: `quiz:${q.id}`, kind: 'quiz', refId: q.id, title: q.title, category: 'Quiz', topic: q.topic, maxPoints: plan.points || 1, dueAt: q.closeAt,
        importable: false, link: quizLink(q.id),
      };
    }));
  },
  async cells(ctx: GradebookCtx, items: GradebookItem[]): Promise<GradebookCell[]> {
    const mine = items.filter((i) => i.kind === 'quiz');
    if (!mine.length || !ctx.userIds.length) return [];
    await finalizeExpired({ classId: ctx.classId });
    // Sinh viên: chỉ ô của chính mình (sổ điểm còn lọc lần hai).
    const userIds = ctx.viewer.manage ? ctx.userIds : ctx.userIds.filter((u) => u === ctx.viewer.userId);
    const quizzes = await prisma.workClassQuiz.findMany({ where: { id: { in: mine.map((i) => i.refId) }, classId: ctx.classId }, select: { id: true, scoring: true, closeAt: true } });
    const attempts = await prisma.workClassQuizAttempt.findMany({
      where: { quizId: { in: quizzes.map((q) => q.id) }, userId: { in: userIds } },
      orderBy: [{ number: 'asc' }], select: { quizId: true, userId: true, status: true, score: true, maxScore: true },
    });
    const out: GradebookCell[] = [];
    for (const it of mine) {
      const q = quizzes.find((x) => x.id === it.refId);
      if (!q) continue;
      for (const uid of userIds) {
        const all = attempts.filter((a) => a.quizId === q.id && a.userId === uid);
        const done = all.filter((a) => a.status === 'SUBMITTED');
        const c = aggregateScore(done.map((a) => ({ score: a.score ?? 0, max: a.maxScore })), q.scoring as Scoring);
        // Điểm quy về thang của cột (đề rút ngẫu nhiên có thể khác tổng điểm giữa các lượt).
        const points = c ? (c.max ? Math.round((c.score / c.max) * it.maxPoints * 100) / 100 : 0) : null;
        const state: GradebookCellState = c ? 'RETURNED' : all.length ? 'TURNED_IN' : q.closeAt && ctx.now >= q.closeAt ? 'MISSING' : 'ASSIGNED';
        // Quiz tự chấm: điểm có ngay khi nộp và sinh viên đã thấy điểm của mình ⇒ released.
        out.push({ itemKey: it.key, userId: uid, points, released: true, state });
      }
    }
    return out;
  },
});
