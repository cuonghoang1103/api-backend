'use client';

/**
 * Dấu "DONE" trên thẻ khoá — khoá đã đủ cả bộ (slide · bài giảng · video · Code Lab · quiz chương · đề), học được
 * trọn vẹn. Cùng kiểu với dấu "Verified by CuongThai" của Code Lab (viền xanh, BadgeCheck, chữ hoa) theo mẫu chủ
 * trang chọn 09/11; nền tối mờ để nổi trên ảnh bìa. Nguồn: `lib/khoaDu100.ts`.
 */
import { BadgeCheck } from 'lucide-react';
import { khoaDu100 } from '@/lib/khoaDu100';

export default function HuyHieuDu100({ slug, className = '' }: { slug: string | null | undefined; className?: string }) {
  const k = khoaDu100(slug);
  if (!k) return null;
  const tip = `Đủ slide, bài giảng, video, Code Lab, quiz từng chương và đề thi — kiểm ngày ${k.ngay}${k.ghiChu ? ` · ${k.ghiChu}` : ''}`;
  return (
    <span
      title={tip}
      aria-label="Khoá đã hoàn thiện"
      className={`inline-flex items-center gap-1 rounded-full font-semibold uppercase backdrop-blur-sm ${className}`}
      style={{
        color: '#34d399',
        background: 'rgba(6, 24, 18, 0.72)',
        border: '1px solid rgba(52, 211, 153, 0.6)',
        fontSize: 10.5,
        letterSpacing: 0.5,
        padding: '3px 9px',
        lineHeight: 1.1,
      }}
    >
      <BadgeCheck size={13} strokeWidth={2.4} aria-hidden />
      Done
    </span>
  );
}
