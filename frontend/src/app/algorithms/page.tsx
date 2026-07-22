import type { Metadata } from 'next';
import AlgorithmVisualizer from '@/components/algorithms/AlgorithmVisualizer';

const SITE_URL = 'https://cuongthai.com';

export const metadata: Metadata = {
  title: 'Algorithm Visualizer — Learn algorithms visually',
  description:
    'Watch sorting, searching and more algorithms animate step by step. Edit the code and re-run — it executes safely in your browser.',
  alternates: { canonical: `${SITE_URL}/algorithms` },
  openGraph: {
    title: 'Algorithm Visualizer',
    description: 'Watch algorithms animate step by step and edit the code live.',
    url: `${SITE_URL}/algorithms`,
    type: 'website',
  },
};

export default function AlgorithmsPage() {
  return (
    <div className="min-h-screen py-4">
      <AlgorithmVisualizer />
    </div>
  );
}
