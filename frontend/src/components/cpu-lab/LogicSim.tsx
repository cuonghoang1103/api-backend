'use client';
/** Cổng logic → mạch: cổng & bảng chân trị, half/full adder, bộ cộng nối tiếp nhớ 8 bit, mux/giải mã, thanh ghi theo đồng hồ, mọi thứ từ NAND. */
import { useMemo, useState, type ReactNode } from 'react';
import {
  GATES, NAND_BUILD, arity, decoder, fromBits, fullAdder, gate, halfAdder, mux, registerTimeline, rippleAdd, toBits, truthTable,
  type Bit, type Gate, type RegEvent,
} from './engine/logic';
import { Controls, Explain, Seg, css as s, usePlayer } from '../os-lab/ui';
import { BitRow, CpuFrame, cc as c, cx, tx, type Lang } from './parts';
import { toggleBit } from './engine/bits';

type Tab = 'gates' | 'adder' | 'ripple' | 'mux' | 'register' | 'nand';
const wc = (v: number | null) => (v ? c.wire1 : c.wire0);

/** Ký hiệu cổng (chuẩn ANSI) đặt ở (x, y), rộng w cao h. */
function GateShape({ g, x, y, w = 56, h = 40 }: { g: Gate | 'BUF'; x: number; y: number; w?: number; h?: number }) {
  const bubble = g === 'NAND' || g === 'NOR' || g === 'XNOR' || g === 'NOT';
  const base = g.replace(/^N(?!OT)/, '').replace('XNOR', 'XOR');
  let d: string;
  if (g === 'NOT' || g === 'BUF') d = `M ${x} ${y} L ${x + w * 0.8} ${y + h / 2} L ${x} ${y + h} Z`;
  else if (base === 'AND') d = `M ${x} ${y} h ${w * 0.5} a ${h / 2} ${h / 2} 0 0 1 0 ${h} h ${-w * 0.5} Z`;
  else d = `M ${x} ${y} Q ${x + w * 0.3} ${y + h / 2} ${x} ${y + h} Q ${x + w * 0.72} ${y + h} ${x + w} ${y + h / 2} Q ${x + w * 0.72} ${y} ${x} ${y} Z`;
  const ex = g === 'NOT' ? x + w * 0.8 : base === 'AND' ? x + w * 0.5 + h / 2 : x + w;
  return (
    <g>
      {(g === 'XOR' || g === 'XNOR') && <path d={`M ${x - 7} ${y} Q ${x + w * 0.3 - 7} ${y + h / 2} ${x - 7} ${y + h}`} fill="none" stroke="var(--ol-text)" strokeWidth={2} />}
      <path d={d} className={c.body} strokeWidth={2} />
      {bubble && <circle cx={ex + 5} cy={y + h / 2} r={5} className={c.body} strokeWidth={2} />}
      <text x={x + (g === 'NOT' ? w * 0.3 : w * 0.42)} y={y + h / 2 + 4} textAnchor="middle" fontSize={10} fontWeight={800}>{g}</text>
    </g>
  );
}
/** đầu ra của ký hiệu (để nối dây) */
const outX = (g: Gate, x: number, w = 56, h = 40) => (g === 'NOT' ? x + w * 0.8 + 10 : /AND/.test(g) ? x + w * 0.5 + h / 2 + (g === 'NAND' ? 10 : 0) : x + w + (/^N|XNOR/.test(g) ? 10 : 0));

function InBtn({ v, on, label }: { v: Bit; on: () => void; label: string }) {
  return <button type="button" className={cx(c.inBtn, v && c.on)} onClick={on} aria-pressed={!!v}>{label}={v}</button>;
}

