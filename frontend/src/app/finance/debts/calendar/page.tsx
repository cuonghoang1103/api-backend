'use client';
/**
 * Debt calendar — all schedule items plotted on a month grid. Day badges sum
 * multiple payments; overdue days are red. Answers "tháng này phải trả bao
 * nhiêu, ngày nào, app nào". Tap a day → list of that day's payments.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { financeApi, LENDER_TYPE_LABELS, type ScheduleItem } from '@/lib/finance-api';
import { cn, formatVnd, formatVndCompact } from '@/lib/utils';
import { FinanceShell } from '@/components/finance/FinanceShell';
import { Card, Spinner, Sheet } from '@/components/finance/primitives';

type DayItem = ScheduleItem & { debt: { id: number; lenderName: string; lenderType: string } };
function monthStr(d = new Date()) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; }

export default function DebtCalendarPage() {
  const [month, setMonth] = useState(monthStr());
  const [days, setDays] = useState<Array<{ date: string; total: string; items: DayItem[] }>>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<{ date: string; items: DayItem[] } | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    financeApi.debtCalendar(month).then((r) => setDays(r.days as never)).catch(() => undefined).finally(() => setLoading(false));
  }, [month]);
  useEffect(() => { load(); }, [load]);

  const byDay = useMemo(() => new Map(days.map((d) => [d.date, d])), [days]);
  const monthTotal = days.reduce((a, d) => a + Number(d.total), 0);
  const [y, mo] = month.split('-').map(Number);
  const daysInMonth = new Date(y, mo, 0).getDate();
  const firstDow = (new Date(y, mo - 1, 1).getDay() + 6) % 7;
  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <FinanceShell>
      <Link href="/finance/debts" className="mb-3 inline-flex items-center gap-1 text-sm text-text-muted hover:text-neon-violet"><ArrowLeft size={15} /> Khoản nợ</Link>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Lịch trả nợ</h1>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-text-primary" />
      </div>

      <Card className="mb-4">
        <span className="text-sm text-text-secondary">Tổng phải trả tháng này: <b className="text-neon-red">{formatVnd(monthTotal)}</b></span>
      </Card>

      {loading ? <Spinner /> : (
        <Card>
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-text-muted">{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => <div key={d}>{d}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${month}-${String(day).padStart(2, '0')}`;
              const d = byDay.get(dateStr);
              const overdue = d && dateStr < todayStr && d.items.some((it) => !it.isPaid);
              return (
                <button key={day} onClick={() => d && setOpen({ date: dateStr, items: d.items })}
                  className={cn('flex aspect-square flex-col items-center justify-start rounded-lg border p-1 text-left transition-colors',
                    d ? (overdue ? 'border-neon-red/50 bg-neon-red/10' : 'border-neon-violet/40 bg-neon-violet/10 hover:border-neon-violet') : 'border-[var(--border-color)]')}>
                  <span className="text-xs text-text-secondary">{day}</span>
                  {d && <span className={cn('mt-auto text-[10px] font-semibold', overdue ? 'text-neon-red' : 'text-neon-violet')}>{formatVndCompact(d.total)}</span>}
                </button>
              );
            })}
          </div>
        </Card>
      )}

      <Sheet open={!!open} onClose={() => setOpen(null)} title={open ? `Thanh toán ngày ${open.date}` : ''}>
        <div className="space-y-2">
          {open?.items.map((it) => (
            <Link key={it.id} href={`/finance/debts/${it.debtId}`} onClick={() => setOpen(null)}
              className="flex items-center justify-between rounded-xl border border-[var(--border-color)] p-3 hover:border-neon-violet/50">
              <div>
                <div className="text-sm font-medium text-text-primary">{it.debt.lenderName}</div>
                <div className="text-xs text-text-muted">{LENDER_TYPE_LABELS[it.debt.lenderType]} · Kỳ {it.installmentNo}{it.isPaid ? ' · đã trả' : ''}</div>
              </div>
              <span className={cn('font-semibold tabular-nums', it.isPaid ? 'text-text-muted line-through' : 'text-neon-red')}>{formatVnd(it.amountDue)}</span>
            </Link>
          ))}
        </div>
      </Sheet>
    </FinanceShell>
  );
}
