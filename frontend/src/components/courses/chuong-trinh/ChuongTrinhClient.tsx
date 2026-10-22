'use client';

/**
 * Trang /courses — CHƯƠNG TRÌNH ĐÀO TẠO (22/10/2026). Thay cho hero + lưới thẻ cũ.
 *
 * Dữ liệu: MỘT lần gọi `GET /courses/chuong-trinh` (4 năm → 15 kỳ → khoá + `chuaXep`). Máy chủ Next dựng sẵn bản
 * công khai (SEO, không màn chờ); trình duyệt gọi lại khi người dùng đã đăng nhập để có tiến độ riêng.
 * Ba cách xem dùng CHUNG dữ liệu đó — lọc/tìm chạy ngay trên máy, không gọi thêm:
 *   - Theo lộ trình (mặc định): bản đồ bốn năm + từng năm/kỳ, khoá theo thứ tự nên học
 *   - Theo chuyên ngành: nhóm theo danh mục khoá học
 *   - Tất cả khoá: lưới thẻ
 * Khoá mới chưa gán kỳ (`chuaXep`) luôn hiện — ở mục "Khoá mới" (lộ trình) hoặc lẫn trong hai chế độ kia.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowUpRight, Search, X } from 'lucide-react';
import type { ChuongTrinhDaoTao, MonChuongTrinh } from '@/types';
import { coursesApi } from '@/lib/api';
import { useTranslation } from '@/context/LocaleContext';
import { useAuthStore } from '@/store/authStore';
import { pickLang } from '@/lib/utils';
import { CHU, chonNgonNgu, khopTuKhoa, type BoChu, type CheDoXem, type NgonNgu } from './chu';
import { HangKhoa, TheKhoa } from './KhoaHoc';
import s from './chuongTrinh.module.css';

const CHE_DO: CheDoXem[] = ['lo-trinh', 'chuyen-nganh', 'tat-ca'];
const CAP_DO = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;

export interface TrangThaiDau {
  xem: CheDoXem;
  q: string;
  level: string;
  category: string;
}

const pad2 = (n: number) => String(n).padStart(2, '0');

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
    return [...duLieu.nam.flatMap((n) => n.ky.flatMap((k) => k.mon)), ...duLieu.chuaXep];
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
    <div className={`${s.goc} min-h-screen`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <DauTrang duLieu={duLieu} c={c} nn={nn} dangHoc={dangHoc} />

        <ThanhCongCu
          c={c}
          xem={xem}
          setXem={setXem}
          oTim={oTim}
          setOTim={setOTim}
          capDo={capDo}
          setCapDo={setCapDo}
        />

        <main className="pb-24">
          {!duLieu ? (
            loi ? (
              <div className="border-t border-[var(--p-rule)] py-16 text-center">
                <p className="text-[var(--p-ink-2)]">{c.loi}</p>
                <button onClick={tai} className="mt-4 border border-[var(--p-rule-strong)] px-4 py-2 text-sm font-medium hover:bg-[var(--p-ink)] hover:text-[var(--p-paper)]">
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

function DauTrang({ duLieu, c, nn, dangHoc }: {
  duLieu: ChuongTrinhDaoTao | null; c: BoChu; nn: NgonNgu; dangHoc: MonChuongTrinh[];
}) {
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
  return (
    <header className="pt-16 sm:pt-20">
      <nav aria-label="Breadcrumb" className="text-xs text-[var(--p-ink-3)]">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-[var(--p-ink)] hover:underline">CuongThai</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-[var(--p-ink-2)]">{c.duongDan}</li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-8 border-b border-[var(--p-rule-strong)] pb-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-14 sm:pb-12">
        <div className="min-w-0">
          <h1 className={`${s.tieuDe} font-editorial text-[2.75rem] font-[420] leading-[1.02] tracking-[-0.022em] text-[var(--p-ink)] [text-wrap:balance] sm:text-6xl lg:text-[4.4rem]`}>
            {c.tieuDe}
          </h1>
          <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-[var(--p-ink-2)] sm:text-[17px]">{c.loiDan}</p>
        </div>

        <div className="min-w-0">
          {so.length > 0 && (
            <dl className="grid grid-cols-2 border-t border-[var(--p-rule)]">
              {so.map(([gt, nhan], i) => (
                <div
                  key={nhan}
                  className={`border-b border-[var(--p-rule)] py-3.5 ${i % 2 === 1 ? 'border-l pl-4 sm:pl-5' : 'pr-4'}`}
                >
                  <dt className="sr-only">{nhan}</dt>
                  <dd>
                    <span className={`${s.so} block font-editorial text-3xl leading-none text-[var(--p-ink)] sm:text-[2.1rem]`}>{gt}</span>
                    <span className="mt-1.5 block text-xs text-[var(--p-ink-3)]">{nhan}</span>
                  </dd>
                </div>
              ))}
            </dl>
          )}
          <p className="mt-4 text-sm text-[var(--p-ink-2)]">
            {c.academyHoi}{' '}
            <Link href="/academy" className="font-medium text-[var(--p-accent)] underline decoration-1 underline-offset-4 hover:decoration-2">
              {c.academyLink}
              <ArrowUpRight aria-hidden className="ml-0.5 inline h-3.5 w-3.5 align-[-2px]" />
            </Link>
          </p>
        </div>
      </div>

      {dangHoc.length > 0 && (
        <div className="flex flex-col gap-2 border-b border-[var(--p-rule)] py-4 sm:flex-row sm:items-center sm:gap-5">
          <p className="shrink-0 text-xs font-semibold text-[var(--p-ink-2)]">{c.dangHoc}</p>
          <ul className="flex min-w-0 flex-wrap gap-x-5 gap-y-1.5">
            {dangHoc.map((m) => (
              <li key={m.id} className="min-w-0">
                <Link href={`/courses/${m.slug}`} className="group inline-flex max-w-full items-baseline gap-2 text-sm">
                  <span className="truncate font-medium text-[var(--p-ink)] group-hover:underline group-hover:underline-offset-4">
                    {pickLang(m.title, nn)}
                  </span>
                  <span className={`${s.so} shrink-0 text-xs text-[var(--p-accent)]`}>{m.progress}%</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

/* ───────────────────────────── Thanh công cụ ───────────────────────────── */

