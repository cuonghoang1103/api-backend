'use client';

// GrammarTab — grammar points with a level filter, DnD reorder, and a
// form modal (level, title, structure, TipTap explanation, repeatable
// example rows, common-mistakes & compared-with textareas).

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Loader2, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { languageAdminApi } from '@/lib/language-api';
import type { GrammarPoint, GrammarExample } from '@/types/language';
import NoteContentEditor from '@/components/exp-hub/NoteContentEditor';
import AiGeneratePanel from './AiGeneratePanel';
import {
  Modal,
  SortableList,
  RowActions,
  inputCls,
  labelCls,
  btnAdd,
  btnPrimary,
  btnGhost,
  unwrap,
  errMsg,
} from './shared';

interface TabProps {
  languageId: number;
  code: string;
}

interface Editor {
  id: number | null;
  level: string;
  title: string;
  structure: string;
  explanation: string;
  examples: GrammarExample[];
  commonMistakes: string;
  comparedWith: string;
}

const EMPTY: Editor = { id: null, level: '', title: '', structure: '', explanation: '', examples: [], commonMistakes: '', comparedWith: '' };

export default function GrammarTab({ languageId, code }: TabProps) {
  const [items, setItems] = useState<GrammarPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [editor, setEditor] = useState<Editor | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(unwrap(await languageAdminApi.content(code, 'grammar')) as GrammarPoint[]);
    } catch (e) {
      toast.error(errMsg(e, 'Không tải được ngữ pháp'));
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    void load();
  }, [load]);

  const levels = useMemo(() => Array.from(new Set(items.map((i) => i.level).filter((l): l is string => !!l))), [items]);
  const filtered = useMemo(() => (levelFilter ? items.filter((i) => i.level === levelFilter) : items), [items, levelFilter]);

  const save = async () => {
    if (!editor || saving) return;
    if (!editor.title.trim() || !editor.structure.trim()) {
      toast.error('Cần tiêu đề và cấu trúc');
      return;
    }
    setSaving(true);
    const body = {
      level: editor.level || undefined,
      title: editor.title.trim(),
      structure: editor.structure.trim(),
      explanation: editor.explanation || undefined,
      examples: editor.examples.filter((e) => e.sentence.trim()),
      commonMistakes: editor.commonMistakes || undefined,
      comparedWith: editor.comparedWith || undefined,
    };
    try {
      if (editor.id == null) {
        await languageAdminApi.createGrammar(languageId, { ...body, order: items.length });
        toast.success('Đã tạo');
      } else {
        await languageAdminApi.updateGrammar(editor.id, body);
        toast.success('Đã cập nhật');
      }
      setEditor(null);
      await load();
    } catch (e) {
      toast.error(errMsg(e, 'Lưu thất bại'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (g: GrammarPoint) => {
    if (!window.confirm(`Xóa "${g.title}"?`)) return;
    try {
      await languageAdminApi.deleteGrammar(g.id);
      toast.success('Đã xóa');
      await load();
    } catch (e) {
      toast.error(errMsg(e, 'Xóa thất bại'));
    }
  };

  const reorder = async (ordered: GrammarPoint[]) => {
    setItems(ordered);
    try {
      await languageAdminApi.reorder('grammar', ordered.map((g, i) => ({ id: g.id, order: i })));
    } catch (e) {
      toast.error(errMsg(e, 'Không lưu được thứ tự'));
      await load();
    }
  };

  const setExample = (idx: number, patch: Partial<GrammarExample>) =>
    setEditor((prev) => (prev ? { ...prev, examples: prev.examples.map((e, i) => (i === idx ? { ...e, ...patch } : e)) } : prev));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setLevelFilter('')} className={`rounded-lg px-2.5 py-1 text-xs ${levelFilter === '' ? 'bg-neon-violet/20 text-violet-200' : 'text-text-secondary hover:bg-white/5'}`}>Tất cả</button>
          {levels.map((lv) => (
            <button key={lv} onClick={() => setLevelFilter(lv)} className={`rounded-lg px-2.5 py-1 text-xs ${levelFilter === lv ? 'bg-neon-violet/20 text-violet-200' : 'text-text-secondary hover:bg-white/5'}`}>{lv}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setAiOpen(true)} className={btnAdd}><Sparkles className="h-4 w-4" /> AI tạo</button>
          <button onClick={() => setEditor({ ...EMPTY })} className={btnAdd}><Plus className="h-4 w-4" /> Ngữ pháp</button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-neon-violet" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-text-muted">Chưa có ngữ pháp nào.</p>
      ) : (
        <SortableList
          items={filtered}
          getId={(g) => g.id}
          onReorder={reorder}
          renderItem={(g) => (
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {g.level && <span className="rounded bg-neon-violet/20 px-1.5 py-0.5 text-[10px] font-medium text-violet-200">{g.level}</span>}
                  <span className="truncate font-medium text-text-primary">{g.title}</span>
                </div>
                <code className="mt-0.5 block truncate text-xs text-teal-300">{g.structure}</code>
              </div>
              <button onClick={() => setEditor({ id: g.id, level: g.level ?? '', title: g.title, structure: g.structure, explanation: g.explanation ?? '', examples: (g.examples ?? []).map((e) => ({ ...e })), commonMistakes: g.commonMistakes ?? '', comparedWith: g.comparedWith ?? '' })} className="rounded p-1.5 text-text-muted hover:bg-white/5 hover:text-neon-violet"><Pencil className="h-3.5 w-3.5" /></button>
              <RowActions onDelete={() => remove(g)} />
            </div>
          )}
        />
      )}

      <Modal
        open={editor != null}
        onClose={() => !saving && setEditor(null)}
        title={editor?.id == null ? 'Thêm ngữ pháp' : 'Sửa ngữ pháp'}
        maxWidth="max-w-3xl"
        footer={
          <>
            <button onClick={() => setEditor(null)} disabled={saving} className={btnGhost}>Hủy</button>
            <button onClick={save} disabled={saving} className={btnPrimary}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Lưu</button>
          </>
        }
      >
        {editor && (
          <>
            <div className="grid grid-cols-[120px_1fr] gap-3">
              <label className={labelCls}>Cấp độ<input value={editor.level} onChange={(e) => setEditor({ ...editor, level: e.target.value })} placeholder="N5, A1…" className={`mt-1 ${inputCls}`} /></label>
              <label className={labelCls}>Tiêu đề *<input value={editor.title} onChange={(e) => setEditor({ ...editor, title: e.target.value })} className={`mt-1 ${inputCls}`} autoFocus /></label>
            </div>
            <label className={labelCls}>Cấu trúc *<input value={editor.structure} onChange={(e) => setEditor({ ...editor, structure: e.target.value })} placeholder="V-ます" className={`mt-1 ${inputCls}`} /></label>
            <div>
              <span className={labelCls}>Giải thích</span>
              <div className="mt-1"><NoteContentEditor value={editor.explanation} onChange={(html) => setEditor((prev) => (prev ? { ...prev, explanation: html } : prev))} minHeight={200} /></div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className={labelCls}>Ví dụ</span>
                <button type="button" onClick={() => setEditor({ ...editor, examples: [...editor.examples, { sentence: '', pronunciation: '', meaningVi: '' }] })} className="text-xs text-neon-violet hover:underline">+ Thêm ví dụ</button>
              </div>
              <div className="mt-1 space-y-2">
                {editor.examples.map((ex, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg border border-darkborder p-2">
                    <div className="grid flex-1 gap-1.5">
                      <input value={ex.sentence} onChange={(e) => setExample(i, { sentence: e.target.value })} placeholder="Câu ví dụ" className={inputCls} />
                      <input value={ex.pronunciation ?? ''} onChange={(e) => setExample(i, { pronunciation: e.target.value })} placeholder="Phiên âm" className={inputCls} />
                      <input value={ex.meaningVi ?? ''} onChange={(e) => setExample(i, { meaningVi: e.target.value })} placeholder="Nghĩa (VI)" className={inputCls} />
                    </div>
                    <button type="button" onClick={() => setEditor({ ...editor, examples: editor.examples.filter((_, j) => j !== i) })} className="rounded p-1.5 text-text-muted hover:bg-red-500/10 hover:text-red-400"><X className="h-4 w-4" /></button>
                  </div>
                ))}
                {editor.examples.length === 0 && <p className="text-xs text-text-muted">Chưa có ví dụ.</p>}
              </div>
            </div>

            <label className={labelCls}>Lỗi thường gặp<textarea value={editor.commonMistakes} onChange={(e) => setEditor({ ...editor, commonMistakes: e.target.value })} rows={2} className={`mt-1 ${inputCls}`} /></label>
            <label className={labelCls}>So sánh với<textarea value={editor.comparedWith} onChange={(e) => setEditor({ ...editor, comparedWith: e.target.value })} rows={2} className={`mt-1 ${inputCls}`} /></label>
          </>
        )}
      </Modal>

      <AiGeneratePanel open={aiOpen} onClose={() => setAiOpen(false)} section="grammar" languageCode={code} onCommitted={load} />
    </div>
  );
}
