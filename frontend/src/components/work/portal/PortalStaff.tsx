'use client';

/**
 * Cổng khách — khối chỉ NHÂN VIÊN thấy (ở chế độ quản lý): xem trước như khách,
 * danh sách khách + mời bằng email (vai CLIENT, tái dùng lời mời /work/invite),
 * và tạo yêu cầu nghiệm thu UAT (hạng mục = thẻ đã chia sẻ).
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, MailPlus, ShieldCheck, Users } from 'lucide-react';
import { userName, workApi, workError, workPortalApi, workPortalKeys, type ProjectConfig } from '@/lib/work-api';
import { Dialog, Spinner, UserAvatar } from '../ui';
import { Select } from '../settings/shared';
import { wt } from '@/components/work/i18n';

function UatDialog({ pid, open, onClose, clients }: { pid: number; open: boolean; onClose: () => void; clients: Array<{ id: number; username: string; displayName: string | null; fullName: string | null; avatarUrl: string | null }> }) {
  const qc = useQueryClient();
  const items = useQuery({ queryKey: workPortalKeys.tab(pid, 'requests', false), queryFn: () => workPortalApi.requests(pid, false), enabled: open });
  const docs = useQuery({ queryKey: workPortalKeys.tab(pid, 'documents', false), queryFn: () => workPortalApi.documents(pid, false), enabled: open });
  const versions = useQuery({ queryKey: ['work', 'project', pid, 'versions'], queryFn: () => workApi.versions(pid), enabled: open });
  const [picked, setPicked] = useState<number[]>([]);
  const [pages, setPages] = useState<number[]>([]);
  const [approvers, setApprovers] = useState<number[]>([]);
  const [versionId, setVersionId] = useState<number | ''>('');
  const [title, setTitle] = useState('');
  const [env, setEnv] = useState('');
  const [build, setBuild] = useState('');
  const toggle = (arr: number[], v: number) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const create = useMutation({
    mutationFn: () => workPortalApi.createUat(pid, {
      title: title || undefined, issueNumbers: picked, pageNumbers: pages, approverIds: approvers.length ? approvers : clients.map((c) => c.id),
      versionId: versionId || null, environment: env || null, build: build || null,
    }),
    onSuccess: () => { toast.success(wt('portal.uatRequested')); qc.invalidateQueries({ queryKey: workPortalKeys.all(pid) }); onClose(); setPicked([]); setPages([]); },
    onError: (err) => toast.error(workError(err, wt('portal.uatFailed'))),
  });
  return (
    <Dialog open={open} onClose={onClose} title={wt('portal.requestUat')} width={640} footer={(
      <>
        <button type="button" className="w-btn w-btn-ghost" onClick={onClose}>{wt('common.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!picked.length || !clients.length || create.isPending} onClick={() => create.mutate()} data-testid="portal-uat-send">
          {create.isPending && <Spinner size={12} />} {wt('portal.sendToClient')}
        </button>
      </>
    )}>
      <div className="space-y-4 text-[13px]">
        {!clients.length && <p className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2">{wt('portal.inviteFirst')}</p>}
        <label className="block"><span className="mb-1 block text-[12.5px] font-medium">{wt('portal.titleOpt')}</span><input className="w-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={wt('portal.uatTitlePh')} /></label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block"><span className="mb-1 block text-[12.5px] font-medium">{wt('portal.releaseMilestone')}</span>
            <Select value={versionId} onChange={(e) => setVersionId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">{wt('common.none')}</option>
              {(versions.data ?? []).map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </Select>
          </label>
          <label className="block"><span className="mb-1 block text-[12.5px] font-medium">{wt('tests.environment')}</span><input className="w-input" value={env} onChange={(e) => setEnv(e.target.value)} placeholder="Staging" /></label>
          <label className="block"><span className="mb-1 block text-[12.5px] font-medium">{wt('tests.build')}</span><input className="w-input" value={build} onChange={(e) => setBuild(e.target.value)} placeholder="1.0.0-rc1" /></label>
        </div>
        <fieldset>
          <legend className="mb-1 text-[12.5px] font-medium">{wt('portal.itemsAccept')}</legend>
          <div className="max-h-[200px] space-y-0.5 overflow-y-auto rounded-[8px] border border-[var(--w-border)] p-1.5" data-testid="portal-uat-items-pick">
            {(items.data?.items ?? []).map((i) => (
              <label key={i.number} className="flex cursor-pointer items-center gap-2 rounded-[5px] px-1.5 py-1 hover:bg-[var(--w-hover)]">
                <input type="checkbox" checked={picked.includes(i.number)} onChange={() => setPicked((p) => toggle(p, i.number))} />
                <span className="font-mono text-[12px] text-[var(--w-accent-text)]">{i.key}</span><span className="min-w-0 flex-1 truncate">{i.title}</span>
              </label>
            ))}
            {items.data && !items.data.items.length && <p className="px-1.5 py-1 text-[var(--w-text-3)]">{wt('portal.shareIssuesFirst')}</p>}
          </div>
        </fieldset>
        {(docs.data?.pages.length ?? 0) > 0 && (
          <fieldset>
            <legend className="mb-1 text-[12.5px] font-medium">{wt('portal.attachDocs')}</legend>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {docs.data!.pages.map((p) => (
                <label key={p.number} className="flex items-center gap-1.5"><input type="checkbox" checked={pages.includes(p.number)} onChange={() => setPages((x) => toggle(x, p.number))} />{p.title}</label>
              ))}
            </div>
          </fieldset>
        )}
        {clients.length > 1 && (
          <fieldset>
            <legend className="mb-1 text-[12.5px] font-medium">{wt('portal.whoSigns')}</legend>
            <div className="flex flex-wrap gap-x-4 gap-y-1">{clients.map((c) => <label key={c.id} className="flex items-center gap-1.5"><input type="checkbox" checked={approvers.includes(c.id)} onChange={() => setApprovers((x) => toggle(x, c.id))} />{userName(c)}</label>)}</div>
          </fieldset>
        )}
      </div>
    </Dialog>
  );
}

export function StaffPanel({ config, pid, onPreview }: { config: ProjectConfig; pid: number; onPreview: () => void }) {
  const qc = useQueryClient();
  const clients = useQuery({ queryKey: [...workPortalKeys.all(pid), 'clients'], queryFn: () => workPortalApi.clients(pid) });
  const [email, setEmail] = useState('');
  const [uat, setUat] = useState(false);
  const invite = useMutation({
    mutationFn: () => workPortalApi.invite(pid, email.split(/[\s,;]+/).map((e) => e.trim()).filter(Boolean)),
    onSuccess: (r) => {
      toast.success(r.map((x) => `${x.email}: ${x.status === 'INVITED' ? wt('portal.invSent') : x.status === 'ADDED' ? wt('portal.added') : wt('portal.alreadyMember')}`).join(' · '));
      setEmail(''); qc.invalidateQueries({ queryKey: [...workPortalKeys.all(pid), 'clients'] });
    },
    onError: (err) => toast.error(workError(err, wt('portal.inviteFailed'))),
  });
  const isAdmin = config.role === 'ADMIN';
  const list = clients.data?.clients ?? [];
  return (
    <section className="w-card mb-5 p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Users size={15} className="text-[var(--w-text-3)]" />
        <h2 className="w-section-title">{wt('portal.clients')}</h2>
        <span className="text-[12px] text-[var(--w-text-3)]">{list.length ? wt('portal.withAccess', { n: list.length }) : wt('portal.noAccess')}</span>
        <div className="ml-auto flex flex-wrap gap-2">
          {config.permissions.createApprovals && (
            <button type="button" className="w-btn w-btn-sm" onClick={() => setUat(true)} data-testid="portal-request-uat"><ShieldCheck size={13} /> {wt('portal.requestUat')}</button>
          )}
          <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={onPreview} data-testid="portal-preview"><Eye size={13} /> {wt('portal.previewAsClient')}</button>
        </div>
      </div>
      {list.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {list.map((c) => (
            <li key={c.id} className="flex items-center gap-1.5 rounded-full border border-[var(--w-border)] py-0.5 pl-0.5 pr-2.5 text-[12.5px]">
              <UserAvatar user={c} size={20} />{userName(c)}{c.email && <span className="text-[var(--w-text-3)] max-sm:hidden">{c.email}</span>}
            </li>
          ))}
          {(clients.data?.pendingInvites ?? []).map((i) => (
            <li key={`i${i.id}`} className="rounded-full border border-dashed border-[var(--w-border-strong)] px-2.5 py-0.5 text-[12.5px] text-[var(--w-text-3)]">{wt('portal.invited', { e: i.email })}</li>
          ))}
        </ul>
      )}
      {isAdmin && (
        <form className="mt-3 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); if (email.trim()) invite.mutate(); }}>
          <input className="w-input min-w-0 flex-1" type="text" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@company.com" aria-label={wt('portal.clientEmail')} data-testid="portal-invite-email" />
          <button type="submit" className="w-btn" disabled={!email.trim() || invite.isPending}><MailPlus size={13} /> {wt('portal.inviteClient')}</button>
        </form>
      )}
      <UatDialog pid={pid} open={uat} onClose={() => setUat(false)} clients={list} />
    </section>
  );
}
