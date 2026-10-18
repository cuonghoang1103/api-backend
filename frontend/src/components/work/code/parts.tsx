'use client';

/**
 * Trang "Code" — mảnh dùng chung: người (avatar + tên, kể cả tác giả git chưa khớp thành viên), chip mã thẻ bấm được,
 * chip trạng thái PR, biểu tượng theo loại sự kiện, mã băm commit.
 */

import type { ReactNode } from 'react';
import { GitBranch, GitBranchPlus, GitCommitHorizontal, GitMerge, GitPullRequest, GitPullRequestClosed, Eye, Trash2, Github, Gitlab, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName } from '@/lib/work-api';
import { CATEGORY_DOT, UserAvatar } from '../ui';
import { wt } from '../i18n';
import type { ActivityKind, GitProvider, IssueRef, Who } from './codeApi';

export function WhoChip({ who, size = 18, className, muted }: { who: Who | null | undefined; size?: number; className?: string; muted?: boolean }) {
  if (!who) return <span className="text-[var(--w-text-3)]">—</span>;
  const name = who.user ? userName(who.user) : who.label;
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-1.5 align-middle', className)} title={who.user ? `@${who.user.username}` : wt('code.unmatched', { x: who.label })}>
      {who.user ? (
        <UserAvatar user={who.user} size={size} />
      ) : (
        <span aria-hidden="true" className="flex shrink-0 items-center justify-center rounded-full border border-dashed border-[var(--w-border-strong)] bg-[var(--w-sunken)] font-semibold text-[var(--w-text-3)]" style={{ width: size, height: size, fontSize: Math.max(9, size * 0.45) }}>
          {who.label.slice(0, 1).toUpperCase()}
        </span>
      )}
      <span className={cn('min-w-0 truncate', muted ? 'text-[var(--w-text-2)]' : 'font-medium text-[var(--w-text)]')}>{name}</span>
    </span>
  );
}

export function IssueChip({ n, refs, projectKey, onOpen }: { n: number; refs: Record<number, IssueRef>; projectKey: string; onOpen?: (n: number) => void }) {
  const r = refs[n];
  const key = r?.key ?? `${projectKey}-${n}`;
  const dot = r?.status ? CATEGORY_DOT[r.status.category as keyof typeof CATEGORY_DOT] : undefined;
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); onOpen?.(n); }}
      disabled={!r || !onOpen}
      title={r ? `${key} · ${r.title}${r.status ? ` · ${r.status.name}` : ''}` : wt('code.issueGone', { k: key })}
      className={cn(
        'inline-flex h-[20px] shrink-0 items-center gap-1 rounded-[5px] border px-1.5 font-mono text-[11px] font-medium transition-colors',
        r ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)] hover:bg-[var(--w-active)]' : 'border-[var(--w-border)] text-[var(--w-text-3)] line-through',
      )}
    >
      {dot && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />}
      {key}
    </button>
  );
}

export function IssueChips({ nums, refs, projectKey, onOpen, max = 4 }: { nums: number[]; refs: Record<number, IssueRef>; projectKey: string; onOpen?: (n: number) => void; max?: number }) {
  const list = [...new Set(nums)];
  if (!list.length) return null;
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {list.slice(0, max).map((n) => <IssueChip key={n} n={n} refs={refs} projectKey={projectKey} onOpen={onOpen} />)}
      {list.length > max && <span className="text-[11px] text-[var(--w-text-3)]">+{list.length - max}</span>}
    </span>
  );
}

const PR_STATE: Record<string, { cls: string; icon: LucideIcon; label: () => string }> = {
  open: { cls: 'text-[var(--w-green-text)] border-[color-mix(in_srgb,var(--w-green)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-green)_12%,transparent)]', icon: GitPullRequest, label: () => wt('code.stOpen') },
  draft: { cls: 'text-[var(--w-text-2)] border-[var(--w-border-strong)] bg-[var(--w-sunken)]', icon: GitPullRequest, label: () => wt('code.stDraft') },
  merged: { cls: 'text-[var(--w-epic-text)] border-[color-mix(in_srgb,var(--w-epic)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-epic)_12%,transparent)]', icon: GitMerge, label: () => wt('code.stMerged') },
  closed: { cls: 'text-[var(--w-red-text)] border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-red)_10%,transparent)]', icon: GitPullRequestClosed, label: () => wt('code.stClosed') },
};

