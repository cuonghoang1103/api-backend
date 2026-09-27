/**
 * Mục lục "nhẹ" của một khoá: đủ để vẽ mục lục, tổng quan buổi, kế hoạch và
 * ô 💡 Gợi ý — KHÔNG kèm nội dung bài (blocks). Nội dung từng buổi tải khi mở
 * (dynamic import, mỗi buổi một chunk) — xem `loadDay` trong course.ts.
 *
 * ⚠️ Tệp này KHÔNG được có import chạy thật (chỉ `import type`): script
 * `scripts/course-manifest.mts` nạp nó bằng Node thuần (tách kiểu), không qua
 * webpack, nên không có alias `@/` và không có đuôi tệp tự đoán.
 */
import type { Block, Lesson } from './types';

type VocabItem = Extract<Block, { t: 'vocab' }>['items'][number];

/** Một từ trong mục lục — đủ cho danh sách từ của buổi và ô 💡 Gợi ý. */
export type VocabMeta = Pick<VocabItem, 'w' | 'pos' | 'ipa' | 'vi'>;
export type QuizMeta = { id: string; title: string; lessonId: string; count: number };
/** Một bài không kèm nội dung; `ready` = bài đã soạn (có blocks). */
export type LessonMeta = Omit<Lesson, 'blocks'> & { ready: boolean };
export type DayMeta = {
  lessons: LessonMeta[];
  /** Tiêu đề các mục ngữ pháp (khối `h` trong bài kind `grammar`). */
  grammar: string[];
  vocab: VocabMeta[];
  quizzes: QuizMeta[];
  minutes: number;
};
/** Khoá = số buổi (`Day.n`) — riêng tệp manifest.ts sinh ra thì khoá theo số TỆP (baiN / ngayN). */
export type CourseManifest = Record<number, DayMeta>;

/** Bài đã soạn chưa — đọc cờ `ready` của mục lục, không có thì nhìn blocks. */
export const isReady = (l: Lesson) => l.ready ?? !!l.blocks?.length;

export function lessonMeta(l: Lesson): LessonMeta {
  return { id: l.id, kind: l.kind, title: l.title, goal: l.goal, minutes: l.minutes, ready: isReady(l) };
}

/** Tổng hợp một buổi từ nội dung đầy đủ — cùng một luật cho script sinh manifest và cho buổi viết thẳng trong data.ts. */
export function dayMeta(lessons: Lesson[]): DayMeta {
  const grammar: string[] = [];
  const vocab: VocabMeta[] = [];
  const quizzes: QuizMeta[] = [];
  for (const l of lessons) {
    for (const b of l.blocks ?? []) {
      if (l.kind === 'grammar' && b.t === 'h') grammar.push(b.text.replace(/^\d+\.\s*/, ''));
      if (b.t === 'vocab') vocab.push(...b.items.map(({ w, pos, ipa, vi }) => ({ w, pos, ipa, vi })));
      if (b.t === 'quiz' || b.t === 'mcq' || b.t === 'build' || b.t === 'readkanji') quizzes.push({ id: b.id, title: b.title, lessonId: l.id, count: b.items.length });
      if (b.t === 'dictation') quizzes.push({ id: b.id, title: b.title ?? 'Nghe chép đánh vần', lessonId: l.id, count: b.items.length });
    }
  }
  return { lessons: lessons.map(lessonMeta), grammar, vocab, quizzes, minutes: lessons.reduce((n, l) => n + l.minutes, 0) };
}
