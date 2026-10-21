'use client';

/**
 * TRÌNH XEM TỆP CT Work (20/10/2026) — bấm một tệp tải lên (đính kèm thẻ, tệp bình luận/chat, bằng chứng test, tệp lớp,
 * tệp cổng khách) là xem NGAY trong trang/app, không bị đẩy sang tab khác hay tải về. Nút Tải về riêng.
 *
 *   const xem = useXemTep();
 *   <button onClick={() => xem.mo(danhSach, i)}>…</button>
 *   {xem.khung}
 *
 * Loại: ảnh (thu phóng/kéo/xoay) · PDF (khung trình xem PDF của trình duyệt; app desktop bật `plugins`) · video/âm thanh
 * (trình phát gốc) · chữ/markdown/CSV/JSON/mã (qua `…/content` của máy chủ — tránh CORS của R2) · docx/xlsx (qua
 * `…/preview`) · loại khác ⇒ thẻ "Không xem trước được" + Tải về. Phím: Esc đóng, ←/→ đổi tệp.
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ChevronLeft, ChevronRight, Download, ExternalLink, File as FileIcon, FileAudio, FileCode, FileImage, FileSpreadsheet, FileText, FileVideo,
  RotateCcw, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, workErrorStatus } from '@/lib/work-api';
import { formatBytes, relativeTime, Spinner, WorkPortal } from '@/components/work/ui';
import { wt } from '@/components/work/i18n';
import { canNoiDungChu, canXemTruoc, loaiTep, type LoaiTep } from './loaiTep';
import { anhCoSan, type TepXem } from './nguonTep';
import XemAnh from './XemAnh';
import XemChu from './XemChu';
import XemOffice from './XemOffice';

export type { TepXem } from './nguonTep';
export { anhCoSan, tepBaiTapLop, tepBangTinLop, tepBangTinNhom, tepChat, tepDinhKem } from './nguonTep';

/** App desktop (Electron): mở tab mới = mở trình duyệt của máy. */
const laAppDesktop = () => typeof navigator !== 'undefined' && /Electron/i.test(navigator.userAgent);

/** Tải về đúng tên (URL ký sẵn có Content-Disposition: attachment) — trang không đổi. */
export async function taiVe(t: TepXem): Promise<void> {
  try {
    let url = await t.url(false);
    // Ảnh trong nội dung (đường /api/… của chính site): kéo byte về rồi lưu — app desktop không mở được đường tương đối ra ngoài.
    const tuongDoi = !/^https?:/i.test(url);
    if (tuongDoi) url = URL.createObjectURL(await (await fetch(url, { credentials: 'include' })).blob());
    else if (laAppDesktop()) { window.open(url, '_blank', 'noopener'); return; }
    const a = document.createElement('a');
    a.href = url;
    a.download = t.fileName;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (tuongDoi) setTimeout(() => URL.revokeObjectURL(url), 30_000);
  } catch (err) {
    toast.error(workError(err, wt('chat.downloadFailed')));
  }
}

/** Mở bản inline ở tab mới. Mở cửa sổ TRƯỚC await (Safari chặn window.open sau await). */
export async function moTabMoi(t: TepXem): Promise<void> {
  const w = laAppDesktop() ? null : window.open('about:blank', '_blank');
  try {
    const url = await t.url(true);
    if (w) { w.opener = null; w.location.href = url; } else window.open(url, '_blank', 'noopener');
  } catch (err) {
    w?.close();
    toast.error(workError(err, wt('xem.failed')));
  }
}

const ICON: Record<LoaiTep, typeof FileIcon> = {
  image: FileImage, pdf: FileText, video: FileVideo, audio: FileAudio, markdown: FileText, csv: FileSpreadsheet, json: FileCode,
  code: FileCode, text: FileText, docx: FileText, xlsx: FileSpreadsheet, none: FileIcon,
};
export function IconTep({ fileName, mime, size = 16, className }: { fileName: string; mime?: string | null; size?: number; className?: string }) {
  const I = ICON[loaiTep(fileName, mime)];
  return <I size={size} className={className} aria-hidden="true" />;
}

// ─── Thân: theo loại ─────────────────────────────────────────────

