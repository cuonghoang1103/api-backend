'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import CoursePage from '@/components/sach-hoc/CoursePage';
import { GIAO_TIEP } from './data';

/** Tiếng Anh giao tiếp (24/11/2026) — nội dung ở data.ts + ngay/, bộ khung ở components/sach-hoc. */
export default function GiaoTiepPage() {
  const code = String(useParams().code);
  if (code !== 'en') {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        Khoá này chỉ có ở mục Tiếng Anh. <Link href="/language/en/giao-tiep" style={{ fontWeight: 600 }}>Mở Tiếng Anh giao tiếp</Link>
      </div>
    );
  }
  return <CoursePage course={GIAO_TIEP} />;
}
