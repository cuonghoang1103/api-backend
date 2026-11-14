'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star, Users, Clock, BookOpen, Play, Lock, CheckCircle,
  ChevronDown, ChevronRight, Loader2, Award, Globe, ArrowLeft, CreditCard,
  KeyRound, Layers3, CirclePlay as PlayCircle, Presentation, ListChecks, CodeXml as Code2, FileCode2, FileText,
  ListTree, Hourglass, MessageSquarePlus,
} from 'lucide-react';
import { coursesApi, paymentApi, courseSuggestionsApi } from '@/lib/api';
import { CHU_GOP_Y } from '@/lib/gopYKhoa';
import { COURSE_PAYMENT_ENABLED } from '@/lib/featureFlags';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/context/LocaleContext';
import { pickLang } from '@/lib/utils';
import { toast } from 'sonner';
import { getPrerequisites, hasAcknowledgedPrereq, acknowledgePrereq } from '@/lib/coursePrerequisites';
import { PrerequisiteModal, PrerequisiteBanner } from '@/components/courses/PrerequisiteGate';
import CourseLabCard from '@/components/labs/CourseLabCard';
import { tachGachDauDong, nenMotCot } from '@/lib/courseBlurb';
import { CourseDescription } from '@/components/courses/CourseDescription';
import { tachCauDai } from '@/lib/courseDescription';
import { AnhDaiDien } from '@/components/ui/AnhDaiDien';
import type { Course, CourseReview } from '@/types';
import { CHU } from '@/components/courses/chuong-trinh/chu';
import { CHU_KHOA } from '@/components/courses/chuong-trinh/chuKhoa';
import { AnhBia, ChipCapDo, ChipNhan, NhanDangSoan, NhanSapRaMat, TienDo } from '@/components/courses/chuong-trinh/KhoaHoc';
import s from '@/components/courses/chuong-trinh/chuongTrinh.module.css';

/** "2 giờ 15 phút" / "2h 15m" — dưới 1 phút trả chuỗi rỗng: KHÔNG BAO GIỜ in "0 min" (trước 01/11 trang in
 *  "0 min · 0 students" cho mọi khoá chưa có video, trông như khoá chết). */
function formatDuration(seconds: number, en = false): string {
  if (!seconds || seconds < 60) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h > 0) return en ? `${h}h${m ? ` ${m}m` : ''}` : `${h} giờ${m ? ` ${m} phút` : ''}`;
  return en ? `${m} min` : `${m} phút`;
}

