'use client';

/**
 * Tab "Integration (5.2)" — kiểm thử tích hợp theo mẫu FPT: mỗi module/luồng một bảng bước
 * (mã <AT1>, mô tả, thủ tục, dữ liệu, mong đợi, thực tế, tối đa 4 vòng chạy Passed/Failed/Pending/N/A + ngày + người kiểm).
 * Lưu tự động (PUT thay trọn + version). Module đang chọn nằm trong `?mod=`.
 * Đợt 3B (09/10/2026): cùng thành phần dựng tab "System tests (5.3)" — `kind="SYS"`: mỗi WORKFLOW/feature một bảng.
 * 24/10/2026: 5.3 cũng Round 1–4 + cột Evidence (mẫu ABClinic của cô). Bảng XEM RÕ: cột kéo rộng được (nhớ theo người
 * dùng), cột ID dính trái + đầu bảng dính trên, chế độ gọn/đầy đủ, bấm ID ⇒ khung chi tiết bên phải xem/sửa trọn case.
 */

import './fpt.css';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Columns3, FileText, FileUp, ImagePlus, PanelLeftClose, PanelRightOpen, Plus, RotateCcw, Trash2, WrapText } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError, workErrorStatus, type ProjectConfig } from '@/lib/work-api';
import { useAuthStore } from '@/store/authStore';
import { Dialog, EmptyState, Field, PageLoading, Popover, Spinner } from '../../ui';
import { fptApi, fptKeys, IT_STATUSES, joinEvidence, pct, roundsOf, splitEvidence, type ItCase, type ItKind, type ItModule, type ItRound, type ItStatus } from './fptApi';
import FptDocDialog from './FptDocDialog';
import FptImportDialog from './FptImportDialog';
import TrashLink from './TrashLink';
import { afterDelete, undoToast } from '../../settings/binApi';
import { ColResizer, DetailDrawer, ExportButton, GrowArea, InlineText, ResultBar, SaveState, shortDate, Stat, todayIso, useColWidths, useStoredFlag, useStoredList } from './shared';
import EvidenceView from './EvidenceView';
import { KpiRow } from '../../KpiTile';
import { PaneStrip, usePaneKeys, usePanes } from '../../shell/panes';
import { wt } from '@/components/work/i18n';

const currentOf = (rounds: ItRound[]): ItStatus => {
  for (let i = rounds.length - 1; i >= 0; i--) if (rounds[i]?.status) return rounds[i].status!;
  return 'Pending';
};
const statusCls = (s: ItStatus) => `fpt-status fpt-status-${s === 'N/A' ? 'NA' : s}`;

