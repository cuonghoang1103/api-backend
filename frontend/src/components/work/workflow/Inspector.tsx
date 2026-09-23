'use client';

/** Khung bên phải của sơ đồ: sửa trạng thái đang chọn, hoặc xem/xoá một mũi tên. */

import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, ArrowLeftRight, Trash2, X } from 'lucide-react';
import type { StatusCategory, WorkStatus } from '@/lib/work-api';
import { Spinner, StatusBadge } from '../ui';
import { Select } from '../settings/shared';
import { ColorPicker } from '../settings/ProjectLabels';
import { CATEGORIES, CATEGORY_LABEL, WipInput, useStatusUpdate } from './statusParts';
import { pairKey, parsePair, type Warning } from './graph';
import type { TransitionDraft } from './useTransitionDraft';

const AnyPill = () => (
  <span className="inline-flex h-[22px] items-center rounded-full border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] px-2 text-[12px] font-medium text-[var(--w-accent-text)]">
    Any status
  </span>
);

function PanelShell({ eyebrow, onClose, children }: { eyebrow: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <aside
      className="w-card absolute bottom-2 right-2 top-2 z-10 flex w-[284px] flex-col overflow-hidden max-md:inset-x-2 max-md:top-auto max-md:max-h-[55%] max-md:w-auto"
      style={{ boxShadow: 'var(--w-shadow-pop)' }}
      onPointerDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-[var(--w-border)] pl-3.5 pr-1.5">
        <span className="w-eyebrow">{eyebrow}</span>
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onClose} aria-label="Close panel"><X size={14} /></button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-3 text-[13px]">{children}</div>
    </aside>
  );
}

const SubHead = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-1.5 mt-4 text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--w-text-3)] first:mt-0">{children}</div>
);

// ─── Trạng thái ──────────────────────────────────────────────────

