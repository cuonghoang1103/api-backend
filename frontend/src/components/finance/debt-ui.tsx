'use client';
/**
 * Shared Debt UI: PayScheduleSheet (tick-to-pay with wallet select + editable
 * amount), DebtCard (list card), DebtForm (new/edit with LIVE schedule preview
 * + contract-photo upload). Reused by the dashboard, debts list, and detail.
 */
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { CreditCard, AlertTriangle, CheckCircle2, Upload } from 'lucide-react';
import { fileApi } from '@/lib/api';
import {
  financeApi, interestLabel, LENDER_TYPE_LABELS, INTEREST_TYPE_LABELS,
  type Debt, type ScheduleItem, type Wallet, type DebtComputation,
} from '@/lib/finance-api';
import { cn, formatVnd } from '@/lib/utils';
import { Sheet, Button, Field, inputCls, Pill, ProgressBar } from './primitives';

// ─── Tick-to-pay ─────────────────────────────────────────────
export function PayScheduleSheet({ open, onClose, debtId, item, onPaid }: {
  open: boolean; onClose: () => void; debtId: number;
  item: Pick<ScheduleItem, 'id' | 'installmentNo' | 'amountDue' | 'dueDate'> | null;
  onPaid: (debt: Debt) => void;
}) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletId, setWalletId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !item) return;
    setAmount(String(Math.round(Number(item.amountDue))));
    financeApi.listWallets().then((w) => { setWallets(w); setWalletId(w[0]?.id ?? null); }).catch(() => undefined);
  }, [open, item]);

  const confirm = async () => {
    if (!item) return;
    setSaving(true);
    try {
      const debt = await financeApi.payScheduleItem(debtId, item.id, {
        walletId: walletId ?? null,
        actualAmount: Number(amount) || undefined,
      });
      toast.success('Đã ghi nhận thanh toán');
      onPaid(debt);
      onClose();
    } catch (e) {
      toast.error('Thanh toán thất bại');
    } finally { setSaving(false); }
  };

  return (
    <Sheet open={open} onClose={onClose} title={item ? `Thanh toán kỳ ${item.installmentNo}` : 'Thanh toán'}>
      {item && (
        <div className="space-y-4">
          <div className="rounded-xl bg-[var(--border-color)]/40 p-3 text-sm">
            <div className="flex justify-between"><span className="text-text-muted">Đến hạn</span><span className="text-text-primary">{item.dueDate.slice(0, 10)}</span></div>
            <div className="mt-1 flex justify-between"><span className="text-text-muted">Cần trả</span><span className="font-semibold text-text-primary">{formatVnd(item.amountDue)}</span></div>
          </div>
          <Field label="Số tiền thực trả">
            <input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))} className={inputCls} />
          </Field>
          <div>
            <div className="mb-1.5 text-xs font-medium text-text-secondary">Trừ từ ví</div>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => setWalletId(null)}
                className={cn('rounded-full border px-3 py-1.5 text-sm', walletId === null ? 'border-neon-violet bg-neon-violet/15 text-neon-violet' : 'border-[var(--border-color)] text-text-secondary')}>
                Không trừ ví
              </button>
              {wallets.map((w) => (
                <button key={w.id} onClick={() => setWalletId(w.id)}
                  className={cn('rounded-full border px-3 py-1.5 text-sm', walletId === w.id ? 'border-neon-cyan bg-neon-cyan/15 text-neon-cyan' : 'border-[var(--border-color)] text-text-secondary')}>
                  {w.icon} {w.name}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={confirm} disabled={saving} className="w-full">{saving ? 'Đang lưu…' : 'Xác nhận đã trả'}</Button>
        </div>
      )}
    </Sheet>
  );
}

// ─── Debt status pill ────────────────────────────────────────
export function DebtStatusPill({ status }: { status: string }) {
  if (status === 'PAID_OFF') return <Pill tone="green"><CheckCircle2 size={12} className="mr-1" /> Đã trả xong</Pill>;
  if (status === 'OVERDUE') return <span className="inline-flex items-center rounded-full bg-neon-red/15 px-2 py-0.5 text-xs font-medium text-neon-red animate-pulse"><AlertTriangle size={12} className="mr-1" /> Quá hạn</span>;
  return <Pill tone="violet">Đang vay</Pill>;
}