const TEXT = {
  // Getter: chữ theo ngôn ngữ CT Work lúc vẽ.
  INT: { get unit() { return wt('fpt.uModule'); }, get Unit() { return wt('fpt.UModule'); }, get units() { return wt('fpt.UModules'); }, report: 'integration' as const, doc: 'INT' as const, get exportLabel() { return wt('fpt.export52'); }, get field() { return wt('fpt.fieldModule'); },
    get empty() { return wt('fpt.emptyInt'); }, get emptyBody() { return wt('fpt.emptyIntBody'); } },
  SYS: { get unit() { return wt('fpt.uWorkflow'); }, get Unit() { return wt('fpt.UWorkflow'); }, get units() { return wt('fpt.UWorkflows'); }, report: 'system' as const, doc: 'SYS' as const, get exportLabel() { return wt('fpt.export53'); }, get field() { return 'Feature'; },
    get empty() { return wt('fpt.emptySys'); }, get emptyBody() { return wt('fpt.emptySysBody'); } },
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
  // UX-E: danh sách module/workflow ẩn/hiện (nút hoặc `[`) để bảng 5.2/5.3 rộng tối đa; nhớ lựa chọn.
  const panes = usePanes(`tests-${kind.toLowerCase()}`, { left: { width: 240, neverDrawer: true, strip: true } });
  usePaneKeys({ left: panes.left.toggle });
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
          <KpiRow min={96} className="min-w-0 flex-1" label={wt('fpt.intSummary')}>
            <Stat label={T.units} value={mods.length} />
            <Stat label="Test case" value={s.total} />
            <Stat label="Passed" value={s.passed} tone={s.passed ? 'green' : 'muted'} />
            <Stat label="Failed" value={s.failed} tone={s.failed ? 'red' : 'muted'} />
            <Stat label="Pending" value={s.pending} tone="muted" />
            <Stat label="N/A" value={s.na} tone="muted" />
            <Stat label={wt('fpt.coverage')} value={pct(s.coverage)} hint="(Passed + Failed) / (Total − N/A)" />
            <Stat label={wt('fpt.success')} value={pct(s.successCoverage)} hint="Passed / (Total − N/A)" />
          </KpiRow>
        )}
        <div className="ml-auto flex shrink-0 flex-wrap justify-end gap-2">
          <button type="button" className="w-btn w-btn-sm" onClick={() => setDocOpen(true)}><FileText size={13} /> <span className="hidden sm:inline">{wt('fpt.coverChanges')}</span></button>
          {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => setImportOpen(true)}><FileUp size={13} /> <span className="hidden sm:inline">{wt('common.import')}</span></button>}
          <ExportButton pid={pid} report={T.report} label={T.exportLabel} />
          {canEdit && <TrashLink />}
        </div>
      </div>

      {!mods.length ? (
        <div className="flex-1 overflow-y-auto">
          <EmptyState
            title={T.empty}
            body={T.emptyBody}
            action={canEdit ? (
              <div className="flex gap-2">
                <button type="button" className="w-btn w-btn-primary" onClick={() => setNewOpen(true)}><Plus size={14} /> {wt('fpt.addX', { x: T.unit })}</button>
                <button type="button" className="w-btn" onClick={() => setImportOpen(true)}><FileUp size={14} /> {wt('fpt.importExcel')}</button>
              </div>
            ) : undefined}
          />
        </div>
      ) : (
        <div ref={panes.ref} className="flex min-h-0 flex-1 max-md:flex-col">
          {panes.left.mode === 'strip' && <PaneStrip label={T.units} shortcut="[" onOpen={panes.left.toggle} />}
          {panes.left.mode === 'inline' && (
          <aside className="w-[240px] shrink-0 overflow-y-auto border-r border-[var(--w-border)] py-1 max-md:max-h-[30vh] max-md:w-full max-md:border-b max-md:border-r-0" aria-label={T.units}>
            <div className="flex justify-end px-2 pb-1">
              <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" onClick={panes.left.toggle} aria-label={`${wt('fpt.hideXList', { x: T.units.toLowerCase() })} ([)`} title={wt('fpt.hideTableTitle')}><PanelLeftClose size={14} /></button>
            </div>
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
          )}
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
  if (!q.data) return <EmptyState title={wt('fpt.moduleNotFound')} body={q.error ? workError(q.error) : undefined} />;
  const m = q.data;
  const patch = async (body: Parameters<typeof fptApi.updateModule>[2]) => {
    try {
      const res = await fptApi.updateModule(pid, id, body);
      qc.setQueryData(fptKeys.mod(pid, id), res);
      qc.invalidateQueries({ queryKey: fptKeys.it(pid, kind) });
    } catch (e) { toast.error(workError(e, wt('common.couldNotSave'))); }
  };
  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="mb-3 flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[12px] text-[var(--w-text-3)]">{TEXT[kind].field}</div>
          <InlineText value={m.name} readOnly={!canEdit} maxLength={120} ariaLabel={wt('fpt.xName', { x: TEXT[kind].Unit })} className="!w-[320px] text-[15px] font-semibold" onCommit={(v) => v.trim() && patch({ name: v.trim() })} />
        </div>
        <label className="text-[12px] text-[var(--w-text-3)]">
          ID prefix
          <InlineText value={m.idPrefix} readOnly={!canEdit} maxLength={10} ariaLabel={wt('fpt.idPrefix')} className="!w-[80px] font-mono" onCommit={(v) => /^[A-Za-z]{1,10}$/.test(v.trim()) ? patch({ idPrefix: v.trim().toUpperCase() }) : toast.error(wt('fpt.prefixRule'))} />
        </label>
        {canEdit && (
          <button type="button" className="w-btn w-btn-sm text-[var(--w-red)]" onClick={async () => {
            if (!window.confirm(wt('fpt.deleteModQ', { x: TEXT[kind].unit, name: m.name, n: m.cases.length }))) return;
            try {
              const out = await fptApi.deleteModule(pid, id);
              qc.invalidateQueries({ queryKey: fptKeys.it(pid, kind) });
              if (out.deleted) onDeleted();
              afterDelete(pid, out, () => qc.invalidateQueries({ queryKey: fptKeys.it(pid, kind) }));
            } catch (e) { toast.error(workError(e)); }
          }}><Trash2 size={13} /> {wt('common.delete')}</button>
        )}
      </div>
      <details className="mb-4 rounded-[8px] border border-[var(--w-border)]" open={!m.description && canEdit}>
        <summary className="cursor-pointer select-none px-3 py-2 text-[13px] font-medium">{wt('common.details')} <span className="font-normal text-[var(--w-text-3)]">— {wt('fpt.detailsSub2')}</span></summary>
        <div className="grid gap-x-4 border-t border-[var(--w-border)] p-3 md:grid-cols-3">
          <Field label={wt('fpt.fDescription')}><InlineText multiline value={m.description} readOnly={!canEdit} maxLength={4000} placeholder={wt('fpt.modDescPh')} onCommit={(v) => patch({ description: v })} /></Field>
          <Field label={wt('fpt.fPre')}><InlineText multiline value={m.preCondition} readOnly={!canEdit} maxLength={4000} placeholder={wt('fpt.modPrePh')} onCommit={(v) => patch({ preCondition: v })} /></Field>
          <Field label={wt('fpt.fReq')}><InlineText multiline value={m.testRequirement} readOnly={!canEdit} maxLength={4000} placeholder={wt('fpt.modReqPh')} onCommit={(v) => patch({ testRequirement: v })} /></Field>
        </div>
      </details>
      <CasesTable pid={pid} mod={m} kind={kind} canEdit={canEdit} />
    </div>
  );
}

