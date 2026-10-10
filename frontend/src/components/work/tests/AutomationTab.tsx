'use client';

/**
 * CTW đợt 7c (TST-2) — Tests → Automation: kết quả test tự động từ CI.
 *   - KPI: số test tự động, tỉ lệ đạt lần chạy gần nhất, đang đỏ, flaky, độ phủ code (lcov/JaCoCo/Cobertura).
 *   - Cách nối CI: token scope "Upload test results" (tests:write) + bước `ctwork-report` cho GitHub Actions + lệnh curl.
 *   - Tải báo cáo lên tay (JUnit XML / Playwright JSON / Jest-Vitest JSON + tệp độ phủ).
 *   - Lịch sử các lần nhập + bảng test tự động (chuỗi xanh/đỏ gần nhất, flaky, bug đã mở).
 * Backend: POST /projects/:pid/tests/automation/import · GET /projects/:pid/test-automation (testAutomation.service.ts).
 */

import Link from 'next/link';
import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Copy, ExternalLink, RotateCcw, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { autoTestApi, c7cKeys, type ImportResult } from '@/lib/work-c7c-api';
import { EmptyState, PageLoading, publicOrigin, Spinner } from '../ui';
import KpiTile from '../KpiTile';
import { Badge, Card, Tbl, Td, Th } from '../quality/qui';
import { copyText } from '../settings/ProjectShare';
import { useWT, type WKey } from '../i18n';

const DOT: Record<string, string> = { P: 'var(--w-green)', R: 'var(--w-yellow)', F: 'var(--w-red)', S: 'var(--w-border-strong)' };

/** Chuỗi chấm lịch sử (mới nhất bên phải) — có nhãn chữ cho trình đọc màn hình. */
function History({ h, label }: { h: string; label: string }) {
  const last = h.slice(-20);
  return (
    <span className="inline-flex items-center gap-[2px]" role="img" aria-label={label} title={label}>
      {[...last].map((c, i) => <span key={i} className="inline-block h-[10px] w-[5px] rounded-[1px]" style={{ background: DOT[c] ?? DOT.S }} />)}
    </span>
  );
}

export function ciSnippets(origin: string, pid: number) {
  const url = `${origin}/api/v1/work/projects/${pid}/tests/automation/import`;
  const yaml = `# .github/workflows/test.yml — after your test step
      - name: ctwork-report
        if: always()            # send results even when tests fail
        env:
          CTWORK_TOKEN: \${{ secrets.CTWORK_TOKEN }}   # API token with the "Upload test results" scope
        run: |
          # One file per test class (Maven Surefire / Gradle) ⇒ send each into the SAME cycle (cycle=…).
          for f in target/surefire-reports/TEST-*.xml; do
            curl -sS --fail-with-body -X POST \\
              "${url}?format=junit&cycle=CI%20%23\${{ github.run_number }}&build=\${{ github.run_number }}&branch=\${{ github.ref_name }}&commit=\${{ github.sha }}&runUrl=\${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}" \\
              -H "Authorization: Bearer $CTWORK_TOKEN" \\
              -H "Content-Type: application/xml" \\
              --data-binary @"$f"
          done`;
  const curl = `# JUnit XML (Maven/Gradle/pytest), raw body:
curl -X POST "${url}?format=junit&build=42" \\
  -H "Authorization: Bearer ctw_…" -H "Content-Type: application/xml" \\
  --data-binary @report.xml

# Playwright / Jest / Vitest JSON + coverage (lcov, JaCoCo XML, Cobertura) in one call:
jq -n --rawfile r results.json --rawfile c coverage/lcov.info \\
  '{report: $r, format: "playwright", build: "42", coverage: {report: $c}}' \\
| curl -X POST "${url}" -H "Authorization: Bearer ctw_…" \\
    -H "Content-Type: application/json" --data-binary @-`;
  return { yaml, curl };
}