/* ── Cổng ────────────────────────────────────────────────────────────────────────────────── */
function Gates({ lang }: { lang: Lang }) {
  const [g, setG] = useState<Gate>('AND');
  const [a, setA] = useState<Bit>(1);
  const [b, setB] = useState<Bit>(0);
  const out = gate(g, a, b);
  const one = arity(g) === 1;
  const ox = outX(g, 110);
  const DESC: Record<Gate, [string, string]> = {
    AND: ['1 only if A AND B are 1 — two switches in series.', 'Ra 1 chỉ khi A VÀ B đều 1 — hai công tắc mắc nối tiếp.'],
    OR: ['1 if A OR B (or both) is 1 — two switches in parallel.', 'Ra 1 nếu A HOẶC B (hoặc cả hai) là 1 — hai công tắc mắc song song.'],
    NOT: ['Flips the input. One transistor pair.', 'Đảo đầu vào. Một cặp transistor.'],
    NAND: ['NOT AND: 0 only when both are 1. The cheapest gate in CMOS (4 transistors) — and it can build every other gate.', 'NOT AND: ra 0 chỉ khi cả hai là 1. Cổng rẻ nhất trong CMOS (4 transistor) — và dựng được mọi cổng khác.'],
    NOR: ['NOT OR: 1 only when both are 0. Also universal.', 'NOT OR: ra 1 chỉ khi cả hai là 0. Cũng vạn năng.'],
    XOR: ['1 when the inputs DIFFER. It is the sum bit of binary addition: 1 + 1 = 0 carry 1.', 'Ra 1 khi hai đầu vào KHÁC nhau. Chính là bit tổng của phép cộng nhị phân: 1 + 1 = 0 nhớ 1.'],
    XNOR: ['1 when the inputs are EQUAL — a 1-bit comparator.', 'Ra 1 khi hai đầu vào BẰNG nhau — bộ so sánh 1 bit.'],
  };
  return (
    <div className={s.stack}>
      <div className={s.bar}>
        <Seg value={g} options={GATES.map((x) => [x, x] as [Gate, string])} onChange={setG} />
      </div>
      <div className={s.grid2}>
        <div className={s.panel}>
          <div className={s.bar}><InBtn v={a} on={() => setA((1 - a) as Bit)} label="A" />{!one && <InBtn v={b} on={() => setB((1 - b) as Bit)} label="B" />}
            <span className={s.lbl}>{tx(lang, 'output', 'đầu ra')} <span className={cx(c.lamp, out && c.on)} /> <b className={s.mono}>{out}</b></span></div>
          <svg className={c.gateSvg} viewBox="0 0 260 110" width="100%" style={{ maxWidth: 320 }} role="img" aria-label={g}>
            <line x1={10} y1={one ? 55 : 45} x2={110} y2={one ? 55 : 45} className={wc(a)} strokeWidth={4} />
            {!one && <line x1={10} y1={65} x2={110} y2={65} className={wc(b)} strokeWidth={4} />}
            <text x={8} y={one ? 50 : 40} fontSize={11} fontWeight={800}>A</text>
            {!one && <text x={8} y={78} fontSize={11} fontWeight={800}>B</text>}
            <GateShape g={g} x={110} y={35} />
            <line x1={ox} y1={55} x2={240} y2={55} className={wc(out)} strokeWidth={4} />
            <circle cx={244} cy={55} r={8} fill={out ? '#facc15' : '#64748b'} />
          </svg>
        </div>
        <div className={s.panel}>
          <div className={s.panelTitle}>{tx(lang, 'Truth table', 'Bảng chân trị')}</div>
          <table className={cx(s.tbl, s.compact)} style={{ maxWidth: 220 }}>
            <thead><tr><th>A</th>{!one && <th>B</th>}<th>{g}</th></tr></thead>
            <tbody>{truthTable(g).map((r, k) => (
              <tr key={k} className={(one ? r[0] === a : r[0] === a && r[1] === b) ? s.hl : undefined}>{r.map((v, i) => <td key={i} className={s.mono} style={i === r.length - 1 ? { fontWeight: 800 } : undefined}>{v}</td>)}</tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <Explain>{tx(lang, DESC[g][0], DESC[g][1])}</Explain>
    </div>
  );
}

/* ── Half / full adder ───────────────────────────────────────────────────────────────────── */
function Adder({ lang }: { lang: Lang }) {
  const [full, setFull] = useState(true);
  const [a, setA] = useState<Bit>(1);
  const [b, setB] = useState<Bit>(1);
  const [ci, setCi] = useState<Bit>(1);
  const f = fullAdder(a, b, full ? ci : 0);
  const h = halfAdder(a, b);
  const sum = full ? f.s : h.s, carry = full ? f.cout : h.c;
  const L = (x1: number, y1: number, x2: number, y2: number, v: number) => <line x1={x1} y1={y1} x2={x2} y2={y2} className={wc(v)} strokeWidth={3.5} strokeLinecap="round" />;
  return (
    <div className={s.stack}>
      <div className={s.bar}>
        <Seg value={full ? 'full' : 'half'} options={[['half', 'Half adder'], ['full', 'Full adder']]} onChange={(v) => setFull(v === 'full')} />
        <InBtn v={a} on={() => setA((1 - a) as Bit)} label="A" />
        <InBtn v={b} on={() => setB((1 - b) as Bit)} label="B" />
        {full && <InBtn v={ci} on={() => setCi((1 - ci) as Bit)} label="Cin" />}
        <span className={s.lbl}>S <span className={cx(c.lamp, sum && c.on)} /> C{full ? 'out' : ''} <span className={cx(c.lamp, carry && c.on)} /></span>
      </div>
      <div className={s.panel} style={{ overflowX: 'auto' }}>
        <svg className={c.gateSvg} viewBox="0 0 560 230" width="100%" style={{ minWidth: 420, maxWidth: 620 }} role="img" aria-label="adder">
          <text x={6} y={44} fontSize={12} fontWeight={800}>A</text><text x={6} y={84} fontSize={12} fontWeight={800}>B</text>
          {full && <text x={6} y={194} fontSize={12} fontWeight={800}>Cin</text>}
          {/* A, B → XOR1 (y 30-70) và AND1 (y 120-160) */}
          {L(20, 40, 120, 40, a)}{L(20, 80, 120, 80, b)}
          {L(60, 40, 60, 130, a)}{L(80, 80, 80, 150, b)}{L(60, 130, 120, 130, a)}{L(80, 150, 120, 150, b)}
          <GateShape g="XOR" x={120} y={40} />
          <GateShape g="AND" x={120} y={120} />
          {L(176, 60, 300, 60, f.x1)}
          {full ? (
            <>
              {L(30, 190, 290, 190, ci)}{L(290, 190, 290, 80, ci)}{L(290, 80, 300, 80, ci)}
              {L(250, 60, 250, 205, f.x1)}{L(250, 205, 300, 205, f.x1)}{L(270, 190, 300, 190, ci)}
              <GateShape g="XOR" x={300} y={50} />
              <GateShape g="AND" x={300} y={178} h={36} />
              {L(176, 140, 420, 140, f.c1)}{L(370, 196, 420, 196, f.c2)}{L(420, 140, 420, 155, f.c1)}{L(420, 196, 420, 175, f.c2)}{L(420, 155, 430, 155, f.c1)}{L(420, 175, 430, 175, f.c2)}
              <GateShape g="OR" x={430} y={145} h={40} />
              {L(356, 70, 540, 70, f.s)}{L(486, 165, 540, 165, f.cout)}
              <text x={500} y={62} fontSize={12} fontWeight={800}>S</text><text x={492} y={157} fontSize={12} fontWeight={800}>Cout</text>
              <text x={186} y={54} fontSize={10}>x1={f.x1}</text><text x={186} y={134} fontSize={10}>c1={f.c1}</text><text x={374} y={212} fontSize={10}>c2={f.c2}</text>
            </>
          ) : (
            <>
              {L(176, 60, 540, 60, h.s)}{L(176, 140, 540, 140, h.c)}
              <text x={500} y={52} fontSize={12} fontWeight={800}>S</text><text x={500} y={132} fontSize={12} fontWeight={800}>C</text>
            </>
          )}
        </svg>
      </div>
      <Explain tone="ok">{full
        ? tx(lang, `${a} + ${b} + ${ci} = ${a + b + ci} = ${f.cout}${f.s} in binary → S = ${f.s}, Cout = ${f.cout}. A full adder is two half adders plus an OR: the first adds A and B, the second adds the carry coming in from the column on the right.`, `${a} + ${b} + ${ci} = ${a + b + ci} = ${f.cout}${f.s} hệ 2 → S = ${f.s}, Cout = ${f.cout}. Full adder là hai half adder cộng một cổng OR: cái thứ nhất cộng A với B, cái thứ hai cộng thêm bit nhớ từ cột bên phải.`)
        : tx(lang, `${a} + ${b} = ${h.c}${h.s} in binary → S = A XOR B = ${h.s}, C = A AND B = ${h.c}. Two gates are enough to add two bits — but there is no input for a carry from the previous column, hence "half".`, `${a} + ${b} = ${h.c}${h.s} hệ 2 → S = A XOR B = ${h.s}, C = A AND B = ${h.c}. Hai cổng đủ để cộng hai bit — nhưng không có lối vào cho bit nhớ từ cột trước, nên gọi là "half" (một nửa).`)}</Explain>
    </div>
  );
}

/* ── Bộ cộng nối tiếp nhớ 8 bit ───────────────────────────────────────────────────────────── */
function Ripple({ lang }: { lang: Lang }) {
  const [a, setA] = useState(0b01101011);
  const [b, setB] = useState(0b00110101);
  const n = 8;
  const snaps = useMemo(() => rippleAdd(a, b, n), [a, b]);
  const p = usePlayer(snaps.length, 900);
  const S = snaps[p.i];
  const A = toBits(a, n), B = toBits(b, n);
  const done = p.i === snaps.length - 1;
  return (
    <div className={s.stack}>
      <div className={s.panel} style={{ overflowX: 'auto' }}>
        <div className={s.stack} style={{ gap: 6 }}>
          <BitRow label={`A = ${a}`} value={a} width={8} small onToggle={(k) => { setA(toggleBit(a, k, 8)); p.reset(); }} />
          <BitRow label={`B = ${b}`} value={b} width={8} small onToggle={(k) => { setB(toggleBit(b, k, 8)); p.reset(); }} />
        </div>
      </div>
      <Controls p={p} lang={lang} label={tx(lang, `${p.i} of ${n} stages settled · ${2 * p.i} gate delays`, `${p.i}/${n} tầng đã ổn định · ${2 * p.i} độ trễ cổng`)} />
      <div className={c.fa}>
        {Array.from({ length: n }, (_, i) => n - 1 - i).map((k) => {
          const settled = S.sum[k] !== null;
          return (
            <div key={k} className={cx(c.faBox, S.active === k && c.act, !settled && c.pend)}>
              <div style={{ fontSize: 10, color: 'var(--ol-muted)' }}>FA{k}</div>
              <div>{A[k]}+{B[k]}+<span style={{ color: 'var(--ol-warn)' }}>{S.carry[k] ?? '?'}</span></div>
              <div>S=<b>{S.sum[k] ?? '?'}</b></div>
              <div style={{ color: 'var(--ol-warn)' }}>C={S.carry[k + 1] ?? '?'}</div>
            </div>
          );
        })}
      </div>
      <div className={s.small}>← {tx(lang, 'the carry travels from FA0 (right) to FA7 (left)', 'bit nhớ đi từ FA0 (phải) sang FA7 (trái)')}</div>
      <Explain tone={done ? 'ok' : undefined}>
        {done
          ? tx(lang, `${a} + ${b} = ${fromBits(S.sum) + (S.carry[n] ? 256 : 0)}${S.carry[n] ? ` — the carry out of FA7 is 1, so the 8-bit result ${fromBits(S.sum)} overflowed` : ''}. It took ${n} stages ≈ ${2 * n} gate delays: each full adder had to WAIT for the carry from its right neighbour. A 64-bit ripple adder would wait 64 stages — real CPUs use carry-lookahead adders that compute all carries in ~log₂(n) steps.`,
            `${a} + ${b} = ${fromBits(S.sum) + (S.carry[n] ? 256 : 0)}${S.carry[n] ? ` — bit nhớ ra khỏi FA7 bằng 1, nên kết quả 8 bit ${fromBits(S.sum)} đã tràn` : ''}. Mất ${n} tầng ≈ ${2 * n} độ trễ cổng: mỗi full adder phải CHỜ bit nhớ từ hàng xóm bên phải. Bộ cộng nối tiếp 64 bit sẽ chờ 64 tầng — CPU thật dùng bộ cộng nhìn trước số nhớ (carry-lookahead) tính mọi bit nhớ trong ~log₂(n) bước.`)
          : p.i === 0 ? tx(lang, 'Press Play: each step, one more full adder receives its carry and its sum bit becomes final. "?" = not settled yet.', 'Bấm Chạy: mỗi bước, thêm một full adder nhận được bit nhớ và bit tổng của nó mới chốt. "?" = chưa ổn định.')
            : tx(lang, `FA${S.active}: ${A[S.active]} + ${B[S.active]} + carry ${S.carry[S.active]} → sum ${S.sum[S.active]}, carry ${S.carry[S.active + 1]} goes left.`, `FA${S.active}: ${A[S.active]} + ${B[S.active]} + nhớ ${S.carry[S.active]} → tổng ${S.sum[S.active]}, nhớ ${S.carry[S.active + 1]} đi sang trái.`)}
      </Explain>
    </div>
  );
}

/* ── MUX & bộ giải mã ────────────────────────────────────────────────────────────────────── */
function Mux({ lang }: { lang: Lang }) {
  const [ins, setIns] = useState<Bit[]>([0, 1, 1, 0]);
  const [sel, setSel] = useState(1);
  const [addr, setAddr] = useState(5);
  const out = mux(ins, sel);
  const dec = decoder(addr, 3);
  return (
    <div className={s.grid2}>
      <div className={s.panel}>
        <div className={s.panelTitle}>{tx(lang, 'Multiplexer 4 → 1', 'Bộ dồn kênh (MUX) 4 → 1')}</div>
        <div className={s.bar}>{ins.map((v, k) => <InBtn key={k} v={v} label={`I${k}`} on={() => setIns(ins.map((x, j) => (j === k ? (1 - x) as Bit : x)))} />)}</div>
        <div className={s.bar}>
          <InBtn v={((sel >> 1) & 1) as Bit} label="S1" on={() => setSel(sel ^ 2)} /><InBtn v={(sel & 1) as Bit} label="S0" on={() => setSel(sel ^ 1)} />
          <span className={s.lbl}>→ I{sel} → {tx(lang, 'output', 'ra')} <span className={cx(c.lamp, out && c.on)} /> <b>{out}</b></span>
        </div>
        <div className={s.small}>{tx(lang, 'The select bits choose which input passes through. Inside the CPU, MUXes choose "does the ALU get a register or a constant?", "does PC get PC+1 or the jump target?".', 'Các bit chọn quyết định đầu vào nào được đi qua. Trong CPU, MUX chọn "ALU lấy thanh ghi hay hằng số?", "PC nhận PC+1 hay địa chỉ nhảy?".')}</div>
      </div>
      <div className={s.panel}>
        <div className={s.panelTitle}>{tx(lang, 'Decoder 3 → 8 (how RAM picks a cell)', 'Bộ giải mã 3 → 8 (cách RAM chọn một ô)')}</div>
        <div className={s.bar}>{[2, 1, 0].map((k) => <InBtn key={k} v={((addr >> k) & 1) as Bit} label={`A${k}`} on={() => setAddr(addr ^ (1 << k))} />)}<span className={s.mono}>= {addr}</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 4 }}>
          {dec.map((v, k) => <div key={k} className={cx(c.faBox, v && c.act)}>{tx(lang, 'row', 'hàng')} {k}<br /><b>{v}</b></div>)}
        </div>
        <div className={s.small} style={{ marginTop: 6 }}>{tx(lang, 'Exactly one output line is 1. A memory chip with a 12-bit address has a 12 → 4096 decoder: the address bits switch on exactly one row.', 'Đúng một đường ra bằng 1. Chip nhớ có địa chỉ 12 bit chứa bộ giải mã 12 → 4096: các bit địa chỉ bật đúng một hàng.')}</div>
      </div>
    </div>
  );
}

/* ── Thanh ghi & đồng hồ ─────────────────────────────────────────────────────────────────── */
function Register({ lang }: { lang: Lang }) {
  const [d, setD] = useState(0b1010);
  const [events, setEvents] = useState<RegEvent[]>([{ kind: 'd', value: 0b1010 }]);
  const tl = useMemo(() => registerTimeline(events), [events]);
  const last = tl[tl.length - 1];
  const setDBit = (k: number) => { const nd = d ^ (1 << k); setD(nd); setEvents([...events, { kind: 'd', value: nd } as RegEvent].slice(-24)); };
  const tick = () => setEvents([...events, { kind: 'tick' } as RegEvent].slice(-24));
  const W = 24 * tl.length + 70;
  const wave = (vals: number[], y: number, label: string, digital = true): ReactNode => {
    let path = '';
    vals.forEach((v, i) => { const x = 60 + i * 24, yy = digital ? y + (v ? 0 : 18) : y + 9; path += `${i ? 'L' : 'M'} ${x} ${yy} L ${x + 24} ${yy} `; });
    return (
      <g key={label}>
        <text x={4} y={y + 13} fontSize={11} fontWeight={800} fill="var(--ol-text)">{label}</text>
        {digital ? <path d={path} fill="none" stroke="var(--ol-accent)" strokeWidth={2} />
          : vals.map((v, i) => <g key={i}><rect x={60 + i * 24} y={y} width={24} height={18} fill="none" stroke="var(--ol-border)" /><text x={72 + i * 24} y={y + 13} fontSize={10} textAnchor="middle" fill="var(--ol-text)" style={{ fontFamily: 'monospace' }}>{v.toString(16).toUpperCase()}</text></g>)}
      </g>
    );
  };
  return (
    <div className={s.stack}>
      <div className={s.bar}>
        <span className={s.lbl}>D</span>{[3, 2, 1, 0].map((k) => <InBtn key={k} v={((d >> k) & 1) as Bit} label={`D${k}`} on={() => setDBit(k)} />)}
        <button type="button" className={cx(s.btn, s.primary)} onClick={tick}>⏱ {tx(lang, 'Clock tick', 'Nhịp đồng hồ')}</button>
        <button type="button" className={s.btn} onClick={() => { setEvents([{ kind: 'd', value: d }]); }}>{tx(lang, 'Clear history', 'Xoá lịch sử')}</button>
      </div>
      <div className={c.read}>
        <div className={c.readItem}><div className={c.k}>D ({tx(lang, 'input', 'đầu vào')})</div><div className={c.v}>{d.toString(2).padStart(4, '0')} = {d}</div></div>
        <div className={c.readItem}><div className={c.k}>Q ({tx(lang, 'stored', 'đang giữ')})</div><div className={c.v} style={{ color: 'var(--ol-accent)' }}>{last.q.toString(2).padStart(4, '0')} = {last.q}</div></div>
      </div>
      <div className={s.panel} style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} 100`} width={W} height={100} role="img" aria-label="timing diagram">
          {wave(tl.map((x) => x.clk), 6, 'CLK')}
          {wave(tl.map((x) => x.d), 38, 'D', false)}
          {wave(tl.map((x) => x.q), 70, 'Q', false)}
          {tl.map((x, i) => (x.edge ? <line key={i} x1={60 + i * 24} x2={60 + i * 24} y1={0} y2={96} stroke="#f59e0b" strokeDasharray="3 3" /> : null))}
        </svg>
      </div>
      <Explain>{tx(lang,
        'Change D as often as you like — Q does NOT follow. Only at the rising edge of the clock (orange line) does the register copy D into Q and hold it. Every register in a CPU listens to the same clock, so a 3 GHz CPU takes 3 billion such snapshots per second. This is what makes a "step" of the toy CPU a real thing.',
        'Đổi D bao nhiêu lần tuỳ thích — Q KHÔNG đổi theo. Chỉ ở sườn lên của đồng hồ (vạch cam) thanh ghi mới chép D vào Q và giữ lại. Mọi thanh ghi trong CPU nghe cùng một đồng hồ, nên CPU 3 GHz chụp 3 tỉ lần như thế mỗi giây. Đây là thứ làm cho một "bước" của CPU đồ chơi có thật.')}</Explain>
    </div>
  );
}

/* ── Mọi thứ từ NAND ────────────────────────────────────────────────────────────────────── */
function Nand({ lang }: { lang: Lang }) {
  const [t, setT] = useState<'NOT' | 'AND' | 'OR' | 'XOR'>('XOR');
  const B = NAND_BUILD[t];
  const rows = ([[0, 0], [0, 1], [1, 0], [1, 1]] as Bit[][]).filter((r) => t !== 'NOT' || r[1] === 0);
  const total = (['NOT', 'AND', 'OR', 'XOR'] as const).reduce((n, k) => n + NAND_BUILD[k].count, 0);
  return (
    <div className={s.stack}>
      <div className={s.bar}><Seg label={tx(lang, 'Build', 'Dựng')} value={t} options={[['NOT', 'NOT'], ['AND', 'AND'], ['OR', 'OR'], ['XOR', 'XOR']]} onChange={setT} /></div>
      <div className={s.grid2}>
        <div className={s.panel}>
          <div className={s.panelTitle}>{tx(lang, `${t} from ${B.count} NAND gate${B.count > 1 ? 's' : ''}`, `${t} từ ${B.count} cổng NAND`)}</div>
          <div className={s.mono} style={{ fontSize: 13, marginBottom: 8 }}>{B.formula}</div>
          <svg className={c.gateSvg} viewBox={`0 0 ${70 * B.count + 40} 60`} width="100%" style={{ maxWidth: 70 * B.count + 40 }} role="img" aria-label="NAND chain">
            {Array.from({ length: B.count }, (_, k) => <GateShape key={k} g="NAND" x={14 + 70 * k} y={10} w={44} h={36} />)}
          </svg>
        </div>
        <div className={s.panel}>
          <div className={s.panelTitle}>{tx(lang, 'Check every input', 'Kiểm mọi đầu vào')}</div>
          <table className={cx(s.tbl, s.compact)} style={{ maxWidth: 300 }}>
            <thead><tr><th>A</th>{t !== 'NOT' && <th>B</th>}<th>{tx(lang, 'NAND-built', 'dựng từ NAND')}</th><th>{tx(lang, 'real', 'cổng thật')} {t}</th><th /></tr></thead>
            <tbody>{rows.map(([a, b], k) => {
              const x = B.f(a, b), y = t === 'NOT' ? gate('NOT', a) : gate(t, a, b);
              return <tr key={k}><td className={s.mono}>{a}</td>{t !== 'NOT' && <td className={s.mono}>{b}</td>}<td className={s.mono}><b>{x}</b></td><td className={s.mono}>{y}</td><td>{x === y ? '✓' : '✗'}</td></tr>;
            })}</tbody>
          </table>
        </div>
      </div>
      <Explain tone="ok">{tx(lang,
        `NAND is "universal": NOT, AND, OR and XOR together cost ${total} NANDs here, and from those come adders, multiplexers, flip-flops, registers, the ALU, RAM — a whole CPU. Chip factories really do build most logic from NAND/NOR cells. (The free course "From Nand to Tetris" builds a working computer this way.)`,
        `NAND là cổng "vạn năng": NOT, AND, OR và XOR ở đây tốn tổng cộng ${total} cổng NAND, và từ chúng dựng ra bộ cộng, MUX, flip-flop, thanh ghi, ALU, RAM — cả một CPU. Nhà máy chip thật sự dựng phần lớn logic từ ô NAND/NOR. (Khoá học miễn phí "From Nand to Tetris" dựng nguyên một máy tính chạy được theo cách này.)`)}</Explain>
    </div>
  );
}

export default function LogicSim({ lang = 'vi', preset }: { lang?: Lang; preset?: string }) {
  const ALL: Tab[] = ['gates', 'adder', 'ripple', 'mux', 'register', 'nand'];
  const [tab, setTab] = useState<Tab>(ALL.includes(preset as Tab) ? (preset as Tab) : 'gates');
  const TABS: Array<[Tab, string, string]> = [
    ['gates', 'Gates', 'Cổng'], ['adder', 'Half & full adder', 'Bộ cộng 1 bit'], ['ripple', '8-bit adder', 'Bộ cộng 8 bit'],
    ['mux', 'MUX & decoder', 'MUX & giải mã'], ['register', 'Clock & register', 'Đồng hồ & thanh ghi'], ['nand', 'Everything from NAND', 'Mọi thứ từ NAND'],
  ];
  return (
    <CpuFrame lang={lang} title={tx(lang, 'Logic gates → circuits', 'Cổng logic → mạch')} sub={tx(lang, 'From switches to an adder to memory', 'Từ công tắc tới bộ cộng tới bộ nhớ')}>
      <div className={s.tabs} role="tablist">
        {TABS.map(([k, en, vi]) => <button type="button" role="tab" aria-selected={tab === k} key={k} className={cx(s.tab, tab === k && s.on)} onClick={() => setTab(k)}>{tx(lang, en, vi)}</button>)}
      </div>
      {tab === 'gates' && <Gates lang={lang} />}
      {tab === 'adder' && <Adder lang={lang} />}
      {tab === 'ripple' && <Ripple lang={lang} />}
      {tab === 'mux' && <Mux lang={lang} />}
      {tab === 'register' && <Register lang={lang} />}
      {tab === 'nand' && <Nand lang={lang} />}
    </CpuFrame>
  );
}
