'use client';

/**
 * Tab "Integration (5.2)" — kiểm thử tích hợp theo mẫu FPT: mỗi module/luồng một bảng bước
 * (mã <AT1>, mô tả, thủ tục, dữ liệu, mong đợi, thực tế, tối đa 4 vòng chạy Passed/Failed/Pending/N/A + ngày + người kiểm).
 * Lưu tự động (PUT thay trọn + version). Module đang chọn nằm trong `?mod=`.
 * Đợt 3B (09/10/2026): cùng thành phần dựng tab "System tests (5.3)" — `kind="SYS"`: mỗi WORKFLOW một bảng, đúng 3 vòng.
 */

import './fpt.css';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, FileText, FileUp, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError, workErrorStatus, type ProjectConfig } from '@/lib/work-api';
import { useAuthStore } from '@/store/authStore';
import { Dialog, EmptyState, Field, PageLoading, Popover, Spinner } from '../../ui';
import { fptApi, fptKeys, IT_STATUSES, pct, roundsOf, type ItCase, type ItKind, type ItModule, type ItRound, type ItStatus } from './fptApi';
import FptDocDialog from './FptDocDialog';
import FptImportDialog from './FptImportDialog';
import { ExportButton, InlineText, ResultBar, SaveState, shortDate, Stat, todayIso } from './shared';
import { KpiRow } from '../../KpiTile';

const currentOf = (rounds: ItRound[]): ItStatus => {
  for (let i = rounds.length - 1; i >= 0; i--) if (rounds[i]?.status) return rounds[i].status!;
  return 'Pending';
};
const statusCls = (s: ItStatus) => `fpt-status fpt-status-${s === 'N/A' ? 'NA' : s}`;

const TEXT = {
  INT: { unit: 'module', Unit: 'Module', units: 'Modules', report: 'integration' as const, doc: 'INT' as const, exportLabel: 'Export 5.2 (.xlsx)', field: 'Feature / module',
    empty: 'No integration test modules yet', emptyBody: 'Integration tests follow the FPT Report 5.2 template: one sheet per module or flow, each test case with procedure, expected result and up to 4 test rounds.' },
  SYS: { unit: 'workflow', Unit: 'Workflow', units: 'Workflows', report: 'system' as const, doc: 'SYS' as const, exportLabel: 'Export 5.3 (.xlsx)', field: 'Workflow',
    empty: 'No system test workflows yet', emptyBody: 'System tests follow the FPT Report 5.3 template: one sheet per end-to-end workflow (Login, Pay invoice…), each test case with procedure, expected result and Round 1–3.' },
};

