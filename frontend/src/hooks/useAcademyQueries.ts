'use client';

import { useQuery, useQueries } from '@tanstack/react-query';
import { academyApi } from '@/lib/api';
import type { Course, Semester } from '@/types';

export const academyKeys = {
  all: ['academy'] as const,
  semesters: () => [...academyKeys.all, 'semesters'] as const,
  coursesBySemester: (semesterId: number) =>
    [...academyKeys.all, 'semester', semesterId, 'courses'] as const,
};

/**
 * Fetch all semesters. staleTime: 5 minutes — semester list rarely changes,
 * but the user still sees fresh data after a manual refresh.
 */
export function useSemesters() {
  return useQuery({
    queryKey: academyKeys.semesters(),
    queryFn: async () => {
      const res = await academyApi.getSemesters();
      return (res.data.data || []) as Semester[];
    },
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  });
}

/**
 * Fetch courses for many semesters in parallel.
 * Uses useQueries so each semester result is cached separately by id —
 * navigating to one semester and back reuses the cached list.
 */
export function useCoursesBySemesters(semesters: Semester[]) {
  return useQueries({
    queries: semesters.map((semester) => ({
      queryKey: academyKeys.coursesBySemester(semester.id),
      queryFn: async () => {
        // `gon` — trang này chỉ hiện tên/mã/ảnh/mô tả ngắn/số bài. Không có
        // nó thì mỗi kỳ kéo về cả cây chương-bài: đo thật 09/09/2026 là
        // 2.072 KB cho 50 môn, 93% là `sections` không ai đọc, và 9 request
        // song song đều mất ~2 giây vì tranh nhau ở máy chủ.
        const res = await academyApi.getCoursesBySemester(semester.id, { gon: true });
        return (res.data.data || []) as Course[];
      },
      enabled: semester.id > 0,
      staleTime: 5 * 60_000,
      gcTime: 30 * 60_000,
    })),
  });
}