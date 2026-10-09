'use client';

/**
 * TÀI CHÍNH DỰ ÁN — /work/<ws>/<KEY>/finance (đợt S4, mô-đun finance). Sáu thẻ, mỗi thẻ hiện theo quyền
 * (server quyết — giao diện chỉ ẩn cho gọn):
 *   Overview · Rates · Budget & costs · Payments — chỉ ADMIN dự án (thấy tiền);
 *   My timesheet — người ghi giờ (ADMIN, MEMBER);
 *   Approvals — ADMIN + trưởng bộ phận (thấy GIỜ, không thấy tiền).
 * CHỈ THEO DÕI: CT Work không xuất hoá đơn (hoá đơn điện tử ở VN phải qua nhà cung cấp được cấp phép).
 */

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  AlertTriangle, ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Download, Info, Lock, Plus, Receipt, RotateCcw, Send, Trash2, Undo2, Unlock, Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workApi, workError, workStudioApi, workStudioKeys, type ProjectConfig } from '@/lib/work-api';
import {
  addDays, fmtHours, fmtMoney, mondayOf, PAYMENT_STATUS_LABEL, s4Api, s4Keys, TIMESHEET_STATUS_LABEL, todayVn,
  type BudgetCategory, type Currency, type ExpenseCategory, type FinanceSummary, type PaymentMilestone, type PaymentStatus, type PaymentTrigger,
  type RateScope, type Timesheet, type TimesheetStatus,
} from '@/lib/work-s4-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner, formatDate } from '../ui';
import { ConfirmDialog, Select } from '../settings/shared';
import { Pill, useWorkspaceTeams } from '../studio/shared';
import { wk } from '../hooks';
import { wt, wfmt } from '@/components/work/i18n';

type Tab = 'overview' | 'timesheet' | 'approvals' | 'rates' | 'budget' | 'payments';

