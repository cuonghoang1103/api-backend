'use client';

import Link from 'next/link';
import { GraduationCap, ArrowRight, Check, BookOpen } from 'lucide-react';
import { useTranslation } from '@/context/LocaleContext';
import { pickLang } from '@/lib/utils';
import type { PrereqCourse } from '@/lib/coursePrerequisites';

/**
 * Soft prerequisite gate UI: a modal shown once per course (until acknowledged)
 * and an inline "you should know first" banner for the course hero.
 * Text is bilingual via the active locale.
 */

export function PrerequisiteModal({
  courseTitle,
  prerequisites,
  onProceed,
  onGoToFoundation,
}: {
  courseTitle: string;
  prerequisites: PrereqCourse[];
  onProceed: () => void;
  onGoToFoundation: (slug: string) => void;
}) {
  const { locale } = useTranslation();
  const en = locale === 'en';
  const first = prerequisites[0];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl border border-darkborder bg-darkcard shadow-2xl overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="grid place-items-center w-11 h-11 rounded-xl bg-neon-indigo/15 text-neon-indigo shrink-0">
              <GraduationCap className="w-6 h-6" />
            </span>
            <h2 className="text-xl font-heading font-bold text-text-primary">
              {en ? 'Do you have the foundation?' : 'Bạn đã có nền tảng chưa?'}
            </h2>
          </div>

          <p className="text-text-secondary leading-relaxed mb-4">
            {en ? (
              <>
                <strong className="text-text-primary">{pickLang(courseTitle, locale)}</strong> assumes you
                already know some basics. If any of the topics below feel new, the foundation course covers
                them from zero — it will make this course far easier to follow.
              </>
            ) : (
              <>
                <strong className="text-text-primary">{pickLang(courseTitle, locale)}</strong> mặc định bạn đã
                biết một số kiến thức nền. Nếu các chủ đề dưới đây còn lạ với bạn, khoá nền tảng dạy chúng từ
                số 0 — sẽ giúp bạn học khoá này dễ hơn nhiều.
              </>
            )}
          </p>

          <div className="rounded-xl border border-darkborder bg-darkbg/60 p-4 mb-6">
            <p className="text-xs uppercase tracking-wide text-text-muted mb-2">
              {en ? 'Recommended first' : 'Nên học trước'}
            </p>
            <ul className="space-y-1.5">
              {prerequisites.map((p) => (
                <li key={p.slug} className="flex items-center gap-2 text-text-primary">
                  <BookOpen className="w-4 h-4 text-neon-violet shrink-0" />
                  {pickLang(p.title, locale)}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => first && onGoToFoundation(first.slug)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium hover:opacity-90 transition-opacity"
            >
              {en ? 'Learn the foundation first' : 'Học nền tảng trước'}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onProceed}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-darkborder text-text-secondary hover:text-text-primary hover:border-neon-violet/40 transition-colors"
            >
              <Check className="w-4 h-4" />
              {en ? 'I already know this' : 'Tôi đã có nền tảng'}
            </button>
          </div>
          <p className="text-xs text-text-muted mt-3 text-center">
            {en
              ? 'We will remember your choice and not ask again for this course.'
              : 'Chúng tôi sẽ nhớ lựa chọn và không hỏi lại cho khoá này.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PrerequisiteBanner({ prerequisites }: { prerequisites: PrereqCourse[] }) {
  const { locale } = useTranslation();
  const en = locale === 'en';
  if (!prerequisites.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 rounded-xl border border-neon-violet/25 bg-neon-violet/5 px-4 py-3 text-sm">
      <span className="inline-flex items-center gap-1.5 text-neon-violet font-medium">
        <GraduationCap className="w-4 h-4" />
        {en ? 'Recommended first:' : 'Bạn nên biết trước:'}
      </span>
      {prerequisites.map((p, i) => (
        <span key={p.slug} className="inline-flex items-center">
          <Link
            href={`/courses/${p.slug}`}
            className="text-text-primary underline decoration-neon-violet/40 underline-offset-2 hover:decoration-neon-violet transition-colors"
          >
            {pickLang(p.title, locale)}
          </Link>
          {i < prerequisites.length - 1 && <span className="text-text-muted mx-1">·</span>}
        </span>
      ))}
    </div>
  );
}
