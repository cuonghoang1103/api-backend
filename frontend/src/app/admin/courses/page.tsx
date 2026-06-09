'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Search, Pencil, Trash2, X, ChevronLeft, ChevronRight,
  CheckCircle, Clock, AlertCircle, Eye, EyeOff, Loader2,
  ChevronDown, ChevronUp, BookOpen, Play, FileText, Link, Video, Image
} from 'lucide-react';
import { adminCoursesApi, courseCategoryApi } from '@/lib/api';
import { toast } from 'sonner';
import type { Course, CourseCategory, CourseSection as CCSection, LessonDto } from '@/types';
import ImageUpload from '@/components/admin/ImageUpload';

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
const STATUSES = ['DRAFT', 'PUBLISHED'];
const LESSON_TYPES = ['VIDEO', 'TEXT', 'QUIZ'];

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
  description: string;
  content: string;
  lessonType: string;
  videoUrl: string;
  videoDurationSeconds: number;
  thumbnailUrl: string;
  isFreePreview: boolean;
  isPublished: boolean;
  sortOrder: number;
  documents: DocForm[];
}

interface DocForm {
  id?: number;
  title: string;
  fileUrl: string;
  fileSizeBytes: number;
  fileType: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
  // Single source of truth: `status` drives visibility.
  // isPublished is kept for backward compatibility but mirrors `status`.
  useEffect(() => {
    setCourseForm(prev => ({
      ...prev,
      isPublished: prev.status === 'PUBLISHED',
    }));
  }, [courseForm.status]);

