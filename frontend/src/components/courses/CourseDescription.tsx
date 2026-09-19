'use client';

import { phanTichMoTa } from '@/lib/courseDescription';
import { sanitizeHtml } from '@/lib/utils';

/**
 * Mô tả khoá học: đoạn văn + dãy thẻ bước cho chuỗi lộ trình `A → B → C`.
 *
 * Trước đây chỗ này đổ thẳng chuỗi HTML vào `dangerouslySetInnerHTML`, mà
 * **495/573 môn** có mô tả >500 ký tự không một lần xuống dòng và **404 môn**
 * nhồi tới 13 mắt xích `→` vào giữa câu ⇒ một khối chữ đặc. Xem
 * `@/lib/courseDescription` để biết cách tách (và bất biến "không mất chữ").
 */
export function CourseDescription({ html, className = '' }: { html?: string | null; className?: string }) {
  const khoi = phanTichMoTa(html);
  if (!khoi.length) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {khoi.map((k, i) =>
        k.loai === 'doan' ? (
          <div
            key={i}
            className="text-text-secondary leading-relaxed prose prose-invert max-w-none prose-strong:text-text-primary prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(k.html) }}
          />
        ) : (
          // Số thứ tự đã nói lên trình tự, nên KHÔNG chèn mũi tên rời giữa các
          // thẻ: khi dãy xuống dòng, mũi tên rơi lẻ ở cuối dòng trông rất lởm.
          <ol key={i} className="flex flex-wrap gap-2" aria-label="Lộ trình nội dung">
            {k.buoc.map((b, j) => (
              <li
                key={j}
                className="inline-flex items-baseline gap-2 rounded-lg border border-darkborder/60 bg-darkbg/60 px-3 py-1.5 text-sm text-text-secondary max-w-full"
              >
                <span className="text-[11px] font-semibold text-neon-violet/90 tabular-nums shrink-0">
                  {String(j + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">{b}</span>
              </li>
            ))}
          </ol>
        ),
      )}
    </div>
  );
}

export default CourseDescription;