export default function AutomationTab({ config, pid, onOpenIssue }: { config: ProjectConfig; pid: number; onOpenIssue: (n: number) => void }) {
  const { t, fmtDateTime, fmtNumber } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: c7cKeys.automation(pid), queryFn: () => autoTestApi.overview(pid) });
  const [only, setOnly] = useState<'all' | 'flaky' | 'failing'>('all');
  const canEdit = config.permissions.editIssues;
  const reset = useMutation({
    mutationFn: (id: number) => autoTestApi.resetFlaky(pid, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: c7cKeys.automation(pid) }); toast.success(t('c7c.tFlakyCleared')); },
    onError: (e) => toast.error(workError(e)),
  });
  if (q.isLoading) return <PageLoading />;
  if (q.error || !q.data) return <EmptyState title={t('c7c.loadFailed')} body={workError(q.error)} />;
  const { imports, tests, summary } = q.data;
  const shown = tests.filter((x) => only === 'all' || (only === 'flaky' ? x.flaky : x.lastStatus === 'FAIL'));
  const base = `/work/${config.workspace.slug}/${config.key}`;
  const snip = ciSnippets(publicOrigin(), pid);

  return (
    <div className="flex flex-col gap-4 p-4" data-testid="c7c-automation-tab">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiTile label={t('c7c.tAutomated')} value={summary.automated} />
        <KpiTile label={t('c7c.tPassRate')} value={summary.lastPassRate === null ? '—' : `${summary.lastPassRate}%`} tone={summary.lastPassRate === null ? undefined : summary.lastPassRate >= 95 ? 'green' : summary.lastPassRate >= 80 ? 'yellow' : 'red'} />
        <KpiTile label={t('c7c.tFailing')} value={summary.failing} tone={summary.failing ? 'red' : undefined} />
        <KpiTile label={t('c7c.tFlaky')} value={summary.flaky} tone={summary.flaky ? 'orange' : undefined} title={t('c7c.tFlakyHint')} />
        <KpiTile label={t('c7c.tCoverage')} value={summary.coverage?.pct == null ? '—' : `${summary.coverage.pct}%`} hint={summary.coverage?.branchPct != null ? t('c7c.tBranch', { p: summary.coverage.branchPct }) : undefined} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card title={t('c7c.tConnectTitle')} desc={t('c7c.tConnectDesc')}>
          <ol className="mb-3 list-decimal space-y-1 pl-5 text-[13px] text-[var(--w-text-2)]">
            <li>{t('c7c.tStep1a')} <Link className="text-[var(--w-accent-text)] underline" href="/work/developer">{t('c7c.tStep1b')}</Link> {t('c7c.tStep1c')}</li>
            <li>{t('c7c.tStep2')}</li>
            <li>{t('c7c.tStep3')}</li>
          </ol>
          <Snippet label="GitHub Actions — ctwork-report" code={snip.yaml} />
          <Snippet label="curl" code={snip.curl} />
          <p className="mt-2 text-[12px] text-[var(--w-text-3)]">{t('c7c.tFormats')}</p>
        </Card>
        {canEdit && <UploadCard pid={pid} onDone={() => qc.invalidateQueries({ queryKey: c7cKeys.automation(pid) })} />}
      </div>

      {summary.coverage && summary.coverage.modules.length > 0 && (
        <Card title={t('c7c.tCovTitle', { f: summary.coverage.format ?? '' })} desc={t('c7c.tCovDesc', { d: fmtDateTime(summary.coverage.at) })}>
          <Tbl minWidth={420} maxHeight={260} label={t('c7c.tCovTitle', { f: '' })}>
            <thead><tr><Th>{t('c7c.tModule')}</Th><Th w={140}>{t('c7c.tLineCov')}</Th></tr></thead>
            <tbody>
              {summary.coverage.modules.map((m) => (
                <tr key={m.name}><Td className="font-mono text-[12px]">{m.name}</Td><Td><Badge tone={m.linePct === null ? 'muted' : m.linePct >= 80 ? 'green' : m.linePct >= 60 ? 'yellow' : 'red'}>{m.linePct === null ? '—' : `${m.linePct}%`}</Badge></Td></tr>
              ))}
            </tbody>
          </Tbl>
        </Card>
      )}

      <Card title={t('c7c.tRunsTitle')} desc={t('c7c.tRunsDesc')}>
        {!imports.length ? <EmptyState title={t('c7c.tNoRuns')} body={t('c7c.tNoRunsBody')} /> : (
          <Tbl minWidth={980} maxHeight={360} label={t('c7c.tRunsTitle')}>
            <thead>
              <tr>
                <Th w={150}>{t('c7c.tWhen')}</Th><Th>{t('c7c.tBuild')}</Th><Th w={100}>{t('c7c.tFormat')}</Th><Th w={160}>{t('c7c.tResult')}</Th>
                <Th w={80}>{t('c7c.tPassRate')}</Th><Th w={70}>{t('c7c.tFlaky')}</Th><Th w={90}>{t('c7c.tCoverage')}</Th><Th w={110}>{t('c7c.tBugs')}</Th><Th w={90}>{t('c7c.tCycle')}</Th>
              </tr>
            </thead>
            <tbody>
              {imports.map((i) => (
                <tr key={i.id}>
                  <Td className="whitespace-nowrap text-[12px]">{fmtDateTime(i.createdAt)}<div className="text-[11px] text-[var(--w-text-3)]">{i.viaToken ? t('c7c.tViaCi') : t('c7c.tViaUpload')}</div></Td>
                  <Td>
                    <span className="font-medium">{i.build ?? '—'}</span>
                    {i.branch && <span className="ml-1 text-[12px] text-[var(--w-text-3)]">{i.branch}</span>}
                    {i.commitSha && <span className="ml-1 font-mono text-[11.5px] text-[var(--w-text-3)]">{i.commitSha.slice(0, 7)}</span>}
                    {i.runUrl && <a href={i.runUrl} target="_blank" rel="noreferrer noopener" className="ml-1 inline-flex text-[var(--w-accent-text)]" aria-label={t('c7c.tOpenRun')}><ExternalLink size={12} /></a>}
                  </Td>
                  <Td>{i.format}</Td>
                  <Td className="whitespace-nowrap tabular-nums text-[12.5px]">
                    <span className="text-[var(--w-green-text)]">{i.passed}✓</span> · <span className={cn(i.failed && 'text-[var(--w-red-text)] font-medium')}>{i.failed}✗</span> · <span className="text-[var(--w-text-3)]">{i.skipped}↷</span>
                  </Td>
                  <Td className="tabular-nums">{i.passRate === null ? '—' : `${i.passRate}%`}</Td>
                  <Td className="tabular-nums">{i.flaky || '—'}</Td>
                  <Td className="tabular-nums">{i.coveragePct === null ? '—' : `${fmtNumber(i.coveragePct)}%`}</Td>
                  <Td className="text-[12px]">{i.newBugs ? t('c7c.tNewBugs', { count: i.newBugs }) : '—'}{i.linkedBugs ? <div className="text-[var(--w-text-3)]">{t('c7c.tLinkedBugs', { count: i.linkedBugs })}</div> : null}</Td>
                  <Td>{i.cycleId ? <Link className="text-[var(--w-accent-text)] hover:underline" href={`${base}/tests/cycles/${i.cycleId}`}>{t('c7c.tOpen')}</Link> : '—'}</Td>
                </tr>
              ))}
            </tbody>
          </Tbl>
        )}
      </Card>

      <Card
        title={t('c7c.tTestsTitle')}
        desc={t('c7c.tTestsDesc')}
        actions={(
          <div className="flex gap-1" role="radiogroup" aria-label={t('c7c.tFilter')}>
            {(['all', 'failing', 'flaky'] as const).map((f) => (
              <button key={f} type="button" role="radio" aria-checked={only === f} className={cn('w-btn w-btn-sm', only === f && 'w-btn-primary')} onClick={() => setOnly(f)}>{t(`c7c.tOnly_${f}` as WKey)}</button>
            ))}
          </div>
        )}
      >
        {!shown.length ? <p className="py-6 text-center text-[13px] text-[var(--w-text-3)]">{t('c7c.tNoTests')}</p> : (
          <Tbl minWidth={900} maxHeight={520} label={t('c7c.tTestsTitle')}>
            <thead>
              <tr><Th>{t('c7c.tTest')}</Th><Th w={160}>{t('c7c.tHistory')}</Th><Th w={80}>{t('c7c.tLast')}</Th><Th w={110}>{t('c7c.tFlaky')}</Th><Th w={170}>{t('c7c.tBug')}</Th><Th w={110} /></tr>
            </thead>
            <tbody>
              {shown.map((x) => (
                <tr key={x.id}>
                  <Td>
                    {x.testNumber ? <button type="button" className="text-left font-medium hover:underline" onClick={() => onOpenIssue(x.testNumber!)}>{x.name}</button> : <span className="font-medium">{x.name}</span>}
                    <div className="truncate text-[11.5px] text-[var(--w-text-3)]">{x.suite ?? x.file ?? ''}</div>
                  </Td>
                  <Td><History h={x.history} label={t('c7c.tHistoryAria', { h: x.history.slice(-20) || '—' })} /></Td>
                  <Td>{x.lastStatus ? <Badge tone={x.lastStatus === 'PASS' ? 'green' : x.lastStatus === 'FAIL' ? 'red' : 'muted'}>{x.lastStatus}</Badge> : '—'}</Td>
                  <Td>{x.flaky ? <Badge tone="orange" title={t('c7c.tFlakyHint')}>{t('c7c.tFlakyScore', { s: x.flakyScore })}</Badge> : <span className="text-[var(--w-text-3)]">—</span>}</Td>
                  <Td className="text-[12.5px]">{x.bug ? <button type="button" className={cn('hover:underline', !x.bug.open && 'line-through text-[var(--w-text-3)]')} onClick={() => onOpenIssue(x.bug!.number)} title={x.bug.title}>{config.key}-{x.bug.number}</button> : '—'}</Td>
                  <Td>{canEdit && x.flaky && <button type="button" className="w-btn w-btn-sm" disabled={reset.isPending} onClick={() => reset.mutate(x.id)}><RotateCcw size={12} /> {t('c7c.tClearFlaky')}</button>}</Td>
                </tr>
              ))}
            </tbody>
          </Tbl>
        )}
      </Card>
    </div>
  );
}

