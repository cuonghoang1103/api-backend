'use client';

/**
 * Trang "Code" của dự án: đầu trang (repo + số liệu: commit 7 ngày, PR mở, người đóng góp, biểu đồ 30 ngày) + bốn tab
 * Hoạt động · Nhánh · Pull request · Mã nguồn. Trạng thái nằm trên URL (?tab=&ref=&path=&commit=&pr=&event=&issue=)
 * để thông báo / panel Development mở thẳng đúng chỗ.
 */

import { useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Code2, ExternalLink, GitPullRequest, History, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import KpiTile, { KpiRow } from '../KpiTile';
import { EmptyState, PageLoading, UserAvatar } from '../ui';
import { wt, wfmt } from '../i18n';
import { safeHref } from './codeText';
import { codeApi, codeKeys, type CodeOverview } from './codeApi';
import { ProviderIcon } from './parts';
import ActivityTab from './ActivityTab';
import BranchesTab from './BranchesTab';
import PullsTab from './PullsTab';
import SourceTab from './SourceTab';

const TABS = ['activity', 'branches', 'pulls', 'source'] as const;
type Tab = (typeof TABS)[number];
const TAB_LABEL: Record<Tab, () => string> = { activity: () => wt('code.tActivity'), branches: () => wt('code.tBranches'), pulls: () => wt('code.tPulls'), source: () => wt('code.tSource') };

function DailyChart({ daily }: { daily: CodeOverview['stats']['daily'] }) {
  const max = Math.max(1, ...daily.map((d) => d.commits));
  return (
    <div className="flex min-w-0 flex-col rounded-[10px] border border-[var(--w-border)] bg-[var(--w-raised)] px-3.5 py-3 shadow-[var(--w-shadow-card)]">
      <span className="text-[12px] font-medium text-[var(--w-text-2)]">{wt('code.daily30')}</span>
      <div className="mt-2 flex h-[44px] items-end gap-[3px]" role="img" aria-label={wt('code.dailyAria', { n: daily.reduce((s, d) => s + d.commits, 0) })}>
        {daily.map((d) => (
          <span
            key={d.day}
            title={`${wfmt.date(`${d.day}T12:00:00`, { day: 'numeric', month: 'short' })}: ${wt('code.nCommits', { count: d.commits })}${d.pushes ? ` · ${wt('code.nPushes', { count: d.pushes })}` : ''}`}
            className={cn('min-w-0 flex-1 rounded-[2px]', d.commits ? 'bg-[var(--w-accent)]' : 'bg-[var(--w-sunken)]')}
            style={{ height: `${d.commits ? Math.max(12, (d.commits / max) * 100) : 8}%`, opacity: d.commits ? 0.45 + 0.55 * (d.commits / max) : 1 }}
          />
        ))}
      </div>
    </div>
  );
}

function Header({ o, settingsHref }: { o: CodeOverview; settingsHref: string }) {
  const people = o.stats.contributors30d;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {o.providers.map((p) => (
          <span key={p.provider} className="inline-flex min-w-0 items-center gap-2 text-[14px] font-semibold">
            <ProviderIcon provider={p.provider} size={17} />
            {p.webUrl ? <a href={safeHref(p.webUrl)} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">{p.repo}</a> : <span className="text-[var(--w-text-2)]">{wt('code.repoUnknown')}</span>}
            {p.webUrl && <ExternalLink size={12} className="text-[var(--w-text-3)]" aria-hidden="true" />}
            <span className="inline-flex items-center gap-1.5 text-[12px] font-normal text-[var(--w-text-3)]">
              <span className={cn('h-2 w-2 rounded-full', p.lastEventAt && Date.now() - Date.parse(p.lastEventAt) < 7 * 86_400_000 ? 'bg-[var(--w-green)]' : 'bg-[var(--w-text-3)]')} aria-hidden="true" />
              {p.lastEventAt ? wt('code.lastEventAgo', { t: wfmt.relative(p.lastEventAt) }) : wt('code.noEventsYet')}
            </span>
          </span>
        ))}
        {o.canManage && (
          <Link href={settingsHref} className="w-btn w-btn-sm ml-auto"><Settings size={13} /> {wt('code.settings')}</Link>
        )}
      </div>
      <div className="grid gap-2 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <KpiRow min={130} label={wt('code.statsAria')}>
          <KpiTile label={wt('code.kCommits7')} value={wfmt.number(o.stats.commits7d)} hint={wt('code.nPushes', { count: o.stats.pushes7d })} />
          <KpiTile label={wt('code.kOpenPrs')} value={wfmt.number(o.stats.openPrs)} tone={o.stats.openPrs ? 'green' : undefined} hint={<span className="inline-flex items-center gap-1"><GitPullRequest size={11} /> {wt('code.awaitingReview')}</span>} />
          <KpiTile
            label={wt('code.kContributors')}
            value={wfmt.number(people.length)}
            hint={people.length ? (
              <span className="flex -space-x-1.5 pt-0.5">
                {people.slice(0, 6).map((p) => (p.user
                  ? <UserAvatar key={p.key} user={p.user} size={18} className="ring-2 ring-[var(--w-raised)]" />
                  : <span key={p.key} title={p.label} className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-dashed border-[var(--w-border-strong)] bg-[var(--w-sunken)] text-[9px] font-semibold text-[var(--w-text-3)] ring-2 ring-[var(--w-raised)]">{p.label.slice(0, 1).toUpperCase()}</span>))}
              </span>
            ) : <span className="inline-flex items-center gap-1"><Users size={11} /> {wt('code.last30')}</span>}
            title={people.map((p) => (p.user ? userName(p.user) : p.label)).join(', ')}
          />
        </KpiRow>
        <DailyChart daily={o.stats.daily} />
      </div>
    </div>
  );
}

export default function CodeView({ config, pid, onOpenIssue }: { config: ProjectConfig; pid: number; onOpenIssue: (n: number) => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const setParam = useCallback((patch: Record<string, string | null>, push = false) => {
    const p = new URLSearchParams(search?.toString());
    for (const [k, v] of Object.entries(patch)) { if (v === null || v === '') p.delete(k); else p.set(k, v); }
    const s = p.toString();
    (push ? router.push : router.replace)(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [router, pathname, search]);

  const raw = search?.get('tab');
  const tab: Tab = TABS.includes(raw as Tab) ? (raw as Tab) : 'activity';
  const o = useQuery({ queryKey: codeKeys.overview(pid), queryFn: () => codeApi.overview(pid), staleTime: 30_000, refetchInterval: 120_000 });
  const settingsHref = `/work/${config.workspace.slug}/${config.key}/settings?tab=${o.data?.providers[0]?.provider === 'GITLAB' ? 'gitlab' : 'github'}`;

  if (o.isLoading) return <PageLoading />;
  if (o.isError || !o.data) return <EmptyState title={wt('code.loadFailed')} body={workError(o.error)} />;
  if (!o.data.connected) {
    return (
      <EmptyState
        icon={<Code2 size={28} />}
        title={wt('code.notConnected')}
        body={o.data.canManage ? wt('code.notConnectedAdmin') : wt('code.notConnectedMember')}
        action={o.data.canManage ? <Link href={settingsHref} className="w-btn w-btn-primary">{wt('code.connectRepo')}</Link> : undefined}
      />
    );
  }

  const go = (t: Tab, extra: Record<string, string | null> = {}) => setParam({ tab: t === 'activity' ? null : t, event: null, pr: null, commit: null, history: null, ...extra }, true);
  const openCommit = (sha: string) => go('source', { commit: sha });
  const openRef = (ref: string) => go('source', { ref, path: null });

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-5 p-4 md:p-6">
      <Header o={o.data} settingsHref={settingsHref} />
      <div className="border-b border-[var(--w-border)]">
        <div className="-mb-px flex gap-1 overflow-x-auto" role="tablist" aria-label={wt('code.title')}>
          {TABS.map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => go(t)} data-testid={`code-tab-${t}`}
              disabled={t === 'source' && !o.data!.canViewSource}
              className={cn('whitespace-nowrap border-b-2 px-3 py-2.5 text-[13.5px] font-medium transition-colors disabled:opacity-50',
                tab === t ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
              {TAB_LABEL[t]()}
              {t === 'pulls' && o.data!.stats.openPrs > 0 && <span className="ml-1.5 rounded-full bg-[var(--w-sunken)] px-1.5 text-[11px] tabular-nums text-[var(--w-text-2)]">{o.data!.stats.openPrs}</span>}
            </button>
          ))}
        </div>
      </div>
      {o.data.trackedSince && tab === 'activity' && (
        <p className="-mt-2 flex items-center gap-1.5 text-[12px] text-[var(--w-text-3)]"><History size={12} aria-hidden="true" /> {wt('code.trackedSince', { d: wfmt.date(o.data.trackedSince) })}</p>
      )}

      {tab === 'activity' && (
        <ActivityTab pid={pid} projectKey={config.key} initialEvent={search?.get('event') ?? null} onIssue={onOpenIssue} onCommit={openCommit} onBranchSource={openRef} />
      )}
      {tab === 'branches' && (
        <BranchesTab pid={pid} projectKey={config.key} onIssue={onOpenIssue} onSource={openRef} onCommit={openCommit} onPulls={() => go('pulls')} />
      )}
      {tab === 'pulls' && (
        <PullsTab
          pid={pid} projectKey={config.key} onIssue={onOpenIssue} onSource={openRef}
          state={(['open', 'merged', 'closed', 'all'].includes(search?.get('state') ?? '') ? search!.get('state') : search?.get('pr') ? 'all' : 'open') as 'open' | 'merged' | 'closed' | 'all'}
          onState={(s) => setParam({ state: s === 'open' ? null : s, pr: null })}
          focus={Number(search?.get('pr')) || null}
        />
      )}
      {tab === 'source' && (
        <SourceTab
          pid={pid} projectKey={config.key} settingsHref={settingsHref} canManage={o.data.canManage}
          refName={search?.get('ref') || null} path={search?.get('path') ?? ''} commit={search?.get('commit') || null} history={search?.get('history') === '1'}
          onIssue={onOpenIssue}
          onNav={(p) => setParam({
            ...(p.ref !== undefined ? { ref: p.ref } : {}), ...(p.path !== undefined ? { path: p.path } : {}),
            ...(p.commit !== undefined ? { commit: p.commit } : {}), ...(p.history !== undefined ? { history: p.history ? '1' : null } : {}),
          }, true)}
        />
      )}
    </div>
  );
}
