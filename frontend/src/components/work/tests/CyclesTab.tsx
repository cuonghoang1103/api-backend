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
    else toast.error('You do not have permission to create test cycles');
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
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search cycles" className="w-input !h-[28px] w-[180px] pl-7 text-[12px]" />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {(['ALL', 'PLANNED', 'IN_PROGRESS', 'DONE'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setState(s)}
              className={cn('h-[26px] rounded-full border px-2.5 text-[12px]', state === s ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border-strong)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}
            >
              {s === 'ALL' ? 'All' : CYCLE_STATE_META[s].label}
              <span className="ml-1 tabular text-[var(--w-text-3)]">{s === 'ALL' ? cycles.data?.length ?? 0 : countBy(s)}</span>
            </button>
          ))}
        </div>
        {canEdit && (
          <button type="button" className="w-btn w-btn-primary w-btn-sm ml-auto" onClick={() => setDialog({ tests: [], planId: null })}>
            <Plus size={14} /> New cycle
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {cycles.isLoading ? (
          <div className="flex h-full items-center justify-center py-16"><Spinner size={20} /></div>
        ) : cycles.error ? (
          <EmptyState title="Could not load test cycles" body={workError(cycles.error)} action={<button type="button" className="w-btn" onClick={() => cycles.refetch()}>Try again</button>} />
        ) : !cycles.data?.length ? (
          <EmptyState
            title="No test cycles yet"
            body="A test cycle is one round of execution — for example “Sprint 3 regression on Staging”. Add tests from a plan or pick them individually, then record Pass / Fail for each step."
            action={canEdit ? <button type="button" className="w-btn w-btn-primary" onClick={() => setDialog({ tests: [], planId: null })}><Plus size={14} /> New cycle</button> : undefined}
          />
        ) : !list.length ? (
          <EmptyState title="No matching cycles" body="Try a different search or state filter." />
        ) : (
          <div className="min-w-[760px]">
            <div className="sticky top-0 z-[1] grid grid-cols-[minmax(220px,2fr)_minmax(140px,1fr)_110px_minmax(200px,1.4fr)_90px] gap-3 border-b border-[var(--w-border)] bg-[var(--w-panel)] px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">
              <span>Cycle</span><span>Environment · Build</span><span>State</span><span>Progress</span><span className="text-right">Pass rate</span>
            </div>
            {list.map((c) => (
              <Link
                key={c.id}
                href={cycleHref(c.id)}
                className="grid grid-cols-[minmax(220px,2fr)_minmax(140px,1fr)_110px_minmax(200px,1.4fr)_90px] items-center gap-3 border-b border-[var(--w-border)] px-4 py-2.5 hover:bg-[var(--w-hover)] focus-visible:bg-[var(--w-hover)] focus-visible:outline-none"
              >
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-medium">{c.name}</div>
                  <div className="truncate text-[12px] text-[var(--w-text-3)]">
                    {c.plan ? `Plan: ${c.plan.name}` : 'No plan'} · created {relativeTime(c.createdAt)}
                  </div>
                </div>
                <div className="min-w-0 text-[12px] text-[var(--w-text-2)]">
                  <div className="truncate">{c.environment || <span className="text-[var(--w-text-3)]">No environment</span>}</div>
                  {c.build && <div className="truncate text-[var(--w-text-3)]">Build {c.build}</div>}
                </div>
                <div><CycleStateBadge state={c.state} /></div>
                <div className="min-w-0">
                  <StatusBar counts={c.counts} total={c.total} />
                  <div className="mt-1 text-[12px] tabular text-[var(--w-text-3)]">
                    {c.executed} of {c.total} executed
                    {c.counts.FAIL > 0 && <span className="text-[var(--w-red)]"> · {c.counts.FAIL} failed</span>}
                    {c.counts.BLOCKED > 0 && <span className="text-[var(--w-orange)]"> · {c.counts.BLOCKED} blocked</span>}
                  </div>
                </div>
                <div className="text-right text-[13px] font-semibold tabular">
                  {c.passRate === null ? <span className="font-normal text-[var(--w-text-3)]">—</span> : `${c.passRate}%`}
                </div>
              </Link>
            ))}
          </div>
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
    if (plan && !name) setName(`${plan.name} — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan?.id]);

  const fromPlan = plan?.testNumbers ?? [];
  const extra = tests.filter((n) => !fromPlan.includes(n));
  const total = fromPlan.length + extra.length;

  const submit = async () => {
    if (!name.trim()) { toast.error('Give the cycle a name'); return; }
    setBusy(true);
    try {
      const res = await workApi.createTestCycle(pid, {
        name: name.trim(), environment: environment.trim() || null, build: build.trim() || null,
        planId, numbers: extra,
      });
      qc.invalidateQueries({ queryKey: wk.tests(pid) });
      toast.success(`Cycle “${name.trim()}” created with ${total} test${total === 1 ? '' : 's'}`);
      onCreated(res.id);
    } catch (err) {
      toast.error(workError(err, 'Could not create the cycle'));
      setBusy(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      title="New test cycle"
      width={560}
      footer={
        <>
          <span className="mr-auto self-center text-[12px] text-[var(--w-text-3)]">{total} test{total === 1 ? '' : 's'} will be added</span>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={busy || !name.trim()} onClick={submit}>
            {busy && <Spinner size={12} />} Create cycle
          </button>
        </>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Field label="Name">
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={120} placeholder="e.g. Sprint 3 regression" className="w-input" />
        </Field>
        <div className="grid gap-x-3 sm:grid-cols-2">
          <Field label="Environment">
            <input value={environment} onChange={(e) => setEnvironment(e.target.value)} placeholder="e.g. Staging · Chrome 128" className="w-input" />
          </Field>
          <Field label="Build / version">
            <input value={build} onChange={(e) => setBuild(e.target.value)} placeholder="e.g. 1.4.0-rc2" className="w-input" />
          </Field>
        </div>
        <Field label="Test plan" hint={plan ? `All ${fromPlan.length} test${fromPlan.length === 1 ? '' : 's'} in this plan will be added.` : 'Optional. Adds every test in the plan.'}>
          <Select value={planId ?? ''} onChange={(e) => setPlanId(Number(e.target.value) || null)} disabled={plans.isLoading}>
            <option value="">{plans.isLoading ? 'Loading plans…' : 'No plan'}</option>
            {activePlans.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.testNumbers.length})</option>)}
          </Select>
        </Field>
        <Field label={plan ? 'Additional tests' : 'Tests'} hint={plan && tests.length !== extra.length ? 'Tests already in the plan are counted once.' : undefined}>
          <TestPicker pid={pid} projectKey={config.key} value={tests} onChange={setTests} />
        </Field>
        <button type="submit" hidden />
      </form>
    </Dialog>
  );
}
