import { lockedImage } from '@/lib/og/ctWorkCards';
import { fetchCard } from '@/lib/og/og';

// UX-D: cổng khách — logo + tên workspace, màu dự án, "Client portal" + "Sign in to view".
export const runtime = 'nodejs';
export const alt = 'Client portal on CT Work — sign in to view';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { ws: string; key: string } }) {
  const c = await fetchCard<{ status: string; workspace?: { name: string; logoUrl: string | null }; color?: string | null }>(`portal-card/${encodeURIComponent(params.ws)}/${encodeURIComponent(params.key)}`, 300);
  const ok = c?.status === 'VALID';
  return lockedImage({ workspace: ok ? c!.workspace?.name ?? null : null, workspaceLogoUrl: ok ? c!.workspace?.logoUrl : null, label: 'Client portal', color: ok ? c!.color : null });
}
