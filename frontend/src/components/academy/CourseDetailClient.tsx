'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LocaleContext';
import { pickLang } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import {
  Clock, Users, BookOpen, Star, Play, Shield, Award,
  ArrowLeft, CheckCircle, PlayCircle, Loader2, CreditCard,
  KeyRound, Lock, ChevronRight,
} from 'lucide-react';
import { coursesApi, paymentApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { Course, CourseReview } from '@/types';
import { toast } from 'sonner';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import Curriculum from '@/components/academy/Curriculum';
import Reviews from '@/components/academy/Reviews';
import CourseCard from '@/components/academy/CourseCard';
import PaymentQrModal, { type QrPaymentStatus } from '@/components/payment/PaymentQrModal';

interface CourseDetailClientProps {
  slug: string;
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// Safe string split helper - prevents crash when value is null/undefined
function safeSplitLines(value: string | null | undefined): string[] {
  if (!value || typeof value !== 'string') return [];
  return value.split('\n').filter(Boolean);
}

function toEmbedUrl(raw?: string): string {
  if (!raw) return '';
  if (raw.includes('youtube.com/embed/')) return raw;
  const watchMatch = raw.match(/[?&]v=([^&]+)/);
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = raw.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  if (/^[a-zA-Z0-9_-]{6,}$/.test(raw)) return `https://www.youtube.com/embed/${raw}`;
  return raw;
}

function isDirectVideoUrl(url?: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.startsWith('blob:');
}

export default function CourseDetailClient({ slug }: CourseDetailClientProps) {
  const { locale } = useTranslation();
  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');
  // Tracks whether the current user has an enrollment row for this course.
  // We derive it from the API response initially, then keep it in sync
  // after enroll/activate actions so the CTA re-renders without a page reload.
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    async function loadData() {
      try {
        setLoading(true);
        setNotFound(false);

        // Timeout safety: if API doesn't respond in 15s, show error
        timeoutId = setTimeout(() => {
          if (!cancelled) {
            console.error('[CourseDetail] API timeout');
            setNotFound(true);
            setLoading(false);
          }
        }, 15000);

        const [courseRes, allRes] = await Promise.all([
          coursesApi.getBySlug(slug),
          coursesApi.getAll({ size: 20 }),
        ]);

        if (cancelled) return;

        const fetchedCourse: Course | undefined = courseRes.data?.data;
        if (!fetchedCourse) {
          setNotFound(true);
          return;
        }

        setCourse(fetchedCourse);
        setIsEnrolled(Boolean(fetchedCourse.isEnrolled));

        const allCourses: Course[] = Array.isArray(allRes.data?.data) ? allRes.data.data : [];
        setRelatedCourses(
          allCourses
            .filter((c: Course) => c.slug !== slug && c.categoryId === fetchedCourse.categoryId)
            .slice(0, 4)
        );

        try {
          const revRes = await coursesApi.getReviews(fetchedCourse.id);
          if (!cancelled) setReviews(revRes.data?.data || []);
        } catch (revErr: any) {
          // Backend does not expose GET /api/v1/courses/:id/reviews
          // (returns 404). That's non-critical — render the page
          // with an empty reviews list rather than bubble the
          // error and re-run the slug effect.
          // eslint-disable-next-line no-console
          console.warn('[CourseDetail] getReviews skipped', revErr?.response?.status);
          if (!cancelled) setReviews([]);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[CourseDetail] Fetch error:', err);
          setNotFound(true);
        }
      } finally {
        clearTimeout(timeoutId);
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-darkbg pt-20 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-neon-violet mb-4" />
        <p className="text-text-muted">Đang tải khóa học...</p>
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div className="min-h-screen bg-darkbg pt-20 flex flex-col items-center justify-center">
        <p className="text-text-muted mb-4">Không tìm thấy khóa học</p>
        <Link href="/academy" className="text-neon-violet hover:text-neon-indigo transition-colors">
          Quay lại Academy
        </Link>
      </div>
    );
  }

  const isFreeCourse = course.accessType === 'FREE' || (course.isFree && Number(course.price) <= 0);
  // accessType is the authoritative field; fall back to legacy isFree logic
  const accessType = (course as any).accessType || (isFreeCourse ? 'FREE' : 'PAID');
  // Effective CTA: show "Vao hoc" when user has real access.
  // isEnrolled=true means a CourseEnrollment row exists (backend verified).
  // For CODE courses, hasPaidAccess=true only when enrollment.source='CODE'.
  const effectiveHasAccess = course.hasPaidAccess || (accessType === 'FREE' && (course as any).isEnrolled);

  const priceInfo = isFreeCourse
    ? { label: 'Miễn phí', display: 'Miễn phí', original: null }
    : course.discountPrice && course.discountPrice < course.price
    ? {
        label: `${Number(course.discountPrice).toLocaleString('vi-VN')} VND`,
        display: `${Number(course.discountPrice).toLocaleString('vi-VN')} VND`,
        original: `${Number(course.price).toLocaleString('vi-VN')} VND`,
      }
    : {
        label: `${Number(course.price).toLocaleString('vi-VN')} VND`,
        display: `${Number(course.price).toLocaleString('vi-VN')} VND`,
        original: null,
      };

  const levelColor = course.level === 'BEGINNER' ? 'text-green-400 bg-green-500/20' :
    course.level === 'INTERMEDIATE' ? 'text-yellow-400 bg-yellow-500/20' :
    'text-red-400 bg-red-500/20';

  const levelLabel = course.level === 'BEGINNER' ? 'Beginner' :
    course.level === 'INTERMEDIATE' ? 'Intermediate' :
    course.level === 'ADVANCED' ? 'Advanced' : course.level;

  return (
    <div className="min-h-screen bg-darkbg pt-20">
      {/* Top bar */}
      <div className="bg-darkcard border-b border-darkborder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link href="/academy" className="p-2 rounded-xl bg-darkbg hover:bg-white/5 transition-colors">
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </Link>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Link href="/academy" className="hover:text-neon-violet transition-colors">Academy</Link>
              <span>/</span>
              <span className="text-text-primary">{pickLang(course.title, locale)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${levelColor}`}>{levelLabel}</span>
                {accessType === 'FREE' && <span className="px-3 py-1 rounded-lg text-xs font-medium bg-green-500/20 text-green-400">Miễn phí</span>}
                {accessType === 'CODE' && <span className="px-3 py-1 rounded-lg text-xs font-medium bg-neon-violet/20 text-neon-violet">Mã kích hoạt</span>}
                {accessType === 'PAID' && <span className="px-3 py-1 rounded-lg text-xs font-medium bg-neon-indigo/20 text-neon-indigo">Trả phí</span>}
                {course.categoryName && <span className="px-3 py-1 rounded-lg text-xs font-medium bg-neon-indigo/20 text-neon-indigo">{course.categoryName}</span>}
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">{pickLang(course.title, locale)}</h1>
              {course.shortDescription && (
                <p className="text-lg text-text-secondary leading-relaxed">{pickLang(course.shortDescription, locale)}</p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-text-muted">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-text-primary font-medium">{Number(course.avgRating || 0).toFixed(1)}</span>
                  <span>({course.totalReviews || 0} đánh giá)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{(course.totalStudents || 0).toLocaleString()} học viên</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(course.totalDurationSeconds || 0)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.totalLessons || 0} bài học</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center text-white font-bold overflow-hidden">
                  {course.instructorAvatar ? (
                    <img src={course.instructorAvatar} alt={course.instructorName || 'Giảng viên'} className="w-full h-full object-cover" />
                  ) : (
                    (course.instructorName || 'I').charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{course.instructorName || 'CuongHoang'}</p>
                  <p className="text-xs text-text-muted">Giảng viên</p>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-1 bg-darkcard border border-darkborder rounded-2xl p-1.5">
              {([
                { id: 'overview', label: 'Tổng quan' },
                { id: 'curriculum', label: 'Nội dung' },
                { id: 'reviews', label: 'Đánh giá' },
              ] as const).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white'
                      : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {/* Thumbnail / Preview Video */}
                <div className="aspect-video rounded-2xl overflow-hidden bg-darkcard border border-darkborder relative group">
                  {course.previewVideoUrl ? (
                    isDirectVideoUrl(course.previewVideoUrl) ? (
                      <video src={course.previewVideoUrl} className="w-full h-full object-cover" poster={course.thumbnailUrl} controls />
                    ) : (
                      <iframe
                        src={toEmbedUrl(course.previewVideoUrl)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title={course.title}
                      />
                    )
                  ) : course.thumbnailUrl ? (
                    <>
                      <SafeImage
                        src={course.thumbnailUrl}
                        alt={course.title}
                        label={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-text-muted/30" />
                    </div>
                  )}
                </div>

                {course.description && (
                  <div className="bg-darkcard border border-darkborder rounded-2xl p-6">
                    <h3 className="text-lg font-heading font-bold text-text-primary mb-4">Giới thiệu khóa học</h3>
                    <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed whitespace-pre-line">
                      {course.description}
                    </div>
                  </div>
                )}

                {course.whatYouLearn && (
                  <div className="bg-darkcard border border-darkborder rounded-2xl p-6">
                    <h3 className="text-lg font-heading font-bold text-text-primary mb-4">Bạn sẽ học được</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {safeSplitLines(course.whatYouLearn).map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                          <span className="text-sm text-text-secondary">{item.replace(/^[-•*]\s*/, '')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {course.requirements && (
                  <div className="bg-darkcard border border-darkborder rounded-2xl p-6">
                    <h3 className="text-lg font-heading font-bold text-text-primary mb-4">Yêu cầu</h3>
                    <ul className="space-y-2">
                      {safeSplitLines(course.requirements).map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                          <Shield className="w-4 h-4 text-neon-indigo shrink-0 mt-0.5" />
                          {item.replace(/^[-•*]\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'curriculum' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {course.sections && course.sections.length > 0 ? (
                  <Curriculum
                    sections={course.sections}
                    enrolled={!!course.hasPaidAccess}
                    courseSlug={course.slug}
                  />
                ) : (
                  <div className="bg-darkcard border border-darkborder rounded-2xl p-12 text-center">
                    <BookOpen className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
                    <p className="text-text-muted">Nội dung khóa học đang được cập nhật</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Reviews
                  reviews={reviews}
                  avgRating={course.avgRating || 0}
                  totalReviews={course.totalReviews || 0}
                  courseId={course.id}
                  onReviewAdded={(review) => setReviews(prev => [review, ...prev])}
                />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden"
              >
                {course.thumbnailUrl && (
                  <div className="aspect-video relative overflow-hidden">
                    <SafeImage
                      src={course.thumbnailUrl}
                      alt={course.title}
                      label={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6 border-t border-darkborder">
                  {/* Price always shown for paid/code courses */}
                  {!isFreeCourse && (
                    <div className="flex items-end gap-3 mb-4">
                      <span className="text-3xl font-heading font-bold text-text-primary">{priceInfo.display}</span>
                      {priceInfo.original && (
                        <span className="text-lg text-text-muted line-through">{priceInfo.original}</span>
                      )}
                    </div>
                  )}

                  {/* ── Always show 3 access options ──────────────────────────── */}
                  <CourseAccessOptions
                    course={course}
                    isEnrolled={isEnrolled}
                    hasPaidAccess={!!course.hasPaidAccess}
                    onEnrolled={() => {
                      setIsEnrolled(true);
                      setCourse(prev => prev ? { ...prev, isEnrolled: true, hasPaidAccess: true } : prev);
                    }}
                  />
                  {/* Expiry note for payment enrollments with duration limit */}
                  {course.enrollmentExpiresAt && !course.enrollmentSource?.startsWith('CODE') && (
                    <p className="text-xs text-text-muted mt-2 text-center">
                      Truy cập đến{' '}
                      {new Date(course.enrollmentExpiresAt).toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                      })}
                    </p>
                  )}
                </div>

                <div className="p-6 space-y-3 border-t border-darkborder">
                  <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Khóa học bao gồm</h4>
                  {[
                    { icon: Clock, text: `${formatDuration(course.totalDurationSeconds || 0)} video on-demand` },
                    { icon: BookOpen, text: `${course.totalLessons || 0} bài học` },
                    { icon: Award, text: 'Chứng chỉ hoàn thành' },
                    { icon: Play, text: 'Truy cập trên mobile và TV' },
                    { icon: PlayCircle, text: 'Truy cập trọn đời' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                      <item.icon className="w-4 h-4 text-neon-violet shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {relatedCourses.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-6">Khóa học liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCourses.map((c, i) => (
                <CourseCard key={c.id} course={c} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// CourseAccessOptions — 3 access methods: Miễn phí / Trả phí / Mã kích hoạt
//
// PAID course access rules:
//   Payment → creates enrollment with expiresAt from admin config
//   Code    → creates enrollment (source=CODE); UX requires re-entry
//             each browser session via sessionStorage gate
// ════════════════════════════════════════════════════════════════════════
function CourseAccessOptions({
  course,
  isEnrolled,
  hasPaidAccess,
  onEnrolled,
}: {
  course: Course;
  isEnrolled: boolean;
  hasPaidAccess: boolean;
  onEnrolled: () => void;
}) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isAuthed = mounted && !isAuthLoading && (isAuthenticated || sessionStatus === 'authenticated');

  // Session gate for CODE enrollment: user must re-enter the code on each
  // new browser session (sessionStorage is cleared when the tab/browser closes).
  const codeSessionKey = `code_session_${course.id}`;
  const hasCodeSession = mounted && !!sessionStorage.getItem(codeSessionKey);
  const isCodeEnrollment = course.enrollmentSource === 'CODE';
  // PAID enrollment always bypasses the session gate — persistent access after payment.
  const isPaidEnrollment = course.enrollmentSource === 'PAID';

  // Enrollment expiry: backend sets hasPaidAccess=false for expired rows,
  // but also returns enrollmentExpiresAt so we can show a targeted message.
  const enrollmentExpired = !!course.enrollmentExpiresAt && new Date(course.enrollmentExpiresAt) < new Date();

  // ── Free option ───────────────────────────────────────────────────
  const [freeLoading, setFreeLoading] = useState(false);

  const handleFreeAccess = async () => {
    if (!isAuthed) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/courses/${course.slug}`)}`);
      return;
    }
    if (course.accessType !== 'FREE') {
      toast.warning('Khóa học này hiện tại chưa áp dụng hình thức miễn phí');
      return;
    }
    setFreeLoading(true);
    try {
      await coursesApi.enroll(course.id);
      onEnrolled();
      toast.success('Đăng ký miễn phí thành công!');
      router.push(`/courses/${course.slug}/learn`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Không thể đăng ký miễn phí');
    } finally {
      setFreeLoading(false);
    }
  };

  // ── Paid ─────────────────────────────────────────────────────────
  const [paidLoading, setPaidLoading] = useState(false);
  const [qr, setQr] = useState<{ paymentUrl: string; orderCode: string; amount: number } | null>(null);

  // Only called when user has no enrollment yet (CASE 4) or is renewing (CASE 1).
  // Enrolled users navigate directly via onClick; this handler only creates payment orders.
  const handlePaidAccess = async () => {
    if (!isAuthed) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/courses/${course.slug}`)}`);
      return;
    }
    setPaidLoading(true);
    try {
      const res = await paymentApi.createCourseOrder(course.id);
      const { paymentUrl, orderCode, amount } = res.data.data;
      setQr({ paymentUrl, orderCode, amount });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Không thể tạo đơn thanh toán');
    } finally {
      setPaidLoading(false);
    }
  };

  // ── Code option ───────────────────────────────────────────────────
  const [codeLoading, setCodeLoading] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const handleCodeActivate = async () => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 4) {
      setCodeError('Vui lòng nhập mã (tối thiểu 4 ký tự)');
      return;
    }
    if (!isAuthed) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/courses/${course.slug}`)}`);
      return;
    }
    setCodeLoading(true);
    setCodeError('');
    try {
      await coursesApi.activateCode(course.id, cleanCode);
      // Mark this browser session as authorized for this course.
      // sessionStorage is cleared when the tab/browser closes, requiring
      // the user to re-enter the code next session (password-gate behavior).
      sessionStorage.setItem(codeSessionKey, '1');
      onEnrolled();
      toast.success('Kích hoạt thành công!');
      router.push(`/courses/${course.slug}/learn`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Mã không hợp lệ';
      setCodeError(msg);
      toast.error(msg);
    } finally {
      setCodeLoading(false);
    }
  };

  const pollCourseStatus = async (): Promise<QrPaymentStatus> => {
    if (!qr) return 'PENDING';
    const res = await paymentApi.getOrderStatus(qr.orderCode);
    const status = res.data?.data?.status as string | undefined;
    if (status === 'PAID') return 'PAID';
    if (status === 'FAILED' || status === 'CANCELLED') return 'FAILED';
    return 'PENDING';
  };

  const handleCoursePaid = () => {
    setQr(null);
    onEnrolled();
    toast.success('Thanh toán thành công! Chào mừng bạn đến với khóa học.');
    router.push(`/courses/${course.slug}/learn`);
  };

  const finalPrice = course.discountPrice && Number(course.discountPrice) > 0
    ? Number(course.discountPrice)
    : Number(course.price);
  const priceLabel = new Intl.NumberFormat('vi-VN', {
    style: 'currency', currency: 'VND',
  }).format(finalPrice);

  const isPaidCourse = course.accessType === 'PAID';

  // Format expiry date for display
  const expiryDateLabel = course.enrollmentExpiresAt
    ? new Date(course.enrollmentExpiresAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : null;

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      {/* ── Miễn phí ───────────────────────────────────────────── */}
      <button
        onClick={handleFreeAccess}
        disabled={freeLoading || isPaidCourse}
        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all disabled:opacity-50
          ${isPaidCourse
            ? 'bg-darkbg border-darkborder cursor-not-allowed opacity-40'
            : 'bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/30 hover:from-green-500/20 hover:to-green-600/20 hover:border-green-500/50'
          }`}
      >
        <div className="flex items-center gap-3">
          {freeLoading ? (
            <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
          ) : (
            <Award className="w-5 h-5 text-green-400" />
          )}
          <div className="text-left">
            <p className={`text-sm font-semibold ${isPaidCourse ? 'text-text-muted' : 'text-green-400'}`}>Miễn phí</p>
            <p className={`text-xs ${isPaidCourse ? 'text-text-muted/60' : 'text-green-400/60'}`}>
              {isPaidCourse ? 'Không áp dụng' : 'Đăng ký & học ngay'}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-green-400/60" />
      </button>

      {/* ── Trả phí or Mã kích hoạt ─────────────────────────── */}
      {isPaidCourse && (
        <div className="rounded-xl border border-neon-violet/30 bg-gradient-to-r from-neon-indigo/5 to-neon-violet/5 overflow-hidden">

          {/* ── CASE 1: Enrollment expired ── */}
          {enrollmentExpired && (
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <Lock className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-400">Quyền truy cập đã hết hạn</p>
                  <p className="text-xs text-red-400/70">
                    {expiryDateLabel ? `Hết hạn vào ${expiryDateLabel}` : 'Thời hạn truy cập đã kết thúc'}.
                    Vui lòng gia hạn để tiếp tục học.
                  </p>
                </div>
              </div>
              <button
                onClick={handlePaidAccess}
                disabled={paidLoading}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-neon-violet/30 bg-darkbg hover:bg-neon-violet/10 transition-all disabled:opacity-50"
              >
                {paidLoading
                  ? <Loader2 className="w-4 h-4 text-neon-violet animate-spin" />
                  : <CreditCard className="w-4 h-4 text-neon-violet" />}
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">Gia hạn qua VNPay</p>
                  <p className="text-xs text-text-muted">{priceLabel}</p>
                </div>
              </button>
            </div>
          )}

          {/* ── CASE 2a: PAID enrollment — always navigate directly, no code check ── */}
          {!enrollmentExpired && hasPaidAccess && isPaidEnrollment && (
            <button
              onClick={() => router.push(`/courses/${course.slug}/learn`)}
              className="flex items-center justify-between w-full px-4 py-3 transition-all
                bg-gradient-to-r from-neon-indigo/10 to-neon-violet/10 hover:from-neon-indigo/20 hover:to-neon-violet/20"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-neon-violet" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-neon-violet">Vào học ngay</p>
                  <p className="text-xs text-neon-violet/60">
                    {expiryDateLabel ? `Hết hạn ${expiryDateLabel}` : 'Truy cập trọn đời'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neon-violet/60" />
            </button>
          )}

          {/* ── CASE 2b: CODE enrollment with active session — navigate directly ── */}
          {!enrollmentExpired && hasPaidAccess && isCodeEnrollment && hasCodeSession && (
            <button
              onClick={() => router.push(`/courses/${course.slug}/learn`)}
              className="flex items-center justify-between w-full px-4 py-3 transition-all
                bg-gradient-to-r from-neon-indigo/10 to-neon-violet/10 hover:from-neon-indigo/20 hover:to-neon-violet/20"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-neon-violet" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-neon-violet">Tiếp tục học</p>
                  <p className="text-xs text-neon-violet/60">Mã kích hoạt hợp lệ cho phiên này</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neon-violet/60" />
            </button>
          )}

          {/* ── CASE 3: CODE enrollment but no session yet — show code gate ── */}
          {!enrollmentExpired && hasPaidAccess && isCodeEnrollment && !hasCodeSession && (
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-neon-violet/10 border border-neon-violet/30">
                <KeyRound className="w-4 h-4 text-neon-violet mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-neon-violet">Nhập lại mã để tiếp tục</p>
                  <p className="text-xs text-neon-violet/60">Mỗi phiên làm việc cần xác nhận mã kích hoạt</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={e => {
                    setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10));
                    setCodeError('');
                  }}
                  onKeyDown={e => { if (e.key === 'Enter') handleCodeActivate(); }}
                  placeholder="ABC123"
                  maxLength={10}
                  className="flex-1 px-3 py-2 bg-darkcard border border-darkborder rounded-lg text-sm text-text-primary font-mono font-bold tracking-widest placeholder:font-normal placeholder:tracking-normal placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 uppercase text-center"
                />
                <button
                  onClick={handleCodeActivate}
                  disabled={codeLoading}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                >
                  {codeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Xác nhận'}
                </button>
              </div>
              {codeError && <p className="text-xs text-red-400">{codeError}</p>}
            </div>
          )}

          {/* ── CASE 4: No access yet — show full purchase form ── */}
          {!enrollmentExpired && !hasPaidAccess && (
            <>
              <div className="px-4 py-3 border-b border-neon-violet/20">
                <p className="text-sm font-semibold text-neon-violet">Trả phí or Mã kích hoạt</p>
                <p className="text-xs text-neon-violet/60">Chọn 1 trong 2 cách để truy cập khóa học</p>
              </div>

              <div className="px-4 pb-4 space-y-3 pt-3">
                {/* VNPay */}
                <button
                  onClick={handlePaidAccess}
                  disabled={paidLoading}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-neon-violet/30 bg-darkbg hover:bg-neon-violet/10 transition-all disabled:opacity-50"
                >
                  {paidLoading
                    ? <Loader2 className="w-4 h-4 text-neon-violet animate-spin" />
                    : <CreditCard className="w-4 h-4 text-neon-violet" />}
                  <div className="text-left">
                    <p className="text-sm font-medium text-text-primary">Thanh toán VNPay</p>
                    <p className="text-xs text-text-muted">Mua ngay – {priceLabel}</p>
                  </div>
                </button>

                {/* Mã kích hoạt */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-neon-violet shrink-0" />
                    <span className="text-sm font-medium text-text-primary">Mã kích hoạt</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={code}
                      onChange={e => {
                        setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10));
                        setCodeError('');
                      }}
                      onKeyDown={e => { if (e.key === 'Enter') handleCodeActivate(); }}
                      placeholder="ABC123"
                      maxLength={10}
                      className="flex-1 px-3 py-2 bg-darkcard border border-darkborder rounded-lg text-sm text-text-primary font-mono font-bold tracking-widest placeholder:font-normal placeholder:tracking-normal placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 uppercase text-center"
                    />
                    <button
                      onClick={handleCodeActivate}
                      disabled={codeLoading}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                    >
                      {codeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Kích hoạt'}
                    </button>
                  </div>
                  {codeError && <p className="text-xs text-red-400">{codeError}</p>}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── VNPAY-QR payment modal ─────────────────────────── */}
      {qr && (
        <PaymentQrModal
          open={!!qr}
          paymentUrl={qr.paymentUrl}
          amount={qr.amount}
          orderCode={qr.orderCode}
          title={`Thanh toán khóa học`}
          pollStatus={pollCourseStatus}
          onPaid={handleCoursePaid}
          onClose={() => setQr(null)}
        />
      )}
    </div>
  );
}

