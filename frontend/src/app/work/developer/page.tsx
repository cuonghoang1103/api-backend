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
          <input className="w-input min-w-0 flex-1 font-mono !text-[12px]" readOnly value={created.token} onFocus={(e) => e.currentTarget.select()} aria-label={wt('dev.apiTokenAria')} />
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
    method: 'GET', path: '/workspaces', get title() { return wt('dev.ep1'); },
    curl: (b) => `curl ${H} \\\n  ${b}/workspaces`,
  },
  {
    method: 'GET', path: '/workspaces/{workspaceId}/projects', get title() { return wt('dev.ep2'); },
    curl: (b) => `curl ${H} \\\n  ${b}/workspaces/12/projects`,
  },
  {
    method: 'GET', path: '/resolve/{workspaceSlug}/{projectKey}', get title() { return wt('dev.ep3'); },
    curl: (b) => `curl ${H} \\\n  ${b}/resolve/acme/SHOP`,
  },
  {
    method: 'GET', path: '/projects/{projectId}', get title() { return wt('dev.ep4'); },
    curl: (b) => `curl ${H} \\\n  ${b}/projects/42`,
  },
  {
    method: 'GET', path: '/projects/{projectId}/search?jql=…&limit=&offset=', get title() { return wt('dev.ep5'); },
    curl: (b) => `curl -G ${H} \\\n  --data-urlencode 'jql=status != Done AND assignee = currentUser() ORDER BY priority' \\\n  ${b}/projects/42/search`,
  },
  {
    method: 'GET', path: '/projects/{projectId}/issues/{number}', get title() { return wt('dev.ep6'); },
    curl: (b) => `curl ${H} \\\n  ${b}/projects/42/issues/128`,
  },
  {
    method: 'POST', path: '/projects/{projectId}/issues', get title() { return wt('dev.ep7'); },
    get body() { return wt('dev.ep12'); },
    curl: (b) => `curl -X POST ${H} ${J} \\\n  -d '{"typeId": 3, "title": "Checkout fails on Safari", "priority": 2, "assigneeId": 7}' \\\n  ${b}/projects/42/issues`,
  },
  {
    method: 'PATCH', path: '/projects/{projectId}/issues/{number}', get title() { return wt('dev.ep8'); },
    curl: (b) => `curl -X PATCH ${H} ${J} \\\n  -d '{"statusId": 5, "storyPoints": 3}' \\\n  ${b}/projects/42/issues/128`,
  },
  {
    method: 'POST', path: '/projects/{projectId}/issues/{number}/comments', get title() { return wt('dev.ep9'); },
    curl: (b) => `curl -X POST ${H} ${J} \\\n  -d '{"bodyJson": {"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Deployed to staging."}]}]}}' \\\n  ${b}/projects/42/issues/128/comments`,
  },
  {
    method: 'POST', path: '/projects/{projectId}/issues/{number}/worklogs', get title() { return wt('dev.ep10'); },
    curl: (b) => `curl -X POST ${H} ${J} \\\n  -d '{"minutes": 90, "note": "Pairing on the payment bug"}' \\\n  ${b}/projects/42/issues/128/worklogs`,
  },
  {
    method: 'GET', path: '/projects/{projectId}/export?format=csv&jql=…', get title() { return wt('dev.ep11'); },
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
          {wt('dev.baseUrl')} <code className="rounded-[4px] bg-[var(--w-sunken)] px-1.5 py-0.5 font-mono text-[12px] text-[var(--w-text)]">{base}</code>.
          {wt('dev.sendToken')} <code className="font-mono text-[12px] text-[var(--w-text)]">Authorization</code>{wt('dev.sendTokenB')}
          {wt('dev.examplesEnv')}
        </p>
        <Code>{'export CTW_TOKEN="ctw_xxxxxxxx_…"'}</Code>
        <p>
          {wt('dev.respShape')} <code className="font-mono text-[12px] text-[var(--w-text)]">{'{ "success": true, "data": … }'}</code>{wt('dev.errorsUse')}
          {wt('dev.errorCodes')}{' '}
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
            {e.body && <p className="mb-2 text-[12px] text-[var(--w-text-3)]"><span className="font-medium text-[var(--w-text-2)]">{wt('dev.bodyFields')}</span> {e.body}</p>}
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
          {wt('dev.mcpUse')}
          {wt('dev.mcpAgentA')} <span className="font-medium">{wt('pages.aiAgents')}</span> {wt('dev.mcpAgentB')}
        </p>
        <Code>{`claude mcp add --transport http ctwork ${base}/mcp \\\n  --header "Authorization: Bearer $CTW_TOKEN"`}</Code>
        <p className="mt-2 text-[12px] text-[var(--w-text-3)]">{wt('dev.stdioOnly')} <code className="font-mono">CTWORK_TOKEN=$CTW_TOKEN npx -y @cuongthai/ctwork-mcp</code>.</p>
      </div>

      <p className="text-[12px] leading-relaxed text-[var(--w-text-3)]">
        {wt('dev.everyOther')} <code className="font-mono">/api/v1/work</code> {wt('dev.everyOtherB')}
        {wt('dev.onlyWebsite')}
      </p>
    </div>
  );
}

