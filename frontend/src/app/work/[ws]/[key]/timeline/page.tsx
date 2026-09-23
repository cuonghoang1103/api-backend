'use client';

/**
 * Trang Timeline (Gantt): epic + thẻ theo ngày, phụ thuộc, đường găng.
 * Ngăn kéo chi tiết thẻ mở bằng `?issue=`.
 */

import { Suspense, useCallback } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { workError, type ProjectConfig } from '@/lib/work-api';
import IssueDrawer from '@/components/work/IssueDrawer';
import ProjectHeader from '@/components/work/ProjectHeader';
import Timeline from '@/components/work/Timeline';
import { useLookups, useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, Spinner } from '@/components/work/ui';

function TimelineView({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const lk = useLookups(config);
  useProjectRealtime(pid);

  const issueParam = Number(search?.get('issue')) || null;
  const setIssue = useCallback((num: number | null) => {
    const p = new URLSearchParams(search?.toString());
    if (num) p.set('issue', String(num));
    else p.delete('issue');
    const s = p.toString();
    router.push(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [router, pathname, search]);

  return (
    <div className="flex h-full min-w-0 flex-col">
      <ProjectHeader config={config} title="Timeline" />
      <div className="min-h-0 min-w-0 flex-1">
        <Timeline config={config} pid={pid} lk={lk} onOpen={(n) => setIssue(n)} />
      </div>
      <IssueDrawer pid={pid} num={issueParam} onClose={() => setIssue(null)} onOpenIssue={(n) => setIssue(n)} />
    </div>
  );
}

// useSearchParams bắt buộc nằm trong <Suspense> — thiếu là Next 14 báo lỗi lúc build.
export default function TimelinePage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size={20} /></div>}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
  if (error || !config || !pid) return <EmptyState title="Project not found" body={error ? workError(error) : 'It may have been deleted, or you do not have access.'} />;
  return <TimelineView config={config} pid={pid} />;
}
