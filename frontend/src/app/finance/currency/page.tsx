'use client';
/**
 * Tỷ giá — user-managed VND↔USD exchange rate.
 * Three blocks: (1) current rate + update form (append-only history, so
 * every update is timestamped), (2) live two-way $↔₫ converter driven by
 * the current rate, (3) rate history with delete-a-typo.
 */
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeftRight, Trash2, Clock3 } from 'lucide-react';
import { financeApi, type FxRate } from '@/lib/finance-api';
import { formatVnd, formatUsd } from '@/lib/utils';
import { FinanceShell } from '@/components/finance/FinanceShell';
import { Card, Button, Field, inputCls, Spinner, EmptyState } from '@/components/finance/primitives';

const fmtDateTime = (iso: string) =>
  new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso));

export default function CurrencyPage() {
  const [current, setCurrent] = useState<FxRate | null>(null);
  const [history, setHistory] = useState<FxRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rateInput, setRateInput] = useState('');
  const [noteInput, setNoteInput] = useState('');

  const load = useCallback(() => {
    Promise.all([financeApi.fxCurrent(), financeApi.fxHistory(1, 30)])
      .then(([cur, his]) => { setCurrent(cur); setHistory(his.items); })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    const rate = Number(rateInput);
    if (!Number.isFinite(rate) || rate <= 0) { toast.error('Nhập tỷ giá hợp lệ (₫ cho 1 $)'); return; }
    setSaving(true);
    try {
      await financeApi.fxSet({ vndPerUsd: rate, note: noteInput.trim() || undefined });
      toast.success('Đã cập nhật tỷ giá');
      setRateInput(''); setNoteInput('');
      load();
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Không cập nhật được tỷ giá');
    } finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    try { await financeApi.fxDelete(id); toast.success('Đã xoá bản ghi'); load(); }
    catch { toast.error('Không xoá được'); }
  };

  return (
    <FinanceShell>
      <h1 className="mb-1 font-heading text-2xl font-bold text-text-primary">Tỷ giá</h1>
      <p className="mb-4 text-sm text-text-muted">
        Tự đặt tỷ giá quy đổi giữa <span className="font-semibold">$ (USD)</span> và <span className="font-semibold">₫ (VND)</span>.
        Mọi tổng hợp (Tổng quan, Báo cáo) dùng tỷ giá mới nhất để quy đổi các khoản bằng $ về ₫.
      </p>

      {loading ? <Spinner /> : (
        <div className="space-y-6">
          {/* Current rate + update */}
          <Card>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs font-medium text-text-secondary">Tỷ giá hiện tại</div>
                {current ? (
                  <>
                    <div className="mt-1 font-heading text-2xl font-bold text-text-primary">1 $ = {formatVnd(current.vndPerUsd)}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-text-muted"><Clock3 size={12} /> Cập nhật lúc {fmtDateTime(current.createdAt)}{current.note ? ` · ${current.note}` : ''}</div>
                  </>
                ) : (
                  <div className="mt-1 text-sm text-text-muted">Chưa đặt tỷ giá — nhập bên cạnh để bắt đầu dùng $.</div>
                )}
              </div>
              <div className="flex flex-wrap items-end gap-2">
                <Field label="₫ cho 1 $">
                  <input type="number" min={0} step="any" placeholder="vd: 26500" value={rateInput} onChange={(e) => setRateInput(e.target.value)} className={inputCls + ' w-36'} />
                </Field>
                <Field label="Ghi chú (tuỳ chọn)">
                  <input type="text" placeholder="vd: tỷ giá VCB" value={noteInput} onChange={(e) => setNoteInput(e.target.value)} className={inputCls + ' w-44'} />
                </Field>
                <Button onClick={submit} disabled={saving}>{saving ? 'Đang lưu…' : 'Cập nhật'}</Button>
              </div>
            </div>
          </Card>

          {/* Live converter */}
          <Converter rate={current ? Number(current.vndPerUsd) : null} />

          {/* History */}
          <section>
            <h2 className="mb-2 font-heading font-semibold text-text-primary">Lịch sử cập nhật</h2>
            {history.length === 0 ? <EmptyState icon="💱" title="Chưa có bản ghi tỷ giá" hint="Mỗi lần cập nhật sẽ được lưu lại tại đây." /> : (
              <Card>
                <ul className="divide-y divide-[var(--border-color)]">
                  {history.map((r, idx) => (
                    <li key={r.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                      <div>
                        <span className="font-medium text-text-primary">1 $ = {formatVnd(r.vndPerUsd)}</span>
                        {idx === 0 && <span className="ml-2 rounded-full bg-neon-violet/15 px-2 py-0.5 text-[10px] font-semibold text-neon-violet">Hiện hành</span>}
                        <div className="text-xs text-text-muted">{fmtDateTime(r.createdAt)}{r.note ? ` · ${r.note}` : ''}</div>
                      </div>
                      <button onClick={() => remove(r.id)} className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400" title="Xoá bản ghi">
                        <Trash2 size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </section>
        </div>
      )}
    </FinanceShell>
  );
}

/** Two-way live converter: edit either side, the other follows the rate. */
function Converter({ rate }: { rate: number | null }) {
  const [usd, setUsd] = useState('1');
  const [vnd, setVnd] = useState(rate ? String(rate) : '');

  // Re-derive the VND side when the rate itself changes (e.g. after update)
  useEffect(() => {
    if (rate && usd !== '') setVnd(String(Math.round(Number(usd) * rate * 100) / 100));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate]);

  const onUsd = (v: string) => {
    setUsd(v);
    if (rate && v !== '' && Number.isFinite(Number(v))) setVnd(String(Math.round(Number(v) * rate * 100) / 100));
    else if (v === '') setVnd('');
  };
  const onVnd = (v: string) => {
    setVnd(v);
    if (rate && v !== '' && Number.isFinite(Number(v))) setUsd(String(Math.round((Number(v) / rate) * 100) / 100));
    else if (v === '') setUsd('');
  };

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2 font-heading font-semibold text-text-primary">
        <ArrowLeftRight size={18} className="text-neon-cyan" /> Quy đổi nhanh
      </div>
      {!rate ? (
        <div className="text-sm text-text-muted">Đặt tỷ giá trước để dùng bộ quy đổi.</div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex-1 min-w-[150px]">
            <span className="mb-1 block text-xs font-medium text-text-secondary">USD ($)</span>
            <input type="number" min={0} step="any" value={usd} onChange={(e) => onUsd(e.target.value)} className={inputCls} />
            <span className="mt-1 block text-xs text-text-muted">{usd !== '' && Number.isFinite(Number(usd)) ? formatUsd(usd) : '—'}</span>
          </label>
          <ArrowLeftRight size={18} className="shrink-0 text-text-muted" />
          <label className="flex-1 min-w-[150px]">
            <span className="mb-1 block text-xs font-medium text-text-secondary">VND (₫)</span>
            <input type="number" min={0} step="any" value={vnd} onChange={(e) => onVnd(e.target.value)} className={inputCls} />
            <span className="mt-1 block text-xs text-text-muted">{vnd !== '' && Number.isFinite(Number(vnd)) ? formatVnd(vnd) : '—'}</span>
          </label>
        </div>
      )}
    </Card>
  );
}
