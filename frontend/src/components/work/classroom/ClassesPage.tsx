'use client';

/**
 * CTW đợt 5 (10/10/2026) — /work/classes: LUỒNG LỚP HỌC (D6).
 *   ?join=<mã>  — sinh viên / giảng viên mở link mời: xem lớp ⇒ vào nhóm có sẵn, lập nhóm mới (không gian + dự án theo
 *                 mẫu môn), hoặc nhận vai giảng viên (lớp do trưởng nhóm tạo, đúng email).
 *   ?id=<lớp>   — chi tiết lớp: mã lớp + link (chép, đổi mã, đóng/mở), các nhóm, danh sách sinh viên (nhập CSV/xlsx có
 *                 xem trước lỗi từng dòng ⇒ xác nhận; gửi lời mời theo lô có xem trước ⇒ xác nhận; trần tốc độ ở máy chủ).
 *   (không gì)  — lớp tôi phụ trách / lớp tôi học + ô nhập mã + nút tạo lớp.
 * Mọi hook đặt TRƯỚC lệnh return sớm.
 */

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, ArrowUpRight, Copy, FileUp, KeyRound, Mail, Plus, RefreshCw, School, Trash2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '@/components/work/ui';
import { ConfirmDialog, PageHeader, Select } from '@/components/work/settings/shared';
import { useWT, wt, type WKey } from '@/components/work/i18n';
import {
  CLASS_SUBJECTS, teachingApi, teachingKeys, type ClassDetail, type ClassInput, type ClassListItem, type ClassSubject, type InvitePlan,
  type JoinPreview, type RosterPreview, type RosterSource,
} from '@/components/work/teaching/teachingApi';

async function copy(text: string) {
  try { await navigator.clipboard.writeText(text); toast.success(wt('classroom.copied')); } catch { toast.error(text); }
}

const subjectLabel = (s: string) => (s === 'OTHER' ? wt('classroom.subject_OTHER') : s);

// ─── Tạo lớp ────────────────────────────────────────────────────

function CreateClassDialog({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (id: number) => void }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const empty = (): ClassInput => ({ subject: 'SWP391', classCode: '', term: '', name: '', iAmTeacher: true, teacherEmail: '', maxGroupSize: 6, joinExpiresInDays: 30, week1Start: '' });
  const [f, setF] = useState<ClassInput>(empty);
  useEffect(() => { if (open) setF(empty()); }, [open]);
  const create = useMutation({
    mutationFn: () => teachingApi.createClass({
      ...f, name: f.name?.trim() || null, teacherEmail: f.iAmTeacher ? null : (f.teacherEmail?.trim() || null), week1Start: f.week1Start || null,
    }),
    onSuccess: (c) => { toast.success(t('classroom.created')); qc.invalidateQueries({ queryKey: teachingKeys.classes }); qc.invalidateQueries({ queryKey: teachingKeys.access }); onCreated(c.id); },
    onError: (err) => toast.error(workError(err)),
  });
  const valid = f.classCode.trim() && f.term.trim();
  return (
    <Dialog open={open} onClose={onClose} title={t('classroom.createTitle')} width={560}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('classroom.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!valid || create.isPending} onClick={() => create.mutate()}>{create.isPending && <Spinner size={13} />}{t('classroom.create')}</button>
      </>}>
      <div className="grid gap-x-3 sm:grid-cols-3">
        <Field label={t('classroom.subject')}>
          <Select value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value as ClassSubject })}>
            {CLASS_SUBJECTS.map((s) => <option key={s} value={s}>{subjectLabel(s)}</option>)}
          </Select>
        </Field>
        <Field label={t('classroom.classCode')}><input className="w-input" value={f.classCode} onChange={(e) => setF({ ...f, classCode: e.target.value })} placeholder={t('classroom.classCodePh')} maxLength={32} /></Field>
        <Field label={t('classroom.term')}><input className="w-input" value={f.term} onChange={(e) => setF({ ...f, term: e.target.value })} placeholder={t('classroom.termPh')} maxLength={16} /></Field>
      </div>
      <Field label={t('classroom.className')}><input className="w-input" value={f.name ?? ''} onChange={(e) => setF({ ...f, name: e.target.value })} maxLength={120} /></Field>
      <label className="mb-3 flex items-center gap-2 text-[13px]">
        <input type="checkbox" className="h-4 w-4 accent-[var(--w-accent)]" checked={f.iAmTeacher !== false} onChange={(e) => setF({ ...f, iAmTeacher: e.target.checked })} />
        {t('classroom.iAmTeacher')}
      </label>
      {f.iAmTeacher === false && (
        <Field label={t('classroom.teacherEmail')} hint={t('classroom.teacherEmailHint')}><input className="w-input" type="email" value={f.teacherEmail ?? ''} onChange={(e) => setF({ ...f, teacherEmail: e.target.value })} maxLength={100} /></Field>
      )}
      <div className="grid gap-x-3 sm:grid-cols-3">
        <Field label={t('classroom.maxGroupSize')}><input className="w-input" type="number" min={1} max={10} value={f.maxGroupSize} onChange={(e) => setF({ ...f, maxGroupSize: Number(e.target.value) || 6 })} /></Field>
        <Field label={t('classroom.codeValidDays')}><input className="w-input" type="number" min={1} max={180} value={f.joinExpiresInDays ?? 30} onChange={(e) => setF({ ...f, joinExpiresInDays: Number(e.target.value) || 30 })} /></Field>
        <Field label={t('classroom.week1Start')}><input className="w-input" type="date" value={f.week1Start ?? ''} onChange={(e) => setF({ ...f, week1Start: e.target.value })} /></Field>
      </div>
    </Dialog>
  );
}

