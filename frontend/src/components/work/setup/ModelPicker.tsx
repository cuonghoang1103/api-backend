'use client';

/**
 * "Create with CuongMini" — chọn model (chỉ tên CuongMini, không bao giờ tên nhà cung cấp). Optimum khoá bằng KHOÁ CHUNG
 * (cùng khoá mở Optimum trong CuongMini CLI): chọn ⇒ hỏi khoá ngay tại chỗ; vé 48 giờ giữ ở trình duyệt.
 */

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { KeyRound, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { setTicket, setupApi, setupKeys, type SetupModelId } from '@/lib/work-setup-api';
import { Spinner } from '@/components/work/ui';
import { wt } from '@/components/work/i18n';

export default function ModelPicker({ wsId, value, onChange, disabled }: { wsId: number; value: SetupModelId; onChange: (m: SetupModelId) => void; disabled?: boolean }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: setupKeys.models(wsId), queryFn: () => setupApi.models(wsId), staleTime: 60_000 });
  const [asking, setAsking] = useState(false);
  const [key, setKey] = useState('');
  const [busy, setBusy] = useState(false);
  const opts = q.data ?? [{ id: 'cm-sonic' as const, name: 'CuongMini Sonic 5.5', locked: false, available: true, default: true }];
  const optimum = opts.find((o) => o.id === 'cm-optimum');

  const pick = (id: SetupModelId) => {
    const o = opts.find((x) => x.id === id);
    if (o?.locked) { setAsking(true); return; }
    setAsking(false);
    onChange(id);
  };
  const unlock = async () => {
    setBusy(true);
    try {
      const r = await setupApi.unlock(wsId, key);
      setTicket(r.ve);
      setKey('');
      setAsking(false);
      await qc.invalidateQueries({ queryKey: setupKeys.models(wsId) });
      onChange('cm-optimum');
      toast.success(wt('tcm.unlocked'));
    } catch (e) { toast.error(workError(e, wt('tcm.unlockFailed'))); } finally { setBusy(false); }
  };

  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <label className="shrink-0 text-[12px] text-[var(--w-text-2)]" htmlFor="tcm-model">{wt('tcm.model')}</label>
        <select id="tcm-model" className="w-input h-8 w-auto min-w-0 max-w-[220px] text-[12.5px]" value={value} disabled={disabled} onChange={(e) => pick(e.target.value as SetupModelId)}>
          {opts.map((o) => (
            <option key={o.id} value={o.id} disabled={!o.available}>
              {o.name}{o.locked ? ' 🔒' : ''}{!o.available ? ` (${wt('tcm.modelUnavailable')})` : ''}
            </option>
          ))}
        </select>
        {optimum?.locked && value !== 'cm-optimum' && !asking && optimum.available && (
          <button type="button" className="w-btn w-btn-ghost w-btn-icon h-8 w-8" title={wt('tcm.unlockOptimum')} aria-label={wt('tcm.unlockOptimum')} disabled={disabled} onClick={() => setAsking(true)}><Lock size={13} /></button>
        )}
      </div>
      {asking && (
        <form className="mt-1.5 flex flex-wrap items-center gap-1.5" onSubmit={(e) => { e.preventDefault(); if (key) void unlock(); }}>
          <div className="relative min-w-0 flex-1">
            <KeyRound size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
            <input type="password" autoFocus className="w-input h-8 pl-7 text-[12.5px]" value={key} onChange={(e) => setKey(e.target.value)} placeholder={wt('tcm.keyPh')} aria-label={wt('tcm.unlockOptimum')} autoComplete="off" />
          </div>
          <button type="submit" className="w-btn w-btn-sm w-btn-primary" disabled={busy || !key}>{busy ? <Spinner size={12} /> : null} {wt('tcm.unlock')}</button>
          <button type="button" className="w-btn w-btn-sm" onClick={() => { setAsking(false); setKey(''); }}>{wt('tcm.cancel')}</button>
          <span className="w-full text-[11.5px] text-[var(--w-text-3)]">{wt('tcm.keyHint')}</span>
        </form>
      )}
    </div>
  );
}
