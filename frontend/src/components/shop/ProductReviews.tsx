'use client';

import { useEffect, useState } from 'react';
import { Star, Loader2, MessageSquare, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import {
  getProductReviews, postProductReview, deleteMyReview,
  type ProductReviewsResponse,
} from '@/lib/api/shop';

function Stars({ value, onChange, size = 'sm' }: { value: number; onChange?: (v: number) => void; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'w-7 h-7' : 'w-4 h-4';
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star className={`${cls} ${n <= value ? 'text-yellow-400 fill-yellow-400' : 'text-text-muted'}`} />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId, productSlug }: { productId: number; productSlug: string }) {
  const { isAuthenticated, user } = useAuthStore();
  const [data, setData] = useState<ProductReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    getProductReviews(productSlug)
      .then(setData)
      .catch(() => setData({ average: 0, count: 0, reviews: [] }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [productSlug]);

  const myReview = data?.reviews.find((r) => user && r.userId === Number(user.id));

  const submit = async () => {
    setSubmitting(true);
    try {
      await postProductReview(productId, rating, comment.trim() || undefined);
      toast.success('Cảm ơn bạn đã đánh giá!');
      setComment('');
      load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không gửi được đánh giá';
      toast.error(/mua/i.test(msg) ? 'Chỉ khách đã mua sản phẩm mới được đánh giá.' : msg);
    } finally {
      setSubmitting(false);
    }
  };

  const removeMine = async () => {
    if (!myReview) return;
    if (!window.confirm('Xóa đánh giá của bạn?')) return;
    try {
      await deleteMyReview(myReview.id);
      load();
    } catch { toast.error('Không xóa được'); }
  };

  return (
    <div className="mt-16 pt-8 border-t" style={{ borderColor: 'rgba(168,85,247,0.2)' }}>
      <h2 className="text-2xl font-heading font-bold text-text-primary mb-6 flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-neon-violet" />
        Đánh giá sản phẩm
      </h2>

      {/* Summary */}
      <div className="flex items-center gap-4 mb-8">
        <div className="text-center">
          <p className="text-4xl font-heading font-bold text-text-primary">{(data?.average ?? 0).toFixed(1)}</p>
          <Stars value={Math.round(data?.average ?? 0)} />
          <p className="text-xs text-text-muted mt-1">{data?.count ?? 0} đánh giá</p>
        </div>
      </div>

      {/* Write review */}
      {isAuthenticated ? (
        <div className="bg-darkcard border border-darkborder rounded-2xl p-5 mb-8">
          <p className="text-sm font-semibold text-text-primary mb-3">{myReview ? 'Cập nhật đánh giá của bạn' : 'Viết đánh giá'}</p>
          <div className="mb-3"><Stars value={rating} onChange={setRating} size="lg" /></div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm…"
            className="w-full px-4 py-3 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 resize-none mb-3"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={submit}
              disabled={submitting}
              className="px-5 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {myReview ? 'Cập nhật' : 'Gửi đánh giá'}
            </button>
            <p className="text-[11px] text-text-muted">Chỉ khách đã mua sản phẩm mới đánh giá được.</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-text-muted mb-8">Đăng nhập và mua sản phẩm để đánh giá.</p>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-neon-violet" /></div>
      ) : (data?.reviews.length ?? 0) === 0 ? (
        <p className="text-sm text-text-muted text-center py-8">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      ) : (
        <div className="space-y-4">
          {data!.reviews.map((r) => (
            <div key={r.id} className="bg-darkcard border border-darkborder rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-neon-violet/20 flex items-center justify-center text-xs font-bold text-neon-violet">
                    {r.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{r.userName}</p>
                    <Stars value={r.rating} />
                  </div>
                </div>
                {user && r.userId === Number(user.id) && (
                  <button onClick={removeMine} className="text-text-muted hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
              {r.comment && <p className="text-sm text-text-secondary whitespace-pre-wrap">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