// ─── Vào lớp bằng mã ────────────────────────────────────────────

function JoinPanel({ code, onDone }: { code: string; onDone: () => void }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const router = useRouter();
  const pv = useQuery({ queryKey: teachingKeys.join(code), queryFn: () => teachingApi.previewJoin(code), retry: false });
  const [groupName, setGroupName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const join = useMutation({
    mutationFn: (b: Parameters<typeof teachingApi.join>[1]) => teachingApi.join(code, { ...b, ...(studentCode.trim() ? { studentCode: studentCode.trim() } : {}) }),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: teachingKeys.classes });
      qc.invalidateQueries({ queryKey: teachingKeys.access });
      qc.invalidateQueries({ queryKey: ['work', 'workspaces'] });
      if (r.project) { toast.success(t('classroom.projectReady')); router.push(r.project.href); return; }
      toast.success(t('classroom.joined'));
      onDone();
      router.replace(`/work/classes?id=${r.classId}`);
    },
    onError: (err) => toast.error(workError(err)),
  });
  if (pv.isLoading) return <PageLoading rows={3} />;
  if (pv.error || !pv.data) return <EmptyState title={workError(pv.error)} action={<button type="button" className="w-btn" onClick={onDone}>{t('classroom.back')}</button>} />;
  const p: JoinPreview = pv.data;
  const myGroup = p.me.groupId ? p.groups.find((g) => g.id === p.me.groupId) : null;
  return (
    <div className="space-y-4">
      <div className="w-card p-4">
        <div className="text-[12px] font-medium text-[var(--w-text-2)]">{subjectLabel(p.class.subject)} · {p.class.classCode} · {p.class.term}</div>
        <h2 className="mt-0.5 text-[17px] font-semibold">{t('classroom.joinAs', { name: p.class.name })}</h2>
        <div className="mt-1 text-[13px] text-[var(--w-text-2)]">{t('classroom.lecturer')}: {p.class.teacher ? (p.class.teacher.displayName || p.class.teacher.username) : t('classroom.noLecturer')}</div>
        {p.onRoster && <p className="mt-2 text-[13px]">{t('classroom.onRoster', { name: p.onRoster.fullName ?? '', code: p.onRoster.studentCode ?? '—' })}</p>}
      </div>
      {p.isTeacher && <div className="w-card p-4 text-[13px]">{t('classroom.youTeach')} <Link className="underline" href={`/work/classes?id=${p.class.id}`}>{t('classroom.openClass')}</Link></div>}
      {p.canTeach && (
        <div className="w-card p-4">
          <p className="text-[13px] text-[var(--w-text-2)]">{t('classroom.teachNote')}</p>
          <button type="button" className="w-btn w-btn-primary mt-3" disabled={join.isPending} onClick={() => join.mutate({ action: 'TEACH' })}>{t('classroom.teachBtn')}</button>
        </div>
      )}
      {!p.isTeacher && myGroup && (
        <div className="w-card p-4 text-[13px]">{t('classroom.alreadyIn')} {t('classroom.yourGroup', { name: myGroup.name })}</div>
      )}
      {!p.isTeacher && !myGroup && (
        <>
          {!p.onRoster && (
            <div className="max-w-[260px]"><Field label={t('classroom.yourStudentCode')}><input className="w-input" value={studentCode} onChange={(e) => setStudentCode(e.target.value)} maxLength={20} placeholder="HE170001" /></Field></div>
          )}
          <section aria-labelledby="join-groups" className="w-card p-4">
            <h3 id="join-groups" className="mb-2 font-semibold">{t('classroom.pickGroup')}</h3>
            {!p.groups.length ? <p className="text-[13px] text-[var(--w-text-2)]">{t('classroom.noGroups')}</p> : (
              <ul className="divide-y divide-[var(--w-border)]">
                {p.groups.map((g) => (
                  <li key={g.id} className="flex items-center gap-3 py-2">
                    <Users size={15} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{g.name}</span>
                    <span className="text-[12px] tabular-nums text-[var(--w-text-2)]">{t('classroom.membersOf', { n: g.members, max: p.class.maxGroupSize })}</span>
                    <button type="button" className="w-btn w-btn-sm" disabled={g.full || join.isPending} onClick={() => join.mutate({ action: 'JOIN_GROUP', groupId: g.id })}>{g.full ? t('classroom.full') : t('classroom.joinGroupBtn')}</button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section aria-labelledby="join-create" className="w-card p-4">
            <h3 id="join-create" className="mb-1 font-semibold">{t('classroom.createGroup')}</h3>
            <p className="mb-3 text-[13px] text-[var(--w-text-2)]">{t('classroom.templateNote', { template: p.template === 'CAPSTONE' ? 'Capstone' : p.template })}</p>
            <div className="grid gap-x-3 sm:grid-cols-[1fr_180px]">
              <Field label={t('classroom.groupName')}><input className="w-input" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder={t('classroom.groupNamePh')} maxLength={80} /></Field>
              <Field label={t('classroom.projectKey')}><input className="w-input uppercase" value={projectKey} onChange={(e) => setProjectKey(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} maxLength={10} /></Field>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="w-btn w-btn-primary" disabled={join.isPending} onClick={() => join.mutate({ action: 'CREATE_GROUP', ...(groupName.trim() ? { groupName: groupName.trim() } : {}), ...(projectKey ? { projectKey } : {}) })}>
                {join.isPending && <Spinner size={13} />}{t('classroom.createGroupBtn')}
              </button>
              {!p.me.joined && <button type="button" className="w-btn" disabled={join.isPending} onClick={() => join.mutate({ action: 'JOIN' })}>{t('classroom.joinOnly')}</button>}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

// ─── Danh sách sinh viên: nhập + mời ─────────────────────────────

function readFile(file: File): Promise<RosterSource> {
  return new Promise((resolve, reject) => {
    if (file.size > 2_000_000) { reject(new Error(wt('classroom.fileTooBig'))); return; }
    const r = new FileReader();
    if (/\.xlsx$/i.test(file.name)) {
      r.onload = () => { const s = String(r.result); resolve({ xlsxBase64: s.slice(s.indexOf(',') + 1) }); };
      r.readAsDataURL(file);
    } else {
      r.onload = () => resolve({ csv: String(r.result) });
      r.readAsText(file);
    }
    r.onerror = () => reject(r.error);
  });
}

function ImportDialog({ open, onClose, classId }: { open: boolean; onClose: () => void; classId: number }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [src, setSrc] = useState<RosterSource | null>(null);
  const [pv, setPv] = useState<RosterPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (open) { setSrc(null); setPv(null); } }, [open]);
  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const s = await readFile(file);
      setSrc(s);
      setPv(await teachingApi.previewRoster(classId, s));
    } catch (err) { toast.error(workError(err)); } finally { setBusy(false); }
  };
  const imp = useMutation({
    mutationFn: () => teachingApi.importRoster(classId, src!),
    onSuccess: (r) => { toast.success(t('classroom.imported', { count: r.imported ?? 0 })); qc.invalidateQueries({ queryKey: teachingKeys.cls(classId) }); onClose(); },
    onError: (err) => toast.error(workError(err)),
  });
  return (
    <Dialog open={open} onClose={onClose} title={t('classroom.importTitle')} width={820}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('classroom.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!pv?.valid || imp.isPending} onClick={() => imp.mutate()}>{imp.isPending && <Spinner size={13} />}{t('classroom.confirmImport', { count: pv?.valid ?? 0 })}</button>
      </>}>
      <p className="mb-3 text-[13px] text-[var(--w-text-2)]">{t('classroom.importHint')}</p>
      <input ref={fileRef} data-testid="ctw5-import-file" type="file" accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="sr-only" aria-label={t('classroom.chooseFile')} onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ''; }} />
      <button type="button" className="w-btn" onClick={() => fileRef.current?.click()} disabled={busy}>{busy ? <Spinner size={13} /> : <FileUp size={14} aria-hidden="true" />}<span className="ml-1">{t('classroom.chooseFile')}</span></button>
      {pv && (
        <div className="mt-4">
          <div className="mb-2 flex flex-wrap gap-3 text-[13px]">
            <span className="text-[var(--w-green-text)]">{t('classroom.rowsValid', { count: pv.valid })}</span>
            {pv.invalid > 0 && <span className="text-[var(--w-red-text)]">{t('classroom.rowsInvalid', { count: pv.invalid })}</span>}
          </div>
          <div className="max-h-[46vh] overflow-auto rounded-[8px] border border-[var(--w-border)]">
            <table className="w-full min-w-[620px] border-collapse text-[12.5px]">
              <thead className="sticky top-0 bg-[var(--w-panel)]">
                <tr className="border-b border-[var(--w-border)] text-left text-[var(--w-text-2)]">
                  <th scope="col" className="px-2 py-1.5">{t('classroom.line')}</th>
                  <th scope="col" className="px-2 py-1.5">{t('classroom.studentCode')}</th>
                  <th scope="col" className="px-2 py-1.5">{t('classroom.fullName')}</th>
                  <th scope="col" className="px-2 py-1.5">{t('classroom.email')}</th>
                  <th scope="col" className="px-2 py-1.5">{t('classroom.problems')}</th>
                </tr>
              </thead>
              <tbody>
                {pv.rows.map((r) => (
                  <tr key={r.line} className={cn('border-b border-[var(--w-border)] last:border-0', r.errors.length && 'bg-[var(--w-sunken)]')}>
                    <td className="px-2 py-1 tabular-nums text-[var(--w-text-2)]">{r.line}</td>
                    <td className="px-2 py-1">{r.studentCode ?? '—'}</td>
                    <td className="px-2 py-1">{r.fullName ?? '—'}</td>
                    <td className="px-2 py-1">{r.email ?? '—'}</td>
                    <td className={cn('px-2 py-1', r.errors.length ? 'text-[var(--w-red-text)]' : 'text-[var(--w-green-text)]')}>{r.errors.length ? r.errors.map((e) => t(`classroom.err_${e}` as WKey)).join(' · ') : t('classroom.ok')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Dialog>
  );
}

function InviteDialog({ open, onClose, classId }: { open: boolean; onClose: () => void; classId: number }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const plan = useQuery({ queryKey: [...teachingKeys.cls(classId), 'invite-plan'], queryFn: () => teachingApi.invite(classId, {}), enabled: open, staleTime: 0, gcTime: 0 });
  const send = useMutation({
    mutationFn: () => teachingApi.invite(classId, { confirm: true }),
    onSuccess: (r: InvitePlan) => { toast.success(t('classroom.sent', { count: r.sent })); qc.invalidateQueries({ queryKey: teachingKeys.cls(classId) }); onClose(); },
    onError: (err) => toast.error(workError(err)),
  });
  const p = plan.data;
  return (
    <Dialog open={open} onClose={onClose} title={t('classroom.inviteTitle')} width={480}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('classroom.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!p?.willSend || send.isPending} onClick={() => send.mutate()}>{send.isPending && <Spinner size={13} />}{t('classroom.confirmSend', { count: p?.willSend ?? 0 })}</button>
      </>}>
      {plan.isLoading && <Spinner />}
      {plan.error && <p className="text-[13px] text-[var(--w-red-text)]">{workError(plan.error)}</p>}
      {p && (
        <div className="space-y-2 text-[13px]">
          <p className="font-medium">{p.willSend ? t('classroom.invitePlan', { count: p.willSend }) : t('classroom.nothingToSend')}</p>
          <ul className="list-disc space-y-0.5 pl-5 text-[var(--w-text-2)]">
            {p.skipped.joined > 0 && <li>{t('classroom.skipJoined', { count: p.skipped.joined })}</li>}
            {p.skipped.tooSoon > 0 && <li>{t('classroom.skipTooSoon', { count: p.skipped.tooSoon, h: p.limits.resendAfterHours })}</li>}
            {p.skipped.max > 0 && <li>{t('classroom.skipMax', { count: p.skipped.max })}</li>}
            {p.skipped.overLimit > 0 && <li>{t('classroom.skipOver', { count: p.skipped.overLimit })}</li>}
          </ul>
          <p className="text-[12px] text-[var(--w-text-2)]">{t('classroom.inviteLimits', { batch: p.limits.perBatch, day: p.limits.perClassPerDay, h: p.limits.resendAfterHours })}</p>
        </div>
      )}
    </Dialog>
  );
}

// ─── Chi tiết lớp ──────────────────────────────────────────────

function ClassView({ id }: { id: number }) {
  const { t, fmtDate, fmtShortDate } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: teachingKeys.cls(id), queryFn: () => teachingApi.getClass(id) });
  const [importOpen, setImportOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [confirmCode, setConfirmCode] = useState(false);
  const [removing, setRemoving] = useState<{ id: number; name: string } | null>(null);
  const refresh = (c: ClassDetail) => qc.setQueryData(teachingKeys.cls(id), c);
  const newCode = useMutation({ mutationFn: () => teachingApi.newJoinCode(id, 30), onSuccess: (c) => { refresh(c); setConfirmCode(false); toast.success(t('classroom.newCodeDone')); }, onError: (err) => toast.error(workError(err)) });
  const toggleJoin = useMutation({ mutationFn: (open: boolean) => teachingApi.updateClass(id, { joinOpen: open }), onSuccess: refresh, onError: (err) => toast.error(workError(err)) });
  const remove = useMutation({ mutationFn: (sid: number) => teachingApi.removeStudent(id, sid), onSuccess: () => { setRemoving(null); toast.success(t('classroom.removed')); qc.invalidateQueries({ queryKey: teachingKeys.cls(id) }); }, onError: (err) => toast.error(workError(err)) });

  if (q.isLoading) return <PageLoading rows={4} />;
  if (q.error || !q.data) return <EmptyState title={workError(q.error)} action={<Link href="/work/classes" className="w-btn">{t('classroom.back')}</Link>} />;
  const c = q.data;
  const groupName = (gid: number | null) => c.groups.find((g) => g.id === gid)?.name ?? null;
  return (
    <div className="w-page space-y-5">
      <Link href="/work/classes" className="inline-flex items-center gap-1 text-[13px] text-[var(--w-text-2)] hover:text-[var(--w-text)]"><ArrowLeft size={14} aria-hidden="true" />{t('classroom.back')}</Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[12px] font-medium text-[var(--w-text-2)]">{subjectLabel(c.subject)} · {c.classCode} · {c.term} · {t(`classroom.role_${c.role}` as WKey)}</div>
          <h2 className="text-[19px] font-semibold tracking-[-0.01em]">{c.name}</h2>
          <div className="mt-0.5 text-[13px] text-[var(--w-text-2)]">{t('classroom.lecturer')}: {c.teacher ? (c.teacher.displayName || c.teacher.username) : t('classroom.noLecturer')} · {t('classroom.createdBy', { name: c.owner.displayName || c.owner.username })}</div>
        </div>
        <span className={cn('rounded-full px-2 py-0.5 text-[12px] font-medium', c.joinState === 'OK' ? 'bg-[var(--w-sunken)] text-[var(--w-green-text)]' : 'bg-[var(--w-sunken)] text-[var(--w-text-2)]')}>{t(`classroom.state_${c.joinState}` as WKey)}</span>
      </div>

      {c.manage && c.joinCode && (
        <section aria-labelledby="cls-code" className="w-card grid gap-4 p-4 md:grid-cols-[auto_1fr]">
          <div>
            <h3 id="cls-code" className="text-[12px] font-medium text-[var(--w-text-2)]">{t('classroom.code')}</h3>
            <div className="mt-1 font-mono text-[26px] font-semibold tracking-[0.12em]">{c.joinCodeDisplay}</div>
            <div className="text-[12px] text-[var(--w-text-2)]">{c.joinExpiresAt ? t('classroom.expires', { date: fmtDate(c.joinExpiresAt) }) : t('classroom.noExpiry')}</div>
          </div>
          <div className="min-w-0 space-y-2">
            <div className="text-[12px] font-medium text-[var(--w-text-2)]">{t('classroom.link')}</div>
            <div className="truncate rounded-[6px] bg-[var(--w-sunken)] px-2 py-1.5 font-mono text-[12.5px]">{c.joinUrl}</div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="w-btn w-btn-sm" onClick={() => copy(c.joinCodeDisplay ?? '')}><KeyRound size={13} aria-hidden="true" /><span className="ml-1">{t('classroom.copyCode')}</span></button>
              <button type="button" className="w-btn w-btn-sm" onClick={() => copy(c.joinUrl ?? '')}><Copy size={13} aria-hidden="true" /><span className="ml-1">{t('classroom.copyLink')}</span></button>
              <button type="button" className="w-btn w-btn-sm" onClick={() => setConfirmCode(true)}><RefreshCw size={13} aria-hidden="true" /><span className="ml-1">{t('classroom.newCode')}</span></button>
              <button type="button" className="w-btn w-btn-sm" disabled={toggleJoin.isPending} onClick={() => toggleJoin.mutate(!c.joinOpen)}>{c.joinOpen ? t('classroom.closeJoin') : t('classroom.openJoin')}</button>
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="cls-groups">
        <h3 id="cls-groups" className="mb-2 text-[15px] font-semibold">{t('classroom.groups')} <span className="w-count">{c.groups.length}</span></h3>
        {!c.groups.length ? <p className="text-[13px] text-[var(--w-text-2)]">{t('classroom.noGroups')}</p> : (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {c.groups.map((g) => (
              <li key={g.id} className={cn('w-card flex min-w-0 items-center gap-3 p-3', c.me?.groupId === g.id && 'ring-1 ring-[var(--w-accent-border)]')}>
                <Users size={16} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{g.name}</div>
                  <div className="text-[12px] tabular-nums text-[var(--w-text-2)]">{t('classroom.membersOf', { n: g.members, max: c.maxGroupSize })}</div>
                </div>
                {g.project && (c.manage || c.me?.groupId === g.id) && <Link href={g.project.href} className="w-btn w-btn-sm">{t('classroom.openProject')}<ArrowUpRight size={13} aria-hidden="true" /></Link>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {c.manage && c.students && (
        <section aria-labelledby="cls-roster">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 id="cls-roster" className="text-[15px] font-semibold">{t('classroom.roster')} <span className="w-count">{c.students.length}</span></h3>
            <div className="flex gap-2">
              <button type="button" data-testid="ctw5-import" className="w-btn w-btn-sm" onClick={() => setImportOpen(true)}><FileUp size={13} aria-hidden="true" /><span className="ml-1">{t('classroom.importRoster')}</span></button>
              <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={!c.students.length || c.joinState !== 'OK'} onClick={() => setInviteOpen(true)}><Mail size={13} aria-hidden="true" /><span className="ml-1">{t('classroom.invite')}</span></button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)]">
            <table className="w-full min-w-[640px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[var(--w-border)] text-left text-[12px] text-[var(--w-text-2)]">
                  <th scope="col" className="px-3 py-2 font-medium">{t('classroom.studentCode')}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{t('classroom.fullName')}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{t('classroom.email')}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{t('classroom.colStatus')}</th>
                  <th scope="col" className="px-3 py-2 font-medium"><span className="sr-only">{t('classroom.remove')}</span></th>
                </tr>
              </thead>
              <tbody>
                {c.students.map((s) => (
                  <tr key={s.id} className="border-b border-[var(--w-border)] last:border-0">
                    <td className="px-3 py-2 tabular-nums">{s.studentCode ?? '—'}</td>
                    <td className="px-3 py-2">{s.fullName ?? s.user?.displayName ?? '—'}</td>
                    <td className="max-w-[240px] truncate px-3 py-2 text-[var(--w-text-2)]">{s.email ?? '—'}</td>
                    <td className="px-3 py-2 text-[12px]">
                      {s.groupId ? t('classroom.inGroup', { name: groupName(s.groupId) ?? '' })
                        : s.joinedAt ? <span className="text-[var(--w-green-text)]">{t('classroom.status_joined')}</span>
                          : s.invitedAt ? <span className="text-[var(--w-text-2)]">{t('classroom.status_invited', { date: fmtShortDate(s.invitedAt) })}</span>
                            : <span className="text-[var(--w-text-2)]">{t('classroom.status_notInvited')}</span>}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {!s.groupId && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${t('classroom.remove')} ${s.fullName ?? s.email ?? ''}`} onClick={() => setRemoving({ id: s.id, name: s.fullName ?? s.email ?? '' })}><Trash2 size={13} /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {c.manage && (
        <>
          <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} classId={id} />
          <InviteDialog open={inviteOpen} onClose={() => setInviteOpen(false)} classId={id} />
        </>
      )}
      <ConfirmDialog open={confirmCode} onClose={() => setConfirmCode(false)} title={t('classroom.newCode')} body={t('classroom.newCodeConfirm')} confirmLabel={t('classroom.newCode')} onConfirm={() => newCode.mutate()} pending={newCode.isPending} />
      <ConfirmDialog open={!!removing} onClose={() => setRemoving(null)} title={t('classroom.remove')} body={removing ? t('classroom.removeConfirm', { name: removing.name }) : ''} confirmLabel={t('classroom.remove')} onConfirm={() => removing && remove.mutate(removing.id)} pending={remove.isPending} />
    </div>
  );
}

// ─── Trang ─────────────────────────────────────────────────────

function ClassCard({ c }: { c: ClassListItem }) {
  const { t } = useWT();
  return (
    <li className="min-w-0">
      <Link href={`/work/classes?id=${c.id}`} className="w-card flex h-full items-start gap-3 p-4 hover:bg-[var(--w-hover)]">
        <School size={18} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">{c.name}</div>
          <div className="text-[12px] text-[var(--w-text-2)]">{subjectLabel(c.subject)} · {c.classCode} · {c.term} · {t(`classroom.role_${c.role}` as WKey)}</div>
          <div className="mt-1 text-[12px] text-[var(--w-text-2)]">
            {c.role === 'STUDENT'
              ? (c.group ? t('classroom.yourGroup', { name: c.group.name }) : t('classroom.noGroupYet'))
              : `${t('classroom.groupsCount', { count: c.groups ?? 0 })} · ${t('classroom.studentsCount', { count: c.students ?? 0 })}`}
          </div>
        </div>
      </Link>
    </li>
  );
}

function ClassesInner() {
  const { t } = useWT();
  const router = useRouter();
  const pathname = usePathname() ?? '/work/classes';
  const search = useSearchParams();
  const joinParam = search?.get('join') ?? '';
  const idParam = Number(search?.get('id')) || 0;
  const [code, setCode] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const list = useQuery({ queryKey: teachingKeys.classes, queryFn: teachingApi.classes, enabled: !joinParam && !idParam });
  useEffect(() => { if (joinParam) setCode(joinParam); }, [joinParam]);
  const go = useCallback((params: Record<string, string | null>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) p.set(k, v);
    const s = p.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  }, [router, pathname]);

  const header = <PageHeader title={t('classroom.title')} sub={t('classroom.sub')} actions={<button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setCreateOpen(true)}><Plus size={14} aria-hidden="true" /><span className="ml-1">{t('classroom.createClass')}</span></button>} />;
  const dialogs = <CreateClassDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreated={(id) => { setCreateOpen(false); go({ id: String(id) }); }} />;

  if (idParam) return <div className="flex h-full flex-col">{header}<div className="min-h-0 flex-1 overflow-y-auto"><ClassView id={idParam} /></div>{dialogs}</div>;
  if (joinParam) {
    return (
      <div className="flex h-full flex-col">{header}
        <div className="min-h-0 flex-1 overflow-y-auto"><div className="w-page max-w-[760px]"><JoinPanel code={joinParam} onDone={() => go({})} /></div></div>
        {dialogs}
      </div>
    );
  }
  const data = list.data;
  return (
    <div className="flex h-full flex-col">
      {header}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="w-page space-y-6">
          <section aria-labelledby="cls-join" className="w-card p-4">
            <h2 id="cls-join" className="font-semibold">{t('classroom.joinTitle')}</h2>
            <p className="mb-3 text-[13px] text-[var(--w-text-2)]">{t('classroom.joinBody')}</p>
            <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); if (code.trim()) go({ join: code.trim() }); }}>
              <input className="w-input max-w-[220px] font-mono uppercase tracking-[0.1em]" value={code} onChange={(e) => setCode(e.target.value)} placeholder={t('classroom.codePh')} aria-label={t('classroom.codeLabel')} maxLength={16} autoComplete="off" />
              <button type="submit" className="w-btn w-btn-primary" disabled={!code.trim()}>{t('classroom.check')}</button>
            </form>
          </section>
          {list.isLoading && <PageLoading rows={3} />}
          {list.error && <EmptyState title={workError(list.error)} />}
          {data && !data.teaching.length && !data.enrolled.length && (
            <EmptyState icon={<School size={20} />} title={t('classroom.noClasses')} body={t('classroom.noClassesBody')} action={<button type="button" className="w-btn w-btn-primary" onClick={() => setCreateOpen(true)}>{t('classroom.createClass')}</button>} />
          )}
          {data && data.teaching.length > 0 && (
            <section aria-labelledby="cls-teaching">
              <h2 id="cls-teaching" className="mb-2 text-[15px] font-semibold">{t('classroom.teaching')}</h2>
              <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{data.teaching.map((c) => <ClassCard key={c.id} c={c} />)}</ul>
            </section>
          )}
          {data && data.enrolled.length > 0 && (
            <section aria-labelledby="cls-enrolled">
              <h2 id="cls-enrolled" className="mb-2 text-[15px] font-semibold">{t('classroom.enrolled')}</h2>
              <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{data.enrolled.map((c) => <ClassCard key={c.id} c={c} />)}</ul>
            </section>
          )}
        </div>
      </div>
      {dialogs}
    </div>
  );
}

export default function ClassesPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <ClassesInner />
    </Suspense>
  );
}
