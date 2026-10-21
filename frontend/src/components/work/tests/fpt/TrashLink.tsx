'use client';

/** 22/10/2026: lối tắt từ trang Kiểm thử tới Thùng rác dữ liệu (Cài đặt dự án → Trash → Kiểm thử & dữ liệu khác). */

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { wt } from '@/components/work/i18n';

export default function TrashLink() {
  const p = useParams<{ ws: string; key: string }>();
  if (!p?.ws || !p?.key) return null;
  return (
    <Link href={`/work/${p.ws}/${p.key}/settings?tab=trash&bin=data`} className="w-btn w-btn-sm" title={wt('bin.openTrash')}>
      <Trash2 size={13} /> <span className="hidden sm:inline">{wt('bin.openTrash')}</span>
    </Link>
  );
}
