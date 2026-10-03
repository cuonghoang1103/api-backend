'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import PhongThi from './PhongThi';

/** Phòng thi thử IELTS — chỉ có ở mục Tiếng Anh. */
export default function PhongThiPage() {
  const code = String(useParams().code);
  if (code !== 'en') {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        Phòng thi IELTS chỉ có ở mục Tiếng Anh. <Link href="/language/en/ielts/phong-thi" style={{ fontWeight: 600 }}>Mở phòng thi</Link>
      </div>
    );
  }
  return <PhongThi />;
}
