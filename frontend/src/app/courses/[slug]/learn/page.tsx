import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LearnPageClient from './LearnPageClient';

export const dynamic = 'force-dynamic';

export default function LearnPageWrapper({ params }: { params: { slug: string } }) {
  // The /learn route was hanging in a permanent spinner because
  // the client component gated on a multi-source auth signal
  // (Zustand rehydrate + useSession + mounted flag) and one of
  // those signals could stay 'false' indefinitely — typically
  // when the httpOnly backend_token cookie is present but the
  // localStorage copy of the Zustand user object is missing
  // (e.g. user opened a new tab in incognito, or the store
  // was wiped). In that case isAuthReady never flipped true
  // and the effect never called loadCourse.
  //
  // Fix: do the auth check on the server. We read the
  // backend_token httpOnly cookie directly — that's the same
  // cookie the API client already sends, so its presence
  // is the source of truth. If the cookie is missing we
  // redirect to /login with a callback. If it is present we
  // hand off to the client component, which can rely on the
  // API client to surface 401s itself without needing the
  // dual auth signal.
  const cookieStore = cookies();
  const token = cookieStore.get('backend_token')?.value;
  if (!token) {
    const callback = encodeURIComponent(`/courses/${params.slug}/learn`);
    redirect(`/login?callbackUrl=${callback}`);
  }
  return <LearnPageClient slug={params.slug} />;
}
