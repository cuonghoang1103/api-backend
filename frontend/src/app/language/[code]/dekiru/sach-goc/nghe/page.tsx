'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import NgheRieng from '@/components/sach-goc/NgheRieng';

/** 🎧 Bản chép riêng các track nghe CD — xem NgheRieng.tsx (chỉ tài khoản được phép). */
export default function NghePage() {
  if (String(useParams().code) !== 'ja') {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        Chỉ có ở khoá tiếng Nhật. <Link href="/language/ja/dekiru" style={{ fontWeight: 600 }}>Mở khoá</Link>
      </div>
    );
  }
  return <NgheRieng />;
}
