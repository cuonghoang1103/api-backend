'use client';

/**
 * Tab "Import" — nhập thẻ từ CSV (file xuất của CT Work hoặc Jira "Export →
 * CSV (all fields)"). Ba bước: chọn file → chạy thử (dry run, báo lỗi/cảnh
 * báo từng dòng) → nhập thật. Đọc file ngay trong trình duyệt, gửi dạng chữ.
 */

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, ArrowLeft, CheckCircle2, Download, FileUp, Upload, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, type ImportPreviewRow, type ImportResult, type ProjectConfig } from '@/lib/work-api';
import { wk } from '../hooks';
import { formatBytes, Spinner } from '../ui';
import { ConfirmDialog, Section } from './shared';
import { wt, wfmt } from '@/components/work/i18n';

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_ROWS = 2000;

const columns = (): Array<[string, string]> => [
  ['Summary', wt('pimport.col0')],
  ['Issue key', wt('pimport.col1')],
  ['Issue Type', wt('pimport.col2')],
  ['Status', wt('pimport.col3')],
  ['Priority', wt('pimport.col4')],
  ['Assignee / Reporter', wt('pimport.col5')],
  ['Description', wt('pimport.col6')],
  ['Labels', wt('pimport.col7')],
  ['Story Points', wt('pimport.col8')],
  ['Due date / Start date', wt('pimport.col9')],
  ['Parent', wt('pimport.col10')],
  ['Sprint', wt('pimport.col11')],
  ['Original Estimate', wt('pimport.col12')],
  ['Created', wt('pimport.col13')],
];

function csvCell(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function downloadTemplate(key: string) {
  const rows = [
    ['Issue key', 'Summary', 'Issue Type', 'Status', 'Priority', 'Assignee', 'Labels', 'Story Points', 'Due date', 'Parent', 'Description'],
    ['T-1', 'User accounts', 'Epic', 'To Do', 'High', '', 'auth', '', '', '', 'Sign-up, login and password reset'],
    ['T-2', 'Login page with email and password', 'Story', 'In Progress', 'Medium', '', 'auth, frontend', '3', '2026-10-15', 'T-1', 'Show an error for a wrong password'],
  ];
  const csv = `﻿${rows.map((r) => r.map(csvCell).join(',')).join('\r\n')}\r\n`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${key}-import-template.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Chip({ tone, children }: { tone: 'error' | 'warning'; children: string }) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-start gap-1 rounded-[4px] border px-1.5 py-0.5 text-[11.5px] leading-snug',
        tone === 'error'
          ? 'border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-red)_10%,transparent)] text-[var(--w-red)]'
          : 'border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_10%,transparent)] text-[var(--w-orange)]',
      )}
    >
      {tone === 'error' ? <XCircle size={11} className="mt-[2px] shrink-0" /> : <AlertTriangle size={11} className="mt-[2px] shrink-0" />}
      <span className="min-w-0 break-words">{children}</span>
    </span>
  );
}

