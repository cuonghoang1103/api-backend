/**
 * Một khoá học: mô tả + các hàm tổng hợp dựng từ danh sách ngày.
 * Mỗi khoá tạo một `Course` bằng `defineCourse` (vd. ielts/data.ts).
 *
 * Tải theo buổi: `days` chỉ là MỤC LỤC (bài không kèm blocks, cờ `ready`),
 * tóm tắt từng buổi nằm ở `manifest` (sinh bởi scripts/course-manifest.mts),
 * còn nội dung một buổi tải qua `loadDay` khi mở — mỗi buổi một chunk JS.
 * Buổi viết thẳng trong data.ts (Mở đầu, IELTS Ngày 1) thì không cần tải.
 */
import type { Day, Kind, Lesson, LessonVideo, Voice } from './types';
import type { KanjiDict } from './kanji';
import { dayMeta, isReady, type CourseManifest, type DayMeta, type VocabMeta } from './manifest';

export { isReady };

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
  /**
   * Mục tra cứu đứng ngoài các buổi (vd. "Chia động từ & tính từ" của khoá Nhật) —
   * hiện ngay dưới "Mở đầu" ở mục lục, mở bằng `?bai=<id>`. Viết thẳng (có blocks).
   */
  extras?: Lesson[];
  /**
   * Khoá tiếng Nhật: dữ liệu chữ Hán (chữ của lớp + chỉ mục từ đi chung) — TẢI CHẬM,
   * chỉ khi mở thẻ chữ Hán / bài "Chữ Hán của lớp". Có hàm này thì chữ Hán trong
   * bài chạm được (KanjiSheet).
   */
  kanji?: () => Promise<KanjiDict>;
  /**
   * Video bài giảng theo id bài (hiện đầu bài, trước nội dung). Tách khỏi blocks để
   * thay video không phải đụng vào bài.
   */
  videos?: Record<string, LessonVideo[]>;
  /** Trang riêng đi kèm khoá (vd. Phòng thi thử) — hiện ngay dưới "Kế hoạch & tiến độ". */
  links?: { href: string; label: string }[];
  /** Mục lục các buổi. Buổi tải chậm: bài chỉ có metadata + `ready`, không có blocks. */
  days: Day[];
  /** Tóm tắt các buổi tải chậm, khoá theo `Day.n` (từ manifest.ts sinh tự động). */
  manifest?: CourseManifest;
  /**
   * Nạp nội dung đầy đủ của buổi n (dynamic import → một chunk). Trả `null`
   * khi buổi đó không có tệp nội dung (viết thẳng trong data.ts / chưa soạn).
   */
  loadDay?: (n: number) => Promise<Lesson[]> | null;
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

const SKILLS: Kind[] = ['listening', 'reading', 'writing', 'speaking'];

/** Chờ lúc trình duyệt rảnh (Safari chưa có requestIdleCallback). */
function whenIdle(f: () => void) {
  if (typeof window === 'undefined') return;
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(f, { timeout: 4000 });
  else setTimeout(f, 1500);
}

