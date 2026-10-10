/**
 * CTW đợt 9c (13/10/2026) — client cho QUIZ lớp học. Backend: src/routes/work.ctw9c.routes.ts + services/work/quiz.service.ts
 * (+ quizRules.ts) — đổi kiểu bên này thì đổi bên kia. Tách khỏi lib/work-api.ts để không giẫm tệp nhiều phiên cùng sửa.
 */

import { api } from '@/lib/api';
import type { WorkUser } from '@/lib/work-api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

export const QUESTION_TYPES = ['SINGLE', 'MULTI', 'TRUE_FALSE', 'SHORT', 'MATCH'] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];
export type ShowAnswers = 'IMMEDIATE' | 'AFTER_DUE' | 'NEVER';
export type Scoring = 'HIGHEST' | 'LAST' | 'AVERAGE';
export type QuizLayout = 'ALL' | 'ONE_PER_PAGE';
export type QuizState = 'DRAFT' | 'SCHEDULED' | 'OPEN' | 'CLOSED';

export interface QOption { id: string; text: string }
export interface QPair { id: string; left: string; right: string }
export interface QAnswer { correct?: string[]; value?: boolean; accepted?: string[] }
export interface QSettings { partial?: boolean; caseSensitive?: boolean; accentSensitive?: boolean }
export interface QuestionInput {
  type: QuestionType; topic: string; prompt: string; imageUrl: string | null; points: number; explanation: string | null;
  options: Array<QOption | QPair>; answer: QAnswer; settings: QSettings;
}
export interface BankQuestion extends QuestionInput {
  id: number; aiDraft: boolean; approvedAt: string | null; draft: boolean; usedIn: number; createdAt: string; updatedAt: string;
}
export interface BankView { questions: BankQuestion[]; topics: Array<{ topic: string; count: number }>; drafts: number }

export type QuizItem = { kind: 'Q'; questionId: number; points?: number | null } | { kind: 'DRAW'; topic: string; count: number; points?: number | null };

export interface QuizBrief {
  id: number; title: string; description: string | null; topic: string | null; status: 'DRAFT' | 'PUBLISHED';
  openAt: string | null; closeAt: string | null; timeLimitMin: number | null; maxAttempts: number; shuffleQuestions: boolean; shuffleOptions: boolean;
  layout: QuizLayout; showAnswers: ShowAnswers; scoring: Scoring; publishedAt: string | null; createdAt: string; updatedAt: string;
}
export interface MyQuizState {
  attemptsUsed: number; attemptsLeft: number; inProgressId: number | null; lastAttemptId: number | null;
  score: { score: number; max: number } | null; canStart: boolean; canResume: boolean;
}
export interface QuizListItem extends QuizBrief {
  state: QuizState; questionCount: number; totalPoints: number;
  problems?: string[]; submittedStudents?: number; students?: number; averagePct?: number | null;
  me?: MyQuizState;
}
export interface QuizList { manage: boolean; serverNow: string; quizzes: QuizListItem[] }

export interface QuizDetailTeacher extends QuizBrief {
  manage: true; state: QuizState; questionCount: number; totalPoints: number; serverNow: string;
  items: QuizItem[]; problems: string[]; attemptCount: number; questions: Array<QuestionInput & { id: number }>;
  topics: Array<{ topic: string; count: number }>;
}
export interface AttemptBrief { id: number; number: number; status: 'IN_PROGRESS' | 'SUBMITTED'; score: number | null; maxScore: number; startedAt: string; submittedAt: string | null; autoSubmitted: boolean }
export interface QuizDetailStudent extends QuizBrief {
  manage: false; state: QuizState; questionCount: number; totalPoints: number; serverNow: string; attempts: AttemptBrief[]; me: MyQuizState;
}
export type QuizDetail = QuizDetailTeacher | QuizDetailStudent;

