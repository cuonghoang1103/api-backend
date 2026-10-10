'use client';

/**
 * CTW đợt 6b (R15) — Prototype / wireframe gắn màn (Requirements › Screens; Wiegers ch.15): ảnh tải lên hoặc link Figma /
 * Excalidraw / Penpot / Miro. Gửi xác nhận ⇒ giảng viên hoặc ADMIN dự án duyệt ngay ở đây, KHÁCH duyệt qua link không cần
 * tài khoản. Chỉ bản đã xác nhận mới vào SRS §5.1 — "xác nhận trước khi code". Đổi thiết kế ⇒ về nháp, link khách cũ chết.
 */

import { useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Check, Copy, ExternalLink, ImagePlus, Link2, Plus, Send, Trash2, Undo2 } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { workDocs3aApi } from '@/lib/work-docs3a-api';
import { workSwr6bApi, workSwr6bKeys, type Mockup } from '@/lib/work-swr6b-api';
import { useWT, wt, type WKey } from '@/components/work/i18n';
import KpiTile, { KpiRow } from '../KpiTile';
import { Dialog, EmptyState, Field, PageLoading, publicOrigin, Spinner } from '../ui';
import { Chip, Note, TabIntro, TextArea, use6bRefresh } from './shared';

export const MOCKUP_STATUS_KEY: Record<Mockup['status'], WKey> = { DRAFT: 'common.draft', SUBMITTED: 'srsx.pkSubmitted', APPROVED: 'srsx.pkApproved', CHANGES: 'srsx.pkChanges' };
export const MOCKUP_TONE: Record<Mockup['status'], 'muted' | 'yellow' | 'green' | 'orange'> = { DRAFT: 'muted', SUBMITTED: 'yellow', APPROVED: 'green', CHANGES: 'orange' };
const ROLE_KEY: Record<string, WKey> = { LECTURER: 'srsx.byLecturer', CLIENT: 'srsx.byClient', ADMIN: 'srsx.byAdmin' };

