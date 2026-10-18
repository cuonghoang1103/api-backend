'use client';

/**
 * Trang cài đặt GitHub / GitLab (làm lại 18/10/2026 cùng trang Code) — MỘT thành phần cho cả hai nhà cung cấp:
 *   1. Thẻ trạng thái lớn: đã nối / repo / sự kiện gần nhất / số sự kiện 24 giờ / quyền xem mã — nút Mở trang Code, Gửi thử.
 *   2. Các bước cài webhook — tự thu gọn khi đã nhận sự kiện.
 *   3. Thông báo & kênh chat ("Đăng hoạt động Git vào kênh…"), ghi chú "pull không có webhook".
 *   4. Token CHỈ ĐỌC (tuỳ chọn, repo private) — gửi một chiều, không bao giờ hiện lại.
 *   5. Tên repo · tự chuyển trạng thái khi PR/MR mở/merge · cách gắn thẻ.
 * Secret/token webhook chỉ ADMIN thấy (backend trả null cho người khác).
 */

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  BellRing, Check, ChevronDown, Code2, ExternalLink, GitBranch, GitCommitHorizontal, GitMerge, GitPullRequest, Info, KeyRound, Lock, MessageSquare,
  RefreshCw, Send, ShieldCheck, Unplug,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, type GithubConnection, type GitlabConnection, type ProjectConfig } from '@/lib/work-api';
import { chatApi, chatKeys } from '@/lib/work-chat-api';
import { wk } from '../hooks';
import { Spinner } from '../ui';
import { ConfirmDialog, Section, Select, Switch } from './shared';
import { CopyField, StatusSelect, Step } from './gitParts';
import { wt, wfmt } from '@/components/work/i18n';
import { codeApi, codeKeys, type ConnStats, type GitProvider, type TestSendResult } from '../code/codeApi';
import { ProviderIcon } from '../code/parts';

type Conn = (GithubConnection | GitlabConnection) & ConnStats & {
  config?: { chatChannelId?: number | null; notify?: boolean; prOpenedStatusId?: number | null; prMergedStatusId?: number | null; mrOpenedStatusId?: number | null; mrMergedStatusId?: number | null };
};

const code = (t: string) => <code className="rounded bg-[var(--w-sunken)] px-1 font-mono text-[12px] text-[var(--w-text)]">{t}</code>;

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-[12px] border border-[var(--w-border)] bg-[var(--w-raised)] shadow-[var(--w-shadow-card)]', className)}>{children}</div>;
}

function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="min-w-0 px-4 py-3">
      <div className="text-[12px] font-medium text-[var(--w-text-3)]">{label}</div>
      <div className="mt-1 truncate text-[15px] font-semibold">{value}</div>
      {sub && <div className="mt-0.5 truncate text-[12px] text-[var(--w-text-2)]">{sub}</div>}
    </div>
  );
}

function lastEventText(e: NonNullable<ConnStats['lastEvent']>): string {
  const who = e.actorLogin || e.actorName || '';
  switch (e.kind) {
    case 'PUSH': return wt('code.lePush', { who, n: e.commitCount, b: e.ref ?? '' });
    case 'PR_OPENED': case 'PR_REOPENED': return wt('code.lePrOpen', { who, n: e.prNumber ?? '' });
    case 'PR_MERGED': return wt('code.lePrMerged', { who, n: e.prNumber ?? '' });
    case 'PR_CLOSED': return wt('code.lePrClosed', { who, n: e.prNumber ?? '' });
    case 'BRANCH_CREATED': return wt('code.leBranchNew', { who, b: e.ref ?? '' });
    case 'BRANCH_DELETED': return wt('code.leBranchDel', { who, b: e.ref ?? '' });
    case 'REVIEW_REQUESTED': return wt('code.leReview', { who, n: e.prNumber ?? '' });
    default: return e.title ?? '';
  }
}

