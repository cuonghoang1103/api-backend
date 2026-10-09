'use client';

/** AI gợi ý điều kiện + test case N/A/B cho một hàm — chỉ ĐỀ XUẤT, người dùng xem rồi mới thêm vào ma trận. */

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Dialog, Field, Spinner } from '../../ui';
import { fptApi, TYPE_LABEL, type AiSuggestion } from './fptApi';
import { wt } from '@/components/work/i18n';

export default function AiSuggestDialog({ open, onClose, pid, fnId, onApply }: {
  open: boolean; onClose: () => void; pid: number; fnId: number; onApply: (s: AiSuggestion) => void;
}) {
  const [signature, setSignature] = useState('');
  const [extra, setExtra] = useState('');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<AiSuggestion | null>(null);
  useEffect(() => { if (open) setRes(null); }, [open]);

  const run = async () => {
    setBusy(true);
    try {
      setRes(await fptApi.aiSuggest(pid, fnId, { signature: signature.trim() || null, extra: extra.trim() || null }));
    } catch (e) {
      toast.error(workError(e, wt('fpt.aiFailed')));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !busy && onClose()}
      title={<span className="inline-flex items-center gap-2"><Sparkles size={15} /> {wt('fpt.suggestTitle')}</span>}
      width={720}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose} disabled={busy}>{wt('common.cancel')}</button>
          {res ? (
            <button type="button" className="w-btn w-btn-primary" onClick={() => onApply(res)} disabled={!res.cases.length}>
              Add {res.cases.length} case{res.cases.length === 1 ? '' : 's'} to the matrix
            </button>
          ) : (
            <button type="button" className="w-btn w-btn-primary" onClick={run} disabled={busy}>{busy && <Spinner size={12} />} {wt('fpt.suggest')}</button>
          )}
        </>
      }
    >
      {!res ? (
        <>
          <p className="mb-3 text-[13px] text-[var(--w-text-2)]">
            {wt('fpt.aiIntro')}
          </p>
          <Field label={wt('fpt.sigLabel')} hint={wt('fpt.sigHint')}>
            <textarea className="w-input min-h-[110px] font-mono text-[12px]" value={signature} maxLength={8000} onChange={(e) => setSignature(e.target.value)}
              placeholder={'public boolean login(String email, String password)'} />
          </Field>
          <Field label={wt('fpt.extraLabel')}>
            <input className="w-input" value={extra} maxLength={2000} onChange={(e) => setExtra(e.target.value)} placeholder={wt('fpt.extraPh')} />
          </Field>
          {busy && <p className="text-[12.5px] text-[var(--w-text-3)]">{wt('fpt.thinking')}</p>}
        </>
      ) : (
        <div className="space-y-3 text-[13px]">
          {res.notes && <p className="text-[var(--w-text-2)]">{res.notes}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="w-label">Condition</div>
              <ul className="space-y-0.5">
                {res.conditions.map((c, i) => <li key={i}><span className="text-[var(--w-text-3)]">{c.group}</span> · <code>{c.value || '""'}</code>{c.label ? <span className="text-[var(--w-text-3)]"> ({c.label})</span> : null}</li>)}
              </ul>
            </div>
            <div>
              <div className="w-label">Confirmation</div>
              <ul className="space-y-0.5">
                {res.confirmations.map((c, i) => <li key={i}><span className="text-[var(--w-text-3)]">{c.group}</span> · <code>{c.value}</code></li>)}
              </ul>
            </div>
          </div>
          <div>
            <div className="w-label">Test case</div>
            <ul className="space-y-1">
              {res.cases.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className={cn('w-[70px] shrink-0 font-semibold', c.type === 'N' ? 'text-[var(--w-green)]' : c.type === 'A' ? 'text-[var(--w-red)]' : 'text-[var(--w-yellow)]')}>{TYPE_LABEL[c.type]}</span>
                  <span>{c.title || c.conditions.map((x) => res.conditions[x]?.value).join(', ')}</span>
                </li>
              ))}
            </ul>
          </div>
          <button type="button" className="w-btn w-btn-sm" onClick={() => setRes(null)}>{wt('common.tryAgain')}</button>
        </div>
      )}
    </Dialog>
  );
}
