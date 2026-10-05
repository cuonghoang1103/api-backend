'use client';

/**
 * Bàn CARO 15×15 (05/10/2026): tờ giấy kẻ ô có lề đỏ như vở học trò, X/O nét bút vẽ dần
 * (stroke-dashoffset), nước cuối nhấp nháy nhẹ, đường thắng được kẻ nối bằng bút dạ.
 */
import { memo, useState } from 'react';
import { CO_CARO, type NuocCaro, type TrangThaiCaro } from '@/lib/doiKhang/luat';
import { useKichThuoc } from './chung';
import css from './doiKhang.module.css';

const N = CO_CARO;
const COT = 'ABCDEFGHIJKLMNO';
const MAU_X = '#e11d48';
const MAU_O = '#1d4ed8';

const DauX = memo(function DauX({ x, y, o }: { x: number; y: number; o: number }) {
  const p = o * 0.24;
  return (
    <g stroke={MAU_X} strokeWidth={Math.max(2, o * 0.13)} strokeLinecap="round" fill="none">
      <path className={css.net} pathLength={1} d={`M${x + p} ${y + p} Q ${x + o / 2 + o * 0.03} ${y + o / 2 - o * 0.04} ${x + o - p} ${y + o - p}`} />
      <path className={css.net2} pathLength={1} d={`M${x + o - p} ${y + p} Q ${x + o / 2 - o * 0.02} ${y + o / 2 - o * 0.03} ${x + p} ${y + o - p}`} />
    </g>
  );
});
const DauO = memo(function DauO({ x, y, o }: { x: number; y: number; o: number }) {
  const r = o * 0.29;
  const cx = x + o / 2, cy = y + o / 2;
  return (
    <path
      className={css.net}
      pathLength={1}
      d={`M${cx + r * 0.1} ${cy - r} C ${cx + r * 1.15} ${cy - r * 0.95} ${cx + r * 1.1} ${cy + r} ${cx} ${cy + r} C ${cx - r * 1.1} ${cy + r} ${cx - r * 1.08} ${cy - r * 0.9} ${cx - r * 0.05} ${cy - r * 1.02}`}
      stroke={MAU_O}
      strokeWidth={Math.max(2, o * 0.12)}
      strokeLinecap="round"
      fill="none"
    />
  );
});

export default function BanCaro({
  nhin,
  gheCuaToi,
  choPhepDi,
  onDi,
}: {
  nhin: TrangThaiCaro;
  gheCuaToi: number | null;
  choPhepDi: boolean;
  onDi: (n: NuocCaro) => void;
}) {
  const [khungRef, kt] = useKichThuoc<HTMLDivElement>();
  const S = Math.max(200, Math.floor(Math.min(kt.w, kt.h)));
  const le = S * 0.06;
  const o = (S - le * 2) / N;
  const [tro, setTro] = useState<number | null>(null);

  const oTai = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - r.left - le) / o), y = Math.floor((e.clientY - r.top - le) / o);
    if (x < 0 || y < 0 || x >= N || y >= N) return null;
    return y * N + x;
  };

  const ke: string[] = [];
  for (let i = 0; i <= N; i++) {
    ke.push(`M${le} ${le + i * o} H${le + N * o}`);
    ke.push(`M${le + i * o} ${le} V${le + N * o}`);
  }
  const duong = nhin.thang?.duong ? [...nhin.thang.duong].sort((a, b) => a[0] - b[0] || a[1] - b[1]) : null;
  const xemTruoc = choPhepDi && tro !== null && nhin.ban[tro] === 0 ? tro : null;
  const quanToi = gheCuaToi === 1 ? 2 : 1;

  return (
    <div ref={khungRef} className="relative flex h-full w-full items-center justify-center">
      <div
        className="relative"
        style={{
          width: S,
          height: S,
          borderRadius: 14,
          background: 'linear-gradient(160deg, #fffdf6 0%, #f7f1e1 60%, #efe6cf 100%)',
          boxShadow: '0 40px 70px -30px rgba(0,0,0,.75), 0 12px 24px -10px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.6), inset 0 -3px 0 rgba(0,0,0,.08)',
          transform: 'rotate(-0.4deg)',
        }}
      >
        <svg
          width={S}
          height={S}
          className="absolute inset-0 touch-none select-none"
          style={{ cursor: choPhepDi ? 'pointer' : 'default' }}
          onPointerMove={(e) => setTro(oTai(e))}
          onPointerLeave={() => setTro(null)}
          onPointerDown={(e) => {
            if (!choPhepDi || e.button !== 0) return;
            const i = oTai(e);
            if (i === null || nhin.ban[i] !== 0) return;
            onDi({ o: [i % N, Math.floor(i / N)] });
          }}
        >
          <path d={ke.join(' ')} stroke="#9bb8dc" strokeWidth="1" strokeOpacity=".75" fill="none" />
          <path d={`M${le * 0.55} 0 V${S}`} stroke="#f87171" strokeOpacity=".5" strokeWidth="1.5" />
          <g fontFamily="ui-sans-serif, system-ui" fontSize={Math.max(8, o * 0.34)} fill="#64748b" fillOpacity=".75" textAnchor="middle">
            {Array.from({ length: N }, (_, i) => (
              <g key={i}>
                <text x={le + i * o + o / 2} y={le * 0.7}>{COT[i]}</text>
                <text x={le * 0.42 + S - le} y={le + i * o + o * 0.62} textAnchor="start" fontSize={Math.max(7, o * 0.3)}>
                  {i + 1}
                </text>
              </g>
            ))}
          </g>
          {nhin.nuocCuoi && (
            <rect
              className={css.nhipNhe}
              x={le + nhin.nuocCuoi[0] * o + 1}
              y={le + nhin.nuocCuoi[1] * o + 1}
              width={o - 2}
              height={o - 2}
              rx={o * 0.15}
              fill="#fde047"
              fillOpacity=".55"
            />
          )}
          {xemTruoc !== null && (
            <g opacity=".28" style={{ pointerEvents: 'none' }}>
              {quanToi === 1 ? (
                <path
                  d={`M${le + (xemTruoc % N) * o + o * 0.26} ${le + Math.floor(xemTruoc / N) * o + o * 0.26} l${o * 0.48} ${o * 0.48} m0 ${-o * 0.48} l${-o * 0.48} ${o * 0.48}`}
                  stroke={MAU_X}
                  strokeWidth={o * 0.12}
                  strokeLinecap="round"
                />
              ) : (
                <circle cx={le + (xemTruoc % N) * o + o / 2} cy={le + Math.floor(xemTruoc / N) * o + o / 2} r={o * 0.28} stroke={MAU_O} strokeWidth={o * 0.12} fill="none" />
              )}
            </g>
          )}
          {nhin.ban.map((v, i) => {
            if (v === 0) return null;
            const x = le + (i % N) * o, y = le + Math.floor(i / N) * o;
            return v === 1 ? <DauX key={i} x={x} y={y} o={o} /> : <DauO key={i} x={x} y={y} o={o} />;
          })}
          {duong && duong.length >= 2 && (
            <line
              className={css.duongThang}
              pathLength={1}
              x1={le + duong[0][0] * o + o / 2}
              y1={le + duong[0][1] * o + o / 2}
              x2={le + duong[duong.length - 1][0] * o + o / 2}
              y2={le + duong[duong.length - 1][1] * o + o / 2}
              stroke={nhin.thang!.ghe === 0 ? '#be123c' : '#1e3a8a'}
              strokeOpacity=".8"
              strokeWidth={o * 0.2}
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
