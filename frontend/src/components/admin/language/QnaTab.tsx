'use client';

// QnaTab — simple question/answer bank with pronunciation, meaning and
// an optional audio clip. DnD reorder.

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Loader2, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { languageAdminApi } from '@/lib/language-api';
import type { QnaItem } from '@/types/language';
import {
  Modal,
  AudioField,
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
  question: string;
  answer: string;
  pronunciation: string;
  meaningVi: string;
  audioUrl: string;
}

const EMPTY: Editor = { id: null, question: '', answer: '', pronunciation: '', meaningVi: '', audioUrl: '' };

export default function QnaTab({ languageId, code }: TabProps) {
  const [items, setItems] = useState<QnaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(unwrap(await languageAdminApi.content(code, 'qna')) as QnaItem[]);
    } catch (e) {
      toast.error(errMsg(e, 'Không tải được Q&A'));
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (!editor || saving) return;
    if (!editor.question.trim() || !editor.answer.trim()) {
      toast.error('Cần câu hỏi và câu trả lời');
      return;
    }
    setSaving(true);
    const body = {
      question: editor.question.trim(),
      answer: editor.answer.trim(),
      pronunciation: editor.pronunciation || undefined,
      meaningVi: editor.meaningVi || undefined,
      audioUrl: editor.audioUrl || undefined,
    };
    try {
      if (editor.id == null) {
        await languageAdminApi.createQna(languageId, { ...body, order: items.length });
        toast.success('Đã tạo');
      } else {
        await languageAdminApi.updateQna(editor.id, body);
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

  const remove = async (q: QnaItem) => {
    if (!window.confirm('Xóa câu hỏi này?')) return;
    try {
      await languageAdminApi.deleteQna(q.id);
      toast.success('Đã xóa');
      await load();
    } catch (e) {
      toast.error(errMsg(e, 'Xóa thất bại'));
    }
  };

  const reorder = async (ordered: QnaItem[]) => {
    setItems(ordered);
    try {
      await languageAdminApi.reorder('qna', ordered.map((q, i) => ({ id: q.id, order: i })));
    } catch (e) {
      toast.error(errMsg(e, 'Không lưu được thứ tự'));
      await load();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Câu hỏi & Trả lời</h3>
        <button onClick={() => setEditor({ ...EMPTY })} className={btnAdd}><Plus className="h-4 w-4" /> Q&A</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-neon-violet" /></div>
      ) : items.length === 0 ? (
        <p className="text-sm text-text-muted">Chưa có Q&A nào.</p>
      ) : (
        <SortableList
          items={items}
          getId={(q) => q.id}
          onReorder={reorder}
          renderItem={(q) => (
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm text-text-primary"><span className="text-text-muted">Q:</span> {q.question}</span>
                  {q.audioUrl && <Volume2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />}
                </div>
                <div className="truncate text-sm text-text-secondary"><span className="text-text-muted">A:</span> {q.answer}</div>
              </div>
              <button onClick={() => setEditor({ id: q.id, question: q.question, answer: q.answer, pronunciation: q.pronunciation ?? '', meaningVi: q.meaningVi ?? '', audioUrl: q.audioUrl ?? '' })} className="rounded p-1.5 text-text-muted hover:bg-white/5 hover:text-neon-violet"><Pencil className="h-3.5 w-3.5" /></button>
              <RowActions onDelete={() => remove(q)} />
            </div>
          )}
        />
      )}

      <Modal
        open={editor != null}
        onClose={() => !saving && setEditor(null)}
        title={editor?.id == null ? 'Thêm Q&A' : 'Sửa Q&A'}
        maxWidth="max-w-2xl"
        footer={
          <>
            <button onClick={() => setEditor(null)} disabled={saving} className={btnGhost}>Hủy</button>
            <button onClick={save} disabled={saving} className={btnPrimary}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Lưu</button>
          </>
        }
      >
        {editor && (
          <>
            <label className={labelCls}>Câu hỏi *<textarea value={editor.question} onChange={(e) => setEditor({ ...editor, question: e.target.value })} rows={2} className={`mt-1 ${inputCls}`} autoFocus /></label>
            <label className={labelCls}>Câu trả lời *<textarea value={editor.answer} onChange={(e) => setEditor({ ...editor, answer: e.target.value })} rows={2} className={`mt-1 ${inputCls}`} /></label>
            <label className={labelCls}>Phiên âm<input value={editor.pronunciation} onChange={(e) => setEditor({ ...editor, pronunciation: e.target.value })} className={`mt-1 ${inputCls}`} /></label>
            <label className={labelCls}>Nghĩa (VI)<textarea value={editor.meaningVi} onChange={(e) => setEditor({ ...editor, meaningVi: e.target.value })} rows={2} className={`mt-1 ${inputCls}`} /></label>
            <AudioField value={editor.audioUrl} onChange={(url) => setEditor({ ...editor, audioUrl: url })} label="Âm thanh" />
          </>
        )}
      </Modal>
    </div>
  );
}
