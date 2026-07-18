'use client';

// CategoryDocEditor — the admin's block-based editor for a technology's AI
// reference doc. Generate a first draft with AI, then add / edit / reorder /
// delete individual blocks (heading, prose HTML, code, mermaid, image with R2
// upload, resource links), preview exactly what visitors will see, and save.
//
// Self-contained: it loads the category's current doc on mount, owns the block
// array, and persists via snippetCategoriesApi. No schema knowledge — blocks are
// a JSON array on SnippetCategory.docBlocks.

import { useEffect, useRef, useState } from 'react';
import {
  Sparkles, RefreshCw, Save, Trash2, Plus, ChevronUp, ChevronDown,
  Eye, EyeOff, Upload, Loader2, X, GripVertical,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { DocBlock, DocLinkItem } from '@/types/exp-hub';
import { snippetCategoriesApi } from '@/lib/exp-hub-api';
import { fileApi } from '@/lib/api';
import { DocBlocksView } from './DocBlocksView';

type Busy = null | 'gen' | 'load' | 'save' | 'clear';

const inp = 'w-full rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none';
const mono = `${inp} font-mono text-[12px] leading-relaxed`;
const chip = 'flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50';

function defaultBlock(type: DocBlock['type']): DocBlock {
  switch (type) {
    case 'heading': return { type: 'heading', text: '' };
    case 'prose': return { type: 'prose', html: '' };
    case 'code': return { type: 'code', title: '', language: 'bash', code: '' };
    case 'mermaid': return { type: 'mermaid', code: '' };
    case 'image': return { type: 'image', url: '', caption: '' };
    case 'links': return { type: 'links', items: [{ label: '', url: '', note: '' }] };
  }
}

const BLOCK_LABELS: Record<DocBlock['type'], string> = {
  heading: 'Tiêu đề', prose: 'Đoạn văn (HTML)', code: 'Code / Lệnh',
  mermaid: 'Sơ đồ Mermaid', image: 'Ảnh', links: 'Links tài nguyên',
};

export function CategoryDocEditor({ categoryId, onSaved }: { categoryId: number; onSaved?: () => void }) {
  const [blocks, setBlocks] = useState<DocBlock[]>([]);
  const [busy, setBusy] = useState<Busy>(null);
  const [preview, setPreview] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  // Load the category's current doc whenever a different category is opened.
  useEffect(() => {
    let alive = true;
    setBusy('load'); setBlocks([]); setPreview(false);
    snippetCategoriesApi.getDoc(categoryId)
      .then((res) => { if (alive) setBlocks((res.data.data.blocks as DocBlock[]) || []); })
      .catch(() => { if (alive) setBlocks([]); })
      .finally(() => { if (alive) setBusy(null); });
    return () => { alive = false; };
  }, [categoryId]);

  const genDoc = async () => {
    if (busy) return;
    if (blocks.length && !window.confirm('AI sẽ tạo bản mới thay cho nội dung hiện tại. Tiếp tục?')) return;
    setBusy('gen');
    try {
      const res = await snippetCategoriesApi.generateDoc(categoryId);
      setBlocks((res.data.data.blocks as DocBlock[]) || []);
      toast.success(`AI đã soạn ${res.data.data.blocks.length} khối — chỉnh lại rồi Lưu`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'AI viết doc thất bại');
    } finally { setBusy(null); }
  };

  const reload = async () => {
    if (busy) return;
    setBusy('load');
    try {
      const res = await snippetCategoriesApi.getDoc(categoryId);
      setBlocks((res.data.data.blocks as DocBlock[]) || []);
      toast.success('Đã tải lại doc đã lưu');
    } catch { toast.error('Tải doc thất bại'); }
    finally { setBusy(null); }
  };

  const save = async () => {
    if (busy) return;
    const clean = blocks.filter(isNonEmpty);
    if (!clean.length) { toast.error('Chưa có khối nội dung nào'); return; }
    setBusy('save');
    try {
      const res = await snippetCategoriesApi.commitDoc({ categoryId, blocks: clean, lang: 'EN' });
      toast.success(`Đã lưu tài liệu (${res.data.data.blocks} khối)`);
      onSaved?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Lưu tài liệu thất bại');
    } finally { setBusy(null); }
  };

  const clearAll = async () => {
    if (busy) return;
    if (!window.confirm('Xoá toàn bộ tài liệu của danh mục này?')) return;
    setBusy('clear');
    try {
      await snippetCategoriesApi.clearDoc(categoryId);
      setBlocks([]);
      toast.success('Đã xoá tài liệu');
      onSaved?.();
    } catch { toast.error('Xoá thất bại'); }
    finally { setBusy(null); }
  };

  // ── block ops ──
  const patch = (i: number, next: DocBlock) => setBlocks((bs) => bs.map((b, j) => (j === i ? next : b)));
  const remove = (i: number) => setBlocks((bs) => bs.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => setBlocks((bs) => {
    const j = i + dir;
    if (j < 0 || j >= bs.length) return bs;
    const copy = bs.slice();
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
  });
  const add = (type: DocBlock['type']) => { setBlocks((bs) => [...bs, defaultBlock(type)]); setAddOpen(false); };

  return (
    <div className="mt-1 space-y-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-200">Tài liệu chi tiết (AI · tiếng Anh)</span>
        <span className="text-[11px] text-slate-500">{blocks.length} khối</span>
        <div className="ml-auto flex flex-wrap gap-2">
          <button onClick={genDoc} disabled={!!busy}
            className="flex items-center gap-1.5 rounded-lg border border-violet-500/40 bg-violet-500/15 px-2.5 py-1.5 text-xs font-medium text-violet-200 hover:bg-violet-500/25 disabled:opacity-50">
            {busy === 'gen' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />} AI viết doc
          </button>
          <button onClick={() => setPreview((p) => !p)} disabled={!!busy} className={chip}>
            {preview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />} {preview ? 'Ẩn xem trước' : 'Xem trước'}
          </button>
          <button onClick={reload} disabled={!!busy} className={chip}>
            {busy === 'load' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />} Tải lại
          </button>
          <button onClick={clearAll} disabled={!!busy} className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 px-2.5 py-1.5 text-xs text-rose-300 hover:bg-rose-500/15 disabled:opacity-50">
            <Trash2 className="h-3.5 w-3.5" /> Xoá
          </button>
        </div>
      </div>

      {preview ? (
        <div className="rounded-lg border border-white/10 bg-[var(--bg-card,#0b1020)] p-4">
          {blocks.filter(isNonEmpty).length
            ? <DocBlocksView blocks={blocks.filter(isNonEmpty)} />
            : <p className="text-sm text-slate-500">Chưa có nội dung để xem trước.</p>}
        </div>
      ) : (
        <>
          {/* Block list */}
          <div className="space-y-2">
            {blocks.map((b, i) => (
              <BlockCard
                key={i}
                block={b}
                index={i}
                total={blocks.length}
                onChange={(nb) => patch(i, nb)}
                onRemove={() => remove(i)}
                onMove={(d) => move(i, d)}
              />
            ))}
            {!blocks.length && <p className="py-3 text-center text-sm text-slate-500">Chưa có khối nào — bấm “AI viết doc” hoặc “Thêm khối”.</p>}
          </div>

          {/* Add block */}
          <div className="relative">
            <button onClick={() => setAddOpen((o) => !o)} className={chip}><Plus className="h-3.5 w-3.5" /> Thêm khối</button>
            {addOpen && (
              <div className="absolute z-10 mt-1 flex flex-col rounded-lg border border-white/10 bg-[#1b1030] p-1 shadow-xl">
                {(Object.keys(BLOCK_LABELS) as DocBlock['type'][]).map((t) => (
                  <button key={t} onClick={() => add(t)} className="rounded px-3 py-1.5 text-left text-xs text-slate-200 hover:bg-white/10">{BLOCK_LABELS[t]}</button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Save */}
      <div className="flex justify-end border-t border-white/10 pt-2">
        <button onClick={save} disabled={!!busy || !blocks.filter(isNonEmpty).length}
          className="flex items-center gap-1.5 rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-400 disabled:opacity-50">
          {busy === 'save' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Lưu tài liệu
        </button>
      </div>
    </div>
  );
}

// A block is "empty" (skipped on save) when it has no meaningful content.
function isNonEmpty(b: DocBlock): boolean {
  switch (b.type) {
    case 'heading': return !!b.text.trim();
    case 'prose': return !!b.html.trim();
    case 'code': return !!b.code.trim();
    case 'mermaid': return !!b.code.trim();
    case 'image': return !!b.url.trim();
    case 'links': return b.items.some((it) => it.url.trim());
  }
}

// ── Per-block editor card ─────────────────────────────────────────────────────
function BlockCard({
  block, index, total, onChange, onRemove, onMove,
}: {
  block: DocBlock; index: number; total: number;
  onChange: (b: DocBlock) => void; onRemove: () => void; onMove: (dir: -1 | 1) => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-2.5">
      <div className="mb-2 flex items-center gap-2">
        <GripVertical className="h-3.5 w-3.5 text-slate-600" />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-violet-300/80">{BLOCK_LABELS[block.type]}</span>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => onMove(-1)} disabled={index === 0} className="rounded p-1 text-slate-400 hover:bg-white/10 disabled:opacity-30" title="Lên"><ChevronUp className="h-3.5 w-3.5" /></button>
          <button onClick={() => onMove(1)} disabled={index === total - 1} className="rounded p-1 text-slate-400 hover:bg-white/10 disabled:opacity-30" title="Xuống"><ChevronDown className="h-3.5 w-3.5" /></button>
          <button onClick={onRemove} className="rounded p-1 text-rose-300 hover:bg-rose-500/20" title="Xoá khối"><X className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      <BlockFields block={block} onChange={onChange} />
    </div>
  );
}

function BlockFields({ block, onChange }: { block: DocBlock; onChange: (b: DocBlock) => void }) {
  if (block.type === 'heading') {
    return <input value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} placeholder="Tiêu đề mục (VD: Installation)" className={inp} />;
  }
  if (block.type === 'prose') {
    return <textarea value={block.html} onChange={(e) => onChange({ ...block, html: e.target.value })} rows={4} placeholder="<p>Đoạn văn… dùng <ul><li><strong><code><a href>…</p>" className={mono} spellCheck={false} />;
  }
  if (block.type === 'code') {
    return (
      <div className="space-y-1.5">
        <div className="flex gap-1.5">
          <input value={block.title ?? ''} onChange={(e) => onChange({ ...block, title: e.target.value })} placeholder="Tiêu đề (VD: macOS (Homebrew))" className={`${inp} flex-1`} />
          <input value={block.language} onChange={(e) => onChange({ ...block, language: e.target.value })} placeholder="ngôn ngữ (bash, ts…)" className={`${inp} w-40`} />
        </div>
        <textarea value={block.code} onChange={(e) => onChange({ ...block, code: e.target.value })} rows={5} placeholder="npm install ..." className={mono} spellCheck={false} />
      </div>
    );
  }
  if (block.type === 'mermaid') {
    return <textarea value={block.code} onChange={(e) => onChange({ ...block, code: e.target.value })} rows={5} placeholder="graph TD; A-->B;" className={mono} spellCheck={false} />;
  }
  if (block.type === 'image') {
    return <ImageFields block={block} onChange={onChange} />;
  }
  // links
  return <LinksFields block={block} onChange={onChange} />;
}

function ImageFields({ block, onChange }: { block: Extract<DocBlock, { type: 'image' }>; onChange: (b: DocBlock) => void }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const upload = async (file: File) => {
    setUploading(true);
    try {
      const res = await fileApi.upload(file, 'document');
      const url = (res as any).data?.data?.url;
      if (!url) { toast.error('Upload lỗi'); return; }
      onChange({ ...block, url });
      toast.success('Đã tải ảnh lên');
    } catch { toast.error('Upload thất bại'); }
    finally { setUploading(false); }
  };
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1.5">
        <input value={block.url} onChange={(e) => onChange({ ...block, url: e.target.value })} placeholder="URL ảnh (https://… hoặc tải lên)" className={`${inp} flex-1`} />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className={chip}>
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Tải lên
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ''; }} />
      </div>
      <input value={block.caption ?? ''} onChange={(e) => onChange({ ...block, caption: e.target.value })} placeholder="Chú thích (tuỳ chọn)" className={inp} />
      {block.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={block.url} alt="" className="max-h-40 rounded-lg border border-white/10" />
      )}
    </div>
  );
}

function LinksFields({ block, onChange }: { block: Extract<DocBlock, { type: 'links' }>; onChange: (b: DocBlock) => void }) {
  const setItem = (i: number, next: DocLinkItem) => onChange({ ...block, items: block.items.map((it, j) => (j === i ? next : it)) });
  const removeItem = (i: number) => onChange({ ...block, items: block.items.filter((_, j) => j !== i) });
  const addItem = () => onChange({ ...block, items: [...block.items, { label: '', url: '', note: '' }] });
  return (
    <div className="space-y-1.5">
      {block.items.map((it, i) => (
        <div key={i} className="flex gap-1.5">
          <input value={it.label} onChange={(e) => setItem(i, { ...it, label: e.target.value })} placeholder="Nhãn (VD: Trang chủ)" className={`${inp} w-40`} />
          <input value={it.url} onChange={(e) => setItem(i, { ...it, url: e.target.value })} placeholder="https://…" className={`${inp} flex-1`} />
          <input value={it.note ?? ''} onChange={(e) => setItem(i, { ...it, note: e.target.value })} placeholder="ghi chú" className={`${inp} w-32`} />
          <button onClick={() => removeItem(i)} className="rounded p-1 text-rose-300 hover:bg-rose-500/20"><X className="h-3.5 w-3.5" /></button>
        </div>
      ))}
      <button onClick={addItem} className={chip}><Plus className="h-3.5 w-3.5" /> Thêm link</button>
    </div>
  );
}
