'use client';

import { useQuery } from '@tanstack/react-query';
import { workApi } from '@/lib/work-api';
import { wk } from '../hooks';

/**
 * Mẫu mô tả đang hiệu lực của mọi loại thẻ trong dự án. Khoá nằm dưới
 * wk.project ⇒ admin sửa mẫu (project.updated) là mọi người thấy ngay.
 */
export function useIssueTemplates(pid: number, enabled = true) {
  return useQuery({
    queryKey: wk.issueTemplates(pid),
    queryFn: () => workApi.issueTemplates(pid),
    enabled: enabled && !!pid,
    staleTime: 5 * 60_000,
  });
}
