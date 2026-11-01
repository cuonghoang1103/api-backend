'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle2, Clock, Hourglass, Layers, Sparkles } from 'lucide-react';
import type { MonChuongTrinh } from '@/types';
import { pickLang } from '@/lib/utils';
import type { BoChu, NgonNgu } from './chu';
import s from './chuongTrinh.module.css';

/** Ảnh bìa khoá — ảnh hỏng thì về một ô mực trơn mang mã/chữ đầu (không ảnh stock). Ảnh là trang trí: tên khoá nằm
 *  ngay dưới trong cùng liên kết, nên `alt=""` để trình đọc màn hình không đọc tên hai lần. */
export function AnhBia({ m, ten, className }: { m: Pick<MonChuongTrinh, 'thumbnailUrl' | 'courseCode'>; ten: string; className?: string }) {
  const [hong, setHong] = useState(false);
  if (!m.thumbnailUrl || hong) {
    return (
      <div className={`flex items-center justify-center bg-[var(--k-thumb)] text-white ${className ?? ''}`} aria-hidden>
        <span className="line-clamp-2 px-3 text-center font-heading text-sm font-semibold leading-tight">
          {m.courseCode || ten.split(/[:—(]/)[0]!.trim()}
        </span>
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
      className={`bg-[var(--k-thumb)] object-cover ${className ?? ''}`}
    />
  );
}

const MAU_CAP_DO: Record<string, string> = {
  BEGINNER: 'bg-[var(--k-green-soft)] text-[var(--k-green)]',
  INTERMEDIATE: 'bg-[var(--k-amber-soft)] text-[var(--k-amber)]',
  ADVANCED: 'bg-[var(--k-rose-soft)] text-[var(--k-rose)]',
};

export function ChipCapDo({ level, c }: { level: string; c: BoChu }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${MAU_CAP_DO[level] ?? 'bg-[var(--k-accent-soft)] text-[var(--k-accent)]'}`}>
      {c.capDo[level] ?? level}
    </span>
  );
}

/** Chip mã/kỳ — màu nhấn tím như chip mã môn của Academy. */
export function ChipNhan({ children, tone = 'accent' }: { children: React.ReactNode; tone?: 'accent' | 'cyan' }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
        tone === 'cyan' ? 'bg-[var(--k-cyan-soft)] text-[var(--k-accent-2)]' : 'bg-[var(--k-accent-soft)] text-[var(--k-accent)]'
      }`}
    >
      {children}
    </span>
  );
}

/** Nhãn "Đang soạn" — vàng hổ phách + đồng hồ cát, có giải thích khi rê. */
export function NhanDangSoan({ c, noi }: { c: BoChu; noi?: boolean }) {
  return (
    <span
      title={c.dangSoanGiaiThich}
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-[var(--k-amber-line)] px-2.5 py-1 text-xs font-semibold ${
        noi ? 'bg-amber-400 text-amber-950 shadow-sm' : 'bg-[var(--k-amber-soft)] text-[var(--k-amber)]'
      }`}
    >
      <Hourglass aria-hidden className="h-3.5 w-3.5" />
      {c.dangSoan}
    </span>
  );
}

export function NhanSapRaMat({ c, noi }: { c: BoChu; noi?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-[var(--k-cyan-line)] px-2.5 py-1 text-xs font-semibold ${
        noi ? 'bg-cyan-300 text-cyan-950 shadow-sm' : 'bg-[var(--k-cyan-soft)] text-[var(--k-accent-2)]'
      }`}
    >
      <Sparkles aria-hidden className="h-3.5 w-3.5" />
      {c.sapRaMat}
    </span>
  );
}

export function TienDo({ p, c }: { p: number; c: BoChu }) {
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
        <span className={`${s.so} font-semibold text-[var(--k-accent)]`}>{c.tienDo(p)}</span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--k-accent-soft)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={p}
        aria-label={c.tienDo(p)}
      >
        <div className="h-full rounded-full" style={{ width: `${Math.max(3, p)}%`, background: 'var(--k-grad)' }} />
      </div>
    </div>
  );
}

/**
 * Thẻ khoá học — cùng khuôn với thẻ môn của Academy: ảnh bìa 16:9, chip, tên, mô tả, chân thẻ số bài/giờ.
 * `thuTu` = thứ tự trong kỳ (chế độ lộ trình) — hiện thành số tròn trên ảnh. `hienKy` = thêm chip "Kỳ N".
 */
