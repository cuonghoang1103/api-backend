'use client';

/**
 * Một tin trong kênh chat: avatar + tên + giờ (gộp với tin trên khi cùng người < 5 phút), thân markdown, tệp (ảnh xem
 * trước, PDF xem trong trang — app desktop mở bằng trình xem của máy vì CSP chặn iframe —, voice note có phiên âm),
 * thẻ xem trước liên kết nội bộ (đã lọc quyền ở server), link ngoài (tên miền + tiêu đề có sẵn), cảm xúc, số trả lời,
 * và thanh hành động: cảm xúc · trả lời · sửa · ghim · tạo thẻ · chuyển tiếp · chép link · xoá.
 */

import { memo, useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Bug, CalendarClock, Copy, Download, Eye, FileText, FlaskConical, Forward, Image as ImageIcon, MessageSquareReply, MoreHorizontal,
  Pause, Pencil, Phone, Pin, PinOff, Play, RotateCcw, SmilePlus, SquarePlus, Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError } from '@/lib/work-api';
import { chatApi, QUICK_REACTIONS, type ChatFile, type ChatMessage, type RefPreview } from '@/lib/work-chat-api';
import EmojiPickerPopover from '../../messaging/EmojiPickerPopover';
import { dongHo } from '../../messaging/useGhiAm';
import { Dialog, formatBytes, Popover, Spinner, StatusGlyph, UserAvatar } from '../ui';
import { ChatMarkdown } from './ChatMarkdown';
import { wt, wfmt } from '@/components/work/i18n';

const isImage = (m: string) => /^image\/(png|jpe?g|gif|webp|avif|bmp)$/i.test(m);
const isPdf = (m: string, n: string) => m === 'application/pdf' || /\.pdf$/i.test(n);
const inDesktopApp = () => typeof navigator !== 'undefined' && /Electron/i.test(navigator.userAgent);
const timeOf = (iso: string) => new Date(iso).toLocaleTimeString(wfmt.intl(), { hour: '2-digit', minute: '2-digit' });
/** Tin hệ thống: máy chủ ghi câu tiếng Anh + meta.type ⇒ dịch theo loại ở đây. */
const systemText = (m: ChatMessage) => (m.meta?.type === 'call' ? wt('chat.sysCall') : m.meta?.type === 'issue' && m.meta.key ? wt('chat.sysIssue', { key: m.meta.key, title: m.meta.title ?? '' }) : m.meta?.type === 'created' ? m.body.replace(/^created /, `${wt('chat.sysCreated')} `) : m.body);

// ─── Tệp ─────────────────────────────────────────────────────────

