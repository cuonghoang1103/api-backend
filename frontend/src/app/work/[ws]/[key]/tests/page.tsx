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
import { PageFocusButton } from '@/components/work/shell/panes'; // UX-E: Focus / Full width
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import LibraryTab from '@/components/work/tests/LibraryTab';
import PlansTab from '@/components/work/tests/PlansTab';
import NewTestDialog from '@/components/work/tests/NewTestDialog';
import { EnableTestingState, testingEnabled } from '@/components/work/tests/testing-ui';
import CyclesTab from '@/components/work/tests/CyclesTab';
import TraceabilityTab from '@/components/work/tests/TraceabilityTab';
import UnitTab from '@/components/work/tests/fpt/UnitTab';
import IntegrationTab from '@/components/work/tests/fpt/IntegrationTab';
// CTW đợt 6 (TST-1 + B2): thiết kế test có công cụ, giám sát & TSR, kiểm thử theo rủi ro, thăm dò, phân tích lỗi.
import DesignTab from '@/components/work/quality/DesignTab';
import QualityTab from '@/components/work/quality/QualityTab';
import RisksTab from '@/components/work/quality/RisksTab';
import ExploratoryTab from '@/components/work/quality/ExploratoryTab';
import DefectsTab from '@/components/work/quality/DefectsTab';
import AutomationTab from '@/components/work/tests/AutomationTab';
import { wt } from '@/components/work/i18n';

const TABS = [
  { id: 'library', get label() { return wt('tests.tabTestLibrary'); } },
  { id: 'plans', get label() { return wt('tests.tabTestPlans'); } },
  { id: 'cycles', get label() { return wt('tests.tabTestCycles'); } },
  { id: 'traceability', get label() { return wt('tests.tabTraceability'); } },
  // Đợt 1b (08/10/2026): tài liệu kiểm thử chuẩn FPT — Report 5.1 / 5.2, xuất/nhập Excel đúng mẫu.
  { id: 'unit', get label() { return wt('tests.tabUnitTests51'); } },
  { id: 'integration', get label() { return wt('tests.tabIntegration52'); } },
  // Đợt 3B (09/10/2026): Report 5.3 System Test — mỗi workflow một sheet, Round 1–3.
  { id: 'system', get label() { return wt('tests.tabSystemTests53'); } },
  { id: 'design', get label() { return wt('q6.tabDesign'); } },
  { id: 'quality', get label() { return wt('q6.tabQuality'); } },
  { id: 'risks', get label() { return wt('q6.tabRisks'); } },
  { id: 'exploratory', get label() { return wt('q6.tabExploratory'); } },
  { id: 'defects', get label() { return wt('q6.tabDefects'); } },
  // CTW đợt 7c (TST-2): kết quả test tự động từ CI (JUnit/Playwright/Jest), flaky, độ phủ code.
  { id: 'automation', get label() { return wt('c7c.tabAutomation'); } },
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
      <ProjectHeader config={config} title={wt('tests.title')}>
        {enabled && <PageFocusButton scope="tests" />}
        {enabled && config.permissions.createIssues && (
          <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setNewOpen(true)}>
            <Plus size={14} /> <span className="hidden sm:inline">{wt('tests.newTest')}</span>
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
            <div className="flex gap-1" role="tablist" aria-label={wt('tests.title')}>
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
            {tab === 'unit' && <UnitTab config={config} pid={pid} />}
            {tab === 'integration' && <IntegrationTab config={config} pid={pid} />}
            {tab === 'system' && <IntegrationTab key="sys" config={config} pid={pid} kind="SYS" />}
            {tab === 'design' && <div className="min-h-0 flex-1 overflow-y-auto"><DesignTab config={config} pid={pid} /></div>}
            {tab === 'quality' && <div className="min-h-0 flex-1 overflow-y-auto"><QualityTab config={config} pid={pid} /></div>}
            {tab === 'risks' && <div className="min-h-0 flex-1 overflow-y-auto"><RisksTab config={config} pid={pid} onOpenIssue={openIssue} /></div>}
            {tab === 'exploratory' && <div className="min-h-0 flex-1 overflow-y-auto"><ExploratoryTab config={config} pid={pid} onOpenIssue={openIssue} /></div>}
            {tab === 'automation' && <div className="min-h-0 flex-1 overflow-y-auto"><AutomationTab config={config} pid={pid} onOpenIssue={openIssue} /></div>}
            {tab === 'defects' && <div className="min-h-0 flex-1 overflow-y-auto"><DefectsTab config={config} pid={pid} onOpenIssue={openIssue} /></div>}
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
    <Suspense fallback={<PageLoading />}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) {
    return <EmptyState title={wt('common.projectNotFound')} body={error ? workError(error) : wt('common.projectNotFoundBody')} />;
  }
  return <TestsView config={config} pid={pid} />;
}
