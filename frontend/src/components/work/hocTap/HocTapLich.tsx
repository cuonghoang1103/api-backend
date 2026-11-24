'use client';
/**
 * CT Work → Của tôi → Học tập & Lịch (/work/hoc-tap) — 24/11/2026.
 *
 * MỘT chỗ cho lịch cá nhân: lớp trên trường + khối tự học do bộ xếp lịch đặt (backend /hoc-tap, `xepLich.ts`) + việc
 * CÁ NHÂN (bảng `viec_ca_nhan`) + hạn thẻ / họp của các dự án CT Work (GET /work/me/agenda). Riêng tư: mọi dữ liệu là của
 * người đang đăng nhập.
 *
 * Dùng LẠI toàn bộ phần học tập của /hoc-tap (thẻ việc, chấm bằng chứng, AI soạn kế hoạch, tỷ lệ trượt) — trang này chỉ
 * là giao diện khác trên cùng API. Luật "không tự tích" việc học giữ nguyên: việc học chỉ mở ra thẻ chi tiết (Bắt đầu /
 * Nộp), việc cá nhân mới có ô đánh dấu xong.
 * CuongMini: `/hoc hom-nay | tuan | them | xong | bat-dau` (MCP `hoc_tap`) đọc/ghi đúng dữ liệu này.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, CalendarRange, Check, ChevronRight, Plus, RefreshCw, Sparkles, Trash2 } from 'lucide-react';
import { hocTapApi, MAU_MUC, type AgendaMuc, type TongQuan, type ViecCaNhan, type ViecGon } from '@/lib/hoc-tap-api';
import { DongHoRuiRo, DongViec, HopThoai, Khung, Nut, The, ThanhTienDo, cx, oNhap } from '@/components/hoc-tap/ui';
import { ChiTietViec, thongBao } from '@/components/hoc-tap/ChiTietViec';
import { SoanKeHoach, TaoKy, ThemMon } from '@/components/hoc-tap/ThietLap';
import TienDoDanhGia from './TienDoDanhGia';

const VN = 7 * 3_600_000;
const NGAY = 86_400_000;
const TEN_THU = ['', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const GIO_DAU = 6, GIO_CUOI = 24, PX = 48;

/** 'YYYY-MM-DD' ngày VN của mốc t (ms). */
const ngayVN = (t: number) => new Date(t + VN).toISOString().slice(0, 10);
const congNgay = (ymd: string, n: number) => new Date(Date.parse(`${ymd}T00:00:00Z`) + n * NGAY).toISOString().slice(0, 10);
const thuCua = (ymd: string) => ((new Date(`${ymd}T00:00:00Z`).getUTCDay() + 6) % 7) + 1;
/** Phút trong ngày (giờ VN) của một ISO. */
const phutVN = (iso: string) => { const d = new Date(Date.parse(iso) + VN); return d.getUTCHours() * 60 + d.getUTCMinutes(); };
const gioVN = (iso: string) => new Date(Date.parse(iso) + VN).toISOString().slice(11, 16);
const phutChuoi = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
/** (ngày VN, 'HH:MM') ⇒ ISO UTC. */
const isoTu = (ymd: string, hhmm: string) => new Date(Date.parse(`${ymd}T${hhmm}:00.000Z`) - VN).toISOString();

type Khoi =
  | { loai: 'lop'; a: number; b: number; nhan: string; phu: string }
  | { loai: 'hoc'; a: number; b: number; v: ViecGon }
  | { loai: 'caNhan'; a: number; b: number; v: ViecCaNhan }
  | { loai: 'hop'; a: number; b: number; m: AgendaMuc };

interface NgayLich {
  ngay: string;
  khoi: Khoi[];
  /** Không giờ: việc cá nhân trong ngày + hạn thẻ/sprint/phát hành của dự án. */
  caNgay: Array<{ loai: 'caNhan'; v: ViecCaNhan } | { loai: 'duAn'; m: AgendaMuc }>;
}

