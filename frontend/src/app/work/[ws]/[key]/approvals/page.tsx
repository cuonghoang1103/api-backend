'use client';

/**
 * /work/<slug>/<KEY>/approvals — phê duyệt của dự án (lớp studio S1, mô-đun
 * approvals). Tab "Waiting on me" (= /me/approvals lọc theo dự án này) và
 * "All" (lọc trạng thái). `?id=<id>` mở chi tiết — thông báo trong chuông trỏ
 * thẳng vào đây (approvals.service.ts projectRef).
 */

import { Suspense, useCallback } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { BadgeCheck, FileText, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  userName, workError, workStudioApi, workStudioKeys, type ApprovalStatus, type ProjectConfig, type WorkApproval,
} from '@/lib/work-api';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading, UserAvatar, formatDate, relativeTime } from '@/components/work/ui';
import { Select } from '@/components/work/settings/shared';
import { ApprovalDialog } from '@/components/work/studio/ApprovalDetail';
import { ApprovalPill, ModuleOff, Pill, studioOn } from '@/components/work/studio/shared';

type Tab = 'mine' | 'all';

function Row({ a, onOpen }: { a: WorkApproval; onOpen: () => void }) {
  const ok = a.steps.filter((s) => s.decision === 'APPROVED').length;
  const overdue = a.status === 'PENDING' && a.dueAt && new Date(a.dueAt) < new Date();
  return (
    <li className="border-b border-[var(--w-border)] last:border-b-0">
      <button type="button" onClick={onOpen} className="flex w-full min-w-0 items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--w-hover)] md:items-center">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[var(--w-sunken)] text-[var(--w-text-3)] md:mt-0">
          {a.targetType === 'STAGE_GATE' ? <Flag size={14} /> : a.targetType === 'DOC' ? <FileText size={14} /> : <BadgeCheck size={14} />}
        </span>
        <span className="min-w-0 flex-1 md:flex md:items-center md:gap-3">
          <span className="flex min-w-0 items-center gap-2 md:flex-1">
            {a.issueKey && <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{a.issueKey}</span>}
            {a.targetType === 'STAGE_GATE' && <span className="shrink-0 text-[12px] text-[var(--w-text-3)]">Gate</span>}
            {a.targetType === 'DOC' && <span className="shrink-0 text-[12px] text-[var(--w-text-3)]">Doc</span>}
            {a.targetType === 'CR' && <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">CR-{a.changeRequest?.number}</span>}
            <span className="truncate text-[14px] font-medium">{a.title}</span>
          </span>
          <span className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-[var(--w-text-3)] md:mt-0 md:shrink-0 md:flex-nowrap">
            <ApprovalPill status={a.status} />
            {a.canDecide && <Pill tone="accent">Your turn</Pill>}
            {a.contentChanged && <Pill tone="orange" title="Content changed after someone signed">Changed</Pill>}
            <span className="flex -space-x-1" title={a.steps.map((s) => userName(s.approver)).join(', ')}>
              {a.steps.slice(0, 4).map((s) => <UserAvatar key={s.id} user={s.approver} size={18} className="ring-2 ring-[var(--w-panel)]" />)}
            </span>
            <span className="tabular">{ok}/{a.steps.length}</span>
            <span className={cn('whitespace-nowrap', overdue && 'font-medium text-[var(--w-red)]')}>
              {a.status === 'PENDING' && a.dueAt ? `Due ${formatDate(a.dueAt)}` : relativeTime(a.decidedAt ?? a.createdAt)}
            </span>
          </span>
        </span>
      </button>
    </li>
  );
}

function ApprovalsView({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const tab: Tab = sp?.get('tab') === 'all' ? 'all' : 'mine';
  const status = (sp?.get('status') ?? '') as ApprovalStatus | '';
  const openId = Number(sp?.get('id')) || null;
  const setParams = useCallback((patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp?.toString() ?? '');
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    const s = next.toString();
    router.replace(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [sp, pathname, router]);

  const mine = useQuery({ queryKey: workStudioKeys.myApprovals, queryFn: workStudioApi.myApprovals, staleTime: 15_000 });
  const all = useQuery({
    queryKey: [...workStudioKeys.approvals(pid), 'list', status],
    queryFn: () => workStudioApi.approvals(pid, { status: status || undefined, limit: 200 }),
    enabled: tab === 'all',
  });
  const mineHere = (mine.data ?? []).filter((a) => a.project.id === pid);
  const list = tab === 'mine' ? mineHere : all.data ?? [];
  const loading = tab === 'mine' ? mine.isLoading : all.isLoading;
  const err = tab === 'mine' ? mine.error : all.error;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      <div className="w-page">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-[7px] border border-[var(--w-border-strong)] p-0.5" role="tablist" aria-label="Approvals">
            {([['mine', 'Waiting on me'], ['all', 'All']] as const).map(([k, label]) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={tab === k}
                onClick={() => setParams({ tab: k === 'mine' ? null : k })}
                className={cn('flex h-7 items-center gap-1.5 rounded-[5px] px-3 text-[13px] font-medium', tab === k ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]')}
              >
                {label}
                {k === 'mine' && mineHere.length > 0 && <span className="w-count">{mineHere.length}</span>}
              </button>
            ))}
          </div>
          {tab === 'all' && (
            <Select aria-label="Status" value={status} onChange={(e) => setParams({ status: e.target.value || null })} className="!h-8 !w-auto">
              <option value="">Any status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </Select>
          )}
          <p className="ml-auto text-[12px] text-[var(--w-text-3)] max-sm:w-full">Request an approval from an issue’s detail page. Gate reviews start from Stages.</p>
        </div>
        {loading ? <PageLoading rows={4} /> : err ? (
          <EmptyState title="Could not load approvals" body={workError(err)} />
        ) : list.length ? (
          <ul className="w-card overflow-hidden">{list.map((a) => <Row key={a.id} a={a} onOpen={() => setParams({ id: String(a.id) })} />)}</ul>
        ) : (
          <EmptyState
            icon={<BadgeCheck size={20} />}
            title={tab === 'mine' ? 'Nothing is waiting on you' : 'No approvals yet'}
            body={tab === 'mine' ? 'Approval requests that need your decision show up here — and in My work across all projects.' : 'Ask for sign-off from an issue (its Approvals section → Request approval), or send a stage for its gate review.'}
          />
        )}
      </div>
      <ApprovalDialog pid={pid} approvalId={openId} config={config} onClose={() => setParams({ id: null })} />
    </div>
  );
}

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title="Project not found" body={error ? workError(error) : undefined} />;
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title="Approvals" />
      {studioOn(config, 'approvals') ? <ApprovalsView config={config} pid={pid} /> : <ModuleOff config={config} label="Approvals" />}
    </div>
  );
}

export default function ApprovalsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Inner />
    </Suspense>
  );
}
