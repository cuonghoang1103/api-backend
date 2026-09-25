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

export function CopyField({ label, value, secret, mono = true }: { label: string; value: string; secret?: boolean; mono?: boolean }) {
  const [shown, setShown] = useState(!secret);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(value).then(
      () => { setCopied(true); toast.success(`${label} copied`); setTimeout(() => setCopied(false), 1500); },
      () => toast.error('Could not copy to the clipboard'),
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
        <button type="button" className="w-btn w-btn-icon shrink-0" onClick={() => setShown((v) => !v)} aria-label={shown ? 'Hide secret' : 'Show secret'} title={shown ? 'Hide' : 'Show'}>
          {shown ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
      <button type="button" className="w-btn w-btn-icon shrink-0" onClick={copy} aria-label={`Copy ${label.toLowerCase()}`} title="Copy">
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
      <option value="">None — don’t change the status</option>
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
      toast.success(rotate ? 'New secret generated — update it in GitHub' : 'GitHub connected. Finish the setup below.');
    },
    onError: (err) => toast.error(workError(err, 'Could not connect GitHub')),
  });
  const update = useMutation({
    mutationFn: (body: { repoFullName?: string | null; prOpenedStatusId?: number | null; prMergedStatusId?: number | null }) => workApi.updateGithub(pid, body),
    onSuccess: (data) => { put(data); toast.success('GitHub settings saved'); },
    onError: (err) => { toast.error(workError(err, 'Could not save the GitHub settings')); setRepo(conn?.repoFullName ?? ''); },
  });
  const disconnect = useMutation({
    mutationFn: () => workApi.disconnectGithub(pid),
    onSuccess: () => { setConfirm(null); toast.success('GitHub disconnected'); qc.invalidateQueries({ queryKey: wk.github(pid) }); },
    onError: (err) => toast.error(workError(err, 'Could not disconnect GitHub')),
  });

  const key = config.key;
  const help = (
    <Section title="How to link work" description="CT Work links anything that mentions an issue key — in any letter case — to that issue’s Development panel.">
      <ul className="max-w-[640px] space-y-2.5 text-[13px] text-[var(--w-text-2)]">
        <li className="flex items-start gap-2.5">
          <GitBranch size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
          <span>Branch names: <code className="rounded bg-[var(--w-sunken)] px-1 font-mono text-[12px] text-[var(--w-text)]">feature/{key.toLowerCase()}-12-login</code></span>
        </li>
        <li className="flex items-start gap-2.5">
          <GitCommitHorizontal size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
          <span>Commit messages: <code className="rounded bg-[var(--w-sunken)] px-1 font-mono text-[12px] text-[var(--w-text)]">{key}-12 Validate the login form</code></span>
        </li>
        <li className="flex items-start gap-2.5">
          <GitPullRequest size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
          <span>Pull request titles or descriptions: <code className="rounded bg-[var(--w-sunken)] px-1 font-mono text-[12px] text-[var(--w-text)]">{key}-12: Login page</code></span>
        </li>
      </ul>
    </Section>
  );

  if (q.isLoading) return <div className="flex justify-center py-10"><Spinner /></div>;
  if (q.isError || !conn) return <p className="text-[13px] text-[var(--w-red)]">{workError(q.error, 'Could not load the GitHub connection')}</p>;

  if (!conn.connected) {
    return (
      <>
        <Section title="GitHub" description="Connect a GitHub repository to see branches, commits and pull requests on each issue, and to move issues automatically when pull requests are opened or merged.">
          <div className="max-w-[640px] rounded-[8px] border border-dashed border-[var(--w-border-strong)] px-4 py-5">
            <p className="text-[13px] text-[var(--w-text-2)]">
              CT Work uses a repository webhook — no GitHub app or personal token is needed. Connecting generates a webhook URL and a secret that you paste into the repository settings.
            </p>
            {canEdit ? (
              <button type="button" className="w-btn w-btn-primary mt-4" disabled={connect.isPending} onClick={() => connect.mutate(false)}>
                {connect.isPending ? <Spinner size={12} /> : <GitBranch size={14} />}
                Connect GitHub
              </button>
            ) : (
              <p className="mt-3 text-[12px] text-[var(--w-text-3)]">Only project admins can connect GitHub.</p>
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
    if (v && !/^[\w.-]+\/[\w.-]+$/.test(v)) { toast.error('Use the “owner/repo” format'); setRepo(conn.repoFullName ?? ''); return; }
    update.mutate({ repoFullName: v || null });
  };

  return (
    <>
      <Section
        title="GitHub"
        description={
          <>
            Connected{conn.repoFullName ? <> to <span className="font-medium text-[var(--w-text)]">{conn.repoFullName}</span></> : ''}.{' '}
            {conn.lastEventAt ? <>Last event received {relativeTime(conn.lastEventAt)}.</> : null}
          </>
        }
        action={canEdit && (
          <button type="button" className="w-btn w-btn-sm w-btn-danger" onClick={() => setConfirm('disconnect')}>
            <Unplug size={13} /> Disconnect
          </button>
        )}
      >
        <div className="max-w-[680px] rounded-[8px] border border-[var(--w-border)] p-4">
          <div className="mb-3 text-[13px] font-semibold">Set up the webhook in GitHub</div>
          <ol className="space-y-4">
            <Step n={1} title="Open the repository’s webhook settings">
              {hooksUrl ? (
                <a href={hooksUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--w-accent-text)] hover:underline">
                  github.com/{conn.repoFullName}/settings/hooks/new <ExternalLink size={12} />
                </a>
              ) : (
                <>In GitHub, go to <span className="font-medium text-[var(--w-text)]">Settings → Webhooks → Add webhook</span> in your repository. Enter the repository name below to get a direct link.</>
              )}
            </Step>
            <Step n={2} title="Payload URL">
              <CopyField label="Payload URL" value={conn.webhookUrl} />
            </Step>
            <Step n={3} title="Content type">
              Choose <code className="rounded bg-[var(--w-sunken)] px-1 font-mono text-[12px] text-[var(--w-text)]">application/json</code>.
            </Step>
            <Step n={4} title="Secret">
              {conn.secret ? (
                <CopyField label="Secret" value={conn.secret} secret />
              ) : (
                <span className="text-[var(--w-text-3)]">Only project admins can see the secret.</span>
              )}
            </Step>
            <Step n={5} title="Which events would you like to trigger this webhook?">
              Choose <span className="font-medium text-[var(--w-text)]">Let me select individual events</span> and tick:
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {['Pushes', 'Branch or tag creation', 'Pull requests'].map((e) => (
                  <li key={e} className="inline-flex h-[22px] items-center gap-1 rounded-full border border-[var(--w-border-strong)] px-2 text-[12px] text-[var(--w-text)]">
                    <Check size={11} className="text-[var(--w-green)]" /> {e}
                  </li>
                ))}
              </ul>
            </Step>
            <Step n={6} title="Save and check delivery">
              {conn.lastEventAt ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[var(--w-green)]" />
                  Last event received {relativeTime(conn.lastEventAt)}
                  <span className="text-[var(--w-text-3)]">({new Date(conn.lastEventAt).toLocaleString('en-US')})</span>
                </span>
              ) : (
                <span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-[var(--w-text)]"><span className="h-2 w-2 rounded-full bg-[var(--w-text-3)]" />No events received yet.</span>{' '}
                  GitHub sends a ping when the webhook is created. If nothing shows up, open the webhook’s <span className="font-medium text-[var(--w-text)]">Recent Deliveries</span> tab and click <span className="font-medium text-[var(--w-text)]">Redeliver</span>.
                </span>
              )}
            </Step>
          </ol>
          {canEdit && (
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--w-border)] pt-4">
              <button type="button" className="w-btn w-btn-sm" onClick={() => setConfirm('rotate')}>
                <RefreshCw size={13} /> Rotate secret
              </button>
              <span className="text-[12px] text-[var(--w-text-3)]">Generate a new secret if the current one may have leaked.</span>
            </div>
          )}
        </div>
      </Section>

      <Section title="Repository" description="Filled in automatically from the first event. Used for the direct link to GitHub’s webhook settings.">
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
            aria-label="Repository name"
            spellCheck={false}
          />
          {update.isPending && <Spinner size={12} />}
        </div>
      </Section>

      <Section title="Automatic transitions" description="Move linked issues when pull requests change. Transitions follow the issue’s workflow — if a move isn’t allowed from the current status, it is skipped.">
        <div className="max-w-[640px] space-y-3">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-[13px]">When a pull request is opened, move the issue to…</span>
            <StatusSelect config={config} label="Status when a pull request is opened" value={cfg.prOpenedStatusId ?? null} disabled={!canEdit || update.isPending} onChange={(v) => update.mutate({ prOpenedStatusId: v })} />
          </div>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-[13px]">When a pull request is merged, move the issue to…</span>
            <StatusSelect config={config} label="Status when a pull request is merged" value={cfg.prMergedStatusId ?? null} disabled={!canEdit || update.isPending} onChange={(v) => update.mutate({ prMergedStatusId: v })} />
          </div>
        </div>
      </Section>

      {help}

      <ConfirmDialog
        open={confirm === 'rotate'}
        onClose={() => setConfirm(null)}
        title="Rotate the webhook secret?"
        body="A new secret is generated and the current one stops working immediately. Until you paste the new secret into the GitHub webhook, GitHub deliveries will be rejected."
        confirmLabel="Rotate secret"
        pending={connect.isPending}
        onConfirm={() => connect.mutate(true)}
      />
      <ConfirmDialog
        open={confirm === 'disconnect'}
        onClose={() => setConfirm(null)}
        title="Disconnect GitHub?"
        body="CT Work stops accepting events from this repository. Branches, commits and pull requests already linked to issues stay visible. Remember to delete the webhook in GitHub as well."
        confirmLabel="Disconnect"
        pending={disconnect.isPending}
        onConfirm={() => disconnect.mutate()}
      />
    </>
  );
}
