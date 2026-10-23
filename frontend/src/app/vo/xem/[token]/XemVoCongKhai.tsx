'use client';

/**
 * Link CHỈ-XEM một trang Vở viết tay (iPad) — không cần đăng nhập.
 * Ảnh đi qua backend (`/api/v1/vo-xem/:token/anh`), không qua CDN: chủ trang
 * thu hồi link là trang này hết xem được ngay.
 */
import { useEffect, useState } from 'react';
import { Eye, Lock, Maximize2, Minus, PenLine, Plus, X } from 'lucide-react';
import { voApi, type VoXemCongKhai } from '@/lib/api';

function ngay(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function XemVoCongKhai({ token }: { token: string }) {
  const [duLieu, setDuLieu] = useState<VoXemCongKhai | null>(null);
  const [trangThai, setTrangThai] = useState<'tai' | 'xong' | 'khong'>('tai');
  const [anhHong, setAnhHong] = useState(false);
  const [phongTo, setPhongTo] = useState(false);
  const [tiLe, setTiLe] = useState(1);

  useEffect(() => {
    let huy = false;
    voApi.xemCongKhai(token)
      .then((r) => { if (!huy) { setDuLieu(r.data.data); setTrangThai('xong'); } })
      .catch(() => { if (!huy) setTrangThai('khong'); });
    return () => { huy = true; };
  }, [token]);

  useEffect(() => {
    if (!phongTo) return;
    const phim = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPhongTo(false);
      else if (e.key === '+' || e.key === '=') setTiLe((v) => Math.min(4, +(v + 0.25).toFixed(2)));
      else if (e.key === '-') setTiLe((v) => Math.max(0.5, +(v - 0.25).toFixed(2)));
    };
    window.addEventListener('keydown', phim);
    return () => window.removeEventListener('keydown', phim);
  }, [phongTo]);

  const anh = voApi.anhCongKhaiUrl(token);

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-4 pb-16 pt-6 text-slate-800 sm:px-6" style={{ colorScheme: 'light' }}>
      <div className="mx-auto w-full max-w-[820px]">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-[12.5px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-800">
            <PenLine className="h-3.5 w-3.5" /> Vở viết tay
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/[0.06] px-2.5 py-1 font-medium text-slate-600">
            <Eye className="h-3.5 w-3.5" /> Chỉ xem
          </span>
        </div>

        {trangThai === 'tai' && (
          <div className="space-y-3" aria-busy="true">
            <div className="h-7 w-2/3 animate-pulse rounded bg-black/[0.06]" />
            <div className="aspect-[595/842] w-full animate-pulse rounded-md bg-white/70" />
          </div>
        )}

        {trangThai === 'khong' && (
          <div className="mt-16 rounded-xl border border-black/[0.06] bg-white px-6 py-12 text-center shadow-sm">
            <Lock className="mx-auto mb-3 h-8 w-8 text-slate-400" />
            <h1 className="text-[18px] font-semibold text-slate-800">Link không còn dùng được</h1>
            <p className="mx-auto mt-2 max-w-sm text-[13.5px] text-slate-500">
              Chủ trang đã thu hồi link, hoặc trang đã bị xoá. Xin chủ trang gửi lại link mới.
            </p>
          </div>
        )}

        {trangThai === 'xong' && duLieu && (
          <>
            <header className="mb-4">
              <p className="text-[12.5px] font-medium text-slate-500">
                {duLieu.monTen}{duLieu.cuonTen ? ` › ${duLieu.cuonTen}` : ''}
              </p>
              <h1 className="mt-0.5 text-[22px] font-semibold leading-tight tracking-tight text-slate-900">{duLieu.tieuDe || 'Trang vở'}</h1>
              <p className="mt-1 text-[12px] text-slate-400">Cập nhật {ngay(duLieu.capNhatLuc)}</p>
            </header>

            {duLieu.coAnh && !anhHong ? (
              <button
                type="button"
                onClick={() => { setTiLe(1); setPhongTo(true); }}
                className="group relative block w-full cursor-zoom-in rounded-[6px] bg-[#fbfaf6] shadow-[0_1px_2px_rgba(15,23,42,0.08),0_10px_32px_-12px_rgba(15,23,42,0.3)] ring-1 ring-black/[0.06]"
                aria-label="Phóng to trang"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- ảnh qua backend, kích thước không biết trước */}
                <img src={anh} alt={`Trang viết tay: ${duLieu.tieuDe}`} onError={() => setAnhHong(true)} className="block h-auto w-full rounded-[6px] bg-white" />
                <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-slate-900/70 px-2 py-1 text-[11.5px] text-white opacity-0 transition group-hover:opacity-100">
                  <Maximize2 className="h-3.5 w-3.5" /> Phóng to
                </span>
              </button>
            ) : (
              <div className="rounded-[6px] border border-dashed border-slate-300 bg-[#fbfaf6] px-4 py-12 text-center text-[13px] text-slate-500">
                Trang này chưa có ảnh xem trước.
              </div>
            )}

            <p className="mt-6 text-center text-[12px] text-slate-400">
              Viết tay bằng Apple Pencil trong app <b className="font-semibold text-slate-500">CuongThai · Vở</b>
            </p>
          </>
        )}
      </div>

      {phongTo && duLieu && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-slate-950/85 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={() => setPhongTo(false)}>
          <div className="flex items-center gap-1 px-3 py-2 text-white/90" onClick={(e) => e.stopPropagation()}>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{duLieu.tieuDe}</span>
            <button type="button" aria-label="Thu nhỏ" onClick={() => setTiLe((v) => Math.max(0.5, +(v - 0.25).toFixed(2)))} className="grid h-10 w-10 place-items-center rounded-md hover:bg-white/10"><Minus className="h-4 w-4" /></button>
            <button type="button" onClick={() => setTiLe(1)} className="h-10 min-w-[56px] rounded-md px-2 text-xs tabular-nums hover:bg-white/10">{Math.round(tiLe * 100)}%</button>
            <button type="button" aria-label="Phóng to" onClick={() => setTiLe((v) => Math.min(4, +(v + 0.25).toFixed(2)))} className="grid h-10 w-10 place-items-center rounded-md hover:bg-white/10"><Plus className="h-4 w-4" /></button>
            <button type="button" aria-label="Đóng" onClick={() => setPhongTo(false)} className="grid h-10 w-10 place-items-center rounded-md hover:bg-white/10"><X className="h-5 w-5" /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto px-3 pb-6">
            {/* eslint-disable-next-line @next/next/no-img-element -- ảnh qua backend */}
            <img src={anh} alt="" onClick={(e) => e.stopPropagation()} style={{ width: `min(${Math.round(tiLe * 100)}%, ${Math.round(tiLe * 1100)}px)`, maxWidth: 'none' }} className="mx-auto block h-auto rounded-[4px] bg-white shadow-2xl" />
          </div>
        </div>
      )}
    </main>
  );
}
