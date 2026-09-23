'use client';

/**
 * Trang riêng của một thẻ — đích của link chia sẻ và của thông báo trong chuông.
 */

import { useParams, useRouter } from 'next/navigation';
import IssueDetail from '@/components/work/IssueDetail';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, Spinner } from '@/components/work/ui';
import { workError } from '@/lib/work-api';

export default function IssuePage() {
  const router = useRouter();
  const params = useParams<{ ws: string; key: string; num: string }>();
  const num = Number(params.num);
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);

  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
  if (error || !config || !pid || !Number.isInteger(num)) {
    return <EmptyState title="Issue not found" body={error ? workError(error) : 'It may have been deleted, or you do not have access.'} />;
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
