'use client';

/** /work/<slug>/settings — cài đặt không gian: General · Members · Invitations · Trash. */

import { Suspense } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, Spinner } from '@/components/work/ui';
import { PageHeader, SettingsTabs, type TabDef } from '@/components/work/settings/shared';
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
  const tabs: TabDef<Tab>[] = [
    { key: 'general', label: 'General' },
    { key: 'members', label: 'Members' },
    ...(canManage ? [{ key: 'invitations' as const, label: 'Invitations' }, { key: 'audit' as const, label: 'Audit log' }, { key: 'trash' as const, label: 'Trash' }] : []),
  ];
  const raw = search?.get('tab') as Tab | null;
  const tab: Tab = raw && tabs.some((t) => t.key === raw) ? raw : 'general';
  const setTab = (t: Tab) => router.replace(`${pathname}${t === 'general' ? '' : `?tab=${t}`}`, { scroll: false });

  if (q.isLoading) return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
  if (q.error || !ws) {
    return (
      <div className="h-full overflow-y-auto">
        <EmptyState title="Workspace unavailable" body={workError(q.error, 'This workspace does not exist or you no longer have access to it.')} action={<Link href="/work" className="w-btn">Back to workspaces</Link>} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={<><Link href={`/work/${slug}`} className="text-[var(--w-text-2)] hover:text-[var(--w-text)]">{ws.name}</Link><span className="mx-1.5 text-[var(--w-text-3)]">/</span>Settings</>}
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[960px] px-4 py-6 md:px-6">
          <SettingsTabs tabs={tabs} active={tab} onChange={setTab} />
          {tab === 'general' && <WorkspaceGeneral ws={ws} />}
          {tab === 'members' && <WorkspaceMembers ws={ws} />}
          {tab === 'invitations' && <WorkspaceInvitations ws={ws} />}
          {tab === 'audit' && <WorkspaceAudit workspaceId={ws.id} />}
          {tab === 'trash' && <WorkspaceTrash ws={ws} />}
        </div>
      </div>
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
