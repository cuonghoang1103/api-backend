'use client';

/**
 * Con robot CuongMini — đúng hình người học đã quen ở nút nổi góc màn hình
 * (khung tím, mặt robot xanh ngọc), thu nhỏ để gắn vào từng câu quiz.
 *
 * Vẽ bằng SVG trong mã chứ không dùng ảnh, vì hai lẽ:
 *  • app desktop dùng lại `ChapterQuiz` và chạy ở origin `app://cuongthai` —
 *    đường `/robot-avatar.png` không tồn tại ở đó, ảnh vỡ câm;
 *  • đề luyện có tới 210 câu, mỗi câu một nút: ảnh thì mỗi nút một lần tải.
 *
 * `useId` cho id của gradient: hai con robot trên cùng trang mà trùng id thì
 * con thứ hai lấy nhầm gradient của con đầu (hoặc mất màu khi con đầu bị gỡ).
 */
import { useId } from 'react';

export default function RobotAI({ size = 28, dangNghi = false, className }: {
  size?: number;
  /** Đang chờ AI trả lời → mắt nhấp nháy. */
  dangNghi?: boolean;
  className?: string;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <linearGradient id={`rbn${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="0.55" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#c026d3" />
        </linearGradient>
        <linearGradient id={`rbd${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ecfeff" />
          <stop offset="1" stopColor="#67e8f9" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="48" height="48" rx="13" fill={`url(#rbn${id})`} />
      {/* ăng-ten */}
      <line x1="24" y1="10" x2="24" y2="14.5" stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="8.6" r="2.3" fill="#a5f3fc" />
      {/* tai */}
      <rect x="8.4" y="21" width="3.2" height="7.5" rx="1.6" fill="#a5f3fc" />
      <rect x="36.4" y="21" width="3.2" height="7.5" rx="1.6" fill="#a5f3fc" />
      {/* đầu + kính */}
      <rect x="11" y="14" width="26" height="21.5" rx="10" fill={`url(#rbd${id})`} />
      <rect x="14.5" y="19.2" width="19" height="10.4" rx="5.2" fill="#0f172a" />
      <g className={dangNghi ? 'animate-pulse' : undefined}>
        <circle cx="20" cy="24.4" r="2.1" fill="#67e8f9" />
        <circle cx="28" cy="24.4" r="2.1" fill="#67e8f9" />
      </g>
      {/* thân */}
      <rect x="17.5" y="36.4" width="13" height="4.6" rx="2.3" fill="#a5f3fc" opacity="0.9" />
    </svg>
  );
}
