'use client';

import { motion } from 'framer-motion';
import { Play, CheckCircle, Lock, FileText, Clock } from 'lucide-react';
import Link from 'next/link';
import type { CourseSection } from '@/types';
import { useState } from 'react';

interface LessonItemData {
  id: number;
  sectionId?: number;
  title: string;
  slug?: string;
  description?: string;
  content?: string;
  lessonType: string;
  videoUrl?: string;
  videoDurationSeconds: number;
  thumbnailUrl?: string;
  isFreePreview: boolean;
  isPublished: boolean;
  sortOrder: number;
  isCompleted?: boolean;
}

interface CurriculumProps {
  sections: CourseSection[];
  enrolled?: boolean;
  completedLessonIds?: number[];
  /**
   * Course slug — used to build the link to the lesson player.
   * If omitted, lesson items are still rendered (locked state is
   * honoured) but won't be clickable.
   */
  courseSlug?: string;
}

function formatLessonDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) return `${mins}:${secs.toString().padStart(2, '0')}`;
  return `0:${secs}`;
}

function LessonItem({
  lesson,
  enrolled,
  index,
  href,
}: {
  lesson: LessonItemData;
  enrolled?: boolean;
  index: number;
  href?: string;
}) {
  const isFreePreview = lesson.isFreePreview;
  const isLocked = !enrolled && !isFreePreview;

  const inner = (
    <>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        lesson.isCompleted
          ? 'bg-green-500/20 text-green-400'
          : isLocked
          ? 'bg-darkbg text-text-muted'
          : 'bg-neon-indigo/20 text-neon-indigo'
      }`}>
        {isLocked ? (
          <Lock className="w-4 h-4" />
        ) : lesson.isCompleted ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 fill-current" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${isLocked ? 'text-text-muted' : 'text-text-primary'}`}>
          {index + 1}. {lesson.title}
        </p>
        {lesson.description && (
          <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{lesson.description}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {isFreePreview && !isLocked && (
          <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Preview
          </span>
        )}
        <span className="text-xs text-text-muted flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatLessonDuration(lesson.videoDurationSeconds || 0)}
        </span>
      </div>
    </>
  );

  // Render as a real link when we have a course slug and the lesson is
  // accessible. Otherwise fall back to the static (non-clickable) row
  // so the layout stays consistent.
  if (href && !isLocked) {
    return (
      <Link
        href={href}
        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
      >
        {inner}
      </Link>
    );
  }
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
      isLocked ? 'opacity-60' : 'hover:bg-white/5 cursor-pointer'
    }`}>
      {inner}
    </div>
  );
}

export default function Curriculum({ sections, enrolled, completedLessonIds, courseSlug }: CurriculumProps) {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set(sections.map(s => s.id)));

  const toggleSection = (id: number) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-heading font-bold text-text-primary">Course Curriculum</h3>
      <p className="text-sm text-text-muted">
        {sections.length} sections &bull; {sections.reduce((acc, s) => acc + (s.lessonCount || 0), 0)} lessons
      </p>

      <div className="space-y-2 mt-4">
        {sections.map((section, si) => {
          const isOpen = openSections.has(section.id);
          return (
            <div key={section.id} className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="text-neon-violet font-semibold text-sm">{si + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{section.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {section.lessonCount} lessons &bull; {formatLessonDuration(section.totalDurationSeconds || 0)}
                    </p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && section.lessons && (
                <div className="px-3 pb-3 space-y-1">
                  {section.lessons.map((lesson, li) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={{ ...lesson, isCompleted: completedLessonIds?.includes(lesson.id) }}
                      enrolled={enrolled}
                      index={li}
                      href={courseSlug ? `/courses/${courseSlug}/learn?lessonId=${lesson.id}` : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
