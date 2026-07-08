'use client';

import { motion } from 'framer-motion';
import { useReduceAnimations } from '@/hooks/useIsTouch';
import { ShoppingCart, Eye, Flame, Sparkles, Package, TrendingUp, AlertCircle, Zap, ShieldCheck, FileCode, HardDrive, Tag } from 'lucide-react';
import Link from 'next/link';
import SmartImage from '@/components/ui/SmartImage';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
  index?: number;
  isSpotlight?: boolean;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}

function calcDiscount(original: number | undefined, current: number): number {
  if (!original || original <= current) return 0;
  return Math.round((1 - current / original) * 100);
}

// Deterministic mock metadata from product.id — no hydration issues
function getAssetMeta(id: string) {
  const seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const downloads = 120 + (seed % 680);
  const sizeKb = 8 + (seed % 32);
  const licenses = ['MIT', 'Apache 2.0', 'CC BY-SA 4.0', 'Custom EULA'];
  const formats = ['Next.js 14+ Component', 'React 18 Hook', 'Full-Stack Template', 'API Blueprint', 'TypeScript SDK'];
  return {
    downloads,
    sizeKb,
    license: licenses[seed % licenses.length],
    format: formats[seed % formats.length],
  };
}

const c = {
  primary: '#a855f7',
  secondary: '#ec4899',
  tertiary: '#22d3ee',
  border: 'rgba(168,85,247,0.2)',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
};

