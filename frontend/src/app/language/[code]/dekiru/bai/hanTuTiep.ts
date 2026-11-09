/**
 * Thẻ chữ Hán của các bài TIẾP SAU SÁCH (Bài 16+, 09/11/2026) — gộp các tệp `hanTuN.ts` (mỗi bài một tệp, do
 * agent soạn bài viết) thành một bảng, cùng khuôn `HAN_TU` của hanTu.ts. Tải chậm cùng thẻ chữ Hán (data.ts › kanji).
 * Thêm bài mới: import `HAN_TU_N` rồi rải vào đây.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';
import { HAN_TU_16 } from './hanTu16';
import { HAN_TU_17 } from './hanTu17';
import { HAN_TU_18 } from './hanTu18';
import { HAN_TU_19 } from './hanTu19';
import { HAN_TU_20 } from './hanTu20';
import { HAN_TU_21 } from './hanTu21';
import { HAN_TU_22 } from './hanTu22';
import { HAN_TU_23 } from './hanTu23';
import { HAN_TU_24 } from './hanTu24';
import { HAN_TU_26 } from './hanTu26';
import { HAN_TU_27 } from './hanTu27';
import { HAN_TU_28 } from './hanTu28';
import { HAN_TU_29 } from './hanTu29';
import { HAN_TU_30 } from './hanTu30';
import { HAN_TU_31 } from './hanTu31';
import { HAN_TU_32 } from './hanTu32';
import { HAN_TU_33 } from './hanTu33';
import { HAN_TU_34 } from './hanTu34';
import { HAN_TU_35 } from './hanTu35';
import { HAN_TU_36 } from './hanTu36';
import { HAN_TU_37 } from './hanTu37';
import { HAN_TU_38 } from './hanTu38';

export const HAN_TU_TIEP: Record<string, HanTu> = {
  ...HAN_TU_16,
  ...HAN_TU_17,
  ...HAN_TU_18,
  ...HAN_TU_19,
  ...HAN_TU_20,
  ...HAN_TU_21,
  ...HAN_TU_22,
  ...HAN_TU_23,
  ...HAN_TU_24,
  ...HAN_TU_26,
  ...HAN_TU_27,
  ...HAN_TU_28,
  ...HAN_TU_29,
  ...HAN_TU_30,
  ...HAN_TU_31,
  ...HAN_TU_32,
  ...HAN_TU_33,
  ...HAN_TU_34,
  ...HAN_TU_35,
  ...HAN_TU_36,
  ...HAN_TU_37,
  ...HAN_TU_38,
};