export default function PrototypesTab({ pid, base }: { pid: number; base: string }) {
  const { fmtDateTime } = useWT();
  const refresh = use6bRefresh(pid);
  const q = useQuery({ queryKey: workSwr6bKeys.mockups(pid), queryFn: () => workSwr6bApi.mockups(pid) });
  const [adding, setAdding] = useState<number | null>(null);
  const [kind, setKind] = useState<'IMAGE' | 'LINK'>('LINK');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [review, setReview] = useState<{ m: Mockup; decision: 'APPROVED' | 'CHANGES' } | null>(null);
  const [note, setNote] = useState('');
  const add = useMutation({
    mutationFn: async () => {
      if (kind === 'IMAGE') {
        const img = await workDocs3aApi.uploadImage(pid, file!, file!.name);
        return workSwr6bApi.addMockup(pid, { screenId: adding!, kind, imageId: img.id, title: title.trim() || null });
      }
      return workSwr6bApi.addMockup(pid, { screenId: adding!, kind, url: url.trim(), title: title.trim() || null });
    },
    onSuccess: () => { refresh(); setAdding(null); setUrl(''); setTitle(''); setFile(null); toast.success(wt('common.saved')); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  const submit = useMutation({
    mutationFn: (x: { id: number; share: boolean }) => workSwr6bApi.submitMockup(pid, x.id, x.share),
    onSuccess: (m, x) => {
      refresh();
      if (x.share && m.reviewPath) { void navigator.clipboard?.writeText(`${publicOrigin()}${m.reviewPath}`); toast.success(wt('srsx.linkCopied')); } else toast.success(wt('srsx.submitted'));
    },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  const decide = useMutation({
    mutationFn: () => workSwr6bApi.reviewMockup(pid, review!.m.id, { decision: review!.decision, note: note.trim() || null }),
    onSuccess: () => { refresh(); setReview(null); setNote(''); toast.success(wt('common.saved')); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  const del = useMutation({ mutationFn: (id: number) => workSwr6bApi.deleteMockup(pid, id), onSuccess: () => { refresh(); toast.success(wt('swr.deleted')); }, onError: (e) => toast.error(workError(e, wt('common.couldNotDelete'))) });

  if (q.isLoading) return <PageLoading rows={5} />;
  if (!q.data) return <EmptyState title={wt('swr.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const data = q.data;
  return (
    <div className="flex flex-col gap-4">
      <TabIntro text={wt('srsx.protoIntro')} />
      <KpiRow label={wt('srsx.protoKpis')}>
        <KpiTile label={wt('srsx.kScreens')} value={data.counts.screens} />
        <KpiTile label={wt('srsx.kWithProto')} value={data.counts.withPrototype} tone={data.counts.withPrototype < data.counts.screens ? 'yellow' : 'green'} />
        <KpiTile label={wt('srsx.kApproved')} value={data.counts.approved} tone={data.counts.approved ? 'green' : 'muted'} />
      </KpiRow>
      {!data.screens.length ? <EmptyState title={wt('srsx.noScreens')} body={wt('srsx.noScreensBody')} action={<a className="w-btn w-btn-sm" href={`${base}/requirements`}>{wt('srsx.openScreens')}</a>} /> : (
        <ul className="flex flex-col gap-3">
          {data.screens.map((s) => (
            <li key={s.id} className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="flex-1 text-[14px] font-semibold">{s.name}{s.feature && <span className="ml-2 text-[12px] font-normal text-[var(--w-text-2)]">{s.feature}</span>}</h2>
                {s.approved ? <Chip tone="green">{wt('srsx.readyToCode')}</Chip> : <Chip tone="muted">{wt('srsx.notConfirmed')}</Chip>}
                {data.canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => { setAdding(s.id); setKind('LINK'); }}><Plus size={13} /> {wt('srsx.addProto')}</button>}
              </div>
              {!s.mockups.length ? <p className="mt-1 text-[12.5px] text-[var(--w-text-3)]">{wt('srsx.noProto')}</p> : (
                <ul className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {s.mockups.map((m) => (
                    <li key={m.id} className="flex flex-col gap-1.5 rounded-[8px] border border-[var(--w-border)] p-2">
                      {m.kind === 'IMAGE' && m.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <a href={m.image} target="_blank" rel="noreferrer"><img src={m.image} alt={`${s.name} — ${m.title ?? wt('srsx.prototype')}`} className="max-h-[160px] w-full rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] object-contain" /></a>
                      ) : (
                        <a href={m.url ?? '#'} target="_blank" rel="noreferrer" className="flex h-[72px] items-center justify-center gap-2 rounded-[6px] border border-dashed border-[var(--w-border)] bg-[var(--w-sunken)] text-[13px] text-[var(--w-accent-text)] hover:underline">
                          <ExternalLink size={14} aria-hidden="true" /> {m.provider && m.provider !== 'OTHER' ? m.provider.charAt(0) + m.provider.slice(1).toLowerCase() : wt('srsx.openLink')}
                        </a>
                      )}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="flex-1 truncate text-[13px] font-medium">{m.title ?? (m.kind === 'IMAGE' ? wt('srsx.image') : wt('srsx.link'))}</span>
                        <Chip tone={MOCKUP_TONE[m.status]}>{wt(MOCKUP_STATUS_KEY[m.status])}</Chip>
                      </div>
                      {m.reviewedAt && <p className="text-[12px] text-[var(--w-text-2)]">{wt('srsx.reviewedBy', { name: m.reviewerName ?? '—', role: wt(ROLE_KEY[m.reviewerRole ?? ''] ?? 'srsx.byAdmin'), at: fmtDateTime(m.reviewedAt) })}{m.reviewNote ? ` — “${m.reviewNote}”` : ''}</p>}
                      {m.shared && m.status === 'SUBMITTED' && m.reviewPath && <p className="flex items-center gap-1 break-all text-[12px] text-[var(--w-text-2)]"><Link2 size={12} aria-hidden="true" />{wt('srsx.waitingClient')}</p>}
                      <div className="flex flex-wrap gap-1">
                        {data.canEdit && (m.status === 'DRAFT' || m.status === 'CHANGES') && <button type="button" className="w-btn w-btn-sm" onClick={() => submit.mutate({ id: m.id, share: false })}><Send size={12} /> {wt('srsx.submit')}</button>}
                        {data.canShare && m.status !== 'APPROVED' && <button type="button" className="w-btn w-btn-sm" onClick={() => submit.mutate({ id: m.id, share: true })}><Copy size={12} /> {wt('srsx.clientLink')}</button>}
                        {data.canReview && m.status === 'SUBMITTED' && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setReview({ m, decision: 'APPROVED' })}><Check size={12} /> {wt('srsx.approve')}</button>}
                        {data.canReview && m.status === 'SUBMITTED' && <button type="button" className="w-btn w-btn-sm" onClick={() => setReview({ m, decision: 'CHANGES' })}><Undo2 size={12} /> {wt('srsx.requestChanges')}</button>}
                        {data.canShare && <button type="button" className="w-btn w-btn-sm w-btn-ghost w-btn-icon ml-auto" aria-label={`${wt('common.delete')} ${m.title ?? ''}`} onClick={() => window.confirm(wt('swr.deleteQ', { name: m.title ?? s.name })) && del.mutate(m.id)}><Trash2 size={13} /></button>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
      {!data.canReview && <Note>{wt('srsx.reviewWho')}</Note>}

      <Dialog open={adding !== null} onClose={() => setAdding(null)} title={wt('srsx.addProto')} width={520}
        footer={<><button type="button" className="w-btn" onClick={() => setAdding(null)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={add.isPending || (kind === 'LINK' ? !/^https?:\/\//i.test(url.trim()) : !file)} onClick={() => add.mutate()}>{add.isPending && <Spinner size={12} />} {wt('common.add')}</button></>}>
        <div className="mb-3 flex gap-2" role="radiogroup" aria-label={wt('srsx.protoKind')}>
          <button type="button" role="radio" aria-checked={kind === 'LINK'} className={`w-btn w-btn-sm ${kind === 'LINK' ? 'w-btn-on' : ''}`} onClick={() => setKind('LINK')}><Link2 size={13} /> {wt('srsx.link')}</button>
          <button type="button" role="radio" aria-checked={kind === 'IMAGE'} className={`w-btn w-btn-sm ${kind === 'IMAGE' ? 'w-btn-on' : ''}`} onClick={() => setKind('IMAGE')}><ImagePlus size={13} /> {wt('srsx.image')}</button>
        </div>
        {kind === 'LINK' ? (
          <Field label={wt('srsx.designLink')} hint={wt('srsx.designLinkHint')}><input className="w-input" autoFocus value={url} maxLength={1000} placeholder="https://www.figma.com/design/…" onChange={(e) => setUrl(e.target.value)} /></Field>
        ) : (
          <Field label={wt('srsx.imageFile')} hint={wt('srsx.imageHint')}>
            <input ref={fileRef} className="w-input py-1" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </Field>
        )}
        <Field label={wt('srsx.protoTitle')}><input className="w-input" value={title} maxLength={200} placeholder={wt('srsx.protoTitlePh')} onChange={(e) => setTitle(e.target.value)} /></Field>
      </Dialog>

      <Dialog open={!!review} onClose={() => setReview(null)} title={review?.decision === 'APPROVED' ? wt('srsx.approve') : wt('srsx.requestChanges')} width={480}
        footer={<><button type="button" className="w-btn" onClick={() => setReview(null)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={decide.isPending || (review?.decision === 'CHANGES' && !note.trim())} onClick={() => decide.mutate()}>{decide.isPending && <Spinner size={12} />} {wt('common.save')}</button></>}>
        <TextArea id="mk-note" label={review?.decision === 'CHANGES' ? wt('srsx.whatChange') : wt('srsx.noteOptional')} value={note} rows={3} onChange={setNote} />
      </Dialog>
    </div>
  );
}
