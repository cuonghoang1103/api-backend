'use client';

/**
 * /work/search — tìm thẻ ở mọi dự án (Basic | JQL). Trang đọc ?jql= / ?q=
 * bằng useSearchParams ⇒ cần Suspense.
 */

import { Suspense } from 'react';
import GlobalSearchPage from '@/components/work/globalsearch/SearchPage';
import { PageLoading } from '@/components/work/ui';

export default function WorkSearchRoute() {
  return (
    <Suspense fallback={<PageLoading />}>
      <GlobalSearchPage />
    </Suspense>
  );
}
