'use client';

/** /work/<slug>/<KEY>/settings — cài đặt dự án. */

import { Suspense } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Archive, Boxes, Columns3, Github, Link2, Shapes, SlidersHorizontal, Tag, TextCursorInput, Trash2, TriangleAlert, Upload, Users, Workflow, Zap,
} from 'lucide-react';
import { workError } from '@/lib/work-api';
import { useProject } from '@/components/work/hooks';
import { EmptyState, Spinner } from '@/components/work/ui';
import { PageHeader, ReadOnlyNotice, SettingsLayout, type NavGroup, type TabDef } from '@/components/work/settings/shared';
import { Crumb, CrumbSep } from '@/components/work/ProjectHeader';
import ProjectDetails from '@/components/work/settings/ProjectDetails';
import ProjectMembers from '@/components/work/settings/ProjectMembers';
import ProjectLabels from '@/components/work/settings/ProjectLabels';
import ProjectComponents from '@/components/work/settings/ProjectComponents';
import ProjectWorkflow from '@/components/work/settings/ProjectWorkflow';
import ProjectBoard from '@/components/work/settings/ProjectBoard';
import ProjectIssueTypes from '@/components/work/settings/ProjectIssueTypes';
import ProjectFields from '@/components/work/settings/ProjectFields';
import ProjectAutomation from '@/components/work/settings/ProjectAutomation';
import ProjectGithub from '@/components/work/settings/ProjectGithub';
import ProjectImport from '@/components/work/settings/ProjectImport';
import ProjectShare from '@/components/work/settings/ProjectShare';
import ProjectTrash from '@/components/work/settings/ProjectTrash';
import ProjectDanger from '@/components/work/settings/ProjectDanger';

type Tab = 'details' | 'members' | 'labels' | 'components' | 'workflow' | 'board' | 'types' | 'fields' | 'automation' | 'github' | 'share' | 'import' | 'trash' | 'danger';

function ProjectSettings() {
  const params = useParams<{ ws: string; key: string }>();
  const slug = decodeURIComponent(params?.ws ?? '');
  const key = decodeURIComponent(params?.key ?? '').toUpperCase();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const { config, isLoading, error } = useProject(slug, key);

  // Nhóm điều hướng dọc; `?tab=` giữ nguyên như cũ.
  const perms = config?.permissions;
  const groups: NavGroup<Tab>[] = [
    { label: 'General', tabs: [
      { key: 'details', label: 'Details', icon: SlidersHorizontal },
      { key: 'members', label: 'Members', icon: Users },
      { key: 'labels', label: 'Labels', icon: Tag },
      { key: 'components', label: 'Components', icon: Boxes },
    ] },
    { label: 'Work', tabs: [
      { key: 'workflow', label: 'Workflow', icon: Workflow },
      { key: 'board', label: 'Board', icon: Columns3 },
      { key: 'types', label: 'Issue types', icon: Shapes },
      { key: 'fields', label: 'Fields', icon: TextCursorInput },
    ] },
    { label: 'Automation & integrations', tabs: [
      { key: 'automation', label: 'Automation', icon: Zap },
      { key: 'github', label: 'GitHub', icon: Github },
      { key: 'share', label: 'Public links', icon: Link2 },
    ] },
    { label: 'Data', tabs: [
      ...(perms?.settings ? [{ key: 'import' as const, label: 'Import', icon: Upload }] : []),
      ...(perms?.deleteIssues ? [{ key: 'trash' as const, label: 'Trash', icon: Trash2 }] : []),
    ] },
    { label: 'Danger zone', danger: true, tabs: perms?.settings ? [{ key: 'danger' as const, label: 'Danger zone', icon: TriangleAlert }] : [] },
  ];
  const tabs: TabDef<Tab>[] = groups.flatMap((g) => g.tabs);
  const raw = search?.get('tab') as Tab | null;
  const tab: Tab = raw && tabs.some((t) => t.key === raw) ? raw : 'details';
  const setTab = (t: Tab) => router.replace(`${pathname}${t === 'details' ? '' : `?tab=${t}`}`, { scroll: false });

  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
  if (error || !config) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title="Project settings" />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <EmptyState
            title="Project not found"
            body={workError(error, 'This project does not exist or you do not have access to it.')}
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Link href={`/work/${slug}`} className="w-btn w-btn-primary">Back to workspace</Link>
                <Link href="/work?tab=my-work" className="w-btn">My work</Link>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={
          <>
            <Crumb href={`/work/${slug}`} className="max-w-[160px] font-normal max-sm:hidden">{config.workspace.name}</Crumb>
            <CrumbSep className="mx-1.5 max-sm:hidden" />
            <Crumb href={`/work/${slug}/${config.key}/board`} className="max-w-[220px] font-normal">{config.name}</Crumb>
            <CrumbSep className="mx-1.5" />
            Settings
          </>
        }
      />
      <SettingsLayout groups={groups} active={tab} onChange={setTab} label="Project settings">
        {config.archivedAt && (
          <div className="mb-6 flex items-center gap-2 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5 text-[13px] text-[var(--w-text-2)]">
            <Archive size={14} className="shrink-0" />
            This project is archived. Restore it from the Danger zone to show it in the sidebar again.
          </div>
        )}
        {!config.permissions.settings && (
          <ReadOnlyNotice>You can view these settings, but only project admins can change them.</ReadOnlyNotice>
        )}
        {tab === 'details' && <ProjectDetails config={config} slug={slug} />}
        {tab === 'members' && <ProjectMembers config={config} slug={slug} />}
        {tab === 'labels' && <ProjectLabels config={config} slug={slug} />}
        {tab === 'components' && <ProjectComponents config={config} slug={slug} />}
        {tab === 'workflow' && <ProjectWorkflow config={config} slug={slug} />}
        {tab === 'board' && <ProjectBoard config={config} slug={slug} />}
        {tab === 'types' && <ProjectIssueTypes config={config} slug={slug} />}
        {tab === 'fields' && <ProjectFields config={config} slug={slug} />}
        {tab === 'automation' && <ProjectAutomation config={config} slug={slug} />}
        {tab === 'github' && <ProjectGithub config={config} slug={slug} />}
        {tab === 'share' && <ProjectShare config={config} slug={slug} />}
        {tab === 'trash' && <ProjectTrash config={config} slug={slug} />}
        {tab === 'import' && <ProjectImport config={config} slug={slug} />}
        {tab === 'danger' && <ProjectDanger config={config} slug={slug} />}
      </SettingsLayout>
    </div>
  );
}

export default function ProjectSettingsPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size={20} /></div>}>
      <ProjectSettings />
    </Suspense>
  );
}
