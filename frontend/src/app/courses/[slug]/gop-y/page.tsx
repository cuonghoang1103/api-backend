import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getServerApiBaseUrl } from '@/lib/server-api';
import { pickLang } from '@/lib/utils';
import GopYKhoaClient from '@/components/courses/gop-y/GopYKhoaClient';

// Góp ý & bổ sung cho khoá (14/11/2026) — docs/gop-y-khoa-hoc.md. Trang client tự tải dữ liệu; ở đây chỉ dựng
// metadata phía server. `force-dynamic` giữ generateMetadata ngoài lúc build (backend không chạy khi build).
export const dynamic = 'force-dynamic';

async function tenKhoa(slug: string): Promise<string | null> {
  try {
    const res = await fetch(`${getServerApiBaseUrl()}/api/v1/courses/${encodeURIComponent(slug)}?gon=1`, {
      headers: { accept: 'application/json' },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.title ? pickLang(json.data.title, 'vi') : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const ten = await tenKhoa(params.slug);
  const url = `https://cuongthai.com/courses/${params.slug}/gop-y`;
  return {
    title: `Góp ý & bổ sung${ten ? ` — ${ten}` : ''} | CuongThai`,
    description: 'Góp ý kiến thức còn thiếu, chỗ sai, liên tưởng hay cho khoá học — mỗi góp ý được đối chiếu với bài học và đưa vào kế hoạch nâng cấp khoá.',
    alternates: { canonical: url },
  };
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GopYKhoaClient />
    </Suspense>
  );
}
