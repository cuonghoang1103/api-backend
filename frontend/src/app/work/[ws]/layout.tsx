import type { Metadata } from 'next';
import { workspaceMetadata } from '@/lib/og/workMeta';

/**
 * UX-D: mọi trang /work/<workspace>/** cần đăng nhập ⇒ ô xem trước CHỈ có tên workspace + "Sign in to view"
 * (không tiêu đề thẻ, tài liệu, board). Ảnh: opengraph-image.tsx cùng thư mục (trang con thừa hưởng).
 */
export function generateMetadata({ params }: { params: { ws: string } }): Promise<Metadata> {
  return workspaceMetadata(params.ws);
}

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
