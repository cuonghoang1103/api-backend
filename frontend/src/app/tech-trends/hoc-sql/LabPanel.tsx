'use client';

/**
 * Khối "làm bài tập" đặt cuối mỗi chương.
 *
 * Mọi liên kết đều mang theo `?ref=&reflabel=` để Code Lab hiện nút
 * "Quay lại: Học SQL từ số 0" — không có nó thì người học rơi sang một khu
 * khác của web và phải tự bấm nút Back nhiều lần mới về được chỗ đang đọc.
 */
import Link from 'next/link';
import { ExternalLink, Terminal, ArrowRight } from 'lucide-react';
import type { Chapter } from './data/types';
import { labModuleHref, labExerciseHref } from './data';

export default function LabPanel({ chapter }: { chapter: Chapter }) {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/[0.10] via-emerald-500/[0.04] to-transparent">
      <div className="flex flex-wrap items-center gap-3 border-b border-emerald-400/20 px-4 py-3 sm:px-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
          <Terminal className="h-4.5 w-4.5 text-tone-emerald" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-tone-emerald">Giờ làm bài tập trên PostgreSQL thật</p>
          <p className="text-xs text-text-secondary">
            Module <span className="text-text-secondary">{chapter.labModuleName}</span> · {chapter.labCount} bài
          </p>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-5">
        <p className="mb-3.5 text-[14px] leading-relaxed text-text-secondary">
          Đọc hiểu chưa đủ — SQL chỉ vào đầu khi tay bạn gõ. Bài tập chạy trên PostgreSQL 16 thật
          trong trình duyệt, chấm đúng/sai ngay, và có nút quay lại đúng chương này khi làm xong.
        </p>

        {chapter.labPicks && chapter.labPicks.length > 0 && (
          <div className="mb-3.5 space-y-1.5">
            {chapter.labPicks.map((p, i) => (
              <Link
                key={p.slug}
                href={labExerciseHref(p.slug)}
                className="group flex items-center gap-3 rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] px-3.5 py-2.5 transition-all hover:border-emerald-400/40 hover:bg-emerald-500/[0.07]"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 font-mono text-[11px] font-bold text-tone-emerald">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium text-text-primary group-hover:text-text-primary">{p.vi}</span>
                  <span className="block truncate font-mono text-[11px] text-text-muted">{p.title}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-text-muted transition-all group-hover:translate-x-0.5 group-hover:text-tone-emerald" />
              </Link>
            ))}
          </div>
        )}

        <Link
          href={labModuleHref(chapter.labModuleId)}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-4 py-2.5 text-sm font-semibold text-text-primary transition-all hover:bg-emerald-500/30 active:scale-95"
        >
          Mở cả {chapter.labCount} bài của module này
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
