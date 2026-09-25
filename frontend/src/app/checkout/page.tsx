'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ShieldCheck, CreditCard, Tag,
  CheckCircle, XCircle, AlertCircle, Package,
  BookOpen, Loader2, Wallet, Landmark, Copy, Check,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import {
  createOrder as apiCreateOrder, validateDiscount, createShopPayos, getShippingConfig,
  payShopOrderWithPoints, createShopBankTransfer, getBankTransferConfig, getWalletBalance,
  type BankTransferPayload,
} from '@/lib/api/shop';
import { useDaDangNhap } from '@/hooks/useDaDangNhap';
import type { BuyerInfo } from '@/types';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}

type CheckoutStep = 'info' | 'payment';
type PayMethod = 'PAYOS' | 'POINTS' | 'BANK_TRANSFER';

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<CheckoutStep>('info');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    message: string;
  } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Chống bấm hai lần / tạo trùng đơn ────────────────────────────────
  //
  // Ba lớp, mỗi lớp bắt một tình huống khác nhau:
  //
  //  1. `isProcessing` khoá nút — chặn cú bấm thứ hai của người dùng.
  //     KHÔNG đủ: React đặt state bất đồng bộ, hai cú bấm cách nhau vài
  //     mili giây vẫn lọt cả hai qua trước khi nút kịp đổi trạng thái.
  //  2. `submitLock` là một ref — đổi NGAY LẬP TỨC, không đợi render. Đây
  //     mới là thứ chặn được cú đúp thật sự.
  //  3. `idempotencyKey` chặn ở phía server: mạng chậm, người dùng tải lại
  //     trang rồi bấm lại, hoặc trình duyệt tự gửi lại request — cùng khoá
  //     thì backend trả về ĐÚNG đơn cũ. Đây là lớp duy nhất sống sót qua
  //     việc tải lại trang.
  const submitLock = useRef(false);
  const idempotencyKey = useRef<string>('');
  if (!idempotencyKey.current) {
    idempotencyKey.current =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `ck-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  // Đơn đã tạo ở backend. Giữ lại để lần thử thanh toán thứ hai KHÔNG tạo
  // đơn mới — người mua đổi ý từ PayOS sang chuyển khoản vẫn là một đơn.
  const [backendOrderCode, setBackendOrderCode] = useState<string | null>(null);

  const [payMethod, setPayMethod] = useState<PayMethod>('PAYOS');
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [bankEnabled, setBankEnabled] = useState(false);
  const [bankInfo, setBankInfo] = useState<BankTransferPayload | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Xem hooks/useDaDangNhap.ts — nếu không, người ĐANG đăng nhập sẽ bị
  // chặn ở nút thanh toán kèm câu "Cần đăng nhập để đặt hàng".
  const { daDangNhap: isAuthenticated } = useDaDangNhap();

  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [province, setProvince] = useState('');
  const [shipCfg, setShipCfg] = useState({ flatFee: 30000, freeThreshold: 500000 });

  const [errors, setErrors] = useState<Partial<BuyerInfo>>({});

  useEffect(() => {
    setMounted(true);
    getShippingConfig().then(setShipCfg).catch(() => {});
    // Cấu hình chuyển khoản là CÔNG KHAI — gọi được kể cả khi chưa đăng nhập.
    getBankTransferConfig()
      .then((r) => setBankEnabled(!!r.data?.enabled))
      .catch(() => setBankEnabled(false));
  }, []);

  // Số dư ví chỉ có nghĩa khi đã đăng nhập.
  useEffect(() => {
    if (!isAuthenticated) { setWalletBalance(null); return; }
    getWalletBalance()
      .then((r) => setWalletBalance(r.data?.balance ?? 0))
      .catch(() => setWalletBalance(null));
  }, [isAuthenticated]);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/cart');
    }
  }, [mounted, items.length, router]);

  const shopItems = items.filter((i) => i.itemType === 'shop');
  const academyItems = items.filter((i) => i.itemType === 'academy');

  const subtotal = getTotalPrice();
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const goodsTotal = Math.max(0, subtotal - discountAmount);
  // Any physical item → shipping applies (waived over the free-ship threshold).
  // This is a display estimate; the backend recomputes the charged total.
  const hasPhysical = shopItems.some((i) => (i.product as { productType?: string }).productType === 'PHYSICAL');
  const shippingFee = hasPhysical && goodsTotal < shipCfg.freeThreshold ? shipCfg.flatFee : 0;
  const total = goodsTotal + shippingFee;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-darkbg pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    setAppliedCoupon(null);
    try {
      const result = await validateDiscount(couponInput.trim());
      if (result.valid) {
        const discountAmt = result.discountAmount || Math.round(
          result.discountType === 'PERCENT'
            ? subtotal * (result.discountValue || 0) / 100
            : (result.discountValue || 0)
        );
        setAppliedCoupon({
          code: couponInput.trim().toUpperCase(),
          discountAmount: discountAmt,
          message: result.message || t('checkout.couponApplied'),
        });
        toast.success(result.message || t('checkout.couponApplied'));
      } else {
        setCouponError(result.message);
      }
    } catch {
      setCouponError(t('checkout.couponError'));
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  const validateInfo = (): boolean => {
    const newErrors: Partial<BuyerInfo> = {};
    if (!buyerInfo.fullName.trim()) {
      newErrors.fullName = t('checkout.requiredField');
    }
    if (!buyerInfo.email.trim()) {
      newErrors.email = t('checkout.requiredField');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerInfo.email)) {
      newErrors.email = t('checkout.invalidEmail');
    }
    if (buyerInfo.phone && !/^[\d\s\-+()]{8,}$/.test(buyerInfo.phone)) {
      newErrors.phone = t('checkout.invalidPhone');
    }
    // Physical goods need a delivery address + phone.
    if (hasPhysical) {
      if (!buyerInfo.address?.trim()) newErrors.address = 'Vui lòng nhập địa chỉ giao hàng';
      if (!buyerInfo.phone?.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại nhận hàng';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (validateInfo()) {
      setStep('payment');
    }
  };

  /**
   * Tạo đơn ở backend — hoặc trả lại đơn đã tạo trước đó.
   *
   * Backend TỰ TÍNH LẠI giá, giảm giá và phí ship từ DB. Con số hiển thị ở
   * đây chỉ để người dùng xem; sửa giá trong DevTools không đổi được số tiền
   * thật phải trả.
   */
  const createBackendOrder = async (): Promise<string> => {
    // Đã có đơn rồi thì dùng lại — đổi cách thanh toán không đẻ đơn mới.
    if (backendOrderCode) return backendOrderCode;

    const orderItems = shopItems.map((item) => ({
      productId: parseInt(item.product.id),
      productName: item.product.name,
      productSlug: item.product.slug,
      productImage: item.product.thumbnail,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const res = await apiCreateOrder({
      buyerName: buyerInfo.fullName,
      buyerEmail: buyerInfo.email,
      buyerPhone: buyerInfo.phone || undefined,
      buyerAddress: buyerInfo.address || undefined,
      shippingProvince: province || undefined,
      items: orderItems,
      discountCode: appliedCoupon?.code,
      idempotencyKey: idempotencyKey.current,
    });
    const code = res.data.orderCode;
    setBackendOrderCode(code);
    try {
      sessionStorage.setItem(`shop_buyer_${code}`, JSON.stringify(buyerInfo));
    } catch { /* sessionStorage có thể bị chặn — hoá đơn vẫn ra, chỉ thiếu thông tin người mua */ }
    return code;
  };

  /** Dịch lỗi backend sang câu người dùng hiểu được. */
  const thongBaoLoi = (err: unknown): string => {
    const raw = err instanceof Error ? err.message : String(err ?? '');
    // `request()` ném nguyên body JSON — bóc lấy `message` nếu có.
    let msg = raw;
    try {
      const parsed = JSON.parse(raw) as { message?: string; code?: string };
      if (parsed?.message) msg = parsed.message;
    } catch { /* không phải JSON — dùng nguyên văn */ }
    if (/401|unauthor/i.test(raw)) return 'Bạn cần đăng nhập để đặt hàng.';
    return msg || t('checkout.paymentError');
  };

  /**
   * Bọc mọi lối thanh toán: khoá ref TRƯỚC (đồng bộ), mở lại ở finally.
   * Mọi nút trả tiền đều phải đi qua đây — thêm một nút mới mà quên bọc là
   * mở lại đúng cái lỗ bấm-hai-lần vừa bịt.
   */
  // Hàm THƯỜNG, không useCallback: nó nằm SAU `if (!mounted) return` ở trên, nên một hook ở đây
  // làm số hook đổi giữa hai lần render ⇒ React error #310, trang thanh toán trắng (13/09 → 25/09).
  // Khoá chống bấm hai lần nằm ở submitLock (useRef ở đầu component), không cần memo hàm.
  const chayThanhToan = async (viec: () => Promise<void>) => {
    if (submitLock.current) return;
    submitLock.current = true;
    setIsProcessing(true);
    try {
      await viec();
    } catch (err) {
      toast.error(thongBaoLoi(err));
    } finally {
      submitLock.current = false;
      setIsProcessing(false);
    }
  };

  /** PayOS (mặc định): tạo đơn → lấy link → chuyển hướng sang cổng. */
  const handlePayosPayment = () =>
    chayThanhToan(async () => {
      const code = await createBackendOrder();
      const res = await createShopPayos(code);
      const checkoutUrl = res.data?.checkoutUrl;
      if (!checkoutUrl) throw new Error('Không tạo được liên kết thanh toán');
      // KHÔNG mở khoá trước khi rời trang: người dùng bấm lại trong lúc
      // trình duyệt đang chuyển hướng sẽ tạo thêm một lượt thanh toán.
      window.location.href = checkoutUrl;
      await new Promise(() => {}); // giữ khoá cho tới khi trang thật sự rời đi
    });

  /** Ví điểm: trừ điểm và giao hàng ngay, không rời trang. */
  const handlePointsPayment = () =>
    chayThanhToan(async () => {
      const code = await createBackendOrder();
      const res = await payShopOrderWithPoints(code);
      setWalletBalance(res.data.balance);
      clearCart();
      toast.success('Thanh toán bằng ví thành công!');
      router.push(`/shop/payment-return?orderCode=${encodeURIComponent(code)}`);
    });

  /** Chuyển khoản: tạo đơn + sinh mã QR, rồi chờ admin đối soát. */
  const handleBankTransfer = () =>
    chayThanhToan(async () => {
      const code = await createBackendOrder();
      const res = await createShopBankTransfer(code);
      setBankInfo(res.data);
      // KHÔNG xoá giỏ ở đây — tiền chưa về. Xoá khi đơn chuyển sang PAID.
      toast.success('Đã tạo yêu cầu chuyển khoản. Quét mã QR để thanh toán.');
    });

  const chep = async (chu: string, nhan: string) => {
    try {
      await navigator.clipboard.writeText(chu);
      setCopied(nhan);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      toast.error('Trình duyệt không cho chép tự động — vui lòng chọn và chép tay.');
    }
  };

  const duDiem = walletBalance !== null && walletBalance >= total;

  return (
    <div className="min-h-screen bg-darkbg pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary">
              {t('checkout.title')}
            </h1>
            <p className="text-text-muted text-sm mt-1">{t('checkout.step')}</p>
          </div>
          <Link href="/cart" className="flex items-center gap-2 text-sm text-text-muted hover:text-neon-violet transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('common.home')}
          </Link>
        </div>

        <div className="flex items-center justify-center gap-4 mb-10">
          {(['info', 'payment'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
                step === s
                  ? 'bg-neon-violet text-white shadow-lg shadow-neon-violet/30'
                  : s === 'info' && step === 'payment'
                  ? 'bg-green-500 text-white'
                  : 'bg-darkcard border border-darkborder text-text-muted'
              }`}>
                {s === 'info' && step === 'payment' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : s === 'payment' ? (
                  <CreditCard className="w-4 h-4" />
                ) : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${
                step === s ? 'text-text-primary' : 'text-text-muted'
              }`}>
                {s === 'info' ? t('contact.fullName') : t('checkout.title')}
              </span>
              {i < 1 && <div className="w-8 h-px bg-darkborder" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {step === 'info' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-darkcard border border-darkborder rounded-2xl p-6"
              >
                <h2 className="font-heading font-bold text-text-primary text-lg mb-6">
                  {t('contact.fullName')}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      {t('contact.fullName')} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={buyerInfo.fullName}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, fullName: e.target.value })}
                      placeholder={t('contact.fullName')}
                      className={`w-full px-4 py-3 bg-darkbg border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors ${
                        errors.fullName ? 'border-red-500' : 'border-darkborder'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      {t('contact.email')} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={buyerInfo.email}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                      placeholder={t('contact.emailPlaceholder')}
                      className={`w-full px-4 py-3 bg-darkbg border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-darkborder'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      {t('checkout.phoneOptional')}
                    </label>
                    <input
                      type="tel"
                      value={buyerInfo.phone}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
                      placeholder="0xxx xxx xxx"
                      className={`w-full px-4 py-3 bg-darkbg border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-darkborder'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      {t('checkout.address')} {hasPhysical && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="text"
                      value={buyerInfo.address}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, address: e.target.value })}
                      placeholder={hasPhysical ? 'Số nhà, đường, phường/xã, quận/huyện' : t('checkout.addressPlaceholder')}
                      className={`w-full px-4 py-3 bg-darkbg border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors ${errors.address ? 'border-red-500' : 'border-darkborder'}`}
                    />
                    {errors.address && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.address}
                      </p>
                    )}
                  </div>
                  {hasPhysical && (
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Tỉnh / Thành phố
                      </label>
                      <input
                        type="text"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        placeholder="e.g. Hanoi, Ho Chi Minh City…"
                        className="w-full px-4 py-3 bg-darkbg border border-darkborder rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                      />
                      <p className="text-[11px] text-text-muted mt-1.5">
                        🚚 Phí giao hàng: {formatPrice(shipCfg.flatFee)} — miễn phí cho đơn từ {formatPrice(shipCfg.freeThreshold)}.
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleProceedToPayment}
                  className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  {t('checkout.payNow')}
                  <CreditCard className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-darkcard border border-darkborder rounded-2xl p-6"
              >
                <h2 className="font-heading font-bold text-text-primary text-lg mb-6">
                  {t('checkout.paymentMethod')}
                </h2>

                {/* Chưa đăng nhập thì dừng ở đây — backend bắt buộc đăng nhập
                    mới đặt được đơn (đổi 13/09/2026). Nói trước còn hơn để
                    người dùng bấm rồi nhận lỗi 401. */}
                {!isAuthenticated && (
                  <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-amber-300">Cần đăng nhập để đặt hàng</p>
                        <p className="text-text-muted mt-1">
                          Đơn hàng được gắn với tài khoản để bạn xem lại mã/tài khoản đã mua,
                          tải hoá đơn và yêu cầu đổi key khi cần.
                        </p>
                        <Link
                          href={`/login?redirect=${encodeURIComponent('/checkout')}`}
                          className="inline-block mt-3 px-4 py-2 rounded-lg bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition-colors"
                        >
                          Đăng nhập / Đăng ký
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Chọn cách thanh toán ── */}
                <div className="space-y-3 mb-6">
                  {([
                    {
                      id: 'PAYOS' as const,
                      icon: CreditCard,
                      ten: 'Thanh toán qua PayOS',
                      mo: 'Quét mã QR ngân hàng / ví — tự động xác nhận ngay',
                      dung: true,
                      ghi: null as string | null,
                    },
                    {
                      id: 'POINTS' as const,
                      icon: Wallet,
                      ten: 'Ví điểm',
                      mo:
                        walletBalance === null
                          ? 'Đăng nhập để xem số dư'
                          : `Số dư: ${walletBalance.toLocaleString('vi-VN')} điểm`,
                      dung: isAuthenticated && duDiem,
                      ghi:
                        walletBalance !== null && !duDiem
                          ? `Thiếu ${(total - walletBalance).toLocaleString('vi-VN')} điểm — nạp thêm ở trang Ví`
                          : null,
                    },
                    {
                      id: 'BANK_TRANSFER' as const,
                      icon: Landmark,
                      ten: 'Chuyển khoản ngân hàng',
                      mo: 'Quét VietQR — admin xác nhận rồi giao hàng',
                      dung: bankEnabled,
                      ghi: bankEnabled ? null : 'Hiện chưa mở',
                    },
                  ]).map((c) => {
                    const chon = payMethod === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => c.dung && setPayMethod(c.id)}
                        disabled={!c.dung || isProcessing}
                        className={`w-full text-left rounded-xl border p-4 transition-all ${
                          chon
                            ? 'border-neon-violet bg-neon-violet/10'
                            : 'border-darkborder bg-darkbg hover:border-neon-violet/40'
                        } ${!c.dung ? 'opacity-45 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            chon ? 'bg-neon-violet/25' : 'bg-darkcard'
                          }`}>
                            <c.icon className={`w-5 h-5 ${chon ? 'text-neon-violet' : 'text-text-muted'}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-text-primary">{c.ten}</p>
                            <p className="text-xs text-text-muted mt-0.5 break-words">{c.mo}</p>
                            {c.ghi && <p className="text-xs text-amber-400/90 mt-1">{c.ghi}</p>}
                          </div>
                          {chon && <CheckCircle className="w-5 h-5 text-neon-violet flex-shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* ── Khối chuyển khoản: hiện SAU khi đã tạo mã ── */}
                {bankInfo && payMethod === 'BANK_TRANSFER' && (
                  <div className="mb-6 rounded-xl border border-neon-violet/30 bg-darkbg p-5">
                    <p className="text-sm font-semibold text-text-primary mb-4">
                      Quét mã để chuyển khoản
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                      <div className="bg-white p-3 rounded-xl flex-shrink-0">
                        <QRCodeSVG value={bankInfo.qrString} size={168} level="M" />
                      </div>
                      <div className="flex-1 w-full space-y-2.5 text-sm">
                        {[
                          { nhan: 'Ngân hàng', gt: bankInfo.bank.name ?? '—', chep: false },
                          { nhan: 'Số tài khoản', gt: bankInfo.bank.accountNo ?? '—', chep: true },
                          { nhan: 'Chủ tài khoản', gt: bankInfo.bank.accountName ?? '—', chep: false },
                          { nhan: 'Số tiền', gt: `${bankInfo.amountVnd.toLocaleString('vi-VN')} đ`, chep: true },
                          { nhan: 'Nội dung', gt: bankInfo.noiDungChuyenKhoan, chep: true },
                        ].map((d) => (
                          <div key={d.nhan} className="flex items-center justify-between gap-3">
                            <span className="text-text-muted text-xs flex-shrink-0">{d.nhan}</span>
                            <span className="flex items-center gap-2 min-w-0">
                              <span className="font-mono text-text-primary truncate">{d.gt}</span>
                              {d.chep && (
                                <button
                                  type="button"
                                  onClick={() => chep(d.nhan === 'Số tiền' ? String(bankInfo.amountVnd) : d.gt, d.nhan)}
                                  className="text-text-muted hover:text-neon-violet transition-colors flex-shrink-0"
                                  aria-label={`Chép ${d.nhan}`}
                                >
                                  {copied === d.nhan
                                    ? <Check className="w-3.5 h-3.5 text-green-400" />
                                    : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex items-start gap-2 text-xs text-text-muted bg-darkcard rounded-lg p-3">
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>
                        <b className="text-amber-300">Ghi ĐÚNG nội dung “{bankInfo.noiDungChuyenKhoan}”</b> khi
                        chuyển — đây là thứ duy nhất để đối chiếu đơn của bạn. Sai nội dung thì đơn không
                        tự khớp và phải liên hệ hỗ trợ.
                        {bankInfo.expiresAt && (
                          <> Mã có hiệu lực tới {new Date(bankInfo.expiresAt).toLocaleString('vi-VN')}.</>
                        )}
                      </span>
                    </div>
                    <Link
                      href="/my-orders"
                      className="mt-4 block text-center py-3 rounded-xl bg-darkcard border border-darkborder text-sm text-text-primary hover:border-neon-violet/40 transition-colors"
                    >
                      Đã chuyển — xem trạng thái đơn
                    </Link>
                  </div>
                )}

                {!bankInfo && (
                  <div className="flex items-center gap-2 text-xs text-text-muted bg-darkbg border border-darkborder rounded-lg p-3 mb-6">
                    <ShieldCheck className="w-4 h-4 text-neon-violet flex-shrink-0" />
                    <span>
                      Giá và tổng tiền được máy chủ tính lại từ dữ liệu gốc trước khi thu tiền —
                      số hiển thị ở đây chỉ để bạn đối chiếu.
                    </span>
                  </div>
                )}

                {!bankInfo && (
                  <button
                    onClick={
                      payMethod === 'POINTS' ? handlePointsPayment
                      : payMethod === 'BANK_TRANSFER' ? handleBankTransfer
                      : handlePayosPayment
                    }
                    disabled={isProcessing || !isAuthenticated || (payMethod === 'POINTS' && !duDiem)}
                    className="w-full mb-3 py-4 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {payMethod === 'POINTS' ? 'Đang trừ điểm…'
                          : payMethod === 'BANK_TRANSFER' ? 'Đang tạo mã chuyển khoản…'
                          : 'Đang chuyển tới cổng thanh toán…'}
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        {payMethod === 'POINTS'
                          ? `Trả ${total.toLocaleString('vi-VN')} điểm`
                          : payMethod === 'BANK_TRANSFER'
                          ? `Tạo mã chuyển khoản ${formatPrice(total)}`
                          : `Thanh toán ${formatPrice(total)}`}
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setStep('info')}
                  disabled={isProcessing}
                  className="w-full py-4 bg-darkbg border border-darkborder text-text-primary font-semibold rounded-xl hover:border-neon-violet/30 transition-colors disabled:opacity-60"
                >
                  Quay lại
                </button>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-darkcard border border-darkborder rounded-2xl p-6 sticky top-24">
              <h2 className="font-heading font-bold text-text-primary text-lg mb-6">
                {t('checkout.total')}
              </h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {shopItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.thumbnail ? (
                        <Image src={item.product.thumbnail} alt={item.product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-darkcard flex items-center justify-center">
                          <Package className="w-5 h-5 text-text-muted" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-primary font-medium truncate">{item.product.name}</p>
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3 text-neon-indigo" />
                        <span className="text-[10px] text-text-muted">{t('common.shop')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-text-primary">{formatPrice(item.product.price * item.quantity)}</p>
                      <p className="text-[10px] text-text-muted">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
                {academyItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.thumbnail ? (
                        <Image src={item.product.thumbnail} alt={item.product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-darkcard flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-text-muted" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-primary font-medium truncate">{item.product.name}</p>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-neon-violet" />
                        <span className="text-[10px] text-text-muted">{t('common.academy')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-text-primary">{formatPrice(item.product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-4 pb-4 border-b border-darkborder">
                {appliedCoupon ? (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-green-400">{appliedCoupon.code}</span>
                      <button onClick={handleRemoveCoupon} className="text-xs text-red-400 hover:text-red-300">
                        {t('checkout.remove')}
                      </button>
                    </div>
                    <p className="text-xs text-green-400">-{formatPrice(appliedCoupon.discountAmount)}</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                          placeholder={t('checkout.couponCode')}
                          className="w-full pl-9 pr-3 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors uppercase"
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!couponInput.trim() || couponLoading}
                        className="px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-secondary hover:border-neon-violet/30 hover:text-neon-violet transition-colors disabled:opacity-40"
                      >
                        {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('checkout.applyCoupon')}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {couponError}
                      </p>
                    )}
                    <p className="text-[10px] text-text-muted mt-2">{t('checkout.couponHint')}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">{t('checkout.subtotal')}</span>
                  <span className="text-text-primary font-medium">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">{t('checkout.discount')}</span>
                    <span className="text-green-400 font-medium">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                {hasPhysical && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Phí giao hàng</span>
                    <span className={shippingFee === 0 ? 'text-green-400 font-medium' : 'text-text-primary font-medium'}>
                      {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-end pt-2 border-t border-darkborder">
                  <span className="text-text-secondary font-semibold">{t('checkout.grandTotal')}</span>
                  <span className="text-xl font-heading font-bold text-neon-violet">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-darkborder">
                {[
                  { icon: ShieldCheck, text: t('checkout.securePayment') },
                  { icon: CreditCard, text: t('checkout.paymentMethods') },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-text-muted">
                    <Icon className="w-4 h-4 text-neon-violet flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
