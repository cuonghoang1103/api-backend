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
import { wt } from '@/components/work/i18n';

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
    onSuccess: (data, rotate) => { put(data); setConfirm(null); toast.success(rotate ? wt('git.glNewToken') : wt('git.glConnected')); },
    onError: (err) => toast.error(workError(err, wt('git.glConnectFailed'))),
  });
  const update = useMutation({
    mutationFn: (body: { repoPath?: string | null; mrOpenedStatusId?: number | null; mrMergedStatusId?: number | null }) => workApi.updateGitlab(pid, body),
    onSuccess: (data) => { put(data); toast.success(wt('git.glSaved')); },
    onError: (err) => { toast.error(workError(err, wt('git.glSaveFailed'))); setRepo(conn?.repoPath ?? ''); },
  });
  const disconnect = useMutation({
    mutationFn: () => workApi.disconnectGitlab(pid),
    onSuccess: () => { setConfirm(null); toast.success(wt('git.glDisconnected')); qc.invalidateQueries({ queryKey: wk.gitlab(pid) }); },
    onError: (err) => toast.error(workError(err, wt('git.glDisconnectFailed'))),
  });

  const key = config.key;
  const code = (t: string) => <code className="rounded bg-[var(--w-sunken)] px-1 font-mono text-[12px] text-[var(--w-text)]">{t}</code>;
  const help = (
    <Section title={wt('git.howLink')} description={wt('git.howLinkGl')}>
      <ul className="max-w-[640px] space-y-2.5 text-[13px] text-[var(--w-text-2)]">
        <li className="flex items-start gap-2.5"><GitBranch size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" /><span>{wt('git.branchNames')} {code(`feature/${key.toLowerCase()}-12-login`)}</span></li>
        <li className="flex items-start gap-2.5"><GitCommitHorizontal size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" /><span>{wt('git.commitMsgs')} {code(`${key}-12 Validate the login form`)}</span></li>
        <li className="flex items-start gap-2.5"><GitMerge size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" /><span>{wt('git.mrTitles')} {code(`${key}-12: Login page`)}</span></li>
      </ul>
    </Section>
  );

  if (q.isLoading) return <div className="flex justify-center py-10"><Spinner /></div>;
  if (q.isError || !conn) return <p className="text-[13px] text-[var(--w-red)]">{workError(q.error, wt('git.glLoadFailed'))}</p>;

  if (!conn.connected) {
    return (
      <>
        <Section title="GitLab" description={wt('git.glDesc')}>
          <div className="max-w-[640px] rounded-[8px] border border-dashed border-[var(--w-border-strong)] px-4 py-5">
            <p className="text-[13px] text-[var(--w-text-2)]">
              {wt('git.glHow')}
            </p>
            {canEdit ? (
              <button type="button" className="w-btn w-btn-primary mt-4" disabled={connect.isPending} onClick={() => connect.mutate(false)}>
                {connect.isPending ? <Spinner size={12} /> : <GitMerge size={14} />}
                {wt('git.connectGl')}
              </button>
            ) : <p className="mt-3 text-[12px] text-[var(--w-text-3)]">{wt('git.glOnlyAdmins')}</p>}
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
    if (v && !/^[\w.-]+(\/[\w.-]+)+$/.test(v)) { toast.error(wt('git.groupProject')); setRepo(conn.repoPath ?? ''); return; }
    update.mutate({ repoPath: v || null });
  };

  return (
    <>
      <Section
        title="GitLab"
        description={<>{wt('git.connectedTo', { to: conn.repoPath ? wt('git.toX', { x: conn.repoPath }) : '' })} {conn.lastEventAt ? <>{wt('git.lastEvent', { t: relativeTime(conn.lastEventAt) })}.</> : null}</>}
        action={canEdit && <button type="button" className="w-btn w-btn-sm w-btn-danger" onClick={() => setConfirm('disconnect')}><Unplug size={13} /> {wt('git.disconnect')}</button>}
      >
        <div className="max-w-[680px] rounded-[8px] border border-[var(--w-border)] p-4">
          <div className="mb-3 text-[13px] font-semibold">{wt('git.setupGl')}</div>
          <ol className="space-y-4">
            <Step n={1} title={wt('git.openProjHooks')}>
              {hooksUrl ? (
                <a href={hooksUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--w-accent-text)] hover:underline">gitlab.com/{conn.repoPath}/-/hooks <ExternalLink size={12} /></a>
              ) : (
                <>{wt('git.glGoTo')} <span className="font-medium text-[var(--w-text)]">Settings → Webhooks → Add new webhook</span>. {wt('git.glSelfHosted')}</>
              )}
            </Step>
            <Step n={2} title="URL"><CopyField label="Webhook URL" value={conn.webhookUrl} /></Step>
            <Step n={3} title="Secret token">
              {conn.token ? <CopyField label="Secret token" value={conn.token} secret /> : <span className="text-[var(--w-text-3)]">{wt('git.onlyToken')}</span>}
            </Step>
            <Step n={4} title="Trigger">
              {wt('git.tick')}
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {['Push events (all branches)', 'Merge request events'].map((e) => (
                  <li key={e} className="inline-flex h-[22px] items-center gap-1 rounded-full border border-[var(--w-border-strong)] px-2 text-[12px] text-[var(--w-text)]"><Check size={11} className="text-[var(--w-green)]" /> {e}</li>
                ))}
              </ul>
              <div className="mt-1.5">{wt('git.keepSsl')} <span className="font-medium text-[var(--w-text)]">Enable SSL verification</span> {wt('git.on')}</div>
            </Step>
            <Step n={5} title={wt('git.saveTest')}>
              {conn.lastEventAt ? (
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--w-green)]" />{wt('git.lastEvent', { t: relativeTime(conn.lastEventAt) })}</span>
              ) : (
                <span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-[var(--w-text)]"><span className="h-2 w-2 rounded-full bg-[var(--w-text-3)]" />{wt('git.noEvents')}</span>{' '}
                  {wt('git.glClick')} <span className="font-medium text-[var(--w-text)]">Test → Push events</span> {wt('git.glClick2')}
                </span>
              )}
            </Step>
          </ol>
          {canEdit && (
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--w-border)] pt-4">
              <button type="button" className="w-btn w-btn-sm" onClick={() => setConfirm('rotate')}><RefreshCw size={13} /> {wt('git.rotateToken')}</button>
              <span className="text-[12px] text-[var(--w-text-3)]">{wt('git.leakedToken')}</span>
            </div>
          )}
        </div>
      </Section>

      <Section title={wt('git.projectPath')} description={wt('git.pathDesc')}>
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
            aria-label={wt('git.glPath')}
            spellCheck={false}
          />
          {update.isPending && <Spinner size={12} />}
        </div>
      </Section>

      <Section title={wt('git.autoTransitions')} description={wt('git.autoDescGl')}>
        <div className="max-w-[640px] space-y-3">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-[13px]">{wt('git.mrOpened')}</span>
            <StatusSelect config={config} label={wt('git.mrOpenedAria')} value={cfg.mrOpenedStatusId ?? null} disabled={!canEdit || update.isPending} onChange={(v) => update.mutate({ mrOpenedStatusId: v })} />
          </div>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-[13px]">{wt('git.mrMerged')}</span>
            <StatusSelect config={config} label={wt('git.mrMergedAria')} value={cfg.mrMergedStatusId ?? null} disabled={!canEdit || update.isPending} onChange={(v) => update.mutate({ mrMergedStatusId: v })} />
          </div>
        </div>
      </Section>

      {help}

      <ConfirmDialog open={confirm === 'rotate'} onClose={() => setConfirm(null)} title={wt('git.rotateTokenQ')}
        body={wt('git.rotateTokenBody')}
        confirmLabel={wt('git.rotateToken')} pending={connect.isPending} onConfirm={() => connect.mutate(true)} />
      <ConfirmDialog open={confirm === 'disconnect'} onClose={() => setConfirm(null)} title={wt('git.disconnectGlQ')}
        body={wt('git.disconnectGlBody')}
        confirmLabel={wt('git.disconnect')} pending={disconnect.isPending} onConfirm={() => disconnect.mutate()} />
    </>
  );
}
