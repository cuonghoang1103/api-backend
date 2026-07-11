'use client';

import { useEffect, useState } from 'react';
import { Star, Loader2, Trash2, Eye, EyeOff } from 'lucide-react';
import { adminReviewsApi, type AdminReview } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    adminReviewsApi.list()
      .then((res) => setReviews(res.data?.data || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toggle = async (r: AdminReview) => {
    setBusyId(r.id);
    try {
      await adminReviewsApi.moderate(r.id, !r.isApproved);
      setReviews((prev) => prev.map((x) => (x.id === r.id ? { ...x, isApproved: !x.isApproved } : x)));
      toast.success(!r.isApproved ? 'Đã hiển thị đánh giá' : 'Đã ẩn đánh giá');
    } catch { toast.error('Thất bại'); } finally { setBusyId(null); }
  };

  const remove = async (r: AdminReview) => {
    if (!confirm('Xoá vĩnh viễn đánh giá này?')) return;
    setBusyId(r.id);
    try {
      await adminReviewsApi.remove(r.id);
      setReviews((prev) => prev.filter((x) => x.id !== r.id));
      toast.success('Đã xoá');
    } catch { toast.error('Thất bại'); } finally { setBusyId(null); }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-1">Duyệt đánh giá khoá học</h1>
      <p className="text-text-secondary text-sm mb-6">Ẩn/hiện hoặc xoá đánh giá của học viên. Đánh giá bị ẩn không hiện trên trang khoá học và không tính vào điểm trung bình.</p>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-neon-violet" /></div>
      ) : reviews.length === 0 ? (
        <p className="text-text-muted text-center py-12">Chưa có đánh giá nào.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className={`rounded-2xl border p-4 ${r.isApproved ? 'border-darkborder bg-darkcard' : 'border-red-500/30 bg-red-500/5'}`}>
              <div className="flex items-start gap-3">
                <img src={r.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.userFullName)}&size=40`} alt="" className="w-9 h-9 rounded-full" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-text-primary">{r.userFullName}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-darkborder'}`} />
                      ))}
                    </div>
                    {!r.isApproved && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400">Đang ẩn</span>}
                    <span className="text-xs text-text-muted ml-auto">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  {r.course && <p className="text-xs text-neon-violet mt-0.5">{r.course.title}</p>}
                  {r.content && <p className="text-sm text-text-secondary mt-1">{r.content}</p>}
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button onClick={() => toggle(r)} disabled={busyId === r.id} className="p-2 rounded-lg border border-darkborder text-text-secondary hover:text-text-primary" title={r.isApproved ? 'Ẩn' : 'Hiện'}>
                    {busyId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : r.isApproved ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => remove(r)} disabled={busyId === r.id} className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10" title="Xoá">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
