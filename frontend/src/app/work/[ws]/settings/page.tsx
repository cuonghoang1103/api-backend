'use client';

/** /work/<slug>/settings — cài đặt không gian: General · Members · Invitations · Trash. */

import { Suspense } from 'react';
import { MailPlus, ScrollText, SlidersHorizontal, Trash2, Users } from 'lucide-react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, Spinner } from '@/components/work/ui';
import { PageHeader, SettingsLayout, type NavGroup, type TabDef } from '@/components/work/settings/shared';
import { Crumb, CrumbSep } from '@/components/work/ProjectHeader';
import WorkspaceGeneral from '@/components/work/settings/WorkspaceGeneral';
import WorkspaceMembers from '@/components/work/settings/WorkspaceMembers';
import WorkspaceInvitations from '@/components/work/settings/WorkspaceInvitations';
import WorkspaceTrash from '@/components/work/settings/WorkspaceTrash';
import WorkspaceAudit from '@/components/work/settings/WorkspaceAudit';

type Tab = 'general' | 'members' | 'invitations' | 'audit' | 'trash';

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
    { label: 'Workspace', tabs: [
      { key: 'general', label: 'General', icon: SlidersHorizontal },
      { key: 'members', label: 'Members', icon: Users },
      ...(canManage ? [{ key: 'invitations' as const, label: 'Invitations', icon: MailPlus }] : []),
    ] },
    { label: 'Data', tabs: canManage ? [
      { key: 'audit' as const, label: 'Audit log', icon: ScrollText },
      { key: 'trash' as const, label: 'Trash', icon: Trash2 },
    ] : [] },
  ];
  const tabs: TabDef<Tab>[] = groups.flatMap((g) => g.tabs);
  const raw = search?.get('tab') as Tab | null;
  const tab: Tab = raw && tabs.some((t) => t.key === raw) ? raw : 'general';
  const setTab = (t: Tab) => router.replace(`${pathname}${t === 'general' ? '' : `?tab=${t}`}`, { scroll: false });

  if (q.isLoading) return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
  if (q.error || !ws) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title="Workspace settings" />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <EmptyState title="Workspace not found" body={workError(q.error, 'This workspace does not exist or you no longer have access to it.')} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={<><Crumb href={`/work/${slug}`} className="max-w-[220px] font-normal">{ws.name}</Crumb><CrumbSep className="mx-1.5" />Settings</>}
      />
      <SettingsLayout groups={groups} active={tab} onChange={setTab} label="Workspace settings">
        {tab === 'general' && <WorkspaceGeneral ws={ws} />}
        {tab === 'members' && <WorkspaceMembers ws={ws} />}
        {tab === 'invitations' && <WorkspaceInvitations ws={ws} />}
        {tab === 'audit' && <WorkspaceAudit workspaceId={ws.id} />}
        {tab === 'trash' && <WorkspaceTrash ws={ws} />}
      </SettingsLayout>
    </div>
  );
}

export default function WorkspaceSettingsPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size={20} /></div>}>
      <WorkspaceSettings />
    </Suspense>
  );
}
