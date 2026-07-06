'use client';
/**
 * Reports — Monthly (income vs expense, savings rate, category breakdown +
 * donut, top-10 expenses, debt principal/interest split, vs previous month) and
 * Yearly (12-month income/expense bars, cumulative net-worth line, interest paid,
 * self-invested). CSV export for the monthly report.
 */
import { useCallback, useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { financeApi, type MonthlyReport, type YearlyReport } from '@/lib/finance-api';
import { cn, formatVnd } from '@/lib/utils';
import { FinanceShell } from '@/components/finance/FinanceShell';
import { Card, StatCard, Spinner } from '@/components/finance/primitives';
import { ExpenseDonut, IncomeExpenseBars, NetWorthLine } from '@/components/finance/charts';

function monthStr(d = new Date()) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; }

export default function ReportsPage() {
  const [mode, setMode] = useState<'month' | 'year'>('month');
  const [month, setMonth] = useState(monthStr());
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [monthly, setMonthly] = useState<MonthlyReport | null>(null);
  const [yearly, setYearly] = useState<YearlyReport | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    if (mode === 'month') financeApi.monthlyReport(month).then(setMonthly).catch(() => undefined).finally(() => setLoading(false));
    else financeApi.yearlyReport(year).then(setYearly).catch(() => undefined).finally(() => setLoading(false));
  }, [mode, month, year]);
  useEffect(() => { load(); }, [load]);

  return (
    <FinanceShell>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Báo cáo</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-[var(--border-color)] p-1">
            {(['month', 'year'] as const).map((m) => <button key={m} onClick={() => setMode(m)} className={cn('rounded-lg px-3 py-1.5 text-sm font-medium', mode === m ? 'bg-neon-violet text-white' : 'text-text-secondary')}>{m === 'month' ? 'Tháng' : 'Năm'}</button>)}
          </div>
          {mode === 'month'
            ? <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-text-primary" />
            : <input inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value.replace(/[^\d]/g, ''))} className="w-24 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-text-primary" />}
          {mode === 'month' && <a href={financeApi.reportCsvUrl(month)} className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] px-3 py-2 text-sm text-text-secondary hover:border-neon-violet/50"><Download size={15} /> CSV</a>}
        </div>
      </div>

      {loading ? <Spinner /> : mode === 'month' && monthly ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Thu nhập" value={monthly.income} accent="income" />
            <StatCard label="Chi tiêu" value={monthly.expense} accent="expense" />
            <StatCard label="Chênh lệch" value={monthly.net} accent={Number(monthly.net) >= 0 ? 'income' : 'expense'} />
            <StatCard label="Tỷ lệ tiết kiệm" value={monthly.savingsRate ?? 0} format={(n) => `${n}%`} accent="savings" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <div className="mb-2 text-sm font-semibold text-text-primary">Chi tiêu theo danh mục</div>
              <ExpenseDonut data={monthly.categoryBreakdown} />
            </Card>
            <Card>
              <div className="mb-2 text-sm font-semibold text-text-primary">Nợ đã trả tháng này</div>
              <div className="space-y-2 py-4 text-sm">
                <div className="flex justify-between"><span className="text-text-muted">Gốc</span><span className="font-medium text-text-primary">{formatVnd(monthly.debtPaid.principal)}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Lãi</span><span className="font-medium text-neon-orange">{formatVnd(monthly.debtPaid.interest)}</span></div>
                <div className="flex justify-between border-t border-[var(--border-color)] pt-2"><span>Tổng</span><span className="font-semibold">{formatVnd(monthly.debtPaid.total)}</span></div>
                <div className="mt-3 flex justify-between text-xs text-text-muted"><span>So tháng trước — Thu</span><span>{formatVnd(monthly.vsPrev.income)}</span></div>
                <div className="flex justify-between text-xs text-text-muted"><span>So tháng trước — Chi</span><span>{formatVnd(monthly.vsPrev.expense)}</span></div>
              </div>
            </Card>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="border-b border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold text-text-primary">Top 10 chi tiêu lớn nhất</div>
            <div className="divide-y divide-[var(--border-color)]">
              {monthly.topExpenses.length === 0 ? <div className="py-6 text-center text-sm text-text-muted">Chưa có chi tiêu</div> : monthly.topExpenses.map((e) => (
                <div key={e.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <span>{e.category?.icon ?? '📦'}</span>
                  <span className="min-w-0 flex-1 truncate text-text-primary">{e.description || e.category?.name}</span>
                  <span className="text-text-muted">{e.date.slice(0, 10)}</span>
                  <span className="font-medium tabular-nums text-neon-red">{formatVnd(e.amount)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : mode === 'year' && yearly ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Tổng thu" value={yearly.totalIncome} accent="income" />
            <StatCard label="Tổng chi" value={yearly.totalExpense} accent="expense" />
            <StatCard label="Lãi đã trả cho chủ nợ" value={yearly.totalInterestPaid} accent="debt" />
            <StatCard label="Đầu tư bản thân" value={yearly.selfInvested} accent="savings" />
          </div>
          <Card>
            <div className="mb-2 text-sm font-semibold text-text-primary">Thu / Chi theo tháng ({yearly.year})</div>
            <IncomeExpenseBars months={yearly.months} />
          </Card>
          <Card>
            <div className="mb-2 text-sm font-semibold text-text-primary">Dòng tiền tích luỹ trong năm</div>
            <NetWorthLine months={yearly.months} />
          </Card>
        </div>
      ) : (
        <div className="py-10 text-center text-text-muted">Không có dữ liệu</div>
      )}
    </FinanceShell>
  );
}
