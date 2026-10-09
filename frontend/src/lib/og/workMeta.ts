/**
 * UX-D — metadata (og:*, twitter:*) cho các trang CT Work, dựng từ thẻ công khai rút gọn của backend.
 * Ảnh do tệp opengraph-image.tsx cùng thư mục cung cấp (Next tự chèn og:image / twitter:image).
 */
import type { Metadata } from 'next';
import { fetchCard } from './og';
import type { InviteCardData, ShareCardData } from './ctWorkCards';

const SITE = 'CT Work by CuongThai';
const base = (title: string, description: string, url: string): Metadata => ({
  title: { absolute: title.includes('CT Work') ? title : `${title} · CT Work` },
  description,
  alternates: { canonical: url },
  openGraph: { type: 'website', siteName: SITE, locale: 'en_US', alternateLocale: 'vi_VN', title, description, url },
  twitter: { card: 'summary_large_image', title, description },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
});

export async function inviteMetadata(token: string): Promise<Metadata> {
  const card = await fetchCard<InviteCardData>(`invite-card/${encodeURIComponent(token)}`, 60);
  const url = `https://cuongthai.com/work/invite/${token}`;
  if (!card || card.status !== 'VALID' || !card.workspace) {
    return { ...base('Invitation unavailable', 'This CT Work invitation has expired or is no longer available. Ask for a new link.', url), referrer: 'no-referrer' };
  }
  const inviter = card.inviter?.name ?? 'Someone';
  const description = card.project
    ? `${inviter} invited you to collaborate on ${card.project.name}. Sign in to accept.`
    : `${inviter} invited you to collaborate in ${card.workspace.name}. Sign in to accept.`;
  return { ...base(`Join ${card.workspace.name} on CT Work`, description, url), referrer: 'no-referrer' };
}

export async function shareMetadata(token: string): Promise<Metadata> {
  const card = await fetchCard<ShareCardData>(`share-card/${encodeURIComponent(token)}`, 300);
  const url = `https://cuongthai.com/work/share/${token}`;
  if (!card || card.status !== 'VALID' || !card.project) return { ...base('Shared project', 'This shared project link is no longer available.', url), referrer: 'no-referrer' };
  const bits = [card.progress ? `${card.progress.percent}% done` : null, card.sprint ? `current sprint: ${card.sprint.name}` : null].filter(Boolean).join(' · ');
  return { ...base(`${card.project.name} — ${card.workspace?.name ?? 'CT Work'}`, `Read-only view of ${card.project.name} on CT Work${bits ? ` — ${bits}` : ''}.`, url), referrer: 'no-referrer' };
}

export async function workspaceMetadata(slug: string, label?: string): Promise<Metadata> {
  const card = await fetchCard<{ status: string; workspace?: { name: string } }>(`workspace-card/${encodeURIComponent(slug)}`, 300);
  const name = card?.status === 'VALID' && card.workspace ? card.workspace.name : null;
  const title = name ? `${name}${label ? ` · ${label}` : ''}` : 'CT Work';
  const m = base(title, `Sign in to view${name ? ` ${name}` : ' this page'} on CT Work${label ? ` (${label.toLowerCase()})` : ''}.`, `https://cuongthai.com/work/${slug}`);
  // Tiêu đề TAB không lộ gì hơn ảnh xem trước; trang con tự đặt tiêu đề riêng (nếu có) sau khi đăng nhập.
  return { ...m, alternates: undefined, openGraph: { ...m.openGraph, url: undefined } };
}
