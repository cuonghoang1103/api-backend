'use client';

/**
 * Cài đặt dự án → "Microsoft 365 & Google" (CTW đợt 8a): xuất danh sách thẻ / báo cáo ra Google Sheet hoặc Excel trên
 * OneDrive — MỘT CHIỀU (CT Work → bảng tính). "Đồng bộ lại" ghi đè vùng dữ liệu; sửa trong bảng tính KHÔNG về CT Work.
 * Tệp nằm trong drive của người tạo ⇒ chỉ người đó đồng bộ lại được. Lịch/Teams/Meet/tệp là của từng người: /work/connections.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ExternalLink, FileSpreadsheet, Info, RefreshCw, Trash2 } from 'lucide-react';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { c8aApi, c8aKeys, type CloudProvider } from '@/lib/work-c8a-api';
import { Field, Spinner } from '../ui';
import { Section, Select } from './shared';
import { Badge } from '../quality/qui';
import { useWT } from '../i18n';
import { ProviderLogo } from '../cloud/ProviderLogo';

export default function ProjectCloud({ config }: { config: ProjectConfig; slug: string }) {
  const { t, fmtDateTime } = useWT();
  const pid = config.id;
  const qc = useQueryClient();
  const conns = useQuery({ queryKey: c8aKeys.connections, queryFn: c8aApi.connections, retry: false });
  const sheets = useQuery({ queryKey: c8aKeys.sheets(pid), queryFn: () => c8aApi.sheets(pid), retry: false });
  const ready = (conns.data?.providers ?? []).filter((p) => (p.id === 'microsoft' || p.id === 'google') && p.configured && p.connection?.status === 'ACTIVE');
  const configured = (conns.data?.providers ?? []).filter((p) => (p.id === 'microsoft' || p.id === 'google') && p.configured);
  const [provider, setProvider] = useState<CloudProvider | ''>('');
  const [kind, setKind] = useState<'issues' | 'report'>('issues');
  const [title, setTitle] = useState(`${config.key} — issues`);
  const [jql, setJql] = useState('');
  const chosen = (provider || ready[0]?.id || '') as CloudProvider | '';
  const refresh = () => qc.invalidateQueries({ queryKey: c8aKeys.sheets(pid) });
  const create = useMutation({
    mutationFn: () => c8aApi.createSheet(pid, { provider: chosen as CloudProvider, kind, title: title.trim(), jql: jql.trim() || null }),
    onSuccess: (s) => { toast.success(t('c8a.sheetCreated', { n: s.rowCount })); refresh(); },
    onError: (e) => toast.error(workError(e)),
  });
  const resync = useMutation({
    mutationFn: (id: number) => c8aApi.resyncSheet(pid, id),
    onSuccess: (s) => { toast.success(s.mode === 'replaced' ? t('c8a.sheetReplaced', { n: s.rowCount }) : t('c8a.sheetSynced', { n: s.rowCount })); refresh(); },
    onError: (e) => { toast.error(workError(e)); refresh(); },
  });
  const del = useMutation({ mutationFn: (id: number) => c8aApi.deleteSheet(pid, id), onSuccess: refresh, onError: (e) => toast.error(workError(e)) });

  return (
    <div>
      <Section title={t('c8a.sheetsTitle')} description={t('c8a.sheetsDesc')}>
        <p className="mb-4 flex gap-2 rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px] text-[var(--w-text-2)]" data-testid="c8a-one-way">
          <Info size={14} className="mt-0.5 shrink-0" /> {t('c8a.oneWay')}
        </p>
        {!configured.length ? (
          <p className="text-[13px] text-[var(--w-text-2)]">{t('c8a.notConfigured')}</p>
        ) : !ready.length ? (
          <p className="text-[13px] text-[var(--w-text-2)]">{t('c8a.sheetsConnect')} <Link href="/work/connections" className="text-[var(--w-accent-text)] underline">{t('c8a.title')}</Link></p>
        ) : (
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); if (chosen && title.trim()) create.mutate(); }}>
            <Field label={t('c8a.sheetWhere')}>
              <Select value={chosen} onChange={(e) => setProvider(e.target.value as CloudProvider)}>
                {ready.map((p) => <option key={p.id} value={p.id}>{p.id === 'google' ? 'Google Sheets' : 'Excel (OneDrive)'}</option>)}
              </Select>
            </Field>
            <Field label={t('c8a.sheetKind')}>
              <Select value={kind} onChange={(e) => { const k = e.target.value as 'issues' | 'report'; setKind(k); setTitle(`${config.key} — ${k === 'issues' ? 'issues' : 'workload report'}`); }}>
                <option value="issues">{t('c8a.kindIssues')}</option>
                <option value="report">{t('c8a.kindReport')}</option>
              </Select>
            </Field>
            <Field label={t('c8a.sheetTitle')}><input className="w-input" value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} /></Field>
            <Field label={t('c8a.sheetJql')} hint={t('c8a.sheetJqlHint')}><input className="w-input font-mono" value={jql} maxLength={2000} onChange={(e) => setJql(e.target.value)} placeholder="status != Done ORDER BY due" /></Field>
            <div className="sm:col-span-2">
              <button type="submit" className="w-btn w-btn-primary" disabled={!chosen || !title.trim() || create.isPending}>
                {create.isPending ? <Spinner size={12} /> : <FileSpreadsheet size={14} />} {t('c8a.sheetCreate')}
              </button>
            </div>
          </form>
        )}
      </Section>

      <Section title={t('c8a.sheetsListTitle')}>
        {sheets.isLoading ? <Spinner size={14} /> : !(sheets.data?.items.length) ? (
          <p className="text-[13px] text-[var(--w-text-3)]">{t('c8a.sheetsEmpty')}</p>
        ) : (
          <ul className="divide-y divide-[var(--w-border)] rounded-[6px] border border-[var(--w-border)]" data-testid="c8a-sheets">
            {sheets.data.items.map((s) => (
              <li key={s.id} className="flex min-w-0 flex-wrap items-center gap-2 px-3 py-2.5">
                <ProviderLogo provider={s.provider} size={15} />
                <div className="min-w-0 flex-1">
                  <a href={s.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1 truncate text-[13.5px] font-medium hover:underline">{s.title} <ExternalLink size={11} className="shrink-0" /></a>
                  <div className="text-[12px] text-[var(--w-text-3)]">
                    {s.kind === 'issues' ? t('c8a.kindIssues') : t('c8a.kindReport')} · {t('c8a.rows', { count: s.rowCount })}
                    {s.lastSyncedAt ? ` · ${t('c8a.lastSync', { d: fmtDateTime(s.lastSyncedAt) })}` : ''}
                    {s.owner ? ` · ${s.owner.displayName || s.owner.fullName || s.owner.username}` : ''}
                    {s.jql ? <> · <code className="font-mono">{s.jql}</code></> : null}
                  </div>
                  {s.lastError && <div className="text-[12px] text-[var(--w-red-text)]">{s.lastError}</div>}
                </div>
                {s.lastError ? <Badge tone="red">{t('c8a.statusError')}</Badge> : null}
                {s.mine && (
                  <button type="button" className="w-btn w-btn-sm" disabled={resync.isPending} onClick={() => resync.mutate(s.id)}>
                    {resync.isPending && resync.variables === s.id ? <Spinner size={12} /> : <RefreshCw size={13} />} {t('c8a.resync')}
                  </button>
                )}
                {(s.mine || config.role === 'ADMIN') && (
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c8a.forgetSheet', { t: s.title })} title={t('c8a.forgetSheetTip')} onClick={() => del.mutate(s.id)}><Trash2 size={13} /></button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