export default function IntegrationTab({ config, pid, kind = 'INT' }: { config: ProjectConfig; pid: number; kind?: ItKind }) {
  const T = TEXT[kind];
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const qc = useQueryClient();
  const canEdit = config.permissions.editIssues;
  const [newOpen, setNewOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const list = useQuery({ queryKey: fptKeys.it(pid, kind), queryFn: () => fptApi.modules(pid, kind) });
  const mods = useMemo(() => list.data?.modules ?? [], [list.data]);
  const selected = Number(search?.get('mod')) || mods[0]?.id || null;
  const select = (id: number) => {
    const p = new URLSearchParams(search?.toString());
    p.set('mod', String(id));
    router.replace(`${pathname}?${p}`, { scroll: false });
  };
  const s = list.data?.summary;
  if (list.isLoading) return <PageLoading />;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-start gap-3 border-b border-[var(--w-border)] px-4 py-3">
        {s && (
          <KpiRow min={96} className="min-w-0 flex-1" label="Integration test summary">
            <Stat label={T.units} value={mods.length} />
            <Stat label="Test cases" value={s.total} />
            <Stat label="Passed" value={s.passed} tone={s.passed ? 'green' : 'muted'} />
            <Stat label="Failed" value={s.failed} tone={s.failed ? 'red' : 'muted'} />
            <Stat label="Pending" value={s.pending} tone="muted" />
            <Stat label="N/A" value={s.na} tone="muted" />
            <Stat label="Coverage" value={pct(s.coverage)} hint="(Passed + Failed) / (Total − N/A)" />
            <Stat label="Success" value={pct(s.successCoverage)} hint="Passed / (Total − N/A)" />
          </KpiRow>
        )}
        <div className="ml-auto flex shrink-0 flex-wrap justify-end gap-2">
          <button type="button" className="w-btn w-btn-sm" onClick={() => setDocOpen(true)}><FileText size={13} /> <span className="hidden sm:inline">Cover &amp; changes</span></button>
          {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => setImportOpen(true)}><FileUp size={13} /> <span className="hidden sm:inline">Import</span></button>}
          <ExportButton pid={pid} report={T.report} label={T.exportLabel} />
        </div>
      </div>

      {!mods.length ? (
        <div className="flex-1 overflow-y-auto">
          <EmptyState
            title={T.empty}
            body={T.emptyBody}
            action={canEdit ? (
              <div className="flex gap-2">
                <button type="button" className="w-btn w-btn-primary" onClick={() => setNewOpen(true)}><Plus size={14} /> Add {T.unit}</button>
                <button type="button" className="w-btn" onClick={() => setImportOpen(true)}><FileUp size={14} /> Import Excel</button>
              </div>
            ) : undefined}
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 max-md:flex-col">
          <aside className="w-[240px] shrink-0 overflow-y-auto border-r border-[var(--w-border)] py-1 max-md:max-h-[30vh] max-md:w-full max-md:border-b max-md:border-r-0" aria-label={T.units}>
            {mods.map((m) => (
              <button key={m.id} type="button" onClick={() => select(m.id)} aria-current={selected === m.id}
                className={cn('block w-full px-3 py-2 text-left', selected === m.id ? 'bg-[var(--w-active)]' : 'hover:bg-[var(--w-hover)]')}>
                <div className="flex items-center gap-1.5">
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{m.name}</span>
                  <span className="font-mono text-[11px] text-[var(--w-text-3)]">{m.idPrefix}</span>
                  <span className="text-[11.5px] tabular-nums text-[var(--w-text-3)]">{m.stats.total}</span>
                </div>
                <ResultBar className="mt-1" passed={m.stats.passed} failed={m.stats.failed} total={m.stats.total - m.stats.na} />
              </button>
            ))}
            {canEdit && <button type="button" className="mx-3 mt-2 w-btn w-btn-sm" onClick={() => setNewOpen(true)}><Plus size={13} /> {T.Unit}</button>}
          </aside>
          <section className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4">
            {selected && <ModulePane key={selected} pid={pid} id={selected} kind={kind} canEdit={canEdit} onDeleted={() => { const p = new URLSearchParams(search?.toString()); p.delete('mod'); router.replace(`${pathname}?${p}`, { scroll: false }); }} />}
          </section>
        </div>
      )}

      <NewModuleDialog open={newOpen} onClose={() => setNewOpen(false)} pid={pid} kind={kind} onCreated={(m) => { qc.invalidateQueries({ queryKey: fptKeys.it(pid, kind) }); select(m.id); }} />
      <FptDocDialog open={docOpen} onClose={() => setDocOpen(false)} pid={pid} report={T.doc} />
      <FptImportDialog open={importOpen} onClose={() => setImportOpen(false)} pid={pid} report={T.report} />
    </div>
  );
}

type DCase = Omit<ItCase, 'id'> & { key: string };
let seq = 0;
const k = () => `i${Date.now().toString(36)}${(seq++).toString(36)}`;
const blankCase = (section: string | null): DCase => ({ key: k(), section, description: '', procedure: '', testData: '', expected: '', actual: '', preConditions: '', evidence: '', note: '', rounds: [] });

