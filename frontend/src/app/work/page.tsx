'use client';

/** /work — danh sách không gian làm việc của người dùng. */

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Plus } from 'lucide-react';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, Spinner, useToggle } from '@/components/work/ui';
import { PageHeader, WorkspaceMark, WS_ROLE_LABEL } from '@/components/work/settings/shared';
import CreateWorkspaceDialog from '@/components/work/workspace/CreateWorkspaceDialog';

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

  const closeDialog = () => {
    dialog.close();
    if (wantNew) router.replace(pathname ?? '/work');
  };

  const newButton = (
    <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={dialog.open}>
      <Plus size={14} /> New workspace
    </button>
  );

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Workspaces" actions={newButton} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[960px] px-4 py-6 md:px-6">
          {q.isLoading ? (
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
