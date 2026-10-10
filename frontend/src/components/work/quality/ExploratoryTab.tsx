'use client';

/**
 * CT Work đợt 6 — KIỂM THỬ THĂM DÒ theo phiên (SBTM): charter "Explore … with … to discover …", hộp thời gian, đồng hồ,
 * ghi chú theo mốc phút (ghi chú / lỗi / câu hỏi / ý tưởng / rủi ro), ghi chú loại Lỗi ⇒ thẻ Bug ngay, tóm tắt phiên.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Compass, Play, Plus, Square } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { q6Api, q6Keys, SEVERITIES, type Exploratory, type ExploreNote, type Severity } from '@/lib/work-q6-api';
import { Dialog, EmptyState, PageLoading } from '../ui';
import { useWT, type WKey } from '../i18n';
import { Badge, Card, Labeled, NumberInput, Segmented, type Tone } from './qui';

const KIND_TONE: Record<ExploreNote['kind'], Tone> = { NOTE: 'muted', BUG: 'red', QUESTION: 'blue', IDEA: 'accent', RISK: 'orange' };
const ST_TONE: Record<Exploratory['status'], Tone> = { PLANNED: 'muted', RUNNING: 'accent', DONE: 'green' };

export default function ExploratoryTab({ config, pid, onOpenIssue }: { config: ProjectConfig; pid: number; onOpenIssue: (n: number) => void }) {
  const { t } = useWT();
  const key = [...q6Keys.tests(pid), 'explore'];
  const q = useQuery({ queryKey: key, queryFn: () => q6Api.exploratory(pid) });
  const [sel, setSel] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const canEdit = config.permissions.editIssues;
  useEffect(() => { if (sel === null && q.data?.length) setSel(q.data[0].number); }, [q.data, sel]);
  if (q.isLoading) return <PageLoading />;
  if (q.error) return <EmptyState title={t('q6.loadFailed')} body={workError(q.error)} />;
  const rows = q.data ?? [];
  const cur = rows.find((r) => r.number === sel) ?? null;
  return (
    <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-[280px_minmax(0,1fr)]" data-testid="q6-explore-tab">
      <aside className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-semibold">{t('q6.exploreTitle')}</h2>
          {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => setOpen(true)} data-testid="q6-new-session"><Plus size={13} /> {t('q6.newSession')}</button>}
        </div>
        <ul className="flex flex-col gap-1">
          {rows.map((s) => (
            <li key={s.number}>
              <button type="button" onClick={() => setSel(s.number)} aria-current={sel === s.number ? 'true' : undefined}
                className={cn('w-full rounded-[6px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]', sel === s.number && 'bg-[var(--w-accent-soft)]')}>
                <div className="flex items-center gap-1.5"><span className="font-mono text-[11.5px] text-[var(--w-text-3)]">{s.key}</span><Badge tone={ST_TONE[s.status]}>{t(`q6.session${s.status}` as WKey)}</Badge></div>
                <div className="line-clamp-2 text-[12px] text-[var(--w-text-2)]">{s.charter}</div>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className="min-w-0">
        {!cur ? <EmptyState icon={<Compass size={20} />} title={t('q6.noSessions')} body={t('q6.noSessionsBody')} /> : <Session pid={pid} s={cur} canEdit={canEdit} onOpenIssue={onOpenIssue} />}
      </div>
      {open && <NewSession pid={pid} onClose={() => setOpen(false)} onCreated={(n) => { setOpen(false); setSel(n); }} />}
    </div>
  );
}

function Session({ pid, s, canEdit, onOpenIssue }: { pid: number; s: Exploratory; canEdit: boolean; onOpenIssue: (n: number) => void }) {
  const { t, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const key = [...q6Keys.tests(pid), 'explore'];
  const put = (x: Exploratory) => qc.setQueryData<Exploratory[]>(key, (old) => (old ?? []).map((o) => (o.number === x.number ? x : o)));
  const err = (e: unknown) => toast.error(workError(e));
  const act = useMutation({ mutationFn: (a: 'start' | 'stop') => q6Api.exploreAction(pid, s.number, a), onSuccess: put, onError: err });
  const [text, setText] = useState('');
  const [kind, setKind] = useState<ExploreNote['kind']>('NOTE');
  const [sev, setSev] = useState<Severity>('MINOR');
  const note = useMutation({
    mutationFn: () => q6Api.exploreNote(pid, s.number, { kind, text: text.trim(), ...(kind === 'BUG' ? { logBug: true, severity: sev } : {}) }),
    onSuccess: (x) => { put(x); setText(''); const last = x.notes[x.notes.length - 1]; if (last?.bugKey) toast.success(t('q6.bugLogged', { k: last.bugKey })); },
    onError: err,
  });
  const [summary, setSummary] = useState(s.summary ?? '');
  useEffect(() => setSummary(s.summary ?? ''), [s.summary]);
  const saveSummary = useMutation({ mutationFn: () => q6Api.saveExploratory(pid, { number: s.number, summary }), onSuccess: put, onError: err });
  // Đồng hồ: tự cập nhật mỗi 30 s khi phiên đang chạy.
  const [, tick] = useState(0);
  useEffect(() => { if (s.status !== 'RUNNING') return; const h = setInterval(() => tick((n) => n + 1), 30_000); return () => clearInterval(h); }, [s.status]);
  const elapsed = s.startedAt ? Math.round(((s.endedAt ? new Date(s.endedAt) : new Date()).getTime() - new Date(s.startedAt).getTime()) / 60000) : 0;
  const kinds: ExploreNote['kind'][] = ['NOTE', 'BUG', 'QUESTION', 'IDEA', 'RISK'];
  return (
    <Card title={`${s.key} · ${s.area ?? t('q6.charter')}`} testId="q6-session"
      actions={<>
        <Badge tone={ST_TONE[s.status]}>{t(`q6.session${s.status}` as WKey)}</Badge>
        <span className={cn('text-[12.5px] tabular-nums', elapsed > s.timeboxMin && 'font-semibold text-[var(--w-red-text)]')} title={elapsed > s.timeboxMin ? t('q6.overTime') : undefined}>{t('q6.elapsed', { e: elapsed, t: s.timeboxMin })}</span>
        {canEdit && s.status === 'PLANNED' && <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => act.mutate('start')} data-testid="q6-start"><Play size={13} /> {t('q6.start')}</button>}
        {canEdit && s.status === 'RUNNING' && <button type="button" className="w-btn w-btn-sm" onClick={() => act.mutate('stop')} data-testid="q6-stop"><Square size={13} /> {t('q6.stop')}</button>}
      </>}>
      <p className="mb-3 whitespace-pre-wrap rounded-[6px] bg-[var(--w-hover)] px-3 py-2 text-[13px]"><span className="font-medium">{t('q6.charter')}:</span> {s.charter}</p>
      {canEdit && s.status === 'RUNNING' && (
        <div className="mb-3 flex flex-col gap-2">
          <Segmented label={t('q6.addNote')} value={kind} onChange={setKind} options={kinds.map((k) => ({ value: k, label: t(`q6.nk${k}` as WKey), tone: KIND_TONE[k] }))} testId="q6-note-kind" />
          <div className="flex flex-wrap items-start gap-2">
            <textarea className="w-input min-h-[44px] min-w-[260px] flex-1" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('q6.notePh')} aria-label={t('q6.addNote')} data-testid="q6-note-text"
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && text.trim()) note.mutate(); }} />
            {kind === 'BUG' && (
              <select className="w-input w-[140px]" aria-label={t('q6.severity')} value={sev} onChange={(e) => setSev(e.target.value as Severity)}>
                {SEVERITIES.map((x) => <option key={x} value={x}>{t(`q6.sev${x}` as WKey)}</option>)}
              </select>
            )}
            <button type="button" className="w-btn w-btn-sm" disabled={!text.trim() || note.isPending} onClick={() => note.mutate()} data-testid="q6-add-note">{t('q6.addNote')}</button>
          </div>
        </div>
      )}
      <ol className="flex flex-col gap-1.5" aria-label={t('q6.addNote')}>
        {s.notes.map((n) => (
          <li key={n.id} className="flex items-start gap-2 text-[13px]">
            <span className="w-14 shrink-0 text-right font-mono text-[11.5px] text-[var(--w-text-3)]" title={fmtDateTime(n.at)}>{n.offsetMin !== null ? t('q6.minAt', { n: n.offsetMin }) : ''}</span>
            <Badge tone={KIND_TONE[n.kind]}>{t(`q6.nk${n.kind}` as WKey)}</Badge>
            <span className="min-w-0 flex-1 whitespace-pre-wrap">{n.text}</span>
            {n.bugKey && n.bugNumber && <button type="button" className="font-mono text-[12px] hover:underline" onClick={() => onOpenIssue(n.bugNumber!)}>{n.bugKey}</button>}
          </li>
        ))}
      </ol>
      <Labeled label={t('q6.summary')} className="mt-3">
        <textarea className="w-input min-h-[56px]" disabled={!canEdit} value={summary} onChange={(e) => setSummary(e.target.value)} onBlur={() => summary !== (s.summary ?? '') && saveSummary.mutate()} />
      </Labeled>
    </Card>
  );
}

function NewSession({ pid, onClose, onCreated }: { pid: number; onClose: () => void; onCreated: (n: number) => void }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [charter, setCharter] = useState('');
  const [area, setArea] = useState('');
  const [box, setBox] = useState<number | null>(60);
  const m = useMutation({
    mutationFn: () => q6Api.saveExploratory(pid, { charter: charter.trim(), area: area.trim() || null, timeboxMin: box ?? 60 }),
    onSuccess: (s) => { qc.invalidateQueries({ queryKey: [...q6Keys.tests(pid), 'explore'] }); onCreated(s.number); },
    onError: (e) => toast.error(workError(e)),
  });
  return (
    <Dialog open onClose={onClose} title={t('q6.newSession')} width={540}
      footer={<><button type="button" className="w-btn w-btn-sm" onClick={onClose}>{t('common.cancel')}</button><button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!charter.trim() || m.isPending} onClick={() => m.mutate()} data-testid="q6-create-session">{t('q6.create')}</button></>}>
      <div className="flex flex-col gap-3">
        <Labeled label={t('q6.charter')}><textarea className="w-input min-h-[72px]" value={charter} onChange={(e) => setCharter(e.target.value)} placeholder={t('q6.charterPh')} autoFocus data-testid="q6-charter" /></Labeled>
        <div className="grid grid-cols-2 gap-3">
          <Labeled label={t('q6.area')}><input className="w-input" value={area} onChange={(e) => setArea(e.target.value)} /></Labeled>
          <Labeled label={t('q6.timebox')}><NumberInput label={t('q6.timebox')} value={box} min={5} max={480} onChange={setBox} /></Labeled>
        </div>
      </div>
    </Dialog>
  );
}
