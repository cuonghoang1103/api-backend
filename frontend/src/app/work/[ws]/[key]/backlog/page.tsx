'use client';

/**
 * Trang Backlog: lập kế hoạch sprint. Ngăn kéo chi tiết thẻ mở bằng `?issue=`.
 */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Layers, PanelLeft, Plus, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workApi, workError, type BacklogIssue, type ProjectConfig } from '@/lib/work-api';
import Backlog from '@/components/work/Backlog';
import CreateIssueDialog from '@/components/work/CreateIssueDialog';
import IssueDrawer from '@/components/work/IssueDrawer';
import ProjectHeader from '@/components/work/ProjectHeader';
import { CREATE_ISSUE_EVENT, useLookups, useProject, useProjectRealtime, wk } from '@/components/work/hooks';
import { EmptyState, isTyping, Spinner, UserAvatar } from '@/components/work/ui';

const EPIC_PANEL_KEY = 'work.backlog.epics';

function BacklogView({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const lk = useLookups(config);
  useProjectRealtime(pid);
  const backlog = useQuery({ queryKey: wk.backlog(pid), queryFn: () => workApi.backlog(pid) });

  const [q, setQ] = useState('');
  const [people, setPeople] = useState<number[]>([]);
  /** null = mọi epic · 0 = thẻ không thuộc epic nào · số = một epic. */
  const [epic, setEpic] = useState<number | null>(null);
  const [epicPanel, setEpicPanel] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { setEpicPanel(localStorage.getItem(EPIC_PANEL_KEY) !== '0'); } catch { /* localStorage bị chặn */ }
  }, []);
  const toggleEpics = () => setEpicPanel((v) => {
    try { localStorage.setItem(EPIC_PANEL_KEY, v ? '0' : '1'); } catch { /* bỏ qua */ }
    return !v;
  });

  const issueParam = Number(search?.get('issue')) || null;
  const openIssue = useCallback((n: number) => {
    const p = new URLSearchParams(search?.toString());
    p.set('issue', String(n));
    router.push(`${pathname}?${p.toString()}`, { scroll: false });
  }, [router, pathname, search]);
  const closeIssue = useCallback(() => {
    const p = new URLSearchParams(search?.toString());
    p.delete('issue');
    const s = p.toString();
    router.push(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [router, pathname, search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey || issueParam || document.querySelector('[role="dialog"]')) return;
      if (e.key === 'c' && config.permissions.createIssues) { e.preventDefault(); setCreateOpen(true); }
      if (e.key === '/') { e.preventDefault(); searchRef.current?.focus(); }
    };
    const onCreate = () => config.permissions.createIssues && setCreateOpen(true);
    document.addEventListener('keydown', onKey);
    window.addEventListener(CREATE_ISSUE_EVENT, onCreate);
    return () => { document.removeEventListener('keydown', onKey); window.removeEventListener(CREATE_ISSUE_EVENT, onCreate); };
  }, [config.permissions.createIssues, issueParam]);

  const data = backlog.data;
  const assignees = useMemo(() => {
    const ids = new Set((data?.issues ?? []).map((i) => i.assigneeId).filter((x): x is number => !!x));
    return config.members.filter((m) => ids.has(m.id));
  }, [data?.issues, config.members]);

  const filter = useCallback((i: BacklogIssue) => {
    const t = q.trim().toLowerCase();
    if (t && !i.title.toLowerCase().includes(t) && !lk.issueKey(i.number).toLowerCase().includes(t)) return false;
    if (people.length && !(i.assigneeId && people.includes(i.assigneeId))) return false;
    if (epic === 0 && i.parentId) return false;
    if (epic && i.parentId !== epic) return false;
    return true;
  }, [q, people, epic, lk]);
  const filtered = !!q.trim() || people.length > 0 || epic !== null;

  if (config.type === 'KANBAN') {
    return (
      <div className="flex h-full flex-col">
        <ProjectHeader config={config} title="Backlog" />
        <EmptyState title="Kanban projects have no sprints" body="Work flows continuously on the board. Switch to a Scrum project to plan in sprints." />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title="Backlog">
        {config.permissions.createIssues && (
          <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setCreateOpen(true)} title="Create issue (C)">
            <Plus size={14} /> <span className="hidden sm:inline">Create</span>
          </button>
        )}
      </ProjectHeader>

      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[var(--w-border)] px-4 py-2">
        <button type="button" onClick={toggleEpics} className={cn('w-btn w-btn-sm max-md:!hidden', epicPanel && 'bg-[var(--w-active)]')} title="Show epics">
          <PanelLeft size={13} /> Epics
        </button>
        <div className="relative">
          <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
          <input
            ref={searchRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && (setQ(''), (e.target as HTMLInputElement).blur())}
            placeholder="Search backlog"
            className="w-input h-[28px] w-[180px] pl-7 text-[12px]"
          />
        </div>
        <div className="flex items-center -space-x-1">
          {assignees.slice(0, 8).map((m) => (
            <button
              key={m.id}
              type="button"
              title={userName(m)}
              onClick={() => setPeople((p) => (p.includes(m.id) ? p.filter((x) => x !== m.id) : [...p, m.id]))}
              className={cn('rounded-full ring-2 ring-[var(--w-panel)] transition-transform hover:z-10 hover:-translate-y-0.5', people.includes(m.id) && 'z-10 ring-[var(--w-accent)]')}
            >
              <UserAvatar user={m} size={24} />
            </button>
          ))}
        </div>
        {filtered && (
          <button type="button" onClick={() => { setQ(''); setPeople([]); setEpic(null); }} className="w-btn w-btn-ghost w-btn-sm"><X size={12} /> Clear</button>
        )}
        <span className="ml-auto hidden text-[12px] text-[var(--w-text-3)] lg:inline">
          Drag to plan · <span className="w-kbd">⌘</span>/<span className="w-kbd">⇧</span>+click to select many
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        {epicPanel && data && (
          <aside className="hidden w-[248px] shrink-0 overflow-y-auto border-r border-[var(--w-border)] p-2 md:block">
            <div className="mb-1 flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">
              <Layers size={12} /> Epics
            </div>
            {[{ id: null as number | null, label: 'All issues' }, { id: 0, label: 'Issues without epic' }].map((o) => (
              <button
                key={String(o.id)}
                type="button"
                onClick={() => setEpic(o.id)}
                className={cn('flex w-full items-center rounded-[5px] px-2 py-1.5 text-left text-[13px]', epic === o.id ? 'bg-[var(--w-active)]' : 'hover:bg-[var(--w-hover)]')}
              >
                {o.label}
              </button>
            ))}
            <div className="my-1.5 border-t border-[var(--w-border)]" />
            {data.epics.map((e) => {
              const pct = e.total ? Math.round((e.completed / e.total) * 100) : 0;
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setEpic(epic === e.id ? null : e.id)}
                  onDoubleClick={() => openIssue(e.number)}
                  title="Click to filter · double-click to open"
                  className={cn('mb-0.5 w-full rounded-[6px] px-2 py-1.5 text-left', epic === e.id ? 'bg-[var(--w-active)]' : 'hover:bg-[var(--w-hover)]')}
                >
                  <div className="flex items-center gap-1.5 text-[13px]">
                    <span className="h-2 w-2 shrink-0 rounded-[2px] bg-[#7c3aed]" />
                    <span className={cn('min-w-0 flex-1 truncate', e.done && 'text-[var(--w-text-3)] line-through')}>{e.title}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--w-sunken)]">
                      <div className="h-full bg-[var(--w-green)]" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] tabular text-[var(--w-text-3)]">{e.completed}/{e.total}</span>
                  </div>
                </button>
              );
            })}
            {!data.epics.length && <p className="px-2 py-1 text-[12px] text-[var(--w-text-3)]">No epics yet. Create one to group related stories.</p>}
          </aside>
        )}
        <div className="min-w-0 flex-1 overflow-y-auto">
          {backlog.isLoading ? (
            <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>
          ) : backlog.error ? (
            <EmptyState title="Could not load the backlog" body={workError(backlog.error)} action={<button type="button" className="w-btn" onClick={() => backlog.refetch()}>Try again</button>} />
          ) : data ? (
            <Backlog config={config} lk={lk} data={data} onOpen={openIssue} filter={filter} />
          ) : null}
        </div>
      </div>

      <CreateIssueDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        config={config}
        onCreated={openIssue}
      />
      <IssueDrawer pid={pid} num={issueParam} onClose={closeIssue} onOpenIssue={openIssue} />
    </div>
  );
}

export default function BacklogPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size={20} /></div>}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
  if (error || !config || !pid) return <EmptyState title="Project not found" body={error ? workError(error) : 'It may have been deleted, or you do not have access.'} />;
  return <BacklogView config={config} pid={pid} />;
}
