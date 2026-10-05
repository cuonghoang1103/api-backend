'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import CoursePage from '@/components/sach-hoc/CoursePage';
import { CH } from './data';

/** Khoá CH — tiếng Trung từ 0 đến HSK 6. Nội dung ở data.ts + bai/, bộ khung ở components/sach-hoc. */
export default function ChPage() {
  const code = String(useParams().code);
  if (code !== 'zh') {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        Khoá CH chỉ có ở mục Tiếng Trung. <Link href="/language/zh/ch" style={{ fontWeight: 600 }}>Mở khoá</Link>
      </div>
    );
  }
  return <CoursePage course={CH} />;
}
