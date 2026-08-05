'use client';

/**
 * Trình duyệt danh sách component — tìm, lọc, sắp xếp, đổi cách hiển thị.
 *
 * ─── VÌ SAO LỌC Ở TRÌNH DUYỆT ───────────────────────────────────────────────
 * Danh mục là dữ liệu TĨNH, đóng gói sẵn lúc build. Loại lớn nhất (skills) là
 * 871 mục ≈ 200 KB sau khi rút gọn — nhỏ hơn cả một tấm ảnh bìa. Gửi hết một
 * lần rồi lọc tại chỗ cho ra kết quả TỨC THÌ khi gõ; đi vòng qua server thì mỗi
 * ký tự là một lượt mạng, chậm hơn hẳn mà chẳng được gì.
 *
 * ─── VÌ SAO CHIA LÔ KHI VẼ ──────────────────────────────────────────────────
 * Lọc 871 mục thì nhanh, nhưng DỰNG 871 thẻ DOM cùng lúc thì đơ máy yếu vài
 * trăm mili giây. Chỉ vẽ `PAGE` thẻ đầu, bấm "Xem thêm" mới vẽ tiếp — đơn giản
 * hơn cuộn ảo và không có nhược điểm của nó (Ctrl+F không tìm được, mất vị trí
 * cuộn khi quay lại).
 *
 * ─── TRẠNG THÁI NẰM TRÊN URL ────────────────────────────────────────────────
 * Từ khoá / danh mục / sắp xếp / cách hiện đều ghi vào query string bằng
 * `replaceState`, KHÔNG dùng `router.replace`: router của Next sẽ chạy lại
 * server component cho mỗi ký tự gõ vào. `replaceState` chỉ sửa thanh địa chỉ,
 * đủ để dán link chia sẻ và để nút Quay lại hoạt động, mà không tốn gì.
 */

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutGrid, List, Search, SlidersHorizontal, Star, X } from 'lucide-react';
import type { TypeMeta } from '@/lib/ai-templates/catalog';
import { toRef } from '@/lib/ai-templates/catalog';
import { categoryLabel } from '@/lib/ai-templates/labels';
import type { CategoryCount, ListItem } from '@/lib/ai-templates/types';
import { useAiTemplatesStore, itemKey } from '@/store/aiTemplatesStore';
import ComponentCard from './ComponentCard';

const PAGE = 48;

type Sort = 'default' | 'az' | 'za' | 'described' | 'stars';

const SORTS: { value: Sort; label: string }[] = [
  { value: 'default', label: 'Mặc định (theo danh mục)' },
  { value: 'az', label: 'Tên A → Z' },
  { value: 'za', label: 'Tên Z → A' },
  { value: 'described', label: 'Mô tả đầy đủ trước' },
];

/** Chỉ Plugins có số sao GitHub, nên tuỳ chọn này chỉ hiện ở đó. */
const STAR_SORT: { value: Sort; label: string } = {
  value: 'stars',
  label: 'Nhiều sao GitHub nhất',
};

