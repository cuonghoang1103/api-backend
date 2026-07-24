'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

/**
 * "Quay lại môn học" bar. Rendered on Code Lab (track/exercise) and Exp Hub
 * pages. When a lesson in Academy/Courses links here with `?ref=<internal
 * path>&reflabel=<name>`, this shows a prominent button back to that exact
 * course page, so the learner isn't stranded after following a practice link.
 *
 * Security: only honours `ref` values that are site-internal paths (start with
 * a single "/") — never an absolute/external URL — so it can't be abused as an
 * open redirect.
 */
export function CourseBackLink() {
  const sp = useSearchParams();
  const ref = sp.get('ref') || '';
  const label = sp.get('reflabel') || 'khóa học';
  const isInternal = /^\/(?!\/)/.test(ref);
  if (!isInternal) return null;

  return (
    <Link
      href={ref}
      className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all hover:-translate-y-0.5"
      style={{
        borderColor: 'color-mix(in srgb, var(--accent-color) 45%, var(--border-color))',
        background: 'color-mix(in srgb, var(--accent-color) 10%, var(--bg-card))',
        color: 'var(--accent-color)',
      }}
    >
      <ArrowLeft size={16} />
      Quay lại: <span style={{ color: 'var(--text-primary)' }}>{label}</span>
    </Link>
  );
}
