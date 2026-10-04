'use client';

/**
 * Khu vườn CuongMini — game THƯ GIÃN sau giờ học.
 *
 * Một "ngày" dài 3 phút trên hòn đảo cỏ isometric 16 luống: bầu trời chuyển từ bình
 * minh sang trưa rồi hoàng hôn, mặt trời đi theo vòng cung, mây trôi, bướm bay.
 * Người chơi gieo hạt (tốn xu), TƯỚI (cây khô thì ngừng lớn), BẮT SÂU (sâu bám thì
 * cây cũng ngừng), và THU HOẠCH khi cây chín. 5% cây ra quả vàng, giá gấp đôi.
 *
 * Điểm = tổng xu THU HOẠCH được trong ngày (không trừ tiền hạt — gieo nhiều không bị
 * phạt, chỉ là phải chăm kịp). Hết ngày báo điểm một lần.
 *
 * Mọi hình là SVG vẽ tại chỗ (đảo, luống, 5 loại cây × 4 giai đoạn, bầu trời) — không
 * ảnh, không tải gì thêm.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Droplets, Bug, Shovel, Coins } from 'lucide-react';
import type { GameProps } from './registry';
import s from './khuVuon.module.css';

const NGAY_S = 180;
const N = 4;
type LoaiCay = 'carot' | 'cachua' | 'dau' | 'huongduong' | 'bingo';
const CAY: Record<LoaiCay, { ten: string; en: string; gia: number; ban: number; giay: number; qua: string; la: string }> = {
  carot: { ten: 'Cà rốt', en: 'Carrot', gia: 2, ban: 6, giay: 9, qua: '#fb923c', la: '#4ade80' },
  cachua: { ten: 'Cà chua', en: 'Tomato', gia: 4, ban: 11, giay: 14, qua: '#ef4444', la: '#22c55e' },
  dau: { ten: 'Dâu tây', en: 'Strawberry', gia: 6, ban: 17, giay: 19, qua: '#f43f5e', la: '#16a34a' },
  huongduong: { ten: 'Hướng dương', en: 'Sunflower', gia: 9, ban: 26, giay: 26, qua: '#facc15', la: '#65a30d' },
  bingo: { ten: 'Bí ngô', en: 'Pumpkin', gia: 14, ban: 42, giay: 36, qua: '#f97316', la: '#4d7c0f' },
};
const DS_CAY = Object.keys(CAY) as LoaiCay[];
type Luong = { loai: LoaiCay; tienDo: number; nuoc: number; sau: boolean; vang: boolean } | null;
type Cong = 'tuoi' | 'xeng' | LoaiCay;
type Bay = { id: number; x: number; y: number; chu: string; mau: string };

const tamO = (i: number) => {
  const r = Math.floor(i / N), c = i % N;
  return { x: 500 + (c - r) * 78, y: 300 + (c + r) * 39 };
};

/** Bầu trời theo phần ngày đã trôi (0 → 1): bình minh → trưa → hoàng hôn. */
function mauTroi(t: number): [string, string] {
  const moc: [number, string, string][] = [
    [0, '#fbcfe8', '#fde68a'], [0.25, '#7dd3fc', '#e0f2fe'], [0.6, '#38bdf8', '#bae6fd'], [0.85, '#f97316', '#fdba74'], [1, '#4c1d95', '#f472b6'],
  ];
  for (let i = 1; i < moc.length; i++) {
    if (t <= moc[i]![0]) {
      const [t0, a0, b0] = moc[i - 1]!, [t1, a1, b1] = moc[i]!;
      const k = (t - t0) / (t1 - t0);
      const tron = (x: string, y: string) => `color-mix(in srgb, ${y} ${Math.round(k * 100)}%, ${x})`;
      return [tron(a0, a1), tron(b0, b1)];
    }
  }
  return ['#4c1d95', '#f472b6'];
}

