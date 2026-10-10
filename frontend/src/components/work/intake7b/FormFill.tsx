'use client';

/**
 * CTW đợt 7b (C8) — điền form ở /work/form/<token>. Form CÔNG KHAI: không cần tài khoản. Form NỘI BỘ: máy chủ trả
 * 403 WORK_FORM_LOGIN ⇒ gọi lại đường có đăng nhập (người không phải thành viên ⇒ 404 như link không tồn tại).
 * Chống spam: ô `website` ẩn (honeypot) + thời gian điền gửi kèm — máy chủ quyết.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle2, ClipboardList, Paperclip } from 'lucide-react';
import { workError, workErrorStatus } from '@/lib/work-api';
import { fileToBase64, workFormsApi, type FillForm, type FormField } from '@/lib/work-ctw7b-api';
import { CtWorkMark } from '@/components/work/brand/CtWorkMark';
import { Spinner } from '@/components/work/ui';
import { useWT, type WKey } from '@/components/work/i18n';

const ERR_KEY: Record<string, WKey> = { REQUIRED: 'c7b.errRequired', INVALID: 'c7b.errInvalid', TOO_MANY_FILES: 'c7b.errTooMany', FILE_TOO_BIG: 'c7b.errTooBig', FILE_TYPE: 'c7b.errFileType' };
const CLOSED_KEY: Record<string, WKey> = { CLOSED: 'c7b.pubClosed', EXPIRED: 'c7b.pubExpired', FULL: 'c7b.pubFull' };
const ACCEPT = 'image/png,image/jpeg,image/gif,image/webp,application/pdf,text/plain,text/csv,.docx,.xlsx,.zip';

function visible(fields: FormField[], answers: Record<string, unknown>): FormField[] {
  const shown = new Set<string>();
  return fields.filter((f) => {
    if (f.showIf) {
      if (!shown.has(f.showIf.field)) return false;
      const a = answers[f.showIf.field];
      if (!(Array.isArray(a) ? a.map(String).includes(f.showIf.equals) : a !== undefined && a !== null && String(a).trim() === f.showIf.equals)) return false;
    }
    shown.add(f.id);
    return true;
  });
}

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

export default function FormFill({ token }: { token: string }) {
  const { t } = useWT();
  const startedAt = useRef(Date.now());
  const pub = useQuery({ queryKey: ['c7b-fill-pub', token], queryFn: () => workFormsApi.publicGet(token), retry: false, enabled: !!token });
  const needLogin = (pub.error as { response?: { data?: { code?: string } } } | null)?.response?.data?.code === 'WORK_FORM_LOGIN';
  const internal = useQuery({ queryKey: ['c7b-fill-int', token], queryFn: () => workFormsApi.internalGet(token), retry: false, enabled: !!token && needLogin });
  const form: FillForm | undefined = pub.data ?? internal.data;
  const isInternal = !pub.data && !!internal.data;
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => { startedAt.current = Date.now(); }, [form?.title]);
  const shown = useMemo(() => (form ? visible(form.fields, answers) : []), [form, answers]);
  const submit = useMutation({
    mutationFn: async () => {
      const enc: Record<string, Array<{ name: string; type: string; data: string }>> = {};
      for (const f of shown.filter((x) => x.kind === 'file')) {
        const list = files[f.id] ?? [];
        if (list.length) enc[f.id] = await Promise.all(list.map(async (file) => ({ name: file.name, type: file.type, data: await fileToBase64(file) })));
      }
      const body = { answers: Object.fromEntries(Object.entries(answers).filter(([k]) => shown.some((f) => f.id === k))), files: enc, website, elapsedMs: Date.now() - startedAt.current, ...(name.trim() ? { name: name.trim() } : {}), ...(email.trim() ? { email: email.trim() } : {}) };
      return isInternal ? workFormsApi.internalSubmit(token, body) : workFormsApi.publicSubmit(token, body);
    },
    onError: (e) => {
      const list = (e as { response?: { data?: { data?: { errors?: Array<{ id: string; code: string }> } } } })?.response?.data?.data?.errors ?? [];
      setErrors(Object.fromEntries(list.map((x) => [x.id, t(ERR_KEY[x.code] ?? 'c7b.errInvalid')])));
    },
  });

  if (pub.isLoading || (needLogin && internal.isLoading)) return <Shell><div className="flex justify-center py-16"><Spinner /></div></Shell>;
  if (!form) {
    const err = needLogin ? internal.error : pub.error;
    const st = workErrorStatus(err);
    return (
      <Shell>
        <div className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-6 text-center">
          <h1 className="text-[16px] font-semibold">{st === 404 ? t('c7b.pubNotFound') : needLogin && st === 401 ? t('c7b.pubLogin') : t('c7b.loadFailed')}</h1>
          <p className="mt-2 text-[13px] text-[var(--w-text-2)]">{st === 404 ? t('c7b.pubNotFoundBody') : needLogin && st === 401 ? t('c7b.pubLoginBody') : workError(err)}</p>
          {needLogin && st === 401 && <a className="w-btn w-btn-primary mt-4" href={`/login?redirect=${encodeURIComponent(`/work/form/${token}`)}`}>{t('c7b.signIn')}</a>}
        </div>
      </Shell>
    );
  }
  if (submit.isSuccess) {
    return (
      <Shell>
        <div className="flex flex-col items-center rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-8 text-center" role="status">
          <CheckCircle2 size={28} className="text-[var(--w-green-text)]" aria-hidden="true" />
          <h1 className="mt-3 text-[17px] font-semibold">{t('c7b.pubThanks')}</h1>
          <p className="mt-1.5 text-[13.5px] text-[var(--w-text-2)]">{submit.data.message || t('c7b.pubThanksBody')}</p>
          {submit.data.issue && <p className="mt-2 text-[13px]">{t('c7b.pubIssue', { key: submit.data.issue.key })}</p>}
        </div>
      </Shell>
    );
  }
  const set = (id: string, v: unknown) => { setAnswers((a) => ({ ...a, [id]: v })); setErrors((e) => { const n = { ...e }; delete n[id]; return n; }); };
  return (
    <Shell>
      <form className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-6" onSubmit={(e) => { e.preventDefault(); submit.mutate(); }} noValidate>
        <div className="flex items-start gap-2.5">
          <ClipboardList size={20} className="mt-0.5 shrink-0 text-[var(--w-accent)]" aria-hidden="true" />
          <div className="min-w-0">
            <h1 className="text-[18px] font-semibold tracking-[-0.01em]">{form.title}</h1>
            <p className="text-[12.5px] text-[var(--w-text-3)]">{form.project}{isInternal ? ` · ${t('c7b.accInternal')}` : ''}</p>
          </div>
        </div>
        {form.description && <p className="mt-3 whitespace-pre-line text-[13.5px] text-[var(--w-text-2)]">{form.description}</p>}
        {form.closed ? (
          <p className="mt-5 rounded-[8px] bg-[var(--w-sunken)] p-4 text-[13.5px]" role="status">{t(CLOSED_KEY[form.closed] ?? 'c7b.pubClosed')}</p>
        ) : (
          <div className="mt-5 space-y-4">
            {shown.map((f) => <FieldInput key={f.id} f={f} value={answers[f.id]} files={files[f.id] ?? []} members={form.members} error={errors[f.id]}
              onChange={(v) => set(f.id, v)} onFiles={(list) => { setFiles((x) => ({ ...x, [f.id]: list })); set(f.id, list.length ? list.map((x) => ({ name: x.name, type: x.type, size: x.size })) : undefined); }} />)}
            {!isInternal && (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block"><span className="w-label">{t('c7b.yourName')}</span><input className="w-input" value={name} maxLength={120} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
                {form.collectEmail && (
                  <label className="block"><span className="w-label">{t('c7b.yourEmail')} <span className="text-[var(--w-red-text)]">*</span></span>
                    <input className="w-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-invalid={!!errors.__email} />
                    {errors.__email && <span className="mt-1 block text-[12px] text-[var(--w-red-text)]">{errors.__email}</span>}
                  </label>
                )}
              </div>
            )}
            {/* Honeypot: người thật không thấy ô này; bot điền vào ⇒ máy chủ bỏ qua lượt gửi. */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
              <label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
            </div>
            {submit.isError && !Object.keys(errors).length && <p className="text-[13px] text-[var(--w-red-text)]" role="alert">{workError(submit.error)}</p>}
            <button type="submit" className="w-btn w-btn-primary" disabled={submit.isPending} data-testid="c7b-fill-submit">{submit.isPending && <Spinner size={12} />} {t('c7b.submit')}</button>
          </div>
        )}
      </form>
    </Shell>
  );
}