function PreviewTable({ rows }: { rows: ImportPreviewRow[] }) {
  return (
    <div className="max-h-[480px] overflow-auto rounded-[8px] border border-[var(--w-border)]">
      <table className="w-full min-w-[720px] border-collapse text-[12.5px]">
        <thead className="sticky top-0 z-[1] bg-[var(--w-sunken)] text-left text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">
          <tr>
            <th className="w-[56px] px-3 py-2">{wt('pimport.row')}</th>
            <th className="px-3 py-2">{wt('common.summary')}</th>
            <th className="w-[96px] px-3 py-2">{wt('common.type')}</th>
            <th className="w-[120px] px-3 py-2">{wt('common.status')}</th>
            <th className="w-[90px] px-3 py-2">{wt('common.parent')}</th>
            <th className="w-[240px] px-3 py-2">{wt('pimport.problems')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.row} className={cn('border-t border-[var(--w-border)] align-top', r.errors.length > 0 && 'bg-[color-mix(in_srgb,var(--w-red)_4%,transparent)]')}>
              <td className="tabular px-3 py-2 text-[var(--w-text-3)]">{r.row}</td>
              <td className="px-3 py-2">{r.summary || <span className="italic text-[var(--w-text-3)]">{wt('pimport.empty')}</span>}</td>
              <td className="px-3 py-2 text-[var(--w-text-2)]">{r.type}</td>
              <td className="px-3 py-2 text-[var(--w-text-2)]">{r.status}</td>
              <td className="px-3 py-2 font-mono text-[11.5px] text-[var(--w-text-2)]">{r.parent ?? ''}</td>
              <td className="px-3 py-2">
                {r.errors.length || r.warnings.length ? (
                  <div className="flex flex-col items-start gap-1">
                    {r.errors.map((e) => <Chip key={`e${e}`} tone="error">{e}</Chip>)}
                    {r.warnings.map((w) => <Chip key={`w${w}`} tone="warning">{w}</Chip>)}
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[12px] text-[var(--w-green)]"><CheckCircle2 size={12} /> {wt('pimport.ready')}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type Done = Extract<ImportResult, { dryRun: false }>;
type Preview = Extract<ImportResult, { dryRun: true }>;

export default function ProjectImport({ config, slug }: { config: ProjectConfig; slug: string }) {
  const pid = config.id;
  const qc = useQueryClient();
  const canImport = config.permissions.settings;
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string; size: number; text: string } | null>(null);
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const [onlyProblems, setOnlyProblems] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const reset = () => { setFile(null); setPreview(null); setDone(null); setOnlyProblems(false); if (inputRef.current) inputRef.current.value = ''; };

  const dry = useMutation({
    mutationFn: (csv: string) => workApi.importIssues(pid, { csv, dryRun: true }),
    onSuccess: (r) => { if (r.dryRun) { setPreview(r); setOnlyProblems(r.valid < r.total); } },
    onError: (err) => toast.error(workError(err, wt('pimport.readFailed'))),
  });
  const run = useMutation({
    mutationFn: (csv: string) => workApi.importIssues(pid, { csv, dryRun: false }),
    onSuccess: (r) => {
      setConfirm(false);
      if (!r.dryRun) {
        setDone(r);
        toast.success(wt('pimport.nImported', { count: r.created }));
      }
      for (const k of [wk.board(pid), wk.issues(pid), wk.backlog(pid), wk.project(pid), wk.reports(pid)]) qc.invalidateQueries({ queryKey: k });
    },
    onError: (err) => { setConfirm(false); toast.error(workError(err, wt('pimport.importFailed'))); },
  });

  const pick = (f: File | undefined) => {
    if (!f) return;
    if (!/\.csv$/i.test(f.name) && f.type !== 'text/csv') { toast.error(wt('pimport.chooseCsv')); return; }
    if (f.size > MAX_BYTES) { toast.error(wt('pimport.tooBig', { s: formatBytes(f.size) })); return; }
    const reader = new FileReader();
    reader.onload = () => {
      // Bỏ BOM của Excel để cột đầu tiên khớp tên.
      const text = String(reader.result ?? '').replace(/^﻿/, '');
      setFile({ name: f.name, size: f.size, text });
      setPreview(null);
      setDone(null);
      dry.mutate(text);
    };
    reader.onerror = () => toast.error(wt('pimport.readFailed'));
    reader.readAsText(f);
  };

  const rows = useMemo(() => {
    if (!preview) return [];
    return onlyProblems ? preview.rows.filter((r) => r.errors.length || r.warnings.length) : preview.rows;
  }, [preview, onlyProblems]);
  const errorRows = preview ? preview.total - preview.valid : 0;
  const warnRows = preview ? preview.rows.filter((r) => !r.errors.length && r.warnings.length).length : 0;

  if (!canImport) {
    return (
      <Section title={wt('pimport.importIssues')} description={wt('pimport.bringIn')}>
        <p className="text-[13px] text-[var(--w-text-3)]">{wt('pimport.onlyAdmins')}</p>
      </Section>
    );
  }

  // ── Bước 3: kết quả ──
  if (done) {
    return (
      <Section title={wt('pimport.complete')}>
        <div className="max-w-[640px] space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { n: done.created, label: wt('pimport.sCreated'), cls: 'text-[var(--w-green)]' },
              { n: done.skipped, label: wt('pimport.sSkipped'), cls: done.skipped ? 'text-[var(--w-orange)]' : '' },
              { n: done.failures.length, label: wt('pimport.sFailed'), cls: done.failures.length ? 'text-[var(--w-red)]' : '' },
            ].map((s) => (
              <div key={s.label} className="rounded-[8px] border border-[var(--w-border)] px-3 py-2.5">
                <div className={cn('tabular text-[20px] font-semibold', s.cls)}>{s.n}</div>
                <div className="text-[12px] text-[var(--w-text-3)]">{s.label}</div>
              </div>
            ))}
          </div>
          {done.failures.length > 0 && (
            <div className="rounded-[8px] border border-[var(--w-border)]">
              <div className="border-b border-[var(--w-border)] px-3 py-2 text-[12px] font-medium text-[var(--w-text-2)]">{wt('pimport.notCreated')}</div>
              <ul className="max-h-[260px] overflow-y-auto">
                {done.failures.map((f) => (
                  <li key={f.row} className="flex gap-3 border-b border-[var(--w-border)] px-3 py-1.5 text-[12.5px] last:border-b-0">
                    <span className="tabular w-[52px] shrink-0 text-[var(--w-text-3)]">{wt('pimport.rowN', { n: f.row })}</span>
                    <span className="min-w-0 break-words text-[var(--w-red)]">{f.error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Link href={`/work/${slug}/${config.key}/list`} className="w-btn w-btn-primary">{wt('pimport.viewIssues')}</Link>
            <button type="button" className="w-btn" onClick={reset}>{wt('pimport.another')}</button>
          </div>
        </div>
      </Section>
    );
  }

  // ── Bước 2: xem trước ──
  if (file && (preview || dry.isPending)) {
    return (
      <Section
        title={wt('pimport.review')}
        description={wt('pimport.reviewDesc')}
        action={
          <button type="button" className="w-btn w-btn-sm" onClick={reset} disabled={run.isPending}>
            <ArrowLeft size={13} /> {wt('pimport.chooseAnother')}
          </button>
        }
      >
        <div className="mb-3 flex min-w-0 items-center gap-2 text-[13px]">
          <FileUp size={14} className="shrink-0 text-[var(--w-text-3)]" />
          <span className="min-w-0 truncate font-medium">{file.name}</span>
          <span className="shrink-0 text-[var(--w-text-3)]">{formatBytes(file.size)}</span>
        </div>
        {dry.isPending || !preview ? (
          <div className="flex items-center gap-2 py-8 text-[13px] text-[var(--w-text-2)]"><Spinner size={14} /> {wt('pimport.checking')}</div>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="text-[13px]">
                <span className="tabular font-semibold">{preview.total}</span> {wt('pimport.rowsWord', { count: preview.total }).replace(/^\S+\s/, '')}
                <span className="mx-1.5 text-[var(--w-text-3)]">·</span>
                <span className="tabular font-semibold text-[var(--w-green)]">{preview.valid}</span> {wt('pimport.readyLc')}
                <span className="mx-1.5 text-[var(--w-text-3)]">·</span>
                <span className={cn('tabular font-semibold', errorRows && 'text-[var(--w-red)]')}>{errorRows}</span> {wt('pimport.withErrors')}
                {warnRows > 0 && (
                  <>
                    <span className="mx-1.5 text-[var(--w-text-3)]">·</span>
                    <span className="tabular font-semibold text-[var(--w-orange)]">{warnRows}</span> {wt('pimport.withWarnings')}
                  </>
                )}
              </div>
              <label className="ml-auto flex cursor-pointer items-center gap-1.5 text-[12.5px] text-[var(--w-text-2)]">
                <input type="checkbox" checked={onlyProblems} onChange={(e) => setOnlyProblems(e.target.checked)} className="accent-[var(--w-accent)]" />
                {wt('pimport.onlyProblems')}
              </label>
            </div>
            {rows.length ? <PreviewTable rows={rows} /> : (
              <div className="rounded-[8px] border border-dashed border-[var(--w-border-strong)] px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">{wt('pimport.noProblems')}</div>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button type="button" className="w-btn w-btn-primary" disabled={!preview.valid || run.isPending} onClick={() => setConfirm(true)}>
                {run.isPending ? <Spinner size={12} /> : <Upload size={14} />}
                {wt('pimport.importN', { count: preview.valid })}
              </button>
              {!preview.valid && <span className="text-[12px] text-[var(--w-red)]">{wt('pimport.allErrors')}</span>}
            </div>
          </>
        )}
        <ConfirmDialog
          open={confirm}
          onClose={() => !run.isPending && setConfirm(false)}
          danger={false}
          title={wt('pimport.importQ', { n: preview?.valid ?? 0 })}
          body={
            <>
              {wt('pimport.confirmBody', { n: preview?.valid ?? 0, name: config.name, skip: errorRows ? wt('pimport.skipN', { n: errorRows }) : '' })}
            </>
          }
          confirmLabel={run.isPending ? wt('pimport.importing') : wt('common.import')}
          pending={run.isPending}
          onConfirm={() => run.mutate(file.text)}
        />
      </Section>
    );
  }

  // ── Bước 1: chọn file ──
  return (
    <>
      <Section title={wt('pimport.importIssues')} description={wt('pimport.bulkDesc', { n: MAX_ROWS.toLocaleString(wfmt.intl()) })}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]); }}
          className={cn(
            'flex max-w-[640px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed px-4 py-10 text-center transition-colors',
            drag ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border-strong)] hover:bg-[var(--w-hover)]',
          )}
        >
          <FileUp size={22} className="text-[var(--w-text-3)]" />
          <div className="text-[13px] font-medium">{wt('pimport.drop')} <span className="text-[var(--w-accent-text)]">{wt('pimport.browse')}</span></div>
          <div className="text-[12px] text-[var(--w-text-3)]">{wt('pimport.utf8')}</div>
          <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        </div>
        {file && !preview && !dry.isPending && (
          <button type="button" className="w-btn w-btn-ghost w-btn-sm mt-2" onClick={reset}><X size={12} /> {wt('common.clear')}</button>
        )}
      </Section>

      <Section
        title={wt('pimport.supported')}
        action={
          <button type="button" className="w-btn w-btn-sm" onClick={() => downloadTemplate(config.key)}>
            <Download size={13} /> {wt('pimport.template')}
          </button>
        }
      >
        <ul className="mb-4 max-w-[640px] list-disc space-y-1 pl-5 text-[13px] text-[var(--w-text-2)]">
          <li><span className="font-medium text-[var(--w-text)]">CT Work export</span> {wt('pimport.srcCtw')}</li>
          <li><span className="font-medium text-[var(--w-text)]">Jira</span> {wt('pimport.srcJira')} <span className="font-medium text-[var(--w-text)]">Export CSV (all fields)</span>.</li>
          <li>{wt('pimport.srcAny')} <span className="font-medium text-[var(--w-text)]">Summary</span>{wt('pimport.srcAnyEnd')}</li>
        </ul>
        <div className="max-w-[640px] overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
          <table className="w-full min-w-[480px] border-collapse text-[12.5px]">
            <thead className="bg-[var(--w-sunken)] text-left text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">
              <tr><th className="w-[180px] px-3 py-2">{wt('pimport.column')}</th><th className="px-3 py-2">{wt('pimport.howRead')}</th></tr>
            </thead>
            <tbody>
              {columns().map(([c, h]) => (
                <tr key={c} className="border-t border-[var(--w-border)]">
                  <td className="px-3 py-1.5 font-medium">{c}</td>
                  <td className="px-3 py-1.5 text-[var(--w-text-2)]">{h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[12px] text-[var(--w-text-3)]">Column names are not case-sensitive. Other columns are ignored.</p>
      </Section>
    </>
  );
}