function The({ icon, title, body, children }: { icon?: ReactNode; title: string; body?: string; children?: ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="w-full max-w-[380px] rounded-[12px] border border-[var(--w-border)] bg-[var(--w-panel)] p-6 text-center" style={{ boxShadow: 'var(--w-shadow-lift)' }} data-testid="xem-the">
        {icon && <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[10px] bg-[var(--w-sunken)] text-[var(--w-text-3)]">{icon}</div>}
        <div className="text-[14px] font-semibold">{title}</div>
        {body && <p className="mt-1 text-[13px] text-[var(--w-text-2)]">{body}</p>}
        {children && <div className="mt-4 flex flex-wrap justify-center gap-2">{children}</div>}
      </div>
    </div>
  );
}

function DangTai() {
  return <div className="flex h-full items-center justify-center gap-2 text-[13px] text-[var(--w-text-2)]" role="status"><Spinner /> {wt('xem.loading')}</div>;
}

function Loi({ err, onRetry }: { err: unknown; onRetry: () => void }) {
  const st = workErrorStatus(err);
  if (st === 413) return <The icon={<FileIcon size={22} />} title={wt('xem.tooLarge')} body={wt('xem.noPreviewBody')} />;
  if (st === 422) return <The icon={<FileIcon size={22} />} title={wt('xem.damaged')} body={wt('xem.noPreviewBody')} />;
  if (st === 415) return <The icon={<FileIcon size={22} />} title={wt('xem.noPreview')} body={wt('xem.noPreviewBody')} />;
  return (
    <The icon={<FileIcon size={22} />} title={wt('xem.failed')} body={workError(err, wt('xem.failedBody'))}>
      <button type="button" className="w-btn w-btn-sm" onClick={onRetry}><RotateCcw size={13} /> {wt('xem.retry')}</button>
    </The>
  );
}

function ThanTep({ t, loai, nutTai }: { t: TepXem; loai: LoaiTep; nutTai: ReactNode }) {
  const canUrl = loai === 'image' || loai === 'pdf' || loai === 'video' || loai === 'audio';
  const chu = canNoiDungChu(loai) && !!t.noiDung;
  const office = canXemTruoc(loai) && !!t.xemTruoc;
  // URL xin mới mỗi lần mở (hết hạn 2–10 phút); giữ 60 s để ←/→ qua lại không xin lại liên tục.
  const url = useQuery({ queryKey: ['work', 'xem', t.id, 'url'], queryFn: () => t.url(true), enabled: canUrl, staleTime: 60_000, gcTime: 60_000, retry: false });
  const noiDung = useQuery({ queryKey: ['work', 'xem', t.id, 'chu'], queryFn: () => t.noiDung!(), enabled: chu, staleTime: 60_000, gcTime: 60_000, retry: false });
  const xt = useQuery({ queryKey: ['work', 'xem', t.id, 'office'], queryFn: () => t.xemTruoc!(), enabled: office, staleTime: 60_000, gcTime: 60_000, retry: false });
  const [mediaLoi, setMediaLoi] = useState(false);
  const thuLaiAnh = useRef(false);
  useEffect(() => { setMediaLoi(false); thuLaiAnh.current = false; }, [t.id]);

  const khongXem = <The icon={<IconTep fileName={t.fileName} mime={t.mime} size={22} />} title={wt('xem.noPreview')} body={wt('xem.noPreviewBody')}>{nutTai}</The>;

  if (canUrl) {
    if (url.isLoading) return <DangTai />;
    if (url.error || !url.data) return <Loi err={url.error} onRetry={() => void url.refetch()} />;
    if (mediaLoi) return <The icon={<IconTep fileName={t.fileName} mime={t.mime} size={22} />} title={wt('xem.mediaFailed')}>{nutTai}</The>;
    if (loai === 'image') {
      // URL hết hạn giữa chừng ⇒ xin lại MỘT lần rồi mới báo lỗi.
      return <XemAnh src={url.data} alt={t.fileName} onError={() => { if (!thuLaiAnh.current) { thuLaiAnh.current = true; void url.refetch(); } else setMediaLoi(true); }} />;
    }
    if (loai === 'pdf') return <iframe key={url.data} src={url.data} title={wt('xem.pdfTitle', { name: t.fileName })} className="h-full w-full border-0 bg-[var(--w-sunken)]" data-testid="xem-pdf" />;
    if (loai === 'video') {
      return (
        <div className="flex h-full items-center justify-center bg-black p-2">
          <video key={url.data} src={url.data} controls playsInline preload="metadata" className="max-h-full max-w-full" onError={() => setMediaLoi(true)} data-testid="xem-video" />
        </div>
      );
    }
    return (
      <The icon={<FileAudio size={22} />} title={t.fileName} body={t.size ? formatBytes(t.size) : undefined}>
        <audio key={url.data} src={url.data} controls preload="metadata" className="w-full min-w-[260px]" onError={() => setMediaLoi(true)} data-testid="xem-audio" />
      </The>
    );
  }
  if (chu) {
    if (noiDung.isLoading) return <DangTai />;
    if (noiDung.error || !noiDung.data) return <Loi err={noiDung.error} onRetry={() => void noiDung.refetch()} />;
    return <XemChu loai={loai} text={noiDung.data.text} fileName={t.fileName} truncated={noiDung.data.truncated} size={noiDung.data.size ?? t.size ?? null} />;
  }
  if (office) {
    if (xt.isLoading) return <DangTai />;
    if (xt.error || !xt.data) return <Loi err={xt.error} onRetry={() => void xt.refetch()} />;
    return <XemOffice data={xt.data} />;
  }
  return khongXem;
}

// ─── Khung ───────────────────────────────────────────────────────

const NUT_DAU = 'w-btn w-btn-ghost w-btn-sm h-8 shrink-0';
const chan = (e: { stopPropagation: () => void }) => e.stopPropagation();

export function XemTep({ tep, batDau = 0, onDong }: { tep: TepXem[]; batDau?: number; onDong: () => void }) {
  const [i, setI] = useState(() => Math.min(Math.max(batDau, 0), Math.max(tep.length - 1, 0)));
  const t = tep[i];
  const loai = t ? loaiTep(t.fileName, t.mime) : 'none';
  const nhieu = tep.length > 1;
  const hopRef = useRef<HTMLDivElement>(null);
  const truocDo = useRef<Element | null>(null);
  const desktop = laAppDesktop();

  const lui = useCallback(() => setI((x) => (x - 1 + tep.length) % tep.length), [tep.length]);
  const toi = useCallback(() => setI((x) => (x + 1) % tep.length), [tep.length]);

  // Tiêu điểm vào khung lúc mở, trả về chỗ cũ lúc đóng; khoá cuộn trang phía sau.
  useEffect(() => {
    truocDo.current = document.activeElement;
    hopRef.current?.focus();
    const cu = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = cu;
      (truocDo.current as HTMLElement | null)?.focus?.();
    };
  }, []);

  // Esc / ←/→ — bắt ở pha CAPTURE của window để ngăn drawer/dialog phía sau cũng đóng theo.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const dangGo = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onDong(); return; }
      if (dangGo || e.metaKey || e.ctrlKey || e.altKey) return;
      if (nhieu && e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); lui(); }
      else if (nhieu && e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); toi(); }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onDong, lui, toi, nhieu]);

  if (!t) return null;
  const meta = [t.size ? formatBytes(t.size) : null, t.uploader && t.createdAt ? wt('xem.byWhen', { who: t.uploader, when: relativeTime(t.createdAt) }) : t.uploader ?? (t.createdAt ? relativeTime(t.createdAt) : null)]
    .filter(Boolean).join(' · ');
  const nutTai = <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => void taiVe(t)}><Download size={13} /> {wt('xem.download')}</button>;
  const nenToi = loai === 'image' || loai === 'video';

  return (
    <WorkPortal>
      {/* Sự kiện React đi xuyên portal lên cây cha (dòng tin chat, thẻ kéo-thả…) ⇒ chặn ở gốc khung. */}
      <div
        className="fixed inset-0 z-[90] flex bg-black/70 md:p-4"
        onMouseDown={(e) => { e.stopPropagation(); if (e.target === e.currentTarget) onDong(); }}
        onClick={chan} onDoubleClick={chan} onPointerDown={chan} onKeyDown={chan} onContextMenu={chan} onDragOver={chan} onDrop={chan} onTouchStart={chan}
      >
        <div
          ref={hopRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`${wt('xem.viewer')}: ${t.fileName}`}
          className="w-safe-all relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[var(--w-panel)] outline-none md:rounded-[12px] md:border md:border-[var(--w-border)]"
          style={{ boxShadow: 'var(--w-shadow-pop)' }}
          data-testid="xem-tep"
        >
          {/* Đầu: tên + thông tin · đếm · trước/sau · tải về · mở tab mới · đóng */}
          <div className="flex h-[52px] shrink-0 items-center gap-2 border-b border-[var(--w-border)] px-2 sm:px-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--w-sunken)] text-[var(--w-text-2)]"><IconTep fileName={t.fileName} mime={t.mime} /></span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13.5px] font-semibold" title={t.fileName}>{t.fileName}</div>
              {meta && <div className="truncate text-[11.5px] text-[var(--w-text-3)]">{meta}</div>}
            </div>
            {nhieu && (
              <div className="flex shrink-0 items-center">
                <button type="button" className={cn(NUT_DAU, 'w-btn-icon')} onClick={lui} aria-label={wt('xem.prev')} title={`${wt('xem.prev')} (←)`}><ChevronLeft size={16} /></button>
                <span className="min-w-[44px] text-center text-[12px] tabular-nums text-[var(--w-text-2)]" aria-live="polite">{wt('xem.counter', { n: i + 1, total: tep.length })}</span>
                <button type="button" className={cn(NUT_DAU, 'w-btn-icon')} onClick={toi} aria-label={wt('xem.next')} title={`${wt('xem.next')} (→)`}><ChevronRight size={16} /></button>
              </div>
            )}
            <span className="mx-0.5 hidden h-5 w-px bg-[var(--w-border)] sm:block" aria-hidden="true" />
            <button type="button" className={NUT_DAU} onClick={() => void taiVe(t)} aria-label={wt('xem.downloadX', { name: t.fileName })} data-testid="xem-tai">
              <Download size={14} /><span className="max-sm:hidden">{wt('xem.download')}</span>
            </button>
            <button type="button" className={NUT_DAU} onClick={() => void moTabMoi(t)} aria-label={desktop ? wt('xem.openBrowser') : wt('xem.openNewTab')}>
              <ExternalLink size={14} /><span className="max-md:hidden">{desktop ? wt('xem.openBrowser') : wt('xem.openNewTab')}</span>
            </button>
            <button type="button" className={cn(NUT_DAU, 'w-btn-icon')} onClick={onDong} aria-label={wt('xem.close')} title={`${wt('xem.close')} (Esc)`}><X size={16} /></button>
          </div>
          <div className={cn('relative min-h-0 flex-1', nenToi ? 'bg-[#141416]' : 'bg-[var(--w-sunken)]')}>
            <ThanTep key={t.id} t={t} loai={loai} nutTai={nutTai} />
          </div>
        </div>
      </div>
    </WorkPortal>
  );
}

