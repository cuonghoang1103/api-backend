'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Clock, Star, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Gauge } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import ProductFilter from '@/components/shop/ProductFilter';
import CartDrawer from '@/components/shop/CartDrawer';
import ShopBackground from '@/components/shop/ShopBackground';
import DigitalShopTermsGate from '@/components/shop/DigitalShopTermsGate';
import { useProductStore } from '@/store/productStore';
import type { PriceRange, SortOption } from '@/types';
import { getCategories, type CategoryResponse } from '@/lib/api/shop';
import { useTranslation } from '@/hooks/useTranslation';

export default function ShopPage() {
  const { t } = useTranslation();
  const { products, fetchProducts, isLoaded } = useProductStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    setMounted(true);
    if (!isLoaded) {
      fetchProducts();
    }
    getCategories().then(setCategories).catch(() => {});
  }, []);

  // Dynamic category chips: "Tất cả" + admin-managed categories, filtered by
  // category NAME (which is what the mapped product carries).
  const categoryOptions = useMemo(
    () => [{ value: 'all', label: 'Tất cả' }, ...categories.map((c) => ({ value: c.name, label: c.name }))],
    [categories],
  );

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    if (priceRange === 'under200') {
      result = result.filter((p) => p.price < 200000);
    } else if (priceRange === '200to500') {
      result = result.filter((p) => p.price >= 200000 && p.price <= 500000);
    } else if (priceRange === 'above500') {
      result = result.filter((p) => p.price > 500000);
    }

    switch (sort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        break;
      case 'newest':
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
        break;
    }

    return result;
  }, [products, search, category, priceRange, sort]);

  if (!mounted) {
    // Skeleton grid (FB-style) instead of a bare spinner so the product
    // layout is mirrored before hydration — no white flash / layout jump.
    return (
      <div className="min-h-screen bg-darkbg pt-20 px-4 sm:px-6 lg:px-8">
        <div
          className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          role="status"
          aria-busy="true"
          aria-label="Đang tải sản phẩm"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-darkborder bg-darkcard/40"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <Skeleton className="h-44 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-8 w-24" rounded="rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20" style={{ background: '#050310' }}>
      <DigitalShopTermsGate />
      <ShopBackground />
      {/* Hero */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-indigo/10 rounded-full blur-[180px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-violet/10 rounded-full blur-[180px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neon-violet/10 border border-neon-violet/20 rounded-full text-sm text-neon-violet mb-6">
              <img src="/shop-icon.png" alt="Shop" className="w-5 h-5 object-contain" />
              {t('shop.page.digitalMarketplace')}
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-text-primary mb-4">
              {t('shop.page.title')}
            </h1>
            <p className="text-text-secondary text-base md:text-lg">
              {t('shop.page.subtitle')}
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              {[
                { icon: Shield, textKey: 'shop.page.securePayment' },
                { icon: Clock, textKey: 'shop.page.instantDelivery' },
                { icon: Star, textKey: 'shop.page.qualityGuaranteed' },
                { icon: Zap, textKey: 'shop.page.lifetimeUpdates' },
              ].map(({ icon: Icon, textKey }) => (
                <div key={textKey} className="flex items-center gap-2 text-text-muted text-sm">
                  <Icon className="w-4 h-4 text-neon-violet" />
                  {t(textKey)}
                </div>
              ))}
            </div>

            {/* Check-usage CTA */}
            <div className="mt-8">
              <Link
                href="/shop/check-usage"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 8px 24px rgba(168,85,247,0.35)' }}
              >
                <Gauge className="w-4 h-4" />
                Kiểm tra usage / limit của API key
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Filter */}
        <div className="mb-8">
          <ProductFilter
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sort={sort}
            onSortChange={setSort}
            totalResults={filtered.length}
            categories={categoryOptions}
          />
        </div>

        {/* Category description banner */}
        {(() => {
          const selectedCat = categories.find((c) => c.name === category);
          if (!selectedCat?.description) return null;
          return (
            <div className="mb-8 rounded-2xl p-5 border" style={{ background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(129,140,248,0.25)' }}>
              <h2 className="text-lg font-heading font-bold text-text-primary mb-1">{selectedCat.name}</h2>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{selectedCat.description}</p>
            </div>
          );
        })()}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-darkcard flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-text-muted/30" />
            </div>
            <h3 className="text-xl font-heading font-bold text-text-primary mb-2">
              {t('shop.page.noProducts')}
            </h3>
            <p className="text-text-muted">{t('shop.page.adjustFilters')}</p>
          </div>
        ) : (
          <>
            {/* Hero Spotlight Banner — first/bestseller item */}
            <motion.div
              layout
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ProductCard
                product={filtered[0]}
                index={0}
                isSpotlight={true}
              />
            </motion.div>

            {/* Product grid */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.slice(1).map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <ProductCard key={product.id} product={product} index={i + 1} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
