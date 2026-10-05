'use client';

/**
 * Bàn CỜ TƯỚNG (05/10/2026): mặt gỗ sáng có vân, kẻ mực nâu, sông "Sở hà – Hán giới", cung chéo,
 * dấu chữ thập ở vị trí pháo/tốt. Quân tròn khối nổi (mặt gỗ + thành dày + bóng), chữ Hán đỏ/đen.
 * Người cầm Đỏ thấy Đỏ ở dưới (Đen ở trên); cầm Đen thì lật bàn.
 */
import { useMemo, useRef, useState } from 'react';
import { LUAT, type NuocCoTuong, type TrangThaiCoTuong } from '@/lib/doiKhang/luat';
import { ghepQuan, type QuanCoId } from './theoDoiQuan';
import { useKichThuoc } from './chung';
import css from './doiKhang.module.css';

type Nhin = TrangThaiCoTuong & { chieu?: boolean };
const CHU: Record<string, string> = {
  K: '帥', A: '仕', B: '相', N: '傌', R: '俥', C: '炮', P: '兵',
  k: '將', a: '士', b: '象', n: '馬', r: '車', c: '砲', p: '卒',
};
const khoang = (a: number, b: number) => Math.abs((a % 9) - (b % 9)) + Math.abs(Math.floor(a / 9) - Math.floor(b / 9));

