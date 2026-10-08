'use client';

/**
 * CT Work đợt 3B (09/10/2026) — "FPT reports": mọi tệp Excel nộp trường ngoài kiểm thử (5.1–5.3 ở trang Tests).
 * Tab nằm trong `?tab=` (wbs | tracking | weekly | ai | course) để link chia sẻ được; `?issue=N` mở ngăn kéo thẻ.
 *   • WBS (A3)            — cây 1.0/1.1, độ phức tạp → man-day, effort dự kiến/thực tế.
 *   • Project tracking (A23) — SEP490 Report2 / SWP391 Template1 / Template4 / Product+Summary.
 *   • Weekly report (A21) — mỗi tuần một kỳ lưu được, tự điền, xuất "Week n".
 *   • AI usage (A29)      — nhật ký dùng AI theo SWP391 Template0.
 *   • Course              — mã môn, lớp, GV, nhóm, tuần 1, danh sách sinh viên.
 */

import { Suspense, useCallback } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import ProjectHeader from '@/components/work/ProjectHeader';
import IssueDrawer from '@/components/work/IssueDrawer';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import WbsTab from '@/components/work/school/WbsTab';
import { CourseTab, TrackingTab } from '@/components/work/school/TrackingTab';
import WeeklyTab from '@/components/work/school/WeeklyTab';
import AiUsageTab from '@/components/work/school/AiUsageTab';

const TABS = [
  { id: 'wbs', label: 'WBS & estimates' },
  { id: 'tracking', label: 'Project tracking' },
  { id: 'weekly', label: 'Weekly report' },
  { id: 'ai', label: 'AI usage' },
  { id: 'course', label: 'Course & group' },
] as const;
type TabId = (typeof TABS)[number]['id'];

function SchoolView({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  useProjectRealtime(pid);
  const raw = search?.get('tab');
  const tab: TabId = TABS.some((t) => t.id === raw) ? (raw as TabId) : 'wbs';
  const setTab = useCallback((id: TabId) => {
    const p = new URLSearchParams();
    if (id !== 'wbs') p.set('tab', id);
    const s = p.toString();
    router.replace(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [router, pathname]);
  const issue = Number(search?.get('issue')) || null;
  const setIssue = useCallback((n: number | null) => {
    const p = new URLSearchParams(search?.toString());
    if (n) p.set('issue', String(n)); else p.delete('issue');
    const s = p.toString();
    router.push(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [router, pathname, search]);
  const canEdit = !!config.permissions.editIssues;

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title="FPT reports" />
      <div className="shrink-0 overflow-x-auto border-b border-[var(--w-border)] px-4">
        <div className="flex gap-1" role="tablist" aria-label="FPT reports">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
              className={cn('-mb-px whitespace-nowrap border-b-2 px-2.5 py-2.5 text-[13px] font-medium transition-colors',
                tab === t.id ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        {tab === 'wbs' && <WbsTab pid={pid} onOpenIssue={setIssue} />}
        {tab === 'tracking' && <TrackingTab pid={pid} />}
        {tab === 'weekly' && <WeeklyTab pid={pid} canEdit={canEdit} />}
        {tab === 'ai' && <AiUsageTab pid={pid} canEdit={canEdit} />}
        {tab === 'course' && <CourseTab pid={pid} />}
      </div>
      <IssueDrawer pid={pid} num={issue} onClose={() => setIssue(null)} onOpenIssue={(n) => setIssue(n)} />
    </div>
  );
}

// useSearchParams bắt buộc nằm trong <Suspense> — thiếu là Next 14 báo lỗi lúc build.
export default function SchoolReportsPage() {
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
  if (error || !config || !pid) return <EmptyState title="Project not found" body={error ? workError(error) : 'It may have been deleted, or you do not have access.'} />;
  if (config.role === 'CLIENT' || config.clientView) return <EmptyState title="Not available" body="School reports are only visible to the project team and lecturers." />;
  return <SchoolView config={config} pid={pid} />;
}
