'use client';

/**
 * Tab "GitLab" — nối repo GitLab (gitlab.com hoặc GitLab của trường) qua webhook:
 * URL + secret token để dán vào GitLab, tự chuyển trạng thái khi merge request
 * mở / merge. Cùng khuôn với tab GitHub; token chỉ ADMIN dự án thấy.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, ExternalLink, GitBranch, GitCommitHorizontal, GitMerge, RefreshCw, Unplug } from 'lucide-react';
import { workApi, workError, type GitlabConnection, type ProjectConfig } from '@/lib/work-api';
import { wk } from '../hooks';
import { relativeTime, Spinner } from '../ui';
import { CopyField, StatusSelect, Step } from './ProjectGithub';
import { ConfirmDialog, Section } from './shared';

export default function ProjectGitlab({ config }: { config: ProjectConfig; slug: string }) {
  const pid = config.id;
  const qc = useQueryClient();
  const canEdit = config.permissions.settings;
  const [confirm, setConfirm] = useState<'rotate' | 'disconnect' | null>(null);
  const [repo, setRepo] = useState('');

  const q = useQuery({ queryKey: wk.gitlab(pid), queryFn: () => workApi.gitlab(pid) });
  const conn = q.data;
  useEffect(() => setRepo(conn?.repoPath ?? ''), [conn?.repoPath]);
  const put = (data: GitlabConnection) => qc.setQueryData(wk.gitlab(pid), data);

  const connect = useMutation({
    mutationFn: (rotate: boolean) => workApi.connectGitlab(pid, rotate),
    onSuccess: (data, rotate) => { put(data); setConfirm(null); toast.success(rotate ? 'New token generated — update it in GitLab' : 'GitLab connected. Finish the setup below.'); },
    onError: (err) => toast.error(workError(err, 'Could not connect GitLab')),
  });
  const update = useMutation({
    mutationFn: (body: { repoPath?: string | null; mrOpenedStatusId?: number | null; mrMergedStatusId?: number | null }) => workApi.updateGitlab(pid, body),
    onSuccess: (data) => { put(data); toast.success('GitLab settings saved'); },
    onError: (err) => { toast.error(workError(err, 'Could not save the GitLab settings')); setRepo(conn?.repoPath ?? ''); },
  });
  const disconnect = useMutation({
    mutationFn: () => workApi.disconnectGitlab(pid),
    onSuccess: () => { setConfirm(null); toast.success('GitLab disconnected'); qc.invalidateQueries({ queryKey: wk.gitlab(pid) }); },
    onError: (err) => toast.error(workError(err, 'Could not disconnect GitLab')),
  });

  const key = config.key;
  const code = (t: string) => <code className="rounded bg-[var(--w-sunken)] px-1 font-mono text-[12px] text-[var(--w-text)]">{t}</code>;
  const help = (
    <Section title="How to link work" description="Anything that mentions an issue key — in any letter case — is linked to that issue’s Development panel.">
      <ul className="max-w-[640px] space-y-2.5 text-[13px] text-[var(--w-text-2)]">
        <li className="flex items-start gap-2.5"><GitBranch size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" /><span>Branch names: {code(`feature/${key.toLowerCase()}-12-login`)}</span></li>
        <li className="flex items-start gap-2.5"><GitCommitHorizontal size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" /><span>Commit messages: {code(`${key}-12 Validate the login form`)}</span></li>
        <li className="flex items-start gap-2.5"><GitMerge size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" /><span>Merge request titles or descriptions: {code(`${key}-12: Login page`)}</span></li>
      </ul>
    </Section>
  );

  if (q.isLoading) return <div className="flex justify-center py-10"><Spinner /></div>;
  if (q.isError || !conn) return <p className="text-[13px] text-[var(--w-red)]">{workError(q.error, 'Could not load the GitLab connection')}</p>;

  if (!conn.connected) {
    return (
      <>
        <Section title="GitLab" description="Connect a GitLab project (gitlab.com or your school’s GitLab) to see branches, commits and merge requests on each issue, and to move issues when merge requests are opened or merged.">
          <div className="max-w-[640px] rounded-[8px] border border-dashed border-[var(--w-border-strong)] px-4 py-5">
            <p className="text-[13px] text-[var(--w-text-2)]">
              CT Work uses a project webhook — no GitLab app or access token is needed. Connecting generates a webhook URL and a secret token that you paste into the GitLab project settings.
            </p>
            {canEdit ? (
              <button type="button" className="w-btn w-btn-primary mt-4" disabled={connect.isPending} onClick={() => connect.mutate(false)}>
                {connect.isPending ? <Spinner size={12} /> : <GitMerge size={14} />}
                Connect GitLab
              </button>
            ) : <p className="mt-3 text-[12px] text-[var(--w-text-3)]">Only project admins can connect GitLab.</p>}
          </div>
        </Section>
        {help}
      </>
    );
  }

  const cfg = conn.config ?? {};
  const hooksUrl = conn.repoPath ? `https://gitlab.com/${conn.repoPath}/-/hooks` : null;
  const commitRepo = () => {
    const v = repo.trim();
    if (v === (conn.repoPath ?? '')) return;
    if (v && !/^[\w.-]+(\/[\w.-]+)+$/.test(v)) { toast.error('Use the “group/project” path'); setRepo(conn.repoPath ?? ''); return; }
    update.mutate({ repoPath: v || null });
  };

  return (
    <>
      <Section
        title="GitLab"
        description={<>Connected{conn.repoPath ? <> to <span className="font-medium text-[var(--w-text)]">{conn.repoPath}</span></> : ''}. {conn.lastEventAt ? <>Last event received {relativeTime(conn.lastEventAt)}.</> : null}</>}
        action={canEdit && <button type="button" className="w-btn w-btn-sm w-btn-danger" onClick={() => setConfirm('disconnect')}><Unplug size={13} /> Disconnect</button>}
      >
        <div className="max-w-[680px] rounded-[8px] border border-[var(--w-border)] p-4">
          <div className="mb-3 text-[13px] font-semibold">Set up the webhook in GitLab</div>
          <ol className="space-y-4">
            <Step n={1} title="Open the project’s webhook settings">
              {hooksUrl ? (
                <a href={hooksUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--w-accent-text)] hover:underline">gitlab.com/{conn.repoPath}/-/hooks <ExternalLink size={12} /></a>
              ) : (
                <>In GitLab, open your project and go to <span className="font-medium text-[var(--w-text)]">Settings → Webhooks → Add new webhook</span>. On a self-hosted GitLab the menu is the same.</>
              )}
            </Step>
            <Step n={2} title="URL"><CopyField label="Webhook URL" value={conn.webhookUrl} /></Step>
            <Step n={3} title="Secret token">
              {conn.token ? <CopyField label="Secret token" value={conn.token} secret /> : <span className="text-[var(--w-text-3)]">Only project admins can see the token.</span>}
            </Step>
            <Step n={4} title="Trigger">
              Tick:
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {['Push events (all branches)', 'Merge request events'].map((e) => (
                  <li key={e} className="inline-flex h-[22px] items-center gap-1 rounded-full border border-[var(--w-border-strong)] px-2 text-[12px] text-[var(--w-text)]"><Check size={11} className="text-[var(--w-green)]" /> {e}</li>
                ))}
              </ul>
              <div className="mt-1.5">Keep <span className="font-medium text-[var(--w-text)]">Enable SSL verification</span> on.</div>
            </Step>
            <Step n={5} title="Save, then test">
              {conn.lastEventAt ? (
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--w-green)]" />Last event received {relativeTime(conn.lastEventAt)}</span>
              ) : (
                <span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-[var(--w-text)]"><span className="h-2 w-2 rounded-full bg-[var(--w-text-3)]" />No events received yet.</span>{' '}
                  Click <span className="font-medium text-[var(--w-text)]">Test → Push events</span> next to the webhook in GitLab. A green “Hook executed successfully” means it works.
                </span>
              )}
            </Step>
          </ol>
          {canEdit && (
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--w-border)] pt-4">
              <button type="button" className="w-btn w-btn-sm" onClick={() => setConfirm('rotate')}><RefreshCw size={13} /> Rotate token</button>
              <span className="text-[12px] text-[var(--w-text-3)]">Generate a new token if the current one may have leaked.</span>
            </div>
          )}
        </div>
      </Section>

      <Section title="Project path" description="Filled in automatically from the first event (e.g. group/project).">
        <div className="flex max-w-[480px] items-center gap-2">
          <input
            id="gitlab-repo-path"
            className="w-input min-w-0 flex-1 font-mono !text-[12.5px]"
            placeholder="group/project"
            value={repo}
            maxLength={200}
            disabled={!canEdit}
            onChange={(e) => setRepo(e.target.value)}
            onBlur={commitRepo}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'Enter') e.currentTarget.blur();
              if (e.key === 'Escape') { setRepo(conn.repoPath ?? ''); e.currentTarget.blur(); }
            }}
            aria-label="GitLab project path"
            spellCheck={false}
          />
          {update.isPending && <Spinner size={12} />}
        </div>
      </Section>

      <Section title="Automatic transitions" description="Move linked issues when merge requests change. Transitions follow the issue’s workflow — if a move isn’t allowed from the current status, it is skipped.">
        <div className="max-w-[640px] space-y-3">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-[13px]">When a merge request is opened, move the issue to…</span>
            <StatusSelect config={config} label="Status when a merge request is opened" value={cfg.mrOpenedStatusId ?? null} disabled={!canEdit || update.isPending} onChange={(v) => update.mutate({ mrOpenedStatusId: v })} />
          </div>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-[13px]">When a merge request is merged, move the issue to…</span>
            <StatusSelect config={config} label="Status when a merge request is merged" value={cfg.mrMergedStatusId ?? null} disabled={!canEdit || update.isPending} onChange={(v) => update.mutate({ mrMergedStatusId: v })} />
          </div>
        </div>
      </Section>

      {help}

      <ConfirmDialog open={confirm === 'rotate'} onClose={() => setConfirm(null)} title="Rotate the webhook token?"
        body="A new token is generated and the current one stops working immediately. Until you paste the new token into the GitLab webhook, GitLab deliveries will be rejected."
        confirmLabel="Rotate token" pending={connect.isPending} onConfirm={() => connect.mutate(true)} />
      <ConfirmDialog open={confirm === 'disconnect'} onClose={() => setConfirm(null)} title="Disconnect GitLab?"
        body="CT Work stops accepting events from this project. Branches, commits and merge requests already linked stay visible. Remember to delete the webhook in GitLab as well."
        confirmLabel="Disconnect" pending={disconnect.isPending} onConfirm={() => disconnect.mutate()} />
    </>
  );
}