function dungLich(tq: TongQuan | null, caNhan: ViecCaNhan[], agenda: AgendaMuc[], homNay: string): NgayLich[] {
  return Array.from({ length: 7 }, (_, i) => {
    const ngay = congNgay(homNay, i);
    const lichHoc = tq?.lich?.find((n) => n.ngay === ngay);
    const khoi: Khoi[] = [];
    for (const l of lichHoc?.lop ?? []) khoi.push({ loai: 'lop', a: phutChuoi(l.batDau), b: phutChuoi(l.ketThuc), nhan: `🏫 ${l.maMon}`, phu: `${l.batDau}–${l.ketThuc}${l.phong ? ` · ${l.phong}` : ''}` });
    for (const v of lichHoc?.viec ?? []) if (v.gioBatDau) { const a = phutVN(v.gioBatDau); khoi.push({ loai: 'hoc', a, b: a + v.thoiLuongPhut, v }); }
    const caNgay: NgayLich['caNgay'] = [];
    for (const v of caNhan) {
      if (v.ngay !== ngay) continue;
      if (v.gioBatDau) { const a = phutVN(v.gioBatDau); khoi.push({ loai: 'caNhan', a, b: a + v.thoiLuongPhut, v }); } else caNgay.push({ loai: 'caNhan', v });
    }
    for (const m of agenda) {
      if (m.date !== ngay) continue;
      if (m.type === 'meeting' && m.startsAt) {
        const a = phutVN(m.startsAt);
        khoi.push({ loai: 'hop', a, b: m.endsAt ? Math.max(a + 15, phutVN(m.endsAt)) : a + 60, m });
      } else caNgay.push({ loai: 'duAn', m });
    }
    return { ngay, khoi: khoi.sort((x, y) => x.a - y.a), caNgay };
  });
}

// ─── Lưới theo giờ (1 hoặc 7 cột) ────────────────────────────────

