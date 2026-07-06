'use client';
/**
 * Investments — two tabs: Bản thân (SELF: courses/skills, expected outcome,
 * complete with result note) and Tài sản (ASSET: money-in vs current value,
 * gain/loss badge, sell). Summary header with unrealized gain/loss.
 */
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';
import { financeApi, type Investment, type Wallet } from '@/lib/finance-api';
import { cn, formatVnd } from '@/lib/utils';
import { FinanceShell } from '@/components/finance/FinanceShell';
import { Card, StatCard, Button, Sheet, Field, inputCls, Spinner, EmptyState, Pill } from '@/components/finance/primitives';

type Tab = 'SELF' | 'ASSET';

export default function InvestmentsPage() {
  const [tab, setTab] = useState<Tab>('ASSET');
  const [items, setItems] = useState<Investment[]>([]);
  const [summary, setSummary] = useState<{ totalInvested: string; selfInvestedThisYear: string; currentAssetValue: string; unrealizedGain: string; unrealizedGainPct: number } | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<Investment | 'new' | null>(null);
  const [sellTarget, setSellTarget] = useState<Investment | null>(null);
  const [completeTarget, setCompleteTarget] = useState<Investment | null>(null);

  const load = useCallback(() => {
    Promise.all([financeApi.listInvestments(tab), financeApi.investmentSummary(), financeApi.listWallets()])
      .then(([list, s, w]) => { setItems(list); setSummary(s as never); setWallets(w); })
      .catch(() => undefined).finally(() => setLoading(false));
  }, [tab]);
  useEffect(() => { load(); }, [load]);

  return (
    <FinanceShell onQuickAddSuccess={load}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Đầu tư</h1>
        <Button onClick={() => setEdit('new')}><Plus size={15} /> Thêm</Button>
      </div>

      {summary && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Tổng đã đầu tư" value={summary.totalInvested} accent="default" />
          <StatCard label="Đầu tư bản thân (năm nay)" value={summary.selfInvestedThisYear} accent="savings" />
          <StatCard label="Giá trị tài sản hiện tại" value={summary.currentAssetValue} accent="default" />
          <StatCard label="Lãi/lỗ chưa thực hiện" value={summary.unrealizedGain} accent={Number(summary.unrealizedGain) >= 0 ? 'income' : 'expense'}
            sub={<span className={Number(summary.unrealizedGain) >= 0 ? 'text-neon-green' : 'text-neon-red'}>{summary.unrealizedGainPct >= 0 ? '+' : ''}{summary.unrealizedGainPct}%</span>} />
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-[var(--border-color)] p-1 sm:w-64">
        {(['ASSET', 'SELF'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn('rounded-lg py-2 text-sm font-medium', tab === t ? 'bg-neon-violet text-white' : 'text-text-secondary')}>{t === 'ASSET' ? '💎 Tài sản' : '🎓 Bản thân'}</button>
        ))}
      </div>

      {loading ? <Spinner /> : items.length === 0 ? (
        <EmptyState icon={tab === 'ASSET' ? '💎' : '🎓'} title={tab === 'ASSET' ? 'Chưa có tài sản nào' : 'Chưa có khoản đầu tư bản thân'} action={<Button onClick={() => setEdit('new')}><Plus size={15} /> Thêm</Button>} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((inv) => tab === 'ASSET' ? (
            <AssetCard key={inv.id} inv={inv} onSell={() => setSellTarget(inv)} onEdit={() => setEdit(inv)} onDelete={async () => { if (confirm('Xoá?')) { await financeApi.deleteInvestment(inv.id); toast.success('Đã xoá'); load(); } }} />
          ) : (
            <SelfCard key={inv.id} inv={inv} onComplete={() => setCompleteTarget(inv)} onEdit={() => setEdit(inv)} onDelete={async () => { if (confirm('Xoá?')) { await financeApi.deleteInvestment(inv.id); toast.success('Đã xoá'); load(); } }} />
          ))}
        </div>
      )}

      {edit && <InvestmentForm investment={edit === 'new' ? null : edit} defaultType={tab} wallets={wallets} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load(); }} />}
      {sellTarget && <SellSheet inv={sellTarget} wallets={wallets} onClose={() => setSellTarget(null)} onDone={() => { setSellTarget(null); load(); }} />}
      {completeTarget && <CompleteSheet inv={completeTarget} onClose={() => setCompleteTarget(null)} onDone={() => { setCompleteTarget(null); load(); }} />}
    </FinanceShell>
  );
}