function ThanhCongCu({ c, xem, setXem, oTim, setOTim, capDo, setCapDo }: {
  c: BoChu; xem: CheDoXem; setXem: (x: CheDoXem) => void;
  oTim: string; setOTim: (v: string) => void; capDo: string; setCapDo: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 py-6 md:flex-row md:items-center md:justify-between md:gap-6">
      <div role="tablist" aria-label={c.xemTheo} className="grid grid-cols-3 border border-[var(--p-rule-strong)] md:inline-grid md:w-auto">
        {CHE_DO.map((k, i) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={xem === k}
            onClick={() => setXem(k)}
            className={`whitespace-nowrap px-2 py-2.5 text-[13px] font-medium transition-colors sm:px-4 sm:text-sm ${i > 0 ? 'border-l border-[var(--p-rule-strong)]' : ''} ${
              xem === k
                ? 'bg-[var(--p-ink)] text-[var(--p-paper)]'
                : 'text-[var(--p-ink-2)] hover:bg-[var(--p-paper-2)] hover:text-[var(--p-ink)]'
            }`}
          >
            <span className="sm:hidden">{c.cheDoNgan[k]}</span>
            <span className="hidden sm:inline">{c.cheDo[k]}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-2 md:w-[26rem]">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">{c.timKiem}</span>
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--p-ink-3)]" />
          <input
            type="search"
            value={oTim}
            onChange={(e) => setOTim(e.target.value)}
            placeholder={c.timGoiY}
            className="h-11 w-full border border-[var(--p-rule)] bg-[var(--p-card)] pl-9 pr-9 text-sm text-[var(--p-ink)] placeholder:text-[var(--p-ink-3)] focus:border-[var(--p-ink-2)] [&::-webkit-search-cancel-button]:hidden"
          />
          {oTim && (
            <button
              type="button"
              onClick={() => setOTim('')}
              aria-label={c.xoaTim}
              className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[var(--p-ink-3)] hover:text-[var(--p-ink)]"
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
            className="h-11 cursor-pointer border border-[var(--p-rule)] bg-[var(--p-card)] px-3 text-sm text-[var(--p-ink)]"
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
      className={`whitespace-nowrap border px-3 py-1.5 text-[13px] transition-colors ${
        dangChon === slug
          ? 'border-[var(--p-ink)] bg-[var(--p-ink)] text-[var(--p-paper)]'
          : 'border-[var(--p-rule)] text-[var(--p-ink-2)] hover:border-[var(--p-ink-2)] hover:text-[var(--p-ink)]'
      }`}
    >
      {nhan}
      {so != null && <span className={`${s.so} ml-1.5 opacity-60`}>{so}</span>}
    </button>
  );
  return (
    <div className="-mt-1 mb-8 flex flex-wrap gap-2">
      {chip('', c.moiChuyenNganh)}
      {cacNganh.map((n) => chip(n.slug, n.ten || c.chuyenNganhKhac, n.so))}
    </div>
  );
}

function KhongCo({ c, xoaLoc }: { c: BoChu; xoaLoc: () => void }) {
  return (
    <div className="border-t border-[var(--p-rule)] py-16 text-center">
      <p className="text-[var(--p-ink-2)]">{c.khongCo}</p>
      <button onClick={xoaLoc} className="mt-3 text-sm font-medium text-[var(--p-accent)] underline underline-offset-4">
        {c.boLocXoa}
      </button>
    </div>
  );
}

function KhungCho({ c }: { c: BoChu }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="sr-only">{c.dangTai}</p>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border-t border-[var(--p-rule)] py-8">
          <div className="shimmer-track h-3 w-24" />
          <div className="shimmer-track mt-3 h-7 w-72 max-w-full" />
          {Array.from({ length: 3 }).map((__, j) => (
            <div key={j} className="mt-5 flex gap-4">
              <div className="shimmer-track aspect-video w-24 shrink-0 sm:w-32" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="shimmer-track h-4 w-2/3" />
                <div className="shimmer-track h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────────── Theo lộ trình ───────────────────────────── */

function XemLoTrinh({ duLieu, c, nn, khop, coLoc, xoaLoc }: {
  duLieu: ChuongTrinhDaoTao; c: BoChu; nn: NgonNgu; khop: (m: MonChuongTrinh) => boolean; coLoc: boolean; xoaLoc: () => void;
}) {
  const nam = duLieu.nam
    .map((n) => ({ ...n, ky: n.ky.map((k) => ({ ...k, mon: k.mon.filter(khop) })).filter((k) => k.mon.length > 0 || !coLoc) }))
    .filter((n) => n.ky.some((k) => k.mon.length > 0));
  const moi = duLieu.chuaXep.filter(khop);
  const soKhop = nam.reduce((t, n) => t + n.ky.reduce((u, k) => u + k.mon.length, 0), 0) + moi.length;

  if (coLoc && soKhop === 0) return <KhongCo c={c} xoaLoc={xoaLoc} />;

  return (
    <>
      {coLoc ? (
        <p className="mb-2 text-sm text-[var(--p-ink-2)]" aria-live="polite">
          <span className={`${s.so} font-semibold text-[var(--p-ink)]`}>{c.ketQua(soKhop)}</span>
          {' · '}
          <button onClick={xoaLoc} className="text-[var(--p-accent)] underline underline-offset-4">{c.boLocXoa}</button>
        </p>
      ) : (
        <BanDo duLieu={duLieu} c={c} nn={nn} />
      )}

      {nam.map((n) => {
        const dau = n.ky[0]?.so ?? 0;
        const cuoi = n.ky[n.ky.length - 1]?.so ?? 0;
        return (
          <section key={n.so} aria-labelledby={`nam-${n.so}`} className="mt-16 sm:mt-24">
            <div className="grid gap-4 border-t-[3px] border-[var(--p-rule-strong)] pt-5 sm:pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
              <div className="min-w-0">
                <p className={`${s.so} text-sm text-[var(--p-ink-3)]`}>
                  {c.nam(n.so)} <span aria-hidden>·</span> {c.kyTu(dau, cuoi)}
                </p>
                <h2 id={`nam-${n.so}`} className={`${s.tieuDe} mt-1 font-editorial text-[2.1rem] font-[440] leading-tight tracking-[-0.015em] sm:text-5xl`}>
                  {chonNgonNgu(n.ten, n.tenEn, nn)}
                </h2>
              </div>
              <p className="max-w-[34rem] self-end text-base leading-relaxed text-[var(--p-ink-2)]">
                {chonNgonNgu(n.moTa, n.moTaEn, nn)}
              </p>
            </div>

            {n.ky.map((k) => {
              const bai = k.mon.reduce((t, m) => t + m.totalLessons, 0);
              const giay = k.mon.reduce((t, m) => t + m.totalDurationSeconds, 0);
              const tomTat = [c.khoa(k.mon.length), bai ? c.bai(bai) : '', c.gio(giay)].filter(Boolean).join(' · ');
              return (
                <article key={k.so} id={`ky-${k.so}`} aria-labelledby={`ky-${k.so}-ten`} className={`${s.neo} mt-12 sm:mt-14`}>
                  <header className="grid gap-x-10 gap-y-2 border-b border-[var(--p-rule)] pb-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                    <div className="min-w-0">
                      <p className={`${s.so} text-sm font-medium text-[var(--p-accent)]`}>
                        {c.hocKy(k.so)}
                      </p>
                      <h3 id={`ky-${k.so}-ten`} className={`${s.tieuDe} mt-1.5 font-editorial text-2xl font-[460] leading-snug text-[var(--p-ink)] sm:text-[1.85rem]`}>
                        {chonNgonNgu(k.ten, k.tenEn, nn)}
                      </h3>
                      <p className="mt-2 max-w-[44rem] text-[15px] leading-relaxed text-[var(--p-ink-2)]">
                        {chonNgonNgu(k.moTa, k.moTaEn, nn)}
                      </p>
                    </div>
                    <p className={`${s.so} text-xs text-[var(--p-ink-3)] md:text-right`}>{tomTat}</p>
                  </header>
                  <ol>
                    {k.mon.map((m) => (
                      <HangKhoa key={m.id} m={m} nn={nn} c={c} soThuTu={m.loTrinhThuTu ?? undefined} />
                    ))}
                  </ol>
                </article>
              );
            })}
          </section>
        );
      })}

      {moi.length > 0 && (
        <section aria-labelledby="khoa-moi" className="mt-16 sm:mt-24">
          <div className="border-t-[3px] border-[var(--p-rule-strong)] pt-5 sm:pt-6">
            <h2 id="khoa-moi" className={`${s.tieuDe} font-editorial text-[2.1rem] font-[440] leading-tight sm:text-5xl`}>{c.khoaMoi}</h2>
            <p className="mt-2 max-w-[36rem] text-base leading-relaxed text-[var(--p-ink-2)]">{c.khoaMoiMoTa}</p>
          </div>
          <ol className="mt-6 border-t border-[var(--p-rule)]">
            {moi.map((m) => <HangKhoa key={m.id} m={m} nn={nn} c={c} />)}
          </ol>
        </section>
      )}
    </>
  );
}

/** Bản đồ bốn năm — mỗi năm một cột, mỗi kỳ một liên kết neo tới phần chi tiết bên dưới. */
function BanDo({ duLieu, c, nn }: { duLieu: ChuongTrinhDaoTao; c: BoChu; nn: NgonNgu }) {
  return (
    <section aria-labelledby="ban-do" className="bg-[var(--p-paper-2)] px-4 py-7 sm:px-7 sm:py-9">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 id="ban-do" className={`${s.tieuDe} font-editorial text-2xl font-[460]`}>{c.tongQuan}</h2>
        <p className="text-sm text-[var(--p-ink-3)]">{c.tongQuanMoTa}</p>
      </div>
      <ol className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {duLieu.nam.map((n) => (
          <li key={n.so} className="min-w-0 border-t-2 border-[var(--p-rule-strong)] pt-3">
            <p className={`${s.so} text-xs text-[var(--p-ink-3)]`}>{c.nam(n.so)}</p>
            <p className="font-editorial text-lg leading-snug">{chonNgonNgu(n.ten, n.tenEn, nn)}</p>
            <ol className="mt-3">
              {n.ky.map((k) => (
                <li key={k.so} className="border-t border-[var(--p-rule)] first:border-t-0">
                  <a href={`#ky-${k.so}`} className="group grid grid-cols-[1.9rem_minmax(0,1fr)] gap-2 py-2 text-sm">
                    <span className={`${s.so} font-editorial text-[var(--p-accent)]`}>{pad2(k.so)}</span>
                    <span className="leading-snug text-[var(--p-ink)] group-hover:underline group-hover:underline-offset-4">
                      {chonNgonNgu(k.ten, k.tenEn, nn)}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
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
    <>
      {nhom.map((n) => (
        <section key={n.slug || '_'} aria-labelledby={`nganh-${n.slug || 'khac'}`} className="mb-14">
          <div className="flex items-baseline justify-between gap-4 border-b-2 border-[var(--p-rule-strong)] pb-3">
            <h2 id={`nganh-${n.slug || 'khac'}`} className={`${s.tieuDe} font-editorial text-[1.75rem] font-[460] leading-tight sm:text-3xl`}>
              {n.ten || c.chuyenNganhKhac}
            </h2>
            <p className={`${s.so} shrink-0 text-xs text-[var(--p-ink-3)]`}>{c.khoa(n.mon.length)}</p>
          </div>
          <ol>
            {n.mon.map((m) => <HangKhoa key={m.id} m={m} nn={nn} c={c} hienKy />)}
          </ol>
        </section>
      ))}
    </>
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
      <p className={`${s.so} mb-6 text-sm text-[var(--p-ink-2)]`} aria-live="polite">{c.ketQua(ds.length)}</p>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {ds.map((m) => <TheKhoa key={m.id} m={m} nn={nn} c={c} />)}
      </ul>
    </>
  );
}
