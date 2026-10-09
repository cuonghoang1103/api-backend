'use client';

/**
 * Khu wt('gov.changeRequests') + "Risks" trong CHI TIẾT THẺ (đợt S3b). Một lời gọi
 * GET /issues/:n/governance — mô-đun tắt / người xem không phải người của đội ⇒ phần đó
 * null ⇒ không vẽ gì (dự án cũ thấy thẻ y như trước).
 */

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GitPullRequestArrow, Plus } from 'lucide-react';
import type { ProjectConfig } from '@/lib/work-api';
import { RAID_LABEL, govApi, govKeys } from '@/lib/work-s3b-api';
import { NewChangeDialog } from './ChangesView';
import { CrStatusPill, RaidStatusPill, ScoreBadge, fmtDays } from './shared';
import { wt } from '@/components/work/i18n';

export function IssueGovernance({ config, issueNumber }: { config: ProjectConfig; issueNumber: number }) {
  const enabled = !!config.permissions.viewGovernance && !!(config.modules?.changeRequests || config.modules?.raid);
  const q = useQuery({ queryKey: govKeys.issue(config.id, issueNumber), queryFn: () => govApi.issueGovernance(config.id, issueNumber), enabled });
  const [raising, setRaising] = useState(false);
  if (!enabled || !q.data) return null;
  const { changeRequests: crs, risks } = q.data;
  const base = `/work/${config.workspace.slug}/${config.key}`;
  const canRaise = !!config.permissions.editGovernance && !!config.modules?.changeRequests;
  return (
    <>
      {crs && (crs.length > 0 || canRaise) && (
        <section data-testid="issue-crs">
          <div className="mb-2 flex items-center">
            <h3 className="w-section-title">{wt('gov.changeRequests')}</h3>
            {canRaise && <button type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => setRaising(true)}><Plus size={13} /> {wt('gov.raiseCr')}</button>}
          </div>
          {crs.length ? (
            <ul className="overflow-hidden rounded-[6px] border border-[var(--w-border)]">
              {crs.map((c) => (
                <li key={`${c.number}-${c.role}`} className="border-b border-[var(--w-border)] last:border-b-0">
                  <Link href={`${base}/changes/${c.number}`} className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 px-2.5 py-2 text-[13px] hover:bg-[var(--w-hover)]">
                    <GitPullRequestArrow size={13} className="shrink-0 text-[var(--w-text-3)]" />
                    <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">CR-{c.number}</span>
                    <span className="min-w-0 flex-1 truncate">{c.title}</span>
                    <span className="text-[12px] text-[var(--w-text-3)]">{c.role === 'IMPLEMENTS' ? wt('gov.implementsLc') : wt('gov.affectedLc')} · {fmtDays(c.scheduleDays)}</span>
                    <CrStatusPill status={c.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="text-[12px] text-[var(--w-text-3)]">{wt('gov.outOfScope')}</p>}
          <NewChangeDialog config={config} open={raising} onClose={() => setRaising(false)} sourceIssueNumber={issueNumber} />
        </section>
      )}
      {risks && risks.length > 0 && (
        <section data-testid="issue-risks">
          <h3 className="w-section-title mb-2">Risks &amp; RAID</h3>
          <ul className="overflow-hidden rounded-[6px] border border-[var(--w-border)]">
            {risks.map((r) => (
              <li key={r.number} className="border-b border-[var(--w-border)] last:border-b-0">
                <Link href={`${base}/raid?item=${r.number}${r.type !== 'RISK' ? `&type=${r.type}` : ''}`} className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 px-2.5 py-2 text-[13px] hover:bg-[var(--w-hover)]">
                  {r.type !== 'ASSUMPTION' && <ScoreBadge score={r.score} />}
                  <span className="shrink-0 text-[12px] text-[var(--w-text-3)]">{RAID_LABEL[r.type].one}</span>
                  <span className="min-w-0 flex-1 truncate">{r.title}</span>
                  <RaidStatusPill status={r.status} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
