'use client';

/** /work — "My work" (việc giao cho tôi ở mọi dự án) + danh sách không gian làm việc. Tab nằm trong `?tab=`. */

import { Suspense, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ChevronRight, Columns3, Compass, FolderKanban, Layers, Plus, RotateCcw, Users } from 'lucide-react';
import { workApi, workError, type WorkspaceSummary } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, Popover, relativeTime, Spinner, useToggle } from '@/components/work/ui';
import { PageHeader, WorkspaceMark, WS_ROLE_LABEL } from '@/components/work/settings/shared';
import CreateWorkspaceDialog from '@/components/work/workspace/CreateWorkspaceDialog';
import MyWork from '@/components/work/MyWork';
import HelpTourCard from '@/components/work/help/HelpTourCard';
import { cn } from '@/lib/utils';
import { openHelp } from '@/components/work/help/store';

type HomeTab = 'my-work' | 'workspaces';
const HOME_TABS: Array<{ id: HomeTab; label: string }> = [
  { id: 'my-work', label: 'My work' },
  { id: 'workspaces', label: 'Workspaces' },
];

const plural = (n: number, one: string) => `${n} ${one}${n === 1 ? '' : 's'}`;

/** Không gian mình sở hữu đã bị xoá — chỉ hiện khi có, khôi phục một chạm. */
function DeletedWorkspaces() {
  const qc = useQueryClient();
  const key = ['work', 'me', 'workspace-trash'] as const;
  const q = useQuery({ queryKey: key, queryFn: workApi.workspaceTrash, staleTime: 30_000 });
  const restore = useMutation({
    mutationFn: (id: number) => workApi.restoreWorkspace(id),
    onSuccess: (_d, id) => {
      const w = q.data?.find((x) => x.id === id);
      toast.success(w ? `${w.name} restored` : 'Workspace restored');
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: wk.workspaces });
    },
    onError: (err) => toast.error(workError(err, 'Could not restore the workspace')),
  });
  if (!q.data?.length) return null;
  return (
    <section className="mt-8">
      <h2 className="mb-1 text-[13px] font-semibold">Recently deleted workspaces</h2>
      <p className="mb-3 text-[12px] text-[var(--w-text-3)]">Workspaces you own that were deleted. Restoring brings back every project and member.</p>
      <div className="overflow-hidden rounded-[var(--w-radius-lg)] border border-dashed border-[var(--w-border-strong)]">
        {q.data.map((w) => {
          const pending = restore.isPending && restore.variables === w.id;
          return (
            <div key={w.id} className="flex items-center gap-3 border-b border-[var(--w-border)] px-4 py-2.5 last:border-b-0">
              <span className="opacity-60"><WorkspaceMark name={w.name} size={28} /></span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-[var(--w-text-2)]">{w.name}</div>
                <div className="truncate text-[12px] text-[var(--w-text-3)]">{plural(w._count.projects, 'project')} · deleted {relativeTime(w.deletedAt)}</div>
              </div>
              <button type="button" className="w-btn w-btn-sm shrink-0" disabled={pending} onClick={() => restore.mutate(w.id)}>
                {pending ? <Spinner size={11} /> : <RotateCcw size={13} />} Restore
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WorkspacesHome() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const dialog = useToggle();
  const q = useQuery({ queryKey: wk.workspaces, queryFn: workApi.workspaces, staleTime: 30_000 });

  // ?new=1 mở sẵn hộp tạo không gian (từ sidebar / bảng lệnh).
  const wantNew = params?.get('new') === '1';
  const openDialog = dialog.open;
  useEffect(() => {
    if (wantNew) openDialog();
  }, [wantNew, openDialog]);

  // Mặc định "My work" khi đã có ít nhất một không gian; chưa có thì là Workspaces (để thấy nút tạo).
  const rawTab = params?.get('tab');
  const hasWorkspace = !!q.data?.length;
  const tab: HomeTab = rawTab === 'my-work' || rawTab === 'workspaces' ? rawTab : hasWorkspace ? 'my-work' : 'workspaces';
  const setTab = useCallback((id: HomeTab) => {
    const p = new URLSearchParams(params?.toString());
    p.set('tab', id);
    router.replace(`${pathname ?? '/work'}?${p.toString()}`, { scroll: false });
  }, [router, pathname, params]);

  const closeDialog = () => {
    dialog.close();
    if (wantNew) {
      const p = new URLSearchParams(params?.toString());
      p.delete('new');
      const qs = p.toString();
      router.replace(qs ? `${pathname ?? '/work'}?${qs}` : (pathname ?? '/work'));
    }
  };

  const workspaces = q.data ?? [];
  const canCreateProject = workspaces.filter((w) => w.role !== 'GUEST');

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={q.isLoading ? 'CT Work' : !hasWorkspace ? 'Welcome' : tab === 'my-work' ? 'My work' : 'Workspaces'}
        actions={hasWorkspace ? (
          <>
            <button type="button" className="w-btn w-btn-sm max-sm:!hidden" onClick={dialog.open}>
              <Plus size={14} /> New workspace
            </button>
            <NewProjectButton workspaces={canCreateProject} onNewWorkspace={dialog.open} />
          </>
        ) : undefined}
      />
      {hasWorkspace && (
        <div className="shrink-0 overflow-x-auto border-b border-[var(--w-border)] px-4 md:px-6">
          <div className="flex gap-1" role="tablist" aria-label="Work home">
            {HOME_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'w-nav-row -mb-px whitespace-nowrap border-b-2 px-3 py-3 text-[14px] font-medium transition-colors',
                  tab === t.id ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]',
                )}
              >
                {t.label}
                {t.id === 'workspaces' && <span className="ml-1.5 text-[12px] font-normal text-[var(--w-text-3)] tabular-nums">{workspaces.length}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-[1120px] px-4 py-6 md:px-8 md:py-8">
          {q.isLoading ? (
            <div className="flex justify-center py-16"><Spinner size={20} /></div>
          ) : q.error ? (
            <EmptyState title="Couldn't load workspaces" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />
          ) : !hasWorkspace ? (
            <WelcomeHero onCreate={dialog.open} />
          ) : tab === 'my-work' ? (
            <>
              <PageIntro title="My work" sub="Everything assigned to you across all your projects, grouped by due date." />
              <HelpTourCard />
              <MyWork />
            </>
          ) : (
            <>
              <PageIntro title="Workspaces" sub="A workspace holds your team's projects and members. Open one to see its projects." />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {workspaces.map((w) => (
                  <Link key={w.id} href={`/work/${w.slug}`} className="w-card group flex flex-col p-4">
                    <div className="flex items-start gap-3">
                      <WorkspaceMark name={w.name} size={40} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[15px] font-semibold">{w.name}</div>
                        <span className="mt-1 inline-flex rounded-full border border-[var(--w-border-strong)] px-2 text-[12px] leading-[20px] text-[var(--w-text-2)]">
                          {WS_ROLE_LABEL[w.role]}
                        </span>
                      </div>
                      <ChevronRight size={16} className="mt-1 shrink-0 text-[var(--w-text-3)] transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-3 line-clamp-2 min-h-[40px] text-[13px] leading-relaxed text-[var(--w-text-2)]">
                      {w.description || <span className="text-[var(--w-text-3)]">No description</span>}
                    </p>
                    <div className="mt-3 flex items-center gap-4 border-t border-[var(--w-border)] pt-3 text-[13px] text-[var(--w-text-2)]">
                      <span className="flex items-center gap-1.5"><FolderKanban size={14} className="text-[var(--w-text-3)]" />{plural(w.projectCount, 'project')}</span>
                      <span className="flex items-center gap-1.5"><Users size={14} className="text-[var(--w-text-3)]" />{plural(w.memberCount, 'member')}</span>
                    </div>
                  </Link>
                ))}
                <button type="button" onClick={dialog.open} className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-[var(--w-radius-lg)] border border-dashed border-[var(--w-border-strong)] text-[14px] text-[var(--w-text-2)] transition-colors hover:border-[var(--w-accent-border)] hover:text-[var(--w-text)]">
                  <Plus size={18} /> New workspace
                </button>
              </div>
            </>
          )}
          {!q.isLoading && tab === 'workspaces' && <DeletedWorkspaces />}
        </div>
      </div>
      <CreateWorkspaceDialog open={dialog.on} onClose={closeDialog} />
    </div>
  );
}

/** Tiêu đề + phụ đề của phần nội dung. */
function PageIntro({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-[20px] font-semibold tracking-[-0.01em]">{title}</h2>
      <p className="mt-1 text-[14px] text-[var(--w-text-2)]">{sub}</p>
    </div>
  );
}

/** Màn chào khi chưa có không gian nào: một việc chính + tour 5 phút. */
function WelcomeHero({ onCreate }: { onCreate: () => void }) {
  const steps = [
    { icon: Layers, title: 'Create a workspace', body: 'One place for your team or class.' },
    { icon: FolderKanban, title: 'Start a project', body: 'Scrum, Kanban or Testing templates set up the workflow.' },
    { icon: Users, title: 'Invite your team', body: 'Assign issues, comment and run your first sprint.' },
  ];
  return (
    <div className="mx-auto flex max-w-[720px] flex-col items-center py-10 text-center md:py-16">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[14px] bg-[var(--w-accent)] text-white" style={{ boxShadow: '0 8px 24px color-mix(in srgb, var(--w-accent) 35%, transparent)' }}>
        <Columns3 size={26} />
      </div>
      <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[30px]">Plan, track and ship your team&apos;s work</h2>
      <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-[var(--w-text-2)]">
        Sprints, boards, bug tracking and test management in one place. Start with a workspace for your team — you&apos;ll add the first project right after.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
        <button type="button" className="w-btn w-btn-primary !h-10 !px-4 !text-[14px]" onClick={onCreate}>
          <Plus size={16} /> Create your first project
        </button>
        <button type="button" className="w-btn !h-10 !px-4 !text-[14px]" onClick={() => openHelp('getting-started')}>
          <Compass size={16} /> Take the 5-minute tour
        </button>
      </div>
      <ol className="mt-12 grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-3">
        {steps.map((st, i) => (
          <li key={st.title} className="w-card p-4">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--w-text-3)]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--w-accent-soft)] text-[12px] text-[var(--w-accent-text)]">{i + 1}</span>
              <st.icon size={14} />
            </div>
            <div className="mt-2 text-[14px] font-semibold">{st.title}</div>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--w-text-2)]">{st.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Nút chính "New project": một không gian thì đi thẳng, nhiều thì chọn. */
function NewProjectButton({ workspaces, onNewWorkspace }: { workspaces: WorkspaceSummary[]; onNewWorkspace: () => void }) {
  const router = useRouter();
  const pop = useToggle();
  const ref = useRef<HTMLButtonElement>(null);
  const go = (slug: string) => router.push(`/work/${slug}?newProject=1`);
  const click = () => {
    if (workspaces.length === 1) go(workspaces[0].slug);
    else if (!workspaces.length) onNewWorkspace();
    else pop.toggle();
  };
  return (
    <>
      <button ref={ref} type="button" className="w-btn w-btn-primary w-btn-sm" onClick={click} aria-haspopup={workspaces.length > 1 ? 'menu' : undefined}>
        <Plus size={14} /> New project
      </button>
      <Popover open={pop.on} onClose={pop.close} anchorRef={ref} width={260} align="end">
        <div className="p-1" role="menu">
          <div className="w-eyebrow px-2 pb-1 pt-1.5">Create in workspace</div>
          {workspaces.map((w) => (
            <button key={w.id} type="button" role="menuitem" onClick={() => { pop.close(); go(w.slug); }} className="flex h-9 w-full items-center gap-2.5 rounded-[6px] px-2 text-left text-[13px] hover:bg-[var(--w-hover)]">
              <WorkspaceMark name={w.name} size={22} />
              <span className="min-w-0 flex-1 truncate">{w.name}</span>
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}

export default function WorkHomePage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size={20} /></div>}>
      <WorkspacesHome />
    </Suspense>
  );
}