function ModulePane({ pid, id, kind, canEdit, onDeleted }: { pid: number; id: number; kind: ItKind; canEdit: boolean; onDeleted: () => void }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: fptKeys.mod(pid, id), queryFn: () => fptApi.mod(pid, id), staleTime: Infinity });
  if (q.isLoading) return <PageLoading rows={4} />;
  if (!q.data) return <EmptyState title="Module not found" body={q.error ? workError(q.error) : undefined} />;
  const m = q.data;
  const patch = async (body: Parameters<typeof fptApi.updateModule>[2]) => {
    try {
      const res = await fptApi.updateModule(pid, id, body);
      qc.setQueryData(fptKeys.mod(pid, id), res);
      qc.invalidateQueries({ queryKey: fptKeys.it(pid, kind) });
    } catch (e) { toast.error(workError(e, 'Could not save')); }
  };
  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="mb-3 flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[12px] text-[var(--w-text-3)]">{TEXT[kind].field}</div>
          <InlineText value={m.name} readOnly={!canEdit} maxLength={120} ariaLabel={`${TEXT[kind].Unit} name`} className="!w-[320px] text-[15px] font-semibold" onCommit={(v) => v.trim() && patch({ name: v.trim() })} />
        </div>
        <label className="text-[12px] text-[var(--w-text-3)]">
          ID prefix
          <InlineText value={m.idPrefix} readOnly={!canEdit} maxLength={10} ariaLabel="ID prefix" className="!w-[80px] font-mono" onCommit={(v) => /^[A-Za-z]{1,10}$/.test(v.trim()) ? patch({ idPrefix: v.trim().toUpperCase() }) : toast.error('Use 1–10 letters, e.g. AT')} />
        </label>
        {canEdit && (
          <button type="button" className="w-btn w-btn-sm text-[var(--w-red)]" onClick={async () => {
            if (!window.confirm(`Delete ${TEXT[kind].unit} ${m.name} and its ${m.cases.length} test cases?`)) return;
            try { await fptApi.deleteModule(pid, id); qc.invalidateQueries({ queryKey: fptKeys.it(pid, kind) }); onDeleted(); } catch (e) { toast.error(workError(e)); }
          }}><Trash2 size={13} /> Delete</button>
        )}
      </div>
      <details className="mb-4 rounded-[8px] border border-[var(--w-border)]" open={!m.description && canEdit}>
        <summary className="cursor-pointer select-none px-3 py-2 text-[13px] font-medium">Details <span className="font-normal text-[var(--w-text-3)]">— description, pre-condition, test requirement</span></summary>
        <div className="grid gap-x-4 border-t border-[var(--w-border)] p-3 md:grid-cols-3">
          <Field label="Description"><InlineText multiline value={m.description} readOnly={!canEdit} maxLength={4000} placeholder="Verify that the login workflow works across UI, API and DB" onCommit={(v) => patch({ description: v })} /></Field>
          <Field label="Pre-condition"><InlineText multiline value={m.preCondition} readOnly={!canEdit} maxLength={4000} placeholder="User account exists and is activated" onCommit={(v) => patch({ preCondition: v })} /></Field>
          <Field label="Test requirement"><InlineText multiline value={m.testRequirement} readOnly={!canEdit} maxLength={4000} placeholder="- Login: valid credentials log in…" onCommit={(v) => patch({ testRequirement: v })} /></Field>
        </div>
      </details>
      <CasesTable pid={pid} mod={m} kind={kind} canEdit={canEdit} />
    </div>
  );
}

