'use client';

/**
 * CTW đợt 4 (A19) — Ma trận truy vết đầy đủ: Req/UC ↔ mục SRS ↔ mục SDS ↔ commit/PR ↔ test (Xray + 5.1/5.2/5.3) ↔ Bug.
 * Ô KPI tổng, lọc theo CHỖ HỞ (bấm chip), trạng thái, loại, chữ; bảng tiêu đề dính; thêm liên kết tay cho một dòng;
 * xuất .xlsx (RTM + BR Coverage + Untraced Tests + Summary).
 */

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { saveBlob } from '@/lib/work-docs3a-api';
import { GAP_CODES, RTM_STATUSES, workCtw4Api, workCtw4Keys, type GapCode, type RtmRow, type TraceTargetKind } from '@/lib/work-ctw4-api';
import KpiTile from '../KpiTile';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '../ui';
import { Chip, GAP_TONE, TableFrame, TD, TH } from './shared';

const cellList = (xs: string[]) => (xs.length ? <ul className="m-0 list-none space-y-0.5 p-0">{xs.map((x, i) => <li key={i} className="break-words">{x}</li>)}</ul> : <span className="text-[var(--w-text-3)]">—</span>);
const setLine = (s: { ref?: string; name: string; cases: number; passed: number; failed: number; notRun: number }) => `${s.ref ?? s.name}: ${s.passed}/${s.cases} passed${s.failed ? `, ${s.failed} failed` : ''}${s.notRun ? `, ${s.notRun} not run` : ''}`;

function TraceDialog({ pid, row, onClose }: { pid: number; row: RtmRow | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [kind, setKind] = useState<TraceTargetKind>('SDS');
  const [page, setPage] = useState('');
  const [heading, setHeading] = useState('');
  const [target, setTarget] = useState('');
  const [ref, setRef] = useState('');
  const add = useMutation({
    mutationFn: () => workCtw4Api.addTraceLink(pid, {
      source: row!.kind === 'UC' ? { kind: 'UC', ref: row!.reqId } : { kind: 'ISSUE', ref: row!.issueNumber! },
      target: { kind, ...(page ? { pageNumber: Number(page) } : {}), ...(heading.trim() ? { heading: heading.trim() } : {}), ...(target ? { targetId: Number(target) } : {}), ...(ref.trim() ? { ref: ref.trim() } : {}) },
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: workCtw4Keys.rtm(pid) }); toast.success('Link added'); onClose(); },
    onError: (e) => toast.error(workError(e, 'Could not add the link')),
  });
  const doc = kind === 'SRS' || kind === 'SDS';
  return (
    <Dialog open={!!row} onClose={onClose} title={`Trace ${row?.reqId ?? ''}`} width={520}
      footer={<><button type="button" className="w-btn" onClick={onClose}>Cancel</button><button type="button" className="w-btn w-btn-primary" disabled={add.isPending} onClick={() => add.mutate()}>{add.isPending && <Spinner size={12} />} Add link</button></>}>
      <p className="mb-3 text-[12.5px] text-[var(--w-text-2)]">Most links are found automatically (a page, test or function that mentions “{row?.reqId}”). Add one by hand when the matrix shows a gap the link would close.</p>
      <Field label="Link to">
        <select className="w-input" value={kind} onChange={(e) => setKind(e.target.value as TraceTargetKind)}>
          <option value="SRS">SRS section (Docs page)</option><option value="SDS">SDS / design section (Docs page)</option>
          <option value="UNIT">Unit test function (5.1)</option><option value="IT">Integration module (5.2)</option><option value="ST">System test workflow (5.3)</option>
          <option value="CODE">Code (Class.method or path)</option>
        </select>
      </Field>
      {doc && (
        <div className="grid gap-x-4 sm:grid-cols-[120px_1fr]">
          <Field label="Page number"><input className="w-input" inputMode="numeric" value={page} onChange={(e) => setPage(e.target.value.replace(/\D/g, ''))} /></Field>
          <Field label="Section heading"><input className="w-input" value={heading} maxLength={255} placeholder="2.1 Create Reservation" onChange={(e) => setHeading(e.target.value)} /></Field>
        </div>
      )}
      {(kind === 'UNIT' || kind === 'IT' || kind === 'ST') && <Field label="Test id" hint="The id shown on Tests → FPT reports."><input className="w-input" inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value.replace(/\D/g, ''))} /></Field>}
      {kind === 'CODE' && <Field label="Class.method or file"><input className="w-input" value={ref} maxLength={300} placeholder="ReservationService.create" onChange={(e) => setRef(e.target.value)} /></Field>}
    </Dialog>
  );
}

