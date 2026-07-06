'use client';
/**
 * MoneyFlow Dashboard — the money cockpit.
 * Stat cards (count-up), cashflow chart, expense donut, upcoming debt payments
 * (tick-to-pay), budget bars, spending-vs-income line. Lazily materializes due
 * recurring txns server-side on load. Auth-gated by FinanceShell.
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { financeApi, type DashboardData, type ScheduleItem } from '@/lib/finance-api';
import { formatVnd } from '@/lib/utils';
import { FinanceShell } from '@/components/finance/FinanceShell';
import { Card, StatCard, ProgressBar, Spinner, EmptyState, Pill } from '@/components/finance/primitives';
import { CashflowChart, ExpenseDonut } from '@/components/finance/charts';
import { PayScheduleSheet } from '@/components/finance/debt-ui';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [payTarget, setPayTarget] = useState<{ debtId: number; item: Pick<ScheduleItem, 'id' | 'installmentNo' | 'amountDue' | 'dueDate'> } | null>(null);

  const load = useCallback(() => {
    financeApi.dashboard().then(setData).catch(() => undefined).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <FinanceShell onQuickAddSuccess={load}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text-primary">MoneyFlow</h1>
        <span className="text-sm text-text-muted">{data?.month}</span>
      </div>

      {loading && !data ? (
        <Spinner label="Đang tải bảng điều khiển…" />
      ) : !data ? (
        <EmptyState title="Không tải được dữ liệu" hint="Thử tải lại trang." />
      ) : (
        <div className="space-y-4">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Tổng số dư" value={data.totalBalance} accent="default" />
            <StatCard label="Thu tháng này" value={data.incomeThisMonth} accent="income" />
            <StatCard label="Chi tháng này" value={data.expenseThisMonth} accent="expense" />
            <StatCard label="Giá trị ròng" value={data.netWorth} accent="savings"
              sub={<span className="text-text-muted">Ví − nợ còn lại</span>} />
          </div>

          {/* Spending vs income */}
          {data.spendingVsIncomePct != null && (
            <Card>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Bạn đã tiêu <b className="text-neon-orange">{data.spendingVsIncomePct}%</b> thu nhập tháng này</span>
                <span className="text-text-muted">Để dành: {formatVnd(data.savingsThisMonth)}</span>
              </div>
              <div className="mt-2"><ProgressBar ratio={data.spendingVsIncomePct} status={data.spendingVsIncomePct > 100 ? 'over' : data.spendingVsIncomePct >= 70 ? 'warn' : 'ok'} /></div>
            </Card>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <div className="mb-2 text-sm font-semibold text-text-primary">Dòng tiền tháng này</div>
              <CashflowChart data={data.cashflow} />
            </Card>
            <Card>
              <div className="mb-2 text-sm font-semibold text-text-primary">Chi tiêu theo danh mục</div>
              <ExpenseDonut data={data.expenseByCategory} />
            </Card>
          </div>

          {/* Upcoming payments */}
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-text-primary">Sắp đến hạn (14 ngày)</div>
              <Link href="/finance/debts/calendar" className="text-xs text-neon-violet hover:underline">Xem lịch →</Link>
            </div>
            {data.upcomingPayments.length === 0 ? (
              <div className="py-4 text-center text-sm text-text-muted">Không có khoản nào sắp đến hạn 🎉</div>
            ) : (
              <div className="space-y-2">
                {data.upcomingPayments.map((p) => (
                  <div key={p.id} className={`flex items-center gap-3 rounded-xl border p-2.5 ${p.isOverdue ? 'border-neon-red/40 bg-neon-red/5' : 'border-[var(--border-color)]'}`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-text-primary">{p.lenderName}</span>
                        {p.isOverdue && <Pill tone="red"><AlertTriangle size={11} className="mr-0.5" />Quá hạn</Pill>}
                      </div>
                      <div className="text-xs text-text-muted">{p.dueDate.slice(0, 10)} · {formatVnd(p.amountDue)}</div>
                    </div>
                    <button
                      onClick={() => setPayTarget({ debtId: p.debtId, item: { id: p.id, installmentNo: 0, amountDue: p.amountDue, dueDate: p.dueDate } })}
                      className="inline-flex items-center gap-1 rounded-lg bg-neon-green/15 px-2.5 py-1.5 text-xs font-medium text-neon-green hover:bg-neon-green/25">
                      <CheckCircle2 size={13} /> Trả
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Budgets */}
          {data.budgets.length > 0 && (
            <Card>
              <div className="mb-3 text-sm font-semibold text-text-primary">Ngân sách theo danh mục</div>
              <div className="space-y-3">
                {data.budgets.map((b) => (
                  <div key={b.category.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-text-secondary">{b.category.icon} {b.category.name}</span>
                      <span className={`tabular-nums ${b.status === 'over' ? 'text-neon-red' : b.status === 'warn' ? 'text-neon-orange' : 'text-text-muted'}`}>
                        {formatVnd(b.used)} / {formatVnd(b.budget)} ({b.ratio}%)
                      </span>
                    </div>
                    <ProgressBar ratio={b.ratio} status={b.status} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="flex flex-wrap gap-2">
            <Link href="/finance/expenses" className="inline-flex items-center gap-1 text-sm text-neon-violet hover:underline">Chi tiêu <ArrowRight size={14} /></Link>
            <span className="text-text-muted">·</span>
            <Link href="/finance/debts" className="inline-flex items-center gap-1 text-sm text-neon-violet hover:underline">Khoản nợ <ArrowRight size={14} /></Link>
            <span className="text-text-muted">·</span>
            <Link href="/finance/wallets" className="inline-flex items-center gap-1 text-sm text-neon-violet hover:underline">Ví <ArrowRight size={14} /></Link>
          </div>
        </div>
      )}

      <PayScheduleSheet
        open={!!payTarget} onClose={() => setPayTarget(null)}
        debtId={payTarget?.debtId ?? 0} item={payTarget?.item ?? null}
        onPaid={() => { setPayTarget(null); load(); }}
      />
    </FinanceShell>
  );
}
