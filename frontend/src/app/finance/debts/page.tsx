'use client';
/**
 * Debts — summary header (total remaining, due this month, active lenders,
 * interest paid + projected) and debt cards. New/edit via DebtForm sheet with
 * live schedule preview. The most-polished MoneyFlow section.
 */
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, CalendarDays } from 'lucide-react';
import { financeApi, type Debt } from '@/lib/finance-api';
import { formatVnd } from '@/lib/utils';
import { FinanceShell } from '@/components/finance/FinanceShell';
import { Card, Button, Sheet, Spinner, EmptyState } from '@/components/finance/primitives';
import { DebtCard, DebtForm } from '@/components/finance/debt-ui';

export default function DebtsPage() {
  const router = useRouter();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [summary, setSummary] = useState<{ totalRemaining: string; dueThisMonth: string; activeLenders: number; totalInterestPaid: string; projectedTotalInterest: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    Promise.all([financeApi.listDebts(), financeApi.debtSummary()])
      .then(([d, s]) => { setDebts(d); setSummary(s as never); })
      .catch(() => undefined).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <FinanceShell onQuickAddSuccess={load}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Khoản nợ</h1>
        <div className="flex gap-2">
          <Link href="/finance/debts/calendar" className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] px-3 py-2 text-sm text-text-secondary hover:border-neon-violet/50"><CalendarDays size={15} /> Lịch</Link>
          <Button onClick={() => setCreating(true)}><Plus size={15} /> Thêm nợ</Button>
        </div>
      </div>

      {summary && (
        <Card className="mb-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div><div className="text-xs text-text-muted">Tổng còn nợ</div><div className="font-heading text-xl font-bold text-neon-red tabular-nums">{formatVnd(summary.totalRemaining)}</div></div>
            <div><div className="text-xs text-text-muted">Phải trả tháng này</div><div className="font-heading text-xl font-bold text-neon-orange tabular-nums">{formatVnd(summary.dueThisMonth)}</div></div>
            <div><div className="text-xs text-text-muted">Chủ nợ đang hoạt động</div><div className="font-heading text-xl font-bold text-text-primary tabular-nums">{summary.activeLenders}</div></div>
            <div><div className="text-xs text-text-muted">Lãi đã trả / dự kiến</div><div className="font-heading text-sm font-bold text-text-primary tabular-nums">{formatVnd(summary.totalInterestPaid)} <span className="text-text-muted">/ {formatVnd(summary.projectedTotalInterest)}</span></div></div>
          </div>
        </Card>
      )}

      {loading ? <Spinner /> : debts.length === 0 ? (
        <EmptyState icon="💳" title="Chưa có khoản nợ nào" hint="Thêm khoản vay để theo dõi lịch trả và lãi suất." action={<Button onClick={() => setCreating(true)}><Plus size={15} /> Thêm nợ</Button>} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {debts.map((d) => <DebtCard key={d.id} debt={d} onClick={() => router.push(`/finance/debts/${d.id}`)} />)}
        </div>
      )}

      {creating && (
        <Sheet open onClose={() => setCreating(false)} title="Thêm khoản nợ" size="lg">
          <DebtForm onSaved={(d) => { setCreating(false); router.push(`/finance/debts/${d.id}`); }} onCancel={() => setCreating(false)} />
        </Sheet>
      )}
    </FinanceShell>
  );
}
