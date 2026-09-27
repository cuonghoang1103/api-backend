/**
 * Một khoá học: mô tả + các hàm tổng hợp dựng từ danh sách ngày.
 * Mỗi khoá tạo một `Course` bằng `defineCourse` (vd. ielts/data.ts).
 */
import type { Block, Day, Kind, Lesson, Voice } from './types';

export type CourseDef = {
  /** Khoá lưu tiến độ trên máy chủ (`/ielts/tien-do` stage) — đổi là mất tiến độ cũ. */
  stage: string;
  /** Tiền tố localStorage. */
  storageKey: string;
  /** Chữ trên thanh trên cùng. */
  title: string;
  /** Nút quay lại. */
  backHref: string;
  /** "Ngày" / "Bài" — ở mục lục và lịch học. */
  unit: string;
  /** Chữ nhỏ trong khối tròn đầu bài: "Day" / "Lesson". */
  badgeWord: string;
  /** Số hiển thị của buổi n (mặc định n). Khoá Nhật có Bài 0 nên hiện n − 1. */
  shownNum?: (n: number) => number;
  intro: Lesson;
  days: Day[];
  kindLabel: Partial<Record<Kind, string>>;
  kindEn: Partial<Record<Kind, string>>;
  kindHue: Partial<Record<Kind, string>>;
  /** Giọng đọc mặc định của nút 🔊. */
  voice: Voice;
  /** Gia sư: tên hiển thị + môn gửi lên backend (đổi lời dặn cho AI). */
  tutor: { name: string; mon: 'ielts' | 'nhat' };
  /** Bối cảnh cho gia sư khi đang ở trang Kế hoạch. */
  planContext: string;
};

const DEFAULT_LABEL: Record<Kind, string> = {
  intro: 'Bắt đầu', grammar: 'Ngữ pháp', vocab: 'Từ vựng', listening: 'Nghe', reading: 'Đọc',
  writing: 'Viết', speaking: 'Nói', homework: 'Bài tập', conversation: 'Hội thoại', kanji: 'Chữ Hán',
  kana: 'Bảng chữ', review: 'Ôn tập',
};
const DEFAULT_HUE: Record<Kind, string> = {
  intro: '#6366f1', grammar: '#f59e0b', vocab: '#10b981', listening: '#0ea5e9', reading: '#f97316',
  writing: '#8b5cf6', speaking: '#ec4899', homework: '#4f46e5', conversation: '#e11d48', kanji: '#b45309',
  kana: '#0d9488', review: '#64748b',
};

type VocabItem = Extract<Block, { t: 'vocab' }>['items'][number];

export function defineCourse(def: CourseDef) {
  const allLessons: Lesson[] = [def.intro, ...def.days.flatMap((d) => d.lessons)];
  const readyLessons = allLessons.filter((l) => l.blocks?.length);
  // Tra từ cho ô 💡 Gợi ý. Từ tiếng Nhật viết `{学生|がくせい}` nên đăng ký CẢ ba
  // khoá: nguyên văn, dạng chữ Hán (学生) và dạng đọc (がくせい).
  const vocabIndex: Map<string, VocabItem> = new Map();
  for (const v of allLessons.flatMap((l) => (l.blocks ?? []).flatMap((b) => (b.t === 'vocab' ? b.items : [])))) {
    const base = v.w.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');
    const kana = v.w.replace(/\{[^|}]+\|([^}]+)\}/g, '$1');
    for (const k of [v.w, base, kana]) if (!vocabIndex.has(k.toLowerCase())) vocabIndex.set(k.toLowerCase(), v);
  }
  return {
    ...def,
    allLessons,
    readyLessons,
    vocabIndex,
    label: (k: Kind) => def.kindLabel[k] ?? DEFAULT_LABEL[k],
    en: (k: Kind) => def.kindEn[k] ?? DEFAULT_LABEL[k],
    hue: (k: Kind) => def.kindHue[k] ?? DEFAULT_HUE[k],
    dayOf: (lessonId: string) => def.days.find((d) => d.lessons.some((l) => l.id === lessonId)),
    /** "Ngày 3" / "Bài 2" — tên hiển thị của buổi n. */
    dayName: (n: number) => `${def.unit} ${def.shownNum ? def.shownNum(n) : n}`,
    dayNum: (n: number) => String(def.shownNum ? def.shownNum(n) : n).padStart(2, '0'),
  };
}
export type Course = ReturnType<typeof defineCourse>;

