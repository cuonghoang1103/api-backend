'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ShieldCheck, CreditCard, Tag,
  CheckCircle, XCircle, AlertCircle, Package,
  BookOpen, Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { createOrder as apiCreateOrder, validateDiscount, createShopPayos, getShippingConfig } from '@/lib/api/shop';
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

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { items, getTotalPrice } = useCartStore();

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
  }, []);

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

  // Create the backend order from the current cart + buyer info. The backend
  // recomputes prices/discount authoritatively — the client total is display
  // only.
  const createBackendOrder = async () => {
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
    });
    return res.data;
  };

  // PayOS flow (primary): create the order → get the hosted checkout link →
  // redirect. PayOS returns to /shop/payment-return which confirms + clears
  // the cart + offers the invoice. Buyer info is stashed so the return page
  // can print it on the invoice.
  const handlePayosPayment = async () => {
    setIsProcessing(true);
    try {
      const backendOrder = await createBackendOrder();
      try {
        sessionStorage.setItem(
          `shop_buyer_${backendOrder.orderCode}`,
          JSON.stringify(buyerInfo),
        );
      } catch { /* sessionStorage may be unavailable — invoice still works without buyer PII */ }
      const res = await createShopPayos(backendOrder.orderCode);
      const checkoutUrl = res.data?.checkoutUrl;
      if (!checkoutUrl) throw new Error('Không tạo được liên kết thanh toán');
      window.location.href = checkoutUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : t('checkout.paymentError');
      setIsProcessing(false);
      toast.error(message);
    }
  };

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
                        placeholder="VD: Hà Nội, TP. Hồ Chí Minh…"
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
                <div className="bg-darkbg rounded-xl border border-darkborder p-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-violet/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-neon-violet" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">Thanh toán qua PayOS</p>
                      <p className="text-xs text-text-muted">Quét mã QR ngân hàng / ví — an toàn, tự động xác nhận</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted bg-darkcard rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 text-neon-violet flex-shrink-0" />
                    <span>Bạn sẽ được chuyển sang cổng PayOS. Sau khi thanh toán, hệ thống tự động xác nhận và gửi sản phẩm.</span>
                  </div>
                </div>
                <button
                  onClick={handlePayosPayment}
                  disabled={isProcessing}
                  className="w-full mb-3 py-4 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang chuyển tới cổng thanh toán…
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Thanh toán {formatPrice(total)}
                    </>
                  )}
                </button>
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
