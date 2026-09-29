'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import CoursePage from '@/components/sach-hoc/CoursePage';
import { NutSachGoc } from '@/components/sach-goc/NutSachGoc';
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
  // 📷 Sách gốc: thẻ đầu mỗi bài, chỉ tài khoản được phép thấy. Buổi n = Bài n − 1.
  return <CoursePage course={DEKIRU} lessonExtra={(l, dayN) => <NutSachGoc lesson={l} bai={dayN ? dayN - 1 : undefined} />} />;
}
