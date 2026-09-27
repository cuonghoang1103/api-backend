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

const SACH = { ...SACH_1, ...SACH_2 };

const BAI: Record<number, Day['lessons']> = {
  0: BAI_0,
  1: BAI_1,
  2: BAI_2,
  3: BAI_3,
  4: BAI_4,
  5: BAI_5,
  6: BAI_6,
};

/** Mỗi bài: các bài soạn + mục 📖 Theo sách (đi theo từng trang sách) ở cuối. */
export const WRITTEN: Record<number, Day['lessons']> = Object.fromEntries(
  Object.entries(BAI).map(([n, ls]) => [n, SACH[Number(n)] ? [...ls, SACH[Number(n)]] : ls]),
);
