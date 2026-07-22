import type { Metadata } from 'next';
import RoadmapLanding from '@/components/roadmap/RoadmapLanding';

export const metadata: Metadata = {
  title: 'RoadMap — Lộ trình học theo vai trò & kỹ năng',
  description:
    'Lộ trình học lập trình từng bước: Frontend, Backend, DevOps, Python, React, Node.js, SQL, DSA… Bấm từng chặng để xem chi tiết và học ngay.',
};

export default function RoadmapPage() {
  return <RoadmapLanding />;
}
