/**
 * Nạp nội dung MỘT chặng theo yêu cầu, thay vì gom cả năm chặng vào gói đầu.
 *
 * TRƯỚC (tới 09/2026): file này `import` thẳng cả năm `./stageN`, rồi dựng sẵn
 * `STAGES` là một mảng hằng. Mọi view lấy dữ liệu qua prop nên code rất gọn —
 * nhưng cái giá nằm ở chỗ không nhìn thấy: `IeltsClient` import `STAGES`, nên
 * **1,23 MB nội dung năm chặng đi vào gói JS đầu tiên**, kể cả với người chỉ mở
 * tab Lộ trình rồi đóng.
 *
 * NAY: mỗi chặng là một `import()` động ⇒ webpack cắt thành năm chunk riêng, và
 * trình duyệt chỉ tải chunk của chặng đang xem. Phần khung trang (thanh chuyển
 * chặng, badge trên tab, số ở đầu trang) đọc từ hai file NHẸ nạp sẵn:
 * `stage-meta.ts` (chuỗi gõ tay) và `stats.generated.ts` (số do máy sinh).
 *
 * Vì thế badge và con số KHÔNG hiện trễ — chỉ nội dung tab mới phải chờ.
 *
 * ⚠️ HAI ĐIỀU PHẢI GIỮ KHI THÊM CHẶNG MỚI:
 *
 *  1. **Khoá localStorage phải KHÁC nhau giữa các chặng** (khai ở `stage-meta.ts`).
 *     Tiến độ chặng 1 không được đè chặng 2 — người học quay lại ôn chặng cũ bất
 *     cứ lúc nào, và tiến độ hai chặng là hai chuyện riêng.
 *  2. **Chạy `npm run ielts:stats`** sau khi thêm/bớt nội dung. Quên thì
 *     `loadStage()` bên dưới kêu `console.error` ở dev ngay lần mở chặng đó —
 *     xem phần "chốt chống lệch số".
 *
 * Trường chỉ có ở một chặng thì để optional (`questionTypes` chỉ có từ chặng 2).
 */
import type {
  LessonUnit, VocabTopic, VocabWord, ReadingPassage, ListeningExercise,
  ListeningSource, WritingTask, SpeakingTopic, Exercise, QuestionTypeGuide,
} from './types';
import { type StageId, type StageMeta, type StageStats, metaFor } from './stage-meta';
import { STAGE_STATS } from './stats.generated';

export type { StageId, StageStats } from './stage-meta';

export interface StageBundle extends StageMeta {
  units: LessonUnit[];
  vocabTopics: VocabTopic[];
  allWords: VocabWord[];
  readings: ReadingPassage[];
  listenings: ListeningExercise[];
  sources: ListeningSource[];
  writings: WritingTask[];
  speakings: SpeakingTopic[];
  speakingRules: { title: string; body: string }[];
  exercisesByLesson: Record<string, Exercise[]>;
  allExercises: Exercise[];
  /** Chỉ có từ chặng 2 — cẩm nang dạng câu hỏi. */
  questionTypes?: QuestionTypeGuide[];
  strategyNotes?: { title: string; body: string }[];
  stats: StageStats;
}

/** Phần NỘI DUNG của một chặng — tất cả trừ phần meta nhẹ đã có sẵn. */
type StageContent = Omit<StageBundle, keyof StageMeta>;

/**
 * Mỗi chặng một `import()` viết TƯỜNG MINH, rồi ánh xạ export sang `StageContent`
 * ngay tại chỗ. Hai lý do, cả hai đều đã suýt cắn:
 *
 *  1. **webpack chỉ cắt được chunk khi đường dẫn là hằng lúc build.** Viết
 *     ``import(`./stage${n}`)`` thì nó phải gộp cả thư mục vào một chunk — mất
 *     sạch tác dụng của việc tách.
 *  2. **Tên export giữa các chặng KHÔNG nhất quán**: `VOCAB_TOPICS` (chặng 1),
 *     `VOCAB2_TOPICS`, `VOCAB3_TOPICS`, `VOCAB4` (không có `_TOPICS`),
 *     `VOCAB5_TOPICS`. Ghép tên bằng chuỗi thì lệch một chặng là `undefined`
 *     lặng lẽ chạy tiếp tới lúc render mới nổ. Viết thẳng ra thế này thì `tsc`
 *     bắt được ngay tại dòng sai.
 */
