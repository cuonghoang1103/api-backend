/**
 * Bộ nạp các bài đã soạn của khoá CH — mỗi bài một tệp `baiN.ts` export `BAI_N`.
 * Mỗi `case` một `import('./baiN')` chuỗi TĨNH ⇒ mỗi bài một chunk, tải khi mở.
 * Thêm bài: tạo baiN.ts, thêm `case`, rồi `npm run course:manifest`.
 */
import type { Lesson } from '@/components/sach-hoc/types';

export function loadBai(n: number): Promise<Lesson[]> | null {
  switch (n) {
    case 0: return import('./bai0').then((m) => m.BAI_0);
    case 1: return import('./bai1').then((m) => m.BAI_1);
    case 2: return import('./bai2').then((m) => m.BAI_2);
    case 3: return import('./bai3').then((m) => m.BAI_3);
    case 4: return import('./bai4').then((m) => m.BAI_4);
    case 5: return import('./bai5').then((m) => m.BAI_5);
    default: return null;
  }
}