export interface PaperItem {
  key: string; type: QuestionType; prompt: string; imageUrl: string | null; points: number;
  options?: QOption[]; left?: QOption[]; right?: QOption[];
}
export interface Resp { choice?: string; choices?: string[]; value?: boolean; text?: string; pairs?: Record<string, string> }
export interface DisplayAnswer { correct?: string[]; value?: boolean; accepted?: string[]; pairs?: Record<string, string> }
export interface StudentAttempt {
  id: number; quizId: number; number: number; status: 'IN_PROGRESS' | 'SUBMITTED'; layout: QuizLayout; title: string;
  startedAt: string; deadlineAt: string | null; serverNow: string; timeLimitMin: number | null; paper: PaperItem[];
  responses: Record<string, Resp>; lastSavedAt: string | null; submittedAt: string | null; score: number | null; maxScore: number;
  autoSubmitted: boolean; reveal: boolean; revealAt?: string | null;
  review: Record<string, { answer: DisplayAnswer; explanation: string | null; earned: number; max: number; correct: boolean; partial: boolean }> | null;
}
export interface ItemResult { earned: number; max: number; correct: boolean; partial: boolean; answered: boolean; manual?: number | null }
export interface TeacherAttempt {
  id: number; userId: number; number: number; status: 'IN_PROGRESS' | 'SUBMITTED'; score: number | null; maxScore: number; startedAt: string;
  deadlineAt: string | null; submittedAt: string | null; autoSubmitted: boolean; blurCount: number; blurLog: Array<{ t: string; e: string }>;
  manual: Record<string, number>; gradedAt: string | null;
  items: Array<PaperItem & { questionId: number; topic: string; explanation: string | null; settings: QSettings; answer: DisplayAnswer; response: Resp | null; result: ItemResult | null }>;
}
export type AttemptView = { manage: true; quiz: QuizBrief; student: WorkUser | null; attempt: TeacherAttempt } | { manage: false; attempt: StudentAttempt };

export interface ResultsRow {
  studentId: number; userId: number; studentCode: string | null; name: string | null; user: WorkUser | null;
  attempts: Array<{ id: number; number: number; status: string; score: number | null; maxScore: number; startedAt: string; submittedAt: string | null; autoSubmitted: boolean; blurCount: number; durationSec: number | null }>;
  counted: { score: number; max: number } | null; needsReview: number;
}
export interface QuestionStat {
  questionId: number; prompt: string; type: QuestionType; n: number; difficulty: number | null; discrimination: number | null;
  choices: Array<{ src: string; text: string; count: number; correct: boolean }>; topDistractor: { text: string; share: number } | null; blank: number;
}
export interface QuizStatsView {
  quiz: QuizBrief; attempts: number; mean: number | null; median: number | null; sd: number | null;
  bins: Array<{ from: number; to: number; count: number }>; questions: QuestionStat[]; totalAttempts: number; autoSubmitted: number; blurEvents: number;
}
export interface ImportPreview {
  total: number; valid: number; invalid: number; imported: number;
  rows: Array<{ line: number; source: string; errors: string[]; question: QuestionInput | null }>;
}
export type ImportFormat = 'table' | 'aiken' | 'gift';
export interface QuizInput {
  title?: string; description?: string | null; topic?: string | null; items?: QuizItem[]; openAt?: string | null; closeAt?: string | null;
  timeLimitMin?: number | null; maxAttempts?: number; shuffleQuestions?: boolean; shuffleOptions?: boolean; layout?: QuizLayout; showAnswers?: ShowAnswers; scoring?: Scoring;
}

export const quizKeys = {
  list: (cid: number) => ['work', 'classes', cid, 'quizzes'] as const,
  quiz: (cid: number, qid: number) => ['work', 'classes', cid, 'quizzes', qid] as const,
  bank: (cid: number, f?: object) => ['work', 'classes', cid, 'quiz-bank', f ?? {}] as const,
  bankAll: (cid: number) => ['work', 'classes', cid, 'quiz-bank'] as const,
  attempt: (cid: number, qid: number, aid: number) => ['work', 'classes', cid, 'quizzes', qid, 'attempt', aid] as const,
  results: (cid: number, qid: number) => ['work', 'classes', cid, 'quizzes', qid, 'results'] as const,
  stats: (cid: number, qid: number) => ['work', 'classes', cid, 'quizzes', qid, 'stats'] as const,
};

const base = (cid: number) => `/work/classes/${cid}`;
async function download(url: string, fallback: string) {
  const r = await api.get(url, { responseType: 'blob' });
  const cd = String(r.headers['content-disposition'] ?? '');
  const m = /filename\*=UTF-8''([^;]+)/.exec(cd);
  const name = m ? decodeURIComponent(m[1]) : fallback;
  const href = URL.createObjectURL(r.data as Blob);
  const a = document.createElement('a');
  a.href = href; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 2000);
}

