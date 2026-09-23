'use client';

/**
 * Báo cáo của dự án. Tab đang mở nằm trong `?tab=` để link chia sẻ được
 * (giáo viên mở thẳng tab Contributions).
 */

import { Suspense, useCallback } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { workError, type ProjectConfig } from '@/lib/work-api';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useLookups, useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, Spinner } from '@/components/work/ui';
import { cn } from '@/lib/utils';
import BurndownTab from '@/components/work/reports/BurndownTab';
import VelocityTab from '@/components/work/reports/VelocityTab';
import SprintReportTab from '@/components/work/reports/SprintReportTab';
import EpicsTab from '@/components/work/reports/EpicsTab';
import ContributionsTab from '@/components/work/reports/ContributionsTab';
import HealthTab from '@/components/work/reports/HealthTab';
import WeeklyReportTab from '@/components/work/reports/WeeklyReportTab';
import TimeTab from '@/components/work/reports/TimeTab';
import CapacityTab from '@/components/work/reports/CapacityTab';
import IssueDrawer from '@/components/work/IssueDrawer';

const TABS = [
  { id: 'health', label: 'Health' },
  { id: 'weekly', label: 'Weekly report' },
  { id: 'burndown', label: 'Burndown' },
  { id: 'velocity', label: 'Velocity' },
  { id: 'sprint', label: 'Sprint report' },
  { id: 'epics', label: 'Epics' },
  { id: 'contributions', label: 'Contributions' },
  { id: 'time', label: 'Time' },
  { id: 'capacity', label: 'Capacity' },
] as const;
type TabId = (typeof TABS)[number]['id'];

function ReportsView({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const lk = useLookups(config);
  useProjectRealtime(pid);

  const raw = search?.get('tab');
  const tab: TabId = TABS.some((t) => t.id === raw) ? (raw as TabId) : 'health';
  const setTab = useCallback((id: TabId) => {
    const p = new URLSearchParams(search?.toString());
    if (id === 'health') p.delete('tab');
    else p.set('tab', id);
    const s = p.toString();
    router.replace(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [router, pathname, search]);

  // ?issue=<số> mở ngăn chi tiết thẻ (từ tab Health).
  const issueParam = Number(search?.get('issue'));
  const openNum = Number.isInteger(issueParam) && issueParam > 0 ? issueParam : null;
  const setIssue = useCallback((num: number | null) => {
    const p = new URLSearchParams(search?.toString());
    if (num) p.set('issue', String(num));
    else p.delete('issue');
    const s = p.toString();
    router.replace(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [router, pathname, search]);

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title="Reports" />

      <div className="shrink-0 overflow-x-auto border-b border-[var(--w-border)] px-4">
        <div className="flex gap-1" role="tablist" aria-label="Reports">
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

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-[1100px] px-4 py-5">
          {tab === 'health' && <HealthTab pid={pid} onOpenIssue={setIssue} />}
          {tab === 'weekly' && <WeeklyReportTab pid={pid} config={config} />}
          {tab === 'burndown' && <BurndownTab pid={pid} />}
          {tab === 'velocity' && <VelocityTab pid={pid} />}
          {tab === 'sprint' && <SprintReportTab pid={pid} config={config} lk={lk} />}
          {tab === 'epics' && <EpicsTab pid={pid} config={config} lk={lk} />}
          {tab === 'contributions' && <ContributionsTab pid={pid} config={config} />}
          {tab === 'time' && <TimeTab pid={pid} config={config} onOpenIssue={setIssue} />}
          {tab === 'capacity' && <CapacityTab pid={pid} config={config} />}
        </div>
      </div>
      <IssueDrawer pid={pid} num={openNum} onClose={() => setIssue(null)} onOpenIssue={(n) => setIssue(n)} />
    </div>
  );
}

// useSearchParams bắt buộc nằm trong <Suspense> — thiếu là Next 14 báo lỗi lúc build.
export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size={20} /></div>}>
      <ReportsPageInner />
    </Suspense>
  );
}

function ReportsPageInner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
  if (error || !config || !pid) {
    return <EmptyState title="Project not found" body={error ? workError(error) : 'It may have been deleted, or you do not have access.'} />;
  }
  return <ReportsView config={config} pid={pid} />;
}