function LuoiGio({ ngays, homNay, now, onHoc, onCaNhan }: {
  ngays: NgayLich[]; homNay: string; now: number; onHoc: (id: number) => void; onCaNhan: (v: ViecCaNhan) => void;
}) {
  const somNhat = Math.min(GIO_DAU * 60, ...ngays.flatMap((n) => n.khoi.map((k) => k.a)));
  const dau = Math.max(0, Math.floor(somNhat / 60));
  const cao = (GIO_CUOI - dau) * PX;
  const y = (p: number) => ((p - dau * 60) / 60) * PX;
  const phutNay = phutVN(new Date(now).toISOString());
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
      <div className={cx('grid', ngays.length > 1 && 'min-w-[820px]')} style={{ gridTemplateColumns: `52px repeat(${ngays.length}, minmax(0,1fr))` }}>
        <div className="sticky left-0 z-10 bg-[var(--bg-card)]" />
        {ngays.map((n) => (
          <div key={n.ngay} className={cx('border-b border-l border-[var(--border-color)] px-1 py-1.5 text-center text-xs', n.ngay === homNay ? 'bg-neon-violet/10 font-bold text-neon-violet' : 'text-text-muted')}>
            {n.ngay === homNay ? 'Hôm nay' : TEN_THU[thuCua(n.ngay)]} <span className="opacity-70">{n.ngay.slice(8, 10)}/{n.ngay.slice(5, 7)}</span>
          </div>
        ))}
        {/* Hàng "cả ngày": việc cá nhân không giờ + hạn thẻ dự án */}
        <div className="sticky left-0 z-10 border-b border-[var(--border-color)] bg-[var(--bg-card)] px-1 py-1 text-right text-[10px] text-text-muted">cả ngày</div>
        {ngays.map((n) => (
          <div key={`cn${n.ngay}`} className="min-h-[28px] space-y-0.5 border-b border-l border-[var(--border-color)] p-0.5">
            {n.caNgay.map((c) => c.loai === 'caNhan' ? (
              <button key={`c${c.v.id}`} onClick={() => onCaNhan(c.v)} className={cx('block w-full truncate rounded-md bg-teal-500/15 px-1.5 py-0.5 text-left text-[10px] font-semibold text-teal-600', c.v.xong && 'line-through opacity-50')} title={c.v.tieuDe}>
                {c.v.xong ? '✓ ' : '• '}{c.v.tieuDe}
              </button>
            ) : (
              <Link key={`d${c.m.type}${c.m.key ?? c.m.title}`} href={c.m.url ?? '/work'} className="block truncate rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600" title={`${c.m.project?.key ?? ''} · ${c.m.title}`}>
                {c.m.type === 'due' ? `⏳ ${c.m.key}` : c.m.type === 'sprint' ? '🏃' : c.m.type === 'release' ? '🚀' : '🏁'} {c.m.title}
              </Link>
            ))}
          </div>
        ))}
        <div className="relative sticky left-0 z-10 bg-[var(--bg-card)]" style={{ height: cao }}>
          {Array.from({ length: GIO_CUOI - dau }, (_, h) => (
            <div key={h} className="absolute right-1 -translate-y-1/2 text-[10px] tabular-nums text-text-muted" style={{ top: h * PX }}>{String(dau + h).padStart(2, '0')}:00</div>
          ))}
        </div>
        {ngays.map((n) => (
          <div key={`g${n.ngay}`} className="relative border-l border-[var(--border-color)]" style={{ height: cao, backgroundImage: `repeating-linear-gradient(to bottom, var(--border-color) 0 1px, transparent 1px ${PX}px)` }}>
            {n.khoi.map((k, i) => {
              const top = y(k.a), h = Math.max(20, ((k.b - k.a) / 60) * PX - 2);
              if (k.loai === 'lop') return (
                <div key={`l${i}`} className="absolute inset-x-0.5 overflow-hidden rounded-lg border border-dashed border-[var(--text-muted)] bg-[var(--bg-primary)] px-1.5 py-1 text-[10px] leading-tight text-text-muted" style={{ top, height: h }}>
                  <div className="font-bold text-text-primary">{k.nhan}</div><div>{k.phu}</div>
                </div>
              );
              if (k.loai === 'hoc') return (
                <button key={`h${k.v.id}`} onClick={() => onHoc(k.v.id)} title={`${k.v.maMon} · ${k.v.tieuDe}`}
                  className={cx('absolute inset-x-0.5 overflow-hidden rounded-lg px-1.5 py-1 text-left text-[10px] leading-tight text-white shadow-sm transition hover:z-20 hover:scale-[1.02]', k.v.trangThai === 'DAT' && 'opacity-50')}
                  style={{ top, height: h, background: k.v.mau ?? '#6366f1' }}>
                  <div className="font-bold">{k.v.trangThai === 'DAT' ? '✓ ' : ''}{gioVN(k.v.gioBatDau!)} {k.v.maMon}</div>
                  {h > 30 && <div className="line-clamp-3 opacity-95">{k.v.tieuDe}</div>}
                </button>
              );
              if (k.loai === 'caNhan') return (
                <button key={`c${k.v.id}`} onClick={() => onCaNhan(k.v)} title={k.v.tieuDe}
                  className={cx('absolute inset-x-0.5 overflow-hidden rounded-lg border border-teal-500/60 bg-teal-500/15 px-1.5 py-1 text-left text-[10px] leading-tight text-teal-700 transition hover:z-20', k.v.xong && 'line-through opacity-50')}
                  style={{ top, height: h }}>
                  <div className="font-bold">{k.v.xong ? '✓ ' : ''}{gioVN(k.v.gioBatDau!)} · cá nhân</div>
                  {h > 30 && <div className="line-clamp-3">{k.v.tieuDe}</div>}
                </button>
              );
              return (
                <Link key={`m${i}`} href={k.m.url ?? '/work'} title={`${k.m.project?.key ?? ''} · ${k.m.title}`}
                  className="absolute inset-x-0.5 overflow-hidden rounded-lg border border-purple-500/60 bg-purple-500/15 px-1.5 py-1 text-[10px] leading-tight text-purple-700 hover:z-20"
                  style={{ top, height: h }}>
                  <div className="font-bold">👥 {k.m.startsAt ? gioVN(k.m.startsAt) : ''} {k.m.project?.key}</div>
                  {h > 30 && <div className="line-clamp-2">{k.m.title}</div>}
                </Link>
              );
            })}
            {n.ngay === homNay && phutNay >= dau * 60 && (
              <div className="pointer-events-none absolute inset-x-0 z-30 h-0.5 bg-red-500" style={{ top: y(phutNay) }}>
                <div className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Thêm / sửa việc cá nhân ─────────────────────────────────────

function HopViecCaNhan({ mo, viec, ngayMacDinh, onDong, onXong }: {
  mo: boolean; viec: ViecCaNhan | null; ngayMacDinh: string; onDong: () => void; onXong: () => void;
}) {
  const [tieuDe, setTieuDe] = useState('');
  const [ngay, setNgay] = useState(ngayMacDinh);
  const [gio, setGio] = useState('');
  const [phut, setPhut] = useState(30);
  const [ghiChu, setGhiChu] = useState('');
  const [loi, setLoi] = useState('');
  const [dang, setDang] = useState(false);
  useEffect(() => {
    if (!mo) return;
    setTieuDe(viec?.tieuDe ?? ''); setNgay(viec?.ngay ?? ngayMacDinh); setGio(viec?.gioBatDau ? gioVN(viec.gioBatDau) : '');
    setPhut(viec?.thoiLuongPhut ?? 30); setGhiChu(viec?.ghiChu ?? ''); setLoi('');
  }, [mo, viec, ngayMacDinh]);

  const luu = async () => {
    if (!tieuDe.trim()) { setLoi('Nhập tên việc.'); return; }
    setDang(true); setLoi('');
    const b = { tieuDe: tieuDe.trim(), ngay, gioBatDau: gio ? isoTu(ngay, gio) : null, thoiLuongPhut: phut, ghiChu: ghiChu.trim() || null };
    try {
      if (viec) await hocTapApi.suaCaNhan(viec.id, b); else await hocTapApi.themCaNhan(b);
      onXong();
    } catch (e) { setLoi(thongBao(e)); } finally { setDang(false); }
  };

  return (
    <HopThoai mo={mo} onDong={onDong} tieuDe={viec ? 'Sửa việc cá nhân' : 'Thêm việc cá nhân'}>
      <div className="space-y-3">
        <input className={oNhap} autoFocus placeholder="Ví dụ: Ôn 30 từ vựng N5, gọi về nhà, đi chợ…" value={tieuDe} maxLength={255} onChange={(e) => setTieuDe(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void luu(); }} />
        <div className="grid grid-cols-3 gap-2">
          <label className="text-xs text-text-muted">Ngày<input type="date" className={cx(oNhap, 'mt-1')} value={ngay} onChange={(e) => setNgay(e.target.value)} /></label>
          <label className="text-xs text-text-muted">Giờ (bỏ trống = cả ngày)<input type="time" className={cx(oNhap, 'mt-1')} value={gio} onChange={(e) => setGio(e.target.value)} /></label>
          <label className="text-xs text-text-muted">Phút<input type="number" min={5} max={600} step={5} className={cx(oNhap, 'mt-1')} value={phut} onChange={(e) => setPhut(Math.min(600, Math.max(5, Number(e.target.value) || 30)))} /></label>
        </div>
        <textarea className={cx(oNhap, 'min-h-[70px]')} placeholder="Ghi chú (không bắt buộc)" value={ghiChu} maxLength={4000} onChange={(e) => setGhiChu(e.target.value)} />
        {gio && <p className="text-[11px] text-text-muted">Có giờ ⇒ lịch tự học tự né khung này, và bạn được nhắc 5 phút trước (app iPhone).</p>}
        {loi && <p className="text-sm text-red-500">{loi}</p>}
        <div className="flex justify-between gap-2">
          {viec ? (
            <Nut kieu="phu" disabled={dang} onClick={async () => {
              setDang(true);
              try { await hocTapApi.xoaCaNhan(viec.id); onXong(); } catch (e) { setLoi(thongBao(e)); } finally { setDang(false); }
            }}><Trash2 size={14} /> Xoá</Nut>
          ) : <span />}
          <Nut disabled={dang} onClick={luu}>{dang ? 'Đang lưu…' : viec ? 'Lưu' : 'Thêm'}</Nut>
        </div>
      </div>
    </HopThoai>
  );
}

function DongCaNhan({ v, homNay, onDoi, onSua }: { v: ViecCaNhan; homNay: string; onDoi: () => void; onSua: (v: ViecCaNhan) => void }) {
  const [dang, setDang] = useState(false);
  return (
    <div className={cx('flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2', v.xong && 'opacity-60')}>
      <button aria-label={v.xong ? 'Bỏ đánh dấu xong' : 'Đánh dấu xong'} disabled={dang}
        onClick={async () => { setDang(true); try { await hocTapApi.xongCaNhan(v.id, !v.xong); onDoi(); } finally { setDang(false); } }}
        className={cx('flex h-5 w-5 shrink-0 items-center justify-center rounded-md border', v.xong ? 'border-teal-500 bg-teal-500 text-white' : 'border-[var(--text-muted)]')}>
        {v.xong && <Check size={13} />}
      </button>
      <button onClick={() => onSua(v)} className="min-w-0 flex-1 text-left">
        <div className={cx('truncate text-sm text-text-primary', v.xong && 'line-through')}>{v.tieuDe}</div>
        <div className="text-[11px] text-text-muted">
          {v.gioBatDau ? gioVN(v.gioBatDau) : 'cả ngày'} · {v.thoiLuongPhut}′ · cá nhân
          {v.ngay < homNay && !v.xong && <span className="ml-1 font-semibold text-red-500">· tồn từ {v.ngay.slice(8, 10)}/{v.ngay.slice(5, 7)}</span>}
        </div>
      </button>
    </div>
  );
}

// ─── Trang ───────────────────────────────────────────────────────

export default function HocTapLich() {
  const [tq, setTq] = useState<TongQuan | null>(null);
  const [caNhan, setCaNhan] = useState<ViecCaNhan[]>([]);
  const [agenda, setAgenda] = useState<AgendaMuc[]>([]);
  const [loi, setLoi] = useState('');
  const [che, setChe] = useState<'ngay' | 'tuan'>('tuan');
  const [ngayChon, setNgayChon] = useState(0);
  const [moViec, setMoViec] = useState<number | null>(null);
  const [suaCN, setSuaCN] = useState<{ mo: boolean; v: ViecCaNhan | null }>({ mo: false, v: null });
  const [themMon, setThemMon] = useState(false);
  const [soan, setSoan] = useState<{ id: number; ma: string } | null>(null);
  const [dangXep, setDangXep] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const homNay = ngayVN(now);
  const tai = useCallback(async () => {
    const hn = ngayVN(Date.now());
    try {
      const [a, b, c] = await Promise.all([
        hocTapApi.tongQuan(),
        hocTapApi.dsCaNhan(hn, congNgay(hn, 6), true),
        hocTapApi.agendaCtWork(hn, congNgay(hn, 6)).then((r) => r.items).catch(() => [] as AgendaMuc[]),
      ]);
      setTq(a); setCaNhan(b); setAgenda(c); setLoi('');
    } catch (e) { setLoi(thongBao(e)); }
  }, []);
  useEffect(() => { void tai(); }, [tai]);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 60_000); return () => clearInterval(t); }, []);

  const lich = useMemo(() => dungLich(tq, caNhan, agenda, homNay), [tq, caNhan, agenda, homNay]);
  const caNhanHomNay = caNhan.filter((v) => v.ngay <= homNay && (!v.xong || v.ngay === homNay));
  const hopHomNay = agenda.filter((m) => m.date === homNay);

  if (!tq) return <Khung nhung><p className="py-20 text-center text-sm text-text-muted">{loi || 'Đang tải…'}</p></Khung>;
  const m = MAU_MUC[tq.ruiRoKy.mucDo];

  return (
    <Khung nhung>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-black text-text-primary">📚 Học tập &amp; Lịch</h1>
          <p className="text-sm text-text-muted">
            {tq.hocKy ? <>{tq.hocKy.ten} · Tuần <b className="text-text-primary">{tq.tuan}</b>/{tq.hocKy.soTuan} · thi tuần {tq.hocKy.tuanThi}</> : 'Chưa có kỳ học'}
            {' · '}Riêng tư — chỉ bạn thấy. CuongMini: <code className="text-xs">/hoc hom-nay</code>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Nut kieu="phu" onClick={() => setSuaCN({ mo: true, v: null })}><Plus size={14} /> Việc cá nhân</Nut>
          {tq.hocKy && <Nut kieu="phu" onClick={() => setThemMon(true)}><Plus size={14} /> Thêm môn</Nut>}
          {tq.hocKy && (
            <Nut kieu="phu" disabled={dangXep} onClick={async () => {
              setDangXep(true);
              try { await hocTapApi.xepLai(); await tai(); } catch (e) { setLoi(thongBao(e)); } finally { setDangXep(false); }
            }}><RefreshCw size={14} className={cx(dangXep && 'animate-spin')} /> Xếp lại lịch học</Nut>
          )}
        </div>
      </div>
      {loi && <p className="mb-3 text-sm text-red-500">{loi}</p>}

      {!tq.hocKy ? (
        <The className="mb-5"><TaoKy onXong={tai} /></The>
      ) : (
        <The className="mb-5" style={{ borderColor: m.vien, background: `linear-gradient(135deg, ${m.nen}, var(--bg-card) 70%)` }}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <DongHoRuiRo tyLe={tq.ruiRoKy.tyLe} mucDo={tq.ruiRoKy.mucDo} nho />
            <div className="flex-1">
              <div className="mb-1 flex justify-between text-xs text-text-muted"><span>Tiến độ kế hoạch cả kỳ (AI đã chấm đạt)</span><b className="text-text-primary">{tq.tienDoKy ?? 0}%</b></div>
              <ThanhTienDo tienDo={tq.tienDoKy ?? 0} kyVong={Math.round(Math.min(1, (tq.tuanQua ?? 0) / tq.hocKy.tuanThi) * 100)} mau={m.chu} />
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-red-500/10 px-2.5 py-1 font-semibold text-red-500">{tq.quaHan.length} việc học quá hạn</span>
                <span className="rounded-full bg-blue-500/10 px-2.5 py-1 font-semibold text-blue-500">{tq.homNay.length} việc học hôm nay</span>
                <span className="rounded-full bg-teal-500/10 px-2.5 py-1 font-semibold text-teal-600">{caNhanHomNay.filter((v) => !v.xong).length} việc cá nhân</span>
                {hopHomNay.length > 0 && <span className="rounded-full bg-purple-500/10 px-2.5 py-1 font-semibold text-purple-600">{hopHomNay.length} mục dự án hôm nay</span>}
              </div>
            </div>
          </div>
        </The>
      )}

      {/* Lịch: hôm nay / tuần */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-xl border border-[var(--border-color)] p-0.5">
          <button onClick={() => setChe('ngay')} className={cx('inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold', che === 'ngay' ? 'bg-neon-violet text-white' : 'text-text-muted')}><CalendarDays size={13} /> Ngày</button>
          <button onClick={() => setChe('tuan')} className={cx('inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold', che === 'tuan' ? 'bg-neon-violet text-white' : 'text-text-muted')}><CalendarRange size={13} /> 7 ngày</button>
        </div>
        {che === 'ngay' && lich.map((n, i) => (
          <button key={n.ngay} onClick={() => setNgayChon(i)} className={cx('rounded-lg px-2 py-1 text-xs', i === ngayChon ? 'bg-neon-violet/15 font-bold text-neon-violet' : 'text-text-muted hover:text-text-primary')}>
            {i === 0 ? 'Hôm nay' : `${TEN_THU[thuCua(n.ngay)]} ${n.ngay.slice(8, 10)}`}
          </button>
        ))}
        <span className="ml-auto flex flex-wrap gap-3 text-[11px] text-text-muted">
          <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-neon-violet" />tự học</span>
          <span><i className="mr-1 inline-block h-2 w-2 rounded-sm border border-dashed border-[var(--text-muted)]" />lên lớp</span>
          <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-teal-500" />cá nhân</span>
          <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-purple-500" />họp dự án</span>
          <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-amber-500" />hạn thẻ</span>
        </span>
      </div>
      <div className="mb-6">
        <LuoiGio ngays={che === 'tuan' ? lich : [lich[ngayChon] ?? lich[0]]} homNay={homNay} now={now}
          onHoc={setMoViec} onCaNhan={(v) => setSuaCN({ mo: true, v })} />
      </div>

      {/* 24/11/2026: Tiến độ & đánh giá — gom CT Work + /hoc-tap + khoá học + Code Lab + Exam Room (GET /hoc-lieu/tien-do). */}
      <TienDoDanhGia />

      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        {/* Môn */}
        <div className="order-2 space-y-3 lg:order-1">
          <h2 className="font-heading text-lg font-bold text-text-primary">Môn học ({tq.mon.length})</h2>
          {tq.hocKy && tq.mon.length === 0 && (
            <The className="text-center">
              <p className="text-sm text-text-muted">Thêm từng môn của kỳ (vd JPD113). AI đọc khoá Academy cùng mã để soạn kế hoạch theo tuần.</p>
              <Nut className="mt-3" onClick={() => setThemMon(true)}><Plus size={14} /> Thêm môn đầu tiên</Nut>
            </The>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {tq.mon.map((mon) => {
              const mm = MAU_MUC[mon.ruiRo.mucDo];
              return (
                <The key={mon.id} className="flex flex-col gap-2" style={{ borderTop: `4px solid ${mon.mau ?? '#6366f1'}` }}>
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/work/hoc-tap/mon/${mon.id}`} className="min-w-0">
                      <div className="font-heading text-lg font-black" style={{ color: mon.mau ?? undefined }}>{mon.maMon}</div>
                      <div className="truncate text-xs text-text-muted">{mon.ten}</div>
                    </Link>
                    <DongHoRuiRo tyLe={mon.ruiRo.tyLe} mucDo={mon.ruiRo.mucDo} nho />
                  </div>
                  <div className="flex justify-between text-[11px] text-text-muted"><span>{mon.datViec}/{mon.tongViec} việc đạt</span><b style={{ color: mm.chu }}>{mon.ruiRo.tienDo}% · cần {mon.ruiRo.kyVong}%</b></div>
                  <ThanhTienDo tienDo={mon.ruiRo.tienDo} kyVong={mon.ruiRo.kyVong} mau={mon.mau ?? '#6366f1'} />
                  {mon.thiSapToi && <div className={cx('text-xs font-semibold', mon.thiSapToi.conNgay <= 7 ? 'text-red-500' : 'text-text-muted')}>📝 Thi {mon.thiSapToi.loai} còn {mon.thiSapToi.conNgay} ngày</div>}
                  {mon.tongViec === 0
                    ? <Nut onClick={() => setSoan({ id: mon.id, ma: mon.maMon })}><Sparkles size={14} /> AI soạn kế hoạch</Nut>
                    : <Link href={`/work/hoc-tap/mon/${mon.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-neon-violet">Việc theo tuần <ChevronRight size={12} /></Link>}
                </The>
              );
            })}
          </div>
        </div>

        {/* Việc hôm nay */}
        <div className="order-1 space-y-4 lg:order-2">
          {tq.quaHan.length > 0 && (
            <section>
              <h2 className="mb-2 font-heading text-base font-bold text-red-500">⚠ Việc học quá hạn ({tq.quaHan.length})</h2>
              <div className="space-y-2">{tq.quaHan.slice(0, 8).map((v) => <DongViec key={v.id} v={v} onMo={setMoViec} />)}</div>
            </section>
          )}
          <section>
            <h2 className="mb-2 font-heading text-base font-bold text-text-primary">📌 Học hôm nay</h2>
            {tq.homNay.length ? <div className="space-y-2">{tq.homNay.map((v) => <DongViec key={v.id} v={v} onMo={setMoViec} />)}</div>
              : <p className="text-sm text-text-muted">{tq.hocKy ? 'Không có việc học nào hôm nay.' : 'Tạo kỳ học + thêm môn để AI lên kế hoạch.'}</p>}
          </section>
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-heading text-base font-bold text-text-primary">✅ Việc cá nhân</h2>
              <button onClick={() => setSuaCN({ mo: true, v: null })} className="inline-flex items-center gap-1 text-xs font-semibold text-neon-violet"><Plus size={12} /> Thêm</button>
            </div>
            {caNhanHomNay.length
              ? <div className="space-y-2">{caNhanHomNay.map((v) => <DongCaNhan key={v.id} v={v} homNay={homNay} onDoi={tai} onSua={(x) => setSuaCN({ mo: true, v: x })} />)}</div>
              : <p className="text-sm text-text-muted">Chưa có việc cá nhân hôm nay.</p>}
          </section>
          {hopHomNay.length > 0 && (
            <section>
              <h2 className="mb-2 font-heading text-base font-bold text-purple-600">👥 Dự án hôm nay</h2>
              <div className="space-y-1.5">
                {hopHomNay.map((x, i) => (
                  <Link key={i} href={x.url ?? '/work'} className="block rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-sm text-text-primary hover:ring-1 hover:ring-neon-violet/40">
                    {x.type === 'meeting' && x.startsAt ? `${gioVN(x.startsAt)} · ` : x.type === 'due' ? `Hạn ${x.key} · ` : ''}{x.title}
                    <span className="ml-1 text-xs text-text-muted">{x.project?.key}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <ChiTietViec viecId={moViec} onDong={() => setMoViec(null)} onDoi={tai} />
      <HopViecCaNhan mo={suaCN.mo} viec={suaCN.v} ngayMacDinh={che === 'ngay' ? (lich[ngayChon]?.ngay ?? homNay) : homNay}
        onDong={() => setSuaCN({ mo: false, v: null })} onXong={() => { setSuaCN({ mo: false, v: null }); void tai(); }} />
      {tq.hocKy && (
        <ThemMon mo={themMon} hocKyId={tq.hocKy.id} onDong={() => setThemMon(false)}
          onXong={(id) => { setThemMon(false); void tai(); setSoan({ id, ma: '' }); }} />
      )}
      <SoanKeHoach monId={soan?.id ?? null} maMon={soan?.ma} onDong={() => setSoan(null)} onXong={tai} />
    </Khung>
  );
}
