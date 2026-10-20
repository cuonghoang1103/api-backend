'use client';

/** "Create with CuongMini" — kết quả sau khi tạo: mỗi dự án một thẻ (link board/Docs/backlog) + lời mời. */

import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, FileText, ListTodo, Mail } from 'lucide-react';
import type { SetupDraft } from '@/lib/work-setup-api';
import { wt } from '@/components/work/i18n';

export default function ResultView({ draft, slug, onNew }: { draft: SetupDraft; slug: string; onNew: () => void }) {
  const r = draft.result;
  if (!r) return null;
  return (
    <div className="mx-auto max-w-[860px]">
      <div className="mb-4 flex items-start gap-3">
        <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-[var(--w-green)]" />
        <div>
          <h2 className="text-[18px] font-semibold tracking-[-0.01em]">{r.projects.length > 1 ? wt('tcm.doneTitleMany', { n: r.projects.length }) : wt('tcm.doneTitle')}</h2>
          <p className="mt-0.5 text-[13px] text-[var(--w-text-2)]">{wt('tcm.doneBody')}</p>
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {r.projects.map((p) => (
          <li key={p.id} className="w-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-[5px] bg-[var(--w-sunken)] px-1.5 font-mono text-[12px]">{p.key}</span>
              <span className="min-w-0 flex-1 truncate text-[14px] font-semibold">{p.name}</span>
            </div>
            <dl className="grid grid-cols-3 gap-2 text-center text-[11.5px] text-[var(--w-text-3)]">
              {([['issues', p.issues], ['sprints', p.sprints], ['pages', p.pages], ['tests', p.tests], ['risks', p.risks], ['meetings', p.meetings]] as const).map(([k, n]) => (
                <div key={k} className="rounded-[6px] bg-[var(--w-sunken)] px-1 py-1.5"><dd className="text-[16px] font-semibold tabular-nums text-[var(--w-text)]">{n}</dd><dt>{wt(`tcm.res_${k}` as const)}</dt></div>
              ))}
            </dl>
            {(p.invited > 0 || p.planned > 0 || p.files > 0) && (
              <p className="mt-2 text-[12px] text-[var(--w-text-2)]">
                {[p.files ? wt('tcm.resFiles', { n: p.files }) : '', p.invited ? wt('tcm.resInvited', { n: p.invited }) : '', p.planned ? wt('tcm.resPlanned', { n: p.planned }) : ''].filter(Boolean).join(' · ')}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Link href={`/work/${slug}/${p.key}/board`} className="w-btn w-btn-sm w-btn-primary"><ArrowUpRight size={13} /> {wt('tcm.openBoard')}</Link>
              <Link href={`/work/${slug}/${p.key}/backlog`} className="w-btn w-btn-sm"><ListTodo size={13} /> {wt('tcm.openBacklog')}</Link>
              <Link href={`/work/${slug}/${p.key}/docs`} className="w-btn w-btn-sm"><FileText size={13} /> {wt('tcm.openDocs')}</Link>
            </div>
          </li>
        ))}
      </ul>
      {(r.invites.sent > 0 || r.invites.added > 0 || r.invites.reason) && (
        <p className="mt-3 flex items-start gap-1.5 text-[12.5px] text-[var(--w-text-2)]">
          <Mail size={14} className="mt-0.5 shrink-0" />
          <span>{wt('tcm.resInvites', { sent: r.invites.sent, added: r.invites.added })}{r.invites.reason ? ` — ${r.invites.reason}` : ''}</span>
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link href={`/work/${slug}`} className="w-btn">{wt('tcm.backToWs')}</Link>
        <button type="button" className="w-btn" onClick={onNew}>{wt('tcm.setupAnother')}</button>
      </div>
    </div>
  );
}
