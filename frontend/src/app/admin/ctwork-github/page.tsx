import { Suspense } from 'react';
import GithubAppAdmin from '@/components/admin/GithubAppAdmin';

export const metadata = { title: 'GitHub App CT Work' };

// useSearchParams (thông báo ?created / ?error) phải nằm trong <Suspense>.
export default function Page() {
  return <Suspense fallback={null}><GithubAppAdmin /></Suspense>;
}
