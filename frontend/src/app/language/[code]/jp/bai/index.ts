/**
 * Bộ nạp các bài đã soạn của khoá JP — mỗi bài một tệp `baiN.ts` export `BAI_N`.
 * Mỗi `case` một `import('./baiN')` chuỗi TĨNH ⇒ mỗi bài một chunk, tải khi mở.
 * Thêm bài: tạo baiN.ts, thêm `case`, rồi `npm run course:manifest`.
 */
import type { Lesson } from '@/components/sach-hoc/types';

export function loadBai(n: number): Promise<Lesson[]> | null {
  switch (n) {
    default: return null;
  }
}
