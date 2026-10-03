'use client';

/** /work/<slug> — tổng quan không gian: bảng dự án. */

import { Suspense, useEffect, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, ChevronRight, FolderKanban, Lock, Plus, Settings } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { userName, workApi, workError, type ProjectSummary } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { avatarColor, EmptyState, PageLoading, ProjectMark, StatusGlyph, UserAvatar, useToggle } from '@/components/work/ui';
import { PageHeader, PROJECT_ROLE_LABEL, PROJECT_TYPE_LABEL, WorkspaceMark, WS_ROLE_LABEL } from '@/components/work/settings/shared';
import CreateProjectDialog from '@/components/work/workspace/CreateProjectDialog';

/** Thẻ dự án: ô màu theo khoá, tên, loại, vai trò, người phụ trách, số việc đang mở. */
function ProjectCard({ p, slug, muted }: { p: ProjectSummary; slug: string; muted?: boolean }) {
  return (
    <Link
      href={`/work/${slug}/${p.key}/board`}
      className={cn('w-card group relative flex min-w-0 flex-col overflow-hidden p-4 pl-5', muted && 'opacity-70')}
    >
      {/* Dải màu dự án bên trái — nhận ra dự án bằng màu trước khi đọc chữ. */}
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px]" style={{ background: avatarColor(p.key) }} />
      <div className="flex items-start gap-3">
        <ProjectMark k={p.key} size={36} letters={2} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[15px] font-semibold tracking-[-0.01em]">{p.name}</span>
            {p.visibility === 'PRIVATE' && <Lock size={13} className="shrink-0 text-[var(--w-text-3)]" aria-label="Private project" />}
          </div>
          <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-1.5 text-[12px] text-[var(--w-text-3)]">
            <span className="font-mono">{p.key}</span>
            <span aria-hidden="true">·</span>
            <span>{PROJECT_TYPE_LABEL[p.type]}</span>
            <span aria-hidden="true">·</span>
            <span>{PROJECT_ROLE_LABEL[p.role]}</span>
          </div>
        </div>
        <ArrowUpRight size={16} className="mt-0.5 shrink-0 text-[var(--w-text-3)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
      </div>
      {p.description && <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-[var(--w-text-2)]">{p.description}</p>}
      <div className="min-h-[14px] flex-1" />
      <div className="flex items-center justify-between gap-3 border-t border-[var(--w-border)] pt-3 text-[13px] text-[var(--w-text-2)]">
        {p.lead ? (
          <span className="flex min-w-0 items-center gap-2">
            <UserAvatar user={p.lead} size={20} />
            <span className="truncate">{userName(p.lead)}</span>
          </span>
        ) : (
          <span className="text-[var(--w-text-3)]">No lead</span>
        )}
        <span className="flex shrink-0 items-center gap-1.5 tabular-nums" title={`${p.openIssues} open issues`}>
          <StatusGlyph category="IN_PROGRESS" size={13} />
          <span className="font-semibold text-[var(--w-text)]">{p.openIssues}</span> open
        </span>
      </div>
    </Link>
  );
}

function ProjectGrid({ projects, slug, muted, onNew }: { projects: ProjectSummary[]; slug: string; muted?: boolean; onNew?: () => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))]">
      {projects.map((p) => <ProjectCard key={p.id} p={p} slug={slug} muted={muted} />)}
      {onNew && (
        <button
          type="button"
          onClick={onNew}
          className="flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-[var(--w-border-strong)] text-[13px] font-medium text-[var(--w-text-2)] transition-colors hover:border-[var(--w-accent-border)] hover:bg-[var(--w-accent-soft)] hover:text-[var(--w-accent-text)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--w-border-strong)]"><Plus size={15} /></span>
          New project
        </button>
      )}
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

  if (q.isLoading) return <PageLoading />;
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
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <WorkspaceMark name={ws.name} size={48} />
              <div className="min-w-0 flex-1">
                <h2 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] [overflow-wrap:anywhere]">{ws.name}</h2>
                <p className="mt-1 max-w-[560px] text-[14px] text-[var(--w-text-2)]">
                  {ws.description || 'Your team\'s projects live here. Open one to see its board, backlog and reports.'}
                </p>
              </div>
            </div>
            {/* Ba con số thật của không gian — không trang trí. */}
            <dl className="grid shrink-0 grid-cols-3 overflow-hidden rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] text-center sm:w-[340px]">
              <div className="px-3 py-2">
                <dt className="text-[12px] text-[var(--w-text-3)]">Projects</dt>
                <dd className="text-[18px] font-semibold tabular-nums">{active.length}</dd>
              </div>
              <div className="border-x border-[var(--w-border)] px-3 py-2">
                <dt className="text-[12px] text-[var(--w-text-3)]">Open issues</dt>
                <dd className="text-[18px] font-semibold tabular-nums">{openIssues}</dd>
              </div>
              <div className="px-3 py-2">
                <dt className="text-[12px] text-[var(--w-text-3)]">Your role</dt>
                <dd className="truncate pt-1 text-[13px] font-semibold leading-[22px]">{WS_ROLE_LABEL[ws.role]}</dd>
              </div>
            </dl>
          </div>

          {active.length > 0 && (
            <div className="mb-3 flex items-center gap-2">
              <h3 className="w-section-title">Projects</h3>
              <span className="w-count">{active.length}</span>
            </div>
          )}
          {active.length ? (
            <ProjectGrid projects={active} slug={slug} onNew={canCreate ? dialog.open : undefined} />
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
    <Suspense fallback={<PageLoading />}>
      <WorkspaceOverview />
    </Suspense>
  );
}
