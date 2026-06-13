'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, CheckCircle, Circle, Lock, Menu, X,
  Download, BookOpen, Loader2, Play, ChevronDown, ChevronUp, ArrowLeft,
  Code2, ExternalLink, FileText, Github
} from 'lucide-react';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { sanitizeHtml } from '@/lib/utils';
import type { Course, LessonDto, LessonProgress } from '@/types';

function formatDuration(seconds: number): string {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
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

export default function LearnPage({ params }: { params: { slug: string } }) {
  // Next 14: params is a plain object, not a Promise (Next 15+ made it
  // async). The previous code used React.use(params) which throws at
  // runtime under Next 14 — this caused the "Application error: a
  // client-side exception has occurred" the moment the user opened
  // /courses/:slug/learn. Reading .slug off the prop directly is the
  // version-agnostic fix.
  const router = useRouter();
  const slug = params.slug;
  // isHydrated becomes true once Zustand has rehydrated from
  // localStorage — that is the only reliable "auth state is ready"
  // signal we have. The previous code used `isBackendLoading` (the
  // store's loading flag) which is NEVER set false on plain
  // mount, only on login/register/logout — so on a hard refresh
  // of /courses/:slug/learn the effect sat in the loading branch
  // forever and never called loadCourse, hence the empty console
  // + permanent spinner.
  const authState = useAuthStore();
  const isBackendAuth = authState.isAuthenticated;
  const isHydrated = authState.isHydrated;
  // eslint-disable-next-line no-console
  console.log('[learn] render', { isHydrated, isBackendAuth, hasUser: !!authState.user, hasToken: !!authState.token });
  const { status, data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Auth is "ready" when: (a) the component has mounted client-
  // side, (b) Zustand has rehydrated, and (c) NextAuth has settled
  // into authenticated/unauthenticated (not 'loading').
  const isSessionReady = status !== 'loading';
  const isAuthReady = mounted && isHydrated && isSessionReady;
  // "User is signed in" — accept either Zustand's flag (set during
  // /api/auth/login) OR NextAuth's status (set via Google/GitHub
  // OAuth). If neither source has a user, we bounce to /login.
  const hasBackendUser = !!authState.user || !!authState.token;
  const hasNextAuthUser = status === 'authenticated' && !!session?.user;
  const isAuthenticated = isAuthReady && (isBackendAuth || hasBackendUser || hasNextAuthUser);

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<LessonDto | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProgress, setSavingProgress] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [videoKey, setVideoKey] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);

  // Live effect: once we know the auth state, kick the user to
  // /login (with a callback so they bounce back to this exact page
  // after authenticating) or load the course.
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[learn] effect tick', { isAuthReady, isAuthenticated, slug });
    if (!isAuthReady) return;
    if (!isAuthenticated) {
      const callback = encodeURIComponent(`/courses/${slug}/learn`);
      router.push(`/login?callbackUrl=${callback}`);
      return;
    }
    loadCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthReady, isAuthenticated, slug]);

  // Safety net: if for any reason the auth gate never flips
  // (e.g. Zustand onRehydrateStorage skipped, or the user
  // arrived at this page in a state we don't recognise), give
  // the page a 3 s deadline after which we attempt to load the
  // course anyway. Without this fallback, the user is stuck
  // staring at a spinner with no recourse except a hard refresh.
  useEffect(() => {
    const t = setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('[learn] safety-net timer fired', { isAuthReady, isAuthenticated });
      if (!isAuthReady) {
        setMounted(true);
        // Force a re-evaluation by pretending we are ready
        // and not authenticated. The main effect will then
        // route us to /login if the token is really missing.
        router.push(`/courses/${slug}/learn`);
      }
    }, 3000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [loadError, setLoadError] = useState<string | null>(null);

  const loadCourse = useCallback(async () => {
    // eslint-disable-next-line no-console
    console.log('[learn] loadCourse start', { slug, isAuthReady, isAuthenticated });
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
      setCourse(data);

      // Expand all sections by default
      const sectionIds = new Set(data.sections?.map(s => s.id) || []);
      setExpandedSections(sectionIds);

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

  const getFlatLessons = (): FlatLesson[] => {
    if (!course?.sections) return [];
    return course.sections.flatMap(section =>
      (section.lessons || []).map(lesson => ({
        sectionId: section.id,
        sectionTitle: section.title,
        sectionLocked: section.isLocked || false,
        lesson,
      }))
    );
  };

  const flatLessons = getFlatLessons();
  const currentIndex = currentLesson ? flatLessons.findIndex(f => f.lesson.id === currentLesson.id) : -1;
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1]?.lesson : null;
  const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1]?.lesson : null;

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

  const overallProgress = course.totalLessons > 0
    ? Math.round((progress.filter(p => p.isCompleted).length / course.totalLessons) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-darkbg flex flex-col">
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
            <h1 className="text-sm font-semibold text-text-primary line-clamp-1">{course.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-24 h-1.5 bg-darkbg rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-neon-indigo to-neon-violet transition-all" style={{ width: `${overallProgress}%` }} />
              </div>
              <span className="text-xs text-text-muted">{overallProgress}% completed</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
              {course.sections?.map(section => (
                <div key={section.id} className="border border-darkborder/20 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-3 bg-darkbg/50 hover:bg-darkbg transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-sm font-medium text-text-primary line-clamp-2">{section.title}</p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {section.lessonCount} lessons • {section.lessons?.filter(l => isCompleted(l.id)).length || 0}/{section.lessonCount} completed
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
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {lesson.isFreePreview && (
                                <span className="text-xs text-green-400 font-medium">Preview</span>
                              )}
                              <span className="text-xs text-text-muted">
                                {formatDuration(lesson.videoDurationSeconds)}
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
              {/* Video — supports YouTube embed + direct file (mp4/webm)
                  based on videoPlatform. Falls back to a clickable
                  thumbnail if we don't have a playble URL at all. */}
              {(currentLesson.detail?.videoUrl || currentLesson.videoUrl) && (
                <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6">
                  {(() => {
                    const platform = currentLesson.detail?.videoPlatform || currentLesson.videoPlatform || 'EMBED';
                    const url = currentLesson.detail?.videoUrl || currentLesson.videoUrl || '';
                    if (platform === 'DIRECT' || /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.startsWith('blob:')) {
                      return (
                        <video
                          key={videoKey}
                          src={url}
                          controls
                          autoPlay
                          className="w-full h-full"
                          onEnded={() => {
                            if (!isCompleted(currentLesson.id)) markComplete();
                          }}
                        />
                      );
                    }
                    // YouTube / embed (default) — use embed URL so the
                    // student can watch inside the web app, not be sent
                    // off to youtube.com.
                    const embedUrl = toEmbedUrl(url);
                    return (
                      <iframe
                        key={videoKey}
                        src={embedUrl}
                        title={currentLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                        onLoad={() => {
                          // YouTube iframes don't fire 'ended', so we
                          // mark complete optimistically after a small
                          // delay; the user can always toggle manually.
                          // Guarded so a slow network reload doesn't
                          // re-fire the auto-mark and double-count.
                          if (!isCompleted(currentLesson.id) && !videoCompleted) {
                            setVideoCompleted(true);
                            window.setTimeout(() => markComplete(), 1500);
                          }
                        }}
                      />
                    );
                  })()}
                </div>
              )}

              {/* Lesson info */}
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
                    {currentLesson.title}
                  </h2>
                  {currentLesson.description && (
                    <p className="text-text-secondary leading-relaxed">{currentLesson.description}</p>
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
                  <div className="text-text-secondary leading-relaxed prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentLesson.content) }} />
                </div>
              )}

              {/* Teaching notes — instructor's markdown notes attached
                  to the lesson (LessonDetail.teachingNotes). Renders as
                  sanitized HTML. */}
              {currentLesson.detail?.teachingNotes && (
                <div className="bg-darkcard border border-darkborder/50 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-neon-violet" />
                    <h3 className="font-semibold text-text-primary">Ghi chú giảng dạy</h3>
                  </div>
                  <div
                    className="text-text-secondary leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentLesson.detail.teachingNotes) }}
                  />
                </div>
              )}

              {/* GitHub source code link — single button, large and
                  obvious. New tab so we don't kick the student out of
                  the player. */}
              {currentLesson.detail?.sourceCodeUrl && (
                <div className="bg-darkcard border border-darkborder/50 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Code2 className="w-5 h-5 text-neon-violet" />
                    <h3 className="font-semibold text-text-primary">Source code</h3>
                  </div>
                  <a
                    href={currentLesson.detail.sourceCodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neon-indigo/10 text-neon-indigo border border-neon-indigo/30 hover:bg-neon-indigo/20 transition-colors text-sm font-medium"
                  >
                    <Github className="w-4 h-4" />
                    Xem source trên GitHub
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <p className="text-xs text-text-muted mt-2 break-all">
                    {currentLesson.detail.sourceCodeUrl}
                  </p>
                </div>
              )}

              {/* Documents */}
              {currentLesson.documents && currentLesson.documents.length > 0 && (
                <div className="bg-darkcard border border-darkborder/50 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Download className="w-5 h-5 text-neon-violet" />
                    <h3 className="font-semibold text-text-primary">Downloadable Materials</h3>
                  </div>
                  <div className="space-y-2">
                    {currentLesson.documents.map(doc => (
                      <a
                        key={doc.id}
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-darkbg rounded-xl hover:bg-darkbg/80 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-neon-indigo/10 flex items-center justify-center shrink-0">
                          <Download className="w-5 h-5 text-neon-indigo" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary group-hover:text-neon-violet transition-colors truncate">
                            {doc.title}
                          </p>
                          <p className="text-xs text-text-muted">
                            {doc.fileType?.toUpperCase()} • {doc.downloadCount} downloads
                          </p>
                        </div>
                      </a>
                    ))}
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
