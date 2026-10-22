'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { MonChuongTrinh } from '@/types';
import { pickLang } from '@/lib/utils';
import type { BoChu, NgonNgu } from './chu';
import s from './chuongTrinh.module.css';

/** Ảnh bìa khoá — ảnh hỏng thì về một ô mực trơn mang mã/chữ đầu, không dùng ảnh stock. */
function AnhBia({ m, ten, className }: { m: MonChuongTrinh; ten: string; className?: string }) {
  const [hong, setHong] = useState(false);
  if (!m.thumbnailUrl || hong) {
    return (
      <div className={`flex items-center justify-center bg-[var(--p-thumb)] text-[var(--p-paper)] ${className ?? ''}`} aria-hidden>
        <span className="font-editorial text-lg">{(m.courseCode || ten).slice(0, 2)}</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={m.thumbnailUrl}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setHong(true)}
      className={`bg-[var(--p-thumb)] object-cover ${className ?? ''}`}
    />
  );
}

function MetaKhoa({ m, c, hienKy }: { m: MonChuongTrinh; c: BoChu; hienKy?: boolean }) {
  const phan = [
    hienKy && m.loTrinhKy ? c.kyNgan(m.loTrinhKy) : null,
    c.capDo[m.level] ?? m.level,
    m.totalLessons ? c.bai(m.totalLessons) : null,
    c.gio(m.totalDurationSeconds) || null,
    m.categoryName,
  ].filter(Boolean) as string[];
  return (
    <p className={`${s.so} flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-[var(--p-ink-3)]`}>
      {phan.map((x, i) => (
        <span key={i} className="whitespace-nowrap">
          {x}
          {i < phan.length - 1 && <span aria-hidden className="ml-2 text-[var(--p-ink-3)] opacity-50">/</span>}
        </span>
      ))}
    </p>
  );
}

function TienDo({ p, c }: { p: number; c: BoChu }) {
  return (
    <div className="w-full">
      <p className={`${s.so} mb-1 text-xs font-medium text-[var(--p-accent)]`}>{c.tienDo(p)}</p>
      <div
        className="h-[3px] w-full bg-[var(--p-rule)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={p}
        aria-label={c.tienDo(p)}
      >
        <div className="h-full bg-[var(--p-accent)]" style={{ width: `${Math.max(2, p)}%` }} />
      </div>
    </div>
  );
}

/**
 * Một dòng khoá học trong danh mục (kiểu bảng môn học của một trường): số thứ tự · ảnh · tên + mô tả · tiến độ.
 * `soThuTu` = thứ tự trong kỳ (lộ trình); bỏ trống ở các chế độ xem không có thứ tự.
 */
export function HangKhoa({ m, nn, c, soThuTu, hienKy }: {
  m: MonChuongTrinh; nn: NgonNgu; c: BoChu; soThuTu?: number; hienKy?: boolean;
}) {
  const ten = pickLang(m.title, nn);
  const moTa = pickLang(m.shortDescription, nn);
  return (
    <li className="border-t border-[var(--p-rule)] first:border-t-0">
      <Link
        href={`/courses/${m.slug}`}
        className={`${s.hang} group grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-x-4 gap-y-2 px-2 py-4 sm:grid-cols-[2rem_8.5rem_minmax(0,1fr)_7.5rem] sm:gap-x-5 sm:px-3 sm:py-5`}
      >
        <span aria-hidden className={`${s.so} hidden pt-0.5 font-editorial text-xl leading-none text-[var(--p-ink-3)] sm:block`}>
          {soThuTu ?? ''}
        </span>
        <AnhBia m={m} ten={ten} className="aspect-video w-full border border-[var(--p-rule)]" />
        <div className="min-w-0">
          <h4 className={`${s.tenKhoa} ${s.tieuDe} text-[15px] font-semibold leading-snug text-[var(--p-ink)] sm:text-base`}>
            {ten}
          </h4>
          {moTa && (
            <p className="mt-1 hidden text-sm leading-relaxed text-[var(--p-ink-2)] sm:line-clamp-2">{moTa}</p>
          )}
          <div className="mt-1.5">
            <MetaKhoa m={m} c={c} hienKy={hienKy} />
          </div>
          {m.progress != null && (
            <div className="mt-2.5 max-w-[12rem] sm:hidden">
              <TienDo p={m.progress} c={c} />
            </div>
          )}
        </div>
        <div className="hidden items-center justify-end gap-3 self-center sm:flex">
          {m.progress != null ? (
            <TienDo p={m.progress} c={c} />
          ) : (
            <ArrowRight aria-hidden className={`${s.muiTen} h-4 w-4 text-[var(--p-ink-3)]`} />
          )}
        </div>
      </Link>
    </li>
  );
}

/** Thẻ khoá cho chế độ "Tất cả khoá" — cùng giọng với hàng: phẳng, viền mảnh, chữ là chính. */
export function TheKhoa({ m, nn, c }: { m: MonChuongTrinh; nn: NgonNgu; c: BoChu }) {
  const ten = pickLang(m.title, nn);
  const moTa = pickLang(m.shortDescription, nn);
  return (
    <li className="min-w-0">
      <Link
        href={`/courses/${m.slug}`}
        className={`${s.the} group flex h-full flex-col border-t-2 border-[var(--p-rule-strong)] pt-4`}
      >
        <div className="overflow-hidden border border-[var(--p-rule)]">
          <AnhBia m={m} ten={ten} className={`${s.anhThe} aspect-video w-full`} />
        </div>
        <p className={`${s.so} mt-4 text-xs text-[var(--p-ink-3)]`}>
          {m.loTrinhKy ? c.hocKy(m.loTrinhKy) : c.khoaMoi}
          {m.categoryName ? ` · ${m.categoryName}` : ''}
        </p>
        <h3 className={`${s.tieuDe} mt-1.5 font-editorial text-xl leading-tight text-[var(--p-ink)] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4`}>
          {ten}
        </h3>
        {moTa && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--p-ink-2)]">{moTa}</p>}
        <div className="mt-auto pt-4">
          {m.progress != null ? (
            <TienDo p={m.progress} c={c} />
          ) : (
            <MetaKhoa m={m} c={c} />
          )}
        </div>
      </Link>
    </li>
  );
}