export default function RtmTab({ pid, onOpenIssue, onOpenUc }: { pid: number; onOpenIssue: (n: number) => void; onOpenUc: (n: number) => void }) {
  const q = useQuery({ queryKey: workCtw4Keys.rtm(pid), queryFn: () => workCtw4Api.rtm(pid) });
  const [gap, setGap] = useState<GapCode | 'ANY' | null>(null);
  const [status, setStatus] = useState('');
  const [kind, setKind] = useState('');
  const [text, setText] = useState('');
  const [trace, setTrace] = useState<RtmRow | null>(null);
  const [busy, setBusy] = useState(false);
  const rows = useMemo(() => {
    const t = text.trim().toLowerCase();
    return (q.data?.rows ?? []).filter((r) => (!gap || (gap === 'ANY' ? r.gaps.length > 0 : r.gaps.includes(gap))) && (!status || r.status === status) && (!kind || r.kind === kind)
      && (!t || `${r.reqId} ${r.issueKey ?? ''} ${r.requirement} ${r.feature}`.toLowerCase().includes(t)));
  }, [q.data, gap, status, kind, text]);
  if (q.isLoading) return <PageLoading />;
  if (!q.data) return <EmptyState title="Could not load the matrix" body={q.error ? workError(q.error) : undefined} />;
  const s = q.data.summary;
  const labels = q.data.gapLabels;
  const exportX = async () => {
    setBusy(true);
    try { const f = await workCtw4Api.exportRtm(pid); saveBlob(f.blob, f.fileName); toast.success(`Downloaded ${f.fileName}`); } catch (e) { toast.error(workError(e, 'Could not export')); } finally { setBusy(false); }
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <KpiTile label="Requirements" value={s.rows} hint={`${s.useCases} use case${s.useCases === 1 ? '' : 's'} · ${s.requirements} issue${s.requirements === 1 ? '' : 's'}`} />
        <KpiTile label="With at least one test" value={`${s.testedPct}%`} hint={`${s.withTests} of ${s.rows}`} tone={s.testedPct >= 80 ? 'green' : s.testedPct >= 50 ? 'yellow' : s.rows ? 'red' : undefined} />
        <KpiTile label="Fully tested" value={s.passing} hint="Tests run and passing" tone={s.passing ? 'green' : undefined} />
        <KpiTile label="With gaps" value={s.withGaps} tone={s.withGaps ? 'orange' : 'green'} onClick={() => setGap(gap === 'ANY' ? null : 'ANY')} pressed={gap === 'ANY'} title="Show only rows with a gap" />
      </div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by gap">
        {GAP_CODES.filter((g) => s.gaps[g] > 0 || gap === g).map((g) => (
          <button key={g} type="button" aria-pressed={gap === g} onClick={() => setGap(gap === g ? null : g)}
            className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[12px] ${gap === g ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft)] text-[var(--w-text)]' : 'border-[var(--w-border)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]'}`}>
            {labels[g]} <span className="tabular-nums font-semibold">{s.gaps[g]}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col text-[12px] text-[var(--w-text-2)]">Search<input className="w-input mt-1 h-8 w-[220px]" value={text} placeholder="UC-03, LAB-12, name…" onChange={(e) => setText(e.target.value)} /></label>
        <label className="flex flex-col text-[12px] text-[var(--w-text-2)]">Status
          <select className="w-input mt-1 h-8 w-[140px]" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All</option>{RTM_STATUSES.map((x) => <option key={x}>{x}</option>)}</select>
        </label>
        <label className="flex flex-col text-[12px] text-[var(--w-text-2)]">Kind
          <select className="w-input mt-1 h-8 w-[160px]" value={kind} onChange={(e) => setKind(e.target.value)}><option value="">All</option><option value="UC">Use cases</option><option value="REQ">Requirement issues</option></select>
        </label>
        <span className="flex-1" />
        <span className="text-[12px] text-[var(--w-text-2)]" aria-live="polite">{rows.length} of {s.rows} rows</span>
        <button type="button" className="w-btn w-btn-sm" disabled={busy} onClick={exportX}>{busy ? <Spinner size={12} /> : <Download size={13} />} Export .xlsx</button>
      </div>
      {!s.rows ? <EmptyState title="Nothing to trace yet" body="Add use cases (or Requirement/Story issues). The matrix links them to SRS/SDS sections, commits, tests and bugs automatically." /> : (
        <TableFrame label="Requirement traceability matrix">
          <table className="w-full min-w-[1280px] border-separate border-spacing-0 text-[12.5px]">
            <thead>
              <tr>{['Req ID', 'Requirement', 'Status', 'Gaps', 'SRS §', 'SDS §', 'Code', 'Tests', 'Bugs', ''].map((h, i) => <th key={i} scope="col" className={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.reqId} className="hover:bg-[var(--w-hover)]">
                  <td className={`${TD} whitespace-nowrap font-mono text-[12px]`}>
                    {r.kind === 'UC' && r.ucNumber ? <button type="button" className="text-[var(--w-accent-text)] hover:underline" onClick={() => onOpenUc(r.ucNumber!)}>{r.reqId}</button>
                      : <button type="button" className="text-[var(--w-accent-text)] hover:underline" onClick={() => r.issueNumber && onOpenIssue(r.issueNumber)}>{r.reqId}</button>}
                    {r.kind === 'UC' && r.issueKey && <div><button type="button" className="text-[11.5px] text-[var(--w-text-2)] hover:underline" onClick={() => onOpenIssue(r.issueNumber!)}>{r.issueKey}</button></div>}
                  </td>
                  <td className={`${TD} min-w-[180px] max-w-[260px]`}>
                    <div className="font-medium">{r.requirement}</div>
                    {(r.feature || r.rules.length > 0) && <div className="text-[11.5px] text-[var(--w-text-2)]">{[r.feature, r.rules.join(', ')].filter(Boolean).join(' · ')}</div>}
                    {r.screens.length > 0 && <div className="text-[11.5px] text-[var(--w-text-2)]">Screens: {r.screens.join(', ')}</div>}
                  </td>
                  <td className={TD}><Chip tone={r.status === 'Tested' ? 'green' : r.status === 'Coded' ? 'blue' : r.status === 'Planned' ? 'muted' : 'accent'}>{r.status}</Chip></td>
                  <td className={`${TD} min-w-[150px] max-w-[200px]`}><span className="flex flex-wrap gap-1">{r.gaps.length ? r.gaps.map((g) => <Chip key={g} tone={GAP_TONE[g]} title={g === 'UC_INCOMPLETE' ? `Missing: ${r.ucMissing.join(', ')}` : undefined}>{labels[g]}</Chip>) : <Chip tone="green">No gap</Chip>}</span></td>
                  <td className={`${TD} min-w-[140px] max-w-[220px]`}>{cellList(r.srs)}</td>
                  <td className={`${TD} min-w-[150px] max-w-[240px]`}>{cellList([...r.sds, ...r.classMethod.map((c) => `Code: ${c}`)])}</td>
                  <td className={`${TD} whitespace-nowrap`}>
                    {r.code.commits + r.code.prs + r.code.branches ? (
                      <span title={r.code.latest?.title}>{r.code.commits} commit{r.code.commits === 1 ? '' : 's'} · {r.code.prs} PR{r.code.prs === 1 ? '' : 's'}</span>
                    ) : <span className="text-[var(--w-text-3)]">—</span>}
                  </td>
                  <td className={`${TD} min-w-[200px]`}>
                    {cellList([
                      ...r.xray.map((x) => `${x.key} ${x.last ?? 'not run'}`),
                      ...r.unit.map((u) => `5.1 ${setLine(u)}`),
                      ...r.integration.map((u) => `5.2 ${setLine(u)}`),
                      ...r.system.map((u) => `5.3 ${setLine(u)}`),
                    ])}
                  </td>
                  <td className={`${TD} whitespace-nowrap`}>{r.bugs.length ? r.bugs.map((b) => <div key={b.key} className={b.open ? 'text-[var(--w-red-text)]' : 'text-[var(--w-text-2)] line-through'} title={b.title}>{b.key}{b.severity ? ` · ${b.severity.toLowerCase()}` : ''}</div>) : <span className="text-[var(--w-text-3)]">—</span>}</td>
                  <td className={`${TD} w-10`}><button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`Add a trace link for ${r.reqId}`} title="Add a trace link" onClick={() => setTrace(r)} disabled={r.kind === 'REQ' && !r.issueNumber}><Link2 size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
      {(q.data.rules.length > 0 || q.data.orphans.length > 0) && (
        <div className="grid gap-3 lg:grid-cols-2">
          {q.data.rules.length > 0 && (
            <section aria-labelledby="brcov" className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3">
              <h2 id="brcov" className="mb-2 text-[13px] font-semibold">Business rules → tests</h2>
              <ul className="m-0 list-none space-y-1 p-0 text-[12.5px]">
                {q.data.rules.map((b) => (
                  <li key={b.key} className="flex items-start gap-2">
                    <span className="w-12 shrink-0 font-mono text-[12px]">{b.key}</span>
                    <span className="min-w-0 flex-1">{b.name}<span className="text-[var(--w-text-2)]">{b.usedIn.length ? ` — ${b.usedIn.join(', ')}` : ''}</span></span>
                    {b.covered ? <Chip tone="green">Tested</Chip> : <Chip tone="orange">No test</Chip>}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {q.data.orphans.length > 0 && (
            <section aria-labelledby="orph" className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3">
              <h2 id="orph" className="mb-1 text-[13px] font-semibold">Tests that trace back to no requirement</h2>
              <p className="mb-2 text-[12px] text-[var(--w-text-2)]">Either an extra test, or a requirement missing from the SRS.</p>
              <ul className="m-0 list-none space-y-1 p-0 text-[12.5px]">
                {q.data.orphans.slice(0, 30).map((o, i) => <li key={i}><Chip tone="muted">{o.kind === 'XRAY' ? 'Test case' : o.kind === 'UNIT' ? '5.1' : o.kind === 'IT' ? '5.2' : '5.3'}</Chip> <span className="font-mono text-[12px]">{o.ref}</span> {o.kind === 'XRAY' ? o.name : ''}</li>)}
              </ul>
            </section>
          )}
        </div>
      )}
      <TraceDialog pid={pid} row={trace} onClose={() => setTrace(null)} />
    </div>
  );
}
