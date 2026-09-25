'use client';

/**
 * CT Work — thẻ đề xuất của AI. AI KHÔNG tự ghi gì: mỗi đề xuất nằm im cho tới
 * khi người dùng bấm Apply ⇒ workApi.aiApply chạy bằng quyền của chính người
 * bấm và được ghi nhận là do AI (không cộng công cho ai).
 */

import { useCallback, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Check, CheckCheck, CornerDownRight, ExternalLink, FlaskConical, MessageSquare, Pencil, X } from 'lucide-react';
import { workApi, workError, type AiAction, type ProjectConfig } from '@/lib/work-api';
import { cn } from '@/lib/utils';
import { IssueTypeIcon, PRIORITIES, PriorityIcon, Spinner, UserAvatar } from '../ui';
import { closeAiPanel } from './store';

export type ActionStatus = 'pending' | 'applying' | 'done' | 'error' | 'dismissed';

export interface ActionItem {
  id: string;
  action: AiAction;
  status: ActionStatus;
  summary?: string;
  number?: number;
  error?: string;
}

// ─── Quyền ───────────────────────────────────────────────────────

/** Lý do không được áp dụng (null = được). */
export function blockedReason(action: AiAction, config: ProjectConfig): string | null {
  const p = config.permissions;
  switch (action.type) {
    case 'create_issue':
    case 'create_test':
      return p.createIssues ? null : 'You don’t have permission to create issues in this project';
    case 'add_comment':
      return p.comment ? null : 'You don’t have permission to comment in this project';
    case 'update_issue':
    case 'move_to_sprint':
      return p.editIssues ? null : 'You don’t have permission to edit issues in this project';
    default:
      return null;
  }
}

// ─── Mở kết quả ──────────────────────────────────────────────────

/** Những trang có IssueDrawer đọc `?issue=`; trang khác thì mở trang thẻ đầy đủ. */
const DRAWER_PAGES = /\/(board|backlog|list|tests)(\/|$)/;

function useOpenResult(config: ProjectConfig) {
  const router = useRouter();
  const pathname = usePathname();
  return useCallback((item: ActionItem) => {
    if (!item.number) return;
    const base = `/work/${config.workspace.slug}/${config.key}`;
    closeAiPanel();
    if (item.action.type === 'create_test') {
      router.push(`${base}/tests/${item.number}`);
      return;
    }
    if (pathname && pathname.startsWith(base) && DRAWER_PAGES.test(pathname.slice(base.length))) {
      // Đọc query lúc bấm (không dùng useSearchParams: host gắn ở layout, tránh bail-out CSR).
      const p = new URLSearchParams(window.location.search);
      p.set('issue', String(item.number));
      router.push(`${pathname}?${p.toString()}`);
    } else {
      router.push(`${base}/issue/${item.number}`);
    }
  }, [config.workspace.slug, config.key, pathname, router]);
}

// ─── Nhóm thẻ + Apply all ────────────────────────────────────────

