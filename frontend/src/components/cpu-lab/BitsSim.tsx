'use client';
/**
 * Bit & hệ đếm — sân chơi bit: vì sao chỉ có 0 và 1, bấm bit, đổi cơ số từng bước, bù hai & tràn số, dịch bit & mặt nạ.
 * Trả lời đúng câu hỏi "01010101 chỉ có 0 với 1 mà máy hiểu?": một dãy bit KHÔNG tự mang nghĩa — nghĩa là CÁCH ĐỌC.
 */
import { useMemo, useState } from 'react';
import {
  arith, bin, bitAt, bitwise, digitsFromSteps, divisionSteps, group, hex, maxSigned, maxUnsigned, minSigned, negateSteps, oct, parseNumber,
  placeValues, shift, toSigned, toggleBit, voltsToBit, wrap, type BitOp, type ShiftOp, type Width,
} from './engine/bits';
import { Controls, Explain, Seg, css as s, usePlayer } from '../os-lab/ui';
import { BitRow, CpuFrame, ReadItem, asciiName, cc as c, cx, tx, type Lang } from './parts';

type Tab = 'play' | 'intro' | 'convert' | 'signed' | 'ops';

/* ── 1. Vì sao chỉ có 0 và 1 ─────────────────────────────────────────────────────────────── */
function Intro({ lang }: { lang: Lang }) {
  const [v, setV] = useState(3.1);
  const [noise, setNoise] = useState(0.3);
  const [pattern, setPattern] = useState(0b01001101);
  const bit = voltsToBit(v);
  const W = 520, H = 70, x = (volt: number) => 20 + (volt / 3.3) * (W - 40);
  // một "dây" có nhiễu: 24 mẫu dao động quanh v
  const samples = useMemo(() => Array.from({ length: 24 }, (_, k) => Math.max(0, Math.min(3.3, v + noise * Math.sin(k * 2.1) * (k % 3 ? 1 : -0.7)))), [v, noise]);
  const misread = samples.filter((sv) => voltsToBit(sv) !== bit).length;
  return (
    <div className={s.stack}>
      <Explain>
        {tx(lang,
          'A computer is billions of tiny switches (transistors). A wire is either near 0 volts or near the supply voltage — so each wire carries ONE of two states. We write them 0 and 1. Two states are used because they are easy to tell apart even with electrical noise.',
          'Máy tính là hàng tỉ công tắc tí hon (transistor). Một sợi dây hoặc gần 0 volt, hoặc gần điện áp nguồn — nên mỗi sợi dây mang MỘT trong hai trạng thái. Ta viết chúng là 0 và 1. Dùng hai trạng thái vì chúng dễ phân biệt ngay cả khi có nhiễu điện.')}
      </Explain>
      <div className={s.panel}>
        <div className={s.panelTitle}>{tx(lang, '1 · A wire: voltage → bit (3.3 V logic)', '1 · Một sợi dây: điện áp → bit (logic 3,3 V)')}</div>
        <div className={s.bar}>
          <span className={s.lbl}>{tx(lang, 'Voltage', 'Điện áp')} <input type="range" min={0} max={3.3} step={0.05} value={v} onChange={(e) => setV(Number(e.target.value))} /><b className={s.mono}>{v.toFixed(2)} V</b></span>
          <span className={s.lbl}>{tx(lang, 'Noise', 'Nhiễu')} <input type="range" min={0} max={1.2} step={0.05} value={noise} onChange={(e) => setNoise(Number(e.target.value))} /><b className={s.mono}>±{noise.toFixed(2)} V</b></span>
        </div>
        <div className={s.svgWrap}>
          <svg viewBox={`0 0 ${W} ${H + 24}`} width="100%" style={{ maxWidth: W }} role="img" aria-label="voltage bands">
            <rect x={x(0)} y={10} width={x(0.8) - x(0)} height={H - 20} fill="#64748b" opacity={0.25} />
            <rect x={x(0.8)} y={10} width={x(2.0) - x(0.8)} height={H - 20} fill="#dc2626" opacity={0.15} />
            <rect x={x(2.0)} y={10} width={x(3.3) - x(2.0)} height={H - 20} fill="#16a34a" opacity={0.22} />
            <text x={(x(0) + x(0.8)) / 2} y={H + 6} textAnchor="middle" className={s.svgText} fontSize={12} fontWeight={800}>0</text>
            <text x={(x(0.8) + x(2.0)) / 2} y={H + 6} textAnchor="middle" className={s.svgMuted} fontSize={11}>{tx(lang, 'forbidden', 'vùng cấm')}</text>
            <text x={(x(2.0) + x(3.3)) / 2} y={H + 6} textAnchor="middle" className={s.svgText} fontSize={12} fontWeight={800}>1</text>
            {[0, 0.8, 2.0, 3.3].map((t) => <text key={t} x={x(t)} y={H + 20} textAnchor="middle" className={s.svgMuted} fontSize={10}>{t} V</text>)}
            {samples.map((sv, k) => <circle key={k} cx={x(sv)} cy={16 + (k * 37) % (H - 30)} r={3.2} fill={voltsToBit(sv) === bit ? '#2563eb' : '#dc2626'} />)}
            <line x1={x(v)} x2={x(v)} y1={6} y2={H - 6} stroke="#f59e0b" strokeWidth={3} />
          </svg>
        </div>
        <div className={s.small}>
          {bit === null
            ? tx(lang, 'In the forbidden band the circuit cannot decide — designers keep signals out of here.', 'Trong vùng cấm mạch không quyết được — người thiết kế giữ tín hiệu tránh xa vùng này.')
            : tx(lang, `Read as ${bit}. ${misread ? `${misread} of 24 noisy samples crossed into another band.` : 'Every noisy sample still reads the same — that is why two levels are robust.'}`,
              `Đọc là ${bit}. ${misread ? `${misread}/24 mẫu nhiễu lọt sang vùng khác.` : 'Mọi mẫu có nhiễu vẫn đọc ra như nhau — đó là lý do hai mức điện áp bền vững.'}`)}
        </div>
      </div>
      <div className={s.panel}>
        <div className={s.panelTitle}>{tx(lang, '2 · Eight wires = one byte = 256 patterns', '2 · Tám sợi dây = một byte = 256 mẫu')}</div>
        <div className={c.bulbs}>
          {Array.from({ length: 8 }, (_, i) => 7 - i).map((k) => (
            <button type="button" key={k} className={cx(c.bulb, bitAt(pattern, k) && c.on)} onClick={() => setPattern(toggleBit(pattern, k, 8))} aria-pressed={!!bitAt(pattern, k)}>
              <span className={c.lamp} /><b className={s.mono}>{bitAt(pattern, k)}</b><span className={c.lv}>{bitAt(pattern, k) ? '3.3V' : '0V'}</span>
            </button>
          ))}
        </div>
        <p className={s.small} style={{ margin: '8px 0 4px' }}>{tx(lang, 'The SAME 8 bits mean different things depending on who reads them:', 'CÙNG 8 bit này mang nghĩa khác nhau tuỳ AI đọc nó:')}</p>
        <div className={c.read}>
          <ReadItem k={tx(lang, 'bits', 'bit')} v={group(bin(pattern, 8))} />
          <ReadItem k={tx(lang, 'whole number', 'số nguyên không dấu')} v={pattern} />
          <ReadItem k={tx(lang, 'signed number', 'số có dấu')} v={toSigned(pattern, 8)} />
          <ReadItem k={tx(lang, 'ASCII letter', 'chữ ASCII')} v={asciiName(pattern)} />
          <ReadItem k={tx(lang, 'grey pixel', 'điểm ảnh xám')} v={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 22, height: 22, borderRadius: 4, border: '1px solid var(--ol-border)', background: `rgb(${pattern},${pattern},${pattern})` }} />{pattern}/255</span>} />
          <ReadItem k={tx(lang, 'toy-CPU instruction', 'lệnh CPU đồ chơi')} v={['JnS', 'Load', 'Store', 'Add', 'Subt', 'Input', 'Output', 'Halt', 'Skipcond', 'Jump', 'Clear', 'AddI', 'JumpI', 'LoadI', 'StoreI', '???'][pattern >> 4] + ` ${(pattern & 15).toString(16).toUpperCase()}…`} />
        </div>
        <Explain tone="ok">{tx(lang,
          'This is the whole secret: the machine never "understands" 01001101. A circuit adds it, a font draws it as M, a screen lights a pixel with it, a CPU decodes it as an instruction. Meaning comes from the circuit or program that reads the bits.',
          'Đó là toàn bộ bí mật: máy không bao giờ "hiểu" 01001101. Một mạch cộng nó, một font vẽ nó thành chữ M, màn hình thắp điểm ảnh bằng nó, CPU giải mã nó thành lệnh. Nghĩa đến từ mạch hay chương trình ĐỌC dãy bit đó.')}</Explain>
      </div>
    </div>
  );
}

