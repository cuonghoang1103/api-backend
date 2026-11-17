'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import CoursePage from '@/components/sach-hoc/CoursePage';
import { TaiLieuIeltsBai } from '@/components/sach-goc/TaiLieuIelts';
import { IELTS_T3 } from './data';

/** IELTS Tập 3 (5.0 → 6.0) — nội dung ở data.ts + ngay/, bộ khung ở components/sach-hoc. */
export default function IeltsTap3Page() {
  const code = String(useParams().code);
  if (code !== 'en') {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        IELTS chỉ có ở mục Tiếng Anh. <Link href="/language/en/ielts/tap-3" style={{ fontWeight: 600 }}>Mở IELTS Tập 3</Link>
      </div>
    );
  }
  // 🔒 Tài liệu riêng: chỉ hiện với tài khoản có 'ielts' trong /sach-rieng/quyen (tên tài liệu chỉ đến từ API).
  return <CoursePage course={IELTS_T3} lessonExtra={(l) => <TaiLieuIeltsBai lessonId={l.id} />} />;
}