function AssetCard({ inv, onSell, onEdit, onDelete }: { inv: Investment; onSell: () => void; onEdit: () => void; onDelete: () => void }) {
  const cost = Number(inv.amount);
  const current = Number(inv.currentValue ?? inv.amount);
  const gain = current - cost;
  const pct = cost ? Math.round((gain / cost) * 1000) / 10 : 0;
  const up = gain >= 0;
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div><div className="font-semibold text-text-primary">{inv.name}</div><div className="text-xs text-text-muted">{inv.date.slice(0, 10)}{inv.status === 'SOLD' && ' · đã bán'}</div></div>
        <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', up ? 'bg-neon-green/15 text-neon-green' : 'bg-neon-red/15 text-neon-red')}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{up ? '+' : ''}{formatVnd(gain)} ({pct}%)
        </span>
      </div>
      <div className="mt-2 flex items-baseline justify-between text-sm">
        <span className="text-text-muted">Vốn: <b className="text-text-primary">{formatVnd(cost)}</b></span>
        <span className="text-text-muted">Hiện tại: <b className={up ? 'text-neon-green' : 'text-neon-red'}>{formatVnd(current)}</b></span>
      </div>
      {inv.status !== 'SOLD' && (
        <div className="mt-2 flex gap-1.5 text-xs">
          <button onClick={onEdit} className="rounded-lg bg-[var(--border-color)] px-2 py-1 text-text-secondary">Cập nhật giá trị</button>
          <button onClick={onSell} className="rounded-lg bg-neon-violet/15 px-2 py-1 text-neon-violet">Bán</button>
          <button onClick={onDelete} className="ml-auto rounded-lg p-1 text-text-muted hover:text-neon-red"><Trash2 size={14} /></button>
        </div>
      )}
    </Card>
  );
}

function SelfCard({ inv, onComplete, onEdit, onDelete }: { inv: Investment; onComplete: () => void; onEdit: () => void; onDelete: () => void }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div><div className="font-semibold text-text-primary">{inv.name}</div><div className="text-xs text-text-muted">{inv.date.slice(0, 10)}</div></div>
        <Pill tone={inv.status === 'COMPLETED' ? 'green' : 'violet'}>{inv.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang học'}</Pill>
      </div>
      <div className="mt-1 text-lg font-heading font-bold text-neon-violet">{formatVnd(inv.amount)}</div>
      {inv.expectedOutcome && <div className="mt-1 text-sm text-text-secondary">🎯 {inv.expectedOutcome}</div>}
      {inv.outcomeNote && <div className="mt-1 rounded-lg bg-neon-green/10 px-2 py-1 text-sm text-neon-green">✅ {inv.outcomeNote}</div>}
      <div className="mt-2 flex gap-1.5 text-xs">
        <button onClick={onEdit} className="rounded-lg bg-[var(--border-color)] px-2 py-1 text-text-secondary"><Pencil size={12} className="inline" /> Sửa</button>
        {inv.status !== 'COMPLETED' && <button onClick={onComplete} className="inline-flex items-center gap-1 rounded-lg bg-neon-green/15 px-2 py-1 text-neon-green"><CheckCircle2 size={12} /> Hoàn thành</button>}
        <button onClick={onDelete} className="ml-auto rounded-lg p-1 text-text-muted hover:text-neon-red"><Trash2 size={14} /></button>
      </div>
    </Card>
  );
}