/* ── 2. Bảng bit ─────────────────────────────────────────────────────────────────────────── */
function Play({ lang }: { lang: Lang }) {
  const [w, setW] = useState<Width>(8);
  const [u, setU] = useState(200);
  const [txt, setTxt] = useState('');
  const [last, setLast] = useState<number | null>(null);
  const setWidth = (nw: Width) => { setW(nw); setU((x) => wrap(x, nw)); };
  const typed = parseNumber(txt);
  const apply = () => { if (typed !== null) { setU(wrap(typed, w)); setLast(null); } };
  return (
    <div className={s.stack}>
      <div className={s.bar}>
        <Seg label={tx(lang, 'Width', 'Độ rộng')} value={w} options={[[8, '8 bit'], [16, '16 bit'], [32, '32 bit']]} onChange={setWidth} />
        <span className={s.lbl}>{tx(lang, 'Type a number', 'Gõ một số')}
          <input type="text" value={txt} placeholder="200 · 0xC8 · 0b1100 · -56" style={{ width: 170 }} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') apply(); }} />
          <button type="button" className={s.btn} onClick={apply} disabled={typed === null}>{tx(lang, 'Set', 'Đặt')}</button>
        </span>
      </div>
      <div className={s.panel} style={{ overflowX: 'auto' }}>
        <BitRow value={u} width={w} showWeights onToggle={(k) => { setU(toggleBit(u, k, w)); setLast(k); }} mark={(k) => k === last} />
      </div>
      <div className={s.bar}>
        <button type="button" className={s.btn} onClick={() => setU(0)}>{tx(lang, 'All 0', 'Tất cả 0')}</button>
        <button type="button" className={s.btn} onClick={() => setU(maxUnsigned(w))}>{tx(lang, 'All 1', 'Tất cả 1')}</button>
        <button type="button" className={s.btn} onClick={() => setU(wrap(u + 1, w))}>+1</button>
        <button type="button" className={s.btn} onClick={() => setU(wrap(u - 1, w))}>−1</button>
        <button type="button" className={s.btn} onClick={() => setU(maxUnsigned(w) - u)}>{tx(lang, 'Invert (NOT)', 'Đảo bit (NOT)')}</button>
        <button type="button" className={s.btn} onClick={() => setU(wrap(u * 2, w))}>×2 (&lt;&lt; 1)</button>
        <button type="button" className={s.btn} onClick={() => setU(Math.floor(u / 2))}>÷2 (&gt;&gt; 1)</button>
      </div>
      <div className={c.read}>
        <ReadItem k={tx(lang, 'decimal (unsigned)', 'thập phân (không dấu)')} v={u} />
        <ReadItem k={tx(lang, 'decimal (signed, two\'s compl.)', 'thập phân (có dấu, bù hai)')} v={toSigned(u, w)} />
        <ReadItem k="hex" v={`0x${group(hex(u, w), 4, '_')}`} />
        <ReadItem k={tx(lang, 'octal', 'bát phân')} v={`0o${oct(u, w)}`} />
        <ReadItem k={tx(lang, 'binary', 'nhị phân')} v={<span style={{ fontSize: w > 16 ? 12 : 15 }}>{group(bin(u, w))}</span>} />
        {w === 8 && <ReadItem k="ASCII" v={asciiName(u)} />}
      </div>
      <Explain>
        {last !== null
          ? tx(lang, `Bit ${last} is worth 2^${last} = ${2 ** last}. Turning it ${bitAt(u, last) ? 'on added' : 'off removed'} ${2 ** last}.`, `Bit ${last} có trọng số 2^${last} = ${2 ** last}. Bật nó lên ${bitAt(u, last) ? 'cộng thêm' : 'bớt đi'} ${2 ** last}.`)
          : tx(lang, `Click any bit. ${w} bits give ${maxUnsigned(w) + 1 > 1e6 ? (maxUnsigned(w) + 1).toLocaleString('en') : maxUnsigned(w) + 1} patterns: 0…${maxUnsigned(w).toLocaleString('en')} unsigned, or ${minSigned(w).toLocaleString('en')}…${maxSigned(w).toLocaleString('en')} signed. One hex digit = exactly 4 bits — that is why programmers love hex.`,
            `Bấm bất kỳ bit nào. ${w} bit cho ${(maxUnsigned(w) + 1).toLocaleString('vi')} mẫu: 0…${maxUnsigned(w).toLocaleString('vi')} không dấu, hoặc ${minSigned(w).toLocaleString('vi')}…${maxSigned(w).toLocaleString('vi')} có dấu. Một chữ số hex = đúng 4 bit — vì thế lập trình viên mê hex.`)}
      </Explain>
    </div>
  );
}

