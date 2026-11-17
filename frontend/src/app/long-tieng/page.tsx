'use client';

/**
 * /long-tieng — CT Lồng Tiếng (18/11/2026), CHỈ quản trị viên. Hợp đồng: docs/long-tieng-hop-dong.md mục 5.
 * Tạo việc bằng link hoặc tệp (PUT thẳng lên R2, có %), xem tiến độ (tự làm mới), tải kết quả, thử lại / huỷ / xoá,
 * mã kết nối cho app (hiện MỘT lần), chỗ tải app (chờ phát hành).
 * Màu chỉ dùng biến chủ đề (var(--…)) — không dùng `dark:` (dành riêng cho Notes, xem CLAUDE.md).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  AlertTriangle, Check, Copy, Download, Film, KeyRound, Link2, Loader2, Mic2, Music2, Pause, Play, RotateCcw, Trash2, Upload, X,
} from 'lucide-react';
import { getFriendlyErrorMessage, type ApiError } from '@/lib/api';
import {
  longTiengApi, moTaTep, putLenKho, type BaiNhac, type KetQua, type LoaiNhac, type MaKetNoi, type TrangThaiViec, type Viec,
} from '@/lib/longTieng';

/** Lỗi 4xx của tuyến này mang câu tiếng Việt cụ thể (LT_…) — giữ nguyên; còn lại dùng câu chung của web. */
const loi = (e: unknown) => {
  const r = (e as ApiError).response;
  const m = r?.data?.message;
  if (r && m && r.status !== 401 && r.status !== 403 && (r.status < 500 || r.status === 502)) return m;
  return getFriendlyErrorMessage(e as ApiError);
};
const kb = (n: number) => (n >= 1e9 ? `${(n / 1e9).toFixed(2)} GB` : n >= 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);
const phut = (s: number | null) => (s == null ? '' : `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`);
const ngay = (s: string) => new Date(s).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });

const NHAN_TRANG_THAI: Record<TrangThaiViec, { chu: string; mau: string }> = {
  cho_tai_len: { chu: 'Chờ tải lên', mau: 'var(--tone-amber)' },
  cho: { chu: 'Đang xếp hàng', mau: 'var(--tone-sky)' },
  tai: { chu: 'Trạm đang tải', mau: 'var(--tone-indigo)' },
  lam: { chu: 'Đang lồng tiếng', mau: 'var(--tone-violet)' },
  xong: { chu: 'Xong', mau: 'var(--tone-emerald)' },
  loi: { chu: 'Lỗi', mau: 'var(--tone-red)' },
  huy: { chu: 'Đã huỷ', mau: 'var(--text-muted)' },
};
const NHAN_KET_QUA: Record<KetQua['loai'], string> = {
  vi: 'Video tiếng Việt', 'vi-goc': 'Video VI + giọng gốc', 'srt-vi': 'Phụ đề Việt', 'srt-goc': 'Phụ đề gốc', 'thong-tin': 'Thông tin',
};
const DANG_CHAY: TrangThaiViec[] = ['cho_tai_len', 'cho', 'tai', 'lam'];

const the = 'rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-5';
const nutChinh = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors';
const nutPhu = 'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-50 transition-colors';
const o = 'w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-color)]';
const nhan = 'block text-xs font-medium text-[var(--text-secondary)] mb-1';

export default function TrangLongTieng() {
  const [quyen, setQuyen] = useState<'dang' | 'co' | 'khong'>('dang');

  useEffect(() => {
    fetch('/api/auth/admin-check', { credentials: 'include' })
      .then((r) => setQuyen(r.ok ? 'co' : 'khong'))
      .catch(() => setQuyen('khong'));
  }, []);

  if (quyen === 'dang') {
    return <div className="min-h-[60vh] flex items-center justify-center bg-[var(--bg-primary)]"><Loader2 className="w-6 h-6 animate-spin text-[var(--text-muted)]" /></div>;
  }
  if (quyen === 'khong') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4 text-center bg-[var(--bg-primary)]">
        <Mic2 className="w-10 h-10 text-[var(--text-muted)]" />
        <p className="text-[var(--text-primary)] font-semibold">CT Lồng Tiếng chỉ dành cho quản trị viên.</p>
        <Link href="/login?redirect=/long-tieng" className={nutChinh}>Đăng nhập</Link>
      </div>
    );
  }
  return <BangDieuKhien />;
}

