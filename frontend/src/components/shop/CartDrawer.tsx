'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, BookOpen, Package } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Non-persisted selectors (always safe to call)
  const isDrawerOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);

  // Persisted data — read via individual selectors AFTER mount to prevent hydration mismatch.
  // Using selectors avoids reading the full store state during SSR.
  const items = useCartStore((s) => s.items);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const shopItems = mounted ? items.filter((i) => i.itemType === 'shop') : [];
  const academyItems = mounted ? items.filter((i) => i.itemType === 'academy') : [];

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-darkcard border-l border-darkborder z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-darkborder">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-neon-violet" />
                <h2 className="font-heading font-bold text-text-primary">
                  Giỏ hàng ({mounted ? getTotalItems() : 0})
                </h2>
              </div>
              <button
                onClick={closeDrawer}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-darkbg hover:bg-darkborder/50 text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {!mounted || items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-darkbg flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-text-muted/30" />
                  </div>
                  <h3 className="font-heading font-bold text-text-primary mb-2">Giỏ hàng trống</h3>
                  <p className="text-sm text-text-muted mb-6">
                    Bắt đầu thêm sản phẩm hoặc khóa học vào giỏ hàng
                  </p>
                  <button
                    onClick={closeDrawer}
                    className="px-6 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Khám phá ngay
                  </button>
                </div>
              ) : (
                <>
                  {/* Shop Items */}
                  {shopItems.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="w-4 h-4 text-neon-indigo" />
                        <span className="text-xs font-semibold text-neon-indigo uppercase tracking-wide">
                          Sản phẩm Shop ({shopItems.length})
                        </span>
                      </div>
                      <div className="space-y-3">
                        {shopItems.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex gap-3 p-3 bg-darkbg rounded-xl border border-darkborder"
                          >
                            <Link
                              href={`/shop/${item.product.slug}`}
                              onClick={closeDrawer}
                              className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                            >
                              {item.product.thumbnail ? (
                                <SmartImage
                                  src={item.product.thumbnail}
                                  alt={item.product.name}
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-darkcard flex items-center justify-center">
                                  <ShoppingBag className="w-6 h-6 text-text-muted" />
                                </div>
                              )}
                            </Link>

                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/shop/${item.product.slug}`}
                                onClick={closeDrawer}
                                className="text-sm font-semibold text-text-primary hover:text-neon-violet transition-colors line-clamp-2 leading-tight"
                              >
                                {item.product.name}
                              </Link>
                              <p className="text-xs text-text-muted mt-0.5">{item.product.category}</p>
                              <p className="text-sm font-heading font-bold text-neon-violet mt-1">
                                {formatPrice(item.product.price)}
                              </p>
                            </div>

                            <div className="flex flex-col items-end justify-between">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <div className="flex items-center gap-1 bg-darkcard border border-darkborder rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-semibold text-text-primary">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Academy Items */}
                  {academyItems.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-4 h-4 text-neon-violet" />
                        <span className="text-xs font-semibold text-neon-violet uppercase tracking-wide">
                          Khóa học Academy ({academyItems.length})
                        </span>
                      </div>
                      <div className="space-y-3">
                        {academyItems.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex gap-3 p-3 bg-darkbg rounded-xl border border-neon-violet/20"
                          >
                            <Link
                              href={`/academy/courses/${item.course?.slug}`}
                              onClick={closeDrawer}
                              className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                            >
                              {item.product.thumbnail ? (
                                <SmartImage
                                  src={item.product.thumbnail}
                                  alt={item.course?.title || 'Khóa học'}
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-darkcard flex items-center justify-center">
                                  <BookOpen className="w-6 h-6 text-text-muted" />
                                </div>
                              )}
                            </Link>

                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/academy/courses/${item.course?.slug}`}
                                onClick={closeDrawer}
                                className="text-sm font-semibold text-text-primary hover:text-neon-violet transition-colors line-clamp-2 leading-tight"
                              >
                                {item.course?.title}
                              </Link>
                              <p className="text-xs text-neon-violet mt-0.5">Khóa học</p>
                              <p className="text-sm font-heading font-bold text-neon-violet mt-1">
                                {item.product.price === 0 ? 'Miễn phí' : formatPrice(item.product.price)}
                              </p>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-red-400 transition-colors self-start"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {mounted && items.length > 0 && (
              <div className="p-5 border-t border-darkborder bg-darkbg/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-text-secondary text-sm">Tổng cộng</span>
                  <span className="font-heading font-bold text-xl text-neon-violet">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Thanh toán
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={closeDrawer}
                  className="w-full mt-2 py-3 text-center text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
