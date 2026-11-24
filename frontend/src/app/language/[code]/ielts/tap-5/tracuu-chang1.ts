/**
 * Mục TRA CÔNG THỨC của IELTS Tập 5 — chặng 1 (Ngày 1–6). Soạn cùng `ngay/ngay1..6.ts`.
 * `tracuu.ts` ghép mảng này vào `TRA_CONG_THUC_T5.blocks` — tệp tách riêng để các phiên soạn chặng khác không giẫm lên nhau.
 *
 * Mỗi mục: `h` "K. Tên (Ngày N · mục M)" (K đánh số liên tục cả chặng) + `patterns` / `table` + `rule`, chép gọn từ bài ngày đó.
 * 
 */
import type { Block } from '@/components/sach-hoc/types';
import { TRA_1 } from './tracuu/ngay1';
import { TRA_2 } from './tracuu/ngay2';
import { TRA_3 } from './tracuu/ngay3';
import { TRA_4 } from './tracuu/ngay4';
import { TRA_5 } from './tracuu/ngay5';
import { TRA_6 } from './tracuu/ngay6';

export const TRA_CONG_THUC_CHANG1: Block[] = [...TRA_1, ...TRA_2, ...TRA_3, ...TRA_4, ...TRA_5, ...TRA_6];
