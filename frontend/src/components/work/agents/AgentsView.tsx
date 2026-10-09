'use client';

/**
 * /work/<slug>/agents — AI agent của không gian (CTW-28 A14, thiết kế §7).
 *   · Danh sách: tên, model, owner, trạng thái, lần cuối thấy, việc đang giữ (lease), chi phí 7 ngày (A12 — ẩn nếu API chưa có).
 *   · "New agent" (admin không gian, ≤ 30 giây): 4 ô chính + dự án ⇒ hộp token MỘT lần + lệnh `claude mcp add`.
 *   · "Convert an account" (admin): bot fp_* cũ ⇒ agent, GIỮ users.id (lịch sử không mất dòng nào).
 * Quyền thật ở server (scopeOf/manageable); giao diện chỉ ẩn nút.
 */

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowRightLeft, Bot, ChevronRight, Plus, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workApi, workError, type WorkspaceDetail } from '@/lib/work-api';
import {
  AGENT_MODELS, agentKeys, agentsApi, type IssuedAgentToken, type WorkAgent,
} from '@/lib/work-agents-api';
import { Dialog, EmptyState, Field, PageLoading, relativeTime, Spinner, UserAvatar } from '../ui';
import { Select } from '../settings/shared';
import { AgentStatusPill, TokenRevealDialog, usd } from './AgentBits';
import { BuiltinBudgetCard, ProUpsell } from './BuiltinBits';
import { builtinApi, builtinKeys } from '@/lib/work-builtin-api';
import { useAgentDirectory } from './directory';

const isAdminRole = (r: string) => r === 'OWNER' || r === 'ADMIN';

function ModelInput({ value, onChange, id }: { value: string; onChange: (v: string) => void; id: string }) {
  return (
    <>
      <input className="w-input" list={`${id}-models`} value={value} maxLength={80} onChange={(e) => onChange(e.target.value)} placeholder="e.g. claude-sonnet-5" />
      <datalist id={`${id}-models`}>{AGENT_MODELS.map((m) => <option key={m} value={m} />)}</datalist>
    </>
  );
}

function useHumans(wsId: number) {
  const q = useQuery({ queryKey: ['work', 'ws-members', wsId], queryFn: () => workApi.members(wsId), staleTime: 60_000 });
  return useMemo(() => (q.data ?? []).filter((m) => m.kind !== 'AGENT' && m.role !== 'GUEST'), [q.data]);
}

// ─── Tạo agent ───────────────────────────────────────────────────

