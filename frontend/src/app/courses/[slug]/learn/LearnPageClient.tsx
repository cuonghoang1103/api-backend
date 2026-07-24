'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, CheckCircle, Circle, Lock, Menu, X,
  Download, BookOpen, Loader2, Play, ChevronDown, ChevronUp, ArrowLeft,
  Code2, ExternalLink, FileText, Github, Award, Ticket
} from 'lucide-react';
import { coursesApi, certificatesApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { sanitizeHtml, stripInlineColors, pickLang } from '@/lib/utils';
import { useTranslation } from '@/context/LocaleContext';
import { loadYouTubeAPI, isYouTubeUrl } from '@/lib/youtube-player';
import LessonQuizPlayer, { type QuizData } from './LessonQuizPlayer';
import LessonPdfViewer from './LessonPdfViewer';
import type { Course, LessonDto, LessonProgress, LessonDetail } from '@/types';

function formatDuration(seconds: number): string {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v >= 10 ? 0 : 1)} ${units[i]}`;
}

// Normalize a YouTube watch / share / short URL into the canonical
// embed form so we can play it inside an <iframe> on the learn page.
function toEmbedUrl(raw?: string): string {
  if (!raw) return '';
  if (raw.includes('youtube.com/embed/') || raw.includes('youtube-nocookie.com/embed/')) return raw;
  const watchMatch = raw.match(/[?&]v=([^&]+)/);
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = raw.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  if (/^[a-zA-Z0-9_-]{6,}$/.test(raw)) return `https://www.youtube.com/embed/${raw}`;
  return raw;
}

interface FlatLesson {
  sectionId: number;
  sectionTitle: string;
  sectionLocked: boolean;
  lesson: LessonDto;
}

// Backend (NestJS + Prisma) returns the nested detail object under
// the key `details` (plural — matches the Prisma relation name).
// Older API responses used `detail` (singular). To stay
// forward-compatible with both shapes we read whichever is
// present and treat them as the same object.
function getLessonDetail(lesson: LessonDto): LessonDetail | undefined {
  const anyLesson = lesson as any;
  return anyLesson.details || lesson.detail;
}

interface LearnPageClientProps {
  slug: string;
}

