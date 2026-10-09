'use client';

/**
 * /work/invite/<token> — trang người nhận lời mời mở ra. KHÔNG sidebar, người chưa đăng nhập vẫn xem được
 * (middleware + layout /work đã mở riêng đường này).
 *
 * UX-D (09/10/2026): trông như lời mời Slack/Notion — ảnh bìa dự án, tên workspace · dự án, người mời (ảnh + tên),
 * số thành viên, vai trò, nút Accept rõ ràng; trạng thái hết hạn / đã dùng / không hợp lệ tách riêng; hướng dẫn
 * đăng ký/đăng nhập bằng đúng email được mời. Dữ liệu thẻ (`card`) cùng nguồn với ảnh OG của link.
 */

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Clock, LinkIcon, MailCheck, MailX, Users } from 'lucide-react';
import { useDaDangNhap } from '@/hooks/useDaDangNhap';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { ProjectMark, Spinner, UserAvatar } from '@/components/work/ui';
import { WorkspaceMark, WS_ROLE_HELP, WS_ROLE_LABEL } from '@/components/work/settings/shared';
import ProjectCover from '@/components/work/cover/ProjectCover';
import { anhTuyetDoi } from '@/lib/anhTuyetDoi';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-[var(--w-bg)] px-4 py-10">
      <div className="w-full max-w-[460px]">
        <Link href="/work" className="mx-auto mb-6 flex w-fit items-center gap-2 text-[14px] font-semibold tracking-tight text-[var(--w-text)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={anhTuyetDoi("/images/ct-work/ct-work.svg")} alt="" width={24} height={24} className="h-6 w-6" />
          CT Work <span className="font-normal text-[var(--w-text-3)]">by CuongThai</span>
        </Link>
        <main className="overflow-hidden rounded-[14px] border border-[var(--w-border)] bg-[var(--w-panel)]" style={{ boxShadow: 'var(--w-shadow-card)' }}>{children}</main>
        <p className="mt-5 text-center text-[12px] leading-relaxed text-[var(--w-text-3)]">
          CT Work is a project workspace for teams and student groups — boards, sprints, docs and reports.
        </p>
      </div>
    </div>
  );
}

const STATE = {
  WORK_INVITE_EXPIRED: { icon: Clock, title: 'This invitation has expired', body: 'Invitations are valid for a limited time. Ask the person who invited you to send a new one.' },
  WORK_INVITE_USED: { icon: MailCheck, title: 'This invitation has already been used', body: 'Each invitation link can be used a set number of times. If you already joined, open your workspaces; otherwise ask for a new link.' },
  INVALID: { icon: MailX, title: 'Invitation not found', body: 'The link may be incomplete, or the invitation was cancelled. Check that you copied the whole link, or ask for a new one.' },
} as const;

