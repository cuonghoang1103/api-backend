'use client';

/**
 * Hộp thoại "Create issue". ⌘/Ctrl+Enter để tạo; bật "Create another" thì
 * giữ hộp thoại mở và giữ loại/sprint/epic — nhập liền tay cả backlog.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { workApi, workError, type ProjectConfig, type TiptapDoc } from '@/lib/work-api';
import { useLookups, wk } from './hooks';
import {
  AssigneePicker, LabelsPicker, ParentPicker, PriorityPicker, SprintPicker, TypePicker,
} from './fields';
import RichEditor, { isDocEmpty } from './RichEditor';
import { Dialog } from './ui';

export interface CreateIssueDefaults {
  typeId?: number;
  statusId?: number;
  sprintId?: number | null;
  parentId?: number;
  /** Biết sẵn thẻ cha (bấm "Add sub-task" trong thẻ) thì khỏi phải tải lại. */
  parent?: { id: number; number: number; title: string };
}

export default function CreateIssueDialog({ open, onClose, config, defaults, onCreated }: {
  open: boolean;
  onClose: () => void;
  config: ProjectConfig;
  defaults?: CreateIssueDefaults;
  onCreated?: (num: number) => void;
}) {
  const qc = useQueryClient();
  const lk = useLookups(config);
  const meId = useAuthStore((s) => s.user?.id);
  const isClient = config.role === 'CLIENT';

  const defaultType = useMemo(() => {
    if (defaults?.typeId) return defaults.typeId;
    if (defaults?.parentId || defaults?.parent) return config.issueTypes.find((t) => t.level === -1)?.id;
    // Khách hàng chủ yếu báo lỗi; người khác mặc định Story (hoặc Task nếu mẫu không có Story).
    const pref = isClient ? ['BUG', 'TASK'] : ['STORY', 'TASK'];
    return pref.map((k) => config.issueTypes.find((t) => t.key === k)?.id).find(Boolean) ?? config.issueTypes.find((t) => t.level === 0)?.id;
  }, [config.issueTypes, defaults?.typeId, defaults?.parentId, defaults?.parent, isClient]);

  const [typeId, setTypeId] = useState<number>(defaultType ?? 0);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState<TiptapDoc | null>(null);
  const [descKey, setDescKey] = useState(0);
  const [assigneeId, setAssigneeId] = useState<number | null>(null);
  const [priority, setPriority] = useState(3);
  const [labelIds, setLabelIds] = useState<number[]>([]);
  const [sprintId, setSprintId] = useState<number | null>(defaults?.sprintId ?? null);
  const [parent, setParent] = useState<{ id: number; number: number; title: string } | null>(null);
  const [another, setAnother] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const type = lk.types.get(typeId);
  const level = type?.level ?? 0;

  // Mở lại hộp thoại = bắt đầu từ mặc định mới (cột bấm "+" khác nhau có trạng thái khác nhau).
  useEffect(() => {
    if (!open) return;
    setTypeId(defaultType ?? 0);
    setTitle('');
    setDesc(null);
    setDescKey((k) => k + 1);
    setAssigneeId(null);
    setPriority(3);
    setLabelIds([]);
    setSprintId(defaults?.sprintId ?? null);
    setParent(defaults?.parent ?? null);
    setTimeout(() => titleRef.current?.focus(), 30);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- so theo id: object `defaults` mới mỗi lần render không được xoá chữ đang gõ
  }, [open, defaultType, defaults?.sprintId, defaults?.parent?.id]);

  // Có parentId mặc định (bấm "Add sub-task" trong thẻ) ⇒ tải tiêu đề cha để hiện.
  useEffect(() => {
    if (!open || !defaults?.parentId || defaults.parent) return;
    let alive = true;
    workApi.issues(config.id, { limit: 1000 }).then((r) => {
      const hit = r.items.find((i) => i.id === defaults.parentId);
      if (alive && hit) setParent({ id: hit.id, number: hit.number, title: hit.title });
    }).catch(() => {});
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaults?.parentId, defaults?.parent?.id, config.id]);

  const create = useMutation({
    mutationFn: () => workApi.createIssue(config.id, {
      typeId,
      title: title.trim(),
      descriptionJson: desc && !isDocEmpty(desc) ? desc : undefined,
      priority,
      ...(isClient ? {} : { assigneeId: assigneeId ?? undefined, sprintId: level === 0 ? sprintId ?? undefined : undefined }),
      statusId: defaults?.statusId && lk.workflowOfType(typeId)?.statuses.some((s) => s.id === defaults.statusId) ? defaults.statusId : undefined,
      parentId: parent?.id,
      labelIds: labelIds.length ? labelIds : undefined,
    }),
    onSuccess: (issue) => {
      qc.invalidateQueries({ queryKey: wk.board(config.id) });
      qc.invalidateQueries({ queryKey: wk.issues(config.id) });
      toast.success(`Created ${lk.issueKey(issue.number)}`, {
        action: onCreated ? { label: 'Open', onClick: () => onCreated(issue.number) } : undefined,
      });
      if (another) {
        setTitle('');
        setDesc(null);
        setDescKey((k) => k + 1);
        titleRef.current?.focus();
      } else {
        onClose();
      }
    },
    onError: (err) => toast.error(workError(err, 'Could not create the issue')),
  });

  const needsParent = level === -1 && !parent;
  const canSubmit = !!title.trim() && !!typeId && !needsParent && !create.isPending;
  const submit = () => canSubmit && create.mutate();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      width={680}
      title={<span className="flex items-center gap-2"><span className="font-mono text-[12px] font-normal text-[var(--w-text-3)]">{config.key}</span> Create issue</span>}
      footer={(
        <div className="flex w-full items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-[12px] text-[var(--w-text-2)]">
            <input type="checkbox" checked={another} onChange={(e) => setAnother(e.target.checked)} className="accent-[var(--w-accent)]" />
            Create another
          </label>
          <div className="flex gap-2">
            <button type="button" className="w-btn w-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="button" className="w-btn w-btn-primary" disabled={!canSubmit} onClick={submit}>
              {create.isPending ? 'Creating…' : 'Create'} <span className="w-kbd border-white/30 text-white/80">⌘↵</span>
            </button>
          </div>
        </div>
      )}
    >
      <div
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submit(); }
        }}
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="w-[170px]">
            <TypePicker config={config} value={typeId} onChange={(id) => { setTypeId(id); setParent(null); }} levels={defaults?.parentId || defaults?.parent ? [-1] : undefined} />
          </div>
          {level !== 1 && (
            <div className="min-w-[200px] flex-1">
              <ParentPicker config={config} lk={lk} childLevel={level} value={parent} onChange={setParent} />
            </div>
          )}
        </div>

        <input
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); } }}
          maxLength={255}
          placeholder={level === 1 ? 'Epic name' : type?.key === 'BUG' ? 'What went wrong?' : 'Issue title'}
          className="mb-3 w-full bg-transparent text-[18px] font-semibold text-[var(--w-text)] outline-none placeholder:text-[var(--w-text-3)]"
        />

        <RichEditor
          key={descKey}
          value={desc}
          onChange={(d) => setDesc(d)}
          members={config.members}
          minHeight={120}
          placeholder={type?.key === 'BUG'
            ? 'Steps to reproduce, expected result, actual result…'
            : type?.key === 'STORY'
              ? 'As a <user>, I want <goal> so that <reason>. Add acceptance criteria as a checklist.'
              : 'Add a description… Type @ to mention someone.'}
        />

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {!isClient && (
            <div>
              <div className="w-label">Assignee</div>
              <AssigneePicker config={config} value={assigneeId} onChange={setAssigneeId} meId={meId} />
            </div>
          )}
          <div>
            <div className="w-label">Priority</div>
            <PriorityPicker value={priority} onChange={setPriority} />
          </div>
          <div>
            <div className="w-label">Labels</div>
            <LabelsPicker config={config} value={labelIds} onChange={setLabelIds} disabled={isClient} />
          </div>
          {!isClient && config.type !== 'KANBAN' && level === 0 && (
            <div>
              <div className="w-label">Sprint</div>
              <SprintPicker config={config} value={sprintId} onChange={setSprintId} />
            </div>
          )}
        </div>
        {needsParent && <p className="mt-3 text-[12px] text-[var(--w-orange)]">Choose the parent issue for this sub-task.</p>}
      </div>
    </Dialog>
  );
}
