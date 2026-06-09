'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, fileApi } from '@/lib/api';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnailUrl?: string;
  sourceUrl?: string;
  isFeatured?: boolean;
  status: string;
  categoryName?: string;
  tagNames?: string[];
  viewCount?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

interface PostForm {
  title: string;
  content: string;
  excerpt: string;
  thumbnailUrl: string;
  sourceUrl: string;
  isFeatured: boolean;
  status: string;
  category: string;
  tags: string[];
  publishedAt: string;
}

const emptyForm: PostForm = {
  title: '',
  content: '',
  excerpt: '',
  thumbnailUrl: '',
  sourceUrl: '',
  isFeatured: false,
  status: 'DRAFT',
  category: '',
  tags: [],
  publishedAt: '',
};

const tagInputDefaults = ['', '', ''];

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [tagInputs, setTagInputs] = useState(['', '', '']);
  const [saving, setSaving] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingContentImage, setUploadingContentImage] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const pageSize = 10;

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        size: String(pageSize),
        sort: 'createdAt,desc',
        ...(search && { keyword: search }),
        ...(statusFilter && { status: statusFilter }),
      });
      const res = await api.get(`/admin/posts?${params}`);
      const postsData = res.data?.data;
      const pagination = res.data?.pagination;
      setPosts(Array.isArray(postsData) ? postsData : []);
      setTotalPages(pagination?.totalPages || 0);
    } catch {
      toast.error('Lỗi tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  useEffect(() => { setPage(0); }, [search, statusFilter]);

  const openCreate = () => {
    setEditingPost(null);
    setForm(emptyForm);
    setTagInputs([...tagInputDefaults]);
    setPreviewMode(false);
    setShowForm(true);
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    const tags = post.tagNames && post.tagNames.length > 0 ? post.tagNames : [...tagInputDefaults];
    setForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      thumbnailUrl: post.thumbnailUrl || '',
      sourceUrl: post.sourceUrl || '',
      isFeatured: Boolean((post as any).isFeatured),
      status: post.status || 'DRAFT',
      category: post.categoryName || '',
      tags: post.tagNames || [],
      publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
    });
    setTagInputs(tags);
    setPreviewMode(false);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPost(null);
    setForm(emptyForm);
    setTagInputs(['', '', '']);
    setPreviewMode(false);
  };

  const addTagInput = () => setTagInputs((prev) => [...prev, '']);

  const handleTagInputChange = (index: number, value: string) => {
    setTagInputs((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const getTagsFromInputs = () => {
    return tagInputs.map((t) => t.trim()).filter(Boolean);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh tối đa 5MB');
      return;
    }
    try {
      setUploadingThumbnail(true);
      const res = await fileApi.upload(file, 'thumbnails');
      const url = res.data?.data?.url;
      if (url) {
        setForm((prev) => ({ ...prev, thumbnailUrl: url }));
        toast.success('Tải ảnh thành công');
      } else {
        toast.error('Tải ảnh thất bại');
      }
    } catch {
      toast.error('Tải ảnh thất bại');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleContentImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ảnh tối đa 5MB');
        return;
      }
      try {
        setUploadingContentImage(true);
        const res = await fileApi.upload(file, 'content');
        const url = res.data?.data?.url;
        if (url) {
          const mdImage = `\n![${file.name}](${url})\n`;
          setForm((prev) => ({ ...prev, content: prev.content + mdImage }));
          toast.success('Chèn ảnh thành công');
        } else {
          toast.error('Chèn ảnh thất bại');
        }
      } catch {
        toast.error('Chèn ảnh thất bại');
      } finally {
        setUploadingContentImage(false);
      }
    };
    input.click();
  };

  const handleSave = async () => {
    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      excerpt: form.excerpt.trim(),
      thumbnailUrl: form.thumbnailUrl.trim(),
      sourceUrl: form.sourceUrl.trim(),
      isFeatured: form.isFeatured,
      status: form.status,
      category: form.category.trim(),
      tags: getTagsFromInputs(),
      publishedAt: form.status === 'SCHEDULED' ? form.publishedAt : undefined,
    };

    if (!payload.title) {
      toast.error('Tiêu đề không được để trống');
      return;
    }

    if (!payload.content) {
      toast.error('Nội dung không được để trống');
      return;
    }

    if (payload.status === 'SCHEDULED' && !payload.publishedAt) {
      toast.error('Vui lòng chọn ngày đăng cho bài viết đã lên lịch');
      return;
    }

    try {
      setSaving(true);
      if (editingPost) {
        await api.put(`/admin/posts/${editingPost.id}`, payload);
        toast.success('Cập nhật bài viết thành công');
      } else {
        await api.post('/admin/posts', payload);
        toast.success('Tạo bài viết thành công');
      }
      closeForm();
      await fetchPosts();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lưu bài viết thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa bài viết này?')) return;

    try {
      await api.delete(`/admin/posts/${id}`);
      toast.success('Đã xóa bài viết');
      if (posts.length === 1 && page > 0) {
        setPage((prev) => Math.max(0, prev - 1));
      } else {
        await fetchPosts();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Xóa bài viết thất bại');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  const statusConfig: Record<string, { color: string; label: string; icon: React.ElementType }> = {
    PUBLISHED: { color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', label: 'Đã đăng', icon: CheckCircle },
    DRAFT: { color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20', label: 'Bản nháp', icon: AlertCircle },
    SCHEDULED: { color: 'bg-blue-500/15 text-blue-400 border-blue-500/20', label: 'Đã lên lịch', icon: Clock },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Quản lý Bài viết</h1>
          <p className="text-text-secondary mt-1">Tạo, chỉnh sửa và quản lý bài viết blog</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Viết bài mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 transition-colors cursor-pointer"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PUBLISHED">Đã đăng</option>
          <option value="DRAFT">Bản nháp</option>
          <option value="SCHEDULED">Đã lên lịch</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-darkborder">
                <th className="text-left px-5 py-4 text-xs font-medium text-text-muted uppercase tracking-wider">Bài viết</th>
                <th className="text-left px-5 py-4 text-xs font-medium text-text-muted uppercase tracking-wider hidden sm:table-cell">Danh mục</th>
                <th className="text-left px-5 py-4 text-xs font-medium text-text-muted uppercase tracking-wider hidden md:table-cell">Trạng thái</th>
                <th className="text-left px-5 py-4 text-xs font-medium text-text-muted uppercase tracking-wider hidden lg:table-cell">Views</th>
                <th className="text-left px-5 py-4 text-xs font-medium text-text-muted uppercase tracking-wider hidden xl:table-cell">Ngày tạo</th>
                <th className="text-right px-5 py-4 text-xs font-medium text-text-muted uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkborder">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-6"><div className="h-4 bg-darkborder/50 rounded animate-pulse" /></td></tr>
                ))
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-muted">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Chưa có bài viết nào</p>
                  </td>
                </tr>
              ) : (
                posts.map((post) => {
                  const status = statusConfig[post.status] || statusConfig.DRAFT;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-neon-violet/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-neon-violet" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate max-w-xs">{post.title}</p>
                            <p className="text-xs text-text-muted truncate max-w-xs mt-0.5">{post.excerpt || post.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="text-sm text-text-secondary">{post.categoryName || '-'}</span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-sm text-text-secondary">{post.viewCount?.toLocaleString('vi-VN') ?? 0}</span>
                      </td>
                      <td className="px-5 py-4 hidden xl:table-cell">
                        <span className="text-sm text-text-muted">{formatDate(post.createdAt)}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(post)}
                            className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-neon-violet transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
                            title="Xem"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-darkborder flex items-center justify-between">
            <span className="text-sm text-text-muted">
              Trang {page + 1} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg hover:bg-white/5 text-text-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-text-primary px-2">{page + 1}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg hover:bg-white/5 text-text-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-darkbg border border-darkborder rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-darkborder flex items-center justify-between flex-shrink-0">
              <h2 className="font-heading font-bold text-text-primary">
                {editingPost ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`p-2 rounded-lg transition-colors ${previewMode ? 'bg-neon-violet/15 text-neon-violet' : 'hover:bg-white/5 text-text-muted'}`}
                  title="Preview"
                >
                  {previewMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={closeForm} className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {previewMode ? (
                <div className="space-y-4">
                  <h1 className="text-2xl font-heading font-bold text-text-primary">{form.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span>{form.category || 'Uncategorized'}</span>
                    <span>•</span>
                    <span>{form.publishedAt ? formatDate(form.publishedAt) : new Date().toLocaleDateString('vi-VN')}</span>
                  </div>
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-neon-violet/10 text-neon-violet rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="prose prose-invert max-w-none border-t border-darkborder pt-4">
                    <ReactMarkdown className="text-text-secondary leading-relaxed">
                      {form.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Tiêu đề *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Nhập tiêu đề bài viết..."
                      className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Mô tả ngắn</label>
                    <input
                      type="text"
                      value={form.excerpt}
                      onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                      placeholder="Mô tả ngắn cho bài viết (hiển thị ở danh sách)..."
                      className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-text-primary">Nội dung *</label>
                      <button
                        type="button"
                        onClick={handleContentImageUpload}
                        disabled={uploadingContentImage}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-darkcard border border-darkborder rounded-lg text-xs text-text-secondary hover:text-neon-violet hover:border-neon-violet/30 transition-colors disabled:opacity-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        {uploadingContentImage ? 'Đang tải...' : 'Chèn ảnh'}
                      </button>
                    </div>
                    <textarea
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      placeholder="Nội dung bài viết (hỗ trợ Markdown)..."
                      rows={14}
                      className="w-full px-4 py-3 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors resize-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Danh mục</label>
                      <input
                        type="text"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        placeholder="VD: AI, Backend, Frontend..."
                        className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Trạng thái</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 transition-colors cursor-pointer"
                      >
                        <option value="DRAFT">Bản nháp</option>
                        <option value="PUBLISHED">Đăng ngay</option>
                        <option value="SCHEDULED">Lên lịch</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Source URL</label>
                      <input
                        type="url"
                        value={form.sourceUrl}
                        onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                        placeholder="https://github.com/... hoặc link tài liệu"
                        className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                      />
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 bg-darkcard border border-darkborder rounded-xl mt-7 sm:mt-0">
                      <div>
                        <p className="text-sm font-medium text-text-primary">Bài viết nổi bật</p>
                        <p className="text-xs text-text-muted mt-1">Ưu tiên hiển thị ở khu vực featured/public blog</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                        className="h-4 w-4 rounded border-darkborder bg-darkbg text-neon-violet focus:ring-neon-violet/50"
                      />
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Ảnh thumbnail</label>
                    <div className="flex flex-col gap-3">
                      {/* Preview */}
                      {form.thumbnailUrl && (
                        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-darkborder bg-darkbg">
                          <img
                            src={form.thumbnailUrl}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, thumbnailUrl: '' })}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/80 rounded-lg text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {/* Upload button */}
                      <label className="flex items-center justify-center gap-2 px-4 py-3 bg-darkcard border border-darkborder rounded-xl text-sm text-text-secondary hover:text-text-primary hover:border-neon-violet/30 cursor-pointer transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                        {uploadingThumbnail ? 'Đang tải lên...' : (form.thumbnailUrl ? 'Thay ảnh khác' : 'Tải ảnh lên')}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleThumbnailUpload}
                          disabled={uploadingThumbnail}
                        />
                      </label>
                      {/* Manual URL fallback */}
                      {form.thumbnailUrl && (
                        <input
                          type="url"
                          value={form.thumbnailUrl}
                          onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                          placeholder="Hoặc dán URL ảnh..."
                          className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                        />
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                      <Tag className="w-3.5 h-3.5 inline mr-1" />
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {getTagsFromInputs().map((tag, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-neon-violet/10 text-neon-violet rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tagInputs.map((val, i) => (
                        <input
                          key={i}
                          type="text"
                          value={val}
                          onChange={(e) => handleTagInputChange(i, e.target.value)}
                          placeholder={`Tag ${i + 1}`}
                          className="px-3 py-1.5 bg-darkcard border border-darkborder rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors w-32"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') { e.preventDefault(); addTagInput(); }
                          }}
                        />
                      ))}
                      <button
                        onClick={addTagInput}
                        className="px-3 py-1.5 border border-dashed border-darkborder rounded-lg text-sm text-text-muted hover:text-neon-violet hover:border-neon-violet/30 transition-colors"
                      >
                        + Thêm tag
                      </button>
                    </div>
                  </div>

                  {/* Published at */}
                  {form.status === 'SCHEDULED' && (
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Ngày đăng</label>
                      <input
                        type="datetime-local"
                        value={form.publishedAt}
                        onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                        className="px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 transition-colors"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!previewMode && (
              <div className="px-6 py-4 border-t border-darkborder flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  onClick={closeForm}
                  className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? 'Đang lưu...' : editingPost ? 'Cập nhật' : 'Đăng bài'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
