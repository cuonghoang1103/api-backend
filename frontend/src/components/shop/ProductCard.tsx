'use client';

import { motion } from 'framer-motion';
import { useReduceAnimations } from '@/hooks/useIsTouch';
import { ShoppingCart, Flame, Sparkles, Package, Check, Eye, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SmartImage from '@/components/ui/SmartImage';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
  index?: number;
  isSpotlight?: boolean;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);
}
function calcDiscount(original: number | undefined, current: number): number {
  if (!original || original <= current) return 0;
  return Math.round((1 - current / original) * 100);
}
// The card feature checklist comes from the product description, one item per
// line (admins write features line-by-line). Strip common bullet markers.
function featureLines(desc: string | undefined): string[] {
  return (desc || '')
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*(?:[-•*]|✅|✓)\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 4);
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const reduce = useReduceAnimations();
  const router = useRouter();
  const addShopItem = useCartStore((s) => s.addShopItem);

  const discount = calcDiscount(product.originalPrice, product.price);
  const features = featureLines(product.description);
  const isPhysical = product.productType === 'PHYSICAL';
  const outOfStock = isPhysical && product.stock <= 0;
  const href = `/shop/${product.slug}`;

  const buyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!outOfStock) { addShopItem(product); router.push('/checkout'); }
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={reduce ? undefined : { y: -6 }}
      className="group relative h-full"
    >
      <Link
        href={href}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border transition-all"
        style={{
          background: 'linear-gradient(165deg, rgba(23,20,38,0.92), rgba(12,10,22,0.94))',
          borderColor: 'rgba(168,85,247,0.18)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        }}
      >
        {/* hover glow ring */}
        <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: '0 0 0 1px rgba(168,85,247,0.45), 0 18px 50px rgba(124,58,237,0.28)' }} />

        {/* ── Media ── */}
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden" style={{ background: 'radial-gradient(120% 120% at 50% 0%, rgba(99,102,241,0.18), rgba(10,8,20,0.9))' }}>
            {product.thumbnail ? (
              <SmartImage src={product.thumbnail} alt={product.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center"><Package className="h-10 w-10 text-white/25" /></div>
            )}
            {/* top badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.isHot && (
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow" style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)' }}>
                  <Flame className="h-3 w-3" /> Hot
                </span>
              )}
              {product.isNew && (
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow" style={{ background: 'linear-gradient(135deg,#22d3ee,#3b82f6)' }}>
                  <Sparkles className="h-3 w-3" /> New
                </span>
              )}
            </div>
            {/* discount + category */}
            <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
              {discount > 0 && (
                <span className="rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
                  -{discount}%
                </span>
              )}
              {product.category && (
                <span className="rounded-md px-2 py-0.5 text-[10px] font-medium text-neon-violet backdrop-blur-sm" style={{ background: 'rgba(168,85,247,0.14)' }}>
                  {product.category}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 min-h-[2.6rem] text-[15px] font-heading font-bold leading-snug text-text-primary transition-colors group-hover:text-neon-violet">
            {product.name}
          </h3>

          {/* Rating */}
          {(product.reviewCount ?? 0) > 0 && (
            <div className="mt-1 flex items-center gap-1 text-xs text-text-muted">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-text-secondary">{(product.rating ?? 0).toFixed(1)}</span>
              <span>({product.reviewCount})</span>
            </div>
          )}

          {/* Feature checklist */}
          {features.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                  <span className="line-clamp-1">{f}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Price */}
          <div className="mt-4 flex items-end gap-2">
            <span className="text-xl font-heading font-bold text-neon-violet">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="mb-0.5 text-xs text-text-muted line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-3 flex gap-2">
            <span
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all group-hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow: '0 6px 18px rgba(124,58,237,0.35)' }}
            >
              <Eye className="h-4 w-4" /> Xem sản phẩm
            </span>
            <button
              onClick={buyNow}
              disabled={outOfStock}
              title={outOfStock ? 'Hết hàng' : 'Mua ngay'}
              className="flex items-center justify-center rounded-xl border px-3 transition-colors hover:bg-white/5 disabled:opacity-40"
              style={{ borderColor: 'rgba(168,85,247,0.3)', color: '#a855f7' }}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
          {outOfStock && <p className="mt-2 text-center text-[11px] font-medium text-red-400">Tạm hết hàng</p>}
        </div>
      </Link>
    </motion.div>
  );
}