  // ── Auto-sync isPublished → status (handles checkbox click from old data) ─
  useEffect(() => {
    setCourseForm(prev => ({
      ...prev,
      status: prev.isPublished ? 'PUBLISHED' : 'DRAFT',
    }));
  }, [courseForm.isPublished]);

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
      requirements: course.requirements || '',
      whatYouLearn: course.whatYouLearn || '',
      status: course.status || 'DRAFT',
      tags: course.tags || [],
      categoryId: course.categoryId || 0,
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
            description: l.description || '',
            content: l.content || '',
            lessonType: l.lessonType || 'VIDEO',
            videoUrl: l.videoUrl || '',
            videoDurationSeconds: l.videoDurationSeconds || 0,
            thumbnailUrl: l.thumbnailUrl || '',
            isFreePreview: l.isFreePreview || false,
            isPublished: l.isPublished || false,
            sortOrder: l.sortOrder,
            documents: [],
          })),
        }));
        setSections(loaded);
        setExpandedSections(new Set(loaded.map((_, index) => index)));
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

  const updateSection = (idx: number, field: keyof SectionForm, value: unknown) => {
    setSections(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const removeSection = (idx: number) => {
    setSections(prev => prev.filter((_, i) => i !== idx));
  };

  // Lesson management
  const addLesson = (sectionIdx: number) => {
    const section = sections[sectionIdx];
    setSections(prev => prev.map((s, i) =>
      i === sectionIdx ? {
        ...s,
        lessons: [...s.lessons, {
          title: '',
          description: '',
          content: '',
          lessonType: 'VIDEO',
          videoUrl: '',
          videoDurationSeconds: 0,
          thumbnailUrl: '',
          isFreePreview: false,
          isPublished: false,
          sortOrder: s.lessons.length,
          documents: [],
        }],
      } : s
    ));
  };

  const updateLesson = (sectionIdx: number, lessonIdx: number, field: keyof LessonForm, value: unknown) => {
    setSections(prev => prev.map((s, si) =>
      si === sectionIdx ? {
        ...s,
        lessons: s.lessons.map((l, li) =>
          li === lessonIdx ? { ...l, [field]: value } : l
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
        level: courseForm.level,
        language: courseForm.language,
        isFree: courseForm.isFree,
        isFeatured: courseForm.isFeatured,
        isPublished: courseForm.isPublished,
        requirements: courseForm.requirements,
        whatYouLearn: courseForm.whatYouLearn,
        status: courseForm.status,
        tags: courseForm.tags,
      };

      if (editingId) {
        await adminCoursesApi.update(editingId, payload);
        toast.success('Cập nhật khoá học thành công!');
      } else {
        const created = await adminCoursesApi.create(payload);
        const newId = created.data.data.id;
        for (const section of sections) {
          if (!section.title.trim()) continue;
          const secRes = await adminCoursesApi.createSection({
            courseId: newId,
            title: section.title,
            description: section.description,
            sortOrder: section.sortOrder,
            isLocked: section.isLocked,
          });
          const secId = secRes.data.data.id;
          for (const lesson of section.lessons) {
            if (!lesson.title.trim()) continue;
            await adminCoursesApi.createLesson({
              sectionId: secId,
              title: lesson.title,
              description: lesson.description,
              content: lesson.content,
              lessonType: lesson.lessonType,
              videoUrl: lesson.videoUrl,
              videoDurationSeconds: lesson.videoDurationSeconds,
              thumbnailUrl: lesson.thumbnailUrl,
              isFreePreview: lesson.isFreePreview,
              isPublished: lesson.isPublished,
              sortOrder: lesson.sortOrder,
            });
          }
        }
        toast.success('Tạo khoá học thành công!');
      }
      closeForm();
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Tìm kiếm khoá học..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
          />
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
                          <div>
                            <p className="font-medium text-text-primary text-sm line-clamp-1">{course.title}</p>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="flex items-center pt-7 gap-3">
                    <input type="checkbox" id="isFree" checked={courseForm.isFree}
                      onChange={e => setCourseForm(p => ({ ...p, isFree: e.target.checked }))}
                      className="w-4 h-4 rounded accent-neon-violet"
                    />
                    <label htmlFor="isFree" className="text-sm text-text-primary">Khoá học miễn phí</label>
                  </div>
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
                    <input type="checkbox" checked={courseForm.isPublished}
                      onChange={e => setCourseForm(p => ({ ...p, isPublished: e.target.checked }))}
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

                {sections.map((section, sIdx) => (
                  <div key={sIdx} className="border border-darkborder/50 rounded-xl overflow-hidden">
                    {/* Section header */}
                    <div className="flex items-center gap-3 p-4 bg-darkbg/50">
                      <button onClick={() => toggleSectionExpand(sIdx)}
                        className="text-text-muted hover:text-text-primary transition-colors">
                        {expandedSections.has(sIdx) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      <input value={section.title}
                        onChange={e => updateSection(sIdx, 'title', e.target.value)}
                        placeholder="Tên chương (VD: Chương 1 - Giới thiệu)"
                        className="flex-1 px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                      />
                      <label className="flex items-center gap-1.5 text-xs text-text-muted shrink-0">
                        <input type="checkbox" checked={section.isLocked}
                          onChange={e => updateSection(sIdx, 'isLocked', e.target.checked)}
                          className="w-3.5 h-3.5 rounded accent-neon-violet"
                        />
                        Khóa
                      </label>
                      <button onClick={() => removeSection(sIdx)}
                        className="p-1.5 text-text-muted hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Lessons */}
                    {expandedSections.has(sIdx) && (
                      <div className="divide-y divide-darkborder/20">
                        {section.lessons.map((lesson, lIdx) => (
                          <div key={lIdx} className="p-4 pl-12 space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-text-muted bg-darkbg px-2 py-0.5 rounded shrink-0">
                                {lesson.lessonType}
                              </span>
                              <input value={lesson.title}
                                onChange={e => updateLesson(sIdx, lIdx, 'title', e.target.value)}
                                placeholder="Tên bài giảng"
                                className="flex-1 px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                              />
                              <button onClick={() => removeLesson(sIdx, lIdx)}
                                className="p-1.5 text-text-muted hover:text-red-400 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <select value={lesson.lessonType}
                                onChange={e => updateLesson(sIdx, lIdx, 'lessonType', e.target.value)}
                                className="px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-xs text-text-primary focus:outline-none focus:border-neon-violet/50 cursor-pointer"
                              >
                                {LESSON_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                              <input value={lesson.videoUrl}
                                onChange={e => updateLesson(sIdx, lIdx, 'videoUrl', e.target.value)}
                                placeholder="Video URL"
                                className="px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                              />
                              <div className="flex items-center gap-2">
                                <label className="flex items-center gap-1 text-xs text-text-muted">
                                  <input type="checkbox" checked={lesson.isFreePreview}
                                    onChange={e => updateLesson(sIdx, lIdx, 'isFreePreview', e.target.checked)}
                                    className="w-3.5 h-3.5 rounded accent-neon-violet"
                                  />
                                  Free
                                </label>
                                <label className="flex items-center gap-1 text-xs text-text-muted">
                                  <input type="checkbox" checked={lesson.isPublished}
                                    onChange={e => updateLesson(sIdx, lIdx, 'isPublished', e.target.checked)}
                                    className="w-3.5 h-3.5 rounded accent-neon-violet"
                                  />
                                  Pub
                                </label>
                              </div>
                            </div>
                            <textarea value={lesson.content}
                              onChange={e => updateLesson(sIdx, lIdx, 'content', e.target.value)}
                              placeholder="Nội dung bài giảng (HTML)"
                              rows={2}
                              className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 resize-y"
                            />
                          </div>
                        ))}
                        <button onClick={() => addLesson(sIdx)}
                          className="w-full flex items-center justify-center gap-1.5 p-3 text-sm text-text-muted hover:text-neon-indigo hover:bg-neon-indigo/5 transition-colors">
                          <Plus className="w-4 h-4" />
                          Thêm bài giảng
                        </button>
                      </div>
                    )}
                  </div>
                ))}
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
