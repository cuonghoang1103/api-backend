import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import PhongVideoClient from './PhongVideoClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Phòng học video cùng AI | CuongThai',
  description: 'Xem video, đọc phụ đề song ngữ và hỏi gia sư AI về đúng đoạn đang xem.',
};

/**
 * Đường về, đọc ở MÁY CHỦ. CHỈ nhận đường dẫn nội bộ bắt đầu bằng đúng một `/`.
 *
 * ⚠️ `?ve=` đến từ URL, tức từ bất cứ ai gửi link. Nhận thẳng thì
 * `?ve=https://kẻ-xấu` biến nút "Quay lại bài học" thành một cú chuyển hướng
 * ra ngoài mang đủ vẻ chính danh. `//host` cũng là đường ra ngoài (giao thức
 * tương đối) nên phải loại luôn.
 */
function duongVe(v: string | string[] | undefined): string {
  const s = Array.isArray(v) ? v[0] : v;
  return s && /^\/(?!\/)/.test(s) ? s : '/courses';
}

export default function PhongVideoPage({ params, searchParams }: {
  params: { lessonId: string };
  searchParams: { [k: string]: string | string[] | undefined };
}) {
  const id = Number(params.lessonId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  /* Kiểm quyền Ở MÁY CHỦ, cùng cách trang `learn` làm (xem ghi chú dài ở
     `courses/[slug]/learn/page.tsx`): cookie `backend_token` là nguồn sự thật,
     còn tín hiệu đăng nhập phía client có thể kẹt ở `false` vô hạn. */
  const token = cookies().get('backend_token')?.value;
  if (!token) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/phong-video/${id}`)}`);
  }

  /*
   * ⚠️ KHÔNG dùng `useSearchParams` + `<Suspense>` ở đây nữa.
   *
   * Bọc `Suspense` làm Next CHẢY response ngay, nên `notFound()`/`redirect()`
   * ở trên không đặt được mã HTTP nữa: đo thật trên production 20/09/2026,
   * `/phong-video/abc` trả **200** kèm thân trang 404, và lối vào khi chưa
   * đăng nhập trả 200 kèm `<meta http-equiv="refresh">`. Máy chủ vốn đã có
   * sẵn `searchParams` — đọc ở đây rồi truyền xuống thì bỏ được cả vòng đó.
   */
  return <PhongVideoClient lessonId={id} ve={duongVe(searchParams.ve)} />;
}
