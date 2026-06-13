'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function CourseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[course-detail] Error boundary caught', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-darkbg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center text-2xl">
          !
        </div>
        <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
          Không tải được khóa học
        </h2>
        <p className="text-text-secondary text-sm mb-6">
          Có lỗi khi tải trang này. Vui lòng thử lại hoặc quay lại danh sách khóa học.
        </p>
        {error?.digest && (
          <p className="text-text-muted text-xs mb-4 font-mono">digest: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Thử lại
          </button>
          <Link
            href="/courses"
            className="px-5 py-2.5 rounded-xl border border-darkborder text-text-secondary hover:bg-white/5 text-sm"
          >
            Về danh sách khóa học
          </Link>
        </div>
      </div>
    </div>
  );
}
