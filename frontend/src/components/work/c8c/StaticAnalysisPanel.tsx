'use client';

/**
 * CTW đợt 8c — Tests → Automation: PHÂN TÍCH TĨNH (SARIF) + ĐỘ PHỨC TẠP V(G) (T3/T4).
 * Backend: POST /projects/:pid/tests/automation/static (token tests:write) · GET /projects/:pid/static-analysis.
 * Phát hiện mặc định là ĐỀ XUẤT: người bấm "Create bug" (hoặc CI gửi createIssues=true cho lỗi mới mức error).
 */

import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Bug, Calculator, Copy, EyeOff, RotateCcw, Upload } from 'lucide-react';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { c8cKeys, staticApi, type Risk, type StaticFinding } from '@/lib/work-c8c-api';
import { EmptyState, PageLoading, publicOrigin, Spinner } from '../ui';
import KpiTile from '../KpiTile';
import { Badge, Card, Tbl, Td, Th, type Tone } from '../quality/qui';
import { copyText } from '../settings/ProjectShare';
import { useWT } from '../i18n';

const LEVEL_TONE: Record<string, Tone> = { error: 'red', warning: 'orange', note: 'muted' };
const RISK_TONE: Record<Risk, Tone> = { LOW: 'green', MODERATE: 'yellow', HIGH: 'orange', VERY_HIGH: 'red' };

export function staticSnippet(origin: string, pid: number) {
  const url = `${origin}/api/v1/work/projects/${pid}/tests/automation/static`;
  return `# SARIF from ESLint / Semgrep / CodeQL / SpotBugs / PMD / SonarQube (raw body):
curl -X POST "${url}?build=42" \\
  -H "Authorization: Bearer $CTWORK_TOKEN" -H "Content-Type: application/json" \\
  --data-binary @results.sarif

# Cyclomatic complexity V(G): JaCoCo XML or "lizard --csv":
curl -X POST "${url}?kind=jacoco" -H "Authorization: Bearer $CTWORK_TOKEN" \\
  -H "Content-Type: application/xml" --data-binary @target/site/jacoco/jacoco.xml

# Merge several CI jobs into one test cycle and close it when the last job reports:
#   …/tests/automation/import?cycle=CI%20%2342&jobs=3        (closes after 3 uploads)
#   …/tests/automation/import?cycle=CI%20%2342&close=true    (closes now)
#   otherwise it closes by itself after 120 idle minutes (closeAfterMin=…)`;
}

