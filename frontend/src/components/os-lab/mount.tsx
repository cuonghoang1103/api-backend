'use client';
/**
 * OS Visual Lab — lối vào cũ, nay chỉ là lớp mỏng trên bộ gắn CHUNG (components/labs/mount.tsx, 28/10/2026), để
 * OsLabGallery và mọi chỗ đang gọi mountOsLabs/OsLabEmbed chạy y như trước. Khối nhúng vẫn là
 *   <div class="os-lab os-lab-sim-<tên> os-lab-p-<preset>">…</div>
 */
import { LabEmbed, mountLabs } from '../labs/mount';
import type { Lang } from './ui';

export function OsLabEmbed({ name, preset, lang }: { name: string; preset?: string; lang: Lang }) {
  return <LabEmbed ns="os-lab" name={name} preset={preset} lang={lang} />;
}

export function mountOsLabs(root: HTMLElement, fallbackLang: Lang): () => void {
  return mountLabs(root, fallbackLang, ['os-lab']);
}