function FieldInput({ f, value, files, members, error, onChange, onFiles }: {
  f: FormField; value: unknown; files: File[]; members: Array<{ id: number; name: string }> | null; error?: string;
  onChange: (v: unknown) => void; onFiles: (list: File[]) => void;
}) {
  const { t } = useWT();
  const id = `c7b-${f.id}`;
  const desc = [f.help ? `${id}-help` : '', error ? `${id}-err` : ''].filter(Boolean).join(' ') || undefined;
  const common = { id, 'aria-invalid': !!error, 'aria-describedby': desc, 'aria-required': f.required };
  let input: React.ReactNode;
  switch (f.kind) {
    case 'longtext': input = <textarea {...common} className="w-input min-h-[96px] py-2" value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} />; break;
    case 'number': input = <input {...common} className="w-input" type="number" min={f.min ?? undefined} max={f.max ?? undefined} value={value === undefined ? '' : String(value)} onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />; break;
    case 'date': input = <input {...common} className="w-input" type="date" value={String(value ?? '')} onChange={(e) => onChange(e.target.value || undefined)} />; break;
    case 'select': input = (
      <select {...common} className="w-input" value={String(value ?? '')} onChange={(e) => onChange(e.target.value || undefined)}>
        <option value="">{t('c7b.choose')}</option>{f.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    ); break;
    case 'user': input = (
      <select {...common} className="w-input" value={String(value ?? '')} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}>
        <option value="">{t('c7b.choose')}</option>{(members ?? []).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
    ); break;
    case 'multiselect': {
      const arr = Array.isArray(value) ? (value as string[]) : [];
      return (
        <fieldset aria-describedby={desc}>
          <legend className="w-label">{f.label}{f.required && <span className="text-[var(--w-red-text)]"> *</span>}</legend>
          <div className="flex flex-wrap gap-2">
            {f.options.map((o) => (
              <label key={o} className="flex items-center gap-1.5 rounded-[6px] border border-[var(--w-border)] px-2 py-1 text-[13px]">
                <input type="checkbox" checked={arr.includes(o)} onChange={(e) => onChange(e.target.checked ? [...arr, o] : arr.filter((x) => x !== o))} /> {o}
              </label>
            ))}
          </div>
          {f.help && <p id={`${id}-help`} className="mt-1 text-[12px] text-[var(--w-text-3)]">{f.help}</p>}
          {error && <p id={`${id}-err`} className="mt-1 text-[12px] text-[var(--w-red-text)]">{error}</p>}
        </fieldset>
      );
    }
    case 'file': input = (
      <div>
        <input {...common} type="file" multiple accept={ACCEPT} className="block text-[13px]" onChange={(e) => onFiles(Array.from(e.target.files ?? []).slice(0, 3))} />
        {files.length > 0 && <ul className="mt-1 space-y-0.5 text-[12.5px] text-[var(--w-text-2)]">{files.map((x) => <li key={x.name} className="flex items-center gap-1"><Paperclip size={12} aria-hidden="true" />{x.name}</li>)}</ul>}
        <p className="mt-1 text-[11.5px] text-[var(--w-text-3)]">{t('c7b.fileHint')}</p>
      </div>
    ); break;
    default: input = <input {...common} className="w-input" value={String(value ?? '')} maxLength={500} onChange={(e) => onChange(e.target.value)} />;
  }
  return (
    <div>
      <label htmlFor={id} className="w-label">{f.label}{f.required && <span className="text-[var(--w-red-text)]"> *</span>}</label>
      {input}
      {f.help && <p id={`${id}-help`} className="mt-1 text-[12px] text-[var(--w-text-3)]">{f.help}</p>}
      {error && <p id={`${id}-err`} className="mt-1 text-[12px] text-[var(--w-red-text)]">{error}</p>}
    </div>
  );
}
