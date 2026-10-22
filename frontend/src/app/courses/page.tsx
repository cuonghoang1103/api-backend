import { redirect } from 'next/navigation';
import { getServerApiBaseUrl } from '@/lib/server-api';
import type { ChuongTrinhDaoTao } from '@/types';
import ChuongTrinhClient from '@/components/courses/chuong-trinh/ChuongTrinhClient';
import { docCheDo } from '@/components/courses/chuong-trinh/chu';

/*
 * /courses — Chương trình đào tạo (15 kỳ × 5 khoá, xếp theo năm). Máy chủ Next dựng sẵn bản CÔNG KHAI (không cookie —
 * cache chung được, có chữ thật cho SEO); phần tiến độ riêng của người đăng nhập do client tải lại.
 * `force-dynamic`: backend không chạy lúc `next build` — không để build đi gọi nó.
 */
export const dynamic = 'force-dynamic';

async function layChuongTrinh(): Promise<ChuongTrinhDaoTao | null> {
  try {
    const res = await fetch(`${getServerApiBaseUrl()}/api/v1/courses/chuong-trinh`, {
      headers: { accept: 'application/json' },
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.nam ? (json.data as ChuongTrinhDaoTao) : null;
  } catch {
    return null; // client tự tải lại
  }
}

export default async function CoursesPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const lay = (k: string) => {
    const v = searchParams[k];
    return (Array.isArray(v) ? v[0] : v) ?? '';
  };
  // Link cũ: ?tab=academy (tab FPTU Academy của trang cũ) ⇒ trang Academy riêng; ?tab=lo-trinh ⇒ mặc định.
  if (lay('tab') === 'academy') redirect('/academy');

  const banDau = await layChuongTrinh();
  return (
    <ChuongTrinhClient
      banDau={banDau}
      trangThaiDau={{ xem: docCheDo(lay('view')), q: lay('q'), level: lay('level'), category: lay('category') }}
    />
  );
}
