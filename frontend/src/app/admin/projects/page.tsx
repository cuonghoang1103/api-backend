'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  GitBranch,
  XCircle,
  Images,
  BookOpen,
} from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { projectsApi } from '@/lib/api';
import type { Project } from '@/types';
import MultiImageUploader from '@/components/admin/MultiImageUploader';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ThumbnailUploader from '@/components/admin/ThumbnailUploader';

const STATUS_OPTIONS = ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'MAINTENANCE'];

const statusConfig: Record<string, string> = {
  PLANNING: 'bg-blue-500/15 text-blue-400',
  IN_PROGRESS: 'bg-yellow-500/15 text-yellow-400',
  COMPLETED: 'bg-emerald-500/15 text-emerald-400',
  MAINTENANCE: 'bg-purple-500/15 text-purple-400',
};

const statusLabels: Record<string, string> = {
  PLANNING: 'Lên kế hoạch',
  IN_PROGRESS: 'Đang phát triển',
  COMPLETED: 'Hoàn thành',
  MAINTENANCE: 'Bảo trì',
};

// ─── Multi-Select Tag Input ────────────────────────────────────────────────────
function TagInput({
  tags,
  onChange,
  placeholder = 'Gõ công nghệ và nhấn Enter...',
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag || tags.includes(tag)) return;
    onChange([...tags, tag]);
    setInputValue('');
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="min-h-[48px] w-full px-3 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus-within:border-neon-violet/50 transition-colors cursor-text flex flex-wrap gap-1.5 items-center"
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-neon-indigo/15 border border-neon-indigo/30 text-neon-indigo text-xs rounded-full font-medium"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
            className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-neon-indigo/30 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (inputValue.trim()) addTag(inputValue); }}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
      />
    </div>
  );
}

