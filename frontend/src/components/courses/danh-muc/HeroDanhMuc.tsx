'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Search, X, BookOpen, GraduationCap, LayoutGrid } from 'lucide-react';

interface Props {
  keyword: string;
  onKeywordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  /** null = chưa đếm xong (hiện gạch) */
  tongKhoa: number | null;
  tongMonAcademy: number | null;
  soDanhMuc: number;
}

function So({ giaTri }: { giaTri: number | null }) {
  return <>{giaTri == null ? '—' : giaTri.toLocaleString('vi-VN')}</>;
}

/**
 * Hero trang danh mục: lưới mờ + hai quầng sáng trôi chậm (tắt khi giảm chuyển động),
 * ô tìm kiếm lớn và ba con số thật (đếm từ API, không bịa).
 */
export default function HeroDanhMuc({
  keyword, onKeywordChange, onSubmit, onClear, tongKhoa, tongMonAcademy, soDanhMuc,
}: Props) {
  const giam = useReducedMotion();

  const thongKe = [
    { icon: BookOpen, nhan: 'khoá học', giaTri: tongKhoa },
    { icon: GraduationCap, nhan: 'môn FPTU Academy', giaTri: tongMonAcademy },
    { icon: LayoutGrid, nhan: 'danh mục', giaTri: soDanhMuc || null },
  ];

  return (
    <section className="relative overflow-hidden border-b border-[color-mix(in_srgb,var(--border-color)_60%,transparent)]">
      {/* Nền có chiều sâu */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(139,92,246,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.10) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 75%)',
          }}
        />
        <motion.div
          className="absolute -top-32 left-[8%] h-[420px] w-[420px] rounded-full bg-neon-indigo/20 blur-[120px]"
          animate={giam ? undefined : { x: [0, 60, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 right-[6%] h-[460px] w-[460px] rounded-full bg-neon-fuchsia/15 blur-[130px]"
          animate={giam ? undefined : { x: [0, -50, 0], y: [0, -25, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[var(--bg-primary)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-14 sm:pt-20 text-center">
        <motion.span
          initial={giam ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-neon-violet/30 bg-neon-violet/10 px-3 py-1 text-xs font-medium text-violet-700 [.theme-dark_&]:text-violet-200"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-neon-violet shadow-[0_0_8px_2px_rgba(139,92,246,0.7)]" />
          CuongThai Course Library
        </motion.span>

        <motion.h1
          initial={giam ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-5 font-heading text-[2rem] leading-tight font-bold text-text-primary sm:text-5xl"
        >
          Learn the stack{' '}
          <span className="bg-gradient-to-r from-neon-indigo via-neon-violet to-neon-fuchsia bg-clip-text text-transparent">
            CuongThai runs on
          </span>
        </motion.h1>

        <motion.p
          initial={giam ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-base text-text-secondary sm:text-lg"
        >
          Every course is a tool used in production here — with a clear path and in-depth lessons.
        </motion.p>

        <motion.form
          onSubmit={onSubmit}
          initial={giam ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-8 max-w-2xl"
          role="search"
        >
          <div className="group relative flex items-center rounded-2xl border border-[var(--border-color)] bg-[color-mix(in_srgb,var(--bg-card)_80%,transparent)] p-1.5 shadow-[0_10px_40px_-12px_rgba(99,102,241,0.45)] backdrop-blur-md transition-colors focus-within:border-neon-violet/60">
            <Search className="pointer-events-none ml-3 h-5 w-5 shrink-0 text-text-muted group-focus-within:text-violet-700 [.theme-dark_&]:group-focus-within:text-neon-violet" />
            <input
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="Tìm khoá học, công nghệ, mã môn…"
              aria-label="Tìm khoá học"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            {keyword && (
              <button
                type="button"
                onClick={onClear}
                aria-label="Xoá từ khoá"
                className="mr-1 rounded-lg p-2 text-text-muted hover:bg-[var(--bg-surface-hover)] hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:px-6"
            >
              Tìm
            </button>
          </div>
        </motion.form>

        <motion.ul
          initial={giam ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {thongKe.map(({ icon: Icon, nhan, giaTri }) => (
            <li key={nhan} className="flex items-center gap-2.5 text-left">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[color-mix(in_srgb,var(--bg-card)_70%,transparent)] text-violet-700 [.theme-dark_&]:text-neon-violet">
                <Icon className="h-4 w-4" />
              </span>
              <span className="leading-tight">
                <span className="block font-heading text-lg font-bold tabular-nums text-text-primary">
                  <So giaTri={giaTri} />
                </span>
                <span className="block text-xs text-text-muted">{nhan}</span>
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
