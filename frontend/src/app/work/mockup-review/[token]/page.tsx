'use client';

/**
 * /work/mockup-review/<token> — CTW đợt 6b (R15): KHÁCH xác nhận prototype của một màn trước khi đội code — không cần tài
 * khoản. Một link = một lần quyết định (Đồng ý / Cần sửa + ghi chú); đội đổi thiết kế ⇒ link cũ thôi hiệu lực.
 */

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Check, ExternalLink, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, workErrorStatus } from '@/lib/work-api';
import { workPublic6bApi, type PublicMockup } from '@/lib/work-swr6b-api';
import { CtWorkMark } from '@/components/work/brand/CtWorkMark';
import { Spinner } from '@/components/work/ui';
import { wt } from '@/components/work/i18n';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-[var(--w-bg)] px-4 py-8">
      <div className="mx-auto w-full max-w-[860px]">
        <div className="mb-5 flex items-center gap-2 text-[13px] font-semibold tracking-tight text-[var(--w-text-2)]"><CtWorkMark size={22} />CT Work</div>
        {children}
      </div>
    </div>
  );
}

export default function MockupReviewPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token ?? '';
  const q = useQuery({ queryKey: ['work-public-mockup', token], queryFn: () => workPublic6bApi.mockup(token), retry: false, enabled: !!token });
  const [decision, setDecision] = useState<'APPROVED' | 'CHANGES' | null>(null);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [done, setDone] = useState<PublicMockup | null>(null);
  const send = useMutation({ mutationFn: () => workPublic6bApi.decide(token, { decision: decision!, name: name.trim(), note: note.trim() || null }), onSuccess: (r) => setDone(r) });

  if (q.isLoading) return <Shell><div className="flex justify-center py-16"><Spinner /></div></Shell>;
  if (!q.data) {
    return (
      <Shell>
        <div className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-6 text-center">
          <h1 className="text-[16px] font-semibold">{workErrorStatus(q.error) === 404 ? wt('srsx.pubNotFound') : wt('share.sCouldNot')}</h1>
          <p className="mt-2 text-[13px] text-[var(--w-text-2)]">{workErrorStatus(q.error) === 404 ? wt('srsx.pubNotFoundBody') : workError(q.error)}</p>
        </div>
      </Shell>
    );
  }
  const m = done ?? q.data;
  const decided = m.status === 'APPROVED' || m.status === 'CHANGES';
  return (
    <Shell>
      <article className="flex flex-col gap-4">
        <header className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-5">
          <p className="text-[12px] text-[var(--w-text-2)]">{m.project} · {wt('srsx.pubKicker')}</p>
          <h1 className="mt-1 text-[20px] font-semibold">{m.screen}{m.title ? <span className="font-normal text-[var(--w-text-2)]"> — {m.title}</span> : null}</h1>
          {m.description && <p className="mt-2 whitespace-pre-line text-[13.5px] text-[var(--w-text-2)]">{m.description}</p>}
        </header>
        <div className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3">
          {m.kind === 'IMAGE' && m.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.image} alt={`${wt('srsx.prototype')} — ${m.screen}`} className="mx-auto max-h-[70vh] w-auto rounded-[6px]" />
          ) : m.url ? (
            <a href={m.url} target="_blank" rel="noreferrer noopener" className="flex items-center justify-center gap-2 rounded-[8px] border border-dashed border-[var(--w-border)] py-10 text-[14px] font-medium text-[var(--w-accent-text)] hover:underline">
              <ExternalLink size={16} aria-hidden="true" /> {wt('srsx.pubOpenDesign', { provider: m.provider && m.provider !== 'OTHER' ? m.provider.charAt(0) + m.provider.slice(1).toLowerCase() : wt('srsx.link') })}
            </a>
          ) : null}
        </div>
        {decided ? (
          <div role="status" className={cn('rounded-[10px] border p-5', m.status === 'APPROVED' ? 'border-[var(--w-green)]' : 'border-[var(--w-orange)]', 'bg-[var(--w-panel)]')}>
            <p className="text-[15px] font-semibold">{m.status === 'APPROVED' ? wt('srsx.pubApproved') : wt('srsx.pubChanges')}</p>
            <p className="mt-1 text-[13px] text-[var(--w-text-2)]">{wt('srsx.pubBy', { name: m.reviewerName ?? '—' })}{m.reviewNote ? ` — “${m.reviewNote}”` : ''}</p>
          </div>
        ) : m.status !== 'SUBMITTED' ? (
          <p role="status" className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-5 text-[13.5px] text-[var(--w-text-2)]">{wt('srsx.pubEditing')}</p>
        ) : (
          <form className="flex flex-col gap-3 rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-5" onSubmit={(e) => { e.preventDefault(); send.mutate(); }}>
            <h2 className="text-[15px] font-semibold">{wt('srsx.pubQuestion')}</h2>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={wt('srsx.pubQuestion')}>
              <button type="button" role="radio" aria-checked={decision === 'APPROVED'} className={cn('w-btn', decision === 'APPROVED' && 'w-btn-on')} onClick={() => setDecision('APPROVED')}><Check size={14} /> {wt('srsx.pubYes')}</button>
              <button type="button" role="radio" aria-checked={decision === 'CHANGES'} className={cn('w-btn', decision === 'CHANGES' && 'w-btn-on')} onClick={() => setDecision('CHANGES')}><Undo2 size={14} /> {wt('srsx.pubNo')}</button>
            </div>
            <div>
              <label className="w-label" htmlFor="mr-name">{wt('srsx.pubName')}</label>
              <input id="mr-name" className="w-input max-w-[360px]" value={name} maxLength={120} autoComplete="name" onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="w-label" htmlFor="mr-note">{decision === 'CHANGES' ? wt('srsx.whatChange') : wt('srsx.noteOptional')}</label>
              <textarea id="mr-note" className="w-input min-h-[80px] py-1.5" rows={3} maxLength={4000} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            {send.isError && <p role="alert" className="text-[13px] text-[var(--w-red-text)]">{workError(send.error)}</p>}
            <button type="submit" className="w-btn w-btn-primary self-start" disabled={!decision || name.trim().length < 2 || (decision === 'CHANGES' && !note.trim()) || send.isPending}>{send.isPending && <Spinner size={12} />} {wt('srsx.pubSend')}</button>
          </form>
        )}
      </article>
    </Shell>
  );
}
