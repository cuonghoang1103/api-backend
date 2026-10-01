'use client';

import { useState } from 'react';
import { Hammer, History, ListChecks } from 'lucide-react';
import { phanTichMoTa } from '@/lib/courseDescription';
import { sanitizeHtml } from '@/lib/utils';

/**
 * Mô tả khoá học, dựng từ các khối của `phanTichMoTa`:
 *  - đoạn đầu = câu giới thiệu (lead, chữ to hơn);
 *  - "Lịch sử từ …" = một khối riêng;
 *  - chủ đề nối bằng `;` = lưới có số (2 cột từ sm), mục dài gập gọn + "Xem thêm";
 *  - "dự án cuối: …" = ô nổi bật 🛠;
 *  - chuỗi `A → B → C` = dãy thẻ bước (như cũ).
 *
 * Trước đây chỗ này đổ thẳng chuỗi HTML vào `dangerouslySetInnerHTML`, mà
 * **495/573 môn** có mô tả >500 ký tự không một lần xuống dòng và **404 môn**
 * nhồi tới 13 mắt xích `→` vào giữa câu ⇒ một khối chữ đặc. Xem
 * `@/lib/courseDescription` để biết cách tách (và bất biến "không mất chữ").
 *
 * Màu đi theo biến theme (`--text-*`, `--bg-*`, `--border-color`) nên đúng cả
 * theme sáng lẫn tối. Theme tối = class `theme-dark` trên <html>, KHÔNG dùng `dark:`.
 */

/** Mục dài hơn chừng này ký tự (chữ thuần) thì gập còn 2 dòng, có nút mở. */
const MUC_DAI = 150;

const SO = 'shrink-0 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-md px-1 text-[11px] font-bold tabular-nums bg-violet-500/10 text-violet-700 [.theme-dark_&]:text-violet-300';

function Html({ html, className = '' }: { html: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />;
}

function MucChuDe({ html, so }: { html: string; so: number }) {
  const [mo, setMo] = useState(false);
  const dai = html.replace(/<[^>]*>/g, '').length > MUC_DAI;
  return (
    <li className="flex min-w-0 items-start gap-2.5 rounded-xl border border-[color-mix(in_srgb,var(--border-color)_60%,transparent)] bg-[color-mix(in_srgb,var(--bg-primary)_60%,transparent)] px-3 py-2.5 text-sm leading-relaxed text-text-secondary">
      <span className={SO}>{String(so).padStart(2, '0')}</span>
      <span className="min-w-0 flex-1">
        <Html
          html={html}
          className={`block break-words [&_strong]:font-semibold [&_strong]:text-text-primary ${dai && !mo ? 'line-clamp-2' : ''}`}
        />
        {dai && (
          <button
            type="button"
            onClick={() => setMo((v) => !v)}
            aria-expanded={mo}
            className="mt-0.5 text-xs font-medium text-violet-700 hover:underline [.theme-dark_&]:text-violet-300"
          >
            {mo ? 'Thu gọn' : 'Xem thêm'}
          </button>
        )}
      </span>
    </li>
  );
}

export function CourseDescription({ html, className = '' }: { html?: string | null; className?: string }) {
  const khoi = phanTichMoTa(html);
  if (!khoi.length) return null;

  return (
    <div className={`space-y-5 ${className}`}>
      {khoi.map((k, i) => {
        switch (k.loai) {
          case 'doan':
            return (
              <div
                key={i}
                className={`leading-relaxed [&_strong]:font-semibold [&_strong]:text-text-primary ${
                  i === 0 ? 'text-[15.5px] text-text-primary sm:text-base' : 'text-text-secondary'
                }`}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(k.html) }}
              />
            );

          case 'lichSu':
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-3.5 text-sm leading-relaxed text-text-secondary"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-800 [.theme-dark_&]:text-amber-300">
                  <History className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wider text-amber-800 [.theme-dark_&]:text-amber-300">
                    Bối cảnh lịch sử
                  </span>
                  <Html html={k.html} className="[&_strong]:font-semibold [&_strong]:text-text-primary" />
                </span>
              </div>
            );

          case 'danhSach':
            return (
              <div key={i}>
                <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-text-primary">
                  <ListChecks className="h-4 w-4 shrink-0 text-violet-600 [.theme-dark_&]:text-violet-300" />
                  {k.dan ? <Html html={k.dan} /> : 'Nội dung chính'}
                  <span className="text-xs font-normal text-text-muted">· {k.muc.length} chủ đề</span>
                </h3>
                <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2" aria-label="Các chủ đề của khoá">
                  {k.muc.map((m, j) => (
                    <MucChuDe key={j} html={m} so={j + 1} />
                  ))}
                </ol>
              </div>
            );

          case 'duAn':
            return (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/[0.10] via-emerald-500/[0.04] to-transparent p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-lg" aria-hidden>
                    🛠
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 [.theme-dark_&]:text-emerald-300">
                      {k.nhan || 'Dự án cuối khoá'}
                    </p>
                    <Html
                      html={k.html}
                      className="mt-0.5 block text-sm font-medium leading-relaxed text-text-primary [&_strong]:font-semibold"
                    />
                  </div>
                </div>
                <Hammer aria-hidden className="pointer-events-none absolute -bottom-3 -right-2 h-16 w-16 rotate-12 text-emerald-500/10" />
              </div>
            );

          case 'chuoi':
            // Số thứ tự đã nói lên trình tự, nên KHÔNG chèn mũi tên rời giữa các
            // thẻ: khi dãy xuống dòng, mũi tên rơi lẻ ở cuối dòng trông rất lởm.
            return (
              <ol key={i} className="flex flex-wrap gap-2" aria-label="Lộ trình nội dung">
                {k.buoc.map((b, j) => (
                  <li
                    key={j}
                    className="inline-flex max-w-full items-baseline gap-2 rounded-lg border border-[color-mix(in_srgb,var(--border-color)_60%,transparent)] bg-[color-mix(in_srgb,var(--bg-primary)_60%,transparent)] px-3 py-1.5 text-sm text-text-secondary"
                  >
                    <span className="shrink-0 text-[11px] font-semibold tabular-nums text-violet-700 [.theme-dark_&]:text-neon-violet/90">
                      {String(j + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">{b}</span>
                  </li>
                ))}
              </ol>
            );
        }
      })}
    </div>
  );
}

export default CourseDescription;
