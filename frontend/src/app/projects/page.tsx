import type { Metadata } from 'next'
import ProjectsClient from './ProjectsClient';
import ProjectsBackground from '@/components/projects/ProjectsBackground';

export const dynamic = 'force-dynamic';

// Per-page metadata. The `%s | CuongThai` template from the root
// layout fills in `%s`, so this page's <title> becomes
// "My Projects | CuongThai". The description overrides the root
// default, and we mark the page as indexable (the root robots
// config already allows it, but being explicit is cheap).
export const metadata: Metadata = {
  title: 'My Projects',
  description:
    'A curated showcase of products and tools built by Cuong Hoang — ' +
    'web apps, dev tooling, AI integrations, and side projects.',
  openGraph: {
    title: 'My Projects | CuongThai',
    description:
      'A curated showcase of products and tools built by Cuong Hoang.',
    url: 'https://cuongthai.com/projects',
  },
  alternates: {
    canonical: 'https://cuongthai.com/projects',
  },
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: '#0a0a0f' }}>
      <ProjectsBackground />

      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-text-primary mb-6">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-indigo via-neon-violet to-neon-fuchsia">Projects</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Products I have built throughout my learning and development journey
          </p>
        </div>
      </section>

      <ProjectsClient />
    </div>
  );
}
