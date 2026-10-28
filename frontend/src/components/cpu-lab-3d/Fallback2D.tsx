'use client';
/**
 * Bản 2D (không WebGL / bật "giảm chuyển động"): cùng 8 tầng, cùng lời giải thích, không hoạt cảnh.
 * MiniMap2D — sơ đồ bo mạch phẳng tô sáng một điểm đến; dùng cho <WhereInComputer/> khi không vẽ được 3D.
 */
import { FOCUS, LAYERS, t2, type FocusId, type Lang } from './scene/data';
import s from './cpu3d.module.css';

/* toạ độ trên sơ đồ 320 × 200 */
const BOX: Partial<Record<FocusId, [number, number, number, number]>> = {
  board: [6, 6, 308, 188], cpu: [52, 30, 70, 62], 'cpu.die': [60, 40, 54, 42], 'cpu.core': [62, 42, 16, 16],
  'cpu.fetch': [70, 43, 7, 5], 'cpu.decode': [70, 49, 7, 4], 'cpu.registers': [63, 49, 6, 5], 'cpu.alu': [70, 53, 7, 4], 'cpu.mmu': [70, 57, 7, 2],
  'cpu.l1': [63, 43, 6, 5], 'cpu.l2': [78, 42, 4, 16], 'cpu.l3': [62, 59, 50, 5], 'cpu.imc': [60, 42, 2, 38],
  'bus.memory': [124, 44, 38, 30], ram: [164, 26, 30, 100], 'ram.cells': [176, 60, 8, 10],
  'bus.pcie': [60, 96, 60, 14], ssd: [60, 100, 70, 16], 'ssd.controller': [64, 103, 12, 10], 'ssd.nand': [80, 102, 46, 12],
  gpu: [24, 120, 220, 26], chipset: [226, 150, 36, 30], nic: [28, 12, 16, 12],
};
export function MiniMap2D({ focus, also = [] }: { focus: FocusId; also?: FocusId[] }) {
  const R = (id: FocusId, stroke: string, fill: string, w = 1) => {
    const b = BOX[id];
    return b ? <rect x={b[0]} y={b[1]} width={b[2]} height={b[3]} rx={2} fill={fill} stroke={stroke} strokeWidth={w} /> : null;
  };
  const hl = (id: FocusId, main: boolean) => {
    const b = BOX[id] ?? BOX.board!;
    return <rect key={id} x={b[0] - 3} y={b[1] - 3} width={b[2] + 6} height={b[3] + 6} rx={4} fill={main ? 'rgba(253,230,138,0.18)' : 'rgba(125,211,252,0.12)'} stroke={main ? '#fde68a' : '#7dd3fc'} strokeWidth={main ? 2.2 : 1.4} strokeDasharray={main ? undefined : '4 3'} />;
  };
  return (
    <svg viewBox="0 0 320 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <rect x={0} y={0} width={320} height={200} fill="#060a14" />
      {R('board', '#334155', '#0d1522')}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <line key={i} x1={122} y1={46 + i * 3.6} x2={164} y2={30 + i * 12} stroke="#1e3a5f" strokeWidth={1} />)}
      {R('cpu', '#64748b', '#1f2937')}
      {R('cpu.die', '#7c3aed', '#1e1b4b')}
      {R('cpu.core', '#38bdf8', '#0c4a6e')}
      {R('cpu.l3', '#818cf8', '#312e81')}
      {R('ram', '#4b5563', '#0f2e22')}
      <rect x={168} y={26} width={4} height={100} fill="#14532d" /><rect x={184} y={26} width={4} height={100} fill="#14532d" />
      {R('ssd', '#475569', '#123826')}
      {R('ssd.controller', '#475569', '#111827')}
      {R('ssd.nand', '#475569', '#111827')}
      {R('gpu', '#475569', '#1b1e25')}
      {R('chipset', '#475569', '#1f2937')}
      {R('nic', '#475569', '#111827')}
      <text x={86} y={28} fill="#94a3b8" fontSize={8} textAnchor="middle">CPU</text>
      <text x={179} y={22} fill="#94a3b8" fontSize={8} textAnchor="middle">RAM</text>
      <text x={95} y={124} fill="#94a3b8" fontSize={8} textAnchor="middle">SSD</text>
      <text x={134} y={137} fill="#94a3b8" fontSize={8} textAnchor="middle">GPU</text>
      <text x={244} y={168} fill="#94a3b8" fontSize={8} textAnchor="middle">Chipset</text>
      <text x={36} y={33} fill="#94a3b8" fontSize={7} textAnchor="middle">LAN</text>
      {also.map((a) => hl(a, false))}
      {focus !== 'pc' && hl(focus, true)}
    </svg>
  );
}

export default function Fallback2D({ lang, layer, setLayer, onWant3D }: { lang: Lang; layer: number; setLayer: (n: number) => void; onWant3D: () => void }) {
  const T = (vi: string, en: string) => (lang === 'en' ? en : vi);
  const L = LAYERS[layer]!;
  return (
    <div className={s.flat}>
      <p style={{ color: '#9aa6bb', margin: 0 }}>{T('Bản 2D tĩnh (máy bạn bật “giảm chuyển động” hoặc không có WebGL). Cùng nội dung với bản 3D.', 'Static 2D version (reduced motion is on, or WebGL is unavailable). Same content as the 3D version.')}</p>
      <div className={s.flatStack}>
        {LAYERS.map((x, i) => (
          <button key={x.id} type="button" className={s.flatLayer} aria-current={i === layer ? 'step' : undefined} onClick={() => setLayer(i)}>
            <span className={s.n}>{i + 1}</span>
            <span><strong>{t2(x.title, lang)}</strong>{i === layer && <em>{t2(x.body, lang)}</em>}</span>
            <em>{x.scale}</em>
          </button>
        ))}
      </div>
      {L.focus && L.focus !== 'pc' && (
        <div className={s.mini} style={{ height: 240, maxWidth: 420 }}>
          <MiniMap2D focus={L.focus} />
          <div className={s.miniCap}><b>{t2(FOCUS[L.focus].name, lang)}</b><span>{t2(FOCUS[L.focus].what, lang)}</span></div>
        </div>
      )}
      <div className={s.nav} style={{ maxWidth: 420 }}>
        <button type="button" className={s.btn} disabled={layer === 0} onClick={() => setLayer(layer - 1)}>↑ {T('Ra ngoài', 'Back out')}</button>
        <button type="button" className={`${s.btn} ${s.primary}`} disabled={layer === LAYERS.length - 1} onClick={() => setLayer(layer + 1)}>{T('Đi sâu hơn', 'Go deeper')} ↓</button>
        <button type="button" className={s.btn} onClick={onWant3D}>{T('Xem bản 3D', 'Show 3D')}</button>
      </div>
    </div>
  );
}
