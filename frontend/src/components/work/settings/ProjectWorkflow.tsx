'use client';

import { ArrowRight } from 'lucide-react';
import type { ProjectConfig, WorkWorkflow } from '@/lib/work-api';
import { IssueTypeIcon, StatusBadge } from '../ui';
import { Section } from './shared';

function WorkflowCard({ wf, config }: { wf: WorkWorkflow; config: ProjectConfig }) {
  const statuses = [...wf.statuses].sort((a, b) => a.position - b.position);
  const byId = new Map(statuses.map((s) => [s.id, s]));
  // Loại thẻ đi theo quy trình này (loại không gán quy trình ⇒ quy trình mặc định).
  const types = config.issueTypes.filter((t) => (t.workflowId ? t.workflowId === wf.id : wf.isDefault));

  return (
    <div className="border-b border-[var(--w-border)] py-5 first:pt-0 last:border-b-0">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="text-[13px] font-semibold">{wf.name}</h3>
        {wf.isDefault && <span className="rounded-[4px] border border-[var(--w-border-strong)] px-1.5 text-[11px] leading-[18px] text-[var(--w-text-2)]">Default</span>}
        {types.length > 0 && (
          <span className="flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--w-text-3)]">
            Used by
            {types.map((t) => (
              <span key={t.id} className="inline-flex items-center gap-1 text-[var(--w-text-2)]">
                <IssueTypeIcon type={t} size={12} />
                {t.name}
              </span>
            ))}
          </span>
        )}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {statuses.map((s, i) => (
          <span key={s.id} className="inline-flex items-center gap-1.5">
            <StatusBadge status={s} />
            {i < statuses.length - 1 && <ArrowRight size={12} className="text-[var(--w-text-3)]" />}
          </span>
        ))}
      </div>

      <div className="text-[12px] text-[var(--w-text-2)]">
        {wf.transitions.length === 0 ? (
          <p className="text-[var(--w-text-3)]">No transition rules — issues can move between any statuses.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
            {wf.transitions.map((t) => {
              const from = t.fromStatusId ? byId.get(t.fromStatusId)?.name ?? 'Unknown' : 'Any status';
              const to = byId.get(t.toStatusId)?.name ?? 'Unknown';
              return (
                <li key={t.id} className="flex min-w-0 items-center gap-1.5">
                  <span className={t.fromStatusId ? 'truncate' : 'truncate italic text-[var(--w-text-3)]'}>{from}</span>
                  <ArrowRight size={11} className="shrink-0 text-[var(--w-text-3)]" />
                  <span className="truncate font-medium text-[var(--w-text)]">{to}</span>
                  {t.name && <span className="truncate text-[var(--w-text-3)]">· {t.name}</span>}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function ProjectWorkflow({ config }: { config: ProjectConfig }) {
  return (
    <Section title="Workflows" description="Statuses an issue moves through, in board order, and the moves that are allowed. Custom workflows are coming soon.">
      {config.workflows.map((wf) => <WorkflowCard key={wf.id} wf={wf} config={config} />)}
      {!config.workflows.length && <p className="text-[13px] text-[var(--w-text-3)]">This project has no workflow.</p>}
    </Section>
  );
}
