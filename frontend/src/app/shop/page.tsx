'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Clock, ShoppingBag, Gauge, Wallet, Plus, ArrowRight, PackageCheck, QrCode, KeyRound, MousePointerClick, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { walletApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import ProductCard from '@/components/shop/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import ProductFilter, { DEFAULT_SORT } from '@/components/shop/ProductFilter';
import { MOCK_PRODUCTS } from '@/data/products';
import CartDrawer from '@/components/shop/CartDrawer';
import ShopBackground from '@/components/shop/ShopBackground';
import DigitalShopTermsGate from '@/components/shop/DigitalShopTermsGate';
import { useProductStore } from '@/store/productStore';
import type { PriceRange, SortOption } from '@/types';
import { getCategories, type CategoryResponse } from '@/lib/api/shop';
import { useTranslation } from '@/hooks/useTranslation';

export default function ShopPage() {
  const { t } = useTranslation();
  const { products, fetchProducts, isLoaded } = useProductStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [sort, setSort] = useState<SortOption>(DEFAULT_SORT);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [soDu, setSoDu] = useState<number | null>(null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    setMounted(true);
    if (!isLoaded) {
      fetchProducts();
    }
    getCategories().then(setCategories).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Số dư ví — chỉ có nghĩa khi đã đăng nhập; lỗi thì im lặng, dải ví ẩn đi.
  useEffect(() => {
    if (!isAuthenticated) { setSoDu(null); return; }
    walletApi.balance().then((r) => setSoDu(r.data.data.balance)).catch(() => setSoDu(null));
  }, [isAuthenticated]);

  // Nút lọc: "Tất cả" + các danh mục CÒN HÀNG.
  //
  // ⚠️ Bỏ danh mục rỗng là cố ý. Trước 14/09/2026 mọi danh mục đều thành một
  // nút, kể cả danh mục không còn sản phẩm nào đang bán — sau khi tắt 10 sản
  // phẩm Cursor thì có 7 nút mà chỉ 1 nút ra hàng, sáu nút kia dẫn tới trang
  // trắng. Người mua không có cách nào biết trước và nó trông y như web hỏng.
  //
  // Đếm lấy từ API (`soSanPham`, chỉ tính sản phẩm active). Không đếm từ mảng
  // `products` đang hiển thị: mảng đó đã bị bộ lọc giá/tìm kiếm cắt bớt, nên
  // gõ một từ khoá là các nút tự biến mất — lọc lại chính cái bộ lọc.
  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      ...categories
        .filter((c) => (c.soSanPham ?? 1) > 0)
        .map((c) => ({ value: c.name, label: c.name })),
    ],
    [categories],
  );

  // Khoảng giá nào thật sự có hàng — xem `availablePriceRanges` ở ProductFilter.
  const availablePriceRanges = useMemo<PriceRange[]>(() => {
    const out: PriceRange[] = [];
    if (products.some((p) => p.price < 200000)) out.push('under200');
    if (products.some((p) => p.price >= 200000 && p.price <= 500000)) out.push('200to500');
    if (products.some((p) => p.price > 500000)) out.push('above500');
    return out;
  }, [products]);

  // Lần ĐẦU vào gian hàng, store còn giữ MOCK_PRODUCTS (hàng mẫu không có
  // thật) cho tới khi API trả về — hiện khung chờ thay vì bày hàng giả ra.
  // Lần sau store đã có hàng thật từ localStorage, hiện luôn rồi làm mới ngầm.
  const choHangThat = !isLoaded && products === MOCK_PRODUCTS;

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    if (priceRange === 'under200') {
      result = result.filter((p) => p.price < 200000);
    } else if (priceRange === '200to500') {
      result = result.filter((p) => p.price >= 200000 && p.price <= 500000);
    } else if (priceRange === 'above500') {
      result = result.filter((p) => p.price > 500000);
    }

    switch (sort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        break;
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
        break;
      default:
        // Preserve the admin's manual order (products arrive sorted by
        // sortOrder from the API) — don't re-sort.
        break;
    }

    return result;
  }, [products, search, category, priceRange, sort]);

  if (!mounted) {
    // Skeleton grid (FB-style) instead of a bare spinner so the product
    // layout is mirrored before hydration — no white flash / layout jump.
    return (
      <div className="min-h-screen bg-darkbg pt-20 px-4 sm:px-6 lg:px-8">
        <div
          className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          role="status"
          aria-busy="true"
          aria-label="Đang tải sản phẩm"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-darkborder bg-darkcard/40"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <Skeleton className="h-44 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-8 w-24" rounded="rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <style>{`
        @keyframes shopTheVao { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .shop-the-vao { animation: shopTheVao .4s cubic-bezier(.2,.7,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .shop-the-vao { animation: none; } }
      `}</style>
      <DigitalShopTermsGate />
      <ShopBackground />

      {/* ─── Hero ───────────────────────────────────────────────────────
          Mẫu "marketplace": ô TÌM KIẾM mới là lời mời chính, không phải
          một nút CTA. Người vào đây đã biết mình cần gì (key Cursor? key
          CuongMini?) — việc của trang là đưa họ tới đó nhanh nhất.

          ⚠️ Chữ cũ ở đây là bản tiếng Anh mặc định nói về "web templates,
          developer tools, software" — KHÔNG đúng thứ đang bán. Gian hàng
          này bán KEY/TÀI KHOẢN AI. Mô tả sai làm người mua nghĩ mình vào
          nhầm chỗ. */}
      <section className="relative pt-10 pb-8">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium
                             bg-neon-violet/10 border border-neon-violet/25 text-neon-violet">
              <ShoppingBag className="w-3.5 h-3.5" />
              Gian hàng số
            </span>

            <h1 className="mt-5 text-3xl md:text-5xl font-heading font-bold text-text-primary tracking-tight">
              Key &amp; tài khoản AI
            </h1>
            <p className="mt-3 text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Key CuongMini cho OpenCode và credit API — giao ngay sau khi thanh toán,
              mỗi người một key riêng.
            </p>

            {/* Ba điều người mua thật sự cần biết. Không phải khẩu hiệu. */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
              {[
                { icon: Zap, chinh: 'Giao ngay', phu: 'Key về tài khoản sau khi trả tiền' },
                { icon: Shield, chinh: 'Key riêng từng người', phu: 'Không dùng chung, không trùng' },
                { icon: PackageCheck, chinh: 'Hỏng thì đổi', phu: 'Gửi yêu cầu ngay trong đơn' },
              ].map(({ icon: Icon, chinh, phu }) => (
                <div key={chinh} className="flex items-center gap-2.5 text-left">
                  <div className="w-9 h-9 rounded-xl bg-neon-violet/10 border border-neon-violet/20
                                  flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-neon-violet" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary leading-tight">{chinh}</p>
                    <p className="text-xs text-text-muted leading-tight mt-0.5">{phu}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dải ví — chỉ hiện khi đã đăng nhập.
                ⚠️ Trước đây khối này nằm trên nền biển sáng và gần như không
                đọc được. Nay nền tối nên dùng viền + nền đặc mờ, tương phản
                đủ theo WCAG. */}
            {soDu !== null && (
              <Link
                href="/wallet"
                className="mt-7 inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl
                           border border-neon-violet/30 bg-darkcard/90 backdrop-blur
                           hover:border-neon-violet/60 transition-colors group"
              >
                <Wallet className="w-4 h-4 text-neon-violet flex-shrink-0" />
                <span className="text-sm text-text-secondary">
                  Ví của bạn: <b className="text-text-primary tabular-nums">{soDu.toLocaleString('vi-VN')}</b> điểm
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-neon-violet font-semibold">
                  <Plus className="w-3 h-3" /> Nạp
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              <Link
                href="/kiem-tra-key"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                           text-white bg-gradient-to-r from-neon-indigo to-neon-violet
                           hover:opacity-90 transition-opacity"
              >
                <Gauge className="w-4 h-4" />
                Kiểm tra key đã mua
              </Link>
              <Link
                href="/my-orders"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                           text-text-secondary bg-darkcard border border-darkborder
                           hover:border-neon-violet/40 transition-colors"
              >
                <Clock className="w-4 h-4" />
                Đơn đã mua
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Filter */}
        <div className="mb-8">
          <ProductFilter
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sort={sort}
            onSortChange={setSort}
            totalResults={filtered.length}
            categories={categoryOptions}
            availablePriceRanges={availablePriceRanges}
          />
        </div>

        {/* Category description banner */}
        {(() => {
          const selectedCat = categories.find((c) => c.name === category);
          if (!selectedCat?.description) return null;
          return (
            <div className="mb-8 rounded-2xl p-5 border" style={{ background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(129,140,248,0.25)' }}>
              <h2 className="text-lg font-heading font-bold text-text-primary mb-1">{selectedCat.name}</h2>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{selectedCat.description}</p>
            </div>
          );
        })()}

        {/* Grid */}
        {choHangThat ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6" role="status" aria-busy="true" aria-label="Đang tải sản phẩm">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-darkborder bg-darkcard/40">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-9 w-full" rounded="rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-darkcard flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-text-muted/30" />
            </div>
            <h3 className="text-xl font-heading font-bold text-text-primary mb-2">
              {t('shop.page.noProducts')}
            </h3>
            <p className="text-text-muted">{t('shop.page.adjustFilters')}</p>
          </div>
        ) : (
          /* ⚠️ Lưới KHÔNG dùng framer `layout` / `AnimatePresence mode="popLayout"`
             nữa (22/09/2026). Hiệu ứng vào là keyframe CSS thuần: không phụ
             thuộc JS nên không thể "kẹt giữa chừng" như bản cũ trên iPad /
             điện thoại (xem chú thích đầu ProductCard). `both` giữ trạng thái
             cuối sau khi chạy xong; reduced-motion thì bỏ hẳn. */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className="shop-the-vao"
                style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
              >
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        )}

        <CachMua />
        <HoiDap />
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
}

/* ─── Cách mua ─────────────────────────────────────────────────────────────
   Ba bước, đúng với luồng thật ở /checkout (PayOS · Ví điểm · Chuyển khoản).
   Người mua key lần đầu hay hỏi đúng một câu: "trả tiền xong thì key ở đâu?"
   — khối này trả lời trước khi họ phải hỏi. */
function CachMua() {
  const buoc = [
    { icon: MousePointerClick, ten: 'Chọn gói', mo: 'Xem chi tiết từng gói — hạn mức, model dùng được, thời hạn.' },
    { icon: QrCode, ten: 'Thanh toán', mo: 'Quét QR qua PayOS, trả bằng Ví điểm, hoặc chuyển khoản ngân hàng.' },
    { icon: KeyRound, ten: 'Nhận key', mo: 'Key hiện ngay trong “Đơn đã mua”. Chuyển khoản thì có key sau khi đối soát.' },
  ];
  return (
    <section className="mt-20" aria-labelledby="cach-mua">
      <h2 id="cach-mua" className="text-2xl md:text-3xl font-heading font-bold text-text-primary text-center">
        Mua trong ba bước
      </h2>
      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {buoc.map(({ icon: Icon, ten, mo }, i) => (
          <li key={ten} className="relative rounded-2xl border border-white/[0.07] bg-darkcard/60 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-violet/10 border border-neon-violet/25">
                <Icon className="h-5 w-5 text-neon-violet" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Bước {i + 1}</span>
            </div>
            <p className="mt-4 font-heading font-semibold text-text-primary">{ten}</p>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">{mo}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ─── Hỏi đáp ──────────────────────────────────────────────────────────────
   `<details>` thuần: mở/đóng không cần JS, đọc được bằng trình đọc màn hình,
   và không có hiệu ứng nào để kẹt. Chỉ ghi điều ĐÚNG với hệ thống hiện tại —
   chính sách đổi/hoàn lấy nguyên ý từ DigitalShopTermsGate. */
function HoiDap() {
  const cau = [
    {
      hoi: 'Trả tiền xong bao lâu thì có key?',
      dap: 'PayOS và Ví điểm: ngay lập tức, key nằm trong mục “Đơn đã mua”. Chuyển khoản ngân hàng: sau khi đơn được đối soát.',
    },
    {
      hoi: 'Key có dùng chung với người khác không?',
      dap: 'Không. Mỗi đơn là một key riêng, không trùng, không chia sẻ.',
    },
    {
      hoi: 'Làm sao biết key còn bao nhiêu hạn mức?',
      dap: 'Vào “Kiểm tra key đã mua” ở đầu trang, dán key vào là thấy hạn mức còn lại của chu kỳ hiện tại.',
    },
    {
      hoi: 'Key lỗi thì sao?',
      dap: 'Gửi yêu cầu ngay trong trang đơn hàng. Lỗi từ phía gian hàng trong thời gian bảo hành sẽ được đổi key mới. Hàng số đã giao thì không hoàn tiền, trừ khi lỗi do chúng tôi.',
    },
  ];
  return (
    <section className="mt-16 mx-auto max-w-3xl" aria-labelledby="hoi-dap">
      <h2 id="hoi-dap" className="text-2xl md:text-3xl font-heading font-bold text-text-primary text-center">
        Câu hỏi thường gặp
      </h2>
      <div className="mt-8 divide-y divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-darkcard/60">
        {cau.map(({ hoi, dap }) => (
          <details key={hoi} className="group px-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-medium text-text-primary">
              {hoi}
              <ChevronDown className="h-4 w-4 shrink-0 text-text-muted transition-transform group-open:rotate-180" />
            </summary>
            <p className="pb-4 -mt-1 text-sm leading-relaxed text-text-secondary">{dap}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
