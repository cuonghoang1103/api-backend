'use client';

/** /work/<slug>/settings — cài đặt không gian: General · Members · Invitations · Audit log · Import project (S5c) · Trash. */

import { Suspense } from 'react';
import { FileUp, MailPlus, ScrollText, ShieldCheck, SlidersHorizontal, Trash2, Users } from 'lucide-react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { PageHeader, SettingsLayout, type NavGroup, type TabDef } from '@/components/work/settings/shared';
import { Crumb, CrumbSep } from '@/components/work/ProjectHeader';
import WorkspaceGeneral from '@/components/work/settings/WorkspaceGeneral';
import WorkspaceMembers from '@/components/work/settings/WorkspaceMembers';
import WorkspaceInvitations from '@/components/work/settings/WorkspaceInvitations';
import WorkspaceTrash from '@/components/work/settings/WorkspaceTrash';
import WorkspaceAudit from '@/components/work/settings/WorkspaceAudit';
import WorkspaceImport from '@/components/work/settings/WorkspaceImport';
import WorkspaceSecurity from '@/components/work/settings/WorkspaceSecurity'; // CTW đợt 7c: ép 2FA
import { wt } from '@/components/work/i18n';

type Tab = 'general' | 'members' | 'invitations' | 'security' | 'audit' | 'import' | 'trash';

function WorkspaceSettings() {
  const params = useParams<{ ws: string }>();
  const slug = decodeURIComponent(params?.ws ?? '');
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const q = useQuery({ queryKey: wk.workspace(slug), queryFn: () => workApi.workspaceBySlug(slug), enabled: !!slug, staleTime: 30_000 });
  const ws = q.data;

  const canManage = ws?.role === 'OWNER' || ws?.role === 'ADMIN';
  const groups: NavGroup<Tab>[] = [
    { get label() { return wt('settings.tWorkspace'); }, tabs: [
      { key: 'general', get label() { return wt('settings.tGeneral'); }, icon: SlidersHorizontal },
      { key: 'members', get label() { return wt('settings.tMembers'); }, icon: Users },
      ...(canManage ? [{ key: 'invitations' as const, get label() { return wt('settings.tInvitations'); }, icon: MailPlus }] : []),
      // CTW đợt 7c (C17): ép 2FA + ai chưa bật.
      ...(canManage && process.env.NEXT_PUBLIC_CTW_ENFORCE_2FA === 'true' ? [{ key: 'security' as const, get label() { return wt('c7c.tabSecurity'); }, icon: ShieldCheck }] : []),
    ] },
    { get label() { return wt('settings.tData'); }, tabs: canManage ? [
      { key: 'audit' as const, get label() { return wt('settings.tAuditLog'); }, icon: ScrollText },
      // Đợt S5c: nhập lại dự án từ ZIP xuất trọn (luôn thành dự án MỚI).
      { key: 'import' as const, get label() { return wt('settings.tImportProject'); }, icon: FileUp },
      { key: 'trash' as const, get label() { return wt('settings.tTrash'); }, icon: Trash2 },
    ] : [] },
  ];
  const tabs: TabDef<Tab>[] = groups.flatMap((g) => g.tabs);
  const raw = search?.get('tab') as Tab | null;
  const tab: Tab = raw && tabs.some((t) => t.key === raw) ? raw : 'general';
  const setTab = (t: Tab) => router.replace(`${pathname}${t === 'general' ? '' : `?tab=${t}`}`, { scroll: false });

  if (q.isLoading) return <PageLoading />;
  if (q.error || !ws) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title={wt('palette.wsSettings')} />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <EmptyState title={wt('home.wsNotFound')} body={workError(q.error, wt('home.wsNotFoundBody'))} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={<><Crumb href={`/work/${slug}`} className="max-w-[220px] font-normal">{ws.name}</Crumb><CrumbSep className="mx-1.5" />{wt('common.settings')}</>}
      />
      <SettingsLayout groups={groups} active={tab} onChange={setTab} label={wt('palette.wsSettings')}>
        {tab === 'general' && <WorkspaceGeneral ws={ws} />}
        {tab === 'members' && <WorkspaceMembers ws={ws} />}
        {tab === 'invitations' && <WorkspaceInvitations ws={ws} />}
        {tab === 'security' && <WorkspaceSecurity ws={ws} />}
        {tab === 'audit' && <WorkspaceAudit workspaceId={ws.id} />}
        {tab === 'import' && <WorkspaceImport ws={ws} />}
        {tab === 'trash' && <WorkspaceTrash ws={ws} />}
      </SettingsLayout>
    </div>
  );
}

export default function WorkspaceSettingsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <WorkspaceSettings />
    </Suspense>
  );
}
