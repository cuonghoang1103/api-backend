'use client';

// ReadingTab — reading articles. Type switch: IMAGE_LIST (multi-image
// upload with DnD thumbnail reorder) | TEXT (TipTap content). Optional
// translation editor for both.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Loader2, Upload, Trash2, FileText, Images, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { languageAdminApi } from '@/lib/language-api';
import type { ReadingArticle, ReadingType, ReadingQuestion } from '@/types/language';
import { getImageUrl } from '@/lib/utils';
import NoteContentEditor from '@/components/exp-hub/NoteContentEditor';
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
  title: string;
  type: ReadingType;
  images: string[];
  content: string;
  translation: string;
  questions: ReadingQuestion[];
}

const EMPTY: Editor = { id: null, title: '', type: 'IMAGE_LIST', images: [], content: '', translation: '', questions: [] };

export default function ReadingTab({ languageId, code }: TabProps) {
  const [items, setItems] = useState<ReadingArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const imgRef = useRef<HTMLInputElement | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(unwrap(await languageAdminApi.content(code, 'reading')) as ReadingArticle[]);
    } catch (e) {
      toast.error(errMsg(e, 'Không tải được bài đọc'));
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
    setSaving(true);
    const body = {
      title: editor.title.trim(),
      type: editor.type,
      images: editor.type === 'IMAGE_LIST' ? editor.images : undefined,
      content: editor.type === 'TEXT' ? editor.content || undefined : undefined,
      translation: editor.translation || undefined,
      questions: sanitizeQuestions(editor.questions),
    };
    try {
      if (editor.id == null) {
        await languageAdminApi.createReading(languageId, { ...body, order: items.length });
        toast.success('Đã tạo');
      } else {
        await languageAdminApi.updateReading(editor.id, body);
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

  const remove = async (r: ReadingArticle) => {
    if (!window.confirm(`Xóa "${r.title}"?`)) return;
    try {
      await languageAdminApi.deleteReading(r.id);
      toast.success('Đã xóa');
      await load();
    } catch (e) {
      toast.error(errMsg(e, 'Xóa thất bại'));
    }
  };

  const reorder = async (ordered: ReadingArticle[]) => {
    setItems(ordered);
    try {
      await languageAdminApi.reorder('reading', ordered.map((r, i) => ({ id: r.id, order: i })));
    } catch (e) {
      toast.error(errMsg(e, 'Không lưu được thứ tự'));
      await load();
    }
  };

  const addImages = async (files: FileList) => {
    if (!editor) return;
    setUploadingImg(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) {
        const { url } = unwrap(await languageAdminApi.uploadImage(f));
        urls.push(url);
      }
      setEditor((prev) => (prev ? { ...prev, images: [...prev.images, ...urls] } : prev));
    } catch (e) {
      toast.error(errMsg(e, 'Upload ảnh thất bại'));
    } finally {
      setUploadingImg(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Bài đọc</h3>
        <button onClick={() => setEditor({ ...EMPTY })} className={btnAdd}><Plus className="h-4 w-4" /> Bài đọc</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-neon-violet" /></div>
      ) : items.length === 0 ? (
        <p className="text-sm text-text-muted">Chưa có bài đọc nào.</p>
      ) : (
        <SortableList
          items={items}
          getId={(r) => r.id}
          onReorder={reorder}
          renderItem={(r) => (
            <div className="flex items-center gap-3">
              {r.type === 'IMAGE_LIST' ? <Images className="h-4 w-4 text-sky-400" /> : <FileText className="h-4 w-4 text-amber-400" />}
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-text-primary">{r.title}</div>
                <div className="text-[11px] text-text-muted">{r.type === 'IMAGE_LIST' ? `${r.images?.length ?? 0} ảnh` : 'Văn bản'}</div>
              </div>
              <button onClick={() => setEditor({ id: r.id, title: r.title, type: r.type, images: r.images ?? [], content: r.content ?? '', translation: r.translation ?? '', questions: r.questions ?? [] })} className="rounded p-1.5 text-text-muted hover:bg-white/5 hover:text-neon-violet"><Pencil className="h-3.5 w-3.5" /></button>
              <RowActions onDelete={() => remove(r)} />
            </div>
          )}
        />
      )}

      <Modal
        open={editor != null}
        onClose={() => !saving && setEditor(null)}
        title={editor?.id == null ? 'Thêm bài đọc' : 'Sửa bài đọc'}
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
            <label className={labelCls}>Tiêu đề *<input value={editor.title} onChange={(e) => setEditor({ ...editor, title: e.target.value })} className={`mt-1 ${inputCls}`} autoFocus /></label>

            <div className="inline-flex rounded-lg border border-darkborder p-0.5">
              {(['IMAGE_LIST', 'TEXT'] as ReadingType[]).map((t) => (
                <button key={t} type="button" onClick={() => setEditor({ ...editor, type: t })} className={`rounded-md px-3 py-1.5 text-xs font-medium ${editor.type === t ? 'bg-neon-violet/20 text-violet-200' : 'text-text-secondary'}`}>
                  {t === 'IMAGE_LIST' ? 'Danh sách ảnh' : 'Văn bản'}
                </button>
              ))}
            </div>

            {editor.type === 'IMAGE_LIST' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={labelCls}>Ảnh (kéo để sắp xếp)</span>
                  <button type="button" onClick={() => imgRef.current?.click()} disabled={uploadingImg} className={btnGhost}>
                    {uploadingImg ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Thêm ảnh
                  </button>
                </div>
                {editor.images.length === 0 ? (
                  <p className="text-xs text-text-muted">Chưa có ảnh.</p>
                ) : (
                  <SortableList
                    items={editor.images.map((url, i) => ({ id: i, url }))}
                    getId={(x) => x.id}
                    onReorder={(ordered) => setEditor({ ...editor, images: ordered.map((x) => x.url) })}
                    renderItem={(x) => (
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={getImageUrl(x.url)} alt="" className="h-14 w-14 rounded-lg border border-darkborder object-cover" />
                        <span className="min-w-0 flex-1 truncate text-xs text-text-muted">{x.url}</span>
                        <button type="button" onClick={() => setEditor({ ...editor, images: editor.images.filter((_, j) => j !== x.id) })} className="rounded p-1.5 text-text-muted hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    )}
                  />
                )}
                <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files?.length) void addImages(e.target.files); e.target.value = ''; }} />
              </div>
            ) : (
              <div>
                <span className={labelCls}>Nội dung</span>
                <div className="mt-1"><NoteContentEditor value={editor.content} onChange={(html) => setEditor((prev) => (prev ? { ...prev, content: html } : prev))} minHeight={220} /></div>
              </div>
            )}

            <div>
              <span className={labelCls}>Bản dịch (tùy chọn)</span>
              <div className="mt-1"><NoteContentEditor value={editor.translation} onChange={(html) => setEditor((prev) => (prev ? { ...prev, translation: html } : prev))} minHeight={160} /></div>
            </div>

            <div>
              <span className={labelCls}>Câu hỏi (tùy chọn)</span>
              <p className="mb-2 text-[11px] text-text-muted">Người học sẽ trả lời sau khi đọc. Trắc nghiệm được tự chấm; Tự luận hiện đáp án mẫu để tự đối chiếu.</p>
              <QuestionsBuilder value={editor.questions} onChange={(questions) => setEditor((prev) => (prev ? { ...prev, questions } : prev))} />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

// ── Comprehension-question builder ─────────────────────────────────────
function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `q_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function newQuestion(kind: 'mc' | 'open'): ReadingQuestion {
  return kind === 'mc'
    ? { id: newId(), kind: 'mc', prompt: '', options: ['', ''], correctIndex: 0, explanation: '' }
    : { id: newId(), kind: 'open', prompt: '', sampleAnswer: '', explanation: '' };
}

// Drop empty questions/options + clamp correctIndex before sending to the API.
function sanitizeQuestions(qs: ReadingQuestion[]): ReadingQuestion[] {
  const out: ReadingQuestion[] = [];
  for (const q of qs) {
    const prompt = q.prompt.trim();
    if (!prompt) continue;
    if (q.kind === 'mc') {
      const options = q.options.map((o) => o.trim()).filter(Boolean);
      if (options.length < 2) continue;
      const correctIndex = Math.min(Math.max(0, q.correctIndex), options.length - 1);
      out.push({ id: q.id, kind: 'mc', prompt, options, correctIndex, explanation: q.explanation?.trim() || undefined });
    } else {
      out.push({ id: q.id, kind: 'open', prompt, sampleAnswer: q.sampleAnswer.trim(), explanation: q.explanation?.trim() || undefined });
    }
  }
  return out;
}

function QuestionsBuilder({ value, onChange }: { value: ReadingQuestion[]; onChange: (q: ReadingQuestion[]) => void }) {
  const patchAt = (i: number, patch: Partial<ReadingQuestion>) =>
    onChange(value.map((q, j) => (j === i ? ({ ...q, ...patch } as ReadingQuestion) : q)));

  const setKind = (i: number, kind: 'mc' | 'open') =>
    onChange(
      value.map((q, j) => {
        if (j !== i || q.kind === kind) return q;
        return kind === 'mc'
          ? { id: q.id, kind: 'mc', prompt: q.prompt, options: ['', ''], correctIndex: 0, explanation: q.explanation }
          : { id: q.id, kind: 'open', prompt: q.prompt, sampleAnswer: '', explanation: q.explanation };
      }),
    );

  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {value.map((q, i) => (
        <div key={q.id} className="rounded-lg border border-darkborder bg-white/[0.02] p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary">Câu {i + 1}</span>
            <div className="inline-flex rounded-md border border-darkborder p-0.5">
              {(['mc', 'open'] as const).map((k) => (
                <button key={k} type="button" onClick={() => setKind(i, k)} className={`rounded px-2 py-1 text-[11px] font-medium ${q.kind === k ? 'bg-neon-violet/20 text-violet-200' : 'text-text-secondary'}`}>
                  {k === 'mc' ? 'Trắc nghiệm' : 'Tự luận'}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 text-text-muted hover:bg-white/5 disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} className="rounded p-1 text-text-muted hover:bg-white/5 disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
              <button type="button" onClick={() => remove(i)} className="rounded p-1 text-text-muted hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>

          <input value={q.prompt} onChange={(e) => patchAt(i, { prompt: e.target.value })} placeholder="Nội dung câu hỏi" className={inputCls} />

          {q.kind === 'mc' ? (
            <div className="space-y-1.5">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${q.id}`}
                    checked={q.correctIndex === oi}
                    onChange={() => patchAt(i, { correctIndex: oi })}
                    title="Đáp án đúng"
                    className="h-4 w-4 accent-emerald-500"
                  />
                  <input
                    value={opt}
                    onChange={(e) => patchAt(i, { options: q.options.map((o, k) => (k === oi ? e.target.value : o)) })}
                    placeholder={`Đáp án ${oi + 1}`}
                    className={`flex-1 ${inputCls}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (q.options.length <= 2) return;
                      const options = q.options.filter((_, k) => k !== oi);
                      const correctIndex = q.correctIndex >= options.length ? options.length - 1 : q.correctIndex > oi ? q.correctIndex - 1 : q.correctIndex;
                      patchAt(i, { options, correctIndex });
                    }}
                    disabled={q.options.length <= 2}
                    className="rounded p-1.5 text-text-muted hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => patchAt(i, { options: [...q.options, ''] })} className={btnGhost}><Plus className="h-3.5 w-3.5" /> Thêm đáp án</button>
              <p className="text-[11px] text-text-muted">Chọn nút tròn ở đáp án đúng.</p>
            </div>
          ) : (
            <textarea value={q.sampleAnswer} onChange={(e) => patchAt(i, { sampleAnswer: e.target.value })} placeholder="Đáp án mẫu (hiện cho người học tự đối chiếu)" rows={3} className={inputCls} />
          )}

          <input value={q.explanation ?? ''} onChange={(e) => patchAt(i, { explanation: e.target.value })} placeholder="Giải thích (tùy chọn)" className={inputCls} />
        </div>
      ))}

      <div className="flex gap-2">
        <button type="button" onClick={() => onChange([...value, newQuestion('mc')])} className={btnAdd}><Plus className="h-4 w-4" /> Trắc nghiệm</button>
        <button type="button" onClick={() => onChange([...value, newQuestion('open')])} className={btnAdd}><Plus className="h-4 w-4" /> Tự luận</button>
      </div>
    </div>
  );
}