function InvestmentForm({ investment, defaultType, wallets, onClose, onSaved }: { investment: Investment | null; defaultType: Tab; wallets: Wallet[]; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!investment;
  const type = investment?.type ?? defaultType;
  const [name, setName] = useState(investment?.name ?? '');
  const [amount, setAmount] = useState(investment ? String(Math.round(Number(investment.amount))) : '');
  const [date, setDate] = useState(investment?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [walletId, setWalletId] = useState<number | ''>('');
  const [expectedOutcome, setExpectedOutcome] = useState(investment?.expectedOutcome ?? '');
  const [currentValue, setCurrentValue] = useState(investment?.currentValue ? String(Math.round(Number(investment.currentValue))) : '');
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!name.trim() || (!isEdit && !Number(amount))) { toast.error('Nhập tên và số tiền'); return; }
    setSaving(true);
    try {
      if (isEdit) {
        await financeApi.updateInvestment(investment!.id, { name, expectedOutcome: expectedOutcome || undefined, currentValue: currentValue ? Number(currentValue) : undefined });
      } else {
        await financeApi.createInvestment({ type, name, amount: Number(amount), date, walletId: walletId || null, expectedOutcome: type === 'SELF' ? expectedOutcome : undefined, currentValue: type === 'ASSET' && currentValue ? Number(currentValue) : undefined });
      }
      toast.success('Đã lưu'); onSaved();
    } catch { toast.error('Lưu thất bại'); } finally { setSaving(false); }
  };
  return (
    <Sheet open onClose={onClose} title={isEdit ? 'Cập nhật' : type === 'SELF' ? 'Đầu tư bản thân' : 'Thêm tài sản'}>
      <div className="space-y-3">
        <Field label="Tên"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder={type === 'SELF' ? 'Khóa Unity, Sách…' : 'Vàng SJC, cổ phiếu…'} /></Field>
        {!isEdit && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Số tiền"><input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))} className={inputCls} /></Field>
            <Field label="Ngày"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></Field>
          </div>
        )}
        {!isEdit && <Field label="Trừ từ ví (tuỳ chọn)"><select value={walletId} onChange={(e) => setWalletId(e.target.value ? Number(e.target.value) : '')} className={inputCls}><option value="">— Không trừ ví —</option>{wallets.map((w) => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}</select></Field>}
        {type === 'SELF' && <Field label="Kỳ vọng nhận được"><textarea value={expectedOutcome} onChange={(e) => setExpectedOutcome(e.target.value)} className={cn(inputCls, 'min-h-[60px]')} placeholder="Kỹ năng / kết quả mong đợi" /></Field>}
        {type === 'ASSET' && <Field label="Giá trị hiện tại (₫)"><input inputMode="numeric" value={currentValue} onChange={(e) => setCurrentValue(e.target.value.replace(/[^\d]/g, ''))} className={inputCls} placeholder="Cập nhật thủ công" /></Field>}
        <Button onClick={save} disabled={saving} className="w-full">{saving ? 'Đang lưu…' : 'Lưu'}</Button>
      </div>
    </Sheet>
  );
}

function SellSheet({ inv, wallets, onClose, onDone }: { inv: Investment; wallets: Wallet[]; onClose: () => void; onDone: () => void }) {
  const [saleAmount, setSaleAmount] = useState(String(Math.round(Number(inv.currentValue ?? inv.amount))));
  const [walletId, setWalletId] = useState<number | ''>(wallets[0]?.id ?? '');
  const [saving, setSaving] = useState(false);
  const go = async () => {
    setSaving(true);
    try { await financeApi.sellInvestment(inv.id, { saleAmount: Number(saleAmount) || undefined, walletId: walletId || null }); toast.success('Đã bán'); onDone(); }
    catch { toast.error('Thất bại'); } finally { setSaving(false); }
  };
  return (
    <Sheet open onClose={onClose} title={`Bán: ${inv.name}`}>
      <div className="space-y-3">
        <Field label="Giá bán (₫)"><input inputMode="numeric" value={saleAmount} onChange={(e) => setSaleAmount(e.target.value.replace(/[^\d]/g, ''))} className={inputCls} /></Field>
        <Field label="Cộng vào ví"><select value={walletId} onChange={(e) => setWalletId(e.target.value ? Number(e.target.value) : '')} className={inputCls}><option value="">— Không cộng ví —</option>{wallets.map((w) => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}</select></Field>
        <Button onClick={go} disabled={saving} className="w-full">{saving ? 'Đang lưu…' : 'Xác nhận bán'}</Button>
      </div>
    </Sheet>
  );
}

function CompleteSheet({ inv, onClose, onDone }: { inv: Investment; onClose: () => void; onDone: () => void }) {
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const go = async () => {
    setSaving(true);
    try { await financeApi.completeInvestment(inv.id, note || undefined); toast.success('Đã đánh dấu hoàn thành'); onDone(); }
    catch { toast.error('Thất bại'); } finally { setSaving(false); }
  };
  return (
    <Sheet open onClose={onClose} title={`Hoàn thành: ${inv.name}`}>
      <div className="space-y-3">
        <Field label="Kết quả nhận được"><textarea value={note} onChange={(e) => setNote(e.target.value)} className={cn(inputCls, 'min-h-[80px]')} placeholder="Bạn đã học/đạt được gì?" /></Field>
        <Button onClick={go} disabled={saving} className="w-full">{saving ? 'Đang lưu…' : 'Hoàn thành'}</Button>
      </div>
    </Sheet>
  );
}
