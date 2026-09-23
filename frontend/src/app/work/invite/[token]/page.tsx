'use client';

/**
 * /work/invite/<token> — trang nhận lời mời. Hiện KHÔNG có sidebar và có thể
 * cho người chưa đăng nhập xem (middleware + layout đã mở riêng đường này).
 */

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MailX } from 'lucide-react';
import { useDaDangNhap } from '@/hooks/useDaDangNhap';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { Spinner } from '@/components/work/ui';
import { WorkspaceMark, WS_ROLE_HELP, WS_ROLE_LABEL } from '@/components/work/settings/shared';

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">
        <div className="mb-6 text-center text-[13px] font-semibold tracking-tight text-[var(--w-text-2)]">CT Work</div>
        <div className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] px-6 py-7">{children}</div>
      </div>
    </div>
  );
}

export default function InvitePage() {
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
    onSuccess: ({ slug }) => {
      qc.invalidateQueries({ queryKey: wk.workspaces });
      toast.success(`You joined ${preview.data?.workspace.name ?? 'the workspace'}`);
      router.push(`/work/${slug}`);
    },
    onError: (err) => toast.error(workError(err, 'Could not accept the invitation')),
  });

  if (preview.isLoading || !sanSang) {
    return <Card><div className="flex justify-center py-6"><Spinner size={20} /></div></Card>;
  }

  if (preview.error || !preview.data) {
    return (
      <Card>
        <div className="flex flex-col items-center text-center">
          <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--w-sunken)] text-[var(--w-text-2)]">
            <MailX size={18} />
          </span>
          <h1 className="text-[16px] font-semibold">Invitation unavailable</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--w-text-2)]">
            {workError(preview.error, 'This invitation is not valid.')} Ask the person who invited you to send a new one.
          </p>
          <Link href={daDangNhap ? '/work' : '/'} className="w-btn mt-6">
            {daDangNhap ? 'Go to your workspaces' : 'Back to home'}
          </Link>
        </div>
      </Card>
    );
  }

  const { workspace, role, invitedBy, restrictedToEmail } = preview.data;
  const callback = encodeURIComponent(`/work/invite/${token}`);
  const roleHelp = role !== 'OWNER' ? WS_ROLE_HELP[role] : null;

  return (
    <Card>
      <div className="flex flex-col items-center text-center">
        <WorkspaceMark name={workspace.name} size={44} />
        <h1 className="mt-4 text-[16px] font-semibold leading-snug">
          {invitedBy ? <>{invitedBy} invited you to join <span className="whitespace-nowrap">{workspace.name}</span></> : <>You&apos;re invited to join {workspace.name}</>}
        </h1>
        <p className="mt-2 text-[13px] text-[var(--w-text-2)]">
          You&apos;ll join as <span className="font-medium text-[var(--w-text)]">{WS_ROLE_LABEL[role]}</span>
          {roleHelp ? <> — {roleHelp.charAt(0).toLowerCase() + roleHelp.slice(1)}.</> : '.'}
        </p>
        {restrictedToEmail && (
          <p className="mt-2 text-[12px] text-[var(--w-text-3)]">This invitation can only be accepted by the email address it was sent to.</p>
        )}
      </div>

      <div className="mt-7 flex flex-col gap-2">
        {daDangNhap ? (
          <button type="button" className="w-btn w-btn-primary h-9 w-full" onClick={() => accept.mutate()} disabled={accept.isPending || accept.isSuccess}>
            {(accept.isPending || accept.isSuccess) && <Spinner size={12} />}
            Accept invitation
          </button>
        ) : (
          <>
            <Link href={`/login?callbackUrl=${callback}`} className="w-btn w-btn-primary h-9 w-full">Sign in to accept</Link>
            <Link href={`/register?callbackUrl=${callback}`} className="w-btn h-9 w-full">Create an account</Link>
          </>
        )}
      </div>
    </Card>
  );
}
