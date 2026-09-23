'use client';

/** /work/<slug> — tổng quan không gian: bảng dự án. */

import { Suspense, useEffect, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, CircleDot, FolderKanban, Lock, Plus, Settings } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { userName, workApi, workError, type ProjectSummary } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { avatarColor, EmptyState, Spinner, UserAvatar, useToggle } from '@/components/work/ui';
import { PageHeader, PROJECT_ROLE_LABEL, PROJECT_TYPE_LABEL, WorkspaceMark, WS_ROLE_LABEL } from '@/components/work/settings/shared';
import CreateProjectDialog from '@/components/work/workspace/CreateProjectDialog';

/** Thẻ dự án: ô khoá màu, tên, loại, người phụ trách, số việc đang mở. */
function ProjectCard({ p, slug, muted }: { p: ProjectSummary; slug: string; muted?: boolean }) {
  return (
    <Link href={`/work/${slug}/${p.key}/board`} className={cn('w-card group flex flex-col p-4', muted && 'opacity-70')}>
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          style={{ background: avatarColor(p.key) }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] text-[15px] font-bold text-white"
        >
          {p.key.slice(0, 2)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[15px] font-semibold">{p.name}</span>
            {p.visibility === 'PRIVATE' && <Lock size={13} className="shrink-0 text-[var(--w-text-3)]" aria-label="Private project" />}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-[var(--w-text-3)]">
            <span className="font-mono">{p.key}</span>
            <span aria-hidden="true">·</span>
            <span>{PROJECT_TYPE_LABEL[p.type]}</span>
            <span aria-hidden="true">·</span>
            <span>{PROJECT_ROLE_LABEL[p.role]}</span>
          </div>
        </div>
        <ChevronRight size={16} className="mt-1 shrink-0 text-[var(--w-text-3)] transition-transform group-hover:translate-x-0.5" />
      </div>
      {p.description && <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-[var(--w-text-2)]">{p.description}</p>}
      <div className="min-h-[12px] flex-1" />
      <div className="flex items-center justify-between gap-3 border-t border-[var(--w-border)] pt-3 text-[13px] text-[var(--w-text-2)]">
        {p.lead ? (
          <span className="flex min-w-0 items-center gap-2">
            <UserAvatar user={p.lead} size={22} />
            <span className="truncate">{userName(p.lead)}</span>
          </span>
        ) : (
          <span className="text-[var(--w-text-3)]">No lead</span>
        )}
        <span className="flex shrink-0 items-center gap-1.5 tabular-nums">
          <CircleDot size={14} className="text-[var(--w-blue)]" />
          {p.openIssues} open
        </span>
      </div>
    </Link>
  );
}

function ProjectGrid({ projects, slug, muted }: { projects: ProjectSummary[]; slug: string; muted?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((p) => <ProjectCard key={p.id} p={p} slug={slug} muted={muted} />)}
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

  if (q.isLoading) return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
  if (q.error || !ws) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title="Workspace" />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <EmptyState title="Workspace not found" body={workError(q.error, 'This workspace does not exist or you no longer have access to it.')} />
        </div>
      </div>
    );
  }

  const openIssues = active.reduce((n, p) => n + p.openIssues, 0);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={ws.name}
        actions={
          <>
            <Link href={`/work/${slug}/settings`} className="w-btn w-btn-sm" aria-label="Members & settings" title="Members & settings">
              <Settings size={14} /> <span className="max-sm:hidden">Members &amp; settings</span>
            </Link>
            {canCreate && (
              <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={dialog.open}>
                <Plus size={14} /> New project
              </button>
            )}
          </>
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1120px] px-4 py-6 md:px-8 md:py-8">
          <div className="mb-6 flex items-start gap-4">
            <WorkspaceMark name={ws.name} size={48} />
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[20px] font-semibold tracking-[-0.01em]">{ws.name}</h2>
              <p className="mt-1 text-[14px] text-[var(--w-text-2)]">
                {ws.description || 'Your team\'s projects live here. Open one to see its board, backlog and reports.'}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[var(--w-text-3)]">
                <span>{active.length} project{active.length === 1 ? '' : 's'}</span>
                <span>{openIssues} open issue{openIssues === 1 ? '' : 's'}</span>
                <span>Your role: {WS_ROLE_LABEL[ws.role]}</span>
              </div>
            </div>
          </div>

          {active.length ? (
            <ProjectGrid projects={active} slug={slug} />
          ) : (
            <div className="w-card !border-dashed !shadow-none">
              <EmptyState
                icon={<FolderKanban size={20} />}
                title="No projects yet"
                body={canCreate
                  ? 'Create a project to start planning sprints, tracking bugs and managing tests. Templates set up the workflow for you.'
                  : 'You have not been added to any project in this workspace yet. Ask a workspace admin to add you.'}
                action={canCreate ? <button type="button" className="w-btn w-btn-primary" onClick={dialog.open}><Plus size={14} /> Create your first project</button> : undefined}
              />
            </div>
          )}

          {archived.length > 0 && (
            <div className="mt-10">
              <button
                type="button"
                onClick={() => setShowArchived((v) => !v)}
                className="mb-3 flex h-8 items-center gap-1.5 text-[14px] font-medium text-[var(--w-text-2)] hover:text-[var(--w-text)]"
                aria-expanded={showArchived}
              >
                <ChevronRight size={14} className={cn('transition-transform', showArchived && 'rotate-90')} />
                Archived
                <span className="text-[var(--w-text-3)]">{archived.length}</span>
              </button>
              {showArchived && <ProjectGrid projects={archived} slug={slug} muted />}
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
