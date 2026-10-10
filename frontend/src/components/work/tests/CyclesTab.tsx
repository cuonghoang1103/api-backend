'use client';

/**
 * Tab "Cycles": danh sách đợt chạy test + hộp thoại tạo cycle.
 * `?new=1&tests=1,2,3` hoặc `?new=1&plan=<id>` ⇒ tự mở hộp thoại, điền sẵn.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workApi, workError, type CycleState, type ProjectConfig } from '@/lib/work-api';
import { wk } from '../hooks';
import { Dialog, EmptyState, Field, relativeTime, Spinner } from '../ui';
import { Select } from '../settings/shared';
import TestPicker from './TestPicker';
import { CycleStateBadge, CYCLE_STATE_META, StatusBar } from './runStatus';
import { wt, wfmt } from '@/components/work/i18n';
import DataTable from '../table/DataTable';

export default function CyclesTab({ config, pid }: { config: ProjectConfig; pid: number }) {
  // Realtime do trang /tests gọi (gọi thêm ở đây thì rời tab sẽ `work:leave` mất phòng của trang).
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const cycles = useQuery({ queryKey: [...wk.tests(pid), 'cycles'], queryFn: () => workApi.testCycles(pid) });
  const canEdit = config.permissions.editIssues;

  const [q, setQ] = useState('');
  const [state, setState] = useState<CycleState | 'ALL'>('ALL');
  const [dialog, setDialog] = useState<{ tests: number[]; planId: number | null } | null>(null);

  // Mở hộp thoại từ tab Library / Plans rồi gỡ tham số khỏi URL (F5 không mở lại).
  const wantsNew = search?.get('new') === '1';
  useEffect(() => {
    if (!wantsNew) return;
    const tests = (search?.get('tests') ?? '').split(',').map(Number).filter((n) => Number.isInteger(n) && n > 0);
    const planId = Number(search?.get('plan')) || null;
    if (canEdit) setDialog({ tests: [...new Set(tests)], planId });
    else toast.error(wt('tests.noCyclePerm'));
    const p = new URLSearchParams(search?.toString());
    ['new', 'tests', 'plan'].forEach((k) => p.delete(k));
    const s = p.toString();
    router.replace(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [wantsNew, search, router, pathname, canEdit]);

  const cycleHref = useCallback((id: number) => `/work/${config.workspace.slug}/${config.key}/tests/cycles/${id}`, [config.workspace.slug, config.key]);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (cycles.data ?? []).filter((c) => (state === 'ALL' || c.state === state)
      && (!t || `${c.name} ${c.environment ?? ''} ${c.build ?? ''} ${c.plan?.name ?? ''}`.toLowerCase().includes(t)));
  }, [cycles.data, q, state]);

  const countBy = (s: CycleState) => cycles.data?.filter((c) => c.state === s).length ?? 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[var(--w-border)] px-4 py-2">
        <div className="relative">
          <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={wt('tests.searchCycles')} aria-label={wt('tests.searchCycles')} className="w-input !h-[28px] w-[180px] pl-7 text-[12px]" />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {(['ALL', 'PLANNED', 'IN_PROGRESS', 'DONE'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setState(s)}
              className={cn('h-[26px] rounded-full border px-2.5 text-[12px]', state === s ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border-strong)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}
            >
              {s === 'ALL' ? wt('common.all') : CYCLE_STATE_META[s].label}
              <span className="ml-1 tabular text-[var(--w-text-3)]">{s === 'ALL' ? cycles.data?.length ?? 0 : countBy(s)}</span>
            </button>
          ))}
        </div>
        {canEdit && (
          <button type="button" className="w-btn w-btn-primary w-btn-sm ml-auto" onClick={() => setDialog({ tests: [], planId: null })}>
            <Plus size={14} /> {wt('tests.newCycle')}
          </button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {cycles.isLoading ? (
          <div className="flex h-full items-center justify-center py-16"><Spinner size={20} /></div>
        ) : cycles.error ? (
          <EmptyState title={wt('tests.cyclesLoadFailed')} body={workError(cycles.error)} action={<button type="button" className="w-btn" onClick={() => cycles.refetch()}>{wt('common.tryAgain')}</button>} />
        ) : !cycles.data?.length ? (
          <EmptyState
            title={wt('tests.noCycles')}
            body={wt('tests.noCyclesBody')}
            action={canEdit ? <button type="button" className="w-btn w-btn-primary" onClick={() => setDialog({ tests: [], planId: null })}><Plus size={14} /> {wt('tests.newCycle')}</button> : undefined}
          />
        ) : !list.length ? (
          <EmptyState title={wt('tests.noMatchCycles')} body={wt('tests.noMatchCyclesBody')} />
        ) : (
          // UX-C: bảng chung — sắp xếp theo tiến độ/tỉ lệ đạt, cột, xuất.
          <DataTable
            id="tests-cycles"
            label={wt('uxc.testCycles')}
            rows={list}
            rowKey={(c) => c.id}
            quickFilter={false}
            onRowOpen={(c) => router.push(cycleHref(c.id))}
            exportName={`${config.key}-test-cycles`}
            testId="tests-cycles"
            columns={[
              { id: 'name', header: wt('tests.cycle'), width: 260, grow: true, required: true, value: (c) => c.name,
                cell: (c) => (
                  <Link href={cycleHref(c.id)} className="block min-w-0">
                    <span className="block truncate text-[13px] font-medium">{c.name}</span>
                    <span className="block truncate text-[12px] text-[var(--w-text-3)]">{c.plan ? wt('tests.planName', { name: c.plan.name }) : wt('tests.noPlan')} · {wt('tests.createdAgo', { when: relativeTime(c.createdAt) })}</span>
                  </Link>
                ) },
              { id: 'env', header: wt('tests.envBuild'), width: 170, hideBelow: 'md', value: (c) => [c.environment, c.build].filter(Boolean).join(' · ') || null,
                cell: (c) => (
                  <span className="min-w-0 text-[12px] text-[var(--w-text-2)]">
                    <span className="block truncate">{c.environment || <span className="text-[var(--w-text-3)]">{wt('tests.noEnv')}</span>}</span>
                    {c.build && <span className="block truncate text-[var(--w-text-3)]">{wt('tests.buildN', { b: c.build })}</span>}
                  </span>
                ) },
              { id: 'state', header: wt('tests.state'), width: 120, value: (c) => CYCLE_STATE_META[c.state].label, cell: (c) => <CycleStateBadge state={c.state} /> },
              { id: 'progress', header: wt('common.progress'), width: 230, value: (c) => (c.total ? c.executed / c.total : 0), exportValue: (c) => `${c.executed}/${c.total}`,
                cell: (c) => (
                  <span className="block min-w-0 flex-1">
                    <StatusBar counts={c.counts} total={c.total} />
                    <span className="mt-1 block truncate text-[12px] tabular text-[var(--w-text-3)]">
                      {wt('tests.executedOf', { done: c.executed, total: c.total })}
                      {c.counts.FAIL > 0 && <span className="text-[var(--w-red-text)]"> · {wt('tests.nFailed', { n: c.counts.FAIL })}</span>}
                      {c.counts.BLOCKED > 0 && <span className="text-[var(--w-orange-text)]"> · {wt('tests.nBlocked', { n: c.counts.BLOCKED })}</span>}
                    </span>
                  </span>
                ) },
              { id: 'failed', header: wt('uxc.colFailed'), width: 80, align: 'right', defaultHidden: true, value: (c) => c.counts.FAIL },
              { id: 'pass', header: wt('tests.passRate'), width: 100, align: 'right', value: (c) => c.passRate,
                cell: (c) => <span className="text-[13px] font-semibold tabular">{c.passRate === null ? <span className="font-normal text-[var(--w-text-3)]">—</span> : `${c.passRate}%`}</span> },
            ]}
          />
        )}
      </div>

      {dialog && (
        <NewCycleDialog
          config={config}
          pid={pid}
          initialTests={dialog.tests}
          initialPlanId={dialog.planId}
          onClose={() => setDialog(null)}
          onCreated={(id) => { setDialog(null); router.push(cycleHref(id)); }}
        />
      )}
    </div>
  );
}

function NewCycleDialog({ config, pid, initialTests, initialPlanId, onClose, onCreated }: {
  config: ProjectConfig; pid: number; initialTests: number[]; initialPlanId: number | null;
  onClose: () => void; onCreated: (id: number) => void;
}) {
  const qc = useQueryClient();
  const plans = useQuery({ queryKey: [...wk.tests(pid), 'plans'], queryFn: () => workApi.testPlans(pid) });
  const [name, setName] = useState('');
  const [environment, setEnvironment] = useState('');
  const [build, setBuild] = useState('');
  const [planId, setPlanId] = useState<number | null>(initialPlanId);
  const [tests, setTests] = useState<number[]>(initialTests);
  const [busy, setBusy] = useState(false);

  const activePlans = (plans.data ?? []).filter((p) => !p.archivedAt || p.id === planId);
  const plan = plans.data?.find((p) => p.id === planId);

  // Tên gợi ý khi mở từ một plan.
  useEffect(() => {
    if (plan && !name) setName(`${plan.name} — ${new Date().toLocaleDateString(wfmt.intl(), { month: 'short', day: 'numeric' })}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan?.id]);

  const fromPlan = plan?.testNumbers ?? [];
  const extra = tests.filter((n) => !fromPlan.includes(n));
  const total = fromPlan.length + extra.length;

  const submit = async () => {
    if (!name.trim()) { toast.error(wt('tests.cycleNameReq')); return; }
    setBusy(true);
    try {
      const res = await workApi.createTestCycle(pid, {
        name: name.trim(), environment: environment.trim() || null, build: build.trim() || null,
        planId, numbers: extra,
      });
      qc.invalidateQueries({ queryKey: wk.tests(pid) });
      toast.success(wt('tests.cycleCreated', { name: name.trim(), count: total }));
      onCreated(res.id);
    } catch (err) {
      toast.error(workError(err, wt('tests.cycleCreateFailed')));
      setBusy(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      title={wt('tests.newTestCycle')}
      width={560}
      footer={
        <>
          <span className="mr-auto self-center text-[12px] text-[var(--w-text-3)]">{wt('tests.willAdd', { count: total })}</span>
          <button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button>
          <button type="button" className="w-btn w-btn-primary" disabled={busy || !name.trim()} onClick={submit}>
            {busy && <Spinner size={12} />} {wt('tests.createCycleBtn')}
          </button>
        </>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Field label={wt('common.name')}>
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={120} placeholder={wt('tests.cycleNamePh')} className="w-input" />
        </Field>
        <div className="grid gap-x-3 sm:grid-cols-2">
          <Field label={wt('tests.environment')}>
            <input value={environment} onChange={(e) => setEnvironment(e.target.value)} placeholder={wt('tests.envPh')} className="w-input" />
          </Field>
          <Field label={wt('tests.buildVersion')}>
            <input value={build} onChange={(e) => setBuild(e.target.value)} placeholder={wt('tests.buildPh')} className="w-input" />
          </Field>
        </div>
        <Field label="Test plan" hint={plan ? wt('tests.allInPlan', { count: fromPlan.length }) : wt('tests.planOptional')}>
          <Select value={planId ?? ''} onChange={(e) => setPlanId(Number(e.target.value) || null)} disabled={plans.isLoading}>
            <option value="">{plans.isLoading ? wt('tests.loadingPlans') : wt('tests.noPlan')}</option>
            {activePlans.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.testNumbers.length})</option>)}
          </Select>
        </Field>
        <Field label={plan ? wt('tests.additional') : wt('tests.testsLbl')} hint={plan && tests.length !== extra.length ? wt('tests.countedOnce') : undefined}>
          <TestPicker pid={pid} projectKey={config.key} value={tests} onChange={setTests} />
        </Field>
        <button type="submit" hidden />
      </form>
    </Dialog>
  );
}
