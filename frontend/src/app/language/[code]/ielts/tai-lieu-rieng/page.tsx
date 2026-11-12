'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import TaiLieuIeltsTong from '@/components/sach-goc/TaiLieuIeltsTong';

/** 🔒 Tài liệu riêng IELTS (chỉ tài khoản được phép) — xem components/sach-goc/TaiLieuIeltsTong.tsx. */
export default function TaiLieuRiengIeltsPage() {
  if (String(useParams().code) !== 'en') {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        IELTS chỉ có ở mục Tiếng Anh. <Link href="/language/en/ielts/tai-lieu-rieng" style={{ fontWeight: 600 }}>Mở</Link>
      </div>
    );
  }
  return <TaiLieuIeltsTong />;
}