function VoicePlayer({ pid, file }: { pid: number; file: ChatFile }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const v = file.voice!;
  const total = v.durationMs / 1000;
  const toggle = async () => {
    const a = audio.current;
    if (!a) return;
    if (!a.paused) { a.pause(); return; }
    try {
      if (!src) {
        setBusy(true);
        const url = await chatApi.fileUrl(pid, file.id, true);
        setSrc(url);
        a.src = url;
      }
      await a.play();
    } catch (err) {
      if ((err as Error)?.name !== 'NotAllowedError') toast.error(workError(err, wt('chat.playFailed')));
    } finally {
      setBusy(false);
    }
  };
  const retry = async () => {
    try { await chatApi.retryTranscription(pid, file.id); } catch (err) { toast.error(workError(err, wt('chat.transcribeFailed'))); }
  };
  const note = v.transcriptStatus === 'PENDING' ? wt('chat.trPending') : v.transcriptStatus === 'NO_SPEECH' ? wt('chat.trNoSpeech')
    : v.transcriptStatus === 'NO_KEY' ? wt('chat.trNoKey')
      : v.transcriptStatus === 'LIMIT' ? wt('chat.trLimit') : v.transcriptStatus === 'FAILED' ? wt('chat.trFailed') : '';
  return (
    <div className="w-voice-note max-w-[420px]" data-testid="chat-voice">
      <div className="flex items-center gap-2.5">
        <button type="button" className="w-btn w-btn-icon w-btn-sm w-voice-play" aria-label={playing ? wt('chat.pauseVoice') : wt('chat.playVoice')} onClick={() => void toggle()} disabled={busy}>
          {busy ? <Spinner size={12} /> : playing ? <Pause size={13} /> : <Play size={13} />}
        </button>
        <input
          type="range" min={0} max={Math.max(total, 0.1)} step={0.1} value={Math.min(pos, total)} className="w-voice-seek min-w-0 flex-1"
          aria-label={wt('chat.seekVoice')} aria-valuetext={wt('chat.posOf', { a: dongHo(pos), b: dongHo(total) })}
          onChange={(e) => { const s = Number(e.target.value); setPos(s); if (audio.current && src) audio.current.currentTime = s; }}
        />
        <span className="shrink-0 font-mono text-[11.5px] tabular-nums text-[var(--w-text-2)]">{dongHo(pos)} / {dongHo(Math.round(total))}</span>
        <audio ref={audio} preload="none" className="hidden" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setPos(0); }} onTimeUpdate={(e) => setPos(e.currentTarget.currentTime)} />
      </div>
      {v.transcriptStatus === 'DONE' && v.transcript ? (
        <p className="mt-1.5 whitespace-pre-wrap text-[12.5px] leading-relaxed text-[var(--w-text-2)]"><span className="sr-only">{wt('chat.transcript')} </span>{v.transcript}</p>
      ) : note ? (
        <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px] text-[var(--w-text-3)]">
          {v.transcriptStatus === 'PENDING' && <Spinner size={11} />}<span>{note}</span>
          {(v.transcriptStatus === 'FAILED' || v.transcriptStatus === 'NO_KEY' || v.transcriptStatus === 'LIMIT') && (
            <button type="button" className="w-btn w-btn-ghost w-btn-sm h-6 px-1.5 text-[12px]" onClick={() => void retry()}><RotateCcw size={11} /> {wt('chat.retry')}</button>
          )}
        </p>
      ) : null}
    </div>
  );
}