/* ── 3. Đổi cơ số từng bước ──────────────────────────────────────────────────────────────── */
function Convert({ lang }: { lang: Lang }) {
  const [n, setN] = useState(200);
  const [base, setBase] = useState(2);
  const steps = useMemo(() => divisionSteps(n, base), [n, base]);
  const result = digitsFromSteps(steps);
  const places = placeValues(result, base);
  // bước: 0..steps.length = chia dần; steps.length+1 = đọc ngược; +2 = kiểm lại bằng trọng số
  const p = usePlayer(steps.length + 3, 1100);
  const shown = Math.min(p.i, steps.length);
  const sub = (k: number) => String(k).split('').map((d) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]).join('');
  return (
    <div className={s.stack}>
      <div className={s.bar}>
        <span className={s.lbl}>{tx(lang, 'Decimal number', 'Số thập phân')}
          <input type="number" min={0} max={65535} value={n} style={{ width: 90 }} onChange={(e) => { setN(Math.max(0, Math.min(65535, Math.trunc(Number(e.target.value) || 0)))); p.reset(); }} /></span>
        <Seg label={tx(lang, 'to base', 'sang cơ số')} value={base} options={[[2, '2'], [8, '8'], [16, '16']]} onChange={(b) => { setBase(b); p.reset(); }} />
      </div>
      <Controls p={p} lang={lang} />
      <Explain tone={p.i >= steps.length + 1 ? 'ok' : undefined}>
        {p.i === 0 && tx(lang, `Repeated division: divide by ${base}, write down the remainder, continue with the quotient until it reaches 0.`, `Chia liên tiếp: chia cho ${base}, ghi lại số dư, tiếp tục với thương cho tới khi thương bằng 0.`)}
        {p.i > 0 && p.i <= steps.length && (() => { const st = steps[p.i - 1]; return tx(lang, `${st.n} ÷ ${base} = ${st.q}, remainder ${st.r}${base === 16 && st.r > 9 ? ` (= ${'0123456789ABCDEF'[st.r]})` : ''}.`, `${st.n} ÷ ${base} = ${st.q}, dư ${st.r}${base === 16 && st.r > 9 ? ` (= ${'0123456789ABCDEF'[st.r]})` : ''}.`); })()}
        {p.i === steps.length + 1 && tx(lang, `Read the remainders from the BOTTOM up: ${n} = ${result}${sub(base)}. The first remainder is the lowest digit.`, `Đọc số dư từ DƯỚI lên: ${n} = ${result}${sub(base)}. Số dư đầu tiên là chữ số thấp nhất.`)}
        {p.i === steps.length + 2 && tx(lang, `Check by place values: each digit × ${base}^position, added up = ${places.reduce((a, t) => a + t.value, 0)}.`, `Kiểm lại bằng trọng số: mỗi chữ số × ${base}^vị trí, cộng lại = ${places.reduce((a, t) => a + t.value, 0)}.`)}
      </Explain>
      <div className={s.grid2}>
        <div className={s.panel}>
          <div className={s.panelTitle}>{tx(lang, 'Repeated division', 'Chia liên tiếp')}</div>
          <table className={cx(s.tbl, s.compact)}>
            <thead><tr><th className={s.num}>{tx(lang, 'number', 'số')}</th><th className={s.num}>÷ {base}</th><th className={s.num}>{tx(lang, 'quotient', 'thương')}</th><th className={s.num}>{tx(lang, 'remainder', 'dư')}</th></tr></thead>
            <tbody>{steps.slice(0, shown).map((st, k) => (
              <tr key={k} className={k === p.i - 1 ? s.hl : undefined}><td className={cx(s.num, s.mono)}>{st.n}</td><td className={s.num}>{base}</td><td className={cx(s.num, s.mono)}>{st.q}</td><td className={cx(s.num, s.mono)} style={{ fontWeight: 800, color: 'var(--ol-accent)' }}>{'0123456789ABCDEF'[st.r]}</td></tr>
            ))}</tbody>
          </table>
          {p.i > steps.length && <div className={s.mono} style={{ marginTop: 6, fontWeight: 800 }}>↑ {tx(lang, 'read upward', 'đọc ngược lên')}: {result}{sub(base)}</div>}
        </div>
        <div className={s.panel}>
          <div className={s.panelTitle}>{tx(lang, 'Place values (back to decimal)', 'Trọng số (đổi ngược về thập phân)')}</div>
          {p.i >= steps.length + 2 ? (
            <div className={s.mono} style={{ lineHeight: 1.9 }}>
              {places.map((t, k) => (
                <div key={k}>{'0123456789ABCDEF'[t.digit]} × {base}<sup>{t.power}</sup> = {t.digit} × {t.weight} = <b>{t.value}</b></div>
              ))}
              <div style={{ borderTop: '2px solid var(--ol-text)', marginTop: 4, fontWeight: 800 }}>Σ = {places.reduce((a, t) => a + t.value, 0)}</div>
            </div>
          ) : <div className={s.empty}>{tx(lang, 'Finish the division first (press Play).', 'Chia xong trước đã (bấm Chạy).')}</div>}
          <div className={s.small} style={{ marginTop: 8 }}>{tx(lang, 'Shortcut binary ↔ hex: group bits by 4 from the right.', 'Mẹo nhị phân ↔ hex: nhóm 4 bit từ phải sang.')} {group(bin(n, Math.max(4, Math.ceil(bin(n, 1).length / 4) * 4)))} = 0x{hex(n, 4)}</div>
        </div>
      </div>
    </div>
  );
}