function formatPrice(price: number, isFree: boolean, en = false): string {
  if (isFree) return en ? 'Free' : 'Miễn phí';
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
  en = false,
}: {
  en?: boolean;
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
            <CheckCircle className="w-5 h-5 text-violet-700 [.theme-dark_&]:text-neon-violet" />
            <div className="text-left">
              <p className="text-sm font-semibold text-violet-700 [.theme-dark_&]:text-neon-violet">{en ? 'Go to the course' : 'Vào học ngay'}</p>
              <p className="text-xs text-violet-700/80 [.theme-dark_&]:text-neon-violet/60">
                {isAdminViewer
                  ? (en ? 'Admin access — no enrolment needed' : 'Truy cập admin — không cần đăng ký')
                  : (en ? 'You are enrolled in this course' : 'Bạn đã đăng ký khoá này')}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-violet-700/80 [.theme-dark_&]:text-neon-violet/60" />
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
      toast.warning(en ? 'This course is not free at the moment.' : 'Khoá học này hiện chưa áp dụng hình thức miễn phí.');
      return;
    }
    try {
      await handleEnroll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || (en ? 'Could not enrol you for free.' : 'Không thể đăng ký miễn phí.'));
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
            ? 'bg-[var(--bg-primary)] border-[var(--border-color)] cursor-not-allowed opacity-40'
            : 'bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/30 hover:from-green-500/20 hover:to-green-600/20 hover:border-green-500/50'
          }`}
      >
        <div className="flex items-center gap-3">
          {enrolling ? (
            <Loader2 className="w-5 h-5 text-green-700 [.theme-dark_&]:text-green-400 animate-spin" />
          ) : (
            <Award className="w-5 h-5 text-green-700 [.theme-dark_&]:text-green-400" />
          )}
          <div className="text-left">
            <p className={`text-sm font-semibold ${isPaidType ? 'text-text-muted' : 'text-green-700 [.theme-dark_&]:text-green-400'}`}>{en ? 'Free' : 'Miễn phí'}</p>
            <p className={`text-xs ${isPaidType ? 'text-text-muted' : 'text-green-700 [.theme-dark_&]:text-green-300'}`}>
              {isPaidType ? (en ? 'Not available' : 'Không áp dụng') : (en ? 'Enrol and start now' : 'Đăng ký và học ngay')}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-green-700 [.theme-dark_&]:text-green-400/60" aria-hidden />
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
                  <CheckCircle className="w-5 h-5 text-violet-700 [.theme-dark_&]:text-neon-violet" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-violet-700 [.theme-dark_&]:text-neon-violet">Vào học ngay</p>
                    <p className="text-xs text-violet-700/80 [.theme-dark_&]:text-neon-violet/60">Đã thanh toán thành công</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-violet-700/80 [.theme-dark_&]:text-neon-violet/60" />
              </button>
            ) : isCodeEnrollment && hasCodeSession ? (
              // Flow 2a: CODE enrollment with valid session — navigate directly
              <button
                onClick={() => router.push(`/courses/${course.slug}/learn`)}
                className="flex items-center justify-between w-full px-4 py-3 transition-all
                  bg-gradient-to-r from-neon-indigo/10 to-neon-violet/10 hover:from-neon-indigo/20 hover:to-neon-violet/20"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-violet-700 [.theme-dark_&]:text-neon-violet" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-violet-700 [.theme-dark_&]:text-neon-violet">Tiếp tục học</p>
                    <p className="text-xs text-violet-700/80 [.theme-dark_&]:text-neon-violet/60">Mã kích hoạt hợp lệ cho phiên này</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-violet-700/80 [.theme-dark_&]:text-neon-violet/60" />
              </button>
            ) : (
              // Flow 2b: CODE enrollment but no session — require re-entry of code
              <div className="px-4 py-4 space-y-3">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-neon-violet/10 border border-neon-violet/30">
                  <KeyRound className="w-4 h-4 text-violet-700 [.theme-dark_&]:text-neon-violet mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-violet-700 [.theme-dark_&]:text-neon-violet">Nhập lại mã để tiếp tục</p>
                    <p className="text-xs text-violet-700/80 [.theme-dark_&]:text-neon-violet/60">Mỗi phiên làm việc cần xác nhận mã kích hoạt</p>
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
                    className="flex-1 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm text-text-primary font-mono font-bold tracking-widest placeholder:font-normal placeholder:tracking-normal placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 uppercase text-center"
                  />
                  <button
                    onClick={handleActivateCode}
                    disabled={activatingCode}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                  >
                    {activatingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Xác nhận'}
                  </button>
                </div>
                {codeError && <p className="text-xs text-red-700 [.theme-dark_&]:text-red-400">{codeError}</p>}
              </div>
            )
          ) : (
            // ── No access yet — show purchase form ──
            <>
              <div className="px-4 py-3 border-b border-neon-violet/20">
                <p className="text-sm font-semibold text-violet-700 [.theme-dark_&]:text-neon-violet">
                  {COURSE_PAYMENT_ENABLED ? 'Trả phí hoặc mã kích hoạt' : 'Mã kích hoạt'}
                </p>
                <p className="text-xs text-violet-700/80 [.theme-dark_&]:text-neon-violet/60">
                  {COURSE_PAYMENT_ENABLED
                    ? 'Chọn 1 trong 2 cách để truy cập khóa học'
                    : 'Nhập mã kích hoạt để truy cập khóa học'}
                </p>
              </div>

              <div className="px-4 pb-4 space-y-3 pt-3">
                {/* Online payment — PayOS (primary), auto-falls back to VNPay.
                    Hidden while course payment is disabled (lib/featureFlags.ts);
                    access-code enrolment below stays fully functional. */}
                {COURSE_PAYMENT_ENABLED && (
                <button
                  onClick={handleBuyCourse}
                  disabled={buying}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-neon-violet/30 bg-[var(--bg-primary)] hover:bg-neon-violet/10 transition-all disabled:opacity-50"
                >
                  {buying
                    ? <Loader2 className="w-4 h-4 text-violet-700 [.theme-dark_&]:text-neon-violet animate-spin" />
                    : <CreditCard className="w-4 h-4 text-violet-700 [.theme-dark_&]:text-neon-violet" />}
                  <div className="text-left">
                    <p className="text-sm font-medium text-text-primary">Thanh toán online (PayOS)</p>
                    <p className="text-xs text-text-muted">Mua ngay – {priceLabel} · QR/ATM/Visa</p>
                  </div>
                </button>
                )}

                {/* Mã kích hoạt */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-violet-700 [.theme-dark_&]:text-neon-violet shrink-0" />
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
                      className="flex-1 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm text-text-primary font-mono font-bold tracking-widest placeholder:font-normal placeholder:tracking-normal placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 uppercase text-center"
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
                  {codeError && <p className="text-xs text-red-700 [.theme-dark_&]:text-red-400">{codeError}</p>}
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

  const { locale } = useTranslation();
  const en = locale === 'en';
  const t = CHU_KHOA[en ? 'en' : 'vi'];
  const c = CHU[en ? 'en' : 'vi'];
  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [buying, setBuying] = useState(false);
  const [activatingCode, setActivatingCode] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  // Review form (enrolled learners only).
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  // Góp ý & bổ sung (14/11/2026): số góp ý hiện trên nút thứ ba của hero. Lỗi ⇒ nút vẫn hiện, chỉ không có số.
  const [soGopY, setSoGopY] = useState<number | null>(null);
  useEffect(() => {
    let huy = false;
    courseSuggestionsApi.count(slug).then((r) => { if (!huy) setSoGopY(r.data.data.tong); }).catch(() => {});
    return () => { huy = true; };
  }, [slug]);

  // ── Soft prerequisite gate. If this course assumes a foundation the learner
  // has not acknowledged yet, show the self-assessment modal once. Read
  // localStorage only after mount (do NOT gate on an auth-hydration flag).
  const [showPrereqModal, setShowPrereqModal] = useState(false);
  useEffect(() => {
    if (!mounted || !course?.slug) return;
    const prereqs = getPrerequisites(course.slug);
    if (prereqs.length > 0 && !hasAcknowledgedPrereq(course.slug)) {
      setShowPrereqModal(true);
    }
  }, [mounted, course?.slug]);

  // ── Render-storm tripwire. Counter updates on every render (via ref
  // so it doesn't itself trigger a re-render). If we ever exceed 50
  // renders in 3 seconds the page is almost certainly stuck in a
  // re-render loop — the original symptom that motivated this code.
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
        const res = await coursesApi.getBySlug(slug, true);
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
        toast.error(en ? 'Course not found' : 'Không tìm thấy khoá học');
      } finally {
        setLoading(false);
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/courses/${slug}`)}`);
      return;
    }
    if (!course) return;
    setEnrolling(true);
    try {
      await coursesApi.enroll(course.id);
      toast.success(en ? 'You are enrolled — start learning now.' : 'Đăng ký thành công! Bắt đầu học ngay.');
      router.push(`/courses/${slug}/learn`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || (en ? 'Enrolment failed' : 'Đăng ký không thành công'));
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
      const { orderCode, paymentUrl } = res.data.data as { orderCode: string; paymentUrl?: string };
      // PayOS is the PRIMARY gateway. Fall back to VNPay only when PayOS
      // isn't configured yet (503) or its link creation fails — so the buy
      // flow keeps working until the PayOS credentials are added.
      try {
        const p = await paymentApi.createPayos(orderCode);
        window.location.href = p.data.data.checkoutUrl;
        return;
      } catch (payErr: unknown) {
        if (paymentUrl) {
          window.location.href = paymentUrl; // VNPay fallback
          return;
        }
        throw payErr;
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || (en ? 'Could not create the payment order' : 'Không thể tạo đơn thanh toán'));
      setBuying(false);
    }
  };

  const handleActivateCode = async () => {
    const code = accessCode.trim().toUpperCase();
    if (!code || code.length < 4) {
      setCodeError(en ? 'Enter an activation code (at least 4 characters)' : 'Vui lòng nhập mã kích hoạt (tối thiểu 4 ký tự)');
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
      toast.success(en ? 'Activated — you can start learning now.' : 'Kích hoạt thành công! Bạn có thể bắt đầu học ngay.');
      router.push(`/courses/${slug}/learn`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e?.response?.data?.message || (en ? 'Invalid activation code' : 'Mã kích hoạt không hợp lệ');
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
      <div className={`${s.goc} flex min-h-screen items-center justify-center`}>
        <Loader2 className="h-10 w-10 animate-spin text-[var(--k-accent)]" aria-label={t.dangTai} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className={`${s.goc} flex min-h-screen items-center justify-center px-4`}>
        <div className={`${s.the} rounded-2xl p-8 text-center`}>
          <h2 className="mb-4 text-2xl font-bold text-[var(--k-ink)]">{t.khongThay}</h2>
          <Link href="/courses" className="font-semibold text-[var(--k-accent)] underline underline-offset-4">{t.veCourses}</Link>
        </div>
      </div>
    );
  }

  const hasDiscount = course.discountPrice && course.discountPrice > 0;
  const accessType = (course as any).accessType || (course.isFree ? 'FREE' : 'PAID');
  // accessType is authoritative. CTA priority: hasPaidAccess -> CODE box -> FREE enroll -> PAID buy.
  // For CODE courses, hasPaidAccess=true only when enrollment.source='CODE'.
  const isPaidCourse = accessType === 'PAID';
  // Khoá "Sắp ra mắt" (status COMING_SOON): máy chủ chỉ trả khung mục lục, mọi cửa ghi danh/mua đóng (409). Trang này
  // hiện mục lục + nhãn, và thay khối đăng ký bằng một thông báo — không có nút nào bấm vào để lỗi.
  const sapRaMat = Boolean((course as { comingSoon?: boolean }).comingSoon);
  const khungSRM = course as { soChuongDuKien?: number; soBaiDuKien?: number };
  const isCodeCourse = accessType === 'CODE';
  const whatYouLearnList = tachGachDauDong(course.whatYouLearn);
  const requirementsList = tachCauDai(tachGachDauDong(course.requirements));
  const isAdminViewer = Boolean((course as any).isAdmin);
  const isAcademy = (course as { academyType?: string }).academyType === 'FPT' || course.semesterId != null;

  // Only enrolled learners (or admin/instructor) may post a review.
  const canReview = Boolean(course.isEnrolled || course.hasPaidAccess || isAdminViewer);
  // Display rating: compute from the loaded reviews so it's accurate the
  // moment a new one is posted (falls back to the stored aggregate).
  const displayReviewCount = reviews.length || course.totalReviews || 0;
  const displayAvgRating = reviews.length
    ? reviews.reduce((tong, r) => tong + r.rating, 0) / reviews.length
    : Number(course.avgRating) || 0;

  // ── Số liệu thật — số 0 KHÔNG hiện ("0 phút · 0 học viên" trông như khoá chết).
  const sections = course.sections ?? [];
  const allLessons = sections.flatMap((sec) => sec.lessons ?? []);
  const firstLesson = allLessons[0];
  const bg = course.baoGom ?? null;
  const soChuong = sapRaMat ? (khungSRM.soChuongDuKien ?? sections.length) : sections.length;
  const soBai = sapRaMat ? (khungSRM.soBaiDuKien ?? allLessons.length) : (allLessons.length || course.totalLessons || 0);
  const giayVideo = bg?.giayVideo ?? (allLessons.reduce((tg, l) => tg + (l.videoDurationSeconds || 0), 0) || course.totalDurationSeconds || 0);
  const soQuiz = bg?.soQuiz ?? allLessons.filter((l) => l.lessonType === 'QUIZ').length;
  const dangSoan = !sapRaMat && Boolean(bg?.dangSoan);
  const tienDo = course.enrollmentProgress ?? 0;

  // Vào được bài học ngay (không cần bước đăng ký nữa).
  const vaoDuoc = isAdminViewer
    || (accessType === 'FREE' && Boolean(course.isEnrolled))
    || (Boolean(course.hasPaidAccess) && course.enrollmentSource !== 'CODE');
  const duongBai = (lessonId?: number) => `/courses/${course.slug}/learn${lessonId ? `?lessonId=${lessonId}` : ''}`;

  const batDauHoc = async () => {
    if (vaoDuoc) {
      router.push(tienDo > 0 ? duongBai() : duongBai(firstLesson?.id));
      return;
    }
    if (accessType === 'FREE') {
      await handleEnroll();
      return;
    }
    // Trả phí / mã kích hoạt: đưa người học tới khối đăng ký.
    document.getElementById('dang-ky')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const nhanNut = vaoDuoc && tienDo > 0 ? t.tiepTuc : (accessType === 'FREE' || vaoDuoc ? t.batDau : t.moKhoa);

  const moTatCa = expandedSections.size < sections.length;

  const submitReview = async () => {
    if (!course || submittingReview) return;
    if (!(reviewRating >= 1 && reviewRating <= 5)) {
      toast.error(en ? 'Choose a rating (1–5 stars)' : 'Vui lòng chọn số sao (1–5)');
      return;
    }
    setSubmittingReview(true);
    try {
      await coursesApi.createReview({ courseId: course.id, rating: reviewRating, content: reviewContent.trim() || undefined });
      const rev = await coursesApi.getReviews(course.id);
      setReviews(rev.data.data || []);
      setReviewContent('');
      toast.success(en ? 'Thanks for reviewing the course!' : 'Cảm ơn bạn đã đánh giá khoá học!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || (en ? 'Could not send your review' : 'Không gửi được đánh giá'));
    } finally {
      setSubmittingReview(false);
    }
  };

  // "Khoá học này gồm" — chỉ những thứ thật sự có.
  const baoGom: Array<{ icon: React.ReactNode; so: string; nhan: string }> = [
    { icon: <Layers3 className="h-5 w-5" />, so: String(soChuong), nhan: t.chuong },
    { icon: <BookOpen className="h-5 w-5" />, so: String(soBai), nhan: sapRaMat ? t.baiDuKien : t.baiHoc },
    ...(giayVideo >= 60 ? [{ icon: <PlayCircle className="h-5 w-5" />, so: formatDuration(giayVideo, en), nhan: t.video }] : []),
    ...(bg && bg.soBaiSlide > 0 ? [{ icon: <Presentation className="h-5 w-5" />, so: String(bg.soBaiSlide), nhan: t.baiCoSlide }] : []),
    ...(soQuiz > 0 ? [{ icon: <ListChecks className="h-5 w-5" />, so: String(soQuiz), nhan: t.quiz }] : []),
    ...(bg && bg.soBaiCodeLab > 0 ? [{ icon: <Code2 className="h-5 w-5" />, so: String(bg.soBaiCodeLab), nhan: t.codeLab }] : []),
    ...(bg && bg.soDeFE > 0 ? [{ icon: <Award className="h-5 w-5" />, so: String(bg.soDeFE), nhan: t.deFE }] : []),
    ...(bg && bg.soDePE > 0 ? [{ icon: <FileCode2 className="h-5 w-5" />, so: String(bg.soDePE), nhan: t.dePE }] : []),
  ];

  const metaHero: Array<{ icon: React.ReactNode; chu: string }> = [
    ...(soChuong > 0 ? [{ icon: <Layers3 className="h-4 w-4" />, chu: t.soChuong(soChuong) }] : []),
    ...(soBai > 0 ? [{ icon: <BookOpen className="h-4 w-4" />, chu: sapRaMat ? t.soBaiDuKien(soBai) : t.soBai(soBai) }] : []),
    ...(giayVideo >= 60 ? [{ icon: <Clock className="h-4 w-4" />, chu: t.videoDai(formatDuration(giayVideo, en)) }] : []),
    ...(course.totalStudents > 0 ? [{ icon: <Users className="h-4 w-4" />, chu: t.hocVien(course.totalStudents) }] : []),
  ];

  const ngonNgu = t.ngonNgu[course.language as keyof typeof t.ngonNgu] ?? course.language;

  const kieuBai = (l: { lessonType: string; videoDurationSeconds: number }) =>
    l.lessonType === 'QUIZ'
      ? { icon: <ListChecks className="h-4 w-4" />, nhan: t.quizNgan }
      : l.videoDurationSeconds > 0
        ? { icon: <PlayCircle className="h-4 w-4" />, nhan: t.videoNgan }
        : { icon: <FileText className="h-4 w-4" />, nhan: t.baiDoc };

  return (
    <div className={`${s.goc} min-h-screen pb-20 pt-20 sm:pt-24`}>
      {showPrereqModal && (
        <PrerequisiteModal
          courseTitle={course.title}
          prerequisites={getPrerequisites(course.slug)}
          onProceed={() => {
            acknowledgePrereq(course.slug);
            setShowPrereqModal(false);
          }}
          onGoToFoundation={(foundationSlug) => {
            acknowledgePrereq(course.slug);
            router.push(`/courses/${foundationSlug}`);
          }}
        />
      )}

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 sm:space-y-8 sm:px-6 lg:px-8">
        {/* Academy (FPTU) quay về Academy; khoá chung quay về Courses. */}
        <Link
          href={isAcademy ? '/academy' : '/courses'}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-xl text-sm font-medium text-[var(--k-ink-2)] transition-colors hover:text-[var(--k-ink)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {isAcademy ? t.veAcademy : t.veCourses}
        </Link>

        {/* ── Hero ── */}
        <header className={`${s.the} relative overflow-hidden rounded-3xl p-5 sm:p-8`}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(circle at top right, var(--k-glow-1), transparent 40%), radial-gradient(circle at bottom left, var(--k-glow-2), transparent 36%)' }}
          />
          <div className="relative grid items-center gap-6 lg:grid-cols-[1.35fr_0.9fr] lg:gap-10">
            <div className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {sapRaMat && <NhanSapRaMat c={c} />}
                {dangSoan && <NhanDangSoan c={c} />}
                {course.courseCode && <ChipNhan>{course.courseCode}</ChipNhan>}
                {course.loTrinhKy ? <ChipNhan>{c.hocKy(course.loTrinhKy)}</ChipNhan> : null}
                <ChipCapDo level={course.level} c={c} />
                {course.categoryName && <ChipNhan tone="cyan">{course.categoryName}</ChipNhan>}
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--k-ink-3)]">
                  <Globe className="h-3.5 w-3.5" aria-hidden />
                  {ngonNgu}
                </span>
              </div>

              <h1 className={`${s.tieuDe} font-heading text-[1.9rem] font-bold leading-tight text-[var(--k-ink)] [text-wrap:balance] sm:text-[2.6rem]`}>
                {pickLang(course.title, locale)}
              </h1>

              {course.shortDescription && (
                <p className="mt-4 max-w-[44rem] text-base leading-relaxed text-[var(--k-ink-2)] sm:text-lg">
                  {pickLang(course.shortDescription, locale)}
                </p>
              )}

              {metaHero.length > 0 && (
                <ul className={`${s.so} mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--k-ink-2)]`}>
                  {metaHero.map((m) => (
                    <li key={m.chu} className="inline-flex items-center gap-1.5">
                      <span className="text-[var(--k-accent)]" aria-hidden>{m.icon}</span>
                      {m.chu}
                    </li>
                  ))}
                  {displayAvgRating > 0 && (
                    <li className="inline-flex items-center gap-1.5 text-[var(--k-amber)]">
                      <Star className="h-4 w-4 fill-current" aria-hidden />
                      {displayAvgRating.toFixed(1)} ({t.danhGiaDem(displayReviewCount)})
                    </li>
                  )}
                </ul>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {sapRaMat ? (
                  <span className="inline-flex min-h-[48px] items-center rounded-xl border border-[var(--k-border)] px-5 text-sm font-semibold text-[var(--k-ink-3)]">
                    {t.chuaMo}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={batDauHoc}
                    disabled={enrolling}
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-xl px-6 text-[15px] font-semibold text-white shadow-lg shadow-violet-500/20 transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'var(--k-grad)' }}
                  >
                    {enrolling ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Play className="h-5 w-5 fill-current" aria-hidden />}
                    {nhanNut}
                  </button>
                )}
                <a
                  href="#noi-dung"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-[var(--k-border-strong)] px-5 text-[15px] font-semibold text-[var(--k-ink)] transition-colors hover:border-[var(--k-accent-line)] hover:bg-[var(--k-accent-soft)]"
                >
                  <ListTree className="h-5 w-5" aria-hidden />
                  {t.xemMucLuc}
                </a>
                <Link
                  href={`/courses/${course.slug}/gop-y`}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-[var(--k-border-strong)] px-5 text-[15px] font-semibold text-[var(--k-ink)] transition-colors hover:border-[var(--k-accent-line)] hover:bg-[var(--k-accent-soft)]"
                >
                  <MessageSquarePlus className="h-5 w-5" aria-hidden />
                  {CHU_GOP_Y[en ? 'en' : 'vi'].nut}
                  {soGopY ? (
                    <span className={`${s.so} rounded-full bg-[var(--k-accent-soft)] px-2 py-0.5 text-xs font-bold text-[var(--k-accent)]`}>{soGopY}</span>
                  ) : null}
                </Link>
              </div>
              {!sapRaMat && !vaoDuoc && accessType === 'FREE' && (
                <p className="mt-2.5 text-xs text-[var(--k-ink-3)]">{isAuthenticated ? t.ghiChuMienPhi : t.ghiChuDangNhap}</p>
              )}
              {vaoDuoc && tienDo > 0 && (
                <div className="mt-4 max-w-sm"><TienDo p={Math.round(tienDo)} c={c} /></div>
              )}
            </div>

            <div className="order-first min-w-0 lg:order-none">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-[var(--k-border)] bg-[var(--k-thumb)]">
                <AnhBia
                  m={{ thumbnailUrl: course.thumbnailUrl ?? null, courseCode: course.courseCode ?? null }}
                  ten={pickLang(course.title, locale)}
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          </div>

          {dangSoan && bg && (
            <div className="relative mt-6 flex items-start gap-3 rounded-2xl border border-[var(--k-amber-line)] bg-[var(--k-amber-soft)] p-4 text-sm">
              <Hourglass className="mt-0.5 h-5 w-5 shrink-0 text-[var(--k-amber)]" aria-hidden />
              <p className="leading-relaxed text-[var(--k-ink)]">
                <span className="font-semibold">{t.dangSoanTieuDe}</span> {t.dangSoanMoTa(bg.soBaiDaSoan, bg.soBai)}
              </p>
            </div>
          )}
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          {/* ── Cột phải (điện thoại: lên trước) — đăng ký + "Khoá học này gồm" ── */}
          <aside className="order-first space-y-6 lg:order-last">
            <div className="space-y-6 lg:sticky lg:top-24">
              <section id="dang-ky" aria-label={t.dangKy} className={`${s.the} scroll-mt-28 rounded-2xl p-5`}>
                {/* Price — hidden while course payment is disabled (lib/featureFlags.ts). Khoá miễn phí: nút xanh
                    "Miễn phí" bên dưới đã nói đủ — không in thêm chữ "Miễn phí" cỡ lớn lặp lại. */}
                {COURSE_PAYMENT_ENABLED && !(course.isFree && accessType === 'FREE') && (
                  <div className="mb-4 flex items-center gap-3">
                    {hasDiscount ? (
                      <>
                        <span className="text-3xl font-bold text-[var(--k-accent)]">
                          {formatPrice(Number(course.discountPrice), false, en)}
                        </span>
                        <span className="text-lg text-[var(--k-ink-3)] line-through">
                          {formatPrice(Number(course.price), false, en)}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-[var(--k-accent)]">
                        {formatPrice(Number(course.price), course.isFree, en)}
                      </span>
                    )}
                  </div>
                )}

                {sapRaMat ? (
                  <div className="rounded-xl border border-[var(--k-cyan-line)] bg-[var(--k-cyan-soft)] p-4 text-sm">
                    <p className="font-semibold text-[var(--k-ink)]">{c.sapRaMat}</p>
                    <p className="mt-1.5 leading-relaxed text-[var(--k-ink-2)]">
                      {t.sapRaMatMoTa(khungSRM.soChuongDuKien ?? 0, khungSRM.soBaiDuKien ?? 0)}
                    </p>
                    <button type="button" disabled className="mt-3 w-full cursor-not-allowed rounded-lg border border-[var(--k-border)] px-4 py-2.5 text-sm font-semibold text-[var(--k-ink-3)]">
                      {t.chuaMo}
                    </button>
                  </div>
                ) : (
                  <>
                    <OldCourseAccessOptions
                      en={en}
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
                    <p className="mt-3 text-center text-xs text-[var(--k-ink-3)]">
                      {course.hasPaidAccess
                        ? t.daDangKy
                        : isPaidCourse
                          ? t.thanhToan
                          : isCodeCourse
                            ? t.maKichHoat
                            : t.mienPhi}
                    </p>
                  </>
                )}
              </section>

              <section aria-labelledby="bao-gom" className={`${s.the} rounded-2xl p-5`}>
                <h2 id="bao-gom" className="mb-4 text-base font-semibold text-[var(--k-ink)]">{t.baoGom}</h2>
                <ul className="grid grid-cols-2 gap-2.5">
                  {baoGom.map((b) => (
                    <li key={b.nhan} className={`${s.theTrong} rounded-xl p-3`}>
                      <span className="text-[var(--k-accent)]" aria-hidden>{b.icon}</span>
                      <p className={`${s.so} mt-1.5 text-lg font-bold leading-none text-[var(--k-ink)]`}>{b.so}</p>
                      <p className="mt-1 text-xs leading-snug text-[var(--k-ink-3)]">{b.nhan}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-3 border-t border-[var(--k-border)] pt-4">
                  {course.instructorId ? (
                    <Link
                      href={`/profile/${course.instructorId}`}
                      className="group/gv -m-1 flex items-center gap-3 rounded-xl p-1 transition-colors hover:bg-[var(--k-accent-soft)]"
                    >
                      <AnhDaiDien src={course.instructorAvatar} ten={course.instructorName} className="h-10 w-10" />
                      <span>
                        <span className="block text-xs text-[var(--k-ink-3)]">{t.giangVien}</span>
                        <span className="block text-sm font-semibold text-[var(--k-ink)] group-hover/gv:text-[var(--k-accent)]">{course.instructorName}</span>
                      </span>
                    </Link>
                  ) : (
                    <>
                      <AnhDaiDien src={course.instructorAvatar} ten={course.instructorName || 'CuongHoangDev'} className="h-10 w-10" />
                      <span>
                        <span className="block text-xs text-[var(--k-ink-3)]">{t.giangVien}</span>
                        <span className="block text-sm font-semibold text-[var(--k-ink)]">{course.instructorName || 'CuongHoangDev'}</span>
                      </span>
                    </>
                  )}
                </div>
              </section>
            </div>
          </aside>

          {/* ── Cột chính ── */}
          <div className="min-w-0 space-y-6">
            <PrerequisiteBanner prerequisites={getPrerequisites(course.slug)} />
            <CourseLabCard slug={course.slug} locale={locale} />

            {whatYouLearnList.length > 0 && (
              <section aria-labelledby="hoc-duoc" className={`${s.the} rounded-2xl p-5 sm:p-6`}>
                <h2 id="hoc-duoc" className="mb-5 flex items-center gap-2 font-heading text-xl font-bold text-[var(--k-ink)]">
                  <Award className="h-5 w-5 text-[var(--k-accent)]" aria-hidden />
                  {t.hocDuoc}
                </h2>
                <ul className={`grid gap-x-6 gap-y-3 ${nenMotCot(whatYouLearnList) ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                  {whatYouLearnList.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--k-ink-2)]">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--k-green)]" aria-hidden />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ── Mục lục: chương → bài ── */}
            <section id="noi-dung" aria-labelledby="noi-dung-tieu-de" className={`${s.the} ${s.neo} rounded-2xl p-5 sm:p-6`}>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="noi-dung-tieu-de" className="flex items-center gap-2 font-heading text-xl font-bold text-[var(--k-ink)]">
                    <ListTree className="h-5 w-5 text-[var(--k-accent)]" aria-hidden />
                    {t.mucLuc}
                  </h2>
                  <p className={`${s.so} mt-1 text-sm text-[var(--k-ink-3)]`}>
                    {[t.soChuong(soChuong), sapRaMat ? t.soBaiDuKien(soBai) : t.soBai(soBai), giayVideo >= 60 ? t.videoDai(formatDuration(giayVideo, en)) : '']
                      .filter(Boolean).join(' · ')}
                  </p>
                </div>
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setExpandedSections(moTatCa ? new Set(sections.map((sec) => sec.id)) : new Set())}
                    className="min-h-[40px] rounded-xl px-3 text-sm font-semibold text-[var(--k-accent)] hover:bg-[var(--k-accent-soft)]"
                  >
                    {moTatCa ? t.moTatCa : t.thuGon}
                  </button>
                )}
              </div>

              <ol className="space-y-2.5">
                {sections.map((section) => {
                  const mo = expandedSections.has(section.id);
                  const baiChuong = section.lessons ?? [];
                  const soBaiChuong = baiChuong.length || section.lessonCount || 0;
                  const giayChuong = section.totalDurationSeconds || baiChuong.reduce((tg, l) => tg + (l.videoDurationSeconds || 0), 0);
                  const locked = section.isLocked && !course.hasPaidAccess;
                  const panelId = `chuong-${section.id}`;
                  return (
                    <li key={section.id} className={`${s.theTrong} overflow-hidden rounded-xl`}>
                      <h3>
                        <button
                          type="button"
                          onClick={() => toggleSection(section.id)}
                          aria-expanded={mo}
                          aria-controls={panelId}
                          className={`${s.hangKy} flex w-full items-center gap-3 p-3.5 text-left sm:p-4`}
                        >
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--k-accent-soft)] text-[var(--k-accent)]" aria-hidden>
                            <Layers3 className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold leading-snug text-[var(--k-ink)]">{pickLang(section.title, locale)}</span>
                            <span className={`${s.so} mt-0.5 block text-xs text-[var(--k-ink-3)]`}>
                              {[t.soBai(soBaiChuong), giayChuong >= 60 ? formatDuration(giayChuong, en) : ''].filter(Boolean).join(' · ')}
                            </span>
                          </span>
                          {locked && <Lock className="h-4 w-4 shrink-0 text-[var(--k-ink-3)]" aria-label={t.khoa} />}
                          <ChevronDown className={`h-5 w-5 shrink-0 text-[var(--k-ink-3)] transition-transform motion-reduce:transition-none ${mo ? 'rotate-180' : ''}`} aria-hidden />
                        </button>
                      </h3>
                      {mo && (
                        <ol id={panelId} className="divide-y divide-[var(--k-border)] border-t border-[var(--k-border)]">
                          {baiChuong.map((lesson) => {
                            const kieu = kieuBai(lesson);
                            const noiDung = (
                              <>
                                <span className={`shrink-0 ${locked ? 'text-[var(--k-ink-3)]' : 'text-[var(--k-accent)]'}`} aria-hidden>
                                  {locked ? <Lock className="h-4 w-4" /> : kieu.icon}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-sm leading-snug text-[var(--k-ink)]">{pickLang(lesson.title, locale)}</span>
                                  <span className="mt-0.5 flex flex-wrap items-center gap-x-2.5 text-xs text-[var(--k-ink-3)]">
                                    {!sapRaMat && <span>{kieu.nhan}</span>}
                                    {!sapRaMat && lesson.videoDurationSeconds >= 60 && <span className={s.so}>{formatDuration(lesson.videoDurationSeconds, en)}</span>}
                                    {lesson.isFreePreview && !course.isEnrolled && <span className="font-semibold text-[var(--k-green)]">{t.hocThu}</span>}
                                  </span>
                                </span>
                              </>
                            );
                            return (
                              <li key={lesson.id}>
                                {vaoDuoc && !locked && !sapRaMat ? (
                                  <Link href={duongBai(lesson.id)} className={`${s.hangKy} flex items-center gap-3 px-4 py-3`}>
                                    {noiDung}
                                    <ChevronRight className="h-4 w-4 shrink-0 text-[var(--k-ink-3)]" aria-hidden />
                                  </Link>
                                ) : (
                                  <div className="flex items-center gap-3 px-4 py-3">{noiDung}</div>
                                )}
                              </li>
                            );
                          })}
                        </ol>
                      )}
                    </li>
                  );
                })}
              </ol>

              {!isAuthenticated && !sapRaMat && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--k-accent-line)] bg-[var(--k-accent-soft)] p-4">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 shrink-0 text-[var(--k-accent)]" aria-hidden />
                    <p className="text-sm text-[var(--k-ink-2)]">{t.canDangNhap}</p>
                  </div>
                  <button
                    onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent(`/courses/${course.slug}`)}`)}
                    className="min-h-[40px] shrink-0 rounded-lg px-4 text-sm font-semibold text-white"
                    style={{ background: 'var(--k-grad)' }}
                  >
                    {t.dangNhap}
                  </button>
                </div>
              )}
            </section>

            {course.description && (
              <section aria-labelledby="mo-ta" className={`${s.the} rounded-2xl p-5 sm:p-6`}>
                <h2 id="mo-ta" className="mb-4 font-heading text-xl font-bold text-[var(--k-ink)]">{t.moTa}</h2>
                <CourseDescription html={course.description} />
              </section>
            )}

            {requirementsList.length > 0 && (
              <section aria-labelledby="yeu-cau" className={`${s.the} rounded-2xl p-5 sm:p-6`}>
                <h2 id="yeu-cau" className="mb-4 font-heading text-xl font-bold text-[var(--k-ink)]">{t.yeuCau}</h2>
                <ul className="space-y-2">
                  {requirementsList.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--k-ink-2)]">
                      <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--k-accent)]" aria-hidden />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Reviews & ratings */}
            <section aria-labelledby="danh-gia" className={`${s.the} rounded-2xl p-5 sm:p-6`}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <h2 id="danh-gia" className="flex items-center gap-2 font-heading text-xl font-bold text-[var(--k-ink)]">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden />
                  {t.danhGia}
                </h2>
                {displayReviewCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5" aria-hidden>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.round(displayAvgRating) ? 'fill-amber-400 text-amber-400' : 'text-[var(--k-border-strong)]'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-[var(--k-ink-2)]">{displayAvgRating.toFixed(1)} · {t.danhGiaDem(displayReviewCount)}</span>
                  </div>
                )}
              </div>

              {/* Review form — enrolled learners (or admin) only. Others read-only. */}
              {canReview ? (
                <div className={`${s.theTrong} mb-6 rounded-2xl p-4`}>
                  <p className="mb-2 text-sm font-medium text-[var(--k-ink)]">{t.danhGiaCuaBan}</p>
                  <div className="mb-3 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const val = i + 1;
                      return (
                        <button
                          key={i}
                          type="button"
                          onMouseEnter={() => setReviewHover(val)}
                          onMouseLeave={() => setReviewHover(0)}
                          onClick={() => setReviewRating(val)}
                          className="rounded p-0.5"
                          aria-label={t.saoNhan(val)}
                          aria-pressed={reviewRating === val}
                        >
                          <Star className={`h-7 w-7 transition-colors ${val <= (reviewHover || reviewRating) ? 'fill-amber-400 text-amber-400' : 'text-[var(--k-border-strong)]'}`} />
                        </button>
                      );
                    })}
                    {reviewRating > 0 && <span className="ml-2 text-sm text-[var(--k-ink-3)]">{reviewRating}/5</span>}
                  </div>
                  <label className="sr-only" htmlFor="noi-dung-danh-gia">{t.danhGiaCuaBan}</label>
                  <textarea
                    id="noi-dung-danh-gia"
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    rows={3}
                    placeholder={t.goiYDanhGia}
                    className="mb-3 w-full resize-none rounded-xl border border-[var(--k-border)] bg-[var(--k-card)] px-4 py-3 text-[var(--k-ink)] placeholder:text-[var(--k-ink-3)] focus:border-[var(--k-accent-line)]"
                  />
                  <button
                    onClick={submitReview}
                    disabled={submittingReview || reviewRating < 1}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ background: 'var(--k-grad)' }}
                  >
                    {submittingReview ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Star className="h-4 w-4" aria-hidden />}
                    {t.guiDanhGia}
                  </button>
                </div>
              ) : (
                <div className={`${s.theTrong} mb-6 rounded-xl p-4 text-sm text-[var(--k-ink-3)]`}>{t.canHocDeDanhGia}</div>
              )}

              {reviews.length > 0 ? (
                <ul className="space-y-4">
                  {reviews.map((review) => (
                    <li key={review.id} className="border-b border-[var(--k-border)] pb-4 last:border-0">
                      <div className="mb-2 flex items-center gap-3">
                        <AnhDaiDien src={review.userAvatar} ten={review.userFullName} className="h-9 w-9" />
                        <div>
                          <p className="text-sm font-medium text-[var(--k-ink)]">{review.userFullName}</p>
                          <div className="flex items-center gap-1" aria-label={t.saoNhan(review.rating)}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} aria-hidden className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-[var(--k-border-strong)]'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-[var(--k-ink-3)]">
                          {new Date(review.createdAt).toLocaleDateString(en ? 'en-GB' : 'vi-VN')}
                        </span>
                      </div>
                      {review.title && <p className="mb-1 text-sm font-medium text-[var(--k-ink)]">{review.title}</p>}
                      {review.content && <p className="text-sm text-[var(--k-ink-2)]">{review.content}</p>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--k-ink-3)]">{t.chuaCoDanhGia}</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
