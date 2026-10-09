'use client';

/**
 * Cài đặt dự án → Public links: tạo / thu hồi link xem CHỈ ĐỌC không cần
 * tài khoản (cho giảng viên, khách hàng). Trang xem: /work/share/<token>.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, Copy, ExternalLink, Link2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, type ProjectConfig, type ShareLink, type ShareOptions } from '@/lib/work-api';
import { Dialog, EmptyState, Field, formatDate, relativeTime, Spinner } from '../ui';
import { ConfirmDialog, ReadOnlyNotice, Section, Select } from './shared';
import { wt } from '@/components/work/i18n';

const SECTION_LABEL: Array<{ key: keyof ShareOptions; label: string; hint: string }> = [
  { key: 'board', get label() { return wt('share.secBoard'); }, get hint() { return wt('share.secBoardH'); } },
  { key: 'backlog', get label() { return 'Backlog'; }, get hint() { return wt('share.secBacklogH'); } },
  { key: 'reports', get label() { return wt('desk.reports'); }, get hint() { return wt('share.secReportsH'); } },
  { key: 'tests', get label() { return wt('share.secTests'); }, get hint() { return wt('share.secTestsH'); } },
];

const EXPIRY: Array<{ value: string; label: string }> = [
  { value: '', get label() { return wt('dev.never'); } },
  { value: '7', get label() { return wt('common.days', { count: 7 }); } },
  { value: '30', get label() { return wt('common.days', { count: 30 }); } },
  { value: '90', get label() { return wt('common.days', { count: 90 }); } },
];

export async function copyText(text: string, what = wt('share.linkWord')) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(wt('git.xCopied', { x: what }));
  } catch {
    toast.error(wt('share.copyManual'));
  }
}

function sectionsOf(o: ShareOptions) {
  const s = SECTION_LABEL.filter((x) => o[x.key]).map((x) => x.label);
  return s.length ? s.join(', ') : '—';
}

function CreateLinkDialog({ open, onClose, pid, onCreated }: { open: boolean; onClose: () => void; pid: number; onCreated: (l: ShareLink) => void }) {
  const [label, setLabel] = useState('');
  const [opts, setOpts] = useState<ShareOptions>({ board: true, backlog: true, reports: true, tests: false, descriptions: false });
  const [expiry, setExpiry] = useState('30');

  useEffect(() => {
    if (!open) return;
    setLabel('');
    setOpts({ board: true, backlog: true, reports: true, tests: false, descriptions: false });
    setExpiry('30');
  }, [open]);

  const anySection = opts.board || opts.backlog || opts.reports || opts.tests;
  const create = useMutation({
    mutationFn: () => workApi.createShareLink(pid, { label: label.trim() || null, options: { ...opts, descriptions: opts.descriptions && (opts.board || opts.backlog) }, expiresInDays: expiry ? Number(expiry) : null }),
    onSuccess: (l) => { onCreated(l); onClose(); },
    onError: (err) => toast.error(workError(err, wt('share.createFailed'))),
  });

  return (
    <Dialog open={open} onClose={onClose} title={wt('share.createTitle')} width={500}>
      <form onSubmit={(e) => { e.preventDefault(); if (anySection && !create.isPending) create.mutate(); }}>
        <Field label={wt('share.label')} hint={wt('share.labelHint')}>
          <input className="w-input" value={label} maxLength={100} onChange={(e) => setLabel(e.target.value)} placeholder={wt('share.labelPh')} autoFocus />
        </Field>

        <div className="mb-4">
          <label className="w-label">{wt('share.sections')}</label>
          <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
            {SECTION_LABEL.map((s) => (
              <label key={s.key} className="flex cursor-pointer items-start gap-2.5 border-b border-[var(--w-border)] px-3 py-2 last:border-b-0 hover:bg-[var(--w-hover)]">
                <input type="checkbox" className="mt-0.5 accent-[var(--w-accent)]" checked={opts[s.key]} onChange={(e) => setOpts((o) => ({ ...o, [s.key]: e.target.checked }))} />
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium">{s.label}</span>
                  <span className="block text-[12px] text-[var(--w-text-3)]">{s.hint}</span>
                </span>
              </label>
            ))}
          </div>
          {!anySection && <p className="mt-1 text-[12px] text-[var(--w-red)]">{wt('share.chooseOne')}</p>}
          <label className={cn('mt-3 flex cursor-pointer items-start gap-2.5', !(opts.board || opts.backlog) && 'cursor-not-allowed opacity-60')}>
            <input
              type="checkbox"
              className="mt-0.5 accent-[var(--w-accent)]"
              disabled={!(opts.board || opts.backlog)}
              checked={opts.descriptions && (opts.board || opts.backlog)}
              onChange={(e) => setOpts((o) => ({ ...o, descriptions: e.target.checked }))}
            />
            <span className="min-w-0">
              <span className="block text-[13px] font-medium">{wt('share.inclDesc')}</span>
              <span className="block text-[12px] text-[var(--w-text-3)]">{wt('share.inclDescHint')}</span>
            </span>
          </label>
        </div>

        <Field label={wt('settings.expires')}>
          <Select value={expiry} onChange={(e) => setExpiry(e.target.value)}>
            {EXPIRY.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
          </Select>
        </Field>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button>
          <button type="submit" className="w-btn w-btn-primary" disabled={!anySection || create.isPending}>
            {create.isPending && <Spinner size={12} />}
            {wt('share.createLink')}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

function LinkRow({ link, canEdit, onRevoke }: { link: ShareLink; canEdit: boolean; onRevoke: () => void }) {
  return (
    <div className="flex flex-col gap-2 border-b border-[var(--w-border)] px-3 py-3 last:border-b-0 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-[13px] font-medium">{link.label || wt('share.untitledLink')}</span>
          {link.expired ? (
            <span className="rounded-[4px] border border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] px-1.5 text-[11px] font-medium leading-[18px] text-[var(--w-red)]">{wt('share.expired')}</span>
          ) : link.options.descriptions && (link.options.board || link.options.backlog) ? (
            <span className="rounded-[4px] border border-[var(--w-border-strong)] px-1.5 text-[11px] leading-[18px] text-[var(--w-text-2)]">{wt('share.withDesc')}</span>
          ) : null}
        </div>
        <div className="mt-0.5 text-[12px] text-[var(--w-text-2)]">{sectionsOf(link.options)}</div>
        <div className="mt-0.5 flex flex-wrap gap-x-2 text-[12px] text-[var(--w-text-3)]">
          <span>{wt('share.createdOn', { d: formatDate(link.createdAt) })}</span>
          <span>·</span>
          <span>{link.expiresAt ? `${link.expired ? wt('share.expired') : wt('settings.expires')} ${formatDate(link.expiresAt)}` : wt('dev.neverExpires')}</span>
          <span>·</span>
          <span>{wt('share.views', { count: link.viewCount })}{link.lastViewedAt ? wt('share.lastViewed', { t: relativeTime(link.lastViewedAt) }) : ''}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button type="button" className="w-btn w-btn-sm" onClick={() => copyText(link.url)} disabled={link.expired}>
          <Copy size={13} /> {wt('common.copyLink')}
        </button>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className={cn('w-btn w-btn-ghost w-btn-icon w-btn-sm', link.expired && 'pointer-events-none opacity-50')} aria-label={wt('share.openShared')} title={wt('share.openShared')}>
          <ExternalLink size={13} />
        </a>
        {canEdit && (
          <button type="button" className="w-btn w-btn-sm w-btn-danger" onClick={onRevoke}>{wt('settings.revoke')}</button>
        )}
      </div>
    </div>
  );
}

export default function ProjectShare({ config }: { config: ProjectConfig; slug: string }) {
  const canEdit = config.permissions.settings;
  const qc = useQueryClient();
  const key = ['work', 'project', config.id, 'share-links'] as const;
  const [creating, setCreating] = useState(false);
  const [revoking, setRevoking] = useState<ShareLink | null>(null);
  const [justCreated, setJustCreated] = useState<ShareLink | null>(null);

  const q = useQuery({ queryKey: key, queryFn: () => workApi.shareLinks(config.id), enabled: canEdit });

  const revoke = useMutation({
    mutationFn: (id: number) => workApi.revokeShareLink(config.id, id),
    onSuccess: (_d, id) => {
      toast.success(wt('share.revoked'));
      setRevoking(null);
      if (justCreated?.id === id) setJustCreated(null);
      qc.invalidateQueries({ queryKey: key });
    },
    onError: (err) => toast.error(workError(err, wt('share.revokeFailed'))),
  });

  const intro = (
    <>
      {wt('share.introA')} <span className="font-medium text-[var(--w-text)]">{wt('share.noAccount')}</span>.
      {wt('share.introB')}
    </>
  );

  if (!canEdit) {
    return (
      <Section title={wt('share.publicLinks')} description={intro}>
        <ReadOnlyNotice>{wt('share.onlyAdmins')}</ReadOnlyNotice>
      </Section>
    );
  }

  const links = q.data ?? [];

  return (
    <Section
      title={wt('share.publicLinks')}
      description={intro}
      action={
        <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setCreating(true)}>
          <Plus size={14} /> {wt('share.createLink')}
        </button>
      }
    >
      {justCreated && (
        <div className="mb-4 rounded-[8px] border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] px-3 py-3">
          <div className="mb-2 flex items-center gap-1.5 text-[13px] font-medium">
            <Check size={14} className="text-[var(--w-green)]" /> {wt('share.created')}
          </div>
          <div className="flex gap-2">
            <input className="w-input min-w-0 flex-1 !bg-[var(--w-panel)] font-mono !text-[12px]" readOnly value={justCreated.url} onFocus={(e) => e.currentTarget.select()} aria-label={wt('share.publicLink')} />
            <button type="button" className="w-btn w-btn-primary shrink-0" onClick={() => copyText(justCreated.url)}><Copy size={13} /> {wt('common.copy')}</button>
          </div>
        </div>
      )}

      {q.isLoading ? (
        <div className="flex justify-center py-10"><Spinner size={18} /></div>
      ) : q.error ? (
        <EmptyState title={wt('share.loadFailed')} body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>{wt('common.tryAgain')}</button>} />
      ) : !links.length ? (
        <div className="flex flex-col items-center rounded-[8px] border border-dashed border-[var(--w-border)] px-6 py-10 text-center">
          <Link2 size={20} className="mb-2 text-[var(--w-text-3)]" />
          <div className="text-[13px] font-medium">{wt('share.noActive')}</div>
          <p className="mt-1 max-w-[380px] text-[12px] text-[var(--w-text-3)]">{wt('share.noActiveBody')}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
          {links.map((l) => <LinkRow key={l.id} link={l} canEdit={canEdit} onRevoke={() => setRevoking(l)} />)}
        </div>
      )}

      <CreateLinkDialog
        open={creating}
        onClose={() => setCreating(false)}
        pid={config.id}
        onCreated={(l) => {
          toast.success(wt('share.createdToast'));
          setJustCreated(l);
          qc.invalidateQueries({ queryKey: key });
        }}
      />
      <ConfirmDialog
        open={!!revoking}
        onClose={() => setRevoking(null)}
        title={wt('share.revokeQ')}
        body={wt('share.revokeBody', { x: revoking?.label || wt('share.thisLink') })}
        confirmLabel={wt('share.revokeLink')}
        pending={revoke.isPending}
        onConfirm={() => revoking && revoke.mutate(revoking.id)}
      />
    </Section>
  );
}
