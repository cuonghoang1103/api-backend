'use client';

// ListeningTab — listening exercises. Form has a source switch
// (UPLOAD audio | YOUTUBE link with live iframe preview), transcript
// and translation textareas, and repeatable question/answer rows.

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Loader2, X, Youtube, Music } from 'lucide-react';
import { toast } from 'sonner';
import { languageAdminApi } from '@/lib/language-api';
import type { ListeningItem, ListeningQuestion, ListeningSource } from '@/types/language';
import { getYouTubeId } from '@/lib/videoEmbed';
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
  title: string;
  sourceType: ListeningSource;
  audioUrl: string;
  youtubeUrl: string;
  transcript: string;
  translation: string;
  questions: ListeningQuestion[];
}

const EMPTY: Editor = { id: null, title: '', sourceType: 'UPLOAD', audioUrl: '', youtubeUrl: '', transcript: '', translation: '', questions: [] };

export default function ListeningTab({ languageId, code }: TabProps) {
  const [items, setItems] = useState<ListeningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(unwrap(await languageAdminApi.content(code, 'listening')) as ListeningItem[]);
    } catch (e) {
      toast.error(errMsg(e, 'Không tải được bài nghe'));
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (!editor || saving) return;
    if (!editor.title.trim()) {
      toast.error('Cần tiêu đề');
      return;
    }
    if (editor.sourceType === 'YOUTUBE' && !getYouTubeId(editor.youtubeUrl)) {
      toast.error('Link YouTube không hợp lệ');
      return;
    }
    setSaving(true);
    const body = {
      title: editor.title.trim(),
      sourceType: editor.sourceType,
      audioUrl: editor.sourceType === 'UPLOAD' ? editor.audioUrl || undefined : undefined,
      youtubeUrl: editor.sourceType === 'YOUTUBE' ? editor.youtubeUrl || undefined : undefined,
      transcript: editor.transcript || undefined,
      translation: editor.translation || undefined,
      questions: editor.questions.filter((q) => q.question.trim()),
    };
    try {
      if (editor.id == null) {
        await languageAdminApi.createListening(languageId, { ...body, order: items.length });
        toast.success('Đã tạo');
      } else {
        await languageAdminApi.updateListening(editor.id, body);
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

  const remove = async (l: ListeningItem) => {
    if (!window.confirm(`Xóa "${l.title}"?`)) return;
    try {
      await languageAdminApi.deleteListening(l.id);
      toast.success('Đã xóa');
      await load();
    } catch (e) {
      toast.error(errMsg(e, 'Xóa thất bại'));
    }
  };

  const reorder = async (ordered: ListeningItem[]) => {
    setItems(ordered);
    try {
      await languageAdminApi.reorder('listening', ordered.map((l, i) => ({ id: l.id, order: i })));
    } catch (e) {
      toast.error(errMsg(e, 'Không lưu được thứ tự'));
      await load();
    }
  };

  const setQ = (idx: number, patch: Partial<ListeningQuestion>) =>
    setEditor((prev) => (prev ? { ...prev, questions: prev.questions.map((q, i) => (i === idx ? { ...q, ...patch } : q)) } : prev));

  const ytId = editor?.sourceType === 'YOUTUBE' ? getYouTubeId(editor.youtubeUrl) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Bài nghe</h3>
        <button onClick={() => setEditor({ ...EMPTY })} className={btnAdd}><Plus className="h-4 w-4" /> Bài nghe</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-neon-violet" /></div>
      ) : items.length === 0 ? (
        <p className="text-sm text-text-muted">Chưa có bài nghe nào.</p>
      ) : (
        <SortableList
          items={items}
          getId={(l) => l.id}
          onReorder={reorder}
          renderItem={(l) => (
            <div className="flex items-center gap-3">
              {l.sourceType === 'YOUTUBE' ? <Youtube className="h-4 w-4 text-red-400" /> : <Music className="h-4 w-4 text-emerald-400" />}
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-text-primary">{l.title}</div>
                <div className="text-[11px] text-text-muted">{(l.questions?.length ?? 0)} câu hỏi</div>
              </div>
              <button onClick={() => setEditor({ id: l.id, title: l.title, sourceType: l.sourceType, audioUrl: l.audioUrl ?? '', youtubeUrl: l.youtubeUrl ?? '', transcript: l.transcript ?? '', translation: l.translation ?? '', questions: (l.questions ?? []).map((q) => ({ ...q })) })} className="rounded p-1.5 text-text-muted hover:bg-white/5 hover:text-neon-violet"><Pencil className="h-3.5 w-3.5" /></button>
              <RowActions onDelete={() => remove(l)} />
            </div>
          )}
        />
      )}

      <Modal
        open={editor != null}
        onClose={() => !saving && setEditor(null)}
        title={editor?.id == null ? 'Thêm bài nghe' : 'Sửa bài nghe'}
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
            <label className={labelCls}>Tiêu đề *<input value={editor.title} onChange={(e) => setEditor({ ...editor, title: e.target.value })} className={`mt-1 ${inputCls}`} autoFocus /></label>

            <div className="inline-flex rounded-lg border border-darkborder p-0.5">
              {(['UPLOAD', 'YOUTUBE'] as ListeningSource[]).map((s) => (
                <button key={s} type="button" onClick={() => setEditor({ ...editor, sourceType: s })} className={`rounded-md px-3 py-1.5 text-xs font-medium ${editor.sourceType === s ? 'bg-neon-violet/20 text-violet-200' : 'text-text-secondary'}`}>
                  {s === 'UPLOAD' ? 'Tải audio' : 'YouTube'}
                </button>
              ))}
            </div>

            {editor.sourceType === 'UPLOAD' ? (
              <AudioField value={editor.audioUrl} onChange={(url) => setEditor({ ...editor, audioUrl: url })} label="File âm thanh" />
            ) : (
              <>
                <label className={labelCls}>Link YouTube<input value={editor.youtubeUrl} onChange={(e) => setEditor({ ...editor, youtubeUrl: e.target.value })} placeholder="https://youtu.be/..." className={`mt-1 ${inputCls}`} /></label>
                {ytId && (
                  <div className="aspect-video w-full overflow-hidden rounded-lg border border-darkborder">
                    <iframe src={`https://www.youtube.com/embed/${ytId}`} title="preview" className="h-full w-full" allowFullScreen />
                  </div>
                )}
              </>
            )}

            <label className={labelCls}>Transcript<textarea value={editor.transcript} onChange={(e) => setEditor({ ...editor, transcript: e.target.value })} rows={3} className={`mt-1 ${inputCls}`} /></label>
            <label className={labelCls}>Bản dịch<textarea value={editor.translation} onChange={(e) => setEditor({ ...editor, translation: e.target.value })} rows={3} className={`mt-1 ${inputCls}`} /></label>

            <div>
              <div className="flex items-center justify-between">
                <span className={labelCls}>Câu hỏi</span>
                <button type="button" onClick={() => setEditor({ ...editor, questions: [...editor.questions, { question: '', answer: '' }] })} className="text-xs text-neon-violet hover:underline">+ Thêm câu hỏi</button>
              </div>
              <div className="mt-1 space-y-2">
                {editor.questions.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg border border-darkborder p-2">
                    <div className="grid flex-1 gap-1.5">
                      <input value={q.question} onChange={(e) => setQ(i, { question: e.target.value })} placeholder="Câu hỏi" className={inputCls} />
                      <input value={q.answer} onChange={(e) => setQ(i, { answer: e.target.value })} placeholder="Đáp án" className={inputCls} />
                    </div>
                    <button type="button" onClick={() => setEditor({ ...editor, questions: editor.questions.filter((_, j) => j !== i) })} className="rounded p-1.5 text-text-muted hover:bg-red-500/10 hover:text-red-400"><X className="h-4 w-4" /></button>
                  </div>
                ))}
                {editor.questions.length === 0 && <p className="text-xs text-text-muted">Chưa có câu hỏi.</p>}
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
