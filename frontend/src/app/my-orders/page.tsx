'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package, BookOpen, Download, ShoppingBag,
  ArrowLeft, Clock, CheckCircle, XCircle, FileText,
  Package as PackageIcon, ChevronRight, Loader2,
} from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';
import { getOrderByCode, getMyOrders, type OrderResponse } from '@/lib/api/shop';
import { generateInvoicePDF } from '@/lib/invoice';
import type { Order } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

function StatusBadge({ status, t }: { status: Order['status']; t: (key: string) => string | string[] }) {
  const statusKey = status?.toUpperCase() || 'PENDING';
  const config: Record<string, { icon: typeof CheckCircle; color: string; bg: string; border: string; dot: string }> = {
    COMPLETED: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', dot: 'bg-green-400' },
    COMPLETE: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', dot: 'bg-green-400' },
    PENDING: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
    FAILED: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-400' },
    CANCELLED: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-400' },
  };
  const { icon: Icon, color, bg, border, dot } = config[statusKey] || config.PENDING;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bg} ${border} ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <Icon className="w-3.5 h-3.5" />
      {statusKey === 'COMPLETED' || statusKey === 'COMPLETE' ? t('orders.status.Completed') :
       statusKey === 'PENDING' ? t('orders.status.Pending') :
       statusKey === 'FAILED' || statusKey === 'CANCELLED' ? t('orders.status.Failed') : statusKey}
    </span>
  );
}

