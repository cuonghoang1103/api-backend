'use client';

/**
 * CT Work đợt 6 (11/10/2026) — /work/<slug>/<KEY>/reviews: phiên review/inspection (tài liệu + mã) và baseline yêu cầu.
 * `?tab=reviews|baselines` · `?review=N` mở chi tiết phiên · `?baseline=N` chọn baseline · `?issue=N` mở ngăn kéo thẻ.
 * Chỉ đội dự án (khách cổng không thấy — server cũng chặn 403).
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
import ReviewList from '@/components/work/quality/ReviewList';
import ReviewDetail from '@/components/work/quality/ReviewDetail';
import BaselinesTab from '@/components/work/quality/BaselinesTab';
import { wt } from '@/components/work/i18n';

const TABS = [
  { id: 'reviews', get label() { return wt('q6.tabReviews'); } },
  { id: 'baselines', get label() { return wt('q6.tabBaselines'); } },
] as const;
type TabId = (typeof TABS)[number]['id'];

function ReviewsView({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  useProjectRealtime(pid);
  const raw = search?.get('tab');
  const tab: TabId = TABS.some((t) => t.id === raw) ? (raw as TabId) : 'reviews';
  const setParam = useCallback((patch: Record<string, string | null>, push = false) => {
    const p = new URLSearchParams(search?.toString());
    for (const [k, v] of Object.entries(patch)) { if (v === null) p.delete(k); else p.set(k, v); }
    const s = p.toString();
    (push ? router.push : router.replace)(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [router, pathname, search]);
  const review = Number(search?.get('review')) || null;
  const baseline = Number(search?.get('baseline')) || null;
  const issue = Number(search?.get('issue')) || null;
  const openIssue = (n: number) => setParam({ issue: String(n) }, true);

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={wt('q6.title')}>
        <PageFocusButton scope="reviews" />
      </ProjectHeader>
      <div className="shrink-0 overflow-x-auto border-b border-[var(--w-border)] px-4">
        <div className="flex gap-1" role="tablist" aria-label={wt('q6.title')}>
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} data-testid={`q6-tab-${t.id}`}
              onClick={() => setParam({ tab: t.id === 'reviews' ? null : t.id, review: null, baseline: null })}
              className={cn('-mb-px whitespace-nowrap border-b-2 px-2.5 py-2.5 text-[13px] font-medium transition-colors',
                tab === t.id ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-[1400px] p-4">
          {tab === 'reviews' && (review
            ? <ReviewDetail key={review} config={config} pid={pid} num={review} onBack={() => setParam({ review: null }, true)} onOpenIssue={openIssue} />
            : <ReviewList config={config} pid={pid} onOpen={(n) => setParam({ review: String(n) }, true)} />)}
          {tab === 'baselines' && <BaselinesTab config={config} pid={pid} selected={baseline} onSelect={(n) => setParam({ baseline: n ? String(n) : null })} />}
        </div>
      </div>
      <IssueDrawer pid={pid} num={issue} onClose={() => setParam({ issue: null }, true)} onOpenIssue={openIssue} />
    </div>
  );
}

// useSearchParams bắt buộc nằm trong <Suspense> — thiếu là Next 14 báo lỗi lúc build.
export default function ReviewsPage() {
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
  if (config.role === 'CLIENT' || config.clientView) return <EmptyState title={wt('school.notAvail')} body={wt('q6.notAvailBody')} />;
  return <ReviewsView config={config} pid={pid} />;
}