export default function StaticAnalysisPanel({ config, pid, onOpenIssue }: { config: ProjectConfig; pid: number; onOpenIssue: (n: number) => void }) {
  const { t, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const [status, setStatus] = useState<'OPEN' | 'FIXED' | 'IGNORED' | 'ISSUE' | 'ALL'>('OPEN');
  const q = useQuery({ queryKey: c8cKeys.staticAnalysis(pid, status), queryFn: () => staticApi.overview(pid, status) });
  const canEdit = config.permissions.editIssues;
  const refresh = () => qc.invalidateQueries({ queryKey: ['work', 'c8c', pid, 'static'] });
  const act = useMutation({
    mutationFn: ({ f, a }: { f: StaticFinding; a: 'ignore' | 'reopen' | 'issue' }) => staticApi.act(pid, f.id, a),
    onSuccess: (r, v) => { refresh(); if (v.a === 'issue' && r.key) toast.success(t('c8c.saBugMade', { key: r.key })); },
    onError: (e) => toast.error(workError(e)),
  });
  const snippet = staticSnippet(publicOrigin(), pid);
  if (q.isLoading) return <PageLoading rows={3} />;
  if (q.error || !q.data) return <EmptyState title={t('c8c.loadFailed')} body={workError(q.error)} />;
  const { summary, findings, complexity, imports } = q.data;
  return (
    <div className="flex flex-col gap-4" data-testid="c8c-static">
      <Card title={t('c8c.saTitle')} desc={t('c8c.saDesc')}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <KpiTile label={t('c8c.saOpenErrors')} value={summary.openErrors} tone={summary.openErrors ? 'red' : undefined} />
          <KpiTile label={t('c8c.saOpenWarnings')} value={summary.openWarnings} />
          <KpiTile label={t('c8c.saFixed')} value={summary.fixed} />
          <KpiTile label={t('c8c.saAsBugs')} value={summary.asIssues} hint={summary.lastImportAt ? t('c8c.saLast', { d: fmtDateTime(summary.lastImportAt) }) : t('c8c.saNever')} />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {canEdit && <UploadStatic pid={pid} onDone={refresh} />}
        <Card title={t('c8c.saCiTitle')} desc={t('c8c.saCiDesc')} actions={<button type="button" className="w-btn w-btn-sm" onClick={() => copyText(snippet)}><Copy size={12} /> {t('c8c.copy')}</button>}>
          <pre tabIndex={0} aria-label={t('c8c.saCiTitle')} className="max-h-[220px] overflow-auto rounded-[6px] bg-[var(--w-sunken)] p-2.5 text-[11.5px] leading-[1.5]"><code>{snippet}</code></pre>
        </Card>
      </div>

      <Card
        title={t('c8c.saFindings')}
        actions={(
          <div className="inline-flex rounded-[7px] border border-[var(--w-border-strong)] p-0.5" role="tablist" aria-label={t('c8c.saFindings')}>
            {(['OPEN', 'ISSUE', 'FIXED', 'IGNORED', 'ALL'] as const).map((s) => (
              <button key={s} type="button" role="tab" aria-selected={status === s} onClick={() => setStatus(s)} className={`h-6 rounded-[5px] px-2 text-[12px] ${status === s ? 'bg-[var(--w-active)] font-medium' : 'text-[var(--w-text-2)]'}`}>{t(`c8c.saSt_${s}` as never)}</button>
            ))}
          </div>
        )}
      >
        {!findings.length ? <p className="text-[13px] text-[var(--w-text-3)]">{t('c8c.saNone')}</p> : (
          <Tbl minWidth={760} maxHeight={420} label={t('c8c.saFindings')}>
            <thead><tr><Th w={70}>{t('c8c.saLevel')}</Th><Th w={140}>{t('c8c.saRule')}</Th><Th>{t('c8c.saMessage')}</Th><Th w={200}>{t('c8c.saWhere')}</Th><Th w={60}>{t('c8c.saSeen')}</Th><Th w={170} /></tr></thead>
            <tbody>
              {findings.map((f) => (
                <tr key={f.id} className={f.status === 'FIXED' || f.status === 'IGNORED' ? 'opacity-60' : undefined}>
                  <Td><Badge tone={LEVEL_TONE[f.level]}>{f.level}</Badge></Td>
                  <Td className="text-[12px]"><span className="block truncate font-mono" title={`${f.tool} · ${f.ruleId}`}>{f.helpUri ? <a href={f.helpUri} target="_blank" rel="noreferrer noopener" className="hover:underline">{f.ruleId}</a> : f.ruleId}</span><span className="text-[11px] text-[var(--w-text-3)]">{f.tool}</span></Td>
                  <Td className="text-[12.5px] [overflow-wrap:anywhere]">{f.message}</Td>
                  <Td className="font-mono text-[11.5px] [overflow-wrap:anywhere]">{f.file ?? '—'}{f.line ? `:${f.line}` : ''}</Td>
                  <Td className="tabular-nums">{f.seenCount}</Td>
                  <Td>
                    <div className="flex flex-wrap justify-end gap-1">
                      {f.issue ? <button type="button" className="w-btn w-btn-sm" onClick={() => onOpenIssue(f.issue!.number)}>{f.issue.key}</button> : canEdit && f.status === 'OPEN' && (
                        <button type="button" className="w-btn w-btn-sm" disabled={act.isPending} onClick={() => act.mutate({ f, a: 'issue' })}><Bug size={12} /> {t('c8c.saMakeBug')}</button>
                      )}
                      {canEdit && f.status === 'OPEN' && <button type="button" className="w-btn w-btn-ghost w-btn-sm" disabled={act.isPending} onClick={() => act.mutate({ f, a: 'ignore' })} aria-label={t('c8c.saIgnore')} title={t('c8c.saIgnore')}><EyeOff size={12} /></button>}
                      {canEdit && f.status === 'IGNORED' && <button type="button" className="w-btn w-btn-ghost w-btn-sm" disabled={act.isPending} onClick={() => act.mutate({ f, a: 'reopen' })}><RotateCcw size={12} /> {t('c8c.saReopen')}</button>}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Tbl>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card title={t('c8c.vgTitle')} desc={t('c8c.vgDesc')}>
          <div className="mb-3 flex flex-wrap gap-2 text-[12.5px]">
            <Badge>{t('c8c.vgUnits', { n: complexity.summary.units })}</Badge>
            <Badge>{t('c8c.vgAvg', { v: complexity.summary.average ?? '—' })}</Badge>
            <Badge tone={complexity.summary.over10 ? 'orange' : 'green'}>{t('c8c.vgOver10', { n: complexity.summary.over10 })}</Badge>
            <Badge tone="blue">{t('c8c.vgPaths', { n: complexity.summary.basisPaths })}</Badge>
          </div>
          {!complexity.units.length ? <p className="text-[13px] text-[var(--w-text-3)]">{t('c8c.vgNone')}</p> : (
            <Tbl minWidth={560} maxHeight={360} label={t('c8c.vgTitle')}>
              <thead><tr><Th>{t('c8c.vgFn')}</Th><Th w={220}>{t('c8c.saWhere')}</Th><Th w={60}>V(G)</Th><Th w={110}>{t('c8c.vgRisk')}</Th><Th w={80}>{t('c8c.vgSource')}</Th></tr></thead>
              <tbody>
                {complexity.units.map((u) => (
                  <tr key={u.id}>
                    <Td className="font-mono text-[12px] [overflow-wrap:anywhere]">{u.name}</Td>
                    <Td className="font-mono text-[11.5px] [overflow-wrap:anywhere]">{u.file ?? '—'}{u.line ? `:${u.line}` : ''}</Td>
                    <Td className="tabular-nums font-semibold">{u.vg}</Td>
                    <Td><Badge tone={RISK_TONE[u.risk]}>{t(`c8c.risk_${u.risk}` as never)}</Badge></Td>
                    <Td className="text-[11.5px] text-[var(--w-text-3)]">{u.source}</Td>
                  </tr>
                ))}
              </tbody>
            </Tbl>
          )}
        </Card>
        <VgCalculator pid={pid} />
      </div>

      {!!imports.length && (
        <Card title={t('c8c.saImports')}>
          <ul className="space-y-1 text-[12.5px]">
            {imports.map((i) => (
              <li key={i.id} className="flex flex-wrap gap-x-3 text-[var(--w-text-2)]">
                <span className="tabular-nums text-[var(--w-text-3)]">{fmtDateTime(i.createdAt)}</span>
                <span className="font-medium text-[var(--w-text)]">{i.kind}{i.tools ? ` · ${i.tools}` : ''}</span>
                {i.build && <span>#{i.build}</span>}
                <span>{i.kind === 'SARIF' ? t('c8c.saImportLine', { total: i.total, n: i.newCount, f: i.fixedCount, b: i.issuesMade }) : t('c8c.vgUnits', { n: i.units })}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function UploadStatic({ pid, onDone }: { pid: number; onDone: () => void }) {
  const { t } = useWT();
  const ref = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<'auto' | 'sarif' | 'jacoco' | 'lizard'>('auto');
  const [bugs, setBugs] = useState(false);
  const up = useMutation({
    mutationFn: async () => {
      const f = ref.current?.files?.[0];
      if (!f) throw new Error(t('c8c.saPickFile'));
      if (f.size > 10 * 1024 * 1024) throw new Error(t('c8c.saTooBig'));
      return staticApi.importReport(pid, await f.text(), kind, bugs);
    },
    onSuccess: (r) => { onDone(); toast.success(t('c8c.saUploaded', { total: r.findings, n: r.newFindings, f: r.fixed, u: r.complexityUnits })); },
    onError: (e) => toast.error(e instanceof Error && !('response' in e) ? e.message : workError(e)),
  });
  return (
    <Card title={t('c8c.saUploadTitle')} desc={t('c8c.saUploadDesc')}>
      <form className="flex flex-col gap-2.5 text-[13px]" onSubmit={(e) => { e.preventDefault(); up.mutate(); }}>
        <label className="flex flex-col gap-1"><span className="text-[12px] font-medium text-[var(--w-text-2)]">{t('c8c.saFile')}</span><input ref={ref} type="file" accept=".sarif,.json,.xml,.csv" className="text-[12.5px]" /></label>
        <label className="flex flex-col gap-1"><span className="text-[12px] font-medium text-[var(--w-text-2)]">{t('c8c.saKind')}</span>
          <select className="w-input" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
            <option value="auto">{t('c8c.saKindAuto')}</option><option value="sarif">SARIF</option><option value="jacoco">JaCoCo XML (V(G))</option><option value="lizard">lizard CSV (V(G))</option>
          </select>
        </label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={bugs} onChange={(e) => setBugs(e.target.checked)} /> {t('c8c.saCreateBugs')}</label>
        <button type="submit" className="w-btn w-btn-primary self-start" disabled={up.isPending}>{up.isPending ? <Spinner size={12} /> : <Upload size={13} />} {t('c8c.saUpload')}</button>
      </form>
    </Card>
  );
}

function VgCalculator({ pid }: { pid: number }) {
  const { t } = useWT();
  const [e, setE] = useState('');
  const [n, setN] = useState('');
  const [p, setP] = useState('1');
  const [dec, setDec] = useState('');
  const calc = useMutation({
    mutationFn: () => staticApi.vg(pid, e && n ? { edges: Number(e), nodes: Number(n), components: Number(p) || 1 } : { decisions: Number(dec) || 0 }),
    onError: (err) => toast.error(workError(err)),
  });
  const num = (v: string, set: (x: string) => void, label: string) => (
    <label className="flex flex-col gap-1"><span className="text-[12px] text-[var(--w-text-2)]">{label}</span><input className="w-input" inputMode="numeric" value={v} onChange={(ev) => set(ev.target.value.replace(/\D/g, '').slice(0, 6))} /></label>
  );
  return (
    <Card title={t('c8c.calcTitle')} desc={t('c8c.calcDesc')}>
      <form className="flex flex-col gap-2 text-[13px]" onSubmit={(ev) => { ev.preventDefault(); calc.mutate(); }}>
        <div className="grid grid-cols-3 gap-2">{num(e, setE, t('c8c.calcEdges'))}{num(n, setN, t('c8c.calcNodes'))}{num(p, setP, t('c8c.calcParts'))}</div>
        <p className="text-[12px] text-[var(--w-text-3)]">{t('c8c.calcOr')}</p>
        {num(dec, setDec, t('c8c.calcDecisions'))}
        <button type="submit" className="w-btn self-start" disabled={calc.isPending}><Calculator size={13} /> {t('c8c.calcGo')}</button>
      </form>
      {calc.data && (
        <p className="mt-3 rounded-[6px] bg-[var(--w-sunken)] px-2.5 py-2 text-[13px]" role="status">
          {t('c8c.calcResult', { v: calc.data.vg })} · <Badge tone={RISK_TONE[calc.data.risk]}>{t(`c8c.risk_${calc.data.risk}` as never)}</Badge>
        </p>
      )}
    </Card>
  );
}