export default function MyOrdersPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { orders, getAllOrders, saveBackendOrder } = useOrderStore();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const storedOrders = getAllOrders();
    setLocalOrders(storedOrders);

    async function loadOrders() {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const res = await getMyOrders();
          const backendOrders = Array.isArray(res.data) ? res.data : [];
          if (backendOrders.length > 0) {
            const mappedOrders = backendOrders.map((bo) => ({
              id: String(bo.id),
              orderCode: bo.orderCode,
              items: (Array.isArray(bo.items) ? bo.items : []).map((item: any) => ({
                id: String(item.id),
                itemType: 'shop' as const,
                name: item.productName,
                thumbnail: item.productImage || '/images/products/default.jpg',
                price: item.price,
                quantity: item.quantity,
                category: 'Web Template' as const,
              })),
              subtotal: bo.subtotal,
              discountAmount: bo.discountAmount,
              discountCode: bo.discountCode,
              total: bo.total,
              status: bo.status as Order['status'],
              buyerInfo: {
                fullName: bo.buyerName,
                email: bo.buyerEmail,
                phone: bo.buyerPhone || '',
                address: bo.buyerAddress || '',
              },
              createdAt: bo.createdAt,
              completedAt: bo.paidAt,
            }));
            setLocalOrders(mappedOrders);
            mappedOrders.forEach(saveBackendOrder);
            return;
          }
        }

        if (storedOrders.length > 0) {
          const results = await Promise.allSettled(
            storedOrders.map((o) =>
              getOrderByCode(o.orderCode || o.id).then((res) => res.data).catch(() => null)
            )
          );

          const backendOrders = results
            .filter((r) => r.status === 'fulfilled' && (r as any).value)
            .map((r) => (r as any).value as OrderResponse);

          if (backendOrders.length > 0) {
            setLocalOrders(
              backendOrders.map((bo) => ({
                id: String(bo.id),
                orderCode: bo.orderCode,
                items: (Array.isArray(bo.items) ? bo.items : []).map((item: any) => ({
                  id: String(item.id),
                  itemType: 'shop' as const,
                  name: item.productName,
                  thumbnail: item.productImage || '/images/products/default.jpg',
                  price: item.price,
                  quantity: item.quantity,
                  category: 'Web Template' as const,
                })),
                subtotal: bo.subtotal,
                discountAmount: bo.discountAmount,
                discountCode: bo.discountCode,
                total: bo.total,
                status: bo.status as Order['status'],
                buyerInfo: {
                  fullName: bo.buyerName,
                  email: bo.buyerEmail,
                  phone: bo.buyerPhone || '',
                  address: bo.buyerAddress || '',
                },
                createdAt: bo.createdAt,
                completedAt: bo.paidAt,
              }))
            );
          }
        }
      } finally {
        setLoading(false);
      }
    }

    if (mounted) {
      void loadOrders();
    }
  }, [mounted, isAuthenticated, getAllOrders, saveBackendOrder]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-darkbg pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkbg pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary">
              {t('orders.title')}
            </h1>
            <p className="text-text-muted text-sm mt-1">
              {localOrders.length} {localOrders.length === 1 ? t('orders.order') : t('orders.orders')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="flex items-center gap-2 text-sm text-text-muted hover:text-neon-violet transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
                {t('common.shop')}
            </Link>
          </div>
        </div>

        {localOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-darkcard flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-text-muted/30" />
            </div>
            <h2 className="text-xl font-heading font-bold text-text-primary mb-3">
              {t('orders.noOrders')}
            </h2>
            <p className="text-text-muted mb-8">
              {t('orders.noOrdersDescription')}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <ShoppingBag className="w-4 h-4" />
                {t('common.shop')}
              </Link>
              <Link
                href="/academy"
                className="inline-flex items-center gap-2 px-6 py-3 bg-darkcard border border-darkborder text-text-primary font-semibold rounded-xl hover:border-neon-violet/30 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                {t('common.academy')}
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {localOrders.map((order, index) => {
              const isExpanded = expandedOrder === order.id;
              const shopItems = order.items.filter((i) => i.itemType === 'shop');
              const academyItems = order.items.filter((i) => i.itemType === 'academy');

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden"
                >
                  {/* Order header */}
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-darkborder/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-neon-violet/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-neon-violet" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="font-heading font-bold text-text-primary">
                            #{(order as Order).orderCode || order.id}
                          </p>
                          <StatusBadge status={order.status} t={t} />
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">
                          {formatDate(order.createdAt)}
                          {' · '}
                          {order.items.length} {order.items.length === 1 ? t('orders.product') : t('orders.products')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-lg font-heading font-bold text-neon-violet">
                          {formatPrice(order.total)}
                        </p>
                        {order.discountAmount > 0 && (
                          <p className="text-xs text-green-400">
                            {t('orders.discountApplied')} {formatPrice(order.discountAmount)}
                          </p>
                        )}
                      </div>
                      <ChevronRight className={`w-5 h-5 text-text-muted transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-darkborder"
                    >
                      <div className="p-5 space-y-6">
                        {/* Buyer info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-darkbg rounded-xl p-4">
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                              {t('contact.fullName')}
                            </p>
                            <p className="text-sm font-medium text-text-primary">{order.buyerInfo.fullName}</p>
                            <p className="text-xs text-text-muted">{order.buyerInfo.email}</p>
                            {order.buyerInfo.phone && (
                              <p className="text-xs text-text-muted">{order.buyerInfo.phone}</p>
                            )}
                          </div>
                          <div className="bg-darkbg rounded-xl p-4">
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                              {t('orders.orderInfo')}
                            </p>
                            {order.discountCode && (
                              <p className="text-xs text-text-muted">
                                {t('orders.discountCode')}: <span className="text-neon-violet font-semibold">{order.discountCode}</span>
                              </p>
                            )}
                            <p className="text-xs text-text-muted">
                              {t('orders.createdAt')}: {formatDate(order.createdAt)}
                            </p>
                            {order.completedAt && (
                              <p className="text-xs text-text-muted">
                                {t('orders.completedAt')}: {formatDate(order.completedAt)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Shop items */}
                        {shopItems.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Package className="w-4 h-4 text-neon-indigo" />
                              <span className="text-xs font-semibold text-neon-indigo uppercase tracking-wide">
                                {t('orders.shopProducts')} ({shopItems.length})
                              </span>
                            </div>
                            <div className="space-y-3">
                              {shopItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-3 p-3 bg-darkbg rounded-xl"
                                >
                                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"                                >
                                  {item.thumbnail ? (
                                    <Image
                                      src={item.thumbnail}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-darkcard flex items-center justify-center">
                                      <Package className="w-6 h-6 text-text-muted" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-text-primary truncate">
                                    {item.name}
                                    </p>
                                    <p className="text-xs text-text-muted">{item.category}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-text-primary">
                                      {formatPrice(item.price * item.quantity)}
                                    </p>
                                    <p className="text-xs text-text-muted">x{item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Academy items */}
                        {academyItems.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <BookOpen className="w-4 h-4 text-neon-violet" />
                              <span className="text-xs font-semibold text-neon-violet uppercase tracking-wide">
                                {t('orders.academyCourses')} ({academyItems.length})
                              </span>
                            </div>
                            <div className="space-y-3">
                              {academyItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-3 p-3 bg-darkbg rounded-xl"
                                >
                                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"                                >
                                  {item.thumbnail ? (
                                    <Image
                                      src={item.thumbnail}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-darkcard flex items-center justify-center">
                                      <Package className="w-6 h-6 text-text-muted" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-text-primary truncate">
                                    {item.name}
                                    </p>
                                    <p className="text-xs text-neon-violet">{t('orders.course')}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-text-primary">
                                      {formatPrice(item.price)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Totals */}
                        <div className="bg-darkbg rounded-xl p-4">
                          <div className="space-y-1.5 mb-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-text-muted">{t('orders.subtotal')}</span>
                              <span className="text-text-primary">{formatPrice(order.subtotal)}</span>
                            </div>
                            {order.discountAmount > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-text-muted">
                                  {t('checkout.discount')} ({order.discountCode})
                                </span>
                                <span className="text-green-400">-{formatPrice(order.discountAmount)}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center pt-2 border-t border-darkborder">
                              <span className="font-semibold text-text-primary">{t('orders.total')}</span>
                              <span className="text-xl font-heading font-bold text-neon-violet">
                                {formatPrice(order.total)}
                              </span>
                            </div>
                          </div>

                          {/* Download invoice */}
                          {order.status === 'Completed' && (
                            <button
                              onClick={() => {
                                setDownloadingId(order.id);
                                setTimeout(() => {
                                  generateInvoicePDF(order);
                                  setDownloadingId(null);
                                }, 500);
                              }}
                              className="w-full flex items-center justify-center gap-2 py-2.5 bg-neon-violet/10 hover:bg-neon-violet/20 border border-neon-violet/30 text-neon-violet text-sm font-semibold rounded-xl transition-colors"
                            >
                              {downloadingId === order.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                              {t('orders.downloadInvoice')}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
