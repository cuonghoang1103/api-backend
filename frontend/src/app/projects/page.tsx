import ProjectsClient from './ProjectsClient';
import ProjectsBackground from '@/components/projects/ProjectsBackground';

export const dynamic = 'force-dynamic';

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
