'use client';

/**
 * /work/<slug>/<KEY>/portal/uat/<id> — BIÊN BẢN NGHIỆM THU (UAT acceptance
 * certificate) in được. Theo mẫu content/quy-trinh/mau/bien-ban-nghiem-thu-uat.md
 * (Phần B), bản tiếng Anh. Không thêm thư viện PDF: trang in được + window.print()
 * (trình duyệt "Save as PDF"); work.css @media print chỉ in khối `.w-cert`.
 * Giấy luôn nền trắng chữ đen (kể cả theme tối) — đây là văn bản để ký/lưu.
 */

import Link from 'next/link';
import { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Printer } from 'lucide-react';
import { workError, workPortalApi, type PortalCertificate } from '@/lib/work-api';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { wfmt, wt } from '@/components/work/i18n';

const fmt = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleString(wfmt.intl(), { dateStyle: 'long', timeStyle: 'short' }) : '—');
const box = (on: boolean) => (on ? '☑' : '☐');

function Certificate({ c }: { c: PortalCertificate }) {
  const day = c.decidedAt ? new Date(c.decidedAt) : null;
  return (
    <article className="w-cert mx-auto w-full max-w-[820px] rounded-[10px] border border-[#d6d9e0] p-6 shadow-[var(--w-shadow-card)] md:p-10" data-testid="uat-certificate">
      <header className="mb-6 text-center">
        <div className="text-[12px] uppercase tracking-[0.14em] text-[#555]">{c.vendor}</div>
        <h1 className="mt-1 text-[22px] font-bold tracking-[-0.01em]">{wt('uat.title')}</h1>
        <div className="mt-1 text-[13px] text-[#444]">{c.project.name} ({c.project.key}){c.requestCode ? wt('uat.requestC', { c: c.requestCode }) : ''}</div>
      </header>

      <p className="mb-4 text-[13.5px] leading-relaxed">
        {wt('uat.intro', { d: day ? day.toLocaleDateString(wfmt.intl(), { day: 'numeric', month: 'long', year: 'numeric' }) : wt('uat.notDecided') })}
        {' '}<b>{c.milestone ? wt('uat.milestoneQ', { m: c.milestone }) : `“${c.title}”`}</b> {wt('uat.roundP', { r: c.round })}
      </p>
      <table className="mb-5">
        <tbody>
          <tr><th style={{ width: '32%' }}>{wt('uat.partyAClient')}</th><td>{c.client ?? '—'}</td></tr>
          <tr><th>{wt('uat.partyBSupplier')}</th><td>{c.vendor}</td></tr>
          <tr><th>{wt('uat.envBuild')}</th><td>{[c.environment, c.build].filter(Boolean).join(' · ') || '—'}</td></tr>
          <tr><th>{wt('uat.reqDecided')}</th><td>{fmt(c.requestedAt)} · {fmt(c.decidedAt)}</td></tr>
        </tbody>
      </table>

      <h2 className="mb-2 text-[14px] font-bold">{wt('uat.b1')}</h2>
      <table className="mb-5">
        <thead><tr><th style={{ width: 36 }}>#</th><th style={{ width: 90 }}>{wt('uat.item')}</th><th>{wt('uat.deliverable')}</th><th style={{ width: 120 }}>{wt('uat.result')}</th></tr></thead>
        <tbody>
          {c.items.map((i, n) => (
            <tr key={i.number}><td>{n + 1}</td><td>{i.key}</td><td>{i.title}</td><td>{i.done ? wt('uat.passed') : wt('uat.openS', { s: i.status.name })}</td></tr>
          ))}
          {!c.items.length && <tr><td colSpan={4}>—</td></tr>}
        </tbody>
      </table>
      {(c.documents.length > 0 || c.files.length > 0) && (
        <p className="mb-5 text-[13px]"><b>{wt('uat.attached')}</b> {[...c.documents.map((d) => d.title), ...c.files.map((f) => f.fileName)].join(' · ')}</p>
      )}

      <h2 className="mb-2 text-[14px] font-bold">{wt('uat.b2')}</h2>
      <ul className="mb-5 list-disc pl-5 text-[13.5px]">
        <li>{wt('uat.reviewed', { a: c.results.total, b: c.results.passed, c: c.results.failed })}</li>
        <li>{wt('uat.findings', { n: c.findings.length, k: c.findings.length ? ` (${c.findings.map((f) => f.key).join(', ')})` : '' })}</li>
      </ul>

      <h2 className="mb-2 text-[14px] font-bold">{wt('uat.b3')}</h2>
      <div className="mb-5 space-y-1 text-[13.5px]">
        <div>{box(c.conclusion === 'ACCEPTED')} <b>{wt('uat.accepted')}</b></div>
        <div>{box(c.conclusion === 'ACCEPTED_WITH_CONDITIONS')} <b>{wt('uat.acceptedCond')}</b>{c.conditions ? `: ${c.conditions}` : ''}</div>
        <div>{box(c.conclusion === 'NOT_ACCEPTED')} <b>{wt('uat.notAccepted')}</b>{c.conclusion === 'NOT_ACCEPTED' ? wt('uat.reason', { r: c.signatures.find((s) => s.decision === 'REJECTED')?.comment ?? '—' }) : ''}</div>
        {c.conclusion === 'PENDING' && <div className="text-[#a15c00]">{wt('uat.pending')}</div>}
      </div>

      <h2 className="mb-2 text-[14px] font-bold">{wt('uat.signatures')}</h2>
      <table className="mb-4">
        <thead><tr><th>{wt('uat.thName')}</th><th>{wt('uat.thSide')}</th><th>{wt('uat.thDecision')}</th><th>{wt('uat.thSignedAt')}</th><th>{wt('uat.thSig')}</th></tr></thead>
        <tbody>
          {c.signatures.map((s, i) => (
            <tr key={i}><td>{s.name}</td><td>{s.side === 'CLIENT' ? wt('uat.partyA') : wt('uat.partyB')}</td><td>{s.decision === 'APPROVED' ? wt('portal.stApproved') : wt('portal.stRejected')}</td><td>{fmt(s.at)}</td><td style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, wordBreak: 'break-all' }}>{s.signature ?? '—'}</td></tr>
          ))}
          {!c.signatures.length && <tr><td colSpan={5}>{wt('uat.noSigs')}</td></tr>}
        </tbody>
      </table>
      <p className="text-[11.5px] leading-relaxed text-[#555]">
        {wt('uat.footA')}
        {c.contentChanged ? wt('uat.changedNote') : wt('uat.unchanged')}
        {' '}{wt('uat.template')}
        {wt('uat.generated', { d: fmt(c.generatedAt) })}
      </p>
    </article>
  );
}

