'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Trash2, X, Loader2, Search,
  KeyRound, Edit2, CheckCircle, XCircle, Clock, RefreshCw,
} from 'lucide-react';
import { academyCodesApi, adminCoursesApi } from '@/lib/api';
import { toast } from 'sonner';

interface CourseCode {
  id: number;
  code: string;
  courseId: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  course?: { id: number; title: string; slug: string };
}

interface CourseOption {
  id: number;
  title: string;
  slug: string;
}

function randomCode(len = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function AdminCodeAcademyPage() {
  const [codes, setCodes] = useState<CourseCode[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    courseId: 0,
    code: '',
    maxUses: 1,
    isActive: true,
    expiresAt: '',
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [codesRes, coursesRes] = await Promise.all([
        academyCodesApi.getAll(),
        adminCoursesApi.getAll({ size: 500 }),
      ]);
      setCodes(codesRes.data?.data || []);
      const courseList: CourseOption[] = (coursesRes.data?.data || []).map((c: any) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
      }));
      setCourses(courseList);
    } catch {
      toast.error('Khong the tai du lieu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  function openCreate() {
    setEditingId(null);
    setForm({ courseId: 0, code: randomCode(6), maxUses: 1, isActive: true, expiresAt: '' });
    setShowModal(true);
  }

  function openEdit(c: CourseCode) {
    setEditingId(c.id);
    setForm({
      courseId: c.courseId,
      code: c.code,
      maxUses: c.maxUses,
      isActive: c.isActive,
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 16) : '',
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.courseId) { toast.error('Vui long chon khoa hoc'); return; }
    if (!form.code.trim()) { toast.error('Vui long nhap ma code'); return; }
    if (form.maxUses < 1) { toast.error('So lan su dung phai lon hon 0'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await academyCodesApi.update(editingId, {
          code: form.code.trim().toUpperCase(),
          maxUses: form.maxUses,
          isActive: form.isActive,
          expiresAt: form.expiresAt || undefined,
        });
        toast.success('Cap nhat ma code thanh cong');
      } else {
        await academyCodesApi.create({
          courseId: form.courseId,
          code: form.code.trim().toUpperCase(),
          maxUses: form.maxUses,
          isActive: form.isActive,
          expiresAt: form.expiresAt || undefined,
        });
        toast.success('Tao ma code thanh cong');
      }
      setShowModal(false);
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Loi khi luu ma code');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Ban co chan muon xoa ma nay?')) return;
    try {
      await academyCodesApi.delete(id);
      toast.success('Da xoa ma code');
      loadData();
    } catch {
      toast.error('Loi khi xoa ma code');
    }
  }

  const filtered = codes.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.code.toLowerCase().includes(q) || c.course?.title?.toLowerCase().includes(q);
  });

  function statusBadge(c: CourseCode) {
    if (!c.isActive) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs bg-red-500/20 text-red-400"><XCircle className="w-3 h-3" /> Da khoa</span>;
    if (c.expiresAt && new Date(c.expiresAt).getTime() < Date.now()) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs bg-yellow-500/20 text-yellow-400"><Clock className="w-3 h-3" /> Het han</span>;
    if (c.usedCount >= c.maxUses) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs bg-orange-500/20 text-orange-400"><XCircle className="w-3 h-3" /> Het luot</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3" /> Con han</span>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary flex items-center gap-3">
            <KeyRound className="w-7 h-7 text-neon-violet" />
            Quan ly Ma Code khoa hoc
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Tao va quan ly ma kich hoat cho cac khoa hoc dang ky bang ma code (CODE)
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
        >
          <Plus className="w-4 h-4" />
          Tao ma moi
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Tong ma code', value: codes.length, color: 'from-neon-indigo to-neon-violet' },
          { label: 'Dang hoat dong', value: codes.filter(c => c.isActive && c.usedCount < c.maxUses && (!c.expiresAt || new Date(c.expiresAt).getTime() > Date.now())).length, color: 'from-green-500 to-emerald-500' },
          { label: 'Da su dung', value: codes.reduce((s, c) => s + c.usedCount, 0), color: 'from-orange-500 to-amber-500' },
        ].map(stat => (
          <div key={stat.label} className={`bg-darkcard border border-darkborder rounded-2xl p-5 bg-gradient-to-br ${stat.color} bg-darkcard border-darkborder`}
            style={{ borderImage: 'none', borderWidth: '1px', borderStyle: 'solid' }}
          >
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-white/70 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tim kiem theo ma code hoac ten khoa hoc..."
          className="w-full pl-10 pr-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-darkborder rounded-2xl">
          <KeyRound className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
          <p className="text-text-muted">Chua co ma code nao</p>
          <button onClick={openCreate} className="mt-4 text-neon-violet hover:text-neon-indigo text-sm font-medium">
            Tao ma dau tien
          </button>
        </div>
      ) : (
        <div className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-darkborder bg-darkbg/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Ma Code</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Khoa hoc</th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Da dung / Toi da</th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Trang thai</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Ngay tao</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Thao tac</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkborder/50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <code className="font-mono font-bold text-neon-violet text-base tracking-wider">{c.code}</code>
                  </td>
                  <td className="px-5 py-4 text-text-secondary max-w-xs truncate">{c.course?.title || `Khoa hoc #${c.courseId}`}</td>
                  <td className="px-5 py-4 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-darkbg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-neon-indigo to-neon-violet rounded-full transition-all"
                          style={{ width: `${c.maxUses > 0 ? Math.min(100, (c.usedCount / c.maxUses) * 100) : 0}%` }}
                        />
                      </div>
                      <span className="text-text-secondary text-xs font-mono">{c.usedCount}/{c.maxUses}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">{statusBadge(c)}</td>
                  <td className="px-5 py-4 text-text-muted text-xs">
                    {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-neon-violet transition-colors"
                        title="Sua"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-text-muted hover:text-red-400 transition-colors"
                        title="Xoa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md my-8 mx-4 bg-darkcard border border-darkborder rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-darkborder">
              <h2 className="text-lg font-heading font-bold text-text-primary">
                {editingId ? 'Sua ma Code' : 'Tao ma Code moi'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Course selector */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Khoa hoc *</label>
                <select
                  value={form.courseId}
                  onChange={e => setForm(p => ({ ...p, courseId: Number(e.target.value) }))}
                  disabled={editingId !== null}
                  className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 cursor-pointer disabled:opacity-50"
                >
                  <option value={0}>-- Chon khoa hoc --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Code input */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Ma Code *</label>
                <div className="flex gap-2">
                  <input
                    value={form.code}
                    onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                    maxLength={10}
                    placeholder="ABC123"
                    className="flex-1 px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary font-mono font-bold tracking-wider placeholder:font-normal placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, code: randomCode(6) }))}
                    className="flex items-center gap-1.5 px-3 py-2.5 bg-neon-indigo/10 text-neon-indigo text-sm rounded-xl hover:bg-neon-indigo/20 transition-colors"
                    title="Sinh ma ngau nhien"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] mt-1 text-text-muted">4-10 ky tu, chi chu hoa va so. Khong dau, khong khoang trang.</p>
              </div>

              {/* Max uses */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">So lan su dung toi da *</label>
                <input
                  type="number"
                  min="1"
                  value={form.maxUses}
                  onChange={e => setForm(p => ({ ...p, maxUses: Math.max(1, Number(e.target.value)) }))}
                  className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50"
                />
                <p className="text-[11px] mt-1 text-text-muted">Dat 0 hoac de trong = khong gioi han.</p>
              </div>

              {/* Expires at */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Ngay het han (tuychon)</label>
                <input
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50"
                />
                <p className="text-[11px] mt-1 text-text-muted">De trong = khong co han.</p>
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? 'bg-neon-violet' : 'bg-darkborder'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm text-text-primary">Kich hoat</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-darkborder">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Huy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {editingId ? 'Cap nhat' : 'Tao ma code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
