/**
 * Mục TRA CÔNG THỨC của IELTS Tập 5 — chặng 5 (Ngày 25–30). Soạn cùng `ngay/ngay25..30.ts`.
 * `tracuu.ts` ghép mảng này vào `TRA_CONG_THUC_T5.blocks` — tệp tách riêng để các phiên soạn chặng khác không giẫm lên nhau.
 *
 * Mỗi mục: `h` "(Ngày N · mục M)" + `patterns` / `table` + `rule`, chép gọn từ bài ngày đó.
 */
import type { Block } from '@/components/sach-hoc/types';
import { TRA_25 } from './tracuu/ngay25';
import { TRA_26 } from './tracuu/ngay26';
import { TRA_27 } from './tracuu/ngay27';
import { TRA_28 } from './tracuu/ngay28';
import { TRA_29 } from './tracuu/ngay29';
import { TRA_30 } from './tracuu/ngay30';

export const TRA_CONG_THUC_CHANG5: Block[] = [...TRA_25, ...TRA_26, ...TRA_27, ...TRA_28, ...TRA_29, ...TRA_30];
