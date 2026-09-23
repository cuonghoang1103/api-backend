'use client';

/**
 * Hộp thoại "Create issue". ⌘/Ctrl+Enter để tạo; bật "Create another" thì
 * giữ hộp thoại mở và giữ loại/sprint/epic — nhập liền tay cả backlog.
 *
 * Mở từ Board (không truyền sprint) ⇒ mặc định vào sprint đang chạy, để thẻ
 * mới hiện ngay ở cột đầu tiên của board thay vì lặn vào backlog.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { isAiQuotaError, workApi, workError, type ProjectConfig, type TiptapDoc } from '@/lib/work-api';
import UpgradeDialog from './ai/UpgradeDialog';
import { useLookups, wk } from './hooks';
import {
  AssigneePicker, DateInput, LabelsPicker, NumberInput, ParentPicker, PriorityPicker, SprintPicker, TypePicker,
} from './fields';
import RichEditor, { isDocEmpty } from './RichEditor';
import { Dialog } from './ui';
import { useIssueTemplates } from './templates/useIssueTemplates';

/** Chữ trơn của một tài liệu TipTap (đoạn cách nhau bằng xuống dòng). */
function docText(doc: TiptapDoc | null): string {
  const out: string[] = [];
  const walk = (n: unknown) => {
    const node = n as { type?: string; text?: string; content?: unknown[] };
    if (typeof node?.text === 'string') out.push(node.text);
    node?.content?.forEach(walk);
    if (node?.type && ['paragraph', 'heading', 'listItem', 'taskItem'].includes(node.type)) out.push('\n');
  };
  if (doc) walk(doc);
  return out.join('').replace(/\n{2,}/g, '\n').trim();
}

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
  const pathname = usePathname() ?? '';
  // Sprint mặc định: truyền vào (backlog/sprint cụ thể) > đang ở Board thì sprint đang chạy > backlog.
  const activeSprintId = config.sprints.find((s) => s.state === 'ACTIVE')?.id ?? null;
  const fromBoard = /\/board\/?$/.test(pathname);
  const defaultSprint = defaults?.sprintId !== undefined ? defaults.sprintId : fromBoard ? activeSprintId : null;
  const hoursMode = config.settings?.estimation === 'HOURS';

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
  // Mẫu mô tả: chỉ tự điền/đổi khi người dùng CHƯA sửa mô tả (descDirty).
  const [descDirty, setDescDirty] = useState(false);
  const [appliedTemplate, setAppliedTemplate] = useState<{ typeId: number; name: string } | null>(null);
  /** Loại vừa bấm "Clear" — không tự điền lại cho loại đó (đổi loại thì điền mẫu của loại mới). */
  const [clearedFor, setClearedFor] = useState<number | null>(null);
  const [resetTick, setResetTick] = useState(0);
  const dirtyRef = useRef(descDirty);
  dirtyRef.current = descDirty;
  const appliedRef = useRef(appliedTemplate);
  appliedRef.current = appliedTemplate;
  /** Chữ của mẫu vừa điền — trình soạn thảo tự chuẩn hoá lúc nạp và bắn onChange,
   *  nên "đã sửa" phải so NỘI DUNG với mẫu, không tin vào sự kiện onChange. */
  const appliedTextRef = useRef<string | null>(null);
  /** Về trạng thái "mô tả trống, chưa sửa" — đặt cả ref để effect điền mẫu chạy ngay trong cùng lượt. */
  const resetDescription = () => {
    setDesc(null);
    setDescKey((k) => k + 1);
    setDescDirty(false);
    setAppliedTemplate(null);
    setClearedFor(null);
    dirtyRef.current = false;
    appliedRef.current = null;
    setResetTick((t) => t + 1);
  };
  const [assigneeId, setAssigneeId] = useState<number | null>(null);
  const [priority, setPriority] = useState(3);
  const [labelIds, setLabelIds] = useState<number[]>([]);
  const [sprintId, setSprintId] = useState<number | null>(defaultSprint);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [parent, setParent] = useState<{ id: number; number: number; title: string } | null>(null);
  const [another, setAnother] = useState(false);
  const [storyPoints, setStoryPoints] = useState<number | null>(null);
  const [drafting, setDrafting] = useState(false);
  const [upgrade, setUpgrade] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  // Gợi ý thẻ có thể trùng khi đang gõ tiêu đề (pg_trgm ở backend — không tốn lượt AI).
  const [debouncedTitle, setDebouncedTitle] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedTitle(title.trim()), 350);
    return () => clearTimeout(t);
  }, [title]);
  const similar = useQuery({
    queryKey: ['work', 'similar', config.id, debouncedTitle],
    queryFn: () => workApi.similar(config.id, debouncedTitle),
    enabled: open && debouncedTitle.length >= 8,
    staleTime: 30_000,
  });

  /** "Draft with AI": biến ý tưởng (tiêu đề + mô tả đang gõ) thành một story đầy đủ. */
  const draftWithAi = async () => {
    // Mẫu chưa sửa chỉ là khung sườn — không gửi cho AI như thể là ý tưởng.
    const idea = [title.trim(), appliedTemplate && !descDirty ? '' : docText(desc)].filter(Boolean).join('\n').trim();
    if (!idea) { toast.error('Type a short idea first'); return; }
    setDrafting(true);
    try {
      const r = await workApi.aiQuick(config.id, { task: 'write_story', text: idea });
      const a = r.actions.find((x) => x.type === 'create_issue');
      if (!a || a.type !== 'create_issue') { toast.error('The AI did not return a story. Try rephrasing your idea.'); return; }
      setTitle(a.title);
      const content: unknown[] = (a.description ?? '').split(/\n{2,}/).filter(Boolean).map((p) => ({ type: 'paragraph', content: [{ type: 'text', text: p.trim() }] }));
      if (a.acceptanceCriteria?.length) {
        content.push({ type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Acceptance criteria' }] });
        content.push({ type: 'taskList', content: a.acceptanceCriteria.map((c) => ({ type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: c }] }] })) });
      }
      setDesc({ type: 'doc', content });
      setDescKey((k) => k + 1);
      setDescDirty(true);
      setAppliedTemplate(null);
      if (a.priority) setPriority(a.priority);
      if (a.storyPoints !== undefined && a.storyPoints !== null) setStoryPoints(a.storyPoints);
      const story = config.issueTypes.find((t) => t.key === (a.issueType || 'STORY').toUpperCase());
      if (story && level !== -1) setTypeId(story.id);
      toast.success('Draft ready — review it before creating');
    } catch (err) {
      if (isAiQuotaError(err)) setUpgrade(true);
      else toast.error(workError(err, 'The AI could not draft this issue'));
    } finally {
      setDrafting(false);
    }
  };

  const type = lk.types.get(typeId);
  const level = type?.level ?? 0;

  // Mở lại hộp thoại = bắt đầu từ mặc định mới (cột bấm "+" khác nhau có trạng thái khác nhau).
  useEffect(() => {
    if (!open) return;
    setTypeId(defaultType ?? 0);
    setTitle('');
    resetDescription();
    setAssigneeId(null);
    setPriority(3);
    setLabelIds([]);
    setSprintId(defaultSprint);
    setParent(defaults?.parent ?? null);
    setStoryPoints(null);
    setDueDate(null);
    setTimeout(() => titleRef.current?.focus(), 30);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- so theo id: object `defaults` mới mỗi lần render không được xoá chữ đang gõ
  }, [open, defaultType, defaultSprint, defaults?.parent?.id]);

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

  // ─── Mẫu mô tả theo loại thẻ ───
  const templates = useIssueTemplates(config.id, open);
  const templateOfType = templates.data?.find((t) => t.typeId === typeId && t.doc) ?? null;
  useEffect(() => {
    if (!open || !templates.data || dirtyRef.current) return;
    const t = templates.data.find((x) => x.typeId === typeId && x.doc);
    if (t?.doc && clearedFor !== typeId) {
      if (appliedRef.current?.typeId === typeId) return; // đã điền đúng mẫu này rồi
      setDesc(t.doc);
      appliedTextRef.current = docText(t.doc);
      setAppliedTemplate({ typeId, name: t.name });
    } else if (appliedRef.current) {
      // Loại mới không có mẫu ⇒ gỡ mẫu cũ (người dùng chưa sửa gì nên không mất chữ).
      setDesc(null);
      setAppliedTemplate(null);
    } else return;
    setDescKey((k) => k + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- trạng thái "đã sửa/đã điền" đọc qua ref
  }, [open, typeId, templates.data, clearedFor, resetTick]);

  const clearTemplate = () => {
    setDesc(null);
    setAppliedTemplate(null);
    setDescDirty(false);
    setClearedFor(typeId);
    setDescKey((k) => k + 1);
  };
  const applyTemplateNow = () => {
    if (!templateOfType?.doc) return;
    setDesc(templateOfType.doc);
    setAppliedTemplate({ typeId, name: templateOfType.name });
    setDescDirty(false);
    setClearedFor(null);
    setDescKey((k) => k + 1);
  };

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
      ...(storyPoints !== null && !isClient
        ? hoursMode ? { originalEstimateMin: Math.round(storyPoints * 60) } : { storyPoints }
        : {}),
      ...(dueDate ? { dueDate } : {}),
    }),
    onSuccess: (issue) => {
      qc.invalidateQueries({ queryKey: wk.board(config.id) });
      qc.invalidateQueries({ queryKey: wk.issues(config.id) });
      qc.invalidateQueries({ queryKey: wk.backlog(config.id) });
      const sprintName = issue.sprintId ? config.sprints.find((s) => s.id === issue.sprintId)?.name : null;
      toast.success(`Created ${lk.issueKey(issue.number)}${sprintName ? ` in ${sprintName}` : level === 0 && config.type !== 'KANBAN' ? ' in the backlog' : ''}`, {
        action: onCreated ? { label: 'Open', onClick: () => onCreated(issue.number) } : undefined,
      });
      if (another) {
        setTitle('');
        setStoryPoints(null);
        resetDescription(); // điền lại mẫu cho thẻ kế tiếp
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

        {config.permissions.useAi && level !== -1 && (
          <div className="-mt-1 mb-2 flex items-center gap-2">
            <button type="button" className="w-btn w-btn-ghost w-btn-sm" disabled={drafting} onClick={draftWithAi} title="Turn your idea into a user story with acceptance criteria (uses 1 AI request)">
              <Sparkles size={13} /> {drafting ? 'Drafting…' : 'Draft with AI'}
            </button>
          </div>
        )}
        {!!similar.data?.length && (
          <div className="mb-3 rounded-[6px] border border-[color-mix(in_srgb,var(--w-orange)_35%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_8%,transparent)] px-3 py-2 text-[12px]">
            <div className="mb-1 font-medium text-[var(--w-text)]">Possible duplicates</div>
            {similar.data.slice(0, 3).map((x) => (
              <div key={x.number} className="flex items-center gap-2 text-[var(--w-text-2)]">
                <span className="font-mono text-[11px] text-[var(--w-text-3)]">{lk.issueKey(x.number)}</span>
                <span className="truncate">{x.title}</span>
                {x.resolved && <span className="text-[var(--w-text-3)]">(done)</span>}
              </div>
            ))}
          </div>
        )}
        {appliedTemplate ? (
          <div className="mb-1.5 flex items-center gap-1.5 text-[12px] text-[var(--w-text-3)]" aria-live="polite">
            <FileText size={12} aria-hidden />
            <span>Template: <span className="font-medium text-[var(--w-text-2)]">{appliedTemplate.name}</span></span>
            <span aria-hidden>·</span>
            <button type="button" className="rounded-[3px] font-medium text-[var(--w-accent-text)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--w-accent-border)]" onClick={clearTemplate}>
              Clear
            </button>
          </div>
        ) : templateOfType && isDocEmpty(desc) ? (
          <div className="mb-1.5 flex items-center gap-1.5 text-[12px] text-[var(--w-text-3)]">
            <FileText size={12} aria-hidden />
            <button type="button" className="rounded-[3px] font-medium text-[var(--w-accent-text)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--w-accent-border)]" onClick={applyTemplateNow}>
              Use the {templateOfType.name} template
            </button>
          </div>
        ) : null}
        <RichEditor
          key={descKey}
          value={desc}
          onChange={(d, empty) => {
            setDesc(d);
            // Xoá sạch tay = coi như chưa sửa ⇒ đổi loại lại được điền mẫu.
            // Nội dung vẫn y như mẫu (chỉ bị editor chuẩn hoá) ⇒ cũng chưa sửa.
            const sameAsTemplate = !!appliedTemplate && appliedTextRef.current !== null && docText(d) === appliedTextRef.current;
            setDescDirty(!empty && !sameAsTemplate);
            if (empty && appliedTemplate) { setAppliedTemplate(null); setClearedFor(typeId); }
          }}
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
          {!isClient && level !== 1 && (
            <div>
              <div className="w-label">{hoursMode ? 'Estimate (hours)' : 'Story points'}</div>
              <div className="rounded-[var(--w-radius)] border border-[var(--w-border-strong)]">
                <NumberInput value={storyPoints} onCommit={setStoryPoints} placeholder={hoursMode ? 'e.g. 4' : 'e.g. 3'} />
              </div>
            </div>
          )}
          <div>
            <div className="w-label">Due date</div>
            <DateInput value={dueDate} onChange={setDueDate} bare={false} />
          </div>
        </div>
        {needsParent && <p className="mt-3 text-[12px] text-[var(--w-orange)]">Choose the parent issue for this sub-task.</p>}
      </div>
      <UpgradeDialog open={upgrade} onClose={() => setUpgrade(false)} />
    </Dialog>
  );
}
