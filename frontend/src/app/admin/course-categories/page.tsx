'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Search, Loader2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import type { CourseCategory } from '@/types';
import { courseCategoryApi } from '@/lib/api';

interface CategoryForm {
  id?: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm: CategoryForm = {
  id: undefined, name: '', slug: '', description: '', icon: '', sortOrder: 0, isActive: true,
};

const ICONS = ['code', 'smartphone', 'brain', 'cloud', 'database', 'terminal', 'globe', 'lock', 'rocket', 'star', 'zap', 'shield'];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryForm>({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await courseCategoryApi.getAdminAll();
      setCategories(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sortOrder: categories.length });
    setShowForm(true);
  };

  const openEdit = (cat: CourseCategory) => {
    setEditingId(cat.id);
    setForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      icon: cat.icon || '',
      sortOrder: cat.sortOrder || 0,
      isActive: cat.isActive ?? true,
    });
    setShowForm(true);
  };

  const handleSlugAuto = (name: string) => {
    const slug = name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setForm(p => ({ ...p, name, slug }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (!form.slug.trim()) { toast.error('Slug is required'); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        icon: form.icon,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      };
      if (editingId) {
        await courseCategoryApi.update(editingId, payload);
      } else {
        await courseCategoryApi.create(payload);
      }
      toast.success(editingId ? 'Category updated!' : 'Category created!');
      setShowForm(false);
      fetchCategories();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save category';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    try {
      await courseCategoryApi.delete(id);
      toast.success('Deleted!');
      fetchCategories();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Delete failed';
      toast.error(msg);
    }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Danh mục Khoá học</h1>
          <p className="text-text-secondary mt-1">Quản lý danh mục cho khoá học</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Thêm danh mục
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
          />
        </div>
      </div>

      <div className="bg-darkcard border border-darkborder/50 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-muted">No categories</p>
          </div>
        ) : (
          <div className="divide-y divide-darkborder/30">
            {filtered.map(cat => (
              <div key={cat.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-neon-indigo/10 flex items-center justify-center shrink-0">
                  <span className="text-neon-indigo text-sm font-mono font-bold">{cat.sortOrder || 0}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary text-sm">{cat.name}</p>
                  <p className="text-xs text-text-muted truncate">{cat.description || '—'}</p>
                </div>
                <span className="text-xs text-text-muted px-2 py-0.5 bg-darkbg rounded-md">{cat.slug}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  cat.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                }`}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cat)} className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-neon-violet transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-text-muted hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg my-8 mx-4 bg-darkcard border border-darkborder rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-darkborder">
              <h2 className="text-lg font-heading font-bold text-text-primary">
                {editingId ? 'Sửa danh mục' : 'Tạo danh mục mới'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Tên danh mục *</label>
                <input
                  value={form.name}
                  onChange={e => handleSlugAuto(e.target.value)}
                  placeholder="VD: Web Development"
                  className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Slug *</label>
                <input
                  value={form.slug}
                  onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                  placeholder="web-development"
                  className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Mô tả danh mục..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Icon (slug)</label>
                  <input
                    value={form.icon}
                    onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                    placeholder="code"
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {ICONS.map(ic => (
                      <button
                        key={ic}
                        onClick={() => setForm(p => ({ ...p, icon: ic }))}
                        className={`px-2 py-0.5 text-xs rounded-md border transition-colors ${
                          form.icon === ic
                            ? 'bg-neon-indigo/20 border-neon-indigo/30 text-neon-indigo'
                            : 'bg-darkbg border-darkborder text-text-muted hover:border-neon-indigo/30'
                        }`}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Thứ tự</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={e => setForm(p => ({ ...p, sortOrder: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50"
                  />
                  <label className="flex items-center gap-2 mt-3 text-sm text-text-primary">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))}
                      className="w-4 h-4 rounded accent-neon-violet"
                    />
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-darkborder">
              <button onClick={() => setShowForm(false)}
                className="px-5 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary hover:border-neon-violet/30 transition-colors">
                Hủy
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving...' : editingId ? 'Cập nhật' : 'Tạo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
