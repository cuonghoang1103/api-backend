'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import SoLoi from './SoLoi';

/** Sổ lỗi IELTS — chỉ có ở mục Tiếng Anh. */
export default function SoLoiPage() {
  const code = String(useParams().code);
  if (code !== 'en') {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        Sổ lỗi IELTS chỉ có ở mục Tiếng Anh. <Link href="/language/en/ielts/so-loi" style={{ fontWeight: 600 }}>Mở Sổ lỗi</Link>
      </div>
    );
  }
  return <SoLoi />;
}
