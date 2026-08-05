'use client';

/**
 * Thanh chuyển giữa 10 loại component.
 *
 * ─── VÌ SAO KHÔNG PHẢI SIDEBAR DỌC ──────────────────────────────────────────
 * Trang gốc để danh sách loại ở một cột dọc bên trái. Site này ĐÃ CÓ một dock
 * dọc bên trái do layout gốc dựng (`DockLayout`) — thêm cột thứ hai là hai
 * thanh điều hướng chồng nhau, người dùng không biết cái nào là của trang nào.
 * Nên ở đây đổi thành hàng ngang cuộn được: giữ nguyên thông tin (nhãn + số
 * lượng + màu), bỏ đi phần xung đột.
 */

import Link from 'next/link';
import { TYPES } from '@/lib/ai-templates/catalog';
import type { TypeSlug } from '@/lib/ai-templates/types';
import TypeIcon from './TypeIcon';

export default function TypeNav({
  active,
  counts,
}: {
  active: TypeSlug;
  counts: Record<TypeSlug, number>;
}) {
  return (
    <nav aria-label="Loại component" className="ai-tmpl-scroll-x -mx-1 overflow-x-auto pb-1">
      <ul className="flex min-w-max gap-1.5 px-1">
        {TYPES.map((t) => {
          const on = t.slug === active;
          return (
            <li key={t.slug}>
              <Link
                href={`/ai-templates/${t.slug}`}
                aria-current={on ? 'page' : undefined}
                className={[
                  'flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors',
                  on
                    ? 'text-[var(--text-primary)]'
                    : 'border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]',
                ].join(' ')}
                style={on ? { borderColor: t.color, background: `${t.color}14` } : undefined}
              >
                <TypeIcon name={t.icon} size={14} style={{ color: t.color }} />
                <span>{t.label}</span>
                <span
                  className={`rounded px-1.5 font-mono text-[10.5px] ${
                    on ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {counts[t.slug]}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