export function NodeInspector({
  status, statuses, pid, canEdit, draft, warnings, onClose, onChanged, onAdd, onSelectEdge, onDelete,
}: {
  status: WorkStatus; statuses: WorkStatus[]; pid: number; canEdit: boolean; draft: TransitionDraft; warnings: Warning[];
  onClose: () => void; onChanged: () => void;
  /** Thêm chuyển (đi qua hộp xác nhận nếu quy trình đang tự do). */
  onAdd: (from: number | null, to: number) => void;
  onSelectEdge: (key: string) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(status.name);
  useEffect(() => setName(status.name), [status.name]);
  const update = useStatusUpdate(pid, status.id, onChanged, () => setName(status.name));
  const locked = !canEdit || update.isPending;
  const commitName = () => {
    const n = name.trim();
    if (!n) { setName(status.name); return; }
    if (n !== status.name) update.mutate({ name: n });
  };

  const restricted = draft.mode === 'restricted';
  const edges = [...draft.pairs].map((k) => ({ k, ...parsePair(k) }));
  const byId = new Map(statuses.map((s) => [s.id, s]));
  const outgoing = edges.filter((e) => e.from === status.id && byId.has(e.to));
  const incoming = edges.filter((e) => e.to === status.id && e.from !== null && byId.has(e.from));
  const fromAny = draft.pairs.has(pairKey(null, status.id));
  const targets = statuses.filter((s) => s.id !== status.id && !draft.pairs.has(pairKey(status.id, s.id)));

  const row = (key: string, other: WorkStatus, dir: 'out' | 'in') => (
    <li key={key} className="group flex items-center gap-1.5 rounded-[5px] py-0.5 pl-1 hover:bg-[var(--w-hover)]">
      <button type="button" className="flex min-w-0 flex-1 items-center gap-1.5 text-left" onClick={() => onSelectEdge(key)}>
        {dir === 'in' && <><span className="min-w-0 truncate">{other.name}</span><ArrowRight size={12} className="shrink-0 text-[var(--w-text-3)]" /></>}
        {dir === 'out' && <><ArrowRight size={12} className="shrink-0 text-[var(--w-text-3)]" /><span className="min-w-0 truncate">{other.name}</span></>}
      </button>
      {canEdit && (
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm opacity-60 group-hover:opacity-100" onClick={() => draft.remove(key)} aria-label={`Remove transition ${dir === 'out' ? `${status.name} to ${other.name}` : `${other.name} to ${status.name}`}`}>
          <X size={12} />
        </button>
      )}
    </li>
  );

  return (
    <PanelShell eyebrow="Status" onClose={onClose}>
      {canEdit ? (
        <>
          <label className="w-label" htmlFor={`wf-st-name-${status.id}`}>Name</label>
          <input
            id={`wf-st-name-${status.id}`}
            className="w-input !h-8 text-[13px]"
            value={name}
            maxLength={60}
            disabled={locked}
            onChange={(e) => setName(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'Enter') e.currentTarget.blur();
              if (e.key === 'Escape') { setName(status.name); e.currentTarget.blur(); }
            }}
          />
          <div className="mt-3 flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <label className="w-label">Category</label>
              <Select className="!h-8 text-[12px]" value={status.category} disabled={locked} onChange={(e) => update.mutate({ category: e.target.value as StatusCategory })} aria-label="Status category">
                {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
              </Select>
            </div>
            <div>
              <label className="w-label">WIP</label>
              <WipInput value={status.wipLimit} disabled={locked} label={`WIP limit for ${status.name}`} onCommit={(v) => update.mutate({ wipLimit: v })} />
            </div>
            <div>
              <label className="w-label">Colour</label>
              <ColorPicker value={status.color} ariaLabel="Status colour" disabled={locked} onChange={(c) => update.mutate({ color: c })} />
            </div>
          </div>
          {update.isPending && <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[var(--w-text-3)]"><Spinner size={11} /> Saving…</div>}
        </>
      ) : (
        <div className="flex flex-col gap-1.5">
          <StatusBadge status={status} className="self-start" />
          <div className="text-[12px] text-[var(--w-text-2)]">{CATEGORY_LABEL[status.category]} · {status.wipLimit ? `WIP limit ${status.wipLimit}` : 'No WIP limit'}</div>
        </div>
      )}

      {warnings.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {warnings.map((w) => (
            <li key={w.kind} className="flex gap-2 rounded-[6px] border border-[color-mix(in_srgb,var(--w-yellow)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-yellow)_9%,transparent)] px-2.5 py-2 text-[12px] leading-snug text-[var(--w-text)]">
              <AlertTriangle size={13} className="mt-px shrink-0 text-[var(--w-yellow)]" />
              <span>{w.text}</span>
            </li>
          ))}
        </ul>
      )}

      <SubHead>Transitions</SubHead>
      {!restricted ? (
        <p className="text-[12px] leading-relaxed text-[var(--w-text-2)]">Free workflow — issues can move from this status to any other status.</p>
      ) : (
        <>
          <label className={`mb-2 flex items-center gap-2 text-[13px] ${canEdit ? 'cursor-pointer' : ''}`}>
            <input type="checkbox" className="accent-[var(--w-accent)]" checked={fromAny} disabled={!canEdit} onChange={() => draft.toggle(null, status.id)} />
            Reachable from any status
          </label>
          <div className="text-[12px] text-[var(--w-text-3)]">Moves to</div>
          <ul className="mb-2 mt-0.5">
            {outgoing.map((e) => row(e.k, byId.get(e.to)!, 'out'))}
            {!outgoing.length && <li className="py-0.5 text-[12px] italic text-[var(--w-text-3)]">None</li>}
          </ul>
          <div className="text-[12px] text-[var(--w-text-3)]">Comes from</div>
          <ul className="mt-0.5">
            {incoming.map((e) => row(e.k, byId.get(e.from!)!, 'in'))}
            {!incoming.length && <li className="py-0.5 text-[12px] italic text-[var(--w-text-3)]">{fromAny ? 'Any status' : 'None'}</li>}
          </ul>
        </>
      )}
      {canEdit && targets.length > 0 && (
        <Select
          className="mt-3 !h-8 text-[12px]"
          value=""
          aria-label={`Add transition from ${status.name} to…`}
          onChange={(e) => { if (e.target.value) onAdd(status.id, Number(e.target.value)); }}
        >
          <option value="">Add transition to…</option>
          {targets.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </Select>
      )}

      {canEdit && (
        <button type="button" className="w-btn w-btn-sm w-btn-danger mt-5 w-full" disabled={statuses.length <= 1} onClick={onDelete}>
          <Trash2 size={13} />
          Delete status
        </button>
      )}
    </PanelShell>
  );
}

// ─── Mũi tên ─────────────────────────────────────────────────────

export function EdgeInspector({
  edgeKey, statuses, canEdit, draft, onClose, onSelectEdge,
}: {
  edgeKey: string; statuses: WorkStatus[]; canEdit: boolean; draft: TransitionDraft; onClose: () => void; onSelectEdge: (key: string) => void;
}) {
  const { from, to } = parsePair(edgeKey);
  const byId = new Map(statuses.map((s) => [s.id, s]));
  const a = from === null ? null : byId.get(from);
  const b = byId.get(to);
  if (!b || (from !== null && !a)) return null;
  const reverse = from === null ? null : pairKey(to, from);
  const hasReverse = !!reverse && draft.pairs.has(reverse);
  return (
    <PanelShell eyebrow="Transition" onClose={onClose}>
      <div className="flex flex-wrap items-center gap-1.5">
        {a ? <StatusBadge status={a} /> : <AnyPill />}
        <ArrowRight size={14} className="shrink-0 text-[var(--w-text-3)]" />
        <StatusBadge status={b} />
      </div>
      <p className="mt-3 text-[12px] leading-relaxed text-[var(--w-text-2)]">
        {a ? <>Issues in <b className="font-medium text-[var(--w-text)]">{a.name}</b> can move to <b className="font-medium text-[var(--w-text)]">{b.name}</b>.</>
          : <>Issues in <b className="font-medium text-[var(--w-text)]">any status</b> can move to <b className="font-medium text-[var(--w-text)]">{b.name}</b> — Jira calls this a global transition.</>}
        {hasReverse && ' They can also move back.'}
      </p>
      {canEdit && (
        <div className="mt-4 flex flex-col gap-2">
          {reverse && !hasReverse && (
            <button type="button" className="w-btn w-btn-sm w-full" onClick={() => { draft.add(to, from!); onSelectEdge(reverse); }}>
              <ArrowLeftRight size={13} />
              Allow moving back ({b.name} → {a!.name})
            </button>
          )}
          <button type="button" className="w-btn w-btn-sm w-btn-danger w-full" onClick={() => { draft.remove(edgeKey); onClose(); }}>
            <Trash2 size={13} />
            Delete transition
          </button>
          <p className="text-[11px] text-[var(--w-text-3)]">Tip: select an arrow and press Delete.</p>
        </div>
      )}
    </PanelShell>
  );
}
