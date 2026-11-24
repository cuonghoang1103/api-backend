/**
 * Mục TRA CÔNG THỨC của IELTS Tập 5 — chặng 4 (Ngày 19–24). Soạn cùng `ngay/ngay19..24.ts`.
 * `tracuu.ts` ghép mảng này vào `TRA_CONG_THUC_T5.blocks` — tệp tách riêng để các phiên soạn chặng khác không giẫm lên nhau.
 *
 * Mỗi mục: `h` "(Ngày N · mục M)" + `patterns` / `table` + `rule`, chép gọn từ bài ngày đó.
 */
import type { Block } from '@/components/sach-hoc/types';
import { TRA_19 } from './tracuu/ngay19';
import { TRA_20 } from './tracuu/ngay20';
import { TRA_21 } from './tracuu/ngay21';
import { TRA_22 } from './tracuu/ngay22';
import { TRA_23 } from './tracuu/ngay23';
import { TRA_24 } from './tracuu/ngay24';

export const TRA_CONG_THUC_CHANG4: Block[] = [...TRA_19, ...TRA_20, ...TRA_21, ...TRA_22, ...TRA_23, ...TRA_24];
