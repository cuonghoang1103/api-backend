'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import CoursePage from '@/components/sach-hoc/CoursePage';
import { JP } from './data';

/** Khoá JP — tiếng Nhật từ 0 đến N1. Nội dung ở data.ts + bai/, bộ khung ở components/sach-hoc. */
export default function JpPage() {
  const code = String(useParams().code);
  if (code !== 'ja') {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        Khoá JP chỉ có ở mục Tiếng Nhật. <Link href="/language/ja/jp" style={{ fontWeight: 600 }}>Mở khoá</Link>
      </div>
    );
  }
  return <CoursePage course={JP} />;
}
