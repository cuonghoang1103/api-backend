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
  type RuleLog, type RuleLogStatus, type RuleTestResult, type RuleTrigger,
} from '@/lib/work-api';
import { wk } from '../hooks';
import { JqlInput } from '../search/JqlInput';
import { jqlErrorOf, quote } from '../search/jql';
import { Dialog, EmptyState, PickerList, Popover, PRIORITIES, Spinner, relativeTime, useToggle } from '../ui';
import { ConfirmDialog, Section, Select, Switch } from './shared';
import { wt, wfmt } from '@/components/work/i18n';

// ─── Từ điển ─────────────────────────────────────────────────────

const TRIGGERS: Array<{ id: RuleTrigger; label: string; help: string }> = [
  { id: 'issue.created', get label() { return wt('auto.tCreated'); }, get help() { return wt('auto.tCreatedH'); } },
  { id: 'issue.transitioned', get label() { return wt('auto.tTransitioned'); }, get help() { return wt('auto.tTransitionedH'); } },
  { id: 'issue.assigned', get label() { return wt('auto.tAssigned'); }, get help() { return wt('auto.tAssignedH'); } },
  { id: 'field.changed', get label() { return wt('auto.tField'); }, get help() { return wt('auto.tFieldH'); } },
  { id: 'comment.added', get label() { return wt('auto.tComment'); }, get help() { return wt('auto.tCommentH'); } },
  { id: 'scheduled.daily', get label() { return wt('auto.tDaily'); }, get help() { return wt('auto.tDailyH'); } },
];

const FIELDS: Array<{ id: string; label: string }> = [
  { id: 'priority', get label() { return wt('common.priority'); } },
  { id: 'assigneeId', get label() { return wt('common.assignee'); } },
  { id: 'storyPoints', get label() { return wt('common.storyPoints'); } },
  { id: 'dueDate', get label() { return wt('common.dueDate'); } },
  { id: 'startDate', get label() { return wt('common.startDate'); } },
  { id: 'sprintId', get label() { return wt('common.sprint'); } },
  { id: 'fixVersionId', get label() { return wt('detail.fixVersion'); } },
  { id: 'parentId', get label() { return wt('common.parent'); } },
  { id: 'title', get label() { return wt('common.summary'); } },
  { id: 'description', get label() { return wt('common.description'); } },
];

const ACTIONS: Array<{ id: RuleActionKind; label: string }> = [
  { id: 'transition', get label() { return wt('auto.aTransition'); } },
  { id: 'assign', get label() { return wt('auto.aAssign'); } },
  { id: 'set_priority', get label() { return wt('auto.aPriority'); } },
  { id: 'add_label', get label() { return wt('auto.aLabel'); } },
  { id: 'comment', get label() { return wt('auto.aComment'); } },
  { id: 'move_to_active_sprint', get label() { return wt('auto.aSprint'); } },
  { id: 'notify', get label() { return wt('auto.aNotify'); } },
  { id: 'create_subtask', get label() { return wt('auto.aSubtask'); } },
];

const LOG_STATUS: Record<RuleLogStatus, { label: string; cls: string }> = {
  SUCCESS: { get label() { return wt('auto.lSuccess'); }, cls: 'text-[var(--w-green)] bg-[color-mix(in_srgb,var(--w-green)_12%,transparent)] border-[color-mix(in_srgb,var(--w-green)_35%,transparent)]' },
  NO_MATCH: { get label() { return wt('auto.lNoMatch'); }, cls: 'text-[var(--w-text-2)] bg-[var(--w-sunken)] border-[var(--w-border-strong)]' },
  FAILED: { get label() { return wt('auto.lFailed'); }, cls: 'text-[var(--w-red)] bg-[color-mix(in_srgb,var(--w-red)_12%,transparent)] border-[color-mix(in_srgb,var(--w-red)_35%,transparent)]' },
  LOOP_BLOCKED: { get label() { return wt('auto.lLoop'); }, cls: 'text-[var(--w-orange)] bg-[color-mix(in_srgb,var(--w-orange)_12%,transparent)] border-[color-mix(in_srgb,var(--w-orange)_35%,transparent)]' },
  THROTTLED: { get label() { return wt('auto.lThrottled'); }, cls: 'text-[var(--w-orange)] bg-[color-mix(in_srgb,var(--w-orange)_12%,transparent)] border-[color-mix(in_srgb,var(--w-orange)_35%,transparent)]' },
  DRY_RUN: { get label() { return wt('auto.lDry'); }, cls: 'text-[var(--w-text-2)] bg-[var(--w-sunken)] border-[var(--w-border-strong)]' },
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
  return (ids ?? []).map((id) => statuses.find((s) => s.id === id)?.name ?? wt('auto.unknown')).join(wt('auto.or'));
}

