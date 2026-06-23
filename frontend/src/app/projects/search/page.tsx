// ──────────────────────────────────────────────────────────
// /projects/search — case study full-text search page
// ──────────────────────────────────────────────────────────
//
// We read the query from `?q=` (and optional category /
// difficulty filters) and call /api/v1/projects/search.
// The result list is rendered with the highlighted
// snippet returned by the server — no client-side
// markdown rendering needed for a search result.

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsApi } from '@/lib/api';
import type { ProjectSearchResponse } from '@/types';

const CATEGORY_OPTIONS = ['', 'Web App', 'API', 'DevOps', 'Mobile', 'CLI'];
const DIFFICULTY_OPTIONS = ['', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

const labelDifficulty = (d: string) => d.charAt(0) + d.slice(1).toLowerCase();

export default function SearchPage() {
 const searchParams = useSearchParams();
 const router = useRouter();
 const pathname = usePathname();

 const q = searchParams.get('q') ?? '';
 const category = searchParams.get('category') ?? '';
 const difficulty = searchParams.get('difficulty') ?? '';

 const [input, setInput] = useState(q);
 const [data, setData] = useState<ProjectSearchResponse | null>(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 // Sync the visible input with the URL when navigation
 // changes (e.g. back button, deep link). We keep this
 // in an effect rather than in the render pass so it
 // doesn't fire during normal typing.
 useEffect(() => { setInput(q); }, [q]);

 // The search effect runs whenever URL params change.
 // We debounce 300ms to avoid spamming the server as the
 // user types, and abort any in-flight request when the
 // params change so older results don't overwrite newer.
 useEffect(() => {
 if (!q.trim()) {
 setData(null);
 setError(null);
 return;
 }
 const ctrl = new AbortController();
 const timer = setTimeout(async () => {
 setLoading(true);
 setError(null);
 try {
 const res = await projectsApi.search({ q, category, difficulty });
 if (ctrl.signal.aborted) return;
 setData(res.data.data as ProjectSearchResponse);
 } catch (e) {
 if (ctrl.signal.aborted) return;
 setError(e instanceof Error ? e.message : 'Search failed');
 } finally {
 if (!ctrl.signal.aborted) setLoading(false);
 }
 }, 300);
 return () => {
 ctrl.abort();
 clearTimeout(timer);
 };
 }, [q, category, difficulty]);

 const updateUrl = (next: { q?: string; category?: string; difficulty?: string }) => {
 const params = new URLSearchParams(searchParams.toString());
 if (next.q !== undefined) {
 if (next.q) params.set('q', next.q);
 else params.delete('q');
 }
 if (next.category !== undefined) {
 if (next.category) params.set('category', next.category);
 else params.delete('category');
 }
 if (next.difficulty !== undefined) {
 if (next.difficulty) params.set('difficulty', next.difficulty);
 else params.delete('difficulty');
 }
 const qs = params.toString();
 router.replace(`${pathname}${qs ? '?' + qs : ''}`);
 };

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 updateUrl({ q: input.trim() });
 };

 const hasQuery = q.trim().length > 0;
 const results = data?.results ?? [];

 // Memoize the rendered list so re-renders during loading
 // states don't blow away the list. The list itself is
 // cheap (typically < 30 items) so the perf win is small
 // but it makes the empty/loading transitions smoother.
 const renderedResults = useMemo(() => results, [results]);

 return (
 <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-12">
 <div className="mx-auto max-w-4xl">
 {/* Header */}
 <header className="mb-8">
 <Link
 href="/projects"
 className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
 >
 ← Quay lại danh sách dự án
 </Link>
 <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
 Tìm kiếm case study
 </h1>
 <p className="text-sm text-gray-400">
 Tìm trong tiêu đề, mô tả và nội dung case study. Hỗ trợ
 multi-word search (tự động AND).
 </p>
 </header>

 {/* Search form */}
 <form onSubmit={handleSubmit} className="mb-6 space-y-4">
 <div className="flex gap-2">
 <input
 type="search"
 value={input}
 onChange={(e) => setInput(e.target.value)}
 placeholder="Nhập từ khoá: callout, portfolio, postgres…"
 className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-violet-500 focus:bg-white/10"
 autoFocus
 />
 <button
 type="submit"
 className="rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-500"
 >
 Tìm
 </button>
 </div>

 {/* Filters */}
 <div className="flex flex-wrap gap-3 text-sm">
 <label className="flex items-center gap-2">
 <span className="text-gray-400">Danh mục:</span>
 <select
 value={category}
 onChange={(e) => updateUrl({ category: e.target.value })}
 className="rounded border border-white/10 bg-white/5 px-2 py-1 text-white outline-none focus:border-violet-500"
 >
 {CATEGORY_OPTIONS.map((c) => (
 <option key={c} value={c} className="bg-darkbg">
 {c || 'Tất cả'}
 </option>
 ))}
 </select>
 </label>
 <label className="flex items-center gap-2">
 <span className="text-gray-400">Độ khó:</span>
 <select
 value={difficulty}
 onChange={(e) => updateUrl({ difficulty: e.target.value })}
 className="rounded border border-white/10 bg-white/5 px-2 py-1 text-white outline-none focus:border-violet-500"
 >
 {DIFFICULTY_OPTIONS.map((d) => (
 <option key={d} value={d} className="bg-darkbg">
 {d ? labelDifficulty(d) : 'Tất cả'}
 </option>
 ))}
 </select>
 </label>
 </div>
 </form>

 {/* RSS link */}
 <div className="mb-6 flex items-center justify-between border-t border-white/5 pt-4 text-sm">
 <a
 href="/api/v1/projects/feed.xml"
 target="_blank"
 rel="alternate"
 className="inline-flex items-center gap-2 text-orange-400 transition hover:text-orange-300"
 >
 <span className="inline-block h-2 w-2 rounded-full bg-orange-400" />
 RSS feed
 </a>
 {data && hasQuery && (
 <span className="text-gray-500">
 {data.total} kết quả cho &quot;{data.query}&quot;
 </span>
 )}
 </div>

 {/* States */}
 <AnimatePresence mode="wait">
 {loading && (
 <motion.div
 key="loading"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="py-8 text-center text-gray-400"
 >
 Đang tìm kiếm…
 </motion.div>
 )}

 {error && (
 <motion.div
 key="error"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300"
 >
 {error}
 </motion.div>
 )}

 {!loading && !error && hasQuery && renderedResults.length === 0 && (
 <motion.div
 key="empty"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="rounded-lg border border-white/10 bg-white/5 p-8 text-center text-gray-400"
 >
 Không tìm thấy kết quả nào. Thử từ khoá khác hoặc bỏ bộ lọc.
 </motion.div>
 )}

 {!hasQuery && !loading && (
 <motion.div
 key="hint"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="rounded-lg border border-white/10 bg-white/5 p-8 text-center text-gray-500"
 >
 Nhập từ khoá để bắt đầu tìm kiếm.
 </motion.div>
 )}
 </AnimatePresence>

 {/* Results */}
 <ul className="space-y-4">
 {renderedResults.map((hit, i) => (
 <motion.li
 key={hit.id}
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.03 }}
 >
 <Link
 href={`/projects/${hit.slug}`}
 className="block rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/50 hover:bg-white/[0.06]"
 >
 <div className="mb-2 flex items-start justify-between gap-4">
 <h3 className="text-lg font-semibold text-white">
 {hit.title}
 </h3>
 <span className="shrink-0 text-xs text-gray-500">
 rank {hit.rank.toFixed(2)}
 </span>
 </div>

 {hit.description && (
 <p className="mb-3 text-sm text-gray-400">
 {hit.description}
 </p>
 )}

 {hit.snippet && (
 <p
 className="mb-3 text-sm leading-relaxed text-gray-300 [&_mark]:rounded-sm [&_mark]:bg-violet-500/30 [&_mark]:px-1 [&_mark]:text-violet-100"
 dangerouslySetInnerHTML={{ __html: hit.snippet }}
 />
 )}

 <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
 {hit.category && (
 <span className="rounded-full bg-white/5 px-2 py-0.5">
 {hit.category}
 </span>
 )}
 {hit.difficulty && (
 <span className="rounded-full bg-white/5 px-2 py-0.5">
 {labelDifficulty(hit.difficulty)}
 </span>
 )}
 <span>{hit.viewCount} lượt xem</span>
 <span>·</span>
 <span>{hit.likeCount} lượt thích</span>
 </div>
 </Link>
 </motion.li>
 ))}
 </ul>
 </div>
 </main>
 );
}
