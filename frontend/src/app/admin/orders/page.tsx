'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Receipt, Package, BookOpen, Search, CheckCircle,
  XCircle, Clock, Download, ChevronDown, ChevronRight,
  FileText, Eye, Filter, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { adminGetOrders, adminUpdateOrderStatus } from '@/lib/api/shop';
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
  if (!dateStr) return '-';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

function StatusBadge({ status, t }: { status: string; t: (key: string) => string | string[] }) {
  const configs: Record<string, { icon: typeof CheckCircle; color: string; bg: string; labelKey: string }> = {
    COMPLETED: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', labelKey: 'orders.adminStatus.Completed' },
    PENDING: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', labelKey: 'orders.adminStatus.Pending' },
    FAILED: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', labelKey: 'orders.adminStatus.Failed' },
    CANCELLED: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', labelKey: 'orders.adminStatus.Cancelled' },
  };
  const cfg = configs[status] || configs.PENDING;
  const { icon: Icon, color, bg, labelKey } = cfg;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${bg} ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {t(labelKey)}
    </span>
  );
}

function mapOrderFromBackend(bo: any): Order {
  return {
    id: String(bo.id),
    orderCode: bo.orderCode,
    items: (bo.items || []).map((item: any) => ({
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
    status: bo.status,
    buyerInfo: {
      fullName: bo.buyerName,
      email: bo.buyerEmail,
      phone: bo.buyerPhone || '',
      address: bo.buyerAddress || '',
    },
    createdAt: bo.createdAt,
    completedAt: bo.paidAt,
  };
}

export default function AdminOrdersPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminGetOrders({ size: 100 });
      setOrders((res.content || []).map(mapOrderFromBackend));
      } catch {
      toast.error(t('admin.orders.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdating(String(id));
    try {
      await adminUpdateOrderStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === String(id)
            ? {
                ...o,
                status: newStatus as Order['status'],
                completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : o.completedAt,
              }
            : o
        )
      );
      toast.success(t('admin.orders.updateSuccess'));
    } catch {
      toast.error(t('admin.orders.updateError'));
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      (order.orderCode || '').toLowerCase().includes(q) ||
      order.buyerInfo.fullName.toLowerCase().includes(q) ||
      order.buyerInfo.email.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const handleDownloadInvoice = (order: Order) => {
    generateInvoicePDF(order);
    toast.success(t('admin.orders.invoiceDownloaded'));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            {t('admin.orders.title')}
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {t('admin.orders.subtitle')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { labelKey: 'admin.orders.totalOrders', value: orders.length, color: 'text-text-primary' },
          { labelKey: 'admin.orders.completed', value: orders.filter((o) => o.status === 'COMPLETED').length, color: 'text-green-400' },
          { labelKey: 'admin.orders.pending', value: orders.filter((o) => o.status === 'PENDING').length, color: 'text-yellow-400' },
          { labelKey: 'admin.orders.revenue', value: formatPrice(totalRevenue), color: 'text-neon-violet', isPrice: true },
        ].map((stat, i) => (
          <div key={i} className="bg-darkcard border border-darkborder rounded-2xl p-5">
            <p className="text-xs text-text-muted mb-1">{t(stat.labelKey)}</p>
            <p className={`text-2xl font-heading font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.orders.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'COMPLETED', 'PENDING', 'CANCELLED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-neon-violet text-white'
                  : 'bg-darkcard border border-darkborder text-text-secondary hover:text-text-primary'
              }`}
            >
              {s === 'ALL' ? t('admin.orders.filterAll') : s === 'COMPLETED' ? t('admin.orders.filterCompleted') : s === 'PENDING' ? t('admin.orders.filterPending') : t('admin.orders.filterCancelled')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-darkcard border border-darkborder rounded-2xl p-16 text-center">
          <Receipt className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-bold text-text-primary mb-2">
            {orders.length === 0 ? t('admin.orders.noOrders') : t('admin.orders.noResults')}
          </h3>
          <p className="text-text-muted text-sm">
            {orders.length === 0
              ? t('admin.orders.noOrdersDescription')
              : t('admin.orders.tryDifferentFilter')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order, index) => {
            const isExpanded = false;
            const shopItems = order.items.filter((i) => i.itemType === 'shop');

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden"
              >
                {/* Order row */}
                <div className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-neon-violet/10 flex items-center justify-center flex-shrink-0">
                      <Receipt className="w-5 h-5 text-neon-violet" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-heading font-bold text-text-primary">
                          #{order.orderCode || order.id}
                        </p>
                        <StatusBadge status={order.status} t={t} />
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        {order.buyerInfo.fullName} · {order.buyerInfo.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-heading font-bold text-neon-violet">
                        {formatPrice(order.total || 0)}
                      </p>
                      <p className="text-xs text-text-muted">
                        {order.items.length} {t('admin.orders.items')}
                      </p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-text-muted">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                <div className="border-t border-darkborder px-5 py-5 space-y-4">
                  {/* Buyer + Order info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-darkbg rounded-xl p-4">
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                        {t('admin.orders.buyerInfo')}
                      </p>
                      <p className="text-sm font-medium text-text-primary">{order.buyerInfo.fullName}</p>
                      <p className="text-xs text-text-muted">{order.buyerInfo.email}</p>
                      {order.buyerInfo.phone && (
                        <p className="text-xs text-text-muted">{order.buyerInfo.phone}</p>
                      )}
                      {order.buyerInfo.address && (
                        <p className="text-xs text-text-muted">{order.buyerInfo.address}</p>
                      )}
                    </div>
                    <div className="bg-darkbg rounded-xl p-4">
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                        {t('admin.orders.orderInfo')}
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-text-muted">{t('admin.orders.orderCode')}:</span>
                          <span className="text-text-primary font-mono font-semibold">#{order.orderCode || order.id}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-text-muted">{t('admin.orders.createdAt')}:</span>
                          <span className="text-text-secondary">{formatDate(order.createdAt)}</span>
                        </div>
                        {order.completedAt && (
                          <div className="flex justify-between text-xs">
                            <span className="text-text-muted">{t('admin.orders.completedAt')}:</span>
                            <span className="text-text-secondary">{formatDate(order.completedAt)}</span>
                          </div>
                        )}
                        {order.discountCode && (
                          <div className="flex justify-between text-xs">
                            <span className="text-text-muted">{t('admin.orders.discountCode')}:</span>
                            <span className="text-neon-violet font-semibold">{order.discountCode}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs">
                          <span className="text-text-muted">{t('admin.orders.paymentMethod')}:</span>
                          <span className="text-text-secondary">{t('checkout.simulatedPayment')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-4 h-4 text-neon-indigo" />
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                        {t('admin.orders.shopItems')} ({shopItems.length})
                      </span>
                    </div>
                    {shopItems.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {shopItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 bg-darkbg rounded-xl p-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              {item.thumbnail ? (
                                <Image src={item.thumbnail} alt={item.name} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full bg-darkcard flex items-center justify-center">
                                  <Package className="w-5 h-5 text-text-muted" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-text-primary truncate">{item.name}</p>
                              <p className="text-[10px] text-text-muted">{item.category}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-xs font-bold text-text-primary">{formatPrice(item.price)}</p>
                              <p className="text-[10px] text-text-muted">x{item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Summary + Actions */}
                  <div className="bg-darkbg rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex gap-4 text-xs">
                        <div>
                          <span className="text-text-muted">{t('checkout.subtotal')}: </span>
                          <span className="text-text-secondary">{formatPrice(order.subtotal || 0)}</span>
                        </div>
                        {(order.discountAmount || 0) > 0 && (
                          <div>
                            <span className="text-text-muted">{t('checkout.discount')}: </span>
                            <span className="text-green-400">-{formatPrice(order.discountAmount || 0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-text-primary">{t('checkout.grandTotal')}:</span>
                        <span className="text-xl font-heading font-bold text-neon-violet">{formatPrice(order.total || 0)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Status update */}
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(parseInt(order.id), e.target.value)}
                        disabled={updating === order.id}
                        className="px-3 py-2 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 cursor-pointer disabled:opacity-50"
                      >
                        <option value="PENDING">{t('orders.status.Pending')}</option>
                        <option value="COMPLETED">{t('orders.status.Completed')}</option>
                        <option value="CANCELLED">{t('orders.adminStatus.Cancelled')}</option>
                      </select>
                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        className="flex items-center gap-2 px-4 py-2 bg-neon-violet/10 hover:bg-neon-violet/20 border border-neon-violet/30 text-neon-violet text-sm font-semibold rounded-xl transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        {t('admin.orders.downloadInvoice')}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