/** Cột bảng case 5.2/5.3: id, độ rộng mặc định (px), nhãn. Thứ tự = thứ tự hiển thị. */
const IT_COLS = [
  // Thứ tự theo mẫu trường (ID · Description · Procedure · Expected · Pre-conditions · Evidence · Round 1–4 · Note);
  // Test data / Actual result là trường riêng của CT Work (xuất ra thì gói vào ô Procedure / Note) — đứng sau.
  { id: 'id', w: 92, get label() { return 'Test Case ID'; } },
  { id: 'desc', w: 240, get label() { return 'Description'; } },
  { id: 'proc', w: 280, get label() { return 'Procedure'; } },
  { id: 'exp', w: 240, get label() { return 'Expected results'; } },
  { id: 'pre', w: 190, get label() { return 'Pre-conditions'; } },
  { id: 'ev', w: 200, get label() { return 'Evidence'; } },
  { id: 'rounds', w: 190, get label() { return wt('fpt.colRounds'); } },
  { id: 'note', w: 170, get label() { return 'Note'; } },
  { id: 'data', w: 150, get label() { return 'Test data'; } },
  { id: 'actual', w: 180, get label() { return 'Actual result'; } },
] as const;
type ColId = (typeof IT_COLS)[number]['id'];
const IT_DEFAULT_W = Object.fromEntries(IT_COLS.map((c) => [c.id, c.w])) as Record<ColId, number>;
const ACT_W = 34;

