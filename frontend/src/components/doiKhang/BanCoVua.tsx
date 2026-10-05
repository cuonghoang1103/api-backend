'use client';

/**
 * Bàn CỜ VUA (05/10/2026): gỗ hai tông có vân, viền dày vát + bóng đổ mềm, toạ độ a–h/1–8, quân
 * SVG trượt mượt (giữ danh tính quân qua `ghepQuan`), kéo-thả + bấm-bấm, chấm nước hợp lệ, ô vừa
 * đi sáng, vua bị chiếu ánh đỏ, chọn quân phong cấp. Lật bàn khi mình cầm Đen.
 */
import { useCallback, useMemo, useRef, useState } from 'react';
import { LUAT, type NuocCoVua, type PhongCap, type QuanCoVua, type TrangThaiCoVua } from '@/lib/doiKhang/luat';
import QuanCoVuaSvg from './QuanCoVuaSvg';
import { ghepQuan, type QuanCoId } from './theoDoiQuan';
import { useKichThuoc } from './chung';
import css from './doiKhang.module.css';

type Nhin = TrangThaiCoVua & { chieu?: boolean };
const COT = 'abcdefgh';
const tenO = (o: number) => COT[o % 8] + String(Math.floor(o / 8) + 1);
const oTuTen = (t: string) => (t.charCodeAt(1) - 49) * 8 + (t.charCodeAt(0) - 97);
const khoang = (a: number, b: number) => Math.abs((a % 8) - (b % 8)) + Math.abs(Math.floor(a / 8) - Math.floor(b / 8));

