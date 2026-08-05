/**
 * Gom bài giảng của cả 5 ngày. Khoá là `StudyTask.id` trong `plan.ts`.
 *
 * Việc nào chưa có bài thì UI đơn giản không hiện nút "Học ngay" — nên thêm
 * dần được, không cần viết đủ 88 bài mới chạy.
 */

import type { LessonMap } from './types';
import { DAY1_LESSONS } from './day1';
import { DAY2_LESSONS } from './day2';
import { DAY3_LESSONS } from './day3';
import { DAY45_LESSONS } from './day45';
import { EXTRA_LESSONS } from './extra';

export const LESSONS: LessonMap = {
  ...DAY1_LESSONS,
  ...DAY2_LESSONS,
  ...DAY3_LESSONS,
  ...DAY45_LESSONS,
  ...EXTRA_LESSONS,
};

export type { LessonMap, TaskLesson, LessonPart, LessonExample } from './types';
