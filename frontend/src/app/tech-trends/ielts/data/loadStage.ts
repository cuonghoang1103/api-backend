/**
 * Nạp MỘT chặng khi cần (dynamic import → mỗi chặng một chunk JS).
 *
 * `bundles.ts` import tĩnh cả 4 chặng (~1,2 MB mã nguồn) — dùng được cho script
 * và trang cũ, nhưng đưa thẳng vào trang web thì người học tải cả 4 chặng chỉ
 * để xem một. Trang Kho luyện thêm (/language/en/ielts/luyen-them) đi qua đây.
 * STAGE_INFO là phần nhẹ cho bộ chuyển chặng — giữ khớp với bundleN.ts.
 */
import type { StageBundle } from './bundleTypes';

export const STAGE_INFO = [
  { id: 'stage1', label: 'Chặng 1', band: 'Band 0 → 4.0' },
  { id: 'stage2', label: 'Chặng 2', band: 'Band 4.0 → 5.5' },
  { id: 'stage3', label: 'Chặng 3', band: 'Band 5.5 → 6.5' },
  { id: 'stage4', label: 'Chặng 4', band: 'Band 6.5 → 7.5' },
] as const;

const LOADERS: (() => Promise<StageBundle>)[] = [
  () => import('./bundle1').then((m) => m.STAGE1),
  () => import('./bundle2').then((m) => m.STAGE2),
  () => import('./bundle3').then((m) => m.STAGE3),
  () => import('./bundle4').then((m) => m.STAGE4),
];

export function loadStage(i: number): Promise<StageBundle> {
  return LOADERS[i]();
}