function BangDieuKhien() {
  const [viec, setViec] = useState<Viec[] | null>(null);
  const [taiLen, setTaiLen] = useState<Record<string, number>>({}); // id việc ⇒ % đang PUT

  const napViec = useCallback(async () => {
    try { setViec(await longTiengApi.dsViec()); } catch (e) { toast.error(loi(e)); setViec((v) => v ?? []); }
  }, []);

  // Tự làm mới: 5 s khi còn việc đang chạy, 30 s khi rảnh; dừng khi tab ẩn.
  const dangChay = useMemo(() => (viec ?? []).some((v) => DANG_CHAY.includes(v.trangThai)), [viec]);
  useEffect(() => {
    void napViec();
  }, [napViec]);
  useEffect(() => {
    const t = setInterval(() => { if (document.visibilityState === 'visible') void napViec(); }, dangChay ? 5000 : 30000);
    return () => clearInterval(t);
  }, [dangChay, napViec]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10 space-y-5">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Mic2 className="w-7 h-7 text-[var(--accent-color)]" /> CT Lồng Tiếng
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Lồng tiếng Việt bằng giọng của bạn cho video kỹ thuật tiếng Trung / tiếng Anh — để tự học, không đăng lại.
              Trạm ở máy nhà làm phần nặng; kết quả giữ trên kho tối đa 7 ngày.
            </p>
          </div>
        </header>

        <TaoViec onXong={napViec} setTaiLen={setTaiLen} />
        <DanhSachViec viec={viec} taiLen={taiLen} napLai={napViec} />
        <MaKetNoiApp />
        <TaiApp />
      </div>
    </div>
  );
}

// ─── Tạo việc ──────────────────────────────────────────────────────────────

