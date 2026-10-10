'use client';

/**
 * CTW đợt 8c — khách trả lời lời mời họp NGAY TRÊN CỔNG (Có / Chưa chắc / Không + lý do).
 * Chỉ hiện với khách THẬT có tên trong danh sách mời (máy chủ trả `me`); xem trước của nhân viên ⇒ không hiện.
 * Backend: POST /projects/:pid/portal/meetings/:num/rsvp.
 */

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, HelpCircle, X } from 'lucide-react';
import { workError } from '@/lib/work-api';
import { meetingSeriesApi, type PortalMe } from '@/lib/work-c8c-api';
import { cn } from '@/lib/utils';
import { useWT } from '../i18n';

type Answer = 'YES' | 'MAYBE' | 'NO';

export default function PortalRsvp({ pid, num, me }: { pid: number; num: number; me: PortalMe | null | undefined }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [note, setNote] = useState(me?.rsvpNote ?? '');
  const [pending, setPending] = useState<Answer | null>(null);
  const send = useMutation({
    mutationFn: (a: Answer) => meetingSeriesApi.portalRsvp(pid, num, a, a === 'YES' ? null : note.trim() || null),
    onMutate: (a) => setPending(a),
    onSuccess: () => { toast.success(t('c8c.rsvpSaved')); qc.invalidateQueries({ queryKey: ['work', 'portal', pid] }); },
    onError: (e) => toast.error(workError(e)),
    onSettled: () => setPending(null),
  });
  if (!me) return null;
  const opts: Array<{ a: Answer; label: string; icon: React.ReactNode; tone: string }> = [
    { a: 'YES', label: t('c8c.rsvpYes'), icon: <Check size={13} />, tone: 'border-[var(--w-green)] text-[var(--w-green-text)]' },
    { a: 'MAYBE', label: t('c8c.rsvpMaybe'), icon: <HelpCircle size={13} />, tone: 'border-[var(--w-orange,var(--w-yellow))] text-[var(--w-text)]' },
    { a: 'NO', label: t('c8c.rsvpNo'), icon: <X size={13} />, tone: 'border-[var(--w-red)] text-[var(--w-red-text)]' },
  ];
  return (
    <section className="rounded-[8px] border border-[var(--w-border)] p-3" data-testid="portal-rsvp">
      <h3 className="w-section-title mb-2">{t('c8c.rsvpTitle')}</h3>
      {!me.canRsvp ? (
        <p className="text-[13px] text-[var(--w-text-3)]">{me.rsvp ? t('c8c.rsvpYouSaid', { a: t(`c8c.rsvp${me.rsvp === 'YES' ? 'Yes' : me.rsvp === 'NO' ? 'No' : 'Maybe'}` as never) }) : t('c8c.rsvpClosed')}</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t('c8c.rsvpTitle')}>
            {opts.map((o) => (
              <button key={o.a} type="button" aria-pressed={me.rsvp === o.a} disabled={send.isPending} onClick={() => send.mutate(o.a)}
                className={cn('w-btn', me.rsvp === o.a && cn('border-2 font-semibold', o.tone))} data-testid={`rsvp-${o.a}`}>
                {o.icon} {o.label}{pending === o.a ? '…' : ''}
              </button>
            ))}
          </div>
          <label className="mt-2 flex flex-col gap-1 text-[12.5px]">
            <span className="text-[var(--w-text-2)]">{t('c8c.rsvpNote')}</span>
            <input className="w-input" value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} placeholder={t('c8c.rsvpNotePh')} />
          </label>
        </>
      )}
    </section>
  );
}
