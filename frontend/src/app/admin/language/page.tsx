'use client';

// "My Language" admin dashboard — list of languages with per-section
// counts, active toggle, drag-reorder, create/edit modal and delete.

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { languageAdminApi } from '@/lib/language-api';
import type { LanguageOverview } from '@/types/language';
import {
  Modal,
  ImageField,
  SortableList,
  inputCls,
  labelCls,
  btnAdd,
  btnPrimary,
  btnGhost,
  unwrap,
  errMsg,
} from '@/components/admin/language/shared';

type AdminLanguage = LanguageOverview & { isActive: boolean };

interface EditorState {
  id: number | null;
  name: string;
  nameEn: string;
  code: string;
  flagEmoji: string;
  coverUrl: string;
  isActive: boolean;
}

const EMPTY: EditorState = { id: null, name: '', nameEn: '', code: '', flagEmoji: '', coverUrl: '', isActive: true };

const SECTIONS: Array<{ key: keyof LanguageOverview['counts']; label: string }> = [
  { key: 'alphabet', label: 'Chữ cái' },
  { key: 'vocab', label: 'Từ vựng' },
  { key: 'grammar', label: 'Ngữ pháp' },
  { key: 'listening', label: 'Nghe' },
  { key: 'conversation', label: 'Giao tiếp' },
  { key: 'reading', label: 'Đọc' },
  { key: 'qna', label: 'Q&A' },
];

