'use client';
/**
 * Savings — two sections: term-deposit accounts (maturity countdown, projected
 * interest at maturity, withdraw) and goals (progress ring, "+ nạp thêm" from a
 * wallet, per-month hint to hit a deadline).
 */
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Landmark, Target } from 'lucide-react';
import { financeApi, type SavingsAccount, type SavingsGoal, type Wallet } from '@/lib/finance-api';
import { cn, formatVnd } from '@/lib/utils';
import { FinanceShell } from '@/components/finance/FinanceShell';
import { Card, StatCard, Button, Sheet, Field, inputCls, Spinner, EmptyState, Pill } from '@/components/finance/primitives';

export default function SavingsPage() {
  const [accounts, setAccounts] = useState<SavingsAccount[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [summary, setSummary] = useState<{ totalSaved: string; projectedInterest: string; goalsSaved: string } | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAccount, setNewAccount] = useState(false);
  const [newGoal, setNewGoal] = useState(false);
  const [withdraw, setWithdraw] = useState<SavingsAccount | null>(null);
  const [contribute, setContribute] = useState<SavingsGoal | null>(null);

  const load = useCallback(() => {
    Promise.all([financeApi.listSavingsAccounts(), financeApi.listSavingsGoals(), financeApi.savingsSummary(), financeApi.listWallets()])
      .then(([a, g, s, w]) => { setAccounts(a); setGoals(g); setSummary(s as never); setWallets(w); })
      .catch(() => undefined).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <FinanceShell onQuickAddSuccess={load}>
      <h1 className="mb-4 font-heading text-2xl font-bold text-text-primary">Tiết kiệm</h1>

      {summary && (
        <div className="mb-4 grid grid-cols-3 gap-3">
          <StatCard label="Đang gửi" value={summary.totalSaved} accent="savings" />
          <StatCard label="Lãi dự kiến" value={summary.projectedInterest} accent="income" />
          <StatCard label="Trong mục tiêu" value={summary.goalsSaved} accent="default" />
        </div>
      )}

      {loading ? <Spinner /> : (
        <div className="space-y-6">
          {/* Accounts */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-heading font-semibold text-text-primary"><Landmark size={18} className="text-neon-cyan" /> Sổ tiết kiệm</h2>
              <Button variant="outline" onClick={() => setNewAccount(true)}><Plus size={15} /> Mở sổ</Button>
            </div>
            {accounts.length === 0 ? <EmptyState icon="🏦" title="Chưa có sổ tiết kiệm" /> : (
              <div className="grid gap-3 sm:grid-cols-2">
                {accounts.map((a) => (
                  <Card key={a.id}>
                    <div className="flex items-start justify-between">
                      <div><div className="font-semibold text-text-primary">{a.bankName}</div><div className="text-xs text-text-muted">{Number(a.interestRatePerYear)}%/năm · {a.termMonths} tháng</div></div>
                      <Pill tone={a.status === 'ACTIVE' ? 'green' : a.status === 'MATURED' ? 'orange' : 'default'}>{a.status === 'ACTIVE' ? 'Đang gửi' : a.status === 'MATURED' ? 'Đáo hạn' : 'Đã tất toán'}</Pill>
                    </div>
                    <div className="mt-2 text-lg font-heading font-bold text-neon-cyan tabular-nums">{formatVnd(a.amount)}</div>
                    <div className="mt-1 flex items-center justify-between text-xs text-text-muted">
                      <span title={`${formatVnd(a.amount)} × ${Number(a.interestRatePerYear)}% × ${a.termMonths}/12`}>Lãi đáo hạn: <b className="text-neon-green">{formatVnd(a.computed?.projectedInterest ?? 0)}</b></span>
                      <span>{a.computed && a.computed.daysToMaturity > 0 ? `đáo hạn sau ${a.computed.daysToMaturity} ngày` : 'đã đến hạn'}</span>
                    </div>
                    {a.status !== 'WITHDRAWN' && (
                      <div className="mt-2 flex gap-1.5 text-xs">
                        <button onClick={() => setWithdraw(a)} className="rounded-lg bg-neon-violet/15 px-2 py-1 text-neon-violet">Tất toán</button>
                        <button onClick={async () => { if (confirm('Xoá sổ này?')) { await financeApi.deleteSavingsAccount(a.id); toast.success('Đã xoá'); load(); } }} className="ml-auto rounded-lg p-1 text-text-muted hover:text-neon-red"><Trash2 size={14} /></button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Goals */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-heading font-semibold text-text-primary"><Target size={18} className="text-neon-violet" /> Mục tiêu</h2>
              <Button variant="outline" onClick={() => setNewGoal(true)}><Plus size={15} /> Thêm mục tiêu</Button>
            </div>
            {goals.length === 0 ? <EmptyState icon="🎯" title="Chưa có mục tiêu nào" /> : (
              <div className="grid gap-3 sm:grid-cols-2">
                {goals.map((g) => (
                  <Card key={g.id}>
                    <div className="flex items-center gap-3">
                      <Ring pct={g.computed?.pct ?? 0} icon={g.icon || '🎯'} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-text-primary">{g.name}</div>
                        <div className="text-sm text-text-secondary">{formatVnd(g.currentAmount)} / {formatVnd(g.targetAmount)}</div>
                        {g.deadline && g.computed?.perMonthHint && Number(g.computed.perMonthHint) > 0 && (
                          <div className="text-xs text-text-muted">cần {formatVnd(g.computed.perMonthHint)}/tháng để kịp hạn</div>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex gap-1.5 text-xs">
                      <button onClick={() => setContribute(g)} className="rounded-lg bg-neon-green/15 px-2 py-1 text-neon-green">+ Nạp thêm</button>
                      {g.status === 'ACHIEVED' && <Pill tone="green">Đã đạt 🎉</Pill>}
                      <button onClick={async () => { if (confirm('Xoá mục tiêu?')) { await financeApi.deleteSavingsGoal(g.id); toast.success('Đã xoá'); load(); } }} className="ml-auto rounded-lg p-1 text-text-muted hover:text-neon-red"><Trash2 size={14} /></button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {newAccount && <AccountForm wallets={wallets} onClose={() => setNewAccount(false)} onSaved={() => { setNewAccount(false); load(); }} />}
      {newGoal && <GoalForm onClose={() => setNewGoal(false)} onSaved={() => { setNewGoal(false); load(); }} />}
      {withdraw && <WithdrawSheet account={withdraw} wallets={wallets} onClose={() => setWithdraw(null)} onDone={() => { setWithdraw(null); load(); }} />}
      {contribute && <ContributeSheet goal={contribute} wallets={wallets} onClose={() => setContribute(null)} onDone={() => { setContribute(null); load(); }} />}
    </FinanceShell>
  );
}

function Ring({ pct, icon }: { pct: number; icon: string }) {
  const r = 22; const c = 2 * Math.PI * r; const off = c * (1 - Math.min(100, pct) / 100);
  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke="var(--border-color)" strokeWidth="5" />
        <circle cx="28" cy="28" r={r} fill="none" stroke="#8b5cf6" strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-lg">{icon}</div>
    </div>
  );
}

function AccountForm({ wallets, onClose, onSaved }: { wallets: Wallet[]; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ bankName: '', amount: '', interestRatePerYear: '', termMonths: '6', startDate: new Date().toISOString().slice(0, 10), walletId: '' as number | '', autoRenew: false });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));
  const projected = Number(f.amount) && Number(f.interestRatePerYear) && Number(f.termMonths)
    ? Math.round(Number(f.amount) * Number(f.interestRatePerYear) / 100 * Number(f.termMonths) / 12) : 0;
  const save = async () => {
    if (!f.bankName.trim() || !Number(f.amount) || !Number(f.termMonths)) { toast.error('Nhập đủ thông tin'); return; }
    setSaving(true);
    try { await financeApi.createSavingsAccount({ bankName: f.bankName, amount: Number(f.amount), interestRatePerYear: Number(f.interestRatePerYear) || 0, termMonths: Number(f.termMonths), startDate: f.startDate, walletId: f.walletId || null, autoRenew: f.autoRenew }); toast.success('Đã mở sổ'); onSaved(); }
    catch { toast.error('Thất bại'); } finally { setSaving(false); }
  };
  return (
    <Sheet open onClose={onClose} title="Mở sổ tiết kiệm">
      <div className="space-y-3">
        <Field label="Ngân hàng"><input value={f.bankName} onChange={(e) => set('bankName', e.target.value)} className={inputCls} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Số tiền gửi"><input inputMode="numeric" value={f.amount} onChange={(e) => set('amount', e.target.value.replace(/[^\d]/g, ''))} className={inputCls} /></Field>
          <Field label="Lãi %/năm"><input inputMode="decimal" value={f.interestRatePerYear} onChange={(e) => set('interestRatePerYear', e.target.value.replace(/[^\d.]/g, ''))} className={inputCls} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Kỳ hạn (tháng)"><input inputMode="numeric" value={f.termMonths} onChange={(e) => set('termMonths', e.target.value.replace(/[^\d]/g, ''))} className={inputCls} /></Field>
          <Field label="Ngày gửi"><input type="date" value={f.startDate} onChange={(e) => set('startDate', e.target.value)} className={inputCls} /></Field>
        </div>
        <Field label="Trừ từ ví (tuỳ chọn)"><select value={f.walletId} onChange={(e) => set('walletId', e.target.value ? Number(e.target.value) : '')} className={inputCls}><option value="">— Không trừ ví —</option>{wallets.map((w) => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}</select></Field>
        {projected > 0 && <div className="rounded-xl bg-neon-green/10 px-3 py-2 text-sm text-neon-green">Lãi dự kiến đáo hạn: <b>{formatVnd(projected)}</b></div>}
        <Button onClick={save} disabled={saving} className="w-full">{saving ? 'Đang lưu…' : 'Mở sổ'}</Button>
      </div>
    </Sheet>
  );
}

function GoalForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(''); const [icon, setIcon] = useState('🎯'); const [targetAmount, setTargetAmount] = useState(''); const [deadline, setDeadline] = useState(''); const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!name.trim() || !Number(targetAmount)) { toast.error('Nhập tên và số tiền mục tiêu'); return; }
    setSaving(true);
    try { await financeApi.createSavingsGoal({ name, icon, targetAmount: Number(targetAmount), deadline: deadline || null }); toast.success('Đã thêm mục tiêu'); onSaved(); }
    catch { toast.error('Thất bại'); } finally { setSaving(false); }
  };
  return (
    <Sheet open onClose={onClose} title="Thêm mục tiêu">
      <div className="space-y-3">
        <div className="grid grid-cols-[auto_1fr] gap-3">
          <Field label="Icon"><input value={icon} onChange={(e) => setIcon(e.target.value)} className={cn(inputCls, 'w-16 text-center')} maxLength={4} /></Field>
          <Field label="Tên mục tiêu"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Mua MacBook…" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Số tiền mục tiêu"><input inputMode="numeric" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value.replace(/[^\d]/g, ''))} className={inputCls} /></Field>
          <Field label="Hạn (tuỳ chọn)"><input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputCls} /></Field>
        </div>
        <Button onClick={save} disabled={saving} className="w-full">{saving ? 'Đang lưu…' : 'Thêm'}</Button>
      </div>
    </Sheet>
  );
}

function WithdrawSheet({ account, wallets, onClose, onDone }: { account: SavingsAccount; wallets: Wallet[]; onClose: () => void; onDone: () => void }) {
  const [walletId, setWalletId] = useState<number | ''>(wallets[0]?.id ?? '');
  const [includeInterest, setIncludeInterest] = useState(true);
  const [saving, setSaving] = useState(false);
  const go = async () => {
    setSaving(true);
    try { await financeApi.withdrawSavingsAccount(account.id, { walletId: walletId || null, includeInterest }); toast.success('Đã tất toán'); onDone(); }
    catch { toast.error('Thất bại'); } finally { setSaving(false); }
  };
  return (
    <Sheet open onClose={onClose} title={`Tất toán: ${account.bankName}`}>
      <div className="space-y-3">
        <div className="rounded-xl bg-[var(--border-color)]/40 p-3 text-sm">
          <div className="flex justify-between"><span className="text-text-muted">Gốc</span><span>{formatVnd(account.amount)}</span></div>
          <div className="mt-1 flex justify-between"><span className="text-text-muted">Lãi</span><span className="text-neon-green">{formatVnd(account.computed?.projectedInterest ?? 0)}</span></div>
          <div className="mt-1 flex justify-between font-semibold"><span>Nhận về</span><span>{formatVnd(account.computed?.maturityValue ?? account.amount)}</span></div>
        </div>
        <label className="flex items-center gap-2 text-sm text-text-secondary"><input type="checkbox" checked={includeInterest} onChange={(e) => setIncludeInterest(e.target.checked)} /> Cộng cả lãi</label>
        <Field label="Cộng vào ví"><select value={walletId} onChange={(e) => setWalletId(e.target.value ? Number(e.target.value) : '')} className={inputCls}><option value="">— Không cộng ví —</option>{wallets.map((w) => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}</select></Field>
        <Button onClick={go} disabled={saving} className="w-full">{saving ? 'Đang lưu…' : 'Tất toán'}</Button>
      </div>
    </Sheet>
  );
}

function ContributeSheet({ goal, wallets, onClose, onDone }: { goal: SavingsGoal; wallets: Wallet[]; onClose: () => void; onDone: () => void }) {
  const [amount, setAmount] = useState(''); const [walletId, setWalletId] = useState<number | ''>(wallets[0]?.id ?? ''); const [saving, setSaving] = useState(false);
  const go = async () => {
    if (!Number(amount)) { toast.error('Nhập số tiền'); return; }
    setSaving(true);
    try { await financeApi.contributeToGoal(goal.id, { amount: Number(amount), walletId: walletId || null }); toast.success('Đã nạp'); onDone(); }
    catch { toast.error('Thất bại'); } finally { setSaving(false); }
  };
  return (
    <Sheet open onClose={onClose} title={`Nạp thêm: ${goal.name}`}>
      <div className="space-y-3">
        <div className="text-sm text-text-muted">Còn thiếu: <b className="text-text-primary">{formatVnd(goal.computed?.remaining ?? 0)}</b></div>
        <Field label="Số tiền nạp"><input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))} className={cn(inputCls, 'text-lg font-semibold')} /></Field>
        <Field label="Trừ từ ví"><select value={walletId} onChange={(e) => setWalletId(e.target.value ? Number(e.target.value) : '')} className={inputCls}><option value="">— Không trừ ví —</option>{wallets.map((w) => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}</select></Field>
        <Button onClick={go} disabled={saving} className="w-full">{saving ? 'Đang lưu…' : 'Nạp'}</Button>
      </div>
    </Sheet>
  );
}