function Thumb({ pid, file, onOpen }: { pid: number; file: ChatFile; onOpen: (url: string) => void }) {
  const q = useQuery({ queryKey: ['work', 'chat-file', pid, file.id, 'inline'], queryFn: () => chatApi.fileUrl(pid, file.id, true), staleTime: 300_000 });
  return (
    <button type="button" className="w-comment-thumb !h-auto !max-h-[220px] !w-auto !max-w-[min(320px,100%)]" aria-label={wt('chat.previewImage', { name: file.fileName })} disabled={!q.data} onClick={() => q.data && onOpen(q.data)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {q.data ? <img src={q.data} alt={file.fileName} loading="lazy" className="max-h-[220px] max-w-full rounded-[6px] object-contain" /> : <ImageIcon size={18} aria-hidden="true" />}
    </button>
  );
}

export function ChatFiles({ pid, files }: { pid: number; files: ChatFile[] }) {
  const [preview, setPreview] = useState<{ kind: 'image' | 'pdf'; url: string; name: string } | null>(null);
  if (!files.length) return null;
  const voices = files.filter((f) => f.voice);
  const images = files.filter((f) => !f.voice && isImage(f.mime));
  const others = files.filter((f) => !f.voice && !isImage(f.mime));
  const download = async (f: ChatFile) => {
    try { window.open(await chatApi.fileUrl(pid, f.id), '_blank', 'noopener'); } catch (err) { toast.error(workError(err, wt('chat.downloadFailed'))); }
  };
  const openPdf = async (f: ChatFile) => {
    try {
      const url = await chatApi.fileUrl(pid, f.id, true);
      if (inDesktopApp()) window.open(url, '_blank', 'noopener');
      else setPreview({ kind: 'pdf', url, name: f.fileName });
    } catch (err) { toast.error(workError(err, wt('chat.openPdfFailed'))); }
  };
  return (
    <div className="mt-1.5 space-y-2" data-testid="chat-files">
      {voices.map((f) => <VoicePlayer key={f.id} pid={pid} file={f} />)}
      {images.length > 0 && <div className="flex flex-wrap gap-2">{images.map((f) => <Thumb key={f.id} pid={pid} file={f} onOpen={(url) => setPreview({ kind: 'image', url, name: f.fileName })} />)}</div>}
      {others.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label={wt('chat.files')}>
          {others.map((f) => (
            <li key={f.id} className="w-file-chip">
              <FileText size={13} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
              <span className="min-w-0 truncate" title={f.fileName}>{f.fileName}</span>
              <span className="shrink-0 text-[11px] text-[var(--w-text-3)]">{formatBytes(f.size)}</span>
              {isPdf(f.mime, f.fileName) && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm h-6 w-6" aria-label={wt('chat.previewX', { name: f.fileName })} onClick={() => void openPdf(f)}><Eye size={12} /></button>}
              <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm h-6 w-6" aria-label={wt('chat.downloadX', { name: f.fileName })} onClick={() => void download(f)}><Download size={12} /></button>
            </li>
          ))}
        </ul>
      )}
      <Dialog open={!!preview} onClose={() => setPreview(null)} width={preview?.kind === 'pdf' ? 960 : 880} title={<span className="block max-w-[60vw] truncate">{preview?.name}</span>}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {preview?.kind === 'image' && <img src={preview.url} alt={preview.name} className="mx-auto max-h-[70vh] max-w-full rounded-[6px]" />}
        {preview?.kind === 'pdf' && <iframe src={preview.url} title={wt('chat.pdfPreview', { name: preview.name })} className="h-[72vh] w-full rounded-[6px] border border-[var(--w-border)]" />}
      </Dialog>
    </div>
  );
}

// ─── Thẻ xem trước ───────────────────────────────────────────────

const PREVIEW_ICON = { issue: Bug, test: FlaskConical, doc: FileText, meeting: CalendarClock } as const;

export function PreviewCard({ p }: { p: RefPreview }) {
  const Icon = PREVIEW_ICON[p.t];
  return (
    <Link
      href={p.url}
      className="flex max-w-[460px] items-start gap-2.5 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2 transition-colors hover:border-[var(--w-border-strong)] hover:bg-[var(--w-hover)]"
      data-testid="chat-preview"
    >
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--w-sunken)]" style={p.type?.color ? { color: p.type.color } : undefined}>
        <Icon size={14} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-[11.5px] text-[var(--w-text-3)]">
          <span className="font-mono">{p.key}</span>
          {p.type?.name && <span>· {p.type.name}</span>}
          {p.when && <span>· {new Date(p.when).toLocaleString(wfmt.intl(), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
        </span>
        <span className="block truncate text-[13.5px] font-medium text-[var(--w-text)]">{p.title}</span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--w-text-2)]">
          {p.status && (
            <span className="inline-flex items-center gap-1"><StatusGlyph category={(['TODO', 'IN_PROGRESS', 'DONE'].includes(p.status.category) ? p.status.category : 'TODO') as 'TODO'} size={11} />{p.status.name}</span>
          )}
          {p.assignee !== undefined && (
            <span className="inline-flex items-center gap-1">
              {p.assignee ? <><UserAvatar user={{ username: p.assignee.name, displayName: p.assignee.name, fullName: null, avatarUrl: p.assignee.avatarUrl }} size={14} />{p.assignee.name}</> : wt('common.unassigned')}
            </span>
          )}
        </span>
      </span>
    </Link>
  );
}

// ─── Một tin ─────────────────────────────────────────────────────

export interface MessageActions {
  onReact: (m: ChatMessage, emoji: string, active: boolean) => void;
  onReply?: (m: ChatMessage) => void;
  onEdit: (m: ChatMessage) => void;
  onDelete: (m: ChatMessage) => void;
  onPin: (m: ChatMessage, pinned: boolean) => void;
  onCreateIssue: (m: ChatMessage) => void;
  onForward: (m: ChatMessage) => void;
  onCopyLink: (m: ChatMessage) => void;
  onRetry?: (m: ChatMessage) => void;
  onDiscard?: (m: ChatMessage) => void;
}

