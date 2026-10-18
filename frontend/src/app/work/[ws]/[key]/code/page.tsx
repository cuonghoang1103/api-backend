'use client';

/**
 * CTW Code (18/10/2026) — /work/<slug>/<KEY>/code: hoạt động Git như GitHub ngay trong CT Work.
 * `?tab=activity|branches|pulls|source` · `?event=N` cuộn tới một sự kiện · `?pr=N` · `?ref=&path=&commit=&history=1`
 * (mã nguồn) · `?issue=N` mở ngăn kéo thẻ. Chỉ đội dự án (khách không thấy — server cũng trả 403).
 */

import { Suspense, useCallback } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { workError, type ProjectConfig } from '@/lib/work-api';
import ProjectHeader from '@/components/work/ProjectHeader';
import IssueDrawer from '@/components/work/IssueDrawer';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import CodeView from '@/components/work/code/CodeView';
import { wt } from '@/components/work/i18n';

function CodePage({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  useProjectRealtime(pid);
  const setIssue = useCallback((n: number | null) => {
    const p = new URLSearchParams(search?.toString());
    if (n) p.set('issue', String(n)); else p.delete('issue');
    const s = p.toString();
    router.push(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [router, pathname, search]);
  const issue = Number(search?.get('issue')) || null;

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={wt('code.title')} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <CodeView config={config} pid={pid} onOpenIssue={(n) => setIssue(n)} />
      </div>
      <IssueDrawer pid={pid} num={issue} onClose={() => setIssue(null)} onOpenIssue={(n) => setIssue(n)} />
    </div>
  );
}

// useSearchParams bắt buộc nằm trong <Suspense> — thiếu là Next 14 báo lỗi lúc build.
export default function Page() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title={wt('common.projectNotFound')} body={error ? workError(error) : wt('common.projectNotFoundBody')} />;
  if (config.role === 'CLIENT' || config.clientView) return <EmptyState title={wt('school.notAvail')} body={wt('code.notAvailBody')} />;
  return <CodePage config={config} pid={pid} />;
}
