'use client';

/**
 * /work/survey/<token> — CTW đợt 6b (R2): khảo sát công khai, không cần tài khoản. Không sidebar / bảng lệnh / AI.
 * Trả lời xong ⇒ màn cảm ơn; khảo sát đã đóng / hết hạn / đủ lượt ⇒ nói rõ lý do. Máy chủ có trần lượt gọi theo IP.
 */

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle2, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, workErrorStatus } from '@/lib/work-api';
import { workPublic6bApi, type SurveyQuestion } from '@/lib/work-swr6b-api';
import { CtWorkMark } from '@/components/work/brand/CtWorkMark';
import { Spinner } from '@/components/work/ui';
import { wt, type WKey } from '@/components/work/i18n';

const CLOSED_KEY: Record<string, WKey> = { CLOSED: 'elic.pubClosed', EXPIRED: 'elic.pubExpired', FULL: 'elic.pubFull' };

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-[var(--w-bg)] px-4 py-8">
      <div className="mx-auto w-full max-w-[680px]">
        <div className="mb-5 flex items-center gap-2 text-[13px] font-semibold tracking-tight text-[var(--w-text-2)]"><CtWorkMark size={22} />CT Work</div>
        {children}
      </div>
    </div>
  );
}

export default function PublicSurveyPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token ?? '';
  const q = useQuery({ queryKey: ['work-public-survey', token], queryFn: () => workPublic6bApi.survey(token), retry: false, enabled: !!token });
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = useMutation({
    mutationFn: () => workPublic6bApi.submit(token, { answers, ...(name.trim() ? { name: name.trim() } : {}) }),
    onError: (e) => {
      const list = (e as { response?: { data?: { data?: { errors?: Array<{ id: string; code: string }> } } } })?.response?.data?.data?.errors ?? [];
      setErrors(Object.fromEntries(list.map((x) => [x.id, x.code === 'REQUIRED' ? wt('elic.pubRequired') : wt('elic.pubInvalid')])));
    },
  });

  if (q.isLoading) return <Shell><div className="flex justify-center py-16"><Spinner /></div></Shell>;
  if (!q.data) {
    return (
      <Shell>
        <div className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-6 text-center">
          <h1 className="text-[16px] font-semibold">{workErrorStatus(q.error) === 404 ? wt('elic.pubNotFound') : wt('share.sCouldNot')}</h1>
          <p className="mt-2 text-[13px] text-[var(--w-text-2)]">{workErrorStatus(q.error) === 404 ? wt('elic.pubNotFoundBody') : workError(q.error)}</p>
        </div>
      </Shell>
    );
  }
  const s = q.data;
  if (submit.isSuccess) {
    return (
      <Shell>
        <div className="flex flex-col items-center rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-8 text-center">
          <CheckCircle2 size={28} className="text-[var(--w-green-text)]" aria-hidden="true" />
          <h1 className="mt-3 text-[17px] font-semibold">{wt('elic.pubThanks')}</h1>
          <p className="mt-1 text-[13px] text-[var(--w-text-2)]">{wt('elic.pubThanksBody', { project: s.project })}</p>
        </div>
      </Shell>
    );
  }
  const set = (id: string, v: unknown) => { setAnswers((a) => ({ ...a, [id]: v })); setErrors((e) => { const { [id]: _, ...rest } = e; return rest; }); };
  return (
    <Shell>
      <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); submit.mutate(); }} noValidate>
        <header className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-5">
          <p className="flex items-center gap-1.5 text-[12px] text-[var(--w-text-2)]"><ClipboardList size={13} aria-hidden="true" />{s.project}</p>
          <h1 className="mt-1 text-[20px] font-semibold">{s.title}</h1>
          {s.description && <p className="mt-2 whitespace-pre-line text-[13.5px] text-[var(--w-text-2)]">{s.description}</p>}
          {s.closed && <p role="status" className="mt-3 text-[13px] font-medium text-[var(--w-orange-text)]">{wt(CLOSED_KEY[s.closed] ?? 'elic.pubClosed')}</p>}
        </header>
        {!s.closed && (
          <>
            {s.collectName && (
              <div className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4">
                <label className="w-label" htmlFor="pub-name">{wt('elic.pubName')}</label>
                <input id="pub-name" className="w-input" value={name} maxLength={120} autoComplete="name" onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            {s.questions.map((qq, i) => <QuestionBlock key={qq.id} q={qq} n={i + 1} value={answers[qq.id]} error={errors[qq.id]} onChange={(v) => set(qq.id, v)} />)}
            {submit.isError && !Object.keys(errors).length && <p role="alert" className="text-[13px] text-[var(--w-red-text)]">{workError(submit.error)}</p>}
            <button type="submit" className="w-btn w-btn-primary self-start" disabled={submit.isPending}>{submit.isPending && <Spinner size={12} />} {wt('elic.pubSubmit')}</button>
            <p className="text-[12px] text-[var(--w-text-3)]">{wt('elic.pubPrivacy')}</p>
          </>
        )}
      </form>
    </Shell>
  );
}

