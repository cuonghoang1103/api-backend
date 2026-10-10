'use client';

/**
 * CTW đợt 7b (C8) — trang Forms: danh sách form · trình dựng (trường, ẩn/hiện, ánh xạ sang thẻ, link công khai/nội bộ) ·
 * tổng hợp câu trả lời + xuất .xlsx. Máy chủ quyết quyền (MEMBER soạn; ADMIN mới mở form CÔNG KHAI).
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, Copy, Download, ExternalLink, Link2, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { FORM_FIELD_KINDS, workFormsApi, type FormField, type FormFieldKind, type FormMapping, type WorkForm } from '@/lib/work-ctw7b-api';
import { EmptyState, PageLoading, Spinner, publicOrigin } from '../ui';
import KpiTile, { KpiRow } from '../KpiTile';
import { useWT, wt, type WKey } from '../i18n';

const KIND_KEY: Record<FormFieldKind, WKey> = {
  text: 'c7b.kText', longtext: 'c7b.kLongtext', select: 'c7b.kSelect', multiselect: 'c7b.kMultiselect', number: 'c7b.kNumber', date: 'c7b.kDate', file: 'c7b.kFile', user: 'c7b.kUser',
};
const STATUS_TONE: Record<WorkForm['status'], string> = { DRAFT: 'text-[var(--w-text-2)]', OPEN: 'text-[var(--w-green-text)]', CLOSED: 'text-[var(--w-orange-text)]' };
const keys = { list: (pid: number) => ['c7b-forms', pid] as const, resp: (pid: number, ref: string) => ['c7b-form-resp', pid, ref] as const };

type Draft = {
  title: string; description: string; access: 'PUBLIC' | 'INTERNAL'; confirmMessage: string; collectEmail: boolean; maxResponses: string; closesAt: string;
  fields: FormField[]; mapping: FormMapping;
};
const emptyField = (kind: FormFieldKind, n: number): FormField => ({ id: `field_${n}`, kind, label: '', help: null, required: false, options: kind === 'select' || kind === 'multiselect' ? ['Option 1'] : [], min: null, max: null, showIf: null });
const toDraft = (f: WorkForm): Draft => ({
  title: f.title, description: f.description ?? '', access: f.access, confirmMessage: f.confirmMessage ?? '', collectEmail: f.collectEmail,
  maxResponses: f.maxResponses ? String(f.maxResponses) : '', closesAt: f.closesAt ? f.closesAt.slice(0, 16) : '', fields: f.fields, mapping: f.mapping,
});

export default function FormsView({ config, pid }: { config: ProjectConfig; pid: number }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: keys.list(pid), queryFn: () => workFormsApi.list(pid) });
  const [sel, setSel] = useState<string | null>(null);
  const create = useMutation({
    mutationFn: () => workFormsApi.create(pid, { title: t('c7b.untitledForm') }),
    onSuccess: (f) => { qc.invalidateQueries({ queryKey: keys.list(pid) }); setSel(f.key); },
    onError: (e) => toast.error(workError(e)),
  });
  useEffect(() => { if (!sel && q.data?.forms.length) setSel(q.data.forms[0].key); }, [q.data, sel]);
  if (q.isLoading) return <PageLoading />;
  if (q.error || !q.data) return <EmptyState title={t('c7b.loadFailed')} body={workError(q.error)} />;
  const current = q.data.forms.find((f) => f.key === sel) ?? null;
  return (
    <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="w-card min-w-0 p-2" aria-label={t('c7b.formsList')}>
        <div className="flex items-center justify-between px-2 py-1.5">
          <h2 className="text-[13px] font-semibold">{t('c7b.formsList')}</h2>
          {q.data.canEdit && (
            <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => create.mutate()} disabled={create.isPending} data-testid="c7b-new-form">
              <Plus size={13} /> {t('c7b.newForm')}
            </button>
          )}
        </div>
        {q.data.forms.length ? (
          <ul className="mt-1 space-y-0.5">
            {q.data.forms.map((f) => (
              <li key={f.id}>
                <button type="button" onClick={() => setSel(f.key)} aria-current={f.key === sel ? 'true' : undefined}
                  className={cn('w-full rounded-[6px] px-2 py-2 text-left', f.key === sel ? 'bg-[var(--w-accent-soft)]' : 'hover:bg-[var(--w-hover)]')}>
                  <span className="flex items-center gap-2 text-[13px] font-medium"><span className="text-[11.5px] text-[var(--w-text-2)]">{f.key}</span><span className="min-w-0 flex-1 truncate">{f.title}</span></span>
                  <span className="mt-0.5 flex gap-2 text-[11.5px]">
                    <span className={STATUS_TONE[f.status]}>{t(`c7b.st${f.status}` as WKey)}</span>
                    <span className="text-[var(--w-text-2)]">{t(f.access === 'PUBLIC' ? 'c7b.accPublic' : 'c7b.accInternal')}</span>
                    <span className="text-[var(--w-text-2)]">{t('c7b.nResponses', { count: f.responses })}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : <p className="px-2 py-6 text-center text-[13px] text-[var(--w-text-3)]">{t('c7b.noForms')}</p>}
      </aside>
      <div className="min-w-0">
        {current ? <FormEditor key={`${current.key}-${current.rev}`} config={config} pid={pid} form={current} canEdit={q.data.canEdit} canPublish={q.data.canPublish} onDeleted={() => setSel(null)} />
          : <EmptyState title={t('c7b.formsEmptyTitle')} body={t('c7b.formsEmptyBody')} />}
      </div>
    </div>
  );
}

function FormEditor({ config, pid, form, canEdit, canPublish, onDeleted }: { config: ProjectConfig; pid: number; form: WorkForm; canEdit: boolean; canPublish: boolean; onDeleted: () => void }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [tab, setTab] = useState<'build' | 'responses'>('build');
  const [d, setD] = useState<Draft>(() => toDraft(form));
  const dirty = JSON.stringify(d) !== JSON.stringify(toDraft(form));
  const refresh = () => qc.invalidateQueries({ queryKey: keys.list(pid) });
  const save = useMutation({
    mutationFn: () => workFormsApi.update(pid, form.key, {
      title: d.title, description: d.description || null, access: d.access, confirmMessage: d.confirmMessage || null, collectEmail: d.collectEmail,
      maxResponses: d.maxResponses ? Number(d.maxResponses) : null, closesAt: d.closesAt ? new Date(d.closesAt).toISOString() : null,
      fields: d.fields, mapping: d.mapping, rev: form.rev,
    }),
    onSuccess: () => { toast.success(t('c7b.saved')); refresh(); },
    onError: (e) => toast.error(workError(e)),
  });
  const status = useMutation({ mutationFn: (s: WorkForm['status']) => workFormsApi.status(pid, form.key, s), onSuccess: refresh, onError: (e) => toast.error(workError(e)) });
  const rotate = useMutation({ mutationFn: () => workFormsApi.rotate(pid, form.key), onSuccess: () => { toast.success(t('c7b.linkRotated')); refresh(); }, onError: (e) => toast.error(workError(e)) });
  const del = useMutation({ mutationFn: () => workFormsApi.remove(pid, form.key), onSuccess: () => { refresh(); onDeleted(); }, onError: (e) => toast.error(workError(e)) });
  const link = form.link ? `${publicOrigin()}${form.link}` : null;
  const ro = !canEdit;
  const setField = (i: number, patch: Partial<FormField>) => setD((x) => ({ ...x, fields: x.fields.map((f, k) => (k === i ? { ...f, ...patch } : f)) }));
  const move = (i: number, dir: -1 | 1) => setD((x) => { const a = [...x.fields]; const j = i + dir; if (j < 0 || j >= a.length) return x; [a[i], a[j]] = [a[j], a[i]]; return { ...x, fields: a }; });
  const nextId = () => { let n = d.fields.length + 1; while (d.fields.some((f) => f.id === `field_${n}`)) n += 1; return n; };
  const level0 = config.issueTypes.filter((x) => x.level === 0);

  return (
    <section className="w-card min-w-0 p-4" aria-label={form.title}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="min-w-0 flex-1 truncate text-[15px] font-semibold">{form.key} · {form.title}</h2>
        <span className={cn('text-[12.5px] font-medium', STATUS_TONE[form.status])}>{t(`c7b.st${form.status}` as WKey)}</span>
        {canEdit && form.status !== 'OPEN' && (
          <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={dirty || status.isPending || (form.access === 'PUBLIC' && !canPublish)} title={form.access === 'PUBLIC' && !canPublish ? t('c7b.adminOpens') : dirty ? t('c7b.saveFirst') : undefined}
            onClick={() => status.mutate('OPEN')} data-testid="c7b-form-open">{t('c7b.openForm')}</button>
        )}
        {canEdit && form.status === 'OPEN' && <button type="button" className="w-btn w-btn-sm" onClick={() => status.mutate('CLOSED')}>{t('c7b.closeForm')}</button>}
      </div>
      {link && (
        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px]">
          <Link2 size={14} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
          <code className="min-w-0 flex-1 truncate" data-testid="c7b-form-link">{link}</code>
          <button type="button" className="w-btn w-btn-sm w-btn-ghost" onClick={() => { void navigator.clipboard?.writeText(link); toast.success(t('c7b.copied')); }}><Copy size={13} /> {t('c7b.copy')}</button>
          <a className="w-btn w-btn-sm w-btn-ghost" href={link} target="_blank" rel="noreferrer"><ExternalLink size={13} /> {t('c7b.openLink')}</a>
          {canPublish && <button type="button" className="w-btn w-btn-sm w-btn-ghost" onClick={() => rotate.mutate()}><RefreshCw size={13} /> {t('c7b.rotate')}</button>}
        </div>
      )}
      <div className="mt-3 flex gap-1 border-b border-[var(--w-border)]" role="tablist" aria-label={form.title}>
        {(['build', 'responses'] as const).map((x) => (
          <button key={x} type="button" role="tab" aria-selected={tab === x} onClick={() => setTab(x)}
            className={cn('-mb-px border-b-2 px-2.5 py-2 text-[13px] font-medium', tab === x ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)]')}>
            {x === 'build' ? t('c7b.tabBuild') : t('c7b.tabResponses', { count: form.responses })}
          </button>
        ))}
      </div>
      {tab === 'responses' ? <Responses pid={pid} form={form} /> : (
        <fieldset disabled={ro} className="mt-4 min-w-0 space-y-5">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block"><span className="w-label">{t('c7b.fTitle')}</span><input className="w-input" value={d.title} maxLength={200} onChange={(e) => setD({ ...d, title: e.target.value })} /></label>
            <label className="block"><span className="w-label">{t('c7b.fAccess')}</span>
              <select className="w-input" value={d.access} onChange={(e) => setD({ ...d, access: e.target.value as Draft['access'] })}>
                <option value="PUBLIC">{t('c7b.accPublicLong')}</option><option value="INTERNAL">{t('c7b.accInternalLong')}</option>
              </select>
            </label>
            <label className="block md:col-span-2"><span className="w-label">{t('c7b.fDescription')}</span><textarea className="w-input min-h-[60px] py-2" value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} /></label>
            <label className="block"><span className="w-label">{t('c7b.fConfirm')}</span><input className="w-input" value={d.confirmMessage} maxLength={500} placeholder={t('c7b.fConfirmPh')} onChange={(e) => setD({ ...d, confirmMessage: e.target.value })} /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="w-label">{t('c7b.fMax')}</span><input className="w-input" type="number" min={1} value={d.maxResponses} onChange={(e) => setD({ ...d, maxResponses: e.target.value })} /></label>
              <label className="block"><span className="w-label">{t('c7b.fCloses')}</span><input className="w-input" type="datetime-local" value={d.closesAt} onChange={(e) => setD({ ...d, closesAt: e.target.value })} /></label>
            </div>
            <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={d.collectEmail} onChange={(e) => setD({ ...d, collectEmail: e.target.checked })} /> {t('c7b.fCollectEmail')}</label>
          </div>

          <div>
            <h3 className="w-section-title">{t('c7b.fields')}</h3>
            <ol className="mt-2 space-y-2">
              {d.fields.map((f, i) => (
                <li key={i} className="rounded-[8px] border border-[var(--w-border)] p-3" data-testid={`c7b-field-${i}`}>
                  <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_160px_auto]">
                    <input className="w-input" aria-label={t('c7b.fieldLabel')} placeholder={t('c7b.fieldLabel')} value={f.label} onChange={(e) => setField(i, { label: e.target.value })} />
                    <select className="w-input" aria-label={t('c7b.fieldKind')} value={f.kind} onChange={(e) => { const k = e.target.value as FormFieldKind; setField(i, { kind: k, options: k === 'select' || k === 'multiselect' ? (f.options.length ? f.options : ['Option 1']) : [] }); }}>
                      {FORM_FIELD_KINDS.map((k) => <option key={k} value={k} disabled={k === 'user' && d.access === 'PUBLIC'}>{t(KIND_KEY[k])}</option>)}
                    </select>
                    <div className="flex items-center gap-1">
                      <label className="flex items-center gap-1 whitespace-nowrap text-[12.5px]"><input type="checkbox" checked={f.required} onChange={(e) => setField(i, { required: e.target.checked })} /> {t('c7b.required')}</label>
                      <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c7b.moveUp')} onClick={() => move(i, -1)}><ArrowUp size={13} /></button>
                      <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c7b.moveDown')} onClick={() => move(i, 1)}><ArrowDown size={13} /></button>
                      <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm w-btn-danger" aria-label={t('c7b.removeField')} onClick={() => setD((x) => ({ ...x, fields: x.fields.filter((_, k) => k !== i) }))}><Trash2 size={13} /></button>
                    </div>
                  </div>
                  {(f.kind === 'select' || f.kind === 'multiselect') && (
                    <label className="mt-2 block"><span className="w-label">{t('c7b.options')}</span>
                      <textarea className="w-input min-h-[56px] py-2" value={f.options.join('\n')} onChange={(e) => setField(i, { options: e.target.value.split('\n') })} />
                    </label>
                  )}
                  <div className="mt-2 grid gap-2 md:grid-cols-[minmax(0,1fr)_200px_160px]">
                    <input className="w-input" aria-label={t('c7b.help')} placeholder={t('c7b.help')} value={f.help ?? ''} onChange={(e) => setField(i, { help: e.target.value || null })} />
                    <select className="w-input" aria-label={t('c7b.showIf')} value={f.showIf?.field ?? ''} onChange={(e) => setField(i, { showIf: e.target.value ? { field: e.target.value, equals: f.showIf?.equals ?? '' } : null })}>
                      <option value="">{t('c7b.alwaysShow')}</option>
                      {d.fields.slice(0, i).filter((x) => ['select', 'multiselect', 'text', 'number'].includes(x.kind)).map((x) => <option key={x.id} value={x.id}>{t('c7b.showIfField', { f: x.label || x.id })}</option>)}
                    </select>
                    {f.showIf && <input className="w-input" aria-label={t('c7b.equals')} placeholder={t('c7b.equals')} value={f.showIf.equals} onChange={(e) => setField(i, { showIf: { field: f.showIf!.field, equals: e.target.value } })} />}
                  </div>
                  <p className="mt-1 text-[11.5px] text-[var(--w-text-3)]">{t('c7b.fieldId', { id: f.id })}</p>
                </li>
              ))}
            </ol>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {FORM_FIELD_KINDS.filter((k) => k !== 'user' || d.access === 'INTERNAL').map((k) => (
                <button key={k} type="button" className="w-btn w-btn-sm" onClick={() => setD((x) => ({ ...x, fields: [...x.fields, emptyField(k, nextId())] }))}><Plus size={12} /> {t(KIND_KEY[k])}</button>
              ))}
            </div>
            {d.access === 'PUBLIC' && <p className="mt-1.5 text-[12px] text-[var(--w-text-3)]">{t('c7b.publicNoUser')}</p>}
          </div>

          <div>
            <h3 className="w-section-title">{t('c7b.mapping')}</h3>
            <p className="mt-1 text-[12.5px] text-[var(--w-text-2)]">{t('c7b.mappingHint')}</p>
            <div className="mt-2 grid gap-3 md:grid-cols-2">
              <label className="block"><span className="w-label">{t('c7b.mapType')}</span>
                <select className="w-input" value={d.mapping.typeKey ?? ''} onChange={(e) => setD({ ...d, mapping: { ...d.mapping, typeKey: e.target.value || null } })}>
                  <option value="">{t('c7b.mapTypeDefault')}</option>
                  {level0.map((x) => <option key={x.id} value={x.key}>{x.name}</option>)}
                </select>
              </label>
              <label className="block"><span className="w-label">{t('c7b.mapTitle')}</span>
                <input className="w-input" value={d.mapping.titleTemplate ?? ''} placeholder="[{kind}] {summary}" onChange={(e) => setD({ ...d, mapping: { ...d.mapping, titleTemplate: e.target.value || null } })} />
              </label>
              <label className="block"><span className="w-label">{t('c7b.mapAssignee')}</span>
                <select className="w-input" value={d.mapping.assigneeId ?? ''} onChange={(e) => setD({ ...d, mapping: { ...d.mapping, assigneeId: e.target.value ? Number(e.target.value) : null } })}>
                  <option value="">{t('c7b.unassigned')}</option>
                  {config.members.filter((m) => m.role !== 'CLIENT').map((m) => <option key={m.id} value={m.id}>{m.displayName ?? m.fullName ?? m.username}</option>)}
                </select>
              </label>
              <label className="block"><span className="w-label">{t('c7b.mapPriority')}</span>
                <select className="w-input" value={d.mapping.priority ?? ''} onChange={(e) => setD({ ...d, mapping: { ...d.mapping, priority: e.target.value ? Number(e.target.value) : null } })}>
                  <option value="">{t('c7b.mapDefault')}</option>
                  {[1, 2, 3, 4, 5].map((p) => <option key={p} value={p}>{t(`c7b.prio${p}` as WKey)}</option>)}
                </select>
              </label>
              <fieldset className="md:col-span-2">
                <legend className="w-label">{t('c7b.mapLabels')}</legend>
                <div className="flex flex-wrap gap-1.5">
                  {config.labels.length ? config.labels.map((l) => (
                    <label key={l.id} className="flex items-center gap-1 rounded-[6px] border border-[var(--w-border)] px-2 py-1 text-[12.5px]">
                      <input type="checkbox" checked={d.mapping.labelIds.includes(l.id)} onChange={(e) => setD({ ...d, mapping: { ...d.mapping, labelIds: e.target.checked ? [...d.mapping.labelIds, l.id] : d.mapping.labelIds.filter((x) => x !== l.id) } })} /> {l.name}
                    </label>
                  )) : <span className="text-[12.5px] text-[var(--w-text-3)]">{t('c7b.noLabels')}</span>}
                </div>
              </fieldset>
              {config.customFields.length > 0 && (
                <fieldset className="md:col-span-2">
                  <legend className="w-label">{t('c7b.mapCustom')}</legend>
                  <div className="grid gap-2 md:grid-cols-2">
                    {config.customFields.map((cf) => (
                      <label key={cf.id} className="flex items-center gap-2 text-[12.5px]">
                        <span className="w-32 shrink-0 truncate">{cf.name}</span>
                        <select className="w-input" value={d.mapping.customFields[String(cf.id)] ?? ''} onChange={(e) => { const cfm = { ...d.mapping.customFields }; if (e.target.value) cfm[String(cf.id)] = e.target.value; else delete cfm[String(cf.id)]; setD({ ...d, mapping: { ...d.mapping, customFields: cfm } }); }}>
                          <option value="">—</option>
                          {d.fields.map((f) => <option key={f.id} value={f.id}>{f.label || f.id}</option>)}
                        </select>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
            </div>
          </div>

          {canEdit && (
            <div className="flex flex-wrap items-center gap-2 border-t border-[var(--w-border)] pt-3">
              <button type="button" className="w-btn w-btn-primary" disabled={!dirty || save.isPending} onClick={() => save.mutate()} data-testid="c7b-form-save">{save.isPending && <Spinner size={12} />} {t('c7b.save')}</button>
              {dirty && <button type="button" className="w-btn w-btn-ghost" onClick={() => setD(toDraft(form))}>{t('c7b.discard')}</button>}
              {canPublish && <button type="button" className="w-btn w-btn-ghost w-btn-danger ml-auto" onClick={() => { if (window.confirm(t('c7b.deleteFormQ'))) del.mutate(); }}><Trash2 size={13} /> {t('c7b.deleteForm')}</button>}
            </div>
          )}
        </fieldset>
      )}
    </section>
  );
}

function Responses({ pid, form }: { pid: number; form: WorkForm }) {
  const { t, fmtDateTime } = useWT();
  const q = useQuery({ queryKey: keys.resp(pid, form.key), queryFn: () => workFormsApi.responses(pid, form.key) });
  const exp = useMutation({
    mutationFn: async () => {
      const blob = await workFormsApi.exportXlsx(pid, form.key);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = `${form.key}-responses.xlsx`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    },
    onError: (e) => toast.error(workError(e)),
  });
  const fields = useMemo(() => q.data?.form.fields ?? [], [q.data]);
  if (q.isLoading) return <PageLoading rows={3} />;
  if (q.error || !q.data) return <EmptyState title={t('c7b.loadFailed')} body={workError(q.error)} />;
  const cell = (v: unknown) => (v === undefined || v === null ? '' : Array.isArray(v) ? v.map((x) => (typeof x === 'object' && x ? (x as { name: string }).name : String(x))).join(', ') : String(v));
  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center gap-2">
        <KpiRow label={t('c7b.summary')}><KpiTile label={t('c7b.responsesTotal')} value={q.data.total} /></KpiRow>
        <button type="button" className="w-btn w-btn-sm ml-auto" onClick={() => exp.mutate()} disabled={!q.data.total}><Download size={13} /> {t('c7b.exportXlsx')}</button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {q.data.summary.map((s) => (
          <div key={s.id} className="rounded-[8px] border border-[var(--w-border)] p-3">
            <div className="flex items-baseline justify-between gap-2"><span className="truncate text-[13px] font-medium">{s.label}</span><span className="text-[11.5px] text-[var(--w-text-3)]">{t('c7b.answered', { count: s.answered })}</span></div>
            {s.counts && (
              <ul className="mt-2 space-y-1">
                {s.counts.map((c) => {
                  const pct = s.answered ? Math.round((c.n / s.answered) * 100) : 0;
                  return (
                    <li key={c.option} className="text-[12.5px]">
                      <div className="flex justify-between"><span className="truncate">{c.option}</span><span className="tabular-nums text-[var(--w-text-2)]">{c.n} · {pct}%</span></div>
                      <div className="mt-0.5 h-1.5 rounded-full bg-[var(--w-sunken)]"><div className="h-1.5 rounded-full bg-[var(--w-accent)]" style={{ width: `${pct}%` }} /></div>
                    </li>
                  );
                })}
              </ul>
            )}
            {s.average !== undefined && <p className="mt-2 text-[12.5px] text-[var(--w-text-2)]">{t('c7b.avgMinMax', { avg: s.average ?? '—', min: s.min ?? '—', max: s.max ?? '—' })}</p>}
            {s.earliest !== undefined && <p className="mt-2 text-[12.5px] text-[var(--w-text-2)]">{s.earliest ?? '—'} → {s.latest ?? '—'}</p>}
            {s.files !== undefined && <p className="mt-2 text-[12.5px] text-[var(--w-text-2)]">{t('c7b.nFiles', { count: s.files })}</p>}
            {s.samples && <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-[12.5px] text-[var(--w-text-2)]">{s.samples.map((x, i) => <li key={i} className="truncate">“{x}”</li>)}</ul>}
          </div>
        ))}
      </div>
      {q.data.responses.length > 0 && (
        <div className="w-table-wrap overflow-x-auto">
          <table className="w-full min-w-[640px] text-[12.5px]">
            <thead><tr className="text-left text-[var(--w-text-3)]"><th className="p-2">{t('c7b.colWhen')}</th><th className="p-2">{t('c7b.colIssue')}</th><th className="p-2">{t('c7b.colWho')}</th>{fields.map((f) => <th key={f.id} className="p-2">{f.label}</th>)}</tr></thead>
            <tbody>
              {q.data.responses.map((r) => (
                <tr key={r.id} className="border-t border-[var(--w-border)]">
                  <td className="whitespace-nowrap p-2">{fmtDateTime(r.createdAt)}</td>
                  <td className="p-2">{r.issue?.key ?? '—'}</td>
                  <td className="p-2">{r.respondent ?? r.email ?? t('c7b.anonymous')}</td>
                  {fields.map((f) => <td key={f.id} className="max-w-[240px] truncate p-2">{cell(r.answers[f.id])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!q.data.total && <p className="text-[13px] text-[var(--w-text-3)]">{wt('c7b.noResponses')}</p>}
    </div>
  );
}
