'use client';

/**
 * CTW đợt 6b (R1) — Sổ phiên elicitation (Wiegers ch.7): phỏng vấn / workshop / khảo sát / quan sát / phân tích tài liệu /
 * prototype. Mỗi phiên: kế hoạch, câu hỏi soạn trước (+ câu trả lời), người tham gia + vai đóng, ghi chú/biên bản; nối cuộc
 * họp K-2 để ghi âm + phiên âm; AI rút ĐỀ XUẤT yêu cầu có bằng chứng từ transcript/câu trả lời/ghi chú ⇒ người nhận thì mới
 * thành thẻ REQUIREMENT (nguồn = phiên + stakeholder). Cuối tab: ma trận truy vết yêu cầu ↔ phiên ↔ stakeholder + báo cáo .docx.
 */

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Bot, Check, FileText, Mic, Plus, Quote, Sparkles, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { TECHNIQUES, workSwr6bApi, workSwr6bKeys, type SessionBody, type SessionDetail, type SessionStatus, type Technique } from '@/lib/work-swr6b-api';
import type { ReqType } from '@/lib/work-swr-api';
import { useWT, wt, type WKey } from '@/components/work/i18n';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '../ui';
import { Chip, downloadFile, fmtDay, LifecycleChip, Note, Section, TabIntro, TableFrame, TD, TextArea, TH, TYPE_KEY, use6bRefresh } from './shared';
import AiStakeholderPanel from '../c8c/AiStakeholderPanel';
import type { AiTurn } from '@/lib/work-c8c-api';

export const TECH_KEY: Record<Technique, WKey> = {
  INTERVIEW: 'elic.tInterview', WORKSHOP: 'elic.tWorkshop', SURVEY: 'elic.tSurvey', OBSERVATION: 'elic.tObservation', DOCUMENT_ANALYSIS: 'elic.tDocument', PROTOTYPE: 'elic.tPrototype',
};
const STATUS_KEY: Record<SessionStatus, WKey> = { PLANNED: 'elic.sPlanned', DONE: 'elic.sDone', CANCELLED: 'elic.sCancelled' };

