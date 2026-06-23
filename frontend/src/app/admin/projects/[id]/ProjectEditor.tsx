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
 GraduationCap,
 Trophy,
 Target,
} from 'lucide-react';
import { api } from '@/lib/api';
import type {
 Project,
 ProjectMilestone,
 ProjectFeature,
 ProjectResource,
 ProjectListItem,
} from '@/types';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import MilestonesEditor from '@/components/admin/MilestonesEditor';
import CodeBlock from '@/components/projects/CodeBlock';
import FeaturesEditor from '@/components/admin/FeaturesEditor';
import ResourcesEditor from '@/components/admin/ResourcesEditor';
import ListItemEditor from '@/components/admin/ListItemEditor';
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

// The three list-of-strings sections share a single DB table
// (project_list_items) but each has its own visual treatment
// in the editor + the public page. The `sectionKey` flows
// through SaveableSection to the toast message ("Đã lưu
// core-knowledge"). The icon drives the section header.
const LIST_KIND_META: Record<
 'CORE_KNOWLEDGE' | 'PORTFOLIO_BONUS' | 'COMPLETION_OUTCOME',
 { title: string; sectionKey: string; icon: typeof BookOpen }
> = {
 CORE_KNOWLEDGE: {
 title: 'Kiến thức cần học vững (Core Knowledge)',
 sectionKey: 'core-knowledge',
 icon: GraduationCap,
 },
 PORTFOLIO_BONUS: {
 title: 'Điểm cộng cho portfolio (Bonus Points)',
 sectionKey: 'portfolio-bonus',
 icon: Trophy,
 },
 COMPLETION_OUTCOME: {
 title: 'Đánh giá sau khi hoàn thành (Outcomes)',
 sectionKey: 'completion-outcome',
 icon: Target,
 },
};

/**
 * ProjectEditor — admin editor page for a single project.
 *
 * Architecture:
 * • One load at mount (GET /admin/projects/:id) hydrates the
 * whole form (basic fields + 4 child lists: milestones,
 * features, resources, list items) in a single round-trip.
 * • The "Basic + Case Study" section autosaves 2s after the
 * last edit (debounced). Autosave preserves isPublished —
 * the only place that flips the flag is the explicit
 * "Đăng" / "Bỏ đăng" toggle or the "Lưu + Xuất bản"
 * button in the header. This was a bug previously:
 * autosave used to flip isPublished=false on every save,
 * which made "Lưu" unusable as a save-only action.
 * • Child entity sections (milestones/features/resources/
 * list items) each have their own explicit "Lưu danh sách"
 * button because per-item CRUD is a separate request and
 * we don't want to spam POSTs on every keystroke. The save
 * handler is diff-based and idempotent: POSTs only the new
 * items (negative placeholder id), PUTs only the edits,
 * DELETEs only the removals. Saving the same list twice
 * with no changes is a no-op.
 * • "Lưu + Xuất bản" runs the main save first (flushing
 * any pending autosave debounce), then flips isPublished
 * to true in a second PUT.
 */
