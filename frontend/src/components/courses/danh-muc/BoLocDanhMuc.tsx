'use client';

import { LayoutGrid, Check } from 'lucide-react';
import type { CourseCategory } from '@/types';
import { bieuTuongDanhMuc, sacDanhMuc } from './bieuTuongDanhMuc';

export const CAP_DO = [
  { value: '', label: 'Tất cả', cham: 'bg-text-muted' },
  { value: 'BEGINNER', label: 'Cơ bản', cham: 'bg-emerald-400' },
  { value: 'INTERMEDIATE', label: 'Trung cấp', cham: 'bg-amber-400' },
  { value: 'ADVANCED', label: 'Nâng cao', cham: 'bg-rose-400' },
] as const;

interface ThanhDanhMucProps {
  categories: CourseCategory[];
  dangChon: string;
  onChon: (slug: string) => void;
  /** Tổng khoá của tab "Tất cả" (null = chưa đếm) */
  tongKhoa: number | null;
}

/**
 * Thẻ danh mục có icon + số khoá. Mobile: một dải cuộn ngang (snap); từ md: lưới.
 */
export function ThanhDanhMuc({ categories, dangChon, onChon, tongKhoa }: ThanhDanhMucProps) {
  const items = [
    { key: '', ten: 'Tất cả', soKhoa: tongKhoa, Icon: LayoutGrid, sac: 'from-neon-indigo/25 to-neon-violet/10 text-violet-700 [.theme-dark_&]:text-violet-300' },
    ...categories.map((c) => ({
      key: c.slug,
      ten: c.name,
      soKhoa: typeof c.courseCount === 'number' ? c.courseCount : null,
      Icon: bieuTuongDanhMuc(c.icon),
      sac: sacDanhMuc(c.icon),
    })),
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Danh mục khoá học"
      className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] md:mx-0 md:grid md:snap-none md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-6"
    >
      {items.map(({ key, ten, soKhoa, Icon, sac }) => {
        const chon = dangChon === key;
        return (
          <button
            key={key || 'tat-ca'}
            role="radio"
            aria-checked={chon}
            onClick={() => onChon(key)}
            className={`group relative flex w-[150px] shrink-0 snap-start items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 md:w-auto ${
              chon
                ? 'border-neon-violet/70 bg-neon-violet/10 shadow-[0_0_0_1px_rgba(139,92,246,0.35),0_10px_30px_-12px_rgba(139,92,246,0.6)]'
                : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:-translate-y-0.5 hover:border-neon-violet/35 hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sac}`}>
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block line-clamp-2 break-words text-sm font-semibold leading-snug ${chon ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                {ten}
              </span>
              <span className="block text-xs tabular-nums text-text-muted">
                {soKhoa == null ? '…' : `${soKhoa.toLocaleString('vi-VN')} khoá`}
              </span>
            </span>
            {chon && (
              <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-neon-violet text-white">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface ChipCapDoProps {
  dangChon: string;
  onChon: (v: string) => void;
}

export function ChipCapDo({ dangChon, onChon }: ChipCapDoProps) {
  return (
    <div role="radiogroup" aria-label="Cấp độ" className="flex min-w-0 flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-medium uppercase tracking-wider text-text-muted">Cấp độ</span>
      {CAP_DO.map((l) => {
        const chon = dangChon === l.value;
        return (
          <button
            key={l.value || 'all'}
            role="radio"
            aria-checked={chon}
            onClick={() => onChon(l.value)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              chon
                ? 'border-neon-violet/60 bg-neon-violet/15 text-text-primary'
                : 'border-[var(--border-color)] bg-[var(--bg-card)] text-text-muted hover:border-neon-violet/30 hover:text-text-primary'
            }`}
          >
            {l.value && <span className={`h-1.5 w-1.5 rounded-full ${l.cham}`} />}
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
