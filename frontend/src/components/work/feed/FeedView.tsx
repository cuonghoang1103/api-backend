'use client';

/**
 * BẢNG TIN NHÓM (21/10/2026) — dùng chung cho ba nơi:
 *   mode 'all'        tab "Bảng tin" của Việc của tôi — gộp mọi không gian/dự án, lọc theo không gian/dự án;
 *   mode 'workspace'  /work/<ws>/feed — bài cấp không gian + bài các dự án mình thấy (lọc: chỉ bài chung / từng dự án);
 *   mode 'project'    /work/<ws>/<KEY>/feed — bài của dự án.
 * Ô soạn bài ở đầu · bộ lọc (Tất cả / Bài của tôi / Ảnh & video / Tệp / Đã lưu) + tìm chữ/#thẻ · viên "N bài mới" (socket)
 * · mục Ghim · cuộn vô hạn (con trỏ) · khung chi tiết `?post=<id>&comment=<id>` (đường dẫn sâu của thông báo) · hàng chờ
 * báo cáo `?tab=reports` cho quản trị · cột phải (≥ xl): mức thông báo từng bảng tin + lối vào báo cáo.
 */

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowUp, Bell, Flag, Lock, MessagesSquare, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { feedApi, feedKeys, type FeedFilter, type FeedQuery, type FeedScope, type FollowLevel } from '@/lib/work-feed-api';
import { useAuthStore } from '@/store/authStore';
import { EmptyState, ProjectMark, Spinner, WorkPortal } from '@/components/work/ui';
import { wt } from '@/components/work/i18n';
import { Composer } from './Composer';
import { dropPost, postLoaded, refreshPost, useFeedRealtime, type FeedEvent } from './feedCache';
import { PostCard, PostSkeleton } from './PostCard';
import { ReportDialog } from './ReportDialog';
import { ReportsPanel } from './ReportsPanel';

export interface FeedViewProps {
  mode: 'all' | 'workspace' | 'project';
  workspaceId?: number;
  projectId?: number;
}

const FILTERS: Array<{ id: FeedFilter; label: () => string }> = [
  { id: 'all', label: () => wt('feed.filterAll') },
  { id: 'mine', label: () => wt('feed.filterMine') },
  { id: 'media', label: () => wt('feed.filterMedia') },
  { id: 'files', label: () => wt('feed.filterFiles') },
  { id: 'saved', label: () => wt('feed.filterSaved') },
];

/** Giá trị của ô "Hiện bài từ": '' | 'w:<id>' | 'wo:<id>' (chỉ bài chung) | 'p:<id>'. */
function selToQuery(sel: string): Pick<FeedQuery, 'workspaceId' | 'projectId' | 'level'> {
  const [k, v] = sel.split(':');
  const id = Number(v);
  if (k === 'w') return { workspaceId: id };
  if (k === 'wo') return { workspaceId: id, level: 'workspace' };
  if (k === 'p') return { projectId: id };
  return {};
}

function FollowSelect({ ws, project, level }: { ws: number; project?: number | null; level: FollowLevel }) {
  const qc = useQueryClient();
  return (
    <select
      className="w-input h-7 w-[132px] shrink-0 py-0 text-[12px]"
      value={level}
      aria-label={wt('feed.notifications')}
      onChange={async (e) => {
        try {
          await feedApi.follow({ workspaceId: ws, projectId: project ?? null, level: e.target.value as FollowLevel });
          toast.success(wt('feed.followSaved'));
          await qc.invalidateQueries({ queryKey: feedKeys.scopes });
        } catch (err) { toast.error(workError(err)); }
      }}
    >
      <option value="ALL">{wt('feed.followALL')}</option>
      <option value="MENTIONS">{wt('feed.followMENTIONS')}</option>
      <option value="OFF">{wt('feed.followOFF')}</option>
    </select>
  );
}