export default function ProjectEditor({ projectId }: ProjectEditorProps) {
 const router = useRouter();
 const [loading, setLoading] = useState(true);
 const [project, setProject] = useState<Project | null>(null);
 const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
 const [features, setFeatures] = useState<ProjectFeature[]>([]);
 const [resources, setResources] = useState<ProjectResource[]>([]);
 // Three list-of-strings sections (Core Knowledge / Portfolio
 // Bonus / Completion Outcomes). All three live in the same
 // DB table, partitioned by `kind`. The editor filters the
 // shared listItems state per kind when passing to each
 // ListItemEditor instance.
 const [listItems, setListItems] = useState<ProjectListItem[]>([]);

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
 setListItems(p.listItems ?? []);
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
 //
 // Important: autosave preserves the current isPublished
 // value. Previously this handler sent isPublished:false on
 // every save, which made "Lưu" silently un-publish the
 // project. The publish flow is now driven entirely by
 // the explicit "Đăng" / "Bỏ đăng" toggle or the
 // "Lưu + Xuất bản" button — see togglePublish() below.
 const performSave = useCallback(async () => {
 if (!form || !project) return;
 setSaveStatus('saving');
 try {
 // buildPayload keeps the legacy `content` field in sync
 // (it's still served on /projects list cards and used as
 // the bodyMdx fallback for projects that pre-date the
 // migration). isPublished is included in the payload
 // only as a *field pass-through* — we read it from `form`
 // (the canonical state) rather than flipping it here.
 const payload = buildPayload(form, project);
 const res = await api.put(`/admin/projects/${projectId}`, payload);
 setProject((prev) => prev ? { ...prev, ...(res.data?.data as Project) } : prev);
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
 // First flush any pending autosave debounce so the
 // published version reflects the latest field edits, then
 // flip isPublished=true in a second PUT. The two-step
 // pattern (save → publish) avoids races where a pending
 // autosave PUT could overwrite the publish PUT with the
 // stale isPublished=false.
 const publish = useCallback(async () => {
 if (!form || !project) return;
 // Cancel any pending debounce so it doesn't fire a
 // third PUT after ours.
 if (debounceRef.current) {
 clearTimeout(debounceRef.current);
 debounceRef.current = null;
 }
 setSaveStatus('saving');
 try {
 // 1) Save the latest field state with the current
 // isPublished (so we don't accidentally un-publish).
 const basePayload = buildPayload(form, project);
 await api.put(`/admin/projects/${projectId}`, basePayload);
 // 2) Now flip isPublished=true in a second PUT.
 const res = await api.put(`/admin/projects/${projectId}`, { isPublished: true });
 setProject((prev) => prev ? { ...prev, ...(res.data?.data as Project) } : prev);
 setForm((f) => f ? { ...f, isPublished: true } : f);
 setLastSavedAt(new Date());
 setSaveStatus('saved');
 toast.success('Đã xuất bản');
 setTimeout(() => setSaveStatus('idle'), 2200);
 } catch (err: unknown) {
 setSaveStatus('error');
 const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
 ?? 'Xuất bản thất bại';
 toast.error(msg);
 }
 }, [form, project, projectId]);

 // ─── Toggle publish (fast switch, no save) ────────────
 // When the admin just wants to flip visibility without
 // going through the full save flow, this button sends a
 // minimal PUT with only isPublished toggled. It does NOT
 // touch any other field. Useful when the user is mid-edit
 // and wants to peek at the public page.
 const togglePublish = useCallback(async () => {
 if (!project) return;
 const next = !project.isPublished;
 setSaveStatus('saving');
 try {
 const res = await api.put(`/admin/projects/${projectId}`, { isPublished: next });
 setProject((prev) => prev ? { ...prev, ...(res.data?.data as Project) } : prev);
 setForm((f) => f ? { ...f, isPublished: next } : f);
 setLastSavedAt(new Date());
 setSaveStatus('saved');
 toast.success(next ? 'Đã đăng dự án' : 'Đã chuyển về bản nháp');
 setTimeout(() => setSaveStatus('idle'), 2200);
 } catch (err: unknown) {
 setSaveStatus('error');
 const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
 ?? 'Thao tác thất bại';
 toast.error(msg);
 }
 }, [project, projectId]);

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
 {/*
 Visibility toggle — single button that flips
 isPublished without going through the full save flow.
 Distinct from "Lưu + Xuất bản" (which also flushes
 pending field edits).
 */}
 <button
 type="button"
 onClick={() => void togglePublish()}
 disabled={saveStatus === 'saving'}
 title={project.isPublished ? 'Chuyển về bản nháp' : 'Đăng dự án lên trang công khai'}
 className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors disabled:opacity-50 ${
 project.isPublished
 ? 'border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/10'
 : 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10'
 }`}
 >
 {project.isPublished ? (
 <>
 <StarOff className="w-3.5 h-3.5" />
 Bản nháp
 </>
 ) : (
 <>
 <Star className="w-3.5 h-3.5" />
 Đăng
 </>
 )}
 </button>
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
 disabled={saveStatus === 'saving'}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-darkcard border border-darkborder text-text-secondary hover:text-text-primary hover:border-neon-violet/30 transition-colors disabled:opacity-50"
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
 {project.isPublished ? 'Lưu + Xuất bản lại' : 'Lưu + Xuất bản'}
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
 {/* Live preview: same Shiki-based <CodeBlock /> the
 public detail page uses, so what the admin sees matches
 the visitor's view 1:1. Hidden when there's no code
 yet so the section doesn't take up space. */}
 {form.schemaCode && form.schemaCode.trim() && (
 <div className="mt-3">
 <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5">
 Preview (giống trang public)
 </div>
 <CodeBlock
 code={form.schemaCode}
 language={form.schemaLang || 'prisma'}
 fileName="schema"
 />
 </div>
 )}
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
 saveFn={async (items: ProjectMilestone[]) => saveChildList('milestones', items, project, projectId, (next) => setMilestones(next as ProjectMilestone[]), 'milestones') as Promise<ProjectMilestone[]>}
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
 saveFn={async (items: ProjectFeature[]) => saveChildList('features', items, project, projectId, (next) => setFeatures(next as ProjectFeature[]), 'features') as Promise<ProjectFeature[]>}
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
 saveFn={async (items: ProjectResource[]) => saveChildList('resources', items, project, projectId, (next) => setResources(next as ProjectResource[]), 'resources') as Promise<ProjectResource[]>}
 >
 <ResourcesEditor resources={resources} onChange={setResources} />
 </SaveableSection>
 </Section>

 {/*
 ─── 3 list-of-strings sections (Core Knowledge / Portfolio
 Bonus / Completion Outcomes) ───
 All three share the same DB table (project_list_items)
 partitioned by `kind`. We use a local `setListItemsForKind`
 closure that filters the working list by kind, calls the
 shared saveChildList helper, then merges the canonical
 result back into the parent state.
 */}
 {(['CORE_KNOWLEDGE', 'PORTFOLIO_BONUS', 'COMPLETION_OUTCOME'] as const).map((kind) => {
 const cfg = LIST_KIND_META[kind];
 const itemsForKind = listItems.filter((x) => x.kind === kind);
 return (
 <Section key={kind} icon={cfg.icon} title={cfg.title}>
 <SaveableSection
 sectionKey={cfg.sectionKey}
 current={itemsForKind}
 serverItems={project.listItems?.filter((x) => x.kind === kind) ?? []}
 onSaved={(saved) => {
 // Replace just the items of this kind in the parent
 // listItems state. Items of other kinds are preserved.
 setListItems((prev) => {
 const other = prev.filter((x) => x.kind !== kind);
 return [...other, ...saved];
 });
 }}
 onRevert={() => {
 // Re-sync items of this kind from the server snapshot.
 setListItems((prev) => {
 const other = prev.filter((x) => x.kind !== kind);
 const server = project.listItems?.filter((x) => x.kind === kind) ?? [];
 return [...other, ...server];
 });
 }}
 saveFn={async (next) => {
 // The list-item POST endpoint requires `kind` in the
 // body. We strip it from the working copy (where it's
 // redundant — the section already knows its own kind)
 // and re-inject it via `extraPostFields` so the server
 // gets the discriminator.
 const payload = next.map(({ kind: _kind, ...rest }) => rest) as ProjectListItem[];
 const result = await saveChildList<ProjectListItem>(
 'list-items',
 payload,
 project,
 projectId,
 // setLocal here is a no-op: the canonical list is
 // returned separately and the parent's onSaved callback
 // splices it into the full listItems state.
 () => undefined,
 'listItems',
 // Inject the kind on every POST so the server can
 // route the row into the right partition.
 () => ({ kind }),
 );
 return result;
 }}
 >
 <ListItemEditor
 items={itemsForKind}
 kind={kind}
 onChange={(next) => {
 // When the child editor mutates the list, splice the
 // updated slice back into the parent state.
 setListItems((prev) => {
 const other = prev.filter((x) => x.kind !== kind);
 return [...other, ...next];
 });
 }}
 />
 </SaveableSection>
 </Section>
 );
 })}

 <div className="text-xs text-text-muted text-center">
 ID: {project.id} • Tạo: {new Date(project.createdAt).toLocaleString('vi-VN')}
 </div>
 </div>
 );

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────

}

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
 _project: Project,
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
 // isPublished is taken from `form` (the canonical state) so
 // autosave never silently flips the publish flag. The user
 // drives the flag explicitly via togglePublish() or
 // publish().
 isPublished: form.isPublished,
 };
}

/**
 * Diff-based save for a child entity list. Compares by id,
 * fires POST for additions, PUT for edits, DELETE for
 * removals. Returns the canonical list as the server sees
 * it so the parent state can be updated.
 *
 * The generic `T` is the union of all four child types
 * (milestones, features, resources, list items). We cast
 * at the boundary because TS can't infer `T` from
 * `project[section]` (which is a property of a union of
 * discriminated values). The runtime shape is identical.
 *
 * IDEMPOTENCY: saving the same list twice with no changes
 * is a no-op. The diff uses stable item ids, so:
 * • unchanged items → 0 PUT, 0 POST, 0 DELETE
 * • items present on server but not in working → DELETE
 * • items in working with id < 0 → POST (strip placeholder)
 * • items in working with id > 0 and field values changed
 * from server → PUT
 * • items in working with id > 0 but field values UNCHANGED
 * from server → no-op (preserves order/index from `working`)
 *
 * This is the fix for the previous bug where the canonical
 * list returned to the parent only contained POST/PUT
 * responses, dropping every item the user didn't touch.
 * After that bug, the parent's `project[section]` only
 * held the changed items, so the *next* save treated the
 * missing items as "removes" — and if the user re-added
 * them, the server ended up with duplicates.
 *
 * The fix preserves the working list's order for unchanged
 * items (since the user might have drag-reordered them) and
 * splices in the new server response for freshly created
 * items at the index where the placeholder used to live.
 */
async function saveChildList<T extends { id: number }>(
 // `section` is the API path segment (kebab-case). The
 // corresponding field on `project` is camelCase (see the
 // `projectField` parameter below).
 section: 'milestones' | 'features' | 'resources' | 'list-items',
 working: T[],
 project: Project,
 projectId: number,
 setLocal: (next: T[]) => void,
 // The matching field name on `project` for this section.
 // Required because TS doesn't allow indexing by a string
 // literal union with mixed casing (camelCase keys vs
 // kebab-case URL segments).
 projectField: 'milestones' | 'features' | 'resources' | 'listItems',
 // Optional hook called for every POST payload so the
 // caller can inject extra fields the server expects but
 // that don't belong in the working copy. We use it for
 // list items: the `kind` discriminator isn't in the
 // editor's working copy because the section already
 // knows its own kind.
 extraPostFields?: (item: T) => Record<string, unknown>,
): Promise<T[]> {
 const serverList = (project[projectField] ?? []) as unknown as T[];
 // Build a map by id so we can do a fast lookup of the
 // server version of each working item. The diff uses the
 // working list as the source of truth for order and for
 // field values, then patches in the server response for
 // freshly POSTed rows (which only differ by the auto-
 // generated id and createdAt).
 const serverById = new Map<number, T>();
 for (const s of serverList) serverById.set(s.id, s);

 const workingIds = new Set(working.map((x) => x.id));
 const serverIds = new Set(serverList.map((x) => x.id));

 // 1) Removals: server rows that no longer appear in the
 // working list. Delete in reverse-id order so the UI
 // doesn't see intermediate "ghost" rows.
 const removes = serverList.filter((x) => !workingIds.has(x.id));
 for (const it of removes) {
 await api.delete(`/admin/projects/${projectId}/${section}/${it.id}`);
 serverById.delete(it.id);
 }

 // 2) Walk the working list in order, decide per-item:
 // • negative id → POST then splice in the server response
 // • positive id present in server → PUT if changed, else keep
 // • positive id NOT in server → POST (the user re-added an
 // item the server had already lost — unlikely but
 // possible if a previous save partially failed).
 const canonical: T[] = [];
 for (const it of working) {
 if (it.id < 0) {
 const { id: _omit, ...payload } = it as T & { id: number };
 const extra = extraPostFields ? extraPostFields(it) : {};
 const res = await api.post(
 `/admin/projects/${projectId}/${section}`,
 { ...payload, ...extra } as unknown as Record<string, unknown>,
 );
 // The response is the canonical row from the server.
 // We replace the negative placeholder in the working
 // list with this server response — same field shape
 // (TS-wise) and now has a real positive id.
 const serverItem = (res.data?.data as T) ?? ({ ...(it as T), id: Math.abs(it.id) } as T);
 canonical.push(serverItem);
 serverById.set(serverItem.id, serverItem);
 } else if (serverById.has(it.id)) {
 // Re-check against the server snapshot. If the user
 // didn't change anything, skip the PUT entirely so
 // we don't burn an UPDATE for no reason. Equality is
 // JSON-based because child items are flat objects.
 const server = serverById.get(it.id)!;
 if (JSON.stringify(it) !== JSON.stringify(server)) {
 const res = await api.put(
 `/admin/projects/${projectId}/${section}/${it.id}`,
 it as unknown as Record<string, unknown>,
 );
 const serverItem = (res.data?.data as T) ?? it;
 canonical.push(serverItem);
 } else {
 // Unchanged — keep the working copy (it preserves
 // the user's intended order vs the server's order).
 canonical.push(it);
 }
 } else {
 // Positive id in working but not on server — POST
 // (we don't have a way to PUT to a non-existent row).
 const { id: _omit, ...payload } = it as T & { id: number };
 const extra = extraPostFields ? extraPostFields(it) : {};
 const res = await api.post(
 `/admin/projects/${projectId}/${section}`,
 { ...payload, ...extra } as unknown as Record<string, unknown>,
 );
 const serverItem = (res.data?.data as T) ?? it;
 canonical.push(serverItem);
 }
 }

 setLocal(canonical);
 return canonical;
}