function Inner() {
  const params = useParams<{ ws: string; key: string; aid: string }>();
  const sp = useSearchParams();
  const preview = sp?.get('preview') === '1';
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  const aid = Number(params.aid);
  const q = useQuery({ queryKey: ['work', 'portal', pid ?? 0, 'certificate', aid, preview], queryFn: () => workPortalApi.certificate(pid!, aid, preview && !config?.clientView), enabled: !!pid && !!aid });
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title={wt('common.projectNotFound')} body={error ? workError(error) : undefined} />;
  const back = `/work/${config.workspace.slug}/${config.key}/portal?tab=approvals&approval=${aid}${preview ? '&preview=1' : ''}`;
  return (
    <div className="flex h-full flex-col">
      <div className="w-no-print"><ProjectHeader config={config} title={wt('portal.certificate')} tools={false} /></div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
        <div className="w-no-print mx-auto mb-4 flex max-w-[820px] flex-wrap items-center gap-2">
          <Link href={back} className="w-btn w-btn-ghost w-btn-sm"><ArrowLeft size={13} /> {wt('uat.backPortal')}</Link>
          <button type="button" className="w-btn w-btn-primary w-btn-sm ml-auto" onClick={() => window.print()} data-testid="uat-print"><Printer size={13} /> {wt('uat.printPdf')}</button>
        </div>
        {q.isLoading ? <PageLoading rows={6} /> : q.error || !q.data ? <EmptyState title={wt('uat.notAvail')} body={workError(q.error)} /> : <Certificate c={q.data} />}
      </div>
    </div>
  );
}

export default function CertificatePage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Inner />
    </Suspense>
  );
}
