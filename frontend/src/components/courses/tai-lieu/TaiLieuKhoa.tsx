'use client';

/**
 * Khu "📁 Tài liệu khoá học" (28/11/2026) — thay khối chữ liền `documentsNote` ở đầu Course Content.
 *
 *   • `KhoiTaiLieuBen`  — thẻ gọn ở thanh bên trang học: đếm tài liệu + tệp, vài mục nổi bật, bấm ⇒ mở thư viện.
 *   • `ThuVienTaiLieu`  — ngăn rộng kiểu Google Classroom: "Tệp tải về" (tệp admin tải lên: xem trước / tải về) +
 *                         lưới thẻ tài liệu tham chiếu theo nhóm (mọi link mở TAB MỚI) + lọc theo loại + tìm.
 *
 * Dữ liệu: `docTaiLieuKhoa(course.documentsNote)` (lib/taiLieuKhoa.ts) + `GET /courses/:id/documents`.
 * Màu chỉ dùng biến theme (`var(--bg-card)`…) ⇒ đúng cả sáng lẫn tối.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BadgeCheck, BookOpen, Code2, Download, ExternalLink, Eye, FileText, FolderOpen, Globe, GraduationCap, Inbox, Loader2,
  PlayCircle, ScrollText, Search, Wrench, X, type LucideIcon,
} from 'lucide-react';
import {
  docTaiLieuKhoa, dungLuong, kieuTep, linkTimKiem, NHAN_LOAI, type LoaiTaiLieu, type MucTaiLieu,
} from '@/lib/taiLieuKhoa';

export interface TepKhoa { id: number; title: string; fileUrl: string; fileType?: string | null; fileSizeBytes: number; createdAt?: string }

const KIEU: Record<LoaiTaiLieu, { icon: LucideIcon; mau: string }> = {
  'chinh-thuc': { icon: BadgeCheck, mau: '#3b82f6' },
  'thuc-hanh': { icon: Code2, mau: '#10b981' },
  video: { icon: PlayCircle, mau: '#ef4444' },
  sach: { icon: BookOpen, mau: '#f59e0b' },
  chuan: { icon: ScrollText, mau: '#8b5cf6' },
  'khoa-hoc': { icon: GraduationCap, mau: '#ec4899' },
  'cong-cu': { icon: Wrench, mau: '#64748b' },
  'tai-ve': { icon: Download, mau: '#0ea5e9' },
  'tham-khao': { icon: Globe, mau: '#14b8a6' },
};

const vien = 'var(--border-color)';

function TheTaiLieu({ m, denTep }: { m: MucTaiLieu; denTep: () => void }) {
  const k = KIEU[m.loai] ?? KIEU['tham-khao'];
  const Icon = k.icon;
  const timWeb = !m.url && !m.laTepDiKem;
  const href = m.url ?? (timWeb ? linkTimKiem(m.ten) : undefined);
  const nhanNut = m.laTepDiKem ? 'Xem tệp ↓' : timWeb ? 'Tìm trên web ↗' : m.noiBo ? 'Mở trên CuongThai ↗' : 'Mở ↗';
  const than = (
    <>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `${k.mau}1f`, color: k.mau }}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 break-words text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>{m.ten}</p>
          {m.moTa && <p className="mt-1 line-clamp-2 text-xs leading-relaxed first-letter:uppercase" style={{ color: 'var(--text-secondary)' }}>{m.moTa}</p>}
        </div>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: `${k.mau}1a`, color: k.mau }}>{NHAN_LOAI[m.loai]}</span>
        {m.tenMien && <span className="truncate text-[11px]" style={{ color: 'var(--text-muted)' }}>{m.tenMien}</span>}
        {m.noiBo && m.url && <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>cuongthai.com</span>}
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold transition group-hover:translate-x-0.5" style={{ color: k.mau }}>{nhanNut}</span>
      </div>
    </>
  );
  const lop = 'group flex h-full flex-col rounded-2xl border p-3.5 text-left outline-none transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2';
  const st = { borderColor: vien, background: 'var(--bg-card)', ['--tw-ring-color' as string]: k.mau };
  return (
    <div className="flex flex-col">
      {m.laTepDiKem
        ? <button type="button" onClick={denTep} className={lop} style={st}>{than}</button>
        : <a href={href} target="_blank" rel="noopener noreferrer" className={lop} style={st} title={m.url ?? `Tìm "${m.ten}" trên web`}>{than}</a>}
      {m.phu && m.phu.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1 px-1">
          {m.phu.map((p) => (
            <a key={p.url} href={p.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition hover:opacity-80"
              style={{ borderColor: vien, color: 'var(--text-secondary)' }}>
              <ExternalLink className="h-3 w-3" /> {p.ten}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function TheTep({ d, coTheXem, dangXem, onXem, linkTai }: {
  d: TepKhoa; coTheXem: boolean; dangXem: boolean; onXem: () => void; linkTai: string;
}) {
  const kt = kieuTep(d.title, d.fileType);
  const laLink = d.fileType === 'link';
  const ten = d.title.replace(/\.(pdf|docx?|pptx?|xlsx?|zip|rar|7z)$/i, '');
  return (
    <div className="flex items-center gap-3 rounded-2xl border p-3" style={{ borderColor: vien, background: 'var(--bg-card)' }}>
      <span className="flex h-12 w-10 shrink-0 flex-col items-center justify-end rounded-lg pb-1 text-[9px] font-extrabold tracking-wide text-white shadow-sm"
        style={{ background: `linear-gradient(160deg, ${kt.mau}, ${kt.mau}cc)` }} aria-hidden>
        <FileText className="mb-auto mt-1.5 h-4 w-4 opacity-80" />
        {kt.nhan}
      </span>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 break-words text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }} title={d.title}>{ten}</p>
        <p className="mt-0.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {kt.nhan}{dungLuong(d.fileSizeBytes) ? ` · ${dungLuong(d.fileSizeBytes)}` : ''}
          {d.createdAt ? ` · ${new Date(d.createdAt).toLocaleDateString('vi-VN')}` : ''}
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">
        {coTheXem && (
          <button type="button" onClick={onXem} disabled={dangXem}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition hover:opacity-80 disabled:opacity-50"
            style={{ borderColor: vien, color: 'var(--text-primary)' }} title="Xem ngay trong trình duyệt, không cần tải về">
            {dangXem ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />} Xem trước
          </button>
        )}
        <a href={linkTai} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
          style={{ background: kt.mau }}>
          {laLink ? <><ExternalLink className="h-3.5 w-3.5" /> Mở</> : <><Download className="h-3.5 w-3.5" /> Tải về</>}
        </a>
      </div>
    </div>
  );
}

type LocLoai = 'tat-ca' | LoaiTaiLieu;

export function ThuVienTaiLieu({
  mo, dong, tenKhoa, ghiChu, tep, coTheXem, dangXemId, onXem, linkTai, laAdmin,
}: {
  mo: boolean; dong: () => void; tenKhoa: string; ghiChu?: string | null; tep: TepKhoa[];
  coTheXem: (d: TepKhoa) => boolean; dangXemId: number | null; onXem: (d: TepKhoa) => void; linkTai: (d: TepKhoa) => string;
  laAdmin?: boolean;
}) {
  const kq = useMemo(() => docTaiLieuKhoa(ghiChu), [ghiChu]);
  const [tim, setTim] = useState('');
  const [loc, setLoc] = useState<LocLoai>('tat-ca');
  const tepRef = useRef<HTMLDivElement>(null);
  const hopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mo) return;
    const truoc = document.activeElement as HTMLElement | null;
    hopRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dong(); };
    window.addEventListener('keydown', onKey);
    const cu = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = cu; truoc?.focus?.(); };
  }, [mo, dong]);

  const tatCa = kq.nhom.flatMap((g) => g.muc);
  const demLoai = useMemo(() => {
    const d = new Map<LoaiTaiLieu, number>();
    for (const m of tatCa) d.set(m.loai, (d.get(m.loai) ?? 0) + 1);
    return [...d.entries()].sort((a, b) => b[1] - a[1]);
  }, [tatCa]);
  const q = tim.trim().toLowerCase();
  const khop = (m: MucTaiLieu) => (loc === 'tat-ca' || m.loai === loc)
    && (!q || `${m.ten} ${m.moTa ?? ''} ${m.tenMien ?? ''}`.toLowerCase().includes(q));
  const nhom = kq.nhom.map((g) => ({ ...g, muc: g.muc.filter(khop) })).filter((g) => g.muc.length);
  const tepLoc = tep.filter((d) => !q || d.title.toLowerCase().includes(q));
  const trong = tatCa.length === 0 && tep.length === 0 && kq.ghiChu.length === 0;

  if (!mo) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-stretch justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Tài liệu khoá học">
      <button type="button" aria-label="Đóng" onClick={dong} className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-[2px]" />
      <div ref={hopRef} tabIndex={-1}
        className="relative flex h-full w-full flex-col overflow-hidden outline-none sm:h-[88vh] sm:max-w-5xl sm:rounded-3xl sm:border sm:shadow-2xl"
        style={{ background: 'var(--bg-primary)', borderColor: vien }}>
        {/* Đầu ngăn */}
        <div className="shrink-0 border-b px-4 pb-3 pt-4 sm:px-6" style={{ borderColor: vien, background: 'var(--bg-card)' }}>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <FolderOpen className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>Tài liệu khoá học</h2>
              <p className="truncate text-xs" style={{ color: 'var(--text-secondary)' }}>
                {tenKhoa} · {tatCa.length} tài liệu tham chiếu · {tep.length} tệp tải về
              </p>
            </div>
            <button type="button" onClick={dong} aria-label="Đóng" className="rounded-xl p-2 transition hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
              <X className="h-5 w-5" />
            </button>
          </div>
          {!trong && (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="flex flex-1 items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: vien, background: 'var(--bg-surface)' }}>
                <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm tài liệu, tên miền, tệp…"
                  className="w-full bg-transparent text-sm outline-none" style={{ color: 'var(--text-primary)' }} />
              </label>
              {demLoai.length > 1 && (
                <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 thin-scroll">
                  {([['tat-ca', tatCa.length] as [LocLoai, number], ...demLoai]).map(([l, n]) => {
                    const on = loc === l;
                    const mau = l === 'tat-ca' ? '#6366f1' : KIEU[l as LoaiTaiLieu].mau;
                    return (
                      <button key={l} type="button" onClick={() => setLoc(l)} aria-pressed={on}
                        className="shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold transition"
                        style={{ borderColor: on ? mau : vien, background: on ? `${mau}1f` : 'transparent', color: on ? mau : 'var(--text-secondary)' }}>
                        {l === 'tat-ca' ? 'Tất cả' : NHAN_LOAI[l as LoaiTaiLieu]} <span className="opacity-70">{n}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Thân ngăn */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 thin-scroll">
          {trong ? (
            <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
              <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                <Inbox className="h-8 w-8" />
              </span>
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Chưa có tài liệu cho khoá này</h3>
              <p className="mt-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Slide, đề cương, bài tập và link tham chiếu sẽ xuất hiện ở đây khi giảng viên đăng lên.
                {laAdmin ? ' Thêm ở trang quản trị khoá học → mục Tài liệu.' : ''}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Tệp tải về — kiểu Classroom */}
              <section ref={tepRef} aria-labelledby="tl-tep" className="scroll-mt-4">
                <div className="mb-3 flex items-baseline gap-2">
                  <h3 id="tl-tep" className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>Tệp tải về</h3>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{tep.length}</span>
                </div>
                {tepLoc.length > 0 ? (
                  <div className="grid gap-2.5 md:grid-cols-2">
                    {tepLoc.map((d) => (
                      <TheTep key={d.id} d={d} coTheXem={coTheXem(d)} dangXem={dangXemId === d.id} onXem={() => onXem(d)} linkTai={linkTai(d)} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed px-4 py-6 text-center text-sm" style={{ borderColor: vien, color: 'var(--text-secondary)' }}>
                    {tep.length ? 'Không có tệp nào khớp tìm kiếm.' : 'Chưa có tệp tải về — slide, đề cương, bài tập (PDF / DOCX / PPTX / ZIP) sẽ hiện ở đây, xem trước được rồi mới tải.'}
                    {!tep.length && laAdmin ? <span className="mt-1 block text-xs" style={{ color: 'var(--text-muted)' }}>Admin: tải lên ở trang quản trị khoá học → Tài liệu.</span> : null}
                  </div>
                )}
              </section>

              {nhom.map((g) => (
                <section key={g.tieuDe} aria-label={g.tieuDe}>
                  <div className="mb-3 flex items-baseline gap-2">
                    <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>{g.tieuDe}</h3>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{g.muc.length}</span>
                  </div>
                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {g.muc.map((m, i) => <TheTaiLieu key={`${m.ten}-${i}`} m={m} denTep={() => tepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />)}
                  </div>
                </section>
              ))}
              {(q || loc !== 'tat-ca') && nhom.length === 0 && tatCa.length > 0 && (
                <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>Không có tài liệu nào khớp bộ lọc.</p>
              )}

              {kq.ghiChu.length > 0 && (
                <section className="rounded-2xl border p-4" style={{ borderColor: vien, background: 'var(--bg-surface)' }}>
                  <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Ghi chú</h3>
                  {kq.ghiChu.map((c) => <p key={c} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{c}</p>)}
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Thẻ gọn ở thanh bên trang học — luôn hiện (kể cả khi trống, để người học biết tài liệu sẽ nằm ở đâu). */
export function KhoiTaiLieuBen({ ghiChu, tep, onMo }: { ghiChu?: string | null; tep: TepKhoa[]; onMo: () => void }) {
  const kq = useMemo(() => docTaiLieuKhoa(ghiChu), [ghiChu]);
  const tatCa = kq.nhom.flatMap((g) => g.muc);
  const noiBat = [...tatCa.filter((m) => m.url && !m.noiBo), ...tatCa.filter((m) => m.noiBo && m.url)].slice(0, 3);
  const trong = tatCa.length === 0 && tep.length === 0;
  return (
    <button type="button" onClick={onMo}
      className="group w-full overflow-hidden rounded-xl border p-3 text-left transition hover:border-neon-violet/50"
      style={{ borderColor: 'rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.05)' }} aria-haspopup="dialog">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
          <FolderOpen className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text-primary">Tài liệu khoá học</p>
          <p className="text-[11px] text-text-muted">
            {trong ? 'Chưa có tài liệu' : `${tatCa.length} tài liệu${tep.length ? ` · ${tep.length} tệp tải về` : ''}`}
          </p>
        </div>
        <span className="text-xs font-semibold text-tone-violet opacity-80 transition group-hover:translate-x-0.5">Mở →</span>
      </div>
      {noiBat.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {noiBat.map((m) => {
            const k = KIEU[m.loai] ?? KIEU['tham-khao'];
            const Icon = k.icon;
            return (
              <span key={m.ten} className="inline-flex max-w-full items-center gap-1 truncate rounded-md px-1.5 py-0.5 text-[11px]"
                style={{ background: `${k.mau}1a`, color: k.mau }}>
                <Icon className="h-3 w-3 shrink-0" /> <span className="truncate">{m.ten}</span>
              </span>
            );
          })}
          {tatCa.length > noiBat.length && <span className="px-1 text-[11px] text-text-muted">+{tatCa.length - noiBat.length}</span>}
        </div>
      )}
    </button>
  );
}
