'use client';

/**
 * Test plan: nhóm test dùng lại cho nhiều lượt chạy (cycle). Tạo/sửa,
 * thêm/bớt test, lưu trữ, xoá, và "Run this plan" ⇒ tab Cycles.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Archive, ArchiveRestore, ChevronDown, ChevronRight, ListChecks, MoreHorizontal, Pencil, PlayCircle, Plus, Search, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workApi, workError, type ProjectConfig, type TestListItem, type TestPlan } from '@/lib/work-api';
import { useLookups, wk } from '../hooks';
import { ConfirmDialog } from '../settings/shared';
import { Dialog, EmptyState, Field, formatDate, Popover, Spinner } from '../ui';
import { RunStatusPill } from './testing-ui';

export default function PlansTab({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const qc = useQueryClient();
  const lk = useLookups(config);
  const base = `/work/${config.workspace.slug}/${config.key}/tests`;
  const canEdit = config.permissions.editIssues;

  const plans = useQuery({ queryKey: [...wk.tests(pid), 'plans'], queryFn: () => workApi.testPlans(pid) });
  const tests = useQuery({ queryKey: [...wk.tests(pid), 'list', ''], queryFn: () => workApi.tests(pid) });
  const testMap = useMemo(() => new Map((tests.data ?? []).map((t) => [t.number, t])), [tests.data]);

  const [showArchived, setShowArchived] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [editing, setEditing] = useState<TestPlan | 'new' | null>(null);
  const [managing, setManaging] = useState<TestPlan | null>(null);
  const [deleting, setDeleting] = useState<TestPlan | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: wk.tests(pid) });
  const all = plans.data ?? [];
  const visible = all.filter((p) => showArchived || !p.archivedAt);
  const archivedCount = all.filter((p) => p.archivedAt).length;

  const setArchived = async (p: TestPlan, archived: boolean) => {
    try {
      await workApi.updateTestPlan(pid, p.id, { archived });
      toast.success(archived ? `“${p.name}” archived` : `“${p.name}” restored`);
      refresh();
    } catch (e) { toast.error(workError(e)); }
  };
  const removeTest = async (p: TestPlan, num: number) => {
    try {
      await workApi.updateTestPlan(pid, p.id, { removeNumbers: [num] });
      refresh();
    } catch (e) { toast.error(workError(e)); }
  };
  const doDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await workApi.deleteTestPlan(pid, deleting.id);
      toast.success(`Plan “${deleting.name}” deleted`);
      setDeleting(null);
      refresh();
    } catch (e) { toast.error(workError(e)); } finally { setBusy(false); }
  };
  const run = (p: TestPlan) => router.push(`${base}?${new URLSearchParams({ tab: 'cycles', new: '1', plan: String(p.id) }).toString()}`);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1000px] px-4 py-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="text-[14px] font-semibold">Test plans</h2>
            <p className="text-[12.5px] text-[var(--w-text-2)]">A plan is a reusable set of tests — for a release, a feature, or a regression suite. Run it as many times as you need.</p>
          </div>
          {archivedCount > 0 && (
            <label className="flex items-center gap-1.5 text-[12px] text-[var(--w-text-2)]">
              <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="accent-[var(--w-accent)]" />
              Show archived ({archivedCount})
            </label>
          )}
          {canEdit && (
            <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setEditing('new')}><Plus size={13} /> New plan</button>
          )}
        </div>

        {plans.isLoading ? (
          <div className="flex h-40 items-center justify-center"><Spinner size={20} /></div>
        ) : plans.error ? (
          <EmptyState title="Could not load test plans" body={workError(plans.error)} action={<button type="button" className="w-btn" onClick={() => plans.refetch()}>Try again</button>} />
        ) : !visible.length ? (
          <EmptyState
            title={all.length ? 'All plans are archived' : 'No test plans yet'}
            body={all.length ? 'Show archived plans to see them.' : 'Group related tests into a plan, then start a test cycle from it whenever you need to run them.'}
            action={canEdit && !all.length ? <button type="button" className="w-btn w-btn-primary" onClick={() => setEditing('new')}>New plan</button> : undefined}
          />
        ) : (
          <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)]">
            {visible.map((p) => {
              const open = expanded === p.id;
              return (
                <div key={p.id} className="border-b border-[var(--w-border)] last:border-b-0">
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <button type="button" onClick={() => setExpanded(open ? null : p.id)} className="flex min-w-0 flex-1 items-start gap-2 text-left" aria-expanded={open}>
                      <span className="mt-[2px] shrink-0 text-[var(--w-text-3)]">{open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-1.5">
                          <span className={cn('truncate text-[13.5px] font-medium', p.archivedAt && 'text-[var(--w-text-3)]')}>{p.name}</span>
                          {p.archivedAt && <span className="rounded-[4px] bg-[var(--w-sunken)] px-1.5 text-[10.5px] font-medium uppercase text-[var(--w-text-3)]">Archived</span>}
                        </span>
                        <span className="mt-0.5 block text-[12px] text-[var(--w-text-3)]">
                          <span className="tabular">{p.testNumbers.length}</span> test{p.testNumbers.length === 1 ? '' : 's'} · <span className="tabular">{p.cycleCount}</span> cycle{p.cycleCount === 1 ? '' : 's'} · Created {formatDate(p.createdAt)}
                        </span>
                      </span>
                    </button>
                    {canEdit && !p.archivedAt && (
                      <button type="button" className="w-btn w-btn-sm" onClick={() => run(p)} disabled={!p.testNumbers.length} title={p.testNumbers.length ? 'Create a test cycle from this plan' : 'Add tests to the plan first'}>
                        <PlayCircle size={13} /> <span className="max-sm:hidden">Run this plan</span>
                      </button>
                    )}
                    {canEdit && (
                      <PlanMenu
                        plan={p}
                        onEdit={() => setEditing(p)}
                        onManage={() => setManaging(p)}
                        onArchive={() => setArchived(p, !p.archivedAt)}
                        onDelete={() => setDeleting(p)}
                      />
                    )}
                  </div>
                  {open && (
                    <div className="border-t border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-3 sm:pl-9">
                      {p.description && <p className="mb-3 whitespace-pre-wrap text-[13px] text-[var(--w-text-2)]">{p.description}</p>}
                      {!p.testNumbers.length ? (
                        <p className="text-[12.5px] text-[var(--w-text-3)]">This plan has no tests yet.{canEdit && ' Use “Manage tests” to add some.'}</p>
                      ) : (
                        <ul className="divide-y divide-[var(--w-border)] rounded-[6px] border border-[var(--w-border)] bg-[var(--w-panel)]">
                          {p.testNumbers.map((n) => {
                            const t = testMap.get(n);
                            return (
                              <li key={n} className="flex items-center gap-2 px-2.5 py-1.5 text-[13px]">
                                <button type="button" onClick={() => router.push(`${base}/${n}`)} className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)] hover:underline">{lk.issueKey(n)}</button>
                                <span className="min-w-0 flex-1 truncate">{t?.title ?? <span className="text-[var(--w-text-3)]">{tests.isLoading ? 'Loading…' : 'Unavailable'}</span>}</span>
                                {t?.lastRun && <RunStatusPill status={t.lastRun.status} title={t.lastRun.cycleName} />}
                                {canEdit && (
                                  <button type="button" onClick={() => removeTest(p, n)} className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`Remove ${lk.issueKey(n)} from plan`} title="Remove from plan">
                                    <X size={13} />
                                  </button>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      {canEdit && (
                        <button type="button" className="w-btn w-btn-sm mt-2" onClick={() => setManaging(p)}><ListChecks size={13} /> Manage tests</button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <PlanDialog
        open={editing !== null}
        plan={editing === 'new' ? null : editing}
        onClose={() => setEditing(null)}
        pid={pid}
        onSaved={(id, isNew) => { refresh(); if (isNew) { setExpanded(id); } }}
        tests={tests.data ?? []}
        issueKey={lk.issueKey}
      />
      <ManageTestsDialog
        plan={managing}
        onClose={() => setManaging(null)}
        pid={pid}
        tests={tests.data}
        testsLoading={tests.isLoading}
        issueKey={lk.issueKey}
        onSaved={refresh}
      />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={doDelete}
        pending={busy}
        title="Delete test plan?"
        confirmLabel="Delete plan"
        body={<>The plan <b className="text-[var(--w-text)]">{deleting?.name}</b> will be deleted. Its tests and any test cycles already run from it are kept.</>}
      />
    </div>
  );
}

function PlanMenu({ plan, onEdit, onManage, onArchive, onDelete }: { plan: TestPlan; onEdit: () => void; onManage: () => void; onArchive: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const item = 'flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]';
  const act = (fn: () => void) => () => { setOpen(false); fn(); };
  return (
    <>
      <button ref={ref} type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => setOpen((v) => !v)} aria-label={`Actions for ${plan.name}`}>
        <MoreHorizontal size={15} />
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={ref} width={180} align="end" className="p-1">
        <button type="button" className={item} onClick={act(onEdit)}><Pencil size={13} /> Edit details</button>
        <button type="button" className={item} onClick={act(onManage)}><ListChecks size={13} /> Manage tests</button>
        <button type="button" className={item} onClick={act(onArchive)}>
          {plan.archivedAt ? <><ArchiveRestore size={13} /> Restore</> : <><Archive size={13} /> Archive</>}
        </button>
        <div className="my-1 border-t border-[var(--w-border)]" />
        <button type="button" className={cn(item, 'text-[var(--w-red)]')} onClick={act(onDelete)}><Trash2 size={13} /> Delete</button>
      </Popover>
    </>
  );
}

function PlanDialog({ open, plan, onClose, pid, onSaved, tests, issueKey }: {
  open: boolean; plan: TestPlan | null; onClose: () => void; pid: number; onSaved: (id: number, isNew: boolean) => void;
  tests: TestListItem[]; issueKey: (n: number) => string;
}) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [picked, setPicked] = useState<number[]>([]);
  const [pending, setPending] = useState(false);
  const [tried, setTried] = useState(false);
  useEffect(() => {
    if (!open) return;
    setName(plan?.name ?? ''); setDesc(plan?.description ?? ''); setPicked([]); setTried(false);
  }, [open, plan]);

  const save = async () => {
    setTried(true);
    if (!name.trim()) return;
    setPending(true);
    try {
      if (plan) {
        await workApi.updateTestPlan(pid, plan.id, { name: name.trim(), description: desc.trim() || null });
        toast.success('Plan updated');
        onSaved(plan.id, false);
      } else {
        const r = await workApi.createTestPlan(pid, { name: name.trim(), description: desc.trim() || null, numbers: picked });
        toast.success(`Plan “${name.trim()}” created`);
        onSaved(r.id, true);
      }
      onClose();
    } catch (e) {
      toast.error(workError(e, 'Could not save the plan'));
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !pending && onClose()}
      title={plan ? 'Edit test plan' : 'New test plan'}
      width={plan ? 520 : 640}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose} disabled={pending}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" onClick={save} disabled={pending}>{pending && <Spinner size={12} />} {plan ? 'Save' : 'Create plan'}</button>
        </>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); save(); }}>
        <Field label="Name">
          <input autoFocus className={cn('w-input', tried && !name.trim() && '!border-[var(--w-red)]')} value={name} maxLength={120} onChange={(e) => setName(e.target.value)} placeholder="e.g. Release 1.2 regression" />
          {tried && !name.trim() && <p className="mt-1 text-[12px] text-[var(--w-red)]">Name is required.</p>}
        </Field>
        <Field label="Description">
          <textarea className="w-input min-h-[72px]" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Scope, target release, entry/exit criteria…" />
        </Field>
        <button type="submit" className="hidden" aria-hidden tabIndex={-1} />
      </form>
      {!plan && (
        <div>
          <label className="w-label">Tests <span className="font-normal text-[var(--w-text-3)]">({picked.length} selected)</span></label>
          <TestChecklist tests={tests} value={picked} onChange={setPicked} issueKey={issueKey} />
        </div>
      )}
    </Dialog>
  );
}

function ManageTestsDialog({ plan, onClose, pid, tests, testsLoading, issueKey, onSaved }: {
  plan: TestPlan | null; onClose: () => void; pid: number; tests: TestListItem[] | undefined; testsLoading: boolean;
  issueKey: (n: number) => string; onSaved: () => void;
}) {
  const [picked, setPicked] = useState<number[]>([]);
  const [pending, setPending] = useState(false);
  useEffect(() => { if (plan) setPicked(plan.testNumbers); }, [plan]);

  const add = plan ? picked.filter((n) => !plan.testNumbers.includes(n)) : [];
  const remove = plan ? plan.testNumbers.filter((n) => !picked.includes(n)) : [];

  const save = async () => {
    if (!plan) return;
    setPending(true);
    try {
      await workApi.updateTestPlan(pid, plan.id, { addNumbers: add, removeNumbers: remove });
      toast.success('Plan tests updated');
      onSaved();
      onClose();
    } catch (e) {
      toast.error(workError(e, 'Could not update the plan'));
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={!!plan}
      onClose={() => !pending && onClose()}
      title={plan ? `Tests in “${plan.name}”` : ''}
      width={640}
      footer={
        <>
          <span className="mr-auto self-center text-[12px] text-[var(--w-text-3)]">
            {add.length || remove.length ? `+${add.length} / −${remove.length}` : `${picked.length} selected`}
          </span>
          <button type="button" className="w-btn" onClick={onClose} disabled={pending}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" onClick={save} disabled={pending || (!add.length && !remove.length)}>{pending && <Spinner size={12} />} Save</button>
        </>
      }
    >
      {testsLoading ? (
        <div className="flex h-32 items-center justify-center"><Spinner /></div>
      ) : (
        <TestChecklist tests={tests ?? []} value={picked} onChange={setPicked} issueKey={issueKey} />
      )}
    </Dialog>
  );
}

/** Danh sách test có ô tìm + checkbox (lọc phía client — đã có toàn bộ danh sách). */
function TestChecklist({ tests, value, onChange, issueKey }: {
  tests: TestListItem[]; value: number[]; onChange: (v: number[]) => void; issueKey: (n: number) => string;
}) {
  const [q, setQ] = useState('');
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return tests;
    return tests.filter((x) => x.title.toLowerCase().includes(t) || issueKey(x.number).toLowerCase().includes(t));
  }, [q, tests, issueKey]);
  const allShown = shown.length > 0 && shown.every((t) => value.includes(t.number));
  const toggleShown = () => {
    const nums = shown.map((t) => t.number);
    onChange(allShown ? value.filter((n) => !nums.includes(n)) : [...new Set([...value, ...nums])]);
  };
  if (!tests.length) return <p className="py-4 text-center text-[13px] text-[var(--w-text-3)]">There are no tests in this project yet.</p>;
  return (
    <div className="rounded-[8px] border border-[var(--w-border)]">
      <div className="flex items-center gap-2 border-b border-[var(--w-border)] px-2.5">
        <Search size={13} className="shrink-0 text-[var(--w-text-3)]" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter tests" className="h-9 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--w-text-3)]" />
        <button type="button" onClick={toggleShown} className="shrink-0 text-[12px] font-medium text-[var(--w-accent-text)] hover:underline">{allShown ? 'Deselect shown' : 'Select shown'}</button>
      </div>
      <div className="max-h-[320px] overflow-y-auto p-1">
        {shown.map((t) => (
          <label key={t.number} className="flex cursor-pointer items-center gap-2 rounded-[5px] px-2 py-1.5 text-[13px] hover:bg-[var(--w-hover)]">
            <input
              type="checkbox"
              checked={value.includes(t.number)}
              onChange={() => onChange(value.includes(t.number) ? value.filter((n) => n !== t.number) : [...value, t.number])}
              className="accent-[var(--w-accent)]"
            />
            <span className="w-[72px] shrink-0 font-mono text-[11.5px] text-[var(--w-text-2)]">{issueKey(t.number)}</span>
            <span className="min-w-0 flex-1 truncate">{t.title}</span>
            <span className="hidden shrink-0 text-[11px] text-[var(--w-text-3)] sm:inline">{t.kind === 'GHERKIN' ? 'Gherkin' : `${t.stepCount} steps`}</span>
          </label>
        ))}
        {!shown.length && <p className="px-2 py-3 text-center text-[12px] text-[var(--w-text-3)]">No tests match “{q}”.</p>}
      </div>
    </div>
  );
}
