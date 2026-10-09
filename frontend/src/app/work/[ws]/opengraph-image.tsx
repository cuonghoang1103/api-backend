import { lockedImage } from '@/lib/og/ctWorkCards';
import { fetchCard } from '@/lib/og/og';

// UX-D: trang cần đăng nhập — chỉ tên + logo workspace và "Sign in to view".
export const runtime = 'nodejs';
export const alt = 'CT Work — sign in to view';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { ws: string } }) {
  const c = await fetchCard<{ status: string; workspace?: { name: string; logoUrl: string | null } }>(`workspace-card/${encodeURIComponent(params.ws)}`, 300);
  return lockedImage({ workspace: c?.status === 'VALID' ? c.workspace?.name ?? null : null, workspaceLogoUrl: c?.workspace?.logoUrl });
}
