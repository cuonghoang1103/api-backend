'use client';

/**
 * Nhập test từ CSV (file hoặc dán). Ba bước: nguồn → xem trước → kết quả.
 * Bố cục Xray/Excel quen thuộc: mỗi dòng một bước, dòng Title trống = bước
 * tiếp theo của test phía trên.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, Download, FileUp, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { wk } from '../hooks';
import { Dialog, PRIORITIES, Spinner } from '../ui';
import { parseTestsCsv, templateCsv } from './csv';
import { isTestsDisabledError } from './testing-ui';

type Result = { created: number[]; failed: Array<{ row: number; title: string; error: string }> };

export default function ImportTestsDialog({ open, onClose, config, pid, onOpenTest }: {
  open: boolean; onClose: () => void; config: ProjectConfig; pid: number; onOpenTest: (num: number) => void;
}) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [stage, setStage] = useState<'source' | 'preview' | 'done'>('source');
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!open) return;
    setText(''); setFileName(null); setStage('source'); setResult(null); setPending(false);
  }, [open]);

  const parsed = useMemo(() => (stage === 'source' ? null : parseTestsCsv(text, config.key)), [stage, text, config.key]);

  const readFile = (f: File | undefined) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error('The file is larger than 5 MB.'); return; }
    const r = new FileReader();
    r.onload = () => { setText(String(r.result ?? '')); setFileName(f.name); };
    r.onerror = () => toast.error('Could not read the file.');
    r.readAsText(f);
  };

  const downloadTemplate = () => {
    const blob = new Blob([templateCsv(config.key)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.key.toLowerCase()}-tests-template.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const runImport = async () => {
    if (!parsed?.tests.length) return;
    setPending(true);
    try {
      const res = await workApi.importTests(pid, parsed.tests.map((t) => t.input));
      setResult(res);
      setStage('done');
      qc.invalidateQueries({ queryKey: wk.tests(pid) });
      qc.invalidateQueries({ queryKey: wk.issues(pid) });
      if (res.created.length) toast.success(`Imported ${res.created.length} test${res.created.length === 1 ? '' : 's'}`);
    } catch (e) {
      toast.error(isTestsDisabledError(e) ? 'Test management is not enabled for this project.' : workError(e, 'Import failed'));
    } finally {
      setPending(false);
    }
  };

  const totalSteps = parsed?.tests.reduce((n, t) => n + (t.input.steps?.length ?? 0), 0) ?? 0;
  const blocking = !!parsed?.errors.length;

  const footer = stage === 'source' ? (
    <>
      <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
      <button type="button" className="w-btn w-btn-primary" disabled={!text.trim()} onClick={() => setStage('preview')}>Preview</button>
    </>
  ) : stage === 'preview' ? (
    <>
      <button type="button" className="w-btn" onClick={() => setStage('source')} disabled={pending}>Back</button>
      <button type="button" className="w-btn w-btn-primary" disabled={pending || blocking || !parsed?.tests.length} onClick={runImport}>
        {pending && <Spinner size={12} />} Import {parsed?.tests.length ?? 0} test{parsed?.tests.length === 1 ? '' : 's'}
      </button>
    </>
  ) : (
    <button type="button" className="w-btn w-btn-primary" onClick={onClose}>Done</button>
  );

  return (
    <Dialog open={open} onClose={() => !pending && onClose()} title="Import tests from CSV" width={820} footer={footer}>
      {stage === 'source' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3 text-[13px] leading-relaxed text-[var(--w-text-2)]">
            <p className="min-w-0 flex-1 basis-[320px]">
              One row per step. Start a new test by filling <b>Title</b>; leave Title empty to add more steps to the test above.
              Columns: <code className="text-[12px]">Title</code>, <code className="text-[12px]">Preconditions</code>, <code className="text-[12px]">Step</code>,{' '}
              <code className="text-[12px]">Test data</code>, <code className="text-[12px]">Expected result</code>, <code className="text-[12px]">Requirement</code>,{' '}
              <code className="text-[12px]">Priority</code> (Highest–Lowest or 1–5).
            </p>
            <button type="button" className="w-btn w-btn-sm" onClick={downloadTemplate}><Download size={13} /> Download template</button>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); readFile(e.dataTransfer.files?.[0]); }}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed px-4 py-6 text-center text-[13px]',
              dragging ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border-strong)]',
            )}
          >
            <FileUp size={18} className="text-[var(--w-text-3)]" />
            <div>
              {fileName ? <span className="font-medium">{fileName}</span> : 'Drop a .csv file here, or'}{' '}
              <button type="button" className="font-medium text-[var(--w-accent-text)] underline-offset-2 hover:underline" onClick={() => fileRef.current?.click()}>
                {fileName ? 'choose another file' : 'browse'}
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => { readFile(e.target.files?.[0]); e.target.value = ''; }}
            />
          </div>

          <div>
            <label className="w-label">Or paste CSV</label>
            <textarea
              className="w-input min-h-[140px] font-mono text-[12px]"
              value={text}
              spellCheck={false}
              onChange={(e) => { setText(e.target.value); setFileName(null); }}
              placeholder={'Title,Step,Expected result\nLogin works,Open the login page,The form is shown\n,Submit valid credentials,The dashboard opens'}
            />
          </div>
        </div>
      )}

      {stage === 'preview' && parsed && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
            <span><b className="tabular">{parsed.tests.length}</b> <span className="text-[var(--w-text-2)]">tests found</span></span>
            <span><b className="tabular">{totalSteps}</b> <span className="text-[var(--w-text-2)]">steps</span></span>
            <span><b className="tabular">{parsed.warnings.length + parsed.tests.reduce((n, t) => n + t.warnings.length, 0)}</b> <span className="text-[var(--w-text-2)]">warnings</span></span>
          </div>
          {parsed.errors.map((e) => (
            <Notice key={e} kind="error">{e}</Notice>
          ))}
          {parsed.warnings.slice(0, 8).map((w) => (
            <Notice key={w} kind="warn">{w}</Notice>
          ))}
          {parsed.tests.length > 0 && (
            <div className="max-h-[46vh] overflow-auto rounded-[8px] border border-[var(--w-border)]">
              <table className="w-full min-w-[620px] border-collapse text-[12.5px]">
                <thead className="sticky top-0 bg-[var(--w-sunken)] text-left text-[11px] uppercase tracking-wide text-[var(--w-text-3)]">
                  <tr>
                    <th className="px-2.5 py-2 font-medium">Row</th>
                    <th className="px-2.5 py-2 font-medium">Title</th>
                    <th className="px-2.5 py-2 text-right font-medium">Steps</th>
                    <th className="px-2.5 py-2 font-medium">Requirements</th>
                    <th className="px-2.5 py-2 font-medium">Priority</th>
                    <th className="px-2.5 py-2 font-medium">Warnings</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.tests.map((t) => (
                    <tr key={t.row} className="border-t border-[var(--w-border)] align-top">
                      <td className="px-2.5 py-1.5 tabular text-[var(--w-text-3)]">{t.row}</td>
                      <td className="max-w-[260px] px-2.5 py-1.5"><span className="line-clamp-2">{t.input.title}</span></td>
                      <td className="px-2.5 py-1.5 text-right tabular">{t.input.steps?.length ?? 0}</td>
                      <td className="px-2.5 py-1.5 font-mono text-[11.5px]">{t.input.requirementKeys?.join(', ') || <span className="text-[var(--w-text-3)]">—</span>}</td>
                      <td className="px-2.5 py-1.5">{PRIORITIES.find((p) => p.value === (t.input.priority ?? 3))?.label}</td>
                      <td className="px-2.5 py-1.5 text-[var(--w-orange)]">{t.warnings.join(' ') || <span className="text-[var(--w-text-3)]">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-[12px] text-[var(--w-text-3)]">Requirements that cannot be found are skipped; the test is still created.</p>
        </div>
      )}

      {stage === 'done' && result && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[var(--w-green)]" /> <b className="tabular">{result.created.length}</b> created</span>
            <span className="inline-flex items-center gap-1.5"><XCircle size={14} className={result.failed.length ? 'text-[var(--w-red)]' : 'text-[var(--w-text-3)]'} /> <b className="tabular">{result.failed.length}</b> failed</span>
          </div>
          {result.created.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {result.created.slice(0, 60).map((n) => (
                <button key={n} type="button" onClick={() => { onClose(); onOpenTest(n); }} className="rounded-[4px] border border-[var(--w-border)] px-1.5 py-0.5 font-mono text-[11.5px] text-[var(--w-accent-text)] hover:bg-[var(--w-hover)]">
                  {config.key}-{n}
                </button>
              ))}
              {result.created.length > 60 && <span className="text-[12px] text-[var(--w-text-3)]">+{result.created.length - 60} more</span>}
            </div>
          )}
          {result.failed.length > 0 && (
            <div className="max-h-[40vh] overflow-auto rounded-[8px] border border-[var(--w-border)]">
              <table className="w-full min-w-[480px] border-collapse text-[12.5px]">
                <thead className="sticky top-0 bg-[var(--w-sunken)] text-left text-[11px] uppercase tracking-wide text-[var(--w-text-3)]">
                  <tr><th className="px-2.5 py-2 font-medium">Test #</th><th className="px-2.5 py-2 font-medium">Title</th><th className="px-2.5 py-2 font-medium">Error</th></tr>
                </thead>
                <tbody>
                  {result.failed.map((f) => (
                    <tr key={f.row} className="border-t border-[var(--w-border)] align-top">
                      <td className="px-2.5 py-1.5 tabular text-[var(--w-text-3)]">{f.row}{parsed?.tests[f.row - 1] ? ` (row ${parsed.tests[f.row - 1].row})` : ''}</td>
                      <td className="px-2.5 py-1.5">{f.title || '—'}</td>
                      <td className="px-2.5 py-1.5 text-[var(--w-red)]">{f.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}

function Notice({ kind, children }: { kind: 'error' | 'warn'; children: React.ReactNode }) {
  return (
    <div className={cn(
      'flex items-start gap-2 rounded-[6px] border px-2.5 py-1.5 text-[12.5px]',
      kind === 'error'
        ? 'border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-red)_8%,transparent)] text-[var(--w-red)]'
        : 'border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_8%,transparent)] text-[var(--w-text)]',
    )}>
      <AlertTriangle size={13} className={cn('mt-[2px] shrink-0', kind === 'warn' && 'text-[var(--w-orange)]')} />
      <span>{children}</span>
    </div>
  );
}
