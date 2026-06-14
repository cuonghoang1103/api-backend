import type { Metadata } from 'next';
import { ForgotPasswordForm } from './ForgotPasswordForm';

// Force dynamic rendering to avoid Suspense/prerender issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Quên mật khẩu - CuongHoangDev',
  description: 'Đặt lại mật khẩu tài khoản của bạn',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