function TaoViec({ onXong, setTaiLen }: { onXong: () => Promise<void>; setTaiLen: React.Dispatch<React.SetStateAction<Record<string, number>>> }) {
  const [cach, setCach] = useState<'link' | 'tep'>('link');
  const [link, setLink] = useState('');
  const [tep, setTep] = useState<File[]>([]);
  const [tenVideo, setTenVideo] = useState('');
  const [lang, setLang] = useState<'auto' | 'zh' | 'en'>('auto');
  const [goc, setGoc] = useState(0.15);
  const [nhip, setNhip] = useState<'cho-giong' | 'tang-toc'>('cho-giong');
  const [loaiNhac, setLoaiNhac] = useState<LoaiNhac>('goc');
  const [idNhac, setIdNhac] = useState('');
  const [amLuong, setAmLuong] = useState(0.3);
  const [tepNhac, setTepNhac] = useState<File | null>(null);
  const [thuVien, setThuVien] = useState<BaiNhac[] | null>(null);
  const [dangGui, setDangGui] = useState(false);
  const [keo, setKeo] = useState(false);
  const chonTep = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loaiNhac !== 'thu-vien' || thuVien) return;
    longTiengApi.nhac().then((ds) => { setThuVien(ds); if (ds[0]) setIdNhac((x) => x || ds[0]!.id); }).catch((e) => { toast.error(loi(e)); setThuVien([]); });
  }, [loaiNhac, thuVien]);

  const nhacGui = () => ({
    loai: loaiNhac,
    ...(loaiNhac === 'thu-vien' ? { id: idNhac } : {}),
    ...(loaiNhac === 'thu-vien' || loaiNhac === 'tep' ? { amLuong } : {}),
    ...(loaiNhac === 'tep' && tepNhac ? { tep: moTaTep(tepNhac) } : {}),
  });

  const gui = async () => {
    if (cach === 'link' && !/^https?:\/\//i.test(link.trim())) { toast.error('Dán link bắt đầu bằng http:// hoặc https://'); return; }
    if (cach === 'tep' && !tep.length) { toast.error('Chọn hoặc kéo thả ít nhất một video.'); return; }
    if (loaiNhac === 'thu-vien' && !idNhac) { toast.error('Chọn một bài nhạc trong thư viện.'); return; }
    if (loaiNhac === 'tep' && !tepNhac) { toast.error('Chọn tệp nhạc nền.'); return; }
    setDangGui(true);
    try {
      const chung = { lang, goc, nhip, nhacNen: nhacGui() };
      if (cach === 'link') {
        const r = await longTiengApi.taoViec({ ...chung, url: link.trim(), ...(tenVideo.trim() ? { tenVideo: tenVideo.trim() } : {}) });
        if (r.taiLenNhac && tepNhac) { await putLenKho(r.taiLenNhac, tepNhac, (p) => setTaiLen((m) => ({ ...m, [r.job.id]: p }))); await longTiengApi.daTaiLen(r.job.id); }
        toast.success('Đã gửi việc — trạm sẽ tự tải video.');
        setLink(''); setTenVideo('');
      } else {
        for (const f of tep) {
          const r = await longTiengApi.taoViec({ ...chung, tep: moTaTep(f), ...(tep.length === 1 && tenVideo.trim() ? { tenVideo: tenVideo.trim() } : {}) });
          await onXong();
          const tong = f.size + (tepNhac?.size ?? 0);
          await putLenKho(r.taiLen!, f, (p) => setTaiLen((m) => ({ ...m, [r.job.id]: Math.round((p * f.size) / tong) })));
          if (r.taiLenNhac && tepNhac) await putLenKho(r.taiLenNhac, tepNhac, (p) => setTaiLen((m) => ({ ...m, [r.job.id]: Math.round(((f.size + (p / 100) * tepNhac.size) / tong) * 100) })));
          await longTiengApi.daTaiLen(r.job.id);
          setTaiLen((m) => { const n = { ...m }; delete n[r.job.id]; return n; });
          toast.success(`Đã tải lên: ${f.name}`);
        }
        setTep([]); setTenVideo('');
      }
    } catch (e) {
      toast.error(e instanceof Error && !(e as ApiError).isAxiosError ? e.message : loi(e));
    } finally {
      setDangGui(false);
      await onXong();
    }
  };

  const nhanTep = (ds: FileList | null) => {
    const v = Array.from(ds ?? []).filter((f) => /^video\//.test(f.type) || /\.(mp4|mkv|mov|webm|m4v|avi|flv|ts)$/i.test(f.name));
    if (ds?.length && !v.length) toast.error('Chỉ nhận tệp video.');
    if (v.length) setTep((cu) => [...cu, ...v]);
  };

  return (
    <section className={the}>
      <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">Thêm video</h2>
      <div className="inline-flex rounded-xl border border-[var(--border-color)] p-1 mb-4 bg-[var(--bg-surface)]">
        {([['link', 'Dán link', Link2], ['tep', 'Tải tệp lên', Upload]] as const).map(([k, chu, Icon]) => (
          <button key={k} type="button" onClick={() => setCach(k)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${cach === k ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
            <Icon className="w-4 h-4" /> {chu}
          </button>
        ))}
      </div>

      {cach === 'link' ? (
        <div className="space-y-3">
          <div>
            <label className={nhan} htmlFor="lt-link">Link video (YouTube, Bilibili…)</label>
            <input id="lt-link" className={o} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.bilibili.com/video/…" inputMode="url" />
          </div>
          <p className="text-xs text-[var(--text-muted)]">Trạm ở máy nhà tự tải. Trang nào chặn máy nhà thì việc báo lỗi — khi đó tải video về máy rồi dùng “Tải tệp lên”.</p>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setKeo(true); }}
          onDragLeave={() => setKeo(false)}
          onDrop={(e) => { e.preventDefault(); setKeo(false); nhanTep(e.dataTransfer.files); }}
          onClick={() => chonTep.current?.click()}
          role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') chonTep.current?.click(); }}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${keo ? 'border-[var(--accent-color)] bg-[var(--bg-surface-hover)]' : 'border-[var(--border-color)] bg-[var(--bg-surface)]'}`}
        >
          <input ref={chonTep} type="file" accept="video/*,.mkv,.flv,.ts" multiple className="hidden" onChange={(e) => { nhanTep(e.target.files); e.target.value = ''; }} />
          <Film className="w-8 h-8 mx-auto text-[var(--text-muted)] mb-2" />
          <p className="text-sm text-[var(--text-primary)] font-medium">Kéo thả video vào đây hoặc bấm để chọn (nhiều tệp được)</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Mỗi tệp tối đa 5 GB — tải thẳng lên kho, không qua máy chủ web.</p>
          {tep.length > 0 && (
            <ul className="mt-3 space-y-1 text-left" onClick={(e) => e.stopPropagation()}>
              {tep.map((f, k) => (
                <li key={`${f.name}-${k}`} className="flex items-center justify-between gap-2 text-xs rounded-lg bg-[var(--bg-card)] px-2 py-1.5 text-[var(--text-primary)]">
                  <span className="truncate">{f.name} · {kb(f.size)}</span>
                  <button type="button" aria-label={`Bỏ ${f.name}`} onClick={() => setTep((ds) => ds.filter((_, j) => j !== k))} className="text-[var(--text-muted)] hover:text-[var(--tone-red)]"><X className="w-4 h-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 mt-4">
        <div>
          <label className={nhan} htmlFor="lt-ten">Tên video (tuỳ chọn — dùng đặt tên tệp kết quả)</label>
          <input id="lt-ten" className={o} value={tenVideo} onChange={(e) => setTenVideo(e.target.value)} placeholder="Để trống: lấy tên từ link / tệp" disabled={cach === 'tep' && tep.length > 1} />
        </div>
        <div>
          <label className={nhan} htmlFor="lt-lang">Ngôn ngữ gốc</label>
          <select id="lt-lang" className={o} value={lang} onChange={(e) => setLang(e.target.value as typeof lang)}>
            <option value="auto">Tự nhận</option>
            <option value="zh">Tiếng Trung</option>
            <option value="en">Tiếng Anh</option>
          </select>
        </div>
        <div>
          <label className={nhan} htmlFor="lt-nhip">Nhịp đọc</label>
          <select id="lt-nhip" className={o} value={nhip} onChange={(e) => setNhip(e.target.value as typeof nhip)}>
            <option value="cho-giong">Giữ nhịp đọc tự nhiên — kéo dài hình khi cần (khuyên dùng)</option>
            <option value="tang-toc">Giữ nguyên độ dài video — đọc nhanh hơn khi câu dài</option>
          </select>
        </div>
        <div>
          <label className={nhan} htmlFor="lt-goc">Giọng gốc trong bản “VI + giọng gốc”: {Math.round(goc * 100)}%</label>
          <input id="lt-goc" type="range" min={0} max={0.4} step={0.05} value={goc} onChange={(e) => setGoc(Number(e.target.value))} className="w-full accent-[var(--accent-color)]" />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3">
        <p className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1.5 mb-2"><Music2 className="w-4 h-4" /> Nhạc nền</p>
        <div className="flex flex-wrap gap-2">
          {([['goc', 'Nhạc gốc của video'], ['thu-vien', 'Thư viện nhạc'], ['tep', 'Nhạc của tôi'], ['khong', 'Không nhạc']] as const).map(([k, chu]) => (
            <button key={k} type="button" onClick={() => setLoaiNhac(k)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${loaiNhac === k ? 'border-[var(--accent-color)] text-[var(--accent-color)] bg-[var(--bg-card)]' : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
              {chu}
            </button>
          ))}
        </div>
        {loaiNhac === 'thu-vien' && <ChonNhac ds={thuVien} chon={idNhac} setChon={setIdNhac} />}
        {loaiNhac === 'tep' && (
          <div className="mt-3">
            <input type="file" accept="audio/*,.mp3,.m4a,.wav,.flac,.ogg" onChange={(e) => setTepNhac(e.target.files?.[0] ?? null)} className="text-xs text-[var(--text-secondary)]" aria-label="Chọn tệp nhạc nền" />
            {tepNhac && <p className="text-xs text-[var(--text-muted)] mt-1">{tepNhac.name} · {kb(tepNhac.size)} (tối đa 300 MB)</p>}
          </div>
        )}
        {(loaiNhac === 'thu-vien' || loaiNhac === 'tep') && (
          <div className="mt-3">
            <label className={nhan} htmlFor="lt-am">Âm lượng nhạc: {Math.round(amLuong * 100)}% · tự nhỏ đi khi có giọng Việt</label>
            <input id="lt-am" type="range" min={0.05} max={0.8} step={0.05} value={amLuong} onChange={(e) => setAmLuong(Number(e.target.value))} className="w-full accent-[var(--accent-color)]" />
          </div>
        )}
        {loaiNhac === 'khong' && <p className="text-xs text-[var(--text-muted)] mt-2">Chỉ còn giọng Việt — mất luôn tiếng hiệu ứng của video gốc.</p>}
      </div>

      <div className="mt-4 flex justify-end">
        <button type="button" className={nutChinh} onClick={gui} disabled={dangGui}>
          {dangGui ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic2 className="w-4 h-4" />} Lồng tiếng
        </button>
      </div>
    </section>
  );
}

function ChonNhac({ ds, chon, setChon }: { ds: BaiNhac[] | null; chon: string; setChon: (id: string) => void }) {
  const [dangNghe, setDangNghe] = useState<string | null>(null);
  const am = useRef<HTMLAudioElement | null>(null);
  useEffect(() => () => { am.current?.pause(); }, []);
  if (!ds) return <p className="text-xs text-[var(--text-muted)] mt-3 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Đang tải thư viện…</p>;
  if (!ds.length) return <p className="text-xs text-[var(--text-muted)] mt-3">Thư viện nhạc chưa có bài nào.</p>;
  const nghe = (b: BaiNhac) => {
    if (dangNghe === b.id) { am.current?.pause(); setDangNghe(null); return; }
    if (!b.nghe) return;
    am.current?.pause();
    am.current = new Audio(b.nghe);
    am.current.onended = () => setDangNghe(null);
    void am.current.play().catch(() => setDangNghe(null));
    setDangNghe(b.id);
  };
  return (
    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
      {ds.map((b) => (
        <li key={b.id} className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${chon === b.id ? 'border-[var(--accent-color)]' : 'border-[var(--border-color)]'} bg-[var(--bg-card)]`}>
          <button type="button" aria-label={dangNghe === b.id ? `Dừng ${b.ten}` : `Nghe thử ${b.ten}`} onClick={() => nghe(b)} className="shrink-0 rounded-full p-1.5 text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]">
            {dangNghe === b.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button type="button" onClick={() => setChon(b.id)} className="min-w-0 flex-1 text-left">
            <span className="block truncate text-xs font-medium text-[var(--text-primary)]">{b.ten}</span>
            <span className="block truncate text-[11px] text-[var(--text-muted)]">{b.tamTrang} · {phut(b.thoiLuong)} · <a href={b.nguon} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="underline">{b.giayPhep}</a>{b.tacGia ? ` · ${b.tacGia}` : ''}</span>
          </button>
          {chon === b.id && <Check className="w-4 h-4 shrink-0 text-[var(--accent-color)]" />}
        </li>
      ))}
    </ul>
  );
}

// ─── Danh sách việc ────────────────────────────────────────────────────────

function DanhSachViec({ viec, taiLen, napLai }: { viec: Viec[] | null; taiLen: Record<string, number>; napLai: () => Promise<void> }) {
  const [dangLam, setDangLam] = useState<string | null>(null);
  const lam = async (id: string, f: () => Promise<unknown>, xong: string) => {
    setDangLam(id);
    try { await f(); toast.success(xong); } catch (e) { toast.error(loi(e)); } finally { setDangLam(null); await napLai(); }
  };
  return (
    <section className={the}>
      <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">Việc của bạn</h2>
      {!viec ? (
        <div className="py-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-[var(--text-muted)]" /></div>
      ) : !viec.length ? (
        <p className="text-sm text-[var(--text-muted)] py-6 text-center">Chưa có việc nào — dán link hoặc kéo video vào ô phía trên.</p>
      ) : (
        <ul className="space-y-3">
          {viec.map((v) => {
            const nhanTT = NHAN_TRANG_THAI[v.trangThai];
            const put = taiLen[v.id];
            const pt = put != null ? put : v.phanTram;
            const chay = DANG_CHAY.includes(v.trangThai);
            const ten = v.tenVideo || v.tep?.ten || v.url || v.id;
            return (
              <li key={v.id} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--text-primary)] break-words">{ten}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 break-all">
                      {ngay(v.tao)} · {v.lang === 'auto' ? 'tự nhận ngôn ngữ' : v.lang === 'zh' ? 'tiếng Trung' : 'tiếng Anh'} · {v.nhip === 'cho-giong' ? 'giữ nhịp đọc' : 'đọc nhanh'}
                      {' · nhạc '}{v.nhacNen.loai === 'goc' ? 'gốc' : v.nhacNen.loai === 'thu-vien' ? 'thư viện' : v.nhacNen.loai === 'tep' ? 'của tôi' : 'không'}
                      {v.thoiLuong ? ` · ${phut(v.thoiLuong)}` : ''}
                      {v.url && v.tenVideo ? <> · <a href={v.url} target="_blank" rel="noreferrer" className="underline">link gốc</a></> : null}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold border" style={{ color: nhanTT.mau, borderColor: nhanTT.mau }}>
                    {put != null ? 'Đang tải lên' : nhanTT.chu}
                  </span>
                </div>

                {(chay || put != null) && (
                  <div className="mt-2">
                    <div className="h-1.5 rounded-full bg-[var(--bg-surface-hover)] overflow-hidden" role="progressbar" aria-valuenow={pt} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full rounded-full bg-[var(--accent-color)] transition-all duration-500" style={{ width: `${Math.max(2, pt)}%` }} />
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">{put != null ? `Tải lên kho ${put}%` : `${v.buoc ?? ''} · ${pt}%`}</p>
                  </div>
                )}
                {v.trangThai === 'xong' && v.buoc && <p className="text-xs text-[var(--text-secondary)] mt-2">{v.buoc}</p>}
                {v.trangThai === 'loi' && v.loi && (
                  <p className="mt-2 text-xs rounded-lg px-2 py-1.5 border flex gap-1.5 items-start break-words" style={{ color: 'var(--tone-red)', borderColor: 'var(--tone-red)' }}>
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> <span className="min-w-0">{v.loi}</span>
                  </p>
                )}

                {v.trangThai === 'xong' && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {v.ketQua.map((k) => k.url ? (
                      <a key={k.loai} href={k.url} download={k.ten} className={nutPhu} title={k.ten}>
                        <Download className="w-3.5 h-3.5" /> {NHAN_KET_QUA[k.loai]} <span className="text-[var(--text-muted)]">{kb(k.kichThuoc)}</span>
                      </a>
                    ) : null)}
                    {v.ketQua.every((k) => !k.url) && (
                      <span className="text-xs text-[var(--text-muted)]">{v.daTaiVe ? 'Đã tải về — tệp trên kho đã xoá.' : 'Tệp kết quả đã hết hạn trên kho.'}</span>
                    )}
                  </div>
                )}

                <div className="mt-2 flex flex-wrap gap-2 justify-end">
                  {v.trangThai === 'loi' && (
                    <button type="button" className={nutPhu} disabled={dangLam === v.id} onClick={() => lam(v.id, () => longTiengApi.thuLai(v.id), 'Đã xếp lại hàng — trạm làm tiếp từ bước dở.')}>
                      <RotateCcw className="w-3.5 h-3.5" /> Thử lại
                    </button>
                  )}
                  {v.trangThai === 'xong' && v.ketQua.some((k) => k.url) && (
                    <button type="button" className={nutPhu} disabled={dangLam === v.id}
                      onClick={() => { if (confirm('Bạn đã tải đủ các tệp? Tệp trên kho sẽ bị xoá ngay.')) void lam(v.id, () => longTiengApi.daTaiVe(v.id), 'Đã xoá tệp trên kho.'); }}>
                      <Check className="w-3.5 h-3.5" /> Đã tải xong
                    </button>
                  )}
                  <button type="button" className={nutPhu} disabled={dangLam === v.id || put != null}
                    onClick={() => { if (confirm(chay ? 'Huỷ việc này? Trạm sẽ dừng và mọi tệp bị xoá.' : 'Xoá việc này và mọi tệp của nó?')) void lam(v.id, () => longTiengApi.xoa(v.id), chay ? 'Đã huỷ việc.' : 'Đã xoá việc.'); }}>
                    <Trash2 className="w-3.5 h-3.5" /> {chay ? 'Huỷ' : 'Xoá'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// ─── Mã kết nối app ────────────────────────────────────────────────────────

function MaKetNoiApp() {
  const [ds, setDs] = useState<MaKetNoi[] | null>(null);
  const [ten, setTen] = useState('');
  const [maMoi, setMaMoi] = useState<string | null>(null);
  const [dangTao, setDangTao] = useState(false);
  const nap = useCallback(async () => { try { setDs(await longTiengApi.dsMa()); } catch (e) { toast.error(loi(e)); setDs([]); } }, []);
  useEffect(() => { void nap(); }, [nap]);

  const tao = async () => {
    setDangTao(true);
    try { const r = await longTiengApi.taoMa(ten.trim()); setMaMoi(r.ma); setTen(''); await nap(); } catch (e) { toast.error(loi(e)); } finally { setDangTao(false); }
  };
  const chep = async () => {
    if (!maMoi) return;
    try { await navigator.clipboard.writeText(maMoi); toast.success('Đã chép mã.'); } catch { toast.error('Không chép được — hãy bôi đen và chép tay.'); }
  };
  const thuHoi = async (m: MaKetNoi) => {
    if (!confirm(`Thu hồi mã "${m.ten ?? m.dau}"? App đang dùng mã này sẽ bị đăng xuất.`)) return;
    try { await longTiengApi.thuHoiMa(m.id); toast.success('Đã thu hồi.'); await nap(); } catch (e) { toast.error(loi(e)); }
  };

  return (
    <section className={the}>
      <h2 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-1.5"><KeyRound className="w-4 h-4" /> Mã kết nối app</h2>
      <p className="text-xs text-[var(--text-secondary)] mt-1 mb-3">App CT Lồng Tiếng đăng nhập bằng mã này. Mã chỉ hiện MỘT lần — mất thì tạo mã mới và thu hồi mã cũ.</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input className={o} value={ten} onChange={(e) => setTen(e.target.value)} placeholder="Đặt tên để nhận ra, vd MacBook ở nhà" maxLength={100} aria-label="Tên mã kết nối" />
        <button type="button" className={`${nutChinh} shrink-0`} onClick={tao} disabled={dangTao}>{dangTao ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />} Tạo mã</button>
      </div>
      {maMoi && (
        <div className="mt-3 rounded-xl border p-3" style={{ borderColor: 'var(--tone-emerald)' }}>
          <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--tone-emerald)' }}>Mã mới — chép ngay, sẽ không hiện lại:</p>
          <div className="flex items-center gap-2">
            <code className="min-w-0 flex-1 break-all rounded-lg bg-[var(--bg-surface)] px-2 py-1.5 text-xs text-[var(--text-primary)] font-mono select-all">{maMoi}</code>
            <button type="button" className={nutPhu} onClick={chep}><Copy className="w-3.5 h-3.5" /> Chép</button>
            <button type="button" aria-label="Ẩn mã" className={nutPhu} onClick={() => setMaMoi(null)}><X className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      )}
      <ul className="mt-3 divide-y divide-[var(--border-color)]">
        {(ds ?? []).map((m) => (
          <li key={m.id} className="py-2 flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <p className={`text-sm ${m.thuHoi ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>{m.ten || 'Không tên'} <code className="text-xs text-[var(--text-muted)]">{m.dau}…</code></p>
              <p className="text-[11px] text-[var(--text-muted)]">Tạo {ngay(m.tao)}{m.dungLanCuoi ? ` · dùng lần cuối ${ngay(m.dungLanCuoi)}` : ' · chưa dùng'}{m.thuHoi ? ` · thu hồi ${ngay(m.thuHoi)}` : ''}</p>
            </div>
            {!m.thuHoi && <button type="button" className={nutPhu} onClick={() => thuHoi(m)}><Trash2 className="w-3.5 h-3.5" /> Thu hồi</button>}
          </li>
        ))}
        {ds && !ds.length && <li className="py-2 text-xs text-[var(--text-muted)]">Chưa có mã nào.</li>}
      </ul>
    </section>
  );
}

// ─── Tải app ───────────────────────────────────────────────────────────────

function TaiApp() {
  return (
    <section className={the}>
      <h2 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-1.5"><Download className="w-4 h-4" /> Tải app CT Lồng Tiếng</h2>
      <p className="text-xs text-[var(--text-secondary)] mt-1">
        App cho Mac, Windows và Linux: kéo thả nhiều video, tự tải kết quả về thư mục của bạn, trình phát đổi bản VI ↔ VI + giọng gốc.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {['macOS', 'Windows', 'Linux'].map((hdh) => (
          <span key={hdh} className={`${nutPhu} cursor-not-allowed opacity-60`} aria-disabled="true">{hdh} · sắp có</span>
        ))}
      </div>
      <p className="text-[11px] text-[var(--text-muted)] mt-2">Bản dựng đang chờ chủ kênh duyệt phát hành.</p>
    </section>
  );
}