/* ── 4. Số có dấu & tràn số ──────────────────────────────────────────────────────────────── */
function Wheel({ lang, a, r, op }: { lang: Lang; a: number; r: number; op: '+' | '-' }) {
  const R = 92, cx0 = 120, cy0 = 120;
  const pos = (k: number, rad: number) => { const t = (k / 16) * 2 * Math.PI - Math.PI / 2; return [cx0 + rad * Math.cos(t), cy0 + rad * Math.sin(t)]; };
  return (
    <svg viewBox="0 0 240 240" width="100%" style={{ maxWidth: 260 }} role="img" aria-label={tx(lang, '4-bit number wheel', 'Vòng số 4 bit')}>
      <circle cx={cx0} cy={cy0} r={R} fill="none" className={s.svgBorder} strokeWidth={14} opacity={0.6} />
      {/* ranh giới tràn: có dấu giữa 0111|1000, không dấu giữa 1111|0000 */}
      {[[7.5, '#dc2626'], [15.5, '#d97706']].map(([k, col]) => { const [x1, y1] = pos(k as number, R - 14); const [x2, y2] = pos(k as number, R + 14); return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={col as string} strokeWidth={4} />; })}
      {Array.from({ length: 16 }, (_, k) => {
        const [x, y] = pos(k, R); const [xo, yo] = pos(k, R + 24); const [xi, yi] = pos(k, R - 26);
        const isA = k === a, isR = k === r;
        return (
          <g key={k}>
            <circle cx={x} cy={y} r={11} fill={isR ? '#059669' : isA ? '#2563eb' : 'var(--ol-bg)'} stroke="var(--ol-border)" />
            <text x={x} y={y + 3.5} textAnchor="middle" fontSize={8.5} fontWeight={800} fill={isA || isR ? '#fff' : 'var(--ol-text)'} style={{ fontFamily: 'monospace' }}>{bin(k, 4)}</text>
            <text x={xo} y={yo + 4} textAnchor="middle" fontSize={10} className={s.svgMuted}>{k}</text>
            <text x={xi} y={yi + 4} textAnchor="middle" fontSize={11} fontWeight={800} fill={k >= 8 ? '#dc2626' : 'var(--ol-text)'}>{k >= 8 ? k - 16 : k}</text>
          </g>
        );
      })}
      <text x={cx0} y={cy0 - 6} textAnchor="middle" fontSize={10.5} className={s.svgMuted}>{tx(lang, 'outer: unsigned', 'ngoài: không dấu')}</text>
      <text x={cx0} y={cy0 + 8} textAnchor="middle" fontSize={10.5} className={s.svgMuted}>{tx(lang, 'inner: signed', 'trong: có dấu')}</text>
      <text x={cx0} y={cy0 + 24} textAnchor="middle" fontSize={11} fontWeight={800} fill="#059669">{op === '+' ? '↻' : '↺'}</text>
    </svg>
  );
}

