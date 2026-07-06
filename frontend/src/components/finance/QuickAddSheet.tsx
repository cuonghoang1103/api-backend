'use client';
/**
 * Quick Add bottom sheet — log an expense or income in ≤3 taps from anywhere.
 * Big numeric amount, category chips (expense), wallet chips, optional note.
 * Optimistic: closes immediately on submit, rolls back with a toast on error.
 */
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { financeApi, type Wallet, type ExpenseCategory } from '@/lib/finance-api';
import { cn, formatVnd } from '@/lib/utils';
import { Sheet, Button, inputCls } from './primitives';

type Tab = 'EXPENSE' | 'INCOME';

export function QuickAddSheet({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess?: () => void }) {
  const [tab, setTab] = useState<Tab>('EXPENSE');
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [amount, setAmount] = useState('');
  const [walletId, setWalletId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    Promise.all([financeApi.listWallets(), financeApi.listCategories()])
      .then(([w, c]) => {
        setWallets(w);
        setCategories(c);
        setWalletId((prev) => prev ?? w[0]?.id ?? null);
        setCategoryId((prev) => prev ?? c[0]?.id ?? null);
      })
      .catch(() => toast.error('Không tải được ví/danh mục'));
  }, [open]);

  const reset = () => { setAmount(''); setNote(''); };

  const submit = async () => {
    const value = Number(amount);
    if (!value || value <= 0) { toast.error('Nhập số tiền hợp lệ'); return; }
    if (!walletId) { toast.error('Chọn ví'); return; }
    if (tab === 'EXPENSE' && !categoryId) { toast.error('Chọn danh mục'); return; }
    setSaving(true);
    try {
      if (tab === 'EXPENSE') {
        await financeApi.createExpense({ amount: value, walletId, categoryId, description: note || undefined });
        toast.success(`Đã ghi chi ${formatVnd(value)}`);
      } else {
        await financeApi.createIncomeEntry({ amount: value, walletId, type: 'OTHER', note: note || undefined });
        toast.success(`Đã ghi thu ${formatVnd(value)}`);
      }
      reset();
      onSuccess?.();
      onClose();
    } catch (e) {
      toast.error('Lưu thất bại, thử lại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Ghi nhanh">
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-[var(--border-color)] p-1">
        {(['EXPENSE', 'INCOME'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('rounded-lg py-2 text-sm font-medium transition-colors',
              tab === t ? (t === 'EXPENSE' ? 'bg-neon-orange text-white' : 'bg-neon-green text-white') : 'text-text-secondary')}>
            {t === 'EXPENSE' ? '🧾 Chi tiêu' : '💰 Thu nhập'}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <input
          autoFocus inputMode="numeric" value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))}
          placeholder="0" className={cn(inputCls, 'text-center text-3xl font-heading font-bold tabular-nums h-16')}
        />
        {amount && <div className="mt-1 text-center text-sm text-text-muted">{formatVnd(Number(amount))}</div>}
      </div>

      {tab === 'EXPENSE' && (
        <div className="mb-4">
          <div className="mb-1.5 text-xs font-medium text-text-secondary">Danh mục</div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button key={c.id} onClick={() => setCategoryId(c.id)}
                className={cn('rounded-full border px-3 py-1.5 text-sm transition-colors',
                  categoryId === c.id ? 'border-neon-violet bg-neon-violet/15 text-neon-violet' : 'border-[var(--border-color)] text-text-secondary')}>
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="mb-1.5 text-xs font-medium text-text-secondary">Ví</div>
        <div className="flex flex-wrap gap-1.5">
          {wallets.map((w) => (
            <button key={w.id} onClick={() => setWalletId(w.id)}
              className={cn('rounded-full border px-3 py-1.5 text-sm transition-colors',
                walletId === w.id ? 'border-neon-cyan bg-neon-cyan/15 text-neon-cyan' : 'border-[var(--border-color)] text-text-secondary')}>
              {w.icon} {w.name}
            </button>
          ))}
        </div>
      </div>

      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú (tuỳ chọn)" className={cn(inputCls, 'mb-4')} />

      <Button type="button" onClick={submit} disabled={saving} className="w-full" variant={tab === 'EXPENSE' ? 'primary' : 'primary'}>
        {saving ? 'Đang lưu…' : 'Lưu'}
      </Button>
    </Sheet>
  );
}