function whenSummary(trigger: RuleTrigger, cfg: RuleConfig, statuses: Statuses): string {
  switch (trigger) {
    case 'issue.created': return wt('auto.wCreated');
    case 'issue.assigned': return wt('auto.wAssigned');
    case 'comment.added': return wt('auto.wComment');
    case 'field.changed': {
      const f = (cfg.fields ?? []).map((x) => FIELDS.find((y) => y.id === x)?.label ?? x);
      return f.length ? wt('auto.wFieldX', { f: f.join(', ') }) : wt('auto.wField');
    }
    case 'issue.transitioned': {
      const from = names(cfg.fromStatusIds, statuses);
      const to = names(cfg.toStatusIds, statuses);
      if (from && to) return wt('auto.wFromTo', { a: from, b: to });
      if (to) return wt('auto.wTo', { b: to });
      if (from) return wt('auto.wLeaves', { a: from });
      return wt('auto.wTransitioned');
    }
    case 'scheduled.daily': return wt('auto.wDaily');
    default: return trigger;
  }
}

function actionSummary(a: RuleAction, config: ProjectConfig, statuses: Statuses): string {
  switch (a.kind) {
    case 'transition': return wt('auto.sMove', { x: statuses.find((s) => s.id === a.statusId)?.name ?? '…' });
    case 'assign': return a.assignee === null || a.assignee === undefined ? wt('auto.sUnassign') : a.assignee === 'reporter' ? wt('auto.sToReporter') : wt('auto.sAssignTo', { x: userName(config.members.find((m) => m.id === a.assignee)) });
    case 'set_priority': return wt('auto.sPriority', { x: PRIORITIES.find((p) => p.value === a.priority)?.label ?? '…' });
    case 'add_label': return wt('auto.sLabel', { x: config.labels.find((l) => l.id === a.labelId)?.name ?? '…' });
    case 'comment': return wt('auto.sComment');
    case 'move_to_active_sprint': return wt('auto.sSprint');
    case 'notify': return wt('auto.sNotify');
    case 'create_subtask': return wt('auto.sSubtask');
    default: return a.kind;
  }
}

// ─── Mẫu luật ────────────────────────────────────────────────────

interface Draft { id?: number; name: string; enabled: boolean; trigger: RuleTrigger; config: RuleConfig }

