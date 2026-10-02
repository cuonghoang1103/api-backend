'use client';
/**
 * 📅 Lịch học — 7 ngày: lớp trên trường + khối tự học đã xếp giờ (backend `xepLich.ts`).
 * Kèm nhắc NGAY TRÊN TRÌNH DUYỆT / APP DESKTOP (Notification API): tới giờ và trễ 15'.
 * iPhone/iPad nhận thông báo đẩy từ máy chủ (cron 5 phút) — chỗ này chỉ là lớp nhắc cho máy tính.
 */
import { useEffect, useMemo, useState } from 'react';
import { Bell, BellOff, RefreshCw, School } from 'lucide-react';
import { hocTapApi, NHAN_LOAI, type NgayLich, type TongQuan, type ViecGon } from '@/lib/hoc-tap-api';
import { Nut, The, cx } from './ui';

const TEN_THU = ['', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const gioVN = (iso: string) => new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Ho_Chi_Minh' });
const ketThuc = (v: ViecGon) => new Date(new Date(v.gioBatDau!).getTime() + v.thoiLuongPhut * 60_000).toISOString();

function trangThaiGio(v: ViecGon, now: number) {
  if (!v.gioBatDau) return 'cho';
  if (v.trangThai === 'DAT') return 'xong';
  if (v.trangThai === 'CHO_CHAM') return 'cham';
  if (v.batDauLuc) return 'dang';
  const bd = new Date(v.gioBatDau).getTime();
  if (now >= bd + 15 * 60_000) return 'tre';
  if (now >= bd) return 'toiGio';
  return 'cho';
}

function docNho(k: string): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(k) || '[]')); } catch { return new Set(); }
}
function ghiNho(k: string, s: Set<string>) {
  try { localStorage.setItem(k, JSON.stringify([...s].slice(-300))); } catch { /* chế độ riêng tư */ }
}

/** Nhắc trên máy tính: gọi lại mỗi lần dữ liệu đổi + mỗi 30 giây. */
function useNhacTrinhDuyet(tq: TongQuan, now: number) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') return;
    const daNhac = docNho('hoc-tap:da-nhac');
    const homNay = tq.lich?.[0]?.viec ?? [];
    const tyLeMon = new Map(tq.mon.map((m) => [m.maMon, m.ruiRo.tyLe]));
    for (const v of homNay) {
      const tt = trangThaiGio(v, now);
      const bd = new Date(v.gioBatDau!).getTime();
      const kToi = `toi:${v.id}:${v.gioBatDau}`;
      const kTre = `tre:${v.id}:${v.gioBatDau}`;
      if ((tt === 'cho' && bd - now <= 5 * 60_000) || tt === 'toiGio') {
        if (!daNhac.has(kToi)) {
          new Notification(`⏰ ${gioVN(v.gioBatDau!)} — ${v.maMon}`, { body: `${v.tieuDe} (${v.thoiLuongPhut} phút). Bấm Bắt đầu.`, tag: kToi });
          daNhac.add(kToi);
        }
      } else if (tt === 'tre' && !daNhac.has(kTre)) {
        new Notification(`🚨 Bỏ lỡ giờ học — ${v.maMon}`, { body: `"${v.tieuDe}" trễ 15'. Tỷ lệ trượt ${v.maMon} đang ${tyLeMon.get(v.maMon) ?? '?'}% và sẽ tăng.`, tag: kTre, requireInteraction: true });
        daNhac.add(kTre);
      }
    }
    ghiNho('hoc-tap:da-nhac', daNhac);
  }, [tq, now]);
}

const GIO_DAU = 6, GIO_CUOI = 24, PX = 46; // 1 giờ = 46px
const phutVN = (iso: string) => { const d = new Date(new Date(iso).getTime() + 7 * 3_600_000); return d.getUTCHours() * 60 + d.getUTCMinutes(); };
const phutChuoi = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

