'use client';

/**
 * /work/connections — "Kết nối của tôi" (CTW đợt 8a): Microsoft 365 / Google Workspace theo NGƯỜI dùng.
 * Kết nối (OAuth, PKCE) · ngắt kết nối (thu hồi + xoá token) · trạng thái + lỗi gần nhất · chọn lịch đích để đồng bộ hai
 * chiều hạn thẻ + cuộc họp · nhật ký. Thiếu client id/secret trên máy chủ ⇒ nút ẩn + ghi chú "quản trị viên chưa cấu hình".
 * Nhà cung cấp 8b (Notion/Slack) tự hiện ở đây khi đã registerProvider() — trang chỉ đọc danh sách từ API.
 */

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, CalendarClock, CheckCircle2, ExternalLink, PlugZap, RefreshCw, Unplug } from 'lucide-react';
import { workError } from '@/lib/work-api';
import { beginConnect, c8aApi, c8aKeys, type ProviderState } from '@/lib/work-c8a-api';
import { PageLoading, Spinner, EmptyState } from '@/components/work/ui';
import { PageHeader, Section, Select, Switch, ConfirmDialog } from '@/components/work/settings/shared';
import { Badge } from '@/components/work/quality/qui';
import { useWT } from '@/components/work/i18n';
import { ProviderLogo } from '@/components/work/cloud/ProviderLogo';

