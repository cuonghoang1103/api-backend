'use client';

/**
 * Service desk trong CỔNG KHÁCH (đợt S5a). Hai mảnh:
 *   - `DeskRequestDialog`: khách chọn loại yêu cầu + mô tả ai bị ảnh hưởng / gấp cỡ nào (chữ dễ hiểu — khách
 *     KHÔNG chọn P), điền trường riêng của loại, thấy trước "We'll respond within …" (mục tiêu, không gì nội bộ).
 *   - `PortalSlaPanel`: trong một yêu cầu — mục tiêu phản hồi/giải quyết, đã có trả lời chưa, và khảo sát CSAT 1–5
 *     (chỉ người gửi, khi đã giải quyết, một lần).
 * Dữ liệu từ /portal/desk/** — server đã lọc "như khách thấy".
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CheckCircle2, Clock, Send, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, workPortalKeys } from '@/lib/work-api';
import { deskApi, deskKeys, type DeskLevel, type PortalDeskForm, type RequestTypeKey } from '@/lib/work-s5a-api';
import { Dialog, PageLoading, Spinner } from '../ui';

export function DeskRequestDialog({ pid, open, onClose, onCreated }: { pid: number; open: boolean; onClose: () => void; onCreated: (n: number) => void }) {
  const qc = useQueryClient();
  const form = useQuery({ queryKey: deskKeys.portalForm(pid, false), queryFn: () => deskApi.portalForm(pid), enabled: open });
  const f = form.data && form.data.enabled ? (form.data as PortalDeskForm) : null;
  const [type, setType] = useState<RequestTypeKey | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [impact, setImpact] = useState<DeskLevel | null>(null);
  const [urgency, setUrgency] = useState<DeskLevel | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  useEffect(() => { if (open) { setTitle(''); setDesc(''); setAnswers({}); setImpact(null); setUrgency(null); } }, [open]);
  useEffect(() => { if (f && !type) setType(f.requestTypes[0]?.key ?? null); }, [f, type]);
  const t = f?.requestTypes.find((x) => x.key === type) ?? null;
  const p = t && f ? f.matrix[t.askImpact && impact ? impact : t.defaultImpact][t.askImpact && urgency ? urgency : t.defaultUrgency] : null;
  const missing = t ? t.fields.filter((x) => x.required && !answers[x.key]?.trim()) : [];
  const send = useMutation({
    mutationFn: () => deskApi.portalSubmit(pid, { requestType: type!, title, description: desc || null, impact, urgency, fields: answers }),
    onSuccess: (r) => {
      toast.success(`Sent as ${r.key}. We’ll respond within ${r.respondWithin}.`);
      qc.invalidateQueries({ queryKey: workPortalKeys.all(pid) });
      onClose();
      onCreated(r.number);
    },
    onError: (err) => toast.error(workError(err, 'Could not send your request')),
  });
  const canSend = !!t && !!title.trim() && !missing.length && (!t.askImpact || (!!impact && !!urgency));
  return (
    <Dialog open={open} onClose={onClose} title="New request" width={600} footer={(
      <>
        {p && f && <span className="mr-auto flex items-center gap-1.5 text-[12.5px] text-[var(--w-text-2)]" data-testid="desk-promise"><Clock size={13} /> We’ll respond within {f.targets[p].respond}</span>}
        <button type="button" className="w-btn w-btn-ghost" onClick={onClose}>Cancel</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!canSend || send.isPending} onClick={() => send.mutate()} data-testid="portal-send-request">
          {send.isPending ? <Spinner size={12} /> : <Send size={13} />} Send to the team
        </button>
      </>
    )}>
      {form.isLoading || !f ? <PageLoading rows={3} /> : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1" role="radiogroup" aria-label="Type of request">
            {f.requestTypes.map((k) => (
              <button key={k.key} type="button" role="radio" aria-checked={type === k.key} onClick={() => { setType(k.key); setAnswers({}); }} data-testid={`desk-type-${k.key}`}
                className={cn('rounded-[8px] border px-3 py-2 text-left', type === k.key ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border)] hover:bg-[var(--w-hover)]')}>
                <span className="block text-[13px] font-medium">{k.name}</span>
                <span className="block text-[11.5px] text-[var(--w-text-3)]">{k.description}</span>
              </button>
            ))}
          </div>
          <label className="block">
            <span className="mb-1 block text-[12.5px] font-medium">Title</span>
            <input className="w-input" value={title} maxLength={255} onChange={(e) => setTitle(e.target.value)} placeholder="Short summary" data-testid="portal-request-title" />
          </label>
          {t?.fields.map((x) => (
            <label key={x.key} className="block">
              <span className="mb-1 block text-[12.5px] font-medium">{x.label}{x.required && <span className="text-[var(--w-red)]"> *</span>}</span>
              {x.kind === 'textarea'
                ? <textarea className="w-input min-h-[72px] py-2" value={answers[x.key] ?? ''} onChange={(e) => setAnswers((a) => ({ ...a, [x.key]: e.target.value }))} data-testid={`desk-field-${x.key}`} />
                : <input type={x.kind === 'date' ? 'date' : 'text'} className="w-input" value={answers[x.key] ?? ''} onChange={(e) => setAnswers((a) => ({ ...a, [x.key]: e.target.value }))} data-testid={`desk-field-${x.key}`} />}
            </label>
          ))}
          <label className="block">
            <span className="mb-1 block text-[12.5px] font-medium">Details</span>
            <textarea className="w-input min-h-[90px] py-2" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What happened, and what did you expect?" />
          </label>
          {t?.askImpact && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Choice label="Who is affected?" options={f.impact} value={impact} onChange={setImpact} testid="impact" />
              <Choice label="How urgent is it?" options={f.urgency} value={urgency} onChange={setUrgency} testid="urgency" />
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}

function Choice({ label, options, value, onChange, testid }: { label: string; options: Array<{ value: DeskLevel; label: string; hint: string }>; value: DeskLevel | null; onChange: (v: DeskLevel) => void; testid: string }) {
  return (
    <fieldset>
      <legend className="mb-1 text-[12.5px] font-medium">{label}</legend>
      <div className="space-y-1.5" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)} data-testid={`desk-${testid}-${o.value}`}
            className={cn('block w-full rounded-[8px] border px-3 py-1.5 text-left', value === o.value ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border)] hover:bg-[var(--w-hover)]')}>
            <span className="block text-[12.5px] font-medium">{o.label}</span>
            <span className="block text-[11.5px] text-[var(--w-text-3)]">{o.hint}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Mục tiêu + CSAT của một yêu cầu trong cổng khách. Không phải yêu cầu service desk ⇒ không vẽ gì. */
