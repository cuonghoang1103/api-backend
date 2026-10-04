/**
 * Ranh giới kiểu giữa Phòng thi desktop và mã web (04/10/2026).
 *
 * Cùng cách với `shims/web-modules.d.ts`: desktop chạy bộ cờ TypeScript chặt hơn
 * web, nên KHAI tường minh đúng phần bề mặt Phòng thi dùng thay vì để `tsc` đi
 * vào cây web. Khai báo `declare module` cùng tên được GỘP với bản ở
 * `web-modules.d.ts` (nơi khai `api` mặc định), không đè nhau.
 *
 * ⚠️ Không được `tsc` đối chiếu với mã thật. Chép NGUYÊN hình dạng từ
 * `frontend/src/lib/api.ts` (`examApi`, `ExamHeader`, `ExamTakingQuestion`,
 * `ExamPortalItem`) — web đổi payload thì sửa ở đây cùng lúc.
 */

declare module '@/lib/api' {
  type ExamKind = 'FE' | 'PE';
  type PeType = 'CODE' | 'WRITE' | 'SPEAK';
  type ExamQuestionKind = 'MCQ' | 'CODE' | 'WRITE' | 'SPEAK';
  /** Kiểu trả về tối giản của axios: chỉ `data` là thứ Phòng thi đọc. */
  type R<T> = Promise<{ data: T }>;

  export interface ExamMy {
    attempts: number;
    bestScore: number | null;
    lastScore: number | null;
    passed: boolean;
    lastAttemptId: number | null;
    inProgressId: number | null;
    aiInProgressId?: number | null;
  }
  export interface ExamHeader {
    id: number;
    courseId: number;
    kind: ExamKind;
    peType: PeType | null;
    title: string;
    description: string | null;
    code: string | null;
    durationMinutes: number;
    totalPoints: number;
    passMark: number;
    source: string;
    instructions: string | null;
    attachmentUrl: string | null;
    attachmentName: string | null;
    isPublished: boolean;
    sortOrder: number;
    questionCount?: number;
    my?: ExamMy | null;
  }
  export interface ExamTakingQuestion {
    id: number;
    kind: ExamQuestionKind;
    sortOrder: number;
    points: number;
    prompt: string;
    imageUrl: string | null;
    options: { text: string }[] | null;
    selectCount: number;
    multiSelect: boolean;
    language: string | null;
    starterCode: string | null;
    expectedOutput: string | null;
    speakingPrompts: { text: string; imageUrl?: string }[] | null;
  }
  export interface ExamPortalItem {
    id: number;
    courseId: number;
    kind: ExamKind;
    peType: PeType | null;
    title: string;
    code: string | null;
    durationMinutes: number;
    totalPoints: number;
    passMark: number;
    questionCount: number;
    course: { title: string; slug: string; courseCode: string | null } | null;
    semester: { name: string; ordinal: number; code: string } | null;
  }
  export const examApi: {
    listAll(): R<{ data: ExamPortalItem[] }>;
    getForTaking(examId: number): R<{ data: ExamHeader & { questions: ExamTakingQuestion[] } }>;
    start(examId: number, opts?: { aiAssisted?: boolean }): R<{ data: { attemptId: number; startedAt: string; expiresAt: string | null; resumed: boolean; aiAssisted: boolean } }>;
    myAttempts(examId?: number): R<unknown>;
    getAttempt(attemptId: number): R<unknown>;
    submitFe(attemptId: number, data: { answers: Record<string, number[]>; codeAnswers?: Record<string, string>; timeSpentSeconds?: number; integritySignals?: unknown }): R<unknown>;
    submitCode(attemptId: number, file: File, timeSpentSeconds?: number): R<unknown>;
    submitWrite(attemptId: number, data: { essays: Record<string, string>; images?: Record<number, File>; timeSpentSeconds?: number }): R<unknown>;
    submitSpeak(attemptId: number, questionId: number, audios: Blob[], timeSpentSeconds?: number): R<unknown>;
    genSpeakingQuestions(questionId: number, count?: number): R<{ data: { text: string }[] }>;
    deleteAttempt(attemptId: number): R<unknown>;
    toggleExamBookmark(examId: number): R<{ data: { bookmarked: boolean } }>;
    myExamBookmarks(): R<unknown>;
    toggleQuestionBookmark(questionId: number, note?: string): R<{ data: { bookmarked: boolean } }>;
    myQuestionBookmarks(): R<unknown>;
    updateQuestionBookmarkNote(questionId: number, note: string): R<unknown>;
  };
}

declare module '@/lib/utils' {
  /** "EN|||VI" → một ngôn ngữ; chuỗi không có `|||` trả nguyên. */
  export function pickLang(text: string | null | undefined, locale: 'en' | 'vi'): string;
  export function sanitizeHtml(html: string): string;
  export function stripInlineColors(html: string): string;
}

declare module '@/app/exam/ExamRichContent' {
  import type { ComponentType } from 'react';
  const ExamRichContent: ComponentType<{ html: string; L: 'en' | 'vi'; className?: string; inline?: boolean }>;
  export default ExamRichContent;
}

declare module '@/app/exam/ExamQuestionComments' {
  import type { ComponentType } from 'react';
  const ExamQuestionComments: ComponentType<{ questionId: number }>;
  export default ExamQuestionComments;
}

declare module '@/app/exam/[examId]/CuongMiniPanel' {
  import type { ComponentType } from 'react';
  const CuongMiniPanel: ComponentType<{ examId: number; attemptId: number; questionId: number; questionLabel: string; isVi: boolean }>;
  export default CuongMiniPanel;
}
