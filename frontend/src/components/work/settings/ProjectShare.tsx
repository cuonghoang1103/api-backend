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

const SECTION_LABEL: Array<{ key: keyof ShareOptions; label: string; hint: string }> = [
  { key: 'board', label: 'Board', hint: 'Cards in the active sprint, by status' },
  { key: 'backlog', label: 'Backlog', hint: 'Open issues grouped by sprint' },
  { key: 'reports', label: 'Reports', hint: 'Progress totals, burndown and velocity' },
  { key: 'tests', label: 'Tests', hint: 'Test cycles with pass rates' },
];

const EXPIRY: Array<{ value: string; label: string }> = [
  { value: '', label: 'Never' },
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
];

export async function copyText(text: string, what = 'Link') {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${what} copied`);
  } catch {
    toast.error('Could not copy — select the text and copy it manually');
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
    onError: (err) => toast.error(workError(err, 'Could not create the link')),
  });

  return (
    <Dialog open={open} onClose={onClose} title="Create public link" width={500}>
      <form onSubmit={(e) => { e.preventDefault(); if (anySection && !create.isPending) create.mutate(); }}>
        <Field label="Label" hint="Only you and other project admins see this — e.g. “Lecturer — SWP391 review”.">
          <input className="w-input" value={label} maxLength={100} onChange={(e) => setLabel(e.target.value)} placeholder="Who is this link for?" autoFocus />
        </Field>

        <div className="mb-4">
          <label className="w-label">Sections to share</label>
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
          {!anySection && <p className="mt-1 text-[12px] text-[var(--w-red)]">Choose at least one section.</p>}
          <label className={cn('mt-3 flex cursor-pointer items-start gap-2.5', !(opts.board || opts.backlog) && 'cursor-not-allowed opacity-60')}>
            <input
              type="checkbox"
              className="mt-0.5 accent-[var(--w-accent)]"
              disabled={!(opts.board || opts.backlog)}
              checked={opts.descriptions && (opts.board || opts.backlog)}
              onChange={(e) => setOpts((o) => ({ ...o, descriptions: e.target.checked }))}
            />
            <span className="min-w-0">
              <span className="block text-[13px] font-medium">Include issue descriptions</span>
              <span className="block text-[12px] text-[var(--w-text-3)]">Off by default — descriptions often contain internal notes.</span>
            </span>
          </label>
        </div>

        <Field label="Expires">
          <Select value={expiry} onChange={(e) => setExpiry(e.target.value)}>
            {EXPIRY.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
          </Select>
        </Field>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="w-btn w-btn-primary" disabled={!anySection || create.isPending}>
            {create.isPending && <Spinner size={12} />}
            Create link
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
          <span className="truncate text-[13px] font-medium">{link.label || 'Untitled link'}</span>
          {link.expired ? (
            <span className="rounded-[4px] border border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] px-1.5 text-[11px] font-medium leading-[18px] text-[var(--w-red)]">Expired</span>
          ) : link.options.descriptions && (link.options.board || link.options.backlog) ? (
            <span className="rounded-[4px] border border-[var(--w-border-strong)] px-1.5 text-[11px] leading-[18px] text-[var(--w-text-2)]">With descriptions</span>
          ) : null}
        </div>
        <div className="mt-0.5 text-[12px] text-[var(--w-text-2)]">{sectionsOf(link.options)}</div>
        <div className="mt-0.5 flex flex-wrap gap-x-2 text-[12px] text-[var(--w-text-3)]">
          <span>Created {formatDate(link.createdAt)}</span>
          <span>·</span>
          <span>{link.expiresAt ? `${link.expired ? 'Expired' : 'Expires'} ${formatDate(link.expiresAt)}` : 'Never expires'}</span>
          <span>·</span>
          <span>{link.viewCount} {link.viewCount === 1 ? 'view' : 'views'}{link.lastViewedAt ? ` · last viewed ${relativeTime(link.lastViewedAt)}` : ''}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button type="button" className="w-btn w-btn-sm" onClick={() => copyText(link.url)} disabled={link.expired}>
          <Copy size={13} /> Copy link
        </button>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className={cn('w-btn w-btn-ghost w-btn-icon w-btn-sm', link.expired && 'pointer-events-none opacity-50')} aria-label="Open shared view" title="Open shared view">
          <ExternalLink size={13} />
        </a>
        {canEdit && (
          <button type="button" className="w-btn w-btn-sm w-btn-danger" onClick={onRevoke}>Revoke</button>
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
      toast.success('Link revoked — it stops working immediately');
      setRevoking(null);
      if (justCreated?.id === id) setJustCreated(null);
      qc.invalidateQueries({ queryKey: key });
    },
    onError: (err) => toast.error(workError(err, 'Could not revoke the link')),
  });

  const intro = (
    <>
      Give lecturers, clients or stakeholders a read-only view of this project — <span className="font-medium text-[var(--w-text)]">no account needed</span>.
      You choose what each link shows (board, backlog, reports, tests). Comments, attachments, activity history and email addresses are never shared;
      people appear by display name only. Anyone with the link can view it, so revoke links you no longer need.
    </>
  );

  if (!canEdit) {
    return (
      <Section title="Public links" description={intro}>
        <ReadOnlyNotice>Only project admins can create and manage public links.</ReadOnlyNotice>
      </Section>
    );
  }

  const links = q.data ?? [];

  return (
    <Section
      title="Public links"
      description={intro}
      action={
        <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setCreating(true)}>
          <Plus size={14} /> Create link
        </button>
      }
    >
      {justCreated && (
        <div className="mb-4 rounded-[8px] border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] px-3 py-3">
          <div className="mb-2 flex items-center gap-1.5 text-[13px] font-medium">
            <Check size={14} className="text-[var(--w-green)]" /> Link created — share it with anyone who should see this project
          </div>
          <div className="flex gap-2">
            <input className="w-input min-w-0 flex-1 !bg-[var(--w-panel)] font-mono !text-[12px]" readOnly value={justCreated.url} onFocus={(e) => e.currentTarget.select()} aria-label="Public link" />
            <button type="button" className="w-btn w-btn-primary shrink-0" onClick={() => copyText(justCreated.url)}><Copy size={13} /> Copy</button>
          </div>
        </div>
      )}

      {q.isLoading ? (
        <div className="flex justify-center py-10"><Spinner size={18} /></div>
      ) : q.error ? (
        <EmptyState title="Could not load links" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />
      ) : !links.length ? (
        <div className="flex flex-col items-center rounded-[8px] border border-dashed border-[var(--w-border)] px-6 py-10 text-center">
          <Link2 size={20} className="mb-2 text-[var(--w-text-3)]" />
          <div className="text-[13px] font-medium">No active links</div>
          <p className="mt-1 max-w-[380px] text-[12px] text-[var(--w-text-3)]">Create a link to let someone follow progress without joining the workspace.</p>
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
          toast.success('Public link created');
          setJustCreated(l);
          qc.invalidateQueries({ queryKey: key });
        }}
      />
      <ConfirmDialog
        open={!!revoking}
        onClose={() => setRevoking(null)}
        title="Revoke link?"
        body={<>Anyone using <span className="font-medium text-[var(--w-text)]">{revoking?.label || 'this link'}</span> will lose access immediately. This can&apos;t be undone — you can create a new link later.</>}
        confirmLabel="Revoke link"
        pending={revoke.isPending}
        onConfirm={() => revoking && revoke.mutate(revoking.id)}
      />
    </Section>
  );
}
