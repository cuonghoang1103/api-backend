'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import SachGoc from '@/components/sach-goc/SachGoc';

/** 📷 Sách gốc của khoá Dekiru — xem SachGoc.tsx. */
export default function SachGocPage() {
  if (String(useParams().code) !== 'ja') {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        Sách gốc chỉ có ở khoá tiếng Nhật. <Link href="/language/ja/dekiru" style={{ fontWeight: 600 }}>Mở khoá</Link>
      </div>
    );
  }
  return <SachGoc />;
}
