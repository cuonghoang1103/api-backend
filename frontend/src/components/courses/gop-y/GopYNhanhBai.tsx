'use client';

/**
 * Ô GÓP Ý NHANH ngay trong trang học (14/11/2026) — docs/gop-y-khoa-hoc.md.
 *
 * Người học đang xem video thấy chỗ đọc sai / vấp / khó hiểu / thiếu ⇒ bấm MỘT chip, mốc video (mm:ss) + track đang
 * xem (VI/EN/YT) tự điền, gõ vài chữ, Enter. Góp ý gắn đúng bài + đúng vị trí ⇒ điều phối kéo về bằng
 * scripts/gop-y/keo.mjs, ánh xạ mốc ⇒ tập video ⇒ câu lời đọc ⇒ sửa đúng câu đó.
 *
 * Ngay dưới là danh sách góp ý của bài (mọi người, mới nhất trước) kèm trạng thái + kết quả đối chiếu — người học
 * thấy góp ý đã được xử lý. Bấm mốc ⇒ tua video tới đó (khác track ⇒ chuyển track rồi tua).
 *
 * Trang học luôn là mặt nền tối (`bg-darkcard` ⇒ globals.css ghim bảng màu tối cho cả theme sáng), nên màu dùng
 * `text-text-*` + `text-tone-*` (đọc biến đã ghim) — KHÔNG dùng `dark:`.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, Clock, Loader2, MessageSquareText, RotateCcw, Send, X } from 'lucide-react';
import { courseSuggestionsApi } from '@/lib/api';
import {
  CHU_GOP_Y, CHU_GOP_Y_NHANH, LOAI_NHANH, dinhDangMoc, docMoc,
  type GopYKhoa, type LoaiGopY, type NguonVideoGopY, type TrangThaiGopY,
} from '@/lib/gopYKhoa';

type LoaiNhanh = (typeof LOAI_NHANH)[number];

/** Màu huy hiệu trạng thái trên mặt nền tối của trang học. */
const MAU_TT: Record<TrangThaiGopY, string> = {
  MOI: 'bg-violet-500/15 text-tone-violet',
  DANG_DOI_CHIEU: 'bg-cyan-500/15 text-tone-cyan',
  DA_CO: 'bg-green-500/15 text-tone-green',
  NEN_BO_SUNG: 'bg-amber-500/15 text-tone-amber',
  DA_LEN_KE_HOACH: 'bg-sky-500/15 text-tone-sky',
  DA_BO_SUNG: 'bg-emerald-500/15 text-tone-emerald',
  KHONG_CHINH_XAC: 'bg-rose-500/15 text-tone-rose',
  TRUNG: 'bg-white/5 text-text-muted',
  AN: 'bg-white/5 text-text-muted',
};

// text-base dưới sm: iOS Safari tự phóng to trang khi chạm vào ô chữ < 16px.
const O_NHAP =
  'w-full rounded-lg border border-darkborder bg-darkbg px-3 py-2 text-base sm:text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/60 focus:outline-none';

const KHOA_THU_GON = 'gopYNhanh.thuGon';
const SO_HIEN_DAU = 3;

function loiApi(e: unknown): { status?: number; message?: string } {
  const r = (e as { response?: { status?: number; data?: { message?: string } } })?.response;
  return { status: r?.status, message: r?.data?.message };
}

export interface GopYNhanhBaiProps {
  courseSlug: string;
  lessonId: number;
  locale: string;
  daDangNhap: boolean;
  /** Bài có video đang hiện (để gắn mốc + track). */
  coVideo: boolean;
  /** Track đang xem: VI | EN | YT (null = không có video). */
  track: NguonVideoGopY | null;
  /** Đọc mốc hiện tại từ player thật; null = player không cho đọc (iframe nhúng lạ) ⇒ nhập tay. */
  layGiay: () => number | null;
  /** Tua tới mốc (khác track ⇒ trang học chuyển track rồi tua). */
  tuaToi: (giay: number, track: NguonVideoGopY | null) => void;
}