function CasesTable({ pid, mod, kind, canEdit }: { pid: number; mod: ItModule; kind: ItKind; canEdit: boolean }) {
  const qc = useQueryClient();
  const me = useAuthStore((s) => s.user);
  const meName = (me as { displayName?: string | null; fullName?: string | null; username?: string } | null)?.displayName || (me as { fullName?: string | null } | null)?.fullName || me?.username || null;
  const [cases, setCases] = useState<DCase[]>(() => mod.cases.map((c) => ({ ...c, key: k(), procedure: c.procedure ?? '', testData: c.testData ?? '', expected: c.expected ?? '', actual: c.actual ?? '', preConditions: c.preConditions ?? '', evidence: c.evidence ?? '', note: c.note ?? '' })));
  const [state, setState] = useState<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle');
  const [open, setOpen] = useState<Set<string>>(new Set());
  const version = useRef(mod.updatedAt);
  useEffect(() => { version.current = mod.updatedAt; }, [mod.updatedAt]);
  const rev = useRef(0), savedRev = useRef(0);
  const latest = useRef(cases);
  latest.current = cases;

  const change = (f: (c: DCase[]) => DCase[]) => { if (!canEdit) return; setCases(f); rev.current++; setState('dirty'); };
  const set = (key: string, p: Partial<DCase>) => change((cs) => cs.map((c) => (c.key === key ? { ...c, ...p } : c)));

  const save = useCallback(async () => {
    if (rev.current === savedRev.current) return;
    const cs = latest.current;
    const bad = cs.findIndex((c) => !c.description.trim());
    if (bad >= 0) { setState('dirty'); return; } // chờ người dùng gõ mô tả
    const sending = rev.current;
    setState('saving');
    try {
      const res = await fptApi.saveCases(pid, mod.id, {
        version: version.current,
        cases: cs.map(({ key: _k, ...c }) => ({ ...c, section: c.section?.trim() || null })),
      });
      version.current = res.updatedAt;
      savedRev.current = sending;
      setState(rev.current === sending ? 'saved' : 'dirty');
      qc.setQueryData(fptKeys.mod(pid, mod.id), res);
      qc.invalidateQueries({ queryKey: fptKeys.it(pid, kind) });
    } catch (e) {
      setState('error');
      if (workErrorStatus(e) === 409) toast.error('Someone else saved this module a moment ago.', { action: { label: 'Reload', onClick: () => qc.resetQueries({ queryKey: fptKeys.mod(pid, mod.id) }) }, duration: 12_000 });
      else toast.error(workError(e, 'Could not save the test cases'));
    }
  }, [pid, mod.id, qc]);
  useEffect(() => {
    if (state !== 'dirty') return;
    const t = setTimeout(save, 900);
    return () => clearTimeout(t);
  }, [cases, state, save]);
  useEffect(() => () => { if (rev.current !== savedRev.current) void save(); }, [save]);

  const addCase = (section: string | null, after?: string) => change((cs) => {
    const out = [...cs];
    const at = after ? out.findIndex((c) => c.key === after) + 1 : out.length;
    out.splice(at, 0, blankCase(section));
    return out;
  });
  const lastSection = cases.length ? cases[cases.length - 1].section : null;
  const missing = cases.filter((c) => !c.description.trim()).length;

  let n = 0;
  let prevSection: string | null | undefined;
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <SaveState state={state} />
        {missing > 0 && state === 'dirty' && <span className="text-[12px] text-[var(--w-yellow)]">{missing} case(s) need a description before saving</span>}
        {canEdit && (
          <span className="ml-auto flex gap-2">
            <button type="button" className="w-btn w-btn-sm" onClick={() => { const name = window.prompt('Section name (e.g. Login, Forgot password)'); if (name?.trim()) addCase(name.trim().slice(0, 200)); }}><Plus size={13} /> Section</button>
            <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => addCase(lastSection)}><Plus size={13} /> Test case</button>
          </span>
        )}
      </div>
      <div className="overflow-auto rounded-[8px] border border-[var(--w-border)]" style={{ maxHeight: 'calc(100vh - 260px)' }}>
        <table className="fpt-it" style={{ width: 1460 }}>
          <colgroup>
            <col style={{ width: 32 }} /><col style={{ width: 70 }} /><col style={{ width: 220 }} /><col style={{ width: 240 }} /><col style={{ width: 150 }} />
            <col style={{ width: 210 }} /><col style={{ width: 190 }} /><col style={{ width: 170 }} /><col style={{ width: 150 }} /><col style={{ width: 28 }} />
          </colgroup>
          <thead>
            <tr>
              <th aria-label="Expand" /><th>Test Case ID</th><th>Description</th><th>Procedure</th><th>Test data</th><th>Expected results</th><th>Actual result</th><th>Pre-conditions</th><th>Result (rounds)</th><th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => {
              n++;
              const showSec = c.section && c.section !== prevSection;
              prevSection = c.section;
              const isOpen = open.has(c.key);
              return [
                showSec ? (
                  <tr key={`${c.key}-sec`} className="fpt-it-sec">
                    <td colSpan={10}>
                      <div className="flex items-center gap-2 px-2 py-1">
                        <SectionName value={c.section!} canEdit={canEdit} onRename={(to) => change((cs) => cs.map((x) => (x.section === c.section ? { ...x, section: to } : x)))} />
                        {canEdit && <button type="button" className="fpt-mini" onClick={() => {
                          const lastIdx = [...cases].reverse().find((x) => x.section === c.section)?.key;
                          addCase(c.section, lastIdx);
                        }}><Plus size={12} /> Case</button>}
                      </div>
                    </td>
                  </tr>
                ) : null,
                <tr key={c.key}>
                  <td className="text-center">
                    <button type="button" className="mt-2 text-[var(--w-text-3)] hover:text-[var(--w-text)]" aria-expanded={isOpen} aria-label="More fields" onClick={() => setOpen((s) => { const x = new Set(s); if (x.has(c.key)) x.delete(c.key); else x.add(c.key); return x; })}>
                      {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </td>
                  <td className="px-2 py-2 font-mono text-[12px] text-[var(--w-text-2)]">&lt;{mod.idPrefix}{n}&gt;</td>
                  <td><Cell value={c.description} ro={!canEdit} ph="Verify that…" invalid={!c.description.trim()} onChange={(v) => set(c.key, { description: v })} /></td>
                  <td><Cell value={c.procedure ?? ''} ro={!canEdit} ph={'1. Go to Login\n2. Input email\n3. Click Login'} onChange={(v) => set(c.key, { procedure: v })} /></td>
                  <td><Cell value={c.testData ?? ''} ro={!canEdit} ph="email: a@b.co" onChange={(v) => set(c.key, { testData: v })} /></td>
                  <td><Cell value={c.expected ?? ''} ro={!canEdit} ph="1. Success message\n2. Home page" onChange={(v) => set(c.key, { expected: v })} /></td>
                  <td><Cell value={c.actual ?? ''} ro={!canEdit} ph="What actually happened" onChange={(v) => set(c.key, { actual: v })} /></td>
                  <td><Cell value={c.preConditions ?? ''} ro={!canEdit} ph="User has an account" onChange={(v) => set(c.key, { preConditions: v })} /></td>
                  <td className="px-2 py-1.5"><RoundsCell rounds={c.rounds} maxRounds={roundsOf(kind)} canEdit={canEdit} meName={meName} onChange={(r) => set(c.key, { rounds: r })} /></td>
                  <td className="text-center">
                    {canEdit && <button type="button" className="fpt-icon mt-1.5" aria-label="Delete test case" onClick={() => change((cs) => cs.filter((x) => x.key !== c.key))}><Trash2 size={12} /></button>}
                  </td>
                </tr>,
                isOpen ? (
                  <tr key={`${c.key}-more`}>
                    <td />
                    <td colSpan={9} className="bg-[var(--w-sunken)]">
                      <div className="grid gap-3 p-3 md:grid-cols-3">
                        <label className="text-[12px] text-[var(--w-text-2)]">Section<input className="w-input mt-1 h-[30px]" readOnly={!canEdit} value={c.section ?? ''} maxLength={200} onChange={(e) => set(c.key, { section: e.target.value || null })} /></label>
                        <label className="text-[12px] text-[var(--w-text-2)]">Evidence (link / screenshot)<input className="w-input mt-1 h-[30px]" readOnly={!canEdit} value={c.evidence ?? ''} maxLength={2000} onChange={(e) => set(c.key, { evidence: e.target.value })} /></label>
                        <label className="text-[12px] text-[var(--w-text-2)]">Note<input className="w-input mt-1 h-[30px]" readOnly={!canEdit} value={c.note ?? ''} maxLength={4000} onChange={(e) => set(c.key, { note: e.target.value })} /></label>
                      </div>
                    </td>
                  </tr>
                ) : null,
              ];
            })}
            {!cases.length && <tr><td colSpan={10} className="px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">No test cases yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionName({ value, canEdit, onRename }: { value: string; canEdit: boolean; onRename: (to: string) => void }) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  return (
    <input className="fpt-input w-[280px] font-semibold" value={v} readOnly={!canEdit} aria-label="Section name" maxLength={200}
      onChange={(e) => setV(e.target.value)} onBlur={() => (v.trim() && v !== value ? onRename(v.trim()) : setV(value))}
      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()} />
  );
}

