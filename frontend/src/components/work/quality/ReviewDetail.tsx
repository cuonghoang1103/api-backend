'use client';

/**
 * CT Work đợt 6 — một phiên review/inspection: thanh trạng thái 5 hoạt động (IEEE 1028), thông tin + quyết định, thành phần
 * có vai + thời gian chuẩn bị, checklist chạy từng câu (OK / NG / N/A · dòng · ghi chú · mức), NG ⇒ "Ghi lỗi" vào sổ defect,
 * số đo (tốc độ, mật độ lỗi, hiệu suất), xuất biên bản .docx/.pdf.
 */

import { Fragment, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Bug, Download, ExternalLink, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import {
  q6Api, q6Keys, REVIEW_METHODS, REVIEW_ROLES, SEVERITIES, type ItemResult, type Review, type ReviewDecision, type ReviewMethod, type ReviewRole, type Severity,
} from '@/lib/work-q6-api';
import KpiTile, { KpiRow } from '../KpiTile';
import { EmptyState, PageLoading, UserAvatar } from '../ui';
import { useWT, type WKey } from '../i18n';
import { Badge, Card, Labeled, NumberInput, Segmented, Tbl, Td, Th } from './qui';
import { DECISION_TONE, STATUS_TONE } from './ReviewList';

export default function ReviewDetail({ config, pid, num, onBack, onOpenIssue }: { config: ProjectConfig; pid: number; num: number; onBack: () => void; onOpenIssue: (n: number) => void }) {
  const { t, locale } = useWT();
  const qc = useQueryClient();
  const key = q6Keys.review(pid, num);
  const q = useQuery({ queryKey: key, queryFn: () => q6Api.review(pid, num) });
  const set = (r: Review) => { qc.setQueryData(key, r); qc.invalidateQueries({ queryKey: q6Keys.reviews(pid) }); };
  const err = (e: unknown) => toast.error(workError(e));
  const patch = useMutation({ mutationFn: (b: Parameters<typeof q6Api.updateReview>[2]) => q6Api.updateReview(pid, num, b), onSuccess: set, onError: err });
  const move = useMutation({ mutationFn: (to: Review['status']) => q6Api.transition(pid, num, to), onSuccess: set, onError: err });
  const del = useMutation({ mutationFn: () => q6Api.deleteReview(pid, num), onSuccess: () => { toast.success(t('q6.deleted')); qc.invalidateQueries({ queryKey: q6Keys.reviews(pid) }); onBack(); }, onError: err });

  if (q.isLoading) return <PageLoading />;
  if (q.error || !q.data) return <EmptyState title={t('q6.loadFailed')} body={workError(q.error)} action={<button type="button" className="w-btn w-btn-sm" onClick={onBack}>{t('q6.back')}</button>} />;
  const r = q.data;
  const editable = r.canEdit && r.status !== 'CLOSED';
  const unit = t(r.sizeUnit === 'LOC' ? 'q6.sizeLOC' : 'q6.sizePAGE');

  return (
    <div className="flex flex-col gap-3" data-testid="q6-review-detail">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={onBack}><ArrowLeft size={14} /> {t('q6.back')}</button>
        <span className="font-mono text-[12px] text-[var(--w-text-3)]">{r.key}</span>
        <h2 className="min-w-0 truncate text-[16px] font-semibold">{r.title}</h2>
        <Badge tone={STATUS_TONE[r.status]}>{t(`q6.st${r.status}` as WKey)}</Badge>
        {r.decision && <Badge tone={DECISION_TONE[r.decision]}>{t(`q6.dec${r.decision}` as WKey)}</Badge>}
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <button type="button" className="w-btn w-btn-sm" onClick={() => q6Api.exportReview(pid, num, 'docx', locale).catch(err)} data-testid="q6-export-docx"><Download size={13} /> {t('q6.exportDocx')}</button>
          <button type="button" className="w-btn w-btn-sm" onClick={() => q6Api.exportReview(pid, num, 'pdf', locale).catch(err)}><Download size={13} /> {t('q6.exportPdf')}</button>
          {r.canEdit && <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" aria-label={t('q6.deleteReview')} title={t('q6.deleteReview')} onClick={() => window.confirm(t('q6.confirmDelete', { k: r.key })) && del.mutate()}><Trash2 size={14} /></button>}
        </div>
      </div>

      {/* Luồng 5 hoạt động review */}
      <div className="flex flex-wrap items-center gap-1 text-[12px]">
      <ol className="flex flex-wrap items-center gap-1" aria-label={t('q6.colStatus')}>
        {(['PLANNING', 'PREPARATION', 'MEETING', 'REWORK', 'FOLLOW_UP', 'CLOSED'] as const).map((s, i) => (
          <li key={s} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true" className="text-[var(--w-text-3)]">›</span>}
            <span aria-current={r.status === s ? 'step' : undefined} className={cn('rounded-[4px] px-1.5 py-[1px]', r.status === s ? 'bg-[var(--w-accent-soft)] font-semibold text-[var(--w-accent-text)]' : 'text-[var(--w-text-2)]')}>{t(`q6.st${s}` as WKey)}</span>
          </li>
        ))}
      </ol>
        {r.canEdit && r.next.map((s) => (
          <button key={s} type="button" className={cn('w-btn w-btn-sm ml-2', s === 'CLOSED' ? 'w-btn-primary' : '')} disabled={move.isPending} onClick={() => move.mutate(s)} data-testid={`q6-move-${s}`}>
            {t('q6.moveTo', { s: t(`q6.st${s}` as WKey) })}
          </button>
        ))}
      </div>
      {r.status === 'CLOSED' ? (
        <p className="text-[12.5px] text-[var(--w-text-2)]">{t('q6.closedNote')}</p>
      ) : r.closeBlockers.length > 0 && (
        <div className="rounded-[var(--w-radius)] border border-[var(--w-border)] bg-[var(--w-hover)] px-3 py-2 text-[12.5px]" role="status">
          <span className="font-medium">{t('q6.blockersTitle')}:</span>{' '}
          {r.closeBlockers.map((b) => t(`q6.block${b}` as WKey)).join(' · ')}
        </div>
      )}

      <Metrics r={r} unit={unit} />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <InfoCard r={r} editable={editable} canEdit={r.canEdit} onPatch={(b) => patch.mutate(b)} />
        <Participants config={config} pid={pid} num={num} r={r} editable={editable} onSaved={set} />
      </div>

      <Checklist pid={pid} num={num} r={r} editable={editable} onSaved={set} onOpenIssue={onOpenIssue} />
    </div>
  );
}

function Metrics({ r, unit }: { r: Review; unit: string }) {
  const { t, fmtNumber } = useWT();
  const m = r.metrics;
  const limit = r.sizeUnit === 'LOC' ? 200 : 4;
  return (
    <KpiRow min={170} label={t('q6.metrics')}>
      <KpiTile label={t('q6.mDefects')} value={fmtNumber(m.defects)} hint={t('q6.mMajor', { n: m.majorDefects })} tone={m.majorDefects ? 'orange' : 'muted'} />
      <KpiTile label={t('q6.mRate')} value={m.rate === null ? '—' : t('q6.mRateUnit', { n: fmtNumber(m.rate), u: unit })} hint={m.rateTooFast ? t('q6.mRateTooFast', { n: limit, u: unit }) : undefined} tone={m.rateTooFast ? 'red' : 'muted'} />
      <KpiTile label={t('q6.mDensity')} value={m.density === null ? '—' : fmtNumber(m.density)} hint={t(r.sizeUnit === 'LOC' ? 'q6.mDensityUnitLOC' : 'q6.mDensityUnitPAGE')} />
      <KpiTile label={t('q6.mEfficiency')} value={m.efficiency === null ? '—' : fmtNumber(m.efficiency)} hint={t('q6.mEfficiencyUnit')} />
      <KpiTile label={t('q6.mEffort')} value={`${fmtNumber(m.effortHours)} h`} hint={t('q6.mEffortHint', { p: m.prepHours, m: m.meetingHours, r: m.reworkHours })} />
      <KpiTile label={t('q6.mProgress')} value={`${m.checklistProgress}%`} tone={m.checklistProgress === 100 ? 'green' : 'muted'} />
    </KpiRow>
  );
}

function InfoCard({ r, editable, canEdit, onPatch }: { r: Review; editable: boolean; canEdit: boolean; onPatch: (b: Parameters<typeof q6Api.updateReview>[2]) => void }) {
  const { t, fmtDateTime } = useWT();
  const [notes, setNotes] = useState(r.notes ?? '');
  useEffect(() => setNotes(r.notes ?? ''), [r.notes]);
  const unit = t(r.sizeUnit === 'LOC' ? 'q6.sizeLOC' : 'q6.sizePAGE');
  return (
    <Card title={t('q6.details')}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Labeled label={t('q6.workProduct')}>
          <div className="text-[13px]">{r.page ? `Doc ${r.page.number}: ${r.page.title}` : r.workProduct ?? '—'}</div>
        </Labeled>
        <Labeled label={t('q6.checklist')} hint={r.checklistSource ?? undefined}><div className="text-[13px]">{r.checklistName}</div></Labeled>
        {r.prUrl && (
          <Labeled label={t('q6.prUrl')} className="sm:col-span-2">
            <a className="inline-flex items-center gap-1 text-[13px] text-[var(--w-accent-text)] hover:underline" href={r.prUrl} target="_blank" rel="noopener noreferrer">{r.prUrl} <ExternalLink size={12} /></a>
          </Labeled>
        )}
        <Labeled label={t('q6.reviewMethod')}>
          <select className="w-input" disabled={!editable} value={r.method} onChange={(e) => onPatch({ method: e.target.value as ReviewMethod })}>
            {REVIEW_METHODS.map((x) => <option key={x} value={x}>{t(`q6.method${x}` as WKey)}</option>)}
          </select>
        </Labeled>
        <Labeled label={`${t('q6.size')} (${unit})`}><NumberInput label={t('q6.size')} disabled={!editable} value={r.size} min={0} onChange={(v) => onPatch({ size: v })} /></Labeled>
        <Labeled label={t('q6.meetingAt')} hint={r.meetingAt ? fmtDateTime(r.meetingAt) : undefined}>
          <input className="w-input" type="datetime-local" disabled={!editable} value={r.meetingAt ? toLocalInput(r.meetingAt) : ''} onChange={(e) => onPatch({ meetingAt: e.target.value ? new Date(e.target.value).toISOString() : null })} />
        </Labeled>
        <div className="grid grid-cols-2 gap-2">
          <Labeled label={t('q6.meetingMinutes')}><NumberInput label={t('q6.meetingMinutes')} disabled={!editable} value={r.meetingMinutes} min={0} onChange={(v) => onPatch({ meetingMinutes: v })} /></Labeled>
          <Labeled label={t('q6.reworkMinutes')}><NumberInput label={t('q6.reworkMinutes')} disabled={!editable} value={r.reworkMinutes} min={0} onChange={(v) => onPatch({ reworkMinutes: v })} /></Labeled>
        </div>
        <Labeled label={t('q6.decision')} className="sm:col-span-2">
          <Segmented<ReviewDecision>
            label={t('q6.decision')} disabled={!editable} value={r.decision} onChange={(v) => onPatch({ decision: v })} testId="q6-decision"
            options={(['ACCEPT', 'ACCEPT_WITH_CHANGES', 'REINSPECT'] as const).map((d) => ({ value: d, label: t(`q6.dec${d}` as WKey), tone: DECISION_TONE[d] }))}
          />
        </Labeled>
        {(r.entryCriteria || r.exitCriteria) && (
          <>
            <Labeled label={t('q6.entryCriteria')}><div className="whitespace-pre-wrap text-[12.5px] text-[var(--w-text-2)]">{r.entryCriteria ?? '—'}</div></Labeled>
            <Labeled label={t('q6.exitCriteria')}><div className="whitespace-pre-wrap text-[12.5px] text-[var(--w-text-2)]">{r.exitCriteria ?? '—'}</div></Labeled>
          </>
        )}
        <Labeled label={t('q6.notes')} className="sm:col-span-2">
          <textarea className="w-input min-h-[64px]" disabled={!canEdit} value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => notes !== (r.notes ?? '') && onPatch({ notes })} />
        </Labeled>
      </div>
    </Card>
  );
}

const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

function Participants({ config, pid, num, r, editable, onSaved }: { config: ProjectConfig; pid: number; num: number; r: Review; editable: boolean; onSaved: (r: Review) => void }) {
  const { t } = useWT();
  type Row = { userId: number; role: ReviewRole; prepMinutes: number | null };
  const initial = useMemo<Row[]>(() => r.participants.map((p) => ({ userId: p.userId, role: p.role, prepMinutes: p.prepMinutes })), [r.participants]);
  const [rows, setRows] = useState<Row[]>(initial);
  useEffect(() => setRows(initial), [initial]);
  const dirty = JSON.stringify(rows) !== JSON.stringify(initial);
  const team = config.members.filter((m) => m.role !== 'CLIENT' && m.kind !== 'AGENT');
  const save = useMutation({ mutationFn: () => q6Api.participants(pid, num, rows), onSuccess: (x) => { onSaved(x); toast.success(t('q6.saved')); }, onError: (e) => toast.error(workError(e)) });
  const name = (id: number) => { const u = config.members.find((m) => m.id === id) ?? r.participants.find((p) => p.userId === id)?.user; return u ? userName(u) : `#${id}`; };
  return (
    <Card title={t('q6.participants')} desc={t('q6.participantsHint')}
      actions={editable && dirty ? <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={save.isPending || !rows.length} onClick={() => save.mutate()} data-testid="q6-save-participants">{t('q6.save')}</button> : undefined}>
      <ul className="flex flex-col gap-1.5">
        {rows.map((p, i) => {
          const u = config.members.find((m) => m.id === p.userId) ?? r.participants.find((x) => x.userId === p.userId)?.user ?? null;
          return (
            <li key={`${p.userId}-${i}`} className="flex flex-wrap items-center gap-2">
              <UserAvatar user={u} size={22} />
              <span className="min-w-[120px] flex-1 truncate text-[13px]">{name(p.userId)}</span>
              <select aria-label={t('q6.colType')} className="w-input w-[150px]" disabled={!editable} value={p.role} onChange={(e) => setRows(rows.map((x, k) => (k === i ? { ...x, role: e.target.value as ReviewRole } : x)))}>
                {REVIEW_ROLES.map((ro) => <option key={ro} value={ro}>{t(`q6.role${ro}` as WKey)}</option>)}
              </select>
              <NumberInput label={t('q6.prepMinutes')} placeholder={t('q6.prepMinutes')} className="w-[130px]" disabled={!editable} value={p.prepMinutes} min={0} onChange={(v) => setRows(rows.map((x, k) => (k === i ? { ...x, prepMinutes: v } : x)))} />
              {editable && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('q6.removeParticipant', { n: name(p.userId) })} onClick={() => setRows(rows.filter((_, k) => k !== i))}><X size={14} /></button>}
            </li>
          );
        })}
      </ul>
      {editable && (
        <div className="mt-2">
          <select className="w-input w-[260px]" value="" aria-label={t('q6.addParticipant')} onChange={(e) => e.target.value && setRows([...rows, { userId: Number(e.target.value), role: 'REVIEWER', prepMinutes: null }])}>
            <option value="">+ {t('q6.addParticipant')}</option>
            {team.map((m) => <option key={m.id} value={m.id}>{userName(m)}</option>)}
          </select>
        </div>
      )}
    </Card>
  );
}

