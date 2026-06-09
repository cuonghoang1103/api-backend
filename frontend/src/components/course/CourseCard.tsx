'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Users, BookOpen, Clock, Play, ShoppingCart, Check } from 'lucide-react';
import type { Course } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

function formatDuration(seconds: number): string {
  if (!seconds) return '0 min';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

function formatPrice(price: number, isFree: boolean): string {
  if (isFree) return 'Free';
  if (price === 0) return 'Free';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export default function CourseCard({ course }: { course: Course }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const addAcademyItem = useCartStore((s) => s.addAcademyItem);
  const isInCartFn = useCartStore((s) => s.isInCart);

  const hasDiscount = course.discountPrice && course.discountPrice > 0;
  const inCart = mounted ? isInCartFn('academy', undefined, course.id) : false;
  const isFree = course.isFree || course.price === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart || course.isEnrolled) return;
    addAcademyItem(course);
    toast.success('Đã thêm khóa học vào giỏ hàng!');
  };

  return (
    <Link href={`/courses/${course.slug}`} className="group block">
      <div className="bg-darkcard border border-darkborder/50 rounded-2xl overflow-hidden hover:border-neon-violet/30 transition-all duration-300 hover:shadow-lg hover:shadow-neon-violet/5 hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {course.isFeatured && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-neon-violet/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
              Featured
            </span>
          )}
          {course.isFree && (
            <span className="absolute top-3 right-3 px-2.5 py-1 bg-green-500/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
              Free
            </span>
          )}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded-full px-2.5 py-1 text-white text-xs">
            <Play className="w-3.5 h-3.5" />
            <span>{course.totalLessons} lessons</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            {course.categoryName && (
              <span className="px-2 py-0.5 bg-neon-indigo/10 text-neon-indigo text-xs rounded-full font-medium">
                {course.categoryName}
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              course.level === 'BEGINNER' ? 'bg-green-500/10 text-green-400' :
              course.level === 'INTERMEDIATE' ? 'bg-yellow-500/10 text-yellow-400' :
              'bg-red-500/10 text-red-400'
            }`}>
              {course.level === 'BEGINNER' ? 'Beginner' :
               course.level === 'INTERMEDIATE' ? 'Intermediate' :
               course.level === 'ADVANCED' ? 'Advanced' : course.level}
            </span>
          </div>

          <h3 className="text-text-primary font-semibold text-base leading-snug mb-2 line-clamp-2 group-hover:text-neon-violet transition-colors">
            {course.title}
          </h3>

          {course.shortDescription && (
            <p className="text-text-muted text-sm line-clamp-2 mb-3">
              {course.shortDescription}
            </p>
          )}

          {course.instructorName && (
            <p className="text-text-muted text-xs mb-4 flex items-center gap-1.5">
              <img
                src={course.instructorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructorName)}&background=random`}
                alt={course.instructorName}
                className="w-5 h-5 rounded-full"
              />
              {course.instructorName}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-text-muted text-xs mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(course.totalDurationSeconds)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {course.totalStudents.toLocaleString('vi-VN')} students
            </span>
            {course.avgRating > 0 && (
              <span className="flex items-center gap-1 text-yellow-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                {Number(course.avgRating).toFixed(1)}
              </span>
            )}
          </div>

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between pt-3 border-t border-darkborder/30">
            <div className="flex items-center gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-lg font-bold text-neon-violet">
                    {formatPrice(Number(course.discountPrice), false)}
                  </span>
                  <span className="text-sm text-text-muted line-through">
                    {formatPrice(Number(course.price), false)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-neon-violet">
                  {formatPrice(Number(course.price), course.isFree)}
                </span>
              )}
            </div>

            {/* Add to cart button for non-free, non-enrolled courses */}
            {!isFree && !course.isEnrolled && (
              <button
                onClick={handleAddToCart}
                disabled={inCart}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  inCart
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                    : 'bg-neon-violet/20 hover:bg-neon-violet/30 border border-neon-violet/40 text-neon-violet hover:shadow-neon-sm'
                }`}
                title={inCart ? 'Đã có trong giỏ hàng' : 'Thêm vào giỏ hàng'}
              >
                {inCart ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Đã thêm
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Thêm
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
