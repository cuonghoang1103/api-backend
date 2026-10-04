'use client';

/** /work/<slug>/<KEY>/docs — tài liệu dự án kiểu Confluence (đợt S2a, mô-đun docs). */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import DocsShell from '@/components/work/docs/DocsShell';
import { workError } from '@/lib/work-api';

function DocsPage() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title="Project not found" body={error ? workError(error) : undefined} />;
  return <DocsShell config={config} />;
}

export default function Page() {
  return <Suspense fallback={<PageLoading />}><DocsPage /></Suspense>;
}
