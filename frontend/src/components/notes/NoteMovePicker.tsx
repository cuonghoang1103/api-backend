'use client';

/**
 * "Di chuyển tới…" — chọn môn / chương đích cho một trang.
 *
 * Dùng cho menu ⋯ của trang trong cây và nút "Sắp xếp" của Hộp thư. Hộp thoại
 * giữa màn hình chứ không phải menu con: danh sách môn + chương có thể dài,
 * cần ô lọc, và phải dùng được trên điện thoại.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Search, X } from 'lucide-react';
import type { NoteSubjectTree } from '@/types';
import { foldIncludes, Highlight, isInboxSubject, subjectName } from './notesText';

interface Target { subjectId: number; chapterId: number | null; label: string; sub?: string; emoji: string; depth: 0 | 1 }

export default function NoteMovePicker({
  tree, noteTitle, current, onPick, onClose,
}: {
  tree: NoteSubjectTree[];
  noteTitle: string;
  current: { subjectId: number; chapterId: number | null } | null;
  onPick: (subjectId: number, chapterId: number | null) => void | Promise<void>;
  onClose: () => void;
}) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const hostRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    hostRef.current = (document.querySelector('.notes-theme-root') as HTMLElement | null) ?? document.body;
    setMounted(true);
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, []);

  const targets = useMemo(() => {
    const all: Target[] = [];
    // Hộp thư xếp CUỐI: di chuyển là để đưa ra khỏi hộp thư.
    const ordered = [...tree].sort((a, b) => Number(isInboxSubject(a)) - Number(isInboxSubject(b)));
    for (const s of ordered) {
      const emoji = isInboxSubject(s) ? '📥' : s.emoji || '📚';
      all.push({ subjectId: s.id, chapterId: null, label: subjectName(s), sub: 'Gốc của môn', emoji, depth: 0 });
      for (const c of s.chapters) all.push({ subjectId: s.id, chapterId: c.id, label: c.title, sub: subjectName(s), emoji: '📂', depth: 1 });
    }
    if (!q.trim()) return all;
    return all.filter((t) => foldIncludes(t.label, q) || (t.depth === 1 && foldIncludes(t.sub ?? '', q)));
  }, [tree, q]);

  useEffect(() => { setActive(0); }, [q]);

  if (!mounted || !hostRef.current) return null;

  const pick = (t: Target | undefined) => { if (t) void onPick(t.subjectId, t.chapterId); };

  return createPortal(
    <div className="fixed inset-0 z-[96] flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-[2px]" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Di chuyển trang"
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-xl border border-black/[0.08] bg-[var(--notes-surface,#fff)] text-[var(--notes-text,#1e293b)] shadow-2xl dark:border-white/[0.1] dark:bg-[#12171f]"
      >
        <div className="flex items-center gap-2 border-b border-black/[0.06] px-3 dark:border-white/[0.06]">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, targets.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
              if (e.key === 'Enter') { e.preventDefault(); pick(targets[active]); }
              if (e.key === 'Escape') { e.preventDefault(); onClose(); }
            }}
            placeholder={`Chuyển “${noteTitle || 'Không có tiêu đề'}” tới…`}
            className="min-h-[46px] min-w-0 flex-1 bg-transparent text-[14px] placeholder:text-slate-400 focus:outline-none"
          />
          <button type="button" onClick={onClose} aria-label="Đóng" className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-black/[0.05] dark:hover:bg-white/[0.06]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-1">
          {targets.length === 0 && <li className="px-3 py-6 text-center text-[13px] text-slate-500">Không có môn/chương nào khớp.</li>}
          {targets.map((t, i) => {
            const isCur = current && current.subjectId === t.subjectId && current.chapterId === t.chapterId;
            return (
              <li key={`${t.subjectId}:${t.chapterId ?? 0}`}>
                <button
                  type="button"
                  disabled={Boolean(isCur)}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(t)}
                  className={`flex min-h-[36px] w-full items-center gap-2 rounded-md px-2 text-left text-[13px] disabled:opacity-50 ${
                    i === active ? 'bg-black/[0.05] dark:bg-white/[0.07]' : ''
                  }`}
                  style={{ paddingLeft: 8 + t.depth * 18 }}
                >
                  <span className="shrink-0 text-[13px] leading-none">{t.emoji}</span>
                  <span className={`min-w-0 flex-1 truncate ${t.depth === 0 ? 'font-semibold' : ''}`}>
                    <Highlight text={t.label} q={q} />
                  </span>
                  {isCur ? (
                    <span className="flex shrink-0 items-center gap-1 text-[11px] text-slate-500"><Check className="h-3 w-3" /> Đang ở đây</span>
                  ) : t.depth === 0 ? (
                    <span className="shrink-0 text-[11px] text-slate-400">gốc môn</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    hostRef.current,
  );
}
