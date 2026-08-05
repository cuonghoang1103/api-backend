'use client';

/**
 * Bảng lệnh ⌘K — tìm xuyên cả 1.877 component, mọi loại, từ bất kỳ trang nào
 * trong kho.
 *
 * Chỉ mục được tải LƯỜI: `fetch` chạy lần đầu người dùng mở bảng, rồi giữ lại
 * trong ref cho cả phiên. Ai không bấm ⌘K thì không tốn byte nào (xem chú thích
 * ở `api/ai-templates/search/route.ts`).
 *
 * Điều hướng bàn phím là bắt buộc chứ không phải trang trí: bảng lệnh mà phải
 * với tay ra chuột thì thà dùng ô tìm kiếm thường.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CornerDownLeft, Loader2 } from 'lucide-react';
import { getTypeBySlug, detailHref, prettyName } from '@/lib/ai-templates/catalog';
import { categoryLabel } from '@/lib/ai-templates/labels';
import type { TypeSlug } from '@/lib/ai-templates/types';
import TypeIcon from './TypeIcon';

interface Entry { n: string; p: string; c: string; t: TypeSlug }

const MAX_RESULTS = 30;

function fold(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
}

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  // Chặn gọi fetch chồng nhau khi người dùng bật/tắt bảng liên tục.
  const loadingRef = useRef(false);

  const load = useCallback(async () => {
    if (entries || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch('/api/ai-templates/search');
      if (res.ok) setEntries((await res.json()) as Entry[]);
    } catch {
      // Mất mạng thì bảng hiện trạng thái rỗng — không dựng lỗi lên màn hình.
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [entries]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    void load();
    setActive(0);
    // Đợi một khung hình để phần tử đã nằm trong DOM rồi mới focus.
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open, load]);

  /**
   * Dựng sẵn chuỗi tìm cho cả 1.877 mục ngay khi tải xong, một lần duy nhất.
   * Có nhãn tiếng Việt của danh mục trong đó nên gõ "bao mat" ra đúng nhóm
   * bảo mật; dữ liệu gốc chỉ có slug tiếng Anh.
   */
  const index = useMemo(
    () => (entries ?? []).map((e) => ({ e, hay: fold(`${e.n} ${e.c} ${categoryLabel(e.c)} ${e.t}`) })),
    [entries],
  );

  const results = useMemo(() => {
    if (index.length === 0) return [];
    const q = fold(query.trim());
    if (!q) return index.slice(0, MAX_RESULTS).map((r) => r.e);
    const terms = q.split(/\s+/);
    const out: Entry[] = [];
    for (const r of index) {
      if (terms.every((t) => r.hay.includes(t))) {
        out.push(r.e);
        if (out.length >= MAX_RESULTS) break;
      }
    }
    return out;
  }, [index, query]);

  useEffect(() => setActive(0), [query]);

  const go = useCallback(
    (e: Entry) => {
      const meta = getTypeBySlug(e.t);
      if (!meta) return;
      setOpen(false);
      setQuery('');
      router.push(detailHref(meta.slug, e.p, e.c));
    },
    [router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  // Giữ mục đang chọn luôn nằm trong tầm nhìn khi di chuyển bằng mũi tên.
  useEffect(() => {
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  return (
    // z-[120]: trên cả bảng Stack (110) và trợ lý AI nổi của site (100) —
    // ⌘K mở được từ mọi nơi nên nó phải là lớp trên cùng.
    <div className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[12vh]">
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden />
      <div
        role="dialog"
        aria-label="Tìm nhanh component"
        className="relative flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl"
      >
        <div className="flex items-center gap-2.5 border-b border-[var(--border-color)] px-4 py-3">
          {loading ? (
            <Loader2 size={16} className="animate-spin text-[var(--text-muted)]" />
          ) : (
            <Search size={16} className="text-[var(--text-muted)]" />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Tìm skill, agent, command, MCP…"
            className="flex-1 bg-transparent text-[14px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          />
          <kbd className="rounded border border-[var(--border-color)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
            Esc
          </kbd>
        </div>

        {results.length === 0 ? (
          <p className="px-4 py-10 text-center text-[13px] text-[var(--text-muted)]">
            {loading ? 'Đang tải danh mục…' : 'Không tìm thấy component nào khớp.'}
          </p>
        ) : (
          <ul ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-1.5">
            {results.map((e, i) => {
              const meta = getTypeBySlug(e.t);
              if (!meta) return null;
              return (
                <li key={`${e.t}:${e.p}`}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(e)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                      i === active ? 'bg-[var(--bg-surface-active)]' : ''
                    }`}
                  >
                    <span
                      aria-hidden
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                      style={{ background: `${meta.color}18`, color: meta.color }}
                    >
                      <TypeIcon name={meta.icon} size={12} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium text-[var(--text-primary)]">
                        {prettyName(e.n)}
                      </span>
                      <span className="block truncate text-[11.5px] text-[var(--text-muted)]">
                        {meta.label} · {categoryLabel(e.c)}
                      </span>
                    </span>
                    {i === active && (
                      <CornerDownLeft size={13} className="shrink-0 text-[var(--text-muted)]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex items-center gap-3 border-t border-[var(--border-color)] px-4 py-2 text-[11px] text-[var(--text-muted)]">
          <span>↑↓ di chuyển</span>
          <span>↵ mở</span>
          <span className="ml-auto">{results.length} kết quả</span>
        </div>
      </div>
    </div>
  );
}