export function PortalSlaPanel({ pid, num, asClient }: { pid: number; num: number; asClient: boolean }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: deskKeys.portalTicket(pid, num, asClient), queryFn: () => deskApi.portalTicket(pid, num, asClient) });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const send = useMutation({
    mutationFn: () => deskApi.submitCsat(pid, num, { rating, comment: comment || null }),
    onSuccess: () => { toast.success('Thank you for your feedback'); qc.invalidateQueries({ queryKey: deskKeys.portalTicket(pid, num, asClient) }); },
    onError: (err) => toast.error(workError(err, 'Could not send your rating')),
  });
  const t = q.data?.ticket;
  if (!t) return null;
  return (
    <section className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-sunken)] p-3" data-testid="portal-sla">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px]">
        <span className="font-medium">{t.requestTypeName}</span>
        {t.resolved
          ? <span className="flex items-center gap-1.5 text-[var(--w-green)]"><CheckCircle2 size={14} /> Resolved</span>
          : t.responded
            ? <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[var(--w-green)]" /> The team has responded · target resolution within {t.resolveWithin}</span>
            : <span className="flex items-center gap-1.5" data-testid="portal-promise"><Clock size={14} className="text-[var(--w-text-3)]" /> We’ll respond within {t.respondWithin} · target resolution within {t.resolveWithin}</span>}
      </div>
      {t.csat.rating !== null && t.csat.rating !== undefined ? (
        <p className="mt-2 flex flex-wrap items-center gap-2 text-[12.5px] text-[var(--w-text-2)]" data-testid="csat-done">
          Your rating: <span className="text-[var(--w-orange)]">{'★'.repeat(t.csat.rating)}<span className="opacity-30">{'★'.repeat(5 - t.csat.rating)}</span></span>{t.csat.comment && <span>“{t.csat.comment}”</span>}
        </p>
      ) : t.csat.canAnswer ? (
        <div className="mt-3 border-t border-[var(--w-border)] pt-3" data-testid="csat-form">
          <div className="mb-1.5 text-[13px] font-medium">How did we do?</div>
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating from 1 to 5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} out of 5`} onClick={() => setRating(n)} data-testid={`csat-${n}`}
                className="flex h-9 w-9 items-center justify-center rounded-[8px] hover:bg-[var(--w-hover)]">
                <Star size={20} style={{ color: n <= rating ? 'var(--w-orange)' : 'var(--w-text-3)', fill: n <= rating ? 'var(--w-orange)' : 'transparent' }} />
              </button>
            ))}
            <span className="ml-2 text-[12px] text-[var(--w-text-3)]">{['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'][rating]}</span>
          </div>
          <textarea className="w-input mt-2 min-h-[60px] py-2" placeholder="Anything we should know? (optional)" value={comment} maxLength={2000} onChange={(e) => setComment(e.target.value)} data-testid="csat-comment" />
          <div className="mt-2 flex justify-end">
            <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!rating || send.isPending} onClick={() => send.mutate()} data-testid="csat-send">{send.isPending ? <Spinner size={12} /> : <Send size={13} />} Send rating</button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