function Signed({ lang }: { lang: Lang }) {
  const [w, setW] = useState<Width>(8);
  const [a, setA] = useState(100);
  const [b, setB] = useState(50);
  const [op, setOp] = useState<'+' | '-'>('+');
  const ua = wrap(a, w), ub = wrap(b, w);
  const r = arith(ua, ub, op, w);
  const neg = negateSteps(ub, w);
  const setWidth = (nw: Width) => { setW(nw); if (nw === 4) { setA(5); setB(4); } else if (w === 4) { setA(100); setB(50); } };
  const lim = (v: number) => Math.max(minSigned(w), Math.min(maxUnsigned(w), v));
  const cols = w;
  const cell = (u: number, k: number) => bitAt(u, k);
  return (
    <div className={s.stack}>
      <div className={s.bar}>
        <Seg label={tx(lang, 'Width', 'Độ rộng')} value={w} options={[[4, '4 bit'], [8, '8 bit'], [16, '16 bit']]} onChange={setWidth} />
        <span className={s.lbl}>A <input type="number" value={a} style={{ width: 80 }} onChange={(e) => setA(lim(Math.trunc(Number(e.target.value) || 0)))} /></span>
        <Seg value={op} options={[['+', '+'], ['-', '−']]} onChange={setOp} />
        <span className={s.lbl}>B <input type="number" value={b} style={{ width: 80 }} onChange={(e) => setB(lim(Math.trunc(Number(e.target.value) || 0)))} /></span>
        <span className={s.small}>{tx(lang, `range: ${minSigned(w)}…${maxSigned(w)} signed · 0…${maxUnsigned(w)} unsigned`, `phạm vi: ${minSigned(w)}…${maxSigned(w)} có dấu · 0…${maxUnsigned(w)} không dấu`)}</span>
      </div>
      <div className={s.bar}>
        {[[127, 1, '+'], [-128, 1, '-'], [100, 50, '+'], [200, 100, '+'], [5, 9, '-']].map(([x, y, o]) => (
          <button type="button" key={`${x}${o}${y}`} className={s.btn} onClick={() => { setW(8); setA(x as number); setB(y as number); setOp(o as '+' | '-'); }}>{`${x} ${o === '+' ? '+' : '−'} ${y}`}</button>
        ))}
      </div>
      <div className={s.grid2}>
        <div className={s.panel} style={{ overflowX: 'auto' }}>
          <div className={s.panelTitle}>{tx(lang, 'Column addition, exactly like the ALU', 'Cộng theo cột, đúng như ALU')}</div>
          <table className={c.colTable}>
            <tbody>
              <tr className={c.carryRow}><td /><td>{r.carryOut}</td>{Array.from({ length: cols }, (_, i) => cols - 1 - i).map((k) => <td key={k}>{k === 0 && op === '+' ? '' : r.carries[k] ? r.carries[k] : ''}</td>)}<td style={{ textAlign: 'left', paddingLeft: 14, whiteSpace: 'nowrap' }}>{tx(lang, 'carries', 'nhớ')}</td></tr>
              <tr><td /><td />{Array.from({ length: cols }, (_, i) => cols - 1 - i).map((k) => <td key={k}>{cell(ua, k)}</td>)}<td style={{ textAlign: 'left', paddingLeft: 14, whiteSpace: 'nowrap' }}>A = {toSigned(ua, w)} / {ua}</td></tr>
              <tr><td>{op === '+' ? '+' : '+'}</td><td />{Array.from({ length: cols }, (_, i) => cols - 1 - i).map((k) => <td key={k}>{op === '+' ? cell(ub, k) : cell(neg.inverted, k)}</td>)}<td style={{ textAlign: 'left', paddingLeft: 14, whiteSpace: 'nowrap' }}>{op === '+' ? `B = ${toSigned(ub, w)} / ${ub}` : tx(lang, `NOT B (+1 as carry-in)`, `NOT B (+1 bằng nhớ vào)`)}</td></tr>
              <tr className={c.resRow}><td>=</td><td style={{ color: 'var(--ol-warn)' }}>{r.carryOut}</td>{Array.from({ length: cols }, (_, i) => cols - 1 - i).map((k) => <td key={k}>{cell(r.result, k)}</td>)}<td style={{ textAlign: 'left', paddingLeft: 14, whiteSpace: 'nowrap' }}>= {toSigned(r.result, w)} / {r.result}</td></tr>
            </tbody>
          </table>
          {op === '-' && <div className={s.small} style={{ marginTop: 6 }}>{tx(lang, `Subtraction = addition of the two's complement: −B = NOT B + 1 = ${group(bin(neg.inverted, w))} + 1 = ${group(bin(neg.plusOne, w))}. The CPU has no separate subtractor.`, `Phép trừ = cộng với bù hai: −B = NOT B + 1 = ${group(bin(neg.inverted, w))} + 1 = ${group(bin(neg.plusOne, w))}. CPU không cần mạch trừ riêng.`)}</div>}
          <div className={s.bar} style={{ marginTop: 8 }}>
            <span className={cx(c.flag, r.carryOut && c.set)}>C={r.carryOut}</span>
            <span className={cx(c.flag, r.signedOverflow && c.bad)}>V={r.signedOverflow ? 1 : 0}</span>
            <span className={cx(c.flag, bitAt(r.result, w - 1) && c.set)}>N={bitAt(r.result, w - 1)}</span>
            <span className={cx(c.flag, r.result === 0 && c.set)}>Z={r.result === 0 ? 1 : 0}</span>
          </div>
        </div>
        <div className={s.panel}>
          <div className={s.panelTitle}>{w === 4 ? tx(lang, 'The 4-bit number wheel', 'Vòng số 4 bit') : tx(lang, 'Two readings of the same bits', 'Hai cách đọc cùng dãy bit')}</div>
          {w === 4 ? <Wheel lang={lang} a={ua} r={r.result} op={op} /> : (
            <div className={s.stack} style={{ gap: 6 }}>
              <BitRow value={r.result} width={w} showWeights="signed" signBit small />
              <div className={s.small}>{tx(lang, `Signed reading: the top bit is worth −${2 ** (w - 1)} instead of +${2 ** (w - 1)}. So ${group(bin(r.result, w))} = ${toSigned(r.result, w)} signed, ${r.result} unsigned.`, `Đọc có dấu: bit cao nhất có trọng số −${2 ** (w - 1)} thay vì +${2 ** (w - 1)}. Nên ${group(bin(r.result, w))} = ${toSigned(r.result, w)} có dấu, ${r.result} không dấu.`)}</div>
            </div>
          )}
        </div>
      </div>
      <Explain tone={r.signedOverflow || r.unsignedOverflow ? 'bad' : 'ok'}>
        {r.signedOverflow && tx(lang, `Signed OVERFLOW (V = 1): ${toSigned(ua, w)} ${op === '+' ? '+' : '−'} ${toSigned(ub, w)} should be ${op === '+' ? toSigned(ua, w) + toSigned(ub, w) : toSigned(ua, w) - toSigned(ub, w)}, which does not fit in ${w} bits, so the bits wrap around to ${toSigned(r.result, w)}. In C this is undefined behaviour for int; in Java it silently wraps. `,
          `TRÀN SỐ có dấu (V = 1): ${toSigned(ua, w)} ${op === '+' ? '+' : '−'} ${toSigned(ub, w)} lẽ ra bằng ${op === '+' ? toSigned(ua, w) + toSigned(ub, w) : toSigned(ua, w) - toSigned(ub, w)}, không vừa ${w} bit, nên dãy bit quay vòng thành ${toSigned(r.result, w)}. Trong C đây là hành vi không xác định với int; trong Java nó lặng lẽ quay vòng. `)}
        {r.unsignedOverflow && tx(lang, `Unsigned overflow (${op === '+' ? 'carry out C = 1' : 'borrow: C = 0'}): as whole numbers ${ua} ${op === '+' ? '+' : '−'} ${ub} is outside 0…${maxUnsigned(w)}. `, `Tràn không dấu (${op === '+' ? 'nhớ ra C = 1' : 'mượn: C = 0'}): coi là số không âm thì ${ua} ${op === '+' ? '+' : '−'} ${ub} nằm ngoài 0…${maxUnsigned(w)}. `)}
        {!r.signedOverflow && !r.unsignedOverflow && tx(lang, 'No overflow in either reading. The SAME adder circuit served both signed and unsigned numbers — that is the beauty of two\'s complement.', 'Không tràn theo cách đọc nào. CÙNG một mạch cộng phục vụ cả số có dấu lẫn không dấu — đó là cái hay của bù hai.')}
      </Explain>
    </div>
  );
}

