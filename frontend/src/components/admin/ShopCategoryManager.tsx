'use client';

import { useEffect, useState } from 'react';
import { Tag, Plus, Pencil, Trash2, Check, X, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import {
  adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory,
  type AdminCategoryResponse,
} from '@/lib/api/shop';

/**
 * Admin panel to freely add / rename / delete shop categories
 * (tool, sách, tài liệu, sản phẩm thật, …). Products are assigned a category
 * from the product form; deleting a category detaches its products
 * (they become "Chưa phân loại"), it never deletes products.
 */
export default function ShopCategoryManager({ onChange }: { onChange?: () => void }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<AdminCategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try { setCategories(await adminGetCategories()); }
    catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const notify = () => { onChange?.(); };

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    try {
      await adminCreateCategory({ name, description: newDesc.trim() || undefined });
      setNewName('');
      setNewDesc('');
      await load();
      notify();
      toast.success('Đã thêm danh mục');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thêm được danh mục');
    } finally {
      setCreating(false);
    }
  };

  const handleRename = async (id: number) => {
    const name = editName.trim();
    if (!name) return;
    setBusyId(id);
    try {
      await adminUpdateCategory(id, { name, description: editDesc.trim() });
      setEditingId(null);
      await load();
      notify();
      toast.success('Đã cập nhật danh mục');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không đổi được tên');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (cat: AdminCategoryResponse) => {
    const msg = cat.productCount > 0
      ? `Xoá danh mục "${cat.name}"? ${cat.productCount} sản phẩm sẽ chuyển sang "Chưa phân loại".`
      : `Xoá danh mục "${cat.name}"?`;
    if (!window.confirm(msg)) return;
    setBusyId(cat.id);
    try {
      await adminDeleteCategory(cat.id);
      await load();
      notify();
      toast.success('Đã xoá danh mục');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không xoá được danh mục');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-darkbg/40 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Tag className="w-4 h-4 text-neon-violet" />
          Danh mục sản phẩm
          <span className="text-xs font-normal text-text-muted">({categories.length})</span>
        </span>
        {open ? <ChevronDown className="w-4 h-4 text-text-muted" /> : <ChevronRight className="w-4 h-4 text-text-muted" />}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-darkborder">
          {/* Add */}
          <div className="mt-4 mb-4 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Tên danh mục mới (VD: Cursor AI, Tài khoản, Sách)…"
                className="flex-1 px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
              />
              <button
                onClick={handleCreate}
                disabled={creating || !newName.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Thêm
              </button>
            </div>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={2}
              placeholder="Mô tả danh mục (tùy chọn) — hiện khi khách chọn danh mục này ở Shop…"
              className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 resize-none"
            />
          </div>

          {/* List */}
          {loading ? (
            <div className="flex items-center justify-center py-6 text-text-muted">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-sm text-text-muted py-4 text-center">Chưa có danh mục nào. Thêm danh mục đầu tiên ở trên.</p>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-darkbg border border-darkborder rounded-xl px-3 py-2">
                  {editingId === cat.id ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Escape') setEditingId(null); }}
                          autoFocus
                          className="flex-1 px-3 py-1.5 bg-darkcard border border-neon-violet/40 rounded-lg text-sm text-text-primary focus:outline-none"
                        />
                        <button onClick={() => handleRename(cat.id)} disabled={busyId === cat.id} className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-lg">
                          {busyId === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 text-text-muted hover:bg-darkborder/50 rounded-lg">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        rows={2}
                        placeholder="Mô tả danh mục…"
                        className="w-full px-3 py-1.5 bg-darkcard border border-darkborder rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none resize-none"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex-1 text-sm text-text-primary font-medium">{cat.name}</span>
                        <span className="text-xs text-text-muted px-2 py-0.5 bg-darkcard rounded-lg">{cat.productCount} SP</span>
                        <button
                          onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditDesc(cat.description || ''); }}
                          className="p-1.5 text-text-muted hover:text-neon-violet hover:bg-neon-violet/10 rounded-lg"
                          title="Sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          disabled={busyId === cat.id}
                          className="p-1.5 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg"
                          title="Xoá"
                        >
                          {busyId === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                      {cat.description && <p className="text-xs text-text-muted mt-1 line-clamp-2">{cat.description}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