/** Lưới tuần kiểu lịch: cột = ngày, trục dọc = giờ. Cuộn ngang TRONG khung trên điện thoại. */
function LuoiTuan({ lich, now, onMo }: { lich: NgayLich[]; now: number; onMo: (id: number) => void }) {
  const cao = (GIO_CUOI - GIO_DAU) * PX;
  const y = (p: number) => ((p - GIO_DAU * 60) / 60) * PX;
  const phutNay = phutVN(new Date(now).toISOString());
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
      <div className="grid min-w-[760px]" style={{ gridTemplateColumns: `48px repeat(${lich.length}, minmax(0,1fr))` }}>
        <div className="sticky left-0 z-10 bg-[var(--bg-card)]" />
        {lich.map((n, i) => (
          <div key={n.ngay} className={cx('border-b border-l border-[var(--border-color)] px-1 py-1.5 text-center text-xs', i === 0 ? 'bg-neon-violet/10 font-bold text-neon-violet' : 'text-text-muted')}>
            {i === 0 ? 'Hôm nay' : TEN_THU[n.thu]} <span className="opacity-70">{n.ngay.slice(8, 10)}/{n.ngay.slice(5, 7)}</span>
          </div>
        ))}
        {/* trục giờ */}
        <div className="relative sticky left-0 z-10 bg-[var(--bg-card)]" style={{ height: cao }}>
          {Array.from({ length: GIO_CUOI - GIO_DAU }, (_, h) => (
            <div key={h} className="absolute right-1 -translate-y-1/2 text-[10px] tabular-nums text-text-muted" style={{ top: h * PX }}>{String(GIO_DAU + h).padStart(2, '0')}:00</div>
          ))}
        </div>
        {lich.map((n, i) => (
          <div key={n.ngay} className="relative border-l border-[var(--border-color)]" style={{ height: cao, backgroundImage: `repeating-linear-gradient(to bottom, var(--border-color) 0 1px, transparent 1px ${PX}px)`, backgroundSize: `100% ${PX}px` }}>
            {n.lop.map((l) => {
              const a = phutChuoi(l.batDau), b = phutChuoi(l.ketThuc);
              return (
                <div key={`l${l.maMon}${l.batDau}`} className="absolute inset-x-0.5 overflow-hidden rounded-lg border border-dashed border-[var(--text-muted)] bg-[repeating-linear-gradient(45deg,transparent_0_6px,rgba(127,127,127,.12)_6px_12px)] px-1.5 py-1 text-[10px] text-text-muted" style={{ top: y(a), height: Math.max(18, y(b) - y(a)) }}>
                  <div className="font-bold text-text-primary">🏫 {l.maMon}</div>
                  <div>{l.batDau}–{l.ketThuc}{l.phong ? ` · ${l.phong}` : ''}</div>
                </div>
              );
            })}
            {n.viec.map((v) => {
              const a = phutVN(v.gioBatDau!), h = Math.max(20, (v.thoiLuongPhut / 60) * PX - 2);
              const tt = trangThaiGio(v, now);
              return (
                <button key={v.id} onClick={() => onMo(v.id)} title={`${v.maMon} · ${v.tieuDe}`}
                  className={cx('absolute inset-x-0.5 overflow-hidden rounded-lg px-1.5 py-1 text-left text-[10px] leading-tight text-white shadow-sm transition hover:z-20 hover:scale-[1.02]',
                    tt === 'tre' && i === 0 && 'ring-2 ring-red-500 ring-offset-1', v.trangThai === 'DAT' && 'opacity-50')}
                  style={{ top: y(a), height: h, background: v.mau ?? '#6366f1' }}>
                  <div className="font-bold">{v.trangThai === 'DAT' ? '✓ ' : ''}{gioVN(v.gioBatDau!)} {v.maMon}</div>
                  {h > 30 && <div className="line-clamp-3 opacity-95">{v.tieuDe}</div>}
                </button>
              );
            })}
            {i === 0 && phutNay >= GIO_DAU * 60 && (
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

export function LichHoc({ tq, onMo, onDoi }: { tq: TongQuan; onMo: (id: number) => void; onDoi: () => void }) {
  const [ngayChon, setNgayChon] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [quyen, setQuyen] = useState<NotificationPermission | 'khong-ho-tro'>('default');
  const [dangXep, setDangXep] = useState(false);
  const [cheDo, setCheDo] = useState<'tuan' | 'ngay'>('tuan');
  useEffect(() => { if (window.innerWidth < 640) setCheDo('ngay'); }, []);

  useEffect(() => {
    setQuyen(typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'khong-ho-tro');
    const t = setInterval(() => setNow(Date.now()), 30_000);
    // Làm mới dữ liệu mỗi 2 phút để thấy việc vừa bị dời / vừa được chấm.
    const r = setInterval(onDoi, 120_000);
    return () => { clearInterval(t); clearInterval(r); };
  }, [onDoi]);

  useNhacTrinhDuyet(tq, now);

  const lich: NgayLich[] = tq.lich ?? [];
  const ngay = lich[ngayChon];
  const homNay = lich[0]?.viec ?? [];
  const bayGio = homNay.find((v) => ['toiGio', 'dang', 'tre'].includes(trangThaiGio(v, now)));
  const keTiep = homNay.find((v) => trangThaiGio(v, now) === 'cho' && new Date(v.gioBatDau!).getTime() > now);
  const tongPhut = (ngay?.viec ?? []).reduce((s, v) => s + v.thoiLuongPhut, 0);

  // Dòng thời gian gộp: lớp + việc, theo giờ.
  const dong = useMemo(() => {
    if (!ngay) return [];
    const a = ngay.lop.map((l) => ({ k: 'lop' as const, gio: l.batDau, l }));
    const b = ngay.viec.map((v) => ({ k: 'viec' as const, gio: gioVN(v.gioBatDau!), v }));
    return [...a, ...b].sort((x, y) => x.gio.localeCompare(y.gio));
  }, [ngay]);

  if (!lich.length) return null;

  return (
    <The className="mb-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="mr-auto font-heading text-lg font-bold text-text-primary">📅 Lịch học</h2>
        {quyen === 'default' && (
          <Nut kieu="phu" onClick={async () => setQuyen(await Notification.requestPermission())}><Bell size={14} /> Bật nhắc giờ học</Nut>
        )}
        {quyen === 'granted' && <span className="inline-flex items-center gap-1 text-xs text-emerald-500"><Bell size={12} /> Đang nhắc trên máy này</span>}
        {quyen === 'denied' && <span className="inline-flex items-center gap-1 text-xs text-text-muted"><BellOff size={12} /> Trình duyệt đang chặn thông báo</span>}
        <div className="flex rounded-xl bg-[var(--bg-primary)] p-0.5 text-xs font-semibold">
          {(['tuan', 'ngay'] as const).map((k) => (
            <button key={k} onClick={() => setCheDo(k)} className={cx('rounded-lg px-3 py-1.5', cheDo === k ? 'bg-neon-violet text-white' : 'text-text-muted')}>{k === 'tuan' ? 'Tuần' : 'Ngày'}</button>
          ))}
        </div>
        <Nut kieu="phu" disabled={dangXep} onClick={async () => { setDangXep(true); try { await hocTapApi.xepLai(); onDoi(); } finally { setDangXep(false); } }}>
          <RefreshCw size={14} className={dangXep ? 'animate-spin' : ''} /> Xếp lại
        </Nut>
      </div>

      {/* Bây giờ / tiếp theo */}
      {bayGio ? (
        <button onClick={() => onMo(bayGio.id)} className={cx('mb-3 w-full rounded-2xl p-3 text-left', trangThaiGio(bayGio, now) === 'tre' ? 'bg-red-500/15 ring-2 ring-red-500/60' : 'bg-neon-violet/15 ring-2 ring-neon-violet/50')}>
          <div className="text-xs font-black uppercase tracking-wider" style={{ color: trangThaiGio(bayGio, now) === 'tre' ? '#ef4444' : '#8b5cf6' }}>
            {trangThaiGio(bayGio, now) === 'tre' ? '🚨 Đang trễ giờ học' : trangThaiGio(bayGio, now) === 'dang' ? '⏱ Đang học' : '▶ Tới giờ học rồi'}
          </div>
          <div className="mt-0.5 text-sm font-bold text-text-primary">{gioVN(bayGio.gioBatDau!)}–{gioVN(ketThuc(bayGio))} · {bayGio.maMon} · {bayGio.tieuDe}</div>
          {trangThaiGio(bayGio, now) !== 'dang' && <div className="text-xs text-text-muted">Bấm để mở → <b>Bắt đầu</b>. Quá 15 phút chưa bắt đầu = tính là bỏ lỡ (+2% tỷ lệ trượt môn).</div>}
        </button>
      ) : keTiep ? (
        <div className="mb-3 rounded-2xl bg-[var(--bg-primary)] p-3 text-sm text-text-primary">
          Tiếp theo lúc <b>{gioVN(keTiep.gioBatDau!)}</b>: {keTiep.maMon} · {keTiep.tieuDe} ({keTiep.thoiLuongPhut}′)
        </div>
      ) : null}

      {cheDo === 'tuan' ? <LuoiTuan lich={lich} now={now} onMo={onMo} /> : (<>
      {/* Chọn ngày */}
      <div className="mb-3 flex gap-1 overflow-x-auto pb-1">
        {lich.map((n, i) => (
          <button key={n.ngay} onClick={() => setNgayChon(i)}
            className={cx('flex min-w-[56px] flex-col items-center rounded-xl px-2 py-1.5 text-xs', i === ngayChon ? 'bg-neon-violet text-white' : 'bg-[var(--bg-primary)] text-text-muted')}>
            <b>{i === 0 ? 'Hôm nay' : TEN_THU[n.thu]}</b>
            <span>{n.ngay.slice(8, 10)}/{n.ngay.slice(5, 7)}</span>
            <span className="opacity-80">{n.viec.length} việc</span>
          </button>
        ))}
      </div>

      <div className="mb-2 text-xs text-text-muted">{ngay?.lop.length ?? 0} buổi lớp · {ngay?.viec.length ?? 0} khối tự học · ~{Math.round(tongPhut / 6) / 10} giờ</div>
      <div className="space-y-1.5">
        {dong.length === 0 && <p className="text-sm text-text-muted">Ngày trống — nghỉ ngơi hoặc bấm "Xếp lại".</p>}
        {dong.map((d) => d.k === 'lop' ? (
          <div key={`l-${d.l.maMon}-${d.gio}`} className="flex items-center gap-3 rounded-xl border border-dashed border-[var(--border-color)] px-3 py-2 text-sm text-text-muted">
            <span className="w-24 shrink-0 font-mono text-xs">{d.l.batDau}–{d.l.ketThuc}</span>
            <School size={14} /> <b className="text-text-primary">Lên lớp {d.l.maMon}</b>
            <span className="text-xs">{d.l.slot ? `slot ${d.l.slot}` : ''} {d.l.phong ? `· ${d.l.phong}` : ''}</span>
          </div>
        ) : (
          <button key={`v-${d.v.id}`} onClick={() => onMo(d.v.id)}
            className={cx('flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition hover:-translate-y-0.5',
              ngayChon === 0 && trangThaiGio(d.v, now) === 'tre' ? 'bg-red-500/10' : 'bg-[var(--bg-primary)]')}
            style={{ borderLeft: `4px solid ${d.v.mau ?? '#6366f1'}` }}>
            <span className="w-24 shrink-0 font-mono text-xs text-text-muted">{d.gio}–{gioVN(ketThuc(d.v))}</span>
            <span aria-hidden>{NHAN_LOAI[d.v.loai]?.bieuTuong}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-text-primary">{d.v.tieuDe}</span>
              <span className="text-[11px]" style={{ color: d.v.mau ?? undefined }}>{d.v.maMon}{d.v.boLo ? ' · đã từng bỏ lỡ' : ''}</span>
            </span>
            {d.v.trangThai === 'DAT' && <span className="text-xs font-bold text-emerald-500">✓</span>}
          </button>
        ))}
      </div>
      </>)}
    </The>
  );
}