/* ── 5. Dịch bit & mặt nạ ───────────────────────────────────────────────────────────────── */
const MASKS: Array<{ en: string; vi: string; a: number; b: number; op: BitOp | ShiftOp; n?: number }> = [
  { en: 'keep the low 4 bits: AND 0x0F', vi: 'giữ 4 bit thấp: AND 0x0F', a: 0xb7, b: 0x0f, op: 'and' },
  { en: 'turn bit 3 on: OR 0x08', vi: 'bật bit 3: OR 0x08', a: 0x41, b: 0x08, op: 'or' },
  { en: 'flip case of a letter: XOR 0x20', vi: 'đổi hoa/thường: XOR 0x20', a: 0x61, b: 0x20, op: 'xor' },
  { en: 'is it odd? AND 1', vi: 'có lẻ không? AND 1', a: 0x2b, b: 0x01, op: 'and' },
  { en: 'x × 4 = shift left 2', vi: 'x × 4 = dịch trái 2', a: 13, b: 0, op: 'shl', n: 2 },
  { en: '−20 ÷ 4 = arithmetic shift right 2', vi: '−20 ÷ 4 = dịch phải số học 2', a: 0xec, b: 0, op: 'sar', n: 2 },
];
function Ops({ lang }: { lang: Lang }) {
  const w: Width = 8;
  const [a, setA] = useState(0xb7);
  const [b, setB] = useState(0x0f);
  const [op, setOp] = useState<BitOp | ShiftOp>('and');
  const [n, setN] = useState(1);
  const isShift = ['shl', 'shr', 'sar', 'rol', 'ror'].includes(op);
  const res = isShift ? shift(a, n, op as ShiftOp, w) : { value: bitwise(a, b, op as BitOp, w), out: [] as number[] };
  const NAME: Record<string, [string, string]> = {
    and: ['AND: 1 only where BOTH are 1 — used to KEEP chosen bits (mask) and clear the rest.', 'AND: chỉ ra 1 khi CẢ HAI là 1 — dùng để GIỮ các bit chọn (mặt nạ) và xoá phần còn lại.'],
    or: ['OR: 1 where EITHER is 1 — used to SET bits.', 'OR: ra 1 khi MỘT TRONG HAI là 1 — dùng để BẬT bit.'],
    xor: ['XOR: 1 where they DIFFER — used to TOGGLE bits (and in every cipher).', 'XOR: ra 1 khi hai bit KHÁC nhau — dùng để LẬT bit (và có trong mọi thuật toán mã hoá).'],
    not: ['NOT: flip every bit.', 'NOT: lật mọi bit.'],
    shl: ['Shift left: every bit moves up, 0 enters on the right — multiplies by 2 per step (bits falling off the top are lost).', 'Dịch trái: mọi bit lên một bậc, 0 vào bên phải — nhân 2 mỗi bước (bit rơi khỏi đầu trái là mất).'],
    shr: ['Logical shift right: 0 enters on the left — divides an UNSIGNED number by 2.', 'Dịch phải logic: 0 vào bên trái — chia số KHÔNG DẤU cho 2.'],
    sar: ['Arithmetic shift right: the sign bit is copied in — divides a SIGNED number by 2 (rounding down).', 'Dịch phải số học: chép bit dấu vào — chia số CÓ DẤU cho 2 (làm tròn xuống).'],
    rol: ['Rotate left: the bit leaving on the left comes back on the right. Used in hash functions.', 'Xoay trái: bit rời bên trái quay lại bên phải. Dùng trong hàm băm.'],
    ror: ['Rotate right.', 'Xoay phải.'],
  };
  return (
    <div className={s.stack}>
      <div className={s.bar}>
        <span className={s.lbl}>{tx(lang, 'Examples', 'Ví dụ')}
          <select onChange={(e) => { const m = MASKS[Number(e.target.value)]; if (!m) return; setA(m.a); setB(m.b); setOp(m.op); if (m.n) setN(m.n); }} defaultValue="">
            <option value="" disabled>—</option>
            {MASKS.map((m, k) => <option key={k} value={k}>{tx(lang, m.en, m.vi)}</option>)}
          </select></span>
        <Seg value={op} options={[['and', 'AND'], ['or', 'OR'], ['xor', 'XOR'], ['not', 'NOT'], ['shl', '<<'], ['shr', '>>'], ['sar', 'SAR'], ['rol', 'ROL'], ['ror', 'ROR']]} onChange={setOp} />
        {isShift && <span className={s.lbl}>n <input type="number" min={0} max={8} value={n} onChange={(e) => setN(Math.max(0, Math.min(8, Number(e.target.value) || 0)))} /></span>}
      </div>
      <div className={s.panel} style={{ overflowX: 'auto' }}>
        <div className={s.stack} style={{ gap: 8 }}>
          <BitRow label={`A = ${a} = 0x${hex(a, 8)}${op === 'sar' ? ` (${toSigned(a, 8)})` : ''}`} value={a} width={8} onToggle={(k) => setA(toggleBit(a, k, w))} small />
          {!isShift && op !== 'not' && <BitRow label={`B (${tx(lang, 'mask', 'mặt nạ')}) = 0x${hex(b, 8)}`} value={b} width={8} onToggle={(k) => setB(toggleBit(b, k, w))} small />}
          <BitRow label={`${tx(lang, 'result', 'kết quả')} = ${res.value} = 0x${hex(res.value, 8)}${op === 'sar' ? ` (${toSigned(res.value, 8)})` : ''}${op === 'xor' && a >= 65 && a <= 122 ? ` = '${String.fromCharCode(res.value)}'` : ''}`} value={res.value} width={8} small mark={(k) => bitAt(res.value, k) !== bitAt(a, k)} />
        </div>
        {isShift && res.out.length > 0 && op !== 'rol' && op !== 'ror' && <div className={s.small} style={{ marginTop: 6 }}>{tx(lang, 'bits that fell off', 'bit rơi ra ngoài')}: {res.out.join(' ')}</div>}
      </div>
      <Explain>{tx(lang, NAME[op][0], NAME[op][1])} {tx(lang, 'Orange outline = bits that changed from A.', 'Viền cam = bit khác so với A.')}</Explain>
    </div>
  );
}

