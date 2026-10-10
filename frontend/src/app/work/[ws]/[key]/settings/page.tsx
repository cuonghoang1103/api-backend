'use client';

/** /work/<slug>/<KEY>/settings — cài đặt dự án. */

import { Suspense } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Archive, Blocks, Bot, Boxes, CalendarClock, Columns3, Download, Gauge, GitMerge, Github, Link2, MessageSquareShare, Shapes, SlidersHorizontal, Tag, TextCursorInput, Trash2, TriangleAlert, Upload, Users, Workflow, Zap,
} from 'lucide-react';
import { workError } from '@/lib/work-api';
import { useProject } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { PageHeader, ReadOnlyNotice, SettingsLayout, type NavGroup, type TabDef } from '@/components/work/settings/shared';
import ProjectHeader from '@/components/work/ProjectHeader';
import ProjectDetails from '@/components/work/settings/ProjectDetails';
import ProjectStudio from '@/components/work/settings/ProjectStudio';
import ProjectMembers from '@/components/work/settings/ProjectMembers';
import ProjectLabels from '@/components/work/settings/ProjectLabels';
import ProjectComponents from '@/components/work/settings/ProjectComponents';
import ProjectWorkflow from '@/components/work/settings/ProjectWorkflow';
import ProjectBoard from '@/components/work/settings/ProjectBoard';
import ProjectIssueTypes from '@/components/work/settings/ProjectIssueTypes';
import ProjectFields from '@/components/work/settings/ProjectFields';
import ProjectAutomation from '@/components/work/settings/ProjectAutomation';
import ProjectRecurring from '@/components/work/settings/ProjectRecurring'; // CTW đợt 5: việc định kỳ
import ProjectGithub from '@/components/work/settings/ProjectGithub';
import ProjectCloud from '@/components/work/settings/ProjectCloud'; // CTW đợt 8a
import { Cloud } from 'lucide-react'; // CTW đợt 8a
import ProjectGitlab from '@/components/work/settings/ProjectGitlab';
import ProjectChat from '@/components/work/settings/ProjectChat';
import ProjectExport from '@/components/work/settings/ProjectExport';
import ProjectImport from '@/components/work/settings/ProjectImport';
import ProjectShare from '@/components/work/settings/ProjectShare';
import ProjectTrash from '@/components/work/settings/ProjectTrash';
import ProjectDanger from '@/components/work/settings/ProjectDanger';
// Đợt S6: cổng Spec Fidelity + luật AI-assisted.
import ProjectSpecQuality from '@/components/work/settings/ProjectSpecQuality';
// CTW-28 A14: luật cho AI agent (Done ⇒ Review, lease, người duyệt).
import ProjectAgents from '@/components/work/settings/ProjectAgents';
import { wt } from '@/components/work/i18n';

