'use client';

/**
 * Cài đặt không gian → Security (CTW đợt 7c, C17): ép 2FA cho mọi thành viên + thời gian ân hạn, danh sách ai chưa bật,
 * nhắc họ, và ghi rõ thứ KHÔNG bị ảnh hưởng (token API, token AI agent, link lịch .ics, link chia sẻ công khai).
 * Mọi thay đổi ghi audit (Settings → Audit log, nhóm workspace.security.*). Luật chặn thật nằm ở backend (twoFactor.ts).
 */

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BellRing, ShieldAlert, ShieldCheck } from 'lucide-react';
import { userName, workError, type WorkspaceDetail } from '@/lib/work-api';
import { c7cKeys, securityApi, type WsSecurity } from '@/lib/work-c7c-api';
import { EmptyState, PageLoading, Spinner, UserAvatar } from '../ui';
import { Badge, type Tone } from '../quality/qui';
import { useWT, type WKey } from '../i18n';
import { ConfirmDialog, Section, Select, Switch } from './shared';

const TONE: Record<WsSecurity['members'][number]['state'], Tone> = { ENABLED: 'green', NOT_ENABLED: 'muted', GRACE: 'yellow', SETUP_REQUIRED: 'red' };

export default function WorkspaceSecurity({ ws }: { ws: Pick<WorkspaceDetail, 'id' | 'name' | 'role'> }) {
  const { t, fmtDate } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: c7cKeys.wsSecurity(ws.id), queryFn: () => securityApi.get(ws.id) });
  const [confirm, setConfirm] = useState<null | { require2fa: boolean; graceDays: number }>(null);
  const [filter, setFilter] = useState<'all' | 'missing'>('missing');
  const put = (d: WsSecurity) => qc.setQueryData(c7cKeys.wsSecurity(ws.id), d);
  const save = useMutation({
    mutationFn: (b: { require2fa?: boolean; graceDays?: number }) => securityApi.set(ws.id, b),
    onSuccess: (d) => { put(d); setConfirm(null); toast.success(t('c7c.wsSaved')); qc.invalidateQueries({ queryKey: ['work', 'workspaces'] }); },
    onError: (e) => toast.error(workError(e)),
  });
  const remind = useMutation({
    mutationFn: () => securityApi.remind(ws.id),
    onSuccess: (r) => toast.success(t('c7c.wsReminded', { count: r.reminded })),
    onError: (e) => toast.error(workError(e)),
  });

  if (q.isLoading) return <PageLoading />;
  if (q.error || !q.data) return <EmptyState title={t('c7c.loadFailed')} body={workError(q.error)} />;
  const d = q.data;
  const p = d.policy;
  const rows = filter === 'missing' ? d.members.filter((m) => !m.mfaEnabled) : d.members;

  return (
    <>
      <Section title={t('c7c.wsTitle')} description={t('c7c.wsDesc')}>
        <div className="flex flex-col gap-4" data-testid="c7c-ws-security">
          <div className="flex flex-wrap items-start gap-3">
            {p.require2fa ? <ShieldCheck size={20} className="mt-0.5 text-[var(--w-green-text)]" /> : <ShieldAlert size={20} className="mt-0.5 text-[var(--w-text-3)]" />}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[14px] font-semibold">
                <Switch
                  checked={p.require2fa}
                  disabled={save.isPending}
                  label={t('c7c.wsRequire')}
                  onChange={(v) => setConfirm({ require2fa: v, graceDays: p.graceDays })}
                />
                {t('c7c.wsRequire')}
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--w-text-2)]">
                {p.require2fa
                  ? (p.graceUntil && new Date(p.graceUntil) > new Date() ? t('c7c.wsOnGrace', { d: fmtDate(p.graceUntil) }) : t('c7c.wsOnEnforced'))
                  : t('c7c.wsOffBody')}
              </p>
              {!d.youHave2fa && (
                <p className="mt-1 text-[12.5px] text-[var(--w-orange-text)]">
                  {t('c7c.wsSelfFirst')} <Link className="underline" href={`${d.setupUrl}?next=${encodeURIComponent(`/work`)}`}>{t('c7c.wsSetupLink')}</Link>
                </p>
              )}
              {p.updatedBy && <p className="mt-1 text-[11.5px] text-[var(--w-text-3)]">{t('c7c.wsLastChange', { who: userName(p.updatedBy), d: fmtDate(p.updatedAt) })}</p>}
            </div>
            <label className="flex items-center gap-2 text-[12.5px] text-[var(--w-text-2)]">
              {t('c7c.wsGrace')}
              <Select
                aria-label={t('c7c.wsGrace')}
                value={p.graceDays}
                disabled={save.isPending}
                onChange={(e) => save.mutate({ graceDays: Number(e.target.value) })}
                className="!h-[30px] w-auto"
              >
                {[0, 1, 3, 7, 14, 30].map((n) => <option key={n} value={n}>{n === 0 ? t('c7c.wsGraceNone') : t('c7c.wsGraceDays', { count: n })}</option>)}
              </Select>
            </label>
          </div>

          <div className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5 text-[12.5px] leading-relaxed text-[var(--w-text-2)]">
            <div className="mb-1 font-medium text-[var(--w-text)]">{t('c7c.wsExemptTitle')}</div>
            <ul className="list-disc space-y-0.5 pl-5">
              <li>{t('c7c.wsExempt1')}</li>
              <li>{t('c7c.wsExempt2')}</li>
              <li>{t('c7c.wsExempt3')}</li>
            </ul>
            {d.exempt.agents.length > 0 && <p className="mt-1">{t('c7c.wsAgents', { names: d.exempt.agents.map((a) => a.displayName || a.username).join(', ') })}</p>}
          </div>
        </div>
      </Section>

      <Section
        title={t('c7c.wsMembersTitle')}
        description={t('c7c.wsMembersDesc', { on: d.summary.enabled, all: d.summary.members })}
        action={d.summary.missing > 0 ? (
          <button type="button" className="w-btn w-btn-sm" disabled={remind.isPending} onClick={() => remind.mutate()}>
            {remind.isPending ? <Spinner size={12} /> : <BellRing size={13} />} {t('c7c.wsRemind', { count: d.summary.missing })}
          </button>
        ) : undefined}
      >
        <div className="mb-2 flex gap-1" role="radiogroup" aria-label={t('c7c.wsFilter')}>
          {(['missing', 'all'] as const).map((f) => (
            <button key={f} type="button" role="radio" aria-checked={filter === f} onClick={() => setFilter(f)} className={`w-btn w-btn-sm ${filter === f ? 'w-btn-primary' : ''}`}>
              {f === 'missing' ? t('c7c.wsFilterMissing', { count: d.summary.missing }) : t('c7c.wsFilterAll', { count: d.summary.members })}
            </button>
          ))}
        </div>
        {!rows.length ? (
          <p className="rounded-[8px] border border-dashed border-[var(--w-border)] px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">{t('c7c.wsAllOn')}</p>
        ) : (
          <ul className="divide-y divide-[var(--w-border)] rounded-[8px] border border-[var(--w-border)]" data-testid="c7c-ws-members">
            {rows.map((m) => (
              <li key={m.user.id} className="flex flex-wrap items-center gap-2.5 px-3 py-2 text-[13px]">
                <UserAvatar user={m.user} size={22} />
                <span className="min-w-0 flex-1 truncate">{userName(m.user)} <span className="text-[var(--w-text-3)]">@{m.user.username}</span></span>
                <span className="text-[12px] text-[var(--w-text-3)]">{m.role}</span>
                <Badge tone={TONE[m.state]}>{t(`c7c.mstate_${m.state}` as WKey)}</Badge>
                {m.mfaEnabledAt && <span className="text-[11.5px] text-[var(--w-text-3)]">{fmtDate(m.mfaEnabledAt)}</span>}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.require2fa ? t('c7c.wsConfirmOnTitle') : t('c7c.wsConfirmOffTitle')}
        body={confirm?.require2fa ? t('c7c.wsConfirmOnBody', { n: d.summary.missing, days: confirm.graceDays }) : t('c7c.wsConfirmOffBody')}
        confirmLabel={confirm?.require2fa ? t('c7c.wsConfirmOn') : t('c7c.wsConfirmOff')}
        danger={!confirm?.require2fa}
        pending={save.isPending}
        onConfirm={() => confirm && save.mutate({ require2fa: confirm.require2fa, graceDays: confirm.graceDays })}
      />
    </>
  );
}
