'use client';

/**
 * /pro — the "Update Pro" page. Shows current Pro status, the benefits, and a
 * code-redeem box. Admins see a "you already have everything" note. Guests are
 * prompted to log in before redeeming.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import {
  Crown, Music, Bot, GraduationCap, ClipboardCheck, BadgeCheck, Sparkles, Loader2, Check, ArrowLeft,
  Wallet, CreditCard, Landmark, Copy, AlertCircle, Terminal, Gauge, BookOpen, Languages,
  FileText, Newspaper, Headphones, Zap, Smartphone, KeyRound,
} from 'lucide-react';
import { proApi, proBillingApi, walletApi, newIdempotencyKey, type ProPlan, type BankTransferInfo } from '@/lib/api';
import { usePro } from '@/hooks/usePro';
import { useAuthStore } from '@/store/authStore';

const dongVN = (n: number) => `${n.toLocaleString('vi-VN')} đ`;

/**
 * Quyền lợi Pro — RÀ TỪ MÃ, không liệt kê theo trí nhớ.
 *
 * Mỗi mục dưới đây tương ứng một chốt `isProEffective()` có thật trong
 * backend. Danh sách cũ chỉ có 7 mục và bỏ sót đúng những thứ đắt giá nhất —
 * AI Code trên app desktop, gia sư khi thi, Code Lab, trợ lý đọc bài, và
 * trần token gấp 3,3 lần.
 *
 * ⚠️ Thêm một chốt Pro mới trong backend thì PHẢI thêm một dòng vào đây.
 * Người dùng không mua thứ họ không biết mình được.
 *
 * Nguồn từng mục (13/09/2026):
 *   agent.routes.ts:chiPro ····························· AI Code
 *   ai.service.ts:1205 ································· Chat Pro/Max
 *   course.routes.ts:111,601 + courseTutor.service.ts ··· Academy + gia sư
 *   exam.routes.ts:231 ································· Hỏi CuongMini khi thi
 *   codeLab.coach.service.ts + codeLab.explain.service.ts  Code Lab
 *   cv/proGate.ts ······································ CV Builder
 *   interview.routes.ts:49,167 ························· Interview
 *   myLanguage.routes.ts:174 ··························· My Language
 *   techTrends.routes.ts:495 ··························· Trợ lý đọc bài
 *   voiceHub.routes.ts:178 ····························· Tóm tắt Voice Hub
 *   musicAccess.service.ts ····························· Trang nhạc
 *   interview/llm/index.ts:862-863 ····················· Trần token
 */
/**
 * Link tải app di động. ĐỂ TRỐNG cho tới khi app thật sự lên chợ.
 *
 * ⚠️ Trống thì nút hiện dạng "sắp có" và KHÔNG bấm được. Cố ý: một nút dẫn
 * tới trang 404 trên chính trang bán hàng còn tệ hơn là nói thẳng chưa có.
 * Có link rồi thì chỉ cần điền vào đây, không phải sửa gì khác.
 */
const LINK_APP = {
  ios: '',      // https://apps.apple.com/app/idXXXXXXXXX
  android: '',  // https://play.google.com/store/apps/details?id=...
};

/** Logo Apple — vẽ nội tuyến, không tải ảnh ngoài (nhanh + không phụ thuộc CDN). */
function LogoApple({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.05 12.54c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.19-1.73-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.18-1.54 2.67-.39 6.62 1.11 8.79.73 1.06 1.6 2.25 2.75 2.21 1.1-.05 1.52-.71 2.85-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.94-1.08 2.67-2.15.84-1.23 1.19-2.42 1.21-2.48-.03-.01-2.32-.89-2.34-3.53M14.88 5.66c.61-.74 1.02-1.77.91-2.8-.88.04-1.94.59-2.57 1.32-.56.65-1.05 1.7-.92 2.7.98.08 1.98-.5 2.58-1.22" />
    </svg>
  );
}

/** Logo Google Play — bốn cánh, vẽ nội tuyến. */
function LogoGooglePlay({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#34A853" d="M3.6 2.2 13.8 12 3.6 21.8c-.37-.25-.6-.7-.6-1.28V3.48c0-.58.23-1.03.6-1.28" />
      <path fill="#4285F4" d="M17.2 8.4 13.8 12 3.6 2.2c.32-.22.75-.26 1.2-.02L17.2 8.4" />
      <path fill="#FBBC04" d="M17.2 15.6 4.8 21.82c-.45.24-.88.2-1.2-.02L13.8 12l3.4 3.6" />
      <path fill="#EA4335" d="M21 12c0 .5-.28.97-.85 1.29l-2.95 1.48-3.4-2.77 3.4-3.6 2.95 1.48c.57.32.85.79.85 2.12" />
    </svg>
  );
}

