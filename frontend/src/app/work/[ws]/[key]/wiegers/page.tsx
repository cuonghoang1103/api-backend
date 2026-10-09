'use client';

/**
 * CT Work đợt 4b (10/10/2026) — /work/<slug>/<KEY>/wiegers: hồ sơ SWR302 theo sách Wiegers & Beatty.
 * Tab trong `?tab=` (overview | features | requirements | priority | glossary | dictionary | six-links) để chia sẻ link;
 * `?issue=N` mở ngăn kéo thẻ. Năm tài liệu Wiegers (V&S, Use Cases, Business Rules, SRS, Data Dictionary) điền từ dữ liệu
 * dự án + xuất Word/PDF ở tab Tổng quan; bảng ưu tiên / glossary / data dictionary / feature / sáu liên kết xuất .xlsx.
 */

import { Suspense, useCallback } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import ProjectHeader from '@/components/work/ProjectHeader';
import { PageFocusButton } from '@/components/work/shell/panes';
import IssueDrawer from '@/components/work/IssueDrawer';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import OverviewTab from '@/components/work/swr/OverviewTab';
import FeaturesTab from '@/components/work/swr/FeaturesTab';
import RequirementsTab from '@/components/work/swr/RequirementsTab';
import PriorityTab from '@/components/work/swr/PriorityTab';
import { DictionaryTab, GlossaryTab } from '@/components/work/swr/DataTabs';
import SixLinksTab from '@/components/work/swr/SixLinksTab';
import { wt } from '@/components/work/i18n';

const TABS = [
  { id: 'overview', get label() { return wt('swr.tabOverview'); } },
  { id: 'features', get label() { return wt('swr.tabFeatures'); } },
  { id: 'requirements', get label() { return wt('swr.tabRequirements'); } },
  { id: 'priority', get label() { return wt('swr.tabPriority'); } },
  { id: 'glossary', get label() { return wt('swr.tabGlossary'); } },
  { id: 'dictionary', get label() { return wt('swr.tabDictionary'); } },
  { id: 'six-links', get label() { return wt('swr.tabSixLinks'); } },
] as const;
type TabId = (typeof TABS)[number]['id'];

function WiegersView({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  useProjectRealtime(pid);
  const raw = search?.get('tab');
  const tab: TabId = TABS.some((t) => t.id === raw) ? (raw as TabId) : 'overview';
  const setParam = useCallback((patch: Record<string, string | null>, push = false) => {
    const p = new URLSearchParams(search?.toString());
    for (const [k, v] of Object.entries(patch)) { if (v === null) p.delete(k); else p.set(k, v); }
    const s = p.toString();
    (push ? router.push : router.replace)(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [router, pathname, search]);
  const setTab = (id: string) => setParam({ tab: id === 'overview' ? null : id });
  const issue = Number(search?.get('issue')) || null;
  const base = `/work/${config.workspace.slug}/${config.key}`;
  const openIssue = (n: number) => setParam({ issue: String(n) }, true);

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={wt('swr.title')}>
        <PageFocusButton scope="wiegers" />
      </ProjectHeader>
      <div className="shrink-0 overflow-x-auto border-b border-[var(--w-border)] px-4">
        <div className="flex gap-1" role="tablist" aria-label={wt('swr.title')}>
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} data-testid={`swr-tab-${t.id}`}
              className={cn('-mb-px whitespace-nowrap border-b-2 px-2.5 py-2.5 text-[13px] font-medium transition-colors',
                tab === t.id ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-[1400px] p-4">
          {tab === 'overview' && <OverviewTab pid={pid} base={base} onTab={setTab} />}
          {tab === 'features' && <FeaturesTab pid={pid} onOpenIssue={openIssue} />}
          {tab === 'requirements' && <RequirementsTab pid={pid} onOpenIssue={openIssue} />}
          {tab === 'priority' && <PriorityTab pid={pid} />}
          {tab === 'glossary' && <GlossaryTab pid={pid} />}
          {tab === 'dictionary' && <DictionaryTab pid={pid} base={base} />}
          {tab === 'six-links' && <SixLinksTab pid={pid} onTab={setTab} onUcRules={() => router.push(`${base}/requirements`)} />}
        </div>
      </div>
      <IssueDrawer pid={pid} num={issue} onClose={() => setParam({ issue: null }, true)} onOpenIssue={openIssue} />
    </div>
  );
}

// useSearchParams bắt buộc nằm trong <Suspense> — thiếu là Next 14 báo lỗi lúc build.
export default function WiegersPage() {
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
  if (error || !config || !pid) return <EmptyState title={wt('common.projectNotFound')} body={error ? workError(error) : wt('common.projectNotFoundBody')} />;
  if (config.role === 'CLIENT' || config.clientView) return <EmptyState title={wt('school.notAvail')} body={wt('swr.notAvailBody')} />;
  return <WiegersView config={config} pid={pid} />;
}