export function ActionGroup({ config, items, onUpdate, applyFn, dismissFn }: {
  config: ProjectConfig;
  items: ActionItem[];
  onUpdate: (id: string, patch: Partial<ActionItem>) => void;
  /** Đề xuất đã lưu ở server (hội thoại AI dùng chung): áp qua server để giữ trạng thái + chống áp trùng. */
  applyFn?: (item: ActionItem) => Promise<{ summary?: string; number?: number }>;
  /** Bỏ qua cũng lưu ở server để cả nhóm thấy. */
  dismissFn?: (item: ActionItem) => Promise<void>;
}) {
  const qc = useQueryClient();
  const openResult = useOpenResult(config);
  const [bulk, setBulk] = useState(false);
  const pid = config.id;

  const applyOne = useCallback(async (item: ActionItem): Promise<boolean> => {
    onUpdate(item.id, { status: 'applying', error: undefined });
    try {
      const r = applyFn ? await applyFn(item) : await workApi.aiApply(pid, item.action);
      onUpdate(item.id, { status: 'done', summary: r.summary, number: r.number });
      return true;
    } catch (err) {
      onUpdate(item.id, { status: 'error', error: workError(err, 'Could not apply this change') });
      return false;
    }
  }, [pid, onUpdate, applyFn]);

  const refresh = useCallback(() => {
    qc.invalidateQueries({ predicate: (q) => q.queryKey[0] === 'work' && q.queryKey[2] === pid });
  }, [qc, pid]);

  const apply = async (item: ActionItem) => {
    await applyOne(item);
    refresh();
  };

  const applicable = items.filter((i) => (i.status === 'pending' || i.status === 'error') && !blockedReason(i.action, config));
  const applyAll = async () => {
    setBulk(true);
    // Tuần tự: thẻ con cần thẻ cha, và thứ tự tạo nên khớp thứ tự đề xuất.
    for (const it of applicable) await applyOne(it);
    setBulk(false);
    refresh();
  };

  const visible = items.filter((i) => i.status !== 'dismissed');
  if (!visible.length) return null;
  const doneCount = items.filter((i) => i.status === 'done').length;
  const failCount = items.filter((i) => i.status === 'error').length;

  return (
    <div className="mt-2 space-y-2">
      {visible.length >= 2 && (
        <div className="flex items-center justify-between gap-2 px-0.5">
          <span className="text-[12px] text-[var(--w-text-3)]">
            {visible.length} proposed change{visible.length === 1 ? '' : 's'}
            {doneCount > 0 && ` · ${doneCount} applied`}
            {failCount > 0 && <span className="text-[var(--w-red)]"> · {failCount} failed</span>}
          </span>
          {applicable.length >= 2 && (
            <button type="button" className="w-btn w-btn-sm" disabled={bulk} onClick={applyAll}>
              {bulk ? <Spinner size={12} /> : <CheckCheck size={13} />}
              Apply all ({applicable.length})
            </button>
          )}
        </div>
      )}
      {visible.map((it) => (
        <ActionCard
          key={it.id}
          config={config}
          item={it}
          busy={bulk}
          onEdit={(action) => onUpdate(it.id, { action })}
          onApply={() => apply(it)}
          onDismiss={() => {
            if (!dismissFn) { onUpdate(it.id, { status: 'dismissed' }); return; }
            dismissFn(it).then(() => onUpdate(it.id, { status: 'dismissed' }), (err) => onUpdate(it.id, { status: 'error', error: workError(err, 'Could not dismiss') }));
          }}
          onOpen={() => openResult(it)}
        />
      ))}
    </div>
  );
}

// ─── Một thẻ ─────────────────────────────────────────────────────

const TITLES: Record<AiAction['type'], string> = {
  create_issue: 'Create issue',
  update_issue: 'Update issue',
  add_comment: 'Add comment',
  move_to_sprint: 'Move to sprint',
  create_test: 'Create test case',
};

