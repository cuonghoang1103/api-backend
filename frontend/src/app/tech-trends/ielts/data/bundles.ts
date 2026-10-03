/**
 * Gom mỗi chặng thành MỘT bundle cùng hình dạng, để các view dùng chung.
 *
 * Trước khi có file này, mọi view import thẳng từ `./data/stage1` nên không
 * thể hiện được chặng 2 mà không nhân đôi component. Nay view nhận `d:
 * StageBundle` qua prop và không cần biết mình đang hiện chặng nào.
 *
 * Hai điểm cần giữ khi thêm chặng 3 và 4:
 *
 *  - **Khoá localStorage phải KHÁC nhau giữa các chặng.** Tiến độ bài học và
 *    từ vựng của chặng 1 không được đè lên chặng 2 — người học có thể quay lại
 *    ôn chặng cũ bất cứ lúc nào và tiến độ hai chặng là hai chuyện riêng.
 *  - **Trường chỉ có ở một chặng thì để optional** (`questionTypes` chỉ có ở
 *    chặng 2 trở đi, `life`/`exam` là nội dung dùng chung cho cả khoá nên
 *    không nằm trong bundle).
 */
import type { StageBundle } from './bundleTypes';
import { STAGE1 } from './bundle1';
import { STAGE2 } from './bundle2';
import { STAGE3 } from './bundle3';
import { STAGE4 } from './bundle4';

export type { StageStats, StageBundle } from './bundleTypes';
export { STAGE1, STAGE2, STAGE3, STAGE4 };

export const STAGES: StageBundle[] = [STAGE1, STAGE2, STAGE3, STAGE4];

/** Số gộp cả hai chặng — dùng cho phần đầu trang. */
const sum = (pick: (s: StageBundle) => number): number => STAGES.reduce((n, s) => n + pick(s), 0);

export const TOTAL_STATS = {
  lessons: sum((s) => s.stats.lessons),
  words: sum((s) => s.stats.words),
  readings: sum((s) => s.stats.readings),
  listenings: sum((s) => s.stats.listenings),
  writings: sum((s) => s.stats.writings),
  graded: sum((s) => s.stats.gradedTotal),
  exercises: sum((s) => s.stats.exercises),
  /** Cẩm nang dạng câu hỏi mới có từ chặng 2 — đếm qua bundle, không qua stats. */
  questionTypes: STAGE2.questionTypes?.length ?? 0,
};
