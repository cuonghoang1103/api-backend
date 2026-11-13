'use client';

import { startTransition } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Nút "Thử lại" của error.tsx (13/11/2026). Chỉ gọi `reset()` thì React vẽ lại phân đoạn ở PHÍA TRÌNH DUYỆT với dữ
 * liệu Server Component CŨ ⇒ lỗi phát sinh ở máy chủ (API chập chờn, DB chậm) bấm bao nhiêu lần vẫn lỗi (đo ở khoá
 * Next.js 8.2). `router.refresh()` xin lại dữ liệu máy chủ, `reset()` gỡ ranh giới lỗi — gói chung trong
 * startTransition để hai việc về cùng một lượt vẽ. Lỗi phía trình duyệt thì refresh vô hại.
 */
export function useThuLai(reset: () => void): () => void {
  const router = useRouter();
  return () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };
}
