'use client';

/**
 * Trang Tests (kiểu Xray): thư viện test case, test plan, test cycle, truy
 * vết requirement. Tab nằm trong `?tab=`; `?issue=N` mở ngăn kéo thẻ.
 */

import { Suspense, useCallback, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import IssueDrawer from '@/components/work/IssueDrawer';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, Spinner } from '@/components/work/ui';
import LibraryTab from '@/components/work/tests/LibraryTab';
import PlansTab from '@/components/work/tests/PlansTab';
import NewTestDialog from '@/components/work/tests/NewTestDialog';
import { EnableTestingState, testingEnabled } from '@/components/work/tests/testing-ui';
import CyclesTab from '@/components/work/tests/CyclesTab';
import TraceabilityTab from '@/components/work/tests/TraceabilityTab';

const TABS = [
  { id: 'library', label: 'Test library' },
  { id: 'plans', label: 'Test plans' },
  { id: 'cycles', label: 'Test cycles' },
  { id: 'traceability', label: 'Traceability' },
] as const;
type TabId = (typeof TABS)[number]['id'];

function TestsView({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  useProjectRealtime(pid);
  const [newOpen, setNewOpen] = useState(false);

  const raw = search?.get('tab');
  const tab: TabId = TABS.some((t) => t.id === raw) ? (raw as TabId) : 'library';
  const setTab = useCallback((id: TabId) => {
    // Đổi tab thì bỏ các tham số riêng của tab cũ (new/tests/plan…), chỉ giữ ngăn kéo.
    const p = new URLSearchParams();
    const issue = search?.get('issue');
    if (id !== 'library') p.set('tab', id);
    if (issue) p.set('issue', issue);
    const s = p.toString();
    router.replace(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [router, pathname, search]);

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

  const enabled = testingEnabled(config);
  const base = `/work/${config.workspace.slug}/${config.key}/tests`;

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title="Tests">
        {enabled && config.permissions.createIssues && (
          <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setNewOpen(true)}>
            <Plus size={14} /> <span className="hidden sm:inline">New test</span>
          </button>
        )}
      </ProjectHeader>

      {!enabled ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <EnableTestingState config={config} pid={pid} />
        </div>
      ) : (
        <>
          <div className="shrink-0 overflow-x-auto border-b border-[var(--w-border)] px-4">
            <div className="flex gap-1" role="tablist" aria-label="Tests">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    '-mb-px whitespace-nowrap border-b-2 px-2.5 py-2.5 text-[13px] font-medium transition-colors',
                    tab === t.id
                      ? 'border-[var(--w-accent)] text-[var(--w-text)]'
                      : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            {tab === 'library' && <LibraryTab config={config} pid={pid} onOpenIssue={openIssue} onNewTest={config.permissions.createIssues ? () => setNewOpen(true) : undefined} />}
            {tab === 'plans' && <PlansTab config={config} pid={pid} />}
            {tab === 'cycles' && (
              <div className="min-h-0 flex-1 overflow-hidden"><CyclesTab config={config} pid={pid} /></div>
            )}
            {tab === 'traceability' && (
              <div className="min-h-0 flex-1 overflow-hidden"><TraceabilityTab config={config} pid={pid} /></div>
            )}
          </div>

          <NewTestDialog open={newOpen} onClose={() => setNewOpen(false)} config={config} pid={pid} onCreated={(n) => router.push(`${base}/${n}`)} />
        </>
      )}

      <IssueDrawer pid={pid} num={issueParam} onClose={closeIssue} onOpenIssue={openIssue} />
    </div>
  );
}

// useSearchParams bắt buộc nằm trong <Suspense> — thiếu là Next 14 báo lỗi lúc build.
export default function TestsPage() {
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
  if (error || !config || !pid) {
    return <EmptyState title="Project not found" body={error ? workError(error) : 'It may have been deleted, or you do not have access.'} />;
  }
  return <TestsView config={config} pid={pid} />;
}