/** Hai nút tải app. Chưa có link ⇒ nút "sắp có", không bấm được. */
function NutTaiApp() {
  const nut = [
    { ten: 'App Store', phu: 'cho iPhone · iPad', link: LINK_APP.ios, Logo: LogoApple, mauChu: 'text-white' },
    { ten: 'Google Play', phu: 'cho Android', link: LINK_APP.android, Logo: LogoGooglePlay, mauChu: 'text-white' },
  ];
  return (
    <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {nut.map(({ ten, phu, link, Logo, mauChu }) => {
        const noiDung = (
          <>
            <Logo className={`w-6 h-6 shrink-0 ${ten === 'App Store' ? mauChu : ''}`} />
            <span className="min-w-0 text-left">
              <span className="block text-[10px] leading-none text-slate-400">
                {link ? 'Tải trên' : 'Sắp có trên'}
              </span>
              <span className="block text-sm font-semibold text-white leading-tight truncate">{ten}</span>
              <span className="block text-[10px] text-slate-500 leading-none mt-0.5">{phu}</span>
            </span>
          </>
        );
        const lop =
          'flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ' +
          (link
            ? 'border-white/15 bg-black/40 hover:border-white/35'
            : 'border-white/10 bg-black/20 opacity-60 cursor-default');
        return link ? (
          <a key={ten} href={link} target="_blank" rel="noopener noreferrer" className={lop}>
            {noiDung}
          </a>
        ) : (
          <div key={ten} className={lop} title="Chưa phát hành">
            {noiDung}
          </div>
        );
      })}
    </div>
  );
}

interface Quyen {
  icon: typeof Crown;
  title: string;
  desc: string;
  /** Gắn nhãn cho thứ người dùng hay không biết là có. */
  badge?: string;
}