export default function BanCoVua({
  nhin,
  gheCuaToi,
  choPhepDi,
  onDi,
}: {
  nhin: Nhin;
  gheCuaToi: number | null;
  choPhepDi: boolean;
  onDi: (n: NuocCoVua) => void;
}) {
  const [khungRef, kt] = useKichThuoc<HTMLDivElement>();
  const lat = gheCuaToi === 1;
  const mauToi = gheCuaToi === 1 ? 'b' : 'w';
  const S = Math.max(160, Math.floor(Math.min(kt.w, kt.h)));
  const vien = Math.round(S * 0.042);
  const trong = S - vien * 2;
  const o = trong / 8;

  const [chon, setChon] = useState<number | null>(null);
  const [keo, setKeo] = useState<{ id: number; x: number; y: number } | null>(null);
  const [phong, setPhong] = useState<{ tu: number; den: number } | null>(null);
  const keoRef = useRef<{ o: number; id: number; x0: number; y0: number; dang: boolean; boChon: boolean } | null>(null);
  const banRef = useRef<HTMLDivElement>(null);

  // Giữ danh tính quân giữa các thế (ghi ref trong render nhưng bất biến theo `nhin.ban` — idempotent).
  const quanRef = useRef<{ ban: unknown; ds: QuanCoId[]; dem: { v: number } }>({ ban: null, ds: [], dem: { v: 0 } });
  if (quanRef.current.ban !== nhin.ban) {
    const tuO = nhin.nuocCuoi ? oTuTen(nhin.nuocCuoi.tu) : null;
    quanRef.current = {
      ban: nhin.ban,
      ds: ghepQuan(quanRef.current.ds, nhin.ban, tuO, khoang, quanRef.current.dem),
      dem: quanRef.current.dem,
    };
  }
  const dsQuan = quanRef.current.ds;

  const hopLe = useMemo<NuocCoVua[]>(() => (choPhepDi ? (LUAT['co-vua'].cacNuoc(nhin) as NuocCoVua[]) : []), [nhin, choPhepDi]);
  const dichCuaChon = useMemo(() => {
    if (chon === null) return new Set<number>();
    const t = tenO(chon);
    return new Set(hopLe.filter((m) => m.tu === t).map((m) => oTuTen(m.den)));
  }, [chon, hopLe]);

  // Ô hiển thị ↔ ô bàn
  const viTri = useCallback(
    (sq: number) => {
      const c = sq % 8, h = Math.floor(sq / 8);
      const dc = lat ? 7 - c : c, dr = lat ? h : 7 - h;
      return { x: dc * o, y: dr * o };
    },
    [lat, o],
  );
  const oTaiDiem = (clientX: number, clientY: number): number | null => {
    const r = banRef.current?.getBoundingClientRect();
    if (!r) return null;
    const dc = Math.floor((clientX - r.left) / o), dr = Math.floor((clientY - r.top) / o);
    if (dc < 0 || dc > 7 || dr < 0 || dr > 7) return null;
    const c = lat ? 7 - dc : dc, h = lat ? dr : 7 - dr;
    return h * 8 + c;
  };
  const laQuanToi = (sq: number) => {
    const q = nhin.ban[sq];
    return !!q && (q === q.toUpperCase() ? 'w' : 'b') === mauToi;
  };

  const thuDi = (tu: number, den: number): boolean => {
    const t = tenO(tu), d = tenO(den);
    const ung = hopLe.filter((m) => m.tu === t && m.den === d);
    if (ung.length === 0) return false;
    if (ung.some((m) => m.phong)) setPhong({ tu, den });
    else onDi({ tu: t, den: d });
    setChon(null);
    return true;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || phong) return;
    const sq = oTaiDiem(e.clientX, e.clientY);
    if (sq === null) return;
    if (chon !== null && sq !== chon && dichCuaChon.has(sq)) {
      thuDi(chon, sq);
      return;
    }
    if (choPhepDi && laQuanToi(sq)) {
      const q = dsQuan.find((x) => x.o === sq);
      keoRef.current = { o: sq, id: q?.id ?? -1, x0: e.clientX, y0: e.clientY, dang: false, boChon: chon === sq };
      setChon(sq);
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } else setChon(null);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const k = keoRef.current;
    if (!k) return;
    if (!k.dang && Math.hypot(e.clientX - k.x0, e.clientY - k.y0) > 5) k.dang = true;
    if (k.dang) {
      const r = banRef.current!.getBoundingClientRect();
      setKeo({ id: k.id, x: e.clientX - r.left, y: e.clientY - r.top });
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const k = keoRef.current;
    keoRef.current = null;
    if (!k) return;
    if (k.dang) {
      setKeo(null);
      const sq = oTaiDiem(e.clientX, e.clientY);
      if (sq !== null && sq !== k.o) thuDi(k.o, sq);
    } else if (k.boChon) setChon(null);
  };

  const oVuaChieu = useMemo(() => {
    if (!nhin.chieu) return -1;
    return nhin.ban.indexOf(nhin.luotMau === 'w' ? 'K' : 'k');
  }, [nhin]);
  const nuocCuoi = nhin.nuocCuoi ? [oTuTen(nhin.nuocCuoi.tu), oTuTen(nhin.nuocCuoi.den)] : [];
  const coChu = Math.max(9, o * 0.17);

  const vuong = [];
  for (let sq = 0; sq < 64; sq++) {
    const { x, y } = viTri(sq);
    const toi = ((sq % 8) + Math.floor(sq / 8)) % 2 === 0;
    vuong.push(<rect key={sq} x={x} y={y} width={o + 0.5} height={o + 0.5} fill={toi ? 'url(#cvToi)' : 'url(#cvSang)'} />);
  }

  return (
    <div ref={khungRef} className="relative flex h-full w-full items-center justify-center">
      <div
        className="relative select-none"
        style={{
          width: S,
          height: S,
          padding: vien,
          borderRadius: Math.max(10, vien * 0.7),
          background:
            'linear-gradient(145deg, #7a4a28 0%, #5a3219 45%, #3b1f0e 100%)',
          boxShadow:
            '0 40px 70px -28px rgba(0,0,0,.8), 0 14px 26px -8px rgba(0,0,0,.55), inset 0 2px 0 rgba(255,220,180,.35), inset 0 -4px 0 rgba(0,0,0,.45), inset 2px 0 0 rgba(255,220,180,.12), inset -2px 0 0 rgba(0,0,0,.3)',
        }}
      >
        {/* vân gỗ viền */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: 'inherit',
            background: 'repeating-linear-gradient(100deg, rgba(255,255,255,.035) 0 2px, transparent 2px 9px), repeating-linear-gradient(80deg, rgba(0,0,0,.06) 0 1px, transparent 1px 13px)',
          }}
        />
        <div
          ref={banRef}
          className="relative touch-none"
          style={{ width: trong, height: trong, borderRadius: 3, boxShadow: '0 0 0 2px rgba(20,10,4,.65), 0 0 0 4px rgba(255,214,160,.18)', cursor: choPhepDi ? 'pointer' : 'default' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { keoRef.current = null; setKeo(null); }}
        >
          <svg width={trong} height={trong} className="absolute inset-0" aria-hidden>
            <defs>
              <linearGradient id="cvSang" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f3dfbb" />
                <stop offset="1" stopColor="#e4c896" />
              </linearGradient>
              <linearGradient id="cvToi" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#b98457" />
                <stop offset="1" stopColor="#9a6640" />
              </linearGradient>
              <pattern id="cvVan" width="120" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
                <path d="M0 8 Q 30 4 60 9 T 120 7" fill="none" stroke="#5a3418" strokeOpacity=".09" strokeWidth="1.2" />
                <path d="M0 22 Q 40 26 70 21 T 120 23" fill="none" stroke="#5a3418" strokeOpacity=".07" strokeWidth="1" />
                <path d="M0 33 Q 25 31 55 35 T 120 32" fill="none" stroke="#fff" strokeOpacity=".07" strokeWidth="1" />
              </pattern>
              <radialGradient id="cvChieu">
                <stop offset="0" stopColor="#ff2d2d" stopOpacity=".95" />
                <stop offset=".55" stopColor="#ef4444" stopOpacity=".5" />
                <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
            </defs>
            {vuong}
            <rect width={trong} height={trong} fill="url(#cvVan)" />
            {nuocCuoi.map((sq) => {
              const { x, y } = viTri(sq);
              return <rect key={`nc${sq}`} x={x} y={y} width={o} height={o} fill="#f7d14a" fillOpacity=".42" />;
            })}
            {chon !== null && (() => {
              const { x, y } = viTri(chon);
              return <rect x={x} y={y} width={o} height={o} fill="#7dd3fc" fillOpacity=".45" />;
            })()}
            {oVuaChieu >= 0 && (() => {
              const { x, y } = viTri(oVuaChieu);
              return <circle className={css.chieu} cx={x + o / 2} cy={y + o / 2} r={o * 0.62} fill="url(#cvChieu)" />;
            })()}
            {/* toạ độ */}
            {Array.from({ length: 8 }, (_, i) => {
              const c = lat ? 7 - i : i;
              const h = lat ? i : 7 - i;
              // chữ sáng trên ô tối, chữ tối trên ô sáng
              const toiCot = (c + (lat ? 7 : 0)) % 2 === 0;
              const toiHang = ((lat ? 7 : 0) + h) % 2 === 0;
              return (
                <g key={`td${i}`} fontFamily="ui-sans-serif, system-ui" fontWeight="700" fontSize={coChu}>
                  <text x={i * o + o - coChu * 0.35} y={8 * o - coChu * 0.35} textAnchor="end" fill={toiCot ? '#f3dfbb' : '#9a6640'} fillOpacity=".95">
                    {COT[c]}
                  </text>
                  <text x={coChu * 0.3} y={i * o + coChu * 1.05} fill={toiHang ? '#f3dfbb' : '#9a6640'} fillOpacity=".95">
                    {h + 1}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* chấm nước hợp lệ */}
          {[...dichCuaChon].map((sq) => {
            const { x, y } = viTri(sq);
            const an = !!nhin.ban[sq];
            return (
              <div
                key={`ch${sq}`}
                className={`pointer-events-none absolute ${css.cham}`}
                style={{ left: x, top: y, width: o, height: o, display: 'grid', placeItems: 'center' }}
              >
                {an ? (
                  <div style={{ width: o * 0.92, height: o * 0.92, borderRadius: '50%', border: `${Math.max(3, o * 0.08)}px solid rgba(20,40,30,.38)` }} />
                ) : (
                  <div style={{ width: o * 0.28, height: o * 0.28, borderRadius: '50%', background: 'rgba(20,40,30,.32)' }} />
                )}
              </div>
            );
          })}

          {/* quân */}
          {dsQuan.map((q) => {
            const dangKeo = keo && keo.id === q.id;
            const { x, y } = viTri(q.o);
            const tx = dangKeo ? keo!.x - o / 2 : x;
            const ty = dangKeo ? keo!.y - o / 2 : y;
            return (
              <div
                key={q.id}
                className={`${css.quan} ${dangKeo ? css.quanKeo : ''} pointer-events-none`}
                style={{ width: o, height: o, transform: `translate(${tx}px, ${ty}px)${dangKeo ? ' scale(1.12)' : ''}`, zIndex: dangKeo ? 30 : 2 }}
              >
                <div style={{ padding: o * 0.05 }}>
                  <QuanCoVuaSvg quan={q.quan as QuanCoVua} kich={o * 0.9} />
                </div>
              </div>
            );
          })}

          {/* chọn quân phong cấp */}
          {phong && (() => {
            const { x } = viTri(phong.den);
            const ds: PhongCap[] = ['q', 'r', 'b', 'n'];
            return (
              <div className="absolute inset-0 z-40 bg-black/35" onPointerDown={(e) => { e.stopPropagation(); setPhong(null); }}>
                <div
                  className={`absolute flex flex-col overflow-hidden rounded-xl border border-white/30 bg-white/90 shadow-2xl ${css.noiLen}`}
                  style={{ left: x, top: 0, width: o }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {ds.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className="grid place-items-center transition-colors hover:bg-amber-200"
                      style={{ height: o }}
                      onClick={() => {
                        onDi({ tu: tenO(phong.tu), den: tenO(phong.den), phong: p });
                        setPhong(null);
                      }}
                      aria-label={`Phong ${p}`}
                    >
                      <QuanCoVuaSvg quan={(mauToi === 'w' ? p.toUpperCase() : p) as QuanCoVua} kich={o * 0.85} />
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
