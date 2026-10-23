'use client';

/**
 * Trang Vở viết tay (iPad · PencilKit) xem trên web.
 *
 * Mỗi trang Vở là một `Note` mang `inkPreviewKey` — ảnh PNG app dựng mỗi lần
 * đẩy nét. Máy chủ trả sẵn `inkPreviewUrl` (CDN, cùng đường app tải nét về),
 * web chỉ hiện ảnh: không sửa nét được ở đây — nét chỉ sửa trên iPad.
 *
 * Khổ giấy: ảnh xem trước đã mang đúng tỉ lệ trang (app dựng theo khổ), nên
 * khung chỉ cần nền giấy + bóng đổ, không tự ép tỉ lệ (ép là méo trang ngang
 * / trang nối dài).
 */
import { useCallback, useEffect, useState } from 'react';
import { Download, Maximize2, Minus, PenLine, Plus, X } from 'lucide-react';
import type { NoteFull } from '@/types';

/** Trang có phải trang Vở viết tay không — dùng chung cho cây/danh sách. */
export function laTrangVietTay(n: { inkVersion?: number | null; inkPreviewUrl?: string | null }): boolean {
  return (n.inkVersion ?? 0) > 0 || Boolean(n.inkPreviewUrl);
}

function tuongDoi(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return null;
  const giay = Math.round((Date.now() - t.getTime()) / 1000);
  if (giay < 60) return 'vừa xong';
  const phut = Math.round(giay / 60);
  if (phut < 60) return `${phut} phút trước`;
  const gio = Math.round(phut / 60);
  if (gio < 24) return `${gio} giờ trước`;
  const ngay = Math.round(gio / 24);
  if (ngay < 7) return `${ngay} ngày trước`;
  return t.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function tenTep(title: string): string {
  const goc = (title || 'trang-vo').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^\w-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return `${goc || 'trang-vo'}.png`;
}

export default function VoVietTayPreview({ note }: { note: NoteFull }) {
  const url = note.inkPreviewUrl ?? null;
  const [phongTo, setPhongTo] = useState(false);
  const [tiLe, setTiLe] = useState(1);
  const [hong, setHong] = useState(false);
  const [dangTai, setDangTai] = useState(false);
  const capNhat = tuongDoi(note.inkUpdatedAt ?? null);

  useEffect(() => { setHong(false); }, [url]);

  const taiVe = useCallback(async () => {
    if (!url) return;
    setDangTai(true);
    try {
      // Tải qua blob để đặt được tên tệp (thuộc tính `download` vô tác dụng với
      // URL khác nguồn). CDN không mở CORS ⇒ mở ảnh ở thẻ mới để người dùng lưu.
      const r = await fetch(url, { mode: 'cors' });
      if (!r.ok) throw new Error(String(r.status));
      const blob = await r.blob();
      const u = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = u; a.download = tenTep(note.title); document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(u), 4000);
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setDangTai(false);
    }
  }, [url, note.title]);

  useEffect(() => {
    if (!phongTo) return;
    const phim = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPhongTo(false);
      else if (e.key === '+' || e.key === '=') setTiLe((v) => Math.min(4, +(v + 0.25).toFixed(2)));
      else if (e.key === '-') setTiLe((v) => Math.max(0.5, +(v - 0.25).toFixed(2)));
      else if (e.key === '0') setTiLe(1);
    };
    window.addEventListener('keydown', phim);
    return () => window.removeEventListener('keydown', phim);
  }, [phongTo]);

  return (
    <section className="mx-auto w-full max-w-[760px] px-4 pt-4 sm:px-6" aria-label="Trang viết tay">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[12.5px] text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-2.5 py-1 font-medium text-amber-800 dark:bg-amber-400/10 dark:text-amber-200">
          <PenLine className="h-3.5 w-3.5" /> Viết tay trên iPad
        </span>
        {capNhat && <span>cập nhật {capNhat}</span>}
        {url && !hong && (
          <span className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => { setTiLe(1); setPhongTo(true); }}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-slate-600 hover:bg-black/[0.05] dark:text-slate-300 dark:hover:bg-white/[0.06]"
            >
              <Maximize2 className="h-3.5 w-3.5" /> Phóng to
            </button>
            <button
              type="button"
              onClick={() => { void taiVe(); }}
              disabled={dangTai}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-slate-600 hover:bg-black/[0.05] disabled:opacity-50 dark:text-slate-300 dark:hover:bg-white/[0.06]"
            >
              <Download className="h-3.5 w-3.5" /> {dangTai ? 'Đang tải…' : 'Tải PNG'}
            </button>
          </span>
        )}
      </div>

      {url && !hong ? (
        <button
          type="button"
          onClick={() => { setTiLe(1); setPhongTo(true); }}
          className="group block w-full cursor-zoom-in rounded-[6px] bg-[#fbfaf6] p-0 shadow-[0_1px_2px_rgba(15,23,42,0.08),0_8px_28px_-10px_rgba(15,23,42,0.28)] ring-1 ring-black/[0.06] transition hover:shadow-[0_1px_2px_rgba(15,23,42,0.1),0_14px_36px_-12px_rgba(15,23,42,0.35)]"
          aria-label="Phóng to trang viết tay"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ảnh CDN R2, kích thước không biết trước */}
          <img
            src={url}
            alt={`Trang viết tay: ${note.title || 'Trang vở'}`}
            loading="lazy"
            onError={() => setHong(true)}
            className="block h-auto w-full rounded-[6px] bg-white"
          />
        </button>
      ) : (
        <div className="rounded-[6px] border border-dashed border-slate-300 bg-[#fbfaf6] px-4 py-10 text-center text-[13px] text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
          {hong
            ? 'Không tải được ảnh xem trước của trang này — mở Vở trên iPad để đồng bộ lại.'
            : 'Trang này chưa có ảnh xem trước — ảnh sẽ có sau lần đồng bộ tới từ iPad.'}
        </div>
      )}

      <p className="mt-2 text-[11.5px] text-slate-400 dark:text-slate-500">
        Chỉ xem — nét viết sửa trên app iPad. Phần gõ chữ bên dưới vẫn ghi chú được như trang thường.
      </p>

      {phongTo && url && (
        <div
          className="fixed inset-0 z-[80] flex flex-col bg-slate-950/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Trang viết tay phóng to"
          onClick={() => setPhongTo(false)}
        >
          <div className="flex items-center gap-1 px-3 py-2 text-white/90" onClick={(e) => e.stopPropagation()}>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{note.title || 'Trang vở'}</span>
            <button type="button" aria-label="Thu nhỏ" onClick={() => setTiLe((v) => Math.max(0.5, +(v - 0.25).toFixed(2)))} className="grid h-10 w-10 place-items-center rounded-md hover:bg-white/10"><Minus className="h-4 w-4" /></button>
            <button type="button" onClick={() => setTiLe(1)} className="h-10 min-w-[56px] rounded-md px-2 text-xs tabular-nums hover:bg-white/10">{Math.round(tiLe * 100)}%</button>
            <button type="button" aria-label="Phóng to" onClick={() => setTiLe((v) => Math.min(4, +(v + 0.25).toFixed(2)))} className="grid h-10 w-10 place-items-center rounded-md hover:bg-white/10"><Plus className="h-4 w-4" /></button>
            <button type="button" aria-label="Tải PNG" onClick={() => { void taiVe(); }} className="grid h-10 w-10 place-items-center rounded-md hover:bg-white/10"><Download className="h-4 w-4" /></button>
            <button type="button" aria-label="Đóng" onClick={() => setPhongTo(false)} className="grid h-10 w-10 place-items-center rounded-md hover:bg-white/10"><X className="h-5 w-5" /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto px-3 pb-6" onClick={() => setPhongTo(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element -- ảnh CDN R2 */}
            <img
              src={url}
              alt={`Trang viết tay: ${note.title || 'Trang vở'}`}
              onClick={(e) => e.stopPropagation()}
              style={{ width: `min(${Math.round(tiLe * 100)}%, ${Math.round(tiLe * 1100)}px)`, maxWidth: 'none' }}
              className="mx-auto block h-auto rounded-[4px] bg-white shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}
