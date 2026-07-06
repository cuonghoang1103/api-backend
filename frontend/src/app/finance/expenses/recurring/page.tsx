'use client';
/** Recurring transactions — templates that auto-materialize on due date
 *  (lazily on dashboard load). List, toggle active, create/edit/delete, run now. */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Play, Trash2, Repeat } from 'lucide-react';
import { financeApi, type RecurringTxn, type ExpenseCategory, type Wallet } from '@/lib/finance-api';
import { cn, formatVnd } from '@/lib/utils';
import { FinanceShell } from '@/components/finance/FinanceShell';
import { Card, Button, Sheet, Field, inputCls, Spinner, EmptyState, Pill } from '@/components/finance/primitives';

const FREQ: Record<string, string> = { MONTHLY: 'Hàng tháng', WEEKLY: 'Hàng tuần', YEARLY: 'Hàng năm' };

export default function RecurringPage() {
  const [items, setItems] = useState<RecurringTxn[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    Promise.all([financeApi.listRecurring(), financeApi.listCategories(), financeApi.listWallets()])
      .then(([r, c, w]) => { setItems(r); setCategories(c); setWallets(w); })
      .catch(() => undefined).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const runNow = async () => { const { created } = await financeApi.runRecurring(); toast.success(`Đã tạo ${created} giao dịch đến hạn`); load(); };

  return (
    <FinanceShell onQuickAddSuccess={load}>
      <Link href="/finance/expenses" className="mb-3 inline-flex items-center gap-1 text-sm text-text-muted hover:text-neon-violet"><ArrowLeft size={15} /> Chi tiêu</Link>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Giao dịch định kỳ</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={runNow}><Play size={15} /> Chạy ngay</Button>
          <Button onClick={() => setCreating(true)}><Plus size={15} /> Thêm</Button>
        </div>
      </div>

      {loading ? <Spinner /> : items.length === 0 ? (
        <EmptyState icon="🔁" title="Chưa có giao dịch định kỳ" hint="VD: tiền nhà, Netflix — sẽ tự động ghi vào ngày đến hạn." action={<Button onClick={() => setCreating(true)}><Plus size={15} /> Thêm</Button>} />
      ) : (
        <div className="space-y-2">
          {items.map((r) => (
            <Card key={r.id}>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neon-violet/10 text-neon-violet"><Repeat size={16} /></div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-text-primary">{r.description}</div>
                  <div className="text-xs text-text-muted">{FREQ[r.frequency]} · kỳ tới {r.nextRunAt.slice(0, 10)}</div>
                </div>
                <div className="text-right">
                  <div className={cn('font-semibold tabular-nums', r.kind === 'INCOME' ? 'text-neon-green' : 'text-neon-red')}>{r.kind === 'INCOME' ? '+' : '-'}{formatVnd(r.amount)}</div>
                  <Pill tone={r.isActive ? 'green' : 'default'}>{r.isActive ? 'Đang chạy' : 'Tạm dừng'}</Pill>
                </div>
              </div>
              <div className="mt-2 flex gap-2 text-xs">
                <button onClick={async () => { await financeApi.updateRecurring(r.id, { isActive: !r.isActive }); load(); }} className="rounded-lg bg-[var(--border-color)] px-2 py-1 text-text-secondary">{r.isActive ? 'Tạm dừng' : 'Kích hoạt'}</button>
                <button onClick={async () => { if (confirm('Xoá?')) { await financeApi.deleteRecurring(r.id); toast.success('Đã xoá'); load(); } }} className="inline-flex items-center gap-1 rounded-lg bg-[var(--border-color)] px-2 py-1 text-text-secondary hover:text-neon-red"><Trash2 size={12} /> Xoá</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {creating && <RecurringFormSheet categories={categories} wallets={wallets} onClose={() => setCreating(false)} onSaved={() => { setCreating(false); load(); }} />}
    </FinanceShell>
  );
}

function RecurringFormSheet({ categories, wallets, onClose, onSaved }: { categories: ExpenseCategory[]; wallets: Wallet[]; onClose: () => void; onSaved: () => void }) {
  const [kind, setKind] = useState('EXPENSE');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('MONTHLY');
  const [dayOfMonth, setDayOfMonth] = useState('1');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? 0);
  const [walletId, setWalletId] = useState(wallets[0]?.id ?? 0);
  const [nextRunAt, setNextRunAt] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!description.trim() || !Number(amount)) { toast.error('Nhập mô tả và số tiền'); return; }
    setSaving(true);
    try {
      await financeApi.createRecurring({ kind, description, amount: Number(amount), frequency, dayOfMonth: Number(dayOfMonth) || null, categoryId: kind === 'EXPENSE' ? categoryId : null, walletId, nextRunAt });
      toast.success('Đã tạo'); onSaved();
    } catch { toast.error('Lưu thất bại'); } finally { setSaving(false); }
  };
  return (
    <Sheet open onClose={onClose} title="Giao dịch định kỳ">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-[var(--border-color)] p-1">
          {['EXPENSE', 'INCOME'].map((k) => <button key={k} onClick={() => setKind(k)} className={cn('rounded-lg py-2 text-sm font-medium', kind === k ? 'bg-neon-violet text-white' : 'text-text-secondary')}>{k === 'EXPENSE' ? 'Chi' : 'Thu'}</button>)}
        </div>
        <Field label="Mô tả"><input value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} placeholder="Tiền nhà, Netflix…" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Số tiền"><input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))} className={inputCls} /></Field>
          <Field label="Tần suất"><select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={inputCls}>{Object.keys(FREQ).map((f) => <option key={f} value={f}>{FREQ[f]}</option>)}</select></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {kind === 'EXPENSE' && <Field label="Danh mục"><select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className={inputCls}>{categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></Field>}
          <Field label="Ví"><select value={walletId} onChange={(e) => setWalletId(Number(e.target.value))} className={inputCls}>{wallets.map((w) => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}</select></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ngày trong tháng"><input inputMode="numeric" value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value.replace(/[^\d]/g, ''))} className={inputCls} /></Field>
          <Field label="Lần chạy đầu"><input type="date" value={nextRunAt} onChange={(e) => setNextRunAt(e.target.value)} className={inputCls} /></Field>
        </div>
        <Button onClick={save} disabled={saving} className="w-full">{saving ? 'Đang lưu…' : 'Lưu'}</Button>
      </div>
    </Sheet>
  );
}