function CasesTable({ pid, mod, kind, canEdit }: { pid: number; mod: ItModule; kind: ItKind; canEdit: boolean }) {
  const qc = useQueryClient();
  const me = useAuthStore((s) => s.user);
  const meName = (me as { displayName?: string | null; fullName?: string | null; username?: string } | null)?.displayName || (me as { fullName?: string | null } | null)?.fullName || me?.username || null;
  const [cases, setCases] = useState<DCase[]>(() => mod.cases.map((c) => ({ ...c, key: k(), procedure: c.procedure ?? '', testData: c.testData ?? '', expected: c.expected ?? '', actual: c.actual ?? '', preConditions: c.preConditions ?? '', evidence: c.evidence ?? '', note: c.note ?? '' })));
  const [state, setState] = useState<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle');
  // Khung chi tiết: key của case đang xem.
  const [detail, setDetail] = useState<string | null>(null);
  const cols = useColWidths(`fpt:it:${kind}:colW`, IT_DEFAULT_W, 60, 900);
  const [hiddenCols, setHiddenCols] = useStoredList(`fpt:it:${kind}:hidden`);
  const shownCols = IT_COLS.filter((c) => c.id === 'id' || c.id === 'desc' || !hiddenCols.includes(c.id));
  const [compact, setCompact] = useStoredFlag(`fpt:it:${kind}:compact`, false);
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
      // 22/10/2026: case bị bớt ⇒ vào thùng rác; Hoàn tác = thêm lại vào cuối rồi tải lại module (bộ soạn dựng lại).
      if (res.trashed) undoToast(pid, res.trashed.id, () => qc.resetQueries({ queryKey: fptKeys.mod(pid, mod.id) }), wt('bin.itCasesTrashed', { n: res.trashed.cases }));
    } catch (e) {
      setState('error');
      if (workErrorStatus(e) === 409) toast.error(wt('fpt.someoneSavedMod'), { action: { label: wt('fpt.reload'), onClick: () => qc.resetQueries({ queryKey: fptKeys.mod(pid, mod.id) }) }, duration: 12_000 });
      else toast.error(workError(e, wt('fpt.casesFailed')));
    }
  }, [pid, mod.id, qc]); // eslint-disable-line react-hooks/exhaustive-deps
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
  const maxRounds = roundsOf(kind);
  const width = shownCols.reduce((s, c) => s + cols.widths[c.id], 0) + ACT_W;
  const detailIdx = detail ? cases.findIndex((c) => c.key === detail) : -1;
  const detailCase = detailIdx >= 0 ? cases[detailIdx] : null;
  const idOf = (i: number) => `<${mod.idPrefix}${i + 1}>`;

  const cell = (c: DCase, id: Exclude<ColId, 'id' | 'rounds' | 'ev'>) => {
    const map = {
      desc: { v: c.description, ph: 'Verify that…', on: (v: string) => set(c.key, { description: v }), invalid: !c.description.trim() },
      proc: { v: c.procedure ?? '', ph: '1. Go to Login\n2. Input email\n3. Click Login', on: (v: string) => set(c.key, { procedure: v }) },
      data: { v: c.testData ?? '', ph: 'email: a@b.co', on: (v: string) => set(c.key, { testData: v }) },
      exp: { v: c.expected ?? '', ph: '1. Success message\n2. Home page', on: (v: string) => set(c.key, { expected: v }) },
      actual: { v: c.actual ?? '', ph: 'What actually happened', on: (v: string) => set(c.key, { actual: v }) },
      pre: { v: c.preConditions ?? '', ph: 'User has an account', on: (v: string) => set(c.key, { preConditions: v }) },
      note: { v: c.note ?? '', ph: '', on: (v: string) => set(c.key, { note: v }) },
    }[id] as { v: string; ph: string; on: (v: string) => void; invalid?: boolean };
    return <Cell value={map.v} ro={!canEdit} ph={map.ph} invalid={map.invalid} onChange={map.on} label={`${IT_COLS.find((x) => x.id === id)!.label}`} />;
  };

  const bodyCell = (c: DCase, id: ColId) => {
    if (id === 'rounds') return <RoundsCell rounds={c.rounds} maxRounds={maxRounds} canEdit={canEdit} meName={meName} onChange={(r) => set(c.key, { rounds: r })} />;
    if (id === 'ev') {
      const ev = splitEvidence(c.evidence);
      return (
        <>
          <Cell value={ev.plain} ro={!canEdit} ph="https://… (link)" onChange={(v) => set(c.key, { evidence: joinEvidence(v, ev.files) })} label="Evidence" />
          <EvidenceView pid={pid} files={ev.files} text={ev.plain} compact />
        </>
      );
    }
    if (id === 'id') return null;
    return cell(c, id);
  };

  let n = 0;
  let prevSection: string | null | undefined;
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <SaveState state={state} />
        {missing > 0 && state === 'dirty' && <span className="text-[12px] text-[var(--w-yellow)]">{wt('fpt.needDesc', { n: missing })}</span>}
        <span className="text-[12px] text-[var(--w-text-3)]">{wt('fpt.tableHint')}</span>
        <span className="ml-auto flex flex-wrap gap-2">
          <button type="button" className="w-btn w-btn-sm" aria-pressed={compact} onClick={() => setCompact(!compact)} title={wt('fpt.compactTitle')}>
            <WrapText size={13} /> {compact ? wt('fpt.showFull') : wt('fpt.compactRows')}
          </button>
          <ColumnsMenu hidden={hiddenCols} onChange={setHiddenCols} />
          <button type="button" className="w-btn w-btn-sm" onClick={cols.reset} title={wt('fpt.resetWidthsTitle')}><RotateCcw size={13} /> {wt('fpt.resetWidths')}</button>
          {canEdit && (
            <>
              <button type="button" className="w-btn w-btn-sm" onClick={() => { const name = window.prompt(wt('fpt.sectionPrompt')); if (name?.trim()) addCase(name.trim().slice(0, 200)); }}><Plus size={13} /> {wt('fpt.section')}</button>
              <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => addCase(lastSection)}><Plus size={13} /> Test case</button>
            </>
          )}
        </span>
      </div>
      <div className="fpt-it-wrap overflow-auto rounded-[8px] border border-[var(--w-border)]" style={{ maxHeight: 'calc(100vh - 230px)' }}>
        <table className={cn('fpt-it', compact && 'is-compact')} style={{ width }}>
          <colgroup>
            {shownCols.map((c) => <col key={c.id} style={{ width: cols.widths[c.id] }} />)}
            <col style={{ width: ACT_W }} />
          </colgroup>
          <thead>
            <tr>
              {shownCols.map((c) => (
                <th key={c.id} scope="col" className={cn(c.id === 'id' && 'fpt-it-stick')}>
                  {c.id === 'rounds' ? `${c.label} (1–${maxRounds})` : c.label}
                  <ColResizer width={cols.widths[c.id]} onResize={(px) => cols.set(c.id, px)} onDone={cols.commit} onReset={() => { cols.set(c.id, IT_DEFAULT_W[c.id]); cols.commit(); }} label={wt('fpt.resizeCol', { c: c.label })} />
                </th>
              ))}
              <th aria-label={wt('common.actions')} />
            </tr>
          </thead>
          <tbody>
            {cases.map((c, i) => {
              n++;
              const showSec = c.section && c.section !== prevSection;
              prevSection = c.section;
              return [
                showSec ? (
                  <tr key={`${c.key}-sec`} className="fpt-it-sec">
                    <td colSpan={shownCols.length + 1}>
                      <div className="fpt-it-sec-inner flex items-center gap-2 px-2 py-1">
                        <SectionName value={c.section!} canEdit={canEdit} onRename={(to) => change((cs) => cs.map((x) => (x.section === c.section ? { ...x, section: to } : x)))} />
                        {canEdit && <button type="button" className="fpt-mini" onClick={() => {
                          const lastIdx = [...cases].reverse().find((x) => x.section === c.section)?.key;
                          addCase(c.section, lastIdx);
                        }}><Plus size={12} /> Case</button>}
                      </div>
                    </td>
                  </tr>
                ) : null,
                <tr key={c.key} className={cn(detail === c.key && 'is-active')}>
                  <td className="fpt-it-stick">
                    <button type="button" className="fpt-it-id" onClick={() => setDetail(c.key)} title={wt('fpt.openDetails')} aria-label={wt('fpt.openCaseN', { id: idOf(n - 1) })}>
                      <span>{idOf(n - 1)}</span>
                      <PanelRightOpen size={13} aria-hidden />
                    </button>
                  </td>
                  {shownCols.slice(1).map((col) => <td key={col.id} className={col.id === 'rounds' ? 'px-2 py-1.5' : undefined}>{bodyCell(c, col.id)}</td>)}
                  <td className="text-center">
                    {canEdit && <button type="button" className="fpt-icon mt-1.5" aria-label={wt('fpt.deleteCase')} onClick={() => { if (detail === c.key) setDetail(null); change((cs) => cs.filter((x) => x.key !== c.key)); }}><Trash2 size={12} /></button>}
                  </td>
                </tr>,
              ];
            })}
            {!cases.length && <tr><td colSpan={shownCols.length + 1} className="px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">{wt('fpt.noCases')}</td></tr>}
          </tbody>
        </table>
      </div>

      <DetailDrawer
        open={!!detailCase}
        onClose={() => setDetail(null)}
        title={detailCase ? `${idOf(detailIdx)} ${detailCase.description.split('\n')[0] || ''}` : ''}
        subtitle={detailCase ? [mod.name, detailCase.section].filter(Boolean).join(' › ') : undefined}
        onPrev={detailIdx > 0 ? () => setDetail(cases[detailIdx - 1].key) : null}
        onNext={detailIdx >= 0 && detailIdx < cases.length - 1 ? () => setDetail(cases[detailIdx + 1].key) : null}
        width={640}
      >
        {detailCase && <CaseDetail key={detailCase.key} pid={pid} c={detailCase} canEdit={canEdit} maxRounds={maxRounds} meName={meName} onChange={(p) => set(detailCase.key, p)} />}
      </DetailDrawer>
    </div>
  );
}

