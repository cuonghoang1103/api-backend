import type { Metadata } from 'next';
import RoadmapDetail from '@/components/roadmap/RoadmapDetail';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const name = params.slug.replace(/-/g, ' ');
  return {
    title: `Lộ trình ${name} — RoadMap`,
    description: `Lộ trình học ${name} từng bước, đánh dấu tiến độ và học ngay trong Code Lab.`,
  };
}

export default function RoadmapDetailPage({ params }: { params: { slug: string } }) {
  return <RoadmapDetail slug={params.slug} />;
}
