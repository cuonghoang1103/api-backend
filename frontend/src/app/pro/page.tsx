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
  Wallet, CreditCard, Landmark, Copy, AlertCircle,
} from 'lucide-react';
import { proApi, proBillingApi, walletApi, newIdempotencyKey, type ProPlan, type BankTransferInfo } from '@/lib/api';
import { usePro } from '@/hooks/usePro';
import { useAuthStore } from '@/store/authStore';

const dongVN = (n: number) => `${n.toLocaleString('vi-VN')} đ`;

const BENEFITS = [
  { icon: Music, title: 'Trang nhạc mở vĩnh viễn', desc: 'Không cần admin cấp quyền — vào /music bất cứ lúc nào.' },
  { icon: Bot, title: 'AI Chat Pro & Max', desc: 'Dùng CuongMini Pro (Sonnet) và Max (Opus) không giới hạn.' },
  { icon: ClipboardCheck, title: 'Interview AI chấm điểm', desc: 'Mở khoá "AI chấm" và "AI đầy đủ" khi luyện phỏng vấn.' },
  // NEW (2026-07-16): the two AI-heavy modules are Pro entitlements.
  { icon: Sparkles, title: 'CV Builder — toàn bộ AI', desc: 'AI chấm sâu + rủi ro phỏng vấn, AI viết lại từng dòng, AI phỏng vấn lấy nội dung, cover letter và xuất CV song ngữ Việt–Anh.' },
  { icon: Bot, title: 'My Language — gia sư AI', desc: 'Gia sư giải thích, chấm phát âm, quiz AI, chấm bài viết và role-play hội thoại.' },
  { icon: GraduationCap, title: 'Full khoá học Academy', desc: 'Truy cập mọi khoá học, không cần nhập mã kích hoạt.' },
  { icon: BadgeCheck, title: 'Huy hiệu PRO', desc: 'Khung avatar + logo gắn nhãn PRO nổi bật, khác biệt.' },
];

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
    <div className="min-h-screen pt-20 pb-16 px-4" style={{ background: 'radial-gradient(1200px 600px at 50% -10%, rgba(139,92,246,0.15), transparent), var(--bg-primary, #0a0a0f)' }}>
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
          <p className="text-slate-400 mt-2">Mở khoá toàn bộ tính năng cao cấp của web.</p>
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

        {/* Benefits */}
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-violet-500/20 border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="font-medium text-white text-sm">{b.title}</div>
                  <p className="text-xs text-slate-400 mt-0.5">{b.desc}</p>
                </div>
              </div>
            );
          })}
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

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              {plans.map((p) => {
                const chon = chonGoi === p.code;
                return (
                  <button
                    key={p.code}
                    onClick={() => { setChonGoi(p.code); setBank(null); }}
                    className={`relative text-left rounded-2xl border p-4 transition-all ${
                      chon
                        ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_0_1px_rgba(251,191,36,0.35)]'
                        : 'border-white/10 bg-white/[0.03] hover:border-amber-500/40'
                    }`}
                  >
                    {p.badge && (
                      <span className={`absolute -top-2.5 left-4 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        p.popular ? 'bg-gradient-to-r from-amber-400 to-violet-500 text-white' : 'bg-white/10 text-slate-300'
                      }`}>
                        {p.badge}
                      </span>
                    )}
                    <div className="text-sm text-slate-400 mb-1">{p.months} tháng</div>
                    <div className="text-2xl font-bold text-white tabular-nums">{dongVN(p.priceVnd)}</div>
                    {p.originalPriceVnd && p.originalPriceVnd > p.priceVnd && (
                      <div className="text-xs text-slate-500 line-through tabular-nums mt-0.5">
                        {dongVN(p.originalPriceVnd)}
                      </div>
                    )}
                    <div className="text-xs text-amber-300/90 mt-2 tabular-nums">
                      ≈ {dongVN(p.pricePerMonthVnd)}/tháng
                    </div>
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
