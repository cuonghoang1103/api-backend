'use client';

/**
 * CTW đợt 8b — Slack: cài app cho KHÔNG GIAN (OAuth v2 qua khung 8a; OWNER/ADMIN), nối kênh cho DỰ ÁN (ADMIN dự án): sự kiện
 * thông báo + nhận lệnh `/ctwork new` (thành đề xuất chờ duyệt ở Intake). Thiếu env ⇒ ẩn nút, có ghi chú.
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Copy, Hash, Link2, Plus, Send, Trash2, Unplug } from 'lucide-react';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { beginConnect } from '@/lib/work-c8a-api';
import { SLACK_EVENTS, slackApi } from '@/lib/work-c8b-api';
import { EmptyState, PageLoading, Spinner } from '../ui';
import { useWT, type WKey } from '../i18n';

export default function SlackPanel({ config, pid }: { config: ProjectConfig; pid: number }) {
  const { t, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const wsid = config.workspace.id;
  const ws = useQuery({ queryKey: ['c8b-slack-ws', wsid], queryFn: () => slackApi.workspace(wsid) });
  const pj = useQuery({ queryKey: ['c8b-slack-pj', pid], queryFn: () => slackApi.project(pid) });
  const [adding, setAdding] = useState(false);
  const refresh = () => { void qc.invalidateQueries({ queryKey: ['c8b-slack-ws', wsid] }); void qc.invalidateQueries({ queryKey: ['c8b-slack-pj', pid] }); };
  const link = useMutation({ mutationFn: () => slackApi.link(wsid), onSuccess: () => { refresh(); toast.success(t('c8b.slackLinked')); }, onError: (e) => toast.error(workError(e)) });
  const unlink = useMutation({ mutationFn: () => slackApi.unlink(wsid), onSuccess: refresh, onError: (e) => toast.error(workError(e)) });
  const test = useMutation({ mutationFn: (id: number) => slackApi.test(pid, id), onSuccess: () => toast.success(t('c8b.testSent')), onError: (e) => toast.error(workError(e)) });
  const remove = useMutation({ mutationFn: (id: number) => slackApi.remove(pid, id), onSuccess: refresh, onError: (e) => toast.error(workError(e)) });
  const upd = useMutation({ mutationFn: (a: { id: number; body: Parameters<typeof slackApi.update>[2] }) => slackApi.update(pid, a.id, a.body), onSuccess: refresh, onError: (e) => toast.error(workError(e)) });

  if (ws.isLoading || pj.isLoading) return <PageLoading rows={3} />;
  if (ws.error || pj.error || !ws.data || !pj.data) return <EmptyState title={t('c8b.loadFailed')} body={workError(ws.error ?? pj.error)} />;
  const w = ws.data, p = pj.data;
  const back = `/work/${config.workspace.slug}/${config.key}/connect?tab=slack`;
  const copy = (s: string) => void navigator.clipboard.writeText(s).then(() => toast.success(t('c8b.copied')));

  return (
    <div className="space-y-4">
      <section className="w-card space-y-2 p-4 text-[13px]" aria-label={t('c8b.slackWs')}>
        <h2 className="w-section-title">{t('c8b.slackWs')}</h2>
        {!w.configured.oauth ? (
          <p className="text-[var(--w-text-2)]" data-testid="c8b-slack-off">{t('c8b.slackOff')}</p>
        ) : w.install ? (
          <div className="flex flex-wrap items-center gap-2">
            <p className="min-w-0 flex-1">{t('c8b.slackInstalled', { team: w.install.teamName, by: w.install.installedBy ?? '—' })}</p>
            {w.canManage && <button type="button" className="w-btn w-btn-sm" onClick={() => window.confirm(t('c8b.unlinkConfirm')) && unlink.mutate()}><Unplug size={12} /> {t('c8b.unlink')}</button>}
          </div>
        ) : w.canManage ? (
          <div className="flex flex-wrap items-center gap-2">
            <p className="min-w-0 flex-1 text-[var(--w-text-2)]">{t('c8b.slackInstallHint')}</p>
            {w.myConnection?.teamName && w.myConnection.status === 'ACTIVE'
              ? <button type="button" className="w-btn w-btn-primary" disabled={link.isPending} onClick={() => link.mutate()} data-testid="c8b-slack-link">{link.isPending && <Spinner size={12} />} {t('c8b.useTeam', { team: w.myConnection.teamName })}</button>
              : <button type="button" className="w-btn w-btn-primary" onClick={() => void beginConnect('slack', back).catch((e) => toast.error(workError(e)))} data-testid="c8b-slack-add"><Link2 size={13} /> {t('c8b.addToSlack')}</button>}
          </div>
        ) : <p className="text-[var(--w-text-2)]">{t('c8b.slackAskAdmin')}</p>}
        {w.configured.oauth && !w.configured.signing && <p className="text-[12px] text-[var(--w-orange-text)]">{t('c8b.slackNoSigning')}</p>}
        {w.canManage && w.configured.oauth && (
          <details className="text-[12px] text-[var(--w-text-2)]">
            <summary className="cursor-pointer">{t('c8b.slackSetupUrls')}</summary>
            {[['c8b.cmdUrl', w.commandUrl], ['c8b.evUrl', w.eventsUrl]].map(([k, u]) => (
              <p key={k} className="mt-1 flex items-center gap-2"><span className="w-36 shrink-0">{t(k as WKey)}</span><code className="min-w-0 flex-1 truncate">{u}</code><button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c8b.copy')} onClick={() => copy(u)}><Copy size={12} /></button></p>
            ))}
          </details>
        )}
      </section>

      {p.install && (
        <section className="w-card space-y-3 p-4" aria-label={t('c8b.slackChannels')}>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="w-section-title">{t('c8b.slackChannels')}</h2>
            <span className="min-w-0 flex-1 text-[12px] text-[var(--w-text-3)]">{t('c8b.slackChannelsHint')}</span>
            {p.canManage && <button type="button" className="w-btn w-btn-sm" onClick={() => setAdding(true)} data-testid="c8b-slack-add-channel"><Plus size={12} /> {t('c8b.addChannel')}</button>}
          </div>
          {adding && <AddChannel pid={pid} onDone={() => { setAdding(false); refresh(); }} />}
          {p.channels.length ? (
            <ul className="divide-y divide-[var(--w-border)]">
              {p.channels.map((c) => (
                <li key={c.id} className="space-y-1.5 py-2.5 text-[12.5px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <Hash size={13} className="text-[var(--w-text-3)]" aria-hidden="true" />
                    <span className="font-medium">{c.channelName}</span>
                    <span className="min-w-0 flex-1 text-[var(--w-text-3)]">{c.lastSentAt ? t('c8b.lastSent', { d: fmtDateTime(c.lastSentAt) }) : ''}{c.lastError ? ` · ${c.lastError}` : ''}</span>
                    {p.canManage && (
                      <>
                        <button type="button" className="w-btn w-btn-sm" disabled={test.isPending} onClick={() => test.mutate(c.id)}><Send size={12} /> {t('c8b.sendTest')}</button>
                        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c8b.removeChannel')} onClick={() => remove.mutate(c.id)}><Trash2 size={13} /></button>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 pl-5">
                    {SLACK_EVENTS.map((e) => (
                      <label key={e} className="flex items-center gap-1.5"><input type="checkbox" disabled={!p.canManage} checked={c.events.includes(e)} onChange={() => upd.mutate({ id: c.id, body: { events: c.events.includes(e) ? c.events.filter((x) => x !== e) : [...c.events, e] } })} /> {t(`c8b.ev_${e.replace('.', '_')}` as WKey)}</label>
                    ))}
                    <label className="flex items-center gap-1.5"><input type="checkbox" disabled={!p.canManage} checked={c.intake} onChange={() => upd.mutate({ id: c.id, body: { intake: !c.intake } })} /> {t('c8b.intakeCmd')}</label>
                    <label className="flex items-center gap-1.5"><input type="checkbox" disabled={!p.canManage} checked={c.enabled} onChange={() => upd.mutate({ id: c.id, body: { enabled: !c.enabled } })} /> {t('c8b.enabled')}</label>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="text-[12.5px] text-[var(--w-text-3)]">{t('c8b.noChannels')}</p>}
        </section>
      )}
    </div>
  );
}

function AddChannel({ pid, onDone }: { pid: number; onDone: () => void }) {
  const { t } = useWT();
  const av = useQuery({ queryKey: ['c8b-slack-av', pid], queryFn: () => slackApi.available(pid) });
  const [id, setId] = useState('');
  const add = useMutation({
    mutationFn: () => slackApi.add(pid, { channelId: id, channelName: av.data!.find((c) => c.id === id)!.name, events: ['issue.created', 'issue.done'], intake: true }),
    onSuccess: onDone, onError: (e) => toast.error(workError(e)),
  });
  if (av.isLoading) return <Spinner />;
  if (av.error) return <p className="text-[12.5px] text-[var(--w-red-text)]">{workError(av.error)}</p>;
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[8px] border border-[var(--w-border)] p-2">
      <select className="w-input max-w-[280px]" aria-label={t('c8b.pickChannel')} value={id} onChange={(e) => setId(e.target.value)} data-testid="c8b-slack-pick">
        <option value="">{t('c8b.pickChannel')}</option>
        {(av.data ?? []).map((c) => <option key={c.id} value={c.id}>#{c.name}{c.private ? ` (${t('c8b.private')})` : ''}</option>)}
      </select>
      <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!id || add.isPending} onClick={() => add.mutate()}>{t('c8b.connect')}</button>
      <span className="text-[11.5px] text-[var(--w-text-3)]">{t('c8b.privateHint')}</span>
    </div>
  );
}
