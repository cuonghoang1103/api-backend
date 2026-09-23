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

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_ROWS = 2000;

const COLUMNS: Array<[string, string]> = [
  ['Summary', 'Required. Also accepts “Title”'],
  ['Issue key', 'Used to link parents inside the file'],
  ['Issue Type', 'Epic, Story, Task, Bug, Sub-task… (unknown ⇒ Task)'],
  ['Status', 'Matched by name (unknown ⇒ first status)'],
  ['Priority', 'Highest … Lowest, or Jira names like Blocker, Major, Minor'],
  ['Assignee / Reporter', 'Username or display name of a project member'],
  ['Description', 'Plain text'],
  ['Labels', 'Repeated columns or comma-separated; missing labels are created'],
  ['Story Points', 'Number'],
  ['Due date / Start date', '2026-09-23, 23/Sep/26 or 23/09/2026'],
  ['Parent', 'Issue key in the file, or an existing key such as KEY-12. Also “Epic Link”'],
  ['Sprint', 'Name of an open sprint (missing ⇒ backlog)'],
  ['Original Estimate', 'Seconds (Jira) or hours with the “(h)” header'],
  ['Created', 'Keeps the original creation date'],
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
            <th className="w-[56px] px-3 py-2">Row</th>
            <th className="px-3 py-2">Summary</th>
            <th className="w-[96px] px-3 py-2">Type</th>
            <th className="w-[120px] px-3 py-2">Status</th>
            <th className="w-[90px] px-3 py-2">Parent</th>
            <th className="w-[240px] px-3 py-2">Problems</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.row} className={cn('border-t border-[var(--w-border)] align-top', r.errors.length > 0 && 'bg-[color-mix(in_srgb,var(--w-red)_4%,transparent)]')}>
              <td className="tabular px-3 py-2 text-[var(--w-text-3)]">{r.row}</td>
              <td className="px-3 py-2">{r.summary || <span className="italic text-[var(--w-text-3)]">(empty)</span>}</td>
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
                  <span className="inline-flex items-center gap-1 text-[12px] text-[var(--w-green)]"><CheckCircle2 size={12} /> Ready</span>
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
    onError: (err) => toast.error(workError(err, 'Could not read the file')),
  });
  const run = useMutation({
    mutationFn: (csv: string) => workApi.importIssues(pid, { csv, dryRun: false }),
    onSuccess: (r) => {
      setConfirm(false);
      if (!r.dryRun) {
        setDone(r);
        toast.success(`${r.created} ${r.created === 1 ? 'issue' : 'issues'} imported`);
      }
      for (const k of [wk.board(pid), wk.issues(pid), wk.backlog(pid), wk.project(pid), wk.reports(pid)]) qc.invalidateQueries({ queryKey: k });
    },
    onError: (err) => { setConfirm(false); toast.error(workError(err, 'Import failed')); },
  });

  const pick = (f: File | undefined) => {
    if (!f) return;
    if (!/\.csv$/i.test(f.name) && f.type !== 'text/csv') { toast.error('Choose a .csv file'); return; }
    if (f.size > MAX_BYTES) { toast.error(`The file is ${formatBytes(f.size)} — the limit is 8 MB`); return; }
    const reader = new FileReader();
    reader.onload = () => {
      // Bỏ BOM của Excel để cột đầu tiên khớp tên.
      const text = String(reader.result ?? '').replace(/^﻿/, '');
      setFile({ name: f.name, size: f.size, text });
      setPreview(null);
      setDone(null);
      dry.mutate(text);
    };
    reader.onerror = () => toast.error('Could not read the file');
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
      <Section title="Import issues" description="Bring issues in from a CSV file exported by CT Work or Jira.">
        <p className="text-[13px] text-[var(--w-text-3)]">Only project admins can import issues.</p>
      </Section>
    );
  }

  // ── Bước 3: kết quả ──
  if (done) {
    return (
      <Section title="Import complete">
        <div className="max-w-[640px] space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { n: done.created, label: 'Created', cls: 'text-[var(--w-green)]' },
              { n: done.skipped, label: 'Skipped (errors)', cls: done.skipped ? 'text-[var(--w-orange)]' : '' },
              { n: done.failures.length, label: 'Failed', cls: done.failures.length ? 'text-[var(--w-red)]' : '' },
            ].map((s) => (
              <div key={s.label} className="rounded-[8px] border border-[var(--w-border)] px-3 py-2.5">
                <div className={cn('tabular text-[20px] font-semibold', s.cls)}>{s.n}</div>
                <div className="text-[12px] text-[var(--w-text-3)]">{s.label}</div>
              </div>
            ))}
          </div>
          {done.failures.length > 0 && (
            <div className="rounded-[8px] border border-[var(--w-border)]">
              <div className="border-b border-[var(--w-border)] px-3 py-2 text-[12px] font-medium text-[var(--w-text-2)]">Rows that could not be created</div>
              <ul className="max-h-[260px] overflow-y-auto">
                {done.failures.map((f) => (
                  <li key={f.row} className="flex gap-3 border-b border-[var(--w-border)] px-3 py-1.5 text-[12.5px] last:border-b-0">
                    <span className="tabular w-[52px] shrink-0 text-[var(--w-text-3)]">Row {f.row}</span>
                    <span className="min-w-0 break-words text-[var(--w-red)]">{f.error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Link href={`/work/${slug}/${config.key}/list`} className="w-btn w-btn-primary">View issues</Link>
            <button type="button" className="w-btn" onClick={reset}>Import another file</button>
          </div>
        </div>
      </Section>
    );
  }

  // ── Bước 2: xem trước ──
  if (file && (preview || dry.isPending)) {
    return (
      <Section
        title="Review the import"
        description={<>Nothing has been created yet. Rows with errors are skipped; rows with warnings are imported with the noted adjustments.</>}
        action={
          <button type="button" className="w-btn w-btn-sm" onClick={reset} disabled={run.isPending}>
            <ArrowLeft size={13} /> Choose another file
          </button>
        }
      >
        <div className="mb-3 flex min-w-0 items-center gap-2 text-[13px]">
          <FileUp size={14} className="shrink-0 text-[var(--w-text-3)]" />
          <span className="min-w-0 truncate font-medium">{file.name}</span>
          <span className="shrink-0 text-[var(--w-text-3)]">{formatBytes(file.size)}</span>
        </div>
        {dry.isPending || !preview ? (
          <div className="flex items-center gap-2 py-8 text-[13px] text-[var(--w-text-2)]"><Spinner size={14} /> Checking every row…</div>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="text-[13px]">
                <span className="tabular font-semibold">{preview.total}</span> {preview.total === 1 ? 'row' : 'rows'}
                <span className="mx-1.5 text-[var(--w-text-3)]">·</span>
                <span className="tabular font-semibold text-[var(--w-green)]">{preview.valid}</span> ready
                <span className="mx-1.5 text-[var(--w-text-3)]">·</span>
                <span className={cn('tabular font-semibold', errorRows && 'text-[var(--w-red)]')}>{errorRows}</span> with errors
                {warnRows > 0 && (
                  <>
                    <span className="mx-1.5 text-[var(--w-text-3)]">·</span>
                    <span className="tabular font-semibold text-[var(--w-orange)]">{warnRows}</span> with warnings
                  </>
                )}
              </div>
              <label className="ml-auto flex cursor-pointer items-center gap-1.5 text-[12.5px] text-[var(--w-text-2)]">
                <input type="checkbox" checked={onlyProblems} onChange={(e) => setOnlyProblems(e.target.checked)} className="accent-[var(--w-accent)]" />
                Only problems
              </label>
            </div>
            {rows.length ? <PreviewTable rows={rows} /> : (
              <div className="rounded-[8px] border border-dashed border-[var(--w-border-strong)] px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">No problems found — every row is ready.</div>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button type="button" className="w-btn w-btn-primary" disabled={!preview.valid || run.isPending} onClick={() => setConfirm(true)}>
                {run.isPending ? <Spinner size={12} /> : <Upload size={14} />}
                Import {preview.valid} {preview.valid === 1 ? 'issue' : 'issues'}
              </button>
              {!preview.valid && <span className="text-[12px] text-[var(--w-red)]">Every row has an error. Fix the file and try again.</span>}
            </div>
          </>
        )}
        <ConfirmDialog
          open={confirm}
          onClose={() => !run.isPending && setConfirm(false)}
          danger={false}
          title={`Import ${preview?.valid ?? 0} issues?`}
          body={
            <>
              {preview?.valid} {preview?.valid === 1 ? 'issue' : 'issues'} will be created in <span className="font-medium text-[var(--w-text)]">{config.name}</span>
              {errorRows ? <> and {errorRows} {errorRows === 1 ? 'row' : 'rows'} with errors will be skipped</> : null}. Missing labels are created. This can take a minute for large files.
            </>
          }
          confirmLabel={run.isPending ? 'Importing…' : 'Import'}
          pending={run.isPending}
          onConfirm={() => run.mutate(file.text)}
        />
      </Section>
    );
  }

  // ── Bước 1: chọn file ──
  return (
    <>
      <Section title="Import issues" description={`Create issues in bulk from a CSV file — up to ${MAX_ROWS.toLocaleString('en-US')} rows and 8 MB per file. You review every row before anything is created.`}>
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
          <div className="text-[13px] font-medium">Drop a .csv file here, or <span className="text-[var(--w-accent-text)]">browse</span></div>
          <div className="text-[12px] text-[var(--w-text-3)]">UTF-8 CSV with a header row</div>
          <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        </div>
        {file && !preview && !dry.isPending && (
          <button type="button" className="w-btn w-btn-ghost w-btn-sm mt-2" onClick={reset}><X size={12} /> Clear</button>
        )}
      </Section>

      <Section
        title="Supported files"
        action={
          <button type="button" className="w-btn w-btn-sm" onClick={() => downloadTemplate(config.key)}>
            <Download size={13} /> Download a template
          </button>
        }
      >
        <ul className="mb-4 max-w-[640px] list-disc space-y-1 pl-5 text-[13px] text-[var(--w-text-2)]">
          <li><span className="font-medium text-[var(--w-text)]">CT Work export</span> — the CSV from Issues → Export in any project.</li>
          <li><span className="font-medium text-[var(--w-text)]">Jira</span> — in Jira, open Filters → Export → <span className="font-medium text-[var(--w-text)]">Export CSV (all fields)</span>.</li>
          <li>Any spreadsheet saved as CSV, as long as it has a <span className="font-medium text-[var(--w-text)]">Summary</span> column.</li>
        </ul>
        <div className="max-w-[640px] overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
          <table className="w-full min-w-[480px] border-collapse text-[12.5px]">
            <thead className="bg-[var(--w-sunken)] text-left text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">
              <tr><th className="w-[180px] px-3 py-2">Column</th><th className="px-3 py-2">How it is read</th></tr>
            </thead>
            <tbody>
              {COLUMNS.map(([c, h]) => (
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
