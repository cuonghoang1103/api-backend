'use client';

/**
 * Hoạt động của thẻ: bình luận (có @nhắc tên) và lịch sử thay đổi.
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Bot, Pencil, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import {
  userName, workApi, workError, type HistoryEntry, type ProjectConfig, type TiptapDoc, type WorkComment,
} from '@/lib/work-api';
import { wk, type Lookups } from './hooks';
import RichEditor, { isDocEmpty, RichView } from './RichEditor';
import { PRIORITIES, relativeTime, Spinner, UserAvatar, formatDate } from './ui';
import { ConfirmDialog } from './settings/shared';

function CommentComposer({ config, pid, num }: { config: ProjectConfig; pid: number; num: number }) {
  const qc = useQueryClient();
  const [doc, setDoc] = useState<TiptapDoc | null>(null);
  const [key, setKey] = useState(0);
  const [focused, setFocused] = useState(false);
  const add = useMutation({
    mutationFn: () => workApi.addComment(pid, num, doc!),
    onSuccess: () => {
      setDoc(null);
      setKey((k) => k + 1);
      setFocused(false);
      qc.invalidateQueries({ queryKey: wk.comments(pid, num) });
      qc.invalidateQueries({ queryKey: wk.issue(pid, num) });
    },
    onError: (err) => toast.error(workError(err, 'Could not post the comment')),
  });
  const empty = isDocEmpty(doc);
  const submit = () => !empty && !add.isPending && add.mutate();
  const me = useAuthStore((s) => s.user);

  return (
    <div className="flex gap-3">
      <UserAvatar user={me ? { username: me.username, fullName: me.fullName ?? null, displayName: me.displayName ?? null, avatarUrl: me.avatarUrl ?? null } : null} size={26} className="mt-1" />
      <div className="min-w-0 flex-1" onFocusCapture={() => setFocused(true)}>
        <RichEditor
          key={key}
          value={doc}
          onChange={(d) => setDoc(d)}
          members={config.members}
          placeholder="Add a comment… Type @ to mention someone"
          minHeight={focused ? 72 : 36}
          toolbar={focused}
          onSubmit={submit}
        />
        {focused && (
          <div className="mt-2 flex items-center gap-2">
            <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={empty || add.isPending} onClick={submit}>
              {add.isPending ? 'Saving…' : 'Comment'}
            </button>
            <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => { setFocused(false); setDoc(null); setKey((k) => k + 1); }}>Cancel</button>
            <span className="ml-auto text-[11px] text-[var(--w-text-3)]"><span className="w-kbd">⌘</span> <span className="w-kbd">↵</span> to send</span>
          </div>
        )}
      </div>
    </div>
  );
}

function CommentItem({ c, config, pid, num }: { c: WorkComment; config: ProjectConfig; pid: number; num: number }) {
  const qc = useQueryClient();
  const meId = useAuthStore((s) => s.user?.id);
  const [editing, setEditing] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [draft, setDraft] = useState<TiptapDoc>(c.bodyJson);
  const mine = !!c.author && c.author.id === meId;
  const canDelete = (mine && config.permissions.comment) || config.role === 'ADMIN';

  const refresh = () => qc.invalidateQueries({ queryKey: wk.comments(pid, num) });
  const save = useMutation({
    mutationFn: () => workApi.editComment(pid, num, c.id, draft),
    onSuccess: () => { setEditing(false); refresh(); },
    onError: (err) => toast.error(workError(err, 'Could not save')),
  });
  const del = useMutation({
    mutationFn: () => workApi.deleteComment(pid, num, c.id),
    onSuccess: () => { refresh(); qc.invalidateQueries({ queryKey: wk.issue(pid, num) }); },
    onError: (err) => toast.error(workError(err, 'Could not delete')),
  });

  return (
    <div id={`comment-${c.id}`} className="group flex gap-3">
      {c.isAi ? (
        <span className="mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]"><Bot size={14} /></span>
      ) : (
        <UserAvatar user={c.author} size={26} className="mt-0.5" />
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2 text-[12px]">
          <span className="font-semibold text-[var(--w-text)]">{c.isAi ? 'CT Work AI' : userName(c.author)}</span>
          <span className="text-[var(--w-text-3)]" title={new Date(c.createdAt).toLocaleString('en-US')}>{relativeTime(c.createdAt)}</span>
          {c.editedAt && <span className="text-[var(--w-text-3)]">(edited)</span>}
          {!editing && (mine || canDelete) && (
            <span className="ml-auto flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              {mine && (
                <button type="button" title="Edit" onClick={() => { setDraft(c.bodyJson); setEditing(true); }} className="w-btn w-btn-ghost w-btn-icon w-btn-sm"><Pencil size={12} /></button>
              )}
              {canDelete && (
                <button type="button" title="Delete" onClick={() => setConfirmDel(true)} className="w-btn w-btn-ghost w-btn-icon w-btn-sm"><Trash2 size={12} /></button>
              )}
            </span>
          )}
        </div>
        {editing ? (
          <>
            <RichEditor value={draft} onChange={(d) => setDraft(d)} members={config.members} autoFocus onSubmit={() => save.mutate()} onEscape={() => setEditing(false)} />
            <div className="mt-2 flex gap-2">
              <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={save.isPending || isDocEmpty(draft)} onClick={() => save.mutate()}>Save</button>
              <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <RichView value={c.bodyJson} />
        )}
      </div>
      <ConfirmDialog
        open={confirmDel}
        onClose={() => setConfirmDel(false)}
        onConfirm={() => { setConfirmDel(false); del.mutate(); }}
        title="Delete comment"
        body="This comment will be removed for everyone."
        confirmLabel="Delete"
        pending={del.isPending}
      />
    </div>
  );
}

// ─── Lịch sử ─────────────────────────────────────────────────────

const FIELD_LABEL: Record<string, string> = {
  title: 'title', description: 'description', statusId: 'status', assigneeId: 'assignee', priority: 'priority',
  storyPoints: 'story points', originalEstimateMin: 'original estimate', remainingEstimateMin: 'remaining estimate',
  startDate: 'start date', dueDate: 'due date', parentId: 'parent', sprintId: 'sprint', labels: 'labels', components: 'components',
};

function describe(h: HistoryEntry, lk: Lookups, config: ProjectConfig): { text: string; from?: string; to?: string } {
  const status = (v: string | null) => (v ? lk.statuses.get(Number(v))?.name ?? 'Unknown' : 'None');
  const person = (v: string | null) => (v ? userName(lk.members.get(Number(v))) : 'Unassigned');
  const prio = (v: string | null) => PRIORITIES.find((p) => String(p.value) === v)?.label ?? v ?? 'None';
  const sprint = (v: string | null) => (v ? config.sprints.find((s) => String(s.id) === v)?.name ?? `Sprint #${v}` : 'Backlog');
  const minutes = (v: string | null) => (v ? `${Math.round(Number(v) / 60 * 10) / 10}h` : 'None');
  switch (h.field) {
    case 'created': return { text: 'created the issue' };
    case 'deleted': return { text: 'deleted the issue' };
    case 'link': return { text: `linked ${h.toValue?.toLowerCase() ?? ''}` };
    case 'attachment': return h.toValue ? { text: `attached ${h.toValue}` } : { text: `removed attachment ${h.fromValue}` };
    case 'description': return { text: 'updated the description' };
    case 'statusId': return { text: 'changed the status', from: status(h.fromValue), to: status(h.toValue) };
    case 'assigneeId': return { text: 'changed the assignee', from: person(h.fromValue), to: person(h.toValue) };
    case 'priority': return { text: 'changed the priority', from: prio(h.fromValue), to: prio(h.toValue) };
    case 'sprintId': return { text: 'moved the issue', from: sprint(h.fromValue), to: sprint(h.toValue) };
    case 'originalEstimateMin':
    case 'remainingEstimateMin': return { text: `changed the ${FIELD_LABEL[h.field]}`, from: minutes(h.fromValue), to: minutes(h.toValue) };
    case 'startDate':
    case 'dueDate': return { text: `changed the ${FIELD_LABEL[h.field]}`, from: formatDate(h.fromValue) || 'None', to: formatDate(h.toValue) || 'None' };
    case 'parentId': return { text: h.toValue ? 'changed the parent' : 'removed the parent' };
    default: return { text: `changed the ${FIELD_LABEL[h.field] ?? h.field}`, from: h.fromValue ?? 'None', to: h.toValue ?? 'None' };
  }
}

function HistoryList({ pid, num, config, lk }: { pid: number; num: number; config: ProjectConfig; lk: Lookups }) {
  const q = useQuery({ queryKey: wk.history(pid, num), queryFn: () => workApi.history(pid, num) });
  if (q.isLoading) return <div className="py-4"><Spinner /></div>;
  if (!q.data?.length) return <p className="text-[13px] text-[var(--w-text-3)]">No history yet.</p>;
  return (
    <ol className="space-y-3">
      {q.data.map((h) => {
        const d = describe(h, lk, config);
        const who = h.actorKind === 'AI' ? 'CT Work AI' : h.actorKind === 'AUTOMATION' ? 'Automation' : h.actorKind === 'SYSTEM' ? 'System' : userName(h.actor);
        return (
          <li key={h.id} className="flex gap-3 text-[13px]">
            <UserAvatar user={h.actor} size={20} className="mt-0.5" />
            <div className="min-w-0 flex-1 leading-relaxed text-[var(--w-text-2)]">
              <span className="font-medium text-[var(--w-text)]">{who}</span> {d.text}
              <span className="ml-2 text-[12px] text-[var(--w-text-3)]" title={new Date(h.createdAt).toLocaleString('en-US')}>{relativeTime(h.createdAt)}</span>
              {d.from !== undefined && (
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[12px]">
                  <span className="rounded-[4px] bg-[var(--w-sunken)] px-1.5 py-0.5 line-through decoration-[var(--w-text-3)]">{d.from}</span>
                  <span className="text-[var(--w-text-3)]">→</span>
                  <span className="rounded-[4px] bg-[var(--w-sunken)] px-1.5 py-0.5 text-[var(--w-text)]">{d.to}</span>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function IssueActivity({ pid, num, config, lk }: { pid: number; num: number; config: ProjectConfig; lk: Lookups }) {
  const [tab, setTab] = useState<'comments' | 'history'>('comments');
  const comments = useQuery({ queryKey: wk.comments(pid, num), queryFn: () => workApi.comments(pid, num) });
  return (
    <section>
      <div className="mb-4 flex items-center gap-1 border-b border-[var(--w-border)]">
        {(['comments', 'history'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn('-mb-px border-b-2 px-2 pb-2 text-[13px] font-medium capitalize', tab === t ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-3)] hover:text-[var(--w-text-2)]')}
          >
            {t}{t === 'comments' && comments.data?.length ? <span className="ml-1.5 text-[var(--w-text-3)]">{comments.data.length}</span> : null}
          </button>
        ))}
      </div>
      {tab === 'comments' ? (
        <div className="space-y-5">
          {comments.isLoading && <Spinner />}
          {comments.data?.map((c) => <CommentItem key={c.id} c={c} config={config} pid={pid} num={num} />)}
          {config.permissions.comment ? (
            <CommentComposer config={config} pid={pid} num={num} />
          ) : (
            <p className="text-[12px] text-[var(--w-text-3)]">You have view-only access to this project.</p>
          )}
        </div>
      ) : (
        <HistoryList pid={pid} num={num} config={config} lk={lk} />
      )}
    </section>
  );
}
