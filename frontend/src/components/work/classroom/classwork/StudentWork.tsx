'use client';

/**
 * CTW đợt 9b — phần "Bài làm của bạn" (sinh viên): tệp / link / văn bản, lưu nháp, nộp, huỷ nộp, cảnh báo muộn, lịch sử
 * phiên bản, điểm ĐÃ TRẢ (điểm nháp không bao giờ tới đây — máy chủ không gửi), nhận xét riêng với giảng viên.
 * Mọi hook đặt TRƯỚC lệnh return sớm.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, History, Link2, Plus } from 'lucide-react';
import { workError } from '@/lib/work-api';
import { Spinner } from '@/components/work/ui';
import { useWT } from '@/components/work/i18n';
import { classworkApi, classworkKeys, type AssignmentDetail, type SubmissionLink } from '../classworkApi';
import { FileList, LinkList, PrivateComments, StateChip, UploadButton, pts } from './common';

export default function StudentWork({ classId, a }: { classId: number; a: AssignmentDetail }) {
  const { t, locale, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const s = a.submission!;
  const [text, setText] = useState(s.text ?? '');
  const [links, setLinks] = useState<SubmissionLink[]>(s.links ?? []);
  const [newLink, setNewLink] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [removing, setRemoving] = useState<number | null>(null);
  useEffect(() => { setText(s.text ?? ''); setLinks(s.links ?? []); }, [s.text, s.links]);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: classworkKeys.one(classId, a.id) });
    qc.invalidateQueries({ queryKey: classworkKeys.list(classId) });
    qc.invalidateQueries({ queryKey: classworkKeys.gradebook(classId) });
  };
  const locked = s.status === 'TURNED_IN';
  const dirty = (text || '') !== (s.text ?? '') || JSON.stringify(links) !== JSON.stringify(s.links ?? []);
  const save = useMutation({
    mutationFn: () => classworkApi.saveDraft(classId, a.id, { text: text || null, links }),
    onSuccess: () => { toast.success(t('c9b.draftSaved')); refresh(); },
    onError: (err) => toast.error(workError(err)),
  });
  const turnIn = useMutation({
    mutationFn: async () => {
      if (dirty) await classworkApi.saveDraft(classId, a.id, { text: text || null, links });
      return classworkApi.turnIn(classId, a.id);
    },
    onSuccess: () => { toast.success(t('c9b.turnedIn')); refresh(); },
    onError: (err) => toast.error(workError(err)),
  });
  const unsubmit = useMutation({
    mutationFn: () => classworkApi.unsubmit(classId, a.id),
    onSuccess: () => { toast.success(t('c9b.unsubmitted')); refresh(); },
    onError: (err) => toast.error(workError(err)),
  });

  if (s.needsGroup) {
    return <div className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4 text-[13px] text-[var(--w-text-2)]">{t('c9b.needsGroup')}</div>;
  }
  const hasWork = (s.files?.length ?? 0) > 0 || links.length > 0 || !!text.trim();
  const grade = s.grade;

  return (
    <div className="space-y-4">
      <section aria-labelledby="cw-your-work" className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4 shadow-[var(--w-shadow-card)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 id="cw-your-work" className="text-[14px] font-semibold">{a.kind === 'GROUP' ? t('c9b.yourGroupWork') : t('c9b.yourWork')}</h3>
          <StateChip state={s.state ?? 'ASSIGNED'} />
        </div>
        {grade?.points !== null && grade?.points !== undefined && (
          <div className="mb-3 rounded-[8px] bg-[var(--w-sunken)] px-3 py-2 text-[13px]" data-testid="cw-my-grade">
            <span className="text-[20px] font-semibold tabular-nums">{pts(grade.points, locale)}</span>
            <span className="text-[var(--w-text-2)]"> / {pts(a.maxPoints, locale)}</span>
            {!!grade.penaltyPct && <span className="ml-2 text-[12px] text-[var(--w-orange-text)]">{t('c9b.latePenaltyApplied', { raw: pts(grade.rawPoints, locale), pct: grade.penaltyPct })}</span>}
          </div>
        )}
        {s.submittedAt && <p className="mb-2 text-[12px] text-[var(--w-text-2)]">{t('c9b.submittedAt', { at: fmtDateTime(s.submittedAt) })}{s.late ? ` · ${t('c9b.markedLate')}` : ''}</p>}
        {!locked && s.lateIfNow && s.canTurnIn && (
          <p className="mb-2 flex items-center gap-1.5 text-[12.5px] text-[var(--w-orange-text)]"><AlertTriangle size={13} aria-hidden="true" />{s.penaltyIfNow ? t('c9b.lateWarnPenalty', { pct: s.penaltyIfNow }) : t('c9b.lateWarn')}</p>
        )}
        {!locked && s.canTurnIn === false && <p className="mb-2 flex items-center gap-1.5 text-[12.5px] text-[var(--w-red-text)]"><AlertTriangle size={13} aria-hidden="true" />{t('c9b.lateClosed')}</p>}

        <div className="space-y-2">
          <FileList classId={classId} files={s.files ?? []} removing={removing} onRemove={locked ? undefined : async (f) => {
            setRemoving(f.id);
            try { await classworkApi.removeMyFile(classId, a.id, f.id); refresh(); } catch (err) { toast.error(workError(err)); }
            setRemoving(null);
          }} />
          <LinkList links={links} onRemove={locked ? undefined : (i) => setLinks(links.filter((_, j) => j !== i))} />
          {!locked && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <UploadButton onPick={async (f) => { await classworkApi.uploadMyFile(classId, a.id, f); refresh(); }} />
                <div className="flex min-w-[220px] flex-1 items-center gap-1.5">
                  <Link2 size={14} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
                  <input
                    className="w-input flex-1" type="url" placeholder={t('c9b.linkPh')} aria-label={t('c9b.addLink')} value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && newLink.trim()) { e.preventDefault(); setLinks([...links, { url: newLink.trim(), label: '' }]); setNewLink(''); } }}
                  />
                  <button type="button" className="w-btn w-btn-icon" aria-label={t('c9b.addLink')} disabled={!/^https?:\/\/\S+/.test(newLink.trim())} onClick={() => { setLinks([...links, { url: newLink.trim(), label: '' }]); setNewLink(''); }}><Plus size={14} /></button>
                </div>
              </div>
              <textarea className="w-input min-h-[90px] w-full resize-y" maxLength={50_000} value={text} placeholder={t('c9b.textPh')} aria-label={t('c9b.textLabel')} onChange={(e) => setText(e.target.value)} />
            </>
          )}
          {locked && text && <p className="whitespace-pre-wrap rounded-[8px] bg-[var(--w-sunken)] p-2.5 text-[13px]">{text}</p>}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {locked ? (
            <button type="button" className="w-btn" data-testid="cw-unsubmit" disabled={unsubmit.isPending} onClick={() => unsubmit.mutate()}>{unsubmit.isPending && <Spinner size={13} />}{t('c9b.unsubmit')}</button>
          ) : (
            <>
              <button type="button" className="w-btn w-btn-primary" data-testid="cw-turn-in" disabled={!hasWork || turnIn.isPending || s.canTurnIn === false} onClick={() => turnIn.mutate()}>
                {turnIn.isPending && <Spinner size={13} />}{s.status === 'RETURNED' ? t('c9b.resubmit') : t('c9b.turnIn')}
              </button>
              <button type="button" className="w-btn" disabled={!dirty || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={13} />}{t('c9b.saveDraftWork')}</button>
            </>
          )}
          {!!s.versions?.length && (
            <button type="button" className="w-btn w-btn-ghost ml-auto" aria-expanded={showHistory} onClick={() => setShowHistory((v) => !v)}><History size={14} />{t('c9b.history', { n: s.versions.length })}</button>
          )}
        </div>
        {showHistory && (
          <ol className="mt-3 space-y-2 border-t border-[var(--w-border)] pt-3 text-[12.5px]">
            {s.versions!.map((v) => (
              <li key={v.id}>
                <div className="font-medium">{t(v.action === 'TURN_IN' ? 'c9b.vTurnIn' : 'c9b.vUnsubmit', { n: v.version })} · <span className="font-normal text-[var(--w-text-2)]">{fmtDateTime(v.createdAt)}{v.late ? ` · ${t('c9b.markedLate')}` : ''}</span></div>
                {v.files.length > 0 && <div className="mt-1"><FileList classId={classId} files={v.files} /></div>}
                {v.links.length > 0 && <div className="mt-1"><LinkList links={v.links} /></div>}
                {v.text && <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-[var(--w-text-2)]">{v.text}</p>}
              </li>
            ))}
          </ol>
        )}
      </section>
      <div className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4">
        <PrivateComments classId={classId} comments={s.comments ?? []} submissionId={s.id ?? null} assignmentId={a.id} onSent={refresh} />
      </div>
    </div>
  );
}
