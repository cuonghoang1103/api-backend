/**
 * Các bài đã soạn, mỗi bài một tệp `baiN.ts` (xem ../SOAN-BAI.md).
 * Bài chưa có ở đây thì data.ts dựng khung "sắp có" theo mục lục sách.
 */
import type { Day } from '@/components/sach-hoc/types';
import { BAI_0 } from './bai0';
import { BAI_1 } from './bai1';
import { BAI_2 } from './bai2';
import { BAI_3 } from './bai3';
import { BAI_4 } from './bai4';
import { BAI_5 } from './bai5';
import { BAI_6 } from './bai6';
import { SACH as SACH_1 } from './sach';
import { SACH_2 } from './sach2';
import { BAI_7, SACH_7 } from './bai7';
import { BAI_8, SACH_8 } from './bai8';
import { BAI_9, SACH_9 } from './bai9';
import { BAI_10, SACH_10 } from './bai10';
import { BAI_11, SACH_11 } from './bai11';
import { BAI_12, SACH_12 } from './bai12';
import { BAI_13, SACH_13 } from './bai13';

const SACH: Record<number, Day['lessons'][number]> = { ...SACH_1, ...SACH_2, 7: SACH_7, 8: SACH_8, 9: SACH_9, 10: SACH_10, 11: SACH_11, 12: SACH_12, 13: SACH_13 };

const BAI: Record<number, Day['lessons']> = {
  0: BAI_0,
  1: BAI_1,
  2: BAI_2,
  3: BAI_3,
  4: BAI_4,
  5: BAI_5,
  6: BAI_6,
  7: BAI_7,
  8: BAI_8,
  9: BAI_9,
  10: BAI_10,
  11: BAI_11,
  12: BAI_12,
  13: BAI_13,
};

/** Mỗi bài: các bài soạn + mục 📖 Theo sách (đi theo từng trang sách) ở cuối. */
export const WRITTEN: Record<number, Day['lessons']> = Object.fromEntries(
  Object.entries(BAI).map(([n, ls]) => [n, SACH[Number(n)] ? [...ls, SACH[Number(n)]] : ls]),
);
