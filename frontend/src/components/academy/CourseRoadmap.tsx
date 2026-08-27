'use client';

// Lộ trình học TƯƠNG TÁC cho một khoá Academy — thay bản đồ HTML tĩnh (.lz-map).
// Sinh trực tiếp từ course.sections (đã liên kết LessonProgress), nên mỗi chương/
// bài có trạng thái ĐÃ HỌC thật. Không gọi API mới: mọi dữ liệu do trang learn
// truyền vào. Bấm một bài → nhảy tới bài đó (dùng lại selectLesson của trang).

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Map as MapIcon, Target } from 'lucide-react';
import type { CourseSection, LessonDto } from '@/types';

type Goal = 'pass' | 'good';

interface Props {
  sections: CourseSection[];
  isCompleted: (lessonId: number) => boolean;
  currentLessonId?: number;
  overallProgress: number;
  courseId: number;
  onJump: (lesson: LessonDto) => void;
}

export function CourseRoadmap({ sections, isCompleted, currentLessonId, overallProgress, courseId, onJump }: Props) {
  // Chương xếp theo thứ tự; bài trong chương cũng vậy.
  const ordered = useMemo(
    () => [...sections].sort((a, b) => a.sortOrder - b.sortOrder)
      .map((s) => ({ ...s, lessons: [...(s.lessons ?? [])].sort((a, b) => a.sortOrder - b.sortOrder) })),
    [sections],
  );

  const allLessons = useMemo(() => ordered.flatMap((s) => s.lessons ?? []), [ordered]);
  const total = allLessons.length;
  const done = allLessons.filter((l) => isCompleted(l.id)).length;
  const remaining = Math.max(0, total - done);

  // Chương chứa bài đang học → mở sẵn.
  const currentSectionId = useMemo(
    () => ordered.find((s) => s.lessons?.some((l) => l.id === currentLessonId))?.id,
    [ordered, currentLessonId],
  );
  const [open, setOpen] = useState<Set<number>>(() => new Set(currentSectionId != null ? [currentSectionId] : []));
  useEffect(() => {
    if (currentSectionId != null) setOpen((p) => (p.has(currentSectionId) ? p : new Set(p).add(currentSectionId)));
  }, [currentSectionId]);
  const toggle = (id: number) => setOpen((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  // Mục tiêu điểm — CHỈ client, nhớ theo localStorage. Không hứa điểm, chỉ tạo
  // động lực + nhịp học.
  const [goal, setGoal] = useState<Goal>('pass');
  useEffect(() => {
    try { const v = localStorage.getItem(`ct-goal-${courseId}`); if (v === 'good' || v === 'pass') setGoal(v); } catch { /* ignore */ }
  }, [courseId]);
  const pickGoal = (g: Goal) => { setGoal(g); try { localStorage.setItem(`ct-goal-${courseId}`, g); } catch { /* ignore */ } };

  const goalNote = goal === 'good'
    ? 'Mục tiêu 8–9: học kỹ từng bài + luyện đề mỗi chương sau khi học xong.'
    : 'Mục tiêu qua môn (6–7): hoàn tất lộ trình là nền tảng vững để đi thi.';

  return (
    <div className="space-y-4">
      {/* Tổng quan tiến độ + mục tiêu */}
      <div className="rounded-xl bg-darkbg/40 border border-darkborder/50 p-4">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-sm font-medium text-text-primary">Tiến độ khoá học</span>
          <span className="text-sm font-bold text-neon-violet">{overallProgress}%</span>
        </div>
        <div className="h-2 rounded-full bg-darkborder/60 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-neon-indigo to-neon-violet transition-all" style={{ width: `${overallProgress}%` }} />
        </div>
        <p className="mt-2 text-xs text-text-muted">
          Đã xong <span className="text-text-secondary font-medium">{done}/{total}</span> bài
          {remaining > 0 ? <> — còn <span className="text-text-secondary font-medium">{remaining}</span> bài để hoàn tất lộ trình.</> : ' — hoàn tất lộ trình 🎉'}
        </p>

        {/* Mục tiêu điểm */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-text-muted"><Target className="w-3.5 h-3.5" /> Mục tiêu điểm:</span>
          <div className="inline-flex rounded-lg border border-darkborder/60 overflow-hidden">
            {([['pass', 'Qua môn (6–7)'], ['good', 'GPA khá (8–9)']] as [Goal, string][]).map(([g, label]) => (
              <button
                key={g}
                onClick={() => pickGoal(g)}
                aria-pressed={goal === g}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${goal === g ? 'bg-neon-indigo/20 text-neon-indigo' : 'text-text-muted hover:text-text-secondary'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2 text-xs text-text-muted italic">{goalNote}</p>
      </div>

      {/* Lộ trình theo chương */}
      <ol className="relative">
        {ordered.map((section, idx) => {
          const lessons = section.lessons ?? [];
          const dCount = lessons.filter((l) => isCompleted(l.id)).length;
          const tCount = lessons.length;
          const pct = tCount > 0 ? Math.round((dCount / tCount) * 100) : 0;
          const complete = tCount > 0 && dCount === tCount;
          const started = dCount > 0;
          const isOpen = open.has(section.id);
          const hasCurrent = lessons.some((l) => l.id === currentLessonId);
          const isLast = idx === ordered.length - 1;

          return (
            <li key={section.id} className="flex gap-3">
              {/* Rail trái: badge + đường nối */}
              <div className="relative flex flex-col items-center pt-1">
                <div
                  className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    complete ? 'bg-green-500/20 text-green-400'
                      : started ? 'bg-neon-indigo/20 text-neon-indigo'
                        : 'bg-darkborder/50 text-text-muted'
                  }`}
                >
                  {complete ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                {!isLast && <div className="w-px flex-1 bg-darkborder/60 my-1" />}
              </div>

              {/* Nội dung chương */}
              <div className={`flex-1 pb-3 ${isLast ? '' : ''}`}>
                <button
                  onClick={() => toggle(section.id)}
                  aria-expanded={isOpen}
                  className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors ${
                    hasCurrent ? 'bg-neon-indigo/10' : 'hover:bg-darkbg/40'
                  }`}
                >
                  {isOpen ? <ChevronDown className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />}
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-text-primary truncate">{section.title}</span>
                    <span className="block text-xs text-text-muted">{dCount}/{tCount} bài · {pct}%</span>
                  </span>
                  {complete && <span className="shrink-0 rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-green-400">Xong</span>}
                </button>

                {/* Bài trong chương */}
                {isOpen && (
                  <ul className="mt-1 space-y-0.5 pl-2">
                    {lessons.map((lesson) => {
                      const ldone = isCompleted(lesson.id);
                      const isCurrent = lesson.id === currentLessonId;
                      return (
                        <li key={lesson.id}>
                          <button
                            onClick={() => onJump(lesson)}
                            className={`w-full flex items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                              isCurrent ? 'bg-neon-violet/15 text-neon-violet font-medium' : 'text-text-secondary hover:bg-darkbg/40 hover:text-text-primary'
                            }`}
                          >
                            {ldone
                              ? <CheckCircle2 className="w-4 h-4 shrink-0 text-green-400" />
                              : <Circle className="w-4 h-4 shrink-0 text-text-muted" />}
                            <span className="flex-1 min-w-0 truncate">{lesson.title}</span>
                            {isCurrent && <span className="shrink-0 text-[10px] font-bold uppercase text-neon-violet">Đang học</span>}
                          </button>
                        </li>
                      );
                    })}
                    {tCount === 0 && <li className="px-3 py-1.5 text-xs text-text-muted">Chưa có bài trong chương này.</li>}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// Vỏ có tiêu đề gập/mở — dùng ở đầu cột nội dung trang học.
export function CourseRoadmapPanel(props: Props & { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  return (
    <div className="bg-darkcard border border-darkborder/50 rounded-2xl mb-8 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left hover:bg-darkbg/30 transition-colors"
      >
        <span className="flex items-center gap-2">
          <MapIcon className="w-5 h-5 text-neon-violet" />
          <span className="font-semibold text-text-primary">Lộ trình học</span>
          <span className="text-sm text-text-muted">· {props.overallProgress}% hoàn thành</span>
        </span>
        {open ? <ChevronDown className="w-5 h-5 text-text-muted" /> : <ChevronRight className="w-5 h-5 text-text-muted" />}
      </button>
      {open && (
        <div className="px-6 pb-6 pt-1 border-t border-darkborder/40">
          <CourseRoadmap {...props} />
        </div>
      )}
    </div>
  );
}