export const quizApi = {
  bank: (cid: number, f: { topic?: string; q?: string; drafts?: boolean } = {}) => {
    const p = new URLSearchParams();
    if (f.topic) p.set('topic', f.topic);
    if (f.q) p.set('q', f.q);
    if (f.drafts) p.set('drafts', '1');
    const s = p.toString();
    return d<BankView>(api.get(`${base(cid)}/quiz-bank${s ? `?${s}` : ''}`));
  },
  createQuestion: (cid: number, q: QuestionInput) => d<BankQuestion>(api.post(`${base(cid)}/quiz-bank`, q)),
  updateQuestion: (cid: number, id: number, b: { question?: QuestionInput; approve?: boolean }) => d<BankQuestion>(api.patch(`${base(cid)}/quiz-bank/${id}`, b)),
  archiveQuestion: (cid: number, id: number) => d<{ archived: boolean }>(api.delete(`${base(cid)}/quiz-bank/${id}`)),
  uploadImage: (cid: number, dataBase64: string) => d<{ url: string }>(api.post(`${base(cid)}/quiz-bank/image`, { dataBase64 })),
  importQuestions: (cid: number, b: { format: ImportFormat; text?: string; xlsxBase64?: string; topic?: string; confirm?: boolean }) => d<ImportPreview>(api.post(`${base(cid)}/quiz-bank/import`, b)),
  template: (cid: number) => download(`${base(cid)}/quiz-bank/template.xlsx`, 'ctwork-quiz-import-template.xlsx'),
  aiSuggest: (cid: number, b: { source: string; count?: number; topic?: string; types?: QuestionType[]; language?: 'en' | 'vi' }) =>
    d<{ created: number; rejected: number; errors: Array<{ line: number; errors: string[] }> }>(api.post(`${base(cid)}/quiz-bank/ai-suggest`, b)),

  list: (cid: number) => d<QuizList>(api.get(`${base(cid)}/quizzes`)),
  create: (cid: number, b: QuizInput) => d<QuizDetailTeacher>(api.post(`${base(cid)}/quizzes`, b)),
  get: (cid: number, qid: number) => d<QuizDetail>(api.get(`${base(cid)}/quizzes/${qid}`)),
  update: (cid: number, qid: number, b: QuizInput) => d<QuizDetailTeacher>(api.patch(`${base(cid)}/quizzes/${qid}`, b)),
  remove: (cid: number, qid: number) => d<{ deleted: boolean }>(api.delete(`${base(cid)}/quizzes/${qid}`)),
  publish: (cid: number, qid: number, publish = true) => d<QuizDetailTeacher>(api.post(`${base(cid)}/quizzes/${qid}/publish`, { publish })),
  preview: (cid: number, qid: number) => d<{ missing: number; paper: Array<PaperItem & { answer: DisplayAnswer; explanation: string | null; topic: string }> }>(api.get(`${base(cid)}/quizzes/${qid}/preview`)),
  results: (cid: number, qid: number) => d<{ quiz: QuizBrief; rows: ResultsRow[] }>(api.get(`${base(cid)}/quizzes/${qid}/results`)),
  stats: (cid: number, qid: number) => d<QuizStatsView>(api.get(`${base(cid)}/quizzes/${qid}/stats`)),
  exportXlsx: (cid: number, qid: number) => download(`${base(cid)}/quizzes/${qid}/export.xlsx`, 'quiz-results.xlsx'),

  start: (cid: number, qid: number) => d<StudentAttempt>(api.post(`${base(cid)}/quizzes/${qid}/attempts`)),
  attempt: (cid: number, qid: number, aid: number) => d<AttemptView>(api.get(`${base(cid)}/quizzes/${qid}/attempts/${aid}`)),
  save: (cid: number, qid: number, aid: number, answers: Record<string, Resp | null>) =>
    d<{ savedAt: string; serverNow: string; deadlineAt: string | null; saved: number }>(api.put(`${base(cid)}/quizzes/${qid}/attempts/${aid}/answers`, { answers })),
  submit: (cid: number, qid: number, aid: number, answers?: Record<string, Resp | null>) => d<StudentAttempt>(api.post(`${base(cid)}/quizzes/${qid}/attempts/${aid}/submit`, answers ? { answers } : {})),
  focus: (cid: number, qid: number, aid: number, event: 'blur' | 'focus') => d<{ blurCount: number }>(api.post(`${base(cid)}/quizzes/${qid}/attempts/${aid}/focus`, { event })),
  grade: (cid: number, qid: number, aid: number, key: string, points: number | null) => d<AttemptView>(api.patch(`${base(cid)}/quizzes/${qid}/attempts/${aid}/grade`, { key, points })),
};

/** Tệp ⇒ base64 (không tiền tố data:). */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).replace(/^data:[^;]*;base64,/, ''));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export const isPair = (o: QOption | QPair): o is QPair => 'left' in o;
