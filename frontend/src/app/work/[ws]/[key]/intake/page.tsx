'use client';

/**
 * CT Work đợt 7b (11/10/2026) — /work/<slug>/<KEY>/intake: kênh ngoài (email / Discord / Zalo OA) ⇒ đề xuất chờ duyệt. `?tab=inbox|channels`.
 * Chỉ đội dự án (khách cổng không thấy — server cũng chặn 403).
 */

import { Suspense, useCallback } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import IntakeView from '@/components/work/intake7b/IntakeView';
import { wt } from '@/components/work/i18n';

const TABS = [
  { id: 'inbox', get label() { return wt('c7b.inbox'); } },
  { id: 'channels', get label() { return wt('c7b.channels'); } },
] as const;
type TabId = (typeof TABS)[number]['id'];

function View({ config, pid }: { config: ProjectConfig; pid: number }) {
  useProjectRealtime(pid);
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const raw = search?.get('tab');
  const tab: TabId = TABS.some((t) => t.id === raw) ? (raw as TabId) : 'inbox';
  const setTab = useCallback((id: TabId) => router.replace(id === 'inbox' ? pathname! : `${pathname}?tab=${id}`, { scroll: false }), [router, pathname]);
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={wt('c7b.intakeTitle')} />
      <div className="shrink-0 overflow-x-auto border-b border-[var(--w-border)] px-4">
        <div className="flex gap-1" role="tablist" aria-label={wt('c7b.intakeTitle')}>
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} data-testid={`c7b-tab-${t.id}`} onClick={() => setTab(t.id)}
              className={cn('-mb-px whitespace-nowrap border-b-2 px-2.5 py-2.5 text-[13px] font-medium transition-colors',
                tab === t.id ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-[1400px] p-4">
          <IntakeView config={config} pid={pid} tab={tab} />
        </div>
      </div>
    </div>
  );
}

// useSearchParams bắt buộc nằm trong <Suspense> — thiếu là Next 14 báo lỗi lúc build.
export default function Page() {
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
  if (config.role === 'CLIENT' || config.clientView) return <EmptyState title={wt('school.notAvail')} body={wt('c7b.teamOnly')} />;
  return <View config={config} pid={pid} />;
}