/** Nội dung khung chi tiết một case 5.2/5.3: mọi trường, xuống dòng đầy đủ, sửa được; bảng vòng chạy 1–N. */
function CaseDetail({ pid, c, canEdit, maxRounds, meName, onChange }: { pid: number; c: DCase; canEdit: boolean; maxRounds: number; meName: string | null; onChange: (p: Partial<DCase>) => void }) {
  const F = ({ label, v, k, ph, mono }: { label: string; v: string; k: keyof DCase; ph?: string; mono?: boolean }) => (
    <label className="fpt-detail-field">
      <span>{label}</span>
      <GrowArea value={v} readOnly={!canEdit} placeholder={ph} ariaLabel={label} mono={mono} onChange={(x) => onChange({ [k]: x } as Partial<DCase>)} />
    </label>
  );
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-[12px]">
        <span className={statusCls(currentOf(c.rounds))}>{currentOf(c.rounds)}</span>
        <RoundChips rounds={c.rounds} maxRounds={maxRounds} />
      </div>
      {F({ label: 'Description', v: c.description, k: 'description', ph: 'Verify that…' })}
      {F({ label: 'Procedure', v: c.procedure ?? '', k: 'procedure', ph: '1. …' })}
      {F({ label: 'Test data', v: c.testData ?? '', k: 'testData', mono: true })}
      {F({ label: 'Expected results', v: c.expected ?? '', k: 'expected' })}
      {F({ label: 'Pre-conditions', v: c.preConditions ?? '', k: 'preConditions' })}
      <EvidenceField pid={pid} value={c.evidence ?? ''} canEdit={canEdit} onChange={(v) => onChange({ evidence: v })} />
      {F({ label: 'Actual result', v: c.actual ?? '', k: 'actual' })}
      {F({ label: 'Note', v: c.note ?? '', k: 'note' })}
      <label className="fpt-detail-field">
        <span>{wt('fpt.section')}</span>
        <input className="w-input h-[30px]" readOnly={!canEdit} value={c.section ?? ''} maxLength={200} onChange={(e) => onChange({ section: e.target.value || null })} />
      </label>
      <div className="fpt-detail-field">
        <span>{wt('fpt.colRounds')}</span>
        <RoundsEditor rounds={c.rounds} maxRounds={maxRounds} canEdit={canEdit} meName={meName} onChange={(r) => onChange({ rounds: r })} />
      </div>
    </div>
  );
}

