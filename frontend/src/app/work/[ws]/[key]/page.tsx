'use client';

/** /work/<slug>/<KEY> ⇒ board của dự án. */

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from '@/components/work/ui';

export default function ProjectIndex() {
  const router = useRouter();
  const params = useParams<{ ws: string; key: string }>();
  useEffect(() => {
    router.replace(`/work/${params.ws}/${params.key}/board`);
  }, [router, params.ws, params.key]);
  return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
}
