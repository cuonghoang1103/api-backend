import nextDynamic from 'next/dynamic';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const CourseDetailClient = nextDynamic(
  () => import('@/components/academy/CourseDetailClient'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-darkbg pt-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-neon-violet border-t-transparent rounded-full animate-spin" />
        <p className="text-text-muted mt-4">Đang tải...</p>
      </div>
    ),
  }
);

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  return <CourseDetailClient slug={params.slug} />;
}