function ReactBar({ m, meId, onReact, canReact }: { m: ChatMessage; meId?: number; onReact: MessageActions['onReact']; canReact: boolean }) {
  if (!m.reactions.length) return null;
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1" aria-label={wt('chat.reactions')}>
      {m.reactions.map((r) => {
        const names = r.users.map((u) => (u.id === meId ? wt('ai.you') : u.name));
        const label = wt('chat.reactedLabel', { names: names.slice(0, 3).join(', '), more: r.count > 3 ? wt('chat.andOthers', { n: r.count - 3 }) : '', emoji: r.emoji });
        return (
          <button
            key={r.emoji} type="button" title={label} aria-label={`${label}. ${r.mine ? 'Remove your reaction' : 'Add your reaction'}`} aria-pressed={r.mine} disabled={!canReact}
            onClick={() => onReact(m, r.emoji, !r.mine)}
            className={cn('inline-flex h-6 items-center gap-1 rounded-full border px-2 text-[12px] leading-none',
              r.mine ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] bg-[var(--w-sunken)] text-[var(--w-text-2)] hover:border-[var(--w-border-strong)]')}
          >
            <span aria-hidden className="text-[14px]">{r.emoji}</span><span className="font-medium tabular-nums">{r.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function MessageItemImpl({
  m, pid, meId, meUsername, known, continuation, canPost, canModerate, canPin, inThread, highlight, actions,
}: {
  m: ChatMessage; pid: number; meId?: number; meUsername?: string; known: Set<string>; continuation: boolean;
  canPost: boolean; canModerate: boolean; canPin: boolean; inThread?: boolean; highlight?: boolean; actions: MessageActions;
}) {
  const [more, setMore] = useState(false);
  const [quick, setQuick] = useState(false);
  const [picker, setPicker] = useState(false);
  const [touched, setTouched] = useState(false);
  const moreRef = useRef<HTMLButtonElement>(null);
  const reactRef = useRef<HTMLButtonElement>(null);
  const mine = !!meId && m.author?.id === meId;
  const closeMore = useCallback(() => setMore(false), []);
  const closeQuick = useCallback(() => setQuick(false), []);

  if (m.kind === 'SYSTEM') {
    const call = m.meta?.type === 'call' && m.meta.url;
    return (
      <div id={`msg-${m.id}`} className={cn('flex items-center gap-2 px-4 py-1 text-[12.5px] text-[var(--w-text-2)] sm:px-5', highlight && 'w-chat-flash')} data-msg-id={m.id}>
        {call ? <Phone size={13} className="shrink-0 text-[var(--w-green-text)]" aria-hidden="true" /> : <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--w-text-3)]" aria-hidden="true" />}
        <span className="min-w-0"><b className="font-medium text-[var(--w-text)]">{m.author ? userName(m.author) : wt('chat.someone')}</b> {systemText(m)}</span>
        {call && <a href={m.meta!.url} target="_blank" rel="noopener noreferrer" className="w-btn w-btn-sm h-6 shrink-0 px-2 text-[12px]">{wt('chat.joinCall')}</a>}
        {m.meta?.type === 'issue' && m.meta.url && <Link href={m.meta.url} className="shrink-0 text-[var(--w-accent-text)] hover:underline">{wt('chat.openKey', { key: m.meta.key ?? '' })}</Link>}
        <span className="ml-auto shrink-0 text-[11px] text-[var(--w-text-3)]">{timeOf(m.createdAt)}</span>
      </div>
    );
  }

  const deleted = m.deleted;
  const showBar = !deleted && !m.local;
  return (
    <div
      id={`msg-${m.id}`}
      data-msg-id={m.id}
      className={cn(
        'group relative flex gap-2.5 px-4 sm:px-5', continuation ? 'py-0.5' : 'pt-2 pb-0.5',
        'hover:bg-[color-mix(in_srgb,var(--w-hover)_70%,transparent)] focus-within:bg-[color-mix(in_srgb,var(--w-hover)_70%,transparent)]',
        highlight && 'w-chat-flash', m.mentions.includes(meId ?? -1) && !deleted && 'border-l-2 border-[var(--w-yellow)] bg-[color-mix(in_srgb,var(--w-yellow)_8%,transparent)]',
        m.pinned && 'bg-[color-mix(in_srgb,var(--w-accent)_5%,transparent)]',
      )}
      onClick={(e) => { if (!(e.target as HTMLElement).closest('a,button,input,audio')) setTouched((t) => !t); }}
    >
      <div className="w-8 shrink-0 pt-0.5">
        {!continuation ? <UserAvatar user={m.author} size={32} /> : <span className="block pt-1 text-right text-[10.5px] tabular-nums text-[var(--w-text-3)] opacity-0 group-hover:opacity-100">{timeOf(m.createdAt)}</span>}
      </div>
      <div className="min-w-0 flex-1">
        {!continuation && (
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-[13.5px] font-semibold text-[var(--w-text)]">{m.author ? userName(m.author) : wt('chat.formerMember')}</span>
            <time className="text-[11.5px] text-[var(--w-text-3)]" dateTime={m.createdAt} title={new Date(m.createdAt).toLocaleString('en-GB')}>{timeOf(m.createdAt)}</time>
            {m.pinned && <span className="inline-flex items-center gap-1 text-[11px] text-[var(--w-accent-text)]"><Pin size={10} aria-hidden="true" />{wt('chat.pinnedTag')}</span>}
          </div>
        )}
        {m.meta?.type === 'forward' && m.meta.from && (
          <div className="mt-0.5 flex items-center gap-1 text-[11.5px] text-[var(--w-text-3)]"><Forward size={11} aria-hidden="true" />{wt('chat.forwardedFrom', { ch: m.meta.from.channel })}{m.meta.from.author ? ` · ${m.meta.from.author}` : ''}</div>
        )}
        {deleted ? (
          <p className="text-[13px] italic text-[var(--w-text-3)]">{wt('chat.deletedMsg')}</p>
        ) : (
          <>
            {m.body && <ChatMarkdown text={m.body} known={known} meUsername={meUsername} />}
            {m.editedAt && <span className="text-[11px] text-[var(--w-text-3)]" title={wt('chat.editedTip', { t: new Date(m.editedAt).toLocaleString(wfmt.intl()) })}>{wt('chat.edited')}</span>}
            <ChatFiles pid={pid} files={m.files} />
            {m.previews.length > 0 && <div className="mt-1.5 flex flex-col gap-1.5">{m.previews.map((p) => <PreviewCard key={`${p.t}:${p.url}`} p={p} />)}</div>}
            {m.links.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {m.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex max-w-[360px] items-center gap-1.5 rounded-[6px] border border-[var(--w-border)] px-2 py-1 text-[12px] hover:bg-[var(--w-hover)]">
                    <span className="font-medium text-[var(--w-text-2)]">{l.domain}</span>
                    {l.title && <span className="truncate text-[var(--w-text)]">{l.title}</span>}
                  </a>
                ))}
              </div>
            )}
            <ReactBar m={m} meId={meId} onReact={actions.onReact} canReact={canPost} />
          </>
        )}
        {m.local && (
          <div className="mt-0.5 flex items-center gap-2 text-[11.5px]" aria-live="polite">
            {m.local === 'sending' ? <span className="inline-flex items-center gap-1 text-[var(--w-text-3)]"><Spinner size={10} />{wt('chat.sending')}</span> : (
              <>
                <span className="text-[var(--w-red-text)]">{wt('chat.notSent')}</span>
                {actions.onRetry && <button type="button" className="text-[var(--w-accent-text)] hover:underline" onClick={() => actions.onRetry!(m)}>{wt('chat.retry')}</button>}
                {actions.onDiscard && <button type="button" className="text-[var(--w-text-2)] hover:underline" onClick={() => actions.onDiscard!(m)}>{wt('common.discard')}</button>}
              </>
            )}
          </div>
        )}
        {!inThread && m.replyCount > 0 && actions.onReply && (
          <button type="button" className="mt-1 inline-flex items-center gap-1.5 rounded-[6px] px-1 py-0.5 text-[12.5px] font-medium text-[var(--w-accent-text)] hover:bg-[var(--w-hover)]" onClick={() => actions.onReply!(m)}>
            <MessageSquareReply size={13} aria-hidden="true" />{wt('chat.nReplies', { count: m.replyCount })}
            {m.lastReplyAt && <span className="font-normal text-[var(--w-text-3)]">{wt('chat.lastAt', { t: timeOf(m.lastReplyAt) })}</span>}
          </button>
        )}
      </div>

      {showBar && (
        <div
          className={cn(
            'absolute -top-3 right-3 z-[5] flex items-center gap-0.5 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-raised)] p-0.5 shadow-sm',
            more || quick || picker || touched ? 'flex' : 'hidden group-hover:flex group-focus-within:flex',
          )}
          role="toolbar" aria-label={wt('chat.msgActions')}
        >
          {canPost && (
            <button ref={reactRef} type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('chat.addReaction')} title={wt('chat.addReaction')} aria-expanded={quick} onClick={() => setQuick((o) => !o)}>
              <SmilePlus size={14} />
            </button>
          )}
          {!inThread && actions.onReply && canPost && (
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('chat.replyThread')} title={wt('chat.replyThread')} onClick={() => actions.onReply!(m)}><MessageSquareReply size={14} /></button>
          )}
          {mine && canPost && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('chat.editMessage')} title={wt('common.edit')} onClick={() => actions.onEdit(m)}><Pencil size={13} /></button>}
          <button ref={moreRef} type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('common.moreActions')} title={wt('common.more')} aria-haspopup="menu" aria-expanded={more} onClick={() => setMore((o) => !o)}>
            <MoreHorizontal size={14} />
          </button>
        </div>
      )}
      <Popover open={quick} onClose={closeQuick} anchorRef={reactRef} width={300} align="end">
        <div role="toolbar" aria-label={wt('chat.pickReaction')} className="flex items-center gap-0.5 p-1.5">
          {QUICK_REACTIONS.map((e) => {
            const on = m.reactions.some((r) => r.emoji === e && r.mine);
            return (
              <button key={e} type="button" aria-label={wt('chat.reactWith', { e })} aria-pressed={on} className={cn('flex h-8 w-8 items-center justify-center rounded-[6px] text-[18px] hover:bg-[var(--w-hover)]', on && 'bg-[var(--w-accent-soft)]')}
                onClick={() => { actions.onReact(m, e, !on); setQuick(false); }}>
                <span aria-hidden>{e}</span>
              </button>
            );
          })}
          <button type="button" aria-label={wt('chat.moreEmoji')} className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]" onClick={() => { setQuick(false); setPicker(true); }}>
            <SmilePlus size={15} />
          </button>
        </div>
      </Popover>
      <EmojiPickerPopover open={picker} onClose={() => setPicker(false)} anchorRef={reactRef} onPick={(e) => { actions.onReact(m, e, true); setPicker(false); }} />
      <Popover open={more} onClose={closeMore} anchorRef={moreRef} width={210} align="end">
        <div role="menu" aria-label={wt('chat.msgActions')} className="p-1">
          {[
            !inThread && actions.onReply && canPost ? { k: 'reply', icon: MessageSquareReply, label: wt('chat.replyThread'), run: () => actions.onReply!(m) } : null,
            canPin ? { k: 'pin', icon: m.pinned ? PinOff : Pin, label: m.pinned ? wt('chat.unpin') : wt('chat.pinToChannel'), run: () => actions.onPin(m, !m.pinned) } : null,
            canPost ? { k: 'issue', icon: SquarePlus, label: wt('chat.createIssue'), run: () => actions.onCreateIssue(m) } : null,
            canPost ? { k: 'fwd', icon: Forward, label: wt('chat.forwardDots'), run: () => actions.onForward(m) } : null,
            { k: 'link', icon: Copy, label: wt('common.copyLink'), run: () => actions.onCopyLink(m) },
            mine && canPost ? { k: 'edit', icon: Pencil, label: wt('common.edit'), run: () => actions.onEdit(m) } : null,
            mine || canModerate ? { k: 'del', icon: Trash2, label: mine ? wt('common.delete') : wt('chat.removeMsg'), run: () => actions.onDelete(m), danger: true } : null,
          ].filter(Boolean).map((it) => {
            const x = it as { k: string; icon: typeof Pin; label: string; run: () => void; danger?: boolean };
            return (
              <button key={x.k} type="button" role="menuitem" className={cn('flex h-8 w-full items-center gap-2 rounded-[6px] px-2 text-left text-[13px] hover:bg-[var(--w-hover)]', x.danger && 'text-[var(--w-red-text)]')}
                onClick={() => { setMore(false); x.run(); }}>
                <x.icon size={14} aria-hidden="true" />{x.label}
              </button>
            );
          })}
        </div>
      </Popover>
    </div>
  );
}

export const MessageItem = memo(MessageItemImpl);
