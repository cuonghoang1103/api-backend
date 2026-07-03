'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2, GripVertical, Eye, EyeOff, X } from 'lucide-react';
import { toast } from 'sonner';
import { videoCategoriesApi } from '@/lib/api';

interface VideoCategory {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  _count?: { posts: number };
}

interface EditorState {
  id: number | null;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

const EMPTY: EditorState = { id: null, name: '', sortOrder: 0, isActive: true };

export default function AdminVideoCategoriesPage() {
  const [items, setItems] = useState<VideoCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await videoCategoriesApi.listAll();
      setItems((res.data as any).data ?? []);
    } catch {
      toast.error('Không tải được danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editor || saving) return;
    if (!editor.name.trim()) { toast.error('Cần tên danh mục'); return; }
    setSaving(true);
    try {
      if (editor.id == null) {
        await videoCategoriesApi.create({ name: editor.name.trim(), sortOrder: editor.sortOrder, isActive: editor.isActive });
        toast.success('Đã tạo danh mục');
      } else {
        await videoCategoriesApi.update(editor.id, { name: editor.name.trim(), sortOrder: editor.sortOrder, isActive: editor.isActive });
        toast.success('Đã cập nhật');
      }
      setEditor(null);
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: VideoCategory) => {
    if (!window.confirm(`Xóa danh mục "${c.name}"? Video thuộc danh mục này sẽ trở về "chưa phân loại".`)) return;
    try {
      await videoCategoriesApi.remove(c.id);
      toast.success('Đã xóa');
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Xóa thất bại');
    }
  };

  const toggleActive = async (c: VideoCategory) => {
    try {
      await videoCategoriesApi.update(c.id, { isActive: !c.isActive });
      setItems((prev) => prev.map((x) => (x.id === c.id ? { ...x, isActive: !x.isActive } : x)));
    } catch {
      toast.error('Không đổi được trạng thái');
    }
  };

  const inpCls = 'w-full rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-neon-violet/50 focus:outline-none';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Danh mục Video</h1>
          <p className="text-text-secondary mt-1 text-sm">Phân loại video ở trang chủ (IT, Game, Music, Vlog…)</p>
        </div>
        <button
          onClick={() => setEditor({ ...EMPTY, sortOrder: items.length })}
          className="flex items-center gap-2 rounded-lg bg-neon-violet/20 border border-neon-violet/40 px-4 py-2 text-sm font-medium text-violet-200 hover:bg-neon-violet/30 transition-colors"
        >
          <Plus className="w-4 h-4" /> Thêm danh mục
        </button>
      </div>

      <div className="rounded-2xl border border-darkborder bg-darkcard overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-neon-violet" /></div>
        ) : items.length === 0 ? (
          <p className="py-16 text-center text-text-muted">Chưa có danh mục nào. Bấm “Thêm danh mục”.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-darkborder text-xs uppercase text-text-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Tên</th>
                <th className="px-4 py-3 text-left font-medium">Slug</th>
                <th className="px-4 py-3 text-center font-medium">Thứ tự</th>
                <th className="px-4 py-3 text-center font-medium">Video</th>
                <th className="px-4 py-3 text-center font-medium">Hiển thị</th>
                <th className="px-4 py-3 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkborder">
              {items.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 text-text-primary font-medium">
                      <GripVertical className="w-4 h-4 text-text-muted" />
                      {c.name}
                    </span>
                  </td>
                  <td className="px-4 py-3"><code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-teal-300">{c.slug}</code></td>
                  <td className="px-4 py-3 text-center text-text-secondary">{c.sortOrder}</td>
                  <td className="px-4 py-3 text-center text-text-secondary">{c._count?.posts ?? 0}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleActive(c)} title={c.isActive ? 'Đang hiển thị' : 'Đang ẩn'}>
                      {c.isActive
                        ? <Eye className="w-4 h-4 text-emerald-400 mx-auto" />
                        : <EyeOff className="w-4 h-4 text-text-muted mx-auto" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditor({ id: c.id, name: c.name, sortOrder: c.sortOrder, isActive: c.isActive })} className="rounded-lg p-2 text-text-muted hover:bg-white/5 hover:text-neon-violet" title="Sửa">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => remove(c)} className="rounded-lg p-2 text-text-muted hover:bg-red-500/10 hover:text-red-400" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Editor modal */}
      {editor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setEditor(null)}>
          <div className="w-full max-w-md rounded-2xl border border-darkborder bg-darkcard p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading font-bold text-text-primary">{editor.id == null ? 'Thêm danh mục' : 'Sửa danh mục'}</h2>
              <button onClick={() => setEditor(null)} className="rounded-lg p-1.5 text-text-muted hover:bg-white/5"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <label className="block text-xs text-text-secondary">
                Tên danh mục *
                <input value={editor.name} onChange={(e) => setEditor({ ...editor, name: e.target.value })} placeholder="Vd: Game" className={`mt-1 ${inpCls}`} autoFocus />
              </label>
              <label className="block text-xs text-text-secondary">
                Thứ tự hiển thị
                <input type="number" value={editor.sortOrder} onChange={(e) => setEditor({ ...editor, sortOrder: Number(e.target.value) || 0 })} className={`mt-1 ${inpCls}`} />
              </label>
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input type="checkbox" checked={editor.isActive} onChange={(e) => setEditor({ ...editor, isActive: e.target.checked })} className="accent-neon-violet" />
                Hiển thị trên feed
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditor(null)} disabled={saving} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-text-secondary hover:bg-white/5">Hủy</button>
              <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-lg bg-neon-violet px-4 py-2 text-sm font-medium text-white hover:bg-neon-violet/90 disabled:opacity-60">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