// ─── Đợt 3C: cắm AI KHÁC (không phụ thuộc Claude) ────────────────

type ClientId = 'claude-code' | 'claude-desktop' | 'cursor' | 'gemini' | 'codex' | 'http';
const CLIENTS: Array<{ id: ClientId; name: string; where: string }> = [
  { id: 'cursor', name: 'Cursor', get where() { return wt('dev.wCursor'); } },
  { id: 'gemini', name: 'Gemini CLI', get where() { return wt('dev.wGemini'); } },
  { id: 'codex', name: 'Codex CLI', where: '~/.codex/config.toml' },
  { id: 'claude-desktop', name: 'Claude Desktop', where: 'Settings → Developer → Edit Config (claude_desktop_config.json)' },
  { id: 'claude-code', name: 'Claude Code', where: 'terminal' },
  { id: 'http', get name() { return wt('dev.nAny'); }, get where() { return wt('dev.wPlain'); } },
];

function clientConfig(id: ClientId, mcp: string): { lang: string; text: string; note: string } {
  switch (id) {
    case 'cursor':
      return {
        lang: 'json', note: wt('dev.note13'),
        text: JSON.stringify({ mcpServers: { ctwork: { url: mcp, headers: { Authorization: 'Bearer ${env:CTW_TOKEN}' } } } }, null, 2),
      };
    case 'gemini':
      return {
        lang: 'json', note: wt('dev.note14'),
        text: JSON.stringify({ mcpServers: { ctwork: { httpUrl: mcp, headers: { Authorization: 'Bearer $CTW_TOKEN' }, timeout: 90000 } } }, null, 2),
      };
    case 'codex':
      return {
        lang: 'toml', note: wt('dev.note15'),
        text: `[mcp_servers.ctwork]\ncommand = "npx"\nargs = ["-y", "@cuongthai/ctwork-mcp"]\nenv = { CTWORK_TOKEN = "ctw_…", CTWORK_URL = "${mcp}" }`,
      };
    case 'claude-desktop':
      return {
        lang: 'json', note: wt('dev.note16'),
        text: JSON.stringify({ mcpServers: { ctwork: { command: 'npx', args: ['-y', '@cuongthai/ctwork-mcp'], env: { CTWORK_TOKEN: 'ctw_…', CTWORK_URL: mcp } } } }, null, 2),
      };
    case 'claude-code':
      return { lang: 'sh', note: wt('dev.note17'), text: `claude mcp add --transport http ctwork ${mcp} \\\n  --header "Authorization: Bearer $CTW_TOKEN"` };
    case 'http':
    default:
      return {
        lang: 'sh', note: wt('dev.note18'),
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
        {wt('dev.vendorA')}
        <span className="font-medium"> Ask AI</span> {wt('dev.vendorB')}
        {wt('dev.useA')} <span className="font-medium">{wt('dev.personalToken')}</span> {wt('dev.useB')} <span className="font-medium">{wt('dev.agentToken')}</span> {wt('dev.useC')}
      </p>
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={wt('dev.mcpClient')}>
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
          <span className="text-[12.5px] text-[var(--w-text-2)]">{wt('dev.putThis')} <span className="font-mono text-[12px] text-[var(--w-text)]">{c.where}</span></span>
          <span className="font-mono text-[11px] uppercase text-[var(--w-text-3)]">{cfg.lang}</span>
        </div>
        <Code>{cfg.text}</Code>
        <p className="mt-2 text-[12px] leading-relaxed text-[var(--w-text-3)]">{cfg.note}</p>
      </div>
      <ul className="list-disc space-y-1 pl-5 text-[12.5px] leading-relaxed text-[var(--w-text-2)]">
        <li>{wt('dev.keepOut')}<code className="font-mono">CTW_TOKEN</code>{wt('dev.keepOutB')}</li>
        <li>{wt('dev.writesAre')}</li>
        <li>{wt('dev.bridgeA')} <code className="font-mono">@cuongthai/ctwork-mcp</code> {wt('dev.bridgeB')} <code className="font-mono">node packages/ctwork-mcp/bin/ctwork-mcp.js</code>.</li>
        <li>{wt('dev.noSub')} <span className="font-medium">Built-in</span> {wt('dev.noSubB')}</li>
      </ul>
    </div>
  );
}

// ─── Trang ───────────────────────────────────────────────────────

export default function DeveloperPage() {
  const [creating, setCreating] = useState(false);
  return (
    <div className="flex h-full flex-col">
      <PageHeader title={wt('dev.apiTokens')} sub={wt('dev.developer')} />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-[960px] px-4 py-6 md:px-6">
          <Section
            title={wt('dev.apiTokens')}
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
