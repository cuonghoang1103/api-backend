'use client';

/**
 * CTW đợt 7b (C14 / CTW-26) — trang Intake: Hộp đề xuất (email / Discord / Zalo OA ⇒ ĐỀ XUẤT chờ duyệt — không bao giờ
 * thành thẻ thẳng) + Kênh (cấu hình, URL webhook, hướng dẫn cài từng dịch vụ, gửi thử giả lập). Máy chủ quyết quyền:
 * ADMIN cấu hình kênh; ADMIN/MEMBER duyệt; agent không duyệt.
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, Copy, FlaskConical, Hash, Mail, MessageCircle, Plus, RefreshCw, Send, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { workIntakeApi, type IntakeChannel, type IntakeKind, type Proposal } from '@/lib/work-ctw7b-api';
import { Dialog, EmptyState, PageLoading, Spinner } from '../ui';
import { useWT, type WKey } from '../i18n';

const keys = { ch: (pid: number) => ['c7b-intake-ch', pid] as const, pr: (pid: number, s: string) => ['c7b-intake-pr', pid, s] as const };
const KIND_LABEL: Record<IntakeKind, WKey> = { EMAIL: 'c7b.chEmail', DISCORD: 'c7b.chDiscord', ZALO: 'c7b.chZalo' };
const KIND_ICON = { EMAIL: Mail, DISCORD: MessageCircle, ZALO: Send } as const;

export default function IntakeView({ config, pid, tab }: { config: ProjectConfig; pid: number; tab: 'inbox' | 'channels' }) {
  return tab === 'channels' ? <Channels pid={pid} /> : <Inbox config={config} pid={pid} />;
}

// ─── Hộp đề xuất ─────────────────────────────────────────────────

function Inbox({ config, pid }: { config: ProjectConfig; pid: number }) {
  const { t, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const [status, setStatus] = useState<Proposal['status']>('PENDING');
  const q = useQuery({ queryKey: keys.pr(pid, status), queryFn: () => workIntakeApi.proposals(pid, status) });
  const [accepting, setAccepting] = useState<Proposal | null>(null);
  const reject = useMutation({
    mutationFn: (id: number) => workIntakeApi.decide(pid, id, { decision: 'REJECT' }),
    onSuccess: () => { toast.success(t('c7b.rejected')); qc.invalidateQueries({ queryKey: ['c7b-intake-pr', pid] }); qc.invalidateQueries({ queryKey: keys.ch(pid) }); },
    onError: (e) => toast.error(workError(e)),
  });
  if (q.isLoading) return <PageLoading />;
  if (q.error || !q.data) return <EmptyState title={t('c7b.loadFailed')} body={workError(q.error)} />;
  return (
    <div className="space-y-3">
      <div className="w-seg inline-flex" role="tablist" aria-label={t('c7b.inbox')}>
        {(['PENDING', 'ACCEPTED', 'REJECTED'] as const).map((s) => (
          <button key={s} type="button" role="tab" aria-selected={status === s} className={cn('w-btn w-btn-sm', status === s && 'w-btn-on')} onClick={() => setStatus(s)}>
            {t(`c7b.pr${s}` as WKey)} <span className="w-count">{q.data.counts[s] ?? 0}</span>
          </button>
        ))}
      </div>
      {q.data.proposals.length ? (
        <ul className="space-y-2" data-testid="c7b-proposals">
          {q.data.proposals.map((p) => {
            const Icon = p.source === 'SLACK' ? Hash : KIND_ICON[p.source];
            return (
              <li key={p.id} className="w-card p-3">
                <div className="flex flex-wrap items-start gap-2">
                  <Icon size={15} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium">{p.title}{p.simulated && <span className="ml-2 rounded bg-[var(--w-sunken)] px-1.5 py-0.5 text-[11px] text-[var(--w-text-3)]">{t('c7b.testMsg')}</span>}</p>
                    <p className="text-[12px] text-[var(--w-text-3)]">{p.source === 'SLACK' ? 'Slack' : t(KIND_LABEL[p.source])} · {p.sender ?? p.senderName ?? p.senderHandle ?? t('c7b.unknownSender')} · {fmtDateTime(p.createdAt)}</p>
                    {p.body && <p className="mt-1.5 line-clamp-4 whitespace-pre-line text-[13px] text-[var(--w-text-2)]">{p.body}</p>}
                    {p.status !== 'PENDING' && <p className="mt-1.5 text-[12px] text-[var(--w-text-3)]">{p.status === 'ACCEPTED' ? t('c7b.acceptedAs', { key: p.issue?.key ?? '—', who: p.decidedBy ?? '' }) : t('c7b.rejectedBy', { who: p.decidedBy ?? '' })}{p.decisionNote ? ` — ${p.decisionNote}` : ''}</p>}
                  </div>
                  {p.status === 'PENDING' && q.data.canDecide && (
                    <div className="flex gap-1.5">
                      <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setAccepting(p)} data-testid={`c7b-accept-${p.id}`}><Check size={13} /> {t('c7b.accept')}</button>
                      <button type="button" className="w-btn w-btn-sm" onClick={() => reject.mutate(p.id)} disabled={reject.isPending}><X size={13} /> {t('c7b.reject')}</button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : <EmptyState title={t('c7b.inboxEmpty')} body={t('c7b.inboxEmptyBody')} />}
      {accepting && <AcceptDialog config={config} pid={pid} p={accepting} onClose={() => setAccepting(null)} />}
    </div>
  );
}

function AcceptDialog({ config, pid, p, onClose }: { config: ProjectConfig; pid: number; p: Proposal; onClose: () => void }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [title, setTitle] = useState(p.title);
  const [typeKey, setTypeKey] = useState('');
  const [assignee, setAssignee] = useState('');
  const go = useMutation({
    mutationFn: () => workIntakeApi.decide(pid, p.id, { decision: 'ACCEPT', title, typeKey: typeKey || undefined, assigneeId: assignee ? Number(assignee) : null }),
    onSuccess: (r) => { toast.success(t('c7b.createdIssue', { key: r.issue?.key ?? '' })); qc.invalidateQueries({ queryKey: ['c7b-intake-pr', pid] }); qc.invalidateQueries({ queryKey: keys.ch(pid) }); onClose(); },
    onError: (e) => toast.error(workError(e)),
  });
  return (
    <Dialog open onClose={onClose} title={t('c7b.acceptTitle')} footer={(
      <>
        <button type="button" className="w-btn w-btn-ghost" onClick={onClose}>{t('common.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!title.trim() || go.isPending} onClick={() => go.mutate()} data-testid="c7b-accept-confirm">{go.isPending && <Spinner size={12} />} {t('c7b.createIssue')}</button>
      </>
    )}>
      <div className="space-y-3">
        <label className="block"><span className="w-label">{t('c7b.fTitle')}</span><input className="w-input" value={title} maxLength={255} onChange={(e) => setTitle(e.target.value)} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="w-label">{t('c7b.mapType')}</span>
            <select className="w-input" value={typeKey} onChange={(e) => setTypeKey(e.target.value)}>
              <option value="">{t('c7b.mapTypeDefault')}</option>
              {config.issueTypes.filter((x) => x.level === 0).map((x) => <option key={x.id} value={x.key}>{x.name}</option>)}
            </select>
          </label>
          <label className="block"><span className="w-label">{t('c7b.mapAssignee')}</span>
            <select className="w-input" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
              <option value="">{t('c7b.unassigned')}</option>
              {config.members.filter((m) => m.role !== 'CLIENT').map((m) => <option key={m.id} value={m.id}>{m.displayName ?? m.fullName ?? m.username}</option>)}
            </select>
          </label>
        </div>
        {p.body && <p className="max-h-40 overflow-y-auto whitespace-pre-line rounded-[8px] bg-[var(--w-sunken)] p-3 text-[12.5px] text-[var(--w-text-2)]">{p.body}</p>}
      </div>
    </Dialog>
  );
}

// ─── Kênh ────────────────────────────────────────────────────────

function Channels({ pid }: { pid: number }) {
  const { t } = useWT();
  const q = useQuery({ queryKey: keys.ch(pid), queryFn: () => workIntakeApi.channels(pid) });
  const [adding, setAdding] = useState<IntakeKind | null>(null);
  if (q.isLoading) return <PageLoading />;
  if (q.error || !q.data) return <EmptyState title={t('c7b.loadFailed')} body={workError(q.error)} />;
  return (
    <div className="space-y-4">
      <p className="text-[13px] text-[var(--w-text-2)]">{t('c7b.channelsIntro')}</p>
      {q.data.canConfigure && (
        <div className="flex flex-wrap gap-2">
          {(['EMAIL', 'DISCORD', 'ZALO'] as const).map((k) => { const Icon = KIND_ICON[k]; return <button key={k} type="button" className="w-btn w-btn-sm" onClick={() => setAdding(k)} data-testid={`c7b-add-${k}`}><Plus size={13} /><Icon size={13} /> {t(KIND_LABEL[k])}</button>; })}
        </div>
      )}
      {q.data.channels.length ? q.data.channels.map((c) => <ChannelCard key={c.id} pid={pid} c={c} canConfigure={q.data.canConfigure} />)
        : <EmptyState title={t('c7b.noChannels')} body={q.data.canConfigure ? t('c7b.noChannelsBody') : t('c7b.askAdmin')} />}
      {adding && <ChannelDialog pid={pid} kind={adding} onClose={() => setAdding(null)} />}
    </div>
  );
}

function Guide({ kind }: { kind: IntakeKind }) {
  const { t } = useWT();
  const steps: WKey[] = kind === 'EMAIL' ? ['c7b.gEmail1', 'c7b.gEmail2', 'c7b.gEmail3', 'c7b.gEmail4'] : kind === 'DISCORD' ? ['c7b.gDiscord1', 'c7b.gDiscord2', 'c7b.gDiscord3', 'c7b.gDiscord4'] : ['c7b.gZalo1', 'c7b.gZalo2', 'c7b.gZalo3', 'c7b.gZalo4'];
  return (
    <details className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] p-3 text-[12.5px]">
      <summary className="cursor-pointer font-medium">{t('c7b.howToSetUp')}</summary>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-[var(--w-text-2)]">{steps.map((s) => <li key={s}>{t(s)}</li>)}</ol>
      {kind === 'DISCORD' && (
        <pre className="w-codeblock mt-2 overflow-x-auto whitespace-pre text-[11.5px]">{`curl -X POST https://discord.com/api/v10/applications/<APP_ID>/commands \\
  -H "Authorization: Bot <BOT_TOKEN>" -H "Content-Type: application/json" \\
  -d '{"name":"ctwork","description":"CT Work","options":[{"type":1,"name":"new","description":"Propose an issue","options":[{"type":3,"name":"title","description":"Short summary","required":true},{"type":3,"name":"details","description":"Details"}]}]}'`}</pre>
      )}
      <p className="mt-2 text-[var(--w-text-3)]">{t('c7b.gSecurity')}</p>
    </details>
  );
}

function ChannelDialog({ pid, kind, onClose }: { pid: number; kind: IntakeKind; onClose: () => void }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [v, setV] = useState({ name: '', address: '', publicKey: '', applicationId: '', appId: '', oaId: '', prefix: '#task', secret: '' });
  const go = useMutation({
    mutationFn: () => workIntakeApi.create(pid, {
      kind, ...(v.name ? { name: v.name } : {}),
      ...(kind === 'EMAIL' ? { address: v.address, ...(v.secret ? { secret: v.secret } : {}) } : {}),
      ...(kind === 'DISCORD' ? { publicKey: v.publicKey, ...(v.applicationId ? { applicationId: v.applicationId } : {}) } : {}),
      ...(kind === 'ZALO' ? { appId: v.appId, oaId: v.oaId, prefix: v.prefix, ...(v.secret ? { secret: v.secret } : {}) } : {}),
    }),
    onSuccess: () => { toast.success(t('c7b.channelAdded')); qc.invalidateQueries({ queryKey: keys.ch(pid) }); onClose(); },
    onError: (e) => toast.error(workError(e)),
  });
  const inp = (k: keyof typeof v, label: WKey, ph?: string, type = 'text') => (
    <label className="block"><span className="w-label">{t(label)}</span><input className="w-input" type={type} autoComplete="off" value={v[k]} placeholder={ph} onChange={(e) => setV({ ...v, [k]: e.target.value })} /></label>
  );
  return (
    <Dialog open onClose={onClose} width={600} title={t('c7b.addChannelT', { k: t(KIND_LABEL[kind]) })} footer={(
      <>
        <button type="button" className="w-btn w-btn-ghost" onClick={onClose}>{t('common.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={go.isPending} onClick={() => go.mutate()} data-testid="c7b-channel-save">{go.isPending && <Spinner size={12} />} {t('c7b.addChannel')}</button>
      </>
    )}>
      <div className="space-y-3">
        <Guide kind={kind} />
        {inp('name', 'c7b.chName', t(KIND_LABEL[kind]))}
        {kind === 'EMAIL' && <>{inp('address', 'c7b.chAddress', 'requests-hd@inbound.example.com')}{inp('secret', 'c7b.chSvixSecret', 'whsec_…', 'password')}</>}
        {kind === 'DISCORD' && <>{inp('publicKey', 'c7b.chPublicKey', '64 hex')}{inp('applicationId', 'c7b.chAppIdDiscord')}</>}
        {kind === 'ZALO' && <>{inp('appId', 'c7b.chZaloAppId')}{inp('oaId', 'c7b.chZaloOaId')}{inp('secret', 'c7b.chZaloSecret', '', 'password')}{inp('prefix', 'c7b.chPrefix', '#task')}</>}
      </div>
    </Dialog>
  );
}

function ChannelCard({ pid, c, canConfigure }: { pid: number; c: IntakeChannel; canConfigure: boolean }) {
  const { t, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: keys.ch(pid) });
  const [secret, setSecret] = useState('');
  const [simTitle, setSimTitle] = useState('');
  const upd = useMutation({ mutationFn: (b: Parameters<typeof workIntakeApi.update>[2]) => workIntakeApi.update(pid, c.id, b), onSuccess: () => { toast.success(t('c7b.saved')); setSecret(''); refresh(); }, onError: (e) => toast.error(workError(e)) });
  const rot = useMutation({ mutationFn: () => workIntakeApi.rotate(pid, c.id), onSuccess: () => { toast.success(t('c7b.linkRotated')); refresh(); }, onError: (e) => toast.error(workError(e)) });
  const del = useMutation({ mutationFn: () => workIntakeApi.remove(pid, c.id), onSuccess: refresh, onError: (e) => toast.error(workError(e)) });
  const sim = useMutation({
    mutationFn: () => workIntakeApi.simulate(pid, c.id, { title: simTitle.trim() }),
    onSuccess: () => { toast.success(t('c7b.simSent')); setSimTitle(''); refresh(); qc.invalidateQueries({ queryKey: ['c7b-intake-pr', pid] }); },
    onError: (e) => toast.error(workError(e)),
  });
  const Icon = KIND_ICON[c.kind];
  return (
    <section className="w-card p-4" aria-label={c.name} data-testid={`c7b-channel-${c.kind}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Icon size={16} className="text-[var(--w-text-3)]" aria-hidden="true" />
        <h3 className="text-[14px] font-semibold">{c.name}</h3>
        <span className="text-[12px] text-[var(--w-text-3)]">{t(KIND_LABEL[c.kind])}</span>
        {canConfigure && <span className={cn('text-[12px] font-medium', c.ready ? 'text-[var(--w-green-text)]' : 'text-[var(--w-orange-text)]')}>{c.ready ? t('c7b.ready') : t('c7b.notReady')}</span>}
        <span className="ml-auto text-[12px] text-[var(--w-text-2)]">{t('c7b.nPending', { count: c.pending })}</span>
        {canConfigure && <label className="flex items-center gap-1 text-[12.5px]"><input type="checkbox" checked={c.enabled} onChange={(e) => upd.mutate({ enabled: e.target.checked })} /> {t('c7b.enabled')}</label>}
      </div>
      {canConfigure && c.webhookUrl && (
        <div className="mt-3 space-y-3">
          <div className="flex min-w-0 items-center gap-2 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px]">
            <span className="shrink-0 text-[var(--w-text-3)]">{t('c7b.webhookUrl')}</span>
            <code className="min-w-0 flex-1 truncate">{c.webhookUrl}</code>
            <button type="button" className="w-btn w-btn-sm w-btn-ghost" onClick={() => { void navigator.clipboard?.writeText(c.webhookUrl!); toast.success(t('c7b.copied')); }}><Copy size={13} /> {t('c7b.copy')}</button>
          </div>
          <dl className="grid gap-x-4 gap-y-1 text-[12.5px] sm:grid-cols-2">
            {c.address && <><dt className="text-[var(--w-text-3)]">{t('c7b.chAddress')}</dt><dd className="truncate">{c.address}</dd></>}
            {c.publicKey && <><dt className="text-[var(--w-text-3)]">{t('c7b.chPublicKey')}</dt><dd className="truncate font-mono">{c.publicKey}</dd></>}
            {c.appId && <><dt className="text-[var(--w-text-3)]">{t('c7b.chZaloAppId')}</dt><dd>{c.appId}</dd></>}
            {c.kind === 'ZALO' && <><dt className="text-[var(--w-text-3)]">{t('c7b.chPrefix')}</dt><dd>{c.prefix || t('c7b.everyMessage')}</dd></>}
            {c.kind !== 'DISCORD' && <><dt className="text-[var(--w-text-3)]">{t('c7b.secret')}</dt><dd>{c.secretSet ? c.secretMasked : t('c7b.secretNotSet')}</dd></>}
            <dt className="text-[var(--w-text-3)]">{t('c7b.lastEvent')}</dt><dd>{c.lastEventAt ? fmtDateTime(c.lastEventAt) : '—'}</dd>
          </dl>
          {c.lastError && <p className="text-[12.5px] text-[var(--w-orange-text)]" role="status">{c.lastError}</p>}
          {c.kind !== 'DISCORD' && (
            <div className="flex flex-wrap items-end gap-2">
              <label className="block min-w-[220px] flex-1"><span className="w-label">{t(c.kind === 'EMAIL' ? 'c7b.chSvixSecret' : 'c7b.chZaloSecret')}</span><input className="w-input" type="password" autoComplete="off" value={secret} onChange={(e) => setSecret(e.target.value)} /></label>
              <button type="button" className="w-btn w-btn-sm" disabled={!secret || upd.isPending} onClick={() => upd.mutate({ secret })}>{t('c7b.saveSecret')}</button>
            </div>
          )}
          <div className="flex flex-wrap items-end gap-2 border-t border-[var(--w-border)] pt-3">
            <label className="block min-w-[220px] flex-1"><span className="w-label">{t('c7b.simTitle')}</span><input className="w-input" value={simTitle} maxLength={255} placeholder={t('c7b.simPh')} onChange={(e) => setSimTitle(e.target.value)} /></label>
            <button type="button" className="w-btn w-btn-sm" disabled={!simTitle.trim() || sim.isPending} onClick={() => sim.mutate()} data-testid="c7b-simulate"><FlaskConical size={13} /> {t('c7b.simulate')}</button>
            <button type="button" className="w-btn w-btn-sm w-btn-ghost" onClick={() => { if (window.confirm(t('c7b.rotateQ'))) rot.mutate(); }}><RefreshCw size={13} /> {t('c7b.rotate')}</button>
            <button type="button" className="w-btn w-btn-sm w-btn-ghost w-btn-danger" onClick={() => { if (window.confirm(t('c7b.deleteChannelQ'))) del.mutate(); }}><Trash2 size={13} /> {t('c7b.remove')}</button>
          </div>
          <Guide kind={c.kind} />
        </div>
      )}
    </section>
  );
}
