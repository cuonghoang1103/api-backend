import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import type { Metadata } from 'next';
import { VerifyOtpContent } from './VerifyOtpContent';

// Force dynamic rendering to avoid useSearchParams prerender issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Xác thực email - CuongHoangDev',
  description: 'Nhập mã OTP để xác thực email tài khoản',
  robots: { index: false, follow: false },
};

function VerifyOtpFallback() {
  return (
    <div className="min-h-screen bg-darkbg flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-neon-violet animate-spin" />
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<VerifyOtpFallback />}>
      <VerifyOtpContent />
    </Suspense>
  );
}
