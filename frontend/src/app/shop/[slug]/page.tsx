'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  CheckCircle2,
  Star,
  ShieldCheck,
  Download,
  ArrowLeft,
  Loader2,
  Users,
  Tag,
  Package,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { getProductBySlug, getProducts, mapProductFromBackend } from '@/lib/api/shop';
import StarRating from '@/components/shop/StarRating';
import ProductCard from '@/components/shop/ProductCard';
import CartDrawer from '@/components/shop/CartDrawer';
import ProductDetailTabs from '@/components/shop/ProductDetailTabs';
import type { Product } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

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

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { products, fetchProducts, isLoaded } = useProductStore();
  const addShopItem = useCartStore((state) => state.addShopItem);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const bp = await getProductBySlug(slug);
        setProduct(mapProductFromBackend(bp));

        if (!isLoaded) await fetchProducts();

        const allProds = await getProducts({ size: 100 });
        const mapped = allProds.content.map(mapProductFromBackend);
        const related = mapped
          .filter((p) => p.category === mapProductFromBackend(bp).category && p.id !== String(bp.id))
          .slice(0, 4);
        setRelatedProducts(related);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, isLoaded, fetchProducts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-darkbg pt-20 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-neon-violet" />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const discountPercent = calcDiscount(product.originalPrice, product.price);
  const totalSold = product.soldCount ?? 0;

  const c = {
    primary: '#a855f7',
    secondary: '#ec4899',
    tertiary: '#22d3ee',
    border: 'rgba(168,85,247,0.2)',
    borderLight: 'rgba(168,85,247,0.08)',
    glassBg: 'rgba(10,6,25,0.85)',
    glassBgLight: 'rgba(20,15,40,0.6)',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
  };

  return (
    <div className="min-h-screen bg-darkbg pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-neon-violet transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('shop.detail.backToShop')}
        </Link>

        {/* ── Product Hero ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-darkcard border border-darkborder group">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-neon-indigo/20 to-neon-violet/20 flex items-center justify-center">
                  <Package className="w-12 h-12 text-white/30" />
                </div>
              )}

              {/* Badges overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isHot && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                    🔥 Hot
                  </span>
                )}
                {product.isNew && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-neon-cyan to-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                    ✨ New
                  </span>
                )}
                {discountPercent > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-neon-violet text-white text-xs font-bold rounded-full shadow-lg"
                    style={{ boxShadow: `0 0 20px ${c.primary}60` }}
                  >
                    -{discountPercent}%
                  </motion.span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <span className="inline-flex items-center gap-1 text-sm font-medium text-neon-violet mb-3">
              <Tag className="w-4 h-4" />
              {product.category}
            </span>

            <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary mb-3">
              {product.name}
            </h1>

            {/* Rating + Social Proof */}
            <div className="flex flex-wrap items-center gap-4 mb-5">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
              <div className="flex items-center gap-1.5 text-sm" style={{ color: c.textMuted }}>
                <TrendingUp className="w-4 h-4" style={{ color: c.secondary }} />
                <span className="font-medium" style={{ color: c.text }}>
                  {totalSold.toLocaleString()}
                </span>
                đã bán
              </div>
              {product.stock > 0 && product.stock <= 20 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(250,204,21,0.15)', color: '#facc15' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  Chỉ còn {product.stock} sản phẩm
                </motion.div>
              )}
            </div>

            {/* ── Price Card ─────────────────────────────────────────── */}
            <div
              className="rounded-2xl p-6 mb-6 border"
              style={{ background: c.glassBgLight, borderColor: c.border }}
            >
              {discountPercent > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-4xl font-heading font-bold" style={{ color: c.primary }}>
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-lg line-through" style={{ color: c.textMuted }}>
                    {formatPrice(product.originalPrice!)}
                  </span>
                </div>
              )}

              {discountPercent > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="px-3 py-1.5 rounded-xl text-sm font-bold"
                    style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`, color: '#fff' }}
                  >
                    -{discountPercent}% OFF
                  </div>
                  <div className="text-sm" style={{ color: '#4ade80' }}>
                    Tiết kiệm {formatPrice(product.originalPrice! - product.price)}
                  </div>
                </div>
              )}

              {discountPercent === 0 && (
                <span className="text-4xl font-heading font-bold" style={{ color: c.primary }}>
                  {formatPrice(product.price)}
                </span>
              )}

              <button
                onClick={() => addShopItem(product)}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center gap-2 py-4 mt-4 font-bold rounded-xl text-base transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: product.stock === 0
                    ? '#27272a'
                    : `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
                  color: '#fff',
                  boxShadow: product.stock > 0 ? `0 4px 24px ${c.primary}50` : 'none',
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? t('shop.detail.outOfStock') : t('shop.detail.addToCart')}
              </button>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { icon: ShieldCheck, text: t('shop.detail.securePayment') },
                  { icon: Download, text: t('shop.detail.instantDownload') },
                  { icon: CheckCircle2, text: 'Bảo hành theo sản phẩm' },
                  { icon: Star, text: t('shop.detail.qualityGuarantee') },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs" style={{ color: c.textMuted }}>
                    <Icon className="w-4 h-4 shrink-0" style={{ color: c.primary }} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 border rounded-lg text-xs"
                    style={{ borderColor: c.border, color: c.textMuted }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stock + Sold visual bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs" style={{ color: c.textMuted }}>
                <span>Kho hàng</span>
                <span className="font-medium" style={{ color: product.stock > 0 ? '#4ade80' : '#f87171' }}>
                  {product.stock > 0 ? `${product.stock} sẵn có` : 'Hết hàng'}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1f2937' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="h-full rounded-full"
                  style={{ background: product.stock > 0 ? `linear-gradient(90deg, ${c.primary}, ${c.secondary})` : '#ef4444' }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Multi-Tab Content ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <ProductDetailTabs product={product} />
        </motion.div>

        {/* ── Related Products ─────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-8 border-t" style={{ borderColor: c.border }}>
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-8 flex items-center gap-3">
              <span style={{ color: c.primary }}>⟨⟩</span>
              {t('shop.detail.relatedProducts')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      <CartDrawer />
    </div>
  );
}