function VeCay({ l }: { l: NonNullable<Luong> }) {
  const c = CAY[l.loai];
  const g = l.tienDo >= 1 ? 3 : l.tienDo >= 0.6 ? 2 : l.tienDo >= 0.25 ? 1 : 0; // giai đoạn
  const qua = l.vang ? '#fde047' : c.qua;
  const kho = l.nuoc <= 0;
  const la = kho ? '#a3a3a3' : c.la;
  if (g === 0) return <g><path d="M0 0 q-2 -10 0 -16" stroke={la} strokeWidth="4" fill="none" strokeLinecap="round" /><ellipse cx="-6" cy="-16" rx="7" ry="4" fill={la} transform="rotate(-25 -6 -16)" /><ellipse cx="6" cy="-17" rx="7" ry="4" fill={la} transform="rotate(25 6 -17)" /></g>;
  const cao = g === 1 ? 30 : 46;
  const than = <path d={`M0 0 Q-3 ${-cao / 2} 0 ${-cao}`} stroke={kho ? '#a3a3a3' : '#3f6212'} strokeWidth="5" fill="none" strokeLinecap="round" />;
  const laDoi = (y: number, k: number) => (<g key={y}><ellipse cx={-11 * k} cy={y} rx={13 * k} ry={6 * k} fill={la} transform={`rotate(-30 ${-11 * k} ${y})`} /><ellipse cx={11 * k} cy={y - 4} rx={13 * k} ry={6 * k} fill={la} transform={`rotate(30 ${11 * k} ${y - 4})`} /></g>);
  if (l.loai === 'huongduong') {
    return (<g>{than}{laDoi(-cao * 0.45, 1)}{g >= 2 && (<g transform={`translate(0 ${-cao})`}>{Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx="0" cy={g === 3 ? -14 : -9} rx="5" ry={g === 3 ? 10 : 6} fill={qua} transform={`rotate(${i * 30})`} />)}<circle r={g === 3 ? 9 : 6} fill="#78350f" /></g>)}</g>);
  }
  if (l.loai === 'bingo') {
    return (<g>{laDoi(-10, 1.3)}{laDoi(-22, 1)}{g >= 2 && <g transform="translate(14 -4)"><ellipse rx={g === 3 ? 20 : 11} ry={g === 3 ? 15 : 9} fill={qua} /><path d={`M0 ${g === 3 ? -14 : -8} v-6`} stroke="#4d7c0f" strokeWidth="4" strokeLinecap="round" />{g === 3 && <><path d="M-7 -13 q-3 13 0 26 M7 -13 q3 13 0 26" stroke="#c2410c" strokeWidth="2" fill="none" opacity="0.6" /></>}</g>}</g>);
  }
  if (l.loai === 'carot') {
    return (<g>{g === 3 && <path d="M-7 6 L0 26 L7 6 Z" fill={qua} />}<path d="M0 2 l-8 -24 M0 2 l0 -28 M0 2 l8 -24" stroke={la} strokeWidth="5" strokeLinecap="round" />{g === 3 && <ellipse cy="4" rx="8" ry="4" fill={qua} />}</g>);
  }
  const soQua = g === 3 ? 3 : g === 2 ? 1 : 0;
  return (
    <g>
      {than}{laDoi(-cao * 0.35, 1)}{laDoi(-cao * 0.75, 0.8)}
      {Array.from({ length: soQua }, (_, i) => {
        const [x, y] = [[-12, -cao * 0.5], [12, -cao * 0.62], [0, -cao * 0.9]][i]!;
        return l.loai === 'dau'
          ? <path key={i} d={`M${x} ${y - 7} q9 2 7 9 q-3 8 -7 10 q-4 -2 -7 -10 q-2 -7 7 -9z`} fill={qua} />
          : <circle key={i} cx={x} cy={y} r="7" fill={qua} />;
      })}
    </g>
  );
}

