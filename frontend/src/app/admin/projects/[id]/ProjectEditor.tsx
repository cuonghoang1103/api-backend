'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
 ArrowLeft,
 Save,
 Eye,
 Loader2,
 CheckCircle2,
 AlertCircle,
 ExternalLink,
 X,
 Star,
 StarOff,
 BookOpen,
 Code2,
 Cog,
 Database,
 ListChecks,
 Download,
 Tag,
 Layers,
} from 'lucide-react';
import { api } from '@/lib/api';
import type {
 Project,
 ProjectMilestone,
 ProjectFeature,
 ProjectResource,
} from '@/types';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import MilestonesEditor from '@/components/admin/MilestonesEditor';
import FeaturesEditor from '@/components/admin/FeaturesEditor';
import ResourcesEditor from '@/components/admin/ResourcesEditor';
import MultiImageUploader from '@/components/admin/MultiImageUploader';
import ThumbnailUploader from '@/components/admin/ThumbnailUploader';

interface ProjectEditorProps {
 projectId: number;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface FormState {
 title: string;
 description: string;
 status: string;
 featured: boolean;
 category: string;
 difficulty: string;
 role: string;
 duration: string;
 projectUrl: string;
 githubUrl: string;
 videoUrl: string;
 thumbnailUrl: string;
 images: string[];
 technologies: string[];
 content: string;
 bodyMdx: string;
 schemaCode: string;
 schemaLang: string;
 startDate: string;
 endDate: string;
 isPublished: boolean;
}

const STATUS_OPTIONS = ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'MAINTENANCE', 'ON_HOLD'];
const STATUS_LABELS: Record<string, string> = {
 PLANNING: 'Lên kế hoạch',
 IN_PROGRESS: 'Đang phát triển',
 COMPLETED: 'Hoàn thành',
 MAINTENANCE: 'Bảo trì',
 ON_HOLD: 'Tạm dừng',
};

const CATEGORIES = ['Web', 'Mobile', 'AI', 'DevOps', 'Game', 'IoT', 'Data', 'Tooling'];
const DIFFICULTIES: { value: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'; label: string }[] = [
 { value: 'BEGINNER', label: 'Cơ bản' },
 { value: 'INTERMEDIATE', label: 'Trung bình' },
 { value: 'ADVANCED', label: 'Nâng cao' },
];
const SCHEMA_LANGS = ['prisma', 'sql', 'typescript', 'javascript', 'json', 'yaml', 'plaintext'];

/**
 * ProjectEditor — admin editor page for a single project.
 *
 * Architecture:
 * • One load at mount (GET /admin/projects/:id) hydrates the
 * whole form (basic fields + 3 child lists) in a single
 * round-trip.
 * • The "Basic + Case Study" section autosaves 2s after the
 * last edit (debounced) and toggles isPublished:false on
 * every save. This means the public page keeps the previous
 * published version while the admin is editing, and the
 * admin's preview still shows the new content (via
 * /projects/:slug?preview=1 in dev — see PreviewButton).
 * • The "Milestones / Features / Resources" sections each
 * have their own explicit "Lưu danh sách" button because
 * the CRUD per-item is a separate request and we don't
 * want to spam 20+ POSTs on every keystroke.
 * • "Xuất bản" is the only button that flips isPublished
 * back to true. It also re-runs the main save first so the
 * published version reflects any pending edits.
 */
