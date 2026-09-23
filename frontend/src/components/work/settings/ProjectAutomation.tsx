'use client';

/**
 * Cài đặt dự án → Automation: luật "khi… nếu… thì…" kiểu Jira Automation.
 *
 * Kiểm cấu hình thật sự nằm ở backend (automation.service.ts validateConfig)
 * — giao diện chỉ chặn những lỗi hiển nhiên (thiếu tên, thiếu hành động) để
 * nút Save không bấm vô ích; mọi thông báo lỗi khác lấy nguyên từ server.
 */

import Link from 'next/link';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  AlertTriangle, ArrowDown, ArrowUp, Bell, CalendarClock, ChevronDown, FlaskConical, MessageSquare, Pencil, Plus, RefreshCw,
  Trash2, UserCheck, X, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  userName, workApi, workError, type AutomationRule, type ProjectConfig, type RuleAction, type RuleActionKind, type RuleConfig,
  type RuleLog, type RuleLogStatus, type RuleTrigger,
} from '@/lib/work-api';
import { wk } from '../hooks';
import { JqlInput } from '../search/JqlInput';
import { jqlErrorOf, quote } from '../search/jql';
import { Dialog, EmptyState, PickerList, Popover, PRIORITIES, Spinner, relativeTime, useToggle } from '../ui';
import { ConfirmDialog, Section, Select, Switch } from './shared';

// ─── Từ điển ─────────────────────────────────────────────────────

const TRIGGERS: Array<{ id: RuleTrigger; label: string; help: string }> = [
  { id: 'issue.created', label: 'Issue created', help: 'Runs when a new issue is created.' },
  { id: 'issue.transitioned', label: 'Issue transitioned', help: 'Runs when an issue moves between statuses.' },
  { id: 'issue.assigned', label: 'Issue assigned', help: 'Runs when an issue gets an assignee.' },
  { id: 'field.changed', label: 'Field value changed', help: 'Runs when one of the selected fields changes.' },
  { id: 'comment.added', label: 'Comment added', help: 'Runs when someone comments on an issue.' },
  { id: 'scheduled.daily', label: 'Scheduled — daily at 08:00', help: 'Runs every day at 08:00 (Vietnam time) on each issue matching the JQL (up to 200).' },
];

const FIELDS: Array<{ id: string; label: string }> = [
  { id: 'priority', label: 'Priority' },
  { id: 'assigneeId', label: 'Assignee' },
  { id: 'storyPoints', label: 'Story points' },
  { id: 'dueDate', label: 'Due date' },
  { id: 'startDate', label: 'Start date' },
  { id: 'sprintId', label: 'Sprint' },
  { id: 'fixVersionId', label: 'Fix version' },
  { id: 'parentId', label: 'Parent' },
  { id: 'title', label: 'Summary' },
  { id: 'description', label: 'Description' },
];

const ACTIONS: Array<{ id: RuleActionKind; label: string }> = [
  { id: 'transition', label: 'Transition issue' },
  { id: 'assign', label: 'Assign issue' },
  { id: 'set_priority', label: 'Set priority' },
  { id: 'add_label', label: 'Add label' },
  { id: 'comment', label: 'Add comment' },
  { id: 'move_to_active_sprint', label: 'Move to active sprint' },
  { id: 'notify', label: 'Send notification' },
  { id: 'create_subtask', label: 'Create sub-task' },
];

const LOG_STATUS: Record<RuleLogStatus, { label: string; cls: string }> = {
  SUCCESS: { label: 'Success', cls: 'text-[var(--w-green)] bg-[color-mix(in_srgb,var(--w-green)_12%,transparent)] border-[color-mix(in_srgb,var(--w-green)_35%,transparent)]' },
  NO_MATCH: { label: 'No match', cls: 'text-[var(--w-text-2)] bg-[var(--w-sunken)] border-[var(--w-border-strong)]' },
  FAILED: { label: 'Failed', cls: 'text-[var(--w-red)] bg-[color-mix(in_srgb,var(--w-red)_12%,transparent)] border-[color-mix(in_srgb,var(--w-red)_35%,transparent)]' },
  LOOP_BLOCKED: { label: 'Loop blocked', cls: 'text-[var(--w-orange)] bg-[color-mix(in_srgb,var(--w-orange)_12%,transparent)] border-[color-mix(in_srgb,var(--w-orange)_35%,transparent)]' },
  THROTTLED: { label: 'Throttled', cls: 'text-[var(--w-orange)] bg-[color-mix(in_srgb,var(--w-orange)_12%,transparent)] border-[color-mix(in_srgb,var(--w-orange)_35%,transparent)]' },
};

function StatusPill({ status }: { status: RuleLogStatus }) {
  const s = LOG_STATUS[status] ?? LOG_STATUS.NO_MATCH;
  return <span className={cn('inline-flex h-[20px] shrink-0 items-center whitespace-nowrap rounded-[4px] border px-1.5 text-[11px] font-semibold', s.cls)}>{s.label}</span>;
}

