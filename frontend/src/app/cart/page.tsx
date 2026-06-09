'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Minus, Plus, Trash2, ArrowLeft, ShoppingBag,
  ShieldCheck, CreditCard, Lock, Tag, ArrowRight,
  BookOpen, Package, Loader2,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import StarRating from '@/components/shop/StarRating';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();

  const shopItems = mounted ? items.filter((i) => i.itemType === 'shop') : [];
  const academyItems = mounted ? items.filter((i) => i.itemType === 'academy') : [];
  const subtotal = mounted ? getTotalPrice() : 0;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-darkbg pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-darkbg pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-darkcard flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-text-muted/30" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-3">
              Giỏ hàng trống
            </h1>
            <p className="text-text-muted mb-8">
              Hãy thêm sản phẩm hoặc khóa học vào giỏ hàng
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <Package className="w-4 h-4" />
                Shop
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-darkcard border border-darkborder text-text-primary font-semibold rounded-xl hover:border-neon-violet/30 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Academy
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkbg pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary">
              Giỏ hàng
            </h1>
            <p className="text-text-muted text-sm mt-1">
              {items.length} {items.length === 1 ? 'món' : 'món'} trong giỏ hàng
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            Xóa tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shop Items */}
            {shopItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-neon-indigo" />
                  <h2 className="font-heading font-bold text-text-primary">
                    Sản phẩm Shop ({shopItems.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {shopItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-darkcard border border-darkborder rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5"
                    >
                      <Link
                        href={`/shop/${item.product.slug}`}
                        className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0"
                      >
                        {item.product.thumbnail ? (
                          <Image
                            src={item.product.thumbnail}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-darkcard flex items-center justify-center">
                            <Package className="w-6 h-6 text-text-muted" />
                          </div>
                        )}
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Link
                            href={`/shop/${item.product.slug}`}
                            className="font-heading font-bold text-text-primary hover:text-neon-violet transition-colors text-sm sm:text-base leading-tight"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <span className="inline-block text-xs px-2 py-0.5 bg-neon-indigo/10 text-neon-indigo rounded-full font-medium">
                          {item.product.category}
                        </span>

                        <div className="flex items-center gap-2 mt-1 mb-3">
                          <StarRating
                            rating={item.product.rating}
                            reviewCount={item.product.reviewCount}
                            size="sm"
                          />
                        </div>

                        <div className="flex items-end justify-between gap-2">
                          <div>
                            <p className="text-lg font-heading font-bold text-neon-violet">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                            {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                              <p className="text-xs text-text-muted line-through">
                                {formatPrice(item.product.originalPrice * item.quantity)}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1 bg-darkbg border border-darkborder rounded-xl">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl text-text-muted hover:text-text-primary hover:bg-darkborder/50 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-text-primary">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl text-text-muted hover:text-text-primary hover:bg-darkborder/50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
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
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-neon-violet" />
                  <h2 className="font-heading font-bold text-text-primary">
                    Khóa học Academy ({academyItems.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {academyItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (shopItems.length + index) * 0.05 }}
                      className="bg-darkcard border border-neon-violet/20 rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5"
                    >
                      <Link
                        href={`/academy/courses/${item.course?.slug}`}
                        className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0"
                      >
                        {item.product.thumbnail ? (
                          <Image
                            src={item.product.thumbnail}
                            alt={item.course?.title || 'Khóa học'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-darkcard flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-text-muted" />
                          </div>
                        )}
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Link
                            href={`/academy/courses/${item.course?.slug}`}
                            className="font-heading font-bold text-text-primary hover:text-neon-violet transition-colors text-sm sm:text-base leading-tight"
                          >
                            {item.course?.title}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <span className="inline-block text-xs px-2 py-0.5 bg-neon-violet/10 text-neon-violet rounded-full font-medium">
                          Khóa học
                        </span>

                        <div className="flex items-center gap-3 mt-2 mb-3">
                          {item.course?.categoryName && (
                            <span className="text-xs text-text-muted">{item.course.categoryName}</span>
                          )}
                          {item.course?.instructorName && (
                            <span className="text-xs text-text-muted">
                              Giảng viên: {item.course.instructorName}
                            </span>
                          )}
                        </div>

                        <div className="flex items-end justify-between gap-2">
                          <div>
                            <p className="text-lg font-heading font-bold text-neon-violet">
                              {formatPrice(item.product.price)}
                            </p>
                            {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                              <p className="text-xs text-text-muted line-through">
                                {formatPrice(Number(item.product.originalPrice))}
                              </p>
                            )}
                          </div>

                          <span className="px-3 py-1.5 bg-neon-violet/10 text-neon-violet text-xs font-medium rounded-lg">
                            Đã bao gồm trong giỏ hàng
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-darkcard border border-darkborder rounded-2xl p-6 sticky top-24">
              <h2 className="font-heading font-bold text-text-primary text-lg mb-6">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-3 mb-4 pb-4 border-b border-darkborder">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Sản phẩm Shop</span>
                  <span className="text-text-primary font-medium">
                    {shopItems.length} món
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Khóa học</span>
                  <span className="text-text-primary font-medium">
                    {academyItems.length} món
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-darkborder/50">
                  <span className="text-text-secondary">Tổng phụ</span>
                  <span className="text-text-primary font-medium">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <span className="text-text-secondary">Tổng cộng</span>
                <span className="text-2xl font-heading font-bold text-neon-violet">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Discount hint */}
              <div className="mb-4 p-3 bg-darkbg rounded-xl border border-darkborder">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-3.5 h-3.5 text-neon-violet" />
                  <span className="text-xs text-text-muted">
                    Có mã giảm giá? Nhập tại trang thanh toán
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-bold rounded-xl hover:opacity-90 transition-opacity mb-3"
              >
                <Lock className="w-4 h-4" />
                Tiến hành thanh toán
              </button>

              <Link
                href="/shop"
                className="w-full flex items-center justify-center gap-2 py-3 text-center text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Tiếp tục mua sắm
              </Link>

              <div className="space-y-2 pt-4 border-t border-darkborder">
                {[
                  { icon: ShieldCheck, text: 'Thanh toán an toàn 100%' },
                  { icon: CreditCard, text: 'Hỗ trợ mọi phương thức' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-text-muted">
                    <Icon className="w-4 h-4 text-neon-violet flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
