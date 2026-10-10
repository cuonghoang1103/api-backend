'use client';

/**
 * CT Work đợt 7a (11/10/2026) — /work/<slug>/<KEY>/poker: planning poker (`?s=N` mở phòng).
 * Chỉ đội dự án (khách cổng không thấy — server cũng chặn).
 */

import { Suspense, useCallback } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { workError, type ProjectConfig } from '@/lib/work-api';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { useAgileRealtime } from '@/components/work/agile/realtime';
import { PokerList, PokerRoomView } from '@/components/work/agile/Poker';
import { wt } from '@/components/work/i18n';

function View({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  useProjectRealtime(pid);
  useAgileRealtime(pid);
  const setParam = useCallback((k: string, v: string | null) => {
    const p = new URLSearchParams(search?.toString());
    if (v === null) p.delete(k); else p.set(k, v);
    const s = p.toString();
    router.push(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [router, pathname, search]);
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={wt('agile.pokerTitle')} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-[1400px] p-4">
          {Number(search?.get('s')) ? <PokerRoomView key={Number(search?.get('s'))} pid={pid} sid={Number(search?.get('s'))} onBack={() => setParam('s', null)} />
            : <PokerList pid={pid} config={config} onOpen={(id) => setParam('s', String(id))} />}
        </div>
      </div>
    </div>
  );
}

// useSearchParams bắt buộc nằm trong <Suspense>.
export default function Page() {
  return <Suspense fallback={<PageLoading />}><Inner /></Suspense>;
}

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title={wt('common.projectNotFound')} body={error ? workError(error) : wt('common.projectNotFoundBody')} />;
  if (config.role === 'CLIENT' || config.clientView) return <EmptyState title={wt('school.notAvail')} body={wt('agile.teamOnly')} />;
  return <View config={config} pid={pid} />;
}
