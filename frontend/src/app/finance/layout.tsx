import type { Metadata } from 'next';

// MoneyFlow is a private per-user surface — keep it out of search indexes.
export const metadata: Metadata = {
  title: 'MoneyFlow — Quản lý tài chính',
  description: 'Quản lý thu nhập, chi tiêu, khoản nợ và ví cá nhân.',
  robots: { index: false, follow: false },
};

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
