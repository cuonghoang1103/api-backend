'use client';

/** CTW đợt 9b — mảnh dùng chung của Bài tập / Sổ điểm: chip trạng thái, danh sách tệp, nút tải tệp, luồng nhận xét riêng. */

import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Download, ExternalLink, FileText, Lock, Paperclip, Send, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Spinner, UserAvatar, formatBytes } from '@/components/work/ui';
import { useWT, type WKey } from '@/components/work/i18n';
import { classworkApi, type ClassFile, type PrivateComment, type SubmissionLink, type WorkState } from '../classworkApi';

const STATE_TONE: Record<string, string> = {
  RETURNED: 'bg-[var(--w-sunken)] text-[var(--w-green-text)]',
  TURNED_IN: 'bg-[var(--w-sunken)] text-[var(--w-blue-text)]',
  GRADED: 'bg-[var(--w-sunken)] text-[var(--w-blue-text)]',
  LATE: 'bg-[var(--w-sunken)] text-[var(--w-orange-text)]',
  MISSING: 'bg-[var(--w-sunken)] text-[var(--w-red-text)]',
  ASSIGNED: 'bg-[var(--w-sunken)] text-[var(--w-text-2)]',
  NOT_ASSIGNED: 'bg-transparent text-[var(--w-text-3)]',
  DRAFT: 'bg-[var(--w-sunken)] text-[var(--w-text-2)]',
  SCHEDULED: 'bg-[var(--w-sunken)] text-[var(--w-yellow-text)]',
  PUBLISHED: 'bg-[var(--w-sunken)] text-[var(--w-green-text)]',
};

export function StateChip({ state, className }: { state: WorkState | string; className?: string }) {
  const { t } = useWT();
  return (
    <span className={cn('inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11.5px] font-medium', STATE_TONE[state] ?? STATE_TONE.ASSIGNED, className)}>
      {t(`c9b.state_${state}` as WKey)}
    </span>
  );
}

export async function openClassFile(classId: number, fid: number) {
  try {
    const r = await classworkApi.fileUrl(classId, fid);
    window.open(r.url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    toast.error(workError(err));
  }
}

export function FileList({ classId, files, onRemove, removing }: { classId: number; files: ClassFile[]; onRemove?: (f: ClassFile) => void; removing?: number | null }) {
  const { t } = useWT();
  if (!files.length) return null;
  return (
    <ul className="space-y-1.5">
      {files.map((f) => (
        <li key={f.id} className="flex items-center gap-2 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-2.5 py-1.5 text-[13px]">
          <FileText size={15} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
          <button type="button" className="min-w-0 flex-1 truncate text-left hover:underline" onClick={() => openClassFile(classId, f.id)} title={f.fileName}>
            {f.fileName}
          </button>
          <span className="shrink-0 tabular-nums text-[12px] text-[var(--w-text-3)]">{formatBytes(f.size)}</span>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c9b.download', { name: f.fileName })} onClick={() => openClassFile(classId, f.id)}><Download size={14} /></button>
          {onRemove && (
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c9b.removeFile', { name: f.fileName })} disabled={removing === f.id} onClick={() => onRemove(f)}>
              {removing === f.id ? <Spinner size={12} /> : <Trash2 size={14} />}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export function LinkList({ links, onRemove }: { links: SubmissionLink[]; onRemove?: (i: number) => void }) {
  const { t } = useWT();
  if (!links.length) return null;
  return (
    <ul className="space-y-1.5">
      {links.map((l, i) => (
        <li key={`${l.url}-${i}`} className="flex items-center gap-2 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-2.5 py-1.5 text-[13px]">
          <ExternalLink size={14} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
          <span className="shrink-0 font-medium">{l.label}</span>
          <a href={l.url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate text-[var(--w-text-2)] hover:underline">{l.url}</a>
          {onRemove && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c9b.removeLink')} onClick={() => onRemove(i)}><Trash2 size={14} /></button>}
        </li>
      ))}
    </ul>
  );
}

/** Nút chọn tệp → gọi `onPick` từng tệp (máy chủ kiểm cỡ/đuôi/chữ ký). */
export function UploadButton({ onPick, pending, label, disabled }: { onPick: (f: File) => Promise<unknown>; pending?: boolean; label?: string; disabled?: boolean }) {
  const { t } = useWT();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <input
        ref={ref} type="file" multiple className="hidden" aria-hidden="true" tabIndex={-1}
        onChange={async (e) => {
          const list = Array.from(e.target.files ?? []);
          e.target.value = '';
          setBusy(true);
          for (const f of list) {
            try { await onPick(f); } catch (err) { toast.error(`${f.name}: ${workError(err)}`); }
          }
          setBusy(false);
        }}
      />
      <button type="button" className="w-btn" disabled={disabled || busy || pending} onClick={() => ref.current?.click()}>
        {busy || pending ? <Spinner size={13} /> : <Paperclip size={14} />}{label ?? t('c9b.addFile')}
      </button>
    </>
  );
}

/** Nhận xét RIÊNG TƯ (chỉ giảng viên và chủ bài nộp thấy). */
export function PrivateComments({ classId, comments, submissionId, assignmentId, onSent }: {
  classId: number; comments: PrivateComment[]; submissionId?: number | null; assignmentId?: number; onSent: () => void;
}) {
  const { t, fmtRelative } = useWT();
  const [body, setBody] = useState('');
  const send = useMutation({
    mutationFn: () => classworkApi.comment(classId, { ...(submissionId ? { submissionId } : { assignmentId }), body: body.trim() }),
    onSuccess: () => { setBody(''); onSent(); },
    onError: (err) => toast.error(workError(err)),
  });
  return (
    <section aria-labelledby={`pc-${submissionId ?? assignmentId}`} className="space-y-2">
      <h4 id={`pc-${submissionId ?? assignmentId}`} className="flex items-center gap-1.5 text-[13px] font-semibold"><Lock size={13} aria-hidden="true" />{t('c9b.privateComments')}</h4>
      {comments.length ? (
        <ul className="space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-2">
              <UserAvatar user={c.author} size={24} />
              <div className="min-w-0 flex-1">
                <div className="text-[12px] text-[var(--w-text-2)]"><span className="font-medium text-[var(--w-text)]">{c.author ? (c.author.displayName || c.author.fullName || c.author.username) : '—'}</span> · {fmtRelative(c.createdAt)}</div>
                <p className="whitespace-pre-wrap break-words text-[13px]">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : <p className="text-[12.5px] text-[var(--w-text-3)]">{t('c9b.noPrivateComments')}</p>}
      <div className="flex items-end gap-2">
        <textarea
          className="w-input min-h-[38px] flex-1 resize-y" rows={1} maxLength={4000} value={body} placeholder={t('c9b.privateCommentPh')} aria-label={t('c9b.privateCommentPh')}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && body.trim()) send.mutate(); }}
        />
        <button type="button" className="w-btn w-btn-primary" aria-label={t('c9b.send')} disabled={!body.trim() || send.isPending} onClick={() => send.mutate()}>
          {send.isPending ? <Spinner size={13} /> : <Send size={14} />}
        </button>
      </div>
    </section>
  );
}

export const pts = (n: number | null | undefined, locale: string) => (n === null || n === undefined ? '—' : new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', { maximumFractionDigits: 2 }).format(n));