/** Mọi trạng thái của mọi quy trình trong dự án (luật dùng id trạng thái). */
function useStatuses(config: ProjectConfig) {
  return useMemo(() => {
    const multi = config.workflows.length > 1;
    return config.workflows.flatMap((w) => w.statuses.map((s) => ({ ...s, label: multi ? `${s.name} (${w.name})` : s.name, workflowDefault: w.isDefault })));
  }, [config.workflows]);
}

type Statuses = ReturnType<typeof useStatuses>;

// ─── Tóm tắt một luật thành câu ──────────────────────────────────

function names(ids: number[] | undefined, statuses: Statuses): string {
  return (ids ?? []).map((id) => statuses.find((s) => s.id === id)?.name ?? 'Unknown').join(' or ');
}

function whenSummary(trigger: RuleTrigger, cfg: RuleConfig, statuses: Statuses): string {
  switch (trigger) {
    case 'issue.created': return 'When an issue is created';
    case 'issue.assigned': return 'When an issue is assigned';
    case 'comment.added': return 'When a comment is added';
    case 'field.changed': {
      const f = (cfg.fields ?? []).map((x) => FIELDS.find((y) => y.id === x)?.label ?? x);
      return f.length ? `When ${f.join(', ')} changes` : 'When a field changes';
    }
    case 'issue.transitioned': {
      const from = names(cfg.fromStatusIds, statuses);
      const to = names(cfg.toStatusIds, statuses);
      if (from && to) return `When an issue moves from ${from} to ${to}`;
      if (to) return `When an issue moves to ${to}`;
      if (from) return `When an issue leaves ${from}`;
      return 'When an issue is transitioned';
    }
    case 'scheduled.daily': return 'Every day at 08:00';
    default: return trigger;
  }
}

function actionSummary(a: RuleAction, config: ProjectConfig, statuses: Statuses): string {
  switch (a.kind) {
    case 'transition': return `move to ${statuses.find((s) => s.id === a.statusId)?.name ?? '…'}`;
    case 'assign': return a.assignee === null || a.assignee === undefined ? 'unassign' : a.assignee === 'reporter' ? 'assign to reporter' : `assign to ${userName(config.members.find((m) => m.id === a.assignee))}`;
    case 'set_priority': return `set priority ${PRIORITIES.find((p) => p.value === a.priority)?.label ?? '…'}`;
    case 'add_label': return `add label ${config.labels.find((l) => l.id === a.labelId)?.name ?? '…'}`;
    case 'comment': return 'add a comment';
    case 'move_to_active_sprint': return 'move to the active sprint';
    case 'notify': return 'send a notification';
    case 'create_subtask': return 'create a sub-task';
    default: return a.kind;
  }
}

// ─── Mẫu luật ────────────────────────────────────────────────────

interface Draft { id?: number; name: string; enabled: boolean; trigger: RuleTrigger; config: RuleConfig }

const TEMPLATES: Array<{ id: string; title: string; body: string; icon: ReactNode; build: (config: ProjectConfig, statuses: Statuses) => Draft | string }> = [
  {
    id: 'bug-priority',
    title: 'Prioritise new bugs',
    body: 'When a bug is created → set priority to High.',
    icon: <AlertTriangle size={14} />,
    build: (config) => {
      const bug = config.issueTypes.find((t) => t.key === 'BUG');
      if (!bug) return 'This project has no Bug issue type.';
      return { name: 'Prioritise new bugs', enabled: true, trigger: 'issue.created', config: { conditions: [{ jql: `type = ${quote(bug.name)}` }], actions: [{ kind: 'set_priority', priority: 2 }] } };
    },
  },
  {
    id: 'done-comment',
    title: 'Comment when resolved',
    body: 'When an issue moves to Done → add the comment “Resolved”.',
    icon: <MessageSquare size={14} />,
    build: (_config, statuses) => {
      const done = statuses.filter((s) => s.category === 'DONE').map((s) => s.id);
      if (!done.length) return 'This project has no Done status.';
      return { name: 'Comment when resolved', enabled: true, trigger: 'issue.transitioned', config: { toStatusIds: done, actions: [{ kind: 'comment', text: 'Resolved' }] } };
    },
  },
  {
    id: 'assigned-start',
    title: 'Start work on assignment',
    body: 'When an issue is assigned → move it to In Progress.',
    icon: <UserCheck size={14} />,
    build: (_config, statuses) => {
      const target = statuses.find((s) => s.category === 'IN_PROGRESS' && s.workflowDefault) ?? statuses.find((s) => s.category === 'IN_PROGRESS');
      if (!target) return 'This project has no In Progress status.';
      return {
        name: 'Start work on assignment', enabled: true, trigger: 'issue.assigned',
        config: { conditions: [{ jql: 'statusCategory = "To Do"' }], actions: [{ kind: 'transition', statusId: target.id }] },
      };
    },
  },
  {
    id: 'overdue-daily',
    title: 'Daily overdue reminder',
    body: 'Every morning → notify the assignee of each overdue issue.',
    icon: <CalendarClock size={14} />,
    build: () => ({
      name: 'Daily overdue reminder', enabled: true, trigger: 'scheduled.daily',
      config: {
        jql: 'due < startOfDay() AND statusCategory != Done',
        actions: [{ kind: 'notify', to: ['assignee'], text: 'This issue is overdue. Please update its status or due date.' }],
      },
    }),
  },
];

