'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Users, Clock, PlayCircle, ShoppingCart, Check, ArrowRight, CircleCheck } from 'lucide-react';
import type { Course } from '@/types';
import { useTranslation } from '@/context/LocaleContext';
import { pickLang } from '@/lib/utils';
import { AnhDaiDien } from '@/components/ui/AnhDaiDien';
import { useCartStore } from '@/store/cartStore';
import { COURSE_PAYMENT_ENABLED } from '@/lib/featureFlags';
import { toast } from 'sonner';

function formatDuration(seconds: number): string {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
  return `${Math.max(m, 1)} phút`;
}

function formatPrice(price: number, isFree: boolean): string {
  if (isFree) return 'Miễn phí';
  if (price === 0) return 'Miễn phí';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

const CAP_DO: Record<string, { nhan: string; lop: string; cham: string }> = {
  BEGINNER: { nhan: 'Cơ bản', lop: 'bg-emerald-500/10 text-emerald-700 [.theme-dark_&]:text-emerald-300 border-emerald-500/25', cham: 'bg-emerald-400' },
  INTERMEDIATE: { nhan: 'Trung cấp', lop: 'bg-amber-500/10 text-amber-800 [.theme-dark_&]:text-amber-300 border-amber-500/25', cham: 'bg-amber-400' },
  ADVANCED: { nhan: 'Nâng cao', lop: 'bg-rose-500/10 text-rose-700 [.theme-dark_&]:text-rose-300 border-rose-500/25', cham: 'bg-rose-400' },
};

export default function CourseCard({ course }: { course: Course }) {
  const { locale } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [anhLoi, setAnhLoi] = useState(false);

  const addAcademyItem = useCartStore((s) => s.addAcademyItem);
  const isInCartFn = useCartStore((s) => s.isInCart);

  const hasDiscount = course.discountPrice && course.discountPrice > 0;
  const inCart = mounted ? isInCartFn('academy', undefined, course.id) : false;
  const isFree = course.isFree || course.price === 0;
  const capDo = CAP_DO[course.level];
  const thoiLuong = formatDuration(course.totalDurationSeconds);
  // Tiến độ chỉ có khi API trả kèm (bản gọn của /courses KHÔNG trả) — có thì vẽ, không thì thôi.
  const tienDo = course.isEnrolled && typeof course.enrollmentProgress === 'number'
    ? Math.max(0, Math.min(100, Math.round(course.enrollmentProgress)))
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart || course.isEnrolled) return;
    addAcademyItem(course);
    toast.success('Đã thêm khóa học vào giỏ hàng!');
  };

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
    >
      <article className="[--text-muted:#65686d] [.theme-dark_&]:[--text-muted:#8a8d91] relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--border-color)_70%,transparent)] bg-[var(--bg-card)] shadow-[0_1px_2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.08)] [.theme-dark_&]:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:border-neon-violet/40 group-hover:shadow-[0_18px_40px_-16px_rgba(15,23,42,0.22),0_10px_30px_-12px_rgba(139,92,246,0.35)] [.theme-dark_&]:group-hover:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_18px_40px_-14px_rgba(0,0,0,0.7),0_10px_30px_-12px_rgba(139,92,246,0.45)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        {/* Ảnh bìa 16:9 */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-neon-indigo/30 via-[var(--bg-primary)] to-neon-violet/20">
          {!anhLoi && (
            <img
              src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
              alt={course.title}
              loading="lazy"
              decoding="async"
              onError={() => setAnhLoi(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10" />

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 pr-20">
            {course.isFeatured && (
              <span className="rounded-full bg-neon-violet/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg backdrop-blur-sm">
                ★ Nổi bật
              </span>
            )}
            {course.courseCode && (
              <span className="rounded-full bg-black/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-white backdrop-blur-sm">
                {course.courseCode}
              </span>
            )}
          </div>
          {course.isFree && (
            <span className="absolute right-3 top-3 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg backdrop-blur-sm">
              Miễn phí
            </span>
          )}

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
              <PlayCircle className="h-3.5 w-3.5" />
              {course.totalLessons.toLocaleString('vi-VN')} bài
            </span>
            {course.isEnrolled && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                <CircleCheck className="h-3.5 w-3.5" /> Đã ghi danh
              </span>
            )}
          </div>
        </div>

        {/* Nội dung */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex min-w-0 flex-wrap items-center gap-1.5">
            {capDo ? (
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${capDo.lop}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${capDo.cham}`} />
                {capDo.nhan}
              </span>
            ) : course.level ? (
              <span className="rounded-full border border-[var(--border-color)] px-2 py-0.5 text-[11px] font-medium text-text-muted">
                {course.level}
              </span>
            ) : null}
            {course.categoryName && (
              <span className="max-w-[60%] truncate rounded-full bg-neon-indigo/10 px-2 py-0.5 text-[11px] font-medium text-indigo-700 [.theme-dark_&]:text-indigo-300">
                {course.categoryName}
              </span>
            )}
          </div>

          <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-text-primary transition-colors group-hover:text-violet-700 [.theme-dark_&]:group-hover:text-violet-300">
            {pickLang(course.title, locale)}
          </h3>

          {course.shortDescription && (
            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-text-muted">
              {pickLang(course.shortDescription, locale)}
            </p>
          )}

          <div className="mt-auto">
            {course.instructorName && (
              <p className="mb-3 flex min-w-0 items-center gap-2 text-xs text-text-secondary">
                <AnhDaiDien src={course.instructorAvatar} ten={course.instructorName} className="h-5 w-5" />
                <span className="truncate">{course.instructorName}</span>
              </p>
            )}

            {/* Số liệu */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-muted">
              {thoiLuong && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {thoiLuong}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {course.totalStudents.toLocaleString('vi-VN')} học viên
              </span>
              {course.avgRating > 0 && (
                <span className="flex items-center gap-1 text-amber-800 [.theme-dark_&]:text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {Number(course.avgRating).toFixed(1)}
                  {course.totalReviews > 0 && <span className="text-text-muted">({course.totalReviews})</span>}
                </span>
              )}
            </div>

            {tienDo != null && (
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-text-muted">Tiến độ</span>
                  <span className="font-semibold tabular-nums text-text-primary">{tienDo}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.07] [.theme-dark_&]:bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-neon-indigo to-neon-violet"
                    style={{ width: `${tienDo}%` }}
                  />
                </div>
              </div>
            )}

            {/* Price + Add to Cart — hidden while course payment is disabled
                (see lib/featureFlags.ts). Free/enrol state still shown via the
                thumbnail "Miễn phí" badge and the course page's enrol buttons. */}
            {COURSE_PAYMENT_ENABLED ? (
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-[color-mix(in_srgb,var(--border-color)_40%,transparent)] pt-3">
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
                  {hasDiscount ? (
                    <>
                      <span className="text-lg font-bold text-violet-700 [.theme-dark_&]:text-violet-300">
                        {formatPrice(Number(course.discountPrice), false)}
                      </span>
                      <span className="text-sm text-text-muted line-through">
                        {formatPrice(Number(course.price), false)}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-violet-700 [.theme-dark_&]:text-violet-300">
                      {formatPrice(Number(course.price), course.isFree)}
                    </span>
                  )}
                </div>

                {/* Add to cart button for non-free, non-enrolled courses */}
                {!isFree && !course.isEnrolled && (
                  <button
                    onClick={handleAddToCart}
                    disabled={inCart}
                    className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      inCart
                        ? 'cursor-default border border-green-500/30 bg-green-500/20 text-green-700 [.theme-dark_&]:text-green-400'
                        : 'border border-neon-violet/40 bg-neon-violet/20 text-violet-800 [.theme-dark_&]:text-neon-violet hover:bg-neon-violet/30 hover:shadow-neon-sm'
                    }`}
                    title={inCart ? 'Đã có trong giỏ hàng' : 'Thêm vào giỏ hàng'}
                  >
                    {inCart ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Đã thêm
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Thêm
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-between border-t border-[color-mix(in_srgb,var(--border-color)_40%,transparent)] pt-3 text-xs font-medium">
                <span className="text-text-muted">{course.isEnrolled ? 'Tiếp tục khoá học' : 'Xem chi tiết khoá học'}</span>
                <ArrowRight className="h-4 w-4 text-violet-700 [.theme-dark_&]:text-neon-violet transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
