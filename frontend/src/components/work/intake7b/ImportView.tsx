'use client';

/**
 * CTW đợt 7b (C15) — trang Import: chọn nguồn (Trello JSON · Asana CSV/JSON · Jira CSV · CSV/Excel chung) ⇒ tải tệp ⇒
 * XEM TRƯỚC (ghép cột, khớp người theo email, khớp trạng thái, lỗi/cảnh báo từng dòng, mục đã nhập trước) ⇒ nhập ⇒ BÁO CÁO.
 * Nhập lại cùng tệp không tạo trùng (máy chủ nhớ mã ngoài). Chỉ ADMIN dự án.
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle2, FileUp, Upload, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import {
  fileToBase64, MAP_FIELDS, workImportApi, type ImportBody, type ImportPreview, type ImportReport, type ImportSource, type MapField,
} from '@/lib/work-ctw7b-api';
import { EmptyState, PageLoading, Spinner } from '../ui';
import KpiTile, { KpiRow } from '../KpiTile';
import { useWT, type WKey } from '../i18n';

const SOURCES: Array<{ id: ImportSource; label: WKey; hint: WKey; accept: string }> = [
  { id: 'TRELLO', label: 'c7b.srcTrello', hint: 'c7b.srcTrelloHint', accept: '.json,application/json' },
  { id: 'ASANA', label: 'c7b.srcAsana', hint: 'c7b.srcAsanaHint', accept: '.csv,.json,text/csv,application/json' },
  { id: 'JIRA', label: 'c7b.srcJira', hint: 'c7b.srcJiraHint', accept: '.csv,text/csv' },
  { id: 'CSV', label: 'c7b.srcCsv', hint: 'c7b.srcCsvHint', accept: '.csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
];
const MAX_BYTES = 7 * 1024 * 1024;

export default function ImportView({ pid }: { pid: number }) {
  const { t, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const [source, setSource] = useState<ImportSource>('TRELLO');
  const [file, setFile] = useState<{ name: string; content: string; encoding: 'text' | 'base64' } | null>(null);
  const [mapping, setMapping] = useState<Partial<Record<MapField, number | null>>>({});
  const [people, setPeople] = useState<Record<string, number | null>>({});
  const [statuses, setStatuses] = useState<Record<string, number>>({});
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [onlyProblems, setOnlyProblems] = useState(false);
  const runs = useQuery({ queryKey: ['c7b-import-runs', pid], queryFn: () => workImportApi.runs(pid) });
  const body = (): Omit<ImportBody, 'dryRun'> => ({ source, fileName: file!.name, content: file!.content, encoding: file!.encoding, mapping, people, statuses });
  const doPreview = useMutation({ mutationFn: () => workImportApi.preview(pid, body()), onSuccess: (p) => { setPreview(p); setReport(null); }, onError: (e) => toast.error(workError(e)) });
  const doRun = useMutation({
    mutationFn: () => workImportApi.run(pid, body()),
    onSuccess: (r) => { setReport(r); setPreview(null); qc.invalidateQueries({ queryKey: ['c7b-import-runs', pid] }); toast.success(t('c7b.importDone', { count: r.created })); },
    onError: (e) => toast.error(workError(e)),
  });

  const pick = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > MAX_BYTES) { toast.error(t('c7b.fileTooBig')); return; }
    const xlsx = /\.xlsx$/i.test(f.name);
    setFile({ name: f.name, content: xlsx ? await fileToBase64(f) : await f.text(), encoding: xlsx ? 'base64' : 'text' });
    setMapping({}); setPeople({}); setStatuses({}); setPreview(null); setReport(null);
  };
  const src = SOURCES.find((s) => s.id === source)!;
  const rows = preview ? (onlyProblems ? preview.rows.filter((r) => r.errors.length || r.warnings.length || r.duplicate) : preview.rows) : [];

  return (
    <div className="space-y-4">
      <section className="w-card p-4" aria-label={t('c7b.step1')}>
        <h2 className="w-section-title">{t('c7b.step1')}</h2>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="radiogroup" aria-label={t('c7b.step1')}>
          {SOURCES.map((s) => (
            <button key={s.id} type="button" role="radio" aria-checked={source === s.id} data-testid={`c7b-src-${s.id}`}
              onClick={() => { setSource(s.id); setFile(null); setPreview(null); setReport(null); }}
              className={cn('rounded-[8px] border px-3 py-2 text-left', source === s.id ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border)] hover:bg-[var(--w-hover)]')}>
              <span className="block text-[13px] font-medium">{t(s.label)}</span>
              <span className="block text-[11.5px] text-[var(--w-text-2)]">{t(s.hint)}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="w-btn cursor-pointer">
            <FileUp size={14} /> {file ? file.name : t('c7b.chooseFile')}
            <input type="file" className="sr-only" accept={src.accept} onChange={(e) => void pick(e.target.files?.[0])} data-testid="c7b-import-file" />
          </label>
          <button type="button" className="w-btn w-btn-primary" disabled={!file || doPreview.isPending} onClick={() => doPreview.mutate()} data-testid="c7b-import-preview">
            {doPreview.isPending && <Spinner size={12} />} {preview ? t('c7b.refreshPreview') : t('c7b.preview')}
          </button>
        </div>
      </section>

      {preview && (
        <>
          <KpiRow label={t('c7b.previewSummary')}>
            <KpiTile label={t('c7b.kToCreate')} value={preview.summary.toCreate} tone="accent" />
            <KpiTile label={t('c7b.kDuplicates')} value={preview.summary.duplicates} tone="muted" hint={t('c7b.kDuplicatesHint')} />
            <KpiTile label={t('c7b.kInvalid')} value={preview.summary.invalid} tone={preview.summary.invalid ? 'red' : 'muted'} />
            <KpiTile label={t('c7b.kComments')} value={preview.summary.comments} />
            <KpiTile label={t('c7b.kChecklist')} value={preview.summary.checklistItems} hint={preview.hasSubtaskType ? t('c7b.asSubtasks') : t('c7b.inDescription')} />
          </KpiRow>
          {preview.notes.length > 0 && <ul className="space-y-1 text-[12.5px] text-[var(--w-text-2)]">{preview.notes.map((n) => <li key={n}>• {n}</li>)}</ul>}

          {preview.columns && (
            <section className="w-card p-4" aria-label={t('c7b.mapColumns')}>
              <h2 className="w-section-title">{t('c7b.mapColumns')}</h2>
              <p className="mt-1 text-[12.5px] text-[var(--w-text-2)]">{t('c7b.mapColumnsHint')}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {MAP_FIELDS.map((f) => (
                  <label key={f} className="flex items-center gap-2 text-[12.5px]">
                    <span className="w-28 shrink-0">{t(`c7b.mf_${f}` as WKey)}</span>
                    <select className="w-input" value={(mapping[f] ?? preview.mapping?.[f]) ?? ''} onChange={(e) => setMapping({ ...mapping, [f]: e.target.value === '' ? null : Number(e.target.value) })}>
                      <option value="">—</option>
                      {preview.columns!.map((c, i) => <option key={i} value={i}>{c || `#${i + 1}`}</option>)}
                    </select>
                  </label>
                ))}
              </div>
            </section>
          )}

          {preview.people.length > 0 && (
            <section className="w-card p-4" aria-label={t('c7b.matchPeople')}>
              <h2 className="w-section-title">{t('c7b.matchPeople')}</h2>
              <p className="mt-1 text-[12.5px] text-[var(--w-text-2)]">{t('c7b.matchPeopleHint')}</p>
              <ul className="mt-2 grid gap-2 md:grid-cols-2">
                {preview.people.map((p) => (
                  <li key={p.key} className="flex items-center gap-2 text-[12.5px]">
                    <span className="min-w-0 flex-1 truncate">{p.name ?? p.email}{p.email && p.name ? <span className="text-[var(--w-text-3)]"> · {p.email}</span> : null}</span>
                    {p.matchedBy && <span className="text-[11px] text-[var(--w-text-3)]">{t(`c7b.by_${p.matchedBy}` as WKey)}</span>}
                    <select className="w-input max-w-[200px]" aria-label={t('c7b.memberFor', { n: p.name ?? p.email ?? '' })} value={(people[p.key] !== undefined ? people[p.key] : p.userId) ?? ''}
                      onChange={(e) => setPeople({ ...people, [p.key]: e.target.value ? Number(e.target.value) : null })}>
                      <option value="">{t('c7b.leaveEmpty')}</option>
                      {preview.members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {preview.statuses.length > 0 && (
            <section className="w-card p-4" aria-label={t('c7b.matchStatuses')}>
              <h2 className="w-section-title">{t('c7b.matchStatuses')}</h2>
              <ul className="mt-2 grid gap-2 md:grid-cols-2">
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
            </section>
          )}

          <section className="w-card p-4" aria-label={t('c7b.rows')}>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="w-section-title">{t('c7b.rows')}</h2>
              <label className="flex items-center gap-1.5 text-[12.5px]"><input type="checkbox" checked={onlyProblems} onChange={(e) => setOnlyProblems(e.target.checked)} /> {t('c7b.onlyProblems')}</label>
              <button type="button" className="w-btn w-btn-primary ml-auto" disabled={!preview.summary.toCreate || doRun.isPending} onClick={() => doRun.mutate()} data-testid="c7b-import-run">
                {doRun.isPending ? <Spinner size={12} /> : <Upload size={13} />} {t('c7b.importN', { count: preview.summary.toCreate })}
              </button>
            </div>
            <div className="w-table-wrap mt-2 max-h-[480px] overflow-auto">
              <table className="w-full min-w-[760px] text-[12.5px]">
                <thead className="sticky top-0 bg-[var(--w-panel)]"><tr className="text-left text-[var(--w-text-3)]"><th className="p-2">{t('c7b.colRow')}</th><th className="p-2">{t('c7b.fTitle')}</th><th className="p-2">{t('c7b.colType')}</th><th className="p-2">{t('c7b.colStatus')}</th><th className="p-2">{t('c7b.mapAssignee')}</th><th className="p-2">{t('c7b.colExtras')}</th><th className="p-2">{t('c7b.colProblems')}</th></tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={`${r.row}-${r.externalId}`} className={cn('border-t border-[var(--w-border)] align-top', r.errors.length && 'bg-[var(--w-danger-soft,transparent)]')}>
                      <td className="p-2 tabular-nums">{r.row}</td>
                      <td className="max-w-[260px] p-2">{r.title || <em className="text-[var(--w-text-3)]">{t('c7b.emptyTitle')}</em>}</td>
                      <td className="p-2">{r.type}</td>
                      <td className="p-2">{r.status}</td>
                      <td className="p-2">{r.assignee ?? (r.assigneeSource ? <span className="text-[var(--w-orange-text)]">{t('c7b.unmatched', { n: r.assigneeSource })}</span> : '—')}</td>
                      <td className="p-2 text-[var(--w-text-2)]">{[r.labels.length ? t('c7b.xLabels', { count: r.labels.length }) : '', r.comments ? t('c7b.xComments', { count: r.comments }) : '', r.checklist ? t('c7b.xChecklist', { count: r.checklist }) : ''].filter(Boolean).join(' · ')}</td>
                      <td className="max-w-[320px] p-2">
                        {r.duplicate && <span className="block text-[var(--w-text-3)]">{t('c7b.alreadyImported')}</span>}
                        {r.errors.map((e) => <span key={e} className="flex items-start gap-1 text-[var(--w-red-text)]"><XCircle size={12} className="mt-0.5 shrink-0" aria-hidden="true" />{e}</span>)}
                        {r.warnings.map((w) => <span key={w} className="flex items-start gap-1 text-[var(--w-orange-text)]"><AlertTriangle size={12} className="mt-0.5 shrink-0" aria-hidden="true" />{w}</span>)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {report && <Report r={report} />}

      <section className="w-card p-4" aria-label={t('c7b.history')}>
        <h2 className="w-section-title">{t('c7b.history')}</h2>
        {runs.isLoading ? <PageLoading rows={2} /> : runs.data?.length ? (
          <ul className="mt-2 divide-y divide-[var(--w-border)] text-[12.5px]">
            {runs.data.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
                <span className="font-medium">{r.source}</span><span className="min-w-0 flex-1 truncate text-[var(--w-text-2)]">{r.fileName ?? '—'}</span>
                <span>{t('c7b.runSummary', { created: r.created, dup: r.duplicates, failed: r.failed })}</span>
                <span className="text-[var(--w-text-3)]">{r.by ?? ''} · {fmtDateTime(r.createdAt)}</span>
              </li>
            ))}
          </ul>
        ) : <p className="mt-2 text-[13px] text-[var(--w-text-3)]">{t('c7b.noRuns')}</p>}
      </section>
    </div>
  );
}

function Report({ r }: { r: ImportReport }) {
  const { t } = useWT();
  return (
    <section className="w-card p-4" aria-label={t('c7b.report')} data-testid="c7b-import-report">
      <h2 className="flex items-center gap-2 text-[14px] font-semibold"><CheckCircle2 size={16} className="text-[var(--w-green-text)]" aria-hidden="true" /> {t('c7b.report')}</h2>
      <KpiRow label={t('c7b.report')} className="mt-3">
        <KpiTile label={t('c7b.kCreated')} value={r.created} tone="green" />
        <KpiTile label={t('c7b.kSubtasks')} value={r.subtasks} />
        <KpiTile label={t('c7b.kComments')} value={r.comments} />
        <KpiTile label={t('c7b.kDuplicates')} value={r.duplicates} tone="muted" />
        <KpiTile label={t('c7b.kFailed')} value={r.failed + r.invalid} tone={r.failed + r.invalid ? 'red' : 'muted'} />
      </KpiRow>
      {r.unmatchedPeople.length > 0 && <p className="mt-3 text-[12.5px] text-[var(--w-orange-text)]">{t('c7b.unmatchedList', { list: r.unmatchedPeople.join(', ') })}</p>}
      {[...r.invalidRows.map((x) => `${t('c7b.colRow')} ${x.row}: ${x.errors.join('; ')}`), ...r.failures.map((x) => `${t('c7b.colRow')} ${x.row}: ${x.error}`)].length > 0 && (
        <ul className="mt-2 space-y-0.5 text-[12.5px] text-[var(--w-red-text)]">{[...r.invalidRows.map((x) => `${t('c7b.colRow')} ${x.row}: ${x.errors.join('; ')}`), ...r.failures.map((x) => `${t('c7b.colRow')} ${x.row}: ${x.error}`)].map((x) => <li key={x}>{x}</li>)}</ul>
      )}
      {r.warnings.length > 0 && (
        <details className="mt-2 text-[12.5px]"><summary className="cursor-pointer text-[var(--w-text-2)]">{t('c7b.nWarnings', { count: r.warnings.length })}</summary>
          <ul className="mt-1 space-y-0.5 text-[var(--w-text-2)]">{r.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
        </details>
      )}
    </section>
  );
}

export function ImportEmpty() {
  const { t } = useWT();
  return <EmptyState title={t('c7b.adminOnly')} body={t('c7b.adminOnlyImport')} />;
}
