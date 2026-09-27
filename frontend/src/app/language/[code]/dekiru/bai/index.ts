/**
 * Các bài đã soạn, mỗi bài một tệp `baiN.ts` (xem ../SOAN-BAI.md).
 * Bài chưa có ở đây thì data.ts dựng khung "sắp có" theo mục lục sách.
 */
import type { Day } from '@/components/sach-hoc/types';
import { BAI_0 } from './bai0';
import { BAI_1 } from './bai1';
import { BAI_2 } from './bai2';

export const WRITTEN: Record<number, Day['lessons']> = {
  0: BAI_0,
  1: BAI_1,
  2: BAI_2,
};
