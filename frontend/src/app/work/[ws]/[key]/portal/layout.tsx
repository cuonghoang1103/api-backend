import type { Metadata } from 'next';
import { workspaceMetadata } from '@/lib/og/workMeta';

/** UX-D: cổng khách — thương hiệu studio (tên + logo workspace, màu dự án), "Client portal · Sign in to view"; không tên dự án. */
export function generateMetadata({ params }: { params: { ws: string } }): Promise<Metadata> {
  return workspaceMetadata(params.ws, 'Client portal');
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
