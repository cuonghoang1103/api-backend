'use client';

/**
 * Admin — EXP_Hub (Code Snippet Library) management.
 *
 * Tabs:
 *  - Dashboard: totals, most-copied, recent activity
 *  - Snippets:  CRUD with Monaco editor, tags, variables, status
 *  - Categories: nested folder tree CRUD
 *  - Tags:      create / rename / delete
 *  - Import:    bulk import from local files
 *
 * Backend routes are role-guarded (authenticate + requireRole ADMIN/EDITOR);
 * this page is also nested under the admin layout which performs the
 * server-side admin-check.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Plus, Trash2, Pencil, Loader2, Code2, FolderTree as FolderTreeIcon,
  Tags as TagsIcon, Upload, LayoutDashboard, X, ChevronRight, Save,
  Eye, Copy as CopyIcon, ThumbsUp, FileCode2, RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  snippetsApi, snippetCategoriesApi, snippetTagsApi, snippetStatsApi,
} from '@/lib/exp-hub-api';
import type {
  Snippet, SnippetCategory, SnippetTag, DashboardStats, BulkImportResult,
} from '@/types/exp-hub';

type Tab = 'dashboard' | 'snippets' | 'categories' | 'tags' | 'import';

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'sql', 'bash', 'json',
  'yaml', 'html', 'css', 'go', 'rust', 'php', 'ruby', 'csharp', 'cpp',
  'kotlin', 'swift', 'markdown', 'plaintext',
  'mermaid', // renders as a diagram (flowchart/sequence/…) instead of code
];

// Extension → language for bulk import auto-detection
const EXT_LANG: Record<string, string> = {
  js: 'javascript', mjs: 'javascript', cjs: 'javascript', jsx: 'javascript',
  ts: 'typescript', tsx: 'typescript', py: 'python', java: 'java',
  sql: 'sql', sh: 'bash', bash: 'bash', json: 'json', yml: 'yaml',
  yaml: 'yaml', html: 'html', css: 'css', scss: 'css', go: 'go',
  rs: 'rust', php: 'php', rb: 'ruby', cs: 'csharp', c: 'cpp', cpp: 'cpp',
  h: 'cpp', kt: 'kotlin', swift: 'swift', md: 'markdown',
};

const STATUS_META: Record<Snippet['status'], { label: string; cls: string }> = {
  DRAFT: { label: 'Nháp', cls: 'bg-amber-500/15 text-amber-300' },
  PUBLISHED: { label: 'Công khai', cls: 'bg-emerald-500/15 text-emerald-300' },
  ARCHIVED: { label: 'Lưu trữ', cls: 'bg-slate-500/15 text-slate-300' },
};

// Flatten the category tree for <select> options, indenting children.
function flattenTree(nodes: SnippetCategory[], depth = 0): Array<{ id: number; label: string }> {
  const out: Array<{ id: number; label: string }> = [];
  for (const n of nodes) {
    out.push({ id: n.id, label: `${' '.repeat(depth * 3)}${depth > 0 ? '└ ' : ''}${n.name}` });
    if (n.children?.length) out.push(...flattenTree(n.children, depth + 1));
  }
  return out;
}

export default function AdminExpHubPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  // Shared reference data (loaded once, refreshed after mutations)
  const [categories, setCategories] = useState<SnippetCategory[]>([]);
  const [tags, setTags] = useState<SnippetTag[]>([]);

  const loadRefData = useCallback(async () => {
    try {
      const [c, t] = await Promise.all([
        snippetCategoriesApi.getAll(),
        snippetTagsApi.getAll(),
      ]);
      setCategories(c.data.data ?? []);
      setTags(t.data.data ?? []);
    } catch {
      toast.error('Không tải được danh mục / tags');
    }
  }, []);

  useEffect(() => { loadRefData(); }, [loadRefData]);

  const catOptions = useMemo(() => flattenTree(categories), [categories]);

  const TABS: Array<{ key: Tab; label: string; icon: typeof Code2 }> = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'snippets', label: 'Snippets', icon: Code2 },
    { key: 'categories', label: 'Thư mục', icon: FolderTreeIcon },
    { key: 'tags', label: 'Tags', icon: TagsIcon },
    { key: 'import', label: 'Bulk Import', icon: Upload },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <Code2 className="h-6 w-6 text-teal-400" />
        <h1 className="text-xl font-semibold text-white">EXP Hub — Quản lý Snippets</h1>
      </div>

      {/* Tab bar */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === key
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'bg-white/5 text-slate-400 border border-transparent hover:bg-white/10'
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && <DashboardTab />}
      {tab === 'snippets' && (
        <SnippetsTab catOptions={catOptions} tags={tags} onRefChanged={loadRefData} />
      )}
      {tab === 'categories' && (
        <CategoriesTab categories={categories} catOptions={catOptions} onChanged={loadRefData} />
      )}
      {tab === 'tags' && <TagsTab tags={tags} onChanged={loadRefData} />}
      {tab === 'import' && <ImportTab catOptions={catOptions} />}
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────

