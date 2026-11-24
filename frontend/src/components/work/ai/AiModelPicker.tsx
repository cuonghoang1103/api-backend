'use client';

/**
 * Ô chọn model của trợ lý CuongMini (24/11/2026). Không chọn ⇒ "CuongMini (mặc định)" = chuỗi cổng cũ, không gián đoạn
 * việc của thành viên. Pro 2 / Max / Fable Max dùng CHUNG khoá + vé 48 giờ với CuongMini CLI (vé giữ ở trình duyệt, cùng
 * chỗ với "Create with CuongMini"); admin không cần khoá. Lý do model xám chỉ admin thấy (máy chủ lọc).
 */

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { workApi, workError, type AiModelOption } from '@/lib/work-api';
import { getTicket, setTicket } from '@/lib/work-setup-api';
import { Spinner } from '../ui';
import { wt } from '@/components/work/i18n';

export type AiModelId = AiModelOption['id'];
const KHOA_LUU = 'ctw-ai-model';

export function docModelDaChon(): AiModelId {
  try {
    const v = localStorage.getItem(KHOA_LUU);
    return v === 'cm-sonic' || v === 'cm-optimum' || v === 'cm-invisible' ? v : 'cm-default';
  } catch { return 'cm-default'; }
}
function luuModel(v: AiModelId): void {
  try { if (v === 'cm-default') localStorage.removeItem(KHOA_LUU); else localStorage.setItem(KHOA_LUU, v); } catch { /* trình duyệt chặn lưu */ }
}

export const aiModelsKey = (pid: number) => ['work', 'ai', 'models', pid] as const;

export default function AiModelPicker({ pid, value, onChange, disabled }: {
  pid: number; value: AiModelId; onChange: (m: AiModelId) => void; disabled?: boolean;
}) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: aiModelsKey(pid), queryFn: () => workApi.aiModels(pid, getTicket()), staleTime: 60_000 });
  const [hoi, setHoi] = useState<AiModelOption | null>(null);
  const [khoa, setKhoa] = useState('');
  const [ban, setBan] = useState(false);
  const ds: AiModelOption[] = q.data ?? [{ id: 'cm-default', name: 'CuongMini', locked: false, available: true, default: true }];

  const chon = (id: AiModelId) => {
    const o = ds.find((x) => x.id === id);
    if (!o) return;
    if (!o.available) { if (o.lyDo) toast.error(`${o.name}: ${o.lyDo}`); return; }
    if (o.locked) { setHoi(o); return; }
    setHoi(null);
    luuModel(id);
    onChange(id);
    if (o.dat) toast.message(wt('ai.modelExpensive'));
  };
  const moKhoa = async () => {
    if (!hoi) return;
    setBan(true);
    try {
      const r = await workApi.aiUnlockModel(pid, { matKhau: khoa, loai: hoi.loaiKhoa ?? 'chung', ve: getTicket() ?? null });
      setTicket(r.ve);
      setKhoa('');
      await qc.invalidateQueries({ queryKey: aiModelsKey(pid) });
      luuModel(hoi.id);
      onChange(hoi.id);
      setHoi(null);
      toast.success(wt('ai.modelUnlocked'));
    } catch (e) { toast.error(workError(e, wt('ai.modelUnlockFailed'))); } finally { setBan(false); }
  };

  const tenHien = (o: AiModelOption) => (o.id === 'cm-default' ? wt('ai.modelDefault') : o.name);
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <label className="shrink-0 text-[11.5px] text-[var(--w-text-3)]" htmlFor={`ai-model-${pid}`}>{wt('ai.modelLabel')}</label>
        <select
          id={`ai-model-${pid}`}
          className="w-input h-7 w-auto min-w-0 max-w-[210px] text-[12px]"
          value={value}
          disabled={disabled}
          onChange={(e) => chon(e.target.value as AiModelId)}
        >
          {ds.map((o) => (
            /* Model xám: người thường không chọn được; admin chọn được để xem lý do (`lyDo`). */
            <option key={o.id} value={o.id} disabled={!o.available && !o.lyDo} title={o.lyDo}>
              {tenHien(o)}{o.locked ? ' 🔒' : ''}{!o.available ? ` (${wt('ai.modelUnavailable')})` : ''}
            </option>
          ))}
        </select>
      </div>
      {hoi && (
        <form className="mt-1.5 flex flex-wrap items-center gap-1.5" onSubmit={(e) => { e.preventDefault(); if (khoa) void moKhoa(); }}>
          <div className="relative min-w-0 flex-1">
            <KeyRound size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
            <input
              type="password" autoFocus className="w-input h-8 pl-7 text-[12.5px]" value={khoa}
              onChange={(e) => setKhoa(e.target.value)} placeholder={wt('ai.modelUnlockPh')} aria-label={wt('ai.modelUnlockPh')}
            />
          </div>
          <button type="submit" className="w-btn w-btn-sm w-btn-primary" disabled={ban || !khoa}>{ban ? <Spinner size={12} /> : null} {wt('ai.modelUnlock')}</button>
          <button type="button" className="w-btn w-btn-sm" onClick={() => { setHoi(null); setKhoa(''); }}>{wt('ai.modelCancel')}</button>
          <span className="w-full text-[11px] text-[var(--w-text-3)]">{wt('ai.modelKeyHint')}</span>
        </form>
      )}
    </div>
  );
}
