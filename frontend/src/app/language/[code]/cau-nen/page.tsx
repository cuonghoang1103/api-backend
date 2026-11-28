'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import CauNenApp from './CauNenApp';

/** 🧱 1000 câu nền — dịch 2 chiều (28/11/2026). Nội dung ở du-lieu/, khung ở CauNenApp.tsx. */
export default function CauNenPage() {
  const code = String(useParams().code);
  if (code !== 'en') {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        Lộ trình này chỉ có ở mục Tiếng Anh. <Link href="/language/en/cau-nen" style={{ fontWeight: 600 }}>Mở 1000 câu nền</Link>
      </div>
    );
  }
  return <CauNenApp />;
}
