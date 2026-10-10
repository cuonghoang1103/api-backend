'use client';

/**
 * CTW đợt 9a — tab PEOPLE của trang lớp (nội dung chuyển nguyên từ ClassView đợt 5): mã lớp + link (chép, đổi mã,
 * đóng/mở), các nhóm, danh sách sinh viên (nhập CSV/xlsx có xem trước ⇒ xác nhận; mời theo lô có xem trước ⇒ xác nhận).
 * Sinh viên chỉ thấy nhóm + số người (máy chủ không trả email/MSSV người khác).
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowUpRight, Copy, FileUp, KeyRound, Mail, RefreshCw, Trash2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Dialog, Spinner } from '@/components/work/ui';
import { ConfirmDialog } from '@/components/work/settings/shared';
import { useWT, wt, type WKey } from '@/components/work/i18n';
import {
  teachingApi, teachingKeys, type ClassDetail, type InvitePlan, type RosterPreview, type RosterSource,
} from '@/components/work/teaching/teachingApi';

async function copy(text: string) {
  try { await navigator.clipboard.writeText(text); toast.success(wt('classroom.copied')); } catch { toast.error(text); }
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


export default function PeopleTab({ cls: c }: { cls: ClassDetail }) {
  const { t, fmtDate, fmtShortDate } = useWT();
  const qc = useQueryClient();
  const id = c.id;
  const [importOpen, setImportOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [confirmCode, setConfirmCode] = useState(false);
  const [removing, setRemoving] = useState<{ id: number; name: string } | null>(null);
  const refresh = (n: ClassDetail) => qc.setQueryData(teachingKeys.cls(id), n);
  const newCode = useMutation({ mutationFn: () => teachingApi.newJoinCode(id, 30), onSuccess: (n) => { refresh(n); setConfirmCode(false); toast.success(t('classroom.newCodeDone')); }, onError: (err) => toast.error(workError(err)) });
  const toggleJoin = useMutation({ mutationFn: (open: boolean) => teachingApi.updateClass(id, { joinOpen: open }), onSuccess: refresh, onError: (err) => toast.error(workError(err)) });
  const remove = useMutation({ mutationFn: (sid: number) => teachingApi.removeStudent(id, sid), onSuccess: () => { setRemoving(null); toast.success(t('classroom.removed')); qc.invalidateQueries({ queryKey: teachingKeys.cls(id) }); }, onError: (err) => toast.error(workError(err)) });
  const groupName = (gid: number | null) => c.groups.find((g) => g.id === gid)?.name ?? null;
  return (
    <div className="space-y-5">
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
