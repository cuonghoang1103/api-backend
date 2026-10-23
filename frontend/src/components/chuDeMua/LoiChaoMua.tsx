'use client';

/**
 * Một dòng chào / đếm ngược theo mùa (Noel, Tết…) — giống đầu trang Hôm nay bên iOS.
 * Mặc định (không có data-mua) ⇒ không vẽ gì.
 */

import { Flower2, Gift, Leaf, Snowflake, Sparkles, Sun } from 'lucide-react';
import { useDomChuDe } from '@/lib/chuDeMua/useChuDeMua';
import { loiMua, type BieuTuongLoi, type Mua } from '@/lib/chuDeMua/logic';

const ICON: Record<BieuTuongLoi, typeof Gift> = {
  gift: Gift, sparkles: Sparkles, snowflake: Snowflake, flower: Flower2, sun: Sun, leaf: Leaf,
};

/** `nenToi` — đặt trên một mảng nền tối cố định (vd. /dashboard) thay vì nền theo theme. */
export default function LoiChaoMua({ className = '', nenToi = false }: { className?: string; nenToi?: boolean }) {
  const { mua } = useDomChuDe();
  const loi = loiMua((mua as Mua | null) ?? null);
  if (!loi) return null;
  const Icon = ICON[loi.bieuTuong];
  return (
    <p
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}
      style={nenToi
        ? { color: '#f8fafc', borderColor: 'rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.06)' }
        : { color: 'var(--accent-color)', borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {loi.chu}
    </p>
  );
}
