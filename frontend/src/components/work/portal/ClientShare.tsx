'use client';

/**
 * Cổng khách (đợt S2b) — các mảnh giao diện NỘI BỘ quanh việc chia sẻ với khách:
 *   - dải "Visible to client" trên thẻ / trang / tệp đã chia sẻ,
 *   - nút "Share with client" / "Stop sharing" trên thẻ,
 *   - lựa chọn "Internal note" (mặc định) / "Reply to client" khi viết bình luận,
 *   - nhãn trên từng bình luận, nút chia sẻ / bàn giao trên từng tệp.
 * Chỉ hiện khi dự án bật mô-đun clientPortal và người xem KHÔNG phải khách
 * (khách dùng /portal). Server vẫn kiểm lại mọi thứ — đây chỉ là hiển thị.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, PackageCheck, Share2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, workPortalApi, type CommentVisibility, type IssueAttachment, type ProjectConfig } from '@/lib/work-api';
import { wk } from '../hooks';
import { studioOn } from '../studio/shared';
import { formatDate } from '../ui';

/** Dự án bật cổng khách và người xem là nhân viên (không phải khách bị cách ly). */
export function portalStaff(config: Pick<ProjectConfig, 'modules' | 'clientView'> | undefined | null): boolean {
  return studioOn(config, 'clientPortal') && !config?.clientView;
}

export function VisibleToClient({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('w-client-ribbon', className)} role="note">
      <Eye size={14} className="w-client-ico" aria-hidden="true" />
      <span className="min-w-0 flex-1"><b className="font-semibold">Visible to client</b>{children ? <span className="text-[var(--w-text-2)]"> · {children}</span> : null}</span>
    </div>
  );
}

export function ClientPill({ label = 'Visible to client' }: { label?: string }) {
  return <span className="w-client-pill" title="The client can see this in their portal"><Eye size={11} aria-hidden="true" />{label}</span>;
}

export function InternalPill({ label = 'Internal' }: { label?: string }) {
  return <span className="w-internal-pill" title="Only the project team can see this"><Lock size={10} aria-hidden="true" />{label}</span>;
}

/** Thanh chia sẻ dưới tiêu đề thẻ. */
export function IssueClientShare({ config, pid, issue }: { config: ProjectConfig; pid: number; issue: { number: number; clientVisible?: boolean; clientSharedAt?: string | null } }) {
  const qc = useQueryClient();
  const set = useMutation({
    mutationFn: (visible: boolean) => workPortalApi.setIssueShared(pid, issue.number, visible),
    onSuccess: (_d, visible) => {
      toast.success(visible ? 'Shared with the client' : 'No longer visible to the client');
      qc.invalidateQueries({ queryKey: wk.issue(pid, issue.number) });
      qc.invalidateQueries({ queryKey: wk.board(pid) });
      qc.invalidateQueries({ queryKey: wk.issues(pid) });
      qc.invalidateQueries({ queryKey: ['work', 'portal', pid] });
    },
    onError: (err) => toast.error(workError(err, 'Could not change sharing')),
  });
  if (!portalStaff(config)) return null;
  const canEdit = config.permissions.editIssues;
  if (issue.clientVisible) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <VisibleToClient className="flex-1">
          title, description, status, shared files and replies to client{issue.clientSharedAt ? ` — shared ${formatDate(issue.clientSharedAt)}` : ''}
        </VisibleToClient>
        {canEdit && (
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" disabled={set.isPending} onClick={() => set.mutate(false)}>
            <EyeOff size={13} /> Stop sharing
          </button>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-[var(--w-text-3)]">
      <InternalPill label="Internal only" />
      <span className="min-w-0 flex-1">The client does not see this issue.</span>
      {canEdit && (
        <button type="button" className="w-btn w-btn-sm" disabled={set.isPending} onClick={() => set.mutate(true)}>
          <Share2 size={13} /> Share with client
        </button>
      )}
    </div>
  );
}

/** "Internal note" (mặc định) / "Reply to client" trong ô bình luận. */
export function CommentModeToggle({ value, onChange, shared }: { value: CommentVisibility; onChange: (v: CommentVisibility) => void; shared: boolean }) {
  return (
    <div className="w-seg" role="group" aria-label="Who can see this comment">
      <button type="button" aria-pressed={value === 'INTERNAL'} onClick={() => onChange('INTERNAL')} title="Only the project team sees internal notes">
        <Lock size={11} className="mr-1 inline" aria-hidden="true" />Internal note
      </button>
      <button
        type="button"
        aria-pressed={value === 'PUBLIC'}
        disabled={!shared}
        onClick={() => onChange('PUBLIC')}
        title={shared ? 'The client sees this reply in their portal and gets an email' : 'Share the issue with the client first'}
      >
        <Users size={11} className="mr-1 inline" aria-hidden="true" />Reply to client
      </button>
    </div>
  );
}

/** Nút chia sẻ / bàn giao trên một tệp (thẻ phải đã chia sẻ). */
export function AttachmentClientControls({ config, pid, issueNumber, issueShared, a }: { config: ProjectConfig; pid: number; issueNumber: number; issueShared: boolean; a: IssueAttachment }) {
  const qc = useQueryClient();
  const set = useMutation({
    mutationFn: (body: { clientVisible?: boolean; deliverable?: boolean }) => workPortalApi.setAttachmentClient(pid, a.id, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: wk.issue(pid, issueNumber) }); qc.invalidateQueries({ queryKey: ['work', 'portal', pid] }); },
    onError: (err) => toast.error(workError(err, 'Could not change sharing')),
  });
  if (!portalStaff(config)) return null;
  const canEdit = config.permissions.editIssues && issueShared;
  return (
    <div className="flex flex-wrap items-center gap-1 px-2 pb-1.5">
      {a.deliverable ? <ClientPill label="Deliverable" /> : a.clientVisible ? <ClientPill label="Client" /> : <InternalPill />}
      {canEdit && !a.deliverable && (
        <button type="button" className="text-[11px] text-[var(--w-accent-text)] hover:underline" disabled={set.isPending} onClick={() => set.mutate({ clientVisible: !a.clientVisible })}>
          {a.clientVisible ? 'Unshare' : 'Share'}
        </button>
      )}
      {canEdit && (
        <button type="button" className="inline-flex items-center gap-0.5 text-[11px] text-[var(--w-accent-text)] hover:underline" disabled={set.isPending} onClick={() => set.mutate({ deliverable: !a.deliverable })} title="Deliverables appear in the client portal for download">
          <PackageCheck size={11} aria-hidden="true" />{a.deliverable ? 'Undeliver' : 'Deliver'}
        </button>
      )}
    </div>
  );
}
