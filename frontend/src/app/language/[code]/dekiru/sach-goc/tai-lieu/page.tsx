'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import TaiLieuRieng from '@/components/sach-goc/TaiLieuRieng';

/** 🖼️ Tài liệu gốc JPD123 (riêng tư) — xem TaiLieuRieng.tsx. */
export default function TaiLieuPage() {
  if (String(useParams().code) !== 'ja') {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        Chỉ có ở khoá tiếng Nhật. <Link href="/language/ja/dekiru" style={{ fontWeight: 600 }}>Mở khoá</Link>
      </div>
    );
  }
  return <TaiLieuRieng />;
}
