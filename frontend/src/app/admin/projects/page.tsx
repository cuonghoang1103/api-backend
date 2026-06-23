'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
 Plus,
 Pencil,
 Trash2,
 Search,
 ExternalLink,
 GitBranch,
 Images,
 Star,
 BookOpen,
 Loader2,
 Sparkles,
 CheckCircle2,
 Hammer,
 CircleDashed,
} from 'lucide-react';
import { api } from '@/lib/api';
import type { Project } from '@/types';

const STATUS_OPTIONS = ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'MAINTENANCE', 'ON_HOLD'];

const statusConfig: Record<string, string> = {
 PLANNING: 'bg-blue-500/15 text-blue-400',
 IN_PROGRESS: 'bg-yellow-500/15 text-yellow-400',
 COMPLETED: 'bg-emerald-500/15 text-emerald-400',
 MAINTENANCE: 'bg-purple-500/15 text-purple-400',
 ON_HOLD: 'bg-gray-500/15 text-gray-400',
};

const statusLabels: Record<string, string> = {
 PLANNING: 'Lên kế hoạch',
 IN_PROGRESS: 'Đang phát triển',
 COMPLETED: 'Hoàn thành',
 MAINTENANCE: 'Bảo trì',
 ON_HOLD: 'Tạm dừng',
};

/**
 * Admin project list. Phase 4 rewrote the editor from a
 * modal into a dedicated route at /admin/projects/[id].
 * This page is now a thin list with quick actions
 * (open editor, toggle featured, delete) — full editing
 * happens in the dedicated editor.
 */
