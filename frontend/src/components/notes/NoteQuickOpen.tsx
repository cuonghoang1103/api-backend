'use client';

/**
 * Mở nhanh bằng Cmd/Ctrl+K — tìm và nhảy tới bất kỳ ghi chú nào.
 *
 * ─── Vì sao cần, khi sidebar đã có cây ghi chú ───
 * Cây trả lời "ghi chú này nằm ở đâu"; hộp này trả lời "ghi chú tôi nhớ mang
 * máng tên nằm ở đâu". Khi số ghi chú vượt vài chục, việc mở lần lượt từng
 * môn để tìm một trang tốn nhiều thao tác hơn hẳn gõ ba chữ.
 *
 * ─── Ba điều quyết định nó có dùng được hay không ───
 *  1. Trễ một nhịp trước khi gọi mạng. Gọi theo từng phím là một lượt cho mỗi
 *     ký tự, và kết quả của lượt trước thường về SAU lượt sau.
 *  2. Bỏ kết quả CŨ khi đã có truy vấn mới. Không bỏ thì kết quả của "ab" có
 *     thể về sau kết quả của "abcd" và ghi đè lên nó — người dùng thấy danh
 *     sách nhảy về thứ họ đã gõ xong từ lâu.
 *  3. Nhớ trang vừa mở. Mở hộp mà chưa gõ gì thì thứ hữu ích nhất là những
 *     trang vừa rời khỏi, không phải một danh sách rỗng.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { CornerDownLeft, FileText, Loader2, Search } from 'lucide-react';
import { notesApi } from '@/lib/api';
import type { NoteSearchResult } from '@/types';

const DEBOUNCE_MS = 180;
const RECENT_KEY = 'notes:quickopen:recent';
const MAX_RECENT = 8;

interface RecentEntry { id: number; title: string }

function loadRecent(): RecentEntry[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e): e is RecentEntry =>
        Boolean(e) && typeof e === 'object'
        && typeof (e as RecentEntry).id === 'number'
        && typeof (e as RecentEntry).title === 'string')
      .slice(0, MAX_RECENT);
  } catch {
    // localStorage hỏng hoặc JSON rác — mất danh sách gần đây là chuyện nhỏ,
    // ném lỗi ở đây sẽ chặn cả hộp tìm kiếm.
    return [];
  }
}

export function rememberOpenedNote(id: number, title: string): void {
  try {
    const next = [{ id, title }, ...loadRecent().filter((e) => e.id !== id)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch { /* không nhớ được thì thôi */ }
}

export default function NoteQuickOpen({ onOpen }: { onOpen: (noteId: number) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NoteSearchResult[] | null>(null);
  const [recent, setRecent] = useState<RecentEntry[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  /** Số thứ tự lượt tìm — dùng để bỏ kết quả của lượt cũ. */
  const runRef = useRef(0);

  // Cmd/Ctrl+K mở, Esc đóng. Bắt ở pha CAPTURE vì trình soạn thảo TipTap cũng
  // nghe phím trên DOM của nó và sẽ nuốt mất tổ hợp này.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((v) => !v);
      } else if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, []);

  useEffect(() => {
    if (!open) { setQuery(''); setResults(null); setActive(0); return; }
    setRecent(loadRecent());
    // Chờ một nhịp rồi mới focus: hộp vừa được gắn vào DOM, focus ngay thì
    // trình duyệt chưa có gì để focus vào.
    const timer = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    const text = query.trim();
    if (text === '') { setResults(null); setLoading(false); return; }
    const run = ++runRef.current;
    setLoading(true);
    const timer = setTimeout(() => {
      notesApi.search({ q: text })
        .then((res) => {
          // Lượt cũ về muộn thì BỎ. Xem lý do 2 ở đầu tệp.
          if (run !== runRef.current) return;
          setResults(res.data.data);
          setActive(0);
        })
        .catch(() => { if (run === runRef.current) setResults([]); })
        .finally(() => { if (run === runRef.current) setLoading(false); });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const items: { id: number; title: string; snippet?: string }[] =
    results !== null ? results : recent.map((r) => ({ id: r.id, title: r.title }));

  const choose = useCallback((noteId: number, title: string) => {
    rememberOpenedNote(noteId, title);
    setOpen(false);
    onOpen(noteId);
  }, [onOpen]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-black/40 pt-[12vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Mở nhanh ghi chú"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/[0.1] dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-slate-100 px-3 dark:border-white/[0.06]">
          <Search size={15} className="shrink-0 text-slate-400" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, items.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
              if (e.key === 'Enter') {
                e.preventDefault();
                const item = items[active];
                if (item) choose(item.id, item.title);
              }
            }}
            placeholder="Tìm ghi chú…"
            aria-label="Từ khoá"
            className="min-h-11 flex-1 bg-transparent text-sm text-slate-900 focus-visible:outline-none dark:text-slate-100"
          />
          {loading && <Loader2 size={14} className="animate-spin text-slate-400" aria-hidden />}
        </div>

        <ul className="max-h-80 overflow-y-auto py-1">
          {items.length === 0 ? (
            <li className="px-3 py-6 text-center text-[13px] text-slate-500">
              {/* Ba trạng thái rỗng khác nhau, ba câu khác nhau: chưa gõ gì,
                  gõ rồi mà không thấy, và chưa từng mở gì. Dùng chung một câu
                  sẽ khiến người dùng tưởng tìm kiếm hỏng. */}
              {results !== null ? 'Không tìm thấy ghi chú nào.' : 'Gõ để tìm, hoặc mở lại trang gần đây.'}
            </li>
          ) : (
            items.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(item.id, item.title)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left ${
                    index === active ? 'bg-teal-50 dark:bg-teal-500/10' : ''
                  }`}
                >
                  <FileText size={14} className="shrink-0 text-slate-400" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-slate-800 dark:text-slate-100">{item.title || 'Không có tiêu đề'}</span>
                    {item.snippet && (
                      <span className="block truncate text-[11px] text-slate-500">{item.snippet}</span>
                    )}
                  </span>
                  {index === active && <CornerDownLeft size={12} className="shrink-0 text-slate-400" aria-hidden />}
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="flex items-center gap-3 border-t border-slate-100 px-3 py-1.5 text-[10.5px] text-slate-400 dark:border-white/[0.06]">
          <span>↑↓ chọn</span><span>↵ mở</span><span>Esc đóng</span>
          <span className="ml-auto">{results === null && recent.length > 0 ? 'Gần đây' : ''}</span>
        </div>
      </div>
    </div>
  );
}