export default function BitsSim({ lang = 'vi', preset }: { lang?: Lang; preset?: string }) {
  const [tab, setTab] = useState<Tab>((['play', 'intro', 'convert', 'signed', 'ops'] as Tab[]).includes(preset as Tab) ? (preset as Tab) : 'play');
  const TABS: Array<[Tab, string, string]> = [
    ['intro', 'Why only 0 and 1?', 'Vì sao chỉ 0 và 1?'], ['play', 'Bit board', 'Bảng bit'], ['convert', 'Convert step by step', 'Đổi cơ số từng bước'],
    ['signed', 'Negative numbers & overflow', 'Số âm & tràn số'], ['ops', 'Shifts & masks', 'Dịch bit & mặt nạ'],
  ];
  return (
    <CpuFrame lang={lang} title={tx(lang, 'Bits & number systems', 'Bit & hệ đếm')} sub={tx(lang, 'Everything in a computer is a pattern of 0s and 1s', 'Mọi thứ trong máy tính là một dãy 0 và 1')}>
      <div className={s.tabs} role="tablist">
        {TABS.map(([k, en, vi]) => <button type="button" role="tab" aria-selected={tab === k} key={k} className={cx(s.tab, tab === k && s.on)} onClick={() => setTab(k)}>{tx(lang, en, vi)}</button>)}
      </div>
      {tab === 'intro' && <Intro lang={lang} />}
      {tab === 'play' && <Play lang={lang} />}
      {tab === 'convert' && <Convert lang={lang} />}
      {tab === 'signed' && <Signed lang={lang} />}
      {tab === 'ops' && <Ops lang={lang} />}
    </CpuFrame>
  );
}
