'use client';

/** /work/<slug>/<KEY>/docs/<num> — một trang tài liệu (đọc/sửa, phiên bản, phê duyệt, bình luận). */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import DocsShell from '@/components/work/docs/DocsShell';
import { workError } from '@/lib/work-api';
import { wt } from '@/components/work/i18n';

function DocPage() {
  const params = useParams<{ ws: string; key: string; num: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);
  const num = Number(params.num);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title={wt('common.projectNotFound')} body={error ? workError(error) : undefined} />;
  if (!Number.isInteger(num) || num < 1) return <EmptyState title={wt('pages.pageNotFound')} />;
  return <DocsShell config={config} num={num} />;
}

export default function Page() {
  return <Suspense fallback={<PageLoading />}><DocPage /></Suspense>;
}