// ── Micro File Preview ──────────────────────────────────────────────────────────
function MicroFilePreview({ product, meta, isSpotlight }: { product: Product; meta: ReturnType<typeof getAssetMeta>; isSpotlight?: boolean }) {
  const hasThumb = !!product.thumbnail;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        aspectRatio: isSpotlight ? '21/7' : '4/3',
        background: hasThumb ? undefined : 'rgba(13,11,23,0.95)',
        borderRadius: isSpotlight ? '0' : undefined,
      }}
    >
      {hasThumb ? (
        <SmartImage
          src={product.thumbnail}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: isSpotlight ? 'brightness(0.7)' : undefined }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Package className="w-10 h-10 text-white/10" />
        </div>
      )}

      {/* Overlay for file-preview look */}
      <div
        className="absolute inset-0"
        style={{
          background: hasThumb
            ? 'linear-gradient(to bottom, rgba(13,11,23,0.3) 0%, rgba(13,11,23,0.7) 100%)'
            : 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(13,11,23,0.95) 100%)',
        }}
      />

      {/* Top badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
        {product.isHot && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[11px] font-bold rounded-full shadow-lg">
            <Flame className="w-3 h-3" /> Hot
          </span>
        )}
        {product.isNew && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-neon-cyan to-blue-500 text-white text-[11px] font-bold rounded-full shadow-lg">
            <Sparkles className="w-3 h-3" /> New
          </span>
        )}
      </div>

      {/* Discount */}
      {calcDiscount(product.originalPrice, product.price) > 0 && (
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-black text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
            boxShadow: `0 0 16px ${c.primary}80`,
          }}
        >
          -{calcDiscount(product.originalPrice, product.price)}%
        </div>
      )}

      {/* Asset metadata overlay — file-preview style */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 py-2"
        style={{
          background: 'rgba(13,11,23,0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: `1px solid ${c.border}`,
        }}
      >
        <div className="flex items-center gap-3 text-[10px] font-mono overflow-hidden">
          <span className="flex items-center gap-0.5 shrink-0" style={{ color: c.tertiary }}>
            <FileCode className="w-3 h-3" />
            {meta.format}
          </span>
          <span className="flex items-center gap-0.5 shrink-0" style={{ color: '#94a3b8' }}>
            <HardDrive className="w-3 h-3" />
            ~{meta.sizeKb}KB
          </span>
          <span className="flex items-center gap-0.5 shrink-0" style={{ color: '#94a3b8' }}>
            <Tag className="w-3 h-3" />
            {meta.license}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Trust Badges ───────────────────────────────────────────────────────────────
function TrustBadges({ meta }: { meta: ReturnType<typeof getAssetMeta> }) {
  const reduce = useReduceAnimations();
  return (
    <div className="flex items-center gap-3 pt-2.5 border-t" style={{ borderColor: `${c.border}40` }}>
      {/* Download counter */}
      <div className="flex items-center gap-1 text-[11px]" style={{ color: '#fbbf24' }}>
        <Zap className="w-3 h-3 fill-current" />
        <span className="font-semibold">{meta.downloads.toLocaleString()}+</span>
        <span style={{ color: c.textMuted }}>Downloads</span>
      </div>

      {/* Verified Build LED */}
      <div className="flex items-center gap-1 text-[11px]" style={{ color: '#4ade80' }}>
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#4ade80', boxShadow: '0 0 6px #4ade80' }}
          animate={reduce ? undefined : { scale: [1, 1.3, 1], opacity: [0.8, 0.4, 0.8] }}
          transition={reduce ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="font-mono font-medium">Verified Build</span>
      </div>

      {/* License chip */}
      <div
        className="ml-auto text-[9px] px-1.5 py-0.5 rounded font-mono"
        style={{ background: `${c.primary}10`, color: `${c.primary}90`, border: `1px solid ${c.primary}20` }}
      >
        {meta.license}
      </div>
    </div>
  );
}

// ── Spotlight Card ─────────────────────────────────────────────────────────────
function SpotlightCard({ product, meta }: { product: Product; meta: ReturnType<typeof getAssetMeta> }) {
  const reduce = useReduceAnimations();
  const addShopItem = useCartStore((s) => s.addShopItem);
  const discountPercent = calcDiscount(product.originalPrice, product.price);
  const safeStock = product.stock ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-span-full group relative"
    >
      <Link href={`/shop/${product.slug}`}>
        <div
          className="relative overflow-hidden rounded-2xl border"
          style={{
            background: 'rgba(13,11,23,0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderColor: `${c.primary}40`,
            boxShadow: `0 0 60px rgba(168,85,247,0.12), 0 0 100px rgba(168,85,247,0.06)`,
          }}
        >
          {/* Bestseller neon tag */}
          <motion.div
            className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
            style={{
              background: `linear-gradient(135deg, rgba(168,85,247,0.25), rgba(168,85,247,0.1))`,
              border: `1px solid ${c.primary}60`,
              color: '#e879f9',
              boxShadow: `0 0 20px ${c.primary}40, 0 0 40px ${c.primary}20`,
              textShadow: '0 0 12px #e879f9',
            }}
            animate={reduce ? undefined : { boxShadow: [`0 0 20px ${c.primary}40`, `0 0 40px ${c.primary}60`, `0 0 20px ${c.primary}40`] }}
            transition={reduce ? undefined : { duration: 3, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-red-400"
              style={{ boxShadow: '0 0 8px #f87171' }}
              animate={reduce ? undefined : { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={reduce ? undefined : { duration: 1, repeat: Infinity }}
            />
            BESTSELLER ARCHITECTURE
          </motion.div>

          {/* Left content panel */}
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/5 relative" style={{ minHeight: '240px' }}>
              {product.thumbnail ? (
                <SmartImage
                  src={product.thumbnail}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-neon-indigo/20 to-neon-violet/20 flex items-center justify-center">
                  <Package className="w-12 h-12 text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-darkbg/60 md:block hidden" />
            </div>

            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: c.primary }}>
                  {product.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-primary leading-tight mb-3 group-hover:text-neon-violet transition-colors">
                  {product.name}
                </h2>
                <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed max-w-2xl">
                  {product.description}
                </p>
              </div>

              <div className="flex flex-wrap items-end gap-6">
                <div>
                  {discountPercent > 0 ? (
                    <div className="flex items-end gap-3">
                      <p className="text-3xl font-heading font-bold leading-none" style={{ color: c.primary, textShadow: `0 0 20px ${c.primary}60` }}>
                        {formatPrice(product.price)}
                      </p>
                      <div className="flex flex-col gap-0.5 pb-0.5">
                        <span className="text-sm line-through" style={{ color: c.textMuted }}>
                          {formatPrice(product.originalPrice!)}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${c.primary}15`, color: c.primary }}>
                          -{discountPercent}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-3xl font-heading font-bold leading-none" style={{ color: c.primary }}>
                      {formatPrice(product.price)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
                  <span className="text-sm" style={{ color: c.textMuted }}>
                    {product.soldCount?.toLocaleString() ?? 0} đã bán
                  </span>
                </div>
              </div>

              {/* Asset meta row */}
              <div className="flex items-center gap-4 text-[11px] font-mono" style={{ color: '#94a3b8' }}>
                <span className="flex items-center gap-0.5"><FileCode className="w-3 h-3" style={{ color: c.tertiary }} />{meta.format}</span>
                <span className="flex items-center gap-0.5"><HardDrive className="w-3 h-3" />~{meta.sizeKb}KB</span>
                <span className="flex items-center gap-0.5"><Zap className="w-3 h-3" style={{ color: '#fbbf24' }} />{meta.downloads}+ DL</span>
                <span className="flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" style={{ color: '#4ade80' }} />Verified</span>
              </div>
            </div>
          </div>

          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${c.primary}, ${c.secondary}, transparent)`,
              opacity: 0.7,
            }}
          />
        </div>
      </Link>

      {/* CTA row below spotlight */}
      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={() => addShopItem(product)}
          disabled={safeStock === 0}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: safeStock === 0 ? '#1f2937' : `${c.primary}15`,
            border: `1px solid ${c.primary}50`,
            color: c.primary,
            boxShadow: `0 0 15px rgba(139,92,246,0.3)`,
          }}
        >
          <span className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            {safeStock === 0 ? 'Hết hàng' : 'Mua ngay'}
          </span>
        </button>
        <Link href={`/shop/${product.slug}`}>
          <button className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border"
            style={{
              borderColor: `${c.border}`,
              color: c.textSecondary,
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Xem chi tiết
            </span>
          </button>
        </Link>
        <TrustBadges meta={meta} />
      </div>
    </motion.div>
  );
}

// ── Standard Card ─────────────────────────────────────────────────────────────
export default function ProductCard({ product, index = 0, isSpotlight }: ProductCardProps) {
  if (isSpotlight) {
    return <SpotlightCard product={product} meta={getAssetMeta(product.id)} />;
  }

  const addShopItem = useCartStore((s) => s.addShopItem);
  const discountPercent = calcDiscount(product.originalPrice, product.price);
  const safeStock = product.stock ?? 0;
  const safeSold = product.soldCount ?? 0;
  const meta = getAssetMeta(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      className="group relative"
    >
      <div
        className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden hover:border-neon-violet/50 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
        style={{ boxShadow: 'none' }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px rgba(168,85,247,0.12), 0 8px 30px rgba(0,0,0,0.3)`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        }}
      >
        {/* Micro File Preview thumbnail */}
        <Link href={`/shop/${product.slug}`} className="block relative">
          <MicroFilePreview product={product} meta={meta} />

          {/* Hover quick-view overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <div className="flex items-center gap-2 px-5 py-2 bg-white/95 backdrop-blur-md text-darkbg rounded-full text-sm font-semibold hover:bg-white transition-colors">
              <Eye className="w-4 h-4" />
              Xem chi tiết
            </div>
          </div>

          {/* Sold-out overlay */}
          {safeStock === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="px-5 py-2.5 bg-darkcard/90 border border-darkborder rounded-full font-bold text-sm" style={{ color: c.textMuted }}>
                Hết hàng
              </span>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: c.primary }}>
            {product.category}
          </span>

          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-heading font-bold text-text-primary text-sm leading-snug line-clamp-2 hover:text-neon-violet transition-colors mb-2 flex-1">
              {product.name}
            </h3>
          </Link>

          <StarRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />

          {/* Price row */}
          <div className="flex items-end justify-between mt-3 mb-2">
            <div className="flex flex-col gap-0.5">
              {discountPercent > 0 ? (
                <>
                  <p className="text-lg font-heading font-bold leading-none" style={{ color: c.primary, textShadow: `0 0 16px ${c.primary}60` }}>
                    {formatPrice(product.price)}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs line-through" style={{ color: c.textMuted }}>{formatPrice(product.originalPrice!)}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: `${c.primary}15`, color: c.primary }}>-{discountPercent}%</span>
                  </div>
                </>
              ) : (
                <p className="text-lg font-heading font-bold leading-none" style={{ color: c.primary }}>
                  {formatPrice(product.price)}
                </p>
              )}
            </div>

            <button
              onClick={() => addShopItem(product)}
              disabled={safeStock === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: safeStock === 0 ? '#1f2937' : `${c.primary}15`,
                border: `1px solid ${c.primary}40`,
                color: c.primary,
              }}
              onMouseEnter={(e) => {
                if (safeStock > 0) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 15px rgba(139,92,246,0.5)`;
                  (e.currentTarget as HTMLButtonElement).style.background = `${c.primary}25`;
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLButtonElement).style.background = safeStock === 0 ? '#1f2937' : `${c.primary}15`;
              }}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {safeStock === 0 ? 'Hết hàng' : 'Mua'}
            </button>
          </div>

          {/* Trust Badges */}
          <TrustBadges meta={meta} />

          {/* Stock bar */}
          {safeStock > 0 && (
            <div className="mt-2">
              <div className="h-1 rounded-full overflow-hidden" style={{ background: '#1f2937' }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (safeStock / 100) * 100)}%` }}
                  transition={{ delay: 0.1 + index * 0.06, duration: 0.5 }}
                  style={{ background: `linear-gradient(90deg, ${c.primary}, ${c.secondary})` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
