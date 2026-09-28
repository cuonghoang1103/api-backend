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
 * Vì sao cần đăng nhập cho tab tốc độ: endpoint đo tốc độ bơm băng thông thật
 * của VPS nên backend bắt auth. Tab thiết bị thì KHÔNG cần mạng/đăng nhập —
 * nó đọc mạng nội bộ.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Wifi, RadioTower, Router, Laptop, Gauge, RefreshCw, Copy, Check,
  ShieldQuestion, Play, Square, Download, Upload, Activity,
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
    <div className="ct-page">
      <div className="ct-panel">
        <div className="ct-page-head">
          <div>
            <h1>{dich('Mạng nhà')}</h1>
            <p className="ct-muted" style={{ margin: 0 }}>
              {dich('Xem ai đang dùng chung mạng và đo tốc độ đường truyền.')}
            </p>
          </div>
        </div>

        <div className="ct-tabs" role="tablist" style={{ marginBottom: 16 }}>
          <button type="button" role="tab" aria-selected={tab === 'thietBi'}
            className="ct-tab" data-active={tab === 'thietBi'} onClick={() => setTab('thietBi')}>
            <RadioTower size={16} aria-hidden /> {dich('Thiết bị trong mạng')}
          </button>
          <button type="button" role="tab" aria-selected={tab === 'tocDo'}
            className="ct-tab" data-active={tab === 'tocDo'} onClick={() => setTab('tocDo')}>
            <Gauge size={16} aria-hidden /> {dich('Tốc độ mạng')}
          </button>
        </div>

        {!hasBridge && tab === 'thietBi' ? (
          <div className="ct-notice" data-tone="warn">
            {dich('Quét thiết bị chỉ chạy được trong ứng dụng máy tính, không chạy trên trình duyệt.')}
          </div>
        ) : tab === 'thietBi' ? <TabThietBi /> : <TabTocDo />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 1 — Thiết bị trong mạng
// ─────────────────────────────────────────────────────────────

function TabThietBi() {
  const { dich } = useDich();
  const [thongTin, setThongTin] = useState<ThongTinMangBridge | null>(null);
  const [dsThietBi, setDsThietBi] = useState<ThietBiMangBridge[]>([]);
  const [dangQuet, setDangQuet] = useState(false);
  const [tienDo, setTienDo] = useState<{ da: number; tong: number } | null>(null);
  const [daChon, setDaChon] = useState<Set<string>>(new Set()); // MAC "máy của tôi"
  const [daChep, setDaChep] = useState(false);

  const mangNha = window.cuongthai?.mangNha;

  useEffect(() => {
    void mangNha?.thongTin().then(setThongTin);
  }, [mangNha]);

  // Lắng nghe sự kiện quét. Đăng ký MỘT lần; gỡ khi rời trang.
  useEffect(() => {
    const on = window.cuongthai?.on;
    if (!on) return undefined;
    const boThietBi = on('mangNha:thietBi', (p) => {
      const tb = p as ThietBiMangBridge;
      setDsThietBi((cu) => (cu.some((x) => x.ip === tb.ip) ? cu : [...cu, tb]));
    });
    const boTienDo = on('mangNha:tienDo', (p) => setTienDo(p as { da: number; tong: number }));
    const boXong = on('mangNha:xong', () => { setDangQuet(false); setTienDo(null); });
    return () => { boThietBi(); boTienDo(); boXong(); };
  }, []);

  const quet = useCallback(async () => {
    if (!mangNha) return;
    setDsThietBi([]);
    setTienDo({ da: 0, tong: 254 });
    setDangQuet(true);
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

  // "Máy lạ" = không phải máy mình, không phải router, và người dùng chưa đánh
  // dấu là của mình.
  const soLa = dsThietBi.filter((t) => !t.laMinh && !t.laRouter && !daChon.has(t.mac)).length;

  const chepMacLa = useCallback(async () => {
    const dsMac = dsThietBi
      .filter((t) => !t.laMinh && !t.laRouter && !daChon.has(t.mac))
      .map((t) => `${t.ip}\t${t.mac}\t${t.hang}`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(dsMac);
      setDaChep(true);
      setTimeout(() => setDaChep(false), 1500);
    } catch { /* clipboard bị chặn — bỏ qua */ }
  }, [dsThietBi, daChon]);

  const sapXep = [...dsThietBi].sort((a, b) => {
    // Máy mình lên đầu, rồi router, rồi theo IP số.
    const uu = (t: ThietBiMangBridge) => (t.laMinh ? 0 : t.laRouter ? 1 : 2);
    if (uu(a) !== uu(b)) return uu(a) - uu(b);
    return soIp(a.ip) - soIp(b.ip);
  });

  return (
    <div>
      <div className="ct-actions" style={{ marginBottom: 12, alignItems: 'center', gap: 12 }}>
        {dangQuet ? (
          <button type="button" className="ct-btn ct-btn-ghost" onClick={dung}>
            <Square size={16} aria-hidden /> {dich('Dừng quét')}
          </button>
        ) : (
          <button type="button" className="ct-btn" onClick={() => void quet()}>
            <RefreshCw size={16} aria-hidden /> {dich('Quét mạng')}
          </button>
        )}
        {thongTin?.dai && (
          <span className="ct-muted">{dich('Dải mạng')}: {thongTin.dai}.0/24</span>
        )}
        {dsThietBi.length > 0 && (
          <span className="ct-muted">
            {dich('Tìm thấy')} {dsThietBi.length} · {dich('lạ')} {soLa}
          </span>
        )}
      </div>

      {tienDo && (
        <div className="ct-progress" aria-label={dich('Tiến độ quét')} style={{ marginBottom: 12 }}>
          <div className="ct-progress-bar" style={{ width: `${Math.round((tienDo.da / tienDo.tong) * 100)}%` }} />
        </div>
      )}

      {dsThietBi.length === 0 && !dangQuet ? (
        <div className="ct-empty">
          <Wifi size={28} aria-hidden className="ct-empty-icon" />
          <p>{dich('Bấm "Quét mạng" để xem những thiết bị đang kết nối cùng bạn.')}</p>
        </div>
      ) : (
        <>
          <div className="ct-mang-list">
            {sapXep.map((t) => (
              <ThietBiHang key={t.ip} tb={t} laCuaToi={daChon.has(t.mac)} doiChon={() => doiChon(t.mac)} />
            ))}
          </div>

          {soLa > 0 && !dangQuet && (
            <div className="ct-notice" data-tone="warn" style={{ marginTop: 16 }}>
              <p style={{ margin: '0 0 8px' }}>
                {dich('Có {n} thiết bị lạ. Đánh dấu máy của bạn để lọc chúng ra, rồi gửi danh sách còn lại cho nhà mạng để chặn.').replace('{n}', String(soLa))}
              </p>
              <button type="button" className="ct-btn" onClick={() => void chepMacLa()}>
                {daChep ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                {daChep ? dich('Đã chép') : dich('Chép danh sách máy lạ')}
              </button>
            </div>
          )}
        </>
      )}

      <p className="ct-muted" style={{ marginTop: 16, fontSize: 13, lineHeight: 1.6 }}>
        {dich('Không đuổi được máy lạ khỏi WiFi từ đây: lệnh chặn phải đặt ở router. Cách chắc chắn nhất là gọi nhà mạng đổi mật khẩu WiFi.')}
      </p>
    </div>
  );
}

function ThietBiHang({ tb, laCuaToi, doiChon }: {
  tb: ThietBiMangBridge; laCuaToi: boolean; doiChon: () => void;
}) {
  const { dich } = useDich();
  const Icon = tb.laRouter ? Router : tb.laMinh ? Laptop : ShieldQuestion;
  const nhan = tb.laMinh ? dich('Máy này') : tb.laRouter ? dich('Router (cổng mạng)') : null;
  return (
    <div className="ct-mang-hang" data-loai={tb.laMinh ? 'minh' : tb.laRouter ? 'router' : 'khac'}>
      <Icon size={20} aria-hidden className="ct-mang-icon" />
      <div className="ct-mang-info">
        <div className="ct-mang-ten">
          {tb.ten ?? tb.hang}
          {nhan && <span className="ct-tag">{nhan}</span>}
          {tb.macAn && <span className="ct-tag" data-tone="muted">{dich('MAC ẩn')}</span>}
        </div>
        <div className="ct-mang-phu">
          {tb.ip} · {tb.mac} · {tb.hang}
        </div>
      </div>
      {!tb.laMinh && !tb.laRouter && (
        <label className="ct-mang-check" title={dich('Đây là máy của tôi')}>
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

  const chay = useCallback(async () => {
    if (!api) { setLoi(dich('Cần đăng nhập để đo tốc độ.')); return; }
    const ac = new AbortController();
    huyRef.current = ac;
    const opts = { base: api.baseUrlForForms(), token: api.getToken(), signal: ac.signal };
    setLoi(null);
    setTaiXuong(null); setTaiLen(null); setPing(null); setJitter(null);
    setMbpsSong(0);
    try {
      setGiaiDoan('ping');
      const p = await doPing(opts);
      setPing(p.pingMs); setJitter(p.jitterMs);

      setGiaiDoan('taiXuong');
      setMbpsSong(0);
      const dx = await doTaiXuong(opts, (m: MauTocDo) => setMbpsSong(m.mbps));
      setTaiXuong(dx);

      setGiaiDoan('taiLen');
      setMbpsSong(0);
      const ln = await doTaiLen(opts, (m: MauTocDo) => setMbpsSong(m.mbps));
      setTaiLen(ln);

      setGiaiDoan('xong');
    } catch (e) {
      if (!ac.signal.aborted) setLoi(e instanceof Error ? e.message : String(e));
      setGiaiDoan('san-sang');
    }
  }, [api, dich]);

  const dung = useCallback(() => {
    huyRef.current?.abort();
    setGiaiDoan('san-sang');
  }, []);

  useEffect(() => () => huyRef.current?.abort(), []);

  const nhanGiaiDoan =
    giaiDoan === 'ping' ? dich('Đang đo độ trễ…')
    : giaiDoan === 'taiXuong' ? dich('Đang đo tải xuống…')
    : giaiDoan === 'taiLen' ? dich('Đang đo tải lên…')
    : giaiDoan === 'xong' ? dich('Xong')
    : dich('Sẵn sàng');

  return (
    <div>
      <div className="ct-tocdo-dong-ho">
        <div className="ct-tocdo-so">
          {dangChay && (giaiDoan === 'taiXuong' || giaiDoan === 'taiLen')
            ? mbpsSong.toFixed(1)
            : (taiXuong !== null ? taiXuong.toFixed(1) : '0.0')}
          <span className="ct-tocdo-dv">Mbps</span>
        </div>
        <div className="ct-muted">{nhanGiaiDoan}</div>
      </div>

      <div className="ct-tocdo-luoi">
        <ChiSo icon={<Download size={18} />} nhan={dich('Tải xuống')} gt={taiXuong} dv="Mbps"
          dangDo={giaiDoan === 'taiXuong'} song={mbpsSong} />
        <ChiSo icon={<Upload size={18} />} nhan={dich('Tải lên')} gt={taiLen} dv="Mbps"
          dangDo={giaiDoan === 'taiLen'} song={mbpsSong} />
        <ChiSo icon={<Activity size={18} />} nhan={dich('Độ trễ')} gt={ping} dv="ms" />
        <ChiSo icon={<Activity size={18} />} nhan={dich('Độ rung')} gt={jitter} dv="ms" />
      </div>

      {loi && <div className="ct-notice" data-tone="err" style={{ marginTop: 12 }}>{loi}</div>}

      <div className="ct-actions" style={{ marginTop: 16 }}>
        {dangChay ? (
          <button type="button" className="ct-btn ct-btn-ghost" onClick={dung}>
            <Square size={16} aria-hidden /> {dich('Dừng')}
          </button>
        ) : (
          <button type="button" className="ct-btn" onClick={() => void chay()}>
            <Play size={16} aria-hidden /> {dich('Bắt đầu đo')}
          </button>
        )}
      </div>

      <p className="ct-muted" style={{ marginTop: 16, fontSize: 13, lineHeight: 1.6 }}>
        {dich('Đo tốc độ giữa máy bạn và máy chủ cuongthai.com — đủ để biết mạng đang khoẻ hay yếu, nhưng không thay cho công cụ đo tới máy chủ quốc tế.')}
      </p>
    </div>
  );
}

function ChiSo({ icon, nhan, gt, dv, dangDo, song }: {
  icon: React.ReactNode; nhan: string; gt: number | null; dv: string;
  dangDo?: boolean; song?: number;
}) {
  const hien = dangDo && song !== undefined ? song : gt;
  return (
    <div className="ct-tocdo-o" data-dang={dangDo ? 'do' : undefined}>
      <div className="ct-tocdo-o-dau">{icon} {nhan}</div>
      <div className="ct-tocdo-o-gt">
        {hien !== null && hien !== undefined ? hien.toFixed(dv === 'ms' ? 0 : 1) : '—'}
        <span className="ct-tocdo-o-dv"> {dv}</span>
      </div>
    </div>
  );
}