function Snippet({ label, code }: { label: string; code: string }) {
  const { t } = useWT();
  return (
    <div className="mb-2">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[12px] font-medium text-[var(--w-text-2)]">{label}</span>
        <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => copyText(code, label)}><Copy size={12} /> {t('common.copy')}</button>
      </div>
      <pre tabIndex={0} aria-label={label} className="max-h-[240px] overflow-auto rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] p-2.5 font-mono text-[11.5px] leading-relaxed"><code>{code}</code></pre>
    </div>
  );
}

function UploadCard({ pid, onDone }: { pid: number; onDone: () => void }) {
  const { t } = useWT();
  const rep = useRef<HTMLInputElement>(null);
  const cov = useRef<HTMLInputElement>(null);
  const [build, setBuild] = useState('');
  const [bugs, setBugs] = useState(true);
  const [res, setRes] = useState<ImportResult | null>(null);
  const up = useMutation({
    mutationFn: async () => {
      const f = rep.current?.files?.[0];
      if (!f) throw new Error(t('c7c.tPickFile'));
      if (f.size > 10 * 1024 * 1024) throw new Error(t('c7c.tTooBig'));
      const c = cov.current?.files?.[0];
      return autoTestApi.upload(pid, { report: await f.text(), build: build.trim() || undefined, createBugs: bugs, coverage: c ? { report: await c.text() } : null });
    },
    onSuccess: (r) => { setRes(r); onDone(); toast.success(t('c7c.tUploaded', { p: r.passed, f: r.failed })); },
    onError: (e) => toast.error(e instanceof Error && !('response' in e) ? e.message : workError(e)),
  });
  return (
    <Card title={t('c7c.tUploadTitle')} desc={t('c7c.tUploadDesc')}>
      <form className="flex flex-col gap-2.5 text-[13px]" onSubmit={(e) => { e.preventDefault(); up.mutate(); }}>
        <label className="flex flex-col gap-1"><span className="text-[12px] font-medium text-[var(--w-text-2)]">{t('c7c.tReportFile')}</span><input ref={rep} type="file" accept=".xml,.json,application/xml,application/json" className="text-[12.5px]" /></label>
        <label className="flex flex-col gap-1"><span className="text-[12px] font-medium text-[var(--w-text-2)]">{t('c7c.tCoverageFile')}</span><input ref={cov} type="file" accept=".info,.xml,.json" className="text-[12.5px]" /></label>
        <label className="flex flex-col gap-1"><span className="text-[12px] font-medium text-[var(--w-text-2)]">{t('c7c.tBuild')}</span><input className="w-input" maxLength={80} value={build} onChange={(e) => setBuild(e.target.value)} placeholder="v1.2.0 / #42" /></label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={bugs} onChange={(e) => setBugs(e.target.checked)} /> {t('c7c.tCreateBugs')}</label>
        <button type="submit" className="w-btn w-btn-primary self-start" disabled={up.isPending}>{up.isPending ? <Spinner size={12} /> : <Upload size={13} />} {t('c7c.tUpload')}</button>
      </form>
      {res && (
        <p className="mt-3 rounded-[6px] bg-[var(--w-sunken)] px-2.5 py-2 text-[12.5px] text-[var(--w-text-2)]" role="status">
          {t('c7c.tResultLine', { total: res.total, p: res.passed, f: res.failed, s: res.skipped, nc: res.newTestCases, nb: res.newBugs, lb: res.linkedBugs })}
          {res.coverage?.linePct != null && ` · ${t('c7c.tCoverage')} ${res.coverage.linePct}%`}
        </p>
      )}
    </Card>
  );
}