export default function LearnPageClient({ slug }: LearnPageClientProps) {
  // The server-side wrapper (page.tsx) has already verified
  // the backend_token httpOnly cookie is present, so we don't
  // need the multi-source auth gate (mounted && isHydrated &&
  // isSessionReady) the previous version had — that gate
  // could sit in 'false' indefinitely when Zustand's localStorage
  // copy was out of sync with the cookie, which left the page
  // stuck in the loading branch forever. The API client sends
  // the cookie on every request, so a stale Zustand state can
  // only delay `isEnrolled` derivation by one extra render at
  // most.
  const router = useRouter();
  const { locale, setLocale } = useTranslation();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<LessonDto | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProgress, setSavingProgress] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [videoKey, setVideoKey] = useState(0);
  // Only the setter is used now (we reset it on lesson change / completion);
  // the value itself is no longer read since we dropped the YouTube auto-mark.
  const [, setVideoCompleted] = useState(false);
  // Course-level documents (the fixed "Tài liệu" area shown at the top of
  // Course Content, above the chapters).
  const [courseDocs, setCourseDocs] = useState<
    Array<{ id: number; title: string; fileUrl: string; fileType?: string | null; fileSizeBytes: number }>
  >([]);
  const [docsOpen, setDocsOpen] = useState(true);
  // Durations measured client-side this session (lessonId → seconds).
  // Overlays the stored videoDurationSeconds so section/lesson labels
  // update in real time as each video's metadata loads — no reload.
  const [durationOverrides, setDurationOverrides] = useState<Record<number, number>>({});
  // Certificate (earned at 100%) + the 10%-off code redeemed from it.
  const [certificate, setCertificate] = useState<{ id: number; certificateNumber: string } | null>(null);
  const [redeemCode, setRedeemCode] = useState<{ code: string; expiresAt: string | null } | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    loadCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const [loadError, setLoadError] = useState<string | null>(null);

  const loadCourse = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await coursesApi.getBySlug(slug);
      const data = res.data.data as Course;
      if (!data) {
        setLoadError('NOT_FOUND');
        return;
      }
      if (!data.isEnrolled) {
        // Authenticated but not enrolled — bounce back to the
        // public course detail page so they can hit Enroll.
        toast.error('Bạn chưa đăng ký khóa học này');
        router.push(`/courses/${slug}`);
        return;
      }

      // Enrollment expired: hasPaidAccess is false but enrollment row exists.
      if (data.enrollmentExpiresAt && !data.hasPaidAccess) {
        toast.error('Quyền truy cập đã hết hạn. Vui lòng gia hạn để tiếp tục học.');
        router.push(`/courses/${slug}`);
        return;
      }

      // CODE enrollment gate: requires re-entry of the activation code each browser
      // session. PAID enrollments bypass this gate entirely — persistent access.
      const isPaidEnrollment = data.enrollmentSource === 'PAID';
      if (!isPaidEnrollment && data.enrollmentSource === 'CODE' && !sessionStorage.getItem(`code_session_${data.id}`)) {
        toast.info('Vui lòng nhập mã kích hoạt để tiếp tục phiên học');
        router.push(`/courses/${slug}`);
        return;
      }
      setCourse(data);

      // Fixed course-level documents — shown at the top of Course Content.
      try {
        const dr = await coursesApi.getCourseDocuments(data.id);
        setCourseDocs((dr.data?.data as typeof courseDocs) ?? []);
      } catch {
        setCourseDocs([]);
      }

      // Sections start COLLAPSED by default (per request). The section
      // holding the active lesson is auto-expanded in selectLesson().
      setExpandedSections(new Set());

      // Load progress
      try {
        const progRes = await coursesApi.getProgress(data.id);
        setProgress(progRes.data.data || []);
      } catch {
        // Progress is non-critical — keep going with an empty list
        // so the user can still watch the lesson.
        setProgress([]);
      }

      // Pick first lesson or last accessed, honouring ?lessonId= in URL.
      //
      // IMPORTANT: do this synchronously from the data we just
      // received. We can't call the `selectLesson` function from
      // here because the `course` state captured in its closure is
      // still null (React batches setCourse) — the early `if
      // (!course) return` would silently drop the auto-select and
      // the page would sit there with the spinner forever showing
      // an empty main column.
      if (data.sections && data.sections.length > 0) {
        const requestedLessonId = typeof window !== 'undefined'
          ? Number(new URLSearchParams(window.location.search).get('lessonId')) || null
          : null;
        const allLessons = data.sections.flatMap(s => s.lessons || []);
        const target = (requestedLessonId && allLessons.find(l => l.id === requestedLessonId))
          || allLessons[0];
        if (target) {
          setCurrentLesson(target);
          setVideoKey(k => k + 1);
          setVideoCompleted(false);
          // Fire-and-forget the detail fetch — we already have
          // enough to render the video; details enrich it later.
          coursesApi.getLesson(data.id, target.id)
            .then((lessonRes) => {
              const detail = lessonRes?.data?.data;
              if (detail) {
                setCurrentLesson((prev) => (prev?.id === target.id ? detail : prev));
              }
            })
            .catch(() => {
              // Detail enrichment is best-effort; keep the
              // minimal lesson from the course payload.
            });
        }
      }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[learn] loadCourse ERROR', err?.response?.status, err?.message);
      // Distinguish 404 from 401/network so the error UI is
      // actionable instead of the catch-all "Course not found".
      const status = err?.response?.status;
      if (status === 404) {
        setLoadError('NOT_FOUND');
      } else if (status === 401) {
        // Token expired mid-session — push them back to login,
        // this time the auth flow will pick up the fresh cookie.
        const callback = encodeURIComponent(`/courses/${slug}/learn`);
        router.push(`/login?callbackUrl=${callback}`);
        return;
      } else {
        setLoadError('NETWORK');
        toast.error('Không tải được khóa học. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  }, [router, slug]);

  const selectLesson = useCallback(async (lesson: LessonDto) => {
    if (!course) return;
    setCurrentLesson(lesson);
    // Keep the section that holds this lesson expanded (sections are
    // collapsed by default).
    const sec = course.sections?.find(s => s.lessons?.some(l => l.id === lesson.id));
    if (sec) setExpandedSections(prev => new Set(prev).add(sec.id));
    setVideoKey(k => k + 1);
    setVideoCompleted(false);
    try {
      const res = await coursesApi.getLesson(course.id, lesson.id);
      const detail = res?.data?.data;
      if (detail) setCurrentLesson(detail);
    } catch {
      // lesson already set from course data
    }
  }, [course]);

  const isCompleted = (lessonId: number) =>
    progress.find(p => p.lessonId === lessonId)?.isCompleted || false;

  const markComplete = async () => {
    if (!course || !currentLesson || savingProgress) return;
    setSavingProgress(true);
    try {
      await coursesApi.updateProgress(course.id, {
        lessonId: currentLesson.id,
        isCompleted: true,
        watchTimeSeconds: currentLesson.videoDurationSeconds,
        lastPositionSeconds: 0,
      });
      setProgress(prev => [...prev.filter(p => p.lessonId !== currentLesson.id), {
        lessonId: currentLesson.id,
        isCompleted: true,
        watchTimeSeconds: currentLesson.videoDurationSeconds || 0,
        lastPositionSeconds: 0,
      }]);
      setVideoCompleted(true);
      toast.success('Lesson completed!');
    } catch {
      toast.error('Unable to save progress');
    } finally {
      setSavingProgress(false);
    }
  };

  // Periodically persist the playhead so the student resumes exactly
  // where they left off. Throttled (12s) to avoid hammering the API;
  // also called on pause and when leaving a lesson. We deliberately
  // omit isCompleted so a partial watch never flips completion state.
  const lastPosSaveRef = useRef(0);
  const savePosition = useCallback((seconds: number, force = false) => {
    if (!course || !currentLesson || !Number.isFinite(seconds) || seconds < 1) return;
    const now = Date.now();
    if (!force && now - lastPosSaveRef.current < 12000) return;
    lastPosSaveRef.current = now;
    const secs = Math.round(seconds);
    setProgress(prev => {
      const existing = prev.find(p => p.lessonId === currentLesson.id);
      const merged: LessonProgress = {
        ...(existing as LessonProgress),
        lessonId: currentLesson.id,
        isCompleted: existing?.isCompleted || false,
        watchTimeSeconds: Math.max(existing?.watchTimeSeconds || 0, secs),
        lastPositionSeconds: secs,
      };
      return [...prev.filter(p => p.lessonId !== currentLesson.id), merged];
    });
    coursesApi
      .updateProgress(course.id, { lessonId: currentLesson.id, watchTimeSeconds: secs, lastPositionSeconds: secs })
      .catch(() => { /* best-effort — never block playback */ });
  }, [course, currentLesson]);

  // Effective duration = this session's measured value (if any) else the
  // stored one. Used for the sidebar labels + section totals.
  const lessonDuration = (lesson: { id: number; videoDurationSeconds?: number }) =>
    durationOverrides[lesson.id] ?? lesson.videoDurationSeconds ?? 0;
  const sectionDuration = (section: { lessons?: Array<{ id: number; videoDurationSeconds?: number }> }) =>
    (section.lessons || []).reduce((sum, l) => sum + lessonDuration(l), 0);

  // Record a lesson's measured duration once per session, and persist it
  // server-side (the API only fills in when the stored value is 0).
  const reportedDurRef = useRef<Set<number>>(new Set());
  const reportDuration = useCallback((lessonId: number, seconds: number) => {
    const secs = Math.round(seconds);
    if (!Number.isFinite(secs) || secs <= 0 || reportedDurRef.current.has(lessonId)) return;
    reportedDurRef.current.add(lessonId);
    setDurationOverrides(prev => ({ ...prev, [lessonId]: secs }));
    coursesApi.reportLessonDuration(lessonId, secs).catch(() => { /* best-effort */ });
  }, []);

  // Once every lesson is complete the backend has issued a certificate
  // (auto-issued by the progress endpoint). Fetch it so we can show the
  // completion banner + redeem CTA.
  useEffect(() => {
    if (!course || !course.totalLessons || certificate) return;
    const completed = progress.filter(p => p.isCompleted).length;
    if (completed >= course.totalLessons) {
      certificatesApi.getForCourse(course.id)
        .then(res => {
          const c = res.data?.data as { id: number; certificateNumber: string } | undefined;
          if (c?.id) setCertificate({ id: c.id, certificateNumber: c.certificateNumber });
        })
        .catch(() => { /* not issued yet / race — the effect re-runs on next progress change */ });
    }
  }, [progress, course, certificate]);

  const handleRedeem = async () => {
    if (!certificate || redeeming) return;
    setRedeeming(true);
    try {
      const res = await certificatesApi.redeem(certificate.id);
      const d = res.data.data;
      setRedeemCode({ code: d.code, expiresAt: d.expiresAt });
      toast.success(d.alreadyRedeemed ? 'Đây là mã giảm giá của bạn' : 'Đổi mã giảm 10% thành công!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Đổi mã thất bại');
    } finally {
      setRedeeming(false);
    }
  };

  const getFlatLessons = (): FlatLesson[] => {
    if (!course?.sections) return [];
    return course.sections.flatMap(section =>
      (section.lessons || []).map(lesson => ({
        sectionId: section.id,
        sectionTitle: pickLang(section.title, locale),
        sectionLocked: section.isLocked || false,
        lesson,
      }))
    );
  };

  const flatLessons = getFlatLessons();
  const currentIndex = currentLesson ? flatLessons.findIndex(f => f.lesson.id === currentLesson.id) : -1;
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1]?.lesson : null;
  const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1]?.lesson : null;

  // Resume the current lesson's video from the last saved position —
  // but only if the lesson isn't already completed (a finished lesson
  // should start from the top on rewatch).
  const resumeAt = currentLesson
    ? (progress.find(p => p.lessonId === currentLesson.id && !p.isCompleted)?.lastPositionSeconds || 0)
    : 0;

  const toggleSection = (id: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-darkbg flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-neon-violet" />
      </div>
    );
  }

  if (loadError === 'NOT_FOUND' || (!course && loadError)) {
    return (
      <div className="min-h-screen bg-darkbg flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
            Không tìm thấy khóa học
          </h2>
          <p className="text-text-secondary text-sm mb-6">
            Khóa học <span className="font-mono text-text-primary">{slug}</span> không tồn tại hoặc đã bị xoá.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/courses"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Về danh sách khóa học
            </Link>
            <Link
              href="/academy"
              className="px-5 py-2.5 rounded-xl border border-darkborder text-text-secondary hover:bg-white/5 text-sm"
            >
              Về Academy
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loadError === 'NETWORK') {
    return (
      <div className="min-h-screen bg-darkbg flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
            Mất kết nối
          </h2>
          <p className="text-text-secondary text-sm mb-6">
            Không tải được khóa học. Vui lòng kiểm tra mạng và thử lại.
          </p>
          <button
            onClick={loadCourse}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium text-sm"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  // Derive the nested detail object once. The backend returns it
  // under either `details` (current Prisma relation name) or
  // `detail` (legacy alias) — read whichever is present so the
  // Source code / Teaching notes / Video sections all populate
  // even when the API shape flips between deploys.
  const lessonDetail = currentLesson ? getLessonDetail(currentLesson) : undefined;

  const overallProgress = course.totalLessons > 0
    ? Math.round((progress.filter(p => p.isCompleted).length / course.totalLessons) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-darkbg flex flex-col pt-16">
      {/* Top bar */}
      <header className="h-14 bg-darkcard border-b border-darkborder/50 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-darkbg rounded-lg transition-colors text-text-muted hover:text-text-primary"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href={`/courses/${slug}`} className="text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-text-primary line-clamp-1">{pickLang(course.title, locale)}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-24 h-1.5 bg-darkbg rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-neon-indigo to-neon-violet transition-all" style={{ width: `${overallProgress}%` }} />
              </div>
              <span className="text-xs text-text-muted">{overallProgress}% completed</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Realtime EN/VN toggle — shares the global app locale. */}
          <div className="flex items-center rounded-full border border-darkborder/60 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLocale('en')}
              className={`px-2 py-0.5 rounded-full transition-colors ${locale === 'en' ? 'bg-neon-violet text-white' : 'text-text-muted hover:text-text-primary'}`}
              aria-pressed={locale === 'en'}
            >EN</button>
            <button
              onClick={() => setLocale('vi')}
              className={`px-2 py-0.5 rounded-full transition-colors ${locale === 'vi' ? 'bg-neon-violet text-white' : 'text-text-muted hover:text-text-primary'}`}
              aria-pressed={locale === 'vi'}
            >VN</button>
          </div>
          <Link href="/my-courses" className="text-sm text-neon-violet hover:text-neon-indigo transition-colors">
            My Courses
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-darkcard border-r border-darkborder/50 overflow-y-auto transition-all shrink-0 flex-shrink-0`}>
          <div className="p-4">
            <h2 className="font-semibold text-text-primary text-sm mb-4">Course Content</h2>
            <div className="space-y-1">
              {/* Fixed COURSE-LEVEL documents — top of Course Content, above chapters. */}
              {(courseDocs.length > 0 || (course as { documentsNote?: string }).documentsNote) && (
                <div className="border border-neon-violet/30 rounded-xl overflow-hidden bg-neon-violet/[0.04]">
                  <button
                    onClick={() => setDocsOpen(o => !o)}
                    className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base">📁</span>
                      <p className="text-sm font-medium text-text-primary truncate">Tài liệu{courseDocs.length > 0 ? ` (${courseDocs.length})` : ''}</p>
                    </div>
                    {docsOpen
                      ? <ChevronUp className="w-4 h-4 text-text-muted shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
                    }
                  </button>
                  {docsOpen && (
                    <div className="divide-y divide-darkborder/10">
                      {(course as { documentsNote?: string }).documentsNote && (
                        <p className="p-3 pl-4 text-xs text-text-secondary whitespace-pre-wrap leading-relaxed">
                          {(course as { documentsNote?: string }).documentsNote}
                        </p>
                      )}
                      {courseDocs.map(doc => (
                        <a
                          key={doc.id}
                          href={coursesApi.downloadDocumentUrl(doc.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 p-3 pl-4 text-left hover:bg-darkbg/50 transition-colors"
                        >
                          <span className="shrink-0">{doc.fileType === 'link' ? '🔗' : '📄'}</span>
                          <span className="text-sm text-text-secondary truncate flex-1">{doc.title}</span>
                          <Download className="w-3.5 h-3.5 text-text-muted shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {course.sections?.map(section => (
                <div key={section.id} className="border border-darkborder/20 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-3 bg-darkbg/50 hover:bg-darkbg transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-sm font-medium text-text-primary line-clamp-2">{pickLang(section.title, locale)}</p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {section.lessonCount} lessons{sectionDuration(section) > 0 ? ` • ${formatDuration(sectionDuration(section))}` : ''} • {section.lessons?.filter(l => isCompleted(l.id)).length || 0}/{section.lessonCount} completed
                      </p>
                    </div>
                    {expandedSections.has(section.id)
                      ? <ChevronUp className="w-4 h-4 text-text-muted shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
                    }
                  </button>
                  {expandedSections.has(section.id) && (
                    <div className="divide-y divide-darkborder/10">
                      {section.lessons?.map(lesson => (
                        <button
                          key={lesson.id}
                          onClick={() => selectLesson(lesson)}
                          className={`w-full flex items-start gap-2.5 p-3 pl-4 text-left transition-colors ${
                            currentLesson?.id === lesson.id
                              ? 'bg-neon-violet/10 border-l-2 border-neon-violet'
                              : 'hover:bg-darkbg/50'
                          }`}
                        >
                          <span className={`mt-0.5 shrink-0 ${
                            isCompleted(lesson.id) ? 'text-green-400' :
                            currentLesson?.id === lesson.id ? 'text-neon-violet' : 'text-text-muted'
                          }`}>
                            {isCompleted(lesson.id)
                              ? <CheckCircle className="w-4 h-4" />
                              : <Circle className="w-4 h-4" />
                            }
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium line-clamp-2 ${
                              currentLesson?.id === lesson.id ? 'text-neon-violet' : 'text-text-secondary'
                            }`}>
                              {pickLang(lesson.title, locale)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {lesson.isFreePreview && (
                                <span className="text-xs text-green-400 font-medium">Preview</span>
                              )}
                              <span className="text-xs text-text-muted">
                                {lesson.lessonType === 'QUIZ' ? '📝 Trắc nghiệm'
                                  : lesson.lessonType === 'EXERCISE' ? '📄 Bài tập'
                                  : lesson.lessonType === 'SOLUTION' ? '✅ Đáp án'
                                  : formatDuration(lessonDuration(lesson))}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto px-4 py-8">
              {/* Course-completion banner — appears once every lesson is
                  done. Links to the issued certificate and lets the
                  student redeem a one-time 10%-off code for their next
                  course. */}
              {certificate && (
                <div className="mb-6 rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-neon-violet/10 p-5">
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="w-12 h-12 rounded-xl bg-green-500/15 text-green-400 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-heading font-bold text-text-primary">🎉 Chúc mừng! Bạn đã hoàn thành khóa học</h3>
                      <p className="text-sm text-text-secondary mt-0.5">
                        Chứng chỉ đã được cấp. Xem/in chứng chỉ và đổi mã giảm 10% cho khóa học tiếp theo.
                      </p>
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <Link
                          href={`/certificates/${certificate.certificateNumber}`}
                          target="_blank"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                          <Award className="w-4 h-4" /> Xem chứng chỉ
                        </Link>
                        {redeemCode ? (
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-darkbg border border-green-500/40 text-sm">
                            <Ticket className="w-4 h-4 text-green-400" />
                            <span className="text-text-secondary">Mã giảm 10%:</span>
                            <button
                              onClick={() => { navigator.clipboard.writeText(redeemCode.code); toast.success('Đã copy mã'); }}
                              className="font-mono font-bold text-green-400 hover:underline"
                              title="Bấm để copy"
                            >
                              {redeemCode.code}
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={handleRedeem}
                            disabled={redeeming}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neon-violet/40 text-neon-violet text-sm font-medium hover:bg-neon-violet/10 transition-colors disabled:opacity-60"
                          >
                            {redeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ticket className="w-4 h-4" />}
                            Đổi mã giảm 10%
                          </button>
                        )}
                      </div>
                      {redeemCode?.expiresAt && (
                        <p className="text-xs text-text-muted mt-2">
                          Hạn dùng đến {new Date(redeemCode.expiresAt).toLocaleDateString('vi-VN')} · dùng 1 lần cho khóa tiếp theo.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* QUIZ lesson — timer + MCQ, auto-graded, replayable. */}
              {currentLesson.lessonType === 'QUIZ' && (currentLesson as { quizData?: QuizData }).quizData && (
                <div className="mb-6">
                  <LessonQuizPlayer
                    key={currentLesson.id}
                    quiz={(currentLesson as { quizData?: QuizData }).quizData as QuizData}
                    locale={locale}
                    onSubmitted={() => { if (!isCompleted(currentLesson.id)) markComplete(); }}
                  />
                </div>
              )}

              {/* EXERCISE / SOLUTION lesson — inline PDF (first PDF attachment). */}
              {(currentLesson.lessonType === 'EXERCISE' || currentLesson.lessonType === 'SOLUTION') && (() => {
                const pdf = (currentLesson.documents || []).find(
                  (d) => (d.fileType || '').toLowerCase().includes('pdf')
                    || /\.pdf(\?|$)/i.test(d.fileUrl || '')
                    || /\.pdf(\?|$)/i.test(d.title || ''),
                );
                if (!pdf) return (
                  <div className="mb-6 rounded-2xl border border-darkborder bg-darkcard p-6 text-sm text-text-muted">
                    Chưa có file PDF cho bài này.
                  </div>
                );
                return (
                  <div className="mb-6">
                    <LessonPdfViewer key={pdf.id} url={coursesApi.downloadDocumentUrl(pdf.id)} title={pdf.title} />
                  </div>
                );
              })()}

              {/* Video — supports YouTube embed + direct file (mp4/webm)
                  based on videoPlatform. Falls back to a clickable
                  thumbnail if we don't have a playble URL at all. */}
              {(lessonDetail?.videoUrl || currentLesson.videoUrl) && (
                <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6">
                  {(() => {
                    const platform = lessonDetail?.videoPlatform || currentLesson.videoPlatform || 'EMBED';
                    const url = lessonDetail?.videoUrl || currentLesson.videoUrl || '';
                    if (platform === 'DIRECT' || /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.startsWith('blob:')) {
                      return (
                        <CourseVideoPlayer
                          key={videoKey}
                          src={url}
                          startAt={resumeAt}
                          onProgressTick={savePosition}
                          onDuration={(secs) => { if (lessonDuration(currentLesson) === 0) reportDuration(currentLesson.id, secs); }}
                          onEnded={() => {
                            // Native video fires a real 'ended' — this is
                            // genuine completion (unlike the old YouTube
                            // 1.5s-after-load hack we removed).
                            if (!isCompleted(currentLesson.id)) markComplete();
                            // Professional touch: auto-advance to the next
                            // lesson so a binge session flows hands-free.
                            if (nextLesson) {
                              toast.info('Chuyển sang bài tiếp theo…');
                              window.setTimeout(() => selectLesson(nextLesson), 1500);
                            }
                          }}
                        />
                      );
                    }
                    // YouTube — use the IFrame API player so we can read the
                    // real duration (fills in "0 min") AND detect genuine
                    // completion via the ENDED state (no more load-hack).
                    const { isYT, videoId } = isYouTubeUrl(url);
                    if (isYT && videoId) {
                      return (
                        <LessonYouTubePlayer
                          key={videoKey}
                          videoId={videoId}
                          title={currentLesson.title}
                          onDuration={(secs) => { if (lessonDuration(currentLesson) === 0) reportDuration(currentLesson.id, secs); }}
                          onEnded={() => {
                            if (!isCompleted(currentLesson.id)) markComplete();
                            if (nextLesson) {
                              toast.info('Chuyển sang bài tiếp theo…');
                              window.setTimeout(() => selectLesson(nextLesson), 1500);
                            }
                          }}
                        />
                      );
                    }
                    // Non-YouTube embed fallback — plain iframe (no duration
                    // / ended signals available; manual "Mark as Complete").
                    const embedUrl = toEmbedUrl(url);
                    return (
                      <iframe
                        key={videoKey}
                        src={embedUrl}
                        title={currentLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    );
                  })()}
                </div>
              )}

              {/* Lesson info */}
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
                    {pickLang(currentLesson.title, locale)}
                  </h2>
                  {currentLesson.description && (
                    <p className="text-text-secondary leading-relaxed">{pickLang(currentLesson.description, locale)}</p>
                  )}
                </div>
                <button
                  onClick={markComplete}
                  disabled={savingProgress || isCompleted(currentLesson.id)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isCompleted(currentLesson.id)
                      ? 'bg-green-500/10 text-green-400 cursor-default'
                      : 'bg-neon-indigo/10 text-neon-indigo hover:bg-neon-indigo/20'
                  }`}
                >
                  {savingProgress ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isCompleted(currentLesson.id) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                  {isCompleted(currentLesson.id) ? 'Completed' : 'Mark as Complete'}
                </button>
              </div>

              {/* Text content */}
              {currentLesson.content && (
                <div className="bg-darkcard border border-darkborder/50 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-neon-violet" />
                    <h3 className="font-semibold text-text-primary">Lesson Content</h3>
                  </div>
                  <div data-ml={locale} className="rich-content text-text-secondary leading-relaxed prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(stripInlineColors(currentLesson.content || "")) }} />
                </div>
              )}

              {/* Teaching notes — instructor's notes attached
                  to the lesson (LessonDetail.teachingNotes). Renders as
                  sanitized HTML. */}
              {lessonDetail?.teachingNotes && (
                <div className="bg-darkcard border border-darkborder/50 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-neon-violet" />
                    <h3 className="font-semibold text-text-primary">Ghi chú giảng dạy</h3>
                  </div>
                  <div
                    data-ml={locale}
                    className="rich-content text-text-secondary leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(stripInlineColors(lessonDetail.teachingNotes || "")) }}
                  />
                </div>
              )}

              {/* GitHub source code link — single button, large and
                  obvious. New tab so we don't kick the student out of
                  the player. */}
              {lessonDetail?.sourceCodeUrl && (
                <div className="bg-darkcard border border-darkborder/50 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Code2 className="w-5 h-5 text-neon-violet" />
                    <h3 className="font-semibold text-text-primary">Source code</h3>
                  </div>
                  <a
                    href={lessonDetail.sourceCodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neon-indigo/10 text-neon-indigo border border-neon-indigo/30 hover:bg-neon-indigo/20 transition-colors text-sm font-medium"
                  >
                    <Github className="w-4 h-4" />
                    Xem source trên GitHub
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <p className="text-xs text-text-muted mt-2 break-all">
                    {lessonDetail.sourceCodeUrl}
                  </p>
                </div>
              )}

              {/* Documents — tài liệu đính kèm do admin upload.
                  Liên kết đi qua endpoint download của backend
                  (/api/v1/courses/documents/:id/download) để
                  tăng downloadCount và bảo vệ URL thật của file. */}
              {currentLesson.documents && currentLesson.documents.length > 0 && (
                <div className="bg-darkcard border border-darkborder/50 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Download className="w-5 h-5 text-neon-violet" />
                    <h3 className="font-semibold text-text-primary">Tài liệu đính kèm</h3>
                  </div>
                  <div className="space-y-2">
                    {currentLesson.documents.map(doc => {
                      // Use the proxied download URL so we get
                      // downloadCount tracking + auth. The
                      // backend will 302-redirect to the real
                      // file path under /uploads/.
                      const downloadHref = coursesApi.downloadDocumentUrl(doc.id);
                      const ext = (doc.fileType || doc.title.split('.').pop() || '').toLowerCase();
                      const emoji =
                        ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) ? '📦' :
                        ['pdf'].includes(ext) ? '📕' :
                        ['doc', 'docx'].includes(ext) ? '📘' :
                        ['xls', 'xlsx', 'csv'].includes(ext) ? '📗' :
                        ['ppt', 'pptx'].includes(ext) ? '📙' :
                        ['txt', 'md'].includes(ext) ? '📄' :
                        ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext) ? '🖼️' :
                        '📄';
                      return (
                        <a
                          key={doc.id}
                          href={downloadHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-darkbg rounded-xl hover:bg-darkbg/80 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-neon-indigo/10 flex items-center justify-center shrink-0 text-lg">
                            {emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary group-hover:text-neon-violet transition-colors truncate">
                              {doc.title}
                            </p>
                            <p className="text-xs text-text-muted">
                              {formatBytes(doc.fileSizeBytes)} • {doc.downloadCount} lượt tải
                            </p>
                          </div>
                          <Download className="w-4 h-4 text-text-muted group-hover:text-neon-indigo transition-colors shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-darkborder/30">
                {prevLesson ? (
                  <button
                    onClick={() => selectLesson(prevLesson)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-darkcard border border-darkborder/50 rounded-xl text-text-primary hover:border-neon-violet/30 transition-colors text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous Lesson
                  </button>
                ) : <div />}
                {nextLesson && (
                  <button
                    onClick={() => selectLesson(nextLesson)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium rounded-xl hover:opacity-90 transition-opacity text-sm"
                  >
                    Next Lesson
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Play className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-muted">Select a lesson to get started</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── YouTube player (IFrame API) ───────────────────────────────────────────
// Renders a lesson's YouTube video via the IFrame API instead of a bare
// <iframe> so we can (1) read the real duration on ready → fill in the
// "0 min" labels, and (2) fire onEnded on genuine completion. The player
// target is created imperatively inside a React-owned wrapper so YT's
// DOM replacement never collides with React reconciliation.
function LessonYouTubePlayer({
  videoId,
  title,
  onDuration,
  onEnded,
}: {
  videoId: string;
  title: string;
  onDuration?: (seconds: number) => void;
  onEnded?: () => void;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<{ destroy?: () => void } | null>(null);
  const onDurationRef = useRef(onDuration);
  const onEndedRef = useRef(onEnded);
  onDurationRef.current = onDuration;
  onEndedRef.current = onEnded;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    let cancelled = false;

    const target = document.createElement('div');
    const elId = `yt-lesson-${videoId}-${Math.floor(Math.random() * 1e9)}`;
    target.id = elId;
    target.className = 'w-full h-full';
    wrapper.appendChild(target);

    loadYouTubeAPI().then(() => {
      if (cancelled || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player(elId, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: (e: unknown) => {
            const d = (e as { target?: { getDuration?: () => number } })?.target?.getDuration?.();
            if (d && d > 0) onDurationRef.current?.(d);
          },
          onStateChange: (e: unknown) => {
            if ((e as { data?: number })?.data === window.YT.PlayerState.ENDED) onEndedRef.current?.();
          },
        },
      }) as unknown as { destroy?: () => void };
    });

    return () => {
      cancelled = true;
      try { playerRef.current?.destroy?.(); } catch { /* ignore */ }
      try { wrapper.innerHTML = ''; } catch { /* ignore */ }
    };
  }, [videoId]);

  return <div ref={wrapperRef} title={title} className="w-full h-full" />;
}

// ─── Custom video player for direct course videos ──────────────────────────
// Replaces the native <video controls> with the same dark translucent control
// bar used across the app: layered input-range scrubber, auto-hide overlay,
// fullscreen on container, keyboard shortcuts (Space/k, ←/→ ±5s).
// The key={videoKey} prop on the call site causes React to remount this
// component on lesson change, resetting all internal state automatically.

function CourseVideoPlayer({
  src,
  onEnded,
  startAt = 0,
  onProgressTick,
  onDuration,
}: {
  src: string;
  onEnded?: () => void;
  startAt?: number;
  onProgressTick?: (seconds: number, force?: boolean) => void;
  onDuration?: (seconds: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const didSeekRef = useRef(false);
  const onProgressRef = useRef(onProgressTick);
  onProgressRef.current = onProgressTick;

  // On unmount (lesson change / navigate away) flush the final position
  // so resume is accurate even if the 12s throttle hadn't fired yet.
  useEffect(() => {
    return () => {
      const v = videoRef.current;
      if (v && v.currentTime > 1) onProgressRef.current?.(v.currentTime, true);
    };
  }, []);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const resetHideTimer = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false);
    }, 2000);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); } else { v.pause(); }
    resetHideTimer();
  };

  const handlePause = () => {
    setPlaying(false);
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    // Flush position on pause so resume is precise even for a short watch.
    onProgressTick?.(videoRef.current?.currentTime ?? 0, true);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) { videoRef.current.volume = val; videoRef.current.muted = val === 0; }
    setMuted(val === 0);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) { document.exitFullscreen().catch(() => {}); }
    else { el.requestFullscreen().catch(() => {}); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const v = videoRef.current;
    if (!v) return;
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      v.currentTime = Math.max(0, v.currentTime - 5);
      setCurrentTime(v.currentTime);
      resetHideTimer();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      v.currentTime = Math.min(duration, v.currentTime + 5);
      setCurrentTime(v.currentTime);
      resetHideTimer();
    }
  };

  const fmt = (t: number) => {
    if (!t || isNaN(t)) return '0:00';
    return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative h-full w-full bg-black outline-none"
      onMouseMove={resetHideTimer}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => { if (playing) setShowControls(false); }}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        className="h-full w-full cursor-pointer object-contain"
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={handlePause}
        onTimeUpdate={() => {
          const t = videoRef.current?.currentTime ?? 0;
          setCurrentTime(t);
          onProgressTick?.(t);
        }}
        onLoadedMetadata={() => {
          const d = videoRef.current?.duration ?? 0;
          setDuration(d);
          if (d > 0) onDuration?.(d);
          // Resume from the last saved position (only once, and never
          // so close to the end that it feels like nothing happened).
          if (!didSeekRef.current && startAt > 2 && startAt < d - 5 && videoRef.current) {
            videoRef.current.currentTime = startAt;
            setCurrentTime(startAt);
          }
          didSeekRef.current = true;
        }}
        onVolumeChange={() => {
          const v = videoRef.current;
          if (!v) return;
          setVolume(v.muted ? 0 : v.volume);
          setMuted(v.muted);
        }}
        onEnded={onEnded}
      />

      {/* Big play indicator when paused */}
      {!playing && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-black/40 p-5 backdrop-blur-sm">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
            }}
          >
            {/* Scrubber */}
            <div className="group/cscrub relative mb-3 w-full cursor-pointer py-2">
              <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/25">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-violet-500"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 scale-0 rounded-full bg-white shadow-md transition-transform duration-150 group-hover/cscrub:scale-100"
                  style={{ left: `calc(${progress}% - 7px)` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (videoRef.current) videoRef.current.currentTime = val;
                  setCurrentTime(val);
                  resetHideTimer();
                }}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Seek"
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-3 text-white">
              {/* Play/Pause */}
              <button onClick={togglePlay} className="shrink-0 transition-opacity hover:opacity-75" aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>

              {/* Time */}
              <span className="text-[13px] tabular-nums opacity-80">
                {fmt(currentTime)} / {fmt(duration)}
              </span>

              <div className="flex-1" />

              {/* Volume */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !videoRef.current.muted;
                      setMuted(videoRef.current.muted);
                    }
                  }}
                  className="transition-opacity hover:opacity-75"
                  aria-label={muted || volume === 0 ? 'Unmute' : 'Mute'}
                >
                  {muted || volume === 0 ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 cursor-pointer accent-violet-500"
                  aria-label="Volume"
                />
              </div>

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="ml-1 transition-opacity hover:opacity-75" aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                {isFullscreen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                    <path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                    <path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