function save(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

const num = (v: string) => (v.trim() === '' ? null : Number(v.replace(/,/g, '')));

export function NoInvoiceNotice({ className }: { className?: string }) {
  return (
    <p className={cn('flex items-start gap-2 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px] leading-relaxed text-[var(--w-text-2)]', className)} data-testid="no-invoice-notice">
      <Info size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
      <span>{wt('finance.noInvoice')}</span>
    </p>
  );
}

function useInvalidate(pid: number) {
  const qc = useQueryClient();
  return useCallback(() => qc.invalidateQueries({ queryKey: s4Keys.all(pid) }), [qc, pid]);
}

const TS_TONE: Record<TimesheetStatus, 'blue' | 'green' | 'orange' | 'neutral'> = { SUBMITTED: 'blue', APPROVED: 'green', RETURNED: 'orange', REOPENED: 'orange' };
const PAY_TONE: Record<PaymentStatus, 'neutral' | 'orange' | 'blue' | 'green'> = { PLANNED: 'neutral', DUE: 'orange', INVOICED: 'blue', PAID: 'green' };

// ─── Overview ────────────────────────────────────────────────────

function Kpi({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: 'red' | 'orange' | 'green' }) {
  return (
    <div className="w-card min-w-0 px-4 py-3">
      <div className="text-[12px] font-medium text-[var(--w-text-3)]">{label}</div>
      <div className="mt-1 text-[16px] font-semibold leading-tight tabular-nums tracking-[-0.015em] [overflow-wrap:anywhere] sm:text-[20px]" style={tone ? { color: `var(--w-${tone})` } : undefined}>{value}</div>
      {sub && <div className="mt-0.5 text-[12px] text-[var(--w-text-3)] [overflow-wrap:anywhere]">{sub}</div>}
    </div>
  );
}

function BudgetBar({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const color = pct >= 100 ? 'var(--w-red)' : pct >= 80 ? 'var(--w-orange)' : 'var(--w-green)';
  return (
    <div className="mt-3">
      <div className="relative h-2.5 overflow-hidden rounded-full bg-[var(--w-sunken)]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={wt('finance.budgetUsed')}>
        <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
        <div className="absolute inset-y-0 w-px bg-[var(--w-text-3)] opacity-60" style={{ left: '80%' }} title={wt('finance.warning80')} />
      </div>
      <div className="mt-1 flex justify-between text-[11.5px] text-[var(--w-text-3)]"><span>{wt('finance.pctUsed', { pct })}</span><span>{wt('finance.warningAt80')}</span></div>
    </div>
  );
}

function WeeklyBars({ f }: { f: FinanceSummary }) {
  const max = Math.max(1, ...f.weekly.map((w) => w.labor + w.expenses));
  return (
    <div className="w-card p-4">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h3 className="w-section-title">{wt('finance.costPerWeek')}</h3>
        <span className="flex items-center gap-1.5 text-[11.5px] text-[var(--w-text-3)]"><span className="h-2 w-2 rounded-[2px] bg-[var(--w-chart-1)]" />{wt('finance.laborApproved')}</span>
        <span className="flex items-center gap-1.5 text-[11.5px] text-[var(--w-text-3)]"><span className="h-2 w-2 rounded-[2px] bg-[var(--w-chart-3)]" />{wt('finance.otherCosts')}</span>
      </div>
      <div className="flex h-[120px] items-end gap-1" role="img" aria-label={wt('finance.costPerWeekAria')}>
        {f.weekly.map((w) => {
          const total = w.labor + w.expenses;
          return (
            <div key={w.weekStart} className="flex h-full min-w-0 flex-1 flex-col justify-end" title={wt('finance.weekOfTip', { w: w.weekStart, m: fmtMoney(total, f.currency) })}>
              <div className="w-full rounded-t-[2px] bg-[var(--w-chart-3)]" style={{ height: `${(w.expenses / max) * 100}%` }} />
              <div className="w-full bg-[var(--w-chart-1)]" style={{ height: `${(w.labor / max) * 100}%`, minHeight: total ? 2 : 0 }} />
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-[var(--w-text-3)]"><span>{f.weekly[0]?.weekStart}</span><span>{wt('finance.thisWeekLc')}</span></div>
    </div>
  );
}

function Table({ head, rows, empty }: { head: string[]; rows: ReactNode[][]; empty: string }) {
  if (!rows.length) return <p className="py-2 text-[13px] text-[var(--w-text-3)]">{empty}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-[13px]">
        <thead><tr className="border-b border-[var(--w-border)] text-left text-[12px] text-[var(--w-text-3)]">{head.map((h, i) => <th key={h} className={cn('py-1.5 pr-3 font-medium', i > 0 && 'text-right')}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className="border-b border-[var(--w-border)] last:border-0">{r.map((c, j) => <td key={j} className={cn('py-1.5 pr-3 align-top', j > 0 && 'text-right tabular-nums')}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function OverviewTab({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const inv = useInvalidate(pid);
  const q = useQuery({ queryKey: s4Keys.summary(pid), queryFn: () => s4Api.summary(pid) });
  const settings = useQuery({ queryKey: s4Keys.settings(pid), queryFn: () => s4Api.settings(pid) });
  const [form, setForm] = useState<{ currency: Currency; contractValue: string; budgetTotal: string } | null>(null);
  const cur = settings.data;
  const f = form ?? (cur ? { currency: (cur.currency ?? 'VND') as Currency, contractValue: cur.contractValue?.toString() ?? '', budgetTotal: cur.budgetTotal?.toString() ?? '' } : null);
  const saveSettings = useMutation({
    mutationFn: () => s4Api.updateSettings(pid, { currency: f!.currency, contractValue: num(f!.contractValue), budgetTotal: num(f!.budgetTotal) }),
    onSuccess: () => { setForm(null); inv(); toast.success(wt('finance.settingsSaved')); },
    onError: (e) => toast.error(workError(e)),
  });
  const [exporting, setExporting] = useState(false);
  if (q.isLoading || !f) return <PageLoading rows={4} />;
  if (q.error || !q.data) return <EmptyState title={wt('finance.loadFailed')} body={workError(q.error)} />;
  const d = q.data;
  const s = d.summary;
  const pct = s.percentUsed;
  const tone = pct === null ? undefined : pct >= 100 ? 'red' : pct >= 80 ? 'orange' : 'green';
  return (
    <div className="space-y-4">
      <NoInvoiceNotice />
      {s.alerts.length > 0 && (
        <div className="space-y-1.5" role="status" data-testid="budget-alerts">
          {s.alerts.map((a) => (
            <p key={a} className="flex items-center gap-2 rounded-[8px] border px-3 py-2 text-[13px]" style={{ borderColor: `color-mix(in srgb, var(--w-${a === 'WARN' ? 'orange' : 'red'}) 40%, transparent)`, background: `color-mix(in srgb, var(--w-${a === 'WARN' ? 'orange' : 'red'}) 9%, transparent)` }}>
              <AlertTriangle size={14} className="shrink-0" style={{ color: `var(--w-${a === 'WARN' ? 'orange' : 'red'})` }} />
              {a === 'OVER' ? wt('finance.alertOver', { pct }) : a === 'WARN' ? wt('finance.alertWarn', { pct }) : wt('finance.alertForecast', { eac: fmtMoney(s.eac, d.currency), bac: fmtMoney(s.bac, d.currency) })}
            </p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Kpi label={wt('finance.bac')} value={fmtMoney(s.bac, d.currency)} sub={d.budgetTotal === null && s.bac !== null ? wt('finance.sumLines') : wt('finance.setBelow')} />
        <Kpi label={wt('finance.ac')} value={fmtMoney(s.actual, d.currency)} tone={tone} sub={wt('finance.laborOther', { a: fmtMoney(s.laborCost, d.currency), b: fmtMoney(s.expenseCost, d.currency) })} />
        <Kpi label={wt('finance.remaining')} value={fmtMoney(s.remaining, d.currency)} tone={s.remaining !== null && s.remaining < 0 ? 'red' : undefined} />
        <Kpi label={wt('finance.burnRate')} value={fmtMoney(s.burnRatePerWeek, d.currency)} sub={wt('finance.last28')} />
        <Kpi label={wt('finance.eac')} value={fmtMoney(s.eac, d.currency)} tone={s.eac !== null && s.bac !== null && s.eac > s.bac ? 'red' : undefined} sub={s.eacMethod === 'CPI' ? wt('finance.cpiSub', { cpi: s.cpi, pct: Math.round((s.percentComplete ?? 0) * 100) }) : s.eacMethod === 'BURN_RATE' ? wt('finance.burnTo', { d: d.plannedEnd }) : wt('finance.notEnoughData')} />
      </div>
      <BudgetBar pct={pct} />
      <details className="rounded-[8px] border border-[var(--w-border)] px-3 py-2 text-[12.5px] text-[var(--w-text-2)]">
        <summary className="cursor-pointer font-medium text-[var(--w-text)]">{wt('finance.howComputed')}</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>{wt('finance.fAc')}</li>
          <li>{wt('finance.fBac')}</li>
          <li>{wt('finance.fPct')}</li>
          <li>{d.formula}</li>
          <li>{wt('finance.fBurn')}</li>
        </ul>
        <p className="mt-2">{wt('finance.hoursLine', { a: fmtHours(d.approvedMinutes), unpriced: d.unpricedMinutes ? wt('finance.unpriced', { t: fmtHours(d.unpricedMinutes) }) : '', b: fmtHours(d.pendingMinutes), n: d.pendingTimesheets })}</p>
      </details>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <WeeklyBars f={d} />
        <div className="w-card p-4">
          <h3 className="w-section-title mb-2">{wt('finance.payments')}</h3>
          <Table head={[wt('common.status'), wt('finance.amount')]} empty={wt('finance.noPaymentsDot')} rows={(['planned', 'due', 'invoiced', 'paid'] as const).map((k) => [PAYMENT_STATUS_LABEL[k.toUpperCase() as PaymentStatus], fmtMoney(d.payments[k], d.currency)])} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="w-card p-4"><h3 className="w-section-title mb-2">{wt('finance.byStage')}</h3>
          <Table head={[wt('finance.stage'), wt('finance.budget'), wt('finance.actual')]} empty={wt('finance.noStageCosts')} rows={d.byStage.map((r) => [r.label, fmtMoney(r.budget, d.currency), <span key="a" style={r.budget && r.actual > r.budget ? { color: 'var(--w-red-text)' } : undefined}>{fmtMoney(r.actual, d.currency)}</span>])} />
        </div>
        <div className="w-card p-4"><h3 className="w-section-title mb-2">{wt('finance.byCategory')}</h3>
          <Table head={[wt('finance.category'), wt('finance.budget'), wt('finance.actual')]} empty="—" rows={d.byCategory.map((r) => [cap(r.category), fmtMoney(r.budget, d.currency), fmtMoney(r.actual, d.currency)])} />
        </div>
      </div>
      <div className="w-card p-4"><h3 className="w-section-title mb-2">{wt('finance.byPerson')}</h3>
        <Table head={[wt('finance.person'), wt('finance.hoursH'), wt('finance.cost')]} empty={wt('finance.noApprovedTs')} rows={d.byPerson.map((p) => [p.name, fmtHours(p.minutes), fmtMoney(p.cost, d.currency)])} />
      </div>

      <div className="w-card p-4">
        <h3 className="w-section-title mb-3">{wt('common.settings')}</h3>
        <div className="grid gap-x-3 sm:grid-cols-3">
          <Field label={wt('finance.currency')}>
            <Select aria-label={wt('finance.currency')} value={f.currency} onChange={(e) => setForm({ ...f, currency: e.target.value as Currency })} data-testid="fin-currency">
              <option value="VND">{wt('finance.vnd')}</option>
              <option value="USD">{wt('finance.usd')}</option>
            </Select>
          </Field>
          <Field label={wt('finance.contractValue')} hint={wt('finance.contractHint')}><input className="w-input" inputMode="decimal" value={f.contractValue} onChange={(e) => setForm({ ...f, contractValue: e.target.value })} data-testid="fin-contract" /></Field>
          <Field label={wt('finance.totalBudget')} hint={wt('finance.totalBudgetHint')}><input className="w-input" inputMode="decimal" value={f.budgetTotal} onChange={(e) => setForm({ ...f, budgetTotal: e.target.value })} data-testid="fin-budget" /></Field>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="w-btn w-btn-primary" disabled={!form || saveSettings.isPending} onClick={() => saveSettings.mutate()} data-testid="fin-save-settings">{saveSettings.isPending && <Spinner size={12} />}{wt('finance.saveSettings')}</button>
          <button
            type="button" className="w-btn" disabled={exporting} data-testid="fin-export"
            onClick={async () => { setExporting(true); try { const r = await s4Api.exportXlsx(pid); save(r.blob, r.fileName); toast.success(wt('finance.exportDownloaded')); } catch (e) { toast.error(workError(e)); } finally { setExporting(false); } }}
          >{exporting ? <Spinner size={12} /> : <Download size={14} />}{wt('finance.exportAccounting')}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Timesheet ───────────────────────────────────────────────────

function WeekGrid({ v }: { v: Awaited<ReturnType<typeof s4Api.week>> }) {
  const dayLabel = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString(wfmt.intl(), { weekday: 'short', day: 'numeric', timeZone: 'UTC' });
  if (!v.rows.length) return <p className="py-4 text-[13px] text-[var(--w-text-3)]">{wt('finance.noTimeWeek')}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-[13px]" data-testid="week-grid">
        <thead>
          <tr className="border-b border-[var(--w-border)] text-[12px] text-[var(--w-text-3)]">
            <th className="py-1.5 pr-3 text-left font-medium">{wt('common.issue')}</th>
            {v.days.map((d) => <th key={d} className="w-[62px] py-1.5 text-right font-medium">{dayLabel(d)}</th>)}
            <th className="w-[64px] py-1.5 pl-2 text-right font-medium">{wt('common.total')}</th>
          </tr>
        </thead>
        <tbody>
          {v.rows.map((r) => (
            <tr key={r.issueId} className="border-b border-[var(--w-border)]">
              <td className="max-w-[260px] py-1.5 pr-3"><span className="mr-1.5 font-mono text-[12px] text-[var(--w-text-3)]">{r.key}</span><span className="[overflow-wrap:anywhere]">{r.title}</span></td>
              {v.days.map((d) => <td key={d} className="py-1.5 text-right tabular-nums">{r.byDay[d] ? fmtHours(r.byDay[d]) : <span className="text-[var(--w-text-3)]">·</span>}</td>)}
              <td className="py-1.5 pl-2 text-right font-medium tabular-nums">{fmtHours(r.totalMin)}</td>
            </tr>
          ))}
          <tr className="font-medium">
            <td className="py-1.5 pr-3">{wt('common.total')}</td>
            {v.days.map((d) => <td key={d} className="py-1.5 text-right tabular-nums">{v.byDay[d] ? fmtHours(v.byDay[d]) : ''}</td>)}
            <td className="py-1.5 pl-2 text-right tabular-nums" data-testid="week-total">{fmtHours(v.totalMin)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function StatusLine({ t }: { t: Timesheet | null }) {
  if (!t) return <Pill tone="neutral">{wt('finance.notSubmitted')}</Pill>;
  return <Pill tone={TS_TONE[t.status]}>{TIMESHEET_STATUS_LABEL[t.status]}</Pill>;
}

function TimesheetTab({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const inv = useInvalidate(pid);
  const [week, setWeek] = useState(() => mondayOf(todayVn()));
  const [note, setNote] = useState('');
  const q = useQuery({ queryKey: s4Keys.week(pid, week), queryFn: () => s4Api.week(pid, week) });
  const submit = useMutation({ mutationFn: () => s4Api.submitWeek(pid, week, note || null), onSuccess: () => { setNote(''); inv(); toast.success(wt('finance.weekSubmitted')); }, onError: (e) => toast.error(workError(e)) });
  const withdraw = useMutation({ mutationFn: () => s4Api.withdrawWeek(pid, q.data!.timesheet!.id), onSuccess: () => { inv(); toast.success(wt('finance.withdrawn')); }, onError: (e) => toast.error(workError(e)) });
  const v = q.data;
  const isThisWeek = week === mondayOf(todayVn());
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <button type="button" className="w-btn w-btn-sm w-btn-icon" aria-label={wt('finance.prevWeek')} onClick={() => setWeek(addDays(week, -7))}><ArrowLeft size={14} /></button>
          <button type="button" className="w-btn w-btn-sm" disabled={isThisWeek} onClick={() => setWeek(mondayOf(todayVn()))}>{wt('finance.thisWeek')}</button>
          <button type="button" className="w-btn w-btn-sm w-btn-icon" aria-label={wt('finance.nextWeek')} disabled={isThisWeek} onClick={() => setWeek(addDays(week, 7))}><ArrowRight size={14} /></button>
        </div>
        <div className="flex items-center gap-1.5 text-[13.5px] font-medium"><CalendarDays size={14} className="text-[var(--w-text-3)]" />{wt('finance.weekRange', { a: formatDate(week), b: formatDate(addDays(week, 6)) })}</div>
        <div className="ml-auto flex items-center gap-2">{v && <StatusLine t={v.timesheet} />}{v?.locked && <span className="flex items-center gap-1 text-[12px] text-[var(--w-text-3)]"><Lock size={12} />{wt('finance.locked')}</span>}</div>
      </div>
      {q.isLoading ? <PageLoading rows={3} /> : !v ? <EmptyState title={wt('finance.loadWeekFailed')} body={workError(q.error)} /> : (
        <div className="w-card p-4">
          <WeekGrid v={v} />
          {v.timesheet?.status === 'RETURNED' && v.timesheet.returnReason && <p className="mt-3 rounded-[8px] border border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)] px-3 py-2 text-[13px]"><b>{wt('finance.returnedB')}</b> {v.timesheet.returnReason}</p>}
          {v.timesheet?.status === 'REOPENED' && v.timesheet.reopenReason && <p className="mt-3 rounded-[8px] border border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)] px-3 py-2 text-[13px]"><b>{wt('finance.reopenedB')}</b> {v.timesheet.reopenReason}</p>}
          {v.locked && <p className="mt-3 text-[12.5px] text-[var(--w-text-3)]">{v.timesheet?.status === 'APPROVED' ? wt('finance.approvedLocked') : wt('finance.waitingLocked')}</p>}
          <div className="mt-3 flex flex-wrap items-end gap-2">
            {v.can.submit && (
              <>
                <input className="w-input min-w-0 flex-1 sm:max-w-[360px]" placeholder={wt('finance.noteApprover')} value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} />
                <button type="button" className="w-btn w-btn-primary" disabled={submit.isPending} onClick={() => submit.mutate()} data-testid="ts-submit">{submit.isPending ? <Spinner size={12} /> : <Send size={14} />}{wt('finance.submitWeek')}</button>
              </>
            )}
            {v.can.withdraw && <button type="button" className="w-btn" disabled={withdraw.isPending} onClick={() => withdraw.mutate()} data-testid="ts-withdraw"><Undo2 size={14} />{wt('finance.withdraw')}</button>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Approvals ───────────────────────────────────────────────────

function ReviewDialog({ config, ts, onClose }: { config: ProjectConfig; ts: Timesheet | null; onClose: () => void }) {
  const pid = config.id;
  const inv = useInvalidate(pid);
  const q = useQuery({ queryKey: s4Keys.week(pid, ts?.weekStart ?? '', ts?.userId), queryFn: () => s4Api.week(pid, ts!.weekStart, ts!.userId), enabled: !!ts });
  const [reason, setReason] = useState('');
  const [mode, setMode] = useState<'view' | 'return' | 'reopen'>('view');
  const done = (msg: string) => { inv(); toast.success(msg); setReason(''); setMode('view'); onClose(); };
  const approve = useMutation({ mutationFn: () => s4Api.approveWeek(pid, ts!.id), onSuccess: (r) => done(r.unpricedMinutes ? wt('finance.approvedNoRate', { t: fmtHours(r.unpricedMinutes) }) : wt('finance.tsApproved')), onError: (e) => toast.error(workError(e)) });
  const ret = useMutation({ mutationFn: () => s4Api.returnWeek(pid, ts!.id, reason), onSuccess: () => done(wt('finance.returnedToPerson')), onError: (e) => toast.error(workError(e)) });
  const reopen = useMutation({ mutationFn: () => s4Api.reopenWeek(pid, ts!.id, reason), onSuccess: () => done(wt('finance.weekReopened')), onError: (e) => toast.error(workError(e)) });
  const v = q.data;
  return (
    <Dialog open={!!ts} onClose={onClose} width={860} title={ts ? wt('finance.dlgTitle', { name: ts.userName, d: formatDate(ts.weekStart) }) : ''}
      footer={v && (
        mode === 'view' ? (
          <>
            {v.can.reopen && <button type="button" className="w-btn" onClick={() => setMode('reopen')} data-testid="ts-reopen"><Unlock size={14} />{wt('finance.reopenDots')}</button>}
            {v.can.review && <button type="button" className="w-btn" onClick={() => setMode('return')} data-testid="ts-return"><RotateCcw size={14} />{wt('finance.returnDots')}</button>}
            {v.can.review && (() => {
              // CTW-38: tuần chưa hết ⇒ chưa duyệt được (duyệt sẽ khoá cả những ngày chưa tới).
              const notOver = v.can.approve === false;
              return (
                <button type="button" className="w-btn w-btn-primary" disabled={approve.isPending || notOver} title={notOver ? wt('finance.endsOn', { d: formatDate(v.weekEnd) }) : undefined} onClick={() => approve.mutate()} data-testid="ts-approve">
                  {approve.isPending ? <Spinner size={12} /> : <CheckCircle2 size={14} />}{notOver ? wt('finance.approveAfter', { d: formatDate(v.weekEnd) }) : wt('finance.approve')}
                </button>
              );
            })()}
          </>
        ) : (
          <>
            <button type="button" className="w-btn" onClick={() => setMode('view')}>{wt('common.back')}</button>
            <button type="button" className={cn('w-btn', mode === 'reopen' ? 'w-btn-danger-solid' : 'w-btn-primary')} disabled={!reason.trim() || ret.isPending || reopen.isPending} onClick={() => (mode === 'return' ? ret.mutate() : reopen.mutate())} data-testid="ts-confirm-reason">
              {mode === 'return' ? wt('finance.returnWithReason') : wt('finance.reopenWeek')}
            </button>
          </>
        )
      )}
    >
      {!v ? <PageLoading rows={3} /> : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2"><StatusLine t={v.timesheet} />{ts?.note && <span className="text-[13px] text-[var(--w-text-2)]">“{ts.note}”</span>}</div>
          <WeekGrid v={v} />
          {mode !== 'view' && (
            <Field label={mode === 'return' ? wt('finance.whyReturn') : wt('finance.whyReopen')}>
              <textarea className="w-input" rows={2} autoFocus value={reason} onChange={(e) => setReason(e.target.value)} maxLength={2000} data-testid="ts-reason" />
            </Field>
          )}
        </div>
      )}
    </Dialog>
  );
}

function ApprovalsTab({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const [status, setStatus] = useState<TimesheetStatus | ''>('SUBMITTED');
  const q = useQuery({ queryKey: s4Keys.timesheets(pid, status), queryFn: () => s4Api.timesheets(pid, status || undefined) });
  const [open, setOpen] = useState<Timesheet | null>(null);
  const manage = !!config.permissions.manageFinance;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-seg" role="group" aria-label={wt('common.status')}>
          {(['SUBMITTED', 'APPROVED', 'RETURNED', ''] as const).map((s) => <button key={s || 'all'} type="button" aria-pressed={status === s} onClick={() => setStatus(s)}>{s ? TIMESHEET_STATUS_LABEL[s] : wt('common.all')}</button>)}
        </div>
        <span className="text-[12.5px] text-[var(--w-text-3)]">{q.data?.access.review === 'TEAM' ? wt('finance.teamsYouLead') : wt('finance.everyoneProject')}</span>
      </div>
      {q.isLoading ? <PageLoading rows={3} /> : !q.data?.items.length ? <EmptyState title={status === 'SUBMITTED' ? wt('finance.nothingWaiting') : wt('finance.noTimesheets')} body={wt('finance.submittedAppear')} /> : (
        <ul className="w-card divide-y divide-[var(--w-border)]" data-testid="ts-queue">
          {q.data.items.map((t) => (
            <li key={t.id}>
              <button type="button" className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-left hover:bg-[var(--w-hover)]" onClick={() => setOpen(t)}>
                <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">{t.userName}</span>
                <span className="text-[12.5px] text-[var(--w-text-3)]">{wt('finance.weekOfLc', { d: formatDate(t.weekStart) })}</span>
                <span className="w-[64px] text-right text-[13px] tabular-nums">{fmtHours(t.totalMinutes)}</span>
                {manage && t.approvedCost !== undefined && t.approvedCost !== null && <span className="text-[12.5px] tabular-nums text-[var(--w-text-2)]">{t.approvedCost.toLocaleString(wfmt.intl())}</span>}
                <StatusLine t={t} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <ReviewDialog config={config} ts={open} onClose={() => setOpen(null)} />
    </div>
  );
}

// ─── Rates ───────────────────────────────────────────────────────

const SCOPE_LABEL: Record<RateScope, string> = { get DEFAULT() { return wt('finance.scDefault'); }, get ROLE() { return wt('finance.scRole'); }, get TEAM() { return wt('finance.scTeam'); }, get USER() { return wt('finance.person'); } };

function RatesTab({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const qc = useQueryClient();
  const q = useQuery({ queryKey: s4Keys.rates(pid), queryFn: () => s4Api.rates(pid) });
  const teams = useWorkspaceTeams(config.workspace.id);
  const [f, setF] = useState<{ scope: RateScope; target: string; rate: string; from: string; note: string }>({ scope: 'DEFAULT', target: '', rate: '', from: '', note: '' });
  const add = useMutation({
    mutationFn: () => s4Api.createRate(pid, {
      scope: f.scope, hourlyRate: Number(f.rate), effectiveFrom: f.from || null, note: f.note || null,
      ...(f.scope === 'ROLE' ? { projectRole: f.target } : f.scope === 'TEAM' ? { teamId: Number(f.target) } : f.scope === 'USER' ? { userId: Number(f.target) } : {}),
    }),
    onSuccess: (r) => { qc.setQueryData(s4Keys.rates(pid), r); qc.invalidateQueries({ queryKey: s4Keys.summary(pid) }); setF({ ...f, rate: '', note: '' }); toast.success(wt('finance.rateAdded')); },
    onError: (e) => toast.error(workError(e)),
  });
  const del = useMutation({ mutationFn: (id: number) => s4Api.deleteRate(pid, id), onSuccess: (r) => qc.setQueryData(s4Keys.rates(pid), r), onError: (e) => toast.error(workError(e)) });
  const staff = config.members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER');
  const needsTarget = f.scope !== 'DEFAULT';
  return (
    <div className="space-y-4">
      <p className="text-[13px] text-[var(--w-text-2)]">{wt('finance.ratesA')} <b>{q.data?.currency ?? '…'}</b>. {wt('finance.ratesB')} <b>{wt('finance.ratesChain')}</b>{wt('finance.ratesC')}</p>
      <div className="w-card p-4">
        <div className="grid gap-x-3 sm:grid-cols-[150px_minmax(0,1fr)_130px_150px]">
          <Field label={wt('finance.appliesTo')}>
            <Select aria-label={wt('finance.appliesTo')} value={f.scope} onChange={(e) => setF({ ...f, scope: e.target.value as RateScope, target: '' })} data-testid="rate-scope">
              {(Object.keys(SCOPE_LABEL) as RateScope[]).map((s) => <option key={s} value={s}>{SCOPE_LABEL[s]}</option>)}
            </Select>
          </Field>
          <Field label={needsTarget ? SCOPE_LABEL[f.scope] : wt('finance.everyone')}>
            {f.scope === 'DEFAULT' ? <div className="flex h-9 items-center text-[13px] text-[var(--w-text-3)]">{wt('finance.everyoneNoRate')}</div>
              : f.scope === 'ROLE' ? <Select aria-label={wt('common.role')} value={f.target} onChange={(e) => setF({ ...f, target: e.target.value })}><option value="">{wt('finance.pickRole')}</option><option value="ADMIN">{wt('common.admin')}</option><option value="MEMBER">{wt('common.member')}</option></Select>
                : f.scope === 'TEAM' ? <Select aria-label={wt('finance.scTeam')} value={f.target} onChange={(e) => setF({ ...f, target: e.target.value })} data-testid="rate-team"><option value="">{wt('finance.pickTeam')}</option>{(teams.data ?? []).map((t) => <option key={t.id} value={t.id}>{t.key} · {t.name}</option>)}</Select>
                  : <Select aria-label={wt('finance.person')} value={f.target} onChange={(e) => setF({ ...f, target: e.target.value })}><option value="">{wt('finance.pickPerson')}</option>{staff.map((m) => <option key={m.id} value={m.id}>{userName(m)}</option>)}</Select>}
          </Field>
          <Field label={wt('finance.rateHour')}><input className="w-input" inputMode="decimal" value={f.rate} onChange={(e) => setF({ ...f, rate: e.target.value })} data-testid="rate-value" /></Field>
          <Field label={wt('finance.validFromOpt')}><input className="w-input" type="date" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /></Field>
        </div>
        <button type="button" className="w-btn w-btn-primary" disabled={!f.rate || Number.isNaN(Number(f.rate)) || (needsTarget && !f.target) || add.isPending} onClick={() => add.mutate()} data-testid="rate-add"><Plus size={14} />{wt('finance.addRate')}</button>
      </div>
      {q.isLoading ? <PageLoading rows={3} /> : (
        <div className="w-card p-4">
          <Table head={[wt('finance.appliesTo'), wt('finance.rateHour'), wt('finance.validFrom'), '']} empty={wt('finance.noRates')}
            rows={(q.data?.rates ?? []).map((r) => [
              <span key="s">{SCOPE_LABEL[r.scope]}{r.scope === 'ROLE' ? ` · ${r.projectRole === 'ADMIN' ? wt('common.admin') : wt('common.member')}` : r.team ? ` · ${r.team.key}` : r.user ? ` · ${userName(r.user)}` : ''}</span>,
              fmtMoney(r.hourlyRate, q.data!.currency), r.effectiveFrom ? formatDate(r.effectiveFrom) : wt('finance.always'),
              <button key="d" type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" aria-label={wt('finance.removeRate')} onClick={() => del.mutate(r.id)}><Trash2 size={13} /></button>,
            ])} />
        </div>
      )}
    </div>
  );
}

// ─── Budget & costs ──────────────────────────────────────────────

const BUDGET_CATS: BudgetCategory[] = ['LABOR', 'EQUIPMENT', 'SERVICES', 'OTHER'];
const EXPENSE_CATS: ExpenseCategory[] = ['EQUIPMENT', 'SERVICES', 'LICENSE', 'TRAVEL', 'OTHER'];
const cap = (s: string) => Object.fromEntries(wt('finance.catLabels').split('|').map((x) => x.split(':')))[s] ?? s[0] + s.slice(1).toLowerCase();

function BudgetTab({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const inv = useInvalidate(pid);
  const sum = useQuery({ queryKey: s4Keys.summary(pid), queryFn: () => s4Api.summary(pid) });
  const exp = useQuery({ queryKey: s4Keys.expenses(pid), queryFn: () => s4Api.expenses(pid) });
  const stages = useQuery({ queryKey: workStudioKeys.stages(pid), queryFn: () => workStudioApi.stages(pid), enabled: !!config.modules?.stages });
  const [b, setB] = useState({ name: '', category: 'LABOR' as BudgetCategory, stageId: '', amount: '' });
  const [e, setE] = useState({ spentOn: todayVn(), category: 'EQUIPMENT' as ExpenseCategory, description: '', vendor: '', amount: '', budgetLineId: '', stageId: '' });
  const [confirm, setConfirm] = useState<{ kind: 'line' | 'expense'; id: number } | null>(null);
  const addLine = useMutation({ mutationFn: () => s4Api.createBudgetLine(pid, { name: b.name, category: b.category, stageId: b.stageId ? Number(b.stageId) : null, amount: Number(b.amount) }), onSuccess: () => { setB({ ...b, name: '', amount: '' }); inv(); toast.success(wt('finance.lineAdded')); }, onError: (x) => toast.error(workError(x)) });
  const addExp = useMutation({ mutationFn: () => s4Api.createExpense(pid, { spentOn: e.spentOn, category: e.category, description: e.description, vendor: e.vendor || null, amount: Number(e.amount), budgetLineId: e.budgetLineId ? Number(e.budgetLineId) : null, stageId: e.stageId ? Number(e.stageId) : null }), onSuccess: () => { setE({ ...e, description: '', vendor: '', amount: '' }); inv(); toast.success(wt('finance.costRecorded')); }, onError: (x) => toast.error(workError(x)) });
  const del = useMutation({ mutationFn: (c: { kind: 'line' | 'expense'; id: number }) => (c.kind === 'line' ? s4Api.deleteBudgetLine(pid, c.id) : s4Api.deleteExpense(pid, c.id)), onSuccess: () => { setConfirm(null); inv(); }, onError: (x) => toast.error(workError(x)) });
  const cur = sum.data?.currency ?? null;
  const stageOpts = (stages.data ?? []).map((s) => <option key={s.id} value={s.id}>{s.n}. {s.name}</option>);
  return (
    <div className="space-y-4">
      <div className="w-card p-4">
        <h3 className="w-section-title mb-1">{wt('finance.budgetLines')}</h3>
        <p className="mb-3 text-[12.5px] text-[var(--w-text-3)]">{wt('finance.budgetLinesDesc')}</p>
        <div className="grid gap-x-3 sm:grid-cols-[minmax(0,1fr)_130px_170px_130px]">
          <Field label={wt('common.name')}><input className="w-input" value={b.name} onChange={(x) => setB({ ...b, name: x.target.value })} maxLength={160} data-testid="bl-name" /></Field>
          <Field label={wt('finance.category')}><Select aria-label={wt('finance.category')} value={b.category} onChange={(x) => setB({ ...b, category: x.target.value as BudgetCategory })}>{BUDGET_CATS.map((c) => <option key={c} value={c}>{cap(c)}</option>)}</Select></Field>
          <Field label={wt('finance.stage')}><Select aria-label={wt('finance.stage')} value={b.stageId} onChange={(x) => setB({ ...b, stageId: x.target.value })}><option value="">{wt('finance.wholeProject')}</option>{stageOpts}</Select></Field>
          <Field label={wt('finance.amount')}><input className="w-input" inputMode="decimal" value={b.amount} onChange={(x) => setB({ ...b, amount: x.target.value })} data-testid="bl-amount" /></Field>
        </div>
        <button type="button" className="w-btn w-btn-primary" disabled={!b.name.trim() || !b.amount || Number.isNaN(Number(b.amount)) || addLine.isPending} onClick={() => addLine.mutate()} data-testid="bl-add"><Plus size={14} />{wt('finance.addBudgetLine')}</button>
        <div className="mt-3">
          <Table head={[wt('finance.line'), wt('finance.category'), wt('finance.amount'), '']} empty={wt('finance.noLines')}
            rows={(sum.data?.budgetLines ?? []).map((l) => [l.name, cap(l.category), fmtMoney(l.amount, cur), <button key="d" type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" aria-label={wt('finance.removeLine')} onClick={() => setConfirm({ kind: 'line', id: l.id })}><Trash2 size={13} /></button>])} />
        </div>
      </div>
      <div className="w-card p-4">
        <h3 className="w-section-title mb-1">{wt('finance.otherCosts')}</h3>
        <p className="mb-3 text-[12.5px] text-[var(--w-text-3)]">{wt('finance.otherCostsDesc')}</p>
        <div className="grid gap-x-3 sm:grid-cols-[140px_130px_minmax(0,1fr)]">
          <Field label={wt('finance.date')}><input className="w-input" type="date" value={e.spentOn} onChange={(x) => setE({ ...e, spentOn: x.target.value })} /></Field>
          <Field label={wt('finance.category')}><Select aria-label={wt('finance.costCategory')} value={e.category} onChange={(x) => setE({ ...e, category: x.target.value as ExpenseCategory })}>{EXPENSE_CATS.map((c) => <option key={c} value={c}>{cap(c)}</option>)}</Select></Field>
          <Field label={wt('common.description')}><input className="w-input" value={e.description} onChange={(x) => setE({ ...e, description: x.target.value })} maxLength={500} data-testid="ex-desc" /></Field>
        </div>
        <div className="grid gap-x-3 sm:grid-cols-[minmax(0,1fr)_130px_minmax(0,1fr)_minmax(0,1fr)]">
          <Field label={wt('finance.vendor')}><input className="w-input" value={e.vendor} onChange={(x) => setE({ ...e, vendor: x.target.value })} maxLength={160} /></Field>
          <Field label={wt('finance.amount')}><input className="w-input" inputMode="decimal" value={e.amount} onChange={(x) => setE({ ...e, amount: x.target.value })} data-testid="ex-amount" /></Field>
          <Field label={wt('finance.budgetLine')}><Select aria-label={wt('finance.budgetLine')} value={e.budgetLineId} onChange={(x) => setE({ ...e, budgetLineId: x.target.value })}><option value="">{wt('common.none')}</option>{(sum.data?.budgetLines ?? []).map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</Select></Field>
          <Field label={wt('finance.stage')}><Select aria-label={wt('finance.costStage')} value={e.stageId} onChange={(x) => setE({ ...e, stageId: x.target.value })}><option value="">{wt('common.none')}</option>{stageOpts}</Select></Field>
        </div>
        <button type="button" className="w-btn w-btn-primary" disabled={!e.description.trim() || !e.amount || Number.isNaN(Number(e.amount)) || addExp.isPending} onClick={() => addExp.mutate()} data-testid="ex-add"><Plus size={14} />{wt('finance.recordCost')}</button>
        <div className="mt-3">
          <Table head={[wt('finance.cost'), wt('finance.date'), wt('finance.amount'), '']} empty={wt('finance.noOtherCosts')}
            rows={(exp.data ?? []).map((x) => [<span key="n">{x.description}<span className="text-[var(--w-text-3)]"> · {cap(x.category)}{x.vendor ? ` · ${x.vendor}` : ''}</span></span>, formatDate(x.spentOn), fmtMoney(x.amount, cur), <button key="d" type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" aria-label={wt('finance.removeCost')} onClick={() => setConfirm({ kind: 'expense', id: x.id })}><Trash2 size={13} /></button>])} />
        </div>
      </div>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => confirm && del.mutate(confirm)} pending={del.isPending} title={confirm?.kind === 'line' ? wt('finance.removeLineQ') : wt('finance.removeCostQ')} body={wt('finance.auditNote')} confirmLabel={wt('common.remove')} />
    </div>
  );
}

// ─── Payments ────────────────────────────────────────────────────

const NEXT: Record<PaymentStatus, PaymentStatus[]> = { PLANNED: ['DUE', 'INVOICED', 'PAID'], DUE: ['INVOICED', 'PAID', 'PLANNED'], INVOICED: ['PAID', 'DUE'], PAID: [] };
const TRIGGER_LABEL: Record<PaymentTrigger, string> = { get MANUAL() { return wt('finance.trManual'); }, get UAT() { return wt('finance.trUat'); }, get STAGE_GATE() { return wt('finance.trGate'); } };

function PaymentsTab({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const qc = useQueryClient();
  const q = useQuery({ queryKey: s4Keys.payments(pid), queryFn: () => s4Api.payments(pid) });
  const versions = useQuery({ queryKey: wk.versions(pid), queryFn: () => workApi.versions(pid) });
  const stages = useQuery({ queryKey: workStudioKeys.stages(pid), queryFn: () => workStudioApi.stages(pid), enabled: !!config.modules?.stages });
  const [f, setF] = useState({ name: '', mode: 'percent' as 'percent' | 'amount', value: '', trigger: 'MANUAL' as PaymentTrigger, versionId: '', stageId: '', dueDate: '', clientVisible: true });
  const [invoiceFor, setInvoiceFor] = useState<{ m: PaymentMilestone; to: PaymentStatus } | null>(null);
  const [invoice, setInvoice] = useState('');
  const setData = (r: Awaited<ReturnType<typeof s4Api.payments>>) => { qc.setQueryData(s4Keys.payments(pid), r); qc.invalidateQueries({ queryKey: s4Keys.summary(pid) }); };
  const add = useMutation({
    mutationFn: () => s4Api.createPayment(pid, {
      name: f.name, trigger: f.trigger, clientVisible: f.clientVisible, dueDate: f.dueDate || null,
      versionId: f.versionId ? Number(f.versionId) : null, stageId: f.stageId ? Number(f.stageId) : null,
      ...(f.mode === 'percent' ? { percent: Number(f.value) } : { amount: Number(f.value) }),
    }),
    onSuccess: (r) => { setData(r as Awaited<ReturnType<typeof s4Api.payments>>); setF({ ...f, name: '', value: '' }); toast.success(wt('finance.payAdded')); },
    onError: (e) => toast.error(workError(e)),
  });
  const status = useMutation({
    mutationFn: (v: { m: PaymentMilestone; to: PaymentStatus; invoiceNumber?: string }) => s4Api.setPaymentStatus(pid, v.m.number, v.to, v.invoiceNumber ?? null),
    onSuccess: (r) => { setData(r as Awaited<ReturnType<typeof s4Api.payments>>); setInvoiceFor(null); setInvoice(''); },
    onError: (e) => toast.error(workError(e)),
  });
  const share = useMutation({ mutationFn: (m: PaymentMilestone) => s4Api.updatePayment(pid, m.number, { clientVisible: !m.clientVisible }), onSuccess: (r) => setData(r as Awaited<ReturnType<typeof s4Api.payments>>), onError: (e) => toast.error(workError(e)) });
  const del = useMutation({ mutationFn: (m: PaymentMilestone) => s4Api.deletePayment(pid, m.number), onSuccess: (r) => setData(r as Awaited<ReturnType<typeof s4Api.payments>>), onError: (e) => toast.error(workError(e)) });
  const d = q.data;
  return (
    <div className="space-y-4">
      <NoInvoiceNotice />
      <div className="w-card p-4">
        <h3 className="w-section-title mb-3">{wt('finance.newPayment')}</h3>
        <div className="grid gap-x-3 sm:grid-cols-[minmax(0,1fr)_150px_130px_150px]">
          <Field label={wt('common.name')}><input className="w-input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} maxLength={160} placeholder={wt('finance.payNamePh')} data-testid="pay-name" /></Field>
          <Field label={wt('finance.as')}><Select aria-label={wt('finance.amountType')} value={f.mode} onChange={(e) => setF({ ...f, mode: e.target.value as 'percent' | 'amount' })}><option value="percent">{wt('finance.pctContract')}</option><option value="amount">{wt('finance.fixedAmount')}</option></Select></Field>
          <Field label={f.mode === 'percent' ? wt('finance.percent') : `${wt('finance.amount')}${d ? ` (${d.currency})` : ''}`}><input className="w-input" inputMode="decimal" value={f.value} onChange={(e) => setF({ ...f, value: e.target.value })} data-testid="pay-value" /></Field>
          <Field label={wt('common.dueDate')}><input className="w-input" type="date" value={f.dueDate} onChange={(e) => setF({ ...f, dueDate: e.target.value })} /></Field>
        </div>
        <div className="grid gap-x-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <Field label={wt('finance.becomesDue')}><Select aria-label={wt('finance.becomesDue')} value={f.trigger} onChange={(e) => setF({ ...f, trigger: e.target.value as PaymentTrigger })} data-testid="pay-trigger">{(Object.keys(TRIGGER_LABEL) as PaymentTrigger[]).map((t) => <option key={t} value={t}>{TRIGGER_LABEL[t]}</option>)}</Select></Field>
          <Field label={wt('common.version')}><Select aria-label={wt('common.version')} value={f.versionId} onChange={(e) => setF({ ...f, versionId: e.target.value })} data-testid="pay-version"><option value="">{wt('common.none')}</option>{(versions.data ?? []).map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}</Select></Field>
          <Field label={wt('finance.stage')}><Select aria-label={wt('finance.payStage')} value={f.stageId} onChange={(e) => setF({ ...f, stageId: e.target.value })}><option value="">{wt('common.none')}</option>{(stages.data ?? []).map((s) => <option key={s.id} value={s.id}>{s.n}. {s.name}</option>)}</Select></Field>
        </div>
        <label className="mb-3 flex items-center gap-2 text-[13px]"><input type="checkbox" checked={f.clientVisible} onChange={(e) => setF({ ...f, clientVisible: e.target.checked })} /> {wt('finance.showPortal')}</label>
        <button type="button" className="w-btn w-btn-primary" disabled={!f.name.trim() || !f.value || add.isPending} onClick={() => add.mutate()} data-testid="pay-add"><Plus size={14} />{wt('finance.addMilestone')}</button>
      </div>
      {q.isLoading ? <PageLoading rows={3} /> : !d?.items.length ? <EmptyState title={wt('finance.noPayments')} body={wt('finance.noPaymentsBody')} /> : (
        <ul className="space-y-2" data-testid="pay-list">
          {d.items.map((m) => (
            <li key={m.id} className="w-card flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
              <div className="min-w-0 flex-1 basis-[220px]">
                <div className="truncate text-[13.5px] font-medium"><span className="mr-1 tabular-nums text-[var(--w-text-3)]">{m.number}.</span>{m.name}</div>
                <div className="text-[12px] text-[var(--w-text-3)] [overflow-wrap:anywhere]">
                  {TRIGGER_LABEL[m.trigger]}{m.version ? ` · ${m.version.name}` : ''}{m.stage ? wt('finance.stageN', { n: m.stage.n }) : ''}{m.dueDate ? wt('finance.dueOn', { d: formatDate(m.dueDate) }) : ''}{m.invoiceNumber ? wt('finance.invoiceN', { n: m.invoiceNumber }) : ''}
                </div>
              </div>
              <div className="text-right text-[13.5px] font-semibold tabular-nums">{fmtMoney(m.computedAmount, d.currency)}{m.percent ? <div className="text-[11.5px] font-normal text-[var(--w-text-3)]">{m.percent}%</div> : null}</div>
              <Pill tone={PAY_TONE[m.status]}>{PAYMENT_STATUS_LABEL[m.status]}</Pill>
              {m.overdue && <Pill tone="red">{wt('common.overdue')}</Pill>}
              <button type="button" className={cn('w-btn w-btn-sm', m.clientVisible && 'border-[color-mix(in_srgb,var(--w-yellow)_45%,transparent)]')} onClick={() => share.mutate(m)} title={wt('finance.showMilestone')}>{m.clientVisible ? wt('finance.shared') : wt('finance.internal')}</button>
              {NEXT[m.status].length > 0 && (
                <Select aria-label={wt('finance.moveName', { name: m.name })} className="w-auto" value="" onChange={(e) => { const to = e.target.value as PaymentStatus; if (!to) return; if ((to === 'INVOICED' || to === 'PAID') && !m.invoiceNumber) { setInvoiceFor({ m, to }); return; } status.mutate({ m, to }); }} data-testid={`pay-move-${m.number}`}>
                  <option value="">{wt('fields.moveTo')}</option>
                  {NEXT[m.status].map((s) => <option key={s} value={s}>{PAYMENT_STATUS_LABEL[s]}</option>)}
                </Select>
              )}
              {(m.status === 'PLANNED' || m.status === 'DUE') && <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" aria-label={wt('finance.deleteMilestone')} onClick={() => del.mutate(m)}><Trash2 size={13} /></button>}
            </li>
          ))}
        </ul>
      )}
      <Dialog open={!!invoiceFor} onClose={() => setInvoiceFor(null)} title={wt('finance.invoiceNumber')} width={460}
        footer={<><button type="button" className="w-btn" onClick={() => setInvoiceFor(null)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={!invoice.trim() || status.isPending} onClick={() => invoiceFor && status.mutate({ ...invoiceFor, invoiceNumber: invoice.trim() })} data-testid="pay-invoice-save">{wt('common.save')}</button></>}>
        <p className="mb-3 text-[13px] text-[var(--w-text-2)]">{wt('finance.invoiceDesc')}</p>
        <Field label={wt('finance.invoiceNumber')}><input className="w-input" autoFocus value={invoice} onChange={(e) => setInvoice(e.target.value)} maxLength={80} placeholder={wt('finance.invoicePh')} data-testid="pay-invoice" /></Field>
      </Dialog>
    </div>
  );
}

// ─── Khung ───────────────────────────────────────────────────────

export default function FinanceView({ config }: { config: ProjectConfig }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const perms = config.permissions;
  const tabs = useMemo(() => {
    const t: Array<{ id: Tab; label: string; icon: typeof Wallet }> = [];
    if (perms.manageFinance) t.push({ id: 'overview', label: wt('finance.overview'), icon: Wallet });
    if (perms.viewFinance && (perms.manageFinance || config.role === 'MEMBER')) t.push({ id: 'timesheet', label: wt('finance.myTimesheet'), icon: CalendarDays });
    if (perms.reviewTimesheets) t.push({ id: 'approvals', label: wt('finance.approvals'), icon: CheckCircle2 });
    if (perms.manageFinance) t.push({ id: 'rates', label: wt('finance.rates'), icon: Receipt }, { id: 'budget', label: wt('finance.budgetCosts'), icon: Wallet }, { id: 'payments', label: wt('finance.payments'), icon: Receipt });
    return t;
  }, [perms, config.role]);
  const raw = search?.get('tab') as Tab | null;
  const tab: Tab | undefined = raw && tabs.some((t) => t.id === raw) ? raw : tabs[0]?.id;
  const setTab = (id: Tab) => {
    const p = new URLSearchParams(search?.toString());
    p.set('tab', id);
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  };
  if (!tabs.length || !tab) return <EmptyState title={wt('finance.forTeam')} body={wt('finance.forTeamBody')} />;
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 overflow-x-auto border-b border-[var(--w-border)] px-4">
        <div className="flex gap-1" role="tablist" aria-label={wt('finance.finance')}>
          {tabs.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} data-testid={`fin-tab-${t.id}`}
              className={cn('-mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 px-2.5 py-2.5 text-[13px] font-medium transition-colors', tab === t.id ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
              <t.icon size={14} />{t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="w-page">
          {tab === 'overview' && <OverviewTab config={config} />}
          {tab === 'timesheet' && <TimesheetTab config={config} />}
          {tab === 'approvals' && <ApprovalsTab config={config} />}
          {tab === 'rates' && <RatesTab config={config} />}
          {tab === 'budget' && <BudgetTab config={config} />}
          {tab === 'payments' && <PaymentsTab config={config} />}
        </div>
      </div>
    </div>
  );
}
