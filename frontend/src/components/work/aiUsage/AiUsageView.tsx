'use client';

/**
 * CT Work đợt 8B (19/10/2026) — "AI usage": ai đang dùng AI nối CT Work (CuongMini qua MCP, AI khác qua MCP, trợ lý AI web,
 * agent), lần gần nhất, số thao tác, token, chi phí theo NGUỒN (chính hãng $ · CuongMini Core $ · Classic đếm lượt · agent tự
 * khai $), model (TÊN CUONGMINI — máy chủ không bao giờ trả tên thật) và nhật ký thay đổi AI đã làm. Lọc theo thành viên /
 * khoảng ngày (/ dự án ở cấp không gian).
 *
 *   scope="workspace" — trang /work/<ws>/ai-usage   (GET /work/workspaces/:id/ai-usage)
 *   scope="project"   — Cài đặt dự án → tab AI      (GET /work/projects/:id/ai-usage)
 *
 * Quyền do máy chủ quyết (aiUsage.service.ts): ADMIN xem tất, thành viên chỉ phần của mình, khách/agent 403. Gọi API ngay
 * trong component (không thêm vào lib/api.ts dùng chung).
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Info } from 'lucide-react';
import { api } from '@/lib/api';
import { userName, workError, type WorkUser } from '@/lib/work-api';
import { wfmt, wt } from '@/components/work/i18n';
import { EmptyState, PageLoading, UserAvatar } from '../ui';
import { Card, SectionTitle, StatCell } from '../reports/shared';
import { Select } from '../settings/shared';

type Client = 'cuongmini' | 'mcp' | 'agent' | 'web' | 'builtin';
type Source = 'chinh_hang' | 'modelapi' | 'rambo' | 'agent';

export interface AiUsagePerson {
  user: WorkUser | null; userId: number; clients: Client[]; lastUsedAt: string | null;
  toolCalls: number; writes: number; failed: number; inputTokens: number; outputTokens: number;
  chinhHangUsd: number; modelapiUsd: number; ramboTurns: number; cuongMiniTurns: number; agentUsd: number; models: string[];
}
export interface AiUsageReport {
  scope: 'project' | 'workspace';
  canSeeAll: boolean;
  range: { from: string; to: string };
  totals: { people: number; toolCalls: number; writes: number; inputTokens: number; outputTokens: number; chinhHangUsd: number; modelapiUsd: number; ramboTurns: number; agentUsd: number; cuongMiniTurns: number; byClient: Record<Client, number> };
  people: AiUsagePerson[];
  models: Array<{ name: string; source: Source; via: 'cuongmini' | 'web' | 'agent'; turns: number; inputTokens: number; outputTokens: number; costUsd: number }>;
  writes: Array<{ id: number; at: string; user: WorkUser | null; client: Client; tool: string; target: string | null; ok: boolean; errorCode: string | null; project: { key: string; name: string } | null }>;
  notes: { cuongMiniEstimated: boolean; agentSelfReported: boolean };
  members?: WorkUser[];
  projects?: Array<{ id: number; key: string; name: string }>;
}

export const aiUsageKey = (scope: string, id: number, f: Record<string, unknown>) => ['work', 'ai-usage', scope, id, f] as const;

const viaLabel = (c: Client) => ({ cuongmini: wt('aiu.viaCuongmini'), mcp: wt('aiu.viaMcp'), web: wt('aiu.viaWeb'), agent: wt('aiu.viaAgent'), builtin: wt('aiu.viaBuiltin') })[c] ?? c;
const sourceLabel = (s: Source) => ({ chinh_hang: wt('aiu.srcOfficial'), modelapi: wt('aiu.srcCore'), rambo: wt('aiu.srcClassic'), agent: wt('aiu.srcAgent') })[s] ?? s;
const usd = (n: number) => (n > 0 ? `$${n < 0.01 ? n.toFixed(4) : n.toFixed(2)}` : '—');
const num = (n: number) => wfmt.number(n);
const tokens = (a: number, b: number) => (a || b ? `${num(a)} / ${num(b)}` : '—');

const TH = 'px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]';
const TD = 'px-3 py-2 align-top';

export default function AiUsageView({ scope, id }: { scope: 'project' | 'workspace'; id: number }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [userId, setUserId] = useState<number | ''>('');
  const [projectId, setProjectId] = useState<number | ''>('');
  const filter = { from: from || undefined, to: to || undefined, userId: userId || undefined, projectId: scope === 'workspace' ? projectId || undefined : undefined };
  const q = useQuery({
    queryKey: aiUsageKey(scope, id, filter),
    queryFn: async () => {
      const path = scope === 'project' ? `/work/projects/${id}/ai-usage` : `/work/workspaces/${id}/ai-usage`;
      return (await api.get<{ data: AiUsageReport }>(path, { params: filter })).data.data;
    },
    enabled: id > 0,
    staleTime: 30_000,
    retry: (n, err) => n < 1 && !/40[34]/.test(String((err as { response?: { status?: number } })?.response?.status ?? '')),
  });
  const d = q.data;

  if (q.isLoading) return <PageLoading />;
  if (q.isError || !d) {
    const status = (q.error as { response?: { status?: number } } | null)?.response?.status;
    return <EmptyState title={status === 403 ? wt('aiu.forbidden') : wt('aiu.loadFailed')} body={workError(q.error, '')} />;
  }

  return (
    <div className="space-y-4" data-testid="ai-usage">
      <p className="max-w-[760px] text-[13px] text-[var(--w-text-2)]">{wt('aiu.intro')}</p>
      {!d.canSeeAll && <p className="text-[12.5px] text-[var(--w-text-3)]">{wt('aiu.onlyMine')}</p>}

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-[12px] text-[var(--w-text-3)]">
          {wt('aiu.from')}
          <input type="date" className="w-input h-8 px-2" value={from || d.range.from} max={to || d.range.to} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-[12px] text-[var(--w-text-3)]">
          {wt('aiu.to')}
          <input type="date" className="w-input h-8 px-2" value={to || d.range.to} min={from || d.range.from} onChange={(e) => setTo(e.target.value)} />
        </label>
        {d.canSeeAll && !!d.members?.length && (
          <label className="flex flex-col gap-1 text-[12px] text-[var(--w-text-3)]">
            {wt('aiu.member')}
            <Select value={userId === '' ? '' : String(userId)} onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">{wt('aiu.everyone')}</option>
              {d.members.map((m) => <option key={m.id} value={m.id}>{userName(m)}</option>)}
            </Select>
          </label>
        )}
        {scope === 'workspace' && !!d.projects?.length && (
          <label className="flex flex-col gap-1 text-[12px] text-[var(--w-text-3)]">
            {wt('aiu.project')}
            <Select value={projectId === '' ? '' : String(projectId)} onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">{wt('aiu.allProjects')}</option>
              {d.projects.map((p) => <option key={p.id} value={p.id}>{p.key} · {p.name}</option>)}
            </Select>
          </label>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCell label={wt('aiu.people')} value={num(d.totals.people)} />
        <StatCell label={wt('aiu.toolCalls')} value={num(d.totals.toolCalls)} />
        <StatCell label={wt('aiu.writes')} value={num(d.totals.writes)} tone="accent" />
        <StatCell label={wt('aiu.tokens')} value={num(d.totals.inputTokens + d.totals.outputTokens)} />
        <StatCell label={wt('aiu.costOfficial')} value={usd(d.totals.chinhHangUsd)} />
        <StatCell label={wt('aiu.costCore')} value={usd(d.totals.modelapiUsd)} />
        <StatCell label={wt('aiu.ramboTurns')} value={num(d.totals.ramboTurns)} />
        <StatCell label={wt('aiu.agentUsd')} value={usd(d.totals.agentUsd)} />
      </div>

      {(d.notes.cuongMiniEstimated || d.notes.agentSelfReported) && (
        <div className="flex gap-2 rounded-[var(--w-radius)] border border-[var(--w-border)] bg-[var(--w-sunken)] p-3 text-[12.5px] text-[var(--w-text-2)]">
          <Info size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div className="space-y-1">
            {d.notes.cuongMiniEstimated && <p>{wt('aiu.estimated')}</p>}
            {d.notes.agentSelfReported && <p>{wt('aiu.selfReported')}</p>}
          </div>
        </div>
      )}

      <Card className="p-0">
        <div className="px-4 pt-3"><SectionTitle>{wt('aiu.people')}</SectionTitle></div>
        {d.people.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-[13px]">
              <thead><tr className="border-b border-[var(--w-border)]">
                <th className={TH}>{wt('aiu.colPerson')}</th><th className={TH}>{wt('aiu.colVia')}</th><th className={TH}>{wt('aiu.colLast')}</th>
                <th className={TH}>{wt('aiu.colCalls')}</th><th className={TH}>{wt('aiu.colWrites')}</th><th className={TH}>{wt('aiu.colTokens')}</th>
                <th className={TH}>{wt('aiu.colCost')}</th><th className={TH}>{wt('aiu.colModels')}</th>
              </tr></thead>
              <tbody>
                {d.people.map((p) => (
                  <tr key={p.userId} className="border-b border-[var(--w-border)] last:border-0">
                    <td className={TD}>
                      <span className="flex min-w-0 items-center gap-2">
                        <UserAvatar user={p.user} size={20} />
                        <span className="truncate font-medium">{p.user ? userName(p.user) : `#${p.userId}`}</span>
                      </span>
                    </td>
                    <td className={TD}>{p.clients.map(viaLabel).join(', ')}</td>
                    <td className={`${TD} whitespace-nowrap text-[var(--w-text-2)]`}>{p.lastUsedAt ? wfmt.relative(p.lastUsedAt) : '—'}</td>
                    <td className={`${TD} tabular-nums`}>{num(p.toolCalls)}{p.failed ? <span className="text-[var(--w-text-3)]"> ({p.failed} ✕)</span> : null}</td>
                    <td className={`${TD} tabular-nums`}>{num(p.writes)}</td>
                    <td className={`${TD} whitespace-nowrap tabular-nums`}>{tokens(p.inputTokens, p.outputTokens)}</td>
                    <td className={`${TD} whitespace-nowrap tabular-nums`}>
                      {[
                        p.chinhHangUsd > 0 ? `${wt('aiu.srcOfficial')} ${usd(p.chinhHangUsd)}` : '',
                        p.modelapiUsd > 0 ? `Core ${usd(p.modelapiUsd)}` : '',
                        p.ramboTurns > 0 ? `Classic ${wt('aiu.turnsN', { n: p.ramboTurns })}` : '',
                        p.agentUsd > 0 ? `${wt('aiu.srcAgent')} ${usd(p.agentUsd)}` : '',
                      ].filter(Boolean).join(' · ') || '—'}
                    </td>
                    <td className={`${TD} text-[var(--w-text-2)]`}>{p.models.join(', ') || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="px-4 pb-4 text-[13px] text-[var(--w-text-3)]">{wt('aiu.none')}</p>}
      </Card>

      {!!d.models.length && (
        <Card className="p-0">
          <div className="px-4 pt-3"><SectionTitle>{wt('aiu.models')}</SectionTitle></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-[13px]">
              <thead><tr className="border-b border-[var(--w-border)]">
                <th className={TH}>{wt('aiu.colModel')}</th><th className={TH}>{wt('aiu.colVia')}</th><th className={TH}>{wt('aiu.colSource')}</th>
                <th className={TH}>{wt('aiu.colTurns')}</th><th className={TH}>{wt('aiu.colTokens')}</th><th className={TH}>{wt('aiu.colCost')}</th>
              </tr></thead>
              <tbody>
                {d.models.map((m) => (
                  <tr key={`${m.via}|${m.source}|${m.name}`} className="border-b border-[var(--w-border)] last:border-0">
                    <td className={`${TD} font-medium`}>{m.name}</td>
                    <td className={TD}>{viaLabel(m.via)}</td>
                    <td className={TD}>{sourceLabel(m.source)}</td>
                    <td className={`${TD} tabular-nums`}>{num(m.turns)}</td>
                    <td className={`${TD} whitespace-nowrap tabular-nums`}>{tokens(m.inputTokens, m.outputTokens)}</td>
                    <td className={`${TD} tabular-nums`}>{m.source === 'rambo' ? wt('aiu.turnsN', { n: m.turns }) : usd(m.costUsd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card className="p-0">
        <div className="px-4 pt-3"><SectionTitle>{wt('aiu.writesTitle')}</SectionTitle></div>
        {d.writes.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-[13px]">
              <thead><tr className="border-b border-[var(--w-border)]">
                <th className={TH}>{wt('aiu.colWhen')}</th><th className={TH}>{wt('aiu.colWho')}</th><th className={TH}>{wt('aiu.colVia')}</th>
                <th className={TH}>{wt('aiu.colTool')}</th><th className={TH}>{wt('aiu.colTarget')}</th><th className={TH}>{wt('aiu.colResult')}</th>
              </tr></thead>
              <tbody>
                {d.writes.map((w) => (
                  <tr key={w.id} className="border-b border-[var(--w-border)] last:border-0">
                    <td className={`${TD} whitespace-nowrap text-[var(--w-text-2)]`} title={wfmt.dateTime(w.at)}>{wfmt.dateTime(w.at)}</td>
                    <td className={TD}>{w.user ? userName(w.user) : '—'}</td>
                    <td className={TD}>{viaLabel(w.client)}</td>
                    <td className={`${TD} font-mono text-[12px]`}>{w.tool}</td>
                    <td className={`${TD} font-mono text-[12px]`}>{[scope === 'workspace' && w.project && !w.target?.startsWith(`${w.project.key}-`) ? w.project.key : '', w.target ?? ''].filter(Boolean).join(' · ') || '—'}</td>
                    <td className={TD}>{w.ok ? wt('aiu.ok') : <span className="text-[var(--w-danger)]">{wt('aiu.failed')}{w.errorCode ? ` · ${w.errorCode}` : ''}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="px-4 pb-4 text-[13px] text-[var(--w-text-3)]">{wt('aiu.noneWrites')}</p>}
      </Card>
    </div>
  );
}
