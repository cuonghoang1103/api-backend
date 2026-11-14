'use client';

/**
 * Trang "Góp ý & bổ sung" của MỘT khoá (/courses/<slug>/gop-y) — 14/11/2026, docs/gop-y-khoa-hoc.md.
 *
 * Trang riêng chứ không phải khối neo trong trang khoá: danh sách góp ý có thể dài + có lọc/phân trang, trang khoá
 * đã hơn 1.100 dòng, và một URL riêng là thứ AI/agent bên ngoài và thông báo admin (`?id=`) trỏ thẳng tới được.
 *
 * Tham số URL: `?lessonId=` điền sẵn bài (link "Góp ý cho bài này" ở trang học) · `?id=` ghim một góp ý lên đầu.
 * Màu: chỉ biến --k-* của chuongTrinh.module.css (tự đổi theo html.theme-dark) — KHÔNG dùng `dark:`.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  ArrowLeft, Bot, CheckCircle2, ExternalLink, Loader2, MessageSquarePlus, Send, ThumbsUp, BookOpen, ShieldCheck,
} from 'lucide-react';
import { coursesApi, courseSuggestionsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/context/LocaleContext';
import { pickLang } from '@/lib/utils';
import {
  CHU_GOP_Y, LOAI, TONE_TRANG_THAI, TRANG_THAI, VAI_TRO, duongBaiGopY,
  type BangChungGopY, type GopYKhoa, type LoaiGopY, type TrangThaiGopY, type VaiTroGopY,
} from '@/lib/gopYKhoa';
import s from '@/components/courses/chuong-trinh/chuongTrinh.module.css';

type BaiChon = { id: number; title: string; slug: string | null; nhom: string };
type KhoaGon = { id: number; slug: string; title: string; courseCode?: string | null; academyType?: string; sections?: Array<{ title: string; lessons?: Array<{ id: number; title: string; slug?: string | null }> }> };

const O_NHAP =
  'w-full rounded-xl border border-[var(--k-border)] bg-[var(--k-card-2)] px-3 py-2.5 text-sm text-[var(--k-ink)] placeholder:text-[var(--k-ink-3)] focus:border-[var(--k-accent-line)] focus:outline-none';

function loiApi(e: unknown, macDinh: string): string {
  const r = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return r || macDinh;
}

function HuyHieuTrangThai({ tt, chu }: { tt: TrangThaiGopY; chu: string }) {
  const tone = TONE_TRANG_THAI[tt];
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: tone.bg, color: tone.ink }}
    >
      {chu}
    </span>
  );
}

export default function GopYKhoaClient() {
  const params = useParams();
  const sp = useSearchParams();
  const slug = params.slug as string;
  const { locale } = useTranslation();
  const en = locale === 'en';
  const t = CHU_GOP_Y[en ? 'en' : 'vi'];
  const ngayGio = (iso: string) =>
    new Date(iso).toLocaleString(en ? 'en-GB' : 'vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Đăng nhập: giống trang khoá — backend token HOẶC phiên next-auth.
  const { isAuthenticated: isBackendAuth } = useAuthStore();
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const daDangNhap = mounted && (isBackendAuth || status === 'authenticated');

  const [khoa, setKhoa] = useState<KhoaGon | null>(null);
  const [khongThay, setKhongThay] = useState(false);

  // Bộ lọc + danh sách
  const [locTT, setLocTT] = useState<string>('');
  const [locLoai, setLocLoai] = useState<string>('');
  const [sapXep, setSapXep] = useState<'moi' | 'phieu'>('moi');
  const [trang, setTrang] = useState(1);
  const [ds, setDs] = useState<GopYKhoa[]>([]);
  const [tong, setTong] = useState(0);
  const [soTrang, setSoTrang] = useState(1);
  const [laAdmin, setLaAdmin] = useState(false);
  const [dangTai, setDangTai] = useState(true);
  const [dem, setDem] = useState<Record<string, number>>({});
  const [ghim, setGhim] = useState<GopYKhoa | null>(null);

  // Form
  const lessonIdUrl = Number(sp?.get('lessonId')) || null;
  const [vaiTro, setVaiTro] = useState<VaiTroGopY>('HOC_VIEN');
  const [laAi, setLaAi] = useState(false);
  const [tenAi, setTenAi] = useState('');
  const [loai, setLoai] = useState<LoaiGopY>('THIEU_KIEN_THUC');
  const [lessonId, setLessonId] = useState<number | null>(lessonIdUrl);
  const [noiDung, setNoiDung] = useState('');
  const [nguon, setNguon] = useState('');
  const [dangGui, setDangGui] = useState(false);

  useEffect(() => {
    let huy = false;
    coursesApi
      .getBySlug(slug, true)
      .then((r) => { if (!huy) setKhoa(r.data.data); })
      .catch(() => { if (!huy) setKhongThay(true); });
    return () => { huy = true; };
  }, [slug]);

  const baiChon: BaiChon[] = useMemo(
    () =>
      (khoa?.sections ?? []).flatMap((sec) =>
        (sec.lessons ?? []).map((l) => ({ id: l.id, title: pickLang(l.title, locale), slug: l.slug ?? null, nhom: pickLang(sec.title, locale) })),
      ),
    [khoa, locale],
  );

  const taiDem = useCallback(() => {
    courseSuggestionsApi.count(slug).then((r) => setDem(r.data.data.theoTrangThai)).catch(() => {});
  }, [slug]);

  const taiDs = useCallback(async () => {
    setDangTai(true);
    try {
      const r = await courseSuggestionsApi.list(slug, {
        trangThai: locTT || undefined, loai: locLoai || undefined, sapXep, page: trang, limit: 20,
      });
      setDs(r.data.data.items);
      setTong(r.data.data.total);
      setSoTrang(r.data.data.totalPages);
      setLaAdmin(Boolean(r.data.data.laAdmin));
    } catch (e) {
      if ((e as { response?: { status?: number } })?.response?.status === 404) setKhongThay(true);
      else toast.error(loiApi(e, t.loiTai));
    } finally {
      setDangTai(false);
    }
  }, [slug, locTT, locLoai, sapXep, trang, t.loiTai]);

  useEffect(() => { void taiDs(); }, [taiDs]);
  useEffect(() => { taiDem(); }, [taiDem, daDangNhap]);

  // ?id= ⇒ ghim góp ý đó lên đầu (link từ thông báo admin / script điều phối).
  const idUrl = Number(sp?.get('id')) || null;
  useEffect(() => {
    if (!idUrl) return;
    courseSuggestionsApi.get(slug, idUrl).then((r) => setGhim(r.data.data)).catch(() => setGhim(null));
  }, [slug, idUrl, daDangNhap]);

  const capNhatMot = (g: GopYKhoa) => {
    setDs((cu) => cu.map((x) => (x.id === g.id ? { ...x, ...g } : x)));
    setGhim((cu) => (cu && cu.id === g.id ? { ...cu, ...g } : cu));
  };

  const gui = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dangGui) return;
    setDangGui(true);
    try {
      await courseSuggestionsApi.create(slug, {
        vaiTro: laAi ? 'AI_AGENT' : vaiTro,
        laAi,
        tenAi: laAi ? tenAi.trim() : null,
        loai,
        noiDung: noiDung.trim(),
        nguon: nguon.trim() || null,
        lessonId,
      });
      toast.success(t.camOn);
      setNoiDung('');
      setNguon('');
      setLocTT('');
      setSapXep('moi');
      setTrang(1);
      await taiDs();
      taiDem();
    } catch (err) {
      toast.error(loiApi(err, en ? 'Could not send' : 'Không gửi được góp ý'));
    } finally {
      setDangGui(false);
    }
  };

  const bau = async (g: GopYKhoa) => {
    if (!daDangNhap) {
      toast.info(t.canDangNhap);
      return;
    }
    try {
      const r = await courseSuggestionsApi.vote(slug, g.id);
      capNhatMot({ ...g, daBau: r.data.data.daBau, soPhieu: r.data.data.soPhieu });
    } catch (err) {
      toast.error(loiApi(err, en ? 'Could not vote' : 'Không bấm được'));
    }
  };

  const callbackUrl = `/courses/${slug}/gop-y${lessonIdUrl ? `?lessonId=${lessonIdUrl}` : ''}`;
  const tenKhoa = khoa ? pickLang(khoa.title, locale) : '';
  const cacTT = TRANG_THAI.filter((x) => laAdmin || x !== 'AN');
  const tongDem = Object.entries(dem).reduce((a, [k, v]) => a + (k === 'AN' && !laAdmin ? 0 : v), 0);

  if (khongThay) {
    return (
      <div className={`${s.goc} min-h-screen px-4 pb-20 pt-24 text-center`}>
        <p className="text-[var(--k-ink-2)]">{en ? 'Course not found' : 'Không tìm thấy khoá học'}</p>
        <Link href="/courses" className="mt-4 inline-block font-semibold text-[var(--k-accent)]">{en ? 'Back to Courses' : 'Về trang Khoá học'}</Link>
      </div>
    );
  }

  return (
    <div className={`${s.goc} min-h-screen pb-20 pt-20 sm:pt-24`}>
      <div className="relative z-10 mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
        <Link
          href={`/courses/${slug}`}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-xl text-sm font-medium text-[var(--k-ink-2)] transition-colors hover:text-[var(--k-ink)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t.veKhoa}
        </Link>

        {/* ── Đầu trang ── */}
        <header className={`${s.the} relative overflow-hidden rounded-3xl p-5 sm:p-8`}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(circle at top right, var(--k-glow-1), transparent 40%), radial-gradient(circle at bottom left, var(--k-glow-2), transparent 36%)' }}
          />
          <div className="relative">
            <p className="mb-2 text-sm font-semibold text-[var(--k-accent)]">
              {khoa?.courseCode ? `${khoa.courseCode} · ` : ''}{tenKhoa || '…'}
            </p>
            <h1 className={`${s.tieuDe} font-heading text-[1.75rem] font-bold leading-tight text-[var(--k-ink)] sm:text-[2.2rem]`}>
              {t.tieuDe}
            </h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[var(--k-ink-2)]">{t.gioiThieu}</p>
            <ol className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-[var(--k-ink-2)]">
              {t.quyTrinh.map((buoc, i) => (
                <li key={buoc} className="inline-flex items-center gap-2 rounded-full border border-[var(--k-border)] bg-[var(--k-card-2)] px-3 py-1.5">
                  <span className={`${s.so} inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white`} style={{ background: 'var(--k-grad)' }}>
                    {i + 1}
                  </span>
                  {buoc}
                </li>
              ))}
            </ol>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
          {/* ── Form ── */}
          <section className={`${s.the} h-fit rounded-3xl p-5 sm:p-6 lg:sticky lg:top-24`} aria-labelledby="gy-form">
            <h2 id="gy-form" className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--k-ink)]">
              <MessageSquarePlus className="h-5 w-5 text-[var(--k-accent)]" aria-hidden />
              {t.formTieuDe}
            </h2>
            {!daDangNhap ? (
              <div className="rounded-2xl border border-[var(--k-border)] bg-[var(--k-card-2)] p-4 text-sm text-[var(--k-ink-2)]">
                <p>{t.canDangNhap}</p>
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                  className="mt-3 inline-flex min-h-[40px] items-center rounded-xl px-4 text-sm font-semibold text-white"
                  style={{ background: 'var(--k-grad)' }}
                >
                  {t.dangNhap}
                </Link>
              </div>
            ) : (
              <form onSubmit={gui} className="space-y-4">
                <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[var(--k-border)] bg-[var(--k-card-2)] px-3 py-2.5 text-sm font-medium text-[var(--k-ink)]">
                  <input type="checkbox" checked={laAi} onChange={(e) => setLaAi(e.target.checked)} className="h-4 w-4 accent-violet-600" />
                  <Bot className="h-4 w-4 text-[var(--k-accent)]" aria-hidden />
                  {t.laAi}
                </label>
                {laAi ? (
                  <div>
                    <label htmlFor="gy-tenai" className="mb-1.5 block text-sm font-semibold text-[var(--k-ink-2)]">{t.tenAi}</label>
                    <input id="gy-tenai" required maxLength={100} value={tenAi} onChange={(e) => setTenAi(e.target.value)} placeholder={t.tenAiGoiY} className={O_NHAP} />
                  </div>
                ) : (
                  <div>
                    <span className="mb-1.5 block text-sm font-semibold text-[var(--k-ink-2)]">{t.vaiTro}</span>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.vaiTro}>
                      {VAI_TRO.filter((v) => v !== 'AI_AGENT').map((v) => (
                        <button
                          key={v}
                          type="button"
                          role="radio"
                          aria-checked={vaiTro === v}
                          onClick={() => setVaiTro(v)}
                          className={`min-h-[36px] rounded-full border px-3.5 text-sm font-medium transition-colors ${
                            vaiTro === v
                              ? 'border-[var(--k-accent-line)] bg-[var(--k-accent-soft)] text-[var(--k-accent)]'
                              : 'border-[var(--k-border)] text-[var(--k-ink-2)] hover:border-[var(--k-border-strong)]'
                          }`}
                        >
                          {t.tenVaiTro[v]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label htmlFor="gy-loai" className="mb-1.5 block text-sm font-semibold text-[var(--k-ink-2)]">{t.loai}</label>
                  <select id="gy-loai" value={loai} onChange={(e) => setLoai(e.target.value as LoaiGopY)} className={O_NHAP}>
                    {LOAI.map((l) => <option key={l} value={l}>{t.tenLoai[l]}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="gy-bai" className="mb-1.5 block text-sm font-semibold text-[var(--k-ink-2)]">{t.bai}</label>
                  <select id="gy-bai" value={lessonId ?? ''} onChange={(e) => setLessonId(Number(e.target.value) || null)} className={O_NHAP}>
                    <option value="">{t.caKhoa}</option>
                    {Array.from(new Set(baiChon.map((b) => b.nhom))).map((nhom) => (
                      <optgroup key={nhom} label={nhom}>
                        {baiChon.filter((b) => b.nhom === nhom).map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="gy-noidung" className="mb-1.5 block text-sm font-semibold text-[var(--k-ink-2)]">{t.noiDung}</label>
                  <textarea
                    id="gy-noidung"
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={7}
                    value={noiDung}
                    onChange={(e) => setNoiDung(e.target.value)}
                    placeholder={t.noiDungGoiY}
                    className={`${O_NHAP} resize-y leading-relaxed`}
                  />
                  <p className={`${s.so} mt-1 text-right text-xs text-[var(--k-ink-3)]`}>{t.kyTu(noiDung.length)}</p>
                </div>
                <div>
                  <label htmlFor="gy-nguon" className="mb-1.5 block text-sm font-semibold text-[var(--k-ink-2)]">{t.nguon}</label>
                  <input id="gy-nguon" type="url" maxLength={1000} value={nguon} onChange={(e) => setNguon(e.target.value)} placeholder={t.nguonGoiY} className={O_NHAP} />
                </div>
                <button
                  type="submit"
                  disabled={dangGui || noiDung.trim().length < 10 || (laAi && !tenAi.trim())}
                  className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-semibold text-white shadow-lg shadow-violet-500/20 transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'var(--k-grad)' }}
                >
                  {dangGui ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
                  {dangGui ? t.dangGui : t.gui}
                </button>
              </form>
            )}
          </section>

          {/* ── Danh sách ── */}
          <section aria-labelledby="gy-ds" className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="gy-ds" className="text-lg font-bold text-[var(--k-ink)]">
                {t.danhSach} <span className={`${s.so} text-[var(--k-ink-3)]`}>({tongDem})</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                <select aria-label={t.locLoai} value={locLoai} onChange={(e) => { setLocLoai(e.target.value); setTrang(1); }} className={`${O_NHAP} !w-auto !py-2`}>
                  <option value="">{t.locLoai}: {t.tatCa}</option>
                  {LOAI.map((l) => <option key={l} value={l}>{t.tenLoai[l]}</option>)}
                </select>
                <select aria-label={t.sapXep} value={sapXep} onChange={(e) => { setSapXep(e.target.value as 'moi' | 'phieu'); setTrang(1); }} className={`${O_NHAP} !w-auto !py-2`}>
                  <option value="moi">{t.moiNhat}</option>
                  <option value="phieu">{t.nhieuPhieu}</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={t.locTrangThai}>
              {[{ v: '', nhan: t.tatCa, so: tongDem }, ...cacTT.map((x) => ({ v: x as string, nhan: t.tenTrangThai[x], so: dem[x] ?? 0 }))]
                .filter((x) => x.v === '' || x.so > 0 || x.v === locTT)
                .map((x) => (
                  <button
                    key={x.v || 'tat-ca'}
                    type="button"
                    role="tab"
                    aria-selected={locTT === x.v}
                    onClick={() => { setLocTT(x.v); setTrang(1); }}
                    className={`min-h-[34px] rounded-full border px-3 text-xs font-semibold transition-colors ${
                      locTT === x.v
                        ? 'border-[var(--k-accent-line)] bg-[var(--k-accent-soft)] text-[var(--k-accent)]'
                        : 'border-[var(--k-border)] text-[var(--k-ink-2)] hover:border-[var(--k-border-strong)]'
                    }`}
                  >
                    {x.nhan} <span className={s.so}>· {x.so}</span>
                  </button>
                ))}
            </div>

            {ghim && !ds.some((g) => g.id === ghim.id) && (
              <TheGopY g={ghim} slug={slug} t={t} en={en} laAdmin={laAdmin} ngayGio={ngayGio} onBau={bau} onCapNhat={capNhatMot} noiBat />
            )}

            {dangTai ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[var(--k-accent)]" aria-hidden /></div>
            ) : ds.length === 0 ? (
              <p className={`${s.theTrong} rounded-2xl p-6 text-center text-sm text-[var(--k-ink-3)]`}>{t.rong}</p>
            ) : (
              ds.map((g) => (
                <TheGopY key={g.id} g={g} slug={slug} t={t} en={en} laAdmin={laAdmin} ngayGio={ngayGio} onBau={bau} onCapNhat={capNhatMot} noiBat={g.id === idUrl} />
              ))
            )}

            {soTrang > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2 text-sm">
                <button type="button" disabled={trang <= 1} onClick={() => setTrang((p) => p - 1)} className="min-h-[38px] rounded-xl border border-[var(--k-border)] px-4 font-medium text-[var(--k-ink-2)] disabled:opacity-40">
                  {t.truoc}
                </button>
                <span className={`${s.so} text-[var(--k-ink-3)]`}>{trang}/{soTrang} · {tong}</span>
                <button type="button" disabled={trang >= soTrang} onClick={() => setTrang((p) => p + 1)} className="min-h-[38px] rounded-xl border border-[var(--k-border)] px-4 font-medium text-[var(--k-ink-2)] disabled:opacity-40">
                  {t.sau}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

type BoChu = (typeof CHU_GOP_Y)['vi'] | (typeof CHU_GOP_Y)['en'];

function TheGopY({
  g, slug, t, en, laAdmin, ngayGio, onBau, onCapNhat, noiBat,
}: {
  g: GopYKhoa;
  slug: string;
  t: BoChu;
  en: boolean;
  laAdmin: boolean;
  ngayGio: (iso: string) => string;
  onBau: (g: GopYKhoa) => void;
  onCapNhat: (g: GopYKhoa) => void;
  noiBat?: boolean;
}) {
  const duongBai = g.lesson ? duongBaiGopY(slug, { id: g.lesson.id, slug: g.lesson.slug }) : null;
  const tenNguoi = g.vaiTro === 'AI_AGENT' ? (g.tenAi || 'AI') : g.nguoiGui?.ten || t.an;
  return (
    <article
      id={`gop-y-${g.id}`}
      className={`${s.the} rounded-2xl p-4 sm:p-5 ${noiBat ? 'ring-2 ring-[var(--k-accent-line)]' : ''}`}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <HuyHieuTrangThai tt={g.trangThai} chu={t.tenTrangThai[g.trangThai]} />
        <span className="inline-flex items-center rounded-full bg-[var(--k-card-2)] px-2.5 py-1 text-xs font-semibold text-[var(--k-ink-2)]">
          {t.tenLoai[g.loai]}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--k-card-2)] px-2.5 py-1 text-xs font-medium text-[var(--k-ink-2)]">
          {g.vaiTro === 'AI_AGENT' && <Bot className="h-3.5 w-3.5" aria-hidden />}
          {t.tenVaiTro[g.vaiTro]} · {tenNguoi}
        </span>
        <span className={`${s.so} ml-auto text-xs text-[var(--k-ink-3)]`}>#{g.id} · {ngayGio(g.createdAt)}</span>
      </div>

      {g.lesson && (
        <p className="mt-2.5 flex items-center gap-1.5 text-sm text-[var(--k-ink-2)]">
          <BookOpen className="h-4 w-4 shrink-0 text-[var(--k-accent)]" aria-hidden />
          <span className="font-medium">{t.bai_}:</span>
          {duongBai ? (
            <Link href={duongBai} className="min-w-0 truncate font-semibold text-[var(--k-accent)] hover:underline">{pickLang(g.lesson.title, en ? 'en' : 'vi')}</Link>
          ) : (
            <span className="truncate">{pickLang(g.lesson.title, en ? 'en' : 'vi')}</span>
          )}
        </p>
      )}

      <p className="mt-2.5 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-[var(--k-ink)]">{g.noiDung}</p>

      {g.nguon && (
        <a href={g.nguon} target="_blank" rel="noopener noreferrer nofollow ugc" className="mt-2 inline-flex max-w-full items-center gap-1 text-sm font-medium text-[var(--k-accent-2)] hover:underline">
          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">{t.nguonLink}: {g.nguon}</span>
        </a>
      )}

      {(g.ketQuaDoiChieu || (g.bangChung && g.bangChung.length > 0)) && (
        <div className="mt-3.5 rounded-xl border border-[var(--k-border)] bg-[var(--k-card-2)] p-3.5">
          <p className="flex items-center gap-1.5 text-sm font-bold text-[var(--k-ink)]">
            <CheckCircle2 className="h-4 w-4 text-[var(--k-green)]" aria-hidden />
            {t.ketQua}
          </p>
          {g.ketQuaDoiChieu && <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-[var(--k-ink-2)]">{g.ketQuaDoiChieu}</p>}
          {g.bangChung && g.bangChung.length > 0 && (
            <div className="mt-2.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--k-ink-3)]">{t.bangChung}</p>
              <ul className="mt-1.5 space-y-2">
                {g.bangChung.map((b, i) => {
                  const d = duongBaiGopY(slug, b);
                  return (
                    <li key={i} className="border-l-2 border-[var(--k-accent-line)] pl-3 text-sm">
                      <span className="font-semibold text-[var(--k-ink)]">{b.tieuDe ? pickLang(b.tieuDe, en ? 'en' : 'vi') : b.lessonSlug}</span>
                      {d && (
                        <Link href={d} className="ml-2 text-xs font-semibold text-[var(--k-accent)] hover:underline">{t.moBai} →</Link>
                      )}
                      {b.trichDoan && <q className="mt-1 block whitespace-pre-wrap break-words italic text-[var(--k-ink-2)]">{b.trichDoan}</q>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {g.nguoiDoiChieu && g.doiChieuLuc && (
            <p className="mt-2 text-xs text-[var(--k-ink-3)]">{t.doiChieuBoi(g.nguoiDoiChieu, ngayGio(g.doiChieuLuc))}</p>
          )}
        </div>
      )}

      <div className="mt-3.5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onBau(g)}
          aria-pressed={g.daBau}
          className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors ${
            g.daBau
              ? 'border-[var(--k-accent-line)] bg-[var(--k-accent-soft)] text-[var(--k-accent)]'
              : 'border-[var(--k-border)] text-[var(--k-ink-2)] hover:border-[var(--k-border-strong)]'
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${g.daBau ? 'fill-current' : ''}`} aria-hidden />
          {t.cungThayCan}
          <span className={`${s.so} text-xs opacity-80`}>· {g.soPhieu}</span>
        </button>
      </div>

      {laAdmin && <KhungAdmin g={g} t={t} onCapNhat={onCapNhat} />}
    </article>
  );
}

/** Ô "slug | trích đoạn" mỗi dòng ⇔ mảng bằng chứng. */
function bangChungThanhChu(b: BangChungGopY[] | null): string {
  return (b ?? []).map((x) => [x.lessonSlug ?? (x.lessonId ? `#${x.lessonId}` : ''), x.trichDoan ?? ''].join(' | ')).join('\n');
}
function chuThanhBangChung(s: string, cu: BangChungGopY[] | null): BangChungGopY[] {
  return s
    .split('\n')
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => {
      const [dau, ...con] = d.split('|');
      const ma = dau.trim();
      const id = /^#\d+$/.test(ma) ? Number(ma.slice(1)) : null;
      // Giữ tiêu đề / tệp nguồn của bằng chứng cũ cùng bài (script điều phối ghi chúng; ô chữ không hiện).
      const goc = (cu ?? []).find((x) => (id ? x.lessonId === id : x.lessonSlug === ma));
      return { ...goc, lessonSlug: id ? (goc?.lessonSlug ?? null) : ma || null, lessonId: id ?? goc?.lessonId ?? null, trichDoan: con.join('|').trim() || null };
    });
}

function KhungAdmin({ g, t, onCapNhat }: { g: GopYKhoa; t: BoChu; onCapNhat: (g: GopYKhoa) => void }) {
  const [tt, setTt] = useState<TrangThaiGopY>(g.trangThai);
  const [kq, setKq] = useState(g.ketQuaDoiChieu ?? '');
  const [bc, setBc] = useState(bangChungThanhChu(g.bangChung));
  const [luu, setLuu] = useState(false);
  const save = async () => {
    setLuu(true);
    try {
      const r = await courseSuggestionsApi.review(g.id, { trangThai: tt, ketQuaDoiChieu: kq.trim() || null, bangChung: chuThanhBangChung(bc, g.bangChung) });
      onCapNhat({ ...r.data.data, daBau: g.daBau });
      toast.success(t.daLuu);
    } catch (err) {
      toast.error(loiApi(err, 'Lỗi'));
    } finally {
      setLuu(false);
    }
  };
  return (
    <details className="mt-3.5 rounded-xl border border-dashed border-[var(--k-border-strong)] p-3">
      <summary className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-[var(--k-ink-2)]">
        <ShieldCheck className="h-4 w-4 text-[var(--k-accent)]" aria-hidden />
        {t.adminTieuDe}
      </summary>
      <div className="mt-3 space-y-3">
        <label className="block text-xs font-semibold text-[var(--k-ink-3)]">
          {t.adminTrangThai}
          <select value={tt} onChange={(e) => setTt(e.target.value as TrangThaiGopY)} className={`${O_NHAP} mt-1`}>
            {TRANG_THAI.map((x) => <option key={x} value={x}>{t.tenTrangThai[x]} ({x})</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold text-[var(--k-ink-3)]">
          {t.adminKetQua}
          <textarea rows={3} value={kq} onChange={(e) => setKq(e.target.value)} className={`${O_NHAP} mt-1`} />
        </label>
        <label className="block text-xs font-semibold text-[var(--k-ink-3)]">
          {t.adminBangChung}
          <textarea rows={3} value={bc} onChange={(e) => setBc(e.target.value)} className={`${O_NHAP} mt-1 font-mono text-xs`} />
        </label>
        <button
          type="button"
          onClick={save}
          disabled={luu}
          className="inline-flex min-h-[38px] items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-60"
          style={{ background: 'var(--k-grad)' }}
        >
          {luu && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {t.adminLuu}
        </button>
      </div>
    </details>
  );
}
