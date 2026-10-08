'use client';

/**
 * Cài đặt dự án → AI agents (CTW-28 A14, thiết kế §3.4 + §7): luật "Done của agent ⇒ Review", cột review, agent tự tạo
 * thẻ / tự nhận thẻ chưa giao, số lease tối đa, thời hạn lease, người duyệt mặc định cho request_review.
 * Server: GET/PUT /projects/:pid/agent-settings (PUT cần project.settings — ADMIN dự án; tắt Done⇒Review có audit).
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, Bot } from 'lucide-react';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import { agentKeys, agentsApi, type AgentSettings } from '@/lib/work-agents-api';
import { PageLoading, Spinner, UserAvatar } from '../ui';
import { Section, Select, Switch } from './shared';

export default function ProjectAgents({ config, slug }: { config: ProjectConfig; slug: string }) {
  const pid = config.id;
  const qc = useQueryClient();
  const can = config.permissions.settings;
  const q = useQuery({ queryKey: agentKeys.settings(pid), queryFn: () => agentsApi.settings(pid) });
  const [s, setS] = useState<AgentSettings | null>(null);
  useEffect(() => {
    if (!q.data) return;
    const { reviewStatusCandidates: _c, ...rest } = q.data;
    setS(rest);
  }, [q.data]);
  const save = useMutation({
    mutationFn: (body: Partial<AgentSettings>) => agentsApi.updateSettings(pid, body),
    onSuccess: (r) => {
      qc.setQueryData(agentKeys.settings(pid), (old: typeof q.data) => (old ? { ...old, ...r } : old));
      setS(r);
      toast.success('Saved');
    },
    onError: (err) => toast.error(workError(err, 'Could not save the agent settings')),
  });
  const agents = useMemo(() => config.members.filter((m) => m.kind === 'AGENT'), [config.members]);
  const people = useMemo(() => config.members.filter((m) => m.kind !== 'AGENT' && (m.role === 'ADMIN' || m.role === 'MEMBER')), [config.members]);

  if (!q.data || !s) return q.error ? <p className="text-[13px] text-[var(--w-red)]">{workError(q.error)}</p> : <PageLoading rows={4} />;
  const saved = (({ reviewStatusCandidates: _c, ...rest }) => rest)(q.data);
  const dirty = JSON.stringify(s) !== JSON.stringify(saved);
  const candidates = q.data.reviewStatusCandidates;
  const wfCount = new Set(candidates.map((c) => c.workflowId)).size;
  const autoReview = candidates.find((c) => /review|qa|verify/i.test(c.name));

  return (
    <div className="max-w-[880px]" data-testid="project-agents-settings">
      <Section
        title="AI agents in this project"
        description={<>Agents are members with a token instead of a password. Create them and manage their tokens on the <Link href={`/work/${slug}/agents`} className="text-[var(--w-accent-text)] hover:underline">AI agents</Link> page; add or remove them here under Members.</>}
      >
        {agents.length ? (
          <ul className="flex flex-wrap gap-2">
            {agents.map((a) => (
              <li key={a.id} className="flex items-center gap-2 rounded-[8px] border border-[var(--w-border)] px-2.5 py-1.5 text-[13px]">
                <UserAvatar user={a} size={20} /> {userName(a)} <span className="text-[12px] text-[var(--w-text-3)]">{a.role === 'VIEWER' ? 'Viewer' : 'Member'}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex items-center gap-2 text-[13px] text-[var(--w-text-3)]"><Bot size={14} /> No agent works in this project yet.</p>
        )}
      </Section>

      <Section
        title="When an agent says “Done”"
        description="By default an agent can never close an issue: moving it to Done sends it to a review status instead, and its owner and the reporter are notified. A person then moves it to Done."
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Switch checked={s.doneToReview} disabled={!can} onChange={(v) => setS({ ...s, doneToReview: v })} label="Send agent work to review instead of Done" />
            <span className="text-[13px]">
              <b className="font-medium">Send agent work to review instead of Done</b>
              <span className="block text-[12.5px] text-[var(--w-text-2)]">Recommended. Turning it off lets agents close issues directly — your velocity then counts unreviewed work.</span>
            </span>
          </div>
          {!s.doneToReview && (
            <p className="flex items-start gap-2 rounded-[6px] border border-[color-mix(in_srgb,var(--w-orange)_45%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_10%,transparent)] px-3 py-2 text-[12.5px]">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-[var(--w-orange)]" /> Agents can close issues directly in this project. The change is recorded in the audit log.
            </p>
          )}
          <label className="block max-w-[420px]">
            <span className="mb-1 block text-[12px] text-[var(--w-text-2)]">Review status</span>
            <Select value={s.reviewStatusId ?? ''} disabled={!can || !s.doneToReview} onChange={(e) => setS({ ...s, reviewStatusId: e.target.value ? Number(e.target.value) : null })} data-testid="review-status">
              <option value="">Automatic{autoReview ? ` — “${autoReview.name}”` : ' — none found'}</option>
              {candidates.map((c) => <option key={c.id} value={c.id}>{c.name}{wfCount > 1 ? ` (workflow ${c.workflowId})` : ''}</option>)}
            </Select>
            <span className="mt-1 block text-[12px] text-[var(--w-text-3)]">
              Automatic picks a status named like review, QA or verify. {!autoReview && !s.reviewStatusId && 'Without one, an agent moving to Done gets an error — add a review column in Workflow or pick a status here.'}
            </span>
          </label>
        </div>
      </Section>

      <Section title="What agents may do" description="On top of these, agents are always blocked from approving, deleting, project settings, finance, client sharing and the client portal.">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Switch checked={s.allowCreateIssues} disabled={!can} onChange={(v) => setS({ ...s, allowCreateIssues: v })} label="Agents can create issues" />
            <span className="text-[13px]"><b className="font-medium">Create issues</b><span className="block text-[12.5px] text-[var(--w-text-2)]">Sub-tasks of issues assigned to them are always allowed.</span></span>
          </div>
          <div className="flex items-start gap-3">
            <Switch checked={s.allowSelfAssign} disabled={!can} onChange={(v) => setS({ ...s, allowSelfAssign: v })} label="Agents can take unassigned issues" />
            <span className="text-[13px]"><b className="font-medium">Take unassigned issues</b><span className="block text-[12.5px] text-[var(--w-text-2)]">Claiming an issue nobody owns assigns it to the agent. Off = a person must assign it first.</span></span>
          </div>
          <div className="grid gap-3 pt-1 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-[12px] text-[var(--w-text-2)]">Issues one agent may hold at once</span>
              <input type="number" min={1} max={20} className="w-input !h-8 max-w-[120px]" disabled={!can} value={s.maxOpenLeases} onChange={(e) => setS({ ...s, maxOpenLeases: Math.min(20, Math.max(1, Number(e.target.value) || 1)) })} />
            </label>
            <label>
              <span className="mb-1 block text-[12px] text-[var(--w-text-2)]">Lease length (minutes)</span>
              <input type="number" min={5} max={240} className="w-input !h-8 max-w-[120px]" disabled={!can} value={s.leaseMinutes} onChange={(e) => setS({ ...s, leaseMinutes: Math.min(240, Math.max(5, Number(e.target.value) || 30)) })} />
              <span className="mt-1 block text-[12px] text-[var(--w-text-3)]">Without a heartbeat in this time the lease expires and the issue is flagged as blocked.</span>
            </label>
          </div>
        </div>
      </Section>

      <Section title="Reviewers" description="Who gets the approval when an agent calls request_review. None = the agent’s owner.">
        <div className="flex flex-wrap gap-1.5">
          {people.map((m) => {
            const on = s.reviewerIds.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                disabled={!can}
                aria-pressed={on}
                onClick={() => setS({ ...s, reviewerIds: on ? s.reviewerIds.filter((x) => x !== m.id) : [...s.reviewerIds, m.id].slice(0, 10) })}
                className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-[12.5px] disabled:cursor-not-allowed ${on ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] hover:bg-[var(--w-hover)]'}`}
              >
                <UserAvatar user={m} size={16} /> {userName(m)}
              </button>
            );
          })}
        </div>
      </Section>

      {can && (
        <div className="sticky bottom-0 -mx-1 flex gap-2 border-t border-[var(--w-border)] bg-[var(--w-panel)] px-1 py-3">
          <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!dirty || save.isPending} onClick={() => save.mutate(s)} data-testid="save-agent-settings">
            {save.isPending && <Spinner size={11} />} Save agent settings
          </button>
          {dirty && <button type="button" className="w-btn w-btn-sm" onClick={() => setS(saved)}>Reset</button>}
        </div>
      )}
    </div>
  );
}
