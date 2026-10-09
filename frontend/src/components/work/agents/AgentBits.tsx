'use client';

/** CTW-28 A14 — mảnh nhỏ dùng chung cho trang agent: nhãn trạng thái, khối lệnh có nút chép, hộp hiện token MỘT lần. */

import { useState, type ReactNode } from 'react';
import { AlertTriangle, Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mcpAddCommand, type AgentStatus, type IssuedAgentToken } from '@/lib/work-agents-api';
import { copyText } from '../settings/ProjectShare';
import { Dialog, formatDate, publicOrigin } from '../ui';
import { wt } from '@/components/work/i18n';

export function AgentStatusPill({ status, className }: { status: AgentStatus; className?: string }) {
  const tone = status === 'ACTIVE'
    ? 'bg-[color-mix(in_srgb,var(--w-green)_14%,transparent)] text-[var(--w-green)]'
    : status === 'PAUSED'
      ? 'bg-[color-mix(in_srgb,var(--w-orange)_14%,transparent)] text-[var(--w-orange)]'
      : 'bg-[var(--w-sunken)] text-[var(--w-text-3)]';
  return (
    <span className={cn('inline-flex h-[20px] shrink-0 items-center gap-1 rounded-full px-2 text-[11.5px] font-medium', tone, className)} data-testid="agent-status">
      <span className={cn('h-1.5 w-1.5 rounded-full', status === 'ACTIVE' ? 'bg-[var(--w-green)]' : status === 'PAUSED' ? 'bg-[var(--w-orange)]' : 'bg-[var(--w-text-3)]')} />
      {status === 'ACTIVE' ? wt('agents.active') : status === 'PAUSED' ? wt('fields.paused') : wt('fields.retired')}
    </span>
  );
}

export function CodeBlock({ children, label = wt('dev.command'), secret }: { children: string; label?: string; secret?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative">
      <pre className={cn('overflow-x-auto rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5 pr-11 font-mono text-[12px] leading-relaxed text-[var(--w-text)]', secret && 'select-all')}>
        <code>{children}</code>
      </pre>
      <button
        type="button"
        onClick={async () => { await copyText(children, label); setCopied(true); }}
        className="w-btn w-btn-ghost w-btn-icon w-btn-sm absolute right-1.5 top-1.5 !bg-[var(--w-panel)] opacity-90 hover:opacity-100"
        aria-label={wt('agents.copyX', { x: label.toLowerCase() })}
        title={wt('common.copy')}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="min-w-0" title={hint}>
      <div className="truncate text-[11.5px] font-medium text-[var(--w-text-3)]">{label}</div>
      <div className="mt-0.5 truncate text-[14px] font-semibold tabular-nums">{value}</div>
    </div>
  );
}

export const usd = (n: number | null | undefined) => (n === null || n === undefined ? '—' : n >= 100 ? `$${n.toFixed(0)}` : n >= 1 ? `$${n.toFixed(2)}` : `$${n.toFixed(n === 0 ? 0 : 3)}`);
export const tokensFmt = (n: number | null | undefined) => (n === null || n === undefined ? '—' : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : String(n));

/**
 * Token agent vừa cấp — hiện ĐÚNG MỘT LẦN kèm lệnh `claude mcp add`. Không đóng bằng Esc/nền (dismissible=false):
 * đóng nhầm là mất token, phải thu hồi rồi cấp lại.
 */
export function TokenRevealDialog({ token, agentName, onClose }: { token: IssuedAgentToken | null; agentName: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  if (!token) return null;
  const cmd = mcpAddCommand(token.token, publicOrigin());
  return (
    <Dialog
      open
      onClose={onClose}
      title={wt('agents.connectX', { name: agentName })}
      width={620}
      dismissible={false}
      footer={<button type="button" className="w-btn w-btn-primary" onClick={onClose} data-testid="token-done">{copied ? wt('common.done') : wt('dev.saved')}</button>}
    >
      <div className="mb-3 flex gap-2 rounded-[6px] border border-[color-mix(in_srgb,var(--w-orange)_45%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_10%,transparent)] px-3 py-2.5 text-[13px] leading-relaxed">
        <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[var(--w-orange)]" />
        <span>
          {wt('agents.onlyWayIn')}
          <span className="font-medium"> {wt('agents.shownOnce')}</span> {wt('agents.ifLose')}
        </span>
      </div>
      <label className="w-label">Token · {token.name}</label>
      <div className="mb-4 flex gap-2">
        <input className="w-input min-w-0 flex-1 font-mono !text-[12px]" readOnly value={token.token} onFocus={(e) => e.currentTarget.select()} aria-label={wt('agents.agentToken')} data-testid="agent-token" />
        <button type="button" className="w-btn w-btn-primary shrink-0" onClick={async () => { await copyText(token.token, wt('agents.tokens')); setCopied(true); }}>
          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? wt('common.copied') : wt('common.copy')}
        </button>
      </div>
      <label className="w-label">{wt('agents.ccRun')}</label>
      <CodeBlock label={wt('dev.command')} secret>{cmd}</CodeBlock>
      <p className="mt-2 text-[12px] leading-relaxed text-[var(--w-text-3)]">
        {wt('agents.bridgeA')} <code className="font-mono">CTWORK_TOKEN=… npx @cuongthai/ctwork-mcp</code>. {wt('agents.bridgeB')}
        ({token.scopes.includes('write') ? wt('dev.rw').toLowerCase() : wt('dev.ro').toLowerCase()}, {token.expiresAt ? wt('dev.expiresOn', { date: formatDate(token.expiresAt) }) : wt('dev.neverExpires')}).
      </p>
    </Dialog>
  );
}
