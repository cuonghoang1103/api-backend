'use client';

/** /work/<slug> — tổng quan không gian: bảng dự án. */

import { Suspense, useEffect, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Lock, Plus, Settings } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { userName, workApi, workError, type ProjectSummary } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, Spinner, UserAvatar, useToggle } from '@/components/work/ui';
import { PageHeader, PROJECT_ROLE_LABEL, PROJECT_TYPE_LABEL } from '@/components/work/settings/shared';
import CreateProjectDialog from '@/components/work/workspace/CreateProjectDialog';

function ProjectRow({ p, onOpen, muted }: { p: ProjectSummary; onOpen: () => void; muted?: boolean }) {
  return (
    <tr
      onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      tabIndex={0}
      className={cn('cursor-pointer border-b border-[var(--w-border)] last:border-b-0 hover:bg-[var(--w-hover)] focus:bg-[var(--w-hover)] focus:outline-none', muted && 'text-[var(--w-text-2)]')}
    >
      <td className="w-[88px] py-2.5 pl-4 pr-2 font-mono text-[12px] font-medium text-[var(--w-text-2)]">{p.key}</td>
      <td className="max-w-0 px-2 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-medium">{p.name}</span>
          {p.visibility === 'PRIVATE' && <Lock size={12} className="shrink-0 text-[var(--w-text-3)]" aria-label="Private project" />}
        </div>
      </td>
      <td className="hidden px-2 py-2.5 text-[var(--w-text-2)] md:table-cell">{PROJECT_TYPE_LABEL[p.type]}</td>
      <td className="hidden px-2 py-2.5 md:table-cell">
        {p.lead ? (
          <span className="flex min-w-0 items-center gap-2">
            <UserAvatar user={p.lead} size={20} />
            <span className="truncate text-[var(--w-text-2)]">{userName(p.lead)}</span>
          </span>
        ) : (
          <span className="text-[var(--w-text-3)]">—</span>
        )}
      </td>
      <td className="tabular px-2 py-2.5 text-right text-[var(--w-text-2)]">{p.openIssues}</td>
      <td className="hidden px-2 py-2.5 text-[var(--w-text-2)] sm:table-cell">{PROJECT_ROLE_LABEL[p.role]}</td>
      <td className="w-8 pr-3 text-[var(--w-text-3)]"><ChevronRight size={14} /></td>
    </tr>
  );
}

function ProjectTable({ projects, onOpen, muted }: { projects: ProjectSummary[]; onOpen: (p: ProjectSummary) => void; muted?: boolean }) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
      <table className="w-full table-fixed text-[13px]">
        <thead>
          <tr className="border-b border-[var(--w-border)] bg-[var(--w-sunken)] text-left text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">
            <th className="w-[88px] py-2 pl-4 pr-2 font-medium">Key</th>
            <th className="px-2 py-2 font-medium">Name</th>
            <th className="hidden w-[90px] px-2 py-2 font-medium md:table-cell">Type</th>
            <th className="hidden w-[180px] px-2 py-2 font-medium md:table-cell">Lead</th>
            <th className="w-[64px] px-2 py-2 text-right font-medium">Open</th>
            <th className="hidden w-[90px] px-2 py-2 font-medium sm:table-cell">Your role</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => <ProjectRow key={p.id} p={p} onOpen={() => onOpen(p)} muted={muted} />)}
        </tbody>
      </table>
    </div>
  );
}

function WorkspaceOverview() {
  const params = useParams<{ ws: string }>();
  const slug = decodeURIComponent(params?.ws ?? '');
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const dialog = useToggle();
  const [showArchived, setShowArchived] = useState(false);

  const q = useQuery({ queryKey: wk.workspace(slug), queryFn: () => workApi.workspaceBySlug(slug), enabled: !!slug, staleTime: 30_000 });
  const ws = q.data;
  const canCreate = !!ws && ws.role !== 'GUEST';

  const wantNew = search?.get('newProject') === '1';
  const openDialog = dialog.open;
  useEffect(() => {
    if (wantNew && canCreate) openDialog();
  }, [wantNew, canCreate, openDialog]);

  const closeDialog = () => {
    dialog.close();
    if (wantNew) router.replace(pathname ?? `/work/${slug}`);
  };

  const active = ws?.projects.filter((p) => !p.archivedAt) ?? [];
  const archived = ws?.projects.filter((p) => p.archivedAt) ?? [];
  const open = (p: ProjectSummary) => router.push(`/work/${slug}/${p.key}/board`);

  if (q.isLoading) return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
  if (q.error || !ws) {
    return (
      <div className="h-full overflow-y-auto">
        <EmptyState
          title="Workspace unavailable"
          body={workError(q.error, 'This workspace does not exist or you no longer have access to it.')}
          action={<Link href="/work" className="w-btn">Back to workspaces</Link>}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={ws.name}
        sub={`${active.length} project${active.length === 1 ? '' : 's'}`}
        actions={
          <>
            <Link href={`/work/${slug}/settings`} className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label="Workspace settings" title="Workspace settings">
              <Settings size={15} />
            </Link>
            {canCreate && (
              <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={dialog.open}>
                <Plus size={14} /> <span className="hidden sm:inline">Create project</span><span className="sm:hidden">New</span>
              </button>
            )}
          </>
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1100px] px-4 py-6 md:px-6">
          {ws.description && <p className="mb-5 max-w-[720px] text-[13px] leading-relaxed text-[var(--w-text-2)]">{ws.description}</p>}

          {active.length ? (
            <ProjectTable projects={active} onOpen={open} />
          ) : (
            <div className="rounded-[8px] border border-dashed border-[var(--w-border-strong)]">
              <EmptyState
                title="No projects yet"
                body={canCreate
                  ? 'Create a project to start planning sprints, tracking bugs and managing tests. Templates set up the workflow for you.'
                  : 'You have not been added to any project in this workspace yet. Ask a workspace admin to add you.'}
                action={canCreate ? <button type="button" className="w-btn w-btn-primary" onClick={dialog.open}><Plus size={14} /> Create project</button> : undefined}
              />
            </div>
          )}

          {archived.length > 0 && (
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setShowArchived((v) => !v)}
                className="mb-2 flex items-center gap-1.5 text-[12px] font-medium text-[var(--w-text-2)] hover:text-[var(--w-text)]"
                aria-expanded={showArchived}
              >
                <ChevronRight size={13} className={cn('transition-transform', showArchived && 'rotate-90')} />
                Archived
                <span className="text-[var(--w-text-3)]">{archived.length}</span>
              </button>
              {showArchived && <ProjectTable projects={archived} onOpen={open} muted />}
            </div>
          )}
        </div>
      </div>
      {canCreate && <CreateProjectDialog open={dialog.on} onClose={closeDialog} workspaceId={ws.id} slug={slug} />}
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size={20} /></div>}>
      <WorkspaceOverview />
    </Suspense>
  );
}