function DashboardTab() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await snippetStatsApi.getAdmin();
        setStats(r.data.data);
      } catch {
        toast.error('Không tải được thống kê');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spinner />;
  if (!stats) return <p className="text-slate-500">Không có dữ liệu</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Snippets đã publish', value: stats.totalSnippets, icon: FileCode2 },
          { label: 'Thư mục', value: stats.totalCategories, icon: FolderTreeIcon },
          { label: 'Tags', value: stats.totalTags, icon: TagsIcon },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Icon className="h-4 w-4" /> {label}</div>
            <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-300">Copy nhiều nhất</h3>
          <ul className="space-y-2">
            {stats.mostCopied.map(s => (
              <li key={s.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate text-slate-200">{s.title}</span>
                <span className="flex shrink-0 items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><CopyIcon className="h-3 w-3" />{s.copyCount}</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{s.viewCount}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{s.upvoteCount}</span>
                </span>
              </li>
            ))}
            {stats.mostCopied.length === 0 && <li className="text-xs text-slate-500">Chưa có dữ liệu</li>}
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-300">Cập nhật gần đây</h3>
          <ul className="space-y-2">
            {stats.recentActivity.map(s => (
              <li key={s.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate text-slate-200">{s.title}</span>
                <span className="shrink-0 text-xs text-slate-500">
                  {new Date(s.updatedAt).toLocaleString('vi-VN')}
                </span>
              </li>
            ))}
            {stats.recentActivity.length === 0 && <li className="text-xs text-slate-500">Chưa có dữ liệu</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Snippets tab ──────────────────────────────────────────────────────

interface EditorState {
  id: number | null; // null = creating
  title: string;
  description: string;
  language: string;
  code: string;
  explanation: string;
  youtubeUrl: string;
  referenceUrl: string;
  categoryId: number | null;
  tagIds: number[];
  status: Snippet['status'];
  previewUrl: string;
  variables: Array<{ key: string; label: string; defaultValue: string }>;
}

const EMPTY_EDITOR: EditorState = {
  id: null, title: '', description: '', language: 'javascript', code: '',
  explanation: '', youtubeUrl: '', referenceUrl: '',
  categoryId: null, tagIds: [], status: 'DRAFT', previewUrl: '', variables: [],
};

function SnippetsTab({
  catOptions, tags, onRefChanged,
}: {
  catOptions: Array<{ id: number; label: string }>;
  tags: SnippetTag[];
  onRefChanged: () => void;
}) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterCategory, setFilterCategory] = useState<number | ''>('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await snippetsApi.getList({
        page, limit: 20,
        categoryId: filterCategory === '' ? undefined : filterCategory,
        language: filterLanguage || undefined,
        // Empty status = all statuses (admin wants to see drafts too)
        status: filterStatus || (undefined as unknown as string),
      });
      setSnippets(r.data.data ?? []);
      setTotalPages(r.data.pagination?.totalPages ?? 1);
    } catch {
      toast.error('Không tải được snippets');
    } finally {
      setLoading(false);
    }
  }, [page, filterCategory, filterLanguage, filterStatus]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => setEditor({ ...EMPTY_EDITOR });
  const openEdit = async (id: number) => {
    try {
      const r = await snippetsApi.getById(id);
      const s = r.data.data;
      setEditor({
        id: s.id,
        title: s.title,
        description: s.description ?? '',
        language: s.language,
        code: s.code,
        explanation: s.explanation ?? '',
        youtubeUrl: s.youtubeUrl ?? '',
        referenceUrl: s.referenceUrl ?? '',
        categoryId: s.categoryId,
        tagIds: (s.tags ?? []).map(t => t.id),
        status: s.status,
        previewUrl: s.previewUrl ?? '',
        variables: (s.variables ?? []).map(v => ({
          key: v.key, label: v.label, defaultValue: v.defaultValue ?? '',
        })),
      });
    } catch {
      toast.error('Không tải được snippet');
    }
  };

  const save = async () => {
    if (!editor || saving) return;
    if (!editor.title.trim()) { toast.error('Cần tiêu đề'); return; }
    if (!editor.code.trim()) { toast.error('Cần code'); return; }
    setSaving(true);
    const payload = {
      title: editor.title.trim(),
      description: editor.description.trim() || undefined,
      language: editor.language,
      code: editor.code,
      explanation: editor.explanation.trim() || undefined,
      youtubeUrl: editor.youtubeUrl.trim() || undefined,
      referenceUrl: editor.referenceUrl.trim() || undefined,
      categoryId: editor.categoryId,
      tagIds: editor.tagIds,
      status: editor.status,
      previewUrl: editor.previewUrl.trim() || undefined,
      variables: editor.variables
        .filter(v => v.key.trim())
        .map(v => ({ key: v.key.trim(), label: v.label.trim() || v.key.trim(), defaultValue: v.defaultValue || undefined })),
    };
    try {
      if (editor.id == null) {
        await snippetsApi.create(payload);
        toast.success('Đã tạo snippet');
      } else {
        await snippetsApi.update(editor.id, payload);
        toast.success('Đã lưu snippet');
      }
      setEditor(null);
      load();
      onRefChanged();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s: Snippet) => {
    if (!window.confirm(`Xóa snippet "${s.title}"? Không thể hoàn tác.`)) return;
    try {
      await snippetsApi.delete(s.id);
      toast.success('Đã xóa');
      load();
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  return (
    <div>
      {/* Filters + create */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select value={filterCategory} onChange={e => { setPage(1); setFilterCategory(e.target.value ? Number(e.target.value) : ''); }} className={selCls}>
          <option value="">Tất cả thư mục</option>
          {catOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
        <select value={filterLanguage} onChange={e => { setPage(1); setFilterLanguage(e.target.value); }} className={selCls}>
          <option value="">Tất cả ngôn ngữ</option>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={filterStatus} onChange={e => { setPage(1); setFilterStatus(e.target.value); }} className={selCls}>
          <option value="">Tất cả trạng thái</option>
          <option value="DRAFT">Nháp</option>
          <option value="PUBLISHED">Công khai</option>
          <option value="ARCHIVED">Lưu trữ</option>
        </select>
        <button onClick={load} className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white" title="Tải lại">
          <RefreshCw className="h-4 w-4" />
        </button>
        <button onClick={openCreate} className="ml-auto flex items-center gap-2 rounded-lg bg-teal-500/20 px-4 py-2 text-sm font-medium text-teal-300 border border-teal-500/40 hover:bg-teal-500/30">
          <Plus className="h-4 w-4" /> Tạo snippet
        </button>
      </div>

      {loading ? <Spinner /> : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Tiêu đề</th>
                <th className="px-3 py-3">Ngôn ngữ</th>
                <th className="px-3 py-3">Thư mục</th>
                <th className="px-3 py-3">Trạng thái</th>
                <th className="px-3 py-3 text-right">Views</th>
                <th className="px-3 py-3 text-right">Copies</th>
                <th className="px-3 py-3 text-right">Votes</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {snippets.map(s => (
                <tr key={s.id} className="hover:bg-white/[0.03]">
                  <td className="px-4 py-2.5 text-slate-200">
                    <div className="max-w-[320px] truncate font-medium">{s.title}</div>
                    <div className="max-w-[320px] truncate text-xs text-slate-500">{s.description}</div>
                  </td>
                  <td className="px-3 py-2.5"><code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-teal-300">{s.language}</code></td>
                  <td className="px-3 py-2.5 text-xs text-slate-400">{s.category?.name ?? '—'}</td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_META[s.status].cls}`}>
                      {STATUS_META[s.status].label}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right text-xs text-slate-400">{s.viewCount}</td>
                  <td className="px-3 py-2.5 text-right text-xs text-slate-400">{s.copyCount}</td>
                  <td className="px-3 py-2.5 text-right text-xs text-slate-400">{s.upvoteCount}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(s.id)} className="rounded p-1.5 text-slate-400 hover:bg-white/10 hover:text-white" title="Sửa">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(s)} className="rounded p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-300" title="Xóa">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {snippets.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">Không có snippet nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg border border-white/10 px-3 py-1.5 text-slate-300 disabled:opacity-40">Trước</button>
          <span className="text-slate-500">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg border border-white/10 px-3 py-1.5 text-slate-300 disabled:opacity-40">Sau</button>
        </div>
      )}

      {/* Editor modal */}
      {editor && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-10" onClick={() => !saving && setEditor(null)}>
          <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#12161d] p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{editor.id == null ? 'Tạo snippet' : `Sửa snippet #${editor.id}`}</h2>
              <button onClick={() => setEditor(null)} className="rounded p-1.5 text-slate-400 hover:bg-white/10"><X className="h-5 w-5" /></button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="sm:col-span-2 text-xs text-slate-400">Tiêu đề *
                <input value={editor.title} onChange={e => setEditor({ ...editor, title: e.target.value })} className={inpCls} placeholder="VD: JWT Authentication Middleware" />
              </label>
              <label className="sm:col-span-2 text-xs text-slate-400">Mô tả
                <input value={editor.description} onChange={e => setEditor({ ...editor, description: e.target.value })} className={inpCls} placeholder="Mô tả ngắn gọn" />
              </label>
              <label className="text-xs text-slate-400">Ngôn ngữ *
                <select value={editor.language} onChange={e => setEditor({ ...editor, language: e.target.value })} className={inpCls}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </label>
              <label className="text-xs text-slate-400">Thư mục
                <select value={editor.categoryId ?? ''} onChange={e => setEditor({ ...editor, categoryId: e.target.value ? Number(e.target.value) : null })} className={inpCls}>
                  <option value="">— Không có —</option>
                  {catOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
              </label>
              <label className="text-xs text-slate-400">Trạng thái
                <select value={editor.status} onChange={e => setEditor({ ...editor, status: e.target.value as Snippet['status'] })} className={inpCls}>
                  <option value="DRAFT">Nháp</option>
                  <option value="PUBLISHED">Công khai</option>
                  <option value="ARCHIVED">Lưu trữ</option>
                </select>
              </label>
              <label className="text-xs text-slate-400">Preview URL
                <input value={editor.previewUrl} onChange={e => setEditor({ ...editor, previewUrl: e.target.value })} className={inpCls} placeholder="https://..." />
              </label>
            </div>

            {/* Tags */}
            <div className="mt-3">
              <div className="mb-1.5 text-xs text-slate-400">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(t => {
                  const on = editor.tagIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => setEditor({
                        ...editor,
                        tagIds: on ? editor.tagIds.filter(id => id !== t.id) : [...editor.tagIds, t.id],
                      })}
                      className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                        on ? 'bg-teal-500/25 text-teal-200 border border-teal-500/50' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
                {tags.length === 0 && <span className="text-xs text-slate-500">Chưa có tag — tạo ở tab Tags</span>}
              </div>
            </div>

            {/* Code */}
            <div className="mt-4">
              <div className="mb-1.5 text-xs text-slate-400">
                Code *
              </div>
              <textarea
                value={editor.code}
                onChange={(e) => setEditor(prev => (prev ? { ...prev, code: e.target.value } : prev))}
                placeholder="Paste code của bạn vào đây..."
                className="w-full rounded-lg border border-white/10 bg-[#0d1117] px-4 py-3 font-mono text-sm text-slate-200 placeholder:text-slate-600 focus:border-teal-500/50 focus:outline-none resize-none"
                style={{ height: '320px' }}
              />
            </div>

            {/* Explanation */}
            <div className="mt-4">
              <div className="mb-1.5 text-xs text-slate-400">
                Giải thích / Hướng dẫn
                <span className="ml-2 text-slate-500">(hiển thị khi user bấm "More")</span>
              </div>
              <textarea
                value={editor.explanation || ''}
                onChange={(e) => setEditor(prev => (prev ? { ...prev, explanation: e.target.value } : prev))}
                placeholder="Viết giải thích chi tiết về đoạn code này... (hỗ trợ HTML cơ bản)"
                className="w-full rounded-lg border border-white/10 bg-[#0d1117] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-teal-500/50 focus:outline-none resize-none"
                style={{ height: '150px' }}
              />
            </div>

            {/* YouTube URL */}
            <div className="mt-4">
              <div className="mb-1.5 text-xs text-slate-400">
                Video YouTube hướng dẫn
                <span className="ml-2 text-slate-500">(dán link video YouTube)</span>
              </div>
              <input
                value={editor.youtubeUrl || ''}
                onChange={(e) => setEditor(prev => (prev ? { ...prev, youtubeUrl: e.target.value } : prev))}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-lg border border-white/10 bg-[#0d1117] px-4 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-teal-500/50 focus:outline-none"
              />
            </div>

            {/* Reference website URL (embedded like the tutorial video) */}
            <div className="mt-4">
              <div className="mb-1.5 text-xs text-slate-400">
                Trang web tham khảo
                <span className="ml-2 text-slate-500">(nhúng iframe trong mục &quot;More&quot; cho user tham khảo)</span>
              </div>
              <input
                value={editor.referenceUrl || ''}
                onChange={(e) => setEditor(prev => (prev ? { ...prev, referenceUrl: e.target.value } : prev))}
                placeholder="https://en.wikipedia.org/wiki/Bubble_sort"
                className="w-full rounded-lg border border-white/10 bg-[#0d1117] px-4 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-teal-500/50 focus:outline-none"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditor(null)} disabled={saving} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">Hủy</button>
              <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-black hover:bg-teal-400 disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editor.id == null ? 'Tạo' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Categories tab ────────────────────────────────────────────────────

function CategoriesTab({
  categories, catOptions, onChanged,
}: {
  categories: SnippetCategory[];
  catOptions: Array<{ id: number; label: string }>;
  onChanged: () => void;
}) {
  const [newName, setNewName] = useState('');
  const [newParent, setNewParent] = useState<number | ''>('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<{ id: number; name: string; parentId: number | null } | null>(null);
  const [deleting, setDeleting] = useState<SnippetCategory | null>(null);

  const create = async () => {
    const name = newName.trim();
    if (!name || busy) return;
    setBusy(true);
    try {
      await snippetCategoriesApi.create({ name, parentId: newParent === '' ? null : newParent });
      toast.success('Đã tạo thư mục');
      setNewName('');
      onChanged();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Tạo thất bại');
    } finally {
      setBusy(false);
    }
  };

  const saveEdit = async () => {
    if (!editing || busy) return;
    setBusy(true);
    try {
      await snippetCategoriesApi.update(editing.id, { name: editing.name.trim(), parentId: editing.parentId });
      toast.success('Đã lưu');
      setEditing(null);
      onChanged();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Lưu thất bại');
    } finally {
      setBusy(false);
    }
  };

  const doDelete = async (keepChildren: boolean) => {
    if (!deleting || busy) return;
    setBusy(true);
    try {
      // keepChildren: move children (and snippets) to root; otherwise
      // the whole subtree is deleted (snippets become uncategorised).
      await snippetCategoriesApi.delete(deleting.id, keepChildren ? null : undefined);
      toast.success('Đã xóa thư mục');
      setDeleting(null);
      onChanged();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Xóa thất bại');
    } finally {
      setBusy(false);
    }
  };

  const renderNode = (node: SnippetCategory, depth = 0) => (
    <div key={node.id}>
      <div className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/[0.04]" style={{ paddingLeft: depth * 20 + 8 }}>
        <ChevronRight className={`h-3.5 w-3.5 text-slate-600 ${node.children?.length ? '' : 'opacity-0'}`} />
        <FolderTreeIcon className="h-4 w-4 text-amber-400/80" />
        <span className="text-sm text-slate-200">{node.name}</span>
        <span className="text-[11px] text-slate-500">
          {node._count?.snippets ?? 0} snippets
        </span>
        <div className="ml-auto flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={() => setEditing({ id: node.id, name: node.name, parentId: node.parentId })} className="rounded p-1 text-slate-400 hover:bg-white/10" title="Sửa">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setDeleting(node)} className="rounded p-1 text-slate-400 hover:bg-rose-500/20 hover:text-rose-300" title="Xóa">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {node.children?.map(c => renderNode(c, depth + 1))}
    </div>
  );

  return (
    <div className="max-w-3xl space-y-4">
      {/* Create row */}
      <div className="flex flex-wrap items-center gap-2">
        <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && create()} placeholder="Tên thư mục mới" className={`${inpCls} !mt-0 w-56`} />
        <select value={newParent} onChange={e => setNewParent(e.target.value ? Number(e.target.value) : '')} className={selCls}>
          <option value="">Gốc (không có cha)</option>
          {catOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
        <button onClick={create} disabled={busy || !newName.trim()} className="flex items-center gap-2 rounded-lg bg-teal-500/20 px-3 py-2 text-sm text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 disabled:opacity-50">
          <Plus className="h-4 w-4" /> Tạo
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2">
        {categories.length === 0
          ? <p className="px-3 py-6 text-center text-sm text-slate-500">Chưa có thư mục nào</p>
          : categories.map(c => renderNode(c))}
      </div>

      {/* Edit modal */}
      {editing && (
        <Modal title={`Sửa thư mục #${editing.id}`} onClose={() => setEditing(null)}>
          <label className="text-xs text-slate-400">Tên
            <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className={inpCls} />
          </label>
          <label className="mt-2 block text-xs text-slate-400">Thư mục cha
            <select value={editing.parentId ?? ''} onChange={e => setEditing({ ...editing, parentId: e.target.value ? Number(e.target.value) : null })} className={inpCls}>
              <option value="">Gốc (không có cha)</option>
              {catOptions.filter(o => o.id !== editing.id).map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </label>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setEditing(null)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300">Hủy</button>
            <button onClick={saveEdit} disabled={busy} className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-black hover:bg-teal-400 disabled:opacity-60">Lưu</button>
          </div>
        </Modal>
      )}

      {/* Delete modal */}
      {deleting && (
        <Modal title={`Xóa thư mục "${deleting.name}"?`} onClose={() => setDeleting(null)}>
          <p className="text-sm text-slate-400">
            Thư mục có thể chứa thư mục con và snippets. Chọn cách xử lý:
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <button onClick={() => doDelete(true)} disabled={busy} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5">
              Giữ thư mục con — chuyển chúng lên gốc
            </button>
            <button onClick={() => doDelete(false)} disabled={busy} className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-300 hover:bg-rose-500/20">
              Xóa toàn bộ cây con (snippets chuyển về "không có thư mục")
            </button>
            <button onClick={() => setDeleting(null)} className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-white/5">Hủy</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Tags tab ──────────────────────────────────────────────────────────

function TagsTab({ tags, onChanged }: { tags: SnippetTag[]; onChanged: () => void }) {
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<{ id: number; name: string } | null>(null);

  const create = async () => {
    const name = newName.trim();
    if (!name || busy) return;
    setBusy(true);
    try {
      await snippetTagsApi.create({ name });
      toast.success('Đã tạo tag');
      setNewName('');
      onChanged();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Tạo thất bại');
    } finally {
      setBusy(false);
    }
  };

  const rename = async () => {
    if (!editing || busy || !editing.name.trim()) return;
    setBusy(true);
    try {
      await snippetTagsApi.update(editing.id, { name: editing.name.trim() });
      toast.success('Đã đổi tên');
      setEditing(null);
      onChanged();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Đổi tên thất bại');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (t: SnippetTag) => {
    if (!window.confirm(`Xóa tag "${t.name}"? Tag sẽ bị gỡ khỏi mọi snippet.`)) return;
    try {
      await snippetTagsApi.delete(t.id);
      toast.success('Đã xóa');
      onChanged();
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-2">
        <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && create()} placeholder="Tên tag mới" className={`${inpCls} !mt-0 w-56`} />
        <button onClick={create} disabled={busy || !newName.trim()} className="flex items-center gap-2 rounded-lg bg-teal-500/20 px-3 py-2 text-sm text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 disabled:opacity-50">
          <Plus className="h-4 w-4" /> Tạo
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map(t => (
          <span key={t.id} className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200">
            {t.name}
            <span className="text-[11px] text-slate-500">{t._count?.snippets ?? 0}</span>
            <button onClick={() => setEditing({ id: t.id, name: t.name })} className="rounded p-0.5 text-slate-500 hover:text-white" title="Đổi tên">
              <Pencil className="h-3 w-3" />
            </button>
            <button onClick={() => remove(t)} className="rounded p-0.5 text-slate-500 hover:text-rose-300" title="Xóa">
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        {tags.length === 0 && <p className="text-sm text-slate-500">Chưa có tag nào</p>}
      </div>

      {editing && (
        <Modal title={`Đổi tên tag #${editing.id}`} onClose={() => setEditing(null)}>
          <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} onKeyDown={e => e.key === 'Enter' && rename()} className={inpCls} autoFocus />
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setEditing(null)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300">Hủy</button>
            <button onClick={rename} disabled={busy} className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-black hover:bg-teal-400 disabled:opacity-60">Lưu</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Bulk import tab ───────────────────────────────────────────────────

interface ImportRow {
  filename: string;
  title: string;
  language: string;
  code: string;
}

function ImportTab({ catOptions }: { catOptions: Array<{ id: number; label: string }> }) {
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<BulkImportResult[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const next: ImportRow[] = [];
    for (const f of Array.from(files)) {
      // Only import readable text files, capped so an accidental
      // binary/huge file doesn't lock up the tab.
      if (f.size > 512 * 1024) {
        toast.error(`${f.name}: quá lớn (>512KB), bỏ qua`);
        continue;
      }
      const text = await f.text();
      const ext = (f.name.split('.').pop() || '').toLowerCase();
      next.push({
        filename: f.name,
        title: f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        language: EXT_LANG[ext] ?? 'plaintext',
        code: text,
      });
    }
    setRows(prev => [...prev, ...next]);
    setResults(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const doImport = async () => {
    if (!rows.length || importing) return;
    setImporting(true);
    try {
      const r = await snippetsApi.bulkImport(
        rows.map(row => ({
          title: row.title.trim(),
          language: row.language,
          filename: row.filename,
          code: row.code,
          categoryId: categoryId === '' ? undefined : categoryId,
        })),
        categoryId === '' ? undefined : categoryId,
      );
      const res = r.data.data ?? [];
      setResults(res);
      const ok = res.filter(x => x.status === 'success').length;
      toast.success(`Import xong: ${ok}/${res.length} thành công (tạo dạng Nháp)`);
      if (ok === res.length) setRows([]);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Import thất bại');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-lg border border-dashed border-white/20 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
          <Upload className="h-4 w-4" /> Chọn files
        </button>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={e => onFiles(e.target.files)} />
        <select value={categoryId} onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : '')} className={selCls}>
          <option value="">Thư mục đích: không có</option>
          {catOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
        <button onClick={doImport} disabled={!rows.length || importing} className="ml-auto flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-black hover:bg-teal-400 disabled:opacity-50">
          {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Import {rows.length > 0 && `(${rows.length})`}
        </button>
      </div>

      {rows.length > 0 && (
        <div className="space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-2">
              <FileCode2 className="h-4 w-4 shrink-0 text-slate-500" />
              <input
                value={row.title}
                onChange={e => setRows(rs => rs.map((r, j) => (j === i ? { ...r, title: e.target.value } : r)))}
                className={`${inpCls} !mt-0 flex-1`}
              />
              <select
                value={row.language}
                onChange={e => setRows(rs => rs.map((r, j) => (j === i ? { ...r, language: e.target.value } : r)))}
                className={selCls}
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <span className="w-24 truncate text-xs text-slate-500">{row.filename}</span>
              <button onClick={() => setRows(rs => rs.filter((_, j) => j !== i))} className="rounded p-1.5 text-slate-500 hover:bg-rose-500/20 hover:text-rose-300">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {results && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <h3 className="mb-2 text-sm font-semibold text-slate-300">Kết quả</h3>
          <ul className="space-y-1 text-sm">
            {results.map((r, i) => (
              <li key={i} className={r.status === 'success' ? 'text-emerald-300' : 'text-rose-300'}>
                {r.status === 'success' ? '✓' : '✗'} {r.title}{r.message ? ` — ${r.message}` : ''}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-slate-500">Snippets import vào ở trạng thái Nháp — sang tab Snippets để chỉnh và publish.</p>
        </div>
      )}
    </div>
  );
}

// ─── Small shared bits ────────────────────────────────────────────────

const inpCls = 'mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-teal-500/50 focus:outline-none';
const selCls = 'rounded-lg border border-white/10 bg-[#12161d] px-3 py-2 text-sm text-slate-300 focus:border-teal-500/50 focus:outline-none';

function Spinner() {
  return (
    <div className="flex justify-center py-16 text-slate-500">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12161d] p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-white/10"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