/** Evidence trong khung chi tiết: chữ/link + ảnh chụp (dán Ctrl/⌘+V hoặc chọn tệp ⇒ tải lên kho của dự án). */
function EvidenceField({ pid, value, canEdit, onChange }: { pid: number; value: string; canEdit: boolean; onChange: (v: string) => void }) {
  const ev = splitEvidence(value);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const latestEv = useRef(ev);
  latestEv.current = ev;
  const upload = async (files: File[]) => {
    const imgs = files.filter((f) => /^image\/(png|jpeg|gif)$/.test(f.type));
    if (!imgs.length) { if (files.length) toast.error(wt('fpt.evidenceType')); return; }
    setBusy(true);
    try {
      const added: string[] = [];
      for (const f of imgs) added.push((await fptApi.uploadEvidence(pid, f)).file);
      onChange(joinEvidence(latestEv.current.plain, [...latestEv.current.files, ...added]));
    } catch (e) { toast.error(workError(e, wt('fpt.evidenceUploadFailed'))); }
    finally { setBusy(false); }
  };
  return (
    <div className="fpt-detail-field" onPaste={(e) => { if (!canEdit) return; const fs = [...e.clipboardData.files]; if (fs.length) { e.preventDefault(); void upload(fs); } }}>
      <span className="flex items-center gap-2">
        Evidence
        {canEdit && (
          <>
            <button type="button" className="fpt-mini ml-auto" disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? <Spinner size={11} /> : <ImagePlus size={12} />} {wt('fpt.evidenceAdd')}
            </button>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/gif" multiple hidden onChange={(e) => { const fs = [...(e.target.files ?? [])]; e.target.value = ''; void upload(fs); }} />
          </>
        )}
      </span>
      <GrowArea value={ev.plain} readOnly={!canEdit} placeholder={canEdit ? wt('fpt.evidencePh') : ''} ariaLabel="Evidence" onChange={(x) => onChange(joinEvidence(x, ev.files))} />
      <EvidenceView pid={pid} files={ev.files} text={ev.plain} onRemove={canEdit ? (f) => onChange(joinEvidence(ev.plain, ev.files.filter((x) => x !== f))) : undefined} />
    </div>
  );
}

