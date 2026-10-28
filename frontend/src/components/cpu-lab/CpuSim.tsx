'use client';
/**
 * CPU đồ chơi (MARIE) — trái tim của phòng lab: tự viết hợp ngữ, xem mã máy từng bit, rồi đi từng vi bước
 * nạp → giải mã → thực thi với dữ liệu chạy trên bus. Chương trình và dữ liệu nằm chung MỘT bộ nhớ (von Neumann).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { EXAMPLES, OP_HELP, assemble, bin16, disasm, hex3, hex4, instrIndex, run, s16, type Snap, type Unit } from './engine/marie';
import { Controls, Explain, Seg, css as s, usePlayer } from '../os-lab/ui';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { CpuFrame, cc as c, cx, tx, type Lang } from './parts';

/* ── Sơ đồ khối: con chip CPU ⇄ bus ⇄ thanh RAM, gói dữ liệu chạy theo vi bước ─────────────── */
// Phần cứng giữ màu "thật" ở cả nền sáng lẫn tối: vỏ chip xám than, đế silicon, đường đồng, chân mạ vàng, mạch RAM xanh.
const POS: Record<Unit, [number, number]> = {
  PC: [92, 72], IR: [92, 132], AC: [92, 192], MAR: [226, 72], MBR: [226, 132], ALU: [226, 196], CU: [158, 250],
  MEM: [378, 128], INDEV: [404, 278], OUTDEV: [500, 278], IN: [404, 278], OUT: [500, 278],
};
const BUS_X = 158, SYS_X = 344;
function routeOf(from: Unit, to: Unit): string {
  const [x1, y1] = POS[from], [x2, y2] = POS[to];
  const inCpu = (u: Unit) => !['MEM', 'INDEV', 'OUTDEV', 'IN', 'OUT'].includes(u);
  if (inCpu(from) && inCpu(to)) return `M ${x1} ${y1} L ${BUS_X} ${y1} L ${BUS_X} ${y2} L ${x2} ${y2}`;
  return `M ${x1} ${y1} L ${SYS_X} ${y1} L ${SYS_X} ${y2} L ${x2} ${y2}`;
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setR(m.matches);
    const f = () => setR(m.matches);
    m.addEventListener?.('change', f);
    return () => m.removeEventListener?.('change', f);
  }, []);
  return r;
}

const REG_NOTE: Record<'PC' | 'IR' | 'AC' | 'MAR' | 'MBR', [string, string]> = {
  PC: ['next instr.', 'lệnh kế'], IR: ['instruction', 'lệnh'], AC: ['accumulator', 'tích luỹ'],
  MAR: ['address', 'địa chỉ'], MBR: ['data buffer', 'đệm dữ liệu'],
};

