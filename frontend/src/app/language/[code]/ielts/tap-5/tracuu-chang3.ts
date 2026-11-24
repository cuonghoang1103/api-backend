/**
 * Mục TRA CÔNG THỨC của IELTS Tập 5 — chặng 3 (Ngày 13–18). Soạn cùng `ngay/ngay13..18.ts`.
 * `tracuu.ts` ghép mảng này vào `TRA_CONG_THUC_T5.blocks` — tệp tách riêng để các phiên soạn chặng khác không giẫm lên nhau.
 *
 * Mỗi mục: `h` "(Ngày N · mục M)" + `patterns` / `table` + `rule`, chép gọn từ bài ngày đó.
 */
import type { Block } from '@/components/sach-hoc/types';
import { TRA_13 } from './tracuu/ngay13';
import { TRA_14 } from './tracuu/ngay14';
import { TRA_15 } from './tracuu/ngay15';
import { TRA_16 } from './tracuu/ngay16';
import { TRA_17 } from './tracuu/ngay17';
import { TRA_18 } from './tracuu/ngay18';

export const TRA_CONG_THUC_CHANG3: Block[] = [...TRA_13, ...TRA_14, ...TRA_15, ...TRA_16, ...TRA_17, ...TRA_18];