/** Trạng thái mở trình xem cho một chỗ dùng: `mo(danhSach, i)` + vẽ `khung`. */
export function useXemTep() {
  const [st, setSt] = useState<{ ds: TepXem[]; i: number } | null>(null);
  const mo = useCallback((ds: TepXem[], i = 0) => { if (ds.length) setSt({ ds, i }); }, []);
  const dong = useCallback(() => setSt(null), []);
  const khung = st ? <XemTep tep={st.ds} batDau={st.i} onDong={dong} /> : null;
  return { mo, dong, khung, dangMo: !!st };
}

/**
 * Vùng nội dung có ảnh (mô tả, bình luận, Docs, cổng khách): bấm ảnh `img.w-doc-img` ⇒ trình xem với mọi ảnh trong vùng.
 * Bỏ qua ảnh đang ở chế độ SOẠN (contenteditable) và ảnh nằm trong link. Chặn lan để khung cha không coi là "bấm để sửa".
 */
export function VungAnhXemDuoc({ children, className }: { children: ReactNode; className?: string }) {
  const xem = useXemTep();
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = (e.target as HTMLElement).closest?.('img.w-doc-img');
    if (!(img instanceof HTMLImageElement) || img.closest('[contenteditable="true"]') || img.closest('a')) return;
    const anh = Array.from(e.currentTarget.querySelectorAll<HTMLImageElement>('img.w-doc-img')).filter((x) => !x.closest('[contenteditable="true"]') && (x.currentSrc || x.src));
    const i = anh.indexOf(img);
    if (i < 0) return;
    e.preventDefault();
    e.stopPropagation();
    xem.mo(anh.map((x, k) => anhCoSan(x.currentSrc || x.src, x.alt?.trim() || `image-${k + 1}.png`)), i);
  };
  return (
    <div className={cn(className, '[&_img.w-doc-img]:cursor-zoom-in')} onClick={onClick}>
      {children}
      {xem.khung}
    </div>
  );
}
