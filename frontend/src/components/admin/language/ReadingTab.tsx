'use client';

// ReadingTab — reading articles. Type switch: IMAGE_LIST (multi-image
// upload with DnD thumbnail reorder) | TEXT (TipTap content). Optional
// translation editor for both.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Loader2, Upload, Trash2, FileText, Images } from 'lucide-react';
import { toast } from 'sonner';
import { languageAdminApi } from '@/lib/language-api';
import type { ReadingArticle, ReadingType } from '@/types/language';
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
}

const EMPTY: Editor = { id: null, title: '', type: 'IMAGE_LIST', images: [], content: '', translation: '' };

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
              <button onClick={() => setEditor({ id: r.id, title: r.title, type: r.type, images: r.images ?? [], content: r.content ?? '', translation: r.translation ?? '' })} className="rounded p-1.5 text-text-muted hover:bg-white/5 hover:text-neon-violet"><Pencil className="h-3.5 w-3.5" /></button>
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
          </>
        )}
      </Modal>
    </div>
  );
}
