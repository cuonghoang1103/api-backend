'use client';

/**
 * CTW đợt 8b — Notion: kết nối (khung OAuth 8a, theo NGƯỜI), nhập trang (+ trang con) vào Docs, xuất trang Docs sang Notion,
 * nhập database Notion thành thẻ (ghép thuộc tính ⇒ trường, xem trước, không trùng khi nhập lại).
 */

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, Database, Download, ExternalLink, FileText, Link2, Search, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workDocsApi, workError, type ProjectConfig } from '@/lib/work-api';
import { beginConnect } from '@/lib/work-c8a-api';
import { MAP_FIELDS, type MapField } from '@/lib/work-ctw7b-api';
import { notionApi, type NotionDbPreview, type NotionItem } from '@/lib/work-c8b-api';
import { EmptyState, PageLoading, Spinner } from '../ui';
import KpiTile, { KpiRow } from '../KpiTile';
import { useWT, type WKey } from '../i18n';

export default function NotionPanel({ config, pid }: { config: ProjectConfig; pid: number }) {
  const { t } = useWT();
  const st = useQuery({ queryKey: ['c8b-notion-status'], queryFn: notionApi.status });
  const back = `/work/${config.workspace.slug}/${config.key}/connect`;
  if (st.isLoading) return <PageLoading rows={3} />;
  if (st.error || !st.data) return <EmptyState title={t('c8b.loadFailed')} body={st.error ? workError(st.error) : ''} />;
  if (!st.data.configured) return <div className="w-card p-4 text-[13px]" data-testid="c8b-notion-off"><p className="font-medium">{t('c8b.notionOff')}</p><p className="mt-1 text-[var(--w-text-2)]">{t('c8b.notionOffBody')}</p></div>;
  if (!st.data.connected) {
    return (
      <div className="w-card p-4 text-[13px]">
        <p className="font-medium">{t('c8b.notionConnectT')}</p>
        <p className="mt-1 text-[var(--w-text-2)]">{t('c8b.notionConnectB')}</p>
        {st.data.account?.status === 'ERROR' && <p className="mt-1 text-[var(--w-red-text)]">{t('c8b.reconnect')}</p>}
        <button type="button" className="w-btn w-btn-primary mt-3" onClick={() => void beginConnect('notion', back).catch((e) => toast.error(workError(e)))} data-testid="c8b-notion-connect"><Link2 size={13} /> {t('c8b.connectNotion')}</button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <p className="text-[12.5px] text-[var(--w-text-2)]">{t('c8b.notionAs', { n: st.data.account?.name ?? st.data.account?.email ?? 'Notion' })} · <Link href="/work/connections" className="underline">{t('c8b.manageConnections')}</Link></p>
      <ImportPages config={config} pid={pid} />
      <ExportPage pid={pid} />
      {config.role === 'ADMIN' && <ImportDatabase pid={pid} />}
    </div>
  );
}

function Picker({ kind, onPick, picked }: { kind: 'page' | 'database'; onPick: (x: NotionItem) => void; picked: NotionItem | null }) {
  const { t, fmtDateTime } = useWT();
  const [q, setQ] = useState('');
  const s = useMutation({ mutationFn: () => notionApi.search(q, kind), onError: (e) => toast.error(workError(e)) });
  return (
    <div>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); s.mutate(); }}>
        <input className="w-input flex-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder={kind === 'page' ? t('c8b.searchPages') : t('c8b.searchDbs')} aria-label={kind === 'page' ? t('c8b.searchPages') : t('c8b.searchDbs')} />
        <button type="submit" className="w-btn" disabled={s.isPending}>{s.isPending ? <Spinner size={12} /> : <Search size={13} />} {t('c8b.search')}</button>
      </form>
      {s.data && (s.data.length ? (
        <ul className="mt-2 max-h-[220px] divide-y divide-[var(--w-border)] overflow-auto rounded-[8px] border border-[var(--w-border)]" role="listbox" aria-label={t('c8b.results')}>
          {s.data.map((x) => (
            <li key={x.id}>
              <button type="button" role="option" aria-selected={picked?.id === x.id} onClick={() => onPick(x)} className={cn('flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] hover:bg-[var(--w-hover)]', picked?.id === x.id && 'bg-[var(--w-accent-soft)]')}>
                <span aria-hidden="true">{x.icon ?? (x.kind === 'database' ? '🗂' : '📄')}</span>
                <span className="min-w-0 flex-1 truncate">{x.title}</span>
                {x.lastEdited && <span className="text-[11px] text-[var(--w-text-3)]">{fmtDateTime(x.lastEdited)}</span>}
              </button>
            </li>
          ))}
        </ul>
      ) : <p className="mt-2 text-[12.5px] text-[var(--w-text-3)]">{t('c8b.noNotionResults')}</p>)}
    </div>
  );
}