export function ActionCard({ config, item, busy, onEdit, onApply, onDismiss, onOpen }: {
  config: ProjectConfig;
  item: ActionItem;
  busy?: boolean;
  onEdit: (action: AiAction) => void;
  onApply: () => void;
  onDismiss: () => void;
  onOpen: () => void;
}) {
  const { action, status } = item;
  const blocked = blockedReason(action, config);
  const locked = status === 'applying' || status === 'done';
  const k = (n: number) => `${config.key}-${n}`;

  return (
    <div
      className={cn(
        'rounded-[8px] border bg-[var(--w-panel)] text-[13px]',
        status === 'done' ? 'border-[color-mix(in_srgb,var(--w-green)_40%,transparent)]' : status === 'error' ? 'border-[color-mix(in_srgb,var(--w-red)_45%,transparent)]' : 'border-[var(--w-border-strong)]',
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-[var(--w-border)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.03em] text-[var(--w-text-3)]">
        {TITLES[action.type]}
        {action.type === 'update_issue' || action.type === 'add_comment' ? <span className="font-mono normal-case text-[var(--w-text-2)]">{k(action.number)}</span> : null}
      </div>

      <div className="px-3 py-2.5">
        <ActionBody config={config} action={action} editable={!locked} onEdit={onEdit} />
      </div>

      <div className="flex min-h-[40px] flex-wrap items-center gap-2 border-t border-[var(--w-border)] px-3 py-1.5">
        {status === 'done' ? (
          <>
            <span className="inline-flex min-w-0 flex-1 items-center gap-1.5 text-[12px] text-[var(--w-green)]">
              <Check size={14} className="shrink-0" />
              <span className="truncate">{item.summary ?? 'Applied'}</span>
            </span>
            {item.number ? (
              <button type="button" className="w-btn w-btn-sm w-btn-ghost" onClick={onOpen}>
                Open <ExternalLink size={12} />
              </button>
            ) : null}
          </>
        ) : (
          <>
            <span className="min-w-0 flex-1 text-[12px] text-[var(--w-red)]">{status === 'error' ? item.error : ''}</span>
            <button type="button" className="w-btn w-btn-sm w-btn-ghost" onClick={onDismiss} disabled={status === 'applying' || busy}>
              Dismiss
            </button>
            <span title={blocked ?? undefined}>
              <button
                type="button"
                className="w-btn w-btn-sm w-btn-primary"
                onClick={onApply}
                disabled={!!blocked || status === 'applying' || busy}
                aria-label={blocked ? `Apply (${blocked})` : undefined}
              >
                {status === 'applying' ? <Spinner size={12} /> : <Check size={13} />}
                {status === 'error' ? 'Retry' : 'Apply'}
              </button>
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Nội dung theo loại ──────────────────────────────────────────

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 items-start gap-2 py-0.5">
      <span className="w-[76px] shrink-0 text-[12px] text-[var(--w-text-3)]">{label}</span>
      <span className="min-w-0 flex-1 break-words text-[12.5px] text-[var(--w-text)]">{children}</span>
    </div>
  );
}

function EditableTitle({ value, editable, onChange, icon }: { value: string; editable: boolean; onChange: (v: string) => void; icon?: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      {editable ? (
        <label className="group relative flex min-w-0 flex-1 items-center">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Title"
            maxLength={255}
            className="w-input w-input-bare !h-[28px] min-w-0 flex-1 !px-1.5 text-[13.5px] font-medium"
          />
          <Pencil size={11} className="pointer-events-none absolute right-1.5 text-[var(--w-text-3)] opacity-0 group-hover:opacity-100" />
        </label>
      ) : (
        <span className="min-w-0 flex-1 px-1.5 text-[13.5px] font-medium">{value}</span>
      )}
    </div>
  );
}

function Assignee({ config, username }: { config: ProjectConfig; username: string }) {
  const u = username.replace(/^@/, '');
  const m = config.members.find((x) => x.username.toLowerCase() === u.toLowerCase());
  return (
    <span className="inline-flex items-center gap-1.5">
      {m && <UserAvatar user={m} size={16} />}
      @{u}
      {!m && <span className="text-[11px] text-[var(--w-orange)]">(not a member)</span>}
    </span>
  );
}

function Priority({ value }: { value: number }) {
  const p = PRIORITIES.find((x) => x.value === value);
  return <span className="inline-flex items-center gap-1"><PriorityIcon priority={value} size={14} />{p?.label ?? value}</span>;
}

function Clamp({ text }: { text: string }) {
  return <span className="line-clamp-4 whitespace-pre-wrap text-[var(--w-text-2)]">{text}</span>;
}

function ActionBody({ config, action, editable, onEdit }: { config: ProjectConfig; action: AiAction; editable: boolean; onEdit: (a: AiAction) => void }) {
  const k = (n: number) => `${config.key}-${n}`;

  switch (action.type) {
    case 'create_issue': {
      const want = action.issueType?.toUpperCase();
      const type = config.issueTypes.find((t) => t.key === want || t.name.toUpperCase() === want);
      return (
        <div className="space-y-1.5">
          <EditableTitle
            value={action.title}
            editable={editable}
            onChange={(title) => onEdit({ ...action, title })}
            icon={<IssueTypeIcon type={type ?? { key: want ?? 'TASK', name: action.issueType, color: '#64748b' }} />}
          />
          {action.description ? <div className="px-1.5 text-[12.5px]"><Clamp text={action.description} /></div> : null}
          {action.acceptanceCriteria?.length ? (
            <div className="px-1.5">
              <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.03em] text-[var(--w-text-3)]">Acceptance criteria</div>
              <ul className="list-disc space-y-0.5 pl-4 text-[12.5px] text-[var(--w-text-2)]">
                {action.acceptanceCriteria.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          ) : null}
          <div className="px-1.5 pt-0.5">
            <Row label="Type">{type?.name ?? action.issueType}</Row>
            {action.priority ? <Row label="Priority"><Priority value={action.priority} /></Row> : null}
            {action.assignee ? <Row label="Assignee"><Assignee config={config} username={action.assignee} /></Row> : null}
            {action.storyPoints != null ? <Row label="Points">{action.storyPoints}</Row> : null}
            {action.parent ? <Row label="Parent"><span className="font-mono">{k(action.parent)}</span></Row> : null}
            {action.sprint ? <Row label="Sprint">{action.sprint}</Row> : null}
          </div>
        </div>
      );
    }

    case 'update_issue': {
      const rows: Array<[string, ReactNode]> = [];
      if (action.title) rows.push(['Title', action.title]);
      if (action.description) rows.push(['Description', <Clamp key="d" text={action.description} />]);
      if (action.priority) rows.push(['Priority', <Priority key="p" value={action.priority} />]);
      if (action.assignee) rows.push(['Assignee', <Assignee key="a" config={config} username={action.assignee} />]);
      if (action.storyPoints != null) rows.push(['Points', action.storyPoints]);
      if (action.status) rows.push(['Status', action.status]);
      if (action.sprint) rows.push(['Sprint', action.sprint]);
      if (action.dueDate) rows.push(['Due date', action.dueDate]);
      return (
        <div>
          {rows.length ? rows.map(([label, v]) => (
            <Row key={label} label={label}><span className="inline-flex items-start gap-1"><ArrowRight size={12} className="mt-[3px] shrink-0 text-[var(--w-text-3)]" /><span className="min-w-0">{v}</span></span></Row>
          )) : <span className="text-[12px] text-[var(--w-text-3)]">No field changes</span>}
        </div>
      );
    }

    case 'add_comment':
      return (
        <div className="flex gap-2">
          <MessageSquare size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
          <blockquote className="min-w-0 flex-1 whitespace-pre-wrap border-l-2 border-[var(--w-border-strong)] pl-2.5 text-[12.5px] text-[var(--w-text-2)]">
            {action.text}
          </blockquote>
        </div>
      );

    case 'move_to_sprint':
      return (
        <div className="flex flex-wrap items-center gap-1.5 text-[12.5px]">
          {action.numbers.map((n) => (
            <span key={n} className="rounded-[4px] border border-[var(--w-border-strong)] bg-[var(--w-sunken)] px-1.5 font-mono text-[11.5px]">{k(n)}</span>
          ))}
          <ArrowRight size={13} className="text-[var(--w-text-3)]" />
          <span className="font-medium">{action.sprint}</span>
        </div>
      );

    case 'create_test':
      return (
        <div className="space-y-1.5">
          <EditableTitle
            value={action.title}
            editable={editable}
            onChange={(title) => onEdit({ ...action, title })}
            icon={<IssueTypeIcon type={config.issueTypes.find((t) => t.key === 'TEST') ?? { key: 'TEST', name: 'Test', color: '#0ea5a4' }} />}
          />
          {action.requirement ? (
            <div className="flex items-center gap-1 px-1.5 text-[12px] text-[var(--w-text-3)]">
              <CornerDownRight size={12} /> Verifies <span className="font-mono text-[var(--w-text-2)]">{k(action.requirement)}</span>
            </div>
          ) : null}
          {action.preconditions ? <div className="px-1.5 text-[12.5px]"><Row label="Preconditions"><Clamp text={action.preconditions} /></Row></div> : null}
          {action.steps?.length ? (
            <ol className="space-y-1.5 px-1.5">
              {action.steps.map((s, i) => (
                <li key={i} className="flex gap-2 text-[12.5px]">
                  <span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[var(--w-sunken)] text-[10.5px] font-semibold text-[var(--w-text-2)]">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div>{s.action}</div>
                    {s.data ? <div className="text-[12px] text-[var(--w-text-3)]">Data: <span className="font-mono">{s.data}</span></div> : null}
                    {s.expected ? (
                      <div className="flex items-start gap-1 text-[12px] text-[var(--w-green)]">
                        <FlaskConical size={11} className="mt-[3px] shrink-0" /> <span className="min-w-0">{s.expected}</span>
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      );

    default:
      return <span className="text-[12px] text-[var(--w-text-3)]"><X size={12} className="inline" /> Unsupported suggestion</span>;
  }
}