/** Chữ thuần của một bài — làm bối cảnh cho gia sư (backend cắt ở 4000 ký tự). */
export function lessonText(l: Lesson): string {
  const out: string[] = [`Bài: ${l.title}. Mục tiêu: ${l.goal}`];
  // Bỏ markup: **đậm**, ~~gạch~~, ==dạ quang==, {漢字|かな} → 漢字(かな).
  const strip = (s: string) => s.replace(/\*\*|~~|==/g, '').replace(/\{([^|}]+)\|([^}]+)\}/g, '$1($2)');
  for (const b of l.blocks ?? []) {
    switch (b.t) {
      case 'h': case 'p': out.push(strip(b.text)); break;
      case 'patterns': for (const r of b.rows) out.push(`${r.formula} (${r.vi}): ${r.examples.map((e) => e.en).join(' / ')}`); break;
      case 'table': out.push([b.caption, b.head.join(' | '), ...b.rows.map((r) => strip(r.join(' | ')))].filter(Boolean).join('\n')); break;
      case 'note': out.push(`${b.title}: ${b.items.map(strip).join(' ')}`); break;
      case 'examples': out.push(b.items.map((e) => e.en).join(' ')); break;
      case 'vocab': out.push(b.items.map((v) => `${v.w} (${v.pos}) = ${v.vi}`).join('; ')); break;
      case 'alphabet': out.push(b.groups.map((g) => `${g.sound}: ${g.letters.map((x) => x.l).join(' ')}`).join('; ')); break;
      case 'dictation': out.push(`Bài nghe chép ${b.items.length} câu đánh vần.`); break;
      case 'quiz': out.push(`${b.title}: ${b.items.map((q) => q.q).join(' / ')}`); break;
      case 'mcq': out.push(`${b.title}: ${b.items.map((q) => q.q).join(' / ')}`); break;
      case 'passage': out.push(`${b.title}\n${b.paras.map((x) => `${x.label ? `${x.label}. ` : ''}${x.text}`).join('\n')}`); break;
      case 'listen': out.push(`Bài nghe "${b.title}": ${b.lines.map((x) => `${x.who ? `${x.who}: ` : ''}${x.text}`).join(' ')}`); break;
      case 'dialogue': out.push(b.lines.map((x) => `${x.who}: ${x.text}`).join('\n')); break;
      case 'essay': out.push(`Đề viết ${b.task}: ${b.prompt}`); break;
      case 'chart': out.push(`Biểu đồ: ${b.title} (${b.labels.join(', ')})`); break;
      case 'speak': out.push(`Câu hỏi Speaking Part ${b.part}: ${b.questions.join(' / ')}`); break;
      case 'write': out.push(`${b.title} — tập viết tay: ${b.chars.join(' ')}`); break;
      case 'readkanji': out.push(`${b.title}: ${b.items.map((x) => strip(x.text)).join(' / ')}`); break;
      case 'build': out.push(`${b.title}: ${b.items.map((x) => `${x.vi} → ${x.answer.join('')}`).join(' / ')}`); break;
    }
  }
  return out.join('\n').slice(0, 3900);
}

/* ── Tổng hợp theo buổi ──────────────────────────────────────────────── */

/** Những gì một buổi gói gọn: điểm ngữ pháp, từ vựng, kỹ năng, bài tập. */
export function daySummary(d: Day) {
  const grammar: string[] = [];
  const vocab: VocabItem[] = [];
  const quizzes: { id: string; title: string; lessonId: string; count: number }[] = [];
  for (const l of d.lessons) {
    for (const b of l.blocks ?? []) {
      if (l.kind === 'grammar' && b.t === 'h') grammar.push(b.text.replace(/^\d+\.\s*/, ''));
      if (b.t === 'vocab') vocab.push(...b.items);
      if (b.t === 'quiz' || b.t === 'mcq' || b.t === 'build' || b.t === 'readkanji') quizzes.push({ id: b.id, title: b.title, lessonId: l.id, count: b.items.length });
      if (b.t === 'dictation') quizzes.push({ id: b.id, title: b.title ?? 'Nghe chép đánh vần', lessonId: l.id, count: b.items.length });
    }
  }
  const skills = d.lessons.filter((l) => ['listening', 'reading', 'writing', 'speaking'].includes(l.kind));
  const minutes = d.lessons.reduce((n, l) => n + l.minutes, 0);
  return { grammar, vocab, quizzes, skills, minutes, ready: d.lessons.some((l) => l.blocks?.length) };
}
