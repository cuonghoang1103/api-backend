import type { Metadata } from 'next';
import RoadmapLanding from '@/components/roadmap/RoadmapLanding';

export const metadata: Metadata = {
  title: 'RoadMap — Learning paths by role & skill',
  description:
    'Step-by-step developer learning paths: Frontend, Backend, DevOps, Python, React, Node.js, SQL, DSA… Click any stage to see details and start learning. English/Vietnamese.',
};

export default function RoadmapPage() {
  return <RoadmapLanding />;
}