// ─── Ô chọn nhiều (trạng thái, trường, người nhận) ───────────────

function MultiPick<T extends string | number>({ options, value, onChange, placeholder, disabled }: {
  options: Array<{ value: T; label: string }>; value: T[]; onChange: (v: T[]) => void; placeholder: string; disabled?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const pop = useToggle();
  const chosen = options.filter((o) => value.includes(o.value));
  return (
    <>
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={pop.toggle}
        className="flex min-h-[32px] w-full items-center gap-1.5 rounded-[6px] border border-[var(--w-border-strong)] bg-[var(--w-panel)] px-2 py-1 text-left text-[13px] hover:bg-[var(--w-hover)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex min-w-0 flex-1 flex-wrap gap-1">
          {chosen.length ? chosen.map((o) => (
            <span key={String(o.value)} className="inline-flex h-[20px] max-w-full items-center truncate rounded-[4px] bg-[var(--w-sunken)] px-1.5 text-[12px]">{o.label}</span>
          )) : <span className="text-[var(--w-text-3)]">{placeholder}</span>}
        </span>
        <ChevronDown size={13} className="shrink-0 text-[var(--w-text-3)]" />
      </button>
      <Popover open={pop.on} onClose={pop.close} anchorRef={ref} width={260}>
        <PickerList
          multi
          options={options.map((o) => ({ value: o.value, label: o.label }))}
          selected={value}
          onPick={(v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])}
        />
      </Popover>
    </>
  );
}

// ─── Ô JQL có nút kiểm tra ───────────────────────────────────────

