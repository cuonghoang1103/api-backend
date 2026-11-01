'use client';

/**
 * Trang /courses — CHƯƠNG TRÌNH ĐÀO TẠO. Làm lại 01/11/2026 theo ngôn ngữ hình ảnh của /academy (hero có quầng sáng,
 * thẻ số liệu, thanh điều hướng học kỳ, lưới thẻ có ảnh bìa) — người dùng: "giao diện Courses khó nhìn, làm đẹp như Academy".
 *
 * Dữ liệu: MỘT lần gọi `GET /courses/chuong-trinh` (4 năm → 15 kỳ → khoá + `chuaXep` + `sapRaMat`). Máy chủ Next dựng
 * sẵn bản công khai (SEO, không màn chờ); trình duyệt gọi lại khi người dùng đã đăng nhập để có tiến độ riêng.
 * Ba cách xem dùng CHUNG dữ liệu đó — lọc/tìm chạy ngay trên máy, không gọi thêm:
 *   - Theo lộ trình (mặc định): thanh học kỳ (desktop) / bản đồ bốn năm (điện thoại) + từng năm → kỳ → thẻ khoá
 *   - Theo chuyên ngành: nhóm theo danh mục khoá học
 *   - Tất cả khoá: lưới thẻ
 * Khoá mới chưa gán kỳ (`chuaXep`) luôn hiện — ở mục "Khoá mới" (lộ trình) hoặc lẫn trong hai chế độ kia.
 * Khoá mới có khung (`dangSoan`, backend `services/khoaDaSoan.ts`) mang nhãn "Đang soạn" ở mọi chế độ.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, GraduationCap, Hourglass, Layers3, Search, Sparkles, X } from 'lucide-react';
import type { ChuongTrinhDaoTao, MonChuongTrinh } from '@/types';
import { coursesApi } from '@/lib/api';
import { useTranslation } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuthStore } from '@/store/authStore';
import AcademyBackground from '@/components/academy/AcademyBackground';
import { CHU, chonNgonNgu, khopTuKhoa, type BoChu, type CheDoXem, type NgonNgu } from './chu';
import { TheHocTiep, TheKhoa } from './KhoaHoc';
import s from './chuongTrinh.module.css';

const CHE_DO: CheDoXem[] = ['lo-trinh', 'chuyen-nganh', 'tat-ca'];
const CAP_DO = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;

export interface TrangThaiDau {
  xem: CheDoXem;
  q: string;
  level: string;
  category: string;
}

const LUOI = 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3';

export default function ChuongTrinhClient({ banDau, trangThaiDau }: {
  banDau: ChuongTrinhDaoTao | null;
  trangThaiDau: TrangThaiDau;
}) {
  const { locale } = useTranslation();
  const nn: NgonNgu = locale === 'en' ? 'en' : 'vi';
  const c = CHU[nn];
  const daDangNhap = useAuthStore((st) => st.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  // Nền sao của Academy chỉ vẽ ở giao diện tối, và chỉ sau khi gắn (canvas đọc kích thước cửa sổ).
  const [daGan, setDaGan] = useState(false);
  useEffect(() => setDaGan(true), []);

  const [duLieu, setDuLieu] = useState<ChuongTrinhDaoTao | null>(banDau);
  const [loi, setLoi] = useState(false);
  const [xem, setXem] = useState<CheDoXem>(trangThaiDau.xem);
  const [oTim, setOTim] = useState(trangThaiDau.q);
  const [tuKhoa, setTuKhoa] = useState(trangThaiDau.q);
  const [capDo, setCapDo] = useState(CAP_DO.includes(trangThaiDau.level as never) ? trangThaiDau.level : '');
  const [chuyenNganh, setChuyenNganh] = useState(trangThaiDau.category);

  const tai = useCallback(() => {
    setLoi(false);
    coursesApi.getChuongTrinh()
      .then((r) => setDuLieu(r.data.data))
      .catch(() => setLoi(true));
  }, []);

  // Không có bản dựng sẵn ⇒ tải ngay. Đã đăng nhập ⇒ tải lại để có tiến độ + "đang học" của riêng mình.
  useEffect(() => {
    if (!banDau || daDangNhap) tai();
  }, [banDau, daDangNhap, tai]);

  // Gõ xong 250 ms mới lọc — đủ nhanh để thấy "đang tìm", không giật theo từng phím.
  useEffect(() => {
    const t = setTimeout(() => setTuKhoa(oTim.trim()), 250);
    return () => clearTimeout(t);
  }, [oTim]);

  // Bộ lọc lên URL (replace, không cuộn) — link chia sẻ mở đúng chế độ xem.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const dat = (k: string, v: string) => (v ? p.set(k, v) : p.delete(k));
    p.delete('tab');
    dat('view', xem === 'lo-trinh' ? '' : xem);
    dat('q', tuKhoa);
    dat('level', capDo);
    dat('category', xem === 'lo-trinh' ? '' : chuyenNganh);
    const qs = p.toString();
    const moi = qs ? `${pathname}?${qs}` : pathname;
    if (moi !== `${window.location.pathname}${window.location.search}`) router.replace(moi, { scroll: false });
  }, [xem, tuKhoa, capDo, chuyenNganh, pathname, router]);

  const tatCa = useMemo<MonChuongTrinh[]>(() => {
    if (!duLieu) return [];
    return [
      ...duLieu.nam.flatMap((n) => n.ky.flatMap((k) => k.mon)),
      ...duLieu.chuaXep,
      ...(duLieu.sapRaMat ?? []).flatMap((n) => n.mon),
    ];
  }, [duLieu]);

  const khop = useCallback(
    (m: MonChuongTrinh, boQuaNganh = false) =>
      khopTuKhoa(m, tuKhoa) && (!capDo || m.level === capDo) && (boQuaNganh || !chuyenNganh || m.categorySlug === chuyenNganh),
    [tuKhoa, capDo, chuyenNganh],
  );

  const cacNganh = useMemo(() => {
    const dem = new Map<string, { slug: string; ten: string; so: number }>();
    for (const m of tatCa) {
      const slug = m.categorySlug ?? '';
      const cu = dem.get(slug) ?? { slug, ten: m.categoryName ?? '', so: 0 };
      cu.so++;
      dem.set(slug, cu);
    }
    return [...dem.values()].sort((a, b) => b.so - a.so || a.ten.localeCompare(b.ten));
  }, [tatCa]);

  const dangHoc = useMemo(
    () => tatCa.filter((m) => m.isEnrolled && m.progress != null && m.progress < 100)
      .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0)).slice(0, 3),
    [tatCa],
  );

  const coLoc = Boolean(tuKhoa || capDo || (xem !== 'lo-trinh' && chuyenNganh));
  const xoaLoc = () => { setOTim(''); setTuKhoa(''); setCapDo(''); setChuyenNganh(''); };

  return (
    <div className={`${s.goc} min-h-screen pb-20 pt-20 sm:pt-24`}>
      {daGan && resolvedTheme === 'dark' && <AcademyBackground />}
      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 sm:space-y-8 sm:px-6 lg:px-8">
        <DauTrang duLieu={duLieu} c={c} nn={nn} />

        {dangHoc.length > 0 && (
          <section aria-labelledby="hoc-tiep">
            <h2 id="hoc-tiep" className="mb-3 text-base font-semibold text-[var(--k-ink)]">{c.dangHoc}</h2>
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {dangHoc.map((m) => <TheHocTiep key={m.id} m={m} nn={nn} c={c} />)}
            </ul>
          </section>
        )}

        <ThanhCongCu
          c={c}
          xem={xem}
          setXem={setXem}
          oTim={oTim}
          setOTim={setOTim}
          capDo={capDo}
          setCapDo={setCapDo}
        />

        <main>
          {!duLieu ? (
            loi ? (
              <div className={`${s.the} rounded-2xl px-4 py-14 text-center`}>
                <p className="text-[var(--k-ink-2)]">{c.loi}</p>
                <button
                  onClick={tai}
                  className="mt-4 inline-flex min-h-[44px] items-center rounded-xl px-5 text-sm font-semibold text-white"
                  style={{ background: 'var(--k-grad)' }}
                >
                  {c.thuLai}
                </button>
              </div>
            ) : (
              <KhungCho c={c} />
            )
          ) : xem === 'lo-trinh' ? (
            <XemLoTrinh duLieu={duLieu} c={c} nn={nn} khop={(m) => khop(m, true)} coLoc={coLoc} xoaLoc={xoaLoc} />
          ) : (
            <>
              <ChipNganh c={c} cacNganh={cacNganh} dangChon={chuyenNganh} onChon={setChuyenNganh} />
              {xem === 'chuyen-nganh' ? (
                <XemChuyenNganh tatCa={tatCa} cacNganh={cacNganh} c={c} nn={nn} khop={khop} xoaLoc={xoaLoc} />
              ) : (
                <XemTatCa tatCa={tatCa} c={c} nn={nn} khop={khop} xoaLoc={xoaLoc} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ───────────────────────────── Đầu trang ───────────────────────────── */

