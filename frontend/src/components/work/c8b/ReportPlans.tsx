'use client';

/**
 * CTW đợt 8b — lịch tự gửi báo cáo (hằng tuần / khi sprint đóng) qua email (kèm PDF/DOCX), webhook chat, kênh Slack +
 * nhật ký gửi. Người nhận ngoài dự án chờ OWNER/ADMIN duyệt. `mode`: 'plans' | 'log'.
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CalendarClock, Check, Download, Pencil, Plus, Send, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { reportBuilderApi, reportPlansApi, type Delivery, type PlanBody, type SendPlan } from '@/lib/work-c8b-api';
import { Dialog, EmptyState, PageLoading, Spinner } from '../ui';
import { useWT, type WKey } from '../i18n';

const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7];
const STATUS_TONE: Record<string, string> = { SENT: 'text-[var(--w-green-text)]', PARTIAL: 'text-[var(--w-orange-text)]', FAILED: 'text-[var(--w-red-text)]', SKIPPED: 'text-[var(--w-text-3)]', RUNNING: 'text-[var(--w-text-2)]' };

export default function ReportPlans({ pid, mode }: { pid: number; mode: 'plans' | 'log' }) {
  const { t, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['c8b-plans', pid], queryFn: () => reportPlansApi.list(pid) });
  const tpl = useQuery({ queryKey: ['c8b-templates', pid], queryFn: () => reportBuilderApi.templates(pid) });
  const [editing, setEditing] = useState<SendPlan | 'new' | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ['c8b-plans', pid] });
  const send = useMutation({ mutationFn: (id: number) => reportPlansApi.send(pid, id), onSuccess: (r) => { void refresh(); toast.success(t('c8b.sentStatus', { s: r?.status ?? '—' })); }, onError: (e) => toast.error(workError(e)) });
  const remove = useMutation({ mutationFn: (id: number) => reportPlansApi.remove(pid, id), onSuccess: () => void refresh(), onError: (e) => toast.error(workError(e)) });
  const decide = useMutation({ mutationFn: (a: { id: number; email: string; approve: boolean }) => reportPlansApi.decide(pid, a.id, a.email, a.approve), onSuccess: () => void refresh(), onError: (e) => toast.error(workError(e)) });

  if (q.isLoading) return <PageLoading />;
  if (q.error || !q.data) return <EmptyState title={t('c8b.loadFailed')} body={q.error ? workError(q.error) : ''} />;
  const d = q.data;

  if (mode === 'log') return <DeliveryLog pid={pid} rows={d.deliveries} />;

  const wd = (n: number) => t(`c8b.wd${n}` as WKey);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="min-w-0 flex-1 text-[12.5px] text-[var(--w-text-2)]">{t('c8b.plansIntro')}</p>
        {d.canEdit && <button type="button" className="w-btn w-btn-primary" onClick={() => setEditing('new')} data-testid="c8b-plan-new"><Plus size={13} /> {t('c8b.newPlan')}</button>}
      </div>
      {d.plans.length ? (
        <ul className="space-y-2" data-testid="c8b-plans">
          {d.plans.map((p) => (
            <li key={p.id} className="w-card p-3">
              <div className="flex flex-wrap items-start gap-2">
                <CalendarClock size={16} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-medium">{p.name}{!p.enabled && <span className="ml-2 text-[11.5px] text-[var(--w-text-3)]">({t('c8b.paused')})</span>}</p>
                  <p className="text-[12px] text-[var(--w-text-2)]">
                    {p.templateName ?? '—'} · {p.cadence === 'WEEKLY' ? t('c8b.weeklyAt', { d: wd(p.weekday), h: String(p.hour).padStart(2, '0') }) : t('c8b.onSprintClose', { h: String(p.hour).padStart(2, '0') })} · {p.timezone} · {p.format.toUpperCase()}
                  </p>
                  <p className="text-[12px] text-[var(--w-text-3)]">{t('c8b.lastRun')}: {p.lastRunAt ? fmtDateTime(p.lastRunAt) : t('c8b.never')}</p>
                  {p.recipients.length > 0 && (
                    <ul className="mt-1.5 flex flex-wrap gap-1.5">
                      {p.recipients.map((r) => (
                        <li key={r.email} className={cn('flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11.5px]', r.status === 'PENDING' ? 'border-[var(--w-orange)] text-[var(--w-orange-text)]' : r.status === 'REJECTED' ? 'border-[var(--w-border)] text-[var(--w-text-3)] line-through' : 'border-[var(--w-border)]')}>
                          {r.email}{r.external && <span className="text-[var(--w-text-3)]">· {t(`c8b.rs_${r.status}` as WKey)}</span>}
                          {r.status === 'PENDING' && d.canApprove && (
                            <>
                              <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c8b.approve', { e: r.email })} onClick={() => decide.mutate({ id: p.id, email: r.email, approve: true })}><Check size={12} /></button>
                              <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c8b.reject', { e: r.email })} onClick={() => decide.mutate({ id: p.id, email: r.email, approve: false })}><X size={12} /></button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {p.pendingApprovals > 0 && !d.canApprove && <p className="mt-1 text-[12px] text-[var(--w-orange-text)]">{t('c8b.waitingApproval', { count: p.pendingApprovals })}</p>}
                </div>
                {d.canEdit && (
                  <div className="flex gap-1">
                    <button type="button" className="w-btn w-btn-sm" disabled={send.isPending} onClick={() => send.mutate(p.id)} data-testid={`c8b-plan-send-${p.id}`}>{send.isPending && send.variables === p.id ? <Spinner size={12} /> : <Send size={12} />} {t('c8b.sendNow')}</button>
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c8b.editPlan')} onClick={() => setEditing(p)}><Pencil size={13} /></button>
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c8b.deletePlan')} onClick={() => window.confirm(t('c8b.deletePlanConfirm')) && remove.mutate(p.id)}><Trash2 size={13} /></button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : <EmptyState title={t('c8b.noPlans')} body={t('c8b.noPlansBody')} />}
      {editing && tpl.data && (
        <PlanDialog pid={pid} plan={editing === 'new' ? null : editing} templates={[...tpl.data.builtins, ...tpl.data.templates].map((x) => ({ ref: x.ref, name: x.name }))}
          hooks={d.chatHooks} slack={d.slackChannels} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); void refresh(); }} />
      )}
    </div>
  );
}

function PlanDialog({ pid, plan, templates, hooks, slack, onClose, onSaved }: {
  pid: number; plan: SendPlan | null; templates: Array<{ ref: string; name: string }>; hooks: Array<{ id: number; kind: string; name: string }>;
  slack: Array<{ id: number; name: string }>; onClose: () => void; onSaved: () => void;
}) {
  const { t } = useWT();
  const [v, setV] = useState<PlanBody>(() => ({
    name: plan?.name ?? '', templateRef: plan?.templateRef ?? templates[0]?.ref ?? 'builtin:weekly', cadence: plan?.cadence ?? 'WEEKLY', weekday: plan?.weekday ?? 5,
    hour: plan?.hour ?? 16, timezone: plan?.timezone ?? 'Asia/Ho_Chi_Minh', format: plan?.format ?? 'pdf', recipients: plan?.recipients.map((r) => r.email) ?? [],
    chatHookIds: plan?.chatHookIds ?? [], slackChannelIds: plan?.slackChannelIds ?? [], enabled: plan?.enabled ?? true,
  }));
  const [emails, setEmails] = useState(v.recipients.join('\n'));
  const save = useMutation({
    mutationFn: () => {
      const body = { ...v, recipients: emails.split(/[\s,;]+/).map((e) => e.trim()).filter(Boolean) };
      return plan ? reportPlansApi.update(pid, plan.id, body) : reportPlansApi.create(pid, body);
    },
    onSuccess: (p) => { toast.success(p.pendingApprovals ? t('c8b.savedPending', { count: p.pendingApprovals }) : t('c8b.saved')); onSaved(); },
    onError: (e) => toast.error(workError(e)),
  });
  const set = <K extends keyof PlanBody>(k: K, val: PlanBody[K]) => setV((x) => ({ ...x, [k]: val }));
  const toggle = (k: 'chatHookIds' | 'slackChannelIds', id: number) => set(k, v[k].includes(id) ? v[k].filter((x) => x !== id) : [...v[k], id]);
  return (
    <Dialog open onClose={onClose} width={620} title={plan ? t('c8b.editPlan') : t('c8b.newPlan')} footer={(
      <>
        <button type="button" className="w-btn" onClick={onClose}>{t('common.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!v.name.trim() || save.isPending} onClick={() => save.mutate()} data-testid="c8b-plan-save">{save.isPending && <Spinner size={12} />} {t('c8b.save')}</button>
      </>
    )}>
      <div className="space-y-3 text-[12.5px]">
        <div className="grid gap-2 sm:grid-cols-2">
          <label><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.planName')}</span><input className="w-input" maxLength={120} value={v.name} onChange={(e) => set('name', e.target.value)} data-testid="c8b-plan-name" /></label>
          <label><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.template')}</span>
            <select className="w-input" value={v.templateRef} onChange={(e) => set('templateRef', e.target.value)}>{templates.map((x) => <option key={x.ref} value={x.ref}>{x.name}</option>)}</select></label>
          <label><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.cadence')}</span>
            <select className="w-input" value={v.cadence} onChange={(e) => set('cadence', e.target.value as PlanBody['cadence'])}><option value="WEEKLY">{t('c8b.cad_WEEKLY')}</option><option value="SPRINT">{t('c8b.cad_SPRINT')}</option></select></label>
          {v.cadence === 'WEEKLY' && (
            <label><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.weekday')}</span>
              <select className="w-input" value={v.weekday} onChange={(e) => set('weekday', Number(e.target.value))}>{WEEKDAYS.map((n) => <option key={n} value={n}>{t(`c8b.wd${n}` as WKey)}</option>)}</select></label>
          )}
          <label><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.hour')}</span>
            <select className="w-input" value={v.hour} onChange={(e) => set('hour', Number(e.target.value))}>{Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>)}</select></label>
          <label><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.timezone')}</span><input className="w-input" value={v.timezone} maxLength={64} onChange={(e) => set('timezone', e.target.value)} /></label>
          <label><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.format')}</span>
            <select className="w-input" value={v.format} onChange={(e) => set('format', e.target.value as PlanBody['format'])}><option value="pdf">PDF</option><option value="docx">DOCX</option></select></label>
        </div>
        <label className="block"><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.recipients')}</span>
          <textarea className="w-input min-h-[80px]" value={emails} onChange={(e) => setEmails(e.target.value)} placeholder="gv@fpt.edu.vn" data-testid="c8b-plan-emails" />
          <span className="mt-1 block text-[11.5px] text-[var(--w-text-3)]">{t('c8b.recipientsHint')}</span></label>
        {hooks.length > 0 && (
          <fieldset><legend className="mb-1 text-[var(--w-text-2)]">{t('c8b.postToChat')}</legend>
            <div className="flex flex-wrap gap-x-3 gap-y-1">{hooks.map((h) => <label key={h.id} className="flex items-center gap-1.5"><input type="checkbox" checked={v.chatHookIds.includes(h.id)} onChange={() => toggle('chatHookIds', h.id)} /> {h.name} <span className="text-[var(--w-text-3)]">({h.kind})</span></label>)}</div>
          </fieldset>
        )}
        {slack.length > 0 && (
          <fieldset><legend className="mb-1 text-[var(--w-text-2)]">{t('c8b.postToSlack')}</legend>
            <div className="flex flex-wrap gap-x-3 gap-y-1">{slack.map((c) => <label key={c.id} className="flex items-center gap-1.5"><input type="checkbox" checked={v.slackChannelIds.includes(c.id)} onChange={() => toggle('slackChannelIds', c.id)} /> #{c.name}</label>)}</div>
          </fieldset>
        )}
        <label className="flex items-center gap-1.5"><input type="checkbox" checked={v.enabled} onChange={(e) => set('enabled', e.target.checked)} /> {t('c8b.enabled')}</label>
      </div>
    </Dialog>
  );
}

function DeliveryLog({ pid, rows }: { pid: number; rows: Delivery[] }) {
  const { t, fmtDateTime } = useWT();
  if (!rows.length) return <EmptyState title={t('c8b.noLog')} body={t('c8b.noLogBody')} />;
  return (
    <div className="w-table-wrap overflow-auto" data-testid="c8b-log">
      <table className="w-full min-w-[760px] text-[12.5px]">
        <thead><tr className="text-left text-[var(--w-text-3)]"><th className="p-2">{t('c8b.when')}</th><th className="p-2">{t('c8b.planName')}</th><th className="p-2">{t('c8b.periodKey')}</th><th className="p-2">{t('c8b.trigger')}</th><th className="p-2">{t('c8b.status')}</th><th className="p-2">{t('c8b.channels')}</th><th className="p-2"><span className="sr-only">{t('c8b.download')}</span></th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-[var(--w-border)] align-top">
              <td className="whitespace-nowrap p-2">{fmtDateTime(r.createdAt)}</td>
              <td className="p-2">{r.schedule ?? '—'}<span className="block text-[var(--w-text-3)]">{r.title}</span></td>
              <td className="p-2 font-mono text-[11.5px]">{r.periodKey.startsWith('manual:') ? '—' : r.periodKey}</td>
              <td className="p-2">{r.trigger === 'AUTO' ? t('c8b.auto') : `${t('c8b.manual')}${r.by ? ` · ${r.by}` : ''}`}</td>
              <td className={cn('p-2 font-medium', STATUS_TONE[r.status])}>{t(`c8b.st_${r.status}` as WKey)}</td>
              <td className="max-w-[320px] p-2">
                {r.detail.map((x, i) => <span key={i} className={cn('block', x.ok ? 'text-[var(--w-text-2)]' : 'text-[var(--w-red-text)]')}>{x.ok ? '✓' : '✕'} {x.channel}: {x.target}{x.error ? ` — ${x.error}` : ''}</span>)}
              </td>
              <td className="p-2">{r.hasFile && r.fileName && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c8b.download')} onClick={() => void reportPlansApi.file(pid, r.id, r.fileName!)}><Download size={13} /></button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
