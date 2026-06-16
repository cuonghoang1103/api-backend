'use client';

/**
 * Admin / Course Orders — list + filter + drill-down.
 *
 * Reads from GET /api/v1/payments/admin/orders.
 * Drill-down: click an order row → drawer with transactions from
 * GET /api/v1/payments/admin/transactions/:orderCode (audit log).
 *
 * Refunds and enrollment changes are handled on the dedicated
 * pages; this page is read-only by design so admins don't
 * accidentally take destructive actions while browsing.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Search, Filter, Loader2, X, Eye, RefreshCw,
  CreditCard, Calendar, Hash, User, BookOpen,
} from 'lucide-react';
import { paymentApi } from '@/lib/api';

interface CourseOrder {
  id: number;
  orderCode: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  amount: number;
  paymentMethod: string;
  paymentTxnNo: string | null;
  paymentBankCode: string | null;
  paymentPayDate: string | null;
  enrolled: boolean;
  user: { id: number; username: string; email: string; fullName: string | null };
  course: { id: number; slug: string; title: string };
  createdAt: string;
  updatedAt: string;
}

interface PaymentTransaction {
  id: number;
  gatewayTxnNo: string | null;
  bankCode: string | null;
  payDate: string | null;
  responseCode: string | null;
  amount: number;
  rawPayload: unknown;
  createdAt: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

const STATUS_BADGE: Record<CourseOrder['status'], { label: string; cls: string }> = {
  PENDING:  { label: 'Cho thanh toan', cls: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' },
  PAID:     { label: 'Da thanh toan',  cls: 'bg-green-500/15 text-green-300 border-green-500/30' },
  FAILED:   { label: 'That bai',       cls: 'bg-red-500/15 text-red-300 border-red-500/30' },
  REFUNDED: { label: 'Da hoan tien',   cls: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
};

export default function AdminCourseOrdersPage() {
  const [orders, setOrders] = useState<CourseOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<CourseOrder | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  // Refund form state
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refunding, setRefunding] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await paymentApi.adminListOrders({
        status: statusFilter || undefined,
        page,
        pageSize,
      });
      setOrders(res.data.data.items);
      setTotal(res.data.data.total);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Khong the tai danh sach don hang');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const openDrawer = async (order: CourseOrder) => {
    setSelected(order);
    setTransactions([]);
    setTxLoading(true);
    try {
      const res = await paymentApi.adminListTransactions(order.orderCode);
      setTransactions(res.data.data.transactions);
    } catch {
      // Drawer still shows the order info even if tx fetch fails
    } finally {
      setTxLoading(false);
    }
  };

  const handleSetExpiry = async (preset: '+30d' | '+1y' | 'clear') => {
    if (!selected) return;
    try {
      let expiresAt: string | null = null;
      if (preset !== 'clear') {
        const d = new Date();
        if (preset === '+30d') d.setDate(d.getDate() + 30);
        if (preset === '+1y') d.setFullYear(d.getFullYear() + 1);
        expiresAt = d.toISOString();
      }
      await paymentApi.adminUpdateEnrollment({
        userId: selected.user.id,
        courseId: selected.course.id,
        expiresAt,
      });
      toast.success(preset === 'clear' ? 'Đã xoá thời hạn' : `Đã set ${preset}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Khong the cap nhat');
    }
  };

  const handleRevoke = async () => {
    if (!selected) return;
    if (!window.confirm(`Thu hoi quyen truy cap cua ${selected.user.email}?`)) return;
    try {
      await paymentApi.adminRevokeEnrollment(selected.user.id, selected.course.id);
      toast.success('Đã thu hoi quyen truy cap');
      setSelected(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Khong the thu hoi');
    }
  };

  const handleRefund = async () => {
    if (!selected) return;
    if (!refundReason.trim()) {
      toast.error('Vui long nhap ly do');
      return;
    }
    if (!window.confirm(
      `Xac nhan hoan tien cho don ${selected.orderCode}?\n\n` +
      `Hanh dong nay se: ${refundAmount && Number(refundAmount) < selected.amount ? 'giu enrollment' : 'thu hoi enrollment'}` +
      ` va gui email xac nhan cho hoc vien.`,
    )) return;
    setRefunding(true);
    try {
      const amount = refundAmount ? Number(refundAmount) : undefined;
      await paymentApi.adminRefundOrder({
        orderCode: selected.orderCode,
        refundAmount: amount,
        reason: refundReason.trim(),
      });
      toast.success('Đã hoan tien thanh cong');
      setShowRefundForm(false);
      setRefundAmount('');
      setRefundReason('');
      setSelected(null);
      fetchOrders();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Khong the hoan tien');
    } finally {
      setRefunding(false);
    }
  };

  const filtered = keyword
    ? orders.filter(o =>
        o.orderCode.toLowerCase().includes(keyword.toLowerCase()) ||
        o.user.email.toLowerCase().includes(keyword.toLowerCase()) ||
        o.user.username.toLowerCase().includes(keyword.toLowerCase()) ||
        o.course.title.toLowerCase().includes(keyword.toLowerCase()),
      )
    : orders;

  return (
    <div className="min-h-screen bg-darkbg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary">
              Don hang khoa hoc
            </h1>
            <p className="text-text-muted mt-1">
              VNPay transactions, refunds, and enrollment audit
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-darkcard border border-darkborder rounded-xl text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Lam moi
          </button>
        </div>

        {/* Filters */}
        <div className="bg-darkcard border border-darkborder rounded-2xl p-4 mb-4 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Tim theo ma don, email, khoa hoc..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="pl-10 pr-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 cursor-pointer"
            >
              <option value="">Tat ca trang thai</option>
              <option value="PENDING">Cho thanh toan</option>
              <option value="PAID">Da thanh toan</option>
              <option value="FAILED">That bai</option>
              <option value="REFUNDED">Da hoan tien</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-darkbg/50 border-b border-darkborder">
                <tr className="text-text-muted text-left">
                  <th className="px-4 py-3 font-medium">Ma don</th>
                  <th className="px-4 py-3 font-medium">Hoc vien</th>
                  <th className="px-4 py-3 font-medium">Khoa hoc</th>
                  <th className="px-4 py-3 font-medium">So tien</th>
                  <th className="px-4 py-3 font-medium">Trang thai</th>
                  <th className="px-4 py-3 font-medium">Ngay tao</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {loading && orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-neon-violet" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-text-muted">
                      Khong co don hang nao.
                    </td>
                  </tr>
                ) : (
                  filtered.map(o => (
                    <tr key={o.id} className="border-b border-darkborder hover:bg-darkbg/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                        {o.orderCode}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-text-primary">{o.user.fullName || o.user.username}</div>
                        <div className="text-xs text-text-muted">{o.user.email}</div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary max-w-xs truncate">
                        {o.course.title}
                      </td>
                      <td className="px-4 py-3 text-text-primary font-medium">
                        {formatPrice(o.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 text-xs rounded-lg border ${STATUS_BADGE[o.status].cls}`}>
                          {STATUS_BADGE[o.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-muted text-xs">
                        {formatDate(o.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openDrawer(o)}
                          className="inline-flex items-center gap-1 text-neon-violet hover:text-neon-indigo text-xs"
                        >
                          <Eye className="w-4 h-4" />
                          Chi tiet
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-darkborder text-sm text-text-muted">
              <span>{total} don hang</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-lg border border-darkborder disabled:opacity-30"
                >
                  Truoc
                </button>
                <span className="px-3 py-1 text-text-primary">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded-lg border border-darkborder disabled:opacity-30"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-darkcard border-l border-darkborder z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-heading font-bold text-text-primary">
                    Chi tiet don hang
                  </h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 hover:bg-darkbg rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <Row icon={Hash} label="Ma don" value={selected.orderCode} mono />
                  <Row icon={User} label="Hoc vien" value={`${selected.user.fullName || selected.user.username} (${selected.user.email})`} />
                  <Row icon={BookOpen} label="Khoa hoc" value={selected.course.title} />
                  <Row icon={CreditCard} label="So tien" value={formatPrice(selected.amount)} />
                  <Row icon={Calendar} label="Ngay tao" value={formatDate(selected.createdAt)} />
                  {selected.paymentPayDate && (
                    <Row icon={Calendar} label="Ngay thanh toan" value={formatDate(selected.paymentPayDate)} />
                  )}
                  {selected.paymentBankCode && (
                    <Row icon={CreditCard} label="Ngan hang" value={selected.paymentBankCode} />
                  )}
                  {selected.paymentTxnNo && (
                    <Row icon={Hash} label="VNPay txn" value={selected.paymentTxnNo} mono />
                  )}
                  <div>
                    <span className={`inline-block px-2 py-1 text-xs rounded-lg border ${STATUS_BADGE[selected.status].cls}`}>
                      {STATUS_BADGE[selected.status].label}
                    </span>
                    {selected.enrolled && (
                      <span className="ml-2 inline-block px-2 py-1 text-xs rounded-lg border bg-neon-violet/15 text-neon-violet border-neon-violet/30">
                        Da enroll
                      </span>
                    )}
                  </div>
                </div>

                {selected.status === 'REFUNDED' && (
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-sm">
                    <p className="text-orange-300 font-medium">Đa hoan tien</p>
                    <p className="text-text-secondary mt-1">
                      Khoa hoc khong con truy cap neu hoan toan bo.
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
                    VNPay callbacks ({transactions.length})
                  </h3>
                  {txLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-neon-violet" />
                  ) : transactions.length === 0 ? (
                    <p className="text-text-muted text-sm">Chua co callback nao.</p>
                  ) : (
                    <div className="space-y-2">
                      {transactions.map(tx => (
                        <div key={tx.id} className="bg-darkbg border border-darkborder rounded-xl p-3 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-text-muted">
                              {formatDate(tx.createdAt)}
                            </span>
                            <span className={`px-2 py-0.5 rounded ${
                              tx.responseCode === '00'
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}>
                              resp={tx.responseCode || '-'}
                            </span>
                          </div>
                          <div className="text-text-secondary">
                            txn: {tx.gatewayTxnNo || '-'} | bank: {tx.bankCode || '-'} | {formatPrice(tx.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick actions (admin only) */}
                {selected.status === 'PAID' && (
                  <div className="border-t border-darkborder pt-4">
                    <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
                      Hoan tien
                    </h3>
                    <button
                      onClick={() => setShowRefundForm(!showRefundForm)}
                      className="w-full text-left px-3 py-2 bg-orange-500/10 border border-orange-500/30 rounded-xl text-sm text-orange-300 hover:bg-orange-500/20 transition-colors"
                    >
                      Hoan tien (mot phan / toan bo)
                    </button>
                    {showRefundForm && (
                      <div className="mt-3 space-y-3 bg-darkbg border border-darkborder rounded-xl p-3">
                        <div>
                          <label className="block text-xs text-text-muted mb-1">So tien hoan (VND)</label>
                          <input
                            type="number"
                            min="1"
                            max={selected.amount}
                            value={refundAmount}
                            onChange={e => setRefundAmount(e.target.value)}
                            placeholder={`Toan bo: ${selected.amount}`}
                            className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary focus:outline-none focus:border-neon-violet/50"
                          />
                          <p className="text-[10px] text-text-muted mt-1">
                            De trong = hoan toan bo. Toi da: {formatPrice(selected.amount)}.
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs text-text-muted mb-1">Ly do</label>
                          <textarea
                            value={refundReason}
                            onChange={e => setRefundReason(e.target.value)}
                            rows={2}
                            maxLength={500}
                            className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary focus:outline-none focus:border-neon-violet/50"
                            placeholder="Vi du: User yeu cau hoan tien, loi ky thuat..."
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleRefund}
                            disabled={refunding || !refundReason.trim()}
                            className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50"
                          >
                            {refunding ? 'Dang xu ly...' : 'Xac nhan hoan tien'}
                          </button>
                          <button
                            onClick={() => { setShowRefundForm(false); setRefundAmount(''); setRefundReason(''); }}
                            className="px-3 py-2 bg-darkcard border border-darkborder rounded-lg text-sm"
                          >
                            Huy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t border-darkborder pt-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
                    Enrollment
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSetExpiry('+30d')}
                      className="w-full text-left px-3 py-2 bg-darkbg border border-darkborder rounded-xl text-sm hover:border-neon-violet/40 transition-colors"
                    >
                      +30 ngay truy cap
                    </button>
                    <button
                      onClick={() => handleSetExpiry('+1y')}
                      className="w-full text-left px-3 py-2 bg-darkbg border border-darkborder rounded-xl text-sm hover:border-neon-violet/40 transition-colors"
                    >
                      +1 nam truy cap
                    </button>
                    <button
                      onClick={() => handleSetExpiry('clear')}
                      className="w-full text-left px-3 py-2 bg-darkbg border border-darkborder rounded-xl text-sm hover:border-neon-violet/40 transition-colors"
                    >
                      Xoa thoi han (trọn đời)
                    </button>
                    <button
                      onClick={handleRevoke}
                      className="w-full text-left px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-300 hover:bg-red-500/20 transition-colors"
                    >
                      Thu hoi quyen truy cap
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ icon: Icon, label, value, mono }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-text-muted">{label}</div>
        <div className={`text-sm text-text-primary break-all ${mono ? 'font-mono' : ''}`}>
          {value}
        </div>
      </div>
    </div>
  );
}
