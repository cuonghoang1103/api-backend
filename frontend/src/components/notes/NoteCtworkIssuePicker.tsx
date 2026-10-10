'use client';

/**
 * Bộ chọn thẻ CT Work cho chip nội tuyến trong Ghi chú.
 *
 * Tìm trên MỌI không gian người dùng có quyền xem (backend dùng lại globalSearch
 * của CT Work — cùng luật quyền với trang /work/search). Chọn một thẻ ⇒ gọi
 * `onPick` để NoteEditor chèn chip; chip chỉ giữ THAM CHIẾU (id + bản nhớ), không
 * sao chép nội dung thẻ.
 */

import { useEffect, useRef, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { notesApi, type CtworkIssuePick } from '@/lib/api';

export default function NoteCtworkIssuePicker({ onPick, onClose }: {
  onPick: (issue: CtworkIssuePick) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<CtworkIssuePick[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // Tìm có trễ (debounce) + huỷ lượt cũ.
  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await notesApi.ctworkIssues(q.trim(), ctrl.signal);
        setItems(res.data.data);
        setActive(0);
      } catch {
        if (!ctrl.signal.aborted) setItems([]);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 220);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [q]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (items[active]) onPick(items[active]); }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/30 p-4 pt-[12vh]" onMouseDown={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5 dark:border-white/10">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Tìm thẻ CT Work (mã, tiêu đề)…"
            className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-slate-400"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
          <button type="button" aria-label="Đóng" onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto py-1">
          {items.length === 0 && !loading && (
            <li className="px-4 py-6 text-center text-[13px] text-slate-400">
              {q.trim() ? 'Không tìm thấy thẻ nào.' : 'Gõ để tìm thẻ trong các dự án CT Work của bạn.'}
            </li>
          )}
          {items.map((it, i) => (
            <li key={it.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => onPick(it)}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] ${i === active ? 'bg-slate-100 dark:bg-white/10' : ''}`}
              >
                <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: it.statusColor || '#64748b' }} aria-hidden />
                <span className="shrink-0 font-medium tabular-nums text-slate-500 dark:text-slate-400">{it.key}</span>
                <span className="min-w-0 flex-1 truncate">{it.title}</span>
                <span className="shrink-0 truncate text-[11px] text-slate-400" title={`${it.workspace.name} · ${it.project.name}`}>
                  {it.project.key}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
