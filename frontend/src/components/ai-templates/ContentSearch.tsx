'use client';

/**
 * Tìm trong nội dung tệp nguồn — thứ trang gốc có (nút "Search ⌘F") mà bản đầu
 * của tôi thiếu.
 *
 * ─── VÌ SAO KHÔNG DÙNG Ctrl+F CỦA TRÌNH DUYỆT ───────────────────────────────
 * Vì nó không thấy phần đang gấp. SKILL.md dài hàng nghìn dòng, khối `<pre>` có
 * thanh cuộn riêng, và bảng khai báo thì thu gọn — Ctrl+F chỉ tìm được thứ đang
 * hiện trên DOM. Ô này tìm trên VĂN BẢN GỐC nên số khớp luôn đúng, rồi mới đi
 * tô và cuộn tới.
 *
 * ─── CÁCH TÔ SÁNG ───────────────────────────────────────────────────────────
 * Dùng `CSS.highlights` (CSS Custom Highlight API) chứ KHÔNG chèn thẻ `<mark>`:
 * chèn thẻ nghĩa là sửa cây DOM mà React đang quản, hai bên sẽ đánh nhau ngay
 * lần render kế tiếp và mọi highlight biến mất — hoặc tệ hơn, React ném lỗi
 * "removeChild on a node which is not a child". Highlight API tô bằng Range,
 * không đụng một nút DOM nào.
 *
 * Trình duyệt cũ không có API này (Firefox < 140) thì vẫn còn đủ dùng: số khớp
 * vẫn đếm đúng và nút ‹ › vẫn cuộn tới đúng chỗ, chỉ là không có màu nền.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';

/** Tên highlight phải khớp với `::highlight(ai-tmpl-find)` trong globals.css. */
const HL_NAME = 'ai-tmpl-find';
const HL_ACTIVE = 'ai-tmpl-find-active';

interface HighlightRegistry {
  set(name: string, value: unknown): void;
  delete(name: string): void;
}

function highlights(): HighlightRegistry | null {
  const c = (globalThis as { CSS?: { highlights?: HighlightRegistry } }).CSS;
  return c?.highlights ?? null;
}

function makeHighlight(ranges: Range[]): unknown | null {
  const H = (globalThis as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
  if (!H) return null;
  return new H(...ranges);
}

export default function ContentSearch({
  /** Văn bản gốc — dùng để ĐẾM, độc lập với những gì đang hiện trên màn hình. */
  source,
  /** Vùng DOM để tô và cuộn tới. */
  containerRef,
}: {
  source: string;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Số lần xuất hiện trong văn bản gốc — sự thật không phụ thuộc DOM. */
  const sourceHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return 0;
    let n = 0;
    let i = 0;
    const hay = source.toLowerCase();
    while ((i = hay.indexOf(q, i)) !== -1) { n++; i += q.length; }
    return n;
  }, [source, query]);

  /** Các Range tìm được TRONG DOM đang hiện — có thể ít hơn `sourceHits`. */
  const findRanges = useCallback((): Range[] => {
    const root = containerRef.current;
    const q = query.trim().toLowerCase();
    if (!root || q.length < 2) return [];

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const out: Range[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const text = node.nodeValue?.toLowerCase();
      if (!text) continue;
      let i = 0;
      while ((i = text.indexOf(q, i)) !== -1) {
        const r = document.createRange();
        r.setStart(node, i);
        r.setEnd(node, i + q.length);
        out.push(r);
        i += q.length;
      }
    }
    return out;
  }, [containerRef, query]);

  const [domCount, setDomCount] = useState(0);

  // Tô lại mỗi khi từ khoá hoặc mục đang chọn đổi.
  useEffect(() => {
    const reg = highlights();
    const ranges = findRanges();
    setDomCount(ranges.length);

    if (!reg) return;
    reg.delete(HL_NAME);
    reg.delete(HL_ACTIVE);
    if (ranges.length === 0) return;

    const idx = Math.min(active, ranges.length - 1);
    const rest = ranges.filter((_, i) => i !== idx);
    const all = makeHighlight(rest);
    const one = makeHighlight([ranges[idx]]);
    if (all && rest.length) reg.set(HL_NAME, all);
    if (one) reg.set(HL_ACTIVE, one);

    ranges[idx].startContainer.parentElement?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    });

    return () => {
      reg.delete(HL_NAME);
      reg.delete(HL_ACTIVE);
    };
  }, [findRanges, active]);

  useEffect(() => setActive(0), [query]);

  // ⌘F / Ctrl+F mở ô này thay cho hộp tìm của trình duyệt — chỉ khi con trỏ
  // đang ở trong trang chi tiết, để không cướp phím tắt ở nơi khác.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f')) return;
      if (!containerRef.current) return;
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => inputRef.current?.select());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [containerRef]);

  const step = (d: number) => {
    if (domCount === 0) return;
    setActive((i) => (i + d + domCount) % domCount);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]"
      >
        <Search size={12} />
        Tìm
        <kbd className="ml-0.5 rounded border border-[var(--border-color)] px-1 font-mono text-[10px] text-[var(--text-muted)]">
          ⌘F
        </kbd>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2 py-1">
      <Search size={12} className="shrink-0 text-[var(--text-muted)]" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') { setOpen(false); setQuery(''); }
          else if (e.key === 'Enter') { e.preventDefault(); step(e.shiftKey ? -1 : 1); }
        }}
        placeholder="Tìm trong nội dung…"
        aria-label="Tìm trong nội dung tệp nguồn"
        className="w-36 bg-transparent text-[12px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] sm:w-44"
      />

      <span className="shrink-0 whitespace-nowrap font-mono text-[11px] text-[var(--text-muted)]">
        {query.trim().length < 2
          ? ''
          : domCount === 0
            ? '0'
            : `${active + 1}/${domCount}`}
        {/* Chế độ "Đọc" chỉ vẽ phần thân, còn số đếm trên VĂN BẢN GỐC tính cả
            frontmatter — chênh nhau thì nói thẳng, đừng để người dùng tưởng
            mình đếm sai. */}
        {sourceHits > domCount && (
          <span title={`${sourceHits} lần trong toàn tệp, kể cả phần không hiện ở chế độ này`}>
            {' '}(/{sourceHits})
          </span>
        )}
      </span>

      <button
        type="button"
        onClick={() => step(-1)}
        disabled={domCount === 0}
        aria-label="Kết quả trước"
        className="rounded p-0.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] disabled:opacity-30"
      >
        <ChevronUp size={13} />
      </button>
      <button
        type="button"
        onClick={() => step(1)}
        disabled={domCount === 0}
        aria-label="Kết quả sau"
        className="rounded p-0.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] disabled:opacity-30"
      >
        <ChevronDown size={13} />
      </button>
      <button
        type="button"
        onClick={() => { setOpen(false); setQuery(''); }}
        aria-label="Đóng tìm kiếm"
        className="rounded p-0.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
      >
        <X size={13} />
      </button>
    </div>
  );
}
