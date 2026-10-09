'use client';

/**
 * CTW Diagram (10/10/2026) — /work/<slug>/<KEY>/diagrams: DIAGRAM STUDIO của dự án (`?d=N` mở sơ đồ D-N).
 * Đội dự án + giảng viên; khách (CLIENT / cổng khách) không có trang này (máy chủ cũng chặn).
 */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { workError } from '@/lib/work-api';
import { useProject } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { wt } from '@/components/work/i18n';
import DiagramStudio from '@/components/work/diagrams/DiagramStudio';

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title={wt('common.projectNotFound')} body={error ? workError(error) : wt('common.projectNotFoundBody')} />;
  if (config.role === 'CLIENT' || config.clientView) return <EmptyState title={wt('diagram.notAvail')} body={wt('diagram.notAvailBody')} />;
  return <DiagramStudio config={config} pid={pid} />;
}

// useSearchParams (trong DiagramStudio) bắt buộc nằm trong <Suspense> — thiếu là Next 14 báo lỗi lúc build.
export default function DiagramsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Inner />
    </Suspense>
  );
}
