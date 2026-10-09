'use client';

/**
 * Tab "GitHub" — nối repo qua webhook: URL + secret để dán vào GitHub, tự
 * chuyển trạng thái khi PR mở / merge, xoay secret, ngắt kết nối.
 * Secret chỉ ADMIN dự án thấy (backend trả null cho người khác).
 */

import { useEffect, useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, Copy, ExternalLink, Eye, EyeOff, GitBranch, GitCommitHorizontal, GitPullRequest, RefreshCw, Unplug } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, type GithubConnection, type ProjectConfig } from '@/lib/work-api';
import { wk } from '../hooks';
import { relativeTime, Spinner } from '../ui';
import { ConfirmDialog, Section, Select } from './shared';
import { wt, wfmt } from '@/components/work/i18n';

export function CopyField({ label, value, secret, mono = true }: { label: string; value: string; secret?: boolean; mono?: boolean }) {
  const [shown, setShown] = useState(!secret);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(value).then(
      () => { setCopied(true); toast.success(wt('git.xCopied', { x: label })); setTimeout(() => setCopied(false), 1500); },
      () => toast.error(wt('git.copyFailed')),
    );
  };
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <input
        readOnly
        value={shown ? value : '•'.repeat(Math.min(value.length, 32))}
        aria-label={label}
        onFocus={(e) => shown && e.currentTarget.select()}
        className={cn('w-input min-w-0 flex-1', mono && 'font-mono !text-[12px]')}
      />
      {secret && (
        <button type="button" className="w-btn w-btn-icon shrink-0" onClick={() => setShown((v) => !v)} aria-label={shown ? wt('git.hideSecret') : wt('git.showSecret')} title={shown ? wt('common.hide') : wt('common.show')}>
          {shown ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
      <button type="button" className="w-btn w-btn-icon shrink-0" onClick={copy} aria-label={wt('agents.copyX', { x: label.toLowerCase() })} title={wt('common.copy')}>
        {copied ? <Check size={14} className="text-[var(--w-green)]" /> : <Copy size={14} />}
      </button>
    </div>
  );
}

export function Step({ n, title, children }: { n: number; title: ReactNode; children?: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--w-accent-soft)] text-[11px] font-semibold text-[var(--w-accent-text)]">{n}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium">{title}</div>
        {children && <div className="mt-1.5 text-[13px] text-[var(--w-text-2)]">{children}</div>}
      </div>
    </li>
  );
}

/** Ô chọn trạng thái — gom theo quy trình khi dự án có nhiều quy trình. */
export function StatusSelect({ config, value, onChange, disabled, label }: { config: ProjectConfig; value: number | null; onChange: (v: number | null) => void; disabled?: boolean; label: string }) {
  const multi = config.workflows.length > 1;
  return (
    <Select value={value ?? ''} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)} disabled={disabled} aria-label={label} className="w-full sm:w-[260px]">
      <option value="">{wt('git.noneStatus')}</option>
      {config.workflows.map((w) => {
        const opts = [...w.statuses].sort((a, b) => a.position - b.position).map((s) => <option key={s.id} value={s.id}>{s.name}</option>);
        return multi ? <optgroup key={w.id} label={w.name}>{opts}</optgroup> : opts;
      })}
    </Select>
  );
}

