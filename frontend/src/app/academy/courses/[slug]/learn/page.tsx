import { redirect } from 'next/navigation';

export default function AcademyLessonPage({ params }: { params: { slug: string } }) {
  redirect(`/courses/${params.slug}/learn`);
}