function Cell({ value, onChange, ro, ph, invalid }: { value: string; onChange: (v: string) => void; ro: boolean; ph?: string; invalid?: boolean }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${Math.max(34, el.scrollHeight)}px`;
  }, [value]);
  return <textarea ref={ref} rows={1} className={cn('fpt-cellarea', invalid && !ro && 'placeholder:text-[var(--w-red)]')} value={value} readOnly={ro} placeholder={ro ? '' : ph} onChange={(e) => onChange(e.target.value)} />;
}

function RoundsCell({ rounds, onChange, canEdit, meName, maxRounds }: { rounds: ItRound[]; onChange: (r: ItRound[]) => void; canEdit: boolean; meName: string | null; maxRounds: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const cur = currentOf(rounds);
  const setRound = (i: number, p: Partial<ItRound>) => {
    const next = [...rounds];
    while (next.length <= i) next.push({ status: null, date: null, tester: null });
    next[i] = { ...next[i], ...p };
    while (next.length && !next[next.length - 1].status && !next[next.length - 1].date && !next[next.length - 1].tester) next.pop();
    onChange(next);
  };
  const quick = (st: ItStatus) => {
    // Ghi vào vòng gần nhất chưa có kết quả; đầy vòng (4 ở 5.2, 3 ở 5.3) thì sửa vòng cuối.
    const free = rounds.slice(0, maxRounds).findIndex((r) => !r.status);
    const i = free >= 0 ? free : Math.min(rounds.length, maxRounds - 1);
    setRound(i, { status: st, date: rounds[i]?.date ?? todayIso(), tester: rounds[i]?.tester ?? meName });
  };
  return (
    <>
      <button ref={ref} type="button" className="flex flex-wrap items-center gap-1" onClick={() => setOpen(true)} aria-label={`Result: ${cur}. Edit rounds`}>
        <span className={statusCls(cur)}>{cur}</span>
        {rounds.length > 0 && <span className="text-[11px] text-[var(--w-text-3)]">R{rounds.length}{rounds[rounds.length - 1]?.date ? ` · ${shortDate(rounds[rounds.length - 1].date)}` : ''}</span>}
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={ref} width={430} align="end">
        <div className="space-y-2 p-3 text-[12.5px]">
          {canEdit && (
            <div className="flex flex-wrap gap-1">
              <span className="mr-1 self-center text-[var(--w-text-3)]">Record next round:</span>
              {IT_STATUSES.map((s) => <button key={s} type="button" className={statusCls(s)} onClick={() => quick(s)}>{s}</button>)}
            </div>
          )}
          <table className="w-full">
            <thead><tr className="text-left text-[11px] text-[var(--w-text-3)]"><th className="font-medium">Round</th><th className="font-medium">Status</th><th className="font-medium">Date</th><th className="font-medium">Tester</th></tr></thead>
            <tbody>
              {Array.from({ length: maxRounds }, (_, i) => {
                const r = rounds[i];
                return (
                  <tr key={i}>
                    <td className="pr-1 text-[var(--w-text-2)]">{i + 1}</td>
                    <td className="pr-1">
                      <select className="w-input h-[26px] w-[96px] text-[12px]" disabled={!canEdit} value={r?.status ?? ''} onChange={(e) => setRound(i, { status: (e.target.value || null) as ItStatus | null, date: r?.date ?? (e.target.value ? todayIso() : null), tester: r?.tester ?? (e.target.value ? meName : null) })}>
                        <option value="">—</option>
                        {IT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="pr-1"><input type="date" className="w-input h-[26px] text-[12px]" disabled={!canEdit} value={r?.date ?? ''} onChange={(e) => setRound(i, { date: e.target.value || null })} /></td>
                    <td><input className="w-input h-[26px] text-[12px]" disabled={!canEdit} value={r?.tester ?? ''} maxLength={120} onChange={(e) => setRound(i, { tester: e.target.value || null })} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Popover>
    </>
  );
}

function NewModuleDialog({ open, onClose, pid, kind, onCreated }: { open: boolean; onClose: () => void; pid: number; kind: ItKind; onCreated: (m: ItModule) => void }) {
  const sys = kind === 'SYS';
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (open) { setName(''); setDescription(''); } }, [open]);
  const submit = async () => {
    if (!name.trim()) return;
    setBusy(true);
    try { const m = await fptApi.createModule(pid, { name: name.trim(), description: description.trim() || null }, kind); onCreated(m); onClose(); }
    catch (e) { toast.error(workError(e, `Could not add the ${sys ? 'workflow' : 'module'}`)); }
    finally { setBusy(false); }
  };
  return (
    <Dialog open={open} onClose={() => !busy && onClose()} title={sys ? 'Add system test workflow' : 'Add integration module'} width={480}
      footer={<><button type="button" className="w-btn" onClick={onClose} disabled={busy}>Cancel</button><button type="button" className="w-btn w-btn-primary" onClick={submit} disabled={busy || !name.trim()}>{busy && <Spinner size={12} />} Add</button></>}>
      <form onSubmit={(e) => { e.preventDefault(); void submit(); }}>
        <Field label={sys ? 'Workflow name' : 'Module / flow name'} hint={sys ? 'e.g. Login, Pay Invoice, Booking Utility — test IDs use its initials (<LG1>, <PI1>)' : 'e.g. Authentication, UserManagement — test IDs use its initials (<AT1>, <UM1>)'}><input className="w-input" autoFocus value={name} maxLength={120} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Description"><input className="w-input" value={description} maxLength={4000} onChange={(e) => setDescription(e.target.value)} placeholder="Verify that the authentication workflow works across modules" /></Field>
        <button type="submit" className="hidden" aria-hidden tabIndex={-1} />
      </form>
    </Dialog>
  );
}
