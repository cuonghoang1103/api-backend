'use client';

/**
 * Trang một test case (soạn bước / Gherkin, requirement, lịch sử chạy).
 * `?issue=N` mở ngăn kéo thẻ — dùng cho "Open as issue", requirement, defect.
 */

import { Suspense, useCallback } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { workError } from '@/lib/work-api';
import IssueDrawer from '@/components/work/IssueDrawer';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, Spinner } from '@/components/work/ui';
import TestEditor from '@/components/work/tests/TestEditor';

export default function TestCasePage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size={20} /></div>}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const params = useParams<{ ws: string; key: string; num: string }>();
  const num = Number(params.num);
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);

  const issueParam = Number(search?.get('issue')) || null;
  const openIssue = useCallback((n: number) => {
    const p = new URLSearchParams(search?.toString());
    p.set('issue', String(n));
    router.push(`${pathname}?${p.toString()}`, { scroll: false });
  }, [router, pathname, search]);
  const closeIssue = useCallback(() => {
    const p = new URLSearchParams(search?.toString());
    p.delete('issue');
    const s = p.toString();
    router.push(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [router, pathname, search]);

  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
  if (error || !config || !pid || !Number.isInteger(num) || num <= 0) {
    return <EmptyState title="Test not found" body={error ? workError(error) : 'It may have been deleted, or you do not have access.'} />;
  }
  return (
    <>
      <TestEditor key={`${pid}-${num}`} config={config} pid={pid} num={num} onOpenIssue={openIssue} />
      <IssueDrawer pid={pid} num={issueParam} onClose={closeIssue} onOpenIssue={openIssue} />
    </>
  );
}
