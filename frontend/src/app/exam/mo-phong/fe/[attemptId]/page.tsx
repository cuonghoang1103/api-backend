import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ThiFeClient from './ThiFeClient';

export const dynamic = 'force-dynamic';

export default function ThiFePage({ params }: { params: { attemptId: string } }) {
  const token = cookies().get('backend_token')?.value;
  if (!token) redirect(`/login?callbackUrl=${encodeURIComponent(`/exam/mo-phong/fe/${params.attemptId}`)}`);
  return <ThiFeClient attemptId={Number(params.attemptId)} />;
}