function Board({ lang, S, mem }: { lang: Lang; S: Snap; mem: Uint16Array }) {
  const R = S.regs;
  const reduced = useReducedMotion();
  const box = (u: 'PC' | 'IR' | 'AC' | 'MAR' | 'MBR') => {
    const [x, y] = POS[u];
    const w = 112, h = 46;
    const ch = S.changed.includes(u);
    const v = R[u];
    const shown = u === 'PC' || u === 'MAR' ? hex3(v) : hex4(v);
    return (
      <g key={u} data-tour={`reg-${u}`} className={cx(c.reg3, ch && c.regHot)}>
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={7} className={c.regCase} />
        <text x={x - w / 2 + 7} y={y - h / 2 + 12} fontSize={10} fontWeight={800} className={c.regName}>{u}</text>
        <text x={x + w / 2 - 7} y={y - h / 2 + 12} fontSize={8} textAnchor="end" className={c.regNote}>{tx(lang, REG_NOTE[u][0], REG_NOTE[u][1])}</text>
        <rect x={x - w / 2 + 6} y={y - 5} width={w - 12} height={22} rx={4} className={c.lcd} />
        {u === 'AC' && <text x={x - w / 2 + 11} y={y + 10} fontSize={9.5} className={c.lcdDim}>{s16(v)}</text>}
        <text x={x + w / 2 - 11} y={y + 11.5} fontSize={15} fontWeight={800} textAnchor="end" className={c.lcdText}>{shown}</text>
      </g>
    );
  };
  const busOn = S.bus;
  const rows = [-2, -1, 0, 1, 2].map((d) => (R.MAR + d + 4096) % 4096);
  const hot = S.memWrite ?? S.memRead;
  const phaseIdx = S.phase === 'fetch' ? 0 : S.phase === 'decode' ? 1 : S.phase === 'execute' ? 2 : -1;
  const aluOn = busOn?.from === 'ALU' || S.rtn.includes('AC + ') || S.rtn.includes('AC - ') || S.rtn.includes('AC − ');
  const pins = (n: number, f: (k: number) => [number, number, number, number]) => Array.from({ length: n }, (_, k) => { const [x, y, w, h] = f(k); return <rect key={k} x={x} y={y} width={w} height={h} rx={1} className={c.pin} />; });
  return (
    <svg className={c.busSvg} viewBox="0 0 560 304" width="100%" role="img" aria-label={tx(lang, 'CPU chip, bus and memory', 'Chip CPU, bus và bộ nhớ')} data-tour="cpu-board">
      <defs>
        <pattern id="cl-die" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M 12 0 L 0 0 0 12" fill="none" className={c.dieGrid} strokeWidth={0.6} /></pattern>
        <filter id="cl-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {/* vỏ chip + chân */}
      {pins(14, (k) => [30 + k * 18.5, 2, 8, 9])}
      {pins(14, (k) => [30 + k * 18.5, 293, 8, 9])}
      {pins(13, (k) => [0, 30 + k * 19, 9, 8])}
      <rect x={8} y={10} width={302} height={284} rx={14} className={c.pkg} />
      <rect x={24} y={28} width={270} height={248} rx={8} className={c.die} />
      <rect x={24} y={28} width={270} height={248} rx={8} fill="url(#cl-die)" />
      <circle cx={34} cy={38} r={3.5} className={c.pin1} />
      <text x={286} y={42} fontSize={9.5} textAnchor="end" fontWeight={800} className={c.silk}>MARIE · 16-bit</text>
      {/* bus trong chip (đồng) */}
      <line x1={BUS_X} y1={52} x2={BUS_X} y2={232} className={c.trace} strokeWidth={6} strokeLinecap="round" />
      <text x={BUS_X + 5} y={226} fontSize={8.5} className={c.silk}>{tx(lang, 'internal bus', 'bus trong')}</text>
      {/* bus hệ thống: dải nhiều đường đồng */}
      {[-6, -2, 2, 6].map((d) => <line key={d} x1={SYS_X + d} y1={40} x2={SYS_X + d} y2={286} className={c.traceThin} strokeWidth={1.6} />)}
      {[72, 132].map((y) => [-3, 0, 3].map((d) => <line key={`${y}${d}`} x1={282} y1={y + d} x2={SYS_X} y2={y + d} className={c.traceThin} strokeWidth={1.4} />))}
      {[-4, 0, 4].map((d) => <line key={`m${d}`} x1={SYS_X} y1={128 + d} x2={378} y2={128 + d} className={c.traceThin} strokeWidth={1.6} />)}
      <text x={SYS_X} y={33} fontSize={9} textAnchor="middle" className={s.svgMuted}>{tx(lang, 'system bus', 'bus hệ thống')}</text>
      {(['PC', 'IR', 'AC', 'MAR', 'MBR'] as const).map((u) => box(u))}
      {/* ALU */}
      <g data-tour="alu" className={cx(c.alu, aluOn && c.aluOn)}>
        <path d={`M ${POS.ALU[0] - 54} ${POS.ALU[1] - 20} L ${POS.ALU[0] - 10} ${POS.ALU[1] - 20} L ${POS.ALU[0]} ${POS.ALU[1] - 8} L ${POS.ALU[0] + 10} ${POS.ALU[1] - 20} L ${POS.ALU[0] + 54} ${POS.ALU[1] - 20} L ${POS.ALU[0] + 30} ${POS.ALU[1] + 22} L ${POS.ALU[0] - 30} ${POS.ALU[1] + 22} Z`} />
        <text x={POS.ALU[0]} y={POS.ALU[1] + 13} textAnchor="middle" fontSize={12.5} fontWeight={800}>ALU</text>
      </g>
      {/* khối điều khiển + 3 đèn pha */}
      <g data-tour="cu">
        <rect x={POS.CU[0] - 112} y={POS.CU[1] - 16} width={224} height={32} rx={7} className={cx(c.cuBox, S.phase === 'decode' && c.cuHot)} />
        <text x={POS.CU[0] - 104} y={POS.CU[1] + 4} fontSize={10} fontWeight={800} className={c.regName}>{tx(lang, 'Control unit', 'Khối điều khiển')}</text>
        <text x={POS.CU[0] + 8} y={POS.CU[1] + 4} fontSize={10.5} fontWeight={800} className={c.lcdText}>{S.phase === 'start' ? '—' : disasm(R.IR).split(' ')[0]}</text>
        {(['F', 'D', 'E'] as const).map((l, k) => (
          <g key={l}>
            <circle cx={POS.CU[0] + 62 + k * 16} cy={POS.CU[1]} r={5.5} className={cx(c.led, phaseIdx === k && [c.ledF, c.ledD, c.ledE][k])} />
            <text x={POS.CU[0] + 62 + k * 16} y={POS.CU[1] + 13.5} fontSize={6.5} textAnchor="middle" className={c.silk}>{l}</text>
          </g>
        ))}
      </g>
      {/* thanh RAM: mạch xanh, chân vàng, mỗi ô nhớ 16 bit */}
      <g data-tour="ram">
        <rect x={378} y={12} width={174} height={236} rx={8} className={c.dimm} />
        {Array.from({ length: 16 }, (_, k) => <rect key={k} x={386 + k * 10.2} y={240} width={6} height={8} className={c.pin} />)}
        <text x={388} y={27} fontSize={9.5} fontWeight={800} className={c.silkLight}>RAM 4096 × 16 bit</text>
        {rows.map((a, k) => {
          const y = 34 + k * 40;
          const isHot = hot === a && (S.memRead !== undefined || S.memWrite !== undefined);
          const w = mem[a];
          return (
            <g key={k} className={cx(c.cell, a === R.MAR && c.cellSel, isHot && (S.memWrite !== undefined ? c.cellWr : c.cellRd))}>
              <rect x={386} y={y} width={158} height={35} rx={5} className={c.cellCase} />
              <text x={392} y={y + 13} fontSize={9.5} className={c.cellAddr}>{hex3(a)}</text>
              <text x={538} y={y + 13.5} fontSize={12} fontWeight={800} textAnchor="end" className={c.lcdText}>{hex4(w)}</text>
              {Array.from({ length: 16 }, (_, b) => (
                <rect key={b} x={392 + b * 9.1 + (b >= 4 ? 2 : 0) + (b >= 8 ? 2 : 0) + (b >= 12 ? 2 : 0)} y={y + 20} width={6.5} height={8} rx={1.5}
                  className={(w >> (15 - b)) & 1 ? c.bitOn : c.bitOff} />
              ))}
            </g>
          );
        })}
      </g>
      <text x={386} y={262} fontSize={8.5} className={s.svgMuted}>{tx(lang, 'blue frame = cell MAR points at', 'khung xanh = ô MAR đang trỏ')}</text>
      {/* thiết bị vào/ra */}
      <g className={cx(c.dev, busOn?.from === 'INDEV' && c.devOn)} data-tour="io">
        <rect x={370} y={268} width={68} height={24} rx={6} />
        <text x={404} y={284} fontSize={10} textAnchor="middle" fontWeight={800}>⌨ In {R.IN ? s16(R.IN) : ''}</text>
      </g>
      <g className={cx(c.dev, busOn?.to === 'OUTDEV' && c.devOn)}>
        <rect x={456} y={268} width={88} height={24} rx={6} />
        <text x={500} y={284} fontSize={10} textAnchor="middle" fontWeight={800}>🖥 Out {S.output.length ? s16(S.output[S.output.length - 1]) : ''}</text>
      </g>
      {busOn && (() => {
        const d = routeOf(busOn.from, busOn.to);
        const pill = (
          <>
            <rect x={-27} y={-10} width={54} height={20} rx={10} className={busOn.kind === 'addr' ? c.pkAddr : c.pkData} filter="url(#cl-glow)" />
            <text x={0} y={4} fontSize={10.5} fontWeight={800} textAnchor="middle" fill="#fff">{busOn.kind === 'addr' ? hex3(busOn.value) : hex4(busOn.value)}</text>
          </>
        );
        return (
          <g key={`${busOn.from}-${busOn.to}-${S.memVer}-${S.done}-${S.rtn}`}>
            <path d={d} fill="none" className={busOn.kind === 'addr' ? c.routeAddr : c.routeData} strokeWidth={3} strokeDasharray="6 4" />
            {/* gói chạy tới nơi rồi mờ đi để lộ giá trị vừa giao; giảm chuyển động ⇒ chỉ còn đường đi nét đứt */}
            {!reduced && <g>{pill}<animateMotion dur="0.75s" fill="freeze" path={d} calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" /><animate attributeName="opacity" values="1;1;0" keyTimes="0;0.6;1" dur="1.25s" fill="freeze" /></g>}
          </g>
        );
      })()}
    </svg>
  );
}

export default function CpuSim({ lang = 'vi', preset }: { lang?: Lang; preset?: string }) {
  const first = preset && preset in EXAMPLES ? preset : 'add';
  const [ex, setEx] = useState(first);
  const [src, setSrc] = useState(EXAMPLES[first].src);
  const [inputs, setInputs] = useState(EXAMPLES[first].inputs ?? '');
  const [mode, setMode] = useState<'micro' | 'instr'>('micro');
  const [showRef, setShowRef] = useState(false);
  const prog = useMemo(() => assemble(src), [src]);
  const inputVals = useMemo(() => inputs.split(/[\s,;]+/).map((x) => Number(x)).filter((x) => Number.isFinite(x)).map(Math.trunc), [inputs]);
  const res = useMemo(() => (prog.ok ? run(prog, inputVals, 1500) : null), [prog, inputVals]);
  const idx = useMemo(() => (res ? (mode === 'micro' ? res.snaps.map((_, i) => i) : instrIndex(res.snaps)) : [0]), [res, mode]);
  const p = usePlayer(idx.length, mode === 'micro' ? 750 : 1000);
  useEffect(() => { p.reset(); }, [src, inputs]); // eslint-disable-line react-hooks/exhaustive-deps
  const S = res ? res.snaps[idx[Math.min(p.i, idx.length - 1)]] : null;
  const mem = res && S ? res.mems[S.memVer] : prog.mem;
  const pick = (k: string) => { setEx(k); setSrc(EXAMPLES[k].src); setInputs(EXAMPLES[k].inputs ?? ''); };
  const E = EXAMPLES[ex] ?? EXAMPLES.blank;

  // bảng bộ nhớ: vùng chương trình + quanh PC/MAR
  const memRows = useMemo(() => {
    const set = new Set<number>();
    for (let a = prog.start; a <= Math.min(prog.last + 1, prog.start + 63); a++) set.add(a);
    if (S) { set.add(S.at); set.add(S.regs.MAR); if (S.memWrite !== undefined) set.add(S.memWrite); }
    return Array.from(set).sort((x, y) => x - y);
  }, [prog, S]);
  const labelAt = useMemo(() => {
    const m = new Map<number, string>();
    for (const [k, v] of Object.entries(prog.symbols)) if (!m.has(v)) m.set(v, k);
    for (const l of prog.lines) if (l.label && l.addr !== null) m.set(l.addr, l.label);
    return m;
  }, [prog]);
  const curLine = S && S.phase !== 'start' ? prog.addrLine.get(S.at) : undefined;
  const doneN = S ? S.done + (S.phase === 'halt' ? 1 : 0) : 0;
  const trace = res && S ? res.trace.slice(0, doneN).slice(-10) : [];
  const tone = S?.phase === 'halt' ? 'ok' : S?.phase === 'stop' ? 'bad' : undefined;

  useLabBridge('cpu', {
    ex, mode, i: p.i, ok: prog.ok, pc: S?.regs.PC ?? -1, ir: S?.regs.IR ?? 0, ac: S ? s16(S.regs.AC) : 0, mar: S?.regs.MAR ?? 0,
    mbr: S?.regs.MBR ?? 0, phase: S?.phase ?? 'start', at: S?.at ?? 0, done: S ? S.done + (S.last || S.phase === 'halt' ? 1 : 0) : 0, halted: S?.phase === 'halt',
    out: S && S.output.length ? s16(S.output[S.output.length - 1]) : null,
  }, {
    load: (k) => { const key = String(k); if (EXAMPLES[key]) pick(key); }, mode: (m) => { setMode(m as 'micro' | 'instr'); p.reset(); },
    inputs: (v) => setInputs(String(v)), ref: (v) => setShowRef(!!v),
  });
  // tiếng riêng cho từng vi bước: nạp (cao) · giải mã · thực thi · dừng
  useOwnStepSound();
  const lastI = useRef(p.i);
  useEffect(() => {
    if (S && p.i > lastI.current) labSfx(S.phase === 'fetch' ? 'blip-fetch' : S.phase === 'decode' ? 'blip-decode' : S.phase === 'execute' ? 'blip-exec' : S.phase === 'halt' ? 'done' : S.phase === 'stop' ? 'wrong' : 'tick');
    lastI.current = p.i;
  }, [p.i, S]);

  return (
    <CpuFrame lang={lang} title={tx(lang, 'Toy CPU — a von Neumann machine (MARIE)', 'CPU đồ chơi — cỗ máy von Neumann (MARIE)')} sub={tx(lang, 'Write a program, see its machine code, watch every step', 'Viết chương trình, xem mã máy, nhìn từng bước')}>
      <div className={s.bar} data-tour="cpu-setup">
        <span className={s.lbl}>{tx(lang, 'Program', 'Chương trình')}
          <select value={ex} onChange={(e) => pick(e.target.value)}>
            {Object.entries(EXAMPLES).map(([k, v]) => <option key={k} value={k}>{tx(lang, v.en, v.vi)}</option>)}
          </select></span>
        <span className={s.lbl}>Input <input type="text" value={inputs} onChange={(e) => setInputs(e.target.value)} placeholder="12, 30" style={{ width: 110 }} /></span>
        <span data-tour="cpu-mode"><Seg value={mode} options={[['micro', tx(lang, 'micro-steps', 'vi bước')], ['instr', tx(lang, 'whole instructions', 'từng lệnh')]]} onChange={(m) => { setMode(m); p.reset(); }} /></span>
        <button type="button" className={cx(s.btn, showRef && s.on)} onClick={() => setShowRef(!showRef)}>{tx(lang, 'Instruction set', 'Tập lệnh')}</button>
      </div>
      {showRef && (
        <div className={s.panel} style={{ marginBottom: 8, overflowX: 'auto' }}>
          <table className={cx(s.tbl, s.compact)}>
            <thead><tr><th>{tx(lang, 'opcode', 'mã lệnh')}</th><th>{tx(lang, 'instruction', 'lệnh')}</th><th>{tx(lang, 'meaning', 'ý nghĩa')}</th><th>RTN</th></tr></thead>
            <tbody>{OP_HELP.map((o) => <tr key={o.op}><td className={s.mono}>{o.op.toString(16).toUpperCase()} = {o.op.toString(2).padStart(4, '0')}</td><td className={s.mono}><b>{o.name}</b></td><td>{tx(lang, o.en, o.vi)}</td><td className={s.mono} style={{ fontSize: 11 }}>{o.rtn}</td></tr>)}</tbody>
          </table>
          <div className={s.small} style={{ marginTop: 6 }}>{tx(lang, 'Format of every instruction: 4-bit opcode | 12-bit address. Numbers in operands are hex. Data: DEC 5, HEX 1F, ADR Label. Also accepted: SUB, JMP, HLT, OUT, IN.', 'Khuôn mọi lệnh: 4 bit mã lệnh | 12 bit địa chỉ. Số trong toán hạng là hex. Dữ liệu: DEC 5, HEX 1F, ADR Nhãn. Nhận cả SUB, JMP, HLT, OUT, IN.')}</div>
        </div>
      )}
      <div className={c.cpuGrid}>
        <div className={s.stack} style={{ gap: 8, minWidth: 0 }}>
          <textarea data-tour="cpu-editor" className={c.editor} value={src} spellCheck={false} onChange={(e) => setSrc(e.target.value)} aria-label={tx(lang, 'assembly source', 'mã hợp ngữ')} rows={Math.min(18, Math.max(9, src.split('\n').length))} />
          {!prog.ok && (
            <Explain tone="bad">{prog.errors.slice(0, 6).map((e, k) => <div key={k}>{tx(lang, 'Line', 'Dòng')} {e.line}: {tx(lang, e.en, e.vi)}</div>)}</Explain>
          )}
          <div>
            <div className={s.panelTitle}>{tx(lang, 'Assembled: address · machine code · bits (opcode | address) · source', 'Đã hợp dịch: địa chỉ · mã máy · bit (mã lệnh | địa chỉ) · nguồn')}</div>
            <div className={c.listing} data-tour="cpu-listing">
              {prog.lines.filter((l) => l.word !== null || l.label || l.src.trim()).map((l, k) => (
                <div key={k} className={cx(c.row, curLine === l.line && l.word !== null && c.cur)}>
                  <span className={c.a}>{l.addr !== null && l.word !== null ? hex3(l.addr) : ''}</span>
                  <span className={c.w}>{l.word !== null ? hex4(l.word) : ''}</span>
                  <span className={c.bn}>{l.word !== null ? (l.kind === 'instr' ? <><b>{bin16(l.word).slice(0, 4)}</b> {bin16(l.word).slice(4)}</> : bin16(l.word)) : ''}</span>
                  <span className={prog.errors.some((e) => e.line === l.line) ? c.err : undefined}>{l.src.replace(/\t/g, '  ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={s.stack} style={{ gap: 8, minWidth: 0 }}>
          {res && S ? (
            <>
              <Controls p={p} lang={lang} label={`${tx(lang, 'instr.', 'lệnh')} ${doneN}${S.phase !== 'start' && !S.last ? '+' : ''} · ${tx(lang, 'step', 'bước')} ${p.i + 1}/${idx.length}`}
                extra={<button type="button" className={s.btn} data-tour="cpu-end" onClick={() => { p.setPlaying(false); p.setI(idx.length - 1); }} disabled={p.atEnd}>⏭ {tx(lang, 'End', 'Cuối')}</button>} />
              <div className={s.bar} style={{ margin: 0 }} data-tour="cpu-phase">
                <span className={cx(c.phase, c[S.phase])}>{S.phase === 'start' ? tx(lang, 'power on', 'bật máy') : S.phase === 'fetch' ? tx(lang, 'fetch', 'nạp lệnh') : S.phase === 'decode' ? tx(lang, 'decode', 'giải mã') : S.phase === 'execute' ? tx(lang, 'execute', 'thực thi') : S.phase === 'halt' ? 'halt' : tx(lang, 'stopped', 'dừng')}</span>
                <b className={s.mono}>{S.rtn}</b>
                {S.phase !== 'start' && <span className={s.small}>{tx(lang, 'running', 'đang chạy')}: {hex3(S.at)} {disasm(mem[S.at] ?? 0)}</span>}
              </div>
              <Explain tone={tone}>{tx(lang, S.en, S.vi)}</Explain>
              <div className={s.svgWrap}><Board lang={lang} S={S} mem={mem} /></div>
              <div>
                <div className={s.panelTitle} data-tour="cpu-output">Output</div>
                <div className={c.out}>{S.output.length ? S.output.map((v) => s16(v)).join('  ') : <span style={{ opacity: 0.5 }}>—</span>}</div>
              </div>
            </>
          ) : <Explain tone="bad">{tx(lang, 'Fix the errors on the left to load the program.', 'Sửa lỗi bên trái để nạp chương trình.')}</Explain>}
        </div>
      </div>
      <div className={s.grid2} style={{ marginTop: 10 }}>
        <div className={s.panel} data-tour="cpu-memory">
          <div className={s.panelTitle}>{tx(lang, 'Memory — program AND data live here together', 'Bộ nhớ — chương trình VÀ dữ liệu ở chung một chỗ')}</div>
          <div className={c.mem}>
            <table>
              <thead><tr><th>{tx(lang, 'addr', 'đ/c')}</th><th>{tx(lang, 'label', 'nhãn')}</th><th>hex</th><th>{tx(lang, 'binary', 'nhị phân')}</th><th>{tx(lang, 'read as', 'đọc là')}</th></tr></thead>
              <tbody>{memRows.map((a) => {
                const w = mem[a];
                const changed = w !== prog.mem[a];
                const isCode = prog.codeAddrs.has(a);
                return (
                  <tr key={a} className={cx(S && S.phase !== 'start' && a === S.at && c.pc, S?.memRead === a && c.rd, S?.memWrite === a && c.wr)}>
                    <td>{hex3(a)}</td><td>{labelAt.get(a) ?? ''}</td>
                    <td style={{ fontWeight: changed ? 800 : 400, color: changed ? 'var(--ol-bad)' : undefined }}>{hex4(w)}</td>
                    <td>{bin16(w).replace(/(\d{4})(?=\d)/g, '$1 ')}</td>
                    <td className={isCode ? c.code : undefined}>{isCode ? disasm(w) : `DEC ${s16(w)}`}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
          <div className={s.small} style={{ marginTop: 4 }}>{tx(lang, 'blue row = instruction running · green = being read · red = being written · red value = changed since loading', 'hàng xanh dương = lệnh đang chạy · xanh lá = đang đọc · đỏ = đang ghi · số đỏ = đã đổi so với lúc nạp')}</div>
        </div>
        <div className={s.panel} data-tour="cpu-trace">
          <div className={s.panelTitle}>{tx(lang, 'Trace (last instructions) — like the CEA201 lab tables', 'Vết chạy (các lệnh gần nhất) — như bảng trong buổi lab CEA201')}</div>
          <div className={s.scrollX}>
            <table className={cx(s.tbl, s.compact)}>
              <thead><tr><th>#</th><th>PC</th><th>{tx(lang, 'instruction', 'lệnh')}</th><th>AC</th><th>MAR</th><th>MBR</th></tr></thead>
              <tbody>{trace.map((r, k) => (
                <tr key={k}><td>{doneN - trace.length + k + 1}</td><td className={s.mono}>{hex3(r.at)}</td><td className={s.mono}>{r.text}{r.skipped ? ' ⤼' : ''}</td><td className={s.mono}>{s16(r.regs.AC)}</td><td className={s.mono}>{hex3(r.regs.MAR)}</td><td className={s.mono}>{hex4(r.regs.MBR)}</td></tr>
              ))}</tbody>
            </table>
            {!trace.length && <div className={s.empty}>{tx(lang, 'Nothing has run yet.', 'Chưa chạy lệnh nào.')}</div>}
          </div>
        </div>
      </div>
      <div className={s.panel} style={{ marginTop: 10 }}>
        <div className={s.panelTitle}>🎯 {tx(lang, 'Try it', 'Thử ngay')}</div>
        <ol style={{ margin: '0 0 0 20px', padding: 0, fontSize: 13.5, listStyle: 'decimal' }}>{(lang === 'vi' ? E.tasksVi : E.tasksEn).map((t, k) => <li key={k}>{t}</li>)}</ol>
      </div>
    </CpuFrame>
  );
}
