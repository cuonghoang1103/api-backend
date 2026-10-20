'use client';

/**
 * "Create with CuongMini" — bản nháp kế hoạch (tuỳ chọn "Xem trước khi tạo"): sửa tại chỗ mọi thứ trước khi tạo thật.
 * Thẻ đã sửa tay mang `locked` ⇒ "Nhờ CuongMini sửa" và "Cân lại" không đè. Không có tên model thật nào ở đây.
 */

import { Fragment, useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronRight, Lock, Plus, Trash2, UserRound, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlanItem, PlanMember, PlanProject, SetupPlan } from '@/lib/work-setup-api';
import AiMarkdown from '@/components/work/ai/AiMarkdown';
import { wt, type WKey } from '@/components/work/i18n';

type Tab = 'overview' | 'backlog' | 'docs' | 'quality' | 'schedule';
const TABS: Tab[] = ['overview', 'backlog', 'docs', 'quality', 'schedule'];
const KIND_COLOR: Record<PlanItem['kind'], string> = { EPIC: 'var(--w-epic)', STORY: 'var(--w-green)', TASK: 'var(--w-blue)', BUG: 'var(--w-red)', SUBTASK: 'var(--w-text-3)' };

export default function PlanPreview({ plan, onChange, disabled }: { plan: SetupPlan; onChange: (p: SetupPlan) => void; disabled?: boolean }) {
  const [pi, setPi] = useState(0);
  const [tab, setTab] = useState<Tab>('overview');
  const p = plan.projects[Math.min(pi, plan.projects.length - 1)];
  const members = plan.members.filter((m) => m.projectRef === p.ref);
  const setProject = (np: PlanProject) => onChange({ ...plan, projects: plan.projects.map((x) => (x.ref === np.ref ? np : x)) });
  const warnings = plan.warnings.filter((w) => !w.projectRef || w.projectRef === p.ref);
  const counts = useMemo(() => ({
    epics: p.items.filter((i) => i.kind === 'EPIC').length,
    work: p.items.filter((i) => i.kind !== 'EPIC' && i.kind !== 'SUBTASK').length,
    subs: p.items.filter((i) => i.kind === 'SUBTASK').length,
    points: p.items.filter((i) => i.kind !== 'EPIC' && i.kind !== 'SUBTASK').reduce((n, i) => n + (i.points ?? 0), 0),
  }), [p]);

  return (
    <div className="min-w-0">
      {plan.projects.length > 1 && (
        <div className="mb-3 flex max-w-full gap-1 overflow-x-auto pb-1" role="tablist" aria-label={wt('tcm.pProjects')}>
          {plan.projects.map((x, i) => (
            <button key={x.ref} type="button" role="tab" aria-selected={i === pi} onClick={() => setPi(i)}
              className={cn('shrink-0 rounded-[6px] border px-2.5 py-1 text-[12.5px] font-medium', i === pi ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border-strong)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
              <span className="font-mono">{x.key}</span> · {x.name}
            </button>
          ))}
        </div>
      )}
      <div className="w-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-[var(--w-border)] px-4 py-3">
          <input className="w-input-bare min-w-0 flex-1 rounded-[5px] px-1 text-[16px] font-semibold hover:bg-[var(--w-hover)]" value={p.name} disabled={disabled} aria-label={wt('tcm.projectName')}
            onChange={(e) => setProject({ ...p, name: e.target.value })} />
          <input className="w-input h-8 w-[110px] font-mono uppercase" value={p.key} maxLength={10} disabled={disabled} aria-label={wt('tcm.key')}
            onChange={(e) => setProject({ ...p, key: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) })} />
          <span className="w-full text-[12px] text-[var(--w-text-3)]">{wt('tcm.pStats', { epics: counts.epics, work: counts.work, subs: counts.subs, points: counts.points, sprints: p.sprints.length, pages: p.pages.length })}</span>
        </div>
        <div className="flex max-w-full overflow-x-auto border-b border-[var(--w-border)] px-3" role="tablist" aria-label={wt('tcm.pViews')}>
          {TABS.map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
              className={cn('-mb-px shrink-0 whitespace-nowrap border-b-2 px-2.5 py-2.5 text-[13px] font-medium', tab === t ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
              {wt(`tcm.pTab_${t}` as const)}{t === 'overview' && warnings.length ? <span className="ml-1 rounded-full bg-[var(--w-accent-soft)] px-1.5 text-[11px] text-[var(--w-accent-text)]">{warnings.length}</span> : null}
            </button>
          ))}
        </div>
        <div className="p-3 md:p-4">
          {tab === 'overview' && <OverviewTab plan={plan} p={p} members={members} warnings={warnings} onPlan={onChange} setProject={setProject} disabled={disabled} />}
          {tab === 'backlog' && <BacklogTab p={p} members={members} setProject={setProject} disabled={disabled} />}
          {tab === 'docs' && <DocsTab p={p} setProject={setProject} disabled={disabled} />}
          {tab === 'quality' && <QualityTab p={p} members={members} setProject={setProject} disabled={disabled} />}
          {tab === 'schedule' && <ScheduleTab p={p} setProject={setProject} disabled={disabled} />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ plan, p, members, warnings, onPlan, setProject, disabled }: {
  plan: SetupPlan; p: PlanProject; members: PlanMember[]; warnings: SetupPlan['warnings']; onPlan: (x: SetupPlan) => void; setProject: (x: PlanProject) => void; disabled?: boolean;
}) {
  const load = (ref: string) => p.items.filter((i) => i.assigneeRef === ref && i.kind !== 'EPIC' && i.kind !== 'SUBTASK').reduce((n, i) => n + (i.points ?? 1), 0);
  const setMember = (ref: string, patch: Partial<PlanMember>) => onPlan({ ...plan, members: plan.members.map((m) => (m.ref === ref ? { ...m, ...patch } : m)) });
  return (
    <div className="space-y-4">
      {warnings.length > 0 && (
        <ul className="space-y-1.5">
          {warnings.map((w, i) => (
            <li key={i} className="flex gap-2 rounded-[7px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-2.5 py-2 text-[12.5px]">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-[var(--w-orange)]" />
              <span className="min-w-0"><b className="font-medium">{wt(`tcm.warn_${w.kind}` as const)}</b> — {w.message}</span>
            </li>
          ))}
        </ul>
      )}
      <div>
        <h4 className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold"><Users size={14} /> {wt('tcm.pMembers')}</h4>
        {members.length === 0 ? <p className="text-[12.5px] text-[var(--w-text-3)]">{wt('tcm.pNoMembers')}</p> : (
          <div className="max-w-full overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
            <table className="w-full min-w-[640px] text-[12.5px]">
              <thead className="bg-[var(--w-sunken)] text-left text-[11.5px] text-[var(--w-text-2)]">
                <tr><th className="px-2 py-1.5 font-medium">{wt('tcm.colName')}</th><th className="px-2 py-1.5 font-medium">{wt('tcm.colRole')}</th><th className="px-2 py-1.5 font-medium">{wt('tcm.colLevel')}</th><th className="px-2 py-1.5 font-medium">{wt('tcm.pLoad')}</th><th className="px-2 py-1.5 font-medium">{wt('tcm.pAccount')}</th></tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.ref} className="border-t border-[var(--w-border)]">
                    <td className="px-2 py-1.5"><span className="font-medium">{m.name}</span>{m.leader && <span className="ml-1.5 rounded-[4px] bg-[var(--w-accent-soft)] px-1 text-[10.5px] font-semibold text-[var(--w-accent-text)]">{wt('tcm.leader')}</span>}{m.studentId && <span className="block text-[11px] text-[var(--w-text-3)]">{m.studentId}</span>}</td>
                    <td className="p-0.5"><input className="w-input-bare h-8 w-full rounded-[5px] px-1.5 hover:bg-[var(--w-hover)]" value={m.role} disabled={disabled} aria-label={wt('tcm.colRole')} onChange={(e) => setMember(m.ref, { role: e.target.value })} /></td>
                    <td className="px-2 py-1.5 tabular-nums">{m.level}/5 · {m.hoursPerWeek}h</td>
                    <td className="px-2 py-1.5 tabular-nums">{load(m.ref)} {wt('tcm.pts')}</td>
                    <td className="px-2 py-1.5">
                      {m.mapping === 'USER' ? <span className="inline-flex items-center gap-1 text-[var(--w-green)]"><UserRound size={12} /> {wt('tcm.mapUser')}</span> : (
                        <select className="w-input-bare h-8 rounded-[5px] px-1 hover:bg-[var(--w-hover)]" value={m.mapping} disabled={disabled} aria-label={wt('tcm.pAccount')} onChange={(e) => setMember(m.ref, { mapping: e.target.value as PlanMember['mapping'] })}>
                          <option value="INVITE" disabled={!m.email}>{wt('tcm.mapInvite')}</option>
                          <option value="PLACEHOLDER">{wt('tcm.mapPlaceholder')}</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-1.5 text-[11.5px] text-[var(--w-text-3)]">{wt('tcm.pAccountHint')}</p>
      </div>
      {p.sprints.length > 0 && (
        <div>
          <h4 className="mb-1.5 text-[13px] font-semibold">{wt('tcm.pSprints')}</h4>
          <ul className="space-y-1">
            {p.sprints.map((s) => {
              const n = p.items.filter((i) => i.sprintRef === s.ref && i.kind !== 'SUBTASK').length;
              return (
                <li key={s.ref} className="grid grid-cols-1 items-center gap-1 rounded-[7px] border border-[var(--w-border)] px-2.5 py-1.5 sm:grid-cols-[180px_1fr_auto]">
                  <span className="text-[12.5px] font-medium">{s.name} <span className="font-normal text-[var(--w-text-3)]">{s.start.slice(5)} → {s.end.slice(5)}</span></span>
                  <input className="w-input-bare h-8 min-w-0 rounded-[5px] px-1.5 text-[12.5px] hover:bg-[var(--w-hover)]" value={s.goal} disabled={disabled} placeholder={wt('tcm.pSprintGoal')} aria-label={wt('tcm.pSprintGoal')}
                    onChange={(e) => setProject({ ...p, sprints: p.sprints.map((x) => (x.ref === s.ref ? { ...x, goal: e.target.value } : x)) })} />
                  <span className="text-[11.5px] text-[var(--w-text-3)]">{wt('tcm.pItemsN', { n })}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function BacklogTab({ p, members, setProject, disabled }: { p: PlanProject; members: PlanMember[]; setProject: (x: PlanProject) => void; disabled?: boolean }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(p.items.filter((i) => i.kind === 'EPIC').slice(0, 2).map((i) => i.ref)));
  const [detail, setDetail] = useState<string | null>(null);
  const kids = (ref: string | null) => p.items.filter((i) => i.parentRef === ref);
  const edit = (ref: string, patch: Partial<PlanItem>) => setProject({ ...p, items: p.items.map((i) => (i.ref === ref ? { ...i, ...patch, locked: true } : i)) });
  const remove = (ref: string) => {
    const gone = new Set([ref]);
    for (let k = 0; k < 3; k++) for (const i of p.items) if (i.parentRef && gone.has(i.parentRef)) gone.add(i.ref);
    setProject({ ...p, items: p.items.filter((i) => !gone.has(i.ref)).map((i) => ({ ...i, blockedBy: i.blockedBy.filter((b) => !gone.has(b)) })) });
  };
  const add = (parentRef: string | null, kind: PlanItem['kind']) => {
    const ref = `u${Date.now().toString(36)}`;
    const it: PlanItem = { ref, kind, parentRef, title: kind === 'EPIC' ? wt('tcm.newEpic') : wt('tcm.newStory'), description: '', criteria: [], points: kind === 'EPIC' || kind === 'SUBTASK' ? null : 3, priority: 3, difficulty: 2, labels: [], component: '', area: '', assigneeRef: null, pairRef: null, sprintRef: null, milestoneRef: null, due: null, blockedBy: [], locked: true };
    setProject({ ...p, items: [...p.items, it] });
    if (parentRef) setOpen((s) => new Set([...s, parentRef]));
  };
  const toggle = (ref: string) => setOpen((s) => { const n = new Set(s); if (n.has(ref)) n.delete(ref); else n.add(ref); return n; });
  const epics = p.items.filter((i) => i.kind === 'EPIC');
  const loose = p.items.filter((i) => !i.parentRef && i.kind !== 'EPIC');

  // Hàm vẽ (KHÔNG phải component con) — component khai trong thân sẽ bị dựng lại mỗi lần gõ ⇒ ô nhập mất focus.
  const row = (it: PlanItem, depth: number) => {
    const children = kids(it.ref);
    const isOpen = open.has(it.ref);
    return (
      <Fragment key={it.ref}>
        <div className={cn('group grid min-w-[760px] grid-cols-[minmax(0,1fr)_150px_56px_120px_86px_32px] items-center gap-1 border-t border-[var(--w-border)] py-0.5 pr-1', it.kind === 'EPIC' && 'bg-[var(--w-sunken)]')} style={{ paddingLeft: 6 + depth * 18 }}>
          <div className="flex min-w-0 items-center gap-1">
            <button type="button" className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] hover:bg-[var(--w-hover)]', !children.length && 'invisible')} aria-label={isOpen ? wt('tcm.collapse') : wt('tcm.expand')} onClick={() => toggle(it.ref)}>
              {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </button>
            <span className="shrink-0 rounded-[4px] px-1 text-[10px] font-bold" style={{ color: KIND_COLOR[it.kind], background: `color-mix(in srgb, ${KIND_COLOR[it.kind]} 12%, transparent)` }}>{it.kind[0]}</span>
            <input className={cn('w-input-bare h-8 min-w-0 flex-1 rounded-[5px] px-1.5 hover:bg-[var(--w-hover)] focus:bg-[var(--w-panel)]', it.kind === 'EPIC' && 'font-semibold')} value={it.title} disabled={disabled} aria-label={wt('tcm.pTitle')}
              onChange={(e) => edit(it.ref, { title: e.target.value })} />
            {it.locked && <span title={wt('tcm.lockedHint')}><Lock size={11} className="shrink-0 text-[var(--w-text-3)]" /></span>}
            {it.pairRef && <span className="shrink-0 rounded-[4px] bg-[var(--w-accent-soft)] px-1 text-[10px] text-[var(--w-accent-text)]" title={members.find((m) => m.ref === it.pairRef)?.name}>{wt('tcm.pair')}</span>}
            <button type="button" className="shrink-0 text-[11px] text-[var(--w-accent-text)] opacity-0 hover:underline group-hover:opacity-100 focus:opacity-100" onClick={() => setDetail(detail === it.ref ? null : it.ref)}>{wt('tcm.details')}</button>
          </div>
          <select className="w-input-bare h-8 min-w-0 rounded-[5px] px-1 text-[12px] hover:bg-[var(--w-hover)]" value={it.assigneeRef ?? ''} disabled={disabled} aria-label={wt('tcm.pAssignee')} onChange={(e) => edit(it.ref, { assigneeRef: e.target.value || null })}>
            <option value="">{wt('tcm.unassigned')}</option>
            {members.map((m) => <option key={m.ref} value={m.ref}>{m.name}</option>)}
          </select>
          {it.kind === 'EPIC' || it.kind === 'SUBTASK' ? <span /> : (
            <input type="number" min={0} max={100} className="w-input-bare h-8 w-full rounded-[5px] px-1 text-[12px] tabular-nums hover:bg-[var(--w-hover)]" value={it.points ?? ''} disabled={disabled} aria-label={wt('tcm.pPoints')}
              onChange={(e) => edit(it.ref, { points: e.target.value === '' ? null : Math.max(0, Math.min(100, Number(e.target.value))) })} />
          )}
          {it.kind === 'EPIC' || it.kind === 'SUBTASK' ? <span className="truncate text-[11.5px] text-[var(--w-text-3)]">{it.kind === 'SUBTASK' ? '' : p.sprints.find((s) => s.ref === it.sprintRef)?.name ?? ''}</span> : (
            <select className="w-input-bare h-8 min-w-0 rounded-[5px] px-1 text-[12px] hover:bg-[var(--w-hover)]" value={it.sprintRef ?? ''} disabled={disabled || !p.sprints.length} aria-label={wt('tcm.pSprint')}
              onChange={(e) => { const s = p.sprints.find((x) => x.ref === e.target.value); edit(it.ref, { sprintRef: s?.ref ?? null, due: s?.end ?? it.due }); }}>
              <option value="">{wt('tcm.backlog')}</option>
              {p.sprints.map((s) => <option key={s.ref} value={s.ref}>{s.name}</option>)}
            </select>
          )}
          <span className="truncate text-[11.5px] tabular-nums text-[var(--w-text-3)]">{it.due ?? ''}</span>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon h-7 w-7" disabled={disabled} aria-label={wt('tcm.remove')} onClick={() => remove(it.ref)}><Trash2 size={13} /></button>
        </div>
        {detail === it.ref && (
          <div className="min-w-[760px] border-t border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5" style={{ paddingLeft: 30 + depth * 18 }}>
            <label className="w-label">{wt('tcm.pDescription')}</label>
            <textarea className="w-input mt-1 text-[12.5px]" rows={3} value={it.description} disabled={disabled} onChange={(e) => edit(it.ref, { description: e.target.value })} />
            <label className="w-label mt-2 block">{wt('tcm.pCriteria')}</label>
            <textarea className="w-input mt-1 text-[12.5px]" rows={3} value={it.criteria.join('\n')} disabled={disabled} placeholder={wt('tcm.pCriteriaPh')}
              onChange={(e) => edit(it.ref, { criteria: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean).slice(0, 15) })} />
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px]">
              <label className="flex items-center gap-1">{wt('tcm.pPriority')}
                <select className="w-input h-7 w-auto px-1 text-[12px]" value={it.priority} disabled={disabled} onChange={(e) => edit(it.ref, { priority: Number(e.target.value) })}>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}</select>
              </label>
              <label className="flex items-center gap-1">{wt('tcm.pDifficulty')}
                <select className="w-input h-7 w-auto px-1 text-[12px]" value={it.difficulty} disabled={disabled} onChange={(e) => edit(it.ref, { difficulty: Number(e.target.value) })}>{[1, 2, 3].map((n) => <option key={n} value={n}>{wt(`tcm.diff${n}` as WKey)}</option>)}</select>
              </label>
              <label className="flex items-center gap-1">{wt('tcm.pPairWith')}
                <select className="w-input h-7 w-auto px-1 text-[12px]" value={it.pairRef ?? ''} disabled={disabled} onChange={(e) => edit(it.ref, { pairRef: e.target.value || null })}>
                  <option value="">—</option>{members.filter((m) => m.ref !== it.assigneeRef).map((m) => <option key={m.ref} value={m.ref}>{m.name}</option>)}
                </select>
              </label>
              {it.blockedBy.length > 0 && <span className="text-[var(--w-text-3)]">{wt('tcm.pBlockedBy', { list: it.blockedBy.map((b) => p.items.find((x) => x.ref === b)?.title ?? b).join(', ') })}</span>}
            </div>
          </div>
        )}
        {isOpen && children.map((c) => row(c, depth + 1))}
        {isOpen && it.kind === 'EPIC' && !disabled && (
          <div className="min-w-[760px] border-t border-[var(--w-border)] py-1" style={{ paddingLeft: 30 + (depth + 1) * 18 }}>
            <button type="button" className="text-[12px] text-[var(--w-accent-text)] hover:underline" onClick={() => add(it.ref, 'STORY')}><Plus size={12} className="mr-0.5 inline" />{wt('tcm.addStory')}</button>
          </div>
        )}
      </Fragment>
    );
  };

  return (
    <div className="min-w-0">
      <div className="max-w-full overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
        <div className="grid min-w-[760px] grid-cols-[minmax(0,1fr)_150px_56px_120px_86px_32px] gap-1 bg-[var(--w-sunken)] px-2 py-1.5 text-[11.5px] font-medium text-[var(--w-text-2)]">
          <span className="pl-12">{wt('tcm.pTitle')}</span><span>{wt('tcm.pAssignee')}</span><span>{wt('tcm.pPoints')}</span><span>{wt('tcm.pSprint')}</span><span>{wt('tcm.pDue')}</span><span />
        </div>
        {epics.map((e) => row(e, 0))}
        {loose.map((e) => row(e, 0))}
      </div>
      {!disabled && <button type="button" className="w-btn w-btn-sm mt-2" onClick={() => add(null, 'EPIC')}><Plus size={13} /> {wt('tcm.addEpic')}</button>}
    </div>
  );
}

function DocsTab({ p, setProject, disabled }: { p: PlanProject; setProject: (x: PlanProject) => void; disabled?: boolean }) {
  const [sel, setSel] = useState(0);
  const [editing, setEditing] = useState(false);
  const page = p.pages[Math.min(sel, p.pages.length - 1)];
  if (!page) return <p className="text-[12.5px] text-[var(--w-text-3)]">{wt('tcm.pNoPages')}</p>;
  const set = (patch: Partial<typeof page>) => setProject({ ...p, pages: p.pages.map((x) => (x.ref === page.ref ? { ...x, ...patch } : x)) });
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[220px_minmax(0,1fr)]">
      <ul className="flex max-w-full gap-1 overflow-x-auto md:block md:space-y-0.5 md:overflow-visible">
        {p.pages.map((x, i) => (
          <li key={x.ref} className="shrink-0">
            <button type="button" onClick={() => { setSel(i); setEditing(false); }} className={cn('w-full truncate rounded-[6px] px-2 py-1.5 text-left text-[12.5px]', i === sel ? 'bg-[var(--w-active)] font-medium' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>{x.title}</button>
          </li>
        ))}
      </ul>
      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-2">
          <input className="w-input-bare min-w-0 flex-1 rounded-[5px] px-1 text-[14px] font-semibold hover:bg-[var(--w-hover)]" value={page.title} disabled={disabled} aria-label={wt('tcm.pTitle')} onChange={(e) => set({ title: e.target.value })} />
          <button type="button" className="w-btn w-btn-sm" disabled={disabled} onClick={() => setEditing((v) => !v)}>{editing ? wt('tcm.preview') : wt('tcm.edit')}</button>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon h-8 w-8" disabled={disabled} aria-label={wt('tcm.remove')} onClick={() => { setProject({ ...p, pages: p.pages.filter((x) => x.ref !== page.ref) }); setSel(0); }}><Trash2 size={13} /></button>
        </div>
        {editing
          ? <textarea className="w-input min-h-[360px] font-mono text-[12px]" value={page.markdown} disabled={disabled} aria-label={page.title} onChange={(e) => set({ markdown: e.target.value })} />
          : <div className="max-h-[560px] overflow-y-auto rounded-[8px] border border-[var(--w-border)] p-3"><AiMarkdown text={page.markdown} /></div>}
      </div>
    </div>
  );
}

function QualityTab({ p, members, setProject, disabled }: { p: PlanProject; members: PlanMember[]; setProject: (x: PlanProject) => void; disabled?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="min-w-0">
        <h4 className="mb-1.5 text-[13px] font-semibold">{wt('tcm.pTests', { n: p.tests.length })}</h4>
        {p.tests.length === 0 ? <p className="text-[12.5px] text-[var(--w-text-3)]">—</p> : (
          <ul className="space-y-1">
            {p.tests.map((t) => (
              <li key={t.ref} className="flex items-start gap-2 rounded-[7px] border border-[var(--w-border)] px-2.5 py-1.5">
                <div className="min-w-0 flex-1">
                  <input className="w-input-bare h-7 w-full rounded-[5px] px-1 text-[12.5px] font-medium hover:bg-[var(--w-hover)]" value={t.title} disabled={disabled} aria-label={wt('tcm.pTitle')}
                    onChange={(e) => setProject({ ...p, tests: p.tests.map((x) => (x.ref === t.ref ? { ...x, title: e.target.value } : x)) })} />
                  <span className="block px-1 text-[11.5px] text-[var(--w-text-3)]">{wt('tcm.pSteps', { n: t.steps.length })}{t.storyRef ? ` · ${p.items.find((i) => i.ref === t.storyRef)?.title ?? ''}` : ''}</span>
                </div>
                <button type="button" className="w-btn w-btn-ghost w-btn-icon h-7 w-7" disabled={disabled} aria-label={wt('tcm.remove')} onClick={() => setProject({ ...p, tests: p.tests.filter((x) => x.ref !== t.ref) })}><Trash2 size={13} /></button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="min-w-0">
        <h4 className="mb-1.5 text-[13px] font-semibold">{wt('tcm.pRisks', { n: p.risks.length })}</h4>
        {p.risks.length === 0 ? <p className="text-[12.5px] text-[var(--w-text-3)]">—</p> : (
          <ul className="space-y-1">
            {p.risks.map((r) => (
              <li key={r.ref} className="rounded-[7px] border border-[var(--w-border)] px-2.5 py-1.5">
                <div className="flex items-start gap-2">
                  <span className="mt-1 shrink-0 rounded-[4px] bg-[var(--w-sunken)] px-1 text-[10.5px] font-semibold tabular-nums" title={wt('tcm.pRiskScore')}>{r.probability}×{r.impact}</span>
                  <input className="w-input-bare h-7 min-w-0 flex-1 rounded-[5px] px-1 text-[12.5px] font-medium hover:bg-[var(--w-hover)]" value={r.title} disabled={disabled} aria-label={wt('tcm.pTitle')}
                    onChange={(e) => setProject({ ...p, risks: p.risks.map((x) => (x.ref === r.ref ? { ...x, title: e.target.value } : x)) })} />
                  <select className="w-input-bare h-7 max-w-[130px] rounded-[5px] px-1 text-[12px] hover:bg-[var(--w-hover)]" value={r.ownerRef ?? ''} disabled={disabled} aria-label={wt('tcm.pOwner')}
                    onChange={(e) => setProject({ ...p, risks: p.risks.map((x) => (x.ref === r.ref ? { ...x, ownerRef: e.target.value || null } : x)) })}>
                    <option value="">—</option>{members.map((m) => <option key={m.ref} value={m.ref}>{m.name}</option>)}
                  </select>
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon h-7 w-7" disabled={disabled} aria-label={wt('tcm.remove')} onClick={() => setProject({ ...p, risks: p.risks.filter((x) => x.ref !== r.ref) })}><Trash2 size={13} /></button>
                </div>
                {r.mitigation && <p className="mt-0.5 px-1 text-[11.5px] leading-snug text-[var(--w-text-3)]">{wt('tcm.pMitigation')}: {r.mitigation}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ScheduleTab({ p, setProject, disabled }: { p: PlanProject; setProject: (x: PlanProject) => void; disabled?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="min-w-0">
        <h4 className="mb-1.5 text-[13px] font-semibold">{wt('tcm.milestones')}</h4>
        <ul className="space-y-1">
          {p.milestones.map((m) => (
            <li key={m.ref} className="grid grid-cols-[1fr_140px_32px] items-center gap-1">
              <input className="w-input h-8 text-[12.5px]" value={m.name} disabled={disabled} aria-label={wt('tcm.milestones')} onChange={(e) => setProject({ ...p, milestones: p.milestones.map((x) => (x.ref === m.ref ? { ...x, name: e.target.value } : x)) })} />
              <input type="date" className="w-input h-8 text-[12.5px]" value={m.date} disabled={disabled} aria-label={wt('tcm.date')} onChange={(e) => setProject({ ...p, milestones: p.milestones.map((x) => (x.ref === m.ref ? { ...x, date: e.target.value } : x)) })} />
              <button type="button" className="w-btn w-btn-ghost w-btn-icon h-8 w-8" disabled={disabled} aria-label={wt('tcm.remove')} onClick={() => setProject({ ...p, milestones: p.milestones.filter((x) => x.ref !== m.ref), items: p.items.map((i) => (i.milestoneRef === m.ref ? { ...i, milestoneRef: null } : i)) })}><Trash2 size={13} /></button>
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0">
        <h4 className="mb-1.5 text-[13px] font-semibold">{wt('tcm.pMeetings')}</h4>
        <ul className="space-y-1">
          {p.meetings.map((m) => (
            <li key={m.ref} className="flex items-center gap-2 rounded-[7px] border border-[var(--w-border)] px-2.5 py-1.5 text-[12.5px]">
              <span className="min-w-0 flex-1"><span className="font-medium">{m.title}</span><span className="block text-[11.5px] text-[var(--w-text-3)]">{wt(`tcm.dayLong${m.weekday}` as WKey)} {String(m.hour).padStart(2, '0')}:{String(m.minute).padStart(2, '0')} · {m.durationMin}′ · {m.intervalWeeks > 1 ? wt('tcm.everyNWeeks', { n: m.intervalWeeks }) : wt('tcm.weekly')}</span></span>
              <button type="button" className="w-btn w-btn-ghost w-btn-icon h-7 w-7" disabled={disabled} aria-label={wt('tcm.remove')} onClick={() => setProject({ ...p, meetings: p.meetings.filter((x) => x.ref !== m.ref) })}><Trash2 size={13} /></button>
            </li>
          ))}
        </ul>
        {p.dod.length > 0 && (
          <>
            <h4 className="mb-1.5 mt-4 text-[13px] font-semibold">Definition of Done</h4>
            <ul className="list-disc space-y-0.5 pl-5 text-[12.5px] text-[var(--w-text-2)]">{p.dod.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </>
        )}
      </div>
    </div>
  );
}
