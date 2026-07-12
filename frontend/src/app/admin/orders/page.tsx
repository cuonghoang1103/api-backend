'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Receipt, Package, BookOpen, Search, CheckCircle,
  XCircle, Clock, Download, ChevronDown, ChevronRight,
  FileText, Eye, Filter, Loader2, RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { adminGetOrders, adminUpdateOrderStatus, adminUpdateFulfillment, adminRefundOrder, type OrderResponse } from '@/lib/api/shop';
import { generateInvoicePDF } from '@/lib/invoice';
import type { Order } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

function formatPrice(price: number | string): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);
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

// A shop order counts as "successfully paid" when its status is PAID (set by
// the payment gateways) OR the legacy 'COMPLETED' (older manual admin updates).
function isPaidStatus(status: string): boolean {
  return status === 'PAID' || status === 'COMPLETED';
}

function StatusBadge({ status, t }: { status: string; t: (key: string) => string | string[] }) {
  const configs: Record<string, { icon: typeof CheckCircle; color: string; bg: string; labelKey: string }> = {
    PAID: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', labelKey: 'orders.adminStatus.Paid' },
    COMPLETED: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', labelKey: 'orders.adminStatus.Paid' },
    PENDING: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', labelKey: 'orders.adminStatus.Pending' },
    REFUNDED: { icon: RotateCcw, color: 'text-purple-300', bg: 'bg-purple-500/10', labelKey: 'orders.adminStatus.Refunded' },
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

function AdminOrdersContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [rawOrders, setRawOrders] = useState<Record<string, OrderResponse>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [trackingDraft, setTrackingDraft] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  // Deep-link from a chat order code (/admin/orders?code=ORD-...) → prefill the
  // search box so the admin lands right on that order.
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) setSearchQuery(code);
  }, [searchParams]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminGetOrders({ size: 100 });
      const content = res.content || [];
      setOrders(content.map(mapOrderFromBackend));
      setRawOrders(Object.fromEntries(content.map((o) => [String(o.id), o])));
      } catch {
      toast.error(t('admin.orders.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFulfillment = async (id: number, data: { fulfillmentStatus?: string; trackingNumber?: string }) => {
    setUpdating(String(id));
    try {
      const res = await adminUpdateFulfillment(id, data);
      const updated = res.data;
      setRawOrders((prev) => ({ ...prev, [String(id)]: { ...prev[String(id)], ...updated } }));
      toast.success('Đã cập nhật trạng thái giao hàng');
    } catch {
      toast.error('Không cập nhật được trạng thái giao hàng');
    } finally {
      setUpdating(null);
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
                completedAt: newStatus === 'PAID' ? new Date().toISOString() : o.completedAt,
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

  // ─── Refund (full/partial) — mirrors the course-order refund flow ───
  const [refundFor, setRefundFor] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refunding, setRefunding] = useState(false);

  const openRefund = (order: Order) => {
    setRefundFor(order.id);
    setRefundAmount(String(order.total ?? '')); // default = full refund
    setRefundReason('');
  };

  const handleRefund = async () => {
    if (!refundFor) return;
    if (!refundReason.trim()) {
      toast.error(t('admin.orders.refundReasonRequired'));
      return;
    }
    const amountNum = Number(refundAmount);
    if (!refundAmount || isNaN(amountNum) || amountNum <= 0) {
      toast.error(t('admin.orders.refundAmountInvalid'));
      return;
    }
    setRefunding(true);
    try {
      const res = await adminRefundOrder(parseInt(refundFor), { reason: refundReason.trim(), refundAmount: amountNum });
      const updated = res.data;
      setOrders((prev) => prev.map((o) => (o.id === refundFor ? { ...o, status: 'REFUNDED' as Order['status'] } : o)));
      if (updated) setRawOrders((prev) => ({ ...prev, [refundFor]: { ...prev[refundFor], ...updated } }));
      toast.success(t('admin.orders.refundSuccess'));
      setRefundFor(null);
    } catch {
      toast.error(t('admin.orders.refundError'));
    } finally {
      setRefunding(false);
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
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PAID' ? isPaidStatus(order.status) : order.status === statusFilter);
    return matchesSearch && matchesStatus;
  });

  // Revenue = paid orders' totals MINUS any amounts refunded. A REFUNDED order
  // contributes total − refundAmount (0 for a full refund) so the number is the
  // net money actually kept.
  // NOTE: Prisma Decimal fields serialize to JSON as STRINGS, so `o.total` is a
  // string here — Number() it before arithmetic, or `sum + "2000000"` string-
  // concatenates into an absurd number that blew up the Revenue card.
  const totalRevenue = orders.reduce((sum, o) => {
    const total = Number(o.total) || 0;
    if (isPaidStatus(o.status)) return sum + total;
    if (o.status === 'REFUNDED') {
      const refunded = Number(rawOrders[o.id]?.refundAmount ?? o.total ?? 0) || 0;
      return sum + Math.max(0, total - refunded);
    }
    return sum;
  }, 0);

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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {[
          { labelKey: 'admin.orders.totalOrders', value: orders.length, color: 'text-text-primary' },
          { labelKey: 'admin.orders.completed', value: orders.filter((o) => isPaidStatus(o.status)).length, color: 'text-green-400' },
          { labelKey: 'admin.orders.pending', value: orders.filter((o) => o.status === 'PENDING').length, color: 'text-yellow-400' },
          { labelKey: 'admin.orders.refunded', value: orders.filter((o) => o.status === 'REFUNDED').length, color: 'text-purple-300' },
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
          {['ALL', 'PAID', 'PENDING', 'REFUNDED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-neon-violet text-white'
                  : 'bg-darkcard border border-darkborder text-text-secondary hover:text-text-primary'
              }`}
            >
              {s === 'ALL' ? t('admin.orders.filterAll') : s === 'PAID' ? t('admin.orders.filterPaid') : s === 'PENDING' ? t('admin.orders.filterPending') : t('admin.orders.filterRefunded')}
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
                      {/* Payment status update. A REFUNDED order is terminal —
                          its status is locked (refunds happen via the button). */}
                      <select
                        value={isPaidStatus(order.status) ? 'PAID' : order.status}
                        onChange={(e) => handleUpdateStatus(parseInt(order.id), e.target.value)}
                        disabled={updating === order.id || order.status === 'REFUNDED'}
                        className="px-3 py-2 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 cursor-pointer disabled:opacity-50"
                      >
                        <option value="PENDING">{t('orders.adminStatus.Pending')}</option>
                        <option value="PAID">{t('orders.adminStatus.Paid')}</option>
                        <option value="FAILED">{t('orders.adminStatus.Failed')}</option>
                        <option value="CANCELLED">{t('orders.adminStatus.Cancelled')}</option>
                        {order.status === 'REFUNDED' && (
                          <option value="REFUNDED">{t('orders.adminStatus.Refunded')}</option>
                        )}
                      </select>

                      {/* Refund — only for a paid, not-yet-refunded order */}
                      {isPaidStatus(order.status) && (
                        <button
                          onClick={() => openRefund(order)}
                          disabled={updating === order.id}
                          className="flex items-center gap-1.5 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                        >
                          <RotateCcw className="w-4 h-4" />
                          {t('admin.orders.refund')}
                        </button>
                      )}

                      {/* Physical shipping lifecycle */}
                      {(() => {
                        const raw = rawOrders[order.id];
                        const isPhysical = raw && (raw.orderType === 'PHYSICAL' || raw.orderType === 'MIXED');
                        if (!isPhysical) return null;
                        return (
                          <>
                            <select
                              value={raw.fulfillmentStatus || 'PENDING'}
                              onChange={(e) => handleUpdateFulfillment(parseInt(order.id), { fulfillmentStatus: e.target.value })}
                              disabled={updating === order.id}
                              className="px-3 py-2 bg-darkcard border border-amber-500/30 rounded-xl text-sm text-amber-300 focus:outline-none focus:border-amber-500/60 cursor-pointer disabled:opacity-50"
                              title="Trạng thái giao hàng"
                            >
                              <option value="PENDING">🕒 Chờ xác nhận</option>
                              <option value="PROCESSING">📦 Đang chuẩn bị</option>
                              <option value="SHIPPED">🚚 Đang giao</option>
                              <option value="DELIVERED">✅ Đã giao</option>
                              <option value="COMPLETED">🎉 Hoàn thành</option>
                            </select>
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={trackingDraft[order.id] ?? raw.trackingNumber ?? ''}
                                onChange={(e) => setTrackingDraft((p) => ({ ...p, [order.id]: e.target.value }))}
                                placeholder="Mã vận đơn"
                                className="px-3 py-2 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 w-32"
                              />
                              <button
                                onClick={() => handleUpdateFulfillment(parseInt(order.id), { trackingNumber: trackingDraft[order.id] ?? raw.trackingNumber ?? '' })}
                                disabled={updating === order.id}
                                className="px-3 py-2 bg-darkcard border border-darkborder rounded-xl text-xs text-text-secondary hover:border-neon-violet/40 transition-colors disabled:opacity-50"
                              >
                                Lưu
                              </button>
                            </div>
                          </>
                        );
                      })()}

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

      {/* ─── Refund modal ─── */}
      {refundFor && (() => {
        const order = orders.find((o) => o.id === refundFor);
        if (!order) return null;
        return (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4" onClick={() => !refunding && setRefundFor(null)}>
            <div className="w-full max-w-md bg-darkcard border border-purple-500/30 rounded-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-purple-300" />
                <h3 className="text-lg font-heading font-bold text-text-primary">{t('admin.orders.refundTitle')}</h3>
              </div>
              <div className="text-sm text-text-muted">
                {t('admin.orders.orderCode')}: <span className="text-text-secondary font-mono">{order.orderCode}</span>
                <br />
                {t('checkout.grandTotal')}: <span className="text-neon-violet font-semibold">{formatPrice(order.total || 0)}</span>
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">{t('admin.orders.refundAmountLabel')}</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  max={order.total || undefined}
                  min={1}
                  className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-purple-500/50"
                />
                <p className="text-[11px] text-text-muted mt-1">{t('admin.orders.refundAmountHint')}</p>
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">{t('admin.orders.refundReasonLabel')}</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder={t('admin.orders.refundReasonPlaceholder') as string}
                  className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple-500/50 resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setRefundFor(null)}
                  disabled={refunding}
                  className="px-4 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleRefund}
                  disabled={refunding}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {refunding ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                  {t('admin.orders.confirmRefund')}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-neon-violet" /></div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
