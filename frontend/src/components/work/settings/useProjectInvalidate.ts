'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wk } from '../hooks';

/** Sau khi sửa cấu hình dự án: tải lại cấu hình + bảng dự án của không gian. */
export function useProjectInvalidate(pid: number, slug: string) {
  const qc = useQueryClient();
  return useCallback(() => {
    qc.invalidateQueries({ queryKey: wk.project(pid) });
    qc.invalidateQueries({ queryKey: wk.workspace(slug) });
  }, [qc, pid, slug]);
}
