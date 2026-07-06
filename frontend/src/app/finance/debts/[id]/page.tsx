'use client';
/**
 * Debt detail — full generated schedule with per-row "Đã thanh toán" checkbox
 * (tick → PayScheduleSheet: wallet select + editable amount → row turns green,
 * strike-through, wallet deducted, debt recomputes). Payment history + remaining
 * balance chart below. Edit / delete.
 */
import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { financeApi, interestLabel, LENDER_TYPE_LABELS, INTEREST_TYPE_LABELS, type Debt, type ScheduleItem } from '@/lib/finance-api';
import { cn, formatVnd } from '@/lib/utils';
import { FinanceShell } from '@/components/finance/FinanceShell';
import { Card, Button, Sheet, Spinner, ProgressBar } from '@/components/finance/primitives';
import { PayScheduleSheet, DebtStatusPill, DebtForm } from '@/components/finance/debt-ui';
import { DebtBalanceChart } from '@/components/finance/charts';

export default function DebtDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [debt, setDebt] = useState<Debt | null>(null);
  const [loading, setLoading] = useState(true);
  const [payItem, setPayItem] = useState<ScheduleItem | null>(null);
  const [editing, setEditing] = useState(false);

  const load = useCallback(() => {
    financeApi.getDebt(id).then(setDebt).catch(() => undefined).finally(() => setLoading(false));
  }, [id]);
  useEffect(() => { load(); }, [load]);

  if (loading && !debt) return <FinanceShell><Spinner /></FinanceShell>;
  if (!debt) return <FinanceShell><div className="py-10 text-center text-text-muted">Không tìm thấy khoản nợ</div></FinanceShell>;

  const c = debt.computed;
  const schedule = debt.schedule ?? [];
  // remaining-balance-over-time series from the schedule (principal declining)
  const principal = Number(debt.principal);
  let acc = 0;
  const balanceSeries = schedule.map((s) => { acc += Number(s.principalPart); return { label: `K${s.installmentNo}`, remaining: Math.max(0, principal - acc) }; });

  const unpay = async (itemId: number) => {
    if (!confirm('Hoàn tác thanh toán kỳ này?')) return;
    try { const d = await financeApi.unpayScheduleItem(id, itemId); setDebt(d); toast.success('Đã hoàn tác'); } catch { toast.error('Thất bại'); }
  };

  return (
    <FinanceShell onQuickAddSuccess={load}>
      <Link href="/finance/debts" className="mb-3 inline-flex items-center gap-1 text-sm text-text-muted hover:text-neon-violet"><ArrowLeft size={15} /> Khoản nợ</Link>

      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-text-primary">{debt.lenderName}</h1>
            <DebtStatusPill status={debt.status} />
          </div>
          <div className="text-sm text-text-muted">{LENDER_TYPE_LABELS[debt.lenderType]} · {INTEREST_TYPE_LABELS[debt.interestType]}</div>
          <div className="mt-0.5 text-sm text-text-secondary">{interestLabel(debt)}</div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setEditing(true)} className="rounded-lg p-2 text-text-muted hover:text-neon-violet"><Pencil size={16} /></button>
          <button onClick={async () => { if (confirm('Xoá khoản nợ này?')) { await financeApi.deleteDebt(id); toast.success('Đã xoá'); router.push('/finance/debts'); } }} className="rounded-lg p-2 text-text-muted hover:text-neon-red"><Trash2 size={16} /></button>
        </div>
      </div>

      {/* Summary */}
      <Card className="mb-4">
        <div className="flex items-baseline justify-between">
          <span className="font-heading text-2xl font-bold text-neon-red tabular-nums">{formatVnd(c?.remaining ?? debt.principal)}</span>
          <span className="text-sm text-text-muted">còn lại / {formatVnd(debt.principal)}</span>
        </div>
        <div className="mt-2"><ProgressBar ratio={c?.progressPct ?? 0} status="ok" /></div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs">
          <div><div className="text-text-muted">Lãi đã trả</div><div className="font-semibold text-text-primary">{formatVnd(c?.interestPaid ?? 0)}</div></div>
          <div><div className="text-text-muted">Tổng lãi dự kiến</div><div className="font-semibold text-neon-orange">{formatVnd(c?.projectedInterest ?? 0)}</div></div>
          <div><div className="text-text-muted">{debt.interestType === 'DAILY_PERCENT' ? 'Lãi/ngày' : 'Kỳ tới'}</div><div className="font-semibold text-text-primary">{debt.interestType === 'DAILY_PERCENT' ? formatVnd(c?.interestPerDay ?? 0) : (c?.nextDueDate?.slice(0, 10) ?? '—')}</div></div>
        </div>
        {debt.attachmentUrl && <a href={debt.attachmentUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-neon-violet hover:underline">📎 Xem ảnh hợp đồng</a>}
      </Card>

      {/* Schedule */}
      {schedule.length > 0 && (
        <Card className="mb-4 p-0 overflow-hidden">
          <div className="border-b border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold text-text-primary">Lịch thanh toán</div>
          <div className="max-h-[420px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[var(--bg-card)] text-xs text-text-muted">
                <tr><th className="px-3 py-2 text-left font-medium">Kỳ</th><th className="px-3 py-2 text-left font-medium">Đến hạn</th><th className="px-3 py-2 text-right font-medium">Gốc</th><th className="px-3 py-2 text-right font-medium">Lãi</th><th className="px-3 py-2 text-right font-medium">Tổng</th><th className="px-3 py-2 text-center font-medium">Trả</th></tr>
              </thead>
              <tbody>
                {schedule.map((s) => {
                  const overdue = !s.isPaid && new Date(s.dueDate) < new Date();
                  return (
                    <tr key={s.id} className={cn('border-t border-[var(--border-color)] transition-colors', s.isPaid && 'bg-neon-green/5 text-text-muted')}>
                      <td className="px-3 py-2">{s.installmentNo}</td>
                      <td className={cn('px-3 py-2', overdue && 'text-neon-red', s.isPaid && 'line-through')}>{s.dueDate.slice(0, 10)}</td>
                      <td className={cn('px-3 py-2 text-right tabular-nums', s.isPaid && 'line-through')}>{formatVnd(s.principalPart)}</td>
                      <td className={cn('px-3 py-2 text-right tabular-nums text-neon-orange', s.isPaid && 'line-through opacity-60')}>{formatVnd(s.interestPart)}</td>
                      <td className={cn('px-3 py-2 text-right font-medium tabular-nums', s.isPaid && 'line-through')}>{formatVnd(s.amountDue)}</td>
                      <td className="px-3 py-2 text-center">
                        {s.isPaid ? (
                          <button onClick={() => unpay(s.id)} className="inline-flex items-center gap-1 text-xs text-neon-green hover:text-neon-red" title="Hoàn tác"><RotateCcw size={13} /></button>
                        ) : (
                          <button onClick={() => setPayItem(s)} className="rounded-lg bg-neon-green/15 px-2 py-1 text-xs font-medium text-neon-green hover:bg-neon-green/25">Đã trả</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Balance chart */}
      {balanceSeries.length > 1 && (
        <Card className="mb-4">
          <div className="mb-2 text-sm font-semibold text-text-primary">Dư nợ theo thời gian</div>
          <DebtBalanceChart data={balanceSeries} />
        </Card>
      )}

      {/* Payment history */}
      {(debt.payments?.length ?? 0) > 0 && (
        <Card className="p-0 overflow-hidden">
          <div className="border-b border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold text-text-primary">Lịch sử thanh toán</div>
          <div className="divide-y divide-[var(--border-color)]">
            {debt.payments!.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-text-secondary">{p.date.slice(0, 10)} {p.note && <span className="text-text-muted">· {p.note}</span>}</span>
                <span className="font-medium tabular-nums text-neon-green">-{formatVnd(p.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <PayScheduleSheet open={!!payItem} onClose={() => setPayItem(null)} debtId={id} item={payItem} onPaid={(d) => { setDebt(d); setPayItem(null); }} />
      {editing && (
        <Sheet open onClose={() => setEditing(false)} title="Sửa khoản nợ" size="lg">
          <DebtForm initial={debt} onSaved={(d) => { setDebt(d); setEditing(false); }} onCancel={() => setEditing(false)} />
        </Sheet>
      )}
    </FinanceShell>
  );
}
