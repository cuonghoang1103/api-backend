/**
 * Các ngày đã soạn xong, mỗi ngày một tệp `ngayN.ts` (xem ../SOAN-BAI.md).
 * Ngày 1 nằm thẳng trong data.ts vì nó được soạn trước khi tách tệp.
 * Ngày chưa có ở đây thì data.ts dựng khung "sắp có" theo mục lục sách.
 */
import type { Lesson } from '../data';
import { NGAY_2 } from './ngay2';
import { NGAY_3 } from './ngay3';
import { NGAY_4 } from './ngay4';

export const WRITTEN: Record<number, Lesson[]> = {
  2: NGAY_2,
  3: NGAY_3,
  4: NGAY_4,
};
