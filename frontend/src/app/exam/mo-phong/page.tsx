import type { Metadata } from 'next';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import MoPhongClient from './MoPhongClient';

export const metadata: Metadata = {
  title: 'Phòng thi mô phỏng — Exam Room',
  description: 'Luyện quy trình thi FE/PE: đề trộn theo chương, đồng hồ, bảng câu, tự lưu, nộp zip, checklist rubric, thống kê theo chương/CLO.',
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