function ImportPages({ config, pid }: { config: ProjectConfig; pid: number }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [picked, setPicked] = useState<NotionItem | null>(null);
  const [children, setChildren] = useState(true);
  const go = useMutation({
    mutationFn: () => notionApi.importPage(pid, { pageId: picked!.id, includeChildren: children }),
    onSuccess: (r) => { void qc.invalidateQueries({ queryKey: ['work', 'pages', pid] }); toast.success(t('c8b.importedPages', { count: r.pages.length })); },
    onError: (e) => toast.error(workError(e)),
  });
  return (
    <section className="w-card space-y-3 p-4" aria-label={t('c8b.importPageT')}>
      <h2 className="w-section-title flex items-center gap-1.5"><Download size={14} /> {t('c8b.importPageT')}</h2>
      <p className="text-[12.5px] text-[var(--w-text-2)]">{t('c8b.importPageB')}</p>
      <Picker kind="page" onPick={setPicked} picked={picked} />
      <div className="flex flex-wrap items-center gap-3 text-[12.5px]">
        <label className="flex items-center gap-1.5"><input type="checkbox" checked={children} onChange={(e) => setChildren(e.target.checked)} /> {t('c8b.withChildren')}</label>
        <button type="button" className="w-btn w-btn-primary" disabled={!picked || go.isPending} onClick={() => go.mutate()} data-testid="c8b-notion-import">{go.isPending ? <Spinner size={12} /> : <Download size={13} />} {t('c8b.importToDocs')}</button>
      </div>
      {go.data && (
        <div className="rounded-[8px] border border-[var(--w-border)] p-3 text-[12.5px]">
          <ul className="space-y-1">{go.data.pages.map((p) => <li key={p.number}><Link className="underline" href={`/work/${config.workspace.slug}/${config.key}/docs/${p.number}`}><FileText size={12} className="mr-1 inline" />DOC-{p.number} {p.title}</Link></li>)}</ul>
          {go.data.warnings.length > 0 && <ul className="mt-2 space-y-0.5 text-[var(--w-orange-text)]">{go.data.warnings.map((w) => <li key={w} className="flex gap-1"><AlertTriangle size={12} className="mt-0.5 shrink-0" />{w}</li>)}</ul>}
        </div>
      )}
    </section>
  );
}

