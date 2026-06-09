'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Clock, PlayCircle, CheckCircle, ArrowRight, Award } from 'lucide-react';
import type { Enrollment } from '@/types';

interface MyCourseCardProps {
  enrollment: Enrollment;
  index?: number;
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export default function MyCourseCard({ enrollment, index = 0 }: MyCourseCardProps) {
  const isCompleted = enrollment.status === 'COMPLETED' || enrollment.progressPercent === 100;
  const isInProgress = enrollment.status === 'IN_PROGRESS' || (enrollment.progressPercent > 0 && enrollment.progressPercent < 100);

  const statusConfig = isCompleted
    ? { label: 'Completed', className: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle }
    : isInProgress
    ? { label: 'In Progress', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: PlayCircle }
    : { label: 'Not Started', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: BookOpen };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <div className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden hover:border-neon-violet/40 transition-all duration-300">
        <Link href={`/courses/${enrollment.courseSlug}`} className="block relative aspect-video overflow-hidden">
          {enrollment.courseThumbnail ? (
            <img
              src={enrollment.courseThumbnail}
              alt={enrollment.courseTitle}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neon-indigo/30 to-neon-violet/30 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-neon-violet/40" />
            </div>
          )}
          {/* Progress overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
            <div
              className="h-full bg-gradient-to-r from-neon-indigo to-neon-violet transition-all"
              style={{ width: `${enrollment.progressPercent || 0}%` }}
            />
          </div>
        </Link>

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <Link href={`/courses/${enrollment.courseSlug}`}>
              <h3 className="text-sm font-heading font-bold text-text-primary hover:text-neon-violet transition-colors line-clamp-2">
                {enrollment.courseTitle}
              </h3>
            </Link>
            <span className={`shrink-0 px-2 py-0.5 text-xs rounded-md border flex items-center gap-1 ${statusConfig.className}`}>
              <statusConfig.icon className="w-3 h-3" />
              {statusConfig.label}
            </span>
          </div>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-text-muted">Progress</span>
              <span className="text-neon-violet font-semibold">{enrollment.progressPercent || 0}%</span>
            </div>
            <div className="h-2 bg-darkbg rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted
                    ? 'bg-green-500'
                    : 'bg-gradient-to-r from-neon-indigo to-neon-violet'
                }`}
                style={{ width: `${enrollment.progressPercent || 0}%` }}
              />
            </div>
          </div>

          {/* Meta */}
          {enrollment.lastLessonTitle && (
            <p className="text-xs text-text-muted mb-3 line-clamp-1">
              Last: {enrollment.lastLessonTitle}
            </p>
          )}

          {/* CTA */}
          {isCompleted && enrollment.certificateNumber ? (
            <Link
              href={`/certificates/${enrollment.certificateNumber}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium rounded-xl hover:bg-green-500/30 transition-opacity"
            >
              <Award className="w-4 h-4" />
              Xem Chứng Chỉ
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href={`/courses/${enrollment.courseSlug}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              {isCompleted ? (
                <>
                  Review Course
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  Continue Learning
                </>
              )}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