const NHOM_QUYEN: Array<{ ten: string; mo: string; mau: string; items: Quyen[] }> = [
  {
    ten: 'AI Code — trên app desktop',
    mo: 'Thứ chỉ Pro mới mở được, và là thứ khác biệt nhất',
    mau: 'from-violet-500/20 to-fuchsia-500/10',
    items: [
      {
        icon: Terminal,
        title: 'Chế độ Lập trình',
        desc: 'Agent đọc và sửa mã ngay trên máy bạn: đọc/ghi file, grep, glob, xem git diff, commit, mở pull request.',
        badge: 'Chỉ Pro',
      },
      {
        icon: Zap,
        title: 'Chạy lệnh & việc nền',
        desc: 'Agent chạy lệnh, theo dõi tiến trình nền, và giao việc cho agent phụ khi việc lớn.',
      },
      {
        icon: KeyRound,
        title: 'CuongMini trên Terminal — API key riêng',
        // ⚠️ Mô tả PHẢI nói rõ hai giới hạn thật, nếu không là quảng cáo sai:
        //   1. web được ưu tiên — `canh` đóng key con khi key chính chạm 70%
        //      cửa sổ 5 giờ (services/cong-llm/canh/canh.mjs);
        //   2. mỗi key có hạn mức riêng mỗi cửa sổ (canh/han-muc.json).
        // Người mua thấy "API key" mà tưởng vô hạn rồi bị 429 giữa việc thì
        // đó là lỗi của câu quảng cáo, không phải của hệ thống.
        desc: 'Xin cấp key riêng để dùng CuongMini trong OpenCode trên máy của bạn — code bằng terminal, không cần mở trình duyệt. Mỗi key có hạn mức riêng theo chu kỳ; khi web đang tải nặng, key cá nhân tạm nhường lượt cho web.',
        badge: 'Chỉ Pro',
      },
      {
        icon: Bot,
        title: 'Chọn model theo việc',
        desc: 'Sonnet 5 (mặc định, rẻ nhất), Opus 4.8 cho việc khó, hoặc GPT khi cần ý kiến thứ hai. Nhãn ghi rõ giá đo thật của từng model.',
      },
    ],
  },
  {
    ten: 'Ứng dụng di động',
    mo: 'iOS · Android — cùng một tài khoản Pro',
    mau: 'from-slate-500/20 to-zinc-500/10',
    items: [
      {
        icon: Smartphone,
        title: 'Mọi tính năng Pro trên điện thoại',
        desc: 'Đăng nhập cùng tài khoản là có đủ quyền Pro trên app — không phải mua riêng, không giới hạn số thiết bị.',
      },
    ],
  },
  {
    ten: 'Học tập',
    mo: 'Academy · Code Lab · phòng thi',
    mau: 'from-emerald-500/20 to-teal-500/10',
    items: [
      { icon: GraduationCap, title: 'Toàn bộ khoá học Academy', desc: 'Mở mọi khoá, không cần nhập mã kích hoạt.' },
      { icon: BookOpen, title: 'Gia sư AI trong bài học', desc: 'Hỏi ngay giữa bài: giải thích đoạn đang đọc, cho ví dụ khác, chữa chỗ chưa hiểu.' },
      { icon: ClipboardCheck, title: 'Hỏi CuongMini khi thi', desc: 'Trong phòng thi /exam, hỏi AI về đúng câu đang làm — giải thích vì sao sai, không chỉ đáp án.', badge: 'Ít người biết' },
      { icon: Terminal, title: 'Code Lab: AI kèm + AI giải thích', desc: 'AI kèm từng bước khi bí, và giải thích vì sao mã của bạn chạy sai thay vì chỉ báo lỗi.', badge: 'Ít người biết' },
    ],
  },
  {
    ten: 'Nghề nghiệp',
    mo: 'CV · phỏng vấn',
    mau: 'from-amber-500/20 to-orange-500/10',
    items: [
      { icon: FileText, title: 'CV Builder — toàn bộ AI', desc: 'AI chấm sâu + soi rủi ro phỏng vấn, viết lại từng dòng, phỏng vấn để lấy nội dung, cover letter, và xuất CV song ngữ Việt–Anh.' },
      { icon: ClipboardCheck, title: 'Interview Simulator — AI chấm', desc: 'Mở khoá "AI chấm" và "AI đầy đủ" khi luyện phỏng vấn, kèm nhận xét từng câu trả lời.' },
    ],
  },
  {
    ten: 'Ngoại ngữ',
    mo: 'My Language — 9 mục luyện',
    mau: 'from-sky-500/20 to-blue-500/10',
    items: [
      { icon: Languages, title: 'Gia sư AI cho mọi kỹ năng', desc: 'Hội thoại, đóng vai, chấm phát âm, chấm bài viết, chữa ngữ pháp, dịch, đọc hiểu, từ vựng và quiz do AI ra đề.' },
    ],
  },
  {
    ten: 'Đọc · nghe',
    mo: 'Trợ lý AI trên nội dung dài',
    mau: 'from-rose-500/20 to-pink-500/10',
    items: [
      { icon: Newspaper, title: 'Trợ lý AI đọc bài', desc: 'Ở /tech-trends: tóm tắt TL;DR, hỏi đáp về bài đang đọc, và giải thích khối mã trong bài.', badge: 'Ít người biết' },
      { icon: Headphones, title: 'Tóm tắt AI ở Voice Hub', desc: 'Nắm nội dung một tập dài trước khi quyết định nghe hết.', badge: 'Ít người biết' },
      { icon: Music, title: 'Trang nhạc mở vĩnh viễn', desc: 'Vào /music bất cứ lúc nào, không cần admin cấp quyền.' },
    ],
  },
  {
    ten: 'Hạn mức & nhận diện',
    mo: 'Sử dụng tẹt ga không lo về giá',
    mau: 'from-indigo-500/20 to-violet-500/10',
    items: [
      {
        icon: Gauge,
        title: 'Hạn mức AI rộng rãi',
        // ⚠️ CỐ Ý không ghi con số token cụ thể (chủ web yêu cầu 13/09/2026).
        // Con số in trên trang bán hàng là một lời hứa: hạ trần sau này thì
        // thành nói sai, mà giữ nguyên thì mất quyền điều chỉnh theo giá vốn.
        // Trần thật vẫn nằm ở INTERVIEW_DAILY_TOKEN_CAP — đổi bằng env,
        // không cần sửa mã và không cần đụng tới trang này.
        desc: 'Dùng thoải mái mọi tính năng AI trên web và app — hạn mức cao hơn hẳn tài khoản thường, không phải dè chừng từng lượt hỏi.',
        badge: 'Tẹt ga',
      },
      { icon: Bot, title: 'AI Chat bậc Pro & Max', desc: 'Dùng CuongMini Pro (Sonnet) và Max (Opus) — bậc Max là nơi duy nhất gửi được ảnh và PDF.' },
      { icon: BadgeCheck, title: 'Huy hiệu PRO', desc: 'Khung avatar và nhãn PRO hiện ở hồ sơ, bình luận và bảng xếp hạng.' },
    ],
  },
];

/** Tổng số quyền lợi — hiện ở hero để con số tự nói. */
const TONG_QUYEN = NHOM_QUYEN.reduce((n, g) => n + g.items.length, 0);