const TEMPLATES: Array<{ id: string; title: string; body: string; icon: ReactNode; build: (config: ProjectConfig, statuses: Statuses) => Draft | string }> = [
  {
    id: 'bug-priority',
    get title() { return wt('auto.tplBug'); },
    get body() { return wt('auto.tplBugB'); },
    icon: <AlertTriangle size={14} />,
    build: (config) => {
      const bug = config.issueTypes.find((t) => t.key === 'BUG');
      if (!bug) return wt('auto.noBug');
      return { name: wt('auto.tplBug'), enabled: true, trigger: 'issue.created', config: { conditions: [{ jql: `type = ${quote(bug.name)}` }], actions: [{ kind: 'set_priority', priority: 2 }] } };
    },
  },
  {
    id: 'done-comment',
    get title() { return wt('auto.tplDone'); },
    get body() { return wt('auto.tplDoneB'); },
    icon: <MessageSquare size={14} />,
    build: (_config, statuses) => {
      const done = statuses.filter((s) => s.category === 'DONE').map((s) => s.id);
      if (!done.length) return wt('auto.noDone');
      return { name: wt('auto.tplDone'), enabled: true, trigger: 'issue.transitioned', config: { toStatusIds: done, actions: [{ kind: 'comment', text: wt('auto.resolvedText') }] } };
    },
  },
  {
    id: 'assigned-start',
    get title() { return wt('auto.tplStart'); },
    get body() { return wt('auto.tplStartB'); },
    icon: <UserCheck size={14} />,
    build: (_config, statuses) => {
      const target = statuses.find((s) => s.category === 'IN_PROGRESS' && s.workflowDefault) ?? statuses.find((s) => s.category === 'IN_PROGRESS');
      if (!target) return wt('auto.noProgress');
      return {
        name: wt('auto.tplStart'), enabled: true, trigger: 'issue.assigned',
        config: { conditions: [{ jql: 'statusCategory = "To Do"' }], actions: [{ kind: 'transition', statusId: target.id }] },
      };
    },
  },
  {
    id: 'overdue-daily',
    get title() { return wt('auto.tplOverdue'); },
    get body() { return wt('auto.tplOverdueB'); },
    icon: <CalendarClock size={14} />,
    build: () => ({
      name: wt('auto.tplOverdue'), enabled: true, trigger: 'scheduled.daily',
      config: {
        jql: 'due < startOfDay() AND statusCategory != Done',
        actions: [{ kind: 'notify', to: ['assignee'], text: wt('auto.overdueText') }],
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
      setResult(wt('auto.valid', { count: r.total }));
    } catch (err) {
      const je = jqlErrorOf(err);
      if (je) setError(je);
      else setResult(workError(err, wt('auto.checkFailed')));
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
        runLabel={wt('auto.check')}
        placeholder={wt('auto.jqlPh')}
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
        <Select aria-label={wt('auto.targetStatus')} value={action.statusId ?? ''} disabled={disabled} onChange={(e) => onChange({ ...action, statusId: Number(e.target.value) })}>
          {statuses.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </Select>
      );
    case 'assign':
      return (
        <Select
          aria-label={wt('common.assignee')}
          disabled={disabled}
          value={action.assignee === null || action.assignee === undefined ? '' : String(action.assignee)}
          onChange={(e) => onChange({ ...action, assignee: e.target.value === '' ? null : e.target.value === 'reporter' ? 'reporter' : Number(e.target.value) })}
        >
          <option value="reporter">{wt('common.reporter')}</option>
          <option value="">{wt('common.unassigned')}</option>
          <optgroup label={wt('common.members')}>
            {assignable.map((m) => <option key={m.id} value={m.id}>{userName(m)}</option>)}
          </optgroup>
        </Select>
      );
    case 'set_priority':
      return (
        <Select aria-label={wt('common.priority')} value={action.priority ?? 3} disabled={disabled} onChange={(e) => onChange({ ...action, priority: Number(e.target.value) })}>
          {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </Select>
      );
    case 'add_label':
      return config.labels.length ? (
        <Select aria-label={wt('issues.label')} value={action.labelId ?? ''} disabled={disabled} onChange={(e) => onChange({ ...action, labelId: Number(e.target.value) })}>
          {config.labels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </Select>
      ) : (
        <p className="text-[12px] text-[var(--w-text-3)]">{wt('auto.noLabels')}</p>
      );
    case 'comment':
      return (
        <textarea
          aria-label={wt('auto.commentText')}
          rows={2}
          maxLength={2000}
          disabled={disabled}
          className="w-input !h-auto py-2"
          placeholder={wt('auto.commentPh')}
          value={action.text ?? ''}
          onChange={(e) => onChange({ ...action, text: e.target.value })}
        />
      );
    case 'move_to_active_sprint':
      return <p className="text-[12px] text-[var(--w-text-3)]">{wt('auto.sprintNote')}</p>;
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
                {r === 'assignee' ? wt('common.assignee') : r === 'reporter' ? wt('common.reporter') : wt('auto.watchers')}
              </label>
            ))}
          </div>
          <MultiPick
            options={config.members.map((m) => ({ value: m.id, label: userName(m) }))}
            value={people}
            disabled={disabled}
            placeholder={wt('auto.alsoNotify')}
            onChange={(ids) => setTo([...to.filter((x) => typeof x !== 'number'), ...ids])}
          />
          <textarea
            aria-label={wt('auto.notifMsg')}
            rows={2}
            maxLength={2000}
            disabled={disabled}
            className="w-input !h-auto py-2"
            placeholder={wt('auto.message')}
            value={action.text ?? ''}
            onChange={(e) => onChange({ ...action, text: e.target.value })}
          />
        </div>
      );
    }
    case 'create_subtask':
      return config.issueTypes.some((t) => t.level === -1) ? (
        <input
          aria-label={wt('auto.subtaskTitle')}
          maxLength={255}
          disabled={disabled}
          className="w-input"
          placeholder={wt('auto.subtaskTitle')}
          value={action.title ?? ''}
          onChange={(e) => onChange({ ...action, title: e.target.value })}
        />
      ) : (
        <p className="text-[12px] text-[var(--w-text-3)]">{wt('auto.noSubtaskType')}</p>
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
        <span className="text-[12px] font-semibold text-[var(--w-text-2)]">{label}</span>
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
      toast.success(initial?.id ? wt('auto.ruleSaved', { n: r.name }) : wt('auto.ruleCreated', { n: r.name }));
      qc.invalidateQueries({ queryKey: wk.automation(config.id) });
      onClose();
    },
    onError: (err) => toast.error(workError(err, wt('auto.saveFailed'))),
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
      title={ro ? wt('auto.viewRule') : d.id ? wt('auto.editRule') : wt('auto.createRule')}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>{ro ? wt('common.close') : wt('common.cancel')}</button>
          {!ro && (
            <button type="button" className="w-btn w-btn-primary" disabled={!valid || save.isPending} onClick={() => save.mutate(d)}>
              {save.isPending && <Spinner size={12} />}
              {d.id ? wt('auto.saveRule') : wt('auto.createRule')}
            </button>
          )}
        </>
      }
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label className="w-label" htmlFor="w-rule-name">{wt('auto.ruleName')}</label>
          <input id="w-rule-name" className="w-input" maxLength={100} disabled={ro} autoFocus={!d.id && !ro} placeholder={wt('auto.ruleNamePh')} value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} />
        </div>
        <label className="flex h-[32px] items-center gap-2 text-[13px] text-[var(--w-text-2)]">
          <Switch checked={d.enabled} disabled={ro} onChange={(enabled) => setD({ ...d, enabled })} label={wt('auto.ruleEnabled')} />
          {wt('auto.enabledWord')}
        </label>
      </div>

      <Block label={wt('auto.when')} tone="var(--w-accent)" icon={<Zap size={12} />}>
        <Select
          aria-label={wt('auto.trigger')}
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
              <label className="w-label">{wt('auto.fromStatus')}</label>
              <MultiPick options={statusOpts} value={cfg.fromStatusIds ?? []} disabled={ro} placeholder={wt('auto.anyStatus')} onChange={(fromStatusIds) => setCfg({ fromStatusIds })} />
            </div>
            <div>
              <label className="w-label">{wt('auto.toStatus')}</label>
              <MultiPick options={statusOpts} value={cfg.toStatusIds ?? []} disabled={ro} placeholder={wt('auto.anyStatus')} onChange={(toStatusIds) => setCfg({ toStatusIds })} />
            </div>
          </div>
        )}
        {d.trigger === 'field.changed' && (
          <div>
            <label className="w-label">{wt('auto.fieldsWatch')}</label>
            <MultiPick options={FIELDS.map((f) => ({ value: f.id, label: f.label }))} value={cfg.fields ?? []} disabled={ro} placeholder={wt('auto.pickFields')} onChange={(fields) => setCfg({ fields })} />
          </div>
        )}
        {d.trigger === 'scheduled.daily' && (
          <div>
            <label className="w-label">{wt('auto.runOn')}</label>
            <JqlField config={config} value={cfg.jql ?? ''} disabled={ro} onChange={(jql) => setCfg({ jql })} />
          </div>
        )}
      </Block>

      <Connector />

      <Block label={wt('auto.ifW')} tone="var(--w-orange)" icon={<FlaskConical size={12} />}>
        {!conditions.length && <p className="text-[12px] text-[var(--w-text-3)]">{wt('auto.noConditions')}</p>}
        {conditions.map((c, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <JqlField config={config} value={c.jql} disabled={ro} onChange={(jql) => setCfg({ conditions: conditions.map((x, j) => (j === i ? { jql } : x)) })} />
            </div>
            {!ro && (
              <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm mt-0.5" aria-label={wt('auto.removeCond')} title={wt('auto.removeCond')} onClick={() => setCfg({ conditions: conditions.filter((_, j) => j !== i) })}>
                <X size={13} />
              </button>
            )}
          </div>
        ))}
        {!ro && conditions.length < 10 && (
          <button type="button" className="w-btn w-btn-sm" onClick={() => setCfg({ conditions: [...conditions, { jql: '' }] })}>
            <Plus size={12} /> {wt('auto.addJql')}
          </button>
        )}
        {conditions.length > 1 && <p className="text-[12px] text-[var(--w-text-3)]">{wt('auto.matchEvery')}</p>}
      </Block>

      <Connector />

      <Block label={wt('auto.then')} tone="var(--w-green)" icon={<Bell size={12} />}>
        {cfg.actions.map((a, i) => (
          <div key={i} className="rounded-[6px] border border-[var(--w-border)] p-2.5">
            <div className="mb-2 flex items-center gap-2">
              <span className="w-5 shrink-0 text-center text-[12px] tabular text-[var(--w-text-3)]">{i + 1}.</span>
              <Select
                aria-label={wt('auto.actionN', { n: i + 1 })}
                value={a.kind}
                disabled={ro}
                onChange={(e) => setAction(i, defaultAction(e.target.value as RuleActionKind, config, statuses))}
                className="min-w-0 flex-1"
              >
                {ACTIONS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
              </Select>
              {!ro && (
                <div className="flex shrink-0">
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={i === 0} onClick={() => moveAction(i, -1)} aria-label={wt('auto.moveUp')} title={wt('auto.moveUp')}><ArrowUp size={12} /></button>
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={i === cfg.actions.length - 1} onClick={() => moveAction(i, 1)} aria-label={wt('auto.moveDown')} title={wt('auto.moveDown')}><ArrowDown size={12} /></button>
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => setCfg({ actions: cfg.actions.filter((_, j) => j !== i) })} aria-label={wt('auto.removeAction')} title={wt('auto.removeAction')}><X size={13} /></button>
                </div>
              )}
            </div>
            <div className="sm:pl-7">
              <ActionEditor action={a} onChange={(x) => setAction(i, x)} config={config} statuses={statuses} disabled={ro} />
            </div>
          </div>
        ))}
        {!cfg.actions.length && <p className="text-[12px] text-[var(--w-red)]">{wt('auto.addOne')}</p>}
        {!ro && cfg.actions.length < 10 && (
          <button type="button" className="w-btn w-btn-sm" onClick={() => setCfg({ actions: [...cfg.actions, defaultAction('comment', config, statuses)] })}>
            <Plus size={12} /> {wt('auto.addAction')}
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
  const [result, setResult] = useState<RuleTestResult | null>(null);
  const [seen, setSeen] = useState<AutomationRule | null>(null);
  if (rule !== seen) { setSeen(rule); setText(''); setResult(null); }
  // Nhận "12" hoặc "KEY-12".
  const m = /^(?:[a-z][a-z0-9]*-)?(\d+)$/i.exec(text.trim());
  const number = m ? Number(m[1]) : null;
  // CTW-7: "Run test" = chạy thử (không đổi gì); "Apply for real" mới chạy thật trên thẻ.
  const run = useMutation({
    mutationFn: (execute: boolean) => workApi.testAutomationRule(config.id, rule!.id, number!, execute),
    onSuccess: (r) => {
      setResult(r);
      qc.invalidateQueries({ queryKey: wk.automation(config.id) });
      qc.invalidateQueries({ queryKey: wk.issue(config.id, number!) });
    },
    onError: (err) => toast.error(workError(err, wt('auto.testFailed'))),
  });
  return (
    <Dialog open={!!rule} onClose={onClose} title={wt('auto.testRule')} width={460}>
      <form onSubmit={(e) => { e.preventDefault(); if (number && !run.isPending) run.mutate(false); }}>
        <p className="mb-3 text-[13px] leading-relaxed text-[var(--w-text-2)]">
          {wt('auto.dryRunsA')} <span className="font-medium text-[var(--w-text)]">{rule?.name}</span> {wt('auto.dryRunsB')} <span className="text-[var(--w-text)]">{wt('auto.nothingChanged')}</span> {wt('auto.dryRunsC')}
        </p>
        <label className="w-label" htmlFor="w-test-issue">{wt('common.issue')}</label>
        <div className="flex gap-2">
          <input id="w-test-issue" autoFocus className="w-input min-w-0 flex-1 font-mono uppercase" placeholder={`${config.key}-1`} value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} />
          <button type="submit" className="w-btn w-btn-primary shrink-0" disabled={!number || run.isPending}>
            {run.isPending && <Spinner size={12} />}
            {wt('auto.runTest')}
          </button>
        </div>
        {result && (
          <div className="mt-4 rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[13px]">
            <div className="flex items-start gap-2">
              <StatusPill status={result.status} />
              <span className="min-w-0 break-words text-[var(--w-text-2)]">{result.dryRun && result.actions.length ? wt('auto.dryResult') : (result.message || '—')}</span>
            </div>
            {result.dryRun && result.actions.length > 0 && (
              <>
                <ul className="mt-2 list-disc space-y-0.5 pl-5 text-[var(--w-text-2)]">
                  {result.actions.map((a, i) => (
                    <li key={i} className={cn('break-words', !a.willChange && 'text-[var(--w-text-3)]')}>{a.summary}</li>
                  ))}
                </ul>
                {result.actions.some((a) => a.willChange) && (
                  <button type="button" className="w-btn w-btn-sm mt-2" disabled={run.isPending} onClick={() => run.mutate(true)}>
                    {wt('auto.applyReal', { k: `${config.key}-${number}` })}
                  </button>
                )}
              </>
            )}
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
        <Select aria-label={wt('auto.filterRule')} value={ruleFilter ?? ''} onChange={(e) => setRuleFilter(e.target.value ? Number(e.target.value) : null)} className="!h-[28px] w-auto max-w-full py-0 text-[12px]">
          <option value="">{wt('auto.allRules')}</option>
          {rules.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </Select>
        <span className="text-[12px] text-[var(--w-text-3)]">{wt('auto.last100')}</span>
        <button type="button" className="w-btn w-btn-sm ml-auto" onClick={() => q.refetch()} disabled={q.isFetching}>
          <RefreshCw size={12} className={cn(q.isFetching && 'animate-spin')} /> {wt('auto.refresh')}
        </button>
      </div>
      {q.isLoading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : q.error ? (
        <EmptyState title={wt('auto.logFailed')} body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>{wt('common.tryAgain')}</button>} />
      ) : !logs.length ? (
        <div className="rounded-[8px] border border-dashed border-[var(--w-border)] px-3 py-8 text-center text-[13px] text-[var(--w-text-3)]">{wt('auto.noRuns')}</div>
      ) : (
        <div className="overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
          <table className="w-full min-w-[680px] text-[13px]">
            <thead>
              <tr className="border-b border-[var(--w-border)] text-left text-[11px] text-[var(--w-text-3)]">
                <th className="px-3 py-2 font-medium">{wt('auto.time')}</th>
                <th className="px-3 py-2 font-medium">{wt('auto.rule')}</th>
                <th className="px-3 py-2 font-medium">{wt('common.issue')}</th>
                <th className="px-3 py-2 font-medium">{wt('common.status')}</th>
                <th className="px-3 py-2 font-medium">{wt('common.details')}</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-[var(--w-border)] align-top last:border-0">
                  <td className="whitespace-nowrap px-3 py-2 text-[var(--w-text-2)]" title={new Date(l.createdAt).toLocaleString(wfmt.intl())}>{relativeTime(l.createdAt)}</td>
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
    onSuccess: (_d, enabled) => toast.success(enabled ? wt('auto.enabledToast', { n: rule.name }) : wt('auto.disabledToast', { n: rule.name })),
    onError: (err) => toast.error(workError(err, wt('auto.updateFailed'))),
    onSettled: () => qc.invalidateQueries({ queryKey: wk.automation(config.id) }),
  });
  const then = rule.config.actions.map((a) => actionSummary(a, config, statuses)).join(', ');
  return (
    <div className={cn('flex items-start gap-3 border-b border-[var(--w-border)] px-3 py-3 last:border-b-0', !rule.enabled && 'opacity-70')}>
      <div className="pt-0.5">
        <Switch checked={rule.enabled} disabled={!canEdit || toggle.isPending} onChange={(v) => toggle.mutate(v)} label={rule.enabled ? wt('auto.disableRule') : wt('auto.enableRule')} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onEdit} className="min-w-0 truncate text-left text-[13px] font-medium text-[var(--w-text)] hover:underline">{rule.name}</button>
          {rule.recentProblems > 0 && (
            <button
              type="button"
              onClick={onShowLog}
              title={wt('auto.showLog')}
              className="inline-flex h-[18px] items-center gap-1 rounded-full bg-[var(--w-red)] px-1.5 text-[10.5px] font-semibold text-white"
            >
              <AlertTriangle size={10} /> {wt('auto.problems', { count: rule.recentProblems })}
            </button>
          )}
        </div>
        <div className="mt-0.5 break-words text-[12px] text-[var(--w-text-2)]">
          {whenSummary(rule.trigger, rule.config, statuses)}
          {then && <span className="text-[var(--w-text-3)]"> → {then}</span>}
        </div>
        <div className="mt-0.5 text-[11.5px] tabular text-[var(--w-text-3)]">
          {rule.runCount ? wt('auto.ranN', { count: rule.runCount }) : wt('auto.neverRun')}
          {rule.lastRunAt && <> {wt('auto.lastAgo', { t: relativeTime(rule.lastRunAt) })}</>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        {canEdit && (
          <>
            <button type="button" className="w-btn w-btn-ghost w-btn-sm max-sm:!hidden" onClick={onTest} title={wt('auto.testOn')}><FlaskConical size={12} /> {wt('agents.test')}</button>
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm sm:!hidden" onClick={onTest} aria-label={wt('auto.testOn')} title={wt('auto.testOn')}><FlaskConical size={13} /></button>
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onEdit} aria-label={wt('auto.editRule')} title={wt('auto.editRule')}><Pencil size={13} /></button>
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onDelete} aria-label={wt('auto.deleteRule')} title={wt('auto.deleteRule')}><Trash2 size={13} /></button>
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
    onSuccess: () => { toast.success(wt('auto.ruleDeleted')); setDeleting(null); qc.invalidateQueries({ queryKey: wk.automation(config.id) }); },
    onError: (err) => toast.error(workError(err, wt('auto.deleteFailed'))),
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
    <div role="tablist" aria-label={wt('auto.viewTabs')} className="inline-flex overflow-hidden rounded-[6px] border border-[var(--w-border-strong)]">
      {([['rules', wt('auto.rulesTab')], ['log', wt('audit.auditLog')]] as const).map(([id, label], i) => (
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
        title={wt('auto.title')}
        description={wt('auto.desc')}
        action={canEdit && view === 'rules' ? <button type="button" className="w-btn w-btn-primary" onClick={() => setEditing(blank())}><Plus size={14} /> {wt('auto.createRule')}</button> : undefined}
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {viewTabs}
          <p className="min-w-0 flex-1 text-[12px] text-[var(--w-text-3)]">
            {wt('auto.loop')}
          </p>
        </div>

        {view === 'log' ? (
          <AuditLog config={config} slug={slug} rules={rules} ruleFilter={ruleFilter} setRuleFilter={setRuleFilter} />
        ) : q.isLoading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : q.error ? (
          <EmptyState title={wt('auto.loadFailed')} body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>{wt('common.tryAgain')}</button>} />
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
                  {wt('auto.noRules')}{canEdit && wt('auto.startTpl')}
                </div>
              )}
            </div>

            {canEdit && (
              <div className="mt-6">
                <h3 className="mb-2 text-[12px] font-semibold text-[var(--w-text-2)]">{wt('auto.templates')}</h3>
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
        title={wt('auto.deleteQ')}
        body={wt('auto.deleteBody', { n: deleting?.name ?? '' })}
        confirmLabel={wt('auto.deleteRule')}
        pending={del.isPending}
        onConfirm={() => deleting && del.mutate(deleting.id)}
      />
    </>
  );
}