const LOADERS: Record<StageId, () => Promise<StageContent>> = {
  stage1: () => import('./stage1').then((m) => ({
    units: m.UNITS,
    vocabTopics: m.VOCAB_TOPICS,
    allWords: m.ALL_WORDS,
    readings: m.READINGS,
    listenings: m.LISTENINGS,
    sources: m.LISTENING_SOURCES,
    writings: m.WRITINGS,
    speakings: m.SPEAKINGS,
    speakingRules: m.SPEAKING_RULES,
    exercisesByLesson: m.EXERCISES_BY_LESSON,
    allExercises: m.ALL_EXERCISES,
    stats: m.STAGE1_STATS,
  })),
  stage2: () => import('./stage2').then((m) => ({
    units: m.UNITS2,
    vocabTopics: m.VOCAB2_TOPICS,
    allWords: m.ALL_WORDS2,
    readings: m.READINGS2,
    listenings: m.LISTENINGS2,
    sources: m.LISTENING_SOURCES2,
    writings: m.WRITINGS2,
    speakings: m.SPEAKINGS2,
    speakingRules: m.SPEAKING_RULES2,
    exercisesByLesson: m.EXERCISES2_BY_LESSON,
    allExercises: m.ALL_EXERCISES2,
    questionTypes: m.QUESTION_TYPES,
    strategyNotes: m.STRATEGY_NOTES,
    stats: m.STAGE2_STATS,
  })),
  stage3: () => import('./stage3').then((m) => ({
    units: m.UNITS3,
    vocabTopics: m.VOCAB3_TOPICS,
    allWords: m.ALL_WORDS3,
    readings: m.READINGS3,
    listenings: m.LISTENINGS3,
    sources: m.LISTENING_SOURCES3,
    writings: m.WRITINGS3,
    speakings: m.SPEAKINGS3,
    speakingRules: m.SPEAKING_RULES3,
    exercisesByLesson: m.EXERCISES3_BY_LESSON,
    allExercises: m.ALL_EXERCISES3,
    stats: m.STAGE3_STATS,
  })),
  stage4: () => import('./stage4').then((m) => ({
    units: m.UNITS4,
    vocabTopics: m.VOCAB4,
    allWords: m.ALL_WORDS4,
    readings: m.READINGS4,
    listenings: m.LISTENINGS4,
    sources: m.LISTENING_SOURCES4,
    writings: m.WRITINGS4,
    speakings: m.SPEAKINGS4,
    speakingRules: m.SPEAKING_RULES4,
    exercisesByLesson: m.EXERCISES4_BY_LESSON,
    allExercises: m.ALL_EXERCISES4,
    stats: m.STAGE4_STATS,
  })),
  stage5: () => import('./stage5').then((m) => ({
    units: m.UNITS5,
    vocabTopics: m.VOCAB5_TOPICS,
    allWords: m.ALL_WORDS5,
    readings: m.READINGS5,
    listenings: m.LISTENINGS5,
    sources: m.LISTENING_SOURCES5,
    writings: m.WRITINGS5,
    speakings: m.SPEAKINGS5,
    speakingRules: m.SPEAKING_RULES5,
    exercisesByLesson: m.EXERCISES5_BY_LESSON,
    allExercises: m.ALL_EXERCISES5,
    stats: m.STAGE5_STATS,
  })),
};

/** Đã nạp rồi thì dùng lại — đổi qua đổi lại giữa các chặng không tải lại chunk. */
const cache = new Map<StageId, StageBundle>();
/** Đang nạp dở thì dùng chung một promise, tránh hai lần bấm tải hai lần. */
const inFlight = new Map<StageId, Promise<StageBundle>>();

/**
 * Chốt chống lệch số: `stats.generated.ts` là ảnh chụp, dữ liệu mới là sự thật.
 * Khi chặng được nạp thật, ta có cả hai trong tay — so ngay tại đây là chỗ rẻ
 * nhất và sớm nhất để phát hiện ai đó sửa nội dung mà quên chạy lại generator.
 *
 * Chỉ kêu ở môi trường dev: trên production con số lệch vài đơn vị không đáng
 * làm bẩn console của người học, mà cũng không sửa được gì ở đó nữa.
 */
function warnIfStale(id: StageId, real: StageStats): void {
  if (process.env.NODE_ENV === 'production') return;
  const snapshot = STAGE_STATS[id];
  // Duyệt theo khoá của ẢNH CHỤP, không theo khoá của dữ liệu thật: vài chặng
  // có thêm số riêng (`situations`, `examBlocks`…) mà ảnh chụp cố ý không giữ,
  // duyệt theo dữ liệu thật thì mọi chặng đó đều báo lệch giả.
  const off = (Object.keys(snapshot) as (keyof StageStats)[])
    .filter((k) => real[k] !== snapshot[k])
    .map((k) => `${k}: sinh ${snapshot[k]} ≠ thật ${real[k]}`);
  if (off.length > 0) {
    console.error(
      `[ielts] stats.generated.ts đã lệch với ${id}. Chạy: npm run ielts:stats\n  ${off.join('\n  ')}`,
    );
  }
}

/** Nạp trọn nội dung một chặng. Gọi lần hai trả về ngay từ cache. */
export function loadStage(id: StageId): Promise<StageBundle> {
  const hit = cache.get(id);
  if (hit) return Promise.resolve(hit);

  const pending = inFlight.get(id);
  if (pending) return pending;

  const p = LOADERS[id]().then((content) => {
    const bundle: StageBundle = { ...metaFor(id), ...content };
    warnIfStale(id, bundle.stats);
    cache.set(id, bundle);
    inFlight.delete(id);
    return bundle;
  });

  inFlight.set(id, p);
  return p;
}

/**
 * Nạp cả năm chặng. CHỈ dùng cho hai tab thật sự cần trộn nội dung mọi chặng —
 * "Luyện mỗi ngày" (bốc ngẫu nhiên xuyên chặng) và "Tra cứu" (tìm xuyên chặng).
 * Cả hai đều là tab tải theo yêu cầu, nên chi phí này chỉ phát sinh khi người
 * dùng thật sự bấm vào chúng.
 */
export function loadAllStages(): Promise<StageBundle[]> {
  return Promise.all((Object.keys(LOADERS) as StageId[]).map(loadStage));
}
