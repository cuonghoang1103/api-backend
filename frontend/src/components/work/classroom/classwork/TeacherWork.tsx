'use client';

/**
 * CTW đợt 9b — "Bài làm của sinh viên" (giảng viên): bảng theo SV/nhóm (Đã nộp / Chưa nộp / Muộn / Đã trả / Thiếu), chọn
 * nhiều ⇒ trả theo lô; mở một dòng ⇒ khung chấm (rubric hoặc điểm số, điểm chỉnh từng người cho bài nhóm, mức trừ muộn,
 * lịch sử nộp, nhận xét riêng). Điểm lưu là NHÁP — chỉ hiện cho SV sau khi trả.
 * Mọi hook đặt TRƯỚC lệnh return sớm.
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CornerUpLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { PageLoading, Spinner } from '@/components/work/ui';
import DataTable, { type DataColumn, type RowKey } from '@/components/work/table/DataTable';
import { useWT, type WKey } from '@/components/work/i18n';
import { classworkApi, classworkKeys, type AssignmentDetail, type SubmissionDetail, type SubmissionRow, type WorkState } from '../classworkApi';
import { FileList, LinkList, PrivateComments, StateChip, pts } from './common';

const FILTERS = ['ALL', 'TURNED_IN', 'NOT_TURNED_IN', 'LATE', 'RETURNED'] as const;
type Filter = (typeof FILTERS)[number];
const match = (f: Filter, s: WorkState) => f === 'ALL' || (f === 'TURNED_IN' ? s === 'TURNED_IN' || s === 'LATE' : f === 'NOT_TURNED_IN' ? s === 'ASSIGNED' || s === 'MISSING' : s === f);

export default function TeacherWork({ classId, a, owner, setOwner }: { classId: number; a: AssignmentDetail; owner: string | null; setOwner: (k: string | null) => void }) {
  const { t, locale, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>('ALL');
  const [selected, setSelected] = useState<Set<RowKey>>(new Set());
  const q = useQuery({ queryKey: classworkKeys.subs(classId, a.id), queryFn: () => classworkApi.submissions(classId, a.id) });
  const rows = useMemo(() => (q.data?.rows ?? []).filter((r) => match(filter, r.state)), [q.data, filter]);
  const ret = useMutation({
    mutationFn: (keys: string[]) => classworkApi.returnWork(classId, a.id, keys),
    onSuccess: (r) => {
      toast.success(t('c9b.returnedN', { count: r.returned }));
      setSelected(new Set());
      qc.invalidateQueries({ queryKey: classworkKeys.subs(classId, a.id) });
      qc.invalidateQueries({ queryKey: ['work', 'class', classId, 'assignment', a.id, 'sub'] });
      qc.invalidateQueries({ queryKey: classworkKeys.list(classId) });
      qc.invalidateQueries({ queryKey: classworkKeys.gradebook(classId) });
    },
    onError: (err) => toast.error(workError(err)),
  });

  const who = (r: SubmissionRow) => (r.group ? r.group.name : r.members[0]?.name ?? r.ownerKey);
  const columns: DataColumn<SubmissionRow>[] = [
    { id: 'who', header: a.kind === 'GROUP' ? t('c9b.colGroup') : t('c9b.colStudent'), grow: true, width: 200, required: true, value: who, cell: (r) => (
      <div className="min-w-0">
        <div className="truncate font-medium">{who(r)}</div>
        {r.group ? <div className="truncate text-[12px] text-[var(--w-text-3)]">{r.members.map((m) => m.name).join(', ')}</div> : r.members[0]?.studentCode && <div className="text-[12px] text-[var(--w-text-3)]">{r.members[0].studentCode}</div>}
      </div>
    ) },
    { id: 'state', header: t('c9b.colStatus'), width: 130, value: (r) => r.state, cell: (r) => <StateChip state={r.state} /> },
    { id: 'submitted', header: t('c9b.colSubmitted'), width: 160, value: (r) => (r.submittedAt ? new Date(r.submittedAt) : null), cell: (r) => <span className="text-[12.5px] text-[var(--w-text-2)]">{r.submittedAt ? fmtDateTime(r.submittedAt) : '—'}</span>, hideBelow: 'md' },
    { id: 'points', header: t('c9b.colDraft'), width: 110, align: 'right', value: (r) => r.points, headerTitle: t('c9b.colDraftHint'), cell: (r) => (
      <span className={cn('tabular-nums', r.regradedSinceReturn && 'italic text-[var(--w-orange-text)]')} title={r.regradedSinceReturn ? t('c9b.regraded') : undefined}>{r.points === null ? '—' : `${pts(r.points, locale)}${r.penaltyPct ? ` −${r.penaltyPct}%` : ''}`}</span>
    ) },
    { id: 'returned', header: t('c9b.colReturned'), width: 100, align: 'right', value: (r) => r.returnedPoints, cell: (r) => <span className="tabular-nums">{r.returnedAt ? pts(r.returnedPoints, locale) : '—'}</span> },
    { id: 'files', header: t('c9b.colFiles'), width: 70, align: 'right', value: (r) => r.files, hideBelow: 'md' },
  ];

  if (q.isLoading) return <PageLoading rows={4} />;
  if (q.error) return <p className="text-[13px] text-[var(--w-red-text)]">{workError(q.error)}</p>;
  const all = q.data!.rows;
  const count = (f: Filter) => all.filter((r) => match(f, r.state)).length;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      <div className="min-w-0 space-y-3">
        <div role="group" aria-label={t('c9b.filterLabel')} className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}
              className={cn('rounded-full border px-2.5 py-1 text-[12.5px]', filter === f ? 'border-[var(--w-accent)] bg-[var(--w-sunken)] font-medium' : 'border-[var(--w-border)] text-[var(--w-text-2)]')}>
              {t(`c9b.filter_${f}` as WKey)} <span className="tabular-nums">{count(f)}</span>
            </button>
          ))}
        </div>
        <DataTable<SubmissionRow>
          id={`cw-subs-${a.kind}`} label={t('c9b.studentWork')} rows={rows} columns={columns} rowKey={(r) => r.ownerKey}
          selectable selected={selected} onSelectedChange={setSelected} quickFilter exportable={false} paging="none" height="auto"
          onRowOpen={(r) => setOwner(r.ownerKey)} rowActive={(r) => r.ownerKey === owner}
          empty={<p className="p-6 text-center text-[13px] text-[var(--w-text-2)]">{t('c9b.noAssignees')}</p>}
          bulkActions={(sel, clear) => (
            <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={ret.isPending} onClick={() => { ret.mutate(sel.map((x) => x.ownerKey)); clear(); }}>
              {ret.isPending ? <Spinner size={12} /> : <CornerUpLeft size={13} />}{t('c9b.returnN', { count: sel.length })}
            </button>
          )}
          description={t('c9b.tableHint')}
        />
      </div>
      <div className="min-w-0">
        {owner ? <GradePanel classId={classId} a={a} owner={owner} onClose={() => setOwner(null)} /> : (
          <div className="rounded-[10px] border border-dashed border-[var(--w-border)] p-6 text-center text-[13px] text-[var(--w-text-2)]">{t('c9b.pickToGrade')}</div>
        )}
      </div>
    </div>
  );
}

function GradePanel({ classId, a, owner, onClose }: { classId: number; a: AssignmentDetail; owner: string; onClose: () => void }) {
  const { t, locale, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: classworkKeys.sub(classId, a.id, owner), queryFn: () => classworkApi.submission(classId, a.id, owner) });
  const [points, setPoints] = useState('');
  const [scores, setScores] = useState<Record<string, string>>({});
  const [members, setMembers] = useState<Record<string, string>>({});
  const [penalty, setPenalty] = useState('0');
  useEffect(() => {
    const s = q.data?.submission;
    setPoints(s?.points === null || s?.points === undefined ? '' : String(s.points));
    setScores(Object.fromEntries(Object.entries(s?.scores ?? {}).map(([k, v]) => [k, String(v)])));
    setMembers(Object.fromEntries(Object.entries(s?.memberPoints ?? {}).map(([k, v]) => [k, String(v)])));
    setPenalty(String(s?.penaltyPct ?? 0));
  }, [q.data]);
  const refresh = (d?: SubmissionDetail) => {
    if (d) qc.setQueryData(classworkKeys.sub(classId, a.id, owner), d);
    qc.invalidateQueries({ queryKey: classworkKeys.subs(classId, a.id) });
    qc.invalidateQueries({ queryKey: classworkKeys.gradebook(classId) });
    qc.invalidateQueries({ queryKey: classworkKeys.list(classId) });
  };
  const save = useMutation({
    mutationFn: () => {
      const rubric = q.data?.rubric;
      const memberPoints = a.kind === 'GROUP' ? Object.fromEntries((q.data?.members ?? []).map((m) => [String(m.userId), members[String(m.userId)] === undefined || members[String(m.userId)] === '' ? null : Number(members[String(m.userId)])])) : undefined;
      return classworkApi.grade(classId, a.id, {
        ownerKey: owner,
        ...(rubric ? { scores: Object.fromEntries(rubric.criteria.map((c) => [c.key, scores[c.key] === undefined || scores[c.key] === '' ? null : Number(scores[c.key])])) } : {}),
        points: points === '' ? null : Number(points),
        ...(memberPoints ? { memberPoints } : {}),
        penaltyPct: Number(penalty) || 0,
      });
    },
    onSuccess: (d) => { toast.success(t('c9b.gradeSaved')); refresh(d); },
    onError: (err) => toast.error(workError(err)),
  });
  const ret = useMutation({
    mutationFn: async () => { await save.mutateAsync(); return classworkApi.returnWork(classId, a.id, [owner]); },
    onSuccess: () => { toast.success(t('c9b.returnedN', { count: 1 })); qc.invalidateQueries({ queryKey: classworkKeys.sub(classId, a.id, owner) }); refresh(); },
    onError: (err) => toast.error(workError(err)),
  });

  if (q.isLoading) return <PageLoading rows={3} />;
  if (q.error || !q.data) return <p className="text-[13px] text-[var(--w-red-text)]">{workError(q.error)}</p>;
  const d = q.data;
  const s = d.submission;
  const rubric = d.rubric;
  const rubricTotal = rubric && rubric.criteria.every((c) => scores[c.key] !== undefined && scores[c.key] !== '')
    ? Math.round((rubric.criteria.reduce((acc, c) => acc + (c.weight / 100) * Number(scores[c.key]), 0) / rubric.scaleMax) * a.maxPoints * 100) / 100
    : null;

  return (
    <section aria-label={t('c9b.gradePanel')} className="space-y-4 rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4 shadow-[var(--w-shadow-card)]" data-testid="cw-grade-panel">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[14px] font-semibold">{d.members.length > 1 ? d.members.map((m) => m.name).join(', ') : d.members[0]?.name}</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-[var(--w-text-2)]">
            <StateChip state={d.state} />
            {s?.submittedAt && <span>{fmtDateTime(s.submittedAt)}</span>}
            {s?.version ? <span>{t('c9b.versionN', { n: s.version })}</span> : null}
          </div>
        </div>
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c9b.close')} onClick={onClose}><X size={15} /></button>
      </div>

      <div className="space-y-2">
        {s && (s.files.length || s.links.length || s.text) ? (
          <>
            <FileList classId={classId} files={s.files} />
            <LinkList links={s.links} />
            {s.text && <p className="max-h-[220px] overflow-y-auto whitespace-pre-wrap rounded-[8px] bg-[var(--w-sunken)] p-2.5 text-[13px]">{s.text}</p>}
          </>
        ) : <p className="text-[12.5px] text-[var(--w-text-3)]">{t('c9b.nothingSubmitted')}</p>}
      </div>

      <div className="space-y-3 border-t border-[var(--w-border)] pt-3">
        <h4 className="text-[13px] font-semibold">{t('c9b.grade')} <span className="font-normal text-[var(--w-text-3)]">· {t('c9b.draftNote')}</span></h4>
        {rubric && (
          <div className="space-y-2">
            {rubric.criteria.map((c) => (
              <label key={c.key} className="grid grid-cols-[minmax(0,1fr)_88px] items-center gap-2 text-[13px]">
                <span className="min-w-0"><span className="font-medium">{c.name}</span> <span className="text-[var(--w-text-3)]">({c.weight}%)</span></span>
                <input className="w-input text-right" type="number" min={0} max={rubric.scaleMax} step="0.25" value={scores[c.key] ?? ''} aria-label={c.name}
                  onChange={(e) => setScores({ ...scores, [c.key]: e.target.value })} />
              </label>
            ))}
            <p className="text-[12px] text-[var(--w-text-2)]">{t('c9b.rubricTotal', { total: pts(rubricTotal, locale), max: pts(a.maxPoints, locale) })}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <label className="text-[12.5px]"><span className="w-label">{rubric ? t('c9b.pointsOverride') : t('c9b.points', { max: pts(a.maxPoints, locale) })}</span>
            <input className="w-input text-right" type="number" min={0} step="0.25" value={points} onChange={(e) => setPoints(e.target.value)} data-testid="cw-points" />
          </label>
          <label className="text-[12.5px]"><span className="w-label">{t('c9b.penalty')}</span>
            <input className="w-input text-right" type="number" min={0} max={100} value={penalty} onChange={(e) => setPenalty(e.target.value)} />
          </label>
        </div>
        {a.kind === 'GROUP' && (
          <div className="space-y-1.5">
            <div className="w-label">{t('c9b.memberPoints')}</div>
            {d.members.map((m) => (
              <label key={m.userId} className="grid grid-cols-[minmax(0,1fr)_88px] items-center gap-2 text-[13px]">
                <span className="truncate">{m.name}</span>
                <input className="w-input text-right" type="number" min={0} step="0.25" placeholder={points || '—'} aria-label={t('c9b.memberPointsFor', { name: m.name })} value={members[String(m.userId)] ?? ''}
                  onChange={(e) => setMembers({ ...members, [String(m.userId)]: e.target.value })} />
              </label>
            ))}
          </div>
        )}
        {s?.returnedAt && <p className="text-[12px] text-[var(--w-text-2)]">{t('c9b.lastReturned', { at: fmtDateTime(s.returnedAt), pts: pts(s.returnedPoints, locale) })}</p>}
        <div className="flex flex-wrap gap-2">
          <button type="button" className="w-btn" disabled={save.isPending} onClick={() => save.mutate()} data-testid="cw-save-grade">{save.isPending && <Spinner size={13} />}{t('c9b.saveGrade')}</button>
          <button type="button" className="w-btn w-btn-primary" disabled={ret.isPending} onClick={() => ret.mutate()} data-testid="cw-return">{ret.isPending ? <Spinner size={13} /> : <CornerUpLeft size={13} />}{t('c9b.saveAndReturn')}</button>
        </div>
      </div>

      {d.versions.length > 0 && (
        <details className="border-t border-[var(--w-border)] pt-3 text-[12.5px]">
          <summary className="cursor-pointer font-semibold">{t('c9b.history', { n: d.versions.length })}</summary>
          <ol className="mt-2 space-y-1.5">
            {d.versions.map((v) => (
              <li key={v.id}>{t(v.action === 'TURN_IN' ? 'c9b.vTurnIn' : 'c9b.vUnsubmit', { n: v.version })} · <span className="text-[var(--w-text-2)]">{fmtDateTime(v.createdAt)}{v.late ? ` · ${t('c9b.markedLate')}` : ''}{v.actor ? ` · ${v.actor.displayName || v.actor.username}` : ''}</span>
                {v.files.length > 0 && <div className="mt-1"><FileList classId={classId} files={v.files} /></div>}
              </li>
            ))}
          </ol>
        </details>
      )}

      <div className="border-t border-[var(--w-border)] pt-3">
        {s?.id
          ? <PrivateComments classId={classId} comments={d.comments} submissionId={s.id} onSent={() => qc.invalidateQueries({ queryKey: classworkKeys.sub(classId, a.id, owner) })} />
          : <p className="text-[12px] text-[var(--w-text-3)]">{t('c9b.commentAfterSubmission')}</p>}
      </div>
    </section>
  );
}