function NewAgentDialog({ ws, meId, open, onClose, onCreated }: {
  ws: WorkspaceDetail; meId?: number; open: boolean; onClose: () => void; onCreated: (a: WorkAgent, t: IssuedAgentToken | null) => void;
}) {
  const qc = useQueryClient();
  const humans = useHumans(ws.id);
  const [name, setName] = useState('');
  const [model, setModel] = useState('claude-sonnet-5');
  const [ownerId, setOwnerId] = useState<number | ''>('');
  const [roleText, setRoleText] = useState('');
  const [projectIds, setProjectIds] = useState<number[]>([]);
  const [write, setWrite] = useState(true);
  // Đợt 3C: EXTERNAL (AI của bạn qua MCP) | BUILTIN (CT Work chạy hộ — Pro/admin, không token, model do CT Work chọn).
  const [runtime, setRuntime] = useState<'EXTERNAL' | 'BUILTIN'>('EXTERNAL');
  const budget = useQuery({ queryKey: builtinKeys.budget(ws.id), queryFn: () => builtinApi.budget(ws.id), enabled: open, retry: false, staleTime: 30_000 });
  const builtin = runtime === 'BUILTIN';
  const builtinBlocked = builtin && (!budget.data?.canUse || (budget.data && budget.data.builtinAgents >= budget.data.defaults.perWorkspace));
  const create = useMutation({
    mutationFn: () => agentsApi.create(ws.id, builtin ? {
      name: name.trim(), model: budget.data?.model ?? 'builtin', ownerId: ownerId || meId, roleText: roleText.trim() || null, projectIds, runtime: 'BUILTIN', token: null,
    } : {
      name: name.trim(), model: model.trim(), ownerId: ownerId || meId, roleText: roleText.trim() || null, projectIds,
      token: { name: 'Default', scopes: write ? ['read', 'write'] : ['read'] },
    }),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: agentKeys.list(ws.id) });
      qc.invalidateQueries({ queryKey: builtinKeys.budget(ws.id) });
      setName(''); setRoleText(''); setProjectIds([]);
      if (r.agent.runtime === 'BUILTIN') toast.success('Built-in agent created — assign it an issue with “Assign to AI”');
      onCreated(r.agent, r.token);
    },
    onError: (err) => toast.error(workError(err, 'Could not create the agent')),
  });
  const projects = ws.projects.filter((p) => !p.archivedAt);
  return (
    <Dialog open={open} onClose={onClose} title="New AI agent" width={560}>
      <form onSubmit={(e) => { e.preventDefault(); if (name.trim() && (builtin || model.trim()) && !builtinBlocked && !create.isPending) create.mutate(); }} data-testid="new-agent-form">
        <fieldset className="mb-4">
          <legend className="w-label">How it runs</legend>
          <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="How the agent runs">
            {([
              ['EXTERNAL', 'Your own AI', 'Claude Code, Cursor, Gemini CLI, Codex… connects with a token (MCP).'],
              ['BUILTIN', 'Built-in · runs on CT Work', 'CT Work runs it on its own AI. No token. Pro or admin.'],
            ] as const).map(([v, title, body]) => (
              <label key={v} className={cn('flex cursor-pointer gap-2.5 rounded-[8px] border px-3 py-2.5', runtime === v ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border)] hover:bg-[var(--w-hover)]')}>
                <input type="radio" name="agent-runtime" className="mt-0.5 accent-[var(--w-accent)]" checked={runtime === v} onChange={() => setRuntime(v)} data-testid={`runtime-${v.toLowerCase()}`} />
                <span className="min-w-0"><span className="block text-[13px] font-medium">{title}</span><span className="block text-[12px] leading-snug text-[var(--w-text-3)]">{body}</span></span>
              </label>
            ))}
          </div>
        </fieldset>
        {builtin && budget.data && !budget.data.canUse && <div className="mb-4"><ProUpsell /></div>}
        {builtin && budget.data?.canUse && budget.data.builtinAgents >= budget.data.defaults.perWorkspace && (
          <p className="mb-4 text-[12.5px] text-[var(--w-red)]">This workspace already has {budget.data.defaults.perWorkspace} built-in agents — retire one first.</p>
        )}
        <div className="grid gap-x-3 sm:grid-cols-2">
          <Field label="Name"><input className="w-input" autoFocus value={name} maxLength={100} onChange={(e) => setName(e.target.value)} placeholder={builtin ? 'e.g. Test writer' : 'e.g. Client Unity'} /></Field>
          {builtin ? (
            <Field label="Model" hint="Chosen by CT Work for cost and tool use.">
              <div className="flex h-[32px] items-center rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-2.5 font-mono text-[12.5px] text-[var(--w-text-2)]">{budget.data?.model ?? '…'}</div>
            </Field>
          ) : <Field label="Model"><ModelInput id="new" value={model} onChange={setModel} /></Field>}
          <Field label="Owner" hint="The person responsible for what this agent does. Gets its alerts and reviews its work.">
            <Select value={ownerId === '' ? String(meId ?? '') : String(ownerId)} onChange={(e) => setOwnerId(Number(e.target.value))}>
              {humans.map((m) => <option key={m.id} value={m.id}>{userName(m)}{m.id === meId ? ' (you)' : ''}</option>)}
            </Select>
          </Field>
          <Field label="Role" hint="Shown next to its name, e.g. “Agent · Unity client”.">
            <input className="w-input" value={roleText} maxLength={300} onChange={(e) => setRoleText(e.target.value)} placeholder="What it works on" />
          </Field>
        </div>
        {projects.length > 0 && (
          <fieldset className="mb-4">
            <legend className="w-label">Add to projects</legend>
            <div className="grid max-h-[150px] gap-1 overflow-y-auto rounded-[8px] border border-[var(--w-border)] p-2 sm:grid-cols-2">
              {projects.map((p) => (
                <label key={p.id} className="flex min-w-0 cursor-pointer items-center gap-2 rounded-[5px] px-1.5 py-1 text-[13px] hover:bg-[var(--w-hover)]">
                  <input type="checkbox" className="accent-[var(--w-accent)]" checked={projectIds.includes(p.id)} onChange={(e) => setProjectIds((xs) => (e.target.checked ? [...xs, p.id] : xs.filter((x) => x !== p.id)))} />
                  <span className="shrink-0 font-mono text-[11px] text-[var(--w-text-3)]">{p.key}</span>
                  <span className="truncate">{p.name}</span>
                </label>
              ))}
            </div>
            <p className="mt-1 text-[12px] text-[var(--w-text-3)]">Joins as Member. Projects open to the whole workspace are visible anyway.</p>
          </fieldset>
        )}
        {builtin ? (
          <p className="mb-1 text-[12px] leading-relaxed text-[var(--w-text-3)]">
            Spends at most {usd(budget.data?.defaults.agentDailyUsd ?? 5)} a day (change it on its page) and {usd(budget.data?.runCapUsd ?? 2)} per issue. Same rules as any agent: it can never approve, delete, change settings, touch finance or reach clients, and its “Done” goes to review.
          </p>
        ) : (
          <label className="mb-1 flex cursor-pointer items-start gap-2 text-[13px]">
            <input type="checkbox" className="mt-0.5 accent-[var(--w-accent)]" checked={write} onChange={(e) => setWrite(e.target.checked)} />
            <span>Token can make changes <span className="block text-[12px] text-[var(--w-text-3)]">Off = read only. Agents can never approve, delete, change settings, touch finance or send anything to clients.</span></span>
          </label>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="w-btn w-btn-primary" disabled={!name.trim() || (!builtin && !model.trim()) || !!builtinBlocked || create.isPending} data-testid="create-agent">
            {create.isPending && <Spinner size={12} />} Create agent
          </button>
        </div>
      </form>
    </Dialog>
  );
}

// ─── Chuyển tài khoản có sẵn ─────────────────────────────────────

function ConvertDialog({ ws, meId, open, onClose, onDone }: {
  ws: WorkspaceDetail; meId?: number; open: boolean; onClose: () => void; onDone: (a: WorkAgent, t: IssuedAgentToken | null) => void;
}) {
  const qc = useQueryClient();
  const members = useQuery({ queryKey: ['work', 'ws-members', ws.id], queryFn: () => workApi.members(ws.id), staleTime: 60_000, enabled: open });
  const candidates = (members.data ?? []).filter((m) => m.kind !== 'AGENT' && m.role !== 'OWNER' && m.role !== 'ADMIN' && m.id !== meId);
  const humans = (members.data ?? []).filter((m) => m.kind !== 'AGENT' && m.role !== 'GUEST');
  const [userId, setUserId] = useState<number | ''>('');
  const [ownerId, setOwnerId] = useState<number | ''>('');
  const [model, setModel] = useState('claude-sonnet-5');
  const convert = useMutation({
    mutationFn: () => agentsApi.convert(ws.id, { userId: Number(userId), ownerId: Number(ownerId || meId), model: model.trim() }),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: agentKeys.list(ws.id) });
      qc.invalidateQueries({ queryKey: ['work', 'ws-members', ws.id] });
      const extra = [r.demotedProjectRoles ? `${r.demotedProjectRoles} project role(s) lowered to Member` : '', r.revokedTokens ? `${r.revokedTokens} personal token(s) revoked` : '', r.pendingApprovalSteps ? `${r.pendingApprovalSteps} pending approval step(s) need a new approver` : ''].filter(Boolean);
      toast.success(`Converted into an AI agent${extra.length ? ` — ${extra.join(' · ')}` : ''}`);
      onDone(r.agent, r.token);
    },
    onError: (err) => toast.error(workError(err, 'Could not convert this account')),
  });
  return (
    <Dialog open={open} onClose={onClose} title="Convert an account into an agent" width={520}>
      <p className="mb-4 text-[13px] leading-relaxed text-[var(--w-text-2)]">
        For bot accounts that used to sign in with a password. The account keeps its id, so every issue, comment, work log and history entry stays attached to it.
        Its password, 2FA and personal tokens are removed and it gets an agent token instead.
      </p>
      <Field label="Account">
        <Select value={String(userId)} onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : '')} data-testid="convert-user">
          <option value="">Choose a member…</option>
          {candidates.map((m) => <option key={m.id} value={m.id}>{userName(m)} (@{m.username})</option>)}
        </Select>
      </Field>
      <div className="grid gap-x-3 sm:grid-cols-2">
        <Field label="Owner">
          <Select value={ownerId === '' ? String(meId ?? '') : String(ownerId)} onChange={(e) => setOwnerId(Number(e.target.value))}>
            {humans.filter((m) => m.id !== userId).map((m) => <option key={m.id} value={m.id}>{userName(m)}{m.id === meId ? ' (you)' : ''}</option>)}
          </Select>
        </Field>
        <Field label="Model"><ModelInput id="convert" value={model} onChange={setModel} /></Field>
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!userId || !model.trim() || convert.isPending} onClick={() => convert.mutate()}>
          {convert.isPending && <Spinner size={12} />} Convert
        </button>
      </div>
    </Dialog>
  );
}

