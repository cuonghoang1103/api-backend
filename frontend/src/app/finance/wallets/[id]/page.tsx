'use client';
/** Wallet detail — unified ledger (income/expense/debt payment/adjust/transfer)
 *  with a running-balance column, newest first, paginated. */
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { financeApi, type Wallet } from '@/lib/finance-api';
import { cn, formatVnd } from '@/lib/utils';
import { FinanceShell } from '@/components/finance/FinanceShell';
import { Card, Spinner, EmptyState } from '@/components/finance/primitives';

const KIND_LABEL: Record<string, string> = { INCOME: 'Thu', EXPENSE: 'Chi', DEBT_PAYMENT: 'Trả nợ', ADJUSTMENT: 'Điều chỉnh', TRANSFER: 'Chuyển ví' };

export default function WalletDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [rows, setRows] = useState<Array<{ kind: string; refId: number; date: string; amount: string; label: string; balanceAfter: string }>>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback((p: number) => {
    setLoading(true);
    financeApi.walletHistory(id, p, 30).then((r) => { setWallet(r.wallet); setRows(r.rows); setTotalPages(r.pagination.totalPages); }).catch(() => undefined).finally(() => setLoading(false));
  }, [id]);
  useEffect(() => { load(page); }, [load, page]);

  return (
    <FinanceShell>
      <Link href="/finance/wallets" className="mb-3 inline-flex items-center gap-1 text-sm text-text-muted hover:text-neon-violet"><ArrowLeft size={15} /> Ví</Link>
      {wallet && (
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: (wallet.color || '#8b5cf6') + '22' }}>{wallet.icon || '👛'}</div>
          <div>
            <div className="font-heading text-xl font-bold text-text-primary">{wallet.name}</div>
            <div className="text-sm text-text-muted">Số dư: <b className="text-text-primary">{formatVnd(wallet.balance)}</b></div>
          </div>
        </div>
      )}

      {loading && rows.length === 0 ? <Spinner /> : rows.length === 0 ? (
        <EmptyState icon="🧾" title="Chưa có giao dịch" hint="Các khoản thu/chi liên quan ví này sẽ hiện ở đây." />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-[var(--border-color)]">
            {rows.map((r) => {
              const positive = Number(r.amount) >= 0;
              return (
                <div key={`${r.kind}-${r.refId}`} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-text-primary">{r.label}</div>
                    <div className="text-xs text-text-muted">{KIND_LABEL[r.kind] ?? r.kind} · {r.date.slice(0, 10)}</div>
                  </div>
                  <div className="text-right">
                    <div className={cn('text-sm font-medium tabular-nums', positive ? 'text-neon-green' : 'text-neon-red')}>{positive ? '+' : ''}{formatVnd(r.amount)}</div>
                    <div className="text-xs text-text-muted tabular-nums">{formatVnd(r.balanceAfter)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-[var(--border-color)] px-3 py-1 disabled:opacity-40">Trước</button>
          <span className="text-text-muted">{page}/{totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-[var(--border-color)] px-3 py-1 disabled:opacity-40">Sau</button>
        </div>
      )}
    </FinanceShell>
  );
}
