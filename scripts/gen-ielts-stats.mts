/**
 * Sinh `frontend/src/app/tech-trends/ielts/data/stats.generated.ts`.
 *
 * VÌ SAO CẦN FILE SINH TỰ ĐỘNG
 * ────────────────────────────
 * Trang IELTS hiện số đếm ngay ở đầu trang và trên từng tab (bao nhiêu bài học,
 * bao nhiêu từ vựng, bao nhiêu câu chấm điểm). Những số đó phải có NGAY khi
 * trang mở, trước cả khi biết người dùng sẽ xem chặng nào.
 *
 * Trước đây chúng được tính trực tiếp từ dữ liệu — đúng nhưng phải trả giá:
 * muốn có số thì phải nạp dữ liệu, nên cả 1,23 MB nội dung năm chặng nằm trong
 * gói JS đầu tiên dù người dùng chỉ mở tab Lộ trình.
 *
 * Script này cắt nút đó: nó nạp dữ liệu MỘT LẦN lúc build ở máy, rồi ghi kết
 * quả ra dạng số nguyên. Trình duyệt chỉ tải mấy con số.
 *
 * ⚠️ Script KHÔNG tự đếm lại. Nó chỉ đọc `STAGE_N_STATS` mà chính các module
 * chặng đã tính — nên nguồn sự thật vẫn nằm ở dữ liệu, không nằm ở đây. Thêm
 * một cách đếm thứ hai là tự tạo ra chỗ để hai con số lệch nhau.
 *
 * CHẠY:  npm run ielts:stats     (bắt buộc chạy sau khi thêm/bớt nội dung chặng)
 *
 * QUÊN CHẠY THÌ SAO: `loadStage()` trong `data/bundles.ts` so lại số sinh với
 * số thật ngay lúc nạp chặng và kêu `console.error` ở môi trường dev. Nên lỗi
 * lộ ra ở lần mở chặng đầu tiên chứ không âm thầm sai trên production.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(here, '../frontend/src/app/tech-trends/ielts/data');

const [s1, s2, s3, s4, s5, typing] = await Promise.all([
  import(`${dataDir}/stage1/index.ts`),
  import(`${dataDir}/stage2/index.ts`),
  import(`${dataDir}/stage3/index.ts`),
  import(`${dataDir}/stage4/index.ts`),
  import(`${dataDir}/stage5/index.ts`),
  import(`${dataDir}/typing.ts`),
]);

/**
 * Khoá của `StageStats` trong `data/stage-meta.ts`. Ảnh chụp chỉ giữ ĐÚNG những
 * khoá này, không hơn: vài chặng có thêm số riêng (`situations`, `examBlocks`,
 * `questionTypes`…) mà giao diện không đọc qua `d.stats`, chép sang chỉ làm
 * phình file và tạo ra hai chỗ khai cùng một thứ.
 */
const KEYS = [
  'lessons', 'units', 'words', 'topics', 'readings', 'readingQuestions',
  'listenings', 'listeningQuestions', 'sources', 'writings', 'speakingTopics',
  'speakingQuestions', 'grammarPoints', 'exercises', 'gradedTotal',
] as const;

/** Chiếu stats của một chặng xuống đúng bộ khoá, và nổ ngay nếu thiếu khoá nào. */
function project(id: string, raw: Record<string, unknown>) {
  const out: Record<string, number> = {};
  for (const k of KEYS) {
    const v = raw[k];
    if (typeof v !== 'number' || !Number.isFinite(v)) {
      throw new Error(`${id}: STATS thiếu hoặc sai kiểu ở khoá "${k}" (nhận ${JSON.stringify(v)})`);
    }
    out[k] = v;
  }
  return out;
}

const STATS = {
  stage1: project('stage1', s1.STAGE1_STATS),
  stage2: project('stage2', s2.STAGE2_STATS),
  stage3: project('stage3', s3.STAGE3_STATS),
  stage4: project('stage4', s4.STAGE4_STATS),
  stage5: project('stage5', s5.STAGE5_STATS),
} as const;

