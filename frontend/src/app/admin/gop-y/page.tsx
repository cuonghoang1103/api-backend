'use client';

/**
 * /admin/gop-y (08/11/2026) — mọi góp ý, báo lỗi và lượt chấm sao của người dùng.
 * Lọc theo trạng thái/loại, tìm chữ, mở một góp ý để đổi trạng thái, TRẢ LỜI (người gửi thấy ở /gop-y +
 * nhận thông báo chuông) và ghi chú nội bộ. Góp ý mới cũng vào Hộp thư (/admin/thong-bao) + Telegram + email.
 */
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import {
  Bug, Lightbulb, Sparkles, BookOpen, Heart, MessageCircle, Star, Loader2, Search, RefreshCw, ExternalLink,
  Reply, StickyNote, ChevronLeft, ChevronRight, Monitor, Mail,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminGopYApi, type GopYAdmin, type ThongKeGopY, type TrangThaiGopY } from '@/lib/api';
import { cn } from '@/lib/utils';

const LOAI: Record<string, { ten: string; icon: typeof Bug; mau: string }> = {
  BUG: { ten: 'Báo lỗi', icon: Bug, mau: 'text-rose-300' },
  FEATURE: { ten: 'Tính năng', icon: Lightbulb, mau: 'text-amber-300' },
  IMPROVE: { ten: 'Cải thiện', icon: Sparkles, mau: 'text-violet-300' },
  CONTENT: { ten: 'Nội dung', icon: BookOpen, mau: 'text-sky-300' },
  PRAISE: { ten: 'Lời khen', icon: Heart, mau: 'text-pink-300' },
  OTHER: { ten: 'Khác', icon: MessageCircle, mau: 'text-slate-300' },
  RATING: { ten: 'Chấm sao', icon: Star, mau: 'text-amber-300' },
};
const TRANG_THAI: { id: TrangThaiGopY; ten: string; mau: string }[] = [
  { id: 'MOI', ten: 'Mới', mau: 'bg-indigo-500/15 text-indigo-200 border-indigo-500/30' },
  { id: 'DANG_XEM', ten: 'Đang xem', mau: 'bg-amber-500/15 text-amber-200 border-amber-500/30' },
  { id: 'DA_XU_LY', ten: 'Đã xử lý', mau: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30' },
  { id: 'BO_QUA', ten: 'Bỏ qua', mau: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
];
const MUC_DO: Record<string, string> = { THAP: 'Nhỏ', VUA: 'Vừa', CAO: 'Nặng', CHAN: 'Chặn hẳn' };

const thoiGian = (iso: string) => new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
const o = 'rounded-xl border border-white/[0.06] bg-white/[0.02]';

function Sao({ n }: { n: number | null }) {
  if (!n) return null;
  return <span className="text-amber-400">{'★'.repeat(n)}<span className="opacity-25">{'★'.repeat(5 - n)}</span></span>;
}

function ChiTiet({ g, onLuu }: { g: GopYAdmin; onLuu: (g: GopYAdmin) => void }) {
  const [traLoi, setTraLoi] = useState(g.traLoi ?? '');
  const [ghiChu, setGhiChu] = useState(g.ghiChuNoiBo ?? '');
  const [dang, setDang] = useState(false);
  useEffect(() => { setTraLoi(g.traLoi ?? ''); setGhiChu(g.ghiChuNoiBo ?? ''); }, [g.id, g.traLoi, g.ghiChuNoiBo]);

  const luu = async (d: Parameters<typeof adminGopYApi.capNhat>[1], bao: string) => {
    setDang(true);
    try { const r = await adminGopYApi.capNhat(g.id, d); onLuu({ ...g, ...r, user: g.user }); toast.success(bao); }
    catch { toast.error('Lưu không được — thử lại'); }
    finally { setDang(false); }
  };
  const L = LOAI[g.loai] ?? LOAI.OTHER;
  const I = L.icon;
  return (
    <div className={`${o} space-y-4 p-4`}>
      <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
        <I className={cn('h-4 w-4', L.mau)} /><span className="font-semibold text-text-primary">{L.ten}</span>
        <span className="text-text-muted">#{g.id} · {thoiGian(g.createdAt)} · {g.nguon === 'POPUP' ? 'hộp tự hiện' : 'trang góp ý'}</span>
        <Sao n={g.soSao} />
        {g.mucDo && <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[11px] text-rose-200">Mức độ: {MUC_DO[g.mucDo] ?? g.mucDo}</span>}
      </div>
      <div className="text-[12.5px] text-text-secondary">
        {g.user ? <>Người gửi: <b className="text-text-primary">{g.user.username}</b> · {g.user.email}</>
          : <>Khách chưa đăng nhập{g.emailLienHe ? <> · <a className="text-indigo-300 hover:underline" href={`mailto:${g.emailLienHe}`}><Mail className="mr-1 inline h-3 w-3" />{g.emailLienHe}</a></> : ' · không để lại email'}</>}
      </div>
      {g.tieuDe && <p className="text-[14px] font-semibold text-text-primary">{g.tieuDe}</p>}
      {g.noiDung ? <p className="whitespace-pre-wrap rounded-lg bg-white/[0.03] p-3 text-[13px] leading-relaxed text-text-primary">{g.noiDung}</p>
        : <p className="text-[12.5px] italic text-text-muted">Chỉ chấm sao, không viết gì.</p>}
      {g.anhUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {g.anhUrls.map((u) => (
            <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="block h-24 w-36 overflow-hidden rounded-lg border border-white/[0.08]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="h-full w-full object-cover" />
            </a>
          ))}
        </div>
      )}
      <div className="grid gap-1 text-[11.5px] text-text-muted">
        {g.trang && <a href={g.trang} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-indigo-300 hover:underline"><ExternalLink className="h-3 w-3" />{g.trang}</a>}
        {g.thietBi && <span className="inline-flex items-start gap-1"><Monitor className="mt-0.5 h-3 w-3 shrink-0" />{g.thietBi}</span>}
      </div>

      <div>
        <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-text-muted">Trạng thái</p>
        <div className="flex flex-wrap gap-2">
          {TRANG_THAI.map((t) => (
            <button key={t.id} type="button" disabled={dang} onClick={() => luu({ trangThai: t.id }, `Đã chuyển sang "${t.ten}"`)}
              className={cn('rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition', g.trangThai === t.id ? t.mau : 'border-white/[0.08] text-text-secondary hover:bg-white/[0.04]')}>
              {t.ten}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wider text-text-muted"><Reply className="h-3 w-3" />Trả lời người gửi {g.user ? '(họ thấy ở /gop-y + nhận thông báo)' : g.emailLienHe ? '(khách — trả lời qua email ở trên)' : ''}</p>
        <textarea value={traLoi} onChange={(e) => setTraLoi(e.target.value)} rows={4} maxLength={5000}
          placeholder="Cảm ơn bạn! Mình đã sửa lỗi này, bạn tải lại trang thử nhé…"
          className="w-full resize-y rounded-lg border border-white/[0.08] bg-white/[0.03] p-2.5 text-[13px] text-text-primary placeholder:text-text-muted focus:border-indigo-500/50 focus:outline-none" />
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" disabled={dang || traLoi.trim() === (g.traLoi ?? '')}
            onClick={() => luu({ traLoi: traLoi.trim() || null, ...(traLoi.trim() && g.trangThai === 'MOI' ? { trangThai: 'DA_XU_LY' as const } : {}) }, traLoi.trim() ? 'Đã gửi trả lời' : 'Đã xoá trả lời')}
            className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-[12px] font-semibold text-white hover:bg-indigo-500 disabled:opacity-40">
            {dang ? <Loader2 className="inline h-3.5 w-3.5 animate-spin" /> : 'Gửi trả lời'}
          </button>
          {g.traLoiLuc && <span className="self-center text-[11px] text-text-muted">Đã trả lời {thoiGian(g.traLoiLuc)}</span>}
        </div>
      </div>

      <div>
        <p className="mb-1.5 flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wider text-text-muted"><StickyNote className="h-3 w-3" />Ghi chú nội bộ (người gửi không thấy)</p>
        <textarea value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} rows={2} maxLength={5000}
          className="w-full resize-y rounded-lg border border-white/[0.08] bg-white/[0.03] p-2.5 text-[12.5px] text-text-primary focus:border-indigo-500/50 focus:outline-none" />
        <button type="button" disabled={dang || ghiChu === (g.ghiChuNoiBo ?? '')} onClick={() => luu({ ghiChuNoiBo: ghiChu.trim() || null }, 'Đã lưu ghi chú')}
          className="mt-2 rounded-lg border border-white/[0.1] px-3 py-1.5 text-[12px] font-semibold text-text-secondary hover:bg-white/[0.04] disabled:opacity-40">Lưu ghi chú</button>
      </div>
    </div>
  );
}

function TrangAdminGopY() {
  const sp = useSearchParams();
  const router = useRouter();
  const idMo = Number(sp.get('id') || 0) || null;
  const [trangThai, setTrangThai] = useState<string>('');
  const [loai, setLoai] = useState<string>('');
  const [tim, setTim] = useState('');
  const [timDung, setTimDung] = useState('');
  const [trang, setTrang] = useState(1);
  const [ds, setDs] = useState<{ items: GopYAdmin[]; tong: number; kichTrang: number } | null>(null);
  const [tk, setTk] = useState<ThongKeGopY | null>(null);
  const [chon, setChon] = useState<number | null>(idMo);
  const [dangTai, setDangTai] = useState(false);

  const tai = useCallback(async () => {
    setDangTai(true);
    try {
      const [d, t] = await Promise.all([
        adminGopYApi.danhSach({ trangThai: trangThai || undefined, loai: loai || undefined, tim: timDung || undefined, trang }),
        adminGopYApi.thongKe(),
      ]);
      setDs(d); setTk(t);
    } catch { toast.error('Không tải được góp ý'); }
    finally { setDangTai(false); }
  }, [trangThai, loai, timDung, trang]);
  useEffect(() => { void tai(); }, [tai]);

  // Mở thẳng từ Hộp thư / email (?id=…): góp ý đó có thể không nằm trong trang lọc hiện tại.
  useEffect(() => {
    if (!idMo || !ds || ds.items.some((x) => x.id === idMo)) return;
    adminGopYApi.danhSach({ id: idMo }).then((r) => {
      if (r.items[0]) setDs((cu) => (cu ? { ...cu, items: [r.items[0], ...cu.items.filter((x) => x.id !== idMo)] } : cu));
    }).catch(() => {});
  }, [idMo, ds]);

  const dangChon = ds?.items.find((x) => x.id === chon) ?? null;
  const capNhatMot = (g: GopYAdmin) => { setDs((cu) => (cu ? { ...cu, items: cu.items.map((x) => (x.id === g.id ? g : x)) } : cu)); void adminGopYApi.thongKe().then(setTk).catch(() => {}); };
  const soTrang = ds ? Math.max(1, Math.ceil(ds.tong / ds.kichTrang)) : 1;

  return (
    <div className="space-y-5 p-1">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold text-text-primary">Góp ý & báo lỗi</h1>
        <button type="button" onClick={() => void tai()} className="rounded-lg p-1.5 text-text-muted hover:bg-white/[0.05] hover:text-text-primary" aria-label="Tải lại">
          <RefreshCw className={cn('h-4 w-4', dangTai && 'animate-spin')} />
        </button>
        <a href="/gop-y" target="_blank" rel="noopener noreferrer" className="ml-auto text-[12px] text-indigo-300 hover:underline">Xem trang người dùng thấy ↗</a>
      </div>

      {tk && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className={`${o} p-3.5`}>
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-text-muted">Sao trung bình</p>
            <p className="mt-1 text-2xl font-bold text-text-primary">{tk.saoTrungBinh ? tk.saoTrungBinh.toFixed(2) : '—'}<span className="ml-1 text-sm text-amber-400">★</span></p>
            <p className="text-[11.5px] text-text-muted">{tk.soLuotSao} lượt · 30 ngày: {tk.saoTrungBinh30 ? tk.saoTrungBinh30.toFixed(2) : '—'} ({tk.soLuotSao30})</p>
          </div>
          <div className={`${o} p-3.5`}>
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-text-muted">Phân bố sao</p>
            <div className="mt-1.5 space-y-0.5">
              {[5, 4, 3, 2, 1].map((n) => {
                const c = tk.phanBoSao[String(n)] ?? 0;
                const max = Math.max(1, ...Object.values(tk.phanBoSao));
                return (
                  <div key={n} className="flex items-center gap-2 text-[11px] text-text-muted">
                    <span className="w-3">{n}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded bg-white/[0.05]"><div className="h-full rounded bg-amber-400/80" style={{ width: `${(c / max) * 100}%` }} /></div>
                    <span className="w-6 text-right">{c}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={`${o} p-3.5`}>
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-text-muted">Cần xử lý</p>
            <p className="mt-1 text-2xl font-bold text-text-primary">{(tk.theoTrangThai.MOI ?? 0) + (tk.theoTrangThai.DANG_XEM ?? 0)}</p>
            <p className="text-[11.5px] text-text-muted">Mới {tk.theoTrangThai.MOI ?? 0} · Đang xem {tk.theoTrangThai.DANG_XEM ?? 0} · Xong {tk.theoTrangThai.DA_XU_LY ?? 0}</p>
          </div>
          <div className={`${o} p-3.5`}>
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-text-muted">Theo loại</p>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11.5px] text-text-secondary">
              {Object.entries(LOAI).map(([k, v]) => <span key={k}>{v.ten} <b className="text-text-primary">{tk.theoLoai[k as keyof typeof tk.theoLoai] ?? 0}</b></span>)}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <select value={trangThai} onChange={(e) => { setTrangThai(e.target.value); setTrang(1); }} className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[12.5px] text-text-primary">
          <option value="">Mọi trạng thái</option>
          {TRANG_THAI.map((t) => <option key={t.id} value={t.id}>{t.ten}</option>)}
        </select>
        <select value={loai} onChange={(e) => { setLoai(e.target.value); setTrang(1); }} className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[12.5px] text-text-primary">
          <option value="">Mọi loại</option>
          {Object.entries(LOAI).map(([k, v]) => <option key={k} value={k}>{v.ten}</option>)}
        </select>
        <form onSubmit={(e) => { e.preventDefault(); setTimDung(tim); setTrang(1); }} className="relative min-w-[220px] flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
          <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm nội dung, trang, người gửi… (Enter)"
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-1.5 pl-8 pr-3 text-[12.5px] text-text-primary placeholder:text-text-muted focus:outline-none" />
        </form>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-2">
          {!ds ? <div className="flex items-center gap-2 p-4 text-text-muted"><Loader2 className="h-4 w-4 animate-spin" />Đang tải…</div>
            : ds.items.length === 0 ? <p className="p-4 text-[13px] text-text-muted">Chưa có góp ý nào khớp bộ lọc.</p>
              : ds.items.map((g) => {
                const L = LOAI[g.loai] ?? LOAI.OTHER; const I = L.icon;
                const tt = TRANG_THAI.find((t) => t.id === g.trangThai) ?? TRANG_THAI[0];
                return (
                  <button key={g.id} type="button" onClick={() => { setChon(g.id); router.replace(`/admin/gop-y?id=${g.id}`, { scroll: false }); }}
                    className={cn(`${o} block w-full p-3 text-left transition hover:bg-white/[0.04]`, chon === g.id && 'border-indigo-500/50 bg-indigo-500/[0.06]')}>
                    <div className="flex items-center gap-2 text-[12px]">
                      <I className={cn('h-3.5 w-3.5 shrink-0', L.mau)} />
                      <span className="font-semibold text-text-primary">{L.ten}</span>
                      <Sao n={g.soSao} />
                      {g.traLoi && <Reply className="h-3 w-3 text-emerald-300" aria-label="Đã trả lời" />}
                      <span className={cn('ml-auto rounded-full border px-2 py-0.5 text-[10.5px] font-semibold', tt.mau)}>{tt.ten}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[12.5px] text-text-secondary">{g.tieuDe ? <b className="text-text-primary">{g.tieuDe} — </b> : null}{g.noiDung || 'Chỉ chấm sao'}</p>
                    <p className="mt-1 text-[11px] text-text-muted">#{g.id} · {g.user?.username ?? 'khách'} · {thoiGian(g.createdAt)}{g.trang ? ` · ${g.trang}` : ''}</p>
                  </button>
                );
              })}
          {ds && soTrang > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2 text-[12px] text-text-muted">
              <button type="button" disabled={trang <= 1} onClick={() => setTrang((n) => n - 1)} className="rounded p-1 hover:bg-white/[0.05] disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
              Trang {trang}/{soTrang} · {ds.tong} góp ý
              <button type="button" disabled={trang >= soTrang} onClick={() => setTrang((n) => n + 1)} className="rounded p-1 hover:bg-white/[0.05] disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
            </div>
          )}
        </div>
        <div className="lg:sticky lg:top-4 lg:self-start">
          {dangChon ? <ChiTiet g={dangChon} onLuu={capNhatMot} />
            : <div className={`${o} p-6 text-center text-[13px] text-text-muted`}>Chọn một góp ý bên trái để xem chi tiết và trả lời.</div>}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={null}><TrangAdminGopY /></Suspense>;
}