function SideRail({ scopes, mode, workspaceId, projectId, openReports, onReports }: {
  scopes: FeedScope[]; mode: FeedViewProps['mode']; workspaceId?: number; projectId?: number; openReports: number; onReports?: () => void;
}) {
  const shown = scopes.filter((s) => mode === 'all' || s.workspace.id === workspaceId);
  return (
    <aside className="sticky top-4 hidden w-[300px] shrink-0 self-start xl:block" aria-label={wt('feed.yourFeeds')}>
      <div className="w-card p-3.5">
        <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold"><Bell size={14} className="text-[var(--w-text-3)]" />{wt('feed.notifications')}</div>
        <ul className="grid gap-2">
          {shown.map((s) => (
            <li key={s.workspace.id} className="grid gap-1.5">
              {s.role && (mode !== 'project') && (
                <div className="flex items-center gap-2">
                  <Link href={`/work/${s.workspace.slug}/feed`} className="min-w-0 flex-1 truncate text-[13px] font-medium hover:underline">{s.workspace.name}</Link>
                  <FollowSelect ws={s.workspace.id} level={s.follow} />
                </div>
              )}
              {s.projects.filter((p) => mode !== 'project' || p.id === projectId).map((p) => (
                <div key={p.id} className={cn('flex items-center gap-2', mode !== 'project' && 'pl-3')}>
                  <Link href={`/work/${s.workspace.slug}/${p.key}/feed`} className="flex min-w-0 flex-1 items-center gap-1.5 truncate text-[12.5px] text-[var(--w-text-2)] hover:underline">
                    <ProjectMark k={p.key} size={14} /><span className="truncate">{p.name}</span>
                  </Link>
                  <FollowSelect ws={s.workspace.id} project={p.id} level={p.follow} />
                </div>
              ))}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11.5px] leading-relaxed text-[var(--w-text-3)]">{wt('feed.followHint')}</p>
      </div>
      {onReports && (
        <button type="button" onClick={onReports} className="w-card mt-3 flex w-full items-center gap-2 p-3 text-left text-[13px] font-medium transition-colors hover:border-[var(--w-border-strong)]">
          <Flag size={14} className="text-[var(--w-red-text)]" /><span className="flex-1">{wt('feed.reports')}</span>
          {openReports > 0 && <span className="rounded-full bg-[var(--w-red)] px-2 text-[11.5px] font-semibold leading-[20px] text-white">{openReports}</span>}
        </button>
      )}
      <p className="mt-3 flex items-start gap-1.5 px-1 text-[11.5px] leading-relaxed text-[var(--w-text-3)]"><Lock size={12} className="mt-0.5 shrink-0" />{wt('feed.privateNote')}</p>
    </aside>
  );
}

function PostDetail({ id, comment, onClose, onReport, onTag }: { id: number; comment: number | null; onClose: () => void; onReport: (t: { kind: 'post' | 'comment'; id: number }) => void; onTag: (t: string) => void }) {
  const q = useQuery({ queryKey: feedKeys.post(id), queryFn: () => feedApi.get(id), retry: false });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !e.defaultPrevented) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <WorkPortal>
      <div className="fixed inset-0 z-[65] overflow-y-auto bg-black/45 px-3 py-6 sm:px-4 sm:py-[6vh]" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-label={wt('feed.title')}>
        <div className="relative mx-auto w-full max-w-[680px]">
          <button type="button" onClick={onClose} className="absolute -top-1 right-0 z-10 flex h-9 w-9 -translate-y-full items-center justify-center rounded-full bg-[var(--w-raised)] text-[var(--w-text-2)] shadow-[var(--w-shadow-pop)] hover:text-[var(--w-text)] sm:-right-12 sm:top-0 sm:translate-y-0" aria-label={wt('common.close')}><X size={17} /></button>
          {q.isLoading ? <PostSkeleton />
            : q.data ? <PostCard post={q.data} detail highlightComment={comment} onReport={onReport} onTag={(t) => { onClose(); onTag(t); }} />
            : <div className="w-card"><EmptyState title={wt('feed.postNotFound')} body={wt('feed.postNotFoundBody')} action={<button type="button" className="w-btn" onClick={onClose}>{wt('feed.backToFeed')}</button>} /></div>}
        </div>
      </div>
    </WorkPortal>
  );
}

