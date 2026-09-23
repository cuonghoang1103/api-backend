'use client';

/**
 * Board của dự án. Ngăn kéo chi tiết thẻ mở bằng `?issue=<số>` để link chia
 * sẻ được và nút Back đóng được ngăn kéo.
 */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Filter, Info, Plus, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { userName, workApi, workError, type ProjectConfig } from '@/lib/work-api';
import Board from '@/components/work/Board';
import CreateIssueDialog from '@/components/work/CreateIssueDialog';
import IssueDrawer from '@/components/work/IssueDrawer';
import GettingStartedCard from '@/components/work/onboarding/GettingStartedCard';
import StartProjectButton from '@/components/work/onboarding/StartProjectButton';
import ProjectHeader from '@/components/work/ProjectHeader';
import { CompleteSprintDialog } from '@/components/work/SprintDialogs';
import { CREATE_ISSUE_EVENT, useLookups, useProject, useProjectRealtime, wk } from '@/components/work/hooks';
import {
  EmptyState, IssueTypeIcon, isTyping, PickerList, Popover, Spinner, UserAvatar, useToggle,
} from '@/components/work/ui';

function daysLeft(end: string | null) {
  if (!end) return null;
  const d = Math.ceil((new Date(end).getTime() - Date.now()) / 86_400_000);
  return d;
}

