'use client';

/**
 * Đồng hồ đếm ngược trong khoảng IM LẶNG đọc câu hỏi của bài nghe (03/10/2026).
 * Không có nó, 20–30 giây im lặng sau "First, you have … seconds" trông như bài
 * nghe bị đứng — người dùng báo đúng điều đó. `onBoQua` = vào nghe ngay.
 */
import { useEffect, useState } from 'react';
import s from './course.module.css';

export function DemDocCau({ het, onBoQua }: { het: number; onBoQua?: () => void }) {
  const [con, setCon] = useState(() => Math.max(0, Math.ceil((het - Date.now()) / 1000)));
  useEffect(() => {
    const t = setInterval(() => setCon(Math.max(0, Math.ceil((het - Date.now()) / 1000))), 250);
    return () => clearInterval(t);
  }, [het]);
  return (
    <div className={s.demDoc} role="timer" aria-live="polite">
      <span>⏳ Thời gian đọc câu hỏi bên dưới: còn <b>{con}</b> giây — hết giờ bài nghe tự bắt đầu</span>
      {onBoQua && <button type="button" className={s.btn} onClick={onBoQua}>▶ Nghe ngay</button>}
    </div>
  );
}