export default function ProjectEditor({ projectId }: ProjectEditorProps) {
 const router = useRouter();
 const [loading, setLoading] = useState(true);
 const [project, setProject] = useState<Project | null>(null);
 const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
 const [features, setFeatures] = useState<ProjectFeature[]>([]);
 const [resources, setResources] = useState<ProjectResource[]>([]);

 // Form state — separate from `project` so unsaved edits
 // don't leak back into the underlying record.
 const [form, setForm] = useState<FormState | null>(null);

 const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
 const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
 const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 const isFirstRender = useRef(true);

 // ─── Load ─────────────────────────────────────────────
 useEffect(() => {
 let cancelled = false;
 (async () => {
 try {
 const res = await api.get(`/admin/projects/${projectId}`);
 if (cancelled) return;
 const p: Project = res.data?.data;
 if (!p) { router.push('/admin/projects'); return; }
 setProject(p);
 setMilestones(p.milestones ?? []);
 setFeatures(p.features ?? []);
 setResources(p.resources ?? []);
 setForm({
 title: p.title ?? '',
 description: p.description ?? '',
 status: p.status ?? 'IN_PROGRESS',
 featured: Boolean(p.featured),
 category: p.category ?? '',
 difficulty: p.difficulty ?? '',
 role: p.role ?? '',
 duration: p.duration ?? '',
 projectUrl: p.projectUrl ?? '',
 githubUrl: p.githubUrl ?? '',
 videoUrl: p.videoUrl ?? '',
 thumbnailUrl: p.thumbnailUrl ?? '',
 images: Array.isArray(p.images) ? p.images : [],
 technologies: Array.isArray(p.technologies) ? p.technologies : [],
 content: p.content ?? '',
 bodyMdx: p.bodyMdx ?? '',
 schemaCode: p.schemaCode ?? '',
 schemaLang: p.schemaLang ?? 'prisma',
 startDate: p.startDate ? p.startDate.slice(0, 10) : '',
 endDate: p.endDate ? p.endDate.slice(0, 10) : '',
 isPublished: p.isPublished !== false,
 });
 } catch (err: unknown) {
 toast.error('Không tải được dự án');
 router.push('/admin/projects');
 } finally {
 if (!cancelled) setLoading(false);
 }
 })();
 return () => { cancelled = true; };
 }, [projectId, router]);

 // ─── Autosave (basic + case study only) ───────────────
 // We only autosave the "main" fields. Child entities have
 // their own manual save buttons. The debounce is 2s.
 const performSave = useCallback(async () => {
 if (!form || !project) return;
 setSaveStatus('saving');
 try {
 // buildPayload keeps the legacy `content` field in sync
 // (it's still served on /projects list cards and used as
 // the bodyMdx fallback for projects that pre-date the
 // migration).
 const payload = buildPayload(form, project, { setIsPublishedFalse: true });
 const res = await api.put(`/admin/projects/${projectId}`, payload);
 setProject((prev) => prev ? { ...prev, ...(res.data?.data as Project) } : prev);
 setForm((f) => f ? { ...f, isPublished: false } : f);
 setLastSavedAt(new Date());
 setSaveStatus('saved');
 setTimeout(() => setSaveStatus('idle'), 2200);
 } catch (err: unknown) {
 setSaveStatus('error');
 const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
 ?? 'Lưu thất bại';
 toast.error(msg);
 }
 }, [form, project, projectId]);

 useEffect(() => {
 if (isFirstRender.current) { isFirstRender.current = false; return; }
 if (!form) return;
 if (debounceRef.current) clearTimeout(debounceRef.current);
 debounceRef.current = setTimeout(() => {
 void performSave();
 }, 2000);
 return () => {
 if (debounceRef.current) clearTimeout(debounceRef.current);
 };
 // We intentionally only re-arm the debounce when `form`
 // changes; performSave is a stable callback.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [form]);

 // Flush the debounced save on tab close / nav-away.
 useEffect(() => {
 const handler = () => {
 if (debounceRef.current) {
 clearTimeout(debounceRef.current);
 // best-effort sync; the page is unloading
 void performSave();
 }
 };
 window.addEventListener('beforeunload', handler);
 return () => window.removeEventListener('beforeunload', handler);
 }, [performSave]);

 // ─── Publish (set isPublished=true) ───────────────────
 const publish = useCallback(async () => {
 if (!form || !project) return;
 setSaveStatus('saving');
 try {
 const payload = buildPayload(form, project, { setIsPublishedFalse: false });
 payload.isPublished = true;
 const res = await api.put(`/admin/projects/${projectId}`, payload);
 setProject((prev) => prev ? { ...prev, ...(res.data?.data as Project) } : prev);
 setForm((f) => f ? { ...f, isPublished: true } : f);
 setLastSavedAt(new Date());
 setSaveStatus('saved');
 toast.success('Đã xuất bản');
 setTimeout(() => setSaveStatus('idle'), 2200);
 } catch (err: unknown) {
 setSaveStatus('error');
 toast.error('Xuất bản thất bại');
 }
 }, [form, project, projectId]);

 if (loading || !form || !project) {
 return (
 <div className="flex items-center justify-center min-h-[60vh]">
 <Loader2 className="w-8 h-8 text-neon-violet animate-spin" />
 </div>
 );
 }

 const previewHref = `/projects/${project.slug}?preview=1`;

 return (
 <div className="max-w-5xl mx-auto space-y-6 pb-32">
 {/* ─── Sticky header ─────────────────────────────── */}
 <div className="sticky top-0 z-20 -mx-6 px-6 py-3 bg-darkbg/90 backdrop-blur border-b border-darkborder flex items-center justify-between flex-wrap gap-3">
 <div className="flex items-center gap-3 min-w-0">
 <Link
 href="/admin/projects"
 className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
 >
 <ArrowLeft className="w-4 h-4" />
 </Link>
 <div className="min-w-0">
 <h1 className="text-base font-semibold text-text-primary truncate">
 {form.title || '(Chưa đặt tên)'}
 </h1>
 <p className="text-xs text-text-muted">
 slug: <code className="text-neon-violet">{project.slug}</code>
 {form.isPublished ? (
 <span className="ml-3 text-emerald-400">● Đang công khai</span>
 ) : (
 <span className="ml-3 text-yellow-400">● Bản nháp</span>
 )}
 </p>
 </div>
 </div>
 <div className="flex items-center gap-2 flex-wrap">
 <SaveIndicator status={saveStatus} lastSavedAt={lastSavedAt} />
 <a
 href={previewHref}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-darkborder text-text-secondary hover:text-text-primary hover:border-neon-violet/30 transition-colors"
 >
 <Eye className="w-3.5 h-3.5" />
 Xem trước
 </a>
 <button
 type="button"
 onClick={() => void performSave()}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-darkcard border border-darkborder text-text-secondary hover:text-text-primary hover:border-neon-violet/30 transition-colors"
 >
 <Save className="w-3.5 h-3.5" />
 Lưu
 </button>
 <button
 type="button"
 onClick={() => void publish()}
 disabled={saveStatus === 'saving'}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-gradient-to-r from-neon-indigo to-neon-violet text-white hover:opacity-90 transition-opacity disabled:opacity-50"
 >
 Xuất bản
 </button>
 </div>
 </div>

 {/* ─── Section: Basic info ────────────────────────── */}
 <Section icon={BookOpen} title="Thông tin cơ bản">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <Field label="Tên dự án" required>
 <input
 type="text"
 value={form.title}
 onChange={(e) => setForm({ ...form, title: e.target.value })}
 className={inputCls}
 placeholder="VD: cuonghoang.com — Portfolio"
 />
 </Field>
 <Field label="Mô tả ngắn">
 <textarea
 value={form.description}
 onChange={(e) => setForm({ ...form, description: e.target.value })}
 rows={2}
 className={`${inputCls} resize-none`}
 placeholder="Mô tả 1-2 câu xuất hiện trên listing card."
 />
 </Field>
 <Field label="Trạng thái">
 <select
 value={form.status}
 onChange={(e) => setForm({ ...form, status: e.target.value })}
 className={`${inputCls} cursor-pointer`}
 >
 {STATUS_OPTIONS.map((s) => (
 <option key={s} value={s}>{STATUS_LABELS[s]}</option>
 ))}
 </select>
 </Field>
 <Field label="Nổi bật">
 <div className="flex items-center gap-3 h-[42px]">
 <button
 type="button"
 onClick={() => setForm({ ...form, featured: !form.featured })}
 className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors ${
 form.featured
 ? 'bg-yellow-400/15 border-yellow-400/30 text-yellow-300'
 : 'bg-darkcard border-darkborder text-text-muted'
 }`}
 >
 {form.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
 {form.featured ? 'Đã đánh dấu' : 'Chưa đánh dấu'}
 </button>
 </div>
 </Field>
 <Field label="Vai trò">
 <input
 type="text"
 value={form.role}
 onChange={(e) => setForm({ ...form, role: e.target.value })}
 className={inputCls}
 placeholder="VD: Full-stack Developer"
 />
 </Field>
 <Field label="Thời lượng">
 <input
 type="text"
 value={form.duration}
 onChange={(e) => setForm({ ...form, duration: e.target.value })}
 className={inputCls}
 placeholder="VD: 2 tháng"
 />
 </Field>
 <Field label="Ngày bắt đầu">
 <input
 type="date"
 value={form.startDate}
 onChange={(e) => setForm({ ...form, startDate: e.target.value })}
 className={inputCls}
 />
 </Field>
 <Field label="Ngày kết thúc">
 <input
 type="date"
 value={form.endDate}
 onChange={(e) => setForm({ ...form, endDate: e.target.value })}
 className={inputCls}
 />
 </Field>
 </div>
 </Section>

 {/* ─── Section: URLs & media ──────────────────────── */}
 <Section icon={ExternalLink} title="URLs & media">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <Field label="Live URL">
 <input type="url" value={form.projectUrl} onChange={(e) => setForm({ ...form, projectUrl: e.target.value })} className={inputCls} placeholder="https://…" />
 </Field>
 <Field label="GitHub URL">
 <input type="url" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className={inputCls} placeholder="https://github.com/…" />
 </Field>
 <Field label="YouTube demo URL">
 <input type="url" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className={inputCls} placeholder="https://youtu.be/…" />
 </Field>
 </div>
 <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
 <Field label="Thumbnail">
 <ThumbnailUploader
 value={form.thumbnailUrl}
 onChange={(url) => setForm({ ...form, thumbnailUrl: url })}
 />
 </Field>
 <Field label="Gallery (nhiều ảnh)">
 <MultiImageUploader
 images={form.images}
 onChange={(images) => setForm({ ...form, images })}
 maxImages={10}
 />
 </Field>
 </div>
 </Section>

 {/* ─── Section: Categorisation & tech ─────────────── */}
 <Section icon={Tag} title="Phân loại & công nghệ">
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <Field label="Danh mục">
 <select
 value={form.category}
 onChange={(e) => setForm({ ...form, category: e.target.value })}
 className={`${inputCls} cursor-pointer`}
 >
 <option value="">— Chọn —</option>
 {CATEGORIES.map((c) => (
 <option key={c} value={c}>{c}</option>
 ))}
 </select>
 </Field>
 <Field label="Độ khó">
 <select
 value={form.difficulty}
 onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
 className={`${inputCls} cursor-pointer`}
 >
 <option value="">— Chọn —</option>
 {DIFFICULTIES.map((d) => (
 <option key={d.value} value={d.value}>{d.label}</option>
 ))}
 </select>
 </Field>
 <Field label="Công nghệ (phẩy)">
 <input
 type="text"
 value={form.technologies.join(', ')}
 onChange={(e) => setForm({ ...form, technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
 className={inputCls}
 placeholder="React, Node.js, Postgres"
 />
 </Field>
 </div>
 </Section>

 {/* ─── Section: Case Study (markdown) ──────────────── */}
 <Section icon={BookOpen} title="Case Study (Markdown)">
 <p className="text-xs text-text-muted mb-3">
 Hỗ trợ GFM, code highlight, callout (
 <code className="text-neon-violet">:::tip</code> / <code className="text-neon-violet">:::note</code> / <code className="text-neon-violet">:::warning</code> / <code className="text-neon-violet">:::danger</code>). Server render → cache <code className="text-neon-violet">bodyHtml</code> sau khi lưu.
 </p>
 <MarkdownEditor
 value={form.bodyMdx}
 onChange={(v) => setForm({ ...form, bodyMdx: v })}
 placeholder="Viết case study chi tiết tại đây…"
 />
 <details className="mt-3">
 <summary className="text-xs text-text-muted cursor-pointer hover:text-text-primary">
 Nội dung legacy (content field) — dùng cho fallback khi bodyMdx trống
 </summary>
 <textarea
 value={form.content}
 onChange={(e) => setForm({ ...form, content: e.target.value })}
 rows={3}
 className={`${inputCls} mt-2 font-mono text-xs resize-none`}
 placeholder="(Tuỳ chọn) Nội dung cũ, fallback nếu bodyMdx trống."
 />
 </details>
 </Section>

 {/* ─── Section: Database schema ───────────────────── */}
 <Section icon={Database} title="Database schema (optional)">
 <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
 <div className="sm:col-span-3">
 <textarea
 value={form.schemaCode}
 onChange={(e) => setForm({ ...form, schemaCode: e.target.value })}
 rows={6}
 className={`${inputCls} font-mono text-xs resize-none`}
 placeholder="model Project { … }"
 />
 </div>
 <Field label="Ngôn ngữ">
 <select
 value={form.schemaLang}
 onChange={(e) => setForm({ ...form, schemaLang: e.target.value })}
 className={`${inputCls} cursor-pointer`}
 >
 {SCHEMA_LANGS.map((l) => (
 <option key={l} value={l}>{l}</option>
 ))}
 </select>
 </Field>
 </div>
 </Section>

 {/* ─── Section: Milestones ────────────────────────── */}
 <Section icon={Layers} title="Lộ trình phát triển (Milestones)">
 <SaveableSection
 sectionKey="milestones"
 current={milestones}
 serverItems={project.milestones ?? []}
 onSaved={(items) => {
 setProject((prev) => prev ? { ...prev, milestones: items } : prev);
 }}
 onRevert={() => setMilestones(project.milestones ?? [])}
 saveFn={async (items: ProjectMilestone[]) => saveChildList('milestones', items, project, projectId, (next) => setMilestones(next as ProjectMilestone[])) as Promise<ProjectMilestone[]>}
 >
 <MilestonesEditor milestones={milestones} onChange={setMilestones} />
 </SaveableSection>
 </Section>

 {/* ─── Section: Features ──────────────────────────── */}
 <Section icon={ListChecks} title="Tính năng chính (Features)">
 <SaveableSection
 sectionKey="features"
 current={features}
 serverItems={project.features ?? []}
 onSaved={(items) => {
 setProject((prev) => prev ? { ...prev, features: items } : prev);
 }}
 onRevert={() => setFeatures(project.features ?? [])}
 saveFn={async (items: ProjectFeature[]) => saveChildList('features', items, project, projectId, (next) => setFeatures(next as ProjectFeature[])) as Promise<ProjectFeature[]>}
 >
 <FeaturesEditor features={features} onChange={setFeatures} />
 </SaveableSection>
 </Section>

 {/* ─── Section: Resources ─────────────────────────── */}
 <Section icon={Download} title="Tài nguyên tham khảo (Resources)">
 <SaveableSection
 sectionKey="resources"
 current={resources}
 serverItems={project.resources ?? []}
 onSaved={(items) => {
 setProject((prev) => prev ? { ...prev, resources: items } : prev);
 }}
 onRevert={() => setResources(project.resources ?? [])}
 saveFn={async (items: ProjectResource[]) => saveChildList('resources', items, project, projectId, (next) => setResources(next as ProjectResource[])) as Promise<ProjectResource[]>}
 >
 <ResourcesEditor resources={resources} onChange={setResources} />
 </SaveableSection>
 </Section>

 <div className="text-xs text-text-muted text-center">
 ID: {project.id} • Tạo: {new Date(project.createdAt).toLocaleString('vi-VN')}
 </div>
 </div>
 );
}

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────

function Section({
 icon: Icon,
 title,
 children,
}: {
 icon: typeof BookOpen;
 title: string;
 children: React.ReactNode;
}) {
 return (
 <motion.section
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.2 }}
 className="rounded-2xl border border-darkborder bg-darkcard p-5"
 >
 <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
 <Icon className="w-4 h-4 text-neon-violet" />
 {title}
 </h2>
 {children}
 </motion.section>
 );
}

function Field({
 label,
 required,
 children,
}: {
 label: string;
 required?: boolean;
 children: React.ReactNode;
}) {
 return (
 <div>
 <label className="block text-xs font-medium text-text-secondary mb-1.5">
 {label}
 {required && <span className="text-red-400 ml-0.5">*</span>}
 </label>
 {children}
 </div>
 );
}

const inputCls =
 'w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors';

function SaveIndicator({ status, lastSavedAt }: { status: SaveStatus; lastSavedAt: Date | null }) {
 if (status === 'saving') {
 return (
 <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
 <Loader2 className="w-3.5 h-3.5 animate-spin" />
 Đang lưu…
 </span>
 );
 }
 if (status === 'error') {
 return (
 <span className="inline-flex items-center gap-1.5 text-xs text-red-400">
 <AlertCircle className="w-3.5 h-3.5" />
 Lỗi
 </span>
 );
 }
 if (status === 'saved' || lastSavedAt) {
 return (
 <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
 <CheckCircle2 className="w-3.5 h-3.5" />
 Đã lưu{lastSavedAt ? ` ${lastSavedAt.toLocaleTimeString('vi-VN')}` : ''}
 </span>
 );
 }
 return null;
}

/**
 * SaveableSection wraps a child-entity editor with a "Lưu
 * danh sách" button. The diff strategy: compare the working
 * copy to the server copy by id. Items in the working copy
 * that don't exist on the server are POSTed; items on the
 * server that no longer appear in the working copy are
 * DELETEd; items that exist in both are PUT with the
 * current values.
 *
 * We sequence the requests (POST → PUT → DELETE) so a
 * mid-loop failure leaves the server in a recoverable
 * state. The page's autosave keeps the parent in sync via
 * the onSaved callback.
 */
function SaveableSection<T extends { id: number }>({
 sectionKey,
 current,
 serverItems,
 onSaved,
 onRevert,
 saveFn,
 children,
}: {
 sectionKey: string;
 current: T[];
 serverItems: T[];
 onSaved: (items: T[]) => void;
 onRevert: () => void;
 saveFn: (items: T[]) => Promise<T[]>;
 children: React.ReactNode;
}) {
 const [saving, setSaving] = useState(false);
 const [dirty, setDirty] = useState(false);

 // Re-detect dirty whenever the working copy changes.
 useEffect(() => {
 setDirty(JSON.stringify(current) !== JSON.stringify(serverItems));
 }, [current, serverItems]);

 const onSave = async () => {
 setSaving(true);
 try {
 const result = await saveFn(current);
 onSaved(result);
 setDirty(false);
 toast.success(`Đã lưu ${sectionKey}`);
 } catch (err: unknown) {
 toast.error(`Lưu ${sectionKey} thất bại`);
 } finally {
 setSaving(false);
 }
 };

 return (
 <div>
 {children}
 <div className="flex items-center justify-between mt-4">
 <p className="text-xs text-text-muted">
 {dirty ? (
 <span className="text-yellow-400">● Có thay đổi chưa lưu</span>
 ) : (
 <span>● Đã đồng bộ với server</span>
 )}
 </p>
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={onRevert}
 disabled={!dirty || saving}
 className="px-3 py-1.5 text-xs rounded-lg border border-darkborder text-text-muted hover:text-text-primary hover:border-neon-violet/30 transition-colors disabled:opacity-40"
 >
 <X className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
 Hủy thay đổi
 </button>
 <button
 type="button"
 onClick={onSave}
 disabled={!dirty || saving}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-gradient-to-r from-neon-indigo to-neon-violet text-white hover:opacity-90 transition-opacity disabled:opacity-40"
 >
 {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
 Lưu danh sách
 </button>
 </div>
 </div>
 </div>
 );
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

/**
 * Convert the working form into a payload that matches the
 * admin PUT /projects/:id contract. The legacy `techStack`
 * is computed from the technologies array (CSV) so we don't
 * drop backwards-compat behaviour.
 */
function buildPayload(
 form: FormState,
 project: Project,
 opts: { setIsPublishedFalse: boolean },
): Record<string, unknown> {
 return {
 title: form.title,
 description: form.description,
 content: form.content || null,
 status: form.status,
 isFeatured: form.featured,
 projectUrl: form.projectUrl || null,
 githubUrl: form.githubUrl || null,
 videoUrl: form.videoUrl || null,
 thumbnailUrl: form.thumbnailUrl || null,
 images: form.images,
 techStack: form.technologies.join(', '),
 role: form.role || null,
 duration: form.duration || null,
 startDate: form.startDate || null,
 endDate: form.endDate || null,
 category: form.category || null,
 difficulty: form.difficulty || null,
 bodyMdx: form.bodyMdx || null,
 schemaCode: form.schemaCode || null,
 schemaLang: form.schemaLang || null,
 isPublished: opts.setIsPublishedFalse ? false : project.isPublished,
 };
}

/**
 * Diff-based save for a child entity list. Compares by id,
 * fires POST for additions, PUT for edits, DELETE for
 * removals. Returns the canonical list as the server sees
 * it so the parent state can be updated.
 *
 * The generic `T` is the union of all three child types.
 * We cast at the boundary because TS can't infer `T` from
 * `project[section]` (which is a property of a union of
 * discriminated values). The runtime shape is identical.
 */
async function saveChildList(
 section: 'milestones' | 'features' | 'resources',
 working: Array<{ id: number }>,
 project: Project,
 projectId: number,
 setLocal: (next: Array<{ id: number }>) => void,
): Promise<Array<{ id: number }>> {
 const serverList = (project[section] ?? []) as Array<{ id: number }>;
 const serverIds = new Set(serverList.map((x) => x.id));
 const workingIds = new Set(working.map((x) => x.id));

 const adds = working.filter((x) => !serverIds.has(x.id) && x.id < 0);
 const removes = serverList.filter((x) => !workingIds.has(x.id));
 const edits = working.filter((x) => serverIds.has(x.id) && x.id > 0);

 const newItems: Array<{ id: number }> = [];
 for (const it of adds) {
 // strip the negative placeholder id
 const { id: _omit, ...payload } = it;
 const res = await api.post(`/admin/projects/${projectId}/${section}`, payload);
 newItems.push(res.data?.data as { id: number });
 }
 for (const it of edits) {
 const res = await api.put(`/admin/projects/${projectId}/${section}/${it.id}`, it);
 newItems.push(res.data?.data as { id: number });
 }
 for (const it of removes) {
 await api.delete(`/admin/projects/${projectId}/${section}/${it.id}`);
 }

 // Build the canonical list: keep negatives in place for
 // any adds that failed (UI keeps them in the editor for
 // retry), then the new + edited items.
 const canonical: Array<{ id: number }> = [
 ...working.filter((x) => x.id < 0),
 ...newItems,
 ];

 // Replace local state so the diff-vs-server check resets.
 setLocal(canonical);
 return canonical;
}