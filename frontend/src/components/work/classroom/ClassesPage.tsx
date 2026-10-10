'use client';

/**
 * CTW đợt 5 (10/10/2026) — /work/classes: LUỒNG LỚP HỌC (D6).
 *   ?join=<mã>  — sinh viên / giảng viên mở link mời: xem lớp ⇒ vào nhóm có sẵn, lập nhóm mới (không gian + dự án theo
 *                 mẫu môn), hoặc nhận vai giảng viên (lớp do trưởng nhóm tạo, đúng email).
 *   ?id=<lớp>   — trang lớp có tab (đợt 9a, ClassShell.tsx): Stream · Classwork · People · Grades · Calendar
 *                 (&tab=…). People = mã lớp + nhóm + danh sách sinh viên của đợt 5 (tabs/PeopleTab.tsx).
 *   (không gì)  — lớp tôi phụ trách / lớp tôi học + ô nhập mã + nút tạo lớp.
 * Mọi hook đặt TRƯỚC lệnh return sớm.
 */

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, School, Users } from 'lucide-react';
import { workError } from '@/lib/work-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '@/components/work/ui';
import { PageHeader, Select } from '@/components/work/settings/shared';
import ClassShell from './ClassShell';
import { useWT, wt, type WKey } from '@/components/work/i18n';
import {
  CLASS_SUBJECTS, teachingApi, teachingKeys, type ClassInput, type ClassListItem, type ClassSubject, type JoinPreview,
} from '@/components/work/teaching/teachingApi';

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

  if (idParam) return <div className="flex h-full flex-col">{header}<div className="min-h-0 flex-1 overflow-y-auto"><ClassShell id={idParam} /></div>{dialogs}</div>;
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
