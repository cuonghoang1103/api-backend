import type { Metadata } from 'next';
import { inviteMetadata } from '@/lib/og/workMeta';
import InviteView from './InviteView';

/**
 * /work/invite/<token> — UX-D: phần máy chủ chỉ đặt metadata (og:title "Join {workspace} on CT Work", mô tả người mời +
 * dự án; ảnh ở opengraph-image.tsx). Token sai/hết hạn ⇒ metadata + ảnh trung tính. Giao diện: InviteView.tsx.
 */
export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { token: string } }): Promise<Metadata> {
  return inviteMetadata(params.token);
}

export default function InvitePage() {
  return <InviteView />;
}
