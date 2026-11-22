import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ThiPeClient from './ThiPeClient';

export const dynamic = 'force-dynamic';

export default function ThiPePage({ params }: { params: { attemptId: string } }) {
  const token = cookies().get('backend_token')?.value;
  if (!token) redirect(`/login?callbackUrl=${encodeURIComponent(`/exam/mo-phong/pe/${params.attemptId}`)}`);
  return <ThiPeClient attemptId={Number(params.attemptId)} />;
}