type Tab = 'details' | 'studio' | 'members' | 'labels' | 'components' | 'workflow' | 'board' | 'types' | 'fields' | 'quality' | 'agents' | 'automation' | 'recurring' | 'github' | 'gitlab' | 'cloud' | 'chat' | 'share' | 'export' | 'import' | 'trash' | 'danger';

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
    { get label() { return wt('settings.tGeneral'); }, tabs: [
      { key: 'details', get label() { return wt('settings.tDetails'); }, icon: SlidersHorizontal },
      { key: 'studio', get label() { return wt('settings.tProjectTypeModules'); }, icon: Blocks },
      { key: 'members', get label() { return wt('settings.tMembers'); }, icon: Users },
      { key: 'labels', get label() { return wt('settings.tLabels'); }, icon: Tag },
      { key: 'components', get label() { return wt('settings.tComponents'); }, icon: Boxes },
    ] },
    { get label() { return wt('settings.tWork'); }, tabs: [
      { key: 'workflow', get label() { return wt('settings.tWorkflow'); }, icon: Workflow },
      { key: 'board', get label() { return wt('settings.tBoard'); }, icon: Columns3 },
      { key: 'types', get label() { return wt('settings.tIssueTypes'); }, icon: Shapes },
      { key: 'fields', get label() { return wt('settings.tFields'); }, icon: TextCursorInput },
      ...(config && config.role !== 'CLIENT' ? [{ key: 'quality' as const, get label() { return wt('settings.tSpecQualityAi'); }, icon: Gauge }] : []),
      ...(config && config.role !== 'CLIENT' && !config.clientView ? [{ key: 'agents' as const, label: wt('pages.aiAgents'), icon: Bot }] : []),
    ] },
    { get label() { return wt('settings.tAutomationIntegrations'); }, tabs: [
      { key: 'automation', get label() { return wt('settings.tAutomation'); }, icon: Zap },
      ...(config && config.role !== 'CLIENT' && !config.clientView ? [{ key: 'recurring' as const, get label() { return wt('classroom.tabRecurring'); }, icon: CalendarClock }] : []), // CTW đợt 5
      { key: 'github', get label() { return wt('settings.tGithub'); }, icon: Github },
      { key: 'gitlab', get label() { return wt('settings.tGitlab'); }, icon: GitMerge },
      // CTW đợt 8a: xuất Google Sheets / Excel (một chiều) — chỉ đội dự án, không khách.
      ...(config && config.role !== 'CLIENT' && !config.clientView ? [{ key: 'cloud' as const, get label() { return wt('c8a.tabCloud'); }, icon: Cloud }] : []),
      ...(perms?.settings ? [{ key: 'chat' as const, get label() { return wt('settings.tChatNotifications'); }, icon: MessageSquareShare }] : []),
      { key: 'share', get label() { return wt('settings.tPublicLinks'); }, icon: Link2 },
    ] },
    { get label() { return wt('settings.tData'); }, tabs: [
      { key: 'export', get label() { return wt('settings.tExport'); }, icon: Download },
      ...(perms?.settings ? [{ key: 'import' as const, get label() { return wt('settings.tImport'); }, icon: Upload }] : []),
      ...(perms?.deleteIssues ? [{ key: 'trash' as const, get label() { return wt('settings.tTrash'); }, icon: Trash2 }] : []),
    ] },
    { get label() { return wt('settings.tDangerZone'); }, danger: true, tabs: perms?.settings ? [{ key: 'danger' as const, get label() { return wt('settings.tDangerZone'); }, icon: TriangleAlert }] : [] },
  ];
  const tabs: TabDef<Tab>[] = groups.flatMap((g) => g.tabs);
  const raw = search?.get('tab') as Tab | null;
  const tab: Tab = raw && tabs.some((t) => t.key === raw) ? raw : 'details';
  const setTab = (t: Tab) => router.replace(`${pathname}${t === 'details' ? '' : `?tab=${t}`}`, { scroll: false });

  if (isLoading) return <PageLoading />;
  if (error || !config) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title={wt('palette.projectSettings')} />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <EmptyState
            title={wt('common.projectNotFound')}
            body={workError(error, wt('settings.projNotExist'))}
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Link href={`/work/${slug}`} className="w-btn w-btn-primary">{wt('settings.backToWs')}</Link>
                <Link href="/work?tab=my-work" className="w-btn">{wt('shell.myWork')}</Link>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={wt('common.settings')} tools={false} />
      <SettingsLayout groups={groups} active={tab} onChange={setTab} label={wt('palette.projectSettings')}>
        {config.archivedAt && (
          <div className="mb-6 flex items-center gap-2 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5 text-[13px] text-[var(--w-text-2)]">
            <Archive size={14} className="shrink-0" />
            {wt('settings.archivedNotice')}
          </div>
        )}
        {!config.permissions.settings && (
          <ReadOnlyNotice>{wt('settings.readOnly')}</ReadOnlyNotice>
        )}
        {tab === 'details' && <ProjectDetails config={config} slug={slug} />}
        {tab === 'studio' && <ProjectStudio config={config} slug={slug} />}
        {tab === 'members' && <ProjectMembers config={config} slug={slug} />}
        {tab === 'labels' && <ProjectLabels config={config} slug={slug} />}
        {tab === 'components' && <ProjectComponents config={config} slug={slug} />}
        {tab === 'workflow' && <ProjectWorkflow config={config} slug={slug} />}
        {tab === 'board' && <ProjectBoard config={config} slug={slug} />}
        {tab === 'types' && <ProjectIssueTypes config={config} slug={slug} />}
        {tab === 'fields' && <ProjectFields config={config} slug={slug} />}
        {tab === 'quality' && <ProjectSpecQuality config={config} slug={slug} />}
        {tab === 'agents' && <ProjectAgents config={config} slug={slug} />}
        {tab === 'automation' && <ProjectAutomation config={config} slug={slug} />}
        {tab === 'recurring' && <ProjectRecurring config={config} />}
        {tab === 'github' && <ProjectGithub config={config} slug={slug} />}
        {tab === 'gitlab' && <ProjectGitlab config={config} slug={slug} />}
        {tab === 'cloud' && <ProjectCloud config={config} slug={slug} />}
        {tab === 'chat' && <ProjectChat config={config} slug={slug} />}
        {tab === 'export' && <ProjectExport config={config} slug={slug} />}
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
    <Suspense fallback={<PageLoading />}>
      <ProjectSettings />
    </Suspense>
  );
}