/** Cẩm nang dạng câu hỏi chỉ có từ chặng 2 — đếm qua chính mảng đó. */
const QUESTION_TYPES = {
  stage1: 0,
  stage2: (s2.QUESTION_TYPES ?? []).length,
  stage3: 0,
  stage4: 0,
  stage5: 0,
} as const;

/**
 * Số đoạn luyện gõ của từng chặng. Giữ NGUYÊN quy tắc cũ của `typingCountFor`:
 * chặng chưa có đoạn riêng thì hiện tổng số đoạn, chứ không hiện 0.
 *
 * Đưa vào đây để `IeltsClient` thôi phải import `data/typing.ts` (14,6 kB) chỉ
 * để tính một con số badge — đó là mẩu dữ liệu cuối cùng còn kẹt ở gói đầu.
 */
const passages = typing.TYPING_PASSAGES as { stage: string }[];
const TYPING_COUNTS = Object.fromEntries(
  (['stage1', 'stage2', 'stage3', 'stage4', 'stage5'] as const).map((id) => {
    const own = passages.filter((p) => p.stage === id).length;
    return [id, own || passages.length];
  }),
) as Record<string, number>;

const ids = Object.keys(STATS) as (keyof typeof STATS)[];
const sum = (pick: (s: any) => number) => ids.reduce((n, id) => n + pick(STATS[id]), 0);

const TOTAL = {
  lessons: sum((s) => s.lessons),
  words: sum((s) => s.words),
  readings: sum((s) => s.readings),
  listenings: sum((s) => s.listenings),
  writings: sum((s) => s.writings),
  graded: sum((s) => s.gradedTotal),
  exercises: sum((s) => s.exercises),
  questionTypes: QUESTION_TYPES.stage2,
};

const body = `/**
 * SINH TỰ ĐỘNG — ĐỪNG SỬA TAY.
 *
 * Dựng lại bằng:  npm run ielts:stats
 * Nguồn:          scripts/gen-ielts-stats.mts
 *
 * File này tồn tại để \`IeltsClient\` và \`RoadmapTab\` hiện được số đếm ngay khi
 * trang mở mà không phải nạp 1,23 MB nội dung năm chặng. Nguồn sự thật vẫn là
 * dữ liệu trong \`data/stageN/\`; đây chỉ là ảnh chụp của nó.
 *
 * Sửa nội dung một chặng mà quên chạy lại script: \`loadStage()\` sẽ so số sinh
 * với số thật lúc nạp chặng đó và kêu \`console.error\` ở dev.
 */
import type { StageId, StageStats } from './stage-meta';

export const STAGE_STATS: Record<StageId, StageStats> = ${JSON.stringify(STATS, null, 2)};

/** Số dạng câu hỏi của từng chặng (chỉ chặng 2 có cẩm nang này). */
export const STAGE_QUESTION_TYPES: Record<StageId, number> = ${JSON.stringify(QUESTION_TYPES, null, 2)};

/** Số đoạn luyện gõ của từng chặng (chặng chưa có đoạn riêng thì lấy tổng). */
export const TYPING_COUNTS: Record<StageId, number> = ${JSON.stringify(TYPING_COUNTS, null, 2)};

/** Số gộp cả năm chặng — hiện ở đầu trang. */
export const TOTAL_STATS = ${JSON.stringify(TOTAL, null, 2)};
`;

const out = `${dataDir}/stats.generated.ts`;
writeFileSync(out, body, 'utf8');
console.log(`✓ đã ghi ${out}`);
for (const id of ids) {
  const s = STATS[id];
  console.log(`  ${id}: ${s.lessons} bài · ${s.words} từ · ${s.exercises} bài tập · ${s.gradedTotal} câu chấm`);
}
console.log(`  TỔNG: ${TOTAL.lessons} bài · ${TOTAL.words} từ · ${TOTAL.graded} câu chấm · ${TOTAL.questionTypes} dạng câu hỏi`);
