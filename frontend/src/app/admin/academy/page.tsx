'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, ClipboardList, Code2, ExternalLink, FileText, FolderTree, GraduationCap, Star, Image as ImageIcon, Link2, Pencil, Plus, Save, Send, Settings, Trash2, Video, X } from 'lucide-react';
import { academyApi, adminCoursesApi } from '@/lib/api';
import type { Assignment, Course, LessonDto, Semester, SubmissionWithUser } from '@/types';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import LessonDocumentsManager from '@/components/admin/LessonDocumentsManager';
import { toast } from 'sonner';

interface SemesterFormState {
  name: string;
  code: string;
  ordinal: number;
  description: string;
  isActive: boolean;
}

const emptySemesterForm: SemesterFormState = {
  name: '',
  code: '',
  ordinal: 0,
  description: '',
  isActive: true,
};

function SemesterModal({
  semester,
  existingSemesters,
  onClose,
  onSaved,
}: {
  semester?: Semester;
  existingSemesters: Semester[];
  onClose: () => void;
  onSaved: (saved: Semester) => void;
}) {
  const [form, setForm] = useState<SemesterFormState>(
    semester
      ? { name: semester.name, code: semester.code, ordinal: semester.ordinal, description: semester.description || '', isActive: semester.isActive ?? true }
      : emptySemesterForm
  );
  const [saving, setSaving] = useState(false);

  // Live duplicate check: warn the admin the moment they type a code
  // that already exists on another semester. Without this they'd
  // only learn about the collision after the server 409s.
  const codeConflict = (() => {
    const c = form.code.trim();
    if (!c) return null;
    return existingSemesters.find(
      (s) => s.code.toLowerCase() === c.toLowerCase() && s.id !== semester?.id
    ) || null;
  })();

  const handleSave = async () => {
    if (!form.name.trim() || !form.code.trim()) {
      toast.error('Vui lòng nhập đầy đủ tên và mã học kỳ');
      return;
    }
    if (codeConflict) {
      toast.error(`Mã "${form.code}" đang được dùng cho kỳ "${codeConflict.name}". Vui lòng chọn mã khác.`);
      return;
    }
    setSaving(true);
    try {
      let saved: Semester;
      if (semester?.id) {
        const res = await academyApi.updateSemester(semester.id, form);
        saved = res.data.data;
      } else {
        const res = await academyApi.createSemester(form);
        saved = res.data.data;
      }
      toast.success(semester?.id ? 'Cập nhật học kỳ thành công' : 'Tạo học kỳ thành công');
      onSaved(saved);
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-darkcard border border-darkborder rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-heading font-bold text-text-primary">
            {semester?.id ? 'Chỉnh sửa học kỳ' : 'Tạo học kỳ mới'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Tên học kỳ</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Kỳ 1"
              className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Mã học kỳ</label>
              <input
                value={form.code}
                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                placeholder="S1"
                className={`w-full px-4 py-3 rounded-xl bg-darkbg border text-text-primary ${
                  codeConflict ? 'border-red-500' : 'border-darkborder'
                }`}
              />
              {codeConflict && (
                <p className="text-xs text-red-400 mt-1.5">
                  Mã "{form.code}" đang dùng cho kỳ "{codeConflict.name}". Vui lòng chọn mã khác.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Thứ tự</label>
              <input
                type="number"
                min={1}
                value={form.ordinal}
                onChange={(e) => setForm((p) => ({ ...p, ordinal: parseInt(e.target.value) || 0 }))}
                placeholder="1"
                className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              placeholder="Mô tả học kỳ (tuỳ chọn)"
              className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary"
            />
          </div>
          <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-darkborder bg-darkbg cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              className="w-4 h-4 rounded accent-neon-violet"
            />
            <span className="text-sm text-text-primary">Kích hoạt</span>
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-darkborder text-text-secondary hover:bg-white/5">
            Huỷ
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !!codeConflict}
            title={codeConflict ? 'Vui lòng chọn mã học kỳ khác' : undefined}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface CourseFormState {
  id?: number;
  title: string;
  courseCode: string;
  shortDescription: string;
  description: string;
  thumbnailUrl: string;
  previewVideoUrl: string;
  semesterId?: number;
  academyType: string;
  level: string;
  language: string;
  isFree: boolean;
  isFeatured: boolean;
  status: string;
  requirements: string;
  whatYouLearn: string;
  startDate: string;
  endDate: string;
}

interface SectionFormState {
  id?: number;
  title: string;
  description: string;
  sortOrder: number;
  isLocked: boolean;
  lessons: LessonFormState[];
}

interface LessonFormState {
  id?: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  lessonType: string;
  videoUrl: string;
  videoPlatform: 'EMBED' | 'YOUTUBE_TAB' | 'DIRECT';
  sourceCodeUrl: string;
  teachingNotes: string;
  videoDurationSeconds: number;
  thumbnailUrl: string;
  isFreePreview: boolean;
  isPublished: boolean;
  sortOrder: number;
  assignments: Assignment[];
  documents?: Array<{
    id: number;
    title: string;
    fileUrl: string;
    fileSizeBytes: number;
    fileType?: string | null;
    downloadCount: number;
    createdAt?: string;
  }>;
}

function normalizeSubmission(submission: any): SubmissionWithUser {
  const user = submission?.user;
  return {
    ...submission,
    studentName: submission?.studentName || user?.fullName || user?.username || 'Sinh viên',
    studentEmail: submission?.studentEmail || user?.email || '',
  };
}

const emptyCourse: CourseFormState = {
  title: '',
  courseCode: '',
  shortDescription: '',
  description: '',
  thumbnailUrl: '',
  previewVideoUrl: '',
  semesterId: undefined,
  academyType: 'FPT',
  level: 'BEGINNER',
  language: 'Vietnamese',
  isFree: true,
  isFeatured: false,
  status: 'DRAFT',
  requirements: '',
  whatYouLearn: '',
  startDate: '',
  endDate: '',
};

function buildEmptyLesson(sortOrder: number): LessonFormState {
  return {
    title: '',
    slug: '',
    description: '',
    content: '',
    lessonType: 'VIDEO',
    videoUrl: '',
    videoPlatform: 'EMBED',
    sourceCodeUrl: '',
    teachingNotes: '',
    videoDurationSeconds: 0,
    thumbnailUrl: '',
    isFreePreview: true,
    isPublished: true,
    sortOrder,
    assignments: [],
    documents: [],
  };
}

export default function AdminAcademyPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | undefined>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();
  const [courseForm, setCourseForm] = useState<CourseFormState>(emptyCourse);
  const [sections, setSections] = useState<SectionFormState[]>([]);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [savingCourse, setSavingCourse] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Semester management modal
  const [semesterModalOpen, setSemesterModalOpen] = useState(false);
  const [semesterModalData, setSemesterModalData] = useState<Semester | undefined>();

  // Grading panel
  const [gradingAssignmentId, setGradingAssignmentId] = useState<number | undefined>();
  const [gradingSubmissions, setGradingSubmissions] = useState<SubmissionWithUser[]>([]);
  const [loadingGrading, setLoadingGrading] = useState(false);
  const [gradingForm, setGradingForm] = useState<{ grade: string; feedback: string; status: string }>({ grade: '', feedback: '', status: 'GRADED' });
  const [savingGrade, setSavingGrade] = useState(false);

  useEffect(() => {
    academyApi.getSemesters()
      .then((res) => {
        const rows = res.data.data || [];
        setSemesters(rows);
        setSelectedSemesterId(rows[0]?.id);
      })
      .catch(() => toast.error('Không tải được danh sách kỳ học'));
  }, []);

  useEffect(() => {
    if (!selectedSemesterId) return;
    setLoadingCourses(true);
    academyApi.getCoursesBySemester(selectedSemesterId, { includeDraft: true })
      .then((res) => setCourses(res.data.data || []))
      .catch(() => toast.error('Không tải được môn học theo kỳ'))
      .finally(() => setLoadingCourses(false));
  }, [selectedSemesterId]);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId),
    [courses, selectedCourseId]
  );

  // Fetch full course data when a course is selected for editing
  useEffect(() => {
    if (!selectedCourseId) {
      setCourseForm({ ...emptyCourse, semesterId: selectedSemesterId });
      setSections([]);
      setExpandedSections([]);
      return;
    }

    academyApi.getCourseWithSections(selectedCourseId)
      .then((res) => {
        const course: Course = res.data.data;
        setCourseForm({
          id: course.id,
          title: course.title,
          courseCode: course.courseCode || '',
          shortDescription: course.shortDescription || '',
          description: course.description || '',
          thumbnailUrl: course.thumbnailUrl || '',
          previewVideoUrl: course.previewVideoUrl || '',
          semesterId: course.semesterId,
          academyType: course.academyType || 'FPT',
          level: course.level || 'BEGINNER',
          language: course.language || 'Vietnamese',
          isFree: course.isFree,
          isFeatured: course.isFeatured,
          status: course.status || 'DRAFT',
          requirements: course.requirements || '',
          whatYouLearn: course.whatYouLearn || '',
          startDate: course.startDate ? course.startDate.slice(0, 10) : '',
          endDate: course.endDate ? course.endDate.slice(0, 10) : '',
        });

        const mappedSections = (course.sections || []).map((section, sectionIndex) => ({
          id: section.id,
          title: section.title,
          description: section.description || '',
          sortOrder: section.sortOrder ?? sectionIndex,
          isLocked: section.isLocked,
          lessons: (section.lessons || []).map((lesson, lessonIndex) => ({
            id: lesson.id,
            title: lesson.title,
            slug: lesson.slug || '',
            description: lesson.description || '',
            content: lesson.content || '',
            lessonType: lesson.lessonType || 'VIDEO',
            videoUrl: lesson.videoUrl || '',
            videoPlatform: (lesson.videoPlatform as 'EMBED' | 'YOUTUBE_TAB' | 'DIRECT') || 'EMBED',
            sourceCodeUrl: lesson.sourceCodeUrl || '',
            teachingNotes: lesson.teachingNotes || '',
            videoDurationSeconds: lesson.videoDurationSeconds || 0,
            thumbnailUrl: lesson.thumbnailUrl || '',
            isFreePreview: lesson.isFreePreview,
            isPublished: lesson.isPublished,
            sortOrder: lesson.sortOrder ?? lessonIndex,
            assignments: lesson.assignments || [],
            documents: lesson.documents || [],
          })),
        }));

        setSections(mappedSections);
        setExpandedSections(mappedSections.map((_, index) => index));
      })
      .catch(() => toast.error('Không tải được chi tiết môn học'));
  }, [selectedCourseId]);

  const resetForNewCourse = () => {
    setSelectedCourseId(undefined);
    setCourseForm({ ...emptyCourse, semesterId: selectedSemesterId });
    setSections([]);
    setExpandedSections([]);
  };

  const openCreateSemester = () => {
    setSemesterModalData(undefined);
    setSemesterModalOpen(true);
  };

  const openEditSemester = (semester: Semester, e: React.MouseEvent) => {
    e.stopPropagation();
    setSemesterModalData(semester);
    setSemesterModalOpen(true);
  };

  const handleSemesterSaved = (saved: Semester) => {
    setSemesters((prev) => {
      const exists = prev.some((s) => s.id === saved.id);
      if (exists) return prev.map((s) => (s.id === saved.id ? saved : s));
      return [...prev, saved].sort((a, b) => a.ordinal - b.ordinal);
    });
    setSelectedSemesterId(saved.id);
  };

  const deleteSemester = async (semester: Semester, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Xoá học kỳ "${semester.name}"?`)) return;
    try {
      await academyApi.deleteSemester(semester.id);
      toast.success('Đã xoá học kỳ');
      setSemesters((prev) => prev.filter((s) => s.id !== semester.id));
      if (selectedSemesterId === semester.id) {
        setSelectedSemesterId(undefined);
        setSelectedCourseId(undefined);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Xoá thất bại');
    }
  };

  const openGrading = async (assignmentId: number) => {
    setGradingAssignmentId(assignmentId);
    setLoadingGrading(true);
    try {
      const res = await academyApi.getSubmissionsByAssignment(assignmentId);
      const normalizedSubmissions = (res.data.data || []).map(normalizeSubmission);
      setGradingSubmissions(normalizedSubmissions);
      if (normalizedSubmissions.length > 0) {
        const first = normalizedSubmissions[0];
        setGradingForm({ grade: first.grade != null ? String(first.grade) : '', feedback: first.feedback || '', status: first.status || 'GRADED' });
      } else {
        setGradingForm({ grade: '', feedback: '', status: 'GRADED' });
      }
    } catch {
      toast.error('Không tải được danh sách nộp bài');
    } finally {
      setLoadingGrading(false);
    }
  };

  const saveGrade = async (submissionId: number) => {
    setSavingGrade(true);
    try {
      await academyApi.gradeSubmission({
        submissionId,
        grade: gradingForm.grade ? parseFloat(gradingForm.grade) : undefined,
        feedback: gradingForm.feedback || undefined,
        status: gradingForm.status,
      });
      toast.success('Lưu điểm thành công');
      if (gradingAssignmentId) openGrading(gradingAssignmentId);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lưu điểm thất bại');
    } finally {
      setSavingGrade(false);
    }
  };

  const saveCourse = async () => {
    if (!courseForm.title.trim() || !courseForm.semesterId) {
      toast.error('Vui lòng nhập tên môn học và chọn kỳ');
      return;
    }

    setSavingCourse(true);
    const errors: string[] = [];

    try {
      const previousSections = sections.filter((section) => section.id);
      let courseId = courseForm.id;
      const payload = {
        title: courseForm.title,
        courseCode: courseForm.courseCode,
        semesterId: courseForm.semesterId,
        academyType: courseForm.academyType,
        shortDescription: courseForm.shortDescription,
        description: courseForm.description,
        thumbnailUrl: courseForm.thumbnailUrl,
        previewVideoUrl: courseForm.previewVideoUrl,
        level: courseForm.level,
        language: courseForm.language,
        isFree: courseForm.isFree,
        isFeatured: courseForm.isFeatured,
        status: courseForm.status,
        requirements: courseForm.requirements,
        whatYouLearn: courseForm.whatYouLearn,
        startDate: courseForm.startDate || null,
        endDate: courseForm.endDate || null,
      };

      if (courseId) {
        await adminCoursesApi.update(courseId, payload);
      } else {
        const created = await adminCoursesApi.create(payload);
        courseId = created.data.data?.id;
      }

      if (!courseId) throw new Error('Course save failed');
      // (debug log removed 2026-06-17)

      // Delete removed sections/lessons/assignments from DB first.
      // Without this, old records stay in DB and reappear after reload.
      const currentSectionIds = new Set(sections.map((section) => section.id).filter(Boolean));
      for (const prevSection of previousSections) {
        const prevSectionId = prevSection.id;
        if (!prevSectionId) continue;

        if (!currentSectionIds.has(prevSectionId)) {
          try {
            await adminCoursesApi.deleteSection(prevSectionId);
            // (debug log removed 2026-06-17)
          } catch (err: any) {
            errors.push(`Không xoá được chương cũ ${prevSection.title}: ${err?.response?.data?.message || err.message}`);
          }
          continue;
        }

        const currentSection = sections.find((section) => section.id === prevSectionId);
        if (!currentSection) continue;

        const currentLessonIds = new Set(currentSection.lessons.map((lesson) => lesson.id).filter(Boolean));
        for (const prevLesson of prevSection.lessons) {
          const prevLessonId = prevLesson.id;
          if (!prevLessonId) continue;

          if (!currentLessonIds.has(prevLessonId)) {
            try {
              await adminCoursesApi.deleteLesson(prevLessonId);
              // (debug log removed 2026-06-17)
            } catch (err: any) {
              errors.push(`Không xoá được bài cũ ${prevLesson.title}: ${err?.response?.data?.message || err.message}`);
            }
            continue;
          }

          const currentLesson = currentSection.lessons.find((lesson) => lesson.id === prevLessonId);
          if (!currentLesson) continue;

          const currentAssignmentIds = new Set(currentLesson.assignments.map((assignment) => assignment.id).filter(Boolean));
          for (const prevAssignment of prevLesson.assignments) {
            const prevAssignmentId = prevAssignment.id;
            if (!prevAssignmentId) continue;
              if (!currentAssignmentIds.has(prevAssignmentId)) {
                try {
                  await adminCoursesApi.deleteAssignment(prevAssignmentId);
                  // (debug log removed 2026-06-17)
                } catch (err: any) {
                  errors.push(`Không xoá được bài tập cũ ${prevAssignment.title}: ${err?.response?.data?.message || err.message}`);
                }
            }
          }
        }
      }

      // Deduplicate sections: skip by id (backend dup rows) or by title (user-added dupes).
      const seenSectionTitles = new Set<string>();
      const processedSectionIds = new Set<number>();
      const newSections: SectionFormState[] = [];

      for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
        const section = sections[sectionIndex];
        const titleKey = (section.title || '').trim().toLowerCase();

        // Skip if already processed by id (backend duplicates)
        if (section.id != null && processedSectionIds.has(section.id)) {
          // (debug log removed 2026-06-17)
          continue;
        }
        // Skip if same title already seen in this run (user added duplicate section)
        if (titleKey && seenSectionTitles.has(titleKey)) {
          // (debug log removed 2026-06-17)
          continue;
        }
        if (section.id != null) processedSectionIds.add(section.id);
        if (titleKey) seenSectionTitles.add(titleKey);

        let savedSectionId: number | undefined;

        try {
          if (section.id) {
            const r = await adminCoursesApi.updateSection(section.id, {
              title: section.title,
              description: section.description,
              sortOrder: sectionIndex,
              isLocked: section.isLocked,
            });
            savedSectionId = r.data.data?.id;
          } else {
            const r = await adminCoursesApi.createSection({
              courseId,
              title: section.title,
              description: section.description,
              sortOrder: sectionIndex,
              isLocked: section.isLocked,
            });
            savedSectionId = r.data.data?.id;
          }

          if (!savedSectionId) {
            errors.push(`Chương ${sectionIndex + 1}: không tạo được ID`);
            continue;
          }
          // (debug log removed 2026-06-17)
        } catch (err: any) {
          console.error(`[saveCourse] Section ${sectionIndex} failed:`, err?.response?.data);
          errors.push(`Chương ${sectionIndex + 1}: ${err?.response?.data?.message || err.message}`);
          continue;
        }

        const newLessons: LessonFormState[] = [];
        // Deduplicate lessons by title: two lessons with same title and id=undefined means
        // user clicked "add lesson" twice without renaming — skip the duplicate.
        const seenLessonTitles = new Set<string>();
        for (let lessonIndex = 0; lessonIndex < section.lessons.length; lessonIndex++) {
          const lesson = section.lessons[lessonIndex];
          const titleKey = (lesson.title || '').trim().toLowerCase();

          if (titleKey && seenLessonTitles.has(titleKey)) {
            // (debug log removed 2026-06-17)
            continue;
          }
          seenLessonTitles.add(titleKey);

          let lessonId = lesson.id;

          try {
            if (lessonId) {
              const r = await adminCoursesApi.updateLesson(lessonId, {
                title: lesson.title,
                slug: lesson.slug,
                description: lesson.description,
                content: lesson.content,
                lessonType: lesson.lessonType,
                videoUrl: lesson.videoUrl,
                videoPlatform: lesson.videoPlatform,
                sourceCodeUrl: lesson.sourceCodeUrl,
                teachingNotes: lesson.teachingNotes,
                videoDurationSeconds: lesson.videoDurationSeconds,
                thumbnailUrl: lesson.thumbnailUrl,
                isFreePreview: lesson.isFreePreview,
                isPublished: lesson.isPublished,
                sortOrder: lessonIndex,
              });
              lessonId = r.data.data?.id;
            } else {
              const r = await adminCoursesApi.createLesson({
                sectionId: savedSectionId,
                title: lesson.title,
                slug: lesson.slug,
                description: lesson.description,
                content: lesson.content,
                lessonType: lesson.lessonType,
                videoUrl: lesson.videoUrl,
                videoPlatform: lesson.videoPlatform,
                sourceCodeUrl: lesson.sourceCodeUrl,
                teachingNotes: lesson.teachingNotes,
                videoDurationSeconds: lesson.videoDurationSeconds,
                thumbnailUrl: lesson.thumbnailUrl,
                isFreePreview: lesson.isFreePreview,
                isPublished: lesson.isPublished,
                sortOrder: lessonIndex,
              });
              lessonId = r.data.data?.id;
            }

            if (!lessonId) {
              errors.push(`Bài ${lessonIndex + 1} (${lesson.title || 'không tên'}): không tạo được ID`);
              continue;
            }
            // (debug log removed 2026-06-17)

            const newAssignments: Assignment[] = [];
            for (let assignmentIndex = 0; assignmentIndex < lesson.assignments.length; assignmentIndex++) {
              const assignment = lesson.assignments[assignmentIndex];
              const assignmentPayload = {
                lessonId,
                title: assignment.title,
                instructions: assignment.instructions,
                deadline: assignment.deadline,
                sortOrder: assignmentIndex,
                isPublished: assignment.isPublished,
                maxScore: assignment.maxScore,
              };
              try {
                let savedAssignment = assignment;
                if (assignment.id) {
                  const res = await adminCoursesApi.updateAssignment(assignment.id, assignmentPayload);
                  savedAssignment = res.data.data || assignment;
                } else {
                  const res = await adminCoursesApi.createAssignment(assignmentPayload);
                  savedAssignment = res.data.data || assignment;
                }
                newAssignments.push({
                  ...assignment,
                  id: savedAssignment.id,
                  lessonId: savedAssignment.lessonId ?? lessonId,
                  sortOrder: savedAssignment.sortOrder ?? assignmentIndex,
                });
              } catch (err: any) {
                errors.push(`Bài tập ${assignmentIndex + 1} (${assignment.title}): ${err?.response?.data?.message || err.message}`);
              }
            }

            newLessons.push({ ...lesson, id: lessonId, sortOrder: lessonIndex, assignments: newAssignments });
          } catch (err: any) {
            console.error(`[saveCourse] Lesson ${lessonIndex} failed:`, err?.response?.data);
            const errMsg = err?.response?.data?.message || (err?.response?.data?.data ? JSON.stringify(err?.response?.data?.data) : err.message);
            errors.push(`Bài ${lessonIndex + 1} (${lesson.title || 'không tên'}): ${errMsg}`);
          }
        }

        newSections.push({ ...section, id: savedSectionId, sortOrder: sectionIndex, lessons: newLessons });
      }

      if (errors.length > 0) {
        toast.error(`Một số mục lưu thất bại:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n...' : ''}`);
      } else {
        toast.success('Đã lưu chương trình học');
      }

      // After save, use the already-built newSections as the source of truth.
      // The API reload call below is removed — it can re-introduce stale/dup data
      // from the backend if getCourseWithSections returns duplicates, causing
      // duplicate sections/lessons to reappear on next render.
      setCourseForm((prev) => ({ ...prev, id: courseId }));
      setCourses((prev) => {
        const summaryCourse: Course = {
          ...(selectedCourse || {
            id: courseId,
            slug: '',
            price: 0,
            level: courseForm.level,
            language: courseForm.language,
            isFree: courseForm.isFree,
            isFeatured: courseForm.isFeatured,
            isPublished: courseForm.status === 'PUBLISHED',
            totalDurationSeconds: 0,
            totalLessons: 0,
            totalStudents: 0,
            totalReviews: 0,
            avgRating: 0,
            createdAt: new Date().toISOString(),
            status: courseForm.status,
            title: courseForm.title,
          }),
          id: courseId,
          title: courseForm.title,
          courseCode: courseForm.courseCode,
          shortDescription: courseForm.shortDescription,
          description: courseForm.description,
          thumbnailUrl: courseForm.thumbnailUrl,
          previewVideoUrl: courseForm.previewVideoUrl,
          semesterId: courseForm.semesterId,
          academyType: courseForm.academyType,
          level: courseForm.level,
          language: courseForm.language,
          isFree: courseForm.isFree,
          isFeatured: courseForm.isFeatured,
          isPublished: courseForm.status === 'PUBLISHED',
          requirements: courseForm.requirements,
          whatYouLearn: courseForm.whatYouLearn,
          status: courseForm.status,
          totalLessons: newSections.reduce((sum, section) => sum + section.lessons.length, 0),
          totalDurationSeconds: newSections.reduce((sum, section) => sum + section.lessons.reduce((lessonSum, lesson) => lessonSum + (lesson.videoDurationSeconds || 0), 0), 0),
        };

        const exists = prev.some((course) => course.id === courseId);
        if (exists) {
          return prev.map((course) => (course.id === courseId ? { ...course, ...summaryCourse } : course));
        }
        return [summaryCourse, ...prev];
      });
      if (!selectedCourseId) {
        setSelectedCourseId(courseId);
      }
      setSections(newSections);
      setExpandedSections(newSections.map((_, i) => i));
    } catch (error: any) {
      console.error('[saveCourse] Fatal error:', error?.response?.data);
      const msg = error?.response?.data?.message || 'Lưu chương trình học thất bại';
      const details = error?.response?.data?.data;
      const detailStr = details ? JSON.stringify(details, null, 2) : '';
      toast.error(detailStr ? `${msg}\n${detailStr}` : msg);
    } finally {
      setSavingCourse(false);
    }
  };

  // Flip a DRAFT course to PUBLISHED (and re-fetch the sidebar so the
  // new status shows up). This is a thin wrapper around saveCourse +
  // a status update, so we don't have to teach the user a separate
  // "publish" button in two places.
  const publishCourse = async () => {
    if (!courseForm.id) {
      toast.error('Hãy lưu môn học trước khi xuất bản');
      return;
    }
    try {
      setSavingCourse(true);
      await adminCoursesApi.update(courseForm.id, { status: 'PUBLISHED' });
      setCourseForm((prev) => ({ ...prev, status: 'PUBLISHED' }));
      setCourses((prev) =>
        prev.map((c) => (c.id === courseForm.id ? { ...c, status: 'PUBLISHED', isPublished: true } : c))
      );
      toast.success('Đã xuất bản môn học — sinh viên có thể truy cập ngay');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Xuất bản thất bại');
    } finally {
      setSavingCourse(false);
    }
  };

  const removeCourse = async () => {
    if (!courseForm.id) return;
    try {
      await adminCoursesApi.delete(courseForm.id);
      toast.success('Đã xoá môn học');
      setCourses((prev) => prev.filter((course) => course.id !== courseForm.id));
      resetForNewCourse();
    } catch {
      toast.error('Xoá môn học thất bại');
    }
  };

  const addSection = () => {
    setSections((prev) => [...prev, {
      title: '',
      description: '',
      sortOrder: prev.length,
      isLocked: false,
      lessons: [buildEmptyLesson(0)],
    }]);
    setExpandedSections((prev) => [...prev, sections.length]);
  };

  const updateSection = (sectionIndex: number, patch: Partial<SectionFormState>) => {
    setSections((prev) => prev.map((section, index) => index === sectionIndex ? { ...section, ...patch } : section));
  };

  const addLesson = (sectionIndex: number) => {
    setSections((prev) => prev.map((section, index) => index === sectionIndex
      ? { ...section, lessons: [...section.lessons, buildEmptyLesson(section.lessons.length)] }
      : section));
  };

  const updateLesson = (sectionIndex: number, lessonIndex: number, patch: Partial<LessonFormState>) => {
    setSections((prev) => prev.map((section, sIndex) => sIndex === sectionIndex
      ? {
          ...section,
          lessons: section.lessons.map((lesson, lIndex) => lIndex === lessonIndex ? { ...lesson, ...patch } : lesson),
        }
      : section));
  };

  const addAssignment = (sectionIndex: number, lessonIndex: number) => {
    setSections((prev) => prev.map((section, sIndex) => sIndex === sectionIndex
      ? {
          ...section,
          lessons: section.lessons.map((lesson, lIndex) => lIndex === lessonIndex
            ? {
                ...lesson,
                assignments: [...lesson.assignments, {
                  title: '',
                  instructions: '',
                  deadline: '',
                  sortOrder: lesson.assignments.length,
                  isPublished: true,
                }],
              }
            : lesson),
        }
      : section));
  };

  const removeAssignment = (sectionIndex: number, lessonIndex: number, assignmentIndex: number) => {
    setSections((prev) => prev.map((section, sIndex) => sIndex === sectionIndex
      ? {
          ...section,
          lessons: section.lessons.map((lesson, lIndex) => lIndex === lessonIndex
            ? { ...lesson, assignments: lesson.assignments.filter((_, aIdx) => aIdx !== assignmentIndex) }
            : lesson),
        }
      : section));
  };

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    if (!confirm('Xóa bài học này?')) return;
    setSections((prev) => prev.map((section, sIndex) => sIndex === sectionIndex
      ? { ...section, lessons: section.lessons.filter((_, lIdx) => lIdx !== lessonIndex) }
      : section));
  };

  const removeSection = (sectionIndex: number) => {
    if (!confirm('Xóa chương này và tất cả bài học bên trong?')) return;
    setSections((prev) => prev.filter((_, sIdx) => sIdx !== sectionIndex));
    setExpandedSections((prev) => prev.filter((idx) => idx !== sectionIndex));
  };

  const toggleSectionExpand = (sectionIndex: number) => {
    setExpandedSections((prev) => prev.includes(sectionIndex)
      ? prev.filter((index) => index !== sectionIndex)
      : [...prev, sectionIndex]);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="bg-darkcard border border-darkborder rounded-2xl p-4 h-fit sticky top-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">FPT Academy</p>
            <h2 className="text-xl font-heading font-bold text-text-primary mt-1">9 kỳ học</h2>
          </div>
          <GraduationCap className="w-5 h-5 text-neon-violet" />
        </div>

        <div className="space-y-2">
          {semesters.map((semester) => {
            const active = selectedSemesterId === semester.id;
            return (
              <div
                key={semester.id}
                className={`group relative rounded-xl border transition ${active ? 'border-neon-violet bg-neon-violet/10' : 'border-darkborder bg-darkbg hover:border-neon-violet/30'}`}
              >
                <button
                  onClick={() => {
                    setSelectedSemesterId(semester.id);
                    setSelectedCourseId(undefined);
                  }}
                  className="w-full text-left px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-text-primary">{semester.name}</p>
                      <p className="text-xs opacity-70 text-text-muted">{semester.code}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-text-muted">#{semester.ordinal}</span>
                  </div>
                </button>
                <div className="absolute top-2 right-8 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => openEditSemester(semester, e)}
                    className="p-1 rounded-md bg-darkcard border border-darkborder text-text-muted hover:text-neon-violet hover:border-neon-violet/40"
                    title="Chỉnh sửa"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => deleteSemester(semester, e)}
                    className="p-1 rounded-md bg-darkcard border border-darkborder text-text-muted hover:text-red-400 hover:border-red-500/40"
                    title="Xoá"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-darkborder">
          <button
            onClick={openCreateSemester}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-neon-violet/40 text-neon-violet hover:bg-neon-violet/10 transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Tạo học kỳ mới
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-darkborder">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary">Môn học</h3>
            <button onClick={resetForNewCourse} className="p-2 rounded-lg bg-neon-violet/15 text-neon-violet hover:bg-neon-violet/25">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {loadingCourses ? <p className="text-sm text-text-muted">Đang tải...</p> : courses.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`w-full rounded-xl px-3 py-3 text-left border transition ${selectedCourseId === course.id ? 'border-neon-violet bg-neon-violet/10' : 'border-darkborder bg-darkbg hover:border-neon-violet/30'}`}
              >
                <p className="text-sm font-semibold text-text-primary">{course.courseCode || 'COURSE'}</p>
                <p className="text-sm text-text-secondary line-clamp-2">{course.title}</p>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="space-y-6">
        <div className="bg-darkcard border border-darkborder rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Course Info</p>
              <h1 className="text-2xl font-heading font-bold text-text-primary mt-1">{courseForm.id ? 'Chỉnh sửa môn học' : 'Tạo môn học mới'}</h1>
            </div>
            <div className="flex gap-2">
              {courseForm.id && (
                <button onClick={removeCourse} className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Xóa
                </button>
              )}
              {courseForm.id && courseForm.status !== 'PUBLISHED' && (
                <button onClick={publishCourse} disabled={savingCourse} className="px-4 py-2 rounded-xl border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2 disabled:opacity-60">
                  <Send className="w-4 h-4" /> Xuất bản
                </button>
              )}
              <button onClick={saveCourse} disabled={savingCourse} className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white flex items-center gap-2 disabled:opacity-60">
                <Save className="w-4 h-4" /> {savingCourse ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <input value={courseForm.title} onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Tên môn học" className="px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary" />
            <input value={courseForm.courseCode} onChange={(e) => setCourseForm((prev) => ({ ...prev, courseCode: e.target.value }))} placeholder="Mã môn (PRO192)" className="px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary" />
            <select value={courseForm.semesterId || ''} onChange={(e) => setCourseForm((prev) => ({ ...prev, semesterId: Number(e.target.value) || undefined }))} className="px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary">
              <option value="">Chọn kỳ học</option>
              {semesters.map((semester) => <option key={semester.id} value={semester.id}>{semester.name}</option>)}
            </select>
            <select value={courseForm.status} onChange={(e) => setCourseForm((prev) => ({ ...prev, status: e.target.value }))} className="px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="block text-xs text-text-muted mb-1.5">Ngày bắt đầu</label>
              <input
                type="date"
                value={courseForm.startDate}
                onChange={(e) => setCourseForm((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5">Ngày kết thúc</label>
              <input
                type="date"
                value={courseForm.endDate}
                onChange={(e) => setCourseForm((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5">Trình độ</label>
              <select value={courseForm.level} onChange={(e) => setCourseForm((prev) => ({ ...prev, level: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary">
                <option value="BEGINNER">Cơ bản</option>
                <option value="INTERMEDIATE">Trung cấp</option>
                <option value="ADVANCED">Nâng cao</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5">Ngôn ngữ</label>
              <select value={courseForm.language} onChange={(e) => setCourseForm((prev) => ({ ...prev, language: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary">
                <option value="Vietnamese">Tiếng Việt</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary cursor-pointer">
              <input type="checkbox" checked={courseForm.isFree} onChange={(e) => setCourseForm((prev) => ({ ...prev, isFree: e.target.checked }))} className="w-4 h-4 rounded border-darkborder bg-darkbg" />
              <span className="text-sm">Miễn phí</span>
            </label>
            <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary cursor-pointer">
              <input type="checkbox" checked={courseForm.isFeatured} onChange={(e) => setCourseForm((prev) => ({ ...prev, isFeatured: e.target.checked }))} className="w-4 h-4 rounded border-darkborder bg-darkbg" />
              <span className="text-sm">Nổi bật</span>
            </label>
            <div className="md:col-span-2 flex items-center px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-muted text-sm">
              <span>{courseForm.startDate || 'Chưa có ngày bắt đầu'} → {courseForm.endDate || 'Chưa có ngày kết thúc'}</span>
            </div>
          </div>

          <textarea value={courseForm.shortDescription} onChange={(e) => setCourseForm((prev) => ({ ...prev, shortDescription: e.target.value }))} rows={3} placeholder="Mô tả ngắn" className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary" />
          <textarea value={courseForm.description} onChange={(e) => setCourseForm((prev) => ({ ...prev, description: e.target.value }))} rows={4} placeholder="Mô tả chi tiết" className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary" />

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-text-primary"><ImageIcon className="w-4 h-4 text-neon-violet" /> Thumbnail</div>
              <ImageUpload value={courseForm.thumbnailUrl} onChange={(url) => setCourseForm((prev) => ({ ...prev, thumbnailUrl: url }))} />
            </div>
            <div className="grid gap-4 content-start">
              <input value={courseForm.previewVideoUrl} onChange={(e) => setCourseForm((prev) => ({ ...prev, previewVideoUrl: e.target.value }))} placeholder="Preview video URL" className="px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary" />
              <input value={courseForm.requirements} onChange={(e) => setCourseForm((prev) => ({ ...prev, requirements: e.target.value }))} placeholder="Yêu cầu đầu vào" className="px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary" />
              <input value={courseForm.whatYouLearn} onChange={(e) => setCourseForm((prev) => ({ ...prev, whatYouLearn: e.target.value }))} placeholder="Bạn sẽ học được gì" className="px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-darkcard border border-darkborder rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Course Builder</p>
              <h2 className="text-xl font-heading font-bold text-text-primary mt-1">Chapter → Lesson → Assignment</h2>
            </div>
            <button onClick={addSection} className="px-4 py-2 rounded-xl border border-neon-violet/30 text-neon-violet hover:bg-neon-violet/10 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Thêm chương
            </button>
          </div>

          <div className="space-y-4">
            {sections.map((section, sectionIndex) => {
              const expanded = expandedSections.includes(sectionIndex);
              return (
                <div key={`${section.id || 'new'}-${sectionIndex}`} className="border border-darkborder rounded-2xl overflow-hidden bg-darkbg/50">
                  <div className="w-full px-4 py-4 flex items-center justify-between gap-4">
                    <button onClick={() => toggleSectionExpand(sectionIndex)} className="flex items-center gap-3 text-left hover:bg-white/5 rounded-lg px-2 py-1 -ml-2 flex-1">
                      <div className="flex items-center gap-3 text-left">
                        <FolderTree className="w-5 h-5 text-neon-violet" />
                        <div>
                          <p className="font-semibold text-text-primary">{section.title || `Chương ${sectionIndex + 1}`}</p>
                          <p className="text-xs text-text-muted">{section.lessons.length} bài học</p>
                        </div>
                      </div>
                    </button>
                    <div className="flex items-center gap-2">
                      {section.id && (
                        <button
                          onClick={() => removeSection(sectionIndex)}
                          className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10"
                          title="Xóa chương"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {expanded ? <ChevronDown className="w-4 h-4 text-text-muted" /> : <ChevronRight className="w-4 h-4 text-text-muted" />}
                    </div>
                  </div>

                  {expanded && (
                    <div className="border-t border-darkborder p-4 space-y-5">
                      <div className="grid gap-3 md:grid-cols-[1fr_120px]">
                        <input value={section.title} onChange={(e) => updateSection(sectionIndex, { title: e.target.value })} placeholder="Tên chương" className="px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary" />
                        <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-sm text-text-secondary">
                          <input type="checkbox" checked={section.isLocked} onChange={(e) => updateSection(sectionIndex, { isLocked: e.target.checked })} /> Khóa
                        </label>
                      </div>
                      <textarea value={section.description} onChange={(e) => updateSection(sectionIndex, { description: e.target.value })} rows={2} placeholder="Mô tả chương" className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary" />

                      <div className="space-y-4">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div key={`${lesson.id || 'new'}-${lessonIndex}`} className="rounded-2xl border border-darkborder bg-[#100f1a] p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-text-primary font-semibold">
                                <BookOpen className="w-4 h-4 text-neon-indigo" />
                                Bài học {lessonIndex + 1}
                              </div>
                              <button onClick={() => addAssignment(sectionIndex, lessonIndex)} className="text-xs px-3 py-1.5 rounded-lg border border-neon-violet/30 text-neon-violet hover:bg-neon-violet/10 flex items-center gap-1">
                                <ClipboardList className="w-3.5 h-3.5" /> Bài tập
                              </button>
                              {lesson.id && (
                                <button onClick={() => removeLesson(sectionIndex, lessonIndex)} className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center gap-1">
                                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                                </button>
                              )}
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                              <input value={lesson.title} onChange={(e) => updateLesson(sectionIndex, lessonIndex, { title: e.target.value })} placeholder="Tiêu đề bài học" className="px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary" />
                              <input value={lesson.slug} onChange={(e) => updateLesson(sectionIndex, lessonIndex, { slug: e.target.value })} placeholder="Slug bài học" className="px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary" />
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-sm text-text-secondary">
                                <span className="text-text-muted text-xs shrink-0">Loại:</span>
                                <select value={lesson.lessonType} onChange={(e) => updateLesson(sectionIndex, lessonIndex, { lessonType: e.target.value })} className="bg-transparent text-text-primary outline-none w-full">
                                  <option value="VIDEO">VIDEO</option>
                                  <option value="TEXT">TEXT</option>
                                  <option value="QUIZ">QUIZ</option>
                                  <option value="PROJECT">PROJECT</option>
                                </select>
                              </div>
                              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-darkbg border border-darkborder">
                                <span className="text-sm text-text-secondary">Hiển thị:</span>
                                <button
                                  type="button"
                                  onClick={() => updateLesson(sectionIndex, lessonIndex, { isPublished: !lesson.isPublished })}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${lesson.isPublished ? 'bg-emerald-500' : 'bg-darkborder'}`}
                                >
                                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${lesson.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <span className={`text-xs font-medium ${lesson.isPublished ? 'text-emerald-400' : 'text-text-muted'}`}>
                                  {lesson.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </div>
                            </div>

                            <textarea value={lesson.description} onChange={(e) => updateLesson(sectionIndex, lessonIndex, { description: e.target.value })} rows={2} placeholder="Mô tả bài học" className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary" />

                            <div className="grid gap-3 lg:grid-cols-3">
                              <label className="rounded-xl border border-darkborder bg-darkbg px-4 py-3 text-sm text-text-secondary flex items-center gap-2"><Video className="w-4 h-4 text-neon-violet" />
                                <select value={lesson.videoPlatform} onChange={(e) => updateLesson(sectionIndex, lessonIndex, { videoPlatform: e.target.value as LessonFormState['videoPlatform'] })} className="bg-transparent text-text-primary outline-none w-full">
                                  <option value="EMBED">Embed trên web</option>
                                  <option value="YOUTUBE_TAB">Mở tab YouTube</option>
                                  <option value="DIRECT">Direct video</option>
                                </select>
                              </label>
                              <input value={lesson.videoUrl} onChange={(e) => updateLesson(sectionIndex, lessonIndex, { videoUrl: e.target.value })} placeholder="Video URL / YouTube URL" className="px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary lg:col-span-2" />
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                              <input value={lesson.sourceCodeUrl} onChange={(e) => updateLesson(sectionIndex, lessonIndex, { sourceCodeUrl: e.target.value })} placeholder="GitHub / source code URL" className="px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary" />
                              <input type="number" value={lesson.videoDurationSeconds} onChange={(e) => updateLesson(sectionIndex, lessonIndex, { videoDurationSeconds: Number(e.target.value) })} placeholder="Thời lượng video (giây)" className="px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary" />
                            </div>

                            <div>
                              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-text-primary"><FileText className="w-4 h-4 text-neon-violet" /> Ghi chú giảng dạy</p>
                              <RichTextEditor value={lesson.teachingNotes} onChange={(value) => updateLesson(sectionIndex, lessonIndex, { teachingNotes: value, content: value })} placeholder="Nội dung note giảng dạy, markdown được hỗ trợ..." />
                            </div>

                            {/* Tài liệu đính kèm — admin upload file (zip,
                                doc, pdf, ...), student download trên
                                /learn. Chỉ render khi lesson đã được
                                lưu (có id) — upload cần id để gắn file
                                vào đúng bài học. */}
                            {lesson.id && (
                              <div className="mt-2">
                                <LessonDocumentsManager
                                  lessonId={lesson.id}
                                  initialDocuments={lesson.documents || []}
                                />
                              </div>
                            )}

                            <div className="space-y-3">
                              {lesson.assignments.map((assignment, assignmentIndex) => (
                                <div key={`${assignment.id || 'new'}-${assignmentIndex}`} className="rounded-xl border border-darkborder bg-darkbg p-4 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                                      <ClipboardList className="w-4 h-4 text-neon-violet" /> Bài tập {assignmentIndex + 1}
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => removeAssignment(sectionIndex, lessonIndex, assignmentIndex)}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center gap-1"
                                        title="Xóa bài tập"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                      {assignment.id && (
                                        <button
                                          onClick={() => openGrading(assignment.id!)}
                                          className="text-xs px-3 py-1.5 rounded-lg bg-neon-indigo/15 border border-neon-indigo/30 text-neon-indigo hover:bg-neon-indigo/25 flex items-center gap-1"
                                        >
                                          <Star className="w-3.5 h-3.5" /> Chấm điểm
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <input value={assignment.title} onChange={(e) => updateLesson(sectionIndex, lessonIndex, { assignments: lesson.assignments.map((item, idx) => idx === assignmentIndex ? { ...item, title: e.target.value } : item) })} placeholder="Tiêu đề bài tập" className="w-full px-4 py-3 rounded-xl bg-[#0b0b12] border border-darkborder text-text-primary" />
                                  <textarea value={assignment.instructions || ''} onChange={(e) => updateLesson(sectionIndex, lessonIndex, { assignments: lesson.assignments.map((item, idx) => idx === assignmentIndex ? { ...item, instructions: e.target.value } : item) })} rows={3} placeholder="Yêu cầu bài tập" className="w-full px-4 py-3 rounded-xl bg-[#0b0b12] border border-darkborder text-text-primary" />
                                  <div className="grid gap-3 grid-cols-2">
                                    <input type="datetime-local" value={assignment.deadline ? assignment.deadline.slice(0, 16) : ''} onChange={(e) => updateLesson(sectionIndex, lessonIndex, { assignments: lesson.assignments.map((item, idx) => idx === assignmentIndex ? { ...item, deadline: e.target.value ? new Date(e.target.value).toISOString().slice(0, 19) : '' } : item) })} className="w-full px-4 py-3 rounded-xl bg-[#0b0b12] border border-darkborder text-text-primary" />
                                    <div className="flex items-center gap-2">
                                      <input type="number" min={0} step={0.5} value={assignment.maxScore ?? 10} onChange={(e) => updateLesson(sectionIndex, lessonIndex, { assignments: lesson.assignments.map((item, idx) => idx === assignmentIndex ? { ...item, maxScore: parseFloat(e.target.value) || 10 } : item) })} placeholder="Điểm" className="flex-1 px-4 py-3 rounded-xl bg-[#0b0b12] border border-darkborder text-text-primary" />
                                      <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-[#0b0b12] border border-darkborder">
                                        <span className={`text-xs font-medium ${assignment.isPublished ? 'text-emerald-400' : 'text-text-muted'}`}>Pub</span>
                                        <button
                                          type="button"
                                          onClick={() => updateLesson(sectionIndex, lessonIndex, { assignments: lesson.assignments.map((item, idx) => idx === assignmentIndex ? { ...item, isPublished: !item.isPublished } : item) })}
                                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${assignment.isPublished ? 'bg-emerald-500' : 'bg-darkborder'}`}
                                        >
                                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${assignment.isPublished ? 'translate-x-4' : 'translate-x-1'}`} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        <button onClick={() => addLesson(sectionIndex)} className="w-full rounded-xl border border-dashed border-neon-violet/30 py-3 text-sm text-neon-violet hover:bg-neon-violet/10 flex items-center justify-center gap-2">
                          <Plus className="w-4 h-4" /> Thêm bài học
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {semesterModalOpen && (
        <SemesterModal
          semester={semesterModalData}
          existingSemesters={semesters}
          onClose={() => setSemesterModalOpen(false)}
          onSaved={handleSemesterSaved}
        />
      )}

      {gradingAssignmentId && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setGradingAssignmentId(undefined)} />
      )}
      {gradingAssignmentId && (
        <div className="fixed bottom-0 right-0 z-50 w-full max-w-lg h-[85vh] bg-darkcard border border-darkborder border-t-2 border-t-neon-indigo rounded-t-2xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-darkborder">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Academy Admin</p>
              <h2 className="text-lg font-heading font-bold text-text-primary">Chấm điểm bài nộp</h2>
            </div>
            <button onClick={() => setGradingAssignmentId(undefined)} className="p-2 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-primary">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loadingGrading ? (
              <p className="text-text-muted text-center py-8">Đang tải...</p>
            ) : gradingSubmissions.length === 0 ? (
              <p className="text-text-muted text-center py-8">Chưa có bài nộp nào.</p>
            ) : (
              gradingSubmissions.map((sub) => (
                <div key={sub.id} className="rounded-xl border border-darkborder bg-darkbg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-text-primary">{sub.studentName || 'Sinh viên'}</p>
                      <p className="text-xs text-text-muted">{sub.studentEmail}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${sub.status === 'GRADED' ? 'bg-green-500/15 text-green-400 border border-green-500/30' : sub.status === 'SUBMITTED' ? 'bg-neon-violet/15 text-neon-violet border border-neon-violet/30' : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'}`}>
                      {sub.status === 'GRADED' ? 'Đã chấm' : sub.status === 'SUBMITTED' ? 'Chờ chấm' : sub.status}
                    </span>
                  </div>

                  {sub.submissionUrl && (
                    <a href={sub.submissionUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-neon-violet hover:underline">
                      <ExternalLink className="w-3.5 h-3.5" /> {sub.submissionUrl}
                    </a>
                  )}
                  {sub.notes && <p className="text-sm text-text-secondary italic">"{sub.notes}"</p>}

                  <div className="grid gap-2">
                    <div className="grid gap-2 grid-cols-3">
                      <div>
                        <label className="block text-xs text-text-muted mb-1">Điểm</label>
                        <input
                          type="number"
                          min={0}
                          step={0.5}
                          value={sub.grade != null ? String(sub.grade) : ''}
                          onChange={(e) => setGradingSubmissions((prev) => prev.map((s) => s.id === sub.id ? { ...s, grade: parseFloat(e.target.value) } : s))}
                          placeholder="0"
                          className="w-full px-3 py-2 rounded-lg bg-[#0b0b12] border border-darkborder text-text-primary text-center font-bold text-lg"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-text-muted mb-1">Trạng thái</label>
                        <select
                          value={sub.status}
                          onChange={(e) => setGradingSubmissions((prev) => prev.map((s) => s.id === sub.id ? { ...s, status: e.target.value } : s))}
                          className="w-full px-3 py-2 rounded-lg bg-[#0b0b12] border border-darkborder text-text-primary"
                        >
                          <option value="SUBMITTED">Chờ chấm</option>
                          <option value="GRADED">Đã chấm</option>
                          <option value="NEED_REVISION">Cần sửa lại</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">Feedback</label>
                      <textarea
                        value={sub.feedback || ''}
                        onChange={(e) => setGradingSubmissions((prev) => prev.map((s) => s.id === sub.id ? { ...s, feedback: e.target.value } : s))}
                        rows={3}
                        placeholder="Nhận xét cho sinh viên..."
                        className="w-full px-3 py-2 rounded-lg bg-[#0b0b12] border border-darkborder text-text-primary text-sm"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        const s = gradingSubmissions.find((x) => x.id === sub.id);
                        if (!s) return;
                        setSavingGrade(true);
                        try {
                          await academyApi.gradeSubmission({ submissionId: sub.id, grade: s.grade, feedback: s.feedback, status: s.status });
                          toast.success('Lưu điểm thành công');
                          if (gradingAssignmentId) openGrading(gradingAssignmentId);
                        } catch (err: any) {
                          toast.error(err?.response?.data?.message || 'Lưu thất bại');
                        } finally {
                          setSavingGrade(false);
                        }
                      }}
                      disabled={savingGrade}
                      className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" /> {savingGrade ? 'Đang lưu...' : 'Lưu điểm'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
