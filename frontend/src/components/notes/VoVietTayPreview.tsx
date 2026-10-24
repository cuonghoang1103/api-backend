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
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BookOpenCheck, Check, ChevronDown, Copy, Download, FileDown, Layers, Link2, Link2Off, Maximize2, Minus,
  PenLine, Plus, ScanText, X,
} from 'lucide-react';
import type { NoteFull } from '@/types';
import { notesApi, voApi, type VoTheCuaTrang, type VoTheOn } from '@/lib/api';

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

function loiCua(e: unknown, macDinh: string): string {
  const m = (e as { response?: { data?: { message?: string; error?: string } } })?.response?.data;
  return m?.message || m?.error || macDinh;
}

const nutNho = 'inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-slate-600 hover:bg-black/[0.05] disabled:opacity-50 dark:text-slate-300 dark:hover:bg-white/[0.06]';

export default function VoVietTayPreview({ note }: { note: NoteFull }) {
  // URL ảnh có thể là URL KÝ SẴN hết hạn (~1 giờ): ảnh lỗi thì xin lại note
  // MỘT lần để lấy URL mới, rồi mới báo hỏng.
  const [url, setUrl] = useState<string | null>(note.inkPreviewUrl ?? null);
  const daXinLai = useRef(false);
  const [phongTo, setPhongTo] = useState(false);
  const [tiLe, setTiLe] = useState(1);
  const [hong, setHong] = useState(false);
  const [dangTai, setDangTai] = useState(false);
  const capNhat = tuongDoi(note.inkUpdatedAt ?? null);
  const daXoa = Boolean(note.deletedAt);

  useEffect(() => { setUrl(note.inkPreviewUrl ?? null); daXinLai.current = false; setHong(false); }, [note.id, note.inkPreviewUrl]);

  const anhLoi = useCallback(() => {
    if (daXinLai.current) { setHong(true); return; }
    daXinLai.current = true;
    notesApi.getNote(note.id)
      .then((r) => {
        const moi = r.data.data.inkPreviewUrl ?? null;
        if (moi && moi !== url) setUrl(moi); else setHong(true);
      })
      .catch(() => setHong(true));
  }, [note.id, url]);

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
              className={nutNho}
            >
              <Download className="h-3.5 w-3.5" /> {dangTai ? 'Đang tải…' : 'Tải PNG'}
            </button>
          </span>
        )}
      </div>
      {!daXoa && <ThanhViec note={note} />}

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
            onError={anhLoi}
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

      {!daXoa && <KhungTheOn noteId={note.id} />}
      {note.inkText && <KhungChuNhanDang chu={note.inkText} />}

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

// ─── Thanh việc: chia sẻ link chỉ-xem · PDF cả cuốn ─────────────────────

