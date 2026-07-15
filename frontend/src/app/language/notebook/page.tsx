'use client';
/**
 * My Language — Sổ tay ngôn ngữ (Language Notebook).
 * Per-user, per-language, nested folders. Left: folder tree. Right: entries in
 * the selected folder + a markdown viewer/editor. Save AI explanations here.
 */
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { motion, AnimatePresence } from 'framer-motion';
import {
  NotebookPen, Folder, FolderPlus, ChevronRight, ChevronLeft, ChevronDown, Plus, Pencil, Trash2, X, Loader2, ArrowLeft, Layers, FileText, Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { notebookApi, type NotebookFolder, type NotebookEntrySummary, type NotebookEntry, type NotebookLanguage, type NotebookTree } from '@/lib/language-api';
import { SpeakerButton } from '@/components/language/primitives';

const KIND_LABEL: Record<string, string> = {
  note: 'Ghi chú', explanation: 'Giải thích AI', vocab: 'Từ vựng', grammar: 'Ngữ pháp', pronunciation: 'Phát âm', writing: 'Bài viết',
};

export default function NotebookPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-24"><Loader2 className="mx-auto h-6 w-6 animate-spin text-neon-violet" /></div>}>
      <NotebookInner />
    </Suspense>
  );
}

function NotebookInner() {
  const initialCode = useSearchParams().get('code') ?? '';
  const [languages, setLanguages] = useState<NotebookLanguage[]>([]);
  const [code, setCode] = useState(initialCode);
  const [tree, setTree] = useState<NotebookTree | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | 'all' | 'root'>('all');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [openEntry, setOpenEntry] = useState<NotebookEntry | null>(null);
  const [editing, setEditing] = useState<{ id: number | null; title: string; body: string } | null>(null);
  const [review, setReview] = useState<{ cards: NotebookEntry[]; index: number; flipped: boolean } | null>(null);
  const [busyBulk, setBusyBulk] = useState(false);

  useEffect(() => {
    notebookApi.languages().then((r) => {
      const langs = r.data.data ?? [];
      setLanguages(langs);
      setCode((c) => c || langs[0]?.code || '');
    }).catch(() => {});
  }, []);

  const loadTree = useCallback(async (c: string) => {
    if (!c) return;
    setLoading(true);
    try {
      const r = await notebookApi.tree(c);
      setTree(r.data.data ?? null);
    } catch {
      setTree(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (code) void loadTree(code); }, [code, loadTree]);

  const childrenOf = useMemo(() => {
    const map = new Map<number | null, NotebookFolder[]>();
    (tree?.folders ?? []).forEach((f) => {
      const arr = map.get(f.parentId) ?? [];
      arr.push(f);
      map.set(f.parentId, arr);
    });
    return map;
  }, [tree]);

  const entries = useMemo(() => {
    const all = tree?.entries ?? [];
    if (selected === 'all') return all;
    if (selected === 'root') return all.filter((e) => e.folderId == null);
    return all.filter((e) => e.folderId === selected);
  }, [tree, selected]);

  const refresh = useCallback(() => loadTree(code), [code, loadTree]);

  // ── Folder actions (prompt-based for compactness) ──
  const addFolder = async (parentId: number | null) => {
    const name = window.prompt('Tên thư mục mới:')?.trim();
    if (!name) return;
    try { await notebookApi.createFolder({ code, name, parentId }); toast.success('Đã tạo thư mục'); if (parentId != null) setExpanded((s) => new Set(s).add(parentId)); refresh(); }
    catch (e) { toast.error(errMsg(e)); }
  };
  const renameFolder = async (f: NotebookFolder) => {
    const name = window.prompt('Đổi tên thư mục:', f.name)?.trim();
    if (!name || name === f.name) return;
    try { await notebookApi.renameFolder(f.id, { name }); refresh(); } catch (e) { toast.error(errMsg(e)); }
  };
  const removeFolder = async (f: NotebookFolder) => {
    if (!window.confirm(`Xoá thư mục "${f.name}" và các thư mục con? (Mục bên trong sẽ chuyển ra ngoài, không mất)`)) return;
    try { await notebookApi.deleteFolder(f.id); if (selected === f.id) setSelected('all'); refresh(); toast.success('Đã xoá thư mục'); }
    catch (e) { toast.error(errMsg(e)); }
  };

  // ── Entry actions ──
  const openViewer = async (id: number) => {
    try { const r = await notebookApi.entry(id); setOpenEntry(r.data.data ?? null); } catch (e) { toast.error(errMsg(e)); }
  };
  const saveEntry = async () => {
    if (!editing) return;
    const title = editing.title.trim();
    const body = editing.body.trim();
    if (!title || !body) { toast.info('Cần tiêu đề và nội dung'); return; }
    try {
      if (editing.id == null) await notebookApi.createEntry({ code, folderId: selected === 'all' || selected === 'root' ? null : selected, kind: 'note', title, body });
      else await notebookApi.updateEntry(editing.id, { title, body });
      setEditing(null);
      setOpenEntry(null);
      refresh();
      toast.success('Đã lưu');
    } catch (e) { toast.error(errMsg(e)); }
  };
  const removeEntry = async (id: number) => {
    if (!window.confirm('Xoá mục này?')) return;
    try { await notebookApi.deleteEntry(id); setOpenEntry(null); refresh(); toast.success('Đã xoá'); } catch (e) { toast.error(errMsg(e)); }
  };
  const moveEntry = async (id: number, folderId: number | null) => {
    try { await notebookApi.moveEntry(id, folderId); setOpenEntry(null); refresh(); } catch (e) { toast.error(errMsg(e)); }
  };

  // Fetch full bodies for a set of entries (list only has summaries).
  const fetchFull = async (list: NotebookEntrySummary[]): Promise<NotebookEntry[]> => {
    const rs = await Promise.all(list.map((e) => notebookApi.entry(e.id).then((r) => r.data.data).catch(() => null)));
    return rs.filter(Boolean) as NotebookEntry[];
  };
  const exportAll = async () => {
    if (!entries.length) { toast.info('Chưa có mục nào'); return; }
    setBusyBulk(true);
    try {
      const full = await fetchFull(entries);
      const md = `# Sổ tay ${tree?.language.name ?? code}\n\n` + full.map(entryMd).join('\n---\n\n');
      downloadMd(`so-tay-${code}`, md);
    } catch { toast.error('Không xuất được'); } finally { setBusyBulk(false); }
  };
  const startReview = async () => {
    if (!entries.length) return;
    setBusyBulk(true);
    try {
      const cards = await fetchFull(entries);
      for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
      setReview({ cards, index: 0, flipped: false });
    } catch { toast.error('Không tải được'); } finally { setBusyBulk(false); }
  };

  const flatFolders = tree?.folders ?? [];

  return (
    <div className="mx-auto max-w-6xl px-3 pb-16 pt-20 sm:px-5 sm:pt-24">
      <div className="mb-4 flex items-center gap-2 text-sm text-text-muted">
        <Link href="/language" className="inline-flex items-center gap-1 hover:text-neon-violet"><ArrowLeft size={15} /> My Language</Link>
      </div>
      <h1 className="mb-4 flex items-center gap-2.5 font-heading text-2xl font-bold text-text-primary sm:text-3xl">
        <NotebookPen className="text-neon-violet" /> Sổ tay ngôn ngữ
      </h1>

      {/* Language chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => { setCode(l.code); setSelected('all'); }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition ${l.code === code ? 'bg-neon-violet/20 text-neon-violet ring-neon-violet/40' : 'bg-[var(--bg-surface)] text-text-secondary ring-[var(--border-color)] hover:text-text-primary'}`}
          >
            <span>{l.flagEmoji}</span> {l.name}
            {l.entryCount > 0 && <span className="text-xs text-text-muted">({l.entryCount})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-neon-violet" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-[minmax(220px,280px)_1fr]">
          {/* Folder tree */}
          <aside className="card h-max p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">Thư mục</span>
              <button onClick={() => addFolder(null)} title="Tạo thư mục" className="rounded-lg p-1.5 text-text-muted hover:bg-[var(--bg-surface)] hover:text-neon-violet"><FolderPlus size={16} /></button>
            </div>
            <button onClick={() => setSelected('all')} className={`mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${selected === 'all' ? 'bg-neon-violet/15 text-neon-violet' : 'text-text-secondary hover:bg-[var(--bg-surface)]'}`}>
              <Layers size={15} /> Tất cả <span className="ml-auto text-xs text-text-muted">{tree?.entries.length ?? 0}</span>
            </button>
            <button onClick={() => setSelected('root')} className={`mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${selected === 'root' ? 'bg-neon-violet/15 text-neon-violet' : 'text-text-secondary hover:bg-[var(--bg-surface)]'}`}>
              <FileText size={15} /> Chưa phân loại
            </button>
            <div className="mt-1 space-y-0.5">
              {(childrenOf.get(null) ?? []).map((f) => (
                <FolderNode key={f.id} folder={f} depth={0} childrenOf={childrenOf} expanded={expanded} setExpanded={setExpanded} selected={selected} setSelected={setSelected} onAdd={addFolder} onRename={renameFolder} onDelete={removeFolder} entries={tree?.entries ?? []} />
              ))}
              {flatFolders.length === 0 && <p className="px-2 py-2 text-xs text-text-muted">Chưa có thư mục. Bấm ＋ để tạo.</p>}
            </div>
          </aside>

          {/* Entries */}
          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-text-primary">{entries.length} mục</h2>
              <div className="flex flex-wrap gap-2">
                {entries.length > 0 && (
                  <>
                    <button onClick={startReview} disabled={busyBulk} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-3 py-1.5 text-sm text-text-secondary ring-1 ring-[var(--border-color)] transition hover:text-neon-violet disabled:opacity-60"><Layers size={15} /> Ôn tập</button>
                    <button onClick={exportAll} disabled={busyBulk} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-3 py-1.5 text-sm text-text-secondary ring-1 ring-[var(--border-color)] transition hover:text-neon-violet disabled:opacity-60"><Download size={15} /> Xuất .md</button>
                  </>
                )}
                <button onClick={() => setEditing({ id: null, title: '', body: '' })} className="inline-flex items-center gap-1.5 rounded-full bg-neon-violet/15 px-3 py-1.5 text-sm font-medium text-neon-violet ring-1 ring-neon-violet/30 hover:bg-neon-violet/25"><Plus size={15} /> Mục mới</button>
              </div>
            </div>
            {entries.length === 0 ? (
              <div className="card flex flex-col items-center gap-2 py-16 text-center">
                <NotebookPen className="text-text-muted" size={32} />
                <p className="text-sm text-text-secondary">Chưa có mục nào.</p>
                <p className="max-w-sm text-xs text-text-muted">Lưu giải thích từ AI (nút "Lưu vào sổ tay") hoặc tạo mục thủ công.</p>
              </div>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {entries.map((e) => (
                  <li key={e.id}>
                    <button onClick={() => openViewer(e.id)} className="card flex w-full flex-col items-start gap-1 p-3 text-left transition hover:-translate-y-0.5">
                      <div className="flex w-full items-center gap-2">
                        <span className="min-w-0 flex-1 truncate font-medium text-text-primary">{e.title}</span>
                        <span className="shrink-0 rounded-full bg-[var(--bg-surface)] px-2 py-0.5 text-[10px] text-text-muted ring-1 ring-[var(--border-color)]">{KIND_LABEL[e.kind] ?? e.kind}</span>
                      </div>
                      {e.reading && <span className="text-xs text-text-muted">{e.reading}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {/* Entry viewer */}
      <AnimatePresence>
        {openEntry && !editing && (
          <EntryViewer
            entry={openEntry}
            code={code}
            folders={flatFolders}
            onClose={() => setOpenEntry(null)}
            onEdit={() => setEditing({ id: openEntry.id, title: openEntry.title, body: openEntry.body })}
            onDelete={() => removeEntry(openEntry.id)}
            onMove={(fid) => moveEntry(openEntry.id, fid)}
          />
        )}
      </AnimatePresence>

      {/* Entry editor */}
      <AnimatePresence>
        {editing && (
          <EntryEditor value={editing} onChange={setEditing} onSave={saveEntry} onClose={() => setEditing(null)} />
        )}
      </AnimatePresence>

      {/* Flashcard review */}
      <AnimatePresence>
        {review && review.cards.length > 0 && (
          <ReviewDeck review={review} setReview={setReview} code={code} onClose={() => setReview(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ReviewDeck({ review, setReview, code, onClose }: {
  review: { cards: NotebookEntry[]; index: number; flipped: boolean };
  setReview: (r: { cards: NotebookEntry[]; index: number; flipped: boolean } | null) => void;
  code: string; onClose: () => void;
}) {
  const forceLang = code === 'ja' ? 'ja-JP' : code === 'zh' ? 'zh-CN' : code === 'en' ? 'en-US' : undefined;
  const card = review.cards[review.index];
  const go = (d: number) => setReview({ ...review, index: Math.max(0, Math.min(review.cards.length - 1, review.index + d)), flipped: false });
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[220] flex flex-col bg-black/85 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between text-sm text-white/80">
          <span>Ôn tập · {review.index + 1}/{review.cards.length}</span>
          <button onClick={onClose} className="rounded-full p-1.5 text-white/70 hover:bg-white/10"><X size={18} /></button>
        </div>
        <button onClick={() => setReview({ ...review, flipped: !review.flipped })} className="card flex flex-1 flex-col items-center justify-center gap-3 overflow-auto p-6 text-center">
          {!review.flipped ? (
            <>
              <span className="text-2xl font-bold text-text-primary">{card.title}</span>
              {card.reading && <span className="text-sm text-text-muted">{card.reading}</span>}
              <SpeakerButton text={card.title} reading={card.reading} forceLang={forceLang} />
              <span className="mt-2 text-xs text-text-muted">Chạm để lật</span>
            </>
          ) : (
            <div className="note-prose lang-prose max-w-full break-words text-left text-sm leading-relaxed text-text-secondary">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{card.body}</ReactMarkdown>
            </div>
          )}
        </button>
        <div className="mt-3 flex items-center justify-between">
          <button onClick={() => go(-1)} disabled={review.index === 0} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white disabled:opacity-40"><ChevronLeft size={16} /> Trước</button>
          <button onClick={() => go(1)} disabled={review.index >= review.cards.length - 1} className="inline-flex items-center gap-1 rounded-full bg-neon-violet px-4 py-2 text-sm font-medium text-white disabled:opacity-40">Sau <ChevronRight size={16} /></button>
        </div>
      </div>
    </motion.div>
  );
}

function FolderNode({ folder, depth, childrenOf, expanded, setExpanded, selected, setSelected, onAdd, onRename, onDelete, entries }: {
  folder: NotebookFolder; depth: number; childrenOf: Map<number | null, NotebookFolder[]>;
  expanded: Set<number>; setExpanded: (s: Set<number>) => void;
  selected: number | 'all' | 'root'; setSelected: (s: number | 'all' | 'root') => void;
  onAdd: (parentId: number | null) => void; onRename: (f: NotebookFolder) => void; onDelete: (f: NotebookFolder) => void;
  entries: NotebookEntrySummary[];
}) {
  const kids = childrenOf.get(folder.id) ?? [];
  const isOpen = expanded.has(folder.id);
  const count = entries.filter((e) => e.folderId === folder.id).length;
  const toggle = () => { const n = new Set(expanded); if (n.has(folder.id)) n.delete(folder.id); else n.add(folder.id); setExpanded(n); };
  return (
    <div>
      <div className={`group flex items-center gap-1 rounded-lg pr-1 ${selected === folder.id ? 'bg-neon-violet/15' : 'hover:bg-[var(--bg-surface)]'}`} style={{ paddingLeft: depth * 12 }}>
        <button onClick={kids.length ? toggle : undefined} className="p-1 text-text-muted">
          {kids.length ? (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <span className="inline-block w-[14px]" />}
        </button>
        <button onClick={() => setSelected(folder.id)} className={`flex min-w-0 flex-1 items-center gap-1.5 py-1.5 text-left text-sm ${selected === folder.id ? 'text-neon-violet' : 'text-text-secondary'}`}>
          <Folder size={15} className="shrink-0" />
          <span className="min-w-0 truncate">{folder.icon ? `${folder.icon} ` : ''}{folder.name}</span>
          {count > 0 && <span className="text-xs text-text-muted">({count})</span>}
        </button>
        <div className="flex shrink-0 opacity-0 transition group-hover:opacity-100">
          <button onClick={() => onAdd(folder.id)} title="Thư mục con" className="rounded p-1 text-text-muted hover:text-neon-violet"><Plus size={13} /></button>
          <button onClick={() => onRename(folder)} title="Đổi tên" className="rounded p-1 text-text-muted hover:text-neon-cyan"><Pencil size={12} /></button>
          <button onClick={() => onDelete(folder)} title="Xoá" className="rounded p-1 text-text-muted hover:text-neon-pink"><Trash2 size={12} /></button>
        </div>
      </div>
      {isOpen && kids.map((k) => (
        <FolderNode key={k.id} folder={k} depth={depth + 1} childrenOf={childrenOf} expanded={expanded} setExpanded={setExpanded} selected={selected} setSelected={setSelected} onAdd={onAdd} onRename={onRename} onDelete={onDelete} entries={entries} />
      ))}
    </div>
  );
}

function EntryViewer({ entry, code, folders, onClose, onEdit, onDelete, onMove }: {
  entry: NotebookEntry; code: string; folders: NotebookFolder[]; onClose: () => void; onEdit: () => void; onDelete: () => void; onMove: (folderId: number | null) => void;
}) {
  const forceLang = code === 'ja' ? 'ja-JP' : code === 'zh' ? 'zh-CN' : code === 'en' ? 'en-US' : undefined;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="card flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl">
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-base font-semibold text-text-primary">{entry.title}</p>
            {entry.reading && <p className="truncate text-xs text-text-muted">{entry.reading}</p>}
          </div>
          <SpeakerButton text={entry.title} reading={entry.reading} forceLang={forceLang} size={16} className="h-8 w-8" />
          <button onClick={onClose} className="rounded-full p-1.5 text-text-muted hover:bg-[var(--bg-surface)]"><X size={18} /></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <div className="note-prose lang-prose max-w-full break-words text-sm leading-relaxed text-text-secondary">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{entry.body}</ReactMarkdown>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border-color)] px-4 py-3">
          <select value={entry.folderId ?? ''} onChange={(e) => onMove(e.target.value ? Number(e.target.value) : null)} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-1.5 text-xs text-text-primary outline-none">
            <option value="">📂 Chưa phân loại</option>
            {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <div className="ml-auto flex gap-2">
            <button onClick={() => downloadMd(entry.title, entryMd(entry))} title="Tải .md" className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-3 py-1.5 text-sm text-text-secondary ring-1 ring-[var(--border-color)] hover:text-neon-violet"><Download size={14} /> .md</button>
            <button onClick={onEdit} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-3 py-1.5 text-sm text-text-secondary ring-1 ring-[var(--border-color)] hover:text-neon-violet"><Pencil size={14} /> Sửa</button>
            <button onClick={onDelete} className="inline-flex items-center gap-1.5 rounded-full bg-neon-pink/10 px-3 py-1.5 text-sm text-neon-pink ring-1 ring-neon-pink/30 hover:bg-neon-pink/20"><Trash2 size={14} /> Xoá</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function EntryEditor({ value, onChange, onSave, onClose }: {
  value: { id: number | null; title: string; body: string }; onChange: (v: { id: number | null; title: string; body: string }) => void; onSave: () => void; onClose: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[210] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="card flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-3">
          <p className="font-heading font-semibold text-text-primary">{value.id == null ? 'Mục mới' : 'Sửa mục'}</p>
          <button onClick={onClose} className="rounded-full p-1.5 text-text-muted hover:bg-[var(--bg-surface)]"><X size={18} /></button>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
          <input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="Tiêu đề" className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-text-primary outline-none focus:border-neon-violet/60" />
          <textarea value={value.body} onChange={(e) => onChange({ ...value, body: e.target.value })} placeholder="Nội dung (hỗ trợ Markdown)…" rows={10} className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-text-primary outline-none focus:border-neon-violet/60" />
        </div>
        <div className="flex justify-end gap-2 border-t border-[var(--border-color)] px-4 py-3">
          <button onClick={onClose} className="rounded-full bg-[var(--bg-surface)] px-4 py-2 text-sm text-text-secondary ring-1 ring-[var(--border-color)]">Hủy</button>
          <button onClick={onSave} className="rounded-full bg-neon-violet px-4 py-2 text-sm font-medium text-white hover:opacity-90">Lưu</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function errMsg(e: unknown): string {
  return (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi, thử lại sau.';
}

function entryMd(e: { title: string; reading?: string | null; body: string }): string {
  return `# ${e.title}\n${e.reading ? `*${e.reading}*\n` : ''}\n${e.body}\n`;
}
function downloadMd(name: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(name || 'note').replace(/[\\/:*?"<>|]+/g, '_').slice(0, 80)}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
