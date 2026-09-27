'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import CoursePage from '@/components/sach-hoc/CoursePage';
import { DEKIRU } from './data';

/** Khoá tiếng Nhật Dekiru — nội dung ở data.ts + bai/, bộ khung ở components/sach-hoc. */
export default function DekiruPage() {
  const code = String(useParams().code);
  if (code !== 'ja') {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        Khoá Dekiru chỉ có ở mục Tiếng Nhật. <Link href="/language/ja/dekiru" style={{ fontWeight: 600 }}>Mở khoá</Link>
      </div>
    );
  }
  return <CoursePage course={DEKIRU} />;
}