function DauTrang({ duLieu, c, nn }: { duLieu: ChuongTrinhDaoTao | null; c: BoChu; nn: NgonNgu }) {
  const soKy = duLieu ? duLieu.nam.reduce((t, n) => t + n.ky.length, 0) : null;
  const dinhSo = (n: number) => n.toLocaleString(nn === 'en' ? 'en-US' : 'vi-VN');
  const so: Array<[string, string]> = duLieu
    ? [
        [dinhSo(duLieu.tong.khoa), c.soKhoa],
        [String(soKy), c.soKy],
        [dinhSo(duLieu.tong.bai), c.soBai],
        ...(duLieu.tong.gio > 0 ? [[dinhSo(duLieu.tong.gio), c.soGio] as [string, string]] : []),
      ]
    : [];
  // Đếm khoá đã soạn trọn / đang soạn — chỉ khi máy chủ có trường `dangSoan` (bản cũ không có ⇒ không hiện).
  const hocDuoc = duLieu ? [...duLieu.nam.flatMap((n) => n.ky.flatMap((k) => k.mon)), ...duLieu.chuaXep] : [];
  const coCo = hocDuoc.some((m) => typeof m.dangSoan === 'boolean');
  const soDangSoan = hocDuoc.filter((m) => m.dangSoan).length;

  return (
    <header className={`${s.the} relative overflow-hidden rounded-3xl p-5 sm:p-8`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at top right, var(--k-glow-1), transparent 38%), radial-gradient(circle at bottom left, var(--k-glow-2), transparent 34%)' }}
      />
      <div className="relative grid items-center gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:gap-8">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-[var(--k-ink-3)]">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-[var(--k-ink)] hover:underline">CuongThai</Link></li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-[var(--k-ink-2)]">{c.duongDan}</li>
            </ol>
          </nav>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--k-accent-line)] bg-[var(--k-accent-soft)] px-3.5 py-1.5 text-sm font-medium text-[var(--k-accent)]">
            <Layers3 aria-hidden className="h-4 w-4" /> {c.nhanTrang}
          </div>
          <h1 className={`${s.tieuDe} font-heading text-[2rem] font-bold leading-tight tracking-[-0.01em] text-[var(--k-ink)] [text-wrap:balance] sm:text-5xl`}>
            {c.tieuDeTruoc} <span className={s.chuGrad}>{c.tieuDeNhan}</span>
          </h1>
          <p className="mt-4 max-w-[42rem] text-base leading-relaxed text-[var(--k-ink-2)] sm:text-lg">{c.loiDan}</p>
          {coCo && (
            <ul className="mt-5 flex flex-wrap gap-2 text-sm">
              <li className="inline-flex items-center gap-1.5 rounded-full bg-[var(--k-green-soft)] px-3 py-1.5 font-medium text-[var(--k-green)]">
                <CheckCircle2 aria-hidden className="h-4 w-4" />
                {c.daSoanTron(hocDuoc.length - soDangSoan)}
              </li>
              {soDangSoan > 0 && (
                <li className="inline-flex items-center gap-1.5 rounded-full bg-[var(--k-amber-soft)] px-3 py-1.5 font-medium text-[var(--k-amber)]" title={c.dangSoanGiaiThich}>
                  <Hourglass aria-hidden className="h-4 w-4" />
                  {c.dangSoanDem(soDangSoan)}
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {so.length > 0
            ? so.map(([gt, nhan]) => (
                <div key={nhan} className={`${s.theTrong} rounded-2xl p-4 sm:p-5`}>
                  <p className="text-sm text-[var(--k-ink-3)] first-letter:uppercase">{nhan}</p>
                  <p className={`${s.so} mt-1.5 text-2xl font-bold text-[var(--k-ink)] sm:text-3xl`}>{gt}</p>
                </div>
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`${s.theTrong} h-[92px] rounded-2xl`} aria-hidden />
              ))}
          <Link
            href="/academy"
            className={`${s.theTrong} group col-span-2 flex items-start gap-3 rounded-2xl p-4 transition-colors hover:border-[var(--k-accent-line)] sm:p-5`}
          >
            <span className={`${s.soKy} grid h-11 w-11 shrink-0 place-items-center rounded-xl`} aria-hidden>
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-[var(--k-ink)]">{c.academyTieuDe}</span>
              <span className="mt-0.5 block text-[13px] leading-snug text-[var(--k-ink-2)]">{c.academyMoTa}</span>
              <span className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--k-accent)]">
                {c.academyNut}
                <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ───────────────────────────── Thanh công cụ ───────────────────────────── */

function ThanhCongCu({ c, xem, setXem, oTim, setOTim, capDo, setCapDo }: {
  c: BoChu; xem: CheDoXem; setXem: (x: CheDoXem) => void;
  oTim: string; setOTim: (v: string) => void; capDo: string; setCapDo: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div
        role="tablist"
        aria-label={c.xemTheo}
        className={`${s.the} grid grid-cols-3 gap-1 rounded-2xl p-1 lg:inline-grid lg:w-auto`}
      >
        {CHE_DO.map((k) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={xem === k}
            onClick={() => setXem(k)}
            className={`${s.tab} min-h-[44px] whitespace-nowrap rounded-xl px-2 text-[13px] font-semibold text-[var(--k-ink-2)] transition-colors hover:bg-[var(--k-accent-soft)] hover:text-[var(--k-ink)] sm:px-5 sm:text-sm`}
          >
            <span className="sm:hidden">{c.cheDoNgan[k]}</span>
            <span className="hidden sm:inline">{c.cheDo[k]}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-2 lg:w-[34rem]">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">{c.timKiem}</span>
          <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--k-ink-3)]" />
          <input
            type="search"
            value={oTim}
            onChange={(e) => setOTim(e.target.value)}
            placeholder={c.timGoiY}
            className={`${s.the} h-12 w-full rounded-2xl pl-12 pr-10 text-sm text-[var(--k-ink)] placeholder:text-[var(--k-ink-3)] focus:border-[var(--k-accent-line)] [&::-webkit-search-cancel-button]:hidden`}
          />
          {oTim && (
            <button
              type="button"
              onClick={() => setOTim('')}
              aria-label={c.xoaTim}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--k-ink-3)] hover:text-[var(--k-ink)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </label>
        <label className="shrink-0">
          <span className="sr-only">{c.moiCapDo}</span>
          <select
            value={capDo}
            onChange={(e) => setCapDo(e.target.value)}
            className={`${s.the} h-12 cursor-pointer rounded-2xl px-3 text-sm text-[var(--k-ink)] sm:px-4`}
          >
            <option value="">{c.moiCapDo}</option>
            {CAP_DO.map((l) => <option key={l} value={l}>{c.capDo[l]}</option>)}
          </select>
        </label>
      </div>
    </div>
  );
}

function ChipNganh({ c, cacNganh, dangChon, onChon }: {
  c: BoChu; cacNganh: { slug: string; ten: string; so: number }[]; dangChon: string; onChon: (v: string) => void;
}) {
  const chip = (slug: string, nhan: string, so?: number) => (
    <button
      key={slug || '__all'}
      type="button"
      aria-pressed={dangChon === slug}
      onClick={() => onChon(slug)}
      className={`${s.chipChon} inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--k-border)] bg-[var(--k-card)] px-3.5 text-[13px] font-medium text-[var(--k-ink-2)] transition-colors hover:border-[var(--k-accent-line)] hover:text-[var(--k-ink)]`}
    >
      {nhan}
      {so != null && <span className={`${s.so} opacity-70`}>{so}</span>}
    </button>
  );
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {chip('', c.moiChuyenNganh)}
      {cacNganh.map((n) => chip(n.slug, n.ten || c.chuyenNganhKhac, n.so))}
    </div>
  );
}

function KhongCo({ c, xoaLoc }: { c: BoChu; xoaLoc: () => void }) {
  return (
    <div className={`${s.the} rounded-2xl border-dashed px-4 py-14 text-center`}>
      <p className="text-[var(--k-ink-2)]">{c.khongCo}</p>
      <button onClick={xoaLoc} className="mt-3 min-h-[44px] text-sm font-semibold text-[var(--k-accent)] underline underline-offset-4">
        {c.boLocXoa}
      </button>
    </div>
  );
}

function DongKetQua({ so, c, xoaLoc }: { so: number; c: BoChu; xoaLoc?: () => void }) {
  return (
    <p className="mb-4 text-sm text-[var(--k-ink-2)]" aria-live="polite">
      <span className={`${s.so} font-semibold text-[var(--k-ink)]`}>{c.ketQua(so)}</span>
      {xoaLoc && (
        <>
          {' · '}
          <button onClick={xoaLoc} className="font-medium text-[var(--k-accent)] underline underline-offset-4">{c.boLocXoa}</button>
        </>
      )}
    </p>
  );
}

function KhungCho({ c }: { c: BoChu }) {
  return (
    <div aria-busy="true" aria-live="polite" className={LUOI}>
      <p className="sr-only">{c.dangTai}</p>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={`${s.the} overflow-hidden rounded-2xl`}>
          <div className="shimmer-track aspect-video w-full" />
          <div className="space-y-2 p-4">
            <div className="shimmer-track h-5 w-24 rounded-full" />
            <div className="shimmer-track h-5 w-3/4" />
            <div className="shimmer-track h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────────── Theo lộ trình ───────────────────────────── */

function tomTatKy(mon: MonChuongTrinh[], c: BoChu): string[] {
  const bai = mon.reduce((t, m) => t + m.totalLessons, 0);
  const giay = mon.reduce((t, m) => t + m.totalDurationSeconds, 0);
  return [c.khoa(mon.length), bai ? c.bai(bai) : '', c.gio(giay)].filter(Boolean);
}

function XemLoTrinh({ duLieu, c, nn, khop, coLoc, xoaLoc }: {
  duLieu: ChuongTrinhDaoTao; c: BoChu; nn: NgonNgu; khop: (m: MonChuongTrinh) => boolean; coLoc: boolean; xoaLoc: () => void;
}) {
  const nam = duLieu.nam
    .map((n) => ({ ...n, ky: n.ky.map((k) => ({ ...k, mon: k.mon.filter(khop) })).filter((k) => k.mon.length > 0 || !coLoc) }))
    .filter((n) => n.ky.some((k) => k.mon.length > 0));
  const moi = duLieu.chuaXep.filter(khop);
  const tuChon = (duLieu.sapRaMat ?? []).map((n) => ({ ...n, mon: n.mon.filter(khop) })).filter((n) => n.mon.length > 0);
  const soTuChon = tuChon.reduce((t, n) => t + n.mon.length, 0);
  const soKhop = nam.reduce((t, n) => t + n.ky.reduce((u, k) => u + k.mon.length, 0), 0) + moi.length + soTuChon;

  if (coLoc && soKhop === 0) return <KhongCo c={c} xoaLoc={xoaLoc} />;

  return (
    <div className="grid gap-6 lg:grid-cols-[288px_minmax(0,1fr)] lg:gap-8">
      {/* Thanh học kỳ — như "Semester navigator" của Academy. Cột dính PHẢI tự giới hạn chiều cao và cuộn bên trong
          (15 kỳ cao hơn màn hình laptop: thiếu max-h thì phần dưới nằm mãi dưới mép). */}
      <aside
        aria-label={c.dieuHuong}
        className={`${s.the} thin-scroll hidden h-fit overscroll-contain rounded-2xl p-4 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto`}
      >
        <div className="mb-3 flex items-center gap-2.5 px-1">
          <Layers3 aria-hidden className="h-5 w-5 text-[var(--k-accent)]" />
          <h2 className="text-base font-semibold text-[var(--k-ink)]">{c.dieuHuong}</h2>
        </div>
        <ol className="space-y-4">
          {nam.map((n) => (
            <li key={n.so}>
              <p className="px-1 text-xs font-semibold text-[var(--k-ink-3)]">
                {c.namNgan(n.so)} · {chonNgonNgu(n.ten, n.tenEn, nn)}
              </p>
              <ol className="mt-1.5 space-y-0.5">
                {n.ky.map((k) => (
                  <li key={k.so}>
                    <a href={`#ky-${k.so}`} className={`${s.hangKy} flex items-center gap-3 rounded-xl px-2 py-2`}>
                      <span className={`${s.soKy} ${s.so} grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold`} aria-hidden>{k.so}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-[var(--k-ink)]">{chonNgonNgu(k.ten, k.tenEn, nn)}</span>
                        <span className="block text-xs text-[var(--k-ink-3)]">{c.hocKy(k.so)} · {c.khoa(k.mon.length)}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </li>
          ))}
          {(moi.length > 0 || soTuChon > 0) && (
            <li className="space-y-0.5 border-t border-[var(--k-border)] pt-3">
              {moi.length > 0 && (
                <a href="#khoa-moi" className={`${s.hangKy} flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-[var(--k-ink)]`}>
                  <Sparkles aria-hidden className="h-4 w-4 text-[var(--k-accent)]" /> {c.khoaMoi}
                </a>
              )}
              {soTuChon > 0 && (
                <a href="#tu-chon" className={`${s.hangKy} flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-[var(--k-ink)]`}>
                  <Sparkles aria-hidden className="h-4 w-4 text-[var(--k-accent-2)]" />
                  <span className="min-w-0 flex-1">{c.tuChonTieuDe}</span>
                  <span className={`${s.so} text-xs text-[var(--k-ink-3)]`}>{soTuChon}</span>
                </a>
              )}
            </li>
          )}
        </ol>
      </aside>

      <div className="min-w-0 space-y-8">
        {coLoc ? <DongKetQua so={soKhop} c={c} xoaLoc={xoaLoc} /> : <BanDo duLieu={duLieu} c={c} nn={nn} soTuChon={soTuChon} />}

        {nam.map((n) => {
          const dau = n.ky[0]?.so ?? 0;
          const cuoi = n.ky[n.ky.length - 1]?.so ?? 0;
          return (
            <section key={n.so} aria-labelledby={`nam-${n.so}`} className="space-y-5">
              <div className="flex flex-col gap-2 pt-2 md:flex-row md:items-end md:justify-between md:gap-8">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--k-accent)]">
                    {c.nam(n.so)} · {c.kyTu(dau, cuoi)}
                  </p>
                  <h2 id={`nam-${n.so}`} className={`${s.tieuDe} mt-1 font-heading text-2xl font-bold text-[var(--k-ink)] sm:text-3xl`}>
                    {chonNgonNgu(n.ten, n.tenEn, nn)}
                  </h2>
                </div>
                <p className="max-w-[34rem] text-sm leading-relaxed text-[var(--k-ink-2)] md:text-right">
                  {chonNgonNgu(n.moTa, n.moTaEn, nn)}
                </p>
              </div>

              {n.ky.map((k) => (
                <article
                  key={k.so}
                  id={`ky-${k.so}`}
                  aria-labelledby={`ky-${k.so}-ten`}
                  className={`${s.the} ${s.neo} rounded-2xl p-4 sm:p-5`}
                >
                  <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3.5">
                      <span className={`${s.soKy} ${s.so} grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-lg font-bold`} aria-hidden>
                        {k.so}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[var(--k-ink-3)]">{c.hocKy(k.so)}</p>
                        <h3 id={`ky-${k.so}-ten`} className={`${s.tieuDe} font-heading text-xl font-bold leading-snug text-[var(--k-ink)] sm:text-2xl`}>
                          {chonNgonNgu(k.ten, k.tenEn, nn)}
                        </h3>
                        <p className="mt-1 max-w-[46rem] text-sm leading-relaxed text-[var(--k-ink-2)]">{chonNgonNgu(k.moTa, k.moTaEn, nn)}</p>
                      </div>
                    </div>
                    <p className="flex shrink-0 flex-wrap gap-1.5 sm:max-w-[13rem] sm:justify-end">
                      {tomTatKy(k.mon, c).map((x) => (
                        <span key={x} className={`${s.so} rounded-full border border-[var(--k-accent-line)] bg-[var(--k-accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--k-accent)]`}>
                          {x}
                        </span>
                      ))}
                    </p>
                  </header>
                  <ol className={LUOI}>
                    {k.mon.map((m) => <TheKhoa key={m.id} m={m} nn={nn} c={c} thuTu={m.loTrinhThuTu ?? undefined} />)}
                  </ol>
                </article>
              ))}
            </section>
          );
        })}

        {moi.length > 0 && (
          <section id="khoa-moi" aria-labelledby="khoa-moi-tieu-de" className={`${s.the} ${s.neo} rounded-2xl p-4 sm:p-5`}>
            <h2 id="khoa-moi-tieu-de" className="font-heading text-2xl font-bold text-[var(--k-ink)]">{c.khoaMoi}</h2>
            <p className="mb-4 mt-1 max-w-[40rem] text-sm leading-relaxed text-[var(--k-ink-2)]">{c.khoaMoiMoTa}</p>
            <ul className={LUOI}>
              {moi.map((m) => <TheKhoa key={m.id} m={m} nn={nn} c={c} />)}
            </ul>
          </section>
        )}

        {tuChon.length > 0 && (
          <section id="tu-chon" aria-labelledby="tu-chon-tieu-de" className={`${s.the} ${s.neo} relative overflow-hidden rounded-2xl p-4 sm:p-5`}>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(circle at top right, var(--k-glow-2), transparent 40%)' }}
            />
            <div className="relative">
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-[var(--k-cyan-line)] bg-[var(--k-cyan-soft)] px-3 py-1 text-xs font-semibold text-[var(--k-accent-2)]">
                <Sparkles aria-hidden className="h-3.5 w-3.5" /> {c.sapRaMat}
              </div>
              <h2 id="tu-chon-tieu-de" className="font-heading text-2xl font-bold text-[var(--k-ink)]">{c.tuChonTieuDe}</h2>
              <p className="mt-1 max-w-[44rem] text-sm leading-relaxed text-[var(--k-ink-2)]">{c.tuChonMoTa}</p>
              {tuChon.map((n) => (
                <div key={n.ma} className="mt-6">
                  <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-[var(--k-border)] pb-2">
                    <h3 className="text-lg font-semibold text-[var(--k-ink)]">{chonNgonNgu(n.ten, n.tenEn, nn)}</h3>
                    <p className={`${s.so} shrink-0 text-xs text-[var(--k-ink-3)]`}>{c.khoa(n.mon.length)}</p>
                  </div>
                  <ul className={LUOI}>
                    {n.mon.map((m) => <TheKhoa key={m.id} m={m} nn={nn} c={c} />)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/** Bản đồ bốn năm — bốn thẻ năm, mỗi kỳ một ô bấm tới phần chi tiết. Là "lộ trình 15 kỳ" nhìn một lần. */
function BanDo({ duLieu, c, nn, soTuChon }: { duLieu: ChuongTrinhDaoTao; c: BoChu; nn: NgonNgu; soTuChon: number }) {
  return (
    <section aria-labelledby="ban-do" className={`${s.the} rounded-2xl p-4 sm:p-5 lg:hidden`}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 id="ban-do" className="font-heading text-xl font-bold text-[var(--k-ink)]">{c.tongQuan}</h2>
        <p className="text-sm text-[var(--k-ink-3)]">{c.tongQuanMoTa}</p>
      </div>
      <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {duLieu.nam.map((n) => (
          <li key={n.so} className={`${s.theTrong} min-w-0 rounded-2xl p-3`}>
            <div className="flex items-baseline justify-between gap-2 px-1">
              <p className="font-semibold text-[var(--k-ink)]">{chonNgonNgu(n.ten, n.tenEn, nn)}</p>
              <p className="shrink-0 text-xs font-medium text-[var(--k-ink-3)]">{c.namNgan(n.so)}</p>
            </div>
            <ol className="mt-2 space-y-0.5">
              {n.ky.map((k) => {
                const tt = tomTatKy(k.mon, c);
                return (
                  <li key={k.so}>
                    <a href={`#ky-${k.so}`} className={`${s.hangKy} flex items-center gap-2.5 rounded-xl px-1.5 py-1.5`}>
                      <span className={`${s.soKy} ${s.so} grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold`} aria-hidden>{k.so}</span>
                      <span className="min-w-0 flex-1 text-sm leading-snug text-[var(--k-ink)]">
                        <span className="sr-only">{c.hocKy(k.so)}: </span>
                        {chonNgonNgu(k.ten, k.tenEn, nn)}
                      </span>
                      <span className={`${s.so} hidden shrink-0 text-xs text-[var(--k-ink-3)] sm:inline`}>{tt[0]}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
      {soTuChon > 0 && (
        <a
          href="#tu-chon"
          className={`${s.hangKy} mt-3 flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-[var(--k-accent-2)]`}
        >
          <Sparkles aria-hidden className="h-4 w-4" />
          <span className="min-w-0 flex-1">{c.tuChonTieuDe}</span>
          <span className={`${s.so} text-xs text-[var(--k-ink-3)]`}>{c.khoa(soTuChon)}</span>
        </a>
      )}
    </section>
  );
}

/* ───────────────────────────── Theo chuyên ngành ───────────────────────────── */

function XemChuyenNganh({ tatCa, cacNganh, c, nn, khop, xoaLoc }: {
  tatCa: MonChuongTrinh[]; cacNganh: { slug: string; ten: string; so: number }[];
  c: BoChu; nn: NgonNgu; khop: (m: MonChuongTrinh) => boolean; xoaLoc: () => void;
}) {
  const thuTu = (a: MonChuongTrinh, b: MonChuongTrinh) =>
    (a.loTrinhKy ?? 99) - (b.loTrinhKy ?? 99) || (a.loTrinhThuTu ?? 99) - (b.loTrinhThuTu ?? 99);
  const nhom = cacNganh
    .map((n) => ({ ...n, mon: tatCa.filter((m) => (m.categorySlug ?? '') === n.slug && khop(m)).sort(thuTu) }))
    .filter((n) => n.mon.length > 0);
  if (nhom.length === 0) return <KhongCo c={c} xoaLoc={xoaLoc} />;
  return (
    <div className="space-y-6">
      {nhom.map((n) => (
        <section key={n.slug || '_'} aria-labelledby={`nganh-${n.slug || 'khac'}`} className={`${s.the} rounded-2xl p-4 sm:p-5`}>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id={`nganh-${n.slug || 'khac'}`} className={`${s.tieuDe} font-heading text-xl font-bold text-[var(--k-ink)] sm:text-2xl`}>
              {n.ten || c.chuyenNganhKhac}
            </h2>
            <span className={`${s.so} shrink-0 rounded-full border border-[var(--k-accent-line)] bg-[var(--k-accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--k-accent)]`}>
              {c.khoa(n.mon.length)}
            </span>
          </div>
          <ul className={LUOI}>
            {n.mon.map((m) => <TheKhoa key={m.id} m={m} nn={nn} c={c} hienKy />)}
          </ul>
        </section>
      ))}
    </div>
  );
}

/* ───────────────────────────── Tất cả khoá ───────────────────────────── */

function XemTatCa({ tatCa, c, nn, khop, xoaLoc }: {
  tatCa: MonChuongTrinh[]; c: BoChu; nn: NgonNgu; khop: (m: MonChuongTrinh) => boolean; xoaLoc: () => void;
}) {
  const ds = tatCa.filter(khop);
  if (ds.length === 0) return <KhongCo c={c} xoaLoc={xoaLoc} />;
  return (
    <>
      <DongKetQua so={ds.length} c={c} />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {ds.map((m) => <TheKhoa key={m.id} m={m} nn={nn} c={c} hienKy />)}
      </ul>
    </>
  );
}
