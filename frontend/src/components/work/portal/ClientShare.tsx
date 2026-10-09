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
import { wt } from '@/components/work/i18n';

/** Dự án bật cổng khách và người xem là nhân viên (không phải khách bị cách ly). */
export function portalStaff(config: Pick<ProjectConfig, 'modules' | 'clientView'> | undefined | null): boolean {
  return studioOn(config, 'clientPortal') && !config?.clientView;
}

export function VisibleToClient({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('w-client-ribbon', className)} role="note">
      <Eye size={14} className="w-client-ico" aria-hidden="true" />
      <span className="min-w-0 flex-1"><b className="font-semibold">{wt('portal.visibleToClient')}</b>{children ? <span className="text-[var(--w-text-2)]"> · {children}</span> : null}</span>
    </div>
  );
}

export function ClientPill({ label = wt('portal.visibleToClient') }: { label?: string }) {
  return <span className="w-client-pill" title={wt('portal.clientCanSee')}><Eye size={11} aria-hidden="true" />{label}</span>;
}

export function InternalPill({ label = wt('docs.internalTag') }: { label?: string }) {
  return <span className="w-internal-pill" title={wt('portal.onlyTeam')}><Lock size={10} aria-hidden="true" />{label}</span>;
}

/** Thanh chia sẻ dưới tiêu đề thẻ. */
export function IssueClientShare({ config, pid, issue }: { config: ProjectConfig; pid: number; issue: { number: number; clientVisible?: boolean; clientSharedAt?: string | null } }) {
  const qc = useQueryClient();
  const set = useMutation({
    mutationFn: (visible: boolean) => workPortalApi.setIssueShared(pid, issue.number, visible),
    onSuccess: (_d, visible) => {
      toast.success(visible ? wt('portal.shared') : wt('portal.unshared'));
      qc.invalidateQueries({ queryKey: wk.issue(pid, issue.number) });
      qc.invalidateQueries({ queryKey: wk.board(pid) });
      qc.invalidateQueries({ queryKey: wk.issues(pid) });
      qc.invalidateQueries({ queryKey: ['work', 'portal', pid] });
    },
    onError: (err) => toast.error(workError(err, wt('portal.sharingFailed'))),
  });
  if (!portalStaff(config)) return null;
  const canEdit = config.permissions.editIssues;
  if (issue.clientVisible) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <VisibleToClient className="flex-1">
          {wt('portal.issueVisible', { s: issue.clientSharedAt ? wt('portal.sharedOn', { d: formatDate(issue.clientSharedAt) }) : '' })}
        </VisibleToClient>
        {canEdit && (
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" disabled={set.isPending} onClick={() => set.mutate(false)}>
            <EyeOff size={13} /> {wt('portal.stopSharing')}
          </button>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-[var(--w-text-3)]">
      <InternalPill label={wt('portal.internalOnly')} />
      <span className="min-w-0 flex-1">{wt('portal.clientNotSee')}</span>
      {canEdit && (
        <button type="button" className="w-btn w-btn-sm" disabled={set.isPending} onClick={() => set.mutate(true)}>
          <Share2 size={13} /> {wt('portal.shareWithClient')}
        </button>
      )}
    </div>
  );
}

/** "Internal note" (mặc định) / "Reply to client" trong ô bình luận. */
export function CommentModeToggle({ value, onChange, shared }: { value: CommentVisibility; onChange: (v: CommentVisibility) => void; shared: boolean }) {
  return (
    <div className="w-seg" role="group" aria-label={wt('portal.whoCanSee')}>
      <button type="button" aria-pressed={value === 'INTERNAL'} onClick={() => onChange('INTERNAL')} title={wt('portal.internalNotesTitle')}>
        <Lock size={11} className="mr-1 inline" aria-hidden="true" />{wt('portal.internalNote')}
      </button>
      <button
        type="button"
        aria-pressed={value === 'PUBLIC'}
        disabled={!shared}
        onClick={() => onChange('PUBLIC')}
        title={shared ? wt('portal.replyTitle') : wt('portal.shareFirst')}
      >
        <Users size={11} className="mr-1 inline" aria-hidden="true" />{wt('portal.replyToClient')}
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
    onError: (err) => toast.error(workError(err, wt('portal.sharingFailed'))),
  });
  if (!portalStaff(config)) return null;
  const canEdit = config.permissions.editIssues && issueShared;
  return (
    <div className="flex flex-wrap items-center gap-1 px-2 pb-1.5">
      {a.deliverable ? <ClientPill label={wt('portal.deliverable')} /> : a.clientVisible ? <ClientPill label={wt('docs.clientTag')} /> : <InternalPill />}
      {canEdit && !a.deliverable && (
        <button type="button" className="text-[11px] text-[var(--w-accent-text)] hover:underline" disabled={set.isPending} onClick={() => set.mutate({ clientVisible: !a.clientVisible })}>
          {a.clientVisible ? wt('portal.unshare') : wt('portal.share')}
        </button>
      )}
      {canEdit && (
        <button type="button" className="inline-flex items-center gap-0.5 text-[11px] text-[var(--w-accent-text)] hover:underline" disabled={set.isPending} onClick={() => set.mutate({ deliverable: !a.deliverable })} title={wt('portal.deliverTitle')}>
          <PackageCheck size={11} aria-hidden="true" />{a.deliverable ? wt('portal.undeliver') : wt('portal.deliver')}
        </button>
      )}
    </div>
  );
}
