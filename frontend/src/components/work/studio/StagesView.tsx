'use client';

/**
 * Trang Stages (S1, mô-đun stages): dải giai đoạn ngang (tổng quan, cuộn riêng)
 * + danh sách dọc từng giai đoạn: số, tên, trạng thái, tiến độ thẻ, cổng.
 *
 * Vòng đời: Not started → Active → Gate review → Done. Kích hoạt khi giai đoạn
 * trước chưa Done ⇒ server 409 WORK_STAGE_BLOCKED (data.blockingStage) — hiện
 * NGAY dưới giai đoạn đó, ADMIN ghi đè được nếu ghi lý do (audit). Done CHỈ
 * qua phê duyệt cổng (cần mô-đun approvals).
 */

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, CircleDashed, FileText, Flag, Lock, MoreHorizontal, Pencil, Play, Plus, Send, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  workError, workStudioApi, workStudioKeys, type ProjectConfig, type StageSummary, type WorkPageItem,
} from '@/lib/work-api';
import { StatusDot, useDocsList } from '../docs/shared';
import { Dialog, EmptyState, Field, PageLoading, Popover, Spinner, formatDate, useToggle } from '../ui';
import { ConfirmDialog } from '../settings/shared';
import { ApprovalDialog } from './ApprovalDetail';
import { ProcessGuideLink, StagePill, STAGE_STATUS, studioOn, useStudioInvalidate } from './shared';

interface Blocked { stageId: number; blocker: { id: number; n: number; name: string; status: string } }

function blockedOf(err: unknown): Blocked['blocker'] | null {
  const r = (err as { response?: { status?: number; data?: { code?: string; data?: { blockingStage?: Blocked['blocker'] } } } })?.response;
  return r?.status === 409 && r.data?.code === 'WORK_STAGE_BLOCKED' ? (r.data.data?.blockingStage ?? null) : null;
}

const slugify = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

const DOT_COLOR: Record<string, string> = {
  NOT_STARTED: 'var(--w-status-todo)', ACTIVE: 'var(--w-blue)', GATE_REVIEW: 'var(--w-orange)', DONE: 'var(--w-green)',
};

// ─── Dải tổng quan ngang ─────────────────────────────────────────