export default function ProPage() {
  const { status, isPro, isLoading, refetch } = usePro();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const qc = useQueryClient();
  const router = useRouter();
  const params = useSearchParams();
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Mua gói Pro (13/09/2026) ──
  const [plans, setPlans] = useState<ProPlan[]>([]);
  const [payosSan, setPayosSan] = useState(true);
  const [soDu, setSoDu] = useState<number | null>(null);
  const [chonGoi, setChonGoi] = useState<string | null>(null);
  const [cachTra, setCachTra] = useState<'POINTS' | 'PAYOS' | 'BANK_TRANSFER'>('POINTS');
  const [dangMua, setDangMua] = useState(false);
  const [bank, setBank] = useState<BankTransferInfo | null>(null);
  const [chep, setChep] = useState<string | null>(null);

  // Cùng ba lớp chống bấm-hai-lần như ở checkout: ref khoá ngay, khoá
  // idempotency sống sót qua cả việc tải lại trang.
  const khoaMua = useRef(false);
  const khoaIdem = useRef<string>('');

  useEffect(() => {
    proBillingApi.plans()
      .then((r) => { setPlans(r.data.data.plans); setPayosSan(r.data.data.payosAvailable); })
      .catch(() => {});
  }, []);

  const napSoDu = useCallback(() => {
    if (!isAuthenticated) { setSoDu(null); return; }
    walletApi.balance().then((r) => setSoDu(r.data.data.balance)).catch(() => setSoDu(null));
  }, [isAuthenticated]);
  useEffect(() => { napSoDu(); }, [napSoDu]);

  // Không có ví hoặc ví rỗng thì mặc định sang cổng, khỏi bắt người dùng
  // phát hiện "trả bằng điểm" đang bị khoá rồi tự đổi.
  useEffect(() => {
    if (soDu !== null && soDu === 0) setCachTra(payosSan ? 'PAYOS' : 'BANK_TRANSFER');
  }, [soDu, payosSan]);

  /**
   * Quay về từ PayOS (`?order=<mã>`). Hỏi lại vài nhịp vì webhook của cổng
   * có thể chậm hơn trình duyệt.
   */
  useEffect(() => {
    const ma = params.get('order');
    if (!ma || !isAuthenticated) return;
    let huy = false;
    let lan = 0;
    const hoi = async () => {
      if (huy) return;
      try {
        const r = await proBillingApi.getOrder(ma);
        if (r.data.data.granted) {
          toast.success('🎉 Thanh toán thành công! Tài khoản của bạn đã lên Pro.');
          await refetch();
          qc.invalidateQueries({ queryKey: ['pro-status'] });
          qc.invalidateQueries({ queryKey: ['music-access'] });
          router.replace('/pro');
          return;
        }
      } catch { /* đơn không thuộc về mình — bỏ qua */ }
      if (++lan < 8 && !huy) setTimeout(hoi, 2000);
    };
    hoi();
    return () => { huy = true; };
  }, [params, isAuthenticated, refetch, qc, router]);

  const goiDangChon = plans.find((p) => p.code === chonGoi) ?? null;
  const duDiem = soDu !== null && goiDangChon !== null && soDu >= goiDangChon.pointsRequired;

  const muaGoi = async () => {
    if (khoaMua.current || !goiDangChon) return;
    if (!isAuthenticated) { toast.warning('Vui lòng đăng nhập trước khi mua gói.'); return; }
    khoaMua.current = true;
    setDangMua(true);
    if (!khoaIdem.current) khoaIdem.current = newIdempotencyKey();
    try {
      const r = await proBillingApi.createOrder(goiDangChon.code, cachTra, khoaIdem.current);
      const { order, granted, bank: bankData } = r.data.data;

      if (granted) {
        toast.success(`🎉 Đã nâng cấp ${goiDangChon.name}!`);
        khoaIdem.current = '';
        setChonGoi(null);
        napSoDu();
        await refetch();
        qc.invalidateQueries({ queryKey: ['pro-status'] });
        qc.invalidateQueries({ queryKey: ['music-access'] });
        return;
      }
      if (cachTra === 'BANK_TRANSFER') {
        setBank(bankData);
        khoaIdem.current = '';
        toast.success('Đã tạo yêu cầu. Quét mã QR để chuyển khoản.');
        return;
      }
      const link = await proBillingApi.payosLink(order.orderCode);
      const url = link.data.data?.checkoutUrl;
      if (!url) throw new Error('Không tạo được liên kết thanh toán');
      window.location.href = url;
      await new Promise(() => {}); // giữ khoá tới khi rời trang
    } catch (e) {
      const loi = e as { response?: { data?: { message?: string } } };
      toast.error(loi.response?.data?.message || 'Không mua được gói. Vui lòng thử lại.');
    } finally {
      khoaMua.current = false;
      setDangMua(false);
    }
  };

  const chepChu = async (chu: string, nhan: string) => {
    try {
      await navigator.clipboard.writeText(chu);
      setChep(nhan);
      setTimeout(() => setChep(null), 1800);
    } catch { toast.error('Trình duyệt không cho chép tự động — vui lòng chép tay.'); }
  };

  const redeem = async () => {
    if (!code.trim()) { toast.warning('Nhập mã Pro'); return; }
    setSubmitting(true);
    try {
      await proApi.redeem(code.trim());
      toast.success('🎉 Chúc mừng! Tài khoản của bạn đã được nâng cấp Pro.');
      setCode('');
      await refetch();
      qc.invalidateQueries({ queryKey: ['pro-status'] });
      qc.invalidateQueries({ queryKey: ['music-access'] });
    } catch (e) {
      const loi = e as { response?: { status?: number; data?: { message?: string } } };
      /* 401 ở đây KHÔNG phải "mã sai" — là chưa có phiên hợp lệ ở máy chủ.
       * Nói nhầm thành "mã sai" khiến người dùng đi hỏi lại mã mới, trong khi
       * việc cần làm là đăng nhập lại. Đúng cái đã xảy ra 19/08/2026 với người
       * đăng nhập bằng Google mà backend chưa tạo được tài khoản. */
      if (loi.response?.status === 401) {
        toast.error('Phiên đăng nhập chưa hợp lệ. Hãy đăng xuất rồi đăng nhập lại, sau đó nhập mã.');
      } else {
        toast.error(loi.response?.data?.message || 'Mã không hợp lệ hoặc đã hết lượt.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const expiryLabel = status.lifetime
    ? 'Vĩnh viễn'
    : status.expiresAt
      ? `đến ${new Date(status.expiresAt).toLocaleDateString('vi-VN')}`
      : '';

  return (
    <div className="relative min-h-screen pt-20 pb-16 px-4 overflow-hidden" style={{ background: 'var(--bg-primary, #0a0a0f)' }}>
      <NenDong />
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6"><ArrowLeft className="w-4 h-4" /> Trang chủ</Link>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 bg-gradient-to-br from-amber-400 via-amber-500 to-violet-500 shadow-[0_8px_40px_rgba(245,158,11,0.35)]">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            CuongThai <span className="bg-gradient-to-r from-amber-300 to-violet-300 bg-clip-text text-transparent">PRO</span>
          </h1>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            {TONG_QUYEN} quyền lợi trên web và app desktop — trong đó có{' '}
            <b className="text-violet-300">AI Code</b>, agent đọc và sửa mã ngay trên máy bạn.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-5 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Không tự động gia hạn</span>
            <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Cộng dồn khi mua tiếp</span>
            <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Dùng được ngay sau thanh toán</span>
          </div>
        </div>

        {/* Status banner */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-slate-400 mb-8"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải…</div>
        ) : status.isAdmin ? (
          <div className="rounded-2xl border border-violet-500/40 bg-violet-500/10 p-5 mb-8 flex items-center gap-3">
            <Crown className="w-6 h-6 text-violet-300 shrink-0" />
            <div>
              <div className="font-semibold text-violet-200">Bạn là Admin — cấp cao nhất</div>
              <p className="text-sm text-violet-200/70">Tài khoản admin mặc định có toàn bộ quyền Pro, không cần nhập mã.</p>
            </div>
          </div>
        ) : isPro ? (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 mb-8 flex items-center gap-3">
            <BadgeCheck className="w-6 h-6 text-emerald-300 shrink-0" />
            <div>
              <div className="font-semibold text-emerald-200">Bạn đang là thành viên PRO ✨</div>
              <p className="text-sm text-emerald-200/70">Thời hạn: <b>{expiryLabel}</b>. Cảm ơn bạn đã ủng hộ!</p>
            </div>
          </div>
        ) : null}

        {/* ═══ Quyền lợi — gom theo nhóm ═══ */}
        <div className="space-y-6 mb-10">
          {NHOM_QUYEN.map((g) => (
            <div key={g.ten}>
              <div className="flex items-baseline gap-3 mb-3 flex-wrap">
                <h2 className="text-lg font-bold text-white">{g.ten}</h2>
                <span className="text-xs text-slate-500">{g.mo}</span>
              </div>
              {/* AI Code chỉ chạy trên app desktop — người mua Pro vì nó cần
                  biết lấy app ở đâu, nếu không họ trả tiền rồi đi tìm. */}
              {g.ten === 'Ứng dụng di động' && <NutTaiApp />}
              {g.ten.startsWith('AI Code') && (
                <Link
                  href="/download"
                  className="mb-3 flex items-center gap-3 rounded-xl border border-violet-400/30 bg-violet-500/[0.08] p-3 hover:border-violet-400/60 transition-colors group"
                >
                  <Terminal className="w-4 h-4 text-violet-300 shrink-0" />
                  <span className="text-xs text-slate-300 flex-1 min-w-0">
                    Chạy trên <b className="text-white">app desktop</b> (macOS · Windows) — không có trên trình duyệt.
                  </span>
                  <span className="text-xs font-semibold text-violet-300 whitespace-nowrap group-hover:underline">
                    Tải app →
                  </span>
                </Link>
              )}
              {/* Lối vào trang xin key + hướng dẫn cắm OpenCode. Không có link
                  này thì người mua đọc xong quyền lợi mà không biết đi đâu. */}
              {g.ten.startsWith('AI Code') && (
                <Link
                  href="/llm-key"
                  className="mb-3 flex items-center gap-3 rounded-xl border border-emerald-400/25 bg-emerald-500/[0.07] p-3 hover:border-emerald-400/55 transition-colors group"
                >
                  <KeyRound className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span className="text-xs text-slate-300 flex-1 min-w-0">
                    Muốn dùng AI trong <b className="text-white">terminal</b>? Xin key + xem hướng dẫn cắm OpenCode.
                  </span>
                  <span className="text-xs font-semibold text-emerald-300 whitespace-nowrap group-hover:underline">
                    Xin key →
                  </span>
                </Link>
              )}
              <div className="grid sm:grid-cols-2 gap-3">
                {g.items.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.title}
                      className={`relative rounded-2xl border border-white/10 bg-gradient-to-br ${g.mau} p-4 flex gap-3 transition-colors hover:border-white/20`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-amber-300" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-white text-sm">{b.title}</span>
                          {b.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold whitespace-nowrap">
                              {b.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{b.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ═══ Bảng giá (13/09/2026) ═══ */}
        {plans.length > 0 && (
          <div className="mb-8">
            <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
              <h2 className="text-xl font-bold text-white">
                {isPro ? 'Gia hạn Pro' : 'Chọn gói'}
              </h2>
              {soDu !== null && (
                <Link href="/wallet" className="text-sm text-slate-400 hover:text-amber-300 inline-flex items-center gap-1.5">
                  <Wallet className="w-4 h-4" />
                  Ví: <b className="text-white tabular-nums">{soDu.toLocaleString('vi-VN')}</b> điểm
                </Link>
              )}
            </div>

            {/* Thẻ gói. Con số so sánh được là GIÁ MỖI THÁNG — đó là thứ
                duy nhất đặt bốn gói khác kỳ hạn lên cùng một thước đo, nên
                nó được in to nhất, không phải tổng tiền. */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5 pt-3">
              {plans.map((p) => {
                const chon = chonGoi === p.code;
                const readu = soDu !== null && soDu >= p.pointsRequired;
                return (
                  <button
                    key={p.code}
                    onClick={() => { setChonGoi(p.code); setBank(null); }}
                    className={`group relative text-left rounded-2xl border p-4 pt-5 transition-all duration-200 ${
                      chon
                        ? 'border-amber-400 bg-gradient-to-b from-amber-500/[0.14] to-transparent shadow-[0_0_0_1px_rgba(251,191,36,.45),0_10px_40px_-12px_rgba(251,191,36,.35)] -translate-y-0.5'
                        : p.popular
                        ? 'border-violet-400/40 bg-gradient-to-b from-violet-500/[0.10] to-transparent hover:border-amber-500/50 hover:-translate-y-0.5'
                        : 'border-white/10 bg-white/[0.03] hover:border-amber-500/40 hover:-translate-y-0.5'
                    }`}
                  >
                    {p.badge && (
                      <span className={`absolute -top-2.5 left-4 text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${
                        p.popular ? 'bg-gradient-to-r from-amber-400 to-violet-500 text-white shadow-lg shadow-violet-500/30' : 'bg-white/10 text-slate-300'
                      }`}>
                        {p.badge}
                      </span>
                    )}

                    <div className="text-sm text-slate-400">{p.months} tháng</div>

                    {/* Giá mỗi tháng — con số to nhất */}
                    <div className="flex items-baseline gap-1 mt-1.5">
                      <span className="text-2xl font-bold text-white tabular-nums">
                        {p.pricePerMonthVnd.toLocaleString('vi-VN')}
                      </span>
                      <span className="text-xs text-slate-400">đ/tháng</span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/10 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500">Trả một lần</span>
                        <span className="text-white font-semibold tabular-nums">{dongVN(p.priceVnd)}</span>
                      </div>
                      {p.originalPriceVnd && p.originalPriceVnd > p.priceVnd ? (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-500 line-through tabular-nums">{dongVN(p.originalPriceVnd)}</span>
                          <span className="text-emerald-400 font-semibold">tiết kiệm {p.savingPercent}%</span>
                        </div>
                      ) : (
                        <div className="text-slate-600">giá gốc</div>
                      )}
                    </div>

                    {/* Đủ điểm hay không — nói ngay ở thẻ, đừng để người dùng
                        chọn gói rồi mới phát hiện ví không đủ. */}
                    {soDu !== null && (
                      <div className={`mt-2 text-[11px] inline-flex items-center gap-1 ${readu ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <Wallet className="w-3 h-3" />
                        {readu ? 'Ví đủ điểm' : `Cần ${p.pointsRequired.toLocaleString('vi-VN')} điểm`}
                      </div>
                    )}

                    {chon && <Check className="absolute top-3 right-3 w-4 h-4 text-amber-400" />}
                  </button>
                );
              })}
            </div>

            {goiDangChon && !bank && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
                  <span className="text-white font-semibold">{goiDangChon.name}</span>
                  <span className="text-slate-400 text-sm">
                    {isPro ? 'Cộng thêm' : 'Hiệu lực'} {goiDangChon.months * 30} ngày
                  </span>
                </div>
                {isPro && (
                  <p className="text-xs text-emerald-300/80 mb-4">
                    Bạn đang là Pro — số ngày này được <b>cộng dồn</b> vào hạn hiện tại, không thay thế.
                  </p>
                )}

                <div className="grid sm:grid-cols-3 gap-2.5 mb-4">
                  {([
                    {
                      id: 'POINTS' as const, Icon: Wallet, ten: 'Ví điểm',
                      mo: soDu === null ? 'Cần đăng nhập'
                        : duDiem ? `Trừ ${goiDangChon.pointsRequired.toLocaleString('vi-VN')} điểm`
                        : `Thiếu ${(goiDangChon.pointsRequired - soDu).toLocaleString('vi-VN')} điểm`,
                      dung: !!duDiem,
                    },
                    { id: 'PAYOS' as const, Icon: CreditCard, ten: 'PayOS', mo: 'Tự động xác nhận', dung: payosSan },
                    { id: 'BANK_TRANSFER' as const, Icon: Landmark, ten: 'Chuyển khoản', mo: 'Admin duyệt', dung: true },
                  ]).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => c.dung && setCachTra(c.id)}
                      disabled={!c.dung}
                      className={`rounded-xl border p-3 text-left transition-all ${
                        cachTra === c.id ? 'border-amber-400 bg-amber-500/10' : 'border-white/10 bg-black/20 hover:border-amber-500/40'
                      } ${!c.dung ? 'opacity-45 cursor-not-allowed' : ''}`}
                    >
                      <c.Icon className={`w-4 h-4 mb-1.5 ${cachTra === c.id ? 'text-amber-300' : 'text-slate-400'}`} />
                      <div className="text-sm font-medium text-white">{c.ten}</div>
                      <div className="text-xs text-slate-400 break-words">{c.mo}</div>
                    </button>
                  ))}
                </div>

                {cachTra === 'POINTS' && !duDiem && (
                  <Link
                    href="/wallet"
                    className="mb-3 flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/25 rounded-lg p-3"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    Ví chưa đủ điểm — bấm để nạp thêm.
                  </Link>
                )}

                <button
                  onClick={muaGoi}
                  disabled={dangMua || !isAuthenticated || (cachTra === 'POINTS' && !duDiem)}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-violet-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {dangMua
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý…</>
                    : <><Crown className="w-4 h-4" /> {isPro ? 'Gia hạn' : 'Nâng cấp'} — {dongVN(goiDangChon.priceVnd)}</>}
                </button>

                {!isAuthenticated && (
                  <Link href="/login?redirect=/pro" className="mt-3 block text-center text-sm text-amber-300 hover:underline">
                    Đăng nhập để mua gói
                  </Link>
                )}
              </div>
            )}

            {bank && (
              <div className="rounded-2xl border border-amber-500/30 bg-black/20 p-5">
                <p className="text-white font-semibold mb-4">Quét mã để chuyển khoản</p>
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                  <div className="bg-white p-3 rounded-xl flex-shrink-0">
                    <QRCodeSVG value={bank.qrString} size={168} level="M" />
                  </div>
                  <div className="flex-1 w-full space-y-2.5 text-sm">
                    {[
                      { nhan: 'Ngân hàng', gt: bank.bank.name ?? '—', c: false },
                      { nhan: 'Số tài khoản', gt: bank.bank.accountNo ?? '—', c: true },
                      { nhan: 'Chủ tài khoản', gt: bank.bank.accountName ?? '—', c: false },
                      { nhan: 'Số tiền', gt: dongVN(bank.amountVnd), c: true },
                      { nhan: 'Nội dung', gt: bank.noiDungChuyenKhoan, c: true },
                    ].map((d) => (
                      <div key={d.nhan} className="flex items-center justify-between gap-3">
                        <span className="text-slate-400 text-xs flex-shrink-0">{d.nhan}</span>
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-white truncate">{d.gt}</span>
                          {d.c && (
                            <button
                              onClick={() => chepChu(d.nhan === 'Số tiền' ? String(bank.amountVnd) : d.gt, d.nhan)}
                              className="text-slate-400 hover:text-amber-300 flex-shrink-0"
                              aria-label={`Chép ${d.nhan}`}
                            >
                              {chep === d.nhan ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-2 text-xs text-slate-400 bg-black/30 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <b className="text-amber-300">Ghi đúng nội dung “{bank.noiDungChuyenKhoan}”</b> khi chuyển.
                    Pro được kích hoạt sau khi admin xác nhận đã nhận tiền.
                  </span>
                </div>
                <button
                  onClick={() => { setBank(null); setChonGoi(null); }}
                  className="mt-4 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white hover:border-amber-500/40"
                >
                  Xong
                </button>
              </div>
            )}
          </div>
        )}

        {/* Redeem */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/[0.06] to-transparent p-5">
          <div className="flex items-center gap-2 mb-1 text-white font-semibold"><Sparkles className="w-4 h-4 text-amber-300" /> {isPro ? 'Gia hạn / nhập mã khác' : 'Kích hoạt Pro bằng mã'}</div>
          <p className="text-xs text-slate-400 mb-4">Nhập mã Pro do admin cấp. Chưa có mã? Liên hệ admin để được cấp.</p>

          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => { if (e.key === 'Enter') redeem(); }}
                placeholder="VD: PRO-XXXXXXXX"
                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono tracking-wider placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
              />
              <button
                onClick={redeem}
                disabled={submitting || !code.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-amber-500 to-violet-500 hover:opacity-90 disabled:opacity-50 transition"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Kích hoạt
              </button>
            </div>
          ) : (
            <Link href="/login?redirect=/pro" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-amber-500 to-violet-500 hover:opacity-90 transition">
              Đăng nhập để kích hoạt
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Nền động cho trang Pro.
 *
 * Ba lớp CSS thuần — KHÔNG canvas, KHÔNG thư viện:
 *   1. hai quầng sáng trôi chậm (aurora)
 *   2. lưới mờ dần về đáy
 *   3. vài đốm sáng nổi lên rồi tắt
 *
 * ⚠️ Tôn trọng `prefers-reduced-motion`: người bật tuỳ chọn đó thường vì
 * chuyển động làm họ chóng mặt hoặc đau đầu — nền trang trí là thứ đầu tiên
 * phải đứng yên. Lúc đó vẫn giữ nguyên màu, chỉ tắt animation.
 *
 * `pointer-events-none` để nền không bao giờ nuốt cú bấm của người dùng, và
 * `aria-hidden` để trình đọc màn hình bỏ qua.
 */
function NenDong() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes proTroi1 {
          0%,100% { transform: translate(-8%, -6%) scale(1); }
          50%     { transform: translate(6%, 4%)  scale(1.15); }
        }
        @keyframes proTroi2 {
          0%,100% { transform: translate(6%, 4%)  scale(1.1); }
          50%     { transform: translate(-6%, -4%) scale(0.95); }
        }
        @keyframes proNoiLen {
          0%   { transform: translateY(0)      scale(0.6); opacity: 0; }
          15%  { opacity: .55; }
          85%  { opacity: .2; }
          100% { transform: translateY(-320px) scale(1.1); opacity: 0; }
        }
        .pro-quang-1 { animation: proTroi1 22s ease-in-out infinite; }
        .pro-quang-2 { animation: proTroi2 28s ease-in-out infinite; }
        .pro-dom     { animation: proNoiLen linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .pro-quang-1, .pro-quang-2, .pro-dom { animation: none !important; }
          .pro-dom { opacity: .25; }
        }
      `}</style>

      {/* Quầng sáng */}
      <div
        className="pro-quang-1 absolute -top-40 left-1/4 w-[620px] h-[620px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.28), transparent 62%)', filter: 'blur(90px)' }}
      />
      <div
        className="pro-quang-2 absolute -bottom-48 right-1/4 w-[560px] h-[560px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.20), transparent 62%)', filter: 'blur(100px)' }}
      />

      {/* Lưới, mờ dần xuống đáy */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.16) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          maskImage: 'linear-gradient(to bottom, black, transparent 72%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 72%)',
        }}
      />

      {/* Đốm sáng nổi lên. Vị trí/nhịp cố định — Math.random() ở đây sẽ cho
          kết quả KHÁC nhau giữa máy chủ và trình duyệt và gây lỗi hydration. */}
      {[
        { l: '12%', d: 0,   t: 13, s: 3 },
        { l: '27%', d: 2.5, t: 16, s: 2 },
        { l: '41%', d: 5,   t: 14, s: 4 },
        { l: '58%', d: 1.2, t: 18, s: 2 },
        { l: '73%', d: 6.5, t: 15, s: 3 },
        { l: '88%', d: 3.8, t: 17, s: 2 },
      ].map((d) => (
        <span
          key={d.l}
          className="pro-dom absolute bottom-0 rounded-full"
          style={{
            left: d.l,
            width: d.s,
            height: d.s,
            background: 'rgba(196,181,253,.9)',
            boxShadow: '0 0 8px rgba(167,139,250,.8)',
            animationDuration: `${d.t}s`,
            animationDelay: `${d.d}s`,
          }}
        />
      ))}
    </div>
  );
}
