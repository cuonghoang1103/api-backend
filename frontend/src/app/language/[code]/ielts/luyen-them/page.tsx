'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import LuyenThem from './LuyenThem';

/** Kho luyện IELTS — chỉ có ở mục Tiếng Anh. */
export default function LuyenThemPage() {
  const code = String(useParams().code);
  if (code !== 'en') {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        Kho luyện IELTS chỉ có ở mục Tiếng Anh. <Link href="/language/en/ielts/luyen-them" style={{ fontWeight: 600 }}>Mở kho luyện</Link>
      </div>
    );
  }
  return <LuyenThem />;
}
