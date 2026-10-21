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
import { Sparkles } from 'lucide-react'; // CTW đợt 8B: AI trong dự án
import ProjectAiUsage from '@/components/work/settings/ProjectAiUsage'; // CTW đợt 8B: AI usage của dự án
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
import ProjectCuongMini from '@/components/work/settings/ProjectCuongMini'; // đợt 6 CuongMini: hạn mức nhóm
import ProjectFigma from '@/components/work/settings/ProjectFigma'; // 19/10/2026: token Figma chỉ đọc cho trợ lý AI
import { Figma } from 'lucide-react';
import { currentWorkLocale } from '@/components/work/i18n/store';
import { wt } from '@/components/work/i18n';

type Tab = 'details' | 'studio' | 'members' | 'labels' | 'components' | 'workflow' | 'board' | 'types' | 'fields' | 'quality' | 'agents' | 'cuongmini' | 'aiusage' | 'automation' | 'recurring' | 'github' | 'gitlab' | 'figma' | 'cloud' | 'chat' | 'share' | 'export' | 'import' | 'trash' | 'danger';

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
  // Đợt 8D (19/10/2026): gom gọn — Chung · Công việc dùng hằng ngày; AI, tự động hoá & tích hợp, dữ liệu, vùng nguy
  // hiểm là nhóm NÂNG CAO (gập mặc định, tự mở khi chứa tab đang mở hoặc khi tìm). `keywords` = từ cho ô tìm cài đặt.
  const staff = !!config && config.role !== 'CLIENT' && !config.clientView;
  const groups: NavGroup<Tab>[] = [
    { get label() { return wt('settings.tGeneral'); }, tabs: [
      { key: 'details', get label() { return wt('settings.tDetails'); }, icon: SlidersHorizontal, keywords: 'details general name description key avatar icon color cover anh bia ten mo ta' },
      { key: 'studio', get label() { return wt('settings.tProjectTypeModules'); }, icon: Blocks, keywords: 'project type kind modules studio bat tat mo dun' },
      { key: 'members', get label() { return wt('settings.tMembers'); }, icon: Users, keywords: 'members people invite roles vai tro moi nguoi' },
    ] },
    { get label() { return wt('settings.tWork'); }, tabs: [
      { key: 'workflow', get label() { return wt('settings.tWorkflow'); }, icon: Workflow, keywords: 'workflow status transitions trang thai quy trinh' },
      { key: 'board', get label() { return wt('settings.tBoard'); }, icon: Columns3, keywords: 'board columns wip cot bang' },
      { key: 'types', get label() { return wt('settings.tIssueTypes'); }, icon: Shapes, keywords: 'issue types epic story task bug loai the' },
      { key: 'fields', get label() { return wt('settings.tFields'); }, icon: TextCursorInput, keywords: 'custom fields truong tuy chinh' },
      { key: 'labels', get label() { return wt('settings.tLabels'); }, icon: Tag, keywords: 'labels tags nhan' },
      { key: 'components', get label() { return wt('settings.tComponents'); }, icon: Boxes, keywords: 'components thanh phan' },
    ] },
    { get label() { return wt('g8d.gAi'); }, collapsible: true, tabs: [
      ...(config && config.role !== 'CLIENT' ? [{ key: 'quality' as const, get label() { return wt('settings.tSpecQualityAi'); }, icon: Gauge, keywords: 'spec quality fidelity ai assisted chat luong dac ta' }] : []),
      ...(staff ? [{ key: 'agents' as const, label: wt('pages.aiAgents'), icon: Bot, keywords: 'ai agents review lease bot' }] : []),
      /* Đợt 6: CuongMini cho cả nhóm — hạn mức của trưởng nhóm cho thành viên không Pro. */
      ...(staff ? [{ key: 'cuongmini' as const, get label() { return currentWorkLocale() === 'vi' ? 'CuongMini cho cả nhóm' : 'CuongMini for the team'; }, icon: Bot, keywords: 'cuongmini quota sponsor han muc nha tai tro pro' }] : []),
      /* Đợt 8B: AI trong dự án — ai dùng AI nối CT Work, chi phí theo nguồn, thay đổi AI đã làm (thành viên: phần của mình). */
      ...(staff ? [{ key: 'aiusage' as const, get label() { return wt('aiu.tab'); }, icon: Sparkles, keywords: 'ai usage cost tokens chi phi luot dung' }] : []),
    ] },
    { get label() { return wt('settings.tAutomationIntegrations'); }, collapsible: true, tabs: [
      { key: 'automation', get label() { return wt('settings.tAutomation'); }, icon: Zap, keywords: 'automation rules tu dong hoa' },
      ...(staff ? [{ key: 'recurring' as const, get label() { return wt('classroom.tabRecurring'); }, icon: CalendarClock, keywords: 'recurring repeat dinh ky lap lai' }] : []), // CTW đợt 5
      { key: 'github', get label() { return wt('settings.tGithub'); }, icon: Github, keywords: 'github git repo code' },
      { key: 'gitlab', get label() { return wt('settings.tGitlab'); }, icon: GitMerge, keywords: 'gitlab git repo code' },
      // 19/10/2026: link ngoài cho trợ lý AI (Figma token chỉ đọc) — chỉ đội dự án, không khách.
      ...(staff ? [{ key: 'figma' as const, label: 'Figma', icon: Figma, keywords: 'figma design token thiet ke' }] : []),
      // CTW đợt 8a: xuất Google Sheets / Excel (một chiều) — chỉ đội dự án, không khách.
      ...(staff ? [{ key: 'cloud' as const, get label() { return wt('c8a.tabCloud'); }, icon: Cloud, keywords: 'microsoft 365 google sheets excel onedrive drive' }] : []),
      ...(perms?.settings ? [{ key: 'chat' as const, get label() { return wt('settings.tChatNotifications'); }, icon: MessageSquareShare, keywords: 'chat notifications slack discord telegram webhook thong bao' }] : []),
      { key: 'share', get label() { return wt('settings.tPublicLinks'); }, icon: Link2, keywords: 'public links share chia se lien ket cong khai' },
    ] },
    { get label() { return wt('settings.tData'); }, collapsible: true, tabs: [
      { key: 'export', get label() { return wt('settings.tExport'); }, icon: Download, keywords: 'export csv json xuat' },
      ...(perms?.settings ? [{ key: 'import' as const, get label() { return wt('settings.tImport'); }, icon: Upload, keywords: 'import csv jira trello nhap' }] : []),
      // 22/10/2026: thành viên (sửa được dự án) cũng thấy Trash — thùng rác dữ liệu 30 ngày + yêu cầu xoá chờ duyệt.
      ...(perms?.deleteIssues || perms?.editIssues ? [{ key: 'trash' as const, get label() { return wt('settings.tTrash'); }, icon: Trash2, keywords: 'trash deleted restore undo thung rac khoi phuc yeu cau xoa duyet' }] : []),
    ] },
    { get label() { return wt('settings.tDangerZone'); }, danger: true, collapsible: true, tabs: perms?.settings ? [{ key: 'danger' as const, get label() { return wt('settings.tDangerZone'); }, icon: TriangleAlert, keywords: 'archive delete transfer luu tru xoa' }] : [] },
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
      <SettingsLayout groups={groups} active={tab} onChange={setTab} label={wt('palette.projectSettings')} searchable>
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
        {tab === 'cuongmini' && <ProjectCuongMini config={config} slug={slug} />}
        {tab === 'aiusage' && <ProjectAiUsage config={config} slug={slug} />}
        {tab === 'automation' && <ProjectAutomation config={config} slug={slug} />}
        {tab === 'recurring' && <ProjectRecurring config={config} />}
        {tab === 'github' && <ProjectGithub config={config} slug={slug} />}
        {tab === 'gitlab' && <ProjectGitlab config={config} slug={slug} />}
        {tab === 'figma' && <ProjectFigma config={config} slug={slug} />}
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
