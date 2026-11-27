'use client';

/**
 * dm5 G3 (27/11/2026) — Report 5.1:
 *   - UnitAutomationButton: dán/mở JUnit XML (Surefire) + JaCoCo XML + SHA ⇒ xem trước (dryRun) ⇒ ghi P/F vào đúng UTCID,
 *     dòng "Automation:" vào Notes của Statistics. Hiện test không khớp + UTCID chưa có test.
 *   - UnitLintButton: soát ma trận 5.1 (thiếu ca A/B, UTCID không đánh dấu, trùng, tiền điều kiện lẫn vào Condition).
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FlaskConical, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { g3Api, type AutomationImport } from '@/lib/work-g3-api';
import { Dialog, PageLoading } from '../../ui';
import { wt, type WKey } from '@/components/work/i18n';
import { fptKeys } from './fptApi';

function FileText({ label, value, onChange, testId }: { label: string; value: string; onChange: (v: string) => void; testId?: string }) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="flex items-center justify-between gap-2 text-[12px] font-medium text-[var(--w-text-2)]">
        {label}
        <span className="relative inline-flex">
          <span className="w-btn w-btn-sm pointer-events-none">{wt('fpt.autoFile')}</span>
          <input type="file" accept=".xml,.json,.info,text/xml,application/json" className="absolute inset-0 cursor-pointer opacity-0" aria-label={`${label} — ${wt('fpt.autoFile')}`}
            onChange={async (e) => { const f = e.target.files?.[0]; if (f) onChange(await f.text()); e.target.value = ''; }} />
        </span>
      </span>
      <textarea className="w-input min-h-[96px] font-mono text-[11.5px]" value={value} onChange={(e) => onChange(e.target.value)} spellCheck={false} data-testid={testId} />
    </label>
  );
}

export function UnitAutomationButton({ pid }: { pid: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="w-btn w-btn-sm" onClick={() => setOpen(true)} data-testid="g3-unit-automation"><FlaskConical size={13} /> <span className="hidden sm:inline">{wt('fpt.autoImport')}</span></button>
      {open && <AutomationDialog pid={pid} onClose={() => setOpen(false)} />}
    </>
  );
}

function AutomationDialog({ pid, onClose }: { pid: number; onClose: () => void }) {
  const qc = useQueryClient();
  const [report, setReport] = useState('');
  const [coverage, setCoverage] = useState('');
  const [sha, setSha] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [result, setResult] = useState<AutomationImport | null>(null);
  const run = useMutation({
    mutationFn: (dryRun: boolean) => g3Api.automationImport(pid, { report, coverage: coverage.trim() || null, commitSha: sha.trim() || null, executedAt: date || null, dryRun }),
    onSuccess: (r) => {
      setResult(r);
      if (!r.dryRun) {
        toast.success(wt('fpt.autoWritten', { m: r.matched }));
        qc.invalidateQueries({ queryKey: fptKeys.all(pid) });
      }
    },
    onError: (e) => toast.error(workError(e)),
  });
  return (
    <Dialog open onClose={onClose} title={wt('fpt.autoImportTitle')} width={760}
      footer={<>
        <button type="button" className="w-btn w-btn-sm" onClick={onClose}>{wt('common.cancel')}</button>
        <button type="button" className="w-btn w-btn-sm" disabled={!report.trim() || run.isPending} onClick={() => run.mutate(true)} data-testid="g3-auto-preview">{wt('fpt.autoPreview')}</button>
        <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!report.trim() || run.isPending || !result?.matched} onClick={() => run.mutate(false)} data-testid="g3-auto-apply">{wt('fpt.autoApply')}</button>
      </>}>
      <p className="mb-3 text-[12.5px] leading-relaxed text-[var(--w-text-2)]">{wt('fpt.autoImportDesc')}</p>
      <div className="grid grid-cols-1 gap-3">
        <FileText label={wt('fpt.autoReport')} value={report} onChange={(v) => { setReport(v); setResult(null); }} testId="g3-auto-report" />
        <FileText label={wt('fpt.autoCoverage')} value={coverage} onChange={(v) => { setCoverage(v); setResult(null); }} />
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1"><span className="text-[12px] font-medium text-[var(--w-text-2)]">{wt('fpt.autoSha')}</span>
            <input className="w-input font-mono" value={sha} onChange={(e) => setSha(e.target.value)} placeholder="a1b2c3d" maxLength={64} /></label>
          <label className="flex flex-col gap-1"><span className="text-[12px] font-medium text-[var(--w-text-2)]">{wt('fpt.autoDate')}</span>
            <input className="w-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
        </div>
      </div>
      {result && (
        <div className="mt-3 rounded-[6px] border border-[var(--w-border)] p-3 text-[12.5px]" role="status" data-testid="g3-auto-result">
          <div className="font-medium">{wt('fpt.autoSummary', { m: result.matched, t: result.tests - result.skipped, p: result.passed, f: result.failed, s: result.skipped })}</div>
          <div className="mt-1 font-mono text-[11.5px] text-[var(--w-text-2)]">{result.note}</div>
          {!!result.unmatched.length && (
            <details className="mt-2" open={result.unmatched.length <= 8}>
              <summary className="cursor-pointer text-[var(--w-yellow-text)]">{wt('fpt.autoUnmatched')} ({result.unmatched.length})</summary>
              <ul className="mt-1 max-h-[160px] list-disc overflow-auto pl-5">
                {result.unmatched.map((u, i) => <li key={i}><span className="font-mono">{u.test}</span> — {wt(`fpt.ur_${u.reason}` as WKey)}</li>)}
              </ul>
            </details>
          )}
          {!!result.missing.length && (
            <details className="mt-2">
              <summary className="cursor-pointer text-[var(--w-text-2)]">{wt('fpt.autoMissing')} ({result.missing.length})</summary>
              <ul className="mt-1 max-h-[160px] list-disc overflow-auto pl-5">{result.missing.map((m, i) => <li key={i}>{m.function} · {m.utcid}</li>)}</ul>
            </details>
          )}
        </div>
      )}
    </Dialog>
  );
}

export function UnitLintButton({ pid }: { pid: number }) {
  const [open, setOpen] = useState(false);
  const q = useQuery({ queryKey: [...fptKeys.unit(pid), 'lint'], queryFn: () => g3Api.unitLint(pid), enabled: open });
  return (
    <>
      <button type="button" className="w-btn w-btn-sm" onClick={() => setOpen(true)} data-testid="g3-unit-lint"><ListChecks size={13} /> <span className="hidden sm:inline">{wt('fpt.lintTitle')}</span></button>
      {open && (
        <Dialog open onClose={() => setOpen(false)} title={wt('fpt.lintTitle')} width={680}>
          {q.isLoading || !q.data ? <PageLoading rows={3} /> : !q.data.issues.length ? (
            <p className="text-[12.5px] text-[var(--w-green-text)]">{wt('fpt.lintClean', { n: q.data.functions })}</p>
          ) : (
            <ul className="flex flex-col gap-1 text-[12.5px]" data-testid="g3-unit-lint-list">
              {q.data.issues.map((x, i) => (
                <li key={i} className="rounded-[4px] bg-[var(--w-hover)] px-2 py-1">
                  <span className="font-medium">{x.function}</span> — {wt(`fpt.lint_${x.code}` as WKey, { u: (x.utcids ?? []).join(', '), d: x.detail ?? '' })}
                </li>
              ))}
            </ul>
          )}
        </Dialog>
      )}
    </>
  );
}
