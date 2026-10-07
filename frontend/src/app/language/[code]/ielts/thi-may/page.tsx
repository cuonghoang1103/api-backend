'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import ThiMay from './ThiMay';

/** Phòng thi máy tính IELTS — chỉ có ở mục Tiếng Anh. */
export default function ThiMayPage() {
  const code = String(useParams().code);
  if (code !== 'en') {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        Phòng thi IELTS chỉ có ở mục Tiếng Anh. <Link href="/language/en/ielts/thi-may" style={{ fontWeight: 600 }}>Mở phòng thi</Link>
      </div>
    );
  }
  return <ThiMay />;
}