function ConnectionsView() {
  const { t, fmtDateTime, fmtRelative } = useWT();
  const search = useSearchParams();
  const router = useRouter();
  const q = useQuery({ queryKey: c8aKeys.connections, queryFn: c8aApi.connections });

  // Thông báo kết quả quay về từ nhà cung cấp (?provider=&connected=1 | error=denied|failed), rồi dọn URL.
  useEffect(() => {
    const p = search?.get('provider');
    if (!p) return;
    if (search?.get('connected')) toast.success(t('c8a.connectedToast'));
    else if (search?.get('error') === 'denied') toast.error(t('c8a.deniedToast'));
    else if (search?.get('error')) toast.error(t('c8a.failedToast'));
    router.replace('/work/connections', { scroll: false });
  }, [search, router, t]);

  if (q.isLoading) return <PageLoading />;
  if (q.error || !q.data) return <EmptyState title={t('c8a.loadFailed')} body={workError(q.error)} />;
  const v = q.data;

  return (
    <div className="flex h-full flex-col">
      <PageHeader title={t('c8a.title')} sub={t('c8a.sub')} />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-[820px] flex-col gap-2">
          {v.agent ? (
            <p className="text-[13px] text-[var(--w-text-2)]">{t('c8a.agentNote')}</p>
          ) : (
            <>
              <p className="text-[13px] leading-relaxed text-[var(--w-text-2)]">{t('c8a.intro')}</p>
              {v.providers.map((p) => <ProviderCard key={p.id} p={p} />)}
              <Section title={t('c8a.activityTitle')} description={t('c8a.activityDesc')}>
                {v.activity.length ? (
                  <ul className="divide-y divide-[var(--w-border)] rounded-[6px] border border-[var(--w-border)]" data-testid="c8a-activity">
                    {v.activity.map((a) => (
                      <li key={a.id} className="flex min-w-0 items-start gap-2.5 px-3 py-2 text-[13px]">
                        <ProviderLogo provider={a.provider} size={14} />
                        <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{a.summary}</span>
                        <Badge tone={a.kind === 'error' ? 'red' : a.kind === 'conflict' ? 'orange' : a.kind === 'pull' ? 'blue' : 'muted'}>{kindLabel(t, a.kind)}</Badge>
                        <time className="shrink-0 text-[12px] text-[var(--w-text-3)]" dateTime={a.createdAt} title={fmtDateTime(a.createdAt)}>{fmtRelative(a.createdAt)}</time>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-[13px] text-[var(--w-text-3)]">{t('c8a.noActivity')}</p>}
              </Section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

type T = ReturnType<typeof useWT>['t'];
function kindLabel(t: T, k: string) {
  const m: Record<string, string> = {
    connect: t('c8a.kConnect'), disconnect: t('c8a.kDisconnect'), refresh: t('c8a.kRefresh'), push: t('c8a.kPush'), pull: t('c8a.kPull'),
    conflict: t('c8a.kConflict'), error: t('c8a.kError'), settings: t('c8a.kSettings'), file: t('c8a.kFile'), sheet: t('c8a.kSheet'), meeting: t('c8a.kMeeting'),
  };
  return m[k] ?? k;
}

function capLabel(t: T, c: string) {
  const m: Record<string, string> = { calendar: t('c8a.capCalendar'), meetings: t('c8a.capMeetings'), files: t('c8a.capFiles'), sheets: t('c8a.capSheets'), docs: t('c8a.capDocs'), chat: t('c8a.capChat') };
  return m[c] ?? c;
}

function ProviderCard({ p }: { p: ProviderState }) {
  const { t, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const [confirm, setConfirm] = useState(false);
  const [removeEvents, setRemoveEvents] = useState(false);
  const c = p.connection;
  const connect = useMutation({ mutationFn: () => beginConnect(p.id), onError: (e) => toast.error(workError(e)) });
  const disc = useMutation({
    mutationFn: () => c8aApi.disconnect(p.id, removeEvents),
    onSuccess: (r) => {
      setConfirm(false);
      toast.success(r.revoked ? t('c8a.disconnectedRevoked') : t('c8a.disconnectedToast'));
      qc.invalidateQueries({ queryKey: c8aKeys.connections });
    },
    onError: (e) => toast.error(workError(e)),
  });
  const calendarCapable = p.capabilities.includes('calendar') && (p.id === 'microsoft' || p.id === 'google');

  return (
    <Section
      title={p.label}
      description={<span className="flex flex-wrap gap-1.5">{p.capabilities.map((x) => <Badge key={x}>{capLabel(t, x)}</Badge>)}</span>}
      action={<ProviderLogo provider={p.id} size={22} />}
    >
      <div className="flex flex-wrap items-center gap-3" data-testid={`c8a-provider-${p.id}`}>
        {!p.configured ? (
          <p className="flex items-center gap-2 text-[13px] text-[var(--w-text-2)]" data-testid={`c8a-not-configured-${p.id}`}>
            <AlertTriangle size={14} className="shrink-0 text-[var(--w-orange-text)]" /> {t('c8a.notConfigured')}
          </p>
        ) : !c ? (
          <>
            <p className="min-w-0 flex-1 text-[13px] text-[var(--w-text-2)]">{t('c8a.notConnected')}</p>
            <button type="button" className="w-btn w-btn-primary" disabled={connect.isPending} onClick={() => connect.mutate()}>
              {connect.isPending ? <Spinner size={12} /> : <PlugZap size={14} />} {t('c8a.connect', { name: p.label })}
            </button>
          </>
        ) : (
          <>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-[14px] font-semibold">
                {c.status === 'ACTIVE' ? <CheckCircle2 size={15} className="text-[var(--w-green-text)]" /> : <AlertTriangle size={15} className="text-[var(--w-red-text)]" />}
                <span className="[overflow-wrap:anywhere]">{c.accountEmail ?? c.accountName ?? p.label}</span>
                <Badge tone={c.status === 'ACTIVE' ? 'green' : 'red'}>{c.status === 'ACTIVE' ? t('c8a.statusActive') : t('c8a.statusError')}</Badge>
              </div>
              <div className="mt-0.5 text-[12.5px] text-[var(--w-text-2)]">
                {t('c8a.connectedSince', { d: fmtDateTime(c.createdAt) })}
                {c.lastSyncAt ? ` · ${t('c8a.lastSync', { d: fmtDateTime(c.lastSyncAt) })}` : ''}
              </div>
              {c.lastError && (
                <div role="alert" className="mt-1.5 flex gap-1.5 text-[12.5px] text-[var(--w-red-text)]">
                  <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                  <span className="[overflow-wrap:anywhere]">{t('c8a.lastError', { msg: c.lastError })}{c.lastErrorAt ? ` (${fmtDateTime(c.lastErrorAt)})` : ''}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {c.status !== 'ACTIVE' && (
                <button type="button" className="w-btn w-btn-primary" onClick={() => connect.mutate()} disabled={connect.isPending}><RefreshCw size={14} /> {t('c8a.reconnect')}</button>
              )}
              <button type="button" className="w-btn w-btn-ghost w-btn-danger" onClick={() => setConfirm(true)}><Unplug size={14} /> {t('c8a.disconnect')}</button>
            </div>
          </>
        )}
      </div>
      {c && c.status === 'ACTIVE' && calendarCapable && <CalendarSettingsBox provider={p.id} />}
      {p.configured && (
        <details className="mt-3 text-[12.5px] text-[var(--w-text-3)]">
          <summary className="cursor-pointer select-none">{t('c8a.permissions')}</summary>
          <p className="mt-1.5">{t('c8a.permissionsBody')}</p>
          <code className="mt-1 block break-all rounded bg-[var(--w-sunken)] px-2 py-1 font-mono text-[11.5px]">{p.scopes.join(' ')}</code>
          {p.manageUrl && <a className="mt-1.5 inline-flex items-center gap-1 text-[var(--w-accent-text)] underline" href={p.manageUrl} target="_blank" rel="noopener noreferrer">{t('c8a.manageApp')} <ExternalLink size={11} /></a>}
        </details>
      )}
      <ConfirmDialog
        open={confirm} onClose={() => setConfirm(false)} onConfirm={() => disc.mutate()} pending={disc.isPending}
        title={t('c8a.disconnectTitle', { name: p.label })} confirmLabel={t('c8a.disconnect')}
        body={(
          <div className="space-y-3">
            <p>{t('c8a.disconnectBody')}</p>
            {calendarCapable && (
              <label className="flex items-center gap-2 text-[13px] text-[var(--w-text)]">
                <input type="checkbox" checked={removeEvents} onChange={(e) => setRemoveEvents(e.target.checked)} /> {t('c8a.removeEvents')}
              </label>
            )}
          </div>
        )}
      />
    </Section>
  );
}

function CalendarSettingsBox({ provider }: { provider: string }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const cals = useQuery({ queryKey: c8aKeys.calendars(provider), queryFn: () => c8aApi.calendars(provider), retry: false });
  const [custom, setCustom] = useState('');
  const refresh = () => { qc.invalidateQueries({ queryKey: c8aKeys.connections }); qc.invalidateQueries({ queryKey: c8aKeys.calendars(provider) }); };
  const save = useMutation({
    mutationFn: (body: Parameters<typeof c8aApi.saveCalendar>[1]) => c8aApi.saveCalendar(provider, body),
    onSuccess: (r) => {
      refresh();
      if ('error' in r.result) toast.error(r.result.error);
      else toast.success(t('c8a.calSaved'));
    },
    onError: (e) => toast.error(workError(e)),
  });
  const sync = useMutation({
    mutationFn: () => c8aApi.syncNow(provider),
    onSuccess: (r) => {
      refresh();
      toast.success(t('c8a.syncDone', { pushed: r.pushed.created + r.pushed.updated + r.pushed.deleted, pulled: r.pulled?.applied ?? 0 }));
    },
    onError: (e) => toast.error(workError(e)),
  });
  if (cals.isLoading) return <div className="mt-4"><Spinner size={14} /></div>;
  if (cals.error || !cals.data) return <p className="mt-4 text-[12.5px] text-[var(--w-red-text)]">{workError(cals.error)}</p>;
  const s = cals.data.settings;
  const items = cals.data.items;
  const selectId = `c8a-cal-${provider}`;
  return (
    <div className="mt-4 rounded-[8px] border border-[var(--w-border)] p-3.5" data-testid={`c8a-calendar-${provider}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <CalendarClock size={15} className="text-[var(--w-text-2)]" />
        <h3 className="text-[13.5px] font-semibold">{t('c8a.calTitle')}</h3>
        <span className="ml-auto flex items-center gap-2 text-[12.5px] text-[var(--w-text-2)]">
          {s.enabled ? t('c8a.calOn') : t('c8a.calOff')}
          <Switch checked={s.enabled} disabled={save.isPending || (!s.calendarId && !s.enabled && !items.length)} label={t('c8a.calToggle')}
            onChange={(on) => save.mutate({ enabled: on, ...(on && !s.calendarId ? { calendarId: items[0]?.id ?? 'primary', calendarName: items[0]?.name ?? null } : {}) })} />
        </span>
      </div>
      <p className="mb-3 text-[12.5px] leading-relaxed text-[var(--w-text-2)]">{t('c8a.calBody')}</p>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <label htmlFor={selectId} className="mb-1 block text-[12px] font-medium text-[var(--w-text-2)]">{t('c8a.calTarget')}</label>
          <Select id={selectId} value={s.calendarId ?? ''} disabled={save.isPending}
            onChange={(e) => { const c = items.find((x) => x.id === e.target.value); if (c) save.mutate({ calendarId: c.id, calendarName: c.name }); }}>
            {!s.calendarId && <option value="">{t('c8a.calPick')}</option>}
            {items.map((c) => <option key={c.id} value={c.id} disabled={!c.canEdit}>{c.name}{c.primary ? ` (${t('c8a.calPrimary')})` : ''}</option>)}
            {s.calendarId && !items.some((x) => x.id === s.calendarId) && <option value={s.calendarId}>{s.calendarName ?? s.calendarId}</option>}
          </Select>
          {provider === 'google' && (
            <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (custom.trim()) save.mutate({ calendarId: custom.trim(), calendarName: custom.trim() }); }}>
              <input className="w-input min-w-0 flex-1" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={t('c8a.calCustomPh')} aria-label={t('c8a.calCustom')} />
              <button type="submit" className="w-btn" disabled={!custom.trim() || save.isPending}>{t('c8a.calUse')}</button>
            </form>
          )}
        </div>
        <div className="flex flex-col gap-2 text-[13px]">
          <label className="flex items-center gap-2"><Switch checked={s.syncIssues} label={t('c8a.calIssues')} onChange={(v) => save.mutate({ syncIssues: v })} /> {t('c8a.calIssues')}</label>
          <label className="flex items-center gap-2"><Switch checked={s.syncMeetings} label={t('c8a.calMeetings')} onChange={(v) => save.mutate({ syncMeetings: v })} /> {t('c8a.calMeetings')}</label>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className="w-btn" disabled={!s.enabled || sync.isPending} onClick={() => sync.mutate()}>{sync.isPending ? <Spinner size={12} /> : <RefreshCw size={14} />} {t('c8a.syncNow')}</button>
        <button type="button" className="w-btn w-btn-ghost" disabled={!s.enabled || save.isPending} onClick={() => save.mutate({ resync: true })} title={t('c8a.resyncTip')}>{t('c8a.resyncAll')}</button>
        <span className="text-[12px] text-[var(--w-text-3)]">{t('c8a.calRules')}</span>
      </div>
    </div>
  );
}

export default function ConnectionsPage() {
  return <Suspense fallback={<PageLoading />}><ConnectionsView /></Suspense>;
}