export default function GopYNhanhBai({
  courseSlug, lessonId, locale, daDangNhap, coVideo, track, layGiay, tuaToi,
}: GopYNhanhBaiProps) {
  const en = locale === 'en';
  const t = CHU_GOP_Y_NHANH[en ? 'en' : 'vi'];
  const tc = CHU_GOP_Y[en ? 'en' : 'vi'];

  const [thuGon, setThuGon] = useState(false);
  useEffect(() => {
    try { setThuGon(window.localStorage.getItem(KHOA_THU_GON) === '1'); } catch { /* chế độ riêng tư */ }
  }, []);
  const doiThuGon = () => {
    setThuGon((v) => {
      try { window.localStorage.setItem(KHOA_THU_GON, v ? '0' : '1'); } catch { /* bỏ */ }
      return !v;
    });
  };

  // ── Form ──
  const [loai, setLoai] = useState<LoaiNhanh | null>(null);
  const [moc, setMoc] = useState('');
  const [mocTay, setMocTay] = useState(false);
  const [khongTuDong, setKhongTuDong] = useState(false);
  const [tuSai, setTuSai] = useState('');
  const [nenDoc, setNenDoc] = useState('');
  const [noiDung, setNoiDung] = useState('');
  const [dangGui, setDangGui] = useState(false);
  const [vuaGui, setVuaGui] = useState(false);
  const oChinhRef = useRef<HTMLTextAreaElement | null>(null);
  const oTuSaiRef = useRef<HTMLInputElement | null>(null);

  // ── Danh sách ──
  const [ds, setDs] = useState<GopYKhoa[]>([]);
  const [tong, setTong] = useState(0);
  const [trang, setTrang] = useState(1);
  const [soTrang, setSoTrang] = useState(1);
  const [dangTai, setDangTai] = useState(true);
  const [moHet, setMoHet] = useState(false);

  const taiDs = useCallback(async (p: number) => {
    setDangTai(true);
    try {
      const r = await courseSuggestionsApi.list(courseSlug, { lessonId, limit: 20, page: p, sapXep: 'moi' });
      const d = r.data.data;
      setDs((cu) => (p === 1 ? d.items : [...cu, ...d.items.filter((x) => !cu.some((c) => c.id === x.id))]));
      setTong(d.total);
      setTrang(d.page);
      setSoTrang(d.totalPages);
    } catch {
      // Danh sách không tải được không được làm hỏng trang học — chỉ để trống.
    } finally {
      setDangTai(false);
    }
  }, [courseSlug, lessonId]);

  // Đổi bài ⇒ làm mới mọi thứ.
  useEffect(() => {
    setLoai(null); setMoc(''); setMocTay(false); setTuSai(''); setNenDoc(''); setNoiDung(''); setMoHet(false); setVuaGui(false);
    void taiDs(1);
  }, [taiDs]);

  const batMoc = useCallback(() => {
    if (!coVideo) return;
    const g = layGiay();
    if (g == null || !Number.isFinite(g)) {
      setKhongTuDong(true);
      return;
    }
    setKhongTuDong(false);
    setMoc(dinhDangMoc(g));
    setMocTay(false);
  }, [coVideo, layGiay]);

  const chonLoai = (l: LoaiNhanh) => {
    setLoai(l);
    setVuaGui(false);
    if (!mocTay) batMoc();
    // Lấy nét sau khi khung form đã vẽ.
    window.setTimeout(() => (l === 'DOC_SAI' ? oTuSaiRef.current : oChinhRef.current)?.focus(), 0);
  };

  const giayMoc = moc.trim() ? docMoc(moc) : null;
  const mocHong = moc.trim() !== '' && giayMoc == null;
  const coThuDeGui = noiDung.trim().length >= 3 || (giayMoc != null && !mocHong) || (loai === 'DOC_SAI' && tuSai.trim() !== '');

  const gui = async () => {
    if (!loai || dangGui) return;
    if (mocHong) { toast.error(t.mocSai); return; }
    if (!coThuDeGui) return;
    setDangGui(true);
    try {
      const r = await courseSuggestionsApi.create(courseSlug, {
        vaiTro: 'HOC_VIEN',
        nhanh: true,
        lessonId,
        loai: loai as LoaiGopY,
        noiDung: noiDung.trim(),
        thoiDiemGiay: giayMoc,
        nguonVideo: giayMoc != null && coVideo ? track : null,
        tuSai: loai === 'DOC_SAI' ? tuSai.trim() || null : null,
        nenDoc: loai === 'DOC_SAI' ? nenDoc.trim() || null : null,
      });
      setDs((cu) => [r.data.data, ...cu]);
      setTong((n) => n + 1);
      setNoiDung(''); setTuSai(''); setNenDoc(''); setMoc(''); setMocTay(false);
      setLoai(null);
      setVuaGui(true);
      window.setTimeout(() => setVuaGui(false), 6000);
    } catch (e) {
      const l = loiApi(e);
      toast.error(l.message || (en ? 'Could not send — try again.' : 'Chưa gửi được — thử lại nhé.'));
    } finally {
      setDangGui(false);
    }
  };

  /** Enter gửi, Shift+Enter xuống dòng; Ctrl/⌘+Enter cũng gửi. Bỏ qua lúc bộ gõ (Telex/IME) đang ghép chữ. */
  const phimGui = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === 'Escape') { setLoai(null); return; }
    if (e.key !== 'Enter') return;
    if (e.shiftKey && !(e.ctrlKey || e.metaKey) && e.currentTarget.tagName === 'TEXTAREA') return;
    e.preventDefault();
    void gui();
  };

  const hien = moHet ? ds : ds.slice(0, SO_HIEN_DAU);
  const conLai = Math.max(0, tong - hien.length);
  const callbackUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : `/courses/${courseSlug}/learn`;

  return (
    <section
      aria-label={t.tieuDe}
      className="mt-3 rounded-2xl border border-darkborder/50 bg-darkcard p-3 sm:p-4"
      data-gop-y-nhanh
    >
      {/* Hàng đầu: tiêu đề + đếm + thu gọn */}
      <div className="flex items-center gap-2">
        <MessageSquareText className="h-4 w-4 shrink-0 text-tone-violet" aria-hidden />
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-text-primary">
          {t.tieuDe}
          {tong > 0 && <span className="ml-1.5 font-normal text-text-muted">({tong})</span>}
        </h3>
        <button
          type="button"
          onClick={doiThuGon}
          aria-expanded={!thuGon}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
        >
          {thuGon ? <ChevronDown className="h-3.5 w-3.5" aria-hidden /> : <ChevronUp className="h-3.5 w-3.5" aria-hidden />}
          {thuGon ? t.moRong : t.thuGon}
        </button>
      </div>

      {!thuGon && (
        <>
          {/* Chip loại nhanh */}
          <div className="mt-2.5 flex flex-wrap gap-1.5" role="group" aria-label={tc.loai}>
            {LOAI_NHANH.map((l) => {
              const on = loai === l;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => (daDangNhap ? chonLoai(l) : undefined)}
                  disabled={!daDangNhap}
                  aria-pressed={on}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    on
                      ? 'border-neon-violet/60 bg-neon-violet/15 text-tone-violet'
                      : 'border-darkborder text-text-secondary hover:border-neon-violet/40 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60'
                  }`}
                >
                  {t.chip[l]}
                </button>
              );
            })}
            {!daDangNhap && (
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="rounded-full bg-neon-violet/20 px-3 py-1.5 text-xs font-semibold text-tone-violet hover:bg-neon-violet/30"
              >
                {t.canDangNhap}
              </Link>
            )}
          </div>
          {!loai && !vuaGui && <p className="mt-1.5 text-xs text-text-muted">{t.moTa}</p>}
          {vuaGui && <p className="mt-1.5 text-xs font-medium text-tone-green" role="status">✓ {t.camOn}</p>}

          {/* Form — chỉ khi đã chọn một chip */}
          {loai && (
            <div className="mt-3 space-y-2.5 rounded-xl border border-darkborder/60 bg-darksurface/40 p-3">
              {coVideo && (
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                    <Clock className="h-3.5 w-3.5 text-tone-violet" aria-hidden />
                    {t.moc}
                    <input
                      value={moc}
                      onChange={(e) => { setMoc(e.target.value); setMocTay(true); }}
                      onKeyDown={phimGui}
                      placeholder={t.mocGoiY}
                      inputMode="numeric"
                      aria-invalid={mocHong}
                      className={`w-[5.5rem] rounded-lg border bg-darkbg px-2 py-1 text-center font-mono text-base sm:text-sm tabular-nums text-text-primary focus:outline-none ${
                        mocHong ? 'border-rose-500/70' : 'border-darkborder focus:border-neon-violet/60'
                      }`}
                    />
                  </label>
                  {track && <span className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] font-semibold text-text-muted">{track}</span>}
                  <button
                    type="button"
                    onClick={() => { setMocTay(false); batMoc(); }}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-text-secondary hover:bg-white/5 hover:text-text-primary"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                    {t.layLai}
                  </button>
                  {moc && (
                    <button
                      type="button"
                      onClick={() => { setMoc(''); setMocTay(true); }}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-text-muted hover:bg-white/5 hover:text-text-primary"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden />
                      {t.boMoc}
                    </button>
                  )}
                  {mocHong && <span className="w-full text-xs text-tone-rose">{t.mocSai}</span>}
                  {khongTuDong && !moc && <span className="w-full text-xs text-text-muted">{t.khongDocDuocMoc}</span>}
                </div>
              )}

              {loai === 'DOC_SAI' && (
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block text-xs font-medium text-text-secondary">
                    {t.tuSai}
                    <input
                      ref={oTuSaiRef}
                      value={tuSai}
                      maxLength={300}
                      onChange={(e) => setTuSai(e.target.value)}
                      onKeyDown={phimGui}
                      placeholder={t.tuSaiGoiY}
                      className={`${O_NHAP} mt-1`}
                    />
                  </label>
                  <label className="block text-xs font-medium text-text-secondary">
                    {t.nenDoc}
                    <input
                      value={nenDoc}
                      maxLength={300}
                      onChange={(e) => setNenDoc(e.target.value)}
                      onKeyDown={phimGui}
                      placeholder={t.nenDocGoiY}
                      className={`${O_NHAP} mt-1`}
                    />
                  </label>
                </div>
              )}

              <textarea
                ref={oChinhRef}
                value={noiDung}
                maxLength={2000}
                rows={2}
                onChange={(e) => setNoiDung(e.target.value)}
                onKeyDown={phimGui}
                placeholder={t.noiDungGoiY[loai]}
                className={`${O_NHAP} resize-y`}
              />

              <div className="flex flex-wrap items-center gap-2">
                <span className="hidden text-[11px] text-text-muted sm:inline">{t.phimTat}</span>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={() => setLoai(null)}
                  className="rounded-lg px-3 py-1.5 text-xs text-text-muted hover:bg-white/5 hover:text-text-primary"
                >
                  {t.huy}
                </button>
                <button
                  type="button"
                  onClick={() => void gui()}
                  disabled={dangGui || !coThuDeGui || mocHong}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-neon-indigo to-neon-violet px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity disabled:opacity-50"
                >
                  {dangGui ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Send className="h-3.5 w-3.5" aria-hidden />}
                  {dangGui ? t.dangGui : t.gui}
                </button>
              </div>
            </div>
          )}

          {/* Danh sách góp ý của bài */}
          <div className="mt-3 border-t border-darkborder/40 pt-2.5">
            {dangTai && ds.length === 0 ? (
              <p className="flex items-center gap-1.5 text-xs text-text-muted"><Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />…</p>
            ) : ds.length === 0 ? (
              <p className="text-xs text-text-muted">{t.rong}</p>
            ) : (
              <>
                <p className="mb-1.5 text-xs font-semibold text-text-secondary">{t.danhSach(tong)}</p>
                <ul className="space-y-2">
                  {hien.map((g) => (
                    <MucGopY key={g.id} g={g} en={en} track={track} tuaToi={tuaToi} />
                  ))}
                </ul>
                {conLai > 0 && (
                  <button
                    type="button"
                    disabled={dangTai}
                    onClick={() => {
                      // Lần đầu: bung hết phần đã tải (tới 20); sau đó mới tải trang kế.
                      if (!moHet) setMoHet(true);
                      else if (trang < soTrang) void taiDs(trang + 1);
                    }}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-tone-violet hover:underline disabled:opacity-60"
                  >
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                    {t.xemThem(conLai)}
                  </button>
                )}
              </>
            )}
            <Link
              href={`/courses/${courseSlug}/gop-y?lessonId=${lessonId}`}
              className="mt-2 block text-[11px] text-text-muted transition-colors hover:text-tone-violet"
            >
              {t.trangChung} →
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

function MucGopY({
  g, en, track, tuaToi,
}: {
  g: GopYKhoa;
  en: boolean;
  track: NguonVideoGopY | null;
  tuaToi: (giay: number, track: NguonVideoGopY | null) => void;
}) {
  const t = CHU_GOP_Y_NHANH[en ? 'en' : 'vi'];
  const tc = CHU_GOP_Y[en ? 'en' : 'vi'];
  const ten = g.vaiTro === 'AI_AGENT' ? (g.tenAi || 'AI') : g.nguoiGui?.ten || tc.an;
  const khacTrack = g.nguonVideo && track && g.nguonVideo !== track;
  const ngay = new Date(g.createdAt).toLocaleDateString(en ? 'en-GB' : 'vi-VN', { day: '2-digit', month: '2-digit' });
  // Nội dung do máy chủ tự soạn ("Đọc sai "X" — …" / "Chưa hiểu ở 3:12") lặp lại chip + mốc ⇒ không in lại.
  const noiDungTuSoan = g.tuSai ? g.noiDung.startsWith(`Đọc sai "${g.tuSai}"`) : g.noiDung === `${CHU_GOP_Y.vi.tenLoai[g.loai]}${g.thoiDiemGiay != null ? ` ở ${dinhDangMoc(g.thoiDiemGiay)}` : ''}`;

  return (
    <li
      className={`rounded-xl px-2.5 py-2 text-sm ${g.cuaBan ? 'bg-neon-violet/[0.07] ring-1 ring-neon-violet/25' : 'bg-white/[0.03]'}`}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-text-secondary">{tc.tenLoai[g.loai]}</span>
        {g.thoiDiemGiay != null && (
          <button
            type="button"
            onClick={() => tuaToi(g.thoiDiemGiay!, g.nguonVideo)}
            title={khacTrack ? t.trackKhac(g.nguonVideo!) : t.tuaToi(dinhDangMoc(g.thoiDiemGiay))}
            className="inline-flex items-center gap-1 rounded-full bg-neon-violet/15 px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-tone-violet transition-colors hover:bg-neon-violet/25"
          >
            <Clock className="h-3 w-3" aria-hidden />
            {dinhDangMoc(g.thoiDiemGiay)}
            {g.nguonVideo && <span className={khacTrack ? 'opacity-100' : 'opacity-60'}>· {g.nguonVideo}</span>}
          </button>
        )}
        <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${MAU_TT[g.trangThai]}`}>
          {tc.tenTrangThai[g.trangThai]}
        </span>
      </div>

      {g.tuSai && (
        <p className="mt-1 break-words text-[13px] text-text-secondary">
          🔊 {t.docSai} <q className="font-semibold text-text-primary">{g.tuSai}</q>
          {g.nenDoc && <> · {t.nenDocLa} <q className="font-semibold text-tone-green">{g.nenDoc}</q></>}
        </p>
      )}
      {!noiDungTuSoan && <p className="mt-1 whitespace-pre-wrap break-words text-[13px] leading-relaxed text-text-primary">{g.noiDung}</p>}

      <p className="mt-1 text-[11px] text-text-muted">
        {ten}
        {g.cuaBan && <span className="ml-1.5 rounded bg-neon-violet/20 px-1.5 py-px font-semibold text-tone-violet">{t.cuaBan}</span>}
        <span className="ml-1.5">· {ngay}</span>
      </p>

      {g.ketQuaDoiChieu && (
        <p className="mt-1.5 line-clamp-3 border-l-2 border-green-500/40 pl-2 text-[12px] leading-relaxed text-text-secondary">
          <span className="font-semibold text-tone-green">{t.ketQua}:</span> {g.ketQuaDoiChieu}
        </p>
      )}
    </li>
  );
}
