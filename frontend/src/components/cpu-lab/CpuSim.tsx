'use client';
/**
 * CPU đồ chơi (MARIE) — trái tim của phòng lab: tự viết hợp ngữ, xem mã máy từng bit, rồi đi từng vi bước
 * nạp → giải mã → thực thi với dữ liệu chạy trên bus. Chương trình và dữ liệu nằm chung MỘT bộ nhớ (von Neumann).
 */
import { useEffect, useMemo, useState } from 'react';
import { EXAMPLES, OP_HELP, assemble, bin16, disasm, hex3, hex4, instrIndex, run, s16, type Snap, type Unit } from './engine/marie';
import { Controls, Explain, Seg, css as s, usePlayer } from '../os-lab/ui';
import { CpuFrame, cc as c, cx, tx, type Lang } from './parts';

/* ── Sơ đồ khối: CPU ⇄ bus ⇄ bộ nhớ, gói dữ liệu chạy theo vi bước ─────────────────────── */
const POS: Record<Unit, [number, number]> = {
  PC: [62, 52], IR: [62, 112], AC: [62, 172], MAR: [208, 52], MBR: [208, 112], ALU: [208, 172], CU: [135, 228],
  MEM: [452, 128], INDEV: [330, 240], OUTDEV: [440, 252], IN: [330, 240], OUT: [440, 252],
};
const BUS_X = 135, SYS_X = 330;
function routeOf(from: Unit, to: Unit): string {
  const [x1, y1] = POS[from], [x2, y2] = POS[to];
  const inCpu = (u: Unit) => !['MEM', 'INDEV', 'OUTDEV', 'IN', 'OUT'].includes(u);
  if (inCpu(from) && inCpu(to)) return `M ${x1} ${y1} L ${BUS_X} ${y1} L ${BUS_X} ${y2} L ${x2} ${y2}`;
  if (from === 'MEM') return `M ${x1} ${y1} L ${SYS_X} ${y1} L ${SYS_X} ${y2} L ${x2} ${y2}`;
  if (to === 'MEM') return `M ${x1} ${y1} L ${SYS_X} ${y1} L ${SYS_X} ${y2} L ${x2} ${y2}`;
  return `M ${x1} ${y1} L ${SYS_X} ${y1} L ${SYS_X} ${y2} L ${x2} ${y2}`;
}

