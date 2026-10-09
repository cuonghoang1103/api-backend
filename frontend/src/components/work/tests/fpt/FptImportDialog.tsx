'use client';

/**
 * Nhập Report 5.1 / 5.2 / 5.3 từ tệp Excel đúng mẫu FPT (nhóm đang làm bằng Excel/Google Sheets chuyển lên CT Work).
 * Bước 1 chạy thử (dryRun) ⇒ xem số hàm/module, test case, cảnh báo; bước 2 nhập thật (Thêm vào | Thay toàn bộ).
 */

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, FileUp } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Dialog, Spinner } from '../../ui';
import { fptApi, fptKeys, type ImportResult, type ReportKind } from './fptApi';
import { wt } from '@/components/work/i18n';

const NAME: Record<ReportKind, string> = { unit: 'Unit (5.1)', integration: 'Integration (5.2)', system: 'System (5.3)' };
const ITEM: Record<ReportKind, string> = { get unit() { return wt('fpt.itFunctions'); }, integration: 'module', system: 'workflow' };

export default function FptImportDialog({ open, onClose, pid, report }: { open: boolean; onClose: () => void; pid: number; report: ReportKind }) {
  const qc = useQueryClient();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string; buf: ArrayBuffer } | null>(null);
  const [preview, setPreview] = useState<ImportResult | null>(null);
  const [mode, setMode] = useState<'append' | 'replace'>('append');
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (open) { setFile(null); setPreview(null); setMode('append'); } }, [open]);

  const pick = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { toast.error(wt('fpt.over10')); return; }
    // Đọc NGAY (FileList sống — đặt lại input là mất tệp).
    const buf = await f.arrayBuffer();
    setFile({ name: f.name, buf });
    setBusy(true);
    try {
      setPreview(await fptApi.importXlsx(pid, buf, { report, mode: 'append', dryRun: true }));
    } catch (e) {
      setPreview(null);
      toast.error(workError(e, wt('fpt.readFileFailed')));
    } finally {
      setBusy(false);
    }
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const r = await fptApi.importXlsx(pid, file.buf, { report, mode, dryRun: false });
      await qc.invalidateQueries({ queryKey: fptKeys.all(pid) });
      toast.success(wt('fpt.importedN', { n: r.functions ?? r.modules ?? 0, item: ITEM[report], cases: r.cases }));
      onClose();
    } catch (e) {
      toast.error(workError(e, wt('tests.importFailed')));
    } finally {
      setBusy(false);
    }
  };

  const wrongKind = preview && preview.report !== report;
  return (
    <Dialog
      open={open}
      onClose={() => !busy && onClose()}
      title={wt('fpt.importFrom', { r: report === 'unit' ? 'Unit Test Report (5.1)' : report === 'system' ? 'System Test Report (5.3)' : 'Integration Test Report (5.2)' })}
      width={640}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose} disabled={busy}>{wt('common.cancel')}</button>
          <button type="button" className="w-btn w-btn-primary" onClick={run} disabled={busy || !preview || !!wrongKind}>{busy && file && preview && <Spinner size={12} />} {wt('common.import')}</button>
        </>
      }
    >
      <p className="mb-3 text-[13px] text-[var(--w-text-2)]">
        {wt('fpt.useTemplate')} ({report === 'unit' ? 'Guideline / Cover / Functions / Statistics + one sheet per function' : report === 'system' ? 'Cover / Test Cases / Test Statistics + one sheet per workflow, Round 1–3' : 'Cover / Test Cases / Test Statistics + one sheet per module'}).
        {wt('fpt.matchedByName')}
      </p>
      <input ref={input} type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="hidden"
        onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ''; }} />
      <button type="button" className="w-btn" onClick={() => input.current?.click()} disabled={busy}>
        {busy && !preview ? <Spinner size={12} /> : <FileUp size={14} />} {file ? wt('fpt.chooseAnother') : wt('fpt.chooseXlsx')}
      </button>
      {file && <span className="ml-2 text-[12.5px] text-[var(--w-text-2)]">{file.name}</span>}

      {preview && (
        <div className="mt-4 space-y-3 text-[13px]">
          {wrongKind && (
            <p className="rounded-[6px] bg-[color-mix(in_srgb,var(--w-red)_10%,transparent)] px-3 py-2 text-[var(--w-red)]">
              {wt('fpt.wrongKind', { r: NAME[preview.report] })}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            <span><b>{preview.functions ?? preview.modules}</b> {ITEM[preview.report]}</span>
            <span><b>{preview.cases}</b> test case</span>
            <span><b>{preview.changes}</b> {wt('fpt.changeRecords')}</span>
          </div>
          <div className="max-h-[200px] overflow-y-auto rounded-[6px] border border-[var(--w-border)]">
            {preview.preview.map((p, i) => (
              <div key={i} className="flex justify-between border-b border-[var(--w-border)] px-3 py-1 last:border-0">
                <span className="truncate">{p.module ? <span className="text-[var(--w-text-3)]">{p.module} · </span> : null}{p.name}</span>
                <span className="shrink-0 tabular-nums text-[var(--w-text-2)]">{p.cases} case</span>
              </div>
            ))}
          </div>
          {preview.warnings.length > 0 && (
            <ul className="space-y-1 text-[12.5px] text-[var(--w-yellow)]">
              {preview.warnings.map((w, i) => <li key={i} className="flex gap-1.5"><AlertTriangle size={13} className="mt-0.5 shrink-0" /> {w}</li>)}
            </ul>
          )}
          <div role="radiogroup" aria-label={wt('fpt.importMode')} className="space-y-1.5">
            {([['append', wt('fpt.append')], ['replace', wt('fpt.replaceAll', { r: report === 'unit' ? 'unit test' : report === 'system' ? 'system test' : 'integration test' })]] as const).map(([v, l]) => (
              <label key={v} className={cn('flex cursor-pointer items-center gap-2', v === 'replace' && mode === 'replace' && 'text-[var(--w-red)]')}>
                <input type="radio" name="fpt-mode" checked={mode === v} onChange={() => setMode(v)} /> {l}
              </label>
            ))}
          </div>
        </div>
      )}
    </Dialog>
  );
}