export default function ProjectGithub({ config, slug: _slug }: { config: ProjectConfig; slug: string }) {
  const pid = config.id;
  const qc = useQueryClient();
  const canEdit = config.permissions.settings;
  const [confirm, setConfirm] = useState<'rotate' | 'disconnect' | null>(null);
  const [repo, setRepo] = useState('');

  const q = useQuery({ queryKey: wk.github(pid), queryFn: () => workApi.github(pid) });
  const conn = q.data;
  useEffect(() => setRepo(conn?.repoFullName ?? ''), [conn?.repoFullName]);

  const put = (data: GithubConnection) => qc.setQueryData(wk.github(pid), data);

  const connect = useMutation({
    mutationFn: (rotate: boolean) => workApi.connectGithub(pid, rotate),
    onSuccess: (data, rotate) => {
      put(data);
      setConfirm(null);
      toast.success(rotate ? wt('git.ghNewSecret') : wt('git.ghConnected'));
    },
    onError: (err) => toast.error(workError(err, wt('git.ghConnectFailed'))),
  });
  const update = useMutation({
    mutationFn: (body: { repoFullName?: string | null; prOpenedStatusId?: number | null; prMergedStatusId?: number | null }) => workApi.updateGithub(pid, body),
    onSuccess: (data) => { put(data); toast.success(wt('git.ghSaved')); },
    onError: (err) => { toast.error(workError(err, wt('git.ghSaveFailed'))); setRepo(conn?.repoFullName ?? ''); },
  });
  const disconnect = useMutation({
    mutationFn: () => workApi.disconnectGithub(pid),
    onSuccess: () => { setConfirm(null); toast.success(wt('git.ghDisconnected')); qc.invalidateQueries({ queryKey: wk.github(pid) }); },
    onError: (err) => toast.error(workError(err, wt('git.ghDisconnectFailed'))),
  });

  const key = config.key;
  const help = (
    <Section title={wt('git.howLink')} description={wt('git.howLinkGh')}>
      <ul className="max-w-[640px] space-y-2.5 text-[13px] text-[var(--w-text-2)]">
        <li className="flex items-start gap-2.5">
          <GitBranch size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
          <span>{wt('git.branchNames')} <code className="rounded bg-[var(--w-sunken)] px-1 font-mono text-[12px] text-[var(--w-text)]">feature/{key.toLowerCase()}-12-login</code></span>
        </li>
        <li className="flex items-start gap-2.5">
          <GitCommitHorizontal size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
          <span>{wt('git.commitMsgs')} <code className="rounded bg-[var(--w-sunken)] px-1 font-mono text-[12px] text-[var(--w-text)]">{key}-12 Validate the login form</code></span>
        </li>
        <li className="flex items-start gap-2.5">
          <GitPullRequest size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
          <span>{wt('git.prTitles')} <code className="rounded bg-[var(--w-sunken)] px-1 font-mono text-[12px] text-[var(--w-text)]">{key}-12: Login page</code></span>
        </li>
      </ul>
    </Section>
  );

  if (q.isLoading) return <div className="flex justify-center py-10"><Spinner /></div>;
  if (q.isError || !conn) return <p className="text-[13px] text-[var(--w-red)]">{workError(q.error, wt('git.ghLoadFailed'))}</p>;

  if (!conn.connected) {
    return (
      <>
        <Section title="GitHub" description={wt('git.ghDesc')}>
          <div className="max-w-[640px] rounded-[8px] border border-dashed border-[var(--w-border-strong)] px-4 py-5">
            <p className="text-[13px] text-[var(--w-text-2)]">
              {wt('git.ghHow')}
            </p>
            {canEdit ? (
              <button type="button" className="w-btn w-btn-primary mt-4" disabled={connect.isPending} onClick={() => connect.mutate(false)}>
                {connect.isPending ? <Spinner size={12} /> : <GitBranch size={14} />}
                {wt('git.connectGh')}
              </button>
            ) : (
              <p className="mt-3 text-[12px] text-[var(--w-text-3)]">{wt('git.ghOnlyAdmins')}</p>
            )}
          </div>
        </Section>
        {help}
      </>
    );
  }

  const cfg = conn.config ?? {};
  const hooksUrl = conn.repoFullName ? `https://github.com/${conn.repoFullName}/settings/hooks/new` : null;
  const commitRepo = () => {
    const v = repo.trim();
    if (v === (conn.repoFullName ?? '')) return;
    if (v && !/^[\w.-]+\/[\w.-]+$/.test(v)) { toast.error(wt('git.ownerRepo')); setRepo(conn.repoFullName ?? ''); return; }
    update.mutate({ repoFullName: v || null });
  };

  return (
    <>
      <Section
        title="GitHub"
        description={
          <>
            {wt('git.connectedTo', { to: conn.repoFullName ? wt('git.toX', { x: conn.repoFullName }) : '' })}{' '}
            {conn.lastEventAt ? <>{wt('git.lastEvent', { t: relativeTime(conn.lastEventAt) })}.</> : null}
          </>
        }
        action={canEdit && (
          <button type="button" className="w-btn w-btn-sm w-btn-danger" onClick={() => setConfirm('disconnect')}>
            <Unplug size={13} /> {wt('git.disconnect')}
          </button>
        )}
      >
        <div className="max-w-[680px] rounded-[8px] border border-[var(--w-border)] p-4">
          <div className="mb-3 text-[13px] font-semibold">{wt('git.setupGh')}</div>
          <ol className="space-y-4">
            <Step n={1} title={wt('git.openRepoHooks')}>
              {hooksUrl ? (
                <a href={hooksUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--w-accent-text)] hover:underline">
                  github.com/{conn.repoFullName}/settings/hooks/new <ExternalLink size={12} />
                </a>
              ) : (
                <>{wt('git.ghGoTo')} <span className="font-medium text-[var(--w-text)]">Settings → Webhooks → Add webhook</span> {wt('git.ghGoTo2')}</>
              )}
            </Step>
            <Step n={2} title="Payload URL">
              <CopyField label="Payload URL" value={conn.webhookUrl} />
            </Step>
            <Step n={3} title="Content type">
              {wt('git.choose')} <code className="rounded bg-[var(--w-sunken)] px-1 font-mono text-[12px] text-[var(--w-text)]">application/json</code>.
            </Step>
            <Step n={4} title="Secret">
              {conn.secret ? (
                <CopyField label="Secret" value={conn.secret} secret />
              ) : (
                <span className="text-[var(--w-text-3)]">{wt('git.onlySecret')}</span>
              )}
            </Step>
            <Step n={5} title="Which events would you like to trigger this webhook?">
              {wt('git.choose')} <span className="font-medium text-[var(--w-text)]">Let me select individual events</span> {wt('git.andTick')}
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {['Pushes', 'Branch or tag creation', 'Pull requests'].map((e) => (
                  <li key={e} className="inline-flex h-[22px] items-center gap-1 rounded-full border border-[var(--w-border-strong)] px-2 text-[12px] text-[var(--w-text)]">
                    <Check size={11} className="text-[var(--w-green)]" /> {e}
                  </li>
                ))}
              </ul>
            </Step>
            <Step n={6} title={wt('git.saveCheck')}>
              {conn.lastEventAt ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[var(--w-green)]" />
                  {wt('git.lastEvent', { t: relativeTime(conn.lastEventAt) })}
                  <span className="text-[var(--w-text-3)]">({new Date(conn.lastEventAt).toLocaleString(wfmt.intl())})</span>
                </span>
              ) : (
                <span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-[var(--w-text)]"><span className="h-2 w-2 rounded-full bg-[var(--w-text-3)]" />{wt('git.noEvents')}</span>{' '}
                  {wt('git.ghPing')} <span className="font-medium text-[var(--w-text)]">Recent Deliveries</span> {wt('git.ghPing2')} <span className="font-medium text-[var(--w-text)]">Redeliver</span>.
                </span>
              )}
            </Step>
          </ol>
          {canEdit && (
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--w-border)] pt-4">
              <button type="button" className="w-btn w-btn-sm" onClick={() => setConfirm('rotate')}>
                <RefreshCw size={13} /> {wt('git.rotateSecret')}
              </button>
              <span className="text-[12px] text-[var(--w-text-3)]">{wt('git.leaked')}</span>
            </div>
          )}
        </div>
      </Section>

      <Section title={wt('git.repository')} description={wt('git.repoDesc')}>
        <div className="flex max-w-[480px] items-center gap-2">
          <input
            className="w-input min-w-0 flex-1 font-mono !text-[12.5px]"
            placeholder="owner/repo"
            value={repo}
            maxLength={200}
            disabled={!canEdit}
            onChange={(e) => setRepo(e.target.value)}
            onBlur={commitRepo}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'Enter') e.currentTarget.blur();
              if (e.key === 'Escape') { setRepo(conn.repoFullName ?? ''); e.currentTarget.blur(); }
            }}
            aria-label={wt('git.repoName')}
            spellCheck={false}
          />
          {update.isPending && <Spinner size={12} />}
        </div>
      </Section>

      <Section title={wt('git.autoTransitions')} description={wt('git.autoDescGh')}>
        <div className="max-w-[640px] space-y-3">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-[13px]">{wt('git.prOpened')}</span>
            <StatusSelect config={config} label={wt('git.prOpenedAria')} value={cfg.prOpenedStatusId ?? null} disabled={!canEdit || update.isPending} onChange={(v) => update.mutate({ prOpenedStatusId: v })} />
          </div>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-[13px]">{wt('git.prMerged')}</span>
            <StatusSelect config={config} label={wt('git.prMergedAria')} value={cfg.prMergedStatusId ?? null} disabled={!canEdit || update.isPending} onChange={(v) => update.mutate({ prMergedStatusId: v })} />
          </div>
        </div>
      </Section>

      {help}

      <ConfirmDialog
        open={confirm === 'rotate'}
        onClose={() => setConfirm(null)}
        title={wt('git.rotateSecretQ')}
        body={wt('git.rotateSecretBody')}
        confirmLabel={wt('git.rotateSecret')}
        pending={connect.isPending}
        onConfirm={() => connect.mutate(true)}
      />
      <ConfirmDialog
        open={confirm === 'disconnect'}
        onClose={() => setConfirm(null)}
        title={wt('git.disconnectGhQ')}
        body={wt('git.disconnectGhBody')}
        confirmLabel={wt('git.disconnect')}
        pending={disconnect.isPending}
        onConfirm={() => disconnect.mutate()}
      />
    </>
  );
}
