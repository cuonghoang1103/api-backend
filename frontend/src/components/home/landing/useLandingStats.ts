'use client';

/**
 * Số liệu THẬT cho trang chủ, lấy từ `GET /api/v1/landing/stats`.
 *
 * ⚠️ Trang chủ trước đây gõ cứng "8k+ câu hỏi phỏng vấn", "4k+ chữ Hán",
 * "12+ module". Không con số nào trong đó được đếm từ đâu cả — chúng sai âm
 * thầm ngay khi nội dung tăng, mà nội dung site này tăng liên tục.
 *
 * QUY TẮC: giá trị `null` nghĩa là KHÔNG đếm được. Phải ẩn ô đó đi, tuyệt đối
 * không thay bằng 0 — "0 bài tập" là nói dối, còn không hiện gì thì chỉ là
 * thiếu. Component dùng hook này phải lọc null trước khi vẽ.
 */
import { useEffect, useState } from 'react';

export interface LandingStats {
  exercises: number | null;
  tracks: number | null;
  modules: number | null;
  subjects: number | null;
  roadmapNodes: number | null;
  examQuestions: number | null;
  vocabWords: number | null;
  hanziChars: number | null;
  computedAt: string;
}

export function useLandingStats() {
  const [stats, setStats] = useState<LandingStats | null>(null);

  useEffect(() => {
    let alive = true;
    fetch('/api/v1/landing/stats', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (alive && j?.success && j.data) setStats(j.data as LandingStats);
      })
      // Im lặng bỏ qua: thiếu số liệu thì trang chủ vẫn phải đọc được bình
      // thường, không phải chỗ để hiện thông báo lỗi cho khách.
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return stats;
}

/** 11461 → "11,461". Số chưa về thì trả chuỗi rỗng để chỗ gọi tự ẩn đi. */
export function fmt(n: number | null | undefined): string {
  return typeof n === 'number' ? n.toLocaleString('en-US') : '';
}
