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
import { Dialog, EmptyState, Field, formatDate, publicOrigin, relativeTime, Spinner } from '@/components/work/ui';
import { ConfirmDialog, PageHeader, Section, Select } from '@/components/work/settings/shared';
import { copyText } from '@/components/work/settings/ProjectShare';
import { wt } from '@/components/work/i18n';

const TOKENS_KEY = ['work', 'me', 'api-tokens'] as const;

const EXPIRY = [
  { value: '', get label() { return wt('dev.never'); } },
  { value: '30', get label() { return wt('common.days', { count: 30 }); } },
  { value: '90', get label() { return wt('common.days', { count: 90 }); } },
  { value: '365', get label() { return wt('dev.oneYear'); } },
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
    onError: (err) => toast.error(workError(err, wt('dev.createFailed'))),
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
        title={wt('dev.copyNew')}
        width={540}
        dismissible={false}
        footer={<button type="button" className="w-btn w-btn-primary" onClick={onClose}>{copied ? wt('common.done') : wt('dev.saved')}</button>}
      >
        <div className="mb-3 flex gap-2 rounded-[6px] border border-[color-mix(in_srgb,var(--w-orange)_45%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_10%,transparent)] px-3 py-2.5 text-[13px] leading-relaxed">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[var(--w-orange)]" />
          <span>
            {wt('dev.copyNowA')}
            <span className="font-medium"> {wt('dev.copyNowB')}</span> {wt('dev.copyNowC')}
          </span>
        </div>
        <label className="w-label">{created.name}</label>
        <div className="flex gap-2">
          <input className="w-input min-w-0 flex-1 font-mono !text-[12px]" readOnly value={created.token} onFocus={(e) => e.currentTarget.select()} aria-label="API token" />
          <button type="button" className="w-btn w-btn-primary shrink-0" onClick={copy}>
            {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? wt('common.copied') : wt('common.copy')}
          </button>
        </div>
        <p className="mt-3 text-[12px] text-[var(--w-text-3)]">
          {created.scopes.includes('write') ? wt('dev.rw') : wt('dev.ro')} · {created.expiresAt ? wt('dev.expiresOn', { date: formatDate(created.expiresAt) }) : wt('dev.neverExpires')}
        </p>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} title={wt('dev.createTitle')} width={500}>
      <form onSubmit={(e) => { e.preventDefault(); if (name.trim() && !create.isPending) create.mutate(); }}>
        <Field label={wt('common.name')} hint={wt('dev.nameHint')}>
          <input className="w-input" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} autoFocus placeholder={wt('dev.tokenName')} />
        </Field>
        <div className="mb-4">
          <label className="w-label">{wt('create.access')}</label>
          <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
            {([
              { v: 'read', t: wt('dev.ro'), d: wt('dev.roDesc') },
              { v: 'write', t: wt('dev.rw'), d: wt('dev.rwDesc') },
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
        <Field label={wt('settings.expires')}>
          <Select value={expiry} onChange={(e) => setExpiry(e.target.value)}>
            {EXPIRY.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
          </Select>
        </Field>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button>
          <button type="submit" className="w-btn w-btn-primary" disabled={!name.trim() || create.isPending}>
            {create.isPending && <Spinner size={12} />} {wt('dev.createToken')}
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
    onSuccess: () => { toast.success(wt('dev.revoked')); setRevoking(null); qc.invalidateQueries({ queryKey: TOKENS_KEY }); },
    onError: (err) => toast.error(workError(err, wt('dev.revokeFailed'))),
  });

  if (q.isLoading) return <div className="flex justify-center py-10"><Spinner size={18} /></div>;
  if (q.error) return <EmptyState title={wt('dev.loadFailed')} body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>{wt('common.tryAgain')}</button>} />;
  const rows = q.data ?? [];
  if (!rows.length) {
    return (
      <div className="flex flex-col items-center rounded-[8px] border border-dashed border-[var(--w-border)] px-6 py-10 text-center">
        <KeyRound size={20} className="mb-2 text-[var(--w-text-3)]" />
        <div className="text-[13px] font-medium">{wt('dev.noTokens')}</div>
        <p className="mt-1 max-w-[380px] text-[12px] text-[var(--w-text-3)]">{wt('dev.noTokensBody')}</p>
        <button type="button" className="w-btn mt-4" onClick={onCreate}><Plus size={14} /> {wt('dev.createToken')}</button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
        <table className="w-full min-w-[680px] text-[13px]">
          <thead>
            <tr className="border-b border-[var(--w-border)] text-left text-[11px] uppercase tracking-wide text-[var(--w-text-3)]">
              <th className="px-3 py-2 font-medium">{wt('common.name')}</th>
              <th className="px-3 py-2 font-medium">{wt('create.access')}</th>
              <th className="px-3 py-2 font-medium">{wt('common.created')}</th>
              <th className="px-3 py-2 font-medium">{wt('dev.lastUsed')}</th>
              <th className="px-3 py-2 font-medium">{wt('settings.expires')}</th>
              <th className="px-3 py-2" aria-label={wt('common.actions')} />
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
                      {t.scopes.includes('write') ? wt('dev.rw') : wt('dev.ro')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-[var(--w-text-2)]">{formatDate(t.createdAt)}</td>
                  <td className="px-3 py-2 text-[var(--w-text-2)]">
                    {t.lastUsedAt ? (
                      <>
                        <div className="whitespace-nowrap">{relativeTime(t.lastUsedAt)}</div>
                        {t.lastUsedIp && <div className="font-mono text-[11px] text-[var(--w-text-3)]">{t.lastUsedIp}</div>}
                      </>
                    ) : <span className="text-[var(--w-text-3)]">{wt('dev.never')}</span>}
                  </td>
                  <td className={cn('whitespace-nowrap px-3 py-2', expired ? 'font-medium text-[var(--w-red)]' : 'text-[var(--w-text-2)]')}>
                    {t.expiresAt ? `${expired ? `${wt('dev.expired')} ` : ''}${formatDate(t.expiresAt)}` : wt('dev.never')}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button type="button" className="w-btn w-btn-sm w-btn-danger" onClick={() => setRevoking(t)}>{wt('settings.revoke')}</button>
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
        title={wt('dev.revokeQ')}
        body={wt('dev.revokeBody', { name: revoking?.name ?? '' })}
        confirmLabel={wt('dev.revokeToken')}
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
      {/* UX-A ARIA: khối cuộn ngang phải tới được bằng bàn phím. */}
      <pre tabIndex={0} className="overflow-x-auto rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5 pr-10 font-mono text-[12px] leading-relaxed text-[var(--w-text)]">
        <code>{children}</code>
      </pre>
      <button
        type="button"
        onClick={() => copyText(children, wt('dev.command'))}
        className="w-btn w-btn-ghost w-btn-icon w-btn-sm absolute right-1.5 top-1.5 !bg-[var(--w-panel)] opacity-80 hover:opacity-100"
        aria-label={wt('common.copy')}
        title={wt('common.copy')}
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
  useEffect(() => setBase(`${publicOrigin()}/api/v1/work`), []);

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

      {/* CTW-28 (A14): MCP — Claude Code / client MCP gọi CT Work bằng chính token này (quyền của bạn). */}
      <div className="border-t border-[var(--w-border)] pt-4" data-testid="developer-mcp">
        <div className="mb-1 flex items-baseline gap-2">
          <span className="font-mono text-[11px] font-bold text-[var(--w-accent-text)]">MCP</span>
          <code className="break-all font-mono text-[12.5px] font-medium text-[var(--w-text)]">{base}/mcp</code>
        </div>
        <p className="mb-2 text-[13px] text-[var(--w-text-2)]">
          Use CT Work from Claude Code or any MCP client: read issues, comment, move cards and log work with your own permissions.
          For an AI agent that works on its own, create it under <span className="font-medium">AI agents</span> in your workspace instead — it gets its own token and an owner.
        </p>
        <Code>{`claude mcp add --transport http ctwork ${base}/mcp \\\n  --header "Authorization: Bearer $CTW_TOKEN"`}</Code>
        <p className="mt-2 text-[12px] text-[var(--w-text-3)]">Clients that only speak stdio: <code className="font-mono">CTWORK_TOKEN=$CTW_TOKEN npx -y @cuongthai/ctwork-mcp</code>.</p>
      </div>

      <p className="text-[12px] leading-relaxed text-[var(--w-text-3)]">
        Every other endpoint the web app uses under <code className="font-mono">/api/v1/work</code> also accepts tokens, within the token’s access level.
        Creating, listing and revoking API tokens is only possible here on the website — requests to those endpoints made with a token are refused.
      </p>
    </div>
  );
}

// ─── Đợt 3C: cắm AI KHÁC (không phụ thuộc Claude) ────────────────

type ClientId = 'claude-code' | 'claude-desktop' | 'cursor' | 'gemini' | 'codex' | 'http';
const CLIENTS: Array<{ id: ClientId; name: string; where: string }> = [
  { id: 'cursor', name: 'Cursor', where: '~/.cursor/mcp.json (or .cursor/mcp.json in a project)' },
  { id: 'gemini', name: 'Gemini CLI', where: '~/.gemini/settings.json (or .gemini/settings.json in a project)' },
  { id: 'codex', name: 'Codex CLI', where: '~/.codex/config.toml' },
  { id: 'claude-desktop', name: 'Claude Desktop', where: 'Settings → Developer → Edit Config (claude_desktop_config.json)' },
  { id: 'claude-code', name: 'Claude Code', where: 'terminal' },
  { id: 'http', name: 'Any client / script', where: 'plain HTTP (JSON-RPC 2.0)' },
];

function clientConfig(id: ClientId, mcp: string): { lang: string; text: string; note: string } {
  switch (id) {
    case 'cursor':
      return {
        lang: 'json', note: 'Remote MCP over HTTP. Cursor reads ${env:CTW_TOKEN} from your environment — or paste the token instead.',
        text: JSON.stringify({ mcpServers: { ctwork: { url: mcp, headers: { Authorization: 'Bearer ${env:CTW_TOKEN}' } } } }, null, 2),
      };
    case 'gemini':
      return {
        lang: 'json', note: 'httpUrl = streamable HTTP. Gemini CLI expands $CTW_TOKEN from the environment. Check with /mcp inside gemini.',
        text: JSON.stringify({ mcpServers: { ctwork: { httpUrl: mcp, headers: { Authorization: 'Bearer $CTW_TOKEN' }, timeout: 90000 } } }, null, 2),
      };
    case 'codex':
      return {
        lang: 'toml', note: 'Codex starts the stdio bridge as a local server. Check with `codex mcp list`, then ask Codex to call fpt_unit_list.',
        text: `[mcp_servers.ctwork]\ncommand = "npx"\nargs = ["-y", "@cuongthai/ctwork-mcp"]\nenv = { CTWORK_TOKEN = "ctw_…", CTWORK_URL = "${mcp}" }`,
      };
    case 'claude-desktop':
      return {
        lang: 'json', note: 'Claude Desktop starts local (stdio) servers, so it uses the bridge. Restart Claude Desktop after saving.',
        text: JSON.stringify({ mcpServers: { ctwork: { command: 'npx', args: ['-y', '@cuongthai/ctwork-mcp'], env: { CTWORK_TOKEN: 'ctw_…', CTWORK_URL: mcp } } } }, null, 2),
      };
    case 'claude-code':
      return { lang: 'sh', note: 'Talks to the server directly (no bridge).', text: `claude mcp add --transport http ctwork ${mcp} \\\n  --header "Authorization: Bearer $CTW_TOKEN"` };
    case 'http':
    default:
      return {
        lang: 'sh', note: 'Stateless: one JSON-RPC message per POST, no session. 120 tool calls per minute per token.',
        text: `curl -s ${mcp} -H "Authorization: Bearer $CTW_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"fpt_unit_list","arguments":{"project":"FP"}}}'`,
      };
  }
}

/** Hướng dẫn cắm Cursor / Gemini CLI / Codex CLI / Claude Desktop — cùng một MCP server, cùng bộ lệnh với Ask AI. */
function McpClientsGuide() {
  const [base, setBase] = useState('https://your-domain/api/v1/work');
  useEffect(() => setBase(`${publicOrigin()}/api/v1/work`), []);
  const [client, setClient] = useState<ClientId>('cursor');
  const mcp = `${base}/mcp`;
  const cfg = clientConfig(client, mcp);
  const c = CLIENTS.find((x) => x.id === client)!;
  return (
    <div className="space-y-4" data-testid="mcp-clients-guide">
      <p className="text-[13px] leading-relaxed text-[var(--w-text-2)]">
        CT Work does not depend on one AI vendor. Any MCP client can read and update your projects with the same commands the in-app
        <span className="font-medium"> Ask AI</span> uses — issues, Docs, FPT test reports 5.1/5.2/5.3, Xray tests, meetings, RAID, weekly reports and download links.
        Use a <span className="font-medium">personal token</span> (above) to act as yourself, or an <span className="font-medium">AI agent token</span> (workspace → AI agents) for an agent with its own guardrails.
      </p>
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="MCP client">
        {CLIENTS.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={client === x.id}
            onClick={() => setClient(x.id)}
            className={cn('h-[28px] rounded-[6px] border px-2.5 text-[12.5px] font-medium', client === x.id ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}
            data-testid={`mcp-client-${x.id}`}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-label={c.name}>
        <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-[12.5px] text-[var(--w-text-2)]">Put this in <span className="font-mono text-[12px] text-[var(--w-text)]">{c.where}</span></span>
          <span className="font-mono text-[11px] uppercase text-[var(--w-text-3)]">{cfg.lang}</span>
        </div>
        <Code>{cfg.text}</Code>
        <p className="mt-2 text-[12px] leading-relaxed text-[var(--w-text-3)]">{cfg.note}</p>
      </div>
      <ul className="list-disc space-y-1 pl-5 text-[12.5px] leading-relaxed text-[var(--w-text-2)]">
        <li>Keep the token out of files you commit — store it in an environment variable (<code className="font-mono">CTW_TOKEN</code>) where the client supports it.</li>
        <li>Writes made through a person&apos;s token are yours; through an agent token they follow agent rules (no approving, deleting, settings, finance or clients; Done goes to review).</li>
        <li>The stdio bridge <code className="font-mono">@cuongthai/ctwork-mcp</code> has no dependencies (Node 18+). Until it is on npm, run it from the repo: <code className="font-mono">node packages/ctwork-mcp/bin/ctwork-mcp.js</code>.</li>
        <li>No AI subscription at all? Workspace → AI agents → <span className="font-medium">Built-in</span> agent runs on CT Work itself (Pro).</li>
      </ul>
    </div>
  );
}

// ─── Trang ───────────────────────────────────────────────────────

export default function DeveloperPage() {
  const [creating, setCreating] = useState(false);
  return (
    <div className="flex h-full flex-col">
      <PageHeader title="API tokens" sub={wt('dev.developer')} />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-[960px] px-4 py-6 md:px-6">
          <Section
            title="API tokens"
            description={
              <>
                {wt('dev.introA')}{' '}
                {wt('dev.introB')} <code className="rounded-[4px] bg-[var(--w-sunken)] px-1 font-mono text-[12px] text-[var(--w-text)]">Authorization: Bearer &lt;token&gt;</code>.
                {' '}{wt('dev.introC')}
              </>
            }
            action={<button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setCreating(true)}><Plus size={14} /> {wt('dev.createToken')}</button>}
          >
            <TokenList onCreate={() => setCreating(true)} />
          </Section>
          <Section title={wt('dev.mcpTitle')} description={wt('dev.mcpDesc')}>
            <McpClientsGuide />
          </Section>
          <Section title={wt('dev.restTitle')} description={wt('dev.restDesc')}>
            <ApiReference />
          </Section>
        </div>
      </div>
      <CreateTokenDialog open={creating} onClose={() => setCreating(false)} />
    </div>
  );
}