function ExportPage({ pid }: { pid: number }) {
  const { t } = useWT();
  const pages = useQuery({ queryKey: ['work', 'pages', pid, 'list'], queryFn: () => workDocsApi.list(pid), retry: false });
  const [num, setNum] = useState<number | ''>('');
  const [parent, setParent] = useState<NotionItem | null>(null);
  const go = useMutation({ mutationFn: () => notionApi.exportPage(pid, { pageNumber: Number(num), parentPageId: parent!.id }), onSuccess: () => toast.success(t('c8b.exported')), onError: (e) => toast.error(workError(e)) });
  return (
    <section className="w-card space-y-3 p-4" aria-label={t('c8b.exportPageT')}>
      <h2 className="w-section-title flex items-center gap-1.5"><Upload size={14} /> {t('c8b.exportPageT')}</h2>
      <label className="block text-[12.5px]"><span className="mb-1 block text-[var(--w-text-2)]">{t('c8b.docsPage')}</span>
        <select className="w-input" value={num} onChange={(e) => setNum(e.target.value ? Number(e.target.value) : '')} data-testid="c8b-export-doc">
          <option value="">—</option>
          {(pages.data?.pages ?? []).map((p) => <option key={p.number} value={p.number}>DOC-{p.number} {p.title}</option>)}
        </select></label>
      <p className="text-[12.5px] text-[var(--w-text-2)]">{t('c8b.parentPage')}</p>
      <Picker kind="page" onPick={setParent} picked={parent} />
      <button type="button" className="w-btn w-btn-primary" disabled={!num || !parent || go.isPending} onClick={() => go.mutate()} data-testid="c8b-notion-export">{go.isPending ? <Spinner size={12} /> : <Upload size={13} />} {t('c8b.exportToNotion')}</button>
      {go.data && (
        <p className="text-[12.5px]">{go.data.url ? <a className="underline" href={go.data.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={12} className="mr-1 inline" />{t('c8b.openInNotion')}</a> : t('c8b.exported')}
          {go.data.warnings.map((w) => <span key={w} className="block text-[var(--w-orange-text)]">{w}</span>)}</p>
      )}
    </section>
  );
}

function ImportDatabase({ pid }: { pid: number }) {
  const { t } = useWT();
  const [db, setDb] = useState<NotionItem | null>(null);
  const [mapping, setMapping] = useState<Partial<Record<MapField, number | null>>>({});
  const [people, setPeople] = useState<Record<string, number | null>>({});
  const [statuses, setStatuses] = useState<Record<string, number>>({});
  const [preview, setPreview] = useState<NotionDbPreview | null>(null);
  const body = () => ({ databaseId: db!.id, mapping, people, statuses });
  const doPreview = useMutation({ mutationFn: () => notionApi.previewDb(pid, body()), onSuccess: setPreview, onError: (e) => toast.error(workError(e)) });
  const run = useMutation({ mutationFn: () => notionApi.importDb(pid, body()), onSuccess: (r) => { setPreview(null); toast.success(t('c8b.dbImported', { created: r.created, dup: r.duplicates })); }, onError: (e) => toast.error(workError(e)) });
  return (
    <section className="w-card space-y-3 p-4" aria-label={t('c8b.importDbT')}>
      <h2 className="w-section-title flex items-center gap-1.5"><Database size={14} /> {t('c8b.importDbT')}</h2>
      <p className="text-[12.5px] text-[var(--w-text-2)]">{t('c8b.importDbB')}</p>
      <Picker kind="database" onPick={(x) => { setDb(x); setPreview(null); setMapping({}); setPeople({}); setStatuses({}); }} picked={db} />
      <button type="button" className="w-btn" disabled={!db || doPreview.isPending} onClick={() => doPreview.mutate()} data-testid="c8b-notion-db-preview">{doPreview.isPending && <Spinner size={12} />} {preview ? t('c8b.refreshPreview') : t('c8b.previewImport')}</button>
      {preview && (
        <>
          <KpiRow label={t('c8b.previewImport')}>
            <KpiTile label={t('c8b.kRows')} value={preview.database.rows} />
            <KpiTile label={t('c8b.kToCreate')} value={preview.summary.toCreate} tone="accent" />
            <KpiTile label={t('c8b.kDuplicates')} value={preview.summary.duplicates} tone="muted" />
            <KpiTile label={t('c8b.kInvalid')} value={preview.summary.invalid} tone={preview.summary.invalid ? 'red' : 'muted'} />
          </KpiRow>
          {preview.columns && (
            <div>
              <p className="mb-1 text-[12.5px] font-medium">{t('c8b.mapProps')}</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {MAP_FIELDS.filter((f) => f !== 'externalId').map((f) => (
                  <label key={f} className="flex items-center gap-2 text-[12.5px]">
                    <span className="w-28 shrink-0">{t(`c7b.mf_${f}` as WKey)}</span>
                    <select className="w-input" value={(mapping[f] ?? preview.mapping?.[f]) ?? ''} onChange={(e) => setMapping({ ...mapping, [f]: e.target.value === '' ? null : Number(e.target.value) })}>
                      <option value="">—</option>
                      {preview.columns!.map((c, i) => (i === 0 ? null : <option key={i} value={i}>{c}</option>))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
          )}
          {preview.people.length > 0 && (
            <div>
              <p className="mb-1 text-[12.5px] font-medium">{t('c7b.matchPeople')}</p>
              <ul className="grid gap-2 md:grid-cols-2">
                {preview.people.map((p) => (
                  <li key={p.key} className="flex items-center gap-2 text-[12.5px]">
                    <span className="min-w-0 flex-1 truncate">{p.name ?? p.email}</span>
                    <select className="w-input max-w-[200px]" aria-label={t('c7b.memberFor', { n: p.name ?? p.email ?? '' })} value={(people[p.key] !== undefined ? people[p.key] : p.userId) ?? ''} onChange={(e) => setPeople({ ...people, [p.key]: e.target.value ? Number(e.target.value) : null })}>
                      <option value="">{t('c7b.leaveEmpty')}</option>
                      {preview.members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {preview.statuses.length > 0 && (
            <div>
              <p className="mb-1 text-[12.5px] font-medium">{t('c7b.matchStatuses')}</p>
              <ul className="grid gap-2 md:grid-cols-2">
                {preview.statuses.map((s) => (
                  <li key={s.name} className="flex items-center gap-2 text-[12.5px]">
                    <span className="min-w-0 flex-1 truncate">“{s.name}”</span>
                    <select className="w-input max-w-[200px]" aria-label={t('c7b.statusFor', { n: s.name })} value={statuses[s.name] ?? s.statusId ?? ''} onChange={(e) => setStatuses({ ...statuses, [s.name]: Number(e.target.value) })}>
                      {!s.statusId && <option value="">{t('c7b.firstStatus')}</option>}
                      {preview.projectStatuses.map((ps) => <option key={ps.id} value={ps.id}>{ps.name}</option>)}
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="w-table-wrap max-h-[360px] overflow-auto">
            <table className="w-full min-w-[640px] text-[12.5px]">
              <thead className="sticky top-0 bg-[var(--w-panel)]"><tr className="text-left text-[var(--w-text-3)]"><th className="p-2">{t('c7b.fTitle')}</th><th className="p-2">{t('c7b.colStatus')}</th><th className="p-2">{t('c7b.mapAssignee')}</th><th className="p-2">{t('c7b.colProblems')}</th></tr></thead>
              <tbody>{preview.rows.map((r) => (
                <tr key={r.externalId} className="border-t border-[var(--w-border)] align-top">
                  <td className="p-2">{r.title}</td><td className="p-2">{r.status}</td><td className="p-2">{r.assignee ?? r.assigneeSource ?? '—'}</td>
                  <td className="p-2">{r.duplicate && <span className="block text-[var(--w-text-3)]">{t('c7b.alreadyImported')}</span>}{[...r.errors, ...r.warnings].map((w) => <span key={w} className="block text-[var(--w-orange-text)]">{w}</span>)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <button type="button" className="w-btn w-btn-primary" disabled={!preview.summary.toCreate || run.isPending} onClick={() => run.mutate()} data-testid="c8b-notion-db-run">{run.isPending ? <Spinner size={12} /> : <Upload size={13} />} {t('c7b.importN', { count: preview.summary.toCreate })}</button>
        </>
      )}
    </section>
  );
}
