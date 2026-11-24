/**
 * Mục TRA CÔNG THỨC của IELTS Tập 5 — chặng 2 (Ngày 7–12). Soạn cùng `ngay/ngay7..12.ts`.
 * `tracuu.ts` ghép mảng này vào `TRA_CONG_THUC_T5.blocks` — tệp tách riêng để các phiên soạn chặng khác không giẫm lên nhau.
 *
 * Mỗi mục: `h` "K. Tên (Ngày N · mục M)" (K đánh số liên tục cả chặng) + `patterns` / `table` + `rule`, chép gọn từ bài ngày đó.
 */
import type { Block } from '@/components/sach-hoc/types';
import { TRA_7 } from './tracuu/ngay7';
import { TRA_8 } from './tracuu/ngay8';
import { TRA_9 } from './tracuu/ngay9';
import { TRA_10 } from './tracuu/ngay10';
import { TRA_11 } from './tracuu/ngay11';
import { TRA_12 } from './tracuu/ngay12';

export const TRA_CONG_THUC_CHANG2: Block[] = [...TRA_7, ...TRA_8, ...TRA_9, ...TRA_10, ...TRA_11, ...TRA_12];
