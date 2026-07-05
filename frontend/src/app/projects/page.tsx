import type { Metadata } from 'next'
import ProjectsClient from './ProjectsClient';
import ProjectsBackground from '@/components/projects/ProjectsBackground';
import ProjectsAmbientField from '@/components/projects/ProjectsAmbientField';

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
 // Re-declare: this block replaces the root openGraph (incl. images).
 images: ['/opengraph-image'],
 },
 alternates: {
 canonical: 'https://cuongthai.com/projects',
 },
}

export default function ProjectsPage() {
 return (
 <div className="min-h-screen pt-20 pb-20" style={{ background: '#0a0a0f' }}>
 {/* Layered background:
 * z=0 — legacy matrix-rain canvas (kept for continuity
 * with the rest of the site)
 * z=1 — new ambient field (drifting aurora + grid + noise)
 * z=10+ — page content
 * Both layers are pointer-events:none so they never
 * intercept clicks. The ambient field respects
 * prefers-reduced-motion via its own hook.
 */}
 <ProjectsBackground />
 <ProjectsAmbientField />

 <ProjectsClient />
 </div>
 );
}
