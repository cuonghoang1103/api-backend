'use client';

/** /work/<slug>/<KEY>/settings — cài đặt dự án. */

import { Suspense } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Archive } from 'lucide-react';
import { workError } from '@/lib/work-api';
import { useProject } from '@/components/work/hooks';
import { EmptyState, Spinner } from '@/components/work/ui';
import { PageHeader, ReadOnlyNotice, SettingsTabs, type TabDef } from '@/components/work/settings/shared';
import ProjectDetails from '@/components/work/settings/ProjectDetails';
import ProjectMembers from '@/components/work/settings/ProjectMembers';
import ProjectLabels from '@/components/work/settings/ProjectLabels';
import ProjectComponents from '@/components/work/settings/ProjectComponents';
import ProjectWorkflow from '@/components/work/settings/ProjectWorkflow';
import ProjectBoard from '@/components/work/settings/ProjectBoard';
import ProjectIssueTypes from '@/components/work/settings/ProjectIssueTypes';
import ProjectFields from '@/components/work/settings/ProjectFields';
import ProjectDanger from '@/components/work/settings/ProjectDanger';

type Tab = 'details' | 'members' | 'labels' | 'components' | 'workflow' | 'board' | 'types' | 'fields' | 'danger';

function ProjectSettings() {
  const params = useParams<{ ws: string; key: string }>();
  const slug = decodeURIComponent(params?.ws ?? '');
  const key = decodeURIComponent(params?.key ?? '').toUpperCase();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const { config, isLoading, error } = useProject(slug, key);

  const tabs: TabDef<Tab>[] = [
    { key: 'details', label: 'Details' },
    { key: 'members', label: 'Members' },
    { key: 'labels', label: 'Labels' },
    { key: 'components', label: 'Components' },
    { key: 'workflow', label: 'Workflow' },
    { key: 'board', label: 'Board' },
    { key: 'types', label: 'Issue types' },
    { key: 'fields', label: 'Fields' },
    ...(config?.permissions.settings ? [{ key: 'danger' as const, label: 'Danger zone' }] : []),
  ];
  const raw = search?.get('tab') as Tab | null;
  const tab: Tab = raw && tabs.some((t) => t.key === raw) ? raw : 'details';
  const setTab = (t: Tab) => router.replace(`${pathname}${t === 'details' ? '' : `?tab=${t}`}`, { scroll: false });

  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
  if (error || !config) {
    return (
      <div className="h-full overflow-y-auto">
        <EmptyState
          title="Project unavailable"
          body={workError(error, 'This project does not exist or you do not have access to it.')}
          action={<Link href={`/work/${slug}`} className="w-btn">Back to workspace</Link>}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={
          <>
            <Link href={`/work/${slug}/${config.key}/board`} className="text-[var(--w-text-2)] hover:text-[var(--w-text)]">{config.name}</Link>
            <span className="mx-1.5 text-[var(--w-text-3)]">/</span>
            Settings
          </>
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[960px] px-4 py-6 md:px-6">
          <SettingsTabs tabs={tabs} active={tab} onChange={setTab} />
          {config.archivedAt && (
            <div className="mb-6 flex items-center gap-2 rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[13px] text-[var(--w-text-2)]">
              <Archive size={13} className="shrink-0" />
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
          {tab === 'danger' && <ProjectDanger config={config} slug={slug} />}
        </div>
      </div>
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