export default function KhuVuonGame({ onScore, locale = 'vi' }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const [luong, setLuong] = useState<Luong[]>(() => Array.from({ length: N * N }, () => null));
  const [xu, setXu] = useState(20);
  const [thuHoach, setThuHoach] = useState(0);
  const [cong, setCong] = useState<Cong>('carot');
  const [conLai, setConLai] = useState(NGAY_S);
  const conLaiRef = useRef(NGAY_S);
  const [bay, setBay] = useState<Bay[]>([]);
  const [het, setHet] = useState(false);
  const luongRef = useRef(luong);
  luongRef.current = luong;
  const daBao = useRef(false);
  const idBay = useRef(1);

  // Đồng hồ ngày + sinh trưởng: mỗi 250 ms.
  useEffect(() => {
    if (het) return;
    let truoc = performance.now();
    const batDau = performance.now() - (NGAY_S - conLaiRef.current) * 1000;
    const id = setInterval(() => {
      const bayGio = performance.now();
      const dt = (bayGio - truoc) / 1000;
      truoc = bayGio;
      const con = Math.max(0, NGAY_S - (bayGio - batDau) / 1000);
      conLaiRef.current = con;
      setConLai(con);
      if (con === 0) setHet(true);
      setLuong((ds) => ds.map((l) => {
        if (!l || l.tienDo >= 1) return l;
        const nuoc = Math.max(0, l.nuoc - dt / 11);
        const lon = nuoc > 0 && !l.sau ? dt / CAY[l.loai].giay : 0;
        // Sâu xuất hiện ngẫu nhiên trên cây đang lớn (~mỗi 25 giây một cây).
        const sau = l.sau || (l.tienDo > 0.15 && Math.random() < dt / 25);
        return { ...l, nuoc, sau, tienDo: Math.min(1, l.tienDo + lon) };
      }));
    }, 250);
    return () => clearInterval(id);
  }, [het]);

  useEffect(() => {
    if (!het || daBao.current) return;
    daBao.current = true;
    onScore?.(thuHoach, NGAY_S);
  }, [het, thuHoach, onScore]);

  const bayChu = useCallback((i: number, chu: string, mau: string) => {
    const { x, y } = tamO(i);
    const id = idBay.current++;
    setBay((b) => [...b, { id, x, y: y - 40, chu, mau }]);
    setTimeout(() => setBay((b) => b.filter((z) => z.id !== id)), 900);
  }, []);

  const bam = (i: number) => {
    if (het) return;
    const l = luongRef.current[i];
    const datLuong = (moi: Luong) => setLuong((ds) => ds.map((x, k) => (k === i ? moi : x)));
    if (l && l.sau) { datLuong({ ...l, sau: false }); setXu((x) => x + 1); bayChu(i, '+1', '#a3e635'); return; }
    if (l && l.tienDo >= 1) {
      const gia = CAY[l.loai].ban * (l.vang ? 2 : 1);
      datLuong(null); setXu((x) => x + gia); setThuHoach((t) => t + gia);
      bayChu(i, `+${gia}`, l.vang ? '#fde047' : '#fef3c7');
      return;
    }
    if (cong === 'tuoi') { if (l) { datLuong({ ...l, nuoc: 1 }); bayChu(i, '💧', '#7dd3fc'); } return; }
    if (cong === 'xeng') { if (l) datLuong(null); return; }
    if (l) return;
    const c = CAY[cong];
    if (xu < c.gia) { bayChu(i, vi ? 'Thiếu xu' : 'No coins', '#fca5a5'); return; }
    setXu((x) => x - c.gia);
    datLuong({ loai: cong, tienDo: 0, nuoc: 1, sau: false, vang: Math.random() < 0.05 });
  };

  const tg = 1 - conLai / NGAY_S;
  const [troiTren, troiDuoi] = mauTroi(tg);
  const goc = Math.PI * (1 - tg);
  const mx = 500 + Math.cos(goc) * 420, my = 260 - Math.sin(goc) * 210;

  return (
    <div className={s.goc}>
      <div className={s.hud}>
        <span className={s.chip}><Coins size={15} /> <b>{xu}</b> {vi ? 'xu' : 'coins'}</span>
        <span className={s.chip}>{vi ? 'Đã thu hoạch' : 'Harvested'} <b>{thuHoach}</b></span>
        <span className={s.chip} data-gap={conLai < 20}>☀ <b>{Math.ceil(conLai)}</b>s</span>
      </div>

      <svg className={s.canh} viewBox="0 0 1000 640">
        <defs>
          <linearGradient id="kv-troi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={troiTren} /><stop offset="1" stopColor={troiDuoi} /></linearGradient>
          <radialGradient id="kv-mt"><stop offset="0" stopColor="#fffbeb" /><stop offset="0.5" stopColor="#fde68a" /><stop offset="1" stopColor="#fde68a" stopOpacity="0" /></radialGradient>
          <linearGradient id="kv-co" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#86efac" /><stop offset="1" stopColor="#22c55e" /></linearGradient>
          <linearGradient id="kv-dat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a16207" /><stop offset="1" stopColor="#713f12" /></linearGradient>
        </defs>
        <rect width="1000" height="640" fill="url(#kv-troi)" />
        <circle cx={mx} cy={my} r="70" fill="url(#kv-mt)" />
        <circle cx={mx} cy={my} r="26" fill="#fef3c7" />
        <g className={s.may} opacity="0.85">
          <g fill="#fff"><ellipse cx="160" cy="90" rx="60" ry="20" /><ellipse cx="200" cy="78" rx="40" ry="22" /></g>
          <g fill="#fff" transform="translate(560 40)"><ellipse cx="0" cy="40" rx="70" ry="18" /><ellipse cx="40" cy="30" rx="44" ry="20" /></g>
        </g>
        {/* Đảo: mặt cỏ + hai mặt bên đất cho cảm giác khối */}
        <g>
          <path d="M500 180 L840 350 L500 520 L160 350 Z" fill="url(#kv-co)" />
          <path d="M160 350 L500 520 L500 580 L160 410 Z" fill="#65a30d" />
          <path d="M500 520 L840 350 L840 410 L500 580 Z" fill="#4d7c0f" />
          <path d="M160 410 L500 580 L500 600 L160 430 Z" fill="#78350f" opacity="0.7" />
          <path d="M500 580 L840 410 L840 430 L500 600 Z" fill="#5b2a0a" opacity="0.7" />
          {/* Trang trí: hai cây tán tròn phía sau, ao nhỏ bên phải, hoa ven đảo */}
          <g className={s.tan}>
            <rect x="268" y="232" width="10" height="34" rx="4" fill="#78350f" />
            <circle cx="273" cy="222" r="30" fill="#16a34a" /><circle cx="256" cy="232" r="20" fill="#22c55e" /><circle cx="292" cy="230" r="18" fill="#15803d" />
          </g>
          <g className={s.tan} style={{ animationDelay: '-1.4s' }}>
            <rect x="718" y="232" width="10" height="34" rx="4" fill="#78350f" />
            <circle cx="723" cy="222" r="30" fill="#16a34a" /><circle cx="706" cy="232" r="20" fill="#22c55e" /><circle cx="742" cy="230" r="18" fill="#15803d" />
            <circle cx="712" cy="214" r="4" fill="#f43f5e" /><circle cx="734" cy="226" r="4" fill="#f43f5e" />
          </g>
          <ellipse cx="760" cy="350" rx="44" ry="18" fill="#38bdf8" opacity="0.85" />
          <ellipse cx="752" cy="346" rx="16" ry="5" fill="#e0f2fe" opacity="0.7" className={s.song} />
          {[[220, 352], [250, 372], [320, 410], [640, 430], [690, 404], [440, 470], [560, 470]].map(([fx, fy], k) => (
            <g key={k} transform={`translate(${fx} ${fy})`}><circle r="4" fill={['#f9a8d4', '#fde047', '#c4b5fd'][k % 3]} /><circle r="1.6" fill="#fff" /></g>
          ))}
        </g>
        {luong.map((l, i) => {
          const { x, y } = tamO(i);
          return (
            <g key={i} className={s.luong} onPointerDown={(e) => { e.preventDefault(); bam(i); }} data-chin={!!l && l.tienDo >= 1}>
              <path d={`M${x} ${y - 32} L${x + 66} ${y} L${x} ${y + 32} L${x - 66} ${y} Z`} fill={l ? (l.nuoc > 0 ? '#7c4a1e' : '#a16207') : 'url(#kv-dat)'} stroke="#3f2a10" strokeOpacity="0.4" strokeWidth="2" />
              {l && (
                <g transform={`translate(${x} ${y + 4})`} className={s.cay}>
                  <g transform="scale(1.65)"><VeCay l={l} /></g>
                  {l.tienDo < 1 && <rect x="-22" y="14" width="44" height="5" rx="2.5" fill="#00000055" />}
                  {l.tienDo < 1 && <rect x="-22" y="14" width={44 * l.tienDo} height="5" rx="2.5" fill={l.nuoc > 0 ? '#4ade80' : '#facc15'} />}
                  {l.nuoc <= 0 && l.tienDo < 1 && <text x="20" y="-34" fontSize="22" className={s.nhay}>💧</text>}
                  {l.sau && <g transform="translate(-14 -26)" className={s.sau}><ellipse rx="9" ry="6" fill="#65a30d" /><circle cx="8" cy="-2" r="4" fill="#3f6212" /><circle cx="9" cy="-3" r="1.4" fill="#fff" /></g>}
                  {l.tienDo >= 1 && <g className={s.lap}><circle cx="18" cy="-48" r="4" fill="#fff" /><circle cx="-20" cy="-36" r="3" fill="#fff" /></g>}
                </g>
              )}
            </g>
          );
        })}
        <g className={s.buom}><path d="M0 0 q-14 -16 -18 0 q4 12 18 0 q14 -16 18 0 q-4 12 -18 0z" fill="#f0abfc" /></g>
        {bay.map((b) => <text key={b.id} x={b.x} y={b.y} className={s.bay} fill={b.mau} textAnchor="middle">{b.chu}</text>)}
        {het && (
          <g>
            <rect width="1000" height="640" fill="#1e1b4b" opacity="0.6" />
            <text x="500" y="300" textAnchor="middle" fontSize="54" fontWeight="900" fill="#fde68a">{vi ? 'Hết ngày!' : 'Day over!'}</text>
            <text x="500" y="350" textAnchor="middle" fontSize="28" fill="#fff">{vi ? `Thu hoạch ${thuHoach} xu` : `Harvested ${thuHoach} coins`}</text>
          </g>
        )}
      </svg>

      <div className={s.congCu}>
        {DS_CAY.map((k) => (
          <button key={k} type="button" data-chon={cong === k} onClick={() => setCong(k)} disabled={xu < CAY[k].gia} style={{ ['--m' as string]: CAY[k].qua }}>
            <span className={s.hat} />
            <b>{vi ? CAY[k].ten : CAY[k].en}</b>
            <small>{CAY[k].gia} → {CAY[k].ban} {vi ? 'xu' : 'c'} · {CAY[k].giay}s</small>
          </button>
        ))}
        <button type="button" data-chon={cong === 'tuoi'} onClick={() => setCong('tuoi')} style={{ ['--m' as string]: '#38bdf8' }}><Droplets size={18} /><b>{vi ? 'Tưới' : 'Water'}</b></button>
        <button type="button" data-chon={cong === 'xeng'} onClick={() => setCong('xeng')} style={{ ['--m' as string]: '#a8a29e' }}><Shovel size={18} /><b>{vi ? 'Nhổ' : 'Dig'}</b></button>
      </div>
      <p className={s.goiY}><Bug size={13} /> {vi ? 'Chọn hạt rồi chạm luống để gieo. Cây khô (💧) thì tưới; có sâu thì chạm để bắt; cây lấp lánh là chín — chạm để thu hoạch.' : 'Pick a seed, tap a plot. Water dry plants (💧), tap bugs away, tap sparkling plants to harvest.'}</p>
    </div>
  );
}