function ThanhViec({ note }: { note: NoteFull }) {
  const [token, setToken] = useState<string | null>(note.inkShareToken ?? null);
  const [dangLam, setDangLam] = useState<'' | 'link' | 'thuHoi' | 'pdf'>('');
  const [moChiaSe, setMoChiaSe] = useState(false);
  const [daChep, setDaChep] = useState(false);
  const [hoiThuHoi, setHoiThuHoi] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);

  useEffect(() => { setToken(note.inkShareToken ?? null); setMoChiaSe(false); setHoiThuHoi(false); }, [note.id, note.inkShareToken]);

  const duongDan = token && typeof window !== 'undefined' ? `${window.location.origin}/vo/xem/${token}` : '';

  const taoLink = async () => {
    setDangLam('link'); setLoi(null);
    try {
      const r = await voApi.taoLink(note.id);
      setToken(r.data.data.token);
      setMoChiaSe(true);
    } catch (e) { setLoi(loiCua(e, 'Chưa tạo được link — thử lại.')); }
    finally { setDangLam(''); }
  };

  const chep = async () => {
    if (!duongDan) return;
    try { await navigator.clipboard.writeText(duongDan); setDaChep(true); setTimeout(() => setDaChep(false), 1800); }
    // Không dùng window.prompt: app desktop (Electron) ném "prompt() is not supported" — xem desktop khongDungPrompt.test.ts.
    catch { setLoi('Không chép tự động được — bôi đen đường link ở trên rồi bấm Ctrl/⌘ + C.'); }
  };

  const thuHoi = async () => {
    setDangLam('thuHoi'); setLoi(null);
    try { await voApi.thuHoiLink(note.id); setToken(null); setHoiThuHoi(false); setMoChiaSe(false); }
    catch (e) { setLoi(loiCua(e, 'Chưa thu hồi được — thử lại.')); }
    finally { setDangLam(''); }
  };

  const taiPdf = async () => {
    if (!note.chapterId) return;
    setDangLam('pdf'); setLoi(null);
    try {
      const r = await voApi.pdfCuon(note.chapterId);
      const u = URL.createObjectURL(r.data);
      const ten = /filename="([^"]+)"/.exec(String(r.headers?.['content-disposition'] ?? ''))?.[1] ?? 'vo.pdf';
      const a = document.createElement('a');
      a.href = u; a.download = ten; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(u), 8000);
    } catch { setLoi('Chưa xuất được PDF cả cuốn — thử lại sau.'); }
    finally { setDangLam(''); }
  };

  return (
    <div className="mb-2.5">
      <div className="flex flex-wrap items-center gap-1 text-[12.5px]">
        {token ? (
          <button type="button" onClick={() => setMoChiaSe((v) => !v)} className={`${nutNho} text-teal-700 dark:text-teal-300`}>
            <Link2 className="h-3.5 w-3.5" /> Đang chia sẻ link
            <ChevronDown className={`h-3.5 w-3.5 transition ${moChiaSe ? 'rotate-180' : ''}`} />
          </button>
        ) : (
          <button type="button" onClick={() => { void taoLink(); }} disabled={dangLam !== ''} className={nutNho}>
            <Link2 className="h-3.5 w-3.5" /> {dangLam === 'link' ? 'Đang tạo…' : 'Chia sẻ link chỉ-xem'}
          </button>
        )}
        {note.chapterId != null && (
          <button type="button" onClick={() => { void taiPdf(); }} disabled={dangLam !== ''} className={nutNho}>
            <FileDown className="h-3.5 w-3.5" /> {dangLam === 'pdf' ? 'Đang ghép PDF…' : 'PDF cả cuốn'}
          </button>
        )}
      </div>

      {token && moChiaSe && (
        <div className="mt-1.5 rounded-lg border border-teal-600/15 bg-teal-50/70 p-3 text-[12.5px] dark:border-teal-300/15 dark:bg-teal-400/[0.06]">
          <p className="mb-2 text-slate-600 dark:text-slate-300">
            Ai có link này đều <b>xem được</b> ảnh trang (không sửa, không thấy trang khác). Thu hồi là link chết ngay.
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <input
              readOnly
              value={duongDan}
              onFocus={(e) => e.currentTarget.select()}
              className="min-h-9 min-w-0 flex-1 rounded-md border border-black/10 bg-white px-2.5 font-mono text-[11.5px] text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
              aria-label="Link chỉ-xem"
            />
            <button type="button" onClick={() => { void chep(); }} className="inline-flex min-h-9 items-center gap-1.5 rounded-md bg-teal-600 px-3 font-medium text-white hover:bg-teal-700">
              {daChep ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {daChep ? 'Đã chép' : 'Sao chép'}
            </button>
            {hoiThuHoi ? (
              <span className="inline-flex items-center gap-1">
                <span className="text-slate-600 dark:text-slate-300">Thu hồi link?</span>
                <button type="button" onClick={() => { void thuHoi(); }} disabled={dangLam !== ''} className="min-h-9 rounded-md bg-rose-600 px-3 font-medium text-white hover:bg-rose-700 disabled:opacity-50">
                  {dangLam === 'thuHoi' ? 'Đang thu hồi…' : 'Thu hồi'}
                </button>
                <button type="button" onClick={() => setHoiThuHoi(false)} className={nutNho}>Huỷ</button>
              </span>
            ) : (
              <button type="button" onClick={() => setHoiThuHoi(true)} className={`${nutNho} text-rose-600 dark:text-rose-300`}>
                <Link2Off className="h-3.5 w-3.5" /> Thu hồi
              </button>
            )}
          </div>
        </div>
      )}
      {loi && <p className="mt-1 text-[12px] text-rose-600 dark:text-rose-300">{loi}</p>}
    </div>
  );
}

// ─── Ý chính & thẻ ôn (rút từ trang bằng AI trên iPad) ──────────────────

