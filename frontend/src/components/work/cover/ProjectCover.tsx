'use client';

/**
 * UX-D — dải ảnh bìa dự án (thẻ dự án, đầu trang, cổng khách, xem trước trong cài đặt).
 * Ảnh là nền `cover`, điểm lấy nét dọc theo `coverPositionY` (%). Không có bìa ⇒ dải màu của dự án.
 * Thuần trang trí: aria-hidden (tên dự án luôn có chữ ở cạnh).
 */
import { coverSrc } from '@/lib/work-covers';
import { avatarColor } from '../ui';
import { cn } from '@/lib/utils';

export interface CoverBrand { key: string; coverUrl?: string | null; coverPositionY?: number | null; color?: string | null }

export function coverBackground(b: CoverBrand): React.CSSProperties {
  const src = coverSrc(b.coverUrl);
  const color = b.color || avatarColor(b.key);
  if (!src) return { background: `linear-gradient(135deg, ${color} 0%, color-mix(in srgb, ${color} 55%, #000) 100%)` };
  return { backgroundColor: color, backgroundImage: `url("${src.replace(/"/g, '%22')}")`, backgroundSize: 'cover', backgroundPosition: `50% ${b.coverPositionY ?? 50}%` };
}

export default function ProjectCover({ brand, className, children }: { brand: CoverBrand; className?: string; children?: React.ReactNode }) {
  return (
    <div aria-hidden={children ? undefined : true} className={cn('relative overflow-hidden', className)} style={coverBackground(brand)} data-testid="project-cover">
      {children}
    </div>
  );
}
