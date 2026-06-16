'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Star, ExternalLink, Github, X, Trash2,
  Edit3, RefreshCw, Eye, EyeOff, Tag as TagIcon, Code2,
  AlertCircle, CheckCircle2, Sparkles, Download, RotateCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { githubApi, GithubRepo, GithubRepoTag } from '@/lib/api';

// ─── Admin GitHub Repo Hub ────────────────────────────────────────
//
// Two-pane layout: left = a form to add / edit a repo, right =
// a tabbed list of DRAFT and PUBLISHED repos with quick actions
// (publish, edit, delete). Below the list, a "Pull starred"
// action fetches the admin's recent GitHub stars and stages
// them as drafts.
//
// State is held locally; we refetch after every mutation. URL
// state would be nicer for deep-linking the active tab, but
// for v1 the simpler in-memory state keeps the file small.
// ──────────────────────────────────────────────────────────────────

type TabKey = 'ALL' | 'DRAFT' | 'PUBLISHED';

export default function AdminReposPage() {
  // ─── Data state ─────────────────────────────────────────────
  const [allTags, setAllTags] = useState<GithubRepoTag[]>([]);
  const [languages, setLanguages] = useState<{ name: string; count: number }[]>([]);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // ─── UI state ──────────────────────────────────────────────
  const [tab, setTab] = useState<TabKey>('ALL');
  const [search, setSearch] = useState('');
  const [editingRepo, setEditingRepo] = useState<GithubRepo | null>(null);
  const [showForm, setShowForm] = useState(false);

  // ─── Form state ────────────────────────────────────────────
  const [githubUrl, setGithubUrl] = useState('');
  const [review, setReview] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED');
  const [saving, setSaving] = useState(false);

  // ─── Starred-fetch state ──────────────────────────────────
  const [starredUsername, setStarredUsername] = useState('');
  const [fetchingStars, setFetchingStars] = useState(false);

  const fetchAbortRef = useRef<AbortController | null>(null);

  // ─── Loaders ───────────────────────────────────────────────
  const loadRepos = useCallback(async (activeTab: TabKey) => {
    fetchAbortRef.current?.abort();
    const controller = new AbortController();
    fetchAbortRef.current = controller;
    setLoading(true);
    try {
      // The /repos endpoint defaults to PUBLISHED. We need to
      // ask for DRAFTs explicitly when on the DRAFT tab, and
      // for the ALL view we just fetch all (admin sees both).
      const includeDrafts = activeTab !== 'PUBLISHED';
      const res = await githubApi.list({ pageSize: 50, includeDrafts });
      // Client-side filter: when the tab is DRAFT, drop the
      // PUBLISHED rows the backend returned (it returns both
      // when includeDrafts=true, per the route impl). When
      // tab is PUBLISHED, the backend already filters.
      let items = res.data.items;
      if (activeTab === 'DRAFT') {
        items = items.filter((r) => r.status === 'DRAFT');
      } else if (activeTab === 'PUBLISHED') {
        items = items.filter((r) => r.status === 'PUBLISHED');
      }
      setRepos(items);
      setTotal(items.length);
    } catch (err) {
      if ((err as { name?: string }).name === 'CanceledError') return;
      // eslint-disable-next-line no-console
      console.error('[admin-repos] load error', err);
      toast.error('Khong tai duoc danh sach repo');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFilters = useCallback(async () => {
    try {
      const [tags, langs] = await Promise.all([githubApi.tags(), githubApi.languages()]);
      setAllTags(tags.data.data);
      setLanguages(langs.data.data);
    } catch {
      // Non-fatal — the form is still usable without these.
    }
  }, []);

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  useEffect(() => {
    loadRepos(tab);
  }, [tab, loadRepos]);

  // ─── Form actions ─────────────────────────────────────────
  const resetForm = () => {
    setGithubUrl('');
    setReview('');
    setSelectedTagIds([]);
    setNewTagInput('');
    setStatus('PUBLISHED');
    setEditingRepo(null);
  };

  const openEdit = (repo: GithubRepo) => {
    setEditingRepo(repo);
    setGithubUrl(repo.url);
    setReview(repo.myReview);
    setSelectedTagIds(repo.tags.map((t) => t.id));
    setStatus(repo.status);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const toggleTag = (id: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const addNewTag = () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    // Optimistically create the tag locally so the chip
    // appears immediately. The backend will create the
    // canonical row when we save the repo.
    const existing = allTags.find(
      (t) => t.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) {
      if (!selectedTagIds.includes(existing.id)) {
        setSelectedTagIds((prev) => [...prev, existing.id]);
      }
    } else {
      // We don't know the ID yet — record the name in a
      // side list and include it as `tagNames` on submit.
      setPendingNewTagNames((prev) => {
        if (prev.some((n) => n.toLowerCase() === trimmed.toLowerCase())) return prev;
        return [...prev, trimmed];
      });
    }
    setNewTagInput('');
  };
  const [pendingNewTagNames, setPendingNewTagNames] = useState<string[]>([]);

  const submit = async () => {
    if (!githubUrl.trim()) {
      toast.error('Vui long nhap GitHub URL');
      return;
    }
    if (!editingRepo && !review.trim()) {
      // For new entries we want the admin to write a review
      // before publishing. Drafts can have empty review,
      // but the public feed never shows them anyway.
      toast.error('Vui long nhap bai hoc / nhan xet');
      return;
    }
    setSaving(true);
    try {
      if (editingRepo) {
        await githubApi.update(editingRepo.id, {
          myReview: review,
          tagIds: selectedTagIds,
          tagNames: pendingNewTagNames,
        });
        toast.success('Cap nhat repo thanh cong');
      } else {
        await githubApi.create({
          githubUrl,
          myReview: review,
          status,
          tagIds: selectedTagIds,
          tagNames: pendingNewTagNames,
        });
        toast.success('Them repo thanh cong');
      }
      closeForm();
      await loadRepos(tab);
      await loadFilters();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err as Error).message
        || 'Loi khong xac dinh';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (repo: GithubRepo) => {
    const next: 'DRAFT' | 'PUBLISHED' = repo.status === 'DRAFT' ? 'PUBLISHED' : 'DRAFT';
    try {
      await githubApi.setStatus(repo.id, next);
      toast.success(next === 'PUBLISHED' ? 'Da dang len feed' : 'Da chuyen ve draft');
      await loadRepos(tab);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err as Error).message;
      toast.error(message || 'Loi khi doi trang thai');
    }
  };

  const removeRepo = async (repo: GithubRepo) => {
    if (!confirm(`Xoa repo "${repo.repoName}"?`)) return;
    try {
      await githubApi.remove(repo.id);
      toast.success('Da xoa repo');
      await loadRepos(tab);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err as Error).message;
      toast.error(message || 'Loi khi xoa');
    }
  };

  const syncAll = async () => {
    const btn = toast.loading('Dong bo stars + language...');
    try {
      const res = await githubApi.syncAll();
      const data = res.data.data;
      toast.success(
        `Cap nhat ${data.updated}/${data.total} repo${data.failed.length ? ` (${data.failed.length} loi)` : ''}`,
        { id: btn },
      );
      await loadRepos(tab);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err as Error).message;
      toast.error(message || 'Loi dong bo', { id: btn });
    }
  };

  const fetchStarred = async () => {
    if (!starredUsername.trim()) {
      toast.error('Vui long nhap GitHub username');
      return;
    }
    setFetchingStars(true);
    const btn = toast.loading(`Dang quet starred repos cua ${starredUsername}...`);
    try {
      const res = await githubApi.fetchStarred(starredUsername.trim(), 10);
      const data = res.data.data;
      toast.success(
        `Them moi ${data.inserted} draft (${data.skipped} da ton tai)`,
        { id: btn },
      );
      setTab('DRAFT');
      await loadRepos('DRAFT');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err as Error).message;
      toast.error(message || 'Loi quet starred', { id: btn });
    } finally {
      setFetchingStars(false);
    }
  };

  // ─── Filter UI ─────────────────────────────────────────────
  const filteredRepos = repos.filter((r) => {
    if (search && !`${r.repoName} ${r.description ?? ''} ${r.owner}`.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const counts = {
    ALL: repos.length,
    DRAFT: repos.filter((r) => r.status === 'DRAFT').length,
    PUBLISHED: repos.filter((r) => r.status === 'PUBLISHED').length,
  };

  // Filter the tag list shown in the form. We only render
  // tags the admin is likely to want — i.e. those that
  // exist in our DB. New tags are typed in below.
  const visibleTags = allTags;

  return (
    <div className="p-6 lg:p-8">
      {/* ─── Header ───────────────────────────────────────── */}
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-heading text-2xl font-bold text-text-primary">
            <Github className="h-6 w-6 text-neon-violet" />
            GitHub Repo Hub
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Quan ly kho repo GitHub cong khai kem bai hoc va nhan xet.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={syncAll}
            className="inline-flex items-center gap-2 rounded-xl border border-darkborder bg-darkcard px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-neon-violet/40 hover:text-text-primary"
          >
            <RotateCw className="h-4 w-4" />
            Dong bo stars
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-4 py-2 text-sm font-medium text-white shadow-lg transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Them repo moi
          </button>
        </div>
      </header>

      {/* ─── Pull starred ────────────────────────────────── */}
      <section className="mb-6 rounded-2xl border border-neon-violet/20 bg-gradient-to-br from-neon-violet/[0.04] to-neon-indigo/[0.04] p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Download className="h-4 w-4 text-neon-violet" />
          Auto-draft tu GitHub Stars
        </div>
        <p className="mb-3 text-xs text-text-muted">
          Nhap GitHub username, he thong se quet 10 repo ban vua star gan day va luu vao muc <strong>Draft</strong>. Sau do ban chi can chon, viet nhan xet, va an Cong bo.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={starredUsername}
            onChange={(e) => setStarredUsername(e.target.value)}
            placeholder="vi du: cuonghoang1103"
            className="flex-1 rounded-xl border border-darkborder bg-darkbg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
          />
          <button
            onClick={fetchStarred}
            disabled={fetchingStars}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-neon-violet/20 px-4 py-2 text-sm font-medium text-neon-violet transition-colors hover:bg-neon-violet/30 disabled:opacity-50"
          >
            <Download className={`h-4 w-4 ${fetchingStars ? 'animate-pulse' : ''}`} />
            Quet starred
          </button>
        </div>
      </section>

      {/* ─── Tabs + search ───────────────────────────────── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl border border-darkborder bg-darkcard p-1">
          {(['ALL', 'DRAFT', 'PUBLISHED'] as TabKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
                tab === key
                  ? 'bg-neon-violet/20 text-text-primary shadow-[0_0_12px_rgba(167,139,250,0.25)]'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {key === 'ALL' ? 'Tat ca' : key === 'DRAFT' ? 'Ban nhap' : 'Da dang'}
              <span className="ml-1.5 text-text-muted">{counts[key]}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tim nhanh..."
            className="w-full rounded-xl border border-darkborder bg-darkcard py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
          />
        </div>
      </div>

      {/* ─── Repo list ───────────────────────────────────── */}
      {loading ? (
        <SkeletonList />
      ) : filteredRepos.length === 0 ? (
        <EmptyState onAdd={() => { resetForm(); setShowForm(true); }} />
      ) : (
        <ul className="space-y-3">
          {filteredRepos.map((repo) => (
            <li key={repo.id}>
              <RepoRow
                repo={repo}
                onEdit={() => openEdit(repo)}
                onDelete={() => removeRepo(repo)}
                onToggle={() => toggleStatus(repo)}
              />
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-center text-xs text-text-muted">
        Tong: {total} repo {tab !== 'ALL' ? `(loc theo ${tab})` : ''}
      </p>

      {/* ─── Form modal ──────────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <FormModal
            editing={editingRepo}
            githubUrl={githubUrl}
            review={review}
            status={status}
            tags={visibleTags}
            selectedTagIds={selectedTagIds}
            newTagInput={newTagInput}
            pendingNewTagNames={pendingNewTagNames}
            saving={saving}
            onGithubUrlChange={setGithubUrl}
            onReviewChange={setReview}
            onStatusChange={setStatus}
            onToggleTag={toggleTag}
            onNewTagInputChange={setNewTagInput}
            onAddNewTag={addNewTag}
            onRemovePendingTag={(name) => setPendingNewTagNames((prev) => prev.filter((n) => n !== name))}
            onSubmit={submit}
            onClose={closeForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Repo row ─────────────────────────────────────────────────────

interface RepoRowProps {
  repo: GithubRepo;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

function RepoRow({ repo, onEdit, onDelete, onToggle }: RepoRowProps) {
  const isPublished = repo.status === 'PUBLISHED';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="group flex flex-col gap-3 rounded-2xl border border-darkborder/50 bg-darkcard/60 p-4 transition-colors hover:border-neon-violet/30 md:flex-row md:items-center"
    >
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-semibold text-text-primary hover:text-neon-violet"
          >
            {repo.repoName}
            <ExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
              isPublished
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
            }`}
          >
            {isPublished ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            {repo.status}
          </span>
          {repo.language && (
            <span className="rounded-full border border-darkborder bg-darkbg/60 px-2 py-0.5 text-[10px] text-text-secondary">
              {repo.language}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
            <Star className="h-3.5 w-3.5 fill-yellow-400" />
            {repo.stars}
          </span>
        </div>
        <p className="line-clamp-1 text-xs text-text-muted">@{repo.owner}</p>
        {repo.description && (
          <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{repo.description}</p>
        )}
        {repo.myReview && (
          <p className="mt-2 line-clamp-2 rounded-lg border border-neon-violet/10 bg-neon-violet/5 p-2 text-xs text-text-secondary">
            <span className="text-neon-violet">Review:</span> {repo.myReview}
          </p>
        )}
        {repo.tags && repo.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {repo.tags.map((t) => (
              <span
                key={t.id}
                className="rounded-full border border-darkborder bg-darkbg/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-text-muted"
              >
                #{t.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 md:flex-col md:items-end">
        <button
          onClick={onToggle}
          className="inline-flex items-center gap-1.5 rounded-lg border border-darkborder bg-darkbg/60 px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-neon-violet/40 hover:text-text-primary"
          title={isPublished ? 'Chuyen ve draft' : 'Cong bo len feed'}
        >
          {isPublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {isPublished ? 'An' : 'Cong bo'}
        </button>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-lg border border-darkborder bg-darkbg/60 px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-neon-indigo/40 hover:text-text-primary"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Sua
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 transition-colors hover:bg-red-500/20"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Xoa
        </button>
      </div>
    </motion.div>
  );
}

// ─── Form modal ───────────────────────────────────────────────────

interface FormModalProps {
  editing: GithubRepo | null;
  githubUrl: string;
  review: string;
  status: 'DRAFT' | 'PUBLISHED';
  tags: GithubRepoTag[];
  selectedTagIds: number[];
  newTagInput: string;
  pendingNewTagNames: string[];
  saving: boolean;
  onGithubUrlChange: (v: string) => void;
  onReviewChange: (v: string) => void;
  onStatusChange: (v: 'DRAFT' | 'PUBLISHED') => void;
  onToggleTag: (id: number) => void;
  onNewTagInputChange: (v: string) => void;
  onAddNewTag: () => void;
  onRemovePendingTag: (name: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

function FormModal(props: FormModalProps) {
  const isEdit = Boolean(props.editing);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={props.onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-darkborder bg-darkbg"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-darkborder bg-darkcard px-5 py-3">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-text-primary">
            <Github className="h-5 w-5 text-neon-violet" />
            {isEdit ? 'Sua repo' : 'Them repo moi'}
          </h2>
          <button
            onClick={props.onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-white/5 hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* GitHub URL */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">
              GitHub URL
              <span className="ml-1 text-text-muted">
                (vi du: https://github.com/owner/repo hoac owner/repo)
              </span>
            </label>
            <div className="relative">
              <Github className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                value={props.githubUrl}
                onChange={(e) => props.onGithubUrlChange(e.target.value)}
                disabled={isEdit}
                placeholder="https://github.com/cuonghoang1103/api-backend"
                className="w-full rounded-xl border border-darkborder bg-darkcard py-2.5 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none disabled:opacity-60"
              />
            </div>
            <p className="mt-1 text-[11px] text-text-muted">
              Backend se tu dong goi GitHub API de lay stars, language, description.
            </p>
          </div>

          {/* Review */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">
              Bai hoc &amp; danh gia
              <span className="ml-1 text-text-muted">(ho tro Markdown co ban: **bold**, *italic*, `code`, [link](url), list - item)</span>
            </label>
            <textarea
              value={props.review}
              onChange={(e) => props.onReviewChange(e.target.value)}
              rows={6}
              placeholder="Viet nhan xet cua ban ve repo nay. Vi du: Repo nay rat tot cho nguoi moi bat dau vi..."
              className="w-full rounded-xl border border-darkborder bg-darkcard p-3 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-text-secondary">
              <TagIcon className="h-3.5 w-3.5" />
              Tags
            </label>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {props.tags.length === 0 ? (
                <span className="text-xs text-text-muted">Chua co tag nao trong he thong.</span>
              ) : (
                props.tags.map((t) => {
                  const active = props.selectedTagIds.includes(t.id);
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => props.onToggleTag(t.id)}
                      className={`rounded-full border px-2.5 py-0.5 text-xs transition-all ${
                        active
                          ? 'border-neon-violet bg-neon-violet/20 text-text-primary'
                          : 'border-darkborder bg-darkbg/40 text-text-secondary hover:border-neon-violet/40'
                      }`}
                    >
                      #{t.name}
                    </button>
                  );
                })
              )}
            </div>
            {/* New tag (typed, pending) */}
            <div className="flex gap-2">
              <input
                value={props.newTagInput}
                onChange={(e) => props.onNewTagInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    props.onAddNewTag();
                  }
                }}
                placeholder="Them tag moi roi Enter..."
                className="flex-1 rounded-lg border border-darkborder bg-darkbg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={props.onAddNewTag}
                className="rounded-lg border border-neon-violet/40 bg-neon-violet/10 px-3 py-1.5 text-xs font-medium text-neon-violet hover:bg-neon-violet/20"
              >
                Them
              </button>
            </div>
            {props.pendingNewTagNames.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {props.pendingNewTagNames.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300"
                  >
                    #{name} (moi)
                    <button
                      type="button"
                      onClick={() => props.onRemovePendingTag(name)}
                      className="hover:text-red-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status (only when creating new) */}
          {!isEdit && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Trang thai</label>
              <div className="flex gap-2">
                {(['DRAFT', 'PUBLISHED'] as const).map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => props.onStatusChange(s)}
                    className={`flex-1 rounded-xl border px-3 py-2 text-sm transition-all ${
                      props.status === s
                        ? 'border-neon-violet bg-neon-violet/10 text-text-primary'
                        : 'border-darkborder bg-darkcard text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {s === 'DRAFT' ? 'Ban nhap (rieng tu)' : 'Cong khai len feed'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-darkborder bg-darkcard px-5 py-3">
          <button
            type="button"
            onClick={props.onClose}
            className="rounded-xl border border-darkborder bg-darkbg px-4 py-2 text-sm text-text-secondary hover:text-text-primary"
          >
            Huy
          </button>
          <button
            type="button"
            onClick={props.onSubmit}
            disabled={props.saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-4 py-2 text-sm font-medium text-white shadow-lg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {props.saving && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
            {isEdit ? 'Luu thay doi' : 'Them repo'}
          </button>
        </footer>
      </motion.div>
    </motion.div>
  );
}

// ─── Misc ─────────────────────────────────────────────────────────

function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-2xl bg-darkcard/40" />
      ))}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/30 p-10 text-center">
      <Github className="mx-auto mb-3 h-10 w-10 text-text-muted" />
      <h3 className="mb-1 text-base font-semibold text-text-primary">Chua co repo nao</h3>
      <p className="mb-4 text-sm text-text-muted">
        Them repo moi hoac quet starred de bat dau.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-xl bg-neon-violet/20 px-4 py-2 text-sm font-medium text-neon-violet hover:bg-neon-violet/30"
      >
        <Plus className="h-4 w-4" />
        Them repo
      </button>
    </div>
  );
}
