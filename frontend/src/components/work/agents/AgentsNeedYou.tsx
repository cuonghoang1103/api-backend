'use client';

/**
 * My Work → "My agents need you" (CTW-28 A14, thiết kế §7): với người là OWNER của agent — thẻ agent đã làm xong đang
 * chờ duyệt (cột review), lease hết hạn mà thẻ còn cờ Blocked, phê duyệt agent gửi còn chờ. Không có gì ⇒ không vẽ.
 * Dữ liệu: GET /me/agents-need-you (agentUi.service.agentsNeedMe).
 */

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, BadgeCheck, Bot, Eye } from 'lucide-react';
import { userName, type WorkUser } from '@/lib/work-api';
import { agentKeys, agentsApi } from '@/lib/work-agents-api';
import { relativeTime, UserAvatar } from '../ui';
import { wt } from '@/components/work/i18n';
import { statusName } from '@/components/work/i18n/names';

export default function AgentsNeedYou() {
  const q = useQuery({ queryKey: agentKeys.needMe, queryFn: agentsApi.needMe, staleTime: 30_000, retry: false });
  const d = q.data;
  if (!d || !d.agents.length) return null;
  const total = d.review.length + d.expired.length + d.approvals.length;
  if (!total) return null;
  const byUser = new Map<number, WorkUser>(d.agents.map((a) => [a.userId, a.user]));
  const who = (id: number | null) => (id ? byUser.get(id) ?? null : null);

  const Row = ({ href, agent, icon, title, sub, tone }: { href: string; agent: WorkUser | null; icon: React.ReactNode; title: React.ReactNode; sub: string; tone?: string }) => (
    <li className="border-b border-[var(--w-border)] last:border-b-0">
      <Link href={href} className="flex min-h-[44px] items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--w-hover)]">
        <span className={tone}>{icon}</span>
        <UserAvatar user={agent} size={20} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px]">{title}</span>
          <span className="block truncate text-[12px] text-[var(--w-text-3)]">{sub}</span>
        </span>
      </Link>
    </li>
  );

  return (
    <section aria-label={wt('home.agentsNeedYou')} data-testid="agents-need-you">
      <h2 className="mb-2 flex items-center gap-2 text-[14px] font-semibold">
        <Bot size={15} className="text-[var(--w-accent-text)]" /> {wt('home.agentsNeedYou')}
        <span className="rounded-full bg-[var(--w-sunken)] px-2 text-[12px] font-medium leading-[20px] tabular-nums text-[var(--w-text-2)]">{total}</span>
      </h2>
      <ul className="w-card overflow-hidden">
        {d.expired.map((x) => (
          <Row key={`e${x.key}`} href={x.url} agent={who(x.agentUserId)} tone="text-[var(--w-red)]" icon={<AlertTriangle size={14} />}
            title={<><span className="font-mono text-[12px] text-[var(--w-accent-text)]">{x.key}</span> {x.title}</>}
            sub={wt('home.agentStopped', { name: userName(who(x.agentUserId)), when: x.expiredAt ? ` ${relativeTime(x.expiredAt)}` : '' })} />
        ))}
        {d.review.map((x) => (
          <Row key={`r${x.key}`} href={x.url} agent={who(x.agentUserId)} tone="text-[var(--w-accent-text)]" icon={<Eye size={14} />}
            title={<><span className="font-mono text-[12px] text-[var(--w-accent-text)]">{x.key}</span> {x.title}</>}
            sub={wt('home.agentFinished', { name: userName(who(x.agentUserId)), status: statusName(x.status.name), project: x.project.name })} />
        ))}
        {d.approvals.map((x) => (
          <Row key={`a${x.id}`} href={x.url} agent={who(x.agentUserId)} tone="text-[var(--w-orange)]" icon={<BadgeCheck size={14} />}
            title={x.title}
            sub={wt('home.agentApproval', { name: userName(who(x.agentUserId)), when: relativeTime(x.createdAt), project: x.project.name })} />
        ))}
      </ul>
    </section>
  );
}
