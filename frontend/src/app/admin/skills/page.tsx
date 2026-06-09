'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  Code2,
  ChevronLeft,
  ChevronRight,
  X,
  Star,
} from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  slug: string;
  category: string;
  proficiency: number;
  iconUrl?: string;
  description?: string;
  isFeatured: boolean;
  orderIndex: number;
}

const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'AI/ML'];

const defaultForm = {
  name: '',
  category: categories[0],
  proficiency: 50,
  description: '',
  isFeatured: false,
  orderIndex: 0,
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [form, setForm] = useState(defaultForm as any);
  const [saving, setSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const pageSize = 12;

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        size: String(pageSize),
        ...(categoryFilter && { category: categoryFilter }),
      });
      const res = await api.get(`/skills?${params}`);
      const data = res.data?.data;
      setSkills(data?.content || []);
      setTotalPages(data?.totalPages || 0);
    } catch {
      toast.error('Lỗi tải danh sách kỹ năng');
    } finally {
      setLoading(false);
    }
  }, [page, categoryFilter]);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const openCreate = () => {
    setEditingSkill(null);
    setForm({ ...defaultForm });
    setShowForm(true);
  };

  const openEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setForm({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      description: skill.description || '',
      isFeatured: skill.isFeatured,
      orderIndex: skill.orderIndex,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingSkill(null);
    setForm(defaultForm);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Tên kỹ năng không được trống'); return; }
    setSaving(true);
    try {
      if (editingSkill) {
        await api.put(`/skills/${editingSkill.id}`, form);
        toast.success('Cập nhật kỹ năng thành công!');
      } else {
        await api.post('/skills', form);
        toast.success('Tạo kỹ năng thành công!');
      }
      closeForm();
      fetchSkills();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lỗi khi lưu kỹ năng');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa kỹ năng này?')) return;
    try {
      await api.delete(`/skills/${id}`);
      toast.success('Đã xóa kỹ năng');
      fetchSkills();
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  const proficiencyColor = (val: number) => {
    if (val >= 80) return 'from-emerald-400 to-emerald-500';
    if (val >= 60) return 'from-blue-400 to-blue-500';
    if (val >= 40) return 'from-yellow-400 to-yellow-500';
    return 'from-orange-400 to-orange-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Quản lý Kỹ năng</h1>
          <p className="text-text-secondary mt-1">Quản lý danh sách kỹ năng & công nghệ</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Thêm kỹ năng
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setCategoryFilter(''); setPage(0); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !categoryFilter ? 'bg-neon-violet text-white' : 'bg-darkcard border border-darkborder text-text-secondary hover:text-text-primary'
          }`}
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategoryFilter(cat); setPage(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              categoryFilter === cat ? 'bg-neon-violet text-white' : 'bg-darkcard border border-darkborder text-text-secondary hover:text-text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="bg-darkcard border border-darkborder rounded-2xl p-5 h-40 animate-pulse" />
          ))
        ) : skills.length === 0 ? (
          <div className="col-span-full text-center py-16 text-text-muted">
            <Code2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Chưa có kỹ năng nào</p>
          </div>
        ) : (
          skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-darkcard border border-darkborder rounded-2xl p-5 hover:border-neon-violet/20 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neon-indigo/10 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-neon-indigo" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-text-primary">{skill.name}</h3>
                    <p className="text-xs text-text-muted">{skill.category}</p>
                  </div>
                </div>
                {skill.isFeatured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
              </div>

              {/* Proficiency bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-muted">Trình độ</span>
                  <span className="text-xs font-medium text-text-secondary">{skill.proficiency}%</span>
                </div>
                <div className="h-2 bg-darkbg rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${proficiencyColor(skill.proficiency)} rounded-full transition-all`}
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(skill)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-neon-violet transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(skill.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
            className="p-2 rounded-lg hover:bg-white/5 text-text-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-text-secondary px-3">Trang {page + 1} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="p-2 rounded-lg hover:bg-white/5 text-text-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-darkbg border border-darkborder rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-text-primary">
                {editingSkill ? 'Chỉnh sửa kỹ năng' : 'Thêm kỹ năng mới'}
              </h2>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Tên kỹ năng *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: React, Node.js, PostgreSQL..."
                  className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Danh mục</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 transition-colors cursor-pointer"
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Trình độ (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.proficiency}
                    onChange={(e) => setForm({ ...form, proficiency: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Mô tả ngắn về kỹ năng..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors resize-none"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded border-darkborder bg-darkcard text-neon-violet focus:ring-neon-violet/50"
                />
                <span className="text-sm text-text-secondary">Hiển thị nổi bật ở trang chủ</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={closeForm} className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : editingSkill ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