export default function InviteView() {
  const params = useParams<{ token: string }>();
  const token = params?.token ?? '';
  const router = useRouter();
  const qc = useQueryClient();
  const { daDangNhap, sanSang } = useDaDangNhap();

  const preview = useQuery({
    queryKey: ['work', 'invite', token],
    queryFn: () => workApi.previewInvite(token),
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });

  const accept = useMutation({
    mutationFn: () => workApi.acceptInvite(token),
    onSuccess: ({ slug, portalPath }) => {
      qc.invalidateQueries({ queryKey: wk.workspaces });
      toast.success(`You joined ${preview.data?.workspace.name ?? 'the workspace'}`);
      // Lời mời KHÁCH (cổng khách S2b) ⇒ vào thẳng cổng khách của dự án.
      router.push(portalPath ?? `/work/${slug}`);
    },
    onError: (err) => toast.error(workError(err, 'Could not accept the invitation')),
  });

  if (preview.isLoading || !sanSang) {
    return <Shell><div className="flex justify-center py-16" role="status" aria-label="Loading invitation"><Spinner size={20} /></div></Shell>;
  }

  if (preview.error || !preview.data) {
    const code = (preview.error as { response?: { data?: { code?: string } } } | null)?.response?.data?.code;
    const s = STATE[(code === 'WORK_INVITE_EXPIRED' || code === 'WORK_INVITE_USED') ? code : 'INVALID'];
    const Icon = s.icon;
    return (
      <Shell>
        <div className="h-[72px] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--w-text-3)_30%,transparent),transparent)]" aria-hidden="true" />
        <div className="relative z-[1] -mt-7 flex flex-col items-center px-7 pb-8 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--w-border)] bg-[var(--w-panel)] text-[var(--w-text-2)]">
            <Icon size={22} />
          </span>
          <h1 className="text-[18px] font-semibold">{s.title}</h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--w-text-2)]">{s.body}</p>
          <Link href={daDangNhap ? '/work' : '/'} className="w-btn mt-6">{daDangNhap ? 'Go to your workspaces' : 'Back to home'}</Link>
        </div>
      </Shell>
    );
  }

  const { workspace, role, invitedBy, restrictedToEmail, card } = preview.data;
  const valid = card && card.status === 'VALID' ? card : null;
  const project = valid?.project ?? null;
  const callback = encodeURIComponent(`/work/invite/${token}`);
  const roleHelp = role !== 'OWNER' ? WS_ROLE_HELP[role] : null;
  const inviterName = valid?.inviter?.name ?? invitedBy;
  const where = project ? `${workspace.name} · ${project.name}` : workspace.name;

  return (
    <Shell>
      <ProjectCover
        brand={project ? project : { key: workspace.name, coverUrl: 'preset:gradient-indigo', coverPositionY: 50 }}
        className="h-[112px]"
      />
      <div className="px-7 pb-7">
        <div className="relative z-[1] -mt-8 mb-4 flex items-end gap-3">
          <span className="rounded-[10px] bg-[var(--w-panel)] p-1" style={{ boxShadow: 'var(--w-shadow-card)' }}>
            {project ? <ProjectMark k={project.key} size={52} letters={2} brand={project} /> : <WorkspaceMark name={workspace.name} size={52} />}
          </span>
        </div>
        {inviterName && (
          <div className="mb-3 flex items-center gap-2 text-[13px] text-[var(--w-text-2)]">
            <UserAvatar user={{ username: inviterName, fullName: inviterName, displayName: inviterName, avatarUrl: valid?.inviter?.avatarUrl ?? null }} size={22} />
            <span><span className="font-medium text-[var(--w-text)]">{inviterName}</span> invited you</span>
          </div>
        )}
        <h1 className="text-[20px] font-semibold leading-snug tracking-[-0.01em] [overflow-wrap:anywhere]">
          Join <span className="text-[var(--w-accent-text)]">{where}</span> on CT Work
        </h1>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[13px]">
          <dt className="text-[var(--w-text-3)]">Workspace</dt><dd className="min-w-0 truncate font-medium">{workspace.name}</dd>
          {project && (<><dt className="text-[var(--w-text-3)]">Project</dt><dd className="min-w-0 truncate font-medium">{project.name}</dd></>)}
          <dt className="text-[var(--w-text-3)]">Your role</dt>
          <dd className="font-medium">{WS_ROLE_LABEL[role]}{roleHelp && <span className="font-normal text-[var(--w-text-3)]"> — {roleHelp.charAt(0).toLowerCase() + roleHelp.slice(1)}</span>}</dd>
          {valid && (<><dt className="text-[var(--w-text-3)]">Members</dt><dd className="flex items-center gap-1.5 font-medium"><Users size={13} className="text-[var(--w-text-3)]" />{valid.memberCount} {valid.memberCount === 1 ? 'person' : 'people'}</dd></>)}
        </dl>

        {restrictedToEmail && (
          <p className="mt-4 rounded-[8px] bg-[var(--w-accent-soft)] px-3 py-2 text-[12.5px] leading-relaxed text-[var(--w-accent-text)]">
            This invitation was sent to a specific email address. Sign in — or create an account — with that same address to accept it.
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {daDangNhap ? (
            <button type="button" className="w-btn w-btn-primary h-10 w-full text-[14px]" onClick={() => accept.mutate()} disabled={accept.isPending || accept.isSuccess} data-testid="invite-accept">
              {(accept.isPending || accept.isSuccess) && <Spinner size={12} />}
              Accept invitation
            </button>
          ) : (
            <>
              <Link href={`/login?callbackUrl=${callback}`} className="w-btn w-btn-primary h-10 w-full text-[14px]" data-testid="invite-signin">Sign in to accept</Link>
              <Link href={`/register?callbackUrl=${callback}`} className="w-btn h-10 w-full">Create a free account</Link>
              <p className="mt-2 text-[12px] leading-relaxed text-[var(--w-text-3)]">
                New to CT Work? Create an account, verify your email, and you&apos;ll come straight back here to accept.
                <span lang="vi" className="mt-1 block">Chưa có tài khoản? Đăng ký bằng email được mời rồi quay lại trang này để chấp nhận.</span>
              </p>
            </>
          )}
        </div>
        <p className="mt-5 flex items-center gap-1.5 border-t border-[var(--w-border)] pt-4 text-[12px] text-[var(--w-text-3)]">
          <LinkIcon size={12} /> Not expecting this? You can safely close this page — nothing happens until you accept.
        </p>
      </div>
    </Shell>
  );
}