// ─── Debt card ───────────────────────────────────────────────
export function DebtCard({ debt, onClick }: { debt: Debt; onClick?: () => void }) {
  const remaining = Number(debt.computed?.remaining ?? debt.principal);
  const principal = Number(debt.principal);
  const progress = debt.computed?.progressPct ?? 0;
  return (
    <div onClick={onClick} className="cursor-pointer rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 transition-colors hover:border-neon-violet/50">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neon-red/10 text-neon-red"><CreditCard size={18} /></div>
          <div className="min-w-0">
            <div className="truncate font-semibold text-text-primary">{debt.lenderName}</div>
            <div className="text-xs text-text-muted">{LENDER_TYPE_LABELS[debt.lenderType] ?? debt.lenderType}</div>
          </div>
        </div>
        <DebtStatusPill status={debt.status} />
      </div>

      <div className="mt-3">
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-heading font-bold text-neon-red tabular-nums">{formatVnd(remaining)}</span>
          <span className="text-xs text-text-muted">/ {formatVnd(principal)}</span>
        </div>
        <div className="mt-1.5"><ProgressBar ratio={progress} status="ok" /></div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-text-secondary">{interestLabel(debt)}</span>
        {debt.computed?.nextDueDate && (
          <span className="text-text-muted">Kỳ tới: {debt.computed.nextDueDate.slice(0, 10)}</span>
        )}
      </div>
    </div>
  );
}

// ─── New / edit form with live preview ───────────────────────
const LENDER_TYPES = Object.keys(LENDER_TYPE_LABELS);
const INTEREST_TYPES = Object.keys(INTEREST_TYPE_LABELS);

