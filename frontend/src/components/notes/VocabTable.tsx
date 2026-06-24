'use client';

// VocabTable — per-note vocabulary list (term | reading | meaning |
// example). Inline-editable (save on blur), add/delete, and
// drag-reorder via dnd-kit (reused from the sidebar). Rendered as
// compact cards so it stays usable inside the narrow note drawer and
// on mobile. Feeds the flashcard mode in Phase 3b.

import { useCallback, useEffect, useState } from 'react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, Loader2, Volume2 } from 'lucide-react';
import { notesApi } from '@/lib/api';
import type { NoteVocabEntry } from '@/types';

interface Props {
  noteId: number;
  /** Optional language hint for TTS (e.g. 'ja', 'zh', 'en'). */
  lang?: string;
}

export default function VocabTable({ noteId, lang }: Props) {
  const [rows, setRows] = useState<NoteVocabEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const load = useCallback(async () => {
    try { const r = await notesApi.listVocab(noteId); setRows(r.data.data); } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [noteId]);

  useEffect(() => { setLoading(true); load(); }, [load]);

  const addRow = async () => {
    setAdding(true);
    try { const r = await notesApi.addVocab({ noteId, term: '' }); setRows((p) => [...p, r.data.data]); }
    catch { /* ignore */ } finally { setAdding(false); }
  };

  const saveField = (id: number, field: 'term' | 'reading' | 'meaning' | 'example', value: string) => {
    setRows((p) => p.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };
  const commitField = async (id: number, field: 'term' | 'reading' | 'meaning' | 'example', value: string) => {
    try { await notesApi.updateVocab(id, { [field]: value || null }); } catch { /* ignore */ }
  };
  const removeRow = async (id: number) => {
    setRows((p) => p.filter((r) => r.id !== id));
    try { await notesApi.deleteVocab(id); } catch { load(); }
  };

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = rows.findIndex((r) => r.id === active.id);
    const newIdx = rows.findIndex((r) => r.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const next = arrayMove(rows, oldIdx, newIdx);
    setRows(next);
    try { await notesApi.reorderVocab(noteId, next.map((r) => r.id)); } catch { load(); }
  };

  const speak = (entry: NoteVocabEntry) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(entry.reading || entry.term);
    if (lang) u.lang = lang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  if (loading) return <div className="flex justify-center py-4 text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /></div>;

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          {rows.map((row) => (
            <VocabRow key={row.id} row={row} onField={saveField} onCommit={commitField} onRemove={removeRow} onSpeak={speak} ttsAvailable={typeof window !== 'undefined' && !!window.speechSynthesis} />
          ))}
        </SortableContext>
      </DndContext>

      {rows.length === 0 && <p className="px-1 text-[12px] text-slate-600">Chưa có từ vựng. Thêm từ đầu tiên ↓</p>}

      <button onClick={addRow} disabled={adding} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/[0.1] py-2.5 text-[12px] text-slate-400 hover:border-teal-500/30 hover:text-teal-300 disabled:opacity-50 min-h-[44px]">
        {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Thêm từ
      </button>
    </div>
  );
}

function VocabRow({
  row, onField, onCommit, onRemove, onSpeak, ttsAvailable,
}: {
  row: NoteVocabEntry;
  onField: (id: number, f: 'term' | 'reading' | 'meaning' | 'example', v: string) => void;
  onCommit: (id: number, f: 'term' | 'reading' | 'meaning' | 'example', v: string) => void;
  onRemove: (id: number) => void;
  onSpeak: (e: NoteVocabEntry) => void;
  ttsAvailable: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };

  const field = (f: 'term' | 'reading' | 'meaning' | 'example', placeholder: string, cls = '') => (
    <input
      value={(row[f] as string) ?? ''}
      onChange={(e) => onField(row.id, f, e.target.value)}
      onBlur={(e) => onCommit(row.id, f, e.target.value)}
      placeholder={placeholder}
      // text-base (16px) prevents iOS focus zoom.
      className={`w-full rounded bg-transparent px-1.5 py-1 text-base text-slate-100 placeholder:text-slate-600 focus:bg-slate-800/60 focus:outline-none focus:ring-1 focus:ring-teal-500/30 ${cls}`}
    />
  );

  return (
    <div ref={setNodeRef} style={style} className="group rounded-lg border border-white/[0.05] bg-white/[0.02] p-2">
      <div className="flex items-center gap-1">
        <button {...attributes} {...listeners} className="flex h-8 w-6 shrink-0 cursor-grab items-center justify-center text-slate-600 hover:text-slate-400 active:cursor-grabbing touch-none" aria-label="Kéo sắp xếp">
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">{field('term', 'Từ / 単語 / 单词', 'font-medium')}</div>
        {ttsAvailable && (
          <button onClick={() => onSpeak(row)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-slate-500 hover:text-teal-300" title="Phát âm" aria-label="Phát âm">
            <Volume2 className="h-4 w-4" />
          </button>
        )}
        <button onClick={() => onRemove(row.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-slate-600 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100" aria-label="Xoá từ">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="pl-7">
        {field('reading', 'Phiên âm (furigana / pinyin)', 'text-[13px] text-teal-200/80')}
        {field('meaning', 'Nghĩa', 'text-[13px]')}
        {field('example', 'Ví dụ', 'text-[13px] text-slate-400')}
      </div>
    </div>
  );
}
