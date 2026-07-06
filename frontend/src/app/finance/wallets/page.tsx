'use client';
/**
 * Wallets — cards with balance, CRUD, archive, transfer between wallets, and
 * manual balance adjustment (audited). Total balance header.
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, ArrowLeftRight, Pencil, Archive, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { financeApi, WALLET_TYPE_LABELS, type Wallet } from '@/lib/finance-api';
import { cn, formatVnd } from '@/lib/utils';
import { FinanceShell } from '@/components/finance/FinanceShell';
import { Card, StatCard, Button, Sheet, Field, inputCls, Spinner, EmptyState, Pill } from '@/components/finance/primitives';

const TYPES = Object.keys(WALLET_TYPE_LABELS);

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<Wallet | 'new' | null>(null);
  const [transfer, setTransfer] = useState(false);
  const [adjust, setAdjust] = useState<Wallet | null>(null);

  const load = useCallback(() => {
    financeApi.listWallets(true).then(setWallets).catch(() => undefined).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const total = wallets.filter((w) => !w.isArchived).reduce((a, w) => a + Number(w.balance), 0);

  return (
    <FinanceShell onQuickAddSuccess={load}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Ví</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setTransfer(true)}><ArrowLeftRight size={15} /> Chuyển</Button>
          <Button onClick={() => setEdit('new')}><Plus size={15} /> Thêm ví</Button>
        </div>
      </div>

      <div className="mb-4"><StatCard label="Tổng số dư (ví hoạt động)" value={total} /></div>

      {loading ? <Spinner /> : wallets.length === 0 ? (
        <EmptyState icon="👛" title="Chưa có ví nào" action={<Button onClick={() => setEdit('new')}><Plus size={15} /> Thêm ví</Button>} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {wallets.map((w) => (
            <Card key={w.id} className={cn(w.isArchived && 'opacity-60')}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl text-xl" style={{ background: (w.color || '#8b5cf6') + '22' }}>{w.icon || '👛'}</div>
                  <div>
                    <div className="font-semibold text-text-primary">{w.name}</div>
                    <div className="text-xs text-text-muted">{WALLET_TYPE_LABELS[w.type] ?? w.type}{w.isArchived && ' · đã lưu trữ'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-heading text-lg font-bold tabular-nums text-text-primary">{formatVnd(w.balance)}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                <Link href={`/finance/wallets/${w.id}`} className="inline-flex items-center gap-1 rounded-lg bg-[var(--border-color)] px-2 py-1 text-text-secondary hover:text-neon-violet">Lịch sử <ArrowRight size={12} /></Link>
                <button onClick={() => setAdjust(w)} className="inline-flex items-center gap-1 rounded-lg bg-[var(--border-color)] px-2 py-1 text-text-secondary hover:text-neon-cyan"><SlidersHorizontal size={12} /> Điều chỉnh</button>
                <button onClick={() => setEdit(w)} className="inline-flex items-center gap-1 rounded-lg bg-[var(--border-color)] px-2 py-1 text-text-secondary hover:text-neon-violet"><Pencil size={12} /> Sửa</button>
                <button onClick={async () => { await financeApi.updateWallet(w.id, { isArchived: !w.isArchived }); toast.success(w.isArchived ? 'Đã khôi phục' : 'Đã lưu trữ'); load(); }}
                  className="inline-flex items-center gap-1 rounded-lg bg-[var(--border-color)] px-2 py-1 text-text-secondary hover:text-neon-orange"><Archive size={12} /> {w.isArchived ? 'Khôi phục' : 'Lưu trữ'}</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {edit && <WalletFormSheet wallet={edit === 'new' ? null : edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load(); }} />}
      {transfer && <TransferSheet wallets={wallets.filter((w) => !w.isArchived)} onClose={() => setTransfer(false)} onDone={() => { setTransfer(false); load(); }} />}
      {adjust && <AdjustSheet wallet={adjust} onClose={() => setAdjust(null)} onDone={() => { setAdjust(null); load(); }} />}
    </FinanceShell>
  );
}

function WalletFormSheet({ wallet, onClose, onSaved }: { wallet: Wallet | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(wallet?.name ?? '');
  const [type, setType] = useState(wallet?.type ?? 'CASH');
  const [icon, setIcon] = useState(wallet?.icon ?? '👛');
  const [color, setColor] = useState(wallet?.color ?? '#8b5cf6');
  const [balance, setBalance] = useState(wallet ? '' : '0');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) { toast.error('Nhập tên ví'); return; }
    setSaving(true);
    try {
      if (wallet) await financeApi.updateWallet(wallet.id, { name, type, icon, color });
      else await financeApi.createWallet({ name, type, icon, color, balance: Number(balance) || 0 } as never);
      toast.success('Đã lưu ví'); onSaved();
    } catch { toast.error('Lưu thất bại'); } finally { setSaving(false); }
  };

  return (
    <Sheet open onClose={onClose} title={wallet ? 'Sửa ví' : 'Thêm ví'}>
      <div className="space-y-3">
        <Field label="Tên ví"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Loại"><select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>{TYPES.map((t) => <option key={t} value={t}>{WALLET_TYPE_LABELS[t]}</option>)}</select></Field>
          <Field label="Icon (emoji)"><input value={icon} onChange={(e) => setIcon(e.target.value)} className={inputCls} maxLength={4} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Màu"><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className={cn(inputCls, 'h-10 p-1')} /></Field>
          {!wallet && <Field label="Số dư ban đầu"><input inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value.replace(/[^\d]/g, ''))} className={inputCls} /></Field>}
        </div>
        <Button onClick={save} disabled={saving} className="w-full">{saving ? 'Đang lưu…' : 'Lưu'}</Button>
      </div>
    </Sheet>
  );
}

function TransferSheet({ wallets, onClose, onDone }: { wallets: Wallet[]; onClose: () => void; onDone: () => void }) {
  const [from, setFrom] = useState(wallets[0]?.id ?? 0);
  const [to, setTo] = useState(wallets[1]?.id ?? wallets[0]?.id ?? 0);
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const go = async () => {
    if (from === to) { toast.error('Chọn hai ví khác nhau'); return; }
    if (!Number(amount)) { toast.error('Nhập số tiền'); return; }
    setSaving(true);
    try { await financeApi.transfer({ fromWalletId: from, toWalletId: to, amount: Number(amount) }); toast.success('Đã chuyển'); onDone(); }
    catch { toast.error('Chuyển thất bại'); } finally { setSaving(false); }
  };
  return (
    <Sheet open onClose={onClose} title="Chuyển tiền giữa ví">
      <div className="space-y-3">
        <Field label="Từ ví"><select value={from} onChange={(e) => setFrom(Number(e.target.value))} className={inputCls}>{wallets.map((w) => <option key={w.id} value={w.id}>{w.icon} {w.name} — {formatVnd(w.balance)}</option>)}</select></Field>
        <Field label="Đến ví"><select value={to} onChange={(e) => setTo(Number(e.target.value))} className={inputCls}>{wallets.map((w) => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}</select></Field>
        <Field label="Số tiền"><input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))} className={inputCls} /></Field>
        <Button onClick={go} disabled={saving} className="w-full">{saving ? 'Đang chuyển…' : 'Chuyển'}</Button>
      </div>
    </Sheet>
  );
}

function AdjustSheet({ wallet, onClose, onDone }: { wallet: Wallet; onClose: () => void; onDone: () => void }) {
  const [target, setTarget] = useState(String(Math.round(Number(wallet.balance))));
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const go = async () => {
    setSaving(true);
    try { await financeApi.adjustWallet(wallet.id, { targetBalance: Number(target) || 0, reason: reason || undefined }); toast.success('Đã điều chỉnh'); onDone(); }
    catch { toast.error('Thất bại'); } finally { setSaving(false); }
  };
  return (
    <Sheet open onClose={onClose} title={`Điều chỉnh số dư — ${wallet.name}`}>
      <div className="space-y-3">
        <div className="text-sm text-text-muted">Số dư hiện tại: <b className="text-text-primary">{formatVnd(wallet.balance)}</b></div>
        <Field label="Số dư mới"><input inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value.replace(/[^\d]/g, ''))} className={inputCls} /></Field>
        <Field label="Lý do (ghi vào lịch sử)"><input value={reason} onChange={(e) => setReason(e.target.value)} className={inputCls} placeholder="VD: kiểm kê tiền mặt" /></Field>
        <Button onClick={go} disabled={saving} className="w-full">{saving ? 'Đang lưu…' : 'Cập nhật số dư'}</Button>
      </div>
    </Sheet>
  );
}
