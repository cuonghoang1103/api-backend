'use client';

/** /work — "My work" (việc giao cho tôi ở mọi dự án) + danh sách không gian làm việc. Tab nằm trong `?tab=`. */

import { Suspense, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Plus } from 'lucide-react';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, Spinner, useToggle } from '@/components/work/ui';
import { PageHeader, WorkspaceMark, WS_ROLE_LABEL } from '@/components/work/settings/shared';
import CreateWorkspaceDialog from '@/components/work/workspace/CreateWorkspaceDialog';
import MyWork from '@/components/work/MyWork';
import { cn } from '@/lib/utils';

type HomeTab = 'my-work' | 'workspaces';
const HOME_TABS: Array<{ id: HomeTab; label: string }> = [
  { id: 'my-work', label: 'My work' },
  { id: 'workspaces', label: 'Workspaces' },
];

const plural = (n: number, one: string) => `${n} ${one}${n === 1 ? '' : 's'}`;

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

  const newButton = (
    <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={dialog.open}>
      <Plus size={14} /> New workspace
    </button>
  );

  return (
    <div className="flex h-full flex-col">
      <PageHeader title={q.isLoading ? 'Work' : tab === 'my-work' ? 'My work' : 'Workspaces'} actions={newButton} />
      {!q.isLoading && (
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
                  '-mb-px whitespace-nowrap border-b-2 px-2.5 py-2.5 text-[13px] font-medium transition-colors',
                  tab === t.id ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-[960px] px-4 py-6 md:px-6">
          {!q.isLoading && tab === 'my-work' ? (
            <MyWork />
          ) : q.isLoading ? (
            <div className="flex justify-center py-16"><Spinner size={20} /></div>
          ) : q.error ? (
            <EmptyState title="Couldn't load workspaces" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />
          ) : !q.data?.length ? (
            <EmptyState
              title="Welcome to CT Work"
              body="Plan, track and ship projects with your team — sprints, boards, bug tracking and test management."
              action={<button type="button" className="w-btn w-btn-primary" onClick={dialog.open}><Plus size={14} /> Create a workspace</button>}
            />
          ) : (
            <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
              {q.data.map((w) => (
                <Link
                  key={w.id}
                  href={`/work/${w.slug}`}
                  className="group flex items-center gap-3 border-b border-[var(--w-border)] px-4 py-3 last:border-b-0 hover:bg-[var(--w-hover)]"
                >
                  <WorkspaceMark name={w.name} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[13px] font-medium">{w.name}</span>
                      <span className="shrink-0 rounded-[4px] border border-[var(--w-border-strong)] px-1.5 text-[11px] leading-[18px] text-[var(--w-text-2)]">
                        {WS_ROLE_LABEL[w.role]}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-[12px] text-[var(--w-text-3)]">
                      {plural(w.projectCount, 'project')} · {plural(w.memberCount, 'member')}
                      {w.description ? <span className="hidden sm:inline"> · {w.description}</span> : null}
                    </div>
                  </div>
                  <ChevronRight size={15} className="shrink-0 text-[var(--w-text-3)] opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <CreateWorkspaceDialog open={dialog.on} onClose={closeDialog} />
    </div>
  );
}

export default function WorkHomePage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size={20} /></div>}>
      <WorkspacesHome />
    </Suspense>
  );
}
