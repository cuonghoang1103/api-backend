'use client';

// ConversationTab — Q/A conversation pairs with pronunciations,
// meaning, a voice clip (upload OR record-in-browser), image and note.
// DnD reorder.

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { languageAdminApi } from '@/lib/language-api';
import type { ConversationItem } from '@/types/language';
import {
  Modal,
  ImageField,
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
import AiGeneratePanel from './AiGeneratePanel';

interface TabProps {
  languageId: number;
  code: string;
}

interface Editor {
  id: number | null;
  question: string;
  answer: string;
  questionPronunciation: string;
  answerPronunciation: string;
  meaningVi: string;
  voiceUrl: string;
  imageUrl: string;
  note: string;
}

const EMPTY: Editor = { id: null, question: '', answer: '', questionPronunciation: '', answerPronunciation: '', meaningVi: '', voiceUrl: '', imageUrl: '', note: '' };

export default function ConversationTab({ languageId, code }: TabProps) {
  const [items, setItems] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(unwrap(await languageAdminApi.content(code, 'conversation')) as ConversationItem[]);
    } catch (e) {
      toast.error(errMsg(e, 'Không tải được hội thoại'));
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
      questionPronunciation: editor.questionPronunciation || undefined,
      answerPronunciation: editor.answerPronunciation || undefined,
      meaningVi: editor.meaningVi || undefined,
      voiceUrl: editor.voiceUrl || undefined,
      imageUrl: editor.imageUrl || undefined,
      note: editor.note || undefined,
    };
    try {
      if (editor.id == null) {
        await languageAdminApi.createConversation(languageId, { ...body, order: items.length });
        toast.success('Đã tạo');
      } else {
        await languageAdminApi.updateConversation(editor.id, body);
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

  const remove = async (c: ConversationItem) => {
    if (!window.confirm('Xóa hội thoại này?')) return;
    try {
      await languageAdminApi.deleteConversation(c.id);
      toast.success('Đã xóa');
      await load();
    } catch (e) {
      toast.error(errMsg(e, 'Xóa thất bại'));
    }
  };

  const reorder = async (ordered: ConversationItem[]) => {
    setItems(ordered);
    try {
      await languageAdminApi.reorder('conversation', ordered.map((c, i) => ({ id: c.id, order: i })));
    } catch (e) {
      toast.error(errMsg(e, 'Không lưu được thứ tự'));
      await load();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Hội thoại</h3>
        <div className="flex gap-2">
          <button onClick={() => setAiOpen(true)} className={btnAdd}><Sparkles className="h-4 w-4" /> AI tạo</button>
          <button onClick={() => setEditor({ ...EMPTY })} className={btnAdd}><Plus className="h-4 w-4" /> Hội thoại</button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-neon-violet" /></div>
      ) : items.length === 0 ? (
        <p className="text-sm text-text-muted">Chưa có hội thoại nào.</p>
      ) : (
        <SortableList
          items={items}
          getId={(c) => c.id}
          onReorder={reorder}
          renderItem={(c) => (
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-text-primary"><span className="text-text-muted">Q:</span> {c.question}</div>
                <div className="truncate text-sm text-text-secondary"><span className="text-text-muted">A:</span> {c.answer}</div>
              </div>
              <button onClick={() => setEditor({ id: c.id, question: c.question, answer: c.answer, questionPronunciation: c.questionPronunciation ?? '', answerPronunciation: c.answerPronunciation ?? '', meaningVi: c.meaningVi ?? '', voiceUrl: c.voiceUrl ?? '', imageUrl: c.imageUrl ?? '', note: c.note ?? '' })} className="rounded p-1.5 text-text-muted hover:bg-white/5 hover:text-neon-violet"><Pencil className="h-3.5 w-3.5" /></button>
              <RowActions onDelete={() => remove(c)} />
            </div>
          )}
        />
      )}

      <Modal
        open={editor != null}
        onClose={() => !saving && setEditor(null)}
        title={editor?.id == null ? 'Thêm hội thoại' : 'Sửa hội thoại'}
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
            <label className={labelCls}>Phiên âm câu hỏi<input value={editor.questionPronunciation} onChange={(e) => setEditor({ ...editor, questionPronunciation: e.target.value })} className={`mt-1 ${inputCls}`} /></label>
            <label className={labelCls}>Câu trả lời *<textarea value={editor.answer} onChange={(e) => setEditor({ ...editor, answer: e.target.value })} rows={2} className={`mt-1 ${inputCls}`} /></label>
            <label className={labelCls}>Phiên âm câu trả lời<input value={editor.answerPronunciation} onChange={(e) => setEditor({ ...editor, answerPronunciation: e.target.value })} className={`mt-1 ${inputCls}`} /></label>
            <label className={labelCls}>Nghĩa (VI)<textarea value={editor.meaningVi} onChange={(e) => setEditor({ ...editor, meaningVi: e.target.value })} rows={2} className={`mt-1 ${inputCls}`} /></label>
            <AudioField value={editor.voiceUrl} onChange={(url) => setEditor({ ...editor, voiceUrl: url })} label="Giọng đọc" allowRecord />
            <ImageField value={editor.imageUrl} onChange={(url) => setEditor({ ...editor, imageUrl: url })} label="Ảnh minh họa" />
            <label className={labelCls}>Ghi chú<textarea value={editor.note} onChange={(e) => setEditor({ ...editor, note: e.target.value })} rows={2} className={`mt-1 ${inputCls}`} /></label>
          </>
        )}
      </Modal>

      <AiGeneratePanel open={aiOpen} onClose={() => setAiOpen(false)} section="conversation" languageCode={code} onCommitted={load} />
    </div>
  );
}