// ─── Trang danh sách ─────────────────────────────────────────────

export default function AgentsView({ ws, meId }: { ws: WorkspaceDetail; meId?: number }) {
  const admin = isAdminRole(ws.role);
  const [showRetired, setShowRetired] = useState(false);
  const q = useQuery({ queryKey: [...agentKeys.list(ws.id), showRetired ? 'all' : 'live'], queryFn: () => agentsApi.list(ws.id, showRetired) });
  const put = useAgentDirectory((s) => s.put);
  // Chi phí 7 ngày (A12). API chưa có / không đủ quyền ⇒ ẩn cột, không báo lỗi.
  const dash = useQuery({ queryKey: agentKeys.dashboard(ws.id, 7), queryFn: () => agentsApi.dashboard(ws.id, 7), retry: false, staleTime: 60_000 });
  const cost7 = useMemo(() => new Map((dash.data?.agents ?? []).map((r) => [r.agent.id, r.costUsd])), [dash.data]);
  const [newOpen, setNewOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [reveal, setReveal] = useState<{ agent: WorkAgent; token: IssuedAgentToken } | null>(null);
  useEffect(() => { if (q.data) put(q.data); }, [q.data, put]);

  const onCreated = (agent: WorkAgent, token: IssuedAgentToken | null) => {
    setNewOpen(false); setConvertOpen(false);
    if (token) setReveal({ agent, token });
  };
  const rows = q.data ?? [];
  const base = `/work/${ws.slug}/agents`;

  return (
    <div className="w-page">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 max-w-[640px]">
          <p className="text-[13px] leading-relaxed text-[var(--w-text-2)]">
            AI agents are members of the team: they take issues, comment, log work and report their cost — through their own token, never a password.
            Every agent has a person who owns it. Agents cannot approve, delete, change settings, touch finance or talk to clients, and their “Done” goes to review first.
          </p>
        </div>
        <div className="flex min-w-0 flex-wrap gap-2">
          <label className="flex h-[30px] cursor-pointer items-center gap-1.5 px-1 text-[12px] text-[var(--w-text-2)]">
            <input type="checkbox" className="accent-[var(--w-accent)]" checked={showRetired} onChange={(e) => setShowRetired(e.target.checked)} /> Show retired
          </label>
          {admin && <button type="button" className="w-btn" onClick={() => setConvertOpen(true)}><ArrowRightLeft size={13} /> Convert an account</button>}
          {admin && <button type="button" className="w-btn w-btn-primary" onClick={() => setNewOpen(true)} data-testid="new-agent"><Plus size={14} /> New agent</button>}
        </div>
      </div>

      <BuiltinBudgetCard wsId={ws.id} />

      {q.isLoading ? <PageLoading rows={4} /> : q.error ? (
        <EmptyState title="Could not load agents" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />
      ) : !rows.length ? (
        <div className="w-card flex flex-col items-center px-6 py-14 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-[30%] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]"><Bot size={22} /></span>
          <div className="mt-3 text-[15px] font-semibold">No AI agents yet</div>
          <p className="mt-1.5 max-w-[460px] text-[13px] leading-relaxed text-[var(--w-text-2)]">
            Create an agent, paste one command into Claude Code, and it can pick up the issues you assign to it.
          </p>
          {admin ? (
            <button type="button" className="w-btn w-btn-primary mt-4" onClick={() => setNewOpen(true)}><Plus size={14} /> New agent</button>
          ) : (
            <p className="mt-3 text-[12px] text-[var(--w-text-3)]">Ask a workspace admin to create one.</p>
          )}
        </div>
      ) : (
        <div className="w-card overflow-hidden" role="table" aria-label="AI agents">
          <div role="row" className="hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_minmax(0,1.3fr)_90px_110px_90px_80px_20px] items-center gap-3 border-b border-[var(--w-border)] bg-[var(--w-sunken)] px-4 py-2 text-[11.5px] font-medium text-[var(--w-text-3)] md:grid">
            <span role="columnheader">Agent</span><span role="columnheader">Model</span><span role="columnheader">Owner</span>
            <span role="columnheader">Status</span><span role="columnheader">Last seen</span><span role="columnheader">Working on</span>
            <span role="columnheader" className="text-right" title="Self-reported by the agent unless measured by CT Work">Cost 7d</span><span />
          </div>
          {rows.map((a) => (
            <Link
              key={a.id}
              href={`${base}/${a.id}`}
              role="row"
              data-testid="agent-row"
              className={cn('grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 border-b border-[var(--w-border)] px-4 py-3 last:border-b-0 hover:bg-[var(--w-hover)] md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_minmax(0,1.3fr)_90px_110px_90px_80px_20px]', a.status === 'RETIRED' && 'opacity-60')}
            >
              <span role="cell" className="flex min-w-0 items-center gap-2.5">
                <UserAvatar user={a.user} size={30} />
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-medium">{userName(a.user)}</span>
                  <span className="block truncate text-[12px] text-[var(--w-text-3)]">{a.roleText || `@${a.user.username}`}</span>
                </span>
              </span>
              <span role="cell" className="flex min-w-0 items-center gap-1.5 max-md:hidden">
                {a.runtime === 'BUILTIN' && <span className="shrink-0 rounded-[4px] bg-[var(--w-accent-soft)] px-1.5 py-px text-[10.5px] font-semibold uppercase tracking-[0.03em] text-[var(--w-accent-text)]" title="Runs on CT Work">Built-in</span>}
                <span className="truncate font-mono text-[12px] text-[var(--w-text-2)]">{a.model}</span>
              </span>
              <span role="cell" className="flex min-w-0 items-center gap-1.5 text-[13px] max-md:hidden"><UserAvatar user={a.owner} size={18} /><span className="truncate">{userName(a.owner)}</span></span>
              <span role="cell" className="justify-self-end md:justify-self-start"><AgentStatusPill status={a.status} /></span>
              <span role="cell" className="text-[12px] text-[var(--w-text-2)] max-md:col-span-2 max-md:text-[var(--w-text-3)]">
                <span className="md:hidden">{a.model} · owner {userName(a.owner)} · </span>
                {a.lastSeenAt ? relativeTime(a.lastSeenAt) : 'Never connected'}
              </span>
              <span role="cell" className="text-[12px] tabular-nums text-[var(--w-text-2)] max-md:hidden">
                {(a.activeLeases?.length ?? 0) > 0 ? `${a.activeLeases!.length} issue${a.activeLeases!.length === 1 ? '' : 's'}` : '—'}
              </span>
              <span role="cell" className="text-right text-[12px] tabular-nums text-[var(--w-text-2)] max-md:hidden">{dash.data ? usd(cost7.get(a.id) ?? 0) : '—'}</span>
              <ChevronRight size={14} className="text-[var(--w-text-3)] max-md:hidden" />
            </Link>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-start gap-2 text-[12px] leading-relaxed text-[var(--w-text-3)]">
        <ShieldCheck size={14} className="mt-0.5 shrink-0" />
        <span>Owners see and manage their own agents; workspace admins manage all of them. Retiring an agent revokes its tokens and removes it from projects — its history stays.</span>
      </div>

      {admin && <NewAgentDialog ws={ws} meId={meId} open={newOpen} onClose={() => setNewOpen(false)} onCreated={onCreated} />}
      {admin && convertOpen && <ConvertDialog ws={ws} meId={meId} open={convertOpen} onClose={() => setConvertOpen(false)} onDone={onCreated} />}
      <TokenRevealDialog token={reveal?.token ?? null} agentName={reveal ? userName(reveal.agent.user) : ''} onClose={() => setReveal(null)} />
    </div>
  );
}
