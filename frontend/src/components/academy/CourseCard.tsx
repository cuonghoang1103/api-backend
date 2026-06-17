'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Users, Clock, BookOpen, Play } from 'lucide-react';
import type { Course } from '@/types';
import { SafeImage } from '@/components/ui/SafeImage';

interface CourseCardProps {
  course: Course;
  index?: number;
}

function formatPrice(price: number, isFree: boolean) {
  if (isFree || price === 0) return { label: 'Free', className: 'bg-green-500/20 text-green-400 border-green-500/30' };
  return { label: `${price.toLocaleString('vi-VN')} VND`, className: 'bg-neon-indigo/20 text-neon-indigo border-neon-indigo/30' };
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export default function CourseCard({ course, index = 0 }: CourseCardProps) {
  const priceInfo = formatPrice(course.price, course.isFree);
  const duration = formatDuration(course.totalDurationSeconds || 0);
  const levelColor = course.level === 'BEGINNER' ? 'text-green-400' :
    course.level === 'INTERMEDIATE' ? 'text-yellow-400' : 'text-red-400';

  const levelLabel = course.level === 'BEGINNER' ? 'Beginner' :
    course.level === 'INTERMEDIATE' ? 'Intermediate' :
    course.level === 'ADVANCED' ? 'Advanced' : course.level;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group"
    >
      <div className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden hover:border-neon-violet/40 transition-all duration-300 flex flex-col h-full">
        {/* Thumbnail */}
        <Link href={`/academy/courses/${course.slug}`} className="block relative aspect-video overflow-hidden">
          {course.thumbnailUrl ? (
            <SafeImage
              src={course.thumbnailUrl}
              alt={course.title}
              label={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neon-indigo/30 to-neon-violet/30 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-neon-violet/40" />
            </div>
          )}
          {/* Overlay play button */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${priceInfo.className}`}>
              {priceInfo.label}
            </span>
            {course.isFeatured && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-neon-fuchsia/20 text-neon-fuchsia border border-neon-fuchsia/30">
                Featured
              </span>
            )}
          </div>
          {/* Level badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium bg-black/50 backdrop-blur-sm ${levelColor}`}>
              {levelLabel}
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Category */}
          {course.categoryName && (
            <span className="text-xs text-neon-violet font-medium mb-2">{course.categoryName}</span>
          )}

          {/* Title */}
          <Link href={`/academy/courses/${course.slug}`}>
            <h3 className="text-base font-heading font-bold text-text-primary group-hover:text-neon-violet transition-colors line-clamp-2 mb-2">
              {course.title}
            </h3>
          </Link>

          {/* Short desc */}
          {course.shortDescription && (
            <p className="text-xs text-text-muted line-clamp-2 mb-4 flex-1">{course.shortDescription}</p>
          )}

          {/* Schedule — show start/end dates for FPT academy courses
              (and any other course that has them set). Helps students
              know when the cohort opens/closes. */}
          {(course.startDate || course.endDate) && (
            <div className="text-xs text-text-muted mb-3 px-3 py-2 rounded-lg bg-darkbg border border-darkborder/40">
              <span className="text-neon-violet font-medium">Khai giảng: </span>
              {course.startDate
                ? new Date(course.startDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : '—'}
              <span className="mx-2 text-text-muted/50">→</span>
              {course.endDate
                ? new Date(course.endDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : '—'}
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{course.totalLessons || 0} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{(course.totalStudents || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Rating + Enroll */}
          <div className="flex items-center justify-between pt-3 border-t border-darkborder/50">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-text-primary">{course.avgRating?.toFixed(1) || '0.0'}</span>
              <span className="text-xs text-text-muted">({course.totalReviews || 0})</span>
            </div>
            <Link
              href={`/academy/courses/${course.slug}`}
              className="text-sm font-medium text-neon-violet hover:text-neon-indigo transition-colors"
            >
              View Course
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