function JqlField({ config, value, onChange, disabled }: { config: ProjectConfig; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const [ran, setRan] = useState<string | undefined>();
  const [error, setError] = useState<{ message: string; position: number } | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const check = async (jql: string) => {
    setRan(jql);
    setResult(null);
    setError(null);
    if (!jql) return;
    try {
      const r = await workApi.search(config.id, jql, { limit: 1 });
      setResult(`Valid · ${r.total} ${r.total === 1 ? 'issue matches' : 'issues match'} right now`);
    } catch (err) {
      const je = jqlErrorOf(err);
      if (je) setError(je);
      else setResult(workError(err, 'Could not check the query'));
    }
  };
  if (disabled) return <div className="rounded-[6px] bg-[var(--w-sunken)] px-2 py-1.5 font-mono text-[12.5px] break-words">{value || '—'}</div>;
  return (
    <div>
      <JqlInput
        config={config}
        value={value}
        onChange={(v) => { onChange(v); setResult(null); }}
        onRun={check}
        error={error}
        ranQuery={ran}
        runLabel="Check"
        placeholder="e.g. type = Bug AND priority >= High"
      />
      {result && !error && <p className="mt-1 text-[12px] text-[var(--w-text-3)]">{result}</p>}
    </div>
  );
}

// ─── Một hành động ───────────────────────────────────────────────

function defaultAction(kind: RuleActionKind, config: ProjectConfig, statuses: Statuses): RuleAction {
  switch (kind) {
    case 'transition': return { kind, statusId: statuses[0]?.id };
    case 'assign': return { kind, assignee: 'reporter' };
    case 'set_priority': return { kind, priority: 2 };
    case 'add_label': return { kind, labelId: config.labels[0]?.id };
    case 'comment': return { kind, text: '' };
    case 'notify': return { kind, to: ['assignee'], text: '' };
    case 'create_subtask': return { kind, title: '' };
    default: return { kind };
  }
}

function ActionEditor({ action, onChange, config, statuses, disabled }: {
  action: RuleAction; onChange: (a: RuleAction) => void; config: ProjectConfig; statuses: Statuses; disabled?: boolean;
}) {
  const assignable = config.members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER');
  switch (action.kind) {
    case 'transition':
      return (
        <Select aria-label="Target status" value={action.statusId ?? ''} disabled={disabled} onChange={(e) => onChange({ ...action, statusId: Number(e.target.value) })}>
          {statuses.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </Select>
      );
    case 'assign':
      return (
        <Select
          aria-label="Assignee"
          disabled={disabled}
          value={action.assignee === null || action.assignee === undefined ? '' : String(action.assignee)}
          onChange={(e) => onChange({ ...action, assignee: e.target.value === '' ? null : e.target.value === 'reporter' ? 'reporter' : Number(e.target.value) })}
        >
          <option value="reporter">Reporter</option>
          <option value="">Unassigned</option>
          <optgroup label="Members">
            {assignable.map((m) => <option key={m.id} value={m.id}>{userName(m)}</option>)}
          </optgroup>
        </Select>
      );
    case 'set_priority':
      return (
        <Select aria-label="Priority" value={action.priority ?? 3} disabled={disabled} onChange={(e) => onChange({ ...action, priority: Number(e.target.value) })}>
          {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </Select>
      );
    case 'add_label':
      return config.labels.length ? (
        <Select aria-label="Label" value={action.labelId ?? ''} disabled={disabled} onChange={(e) => onChange({ ...action, labelId: Number(e.target.value) })}>
          {config.labels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </Select>
      ) : (
        <p className="text-[12px] text-[var(--w-text-3)]">This project has no labels yet. Create one in the Labels tab first.</p>
      );
    case 'comment':
      return (
        <textarea
          aria-label="Comment text"
          rows={2}
          maxLength={2000}
          disabled={disabled}
          className="w-input !h-auto py-2"
          placeholder="The comment is posted as “Automation”."
          value={action.text ?? ''}
          onChange={(e) => onChange({ ...action, text: e.target.value })}
        />
      );
    case 'move_to_active_sprint':
      return <p className="text-[12px] text-[var(--w-text-3)]">Adds standard issues (not epics or sub-tasks) to the sprint that is running. Skipped when no sprint is active.</p>;
    case 'notify': {
      const to = action.to ?? [];
      const roles = (['assignee', 'reporter', 'watchers'] as const);
      const people = to.filter((x): x is number => typeof x === 'number');
      const setTo = (next: RuleAction['to']) => onChange({ ...action, to: next });
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
            {roles.map((r) => (
              <label key={r} className="flex cursor-pointer items-center gap-1.5">
                <input
                  type="checkbox"
                  disabled={disabled}
                  checked={to.includes(r)}
                  onChange={(e) => setTo(e.target.checked ? [...to, r] : to.filter((x) => x !== r))}
                />
                {r === 'assignee' ? 'Assignee' : r === 'reporter' ? 'Reporter' : 'Watchers'}
              </label>
            ))}
          </div>
          <MultiPick
            options={config.members.map((m) => ({ value: m.id, label: userName(m) }))}
            value={people}
            disabled={disabled}
            placeholder="Also notify specific people…"
            onChange={(ids) => setTo([...to.filter((x) => typeof x !== 'number'), ...ids])}
          />
          <textarea
            aria-label="Notification message"
            rows={2}
            maxLength={2000}
            disabled={disabled}
            className="w-input !h-auto py-2"
            placeholder="Message"
            value={action.text ?? ''}
            onChange={(e) => onChange({ ...action, text: e.target.value })}
          />
        </div>
      );
    }
    case 'create_subtask':
      return config.issueTypes.some((t) => t.level === -1) ? (
        <input
          aria-label="Sub-task title"
          maxLength={255}
          disabled={disabled}
          className="w-input"
          placeholder="Sub-task title"
          value={action.title ?? ''}
          onChange={(e) => onChange({ ...action, title: e.target.value })}
        />
      ) : (
        <p className="text-[12px] text-[var(--w-text-3)]">This project has no sub-task issue type.</p>
      );
    default:
      return null;
  }
}

// ─── Trình dựng luật ─────────────────────────────────────────────

function Block({ label, tone, icon, children }: { label: string; tone: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="relative rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)]">
      <div className="flex items-center gap-2 border-b border-[var(--w-border)] px-3 py-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-[5px] text-white" style={{ background: tone }}>{icon}</span>
        <span className="text-[12px] font-semibold uppercase tracking-wide text-[var(--w-text-2)]">{label}</span>
      </div>
      <div className="space-y-3 p-3">{children}</div>
    </div>
  );
}

function Connector() {
  return <div className="mx-auto h-4 w-px bg-[var(--w-border-strong)]" aria-hidden />;
}

function RuleEditor({ open, initial, onClose, config, canEdit }: { open: boolean; initial: Draft | null; onClose: () => void; config: ProjectConfig; canEdit: boolean }) {
  const qc = useQueryClient();
  const statuses = useStatuses(config);
  const [d, setD] = useState<Draft | null>(initial);
  // Mở luật khác ⇒ nạp lại bản nháp (so theo đối tượng initial).
  const [seen, setSeen] = useState<Draft | null>(initial);
  if (initial !== seen) { setSeen(initial); setD(initial); }

  const save = useMutation({
    mutationFn: (x: Draft) => workApi.saveAutomationRule(config.id, {
      id: x.id, name: x.name.trim(), enabled: x.enabled, trigger: x.trigger,
      config: {
        ...(x.trigger === 'issue.transitioned' ? { fromStatusIds: x.config.fromStatusIds ?? [], toStatusIds: x.config.toStatusIds ?? [] } : {}),
        ...(x.trigger === 'field.changed' ? { fields: x.config.fields ?? [] } : {}),
        ...(x.trigger === 'scheduled.daily' ? { jql: x.config.jql?.trim() ?? '' } : {}),
        conditions: (x.config.conditions ?? []).map((c) => ({ jql: c.jql.trim() })).filter((c) => c.jql),
        actions: x.config.actions,
      },
    }),
    onSuccess: (r) => {
      toast.success(initial?.id ? `Rule “${r.name}” saved` : `Rule “${r.name}” created`);
      qc.invalidateQueries({ queryKey: wk.automation(config.id) });
      onClose();
    },
    onError: (err) => toast.error(workError(err, 'Could not save the rule')),
  });

  if (!d) return null;
  const cfg = d.config;
  const setCfg = (patch: Partial<RuleConfig>) => setD({ ...d, config: { ...cfg, ...patch } });
  const setAction = (i: number, a: RuleAction) => setCfg({ actions: cfg.actions.map((x, j) => (j === i ? a : x)) });
  const moveAction = (i: number, dir: -1 | 1) => {
    const next = [...cfg.actions];
    const [a] = next.splice(i, 1);
    next.splice(i + dir, 0, a);
    setCfg({ actions: next });
  };
  const conditions = cfg.conditions ?? [];
  const ro = !canEdit;
  const valid = !!d.name.trim() && cfg.actions.length > 0 && (d.trigger !== 'scheduled.daily' || !!cfg.jql?.trim()) && (d.trigger !== 'field.changed' || !!cfg.fields?.length);
  const statusOpts = statuses.map((s) => ({ value: s.id, label: s.label }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      width={680}
      title={ro ? 'View rule' : d.id ? 'Edit rule' : 'Create rule'}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>{ro ? 'Close' : 'Cancel'}</button>
          {!ro && (
            <button type="button" className="w-btn w-btn-primary" disabled={!valid || save.isPending} onClick={() => save.mutate(d)}>
              {save.isPending && <Spinner size={12} />}
              {d.id ? 'Save rule' : 'Create rule'}
            </button>
          )}
        </>
      }
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label className="w-label" htmlFor="w-rule-name">Rule name</label>
          <input id="w-rule-name" className="w-input" maxLength={100} disabled={ro} autoFocus={!d.id && !ro} placeholder="e.g. Prioritise new bugs" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} />
        </div>
        <label className="flex h-[32px] items-center gap-2 text-[13px] text-[var(--w-text-2)]">
          <Switch checked={d.enabled} disabled={ro} onChange={(enabled) => setD({ ...d, enabled })} label="Rule enabled" />
          Enabled
        </label>
      </div>

      <Block label="When" tone="var(--w-accent)" icon={<Zap size={12} />}>
        <Select
          aria-label="Trigger"
          value={d.trigger}
          disabled={ro}
          onChange={(e) => setD({ ...d, trigger: e.target.value as RuleTrigger })}
          className="w-full"
        >
          {TRIGGERS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </Select>
        <p className="text-[12px] text-[var(--w-text-3)]">{TRIGGERS.find((t) => t.id === d.trigger)?.help}</p>
        {d.trigger === 'issue.transitioned' && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="w-label">From status</label>
              <MultiPick options={statusOpts} value={cfg.fromStatusIds ?? []} disabled={ro} placeholder="Any status" onChange={(fromStatusIds) => setCfg({ fromStatusIds })} />
            </div>
            <div>
              <label className="w-label">To status</label>
              <MultiPick options={statusOpts} value={cfg.toStatusIds ?? []} disabled={ro} placeholder="Any status" onChange={(toStatusIds) => setCfg({ toStatusIds })} />
            </div>
          </div>
        )}
        {d.trigger === 'field.changed' && (
          <div>
            <label className="w-label">Fields to watch</label>
            <MultiPick options={FIELDS.map((f) => ({ value: f.id, label: f.label }))} value={cfg.fields ?? []} disabled={ro} placeholder="Pick one or more fields" onChange={(fields) => setCfg({ fields })} />
          </div>
        )}
        {d.trigger === 'scheduled.daily' && (
          <div>
            <label className="w-label">Run on issues matching</label>
            <JqlField config={config} value={cfg.jql ?? ''} disabled={ro} onChange={(jql) => setCfg({ jql })} />
          </div>
        )}
      </Block>

      <Connector />

      <Block label="If" tone="var(--w-orange)" icon={<FlaskConical size={12} />}>
        {!conditions.length && <p className="text-[12px] text-[var(--w-text-3)]">No conditions — the rule runs on every matching event.</p>}
        {conditions.map((c, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <JqlField config={config} value={c.jql} disabled={ro} onChange={(jql) => setCfg({ conditions: conditions.map((x, j) => (j === i ? { jql } : x)) })} />
            </div>
            {!ro && (
              <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm mt-0.5" aria-label="Remove condition" title="Remove condition" onClick={() => setCfg({ conditions: conditions.filter((_, j) => j !== i) })}>
                <X size={13} />
              </button>
            )}
          </div>
        ))}
        {!ro && conditions.length < 10 && (
          <button type="button" className="w-btn w-btn-sm" onClick={() => setCfg({ conditions: [...conditions, { jql: '' }] })}>
            <Plus size={12} /> Add JQL condition
          </button>
        )}
        {conditions.length > 1 && <p className="text-[12px] text-[var(--w-text-3)]">The issue must match every condition.</p>}
      </Block>

      <Connector />

      <Block label="Then" tone="var(--w-green)" icon={<Bell size={12} />}>
        {cfg.actions.map((a, i) => (
          <div key={i} className="rounded-[6px] border border-[var(--w-border)] p-2.5">
            <div className="mb-2 flex items-center gap-2">
              <span className="w-5 shrink-0 text-center text-[12px] tabular text-[var(--w-text-3)]">{i + 1}.</span>
              <Select
                aria-label={`Action ${i + 1}`}
                value={a.kind}
                disabled={ro}
                onChange={(e) => setAction(i, defaultAction(e.target.value as RuleActionKind, config, statuses))}
                className="min-w-0 flex-1"
              >
                {ACTIONS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
              </Select>
              {!ro && (
                <div className="flex shrink-0">
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={i === 0} onClick={() => moveAction(i, -1)} aria-label="Move up" title="Move up"><ArrowUp size={12} /></button>
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={i === cfg.actions.length - 1} onClick={() => moveAction(i, 1)} aria-label="Move down" title="Move down"><ArrowDown size={12} /></button>
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => setCfg({ actions: cfg.actions.filter((_, j) => j !== i) })} aria-label="Remove action" title="Remove action"><X size={13} /></button>
                </div>
              )}
            </div>
            <div className="sm:pl-7">
              <ActionEditor action={a} onChange={(x) => setAction(i, x)} config={config} statuses={statuses} disabled={ro} />
            </div>
          </div>
        ))}
        {!cfg.actions.length && <p className="text-[12px] text-[var(--w-red)]">Add at least one action.</p>}
        {!ro && cfg.actions.length < 10 && (
          <button type="button" className="w-btn w-btn-sm" onClick={() => setCfg({ actions: [...cfg.actions, defaultAction('comment', config, statuses)] })}>
            <Plus size={12} /> Add action
          </button>
        )}
      </Block>
    </Dialog>
  );
}

// ─── Chạy thử ────────────────────────────────────────────────────

function TestDialog({ rule, onClose, config }: { rule: AutomationRule | null; onClose: () => void; config: ProjectConfig }) {
  const qc = useQueryClient();
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ status: RuleLogStatus; message: string } | null>(null);
  const [seen, setSeen] = useState<AutomationRule | null>(null);
  if (rule !== seen) { setSeen(rule); setText(''); setResult(null); }
  // Nhận "12" hoặc "KEY-12".
  const m = /^(?:[a-z][a-z0-9]*-)?(\d+)$/i.exec(text.trim());
  const number = m ? Number(m[1]) : null;
  const run = useMutation({
    mutationFn: () => workApi.testAutomationRule(config.id, rule!.id, number!),
    onSuccess: (r) => {
      setResult(r);
      qc.invalidateQueries({ queryKey: wk.automation(config.id) });
      qc.invalidateQueries({ queryKey: wk.issue(config.id, number!) });
    },
    onError: (err) => toast.error(workError(err, 'Could not run the test')),
  });
  return (
    <Dialog open={!!rule} onClose={onClose} title="Test rule" width={460}>
      <form onSubmit={(e) => { e.preventDefault(); if (number && !run.isPending) run.mutate(); }}>
        <p className="mb-3 text-[13px] leading-relaxed text-[var(--w-text-2)]">
          Runs <span className="font-medium text-[var(--w-text)]">{rule?.name}</span> on one issue now, skipping the trigger but checking its conditions. <span className="text-[var(--w-text)]">The actions are applied for real.</span>
        </p>
        <label className="w-label" htmlFor="w-test-issue">Issue</label>
        <div className="flex gap-2">
          <input id="w-test-issue" autoFocus className="w-input min-w-0 flex-1 font-mono uppercase" placeholder={`${config.key}-1`} value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} />
          <button type="submit" className="w-btn w-btn-primary shrink-0" disabled={!number || run.isPending}>
            {run.isPending && <Spinner size={12} />}
            Run test
          </button>
        </div>
        {result && (
          <div className="mt-4 flex items-start gap-2 rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[13px]">
            <StatusPill status={result.status} />
            <span className="min-w-0 break-words text-[var(--w-text-2)]">{result.message || '—'}</span>
          </div>
        )}
      </form>
    </Dialog>
  );
}

