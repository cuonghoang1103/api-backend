import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ExamRoomClient from './ExamRoomClient';

export const dynamic = 'force-dynamic';

export default function ExamRoomPage({ params }: { params: { examId: string } }) {
  // Taking an exam requires auth — read the httpOnly backend_token directly
  // (same cookie the API client sends) so we never hang on a client auth race.
  const token = cookies().get('backend_token')?.value;
  if (!token) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/exam/${params.examId}`)}`);
  }
  return <ExamRoomClient examId={Number(params.examId)} />;
}
