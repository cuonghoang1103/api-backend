'use client';

/**
 * Trang riêng của một thẻ — đích của link chia sẻ và của thông báo trong chuông.
 */

import { useParams, useRouter } from 'next/navigation';
import IssueDetail from '@/components/work/IssueDetail';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { workError } from '@/lib/work-api';
import { wt } from '@/components/work/i18n';

export default function IssuePage() {
  const router = useRouter();
  const params = useParams<{ ws: string; key: string; num: string }>();
  const num = Number(params.num);
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);

  if (isLoading) return <PageLoading />;
  if (error || !config || !pid || !Number.isInteger(num)) {
    return <EmptyState title={wt('pages.issueNotFound')} body={error ? workError(error) : wt('dash.mayDeleted')} />;
  }
  const base = `/work/${params.ws}/${config.key}`;
  return (
    <IssueDetail
      pid={pid}
      num={num}
      config={config}
      variant="page"
      onOpenIssue={(n) => router.push(`${base}/issue/${n}`)}
      onClose={() => router.push(`${base}/board`)}
    />
  );
}
