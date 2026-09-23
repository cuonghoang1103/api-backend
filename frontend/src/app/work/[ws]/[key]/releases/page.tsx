'use client';

/**
 * Trang Releases: bảng version, `?v=<id>` mở chi tiết một version,
 * `?issue=<số>` mở ngăn chi tiết thẻ.
 */

import { Suspense, useCallback } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { workError, type ProjectConfig } from '@/lib/work-api';
import IssueDrawer from '@/components/work/IssueDrawer';
import ProjectHeader from '@/components/work/ProjectHeader';
import { ReleasesList, VersionDetail } from '@/components/work/Releases';
import { useLookups, useProject, useProjectRealtime, wk } from '@/components/work/hooks';
import { EmptyState, Spinner } from '@/components/work/ui';

function ReleasesView({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const lk = useLookups(config);
  const qc = useQueryClient();
  // Sự kiện thẻ (xong việc, đổi fix version) không chạm wk.project ⇒ tự làm tươi số liệu version.
  useProjectRealtime(pid, useCallback(() => { qc.invalidateQueries({ queryKey: wk.versions(pid) }); }, [qc, pid]));

  const setParam = useCallback((key: string, val: number | null, push = true) => {
    const p = new URLSearchParams(search?.toString());
    if (val) p.set(key, String(val));
    else p.delete(key);
    if (key === 'v') p.delete('issue');
    const s = p.toString();
    const url = s ? `${pathname}?${s}` : pathname!;
    if (push) router.push(url, { scroll: false });
    else router.replace(url, { scroll: false });
  }, [router, pathname, search]);

  const vParam = Number(search?.get('v'));
  const versionId = Number.isInteger(vParam) && vParam > 0 ? vParam : null;
  const issueParam = Number(search?.get('issue')) || null;

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title="Releases" />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {versionId ? (
          <VersionDetail
            config={config}
            pid={pid}
            lk={lk}
            versionId={versionId}
            onBack={() => setParam('v', null)}
            onOpenIssue={(n) => setParam('issue', n)}
          />
        ) : (
          <ReleasesList config={config} pid={pid} onOpenVersion={(id) => setParam('v', id)} />
        )}
      </div>
      <IssueDrawer pid={pid} num={issueParam} onClose={() => setParam('issue', null)} onOpenIssue={(n) => setParam('issue', n)} />
    </div>
  );
}

// useSearchParams bắt buộc nằm trong <Suspense> — thiếu là Next 14 báo lỗi lúc build.
export default function ReleasesPage() {
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
  return <ReleasesView config={config} pid={pid} />;
}
