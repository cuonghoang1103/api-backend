'use client';

/**
 * CTW đợt 9a — tab STREAM của trang lớp.
 *   GV/OWNER: ô soạn thông báo (TipTap, tệp, link, cả lớp / một số nhóm, hẹn giờ, ghim, khoá bình luận), sửa/xoá/ghim,
 *             ẩn/bỏ ẩn/xoá bình luận, công tắc "SV được bình luận" của lớp.
 *   SV:       đọc bài đã đăng của cả lớp / nhóm mình, bình luận khi lớp cho phép, thấy thông báo điểm danh đang mở.
 *   Dòng tự động của bài tập (9b) / quiz (9c) / tài liệu (9a) hiện gọn, bấm mở đúng tab.
 * Mọi hook đặt TRƯỚC lệnh return sớm.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  BookOpen, CalendarClock, ClipboardList, Copy, EyeOff, ListChecks, Megaphone, MessageSquareOff, Pencil, Pin, PinOff, QrCode, Send, Trash2, Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, type TiptapDoc } from '@/lib/work-api';
import RichEditor, { RichView, isDocEmpty } from '@/components/work/RichEditor';
import { EmptyState, PageLoading, Spinner, UserAvatar } from '@/components/work/ui';
import { ConfirmDialog, Switch } from '@/components/work/settings/shared';
import { useWT } from '@/components/work/i18n';
import { teachingKeys, type ClassDetail } from '@/components/work/teaching/teachingApi';
import { classroomApi, classroomKeys, type ClassFile, type StreamComment, type StreamPage, type StreamPost } from '../classroomApi';
import type { ClassSlotProps } from '../slots/types';
import { AttachBar, FileChips, LinkCards } from './classShared';

// ─── Ô soạn thông báo ───────────────────────────────────────────

function Composer({ cls, groups, onPosted }: { cls: ClassDetail; groups: Array<{ id: number; name: string }>; onPosted: () => void }) {
  const { t } = useWT();
  const [open, setOpen] = useState(false);
  const [doc, setDoc] = useState<TiptapDoc | null>(null);
  const [empty, setEmpty] = useState(true);
  const [files, setFiles] = useState<ClassFile[]>([]);
  const [links, setLinks] = useState<Array<{ url: string; title?: string }>>([]);
  const [audience, setAudience] = useState<number[]>([]);
  const [schedule, setSchedule] = useState('');
  const [pinned, setPinned] = useState(false);
  const [commentsOff, setCommentsOff] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const reset = () => { setDoc(null); setEmpty(true); setFiles([]); setLinks([]); setAudience([]); setSchedule(''); setPinned(false); setCommentsOff(false); setEditorKey((k) => k + 1); setOpen(false); };
  const post = useMutation({
    mutationFn: () => classroomApi.createPost(cls.id, {
      bodyJson: empty ? null : doc, links, fileIds: files.map((f) => f.id), audienceGroupIds: audience,
      publishAt: schedule ? new Date(schedule).toISOString() : null, pinned, commentsOff,
    }),
    onSuccess: (p) => { toast.success(p.scheduled ? t('c9a.scheduledOk') : t('c9a.postedOk')); reset(); onPosted(); },
    onError: (err) => toast.error(workError(err)),
  });
  const canPost = (!empty || files.length > 0 || links.length > 0) && !post.isPending;
  if (!open) {
    return (
      <button type="button" data-testid="c9a-composer-open" onClick={() => setOpen(true)}
        className="w-card flex w-full items-center gap-3 p-3 text-left text-[13.5px] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]">
        <Megaphone size={16} className="shrink-0 text-[var(--w-accent)]" aria-hidden="true" />{t('c9a.announcePh')}
      </button>
    );
  }
  const toggleGroup = (id: number) => setAudience((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  return (
    <section aria-label={t('c9a.newAnnouncement')} className="w-card space-y-3 p-3">
      <RichEditor key={editorKey} value={doc} onChange={(d, e) => { setDoc(d); setEmpty(e); }} placeholder={t('c9a.announcePh')} autoFocus minHeight={90}
        onSubmit={() => canPost && post.mutate()} />
      <AttachBar classId={cls.id} files={files} setFiles={setFiles} links={links} setLinks={setLinks} />
      <fieldset className="space-y-1.5">
        <legend className="mb-1 text-[12px] font-medium text-[var(--w-text-2)]">{t('c9a.audience')}</legend>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" aria-pressed={!audience.length} onClick={() => setAudience([])}
            className={cn('rounded-full border px-2.5 py-1 text-[12.5px]', !audience.length ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft,var(--w-hover))] font-medium' : 'border-[var(--w-border)] text-[var(--w-text-2)]')}>
            {t('c9a.allStudents')}
          </button>
          {groups.map((g) => (
            <button key={g.id} type="button" aria-pressed={audience.includes(g.id)} onClick={() => toggleGroup(g.id)}
              className={cn('rounded-full border px-2.5 py-1 text-[12.5px]', audience.includes(g.id) ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft,var(--w-hover))] font-medium' : 'border-[var(--w-border)] text-[var(--w-text-2)]')}>
              {g.name}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
        <label className="text-[12px] text-[var(--w-text-2)]">
          <span className="mb-1 block font-medium">{t('c9a.scheduleFor')}</span>
          <input type="datetime-local" className="w-input h-[30px] text-[13px]" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
        </label>
        <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" className="h-4 w-4 accent-[var(--w-accent)]" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />{t('c9a.pinToTop')}</label>
        <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" className="h-4 w-4 accent-[var(--w-accent)]" checked={commentsOff} onChange={(e) => setCommentsOff(e.target.checked)} />{t('c9a.turnOffComments')}</label>
      </div>
      <div className="flex flex-wrap justify-end gap-2 border-t border-[var(--w-border)] pt-3">
        <button type="button" className="w-btn" onClick={reset}>{t('c9a.cancel')}</button>
        <button type="button" data-testid="c9a-post" className="w-btn w-btn-primary" disabled={!canPost} onClick={() => post.mutate()}>
          {post.isPending && <Spinner size={13} />}{schedule ? t('c9a.schedule') : t('c9a.post')}
        </button>
      </div>
    </section>
  );
}

// ─── Bình luận ──────────────────────────────────────────────────

function CommentRow({ c, classId, manage, onChanged }: { c: StreamComment; classId: number; manage: boolean; onChanged: () => void }) {
  const { t, fmtRelative, fmtDateTime } = useWT();
  const hide = useMutation({ mutationFn: () => classroomApi.hideComment(classId, c.id, !c.hidden), onSuccess: onChanged, onError: (err) => toast.error(workError(err)) });
  const del = useMutation({ mutationFn: () => classroomApi.deleteComment(classId, c.id), onSuccess: onChanged, onError: (err) => toast.error(workError(err)) });
  return (
    <li className={cn('group flex gap-2.5 py-2', c.hidden && '-mx-2 rounded-[6px] border-l-2 border-[var(--w-border-strong)] bg-[var(--w-sunken)] px-2')}>
      <UserAvatar user={c.author} size={26} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 text-[12.5px]">
          <span className="font-medium">{userName(c.author)}</span>
          <time className="text-[var(--w-text-2)]" dateTime={c.createdAt} title={fmtDateTime(c.createdAt)}>{fmtRelative(c.createdAt)}</time>
          {c.hidden && <span className="rounded-[4px] bg-[var(--w-sunken)] px-1.5 text-[11px] text-[var(--w-text-2)]">{t('c9a.hiddenBadge')}</span>}
        </div>
        <p className="whitespace-pre-wrap break-words text-[13.5px]">{c.body}</p>
      </div>
      <div className="flex shrink-0 items-start gap-0.5 opacity-100 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
        {manage && (
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={hide.isPending} aria-label={c.hidden ? t('c9a.unhideComment') : t('c9a.hideComment')} title={c.hidden ? t('c9a.unhideComment') : t('c9a.hideComment')} onClick={() => hide.mutate()}>
            <EyeOff size={13} />
          </button>
        )}
        {c.canDelete && (
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={del.isPending} aria-label={t('c9a.deleteComment')} title={t('c9a.deleteComment')} onClick={() => del.mutate()}>
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </li>
  );
}

function Comments({ post, classId, manage, onChanged }: { post: StreamPost; classId: number; manage: boolean; onChanged: () => void }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [all, setAll] = useState(false);
  const [text, setText] = useState('');
  const full = useQuery({ queryKey: classroomKeys.post(classId, post.id), queryFn: () => classroomApi.post(classId, post.id), enabled: all });
  const refresh = () => { onChanged(); if (all) void qc.invalidateQueries({ queryKey: classroomKeys.post(classId, post.id) }); };
  const send = useMutation({
    mutationFn: () => classroomApi.comment(classId, post.id, text.trim()),
    onSuccess: () => { setText(''); refresh(); },
    onError: (err) => toast.error(workError(err)),
  });
  const list = all && full.data ? full.data.comments : post.comments;
  const count = all && full.data ? full.data.commentCount : post.commentCount;
  if (!post.publishedAt) return null;
  return (
    <div className="border-t border-[var(--w-border)] px-4 pb-3 pt-2">
      {count > 0 && (
        <div className="flex items-center gap-2 text-[12.5px] font-medium text-[var(--w-text-2)]">
          <Users size={13} aria-hidden="true" />{t('c9a.classComments', { count })}
          {count > post.comments.length && !all && <button type="button" className="text-[var(--w-accent-text,var(--w-accent))] hover:underline" onClick={() => setAll(true)}>{t('c9a.showAll')}</button>}
        </div>
      )}
      {list.length > 0 && <ul className="divide-y divide-[var(--w-border)]">{list.map((c) => <CommentRow key={c.id} c={c} classId={classId} manage={manage} onChanged={refresh} />)}</ul>}
      {post.canComment ? (
        <form className="mt-1.5 flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); if (text.trim()) send.mutate(); }}>
          <input className="w-input h-[32px] min-w-0 flex-1 text-[13px]" value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} placeholder={t('c9a.addCommentPh')} aria-label={t('c9a.addCommentPh')} />
          <button type="submit" className="w-btn w-btn-icon" disabled={!text.trim() || send.isPending} aria-label={t('c9a.send')}>{send.isPending ? <Spinner size={13} /> : <Send size={14} />}</button>
        </form>
      ) : (
        <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-[var(--w-text-2)]"><MessageSquareOff size={13} aria-hidden="true" />{t('c9a.commentsOff')}</p>
      )}
    </div>
  );
}

// ─── Một bài ────────────────────────────────────────────────────

const AUTO_ICON = { ASSIGNMENT: ClipboardList, QUIZ: ListChecks, MATERIAL: BookOpen } as const;

function AutoLine({ p }: { p: StreamPost }) {
  const { t, fmtDate, fmtDateTime } = useWT();
  const Icon = AUTO_ICON[p.kind as keyof typeof AUTO_ICON] ?? ClipboardList;
  const who = p.author ? userName(p.author) : t('c9a.yourLecturer');
  const label = p.kind === 'ASSIGNMENT' ? t('c9a.newAssignment', { name: who }) : p.kind === 'QUIZ' ? t('c9a.newQuiz', { name: who }) : t('c9a.newMaterial', { name: who });
  const body = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--w-sunken)] text-[var(--w-accent)]"><Icon size={16} aria-hidden="true" /></span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px]">{label}: <span className="font-medium">{p.title}</span></span>
        <span className="block text-[12px] text-[var(--w-text-2)]">{p.scheduled ? t('c9a.scheduledFor', { date: fmtDateTime(p.publishAt) }) : fmtDate(p.publishedAt ?? p.publishAt)}{p.editedAt ? ` · ${t('c9a.edited')}` : ''}</span>
      </span>
    </>
  );
  return p.url
    ? <Link href={p.url} className="w-card flex items-center gap-3 p-3 hover:bg-[var(--w-hover)]">{body}</Link>
    : <div className="w-card flex items-center gap-3 p-3">{body}</div>;
}

function PostCard({ p, cls, manage, groups, onChanged }: { p: StreamPost; cls: ClassDetail; manage: boolean; groups: Array<{ id: number; name: string }>; onChanged: () => void }) {
  const { t, fmtRelative, fmtDateTime } = useWT();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<TiptapDoc | null>(p.bodyJson);
  const [confirmDel, setConfirmDel] = useState(false);
  const upd = useMutation({ mutationFn: (b: Parameters<typeof classroomApi.updatePost>[2]) => classroomApi.updatePost(cls.id, p.id, b), onSuccess: () => { setEditing(false); onChanged(); }, onError: (err) => toast.error(workError(err)) });
  const del = useMutation({ mutationFn: () => classroomApi.deletePost(cls.id, p.id), onSuccess: () => { setConfirmDel(false); toast.success(t('c9a.deleted')); onChanged(); }, onError: (err) => toast.error(workError(err)) });
  if (p.kind !== 'ANNOUNCEMENT') return <li><AutoLine p={p} /></li>;
  const audienceNames = (p.audienceGroupIds ?? []).map((id) => groups.find((g) => g.id === id)?.name).filter(Boolean) as string[];
  return (
    <li>
      <article className={cn('w-card overflow-hidden', p.scheduled && 'border-dashed')} aria-label={t('c9a.announcementBy', { name: p.author ? userName(p.author) : '' })}>
        <header className="flex items-start gap-3 px-4 pt-3">
          <UserAvatar user={p.author} size={32} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13.5px] font-semibold">{p.author ? userName(p.author) : t('c9a.yourLecturer')}</div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-[var(--w-text-2)]">
              {p.scheduled
                ? <span className="inline-flex items-center gap-1 text-[var(--w-yellow-text,var(--w-text-2))]"><CalendarClock size={12} aria-hidden="true" />{t('c9a.scheduledFor', { date: fmtDateTime(p.publishAt) })}</span>
                : <time dateTime={p.publishedAt ?? p.publishAt} title={fmtDateTime(p.publishedAt ?? p.publishAt)}>{fmtRelative(p.publishedAt ?? p.publishAt)}</time>}
              {p.editedAt && <span>· {t('c9a.edited')}</span>}
              {p.pinned && <span className="inline-flex items-center gap-1 rounded-[4px] bg-[var(--w-sunken)] px-1.5 font-medium text-[var(--w-text)]"><Pin size={11} aria-hidden="true" />{t('c9a.pinned')}</span>}
              {manage && audienceNames.length > 0 && <span className="inline-flex items-center gap-1 rounded-[4px] bg-[var(--w-sunken)] px-1.5"><Users size={11} aria-hidden="true" />{audienceNames.join(', ')}</span>}
              {!manage && p.forGroup && <span className="inline-flex items-center gap-1 rounded-[4px] bg-[var(--w-sunken)] px-1.5"><Users size={11} aria-hidden="true" />{t('c9a.forYourGroup')}</span>}
            </div>
          </div>
          {manage && (
            <div className="flex shrink-0 items-center gap-0.5">
              <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={p.pinned ? t('c9a.unpin') : t('c9a.pin')} title={p.pinned ? t('c9a.unpin') : t('c9a.pin')} onClick={() => upd.mutate({ pinned: !p.pinned })}>{p.pinned ? <PinOff size={14} /> : <Pin size={14} />}</button>
              <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={p.commentsOff ? t('c9a.turnOnComments') : t('c9a.turnOffComments')} title={p.commentsOff ? t('c9a.turnOnComments') : t('c9a.turnOffComments')} onClick={() => upd.mutate({ commentsOff: !p.commentsOff })}><MessageSquareOff size={14} /></button>
              <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c9a.edit')} title={t('c9a.edit')} onClick={() => { setDraft(p.bodyJson); setEditing(true); }}><Pencil size={14} /></button>
              <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c9a.delete')} title={t('c9a.delete')} onClick={() => setConfirmDel(true)}><Trash2 size={14} /></button>
            </div>
          )}
        </header>
        <div className="space-y-3 px-4 pb-3 pt-2">
          {editing ? (
            <div className="space-y-2">
              <RichEditor value={draft} onChange={(d) => setDraft(d)} autoFocus minHeight={80} onSubmit={() => upd.mutate({ bodyJson: draft })} onEscape={() => setEditing(false)} />
              <div className="flex justify-end gap-2">
                <button type="button" className="w-btn w-btn-sm" onClick={() => setEditing(false)}>{t('c9a.cancel')}</button>
                <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={upd.isPending || isDocEmpty(draft)} onClick={() => upd.mutate({ bodyJson: draft })}>{upd.isPending && <Spinner size={12} />}{t('c9a.save')}</button>
              </div>
            </div>
          ) : (p.bodyJson && !isDocEmpty(p.bodyJson) && <RichView value={p.bodyJson} className="text-[14px]" />)}
          <LinkCards links={p.links} />
          <FileChips classId={cls.id} files={p.files} />
        </div>
        <Comments post={p} classId={cls.id} manage={manage} onChanged={onChanged} />
      </article>
      <ConfirmDialog open={confirmDel} onClose={() => setConfirmDel(false)} title={t('c9a.deletePost')} body={t('c9a.deletePostBody')} confirmLabel={t('c9a.delete')} onConfirm={() => del.mutate()} pending={del.isPending} />
    </li>
  );
}

// ─── Cột bên ────────────────────────────────────────────────────

function SidePanel({ cls, manage, page, goTab }: { cls: ClassDetail; manage: boolean; page: StreamPage | undefined } & Pick<ClassSlotProps, 'goTab'>) {
  const { t, fmtDate } = useWT();
  const qc = useQueryClient();
  const cal = useQuery({ queryKey: classroomKeys.calendar(cls.id), queryFn: () => classroomApi.calendar(cls.id), staleTime: 60_000 });
  const toggle = useMutation({
    mutationFn: (v: boolean) => classroomApi.updateSettings(cls.id, { streamComments: v }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: classroomKeys.stream(cls.id) }); },
    onError: (err) => toast.error(workError(err)),
  });
  const upcoming = useMemo(() => {
    const now = Date.now();
    const week = now + 7 * 86_400_000;
    const items = [
      ...(cal.data?.sessions ?? []).filter((s) => s.status !== 'CANCELLED').map((s) => ({ key: `s${s.id}`, title: s.title, at: s.startsAt, due: false, href: null as string | null })),
      ...(cal.data?.items ?? []).map((i) => ({ key: `i${i.refType}${i.refId}`, title: i.title, at: i.startsAt, due: true, href: i.url })),
    ].filter((x) => { const at = new Date(x.at).getTime(); return at >= now && at <= week; });
    return items.sort((a, b) => a.at.localeCompare(b.at)).slice(0, 5);
  }, [cal.data]);
  const openSession = cal.data?.sessions.find((s) => s.checkinOpen && (manage || !s.myStatus));
  return (
    <aside className="space-y-3" aria-label={t('c9a.sidePanel')}>
      {openSession && (
        <div className="w-card border-[var(--w-accent)] p-3" role="status">
          <div className="flex items-center gap-2 text-[13px] font-semibold"><QrCode size={15} className="text-[var(--w-accent)]" aria-hidden="true" />{t('c9a.checkinOpenTitle')}</div>
          <p className="mt-0.5 text-[12.5px] text-[var(--w-text-2)]">{openSession.title}</p>
          <button type="button" data-testid="c9a-go-checkin" className="w-btn w-btn-sm w-btn-primary mt-2" onClick={() => goTab('calendar')}>{manage ? t('c9a.showCode') : t('c9a.checkInNow')}</button>
        </div>
      )}
      {manage && cls.joinCodeDisplay && (
        <div className="w-card p-3">
          <div className="text-[12px] font-medium text-[var(--w-text-2)]">{t('classroom.code')}</div>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <span className="font-mono text-[18px] font-semibold tracking-[0.1em]">{cls.joinCodeDisplay}</span>
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('classroom.copyCode')} onClick={() => { void navigator.clipboard.writeText(cls.joinCodeDisplay ?? '').then(() => toast.success(t('classroom.copied'))).catch(() => undefined); }}><Copy size={13} /></button>
          </div>
        </div>
      )}
      <div className="w-card p-3">
        <div className="mb-1.5 flex items-center justify-between">
          <h3 className="text-[13px] font-semibold">{t('c9a.upcoming')}</h3>
          <button type="button" className="text-[12px] text-[var(--w-accent-text,var(--w-accent))] hover:underline" onClick={() => goTab('calendar')}>{t('c9a.viewCalendar')}</button>
        </div>
        {cal.isLoading ? <Spinner size={14} /> : !upcoming.length ? <p className="text-[12.5px] text-[var(--w-text-2)]">{t('c9a.nothingDue')}</p> : (
          <ul className="space-y-1.5">
            {upcoming.map((u) => (
              <li key={u.key} className="text-[12.5px]">
                <div className="text-[11.5px] text-[var(--w-text-2)]">{u.due ? t('c9a.dueOn', { date: fmtDate(u.at, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }) : fmtDate(u.at, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                {u.href ? <Link href={u.href} className="line-clamp-2 font-medium hover:underline">{u.title}</Link> : <div className="line-clamp-2 font-medium">{u.title}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
      {manage && page && (
        <div className="w-card flex items-center justify-between gap-3 p-3">
          <span className="text-[12.5px]">{t('c9a.studentsCanComment')}</span>
          <Switch checked={page.settings.streamComments} disabled={toggle.isPending} onChange={(v) => toggle.mutate(v)} label={t('c9a.studentsCanComment')} />
        </div>
      )}
    </aside>
  );
}

// ─── Tab ────────────────────────────────────────────────────────

export default function StreamTab({ cls, goTab }: ClassSlotProps) {
  const { t } = useWT();
  const qc = useQueryClient();
  const q = useInfiniteQuery({
    queryKey: classroomKeys.stream(cls.id),
    queryFn: ({ pageParam }) => classroomApi.stream(cls.id, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextBefore,
    refetchInterval: 60_000,
  });
  const refresh = () => { void qc.invalidateQueries({ queryKey: classroomKeys.stream(cls.id) }); void qc.invalidateQueries({ queryKey: teachingKeys.cls(cls.id) }); };
  const first = q.data?.pages[0];
  const posts = useMemo(() => {
    const seen = new Set<number>();
    return (q.data?.pages ?? []).flatMap((p) => p.posts).filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
  }, [q.data]);
  const manage = first?.manage ?? cls.manage;
  const groups = first?.groups ?? [];
  return (
    <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
      <div className="order-2 lg:order-1"><SidePanel cls={cls} manage={manage} page={first} goTab={goTab} /></div>
      <div className="order-1 min-w-0 space-y-3 lg:order-2">
        {manage && <Composer cls={cls} groups={groups} onPosted={refresh} />}
        {q.isLoading && <PageLoading rows={3} />}
        {q.error && <EmptyState title={workError(q.error)} />}
        {first && !posts.length && (
          <EmptyState icon={<Megaphone size={20} />} title={t('c9a.streamEmpty')} body={manage ? t('c9a.streamEmptyTeacher') : t('c9a.streamEmptyStudent')} />
        )}
        {posts.length > 0 && (
          <ul className="space-y-3" aria-label={t('c9a.tab_stream')}>
            {posts.map((p) => <PostCard key={p.id} p={p} cls={cls} manage={manage} groups={groups} onChanged={refresh} />)}
          </ul>
        )}
        {q.hasNextPage && (
          <div className="flex justify-center">
            <button type="button" className="w-btn w-btn-sm" disabled={q.isFetchingNextPage} onClick={() => void q.fetchNextPage()}>{q.isFetchingNextPage && <Spinner size={12} />}{t('c9a.olderPosts')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
