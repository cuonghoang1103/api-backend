'use client';

/**
 * Thanh sửa hàng loạt nổi ở đáy màn hình — dùng chung cho Backlog và danh
 * sách Issues. Mọi thay đổi đi qua workApi.bulkUpdate (backend báo riêng thẻ
 * nào hỏng, thẻ khác vẫn đi).
 */

import { useRef, type ReactNode, type RefObject } from 'react';
import { ArrowRightLeft, CircleDot, Flag, Layers, Tag, Trash2, UserRound, X } from 'lucide-react';
import { userName, type BulkPatch, type ProjectConfig, type WorkSprint } from '@/lib/work-api';
import type { Lookups } from '../hooks';
import { PickerList, Popover, PRIORITIES, PriorityIcon, UserAvatar, useToggle, type PickOption } from '../ui';
import { statusNameOptions } from './bulk';
import { wt } from '@/components/work/i18n';
import { statusName } from '@/components/work/i18n/names';

function Action<T>({ icon, label, options, onPick, placeholder, width = 230 }: {
  icon: ReactNode; label: string; options: PickOption<T>[]; onPick: (v: T) => void; placeholder: string; width?: number;
}) {
  const t = useToggle();
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={ref} type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={t.toggle} aria-haspopup="listbox" aria-expanded={t.on}>
        {icon} {label}
      </button>
      <Popover open={t.on} onClose={t.close} anchorRef={ref as RefObject<HTMLElement>} width={width}>
        <PickerList options={options} selected={[]} onPick={(v) => { t.close(); onPick(v); }} placeholder={placeholder} />
      </Popover>
    </>
  );
}

export default function BulkBar({ count, config, lk, sprints, epics, onPatch, onStatus, onClear, onDelete, busy }: {
  count: number;
  config: ProjectConfig;
  lk: Lookups;
  /** Sprint chưa đóng để "Move to". */
  sprints: WorkSprint[];
  /** Có thì hiện nút Epic (đặt cha = epic). */
  epics?: Array<{ id: number; number: number; title: string }>;
  onPatch: (p: BulkPatch, label: string) => void;
  onStatus: (name: string) => void;
  onClear: () => void;
  onDelete?: () => void;
  busy?: boolean;
}) {
  const perms = config.permissions;
  const assignable = config.members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER');
  const openSprints = sprints.filter((s) => s.state !== 'CLOSED');
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[55] flex justify-center px-4">
      <div
        role="toolbar"
        aria-label={wt('board.bulkActions')}
        className="pointer-events-auto flex max-w-full flex-wrap items-center gap-1 rounded-[10px] border border-[var(--w-border-strong)] bg-[var(--w-raised)] px-2 py-1.5 text-[13px]"
        style={{ boxShadow: 'var(--w-shadow-pop)' }}
      >
        <span className="px-2 font-semibold tabular">{wt('board.selected', { count })}</span>
        {busy && <span className="h-3 w-3 animate-spin rounded-full border-2 border-[var(--w-border-strong)] border-t-[var(--w-accent)]" aria-label={wt('board.saving')} />}
        {perms.transition && (
          <Action
            icon={<CircleDot size={13} />}
            label={wt('board.status')}
            placeholder={wt('board.moveToStatus')}
            options={statusNameOptions(lk).map((s) => ({ value: s.name, label: statusName(s.name), icon: <span className="h-2 w-2 rounded-full" style={{ background: s.color }} /> }))}
            onPick={(name) => onStatus(name)}
          />
        )}
        {perms.editIssues && config.type !== 'KANBAN' && (
          <Action
            icon={<ArrowRightLeft size={13} />}
            label={wt('board.sprint')}
            placeholder={wt('board.sprintPh')}
            options={[...openSprints.map((s) => ({ value: s.id, label: s.name, hint: s.state === 'ACTIVE' ? wt('board.active') : undefined })), { value: 0, label: 'Backlog' }]}
            onPick={(v) => onPatch({ sprintId: v || null }, v ? wt('board.movedTo', { name: openSprints.find((s) => s.id === v)?.name }) : wt('board.movedBacklog'))}
          />
        )}
        {perms.editIssues && (
          <>
            <Action
              icon={<UserRound size={13} />}
              label={wt('board.assign')}
              width={240}
              placeholder={wt('board.assignTo')}
              options={[{ value: 0, label: wt('common.unassigned'), icon: <UserAvatar user={null} size={16} /> }, ...assignable.map((m) => ({ value: m.id, label: userName(m), keywords: m.username, icon: <UserAvatar user={m} size={16} /> }))]}
              onPick={(v) => onPatch({ assigneeId: v || null }, v ? wt('board.assignedTo', { name: userName(assignable.find((m) => m.id === v)) }) : wt('board.unassignedDone'))}
            />
            <Action
              icon={<Flag size={13} />}
              label={wt('board.priority')}
              width={200}
              placeholder={wt('board.priorityPh')}
              options={PRIORITIES.map((p) => ({ value: p.value, label: p.label, icon: <PriorityIcon priority={p.value} size={14} /> }))}
              onPick={(v) => onPatch({ priority: v }, wt('board.setPriority', { name: PRIORITIES.find((p) => p.value === v)?.label }))}
            />
            {config.labels.length > 0 && (
              <Action
                icon={<Tag size={13} />}
                label={wt('board.addLabel')}
                placeholder={wt('board.labelPh')}
                options={config.labels.map((l) => ({ value: l.id, label: l.name, icon: <span className="h-2 w-2 rounded-full" style={{ background: l.color }} /> }))}
                onPick={(v) => onPatch({ addLabelIds: [v] }, wt('board.labelled', { name: lk.labels.get(v)?.name ?? '' }).trim())}
              />
            )}
            {epics && (
              <Action
                icon={<Layers size={13} />}
                label={wt('board.epic')}
                width={280}
                placeholder={wt('board.searchEpics')}
                options={[{ value: 0, label: wt('board.noEpic') }, ...epics.map((e) => ({ value: e.id, label: e.title, hint: lk.issueKey(e.number), keywords: lk.issueKey(e.number) }))]}
                onPick={(v) => onPatch({ parentId: v || null }, v ? wt('board.addedToEpic', { name: epics.find((e) => e.id === v)?.title }) : wt('board.removedEpic'))}
              />
            )}
          </>
        )}
        {onDelete && perms.deleteIssues && (
          <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-danger" onClick={onDelete}><Trash2 size={13} /> {wt('board.delete')}</button>
        )}
        <span className="mx-1 h-4 w-px bg-[var(--w-border)]" />
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" title={wt('board.clearSelEsc')} aria-label={wt('board.clearSel')} onClick={onClear}><X size={14} /></button>
      </div>
    </div>
  );
}
