'use client';

/** Vẽ sơ đồ/bản đồ của đề (kiểu `Hinh`) và biểu đồ Writing Task 1 bằng SVG thuần — sắc nét ở mọi cỡ, không thư viện. */
import type { BieuDo, Hinh } from './de/types';


export function HinhSvg({ hinh, nhan }: { hinh: Hinh; nhan?: string }) {
  return (
    <figure style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${hinh.w} ${hinh.h}`} role="img" aria-label={nhan ?? hinh.chuThich ?? 'Hình'} style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
        <defs>
          <marker id="mui-ten" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>
        {hinh.ve.map((v, i) => {
          switch (v.t) {
            case 'rect':
              return (
                <g key={i}>
                  <rect x={v.x} y={v.y} width={v.w} height={v.h} fill={v.nen ?? 'none'} stroke={v.bo === 0 ? 'none' : '#555'} strokeWidth={v.bo ?? 1.2} rx={3} />
                  {v.nhan && <text x={v.x + v.w / 2} y={v.y + v.h / 2 + 4} textAnchor="middle" fontSize={12} fill="#333">{v.nhan}</text>}
                </g>
              );
            case 'circle':
              return (
                <g key={i}>
                  <circle cx={v.x} cy={v.y} r={v.r} fill={v.nen ?? 'none'} stroke="#555" strokeWidth={1} />
                  {v.nhan && <text x={v.x} y={v.y + 4} textAnchor="middle" fontSize={12} fill="#333">{v.nhan}</text>}
                </g>
              );
            case 'line':
              return (
                <polyline key={i} points={v.d.map((p) => p.join(',')).join(' ')} fill="none" stroke={v.mau ?? '#555'} strokeWidth={v.day ?? 1.4}
                  strokeDasharray={v.dut ? '5 4' : undefined} markerEnd={v.mui ? 'url(#mui-ten)' : undefined} style={{ color: v.mau ?? '#555' }} strokeLinecap="round" />
              );
            case 'path':
              return <path key={i} d={v.d} fill={v.nen ?? 'none'} stroke={v.mau ?? '#555'} strokeWidth={v.day ?? 1.4} strokeLinecap="round" />;
            case 'text':
              return (
                <text key={i} x={v.x} y={v.y} fontSize={v.co ?? 13} fontWeight={v.dam ? 700 : 400} fontStyle={v.nghieng ? 'italic' : undefined}
                  textAnchor={v.giua ? 'middle' : 'start'} fill={v.nghieng ? '#555' : '#222'}>{v.s}</text>
              );
            case 'o':
              return (
                <g key={i}>
                  <rect x={v.x - 34} y={v.y - 13} width={68} height={26} rx={3} fill="#fff" stroke="#222" strokeWidth={1.4} />
                  <text x={v.x} y={v.y + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="#222">{v.n}</text>
                </g>
              );
            case 'chu':
              return (
                <g key={i}>
                  <circle cx={v.x} cy={v.y} r={13} fill="#fff" stroke="#222" strokeWidth={1.4} />
                  <text x={v.x} y={v.y + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="#222">{v.k}</text>
                </g>
              );
            default:
              return null;
          }
        })}
      </svg>
      {hinh.chuThich && <figcaption style={{ fontSize: 12, color: 'var(--c-ink-3)', marginTop: 4 }}>{hinh.chuThich}</figcaption>}
    </figure>
  );
}

const MAU_CHUOI = ['#1d4f91', '#2e9e48', '#e8590c', '#7048e8', '#c2255c'];

/** Biểu đồ cột nhóm (Writing Task 1) — nền trắng như giấy thi kể cả khi giao diện tối. */
export function BieuDoSvg({ bd }: { bd: BieuDo }) {
  if (bd.loai === 'bang') {
    return (
      <table style={{ borderCollapse: 'collapse', fontSize: 14 }}>
        <caption style={{ fontWeight: 700, marginBottom: 6 }}>{bd.tieuDe}</caption>
        <thead><tr>{bd.dau.map((x) => <th key={x} style={{ border: '1px solid #bbb', padding: '6px 10px' }}>{x}</th>)}</tr></thead>
        <tbody>{bd.hang.map((h, i) => <tr key={i}>{h.map((x, j) => <td key={j} style={{ border: '1px solid #bbb', padding: '6px 10px' }}>{x}</td>)}</tr>)}</tbody>
      </table>
    );
  }
  const W = 620, H = 330, L = 48, R = 12, T = 34, B = 54;
  const w = W - L - R, h = H - T - B;
  const nNhom = bd.nhom.length, nChuoi = bd.chuoi.length;
  const rongNhom = w / nNhom;
  const rongCot = Math.min(26, (rongNhom - 16) / nChuoi);
  const y = (v: number) => T + h - (v / bd.max) * h;
  const vach: number[] = [];
  for (let v = 0; v <= bd.max; v += bd.buoc) vach.push(v);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={bd.tieuDe} style={{ width: '100%', height: 'auto', background: '#fff', borderRadius: 6, fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={14} fontWeight={700} fill="#222">{bd.tieuDe}</text>
      {vach.map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#e3e3e3" />
          <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize={11} fill="#555">{v}{bd.donVi}</text>
        </g>
      ))}
      <line x1={L} x2={L} y1={T} y2={T + h} stroke="#888" />
      {bd.nhom.map((ten, i) => {
        const x0 = L + i * rongNhom + (rongNhom - rongCot * nChuoi) / 2;
        return (
          <g key={ten}>
            {bd.chuoi.map((c, j) => {
              const v = c.so[i];
              return (
                <g key={c.ten}>
                  <rect x={x0 + j * rongCot} y={y(v)} width={rongCot - 2} height={T + h - y(v)} fill={MAU_CHUOI[j % MAU_CHUOI.length]} />
                  <text x={x0 + j * rongCot + (rongCot - 2) / 2} y={y(v) - 3} textAnchor="middle" fontSize={9.5} fill="#333">{v}</text>
                </g>
              );
            })}
            <text x={L + i * rongNhom + rongNhom / 2} y={T + h + 16} textAnchor="middle" fontSize={12} fill="#222">{ten}</text>
          </g>
        );
      })}
      {bd.chuoi.map((c, j) => (
        <g key={c.ten} transform={`translate(${L + j * 80}, ${H - 18})`}>
          <rect width={12} height={12} y={-10} fill={MAU_CHUOI[j % MAU_CHUOI.length]} />
          <text x={18} fontSize={12} fill="#222">{c.ten}</text>
        </g>
      ))}
    </svg>
  );
}
