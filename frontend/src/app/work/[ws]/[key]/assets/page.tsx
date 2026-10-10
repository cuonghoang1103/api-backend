'use client';

/**
 * CTW đợt 7c (C25 / CTW-21) — /work/<slug>/<KEY>/assets: sổ tài sản & giấy phép của dự án (phần mềm, license, tài khoản
 * dịch vụ, thiết bị, font/ảnh/âm thanh…). `?asset=N` mở chi tiết; `?issue=N` mở ngăn kéo thẻ. Chỉ đội dự án + giảng viên.
 */

import { Suspense, useCallback } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { workError, type ProjectConfig } from '@/lib/work-api';
import ProjectHeader from '@/components/work/ProjectHeader';
import IssueDrawer from '@/components/work/IssueDrawer';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import AssetsView from '@/components/work/assets/AssetsView';
import { wt } from '@/components/work/i18n';

function View({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  useProjectRealtime(pid);
  const setParam = useCallback((patch: Record<string, string | null>, push = false) => {
    const p = new URLSearchParams(search?.toString());
    for (const [k, v] of Object.entries(patch)) { if (v === null) p.delete(k); else p.set(k, v); }
    const s = p.toString();
    (push ? router.push : router.replace)(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [router, pathname, search]);
  const asset = Number(search?.get('asset')) || null;
  const issue = Number(search?.get('issue')) || null;
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={wt('c7c.assetsTitle')} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-[1400px] p-4">
          <AssetsView config={config} pid={pid} selected={asset} onSelect={(n) => setParam({ asset: n ? String(n) : null })} onOpenIssue={(n) => setParam({ issue: String(n) }, true)} />
        </div>
      </div>
      <IssueDrawer pid={pid} num={issue} onClose={() => setParam({ issue: null }, true)} onOpenIssue={(n) => setParam({ issue: String(n) }, true)} />
    </div>
  );
}

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title={wt('common.projectNotFound')} body={error ? workError(error) : wt('common.projectNotFoundBody')} />;
  if (config.role === 'CLIENT' || config.clientView) return <EmptyState title={wt('school.notAvail')} body={wt('c7c.assetsNotAvail')} />;
  return <View config={config} pid={pid} />;
}

export default function AssetsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Inner />
    </Suspense>
  );
}
