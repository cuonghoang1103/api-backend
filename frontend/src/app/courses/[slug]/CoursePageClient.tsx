'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star, Users, Clock, BookOpen, Play, Lock, CheckCircle,
  ChevronDown, ChevronUp, ChevronRight, Loader2, Award, Globe, Calendar, Download, ArrowLeft, CreditCard,
  KeyRound,
} from 'lucide-react';
import { coursesApi, paymentApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { sanitizeHtml } from '@/lib/utils';
import { SafeImage } from '@/components/ui/SafeImage';
import type { Course, CourseReview } from '@/types';

function formatDuration(seconds: number): string {
  if (!seconds) return '0 min';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

function formatPrice(price: number, isFree: boolean): string {
  if (isFree) return 'Free';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function OldCourseAccessOptions({
  course,
  isAuthenticated,
  accessCode,
  setAccessCode,
  codeError,
  setCodeError,
  enrolling,
  setEnrolling,
  buying,
  setBuying,
  activatingCode,
  setActivatingCode,
  handleEnroll,
  handleBuyCourse,
  handleActivateCode,
}: {
  course: Course;
  isAuthenticated: boolean;
  accessCode: string;
  setAccessCode: (v: string) => void;
  codeError: string;
  setCodeError: (v: string) => void;
  enrolling: boolean;
  setEnrolling: (v: boolean) => void;
  buying: boolean;
  setBuying: (v: boolean) => void;
  activatingCode: boolean;
  setActivatingCode: (v: boolean) => void;
  handleEnroll: () => Promise<void>;
  handleBuyCourse: () => Promise<void>;
  handleActivateCode: () => Promise<void>;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const codeSessionKey = `code_session_${course.id}`;
  const hasCodeSession = mounted && !!sessionStorage.getItem(codeSessionKey);
  const isPaidEnrollment = course.enrollmentSource === 'PAID';
  const isCodeEnrollment = course.enrollmentSource === 'CODE';

  const finalPrice = course.discountPrice && Number(course.discountPrice) > 0
    ? Number(course.discountPrice)
    : Number(course.price);
  const priceLabel = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalPrice);

  const isPaidType = course.accessType === 'PAID';

  // Direct-access shortcut. Admins/instructor ((course as any).isAdmin) get in
  // with no free/code/paid step at all — this is the requested "admin học
  // trực tiếp". A learner already enrolled in a FREE course also lands here so
  // they resume instead of re-hitting enroll (which 409s "already enrolled")
  // — the FREE course path otherwise has no "continue" button. PAID/CODE keep
  // their existing gated flow below (session re-entry etc.).
  const isAdminViewer = Boolean((course as any).isAdmin);
  const canEnterDirectly =
    isAdminViewer || (course.accessType === 'FREE' && course.isEnrolled);

  if (canEnterDirectly) {
    return (
      <div className="space-y-3">
        <button
          onClick={() => router.push(`/courses/${course.slug}/learn`)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-neon-violet/30 bg-gradient-to-r from-neon-indigo/10 to-neon-violet/10 hover:from-neon-indigo/20 hover:to-neon-violet/20 transition-all"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-neon-violet" />
            <div className="text-left">
              <p className="text-sm font-semibold text-neon-violet">Vào học ngay</p>
              <p className="text-xs text-neon-violet/60">
                {isAdminViewer ? 'Truy cập admin — không cần đăng ký' : 'Bạn đã đăng ký khoá này'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neon-violet/60" />
        </button>
      </div>
    );
  }

  const handleFreeClick = async () => {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/courses/${course.slug}`)}`);
      return;
    }
    if (course.accessType !== 'FREE') {
      toast.warning('Khoa hoc nay hien tai chua ap dung hinh thuc mien phi');
      return;
    }
    try {
      await handleEnroll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Khong the dang ky mien phi');
    }
  };

  return (
    <div className="space-y-3">
      {/* Miễn phí */}
      <button
        onClick={handleFreeClick}
        disabled={enrolling || isPaidType}
        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all disabled:opacity-50
          ${isPaidType
            ? 'bg-darkbg border-darkborder cursor-not-allowed opacity-40'
            : 'bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/30 hover:from-green-500/20 hover:to-green-600/20 hover:border-green-500/50'
          }`}
      >
        <div className="flex items-center gap-3">
          {enrolling ? (
            <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
          ) : (
            <Award className="w-5 h-5 text-green-400" />
          )}
          <div className="text-left">
            <p className={`text-sm font-semibold ${isPaidType ? 'text-text-muted' : 'text-green-400'}`}>Miễn phí</p>
            <p className={`text-xs ${isPaidType ? 'text-text-muted/60' : 'text-green-400/60'}`}>
              {isPaidType ? 'Không áp dụng' : 'Đăng ký & học ngay'}
            </p>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-green-400/60" />
      </button>

      {/* Trả phí or Mã kích hoạt — chỉ hiện khi PAID, 2 lựa chọn độc lập */}
      {isPaidType && (
        <div className="rounded-xl border border-neon-violet/30 bg-gradient-to-r from-neon-indigo/5 to-neon-violet/5 overflow-hidden">
          {course.hasPaidAccess ? (
            // ── User already has access — branch by enrollment source ──
            isPaidEnrollment ? (
              // Flow 1: PAID enrollment — direct navigation, no code gate ever
              <button
                onClick={() => router.push(`/courses/${course.slug}/learn`)}
                className="flex items-center justify-between w-full px-4 py-3 transition-all
                  bg-gradient-to-r from-neon-indigo/10 to-neon-violet/10 hover:from-neon-indigo/20 hover:to-neon-violet/20"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-neon-violet" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-neon-violet">Vào học ngay</p>
                    <p className="text-xs text-neon-violet/60">Đã thanh toán thành công</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neon-violet/60" />
              </button>
            ) : isCodeEnrollment && hasCodeSession ? (
              // Flow 2a: CODE enrollment with valid session — navigate directly
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
            ) : (
              // Flow 2b: CODE enrollment but no session — require re-entry of code
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
                    value={accessCode}
                    onChange={e => {
                      setAccessCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10));
                      setCodeError('');
                    }}
                    onKeyDown={e => { if (e.key === 'Enter') handleActivateCode(); }}
                    placeholder="ABC123"
                    maxLength={10}
                    className="flex-1 px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary font-mono font-bold tracking-widest placeholder:font-normal placeholder:tracking-normal placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 uppercase text-center"
                  />
                  <button
                    onClick={handleActivateCode}
                    disabled={activatingCode}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                  >
                    {activatingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Xác nhận'}
                  </button>
                </div>
                {codeError && <p className="text-xs text-red-400">{codeError}</p>}
              </div>
            )
          ) : (
            // ── No access yet — show purchase form ──
            <>
              <div className="px-4 py-3 border-b border-neon-violet/20">
                <p className="text-sm font-semibold text-neon-violet">Trả phí or Mã kích hoạt</p>
                <p className="text-xs text-neon-violet/60">Chọn 1 trong 2 cách để truy cập khóa học</p>
              </div>

              <div className="px-4 pb-4 space-y-3 pt-3">
                {/* VNPay */}
                <button
                  onClick={handleBuyCourse}
                  disabled={buying}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-neon-violet/30 bg-darkbg hover:bg-neon-violet/10 transition-all disabled:opacity-50"
                >
                  {buying
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
                      value={accessCode}
                      onChange={e => {
                        setAccessCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10));
                        setCodeError('');
                      }}
                      onKeyDown={e => { if (e.key === 'Enter') handleActivateCode(); }}
                      placeholder="ABC123"
                      maxLength={10}
                      className="flex-1 px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary font-mono font-bold tracking-widest placeholder:font-normal placeholder:tracking-normal placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 uppercase text-center"
                    />
                    <button
                      onClick={handleActivateCode}
                      disabled={activatingCode}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                    >
                      {activatingCode ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Kích hoạt'
                      )}
                    </button>
                  </div>
                  {codeError && <p className="text-xs text-red-400">{codeError}</p>}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { isAuthenticated: isBackendAuth, isLoading: isBackendLoading } = useAuthStore();
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isLoading = isBackendLoading || status === 'loading';
  const isAuthenticated = mounted && (isBackendAuth || status === 'authenticated');

  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [buying, setBuying] = useState(false);
  const [activatingCode, setActivatingCode] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  // ── Render-storm tripwire. Counter updates on every render (via ref
  // so it doesn't itself trigger a re-render). If we ever exceed 50
  // renders in 3 seconds the page is almost certainly stuck in a
  // re-render loop — the original symptom that motivated this code.
  // Before 2026-06-17 this also printed every render; that turned
  // out to be too noisy for normal debugging so the log is now
  // silenced unless the threshold is crossed. Keep the counter.
  const renderCountRef = useRef(0);
  const renderWindowStartRef = useRef(Date.now());
  renderCountRef.current += 1;
  if (process.env.NODE_ENV !== 'production') {
    if (renderCountRef.current === 1 || Date.now() - renderWindowStartRef.current > 3000) {
      renderWindowStartRef.current = Date.now();
      renderCountRef.current = 1;
    } else if (renderCountRef.current > 50) {
      // eslint-disable-next-line no-console
      console.warn('[course-detail] possible render storm — 50+ renders in 3s. last slug=', slug);
      renderCountRef.current = 0;
      renderWindowStartRef.current = Date.now();
    }
  }

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await coursesApi.getBySlug(slug);
        setCourse(res.data.data);
        if (res.data.data?.id) {
          // Wrap the optional reviews call in its own try/catch
          // — the backend does not expose GET /api/v1/courses/:id/reviews
          // (returns 404), but that must NOT bubble up and re-run
          // the main effect via the slug dependency, which is
          // exactly what the original code did and the user saw
          // the page spin forever as a result.
          try {
            const revRes = await coursesApi.getReviews(res.data.data.id);
            setReviews(revRes.data.data || []);
          } catch (revErr: any) {
            // eslint-disable-next-line no-console
            console.warn('[course-detail] getReviews skipped', revErr?.response?.status);
            setReviews([]);
          }
        }
        // Auto-expand first section
        const data = res.data.data;
        if (data?.sections?.[0]?.id) {
          setExpandedSections(new Set([data.sections[0].id]));
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('[course-detail] Fetch error', err?.response?.status, err?.message);
        toast.error('Course not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!course) return;
    setEnrolling(true);
    try {
      await coursesApi.enroll(course.id);
      toast.success('Registration successful! Start learning now.');
      router.push(`/courses/${slug}/learn`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Registration failed');
    } finally {
      setEnrolling(false);
    }
  };

  // Paid-course flow: call backend to create a CourseOrder, get the
  // VNPay paymentUrl, then redirect. Backend will process the IPN
  // callback to enroll the user.
  const handleBuyCourse = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!course) return;
    setBuying(true);
    try {
      const res = await paymentApi.createCourseOrder(course.id);
      const { paymentUrl } = res.data.data;
      // Redirect to VNPay gateway. The user pays (QR/ATM/Visa) and
      // lands back on /payment/return which polls for status.
      window.location.href = paymentUrl;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Khong the tao don thanh toan');
      setBuying(false);
    }
  };

  const handleActivateCode = async () => {
    const code = accessCode.trim().toUpperCase();
    if (!code || code.length < 4) {
      setCodeError('Vui long nhap ma kich hoat (toi thieu 4 ky tu)');
      return;
    }
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!course) return;
    setActivatingCode(true);
    setCodeError('');
    try {
      await coursesApi.activateCode(course.id, code);
      // Authorize this browser session so the learn page gate passes.
      sessionStorage.setItem(`code_session_${course.id}`, '1');
      toast.success('Kich hoat thanh cong! Ban co the bat dau hoc ngay.');
      router.push(`/courses/${slug}/learn`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e?.response?.data?.message || 'Ma kich hoat khong hop le';
      setCodeError(msg);
      toast.error(msg);
    } finally {
      setActivatingCode(false);
    }
  };

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

  if (!course) {
    return (
      <div className="min-h-screen bg-darkbg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Course not found</h2>
          <Link href="/courses" className="text-neon-violet hover:text-neon-indigo">Back to Courses</Link>
        </div>
      </div>
    );
  }

  const hasDiscount = course.discountPrice && course.discountPrice > 0;
  const accessType = (course as any).accessType || (course.isFree ? 'FREE' : 'PAID');
  // accessType is authoritative. CTA priority: hasPaidAccess -> CODE box -> FREE enroll -> PAID buy.
  // For CODE courses, hasPaidAccess=true only when enrollment.source='CODE'.
  const isPaidCourse = accessType === 'PAID';
  const isCodeCourse = accessType === 'CODE';
  const whatYouLearnList = course.whatYouLearn ? course.whatYouLearn.split('\n').filter(Boolean) : [];
  const requirementsList = course.requirements ? course.requirements.split('\n').filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-darkbg">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-b from-neon-indigo/10 to-darkbg">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-neon-indigo/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-neon-violet/10 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <Link href="/courses" className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary mb-6 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                {course.categoryName && (
                  <span className="px-3 py-1 bg-neon-indigo/20 text-neon-indigo text-sm rounded-full font-medium">
                    {course.categoryName}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.level === 'BEGINNER' ? 'bg-green-500/10 text-green-400' :
                  course.level === 'INTERMEDIATE' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {course.level === 'BEGINNER' ? 'Beginner' :
                   course.level === 'INTERMEDIATE' ? 'Intermediate' :
                   course.level === 'ADVANCED' ? 'Advanced' : course.level}
                </span>
                <span className="flex items-center gap-1.5 text-text-muted text-sm">
                  <Globe className="w-4 h-4" />
                  {course.language}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4 leading-tight">
                {course.title}
              </h1>

              {course.shortDescription && (
                <p className="text-text-secondary text-lg mb-6 leading-relaxed">
                  {course.shortDescription}
                </p>
              )}

              {/* Instructor */}
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={course.instructorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructorName || 'T')}&background=random&size=64`}
                  alt={course.instructorName || 'Instructor'}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-text-primary font-medium text-sm">Instructor</p>
                  <p className="text-text-muted text-sm">{course.instructorName || 'CuongHoangDev'}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-text-muted text-sm">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {formatDuration(course.totalDurationSeconds)}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {course.totalLessons} lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {course.totalStudents.toLocaleString('vi-VN')} students
                </span>
                {course.avgRating > 0 && (
                  <span className="flex items-center gap-1.5 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    {Number(course.avgRating).toFixed(1)} ({course.totalReviews} reviews)
                  </span>
                )}
                {course.publishedAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {new Date(course.publishedAt).toLocaleDateString('vi-VN')}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Enrollment card */}
            <div>
              <div className="bg-darkcard border border-darkborder/50 rounded-2xl overflow-hidden sticky top-6">
                {course.thumbnailUrl && (
                  <div className="aspect-video relative">
                    <SafeImage
                      src={course.thumbnailUrl}
                      alt={course.title}
                      label={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                        <Play className="w-7 h-7 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {hasDiscount ? (
                      <>
                        <span className="text-3xl font-bold text-neon-violet">
                          {formatPrice(Number(course.discountPrice), false)}
                        </span>
                        <span className="text-lg text-text-muted line-through">
                          {formatPrice(Number(course.price), false)}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-neon-violet">
                        {formatPrice(Number(course.price), course.isFree)}
                      </span>
                    )}
                  </div>

                  <OldCourseAccessOptions
                    course={course}
                    isAuthenticated={!!isAuthenticated}
                    accessCode={accessCode}
                    setAccessCode={setAccessCode}
                    codeError={codeError}
                    setCodeError={setCodeError}
                    enrolling={enrolling}
                    setEnrolling={setEnrolling}
                    buying={buying}
                    setBuying={setBuying}
                    activatingCode={activatingCode}
                    setActivatingCode={setActivatingCode}
                    handleEnroll={handleEnroll}
                    handleBuyCourse={handleBuyCourse}
                    handleActivateCode={handleActivateCode}
                  />

                  <p className="text-center text-text-muted text-xs mt-3">
                    {course.hasPaidAccess
                      ? 'Ban da dang ky khoa hoc nay'
                      : isPaidCourse
                        ? 'Thanh toan qua VNPay (QR / ATM / Visa)'
                        : isCodeCourse
                          ? 'Ma kich hoat: 4-10 ky tu (chu hoa, so)'
                          : 'Truy cap mien phi'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            {/* What you'll learn */}
            {whatYouLearnList.length > 0 && (
              <section className="bg-darkcard border border-darkborder/50 rounded-2xl p-6">
                <h2 className="text-xl font-heading font-bold text-text-primary mb-5 flex items-center gap-2">
                  <Award className="w-5 h-5 text-neon-violet" />
                  What You Will Learn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {whatYouLearnList.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      {item.replace(/^[-•*]\s*/, '')}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Description */}
            {course.description && (
              <section className="bg-darkcard border border-darkborder/50 rounded-2xl p-6">
                <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Course Description</h2>
                <div className="text-text-secondary leading-relaxed prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.description) }} />
              </section>
            )}

            {/* Curriculum */}
            <section className="bg-darkcard border border-darkborder/50 rounded-2xl p-6">
                <h2 className="text-xl font-heading font-bold text-text-primary mb-5 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-neon-violet" />
                  Course Content
                </h2>
              <div className="space-y-2">
                {course.sections?.map((section) => (
                  <div key={section.id} className="border border-darkborder/30 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-4 bg-darkbg/50 hover:bg-darkbg transition-colors text-left"
                    >
                      <div>
                        <h3 className="font-semibold text-text-primary">{section.title}</h3>
                        <p className="text-text-muted text-xs mt-1">
                          {section.lessonCount} lessons • {formatDuration(section.totalDurationSeconds)}
                        </p>
                      </div>
                      {expandedSections.has(section.id)
                        ? <ChevronUp className="w-5 h-5 text-text-muted shrink-0" />
                        : <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                      }
                    </button>
                    {expandedSections.has(section.id) && (
                      <div className="divide-y divide-darkborder/20">
                        {section.lessons?.map((lesson) => {
                          const locked = section.isLocked && !course.hasPaidAccess;
                          const isFree = lesson.isFreePreview;
                          return (
                            <div key={lesson.id} className="flex items-center gap-3 p-3 pl-4">
                              <div className={`shrink-0 ${locked ? 'text-text-muted' : isFree ? 'text-green-400' : 'text-neon-indigo'}`}>
                                {locked ? <Lock className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-text-primary truncate">{lesson.title}</p>
                                <div className="flex items-center gap-3 mt-0.5">
                                  <span className="text-text-muted text-xs">
                                    {formatDuration(lesson.videoDurationSeconds)}
                                  </span>
                                  {isFree && !course.isEnrolled && (
                                    <span className="text-xs text-green-400 font-medium">Preview</span>
                                  )}
                                </div>
                              </div>
                              {lesson.lessonType === 'VIDEO' && (
                                <span className="text-text-muted text-xs shrink-0">
                                  Video
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            {requirementsList.length > 0 && (
              <section className="bg-darkcard border border-darkborder/50 rounded-2xl p-6">
                <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {requirementsList.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary text-sm">
                      <span className="text-neon-violet mt-1">•</span>
                      {item.replace(/^[-•*]\s*/, '')}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <section className="bg-darkcard border border-darkborder/50 rounded-2xl p-6">
                <h2 className="text-xl font-heading font-bold text-text-primary mb-5">
                  Reviews ({course.totalReviews})
                </h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-darkborder/20 pb-4 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={review.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userFullName)}&background=random&size=40`}
                          alt={review.userFullName}
                          className="w-9 h-9 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-text-primary text-sm">{review.userFullName}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-darkborder'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="text-text-muted text-xs ml-auto">
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      {review.title && <p className="font-medium text-text-primary text-sm mb-1">{review.title}</p>}
                      {review.content && <p className="text-text-secondary text-sm">{review.content}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