export default function AdminLanguagePage() {
  const [items, setItems] = useState<AdminLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = unwrap(await languageAdminApi.listLanguages());
      setItems(rows as unknown as AdminLanguage[]);
    } catch (e) {
      toast.error(errMsg(e, 'Không tải được danh sách ngôn ngữ'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (!editor || saving) return;
    if (!editor.name.trim() || !editor.code.trim() || !editor.flagEmoji.trim()) {
      toast.error('Cần tên, mã và cờ');
      return;
    }
    setSaving(true);
    const body = {
      name: editor.name.trim(),
      nameEn: editor.nameEn.trim(),
      code: editor.code.trim().toLowerCase(),
      flagEmoji: editor.flagEmoji.trim(),
      coverUrl: editor.coverUrl || undefined,
      isActive: editor.isActive,
    };
    try {
      if (editor.id == null) {
        await languageAdminApi.createLanguage({ ...body, order: items.length });
        toast.success('Đã tạo ngôn ngữ');
      } else {
        await languageAdminApi.updateLanguage(editor.id, body);
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

  const remove = async (l: AdminLanguage) => {
    if (!window.confirm(`Xóa "${l.name}"? Toàn bộ nội dung (chữ cái, từ vựng, ngữ pháp…) của ngôn ngữ này sẽ bị xóa theo và KHÔNG khôi phục được.`)) return;
    try {
      await languageAdminApi.deleteLanguage(l.id);
      toast.success('Đã xóa ngôn ngữ');
      await load();
    } catch (e) {
      toast.error(errMsg(e, 'Xóa thất bại'));
    }
  };

  const toggleActive = async (l: AdminLanguage) => {
    setItems((prev) => prev.map((x) => (x.id === l.id ? { ...x, isActive: !x.isActive } : x)));
    try {
      await languageAdminApi.updateLanguage(l.id, { isActive: !l.isActive });
    } catch (e) {
      setItems((prev) => prev.map((x) => (x.id === l.id ? { ...x, isActive: l.isActive } : x)));
      toast.error(errMsg(e, 'Không đổi được trạng thái'));
    }
  };

  const persistOrder = async (ordered: AdminLanguage[]) => {
    setItems(ordered);
    try {
      await languageAdminApi.reorder(
        'language',
        ordered.map((l, i) => ({ id: l.id, order: i })),
      );
    } catch (e) {
      toast.error(errMsg(e, 'Không lưu được thứ tự'));
      await load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">Học ngôn ngữ</h1>
          <p className="mt-1 text-sm text-text-secondary">Quản lý các ngôn ngữ và toàn bộ nội dung học.</p>
        </div>
        <button onClick={() => setEditor({ ...EMPTY })} className={btnAdd}>
          <Plus className="h-4 w-4" /> Thêm ngôn ngữ
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-neon-violet" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-darkborder bg-darkcard py-16 text-center text-text-muted">
          Chưa có ngôn ngữ nào. Bấm “Thêm ngôn ngữ”.
        </div>
      ) : (
        <SortableList
          items={items}
          getId={(l) => l.id}
          onReorder={persistOrder}
          renderItem={(l) => (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="text-2xl">{l.flagEmoji}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-text-primary">{l.name}</span>
                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-teal-300">{l.code}</code>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-text-muted">
                    {SECTIONS.map((s) => (
                      <span key={s.key}>
                        {s.label}: <span className="text-text-secondary">{l.counts?.[s.key] ?? 0}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleActive(l)} className="rounded-lg p-2 hover:bg-white/5" title={l.isActive ? 'Đang hiển thị' : 'Đang ẩn'}>
                  {l.isActive ? <Eye className="h-4 w-4 text-emerald-400" /> : <EyeOff className="h-4 w-4 text-text-muted" />}
                </button>
                <Link href={`/admin/language/${l.code}`} className="rounded-lg p-2 text-text-muted hover:bg-white/5 hover:text-neon-violet" title="Quản lý nội dung">
                  <Settings2 className="h-4 w-4" />
                </Link>
                <button
                  onClick={() =>
                    setEditor({
                      id: l.id,
                      name: l.name,
                      nameEn: l.nameEn,
                      code: l.code,
                      flagEmoji: l.flagEmoji,
                      coverUrl: l.coverUrl ?? '',
                      isActive: l.isActive,
                    })
                  }
                  className="rounded-lg p-2 text-text-muted hover:bg-white/5 hover:text-neon-violet"
                  title="Sửa"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(l)} className="rounded-lg p-2 text-text-muted hover:bg-red-500/10 hover:text-red-400" title="Xóa">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        />
      )}

      <Modal
        open={editor != null}
        onClose={() => !saving && setEditor(null)}
        title={editor?.id == null ? 'Thêm ngôn ngữ' : 'Sửa ngôn ngữ'}
        footer={
          <>
            <button onClick={() => setEditor(null)} disabled={saving} className={btnGhost}>Hủy</button>
            <button onClick={save} disabled={saving} className={btnPrimary}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Lưu
            </button>
          </>
        }
      >
        {editor && (
          <>
            <label className={labelCls}>
              Tên (tiếng Việt) *
              <input value={editor.name} onChange={(e) => setEditor({ ...editor, name: e.target.value })} placeholder="Vd: Tiếng Nhật" className={`mt-1 ${inputCls}`} autoFocus />
            </label>
            <label className={labelCls}>
              Tên (tiếng Anh)
              <input value={editor.nameEn} onChange={(e) => setEditor({ ...editor, nameEn: e.target.value })} placeholder="Vd: Japanese" className={`mt-1 ${inputCls}`} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={labelCls}>
                Mã *
                <input value={editor.code} onChange={(e) => setEditor({ ...editor, code: e.target.value })} placeholder="ja" className={`mt-1 ${inputCls}`} />
              </label>
              <label className={labelCls}>
                Cờ (emoji) *
                <input value={editor.flagEmoji} onChange={(e) => setEditor({ ...editor, flagEmoji: e.target.value })} placeholder="🇯🇵" className={`mt-1 ${inputCls}`} />
              </label>
            </div>
            <ImageField value={editor.coverUrl} onChange={(url) => setEditor({ ...editor, coverUrl: url })} label="Ảnh bìa" />
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" checked={editor.isActive} onChange={(e) => setEditor({ ...editor, isActive: e.target.checked })} className="accent-neon-violet" />
              Hiển thị (đang hoạt động)
            </label>
          </>
        )}
      </Modal>
    </div>
  );
}
