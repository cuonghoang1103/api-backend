'use client';

/**
 * Bảng lệnh ⌘K / Ctrl+K của Sổ tay — thay cho HAI hộp cũ (`NoteQuickOpen` và
 * `NotesSearch`) từng cùng bắt ⌘K và mở CHỒNG lên nhau.
 *
 * ─── Cách nó trả kết quả nhanh ───
 *  1. Ngay lúc gõ: khớp TÊN trong cây đã có sẵn ở máy (bỏ dấu) — không chờ mạng.
 *  2. Sau ~150ms: hỏi máy chủ `GET /notes/search/palette` — thêm các trang khớp
 *     NỘI DUNG kèm đoạn trích. Lượt cũ bị HUỶ (AbortController) và kết quả về
 *     muộn của truy vấn cũ bị BỎ, để "ab" không ghi đè lên "abcd".
 *
 * Mỗi trang có đường dẫn Môn › Chương, đoạn trích tô đậm chữ khớp.
 * ↑↓ chọn · Enter mở · Esc đóng. Chưa gõ gì thì hiện Gần đây + Lệnh.
 *
 * Tìm có lọc theo môn/thẻ (hộp `NotesSearch` cũ) vẫn giữ, mở từ nhóm Lệnh.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CornerDownLeft, Loader2, Search, SlidersHorizontal, Zap, Network, FilePlus2, Clock } from 'lucide-react';
import { notesApi, type NotePaletteResult } from '@/lib/api';
import type { NoteRecent, NoteSubjectTree } from '@/types';
import { foldIncludes, foldVi, Highlight, isInboxSubject, relTime, subjectCrumb, subjectName } from './notesText';

const DEBOUNCE_MS = 150;
const RECENT_KEY = 'notes:quickopen:recent'; // dùng lại khoá của NoteQuickOpen cũ
const MAX_RECENT = 8;

export function rememberOpenedNote(id: number, title: string): void {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const cur: unknown = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(cur) ? cur.filter((e) => e && typeof e.id === 'number' && e.id !== id) : [];
    localStorage.setItem(RECENT_KEY, JSON.stringify([{ id, title }, ...list].slice(0, MAX_RECENT)));
  } catch { /* không nhớ được thì thôi */ }
}
function loadOpened(): { id: number; title: string }[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const cur: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(cur) ? cur.filter((e) => e && typeof e.id === 'number').slice(0, MAX_RECENT) : [];
  } catch { return []; }
}

type Item =
  | { type: 'note'; key: string; id: number; title: string; crumb: string; snippet?: string; matchIn?: 'title' | 'content'; time?: string }
  | { type: 'subject'; key: string; id: number; name: string; emoji: string; count: number }
  | { type: 'chapter'; key: string; id: number; subjectId: number; title: string; crumb: string }
  | { type: 'command'; key: string; label: string; icon: ReactNode; hint?: string; run: () => void };

interface Group { label: string; items: Item[] }