function StageRail({ stages, onJump }: { stages: StageSummary[]; onJump: (id: number) => void }) {
  const done = stages.filter((s) => s.status === 'DONE').length;
  return (
    <div className="border-b border-[var(--w-border)] px-4 py-3 md:px-6">
      <div className="mb-2 flex items-center gap-2 text-[12px] text-[var(--w-text-3)]">
        <span className="font-medium text-[var(--w-text-2)]">{done} of {stages.length} stages done</span>
        <span className="h-1 w-28 overflow-hidden rounded-full bg-[var(--w-sunken)]"><span className="block h-full bg-[var(--w-green)]" style={{ width: `${stages.length ? (done / stages.length) * 100 : 0}%` }} /></span>
      </div>
      <ol className="flex items-center gap-0 overflow-x-auto pb-1 [scrollbar-width:thin]" aria-label="Stages overview">
        {stages.map((s, i) => (
          <li key={s.id} className="flex shrink-0 items-center">
            {i > 0 && <span aria-hidden="true" className="h-px w-4 md:w-6" style={{ background: s.status === 'NOT_STARTED' ? 'var(--w-border-strong)' : DOT_COLOR[s.status] }} />}
            <button
              type="button"
              onClick={() => onJump(s.id)}
              title={`${s.n}. ${s.name} — ${STAGE_STATUS[s.status].label}`}
              className={cn(
                'flex h-7 items-center gap-1.5 rounded-full border px-2 text-[12px] font-medium tabular transition-colors hover:bg-[var(--w-hover)]',
                s.status === 'ACTIVE' || s.status === 'GATE_REVIEW' ? 'border-[var(--w-accent-border)] text-[var(--w-text)]' : 'border-[var(--w-border)] text-[var(--w-text-2)]',
              )}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white" style={{ background: DOT_COLOR[s.status] }}>
                {s.status === 'DONE' ? <Check size={10} strokeWidth={3} /> : s.n}
              </span>
              <span className={cn('max-w-[140px] truncate', s.status !== 'ACTIVE' && s.status !== 'GATE_REVIEW' && 'max-md:hidden')}>{s.name}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── Một giai đoạn ───────────────────────────────────────────────

function StageRow({ s, config, base, blocked, onBlocked, onOpenApproval, onEdit, onDelete, docs }: {
  s: StageSummary; config: ProjectConfig; base: string;
  /** Tài liệu gắn giai đoạn này (S2a, chỉ khi mô-đun docs bật). */
  docs?: WorkPageItem[];
  blocked: Blocked['blocker'] | null; onBlocked: (b: Blocked['blocker'] | null) => void;
  onOpenApproval: (id: number) => void; onEdit: () => void; onDelete: () => void;
}) {
  const invalidate = useStudioInvalidate();
  const perms = config.permissions;
  const approvalsOn = studioOn(config, 'approvals');
  const [reason, setReason] = useState('');
  const [gateOpen, setGateOpen] = useState(false);
  const [gateNote, setGateNote] = useState('');
  const [gateDue, setGateDue] = useState('');
  const menu = useToggle();
  const menuRef = useRef<HTMLButtonElement>(null);
  const pct = s.issueCount ? Math.round((s.doneCount / s.issueCount) * 100) : 0;

  const activate = useMutation({
    mutationFn: (override?: { reason: string }) => workStudioApi.activateStage(config.id, s.id, override),
    onSuccess: (_r, override) => { toast.success(override ? `Stage ${s.n} activated — override recorded in the audit log` : `Stage ${s.n} is active`); onBlocked(null); setReason(''); invalidate(); },
    onError: (err) => {
      const b = blockedOf(err);
      if (b) onBlocked(b);
      else toast.error(workError(err, 'Could not activate the stage'));
    },
  });
  const gate = useMutation({
    mutationFn: () => workStudioApi.requestGate(config.id, s.id, { description: gateNote.trim() || null, dueAt: gateDue ? new Date(`${gateDue}T23:59:00`).toISOString() : null }),
    onSuccess: (r) => { toast.success(`Gate review requested for stage ${s.n}`); setGateOpen(false); setGateNote(''); setGateDue(''); invalidate(); onOpenApproval(r.approval.id); },
    onError: (err) => toast.error(workError(err, 'Could not request the gate review')),
  });

  const current = s.status === 'ACTIVE' || s.status === 'GATE_REVIEW';
  return (
    <li id={`stage-${s.id}`} className={cn('relative scroll-mt-4 rounded-[10px] border bg-[var(--w-raised)] shadow-[var(--w-shadow-card)]', current ? 'border-[var(--w-accent-border)]' : 'border-[var(--w-border)]')}>
      <div className="flex gap-3 p-3.5 md:gap-4 md:p-4">
        <span
          className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold tabular', s.status === 'NOT_STARTED' ? 'border border-[var(--w-border-strong)] text-[var(--w-text-2)]' : 'text-white')}
          style={s.status === 'NOT_STARTED' ? undefined : { background: DOT_COLOR[s.status] }}
          aria-hidden="true"
        >
          {s.status === 'DONE' ? <Check size={15} strokeWidth={3} /> : s.n}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className="min-w-0 text-[15px] font-semibold tracking-[-0.01em] [overflow-wrap:anywhere]"><span className="sr-only">Stage {s.n}: </span>{s.name}</h2>
            <StagePill status={s.status} />
            <ProcessGuideLink slug={s.slug} />
            {perms.manageStages && (
              <>
                <button ref={menuRef} type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm ml-auto" onClick={menu.toggle} aria-label={`More actions for stage ${s.n}`}><MoreHorizontal size={14} /></button>
                <Popover open={menu.on} onClose={menu.close} anchorRef={menuRef} width={180} align="end">
                  <div className="p-1">
                    <button type="button" onClick={() => { menu.close(); onEdit(); }} className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]"><Pencil size={13} /> Edit stage</button>
                    <button type="button" onClick={() => { menu.close(); onDelete(); }} className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] text-[var(--w-red)] hover:bg-[var(--w-hover)]"><Trash2 size={13} /> Delete stage</button>
                  </div>
                </Popover>
              </>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--w-text-3)]">
            <Link href={`${base}/list?stage=${s.id}&done=1`} className="flex items-center gap-1.5 hover:text-[var(--w-text)]" title="Open these issues in the list">
              <span className="h-1.5 w-20 overflow-hidden rounded-full bg-[var(--w-sunken)]"><span className="block h-full bg-[var(--w-green)]" style={{ width: `${pct}%` }} /></span>
              <span className="tabular">{s.doneCount}/{s.issueCount} issues done</span>
            </Link>
            {s.gateIssueKey && s.gateIssue && (
              <Link href={`${base}/issue/${s.gateIssue.number}`} className="flex items-center gap-1 hover:text-[var(--w-text)]" title={`Gate issue: ${s.gateIssue.title}`}>
                <Flag size={11} /> <span className="font-mono">{s.gateIssueKey}</span>
              </Link>
            )}
            {s.startedAt && <span>Started {formatDate(s.startedAt)}</span>}
            {s.completedAt && <span>Done {formatDate(s.completedAt)}</span>}
          </div>

          {docs && docs.length > 0 && (
            <div className="mt-2.5 flex min-w-0 flex-wrap items-center gap-1.5" aria-label={`Documents for stage ${s.n}`}>
              {docs.slice(0, 6).map((d) => (
                <Link
                  key={d.id}
                  href={`${base}/docs/${d.number}`}
                  className="inline-flex h-6 max-w-[240px] items-center gap-1.5 rounded-[6px] border border-[var(--w-border)] bg-[var(--w-panel)] px-2 text-[12px] text-[var(--w-text-2)] hover:border-[var(--w-border-strong)] hover:text-[var(--w-text)]"
                  title={d.title}
                >
                  <FileText size={11} className="shrink-0 text-[var(--w-text-3)]" />
                  <span className="truncate">{d.title}</span>
                  <StatusDot status={d.status} />
                </Link>
              ))}
              {docs.length > 6 && <Link href={`${base}/docs`} className="text-[12px] text-[var(--w-text-3)] hover:text-[var(--w-text)]">+{docs.length - 6} more</Link>}
            </div>
          )}

          {/* Hành động theo trạng thái */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {s.status === 'NOT_STARTED' && perms.manageStages && !blocked && (
              <button type="button" className="w-btn w-btn-sm" disabled={activate.isPending} onClick={() => activate.mutate(undefined)}>
                {activate.isPending ? <Spinner size={11} /> : <Play size={12} />} Activate
              </button>
            )}
            {s.status === 'NOT_STARTED' && !perms.manageStages && <span className="flex items-center gap-1 text-[12px] text-[var(--w-text-3)]"><CircleDashed size={12} /> Not started — a project admin activates it.</span>}
            {s.status === 'ACTIVE' && perms.requestGate && approvalsOn && (
              <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setGateOpen(true)}><Send size={12} /> Request gate review</button>
            )}
            {s.status === 'ACTIVE' && !approvalsOn && (
              <span className="text-[12px] text-[var(--w-text-3)]">Turn on <b className="font-medium">Approvals</b> in Project settings → Project type &amp; modules to close stages through a gate review.</span>
            )}
            {s.status === 'GATE_REVIEW' && (
              <>
                <span className="text-[12px] text-[var(--w-text-2)]">Waiting for the gate approval.</span>
                {s.pendingApprovalId && (
                  <button type="button" className="w-btn w-btn-sm" onClick={() => onOpenApproval(s.pendingApprovalId!)}>View approval</button>
                )}
              </>
            )}
            {s.status === 'DONE' && <span className="flex items-center gap-1 text-[12px] text-[var(--w-green)]"><Check size={12} /> Gate passed</span>}
          </div>

          {blocked && s.status === 'NOT_STARTED' && (
            <div role="alert" className="mt-3 rounded-[8px] border border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_8%,transparent)] p-3 text-[13px]">
              <div className="flex items-start gap-2">
                <Lock size={14} className="mt-0.5 shrink-0 text-[var(--w-orange)]" />
                <div className="min-w-0">
                  <div className="font-semibold">Blocked by stage {blocked.n}. {blocked.name}</div>
                  <p className="mt-0.5 text-[12px] text-[var(--w-text-2)]">
                    It is {STAGE_STATUS[blocked.status as keyof typeof STAGE_STATUS]?.label.toLowerCase() ?? blocked.status.toLowerCase()}. Stages open in order — finish its gate review first, or override with a reason (recorded in the audit log).
                  </p>
                </div>
              </div>
              <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
                <input className="w-input !h-8" value={reason} maxLength={1000} onChange={(e) => setReason(e.target.value)} placeholder="Reason for starting early" aria-label="Override reason" />
                <div className="flex shrink-0 gap-2">
                  <button type="button" className="w-btn w-btn-sm" onClick={() => document.getElementById(`stage-${blocked.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>Go to stage {blocked.n}</button>
                  <button type="button" className="w-btn w-btn-sm w-btn-warn" disabled={reason.trim().length < 3 || activate.isPending} onClick={() => activate.mutate({ reason: reason.trim() })}>Activate anyway</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        title={`Request gate review · ${s.n}. ${s.name}`}
        width={480}
        footer={
          <>
            <button type="button" className="w-btn" onClick={() => setGateOpen(false)}>Cancel</button>
            <button type="button" className="w-btn w-btn-primary" disabled={gate.isPending} onClick={() => gate.mutate()}>{gate.isPending ? <Spinner size={12} /> : <Send size={13} />} Send for review</button>
          </>
        }
      >
        <p className="mb-4 text-[13px] leading-relaxed text-[var(--w-text-2)]">
          The stage moves to <b className="font-medium">Gate review</b> and the gate approvers set in Project settings (by default the project admin) are asked to sign off. It becomes Done only when they approve.
        </p>
        <Field label="What should reviewers check? (optional)"><textarea className="w-input" rows={3} maxLength={5000} value={gateNote} onChange={(e) => setGateNote(e.target.value)} placeholder="e.g. Survey report and signed minutes are attached to the gate issue" /></Field>
        <Field label="Due (optional)"><input type="date" className="w-input sm:max-w-[200px]" value={gateDue} onChange={(e) => setGateDue(e.target.value)} /></Field>
      </Dialog>
    </li>
  );
}

// ─── Thêm / sửa ──────────────────────────────────────────────────

function StageDialog({ open, onClose, config, stage, nextN }: { open: boolean; onClose: () => void; config: ProjectConfig; stage: StageSummary | null; nextN: number }) {
  const invalidate = useStudioInvalidate();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [n, setN] = useState(nextN);
  useEffect(() => {
    if (!open) return;
    setName(stage?.name ?? ''); setSlug(stage?.slug ?? ''); setSlugTouched(!!stage); setN(stage?.n ?? nextN);
  }, [open, stage, nextN]);
  const save = useMutation({
    mutationFn: () => (stage
      ? workStudioApi.updateStage(config.id, stage.id, { name: name.trim(), slug, n })
      : workStudioApi.createStage(config.id, { name: name.trim(), slug, n })),
    onSuccess: () => { toast.success(stage ? 'Stage updated' : 'Stage added'); invalidate(); onClose(); },
    onError: (err) => toast.error(workError(err, 'Could not save the stage')),
  });
  const ok = name.trim() && /^[a-z0-9][a-z0-9-]{0,79}$/.test(slug);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={stage ? `Edit stage ${stage.n}` : 'Add stage'}
      width={460}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={!ok || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} {stage ? 'Save' : 'Add stage'}</button>
        </>
      }
    >
      <div className="grid grid-cols-[72px_1fr] gap-x-3">
        <Field label="No."><input type="number" className="w-input" min={0} max={999} value={n} onChange={(e) => setN(Math.max(0, Math.min(999, Number(e.target.value) || 0)))} /></Field>
        <Field label="Name"><input autoFocus className="w-input" maxLength={160} value={name} onChange={(e) => { setName(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }} placeholder="e.g. Discovery" /></Field>
      </div>
      <Field label="Slug" hint="Lowercase letters, digits and dashes. A slug that matches a CuongThai process stage (e.g. khao-sat) links to its process guide.">
        <input className="w-input font-mono" maxLength={80} value={slug} onChange={(e) => { setSlugTouched(true); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); }} />
      </Field>
    </Dialog>
  );
}

// ─── Trang ───────────────────────────────────────────────────────

export default function StagesView({ config }: { config: ProjectConfig }) {
  const invalidate = useStudioInvalidate();
  const base = `/work/${config.workspace.slug}/${config.key}`;
  const q = useQuery({ queryKey: workStudioKeys.stages(config.id), queryFn: () => workStudioApi.stages(config.id) });
  // Tài liệu theo giai đoạn (S2a): một lần tải cho cả trang, nhóm theo stageId.
  const docsList = useDocsList(config.id, studioOn(config, 'docs'));
  const docsByStage = useMemo(() => {
    const m = new Map<number, WorkPageItem[]>();
    for (const p of docsList.data?.pages ?? []) {
      if (p.stageId === null) continue;
      const arr = m.get(p.stageId) ?? [];
      arr.push(p);
      m.set(p.stageId, arr);
    }
    // Trang mẫu (có templateKey) trước, trang "giai đoạn" (vỏ) sau.
    for (const arr of m.values()) arr.sort((a, b) => Number(!a.templateKey) - Number(!b.templateKey) || a.position - b.position);
    return m;
  }, [docsList.data]);
  const [blocked, setBlocked] = useState<Blocked | null>(null);
  const [approvalId, setApprovalId] = useState<number | null>(null);
  const [editing, setEditing] = useState<StageSummary | null | 'new'>(null);
  const [deleting, setDeleting] = useState<StageSummary | null>(null);
  const del = useMutation({
    mutationFn: (s: StageSummary) => workStudioApi.deleteStage(config.id, s.id),
    onSuccess: () => { toast.success('Stage deleted'); setDeleting(null); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not delete the stage')),
  });

  if (q.isLoading) return <PageLoading rows={5} />;
  if (q.error || !q.data) return <EmptyState title="Could not load the stages" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />;
  const stages = q.data;
  const nextN = stages.length ? Math.max(...stages.map((s) => s.n)) + 1 : 0;
  const jump = (id: number) => document.getElementById(`stage-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="flex h-full flex-col">
      {stages.length > 0 && <StageRail stages={stages} onJump={jump} />}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-[920px] px-4 py-5 md:px-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-[var(--w-text-2)]">
              Stages open in order. Close a stage by sending it for a gate review — it is done only when the gate approvers sign off.
            </p>
            {config.permissions.manageStages && <button type="button" className="w-btn w-btn-sm" onClick={() => setEditing('new')}><Plus size={13} /> Add stage</button>}
          </div>
          {stages.length ? (
            <ol className="space-y-2.5">
              {stages.map((s) => (
                <StageRow
                  key={s.id}
                  s={s}
                  config={config}
                  base={base}
                  blocked={blocked?.stageId === s.id ? blocked.blocker : null}
                  onBlocked={(b) => setBlocked(b ? { stageId: s.id, blocker: b } : null)}
                  onOpenApproval={setApprovalId}
                  onEdit={() => setEditing(s)}
                  onDelete={() => setDeleting(s)}
                  docs={docsByStage.get(s.id)}
                />
              ))}
            </ol>
          ) : (
            <EmptyState
              title="No stages yet"
              body="Break the project into stages such as Discovery, Design, Build and Handover. Each stage closes with a gate review."
              action={config.permissions.manageStages ? <button type="button" className="w-btn w-btn-primary" onClick={() => setEditing('new')}><Plus size={13} /> Add the first stage</button> : undefined}
            />
          )}
        </div>
      </div>
      <StageDialog open={editing !== null} onClose={() => setEditing(null)} config={config} stage={editing === 'new' ? null : editing} nextN={nextN} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && del.mutate(deleting)}
        pending={del.isPending}
        title={`Delete stage ${deleting?.n}. ${deleting?.name ?? ''}`}
        body="Issues in this stage keep everything else but lose their stage. A pending gate approval for it is removed."
        confirmLabel="Delete stage"
      />
      <ApprovalDialog pid={config.id} approvalId={approvalId} config={config} onClose={() => setApprovalId(null)} />
    </div>
  );
}
