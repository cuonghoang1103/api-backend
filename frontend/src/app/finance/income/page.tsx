'use client';
/**
 * Income — four tabs: Sources (CRUD), Work-log calendar (hourly + OT math with
 * live expected-pay total), Entries (actual income crediting a wallet) with an
 * Expected-vs-Actual strip, and a Year bar chart.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { financeApi, type IncomeSource, type IncomeEntry, type WorkLog, type Wallet } from '@/lib/finance-api';
import { cn, formatVnd, formatMoney } from '@/lib/utils';
import { FinanceShell } from '@/components/finance/FinanceShell';
import { Card, StatCard, Button, Sheet, Field, inputCls, Spinner, EmptyState, Pill } from '@/components/finance/primitives';
import { IncomeMonthBars } from '@/components/finance/charts';

type Tab = 'sources' | 'worklog' | 'entries' | 'year';
function monthStr(d = new Date()) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; }
const SOURCE_TYPES: Record<string, string> = { SALARY: 'Lương', FREELANCE: 'Freelance', PART_TIME: 'Bán thời gian', OTHER: 'Khác' };
const PAY_TYPES: Record<string, string> = { MONTHLY: 'Theo tháng', HOURLY: 'Theo giờ', PER_JOB: 'Theo việc' };
const INCOME_TYPES: Record<string, string> = { SALARY: 'Lương', BONUS: 'Thưởng', OT_PAYOUT: 'Tăng ca', FREELANCE: 'Freelance', OTHER: 'Khác' };

export default function IncomePage() {
  const [tab, setTab] = useState<Tab>('sources');
  return (
    <FinanceShell>
      <h1 className="mb-4 font-heading text-2xl font-bold text-text-primary">Thu nhập</h1>
      <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl bg-[var(--border-color)] p-1">
        {([['sources', 'Nguồn thu'], ['worklog', 'Chấm công'], ['entries', 'Khoản thu'], ['year', 'Theo năm']] as [Tab, string][]).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={cn('whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium', tab === k ? 'bg-neon-violet text-white' : 'text-text-secondary')}>{l}</button>
        ))}
      </div>
      {tab === 'sources' && <SourcesTab />}
      {tab === 'worklog' && <WorkLogTab />}
      {tab === 'entries' && <EntriesTab />}
      {tab === 'year' && <YearTab />}
    </FinanceShell>
  );
}

// ─── Sources ─────────────────────────────────────────────────
function SourcesTab() {
  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<IncomeSource | 'new' | null>(null);
  const load = useCallback(() => financeApi.listSources().then(setSources).catch(() => undefined).finally(() => setLoading(false)), []);
  useEffect(() => { load(); }, [load]);
  return (
    <div>
      <div className="mb-3 flex justify-end"><Button onClick={() => setEdit('new')}><Plus size={15} /> Thêm nguồn thu</Button></div>
      {loading ? <Spinner /> : sources.length === 0 ? <EmptyState icon="💼" title="Chưa có nguồn thu" action={<Button onClick={() => setEdit('new')}><Plus size={15} /> Thêm</Button>} /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {sources.map((s) => (
            <Card key={s.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-text-primary">{s.name}</div>
                  <div className="mt-1 flex gap-1"><Pill>{SOURCE_TYPES[s.type]}</Pill><Pill tone="violet">{PAY_TYPES[s.payType]}</Pill>{s.currency === 'USD' && <Pill>$ USD</Pill>}{!s.isActive && <Pill>Ngừng</Pill>}</div>
                </div>
                <button onClick={() => setEdit(s)} className="rounded-lg p-1 text-text-muted hover:text-neon-violet"><Pencil size={15} /></button>
              </div>
              <div className="mt-2 text-sm text-text-secondary">
                {s.payType === 'MONTHLY' && s.baseSalary && <>Lương cơ bản: <b className="text-text-primary">{formatMoney(s.baseSalary, s.currency)}</b></>}
                {s.payType === 'HOURLY' && s.hourlyRate && <>Lương giờ: <b className="text-text-primary">{formatMoney(s.hourlyRate, s.currency)}</b> · OT ×{Number(s.otMultiplierNormal)} / lễ ×{Number(s.otMultiplierHoliday)}</>}
              </div>
            </Card>
          ))}
        </div>
      )}
      {edit && <SourceForm source={edit === 'new' ? null : edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load(); }} />}
    </div>
  );
}

function SourceForm({ source, onClose, onSaved }: { source: IncomeSource | null; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({
    name: source?.name ?? '', type: source?.type ?? 'SALARY', payType: source?.payType ?? 'MONTHLY',
    baseSalary: source?.baseSalary ? String(Math.round(Number(source.baseSalary))) : '',
    hourlyRate: source?.hourlyRate ? String(Math.round(Number(source.hourlyRate))) : '',
    otMultiplierNormal: source ? String(Number(source.otMultiplierNormal)) : '1.5',
    otMultiplierHoliday: source ? String(Number(source.otMultiplierHoliday)) : '2',
    isActive: source?.isActive ?? true,
    currency: source?.currency ?? 'VND',
  });
  const sym = f.currency === 'USD' ? '$' : '₫';
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));
  const save = async () => {
    if (!f.name.trim()) { toast.error('Nhập tên'); return; }
    setSaving(true);
    try {
      const body = { ...f, baseSalary: f.baseSalary ? Number(f.baseSalary) : null, hourlyRate: f.hourlyRate ? Number(f.hourlyRate) : null, otMultiplierNormal: Number(f.otMultiplierNormal), otMultiplierHoliday: Number(f.otMultiplierHoliday) };
      if (source) await financeApi.updateSource(source.id, body); else await financeApi.createSource(body);
      toast.success('Đã lưu'); onSaved();
    } catch { toast.error('Lưu thất bại'); } finally { setSaving(false); }
  };
  return (
    <Sheet open onClose={onClose} title={source ? 'Sửa nguồn thu' : 'Thêm nguồn thu'}>
      <div className="space-y-3">
        <Field label="Tên"><input value={f.name} onChange={(e) => set('name', e.target.value)} className={inputCls} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Loại"><select value={f.type} onChange={(e) => set('type', e.target.value)} className={inputCls}>{Object.keys(SOURCE_TYPES).map((t) => <option key={t} value={t}>{SOURCE_TYPES[t]}</option>)}</select></Field>
          <Field label="Hình thức trả"><select value={f.payType} onChange={(e) => set('payType', e.target.value)} className={inputCls}>{Object.keys(PAY_TYPES).map((t) => <option key={t} value={t}>{PAY_TYPES[t]}</option>)}</select></Field>
        </div>
        <Field label="Tiền tệ (lương)">
          <select value={f.currency} onChange={(e) => set('currency', e.target.value)} className={inputCls}>
            <option value="VND">₫ VND</option>
            <option value="USD">$ USD</option>
          </select>
        </Field>
        {f.payType === 'MONTHLY' && <Field label={`Lương cơ bản/tháng (${sym})`}><input inputMode="decimal" value={f.baseSalary} onChange={(e) => set('baseSalary', e.target.value.replace(/[^\d.]/g, ''))} className={inputCls} /></Field>}
        {f.payType === 'HOURLY' && (
          <div className="grid grid-cols-3 gap-3">
            <Field label={`Lương/giờ (${sym})`}><input inputMode="decimal" value={f.hourlyRate} onChange={(e) => set('hourlyRate', e.target.value.replace(/[^\d.]/g, ''))} className={inputCls} /></Field>
            <Field label="Hệ số OT"><input inputMode="decimal" value={f.otMultiplierNormal} onChange={(e) => set('otMultiplierNormal', e.target.value)} className={inputCls} /></Field>
            <Field label="Hệ số OT lễ"><input inputMode="decimal" value={f.otMultiplierHoliday} onChange={(e) => set('otMultiplierHoliday', e.target.value)} className={inputCls} /></Field>
          </div>
        )}
        <label className="flex items-center gap-2 text-sm text-text-secondary"><input type="checkbox" checked={f.isActive} onChange={(e) => set('isActive', e.target.checked)} /> Đang hoạt động</label>
        <Button onClick={save} disabled={saving} className="w-full">{saving ? 'Đang lưu…' : 'Lưu'}</Button>
      </div>
    </Sheet>
  );
}

// ─── Work-log calendar ───────────────────────────────────────
function WorkLogTab() {
  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [sourceId, setSourceId] = useState<number | null>(null);
  const [month, setMonth] = useState(monthStr());
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [totals, setTotals] = useState<{ hoursNormal: string; hoursOT: string; hoursOTHoliday: string; expectedPay: string; currency?: string } | null>(null);
  const [dayEdit, setDayEdit] = useState<string | null>(null);

  useEffect(() => { financeApi.listSources().then((s) => { const hourly = s.filter((x) => x.payType === 'HOURLY'); setSources(hourly); setSourceId(hourly[0]?.id ?? null); }); }, []);
  const load = useCallback(() => {
    if (!sourceId) return;
    financeApi.listWorkLogs(sourceId, month).then((r) => { setLogs(r.logs); setTotals(r.totals); }).catch(() => undefined);
  }, [sourceId, month]);
  useEffect(() => { load(); }, [load]);

  const [y, mo] = month.split('-').map(Number);
  const daysInMonth = new Date(y, mo, 0).getDate();
  const firstDow = (new Date(y, mo - 1, 1).getDay() + 6) % 7; // Mon=0
  const logByDay = useMemo(() => new Map(logs.map((l) => [l.date.slice(0, 10), l])), [logs]);

  if (sources.length === 0) return <EmptyState icon="⏱️" title="Chưa có nguồn thu theo giờ" hint="Tạo nguồn thu hình thức 'Theo giờ' để chấm công." />;

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <select value={sourceId ?? ''} onChange={(e) => setSourceId(Number(e.target.value))} className={cn(inputCls, 'w-auto')}>{sources.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={cn(inputCls, 'w-auto')} />
      </div>

      <Card>
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-text-muted">{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => <div key={d}>{d}</div>)}</div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${month}-${String(day).padStart(2, '0')}`;
            const log = logByDay.get(dateStr);
            const hrs = log ? Number(log.hoursNormal) + Number(log.hoursOT) + Number(log.hoursOTHoliday) : 0;
            return (
              <button key={day} onClick={() => setDayEdit(dateStr)} className={cn('aspect-square rounded-lg border p-1 text-left transition-colors', hrs > 0 ? 'border-neon-green/40 bg-neon-green/10' : 'border-[var(--border-color)] hover:border-neon-violet/40')}>
                <div className="text-xs text-text-secondary">{day}</div>
                {hrs > 0 && <div className="mt-0.5 text-[10px] font-medium text-neon-green">{hrs}h</div>}
              </button>
            );
          })}
        </div>
      </Card>

      {totals && (
        <Card className="mt-3">
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div><div className="text-text-muted">Giờ thường</div><div className="font-semibold text-text-primary">{Number(totals.hoursNormal)}h</div></div>
            <div><div className="text-text-muted">Giờ OT</div><div className="font-semibold text-text-primary">{Number(totals.hoursOT)}h</div></div>
            <div><div className="text-text-muted">OT lễ</div><div className="font-semibold text-text-primary">{Number(totals.hoursOTHoliday)}h</div></div>
            <div><div className="text-text-muted">Lương dự kiến</div><div className="font-semibold text-neon-green">{formatMoney(totals.expectedPay, totals.currency ?? 'VND')}</div></div>
          </div>
        </Card>
      )}

      {dayEdit && sourceId && <DayLogSheet date={dayEdit} sourceId={sourceId} existing={logByDay.get(dayEdit) ?? null} onClose={() => setDayEdit(null)} onSaved={() => { setDayEdit(null); load(); }} />}
    </div>
  );
}

function DayLogSheet({ date, sourceId, existing, onClose, onSaved }: { date: string; sourceId: number; existing: WorkLog | null; onClose: () => void; onSaved: () => void }) {
  const [hn, setHn] = useState(existing ? String(Number(existing.hoursNormal)) : '8');
  const [ho, setHo] = useState(existing ? String(Number(existing.hoursOT)) : '0');
  const [hh, setHh] = useState(existing ? String(Number(existing.hoursOTHoliday)) : '0');
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    try { await financeApi.upsertWorkLog({ sourceId, date, hoursNormal: Number(hn) || 0, hoursOT: Number(ho) || 0, hoursOTHoliday: Number(hh) || 0 }); toast.success('Đã lưu công'); onSaved(); }
    catch { toast.error('Lưu thất bại'); } finally { setSaving(false); }
  };
  return (
    <Sheet open onClose={onClose} title={`Chấm công ${date}`}>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Giờ thường"><input inputMode="decimal" value={hn} onChange={(e) => setHn(e.target.value)} className={inputCls} /></Field>
        <Field label="Giờ OT"><input inputMode="decimal" value={ho} onChange={(e) => setHo(e.target.value)} className={inputCls} /></Field>
        <Field label="OT ngày lễ"><input inputMode="decimal" value={hh} onChange={(e) => setHh(e.target.value)} className={inputCls} /></Field>
      </div>
      <div className="mt-3 flex gap-2">
        {existing && <Button variant="danger" onClick={async () => { await financeApi.deleteWorkLog(existing.id); toast.success('Đã xoá'); onSaved(); }}>Xoá</Button>}
        <Button onClick={save} disabled={saving} className="flex-1">{saving ? 'Đang lưu…' : 'Lưu'}</Button>
      </div>
    </Sheet>
  );
}

// ─── Entries + expected vs actual ────────────────────────────
function EntriesTab() {
  const [month, setMonth] = useState(monthStr());
  const [entries, setEntries] = useState<IncomeEntry[]>([]);
  const [eva, setEva] = useState<{ totalExpected: string; totalActual: string; difference: string; rows: Array<{ source: { id: number; name: string }; expected: string; actual: string; difference: string }> } | null>(null);
  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([financeApi.listIncomeEntries({ month }), financeApi.expectedVsActual(month), financeApi.listSources(), financeApi.listWallets()])
      .then(([e, v, s, w]) => { setEntries(e); setEva(v as never); setSources(s); setWallets(w); })
      .catch(() => undefined).finally(() => setLoading(false));
  }, [month]);
  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={cn(inputCls, 'w-auto')} />
        <Button onClick={() => setCreating(true)}><Plus size={15} /> Ghi thu</Button>
      </div>

      {eva && (
        <div className="mb-3 grid grid-cols-3 gap-3">
          <StatCard label="Dự kiến" value={eva.totalExpected} />
          <StatCard label="Thực nhận" value={eva.totalActual} accent="income" />
          <StatCard label="Chênh lệch" value={eva.difference} accent={Number(eva.difference) >= 0 ? 'income' : 'expense'} />
        </div>
      )}

      {loading ? <Spinner /> : entries.length === 0 ? <EmptyState icon="💰" title="Chưa có khoản thu tháng này" action={<Button onClick={() => setCreating(true)}><Plus size={15} /> Ghi thu</Button>} /> : (
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-[var(--border-color)]">
            {entries.map((e) => (
              <div key={e.id} className="group flex items-center gap-3 px-4 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-text-primary">{e.note || INCOME_TYPES[e.type] || 'Thu nhập'}</div>
                  <div className="text-xs text-text-muted">{INCOME_TYPES[e.type]} · {e.date.slice(0, 10)}</div>
                </div>
                <div className="text-sm font-medium tabular-nums text-neon-green">+{formatMoney(e.amount, e.currency)}</div>
                <button onClick={async () => { if (confirm('Xoá?')) { await financeApi.deleteIncomeEntry(e.id); toast.success('Đã xoá'); load(); } }} className="rounded-lg p-1 text-text-muted opacity-0 transition-opacity hover:text-neon-red group-hover:opacity-100"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {creating && <IncomeEntryForm sources={sources} wallets={wallets} onClose={() => setCreating(false)} onSaved={() => { setCreating(false); load(); }} />}
    </div>
  );
}

function IncomeEntryForm({ sources, wallets, onClose, onSaved }: { sources: IncomeSource[]; wallets: Wallet[]; onClose: () => void; onSaved: () => void }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('SALARY');
  const [sourceId, setSourceId] = useState<number | ''>(sources[0]?.id ?? '');
  const [walletId, setWalletId] = useState(wallets[0]?.id ?? 0);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedSource = sources.find((s) => s.id === sourceId) ?? null;
  const walletCurrency = wallets.find((w) => w.id === walletId)?.currency ?? 'VND';
  // Amount is entered in the source's currency (or the wallet's when no source).
  const inputCurrency = selectedSource?.currency ?? walletCurrency;
  const sym = inputCurrency === 'USD' ? '$' : '₫';
  const crossCurrency = inputCurrency !== walletCurrency;

  // When picking a source, prefer a wallet that already matches its currency.
  useEffect(() => {
    if (!selectedSource) return;
    const match = wallets.find((w) => w.currency === selectedSource.currency);
    if (match && match.currency !== walletCurrency) setWalletId(match.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceId]);

  const save = async () => {
    if (!Number(amount)) { toast.error('Nhập số tiền'); return; }
    setSaving(true);
    try { await financeApi.createIncomeEntry({ amount: Number(amount), type, sourceId: sourceId || null, walletId, date, note: note || undefined }); toast.success('Đã ghi thu'); onSaved(); }
    catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Lưu thất bại');
    } finally { setSaving(false); }
  };
  return (
    <Sheet open onClose={onClose} title="Ghi khoản thu">
      <div className="space-y-3">
        <Field label={`Số tiền (${sym})`}><input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))} className={cn(inputCls, 'text-lg font-semibold')} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Loại"><select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>{Object.keys(INCOME_TYPES).map((t) => <option key={t} value={t}>{INCOME_TYPES[t]}</option>)}</select></Field>
          <Field label="Nguồn"><select value={sourceId} onChange={(e) => setSourceId(e.target.value ? Number(e.target.value) : '')} className={inputCls}><option value="">— Không —</option>{sources.map((s) => <option key={s.id} value={s.id}>{s.name}{s.currency === 'USD' ? ' ($)' : ''}</option>)}</select></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ví nhận"><select value={walletId} onChange={(e) => setWalletId(Number(e.target.value))} className={inputCls}>{wallets.map((w) => <option key={w.id} value={w.id}>{w.icon} {w.name}{w.currency === 'USD' ? ' ($)' : ''}</option>)}</select></Field>
          <Field label="Ngày"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></Field>
        </div>
        {crossCurrency && (
          <div className="rounded-xl bg-neon-cyan/10 px-3 py-2 text-xs text-neon-cyan">
            Nguồn thu khác tiền tệ với ví — số tiền ({sym}) sẽ được quy đổi sang {walletCurrency === 'USD' ? '$' : '₫'} theo tỷ giá hiện hành (xem mục Tỷ giá).
          </div>
        )}
        <Field label="Ghi chú"><input value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} /></Field>
        <Button onClick={save} disabled={saving} className="w-full">{saving ? 'Đang lưu…' : 'Lưu'}</Button>
      </div>
    </Sheet>
  );
}

// ─── Year ────────────────────────────────────────────────────
function YearTab() {
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [data, setData] = useState<{ months: Array<{ month: number; total: string }> } | null>(null);
  useEffect(() => { financeApi.incomeByMonth(year).then(setData as never).catch(() => undefined); }, [year]);
  const total = data?.months.reduce((a, m) => a + Number(m.total), 0) ?? 0;
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <input inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value.replace(/[^\d]/g, ''))} className={cn(inputCls, 'w-24')} />
        <span className="text-sm text-text-muted">Tổng thu: <b className="text-neon-green">{formatVnd(total)}</b></span>
      </div>
      <Card>{data ? <IncomeMonthBars months={data.months} /> : <Spinner />}</Card>
    </div>
  );
}
