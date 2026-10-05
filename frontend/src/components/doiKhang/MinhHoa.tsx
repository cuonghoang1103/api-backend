/**
 * Minh hoạ 4 thẻ trò ở sảnh (05/10/2026) — vẽ hoàn toàn bằng CSS 3D + SVG, không ảnh tải về:
 * bàn cờ nghiêng có quân đứng thẳng (billboard), bàn cờ tướng nghiêng với quân tròn, quạt bài,
 * tờ caro nghiêng có đường thắng. Tĩnh — chỉ nhấc nhẹ khi rê chuột (group-hover), không chạy liên tục.
 */
import type { QuanCoVua } from '@/lib/doiKhang/luat';
import QuanCoVuaSvg from './QuanCoVuaSvg';
import { LaBai } from './LaBai';

/** Nhấc nhẹ khi rê chuột vào thẻ — đặt ở lớp bọc vì transform inline của lớp trong sẽ đè class. */
const NHAC = 'transition-transform duration-500 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none';
const NGHIENG = 'rotateX(58deg) rotateZ(-38deg)';
const DUNG = 'rotateZ(38deg) rotateX(-58deg)';

export function MinhHoaCoVua() {
  const o = 22;
  const quan: [QuanCoVua, number, number][] = [
    ['k', 4, 0], ['q', 3, 1], ['n', 5, 2], ['p', 2, 2], ['p', 4, 3],
    ['P', 3, 4], ['N', 5, 5], ['B', 2, 5], ['Q', 4, 6], ['K', 3, 7],
  ];
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className={NHAC} style={{ perspective: 700 }}>
      <div
        className="relative"
        style={{ width: o * 8, height: o * 8, transform: NGHIENG, transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute -inset-[9px] rounded-[6px]"
          style={{ background: 'linear-gradient(145deg,#7a4a28,#3b1f0e)', boxShadow: '0 0 0 1px rgba(0,0,0,.4), 18px 22px 30px rgba(0,0,0,.6)', transform: 'translateZ(-1px)' }}
        />
        <div className="absolute inset-0 grid grid-cols-8 overflow-hidden rounded-[2px]">
          {Array.from({ length: 64 }, (_, i) => (
            <div key={i} style={{ background: (Math.floor(i / 8) + i) % 2 ? '#a8714a' : '#efd9b0' }} />
          ))}
        </div>
        {quan.map(([q, c, r], i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: c * o, top: r * o, width: o, height: o, transformStyle: 'preserve-3d' }}
          >
            <div style={{ position: 'absolute', left: -o * 0.25, bottom: o * 0.35, transformOrigin: '50% 100%', transform: DUNG }}>
              <QuanCoVuaSvg quan={q} kich={o * 1.5} />
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export function MinhHoaCoTuong() {
  const o = 20;
  const quan: [string, boolean, number, number][] = [
    ['將', false, 4, 0], ['車', false, 0, 0], ['馬', false, 1, 0], ['砲', false, 1, 2], ['卒', false, 4, 3],
    ['帥', true, 4, 9], ['俥', true, 8, 9], ['傌', true, 6, 7], ['炮', true, 4, 7], ['兵', true, 2, 5],
  ];
  const W = o * 8, H = o * 9;
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className={NHAC} style={{ perspective: 700 }}>
      <div
        className="relative"
        style={{ width: W, height: H, transform: 'rotateX(55deg) rotateZ(-30deg)', transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute -inset-[14px] rounded-[8px]"
          style={{ background: 'linear-gradient(150deg,#f1d9a6,#d9b073)', boxShadow: '0 0 0 4px #5b3416, 18px 22px 30px rgba(0,0,0,.6)' }}
        />
        <svg width={W} height={H} className="absolute inset-0 overflow-visible">
          <g stroke="#5b3416" strokeWidth="1">
            {Array.from({ length: 10 }, (_, r) => <line key={`h${r}`} x1={0} x2={W} y1={r * o} y2={r * o} />)}
            {Array.from({ length: 9 }, (_, c) =>
              c === 0 || c === 8 ? <line key={`v${c}`} x1={c * o} x2={c * o} y1={0} y2={H} /> : (
                <g key={`v${c}`}>
                  <line x1={c * o} x2={c * o} y1={0} y2={4 * o} />
                  <line x1={c * o} x2={c * o} y1={5 * o} y2={H} />
                </g>
              ),
            )}
            <path d={`M${3 * o} 0 L${5 * o} ${2 * o} M${5 * o} 0 L${3 * o} ${2 * o} M${3 * o} ${7 * o} L${5 * o} ${9 * o} M${5 * o} ${7 * o} L${3 * o} ${9 * o}`} />
          </g>
          <text x={W / 2} y={4.68 * o} textAnchor="middle" fontSize={o * 0.55} fontWeight="700" fill="#7a4a1f" fillOpacity=".6" fontFamily="'Songti SC','Noto Serif SC',serif">{'楚河\u3000\u3000漢界'}</text>
        </svg>
        {quan.map(([chu, doQ, c, r], i) => (
          <div
            key={i}
            className="absolute grid place-items-center rounded-full"
            style={{
              left: c * o - o * 0.45, top: r * o - o * 0.45, width: o * 0.9, height: o * 0.9,
              background: 'radial-gradient(circle at 35% 30%, #fff4dc, #e3bf85 60%, #b98a4c)',
              boxShadow: '0 3px 0 #8a5a2b, 3px 6px 6px rgba(0,0,0,.45)',
              transform: 'translateZ(3px)',
              color: doQ ? '#b91c1c' : '#1c1917',
              fontSize: o * 0.5, fontWeight: 800, fontFamily: '\'Kaiti SC\',\'STKaiti\',\'KaiTi\',\'Songti SC\',serif',
            }}
          >
            <span className="grid h-[80%] w-[80%] place-items-center rounded-full" style={{ border: `1.5px solid ${doQ ? '#b91c1c' : '#1c1917'}` }}>{chu}</span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export function MinhHoaTienLen() {
  const la = ['3S', '7D', 'JC', 'QH', 'KS', 'AD', '2H'];
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden" style={{ perspective: 800 }}>
      <div className="absolute inset-x-6 bottom-[-30%] top-[30%] rounded-[50%]" style={{ background: 'radial-gradient(ellipse at 50% 30%, #1f8a5b, #0b4a30 70%)', transform: 'rotateX(55deg)', boxShadow: '0 0 0 8px #4a2511, 0 30px 50px rgba(0,0,0,.6)' }} />
      <div className={`relative ${NHAC}`} style={{ perspective: 800 }}>
      <div className="relative h-[150px] w-[260px]" style={{ transform: 'rotateX(18deg)' }}>
        {la.map((l, i) => {
          const goc = (i - (la.length - 1) / 2) * 11;
          return (
            <div
              key={l}
              className="absolute bottom-0 left-1/2"
              style={{ marginLeft: -36, transformOrigin: '50% 140%', transform: `rotate(${goc}deg) translateY(${i === 6 ? -14 : 0}px)`, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.45))' }}
            >
              <LaBai la={l} rong={72} />
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

export function MinhHoaCaro() {
  const o = 18, n = 11;
  const dau: [number, number, 'x' | 'o'][] = [
    [3, 3, 'x'], [4, 4, 'x'], [5, 5, 'x'], [6, 6, 'x'], [7, 7, 'x'],
    [4, 3, 'o'], [5, 4, 'o'], [6, 4, 'o'], [3, 5, 'o'], [7, 6, 'o'], [5, 6, 'x'], [6, 5, 'o'],
  ];
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className={NHAC} style={{ perspective: 700 }}>
      <div
        className="relative"
        style={{ width: o * n, height: o * n, transform: 'rotateX(50deg) rotateZ(-24deg)', background: '#fbf8ef', borderRadius: 6, boxShadow: '14px 22px 30px rgba(0,0,0,.55), 0 0 0 1px rgba(0,0,0,.1)' }}
      >
        <svg width={o * n} height={o * n} className="absolute inset-0">
          {Array.from({ length: n + 1 }, (_, i) => (
            <g key={i} stroke="#9bb8dc" strokeWidth="1">
              <line x1={0} x2={o * n} y1={i * o} y2={i * o} />
              <line y1={0} y2={o * n} x1={i * o} x2={i * o} />
            </g>
          ))}
          <line x1={o * 0.4} x2={o * 0.4} y1={0} y2={o * n} stroke="#f87171" strokeOpacity=".5" />
          {dau.map(([x, y, k], i) =>
            k === 'x' ? (
              <path key={i} d={`M${x * o + 4} ${y * o + 4} l${o - 8} ${o - 8} m0 ${-(o - 8)} l${-(o - 8)} ${o - 8}`} stroke="#e11d48" strokeWidth="2.6" strokeLinecap="round" />
            ) : (
              <circle key={i} cx={x * o + o / 2} cy={y * o + o / 2} r={o * 0.3} stroke="#1d4ed8" strokeWidth="2.4" fill="none" />
            ),
          )}
          <line x1={3 * o + o / 2} y1={3 * o + o / 2} x2={7 * o + o / 2} y2={7 * o + o / 2} stroke="#be123c" strokeOpacity=".75" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
      </div>
    </div>
  );
}
