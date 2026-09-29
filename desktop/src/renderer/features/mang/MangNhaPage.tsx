/**
 * Trang "Mạng nhà" — CHỈ có trong app desktop.
 *
 * Hai việc, hai tab:
 *  1. Thiết bị trong mạng — quét LAN, liệt kê mọi máy đang kết nối cùng WiFi
 *     (IP, MAC, hãng, tên). Chạy ở tiến trình chính qua `window.cuongthai.mangNha`;
 *     TRÌNH DUYỆT KHÔNG LÀM ĐƯỢC việc này nên web không có tab này.
 *  2. Tốc độ mạng — đo download/upload/ping/jitter tới máy chủ cuongthai.com.
 *     Dùng chung engine `tocDo.ts` với bản web.
 *
 * Vì sao tab tốc độ cần đăng nhập: endpoint đo bơm băng thông thật của VPS nên
 * backend bắt auth. Tab thiết bị thì KHÔNG cần mạng/đăng nhập — đọc mạng nội bộ.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Wifi, RadioTower, Router, Laptop, Smartphone, Tv, Printer, HardDrive, HelpCircle,
  Gauge, RefreshCw, Copy, Check, Play, Square, Download, Upload, Activity, ArrowDownUp,
} from 'lucide-react';
import { useDich } from '../../i18n';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import type { ThietBiMangBridge, ThongTinMangBridge } from '../../../shared/ipc';
import { doTaiXuong, doTaiLen, doPing, type MauTocDo } from './tocDo';

type Tab = 'thietBi' | 'tocDo';

export function MangNhaPage() {
  const { dich } = useDich();
  const { hasBridge } = useAppState();
  const [tab, setTab] = useState<Tab>('thietBi');

  return (
    <div className="ct-mang-page">
      <header className="ct-mang-head">
        <div className="ct-mang-head-icon"><Wifi size={22} aria-hidden /></div>
        <div>
          <h1>{dich('Mạng nhà')}</h1>
          <p>{dich('Xem ai đang dùng chung mạng và đo tốc độ đường truyền.')}</p>
        </div>
      </header>

      <div className="ct-seg" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'thietBi'}
          className="ct-seg-nut" data-active={tab === 'thietBi'} onClick={() => setTab('thietBi')}>
          <RadioTower size={16} aria-hidden /> {dich('Thiết bị trong mạng')}
        </button>
        <button type="button" role="tab" aria-selected={tab === 'tocDo'}
          className="ct-seg-nut" data-active={tab === 'tocDo'} onClick={() => setTab('tocDo')}>
          <Gauge size={16} aria-hidden /> {dich('Tốc độ mạng')}
        </button>
      </div>

      {!hasBridge && tab === 'thietBi' ? (
        <div className="ct-mang-card ct-mang-warn">
          {dich('Quét thiết bị chỉ chạy được trong ứng dụng máy tính, không chạy trên trình duyệt.')}
        </div>
      ) : tab === 'thietBi' ? <TabThietBi /> : <TabTocDo />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 1 — Thiết bị trong mạng
// ─────────────────────────────────────────────────────────────

/** Đoán loại thiết bị (để chọn biểu tượng) từ hãng + tên. */
function loaiThietBi(tb: ThietBiMangBridge): 'router' | 'minh' | 'dienthoai' | 'tv' | 'may-in' | 'nas' | 'may' {
  if (tb.laRouter) return 'router';
  if (tb.laMinh) return 'minh';
  const s = `${tb.hang} ${tb.ten ?? ''}`.toLowerCase();
  if (/iphone|android|galaxy|xiaomi|oppo|vivo|redmi|pixel|phone/.test(s)) return 'dienthoai';
  if (/\btv\b|tivi|bravia|\blg\b|roku|chromecast|firetv|smart-?tv/.test(s)) return 'tv';
  if (/printer|brother|epson|canon|hp\b|in\b/.test(s)) return 'may-in';
  if (/nas|synology|qnap|storage/.test(s)) return 'nas';
  return 'may';
}

const BIEU_TUONG = {
  router: Router, minh: Laptop, dienthoai: Smartphone, tv: Tv,
  'may-in': Printer, nas: HardDrive, may: HelpCircle,
} as const;

