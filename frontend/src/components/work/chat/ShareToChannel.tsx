'use client';

/**
 * "Chia sẻ vào kênh" — nút đặt trên thẻ, trang Docs, cuộc họp. Đăng một tin `[tiêu đề](/work/…)` (+ lời nhắn) vào kênh
 * chọn; kênh hiện thẻ xem trước giàu thông tin cho TỪNG người theo quyền của họ (máy chủ lọc lúc đọc).
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MessageSquareShare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { chatApi, chatKeys } from '@/lib/work-chat-api';
import { Dialog, Field, Spinner } from '../ui';

export function ShareToChannelButton({ pid, path, label, className, compact, wsSlug, projectKey }: {
  pid: number; path: string; label: string; className?: string; compact?: boolean; wsSlug: string; projectKey: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={cn('w-btn w-btn-sm', compact && 'w-btn-icon', className)} onClick={() => setOpen(true)} title="Share to a chat channel" aria-label="Share to channel" data-testid="share-to-channel">
        <MessageSquareShare size={14} />
        {!compact && <span className="max-md:hidden">Share to channel</span>}
      </button>
      <ShareToChannelDialog open={open} onClose={() => setOpen(false)} pid={pid} path={path} label={label} wsSlug={wsSlug} projectKey={projectKey} />
    </>
  );
}

export function ShareToChannelDialog({ open, onClose, pid, path, label, wsSlug, projectKey }: {
  open: boolean; onClose: () => void; pid: number; path: string; label: string; wsSlug: string; projectKey: string;
}) {
  const router = useRouter();
  const q = useQuery({ queryKey: chatKeys.channels(pid), queryFn: () => chatApi.channels(pid), enabled: open });
  const channels = (q.data?.channels ?? []).filter((c) => c.canPost && !c.archived);
  const [cid, setCid] = useState<number | null>(null);
  const [note, setNote] = useState('');
  useEffect(() => { if (open) setNote(''); }, [open]);
  useEffect(() => { if (open && !cid && channels.length) setCid(channels[0].id); }, [open, cid, channels]);
  const m = useMutation({
    mutationFn: () => chatApi.send(pid, cid!, { body: `${note.trim() ? `${note.trim()}\n\n` : ''}[${label.replace(/[[\]]/g, '')}](${path})` }),
    onSuccess: (msg) => {
      const ch = channels.find((c) => c.id === cid);
      toast.success(`Shared to #${ch?.name ?? 'channel'}`, { action: { label: 'Open', onClick: () => router.push(`/work/${wsSlug}/${projectKey}/chat?c=${cid}&m=${msg.id}`) } });
      onClose();
    },
    onError: (err) => toast.error(workError(err, 'Could not share')),
  });
  return (
    <Dialog open={open} onClose={onClose} title="Share to channel" width={460}
      footer={<><button type="button" className="w-btn" onClick={onClose}>Cancel</button><button type="button" className="w-btn w-btn-primary" disabled={!cid || m.isPending} onClick={() => m.mutate()}>{m.isPending && <Spinner size={12} />}Share</button></>}>
      {q.isLoading ? <div className="flex justify-center py-4"><Spinner /></div> : !channels.length ? (
        <p className="text-[13px] text-[var(--w-text-2)]">There is no channel you can post in yet.</p>
      ) : (
        <div className="space-y-3">
          <p className="truncate rounded-[6px] bg-[var(--w-sunken)] px-2.5 py-1.5 text-[13px]" title={label}>{label}</p>
          <Field label="Channel">
            <select className="w-input" value={cid ?? ''} onChange={(e) => setCid(Number(e.target.value))}>
              {channels.map((c) => <option key={c.id} value={c.id}>#{c.name}{c.kind === 'PRIVATE' ? ' (private)' : c.kind === 'CLIENT' ? ' (client)' : ''}</option>)}
            </select>
          </Field>
          <Field label="Message (optional)"><textarea className="w-input min-h-[64px] py-2" value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} placeholder="Add context for the team…" /></Field>
          <p className="text-[12px] text-[var(--w-text-3)]">Only people who can open it see the preview card.</p>
        </div>
      )}
    </Dialog>
  );
}
