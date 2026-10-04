'use client';

/**
 * Lớp studio trong CHI TIẾT THẺ (S1): ô Team + ô Stage ở cột thuộc tính, khu
 * Approvals + Handoffs ở cột chính, hộp "Move to another project" của menu ⋯.
 * Mỗi mảnh tự ẩn khi mô-đun của nó tắt (studioOn) — dự án cũ không thấy gì.
 */

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowDown, ArrowRightLeft, ArrowUp, BadgeCheck, Plus, Send, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  userName, workApi, workError, workStudioApi, workStudioKeys, type ApprovalMode, type IssueDetail, type ProjectConfig,
} from '@/lib/work-api';
import { Trigger, usePick } from '../fields';
import { wk, type Lookups } from '../hooks';
import { Dialog, Field, PickerList, Popover, ProjectMark, Spinner, UserAvatar, formatDate, relativeTime } from '../ui';
import { Select } from '../settings/shared';
import { ApprovalDialog } from './ApprovalDetail';
import HandoffCard from './HandoffCard';
import { ApprovalPill, Pill, TeamChip, studioOn, useStudioInvalidate, useWorkspaceTeams } from './shared';

// ─── Ô Team / Stage ở cột thuộc tính ─────────────────────────────

export function TeamPicker({ config, value, onChange, disabled }: { config: ProjectConfig; value: number | null | undefined; onChange: (id: number | null) => void; disabled?: boolean }) {
  const p = usePick();
  const teams = useWorkspaceTeams(config.workspace.id, studioOn(config, 'teams'));
  const cur = teams.data?.find((t) => t.id === value) ?? null;
  return (
    <>
      <Trigger triggerRef={p.ref} onClick={p.toggle} bare disabled={disabled}>
        {cur ? <TeamChip team={cur} /> : null}
        <span className={cn('flex-1 truncate', !cur && 'text-[var(--w-text-3)]')}>{cur ? cur.name : value ? 'Archived team' : 'No team'}</span>
      </Trigger>
      <Popover open={p.on} onClose={p.close} anchorRef={p.ref} width={250}>
        <PickerList
          options={[
            { value: 0, label: 'No team' },
            ...(teams.data ?? []).filter((t) => !t.archivedAt).map((t) => ({
              value: t.id, label: t.name, keywords: t.key,
              icon: <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />,
              hint: t.key,
            })),
          ]}
          selected={[value ?? 0]}
          onPick={(v) => { onChange(v || null); p.close(); }}
          placeholder="Team…"
          empty={teams.isLoading ? 'Loading…' : 'No teams yet — create them under Teams'}
        />
      </Popover>
    </>
  );
}

export function StagePicker({ config, value, onChange, disabled }: { config: ProjectConfig; value: number | null | undefined; onChange: (id: number | null) => void; disabled?: boolean }) {
  const p = usePick();
  const stages = useQuery({ queryKey: workStudioKeys.stages(config.id), queryFn: () => workStudioApi.stages(config.id), enabled: studioOn(config, 'stages'), staleTime: 30_000 });
  const cur = stages.data?.find((s) => s.id === value) ?? null;
  return (
    <>
      <Trigger triggerRef={p.ref} onClick={p.toggle} bare disabled={disabled}>
        {cur && <span className="shrink-0 font-mono text-[11px] text-[var(--w-text-3)]">{cur.n}.</span>}
        <span className={cn('flex-1 truncate', !cur && 'text-[var(--w-text-3)]')}>{cur ? cur.name : 'No stage'}</span>
      </Trigger>
      <Popover open={p.on} onClose={p.close} anchorRef={p.ref} width={280}>
        <PickerList
          options={[
            { value: 0, label: 'No stage' },
            ...(stages.data ?? []).map((s) => ({ value: s.id, label: `${s.n}. ${s.name}`, keywords: s.slug, hint: s.status === 'ACTIVE' ? 'Active' : s.status === 'DONE' ? 'Done' : undefined })),
          ]}
          selected={[value ?? 0]}
          onPick={(v) => { onChange(v || null); p.close(); }}
          placeholder="Stage…"
          empty={stages.isLoading ? 'Loading…' : 'No stages yet'}
        />
      </Popover>
    </>
  );
}

// ─── Khu Approvals ───────────────────────────────────────────────

/** Ai được đứng tên duyệt: vai có quyền approval.decide (viewer thì không). */
const APPROVER_ROLES = new Set(['ADMIN', 'MEMBER', 'TEACHER', 'CLIENT']);