export function PrState({ state, compact }: { state: string | null | undefined; compact?: boolean }) {
  const s = PR_STATE[state ?? ''] ?? PR_STATE.open;
  const Icon = s.icon;
  return (
    <span className={cn('inline-flex h-[22px] shrink-0 items-center gap-1 rounded-full border px-2 text-[11.5px] font-semibold', s.cls)}>
      <Icon size={12} aria-hidden="true" />
      {!compact && s.label()}
    </span>
  );
}

export function prIcon(state: string | null | undefined): { icon: LucideIcon; color: string } {
  if (state === 'merged') return { icon: GitMerge, color: 'var(--w-epic)' };
  if (state === 'closed') return { icon: GitPullRequestClosed, color: 'var(--w-red)' };
  if (state === 'draft') return { icon: GitPullRequest, color: 'var(--w-text-3)' };
  return { icon: GitPullRequest, color: 'var(--w-green)' };
}

export function eventIcon(kind: ActivityKind): { icon: LucideIcon; color: string } {
  switch (kind) {
    case 'PUSH': return { icon: GitCommitHorizontal, color: 'var(--w-accent)' };
    case 'COMMIT': return { icon: GitCommitHorizontal, color: 'var(--w-text-3)' };
    case 'BRANCH_CREATED': return { icon: GitBranchPlus, color: 'var(--w-blue)' };
    case 'BRANCH_DELETED': return { icon: Trash2, color: 'var(--w-red)' };
    case 'PR_OPENED': case 'PR_REOPENED': return { icon: GitPullRequest, color: 'var(--w-green)' };
    case 'PR_MERGED': return { icon: GitMerge, color: 'var(--w-epic)' };
    case 'PR_CLOSED': return { icon: GitPullRequestClosed, color: 'var(--w-red)' };
    case 'REVIEW_REQUESTED': return { icon: Eye, color: 'var(--w-orange)' };
    default: return { icon: GitBranch, color: 'var(--w-text-3)' };
  }
}

export function EventDot({ kind }: { kind: ActivityKind }) {
  const { icon: Icon, color } = eventIcon(kind);
  return (
    <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--w-border)] bg-[var(--w-raised)]" style={{ color }}>
      <Icon size={15} />
    </span>
  );
}

export function ProviderIcon({ provider, size = 15 }: { provider: GitProvider; size?: number }) {
  return provider === 'GITLAB' ? <Gitlab size={size} aria-hidden="true" /> : <Github size={size} aria-hidden="true" />;
}

export function Sha({ sha, onClick, href }: { sha: string; onClick?: () => void; href?: string | null }) {
  const cls = 'shrink-0 rounded-[4px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-1.5 py-[1px] font-mono text-[11px] text-[var(--w-accent-text)] hover:border-[var(--w-accent-border)]';
  if (onClick) return <button type="button" className={cls} onClick={onClick} title={wt('code.viewDiff')}>{sha.slice(0, 7)}</button>;
  if (href) return <a className={cls} href={href} target="_blank" rel="noopener noreferrer">{sha.slice(0, 7)}</a>;
  return <span className={cls}>{sha.slice(0, 7)}</span>;
}

export function BranchName({ name, deleted, onClick }: { name: string; deleted?: boolean; onClick?: () => void }) {
  const inner: ReactNode = (
    <>
      <GitBranch size={11} aria-hidden="true" className="shrink-0" />
      <span className={cn('truncate', deleted && 'line-through')}>{name}</span>
    </>
  );
  const cls = 'inline-flex h-[20px] max-w-[260px] min-w-0 items-center gap-1 rounded-[5px] bg-[color-mix(in_srgb,var(--w-blue)_10%,transparent)] px-1.5 font-mono text-[11.5px] text-[var(--w-blue-text)]';
  if (onClick) return <button type="button" onClick={onClick} className={cn(cls, 'hover:bg-[color-mix(in_srgb,var(--w-blue)_18%,transparent)]')} title={name}>{inner}</button>;
  return <span className={cls} title={name}>{inner}</span>;
}

/** "+12 −3" — số dòng (null ⇒ không hiện, KHÔNG bịa 0). */
export function LineDelta({ add, del }: { add: number | null | undefined; del: number | null | undefined }) {
  if (add == null && del == null) return null;
  return (
    <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[11.5px] tabular-nums">
      <span className="text-[var(--w-green-text)]">+{add ?? 0}</span>
      <span className="text-[var(--w-red-text)]">−{del ?? 0}</span>
    </span>
  );
}
