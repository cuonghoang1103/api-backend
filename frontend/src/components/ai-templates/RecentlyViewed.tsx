'use client';

/**
 * Dải "Xem gần đây" trên trang danh sách, và mẩu ghi-nhận đặt ở trang chi tiết.
 *
 * Thay cho trang "Trending" của bản gốc: trang đó xếp theo `downloads`, mà cả
 * 1.877 bản ghi đều là `downloads: 0`, nên nó kẹt vĩnh viễn ở "Loading trending
 * data…". Lịch sử xem của chính người dùng là dữ liệu CÓ THẬT — và trong một
 * danh mục gần hai nghìn mục thì "quay lại cái vừa xem" là thao tác hay dùng
 * hơn hẳn "xem cái đang hot".
 *
 * ⚠️ Cả hai đều cần `mounted`: dữ liệu nằm ở localStorage nên server dựng ra
 * danh sách rỗng còn client dựng ra danh sách đầy → React kêu hydration
 * mismatch nếu vẽ ngay lượt đầu.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { History, X } from 'lucide-react';
import { detailHref, getTypeBySlug, prettyName } from '@/lib/ai-templates/catalog';
import { categoryLabel } from '@/lib/ai-templates/labels';
import type { TypeSlug } from '@/lib/ai-templates/types';
import { useAiTemplatesStore, type RecentItem } from '@/store/aiTemplatesStore';
import TypeIcon from './TypeIcon';

/**
 * Đặt ở trang chi tiết. Không vẽ gì — chỉ ghi lại lượt xem.
 *
 * Là component riêng thay vì `useEffect` trong trang: trang chi tiết là server
 * component (nó `await` nội dung từ GitHub), mà hook thì chỉ chạy ở client.
 */
export function RecordVisit({ item }: { item: RecentItem }) {
  const pushRecent = useAiTemplatesStore((s) => s.pushRecent);

  useEffect(() => {
    pushRecent(item);
    // Phụ thuộc theo TỪNG TRƯỜNG chứ không theo `item`: props là object mới
    // sau mỗi lần render, nên để `item` sẽ ghi lại vô hạn.
  }, [pushRecent, item.t, item.p, item.c, item.n]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default function RecentlyViewed({ exclude }: { exclude?: TypeSlug }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const recent = useAiTemplatesStore((s) => s.recent);
  const clearRecent = useAiTemplatesStore((s) => s.clearRecent);

  if (!mounted || recent.length === 0) return null;

  // `exclude` bỏ qua chính loại đang mở: danh sách ngay bên dưới đã có sẵn
  // những mục đó rồi, nhắc lại là chiếm chỗ mà không thêm gì.
  const items = exclude ? recent.filter((r) => r.t !== exclude) : recent;
  if (items.length === 0) return null;

  return (
    <section className="mb-4">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          <History size={12} />
          Xem gần đây
        </h2>
        <button
          type="button"
          onClick={clearRecent}
          className="ml-auto inline-flex items-center gap-1 text-[11.5px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        >
          <X size={11} />
          Xoá
        </button>
      </div>

      <ul className="ai-tmpl-scroll-x -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {items.map((r) => {
          const meta = getTypeBySlug(r.t);
          if (!meta) return null;
          return (
            <li key={`${r.t}:${r.p}`} className="shrink-0">
              <Link
                href={detailHref(meta.slug, r.p, r.c)}
                className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-2.5 py-1.5 transition-colors hover:border-[var(--accent-color)]"
              >
                <TypeIcon name={meta.icon} size={13} style={{ color: meta.color }} />
                <span className="max-w-[180px] truncate text-[12.5px] font-medium text-[var(--text-primary)]">
                  {prettyName(r.n)}
                </span>
                <span className="whitespace-nowrap text-[10.5px] text-[var(--text-muted)]">
                  {categoryLabel(r.c)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