export function TheKhoa({ m, nn, c, thuTu, hienKy }: {
  m: MonChuongTrinh; nn: NgonNgu; c: BoChu; thuTu?: number; hienKy?: boolean;
}) {
  const ten = pickLang(m.title, nn);
  const moTa = pickLang(m.shortDescription, nn);
  const gio = c.gio(m.totalDurationSeconds);
  const xong = m.progress != null && m.progress >= 100;
  return (
    <li className="min-w-0">
      <Link
        href={`/courses/${m.slug}`}
        className={`${s.theKhoa} group grid h-full grid-cols-[7.5rem_minmax(0,1fr)] gap-3 overflow-hidden rounded-2xl p-3 sm:flex sm:flex-col sm:gap-0 sm:p-0`}
      >
        {/* Điện thoại: thẻ nằm ngang (ảnh nhỏ bên trái) để 75 khoá không thành một cột dài vô tận. */}
        <div className="relative aspect-video self-start overflow-hidden rounded-xl bg-[var(--k-thumb)] sm:self-auto sm:rounded-none">
          <AnhBia m={m} ten={ten} className={`${s.anhKhoa} absolute inset-0 h-full w-full`} />
          <div className="absolute left-2.5 top-2.5 hidden flex-wrap gap-1.5 sm:flex">
            {m.sapRaMat ? <NhanSapRaMat c={c} noi /> : m.dangSoan ? <NhanDangSoan c={c} noi /> : null}
            {xong && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400 px-2.5 py-1 text-xs font-semibold text-emerald-950 shadow-sm">
                <CheckCircle2 aria-hidden className="h-3.5 w-3.5" />
                {c.daXong}
              </span>
            )}
          </div>
          {thuTu != null && (
            <span
              className={`${s.so} absolute right-2.5 top-2.5 hidden h-7 w-7 sm:grid place-items-center rounded-full bg-black/60 text-xs font-bold text-white ring-1 ring-white/25 backdrop-blur-sm`}
              title={c.thuTu(thuTu)}
            >
              <span aria-hidden>{thuTu}</span>
              <span className="sr-only">{c.thuTu(thuTu)}</span>
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="contents sm:hidden">
              {m.sapRaMat ? <NhanSapRaMat c={c} /> : m.dangSoan ? <NhanDangSoan c={c} /> : null}
            </span>
            {hienKy && m.loTrinhKy ? <ChipNhan>{c.kyNgan(m.loTrinhKy)}</ChipNhan> : null}
            <ChipCapDo level={m.level} c={c} />
            {m.categoryName && <span className="hidden sm:contents"><ChipNhan tone="cyan">{m.categoryName}</ChipNhan></span>}
          </div>
          <h3 className={`${s.tieuDe} ${s.tenKhoa} line-clamp-2 text-[15px] font-semibold leading-snug text-[var(--k-ink)] transition-colors sm:text-[17px]`}>
            {ten}
          </h3>
          {moTa && <p className="hidden text-sm leading-relaxed text-[var(--k-ink-2)] sm:line-clamp-3">{moTa}</p>}
          <div className="mt-auto pt-1">
            {m.progress != null && !xong ? (
              <TienDo p={m.progress} c={c} />
            ) : (
              <div className={`${s.so} flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[var(--k-ink-3)]`}>
                {m.sapRaMat ? (
                  m.soBaiDuKien ? (
                    <span className="inline-flex items-center gap-1.5"><Layers aria-hidden className="h-4 w-4" />{c.khung(m.soChuongDuKien ?? 0, m.soBaiDuKien)}</span>
                  ) : null
                ) : (
                  <>
                    {m.totalLessons > 0 && (
                      <span className="inline-flex items-center gap-1.5"><BookOpen aria-hidden className="h-4 w-4" />{c.bai(m.totalLessons)}</span>
                    )}
                    {gio && <span className="inline-flex items-center gap-1.5"><Clock aria-hidden className="h-4 w-4" />{gio}</span>}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

/** Thẻ nhỏ "Học tiếp" — ảnh + tên + tiến độ. */
export function TheHocTiep({ m, nn, c }: { m: MonChuongTrinh; nn: NgonNgu; c: BoChu }) {
  const ten = pickLang(m.title, nn);
  return (
    <li className="min-w-0">
      <Link href={`/courses/${m.slug}`} className={`${s.theKhoa} flex items-center gap-3 rounded-2xl p-3`}>
        <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-xl sm:w-28">
          <AnhBia m={m} ten={ten} className="absolute inset-0 h-full w-full" />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`${s.tieuDe} line-clamp-2 text-sm font-semibold leading-snug text-[var(--k-ink)]`}>{ten}</p>
          <div className="mt-2">
            <TienDo p={m.progress ?? 0} c={c} />
          </div>
        </div>
      </Link>
    </li>
  );
}