export interface ApprovalRequestBody { approverIds: number[]; mode: ApprovalMode; description: string | null; dueAt: string | null }

/**
 * Hộp "Request approval" dùng chung: thẻ (S1) và trang tài liệu (S2a). Bên gọi
 * truyền `send` (gọi API nào) + tiêu đề; `excludeClients` bỏ khách khỏi danh sách
 * người duyệt (trang tài liệu nội bộ — khách không đọc được thì không ký được).
 */
export function RequestApprovalDialog({ open, onClose, config, title, send, successMessage, excludeClients, hint }: {
  open: boolean; onClose: () => void; config: ProjectConfig; title: string;
  send: (body: ApprovalRequestBody) => Promise<unknown>;
  successMessage: string;
  excludeClients?: boolean;
  hint?: string;
}) {
  const invalidate = useStudioInvalidate();
  const [ids, setIds] = useState<number[]>([]);
  const [mode, setMode] = useState<ApprovalMode>('SEQUENTIAL');
  const [due, setDue] = useState('');
  const [note, setNote] = useState('');
  const pick = usePick();
  const candidates = config.members.filter((m) => APPROVER_ROLES.has(m.role) && !(excludeClients && m.role === 'CLIENT'));
  const create = useMutation({
    mutationFn: () => send({ approverIds: ids, mode, description: note.trim() || null, dueAt: due ? new Date(`${due}T23:59:00`).toISOString() : null }),
    onSuccess: () => { toast.success(successMessage); invalidate(); onClose(); setIds([]); setNote(''); setDue(''); },
    onError: (err) => toast.error(workError(err, 'Could not request approval')),
  });
  const move = (i: number, d: -1 | 1) => setIds((a) => { const n = [...a]; const j = i + d; if (j < 0 || j >= n.length) return a; [n[i], n[j]] = [n[j], n[i]]; return n; });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      width={520}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={!ids.length || create.isPending} onClick={() => create.mutate()}>
            {create.isPending ? <Spinner size={12} /> : <Send size={13} />} Send request
          </button>
        </>
      }
    >
      <Field label="Approvers" hint={mode === 'SEQUENTIAL' ? 'They decide in this order — the next person is asked once the previous one approves.' : 'Everyone is asked at once and can decide in any order.'}>
        <ol className="mb-2 space-y-1">
          {ids.map((id, i) => {
            const m = config.members.find((x) => x.id === id);
            return (
              <li key={id} className="flex items-center gap-2 rounded-[6px] border border-[var(--w-border)] px-2 py-1 text-[13px]">
                {mode === 'SEQUENTIAL' && <span className="w-4 text-center text-[12px] font-semibold tabular text-[var(--w-text-3)]">{i + 1}</span>}
                <UserAvatar user={m} size={20} />
                <span className="min-w-0 flex-1 truncate">{userName(m)}</span>
                {mode === 'SEQUENTIAL' && ids.length > 1 && (
                  <>
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp size={12} /></button>
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={i === ids.length - 1} onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown size={12} /></button>
                  </>
                )}
                <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => setIds((a) => a.filter((x) => x !== id))} aria-label={`Remove ${userName(m)}`}><X size={12} /></button>
              </li>
            );
          })}
        </ol>
        <button ref={pick.ref} type="button" className="w-btn w-btn-sm" onClick={pick.toggle} disabled={ids.length >= 10}><Plus size={12} /> Add approver</button>
        <Popover open={pick.on} onClose={pick.close} anchorRef={pick.ref} width={260}>
          <PickerList
            options={candidates.filter((m) => !ids.includes(m.id)).map((m) => ({ value: m.id, label: userName(m), keywords: m.username, icon: <UserAvatar user={m} size={16} />, hint: m.role === 'ADMIN' ? 'Admin' : m.role === 'CLIENT' ? 'Client' : m.role === 'TEACHER' ? 'Teacher' : undefined }))}
            selected={[]}
            onPick={(v) => { setIds((a) => [...a, v]); pick.close(); }}
            placeholder="Find a person…"
            empty="No more people who can approve"
          />
        </Popover>
      </Field>
      <Field label="Order">
        <div className="flex h-8 rounded-[6px] border border-[var(--w-border-strong)] p-0.5" role="radiogroup" aria-label="Approval order">
          {(['SEQUENTIAL', 'PARALLEL'] as const).map((m) => (
            <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(m)} className={cn('flex-1 rounded-[4px] text-[12px] font-medium', mode === m ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
              {m === 'SEQUENTIAL' ? 'One after another' : 'All at once'}
            </button>
          ))}
        </div>
      </Field>
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[160px_1fr]">
        <Field label="Due (optional)"><input type="date" className="w-input" value={due} onChange={(e) => setDue(e.target.value)} /></Field>
        <Field label="Note (optional)"><input className="w-input" value={note} maxLength={5000} onChange={(e) => setNote(e.target.value)} placeholder="What should they check?" /></Field>
      </div>
      {hint && <p className="mb-2 text-[12px] text-[var(--w-text-2)]">{hint}</p>}
      <p className="text-[12px] text-[var(--w-text-3)]">Nobody can approve on someone else’s behalf — not even an admin. One rejection rejects the whole request.</p>
    </Dialog>
  );
}

