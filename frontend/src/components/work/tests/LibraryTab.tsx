'use client';

/**
 * Thư viện test case: bảng tìm được (server `q`), chọn nhiều để thêm vào
 * plan hoặc tạo test cycle. Bấm dòng mở trang test case.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileUp, ListPlus, PlayCircle, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workApi, workError, type ProjectConfig, type TestListItem } from '@/lib/work-api';
import { useLookups, wk } from '../hooks';
import { EmptyState, PickerList, Popover, PriorityIcon, relativeTime, Spinner, UserAvatar } from '../ui';
import ImportTestsDialog from './ImportTestsDialog';
import { RunStatusPill } from './testing-ui';
import { wt, wfmt } from '@/components/work/i18n';

export default function LibraryTab({ config, pid, onOpenIssue, onNewTest }: {
  config: ProjectConfig;
  pid: number;
  /** Mở ngăn kéo thẻ (requirement) trên trang Tests. */
  onOpenIssue: (num: number) => void;
  onNewTest?: () => void;
}) {
  const router = useRouter();
  const qc = useQueryClient();
  const lk = useLookups(config);
  const base = `/work/${config.workspace.slug}/${config.key}/tests`;
  const [input, setInput] = useState('');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [importOpen, setImportOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const planBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setQ(input.trim()), 250);
    return () => clearTimeout(t);
  }, [input]);

  const list = useQuery({
    queryKey: [...wk.tests(pid), 'list', q],
    queryFn: () => workApi.tests(pid, q || undefined),
    placeholderData: keepPreviousData,
  });
  const plans = useQuery({ queryKey: [...wk.tests(pid), 'plans'], queryFn: () => workApi.testPlans(pid), enabled: planOpen });

  const items = useMemo(() => list.data ?? [], [list.data]);
  // Bỏ chọn những test không còn trong danh sách (bị xoá / bị lọc mất).
  useEffect(() => {
    if (!list.data) return;
    const nums = new Set(list.data.map((t) => t.number));
    setSelected((s) => (s.every((n) => nums.has(n)) ? s : s.filter((n) => nums.has(n))));
  }, [list.data]);

  const allSelected = items.length > 0 && items.every((t) => selected.includes(t.number));
  const toggle = (n: number) => setSelected((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));
  const toggleAll = () => setSelected(allSelected ? [] : items.map((t) => t.number));
  const canEdit = config.permissions.editIssues;

  const addToPlan = async (planId: number | null, newName?: string) => {
    setAdding(true);
    try {
      if (planId) {
        await workApi.updateTestPlan(pid, planId, { addNumbers: selected });
        const name = plans.data?.find((p) => p.id === planId)?.name ?? 'plan';
        toast.success(wt('tests.addedToPlan', { count: selected.length, name }));
      } else if (newName) {
        await workApi.createTestPlan(pid, { name: newName, numbers: selected });
        toast.success(wt('tests.createdPlan', { count: selected.length, name: newName }));
      }
      qc.invalidateQueries({ queryKey: wk.tests(pid) });
      setPlanOpen(false);
      setSelected([]);
    } catch (e) {
      toast.error(workError(e, wt('tests.addPlanFailed')));
    } finally {
      setAdding(false);
    }
  };

  const createCycle = () => {
    const p = new URLSearchParams({ tab: 'cycles', new: '1', tests: [...selected].sort((a, b) => a - b).join(',') });
    router.push(`${base}?${p.toString()}`);
  };

  const th = 'whitespace-nowrap px-2.5 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]';

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[var(--w-border)] px-4 py-2">
        <div className="relative min-w-0 flex-1 sm:max-w-[280px] sm:flex-none">
          <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setInput('')}
            placeholder={wt('tests.searchPh')}
            className="w-input !h-[28px] pl-7 text-[12px] sm:!w-[260px]"
          />
          {list.isFetching && q && <span className="absolute right-2 top-1/2 -translate-y-1/2"><Spinner size={11} /></span>}
        </div>
        {selected.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[12px] text-[var(--w-text-2)]">{wt('common.selected', { count: selected.length })}</span>
            {canEdit && (
              <>
                <button ref={planBtn} type="button" className="w-btn w-btn-sm" onClick={() => setPlanOpen((v) => !v)} disabled={adding}>
                  {adding ? <Spinner size={11} /> : <ListPlus size={13} />} {wt('tests.addToPlan')}
                </button>
                <button type="button" className="w-btn w-btn-sm" onClick={createCycle}>
                  <PlayCircle size={13} /> {wt('tests.createCycle')}
                </button>
              </>
            )}
            <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setSelected([])}><X size={12} /> {wt('board.clear')}</button>
          </div>
        ) : (
          <span className="hidden text-[12px] text-[var(--w-text-3)] md:inline">
            {list.data ? wt('tests.nTests', { count: items.length }) : ''}
          </span>
        )}
        {config.permissions.createIssues && (
          <button type="button" className="w-btn w-btn-sm ml-auto" onClick={() => setImportOpen(true)}>
            <FileUp size={13} /> <span className="max-sm:hidden">{wt('tests.importCsv')}</span>
          </button>
        )}
      </div>

      <Popover open={planOpen} onClose={() => setPlanOpen(false)} anchorRef={planBtn} width={280}>
        {plans.isLoading ? (
          <div className="flex justify-center p-4"><Spinner /></div>
        ) : (
          <PickerList
            options={(plans.data ?? []).filter((p) => !p.archivedAt).map((p) => ({ value: p.id, label: p.name, hint: wt('tests.nTests', { count: p.testNumbers.length }) }))}
            selected={[]}
            onPick={(id) => addToPlan(id)}
            onCreate={(name) => addToPlan(null, name)}
            placeholder={wt('tests.findPlan')}
            empty={wt('tests.noPlansType')}
          />
        )}
      </Popover>

      <div className="min-h-0 flex-1 overflow-auto">
        {list.isLoading ? (
          <div className="flex h-40 items-center justify-center"><Spinner size={20} /></div>
        ) : list.error ? (
          <EmptyState title={wt('tests.loadFailed')} body={workError(list.error)} action={<button type="button" className="w-btn" onClick={() => list.refetch()}>{wt('common.tryAgain')}</button>} />
        ) : !items.length ? (
          q ? (
            <EmptyState title={wt('tests.noMatch')} body={wt('tests.noMatchBody', { q })} action={<button type="button" className="w-btn" onClick={() => setInput('')}>{wt('issues.clearSearch')}</button>} />
          ) : (
            <EmptyState
              title={wt('tests.noTestCases')}
              body={wt('tests.noTestsBody')}
              action={config.permissions.createIssues ? (
                <div className="flex flex-wrap justify-center gap-2">
                  {onNewTest && <button type="button" className="w-btn w-btn-primary" onClick={onNewTest}>{wt('tests.newTest')}</button>}
                  <button type="button" className="w-btn" onClick={() => setImportOpen(true)}><FileUp size={13} /> {wt('tests.importCsv')}</button>
                </div>
              ) : undefined}
            />
          )
        ) : (
          <table className="w-full min-w-[980px] border-collapse text-[13px]">
            <thead className="sticky top-0 z-[1] bg-[var(--w-panel)] shadow-[inset_0_-1px_0_var(--w-border)]">
              <tr>
                <th className="w-[36px] px-2.5 py-2">
                  <input type="checkbox" aria-label={wt('tests.selectAll')} checked={allSelected} onChange={toggleAll} className="accent-[var(--w-accent)]" />
                </th>
                <th className={cn(th, 'w-[90px]')}>{wt('common.key')}</th>
                <th className={th}>{wt('common.title')}</th>
                <th className={cn(th, 'w-[80px]')}>{wt('common.type')}</th>
                <th className={cn(th, 'w-[64px] text-right')}>{wt('tests.steps')}</th>
                <th className={cn(th, 'w-[160px]')}>{wt('tests.requirements')}</th>
                <th className={cn(th, 'w-[110px]')}>{wt('tests.lastResult')}</th>
                <th className={cn(th, 'w-[70px]')}>{wt('common.priority')}</th>
                <th className={cn(th, 'w-[70px]')}>{wt('common.assignee')}</th>
                <th className={cn(th, 'w-[96px]')}>{wt('common.updated')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <Row
                  key={t.id}
                  t={t}
                  issueKey={lk.issueKey}
                  assignee={t.assigneeId ? lk.members.get(t.assigneeId) : undefined}
                  selected={selected.includes(t.number)}
                  onToggle={() => toggle(t.number)}
                  onOpen={() => router.push(`${base}/${t.number}`)}
                  onOpenIssue={onOpenIssue}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ImportTestsDialog open={importOpen} onClose={() => setImportOpen(false)} config={config} pid={pid} onOpenTest={(n) => router.push(`${base}/${n}`)} />
    </div>
  );
}

function Row({ t, issueKey, assignee, selected, onToggle, onOpen, onOpenIssue }: {
  t: TestListItem;
  issueKey: (n: number) => string;
  assignee: Parameters<typeof UserAvatar>[0]['user'] | undefined;
  selected: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onOpenIssue: (n: number) => void;
}) {
  const td = 'px-2.5 py-2 align-middle';
  const runTitle = t.lastRun
    ? `${t.lastRun.cycleName}${t.lastRun.executedAt ? ` · ${new Date(t.lastRun.executedAt).toLocaleString(wfmt.intl(), { dateStyle: 'medium', timeStyle: 'short' })}` : ''}`
    : undefined;
  return (
    <tr
      onClick={onOpen}
      className={cn('cursor-pointer border-b border-[var(--w-border)] hover:bg-[var(--w-hover)]', selected && 'bg-[var(--w-accent-soft)] hover:bg-[var(--w-accent-soft)]')}
    >
      <td className={td} onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" aria-label={wt('tests.selectKey', { key: issueKey(t.number) })} checked={selected} onChange={onToggle} className="accent-[var(--w-accent)]" />
      </td>
      <td className={cn(td, 'whitespace-nowrap font-mono text-[12px] text-[var(--w-text-2)]')}>{issueKey(t.number)}</td>
      <td className={cn(td, 'max-w-[380px]')}><span className="line-clamp-2 font-medium">{t.title}</span></td>
      <td className={td}>
        <span className="inline-flex h-[20px] items-center rounded-[4px] bg-[var(--w-sunken)] px-1.5 text-[11px] text-[var(--w-text-2)]">
          {t.kind === 'GHERKIN' ? 'Gherkin' : wt('tests.manual')}
        </span>
      </td>
      <td className={cn(td, 'text-right tabular text-[var(--w-text-2)]')}>{t.kind === 'GHERKIN' ? '—' : t.stepCount}</td>
      <td className={td} onClick={(e) => e.stopPropagation()}>
        {t.requirements.length ? (
          <div className="flex flex-wrap gap-1">
            {t.requirements.slice(0, 3).map((r) => (
              <button
                key={r.number}
                type="button"
                title={r.title}
                onClick={() => onOpenIssue(r.number)}
                className="rounded-[4px] border border-[var(--w-border)] px-1 font-mono text-[11px] text-[var(--w-accent-text)] hover:bg-[var(--w-hover)]"
              >
                {issueKey(r.number)}
              </button>
            ))}
            {t.requirements.length > 3 && <span className="text-[11px] text-[var(--w-text-3)]" title={t.requirements.slice(3).map((r) => issueKey(r.number)).join(', ')}>+{t.requirements.length - 3}</span>}
          </div>
        ) : (
          <span className="text-[12px] text-[var(--w-text-3)]">{wt('common.none')}</span>
        )}
      </td>
      <td className={td}>
        {t.lastRun ? <RunStatusPill status={t.lastRun.status} title={runTitle} /> : <span className="text-[12px] text-[var(--w-text-3)]">{wt('tests.rsNotRun')}</span>}
      </td>
      <td className={td}><PriorityIcon priority={t.priority} /></td>
      <td className={td}><UserAvatar user={assignee ?? null} size={22} /></td>
      <td className={cn(td, 'whitespace-nowrap text-[12px] text-[var(--w-text-3)]')} title={new Date(t.updatedAt).toLocaleString(wfmt.intl())}>{relativeTime(t.updatedAt)}</td>
    </tr>
  );
}

