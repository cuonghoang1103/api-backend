'use client';

/**
 * CTW đợt 6b (R2) — Khảo sát nhanh (questionnaire, kỹ thuật elicitation thứ 4 của Wiegers ch.7): soạn câu hỏi (chữ ngắn/dài,
 * một lựa chọn, nhiều lựa chọn, thang điểm, có/không) ⇒ mở link công khai `/work/survey/<token>` (không cần tài khoản) ⇒
 * xem tổng hợp ⇒ xuất .xlsx (Responses / Summary / Questions). Khảo sát gắn với một phiên elicitation thì AI đọc được câu trả
 * lời khi rút đề xuất yêu cầu.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Copy, FileSpreadsheet, Link2, Lock, Plus, RefreshCw, Send, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { QUESTION_KINDS, workSwr6bApi, workSwr6bKeys, type QuestionKind, type SurveyDetail, type SurveyQuestion } from '@/lib/work-swr6b-api';
import { useWT, wt, type WKey } from '@/components/work/i18n';
import { Dialog, EmptyState, Field, PageLoading, publicOrigin, Spinner } from '../ui';
import { Chip, downloadFile, Note, Section, TabIntro, TableFrame, TD, TH, use6bRefresh } from './shared';

export const KIND_KEY: Record<QuestionKind, WKey> = { TEXT: 'elic.qkText', LONG_TEXT: 'elic.qkLong', SINGLE: 'elic.qkSingle', MULTI: 'elic.qkMulti', SCALE: 'elic.qkScale', YES_NO: 'elic.qkYesNo' };
const STATUS_KEY: Record<SurveyDetail['status'], WKey> = { DRAFT: 'common.draft', OPEN: 'elic.svOpen', CLOSED: 'elic.svClosed' };

type Draft = Array<Partial<SurveyQuestion> & { kind: QuestionKind; text: string; optionsText?: string }>;
const toDraft = (qs: SurveyQuestion[]): Draft => qs.map((q) => ({ ...q, optionsText: q.options.join('\n') }));
const fromDraft = (d: Draft) => d.filter((q) => q.text.trim()).map((q) => ({
  ...(q.id ? { id: q.id } : {}), kind: q.kind, text: q.text.trim(), required: !!q.required, help: q.help ?? null,
  ...(q.kind === 'SINGLE' || q.kind === 'MULTI' ? { options: (q.optionsText ?? '').split('\n').map((x) => x.trim()).filter(Boolean) } : {}),
  ...(q.kind === 'SCALE' ? { scaleMax: q.scaleMax ?? 5 } : {}),
}));

export default function SurveysTab({ pid }: { pid: number }) {
  const { fmtDateTime } = useWT();
  const refresh = use6bRefresh(pid);
  const q = useQuery({ queryKey: workSwr6bKeys.surveys(pid), queryFn: () => workSwr6bApi.surveys(pid) });
  const sess = useQuery({ queryKey: workSwr6bKeys.sessions(pid), queryFn: () => workSwr6bApi.sessions(pid) });
  const [open, setOpen] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [nt, setNt] = useState({ title: '', session: '' });
  const create = useMutation({
    mutationFn: () => workSwr6bApi.createSurvey(pid, { title: nt.title.trim(), session: nt.session || null }),
    onSuccess: (s) => { refresh(); setCreating(false); setOpen(s.number); setNt({ title: '', session: '' }); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  if (q.isLoading) return <PageLoading rows={5} />;
  if (!q.data) return <EmptyState title={wt('swr.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const data = q.data;
  // Mặc định mở khảo sát đang mở (đang thu câu trả lời), không thì cái mới nhất.
  const current = open ?? data.surveys.find((s) => s.status === 'OPEN')?.number ?? data.surveys[0]?.number ?? null;
  return (
    <div className="flex flex-col gap-5">
      <TabIntro text={wt('elic.svIntro')}>
        {data.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setCreating(true)}><Plus size={14} /> {wt('elic.newSurvey')}</button>}
      </TabIntro>
      {!data.surveys.length ? <EmptyState title={wt('elic.noSurveys')} body={wt('elic.noSurveysBody')} /> : (
        <>
          <TableFrame label={wt('elic.surveys')} maxH="260px">
            <table className="w-full min-w-[640px] border-separate border-spacing-0">
              <thead><tr>{[wt('elic.hId'), wt('elic.fTitle'), wt('elic.hStatus'), wt('elic.hResponses'), wt('elic.hSession'), wt('elic.hUpdated')].map((h) => <th key={h} scope="col" className={TH}>{h}</th>)}</tr></thead>
              <tbody>
                {data.surveys.map((s) => (
                  <tr key={s.number} className={cn('cursor-pointer hover:bg-[var(--w-hover)]', current === s.number && 'bg-[var(--w-hover)]')} onClick={() => setOpen(s.number)}>
                    <td className={`${TD} font-mono text-[12px]`}><button type="button" className="hover:underline" aria-current={current === s.number ? 'true' : undefined} onClick={() => setOpen(s.number)}>{s.key}</button></td>
                    <td className={`${TD} font-medium`}>{s.title}</td>
                    <td className={TD}><Chip tone={s.status === 'OPEN' ? 'green' : s.status === 'CLOSED' ? 'muted' : 'yellow'}>{wt(STATUS_KEY[s.status])}</Chip></td>
                    <td className={`${TD} tabular-nums`}>{s.responses}</td>
                    <td className={TD}>{s.session ?? '—'}</td>
                    <td className={`${TD} whitespace-nowrap text-[12px] text-[var(--w-text-2)]`}>{fmtDateTime(s.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>
          {current && <SurveyPanel key={current} pid={pid} n={current} onDeleted={() => setOpen(null)} />}
        </>
      )}
      <Dialog open={creating} onClose={() => setCreating(false)} title={wt('elic.newSurvey')} width={480}
        footer={<><button type="button" className="w-btn" onClick={() => setCreating(false)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={!nt.title.trim() || create.isPending} onClick={() => create.mutate()}>{create.isPending && <Spinner size={12} />} {wt('common.create')}</button></>}>
        <Field label={wt('elic.fTitle')}><input className="w-input" autoFocus value={nt.title} maxLength={200} placeholder={wt('elic.svTitlePh')} onChange={(e) => setNt({ ...nt, title: e.target.value })} /></Field>
        <Field label={wt('elic.hSession')} hint={wt('elic.svSessionHint')}>
          <select className="w-input" value={nt.session} onChange={(e) => setNt({ ...nt, session: e.target.value })}>
            <option value="">—</option>{(sess.data?.sessions ?? []).map((s) => <option key={s.key} value={s.key}>{s.key} {s.title}</option>)}
          </select>
        </Field>
      </Dialog>
    </div>
  );
}

function SurveyPanel({ pid, n, onDeleted }: { pid: number; n: number; onDeleted: () => void }) {
  const { fmtDateTime } = useWT();
  const refresh = use6bRefresh(pid);
  const q = useQuery({ queryKey: workSwr6bKeys.survey(pid, n), queryFn: () => workSwr6bApi.survey(pid, n) });
  const [draft, setDraft] = useState<Draft | null>(null);
  const [meta, setMeta] = useState({ title: '', description: '', collectName: false });
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (q.data && !dirty) { setDraft(toDraft(q.data.questions)); setMeta({ title: q.data.title, description: q.data.description ?? '', collectName: q.data.collectName }); }
  }, [q.data, dirty]);
  const save = useMutation({
    mutationFn: () => workSwr6bApi.updateSurvey(pid, n, { title: meta.title.trim(), description: meta.description.trim() || null, collectName: meta.collectName, questions: fromDraft(draft ?? []), rev: q.data!.rev }),
    onSuccess: () => { setDirty(false); refresh(); toast.success(wt('common.saved')); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  const status = useMutation({ mutationFn: (s: 'OPEN' | 'CLOSED' | 'DRAFT') => workSwr6bApi.surveyStatus(pid, n, s), onSuccess: () => refresh(), onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))) });
  const rotate = useMutation({ mutationFn: () => workSwr6bApi.rotateSurvey(pid, n), onSuccess: () => { refresh(); toast.success(wt('elic.linkRotated')); }, onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))) });
  const del = useMutation({ mutationFn: () => workSwr6bApi.deleteSurvey(pid, n), onSuccess: () => { refresh(); onDeleted(); }, onError: (e) => toast.error(workError(e, wt('common.couldNotDelete'))) });
  if (!q.data || !draft) return <PageLoading rows={4} />;
  const s = q.data;
  const ro = !s.canEdit;
  const link = s.publicPath ? `${publicOrigin()}${s.publicPath}` : null;
  const edit = (i: number, patch: Partial<Draft[number]>) => { setDraft(draft.map((x, k) => (k === i ? { ...x, ...patch } : x))); setDirty(true); };
  return (
    <article aria-labelledby="sv-h" className="grid gap-4 rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4 xl:grid-cols-2">
      <div className="flex flex-col gap-3">
        <header className="flex flex-wrap items-center gap-2">
          <h2 id="sv-h" className="flex-1 text-[15px] font-semibold">{s.key} · {s.title}</h2>
          <Chip tone={s.status === 'OPEN' ? 'green' : s.status === 'CLOSED' ? 'muted' : 'yellow'}>{wt(STATUS_KEY[s.status])}</Chip>
          {!ro && <button type="button" className="w-btn w-btn-sm w-btn-ghost w-btn-icon" aria-label={wt('common.delete')} onClick={() => window.confirm(wt('swr.deleteQ', { name: s.key })) && del.mutate()}><Trash2 size={14} /></button>}
        </header>
        {s.canPublish && (
          <div className="flex flex-wrap items-center gap-2">
            {s.status !== 'OPEN' && <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={dirty || status.isPending} title={dirty ? wt('elic.saveFirst') : undefined} onClick={() => status.mutate('OPEN')}><Send size={13} /> {wt('elic.svPublish')}</button>}
            {s.status === 'OPEN' && <button type="button" className="w-btn w-btn-sm" onClick={() => status.mutate('CLOSED')}><Lock size={13} /> {wt('elic.svClose')}</button>}
            {link && <button type="button" className="w-btn w-btn-sm" onClick={() => { void navigator.clipboard?.writeText(link); toast.success(wt('elic.linkCopied')); }}><Copy size={13} /> {wt('elic.copyLink')}</button>}
            {link && <button type="button" className="w-btn w-btn-sm w-btn-ghost" onClick={() => window.confirm(wt('elic.rotateQ')) && rotate.mutate()}><RefreshCw size={13} /> {wt('elic.rotate')}</button>}
          </div>
        )}
        {link && <p className="flex items-center gap-1.5 break-all text-[12.5px] text-[var(--w-text-2)]"><Link2 size={13} aria-hidden="true" /><a className="text-[var(--w-accent-text)] hover:underline" href={link} target="_blank" rel="noreferrer">{link}</a></p>}
        {s.responses > 0 && <Note>{wt('elic.svLocked')}</Note>}
        <Field label={wt('elic.fTitle')}><input className="w-input" readOnly={ro} value={meta.title} maxLength={200} onChange={(e) => { setMeta({ ...meta, title: e.target.value }); setDirty(true); }} /></Field>
        <div className="mb-1">
          <label className="w-label" htmlFor="sv-desc">{wt('elic.svDesc')}</label>
          <textarea id="sv-desc" className="w-input min-h-[52px] py-1.5" rows={2} readOnly={ro} value={meta.description} onChange={(e) => { setMeta({ ...meta, description: e.target.value }); setDirty(true); }} />
        </div>
        <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" disabled={ro} checked={meta.collectName} onChange={(e) => { setMeta({ ...meta, collectName: e.target.checked }); setDirty(true); }} /> {wt('elic.svCollectName')}</label>
        <Section id="sv-qs" title={wt('elic.questions')}>
          <ol className="flex flex-col gap-2">
            {draft.map((x, i) => {
              const locked = s.responses > 0 && !!x.id && s.questions.some((o) => o.id === x.id);
              return (
                <li key={i} className="rounded-[8px] border border-[var(--w-border)] p-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-5 text-right text-[12px] tabular-nums text-[var(--w-text-3)]">{i + 1}.</span>
                    <label className="sr-only" htmlFor={`svk-${i}`}>{wt('elic.qType')}</label>
                    <select id={`svk-${i}`} className="w-input h-7 w-[150px] text-[12.5px]" disabled={ro || locked} value={x.kind} onChange={(e) => edit(i, { kind: e.target.value as QuestionKind })}>{QUESTION_KINDS.map((k) => <option key={k} value={k}>{wt(KIND_KEY[k])}</option>)}</select>
                    <label className="flex items-center gap-1 text-[12px]"><input type="checkbox" disabled={ro} checked={!!x.required} onChange={(e) => edit(i, { required: e.target.checked })} /> {wt('elic.required')}</label>
                    {!ro && !locked && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm ml-auto" aria-label={`${wt('common.remove')} ${i + 1}`} onClick={() => { setDraft(draft.filter((_, k) => k !== i)); setDirty(true); }}><X size={13} /></button>}
                  </div>
                  <label className="sr-only" htmlFor={`svt-${i}`}>{wt('elic.question')} {i + 1}</label>
                  <input id={`svt-${i}`} className="w-input mt-1.5 h-8" readOnly={ro} value={x.text} maxLength={500} placeholder={wt('elic.question')} onChange={(e) => edit(i, { text: e.target.value })} />
                  {(x.kind === 'SINGLE' || x.kind === 'MULTI') && (
                    <><label className="sr-only" htmlFor={`svo-${i}`}>{wt('elic.options')}</label>
                    <textarea id={`svo-${i}`} className="w-input mt-1.5 min-h-[56px] py-1 text-[12.5px]" rows={3} readOnly={ro} placeholder={wt('elic.optionsPh')} value={x.optionsText ?? ''} onChange={(e) => edit(i, { optionsText: e.target.value })} /></>
                  )}
                  {x.kind === 'SCALE' && (
                    <label className="mt-1.5 flex items-center gap-2 text-[12.5px]">{wt('elic.scaleMax')}<input className="w-input h-7 w-16" type="number" min={3} max={10} readOnly={ro || locked} value={x.scaleMax ?? 5} onChange={(e) => edit(i, { scaleMax: Number(e.target.value) || 5 })} /></label>
                  )}
                </li>
              );
            })}
          </ol>
          {!ro && <button type="button" className="w-btn w-btn-sm self-start" onClick={() => { setDraft([...draft, { kind: 'SINGLE', text: '', optionsText: '', required: false }]); setDirty(true); }}><Plus size={13} /> {wt('elic.addQuestion')}</button>}
          {!ro && <button type="button" className="w-btn w-btn-sm w-btn-primary self-start" disabled={!dirty || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} {wt('common.save')}</button>}
        </Section>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="flex-1 text-[13.5px] font-semibold">{wt('elic.results', { count: s.responses })}</h3>
          <button type="button" className="w-btn w-btn-sm" disabled={!s.responses} onClick={() => downloadFile(() => workSwr6bApi.exportSurvey(pid, n))}><FileSpreadsheet size={13} /> .xlsx</button>
        </div>
        {!s.responses ? <p className="text-[12.5px] text-[var(--w-text-3)]">{s.status === 'OPEN' ? wt('elic.waiting') : wt('elic.noResponses')}</p> : s.summary.map((x, i) => (
          <div key={x.id} className="rounded-[8px] border border-[var(--w-border)] p-2.5">
            <p className="text-[13px] font-medium">{i + 1}. {x.text} <span className="font-normal text-[var(--w-text-3)]">({wt('elic.answeredN', { count: x.answered })})</span></p>
            {x.counts && <Bars rows={x.counts.map((c) => ({ label: c.option, n: c.n, pct: c.pct }))} />}
            {x.distribution && <><p className="mt-1 text-[12.5px] text-[var(--w-text-2)]">{wt('elic.average', { v: x.average ?? '—', max: x.distribution.length })}</p><Bars rows={x.distribution.map((c, k) => ({ label: String(k + 1), n: c, pct: x.answered ? Math.round((c / x.answered) * 1000) / 10 : 0 }))} /></>}
            {x.yes !== undefined && <Bars rows={[{ label: wt('common.yes'), n: x.yes, pct: x.answered ? Math.round((x.yes / x.answered) * 1000) / 10 : 0 }, { label: wt('common.no'), n: x.no ?? 0, pct: x.answered ? Math.round(((x.no ?? 0) / x.answered) * 1000) / 10 : 0 }]} />}
            {x.texts && <ul className="mt-1 flex max-h-[180px] flex-col gap-1 overflow-y-auto">{x.texts.slice(0, 50).map((t, k) => <li key={k} className="rounded-[4px] bg-[var(--w-sunken)] px-2 py-1 text-[12.5px]">{t}</li>)}</ul>}
          </div>
        ))}
        {s.recent.length > 0 && <p className="text-[12px] text-[var(--w-text-3)]">{wt('elic.lastResponse', { at: fmtDateTime(s.recent[0].at) })}</p>}
      </div>
    </article>
  );
}

function Bars({ rows }: { rows: Array<{ label: string; n: number; pct: number }> }) {
  return (
    <ul className="mt-1.5 flex flex-col gap-1">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[minmax(80px,30%)_1fr_64px] items-center gap-2 text-[12.5px]">
          <span className="truncate" title={r.label}>{r.label}</span>
          <span className="h-2 overflow-hidden rounded-full bg-[var(--w-sunken)]" aria-hidden="true"><span className="block h-full rounded-full bg-[var(--w-accent)]" style={{ width: `${Math.min(100, r.pct)}%` }} /></span>
          <span className="text-right tabular-nums text-[var(--w-text-2)]">{r.n} · {r.pct}%</span>
        </li>
      ))}
    </ul>
  );
}
