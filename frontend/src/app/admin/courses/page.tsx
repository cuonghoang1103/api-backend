'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Search, Pencil, Trash2, X, ChevronLeft, ChevronRight,
  CheckCircle, Clock, AlertCircle, Eye, EyeOff, Loader2,
  ChevronDown, ChevronUp, BookOpen, Play, FileText, Link, Video, Image, FolderTree
} from 'lucide-react';
import { adminCoursesApi, courseCategoryApi } from '@/lib/api';
import { toast } from 'sonner';
import type { Course, CourseCategory, CourseSection as CCSection, LessonDto } from '@/types';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import LessonDocumentsManager from '@/components/admin/LessonDocumentsManager';
import LessonVideoManager from '@/components/admin/LessonVideoManager';
import LessonQuizBuilder, { type QuizData } from '@/components/admin/LessonQuizBuilder';

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
const STATUSES = ['DRAFT', 'PUBLISHED'];

// Single source of truth for course status.
// 'DRAFT' = not visible on Academy page
// 'PUBLISHED' = visible on Academy page
// isPublished is kept for backward compatibility but is now auto-synced with status.
const emptyCourse = {
  title: '', shortDescription: '', description: '',
  thumbnailUrl: '', previewVideoUrl: '',
  price: 0, discountPrice: 0, level: 'BEGINNER',
  language: 'Vietnamese', isFree: false, isFeatured: false,
  isPublished: false, requirements: '', whatYouLearn: '',
  status: 'DRAFT', tags: [] as string[],
  categoryId: 0,
  accessType: 'FREE',
  // Guidance note shown above the course-level "Tài liệu chung" area.
  documentsNote: '',
  // ISO datetime string or '' for "no expiry / forever".
  // discountExpiresAt: date+time after which discountPrice stops applying.
  discountExpiresAt: '',
  enrollmentDays: 0,
};

interface SectionForm {
  id?: number;
  title: string;
  description: string;
  sortOrder: number;
  isLocked: boolean;
  lessons: LessonForm[];
}

