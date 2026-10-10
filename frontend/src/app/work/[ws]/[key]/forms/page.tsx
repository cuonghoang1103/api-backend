'use client';

/**
 * CT Work đợt 7b (11/10/2026) — /work/<slug>/<KEY>/forms: biểu mẫu → thẻ (trình dựng, link công khai/nội bộ, tổng hợp câu trả lời).
 * Chỉ đội dự án (khách cổng không thấy — server cũng chặn 403).
 */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { workError, type ProjectConfig } from '@/lib/work-api';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import FormsView from '@/components/work/intake7b/FormsView';
import { wt } from '@/components/work/i18n';

function View({ config, pid }: { config: ProjectConfig; pid: number }) {
  useProjectRealtime(pid);

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={wt('c7b.formsTitle')} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-[1400px] p-4">
          <FormsView config={config} pid={pid} />
        </div>
      </div>
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
  if (config.role === 'CLIENT' || config.clientView) return <EmptyState title={wt('school.notAvail')} body={wt('c7b.teamOnly')} />;
  return <View config={config} pid={pid} />;
}