export function IssueApprovals({ config, issue, issueKey }: { config: ProjectConfig; issue: IssueDetail; issueKey: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [asking, setAsking] = useState(false);
  const q = useQuery({
    queryKey: [...workStudioKeys.approvals(config.id), 'issue', issue.number],
    queryFn: () => workStudioApi.approvals(config.id, { issue: issue.number }),
  });
  const list = q.data ?? [];
  const hasPending = list.some((a) => a.status === 'PENDING');
  const canAsk = !!config.permissions.createApprovals && !hasPending;
  if (!list.length && !canAsk) return null;
  return (
    <section>
      <div className="mb-2 flex items-center">
        <h3 className="w-section-title">Approvals</h3>
        {canAsk && <button type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => setAsking(true)}><BadgeCheck size={13} /> Request approval</button>}
      </div>
      {list.length ? (
        <ul className="overflow-hidden rounded-[6px] border border-[var(--w-border)]">
          {list.map((a) => {
            const ok = a.steps.filter((s) => s.decision === 'APPROVED').length;
            return (
              <li key={a.id} className="border-b border-[var(--w-border)] last:border-b-0">
                <button type="button" onClick={() => setOpen(a.id)} className="flex w-full min-w-0 flex-wrap items-center gap-x-2 gap-y-1 px-2.5 py-2 text-left text-[13px] hover:bg-[var(--w-hover)]">
                  <ApprovalPill status={a.status} />
                  <span className="flex -space-x-1">{a.steps.slice(0, 5).map((s) => <UserAvatar key={s.id} user={s.approver} size={18} className="ring-2 ring-[var(--w-panel)]" />)}</span>
                  <span className="text-[12px] tabular text-[var(--w-text-3)]">{ok}/{a.steps.length} · {a.mode === 'SEQUENTIAL' ? 'in order' : 'parallel'}</span>
                  {a.contentChanged && <Pill tone="orange" title="The issue changed after someone signed">Changed since approval</Pill>}
                  {a.canDecide && <Pill tone="accent">Your turn</Pill>}
                  <span className="ml-auto shrink-0 text-[12px] text-[var(--w-text-3)]">{a.dueAt && a.status === 'PENDING' ? `Due ${formatDate(a.dueAt)}` : relativeTime(a.decidedAt ?? a.createdAt)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-[12px] text-[var(--w-text-3)]">No approvals yet. Ask the client, your lead or QA to sign off on this issue.</p>
      )}
      <RequestApprovalDialog
        open={asking}
        onClose={() => setAsking(false)}
        config={config}
        title={`Request approval · ${issueKey}`}
        successMessage={`Approval requested for ${issueKey}`}
        send={(b) => workStudioApi.createApproval(config.id, { issueNumber: issue.number, ...b })}
      />
      <ApprovalDialog pid={config.id} approvalId={open} config={config} onClose={() => setOpen(null)} />
    </section>
  );
}

// ─── Khu Handoffs ────────────────────────────────────────────────

function HandOffDialog({ open, onClose, config, issue, issueKey }: { open: boolean; onClose: () => void; config: ProjectConfig; issue: IssueDetail; issueKey: string }) {
  const invalidate = useStudioInvalidate();
  const teamsOn = studioOn(config, 'teams');
  const teams = useWorkspaceTeams(config.workspace.id, teamsOn && open);
  const [teamId, setTeamId] = useState<number | ''>('');
  const [userId, setUserId] = useState<number | ''>('');
  const [items, setItems] = useState<string[]>(['']);
  const [note, setNote] = useState('');
  const people = config.members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER');
  const same = (teamId === '' || teamId === issue.teamId) && (userId === '' || userId === issue.assigneeId);
  const create = useMutation({
    mutationFn: () => workStudioApi.createHandoff(config.id, issue.number, {
      toTeamId: teamId || null, toUserId: userId || null,
      checklist: items.map((t) => t.trim()).filter(Boolean).map((text) => ({ text })),
      note: note.trim() || null,
    }),
    onSuccess: () => { toast.success(`${issueKey} handed off — waiting to be accepted`); invalidate(); onClose(); setTeamId(''); setUserId(''); setItems(['']); setNote(''); },
    onError: (err) => toast.error(workError(err, 'Could not hand off the issue')),
  });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Hand off · ${issueKey}`}
      width={520}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={(teamId === '' && userId === '') || same || create.isPending} onClick={() => create.mutate()}>
            {create.isPending ? <Spinner size={12} /> : <ArrowRightLeft size={13} />} Hand off
          </button>
        </>
      }
    >
      <div className={cn('grid grid-cols-1 gap-x-3', teamsOn && 'sm:grid-cols-2')}>
        {teamsOn && (
          <Field label="To team">
            <Select aria-label="To team" value={teamId} onChange={(e) => setTeamId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">Keep current team</option>
              {(teams.data ?? []).filter((t) => !t.archivedAt).map((t) => <option key={t.id} value={t.id}>{t.key} — {t.name}</option>)}
            </Select>
          </Field>
        )}
        <Field label="To person">
          <Select aria-label="To person" value={userId} onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">{teamsOn ? 'Team lead assigns it' : 'Choose a person'}</option>
            {people.map((m) => <option key={m.id} value={m.id}>{userName(m)}</option>)}
          </Select>
        </Field>
      </div>
      {same && (teamId !== '' || userId !== '') && <p className="-mt-2 mb-3 text-[12px] text-[var(--w-red)]">The issue already belongs to that team/person.</p>}
      <Field label="Checklist the receiver must tick" hint="Their Definition of Ready — e.g. “Acceptance criteria agreed”, “Designs linked”. They can only accept once every item is ticked.">
        <ul className="space-y-1.5">
          {items.map((t, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 shrink-0 rounded-[3px] border border-[var(--w-border-strong)]" aria-hidden="true" />
              <input
                className="w-input !h-8"
                value={t}
                maxLength={300}
                placeholder={i === 0 ? 'e.g. Acceptance criteria agreed with the client' : 'Another item'}
                aria-label={`Checklist item ${i + 1}`}
                onChange={(e) => setItems((a) => a.map((x, j) => (j === i ? e.target.value : x)))}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); if (items.length < 30) setItems((a) => [...a.slice(0, i + 1), '', ...a.slice(i + 1)]); } }}
              />
              <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={items.length === 1} onClick={() => setItems((a) => a.filter((_, j) => j !== i))} aria-label="Remove item"><Trash2 size={12} /></button>
            </li>
          ))}
        </ul>
        <button type="button" className="w-btn w-btn-ghost w-btn-sm mt-1.5" disabled={items.length >= 30} onClick={() => setItems((a) => [...a, ''])}><Plus size={12} /> Add item</button>
      </Field>
      <Field label="Note (optional)">
        <textarea className="w-input" rows={2} maxLength={5000} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Context the next team needs" />
      </Field>
    </Dialog>
  );
}

export function IssueHandoffs({ config, issue, issueKey }: { config: ProjectConfig; issue: IssueDetail; issueKey: string }) {
  const [open, setOpen] = useState(false);
  const q = useQuery({ queryKey: workStudioKeys.issueHandoffs(config.id, issue.number), queryFn: () => workStudioApi.issueHandoffs(config.id, issue.number) });
  const list = q.data ?? [];
  const pending = list.find((h) => h.status === 'PENDING');
  const canHand = !!config.permissions.createHandoffs && !pending;
  if (!list.length && !canHand) return null;
  return (
    <section>
      <div className="mb-2 flex items-center">
        <h3 className="w-section-title">Handoffs</h3>
        {canHand && <button type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => setOpen(true)}><ArrowRightLeft size={13} /> Hand off</button>}
      </div>
      {list.length ? (
        <div className="divide-y divide-[var(--w-border)] overflow-hidden rounded-[6px] border border-[var(--w-border)]">
          {list.map((h) => <HandoffCard key={`${h.id}-${h.status}`} h={h} compact />)}
        </div>
      ) : (
        <p className="text-[12px] text-[var(--w-text-3)]">Pass this issue to another team or person with a checklist they tick before accepting.</p>
      )}
      <HandOffDialog open={open} onClose={() => setOpen(false)} config={config} issue={issue} issueKey={issueKey} />
    </section>
  );
}

// ─── Chuyển sang dự án khác ──────────────────────────────────────

export function MoveIssueDialog({ open, onClose, config, issue, lk }: { open: boolean; onClose: () => void; config: ProjectConfig; issue: IssueDetail; lk: Lookups }) {
  const router = useRouter();
  const invalidate = useStudioInvalidate();
  const [target, setTarget] = useState<number | null>(null);
  const ws = useQuery({ queryKey: wk.workspace(config.workspace.slug), queryFn: () => workApi.workspaceBySlug(config.workspace.slug), enabled: open, staleTime: 30_000 });
  const projects = useMemo(
    () => (ws.data?.projects ?? []).filter((p) => p.id !== config.id && !p.archivedAt && (p.role === 'ADMIN' || p.role === 'MEMBER')),
    [ws.data, config.id],
  );
  const type = lk.types.get(issue.typeId);
  const blocked = type?.level === 1 ? 'Epics cannot be moved — move the issues inside it instead.'
    : type?.level === -1 ? 'Sub-tasks move with their parent — move the parent issue instead.'
      : type?.key === 'TEST' ? 'Test issues belong to this project’s test plans and cannot be moved.'
        : null;
  const dst = projects.find((p) => p.id === target);
  const oldKey = lk.issueKey(issue.number);
  const move = useMutation({
    mutationFn: () => workStudioApi.moveToProject(config.id, issue.number, target!, issue.version),
    onSuccess: (r) => {
      toast.success(`Moved ${oldKey} → ${r.key}${r.dropped.length ? ` · dropped: ${r.dropped.slice(0, 3).join(', ')}` : ''}`);
      invalidate();
      onClose();
      const newProjectKey = r.key.slice(0, r.key.lastIndexOf('-'));
      router.push(`/work/${config.workspace.slug}/${newProjectKey}/issue/${r.number}`);
    },
    onError: (err) => toast.error(workError(err, 'Could not move the issue')),
  });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Move ${oldKey} to another project`}
      width={520}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={!target || !!blocked || move.isPending} onClick={() => move.mutate()}>
            {move.isPending ? <Spinner size={12} /> : <ArrowRightLeft size={13} />} Move issue
          </button>
        </>
      }
    >
      {blocked ? (
        <p className="text-[13px] leading-relaxed text-[var(--w-text-2)]">{blocked}</p>
      ) : (
        <>
          <Field label="Target project (same workspace)">
            {ws.isLoading ? <Spinner /> : projects.length ? (
              <ul className="max-h-[240px] space-y-1 overflow-y-auto">
                {projects.map((p) => (
                  <li key={p.id}>
                    <label className={cn('flex cursor-pointer items-center gap-2.5 rounded-[6px] border px-2.5 py-2 text-[13px]', target === p.id ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border)] hover:bg-[var(--w-hover)]')}>
                      <input type="radio" name="move-target" className="sr-only" checked={target === p.id} onChange={() => setTarget(p.id)} />
                      <ProjectMark k={p.key} size={20} />
                      <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
                      <span className="shrink-0 font-mono text-[12px] text-[var(--w-text-3)]">{p.key}</span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : <p className="text-[13px] text-[var(--w-text-3)]">No other project in this workspace where you can create issues.</p>}
          </Field>
          <div className="rounded-[8px] border border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_8%,transparent)] px-3 py-2.5 text-[12px] leading-relaxed text-[var(--w-text)]">
            <p><b className="font-semibold">The key will change:</b> <span className="font-mono">{oldKey}</span> becomes <span className="font-mono">{dst ? `${dst.key}-…` : 'a new key'}</span>{issue.children.length ? `, and its ${issue.children.length} sub-task${issue.children.length === 1 ? '' : 's'} move too` : ''}. Old links keep working and redirect to the new key.</p>
            <p className="mt-1 text-[var(--w-text-2)]">Comments, attachments, history and links come along. Sprint, fix version, epic and stage are cleared; labels, components and custom fields are matched by name in the target project.</p>
          </div>
        </>
      )}
    </Dialog>
  );
}

