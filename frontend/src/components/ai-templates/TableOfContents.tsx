'use client';

/**
 * Mục lục dính bên phải trang chi tiết, tự tô sáng mục đang đọc.
 *
 * Dùng `IntersectionObserver` chứ không nghe sự kiện `scroll`: sự kiện scroll
 * bắn hàng chục lần mỗi giây và mỗi lần lại phải đo `getBoundingClientRect` của
 * mọi đề mục — đó là cách làm treo trang trên máy yếu. Observer để trình duyệt
 * tự lo, chỉ gọi lại khi có mục thật sự vượt qua ngưỡng.
 *
 * `rootMargin` âm ở dưới thu vùng quan sát về dải trên màn hình, nên mục sáng
 * lên là mục người ta ĐANG đọc, không phải mục vừa ló ra ở đáy.
 */

import { useEffect, useState } from 'react';
import type { Heading } from '@/lib/ai-templates/headings';

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="Mục lục" className="sticky top-6">
      <p className="mb-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
        Trong trang này
      </p>
      <ul className="max-h-[70vh] space-y-0.5 overflow-y-auto border-l border-[var(--border-color)]">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={[
                'block border-l-2 py-1 pr-2 text-[12.5px] leading-snug transition-colors',
                h.level === 3 ? 'pl-5' : 'pl-3',
                activeId === h.id
                  ? 'border-[var(--accent-color)] text-[var(--accent-color)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]',
              ].join(' ')}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