/** Ẩn/hiện cột (nhớ theo người dùng) — vd ẩn Test data / Actual khi nhóm không dùng để bảng đỡ chật. */
function ColumnsMenu({ hidden, onChange }: { hidden: string[]; onChange: (v: string[]) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const optional = IT_COLS.filter((c) => c.id !== 'id' && c.id !== 'desc');
  return (
    <>
      <button ref={ref} type="button" className="w-btn w-btn-sm" onClick={() => setOpen(true)} aria-haspopup="true" aria-expanded={open}>
        <Columns3 size={13} /> {wt('fpt.columns')}{hidden.length ? ` (${IT_COLS.length - hidden.length})` : ''}
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={ref} width={220} align="end">
        <div className="py-1">
          {optional.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-[13px] hover:bg-[var(--w-hover)]">
              <input type="checkbox" checked={!hidden.includes(c.id)} onChange={(e) => onChange(e.target.checked ? hidden.filter((x) => x !== c.id) : [...hidden, c.id])} />
              {c.label}
            </label>
          ))}
        </div>
      </Popover>
    </>
  );
}

/** Chip nhỏ cho từng vòng đã có kết quả: R1 ✓ · R2 ✗ … (đọc nhanh lịch sử chạy). */
function RoundChips({ rounds, maxRounds }: { rounds: ItRound[]; maxRounds: number }) {
  return (
    <span className="inline-flex flex-wrap gap-1">
      {Array.from({ length: maxRounds }, (_, i) => {
        const r = rounds[i];
        const st = r?.status;
        return (
          <span key={i} className={cn('fpt-rchip', st ? `fpt-rchip-${st === 'N/A' ? 'NA' : st}` : 'fpt-rchip-empty')} title={st ? `Round ${i + 1}: ${st}${r?.date ? ` · ${r.date}` : ''}${r?.tester ? ` · ${r.tester}` : ''}` : `Round ${i + 1}: —`}>
            R{i + 1}{st ? ` ${st === 'Passed' ? '✓' : st === 'Failed' ? '✗' : st === 'N/A' ? 'N/A' : '…'}` : ''}
          </span>
        );
      })}
    </span>
  );
}

function SectionName({ value, canEdit, onRename }: { value: string; canEdit: boolean; onRename: (to: string) => void }) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  return (
    <input className="fpt-input w-[280px] font-semibold" value={v} readOnly={!canEdit} aria-label={wt('fpt.sectionName')} maxLength={200}
      onChange={(e) => setV(e.target.value)} onBlur={() => (v.trim() && v !== value ? onRename(v.trim()) : setV(value))}
      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()} />
  );
}

