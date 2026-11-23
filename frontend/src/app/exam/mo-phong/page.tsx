import type { Metadata } from 'next';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import MoPhongClient from './MoPhongClient';

export const metadata: Metadata = {
  title: 'PEA + EOS — Exam Room',
  description: 'Thi thử FE · PE theo môn.',
};

export const dynamic = 'force-dynamic';

export default function MoPhongPage({ searchParams }: { searchParams: { course?: string } }) {
  const token = cookies().get('backend_token')?.value;
  if (!token) {
    const q = searchParams?.course ? `?course=${encodeURIComponent(searchParams.course)}` : '';
    redirect(`/login?callbackUrl=${encodeURIComponent(`/exam/mo-phong${q}`)}`);
  }
  return (
    <Suspense fallback={null}>
      <MoPhongClient />
    </Suspense>
  );
}
