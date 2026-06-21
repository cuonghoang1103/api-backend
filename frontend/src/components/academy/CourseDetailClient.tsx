'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import {
  Clock, Users, BookOpen, Star, Play, Shield, Award,
  ArrowLeft, CheckCircle, PlayCircle, Loader2, CreditCard,
  KeyRound, Lock,
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
  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');

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

  const isFreeCourse = course.isFree || course.price === 0;
  // accessType is the authoritative field; fall back to legacy isFree logic
  const accessType = (course as any).accessType || (isFreeCourse ? 'FREE' : 'PAID');

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
              <span className="text-text-primary">{course.title}</span>
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
                {course.isFree && <span className="px-3 py-1 rounded-lg text-xs font-medium bg-green-500/20 text-green-400">Miễn phí</span>}
                {course.categoryName && <span className="px-3 py-1 rounded-lg text-xs font-medium bg-neon-indigo/20 text-neon-indigo">{course.categoryName}</span>}
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">{course.title}</h1>
              {course.shortDescription && (
                <p className="text-lg text-text-secondary leading-relaxed">{course.shortDescription}</p>
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
                  <div className="flex items-end gap-3 mb-4">
                    <span className="text-3xl font-heading font-bold text-text-primary">{priceInfo.display}</span>
                    {priceInfo.original && (
                      <span className="text-lg text-text-muted line-through">{priceInfo.original}</span>
                    )}
                  </div>

                  {course.hasPaidAccess ? (
                    <ContinueLearningButton slug={course.slug} />
                  ) : accessType === 'FREE' ? (
                    <FreeEnrollButton course={course} onEnrolled={() => setCourse(prev => prev ? { ...prev, isEnrolled: true, hasPaidAccess: true } : prev)} />
                  ) : accessType === 'PAID' ? (
                    <BuyNowButton course={course} />
                  ) : (
                    <CodeActivateBox
                      slug={course.slug}
                      courseId={course.id}
                      onActivated={() => setCourse(prev => prev ? { ...prev, isEnrolled: true, hasPaidAccess: true } : prev)}
                    />
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

// ── Free Enroll Button ─────────────────────────────────────────────────────────
function FreeEnrollButton({ course, onEnrolled }: { course: Course; onEnrolled: () => void }) {
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  // Pull the auth state from Zustand + NextAuth so we can bounce
  // unauthenticated users to /login?callbackUrl=… instead of letting
  // the enroll request 401 with a cryptic "Đăng ký thất bại" toast.
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isAuthed = mounted && (isAuthenticated || sessionStatus === 'authenticated');

  const handleEnroll = async () => {
    if (!mounted || isAuthLoading) return;
    if (!isAuthed) {
      const callback = encodeURIComponent(`/academy/courses/${course.slug}/learn`);
      router.push(`/login?callbackUrl=${callback}`);
      return;
    }
    setEnrolling(true);
    try {
      await coursesApi.enroll(course.id);
      setEnrolled(true);
      onEnrolled();
      toast.success('Đăng ký thành công!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setEnrolling(false);
    }
  };

  if (enrolled) {
    return (
      <Link
        href={`/academy/courses/${course.slug}/learn`}
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
      >
        <PlayCircle className="w-5 h-5" />
        Bắt đầu học
      </Link>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={enrolling}
      className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {enrolling ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <Award className="w-5 h-5" />
          Đăng ký miễn phí
        </>
      )}
    </button>
  );
}

// ── Add to Cart Button ─────────────────────────────────────────────────────────
// Buy-now button for paid courses. Calls backend to create a
// CourseOrder + VNPay paymentUrl, then redirects the user to the
// gateway. Backend's IPN callback handles actual enrollment on
// payment success. User comes back to /payment/return for UI.
function BuyNowButton({ course }: { course: Course }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { status: sessionStatus } = useSession();
  const [buying, setBuying] = useState(false);

  const handleBuy = async () => {
    const isAuth = isAuthenticated || sessionStatus === 'authenticated';
    if (!isAuth) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/academy/courses/${course.slug}`)}`);
      return;
    }
    setBuying(true);
    try {
      const res = await paymentApi.createCourseOrder(course.id);
      const { paymentUrl } = res.data.data;
      window.location.href = paymentUrl;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Khong the tao don thanh toan');
      setBuying(false);
    }
  };

  // Pick the right price label (discount or original)
  const finalPrice = course.discountPrice && Number(course.discountPrice) > 0
    ? Number(course.discountPrice)
    : Number(course.price);
  const priceLabel = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(finalPrice);

  return (
    <button
      onClick={handleBuy}
      disabled={buying}
      className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {buying ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Dang tao don thanh toan...
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5" />
          Mua ngay - {priceLabel}
        </>
      )}
    </button>
  );
}

// ── Continue Learning Button ─────────────────────────────────────────────────
// `isEnrolled` can be true on the server response even if the user
// is browsing as a guest (the flag is just "this user object is
// enrolled in this course" — and at the public course page we
// haven't asked the user to identify themselves yet). To avoid
// clicking the green button and landing on a 401 inside /learn,
// we re-check the auth state in the client and bounce the user to
// /login?callbackUrl=… if they aren't signed in.
function ContinueLearningButton({ slug }: { slug: string }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const authKnown = mounted && !isLoading && sessionStatus !== 'loading';
  const isAuthed = authKnown && (isAuthenticated || sessionStatus === 'authenticated');

  const handleClick = (e: React.MouseEvent) => {
    if (!authKnown) {
      e.preventDefault();
      return;
    }
    if (!isAuthed) {
      e.preventDefault();
      const callback = encodeURIComponent(`/courses/${slug}/learn`);
      router.push(`/login?callbackUrl=${callback}`);
    }
  };

  return (
    <Link
      href={`/courses/${slug}/learn`}
      onClick={handleClick}
      className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
    >
      <PlayCircle className="w-5 h-5" />
      Tiếp tục học
    </Link>
  );
}

// ── Code Activate Box ──────────────────────────────────────────────────────────
function CodeActivateBox({ slug, courseId, onActivated }: { slug: string; courseId: number; onActivated: () => void }) {
  const [code, setCode] = useState('');
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isAuthed = mounted && (isAuthenticated || sessionStatus === 'authenticated');

  const handleActivate = async () => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 4) {
      setError('Vui long nhap ma kich hoat (toi thieu 4 ky tu)');
      return;
    }
    if (!isAuthed) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/academy/courses/${slug}`)}`);
      return;
    }
    setActivating(true);
    setError('');
    try {
      await coursesApi.activateCode(courseId, cleanCode);
      setSuccess(true);
      onActivated();
      toast.success('Kich hoat thanh cong! Ban co the bat dau hoc ngay.');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Ma kich hoat khong hop le';
      setError(msg);
      toast.error(msg);
    } finally {
      setActivating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleActivate();
  };

  if (success) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          Kich hoat thanh cong!
        </div>
        <Link
          href={`/academy/courses/${slug}/learn`}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <PlayCircle className="w-5 h-5" />
          Bat dau hoc ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 p-3 bg-neon-violet/5 border border-neon-violet/20 rounded-xl">
        <Lock className="w-4 h-4 text-neon-violet shrink-0 mt-0.5" />
        <p className="text-xs text-text-secondary leading-relaxed">
          Khoa hoc nay yeu cau nhap <strong className="text-neon-violet">ma kich hoat</strong> de dang ky.
        </p>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={e => {
            setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10));
            setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="ABC123"
          maxLength={10}
          className="flex-1 px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary font-mono font-bold tracking-widest placeholder:font-normal placeholder:tracking-normal placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 uppercase text-center text-lg"
        />
        <button
          onClick={handleActivate}
          disabled={activating}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {activating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <KeyRound className="w-5 h-5" />
              Kich hoat
            </>
          )}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