export default function AdminProjectsPage() {
 const router = useRouter();
 const [projects, setProjects] = useState<Project[]>([]);
 const [loading, setLoading] = useState(false);
 const [search, setSearch] = useState('');
 const [deletingId, setDeletingId] = useState<number | null>(null);
 const [togglingId, setTogglingId] = useState<number | null>(null);
 const [publishingId, setPublishingId] = useState<number | null>(null);
 const [creating, setCreating] = useState(false);

 const filtered = useMemo(() => {
 if (!search) return projects;
 const q = search.toLowerCase();
 return projects.filter(
 (p) =>
 p.title.toLowerCase().includes(q) ||
 (p.description || '').toLowerCase().includes(q) ||
 (p.technologies ?? []).some((t) => t.toLowerCase().includes(q)) ||
 (p.category ?? '').toLowerCase().includes(q),
 );
 }, [projects, search]);

 const fetchProjects = useCallback(async () => {
 setLoading(true);
 try {
 const params = new URLSearchParams({ size: '100' });
 if (search) params.set('keyword', search);
 const res = await api.get(`/admin/projects?${params}`);
 setProjects(Array.isArray(res.data?.data) ? res.data.data : []);
 } catch {
 toast.error('Lỗi tải danh sách dự án');
 } finally {
 setLoading(false);
 }
 }, [search]);

 useEffect(() => { void fetchProjects(); }, [fetchProjects]);

 const handleCreate = async () => {
 setCreating(true);
 try {
 // Create a stub with just a title placeholder, then
 // jump to the editor where the admin fills in the rest.
 const res = await api.post('/admin/projects', {
 title: 'Dự án mới',
 description: 'Mô tả ngắn về dự án…',
 status: 'IN_PROGRESS',
 techStack: '',
 isFeatured: false,
 });
 const id = res.data?.data?.id;
 toast.success('Đã tạo dự án, chuyển sang editor…');
 if (id) router.push(`/admin/projects/${id}`);
 } catch (err: unknown) {
 const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
 ?? 'Tạo thất bại';
 toast.error(msg);
 } finally {
 setCreating(false);
 }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('Xóa dự án này? Hành động không thể hoàn tác.')) return;
 setDeletingId(id);
 try {
 await api.delete(`/admin/projects/${id}`);
 toast.success('Đã xóa dự án');
 setProjects((prev) => prev.filter((p) => p.id !== id));
 } catch (err: unknown) {
 const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
 ?? 'Xóa thất bại';
 toast.error(msg);
 } finally {
 setDeletingId(null);
 }
 };

 const handleToggleFeatured = async (project: Project) => {
 setTogglingId(project.id);
 try {
 const res = await api.patch(`/admin/projects/${project.id}/toggle-featured`);
 setProjects((prev) =>
 prev.map((p) => (p.id === project.id ? { ...p, ...(res.data?.data as Project) } : p)),
 );
 toast.success((res.data?.data as Project)?.featured ? 'Đã đánh dấu nổi bật' : 'Đã bỏ nổi bật');
 } catch {
 toast.error('Thao tác thất bại');
 } finally {
 setTogglingId(null);
 }
 };

 // Fast publish toggle for the admin list — single PUT
 // with just the boolean, no other field touched. Used
 // by the green/red icon button on each card so the admin
 // can flip a project's visibility without opening the
 // editor.
 const handleTogglePublish = async (project: Project) => {
 setPublishingId(project.id);
 const next = !project.isPublished;
 try {
 const res = await api.put(`/admin/projects/${project.id}`, { isPublished: next });
 setProjects((prev) =>
 prev.map((p) => (p.id === project.id ? { ...p, ...(res.data?.data as Project) } : p)),
 );
 toast.success(next ? 'Đã đăng dự án' : 'Đã chuyển về bản nháp');
 } catch (err: unknown) {
 const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
 ?? 'Thao tác thất bại';
 toast.error(msg);
 } finally {
 setPublishingId(null);
 }
 };

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex items-center justify-between flex-wrap gap-3">
 <div>
 <h1 className="text-2xl font-heading font-bold text-text-primary">Quản lý Dự án</h1>
 <p className="text-text-secondary mt-1">{projects.length} dự án</p>
 </div>
 <button
 onClick={handleCreate}
 disabled={creating}
 className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
 >
 {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
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
 onChange={(e) => setSearch(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
 />
 </div>

 {/* Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
 {loading ? (
 [...Array(8)].map((_, i) => (
 <div key={i} className="bg-darkcard rounded-2xl overflow-hidden border border-darkborder animate-pulse">
 <div className="h-32 bg-darkbg" />
 <div className="p-4 space-y-2">
 <div className="h-4 bg-darkbg rounded w-3/4" />
 <div className="h-3 bg-darkbg rounded w-full" />
 <div className="h-3 bg-darkbg rounded w-1/2" />
 </div>
 </div>
 ))
 ) : filtered.length === 0 ? (
 <div className="col-span-full text-center py-16 text-text-muted">
 <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-30" />
 <p>Chưa có dự án nào</p>
 </div>
 ) : (
 filtered.map((project) => (
 <div
 key={project.id}
 className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden hover:border-neon-violet/30 transition-all group"
 >
 {/* Thumbnail */}
 <div className="h-32 bg-gradient-to-br from-neon-indigo/10 via-neon-violet/10 to-neon-fuchsia/10 flex items-center justify-center relative overflow-hidden">
 {project.thumbnailUrl ? (
 <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
 ) : (
 <GitBranch className="w-12 h-12 text-neon-violet/30" />
 )}
 {Array.isArray(project.images) && project.images.length > 0 && (
 <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium flex items-center gap-1">
 <Images className="w-3 h-3" />
 {project.images.length + 1}
 </div>
 )}
 {project.featured && (
 <span className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-400/20 text-yellow-300 text-xs rounded-full font-medium">
 NỔI BẬT
 </span>
 )}
 <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium ${
 statusConfig[project.status] || 'bg-gray-500/10 text-gray-400'
 }`}>
 {statusLabels[project.status] ?? project.status}
 </span>
 {/* Draft badge */}
 {project.isPublished === false && (
 <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-[10px] font-medium">
 BẢN NHÁP
 </span>
 )}
 </div>

 <div className="p-4">
 <Link
 href={`/admin/projects/${project.id}`}
 className="block text-sm font-medium text-text-primary truncate hover:text-neon-violet transition-colors mb-1"
 >
 {project.title}
 </Link>
 <p className="text-xs text-text-muted line-clamp-2 mb-3">{project.description}</p>

 {/* Case-study chips */}
 <div className="flex flex-wrap gap-1 mb-2">
 {project.category && (
 <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 rounded text-[10px] border border-cyan-500/20">
 {project.category}
 </span>
 )}
 {project.difficulty && (
 <span className="px-2 py-0.5 bg-rose-500/10 text-rose-300 rounded text-[10px] border border-rose-500/20">
 {project.difficulty}
 </span>
 )}
 {typeof project.viewCount === 'number' && project.viewCount > 0 && (
 <span className="px-2 py-0.5 bg-darkbg text-text-muted rounded text-[10px] inline-flex items-center gap-1">
 <Sparkles className="w-2.5 h-2.5" /> {project.viewCount}
 </span>
 )}
 </div>

 {/* Counts row: milestones / features / resources */}
 <div className="flex flex-wrap gap-1 mb-3 text-[10px] text-text-muted">
 {(project.milestones?.length ?? 0) > 0 && (
 <span className="inline-flex items-center gap-1">
 <BookOpen className="w-2.5 h-2.5" />
 {project.milestones!.length} mốc
 </span>
 )}
 {(project.features?.length ?? 0) > 0 && (
 <span className="inline-flex items-center gap-1">
 {featureStatusCount(project.features!, 'DONE')}/{project.features!.length} done
 </span>
 )}
 {(project.resources?.length ?? 0) > 0 && (
 <span className="inline-flex items-center gap-1">
 {project.resources!.length} tài nguyên
 </span>
 )}
 </div>

 {/* Tech pills */}
 <div className="flex flex-wrap gap-1 mb-3">
 {(project.technologies ?? []).slice(0, 3).map((tech) => (
 <span key={tech} className="px-2 py-0.5 bg-neon-indigo/10 text-neon-indigo/80 rounded text-xs border border-neon-indigo/20">
 {tech}
 </span>
 ))}
 {(project.technologies ?? []).length > 3 && (
 <span className="px-1.5 py-0.5 text-text-muted text-xs">
 +{(project.technologies ?? []).length - 3}
 </span>
 )}
 </div>

 {/* Actions */}
 <div className="flex items-center justify-end gap-1">
 {/*
 Publish toggle on each card. Distinct from the editor
 header toggle — this one doesn't require opening the
 project, useful when scanning the list.
 */}
 <button
 onClick={() => handleTogglePublish(project)}
 disabled={publishingId === project.id}
 className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
 project.isPublished !== false
 ? 'text-emerald-400 hover:bg-emerald-500/10'
 : 'text-text-muted hover:bg-emerald-500/10 hover:text-emerald-400'
 }`}
 title={project.isPublished !== false ? 'Chuyển về bản nháp' : 'Đăng dự án'}
 >
 {project.isPublished !== false ? <CheckCircle2 className="w-3.5 h-3.5" /> : <CircleDashed className="w-3.5 h-3.5" />}
 </button>
 <button
 onClick={() => handleToggleFeatured(project)}
 disabled={togglingId === project.id}
 className={`p-1.5 rounded-lg transition-colors ${project.featured ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-text-muted hover:bg-yellow-400/10 hover:text-yellow-400'} disabled:opacity-50`}
 title={project.featured ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
 >
 <Star className={`w-3.5 h-3.5 ${project.featured ? 'fill-current' : ''}`} />
 </button>
 {project.projectUrl && (
 <a
 href={project.projectUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-neon-emerald transition-colors"
 title="Mở trang dự án"
 >
 <ExternalLink className="w-3.5 h-3.5" />
 </a>
 )}
 <Link
 href={`/admin/projects/${project.id}`}
 className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-neon-violet transition-colors"
 title="Mở editor"
 >
 <Pencil className="w-3.5 h-3.5" />
 </Link>
 <button
 onClick={() => handleDelete(project.id)}
 disabled={deletingId === project.id}
 className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors disabled:opacity-50"
 title="Xóa"
 >
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 );
}

/**
 * Helper: count features in a given status, used in the
 * compact "{done}/{total}" indicator on each card.
 */
function featureStatusCount<
 T extends { status: string },
>(features: T[], status: string): number {
 return features.filter((f) => f.status === status).length;
}