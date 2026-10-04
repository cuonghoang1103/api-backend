'use client';

/**
 * Chi tiết EXP_Hub phía TRÌNH DUYỆT — cho app desktop (04/10/2026). `page.tsx` là
 * server component `async`, app không dựng được (React #31); bản này tải snippet
 * qua API rồi dựng đúng `ChiTietSnippet` dùng chung với web.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { snippetsApi } from '@/lib/exp-hub-api';
import type { Snippet } from '@/types/exp-hub';
import { ChiTietSnippet } from './ChiTietSnippet';

export default function ChiTietSnippetClient() {
  const params = useParams<{ slug: string }>();
  const sp = useSearchParams();
  const slug = String(params?.slug ?? '');
  const [s, datS] = useState<Snippet | null>(null);
  const [loi, datLoi] = useState(false);

  useEffect(() => {
    let huy = false;
    datS(null); datLoi(false);
    snippetsApi.getBySlug(slug)
      .then((r) => { if (!huy) { if (r.data?.data) datS(r.data.data); else datLoi(true); } })
      .catch(() => { if (!huy) datLoi(true); });
    return () => { huy = true; };
  }, [slug]);

  if (loi) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="mb-4 text-[var(--text-secondary)]">Không tìm thấy mục này trong EXP_Hub.</p>
        <Link href="/exp-hub" className="text-violet-500 hover:underline">← Về EXP_Hub</Link>
      </div>
    );
  }
  if (!s) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--text-muted)]" /></div>;
  }
  return <ChiTietSnippet s={s} slug={slug} backRef={sp?.get('ref') ?? ''} backLabel={sp?.get('reflabel') || 'khóa học'} />;
}