export default function NotesCommandPalette({
  open, onClose, tree, recent, onOpenNote, onOpenSubject, onRevealChapter, onQuickCapture, onNewPage, onAdvancedSearch,
}: {
  open: boolean;
  onClose: () => void;
  tree: NoteSubjectTree[];
  recent: NoteRecent[];
  onOpenNote: (id: number) => void;
  onOpenSubject: (id: number) => void;
  onRevealChapter: (subjectId: number, chapterId: number) => void;
  onQuickCapture?: () => void;
  onNewPage?: () => void;
  onAdvancedSearch?: () => void;
}) {
  const [q, setQ] = useState('');
  const [server, setServer] = useState<{ q: string; data: NotePaletteResult } | null>(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState<{ id: number; title: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) { setQ(''); setServer(null); setActive(0); abortRef.current?.abort(); return; }
    setOpened(loadOpened());
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  // Máy chủ: debounce + huỷ lượt cũ.
  useEffect(() => {
    if (!open) return;
    const text = q.trim();
    abortRef.current?.abort();
    if (!text) { setLoading(false); return; }
    setLoading(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const timer = setTimeout(() => {
      notesApi.searchPalette(text, ctrl.signal)
        .then((res) => { if (!ctrl.signal.aborted) setServer({ q: text, data: res.data.data }); })
        .catch(() => { /* huỷ hoặc lỗi mạng — giữ kết quả cục bộ */ })
        .finally(() => { if (!ctrl.signal.aborted) setLoading(false); });
    }, DEBOUNCE_MS);
    return () => { clearTimeout(timer); ctrl.abort(); };
  }, [q, open]);

  // Bản đồ vị trí để dựng đường dẫn.
  const where = useMemo(() => {
    const m = new Map<number, { crumb: string; title: string }>();
    tree.forEach((s) => {
      const sn = subjectCrumb(s);
      s.notes.forEach((n) => m.set(n.id, { crumb: sn, title: n.title }));
      s.chapters.forEach((c) => c.notes.forEach((n) => m.set(n.id, { crumb: `${sn} › ${c.title}`, title: n.title })));
    });
    return m;
  }, [tree]);

  const commands = useMemo<Item[]>(() => {
    const out: Item[] = [];
    if (onQuickCapture) out.push({ type: 'command', key: 'cmd:capture', label: 'Ghi nhanh', icon: <Zap className="h-4 w-4 text-amber-500" />, hint: 'vào Hộp thư', run: onQuickCapture });
    if (onNewPage) out.push({ type: 'command', key: 'cmd:new', label: 'Trang mới…', icon: <FilePlus2 className="h-4 w-4 text-teal-600" />, run: onNewPage });
    if (onAdvancedSearch) out.push({ type: 'command', key: 'cmd:adv', label: 'Tìm nâng cao', icon: <SlidersHorizontal className="h-4 w-4" />, hint: 'lọc theo môn, thẻ', run: onAdvancedSearch });
    out.push({ type: 'command', key: 'cmd:graph', label: 'Đồ thị liên kết', icon: <Network className="h-4 w-4" />, hint: '/notes/graph', run: () => { window.location.href = '/notes/graph'; } });
    return out;
  }, [onQuickCapture, onNewPage, onAdvancedSearch]);

  const groups = useMemo<Group[]>(() => {
    const text = q.trim();
    if (!text) {
      const seen = new Set<number>();
      const items: Item[] = [];
      opened.forEach((o) => {
        const w = where.get(o.id);
        if (!w || seen.has(o.id)) return; // đã xoá / không còn trong cây
        seen.add(o.id);
        items.push({ type: 'note', key: `n:${o.id}`, id: o.id, title: w.title || o.title, crumb: w.crumb });
      });
      recent.forEach((r) => {
        if (seen.has(r.id) || items.length >= MAX_RECENT) return;
        seen.add(r.id);
        items.push({ type: 'note', key: `n:${r.id}`, id: r.id, title: r.title, crumb: where.get(r.id)?.crumb ?? '', time: relTime(r.updatedAt) });
      });
      return [
        ...(items.length ? [{ label: 'Gần đây', items }] : []),
        { label: 'Lệnh', items: commands },
      ];
    }

    const cmdHits = commands.filter((c) => c.type === 'command' && foldIncludes(c.label, text));
    const fresh = server && server.q === text ? server.data : null;
    let notes: Item[]; let subjects: Item[]; let chapters: Item[];
    if (fresh) {
      notes = fresh.notes.map((n) => ({
        type: 'note' as const, key: `n:${n.id}`, id: n.id, title: n.title,
        crumb: `${n.subjectEmoji || '📚'} ${n.subjectName.replace(/^📥\s*/u, '')}${n.chapterTitle ? ` › ${n.chapterTitle}` : ''}`,
        snippet: n.snippet, matchIn: n.matchIn,
      }));
      subjects = fresh.subjects.map((s) => {
        const t = tree.find((x) => x.id === s.id);
        return { type: 'subject' as const, key: `s:${s.id}`, id: s.id, name: subjectName(s), emoji: isInboxSubject(s) ? '📥' : s.emoji || '📚', count: t ? t.notes.length + t.chapters.reduce((a, c) => a + c.notes.length, 0) : 0 };
      });
      chapters = fresh.chapters.map((c) => ({ type: 'chapter' as const, key: `c:${c.id}`, id: c.id, subjectId: c.subjectId, title: c.title, crumb: `${c.subjectEmoji || '📚'} ${c.subjectName}` }));
    } else {
      // Cục bộ, tức thì: chỉ khớp TÊN.
      const fq = foldVi(text);
      notes = []; subjects = []; chapters = [];
      for (const s of tree) {
        const sn = subjectCrumb(s);
        if (foldVi(s.name).includes(fq)) subjects.push({ type: 'subject', key: `s:${s.id}`, id: s.id, name: subjectName(s), emoji: isInboxSubject(s) ? '📥' : s.emoji || '📚', count: s.notes.length + s.chapters.reduce((a, c) => a + c.notes.length, 0) });
        s.notes.forEach((n) => { if (foldVi(n.title).includes(fq)) notes.push({ type: 'note', key: `n:${n.id}`, id: n.id, title: n.title, crumb: sn }); });
        s.chapters.forEach((c) => {
          if (foldVi(c.title).includes(fq)) chapters.push({ type: 'chapter', key: `c:${c.id}`, id: c.id, subjectId: s.id, title: c.title, crumb: sn });
          c.notes.forEach((n) => { if (foldVi(n.title).includes(fq)) notes.push({ type: 'note', key: `n:${n.id}`, id: n.id, title: n.title, crumb: `${sn} › ${c.title}` }); });
        });
      }
      notes = notes.slice(0, 20); subjects = subjects.slice(0, 6); chapters = chapters.slice(0, 8);
    }
    return [
      ...(notes.length ? [{ label: 'Trang', items: notes }] : []),
      ...(subjects.length ? [{ label: 'Môn', items: subjects }] : []),
      ...(chapters.length ? [{ label: 'Chương', items: chapters }] : []),
      ...(cmdHits.length ? [{ label: 'Lệnh', items: cmdHits }] : []),
    ];
  }, [q, server, tree, recent, opened, where, commands]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  useEffect(() => { setActive(0); }, [q, server]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const run = useCallback((it: Item | undefined) => {
    if (!it) return;
    onClose();
    if (it.type === 'note') { rememberOpenedNote(it.id, it.title); onOpenNote(it.id); }
    else if (it.type === 'subject') onOpenSubject(it.id);
    else if (it.type === 'chapter') onRevealChapter(it.subjectId, it.id);
    else it.run();
  }, [onClose, onOpenNote, onOpenSubject, onRevealChapter]);

  if (!open) return null;

  const text = q.trim();
  let idx = -1;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center bg-black/40 px-3 pt-[10vh] backdrop-blur-[2px] sm:pt-[12vh]"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tìm trong Sổ tay"
        onMouseDown={(e) => e.stopPropagation()}
        className="flex max-h-[76vh] w-full max-w-[640px] flex-col overflow-hidden rounded-xl border border-black/[0.08] bg-[var(--notes-surface,#fff)] text-[var(--notes-text,#1e293b)] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.45)] dark:border-white/[0.1] dark:bg-[#12171f]"
      >
        <div className="flex items-center gap-2.5 border-b border-black/[0.07] px-4 dark:border-white/[0.07]">
          <Search className="h-[18px] w-[18px] shrink-0 text-slate-400" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, flat.length - 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
              else if (e.key === 'Enter') { e.preventDefault(); run(flat[active]); }
              else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(); }
            }}
            placeholder="Tìm trang, môn, chương, nội dung…"
            aria-label="Từ khoá"
            role="combobox"
            aria-expanded="true"
            aria-controls="notes-palette-list"
            aria-activedescendant={flat[active] ? `np-${active}` : undefined}
            className="min-h-[52px] min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-slate-400 focus:outline-none"
          />
          {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-slate-400" aria-hidden />}
          <kbd className="hidden shrink-0 rounded border border-black/10 px-1.5 py-0.5 text-[10.5px] text-slate-500 dark:border-white/10 sm:inline">Esc</kbd>
        </div>

        <div ref={listRef} id="notes-palette-list" role="listbox" className="min-h-0 flex-1 overflow-y-auto p-1.5">
          {flat.length === 0 ? (
            <div className="px-4 py-10 text-center text-[13px] text-slate-500">
              {loading ? 'Đang tìm…' : <>Không tìm thấy gì cho “{text}”.<div className="mt-1 text-[12px] text-slate-400">Nội dung trang chỉ khớp khi gõ đủ dấu; tên trang/môn/chương thì gõ không dấu cũng được.</div></>}
            </div>
          ) : groups.map((g) => (
            <div key={g.label} className="mb-1">
              <div className="flex items-center gap-1.5 px-2.5 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
                {g.label === 'Gần đây' && <Clock className="h-3 w-3" />}{g.label}
              </div>
              {g.items.map((it) => {
                idx += 1;
                const i = idx;
                const isActive = i === active;
                return (
                  <button
                    key={it.key}
                    id={`np-${i}`}
                    data-idx={i}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onMouseMove={() => { if (active !== i) setActive(i); }}
                    onClick={() => run(it)}
                    className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left ${isActive ? 'bg-teal-500/[0.1] dark:bg-teal-400/[0.1]' : ''}`}
                  >
                    <PaletteIcon it={it} />
                    <span className="min-w-0 flex-1">
                      {it.type === 'note' && (
                        <>
                          <span className="flex min-w-0 items-baseline gap-2">
                            <span className="truncate text-[13.5px] font-medium text-slate-900 dark:text-slate-100"><Highlight text={it.title || 'Không có tiêu đề'} q={text} /></span>
                            {it.time && <span className="shrink-0 text-[11px] text-slate-400">{it.time}</span>}
                          </span>
                          {it.crumb && <span className="block truncate text-[11.5px] text-slate-500">{it.crumb}</span>}
                          {it.snippet && text && (
                            <span className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-slate-600 dark:text-slate-400"><Highlight text={it.snippet} q={text} /></span>
                          )}
                        </>
                      )}
                      {it.type === 'subject' && (
                        <span className="flex items-baseline gap-2">
                          <span className="truncate text-[13.5px] font-semibold text-slate-900 dark:text-slate-100"><Highlight text={it.name} q={text} /></span>
                          <span className="shrink-0 text-[11px] text-slate-400">{it.count} trang</span>
                        </span>
                      )}
                      {it.type === 'chapter' && (
                        <>
                          <span className="block truncate text-[13.5px] font-medium text-slate-900 dark:text-slate-100"><Highlight text={it.title} q={text} /></span>
                          <span className="block truncate text-[11.5px] text-slate-500">{it.crumb}</span>
                        </>
                      )}
                      {it.type === 'command' && (
                        <span className="flex items-baseline gap-2">
                          <span className="truncate text-[13.5px] text-slate-900 dark:text-slate-100">{it.label}</span>
                          {it.hint && <span className="shrink-0 text-[11px] text-slate-400">{it.hint}</span>}
                        </span>
                      )}
                    </span>
                    {isActive && <CornerDownLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t border-black/[0.07] px-4 py-2 text-[11px] text-slate-500 dark:border-white/[0.07]">
          <span><Kbd>↑</Kbd><Kbd>↓</Kbd> chọn</span>
          <span><Kbd>↵</Kbd> mở</span>
          <span className="hidden sm:inline"><Kbd>Esc</Kbd> đóng</span>
          <span className="ml-auto truncate">{text && !(server && server.q === text) ? 'Đang tìm trong nội dung…' : text ? 'Tên + nội dung' : 'Gõ để tìm'}</span>
        </div>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="mr-0.5 inline-flex min-w-[18px] justify-center rounded border border-black/10 px-1 text-[10px] dark:border-white/10">{children}</kbd>;
}

function PaletteIcon({ it }: { it: Item }) {
  const box = 'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[13px] leading-none';
  if (it.type === 'note') return <span className={`${box} bg-black/[0.04] dark:bg-white/[0.06]`}>📄</span>;
  if (it.type === 'subject') return <span className={`${box} bg-teal-500/10`}>{it.emoji}</span>;
  if (it.type === 'chapter') return <span className={`${box} bg-amber-500/10`}>📂</span>;
  return <span className={`${box} bg-black/[0.04] dark:bg-white/[0.06]`}>{it.icon}</span>;
}