function BoardView({ config, pid, slug }: { config: ProjectConfig; pid: number; slug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const lk = useLookups(config);
  const meId = useAuthStore((s) => s.user?.id);
  useProjectRealtime(pid);

  const board = useQuery({ queryKey: wk.board(pid), queryFn: () => workApi.board(pid) });
  const [q, setQ] = useState('');
  const [onlyMine, setOnlyMine] = useState(false);
  const [people, setPeople] = useState<number[]>([]);
  const [types, setTypes] = useState<number[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const typeMenu = useToggle();
  const typeRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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

  // Phím tắt: c = tạo thẻ, / = tìm.
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

  const issues = board.data?.issues;
  const assignees = useMemo(() => {
    const ids = new Set((issues ?? []).map((i) => i.assigneeId).filter((x): x is number => !!x));
    return config.members.filter((m) => ids.has(m.id));
  }, [issues, config.members]);

  const visible = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t && !onlyMine && !people.length && !types.length) return null;
    return new Set((issues ?? []).filter((i) => {
      if (onlyMine && i.assigneeId !== meId) return false;
      if (people.length && !(i.assigneeId && people.includes(i.assigneeId))) return false;
      if (types.length && !types.includes(i.typeId)) return false;
      if (t && !i.title.toLowerCase().includes(t) && !lk.issueKey(i.number).toLowerCase().includes(t)) return false;
      return true;
    }).map((i) => i.id));
  }, [issues, q, onlyMine, people, types, meId, lk]);
  const filtered = visible !== null;

  const sprint = board.data?.sprint;
  const left = daysLeft(sprint?.endAt ?? null);

  // Bộ lọc của trang — Board vẽ chung một hàng với Group by / quick filters.
  const filterControls = (
    <>
        <div className="relative">
          <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
          <input
            ref={searchRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && (setQ(''), (e.target as HTMLInputElement).blur())}
            placeholder="Search board"
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
        <button type="button" onClick={() => setOnlyMine((v) => !v)} className={cn('w-btn w-btn-sm', onlyMine && 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]')}>
          Only my issues
        </button>
        <button ref={typeRef} type="button" onClick={typeMenu.toggle} className={cn('w-btn w-btn-sm', types.length > 0 && 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]')}>
          <Filter size={12} /> Type{types.length > 0 && ` · ${types.length}`}
        </button>
        <Popover open={typeMenu.on} onClose={typeMenu.close} anchorRef={typeRef} width={220}>
          <PickerList
            multi
            options={config.issueTypes.filter((t) => t.level !== 1).map((t) => ({ value: t.id, label: t.name, icon: <IssueTypeIcon type={t} size={12} /> }))}
            selected={types}
            onPick={(id) => setTypes((ts) => (ts.includes(id) ? ts.filter((x) => x !== id) : [...ts, id]))}
            placeholder="Issue type…"
          />
        </Popover>
        {filtered && (
          <button type="button" onClick={() => { setQ(''); setOnlyMine(false); setPeople([]); setTypes([]); }} className="w-btn w-btn-ghost w-btn-sm">
            <X size={12} /> Clear
          </button>
        )}
    </>
  );

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={sprint ? sprint.name : 'Board'}>
        {sprint && left !== null && (
          <span className={cn('hidden text-[12px] sm:inline', left < 0 ? 'text-[var(--w-red)]' : 'text-[var(--w-text-3)]')}>
            {left < 0 ? `${-left} days overdue` : left === 0 ? 'Ends today' : `${left} days left`}
          </span>
        )}
        {sprint?.state === 'ACTIVE' && config.permissions.manageSprints && (
          <button type="button" className="w-btn w-btn-sm" onClick={() => setCompleteOpen(true)}>
            <CheckCircle2 size={13} /> <span className="hidden sm:inline">Complete sprint</span>
          </button>
        )}
        {config.permissions.createIssues && (
          <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setCreateOpen(true)} title="Create issue (C)">
            <Plus size={14} /> <span className="hidden sm:inline">Create</span>
          </button>
        )}
      </ProjectHeader>

      {board.data?.fallback && (
        <div className="flex shrink-0 items-center gap-2 border-b border-[var(--w-border)] bg-[var(--w-accent-soft)] px-4 py-2 text-[12px] text-[var(--w-text-2)]">
          <Info size={13} className="shrink-0 text-[var(--w-accent-text)]" />
          No sprint is running, so the board shows every open issue. Plan and start a sprint from the Backlog.
        </div>
      )}
      {sprint?.goal && (
        <div className="shrink-0 border-b border-[var(--w-border)] px-4 py-2 text-[12px] text-[var(--w-text-2)]">
          <span className="font-medium text-[var(--w-text)]">Sprint goal:</span> {sprint.goal}
        </div>
      )}

      {/* Danh sách "Getting started" — tự ẩn khi xong hoặc bị tắt. */}
      <GettingStartedCard config={config} slug={slug} onCreateIssue={config.permissions.createIssues ? () => setCreateOpen(true) : undefined} className="mx-4 mt-3 shrink-0" />

      <div className="min-h-0 flex-1">
        {board.isLoading ? (
          <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>
        ) : board.error ? (
          <EmptyState title="Could not load the board" body={workError(board.error)} action={<button type="button" className="w-btn" onClick={() => board.refetch()}>Try again</button>} />
        ) : board.data && !board.data.issues.length && !filtered ? (
          <EmptyState
            title="Nothing on the board yet"
            body={config.permissions.createIssues ? 'Create your first issue — press C anywhere on this page.' : 'Issues will appear here once your team creates them.'}
            action={config.permissions.createIssues ? <button type="button" className="w-btn w-btn-primary" onClick={() => setCreateOpen(true)}><Plus size={14} /> Create issue</button> : undefined}
          />
        ) : board.data ? (
          <Board config={config} lk={lk} data={board.data} visible={visible} onOpen={openIssue} toolbarLeading={filterControls} />
        ) : null}
      </div>

      <CreateIssueDialog open={createOpen} onClose={() => setCreateOpen(false)} config={config} onCreated={openIssue} />
      {sprint && completeOpen && (
        <CompleteSprintDialog
          open
          onClose={() => setCompleteOpen(false)}
          pid={pid}
          sprint={{ ...sprint, completedAt: null, committedPoints: null, completedPoints: null, position: 0 }}
          plannedSprints={config.sprints.filter((s) => s.state === 'PLANNED').map((s) => ({ ...s, completedAt: null, committedPoints: null, completedPoints: null, position: 0 }))}
        />
      )}
      <IssueDrawer pid={pid} num={issueParam} onClose={closeIssue} onOpenIssue={openIssue} />
    </div>
  );
}

// useSearchParams bắt buộc nằm trong <Suspense> — thiếu là Next 14 báo lỗi lúc build.
export default function BoardPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size={20} /></div>}>
      <BoardPageInner />
    </Suspense>
  );
}

function BoardPageInner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
  if (error || !config || !pid) {
    return <EmptyState title="Project not found" body={error ? workError(error) : 'It may have been deleted, or you do not have access.'} action={<StartProjectButton label="Start a new project" />} />;
  }
  return <BoardView config={config} pid={pid} slug={params.ws} />;
}
