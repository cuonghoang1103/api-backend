'use client';

/**
 * Dữ liệu THẬT cho trang /about.
 *
 * ⚠️ Trang /about trước đây là bản sao trang chủ CŨ, và mọi con số trên đó đều
 * gõ cứng: "Supabase DB 14ms" (dự án không dùng Supabase), "Uptime 99.97%",
 * "SonarQube A+ / Maintainability 99%" (không có SonarQube nào trong repo),
 * "50+ khách hàng". Một trang giới thiệu bản thân mà số liệu bịa thì hỏng đúng
 * thứ nó định xây.
 *
 * QUY TẮC (giống `useLandingStats`): `null` nghĩa là KHÔNG đếm được. Phải ẩn ô
 * đó đi, tuyệt đối không thay bằng 0 — "0 bài tập" là nói dối, còn không hiện
 * gì thì chỉ là thiếu.
 */
import { useEffect, useState } from 'react';

export interface AboutStats {
  exercises: number | null;
  examQuestions: number | null;
  lessons: number | null;
  courses: number | null;
  roadmapNodes: number | null;
  vocabWords: number | null;
  hanziChars: number | null;
  interviewQuestions: number | null;
  curatedRepos: number | null;
  publishedPosts: number | null;
  games: number | null;
  makerProjects: number | null;
  computedAt: string;
}

export interface PublicCvMeta {
  available: boolean;
  displayName: string;
  headline: string;
  formats: string[];
  updatedAt: string | null;
}

export function useAboutStats(): AboutStats | null {
  const [stats, setStats] = useState<AboutStats | null>(null);
  useEffect(() => {
    let alive = true;
    fetch('/api/v1/about/stats', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (alive && j?.success && j.data) setStats(j.data as AboutStats);
      })
      // Im lặng bỏ qua: thiếu số liệu thì trang vẫn phải đọc được bình thường,
      // đây không phải chỗ hiện thông báo lỗi cho khách.
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return stats;
}

/**
 * Metadata CV công khai. `null` = chưa biết (đang tải hoặc gọi hỏng) và
 * `available: false` = chủ site chưa bật. Cả hai đều PHẢI dẫn tới việc ẩn nút
 * tải — thà không có nút còn hơn có nút dẫn tới 404.
 */
export function usePublicCv(): PublicCvMeta | null {
  const [meta, setMeta] = useState<PublicCvMeta | null>(null);
  useEffect(() => {
    let alive = true;
    fetch('/api/v1/cv/public', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (alive && j?.success && j.data?.available) setMeta(j.data as PublicCvMeta);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return meta;
}

/** 12549 → "12.549" (vi) / "12,549" (en). Số chưa về thì trả chuỗi rỗng. */
export function fmt(n: number | null | undefined, locale: string): string {
  return typeof n === 'number' ? n.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN') : '';
}
