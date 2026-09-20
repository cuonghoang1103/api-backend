import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { Suspense } from 'react';
import PhongVideoClient from './PhongVideoClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Phòng học video cùng AI | CuongThai',
  description: 'Xem video, đọc phụ đề song ngữ và hỏi gia sư AI về đúng đoạn đang xem.',
};

export default function PhongVideoPage({ params }: { params: { lessonId: string } }) {
  const id = Number(params.lessonId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  /* Kiểm quyền Ở MÁY CHỦ, cùng cách trang `learn` làm (xem ghi chú dài ở
     `courses/[slug]/learn/page.tsx`): cookie `backend_token` là nguồn sự thật,
     còn tín hiệu đăng nhập phía client có thể kẹt ở `false` vô hạn. */
  const token = cookies().get('backend_token')?.value;
  if (!token) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/phong-video/${id}`)}`);
  }

  return (
    /* `useSearchParams` (đọc `?ve=`) bắt buộc phải nằm trong `Suspense`, nếu
       không `next build` hỏng ở bước dựng tĩnh. */
    <Suspense fallback={null}>
      <PhongVideoClient lessonId={id} />
    </Suspense>
  );
}