export function defineCourse(def: CourseDef) {
  // Mục tra cứu (extras) đứng CUỐI thứ tự đọc: "Bài tiếp" của Mở đầu vẫn là Bài 0.
  const allLessons: Lesson[] = [def.intro, ...def.days.flatMap((d) => d.lessons), ...(def.extras ?? [])];
  const readyLessons = allLessons.filter(isReady);

  // Tóm tắt từng buổi: buổi tải chậm lấy từ manifest, buổi viết thẳng thì tính từ nội dung.
  const metas = new Map<number, DayMeta>(def.days.map((d) => [d.n, def.manifest?.[d.n] ?? dayMeta(d.lessons)]));

  // Tra từ cho ô 💡 Gợi ý — dựng từ manifest nên không phải tải mọi buổi.
  // Từ tiếng Nhật viết `{学生|がくせい}` nên đăng ký CẢ ba khoá: nguyên văn,
  // dạng chữ Hán (学生) và dạng đọc (がくせい). Từ gặp trước thắng (thứ tự bài).
  const vocabIndex: Map<string, VocabMeta> = new Map();
  for (const v of [...dayMeta([def.intro]).vocab, ...def.days.flatMap((d) => metas.get(d.n)!.vocab)]) {
    const base = v.w.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');
    const kana = v.w.replace(/\{[^|}]+\|([^}]+)\}/g, '$1');
    for (const k of [v.w, base, kana]) if (!vocabIndex.has(k.toLowerCase())) vocabIndex.set(k.toLowerCase(), v);
  }

  /* ── Nội dung theo buổi: tải một lần, giữ trong bộ nhớ suốt phiên ── */
  const loaded = new Map<number, Lesson[]>();
  const pending = new Map<number, Promise<Lesson[]>>();
  const dayByN = (n: number) => def.days.find((d) => d.n === n);

  /** Nội dung đầy đủ của buổi n nếu đã có sẵn (đã tải, hoặc viết thẳng) — không thì undefined. */
  function contentOf(n: number): Lesson[] | undefined {
    const d = dayByN(n);
    if (!d) return undefined;
    if (loaded.has(n)) return loaded.get(n);
    return d.lessons.some((l) => isReady(l) && !l.blocks?.length) ? undefined : d.lessons;
  }

  /** Tải nội dung buổi n (gộp các lời gọi trùng; lỗi thì lần sau thử lại). */
  function load(n: number): Promise<Lesson[]> {
    const have = contentOf(n);
    if (have) return Promise.resolve(have);
    const p0 = pending.get(n);
    if (p0) return p0;
    const src = def.loadDay?.(n);
    if (!src) return Promise.resolve(dayByN(n)?.lessons ?? []);
    const p = src.then(
      (ls) => {
        pending.delete(n);
        // Mục lục (manifest.ts) phải khớp nội dung — lệch là quên `npm run course:manifest`.
        const want = dayByN(n)?.lessons.map((l) => l.id).join(',');
        const got = ls.map((l) => l.id).join(',');
        if (want !== got) console.error(`[sach-hoc] ${def.stage}: mục lục buổi ${n} lệch nội dung (${want} ≠ ${got}) — chạy npm run course:manifest`);
        loaded.set(n, ls);
        return ls;
      },
      (e) => {
        pending.delete(n);
        throw e;
      },
    );
    pending.set(n, p);
    return p;
  }

  return {
    ...def,
    allLessons,
    readyLessons,
    vocabIndex,
    contentOf,
    load,
    /** Tải trước buổi n khi trình duyệt rảnh — mở "Bài tiếp" là có ngay. */
    prefetch: (n: number) => {
      if (dayByN(n) && !contentOf(n)) whenIdle(() => { load(n).catch(() => {}); });
    },
    /** Bài đầy đủ (có blocks) theo id — undefined nếu buổi của nó chưa tải. */
    fullLesson: (l: Lesson): Lesson | undefined => {
      if (l.blocks?.length || !isReady(l)) return l;
      const d = def.days.find((x) => x.lessons.some((y) => y.id === l.id));
      return d ? contentOf(d.n)?.find((y) => y.id === l.id) : undefined;
    },
    /** Những gì một buổi gói gọn: điểm ngữ pháp, từ vựng, kỹ năng, bài tập — không cần tải nội dung. */
    summary: (d: Day) => {
      const m = metas.get(d.n) ?? dayMeta(d.lessons);
      return {
        grammar: m.grammar,
        vocab: m.vocab,
        quizzes: m.quizzes,
        skills: d.lessons.filter((l) => SKILLS.includes(l.kind)),
        minutes: m.minutes,
        ready: d.lessons.some(isReady),
      };
    },
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
      case 'recap': out.push(`${b.title ?? 'Tóm tắt'}: ${b.items.map(strip).join(' / ')}`); break;
      case 'rule': out.push(`Công thức: ${b.formula}${b.vi ? ` (${strip(b.vi)})` : ''}`); break;
      case 'vocabAll': out.push('Tra cứu toàn bộ từ vựng của khoá: tìm, lọc theo buổi, thẻ nhớ.'); break;
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
      case 'hanlop': out.push(`Thẻ chữ Hán của lớp — Bài ${b.bai}.`); break;
      case 'chia': out.push('Công cụ chia động từ & tính từ: nhóm I/II/III, thể ます/て/た/ない/từ điển/普通形, tính từ い/な.'); break;
    }
  }
  return out.join('\n').slice(0, 3900);
}