interface LessonForm {
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
  quizData?: QuizData | null;
  videoDurationSeconds: number;
  thumbnailUrl: string;
  isFreePreview: boolean;
  isPublished: boolean;
  sortOrder: number;
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

// Bold the part of `text` that matches `query` (case-insensitive) so
// suggestions visibly narrow as the admin types.
function highlightMatch(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-neon-violet/30 text-inherit rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  // `searchInput` updates on every keystroke (drives the input + suggestions);
  // `search` is the debounced value that actually triggers the server fetch,
  // so fast typing no longer fires a request (and full-table spinner) per char.
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [courseForm, setCourseForm] = useState({ ...emptyCourse });
  const [sections, setSections] = useState<SectionForm[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);

  // ── Auto-sync status ↔ isPublished ──────────────────────────────────────
  // Single source of truth: `status` drives visibility on the Academy page.
  // isPublished is kept for backward compatibility but is now auto-synced
  // with status on every render via a derived value below — we never store
  // both independently, which previously caused an infinite render loop
  // (each useEffect's setState triggered the other one).
  const statusDerived = courseForm.status === 'PUBLISHED';
  const isPublishedDerived = courseForm.isPublished;

  // Section/lesson expanded state
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminCoursesApi.getAll({
        page, size: pageSize,
        keyword: search || undefined,
        status: statusFilter || undefined,
      });
      const coursesData = res.data?.data;
      const pagination = res.data?.pagination;
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setTotalPages(pagination?.totalPages || 0);
    } catch {
      toast.error('Lỗi tải danh sách');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, pageSize]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);
  useEffect(() => { setPage(0); }, [search, statusFilter]);

  // Debounce the raw input into the value that drives fetching (250ms).
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Live suggestions: the server-filtered courses for the current query,
  // capped to a short list. Matches by mã môn (courseCode) and title.
  const suggestions = searchInput.trim() ? courses.slice(0, 8) : [];

  // Picking a suggestion narrows the search to that exact course
  // (by code when it has one, else by title).
  const selectSuggestion = (c: Course) => {
    const term = c.courseCode || c.title;
    setSearchInput(term);
    setSearch(term);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  useEffect(() => {
    courseCategoryApi.getAll().then(r => setCategories(r.data.data || [])).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setCourseForm({ ...emptyCourse });
    setSections([]);
    setExpandedSections(new Set());
    setShowForm(true);
  };

  const openEdit = async (course: Course) => {
    setEditingId(course.id);
    setCourseForm({
      title: course.title,
      shortDescription: course.shortDescription || '',
      description: course.description || '',
      thumbnailUrl: course.thumbnailUrl || '',
      previewVideoUrl: course.previewVideoUrl || '',
      price: Number(course.price),
      discountPrice: Number(course.discountPrice) || 0,
      level: course.level || 'BEGINNER',
      language: course.language || 'Vietnamese',
      isFree: course.isFree || false,
      isFeatured: course.isFeatured || false,
      isPublished: course.isPublished || false,
      accessType: ((course as any).accessType === 'CODE' ? 'PAID' : (course as any).accessType) || 'FREE',
      requirements: course.requirements || '',
      whatYouLearn: course.whatYouLearn || '',
      documentsNote: (course as { documentsNote?: string }).documentsNote || '',
      status: course.status || 'DRAFT',
      tags: course.tags || [],
      categoryId: course.categoryId || 0,
      // Pre-fill discount expiry from the course row. ISO string or ''.
      discountExpiresAt: course.discountExpiresAt
        ? new Date(course.discountExpiresAt).toISOString().slice(0, 16)
        : '',
      enrollmentDays: course.enrollmentDurationDays ?? 0,
    });
    setSections([]);
    setExpandedSections(new Set());
    setShowForm(true);

    // Load sections + lessons from course detail
    setLoadingSections(true);
    try {
      const res = await adminCoursesApi.getById(course.id);
      const detailedCourse = res.data?.data;
      if (detailedCourse?.sections) {
        const loaded = detailedCourse.sections.map((s: CCSection) => ({
          id: s.id,
          title: s.title,
          description: s.description || '',
          sortOrder: s.sortOrder,
          isLocked: s.isLocked || false,
          lessons: (s.lessons || []).map((l: LessonDto) => ({
            id: l.id,
            title: l.title,
            slug: l.slug || '',
            description: l.description || '',
            content: l.content || '',
            lessonType: l.lessonType || 'VIDEO',
            videoUrl: l.videoUrl || '',
            videoPlatform: (l.videoPlatform as 'EMBED' | 'YOUTUBE_TAB' | 'DIRECT') || 'EMBED',
            sourceCodeUrl: l.sourceCodeUrl || '',
            teachingNotes: l.teachingNotes || '',
            quizData: (l as unknown as { quizData?: QuizData; detail?: { quizData?: QuizData } }).quizData
              ?? (l as unknown as { detail?: { quizData?: QuizData } }).detail?.quizData
              ?? null,
            videoDurationSeconds: l.videoDurationSeconds || 0,
            thumbnailUrl: l.thumbnailUrl || '',
            isFreePreview: l.isFreePreview || false,
            isPublished: l.isPublished || false,
            sortOrder: l.sortOrder,
            documents: l.documents || [],
          })),
        }));
        setSections(loaded);
        setExpandedSections(new Set(loaded.map((_s: { id?: number }, index: number) => index)));
      }
    } catch { /* ignore */ } finally {
      setLoadingSections(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setCourseForm({ ...emptyCourse });
    setSections([]);
    setExpandedSections(new Set());
  };

  // Section management
  const addSection = () => {
    setSections(prev => [...prev, {
      title: '',
      description: '',
      sortOrder: prev.length,
      isLocked: false,
      lessons: [],
    }]);
  };

  const updateSection = (idx: number, patch: Partial<SectionForm>) => {
    setSections(prev => prev.map((s, i) => i === idx ? { ...s, ...patch } : s));
  };

  const removeSection = (idx: number) => {
    setSections(prev => prev.filter((_, i) => i !== idx));
  };

  // Lesson management
  const addLesson = (sectionIdx: number) => {
    setSections(prev => prev.map((s, i) =>
      i === sectionIdx ? {
        ...s,
        lessons: [...s.lessons, {
          title: '',
          slug: '',
          description: '',
          content: '',
          lessonType: 'VIDEO',
          videoUrl: '',
          videoPlatform: 'EMBED' as const,
          sourceCodeUrl: '',
          teachingNotes: '',
          quizData: null,
          videoDurationSeconds: 0,
          thumbnailUrl: '',
          isFreePreview: false,
          isPublished: true,
          sortOrder: s.lessons.length,
          documents: [],
        }],
      } : s
    ));
  };

  const updateLesson = (sectionIdx: number, lessonIdx: number, patch: Partial<LessonForm>) => {
    setSections(prev => prev.map((s, si) =>
      si === sectionIdx ? {
        ...s,
        lessons: s.lessons.map((l, li) =>
          li === lessonIdx ? { ...l, ...patch } : l
        ),
      } : s
    ));
  };

  const removeLesson = (sectionIdx: number, lessonIdx: number) => {
    setSections(prev => prev.map((s, si) =>
      si === sectionIdx ? { ...s, lessons: s.lessons.filter((_, li) => li !== lessonIdx) } : s
    ));
  };

  const toggleSectionExpand = (idx: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const handleSave = async () => {
    if (!courseForm.title.trim()) { toast.error('Tiêu đề không được trống'); return; }
    setSaving(true);
    // Collect per-item failures so one bad lesson doesn't abort the whole save.
    const errors: string[] = [];
    try {
      const payload = {
        title: courseForm.title,
        shortDescription: courseForm.shortDescription,
        description: courseForm.description,
        thumbnailUrl: courseForm.thumbnailUrl,
        previewVideoUrl: courseForm.previewVideoUrl,
        categoryId: courseForm.categoryId || undefined,
        price: courseForm.price,
        discountPrice: courseForm.discountPrice,
        // Send null when the field is empty so the backend doesn't try
        // to parse an empty string as a date. The backend stores
        // discountExpiresAt as DateTime? and treats null as "no expiry".
        discountExpiresAt: courseForm.discountExpiresAt
          ? new Date(courseForm.discountExpiresAt).toISOString()
          : null,
        level: courseForm.level,
        language: courseForm.language,
        isFree: courseForm.isFree,
        isFeatured: courseForm.isFeatured,
        accessType: courseForm.accessType,
        enrollmentDurationDays: courseForm.enrollmentDays,
        isPublished: statusDerived,
        requirements: courseForm.requirements,
        whatYouLearn: courseForm.whatYouLearn,
        documentsNote: courseForm.documentsNote,
        status: courseForm.status,
        tags: courseForm.tags,
      };

      // Normalize null -> undefined for fields whose API type is
      // `string | undefined` (e.g. discountExpiresAt). Sending null
      // would cause a TS error at the call site.
      const cleanPayload = {
        ...payload,
        discountExpiresAt: payload.discountExpiresAt ?? undefined,
      };

      // 1) Create or update the course itself.
      const previousSections = sections.filter(s => s.id);
      let courseId = editingId ?? undefined;
      if (courseId) {
        await adminCoursesApi.update(courseId, cleanPayload);
      } else {
        const created = await adminCoursesApi.create(cleanPayload);
        courseId = created.data.data?.id;
      }
      if (!courseId) throw new Error('Không tạo được khoá học');

      // 2) Delete sections/lessons that were removed in the editor (in edit
      //    mode). Without this, old rows stay in DB and reappear on reload.
      const currentSectionIds = new Set(sections.map(s => s.id).filter(Boolean));
      for (const prev of previousSections) {
        if (!prev.id) continue;
        if (!currentSectionIds.has(prev.id)) {
          try { await adminCoursesApi.deleteSection(prev.id); }
          catch (e: any) { errors.push(`Không xoá được chương "${prev.title}": ${e?.response?.data?.message || e.message}`); }
          continue;
        }
        const cur = sections.find(s => s.id === prev.id);
        if (!cur) continue;
        const curLessonIds = new Set(cur.lessons.map(l => l.id).filter(Boolean));
        for (const pl of prev.lessons) {
          if (pl.id && !curLessonIds.has(pl.id)) {
            try { await adminCoursesApi.deleteLesson(pl.id); }
            catch (e: any) { errors.push(`Không xoá được bài "${pl.title}": ${e?.response?.data?.message || e.message}`); }
          }
        }
      }

      // 3) Create/update sections + lessons. Dedup by id (backend dup rows)
      //    and by title (user clicked "add" twice without renaming).
      const seenSectionTitles = new Set<string>();
      const processedSectionIds = new Set<number>();
      const newSections: SectionForm[] = [];
      for (let si = 0; si < sections.length; si++) {
        const section = sections[si];
        const tKey = (section.title || '').trim().toLowerCase();
        if (!section.title.trim()) continue;
        if (section.id != null && processedSectionIds.has(section.id)) continue;
        if (tKey && seenSectionTitles.has(tKey)) continue;
        if (section.id != null) processedSectionIds.add(section.id);
        if (tKey) seenSectionTitles.add(tKey);

        let savedSectionId: number | undefined;
        try {
          if (section.id) {
            const r = await adminCoursesApi.updateSection(section.id, {
              title: section.title, description: section.description, sortOrder: si, isLocked: section.isLocked,
            });
            savedSectionId = r.data.data?.id;
          } else {
            const r = await adminCoursesApi.createSection({
              courseId, title: section.title, description: section.description, sortOrder: si, isLocked: section.isLocked,
            });
            savedSectionId = r.data.data?.id;
          }
          if (!savedSectionId) { errors.push(`Chương ${si + 1}: không tạo được ID`); continue; }
        } catch (e: any) {
          errors.push(`Chương ${si + 1}: ${e?.response?.data?.message || e.message}`);
          continue;
        }

        const newLessons: LessonForm[] = [];
        const seenLessonTitles = new Set<string>();
        for (let li = 0; li < section.lessons.length; li++) {
          const lesson = section.lessons[li];
          const lKey = (lesson.title || '').trim().toLowerCase();
          if (!lesson.title.trim()) continue;
          if (lKey && seenLessonTitles.has(lKey)) continue;
          seenLessonTitles.add(lKey);

          const lessonPayload = {
            title: lesson.title,
            slug: lesson.slug,
            description: lesson.description,
            content: lesson.content,
            lessonType: lesson.lessonType,
            videoUrl: lesson.videoUrl,
            videoPlatform: lesson.videoPlatform,
            sourceCodeUrl: lesson.sourceCodeUrl,
            teachingNotes: lesson.teachingNotes,
            quizData: lesson.lessonType === 'QUIZ' ? (lesson.quizData ?? null) : null,
            videoDurationSeconds: lesson.videoDurationSeconds,
            thumbnailUrl: lesson.thumbnailUrl,
            isFreePreview: lesson.isFreePreview,
            isPublished: lesson.isPublished,
            sortOrder: li,
          };
          let lessonId = lesson.id;
          try {
            if (lessonId) {
              const r = await adminCoursesApi.updateLesson(lessonId, lessonPayload);
              lessonId = r.data.data?.id;
            } else {
              const r = await adminCoursesApi.createLesson({ sectionId: savedSectionId, ...lessonPayload });
              lessonId = r.data.data?.id;
            }
            if (!lessonId) { errors.push(`Bài ${li + 1} (${lesson.title}): không tạo được ID`); continue; }
            newLessons.push({ ...lesson, id: lessonId, sortOrder: li });
          } catch (e: any) {
            errors.push(`Bài ${li + 1} (${lesson.title}): ${e?.response?.data?.message || e.message}`);
          }
        }
        newSections.push({ ...section, id: savedSectionId, sortOrder: si, lessons: newLessons });
      }

      if (errors.length > 0) {
        toast.error(`Một số mục lưu lỗi:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n...' : ''}`);
      } else {
        toast.success(editingId ? 'Cập nhật khoá học thành công!' : 'Tạo khoá học thành công!');
      }

      // Keep the modal open and switch to edit mode with the saved ids, so the
      // per-lesson video/PDF upload widgets (which need a lesson id) appear.
      setEditingId(courseId);
      setSections(newSections);
      setExpandedSections(new Set(newSections.map((_, i) => i)));
      fetchCourses();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Lỗi khi lưu khoá học');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa khoá học này?')) return;
    try {
      await adminCoursesApi.delete(id);
      toast.success('Đã xóa khoá học');
      fetchCourses();
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-';

  const statusConfig: Record<string, { color: string; label: string; icon: React.ElementType }> = {
    PUBLISHED: { color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', label: 'Đã đăng', icon: CheckCircle },
    DRAFT: { color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20', label: 'Bản nháp', icon: AlertCircle },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Quản lý Khoá học</h1>
          <p className="text-text-secondary mt-1">Tạo, chỉnh sửa và quản lý khoá học</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Tạo khoá học
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted z-10" />
          <input
            type="text"
            placeholder="Tìm theo mã môn hoặc tên khoá học..."
            value={searchInput}
            onChange={e => { setSearchInput(e.target.value); setShowSuggestions(true); setActiveSuggestion(-1); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={e => {
              if (!showSuggestions || suggestions.length === 0) return;
              if (e.key === 'ArrowDown') { e.preventDefault(); setActiveSuggestion(i => Math.min(i + 1, suggestions.length - 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveSuggestion(i => Math.max(i - 1, 0)); }
              else if (e.key === 'Enter' && activeSuggestion >= 0) { e.preventDefault(); selectSuggestion(suggestions[activeSuggestion]); }
              else if (e.key === 'Escape') { setShowSuggestions(false); setActiveSuggestion(-1); }
            }}
            className="w-full pl-10 pr-9 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => { setSearchInput(''); setShowSuggestions(false); setActiveSuggestion(-1); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary rounded-md hover:bg-white/5 transition-colors"
              title="Xoá tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Live suggestions — matched by mã môn + tên, narrowing as you type */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-30 left-0 right-0 top-full mt-2 bg-darkcard border border-darkborder rounded-xl shadow-2xl shadow-black/40 overflow-hidden max-h-80 overflow-y-auto">
              {suggestions.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onMouseDown={e => { e.preventDefault(); selectSuggestion(c); }}
                  onMouseEnter={() => setActiveSuggestion(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${i === activeSuggestion ? 'bg-neon-violet/10' : 'hover:bg-white/[0.03]'}`}
                >
                  <img
                    src={c.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=64'}
                    alt=""
                    className="w-9 h-9 rounded-md object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {c.courseCode && (
                        <span className="shrink-0 font-mono text-[11px] px-1.5 py-0.5 rounded bg-neon-violet/15 text-neon-violet border border-neon-violet/25">
                          {highlightMatch(c.courseCode, searchInput)}
                        </span>
                      )}
                      <span className="text-sm text-text-primary truncate">{highlightMatch(c.title, searchInput)}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 truncate">
                      {c.categoryName || 'Chưa phân loại'} · {c.totalLessons || 0} bài
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 cursor-pointer"
        >
          <option value="">Tất cả</option>
          {STATUSES.map(s => <option key={s} value={s}>{s === 'PUBLISHED' ? 'Đã đăng' : 'Bản nháp'}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-darkcard border border-darkborder/50 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-muted">Chưa có khoá học nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-darkborder/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Khoá học</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">Danh mục</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider hidden lg:table-cell">Học viên</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider hidden lg:table-cell">Ngày tạo</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Trạng thái</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-darkborder/30">
                {courses.map(course => {
                  const sc = statusConfig[course.status] || statusConfig.DRAFT;
                  const StatusIcon = sc.icon;
                  return (
                    <tr key={course.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80'}
                            alt={course.title}
                            className="w-14 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              {course.courseCode && (
                                <span className="shrink-0 font-mono text-[11px] px-1.5 py-0.5 rounded bg-neon-violet/15 text-neon-violet border border-neon-violet/25">
                                  {course.courseCode}
                                </span>
                              )}
                              <p className="font-medium text-text-primary text-sm line-clamp-1">{course.title}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-text-muted">{course.totalLessons} bài</span>
                              <span className="text-text-muted text-xs">•</span>
                              <span className="text-xs text-text-muted">{course.totalDurationSeconds > 0 ? `${Math.round(course.totalDurationSeconds / 3600)}h` : '0h'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm text-text-secondary">{course.categoryName || '-'}</span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-sm text-text-secondary">{course.totalStudents}</span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-sm text-text-secondary">{formatDate(course.createdAt)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${sc.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(course)}
                            className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-neon-violet transition-colors"
                            title="Sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-text-muted hover:text-red-400 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="p-2 bg-darkcard border border-darkborder rounded-lg text-text-muted hover:text-text-primary disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-text-secondary px-3">Trang {page + 1} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="p-2 bg-darkcard border border-darkborder rounded-lg text-text-muted hover:text-text-primary disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl my-8 mx-4 bg-darkcard border border-darkborder rounded-2xl shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-darkborder">
              <h2 className="text-lg font-heading font-bold text-text-primary">
                {editingId ? 'Sửa khoá học' : 'Tạo khoá học mới'}
              </h2>
              <button onClick={closeForm} className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto p-6 space-y-8">
              {/* Basic Info */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Thông tin cơ bản</h3>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Tiêu đề *</label>
                  <input value={courseForm.title}
                    onChange={e => setCourseForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Tên khoá học"
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Danh mục</label>
                  <select value={courseForm.categoryId}
                    onChange={e => setCourseForm(p => ({ ...p, categoryId: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 cursor-pointer"
                  >
                    <option value={0}>-- Chọn danh mục --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Mô tả ngắn</label>
                  <input value={courseForm.shortDescription}
                    onChange={e => setCourseForm(p => ({ ...p, shortDescription: e.target.value }))}
                    placeholder="Mô tả ngắn gọn (hiển thị trên card)"
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Cấp độ</label>
                    <select value={courseForm.level}
                      onChange={e => setCourseForm(p => ({ ...p, level: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 cursor-pointer"
                    >
                      {LEVELS.map(l => <option key={l} value={l}>{l === 'BEGINNER' ? 'Cơ bản' : l === 'INTERMEDIATE' ? 'Trung bình' : 'Nâng cao'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                      Trạng thái
                      <span className="text-[11px] font-normal text-text-muted ml-1.5">
                        (quyết định hiển thị trên Academy)
                      </span>
                    </label>
                    <select value={courseForm.status}
                      onChange={e => setCourseForm(p => ({ ...p, status: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 cursor-pointer"
                    >
                      <option value="DRAFT">Bản nháp</option>
                      <option value="PUBLISHED">Đã đăng</option>
                    </select>
                    <p className="text-[11px] mt-1">
                      <span className="text-text-muted">
                        {courseForm.status === 'DRAFT'
                          ? 'Lưu nháp — chỉ admin thấy, không hiện trên Academy.'
                          : 'Xuất bản — hiện trên trang Academy, học viên có thể đăng ký.'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Giá (VND)</label>
                    <input type="number" value={courseForm.price}
                      onChange={e => setCourseForm(p => ({ ...p, price: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Giảm giá (VND)</label>
                    <input type="number" value={courseForm.discountPrice}
                      onChange={e => setCourseForm(p => ({ ...p, discountPrice: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                      Giảm giá có hiệu lực đến
                    </label>
                    <input
                      type="datetime-local"
                      value={courseForm.discountExpiresAt}
                      onChange={e => setCourseForm(p => ({ ...p, discountExpiresAt: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50"
                    />
                    <p className="text-[11px] mt-1 text-text-muted">
                      Để trống = giảm giá vô thời hạn. Sau thời điểm này hệ thống sẽ tự động tính lại giá gốc.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                      Thời hạn truy cập (ngày)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={courseForm.enrollmentDays}
                      onChange={e => setCourseForm(p => ({ ...p, enrollmentDays: Math.max(0, Number(e.target.value)) }))}
                      className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50"
                    />
                    <p className="text-[11px] mt-1 text-text-muted">
                      0 = trọn đời (mặc định). Áp dụng cho cả khoá miễn phí và trả phí.
                    </p>
                  </div>
                </div>

                {/* Access Type */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Hinh thuc truy cap</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { value: 'FREE', label: 'Mien phi', desc: 'Hoc vien dang ky tu do', color: 'green' },
                      { value: 'PAID', label: 'Tra phi or Ma kich hoat', desc: 'Mua qua VNPay / Nhap ma 6 ky tu', color: 'indigo' },
                    ].map(opt => (
                      <label
                        key={opt.value}
                        className={`flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition-all ${
                          courseForm.accessType === opt.value
                            ? 'border-neon-violet bg-neon-violet/10'
                            : 'border-darkborder bg-darkbg hover:border-darkborder/80'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            courseForm.accessType === opt.value ? 'border-neon-violet' : 'border-darkborder'
                          }`}>
                            {courseForm.accessType === opt.value && (
                              <div className="w-2 h-2 rounded-full bg-neon-violet" />
                            )}
                          </div>
                          <span className="text-sm font-semibold text-text-primary">{opt.label}</span>
                        </div>
                        <span className="text-[11px] text-text-muted ml-6">{opt.desc}</span>
                        <input
                          type="radio"
                          name="accessType"
                          value={opt.value}
                          checked={courseForm.accessType === opt.value}
                          onChange={e => setCourseForm(p => ({ ...p, accessType: e.target.value }))}
                          className="sr-only"
                        />
                      </label>
                    ))}
                  </div>
                  {/* Show price inputs when PAID is selected */}
                  {courseForm.accessType === 'PAID' && (
                    <p className="text-[11px] mt-2 text-text-muted">
                      Khi chon "Tra phi or Ma kich hoat", o nhap gia va gia giam ben duoi se hien thi tren trang chi tiet khoa hoc. Hoc vien co the mua qua VNPay hoac nhap ma kich hoat.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Thumbnail</label>
                    <ImageUpload
                      value={courseForm.thumbnailUrl}
                      onChange={(url) => setCourseForm(p => ({ ...p, thumbnailUrl: url }))}
                      label=""
                      folder="courses"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Video preview URL</label>
                    <input value={courseForm.previewVideoUrl}
                      onChange={e => setCourseForm(p => ({ ...p, previewVideoUrl: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Mô tả đầy đủ</label>
                  <textarea value={courseForm.description}
                    onChange={e => setCourseForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Mô tả chi tiết khoá học (hỗ trợ HTML)"
                    rows={4}
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Bạn sẽ học được gì (mỗi dòng 1 mục)</label>
                    <textarea value={courseForm.whatYouLearn}
                      onChange={e => setCourseForm(p => ({ ...p, whatYouLearn: e.target.value }))}
                      placeholder="- Item 1&#10;- Item 2"
                      rows={3}
                      className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Yêu cầu (mỗi dòng 1 mục)</label>
                    <textarea value={courseForm.requirements}
                      onChange={e => setCourseForm(p => ({ ...p, requirements: e.target.value }))}
                      placeholder="- Item 1&#10;- Item 2"
                      rows={3}
                      className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 resize-y"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm text-text-primary">
                    <input type="checkbox" checked={courseForm.isFeatured}
                      onChange={e => setCourseForm(p => ({ ...p, isFeatured: e.target.checked }))}
                      className="w-4 h-4 rounded accent-neon-violet"
                    />
                    Nổi bật
                  </label>
                  <label className="flex items-center gap-2 text-sm text-text-primary">
                    <input
                      type="checkbox"
                      checked={statusDerived}
                      onChange={e => setCourseForm(p => ({ ...p, status: e.target.checked ? 'PUBLISHED' : 'DRAFT' }))}
                      className="w-4 h-4 rounded accent-neon-violet"
                    />
                    Đã xuất bản
                    <span className="text-[10px] text-text-muted">(đồng bộ với Trạng thái)</span>
                  </label>
                </div>
              </section>

              {/* Sections & Lessons */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Chương & Bài giảng</h3>
                  <button onClick={addSection}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neon-indigo/10 text-neon-indigo text-sm rounded-lg hover:bg-neon-indigo/20 transition-colors">
                    <Plus className="w-4 h-4" />
                    Thêm chương
                  </button>
                </div>

                {/* Course-level documents note + shared materials */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">📝 Ghi chú cho mục Tài liệu (hướng dẫn học viên)</label>
                  <textarea
                    value={courseForm.documentsNote}
                    onChange={e => setCourseForm(prev => ({ ...prev, documentsNote: e.target.value }))}
                    rows={2}
                    placeholder="VD: Tải tài liệu về, giải nén rồi mở file hướng dẫn.pdf trước khi xem video…"
                    className="w-full px-3 py-2.5 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                  />
                </div>
                {editingId ? (
                  <LessonDocumentsManager courseId={editingId} />
                ) : (
                  <p className="text-sm text-text-muted border border-dashed border-darkborder rounded-xl px-4 py-3">
                    📁 Lưu khoá học trước để thêm <b>Tài liệu chung của khoá</b> (hiển thị ở đầu, ngang với chương).
                  </p>
                )}

                {loadingSections && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-neon-violet" />
                  </div>
                )}

                {sections.length === 0 && !loadingSections && (
                  <div className="text-center py-8 border border-dashed border-darkborder rounded-xl">
                    <BookOpen className="w-8 h-8 text-text-muted mx-auto mb-2" />
                    <p className="text-sm text-text-muted">Chưa có chương nào. Nhấn "Thêm chương" để bắt đầu.</p>
                  </div>
                )}

                {sections.map((section, sIdx) => {
                  const expanded = expandedSections.has(sIdx);
                  return (
                  <div key={`${section.id || 'new'}-${sIdx}`} className="border border-darkborder/50 rounded-xl overflow-hidden bg-darkbg/40">
                    {/* Section header */}
                    <div className="w-full px-4 py-3.5 flex items-center justify-between gap-3">
                      <button onClick={() => toggleSectionExpand(sIdx)} className="flex items-center gap-3 text-left hover:bg-white/5 rounded-lg px-2 py-1 -ml-2 flex-1 min-w-0">
                        <FolderTree className="w-5 h-5 text-neon-violet shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-text-primary truncate">{section.title || `Chương ${sIdx + 1}`}</p>
                          <p className="text-xs text-text-muted">{section.lessons.length} bài học</p>
                        </div>
                      </button>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => removeSection(sIdx)}
                          className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors" title="Xoá chương">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {expanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                      </div>
                    </div>

                    {expanded && (
                      <div className="border-t border-darkborder p-4 space-y-5">
                        <div className="grid gap-3 md:grid-cols-[1fr_120px]">
                          <input value={section.title} onChange={e => updateSection(sIdx, { title: e.target.value })}
                            placeholder="Tên chương (VD: Chương 1 - Giới thiệu)"
                            className="px-4 py-2.5 rounded-lg bg-darkbg border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50" />
                          <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-darkbg border border-darkborder text-sm text-text-secondary">
                            <input type="checkbox" checked={section.isLocked} onChange={e => updateSection(sIdx, { isLocked: e.target.checked })} className="accent-neon-violet" /> Khoá
                          </label>
                        </div>
                        <textarea value={section.description} onChange={e => updateSection(sIdx, { description: e.target.value })} rows={2}
                          placeholder="Mô tả chương" className="w-full px-4 py-2.5 rounded-lg bg-darkbg border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50" />

                        <div className="space-y-4">
                          {section.lessons.map((lesson, lIdx) => (
                            <div key={`${lesson.id || 'new'}-${lIdx}`} className="rounded-xl border border-darkborder bg-[#100f1a] p-4 space-y-4">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-text-primary font-semibold text-sm">
                                  <BookOpen className="w-4 h-4 text-neon-indigo" /> Bài học {lIdx + 1}
                                </div>
                                <button onClick={() => removeLesson(sIdx, lIdx)}
                                  className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center gap-1">
                                  <Trash2 className="w-3.5 h-3.5" /> Xoá
                                </button>
                              </div>

                              <div className="grid gap-3 md:grid-cols-2">
                                <input value={lesson.title} onChange={e => updateLesson(sIdx, lIdx, { title: e.target.value })} placeholder="Tiêu đề bài học" className="px-4 py-2.5 rounded-lg bg-darkbg border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50" />
                                <input value={lesson.slug} onChange={e => updateLesson(sIdx, lIdx, { slug: e.target.value })} placeholder="Slug bài học (tự tạo nếu bỏ trống)" className="px-4 py-2.5 rounded-lg bg-darkbg border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50" />
                              </div>

                              <div className="grid gap-3 md:grid-cols-2">
                                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-darkbg border border-darkborder text-sm text-text-secondary">
                                  <span className="text-text-muted text-xs shrink-0">Loại:</span>
                                  <select value={lesson.lessonType} onChange={e => updateLesson(sIdx, lIdx, { lessonType: e.target.value })} className="bg-transparent text-text-primary outline-none w-full cursor-pointer">
                                    <option value="VIDEO">🎬 Video</option>
                                    <option value="QUIZ">📝 Quizz (trắc nghiệm)</option>
                                    <option value="EXERCISE">📄 Bài tập (PDF)</option>
                                    <option value="SOLUTION">✅ Đáp án (PDF)</option>
                                    <option value="TEXT">Text</option>
                                    <option value="PROJECT">Project</option>
                                  </select>
                                </div>
                                <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-darkbg border border-darkborder">
                                  <span className="text-sm text-text-secondary">Hiển thị:</span>
                                  <button type="button" onClick={() => updateLesson(sIdx, lIdx, { isPublished: !lesson.isPublished })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${lesson.isPublished ? 'bg-emerald-500' : 'bg-darkborder'}`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${lesson.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
                                  </button>
                                  <span className={`text-xs font-medium ${lesson.isPublished ? 'text-emerald-400' : 'text-text-muted'}`}>{lesson.isPublished ? 'Published' : 'Draft'}</span>
                                  <label className="flex items-center gap-1 text-xs text-text-muted ml-auto">
                                    <input type="checkbox" checked={lesson.isFreePreview} onChange={e => updateLesson(sIdx, lIdx, { isFreePreview: e.target.checked })} className="accent-neon-violet" /> Học thử
                                  </label>
                                </div>
                              </div>

                              <textarea value={lesson.description} onChange={e => updateLesson(sIdx, lIdx, { description: e.target.value })} rows={2}
                                placeholder="Mô tả bài học" className="w-full px-4 py-2.5 rounded-lg bg-darkbg border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50" />

                              {lesson.lessonType === 'VIDEO' && (
                                <>
                                  <div className="grid gap-3 lg:grid-cols-3">
                                    <label className="rounded-lg border border-darkborder bg-darkbg px-4 py-2.5 text-sm text-text-secondary flex items-center gap-2"><Video className="w-4 h-4 text-neon-violet shrink-0" />
                                      <select value={lesson.videoPlatform} onChange={e => updateLesson(sIdx, lIdx, { videoPlatform: e.target.value as LessonForm['videoPlatform'] })} className="bg-transparent text-text-primary outline-none w-full cursor-pointer">
                                        <option value="EMBED">Embed trên web</option>
                                        <option value="YOUTUBE_TAB">Mở tab YouTube</option>
                                        <option value="DIRECT">Direct video</option>
                                      </select>
                                    </label>
                                    <input value={lesson.videoUrl} onChange={e => updateLesson(sIdx, lIdx, { videoUrl: e.target.value })} placeholder={lesson.videoPlatform === 'DIRECT' ? 'Link .mp4 ngoài — hoặc tải video lên bên dưới' : 'Video URL / YouTube URL'} className="px-4 py-2.5 rounded-lg bg-darkbg border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 lg:col-span-2" />
                                  </div>

                                  {lesson.videoPlatform === 'DIRECT' && (
                                    <LessonVideoManager
                                      lessonId={lesson.id}
                                      videoUrl={lesson.videoUrl}
                                      onSaved={data => updateLesson(sIdx, lIdx, {
                                        videoPlatform: 'DIRECT',
                                        videoUrl: data.videoUrl,
                                        ...(data.videoDurationSeconds ? { videoDurationSeconds: data.videoDurationSeconds } : {}),
                                      })}
                                      onDeleted={() => updateLesson(sIdx, lIdx, { videoUrl: '' })}
                                    />
                                  )}

                                  <div className="grid gap-3 md:grid-cols-2">
                                    <input value={lesson.sourceCodeUrl} onChange={e => updateLesson(sIdx, lIdx, { sourceCodeUrl: e.target.value })} placeholder="GitHub / source code URL" className="px-4 py-2.5 rounded-lg bg-darkbg border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50" />
                                    <input type="number" value={lesson.videoDurationSeconds} onChange={e => updateLesson(sIdx, lIdx, { videoDurationSeconds: Number(e.target.value) })} placeholder="Thời lượng video (giây)" className="px-4 py-2.5 rounded-lg bg-darkbg border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50" />
                                  </div>
                                </>
                              )}

                              {lesson.lessonType === 'QUIZ' && (
                                <LessonQuizBuilder value={lesson.quizData} onChange={data => updateLesson(sIdx, lIdx, { quizData: data })} />
                              )}

                              {(lesson.lessonType === 'EXERCISE' || lesson.lessonType === 'SOLUTION') && (
                                <div className="rounded-lg border border-dashed border-neon-violet/40 bg-neon-violet/5 p-3 space-y-3">
                                  <p className="text-xs text-text-secondary">
                                    📄 Tải file <b>PDF</b> {lesson.lessonType === 'EXERCISE' ? 'bài tập' : 'đáp án'} — học viên xem ngay trong trang học.
                                  </p>
                                  {lesson.id ? (
                                    <LessonDocumentsManager lessonId={lesson.id} initialDocuments={lesson.documents || []} />
                                  ) : (
                                    <p className="text-xs text-amber-400">⚠️ Bấm <b>Lưu</b> (cuối trang) để lưu bài học trước, rồi ô tải PDF sẽ hiện ra đây.</p>
                                  )}
                                </div>
                              )}

                              <div>
                                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-text-primary"><FileText className="w-4 h-4 text-neon-violet" /> Ghi chú giảng dạy</p>
                                <RichTextEditor value={lesson.teachingNotes} onChange={value => updateLesson(sIdx, lIdx, { teachingNotes: value, content: value })} placeholder="Nội dung bài giảng, markdown được hỗ trợ..." />
                              </div>

                              {lesson.id && lesson.lessonType !== 'EXERCISE' && lesson.lessonType !== 'SOLUTION' && (
                                <div className="mt-2">
                                  <LessonDocumentsManager lessonId={lesson.id} initialDocuments={lesson.documents || []} />
                                </div>
                              )}
                            </div>
                          ))}

                          <button onClick={() => addLesson(sIdx)}
                            className="w-full rounded-lg border border-dashed border-neon-violet/30 py-3 text-sm text-neon-violet hover:bg-neon-violet/10 flex items-center justify-center gap-2 transition-colors">
                            <Plus className="w-4 h-4" /> Thêm bài học
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  );
                })}
              </section>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-darkborder">
              <button onClick={closeForm}
                className="px-5 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary hover:border-neon-violet/30 transition-colors">
                Hủy
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo khoá học'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
