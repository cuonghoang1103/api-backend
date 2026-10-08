'use client';

/**
 * Tab "Unit tests (5.1)" — kiểm thử đơn vị theo mẫu FPT: danh sách hàm theo module (lọc, tìm) bên trái,
 * ma trận UTCID của hàm đang chọn bên phải; thống kê + chỉ tiêu test case/KLOC ở đầu; xuất/nhập Excel đúng mẫu.
 * Hàm đang chọn nằm trong `?fn=`.
 */

import './fpt.css';
import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Copy, FileText, FileUp, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '../../ui';
import { fptApi, fptKeys, pct, type UnitFunction, type UnitFunctionListItem } from './fptApi';
import FptDocDialog from './FptDocDialog';
import FptImportDialog from './FptImportDialog';
import { ExportButton, InlineText, ResultBar, Stat } from './shared';
import UnitMatrix from './UnitMatrix';

export default function UnitTab({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const qc = useQueryClient();
  const canEdit = config.permissions.editIssues;
  const [module, setModule] = useState('');
  const [q, setQ] = useState('');
  const [newOpen, setNewOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const list = useQuery({ queryKey: fptKeys.unit(pid), queryFn: () => fptApi.functions(pid) });
  const fns = useMemo(() => list.data?.functions ?? [], [list.data]);
  const modules = useMemo(() => [...new Set(fns.map((f) => f.moduleName))], [fns]);
  const shown = fns.filter((f) => (!module || f.moduleName === module) && (!q || `${f.moduleName} ${f.methodName} ${f.sheetName ?? ''}`.toLowerCase().includes(q.toLowerCase())));
  const selected = Number(search?.get('fn')) || shown[0]?.id || null;
  const select = (id: number) => {
    const p = new URLSearchParams(search?.toString());
    p.set('fn', String(id));
    router.replace(`${pathname}?${p}`, { scroll: false });
  };

  const s = list.data?.summary;
  if (list.isLoading) return <PageLoading />;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-[var(--w-border)] px-4 py-3">
        {s && (
          <>
            <Stat label="Functions" value={s.functions} />
            <Stat label="Test cases" value={s.total} />
            <Stat label="Passed" value={s.passed} tone="green" />
            <Stat label="Failed" value={s.failed} tone={s.failed ? 'red' : 'muted'} />
            <Stat label="Untested" value={s.untested} tone="muted" />
            <Stat label="Coverage" value={pct(s.coverage)} hint="(Passed + Failed) / Total" />
            <Stat label="N · A · B" value={<span className="text-[14px]">{pct(s.normalPct)} · {pct(s.abnormalPct)} · {pct(s.boundaryPct)}</span>} hint="Normal · Abnormal · Boundary" />
            <Stat
              label={`Norm ${list.data!.tcPerKloc}/KLOC`}
              tone={s.meetsNorm === false ? 'red' : s.meetsNorm ? 'green' : 'muted'}
              value={s.meetsNorm === null ? <span className="text-[13px] font-normal">add LOC</span> : `${s.casesWithLoc}/${s.requiredCases}`}
              hint={s.meetsNorm === null ? 'Fill in "Lines of code" for functions to check the test-case norm.' : `KLOC ${s.kloc} — ${s.belowNorm} function(s) below the norm${s.functionsWithoutLoc ? `, ${s.functionsWithoutLoc} without LOC` : ''}`}
            />
          </>
        )}
        <div className="ml-auto flex flex-wrap gap-2">
          <button type="button" className="w-btn w-btn-sm" onClick={() => setDocOpen(true)}><FileText size={13} /> <span className="hidden sm:inline">Cover &amp; changes</span></button>
          {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => setImportOpen(true)}><FileUp size={13} /> <span className="hidden sm:inline">Import</span></button>}
          <ExportButton pid={pid} report="unit" label="Export 5.1 (.xlsx)" />
        </div>
      </div>

      {!fns.length ? (
        <div className="flex-1 overflow-y-auto">
          <EmptyState
            title="No unit-tested functions yet"
            body="Unit test cases follow the FPT Report 5.1 template: one matrix per function — conditions and confirmations as rows, UTCID test cases as columns, marked with “O”. Add a function or import your team's Excel file."
            action={canEdit ? (
              <div className="flex gap-2">
                <button type="button" className="w-btn w-btn-primary" onClick={() => setNewOpen(true)}><Plus size={14} /> Add function</button>
                <button type="button" className="w-btn" onClick={() => setImportOpen(true)}><FileUp size={14} /> Import Excel</button>
              </div>
            ) : undefined}
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 max-md:flex-col">
          <aside className="flex w-[280px] shrink-0 flex-col border-r border-[var(--w-border)] max-md:max-h-[40vh] max-md:w-full max-md:border-b max-md:border-r-0">
            <div className="space-y-2 border-b border-[var(--w-border)] p-3">
              <div className="relative">
                <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
                <input className="w-input h-[30px] pl-8 text-[13px]" placeholder="Search functions" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search functions" />
              </div>
              <div className="flex gap-2">
                <select className="w-input h-[30px] min-w-0 flex-1 text-[13px]" value={module} onChange={(e) => setModule(e.target.value)} aria-label="Filter by module">
                  <option value="">All modules ({modules.length})</option>
                  {modules.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                {canEdit && <button type="button" className="w-btn w-btn-sm w-btn-icon !h-[30px] !w-[30px]" onClick={() => setNewOpen(true)} aria-label="Add function" title="Add function"><Plus size={14} /></button>}
              </div>
            </div>
            <FunctionList fns={shown} selected={selected} onSelect={select} />
          </aside>
          <section className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4">
            {selected ? <FunctionPane key={selected} pid={pid} id={selected} canEdit={canEdit} onDeleted={() => { const p = new URLSearchParams(search?.toString()); p.delete('fn'); router.replace(`${pathname}?${p}`, { scroll: false }); }} onOpen={select} /> : <EmptyState title="No function matches" />}
          </section>
        </div>
      )}

      <NewFunctionDialog open={newOpen} onClose={() => setNewOpen(false)} pid={pid} modules={modules} defaultModule={module} onCreated={(f) => { qc.invalidateQueries({ queryKey: fptKeys.unit(pid) }); select(f.id); }} />
      <FptDocDialog open={docOpen} onClose={() => setDocOpen(false)} pid={pid} report="UNIT" />
      <FptImportDialog open={importOpen} onClose={() => setImportOpen(false)} pid={pid} report="unit" />
    </div>
  );
}

function FunctionList({ fns, selected, onSelect }: { fns: UnitFunctionListItem[]; selected: number | null; onSelect: (id: number) => void }) {
  const groups: Array<[string, UnitFunctionListItem[]]> = [];
  for (const f of fns) {
    const g = groups.find(([m]) => m === f.moduleName);
    if (g) g[1].push(f); else groups.push([f.moduleName, [f]]);
  }
  return (
    <nav className="min-h-0 flex-1 overflow-y-auto py-1" aria-label="Functions">
      {groups.map(([m, list]) => (
        <div key={m} className="mb-1">
          <div className="px-3 pb-0.5 pt-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--w-text-3)]">{m}</div>
          {list.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onSelect(f.id)}
              aria-current={selected === f.id}
              className={cn('block w-full px-3 py-1.5 text-left transition-colors', selected === f.id ? 'bg-[var(--w-active)]' : 'hover:bg-[var(--w-hover)]')}
            >
              <div className="flex items-center gap-1.5">
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{f.methodName}</span>
                {f.belowNorm && <span title={`Below the norm: ${f.stats.total}/${f.requiredCases} test cases`}><AlertTriangle size={12} className="text-[var(--w-yellow)]" /></span>}
                <span className="text-[11.5px] tabular-nums text-[var(--w-text-3)]">{f.stats.total}</span>
              </div>
              <ResultBar className="mt-1" passed={f.stats.passed} failed={f.stats.failed} total={f.stats.total} />
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
}

function FunctionPane({ pid, id, canEdit, onDeleted, onOpen }: { pid: number; id: number; canEdit: boolean; onDeleted: () => void; onOpen: (id: number) => void }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: fptKeys.fn(pid, id), queryFn: () => fptApi.fn(pid, id), staleTime: Infinity });
  const f = q.data;
  if (q.isLoading) return <PageLoading rows={4} />;
  if (!f) return <EmptyState title="Function not found" body={q.error ? workError(q.error) : undefined} />;

  const patch = async (body: Parameters<typeof fptApi.updateFunction>[2]) => {
    try {
      const res = await fptApi.updateFunction(pid, id, body);
      // Thông tin đầu đổi ⇒ updatedAt đổi ⇒ ma trận nhận version mới qua prop (tránh 409 giả), giữ bản nháp.
      qc.setQueryData(fptKeys.fn(pid, id), res);
      qc.invalidateQueries({ queryKey: fptKeys.unit(pid) });
    } catch (e) { toast.error(workError(e, 'Could not save')); }
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-3 flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[12px] text-[var(--w-text-3)]">Code module</div>
          <div className="flex flex-wrap items-center gap-2">
            <InlineText value={f.moduleName} readOnly={!canEdit} ariaLabel="Module name" maxLength={120} className="!w-[200px] font-medium" onCommit={(v) => v.trim() && patch({ moduleName: v.trim() })} />
            <span className="text-[var(--w-text-3)]">›</span>
            <InlineText value={f.methodName} readOnly={!canEdit} ariaLabel="Method name" maxLength={120} className="!w-[220px] text-[15px] font-semibold" onCommit={(v) => v.trim() && patch({ methodName: v.trim() })} />
          </div>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <button type="button" className="w-btn w-btn-sm" onClick={async () => {
              try { const c = await fptApi.duplicateFunction(pid, id); qc.invalidateQueries({ queryKey: fptKeys.unit(pid) }); onOpen(c.id); toast.success('Function duplicated'); } catch (e) { toast.error(workError(e)); }
            }}><Copy size={13} /> Duplicate</button>
            <button type="button" className="w-btn w-btn-sm text-[var(--w-red)]" onClick={async () => {
              if (!window.confirm(`Delete ${f.methodName} and its ${f.cases.length} test cases?`)) return;
              try { await fptApi.deleteFunction(pid, id); qc.invalidateQueries({ queryKey: fptKeys.unit(pid) }); onDeleted(); } catch (e) { toast.error(workError(e)); }
            }}><Trash2 size={13} /> Delete</button>
          </div>
        )}
      </div>

      <details className="mb-4 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)]" open={!f.description && canEdit}>
        <summary className="cursor-pointer select-none px-3 py-2 text-[13px] font-medium">
          Details <span className="font-normal text-[var(--w-text-3)]">— description, pre-condition, test requirement, lines of code, people</span>
        </summary>
        <div className="grid gap-x-4 gap-y-1 border-t border-[var(--w-border)] p-3 md:grid-cols-2">
          <Field label="Description"><InlineText multiline value={f.description} readOnly={!canEdit} maxLength={4000} placeholder="What the function does" onCommit={(v) => patch({ description: v })} /></Field>
          <Field label="Pre-condition"><InlineText multiline value={f.preCondition} readOnly={!canEdit} maxLength={4000} placeholder="Valid credentials are provided." onCommit={(v) => patch({ preCondition: v })} /></Field>
          <Field label="Test requirement"><InlineText multiline value={f.testRequirement} readOnly={!canEdit} maxLength={4000} placeholder="Brief description of what is tested" onCommit={(v) => patch({ testRequirement: v })} /></Field>
          <div className="grid grid-cols-2 gap-x-3">
            <Field label="Lines of code" hint={f.requiredCases !== null ? `Needs ≥ ${f.requiredCases} test cases (${f.tcPerKloc}/KLOC)` : 'Used for the test-case norm'}>
              <InlineText value={f.loc === null ? '' : String(f.loc)} readOnly={!canEdit} placeholder="e.g. 45" onCommit={(v) => { const n = v.trim() ? Math.max(0, Math.round(Number(v))) : null; if (n === null || Number.isFinite(n)) patch({ loc: n }); }} />
            </Field>
            <Field label="Sheet name" hint="Excel sheet (≤ 31 chars)"><InlineText value={f.sheetName} readOnly={!canEdit} maxLength={31} placeholder={f.methodName.charAt(0).toLowerCase() + f.methodName.slice(1)} onCommit={(v) => patch({ sheetName: v })} /></Field>
            <Field label="Created by"><InlineText value={f.createdBy} readOnly={!canEdit} maxLength={120} onCommit={(v) => patch({ createdBy: v })} /></Field>
            <Field label="Executed by"><InlineText value={f.executedBy} readOnly={!canEdit} maxLength={120} onCommit={(v) => patch({ executedBy: v })} /></Field>
          </div>
          <Field label="Code reference" hint="File path#line or a GitHub link">
            <InlineText value={f.codeRef} readOnly={!canEdit} maxLength={500} placeholder="src/services/auth.service.ts#L42" onCommit={(v) => patch({ codeRef: v })} />
          </Field>
        </div>
      </details>

      {f.belowNorm && (
        <p className="mb-3 flex items-center gap-2 rounded-[6px] bg-[color-mix(in_srgb,var(--w-yellow)_12%,transparent)] px-3 py-2 text-[12.5px]">
          <AlertTriangle size={14} className="shrink-0 text-[var(--w-yellow)]" />
          {f.loc} LOC needs at least {f.requiredCases} test cases ({f.tcPerKloc}/KLOC) — this function has {f.stats.total}. Add cases or explain the reason in the report notes.
        </p>
      )}

      <UnitMatrix pid={pid} fn={f as UnitFunction} canEdit={canEdit} />
    </div>
  );
}

function NewFunctionDialog({ open, onClose, pid, modules, defaultModule, onCreated }: {
  open: boolean; onClose: () => void; pid: number; modules: string[]; defaultModule: string; onCreated: (f: UnitFunction) => void;
}) {
  const [moduleName, setModuleName] = useState('');
  const [methodName, setMethodName] = useState('');
  const [loc, setLoc] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [lastOpen, setLastOpen] = useState(false);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) { setModuleName(defaultModule || modules[0] || ''); setMethodName(''); setLoc(''); setDescription(''); }
  }
  const submit = async () => {
    if (!moduleName.trim() || !methodName.trim()) return;
    setBusy(true);
    try {
      const f = await fptApi.createFunction(pid, { moduleName: moduleName.trim(), methodName: methodName.trim(), loc: loc.trim() ? Math.max(0, Math.round(Number(loc))) || null : null, description: description.trim() || null });
      onCreated(f);
      onClose();
    } catch (e) {
      toast.error(workError(e, 'Could not add the function'));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog open={open} onClose={() => !busy && onClose()} title="Add function" width={520}
      footer={<><button type="button" className="w-btn" onClick={onClose} disabled={busy}>Cancel</button><button type="button" className="w-btn w-btn-primary" onClick={submit} disabled={busy || !moduleName.trim() || !methodName.trim()}>{busy && <Spinner size={12} />} Add</button></>}>
      <form onSubmit={(e) => { e.preventDefault(); void submit(); }}>
        <Field label="Module / class" hint="e.g. AuthService, UserController">
          <input className="w-input" list="fpt-modules" value={moduleName} maxLength={120} onChange={(e) => setModuleName(e.target.value)} autoFocus />
          <datalist id="fpt-modules">{modules.map((m) => <option key={m} value={m} />)}</datalist>
        </Field>
        <Field label="Method"><input className="w-input" value={methodName} maxLength={120} placeholder="Login" onChange={(e) => setMethodName(e.target.value)} /></Field>
        <div className="grid grid-cols-[120px_1fr] gap-3">
          <Field label="Lines of code"><input className="w-input" inputMode="numeric" value={loc} onChange={(e) => setLoc(e.target.value.replace(/[^\d]/g, ''))} placeholder="45" /></Field>
          <Field label="Description"><input className="w-input" value={description} maxLength={4000} onChange={(e) => setDescription(e.target.value)} placeholder="Authenticates a user" /></Field>
        </div>
        <p className="text-[12px] text-[var(--w-text-3)]">Starts with a Precondition row, Return / Exception / Log message groups and one Normal test case.</p>
        <button type="submit" className="hidden" aria-hidden tabIndex={-1} />
      </form>
    </Dialog>
  );
}
