'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, Loader2 } from 'lucide-react';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import type { CourseReview } from '@/types';

interface ReviewsProps {
  reviews: CourseReview[];
  avgRating: number;
  totalReviews: number;
  courseId?: number;
  onReviewAdded?: (review: CourseReview) => void;
}

function RatingBar({ label, percent }: { label: string; percent: number }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-text-muted w-8">{label}</span>
      <div className="flex-1 h-2 bg-darkbg rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-text-muted w-10 text-right">{Math.round(percent)}%</span>
    </div>
  );
}

export default function Reviews({ reviews, avgRating, totalReviews, courseId, onReviewAdded }: ReviewsProps) {
  const { isAuthenticated } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;
    setSubmitting(true);
    try {
      const res = await coursesApi.createReview({
        courseId,
        rating,
        title: title.trim() || undefined,
        content: content.trim() || undefined,
      });
      toast.success('Review submitted successfully!');
      const newReview = res.data.data;
      if (newReview && onReviewAdded) onReviewAdded(newReview);
      setShowForm(false);
      setRating(5);
      setTitle('');
      setContent('');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percent: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header + Write Review button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading font-bold text-text-primary">
          {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
        </h3>
        {isAuthenticated && courseId && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
        {!isAuthenticated && (
          <p className="text-xs text-text-muted">Login to write a review</p>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleSubmit}
          className="bg-darkcard border border-darkborder rounded-2xl p-6 space-y-4"
        >
          <h4 className="text-sm font-semibold text-text-primary">Your Rating</h4>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-text-muted'
                  }`}
                />
              </button>
            ))}
            <span className="text-sm text-text-muted ml-2">
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Review Title (optional)</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your experience"
              maxLength={100}
              className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Your Review</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience with this course..."
              rows={4}
              className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 resize-y"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary hover:border-neon-violet/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </motion.form>
      )}

      {/* Rating summary */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="flex flex-col items-center justify-center p-6 bg-darkcard border border-darkborder rounded-2xl min-w-[160px]">
          <p className="text-5xl font-bold text-text-primary font-heading">{avgRating.toFixed(1)}</p>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-text-muted'}`}
              />
            ))}
          </div>
          <p className="text-sm text-text-muted mt-1">{totalReviews} reviews</p>
        </div>

        <div className="flex-1 space-y-1.5 p-4 bg-darkcard border border-darkborder rounded-2xl">
          {ratingCounts.map(({ star, percent }) => (
            <RatingBar key={star} label={String(star)} percent={percent} />
          ))}
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-4">
        {reviews.length > 0 ? reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-darkcard border border-darkborder rounded-2xl p-5"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
                {review.userAvatar ? (
                  <img src={review.userAvatar} alt={review.userFullName} className="w-full h-full object-cover" />
                ) : (
                  (review.userFullName || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-text-primary">{review.userFullName}</p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-text-muted'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-text-muted">
                    {new Date(review.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {review.title && (
                  <p className="text-sm font-medium text-text-primary mt-2">{review.title}</p>
                )}
                {review.content && (
                  <p className="text-sm text-text-secondary mt-1 leading-relaxed">{review.content}</p>
                )}
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-12 bg-darkcard border border-darkborder rounded-2xl">
            <Star className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
            <p className="text-text-muted">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
}
