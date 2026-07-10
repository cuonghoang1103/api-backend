import { redirect } from 'next/navigation';

// Legacy route. The academy catalog used to have its own course-detail
// implementation (components/academy/CourseDetailClient) which drifted from
// the canonical /courses/[slug] page — it predates the admin direct-access
// logic, the course-level documents area and the SEO server page, so users
// landing here (old bookmarks, in-app legacy links) saw stale behaviour
// like "already enrolled" dead-ends. Its /learn subroute has redirected to
// the canonical learn page for a while; do the same for the detail page.
export const dynamic = 'force-dynamic';

export default function LegacyAcademyCourseDetail({ params }: { params: { slug: string } }) {
  redirect(`/courses/${params.slug}`);
}
