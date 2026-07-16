'use client';
/**
 * Expenses — current-month day-grouped list (sticky date headers, day
 * subtotals), filters (category/wallet/search), month summary strip, category
 * manager (CRUD + budget), CSV export, edit/delete, link to recurring manager.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, Filter, Download, Repeat, Settings2, Trash2, Pencil } from 'lucide-react';
import { financeApi, type Expense, type ExpenseCategory, type Wallet } from '@/lib/finance-api';
import { cn, formatVnd } from '@/lib/utils';
import { FinanceShell } from '@/components/finance/FinanceShell';
import { Card, Button, Sheet, Field, inputCls, Spinner, EmptyState } from '@/components/finance/primitives';

function monthStr(d = new Date()) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; }
function monthRange(m: string) { const [y, mo] = m.split('-').map(Number); return { from: `${m}-01`, to: new Date(y, mo, 0).toISOString().slice(0, 10) }; }

export default function ExpensesPage() {
  const [month, setMonth] = useState(monthStr());
  const [days, setDays] = useState<Array<{ date: string; total: string; items: Expense[] }>>([]);
  const [overview, setOverview] = useState<{ spent: string; prevMonthSpent: string; changePct: number | null } | null>(null);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState<number | ''>('');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [edit, setEdit] = useState<Expense | 'new' | null>(null);
  const [manageCats, setManageCats] = useState(false);

  const range = useMemo(() => monthRange(month), [month]);
  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      financeApi.listExpenses({ from: range.from, to: range.to, categoryId: filterCat || undefined, search: search || undefined, limit: 100 }),
      financeApi.expenseOverview(month),
      financeApi.listCategories(),
      financeApi.listWallets(),
    ]).then(([list, ov, cats, ws]) => {
      setDays(list.data.days); setOverview(ov as never); setCategories(cats); setWallets(ws);
    }).catch(() => undefined).finally(() => setLoading(false));
  }, [range.from, range.to, filterCat, search, month]);
  useEffect(() => { load(); }, [load]);

  const csvHref = financeApi.exportCsvUrl({ from: range.from, to: range.to, ...(filterCat ? { categoryId: String(filterCat) } : {}) });

  return (
    <FinanceShell onQuickAddSuccess={load}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Chi tiêu</h1>
        <div className="flex flex-wrap gap-2">
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={cn(inputCls, 'w-auto')} />
          <Button variant="outline" onClick={() => setShowFilters((v) => !v)}><Filter size={15} /></Button>
          <a href={csvHref} className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] px-3 py-2 text-sm text-text-secondary hover:border-neon-violet/50"><Download size={15} /></a>
          <Link href="/finance/expenses/recurring" className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] px-3 py-2 text-sm text-text-secondary hover:border-neon-violet/50"><Repeat size={15} /></Link>
          <Button variant="outline" onClick={() => setManageCats(true)}><Settings2 size={15} /></Button>
          <Button onClick={() => setEdit('new')}><Plus size={15} /> Ghi chi</Button>
        </div>
      </div>

      {overview && (
        <Card className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-text-muted">Tổng chi tháng này</div>
              <div className="font-heading text-2xl font-bold text-neon-orange tabular-nums">{formatVnd(overview.spent)}</div>
            </div>
            {overview.changePct != null && (
              <div className={cn('text-sm', overview.changePct > 0 ? 'text-neon-red' : 'text-neon-green')}>
                {overview.changePct > 0 ? '▲' : '▼'} {Math.abs(overview.changePct)}% <span className="text-text-muted">so tháng trước</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {showFilters && (
        <Card className="mb-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Danh mục"><select value={filterCat} onChange={(e) => setFilterCat(e.target.value ? Number(e.target.value) : '')} className={inputCls}><option value="">Tất cả</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></Field>
            <Field label="Tìm mô tả"><input value={search} onChange={(e) => setSearch(e.target.value)} className={inputCls} placeholder="Từ khoá…" /></Field>
          </div>
        </Card>
      )}

      {loading && days.length === 0 ? <Spinner /> : days.length === 0 ? (
        <EmptyState icon="🧾" title="Chưa có chi tiêu trong tháng" action={<Button onClick={() => setEdit('new')}><Plus size={15} /> Ghi chi</Button>} />
      ) : (
        <div className="space-y-4">
          {days.map((d) => (
            <div key={d.date}>
              <div className="sticky top-[var(--app-nav-h)] z-10 mb-1.5 flex items-center justify-between bg-[var(--bg-primary)]/80 py-1 backdrop-blur">
                <span className="text-sm font-medium text-text-secondary">{d.date}</span>
                <span className="text-sm font-semibold text-neon-orange tabular-nums">{formatVnd(d.total)}</span>
              </div>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-[var(--border-color)]">
                  {d.items.map((e) => (
                    <div key={e.id} className="group flex items-center gap-3 px-4 py-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl text-lg" style={{ background: (e.category?.color || '#8b5cf6') + '22' }}>{e.category?.icon || '📦'}</div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-text-primary">{e.description || e.category?.name}</div>
                        <div className="text-xs text-text-muted">{e.category?.name}</div>
                      </div>
                      <div className="text-sm font-medium tabular-nums text-neon-red">-{formatVnd(e.amount)}</div>
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button onClick={() => setEdit(e)} className="rounded-lg p-1 text-text-muted hover:text-neon-violet"><Pencil size={14} /></button>
                        <button onClick={async () => { if (confirm('Xoá khoản chi này?')) { await financeApi.deleteExpense(e.id); toast.success('Đã xoá'); load(); } }} className="rounded-lg p-1 text-text-muted hover:text-neon-red"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {edit && <ExpenseFormSheet expense={edit === 'new' ? null : edit} categories={categories} wallets={wallets} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load(); }} />}
      {manageCats && <CategoryManagerSheet categories={categories} onClose={() => setManageCats(false)} onChanged={load} />}
    </FinanceShell>
  );
}

function ExpenseFormSheet({ expense, categories, wallets, onClose, onSaved }: { expense: Expense | null; categories: ExpenseCategory[]; wallets: Wallet[]; onClose: () => void; onSaved: () => void }) {
  const [amount, setAmount] = useState(expense ? String(Math.round(Number(expense.amount))) : '');
  const [categoryId, setCategoryId] = useState(expense?.categoryId ?? categories[0]?.id ?? 0);
  const [walletId, setWalletId] = useState(expense?.walletId ?? wallets[0]?.id ?? 0);
  const [date, setDate] = useState(expense?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState(expense?.description ?? '');
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!Number(amount)) { toast.error('Nhập số tiền'); return; }
    setSaving(true);
    try {
      const body = { amount: Number(amount), categoryId, walletId, date, description: description || undefined };
      if (expense) await financeApi.updateExpense(expense.id, body); else await financeApi.createExpense(body);
      toast.success('Đã lưu'); onSaved();
    } catch { toast.error('Lưu thất bại'); } finally { setSaving(false); }
  };
  return (
    <Sheet open onClose={onClose} title={expense ? 'Sửa khoản chi' : 'Ghi khoản chi'}>
      <div className="space-y-3">
        <Field label="Số tiền"><input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))} className={cn(inputCls, 'text-lg font-semibold')} /></Field>
        <Field label="Danh mục"><select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className={inputCls}>{categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ví"><select value={walletId} onChange={(e) => setWalletId(Number(e.target.value))} className={inputCls}>{wallets.map((w) => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}</select></Field>
          <Field label="Ngày"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></Field>
        </div>
        <Field label="Mô tả"><input value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} /></Field>
        <Button onClick={save} disabled={saving} className="w-full">{saving ? 'Đang lưu…' : 'Lưu'}</Button>
      </div>
    </Sheet>
  );
}

function CategoryManagerSheet({ categories, onClose, onChanged }: { categories: ExpenseCategory[]; onClose: () => void; onChanged: () => void }) {
  const [items, setItems] = useState(categories);
  const [name, setName] = useState(''); const [icon, setIcon] = useState('📦'); const [budget, setBudget] = useState('');
  const refresh = () => financeApi.listCategories().then((c) => { setItems(c); onChanged(); });
  const add = async () => { if (!name.trim()) return; await financeApi.createCategory({ name, icon, monthlyBudget: budget ? Number(budget) : null } as never); setName(''); setBudget(''); toast.success('Đã thêm'); refresh(); };
  return (
    <Sheet open onClose={onClose} title="Quản lý danh mục" size="lg">
      <div className="space-y-3">
        <div className="grid grid-cols-[1fr_auto_1fr_auto] items-end gap-2">
          <Field label="Tên"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></Field>
          <Field label="Icon"><input value={icon} onChange={(e) => setIcon(e.target.value)} className={cn(inputCls, 'w-14 text-center')} maxLength={4} /></Field>
          <Field label="Ngân sách/tháng"><input inputMode="numeric" value={budget} onChange={(e) => setBudget(e.target.value.replace(/[^\d]/g, ''))} className={inputCls} /></Field>
          <Button onClick={add}><Plus size={15} /></Button>
        </div>
        <div className="divide-y divide-[var(--border-color)] rounded-xl border border-[var(--border-color)]">
          {items.map((c) => (
            <CategoryRow key={c.id} cat={c} categories={items} onChanged={refresh} />
          ))}
        </div>
      </div>
    </Sheet>
  );
}

function CategoryRow({ cat, categories, onChanged }: { cat: ExpenseCategory; categories: ExpenseCategory[]; onChanged: () => void }) {
  const [budget, setBudget] = useState(cat.monthlyBudget ? String(Math.round(Number(cat.monthlyBudget))) : '');
  const saveBudget = async () => { await financeApi.updateCategory(cat.id, { monthlyBudget: budget ? Number(budget) : null } as never); toast.success('Đã lưu ngân sách'); onChanged(); };
  const del = async () => {
    const others = categories.filter((c) => c.id !== cat.id);
    const reassign = others[0]?.id;
    if (confirm(`Xoá danh mục "${cat.name}"? Chi tiêu (nếu có) sẽ chuyển sang "${others[0]?.name ?? '—'}".`)) {
      try { await financeApi.deleteCategory(cat.id, reassign); toast.success('Đã xoá'); onChanged(); } catch { toast.error('Không xoá được'); }
    }
  };
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <span className="text-lg">{cat.icon}</span>
      <span className="min-w-0 flex-1 truncate text-sm text-text-primary">{cat.name}</span>
      <input inputMode="numeric" value={budget} onChange={(e) => setBudget(e.target.value.replace(/[^\d]/g, ''))} onBlur={saveBudget} placeholder="Ngân sách" className={cn(inputCls, 'w-28 text-right')} />
      <button onClick={del} className="rounded-lg p-1 text-text-muted hover:text-neon-red"><Trash2 size={15} /></button>
    </div>
  );
}
