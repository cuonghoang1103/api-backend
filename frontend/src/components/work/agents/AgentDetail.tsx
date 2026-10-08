'use client';

/**
 * /work/<slug>/agents/<id> — một AI agent (CTW-28 A14, thiết kế §7):
 *   hồ sơ + Pause/Resume/Retire + sửa (model, vai, owner — chỉ admin, song song, trần tiền/ngày),
 *   việc đang giữ (lease), token (tạo — hiện một lần + lệnh `claude mcp add`, phạm vi dự án, thu hồi),
 *   webhook (URL che, sự kiện, bật/tắt, gửi thử, lỗi gần nhất), hộp thư 50 dòng gần nhất.
 * Người không quản lý được (thành viên thường) chỉ xem hồ sơ + việc đang giữ.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Activity, ArrowLeft, Bell, KeyRound, Pause, Pencil, Play, Plus, Power, Send, Trash2, Webhook,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workApi, workError, type WorkspaceDetail } from '@/lib/work-api';
import {
  AGENT_MODELS, agentKeys, agentsApi, INBOX_EVENT_LABEL, WEBHOOK_EVENT_OPTIONS,
  type AgentWebhook, type IssuedAgentToken, type WorkAgent,
} from '@/lib/work-agents-api';
import { Dialog, EmptyState, Field, formatDate, PageLoading, relativeTime, Spinner, UserAvatar } from '../ui';
import { ConfirmDialog, Section, Select, Switch } from '../settings/shared';
import { AgentStatusPill, Stat, TokenRevealDialog, usd } from './AgentBits';
import { useAgentDirectory } from './directory';
import { AgentRunsSection } from './BuiltinBits';

const maskUrl = (u: string) => {
  try {
    const x = new URL(u);
    const path = x.pathname.length > 12 ? `${x.pathname.slice(0, 8)}…` : x.pathname;
    return `${x.protocol}//${x.host}${path}`;
  } catch { return u.slice(0, 24) + '…'; }
};

// ─── Sửa ─────────────────────────────────────────────────────────

function EditDialog({ ws, agent, open, onClose }: { ws: WorkspaceDetail; agent: WorkAgent; open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const admin = ws.role === 'OWNER' || ws.role === 'ADMIN';
  const members = useQuery({ queryKey: ['work', 'ws-members', ws.id], queryFn: () => workApi.members(ws.id), staleTime: 60_000, enabled: open && admin });
  const [name, setName] = useState(userName(agent.user));
  const [model, setModel] = useState(agent.model);
  const [roleText, setRoleText] = useState(agent.roleText ?? '');
  const [ownerId, setOwnerId] = useState(agent.ownerId);
  const [slots, setSlots] = useState(agent.parallelSlots);
  const [cap, setCap] = useState(agent.dailyCostCapUsd === null ? '' : String(agent.dailyCostCapUsd));
  useEffect(() => {
    if (!open) return;
    setName(userName(agent.user)); setModel(agent.model); setRoleText(agent.roleText ?? ''); setOwnerId(agent.ownerId);
    setSlots(agent.parallelSlots); setCap(agent.dailyCostCapUsd === null ? '' : String(agent.dailyCostCapUsd));
  }, [open, agent]);
  const save = useMutation({
    mutationFn: () => agentsApi.update(ws.id, agent.id, {
      name: name.trim(), ...(agent.runtime === 'BUILTIN' ? {} : { model: model.trim() }), roleText: roleText.trim() || null, parallelSlots: slots,
      dailyCostCapUsd: cap.trim() === '' ? null : Math.max(0, Number(cap)),
      ...(admin && ownerId !== agent.ownerId ? { ownerId } : {}),
    }),
    onSuccess: (a) => { qc.setQueryData(agentKeys.detail(ws.id, agent.id), a); qc.invalidateQueries({ queryKey: agentKeys.list(ws.id) }); toast.success('Saved'); onClose(); },
    onError: (err) => toast.error(workError(err, 'Could not save')),
  });
  const humans = (members.data ?? []).filter((m) => m.kind !== 'AGENT' && m.role !== 'GUEST');
  return (
    <Dialog open={open} onClose={onClose} title="Edit agent" width={520}>
      <form onSubmit={(e) => { e.preventDefault(); if (name.trim() && model.trim()) save.mutate(); }}>
        <div className="grid gap-x-3 sm:grid-cols-2">
          <Field label="Name"><input className="w-input" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} /></Field>
          {agent.runtime === 'BUILTIN' ? (
            <Field label="Model" hint="Built-in agents use the model CT Work picks.">
              <div className="flex h-[32px] items-center rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-2.5 font-mono text-[12.5px] text-[var(--w-text-2)]">{agent.model}</div>
            </Field>
          ) : (
            <Field label="Model">
              <input className="w-input" list="edit-models" value={model} maxLength={80} onChange={(e) => setModel(e.target.value)} />
              <datalist id="edit-models">{AGENT_MODELS.map((m) => <option key={m} value={m} />)}</datalist>
            </Field>
          )}
        </div>
        <Field label="Role"><input className="w-input" value={roleText} maxLength={300} onChange={(e) => setRoleText(e.target.value)} /></Field>
        {admin && (
          <Field label="Owner" hint="Only workspace admins can hand an agent to another person.">
            <Select value={String(ownerId)} onChange={(e) => setOwnerId(Number(e.target.value))}>
              {!humans.some((m) => m.id === agent.ownerId) && <option value={agent.ownerId}>{userName(agent.owner)}</option>}
              {humans.map((m) => <option key={m.id} value={m.id}>{userName(m)}</option>)}
            </Select>
          </Field>
        )}
        <div className="grid gap-x-3 sm:grid-cols-2">
          <Field label="Issues at the same time" hint="How many issues it may hold a lease on at once (1–10).">
            <input type="number" min={1} max={10} className="w-input" value={slots} onChange={(e) => setSlots(Math.min(10, Math.max(1, Number(e.target.value) || 1)))} />
          </Field>
          <Field label="Daily cost cap (USD)" hint={agent.runtime === 'BUILTIN' ? 'Measured spend of this built-in agent per day. Empty = $5.' : 'Empty = the workspace default.'}>
            <input type="number" min={0} step="0.5" className="w-input" value={cap} onChange={(e) => setCap(e.target.value)} placeholder="No cap" />
          </Field>
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="w-btn w-btn-primary" disabled={save.isPending || !name.trim() || !model.trim()}>{save.isPending && <Spinner size={12} />} Save</button>
        </div>
      </form>
    </Dialog>
  );
}

// ─── Token ───────────────────────────────────────────────────────

function TokensSection({ ws, agent, onIssued }: { ws: WorkspaceDetail; agent: WorkAgent; onIssued: (t: IssuedAgentToken) => void }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: agentKeys.tokens(ws.id, agent.id), queryFn: () => agentsApi.tokens(ws.id, agent.id) });
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [write, setWrite] = useState(true);
  const [scope, setScope] = useState<number[]>([]);
  const [expiry, setExpiry] = useState('');
  const [revoke, setRevoke] = useState<number | null>(null);
  const projects = agent.projects ?? [];
  const keyOf = (pid: number) => ws.projects.find((p) => p.id === pid)?.key ?? `#${pid}`;
  const create = useMutation({
    mutationFn: () => agentsApi.createToken(ws.id, agent.id, { name: name.trim(), scopes: write ? ['read', 'write'] : ['read'], projectIds: scope, expiresInDays: expiry ? Number(expiry) : null }),
    onSuccess: (t) => { qc.invalidateQueries({ queryKey: agentKeys.tokens(ws.id, agent.id) }); setOpen(false); setName(''); setScope([]); onIssued(t); },
    onError: (err) => toast.error(workError(err, 'Could not create the token')),
  });
  const del = useMutation({
    mutationFn: (tid: number) => agentsApi.revokeToken(ws.id, agent.id, tid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: agentKeys.tokens(ws.id, agent.id) }); setRevoke(null); toast.success('Token revoked — it stops working immediately'); },
    onError: (err) => toast.error(workError(err, 'Could not revoke the token')),
  });
  const retired = agent.status === 'RETIRED';
  return (
    <Section
      title="Tokens"
      description="The agent authenticates only with these. Up to 5 active tokens; limit one to some projects if it should not see the rest."
      action={!retired && <button type="button" className="w-btn w-btn-sm" onClick={() => setOpen(true)} data-testid="new-token"><Plus size={13} /> New token</button>}
    >
      {q.isLoading ? <Spinner /> : !q.data?.length ? (
        <p className="text-[13px] text-[var(--w-text-3)]">{retired ? 'Retired agents have no tokens.' : 'No active token — the agent cannot connect.'}</p>
      ) : (
        <ul className="w-card divide-y divide-[var(--w-border)] overflow-hidden">
          {q.data.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2.5" data-testid="token-row">
              <KeyRound size={14} className="shrink-0 text-[var(--w-text-3)]" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium">{t.name}</div>
                <div className="font-mono text-[11px] text-[var(--w-text-3)]">ctw_{t.prefix}_…</div>
              </div>
              <span className="text-[12px] text-[var(--w-text-2)]">{t.scopes.includes('write') ? 'Read & write' : 'Read only'}</span>
              <span className="text-[12px] text-[var(--w-text-2)]">{t.projectIds.length ? t.projectIds.map(keyOf).join(', ') : 'All its projects'}</span>
              <span className="text-[12px] text-[var(--w-text-3)]" title={t.lastUsedIp ?? undefined}>{t.lastUsedAt ? `Used ${relativeTime(t.lastUsedAt)}` : 'Never used'}</span>
              <span className="text-[12px] text-[var(--w-text-3)]">{t.expiresAt ? `Expires ${formatDate(t.expiresAt)}` : 'No expiry'}</span>
              <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-danger" onClick={() => setRevoke(t.id)}>Revoke</button>
            </li>
          ))}
        </ul>
      )}
      <Dialog open={open} onClose={() => setOpen(false)} title="New agent token" width={480}>
        <form onSubmit={(e) => { e.preventDefault(); if (name.trim() && !create.isPending) create.mutate(); }}>
          <Field label="Name"><input className="w-input" autoFocus value={name} maxLength={100} onChange={(e) => setName(e.target.value)} placeholder="e.g. Laptop · Claude Code" /></Field>
          <label className="mb-4 flex cursor-pointer items-center gap-2 text-[13px]">
            <input type="checkbox" className="accent-[var(--w-accent)]" checked={write} onChange={(e) => setWrite(e.target.checked)} /> Can make changes (otherwise read only)
          </label>
          {projects.length > 0 && (
            <fieldset className="mb-4">
              <legend className="w-label">Limit to projects</legend>
              <div className="flex flex-wrap gap-1.5">
                {projects.map((p) => (
                  <label key={p.id} className={cn('flex cursor-pointer items-center gap-1.5 rounded-[6px] border px-2 py-1 text-[12px]', scope.includes(p.id) ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border)]')}>
                    <input type="checkbox" className="accent-[var(--w-accent)]" checked={scope.includes(p.id)} onChange={(e) => setScope((xs) => (e.target.checked ? [...xs, p.id] : xs.filter((x) => x !== p.id)))} />
                    <span className="font-mono">{p.key}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-[12px] text-[var(--w-text-3)]">None ticked = every project the agent is in.</p>
            </fieldset>
          )}
          <Field label="Expires">
            <Select value={expiry} onChange={(e) => setExpiry(e.target.value)}>
              <option value="">Never</option><option value="30">30 days</option><option value="90">90 days</option><option value="365">1 year</option>
            </Select>
          </Field>
          <div className="flex justify-end gap-2">
            <button type="button" className="w-btn" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="w-btn w-btn-primary" disabled={!name.trim() || create.isPending}>{create.isPending && <Spinner size={12} />} Create token</button>
          </div>
        </form>
      </Dialog>
      <ConfirmDialog
        open={revoke !== null}
        onClose={() => setRevoke(null)}
        onConfirm={() => revoke !== null && del.mutate(revoke)}
        title="Revoke this token?"
        body="Anything using it is disconnected immediately. The agent keeps its other tokens."
        confirmLabel="Revoke"
        pending={del.isPending}
      />
    </Section>
  );
}

// ─── Webhook ─────────────────────────────────────────────────────

function WebhooksSection({ ws, agent }: { ws: WorkspaceDetail; agent: WorkAgent }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: agentKeys.webhooks(ws.id, agent.id), queryFn: () => agentsApi.webhooks(ws.id, agent.id) });
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState<string[]>([]);
  const [secret, setSecret] = useState<string | null>(null);
  const [del, setDel] = useState<AgentWebhook | null>(null);
  const inval = () => qc.invalidateQueries({ queryKey: agentKeys.webhooks(ws.id, agent.id) });
  const create = useMutation({
    mutationFn: () => agentsApi.createWebhook(ws.id, agent.id, { url: url.trim(), events }),
    onSuccess: (h) => { inval(); setOpen(false); setUrl(''); setEvents([]); setSecret(h.secret); },
    onError: (err) => toast.error(workError(err, 'Could not add the webhook')),
  });
  const toggle = useMutation({
    mutationFn: (h: AgentWebhook) => agentsApi.updateWebhook(ws.id, agent.id, h.id, { enabled: !h.enabled }),
    onSuccess: inval,
    onError: (err) => toast.error(workError(err, 'Could not update the webhook')),
  });
  const test = useMutation({
    mutationFn: (h: AgentWebhook) => agentsApi.testWebhook(ws.id, agent.id, h.id),
    onSuccess: (r) => (r.ok ? toast.success(`Ping delivered${r.status ? ` (HTTP ${r.status})` : ''}`) : toast.error(`Ping failed: ${r.error ?? 'unknown error'}`)),
    onError: (err) => toast.error(workError(err, 'Could not send the ping')),
  });
  const remove = useMutation({
    mutationFn: (h: AgentWebhook) => agentsApi.deleteWebhook(ws.id, agent.id, h.id),
    onSuccess: () => { inval(); setDel(null); },
    onError: (err) => toast.error(workError(err, 'Could not delete the webhook')),
  });
  const retired = agent.status === 'RETIRED';
  return (
    <Section
      title="Webhooks"
      description="CT Work POSTs signed JSON (HMAC-SHA256, header X-CTWork-Signature) when something happens to this agent. Only HTTPS on port 443, never private addresses. Payloads carry keys and titles — never issue text."
      action={!retired && <button type="button" className="w-btn w-btn-sm" onClick={() => setOpen(true)}><Plus size={13} /> Add webhook</button>}
    >
      {q.isLoading ? <Spinner /> : !q.data?.length ? (
        <p className="text-[13px] text-[var(--w-text-3)]">No webhooks. Agents that run in turns can poll instead (MCP tool <code className="font-mono">wait_events</code>).</p>
      ) : (
        <ul className="w-card divide-y divide-[var(--w-border)] overflow-hidden">
          {q.data.map((h) => (
            <li key={h.id} className="px-3 py-2.5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <Webhook size={14} className="shrink-0 text-[var(--w-text-3)]" />
                <span className="min-w-0 flex-1 truncate font-mono text-[12px]" title="URL is partly hidden">{maskUrl(h.url)}</span>
                <span className="text-[12px] text-[var(--w-text-2)]">{h.events.length ? `${h.events.length} event${h.events.length === 1 ? '' : 's'}` : 'All events'}</span>
                <Switch checked={h.enabled} disabled={toggle.isPending || retired} onChange={() => toggle.mutate(h)} label={h.enabled ? 'Disable webhook' : 'Enable webhook'} />
                <button type="button" className="w-btn w-btn-ghost w-btn-sm" disabled={test.isPending} onClick={() => test.mutate(h)}><Send size={12} /> Test</button>
                <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-danger w-btn-icon" aria-label="Delete webhook" onClick={() => setDel(h)}><Trash2 size={13} /></button>
              </div>
              <div className="mt-1 pl-[26px] text-[12px] text-[var(--w-text-3)]">
                {h.lastSentAt ? `Last delivered ${relativeTime(h.lastSentAt)}` : 'Nothing delivered yet'}
                {h.failCount > 0 && <span className="text-[var(--w-red)]"> · {h.failCount} failure{h.failCount === 1 ? '' : 's'} in a row</span>}
                {h.lastError && <span className="text-[var(--w-red)]"> · {h.lastError}</span>}
                {!h.enabled && h.failCount >= 20 && <span> · turned off after repeated failures</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
      <Dialog open={open} onClose={() => setOpen(false)} title="Add webhook" width={520}>
        <form onSubmit={(e) => { e.preventDefault(); if (url.trim() && !create.isPending) create.mutate(); }}>
          <Field label="URL" hint="Must be https:// on port 443. Redirects are not followed.">
            <input className="w-input font-mono !text-[12px]" autoFocus value={url} maxLength={600} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/ctwork-hook" />
          </Field>
          <fieldset className="mb-4">
            <legend className="w-label">Events</legend>
            <div className="grid gap-1 sm:grid-cols-2">
              {WEBHOOK_EVENT_OPTIONS.map((ev) => (
                <label key={ev} className="flex cursor-pointer items-center gap-2 text-[13px]">
                  <input type="checkbox" className="accent-[var(--w-accent)]" checked={events.includes(ev)} onChange={(e) => setEvents((xs) => (e.target.checked ? [...xs, ev] : xs.filter((x) => x !== ev)))} />
                  {INBOX_EVENT_LABEL[ev]}
                </label>
              ))}
            </div>
            <p className="mt-1 text-[12px] text-[var(--w-text-3)]">None ticked = all events.</p>
          </fieldset>
          <div className="flex justify-end gap-2">
            <button type="button" className="w-btn" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="w-btn w-btn-primary" disabled={!url.trim() || create.isPending}>{create.isPending && <Spinner size={12} />} Add webhook</button>
          </div>
        </form>
      </Dialog>
      <Dialog
        open={secret !== null}
        onClose={() => setSecret(null)}
        title="Webhook signing secret"
        width={500}
        dismissible={false}
        footer={<button type="button" className="w-btn w-btn-primary" onClick={() => setSecret(null)}>I’ve saved it</button>}
      >
        <p className="mb-2 text-[13px] text-[var(--w-text-2)]">Use it to verify <code className="font-mono">X-CTWork-Signature</code>. It is shown once.</p>
        <input className="w-input font-mono !text-[12px]" readOnly value={secret ?? ''} onFocus={(e) => e.currentTarget.select()} aria-label="Webhook secret" />
      </Dialog>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={() => del && remove.mutate(del)} title="Delete this webhook?" body="Pending deliveries to it are dropped." confirmLabel="Delete" pending={remove.isPending} />
    </Section>
  );
}

// ─── Hộp thư + lease ─────────────────────────────────────────────

function InboxSection({ ws, agent }: { ws: WorkspaceDetail; agent: WorkAgent }) {
  const q = useQuery({ queryKey: agentKeys.inbox(ws.id, agent.id), queryFn: () => agentsApi.inbox(ws.id, agent.id), refetchInterval: 30_000 });
  return (
    <Section title="Inbox" description="The 50 latest events the agent received (from SSE, polling or webhooks).">
      {q.isLoading ? <Spinner /> : !q.data?.length ? <p className="text-[13px] text-[var(--w-text-3)]">Nothing yet. Assign it an issue or @mention it in a comment.</p> : (
        <ol className="w-card max-h-[420px] divide-y divide-[var(--w-border)] overflow-y-auto" data-testid="agent-inbox">
          {q.data.map((r) => (
            <li key={r.id} className="flex items-start gap-3 px-3 py-2 text-[13px]">
              <Bell size={13} className={cn('mt-0.5 shrink-0', r.ackedAt ? 'text-[var(--w-text-3)]' : 'text-[var(--w-accent-text)]')} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2">
                  <span className="font-medium">{INBOX_EVENT_LABEL[r.type] ?? r.type}</span>
                  {r.payload.issue && <Link href={r.payload.issue.url} className="font-mono text-[12px] text-[var(--w-accent-text)] hover:underline">{r.payload.issue.key}</Link>}
                  <span className="text-[12px] text-[var(--w-text-3)]" title={new Date(r.createdAt).toLocaleString('en-US')}>{relativeTime(r.createdAt)}</span>
                </div>
                {r.payload.summary && <div className="truncate text-[12.5px] text-[var(--w-text-2)]">{r.payload.summary}</div>}
              </div>
              <span className={cn('shrink-0 text-[11px]', r.delivery === 'FAILED' ? 'text-[var(--w-red)]' : 'text-[var(--w-text-3)]')} title="Webhook delivery">
                {r.delivery === 'SKIPPED' ? '' : r.delivery.toLowerCase()}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}

function LeasesSection({ ws, agent }: { ws: WorkspaceDetail; agent: WorkAgent }) {
  const q = useQuery({ queryKey: agentKeys.leaseHistory(ws.id, agent.id), queryFn: () => agentsApi.leaseHistory(ws.id, agent.id), refetchInterval: 30_000 });
  return (
    <Section title="Working on" description="Issues the agent has claimed. A lease ends when the agent releases it, or expires when heartbeats stop (the issue is then flagged as blocked).">
      {q.isLoading ? <Spinner /> : !q.data?.length ? <p className="text-[13px] text-[var(--w-text-3)]">Nothing claimed yet.</p> : (
        <ul className="w-card divide-y divide-[var(--w-border)] overflow-hidden">
          {q.data.map((l) => (
            <li key={l.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 text-[13px]">
              <Activity size={13} className={cn('shrink-0', l.status === 'ACTIVE' ? 'text-[var(--w-accent-text)]' : l.status === 'EXPIRED' ? 'text-[var(--w-red)]' : 'text-[var(--w-text-3)]')} />
              {l.issue ? (
                <Link href={l.issue.url} className="flex min-w-0 flex-1 items-center gap-2 hover:underline">
                  <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{l.issue.key}</span>
                  <span className="truncate">{l.issue.title}</span>
                </Link>
              ) : <span className="flex-1 text-[var(--w-text-3)]">Deleted issue</span>}
              {l.status === 'ACTIVE' && l.progressPct !== null && <span className="text-[12px] tabular-nums text-[var(--w-text-2)]">{l.progressPct}%</span>}
              {l.progress && <span className="max-w-[260px] truncate text-[12px] text-[var(--w-text-3)]" title={l.progress}>{l.progress}</span>}
              <span className={cn('text-[12px]', l.status === 'EXPIRED' ? 'text-[var(--w-red)]' : 'text-[var(--w-text-3)]')}>
                {l.status === 'ACTIVE' ? `heartbeat ${relativeTime(l.heartbeatAt)}` : l.status === 'EXPIRED' ? `expired ${relativeTime(l.releasedAt ?? l.expiresAt)}` : `released ${relativeTime(l.releasedAt ?? l.heartbeatAt)}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

// ─── Trang ───────────────────────────────────────────────────────

export default function AgentDetail({ ws, agentId }: { ws: WorkspaceDetail; agentId: number }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: agentKeys.detail(ws.id, agentId), queryFn: () => agentsApi.get(ws.id, agentId) });
  const dash = useQuery({ queryKey: agentKeys.dashboard(ws.id, 7), queryFn: () => agentsApi.dashboard(ws.id, 7), retry: false, staleTime: 60_000 });
  const put = useAgentDirectory((s) => s.put);
  useEffect(() => { if (q.data) put([q.data]); }, [q.data, put]);
  const [edit, setEdit] = useState(false);
  const [retire, setRetire] = useState(false);
  const [issued, setIssued] = useState<IssuedAgentToken | null>(null);
  const status = useMutation({
    mutationFn: (a: 'pause' | 'resume' | 'retire') => agentsApi.setStatus(ws.id, agentId, a),
    onSuccess: (a, action) => {
      qc.setQueryData(agentKeys.detail(ws.id, agentId), a);
      qc.invalidateQueries({ queryKey: agentKeys.list(ws.id) });
      setRetire(false);
      toast.success(action === 'pause' ? 'Paused — it can still read, but every change is refused' : action === 'resume' ? 'Resumed' : 'Retired — tokens revoked, history kept');
    },
    onError: (err) => toast.error(workError(err, 'Could not change the agent status')),
  });
  const base = `/work/${ws.slug}/agents`;
  if (q.isLoading) return <PageLoading rows={5} />;
  if (q.error || !q.data) return <EmptyState title="Agent not found" body={workError(q.error, 'It may belong to another workspace.')} action={<Link href={base} className="w-btn">All agents</Link>} />;
  const a = q.data;
  const can = !!a.canManage;
  const cost7 = dash.data?.agents?.find((r) => r.agent.id === a.id)?.costUsd;
  return (
    <div className="mx-auto w-full max-w-[980px] px-4 py-6 md:px-6">
      <Link href={base} className="mb-4 inline-flex items-center gap-1 text-[12.5px] text-[var(--w-text-3)] hover:text-[var(--w-text)]"><ArrowLeft size={13} /> All agents</Link>

      <div className="w-card mb-6 p-4 md:p-5">
        <div className="flex flex-wrap items-start gap-4">
          <UserAvatar user={a.user} size={52} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-[18px] font-semibold tracking-[-0.01em]" data-testid="agent-name">{userName(a.user)}</h2>
              <AgentStatusPill status={a.status} />
            </div>
            <div className="mt-0.5 text-[13px] text-[var(--w-text-2)]">
              {a.runtime === 'BUILTIN' && <span className="mr-1.5 rounded-[4px] bg-[var(--w-accent-soft)] px-1.5 py-px text-[10.5px] font-semibold uppercase tracking-[0.03em] text-[var(--w-accent-text)]">Built-in · runs on CT Work</span>}
              {a.roleText || 'AI agent'} · <span className="font-mono text-[12px]">@{a.user.username}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[12.5px] text-[var(--w-text-2)]">
              Owner <UserAvatar user={a.owner} size={18} /> <span className="font-medium text-[var(--w-text)]">{userName(a.owner)}</span>
              <span className="text-[var(--w-text-3)]">· created {formatDate(a.createdAt)}</span>
            </div>
          </div>
          {can && a.status !== 'RETIRED' && (
            <div className="flex flex-wrap gap-2">
              <button type="button" className="w-btn w-btn-sm" onClick={() => setEdit(true)}><Pencil size={12} /> Edit</button>
              {a.status === 'ACTIVE' ? (
                <button type="button" className="w-btn w-btn-sm" disabled={status.isPending} onClick={() => status.mutate('pause')} data-testid="pause-agent"><Pause size={12} /> Pause</button>
              ) : (
                <button type="button" className="w-btn w-btn-sm" disabled={status.isPending} onClick={() => status.mutate('resume')}><Play size={12} /> Resume</button>
              )}
              <button type="button" className="w-btn w-btn-sm w-btn-danger" onClick={() => setRetire(true)}><Power size={12} /> Retire</button>
            </div>
          )}
        </div>
        {a.status === 'PAUSED' && (
          <p className="mt-3 rounded-[6px] bg-[color-mix(in_srgb,var(--w-orange)_10%,transparent)] px-3 py-2 text-[12.5px] text-[var(--w-text-2)]">Paused: its token still reads, but every change returns 423 until you resume it.</p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[var(--w-border)] pt-4 sm:grid-cols-5">
          <Stat label="Model" value={<span className="font-mono text-[13px]">{a.model}</span>} />
          <Stat label="Last seen" value={a.lastSeenAt ? relativeTime(a.lastSeenAt) : 'Never'} />
          <Stat label="Working on" value={`${a.activeLeases?.length ?? 0} / ${a.parallelSlots}`} hint="Active leases / issues it may hold at once" />
          <Stat label="Cost · 7 days" value={dash.data ? usd(cost7 ?? 0) : '—'} hint={a.runtime === 'BUILTIN' ? 'Measured by CT Work' : 'Self-reported by the agent (report_usage) unless measured by CT Work'} />
          <Stat label="Daily cap" value={a.dailyCostCapUsd === null ? (a.runtime === 'BUILTIN' ? usd(5) : 'Default') : usd(a.dailyCostCapUsd)} />
        </div>
        {!!a.projects?.length && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[12px]">
            <span className="text-[var(--w-text-3)]">Projects</span>
            {a.projects.map((p) => (
              <Link key={p.id} href={`/work/${ws.slug}/${p.key}/board`} className="rounded-[4px] bg-[var(--w-sunken)] px-1.5 py-0.5 font-mono text-[11.5px] hover:bg-[var(--w-hover)]" title={`${p.name} · ${p.role}`}>{p.key}</Link>
            ))}
          </div>
        )}
      </div>

      {a.runtime === 'BUILTIN' && <AgentRunsSection wsId={ws.id} agentId={a.id} canManage={can} />}
      <LeasesSection ws={ws} agent={a} />
      {can && a.runtime !== 'BUILTIN' && <TokensSection ws={ws} agent={a} onIssued={setIssued} />}
      {can && <WebhooksSection ws={ws} agent={a} />}
      {can && <InboxSection ws={ws} agent={a} />}
      {!can && <p className="mt-2 text-[12.5px] text-[var(--w-text-3)]">Only {userName(a.owner)} (its owner) and workspace admins can see its {a.runtime === 'BUILTIN' ? 'webhooks and inbox, or stop its runs' : 'tokens, webhooks and inbox'}.</p>}

      <EditDialog ws={ws} agent={a} open={edit} onClose={() => setEdit(false)} />
      <ConfirmDialog
        open={retire}
        onClose={() => setRetire(false)}
        onConfirm={() => status.mutate('retire')}
        title={`Retire ${userName(a.user)}?`}
        body="Its tokens are revoked, it leaves every project, its leases end and its webhooks stop. Issues, comments and work logs keep its name. This cannot be undone — create a new agent instead."
        confirmLabel="Retire agent"
        pending={status.isPending}
      />
      <TokenRevealDialog token={issued} agentName={userName(a.user)} onClose={() => setIssued(null)} />
    </div>
  );
}
