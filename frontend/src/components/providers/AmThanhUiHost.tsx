'use client';

/**
 * Gắn âm thanh giao diện (nút, công tắc, hộp thoại, toast) cho CẢ trang — một
 * lần ở layout gốc. Xem `lib/amThanhUi.ts`. Không vẽ gì.
 */
import { useEffect } from 'react';
import { ganTuDong } from '@/lib/amThanhUi';

export default function AmThanhUiHost() {
  useEffect(() => ganTuDong(), []);
  return null;
}