function TabThietBi() {
  const { dich } = useDich();
  const [thongTin, setThongTin] = useState<ThongTinMangBridge | null>(null);
  const [dsThietBi, setDsThietBi] = useState<ThietBiMangBridge[]>([]);
  const [dangQuet, setDangQuet] = useState(false);
  const [tienDo, setTienDo] = useState<{ da: number; tong: number } | null>(null);
  const [daChon, setDaChon] = useState<Set<string>>(new Set()); // MAC "máy của tôi"
  const [daChep, setDaChep] = useState(false);
  const [daQuetLan, setDaQuetLan] = useState(false);
  const [loiQuet, setLoiQuet] = useState<string | null>(null);

  const mangNha = window.cuongthai?.mangNha;

  useEffect(() => { void mangNha?.thongTin().then(setThongTin); }, [mangNha]);

  useEffect(() => {
    const on = window.cuongthai?.on;
    if (!on) return undefined;
    const boThietBi = on('mangNha:thietBi', (p) => {
      const tb = p as ThietBiMangBridge;
      setDsThietBi((cu) => (cu.some((x) => x.ip === tb.ip) ? cu : [...cu, tb]));
    });
    const boTienDo = on('mangNha:tienDo', (p) => setTienDo(p as { da: number; tong: number }));
    const boXong = on('mangNha:xong', (p) => {
      setDangQuet(false); setTienDo(null);
      const loi = (p as { loi?: string })?.loi;
      if (loi) setLoiQuet(loi);
    });
    return () => { boThietBi(); boTienDo(); boXong(); };
  }, []);

  const quet = useCallback(async () => {
    if (!mangNha) return;
    setDsThietBi([]);
    setTienDo({ da: 0, tong: 254 });
    setDangQuet(true);
    setDaQuetLan(true);
    setLoiQuet(null);
    const kq = await mangNha.quet();
    if (!kq.dangChay) { setDangQuet(false); setTienDo(null); }
  }, [mangNha]);

  const dung = useCallback(() => { void mangNha?.dung(); }, [mangNha]);

  const doiChon = useCallback((mac: string) => {
    setDaChon((cu) => {
      const moi = new Set(cu);
      if (moi.has(mac)) moi.delete(mac); else moi.add(mac);
      return moi;
    });
  }, []);

  const laLa = (t: ThietBiMangBridge) => !t.laMinh && !t.laRouter && !daChon.has(t.mac);
  const soLa = dsThietBi.filter(laLa).length;

  const chepMacLa = useCallback(async () => {
    const dsMac = dsThietBi.filter(laLa).map((t) => `${t.ip}\t${t.mac}\t${t.hang}`).join('\n');
    try {
      await navigator.clipboard.writeText(dsMac);
      setDaChep(true);
      setTimeout(() => setDaChep(false), 1500);
    } catch { /* clipboard bị chặn */ }
  }, [dsThietBi, daChon]);

  const sapXep = [...dsThietBi].sort((a, b) => {
    const uu = (t: ThietBiMangBridge) => (t.laMinh ? 0 : t.laRouter ? 1 : 2);
    if (uu(a) !== uu(b)) return uu(a) - uu(b);
    return soIp(a.ip) - soIp(b.ip);
  });

  const pct = tienDo ? Math.round((tienDo.da / tienDo.tong) * 100) : 0;

  return (
    <div className="ct-mang-body">
      {/* Thanh công cụ */}
      <div className="ct-mang-toolbar">
        {dangQuet ? (
          <button type="button" className="ct-mang-btn ghost" onClick={dung}>
            <Square size={16} aria-hidden /> {dich('Dừng quét')}
          </button>
        ) : (
          <button type="button" className="ct-mang-btn" onClick={() => void quet()}>
            <RefreshCw size={16} aria-hidden /> {dich('Quét mạng')}
          </button>
        )}
        <div className="ct-mang-chips">
          {thongTin?.dai && (
            <span className="ct-mang-chip"><Wifi size={13} aria-hidden /> {thongTin.dai}.0/24</span>
          )}
          {dsThietBi.length > 0 && (
            <span className="ct-mang-chip">{dich('Tìm thấy')}: {dsThietBi.length}</span>
          )}
          {soLa > 0 && (
            <span className="ct-mang-chip warn">{dich('Máy lạ')}: {soLa}</span>
          )}
        </div>
      </div>

      {dangQuet && (
        <div className="ct-mang-quet" aria-label={dich('Tiến độ quét')}>
          <div className="ct-mang-quet-bar" style={{ width: `${pct}%` }} />
          <span className="ct-mang-quet-nhan">{dich('Đang quét…')} {pct}%</span>
        </div>
      )}

      {/* Trạng thái rỗng / danh sách */}
      {!daQuetLan && dsThietBi.length === 0 ? (
        <div className="ct-mang-empty">
          <RadioTower size={30} aria-hidden />
          <p>{dich('Bấm "Quét mạng" để xem những thiết bị đang kết nối cùng bạn.')}</p>
        </div>
      ) : dsThietBi.length === 0 && dangQuet ? (
        <div className="ct-mang-empty"><p>{dich('Đang tìm thiết bị…')}</p></div>
      ) : (
        <div className="ct-mang-grid">
          {sapXep.map((t) => (
            <ThietBiThe key={t.ip} tb={t} laCuaToi={daChon.has(t.mac)} doiChon={() => doiChon(t.mac)} />
          ))}
        </div>
      )}

      {soLa > 0 && !dangQuet && (
        <div className="ct-mang-card ct-mang-warn ct-mang-lienke">
          <div>
            <strong>{dich('Có {n} thiết bị lạ').replace('{n}', String(soLa))}</strong>
            <p>{dich('Đánh dấu máy của bạn để lọc chúng ra, rồi gửi danh sách còn lại cho nhà mạng để chặn.')}</p>
          </div>
          <button type="button" className="ct-mang-btn ghost" onClick={() => void chepMacLa()}>
            {daChep ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
            {daChep ? dich('Đã chép') : dich('Chép danh sách máy lạ')}
          </button>
        </div>
      )}

      {loiQuet && <div className="ct-mang-card ct-mang-err">{dich('Quét mạng gặp lỗi:')} {loiQuet}</div>}

      <p className="ct-mang-ghichu">
        {dich('Không đuổi được máy lạ khỏi WiFi từ đây: lệnh chặn phải đặt ở router. Cách chắc chắn nhất là gọi nhà mạng đổi mật khẩu WiFi.')}
      </p>
    </div>
  );
}

function ThietBiThe({ tb, laCuaToi, doiChon }: {
  tb: ThietBiMangBridge; laCuaToi: boolean; doiChon: () => void;
}) {
  const { dich } = useDich();
  const loai = loaiThietBi(tb);
  const Icon = BIEU_TUONG[loai];
  const nhan = tb.laMinh ? dich('Máy này') : tb.laRouter ? dich('Router (cổng mạng)') : null;
  return (
    <div className="ct-tb" data-loai={tb.laMinh ? 'minh' : tb.laRouter ? 'router' : laCuaToi ? 'cua-toi' : 'khac'}>
      <div className="ct-tb-icon"><Icon size={22} aria-hidden /></div>
      <div className="ct-tb-info">
        <div className="ct-tb-ten">
          <span className="ct-tb-ten-chinh">{tb.ten ?? tb.hang}</span>
          {nhan && <span className="ct-tb-tag hl">{nhan}</span>}
          {tb.macAn && <span className="ct-tb-tag">{dich('MAC ẩn')}</span>}
        </div>
        <div className="ct-tb-phu">
          <span className="ct-tb-ip">{tb.ip}</span>
          <span className="ct-tb-mac">{tb.mac}</span>
          {tb.ten && tb.hang !== '—' && <span>{tb.hang}</span>}
        </div>
      </div>
      {!tb.laMinh && !tb.laRouter && (
        <label className="ct-tb-check" title={dich('Đây là máy của tôi')}>
          <input type="checkbox" checked={laCuaToi} onChange={doiChon} />
          <span>{dich('Máy của tôi')}</span>
        </label>
      )}
    </div>
  );
}

function soIp(ip: string): number {
  return ip.split('.').reduce((n, o) => n * 256 + Number(o), 0);
}

// ─────────────────────────────────────────────────────────────
// TAB 2 — Tốc độ mạng
// ─────────────────────────────────────────────────────────────

type GiaiDoan = 'san-sang' | 'ping' | 'taiXuong' | 'taiLen' | 'xong';

/** Quy tốc độ về góc kim đồng hồ 0..270°, thang log để cả 5 và 500 Mbps đều đọc được. */
function gocKim(mbps: number): number {
  if (mbps <= 0) return 0;
  const t = Math.min(1, Math.log10(mbps + 1) / Math.log10(1001)); // 0..1 cho 0..1000 Mbps
  return t * 270;
}

interface DanhGia { muc: string; tone: 'tot' | 'kha' | 'yeu'; khuyen: string; }

/** Đánh giá mạng theo tốc độ tải xuống (chính) + độ trễ. Câu chữ cho người thường đọc. */
function danhGiaMang(dl: number | null, ping: number | null): DanhGia | null {
  if (dl === null) return null;
  const treCao = ping !== null && ping > 120;
  if (dl >= 100) return { muc: 'Rất tốt', tone: 'tot', khuyen: 'Thoải mái xem 4K, họp video nhóm, tải game — nhiều máy cùng lúc vẫn mượt.' };
  if (dl >= 50) return { muc: 'Tốt', tone: 'tot', khuyen: 'Xem 4K, họp video, tải file lớn đều ổn.' };
  if (dl >= 25) return { muc: 'Khá', tone: 'kha', khuyen: 'Xem Full HD và họp video tốt; tải nặng nhiều máy cùng lúc có thể chậm.' };
  if (dl >= 10) return { muc: 'Trung bình', tone: 'kha', khuyen: treCao ? 'Đủ xem HD, nhưng độ trễ cao — gọi video/chơi game dễ giật.' : 'Đủ lướt web, xem HD, họp video cơ bản.' };
  if (dl >= 3) return { muc: 'Yếu', tone: 'yeu', khuyen: 'Chỉ hợp lướt web và nhắn tin; video HD dễ giật. Kiểm xem có ai đang tải nặng không.' };
  return { muc: 'Rất yếu', tone: 'yeu', khuyen: 'Khó xem video mượt. Thử khởi động lại router, hoặc gọi nhà mạng nếu kéo dài.' };
}

function TabTocDo() {
  const { dich } = useDich();
  const { api } = useSession();
  const [giaiDoan, setGiaiDoan] = useState<GiaiDoan>('san-sang');
  const [mbpsSong, setMbpsSong] = useState(0);
  const [taiXuong, setTaiXuong] = useState<number | null>(null);
  const [taiLen, setTaiLen] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const huyRef = useRef<AbortController | null>(null);

  const dangChay = giaiDoan !== 'san-sang' && giaiDoan !== 'xong';
  const dangDoLuong = giaiDoan === 'taiXuong' || giaiDoan === 'taiLen';

  const chay = useCallback(async () => {
    if (!api) { setLoi(dich('Cần đăng nhập để đo tốc độ.')); return; }
    const ac = new AbortController();
    huyRef.current = ac;
    const opts = { base: api.baseUrlForForms(), token: api.getToken(), signal: ac.signal };
    setLoi(null);
    setTaiXuong(null); setTaiLen(null); setPing(null); setJitter(null); setMbpsSong(0);
    try {
      setGiaiDoan('ping');
      const p = await doPing(opts);
      setPing(p.pingMs); setJitter(p.jitterMs);
      setGiaiDoan('taiXuong'); setMbpsSong(0);
      const dx = await doTaiXuong(opts, (m: MauTocDo) => setMbpsSong(m.mbps));
      setTaiXuong(dx);
      setGiaiDoan('taiLen'); setMbpsSong(0);
      const ln = await doTaiLen(opts, (m: MauTocDo) => setMbpsSong(m.mbps));
      setTaiLen(ln);
      setGiaiDoan('xong');
    } catch (e) {
      if (!ac.signal.aborted) setLoi(e instanceof Error ? e.message : String(e));
      setGiaiDoan('san-sang');
    }
  }, [api, dich]);

  const dung = useCallback(() => { huyRef.current?.abort(); setGiaiDoan('san-sang'); }, []);
  useEffect(() => () => huyRef.current?.abort(), []);

  const nhanGiaiDoan =
    giaiDoan === 'ping' ? dich('Đang đo độ trễ…')
    : giaiDoan === 'taiXuong' ? dich('Đang đo tải xuống…')
    : giaiDoan === 'taiLen' ? dich('Đang đo tải lên…')
    : giaiDoan === 'xong' ? dich('Hoàn tất') : dich('Sẵn sàng đo');

  const soHienThi = dangDoLuong ? mbpsSong : (taiXuong ?? 0);
  const goc = gocKim(dangDoLuong ? mbpsSong : (taiXuong ?? 0));

  // Cung tròn: bán kính 80, tâm (100,100), quét 270° bắt đầu từ -225°.
  const R = 80;
  const CHU_VI = 2 * Math.PI * R;
  const cungNen = (270 / 360) * CHU_VI;
  const cungChay = (goc / 360) * CHU_VI;

  return (
    <div className="ct-mang-body ct-tocdo">
      <div className="ct-tocdo-gauge">
        <svg viewBox="0 0 200 200" className="ct-gauge-svg" aria-hidden>
          <defs>
            <linearGradient id="ctGradDl" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r={R} className="ct-gauge-nen"
            strokeDasharray={`${cungNen} ${CHU_VI}`} transform="rotate(135 100 100)" />
          <circle cx="100" cy="100" r={R} className="ct-gauge-chay" data-gd={giaiDoan}
            strokeDasharray={`${cungChay} ${CHU_VI}`} transform="rotate(135 100 100)" />
        </svg>
        <div className="ct-gauge-tam">
          <div className="ct-gauge-so">{soHienThi.toFixed(soHienThi >= 100 ? 0 : 1)}</div>
          <div className="ct-gauge-dv">Mbps</div>
          <div className="ct-gauge-nhan" data-chay={dangChay ? '1' : undefined}>
            {dangDoLuong && (giaiDoan === 'taiXuong'
              ? <Download size={13} aria-hidden />
              : <Upload size={13} aria-hidden />)}
            {nhanGiaiDoan}
          </div>
        </div>
      </div>

      <div className="ct-tocdo-ket">
        <KetO icon={<Download size={17} />} nhan={dich('Tải xuống')} gt={giaiDoan === 'taiXuong' ? mbpsSong : taiXuong} dv="Mbps" dangDo={giaiDoan === 'taiXuong'} />
        <KetO icon={<Upload size={17} />} nhan={dich('Tải lên')} gt={giaiDoan === 'taiLen' ? mbpsSong : taiLen} dv="Mbps" dangDo={giaiDoan === 'taiLen'} />
        <KetO icon={<Activity size={17} />} nhan={dich('Độ trễ')} gt={ping} dv="ms" dangDo={giaiDoan === 'ping'} />
        <KetO icon={<ArrowDownUp size={17} />} nhan={dich('Độ rung')} gt={jitter} dv="ms" />
      </div>

      {giaiDoan === 'xong' && (() => {
        const dg = danhGiaMang(taiXuong, ping);
        return dg ? (
          <div className="ct-danhgia" data-tone={dg.tone}>
            <div className="ct-danhgia-muc">{dich('Mạng của bạn')}: <strong>{dich(dg.muc)}</strong></div>
            <div className="ct-danhgia-khuyen">{dich(dg.khuyen)}</div>
          </div>
        ) : null;
      })()}

      {loi && <div className="ct-mang-card ct-mang-err">{loi}</div>}

      <div className="ct-tocdo-nut">
        {dangChay ? (
          <button type="button" className="ct-mang-btn ghost lon" onClick={dung}>
            <Square size={17} aria-hidden /> {dich('Dừng')}
          </button>
        ) : (
          <button type="button" className="ct-mang-btn lon" onClick={() => void chay()}>
            <Play size={17} aria-hidden /> {giaiDoan === 'xong' ? dich('Đo lại') : dich('Bắt đầu đo')}
          </button>
        )}
      </div>

      <p className="ct-mang-ghichu">
        {dich('Đo tốc độ giữa máy bạn và máy chủ cuongthai.com — đủ để biết mạng đang khoẻ hay yếu, nhưng không thay cho công cụ đo tới máy chủ quốc tế.')}
      </p>
    </div>
  );
}

function KetO({ icon, nhan, gt, dv, dangDo }: {
  icon: React.ReactNode; nhan: string; gt: number | null; dv: string; dangDo?: boolean;
}) {
  const hien = gt;
  return (
    <div className="ct-keto" data-dang={dangDo ? 'do' : undefined}>
      <div className="ct-keto-dau">{icon}<span>{nhan}</span></div>
      <div className="ct-keto-gt">
        {hien !== null && hien !== undefined ? hien.toFixed(dv === 'ms' ? 0 : 1) : '—'}
        <span className="ct-keto-dv">{dv}</span>
      </div>
    </div>
  );
}