// ─── Nhật ký ─────────────────────────────────────────────────────

function AuditLog({ config, slug, rules, ruleFilter, setRuleFilter }: {
  config: ProjectConfig; slug: string; rules: AutomationRule[]; ruleFilter: number | null; setRuleFilter: (id: number | null) => void;
}) {
  const q = useQuery({
    queryKey: [...wk.automationLogs(config.id), ruleFilter ?? 'all'],
    queryFn: () => workApi.automationLogs(config.id, ruleFilter ?? undefined),
  });
  const logs: RuleLog[] = q.data ?? [];
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Select aria-label="Filter by rule" value={ruleFilter ?? ''} onChange={(e) => setRuleFilter(e.target.value ? Number(e.target.value) : null)} className="!h-[28px] w-auto max-w-full py-0 text-[12px]">
          <option value="">All rules</option>
          {rules.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </Select>
        <span className="text-[12px] text-[var(--w-text-3)]">Last 100 runs</span>
        <button type="button" className="w-btn w-btn-sm ml-auto" onClick={() => q.refetch()} disabled={q.isFetching}>
          <RefreshCw size={12} className={cn(q.isFetching && 'animate-spin')} /> Refresh
        </button>
      </div>
      {q.isLoading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : q.error ? (
        <EmptyState title="Could not load the audit log" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />
      ) : !logs.length ? (
        <div className="rounded-[8px] border border-dashed border-[var(--w-border)] px-3 py-8 text-center text-[13px] text-[var(--w-text-3)]">No runs yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
          <table className="w-full min-w-[680px] text-[13px]">
            <thead>
              <tr className="border-b border-[var(--w-border)] text-left text-[11px] uppercase tracking-wide text-[var(--w-text-3)]">
                <th className="px-3 py-2 font-medium">Time</th>
                <th className="px-3 py-2 font-medium">Rule</th>
                <th className="px-3 py-2 font-medium">Issue</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-[var(--w-border)] align-top last:border-0">
                  <td className="whitespace-nowrap px-3 py-2 text-[var(--w-text-2)]" title={new Date(l.createdAt).toLocaleString('en-US')}>{relativeTime(l.createdAt)}</td>
                  <td className="max-w-[180px] truncate px-3 py-2">{l.ruleName}</td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {l.issue ? (
                      <Link href={`/work/${slug}/${config.key}/issue/${l.issue.number}`} title={l.issue.title} className="font-mono text-[12px] text-[var(--w-accent-text)] hover:underline">
                        {config.key}-{l.issue.number}
                      </Link>
                    ) : <span className="text-[var(--w-text-3)]">—</span>}
                  </td>
                  <td className="px-3 py-2"><StatusPill status={l.status} /></td>
                  <td className="px-3 py-2 text-[var(--w-text-2)]">
                    <span className="break-words">{l.message}</span>
                    <span className="ml-1.5 text-[11px] tabular text-[var(--w-text-3)]">{l.durationMs}ms</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Danh sách luật ──────────────────────────────────────────────

function RuleRow({ rule, config, canEdit, statuses, onEdit, onTest, onDelete, onShowLog }: {
  rule: AutomationRule; config: ProjectConfig; canEdit: boolean; statuses: Statuses;
  onEdit: () => void; onTest: () => void; onDelete: () => void; onShowLog: () => void;
}) {
  const qc = useQueryClient();
  const toggle = useMutation({
    mutationFn: (enabled: boolean) => workApi.setAutomationEnabled(config.id, rule.id, enabled),
    onMutate: async (enabled) => {
      // Lạc quan: công tắc đổi ngay, lỗi thì tải lại.
      qc.setQueryData<AutomationRule[]>(wk.automation(config.id), (old) => old?.map((r) => (r.id === rule.id ? { ...r, enabled } : r)));
    },
    onSuccess: (_d, enabled) => toast.success(enabled ? `“${rule.name}” enabled` : `“${rule.name}” disabled`),
    onError: (err) => toast.error(workError(err, 'Could not update the rule')),
    onSettled: () => qc.invalidateQueries({ queryKey: wk.automation(config.id) }),
  });
  const then = rule.config.actions.map((a) => actionSummary(a, config, statuses)).join(', ');
  return (
    <div className={cn('flex items-start gap-3 border-b border-[var(--w-border)] px-3 py-3 last:border-b-0', !rule.enabled && 'opacity-70')}>
      <div className="pt-0.5">
        <Switch checked={rule.enabled} disabled={!canEdit || toggle.isPending} onChange={(v) => toggle.mutate(v)} label={rule.enabled ? 'Disable rule' : 'Enable rule'} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onEdit} className="min-w-0 truncate text-left text-[13px] font-medium text-[var(--w-text)] hover:underline">{rule.name}</button>
          {rule.recentProblems > 0 && (
            <button
              type="button"
              onClick={onShowLog}
              title="Show in audit log"
              className="inline-flex h-[18px] items-center gap-1 rounded-full bg-[var(--w-red)] px-1.5 text-[10.5px] font-semibold text-white"
            >
              <AlertTriangle size={10} /> {rule.recentProblems} {rule.recentProblems === 1 ? 'problem' : 'problems'} · 24h
            </button>
          )}
        </div>
        <div className="mt-0.5 break-words text-[12px] text-[var(--w-text-2)]">
          {whenSummary(rule.trigger, rule.config, statuses)}
          {then && <span className="text-[var(--w-text-3)]"> → {then}</span>}
        </div>
        <div className="mt-0.5 text-[11.5px] tabular text-[var(--w-text-3)]">
          {rule.runCount ? `Ran ${rule.runCount} ${rule.runCount === 1 ? 'time' : 'times'}` : 'Never run'}
          {rule.lastRunAt && <> · last {relativeTime(rule.lastRunAt)}</>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        {canEdit && (
          <>
            <button type="button" className="w-btn w-btn-ghost w-btn-sm max-sm:!hidden" onClick={onTest} title="Test on an issue"><FlaskConical size={12} /> Test</button>
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm sm:!hidden" onClick={onTest} aria-label="Test on an issue" title="Test on an issue"><FlaskConical size={13} /></button>
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onEdit} aria-label="Edit rule" title="Edit rule"><Pencil size={13} /></button>
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onDelete} aria-label="Delete rule" title="Delete rule"><Trash2 size={13} /></button>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProjectAutomation({ config, slug }: { config: ProjectConfig; slug: string }) {
  const qc = useQueryClient();
  const canEdit = config.permissions.settings;
  const statuses = useStatuses(config);
  const [view, setView] = useState<'rules' | 'log'>('rules');
  const [ruleFilter, setRuleFilter] = useState<number | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [testing, setTesting] = useState<AutomationRule | null>(null);
  const [deleting, setDeleting] = useState<AutomationRule | null>(null);

  const q = useQuery({ queryKey: wk.automation(config.id), queryFn: () => workApi.automationRules(config.id) });
  const rules = q.data ?? [];

  const del = useMutation({
    mutationFn: (id: number) => workApi.deleteAutomationRule(config.id, id),
    onSuccess: () => { toast.success('Rule deleted'); setDeleting(null); qc.invalidateQueries({ queryKey: wk.automation(config.id) }); },
    onError: (err) => toast.error(workError(err, 'Could not delete the rule')),
  });

  const blank = (): Draft => ({ name: '', enabled: true, trigger: 'issue.created', config: { conditions: [], actions: [defaultAction('comment', config, statuses)] } });
  const fromRule = (r: AutomationRule): Draft => ({
    id: r.id, name: r.name, enabled: r.enabled, trigger: r.trigger,
    // Chép sâu để sửa nháp không đụng vào dữ liệu trong bộ nhớ đệm.
    config: JSON.parse(JSON.stringify({ conditions: [], ...r.config })) as RuleConfig,
  });
  const applyTemplate = (t: (typeof TEMPLATES)[number]) => {
    const d = t.build(config, statuses);
    if (typeof d === 'string') toast.error(d);
    else setEditing(d);
  };

  const viewTabs = (
    <div role="tablist" aria-label="Automation view" className="inline-flex overflow-hidden rounded-[6px] border border-[var(--w-border-strong)]">
      {([['rules', 'Rules'], ['log', 'Audit log']] as const).map(([id, label], i) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={view === id}
          onClick={() => setView(id)}
          className={cn('h-[28px] px-3 text-[12px] font-medium', i > 0 && 'border-l border-[var(--w-border-strong)]', view === id ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <Section
        title="Automation"
        description="Automate repetitive work: when something happens to an issue, check optional conditions, then run actions. Changes made by rules appear in issue history as “Automation”."
        action={canEdit && view === 'rules' ? <button type="button" className="w-btn w-btn-primary" onClick={() => setEditing(blank())}><Plus size={14} /> Create rule</button> : undefined}
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {viewTabs}
          <p className="min-w-0 flex-1 text-[12px] text-[var(--w-text-3)]">
            Loop protection: a rule never re-triggers itself, chains stop after 3 rules in a row, and each rule runs at most 200 times an hour.
          </p>
        </div>

        {view === 'log' ? (
          <AuditLog config={config} slug={slug} rules={rules} ruleFilter={ruleFilter} setRuleFilter={setRuleFilter} />
        ) : q.isLoading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : q.error ? (
          <EmptyState title="Could not load rules" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />
        ) : (
          <>
            <div className={cn('overflow-hidden rounded-[8px] border border-[var(--w-border)]', !rules.length && 'border-dashed')}>
              {rules.map((r) => (
                <RuleRow
                  key={r.id}
                  rule={r}
                  config={config}
                  canEdit={canEdit}
                  statuses={statuses}
                  onEdit={() => setEditing(fromRule(r))}
                  onTest={() => setTesting(r)}
                  onDelete={() => setDeleting(r)}
                  onShowLog={() => { setRuleFilter(r.id); setView('log'); }}
                />
              ))}
              {!rules.length && (
                <div className="px-3 py-8 text-center text-[13px] text-[var(--w-text-3)]">
                  No rules yet.{canEdit && ' Start from a template below or create your own.'}
                </div>
              )}
            </div>

            {canEdit && (
              <div className="mt-6">
                <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[var(--w-text-3)]">Templates</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => applyTemplate(t)}
                      className="flex items-start gap-2.5 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3 text-left transition-colors hover:border-[var(--w-accent-border)] hover:bg-[var(--w-hover)]"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]">{t.icon}</span>
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium">{t.title}</span>
                        <span className="mt-0.5 block text-[12px] leading-relaxed text-[var(--w-text-2)]">{t.body}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Section>

      <RuleEditor open={!!editing} initial={editing} onClose={() => setEditing(null)} config={config} canEdit={canEdit} />
      <TestDialog rule={testing} onClose={() => setTesting(null)} config={config} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete rule?"
        body={<>The rule <span className="font-medium text-[var(--w-text)]">{deleting?.name}</span> and its audit log will be deleted. Changes it already made to issues stay.</>}
        confirmLabel="Delete rule"
        pending={del.isPending}
        onConfirm={() => deleting && del.mutate(deleting.id)}
      />
    </>
  );
}
