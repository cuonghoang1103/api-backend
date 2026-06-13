'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Code2, ExternalLink, FileText, Loader2, PlayCircle, Save, Search, Video } from 'lucide-react';
import Link from 'next/link';
import { academyApi, adminCoursesApi } from '@/lib/api';
import type { Semester, Course } from '@/types';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { toast } from 'sonner';

interface LessonInfo {
  id: number;
  title: string;
  slug: string;
  description: string;
  lessonType: string;
  videoPlatform: string;
  videoUrl: string;
  sourceCodeUrl: string;
  teachingNotes: string;
  videoDurationSeconds: number;
  courseTitle: string;
  semesterName: string;
  courseCode: string;
}

const emptyLesson: LessonInfo = {
  id: 0,
  title: '',
  slug: '',
  description: '',
  lessonType: 'VIDEO',
  videoPlatform: 'EMBED',
  videoUrl: '',
  sourceCodeUrl: '',
  teachingNotes: '',
  videoDurationSeconds: 0,
  courseTitle: '',
  semesterName: '',
  courseCode: '',
};

export default function AdminLessonsPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | undefined>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();
  const [selectedLessonId, setSelectedLessonId] = useState<number | undefined>();
  const [lessons, setLessons] = useState<LessonInfo[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<LessonInfo>(emptyLesson);
  const [search, setSearch] = useState('');

  useEffect(() => {
    academyApi.getSemesters()
      .then((res) => {
        const rows = res.data.data || [];
        setSemesters(rows);
        if (rows.length > 0) setSelectedSemesterId(rows[0].id);
      })
      .catch(() => toast.error('Không tải được học kỳ'));
  }, []);

  useEffect(() => {
    if (!selectedSemesterId) return;
    setLoadingCourses(true);
    setSelectedCourseId(undefined);
    setLessons([]);
    setForm(emptyLesson);
    academyApi.getCoursesBySemester(selectedSemesterId, { includeDraft: true })
      .then((res) => setCourses(res.data.data || []))
      .catch(() => toast.error('Không tải được môn học'))
      .finally(() => setLoadingCourses(false));
  }, [selectedSemesterId]);

  useEffect(() => {
    if (!selectedCourseId) {
      setLessons([]);
      setForm(emptyLesson);
      return;
    }
    const course = courses.find((c) => c.id === selectedCourseId);
    if (!course?.sections) return;
    const flatLessons: LessonInfo[] = [];
    course.sections.forEach((section: any) => {
      (section.lessons || []).forEach((lesson: any) => {
        flatLessons.push({
          id: lesson.id,
          title: lesson.title,
          slug: lesson.slug || '',
          description: lesson.description || '',
          lessonType: lesson.lessonType || 'VIDEO',
          videoPlatform: lesson.videoPlatform || 'EMBED',
          videoUrl: lesson.videoUrl || '',
          sourceCodeUrl: lesson.sourceCodeUrl || '',
          teachingNotes: lesson.teachingNotes || lesson.content || '',
          videoDurationSeconds: lesson.videoDurationSeconds || 0,
          courseTitle: course.title,
          semesterName: course.semesterName || '',
          courseCode: course.courseCode || '',
        });
      });
    });
    setLessons(flatLessons);
  }, [selectedCourseId, courses]);

  const selectLesson = (lesson: LessonInfo) => {
    setSelectedLessonId(lesson.id);
    setForm(lesson);
  };

  const saveLesson = async () => {
    if (!selectedLessonId) return;
    setSaving(true);
    try {
      // Lesson-detail (video-related fields) and the lesson row itself
      // (slug, duration) live in two different tables, so they have to
      // be persisted via two separate endpoints. Previously the second
      // call was missing, so any user edit to slug / duration was
      // silently dropped on save.
      await Promise.all([
        adminCoursesApi.updateLessonDetail(selectedLessonId, {
          videoPlatform: form.videoPlatform,
          videoUrl: form.videoUrl,
          sourceCodeUrl: form.sourceCodeUrl,
          teachingNotes: form.teachingNotes,
        }),
        adminCoursesApi.updateLesson(selectedLessonId, {
          slug: form.slug,
          videoDurationSeconds: form.videoDurationSeconds,
        }),
      ]);
      toast.success('Lưu chi tiết bài giảng thành công');
      setLessons((prev) => prev.map((l) => l.id === selectedLessonId ? { ...form } : l));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const filteredLessons = lessons.filter((l) =>
    !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      {/* Sidebar */}
      <aside className="bg-darkcard border border-darkborder rounded-2xl p-4 h-fit sticky top-4 space-y-4">
        <div>
          <h2 className="text-lg font-heading font-bold text-text-primary mb-3">Bài giảng</h2>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm bài giảng..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary text-sm"
            />
          </div>
        </div>

        {/* Semester/Course selector */}
        <div className="space-y-2">
          <label className="block text-xs text-text-muted uppercase tracking-wider">Học kỳ</label>
          <select
            value={selectedSemesterId || ''}
            onChange={(e) => setSelectedSemesterId(Number(e.target.value) || undefined)}
            className="w-full px-3 py-2 rounded-xl bg-darkbg border border-darkborder text-text-primary text-sm"
          >
            <option value="">Chọn học kỳ</option>
            {semesters.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <label className="block text-xs text-text-muted uppercase tracking-wider mt-2">Môn học</label>
          {loadingCourses ? (
            <Loader2 className="w-5 h-5 animate-spin text-neon-violet" />
          ) : (
            <select
              value={selectedCourseId || ''}
              onChange={(e) => setSelectedCourseId(Number(e.target.value) || undefined)}
              className="w-full px-3 py-2 rounded-xl bg-darkbg border border-darkborder text-text-primary text-sm"
            >
              <option value="">Chọn môn học</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.courseCode || c.title}</option>
              ))}
            </select>
          )}
        </div>

        {/* Lessons list */}
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {filteredLessons.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-4">
              {selectedCourseId ? 'Chưa có bài giảng nào' : 'Chọn môn học để xem bài giảng'}
            </p>
          ) : (
            filteredLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => selectLesson(lesson)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  selectedLessonId === lesson.id
                    ? 'border-neon-violet bg-neon-violet/10'
                    : 'border-darkborder bg-darkbg hover:border-neon-violet/30'
                }`}
              >
                <p className="text-sm font-semibold text-text-primary line-clamp-2">{lesson.title}</p>
                <p className="text-xs text-text-muted mt-1">{lesson.slug}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-muted">{lesson.lessonType}</span>
                  {lesson.videoUrl && <span className="text-xs text-green-400">Có video</span>}
                  {lesson.sourceCodeUrl && <span className="text-xs text-neon-indigo">Có code</span>}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Detail editor */}
      <section className="space-y-4">
        {selectedLessonId ? (
          <>
            {/* Lesson header */}
            <div className="bg-darkcard border border-darkborder rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Bài giảng</p>
                  <h1 className="text-xl font-heading font-bold text-text-primary mt-1">{form.title}</h1>
                  <p className="text-sm text-text-muted mt-1">{form.courseTitle} — {form.courseCode}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedCourseId && (
                    <Link
                      href="/admin/academy"
                      className="px-4 py-2.5 rounded-xl border border-darkborder text-text-secondary hover:border-neon-violet hover:text-neon-violet flex items-center gap-2 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" /> Mở course builder
                    </Link>
                  )}
                  <button
                    onClick={saveLesson}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white flex items-center gap-2 disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" /> {saving ? 'Đang lưu...' : 'Lưu'}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    <Video className="w-4 h-4 inline mr-1" /> Nền tảng video
                  </label>
                  <select
                    value={form.videoPlatform}
                    onChange={(e) => setForm((p) => ({ ...p, videoPlatform: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary"
                  >
                    <option value="EMBED">Embed trên web</option>
                    <option value="YOUTUBE_TAB">Mở tab YouTube</option>
                    <option value="DIRECT">Direct video URL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    <PlayCircle className="w-4 h-4 inline mr-1" /> Video URL
                  </label>
                  <input
                    value={form.videoUrl}
                    onChange={(e) => setForm((p) => ({ ...p, videoUrl: e.target.value }))}
                    placeholder="YouTube URL hoặc video embed URL"
                    className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary"
                  />
                </div>
              </div>
            </div>

            {/* Source code */}
            <div className="bg-darkcard border border-darkborder rounded-2xl p-6">
              <h2 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-neon-violet" /> Source Code
              </h2>
              <input
                value={form.sourceCodeUrl}
                onChange={(e) => setForm((p) => ({ ...p, sourceCodeUrl: e.target.value }))}
                placeholder="GitHub repository URL hoặc source code URL"
                className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary"
              />
            </div>

            {/* Teaching notes */}
            <div className="bg-darkcard border border-darkborder rounded-2xl p-6">
              <h2 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-neon-violet" /> Ghi chú giảng dạy
              </h2>
              <RichTextEditor
                value={form.teachingNotes}
                onChange={(value) => setForm((p) => ({ ...p, teachingNotes: value }))}
                placeholder="Nội dung bài giảng, markdown được hỗ trợ..."
              />
            </div>

            {/* Slug & meta */}
            <div className="bg-darkcard border border-darkborder rounded-2xl p-6">
              <h2 className="text-lg font-heading font-semibold text-text-primary mb-4">Thông tin bổ sung</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="lesson-slug"
                    className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Loại bài học</label>
                  <input
                    value={form.lessonType}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-muted cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Thời lượng video (giây)</label>
                  <input
                    type="number"
                    value={form.videoDurationSeconds}
                    onChange={(e) => setForm((p) => ({ ...p, videoDurationSeconds: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-darkcard border border-darkborder rounded-2xl p-20 flex flex-col items-center justify-center text-center gap-4">
            <BookOpen className="w-16 h-16 text-text-muted/30" />
            <h2 className="text-xl font-heading font-bold text-text-primary">Chọn một bài giảng</h2>
            <p className="text-text-secondary">Chọn môn học và bài giảng ở panel bên trái để chỉnh sửa chi tiết.</p>
          </div>
        )}
      </section>
    </div>
  );
}
