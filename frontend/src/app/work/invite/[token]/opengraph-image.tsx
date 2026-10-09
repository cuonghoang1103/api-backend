import { inviteImage, type InviteCardData } from '@/lib/og/ctWorkCards';
import { fetchCard } from '@/lib/og/og';

// UX-D: "{inviter} invited you to join {workspace} · {project}" — chỉ những gì lời mời Slack/Notion vẫn hiện.
export const runtime = 'nodejs';
export const alt = 'CT Work invitation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { token: string } }) {
  return inviteImage(await fetchCard<InviteCardData>(`invite-card/${encodeURIComponent(params.token)}`, 60));
}
