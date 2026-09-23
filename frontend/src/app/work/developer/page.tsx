'use client';

/**
 * /work/developer — API token cá nhân (kiểu Jira API token) + tài liệu REST
 * ngắn gọn. Token chỉ hiện MỘT lần lúc tạo (backend chỉ giữ hash).
 * Quản lý token chỉ làm được trên web: backend chặn /me/api-tokens khi gọi bằng token.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, Check, Copy, KeyRound, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, type ApiToken, type TokenScope } from '@/lib/work-api';
import { Dialog, EmptyState, Field, formatDate, relativeTime, Spinner } from '@/components/work/ui';
import { ConfirmDialog, PageHeader, Section, Select } from '@/components/work/settings/shared';
import { copyText } from '@/components/work/settings/ProjectShare';

const TOKENS_KEY = ['work', 'me', 'api-tokens'] as const;

const EXPIRY = [
  { value: '', label: 'Never' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
  { value: '365', label: '1 year' },
];

// ─── Tạo token ───────────────────────────────────────────────────

function CreateTokenDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [scope, setScope] = useState<'read' | 'write'>('read');
  const [expiry, setExpiry] = useState('90');
  const [created, setCreated] = useState<(ApiToken & { token: string }) | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(''); setScope('read'); setExpiry('90'); setCreated(null); setCopied(false);
  }, [open]);

  const create = useMutation({
    mutationFn: () => workApi.createApiToken({
      name: name.trim(),
      scopes: (scope === 'write' ? ['read', 'write'] : ['read']) as TokenScope[],
      expiresInDays: expiry ? Number(expiry) : null,
    }),
    onSuccess: (t) => { setCreated(t); qc.invalidateQueries({ queryKey: TOKENS_KEY }); },
    onError: (err) => toast.error(workError(err, 'Could not create the token')),
  });

  const copy = async () => {
    if (!created) return;
    await copyText(created.token, 'Token');
    setCopied(true);
  };

  if (created) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        title="Copy your new API token"
        width={540}
        dismissible={false}
        footer={<button type="button" className="w-btn w-btn-primary" onClick={onClose}>{copied ? 'Done' : 'I’ve saved it'}</button>}
      >
        <div className="mb-3 flex gap-2 rounded-[6px] border border-[color-mix(in_srgb,var(--w-orange)_45%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_10%,transparent)] px-3 py-2.5 text-[13px] leading-relaxed">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[var(--w-orange)]" />
          <span>
            Copy this token now and store it somewhere safe, like a password manager or your CI secrets.
            <span className="font-medium"> For security it will never be shown again.</span> If you lose it, revoke it and create a new one.
          </span>
        </div>
        <label className="w-label">{created.name}</label>
        <div className="flex gap-2">
          <input className="w-input min-w-0 flex-1 font-mono !text-[12px]" readOnly value={created.token} onFocus={(e) => e.currentTarget.select()} aria-label="API token" />
          <button type="button" className="w-btn w-btn-primary shrink-0" onClick={copy}>
            {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="mt-3 text-[12px] text-[var(--w-text-3)]">
          {created.scopes.includes('write') ? 'Read & write' : 'Read only'} · {created.expiresAt ? `expires ${formatDate(created.expiresAt)}` : 'never expires'}
        </p>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} title="Create API token" width={500}>
      <form onSubmit={(e) => { e.preventDefault(); if (name.trim() && !create.isPending) create.mutate(); }}>
        <Field label="Name" hint="Something that tells you where it’s used — e.g. “GitHub Actions” or “Sprint report script”.">
          <input className="w-input" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} autoFocus placeholder="Token name" />
        </Field>
        <div className="mb-4">
          <label className="w-label">Access</label>
          <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
            {([
              { v: 'read', t: 'Read only', d: 'View workspaces, projects, issues, search and export. Any change is rejected.' },
              { v: 'write', t: 'Read & write', d: 'Also create and update issues, comment and log work — anything your account is allowed to do.' },
            ] as const).map((o) => (
              <label key={o.v} className={cn('flex cursor-pointer items-start gap-2.5 border-b border-[var(--w-border)] px-3 py-2.5 last:border-b-0', scope === o.v ? 'bg-[var(--w-accent-soft)]' : 'hover:bg-[var(--w-hover)]')}>
                <input type="radio" name="scope" className="mt-0.5 accent-[var(--w-accent)]" checked={scope === o.v} onChange={() => setScope(o.v)} />
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium">{o.t}</span>
                  <span className="block text-[12px] text-[var(--w-text-2)]">{o.d}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
        <Field label="Expires">
          <Select value={expiry} onChange={(e) => setExpiry(e.target.value)}>
            {EXPIRY.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
          </Select>
        </Field>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="w-btn w-btn-primary" disabled={!name.trim() || create.isPending}>
            {create.isPending && <Spinner size={12} />} Create token
          </button>
        </div>
      </form>
    </Dialog>
  );
}

// ─── Danh sách token ─────────────────────────────────────────────

function TokenList({ onCreate }: { onCreate: () => void }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: TOKENS_KEY, queryFn: workApi.apiTokens });
  const [revoking, setRevoking] = useState<ApiToken | null>(null);
  const revoke = useMutation({
    mutationFn: (id: number) => workApi.revokeApiToken(id),
    onSuccess: () => { toast.success('Token revoked'); setRevoking(null); qc.invalidateQueries({ queryKey: TOKENS_KEY }); },
    onError: (err) => toast.error(workError(err, 'Could not revoke the token')),
  });

  if (q.isLoading) return <div className="flex justify-center py-10"><Spinner size={18} /></div>;
  if (q.error) return <EmptyState title="Could not load your tokens" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />;
  const rows = q.data ?? [];
  if (!rows.length) {
    return (
      <div className="flex flex-col items-center rounded-[8px] border border-dashed border-[var(--w-border)] px-6 py-10 text-center">
        <KeyRound size={20} className="mb-2 text-[var(--w-text-3)]" />
        <div className="text-[13px] font-medium">No API tokens yet</div>
        <p className="mt-1 max-w-[380px] text-[12px] text-[var(--w-text-3)]">Create a token to call the CT Work API from scripts, CI pipelines or other tools.</p>
        <button type="button" className="w-btn mt-4" onClick={onCreate}><Plus size={14} /> Create token</button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
        <table className="w-full min-w-[680px] text-[13px]">
          <thead>
            <tr className="border-b border-[var(--w-border)] text-left text-[11px] uppercase tracking-wide text-[var(--w-text-3)]">
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Access</th>
              <th className="px-3 py-2 font-medium">Created</th>
              <th className="px-3 py-2 font-medium">Last used</th>
              <th className="px-3 py-2 font-medium">Expires</th>
              <th className="px-3 py-2" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => {
              const expired = !!t.expiresAt && new Date(t.expiresAt).getTime() < Date.now();
              return (
                <tr key={t.id} className="border-b border-[var(--w-border)] last:border-0">
                  <td className="px-3 py-2">
                    <div className="font-medium">{t.name}</div>
                    <div className="font-mono text-[11px] text-[var(--w-text-3)]">ctw_{t.prefix}_…</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <span className={cn(
                      'rounded-[4px] border px-1.5 text-[11px] font-medium leading-[18px]',
                      t.scopes.includes('write') ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border-strong)] text-[var(--w-text-2)]',
                    )}>
                      {t.scopes.includes('write') ? 'Read & write' : 'Read only'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-[var(--w-text-2)]">{formatDate(t.createdAt)}</td>
                  <td className="px-3 py-2 text-[var(--w-text-2)]">
                    {t.lastUsedAt ? (
                      <>
                        <div className="whitespace-nowrap">{relativeTime(t.lastUsedAt)}</div>
                        {t.lastUsedIp && <div className="font-mono text-[11px] text-[var(--w-text-3)]">{t.lastUsedIp}</div>}
                      </>
                    ) : <span className="text-[var(--w-text-3)]">Never</span>}
                  </td>
                  <td className={cn('whitespace-nowrap px-3 py-2', expired ? 'font-medium text-[var(--w-red)]' : 'text-[var(--w-text-2)]')}>
                    {t.expiresAt ? `${expired ? 'Expired ' : ''}${formatDate(t.expiresAt)}` : 'Never'}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button type="button" className="w-btn w-btn-sm w-btn-danger" onClick={() => setRevoking(t)}>Revoke</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={!!revoking}
        onClose={() => setRevoking(null)}
        title="Revoke API token?"
        body={<>Scripts and integrations using <span className="font-medium text-[var(--w-text)]">{revoking?.name}</span> will stop working immediately. This can&apos;t be undone.</>}
        confirmLabel="Revoke token"
        pending={revoke.isPending}
        onConfirm={() => revoking && revoke.mutate(revoking.id)}
      />
    </>
  );
}

// ─── Tài liệu REST ───────────────────────────────────────────────

function Code({ children }: { children: string }) {
  return (
    <div className="group relative">
      <pre className="overflow-x-auto rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5 pr-10 font-mono text-[12px] leading-relaxed text-[var(--w-text)]">
        <code>{children}</code>
      </pre>
      <button
        type="button"
        onClick={() => copyText(children, 'Command')}
        className="w-btn w-btn-ghost w-btn-icon w-btn-sm absolute right-1.5 top-1.5 !bg-[var(--w-panel)] opacity-80 hover:opacity-100"
        aria-label="Copy"
        title="Copy"
      >
        <Copy size={12} />
      </button>
    </div>
  );
}

const METHOD_COLOR: Record<string, string> = {
  GET: 'var(--w-green)', POST: 'var(--w-accent-text)', PATCH: 'var(--w-orange)', DELETE: 'var(--w-red)',
};

interface Endpoint { method: 'GET' | 'POST' | 'PATCH'; path: string; title: string; body?: string; curl: (base: string) => string }

const H = '-H "Authorization: Bearer $CTW_TOKEN"';
const J = '-H "Content-Type: application/json"';

const ENDPOINTS: Endpoint[] = [
  {
    method: 'GET', path: '/workspaces', title: 'List the workspaces you belong to.',
    curl: (b) => `curl ${H} \\\n  ${b}/workspaces`,
  },
  {
    method: 'GET', path: '/workspaces/{workspaceId}/projects', title: 'List projects in a workspace (each has an id and a key).',
    curl: (b) => `curl ${H} \\\n  ${b}/workspaces/12/projects`,
  },
  {
    method: 'GET', path: '/resolve/{workspaceSlug}/{projectKey}', title: 'Turn a web URL such as /work/acme/SHOP into a project id. Returns { projectId }.',
    curl: (b) => `curl ${H} \\\n  ${b}/resolve/acme/SHOP`,
  },
  {
    method: 'GET', path: '/projects/{projectId}', title: 'Project configuration: workflows and status ids, issue types, sprints, labels, members.',
    curl: (b) => `curl ${H} \\\n  ${b}/projects/42`,
  },
  {
    method: 'GET', path: '/projects/{projectId}/search?jql=…&limit=&offset=', title: 'Search issues with JQL. Returns { total, items, offset, limit }; limit is at most 500.',
    curl: (b) => `curl -G ${H} \\\n  --data-urlencode 'jql=status != Done AND assignee = currentUser() ORDER BY priority' \\\n  ${b}/projects/42/search`,
  },
  {
    method: 'GET', path: '/projects/{projectId}/issues/{number}', title: 'Get one issue by its number (SHOP-128 → 128), with fields, sub-tasks and links.',
    curl: (b) => `curl ${H} \\\n  ${b}/projects/42/issues/128`,
  },
  {
    method: 'POST', path: '/projects/{projectId}/issues', title: 'Create an issue. typeId and title are required; take ids from the project configuration.',
    body: 'typeId, title, priority (1 Highest … 5 Lowest), assigneeId, statusId, sprintId, parentId, storyPoints, dueDate (YYYY-MM-DD), labelIds',
    curl: (b) => `curl -X POST ${H} ${J} \\\n  -d '{"typeId": 3, "title": "Checkout fails on Safari", "priority": 2, "assigneeId": 7}' \\\n  ${b}/projects/42/issues`,
  },
  {
    method: 'PATCH', path: '/projects/{projectId}/issues/{number}', title: 'Update any subset of fields. Send "version" from the last read to avoid overwriting someone else’s change (409 on conflict).',
    curl: (b) => `curl -X PATCH ${H} ${J} \\\n  -d '{"statusId": 5, "storyPoints": 3}' \\\n  ${b}/projects/42/issues/128`,
  },
  {
    method: 'POST', path: '/projects/{projectId}/issues/{number}/comments', title: 'Add a comment. The body is a rich-text document (TipTap/ProseMirror JSON) in bodyJson.',
    curl: (b) => `curl -X POST ${H} ${J} \\\n  -d '{"bodyJson": {"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Deployed to staging."}]}]}}' \\\n  ${b}/projects/42/issues/128/comments`,
  },
  {
    method: 'POST', path: '/projects/{projectId}/issues/{number}/worklogs', title: 'Log work in minutes (1–1440). Optional: startedAt (ISO date-time), note, remaining ("auto", "keep" or minutes).',
    curl: (b) => `curl -X POST ${H} ${J} \\\n  -d '{"minutes": 90, "note": "Pairing on the payment bug"}' \\\n  ${b}/projects/42/issues/128/worklogs`,
  },
  {
    method: 'GET', path: '/projects/{projectId}/export?format=csv&jql=…', title: 'Download issues as csv, xlsx or pdf, optionally filtered by JQL.',
    curl: (b) => `curl -G ${H} -o issues.csv \\\n  --data-urlencode 'format=csv' --data-urlencode 'jql=sprint in openSprints()' \\\n  ${b}/projects/42/export`,
  },
];

function ApiReference() {
  // Địa chỉ thật của trang đang chạy — đọc sau khi mount để không lệch SSR.
  const [base, setBase] = useState('https://your-domain/api/v1/work');
  useEffect(() => setBase(`${window.location.origin}/api/v1/work`), []);

  return (
    <div className="space-y-6">
      <div className="space-y-3 text-[13px] leading-relaxed text-[var(--w-text-2)]">
        <p>
          Base URL: <code className="rounded-[4px] bg-[var(--w-sunken)] px-1.5 py-0.5 font-mono text-[12px] text-[var(--w-text)]">{base}</code>.
          Send your token in the <code className="font-mono text-[12px] text-[var(--w-text)]">Authorization</code> header on every request.
          Examples below assume it is stored in an environment variable:
        </p>
        <Code>{'export CTW_TOKEN="ctw_xxxxxxxx_…"'}</Code>
        <p>
          Successful responses are JSON shaped <code className="font-mono text-[12px] text-[var(--w-text)]">{'{ "success": true, "data": … }'}</code>. Errors use the HTTP status
          (400 invalid input, 401 missing or revoked token, 403 not allowed or read-only token, 404 not found, 409 conflict, 429 rate limited) with a body like{' '}
          <code className="font-mono text-[12px] text-[var(--w-text)]">{'{ "success": false, "message": "…", "code": "…" }'}</code>.
        </p>
      </div>

      <div className="space-y-5">
        {ENDPOINTS.map((e) => (
          <div key={`${e.method} ${e.path}`} className="border-t border-[var(--w-border)] pt-4 first:border-t-0 first:pt-0">
            <div className="mb-1 flex min-w-0 flex-wrap items-baseline gap-x-2">
              <span className="font-mono text-[11px] font-bold" style={{ color: METHOD_COLOR[e.method] }}>{e.method}</span>
              <code className="break-all font-mono text-[12.5px] font-medium text-[var(--w-text)]">{e.path}</code>
            </div>
            <p className="mb-2 text-[13px] text-[var(--w-text-2)]">{e.title}</p>
            {e.body && <p className="mb-2 text-[12px] text-[var(--w-text-3)]"><span className="font-medium text-[var(--w-text-2)]">Body fields:</span> {e.body}</p>}
            <Code>{e.curl(base)}</Code>
          </div>
        ))}
      </div>

      <p className="text-[12px] leading-relaxed text-[var(--w-text-3)]">
        Every other endpoint the web app uses under <code className="font-mono">/api/v1/work</code> also accepts tokens, within the token’s access level.
        Creating, listing and revoking API tokens is only possible here on the website — requests to those endpoints made with a token are refused.
      </p>
    </div>
  );
}

// ─── Trang ───────────────────────────────────────────────────────

export default function DeveloperPage() {
  const [creating, setCreating] = useState(false);
  return (
    <div className="flex h-full flex-col">
      <PageHeader title="API tokens" sub="Developer" />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-[960px] px-4 py-6 md:px-6">
          <Section
            title="API tokens"
            description={
              <>
                Use personal API tokens to connect scripts, CI pipelines and other tools to CT Work — like API tokens in Jira.
                Send one as <code className="rounded-[4px] bg-[var(--w-sunken)] px-1 font-mono text-[12px] text-[var(--w-text)]">Authorization: Bearer &lt;token&gt;</code>.
                A token acts as you, with exactly your permissions in each workspace and project; a read-only token can never change anything.
                Treat tokens like passwords and revoke any you no longer use.
              </>
            }
            action={<button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setCreating(true)}><Plus size={14} /> Create token</button>}
          >
            <TokenList onCreate={() => setCreating(true)} />
          </Section>
          <Section title="REST API reference" description="The most useful endpoints for automation. Ids come from the responses — for example a project's issue types and statuses from the project configuration.">
            <ApiReference />
          </Section>
        </div>
      </div>
      <CreateTokenDialog open={creating} onClose={() => setCreating(false)} />
    </div>
  );
}