function KhungTheOn({ noteId }: { noteId: number }) {
  const [duLieu, setDuLieu] = useState<VoTheCuaTrang | null>(null);
  const [lat, setLat] = useState<Set<number>>(new Set());
  const [daCham, setDaCham] = useState<Record<number, string>>({});

  useEffect(() => {
    let huy = false;
    setDuLieu(null); setLat(new Set()); setDaCham({});
    voApi.theCuaTrang(noteId).then((r) => { if (!huy) setDuLieu(r.data.data); }).catch(() => {});
    return () => { huy = true; };
  }, [noteId]);

  if (!duLieu || (duLieu.yChinh.length === 0 && duLieu.the.length === 0)) return null;

  const latThe = (id: number) => setLat((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const cham = async (t: VoTheOn, muc: 'lai' | 'kho' | 'tot' | 'de', nhan: string) => {
    try {
      const r = await voApi.chamThe(t.id, muc);
      setDuLieu((d) => d && { ...d, the: d.the.map((x) => (x.id === t.id ? r.data.data : x)) });
      setDaCham((m) => ({ ...m, [t.id]: nhan }));
    } catch { /* giữ nguyên — người dùng bấm lại */ }
  };
  const denHan = (t: VoTheOn) => !t.dueAt || new Date(t.dueAt).getTime() <= Date.now();
  const soDenHan = duLieu.the.filter(denHan).length;

  return (
    <section className="mt-5 rounded-xl border border-black/[0.07] bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.03]" aria-label="Ý chính và thẻ ôn">
      <header className="mb-3 flex flex-wrap items-center gap-2">
        <BookOpenCheck className="h-4 w-4 text-violet-600 dark:text-violet-300" />
        <h3 className="text-[14px] font-semibold text-slate-800 dark:text-slate-100">Ý chính & thẻ ôn</h3>
        <span className="text-[12px] text-slate-500 dark:text-slate-400">
          {duLieu.the.length} thẻ{soDenHan > 0 ? ` · ${soDenHan} đến hạn` : ''} · rút bằng AI trên iPad
        </span>
      </header>

      {duLieu.yChinh.length > 0 && (
        <ol className="mb-4 space-y-1.5 border-l-2 border-violet-400/50 pl-3.5 text-[13.5px] leading-relaxed text-slate-700 dark:text-slate-200">
          {duLieu.yChinh.map((y) => <li key={y.id} className="list-decimal marker:text-violet-500 ml-4">{y.noiDung}</li>)}
        </ol>
      )}

      {duLieu.the.length > 0 && (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {duLieu.the.map((t) => {
            const mo = lat.has(t.id);
            return (
              <div key={t.id} className={`rounded-lg border p-3 transition ${mo ? 'border-violet-400/40 bg-violet-50/70 dark:border-violet-300/25 dark:bg-violet-400/[0.07]' : 'border-black/[0.08] bg-[#fbfaf6] dark:border-white/10 dark:bg-white/[0.02]'}`}>
                <button type="button" onClick={() => latThe(t.id)} className="block w-full text-left" aria-expanded={mo}>
                  <span className="mb-1 inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
                    <Layers className="h-3 w-3" /> {t.loai === 'CAU_HOI' ? 'Câu hỏi tự kiểm' : 'Thẻ'}
                    {denHan(t) && <span className="ml-1 rounded bg-amber-100 px-1 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200">đến hạn</span>}
                  </span>
                  <span className="block text-[13.5px] font-medium text-slate-800 dark:text-slate-100">{t.truoc}</span>
                  {mo
                    ? <span className="mt-1.5 block whitespace-pre-wrap border-t border-black/[0.06] pt-1.5 text-[13px] text-slate-600 dark:border-white/10 dark:text-slate-300">{t.sau}</span>
                    : <span className="mt-1 block text-[11.5px] text-slate-400">Bấm để lật xem đáp án</span>}
                </button>
                {mo && (
                  daCham[t.id]
                    ? <p className="mt-2 text-[11.5px] text-emerald-600 dark:text-emerald-300">✓ {daCham[t.id]} — ôn lại {t.intervalDays <= 1 ? 'ngày mai' : `sau ${t.intervalDays} ngày`}</p>
                    : (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {([['lai', 'Lại', 'text-rose-600 dark:text-rose-300'], ['kho', 'Khó', 'text-amber-600 dark:text-amber-300'], ['tot', 'Tốt', 'text-emerald-600 dark:text-emerald-300'], ['de', 'Dễ', 'text-sky-600 dark:text-sky-300']] as const).map(([m, nhan, mau]) => (
                          <button key={m} type="button" onClick={() => { void cham(t, m, nhan); }} className={`min-h-8 rounded-md border border-black/[0.08] px-2.5 text-[12px] font-medium hover:bg-black/[0.04] dark:border-white/10 dark:hover:bg-white/[0.06] ${mau}`}>
                            {nhan}
                          </button>
                        ))}
                      </div>
                    )
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// ─── Chữ nhận dạng (để tìm kiếm) ─────────────────────────────────────────

function KhungChuNhanDang({ chu }: { chu: string }) {
  const [mo, setMo] = useState(false);
  return (
    <section className="mt-3 rounded-lg border border-dashed border-slate-300/80 dark:border-white/10">
      <button type="button" onClick={() => setMo((v) => !v)} className="flex min-h-10 w-full items-center gap-2 px-3 text-left text-[12.5px] text-slate-500 dark:text-slate-400" aria-expanded={mo}>
        <ScanText className="h-3.5 w-3.5" />
        <span className="font-medium">Chữ nhận dạng (để tìm kiếm)</span>
        <span className="text-slate-400">· {chu.length.toLocaleString('vi-VN')} ký tự, iPad đọc — có thể sai vài chữ</span>
        <ChevronDown className={`ml-auto h-3.5 w-3.5 transition ${mo ? 'rotate-180' : ''}`} />
      </button>
      {mo && (
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words border-t border-dashed border-slate-300/80 px-3 py-2.5 font-sans text-[12.5px] leading-relaxed text-slate-600 dark:border-white/10 dark:text-slate-300">{chu}</pre>
      )}
    </section>
  );
}
