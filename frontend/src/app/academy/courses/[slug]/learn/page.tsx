import { redirect } from 'next/navigation';

/**
 * Academy và Khoá học dùng CHUNG một trang học — đây chỉ là lối vào cũ.
 *
 * Query string phải đi theo: `?lessonSlug=` là đường về từ /simulation, và
 * `?lessonId=` là link chia sẻ tới một bài cụ thể. Bỏ query ở đây thì người
 * học rơi về bài đầu tiên của khoá, không hiểu vì sao.
 */
export default function AcademyLessonPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (typeof value === 'string') qs.set(key, value);
    else if (Array.isArray(value) && value[0]) qs.set(key, value[0]);
  }
  const suffix = qs.toString();
  redirect(`/courses/${params.slug}/learn${suffix ? `?${suffix}` : ''}`);
}