/** Bỏ dấu tiếng Việt để gõ "bao mat" vẫn ra "bảo mật". */
function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export default function ComponentBrowser({
  items,
  categories,
  meta,
}: {
  items: ListItem[];
  categories: CategoryCount[];
  meta: TypeMeta;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<Sort>('default');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [onlyFav, setOnlyFav] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [catOpen, setCatOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const favorites = useAiTemplatesStore((s) => s.favorites);
  const addToStack = useAiTemplatesStore((s) => s.addToStack);
  const openStack = useAiTemplatesStore((s) => s.openStack);

  const sortOptions = useMemo(
    () => (items.some((i) => i.s) ? [STAR_SORT, ...SORTS] : SORTS),
    [items],
  );

  /**
   * Chuỗi tìm kiếm dựng SẴN một lần cho mỗi mục.
   *
   * Hai lý do, cả hai đều quan trọng:
   * 1. Có NHÃN TIẾNG VIỆT của danh mục trong đó. Dữ liệu gốc toàn tiếng Anh,
   *    nên không có dòng này thì gõ "bao mat" ra 0 kết quả dù có 47 skill bảo
   *    mật — đúng lỗi đã gặp khi thử lần đầu.
   * 2. `fold()` (chuẩn hoá NFD + bỏ dấu) là việc nặng. Làm trong vòng lọc
   *    nghĩa là mỗi ký tự gõ vào phải chuẩn hoá lại 871 đoạn mô tả. Làm sẵn ở
   *    đây thì gõ chỉ còn là `includes()` trên chuỗi có sẵn.
   */
  const index = useMemo(
    () =>
      items.map((i) => ({
        i,
        hay: fold(
          `${i.n} ${i.c} ${categoryLabel(i.c)} ${i.d} ${i.a ?? ''} ${(i.k ?? []).join(' ')}`,
        ),
      })),
    [items],
  );

  // Đọc trạng thái từ URL đúng MỘT lần lúc gắn vào cây. Đọc trong `useState`
  // initializer sẽ chạy cả trên server (không có window) → hydration mismatch.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const q = p.get('q');
    const c = p.get('cat');
    const s = p.get('sort') as Sort | null;
    const v = p.get('view');
    if (q) setQuery(q);
    if (c) setCategory(c);
    if (s && [STAR_SORT, ...SORTS].some((x) => x.value === s)) setSort(s);
    if (v === 'list' || v === 'grid') setView(v);
    if (p.get('fav') === '1') setOnlyFav(true);
  }, []);

  // Ghi ngược lên URL, gộp cuối vòng lặp sự kiện để gõ nhanh không tạo hàng
  // trăm lượt ghi history.
  useEffect(() => {
    const id = setTimeout(() => {
      const p = new URLSearchParams();
      if (query) p.set('q', query);
      if (category) p.set('cat', category);
      if (sort !== 'default') p.set('sort', sort);
      if (view !== 'grid') p.set('view', view);
      if (onlyFav) p.set('fav', '1');
      const qs = p.toString();
      window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
    }, 250);
    return () => clearTimeout(id);
  }, [query, category, sort, view, onlyFav]);

  // `useDeferredValue` giữ ô nhập luôn mượt: React vẽ ký tự vừa gõ ngay, còn
  // việc lọc 871 mục thì để lượt render sau, có thể bị ngắt quãng.
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = fold(deferredQuery.trim());
    const terms = q ? q.split(/\s+/) : [];
    const favSet = onlyFav ? new Set(favorites) : null;

    let rows = index;

    if (category) rows = rows.filter((r) => r.i.c === category);
    if (favSet) rows = rows.filter((r) => favSet.has(itemKey(meta.type, r.i.p)));
    if (terms.length) rows = rows.filter((r) => terms.every((t) => r.hay.includes(t)));

    let out = rows.map((r) => r.i);

    if (sort === 'az') out = [...out].sort((a, b) => a.n.localeCompare(b.n));
    else if (sort === 'za') out = [...out].sort((a, b) => b.n.localeCompare(a.n));
    else if (sort === 'described')
      out = [...out].sort((a, b) => b.d.length - a.d.length || a.n.localeCompare(b.n));
    else if (sort === 'stars') out = [...out].sort((a, b) => (b.s ?? 0) - (a.s ?? 0));

    return out;
  }, [index, deferredQuery, category, sort, onlyFav, favorites, meta.type]);

  // Đổi bộ lọc thì quay về lô đầu, nếu không người dùng đang xem 300 thẻ rồi
  // lọc còn 12 thẻ mà trang vẫn dài như cũ.
  useEffect(() => setShown(PAGE), [deferredQuery, category, sort, onlyFav]);

  const visible = filtered.slice(0, shown);
  const hasFilter = Boolean(query || category || onlyFav || sort !== 'default');

  const reset = useCallback(() => {
    setQuery('');
    setCategory('');
    setSort('default');
    setOnlyFav(false);
    searchRef.current?.focus();
  }, []);

  const addAllVisible = useCallback(() => {
    for (const i of visible) {
      addToStack({ type: meta.type, ref: toRef(i.p), name: i.n, category: i.c });
    }
    openStack();
  }, [visible, addToStack, openStack, meta.type]);

  // Gõ "/" ở bất kỳ đâu là nhảy vào ô tìm — trừ khi đang gõ trong một ô khác.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      const tag = el?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (el as HTMLElement | null)?.isContentEditable) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div>
      {/* ── Thanh công cụ ────────────────────────────────────────────────── */}
      {/* Dính dưới navbar cố định chứ không phải `top-0`: top-0 sẽ trượt vào
          NẰM DƯỚI navbar và biến mất khi cuộn. */}
      <div className="sticky top-16 z-20 -mx-1 mb-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-glass)] px-3 py-3 backdrop-blur-md sm:top-[72px]">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Tìm trong ${items.length.toLocaleString('vi-VN')} ${meta.label}…`}
              aria-label="Tìm component"
              className="h-9 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] pl-9 pr-8 text-[13px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-color)]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Xoá từ khoá"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setCatOpen((v) => !v)}
              aria-expanded={catOpen}
              className="flex h-9 items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 text-[13px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-color)]"
            >
              <SlidersHorizontal size={14} />
              <span className="max-w-[150px] truncate">
                {category ? categoryLabel(category) : 'Mọi danh mục'}
              </span>
            </button>
            {catOpen && (
              <>
                {/* Lớp phủ bắt click ra ngoài. Dùng div thay vì nghe document:
                    nghe document sẽ bắt luôn cú click MỞ menu và đóng ngay lại. */}
                <div className="fixed inset-0 z-30" onClick={() => setCatOpen(false)} />
                <div className="absolute left-0 top-full z-40 mt-1.5 max-h-[60vh] w-[280px] overflow-y-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1.5 shadow-xl">
                  <button
                    type="button"
                    onClick={() => { setCategory(''); setCatOpen(false); }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors hover:bg-[var(--bg-surface-hover)] ${!category ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)]'}`}
                  >
                    <span>Mọi danh mục</span>
                    <span className="font-mono text-[11px] opacity-60">{items.length}</span>
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => { setCategory(c.slug); setCatOpen(false); }}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors hover:bg-[var(--bg-surface-hover)] ${category === c.slug ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)]'}`}
                    >
                      <span className="min-w-0 truncate">{c.label}</span>
                      <span className="shrink-0 font-mono text-[11px] opacity-60">{c.count}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sắp xếp"
            className="h-9 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 text-[13px] text-[var(--text-secondary)] outline-none transition-colors focus:border-[var(--accent-color)]"
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setOnlyFav((v) => !v)}
            aria-pressed={onlyFav}
            title="Chỉ hiện mục đã đánh dấu sao"
            className={`flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-[13px] transition-colors ${
              onlyFav
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-500'
                : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--accent-color)]'
            }`}
          >
            <Star size={14} className={onlyFav ? 'fill-amber-400' : ''} />
            <span className="hidden sm:inline">Yêu thích</span>
          </button>

          <div className="flex h-9 items-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-0.5">
            {(['grid', 'list'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                aria-label={v === 'grid' ? 'Xem dạng lưới' : 'Xem dạng danh sách'}
                className={`flex h-full w-8 items-center justify-center rounded-md transition-colors ${
                  view === v
                    ? 'bg-[var(--bg-surface-active)] text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {v === 'grid' ? <LayoutGrid size={14} /> : <List size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Dòng tóm tắt kết quả ─────────────────────────────────────────── */}
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="text-[13px] text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">
            {filtered.length.toLocaleString('vi-VN')}
          </span>{' '}
          component
          {hasFilter && (
            <span className="text-[var(--text-muted)]">
              {' '}/ {items.length.toLocaleString('vi-VN')}
            </span>
          )}
        </p>

        {hasFilter && (
          <button
            type="button"
            onClick={reset}
            className="text-[12.5px] text-[var(--accent-color)] underline-offset-2 hover:underline"
          >
            Xoá bộ lọc
          </button>
        )}

        {visible.length > 0 && (
          <button
            type="button"
            onClick={addAllVisible}
            className="ml-auto rounded-lg border border-dashed border-[var(--border-color)] px-2.5 py-1 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]"
          >
            + Thêm {visible.length} mục đang hiện vào Stack
          </button>
        )}
      </div>

      {/* ── Lưới thẻ ─────────────────────────────────────────────────────── */}
      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-color)] px-6 py-14 text-center">
          <p className="font-heading text-[15px] font-semibold text-[var(--text-primary)]">
            Không có kết quả nào khớp
          </p>
          <p className="mx-auto mt-1.5 max-w-md text-[13px] text-[var(--text-muted)]">
            {onlyFav
              ? 'Bạn chưa đánh dấu sao mục nào trong loại này. Bấm ngôi sao trên thẻ để lưu lại.'
              : 'Thử từ khoá ngắn hơn, hoặc bỏ bớt bộ lọc danh mục.'}
          </p>
          {hasFilter && (
            <button
              type="button"
              onClick={reset}
              className="mt-4 rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-color)]"
            >
              Xoá bộ lọc
            </button>
          )}
        </div>
      ) : (
        <ul
          className={
            view === 'grid'
              ? 'grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3'
              : 'flex flex-col gap-2'
          }
        >
          {visible.map((i) => (
            // `min-w-0`: ô lưới mặc định không co nhỏ hơn nội dung, nên một
            // tên component dài liền mạch sẽ đẩy cả cột rộng ra ngoài màn hình.
            <li key={`${i.c}/${i.n}`} className="min-w-0">
              <ComponentCard item={i} meta={meta} view={view} />
            </li>
          ))}
        </ul>
      )}

      {shown < filtered.length && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]"
          >
            Xem thêm {Math.min(PAGE, filtered.length - shown)} mục
            <span className="ml-1.5 text-[var(--text-muted)]">
              (còn {(filtered.length - shown).toLocaleString('vi-VN')})
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