function Checklist({ pid, num, r, editable, onSaved, onOpenIssue }: { pid: number; num: number; r: Review; editable: boolean; onSaved: (r: Review) => void; onOpenIssue: (n: number) => void }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const err = (e: unknown) => toast.error(workError(e));
  const save = useMutation({ mutationFn: (b: Parameters<typeof q6Api.saveItems>[2]) => q6Api.saveItems(pid, num, b), onSuccess: onSaved, onError: err });
  const log = useMutation({
    mutationFn: (itemId: number) => q6Api.logDefect(pid, num, itemId),
    onSuccess: (x) => { toast.success(x.created ? t('q6.defectLogged', { k: x.key }) : t('q6.defectExists', { k: x.key })); qc.invalidateQueries({ queryKey: q6Keys.review(pid, num) }); },
    onError: err,
  });
  const [sec, setSec] = useState('');
  const [ques, setQues] = useState('');
  const groups = useMemo(() => {
    const m = new Map<string, Review['items']>();
    for (const it of r.items) m.set(it.section, [...(m.get(it.section) ?? []), it]);
    return [...m.entries()];
  }, [r.items]);
  const resultTone = { OK: 'green', NG: 'red', NA: 'muted' } as const;
  return (
    <Card title={t('q6.checklistTitle')} desc={r.checklistSource ? t('q6.checklistSource', { s: r.checklistSource }) : undefined} testId="q6-checklist-card">
      <Tbl minWidth={980} label={t('q6.checklistTitle')}>
        <thead>
          <tr><Th w={40}>#</Th><Th>{t('q6.addItemQuestion')}</Th><Th w={150}>{t('q6.colStatus')}</Th><Th w={130}>{t('q6.line')}</Th><Th w={200}>{t('q6.note')}</Th><Th w={130}>{t('q6.severity')}</Th><Th w={130}>{t('q6.colDefects')}</Th></tr>
        </thead>
        <tbody>
          {groups.map(([section, items]) => (
            <Fragment key={section}>
              <tr><td colSpan={7} className="border-b border-[var(--w-border)] bg-[var(--w-hover)] px-2.5 py-1.5 text-[12px] font-semibold text-[var(--w-text-2)]">{section}</td></tr>
              {items.map((it) => (
                <tr key={it.id} data-testid={`q6-item-${it.position}`}>
                  <Td className="tabular-nums text-[var(--w-text-3)]">{it.position + 1}</Td>
                  <Td className="text-[12.5px] leading-snug">{it.question}</Td>
                  <Td>
                    <Segmented<ItemResult>
                      size="xs" label={it.question} disabled={!editable} value={it.result}
                      onChange={(v) => save.mutate({ items: [{ id: it.id, result: v, ...(v === 'NG' && !it.severity ? { severity: 'MINOR' as Severity } : {}) }] })}
                      options={(['OK', 'NG', 'NA'] as const).map((x) => ({ value: x, label: t(`q6.result${x}` as WKey), tone: resultTone[x] }))}
                    />
                  </Td>
                  <Td><CellInput disabled={!editable} value={it.line} label={t('q6.line')} onSave={(v) => save.mutate({ items: [{ id: it.id, line: v }] })} /></Td>
                  <Td><CellInput disabled={!editable} value={it.note} label={t('q6.note')} onSave={(v) => save.mutate({ items: [{ id: it.id, note: v }] })} /></Td>
                  <Td>
                    {it.result === 'NG' && (
                      <select aria-label={t('q6.severity')} className="w-input h-7 py-0 text-[12px]" disabled={!editable} value={it.severity ?? 'MINOR'} onChange={(e) => save.mutate({ items: [{ id: it.id, severity: e.target.value as Severity }] })}>
                        {SEVERITIES.map((s) => <option key={s} value={s}>{t(`q6.sev${s}` as WKey)}</option>)}
                      </select>
                    )}
                  </Td>
                  <Td>
                    {it.defect ? (
                      <button type="button" className={cn('inline-flex items-center gap-1 font-mono text-[12px] hover:underline', it.defect.done && 'line-through opacity-70')} onClick={() => onOpenIssue(it.defect!.number)}><Bug size={12} />{it.defect.key}</button>
                    ) : it.result === 'NG' && r.canEdit ? (
                      <button type="button" className="w-btn w-btn-sm" disabled={log.isPending} onClick={() => log.mutate(it.id)} data-testid={`q6-log-defect-${it.position}`}><Bug size={12} /> {t('q6.logDefect')}</button>
                    ) : null}
                  </Td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </Tbl>
      {editable && (
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <Labeled label={t('q6.addItemSection')} className="w-[200px]"><input className="w-input" value={sec} onChange={(e) => setSec(e.target.value)} /></Labeled>
          <Labeled label={t('q6.addItemQuestion')} className="min-w-[260px] flex-1"><input className="w-input" value={ques} onChange={(e) => setQues(e.target.value)} /></Labeled>
          <button type="button" className="w-btn w-btn-sm" disabled={!sec.trim() || !ques.trim() || save.isPending} onClick={() => { save.mutate({ add: [{ section: sec.trim(), question: ques.trim() }] }); setQues(''); }}><Plus size={13} /> {t('q6.addItem')}</button>
        </div>
      )}
    </Card>
  );
}

/** Ô chữ lưu khi rời ô (blur) / Enter — không gửi mỗi phím. */
function CellInput({ value, onSave, label, disabled }: { value: string | null; onSave: (v: string | null) => void; label: string; disabled?: boolean }) {
  const [v, setV] = useState(value ?? '');
  useEffect(() => setV(value ?? ''), [value]);
  const commit = () => { if (v !== (value ?? '')) onSave(v.trim() || null); };
  return <input aria-label={label} className="w-input h-7 w-full py-0 text-[12.5px]" disabled={disabled} value={v} onChange={(e) => setV(e.target.value)} onBlur={commit} onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget as HTMLInputElement).blur()} />;
}
