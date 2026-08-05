'use client';

/**
 * Một thẻ component trong danh sách.
 *
 * Hai chế độ hiển thị dùng CHUNG component này (`view`), không tách hai file:
 * lưới và danh sách chỉ khác cách xếp chữ, còn logic thêm-vào-giỏ, yêu thích,
 * nhãn danh mục thì y hệt — tách ra là hai bản sao rồi lệch nhau sau vài lần sửa.
 *
 * Toàn thẻ là MỘT `<Link>`; hai nút (giỏ, yêu thích) nằm trong đó nên phải
 * `preventDefault()` + `stopPropagation()`, nếu không bấm nút sẽ điều hướng luôn.
 */

import Link from 'next/link';
import { Plus, Check, Star, User2 } from 'lucide-react';
import { detailHref, prettyName, toRef, type TypeMeta } from '@/lib/ai-templates/catalog';
import { categoryLabel } from '@/lib/ai-templates/labels';
import type { ListItem } from '@/lib/ai-templates/types';
import { useAiTemplatesStore, itemKey } from '@/store/aiTemplatesStore';
import TypeIcon from './TypeIcon';

export default function ComponentCard({
  item,
  meta,
  view,
}: {
  item: ListItem;
  meta: TypeMeta;
  view: 'grid' | 'list';
}) {
  const ref = toRef(item.p);
  const key = itemKey(meta.type, item.p);

  // Đăng ký riêng từng mẩu state thay vì lấy cả store: một thẻ chỉ quan tâm
  // đúng hai boolean của chính nó. Lấy cả mảng `stack` sẽ khiến toàn bộ 48 thẻ
  // trên màn hình render lại mỗi lần thêm một món vào giỏ.
  const inStack = useAiTemplatesStore((s) =>
    s.stack.some((x) => x.type === meta.type && x.ref === ref),
  );
  const faved = useAiTemplatesStore((s) => s.favorites.includes(key));
  const toggleStack = useAiTemplatesStore((s) => s.toggleStack);
  const toggleFavorite = useAiTemplatesStore((s) => s.toggleFavorite);

  const onStack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleStack({ type: meta.type, ref, name: item.n, category: item.c });
  };

  const onFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(key);
  };

  const isList = view === 'list';

  return (
    <Link
      href={detailHref(meta.slug, item.p, item.c)}
      className={[
        'group relative flex rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]',
        'transition-colors duration-150 hover:border-[var(--accent-color)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]',
        isList ? 'items-start gap-3.5 px-4 py-3' : 'h-full flex-col gap-2.5 p-4',
      ].join(' ')}
    >
      <div className={isList ? 'flex min-w-0 flex-1 items-start gap-3.5' : 'contents'}>
        <span
          aria-hidden
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
          style={{ borderColor: `${meta.color}44`, background: `${meta.color}14`, color: meta.color }}
        >
          <TypeIcon name={meta.icon} size={15} />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="pr-14 font-heading text-[14px] font-semibold leading-snug text-[var(--text-primary)]">
            {prettyName(item.n)}
          </h3>

          {item.d ? (
            <p
              className="mt-1 text-[12.5px] leading-relaxed text-[var(--text-muted)]"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: isList ? 2 : 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {item.d}
            </p>
          ) : (
            <p className="mt-1 text-[12.5px] italic text-[var(--text-muted)] opacity-60">
              Chưa có mô tả — mở ra để đọc tệp nguồn.
            </p>
          )}
        </div>
      </div>

      <div className={isList ? 'flex shrink-0 items-center gap-1.5 pt-0.5' : 'mt-auto flex flex-wrap items-center gap-1.5 pt-1'}>
        <span className="rounded-md border border-[var(--border-color)] px-1.5 py-0.5 font-mono text-[10.5px] text-[var(--text-secondary)]">
          {categoryLabel(item.c)}
        </span>
        {item.a && !isList && (
          <span className="inline-flex items-center gap-1 text-[10.5px] text-[var(--text-muted)]">
            <User2 size={10} />
            {item.a}
          </span>
        )}
        {typeof item.s === 'number' && item.s > 0 && (
          <span className="inline-flex items-center gap-1 text-[10.5px] text-[var(--text-muted)]">
            <Star size={10} />
            {item.s.toLocaleString('vi-VN')}
          </span>
        )}
      </div>

      {/* Hai nút này luôn hiện — KHÔNG ẩn rồi chờ hover: trên cảm ứng không có
          hover, ẩn đi là mất tính năng trên điện thoại. */}
      <div className="absolute right-3 top-3 flex items-center gap-1">
        <button
          type="button"
          onClick={onFav}
          aria-pressed={faved}
          aria-label={faved ? 'Bỏ yêu thích' : 'Đánh dấu yêu thích'}
          title={faved ? 'Bỏ yêu thích' : 'Đánh dấu yêu thích'}
          className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-amber-500"
        >
          <Star size={13} className={faved ? 'fill-amber-400 text-amber-400' : ''} />
        </button>
        <button
          type="button"
          onClick={onStack}
          aria-pressed={inStack}
          aria-label={inStack ? 'Bỏ khỏi Stack' : 'Thêm vào Stack'}
          title={inStack ? 'Bỏ khỏi Stack' : 'Thêm vào Stack để cài chung một lệnh'}
          className={[
            'flex h-6 w-6 items-center justify-center rounded-md border transition-colors',
            inStack
              ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-500'
              : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]',
          ].join(' ')}
        >
          {inStack ? <Check size={13} /> : <Plus size={13} />}
        </button>
      </div>
    </Link>
  );
}
