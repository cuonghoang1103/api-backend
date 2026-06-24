'use client';

// NotesSearch — global full-text search across all of the user's
// note titles + content, with subject and tag filters. Results jump
// straight to the note. Opened by the toolbar button or Cmd/Ctrl+K.

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, Loader2 } from 'lucide-react';
import { notesApi } from '@/lib/api';
import type { NoteSearchResult, NoteSubjectTree } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  subjects: NoteSubjectTree[];
  onJump: (noteId: number) => void;
}

export default function NotesSearch({ open, onClose, subjects, onJump }: Props) {
  const [q, setQ] = useState('');
  const [subjectId, setSubjectId] = useState<number | undefined>(undefined);
  const [tag, setTag] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [results, setResults] = useState<NoteSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 50);
    notesApi.getTags().then((r) => setTags(r.data.data)).catch(() => {});
  }, [open]);

  // Debounced search whenever query/filters change while open.
  useEffect(() => {
    if (!open) return;
    if (debounce.current) clearTimeout(debounce.current);
    setLoading(true);
    debounce.current = setTimeout(async () => {
      try {
        const r = await notesApi.search({ q: q.trim() || undefined, subjectId, tag });
        setResults(r.data.data);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 250);
    return () => { if (debounce.current) clearTimeout(debounce.current); };
  }, [q, subjectId, tag, open]);

  // Esc to close.
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  const subjectName = (id: number) => subjects.find((s) => s.id === id);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed left-1/2 top-[8vh] z-[81] w-[92vw] max-w-2xl -translate-x-1/2 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1218] shadow-2xl"
          >
            {/* Search input */}
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-3.5 py-3">
              <Search className="h-4 w-4 shrink-0 text-slate-500" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm trong tất cả ghi chú…"
                className="min-w-0 flex-1 bg-transparent text-base text-slate-100 placeholder:text-slate-600 focus:outline-none"
              />
              {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-500" />}
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.05]" aria-label="Đóng"><X className="h-4 w-4" /></button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-1.5 border-b border-white/[0.06] px-3 py-2">
              <select value={subjectId ?? ''} onChange={(e) => setSubjectId(e.target.value ? Number(e.target.value) : undefined)} className="rounded-md bg-slate-800/60 px-2 py-1 text-[12px] text-slate-200 focus:outline-none">
                <option value="">Mọi môn học</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.emoji ? `${s.emoji} ` : ''}{s.name}</option>)}
              </select>
              {tags.length > 0 && (
                <select value={tag ?? ''} onChange={(e) => setTag(e.target.value || undefined)} className="rounded-md bg-slate-800/60 px-2 py-1 text-[12px] text-slate-200 focus:outline-none">
                  <option value="">Mọi thẻ</option>
                  {tags.map((t) => <option key={t} value={t}>#{t}</option>)}
                </select>
              )}
              {(subjectId || tag) && <button onClick={() => { setSubjectId(undefined); setTag(undefined); }} className="rounded-md px-2 py-1 text-[12px] text-slate-500 hover:text-slate-300">Xoá lọc</button>}
            </div>

            {/* Results */}
            <div className="max-h-[55vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-3 py-8 text-center text-[13px] text-slate-600">{q || subjectId || tag ? 'Không tìm thấy ghi chú phù hợp.' : 'Gõ để tìm trong toàn bộ ghi chú.'}</p>
              ) : (
                results.map((r) => {
                  const s = subjectName(r.subjectId);
                  return (
                    <button
                      key={r.id}
                      onClick={() => { onJump(r.id); onClose(); }}
                      className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-white/[0.04]"
                    >
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-teal-300/70" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-[13.5px] font-medium text-slate-100">{r.title || 'Không có tiêu đề'}</span>
                          {s && <span className="shrink-0 text-[10px] text-slate-500">{s.emoji ? `${s.emoji} ` : ''}{s.name}</span>}
                        </div>
                        {r.snippet && <p className="mt-0.5 line-clamp-2 text-[12px] text-slate-500">{r.snippet}</p>}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
