'use client';

import { useState, useEffect, useCallback, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Save,
  Sparkles,
  Code2,
  Upload,
  Loader2,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { adminTechTrendsApi, type AdminTechTrendArticle } from '@/lib/api';
import type { Category, ArticleCodeBlock } from '@/app/tech-trends/types';
import TechArticleEditor from '@/components/tech-trends/TechArticleEditor';

const CATEGORIES: Category[] = ['TechNews', 'FixBug', 'Experience', 'Interviews'];

const CATEGORY_STYLES: Record<Category, { bg: string; text: string; border: string; emoji: string }> = {
  TechNews:   { bg: 'bg-neon-emerald/10',  text: 'text-neon-emerald',  border: 'border-neon-emerald/20',  emoji: '📰' },
  FixBug:     { bg: 'bg-neon-red/10',       text: 'text-neon-red',       border: 'border-neon-red/20',       emoji: '🐛' },
  Experience: { bg: 'bg-neon-cyan/10',      text: 'text-neon-cyan',      border: 'border-neon-cyan/20',      emoji: '💼' },
  Interviews: { bg: 'bg-neon-fuchsia/10',   text: 'text-neon-fuchsia',   border: 'border-neon-fuchsia/20',   emoji: '🎯' },
};

const LANGS = ['tsx', 'ts', 'js', 'java', 'bash', 'json', 'css', 'html', 'sql'] as const;

// Form state for the create/edit modal. We keep it loose on
// the codeBlock field (it can be null). `bodyMdx` is the
// canonical rich-body source (Tier 1A — TipTap / Markdown).
// The server renders it to bodyHtml + toc at write time.
type ArticleForm = {
  title: string;
  summary: string;
  bodyMdx: string;
  category: Category;
  coverEmoji: string;
  coverImageUrl: string;
  tagsCsv: string;    // comma-separated in the UI, joined on save
  trendingScore: number;
  isFeatured: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  readTimeMin: number;
  // Code block (FixBug only — left null for other categories)
  hasCodeBlock: boolean;
  codeLang: string;
  beforeCode: string;
  afterCode: string;
  takeaway: string;
};

const emptyForm: ArticleForm = {
  title: '',
  summary: '',
  bodyMdx: '',
  category: 'TechNews',
  coverEmoji: '',
  coverImageUrl: '',
  tagsCsv: '',
  trendingScore: 50,
  isFeatured: false,
  status: 'DRAFT',
  readTimeMin: 5,
  hasCodeBlock: false,
  codeLang: 'tsx',
  beforeCode: '',
  afterCode: '',
  takeaway: '',
};

function formFromArticle(a: AdminTechTrendArticle): ArticleForm {
  // Prefer the new bodyMdx; fall back to joining legacy
  // body[] paragraphs with blank lines so the editor has
  // something to load.
  const mdx = a.bodyMdx
    ?? (Array.isArray(a.body) ? (a.body as string[]).join('\n\n') : '');
  return {
    title: a.title,
    summary: a.summary,
    bodyMdx: mdx,
    category: a.category,
    coverEmoji: a.coverEmoji ?? '',
    coverImageUrl: a.coverImageUrl ?? '',
    tagsCsv: a.tags.join(', '),
    trendingScore: a.trendingScore,
    isFeatured: a.isFeatured,
    status: a.status,
    readTimeMin: a.readTimeMin,
    hasCodeBlock: a.codeBlock !== null,
    codeLang: a.codeBlock?.before.lang ?? 'tsx',
    beforeCode: a.codeBlock?.before.lines.join('\n') ?? '',
    afterCode: a.codeBlock?.after.lines.join('\n') ?? '',
    takeaway: a.codeBlock?.takeaway ?? '',
  };
}

function formToPayload(f: ArticleForm) {
  const tags = f.tagsCsv
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  // Tier 1A — bodyMdx is canonical. We still send the legacy
  // `body` array as empty (or, if the admin only typed
  // paragraphs without any rich formatting, we synthesise one
  // for backward compatibility with the pre-Tier 1A code that
  // may still read it). The server prefers bodyMdx when both
  // are present.
  const body = f.bodyMdx
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const codeBlock: ArticleCodeBlock | null = f.hasCodeBlock
    ? {
        before: {
          lang: f.codeLang,
          lines: f.beforeCode.split('\n'),
        },
        after: {
          lang: f.codeLang,
          lines: f.afterCode.split('\n'),
        },
        takeaway: f.takeaway.trim(),
      }
    : null;

  return {
    title: f.title.trim(),
    summary: f.summary.trim(),
    bodyMdx: f.bodyMdx,
    body,
    category: f.category,
    coverEmoji: f.coverEmoji.trim() || undefined,
    coverImageUrl: f.coverImageUrl.trim() || undefined,
    codeBlock: codeBlock ?? undefined,
    tags,
    trendingScore: Math.max(0, Math.min(100, Number(f.trendingScore) || 0)),
    isFeatured: f.isFeatured,
    status: f.status,
    readTimeMin: Math.max(1, Math.min(60, Number(f.readTimeMin) || 5)),
  };
}

export default function AdminTechTrendsPage() {
  const [articles, setArticles] = useState<AdminTechTrendArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | 'DRAFT' | 'PUBLISHED'>('');
  const [categoryFilter, setCategoryFilter] = useState<'' | Category>('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminTechTrendArticle | null>(null);
  const [form, setForm] = useState<ArticleForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminTechTrendArticle | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminTechTrendsApi.list({
        page,
        size: 20,
        q: search.trim() || undefined,
        status: statusFilter || undefined,
        category: categoryFilter || undefined,
      });
      setArticles(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setTotal(res.data.pagination.total);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load articles';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Reset to first page when any filter changes
  useEffect(() => { setPage(0); }, [search, statusFilter, categoryFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (a: AdminTechTrendArticle) => {
    setEditing(a);
    setForm(formFromArticle(a));
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.summary.trim()) {
      toast.error('Summary is required');
      return;
    }
    if (!form.bodyMdx.trim()) {
      toast.error('Body is required — write at least one paragraph');
      return;
    }
    setSaving(true);
    try {
      const payload = formToPayload(form);
      if (editing) {
        await adminTechTrendsApi.update(editing.id, payload);
        toast.success('Article updated');
      } else {
        await adminTechTrendsApi.create(payload);
        toast.success('Article created');
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      fetchArticles();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async (a: AdminTechTrendArticle) => {
    try {
      if (a.status === 'PUBLISHED') {
        await adminTechTrendsApi.unpublish(a.id);
        toast.success('Unpublished');
      } else {
        await adminTechTrendsApi.publish(a.id);
        toast.success('Published');
      }
      fetchArticles();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed';
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminTechTrendsApi.remove(deleteTarget.id);
      toast.success('Deleted');
      setDeleteTarget(null);
      fetchArticles();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete';
      toast.error(msg);
    }
  };

  // Cover image upload. Posts to /files/upload (the existing
  // upload endpoint) and writes the returned URL back into
  // the form. We use the same endpoint that the rest of the
  // app uses (admin/posts, admin/projects, etc.) so a single
  // S3 bucket / disk path serves every image type.
  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please pick an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large (max 10MB)');
      return;
    }
    setUploading(true);
    try {
      const res = await adminTechTrendsApi.uploadCover(file);
      setForm((f) => ({ ...f, coverImageUrl: res.data.data.url }));
      toast.success('Cover uploaded');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      toast.error(msg);
    } finally {
      setUploading(false);
      // Reset the input so the same file can be re-picked
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-neon-violet" />
            Tech Trends &amp; Insights
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Curate the long-form editorial content shown on{' '}
            <a href="/tech-trends" target="_blank" rel="noopener noreferrer" className="text-neon-violet hover:underline">
              /tech-trends
            </a>
            . Drafts are private; published articles are live immediately.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-semibold
            shadow-neon hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Article
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or summary..."
            className="w-full pl-10 pr-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="px-3 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50"
        >
          <option value="">All status</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as typeof categoryFilter)}
          className="px-3 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>#{c}</option>
          ))}
        </select>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total" value={total} accent="text-text-primary" />
        <StatCard
          label="Published"
          value={articles.filter((a) => a.status === 'PUBLISHED').length}
          accent="text-neon-emerald"
        />
        <StatCard
          label="Drafts"
          value={articles.filter((a) => a.status === 'DRAFT').length}
          accent="text-neon-orange"
        />
        <StatCard
          label="Featured"
          value={articles.filter((a) => a.isFeatured).length}
          accent="text-neon-fuchsia"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-darkcard/60 backdrop-blur-sm border border-darkborder overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-darkborder text-left text-xs uppercase tracking-wider text-text-muted">
                <th className="px-4 py-3 font-medium">Article</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Score</th>
                <th className="px-4 py-3 font-medium text-right">Views</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && articles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-text-muted">
                    <Loader2 className="w-5 h-5 mx-auto animate-spin text-neon-violet" />
                    <p className="mt-2">Loading articles…</p>
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-text-muted">
                    <p>No articles match the current filters.</p>
                    <button
                      onClick={openCreate}
                      className="mt-3 text-neon-violet hover:underline text-sm"
                    >
                      Create the first one
                    </button>
                  </td>
                </tr>
              ) : (
                articles.map((a) => (
                  <tr key={a.id} className="border-b border-darkborder/60 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 max-w-md">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-darkbg border border-darkborder flex items-center justify-center">
                          {a.coverImageUrl ? (
                            <img src={a.coverImageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">{a.coverEmoji || CATEGORY_STYLES[a.category].emoji}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-text-primary truncate">{a.title}</p>
                          <p className="text-xs text-text-muted truncate mt-0.5">{a.summary}</p>
                          {a.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {a.tags.slice(0, 3).map((t) => (
                                <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] text-text-muted">
                                  #{t}
                                </span>
                              ))}
                              {a.tags.length > 3 && (
                                <span className="text-[10px] text-text-muted">+{a.tags.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={[
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
                        CATEGORY_STYLES[a.category].bg,
                        CATEGORY_STYLES[a.category].text,
                        CATEGORY_STYLES[a.category].border,
                      ].join(' ')}>
                        {CATEGORY_STYLES[a.category].emoji} #{a.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handlePublishToggle(a)}
                        className={[
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
                          a.status === 'PUBLISHED'
                            ? 'bg-neon-emerald/10 text-neon-emerald border-neon-emerald/20 hover:bg-neon-emerald/15'
                            : 'bg-white/[0.04] text-text-muted border-darkborder hover:border-neon-orange/30 hover:text-neon-orange',
                        ].join(' ')}
                        title={a.status === 'PUBLISHED' ? 'Click to unpublish' : 'Click to publish'}
                      >
                        {a.status === 'PUBLISHED' ? (
                          <><Eye className="w-3 h-3" /> Published</>
                        ) : (
                          <><EyeOff className="w-3 h-3" /> Draft</>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className={[
                        'inline-flex items-center gap-1 text-xs font-semibold',
                        a.trendingScore >= 90 ? 'text-neon-orange' : a.trendingScore >= 70 ? 'text-neon-violet' : 'text-text-secondary',
                      ].join(' ')}>
                        {a.trendingScore >= 90 && <TrendingUp className="w-3 h-3" />}
                        {a.trendingScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-text-secondary text-xs">
                      {a.viewCount}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted whitespace-nowrap">
                      {formatDate(a.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEdit(a)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(a)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-darkborder text-sm">
            <span className="text-xs text-text-muted">
              Page {page + 1} of {totalPages} · {total} total
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit/Create modal */}
      <AnimatePresence>
        {showForm && (
          <ArticleFormModal
            form={form}
            setForm={setForm}
            editing={editing}
            saving={saving}
            uploading={uploading}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditing(null); setForm(emptyForm); }}
            onCoverUpload={handleCoverUpload}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <ConfirmModal
            title="Delete this article?"
            message={
              <>
                <span className="text-text-primary font-medium">“{deleteTarget.title}”</span> will
                be removed permanently from the database. This cannot be undone.
              </>
            }
            confirmLabel="Delete"
            onConfirm={handleDelete}
            onClose={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Form modal ──────────────────────────────────────────────

function ArticleFormModal({
  form,
  setForm,
  editing,
  saving,
  uploading,
  onSave,
  onClose,
  onCoverUpload,
}: {
  form: ArticleForm;
  setForm: (f: ArticleForm | ((p: ArticleForm) => ArticleForm)) => void;
  editing: AdminTechTrendArticle | null;
  saving: boolean;
  uploading: boolean;
  onSave: () => void;
  onClose: () => void;
  onCoverUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const update = <K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#0d0f18] border border-darkborder rounded-2xl shadow-2xl my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-darkborder">
          <div>
            <h2 className="text-lg font-heading font-semibold text-text-primary">
              {editing ? 'Edit Article' : 'New Article'}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {editing
                ? `Editing #${editing.id} — slug is preserved unless you change the title.`
                : 'A new article will be saved as a DRAFT unless you set status to PUBLISHED below.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-5">
          {/* Title + summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <FormField label="Title" required>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Why your Next.js server actions return undefined"
                />
              </FormField>
              <FormField label="Summary" required>
                <textarea
                  value={form.summary}
                  onChange={(e) => update('summary', e.target.value)}
                  rows={2}
                  className={inputClass + ' resize-y min-h-[60px]'}
                  placeholder="One-paragraph summary shown on the bento card."
                />
              </FormField>
            </div>
            <div className="space-y-3">
              <FormField label="Cover image">
                {form.coverImageUrl ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-darkborder bg-darkbg">
                    <img src={form.coverImageUrl} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => update('coverImageUrl', '')}
                      className="absolute top-1 right-1 p-1 rounded-md bg-black/60 text-white hover:bg-black/80"
                      title="Remove cover"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className={[
                    'flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed cursor-pointer',
                    'border-darkborder hover:border-neon-violet/50 transition-colors text-text-muted hover:text-text-primary',
                  ].join(' ')}>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onCoverUpload}
                      disabled={uploading}
                    />
                    {uploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mb-1" />
                        <span className="text-xs">Upload image</span>
                      </>
                    )}
                  </label>
                )}
              </FormField>
              <FormField label="Cover emoji (fallback)">
                <input
                  type="text"
                  value={form.coverEmoji}
                  onChange={(e) => update('coverEmoji', e.target.value)}
                  className={inputClass}
                  placeholder="⚛️  🐛  📰  ..."
                  maxLength={16}
                />
              </FormField>
            </div>
          </div>

          {/* Category + status + featured */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <FormField label="Category" required>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value as Category)}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_STYLES[c].emoji} #{c}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Status">
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value as 'DRAFT' | 'PUBLISHED')}
                className={inputClass}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </FormField>
            <FormField label="Read time (min)">
              <input
                type="number"
                min={1}
                max={60}
                value={form.readTimeMin}
                onChange={(e) => update('readTimeMin', Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
            <FormField label="Trending score (0-100)">
              <input
                type="number"
                min={0}
                max={100}
                value={form.trendingScore}
                onChange={(e) => update('trendingScore', Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
          </div>

          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => update('isFeatured', e.target.checked)}
              className="rounded border-darkborder bg-darkcard text-neon-violet focus:ring-neon-violet"
            />
            <span>Featured — span 2 columns in the bento grid</span>
          </label>

          {/* Body — Tier 1A TipTap WYSIWYG editor. Hydrates from
              `bodyMdx` (canonical markdown source); emits
              markdown on every change. The server renders the
              markdown to bodyHtml + toc on save. */}
          <FormField
            label="Body"
            required
            hint="Markdown được hỗ trợ: # heading, **bold**, - list, > quote, \`code\`. Server tự render sang HTML."
          >
            <TechArticleEditor
              value={form.bodyMdx}
              onChange={(md) => update('bodyMdx', md)}
              minHeight={420}
            />
          </FormField>

          {/* Tags */}
          <FormField label="Tags" hint="Comma-separated. e.g. React, BugFix, Performance">
            <input
              type="text"
              value={form.tagsCsv}
              onChange={(e) => update('tagsCsv', e.target.value)}
              className={inputClass}
              placeholder="React, Next.js, WebSocket"
            />
          </FormField>

          {/* Code block (optional) */}
          <div className="rounded-xl border border-darkborder bg-darkbg/50 overflow-hidden">
            <label className="flex items-center gap-2 px-4 py-3 text-sm text-text-secondary cursor-pointer hover:bg-white/[0.02]">
              <input
                type="checkbox"
                checked={form.hasCodeBlock}
                onChange={(e) => update('hasCodeBlock', e.target.checked)}
                className="rounded border-darkborder bg-darkcard text-neon-violet focus:ring-neon-violet"
              />
              <Code2 className="w-4 h-4 text-neon-violet" />
              <span className="font-medium text-text-primary">Include Before/After code block</span>
              <span className="text-xs text-text-muted ml-auto">Recommended for #FixBug posts</span>
            </label>
            <AnimatePresence>
              {form.hasCodeBlock && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3 border-t border-darkborder">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                      <FormField label="Language">
                        <select
                          value={form.codeLang}
                          onChange={(e) => update('codeLang', e.target.value)}
                          className={inputClass}
                        >
                          {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </FormField>
                      <FormField label="Takeaway">
                        <input
                          type="text"
                          value={form.takeaway}
                          onChange={(e) => update('takeaway', e.target.value)}
                          className={inputClass}
                          placeholder="The one-line lesson"
                        />
                      </FormField>
                    </div>
                    <FormField label="Before · Error">
                      <textarea
                        value={form.beforeCode}
                        onChange={(e) => update('beforeCode', e.target.value)}
                        rows={5}
                        className={inputClass + ' font-mono text-xs leading-relaxed resize-y min-h-[100px]'}
                        placeholder={'// buggy code here'}
                      />
                    </FormField>
                    <FormField label="After · Solution">
                      <textarea
                        value={form.afterCode}
                        onChange={(e) => update('afterCode', e.target.value)}
                        rows={5}
                        className={inputClass + ' font-mono text-xs leading-relaxed resize-y min-h-[100px]'}
                        placeholder={'// fixed code here'}
                      />
                    </FormField>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-darkborder bg-darkcard/50">
          <p className="text-xs text-text-muted">
            {editing
              ? `Last updated ${formatDate(editing.updatedAt)}`
              : 'New article — fill the required fields and save.'}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-semibold shadow-neon hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create article'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Reusable bits ────────────────────────────────────────────

function FormField({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-secondary mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-text-muted">{hint}</p>}
    </div>
  );
}

const inputClass = [
  'w-full px-3 py-2 bg-darkcard border border-darkborder rounded-lg',
  'text-sm text-text-primary placeholder:text-text-muted',
  'focus:outline-none focus:border-neon-violet/50 focus:ring-2 focus:ring-neon-violet/15',
  'transition-all',
].join(' ');

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-xl bg-darkcard/60 border border-darkborder p-4">
      <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
      <p className={['mt-1 text-2xl font-heading font-bold tabular-nums', accent].join(' ')}>
        {value}
      </p>
    </div>
  );
}

function ConfirmModal({
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#0d0f18] border border-darkborder rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-heading font-semibold text-text-primary">{title}</h3>
            <p className="mt-1 text-sm text-text-secondary leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/15 text-red-300 text-sm font-semibold hover:bg-red-500/25 active:scale-95 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Helpers ────────────────────────────────────────────────

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch {
    return iso;
  }
}