export default function FeedView({ mode, workspaceId, projectId }: FeedViewProps) {
  const qc = useQueryClient();
  const meId = useAuthStore((s) => s.user?.id);
  const router = useRouter();
  const pathname = usePathname() ?? '/work';
  const params = useSearchParams();
  const detailId = Number(params?.get('post')) || null;
  const detailComment = Number(params?.get('comment')) || null;
  const tab = params?.get('tab') === 'reports' ? 'reports' : 'feed';
  const setParams = useCallback((patch: Record<string, string | null>) => {
    const p = new URLSearchParams(params?.toString());
    for (const [k, v] of Object.entries(patch)) { if (v === null) p.delete(k); else p.set(k, v); }
    const s = p.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  }, [params, pathname, router]);

  const [filter, setFilter] = useState<FeedFilter>('all');
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [sel, setSel] = useState('');
  const [fresh, setFresh] = useState(0);
  const [report, setReport] = useState<{ kind: 'post' | 'comment'; id: number } | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => { const t = setTimeout(() => setDebounced(search.trim()), 350); return () => clearTimeout(t); }, [search]);

  const scopesQ = useQuery({ queryKey: feedKeys.scopes, queryFn: feedApi.scopes, staleTime: 60_000 });
  const scopes = useMemo(() => scopesQ.data?.scopes ?? [], [scopesQ.data]);
  const wsScope = scopes.find((s) => s.workspace.id === workspaceId);
  const canModerate = mode === 'all' ? scopes.some((s) => s.canModerate || s.projects.some((p) => p.canModerate))
    : mode === 'workspace' ? !!(wsScope && (wsScope.canModerate || wsScope.projects.some((p) => p.canModerate)))
    : !!wsScope?.projects.find((p) => p.id === projectId)?.canModerate;

  const query: FeedQuery = useMemo(() => {
    const base: FeedQuery = mode === 'project' ? { projectId } : mode === 'workspace' ? { workspaceId, ...(sel ? selToQuery(sel) : {}) } : (sel ? selToQuery(sel) : {});
    if (mode === 'workspace' && sel.startsWith('p:')) delete base.workspaceId;
    return { ...base, filter, q: debounced || undefined };
  }, [mode, projectId, workspaceId, sel, filter, debounced]);

  const list = useInfiniteQuery({
    queryKey: feedKeys.list(query),
    queryFn: ({ pageParam }) => feedApi.list({ ...query, cursor: pageParam as string | null, limit: 15 }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
    enabled: tab === 'feed' && (mode === 'all' || !!workspaceId) && (mode !== 'project' || !!projectId),
  });
  const pinned = list.data?.pages[0]?.pinned ?? [];
  const posts = useMemo(() => list.data?.pages.flatMap((p) => p.posts) ?? [], [list.data]);

  // Cuộn vô hạn.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting) && list.hasNextPage && !list.isFetchingNextPage) void list.fetchNextPage(); }, { rootMargin: '600px' });
    io.observe(el);
    return () => io.disconnect();
  }, [list]);

  // Thời gian thực: bài mới của người khác ⇒ viên "N bài mới"; còn lại ⇒ vá đúng bài đang hiện.
  const pending = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const relevant = useCallback((e: FeedEvent) => {
    if (mode === 'project') return e.projectId === projectId;
    const q = sel ? selToQuery(sel) : {};
    if (q.projectId) return e.projectId === q.projectId;
    const ws = mode === 'workspace' ? workspaceId : q.workspaceId;
    if (ws && e.workspaceId !== ws) return false;
    if (q.level === 'workspace' && e.projectId) return false;
    return true;
  }, [mode, projectId, workspaceId, sel]);
  useFeedRealtime((e) => {
    if (e.type === 'post.created') {
      if (relevant(e) && filter !== 'saved' && Number(e.actorId) !== Number(meId) && !postLoaded(qc, e.postId)) setFresh((n) => n + 1);
      return;
    }
    if (e.type === 'post.deleted') { dropPost(qc, e.postId); return; }
    if (e.type.startsWith('comment.')) void qc.invalidateQueries({ queryKey: ['work', 'feed', 'comments', e.postId] });
    if (!postLoaded(qc, e.postId)) return;
    const t = pending.current.get(e.postId);
    if (t) clearTimeout(t);
    pending.current.set(e.postId, setTimeout(() => { pending.current.delete(e.postId); void refreshPost(qc, e.postId); }, 350));
  }, () => { void qc.invalidateQueries({ queryKey: ['work', 'feed', 'list'] }); });
  useEffect(() => () => { for (const t of pending.current.values()) clearTimeout(t); }, []);

  const showFresh = () => {
    setFresh(0);
    void list.refetch();
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onTag = (t: string) => { setSearch(`#${t}`); setFilter('all'); topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const openDetail = (id: number) => setParams({ post: String(id), comment: null });

  if (scopesQ.isLoading) return <div className="mx-auto w-full max-w-[680px] space-y-3 px-4 py-6"><PostSkeleton /><PostSkeleton /></div>;
  if (scopesQ.error) return <EmptyState title={wt('feed.loadFailed')} body={workError(scopesQ.error)} action={<button type="button" className="w-btn" onClick={() => scopesQ.refetch()}>{wt('feed.retry')}</button>} />;
  if (!scopes.length || (mode !== 'all' && !wsScope) || (mode === 'project' && !wsScope?.projects.some((p) => p.id === projectId))) {
    return <EmptyState icon={<MessagesSquare size={20} />} title={wt('feed.noScopes')} body={wt('feed.noScopesBody')} />;
  }

  // Ô "Hiện bài từ".
  const selOptions: Array<{ v: string; label: string }> = [];
  if (mode === 'all') {
    selOptions.push({ v: '', label: wt('feed.scopeAll') });
    for (const s of scopes) {
      selOptions.push({ v: `w:${s.workspace.id}`, label: wt('feed.scopeEverything', { name: s.workspace.name }) });
      for (const p of s.projects) selOptions.push({ v: `p:${p.id}`, label: `   ${p.name}` });
    }
  } else if (mode === 'workspace' && wsScope) {
    selOptions.push({ v: '', label: wt('feed.scopeEverything', { name: wsScope.workspace.name }) });
    if (wsScope.role) selOptions.push({ v: `wo:${wsScope.workspace.id}`, label: wt('feed.scopeWsOnly') });
    for (const p of wsScope.projects) selOptions.push({ v: `p:${p.id}`, label: p.name });
  }

  const fixed = mode === 'project' && workspaceId ? { workspaceId, projectId: projectId ?? null } : null;
  const prefer = mode === 'workspace' && workspaceId ? (sel.startsWith('p:') ? { workspaceId, projectId: Number(sel.slice(2)) } : { workspaceId, projectId: null }) : (sel ? { workspaceId: selToQuery(sel).workspaceId ?? scopes.find((s) => s.projects.some((p) => `p:${p.id}` === sel))?.workspace.id ?? 0, projectId: selToQuery(sel).projectId ?? null } : null);
  const empty = !list.isLoading && !posts.length && !pinned.length;
  const emptyText = debounced ? [wt('feed.emptySearch'), wt('feed.emptySearchBody')]
    : filter === 'saved' ? [wt('feed.emptySaved'), wt('feed.emptySavedBody')]
    : filter === 'mine' ? [wt('feed.emptyMine'), wt('feed.emptyBody')]
    : filter === 'media' ? [wt('feed.emptyMedia'), wt('feed.emptyBody')]
    : filter === 'files' ? [wt('feed.emptyFiles'), wt('feed.emptyBody')]
    : [wt('feed.emptyTitle'), wt('feed.emptyBody')];

  return (
    <div className="mx-auto flex w-full max-w-[1040px] gap-6 px-3 py-4 sm:px-4 md:py-6">
      <div className="min-w-0 max-w-[680px] flex-1 space-y-3 xl:mx-0 mx-auto">
        <div ref={topRef} className="scroll-mt-4" />
        {tab === 'reports' && canModerate ? (
          <>
            <button type="button" className="w-btn w-btn-sm" onClick={() => setParams({ tab: null })}>← {wt('feed.backToFeed')}</button>
            <ReportsPanel workspaceId={mode === 'all' ? undefined : workspaceId} />
          </>
        ) : (
          <>
            <Composer scopes={scopes} fixed={fixed} prefer={prefer} onPosted={() => { setFresh(0); topRef.current?.scrollIntoView({ behavior: 'smooth' }); }} />

            <div className="flex flex-wrap items-center gap-2">
              <div className="-mx-1 flex min-w-0 flex-1 gap-1 overflow-x-auto px-1 pb-0.5" role="tablist" aria-label={wt('feed.filtersLabel')}>
                {FILTERS.map((f) => (
                  <button key={f.id} type="button" role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)}
                    className={cn('h-8 shrink-0 whitespace-nowrap rounded-full px-3 text-[13px] font-medium transition-colors', filter === f.id ? 'bg-[var(--w-text)] text-[var(--w-bg,var(--w-panel))]' : 'bg-[var(--w-sunken)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
                    {f.label()}
                  </button>
                ))}
              </div>
              {canModerate && (
                <button type="button" className="w-btn w-btn-sm xl:hidden" onClick={() => setParams({ tab: 'reports' })}>
                  <Flag size={13} />{wt('feed.reports')}{scopesQ.data?.openReports ? <span className="rounded-full bg-[var(--w-red)] px-1.5 text-[11px] font-semibold text-white">{scopesQ.data.openReports}</span> : null}
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative min-w-[180px] flex-1">
                <span className="sr-only">{wt('feed.search')}</span>
                <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
                <input type="search" className="w-input h-9 w-full pl-8 pr-8" placeholder={wt('feed.search')} value={search} onChange={(e) => setSearch(e.target.value)} data-testid="feed-search" />
                {search && <button type="button" className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[var(--w-text-3)] hover:bg-[var(--w-hover)]" aria-label={wt('feed.clearSearch')} onClick={() => setSearch('')}><X size={13} /></button>}
              </label>
              {selOptions.length > 1 && (
                <select className="w-input h-9 max-w-full sm:w-[230px]" value={sel} onChange={(e) => setSel(e.target.value)} aria-label={wt('feed.scopeLabel')}>
                  {selOptions.map((o) => <option key={o.v || 'all'} value={o.v}>{o.label}</option>)}
                </select>
              )}
            </div>

            {fresh > 0 && (
              <div className="sticky top-2 z-20 flex justify-center">
                <button type="button" onClick={showFresh} className="flex items-center gap-1.5 rounded-full bg-[var(--w-accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-[var(--w-shadow-pop)] transition-transform hover:-translate-y-0.5" data-testid="feed-new-pill">
                  <ArrowUp size={14} />{wt('feed.newPosts', { count: fresh })}
                </button>
              </div>
            )}

            {list.isLoading ? <div className="space-y-3"><PostSkeleton /><PostSkeleton /></div>
              : list.error ? <EmptyState title={wt('feed.loadFailed')} body={workError(list.error)} action={<button type="button" className="w-btn" onClick={() => list.refetch()}>{wt('feed.retry')}</button>} />
              : empty ? <div className="w-card"><EmptyState icon={<MessagesSquare size={20} />} title={emptyText[0]} body={emptyText[1]} /></div>
              : (
                <>
                  {pinned.length > 0 && (
                    <section aria-label={wt('feed.pinned')} className="space-y-3">
                      {pinned.map((p) => <PostCard key={`pin${p.id}`} post={p} onTag={onTag} onReport={setReport} onOpenDetail={openDetail} />)}
                    </section>
                  )}
                  <section aria-label={wt('feed.title')} className="space-y-3">
                    {posts.map((p) => <PostCard key={p.id} post={p} onTag={onTag} onReport={setReport} onOpenDetail={openDetail} />)}
                  </section>
                  <div ref={sentinel} className="h-px" />
                  {list.isFetchingNextPage ? <div className="flex justify-center py-4"><Spinner /></div>
                    : list.hasNextPage ? <div className="flex justify-center"><button type="button" className="w-btn w-btn-sm" onClick={() => list.fetchNextPage()}>{wt('feed.loadMore')}</button></div>
                    : posts.length > 3 ? <p className="py-4 text-center text-[12.5px] text-[var(--w-text-3)]">{wt('feed.caughtUp')}</p> : null}
                </>
              )}
          </>
        )}
      </div>
      <SideRail scopes={scopes} mode={mode} workspaceId={workspaceId} projectId={projectId} openReports={scopesQ.data?.openReports ?? 0} onReports={canModerate ? () => setParams({ tab: 'reports' }) : undefined} />
      {detailId && <PostDetail id={detailId} comment={detailComment} onClose={() => setParams({ post: null, comment: null })} onReport={setReport} onTag={onTag} />}
      <ReportDialog target={report} onClose={() => setReport(null)} onDone={() => {
        const t = report;
        setReport(null);
        if (t?.kind === 'post') dropPost(qc, t.id);
        else void qc.invalidateQueries({ queryKey: ['work', 'feed', 'comments'] });
      }} />
    </div>
  );
}