export default function GitIntegration({ config, provider }: { config: ProjectConfig; provider: GitProvider }) {
  const pid = config.id;
  const gh = provider === 'GITHUB';
  const host = gh ? 'GitHub' : 'GitLab';
  const qc = useQueryClient();
  const canEdit = config.permissions.settings;
  const [confirm, setConfirm] = useState<'rotate' | 'disconnect' | 'removeToken' | null>(null);
  const [repo, setRepo] = useState('');
  const [token, setToken] = useState('');
  const [setupOpen, setSetupOpen] = useState<boolean | null>(null);
  const [test, setTest] = useState<TestSendResult | null>(null);

  const key = gh ? wk.github(pid) : wk.gitlab(pid);
  const q = useQuery({ queryKey: key, queryFn: () => (gh ? workApi.github(pid) : workApi.gitlab(pid)) as Promise<Conn> });
  const conn = q.data as Conn | undefined;
  const repoValue = conn ? (gh ? (conn as GithubConnection).repoFullName : (conn as GitlabConnection).repoPath) ?? '' : '';
  useEffect(() => setRepo(repoValue), [repoValue]);
  const channels = useQuery({ queryKey: chatKeys.channels(pid), queryFn: () => chatApi.channels(pid), enabled: !!conn?.connected && canEdit, staleTime: 60_000 });

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: key });
    void qc.invalidateQueries({ queryKey: codeKeys.all(pid) });
  };
  const connect = useMutation({
    mutationFn: (rotate: boolean): Promise<unknown> => (gh ? workApi.connectGithub(pid, rotate) : workApi.connectGitlab(pid, rotate)),
    onSuccess: (_d, rotate) => { refresh(); setConfirm(null); toast.success(rotate ? (gh ? wt('git.ghNewSecret') : wt('git.glNewToken')) : (gh ? wt('git.ghConnected') : wt('git.glConnected'))); },
    onError: (err) => toast.error(workError(err, gh ? wt('git.ghConnectFailed') : wt('git.glConnectFailed'))),
  });
  const update = useMutation({
    mutationFn: (body: Record<string, unknown>): Promise<unknown> => (gh ? workApi.updateGithub(pid, body as Parameters<typeof workApi.updateGithub>[1]) : workApi.updateGitlab(pid, body as Parameters<typeof workApi.updateGitlab>[1])),
    onSuccess: () => { refresh(); toast.success(gh ? wt('git.ghSaved') : wt('git.glSaved')); },
    onError: (err) => { toast.error(workError(err, gh ? wt('git.ghSaveFailed') : wt('git.glSaveFailed'))); setRepo(repoValue); },
  });
  const disconnect = useMutation({
    mutationFn: () => (gh ? workApi.disconnectGithub(pid) : workApi.disconnectGitlab(pid)),
    onSuccess: () => { setConfirm(null); toast.success(gh ? wt('git.ghDisconnected') : wt('git.glDisconnected')); refresh(); },
    onError: (err) => toast.error(workError(err, gh ? wt('git.ghDisconnectFailed') : wt('git.glDisconnectFailed'))),
  });
  const saveToken = useMutation({
    mutationFn: (t: string | null) => codeApi.setReadToken(pid, provider, t),
    onSuccess: (r) => {
      setToken(''); setConfirm(null); refresh();
      toast.success(r.hasReadToken ? (r.verified === false ? wt('code.tokenSavedUnverified') : wt('code.tokenSaved')) : wt('code.tokenRemoved'));
    },
    onError: (err) => toast.error(workError(err, wt('code.tokenFailed'))),
  });
  const activity = useMutation({
    mutationFn: (body: { chatChannelId?: number | null; notify?: boolean }) => codeApi.setActivity(pid, provider, body),
    onSuccess: () => { refresh(); toast.success(wt('code.settingsSaved')); },
    onError: (err) => toast.error(workError(err, wt('code.settingsFailed'))),
  });
  const testSend = useMutation({
    mutationFn: () => codeApi.testSend(pid, provider),
    onSuccess: (r) => { setTest(r); toast.success(wt('code.testSent')); },
    onError: (err) => toast.error(workError(err, wt('code.testFailed'))),
  });

  const pk = config.key;
  const help = (
    <Section title={wt('git.howLink')} description={gh ? wt('git.howLinkGh') : wt('git.howLinkGl')}>
      <ul className="grid gap-2.5 text-[13px] text-[var(--w-text-2)] sm:grid-cols-3">
        <li className="rounded-[8px] border border-[var(--w-border)] p-3"><GitBranch size={14} className="mb-1.5 text-[var(--w-blue)]" /><div>{wt('git.branchNames')}</div><div className="mt-1">{code(`feature/${pk.toLowerCase()}-12-login`)}</div></li>
        <li className="rounded-[8px] border border-[var(--w-border)] p-3"><GitCommitHorizontal size={14} className="mb-1.5 text-[var(--w-accent)]" /><div>{wt('git.commitMsgs')}</div><div className="mt-1">{code(`${pk}-12 Validate the login form`)}</div></li>
        <li className="rounded-[8px] border border-[var(--w-border)] p-3">{gh ? <GitPullRequest size={14} className="mb-1.5 text-[var(--w-green)]" /> : <GitMerge size={14} className="mb-1.5 text-[var(--w-green)]" />}<div>{gh ? wt('git.prTitles') : wt('git.mrTitles')}</div><div className="mt-1">{code(`${pk}-12: Login page`)}</div></li>
      </ul>
    </Section>
  );

  if (q.isLoading) return <div className="flex justify-center py-10"><Spinner /></div>;
  if (q.isError || !conn) return <p className="text-[13px] text-[var(--w-red-text)]">{workError(q.error, gh ? wt('git.ghLoadFailed') : wt('git.glLoadFailed'))}</p>;

  if (!conn.connected) {
    return (
      <>
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[var(--w-sunken)]"><ProviderIcon provider={provider} size={24} /></span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[16px] font-semibold">{host}</h2>
              <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--w-text-2)]">{gh ? wt('git.ghDesc') : wt('git.glDesc')}</p>
              <ul className="mt-3 grid gap-1.5 text-[13px] text-[var(--w-text-2)] sm:grid-cols-2">
                {[wt('code.featTimeline'), wt('code.featNotify'), wt('code.featSource'), wt('code.featIssues')].map((f) => (
                  <li key={f} className="flex items-start gap-1.5"><Check size={14} className="mt-0.5 shrink-0 text-[var(--w-green)]" /> {f}</li>
                ))}
              </ul>
              <p className="mt-3 text-[12.5px] text-[var(--w-text-3)]">{gh ? wt('git.ghHow') : wt('git.glHow')}</p>
              {canEdit ? (
                <button type="button" className="w-btn w-btn-primary mt-4" disabled={connect.isPending} onClick={() => connect.mutate(false)}>
                  {connect.isPending ? <Spinner size={12} /> : <ProviderIcon provider={provider} size={14} />}
                  {gh ? wt('git.connectGh') : wt('git.connectGl')}
                </button>
              ) : <p className="mt-3 text-[12px] text-[var(--w-text-3)]">{gh ? wt('git.ghOnlyAdmins') : wt('git.glOnlyAdmins')}</p>}
            </div>
          </div>
        </Card>
        <div className="mt-6">{help}</div>
      </>
    );
  }

  const cfg = conn.config ?? {};
  const live = !!conn.lastEventAt;
  const fresh = live && Date.now() - Date.parse(conn.lastEventAt!) < 7 * 86_400_000;
  const open = setupOpen ?? !live;
  const repoUrl = repoValue ? (gh ? `https://github.com/${repoValue}` : `https://gitlab.com/${repoValue}`) : null;
  const hooksUrl = repoValue ? (gh ? `https://github.com/${repoValue}/settings/hooks/new` : `https://gitlab.com/${repoValue}/-/hooks`) : null;
  const tokenUrl = gh ? 'https://github.com/settings/personal-access-tokens/new' : repoValue ? `https://gitlab.com/${repoValue}/-/settings/access_tokens` : 'https://gitlab.com/-/user_settings/personal_access_tokens';
  const codeHref = `/work/${config.workspace.slug}/${config.key}/code`;
  const teamChannels = (channels.data?.channels ?? []).filter((c) => !c.archived && c.kind !== 'CLIENT' && !c.name.startsWith('dm-'));
  const commitRepo = () => {
    const v = repo.trim();
    if (v === repoValue) return;
    if (v && !(gh ? /^[\w.-]+\/[\w.-]+$/ : /^[\w.-]+(\/[\w.-]+)+$/).test(v)) { toast.error(gh ? wt('git.ownerRepo') : wt('git.groupProject')); setRepo(repoValue); return; }
    update.mutate(gh ? { repoFullName: v || null } : { repoPath: v || null });
  };

  return (
    <div className="space-y-6">
      {/* 1 — Trạng thái */}
      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-[var(--w-border)] px-5 py-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[var(--w-sunken)]"><ProviderIcon provider={provider} size={22} /></span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[16px] font-semibold">{host}</h2>
              <span className={cn('inline-flex h-[22px] items-center gap-1.5 rounded-full px-2 text-[12px] font-semibold',
                fresh ? 'bg-[color-mix(in_srgb,var(--w-green)_14%,transparent)] text-[var(--w-green-text)]' : live ? 'bg-[var(--w-sunken)] text-[var(--w-text-2)]' : 'bg-[color-mix(in_srgb,var(--w-yellow)_16%,transparent)] text-[var(--w-yellow-text)]')}>
                <span className={cn('h-1.5 w-1.5 rounded-full', fresh ? 'bg-[var(--w-green)]' : live ? 'bg-[var(--w-text-3)]' : 'bg-[var(--w-yellow)]')} />
                {fresh ? wt('code.stConnected') : live ? wt('code.stQuiet') : wt('code.stWaiting')}
              </span>
            </div>
            <div className="mt-0.5 truncate font-mono text-[13px] text-[var(--w-text-2)]">
              {repoUrl ? <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--w-accent-text)] hover:underline">{repoValue}</a> : wt('code.repoUnknown')}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={codeHref} className="w-btn w-btn-sm"><Code2 size={13} /> {wt('code.openCodePage')}</Link>
            {canEdit && (
              <button type="button" className="w-btn w-btn-sm" disabled={testSend.isPending} onClick={() => testSend.mutate()}>
                {testSend.isPending ? <Spinner size={12} /> : <Send size={13} />} {wt('code.sendTest')}
              </button>
            )}
            {canEdit && <button type="button" className="w-btn w-btn-sm w-btn-danger" onClick={() => setConfirm('disconnect')}><Unplug size={13} /> {wt('git.disconnect')}</button>}
          </div>
        </div>
        <div className="grid divide-y divide-[var(--w-border)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Stat label={wt('code.lastEvent')} value={conn.lastEventAt ? wfmt.relative(conn.lastEventAt) : wt('code.never')} sub={conn.lastEvent ? lastEventText(conn.lastEvent) : conn.lastEventAt ? wfmt.dateTime(conn.lastEventAt) : wt('code.noEventsYet')} />
          <Stat label={wt('code.events24h')} value={wfmt.number(conn.events24h ?? 0)} sub={wt('code.events24hSub')} />
          <Stat label={wt('code.sourceAccess')} value={conn.hasReadToken ? <span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} className="text-[var(--w-green)]" /> {wt('code.tokenOn')}</span> : wt('code.publicOnly')} sub={conn.hasReadToken ? wt('code.tokenOnSub') : wt('code.publicOnlySub')} />
        </div>
        {test && (
          <div className="flex items-start gap-2 border-t border-[var(--w-border)] bg-[var(--w-sunken)] px-5 py-3 text-[12.5px] text-[var(--w-text-2)]">
            <Info size={14} className="mt-0.5 shrink-0" />
            <div>
              <div>{test.bellSent ? wt('code.testBell') : wt('code.testNoBell')} {test.chat.posted ? wt('code.testChat', { c: test.chat.channel ?? '' }) : ''}</div>
              <div className="mt-0.5">{test.notifyEnabled ? wt('code.testWho', { names: test.recipientsOnPush.map((r) => r.name).join(', ') || '—' }) : wt('code.testOff')}</div>
            </div>
          </div>
        )}
      </Card>

      {/* 2 — Cài webhook */}
      <Card>
        <button type="button" className="flex w-full items-center gap-3 px-5 py-4 text-left" onClick={() => setSetupOpen(!open)} aria-expanded={open}>
          <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full', live ? 'bg-[color-mix(in_srgb,var(--w-green)_14%,transparent)] text-[var(--w-green-text)]' : 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]')}>
            {live ? <Check size={14} /> : <GitBranch size={13} />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-semibold">{gh ? wt('git.setupGh') : wt('git.setupGl')}</span>
            <span className="block text-[12.5px] text-[var(--w-text-2)]">{live ? wt('code.setupDone') : wt('code.setupTodo')}</span>
          </span>
          <ChevronDown size={16} className={cn('shrink-0 text-[var(--w-text-3)] transition-transform', open && 'rotate-180')} />
        </button>
        {open && (
          <div className="border-t border-[var(--w-border)] px-5 py-4">
            <ol className="space-y-4">
              <Step n={1} title={gh ? wt('git.openRepoHooks') : wt('git.openProjHooks')}>
                {hooksUrl ? (
                  <a href={hooksUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--w-accent-text)] hover:underline">{hooksUrl.replace('https://', '')} <ExternalLink size={12} /></a>
                ) : gh ? (
                  <>{wt('git.ghGoTo')} <span className="font-medium text-[var(--w-text)]">Settings → Webhooks → Add webhook</span> {wt('git.ghGoTo2')}</>
                ) : (
                  <>{wt('git.glGoTo')} <span className="font-medium text-[var(--w-text)]">Settings → Webhooks → Add new webhook</span>. {wt('git.glSelfHosted')}</>
                )}
              </Step>
              <Step n={2} title={gh ? 'Payload URL' : 'URL'}><CopyField label={gh ? 'Payload URL' : 'Webhook URL'} value={conn.webhookUrl} /></Step>
              {gh && <Step n={3} title="Content type">{wt('git.choose')} {code('application/json')}.</Step>}
              <Step n={gh ? 4 : 3} title={gh ? 'Secret' : 'Secret token'}>
                {gh
                  ? ((conn as GithubConnection).secret ? <CopyField label="Secret" value={(conn as GithubConnection).secret!} secret /> : <span className="text-[var(--w-text-3)]">{wt('git.onlySecret')}</span>)
                  : ((conn as GitlabConnection).token ? <CopyField label="Secret token" value={(conn as GitlabConnection).token!} secret /> : <span className="text-[var(--w-text-3)]">{wt('git.onlyToken')}</span>)}
              </Step>
              <Step n={gh ? 5 : 4} title={gh ? 'Which events would you like to trigger this webhook?' : 'Trigger'}>
                {gh ? <>{wt('git.choose')} <span className="font-medium text-[var(--w-text)]">Let me select individual events</span> {wt('git.andTick')}</> : wt('git.tick')}
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {(gh ? ['Pushes', 'Branch or tag creation', 'Branch or tag deletion', 'Pull requests'] : ['Push events (all branches)', 'Merge request events']).map((e) => (
                    <li key={e} className="inline-flex h-[22px] items-center gap-1 rounded-full border border-[var(--w-border-strong)] px-2 text-[12px] text-[var(--w-text)]"><Check size={11} className="text-[var(--w-green)]" /> {e}</li>
                  ))}
                </ul>
                {!gh && <div className="mt-1.5">{wt('git.keepSsl')} <span className="font-medium text-[var(--w-text)]">Enable SSL verification</span> {wt('git.on')}</div>}
              </Step>
              <Step n={gh ? 6 : 5} title={gh ? wt('git.saveCheck') : wt('git.saveTest')}>
                {live ? (
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--w-green)]" />{wt('git.lastEvent', { t: wfmt.relative(conn.lastEventAt!) })}</span>
                ) : gh ? (
                  <span><span className="font-medium text-[var(--w-text)]">{wt('git.noEvents')}</span> {wt('git.ghPing')} <span className="font-medium text-[var(--w-text)]">Recent Deliveries</span> {wt('git.ghPing2')} <span className="font-medium text-[var(--w-text)]">Redeliver</span>.</span>
                ) : (
                  <span><span className="font-medium text-[var(--w-text)]">{wt('git.noEvents')}</span> {wt('git.glClick')} <span className="font-medium text-[var(--w-text)]">Test → Push events</span> {wt('git.glClick2')}</span>
                )}
              </Step>
            </ol>
            {canEdit && (
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--w-border)] pt-4">
                <button type="button" className="w-btn w-btn-sm" onClick={() => setConfirm('rotate')}><RefreshCw size={13} /> {gh ? wt('git.rotateSecret') : wt('git.rotateToken')}</button>
                <span className="text-[12px] text-[var(--w-text-3)]">{gh ? wt('git.leaked') : wt('git.leakedToken')}</span>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* 3 — Thông báo & kênh chat */}
      <Section title={wt('code.notifyTitle')} description={wt('code.notifyDesc')}>
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-2.5">
              <BellRing size={16} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
              <div>
                <div className="text-[13.5px] font-medium">{wt('code.notifyToggle')}</div>
                <div className="text-[12.5px] text-[var(--w-text-2)]">{wt('code.notifyToggleSub')}</div>
              </div>
            </div>
            <Switch checked={cfg.notify !== false} disabled={!canEdit || activity.isPending} onChange={(v) => activity.mutate({ notify: v })} label={wt('code.notifyToggle')} />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex min-w-0 items-start gap-2.5">
              <MessageSquare size={16} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
              <div>
                <div className="text-[13.5px] font-medium">{wt('code.chatTitle')}</div>
                <div className="text-[12.5px] text-[var(--w-text-2)]">{wt('code.chatSub')}</div>
              </div>
            </div>
            <Select aria-label={wt('code.chatTitle')} className="w-full sm:w-[260px]" disabled={!canEdit || activity.isPending} value={cfg.chatChannelId ?? ''} onChange={(e) => activity.mutate({ chatChannelId: e.target.value ? Number(e.target.value) : null })}>
              <option value="">{wt('code.chatNone')}</option>
              {teamChannels.map((c) => <option key={c.id} value={c.id}>#{c.name}</option>)}
              {cfg.chatChannelId && !teamChannels.some((c) => c.id === cfg.chatChannelId) && <option value={cfg.chatChannelId}>{wt('code.chatMissing')}</option>}
            </Select>
          </div>
          <p className="flex items-start gap-1.5 rounded-[8px] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px] text-[var(--w-text-2)]">
            <Info size={14} className="mt-0.5 shrink-0" /> <span>{wt('code.pullNote')} {wt('code.personalNote')}</span>
          </p>
        </div>
      </Section>

      {/* 4 — Token chỉ đọc */}
      <Section title={wt('code.tokenTitle')} description={gh ? wt('code.tokenDescGh') : wt('code.tokenDescGl')}>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[13px]">
            {conn.hasReadToken
              ? <><ShieldCheck size={15} className="text-[var(--w-green)]" /> <span className="font-medium">{wt('code.tokenSavedState')}</span> <span className="text-[var(--w-text-3)]">{wt('code.tokenHidden')}</span></>
              : <><Lock size={14} className="text-[var(--w-text-3)]" /> <span className="text-[var(--w-text-2)]">{wt('code.tokenNone')}</span></>}
          </div>
          {canEdit && (
            <form className="flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); if (token.trim()) saveToken.mutate(token.trim()); }}>
              <div className="relative min-w-0 flex-1">
                <KeyRound size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
                <input
                  type="password" autoComplete="off" spellCheck={false} className="w-input w-full !pl-8 font-mono !text-[12.5px]"
                  placeholder={gh ? 'github_pat_…' : 'glpat-…'} value={token} onChange={(e) => setToken(e.target.value)} aria-label={wt('code.tokenTitle')} maxLength={400}
                />
              </div>
              <button type="submit" className="w-btn w-btn-primary" disabled={!token.trim() || saveToken.isPending}>{saveToken.isPending && <Spinner size={12} />}{conn.hasReadToken ? wt('code.replaceToken') : wt('code.saveToken')}</button>
              {conn.hasReadToken && <button type="button" className="w-btn w-btn-danger" onClick={() => setConfirm('removeToken')}>{wt('code.removeToken')}</button>}
            </form>
          )}
          <ol className="list-decimal space-y-1 pl-5 text-[12.5px] text-[var(--w-text-2)]">
            <li>{wt('code.tokStep1')} <a href={tokenUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-[var(--w-accent-text)] hover:underline">{gh ? 'Fine-grained tokens' : 'Access tokens'} <ExternalLink size={11} /></a></li>
            <li>{gh ? wt('code.tokStep2Gh', { r: repoValue || 'owner/repo' }) : wt('code.tokStep2Gl')}</li>
            <li>{gh ? wt('code.tokStep3Gh') : wt('code.tokStep3Gl')}</li>
            <li>{wt('code.tokStep4')}</li>
          </ol>
        </div>
      </Section>

      {/* 5 — Repo + tự chuyển trạng thái */}
      <Section title={gh ? wt('git.repository') : wt('git.projectPath')} description={gh ? wt('git.repoDesc') : wt('git.pathDesc')}>
        <div className="flex max-w-[520px] items-center gap-2">
          <input
            className="w-input min-w-0 flex-1 font-mono !text-[12.5px]" placeholder={gh ? 'owner/repo' : 'group/project'} value={repo} maxLength={200} disabled={!canEdit}
            onChange={(e) => setRepo(e.target.value)} onBlur={commitRepo}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'Enter') e.currentTarget.blur();
              if (e.key === 'Escape') { setRepo(repoValue); e.currentTarget.blur(); }
            }}
            aria-label={gh ? wt('git.repoName') : wt('git.glPath')} spellCheck={false}
          />
          {update.isPending && <Spinner size={12} />}
        </div>
      </Section>

      <Section title={wt('git.autoTransitions')} description={gh ? wt('git.autoDescGh') : wt('git.autoDescGl')}>
        <div className="space-y-3">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-[13px]">{gh ? wt('git.prOpened') : wt('git.mrOpened')}</span>
            <StatusSelect config={config} label={gh ? wt('git.prOpenedAria') : wt('git.mrOpenedAria')} value={(gh ? cfg.prOpenedStatusId : cfg.mrOpenedStatusId) ?? null} disabled={!canEdit || update.isPending}
              onChange={(v) => update.mutate(gh ? { prOpenedStatusId: v } : { mrOpenedStatusId: v })} />
          </div>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-[13px]">{gh ? wt('git.prMerged') : wt('git.mrMerged')}</span>
            <StatusSelect config={config} label={gh ? wt('git.prMergedAria') : wt('git.mrMergedAria')} value={(gh ? cfg.prMergedStatusId : cfg.mrMergedStatusId) ?? null} disabled={!canEdit || update.isPending}
              onChange={(v) => update.mutate(gh ? { prMergedStatusId: v } : { mrMergedStatusId: v })} />
          </div>
        </div>
      </Section>

      {help}

      <ConfirmDialog open={confirm === 'rotate'} onClose={() => setConfirm(null)} title={gh ? wt('git.rotateSecretQ') : wt('git.rotateTokenQ')}
        body={gh ? wt('git.rotateSecretBody') : wt('git.rotateTokenBody')} confirmLabel={gh ? wt('git.rotateSecret') : wt('git.rotateToken')}
        pending={connect.isPending} onConfirm={() => connect.mutate(true)} />
      <ConfirmDialog open={confirm === 'disconnect'} onClose={() => setConfirm(null)} title={gh ? wt('git.disconnectGhQ') : wt('git.disconnectGlQ')}
        body={gh ? wt('git.disconnectGhBody') : wt('git.disconnectGlBody')} confirmLabel={wt('git.disconnect')}
        pending={disconnect.isPending} onConfirm={() => disconnect.mutate()} />
      <ConfirmDialog open={confirm === 'removeToken'} onClose={() => setConfirm(null)} title={wt('code.removeTokenQ')}
        body={wt('code.removeTokenBody')} confirmLabel={wt('code.removeToken')}
        pending={saveToken.isPending} onConfirm={() => saveToken.mutate(null)} />
    </div>
  );
}
