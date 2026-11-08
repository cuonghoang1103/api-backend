'use client';

/**
 * Trang /gop-y (08/11/2026): góp ý nhanh hoặc đầy đủ, báo lỗi kèm ảnh chụp màn hình, chấm sao, và xem lại
 * mọi góp ý đã gửi cùng lời trả lời của admin. Backend: src/routes/gopY.routes.ts.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Bug, Lightbulb, Sparkles, BookOpen, Heart, MessageCircle, Star, ImagePlus, X, Loader2, CheckCircle2,
  Send, Clock, ShieldCheck, Reply, MessagesSquare, ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { gopYApi, type GopYCuaToi, type LoaiGopY } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useLocale } from '@/hooks/useTranslation';
import RobotAI from '@/components/academy/RobotAI';

type Loai = Exclude<LoaiGopY, 'RATING'>;
type Ngon = 'vi' | 'en';
const L = (vi: string, en: string) => ({ vi, en });

const LOAI: { id: Loai; icon: typeof Bug; ten: { vi: string; en: string }; mo: { vi: string; en: string }; goiY: { vi: string; en: string } }[] = [
  { id: 'BUG', icon: Bug, ten: L('Báo lỗi', 'Report a bug'), mo: L('Có gì đó hỏng, sai hoặc không chạy', 'Something is broken or wrong'),
    goiY: L('Bạn đang làm gì? Điều gì đã xảy ra? Bạn mong điều gì xảy ra?\nVí dụ: Mình bấm "Nộp bài" ở Code Lab bài 3.2 thì quay mãi, không ra kết quả.',
      'What were you doing? What happened? What did you expect?') },
  { id: 'FEATURE', icon: Lightbulb, ten: L('Đề xuất tính năng', 'Suggest a feature'), mo: L('Thứ bạn muốn web có thêm', 'Something you wish existed'),
    goiY: L('Bạn muốn web có thêm gì, và nó giúp bạn việc gì?', 'What should the site do, and what would it help you with?') },
  { id: 'IMPROVE', icon: Sparkles, ten: L('Cải thiện trải nghiệm', 'Improve the experience'), mo: L('Chỗ khó dùng, chậm, rối mắt', 'Hard to use, slow or confusing'),
    goiY: L('Chỗ nào khiến bạn khó chịu hoặc mất thời gian? Nên làm thế nào thì tốt hơn?', 'What slows you down or confuses you? How could it be better?') },
  { id: 'CONTENT', icon: BookOpen, ten: L('Nội dung khoá học', 'Course content'), mo: L('Bài học sai, khó hiểu, thiếu video', 'Lessons, videos, exercises'),
    goiY: L('Bài nào, chỗ nào chưa đúng hoặc khó hiểu? Bạn muốn học thêm môn/chủ đề gì?', 'Which lesson, which part? What topic would you like next?') },
  { id: 'PRAISE', icon: Heart, ten: L('Lời khen', 'Say thanks'), mo: L('Điều bạn thích — để giữ và làm tốt hơn', 'What you love, so we keep it'),
    goiY: L('Bạn thích điều gì nhất ở CuongThai?', 'What do you like most about CuongThai?') },
  { id: 'OTHER', icon: MessageCircle, ten: L('Khác', 'Something else'), mo: L('Đóng góp, hợp tác, câu hỏi…', 'Ideas, partnerships, questions…'),
    goiY: L('Bạn muốn nói gì với mình?', 'What would you like to tell us?') },
];

const MUC_DO: { id: 'THAP' | 'VUA' | 'CAO' | 'CHAN'; ten: { vi: string; en: string }; mau: string }[] = [
  { id: 'THAP', ten: L('Nhỏ — vẫn dùng được', 'Minor'), mau: 'border-sky-400/60 text-sky-600 dark:text-sky-300' },
  { id: 'VUA', ten: L('Vừa — hơi phiền', 'Annoying'), mau: 'border-amber-400/60 text-amber-600 dark:text-amber-300' },
  { id: 'CAO', ten: L('Nặng — mất dữ liệu/sai kết quả', 'Serious'), mau: 'border-orange-500/60 text-orange-600 dark:text-orange-300' },
  { id: 'CHAN', ten: L('Chặn hẳn — không dùng được', 'Blocking'), mau: 'border-rose-500/60 text-rose-600 dark:text-rose-300' },
];

const TRANG_THAI: Record<string, { ten: { vi: string; en: string }; mau: string }> = {
  MOI: { ten: L('Đã nhận', 'Received'), mau: 'bg-slate-500/15 text-[var(--text-secondary)]' },
  DANG_XEM: { ten: L('Đang xem xét', 'In review'), mau: 'bg-amber-500/15 text-amber-600 dark:text-amber-300' },
  DA_XU_LY: { ten: L('Đã xử lý', 'Done'), mau: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' },
  BO_QUA: { ten: L('Đã ghi nhận', 'Noted'), mau: 'bg-slate-500/15 text-[var(--text-secondary)]' },
};

const TEN_SAO = [L('Rất tệ', 'Awful'), L('Chưa tốt', 'Poor'), L('Tạm được', 'Okay'), L('Tốt', 'Good'), L('Tuyệt vời', 'Excellent')];

export function ChonSao({ value, onChange, size = 30, ngon }: { value: number; onChange: (n: number) => void; size?: number; ngon: Ngon }) {
  const [hover, setHover] = useState(0);
  const hien = hover || value;
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1" role="radiogroup" aria-label={ngon === 'vi' ? 'Chấm sao' : 'Rating'} onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n}/5`}
            onMouseEnter={() => setHover(n)} onClick={() => onChange(value === n ? 0 : n)}
            className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500">
            <Star style={{ width: size, height: size }}
              className={n <= hien ? 'fill-amber-400 text-amber-400' : 'text-[var(--text-muted)] opacity-50'} />
          </button>
        ))}
      </div>
      <span className="min-w-[6rem] text-sm text-[var(--text-secondary)]">{hien ? TEN_SAO[hien - 1][ngon] : ''}</span>
    </div>
  );
}

function ngayGio(iso: string, ngon: Ngon) {
  try {
    return new Date(iso).toLocaleString(ngon === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
}

export default function TrangGopY() {
  const ngon: Ngon = useLocale() === 'en' ? 'en' : 'vi';
  const t = (v: { vi: string; en: string }) => v[ngon];
  const sp = useSearchParams();
  const daDangNhap = useAuthStore((s) => s.isAuthenticated);

  const loaiDau = (sp.get('loai') || '').toUpperCase() as Loai;
  const [loai, setLoai] = useState<Loai>(LOAI.some((x) => x.id === loaiDau) ? loaiDau : 'BUG');
  const [soSao, setSoSao] = useState(0);
  const [tieuDe, setTieuDe] = useState('');
  const [noiDung, setNoiDung] = useState('');
  const [mucDo, setMucDo] = useState<'THAP' | 'VUA' | 'CAO' | 'CHAN' | null>(null);
  const [trang, setTrang] = useState('');
  const [email, setEmail] = useState('');
  const [anh, setAnh] = useState<string[]>([]);
  const [dangTai, setDangTai] = useState(false);
  const [dangGui, setDangGui] = useState(false);
  const [daGui, setDaGui] = useState<number | null>(null);
  const [lichSu, setLichSu] = useState<GopYCuaToi[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const xem = Number(sp.get('xem') || 0);

  // Trang đang xem: ?trang=/duong-dan (từ hộp tự hiện / nút báo lỗi), không có thì trang vừa rời (cùng web).
  useEffect(() => {
    const q = sp.get('trang');
    if (q && q.startsWith('/')) { setTrang(q.slice(0, 300)); return; }
    try {
      const r = document.referrer ? new URL(document.referrer) : null;
      if (r && r.origin === window.location.origin && !r.pathname.startsWith('/gop-y')) setTrang((r.pathname + r.search).slice(0, 300));
    } catch { /* bỏ qua */ }
  }, [sp]);

  const taiLichSu = useCallback(() => {
    if (!daDangNhap) { setLichSu(null); return; }
    gopYApi.cuaToi().then(setLichSu).catch(() => setLichSu([]));
  }, [daDangNhap]);
  useEffect(() => { taiLichSu(); }, [taiLichSu]);

  useEffect(() => {
    if (!xem || !lichSu) return;
    document.getElementById(`gop-y-${xem}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [xem, lichSu]);

  const themAnh = useCallback(async (files: File[]) => {
    if (!daDangNhap) { toast.info(t(L('Đăng nhập để đính kèm ảnh chụp màn hình.', 'Sign in to attach screenshots.'))); return; }
    const anhMoi = files.filter((f) => f.type.startsWith('image/')).slice(0, 3 - anh.length);
    if (!anhMoi.length) return;
    setDangTai(true);
    try {
      for (const f of anhMoi) {
        if (f.size > 8 * 1024 * 1024) { toast.error(t(L('Ảnh quá 8 MB.', 'Image is over 8 MB.'))); continue; }
        const url = await gopYApi.taiAnh(f);
        setAnh((a) => (a.length < 3 ? [...a, url] : a));
      }
    } catch {
      toast.error(t(L('Không tải được ảnh — thử lại nhé.', 'Upload failed — please try again.')));
    } finally { setDangTai(false); }
  }, [anh.length, daDangNhap, ngon]); // eslint-disable-line react-hooks/exhaustive-deps

  // Dán ảnh (Ctrl/⌘+V) thẳng vào trang.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? []).filter((f) => f.type.startsWith('image/'));
      if (files.length) { e.preventDefault(); void themAnh(files); }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [themAnh]);

  const loaiHienTai = useMemo(() => LOAI.find((x) => x.id === loai)!, [loai]);

  const gui = async (e: React.FormEvent) => {
    e.preventDefault();
    if (noiDung.trim().length < 5) { toast.error(t(L('Viết vài dòng để mình hiểu rõ nhé (ít nhất 5 ký tự).', 'Please write a few words (5+ characters).'))); return; }
    setDangGui(true);
    try {
      const r = await gopYApi.gui({
        loai, soSao: soSao || null, tieuDe: tieuDe.trim() || undefined, noiDung: noiDung.trim(),
        mucDo: loai === 'BUG' ? mucDo : null, trang: trang.trim() || undefined, nguon: 'PAGE',
        emailLienHe: !daDangNhap && email.trim() ? email.trim() : undefined, anhUrls: anh,
        manHinh: `${window.innerWidth}×${window.innerHeight}`,
      });
      setDaGui(r.id);
      setTieuDe(''); setNoiDung(''); setMucDo(null); setAnh([]); setSoSao(0);
      taiLichSu();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const m = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(m || t(L('Chưa gửi được — thử lại sau ít phút nhé.', 'Could not send — please try again shortly.')));
    } finally { setDangGui(false); }
  };

  const o = 'rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]';
  const nhap = 'w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25';

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:pt-12">
      {/* ── Đầu trang ── */}
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border-color)] bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 p-6 sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <RobotAI size={72} className="shrink-0 drop-shadow-lg" />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              {t(L('Góp ý & báo lỗi', 'Feedback & bug reports'))}
            </h1>
            <p className="mt-2 max-w-2xl text-[var(--text-secondary)] sm:text-lg">
              {t(L('Gặp lỗi, thấy chỗ khó dùng, muốn có thêm tính năng hay chỉ muốn nói lời cảm ơn — viết cho mình ở đây. Mọi góp ý đều được đọc, và bạn sẽ thấy câu trả lời ngay trên trang này.',
                'Found a bug, something awkward, a feature you want — or just want to say thanks? Write it here. Every message is read, and replies show up right on this page.'))}
            </p>
          </div>
        </div>
        <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
          {[
            { icon: ShieldCheck, chu: L('Đọc hết mọi góp ý — không có hộp thư bỏ quên', 'Every message is read') },
            { icon: Clock, chu: L('Thường trả lời trong 1–2 ngày', 'Usually answered within 1–2 days') },
            { icon: Bug, chu: L('Lỗi chặn được sửa trước tiên', 'Blocking bugs are fixed first') },
          ].map(({ icon: I, chu }) => (
            <li key={chu.vi} className="flex items-center gap-2.5 rounded-xl bg-[var(--bg-card)]/70 px-3.5 py-2.5 text-[var(--text-secondary)] backdrop-blur">
              <I className="h-4 w-4 shrink-0 text-indigo-500" /> {t(chu)}
            </li>
          ))}
        </ul>
      </section>

      {daGui && (
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 sm:flex-row sm:items-center">
          <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-500" />
          <div className="flex-1">
            <p className="font-semibold text-[var(--text-primary)]">{t(L(`Đã nhận góp ý #${daGui} — cảm ơn bạn rất nhiều!`, `Feedback #${daGui} received — thank you!`))}</p>
            <p className="text-sm text-[var(--text-secondary)]">
              {daDangNhap
                ? t(L('Khi admin trả lời, bạn sẽ nhận thông báo và thấy câu trả lời ở mục "Góp ý của bạn" bên dưới.', 'You will be notified when we reply; replies appear under "Your feedback" below.'))
                : t(L('Nếu bạn để lại email, mình sẽ trả lời qua email.', 'If you left an email, we will reply there.'))}
            </p>
          </div>
          <button type="button" onClick={() => setDaGui(null)} className="rounded-xl border border-[var(--border-color)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-primary)]">
            {t(L('Gửi góp ý khác', 'Send another'))}
          </button>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ── Biểu mẫu ── */}
        <form onSubmit={gui} className={`${o} p-5 sm:p-7`}>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t(L('1. Bạn muốn góp ý về điều gì?', '1. What is it about?'))}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {LOAI.map(({ id, icon: I, ten, mo }) => {
              const chon = loai === id;
              return (
                <button key={id} type="button" onClick={() => setLoai(id)} aria-pressed={chon}
                  className={`group flex flex-col items-start gap-1.5 rounded-xl border p-3.5 text-left transition ${chon
                    ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/25'
                    : 'border-[var(--border-color)] hover:border-indigo-400/60 hover:bg-[var(--bg-primary)]'}`}>
                  <I className={`h-5 w-5 ${chon ? 'text-indigo-500' : 'text-[var(--text-secondary)] group-hover:text-indigo-500'}`} />
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{t(ten)}</span>
                  <span className="text-xs leading-snug text-[var(--text-muted)]">{t(mo)}</span>
                </button>
              );
            })}
          </div>

          <h2 className="mt-8 text-lg font-semibold text-[var(--text-primary)]">{t(L('2. Kể cho mình nghe', '2. Tell us more'))}</h2>
          <div className="mt-4 space-y-4">
            <input value={tieuDe} onChange={(e) => setTieuDe(e.target.value)} maxLength={200} className={nhap}
              placeholder={t(L('Tóm tắt một dòng (không bắt buộc)', 'One-line summary (optional)'))} />
            <textarea value={noiDung} onChange={(e) => setNoiDung(e.target.value)} maxLength={5000} rows={7} required
              className={`${nhap} resize-y leading-relaxed`} placeholder={t(loaiHienTai.goiY)} />
            <div className="-mt-2 text-right text-xs text-[var(--text-muted)]">{noiDung.length}/5000</div>

            {loai === 'BUG' && (
              <div>
                <p className="mb-2 text-sm font-medium text-[var(--text-primary)]">{t(L('Mức độ ảnh hưởng', 'How bad is it?'))}</p>
                <div className="flex flex-wrap gap-2">
                  {MUC_DO.map((m) => (
                    <button key={m.id} type="button" onClick={() => setMucDo(mucDo === m.id ? null : m.id)} aria-pressed={mucDo === m.id}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${mucDo === m.id ? `${m.mau} bg-[var(--bg-primary)] font-semibold` : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]'}`}>
                      {t(m.ten)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]" htmlFor="gop-y-trang">
                {t(L('Ở trang nào?', 'Which page?'))} <span className="font-normal text-[var(--text-muted)]">{t(L('(không bắt buộc)', '(optional)'))}</span>
              </label>
              <input id="gop-y-trang" value={trang} onChange={(e) => setTrang(e.target.value)} maxLength={300} className={nhap}
                placeholder="/courses/nodejs/learn" />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-[var(--text-primary)]">
                {t(L('Ảnh chụp màn hình', 'Screenshots'))} <span className="font-normal text-[var(--text-muted)]">{t(L('(tối đa 3 — có thể dán bằng Ctrl/⌘ + V)', '(up to 3 — paste with Ctrl/⌘ + V)'))}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {anh.map((u) => (
                  <div key={u} className="relative h-20 w-28 overflow-hidden rounded-lg border border-[var(--border-color)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => setAnh((a) => a.filter((x) => x !== u))} aria-label={t(L('Bỏ ảnh', 'Remove'))}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"><X className="h-3 w-3" /></button>
                  </div>
                ))}
                {anh.length < 3 && (
                  <button type="button" onClick={() => (daDangNhap ? fileRef.current?.click() : themAnh([]))} disabled={dangTai}
                    className="flex h-20 w-28 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[var(--border-color)] text-xs text-[var(--text-muted)] hover:border-indigo-400 hover:text-indigo-500 disabled:opacity-60">
                    {dangTai ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                    {t(L('Thêm ảnh', 'Add image'))}
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" multiple hidden
                  onChange={(e) => { void themAnh(Array.from(e.target.files ?? [])); e.target.value = ''; }} />
              </div>
              {!daDangNhap && <p className="mt-1.5 text-xs text-[var(--text-muted)]">{t(L('Đăng nhập để đính kèm ảnh.', 'Sign in to attach images.'))}</p>}
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-[var(--text-primary)]">
                {t(L('Bạn chấm CuongThai bao nhiêu sao?', 'How would you rate CuongThai?'))} <span className="font-normal text-[var(--text-muted)]">{t(L('(không bắt buộc)', '(optional)'))}</span>
              </p>
              <ChonSao value={soSao} onChange={setSoSao} ngon={ngon} />
            </div>

            {!daDangNhap && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]" htmlFor="gop-y-email">
                  {t(L('Email để nhận trả lời', 'Email for a reply'))} <span className="font-normal text-[var(--text-muted)]">{t(L('(không bắt buộc)', '(optional)'))}</span>
                </label>
                <input id="gop-y-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} className={nhap} placeholder="ban@email.com" />
              </div>
            )}
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--text-muted)]">
              {t(L('Mình tự kèm loại trình duyệt và cỡ màn hình để dễ tái hiện lỗi — không thu thập gì khác.', 'Browser and screen size are attached to help reproduce bugs — nothing else.'))}
            </p>
            <button type="submit" disabled={dangGui || dangTai}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110 disabled:opacity-60">
              {dangGui ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {t(L('Gửi góp ý', 'Send feedback'))}
            </button>
          </div>
        </form>

        {/* ── Cột phụ ── */}
        <aside className="space-y-5">
          <div className={`${o} p-5`}>
            <h3 className="font-semibold text-[var(--text-primary)]">{t(L('Sau khi bạn gửi', 'What happens next'))}</h3>
            <ol className="mt-3 space-y-3 text-sm text-[var(--text-secondary)]">
              {[
                L('Góp ý tới thẳng hộp thư và email của admin.', 'It lands in the admin inbox and email.'),
                L('Admin đọc, phân loại và bắt tay xử lý.', 'We read, triage and start working on it.'),
                L('Bạn nhận thông báo kèm câu trả lời ở trang này.', 'You get a notification and the reply here.'),
              ].map((x, i) => (
                <li key={i} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-500">{i + 1}</span>{t(x)}</li>
              ))}
            </ol>
          </div>
          <div className={`${o} p-5`}>
            <h3 className="font-semibold text-[var(--text-primary)]">{t(L('Cần gấp?', 'Need help right now?'))}</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{t(L('Nhắn trực tiếp cho admin, hoặc xem các kênh liên hệ khác.', 'Message the admin directly, or see other contact options.'))}</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/messages" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"><MessagesSquare className="h-4 w-4" />{t(L('Nhắn tin hỗ trợ', 'Support chat'))}<ArrowRight className="h-3.5 w-3.5" /></Link>
              <Link href="/about#contact" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"><MessageCircle className="h-4 w-4" />{t(L('Trang liên hệ', 'Contact page'))}<ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Lịch sử ── */}
      <section id="lich-su" className="mt-12 scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">{t(L('Góp ý của bạn', 'Your feedback'))}</h2>
        {!daDangNhap ? (
          <p className="mt-3 text-[var(--text-secondary)]">
            <Link href="/login?redirect=%2Fgop-y" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">{t(L('Đăng nhập', 'Sign in'))}</Link>
            {t(L(' để xem lại các góp ý đã gửi và câu trả lời của admin.', ' to see what you sent and the replies.'))}
          </p>
        ) : lichSu === null ? (
          <div className="mt-4 flex items-center gap-2 text-[var(--text-muted)]"><Loader2 className="h-4 w-4 animate-spin" />{t(L('Đang tải…', 'Loading…'))}</div>
        ) : lichSu.length === 0 ? (
          <p className="mt-3 text-[var(--text-secondary)]">{t(L('Bạn chưa gửi góp ý nào. Góp ý đầu tiên luôn được chờ đón nhất!', 'Nothing yet — your first one is very welcome!'))}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {lichSu.map((g) => {
              const tt = TRANG_THAI[g.trangThai] ?? TRANG_THAI.MOI;
              const lo = LOAI.find((x) => x.id === g.loai);
              const I = lo?.icon ?? Star;
              return (
                <li key={g.id} id={`gop-y-${g.id}`} className={`${o} p-4 sm:p-5 ${xem === g.id ? 'ring-2 ring-indigo-500/50' : ''}`}>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <I className="h-4 w-4 text-indigo-500" />
                    <span className="font-semibold text-[var(--text-primary)]">{lo ? t(lo.ten) : t(L('Đánh giá nhanh', 'Quick rating'))}</span>
                    <span className="text-[var(--text-muted)]">#{g.id} · {ngayGio(g.createdAt, ngon)}</span>
                    {g.soSao ? <span className="text-amber-500">{'★'.repeat(g.soSao)}<span className="opacity-30">{'★'.repeat(5 - g.soSao)}</span></span> : null}
                    <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${tt.mau}`}>{t(tt.ten)}</span>
                  </div>
                  {g.tieuDe && <p className="mt-2 font-medium text-[var(--text-primary)]">{g.tieuDe}</p>}
                  {g.noiDung && <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--text-secondary)]">{g.noiDung}</p>}
                  {g.traLoi && (
                    <div className="mt-3 rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3.5">
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                        <Reply className="h-3.5 w-3.5" />{t(L('Admin trả lời', 'Reply from admin'))}{g.traLoiLuc ? ` · ${ngayGio(g.traLoiLuc, ngon)}` : ''}
                      </p>
                      <p className="whitespace-pre-wrap text-sm text-[var(--text-primary)]">{g.traLoi}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