function QuestionBlock({ q, n, value, error, onChange }: { q: SurveyQuestion; n: number; value: unknown; error?: string; onChange: (v: unknown) => void }) {
  const id = `q-${q.id}`;
  const legend = <>{n}. {q.text}{q.required && <span className="ml-0.5 text-[var(--w-red-text)]" aria-hidden="true">*</span>}{q.required && <span className="sr-only"> ({wt('elic.required')})</span>}</>;
  const box = cn('rounded-[10px] border bg-[var(--w-panel)] p-4', error ? 'border-[var(--w-red)]' : 'border-[var(--w-border)]');
  const err = error ? <p id={`${id}-err`} className="mt-1.5 text-[12.5px] text-[var(--w-red-text)]">{error}</p> : null;
  if (q.kind === 'TEXT' || q.kind === 'LONG_TEXT') {
    return (
      <div className={box}>
        <label className="mb-1.5 block text-[14px] font-medium" htmlFor={id}>{legend}</label>
        {q.help && <p className="mb-1.5 text-[12.5px] text-[var(--w-text-2)]">{q.help}</p>}
        {q.kind === 'TEXT'
          ? <input id={id} className="w-input" maxLength={500} value={String(value ?? '')} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} onChange={(e) => onChange(e.target.value)} />
          : <textarea id={id} className="w-input min-h-[96px] py-1.5" rows={4} maxLength={5000} value={String(value ?? '')} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} onChange={(e) => onChange(e.target.value)} />}
        {err}
      </div>
    );
  }
  const options: Array<{ v: string | number | boolean; label: string }> = q.kind === 'SCALE'
    ? Array.from({ length: q.scaleMax }, (_, k) => ({ v: k + 1, label: String(k + 1) }))
    : q.kind === 'YES_NO' ? [{ v: true, label: wt('common.yes') }, { v: false, label: wt('common.no') }] : q.options.map((o) => ({ v: o, label: o }));
  const multi = q.kind === 'MULTI';
  const arr = Array.isArray(value) ? (value as string[]) : [];
  return (
    <fieldset className={box} aria-describedby={error ? `${id}-err` : undefined}>
      <legend className="float-left mb-2 w-full text-[14px] font-medium">{legend}</legend>
      {q.help && <p className="clear-both mb-1.5 text-[12.5px] text-[var(--w-text-2)]">{q.help}</p>}
      <div className={cn('clear-both flex gap-2', q.kind === 'SCALE' ? 'flex-wrap' : 'flex-col')}>
        {options.map((o) => {
          const checked = multi ? arr.includes(String(o.v)) : value === o.v;
          return (
            <label key={String(o.v)} className={cn('flex cursor-pointer items-center gap-2 rounded-[8px] border px-3 py-2 text-[13.5px]', checked ? 'border-[var(--w-accent)] bg-[color-mix(in_srgb,var(--w-accent)_8%,transparent)]' : 'border-[var(--w-border)]', q.kind === 'SCALE' && 'min-w-[48px] justify-center')}>
              <input type={multi ? 'checkbox' : 'radio'} name={id} className={q.kind === 'SCALE' ? 'sr-only' : ''} checked={checked}
                onChange={() => onChange(multi ? (checked ? arr.filter((x) => x !== String(o.v)) : [...arr, String(o.v)]) : o.v)} />
              {o.label}
            </label>
          );
        })}
      </div>
      {q.kind === 'SCALE' && <p className="mt-1.5 text-[12px] text-[var(--w-text-3)]">{wt('elic.pubScaleHint', { max: q.scaleMax })}</p>}
      {err}
    </fieldset>
  );
}