function Cell({ value, onChange, ro, ph, invalid, label }: { value: string; onChange: (v: string) => void; ro: boolean; ph?: string; invalid?: boolean; label?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${Math.max(34, el.scrollHeight)}px`;
  }, [value]);
  return <textarea ref={ref} rows={1} aria-label={label} title={ro && value.length > 120 ? value : undefined} className={cn('fpt-cellarea', invalid && !ro && 'is-invalid placeholder:text-[var(--w-red)]')} value={value} readOnly={ro} placeholder={ro ? '' : ph} onChange={(e) => onChange(e.target.value)} />;
}

const setRoundIn = (rounds: ItRound[], i: number, p: Partial<ItRound>): ItRound[] => {
  const next = [...rounds];
  while (next.length <= i) next.push({ status: null, date: null, tester: null });
  next[i] = { ...next[i], ...p };
  while (next.length && !next[next.length - 1].status && !next[next.length - 1].date && !next[next.length - 1].tester) next.pop();
  return next;
};

function RoundsCell({ rounds, onChange, canEdit, meName, maxRounds }: { rounds: ItRound[]; onChange: (r: ItRound[]) => void; canEdit: boolean; meName: string | null; maxRounds: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const cur = currentOf(rounds);
  return (
    <>
      <button ref={ref} type="button" className="flex flex-col items-start gap-1 text-left" onClick={() => setOpen(true)} aria-label={wt('fpt.resultEdit', { s: cur })}>
        <span className="flex flex-wrap items-center gap-1">
          <span className={statusCls(cur)}>{cur}</span>
          {rounds.length > 0 && <span className="text-[11px] text-[var(--w-text-3)]">R{rounds.length}{rounds[rounds.length - 1]?.date ? ` · ${shortDate(rounds[rounds.length - 1].date)}` : ''}</span>}
        </span>
        {rounds.length > 0 && <RoundChips rounds={rounds} maxRounds={maxRounds} />}
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={ref} width={430} align="end">
        <div className="p-3 text-[12.5px]">
          <RoundsEditor rounds={rounds} maxRounds={maxRounds} canEdit={canEdit} meName={meName} onChange={onChange} />
        </div>
      </Popover>
    </>
  );
}

/** Bảng sửa vòng chạy (popover của ô + khung chi tiết): nút nhanh "vòng kế tiếp" + Round 1…N (trạng thái, ngày, người kiểm). */
function RoundsEditor({ rounds, onChange, canEdit, meName, maxRounds }: { rounds: ItRound[]; onChange: (r: ItRound[]) => void; canEdit: boolean; meName: string | null; maxRounds: number }) {
  const setRound = (i: number, p: Partial<ItRound>) => onChange(setRoundIn(rounds, i, p));
  const quick = (st: ItStatus) => {
    // Ghi vào vòng gần nhất chưa có kết quả; đầy vòng (4 ở 5.2/5.3) thì sửa vòng cuối.
    const free = rounds.slice(0, maxRounds).findIndex((r) => !r.status);
    const i = free >= 0 ? free : Math.min(rounds.length, maxRounds - 1);
    setRound(i, { status: st, date: rounds[i]?.date ?? todayIso(), tester: rounds[i]?.tester ?? meName });
  };
  return (
    <div className="space-y-2">
      {canEdit && (
        <div className="flex flex-wrap gap-1">
          <span className="mr-1 self-center text-[var(--w-text-3)]">{wt('fpt.nextRound')}</span>
          {IT_STATUSES.map((s) => <button key={s} type="button" className={statusCls(s)} onClick={() => quick(s)}>{s}</button>)}
        </div>
      )}
      <table className="w-full">
        <thead><tr className="text-left text-[11px] text-[var(--w-text-3)]"><th className="font-medium">Round</th><th className="font-medium">{wt('common.status')}</th><th className="font-medium">{wt('common.day')}</th><th className="font-medium">Tester</th></tr></thead>
        <tbody>
          {Array.from({ length: maxRounds }, (_, i) => {
            const r = rounds[i];
            return (
              <tr key={i}>
                <td className="pr-1 text-[var(--w-text-2)]">{i + 1}</td>
                <td className="pr-1">
                  <select className="w-input h-[26px] w-[96px] text-[12px]" disabled={!canEdit} value={r?.status ?? ''} aria-label={`Round ${i + 1} ${wt('common.status')}`} onChange={(e) => setRound(i, { status: (e.target.value || null) as ItStatus | null, date: r?.date ?? (e.target.value ? todayIso() : null), tester: r?.tester ?? (e.target.value ? meName : null) })}>
                    <option value="">—</option>
                    {IT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="pr-1"><input type="date" className="w-input h-[26px] text-[12px]" disabled={!canEdit} value={r?.date ?? ''} aria-label={`Round ${i + 1} ${wt('common.day')}`} onChange={(e) => setRound(i, { date: e.target.value || null })} /></td>
                <td><input className="w-input h-[26px] text-[12px]" disabled={!canEdit} value={r?.tester ?? ''} maxLength={120} aria-label={`Round ${i + 1} tester`} onChange={(e) => setRound(i, { tester: e.target.value || null })} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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
    catch (e) { toast.error(workError(e, wt('fpt.addModFailed'))); }
    finally { setBusy(false); }
  };
  return (
    <Dialog open={open} onClose={() => !busy && onClose()} title={sys ? wt('fpt.addSysWf') : wt('fpt.addIntMod')} width={480}
      footer={<><button type="button" className="w-btn" onClick={onClose} disabled={busy}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" onClick={submit} disabled={busy || !name.trim()}>{busy && <Spinner size={12} />} {wt('common.add')}</button></>}>
      <form onSubmit={(e) => { e.preventDefault(); void submit(); }}>
        <Field label={sys ? wt('fpt.wfName') : wt('fpt.modName')} hint={sys ? wt('fpt.wfHint') : wt('fpt.modHint')}><input className="w-input" autoFocus value={name} maxLength={120} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label={wt('fpt.fDescription')}><input className="w-input" value={description} maxLength={4000} onChange={(e) => setDescription(e.target.value)} placeholder={wt('fpt.addDescPh')} /></Field>
        <button type="submit" className="hidden" aria-hidden tabIndex={-1} />
      </form>
    </Dialog>
  );
}
