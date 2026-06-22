'use client';

/**
 * Admin / Course Enrollments — list + kick students.
 *
 * Reads from GET /api/v1/payments/admin/enrollments.
 * Kick: DELETE /api/v1/payments/admin/enrollment (body: { userId, courseId })
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Search, Loader2, RefreshCw, UserX, X,
  User, BookOpen, Calendar, CreditCard, KeyRound,
} from 'lucide-react';
import { paymentApi } from '@/lib/api';

interface EnrollmentItem {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string;
  status: string;
  source: string;
  sourceLabel: string;
  sourceType: 'vnpay' | 'code' | 'free';
  user: { id: number; username: string; email: string; fullName: string | null };
  course: { id: number; slug: string; title: string };
  usedCode: string | null;
  orderId: number | null;
  orderStatus: string | null;
}

const SOURCE_BADGE: Record<string, { label: string; cls: string }> = {
  vnpay:  { label: 'VNPAY-QR', cls: 'bg-green-500/15 text-green-300 border-green-500/30' },
  code:    { label: 'Nhap Code', cls: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  free:    { label: 'Mien phi', cls: 'bg-gray-500/15 text-gray-300 border-gray-500/30' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminCourseEnrollmentsPage() {
  const [items, setItems] = useState<EnrollmentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<EnrollmentItem | null>(null);
  const [kicking, setKicking] = useState(false);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await paymentApi.adminListEnrollments({
        keyword: keyword || undefined,
        page,
        pageSize,
      });
      setItems(res.data.data.items);
      setTotal(res.data.data.total);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Khong the tai danh sach hoc vien');
    } finally {
      setLoading(false);
    }
  }, [keyword, page, pageSize]);

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  useEffect(() => { setPage(1); }, [keyword]);

  const handleKick = async () => {
    if (!confirmTarget) return;
    setKicking(true);
    try {
      await paymentApi.adminRevokeEnrollment(confirmTarget.userId, confirmTarget.courseId);
      toast.success(`Đã xóa ${confirmTarget.user.fullName || confirmTarget.user.email} khỏi khóa học`);
      setConfirmTarget(null);
      fetchEnrollments();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Khong the xoa hoc vien');
    } finally {
      setKicking(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkbg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary">
              Hoc vien khoa hoc
            </h1>
            <p className="text-text-muted mt-1">
              Danh sach hoc vien da dang ky — xem, kick hoc vien
            </p>
          </div>
          <button
            onClick={fetchEnrollments}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-darkcard border border-darkborder rounded-xl text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Lam moi
          </button>
        </div>

        {/* Filters */}
        <div className="bg-darkcard border border-darkborder rounded-2xl p-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Tim theo ten, email hoc vien, ten khoa hoc..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-darkbg/50 border-b border-darkborder">
                <tr className="text-text-muted text-left">
                  <th className="px-4 py-3 font-medium">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" /> Hoc vien
                    </span>
                  </th>
                  <th className="px-4 py-3 font-medium">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" /> Khoa hoc
                    </span>
                  </th>
                  <th className="px-4 py-3 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Ngay tham gia
                    </span>
                  </th>
                  <th className="px-4 py-3 font-medium">Hinh thuc</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {loading && items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-neon-violet" />
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-text-muted">
                      Khong co hoc vien nao.
                    </td>
                  </tr>
                ) : (
                  items.map(item => (
                    <tr key={item.id} className="border-b border-darkborder hover:bg-darkbg/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-text-primary font-medium">
                          {item.user.fullName || item.user.username}
                        </div>
                        <div className="text-xs text-text-muted">{item.user.email}</div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary max-w-xs">
                        <div className="truncate">{item.course.title}</div>
                        {item.usedCode && (
                          <div className="text-xs text-text-muted mt-0.5">
                            Code: <span className="font-mono text-neon-violet">{item.usedCode}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-text-muted text-xs">
                        {formatDate(item.enrolledAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 text-xs rounded-lg border ${SOURCE_BADGE[item.sourceType]?.cls ?? SOURCE_BADGE.free.cls}`}>
                          {item.sourceLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setConfirmTarget(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          Kick
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
              <span>{total} hoc vien</span>
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

      {/* Kick Confirm Modal */}
      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-darkcard border border-darkborder rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-darkborder">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                  <UserX className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-text-primary">Xác nhận kick hoc vien</h2>
              </div>
              <button
                onClick={() => setConfirmTarget(null)}
                className="p-1 rounded-lg hover:bg-darkbg transition-colors"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-text-secondary text-sm">
                Ban muon kick hoc vien nay khoi khóa học?
              </p>

              <div className="bg-darkbg rounded-xl p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-muted">
                  <User className="w-4 h-4" />
                  <span className="font-medium text-text-primary">
                    {confirmTarget.user.fullName || confirmTarget.user.username}
                  </span>
                  <span className="text-text-muted">{confirmTarget.user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-text-secondary truncate">{confirmTarget.course.title}</span>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                  {confirmTarget.sourceType === 'vnpay' ? (
                    <CreditCard className="w-4 h-4" />
                  ) : confirmTarget.sourceType === 'code' ? (
                    <KeyRound className="w-4 h-4" />
                  ) : (
                    <Calendar className="w-4 h-4" />
                  )}
                  <span>{confirmTarget.sourceLabel}</span>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-300">
                <strong>Canh bao:</strong> Hoc vien nay se mat quyen truy cap ngay lap tuc.
                Khoa hoc se khong con hien thi trong trang Hoc Vien.
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-darkborder">
              <button
                onClick={() => setConfirmTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-darkborder text-text-secondary hover:bg-darkbg transition-colors"
              >
                Huy
              </button>
              <button
                onClick={handleKick}
                disabled={kicking}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {kicking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Dang xoa...
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4" />
                    Xac nhan kick
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