function Board({ lang, S, mem }: { lang: Lang; S: Snap; mem: Uint16Array }) {
  const R = S.regs;
  const box = (u: 'PC' | 'IR' | 'AC' | 'MAR' | 'MBR', w = 110) => {
    const [x, y] = POS[u];
    const ch = S.changed.includes(u);
    const v = R[u];
    const shown = u === 'PC' || u === 'MAR' ? hex3(v) : hex4(v);
    return (
      <g key={u}>
        <rect x={x - w / 2} y={y - 20} width={w} height={40} rx={8} fill={ch ? 'var(--ol-hl)' : 'var(--ol-bg)'} stroke={ch ? '#f59e0b' : 'var(--ol-border)'} strokeWidth={ch ? 3 : 1.5} />
        <text x={x - w / 2 + 8} y={y - 5} fontSize={10} fontWeight={800} className={s.svgMuted}>{u}</text>
        <text x={x + w / 2 - 8} y={y + 12} fontSize={15} fontWeight={800} textAnchor="end" className={s.svgText}>{shown}</text>
        {u === 'AC' && <text x={x - w / 2 + 8} y={y + 12} fontSize={10} className={s.svgMuted}>{s16(v)}</text>}
      </g>
    );
  };
  const busOn = S.bus;
  const rows = [-2, -1, 0, 1, 2].map((d) => (R.MAR + d + 4096) % 4096);
  const hot = S.memWrite ?? S.memRead;
  return (
    <svg className={c.busSvg} viewBox="0 0 540 278" width="100%" role="img" aria-label={tx(lang, 'CPU, bus and memory', 'CPU, bus và bộ nhớ')}>
      <rect x={4} y={14} width={282} height={250} rx={14} fill="var(--ol-panel)" stroke="var(--ol-border)" />
      <text x={14} y={30} fontSize={11} fontWeight={800} className={s.svgMuted}>CPU</text>
      <line x1={BUS_X} y1={40} x2={BUS_X} y2={210} stroke="var(--ol-border)" strokeWidth={6} strokeLinecap="round" />
      <line x1={SYS_X} y1={40} x2={SYS_X} y2={250} stroke="var(--ol-border)" strokeWidth={8} strokeLinecap="round" />
      <line x1={263} y1={52} x2={SYS_X} y2={52} stroke="var(--ol-border)" strokeWidth={4} />
      <line x1={263} y1={112} x2={SYS_X} y2={112} stroke="var(--ol-border)" strokeWidth={4} />
      <line x1={SYS_X} y1={128} x2={390} y2={128} stroke="var(--ol-border)" strokeWidth={8} />
      <text x={SYS_X - 4} y={34} fontSize={9.5} textAnchor="middle" className={s.svgMuted}>{tx(lang, 'system bus', 'bus hệ thống')}</text>
      <text x={BUS_X + 5} y={206} fontSize={9.5} className={s.svgMuted}>{tx(lang, 'internal', 'bus trong')}</text>
      {(['PC', 'IR', 'AC', 'MAR', 'MBR'] as const).map((u) => box(u))}
      <g>
        <path d={`M ${POS.ALU[0] - 50} ${POS.ALU[1] - 20} L ${POS.ALU[0] + 50} ${POS.ALU[1] - 20} L ${POS.ALU[0] + 30} ${POS.ALU[1] + 20} L ${POS.ALU[0] - 30} ${POS.ALU[1] + 20} Z`}
          fill={busOn?.from === 'ALU' ? 'var(--ol-hl)' : 'var(--ol-panel2)'} stroke={busOn?.from === 'ALU' ? '#f59e0b' : 'var(--ol-border)'} strokeWidth={2} />
        <text x={POS.ALU[0]} y={POS.ALU[1] + 5} textAnchor="middle" fontSize={13} fontWeight={800} className={s.svgText}>ALU</text>
      </g>
      <g>
        <rect x={POS.CU[0] - 70} y={POS.CU[1] - 16} width={140} height={30} rx={8} fill={S.phase === 'decode' ? 'var(--ol-hl)' : 'var(--ol-panel2)'} stroke="var(--ol-border)" />
        <text x={POS.CU[0]} y={POS.CU[1] + 4} textAnchor="middle" fontSize={10.5} fontWeight={800} className={s.svgText}>{tx(lang, 'Control unit', 'Khối điều khiển')}: {S.phase === 'start' ? '—' : disasm(R.IR).split(' ')[0]}</text>
      </g>
      {/* bộ nhớ */}
      <rect x={390} y={14} width={146} height={210} rx={12} fill="var(--ol-panel)" stroke="var(--ol-border)" />
      <text x={400} y={30} fontSize={11} fontWeight={800} className={s.svgMuted}>{tx(lang, 'MEMORY 4096×16', 'BỘ NHỚ 4096×16')}</text>
      {rows.map((a, k) => {
        const y = 48 + k * 34;
        const isHot = hot === a && (S.memRead !== undefined || S.memWrite !== undefined);
        return (
          <g key={k}>
            <rect x={398} y={y} width={130} height={28} rx={6} fill={isHot ? (S.memWrite !== undefined ? 'var(--ol-bad-bg)' : 'var(--ol-ok-bg)') : a === R.MAR ? 'var(--ol-accent-bg)' : 'var(--ol-bg)'} stroke={a === R.MAR ? 'var(--ol-accent)' : 'var(--ol-border)'} />
            <text x={404} y={y + 18} fontSize={11} className={s.svgMuted}>{hex3(a)}</text>
            <text x={522} y={y + 18} fontSize={13} fontWeight={800} textAnchor="end" className={s.svgText}>{hex4(mem[a])}</text>
          </g>
        );
      })}
      <text x={398} y={238} fontSize={9.5} className={s.svgMuted}>{tx(lang, 'blue = cell addressed by MAR', 'xanh = ô MAR đang trỏ')}</text>
      <rect x={300} y={246} width={68} height={24} rx={6} fill={busOn?.from === 'INDEV' ? 'var(--ol-hl)' : 'var(--ol-panel2)'} stroke="var(--ol-border)" />
      <text x={334} y={262} fontSize={10.5} textAnchor="middle" fontWeight={800} className={s.svgText}>Input {R.IN ? s16(R.IN) : ''}</text>
      <rect x={400} y={246} width={80} height={24} rx={6} fill={busOn?.to === 'OUTDEV' ? 'var(--ol-hl)' : 'var(--ol-panel2)'} stroke="var(--ol-border)" />
      <text x={440} y={262} fontSize={10.5} textAnchor="middle" fontWeight={800} className={s.svgText}>Output {S.output.length ? s16(S.output[S.output.length - 1]) : ''}</text>
      {busOn && (
        <g key={`${busOn.from}-${busOn.to}-${S.memVer}-${S.done}-${S.rtn}`}>
          <path d={routeOf(busOn.from, busOn.to)} fill="none" stroke={busOn.kind === 'addr' ? '#2563eb' : '#059669'} strokeWidth={3} strokeDasharray="6 4" opacity={0.8} />
          <g>
            <rect x={-26} y={-10} width={52} height={20} rx={10} fill={busOn.kind === 'addr' ? '#2563eb' : '#059669'} />
            <text x={0} y={4} fontSize={10.5} fontWeight={800} textAnchor="middle" fill="#fff">{busOn.kind === 'addr' ? hex3(busOn.value) : hex4(busOn.value)}</text>
            <animateMotion dur="0.7s" fill="freeze" path={routeOf(busOn.from, busOn.to)} />
          </g>
        </g>
      )}
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

  return (
    <CpuFrame lang={lang} title={tx(lang, 'Toy CPU — a von Neumann machine (MARIE)', 'CPU đồ chơi — cỗ máy von Neumann (MARIE)')} sub={tx(lang, 'Write a program, see its machine code, watch every step', 'Viết chương trình, xem mã máy, nhìn từng bước')}>
      <div className={s.bar}>
        <span className={s.lbl}>{tx(lang, 'Program', 'Chương trình')}
          <select value={ex} onChange={(e) => pick(e.target.value)}>
            {Object.entries(EXAMPLES).map(([k, v]) => <option key={k} value={k}>{tx(lang, v.en, v.vi)}</option>)}
          </select></span>
        <span className={s.lbl}>Input <input type="text" value={inputs} onChange={(e) => setInputs(e.target.value)} placeholder="12, 30" style={{ width: 110 }} /></span>
        <Seg value={mode} options={[['micro', tx(lang, 'micro-steps', 'vi bước')], ['instr', tx(lang, 'whole instructions', 'từng lệnh')]]} onChange={(m) => { setMode(m); p.reset(); }} />
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
          <textarea className={c.editor} value={src} spellCheck={false} onChange={(e) => setSrc(e.target.value)} aria-label={tx(lang, 'assembly source', 'mã hợp ngữ')} rows={Math.min(18, Math.max(9, src.split('\n').length))} />
          {!prog.ok && (
            <Explain tone="bad">{prog.errors.slice(0, 6).map((e, k) => <div key={k}>{tx(lang, 'Line', 'Dòng')} {e.line}: {tx(lang, e.en, e.vi)}</div>)}</Explain>
          )}
          <div>
            <div className={s.panelTitle}>{tx(lang, 'Assembled: address · machine code · bits (opcode | address) · source', 'Đã hợp dịch: địa chỉ · mã máy · bit (mã lệnh | địa chỉ) · nguồn')}</div>
            <div className={c.listing}>
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
                extra={<button type="button" className={s.btn} onClick={() => { p.setPlaying(false); p.setI(idx.length - 1); }} disabled={p.atEnd}>⏭ {tx(lang, 'End', 'Cuối')}</button>} />
              <div className={s.bar} style={{ margin: 0 }}>
                <span className={cx(c.phase, c[S.phase])}>{S.phase === 'start' ? tx(lang, 'power on', 'bật máy') : S.phase === 'fetch' ? tx(lang, 'fetch', 'nạp lệnh') : S.phase === 'decode' ? tx(lang, 'decode', 'giải mã') : S.phase === 'execute' ? tx(lang, 'execute', 'thực thi') : S.phase === 'halt' ? 'halt' : tx(lang, 'stopped', 'dừng')}</span>
                <b className={s.mono}>{S.rtn}</b>
                {S.phase !== 'start' && <span className={s.small}>{tx(lang, 'running', 'đang chạy')}: {hex3(S.at)} {disasm(mem[S.at] ?? 0)}</span>}
              </div>
              <Explain tone={tone}>{tx(lang, S.en, S.vi)}</Explain>
              <div className={s.svgWrap}><Board lang={lang} S={S} mem={mem} /></div>
              <div>
                <div className={s.panelTitle}>Output</div>
                <div className={c.out}>{S.output.length ? S.output.map((v) => s16(v)).join('  ') : <span style={{ opacity: 0.5 }}>—</span>}</div>
              </div>
            </>
          ) : <Explain tone="bad">{tx(lang, 'Fix the errors on the left to load the program.', 'Sửa lỗi bên trái để nạp chương trình.')}</Explain>}
        </div>
      </div>
      <div className={s.grid2} style={{ marginTop: 10 }}>
        <div className={s.panel}>
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
        <div className={s.panel}>
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