export default function ElicitationTab({ pid, base, onOpenIssue }: { pid: number; base: string; onOpenIssue: (n: number) => void }) {
  const { intl } = useWT();
  const refresh = use6bRefresh(pid);
  const q = useQuery({ queryKey: workSwr6bKeys.sessions(pid), queryFn: () => workSwr6bApi.sessions(pid) });
  const [open, setOpen] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [nf, setNf] = useState({ title: '', technique: 'INTERVIEW' as Technique, scheduledAt: '', durationMin: '60', suggest: true });
  const create = useMutation({
    mutationFn: () => workSwr6bApi.createSession(pid, { title: nf.title.trim(), technique: nf.technique, scheduledAt: nf.scheduledAt ? new Date(nf.scheduledAt).toISOString() : null, durationMin: Number(nf.durationMin) || null, suggestQuestions: nf.suggest }),
    onSuccess: (s) => { refresh(); setCreating(false); setOpen(s.number); setNf({ title: '', technique: 'INTERVIEW', scheduledAt: '', durationMin: '60', suggest: true }); toast.success(wt('elic.sessionCreated', { key: s.key })); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });

  if (q.isLoading) return <PageLoading rows={5} />;
  if (!q.data) return <EmptyState title={wt('swr.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const data = q.data;
  // Mặc định mở phiên đang có đề xuất chờ duyệt (việc cần người làm), không thì phiên mới nhất.
  const current = open ?? data.sessions.find((s) => s.pending > 0)?.number ?? data.sessions[0]?.number ?? null;
  return (
    <div className="flex flex-col gap-5">
      <TabIntro text={wt('elic.sessIntro')}>
        <button type="button" className="w-btn w-btn-sm" onClick={() => downloadFile(() => workSwr6bApi.exportReport(pid, 'docx'))}><FileText size={13} /> {wt('elic.report')} .docx</button>
        <button type="button" className="w-btn w-btn-sm" onClick={() => downloadFile(() => workSwr6bApi.exportReport(pid, 'pdf'))}>PDF</button>
        {data.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setCreating(true)}><Plus size={14} /> {wt('elic.newSession')}</button>}
      </TabIntro>
      {!data.sessions.length ? <EmptyState title={wt('elic.noSessions')} body={wt('elic.noSessionsBody')} /> : (
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <nav aria-label={wt('elic.sessions')} className="flex flex-col gap-1.5">
            {data.sessions.map((s) => (
              <button key={s.number} type="button" onClick={() => setOpen(s.number)} aria-current={current === s.number ? 'true' : undefined}
                className={cn('rounded-[8px] border px-3 py-2 text-left transition-colors', current === s.number ? 'border-[var(--w-accent)] bg-[var(--w-panel)]' : 'border-[var(--w-border)] bg-[var(--w-panel)] hover:bg-[var(--w-hover)]')}>
                <span className="flex items-center gap-2 text-[12px] text-[var(--w-text-2)]">
                  <span className="font-mono">{s.key}</span><span>{wt(TECH_KEY[s.technique])}</span><span className="ml-auto">{fmtDay(s.scheduledAt, intl)}</span>
                </span>
                <span className="mt-0.5 block truncate text-[13.5px] font-medium">{s.title}</span>
                <span className="mt-1 flex flex-wrap items-center gap-1.5">
                  <Chip tone={s.status === 'DONE' ? 'green' : s.status === 'CANCELLED' ? 'muted' : 'blue'}>{wt(STATUS_KEY[s.status])}</Chip>
                  {s.aiSimulated && <Chip tone="accent">{wt('elic.aiSim')}</Chip>}
                  <span className="text-[12px] text-[var(--w-text-2)]">{wt('elic.rowStats', { a: s.answered, q: s.questions, r: s.requirements })}</span>
                  {s.pending > 0 && <Chip tone="yellow">{wt('elic.pendingN', { count: s.pending })}</Chip>}
                </span>
              </button>
            ))}
          </nav>
          {current && <SessionPanel key={current} pid={pid} n={current} base={base} onOpenIssue={onOpenIssue} onDeleted={() => setOpen(null)} />}
        </div>
      )}
      <TraceMatrix pid={pid} onOpenIssue={onOpenIssue} />
      <Dialog open={creating} onClose={() => setCreating(false)} title={wt('elic.newSession')} width={520}
        footer={<><button type="button" className="w-btn" onClick={() => setCreating(false)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={!nf.title.trim() || create.isPending} onClick={() => create.mutate()}>{create.isPending && <Spinner size={12} />} {wt('common.create')}</button></>}>
        <Field label={wt('elic.fTitle')}><input className="w-input" autoFocus value={nf.title} maxLength={200} placeholder={wt('elic.fTitlePh')} onChange={(e) => setNf({ ...nf, title: e.target.value })} /></Field>
        <Field label={wt('elic.fTechnique')}>
          <select className="w-input" value={nf.technique} onChange={(e) => setNf({ ...nf, technique: e.target.value as Technique })}>{TECHNIQUES.map((t) => <option key={t} value={t}>{wt(TECH_KEY[t])}</option>)}</select>
        </Field>
        <div className="grid gap-x-3 sm:grid-cols-2">
          <Field label={wt('elic.fWhen')}><input className="w-input" type="datetime-local" value={nf.scheduledAt} onChange={(e) => setNf({ ...nf, scheduledAt: e.target.value })} /></Field>
          <Field label={wt('elic.fDuration')}><input className="w-input" type="number" min={5} max={1440} value={nf.durationMin} onChange={(e) => setNf({ ...nf, durationMin: e.target.value })} /></Field>
        </div>
        <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={nf.suggest} onChange={(e) => setNf({ ...nf, suggest: e.target.checked })} /> {wt('elic.fSuggest')}</label>
      </Dialog>
    </div>
  );
}

const toLocalInput = (iso: string | null) => (iso ? new Date(new Date(iso).getTime() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 16) : '');

function SessionPanel({ pid, n, base, onOpenIssue, onDeleted }: { pid: number; n: number; base: string; onOpenIssue: (n: number) => void; onDeleted: () => void }) {
  const { locale } = useWT();
  const refresh = use6bRefresh(pid);
  const q = useQuery({ queryKey: workSwr6bKeys.session(pid, n), queryFn: () => workSwr6bApi.session(pid, n) });
  const sh = useQuery({ queryKey: workSwr6bKeys.stakeholders(pid), queryFn: () => workSwr6bApi.stakeholders(pid) });
  const [f, setF] = useState<SessionDetail | null>(null);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (q.data && !dirty) setF(q.data); }, [q.data, dirty]);
  const upd = (patch: Partial<SessionDetail>) => { setF((x) => (x ? { ...x, ...patch } : x)); setDirty(true); };
  const save = useMutation({
    mutationFn: () => {
      const body: SessionBody = {
        title: f!.title, technique: f!.technique, status: f!.status, scheduledAt: f!.scheduledAt, durationMin: f!.durationMin, location: f!.location, objective: f!.objective,
        plan: f!.plan, notes: f!.notes, outcome: f!.outcome, aiSimulated: f!.aiSimulated, questions: f!.questions.map((x) => ({ id: x.id, text: x.text, answer: x.answer })),
        participants: f!.participants.map((p) => ({ stakeholder: p.key, rolePlayed: p.rolePlayed })), rev: f!.rev,
      };
      return workSwr6bApi.updateSession(pid, n, body);
    },
    onSuccess: (s) => { setDirty(false); setF(s); refresh(); toast.success(wt('common.saved')); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  const meeting = useMutation({ mutationFn: () => workSwr6bApi.linkMeeting(pid, n, { create: true }), onSuccess: () => { refresh(); toast.success(wt('elic.meetingCreated')); }, onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))) });
  const propose = useMutation({
    mutationFn: () => workSwr6bApi.propose(pid, n, locale),
    onSuccess: (r) => { refresh(); toast.success(wt('elic.proposed', { count: r.added, dropped: r.dropped })); },
    onError: (e) => toast.error(workError(e, wt('elic.proposeFailed'))),
  });
  const decide = useMutation({
    mutationFn: (x: { id: number; accept: boolean; approve?: boolean }) => workSwr6bApi.decide(pid, n, x.id, { accept: x.accept, approve: x.approve }),
    onSuccess: (r) => { refresh(); toast.success(r.issue ? wt('elic.accepted', { key: r.issue.key }) : wt('elic.dismissed')); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  const del = useMutation({ mutationFn: () => workSwr6bApi.deleteSession(pid, n), onSuccess: () => { refresh(); onDeleted(); toast.success(wt('swr.deleted')); }, onError: (e) => toast.error(workError(e, wt('common.couldNotDelete'))) });
  const [newQ, setNewQ] = useState('');
  const [addSh, setAddSh] = useState('');
  const pending = useMemo(() => (q.data?.proposals ?? []).filter((p) => p.status === 'PENDING'), [q.data]);

  if (q.isLoading || !f) return <PageLoading rows={6} />;
  if (!q.data) return <EmptyState title={wt('swr.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const d = q.data;
  const ro = !d.canEdit;
  const unused = (sh.data?.stakeholders ?? []).filter((s) => !f.participants.some((p) => p.key === s.key));
  return (
    <article aria-labelledby="elc-h" className="flex flex-col gap-4 rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4">
      <header className="flex flex-wrap items-start gap-2">
        <div className="min-w-[240px] flex-1">
          <p className="font-mono text-[12px] text-[var(--w-text-2)]">{d.key} · {wt(TECH_KEY[d.technique])}</p>
          <h2 id="elc-h" className="sr-only">{f.title}</h2>
          <label className="sr-only" htmlFor="elc-title">{wt('elic.fTitle')}</label>
          <input id="elc-title" className="w-input-bare w-full text-[17px] font-semibold" value={f.title} readOnly={ro} onChange={(e) => upd({ title: e.target.value })} />
          <p className="mt-1 text-[12px] text-[var(--w-text-3)]">{wt('elic.sourceAs', { text: d.sourceText })}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!ro && <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={!dirty || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} {wt('common.save')}</button>}
          {!ro && <button type="button" className="w-btn w-btn-sm w-btn-ghost w-btn-icon" aria-label={wt('common.delete')} title={wt('common.delete')} onClick={() => window.confirm(wt('swr.deleteQ', { name: d.key })) && del.mutate()}><Trash2 size={14} /></button>}
        </div>
      </header>

      <div className="grid gap-x-3 sm:grid-cols-2 xl:grid-cols-4">
        <Field label={wt('elic.fTechnique')}><select className="w-input" disabled={ro} value={f.technique} onChange={(e) => upd({ technique: e.target.value as Technique })}>{TECHNIQUES.map((t) => <option key={t} value={t}>{wt(TECH_KEY[t])}</option>)}</select></Field>
        <Field label={wt('elic.fStatus')}><select className="w-input" disabled={ro} value={f.status} onChange={(e) => upd({ status: e.target.value as SessionStatus })}>{(['PLANNED', 'DONE', 'CANCELLED'] as const).map((s) => <option key={s} value={s}>{wt(STATUS_KEY[s])}</option>)}</select></Field>
        <Field label={wt('elic.fWhen')}><input className="w-input" type="datetime-local" readOnly={ro} value={toLocalInput(f.scheduledAt)} onChange={(e) => upd({ scheduledAt: e.target.value ? new Date(e.target.value).toISOString() : null })} /></Field>
        <Field label={wt('elic.fLocation')}><input className="w-input" readOnly={ro} value={f.location ?? ''} maxLength={200} onChange={(e) => upd({ location: e.target.value })} /></Field>
      </div>
      <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" disabled={ro} checked={f.aiSimulated} onChange={(e) => upd({ aiSimulated: e.target.checked })} /> {wt('elic.fAiSim')}</label>

      <Section id="elc-plan" title={wt('elic.plan')}>
        <div className="grid gap-x-3 md:grid-cols-2">
          <TextArea id="elc-obj" label={wt('elic.fObjective')} value={f.objective ?? ''} rows={3} readOnly={ro} onChange={(v) => upd({ objective: v })} />
          <TextArea id="elc-plan-t" label={wt('elic.fPlan')} value={f.plan ?? ''} rows={3} readOnly={ro} onChange={(v) => upd({ plan: v })} placeholder={wt('elic.fPlanPh')} />
        </div>
      </Section>

      <Section id="elc-people" title={wt('elic.participants')}>
        {!f.participants.length && <p className="text-[12.5px] text-[var(--w-text-3)]">{wt('elic.noParticipants')}</p>}
        <ul className="flex flex-col gap-1.5">
          {f.participants.map((p, i) => (
            <li key={p.key} className="flex flex-wrap items-center gap-2 text-[13px]">
              <span className="font-mono text-[12px] text-[var(--w-text-2)]">{p.key}</span><span className="font-medium">{p.name}</span>{p.role && <span className="text-[var(--w-text-2)]">· {p.role}</span>}
              <label className="sr-only" htmlFor={`rp-${p.key}`}>{wt('elic.rolePlayed')}</label>
              <input id={`rp-${p.key}`} className="w-input h-7 max-w-[240px] text-[12.5px]" readOnly={ro} placeholder={wt('elic.rolePlayed')} value={p.rolePlayed ?? ''} onChange={(e) => upd({ participants: f.participants.map((x, k) => (k === i ? { ...x, rolePlayed: e.target.value } : x)) })} />
              {!ro && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${wt('common.remove')} ${p.name}`} onClick={() => upd({ participants: f.participants.filter((_, k) => k !== i) })}><X size={13} /></button>}
            </li>
          ))}
        </ul>
        {!ro && unused.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="elc-add-sh">{wt('elic.addParticipant')}</label>
            <select id="elc-add-sh" className="w-input h-8 max-w-[280px]" value={addSh} onChange={(e) => setAddSh(e.target.value)}>
              <option value="">{wt('elic.addParticipant')}…</option>{unused.map((s) => <option key={s.key} value={s.key}>{s.key} {s.name}</option>)}
            </select>
            <button type="button" className="w-btn w-btn-sm" disabled={!addSh} onClick={() => { const s = unused.find((x) => x.key === addSh)!; upd({ participants: [...f.participants, { stakeholderId: s.id, key: s.key, name: s.name, role: s.role, rolePlayed: s.role, userId: s.userId }] }); setAddSh(''); }}><Plus size={13} /> {wt('common.add')}</button>
          </div>
        )}
      </Section>

      <Section id="elc-q" title={wt('elic.questions')} actions={!ro && d.questionBank.length > 0 ? <button type="button" className="w-btn w-btn-sm w-btn-ghost" onClick={() => upd({ questions: [...f.questions, ...d.questionBank.filter((t) => !f.questions.some((x) => x.text === t)).map((text) => ({ id: '', text, answer: null }))] })}><Sparkles size={13} /> {wt('elic.addSuggested')}</button> : undefined}>
        <ol className="flex flex-col gap-2">
          {f.questions.map((x, i) => (
            <li key={`${x.id}-${i}`} className="rounded-[8px] border border-[var(--w-border)] p-2">
              <div className="flex items-start gap-2">
                <span className="mt-1.5 w-6 shrink-0 text-right text-[12px] tabular-nums text-[var(--w-text-3)]">{i + 1}.</span>
                <label className="sr-only" htmlFor={`q-${i}`}>{wt('elic.question')} {i + 1}</label>
                <input id={`q-${i}`} className="w-input-bare flex-1 text-[13px] font-medium" readOnly={ro} value={x.text} onChange={(e) => upd({ questions: f.questions.map((y, k) => (k === i ? { ...y, text: e.target.value } : y)) })} />
                {!ro && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${wt('common.remove')} ${i + 1}`} onClick={() => upd({ questions: f.questions.filter((_, k) => k !== i) })}><X size={13} /></button>}
              </div>
              <label className="sr-only" htmlFor={`a-${i}`}>{wt('elic.answer')} {i + 1}</label>
              <textarea id={`a-${i}`} className="w-input mt-1 min-h-[44px] py-1.5 text-[13px]" rows={2} readOnly={ro} placeholder={wt('elic.answerPh')} value={x.answer ?? ''} onChange={(e) => upd({ questions: f.questions.map((y, k) => (k === i ? { ...y, answer: e.target.value } : y)) })} />
            </li>
          ))}
        </ol>
        {!ro && (
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (newQ.trim()) { upd({ questions: [...f.questions, { id: '', text: newQ.trim(), answer: null }] }); setNewQ(''); } }}>
            <label className="sr-only" htmlFor="elc-newq">{wt('elic.addQuestion')}</label>
            <input id="elc-newq" className="w-input h-8" value={newQ} maxLength={1000} placeholder={wt('elic.addQuestion')} onChange={(e) => setNewQ(e.target.value)} />
            <button type="submit" className="w-btn w-btn-sm" disabled={!newQ.trim()} aria-label={wt('elic.addQuestion')} title={wt('elic.addQuestion')}><Plus size={13} /></button>
          </form>
        )}
      </Section>

      <Section id="elc-notes" title={wt('elic.notesOutcome')}>
        <div className="grid gap-x-3 md:grid-cols-2">
          <TextArea id="elc-notes-t" label={wt('elic.fNotesMinutes')} value={f.notes ?? ''} rows={6} readOnly={ro} onChange={(v) => upd({ notes: v })} />
          <TextArea id="elc-out" label={wt('elic.fOutcome')} value={f.outcome ?? ''} rows={6} readOnly={ro} onChange={(v) => upd({ outcome: v })} />
        </div>
      </Section>

      <Section id="elc-rec" title={wt('elic.recording')}>
        {d.meeting ? (
          <p className="flex flex-wrap items-center gap-2 text-[13px]">
            <Mic size={14} aria-hidden="true" className="text-[var(--w-text-2)]" />
            <Link className="font-medium text-[var(--w-accent-text)] hover:underline" href={`${base}/meetings/${d.meeting.number}`}>{wt('elic.meetingLink', { n: d.meeting.number, title: d.meeting.title })}</Link>
            <span className="text-[var(--w-text-2)]">{wt('elic.recordingsN', { count: d.meeting.recordings })}</span>
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <p className="flex-1 text-[12.5px] text-[var(--w-text-2)]">{wt('elic.noMeeting')}</p>
            {!ro && <button type="button" className="w-btn w-btn-sm" disabled={meeting.isPending} onClick={() => meeting.mutate()}><Mic size={13} /> {wt('elic.createMeeting')}</button>}
          </div>
        )}
        {d.survey && <p className="text-[12.5px] text-[var(--w-text-2)]">{wt('elic.linkedSurvey', { key: d.survey.key, title: d.survey.title, count: d.survey.responses })}</p>}
      </Section>

      {/* CTW đợt 8c (R28): phỏng vấn stakeholder do AI đóng vai — transcript là nguồn cho "Extract requirements" ngay dưới. */}
      <AiStakeholderPanel
        pid={pid} elc={d.key} readOnly={ro} onChanged={refresh}
        stakeholders={(sh.data?.stakeholders ?? []).map((x) => ({ key: x.key, name: x.name, role: x.role }))}
        initial={(d as unknown as { aiTranscript?: AiTurn[] }).aiTranscript ?? []}
        persona={(d as unknown as { aiPersona?: { key: string; name: string; role: string | null } | null }).aiPersona ?? null}
      />
      <Section id="elc-ai" title={wt('elic.proposals')} actions={!ro ? <button type="button" className="w-btn w-btn-sm" disabled={propose.isPending || dirty} title={dirty ? wt('elic.saveFirst') : undefined} onClick={() => propose.mutate()}>{propose.isPending ? <Spinner size={12} /> : <Bot size={13} />} {wt('elic.extract')}</button> : undefined}>
        <p className="text-[12.5px] text-[var(--w-text-2)]">{wt('elic.proposalsIntro')}</p>
        {!d.proposals.length ? <p className="text-[12.5px] text-[var(--w-text-3)]">{wt('elic.noProposals')}</p> : (
          <ul className="flex flex-col gap-2">
            {d.proposals.map((p) => (
              <li key={p.id} className={cn('rounded-[8px] border border-[var(--w-border)] p-2.5', p.status !== 'PENDING' && 'opacity-70')}>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Chip tone="accent">{wt(TYPE_KEY[p.reqType as ReqType] ?? 'swr.tFunctional')}</Chip>
                  {p.priority && <Chip tone="orange">{p.priority}</Chip>}
                  {p.stakeholder && <span className="text-[12px] text-[var(--w-text-2)]">{p.stakeholder.key} {p.stakeholder.name}</span>}
                  <span className="ml-auto text-[12px]">{p.status === 'ACCEPTED' ? <Chip tone="green">{p.issue ?? wt('elic.stAccepted')}</Chip> : p.status === 'DISMISSED' ? <Chip tone="muted">{wt('elic.stDismissed')}</Chip> : <Chip tone="yellow">{wt('elic.stPending')}</Chip>}</span>
                </div>
                <p className="mt-1 text-[13.5px] font-medium">{p.title}</p>
                {p.text && <p className="text-[12.5px] text-[var(--w-text-2)]">{p.text}</p>}
                {p.evidence.length > 0 && (
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {p.evidence.map((e, k) => <li key={k} className="flex gap-1.5 text-[12px] text-[var(--w-text-2)]"><Quote size={12} className="mt-0.5 shrink-0" aria-hidden="true" /><span>“{e.quote}” <span className="text-[var(--w-text-3)]">— {wt('elic.line', { n: e.line })}</span></span></li>)}
                  </ul>
                )}
                {p.status === 'PENDING' && d.canEdit && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={decide.isPending} onClick={() => decide.mutate({ id: p.id, accept: true })}><Check size={13} /> {wt('elic.accept')}</button>
                    {d.canApprove && <button type="button" className="w-btn w-btn-sm" disabled={decide.isPending} onClick={() => decide.mutate({ id: p.id, accept: true, approve: true })}>{wt('elic.acceptApprove')}</button>}
                    <button type="button" className="w-btn w-btn-sm w-btn-ghost" disabled={decide.isPending} onClick={() => decide.mutate({ id: p.id, accept: false })}>{wt('elic.dismiss')}</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        {pending.length > 0 && <Note>{wt('elic.pendingHint', { count: pending.length })}</Note>}
      </Section>

      <Section id="elc-reqs" title={wt('elic.reqsFrom')}>
        {!d.requirements.length ? <p className="text-[12.5px] text-[var(--w-text-3)]">{wt('elic.noReqs')}</p> : (
          <ul className="flex flex-col gap-1">
            {d.requirements.map((r) => (
              <li key={r.originId} className="flex flex-wrap items-center gap-2 text-[13px]">
                <button type="button" className="font-mono text-[12px] text-[var(--w-accent-text)] hover:underline" onClick={() => onOpenIssue(r.number)}>{r.key}</button>
                <span className="flex-1">{r.title}</span><LifecycleChip lc={r.lifecycle} />{r.stakeholder && <span className="text-[12px] text-[var(--w-text-2)]">{r.stakeholder.name}</span>}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </article>
  );
}

function TraceMatrix({ pid, onOpenIssue }: { pid: number; onOpenIssue: (n: number) => void }) {
  const q = useQuery({ queryKey: workSwr6bKeys.trace(pid), queryFn: () => workSwr6bApi.trace(pid) });
  const [onlyMissing, setOnlyMissing] = useState(false);
  if (!q.data) return null;
  const rows = q.data.rows.filter((r) => !onlyMissing || !r.origins.length);
  return (
    <Section id="trace-h" title={wt('elic.traceTitle', { traced: q.data.counts.traced, total: q.data.counts.requirements })}
      actions={<label className="flex items-center gap-1.5 text-[12.5px]"><input type="checkbox" checked={onlyMissing} onChange={(e) => setOnlyMissing(e.target.checked)} /> {wt('elic.onlyMissing')}</label>}>
      {!rows.length ? <p className="text-[12.5px] text-[var(--w-text-3)]">{onlyMissing ? wt('elic.allTraced') : wt('elic.noReqsYet')}</p> : (
        <TableFrame label={wt('elic.traceAria')} maxH="420px">
          <table className="w-full min-w-[720px] border-separate border-spacing-0">
            <thead><tr>{[wt('elic.hRequirement'), wt('elic.hStatus'), wt('elic.hSessions'), wt('elic.hStakeholders'), wt('elic.hSourceText')].map((h) => <th key={h} scope="col" className={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="hover:bg-[var(--w-hover)]">
                  <td className={TD}><button type="button" className="mr-1.5 font-mono text-[12px] text-[var(--w-accent-text)] hover:underline" onClick={() => onOpenIssue(r.issueNumber)}>{r.key}</button>{r.title}</td>
                  <td className={TD}><LifecycleChip lc={r.lifecycle} /></td>
                  <td className={`${TD} whitespace-nowrap`}>{[...new Set(r.origins.map((o) => o.session?.key).filter(Boolean))].join(', ') || <span className="text-[var(--w-orange-text)]">{wt('elic.noSource')}</span>}</td>
                  <td className={TD}>{[...new Set(r.origins.map((o) => o.stakeholder?.name).filter(Boolean))].join(', ') || '—'}</td>
                  <td className={`${TD} max-w-[320px] text-[12px] text-[var(--w-text-2)]`}>{r.source ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
    </Section>
  );
}
