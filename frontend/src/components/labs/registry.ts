/**
 * Danh mục CHUNG của mọi phòng lab trực quan: mỗi không gian tên trỏ tới danh mục riêng của nó.
 *   os-lab  → components/os-lab/registry.ts   (khoá Operating Systems for Developers, trang /os-lab)
 *   cpu-lab → components/cpu-lab/registry.ts  ("Máy tính từ số 0" — CSI104, CEA201; trang /cpu-lab)
 * Thêm một phòng lab mới = thêm tên vào selector.ts + một dòng ở đây; bộ gắn (mount.tsx) không phải sửa.
 */
import type { ComponentType } from 'react';
import { OS_LABS } from '../os-lab/registry';
import { CPU_LABS } from '../cpu-lab/registry';
import type { Lang } from '../os-lab/ui';
import type { LabNs } from './selector';

export interface LabDef {
  en: string; vi: string; descEn: string; descVi: string; chapterEn: string; chapterVi: string;
  presets: string[];
  load: () => Promise<{ default: ComponentType<{ lang?: Lang; preset?: string }> }>;
}

export const LABS: Record<LabNs, { labs: Record<string, LabDef>; gallery: string }> = {
  'os-lab': { labs: OS_LABS, gallery: '/os-lab' },
  'cpu-lab': { labs: CPU_LABS, gallery: '/cpu-lab' },
};

export const isLabIn = (ns: LabNs, name: string) => Object.prototype.hasOwnProperty.call(LABS[ns].labs, name);