// ─── Project Form Modal ────────────────────────────────────────────────────────
function ProjectFormModal({
  project,
  onClose,
  onSave,
}: {
  project?: Project | null;
  onClose: () => void;
  onSave: (payload: ReturnType<typeof buildPayload>) => Promise<void>;
}) {
  const isEditing = Boolean(project);

  interface ProjectFormState {
    title: string;
    description: string;
    technologies: string[];
    status: string;
    projectUrl: string;
    githubUrl: string;
    thumbnailUrl: string;
    featured: boolean;
    images: string[];
    content: string;
    videoUrl: string;
  }

  const [form, setForm] = useState<ProjectFormState>({
    title: project?.title ?? '',
    description: project?.description ?? '',
    technologies: Array.isArray(project?.technologies) ? [...project.technologies] : [],
    status: project?.status ?? 'IN_PROGRESS',
    projectUrl: project?.projectUrl ?? '',
    githubUrl: project?.githubUrl ?? '',
    thumbnailUrl: project?.thumbnailUrl ?? '',
    featured: project?.featured ?? false,
    images: Array.isArray(project?.images) ? [...project.images] : [],
    content: project?.content ?? '',
    videoUrl: (project as Project)?.videoUrl ?? '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (fields: Partial<typeof form>) =>
    setForm((prev) => ({ ...prev, ...fields }));

  const buildPayload = () => ({
    title: form.title,
    slug: slugify(form.title),
    description: form.description,
    techStack: form.technologies.join(', '),
    status: form.status,
    projectUrl: form.projectUrl || null,
    githubUrl: form.githubUrl || null,
    thumbnailUrl: form.thumbnailUrl || null,
    videoUrl: form.videoUrl || null,
    featured: form.featured,
    images: form.images,
    content: form.content || null,
  });

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Tên dự án không được để trống'); return; }
    if (!form.description.trim()) { toast.error('Mô tả không được để trống'); return; }
    setSaving(true);
    try {
      await onSave(buildPayload());
      onClose();
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.message ?? 'Lưu thất bại';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-darkbg border border-darkborder rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-heading font-bold text-text-primary">
              {isEditing ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Tên dự án <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set({ title: e.target.value })}
              placeholder="VD: Portfolio Website, AI Chat App..."
              className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Mô tả <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set({ description: e.target.value })}
              placeholder="Mô tả ngắn về dự án..."
              rows={3}
              className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors resize-none"
            />
          </div>

          {/* Technologies — Multi-Select Tag */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Công nghệ sử dụng
            </label>
            <TagInput
              tags={form.technologies}
              onChange={(tags) => set({ technologies: tags })}
              placeholder="Gõ công nghệ (VD: React) → Enter..."
            />
            {form.technologies.length > 0 && (
              <p className="mt-1 text-xs text-text-muted">
                {form.technologies.length} công nghệ đã chọn
              </p>
            )}
          </div>

          {/* Status + Featured */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Trạng thái</label>
              <select
                value={form.status}
                onChange={(e) => set({ status: e.target.value })}
                className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 transition-colors cursor-pointer"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{statusLabels[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Nổi bật</label>
              <select
                value={form.featured ? 'true' : 'false'}
                onChange={(e) => set({ featured: e.target.value === 'true' })}
                className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 transition-colors cursor-pointer"
              >
                <option value="false">Không</option>
                <option value="true">Có</option>
              </select>
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Live URL</label>
              <input
                type="url"
                value={form.projectUrl}
                onChange={(e) => set({ projectUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                YouTube Video URL
                <span className="ml-1.5 text-[10px] text-neon-emerald font-normal">(demo trực tiếp)</span>
              </label>
              <input
                type="url"
                value={form.videoUrl}
                onChange={(e) => set({ videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">GitHub URL</label>
              <input
                type="url"
                value={form.githubUrl}
                onChange={(e) => set({ githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
              />
            </div>
          </div>

          {/* Thumbnail Uploader */}
          <ThumbnailUploader
            value={form.thumbnailUrl}
            onChange={(url) => set({ thumbnailUrl: url })}
            disabled={saving}
          />

          {/* ── ADVANCED SECTION ───────────────────────────────────────── */}
          <div className="border border-darkborder rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-text-primary hover:bg-white/[0.02] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Images className="w-4 h-4 text-neon-violet" />
                Nội dung nâng cao
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-violet/10 text-neon-violet font-medium">
                  Gallery + Case Study
                </span>
              </span>
              <span className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
                <ChevronRight className="w-4 h-4 text-text-muted" />
              </span>
            </button>

            {showAdvanced && (
              <div className="px-4 pb-4 space-y-4 border-t border-darkborder pt-4">
                {/* Multi-Image Gallery */}
                <MultiImageUploader
                  images={form.images}
                  onChange={(images) => set({ images })}
                  maxImages={10}
                  disabled={saving}
                />

                {/* Rich-Text Editor */}
                <RichTextEditor
                  value={form.content}
                  onChange={(content) => set({ content })}
                  placeholder={`Viết case study, hành trình phát triển dự án...

## Giai đoạn 1: Lên kế hoạch
- Nghiên cứu yêu cầu dự án
- Phân tích tech stack phù hợp

## Giai đoạn 2: Phát triển
Triển khai các tính năng cốt lõi...

> Bài học quan trọng: luôn ưu tiên UX từ đầu

Xem thêm: [Tài liệu tham khảo](https://example.com)`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Tạo mới'}
          </button>
        </div>
      </div>
    </div>
  );
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ─── Admin Page ────────────────────────────────────────────────────────────────
export default function AdminProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useProjectStore();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize] = useState(8);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const filtered = projects.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.technologies ?? []).some((t) => t.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const openCreate = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleSave = async (payload: Parameters<typeof projectsApi.create>[0]) => {
    if (editingProject) {
      const res = await projectsApi.update(editingProject.id, payload);
      const saved = res.data?.data as Project | undefined;
      if (saved) updateProject(editingProject.id, saved);
      toast.success('Cập nhật dự án thành công!');
    } else {
      const res = await projectsApi.create(payload);
      const saved = res.data?.data as Project | undefined;
      if (saved) addProject(saved);
      toast.success('Tạo dự án thành công!');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa dự án này?')) return;
    try {
      await projectsApi.delete(id);
      deleteProject(id);
      toast.success('Đã xóa dự án');
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.message ?? 'Xóa thất bại';
      toast.error(msg);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Quản lý Dự án</h1>
          <p className="text-text-secondary mt-1">{projects.length} dự án</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Thêm dự án
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Tìm kiếm dự án..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="w-full pl-10 pr-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginated.length === 0 ? (
          <div className="col-span-full text-center py-16 text-text-muted">
            <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Chưa có dự án nào</p>
          </div>
        ) : (
          paginated.map((project) => (
            <div
              key={project.id}
              className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden hover:border-neon-violet/20 transition-colors group"
            >
              {/* Thumbnail */}
              <div className="h-32 bg-gradient-to-br from-neon-indigo/10 via-neon-violet/10 to-neon-fuchsia/10 flex items-center justify-center relative overflow-hidden">
                {project.thumbnailUrl ? (
                  <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <GitBranch className="w-12 h-12 text-neon-violet/30" />
                )}
                {/* Gallery indicator */}
                {Array.isArray(project.images) && project.images.length > 0 && (
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium flex items-center gap-1">
                    <Images className="w-3 h-3" />
                    {project.images.length + 1}
                  </div>
                )}
                {project.featured && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-400/20 text-yellow-300 text-xs rounded-full font-medium">
                    Nổi bật
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="text-sm font-medium text-text-primary truncate flex-1">{project.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${statusConfig[project.status] || 'bg-gray-500/10 text-gray-400'}`}>
                    {statusLabels[project.status] ?? project.status}
                  </span>
                </div>
                <p className="text-xs text-text-muted line-clamp-2 mb-3">{project.description}</p>

                {/* Content badge */}
                {project.content && project.content.length > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    <BookOpen className="w-3 h-3 text-neon-violet/60" />
                    <span className="text-[10px] text-neon-violet/60">
                      {project.content.length > 100
                        ? `${Math.round(project.content.length / 100) * 100}+ ký tự`
                        : `${project.content.length} ký tự`}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mb-3">
                  {(project.technologies ?? []).slice(0, 3).map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 bg-neon-indigo/10 text-neon-indigo/80 rounded text-xs border border-neon-indigo/20">
                      {tech}
                    </span>
                  ))}
                  {(project.technologies ?? []).length > 3 && (
                    <span className="px-1.5 py-0.5 text-text-muted text-xs">
                      +{(project.technologies ?? []).length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.projectUrl && (
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-neon-emerald transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => openEdit(project)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-neon-violet transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-2 rounded-lg hover:bg-white/5 text-text-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-text-secondary px-3">
            Trang {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-2 rounded-lg hover:bg-white/5 text-text-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <ProjectFormModal
          project={editingProject}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
