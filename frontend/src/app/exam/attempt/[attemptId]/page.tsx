import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ExamReviewClient from './ExamReviewClient';

export const dynamic = 'force-dynamic';

export default function ExamAttemptPage({ params }: { params: { attemptId: string } }) {
  const token = cookies().get('backend_token')?.value;
  if (!token) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/exam/attempt/${params.attemptId}`)}`);
  }
  return <ExamReviewClient attemptId={Number(params.attemptId)} />;
}