export function DebtForm({ initial, onSaved, onCancel }: { initial?: Debt; onSaved: (d: Debt) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    lenderName: initial?.lenderName ?? '',
    lenderType: initial?.lenderType ?? 'LOAN_APP',
    principal: initial ? String(Math.round(Number(initial.principal))) : '',
    interestType: initial?.interestType ?? 'DAILY_PERCENT',
    interestRate: initial ? String(initial.interestRate) : '',
    startDate: initial?.startDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    termMonths: initial?.termMonths ? String(initial.termMonths) : '',
    paymentDay: initial?.paymentDay ? String(initial.paymentDay) : '',
    note: initial?.note ?? '',
    attachmentUrl: initial?.attachmentUrl ?? '',
  });
  const [preview, setPreview] = useState<DebtComputation | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout>>();
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const needsTerm = form.interestType !== 'DAILY_PERCENT';

  useEffect(() => {
    if (!form.principal || !form.interestType) { setPreview(null); return; }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      financeApi.previewDebt({
        principal: Number(form.principal), interestType: form.interestType,
        interestRate: Number(form.interestRate) || 0, startDate: form.startDate,
        termMonths: form.termMonths ? Number(form.termMonths) : null,
        paymentDay: form.paymentDay ? Number(form.paymentDay) : null,
      }).then(setPreview).catch(() => setPreview(null));
    }, 350);
    return () => { if (debounce.current) clearTimeout(debounce.current); };
  }, [form.principal, form.interestType, form.interestRate, form.startDate, form.termMonths, form.paymentDay]);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const res = await fileApi.upload(file, 'finance');
      const url = (res.data as { data?: { url?: string } })?.data?.url;
      if (url) { set('attachmentUrl', url); toast.success('Đã tải ảnh hợp đồng'); }
    } catch { toast.error('Tải ảnh thất bại'); } finally { setUploading(false); }
  };

  const submit = async () => {
    if (!form.lenderName.trim()) { toast.error('Nhập tên bên cho vay'); return; }
    if (!Number(form.principal)) { toast.error('Nhập số tiền vay'); return; }
    if (needsTerm && !Number(form.termMonths)) { toast.error('Nhập kỳ hạn (số tháng)'); return; }
    setSaving(true);
    try {
      const body = {
        lenderName: form.lenderName.trim(), lenderType: form.lenderType,
        principal: Number(form.principal), interestType: form.interestType,
        interestRate: Number(form.interestRate) || 0, startDate: form.startDate,
        termMonths: form.termMonths ? Number(form.termMonths) : null,
        paymentDay: form.paymentDay ? Number(form.paymentDay) : null,
        note: form.note || undefined, attachmentUrl: form.attachmentUrl || undefined,
      };
      const debt = initial ? await financeApi.updateDebt(initial.id, body) : await financeApi.createDebt(body);
      toast.success(initial ? 'Đã cập nhật' : 'Đã tạo khoản nợ');
      onSaved(debt);
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Lưu thất bại');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Bên cho vay"><input value={form.lenderName} onChange={(e) => set('lenderName', e.target.value)} className={inputCls} placeholder="App X / Ngân hàng Y" /></Field>
        <Field label="Loại"><select value={form.lenderType} onChange={(e) => set('lenderType', e.target.value)} className={inputCls}>{LENDER_TYPES.map((t) => <option key={t} value={t}>{LENDER_TYPE_LABELS[t]}</option>)}</select></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Số tiền vay (₫)"><input inputMode="numeric" value={form.principal} onChange={(e) => set('principal', e.target.value.replace(/[^\d]/g, ''))} className={inputCls} /></Field>
        <Field label="Kiểu lãi"><select value={form.interestType} onChange={(e) => set('interestType', e.target.value)} className={inputCls}>{INTEREST_TYPES.map((t) => <option key={t} value={t}>{INTEREST_TYPE_LABELS[t]}</option>)}</select></Field>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field label={form.interestType === 'DAILY_PERCENT' ? 'Lãi %/ngày' : 'Lãi %/tháng'}>
          <input inputMode="decimal" value={form.interestRate} onChange={(e) => set('interestRate', e.target.value.replace(/[^\d.]/g, ''))} className={inputCls} disabled={form.interestType === 'NO_INTEREST'} />
        </Field>
        <Field label={`Kỳ hạn (tháng)${needsTerm ? '' : ' *tuỳ chọn'}`}><input inputMode="numeric" value={form.termMonths} onChange={(e) => set('termMonths', e.target.value.replace(/[^\d]/g, ''))} className={inputCls} /></Field>
        <Field label="Ngày trả hàng tháng"><input inputMode="numeric" value={form.paymentDay} onChange={(e) => set('paymentDay', e.target.value.replace(/[^\d]/g, ''))} className={inputCls} placeholder="1-31" /></Field>
      </div>
      <Field label="Ngày bắt đầu"><input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} className={inputCls} /></Field>
      <Field label="Ghi chú"><textarea value={form.note} onChange={(e) => set('note', e.target.value)} className={cn(inputCls, 'min-h-[60px]')} /></Field>

      <div>
        <div className="mb-1 text-xs font-medium text-text-secondary">Ảnh hợp đồng (tuỳ chọn)</div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border-color)] px-3 py-2 text-sm text-text-secondary hover:border-neon-violet/50">
          <Upload size={15} /> {uploading ? 'Đang tải…' : form.attachmentUrl ? 'Đã có ảnh — đổi ảnh' : 'Tải ảnh'}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </label>
      </div>

      {/* Live preview */}
      {preview && (
        <div className="rounded-xl border border-neon-violet/30 bg-neon-violet/5 p-3">
          <div className="mb-2 text-xs font-semibold text-neon-violet">Xem trước lịch trả</div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div><div className="text-text-muted">Gốc</div><div className="font-semibold text-text-primary">{formatVnd(preview.totalPrincipal)}</div></div>
            <div><div className="text-text-muted">Tổng lãi</div><div className="font-semibold text-neon-orange">{formatVnd(preview.totalInterest)}</div></div>
            <div><div className="text-text-muted">Tổng phải trả</div><div className="font-semibold text-text-primary">{formatVnd(preview.totalPayable)}</div></div>
          </div>
          {preview.interestPerDay && <div className="mt-2 text-center text-xs text-text-muted">≈ {formatVnd(preview.interestPerDay)}/ngày</div>}
          {preview.schedule.length > 0 && (
            <div className="mt-2 max-h-28 overflow-y-auto text-xs">
              {preview.schedule.slice(0, 4).map((s) => (
                <div key={s.installmentNo} className="flex justify-between border-t border-[var(--border-color)] py-1">
                  <span className="text-text-muted">Kỳ {s.installmentNo} · {s.dueDate.slice(0, 10)}</span>
                  <span className="text-text-primary">{formatVnd(s.amountDue)}</span>
                </div>
              ))}
              {preview.schedule.length > 4 && <div className="pt-1 text-center text-text-muted">… {preview.schedule.length} kỳ</div>}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Button variant="outline" onClick={onCancel} className="flex-1">Huỷ</Button>
        <Button onClick={submit} disabled={saving} className="flex-1">{saving ? 'Đang lưu…' : initial ? 'Cập nhật' : 'Tạo khoản nợ'}</Button>
      </div>
    </div>
  );
}