export default function BanCoTuong({
  nhin,
  gheCuaToi,
  choPhepDi,
  onDi,
}: {
  nhin: Nhin;
  gheCuaToi: number | null;
  choPhepDi: boolean;
  onDi: (n: NuocCoTuong) => void;
}) {
  const [khungRef, kt] = useKichThuoc<HTMLDivElement>();
  const lat = gheCuaToi === 1;
  const laDoToi = gheCuaToi !== 1;
  // 8 khoảng ngang × 9 khoảng dọc + lề 0,8 ô mỗi bên + viền.
  const o = Math.max(18, Math.min(kt.w / 10.1, kt.h / 11.1));
  const le = o * 0.8;
  const vien = o * 0.22;
  const W = o * 8 + le * 2, H = o * 9 + le * 2;

  const [chon, setChon] = useState<number | null>(null);
  const banRef = useRef<HTMLDivElement>(null);

  const quanRef = useRef<{ ban: unknown; ds: QuanCoId[]; dem: { v: number } }>({ ban: null, ds: [], dem: { v: 0 } });
  if (quanRef.current.ban !== nhin.ban) {
    const tuO = nhin.nuocCuoi ? nhin.nuocCuoi.tu[1] * 9 + nhin.nuocCuoi.tu[0] : null;
    quanRef.current = {
      ban: nhin.ban,
      ds: ghepQuan(quanRef.current.ds, nhin.ban, tuO, khoang, quanRef.current.dem),
      dem: quanRef.current.dem,
    };
  }
  const dsQuan = quanRef.current.ds;

  const hopLe = useMemo<NuocCoTuong[]>(() => (choPhepDi ? (LUAT['co-tuong'].cacNuoc(nhin) as NuocCoTuong[]) : []), [nhin, choPhepDi]);
  const dich = useMemo(() => {
    if (chon === null) return new Set<number>();
    const c = chon % 9, h = Math.floor(chon / 9);
    return new Set(hopLe.filter((m) => m.tu[0] === c && m.tu[1] === h).map((m) => m.den[1] * 9 + m.den[0]));
  }, [chon, hopLe]);

  /** Toạ độ màn hình (tâm giao điểm) của ô bàn. */
  const diem = (sq: number) => {
    const c = sq % 9, h = Math.floor(sq / 9);
    const xc = lat ? 8 - c : c, yc = lat ? h : 9 - h;
    return { x: le + xc * o, y: le + yc * o };
  };
  const laQuanToi = (sq: number) => {
    const q = nhin.ban[sq];
    return !!q && (q === q.toUpperCase()) === laDoToi;
  };
  const bam = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const r = banRef.current?.getBoundingClientRect();
    if (!r) return;
    const xc = Math.round((e.clientX - r.left - le) / o), yc = Math.round((e.clientY - r.top - le) / o);
    if (xc < 0 || xc > 8 || yc < 0 || yc > 9) return setChon(null);
    const c = lat ? 8 - xc : xc, h = lat ? yc : 9 - yc;
    const sq = h * 9 + c;
    if (chon !== null && dich.has(sq)) {
      onDi({ tu: [chon % 9, Math.floor(chon / 9)], den: [c, h] });
      setChon(null);
      return;
    }
    if (choPhepDi && laQuanToi(sq)) setChon(chon === sq ? null : sq);
    else setChon(null);
  };

  const oTuongChieu = nhin.chieu ? nhin.ban.indexOf(nhin.luotGhe === 0 ? 'K' : 'k') : -1;
  const nc = nhin.nuocCuoi ? [nhin.nuocCuoi.tu[1] * 9 + nhin.nuocCuoi.tu[0], nhin.nuocCuoi.den[1] * 9 + nhin.nuocCuoi.den[0]] : [];
  const D = o * 0.88; // đường kính quân

  // Lưới
  const net: string[] = [];
  for (let r = 0; r < 10; r++) net.push(`M${le} ${le + r * o} H${le + 8 * o}`);
  for (let c = 0; c < 9; c++) {
    if (c === 0 || c === 8) net.push(`M${le + c * o} ${le} V${le + 9 * o}`);
    else {
      net.push(`M${le + c * o} ${le} V${le + 4 * o}`);
      net.push(`M${le + c * o} ${le + 5 * o} V${le + 9 * o}`);
    }
  }
  net.push(`M${le + 3 * o} ${le} L${le + 5 * o} ${le + 2 * o} M${le + 5 * o} ${le} L${le + 3 * o} ${le + 2 * o}`);
  net.push(`M${le + 3 * o} ${le + 7 * o} L${le + 5 * o} ${le + 9 * o} M${le + 5 * o} ${le + 7 * o} L${le + 3 * o} ${le + 9 * o}`);
  // Dấu vị trí pháo / tốt
  const dau: string[] = [];
  const g = o * 0.12, d = o * 0.28;
  const moc = (c: number, r: number) => {
    const x = le + c * o, y = le + r * o;
    for (const sx of [-1, 1]) {
      if ((c === 0 && sx < 0) || (c === 8 && sx > 0)) continue;
      for (const sy of [-1, 1]) dau.push(`M${x + sx * g} ${y + sy * (g + d)} V${y + sy * g} H${x + sx * (g + d)}`);
    }
  };
  for (const r of [2, 7]) for (const c of [1, 7]) moc(c, r);
  for (const r of [3, 6]) for (const c of [0, 2, 4, 6, 8]) moc(c, r);

  return (
    <div ref={khungRef} className="relative flex h-full w-full items-center justify-center">
      <div
        className="relative select-none"
        style={{
          padding: vien,
          borderRadius: o * 0.35,
          background: 'linear-gradient(150deg, #6b3a1d, #3e200e)',
          boxShadow: '0 40px 70px -28px rgba(0,0,0,.8), 0 14px 26px -8px rgba(0,0,0,.55), inset 0 2px 0 rgba(255,220,180,.3), inset 0 -4px 0 rgba(0,0,0,.45)',
        }}
      >
        <div
          ref={banRef}
          className="relative touch-none"
          style={{ width: W, height: H, borderRadius: o * 0.18, overflow: 'hidden', cursor: choPhepDi ? 'pointer' : 'default' }}
          onPointerDown={bam}
        >
          <svg width={W} height={H} className="absolute inset-0" aria-hidden>
            <defs>
              <linearGradient id="ctNen" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f1d9a6" />
                <stop offset=".5" stopColor="#e7c68a" />
                <stop offset="1" stopColor="#d9b073" />
              </linearGradient>
              <pattern id="ctVan" width="160" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(-4)">
                <path d="M0 10 Q 40 5 80 11 T 160 9" fill="none" stroke="#8a5a2b" strokeOpacity=".12" strokeWidth="1.3" />
                <path d="M0 27 Q 50 32 90 26 T 160 28" fill="none" stroke="#8a5a2b" strokeOpacity=".09" strokeWidth="1" />
                <path d="M0 39 Q 30 37 70 41 T 160 38" fill="none" stroke="#fff" strokeOpacity=".12" strokeWidth="1" />
              </pattern>
              <radialGradient id="ctChieu">
                <stop offset="0" stopColor="#ff2d2d" stopOpacity=".9" />
                <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width={W} height={H} fill="url(#ctNen)" />
            <rect width={W} height={H} fill="url(#ctVan)" />
            {/* sông */}
            <rect x={le} y={le + 4 * o} width={8 * o} height={o} fill="#9cc7c9" fillOpacity=".22" />
            <g fontFamily="'Songti SC','STSong','Noto Serif SC','SimSun',serif" fontWeight="700" fill="#7a4a1f" fillOpacity=".55" fontSize={o * 0.5} textAnchor="middle">
              <text x={le + 2 * o} y={le + 4.62 * o}>楚 河</text>
              <text x={le + 6 * o} y={le + 4.62 * o}>漢 界</text>
            </g>
            <g fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic" fill="#7a4a1f" fillOpacity=".6" fontSize={o * 0.2} textAnchor="middle">
              <text x={le + 2 * o} y={le + 4.88 * o}>Sở hà</text>
              <text x={le + 6 * o} y={le + 4.88 * o}>Hán giới</text>
            </g>
            <rect x={le - o * 0.12} y={le - o * 0.12} width={8 * o + o * 0.24} height={9 * o + o * 0.24} fill="none" stroke="#5b3416" strokeWidth={Math.max(2, o * 0.06)} />
            <path d={net.join(' ')} stroke="#5b3416" strokeWidth={Math.max(1, o * 0.032)} fill="none" strokeLinecap="square" />
            <path d={dau.join(' ')} stroke="#5b3416" strokeWidth={Math.max(1, o * 0.03)} fill="none" />
            {nc.map((sq, i) => {
              const p = diem(sq);
              return i === 0 ? (
                <circle key="nc0" cx={p.x} cy={p.y} r={D * 0.28} fill="none" stroke="#2563eb" strokeOpacity=".55" strokeWidth={Math.max(1.5, o * 0.05)} strokeDasharray={`${o * 0.08} ${o * 0.08}`} />
              ) : null;
            })}
            {oTuongChieu >= 0 && (() => {
              const p = diem(oTuongChieu);
              return <circle className={css.chieu} cx={p.x} cy={p.y} r={D * 0.85} fill="url(#ctChieu)" />;
            })()}
          </svg>

          {/* quân */}
          {dsQuan.map((q) => {
            const p = diem(q.o);
            const doQ = q.quan === q.quan.toUpperCase();
            const dangChon = chon === q.o;
            const vuaDi = nc[1] === q.o;
            return (
              <div
                key={q.id}
                className={`${css.quan} pointer-events-none`}
                style={{ width: D, height: D, transform: `translate(${p.x - D / 2}px, ${p.y - D / 2 - (dangChon ? o * 0.08 : 0)}px)`, zIndex: dangChon ? 20 : 2 }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 30%, #fff4dc 0%, #f2d9a8 38%, #d9b277 75%, #b98a4c 100%)',
                    boxShadow: dangChon
                      ? `0 ${o * 0.07}px 0 #8a5a2b, 0 ${o * 0.2}px ${o * 0.28}px rgba(0,0,0,.45), 0 0 0 ${Math.max(2, o * 0.06)}px #38bdf8`
                      : `0 ${o * 0.06}px 0 #8a5a2b, 0 ${o * 0.1}px ${o * 0.16}px rgba(0,0,0,.45)${vuaDi ? `, 0 0 0 ${Math.max(2, o * 0.05)}px rgba(250,204,21,.85)` : ''}`,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '82%',
                      height: '82%',
                      borderRadius: '50%',
                      border: `${Math.max(1.5, o * 0.035)}px solid ${doQ ? '#b91c1c' : '#1c1917'}`,
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,.25)',
                      display: 'grid',
                      placeItems: 'center',
                      color: doQ ? '#b91c1c' : '#1c1917',
                      fontFamily: '\'Kaiti SC\',\'STKaiti\',\'KaiTi\',\'Songti SC\',\'Noto Serif SC\',serif',
                      fontWeight: 800,
                      fontSize: D * 0.5,
                      lineHeight: 1,
                      textShadow: '0 1px 0 rgba(255,255,255,.55)',
                    }}
                  >
                    {CHU[q.quan]}
                  </div>
                </div>
              </div>
            );
          })}

          {/* chấm nước hợp lệ */}
          {[...dich].map((sq) => {
            const p = diem(sq);
            const an = !!nhin.ban[sq];
            const k = an ? D * 1.04 : o * 0.26;
            return (
              <div
                key={`d${sq}`}
                className={`pointer-events-none absolute ${css.cham}`}
                style={{
                  left: p.x - k / 2,
                  top: p.y - k / 2,
                  width: k,
                  height: k,
                  borderRadius: '50%',
                  zIndex: 25,
                  ...(an ? { border: `${Math.max(3, o * 0.07)}px solid rgba(22,163,74,.75)` } : { background: 'rgba(22,101,52,.55)', boxShadow: '0 0 0 3px rgba(255,255,255,.35)' }),
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
